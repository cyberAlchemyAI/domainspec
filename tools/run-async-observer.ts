#!/usr/bin/env tsx

import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type TelemetryBundle = {
  sessionId: string;
  changedFiles?: string[];
  orderedEvents?: Array<{ timestamp: string; message: string }>;
  testEvents?: Array<{ timestamp: string; message: string }>;
};

type Signal = {
  id: string;
  timestamp: string;
  session: string;
  feature: string;
  domainspecVersion: string;
  pipelineMode: "new" | "evolution" | "audit";
  source: "async-observer";
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: "economy" | "governance" | "pattern" | "quality" | "operations";
  data: Record<string, unknown>;
};

const args = process.argv.slice(2);
const bundlePath = resolve(
  process.cwd(),
  getArg("--bundle") || "docs/signals/telemetry/latest.json",
);
const outputPath = resolve(
  process.cwd(),
  getArg("--output") || "docs/signals/pipeline-signals.jsonl",
);
const feature = getArg("--feature") || "cross-feature";
const modeArg = getArg("--mode") || "audit";
const pipelineMode: Signal["pipelineMode"] =
  modeArg === "new" || modeArg === "evolution" || modeArg === "audit"
    ? modeArg
    : "audit";

if (!existsSync(bundlePath)) {
  console.log(`Telemetry bundle not found: ${bundlePath}`);
  process.exit(0);
}

const bundle = JSON.parse(readFileSync(bundlePath, "utf-8")) as TelemetryBundle;
const session = bundle.sessionId || `async-observer-${new Date().toISOString().slice(0, 10)}`;
const version = getDomainspecVersion();

const events = bundle.orderedEvents || [];
const changedFiles = bundle.changedFiles || [];

const signals: Signal[] = [];

const hasFail = events.some((event) => /fail|error|exception/i.test(event.message));
const hasPass = events.some((event) => /pass|ok|success/i.test(event.message));
if (hasFail && hasPass) {
  signals.push(
    buildSignal({
      session,
      feature,
      version,
      pipelineMode,
      type: "rework",
      severity: "LOW",
      category: "economy",
      data: {
        step: "observer",
        stepName: "Async Deep Observer",
        iterations: 2,
        rootCause: "Fail->fix->pass pattern detected in telemetry",
        resolution: "Detected from chronological command/test events",
        timeWasted: "minor",
      },
    }),
  );
}

const testFileChanges = changedFiles.filter((path) => /test|spec|\.e2e\./i.test(path));
const nonTestChanges = changedFiles.filter((path) => !/test|spec|\.e2e\./i.test(path));
if (testFileChanges.length > 0 && nonTestChanges.length > 0) {
  signals.push(
    buildSignal({
      session,
      feature,
      version,
      pipelineMode,
      type: "pattern",
      severity: "LOW",
      category: "pattern",
      data: {
        summary: "Tests and implementation changed together in same session",
        context: "Async observer telemetry analysis",
        applicability: "Can indicate healthy reinforcement if changes were intentional",
      },
    }),
  );
}

const docsOnly = nonTestChanges.every((path) => path.startsWith("docs/"));
if (docsOnly && testFileChanges.length > 0) {
  signals.push(
    buildSignal({
      session,
      feature,
      version,
      pipelineMode,
      type: "governance-gap",
      severity: "MEDIUM",
      category: "governance",
      data: {
        description: "Scope drift: test changes detected during docs-only change set",
        shouldHaveBeenCaughtBy: "async-observer",
        skillFile: ".github/skills/domainspec-signal-observer/SKILL.md",
        suggestedFix: "Reclassify scope or isolate test hardening into explicit execution plan",
        occurrences: testFileChanges.length,
      },
    }),
  );
}

if (signals.length === 0) {
  console.log("Async observer found no behavior-level signals.");
  process.exit(0);
}

appendFileSync(outputPath, signals.map((s) => JSON.stringify(s)).join("\n") + "\n", "utf-8");
console.log(`Async observer appended ${signals.length} signal(s) from ${bundlePath}`);

function buildSignal(input: {
  session: string;
  feature: string;
  version: string;
  pipelineMode: Signal["pipelineMode"];
  type: Signal["type"];
  severity: Signal["severity"];
  category: Signal["category"];
  data: Record<string, unknown>;
}): Signal {
  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    session: input.session,
    feature: input.feature,
    domainspecVersion: input.version,
    pipelineMode: input.pipelineMode,
    source: "async-observer",
    type: input.type,
    severity: input.severity,
    category: input.category,
    data: input.data,
  };
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
