---
tags: [agents, orchestration, investigation, complexity-reduction, robot-talks]
node_type: premise
is_session: false
layer: architecture
nature: explanatory, technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-04-10
---

# Robot-Talks Premises

> Working hypotheses that guide the design and operation of multi-agent parallel investigation. Each premise is expected to evolve as the pattern is used operationally.

---

## Objective

This document defines the **working assumptions** that underpin robot-talks execution. These are testable bets, not foundational axioms. Each one carries explicit confidence levels (`veracidade`, `convicção`) and success criteria.

For operational rules and patterns, see `docs/vault/constitution/robot-talks-constitution.md`.

For theoretical grounding, see `specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md`.

---

## Index

1. [P-RT-1 — Cross-Layer Tensions Require Multi-Perspective Investigation](#p-rt-1--cross-layer-tensions-require-multi-perspective-investigation)
2. [P-RT-2 — Scope Design Determines Signal Quality](#p-rt-2--scope-design-determines-signal-quality)
3. [P-RT-3 — Synthesis Is Tension Discovery, Not Aggregation](#p-rt-3--synthesis-is-tension-discovery-not-aggregation)
4. [P-RT-4 — Localization Precedes Reduction](#p-rt-4--localization-precedes-reduction)
5. [P-RT-5 — Robot-Talks Implement Pulsed Orchestration](#p-rt-5--robot-talks-implement-pulsed-orchestration)
6. [P-RT-6 — Bounded Scope Is a Precondition](#p-rt-6--bounded-scope-is-a-precondition)
7. [P-RT-7 — Concerns Must Not Overlap; Evidence May](#p-rt-7--concerns-must-not-overlap-evidence-may)
8. [P-RT-8 — Fidelity Increases as Information Rises](#p-rt-8--fidelity-increases-as-information-rises)
9. [Connections](#connections)

---

## P-RT-1 — Cross-Layer Tensions Require Multi-Perspective Investigation

`convicção: high` · `veracidade: high`

When a system spans multiple abstraction layers, assumptions held at one layer often contradict reality in another. A single investigator must trade depth for breadth — going deep on one layer means missing cross-layer contradictions. Assigning bounded concerns to parallel agents, then synthesizing for contradictions, resolves this trade-off.

### Test for Falsification

This premise is false if: A single agent investigating the same problem in the same time (90 min) produces equivalent or better results (fewer false tensioning, more actionable contradictions).

### Evidence

- ✅ POC (frontend-backend alignment, 2026-04-10): 4 agents identified 4 cross-layer tensions that would be invisible to single-agent investigation
- ✅ Organizational reality: Backend engineers say "my code is correct," frontend engineers say "my code is correct," tension lives between them

---

## P-RT-2 — Scope Design Determines Signal Quality

`convicção: high` · `veracidade: high`

Parallel agents do not automatically reduce entropy. They reduce it **only if** the scope decomposition was correct. If you cut the problem along the wrong boundaries, you get blind spots. The value of robot-talks comes from scope design, not from parallelization itself.

Given investigation space $S$ and a decomposition $D = \{S_1, S_2, \ldots, S_k\}$, signal quality $Q$ depends on:

$$Q(D) \propto \text{coverage}(D) \cdot \text{independence}(D)$$

Where:
- **Coverage:** $\frac{|\bigcup S_i|}{|S|}$ — blind spots reduce signal proportionally to importance
- **Independence:** $1 - \frac{\sum_{i \neq j} |S_i \cap S_j|}{|\bigcup S_i|}$ — concern overlap creates synthesis ambiguity

$Q$ is maximized when concerns are complete and non-overlapping. Parallelization affects latency, not $Q$.

### Test for Falsification

This premise is false if: A poorly-scoped 4-agent investigation produces equivalent signal to a well-scoped 4-agent investigation.

### Evidence

- ✅ POC: Concerns (backend mutation, frontend error handling, API contract, communication patterns) were non-overlapping; synthesis was clean
- ✅ Failed decompositions (during POC planning): File-based decomposition ("frontend agents" vs. "backend agents") created concern overlap; abandoned before execution

---

## P-RT-3 — Synthesis Is Tension Discovery, Not Aggregation

`convicção: high` · `veracidade: high`

Combining agent reports is not synthesis. Synthesis is the identification of **tensions** — where findings from different layers contradict documented contracts or mutual assumptions. A robot-talk with 10 findings and 1 systemic tension is more valuable than one with 100 findings and no tensions.

If synthesis cannot point to which agent finding contradicts which other finding or which documented contract — there is no tension. Tensions are found, not created.

### Test for Falsification

This premise is false if: Aggregate findings without identified contradictions prove as actionable as explicit tensions during implementation.

### Evidence

- ✅ POC: Synthesis identified 4 specific contradictions (error inconsistency, idempotency mismatch, race condition, missing job tracking) with cross-agent evidence
- ✅ Human gate: One "tension" (API key difference) was validated as intentional design choice; discarded

---

## P-RT-4 — Localization Precedes Reduction

`convicção: high` · `veracidade: high`

You cannot reduce the complexity of a system you do not understand. Robot-talks are an **auditing tool**. They cannot be invoked to "fix this thing" — only to understand "what are all the ways this thing is misaligned?" Once tensions are mapped, implementation (a separate step) can address them.

### Test for Falsification

This premise is false if: Attempting to implement during the investigation phase produces fewer defects or faster resolution than auditing first.

### Evidence

- ✅ POC: Tensions identified in synthesis directly informed implementation approach (error standardization, idempotency-key header, pessimistic lock)
- ✅ Early implementation (without full audit) would have solved error inconsistency but missed idempotency + race condition; required second pass

---

## P-RT-5 — Robot-Talks Implement Pulsed Orchestration

`convicção: high` · `veracidade: medium`

The three phases map to the [pulsed orchestration thesis](../../business-philosopher/assuntos/orquestracao-multi-agente/tese-orquestracao-por-pulso.md):

- **Descida (Top-Down):** Scope definition — investigator decomposes question into bounded agent roles. Fidelity dominates: a distorted scope contaminates all agent work.
- **Execução (Execution):** Parallel exploration — agents investigate independently, most information is ephemeral. Efficiency dominates: agents should be concise within bounds.
- **Subida (Bottom-Up):** Synthesis + Human Gate — findings condensed, tensions identified, human validates. Entropy and fidelity dominate: synthesis must be minimal, precise, and faithful.

The cost function from the thesis applies: $C = w_1 H + w_2 T + w_3 L - w_4 F$ with phase-dependent weights.

### Test for Falsification

This premise is false if: Robot-talks do not map cleanly to pulsed orchestration phases or if the cost function fails to predict execution efficiency.

### Evidence

- ✅ POC timing aligned with predicted phase distribution (scope 10 min, exploration 40 min, synthesis 20 min, gate 20 min)
- ⏳ Cost function weights need empirical validation (pending session-cost-observability instrumentation)

---

## P-RT-6 — Bounded Scope Is a Precondition

`convicção: high` · `veracidade: high`

If you cannot state what an agent is *not* investigating, you do not have a robot-talk. You have unfocused exploration. Every agent must have an explicitly stated scope and an explicitly stated exclusion.

### Test for Falsification

This premise is false if: Unbounded agent scopes (or partially-bounded) produce equivalent or better synthesis than fully-bounded scopes.

### Evidence

- ✅ POC: All 4 agents had explicit "out of scope" lists; synthesis was unambiguous
- ✅ Initial planning (unbounded): "frontend agent" with no exclusions created confusion; was re-scoped to "frontend error handling strategy" with explicit exclusions

---

## P-RT-7 — Concerns Must Not Overlap; Evidence May

`convicção: high` · `veracidade: high`

No two agents investigate the same *question* or *concern*. But two agents may read the same artifact (e.g., an API contract) from different perspectives. Concern overlap creates ambiguity in synthesis. Evidence overlap is often necessary for tension discovery.

### Test for Falsification

This premise is false if: Evidence overlap (reading same files) produces synthesis ambiguity even when concerns are non-overlapping.

### Evidence

- ✅ POC: Backend mutation and API contract agents both read the same contract, but from different questions ("Does mutation work?" vs. "Is contract documented?"); synthesis was clean
- ✅ Failed decomposition (during planning): Two agents asking "is this idempotent?" created concern overlap; merged into single agent

---

## P-RT-8 — Fidelity Increases as Information Rises

`convicção: high` · `veracidade: high`

Every synthesis statement must be traceable to agent findings. Every agent finding must be traceable to code, documentation, or observable behavior. No assertions without evidence. The chain — evidence → finding → tension → recommendation — must preserve a back-reference at each step. 100% traceability is required. Breaking this chain turns the process into opinion aggregation.

### Test for Falsification

This premise is false if: Tensioning without line-of-code citations produces equivalent actionability compared to fully-traced findings.

### Evidence

- ✅ POC: All 4 tensions traced to specific code locations and documented expectations
- ✅ One finding ("error handling differs") was excluded from synthesis until traced to backend error paths and frontend parsing logic

---

## Connections

| Node | Relationship | Purpose |
|------|--------------|---------|
| [robot-talks-constitution.md](../constitution/robot-talks-constitution.md) | `codified-as` | Constitutional rules that codify these premises |
| [robot-talks-discovery.md](../../specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md) | `grounded-by` | Theoretical argument connecting premises to orchestration |
| [tese-orquestracao-por-pulso.md](../../docs/business-philosopher/assuntos/orquestracao-multi-agente/tese-orquestracao-por-pulso.md) | `instantiates` | Pulsed orchestration thesis (P-RT-5) |
| [discovery/robot-talks-definitions/robot-talks.md](../discovery/robot-talks-definitions/robot-talks.md) | `derives` | The robot-talks discovery consolidates and explains the 8 working premises (P-RT-1 through P-RT-8) defined here. |
| [../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session executed an in-content rename sweep (`subagents-*` → `domainspec-*`). |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-04-10 | Initial premise set (8 premises). Extracted from robot-talks constitution. Validated by POC (frontend-backend alignment). All marked `convicção: high`, `veracidade: high` except P-RT-5 (`veracidade: medium` pending cost instrumentation). |
