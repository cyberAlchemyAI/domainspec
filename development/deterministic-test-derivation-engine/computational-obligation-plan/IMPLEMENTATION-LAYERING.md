---
module: test-derivation-engine-computational-obligations
version: current
status: draft
updatedAt: 2026-06-21
docType: implementation-layering
---

# Implementation Layering: Computational-Obligation Derivation (3 follow-ups)

Decision-first layering for the three steps from the dispatch findings ([findings](../../refinement-runs/../../../../research/smt-fol-test-derivation/tracks/computational-obligation-derivation/findings.md)): (1) fix the live honesty regression, (2) add closed-form derivation for computational obligations, (3) re-run E3 to measure the gain. Honesty fix first — it makes every later measurement trustworthy.

## Source Contract

- Dispatch findings: `research/smt-fol-test-derivation/tracks/computational-obligation-derivation/findings.md` (verdict matrix + the LIVE regression + engine work items)
- E3 baseline: [docs/research/results/E3-results.md](../../../docs/research/results/E3-results.md) (derived 38.75% — the number to beat)
- Engine: [tools/test-derivation-engine/src/](../../../tools/test-derivation-engine/src/) (`emit/tests.ts`, `formal/ast.ts`, `rules/index.ts`, `bindings/`)

## Layer Decision Table

| Layer                         | Decision Question                                                                                               | Minimum Working Unit                                                                                                                                        | Included                                                                                                | Deferred                              | Exit Evidence                                                                                                      | Promotion         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| **L0 honesty fix**            | After this, is the gate honest again (a property never hides a needs_formal value-gap)?                         | `emitHybridTests` co-emits: property body **AND** `it.skip` + `coverage_gap: needs-formal-value`, gap still counted.                                        | the co-emit guard + a test pinning "property does not zero the gap"                                     | closed-form, E3                       | a property-bearing obligation still increments `coverageGaps`; the I1 case shows both a property and a counted gap | continue          |
| **L1 closed-form derivation** | After this, do `sum`-aggregates + a closed-form-authored `applyMakeupPolicy` derive **exact** value assertions? | `FoldAst` + `PiecewiseAst` + `ArithExpr` pure evaluator (rational/integer arith, bounded, total) + provenance guard; author makeup closed-form in the spec. | the AST nodes + evaluator + emit branch + the `isBareCall→needs_formal` gate kept; spec edit for makeup | metamorphic behavioral MRs (separate) | engine emits real value assertions for `sum(profit)` + makeup; byte-stable; bare-call still → needs_formal         | continue / narrow |
| **L2 re-run E3**              | After this, how much did the derived arm catch up (structural gap vs unwritten spec)?                           | re-run E3 derived arm on financial-settlement with the new bodies; compare to 38.75% baseline.                                                              | Stryker re-run, both arms, JSONL append, results update                                                 | corpus run, E2                        | new derived mutation score + per-file delta on makeup; honest writeup                                              | scale / accept    |

## Non Regression Guardrails

- L0 lands first and is independent: the honesty fix must not wait on closed-form.
- L1 arithmetic stays **rational/integer or fixed-decimal** (no native float accumulation — determinism hazard) and **pure/total**; div-by-zero/empty-fold → `unparsed`→coverage_gap.
- Provenance: a closed-form Formal cell is parsed from the spec doc, never transcribed from the impl; `isBareCall(applyMakeupPolicy(...))` stays `needs_formal` until the author writes the piecewise formula.
- Metamorphic floors **co-emit**, never replace (the L0 invariant carries forward).
- SMT/solver path stays OUT of the deterministic derivation step.

## Recommended Next Layer

- Next: **L0** (the live honesty regression — small, urgent, unblocks honest measurement).
- Key decision unlocked: is the engine's honesty contract intact before we add power.
- Major deferred: behavioral metamorphic MRs; corpus-wide E3; E2.
