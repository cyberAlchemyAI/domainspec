#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const registryPath = resolve(process.cwd(), getArg("--input") || "docs/registry.json");
const jsonOutput = args.includes("--json");
const onlyChanged = args.includes("--only-changed");
const range = getArg("--range") || process.env.GOV_RANGE || "HEAD~1..HEAD";
const allowUnanchored = Number(getArg("--allow-unanchored") || 0);
const allowUndefined = Number(getArg("--allow-undefined") || 0);

if (!existsSync(registryPath)) {
  fail([`Registry not found: ${registryPath}`], 2);
}

const registry = JSON.parse(readFileSync(registryPath, "utf-8")) as {
  stats?: { concepts?: number; anchors?: number };
  orphans?: {
    unanchoredConcepts?: Array<{ conceptId: string; feature: string }>;
    undefinedAnchors?: Array<{ conceptId: string; file: string }>;
  };
};

const unanchored = registry.orphans?.unanchoredConcepts || [];
const undefinedAnchors = registry.orphans?.undefinedAnchors || [];

const changedScope = onlyChanged ? getChangedScope(range) : null;
const scopedUnanchored = changedScope
  ? unanchored.filter((item) => changedScope.features.has(item.feature))
  : unanchored;
const scopedUndefinedAnchors = changedScope
  ? undefinedAnchors.filter((item) => changedScope.codeFiles.has(normalize(item.file)))
  : undefinedAnchors;

const errors: string[] = [];
if (scopedUnanchored.length > allowUnanchored) {
  errors.push(
    `Unanchored concepts exceeded limit: ${scopedUnanchored.length} > ${allowUnanchored}`,
  );
}
if (scopedUndefinedAnchors.length > allowUndefined) {
  errors.push(
    `Undefined anchors exceeded limit: ${scopedUndefinedAnchors.length} > ${allowUndefined}`,
  );
}

if (jsonOutput) {
  console.log(
    JSON.stringify(
      {
        ok: errors.length === 0,
        input: registryPath,
        onlyChanged,
        range: onlyChanged ? range : null,
        concepts: registry.stats?.concepts || 0,
        anchors: registry.stats?.anchors || 0,
        unanchored: scopedUnanchored.length,
        undefinedAnchors: scopedUndefinedAnchors.length,
        totalUnanchored: unanchored.length,
        totalUndefinedAnchors: undefinedAnchors.length,
        errors,
      },
      null,
      2,
    ),
  );
} else {
  console.log(`Registry: ${registryPath}`);
  if (onlyChanged) {
    console.log(`Changed-scope mode: enabled (${range})`);
  }
  console.log(`Unanchored concepts (scope): ${scopedUnanchored.length}`);
  console.log(`Undefined anchors (scope): ${scopedUndefinedAnchors.length}`);
  if (onlyChanged) {
    console.log(`Unanchored concepts (total): ${unanchored.length}`);
    console.log(`Undefined anchors (total): ${undefinedAnchors.length}`);
  }
  if (errors.length > 0) {
    console.log("Errors:");
    for (const error of errors) console.log(`- ${error}`);
  } else {
    console.log("Orphan validation passed.");
  }
}

process.exit(errors.length > 0 ? 1 : 0);

function fail(errors: string[], code: number): never {
  if (jsonOutput) {
    console.log(JSON.stringify({ ok: false, errors }, null, 2));
  } else {
    for (const error of errors) console.log(`- ${error}`);
  }
  process.exit(code);
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}

function getChangedScope(gitRange: string): {
  features: Set<string>;
  codeFiles: Set<string>;
} {
  const changed = execOrEmpty(`git --no-pager diff --name-only ${gitRange}`)
    .split("\n")
    .map((line) => normalize(line))
    .filter(Boolean);

  const features = new Set<string>();
  const codeFiles = new Set<string>();

  for (const file of changed) {
    const featureMatch = file.match(/^docs\/features\/([^/]+)\//);
    if (featureMatch?.[1]) {
      features.add(featureMatch[1]);
    }

    if (/\.(ts|tsx)$/.test(file)) {
      codeFiles.add(file);
    }
  }

  return { features, codeFiles };
}

function execOrEmpty(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function normalize(path: string): string {
  return path.replace(/\\/g, "/").trim();
}
