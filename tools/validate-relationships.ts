#!/usr/bin/env tsx

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type Violation = {
  specPath: string;
  line: number;
  section: "Cross-Feature Dependencies" | "Feature Concept Graph";
  value: string;
  detail: string;
  suggestions: string[];
};

type TableRow = {
  cells: string[];
  line: number;
};

type MarkdownTable = {
  headers: string[];
  rows: TableRow[];
};

const args = process.argv.slice(2);
const mode = getArg("--mode") || "strict";
const featuresRoot = resolve(
  process.cwd(),
  getArg("--features-root") || "docs/features",
);
const relationshipsPath = resolve(
  process.cwd(),
  getArg("--relationships") || "RELATIONSHIPS.md",
);

if (!existsSync(featuresRoot)) {
  console.log(
    `validate-relationships: no features found at ${toRelative(featuresRoot)}`,
  );
  process.exit(0);
}

const canonicalEdges = parseCanonicalEdges(relationshipsPath);
if (canonicalEdges.size === 0) {
  console.error(
    `validate-relationships: failed to load canonical edges from ${toRelative(relationshipsPath)}`,
  );
  process.exit(1);
}

const specFiles = findSpecFiles(featuresRoot);
const violations: Violation[] = [];

for (const specPath of specFiles) {
  const raw = readFileSync(specPath, "utf-8");
  const lines = raw.split(/\r?\n/);

  const dependencyTable = parseTableForSection(
    lines,
    "Cross-Feature Dependencies",
  );
  if (dependencyTable) {
    const headerMap = toHeaderMap(dependencyTable.headers);
    const relationshipIndex = headerMap.get("relationship");
    if (relationshipIndex !== undefined) {
      for (const row of dependencyTable.rows) {
        const value = (row.cells[relationshipIndex] || "").trim();
        if (!value || isPlaceholder(value)) {
          continue;
        }

        if (!canonicalEdges.has(value)) {
          const suggestions = suggestCanonicalEdges(value, canonicalEdges);
          violations.push({
            specPath: toRelative(specPath),
            line: row.line,
            section: "Cross-Feature Dependencies",
            value,
            detail: `Relationship label \"${value}\" is not canonical`,
            suggestions,
          });
        }
      }
    }
  }

  const graphTable = parseTableForSection(lines, "Feature Concept Graph");
  if (graphTable) {
    const headerMap = toHeaderMap(graphTable.headers);
    const edgeIndex = headerMap.get("edge");
    if (edgeIndex !== undefined) {
      for (const row of graphTable.rows) {
        const value = (row.cells[edgeIndex] || "").trim();
        if (!value || isPlaceholder(value)) {
          continue;
        }

        if (!canonicalEdges.has(value)) {
          const suggestions = suggestCanonicalEdges(value, canonicalEdges);
          violations.push({
            specPath: toRelative(specPath),
            line: row.line,
            section: "Feature Concept Graph",
            value,
            detail: `Edge label \"${value}\" is not canonical`,
            suggestions,
          });
        }
      }
    }
  }
}

if (violations.length === 0) {
  console.log(
    `validate-relationships: PASS (${specFiles.length} specs checked, canonicalEdges=${canonicalEdges.size})`,
  );
  process.exit(0);
}

const canonicalList = [...canonicalEdges].sort().join(", ");
for (const violation of violations) {
  const suggestionText =
    violation.suggestions.length > 0
      ? ` | suggested=${violation.suggestions.join(",")}`
      : " | suggested=<none>";
  console.log(
    `[relationship:${mode}] ${violation.specPath}:${violation.line} | section=${violation.section} | value=${violation.value} | ${violation.detail}${suggestionText}`,
  );
}
console.log(
  `[relationship:${mode}] violations=${violations.length} canonicalEdges=[${canonicalList}]`,
);

if (mode === "warn") {
  process.exit(0);
}

process.exit(1);

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

function findSpecFiles(root: string): string[] {
  const all = walk(root);
  return all.filter((path) => path.endsWith("/SPEC.md"));
}

function walk(root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(fullPath));
    } else if (entry.isFile()) {
      out.push(fullPath);
    }
  }
  return out;
}

function getArg(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) {
    return undefined;
  }
  return args[index + 1];
}

function isPlaceholder(value: string): boolean {
  return value.includes("{") && value.includes("}");
}

function suggestCanonicalEdges(
  value: string,
  canonicalEdges: Set<string>,
): string[] {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const scored = [...canonicalEdges].map((candidate) => ({
    candidate,
    score: scoreCandidate(normalized, candidate),
  }));

  scored.sort((left, right) => {
    if (left.score !== right.score) {
      return left.score - right.score;
    }
    return left.candidate.localeCompare(right.candidate);
  });

  return scored.slice(0, 3).map((entry) => entry.candidate);
}

function scoreCandidate(value: string, candidate: string): number {
  if (value === candidate) {
    return 0;
  }

  if (candidate.includes(value) || value.includes(candidate)) {
    return 1;
  }

  return levenshteinDistance(value, candidate);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i] = [i];
  }
  for (let j = 1; j <= b.length; j += 1) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        (matrix[i - 1]![j] || 0) + 1,
        (matrix[i]![j - 1] || 0) + 1,
        (matrix[i - 1]![j - 1] || 0) + substitutionCost,
      );
    }
  }

  return matrix[a.length]![b.length] || 0;
}

function toRelative(absPath: string): string {
  return relative(process.cwd(), absPath).replace(/\\/g, "/");
}
