#!/usr/bin/env tsx

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
  domainSpecRelative,
  resolveDomainSpecPath,
} from "./lib/domainspec-paths";

const args = process.argv.slice(2);
const runsThreshold = Number(getArg("--runs") || 10);
const signalsPath = resolveDomainSpecPath(
  getArg("--signals") || "docs/signals/pipeline-signals.jsonl",
);
const constitutionPath = resolveDomainSpecPath(
  getArg("--constitution") || "CONSTITUTION.md",
);
const outputPath = resolveDomainSpecPath(
  getArg("--output") || "docs/signals/GOVERNANCE-PRUNE-REPORT.md",
);

if (!existsSync(signalsPath) || !existsSync(constitutionPath)) {
  console.log("Missing signals or constitution file. Nothing to prune.");
  process.exit(0);
}

const rules = parseRules(readFileSync(constitutionPath, "utf-8"));
const signals = readSignals(signalsPath);
const sessions = [...new Set(signals.map((signal) => signal.session))];
const sampledSessions = sessions.slice(-runsThreshold);
const sampledSignals = signals.filter((signal) =>
  sampledSessions.includes(signal.session),
);

const ruleUsage = new Map<string, number>(rules.map((rule) => [rule.id, 0]));

for (const signal of sampledSignals) {
  const data = signal.data || {};
  const text =
    `${signal.type || ""} ${data.description || ""} ${data.shouldHaveBeenCaughtBy || ""}`.toLowerCase();

  for (const rule of rules) {
    if (ruleMatches(rule, text)) {
      ruleUsage.set(rule.id, (ruleUsage.get(rule.id) || 0) + 1);
    }
  }
}

const candidates = rules
  .map((rule) => ({
    ...rule,
    evidenceCount: ruleUsage.get(rule.id) || 0,
  }))
  .filter((rule) => rule.evidenceCount === 0);

const report = buildReport({
  runsThreshold,
  sampledSessions: sampledSessions.length,
  sampledSignals: sampledSignals.length,
  rules,
  ruleUsage,
  candidates,
});

writeFileSync(outputPath, report, "utf-8");
console.log(`Governance prune report written: ${toRelative(outputPath)}`);

function parseRules(raw: string): Array<{ id: string; statement: string }> {
  return raw
    .split("\n")
    .filter((line) => line.startsWith("| C"))
    .map((line) => {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      return {
        id: cells[0] || "",
        statement: cells[1] || "",
      };
    })
    .filter((rule) => rule.id.length > 0);
}

function readSignals(path: string): Array<{
  session: string;
  type: string;
  data: Record<string, string>;
}> {
  return readFileSync(path, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as {
          session: string;
          type: string;
          data: Record<string, string>;
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .map((signal) => ({
      ...signal,
      data: signal.data && typeof signal.data === "object" ? signal.data : {},
    })) as Array<{
    session: string;
    type: string;
    data: Record<string, string>;
  }>;
}

function ruleMatches(
  rule: { id: string; statement: string },
  text: string,
): boolean {
  const keywords: Record<string, string[]> = {
    C1: ["source", "authority", "domainspec"],
    C2: ["layer", "infrastructure", "adapter"],
    C3: ["signal", "schema", "completeness"],
    C4: ["observer", "executor"],
    C5: ["block", "critical", "high"],
    C6: ["anchor", "orphan", "biz", "sys"],
    C7: ["alignment", "layering", "audit"],
    C8: ["detector", "deterministic"],
    C9: ["telemetry", "bundle"],
    C10: ["prune", "vi negativa", "via negativa"],
    C11: ["health", "metrics", "m-00"],
  };

  const keys = keywords[rule.id] || [];
  return keys.some((key) => text.includes(key));
}

function buildReport(input: {
  runsThreshold: number;
  sampledSessions: number;
  sampledSignals: number;
  rules: Array<{ id: string; statement: string }>;
  ruleUsage: Map<string, number>;
  candidates: Array<{ id: string; statement: string; evidenceCount: number }>;
}): string {
  const lines: string[] = [];
  lines.push("# Governance Prune Report");
  lines.push("");
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push(`Window: last ${input.runsThreshold} session(s)`);
  lines.push(`Sampled sessions: ${input.sampledSessions}`);
  lines.push(`Sampled signals: ${input.sampledSignals}`);
  lines.push("");
  lines.push("## Rule Evidence Counts");
  lines.push("");
  lines.push("| Rule | Evidence Count | Statement |");
  lines.push("|---|---:|---|");
  for (const rule of input.rules) {
    lines.push(
      `| ${rule.id} | ${input.ruleUsage.get(rule.id) || 0} | ${rule.statement} |`,
    );
  }

  lines.push("");
  lines.push("## Candidate Rules For Review");
  lines.push("");
  if (input.candidates.length === 0) {
    lines.push("No zero-evidence rules found in this window.");
  } else {
    lines.push("| Rule | Why Candidate |");
    lines.push("|---|---|");
    for (const candidate of input.candidates) {
      lines.push(
        `| ${candidate.id} | Zero evidence over last ${input.runsThreshold} sessions. Review before 20-session removal threshold. |`,
      );
    }
  }

  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push(
    "1. After 10 sessions with zero evidence, mark rule as review candidate.",
  );
  lines.push(
    "2. After 20 sessions with zero evidence, remove unless catastrophic-risk guard applies.",
  );
  lines.push("3. Any removal requires explicit architecture approval.");

  return lines.join("\n") + "\n";
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}

function toRelative(absPath: string): string {
  return domainSpecRelative(absPath);
}
