// CLI surface for the engine. Subcommands: roundtrip, derive, lint.
// `roundtrip` runs the financial-settlement L0 falsification gate.

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { parse } from "./grammar/index.js";
import { derive } from "./rules/index.js";
import { emitSpec } from "./emit/spec.js";
import { emitTests, emitHybridTests } from "./emit/tests.js";
import { loadBindings } from "./bindings/index.js";
import {
  deriveDescriptor,
  engineSemanticSet,
  parseCommittedSpec2,
  semanticRoundTrip,
} from "./roundtrip/index.js";
import { runNegativeControl } from "./roundtrip/negative-control.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolve a poker-team feature dir relative to this package. */
function featureDirFor(feature: string): string {
  // tools/test-derivation-engine/src/cli.ts -> repo .../implementation/domainspec
  // features live in the sibling submodule validation/poker-team.
  return resolve(
    __dirname,
    `../../../../../validation/poker-team/docs/features/${feature}`,
  );
}

function runRoundtrip(feature: string): number {
  const featureDir = featureDirFor(feature);
  const specPath = join(featureDir, "TEST-SPEC.md");

  const { graph, violations } = parse(featureDir);
  if (violations.length > 0) {
    console.error("Parser violations (non-canonical input, not guessed):");
    for (const v of violations) console.error(`  - ${v}`);
  }

  const obligations = derive(graph);
  // Bootstrap the committed spec (to know the dialect), then derive the full dialect
  // descriptor from the docs, then RE-parse the committed spec with the concept
  // aliases applied symmetrically to both sides.
  const bootstrap = parseCommittedSpec2(specPath);
  const descriptor = deriveDescriptor(graph, bootstrap);
  const committed = parseCommittedSpec2(specPath, descriptor.conceptAliases);
  const derivedSemantic = engineSemanticSet(obligations, {
    qualified: descriptor.idScope === "per-operation",
    conceptAliases: descriptor.conceptAliases,
  });
  const report = semanticRoundTrip(derivedSemantic, committed.semantic);

  console.log(`=== Round-Trip: ${feature} ===`);
  console.log(`Feature dir:        ${featureDir}`);
  console.log(
    `Committed dialect:  ${descriptor.dialect} (id-scope: ${descriptor.idScope})`,
  );
  console.log(
    `Concept aliases:    ${
      [...descriptor.conceptAliases.entries()]
        .filter(([k, v]) => k !== v)
        .map(([k, v]) => `${k}->${v}`)
        .join(", ") || "(none)"
    }`,
  );
  console.log(
    `Engine obligations: ${obligations.length} (raw, exact-cardinality)`,
  );
  console.log(`Derived (semantic): ${report.derivedCount}`);
  console.log(`Committed (semantic): ${report.committedCount}`);
  console.log("");
  console.log(
    `MISSING — GENUINE (δ gap / convention drift): ${report.genuineMissing.length}`,
  );
  for (const m of report.genuineMissing)
    console.log(`  - ${m.id}  | ${m.description}`);
  console.log("");
  console.log(
    `MISSING — DOCUMENTED-IRREDUCIBLE (per-assertion prose / impl-oracle): ${report.irreducibleMissing.length}`,
  );
  for (const m of report.irreducibleMissing)
    console.log(`  ~ ${m.id}  | ${m.description}`);
  console.log("");
  console.log(`EXTRA (derived not committed): ${report.extra.length}`);
  for (const e of report.extra) console.log(`  + ${e}`);
  console.log("");
  const verdict = report.cleanPass
    ? "PASS (clean)"
    : report.pass
      ? "PASS (at declared scope — irreducible residue only)"
      : "FAIL";
  console.log(`VERDICT: ${verdict}`);
  return report.pass ? 0 : 3;
}

/**
 * INV-3 guard. Runs the negative control over a feature's real engine/committed
 * pair and FAILS (exit non-zero) if the gate cannot detect a deliberately
 * injected obligation or a deliberately removed key. "No feature PASS may be
 * reported unless the negative control passes."
 */
function runSelfCheck(feature: string): number {
  const featureDir = featureDirFor(feature);
  const specPath = join(featureDir, "TEST-SPEC.md");
  const { graph } = parse(featureDir);
  const bootstrap = parseCommittedSpec2(specPath);
  const descriptor = deriveDescriptor(graph, bootstrap);
  const committed = parseCommittedSpec2(specPath, descriptor.conceptAliases);
  const derived = engineSemanticSet(derive(graph), {
    qualified: descriptor.idScope === "per-operation",
    conceptAliases: descriptor.conceptAliases,
  });
  const result = runNegativeControl(derived, committed.semantic);

  console.log(`=== Self-Check (INV-3 negative control): ${feature} ===`);
  for (const note of result.notes) console.log(`  - ${note}`);
  console.log("");
  console.log(
    `VERDICT: ${result.ok ? "GATE-CAN-FAIL (ok)" : "GATE-BROKEN — no PASS may be trusted"}`,
  );
  return result.ok ? 0 : 5;
}

/** Resolve a CLI arg to a directory: a path if it points to one, else a feature name. */
function resolveTarget(arg: string): string {
  const asPath = resolve(arg);
  if (existsSync(asPath)) return asPath;
  return featureDirFor(arg);
}

function runDerive(arg: string | undefined): number {
  if (!arg) {
    console.error("derive: requires a feature name or directory argument");
    return 1;
  }
  const { graph, violations } = parse(resolveTarget(arg));
  for (const v of violations) console.error(`violation: ${v}`);
  const obligations = derive(graph);
  console.log(emitSpec(obligations));
  return 0;
}

/** Engine package root (…/tools/test-derivation-engine). */
function pkgRoot(): string {
  return resolve(__dirname, "..");
}

/** Private-umbrella repo root: pkg -> tools -> domainspec -> implementation -> root. */
function repoRoot(): string {
  return resolve(__dirname, "../../../../..");
}

/** Path to a feature's binding sidecar, or null if none is committed. */
function bindingsPathFor(feature: string): string | null {
  const path = join(pkgRoot(), "bindings", `${feature}.json`);
  return existsSync(path) ? path : null;
}

function runEmitTests(arg: string | undefined): number {
  if (!arg) {
    console.error("emit-tests: requires a feature name or directory argument");
    return 1;
  }
  const { graph, violations } = parse(resolveTarget(arg));
  for (const v of violations) console.error(`violation: ${v}`);
  const obligations = derive(graph);

  // Hybrid mode iff a binding sidecar exists for this feature; else legacy stubs.
  const bindingsPath = bindingsPathFor(arg);
  if (!bindingsPath) {
    console.log(emitTests(obligations));
    return 0;
  }

  const bindings = loadBindings(bindingsPath);
  const { file, report } = emitHybridTests(obligations, bindings, graph);
  const outPath = join(repoRoot(), bindings.emit_dir, bindings.test_file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, file, "utf8");

  console.error(`=== emit-tests (hybrid): ${arg} ===`);
  console.error(`Wrote: ${outPath}`);
  console.error(`Obligations:   ${report.total}`);
  console.error(
    `Derivable:     ${report.assertions} assertion(s) + ${report.properties} property(ies) = ${report.assertions + report.properties}`,
  );
  console.error(
    `coverage_gap:  ${report.coverageGaps} (it.skip, reported not faked)`,
  );
  // The emitted suite goes to stdout too, so callers can pipe/inspect.
  console.log(file);
  return 0;
}

/**
 * Canonical-form linter. Reports two violation classes for a feature dir:
 *   1. non-canonical tables (parser violations: missing/renamed required columns), and
 *   2. unparseable Formal cells (needs_formal obligations — prose the sub-grammar
 *      cannot classify deterministically).
 * Exits non-zero when either class is non-empty.
 */
function runLint(arg: string | undefined): number {
  if (!arg) {
    console.error("lint: requires a feature name or directory argument");
    return 1;
  }
  const target = resolveTarget(arg);
  const { graph, violations } = parse(target);
  const obligations = derive(graph);
  const needsFormal = obligations.filter((o) => o.rule_type === "needs-formal");

  console.log(`=== Lint: ${target} ===`);
  console.log("");
  console.log(`Non-canonical tables: ${violations.length}`);
  for (const v of violations) console.log(`  - ${v}`);
  console.log("");
  console.log(`Unparseable Formal cells (needs_formal): ${needsFormal.length}`);
  for (const o of needsFormal)
    console.log(`  ! ${o.source_anchor}  | ${o.description}`);
  console.log("");

  const violationCount = violations.length + needsFormal.length;
  console.log(
    `VERDICT: ${violationCount === 0 ? "CLEAN" : "VIOLATIONS"} (${violationCount})`,
  );
  return violationCount === 0 ? 0 : 4;
}

function main(): void {
  const [, , command, arg] = process.argv;
  switch (command) {
    case "roundtrip":
      process.exit(runRoundtrip(arg ?? "financial-settlement"));
      break;
    case "self-check":
      process.exit(runSelfCheck(arg ?? "financial-settlement"));
      break;
    case "derive":
      process.exit(runDerive(arg));
      break;
    case "emit-tests":
      process.exit(runEmitTests(arg));
      break;
    case "lint":
      process.exit(runLint(arg));
      break;
    default:
      console.error(
        `unknown command: ${command ?? "(none)"} — expected roundtrip | self-check | derive | emit-tests | lint`,
      );
      process.exit(1);
  }
}

main();
