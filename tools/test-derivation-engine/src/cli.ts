// CLI surface for the engine. Subcommands: roundtrip, derive, lint.
// `roundtrip` runs the financial-settlement L0 falsification gate.

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { parse } from "./grammar/index.js";
import { derive } from "./rules/index.js";
import {
  emitEngineRegionBody,
  emitSpec,
  emitTestSpecDocument,
} from "./emit/spec.js";
import { emitTests, emitHybridTests } from "./emit/tests.js";
import { loadBindings } from "./bindings/index.js";
import {
  CANONICAL_DOCS,
  computeProvenance,
  extractEngineRegion,
} from "./provenance/index.js";
import {
  allocateIds,
  detectIdDrift,
  loadIdMap,
  writeIdMap,
} from "./identity/human-id.js";
import { containmentError } from "./paths/containment.js";
import {
  deriveDescriptor,
  engineSemanticSet,
  parseCommittedSpec2,
  semanticRoundTrip,
} from "./roundtrip/index.js";
import { runNegativeControl } from "./roundtrip/negative-control.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Best-effort engine commit (provenance only; volatile, kept OUT of the drift region). */
function engineCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

/** Feature name from a resolved feature dir (its basename). */
function featureNameOf(featureDir: string): string {
  return featureDir.split("/").filter(Boolean).pop() ?? "feature";
}

/** Canonical docs actually present in a feature dir (for the completeness gate). */
function presentDocsIn(featureDir: string): string[] {
  return CANONICAL_DOCS.filter((d) => existsSync(join(featureDir, d)));
}

/** Committed id-map sidecar path (parallels bindings/). */
function idMapPathFor(feature: string): string {
  return join(pkgRoot(), "id-maps", `${feature}.idmap.json`);
}

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

function runDerive(
  arg: string | undefined,
  flags: ReadonlySet<string>,
): number {
  if (!arg) {
    console.error("derive: requires a feature name or directory argument");
    return 1;
  }
  const featureDir = resolveTarget(arg);
  const feature = featureNameOf(featureDir);
  const { graph, violations } = parse(featureDir);

  // Fail-closed on the WRITE path (G4, SWU-3): never emit a spec from non-canonical
  // input — only `lint`/`roundtrip` may report-and-continue.
  if (violations.length > 0) {
    console.error(
      `derive: ${violations.length} parser violation(s) — refusing to emit (fail-closed):`,
    );
    for (const v of violations) console.error(`  - ${v}`);
    return 4;
  }

  const obligations = derive(graph);

  if (!flags.has("--out")) {
    // Legacy stdout table (no file, no id allocation).
    console.log(emitSpec(obligations));
    return 0;
  }

  // --out: allocate stable human ids (Option C / D1) + write the full document
  // side-by-side as TEST-SPEC.engine.md (never overwrites the LLM TEST-SPEC.md).
  const outPath = join(featureDir, "TEST-SPEC.engine.md");
  const contain = containmentError(outPath, featureDir);
  if (contain) {
    console.error(`derive: ${contain}`);
    return 6;
  }

  const idMapPath = idMapPathFor(feature);
  const prevMap = loadIdMap(idMapPath, feature);
  const alloc = allocateIds(obligations, prevMap);

  const provenance = computeProvenance(featureDir, engineCommit());
  const presentDocs = presentDocsIn(featureDir);
  const doc = emitTestSpecDocument({
    feature,
    obligations,
    idByKey: alloc.idByKey,
    provenance,
    presentDocs,
  });

  mkdirSync(dirname(outPath), { recursive: true });
  mkdirSync(dirname(idMapPath), { recursive: true });
  writeIdMap(idMapPath, alloc.map);
  writeFileSync(outPath, doc, "utf8");

  console.error(`=== derive: ${feature} ===`);
  console.error(`Wrote spec:  ${outPath}`);
  console.error(`Wrote idmap: ${idMapPath}`);
  console.error(
    `Obligations: ${obligations.length}  (ids allocated: ${alloc.allocated.length}, tombstoned: ${alloc.tombstoned.length})`,
  );
  return 0;
}

/**
 * Drift `check` (G2 part 2 / D1). Read-only: re-derive and FAIL-CLOSED on
 *   1. parser violations,
 *   2. unmapped sha1 (new obligation; the committed id-map is stale),
 *   3. dangling id (committed id whose key no longer derives),
 *   4. stale committed TEST-SPEC (the engine region != freshly rendered).
 * Distinct from `roundtrip` (which compares vs the human catalogue, not staleness).
 */
function runCheck(arg: string | undefined): number {
  if (!arg) {
    console.error("check: requires a feature name or directory argument");
    return 1;
  }
  const featureDir = resolveTarget(arg);
  const feature = featureNameOf(featureDir);
  const { graph, violations } = parse(featureDir);

  console.log(`=== Drift Check: ${feature} ===`);
  let failed = false;

  if (violations.length > 0) {
    failed = true;
    console.log(`Parser violations: ${violations.length}`);
    for (const v of violations) console.log(`  - ${v}`);
  }

  const obligations = derive(graph);
  const idMapPath = idMapPathFor(feature);
  const committedMap = existsSync(idMapPath)
    ? loadIdMap(idMapPath, feature)
    : null;

  if (!committedMap) {
    failed = true;
    console.log(`id-map: MISSING (${idMapPath}) — run \`derive --out\` first`);
  } else {
    const drift = detectIdDrift(obligations, committedMap);
    console.log(
      `id-map unmapped (new obligation, no id): ${drift.unmapped.length}`,
    );
    console.log(
      `id-map dangling (id, key gone):          ${drift.dangling.length}`,
    );
    for (const d of drift.dangling) console.log(`  ~ ${d}`);
    if (!drift.ok) failed = true;
  }

  // Stale committed TEST-SPEC: compare the fenced engine region only (provenance,
  // with the volatile engine_commit, sits outside the region and is ignored).
  const specPath = join(featureDir, "TEST-SPEC.engine.md");
  if (!existsSync(specPath)) {
    failed = true;
    console.log("TEST-SPEC.engine.md: MISSING — run `derive --out` first");
  } else if (committedMap) {
    const alloc = allocateIds(obligations, committedMap);
    const freshRegion = emitEngineRegionBody(
      obligations,
      alloc.idByKey,
      presentDocsIn(featureDir),
    );
    const committedRegion = extractEngineRegion(readFileSync(specPath, "utf8"));
    const stale =
      committedRegion === null || committedRegion.trim() !== freshRegion.trim();
    console.log(
      `committed spec region: ${stale ? "STALE (docs changed since last derive)" : "fresh"}`,
    );
    if (stale) failed = true;
  }

  console.log("");
  console.log(`VERDICT: ${failed ? "DRIFT (re-run derive --out)" : "FRESH"}`);
  return failed ? 7 : 0;
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
  // Containment guard (G3, SWU-4): emit-tests is the live write path — a crafted
  // binding `emit_dir` must not escape the repo or write into public arcanum.
  const contain = containmentError(outPath, repoRoot());
  if (contain) {
    console.error(`emit-tests: ${contain}`);
    return 6;
  }
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
  const argv = process.argv.slice(2);
  const command = argv[0];
  const rest = argv.slice(1);
  const arg = rest.find((a) => !a.startsWith("--"));
  const flags = new Set(rest.filter((a) => a.startsWith("--")));
  switch (command) {
    case "roundtrip":
      process.exit(runRoundtrip(arg ?? "financial-settlement"));
      break;
    case "self-check":
      process.exit(runSelfCheck(arg ?? "financial-settlement"));
      break;
    case "derive":
      process.exit(runDerive(arg, flags));
      break;
    case "check":
      process.exit(runCheck(arg));
      break;
    case "emit-tests":
      process.exit(runEmitTests(arg));
      break;
    case "lint":
      process.exit(runLint(arg));
      break;
    default:
      console.error(
        `unknown command: ${command ?? "(none)"} — expected roundtrip | self-check | derive [--out] | check | emit-tests | lint`,
      );
      process.exit(1);
  }
}

main();
