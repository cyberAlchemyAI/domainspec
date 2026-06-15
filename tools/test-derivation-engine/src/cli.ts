// CLI surface for the engine. Subcommands: roundtrip, derive, lint.
// `roundtrip` runs the financial-settlement L0 falsification gate.

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { parse } from "./grammar/index.js";
import { derive } from "./rules/index.js";
import { emitSpec } from "./emit/spec.js";
import { emitTests } from "./emit/tests.js";
import {
  engineSemanticSet,
  parseCommittedSpec2,
  semanticRoundTrip,
} from "./roundtrip/index.js";

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
  const committed = parseCommittedSpec2(specPath);
  const derivedSemantic = engineSemanticSet(obligations, {
    qualified: committed.qualified,
  });
  const report = semanticRoundTrip(derivedSemantic, committed.semantic);

  console.log(`=== Round-Trip: ${feature} ===`);
  console.log(`Feature dir:        ${featureDir}`);
  console.log(
    `Committed dialect:  ${committed.dialect}${committed.qualified ? " (op-qualified)" : ""}`,
  );
  console.log(
    `Engine obligations: ${obligations.length} (raw, exact-cardinality)`,
  );
  console.log(`Derived (semantic): ${report.derivedCount}`);
  console.log(`Committed (semantic): ${report.committedCount}`);
  console.log("");
  console.log(`MISSING (committed not derived): ${report.missing.length}`);
  for (const m of report.missing)
    console.log(`  - ${m.id}  | ${m.description}`);
  console.log("");
  console.log(`EXTRA (derived not committed): ${report.extra.length}`);
  for (const e of report.extra) console.log(`  + ${e}`);
  console.log("");
  console.log(`VERDICT: ${report.pass ? "PASS" : "FAIL"}`);
  return report.pass ? 0 : 3;
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

function runEmitTests(arg: string | undefined): number {
  if (!arg) {
    console.error("emit-tests: requires a feature name or directory argument");
    return 1;
  }
  const { graph, violations } = parse(resolveTarget(arg));
  for (const v of violations) console.error(`violation: ${v}`);
  const obligations = derive(graph);
  console.log(emitTests(obligations));
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
        `unknown command: ${command ?? "(none)"} — expected roundtrip | derive | emit-tests | lint`,
      );
      process.exit(1);
  }
}

main();
