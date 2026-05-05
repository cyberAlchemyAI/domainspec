---
tags: [agents, dispatch, subagents, orchestration, domainspec-subagents-strategy]
node_type: premise
is_session: false
layer: architecture
nature: technical, procedural
status: exploratory
veracidade: medium
convicção: high
version: 0.4.0
last_updated: 2026-05-02
---

# Subagents-Strategy Premises

> Working hypotheses that govern when, how, and with which model we dispatch subagents. These generalize the scope-design claims of robot-talks beyond investigation, and add explicit rules for model selection, per-strategy token budgeting, and per-investigation governance.

---

## Objective

This document defines the **working assumptions** behind subagent dispatch. They answer: *"When is a subagent the right tool, which model do we dispatch with, and what governance must exist before agents run?"*

Unlike axioms, these are bets — expected to be revised as we accumulate operational evidence. Each carries `convicção` and `veracidade` levels and a falsification test.

For the declarative rules derived from these premises, see `domainspec-subagents-strategy-constitution.md` (forthcoming). For the executable behavior that implements those rules, see the `domainspec-subagents-strategy` skill (forthcoming). For the related investigation-specific pattern, see `robot-talks-premises.md`.

---

## Index

1. [P-SS-1 — Dispatch Threshold: Subagents Are Not Free](#p-ss-1--dispatch-threshold-subagents-are-not-free)
2. [P-SS-2 — Model Selection by Task Difficulty, User-Validated](#p-ss-2--model-selection-by-task-difficulty-user-validated)
3. [P-SS-3 — Parallelization Requires Independence](#p-ss-3--parallelization-requires-independence)
4. [P-SS-4 — Single-Message Fan-Out](#p-ss-4--single-message-fan-out)
5. [P-SS-5 — Gate Before Fan-Out](#p-ss-5--gate-before-fan-out)
6. [P-SS-6 — Briefing Contract Determines Output Quality](#p-ss-6--briefing-contract-determines-output-quality)
7. [P-SS-7 — Trust But Verify](#p-ss-7--trust-but-verify)
8. [P-SS-8 — Recursion Needs Explicit Budget](#p-ss-8--recursion-needs-explicit-budget)
9. [P-SS-9 — No Dispatch Without a Confirmed Strategy](#p-ss-9--no-dispatch-without-a-confirmed-strategy)
10. [P-SS-10 — Strategy Files Are Evaluated Artifacts](#p-ss-10--strategy-files-are-evaluated-artifacts)
11. [Connections](#connections)

---

## P-SS-1 — Dispatch Threshold: Subagents Are Not Free

`convicção: high` · `veracidade: medium`

Subagents carry a fixed orchestration cost: briefing prompt, summarization at return, context loss at the boundary. **Inline execution is the default; dispatch a subagent only when at least one of the following triggers holds:**

- **Synthesis** — 3+ sources must be combined to answer.
- **Context protection** — raw output will exceed ~500 tokens and only a summary is needed downstream.
- **Isolation** — exploratory work whose output may be discarded without polluting parent context.
- **Parallelism** — multiple independent tasks can fan out and the wall-clock saving exceeds orchestration cost.

Each trigger is observable at dispatch moment by the parent, not predicted from future behavior. The earlier "~3 tool calls" heuristic was unmeasurable at decision time; these four are checkable when the dispatch decision is made.

### Test for Falsification

This premise is false if: dispatching subagents for tasks that meet none of these triggers measurably improves quality or speed without inflating token cost; or if tasks meeting one or more triggers consistently produce worse outcomes than inline execution.

### Evidence

- ⏳ No operational measurement yet.
- ✅ Anecdotal: research-question lookups completed in main thread are cheaper than the equivalent subagent dispatch when none of the four triggers apply.

---

## P-SS-2 — Model Selection by Task Difficulty, User-Validated

`convicção: high` · `veracidade: medium`

The strategist names a concrete model per child agent in its chat proposal, justified by a one-line description of task difficulty, and the user validates the selection in the chat confirmation step (P-SS-9 step 2). Selection is by the task, not by parent inheritance — every child's model is named explicitly in the proposal.

There is **no fixed difficulty taxonomy and no fixed tier→model rule** in this premise set. The strategist describes each task in its own words ("requires combining 3+ sources", "scoped lookup", "open-ended reasoning") and proposes the matching model; the user accepts or revises. Patterns that emerge from accumulated proposals may eventually be codified into a vocabulary, but that promotion happens only with evidence — not by speculative taxonomy now.

**Token budgets are per-strategy, justified by expected output shape.** The strategist sets per-subagent token budgets at dispatch time, justified by the task's expected output shape. Strategies for unbounded exploratory work declare no budget; strategies for scoped tasks with a known output shape declare a budget. Budgets are independent of model selection — they constrain output length, not model choice.

### Test for Falsification

This premise is false if: per-dispatch user-validated model selection produces measurably worse outcomes than a fixed rule-based selection (e.g., always-cheap-model or always-expensive-model) at comparable cost; or if per-strategy budgets routinely overrun and indicate fixed budgets would be cheaper.

### Evidence

- ⏳ No operational measurement yet.
- ✅ Anecdotal: investigations with explicit model-per-child justification have been cheaper than dispatches that default every child to the most capable model.

---

## P-SS-3 — Parallelization Requires Independence

`convicção: high` · `veracidade: high`

Generalizes [[robot-talks-premises#P-RT-7]] beyond investigation: agents may only run in parallel when their tasks share no state and have no sequential dependency. When in doubt, sequential — debugging entangled parallel agents costs more than the wall-clock saved.

### Test for Falsification

This premise is false if: parallel dispatch with shared state or sequential dependencies produces equivalent or better outcomes than sequential dispatch.

### Evidence

- ✅ Robot-talks POC (cited in robot-talks-premises): non-overlapping concerns produced clean synthesis; concern overlap created ambiguity.

---

## P-SS-4 — Single-Message Fan-Out

`convicção: high` · `veracidade: high`

When dispatching N parallel agents, all tool calls must be made in a single assistant message. Sequential dispatch silently loses parallelism — the orchestrator waits for each agent before launching the next.

### Test for Falsification

This premise is false if: sequentially-dispatched parallel-eligible agents complete in equivalent wall-clock to single-message fan-out.

### Evidence

- ✅ Mechanical: the runtime executes tool calls within a single message in parallel; calls split across messages are serialized.

---

## P-SS-5 — Gate Before Fan-Out

`convicção: high` · `veracidade: high`

Before launching parallel agents, the shared contract — data schema, scope boundaries, taxonomy, decomposition — must be locked. Otherwise N parallel agents produce N reports that disagree on inputs, and synthesis collapses. The chat-ui-variants Phase 1 → Phase 2 → Phase 3 pattern is the canonical shape: contract → parallel producers → consolidator.

### Test for Falsification

This premise is false if: parallel agents launched without a locked contract produce coherent, synthesizable outputs at the same rate as gated dispatch.

### Evidence

- ✅ Chat-ui-variants strategy explicitly sequences contract definition before parallel template generators.
- ✅ Robot-talks P-RT-2 (scope design determines signal quality) makes the same claim for investigation.

---

## P-SS-6 — Briefing Contract Determines Output Quality

`convicção: high` · `veracidade: high`

The single biggest quality lever on subagent output is the briefing prompt. Every subagent invocation must include: goal, why it matters, what's already been ruled out, expected output shape, and length cap. Terse command-style prompts ("find the bug", "review this code") produce shallow generic work because the agent has no context to make judgment calls.

### Test for Falsification

This premise is false if: minimal command-style prompts produce equivalent output quality to full briefing prompts on tasks requiring judgment.

### Evidence

- ✅ Direct experience: subagents given full briefing routinely produce structured reports with traceable findings; subagents given terse prompts return generic surveys.
- ✅ Aligns with P-SYS-6 (implied knowledge is lost knowledge).

---

## P-SS-7 — Trust But Verify

`convicção: high` · `veracidade: high`

A subagent's report describes intent, not necessarily what happened. For any subagent that wrote code, edited files, or claimed a verification passed, the parent must inspect the actual diff or run the actual check before treating the work as done.

### Test for Falsification

This premise is false if: subagent self-reports match observed outcomes at a rate high enough to skip verification without quality loss.

### Evidence

- ✅ Direct experience: subagents have reported "tests pass" while leaving failing tests; have reported "file written" while writing to wrong path.
- ✅ Aligns with P-SYS-3 (docs/code as source of truth, not narration).

---

## P-SS-8 — Recursion Needs Explicit Budget

`convicção: high` · `veracidade: medium`

A subagent that may itself spawn subagents must receive an explicit depth and breadth budget in its briefing prompt. Without bounds, recursive dispatch produces tree explosion — untraceable cost, untraceable provenance, no way to estimate completion.

**Default budgets (when the strategist's chat proposal does not override):**

- **Depth: 2** — parent → child → grandchild. Beyond depth 2 provenance becomes hard to follow in practice.
- **Breadth: 5 children per level** — matches the robot-talks 3–5 critics range; above 5, synthesis cost exceeds parallelization benefit.
- **Total cap: 10 agents per dispatch tree** — the load-bearing number, since depth × breadth multiplies fast.

**Override mechanism:** the strategy proposal in chat MAY declare a higher budget with explicit justification. No silent overrides; the override and its justification get recorded in the `domainspec-subagents-findings.md` Dispatch record section.

**Enforcement seat:** the strategist tracks live agent count across child invocations and refuses the next dispatch when the cap would be exceeded.

**Exhaustion behavior:** strategist stops dispatching, returns partial findings, and escalates to the user with `budget hit at N agents — continue with raised budget, stop, or revise scope?`

### Test for Falsification

This premise is false if: unbudgeted recursive dispatch terminates predictably and produces traceable cost in practice; or if the named defaults (depth 2, breadth 5, total 10) routinely require override, indicating the defaults are wrong rather than the budget rule.

### Evidence

- ⏳ No operational measurement yet — recursive dispatch has been rare so far.
- ✅ Theoretical: the search tree branching factor is unbounded by default and the runtime imposes no global budget.

---

## P-SS-9 — No Dispatch Without a Confirmed Strategy

`convicção: high` · `veracidade: medium`

Any dispatch that involves **fan-out (2+ agents) or recursion** must produce a **two-file artifact set** in a `/research/` folder adjacent to the working folder, written *after* dispatch completes (per D-11 of `domainspec-subagents-strategy.md`):

- `domainspec-subagents-research.md` — raw per-agent findings, verbatim, no synthesis. Each child's return appears under a per-child header (`## Agent N — <brief>`).
- `domainspec-subagents-findings.md` — three sections in one file: **(1) Dispatch record** at the top — agents chosen, **model per agent (with one-line difficulty justification)**, token budget per agent, sequencing/DAG, dispatch mode, recursion budget, and **actual spend recorded after the fact**; **(2) Findings** — scannable summary plus implications, citing passages in research.md; **(3) Analysis** below — tensions, contradictions, cross-cutting reasoning. Both findings and analysis cite research.md.

The strategy proposal itself **lives only in chat** — no `domainspec-subagents-strategy.md` file is ever written. The proposal-confirmation gate is enforced by the conversation, not by a phantom file.

The lifecycle is six steps and **no file is written until step 4**:

1. The **strategist** subagent drafts the proposed strategy **in chat** — mode, agents, model per agent (with difficulty justification), budgets, sequencing, recursion budget. No file on disk.
2. The user confirms the proposal in chat (or revises / abandons; nothing persists on rejection).
3. The strategist dispatches children in a single message (P-SS-4) and collects their returns.
4. The strategist writes `domainspec-subagents-research.md`, assembling each child's verbatim return under its per-child header. **Children do not write files directly** — this avoids parallel-write race conditions.
5. A **`domainspec-subagents-findings-writer`** subagent reads research.md and writes `domainspec-subagents-findings.md` (Dispatch record + Findings + Analysis).
6. The parent presents findings to the user with the question: *"promote this to a discovery node?"* If yes, a **`domainspec-subagents-discovery-writer`** subagent writes the vault discovery document with proper ontology frontmatter and connections. If no, the dispatch ends with the two artifact files.

Splitting *propose → confirm → dispatch+research → findings → optional discovery* across this lifecycle keeps each step auditable: the proposal is a chat artifact, the research file is traceable to confirmed children, the findings agent works only from on-disk research, and discovery promotion requires explicit user consent.

**Trigger:** fan-out (2+ agents) OR recursion. Single-agent dispatches produce no files — the parent's briefing and the agent's return is the audit trail. The strategy-artifact requirement exists to make multi-agent coordination auditable; with only one agent, there is nothing to coordinate. Whether to dispatch at all is governed by P-SS-1.

### Test for Falsification

This premise is false if: ad-hoc dispatch (no two-file artifact set) produces equivalent quality and cost predictability to artifact-gated dispatch; or if the children-do-not-write rule produces no measurable benefit over allowing children to append directly to research.md.

### Evidence

- ⏳ No operational measurement yet — this premise is being introduced by this document.
- ✅ The single existing strategy file (chat-ui-variants) demonstrates the value of a written contract for multi-phase dispatch.
- ✅ Theoretical: parallel writes from independent subagent processes to the same file are unsynchronized and can clobber each other; the chat-ui-variants Phase 2 → Phase 3 pattern (children return, consolidator assembles) avoids this by construction.

---

## P-SS-10 — Strategy Files Are Evaluated Artifacts

`convicção: medium` · `veracidade: low`

Every fan-out / recursion dispatch is evaluated at completion against its own success criteria along four components (recorded in the Dispatch record section of `domainspec-subagents-findings.md`), presented on a 0–1 scale for orientation:

- **Coverage** — did the decomposition cover the goal?
- **Independence** — were concerns non-overlapping (P-SS-3, P-RT-7)?
- **Fidelity** — were findings traceable to evidence (P-RT-8)?
- **Cost discipline** — did agents stay within declared token budgets (when budgets were declared)?

Persistent low scores on a component are *signals* that the underlying premise may be wrong; sustained high scores are *signals* of accumulating evidence. Without an evaluation surface, we cannot tell whether dispatch is improving.

### Discipline note — measurement vs. judgment

Of the four components, **only cost discipline is mechanically computable** from the execution log (declared budget vs. actual token usage). **Coverage** is partially mechanical (count of declared success criteria the outputs address) but requires judgment to assess fit. **Independence** and **fidelity** are evaluator judgments dressed in numbers for coordination ease — they are disciplines, not measurements. Treating the aggregate score as a metric would manufacture false rigor; the 0–1 scale here is a coordination device, not a measurement. This is why this premise carries `veracidade: low`: three of the four dimensions are unmeasured by construction until instrumentation lands.

The identity of the evaluator (parent agent at dispatch close, a separate grader subagent, or the user) is itself unsettled — see OQ-3 of `domainspec-subagents-strategy.md`. Until that resolves, the discipline is: whoever closes the dispatch must record the four-component judgment in the **Dispatch record section** of `domainspec-subagents-findings.md`, even if the only mechanical figure is cost.

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
| [system-premises.md](./system-premises.md) | `derives-from` | P-SYS-3 (docs as source) and P-SYS-7 (revisability) ground P-SS-6 and P-SS-10 |
| [[domainspec-premises]] | `derives-from` | The domainspec-subagents-strategy premises (P-SS-*) are domain-specific specializations of P-DS-1 (multi-agent decomposition holds the L1→L2 invariant) and P-DS-8 (recommend-don't-auto-invoke for fan-out skills). |
| `domainspec-subagents-strategy-constitution.md` *(forthcoming)* | `codified-as` | Declarative rules derived from these premises |
| `domainspec-subagents-strategy` skill *(forthcoming)* | `operationalized-by` | Executable behavior that enforces the constitution at dispatch time and emits the two-file artifact set (research + findings) |
| [domainspec-subagents-strategy.md §D-11](../discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md) | `produces` | Two-file `/research/` output set — `domainspec-subagents-research.md` + `domainspec-subagents-findings.md` — emitted per fan-out/recursion dispatch (P-SS-9). Strategy proposal lives in chat only. |
| [domainspec-subagents-strategy.md §D-12](../discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md) | `scoped-by` | Subagents-strategy is a tool, not a pipeline stage — premises here govern dispatch, not drift-convergence flow |
| `templates/domainspec-subagents-research.md` *(forthcoming — folder does not yet exist)* | `shape-contract-for` | Skill-emitted research file: per-agent verbatim findings under per-child headers, no synthesis |
| `templates/domainspec-subagents-findings.md` *(forthcoming)* | `shape-contract-for` | Skill-emitted findings file: Dispatch record + Findings + Analysis sections; both findings and analysis cite research.md |
| [../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session executed the project-wide rename (`domainspec-subagents-strategy-premises` → `domainspec-subagents-strategy-premises`). |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.4.0 | 2026-05-02 | **Stripped tier vocabulary entirely** per user direction. (1) **P-SS-2**: rewritten as "Model Selection by Task Difficulty, User-Validated" — strategist proposes a concrete model per child agent with a one-line difficulty justification, user validates in chat (P-SS-9 step 2). No fixed tier taxonomy, no fixed tier→model mapping rule. Per-strategy token budgets claim retained as an independent, model-orthogonal rule. (2) **P-SS-9 Dispatch record schema**: replaced "capability tier per agent" with "model per agent (with one-line difficulty justification)"; replaced lifecycle step 1's "tiers" with "model per agent". (3) Frontmatter `tags`: dropped `capability-tier`. (4) Knock-on edits to discovery doc D-5/D-6/D-9/D-10/D-11, A-4, OQ-3/OQ-4, §Lifecycle, and other tier references. |
| 0.3.0 | 2026-05-02 | Major redesign of P-SS-1, P-SS-8, P-SS-9 from open-question resolutions in chat with the user. (1) **P-SS-1**: replaced the unmeasurable "~3 tool calls" heuristic with four observable positive triggers (synthesis / context protection / isolation / parallelism), each checkable at dispatch moment. (2) **P-SS-8**: added concrete recursion defaults — depth 2, breadth 5, total cap 10 — with strategist-tracked enforcement and explicit user-escalation behavior on exhaustion. (3) **P-SS-9**: dropped `domainspec-subagents-strategy.md` as a separate artifact (proposal lives in chat only); now produces a two-file set (research + findings) with the dispatch record folded into findings; trigger narrowed to fan-out OR recursion (drops "single agent above mechanical tier"); collapsed the previous strategist/writer/dispatcher three-agent split back into a single strategist agent that also assembles `domainspec-subagents-research.md` from child returns; added `domainspec-subagents-findings-writer` and (optional, user-gated) `domainspec-subagents-discovery-writer` agents. Children no longer write files directly — avoids parallel-write race conditions. (4) **P-SS-10**: dispatch-record / cost-discipline data now lives in `domainspec-subagents-findings.md` Dispatch record section, not in the removed strategy file. (5) **Connections**: dropped the strategy-template row; updated D-11 reference to two-file set. |
| 0.2.2 | 2026-05-02 | Two BLOCK fixes from three-agent review. (1) Frontmatter `nature: technical, operational` → `nature: technical, procedural` — `operational` was not in the controlled vocabulary per `ontology-conventions.md` line 60. (2) P-SS-9 rewrite: removed the ambiguous "portion" wording and made the four-step lifecycle explicit (propose-in-chat → user-confirms → writer subagent persists → dispatcher subagent reads-and-fans-out), per the now-revised D-9 of `domainspec-subagents-strategy.md`. Also added "implications" to the findings-section description so it matches the revised D-11. |
| 0.2.1 | 2026-05-02 | Sync with `domainspec-subagents-strategy.md` D-11/D-12. P-SS-9 now references the three-file `/research/` artifact set instead of the superseded single-file `domainspec-subagents-strategy/<slug>.md` layout, and explicitly hands the dispatch-vs-artifact carve-out to P-SS-1. P-SS-2 default rule reworded so parent-relative tier selection is labeled a heuristic rather than the criterion (resolves contradiction with the opening sentence). P-SS-10 discipline note now flags evaluator identity as OQ-3 territory rather than asserting it. Connections table replaces the single `templates/domainspec-subagents-strategy.md` row with three template rows (strategy + research + findings, all forthcoming since `templates/` does not yet exist) and adds explicit rows for D-11 (artifact set) and D-12 (tool-not-stage scoping). |
| 0.2.0 | 2026-05-02 | Renamed file `agent-dispatch-premises.md → domainspec-subagents-strategy-premises.md` per D-1 of domainspec-subagents-strategy.md (concept reverted from `agents-strategy` back to `domainspec-subagents-strategy`). Replaced provider-model names (Haiku/Sonnet/Opus) with LLM-agnostic capability tiers (mechanical/synthesis/judgment). Removed universal token-budget table; budgets now per-strategy. Added discipline note to P-SS-10 distinguishing the one mechanically-computable dimension (cost) from the three evaluator judgments (coverage / independence / fidelity). Lowered framing of the 0–1 scale to coordination device, not metric. |
| 0.1.0 | 2026-05-02 | Initial premise set (10 premises). Synthesized from chat-ui-variants strategy file, robot-talks premises, and operational subagent-dispatch experience. P-SS-3/4/5/6/7 marked `veracidade: high` (mechanically grounded or POC-validated); P-SS-1/2/8/9 marked `medium` (logically sound, awaiting operational data); P-SS-10 marked `low` (no evaluations collected yet). |
