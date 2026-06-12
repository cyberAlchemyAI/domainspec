---
node_type: refinement-seed
title: Refine Seed — Test Derivation (C2) Experiment Cluster
status: proposed
created: 2026-06-12
owner: refine
---

# Refine Seed Proposal — Test Derivation (C2) Experiment Cluster

- Run id: `2026-06-12-test-derivation-c2-cluster`
- Operator intent (verbatim): "i want to run the experiment for test derivation, /refine it first, attack the experiment, try to improve it, and which steps we are missing, then /invoke a plan with refine result, so we can run the experiment"

## Target

The three P0 experiments backing paper claim **C2** (test derivation works):

- **E1 — Derivation Determinism** (`docs/research/experiments/E1-derivation-determinism.md`): same spec → same tests, Jaccard = 1.0 over 10 runs/feature.
- **E2 — Derivation vs Manual Coverage** (`E2-derivation-vs-manual.md`): derived test set ≥ manual, traceability > 95%.
- **E3 — Mutation Testing Effectiveness** (`E3-mutation-testing.md`): derived tests kill ≥ 70% mutants, ≥ manual, 0 surviving critical mutants.

Goal: **adversarially attack** the three designs, surface validity threats and missing steps, and produce a **hardened, runnable experiment design** (non-executed) that `/invoke` can turn into an execution plan.

**Engine track (operator-added).** Rather than reframe E1 to accept a stochastic generator, the refine must also design a path to a **deterministic test-derivation engine**, so determinism is true _by construction_. Split derivation into:

- **Extraction**: `states/operations/interfaces/events.md` → typed concept graph `G` + rule set `Δ`.
- **Derivation**: a pure function `δ` where `T = δ(G, Δ)` — same `G, Δ` → identical obligations.

This reframes C2: determinism is carried by the **formalization**, not the LLM. `δ` is deterministic by construction; any residual nondeterminism is isolated to (and measured at) the extraction front-end. E1 then validates engine determinism + extraction-stability separately; E2/E3 validate the engine's output quality. The engine is also the shippable artifact.

## Source context (reconnaissance already done)

- **Derivation function = LLM agent.** The pipeline is the `domainspec-generate-tests` skill (`agent: domainspec-test-designer`), reading `domainspec/TEST-PIPELINE.md` + `CHANGELOG.md` as derivation rules and the feature's `states/operations/interfaces/events.md`. It claims "deterministic test specifications" but is realized by an LLM. → **direct threat to E1's Jaccard = 1.0 criterion.**
- **Features live in a different submodule.** `auth-access-control`, `financial-settlement`, `player-management` are in `validation/poker-team/docs/features/...`, with real backend domain code + existing e2e/use-case tests (`validation/poker-team/backend/src/...`). The derivation skill is in `implementation/domainspec`. The protocol never names this cross-repo surface; **submodule discipline applies**.
- **No measurement tooling exists** for: obligation-ID extraction, pairwise Jaccard, system-prompt hashing, mutant classification, JSONL run capture. E6/E9 establish the JSONL + 10-step (Wohlin 2012) analysis convention to reuse.
- **E2 needs a human tester** (the operator) writing blind test plans — bias + availability risk.
- **E3 needs Stryker setup** + an existing manual baseline suite to compare against.

## Write scope

Target-local run folder only: `development/refinement-runs/2026-06-12-test-derivation-c2-cluster/`. No edits to E1/E2/E3 spec files during refine; the hardened design lives in `RESULT.md` and feeds `/invoke`.

## Done criteria

1. Each experiment attacked across construct / internal / external / statistical-conclusion validity; named threats with severity.
2. An explicit **missing-steps ledger** (tooling, fixtures, cross-repo execution, metadata) required before any run.
3. A resolution for the E1 determinism tension: a precise, runnable definition of "same tests" (string-identity vs obligation-semantic-set) and the control conditions (temperature, model pin, frozen prompt+rules hash) that make the criterion testable rather than aspirational.
4. A cheap falsification probe defined (toy run of derivation on one feature) that de-risks the full protocol before committing GPU/human time.
5. A hardened, runnable design per experiment + execution-order recommendation, handed to `/invoke` for the plan.
6. **Engine design**: one recommended deterministic-derivation-engine architecture (chosen via tournament over candidates), its determinism boundary (what is pure `δ` vs what residual LLM extraction remains), the MVP build boundary, and the prerequisites it imposes on `TEST-PIPELINE.md` + the formal-doc schema. The engine reframes E1 (determinism by construction + extraction-stability measured); confirm E2/E3 still hold against engine output.

## Validation surface

Parallel adversarial dialectic — four role-bound subagents (E1 / E2 / E3 attackers + Measurement-&-Infra Cartographer), Refine-owned convergence and synthesis.

## Preset / research

- Preset: `standard`
- Research: `research-if-gap-appears` (default) — internal experiments; methodology (Wohlin 2012, mutation testing, Jaccard, LLM determinism controls) is already known. Trigger bounded research only on a named gap (e.g. accepted determinism-measurement methodology for stochastic generators).

## Planned stage configuration

Canonical ten-stage loop. Define/Design/Interrogation/Distill critique delegated to the four adversarial subagents; Refine owns synthesis. Plan stage produces the non-executed hardened design that `/invoke` consumes.
