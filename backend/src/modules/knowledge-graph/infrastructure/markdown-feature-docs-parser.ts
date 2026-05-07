import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

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

const PRODUCES_FOR_EDGE_LABEL = "produces-for";
const CROSS_FEATURE_DEPENDENCIES_ANCHOR = "cross-feature-dependencies";
const PRODUCES_FOR_ANCHOR = "produces-for";

interface TableRowsResult {
  readonly headers: string[];
  readonly rows: string[][];
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.DocumentToConceptMapping
 *     type: Mapping
 *   edges:
 *     - edge: maps
 *       to: knowledge-graph-visualization.FeatureDocument
 *     - edge: maps
 *       to: knowledge-graph-visualization.ConceptDefinition
 */
export function createMarkdownFeatureDocsParser(): FeatureDocsParserPort {
  return {
    async scanFeatureFiles(
      input: ScanFeatureFilesInput,
    ): Promise<ParsedSourceDocument[]> {
      const normalizedSourceFiles = normalizeSourceFiles(input.sourceFiles);
      const featureDir = resolve(
        input.scope.featureDocsRootDir,
        input.scope.featureId,
      );

      if (!isPathWithin(input.scope.workspaceRootDir, featureDir)) {
        throw createKnowledgeGraphError(
          "MIRROR_SOURCE_ROOT_INVALID",
          "Resolved feature directory escapes workspace root",
          {
            projectKey: input.scope.projectKey,
            featureId: input.scope.featureId,
            featureDocsRootDir: input.scope.featureDocsRootDir,
            featureDir,
          },
        );
      }

      return normalizedSourceFiles
        .map((filePath) => {
          const absolutePath = resolve(featureDir, filePath);

          if (!isPathWithin(featureDir, absolutePath)) {
            throw createKnowledgeGraphError(
              "MIRROR_SOURCE_ROOT_INVALID",
              "Resolved source file escapes feature root",
              {
                projectKey: input.scope.projectKey,
                featureId: input.scope.featureId,
                sourceFile: filePath,
                absolutePath,
              },
            );
          }

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
      const crossFeatureDependenciesSection = getSectionContent(
        input.specContent,
        "Cross-Feature Dependencies",
      );
      const producesForSection = getSectionContent(
        input.specContent,
        "Produces For",
      );

      if (conceptsSection.length === 0 || graphSection.length === 0) {
        throw createKnowledgeGraphError(
          "MIRROR_SPEC_PARSE_FAILED",
          "SPEC missing concepts or feature concept graph section",
          {
            projectKey: input.scope.projectKey,
            featureId: input.scope.featureId,
          },
        );
      }

      if (
        crossFeatureDependenciesSection.length === 0 ||
        producesForSection.length === 0
      ) {
        throw createKnowledgeGraphError(
          "MIRROR_RELATIONSHIP_INDEX_INVALID",
          "SPEC relationship index is incomplete",
          {
            projectKey: input.scope.projectKey,
            featureId: input.scope.featureId,
            missingSections: [
              crossFeatureDependenciesSection.length === 0
                ? "Cross-Feature Dependencies"
                : null,
              producesForSection.length === 0 ? "Produces For" : null,
            ].filter((value): value is string => value !== null),
          },
        );
      }

      const conceptMap = new Map<string, ConceptDefinition>();
      for (const concept of parseConceptRows(conceptsSection)) {
        addConceptIfMissing(conceptMap, concept);
      }

      const featureScopeConceptId = `feature.${input.scope.featureId}`;
      addConceptIfMissing(
        conceptMap,
        createSyntheticConcept({
          conceptId: featureScopeConceptId,
          name: input.scope.featureId,
          taxonomyType: "Feature",
          summary: `Projection scope feature ${input.scope.featureId}`,
          sourceAnchor: CROSS_FEATURE_DEPENDENCIES_ANCHOR,
        }),
      );

      const featureConceptGraphEdges = parseGraphRows(graphSection);
      const crossFeatureDependencies = parseCrossFeatureDependencyRows({
        sectionLines: crossFeatureDependenciesSection,
        sourceFeatureConceptId: featureScopeConceptId,
      });
      const producesForRelations = parseProducesForRows({
        sectionLines: producesForSection,
        sourceFeatureConceptId: featureScopeConceptId,
        sourceFeatureId: input.scope.featureId,
      });

      for (const concept of crossFeatureDependencies.concepts) {
        addConceptIfMissing(conceptMap, concept);
      }
      for (const concept of producesForRelations.concepts) {
        addConceptIfMissing(conceptMap, concept);
      }

      const edges = deduplicateEdges([
        ...featureConceptGraphEdges,
        ...crossFeatureDependencies.edges,
        ...producesForRelations.edges,
      ]).sort(compareRelationshipEdges);

      if (edges.length === 0) {
        throw createKnowledgeGraphError(
          "MIRROR_RELATIONSHIP_INDEX_INVALID",
          "SPEC relationship index does not produce any canonical edges",
          {
            projectKey: input.scope.projectKey,
            featureId: input.scope.featureId,
          },
        );
      }

      return {
        concepts: Array.from(conceptMap.values()).sort(
          compareConceptDefinitions,
        ),
        edges,
      };
    },
  };
}

function normalizeSourceFiles(sourceFiles: string[]): string[] {
  const deduplicated = new Set<string>();

  for (const sourceFile of sourceFiles) {
    const normalized = normalizeFilePath(sourceFile);
    if (normalized.length === 0) {
      throw createKnowledgeGraphError(
        "MIRROR_REBUILD_INPUT_INVALID",
        "sourceFiles contains invalid path",
        { sourceFile },
      );
    }

    const candidateAbsolutePath = resolve("/", normalized);
    if (
      normalized.includes("..") ||
      !isPathWithin("/", candidateAbsolutePath)
    ) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_ROOT_INVALID",
        "sourceFiles contains path escape",
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
    const fromConceptId = extractConceptId(row[fromIndex] ?? "");
    const edge = normalizeEdgeLabel(row[edgeIndex] ?? "");
    const toConceptId = extractConceptId(row[toIndex] ?? "");

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

function parseCrossFeatureDependencyRows(input: {
  sectionLines: string[];
  sourceFeatureConceptId: string;
}): {
  concepts: ConceptDefinition[];
  edges: RelationshipEdge[];
} {
  const table = parseMarkdownTable(input.sectionLines);
  if (table.rows.length === 0) {
    return { concepts: [], edges: [] };
  }

  const dependsOnIndex = indexForHeader(table.headers, "Depends On");
  const relationshipIndex = indexForHeader(table.headers, "Relationship");
  const whyIndex = indexForHeader(table.headers, "Why");

  const concepts: ConceptDefinition[] = [];
  const edges: RelationshipEdge[] = [];

  for (const row of table.rows) {
    const dependency = parseDependentFeatureCell(row[dependsOnIndex] ?? "");
    const edge = normalizeEdgeLabel(row[relationshipIndex] ?? "");

    if (dependency.featureId.length === 0 || edge.length === 0) {
      continue;
    }

    const dependencyConceptId = `feature.${dependency.featureId}`;
    concepts.push(
      createSyntheticConcept({
        conceptId: dependencyConceptId,
        name: dependency.label,
        taxonomyType: "Feature",
        summary:
          row[whyIndex] ??
          `Cross-feature dependency on ${dependency.featureId}`,
        sourceAnchor: CROSS_FEATURE_DEPENDENCIES_ANCHOR,
      }),
    );

    edges.push({
      fromConceptId: input.sourceFeatureConceptId,
      edge,
      toConceptId: dependencyConceptId,
      evidence:
        dependency.evidence.length > 0
          ? `[Cross-Feature Dependency](${dependency.evidence})`
          : `[Cross-Feature Dependencies](SPEC.md#${CROSS_FEATURE_DEPENDENCIES_ANCHOR})`,
      notes: row[whyIndex] ?? "",
    });
  }

  return {
    concepts,
    edges,
  };
}

function parseProducesForRows(input: {
  sectionLines: string[];
  sourceFeatureConceptId: string;
  sourceFeatureId: string;
}): {
  concepts: ConceptDefinition[];
  edges: RelationshipEdge[];
} {
  const table = parseMarkdownTable(input.sectionLines);
  if (table.rows.length === 0) {
    return { concepts: [], edges: [] };
  }

  const consumerIndex = indexForHeader(table.headers, "Consumer");
  const viaIndex = indexForHeader(table.headers, "Via");
  const whatIndex = indexForHeader(table.headers, "What");

  const concepts: ConceptDefinition[] = [];
  const edges: RelationshipEdge[] = [];

  for (const row of table.rows) {
    const consumer = parseMarkdownLink(row[consumerIndex] ?? "");
    const consumerLabel =
      consumer.label || stripInlineSyntax(row[consumerIndex] ?? "");
    const consumerSlug = slugify(consumerLabel);

    if (consumerSlug.length === 0) {
      continue;
    }

    const consumerConceptId = `consumer.${input.sourceFeatureId}.${consumerSlug}`;
    const via = stripInlineSyntax(row[viaIndex] ?? "");
    const deliveredValue = row[whatIndex] ?? "";

    concepts.push(
      createSyntheticConcept({
        conceptId: consumerConceptId,
        name: consumerLabel,
        taxonomyType: "Consumer",
        summary:
          deliveredValue.length > 0
            ? deliveredValue
            : `Consumer of ${input.sourceFeatureId}`,
        sourceAnchor: PRODUCES_FOR_ANCHOR,
      }),
    );

    edges.push({
      fromConceptId: input.sourceFeatureConceptId,
      edge: PRODUCES_FOR_EDGE_LABEL,
      toConceptId: consumerConceptId,
      evidence: `[Produces For](SPEC.md#${PRODUCES_FOR_ANCHOR})`,
      notes:
        via.length > 0
          ? `via=${via}${deliveredValue ? `; ${deliveredValue}` : ""}`
          : deliveredValue,
    });
  }

  return {
    concepts,
    edges,
  };
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

function parseDependentFeatureCell(cell: string): {
  featureId: string;
  label: string;
  evidence: string;
} {
  const link = parseMarkdownLink(cell);

  if (link.filePath.length > 0) {
    const normalizedPath = normalizeFilePath(link.filePath);
    const segments = normalizedPath
      .split("/")
      .filter((segment) => segment.length > 0);
    const featureId =
      segments.length >= 2 &&
      (segments.at(-1) ?? "").toLowerCase() === "spec.md"
        ? (segments.at(-2) ?? "")
        : slugify(link.label || normalizedPath);

    return {
      featureId,
      label: link.label || featureId,
      evidence:
        normalizedPath.length > 0
          ? `${normalizedPath}${link.anchor ? `#${link.anchor}` : ""}`
          : "",
    };
  }

  const label = stripInlineSyntax(cell);
  const featureId = slugify(label);
  return {
    featureId,
    label: label || featureId,
    evidence: "",
  };
}

function extractConceptId(cell: string): string {
  const markdownLink = parseMarkdownLink(cell);
  const candidate = markdownLink.label || stripInlineSyntax(cell);
  return candidate.trim();
}

function normalizeEdgeLabel(rawEdge: string): string {
  const normalized = stripInlineSyntax(rawEdge).toLowerCase();
  if (normalized.length === 0) {
    return "";
  }

  const compact = normalized.replace(/\s+/g, "-");

  if (compact === "query") {
    return "queries";
  }

  if (compact === "interface") {
    return "exposes";
  }

  if (compact === "produces-for" || compact === "producesfor") {
    return "produces-for";
  }

  return compact;
}

function stripInlineSyntax(value: string): string {
  return value
    .replace(/`/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function createSyntheticConcept(input: {
  conceptId: string;
  name: string;
  taxonomyType: string;
  summary: string;
  sourceAnchor: string;
}): ConceptDefinition {
  return {
    conceptId: input.conceptId,
    name: input.name,
    taxonomyType: input.taxonomyType,
    summary: input.summary,
    sourceFilePath: "SPEC.md",
    sourceAnchor: input.sourceAnchor,
    definitionPointer: {
      filePath: "SPEC.md",
      anchor: input.sourceAnchor,
      lineHint: 0,
      label: input.name,
    },
  };
}

function addConceptIfMissing(
  conceptMap: Map<string, ConceptDefinition>,
  concept: ConceptDefinition,
): void {
  if (!conceptMap.has(concept.conceptId)) {
    conceptMap.set(concept.conceptId, concept);
  }
}

function deduplicateEdges(edges: RelationshipEdge[]): RelationshipEdge[] {
  const byKey = new Map<string, RelationshipEdge>();

  for (const edge of edges) {
    const key = `${edge.fromConceptId}|${edge.edge}|${edge.toConceptId}|${edge.evidence}`;
    if (!byKey.has(key)) {
      byKey.set(key, edge);
    }
  }

  return Array.from(byKey.values());
}

function isPathWithin(basePath: string, targetPath: string): boolean {
  const relativePath = relative(basePath, targetPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
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
