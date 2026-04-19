#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

type Signal = {
  id: string;
  timestamp: string;
  session: string;
  feature: string;
  domainspecVersion: string;
  pipelineMode: "new" | "evolution" | "audit";
  source: "ci-detector" | "fast-observer";
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: "economy" | "governance" | "pattern" | "quality" | "operations";
  data: Record<string, unknown>;
};

const args = process.argv.slice(2);
const feature = getArg("--feature") || "cross-feature";
const session = getArg("--session") || `detector-${new Date().toISOString().slice(0, 10)}`;
const modeArg = getArg("--mode") || "audit";
const sourceArg = getArg("--source") || "ci-detector";
const output = resolve(
  process.cwd(),
  getArg("--output") || "docs/signals/pipeline-signals.jsonl",
);
const dryRun = args.includes("--dry-run");
const range = getArg("--range") || "HEAD~1..HEAD";

const pipelineMode: Signal["pipelineMode"] =
  modeArg === "new" || modeArg === "evolution" || modeArg === "audit"
    ? modeArg
    : "audit";
const source: Signal["source"] = sourceArg === "fast-observer" ? "fast-observer" : "ci-detector";

const domainspecVersion = getDomainspecVersion();
const changedFiles = getChangedFiles(range);
const signals: Signal[] = [];

const specFile = resolveFeatureSpec(feature);
if (specFile && existsSync(specFile)) {
  const missingConcepts = detectMissingConceptAnchors(feature, specFile);
  for (const conceptId of missingConcepts) {
    signals.push(
      buildSignal({
        feature,
        session,
        domainspecVersion,
        pipelineMode,
        source,
        type: "alignment-gap",
        severity: "MEDIUM",
        category: "quality",
        data: {
          gapType: "spec-without-code",
          conceptId,
          specFile: toRelative(specFile),
          codeFile: "backend/src",
          description: `Concept ${conceptId} was not found in code anchors or references`,
        },
      }),
    );
  }
}

const todoSignals = detectTodoSignals(changedFiles, feature, session, domainspecVersion, pipelineMode, source);
signals.push(...todoSignals);

const scopeSignals = detectScopeDrift(changedFiles, feature, session, domainspecVersion, pipelineMode, source);
signals.push(...scopeSignals);

if (signals.length === 0) {
  console.log("No deterministic signals detected.");
  process.exit(0);
}

if (dryRun) {
  console.log(JSON.stringify({ count: signals.length, signals }, null, 2));
  process.exit(0);
}

appendSignals(output, signals);
console.log(`Appended ${signals.length} detected signal(s) to ${toRelative(output)}`);

function detectMissingConceptAnchors(featureId: string, specPath: string): string[] {
  const raw = readFileSync(specPath, "utf-8");
  const conceptIds = [...raw.matchAll(/\|\s*\[[^\]]+\]\([^\)]*\)\s*\|\s*([^|]+)\|/g)]
    .map((m) => m[1]?.trim() || "")
    .filter((id) => id.startsWith(`${featureId}.`));

  if (conceptIds.length === 0) return [];

  const code = readCodeCorpus();
  return conceptIds.filter((id) => !code.includes(id));
}

function detectTodoSignals(
  files: string[],
  featureId: string,
  sessionId: string,
  version: string,
  mode: Signal["pipelineMode"],
  detectorSource: Signal["source"],
): Signal[] {
  const out: Signal[] = [];
  for (const file of files) {
    if (!existsSync(file) || !file.endsWith(".ts")) continue;
    const content = safeRead(file);
    if (!content) continue;

    const markers = content.match(/TODO|FIXME|HACK|ASSUMPTION/gi);
    if (!markers || markers.length === 0) continue;

    out.push(
      buildSignal({
        feature: featureId,
        session: sessionId,
        domainspecVersion: version,
        pipelineMode: mode,
        source: detectorSource,
        type: "spec-gap",
        severity: "MEDIUM",
        category: "quality",
        data: {
          aspectFile: file,
          missingDetail: `Detected ${markers.length} unresolved marker(s) in changed file`,
          resolution: "deferred",
          impactedStep: "detector",
        },
      }),
    );
  }
  return out;
}

function detectScopeDrift(
  files: string[],
  featureId: string,
  sessionId: string,
  version: string,
  mode: Signal["pipelineMode"],
  detectorSource: Signal["source"],
): Signal[] {
  if (featureId === "cross-feature") return [];

  const allowedFragments = [
    `docs/features/${featureId}/`,
    `backend/src/domain/${featureId}/`,
    `backend/src/use-cases/${featureId}/`,
    `apps/web/src/${featureId}/`,
    "domainspec/",
    ".github/",
    "docs/signals/",
  ];

  const drifts = files.filter(
    (f) => !allowedFragments.some((fragment) => f.replace(/\\/g, "/").includes(fragment)),
  );

  if (drifts.length === 0) return [];

  return [
    buildSignal({
      feature: featureId,
      session: sessionId,
      domainspecVersion: version,
      pipelineMode: mode,
      source: detectorSource,
      type: "governance-gap",
      severity: "HIGH",
      category: "governance",
      data: {
        description: `Scope drift detected: ${drifts.length} changed file(s) outside feature scope`,
        shouldHaveBeenCaughtBy: "governance-gates",
        skillFile: ".github/workflows/governance-gates.yml",
        suggestedFix: `Limit changes to feature-scoped paths or reclassify run as cross-feature. Files: ${drifts.slice(0, 5).join(", ")}`,
        occurrences: drifts.length,
      },
    }),
  ];
}

function buildSignal(input: Omit<Signal, "id" | "timestamp">): Signal {
  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...input,
  };
}

function appendSignals(outputPath: string, all: Signal[]): void {
  const payload = all.map((s) => JSON.stringify(s)).join("\n") + "\n";
  appendFileSync(outputPath, payload, "utf-8");
}

function getChangedFiles(gitRange: string): string[] {
  const out = execOrEmpty(`git --no-pager diff --name-only ${gitRange}`);
  return out
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => resolve(process.cwd(), v));
}

function resolveFeatureSpec(featureId: string): string | null {
  const candidates = [
    resolve(process.cwd(), `docs/features/${featureId}/SPEC.md`),
    resolve(process.cwd(), `docs/features/${featureId}/spec.en.md`),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function readCodeCorpus(): string {
  const roots = [
    resolve(process.cwd(), "backend/src"),
    resolve(process.cwd(), "apps/web/src"),
  ];

  let corpus = "";
  for (const root of roots) {
    const text = execOrEmpty(`rg --no-heading --line-number --glob '*.ts' '.' ${root}`);
    corpus += text + "\n";
  }
  return corpus;
}

function getDomainspecVersion(): string {
  const changelog = resolve(process.cwd(), "domainspec/CHANGELOG.md");
  if (!existsSync(changelog)) return "unknown";
  const raw = readFileSync(changelog, "utf-8");
  const match = raw.match(/^##\s+\[([^\]]+)\]/m);
  return match?.[1] || "unknown";
}

function safeRead(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

function execOrEmpty(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function getArg(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  return args[index + 1];
}

function toRelative(absPath: string): string {
  return absPath.replace(`${process.cwd()}/`, "");
}
