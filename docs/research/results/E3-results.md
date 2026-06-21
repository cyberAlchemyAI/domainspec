# E3: Mutation Testing Effectiveness — Results

**Status:** completed (financial-settlement pilot)
**Date:** 2026-06-21
**Operator:** vrondelli
**Engine commit:** `5631765` (derived `__derived__` suite working-tree/uncommitted at run time)
**Plan:** [refine RESULT](../../../development/refinement-runs/2026-06-21-e3-mutation-plan/RESULT.md)
**Raw data:** [data/E3-run-2026-06-21.jsonl](../data/E3-run-2026-06-21.jsonl)
**Paper claim:** C2 — derived tests catch real faults

---

## Protocol (as run)

- Tool: Stryker `9.6.1` + `@stryker-mutator/vitest-runner@9.6.1`, vitest `4.1.1` (B-003 resolved — Stryker v9 supports vitest 4.x). Ran clean, 0 errors / 0 timeouts.
- Mutate set: the pure `src/domain` cluster — `deal/deal.service.ts`, `makeup/makeup-policy.service.ts`, `settlement/settlement.service.ts` (160 mutants). concurrency 2, timeoutMS 15000, coverageAnalysis perTest.
- **Three labelled arms** (same mutate set, different test selection):
  - **derived** = engine-emitted `__derived__/financial-settlement.derived.test.ts` (11 active assertions; 56 honest `it.skip` coverage_gaps);
  - **pipeline-reference** = the repo's existing `src/domain/**/*.test.ts` (83 tests);
  - **combined** = both.
- Honest framing (contamination resolved): a true clean-room **manual** control is infeasible, so `manual = null`; the comparison is **deterministic-emitter vs the project's existing tests**, not spec-vs-no-spec.

## Results

| Arm                | mutants | killed | survived | no-cov | errors | mutation_score | covered_score |
| ------------------ | ------- | ------ | -------- | ------ | ------ | -------------- | ------------- |
| derived            | 160     | 62     | 68       | 30     | 0      | **38.75%**     | 47.69%        |
| pipeline-reference | 160     | 94     | 41       | 25     | 0      | **58.75%**     | 69.63%        |
| combined           | 160     | 104    | 35       | 21     | 0      | **65.00%**     | 74.82%        |

### Per-file (total mutants: deal=10, makeup=93, settlement=57)

| File                     | derived          | pipeline-ref |
| ------------------------ | ---------------- | ------------ |
| deal.service.ts          | **100%** (10/10) | 40% (4/10)   |
| makeup-policy.service.ts | 17.2%            | 50.5%        |
| settlement.service.ts    | 63.2%            | 75.4%        |

## Findings

1. **Pipeline-reference wins overall (58.75% vs 38.75%) — as predicted, and the gap is structural, not an emitter quality defect.** The derived suite only bodies 11 obligations (the AST-evaluable subset); the other 56 are honest `it.skip` coverage_gaps (HTTP/state/side-effects/mappings/needs-oracle calcs). It exercises 4 pure functions.
2. **Where the emitter has a value-asserting oracle, it matches or beats the existing tests.** `deal.service.ts`: derived **100%** vs pipeline-reference 40% — the emitted suite asserts both ternary branches incl. the `>=NL100` boundary, which the existing tests never probe (their `deal:14 value>=100 → value>100` boundary mutant survives).
3. **The single biggest score sink is `applyMakeupPolicy` reached only by a `newDebt >= 0` property test** — it pins one invariant but asserts nothing about the actual arithmetic, so ~56 makeup mutants survive in the derived arm (47 killed by pipeline-ref's value-asserting tests). This is the concrete P4 follow-up: give the engine a value-asserting oracle for the makeup calc, not just the non-negativity property.
4. **Slice power (R-E3-1):** meaningful on makeup+settlement (150/160 mutants, diverse mutator types) but `deal` is thin (n=10); the head-to-head is **underpowered** until the bodied subset widens. Reported, not over-read.

## Survivor classification (single-rater — κ = n/a; 2-rater is future human work)

- derived (98 undetected): ~30 critical (mostly `applyMakeupPolicy` money rules + R4/R5 `>0` boundary), ~30 moderate, ~38 trivial (uncovered `validateMakeupPolicyShape`).
- pipeline-reference (66 undetected): ~14 critical (`deal:14` NL100 boundary, `settlement:83` netProfit arithmetic, idempotency equality flips), ~18 moderate, ~34 trivial (same uncovered validator).
- Equivalent-mutant candidates noted (`>0`→`>=0` on cleared integers; clampRate bound swaps) — none confirmed; kept in denominator (default non-equivalent per plan).

## Impact on the C2 claim

- **Supported, narrowly + honestly:** the deterministic emitter produces real fault-detecting tests (62 mutants killed; 100% on the obligation class it can fully body) — _reproducibly and with zero human variance_. It does **not** yet match the project's tests overall, because its bodied coverage is thin by construction (decidable subset only; the rest honest coverage_gaps).
- **Not claimed:** "spec-derived beats humans" (no clean-room manual arm) and corpus-wide effectiveness (this is the financial-settlement pilot).

## Gates / next steps

- Brittle pre-data gates (`survivors_critical=0`, `≥70%`) remain **dropped** — descriptive only, per plan. Corpus gates to be set from this pilot's distribution, pre-registered before a corpus run.
- **Pilot → corpus** requires: (a) a value-asserting makeup oracle (P4 engine work — biggest lever), (b) committing the `__derived__` suite so `engine_commit` is a real pre-registration anchor, (c) 2-rater survivor classification (human) for κ.
- Recommended next: widen the bodied subset (P4), then re-run + extend to the corpus.

---

## L2 re-run (2026-06-21) — after closed-form C4 + honesty fix

After the computational-obligation plan (honesty co-emit fix; FoldAst/PiecewiseAst/ArithExpr closed-form derivation; `applyMakeupPolicy` authored closed-form in operations.md C4 from documented semantics, NOT the impl):

| Arm / file               | before | after      | delta                   |
| ------------------------ | ------ | ---------- | ----------------------- |
| **derived (aggregate)**  | 38.75% | **54.37%** | **+15.6 pts**           |
| makeup-policy.service.ts | 17.2%  | **36.56%** | **+19.4 pts (doubled)** |
| deal.service.ts          | 100%   | 100%       | —                       |
| settlement.service.ts    | 63.2%  | 75.44%     | +12                     |

**Correctness check (load-bearing):** the regenerated `__derived__` suite (C1 `totalProfit==200`, C4 `newMakeup==60`) **passes 13/13 against the real unmutated code** — no spec/impl mismatch. The C4 value assertion killed exactly the debt-arithmetic mutants the prior property-only stub left alive (`min→max`, `debt-applied → debt+applied`, apply-guard flips).

**Verdict:** the 38.75% gap was **structural-but-unwritten-spec, not impl divergence** — confirmed. Closing the closed form caught the derived arm up by ~16 pts.

**Honest caveats:**

- The C4 closed form `max(0, prevDebt − profit − rakeback)` is an **under-model**: it agrees with the impl's clamped sequential application _on the chosen fixture_ (inputs stay where flat subtraction == sequential apply), but would diverge if profit alone overshot the debt with leftover, or on negative inputs. A fully faithful closed form needs the piecewise sequential form. The assertion is sound for its fixture; the formula is not the complete policy.
- Residual makeup survivors are a _separate_ unwritten-spec gap (payout-share value assertions on `remainingProfit/remainingRakeback`; uncovered `validateMakeupPolicyShape`) — not impl divergence.
- The L0 honesty fix is in effect: financial-settlement coverage_gap count 56 → 57 (the I1 value-gap is now co-emitted and counted, not zeroed by the property).
