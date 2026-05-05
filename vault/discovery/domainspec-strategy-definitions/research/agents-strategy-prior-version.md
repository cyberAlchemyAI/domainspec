<!-- SUPERSEDED on 2026-05-02 by vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md (concept renamed agents-strategy → domainspec-subagents-strategy and the two duplicates merged; moved out of domainspec-vault-foundations/ on 2026-05-02 in the foundations split). Preserved as historical context. -->
<!-- Preserved as historical context. The canonical version is now at vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md. This file was the earlier draft at vault/discovery/agents-strategy.md. -->
---
tags: [vault, agents, dispatch, orchestration, agents-strategy]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, technical
status: draft
veracidade: low
convicção: high
version: 0.1.0
last_updated: 2026-05-02
---

# Discovery — Agents-Strategy

## Objective

We are introducing **agents-strategy** as the cross-cutting discipline for invoking subagents anywhere in the project — naming when dispatch is allowed, which model to use, which token budget applies, and how the dispatch is gated and graded. The end state is a four-artifact stack — premises (already written), a constitution, a skill, and a per-investigation strategy file template — connected to existing vault concepts (robot-talks as a mode, system premises as ground). Subsequent dispatch by the user or any agent must produce a confirmed strategy file before agents launch (with the trivial-case carve-out defined below).

---

## 1. Business Context

### Why now

Subagent dispatch is happening across the project (`.claude/agents/` lists 37 agents, `.claude/skills/` lists many skills, the chat-ui-variants feature has its own agents-strategy file), but no foundational governance exists. Every dispatch is improvised: model choice, token budget, parallelization rules, briefing standards, completion criteria. The current cost is invisible (no graded outcomes), the patterns are not codified, and per-feature strategy files will diverge from each other once a second one is written. We codify now, with one existing strategy file as the operational sample, before drift starts.

### What's broken

- **Zero model-selection guidance anywhere in the project.** Verified by a Haiku reconnaissance pass: `grep -ri "haiku\|sonnet\|opus" vault/ .claude/agents/ .claude/skills/` returns nothing relevant. Every dispatch picks a model implicitly.
- **Only one `agents-strategy.md` file exists.** Location: `implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md`. Pattern (contract → parallel producers → consolidator) is real but uncodified — a second feature will reinvent it.
- **`vault/premise/robot-talks-premises.md:26`** references `specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md`, a path that does not exist in the repo (`find . -type d -name possible_constitutions` returns nothing). Stale link.
- **`vault/premise/robot-talks-premises.md:202`** lists `robot-talks-constitution.md` as `operationalized-by`. Per the schema correction below, constitutions codify and skills implement — this row should split into a `codified-as` row (the constitution) and an `operationalized-by` row (the `.claude/skills/robot-talks/` skill).
- **No `node_type` exists for per-investigation strategy artifacts.** Existing values (`spec`, `implementation-plan`) do not capture the lifecycle states (`proposed` → `confirmed` → `in-progress` → `completed`), the grade, or the mode field that strategy files require.

### What stays the same

- **`vault/premise/agent-dispatch-premises.md`** (written this session, P-AD-1 through P-AD-10). Stays as authored.
- **`vault/constitution/robot-talks-constitution.md`** content. Robot-talks remains the constitution for one mode (multi-perspective investigation); this discovery does not edit it.
- **`.claude/skills/robot-talks/`** skill. Stays as the executable form of robot-talks-mode dispatch.
- **`implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md`**. Stays; informs the template shape, not edited.
- **`vault/axiom/`, `vault/premise/system-premises.md`, `vault/discovery/scope-and-domain-axes.md`**. Not edited.
- **Existing 37 agents in `.claude/agents/`**. Their definitions are unchanged. They become callable from strategy files but their interfaces stay.

---

## 2. Core Concepts

### Agents-strategy

The umbrella orchestration concept. Governs every multi-agent dispatch: decomposition, model choice, token budget, sequencing, gating, grading. A strategy is materialized as a file in `<working_folder>/agents-strategy/<slug>.md` and must be confirmed by the user before any agent launches (subject to the trivial-case carve-out: single Haiku lookups exempt).

### The schema chain: axiom → premise → constitution → skill

Each layer has a different falsification regime.

- **Premise** — falsifiable bet, expected to revise. Carries `convicção` and `veracidade`.
- **Constitution** — declarative rules derived from premises. **Codifies, does not execute.**
- **Skill** — the only layer that runs code. Implements the constitution.
- **Axiom** — graduation target for premises that have accumulated enough non-falsifying evidence that revising them is more costly than absorbing their constraints.

Why this design over a flat hierarchy: each layer captures evidence at a different rate. Premises churn weekly; constitutions stabilize quarterly; axioms barely move. Without the gradient, premises and constitutions blur and there is no place where evidence accumulates. Why this matters specifically for agents-strategy: graded strategy outcomes (see §3.4) are the falsification signal that moves a premise toward an axiom — this is how the system *learns* its axioms instead of declaring them.

### Mode (agents-strategy mode)

A field on every strategy file. Provisional vocabulary: `task-fan-out`, `robot-talks`, `sequential`, `single`, `mixed`. Mode determines which additional rules apply on top of the base agents-strategy constitution: e.g., a `robot-talks` strategy must also satisfy `robot-talks-premises` (P-RT-3 tension discovery, P-RT-8 traceability); a `task-fan-out` strategy does not.

Why mode (and not specialization-of): robot-talks-specific rules don't apply to parallel artifact production, but the general dispatch rules do. Mode lets the constitution layer rules apply universally while mode-specific rules apply conditionally.

### Model selection by cognitive load (default: one tier below parent)

The default subagent model is **one tier below the parent's model** unless the strategy names a reason to override.

- **Haiku** — scoped lookups, file inventory, mechanical transformations, single-question research. Default budget: 10–30k tokens.
- **Sonnet** — synthesis across multiple sources, plan generation, judgment calls, code review. Default budget: 30–80k tokens.
- **Opus** — cross-domain reasoning, ambiguous specs, governance decisions, anything whose output compounds downstream. Default budget: 50–150k tokens.

Why one-tier-below-parent: parent inheritance burns budget by treating every subtask as if it needed parent-level reasoning. Always-Haiku underperforms on synthesis. The tier-below default surfaces overrides as deliberate decisions.

---

## 3. Detailed Specifications

### 3.1 Artifact set

The agents-strategy stack consists of four artifacts. Three are vault documents; one is a per-investigation file generated by a skill.

| Artifact | Location | Status |
|----------|----------|--------|
| `agent-dispatch-premises.md` | `vault/premise/` | **Written** (this session) |
| `agents-strategy-constitution.md` | `vault/constitution/` | To write next |
| `agents-strategy` skill (executable) | `.claude/skills/agents-strategy/` | To write after constitution |
| `agents-strategy.md` (per-investigation) | `<working_folder>/agents-strategy/<slug>.md` | Generated on demand by the skill |

Naming was unified: premise file should be renamed `agents-strategy-premises.md` to match. Recommended in §3.7.

### 3.2 Strategy file frontmatter

```yaml
---
tags: [agents-strategy, <topic-tags>]
node_type: strategy            # see §3.6 — proposed new value
is_session: true
mode: task-fan-out | robot-talks | sequential | single | mixed
status: proposed | confirmed | in-progress | completed | abandoned
grade: null                    # filled at completion: 0.0–1.0
grade_components:              # filled at completion
  coverage: null               # 0.0–0.25
  independence: null           # 0.0–0.25
  fidelity: null               # 0.0–0.25
  cost_discipline: null        # 0.0–0.25
started_at: null
completed_at: null
parent_premises: [agent-dispatch-premises]
version: 0.1.0
last_updated: YYYY-MM-DD
---
```

### 3.3 Strategy file body

| Section | Purpose |
|---------|---------|
| **Context** | Why this investigation now; what triggered it; links to upstream work |
| **Goal** | Single sentence — what we are trying to learn or produce |
| **Success criteria** | Testable bullets — "we will know we succeeded if…" |
| **Decomposition** | Table: agent name · concern · out-of-scope · model · token budget · expected tool calls |
| **Sequencing** | DAG / phases; gates between phases (P-AD-5: gate before fan-out) |
| **Recursion budget** | Depth/breadth budget per agent if any (P-AD-8); empty if no recursion |
| **Risks & exit conditions** | What would cause us to stop early |
| **Execution log** | Appended as agents return — timestamps, actual tokens used, deltas vs. budget |
| **Grade** | Filled at completion against the four-component rubric (§3.4) |
| **Lessons** | What to do differently next time |

### 3.4 Lifecycle and flow

```
user starts non-trivial dispatch
        │
        ▼
agents-strategy skill triggered
        │
        ▼
agents-strategist (Haiku) drafts <slug>.md  ← status: proposed
        │
        ▼
main thread shows summary table to user
(agents · models · budgets · total)
        │
        ▼
user confirms ──────────► status: confirmed, started_at set
        │
        ▼
agents launch per the strategy
        │
        ▼
agents return
        │
        ▼
execution log appended; grade computed (§3.4 rubric)
        │
        ▼
status: completed, completed_at set
```

**Trivial-case carve-out** (P-AD-9): single Haiku lookups skip the strategy file. "Non-trivial" = 2+ agents, or a single agent above Haiku tier, or recursion.

**Why a separate Haiku strategist** (and not the main thread): the strategy draft is itself a scoped agent task with a known output shape — exactly the workload P-AD-2 routes to Haiku. Drafting in the main thread pollutes the parent's context with decomposition deliberation that has no need to persist after confirmation.

### 3.5 Grading rubric

Each component is 0.0–0.25; total grade is the sum (0.0–1.0).

| Component | Mechanical or judgment? | What it measures |
|-----------|------------------------|------------------|
| **Coverage** | Partly mechanical | Did the decomposition cover the goal's success criteria? |
| **Independence** | Judgment | Were agent concerns non-overlapping (P-AD-3, P-RT-7)? |
| **Fidelity** | Judgment | Were findings traceable to evidence (P-RT-8)? |
| **Cost discipline** | Mechanical | Did agents stay within declared token budgets? |

Recommendation for grading mechanism: **mechanical for cost discipline, assisted-judgment (Sonnet review with user confirmation) for the other three**. Pure mechanical scoring on independence/fidelity is unreliable; pure manual scoring on cost is wasteful when the execution log already has the numbers.

### 3.6 New `node_type: strategy`

Strategy files have unique fields (`mode`, `grade`, `grade_components`, `status` lifecycle including `proposed`/`confirmed`/`abandoned`) that do not fit `implementation-plan` or `spec` cleanly. A `spec` does not get graded; an `implementation-plan` does not have a `proposed` → `confirmed` user-gate phase.

**Recommendation:** add `strategy` to the `node_type` enumeration in `frontmatter.md` and `frontmatter-semantics.md`. Challenge response (per the picker pattern in `frontmatter.md`): *"Run it, grade it, and either improve the underlying premises or supersede it."*

### 3.7 Naming alignment

The premise file is currently named `agent-dispatch-premises.md`. The umbrella concept and the strategy file are `agents-strategy`. To avoid mixed vocabulary across the chain:

**Recommendation:** rename `vault/premise/agent-dispatch-premises.md` → `agents-strategy-premises.md`. The constitution becomes `agents-strategy-constitution.md`. The skill becomes `.claude/skills/agents-strategy/`. Strategy file template lives at `templates/agents-strategy.md`. Single root word everywhere.

### 3.8 Cleanup

- **`vault/premise/robot-talks-premises.md:26`** — broken path (`specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md` does not exist). Either remove the reference or fix it to point to the actual robot-talks discovery once one is written.
- **`vault/premise/robot-talks-premises.md:202`** — split the single `operationalized-by` row into two: `codified-as` (`robot-talks-constitution.md`) and `operationalized-by` (`.claude/skills/robot-talks/`). Brings the file in line with the schema correction in §2.

### 3.9 Open questions

Each item carries a recommendation per the discovery-writing skill quality gate.

| OQ | Question | Recommendation |
|----|----------|----------------|
| **OQ-1** | Default token budgets per tier (haiku 10–30k, sonnet 30–80k, opus 50–150k) — these are guesses. | Ship with these values; revise once we have grades from ≥10 real strategies. |
| **OQ-2** | Recursion budget defaults — depth/breadth caps. | Constitution defaults: depth ≤ 2, breadth ≤ 4 per parent agent unless the strategy file overrides with named justification. |
| **OQ-3** | Graduation threshold — when does a graded premise graduate to axiom? | Defer until the corpus-measurement layer described in `scope-and-domain-axes.md` lands. Until then, graduation is a deliberate human act recorded in a discovery, not a count threshold. |
| **OQ-4** | Project-level index — should there be `vault/agents-strategy-index.md` linking active and completed strategies? | Yes, generated by the skill on every strategy completion. Cross-investigation learning is impossible without it. |
| **OQ-5** | Mode vocabulary — closed enum or open growable? | Start closed (`task-fan-out`, `robot-talks`, `sequential`, `single`, `mixed`). Promote to open growable only if a real new mode appears that none of the five express. |
| **OQ-6** | Per-folder vs. per-feature strategy folder — does every working folder need its own `agents-strategy/`, or one per feature? | One per working folder where dispatch occurs. Same convention as colocated tests. |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [agent-dispatch-premises.md](../../../premise/agent-dispatch-premises.md) | `proposes` | Premise set written this session (to be renamed `agents-strategy-premises.md` per §3.7) |
| [robot-talks-premises.md](../../../premise/robot-talks-premises.md) | `mode-of` | Robot-talks is one mode invokable by an agents-strategy (§2 Mode); also the cleanup target in §3.8 |
| [robot-talks-constitution.md](../../../constitution/robot-talks-constitution.md) | `mode-of` | Constitution that codifies the robot-talks mode specifically |
| [system-premises.md](../../../premise/system-premises.md) | `derives-from` | P-SYS-3 (docs as source of truth) and P-SYS-7 (revisability) ground the briefing-contract and grading premises |
| [scope-and-domain-axes.md](../scope-and-domain-axes.md) | `aligns-with` | Corpus-measurement layer described there is what eventually lets premise graduation become measured (OQ-3) |
| [frontmatter.md](../../../../.claude/skills/custom/frontmatter.md) | `proposes-edit` | §3.6 proposes adding `strategy` to the `node_type` enumeration |
| `agents-strategy-constitution.md` *(forthcoming)* | `proposes` | Declarative rules to be derived from the premises |
| `.claude/skills/agents-strategy/` *(forthcoming)* | `proposes` | Executable skill that enforces the constitution at dispatch time |
| `templates/agents-strategy.md` *(forthcoming)* | `proposes` | Per-investigation strategy file template |
| `implementation/.../chat-ui-variants-via-shared-data-contract/agents-strategy.md` | `instantiates` | Single existing strategy file; informed §3.3 body shape |
