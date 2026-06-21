// INV-3 negative-control guard — reusable by both the test suite and the CLI
// `self-check` command. It proves the round-trip comparator can FAIL on a real
// defect before any PASS is trusted: "no feature PASS may be reported unless the
// negative control passes."
//
// Two deterministic probes against a real engine/committed pair:
//   - INJECTION: add a sentinel committed obligation the engine cannot derive and
//     assert it surfaces as MISSING (the gate reports an absent obligation).
//   - REMOVAL: delete one required engine key the oracle needs and assert it
//     surfaces as MISSING (the gate reports a dropped derivation).
// A comparator that swallows either is broken; the guard returns ok=false.

import { semanticRoundTrip } from "./index.js";

/** A semantic id the engine provably never derives (no rule type emits `rule:__sentinel__`). */
export const SENTINEL_ID = "rule:__sentinel__";

export interface NegativeControlResult {
  /** True iff the gate detected BOTH the injected sentinel and the removed key. */
  readonly ok: boolean;
  /** The injected sentinel was reported as MISSING with pass=false. */
  readonly injectionDetected: boolean;
  /** The removed required engine key was reported as MISSING with pass=false. */
  readonly removalDetected: boolean;
  /** The engine key removed for the removal probe (null if no shared key existed). */
  readonly removedKey: string | null;
  /** Human-readable diagnostics for the CLI. */
  readonly notes: readonly string[];
}

/**
 * Run the INV-3 negative control over a derived/committed semantic pair. Pure: it
 * copies the maps and never mutates the inputs.
 */
export function runNegativeControl(
  derived: ReadonlyMap<string, string>,
  committed: ReadonlyMap<string, string>,
): NegativeControlResult {
  const notes: string[] = [];

  // (a) INJECTION probe.
  const poisoned = new Map(committed);
  poisoned.set(SENTINEL_ID, "negative-control sentinel (engine never derives)");
  const injReport = semanticRoundTrip(derived, poisoned);
  const injectionDetected =
    injReport.pass === false &&
    injReport.missing.some((m) => m.id === SENTINEL_ID);
  notes.push(
    injectionDetected
      ? `injection: gate reported ${SENTINEL_ID} as MISSING (FAIL) — OK`
      : `injection: gate FAILED to report ${SENTINEL_ID} as MISSING — BROKEN`,
  );

  // (b) REMOVAL probe — drop a key the oracle requires and the engine derives.
  const removedKey = [...committed.keys()].find((k) => derived.has(k)) ?? null;
  let removalDetected = false;
  if (removedKey === null) {
    notes.push(
      "removal: no shared engine/committed key to remove — probe inconclusive — BROKEN",
    );
  } else {
    const lobotomized = new Map(derived);
    lobotomized.delete(removedKey);
    const remReport = semanticRoundTrip(lobotomized, committed);
    removalDetected =
      remReport.pass === false &&
      remReport.missing.some((m) => m.id === removedKey);
    notes.push(
      removalDetected
        ? `removal: gate reported removed key ${removedKey} as MISSING (FAIL) — OK`
        : `removal: gate FAILED to report removed key ${removedKey} as MISSING — BROKEN`,
    );
  }

  return {
    ok: injectionDetected && removalDetected,
    injectionDetected,
    removalDetected,
    removedKey,
    notes,
  };
}
