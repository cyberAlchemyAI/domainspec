#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const feature = getArg("--feature") || "cross-feature";
const session = getArg("--session") || `fast-observer-${new Date().toISOString().slice(0, 10)}`;
const range = getArg("--range") || "HEAD~1..HEAD";
const mode = getArg("--mode") || "audit";
const output = getArg("--output") || "docs/signals/pipeline-signals.jsonl";
const strictSince =
  getArg("--strict-since") || process.env.SIGNAL_STRICT_SINCE || "2026-04-18T19:31:00Z";

run(
  `npx tsx domainspec/tools/detect-signals.ts --feature ${feature} --session ${session} --mode ${mode} --source fast-observer --range ${range} --output ${output}`,
);
run(
  `npx tsx domainspec/tools/validate-signals.ts --input ${output} --strict-since ${strictSince}`,
);

const outputPath = resolve(process.cwd(), output);
if (!existsSync(outputPath)) {
  console.log("Fast observer completed with no signal file found.");
  process.exit(0);
}

const recent = readFileSync(outputPath, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    try {
      return JSON.parse(line) as {
        session: string;
        severity: string;
        type: string;
        data: { description?: string };
      };
    } catch {
      return null;
    }
  })
  .filter((item) => item && item.session === session) as Array<{
  session: string;
  severity: string;
  type: string;
  data: { description?: string };
}>;

const blockers = recent.filter(
  (signal) =>
    signal.type === "governance-gap" &&
    (signal.severity === "CRITICAL" || signal.severity === "HIGH"),
);

if (blockers.length > 0) {
  console.log("Fast observer found blocking governance gaps:");
  for (const blocker of blockers) {
    console.log(`- ${blocker.severity}: ${blocker.data.description || "no description"}`);
  }
  process.exit(1);
}

console.log(`Fast observer completed successfully for session ${session}`);

function run(command: string): void {
  execSync(command, { stdio: "inherit" });
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}
