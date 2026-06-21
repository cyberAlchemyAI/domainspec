---
node_type: refinement-seed
title: Refine Seed — E3 Mutation-Testing Execution Plan
status: proposed
created: 2026-06-21
owner: refine
---

# Refine Seed — E3 Mutation-Testing Execution Plan

- Run id: `2026-06-21-e3-mutation-plan`
- Operator intent (verbatim): "refine a plan for doing e3 — is allowed to install stryker and vitest"

## Target

A runnable, non-executed plan to execute **E3 (mutation testing)** for the deterministic test-derivation engine: install + wire Stryker on the pure `validation/poker-team/backend/src/domain/**` slice, run the engine-emitted `__derived__` suite as the derived arm vs a clean-room manual control, and produce calibrated mutation metrics.

## Source context

- Engine core finished (P1–P4) at `implementation/domainspec` commit `5631765`; emit_tests writes runnable vitest to `validation/poker-team/backend/src/domain/__derived__/` (11 real assertions + 56 honest coverage_gap for financial-settlement; byte-stable).
- Reframe basis: [../2026-06-21-c2-engine-to-evidence/RESULT.md](../2026-06-21-c2-engine-to-evidence/RESULT.md) §6 (cross-repo) + §7 (E3 reframe); the emit-tests/E3 architect receipt `../2026-06-21-c2-engine-to-evidence/stages/emit-tests-e3-architect.md`.
- E3 was environment-blocked; **now explicitly allowed to install Stryker + vitest** in the poker-team backend.

## Open uncertainties to resolve

1. Stryker + `@stryker-mutator/vitest-runner` compatibility with the backend's vitest version (orig B-003) — spike before planning the full run.
2. Contamination: the repo's existing `*.test.ts` were authored by the DomainSpec pipeline → they may already BE "derived." What is a legitimate clean-room manual control vs the engine-derived arm?
3. Mutant classification rubric + equivalent-mutant handling; honest metric gates (drop brittle =0/≥70% until a pilot calibrates).

## Write scope

Target-local run folder only. No Stryker install committed, no mutation run, no engine mutation. (The spike may install locally to test compatibility; node_modules is gitignored.)

## Done criteria

1. A confirmed Stryker+vitest install/wire plan for the pure `src/domain/**` slice (with the spike result).
2. An honest three-arm comparison design (engine-derived `__derived__` vs clean-room manual vs pipeline-authored reference), resolving the contamination tension.
3. Mutant classification rubric + equivalent-mutant handling + metrics + JSONL schema + pre-registration against `engine_commit`, honoring cross-submodule discipline.
4. A non-executed plan ready for a later task-session.

## Validation surface

Two role-bound subagents (Env Cartographer + Stryker spike; E3 Protocol Designer), Refine-owned synthesis.

## Preset / research

- Preset: `standard`
- Research: `research-if-gap-appears` (the Stryker/vitest-runner check is a local spike, not external research).

## Planned stage configuration

Canonical ten-stage loop; Design/Interrogation delegated to the 2 subagents; Refine-owned synthesis → non-executed E3 plan.
