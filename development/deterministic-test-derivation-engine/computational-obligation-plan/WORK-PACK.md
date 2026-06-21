---
module: test-derivation-engine-computational-obligations
version: current
status: draft
updatedAt: 2026-06-21
docType: work-pack
---

# WORK-PACK: Computational-Obligation Derivation (3 follow-ups)

## Control Fields

| Field               | Value                                                    | Notes                                              |
| ------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| workPackGateStatus  | pass                                                     | Non-executed plan; SWUs carry execution contracts. |
| complexity          | medium                                                   | Engine code (algorithmic) + an experiment re-run.  |
| outputMode          | single-file                                              |                                                    |
| layeringArtifactRef | [IMPLEMENTATION-LAYERING.md](IMPLEMENTATION-LAYERING.md) |                                                    |
| activeLayerWindow   | L0                                                       | Honesty fix first.                                 |
| readinessProfile    | release-candidate                                        |                                                    |

## Objective Summary

- Objective: (1) fix the live honesty regression, (2) add closed-form derivation (FoldAst/PiecewiseAst/ArithExpr) so computational obligations derive exact values, (3) re-run E3 to measure the gain.
- Inputs: dispatch findings, E3 baseline (derived 38.75%), engine src.
- Success: gate honest again (property never zeroes a gap); `sum` + closed-form makeup derive real value assertions, byte-stable; E3 derived score re-measured vs baseline.

## Delivery Slices

| Slice | Outcome                                  | Layer | Validation                                                                          |
| ----- | ---------------------------------------- | ----- | ----------------------------------------------------------------------------------- |
| S0    | honesty regression fixed (co-emit)       | L0    | property-bearing obligation still counts a coverage_gap; engine test pins it        |
| S1    | closed-form AST + evaluator + provenance | L1    | `sum`/makeup emit exact value assertions; bare-call still needs_formal; byte-stable |
| S2    | E3 re-run + delta                        | L2    | new derived mutation score vs 38.75%; per-file makeup delta; results updated        |

## SWU Execution Handoff

| SWU ID      | Parent | Source Anchors                                                                                                                               | Deps        | Write Scope                                                  | Done Criteria                                                                                                                                                                                                                          | Acceptance Evidence                                                                  | Validation                      | Owner                      |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- | -------------------------- |
| SWU-COB-001 | S0     | findings §LIVE FINDING; `src/emit/tests.ts` `emitHybridTests` (the `continue` after `emitProperty`); `bindings/financial-settlement.json` I1 | none        | `src/emit/tests.ts` (+ test)                                 | a property emitted for an UNCLASSIFIED/bare-call obligation co-emits an `it.skip` + `coverage_gap: needs-formal-value` AND still increments `coverageGaps`; property may only fully satisfy an obligation whose Formal IS the relation | engine test: I1 yields BOTH a property and a counted gap; gap count no longer zeroed | `vitest run`                    | engine-owner               |
| SWU-COB-002 | S1     | findings work-item 2; `src/formal/ast.ts` (existing TERNARY/RANGE/COUNT_CAP)                                                                 | SWU-COB-001 | `src/formal/ast.ts`                                          | add `FoldAst` (assoc reducer + field), `PiecewiseAst` (guards+exprs), `ArithExpr` sub-grammar (`+ − · / min max`, var/num leaves) to the FormalAst union                                                                               | parser builds these from real Formal cells; unit tests                               | `vitest run formal`             | engine-owner               |
| SWU-COB-003 | S1     | findings work-item 2 (rational arith, total)                                                                                                 | SWU-COB-002 | `src/formal/eval.ts` (or in ast)                             | pure total `evalArith(env)` — **rational/integer or fixed-decimal only** (no native float accumulation); div-by-zero/empty-fold → unparsed→coverage_gap; bounded fold length                                                           | evaluator unit tests incl. determinism (2 runs identical) + the float-drift guard    | `vitest run`                    | engine-owner               |
| SWU-COB-004 | S1     | `src/emit/tests.ts` `emitAstEval`; bindings                                                                                                  | SWU-COB-003 | `src/emit/tests.ts`, `bindings/`                             | emit branch: given a binding fixture env, compute EXPECTED via `evalArith` for Fold/Piecewise → real `expect().toBe()`; co-emit guard from S0 still applies to anything that falls back                                                | `sum(profit)` emits a real value assertion; emission byte-stable                     | `vitest run` + emit determinism | engine-owner               |
| SWU-COB-005 | S1     | findings work-item 3 (provenance); `rules/index.ts` `isBareCall`                                                                             | SWU-COB-004 | `src/` (provenance check)                                    | a closed-form Formal is parsed from the spec doc; a bare `applyMakeupPolicy(...)` is NOT promotable (stays needs_formal) until a piecewise formula is authored                                                                         | test: bare-call → needs_formal; piecewise → value assertion                          | `vitest run`                    | engine-owner               |
| SWU-COB-006 | S1     | `validation/poker-team/docs/features/financial-settlement/operations.md` C4                                                                  | SWU-COB-005 | poker-team operations.md (C4)                                | author `applyMakeupPolicy` as a closed piecewise formula (the spec is the independent oracle, NOT transcribed from impl)                                                                                                               | engine derives exact makeup value assertions from the authored formula               | round-trip + emit               | spec-author (human review) |
| SWU-COB-007 | S2     | E3 plan + results baseline                                                                                                                   | SWU-COB-006 | `docs/research/data/`, `docs/research/results/E3-results.md` | re-run E3 derived arm (financial-settlement) with the new bodies; append JSONL; report new derived score vs 38.75% + per-file makeup delta                                                                                             | Stryker re-run; updated E3-results with the delta + honest interpretation            | `stryker run` (poker-team)      | engine-owner               |

## Dispatch Spec technique trace

- `sequence` → L0→L1→L2 (honesty before power before measurement).
- `frame_handoff` + `execution_receipt_handoff` → invoke authors; task-session/engine-owner execute; E3 re-run returns a receipt (new score).
- `owner_boundary_check` → SWU-COB-006 is spec-author (human review of the closed formula — provenance/no-transcription); others engine-owner.
- `validation_loop` → each SWU names acceptance + check.
- `scu_swu_reduction` → 7 SWUs, disjoint scope (engine src vs poker-team operations.md vs research data).
- `residue_ledger` → below. Skipped: full dispatch JSON (single-capability authoring; no subagent strategy) — trace suffices.

## Distill validation

- Verdict: **pass** — smallest coherent units (one AST node / one emit branch / one experiment); recompose into the C2 coverage answer; the only cross-owner unit (SWU-COB-006, the closed-form spec edit) is explicitly human-review for provenance.

## Blockers / residue

| ID      | Description                                                                                                                                       | Owner        | Next                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------- |
| R-COB-1 | SWU-COB-006 closed-form makeup formula must be authored independently (not transcribed from impl) or the E3 gain is circular.                     | spec-author  | human review of the formula's provenance |
| R-COB-2 | E3 re-run needs Stryker in poker-team (install per the E3 plan, --ignore-scripts); `__derived__` regenerated from the new engine.                 | engine-owner | run after S1                             |
| R-COB-3 | metamorphic behavioral MRs (monotonicity/conservation) are a separate, spec-confirmed effort — not in this plan (kept honest, not auto-asserted). | deferred     | future plan                              |

## Gate Checks

1. workPackGateStatus pass before mutation-capable execution.
2. L0 (SWU-COB-001) lands + validates before L1 accrues against it.
3. Determinism guard (rational arithmetic, byte-stable emit) on SWU-COB-003/004.
4. Provenance guard (SWU-COB-005/006) — bare-call stays needs_formal; closed form is spec-sourced.

## Change Log

| Date       | Change                               | Author        |
| ---------- | ------------------------------------ | ------------- |
| 2026-06-21 | Plan authored from dispatch findings | invoke (plan) |
