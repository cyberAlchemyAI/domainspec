---
observed_capability: invoke
invoke_mode: plan
artifact: implementation-plan
target_artifact: DomainSpec Oracle Provider
complexity: medium
date: 2026-06-10
---

# PLAN — DomainSpec Oracle Provider

Plan → Waves → Tasks. L0–L2 in scope; L3 deferred.

## Wave 1 — L0 deterministic conformance (no container)

### T1.1 Contract probe (Evidence Bridge)

- **Detail:** record a `BenchmarkContractProbe` for the DomainSpec source: where specs live
  (`implementation/domainspec/docs/features/<feature>/`), the concept-graph fields, the
  domain-code module path, score semantics. No scoring yet.
- **Validation:** probe artifact exists for one chosen feature.

### T1.2 Concept-graph parser

- **Detail (algorithmic):** parse the spec docs (states/operations/interfaces/events/queries/
  mappings) into `{concepts[], edges[]}` using the §4 meta-types. Input: feature spec dir. Output:
  `concept-graph.json`. Edge cases: missing doc → record as a coverage gap, not a crash.
- **Validation:** concept count matches a hand-tally on one feature.

### T1.3 D1 alignment-gap detector

- **Detail (algorithmic):** diff concept rows (from the graph) against **export symbols** in the
  feature's domain code (TS exports). `alignment_gap = |concepts_without_matching_symbol| +
|symbols_without_matching_concept|`, reported both directions (spec-ahead vs code-ahead).
  Pure static. Output: drift count + the two orphan lists.
- **Validation:** seed a feature with a deliberately unimplemented concept → it appears in the
  spec-ahead list; an extra exported symbol → code-ahead list.

### T1.4 D2 deterministic residue detectors

- **Detail (algorithmic):** `spec-gap` = count TODO/FIXME in the feature's generated code;
  `governance-gap` = is the git diff scope ⊆ the expected feature directory (1 if out-of-scope
  writes); `rework` = count files in the change set modified >1× in the session/PR window.
- **Validation:** seeded fixtures (a TODO; an out-of-scope edit; a twice-touched file) resolve.

### T1.5 Emit `score-result.json` (L0)

- **Detail:** combine D1+D2 into a `ScoreResult` derived ONLY from raw evidence (files + git);
  no LLM. Normalize to `OracleEvidence`.
- **Validation:** re-running on the same inputs yields a byte-identical score (determinism check).

## Wave 2 — L1 test + observability (needs container)

### T2.1 Containerize domainspec build+test

- **Detail:** pin a Docker image: `pnpm i && pnpm -r build && (cd backend && pnpm test)`. This is
  the prerequisite blocker (domainspec has no CI/Docker). Wire through `docker-evaluator.ts`.
- **Validation:** the same feature's tests run deterministically twice in the container.

### T2.2 FrozenOracle builder + reverse-test gate

- **Detail (algorithmic):** generate the derived tests once with a **version-pinned** generator;
  admit a test to `FrozenOracle` only if it **fails on a known-broken variant** of the impl
  (reverse-classical). Record `|T|`, `|O|` (the deterministic obligation counts, §5.3).
- **Validation:** a vacuous always-pass test is rejected by the reverse gate.

### T2.3 D3/D4 scoring

- **Detail:** run the frozen tests → `passed/|T|`; check derived OTel metric emission →
  `emitted/|O|`. Per-rule δ and O sub-scores.
- **Validation:** scores reproduce a hand-count on one feature.

## Wave 3 — L2 traceability + verdict

### T3.1 D5 traceability graph + D6 verdict

- **Detail:** build concept→test→code→metric links; flag orphans (code w/o spec) and unimplemented
  (spec w/o code). Roll up to PASS/FLAG/BLOCK with Domain-Fidelity (P0) blocker gating (§5.5).
- **Validation:** the §8.4 verdict pattern reproduces on a feature with known spec-ahead drift (FLAG).

## Deferred — L3

- D7 A(k) (needs signal corpus) + advisory rubric. Handoff, not tasked.

## Validation strategy summary

| Slice    | Validation                                                                            |
| -------- | ------------------------------------------------------------------------------------- |
| L0 D1/D2 | seeded drift/residue fixtures resolve; score is deterministic (byte-identical re-run) |
| L1 D3/D4 | containerized tests deterministic; reverse gate rejects vacuous tests                 |
| L2 D5/D6 | verdict reproduces §8.4 drift pattern                                                 |

## Owner boundary

This package is the **oracle/reward only**. The optimization loop is sketched in
experiment-harness and must consume this provider as a frozen, version-pinned external reward.

## Next route

`task-session` for T1.1–T1.5 (L0). Container work (T2.1) gates L1. The loop lives in
experiment-harness, never here.
