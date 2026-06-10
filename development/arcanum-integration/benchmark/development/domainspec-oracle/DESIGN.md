---
observed_capability: invoke
invoke_mode: design
target_artifact: DomainSpec Oracle Provider
target_type: benchmark provider (development package)
target_owner: benchmark (oracle); consumed by experiment-harness (loop, separate)
status: design (candidate, non-executed)
source_paper: research/projects/domainspec/papers/domainspec-paper.md
date: 2026-06-10
---

# DESIGN — DomainSpec Oracle Provider

## 1. What this is

A benchmark provider that scores an implementation against a **DomainSpec specification**
using **deterministic, spec-derived oracles** — the conformance reward for evaluating (and
later optimizing) Arcanum skills. It sits beside [official-swebench.ts](../../src/official-swebench.ts)
and [smellbench.ts](../../src/smellbench.ts) and follows the same Benchmark Evidence Bridge
(contract-probe → one real task → import raw results → emit `score-result.json` → `OracleEvidence`).

It is the **grading oracle only.** The skill-mutation optimization loop is a _separate_
capability (experiment-harness) that consumes this provider as a frozen external reward — see
[the harness boundary sketch](../../../arcana/experiment-harness/development/autoresearch-loop-boundary-sketch.md).

## 2. Why DomainSpec is the right oracle source

Per [the paper](../../../../research/projects/domainspec/papers/domainspec-paper.md) §5.1, obligations
are **deterministically derived** from the concept graph ("LLM agents execute derivation _rules_,
not stochastic generation"). That determinism is what makes the score an **observer-independent,
ungameable reward** — the oracle comes from the spec, not from the agent's self-report. This
directly answers the DCI circularity (§6.2 names it: observer-executor conflation, Conant-Ashby).

## 3. The oracle dimensions (spec-derived)

| Dim | Signal                                | Source   | Computation                                                                                             | Needs test run?     |
| --- | ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ------------------- |
| D1  | **alignment-gap (spec→code drift)**   | §6.6     | diff SPEC concept rows vs domain-code export symbols                                                    | no                  |
| D2  | **deterministic residue**             | §6.6     | `spec-gap` (TODO/FIXME), `governance-gap` (git-diff scope vs feature dir), `rework` (files touched >1×) | no                  |
| D3  | **test-obligation satisfaction**      | §5.2–5.3 | frozen derived tests passed / `\|T\|` (per-rule δ₁–δ₂₀ sub-scores)                                      | yes                 |
| D4  | **observability-obligation coverage** | §5.4     | derived OTel metrics emitted / `\|O\|` (16 O-rules)                                                     | yes (runtime)       |
| D5  | **traceability completeness**         | §8.5     | concept → test → code → metric links present; orphans/unimplemented = drift                             | partial             |
| D6  | **alignment-audit verdict**           | §8.4     | graded PASS / FLAG / BLOCK rollup                                                                       | no                  |
| D7  | **governance attenuation A(k)**       | §6       | φ(k) emission rate of the _orchestration_ layer                                                         | needs signal corpus |

D1–D2, D5, D6 score with **no test execution** (pure static + git). D3–D4 need the containerized
domainspec runner. D7 scores the _agent system_, not the artifact (meta), and needs the (currently
empty) signal corpus.

## 4. Scoring composition (FrontierCode-style, all spec-derived)

- **Hard backbone (the reward):** D1 + D2 + D3 + D4 + D5.
- **Blocker gating:** the Three-Layer Metric Architecture (§5.5) → **Domain Fidelity violations =
  P0 = blockers** (gate non-zero score), Operational Health = P1, Business Effectiveness = P2.
- **Graded rollup:** D6 (PASS/FLAG/BLOCK) as the human-readable verdict.
- **Advisory only (NOT the reward):** an optional LLM mergeability rubric, kept out of any
  optimization objective.
- **Meta (optional separate objective):** D7 governance attenuation.

Output is a **score vector** (not a single scalar) so downstream consumers can weight or do
multi-objective selection; a default scalar rollup is provided for convenience.

## 5. Domain model

| Entity           | Meaning                                                                               |
| ---------------- | ------------------------------------------------------------------------------------- |
| `SpecTask`       | one DomainSpec feature: spec docs + frozen derived oracle + `allowed_files`           |
| `ConceptGraph`   | the typed concepts/edges parsed from the spec (§4)                                    |
| `FrozenOracle`   | version-pinned derived tests + obligation counts `\|T\|`,`\|O\|` (immutable per task) |
| `Implementation` | the artifact under grading (agent output)                                             |
| `ScoreResult`    | per-dimension signals + blocker gating + rollup, derived only from raw evidence       |

## 6. The independence discipline (non-negotiable gates)

From the paper's §6.6 interventions and this whole investigation:

1. **Frozen oracle.** The derived test set + obligation counts are generated once by a
   **version-pinned** generator and locked per task. The oracle never regenerates during grading.
2. **Observer-executor separation.** The oracle process is fully separate from any agent that
   produced the implementation; it reads artifacts and computes — it never invokes the
   implementation skill (§6.6 Intervention 1, dual-agent).
3. **Reverse-test validation.** A derived test enters `FrozenOracle` only if it **fails on a
   known-broken implementation** (filters vacuous always-pass tests).
4. **Deterministic-first.** Prefer computed detectors (D1, D2, L6) over LLM observation (L7).

## 7. Provider shape (promotion target)

`development/domainspec-oracle/` (here) graduates to `src/domainspec-provider.ts`, mirroring
`official-swebench.ts`: task schema, contract probe, runner, raw-result import, `score-result.json`,
`OracleEvidence` normalization. Reuses `docker-evaluator.ts`, score schemas, batch runner.

## 8. Honesty boundaries

- D1, D2, D5, D6 are cheap and buildable **now** (static + git); D3, D4 need the containerized
  domainspec env (domainspec has **no CI/Docker** yet — that's the L1 blocker); D7 needs the
  signal corpus (empty today, paper E7 unrun).
- The oracle scores **conformance to the spec**, so it is only as complete as the spec; gaps in the
  spec = blind spots. Reverse-test validation mitigates vacuous tests, not spec incompleteness.
- This package is the **reward function**; it must never contain the optimization loop.

## Next route

`invoke plan` (PLAN.md + WORK-PACK.md here) → `task-session` for D1/D2 (L0). The loop is sketched
separately in experiment-harness and stays out of this package.
