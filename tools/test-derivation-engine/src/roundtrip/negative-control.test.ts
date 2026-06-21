// INV-3 (falsifiability / negative control) — the round-trip gate MUST be able to
// say NO. A green report is only evidence of C2 if the comparator could have
// reported red on a real defect. These tests prove the gate detects:
//   (a) an INJECTED committed obligation the engine cannot derive  -> MISSING + FAIL
//   (b) a REMOVED required engine key                              -> MISSING + FAIL
// If either assertion fails, the comparator is broken and NO feature PASS may be
// trusted. The same guard is exposed on the CLI as `tsx src/cli.ts self-check`.

import { describe, it, expect } from "vitest";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "../grammar/index.js";
import { derive } from "../rules/index.js";
import {
  engineSemanticSet,
  parseCommittedSpec2,
  semanticRoundTrip,
} from "./index.js";
import { runNegativeControl, SENTINEL_ID } from "./negative-control.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEATURE_DIR = resolve(
  __dirname,
  "../../../../../../validation/poker-team/docs/features/financial-settlement",
);

describe("INV-3 negative control: the gate CAN fail", () => {
  const { graph } = parse(FEATURE_DIR);
  const committed = parseCommittedSpec2(join(FEATURE_DIR, "TEST-SPEC.md"));
  const derived = engineSemanticSet(derive(graph), {
    qualified: committed.qualified,
  });

  it("(a) reports an INJECTED committed obligation the engine cannot derive as MISSING -> FAIL", () => {
    const poisoned = new Map(committed.semantic);
    poisoned.set(SENTINEL_ID, "synthetic obligation the engine never derives");
    const report = semanticRoundTrip(derived, poisoned);
    expect(report.pass).toBe(false);
    expect(report.missing.some((m) => m.id === SENTINEL_ID)).toBe(true);
  });

  it("(b) reports a REMOVED required engine key as MISSING -> FAIL", () => {
    // Pick a committed key the engine genuinely derives, then delete it from the
    // engine side and confirm it surfaces as a miss (not silently swallowed).
    const target = [...committed.semantic.keys()].find((k) => derived.has(k));
    expect(target, "fixture must share at least one key").toBeDefined();
    const lobotomized = new Map(derived);
    lobotomized.delete(target!);
    const report = semanticRoundTrip(lobotomized, committed.semantic);
    expect(report.pass).toBe(false);
    expect(report.missing.some((m) => m.id === target)).toBe(true);
  });

  it("the reusable runNegativeControl() guard reports ok=true for a healthy comparator", () => {
    const result = runNegativeControl(derived, committed.semantic);
    expect(result.ok).toBe(true);
    expect(result.injectionDetected).toBe(true);
    expect(result.removalDetected).toBe(true);
  });
});
