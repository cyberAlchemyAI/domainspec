// Stage D (part 2) — emit_spec: render obligations to TEST-SPEC.md.
// Rows ordered by obligation_key for byte-stability. SWU-ENG-005.
// L1/L2 (this run): structural sections (completeness gate, coverage summary, suite
// partition, gap ledger) + the harness/formal tier split, rendered inside the fenced
// engine region with stable human IDs (Option C).

import type { Obligation, RuleType } from "../ir/types.js";
import {
  CANONICAL_DOCS,
  type Provenance,
  renderProvenanceHeader,
  wrapEngineRegion,
} from "../provenance/index.js";

/** Deterministic obligation order: by content-addressed key. */
function byKey(obligations: readonly Obligation[]): Obligation[] {
  return [...obligations].sort((a, b) =>
    a.obligation_key < b.obligation_key
      ? -1
      : a.obligation_key > b.obligation_key
        ? 1
        : 0,
  );
}

/** Render obligations as a deterministic TEST-SPEC.md body (legacy skeleton). */
export function emitSpec(obligations: readonly Obligation[]): string {
  const rows = byKey(obligations).map(
    (o) =>
      `| ${o.obligation_key.slice(0, 8)} | ${o.rule_type} | ${o.source_anchor} | ${o.description} |`,
  );
  return [
    "| Key | Rule | Source | Obligation |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

// --- L2: harness / formal obligation tier (G1) --------------------------------

export type Tier =
  | "derivable-pure" // checkable against a pure function (Unit)
  | "derivable-needs-harness" // derivable obligation, needs a runtime/effect (Integration)
  | "needs-formal"; // outside the decidable fence until a closed formula is authored

const TIER_OF: Record<RuleType, Tier> = {
  invariant: "derivable-pure",
  "rule-validation": "derivable-pure",
  calculation: "derivable-pure",
  postcondition: "derivable-pure",
  contract: "derivable-needs-harness",
  "event-obligation": "derivable-needs-harness",
  "valid-transition": "derivable-needs-harness",
  "invalid-transition": "derivable-needs-harness",
  "workflow-step": "derivable-needs-harness",
  "query-behavior": "derivable-needs-harness",
  "mapping-row": "derivable-needs-harness",
  "error-obligation": "derivable-needs-harness",
  "needs-formal": "needs-formal",
};

export function tierOf(rt: RuleType): Tier {
  return TIER_OF[rt];
}

// --- L1 structural sections + full document -----------------------------------

function countBy<T extends string>(items: readonly T[]): Map<T, number> {
  const m = new Map<T, number>();
  for (const it of items) m.set(it, (m.get(it) ?? 0) + 1);
  return m;
}

function completenessGate(presentDocs: readonly string[]): string[] {
  const present = new Set(presentDocs);
  const rows = CANONICAL_DOCS.map(
    (d) => `| ${d} | ${present.has(d) ? "present" : "absent"} |`,
  );
  return [
    "## Source Completeness Gate",
    "",
    "| Doc | Status |",
    "| --- | --- |",
    ...rows,
  ];
}

function coverageSummary(obligations: readonly Obligation[]): string[] {
  const tiers = countBy(obligations.map((o) => tierOf(o.rule_type)));
  const classes = countBy(obligations.map((o) => o.rule_type));
  const pure = tiers.get("derivable-pure") ?? 0;
  const formal = tiers.get("needs-formal") ?? 0;
  // The spec-formalization metric: derivable_pure / (derivable_pure + needs_formal).
  const denom = pure + formal;
  const metric = denom === 0 ? "n/a" : `${((pure / denom) * 100).toFixed(1)}%`;
  const tierRows = [...tiers.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([t, n]) => `| ${t} | ${n} |`);
  const classRows = [...classes.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([c, n]) => `| ${c} | ${n} |`);
  return [
    "## Coverage Summary",
    "",
    `Total obligations: ${obligations.length}`,
    `Spec-formalization metric (pure / (pure + needs_formal)): ${metric}`,
    "",
    "| Tier | Count |",
    "| --- | --- |",
    ...tierRows,
    "",
    "| Rule class | Count |",
    "| --- | --- |",
    ...classRows,
  ];
}

function suitePartition(obligations: readonly Obligation[]): string[] {
  const tiers = countBy(obligations.map((o) => tierOf(o.rule_type)));
  return [
    "## Suite Partition",
    "",
    `- Unit (derivable-pure): ${tiers.get("derivable-pure") ?? 0}`,
    `- Integration (derivable-needs-harness): ${tiers.get("derivable-needs-harness") ?? 0}`,
    `- Unresolved (needs-formal): ${tiers.get("needs-formal") ?? 0}`,
  ];
}

function obligationTable(
  obligations: readonly Obligation[],
  idByKey: ReadonlyMap<string, string>,
): string[] {
  const rows = byKey(obligations).map((o) => {
    const id = idByKey.get(o.obligation_key) ?? "(unmapped)";
    return `| ${id} | ${o.obligation_key.slice(0, 8)} | ${o.rule_type} | ${tierOf(o.rule_type)} | ${o.source_anchor} | ${o.description} |`;
  });
  return [
    "## Obligations",
    "",
    "| ID | Key | Rule | Tier | Source | Obligation |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
  ];
}

function gapLedger(
  obligations: readonly Obligation[],
  idByKey: ReadonlyMap<string, string>,
): string[] {
  const needsFormal = byKey(obligations).filter(
    (o) => tierOf(o.rule_type) === "needs-formal",
  );
  const needsHarness = obligations.filter(
    (o) => tierOf(o.rule_type) === "derivable-needs-harness",
  ).length;
  const formalRows = needsFormal.map((o) => {
    const id = idByKey.get(o.obligation_key) ?? "(unmapped)";
    return `- \`${id}\` ${o.source_anchor} — ${o.description}`;
  });
  return [
    "## Unresolved Formal Gaps",
    "",
    `needs_formal (un-formalized — no closed checkable expression): ${needsFormal.length}`,
    ...(formalRows.length > 0 ? ["", ...formalRows] : []),
    "",
    `needs-harness (derivable, requires a runtime/effect to test): ${needsHarness}`,
  ];
}

/** The deterministic-from-docs region body (everything inside the fence). */
export function emitEngineRegionBody(
  obligations: readonly Obligation[],
  idByKey: ReadonlyMap<string, string>,
  presentDocs: readonly string[],
): string {
  return [
    ...completenessGate(presentDocs),
    "",
    ...coverageSummary(obligations),
    "",
    ...suitePartition(obligations),
    "",
    ...obligationTable(obligations, idByKey),
    "",
    ...gapLedger(obligations, idByKey),
  ].join("\n");
}

/** Full TEST-SPEC.engine.md document: title + provenance (outside) + fenced region. */
export function emitTestSpecDocument(args: {
  readonly feature: string;
  readonly obligations: readonly Obligation[];
  readonly idByKey: ReadonlyMap<string, string>;
  readonly provenance: Provenance;
  readonly presentDocs: readonly string[];
}): string {
  const { feature, obligations, idByKey, provenance, presentDocs } = args;
  const region = emitEngineRegionBody(obligations, idByKey, presentDocs);
  return [
    `# Test Spec (engine-derived): ${feature}`,
    "",
    renderProvenanceHeader(feature, provenance),
    "",
    wrapEngineRegion(region),
    "",
  ].join("\n");
}
