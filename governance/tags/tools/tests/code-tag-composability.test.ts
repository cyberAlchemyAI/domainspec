import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisDir = dirname(fileURLToPath(import.meta.url));
const frameworkRoot = resolve(thisDir, "../../../../");

const composabilityScript =
  "governance/tags/tools/check-code-tag-composability.ts";

function runTsxScript(args: string[]) {
  return spawnSync("pnpm", ["dlx", "tsx", ...args], {
    cwd: frameworkRoot,
    encoding: "utf-8",
  });
}

function writeExtractionFixture(
  tempRoot: string,
  withRuleCall: boolean,
): string {
  const srcDir = join(tempRoot, "src");
  mkdirSync(srcDir, { recursive: true });

  writeFileSync(
    join(srcDir, "rules.ts"),
    [
      "export function maxAmountRule(amount: number, max: number): boolean {",
      "  return amount <= max;",
      "}",
      "",
    ].join("\n"),
    "utf-8",
  );

  const operationBody = withRuleCall
    ? [
        'import { maxAmountRule } from "./rules";',
        "",
        "export function processPayment(amount: number): { ok: true } {",
        "  if (!maxAmountRule(amount, 10000)) {",
        '    throw new Error("MAX_AMOUNT_EXCEEDED");',
        "  }",
        "  return { ok: true };",
        "}",
        "",
      ].join("\n")
    : [
        "export function processPayment(amount: number): { ok: true } {",
        "  if (amount <= 0) {",
        '    throw new Error("INVALID_AMOUNT");',
        "  }",
        "  return { ok: true };",
        "}",
        "",
      ].join("\n");

  writeFileSync(join(srcDir, "operations.ts"), operationBody, "utf-8");

  const extractionPath = join(tempRoot, "code-tags.json");
  writeFileSync(
    extractionPath,
    JSON.stringify(
      {
        meta: {
          generatedAt: new Date().toISOString(),
          mode: "strict",
          include: ["src"],
          root: tempRoot,
        },
        tags: [
          {
            file: "src/rules.ts",
            line: 1,
            symbol: "maxAmountRule",
            language: "ts",
            concept: {
              id: "payment.MaxAmountRule",
              type: "Rule",
            },
            edges: [
              {
                edge: "enforces",
                to: "payment.ProcessPayment",
              },
            ],
          },
          {
            file: "src/operations.ts",
            line: 3,
            symbol: "processPayment",
            language: "ts",
            concept: {
              id: "payment.ProcessPayment",
              type: "Operation",
            },
            edges: [],
          },
        ],
        issues: [],
        stats: {
          scannedFiles: 2,
          taggedSymbols: 2,
          issues: 0,
        },
      },
      null,
      2,
    ) + "\n",
    "utf-8",
  );

  return extractionPath;
}

function writeExposesFixture(
  tempRoot: string,
  withInterfaceCall: boolean,
): string {
  const srcDir = join(tempRoot, "src");
  mkdirSync(srcDir, { recursive: true });

  writeFileSync(
    join(srcDir, "operations.ts"),
    [
      "export async function createRecord(payload: unknown) {",
      "  return { ok: true, payload };",
      "}",
      "",
    ].join("\n"),
    "utf-8",
  );

  const interfaceBody = withInterfaceCall
    ? [
        'import { createRecord } from "./operations";',
        "",
        "export async function postRecordsController(payload: unknown) {",
        "  return createRecord(payload);",
        "}",
        "",
      ].join("\n")
    : [
        "export async function postRecordsController(payload: unknown) {",
        "  return { accepted: true, payload };",
        "}",
        "",
      ].join("\n");

  writeFileSync(join(srcDir, "interface.ts"), interfaceBody, "utf-8");

  const extractionPath = join(tempRoot, "code-tags-exposes.json");
  writeFileSync(
    extractionPath,
    JSON.stringify(
      {
        meta: {
          generatedAt: new Date().toISOString(),
          mode: "strict",
          include: ["src"],
          root: tempRoot,
        },
        tags: [
          {
            file: "src/interface.ts",
            line: 1,
            symbol: "postRecordsController",
            language: "ts",
            concept: {
              id: "catalog.RecordAPI",
              type: "Interface",
            },
            edges: [
              {
                edge: "exposes",
                to: "catalog.CreateRecord",
              },
            ],
          },
          {
            file: "src/operations.ts",
            line: 1,
            symbol: "createRecord",
            language: "ts",
            concept: {
              id: "catalog.CreateRecord",
              type: "Operation",
            },
            edges: [],
          },
        ],
        issues: [],
        stats: {
          scannedFiles: 2,
          taggedSymbols: 2,
          issues: 0,
        },
      },
      null,
      2,
    ) + "\n",
    "utf-8",
  );

  return extractionPath;
}

test("check-code-tag-composability passes when operation calls enforcing rule", () => {
  const tempRoot = mkdtempSync(
    join(tmpdir(), "domainspec-composability-test-"),
  );

  try {
    const extractionPath = writeExtractionFixture(tempRoot, true);

    const result = runTsxScript([
      composabilityScript,
      "--input",
      extractionPath,
      "--mode",
      "strict",
      "--json",
    ]);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.ok, true);
    assert.equal(payload.blockingIssues, 0);
    assert.equal(payload.checks, 1);
    assert.equal(payload.passedChecks, 1);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("check-code-tag-composability fails when operation does not call enforcing rule", () => {
  const tempRoot = mkdtempSync(
    join(tmpdir(), "domainspec-composability-test-"),
  );

  try {
    const extractionPath = writeExtractionFixture(tempRoot, false);

    const result = runTsxScript([
      composabilityScript,
      "--input",
      extractionPath,
      "--mode",
      "strict",
      "--json",
    ]);

    assert.equal(result.status, 1, result.stderr || result.stdout);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.ok, false);
    assert.equal(payload.blockingIssues > 0, true);
    assert.equal(
      payload.report.some(
        (entry: { code: string }) => entry.code === "CT-COMP-001",
      ),
      true,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("check-code-tag-composability passes when interface exposes operation via call", () => {
  const tempRoot = mkdtempSync(
    join(tmpdir(), "domainspec-composability-test-"),
  );

  try {
    const extractionPath = writeExposesFixture(tempRoot, true);

    const result = runTsxScript([
      composabilityScript,
      "--input",
      extractionPath,
      "--mode",
      "strict",
      "--json",
    ]);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.ok, true);
    assert.equal(payload.blockingIssues, 0);
    assert.equal(payload.checks, 1);
    assert.equal(payload.passedChecks, 1);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("check-code-tag-composability fails when interface does not call exposed operation", () => {
  const tempRoot = mkdtempSync(
    join(tmpdir(), "domainspec-composability-test-"),
  );

  try {
    const extractionPath = writeExposesFixture(tempRoot, false);

    const result = runTsxScript([
      composabilityScript,
      "--input",
      extractionPath,
      "--mode",
      "strict",
      "--json",
    ]);

    assert.equal(result.status, 1, result.stderr || result.stdout);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.ok, false);
    assert.equal(payload.blockingIssues > 0, true);
    assert.equal(
      payload.report.some(
        (entry: { code: string }) => entry.code === "CT-COMP-004",
      ),
      true,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
