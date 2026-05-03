#!/usr/bin/env tsx

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

type Concept = {
  id: string;
  shortName: string;
  sourceFile: string;
  line: number;
};

type CoverageRow = {
  taskPath: string;
  sources: string[];
  coverageTokens: string[];
  line: number;
};

type ViolationKind =
  | "missing-task-files"
  | "missing-concepts"
  | "missing-aspect-source"
  | "missing-aspect-concept-coverage"
  | "missing-concept-token";

type Violation = {
  kind: ViolationKind;
  feature: string;
  detail: string;
  path?: string;
  line?: number;
};

type FeatureResult = {
  feature: string;
  conceptCount: number;
  taskCount: number;
  violations: Violation[];
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
const mode = getArg("--mode") || "warn";
const requireAllConcepts = hasFlag("--require-all-concepts");
const featuresRoot = resolve(
  process.cwd(),
  getArg("--features-root") || "docs/features",
);
const singleFeature = getArg("--feature")?.trim();

if (!existsSync(featuresRoot)) {
  console.log(
    `validate-work-pack-coverage: no features found at ${toRelative(featuresRoot)}`,
  );
  process.exit(0);
}

const featureDirs = listFeatureDirs(featuresRoot)
  .filter((featureDir) => !singleFeature || featureDir === singleFeature)
  .sort();

if (featureDirs.length === 0) {
  console.log("validate-work-pack-coverage: no matching feature directories");
  process.exit(0);
}

const results = featureDirs.map((featureDir) => validateFeature(featureDir));
const violations = results.flatMap((entry) => entry.violations);

for (const result of results) {
  console.log(
    `[work-pack:${mode}] feature=${result.feature} tasks=${result.taskCount} concepts=${result.conceptCount} violations=${result.violations.length}`,
  );
}

for (const violation of violations) {
  const location = violation.path
    ? violation.line
      ? `${violation.path}:${violation.line}`
      : violation.path
    : violation.feature;
  console.log(
    `[work-pack:${mode}] ${location} | kind=${violation.kind} | ${violation.detail}`,
  );
}

if (violations.length === 0) {
  console.log(
    `[work-pack:${mode}] PASS features=${results.length} requireAllConcepts=${requireAllConcepts}`,
  );
  process.exit(0);
}

console.log(
  `[work-pack:${mode}] FAIL features=${results.length} violations=${violations.length} requireAllConcepts=${requireAllConcepts}`,
);

if (mode === "warn") {
  process.exit(0);
}

process.exit(1);

function validateFeature(featureDir: string): FeatureResult {
  const featurePath = join(featuresRoot, featureDir);
  const specPath = join(featurePath, "SPEC.md");
  const workPackPath = join(featurePath, "WORK-PACK.md");
  const tasksDir = join(featurePath, "work-pack", "tasks");

  const violations: Violation[] = [];

  if (!existsSync(workPackPath)) {
    // This validator is intended to run after work-pack creation.
    // Features without a work-pack are skipped.
    return {
      feature: featureDir,
      conceptCount: 0,
      taskCount: 0,
      violations,
    };
  }

  if (!existsSync(tasksDir)) {
    violations.push({
      kind: "missing-task-files",
      feature: featureDir,
      path: toRelative(workPackPath),
      detail: "Feature has WORK-PACK.md but no work-pack/tasks directory",
    });
    return {
      feature: featureDir,
      conceptCount: 0,
      taskCount: 0,
      violations,
    };
  }

  const taskFiles = listTaskFiles(tasksDir);
  if (taskFiles.length === 0) {
    violations.push({
      kind: "missing-task-files",
      feature: featureDir,
      path: toRelative(tasksDir),
      detail: "Feature has empty work-pack/tasks directory",
    });
  }

  if (!existsSync(specPath)) {
    violations.push({
      kind: "missing-concepts",
      feature: featureDir,
      path: toRelative(featurePath),
      detail: "Feature is missing SPEC.md",
    });
    return {
      feature: featureDir,
      conceptCount: 0,
      taskCount: taskFiles.length,
      violations,
    };
  }

  const concepts = parseConcepts(specPath, featurePath);
  if (concepts.length === 0) {
    violations.push({
      kind: "missing-concepts",
      feature: featureDir,
      path: toRelative(specPath),
      detail: "No concepts parsed from SPEC.md Concepts table",
    });
    return {
      feature: featureDir,
      conceptCount: 0,
      taskCount: taskFiles.length,
      violations,
    };
  }

  const coverageRows = taskFiles.flatMap((taskPath) =>
    parseDomainSpecCoverage(taskPath, featurePath),
  );
  const coveredSources = new Set<string>();
  const coverageTokens = new Set<string>();

  for (const row of coverageRows) {
    row.sources.forEach((source) => coveredSources.add(source));
    row.coverageTokens.forEach((token) => coverageTokens.add(token));
  }

  const conceptsBySource = new Map<string, Concept[]>();
  for (const concept of concepts) {
    if (!conceptsBySource.has(concept.sourceFile)) {
      conceptsBySource.set(concept.sourceFile, []);
    }
    conceptsBySource.get(concept.sourceFile)?.push(concept);
  }

  for (const [sourceFile, sourceConcepts] of conceptsBySource.entries()) {
    if (!coveredSources.has(sourceFile)) {
      const sample = sourceConcepts
        .slice(0, 3)
        .map((concept) => concept.shortName)
        .join(", ");
      violations.push({
        kind: "missing-aspect-source",
        feature: featureDir,
        path: toRelative(workPackPath),
        detail: `No task DomainSpec Coverage source references ${sourceFile} (sample concepts: ${sample})`,
      });
      continue;
    }

    const sourceHasConceptToken = sourceConcepts.some(
      (concept) =>
        coverageTokens.has(concept.id) || coverageTokens.has(concept.shortName),
    );

    if (!sourceHasConceptToken) {
      const sample = sourceConcepts
        .slice(0, 5)
        .map((concept) => concept.shortName)
        .join(", ");
      violations.push({
        kind: "missing-aspect-concept-coverage",
        feature: featureDir,
        path: toRelative(workPackPath),
        detail: `Source ${sourceFile} is referenced but no concept tokens from this source were found in Coverage IDs (sample: ${sample})`,
      });
    }
  }

  if (requireAllConcepts) {
    for (const concept of concepts) {
      if (
        coverageTokens.has(concept.id) ||
        coverageTokens.has(concept.shortName)
      ) {
        continue;
      }
      violations.push({
        kind: "missing-concept-token",
        feature: featureDir,
        path: toRelative(specPath),
        line: concept.line,
        detail: `Concept token missing from task coverage: ${concept.id}`,
      });
    }
  }

  return {
    feature: featureDir,
    conceptCount: concepts.length,
    taskCount: taskFiles.length,
    violations,
  };
}

function parseConcepts(specPath: string, featureRoot: string): Concept[] {
  const raw = readFileSync(specPath, "utf-8");
  const lines = raw.split(/\r?\n/);
  const table = parseTableForSection(lines, "Concepts");
  if (!table) {
    return [];
  }

  const headerMap = toHeaderMap(table.headers);
  const conceptIndex = headerMap.get("concept");
  const idIndex = headerMap.get("id");

  if (conceptIndex === undefined || idIndex === undefined) {
    return [];
  }

  const concepts: Concept[] = [];
  for (const row of table.rows) {
    const conceptCell = (row.cells[conceptIndex] || "").trim();
    const conceptId = (row.cells[idIndex] || "").trim();
    if (
      !conceptId ||
      conceptId.includes("{") ||
      conceptId.toLowerCase() === "id"
    ) {
      continue;
    }

    const link = extractFirstMarkdownLink(conceptCell);
    if (!link) {
      continue;
    }

    const normalizedSource = normalizeRelativePath(
      specPath,
      link.href,
      featureRoot,
    );
    if (!normalizedSource) {
      continue;
    }

    const shortName = conceptId.includes(".")
      ? conceptId.split(".").at(-1) || conceptId
      : conceptId;

    concepts.push({
      id: conceptId,
      shortName,
      sourceFile: normalizedSource,
      line: row.line,
    });
  }

  return concepts;
}

function parseDomainSpecCoverage(
  taskPath: string,
  featureRoot: string,
): CoverageRow[] {
  const raw = readFileSync(taskPath, "utf-8");
  const lines = raw.split(/\r?\n/);

  const coverageRows: CoverageRow[] = [];
  let inCoverage = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] || "";

    if (line.trim().toLowerCase() === "## domainspec coverage") {
      inCoverage = true;
      continue;
    }

    if (inCoverage && line.trim().startsWith("## ")) {
      break;
    }

    if (!inCoverage || !line.trim().startsWith("|")) {
      continue;
    }

    const cells = parseTableRow(line);
    if (cells.length < 2) {
      continue;
    }

    if (
      cells[0]?.toLowerCase() === "source" ||
      /^:?-{3,}:?$/.test(cells[0] || "")
    ) {
      continue;
    }

    const sourceCell = cells[0] || "";
    const idsCell = cells[1] || "";

    const sourceLinks = extractAllMarkdownLinks(sourceCell)
      .map((link) => normalizeRelativePath(taskPath, link.href, featureRoot))
      .filter((value): value is string => Boolean(value));

    const coverageTokens = idsCell
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .map((value) => value.replace(/^`/, "").replace(/`$/, ""));

    coverageRows.push({
      taskPath: toRelative(taskPath),
      sources: sourceLinks,
      coverageTokens,
      line: i + 1,
    });
  }

  return coverageRows;
}

function normalizeRelativePath(
  baseFile: string,
  href: string,
  featureRoot: string,
): string | null {
  const cleanHref = href.split("#")[0]?.trim() || "";
  if (!cleanHref) {
    return null;
  }

  if (
    cleanHref.startsWith("http://") ||
    cleanHref.startsWith("https://") ||
    cleanHref.startsWith("mailto:")
  ) {
    return null;
  }

  const absolute = resolve(dirname(baseFile), cleanHref);
  const relativeToFeature = relative(featureRoot, absolute).replace(/\\/g, "/");

  if (relativeToFeature.startsWith("..")) {
    return null;
  }

  return relativeToFeature;
}

function listFeatureDirs(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function listTaskFiles(tasksDir: string): string[] {
  return readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => join(tasksDir, entry.name));
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
      rows.push({ cells, line: rowIndex + 1 });
    }

    rowIndex += 1;
  }

  return { headers, rows };
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
  headers.forEach((header, index) =>
    map.set(header.trim().toLowerCase(), index),
  );
  return map;
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
    headings.push({ name: match[1].trim(), line: i });
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

function normalizeSectionName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractFirstMarkdownLink(
  cell: string,
): { label: string; href: string } | null {
  const match = /\[([^\]]+)\]\(([^)]+)\)/.exec(cell);
  if (!match?.[1] || !match[2]) {
    return null;
  }
  return { label: match[1], href: match[2] };
}

function extractAllMarkdownLinks(
  cell: string,
): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = [];
  for (const match of cell.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    if (!match[1] || !match[2]) {
      continue;
    }
    links.push({ label: match[1], href: match[2] });
  }
  return links;
}

function hasFlag(name: string): boolean {
  return args.includes(name);
}

function getArg(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) {
    return undefined;
  }
  return args[index + 1];
}

function toRelative(absPath: string): string {
  return relative(process.cwd(), absPath).replace(/\\/g, "/");
}
