---
module: deterministic-test-derivation-engine
version: current
status: draft
updatedAt: 2026-06-12
docType: implementation-layering
---

# Implementation Layering: Deterministic Test-Derivation Engine + C2 Experiments

Decision-first layering. Each layer ends with a go/no-go that gates the next. The engine (Track 1) is the prerequisite for the strong-form experiments (Track 2); layering enforces that ordering (residue R-TD-3).

## Source Contract

- Refine result: [../RESULT.md](../RESULT.md)
- Architect design: [../stages/architect-deterministic-engine.md](../stages/architect-deterministic-engine.md)
- Cartographer build ledger: [../stages/cartographer-measurement-and-infra-map.md](../stages/cartographer-measurement-and-infra-map.md)

## Target And Scope

- Target: a fully deterministic test-derivation engine + the reframed C2 evidence experiments
- Scope: capability (engine) + research workflow (experiments)
- Current state: greenfield engine; experiment specs exist but blocked as-written

## Layer Boundary Rule

```text
After this layer, we know whether {decision unlocked}.
```

## Layer Decision Table

| Layer        | Decision Question                                                                                        | Minimum Working Unit                                                                                                                   | Included Scope                                                                                                                                                 | Deferred Scope                                                                              | Exit Evidence                                                                                              | Promotion Decision       |
| ------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------ |
| **L0 (POC)** | After this layer, we know whether **a deterministic δ can reproduce human-authored obligations at all**. | Engine derives `financial-settlement` obligations from its canonical Markdown docs and round-trips the committed `TEST-SPEC.md`.       | Strict-grammar parser for the 4 aspect tables; typed graph `G`; ~6 δ rule functions; content-addressed `obligation_key`; `emit_spec`.                          | `emit_tests`; 2nd feature; prose-cell handling beyond `needs_formal` flag; all experiments. | Engine `TEST-SPEC.md` ⊇ committed obligations (RV/CT/PC/CO/EV/WI), byte-stable across 2 runs; diff report. | continue / pivot / stop  |
| **L1**       | After this layer, we know whether **the engine is repeatable across features and emits runnable tests**. | Engine handles `auth-access-control` too; `emit_tests` produces runnable vitest; canonical-form linter + `needs_formal` escape hatch.  | All TEST-PIPELINE rule types with exact cardinalities; 2nd feature; `emit_tests`; CI linter gate; column-order aliasing.                                       | Remaining 5 poker-team features; mutation infra; human-tester protocol.                     | Both features round-trip; emitted vitest runs green against existing impl; `needs_formal` count reported.  | harden / narrow / stop   |
| **L2**       | After this layer, we know whether **governed, reproducible experiments can run** (E1a).                  | Measurement tooling + E1a (parser/extraction completeness) executed and reported.                                                      | Input-closure hasher (T2); JSONL harness+schemas (T4); cross-repo runner (T5); pre-registration freezer (T13); `domainspec_version` canonicalization; E1a run. | E2 human study; E3 mutation.                                                                | E1a results in `docs/research/results/`; pre-registration commit predates run; JSONL append-only verified. | scale / remediate / stop |
| **L3**       | After this layer, we know whether **the C2 claim is publishable evidence**.                              | E2 (blinded, mutation-anchored, ≥3 non-author testers, 7 features) + E3 (Stryker on `src/domain/**`) complete with Wohlin aggregation. | Stryker wiring (T9); engine-emitted runnable tests as the derived suite (T10); survivor classifier+rubric (T11); 10-step aggregation (T12); paper update.      | Engine generalization beyond poker-team; productization.                                    | E2/E3 results; paper §5 update; inter-rater κ reported; gates calibrated by pilot.                         | pilot / package / defer  |

## Non Regression Guardrails

- Later layers preserve earlier guarantees: once L0 proves byte-stable obligation_keys, no later change may reintroduce nondeterminism into δ.
- Deferred scope stays explicit — do not pull E2/E3 forward before the engine (L0–L1) exists (residue R-TD-3).
- Promotion cites evidence (round-trip diffs, green test runs, JSONL), not preference.
- Existing TEST-SPECs/tests are quarantined throughout as the operator-authored set (residue R-TD-2); never used as an independent baseline.

## Recommended Next Layer

- Next layer: **L0**
- Key decision unlocked: can a pure δ reproduce the human-authored `financial-settlement` obligations (the toy falsification probe from RESULT.md §3)?
- Major deferred scope: all experiments (L2–L3), `emit_tests` and 2nd feature (L1).
