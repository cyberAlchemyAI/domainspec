#!/usr/bin/env tsx

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  domainSpecRelative,
  resolveDomainSpecPath,
} from "./lib/domainspec-paths";

type CheckResult = {
  id: string;
  command: string[];
  status: "pass" | "flag" | "block";
  exitCode: number | null;
  stdout: string;
  stderr: string;
  interpretation: string;
};

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const outputPath = resolveDomainSpecPath(
  getArg("--output") || "docs/signals/GOVERNANCE-ATTENUATION-AUDIT.md",
);
const signalsPath = resolveDomainSpecPath(
  getArg("--signals") || "docs/signals/pipeline-signals.jsonl",
);

const checks: CheckResult[] = [
  runCheck({
    id: "governance-chain",
    script: "tools/validate-governance-chain.ts",
    args: ["--json"],
    interpretation:
      "Validates that constitution rules, axioms, and gates remain connected.",
    exitPolicy: "zero-pass-nonzero-block",
  }),
  runCheck({
    id: "signal-ledger-envelope",
    script: "tools/validate-signals.ts",
    args: ["--input", signalsPath, "--json"],
    interpretation:
      "Validates signal envelope and session completeness before signals drive governance decisions.",
    exitPolicy: "zero-pass-nonzero-block",
  }),
  runCheck({
    id: "signal-thresholds",
    script: "tools/analyze-signals.ts",
    args: ["--signals", signalsPath, "--json", "--min", "1"],
    interpretation:
      "Aggregates signal thresholds; threshold-trigger exits are flags, not command failures.",
    exitPolicy: "zero-pass-one-flag-other-block",
  }),
];

const report = buildReport(checks);

if (jsonOutput) {
  console.log(
    JSON.stringify(
      {
        ok: checks.every((check) => check.status === "pass"),
        output: domainSpecRelative(outputPath),
        checks,
      },
      null,
      2,
    ),
  );
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, report, "utf-8");
  console.log(
    `Governance attenuation audit written: ${domainSpecRelative(outputPath)}`,
  );
}

process.exit(checks.some((check) => check.status === "block") ? 1 : 0);

function runCheck(input: {
  id: string;
  script: string;
  args: string[];
  interpretation: string;
  exitPolicy: "zero-pass-nonzero-block" | "zero-pass-one-flag-other-block";
}): CheckResult {
  const scriptPath = resolveDomainSpecPath(input.script);
  if (!existsSync(scriptPath)) {
    return {
      id: input.id,
      command: ["pnpm", "dlx", "tsx", scriptPath, ...input.args],
      status: "block",
      exitCode: null,
      stdout: "",
      stderr: `Missing script: ${domainSpecRelative(scriptPath)}`,
      interpretation: input.interpretation,
    };
  }

  const command = ["pnpm", "dlx", "tsx", scriptPath, ...input.args];
  const result = spawnSync(command[0], command.slice(1), {
    encoding: "utf-8",
  });
  const exitCode = result.status;
  const status =
    exitCode === 0
      ? "pass"
      : input.exitPolicy === "zero-pass-one-flag-other-block" && exitCode === 1
        ? "flag"
        : "block";

  return {
    id: input.id,
    command,
    status,
    exitCode,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
    interpretation: input.interpretation,
  };
}

function buildReport(results: CheckResult[]): string {
  const lines: string[] = [];
  lines.push("# Governance Attenuation Audit");
  lines.push("");
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push(`Signals: ${domainSpecRelative(signalsPath)}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Check | Status | Exit | Interpretation |");
  lines.push("|---|---|---:|---|");
  for (const check of results) {
    lines.push(
      `| ${check.id} | ${check.status} | ${check.exitCode ?? "n/a"} | ${check.interpretation} |`,
    );
  }
  lines.push("");
  lines.push("## Details");
  for (const check of results) {
    lines.push("");
    lines.push(`### ${check.id}`);
    lines.push("");
    lines.push(`Status: \`${check.status}\``);
    lines.push("");
    lines.push("Command:");
    lines.push("");
    lines.push("```bash");
    lines.push(check.command.map(shellQuote).join(" "));
    lines.push("```");
    if (check.stdout) {
      lines.push("");
      lines.push("Stdout:");
      lines.push("");
      lines.push("```text");
      lines.push(trimOutput(check.stdout));
      lines.push("```");
    }
    if (check.stderr) {
      lines.push("");
      lines.push("Stderr:");
      lines.push("");
      lines.push("```text");
      lines.push(trimOutput(check.stderr));
      lines.push("```");
    }
  }
  return lines.join("\n") + "\n";
}

function trimOutput(value: string): string {
  return value.length > 6000
    ? `${value.slice(0, 6000)}\n...[truncated]`
    : value;
}

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9_./:=@-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}
