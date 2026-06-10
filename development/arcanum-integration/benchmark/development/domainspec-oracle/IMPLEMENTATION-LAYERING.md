---
observed_capability: invoke
invoke_mode: plan
artifact: implementation-layering
target_artifact: DomainSpec Oracle Provider
complexity: medium
date: 2026-06-10
---

# IMPLEMENTATION-LAYERING — DomainSpec Oracle Provider

Layers bounded by value/cost; each graduates through the Benchmark Evidence Bridge (prove the
contract on one real domainspec feature before scoring claims).

## L0 — Deterministic conformance MWU (no test execution)

- **Scope:** D1 alignment-gap (spec concept rows vs code export symbols) + D2 residue
  (spec-gap/governance-gap/rework), on one real domainspec feature; emit `score-result.json`.
- **Value:** a working **spec→code drift oracle on day one**, pure static + git, no container.
- **Promotion evidence:** runs on one `implementation/domainspec` feature; produces a drift number
  and residue counts derived only from files + git history; Evidence-Bridge contract probe recorded.
- **Boundary:** no derived tests, no runtime metrics, no rubric.

## L1 — Spec-derived test + observability scoring (needs container)

- **Scope:** D3 test-obligation satisfaction (frozen reverse-validated tests passed / `|T|`) + D4
  observability coverage (metrics emitted / `|O|`).
- **Value:** the correctness backbone — the hard reward core.
- **Promotion evidence (from L0):** containerized `pnpm i && build && test` for domainspec is
  deterministic; `FrozenOracle` built once by a version-pinned generator; reverse-test gate passes.
- **Boundary:** requires resolving domainspec's missing CI/Docker first.

## L2 — Traceability + graded verdict

- **Scope:** D5 traceability completeness (concept→test→code→metric) + D6 PASS/FLAG/BLOCK rollup +
  blocker gating via the Three-Layer Metric Architecture (Domain Fidelity = P0).
- **Value:** the human-readable conformance verdict + the blocker semantics for the reward.
- **Promotion evidence (from L1):** test + obligation graphs exist to trace against.

## L3 — Meta + advisory (DEFERRED)

- **Scope:** D7 governance attenuation A(k) (scores the orchestration layer; needs the signal
  corpus) + the optional LLM mergeability rubric (advisory only).
- **Value:** a meta-objective for the skills + a soft quality read.
- **Promotion evidence required:** a populated signal corpus (paper E7, currently empty); rubric
  stays advisory and never enters the reward.
- **Boundary:** out of the reward backbone.

## Layer decision snapshot

| Layer | Dimensions | Build now?            | Gate to next                                               |
| ----- | ---------- | --------------------- | ---------------------------------------------------------- |
| L0    | D1, D2     | yes                   | drift + residue computed on one real feature               |
| L1    | D3, D4     | yes (after container) | domainspec containerized + frozen reverse-validated oracle |
| L2    | D5, D6     | yes                   | test/obligation graphs exist                               |
| L3    | D7, rubric | deferred              | signal corpus populated; rubric stays advisory             |
