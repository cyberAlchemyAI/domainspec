// Stage D (part 2) — emit_spec: render obligations to TEST-SPEC.md.
// Rows ordered by obligation_key for byte-stability. SWU-ENG-005.

import type { Obligation } from "../ir/types.js";

/** Render obligations as a deterministic TEST-SPEC.md body (skeleton). */
export function emitSpec(obligations: readonly Obligation[]): string {
  const ordered = [...obligations].sort((a, b) =>
    a.obligation_key < b.obligation_key
      ? -1
      : a.obligation_key > b.obligation_key
        ? 1
        : 0,
  );
  const rows = ordered.map(
    (o) =>
      `| ${o.obligation_key.slice(0, 8)} | ${o.rule_type} | ${o.source_anchor} | ${o.description} |`,
  );
  return [
    "| Key | Rule | Source | Obligation |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}
