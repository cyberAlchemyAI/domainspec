#!/usr/bin/env tsx

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import {
  domainSpecRelative,
  resolveDomainSpecPath,
  workspaceRelative,
} from "./lib/domainspec-paths";

const args = process.argv.slice(2);
const signalsPath = resolveDomainSpecPath(
  getArg("--signals") || "docs/signals/pipeline-signals.jsonl",
);
const registryPath = resolveDomainSpecPath(
  getArg("--registry") || "docs/registry.json",
);
const outputPath = resolveDomainSpecPath(
  getArg("--output") || "docs/signals/META-HEALTH.md",
);

const signals = existsSync(signalsPath) ? readSignals(signalsPath) : [];
const registry = existsSync(registryPath)
  ? (JSON.parse(readFileSync(registryPath, "utf-8")) as {
      stats?: { concepts?: number; anchors?: number };
      orphans?: {
        unanchoredConcepts?: unknown[];
        undefinedAnchors?: unknown[];
      };
    })
  : null;

const concepts = registry?.stats?.concepts || 0;
const unanchored = registry?.orphans?.unanchoredConcepts?.length || 0;
const undefinedAnchors = registry?.orphans?.undefinedAnchors?.length || 0;

const orphanRate =
  concepts > 0 ? (unanchored + undefinedAnchors) / concepts : null;

const stepVerdicts = signals.filter((s) => s.type === "step-verdict");
const blockedSteps = stepVerdicts.filter(
  (s) => String(s.data.verdict || "") === "BLOCK",
);
const l6FrictionRate =
  stepVerdicts.length > 0 ? blockedSteps.length / stepVerdicts.length : null;

const overheadSignals = signals.filter((s) => s.type === "overhead");
const avgOverhead =
  overheadSignals.length > 0
    ? overheadSignals.reduce(
        (sum, signal) => sum + toNumber(signal.data.overheadRatio),
        0,
      ) / overheadSignals.length
    : null;

const governanceRatio =
  concepts > 0 ? (concepts - unanchored) / concepts : null;
const l4Volatility = countRecentCommits(
  [
    workspaceRelative(resolveDomainSpecPath("AXIOMS.md")),
    workspaceRelative(resolveDomainSpecPath("CONSTITUTION.md")),
  ],
  30,
);

const content = buildReport({
  orphanRate,
  l6FrictionRate,
  avgOverhead,
  governanceRatio,
  l4Volatility,
  concepts,
  unanchored,
  undefinedAnchors,
});

writeFileSync(outputPath, content, "utf-8");
console.log(`Meta health report written: ${toRelative(outputPath)}`);

function readSignals(
  path: string,
): Array<{ type: string; data: Record<string, unknown> }> {
  return readFileSync(path, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as {
          type: string;
          data: Record<string, unknown>;
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<{ type: string; data: Record<string, unknown> }>;
}

function buildReport(input: {
  orphanRate: number | null;
  l6FrictionRate: number | null;
  avgOverhead: number | null;
  governanceRatio: number | null;
  l4Volatility: number;
  concepts: number;
  unanchored: number;
  undefinedAnchors: number;
}): string {
  const lines: string[] = [];
  lines.push("# Meta Health Report");
  lines.push("");
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Metrics");
  lines.push("");
  lines.push("| Metric | Value | Notes |");
  lines.push("|---|---:|---|");
  lines.push(
    `| M-001 Orphan Rate | ${fmtPct(input.orphanRate)} | (unanchored + undefined) / concepts |`,
  );
  lines.push(
    `| M-002 L6 Friction Rate | ${fmtPct(input.l6FrictionRate)} | BLOCK step-verdict ratio |`,
  );
  lines.push(
    "| M-003 Time-to-Alignment | N/A | Requires lifecycle timestamps not yet modeled |\n",
  );
  lines.push(
    `| M-004 L4 Volatility | ${input.l4Volatility} commits/30d | Changes touching AXIOMS or CONSTITUTION |`,
  );
  lines.push(
    `| M-005 Governance Ratio | ${fmtPct(input.governanceRatio)} | anchored concepts / concepts |`,
  );
  lines.push(
    `| M-006 Overhead Ratio | ${fmtNum(input.avgOverhead)} | average overhead signal ratio |`,
  );
  lines.push("");
  lines.push("## Registry Snapshot");
  lines.push("");
  lines.push(`- concepts: ${input.concepts}`);
  lines.push(`- unanchored concepts: ${input.unanchored}`);
  lines.push(`- undefined anchors: ${input.undefinedAnchors}`);
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push("1. M-001 should trend toward 0 as spec-code binding hardens.");
  lines.push(
    "2. M-002 should remain low while preserving true blocking behavior for critical gaps.",
  );
  lines.push(
    "3. M-006 should decrease after governance pruning and detector stabilization.",
  );
  return lines.join("\n") + "\n";
}

function countRecentCommits(paths: string[], days: number): number {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const quoted = paths.map((path) => `"${path}"`).join(" ");
  try {
    const out = execSync(
      `git --no-pager log --since="${since}" --pretty=format:%H -- ${quoted}`,
      { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] },
    )
      .trim()
      .split("\n")
      .filter(Boolean);
    return out.length;
  } catch {
    return 0;
  }
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function fmtPct(value: number | null): string {
  if (value === null) return "N/A";
  return `${(value * 100).toFixed(2)}%`;
}

function fmtNum(value: number | null): string {
  if (value === null) return "N/A";
  return value.toFixed(3);
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}

function toRelative(absPath: string): string {
  const rootRelative = domainSpecRelative(absPath);
  return rootRelative.startsWith("..")
    ? workspaceRelative(absPath)
    : rootRelative;
}
