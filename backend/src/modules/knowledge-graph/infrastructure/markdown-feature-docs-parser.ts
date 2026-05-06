import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type {
  FeatureDocsParserPort,
  ParseSpecInput,
  ParseSpecOutput,
  ScanFeatureFilesInput,
} from "../application/ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import {
  buildChecksum,
  compareFilePathsByMirrorOrder,
  compareConceptDefinitions,
  compareRelationshipEdges,
  inferAspectKind,
  normalizeFilePath,
} from "../domain/models.js";
import type {
  ConceptDefinition,
  ParsedSourceDocument,
  RelationshipEdge,
} from "../domain/models.js";

interface MarkdownFeatureDocsParserConfig {
  readonly featuresRootDir: string;
}

interface TableRowsResult {
  readonly headers: string[];
  readonly rows: string[][];
}

export function createMarkdownFeatureDocsParser(
  config: MarkdownFeatureDocsParserConfig,
): FeatureDocsParserPort {
  const featuresRootDir = config.featuresRootDir;

  return {
    async scanFeatureFiles(
      input: ScanFeatureFilesInput,
    ): Promise<ParsedSourceDocument[]> {
      const normalizedSourceFiles = normalizeSourceFiles(input.sourceFiles);

      return normalizedSourceFiles
        .map((filePath) => {
          const absolutePath = resolve(
            featuresRootDir,
            input.featureId,
            filePath,
          );
          const exists = existsSync(absolutePath);
          const content = exists ? readFileSync(absolutePath, "utf8") : null;

          return {
            filePath,
            absolutePath,
            exists,
            content,
            checksum: content ? buildChecksum(content) : "",
            updatedAt: input.indexedAt,
            aspectKind: inferAspectKind(filePath),
          };
        })
        .sort((left, right) =>
          compareFilePathsByMirrorOrder(left.filePath, right.filePath),
        );
    },

    parseSpec(input: ParseSpecInput): ParseSpecOutput {
      const conceptsSection = getSectionContent(input.specContent, "Concepts");
      const graphSection = getSectionContent(
        input.specContent,
        "Feature Concept Graph",
      );

      if (conceptsSection.length === 0 || graphSection.length === 0) {
        throw createKnowledgeGraphError(
          "MIRROR_SPEC_PARSE_FAILED",
          "SPEC missing concepts or feature concept graph section",
          { featureId: input.featureId },
        );
      }

      const concepts = parseConceptRows(conceptsSection);
      const edges = parseGraphRows(graphSection);

      return {
        concepts: concepts.sort(compareConceptDefinitions),
        edges: edges.sort(compareRelationshipEdges),
      };
    },
  };
}

function normalizeSourceFiles(sourceFiles: string[]): string[] {
  const deduplicated = new Set<string>();

  for (const sourceFile of sourceFiles) {
    const normalized = normalizeFilePath(sourceFile);
    if (normalized.length === 0 || normalized.includes("..")) {
      throw createKnowledgeGraphError(
        "MIRROR_REBUILD_INPUT_INVALID",
        "sourceFiles contains invalid path",
        { sourceFile },
      );
    }
    deduplicated.add(normalized);
  }

  return Array.from(deduplicated).sort(compareFilePathsByMirrorOrder);
}

function getSectionContent(markdown: string, heading: string): string[] {
  const lines = markdown.split(/\r?\n/);
  const headingPattern = new RegExp(`^##\\s+${escapeRegex(heading)}\\s*$`, "i");
  let startIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    if (headingPattern.test(lines[index] ?? "")) {
      startIndex = index + 1;
      break;
    }
  }

  if (startIndex === -1) {
    return [];
  }

  const sectionLines: string[] = [];
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (/^##\s+/.test(line)) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines;
}

function parseConceptRows(sectionLines: string[]): ConceptDefinition[] {
  const table = parseMarkdownTable(sectionLines);

  if (table.rows.length === 0) {
    throw createKnowledgeGraphError(
      "MIRROR_SPEC_PARSE_FAILED",
      "Concepts table is empty",
    );
  }

  const conceptIndex = indexForHeader(table.headers, "Concept");
  const idIndex = indexForHeader(table.headers, "ID");
  const typeIndex = indexForHeader(table.headers, "Type");
  const descriptionIndex = indexForHeader(table.headers, "Description");

  const concepts: ConceptDefinition[] = [];

  for (const row of table.rows) {
    const conceptId = row[idIndex] ?? "";
    if (conceptId.length === 0) {
      continue;
    }

    const conceptCell = row[conceptIndex] ?? "";
    const { label, filePath, anchor } = parseMarkdownLink(conceptCell);
    const name = label || conceptId.split(".").at(-1) || conceptId;
    const sourceFilePath = normalizeFilePath(filePath || "SPEC.md");
    const sourceAnchor = anchor || toAnchor(name);
    const taxonomyType = row[typeIndex] ?? "Unknown";
    const summary = row[descriptionIndex] || "No summary provided";

    concepts.push({
      conceptId,
      name,
      taxonomyType,
      summary,
      sourceFilePath,
      sourceAnchor,
      definitionPointer: {
        filePath: sourceFilePath,
        anchor: sourceAnchor,
        lineHint: 0,
        label: name,
      },
    });
  }

  return concepts;
}

function parseGraphRows(sectionLines: string[]): RelationshipEdge[] {
  const table = parseMarkdownTable(sectionLines);

  if (table.rows.length === 0) {
    throw createKnowledgeGraphError(
      "MIRROR_SPEC_PARSE_FAILED",
      "Feature Concept Graph table is empty",
    );
  }

  const fromIndex = indexForHeader(table.headers, "From");
  const edgeIndex = indexForHeader(table.headers, "Edge");
  const toIndex = indexForHeader(table.headers, "To");
  const evidenceIndex = indexForHeader(table.headers, "Evidence");
  const notesIndex = indexForHeader(table.headers, "Notes");

  const edges: RelationshipEdge[] = [];

  for (const row of table.rows) {
    const fromConceptId = row[fromIndex] ?? "";
    const edge = row[edgeIndex] ?? "";
    const toConceptId = row[toIndex] ?? "";

    if (
      fromConceptId.length === 0 ||
      edge.length === 0 ||
      toConceptId.length === 0
    ) {
      continue;
    }

    edges.push({
      fromConceptId,
      edge,
      toConceptId,
      evidence: row[evidenceIndex] ?? "",
      notes: row[notesIndex] ?? "",
    });
  }

  return edges;
}

function parseMarkdownTable(lines: string[]): TableRowsResult {
  const tableLines: string[] = [];
  let tableStarted = false;

  for (const line of lines) {
    if (/^\|/.test(line.trim())) {
      tableStarted = true;
      tableLines.push(line);
      continue;
    }

    if (tableStarted && line.trim().length === 0) {
      continue;
    }

    if (tableStarted) {
      break;
    }
  }

  if (tableLines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parsedRows = tableLines
    .map(parseRowCells)
    .filter((cells) => cells.length > 0)
    .filter((cells) => !isSeparatorRow(cells));

  if (parsedRows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parsedRows[0] ?? [];
  const rows = parsedRows.slice(1);
  return { headers, rows };
}

function parseRowCells(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) {
    return [];
  }

  const withoutOuterPipes = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return withoutOuterPipes.split("|").map((cell) => cell.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function indexForHeader(headers: string[], headerName: string): number {
  const lowerCaseHeader = headerName.toLowerCase();
  const directIndex = headers.findIndex((header) =>
    header.toLowerCase().includes(lowerCaseHeader),
  );

  return directIndex >= 0 ? directIndex : 0;
}

function parseMarkdownLink(cell: string): {
  label: string;
  filePath: string;
  anchor: string;
} {
  const markdownLinkMatch = cell.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!markdownLinkMatch) {
    return { label: cell.trim(), filePath: "", anchor: "" };
  }

  const [, label, target = ""] = markdownLinkMatch;
  const [rawPath, rawAnchor] = target.split("#", 2);

  return {
    label: (label ?? "").trim(),
    filePath: (rawPath ?? "").trim(),
    anchor: (rawAnchor ?? "").trim(),
  };
}

function toAnchor(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
