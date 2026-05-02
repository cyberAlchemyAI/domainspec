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

const args = process.argv.slice(2);
const outputPath = resolve(
  process.cwd(),
  getArg("--output") || "docs/registry.json",
);

const specs = findSpecFiles(resolve(process.cwd(), "docs/features"));
const concepts = parseConcepts(specs);
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

const registry = {
  meta: {
    generatedAt: new Date().toISOString(),
    sourceOfTruth: "docs/features/**/SPEC.md",
    domainspecVersion: getDomainspecVersion(),
  },
  concepts,
  edges: [],
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
    unanchoredConcepts: unanchoredConcepts.length,
    undefinedAnchors: undefinedAnchors.length,
  },
};

writeFileSync(outputPath, JSON.stringify(registry, null, 2) + "\n", "utf-8");
console.log(
  `Registry generated: ${toRelative(outputPath)} | concepts=${registry.stats.concepts} anchors=${registry.stats.anchors} unanchored=${registry.stats.unanchoredConcepts} undefinedAnchors=${registry.stats.undefinedAnchors}`,
);

function parseConcepts(specFiles: string[]): Concept[] {
  const results: Concept[] = [];

  for (const specPath of specFiles) {
    const raw = readFileSync(specPath, "utf-8");
    const feature = parseFeatureId(raw) || featureFromPath(specPath);

    const lines = raw.split("\n");
    for (const line of lines) {
      if (!line.trim().startsWith("|")) continue;
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0);
      if (cells.length < 4) continue;
      if (/^[-:]+$/.test(cells[0] || "")) continue;
      if ((cells[1] || "").toLowerCase() === "id") continue;

      const nameCell = cells[0] || "";
      const id = cells[1] || "";
      const type = cells[2] || "";
      const description = cells[3] || "";
      if (!id || !type) continue;

      const nameMatch = nameCell.match(/\[([^\]]+)\]/);
      const name = (nameMatch?.[1] || nameCell).trim();

      results.push({
        id,
        name,
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
  }

  const unique = new Map<string, Concept>();
  for (const concept of results) {
    if (!unique.has(concept.id)) unique.set(concept.id, concept);
  }

  return [...unique.values()];
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
