#!/usr/bin/env tsx

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join, relative } from "node:path";

type Concept = {
  id: string;
  name: string;
  feature: string;
  type: string;
  description: string;
  specPath: string;
  codeAnchors: CodeAnchor[];
  coverage: {
    specified: boolean;
    implemented: boolean;
  };
};

type CodeAnchor = {
  conceptId: string;
  symbol: string;
  file: string;
  line: number;
  taxonomyType: string;
  prefix: "biz" | "sys";
};

type RawEdge = {
  from: string;
  edge: string;
  to: string;
  evidence: string | null;
  notes: string | null;
  feature: string;
  specPath: string;
  line: number;
};

type RegistryEdge = {
  from: string;
  edge: string;
  to: string;
  evidence: string | null;
  notes: string | null;
  feature: string;
  specPath: string;
  line: number;
};

type EdgeIssue = {
  kind: "unknown-edge-label" | "missing-endpoint" | "duplicate-edge";
  specPath: string;
  line: number;
  from: string;
  edge: string;
  to: string;
  detail: string;
};

type TableRow = {
  cells: string[];
  line: number;
};

type MarkdownTable = {
  headers: string[];
  rows: TableRow[];
};

type ParsedSpec = {
  concepts: Concept[];
  edges: RawEdge[];
};

const args = process.argv.slice(2);
const outputPath = resolve(
  process.cwd(),
  getArg("--output") || "docs/registry.json",
);
const relationshipsPath = resolve(
  process.cwd(),
  getArg("--relationships") || "RELATIONSHIPS.md",
);

const canonicalEdges = parseCanonicalEdges(relationshipsPath);

const specs = findSpecFiles(resolve(process.cwd(), "docs/features"));
const parsedSpecs = specs.map((specPath) => parseSpec(specPath));
const concepts = dedupeConcepts(parsedSpecs.flatMap((entry) => entry.concepts));
const rawEdges = parsedSpecs.flatMap((entry) => entry.edges);
const anchors = scanCodeAnchors([
  resolve(process.cwd(), "backend/src"),
  resolve(process.cwd(), "apps/web/src"),
]);

const conceptMap = new Map(concepts.map((c) => [c.id, c]));
for (const anchor of anchors) {
  const concept = conceptMap.get(anchor.conceptId);
  if (concept) concept.codeAnchors.push(anchor);
}

for (const concept of concepts) {
  concept.coverage.implemented = concept.codeAnchors.length > 0;
}

const undefinedAnchors = anchors.filter((a) => !conceptMap.has(a.conceptId));
const unanchoredConcepts = concepts.filter((c) => c.codeAnchors.length === 0);

const edgeValidation = validateEdges(
  rawEdges,
  new Set(concepts.map((c) => c.id)),
  canonicalEdges,
);
const edges = buildRegistryEdges(rawEdges, edgeValidation);

const registry = {
  meta: {
    generatedAt: new Date().toISOString(),
    sourceOfTruth: "docs/features/**/SPEC.md",
    edgeSource: "docs/features/**/SPEC.md#feature-concept-graph",
    domainspecVersion: getDomainspecVersion(),
  },
  concepts,
  edges,
  validation: {
    unknownEdgeLabels: edgeValidation.issues.filter(
      (issue) => issue.kind === "unknown-edge-label",
    ),
    missingEndpoints: edgeValidation.issues.filter(
      (issue) => issue.kind === "missing-endpoint",
    ),
    duplicateEdges: edgeValidation.issues.filter(
      (issue) => issue.kind === "duplicate-edge",
    ),
  },
  orphans: {
    unanchoredConcepts: unanchoredConcepts.map((c) => ({
      conceptId: c.id,
      feature: c.feature,
      specPath: c.specPath,
    })),
    undefinedAnchors,
  },
  stats: {
    concepts: concepts.length,
    anchors: anchors.length,
    edges: edges.length,
    rawEdges: rawEdges.length,
    unknownEdgeLabels: edgeValidation.issues.filter(
      (issue) => issue.kind === "unknown-edge-label",
    ).length,
    missingEdgeEndpoints: edgeValidation.issues.filter(
      (issue) => issue.kind === "missing-endpoint",
    ).length,
    duplicateEdges: edgeValidation.issues.filter(
      (issue) => issue.kind === "duplicate-edge",
    ).length,
    unanchoredConcepts: unanchoredConcepts.length,
    undefinedAnchors: undefinedAnchors.length,
  },
};

writeFileSync(outputPath, JSON.stringify(registry, null, 2) + "\n", "utf-8");
console.log(
  `Registry generated: ${toRelative(outputPath)} | concepts=${registry.stats.concepts} edges=${registry.stats.edges}/${registry.stats.rawEdges} anchors=${registry.stats.anchors} unknownEdgeLabels=${registry.stats.unknownEdgeLabels} missingEdgeEndpoints=${registry.stats.missingEdgeEndpoints} duplicateEdges=${registry.stats.duplicateEdges} unanchored=${registry.stats.unanchoredConcepts} undefinedAnchors=${registry.stats.undefinedAnchors}`,
);

function parseSpec(specPath: string): ParsedSpec {
  const raw = readFileSync(specPath, "utf-8");
  const feature = parseFeatureId(raw) || featureFromPath(specPath);
  const lines = raw.split(/\r?\n/);

  const concepts = parseConceptsFromSpec(lines, feature, specPath);
  const edges = parseFeatureConceptGraph(lines, feature, specPath);

  return { concepts, edges };
}

function parseConceptsFromSpec(
  lines: string[],
  feature: string,
  specPath: string,
): Concept[] {
  const sectionPriority = ["Concept Registry", "Concepts", "Domain Concepts"];

  let table: MarkdownTable | null = null;
  for (const sectionName of sectionPriority) {
    table = parseTableForSection(lines, sectionName);
    if (table) {
      break;
    }
  }

  if (!table) {
    return [];
  }

  const headerMap = toHeaderMap(table.headers);
  const idIndex = headerMap.get("id");
  const typeIndex = headerMap.get("type");

  if (idIndex === undefined || typeIndex === undefined) {
    return [];
  }

  const conceptIndex = headerMap.get("concept") ?? 0;
  const descriptionIndex = headerMap.get("description");

  const concepts: Concept[] = [];
  for (const row of table.rows) {
    const id = (row.cells[idIndex] || "").trim();
    const type = (row.cells[typeIndex] || "").trim();

    if (!id || !type) {
      continue;
    }

    if (id.includes("{") && id.includes("}")) {
      continue;
    }

    const conceptCell = row.cells[conceptIndex] || "";
    const description =
      descriptionIndex !== undefined ? row.cells[descriptionIndex] || "" : "";

    concepts.push({
      id,
      name: extractMarkdownLabel(conceptCell),
      feature,
      type,
      description,
      specPath: toRelative(specPath),
      codeAnchors: [],
      coverage: {
        specified: true,
        implemented: false,
      },
    });
  }

  return concepts;
}

function parseFeatureConceptGraph(
  lines: string[],
  feature: string,
  specPath: string,
): RawEdge[] {
  const table = parseTableForSection(lines, "Feature Concept Graph");
  if (!table) {
    return [];
  }

  const headerMap = toHeaderMap(table.headers);
  const fromIndex = headerMap.get("from");
  const edgeIndex = headerMap.get("edge");
  const toIndex = headerMap.get("to");
  const evidenceIndex = headerMap.get("evidence");
  const notesIndex = headerMap.get("notes");

  if (
    fromIndex === undefined ||
    edgeIndex === undefined ||
    toIndex === undefined
  ) {
    return [];
  }

  const rawEdges: RawEdge[] = [];
  for (const row of table.rows) {
    const from = (row.cells[fromIndex] || "").trim();
    const edge = (row.cells[edgeIndex] || "").trim();
    const to = (row.cells[toIndex] || "").trim();

    if (!from || !edge || !to) {
      continue;
    }

    if (
      (from.includes("{") && from.includes("}")) ||
      (edge.includes("{") && edge.includes("}")) ||
      (to.includes("{") && to.includes("}"))
    ) {
      continue;
    }

    const evidence =
      evidenceIndex !== undefined
        ? (row.cells[evidenceIndex] || "").trim()
        : "";
    const notes =
      notesIndex !== undefined ? (row.cells[notesIndex] || "").trim() : "";

    rawEdges.push({
      from,
      edge,
      to,
      evidence: evidence || null,
      notes: notes || null,
      feature,
      specPath: toRelative(specPath),
      line: row.line,
    });
  }

  return rawEdges;
}

function dedupeConcepts(concepts: Concept[]): Concept[] {
  const unique = new Map<string, Concept>();

  for (const concept of concepts) {
    if (!unique.has(concept.id)) {
      unique.set(concept.id, concept);
    }
  }

  return [...unique.values()];
}

function parseCanonicalEdges(pathToRelationships: string): Set<string> {
  if (!existsSync(pathToRelationships)) {
    return new Set();
  }

  const raw = readFileSync(pathToRelationships, "utf-8");
  const edges = new Set<string>();
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\|\s*`([a-z-]+)`\s*\|/.exec(line.trim());
    if (match?.[1]) {
      edges.add(match[1]);
    }
  }

  return edges;
}

function validateEdges(
  edges: RawEdge[],
  conceptIds: Set<string>,
  canonicalEdges: Set<string>,
): { issues: EdgeIssue[]; duplicateEdgeKeys: Set<string> } {
  const issues: EdgeIssue[] = [];

  for (const edge of edges) {
    if (!canonicalEdges.has(edge.edge)) {
      issues.push({
        kind: "unknown-edge-label",
        specPath: edge.specPath,
        line: edge.line,
        from: edge.from,
        edge: edge.edge,
        to: edge.to,
        detail: `Edge \"${edge.edge}\" is not part of RELATIONSHIPS.md canonical vocabulary`,
      });
    }

    if (!conceptIds.has(edge.from)) {
      issues.push({
        kind: "missing-endpoint",
        specPath: edge.specPath,
        line: edge.line,
        from: edge.from,
        edge: edge.edge,
        to: edge.to,
        detail: `From endpoint \"${edge.from}\" is not defined in any feature SPEC concept table`,
      });
    }

    if (!conceptIds.has(edge.to)) {
      issues.push({
        kind: "missing-endpoint",
        specPath: edge.specPath,
        line: edge.line,
        from: edge.from,
        edge: edge.edge,
        to: edge.to,
        detail: `To endpoint \"${edge.to}\" is not defined in any feature SPEC concept table`,
      });
    }
  }

  const occurrences = new Map<string, RawEdge[]>();
  for (const edge of edges) {
    const key = `${edge.from}|${edge.edge}|${edge.to}`;
    const list = occurrences.get(key);
    if (!list) {
      occurrences.set(key, [edge]);
    } else {
      list.push(edge);
    }
  }

  const duplicateEdgeKeys = new Set<string>();
  for (const [key, entries] of occurrences.entries()) {
    if (entries.length <= 1) {
      continue;
    }

    duplicateEdgeKeys.add(key);
    for (const edge of entries) {
      issues.push({
        kind: "duplicate-edge",
        specPath: edge.specPath,
        line: edge.line,
        from: edge.from,
        edge: edge.edge,
        to: edge.to,
        detail: `Duplicate relationship key \"${key}\" appears ${entries.length} times`,
      });
    }
  }

  return { issues, duplicateEdgeKeys };
}

function buildRegistryEdges(
  edges: RawEdge[],
  validation: { issues: EdgeIssue[]; duplicateEdgeKeys: Set<string> },
): RegistryEdge[] {
  const unknownKeys = new Set<string>();
  const missingKeys = new Set<string>();

  for (const issue of validation.issues) {
    const key = `${issue.from}|${issue.edge}|${issue.to}|${issue.specPath}|${issue.line}`;
    if (issue.kind === "unknown-edge-label") {
      unknownKeys.add(key);
    }
    if (issue.kind === "missing-endpoint") {
      missingKeys.add(key);
    }
  }

  const emitted = new Set<string>();
  const validEdges: RegistryEdge[] = [];

  for (const edge of edges) {
    const fullKey = `${edge.from}|${edge.edge}|${edge.to}|${edge.specPath}|${edge.line}`;
    const relationshipKey = `${edge.from}|${edge.edge}|${edge.to}`;

    if (unknownKeys.has(fullKey) || missingKeys.has(fullKey)) {
      continue;
    }

    if (validation.duplicateEdgeKeys.has(relationshipKey)) {
      if (emitted.has(relationshipKey)) {
        continue;
      }
      emitted.add(relationshipKey);
    }

    validEdges.push({
      from: edge.from,
      edge: edge.edge,
      to: edge.to,
      evidence: edge.evidence,
      notes: edge.notes,
      feature: edge.feature,
      specPath: edge.specPath,
      line: edge.line,
    });
  }

  validEdges.sort((left, right) => {
    if (left.feature !== right.feature) {
      return left.feature.localeCompare(right.feature);
    }
    if (left.from !== right.from) {
      return left.from.localeCompare(right.from);
    }
    if (left.edge !== right.edge) {
      return left.edge.localeCompare(right.edge);
    }
    if (left.to !== right.to) {
      return left.to.localeCompare(right.to);
    }
    return left.line - right.line;
  });

  return validEdges;
}

function parseTableForSection(
  lines: string[],
  sectionName: string,
): MarkdownTable | null {
  const sectionRanges = findSectionRanges(lines);
  const section = sectionRanges.find(
    (entry) =>
      normalizeSectionName(entry.name) === normalizeSectionName(sectionName),
  );

  if (!section) {
    return null;
  }

  let start = section.start;
  while (start < section.end && !lines[start]?.trim().startsWith("|")) {
    start += 1;
  }

  if (start >= section.end) {
    return null;
  }

  const headerLine = lines[start] || "";
  const separatorLine = lines[start + 1] || "";
  if (!separatorLine.trim().startsWith("|")) {
    return null;
  }

  const headers = parseTableRow(headerLine);
  const separatorCells = parseTableRow(separatorLine);
  if (
    headers.length === 0 ||
    separatorCells.length === 0 ||
    !separatorCells.every(
      (cell) => /^:?-{3,}:?$/.test(cell) || cell.length === 0,
    )
  ) {
    return null;
  }

  const rows: TableRow[] = [];
  let rowIndex = start + 2;
  while (rowIndex < section.end) {
    const line = lines[rowIndex] || "";
    if (!line.trim().startsWith("|")) {
      break;
    }

    const cells = parseTableRow(line);
    if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell) || cell.length === 0)) {
      rows.push({
        cells,
        line: rowIndex + 1,
      });
    }

    rowIndex += 1;
  }

  return {
    headers,
    rows,
  };
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) {
    return [];
  }

  const withoutEdges = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return withoutEdges.split("|").map((cell) => cell.trim());
}

function toHeaderMap(headers: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    map.set(header.trim().toLowerCase(), index);
  });
  return map;
}

function extractMarkdownLabel(cell: string): string {
  const match = /\[([^\]]+)\]/.exec(cell);
  if (match?.[1]) {
    return match[1].trim();
  }
  return cell.trim();
}

function normalizeSectionName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function findSectionRanges(
  lines: string[],
): Array<{ name: string; start: number; end: number }> {
  const headings: Array<{ name: string; line: number }> = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] || "";
    const match = /^##+\s+(.+)$/.exec(line.trim());
    if (!match?.[1]) {
      continue;
    }

    headings.push({
      name: match[1].trim(),
      line: i,
    });
  }

  const sections: Array<{ name: string; start: number; end: number }> = [];
  for (let i = 0; i < headings.length; i += 1) {
    const current = headings[i];
    if (!current) {
      continue;
    }

    const next = headings[i + 1];
    sections.push({
      name: current.name,
      start: current.line + 1,
      end: next ? next.line : lines.length,
    });
  }

  return sections;
}

function scanCodeAnchors(roots: string[]): CodeAnchor[] {
  const anchors: CodeAnchor[] = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const files = walk(root).filter(
      (p) => p.endsWith(".ts") || p.endsWith(".tsx"),
    );
    for (const filePath of files) {
      const raw = readFileSync(filePath, "utf-8");
      const lines = raw.split("\n");

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i] || "";
        const m = line.match(/@(biz|sys)\s+([^|\n]+)\|\s*type:\s*([a-zA-Z-]+)/);
        if (!m) continue;

        const prefix = (m[1] as "biz" | "sys") || "biz";
        const conceptId = (m[2] || "").trim();
        const taxonomyType = (m[3] || "unknown").trim();

        const symbol = detectSymbol(lines, i + 1);
        anchors.push({
          conceptId,
          symbol,
          file: toRelative(filePath),
          line: i + 1,
          taxonomyType,
          prefix,
        });
      }
    }
  }
  return anchors;
}

function detectSymbol(lines: string[], start: number): string {
  for (let i = start; i < Math.min(lines.length, start + 8); i += 1) {
    const line = lines[i] || "";
    const m = line.match(
      /(?:function|class|type|interface|const)\s+([A-Za-z0-9_]+)/,
    );
    if (m?.[1]) return m[1];
  }
  return "unknown";
}

function walk(dirPath: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const full = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function parseFeatureId(raw: string): string | null {
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter?.[1]) return null;
  const m = frontmatter[1].match(/^feature:\s*(.+)$/m);
  return m?.[1]?.trim() || null;
}

function featureFromPath(path: string): string {
  const parts = toRelative(path).split("/");
  const idx = parts.indexOf("features");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1] || "unknown";
  return "unknown";
}

function findSpecFiles(featuresRoot: string): string[] {
  if (!existsSync(featuresRoot)) return [];
  const all = walk(featuresRoot);
  return all.filter((path) => path.endsWith("/SPEC.md"));
}

function getDomainspecVersion(): string {
  const changelog = resolve(process.cwd(), "domainspec/CHANGELOG.md");
  if (!existsSync(changelog)) return "unknown";
  const raw = readFileSync(changelog, "utf-8");
  const match = raw.match(/^##\s+\[([^\]]+)\]/m);
  return match?.[1] || "unknown";
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}

function toRelative(absPath: string): string {
  return relative(process.cwd(), absPath).replace(/\\/g, "/");
}
