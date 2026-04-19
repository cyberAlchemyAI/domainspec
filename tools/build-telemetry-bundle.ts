#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const sessionId = getArg("--session") || `session-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const gitRange = getArg("--range") || "HEAD~1..HEAD";
const logArg = getArg("--log");
const outputArg =
  getArg("--output") || `docs/signals/telemetry/${sessionId}.json`;

const outputPath = resolve(process.cwd(), outputArg);
const logPath =
  logArg || process.env.VSCODE_TARGET_SESSION_LOG || "";

const changedFiles = splitLines(execOrEmpty(`git --no-pager diff --name-only ${gitRange}`));
const diffSummary = execOrEmpty(`git --no-pager diff --stat ${gitRange}`);
const diffPatch = execOrEmpty(`git --no-pager diff --unified=0 ${gitRange}`);

const commandEvents = loadCommandEvents(logPath);
const testEvents = commandEvents.filter((e) => /test|vitest|playwright|jest/i.test(e.message));

const payload = {
  sessionId,
  createdAt: new Date().toISOString(),
  gitRange,
  sourceLogPath: logPath || null,
  changedFiles,
  diffSummary,
  diffPatchSnippet: trimSize(diffPatch, 16000),
  orderedEvents: commandEvents,
  testEvents,
};

mkdirSync(resolve(process.cwd(), "docs/signals/telemetry"), { recursive: true });
writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
console.log(`Telemetry bundle written: ${toRelative(outputPath)}`);

function loadCommandEvents(path: string): Array<{ timestamp: string; message: string }> {
  if (!path || !existsSync(path)) {
    return [
      {
        timestamp: new Date().toISOString(),
        message: "No session log found. Bundle includes git-derived telemetry only.",
      },
    ];
  }

  const raw = readFileSync(path, "utf-8");
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-400);

  return lines.map((line) => {
    const tsMatch = line.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/);
    return {
      timestamp: tsMatch?.[0] || new Date().toISOString(),
      message: trimSize(line, 500),
    };
  });
}

function trimSize(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n...[truncated]`;
}

function execOrEmpty(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function splitLines(input: string): string[] {
  return input
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getArg(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  return args[index + 1];
}

function toRelative(absPath: string): string {
  return absPath.replace(`${process.cwd()}/`, "");
}
