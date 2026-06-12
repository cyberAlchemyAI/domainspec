---
node_type: refinement-result
title: Refine Result — Test Derivation (C2) Cluster + Deterministic Engine
status: flag
created: 2026-06-12
owner: refine
run_id: 2026-06-12-test-derivation-c2-cluster
---

# Refine Result — Test Derivation (C2) Cluster + Deterministic Engine

- **Status: FLAG** — the three experiments as written carry multiple **blockers** (unrunnable inputs, mislabelled determinism, contaminated baselines), but the refine converged on a strong, runnable path: **build the deterministic engine first, then the experiments validate it.**
- Preset: standard · Research: research-if-gap-appears (no external gap triggered; all evidence local).
- Five role-bound attackers, all receipts collected. See `stages/`.

## 1. The pivot (load-bearing)

The operator's instinct was right. Do **not** try to measure whether the LLM derivation agent is accidentally deterministic — that claim is unprovable and contradicts the paper's own Def-4 ("derivation executes rules, not stochastic generation"). Instead **build a fully deterministic derivation engine** and let determinism be true _by construction_. The C2 evidence then comes from the engine, not from an LLM's luck.

**The finding that makes this cheap:** the real feature docs in `validation/poker-team/docs/features/*` are _already ~85% machine-parseable canonical Markdown tables_ (`states.md`: `From|Event|To|Guard|Effect`; `operations.md`: Rules/Calculations with `Formal` columns; `interfaces.md`: `Status|Condition|Body`; `events.md`: payload+consumer tables). The engine is a near-term parser+pure-function build, not a moonshot.

## 2. Converged blockers across the cluster

| #   | Blocker                                                                                                                                                                                                                                                                                                                                 | Source                    | Resolution                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Determinism is mislabelled.** Derivation is an LLM agent (`domainspec-test-designer`); E1/E2/E3 all call it "deterministic."                                                                                                                                                                                                          | E1, E2 attackers          | Build the engine; determinism by construction. Until then, derivation experiments measure an LLM and must say so.                                        |
| B2  | **Unrunnable inputs.** E1's named features `player-management`/`financial-settlement` don't exist where assumed; the real 7 fully-specified features live in `validation/poker-team/docs/features/` (auth-access-control, financial-settlement, player-makeup, player-management, player-onboarding, player-progression, player-stats). | E1, E2 attackers          | Re-point all experiments at the poker-team 7. Cross-repo surface must be made explicit.                                                                  |
| B3  | **Contaminated baselines.** The repo's `*.test.ts` already carry TEST-SPEC IDs and all 7 `TEST-SPEC.md` are `status: implemented` — the existing tests **are** the derived tests. E2's "blind manual" and E3's "manual vs derived" are self-comparisons.                                                                                | E2, E3 attackers          | Quarantine existing TEST-SPECs; recruit ≥3 non-author testers; treat author n=1 as invalid.                                                              |
| B4  | **E3 has no executable derived tests + Stryker absent.** Derivation emits a _document_, not runnable code; poker-team has only vitest, no `@stryker-mutator`.                                                                                                                                                                           | E3 attacker, Cartographer | Engine `emit_tests` produces runnable vitest directly (removes the implementer confound); install+commit Stryker against the pure `src/domain/**` slice. |
| B5  | **Ill-defined success criteria.** Jaccard=1.0 over hand-numbered IDs/paraphrased names is unsatisfiable for cosmetic reasons; `survivors_critical=0` and `≥70%` have no rubric/rater and ignore equivalent mutants.                                                                                                                     | E1, E3 attackers          | Content-addressed `obligation_key` (engine); demote brittle gates to descriptive until a pilot calibrates them.                                          |

## 3. Reframed, runnable experiments (post-engine)

- **E1 → property test + E1a.** With the engine, `derive(docs) == derive(docs)` is a unit/property test (determinism by construction), not an experiment. The _residual research question_ moves upstream to **extraction/parser completeness**: does the deterministic parser capture everything the formal docs encode (recall vs a gold `G`, invariance under benign doc edits, transparent failure on malformed sections)? Drop the Jaccard=1.0 bar.
- **E2 → blinded, effectiveness-anchored.** Compare engine output vs manual on the poker-team 7 with existing TEST-SPECs quarantined and ≥3 independent testers. **Mutation score (E3) is the load-bearing pass criterion**, not row count; traceability/count demoted to descriptive stats judged by a published rubric with inter-rater κ.
- **E3 → engine-emitted runnable tests + Stryker.** Scope mutation to pure `src/domain/**`; engine emits runnable vitest (kills the implementer confound for the mechanical majority); collect a genuine manual control from a dev who never sees TEST-SPEC.md; report per-feature scores over _non-equivalent_ mutants; pre-register a two-rater survivor rubric; drop `=0`/`≥70%` gates until a pilot justifies them.
- **Toy falsification probe (cheap, run first):** build the MVP engine for **financial-settlement only** and round-trip its `TEST-SPEC.md` against the committed one. If it reproduces the RV/CT/PC/CO/EV/WI obligations (as a superset where the human wrote "at least"), the engine thesis is supported before any GPU/human cost.

## 4. Recommended engine architecture (from Architect receipt)

- **Two-stage pure pipeline.** Strict-grammar parser over canonical Markdown tables → typed concept graph `G` (nodes: Entity/State/Transition/Invariant/Operation/Rule/Calculation/Postcondition/Endpoint/Response/Event/Consumer/Field; typed edges; per-node source-anchor) → pure total `δ:(G,Δ)→T`.
- **Approach A wins the tournament** (strict grammar over canonical tables + a small formal sub-grammar for `Formal` cells) over YAML-docs or a DSL — lowest authoring burden, preserves the readable PR-reviewable corpus, docs are already ~85% there.
- **Cardinality fix:** every open cardinality in `TEST-PIPELINE.md` ("at least 2", "1+", Cartesian subtraction) becomes an _exact enumeration function over the row's typed structure_ (EXISTENCE→2, PRESENCE→#conjuncts, RANGE→4, COUNT_CAP→2; invalid-transition = `non-terminal-states × events − valid` in lex order).
- **Deterministic IDs:** `obligation_key = sha1(source_anchor | rule_type | canonical_params)` → byte-identical obligation sets across runs. This dissolves E1's Jaccard problem structurally.
- **MVP boundary:** financial-settlement, 4 aspects, ~6 rule functions, `obligation_key`, `emit_spec`; gate = round-trip vs committed TEST-SPEC. `emit_tests` (runnable vitest) + 2nd feature are post-MVP.
- **Hardest residual risk:** genuinely-prose cells (e.g. a 7-bullet algorithm). Handle by **require-canonical-form (linter CI gate) + reject-don't-guess + a counted `needs_formal` escape hatch** — deterministic over everything it formalizes, deterministic about flagging what it can't.

## 5. Missing-steps / build ledger (Cartographer receipt)

Greenfield tooling required before any run (S/M/L effort). Only the JSONL row-shape + 10-step Wohlin narrative reuse from E6/E9.

| Unit                           | What                                                                                                                    | Eff |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --- |
| **Engine (new — the product)** | parser → G (IR) → δ rules → `obligation_key` → `emit_spec` (+`emit_tests` stretch)                                      | L   |
| T2                             | Input-closure hasher (`system_prompt_hash` over skill+agent+TEST-PIPELINE+CHANGELOG+feature docs)                       | S   |
| T1/T3                          | Obligation-key extractor + pairwise Jaccard (for E1a parser-stability over the _current LLM_ baseline, if still wanted) | M   |
| T4                             | JSONL run-capture harness + E1/E2/E3 schemas (reuse E6/E9 shape), append-only                                           | M   |
| T5                             | Fresh-session / cross-repo runner                                                                                       | L   |
| T7/T8                          | Manual-test capture rig + blind rubric + D-vs-M comparator (E2, non-author testers)                                     | M   |
| T9                             | Stryker wiring on `src/domain/**` (verify vitest-4 runner support)                                                      | L   |
| T10                            | Engine `emit_tests` → executable vitest (removes E3 implementer confound)                                               | L   |
| T11                            | Surviving-mutant classifier + pre-registered 2-rater rubric                                                             | M   |
| T12                            | 10-step Wohlin aggregation → `results/EX-results.md`                                                                    | L   |
| T13                            | Pre-registration freezer (commit-hash-before-run, per dual-residue §7)                                                  | S   |

## 6. Cross-repo + submodule discipline (blocker B1 mechanics)

Engine + experiment data live in `implementation/domainspec`; features/code/TEST-SPECs live in `validation/poker-team`. The skill assumes `docs/features/{f}` and `domainspec/CHANGELOG.md` are co-rooted — they are not. **Two submodule commits, parent bumped last after `make bump-check`.** Watch the uninitialized nested `poker-team/domainspec` submodule shadowing the real CHANGELOG. No canonical `domainspec_version` exists today (CHANGELOG=2.1.0 vs prior data hardcoded 1.8.2, no VERSION file) — must be fixed to fill mandated run metadata.

## 7. Residue ledger

- **R-TD-1 (load-bearing):** "Deterministic derivation" is only honest once the engine exists. Any experiment run against the LLM agent must label the surface-under-test as the LLM, not "the derivation function."
- **R-TD-2 (contamination, mandatory):** existing TEST-SPECs + tests are the derived set authored by the operator — every comparative/blind protocol must quarantine them and exclude the author as tester.
- **R-TD-3 (sequencing):** the engine is the prerequisite, not a parallel nicety. E1/E2/E3 in their strong form depend on engine output. Build MVP engine → toy round-trip → then experiments.
- **R-TD-4 (open):** equivalent-mutant problem makes `survivors_critical=0` unachievable in general — gates stay descriptive until a pilot calibrates.

## 8. Handoff to `/invoke`

This result is the input to an `/invoke` **plan** with two tracks:

1. **Engine track (build):** MVP deterministic engine for financial-settlement (parser → G → δ → `obligation_key` → `emit_spec`), gated on round-trip vs committed TEST-SPEC. This is the product and the determinism proof.
2. **Experiment track (validate):** the reframed E1a (parser-completeness) / E2 (blinded, mutation-anchored) / E3 (engine-emitted runnable tests + Stryker), plus the shared measurement tooling ledger (§5) and pre-registration discipline.

Recommended next route: `/invoke` (mode: plan) consuming this RESULT.md. Optional later: `task-session` per build unit.
