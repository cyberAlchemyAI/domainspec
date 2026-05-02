---
tags: [agents, dispatch, capability-tier, subagents, orchestration, subagents-strategy]
node_type: premise
is_session: false
layer: architecture
nature: technical, operational
status: exploratory
veracidade: medium
convicção: high
version: 0.2.0
last_updated: 2026-05-02
---

# Subagents-Strategy Premises

> Working hypotheses that govern when, how, and with what capability tier we dispatch subagents. These generalize the scope-design claims of robot-talks beyond investigation, and add explicit rules for capability-tier selection, per-strategy token budgeting, and per-investigation governance.

---

## Objective

This document defines the **working assumptions** behind subagent dispatch. They answer: *"When is a subagent the right tool, which capability tier do we use, and what governance must exist before agents run?"*

Unlike axioms, these are bets — expected to be revised as we accumulate operational evidence. Each carries `convicção` and `veracidade` levels and a falsification test.

For the declarative rules derived from these premises, see `subagents-strategy-constitution.md` (forthcoming). For the executable behavior that implements those rules, see the `subagents-strategy` skill (forthcoming). For the related investigation-specific pattern, see `robot-talks-premises.md`.

---

## Index

1. [P-AD-1 — Dispatch Threshold: Subagents Are Not Free](#p-ad-1--dispatch-threshold-subagents-are-not-free)
2. [P-AD-2 — Capability-Tier Selection Matches Cognitive Load](#p-ad-2--capability-tier-selection-matches-cognitive-load)
3. [P-AD-3 — Parallelization Requires Independence](#p-ad-3--parallelization-requires-independence)
4. [P-AD-4 — Single-Message Fan-Out](#p-ad-4--single-message-fan-out)
5. [P-AD-5 — Gate Before Fan-Out](#p-ad-5--gate-before-fan-out)
6. [P-AD-6 — Briefing Contract Determines Output Quality](#p-ad-6--briefing-contract-determines-output-quality)
7. [P-AD-7 — Trust But Verify](#p-ad-7--trust-but-verify)
8. [P-AD-8 — Recursion Needs Explicit Budget](#p-ad-8--recursion-needs-explicit-budget)
9. [P-AD-9 — No Dispatch Without a Confirmed Strategy](#p-ad-9--no-dispatch-without-a-confirmed-strategy)
10. [P-AD-10 — Strategy Files Are Evaluated Artifacts](#p-ad-10--strategy-files-are-evaluated-artifacts)
11. [Connections](#connections)

---

## P-AD-1 — Dispatch Threshold: Subagents Are Not Free

`convicção: high` · `veracidade: medium`

Subagents carry a fixed orchestration cost: briefing prompt, summarization at return, context loss at the boundary. Below a certain task size that cost dominates the work. As a working bet: do not dispatch a subagent for tasks under ~3 tool calls or that fit comfortably in current context. Use subagents to (a) parallelize independent work, (b) protect the main context from large outputs, or (c) isolate exploratory work whose results may not be worth keeping.

### Test for Falsification

This premise is false if: dispatching subagents for sub-3-call tasks measurably improves quality or speed without inflating token cost.

### Evidence

- ⏳ No operational measurement yet.
- ✅ Anecdotal: research-question lookups under 3 tool calls completed in main thread are cheaper than the equivalent subagent dispatch.

---

## P-AD-2 — Capability-Tier Selection Matches Cognitive Load

`convicção: high` · `veracidade: medium`

A subagent's capability tier should be chosen by the cognitive load of the task, not by parent inheritance. Tiers are LLM-agnostic — they describe the work, not the worker. The mapping from tier to a specific provider model is a configuration concern, not a rule of this discipline. Hard-coding provider model names here would couple the rule to a vendor's lineup.

As a working bet:

- **Mechanical tier** — scoped lookups, file inventory, grep aggregation, mechanical transformations, single-question research with a known answer shape.
- **Synthesis tier** — synthesis across 3+ sources, plan generation, judgment calls, code review where a wrong answer has consequences.
- **Judgment tier** — cross-domain reasoning, ambiguous specs, governance/architecture decisions, anything whose output compounds downstream.

Default rule: **one tier below the parent agent unless you can name why you need more.**

**Token budgets are per-strategy, justified by expected output shape.** Budgets are not specified universally at the tier level. The strategist subagent sets per-subagent token budgets at dispatch time, justified by the task's expected output shape. Strategies for unbounded exploratory work declare no budget; strategies for scoped tasks with a known output shape declare a budget.

### Test for Falsification

This premise is false if: tier-matched dispatch produces measurably worse outcomes than always-judgment-tier or always-synthesis-tier at comparable cost; or if the tier rules misclassify task types frequently enough that strategy files routinely override.

### Evidence

- ⏳ No operational measurement yet.
- ✅ Today's mechanical-tier investigation (file inventory + grep) ran on the mechanical tier and produced a complete report — confirms mechanical-class for scoped lookups.

---

## P-AD-3 — Parallelization Requires Independence

`convicção: high` · `veracidade: high`

Generalizes [[robot-talks-premises#P-RT-7]] beyond investigation: agents may only run in parallel when their tasks share no state and have no sequential dependency. When in doubt, sequential — debugging entangled parallel agents costs more than the wall-clock saved.

### Test for Falsification

This premise is false if: parallel dispatch with shared state or sequential dependencies produces equivalent or better outcomes than sequential dispatch.

### Evidence

- ✅ Robot-talks POC (cited in robot-talks-premises): non-overlapping concerns produced clean synthesis; concern overlap created ambiguity.

---

## P-AD-4 — Single-Message Fan-Out

`convicção: high` · `veracidade: high`

When dispatching N parallel agents, all tool calls must be made in a single assistant message. Sequential dispatch silently loses parallelism — the orchestrator waits for each agent before launching the next.

### Test for Falsification

This premise is false if: sequentially-dispatched parallel-eligible agents complete in equivalent wall-clock to single-message fan-out.

### Evidence

- ✅ Mechanical: the runtime executes tool calls within a single message in parallel; calls split across messages are serialized.

---

## P-AD-5 — Gate Before Fan-Out

`convicção: high` · `veracidade: high`

Before launching parallel agents, the shared contract — data schema, scope boundaries, taxonomy, decomposition — must be locked. Otherwise N parallel agents produce N reports that disagree on inputs, and synthesis collapses. The chat-ui-variants Phase 1 → Phase 2 → Phase 3 pattern is the canonical shape: contract → parallel producers → consolidator.

### Test for Falsification

This premise is false if: parallel agents launched without a locked contract produce coherent, synthesizable outputs at the same rate as gated dispatch.

### Evidence

- ✅ Chat-ui-variants strategy explicitly sequences contract definition before parallel template generators.
- ✅ Robot-talks P-RT-2 (scope design determines signal quality) makes the same claim for investigation.

---

## P-AD-6 — Briefing Contract Determines Output Quality

`convicção: high` · `veracidade: high`

The single biggest quality lever on subagent output is the briefing prompt. Every subagent invocation must include: goal, why it matters, what's already been ruled out, expected output shape, and length cap. Terse command-style prompts ("find the bug", "review this code") produce shallow generic work because the agent has no context to make judgment calls.

### Test for Falsification

This premise is false if: minimal command-style prompts produce equivalent output quality to full briefing prompts on tasks requiring judgment.

### Evidence

- ✅ Direct experience: subagents given full briefing routinely produce structured reports with traceable findings; subagents given terse prompts return generic surveys.
- ✅ Aligns with P-SYS-6 (implied knowledge is lost knowledge).

---

## P-AD-7 — Trust But Verify

`convicção: high` · `veracidade: high`

A subagent's report describes intent, not necessarily what happened. For any subagent that wrote code, edited files, or claimed a verification passed, the parent must inspect the actual diff or run the actual check before treating the work as done.

### Test for Falsification

This premise is false if: subagent self-reports match observed outcomes at a rate high enough to skip verification without quality loss.

### Evidence

- ✅ Direct experience: subagents have reported "tests pass" while leaving failing tests; have reported "file written" while writing to wrong path.
- ✅ Aligns with P-SYS-3 (docs/code as source of truth, not narration).

---

## P-AD-8 — Recursion Needs Explicit Budget

`convicção: high` · `veracidade: medium`

A subagent that may itself spawn subagents must receive an explicit depth and breadth budget in its briefing prompt. Without bounds, recursive dispatch produces tree explosion — untraceable cost, untraceable provenance, no way to estimate completion.

### Test for Falsification

This premise is false if: unbudgeted recursive dispatch terminates predictably and produces traceable cost in practice.

### Evidence

- ⏳ No operational measurement yet — recursive dispatch has been rare so far.
- ✅ Theoretical: the search tree branching factor is unbounded by default and the runtime imposes no global budget.

---

## P-AD-9 — No Dispatch Without a Confirmed Strategy

`convicção: high` · `veracidade: medium`

Any non-trivial investigation or implementation that uses subagents must produce a strategy file in `subagents-strategy/` adjacent to the working folder, **before** agents launch. The strategy must be confirmed by the user. The file declares: context, goal, success criteria, decomposition, capability tier per agent, token budget per agent (when justified), sequencing, and exit criteria. This makes dispatch an auditable artifact rather than an in-the-moment improvisation.

"Non-trivial" means: 2+ agents, or a single agent above mechanical tier, or recursion. Single mechanical-tier lookups are exempt.

### Test for Falsification

This premise is false if: ad-hoc dispatch (no strategy file) produces equivalent quality and cost predictability to strategy-gated dispatch.

### Evidence

- ⏳ No operational measurement yet — this premise is being introduced by this document.
- ✅ The single existing `agents-strategy.md` (chat-ui-variants) demonstrates the value of a written contract for multi-phase dispatch.

---

## P-AD-10 — Strategy Files Are Evaluated Artifacts

`convicção: medium` · `veracidade: low`

Every strategy file is evaluated at completion against its own success criteria along four components, presented on a 0–1 scale for orientation:

- **Coverage** — did the decomposition cover the goal?
- **Independence** — were concerns non-overlapping (P-AD-3, P-RT-7)?
- **Fidelity** — were findings traceable to evidence (P-RT-8)?
- **Cost discipline** — did agents stay within declared token budgets (when budgets were declared)?

Persistent low scores on a component are *signals* that the underlying premise may be wrong; sustained high scores are *signals* of accumulating evidence. Without an evaluation surface, we cannot tell whether dispatch is improving.

### Discipline note — measurement vs. judgment

Of the four components, **only cost discipline is mechanically computable** from the execution log (declared budget vs. actual token usage). **Coverage** is partially mechanical (count of declared success criteria the outputs address) but requires judgment to assess fit. **Independence** and **fidelity** are evaluator judgments dressed in numbers for coordination ease — they are disciplines, not measurements. Treating the aggregate score as a metric would manufacture false rigor; the 0–1 scale here is a coordination device, not a measurement. This is why this premise carries `veracidade: low`: three of the four dimensions are unmeasured by construction until instrumentation lands.

### Test for Falsification

This premise is false if: evaluations correlate poorly with downstream outcome quality (the score does not predict whether the investigation produced actionable results).

### Evidence

- ⏳ No evaluations collected yet — this premise is the introduction.

---

## Connections

| Node | Relationship | Purpose |
|------|--------------|---------|
| [robot-talks-premises.md](./robot-talks-premises.md) | `extends` | Generalizes P-RT-2 / P-RT-6 / P-RT-7 / P-RT-8 from investigation to all subagent dispatch |
| [robot-talks-constitution.md](../constitution/robot-talks-constitution.md) | `generalizes` | Robot-talks is a specialization of dispatch; these premises cover the broader pattern |
| [system-premises.md](./system-premises.md) | `derives-from` | P-SYS-3 (docs as source) and P-SYS-7 (revisability) ground P-AD-6 and P-AD-10 |
| `subagents-strategy-constitution.md` *(forthcoming)* | `codified-as` | Declarative rules derived from these premises |
| `subagents-strategy` skill *(forthcoming)* | `operationalized-by` | Executable behavior that enforces the constitution at dispatch time |
| `templates/subagents-strategy.md` *(forthcoming)* | `instantiated-by` | Per-investigation strategy file template (P-AD-9, P-AD-10) |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.2.0 | 2026-05-02 | Renamed file `agent-dispatch-premises.md → subagents-strategy-premises.md` per D-1 of subagents-strategy.md (concept reverted from `agents-strategy` back to `subagents-strategy`). Replaced provider-model names (Haiku/Sonnet/Opus) with LLM-agnostic capability tiers (mechanical/synthesis/judgment). Removed universal token-budget table; budgets now per-strategy. Added discipline note to P-AD-10 distinguishing the one mechanically-computable dimension (cost) from the three evaluator judgments (coverage / independence / fidelity). Lowered framing of the 0–1 scale to coordination device, not metric. |
| 0.1.0 | 2026-05-02 | Initial premise set (10 premises). Synthesized from chat-ui-variants strategy file, robot-talks premises, and operational subagent-dispatch experience. P-AD-3/4/5/6/7 marked `veracidade: high` (mechanically grounded or POC-validated); P-AD-1/2/8/9 marked `medium` (logically sound, awaiting operational data); P-AD-10 marked `low` (no evaluations collected yet). |
