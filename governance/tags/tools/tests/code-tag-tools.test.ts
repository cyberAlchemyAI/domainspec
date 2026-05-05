import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisDir = dirname(fileURLToPath(import.meta.url));
const frameworkRoot = resolve(thisDir, "../../../../");

const extractScript = "governance/tags/tools/extract-code-tags.ts";
const validateScript = "governance/tags/tools/validate-code-tags.ts";
const driftScript = "governance/tags/tools/compare-code-tag-drift.ts";

function runTsxScript(args: string[]) {
  return spawnSync("pnpm", ["dlx", "tsx", ...args], {
    cwd: frameworkRoot,
    encoding: "utf-8",
  });
}

function createTempFeaturesRoot(tempRoot: string): string {
  const featureDir = join(tempRoot, "docs", "features", "payments");
  mkdirSync(featureDir, { recursive: true });

  const spec = `# Payments Spec

## Concept Registry

| ID | Type |
| --- | --- |
| payment.MaxAmountRule | Rule |
| payment.ProcessPayment | Operation |
| payment.PaymentInitiated | Event |
| ui.payment.useCreatePayment | Binding |
| player-management.CreatePlayer | Operation |
| player-management.PlayerCreated | Event |

## Feature Concept Graph

| From | Edge | To |
| ---- | ---- | ---- |
| payment.MaxAmountRule | enforces | payment.ProcessPayment |
| ui.payment.useCreatePayment | mutates | payment.ProcessPayment |
| payment.ProcessPayment | produces | payment.PaymentInitiated |
| player-management.CreatePlayer | produces | player-management.PlayerCreated |
`;

  writeFileSync(join(featureDir, "SPEC.md"), spec, "utf-8");
  return join(tempRoot, "docs", "features");
}

function runExtract(outputPath: string) {
  return runTsxScript([
    extractScript,
    "--include",
    "governance/tags/tools/fixtures/code-tags",
    "--output",
    outputPath,
    "--mode",
    "strict",
    "--json",
  ]);
}

test("extract-code-tags parses fixture corpus", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "domainspec-code-tag-test-"));
  const outputPath = join(tempRoot, "code-tags.json");

  try {
    const result = runExtract(outputPath);
    assert.equal(result.status, 0, result.stderr || result.stdout);

    const payload = JSON.parse(result.stdout);
    assert.equal(payload.stats.scannedFiles, 3);
    assert.equal(payload.stats.taggedSymbols, 4);
    assert.equal(payload.stats.issues, 0);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("validate-code-tags accepts matching fixture concepts and edges", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "domainspec-code-tag-test-"));
  const outputPath = join(tempRoot, "code-tags.json");
  const featuresRoot = createTempFeaturesRoot(tempRoot);

  try {
    const extractResult = runExtract(outputPath);
    assert.equal(
      extractResult.status,
      0,
      extractResult.stderr || extractResult.stdout,
    );

    const validateResult = runTsxScript([
      validateScript,
      "--input",
      outputPath,
      "--features-root",
      featuresRoot,
      "--mode",
      "strict",
      "--json",
    ]);

    assert.equal(
      validateResult.status,
      0,
      validateResult.stderr || validateResult.stdout,
    );

    const payload = JSON.parse(validateResult.stdout);
    assert.equal(payload.ok, true);
    assert.equal(payload.blockingIssues, 0);
    assert.equal(payload.nonWaivedIssues, 0);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("validate-code-tags fails on stale spec_ref path mismatch", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "domainspec-code-tag-test-"));
  const outputPath = join(tempRoot, "code-tags.json");
  const featuresRoot = createTempFeaturesRoot(tempRoot);

  try {
    const extractResult = runExtract(outputPath);
    assert.equal(
      extractResult.status,
      0,
      extractResult.stderr || extractResult.stdout,
    );

    const extracted = JSON.parse(readFileSync(outputPath, "utf-8"));
    assert.equal(Array.isArray(extracted.tags), true);
    assert.equal(extracted.tags.length > 0, true);

    extracted.tags[0].concept.spec_ref.path = "docs/features/unknown/SPEC.md";
    writeFileSync(
      outputPath,
      JSON.stringify(extracted, null, 2) + "\n",
      "utf-8",
    );

    const validateResult = runTsxScript([
      validateScript,
      "--input",
      outputPath,
      "--features-root",
      featuresRoot,
      "--mode",
      "strict",
      "--json",
    ]);

    assert.equal(validateResult.status, 1, validateResult.stderr);

    const payload = JSON.parse(validateResult.stdout);
    assert.equal(payload.ok, false);
    assert.equal(payload.blockingIssues > 0, true);
    assert.equal(
      payload.report.some((entry: { code: string }) => entry.code === "CT-017"),
      true,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("compare-code-tag-drift passes when code and docs triples align", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "domainspec-code-tag-test-"));
  const outputPath = join(tempRoot, "code-tags.json");
  const reportPath = join(tempRoot, "CODE-TAG-DRIFT-REPORT.md");
  const featuresRoot = createTempFeaturesRoot(tempRoot);

  try {
    const extractResult = runExtract(outputPath);
    assert.equal(
      extractResult.status,
      0,
      extractResult.stderr || extractResult.stdout,
    );

    const driftResult = runTsxScript([
      driftScript,
      "--input",
      outputPath,
      "--features-root",
      featuresRoot,
      "--report",
      reportPath,
      "--mode",
      "strict",
    ]);

    assert.equal(
      driftResult.status,
      0,
      driftResult.stderr || driftResult.stdout,
    );

    const report = readFileSync(reportPath, "utf-8");
    assert.match(report, /- Docs only: 0/);
    assert.match(report, /- Code only: 0/);
    assert.match(report, /- Direction mismatch: 0/);
    assert.match(report, /- Type mismatch: 0/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
