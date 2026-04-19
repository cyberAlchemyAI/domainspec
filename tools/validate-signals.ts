#!/usr/bin/env tsx

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type Signal = {
  id: string;
  timestamp: string;
  session: string;
  feature?: string;
  features?: string[];
  domainspecVersion: string;
  pipelineMode: string;
  source?: string;
  type: string;
  severity: string;
  category: string;
  data: Record<string, unknown>;
};

type SessionState = {
  hasStepVerdict: boolean;
  overheadCount: number;
  retriesNeeded: number;
  reworkCount: number;
  strict: boolean;
};

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const strictSinceArg = getArg("--strict-since");
const strictSince = strictSinceArg ? Date.parse(strictSinceArg) : Number.NaN;
const hasStrictSince = strictSinceArg !== undefined && Number.isFinite(strictSince);
const warningLimit = Math.max(0, Number(getArg("--warning-limit") || "25"));
const inputIdx = args.indexOf("--input");
const inputPath =
  inputIdx >= 0
    ? resolve(process.cwd(), args[inputIdx + 1] || "")
    : resolve(process.cwd(), "docs/signals/pipeline-signals.jsonl");

const allowedPipelineMode = new Set(["new", "evolution", "audit"]);
const allowedSeverity = new Set(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const allowedCategory = new Set([
  "economy",
  "governance",
  "pattern",
  "quality",
  "operations",
]);
const allowedSource = new Set([
  "session-epilogue",
  "fast-observer",
  "async-observer",
  "ci-detector",
]);

const typeCategory: Record<string, string> = {
  "step-verdict": "economy",
  rework: "economy",
  overhead: "economy",
  "alignment-gap": "quality",
  "spec-gap": "quality",
  "governance-gap": "governance",
  proposal: "governance",
  "spec-compliance": "governance",
  decision: "pattern",
  pattern: "pattern",
  "agent-cost": "operations",
};

if (!existsSync(inputPath)) {
  reportAndExit([`Input file not found: ${inputPath}`], [], 2);
}

if (strictSinceArg !== undefined && !Number.isFinite(strictSince)) {
  reportAndExit([`Invalid --strict-since value: ${strictSinceArg}`], [], 2);
}

const raw = readFileSync(inputPath, "utf-8");
const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const errors: string[] = [];
const warnings: string[] = [];
const sessions = new Map<string, SessionState>();
const seen = new Set<string>();

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (!line) continue;

  let signal: Signal;
  try {
    signal = JSON.parse(line) as Signal;
  } catch {
    errors.push(`Line ${i + 1}: invalid JSON`);
    continue;
  }

  const signalTime = Date.parse(signal.timestamp || "");
  const isStrictLine =
    !hasStrictSince || (Number.isFinite(signalTime) && signalTime >= strictSince);

  const lineErrors = validateEnvelope(signal, i + 1);
  if (lineErrors.length > 0) {
    if (isStrictLine) {
      errors.push(...lineErrors);
    } else {
      warnings.push(...lineErrors.map((msg) => `${msg} (legacy signal outside strict window)`));
    }
  }

  const desc = extractDescription(signal);
  const duplicateKey = `${signal.session}|${signal.type}|${signal.feature || ""}|${desc}`;
  if (seen.has(duplicateKey) && desc) {
    warnings.push(`Line ${i + 1}: possible duplicate signal for key ${duplicateKey}`);
  }
  seen.add(duplicateKey);

  const state = sessions.get(signal.session) || {
    hasStepVerdict: false,
    overheadCount: 0,
    retriesNeeded: 0,
    reworkCount: 0,
    strict: false,
  };

  if (isStrictLine) {
    state.strict = true;
  }

  if (signal.type === "step-verdict") {
    state.hasStepVerdict = true;
    const retries = toNumber(signal.data.retriesNeeded);
    if (retries > 0) {
      state.retriesNeeded += retries;
    }
  }

  if (signal.type === "overhead") {
    state.overheadCount += 1;
  }

  if (signal.type === "rework") {
    state.reworkCount += 1;
  }

  sessions.set(signal.session, state);
}

for (const [session, state] of sessions.entries()) {
  const completenessErrors: string[] = [];

  if (state.hasStepVerdict && state.overheadCount !== 1) {
    completenessErrors.push(
      `Session ${session}: completeness invariant violated: expected exactly one overhead signal when step-verdict exists`,
    );
  }

  if (state.retriesNeeded > 0 && state.reworkCount < 1) {
    completenessErrors.push(
      `Session ${session}: completeness invariant violated: retries detected without rework signal`,
    );
  }

  if (completenessErrors.length > 0) {
    if (state.strict) {
      errors.push(...completenessErrors);
    } else {
      warnings.push(...completenessErrors.map((msg) => `${msg} (legacy session outside strict window)`));
    }
  }
}

reportAndExit(errors, warnings, errors.length > 0 ? 1 : 0);

function validateEnvelope(signal: Signal, line: number): string[] {
  const out: string[] = [];

  if (!isUuidV4(signal.id)) {
    out.push(`Line ${line}: id must be UUID v4`);
  }

  if (!signal.timestamp || Number.isNaN(Date.parse(signal.timestamp))) {
    out.push(`Line ${line}: timestamp must be valid ISO date`);
  }

  if (!signal.session) {
    out.push(`Line ${line}: missing session`);
  }

  const hasFeature = typeof signal.feature === "string" && signal.feature.length > 0;
  const hasFeatures = Array.isArray(signal.features) && signal.features.length > 0;
  if (!hasFeature && !hasFeatures) {
    out.push(`Line ${line}: must provide feature or features`);
  }

  if (!allowedPipelineMode.has(signal.pipelineMode)) {
    out.push(`Line ${line}: invalid pipelineMode ${signal.pipelineMode}`);
  }

  if (!allowedSeverity.has(signal.severity)) {
    out.push(`Line ${line}: invalid severity ${signal.severity}`);
  }

  if (!allowedCategory.has(signal.category)) {
    out.push(`Line ${line}: invalid category ${signal.category}`);
  }

  if (signal.source && !allowedSource.has(signal.source)) {
    out.push(`Line ${line}: invalid source ${signal.source}`);
  }

  if (!typeCategory[signal.type]) {
    out.push(`Line ${line}: unknown signal type ${signal.type}`);
    return out;
  }

  const expectedCategory = typeCategory[signal.type];
  if (expectedCategory !== signal.category) {
    out.push(
      `Line ${line}: invalid category for ${signal.type}, expected ${expectedCategory}, got ${signal.category}`,
    );
  }

  return out;
}

function extractDescription(signal: Signal): string {
  const data = signal.data || {};
  const keys = ["description", "summary", "missingDetail", "changeDescription"];
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return "";
}

function isUuidV4(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}

function reportAndExit(errorsList: string[], warningsList: string[], code: number): never {
  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          ok: code === 0,
          errors: errorsList,
          warnings: warningsList,
          warningCount: warningsList.length,
          input: inputPath,
          strictSince: hasStrictSince ? strictSinceArg : null,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`Signal validation input: ${inputPath}`);
    if (hasStrictSince) {
      console.log(`Strict enforcement window starts at: ${strictSinceArg}`);
    }
    if (warningsList.length > 0) {
      console.log("Warnings:");
      const limitedWarnings = warningsList.slice(0, warningLimit);
      for (const warning of limitedWarnings) {
        console.log(`- ${warning}`);
      }
      if (warningsList.length > limitedWarnings.length) {
        console.log(
          `- ... ${warningsList.length - limitedWarnings.length} additional warning(s) hidden; use --warning-limit to adjust output`,
        );
      }
    }
    if (errorsList.length > 0) {
      console.log("Errors:");
      for (const error of errorsList) {
        console.log(`- ${error}`);
      }
    } else {
      console.log("Signal validation passed.");
    }
  }

  process.exit(code);
}
