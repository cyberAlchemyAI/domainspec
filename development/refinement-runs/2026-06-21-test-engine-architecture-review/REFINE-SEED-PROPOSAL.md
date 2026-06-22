---
node_type: refinement-seed
title: Refine Seed — Test-Engine Lifecycle Architecture gap review
status: proposed
created: 2026-06-21
owner: refine
---

# Refine Seed — Test-Engine Lifecycle Architecture Gap Review

- Run id: `2026-06-21-test-engine-architecture-review`
- Operator intent: "treat this as a test-engine project; review the lifecycle architecture (formal/architectural/domainspec/real-life) for gaps."

## Target

The test-engine lifecycle architecture `development/deterministic-test-derivation-engine/LIFECYCLE-ARCHITECTURE.md` + the artifacts it must stay consistent with: SPEC.md, ARCHITECTURE.md, GLOSSARY.md, docs/features/test-derivation-engine/, the SMT/FOL tower (research/smt-fol-test-derivation/), E3 results (docs/research/results/E3-results.md), and the plans (promotion-plan/, computational-obligation-plan/).

## Done criteria

1. A severity-ranked gap ledger across the 4 models + the LLM-replacement task, real-vs-noise classified.
2. Consistency check: architecture vs the real engine code + SPEC + E3 numbers (no claim > proof).
3. Refined architecture deltas (non-executed) to close the real gaps.

## Write scope

Target-local run folder only. No architecture edits applied (deltas proposed).

## Validation surface

4 tensioned reviewers (formal / architectural+lifecycle / domainspec+LLM-replacement / consistency+over-build skeptic); Refine-owned synthesis.

## Preset / research

- Preset: standard · Research: research-if-gap-appears (local).
