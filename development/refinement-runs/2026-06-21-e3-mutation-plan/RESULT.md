---
node_type: refinement-result
title: Refine Result — E3 Mutation-Testing Execution Plan
status: pass
created: 2026-06-21
owner: refine
run_id: 2026-06-21-e3-mutation-plan
---

# Refine Result — E3 Mutation-Testing Execution Plan

- **Status: PASS** — E3 is feasible and the plan is runnable. The original blocker (Stryker × vitest-4) is **resolved by spike**, and the contamination tension is resolved honestly (the claim is narrower than the original E3 assumed).
- Preset: standard · Research: research-if-gap-appears (no external; the spike was a local install).
- 2 subagents, both receipts collected (`stages/`).

## 1. Feasibility — RESOLVED by spike (the big one)

- **Stryker v9 supports vitest 4.x.** `@stryker-mutator/vitest-runner@9.6.1` peer-declares `vitest >=2.0.0`; the backend pins vitest `^4.0.18` (resolves 4.1.1). The historical "runner lags vitest 4" risk (orig B-003) is gone.
- **The spike RAN.** Local (uncommitted) Stryker 9 install, scoped to `src/domain/deal/deal.service.ts`: dry-run 20 tests, 10 mutants instrumented, **100% killed (10/10), 0 survived, 0 runner errors**, ~7s. Cleaned up; nothing committed.
- Backend: npm workspace (deps hoist to `poker-team/node_modules`); no `vitest.config.ts` (runs on defaults); `prepare: husky` fails → installs must use `--ignore-scripts`.

## 2. The honest comparison (contamination resolved)

A true **clean-room manual control is INFEASIBLE** (no spec-naive developer on hand; every test traces to the project). So **drop the original E3 "derived vs manual" / spec-vs-no-spec framing** — that was the contamination error. Three **labelled** arms:

| Arm                    | Producer                                                                                                        | Honest meaning                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **derived**            | engine `emit_tests` → `src/domain/__derived__/*.derived.test.ts` (code from spec+Δ+bindings, never hand-edited) | fault-detection of the deterministic emitter                           |
| **pipeline-reference** | the repo's existing `src/domain/**/*.test.ts`                                                                   | fault-detection of the project's hand/agent-authored tests             |
| **manual control**     | spec-naive developer (clean room)                                                                               | OUT OF SCOPE / future — slots in unchanged if a developer is recruited |

**The defensible E3 claim:** _a deterministic emitter produces tests with fault-detection power comparable to (or exceeding) the project's existing tests, reproducibly and with zero human variance_ — NOT "spec-derived beats unaided humans."

**Open question (subagent tension, for the pilot to settle):** the Env Cartographer found the `src/domain` `*.test.ts` carry **no** TEST-SPEC/obligation ids (suggesting hand-written, a closer-to-honest reference), while the Protocol Designer treats all repo tests as pipeline-authored. Absence of ids ≠ spec-naive authorship. The pilot must record the actual provenance of the domain tests before any comparative claim; label them `pipeline-reference` until proven otherwise.

## 3. Protocol

- **Pilot-first.** Run E3 on **financial-settlement only** (the ~12 AST-bodied cases over the pure cluster: `deal.service.ts`, `makeup-policy.service.ts`, `settlement.service.ts`). Observe scores, survivor classes, equivalent rate, κ → **then** set corpus gates from the observed distribution (pre-registered before the corpus run). Until then all metrics are **descriptive**.
- **Drop the brittle gates** (`survivors_critical=0`, `≥70%`, `derived ≥ manual 5/7`) — set before data exists; `survivors_critical=0` is unachievable while the makeup-policy math is a declared `coverage_gap`.
- **Mutant rubric:** trivial / moderate / critical (business-rule, traceable to an obligation). Two raters classify every survivor (+ a calibration sample of killed) blind; **Cohen's κ** reported, κ≥0.6 a descriptive bar.
- **Equivalent mutants:** excluded from denominator; default to non-equivalent when in doubt; `mutation_score = killed / (total − equivalent)`; equivalent count reported separately.

## 4. Install + config (for the execution task-session)

- devDeps (workspace root, hoisted): `@stryker-mutator/core@^9`, `@stryker-mutator/vitest-runner@^9`; install with `--ignore-scripts`.
- `backend/stryker.conf.json`: `testRunner: vitest`, `vitest.dir: src/domain`, `mutate: [deal, makeup-policy, settlement].service.ts`, `concurrency: 2`, `timeoutMS: 15000`, `coverageAnalysis: perTest`, `reporters: [clear-text, progress, json]`.
- Two arms = same `mutate` set, different test selection: derived arm points at `__derived__/`; pipeline-reference arm at the existing domain tests.

## 5. Metrics, JSONL, pre-registration

- Per (feature × arm), over non-equivalent mutants: `mutation_score_derived`, `mutation_score_pipeline_reference`, `mutation_score_combined` (`manual = null`), + survivor counts by class + κ.
- JSONL reuses the E6/E9 shape; metadata block keyed by **`engine_commit`** (the reproducibility key — there is no `domainspec_version`), + stryker/vitest versions, mutate glob, feature_id, arm.
- **Pre-registration:** freeze the protocol + `engine_commit` before the run (commit-hash-before-run); the run asserts the live `__derived__` suite was generated at that commit. No pre-registration against an uncommitted engine (R-C2-4).

## 6. Cross-submodule layout

- `validation/poker-team` (submodule 1): `backend/stryker.conf.json`, the `@stryker-mutator/*` devDeps, the engine-emitted `__derived__/` suite. Commit + push FIRST — this SHA _is_ `engine_commit`.
- `implementation/domainspec` (submodule 2): `docs/research/data/E3-run-<date>.jsonl` (append-only), `docs/research/results/E3-results.md`, the pre-registration freeze. Commit after poker-team is pushed.
- Parent gitlink bumps last; `make bump-check` before push.

## 7. Residue ledger

- **R-E3-1 (load-bearing):** the bodied subset is thin (~12 cases; `applyMakeupPolicy` is a `coverage_gap` skip). Both arms may score near-ceiling on so few mutants → underpowered. **Pilot must report mutant count + survivor diversity per file before any comparative claim;** if too few non-trivial mutants, widen the bodied subset (P4 engine work) before the corpus run.
- **R-E3-2:** no true clean-room manual control; the honest claim is deterministic-emitter vs pipeline-reference, not spec-vs-no-spec. Manual arm = future work.
- **R-E3-3 (open):** provenance of the `src/domain` `*.test.ts` (hand-written vs pipeline) is unconfirmed — settle in the pilot.

## 8. Recommended next route

`task-session` to execute the **pilot** (financial-settlement, derived + pipeline-reference arms): install Stryker v9, write `stryker.conf.json`, run both arms, capture JSONL, classify survivors, report count/diversity + scores + κ — then calibrate corpus gates. Pre-register `engine_commit` first.
