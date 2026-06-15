// Stage D (part 1) — obligation_key: content-addressed, byte-stable IDs.
// SWU-ENG-004 finalizes canonical_params normalization. The hash itself is
// deterministic and implemented here (no external deps; Node's crypto).

import { createHash } from "node:crypto";
import type {
  ObligationKey,
  RuleType,
  SourceAnchor,
  Value,
} from "../ir/types.js";

/** Stable JSON: object keys sorted so equal params always serialize identically. */
function canonicalJson(params: Readonly<Record<string, Value>>): string {
  const keys = Object.keys(params).sort();
  const parts = keys.map(
    (k) => `${JSON.stringify(k)}:${JSON.stringify(params[k] ?? null)}`,
  );
  return `{${parts.join(",")}}`;
}

/** obligation_key = sha1(source_anchor | rule_type | canonical_params). */
export function obligationKey(
  sourceAnchor: SourceAnchor,
  ruleType: RuleType,
  canonicalParams: Readonly<Record<string, Value>>,
): ObligationKey {
  const payload = `${sourceAnchor}|${ruleType}|${canonicalJson(canonicalParams)}`;
  return createHash("sha1").update(payload).digest("hex");
}
