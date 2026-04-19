#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

type ErrorItem = {
  file: string;
  message: string;
};

const root = resolve(process.cwd());
const featuresRoot = resolve(root, "docs/features");
const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const onlyChanged = args.includes("--only-changed");
const range = getArg("--range") || process.env.GOV_RANGE || "HEAD~1..HEAD";

if (!existsSync(featuresRoot)) {
  output([{ file: "docs/features", message: "features directory not found" }], 2);
}

const files = onlyChanged
  ? getChangedMarkdownFiles(range)
  : walk(featuresRoot).filter((f) => f.endsWith(".md"));
const featureDirs = readdirSync(featuresRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const errors: ErrorItem[] = [];

for (const filePath of files) {
  const raw = readFileSync(filePath, "utf-8");
  const frontmatter = parseFrontmatter(raw);

  if (frontmatter) {
    const deps = frontmatter.dependencies || [];
    for (const dep of deps) {
      if (!featureDirs.includes(dep)) {
        errors.push({
          file: rel(filePath),
          message: `dependency ${dep} does not resolve to docs/features/${dep}`,
        });
      }
    }

    const includes = frontmatter.includes || [];
    for (const include of includes) {
      const includePath = resolve(dirname(filePath), include);
      if (!existsSync(includePath)) {
        errors.push({
          file: rel(filePath),
          message: `include file does not exist: ${include}`,
        });
      }
    }
  }

  validateMarkdownLinks(filePath, raw, errors);
}

output(errors, errors.length > 0 ? 1 : 0);

function validateMarkdownLinks(filePath: string, raw: string, out: ErrorItem[]): void {
  const links = [...raw.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1] || "");
  for (const link of links) {
    if (!link || /^https?:\/\//.test(link) || link.startsWith("mailto:")) continue;

    const [pathPart, anchor] = link.split("#");
    const targetPath = pathPart
      ? resolve(dirname(filePath), decodeURIComponent(pathPart))
      : filePath;

    if (!existsSync(targetPath)) {
      out.push({
        file: rel(filePath),
        message: `broken link target: ${link}`,
      });
      continue;
    }

    if (anchor && anchor.length > 0) {
      const targetRaw = readFileSync(targetPath, "utf-8");
      const anchors = extractAnchors(targetRaw);
      if (!anchors.has(anchor)) {
        out.push({
          file: rel(filePath),
          message: `missing anchor ${anchor} in ${rel(targetPath)}`,
        });
      }
    }
  }
}

function parseFrontmatter(raw: string): { dependencies?: string[]; includes?: string[] } | null {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match?.[1]) return null;
  const block = match[1];

  return {
    dependencies: parseList(block, "dependencies"),
    includes: parseList(block, "includes"),
  };
}

function parseList(block: string, key: string): string[] {
  const keyRegex = new RegExp(`^${key}:\\s*$`, "m");
  if (!keyRegex.test(block)) {
    const inline = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    if (inline?.[1]) return parseInlineList(inline[1].trim());
    return [];
  }

  const lines = block.split("\n");
  const out: string[] = [];
  let active = false;
  for (const line of lines) {
    if (line.startsWith(`${key}:`)) {
      active = true;
      continue;
    }
    if (active) {
      if (/^[a-zA-Z][a-zA-Z0-9_-]*:\s*/.test(line)) break;
      const item = line.match(/^\s*-\s*(.+)$/);
      if (item?.[1]) out.push(stripQuotes(item[1].trim()));
    }
  }
  return out;
}

function parseInlineList(raw: string): string[] {
  if (!raw || raw === "[]") return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  return [stripQuotes(raw)].filter(Boolean);
}

function stripQuotes(value: string): string {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function extractAnchors(raw: string): Set<string> {
  const anchors = new Set<string>();
  const lines = raw.split("\n");
  for (const line of lines) {
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (!heading?.[1]) continue;
    anchors.add(slug(heading[1]));
  }
  return anchors;
}

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function walk(dirPath: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const full = join(dirPath, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function output(items: ErrorItem[], code: number): never {
  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          ok: code === 0,
          onlyChanged,
          range: onlyChanged ? range : null,
          checkedFiles: files.length,
          errors: items,
        },
        null,
        2,
      ),
    );
  } else if (items.length === 0) {
    if (onlyChanged) {
      console.log(`Markdown/frontmatter link validation passed for changed scope (${range}).`);
    } else {
      console.log("Markdown/frontmatter link validation passed.");
    }
  } else {
    console.log("Markdown/frontmatter link validation errors:");
    for (const item of items) {
      console.log(`- ${item.file}: ${item.message}`);
    }
  }
  process.exit(code);
}

function rel(path: string): string {
  return path.replace(`${root}/`, "");
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}

function getChangedMarkdownFiles(gitRange: string): string[] {
  const changed = execOrEmpty(`git --no-pager diff --name-only ${gitRange}`)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith("docs/features/") && line.endsWith(".md"));

  const out = new Set<string>();
  for (const relativePath of changed) {
    const absolutePath = resolve(root, relativePath);
    if (existsSync(absolutePath)) {
      out.add(absolutePath);
    }
  }

  return Array.from(out);
}

function execOrEmpty(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}
