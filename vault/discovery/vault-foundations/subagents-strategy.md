---
tags: [vault, agents, dispatch, orchestration, subagents-strategy]
node_type: discovery
is_session: false
session_ref: null
layer: ontology
nature: explanatory, technical
status: draft
veracidade: low
convicção: high
version: 0.2.0
last_updated: 2026-05-02
---

# Discovery — Subagents-Strategy: When and How We Invoke Subagents

> A discovery document recording the design space and early decisions behind **subagents-strategy** — the orchestration concept that governs when, how, and with what capability tier we dispatch subagents. Records what was decided in the 2026-05-02 session, the alternatives considered and rejected, and the open questions that the next iteration must resolve.

---

## Objective

This document captures the **early-stage decisions and open questions** behind subagents-strategy: the cross-cutting discipline for invoking subagents anywhere in the project. It locks in the decisions already taken (premise-set written, schema clarified, naming chosen, mode relationship to robot-talks settled), names alternatives that were considered and rejected, and enumerates the open design questions that must resolve before the constitution and skill can be drafted.

This is a `node_type: discovery` document — high context, written for humans, intended to be superseded by an `implementation-plan` and then the constitution + skill once the open questions resolve.

---

## Index

1. [Context — Why This Discovery Exists](#context--why-this-discovery-exists)
2. [Decisions Taken](#decisions-taken)
3. [Alternatives Considered](#alternatives-considered)
4. [Open Questions](#open-questions)
5. [Connections](#connections)

---

## Context — Why This Discovery Exists

### The trigger

In the 2026-05-02 session, the user observed that subagent strategy keeps surfacing in feature work but has no foundational treatment in axioms, premises, constitutions, or skills. A reconnaissance pass found:

- **Exactly one** `agents-strategy.md` file exists in the repo (`implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md`). That file pre-dates the rename described in D-1 below and may be migrated separately.
- **Zero** mentions of provider model names anywhere in vault, `.claude/agents/`, or `.claude/skills/`. Capability-tier selection has never been written down.
- The closest adjacent governance is `vault/constitution/robot-talks-constitution.md`, which addresses one specific dispatch mode (multi-perspective investigation), not dispatch in general.

The condition was not "extract shared patterns from many features"; it was "codify intended patterns now, before per-feature drift starts." One existing strategy file is a thin sample but it does encode a real recurring shape (contract → parallel producers → consolidator) — strong enough to begin.

### The schema correction

A schema correction surfaced mid-session and reframes everything written here:

> **axiom → premise → constitution → skill**
>
> - **Premise** — falsifiable bet, expected to be revised. Carries explicit `convicção` and `veracidade`.
> - **Constitution** — declarative rules derived from premises. Codifies them; does not implement them.
> - **Skill** — the only layer that runs code. Implements the constitution.
> - **Axiom** — graduation target. Premises that survive enough falsification attempts and whose revision would now be more costly than absorbing their constraints become axioms. We are *learning* the system's axioms, not declaring them.

Practically: graded strategy outcomes (see D-8 below) are exactly the falsification signal that lets a premise graduate. This makes the schema *learn* its axioms instead of declaring them — a property the corpus-measurement layer (cf. `scope-and-domain-axes.md` discovery) will eventually formalize.

### The naming correction

The concept was briefly renamed to `agents-strategy` mid-session, then reverted. Rationale for the reversion: the `sub-` prefix communicates a real distinction. This discipline governs the dispatch of *subagents* from a parent agent, not the design of agents themselves. See D-1.

### The relationship correction

Mid-session it became clear that **subagents-strategy and robot-talks are not sibling categories**. Robot-talks is a *mode* invokable by a subagents-strategy — one specific dispatch pattern (multi-perspective investigation aimed at tension discovery) among several. Other modes the existing repo demonstrates or implies:

- **Task fan-out** — N agents producing N artifacts against a shared contract (chat-ui-variants Phase 2).
- **Sequential lookup chain** — agent A's output feeds agent B.
- **Single scoped dispatch** — one agent, one job (today's mechanical-tier investigation).
- **Robot-talks** — multi-perspective investigation; goal is tension discovery (P-RT-3).

A given strategy file declares its mode (or modes, if mixed). Mode determines which additional rules apply: a robot-talks-mode strategy must satisfy `robot-talks-premises` (P-RT-3, P-RT-8); a task-fan-out strategy does not.

---

## Decisions Taken

### D-1 — The orchestration concept is named `subagents-strategy`

**Decision:** The umbrella concept is called **subagents-strategy**. Per-investigation files live in `<working_folder>/subagents-strategy/<slug>.md`. This reverses an earlier intra-session rename to `agents-strategy` because the prefix communicates a real distinction: this discipline governs the dispatch of *subagents* from a parent agent, not the design of agents themselves. The earlier rationale (parallel to existing in-repo file naming) is acknowledged but the precision win of `sub-` outweighs it; the existing in-repo file will be renamed.

**Status:** Settled.

---

### D-2 — Schema chain: axiom → premise → constitution → skill

**Decision:** Vault layers form a chain. Premises are bets; constitutions codify the rules derived from premises; skills are the only layer that executes; axioms are the graduation target.

**Rationale:** Each layer has a different falsification regime. Premises are easy to write and expected to churn. Constitutions are written when a premise has accumulated evidence. Skills are the executable form. Axioms are reserved for premises whose revision is now more costly than their constraints. Mixing the layers (e.g., treating constitutions as if they execute) flattens this gradient and removes the place where evidence accumulates.

**Consequence:** `subagents-strategy` produces three vault artifacts in sequence: `subagents-strategy-premises.md` (written this session), `subagents-strategy-constitution.md` (next), and `subagents-strategy` skill (after that). Names of constitution and skill are settled per OQ-2.

**Status:** Settled.

---

### D-3 — Constitutions codify; skills implement

**Decision:** A constitution is the *declarative* form of the rules derived from a premise. A skill is the *executable* form. The constitution does not run; the skill does. Premises connect to their constitution via `codified-as` and to their skill via `operationalized-by`.

**Rationale:** This was a correction made mid-session. The first draft of the connections table called the constitution `operationalized-by` — wrong. Constitutions describe what should happen; skills make it happen. Without this distinction the constitution becomes an unfalsifiable wishlist.

**Consequence:** `subagents-strategy-premises.md` was edited to reflect this. The same correction applies to `robot-talks-premises.md` — its connections table currently calls the constitution `operationalized-by` and should be split into `codified-as` (constitution) + `operationalized-by` (the `.claude/skills/robot-talks/` skill). Cleanup deferred to its own pass.

**Status:** Settled (applied to subagents-strategy-premises; pending for robot-talks-premises).

---

### D-4 — Subagents-strategy is the umbrella; robot-talks is a mode

**Decision:** Robot-talks is a **mode-of** subagents-strategy, not a sibling concept. A strategy file declares its mode, and mode determines which additional rules apply.

**Rationale:** The job a strategy performs varies meaningfully. Investigation aimed at tension discovery has different rules (full traceability per P-RT-8, tension-not-aggregation per P-RT-3) than parallel artifact production (which mostly needs gate-before-fan-out per P-AD-5). Treating them as siblings forces every dispatch to satisfy investigation-specific rules; treating robot-talks as a mode lets those rules apply only when chosen.

**Consequence:** The strategy file frontmatter must carry a `mode` field (single or multi-value). Provisional values: `task-fan-out`, `robot-talks`, `sequential`, `single`, `mixed`. Vocabulary may grow.

**Status:** Settled at the structural level; mode vocabulary pending.

---

### D-5 — First premise set written: `subagents-strategy-premises.md` (P-AD-1 through P-AD-10)

**Decision:** Ten premises were written this session covering: dispatch threshold (P-AD-1), capability-tier selection by cognitive load (P-AD-2), independence requirement for parallelization (P-AD-3), single-message fan-out (P-AD-4), gate before fan-out (P-AD-5), briefing contract (P-AD-6), trust-but-verify (P-AD-7), recursion budget (P-AD-8), no-dispatch-without-confirmed-strategy (P-AD-9), and grading (P-AD-10).

**Rationale:** Synthesized from the chat-ui-variants strategy file, robot-talks premises (which generalize), and the operational subagent-dispatch experience accumulated in the session itself. Confidence levels mark which are mechanically grounded (P-AD-3/4/5/6/7 — high `veracidade`) versus which are logically sound but operationally unmeasured (P-AD-1/2/8/9 — medium `veracidade`) versus which are introduced fresh by this work (P-AD-10 — low `veracidade`).

**Status:** Settled (file written).

---

### D-6 — Default capability tier: one tier below parent unless justified

**Decision:** When dispatching a subagent, default to one capability tier below the parent agent's tier. Override only when the task's cognitive load demands more, named explicitly in the briefing.

**Rationale:** Parent inheritance treats every subtask as if it requires the parent's reasoning capacity, which is almost never true and burns budget. Always-mechanical is too aggressive for synthesis tasks. The tier-below-parent rule is a strong default that surfaces overrides as deliberate decisions, not implicit choices.

**Consequence — token budgets are per-strategy, not universal:** P-AD-2 documents the cognitive-load tiers. Token budgets are not specified universally — they are set per-strategy by the strategist subagent at dispatch time, justified by the task's expected output shape. Strategies for unbounded exploratory work declare no budget; strategies for scoped tasks with a known output shape declare a budget.

**Capability tiers are LLM-agnostic.** This discovery names tiers by cognitive load — mechanical (lookup, extraction, scoped tasks with known output shapes), synthesis (multi-source consolidation, judgment-light analysis), judgment (open-ended reasoning, novel design, irreducible ambiguity). The mapping from tier to a specific model provider is a configuration concern, not a rule of this discipline. Hard-coding provider model names in the discovery would couple the rule to a vendor's lineup; tiers describe the work, not the worker.

**Status:** Settled.

---

### D-7 — Strategy file is mandatory for non-trivial dispatch

**Decision:** Any non-trivial subagents-strategy must produce a confirmed strategy file in `<working_folder>/subagents-strategy/<slug>.md` **before** agents launch. "Non-trivial" means: 2+ agents, or a single agent above mechanical tier, or recursion. Single mechanical-tier lookups are exempt.

**Rationale:** Makes dispatch an auditable artifact rather than in-the-moment improvisation. The user gains a confirmation point with capability tier and token budget visible. The repository accumulates a graded record across investigations that drives premise revision (D-8).

**Consequence:** P-AD-9 codifies this. The strategy file template and skill must enforce it.

**Status:** Settled at the rule level; template and skill pending.

---

### D-8 — Strategy files are evaluated against four components; only one is a measurement, three are disciplines

**Decision:** Every completed strategy file is evaluated on four components. **Cost discipline** is mechanically computable from the execution log (declared budget vs actual token usage) and yields a numerical score. **Coverage** is partially mechanical (count of declared success criteria the outputs address) but requires judgment to assess fit. **Independence** and **fidelity** are evaluator judgments — they are disciplines, not measurements. We present these on a 0–1 scale for orientation, but the scale is a coordination device, not a metric. Persistent low scores on a component are *signals* that the underlying premise may be wrong; sustained high scores are *signals* of accumulating evidence. Treating the score as a measurement would manufacture false rigor.

**Rationale:** Without an evaluation surface, subagents-strategy cannot accumulate evidence, and premises cannot graduate. P-AD-10 names this; the discovery records *why* the gradient matters at the schema level — and *why* three of the four dimensions cannot be promoted to measurements without instrumentation that does not yet exist.

**Consequence:** The grading mechanism is partially deferred — see OQ-3.

**Status:** Settled.

---

### D-9 — Strategy file is generated by a dedicated mechanical-tier strategist subagent

**Decision:** When the user begins an investigation that triggers D-7, a dedicated subagent — provisional name `subagents-strategist` — drafts the strategy file. The strategist runs at mechanical tier (scoped task with known output shape, per P-AD-2), sets a per-subagent token budget when the task is scoped enough to justify one, and returns the draft to the main thread for user confirmation before any other agent launches.

**Rationale:** Self-consistency: the very first dispatch of any investigation is itself an agent task, and applying P-AD-2's tier rules to it lands on mechanical. Doing this in the main thread instead pollutes the parent's context with decomposition deliberation that has no need to persist after confirmation.

**Status:** Settled at the role level; the agent definition itself is pending the skill draft.

---

### D-10 — `subagents-strategy` is admitted as a first-class node_type

**Decision:** A document with `node_type: subagents-strategy` is a dispatch plan for a specific investigation: it carries `mode`, `grade`, per-subagent capability assignments, recursion budget, and lifecycle states (`proposed` → `confirmed` → `in-progress` → `completed` | `abandoned`). The `scope` and `domain` axes are not fixed by the node_type — `scope` is usually `artifact` (most strategies build something) but may be multi-value when the strategy dispatches over world-scope topics; `domain` reflects whatever the strategy is dispatching against (e.g., `frontend`, `fidc`, `ontology-classification`).

**Rationale:** Existing `node_type` values do not cover the dispatch-plan shape. `implementation-plan` is closest but lacks the mode/grade/per-subagent axes. The orthogonality admission test passes: `subagents-strategy` carries information not predictable from `implementation-plan + nature` labels (graded outcomes, dispatch mode, capability-tier assignments).

**Consequence:** `ontology-conventions.md` must be amended to add `subagents-strategy` to the node_type enumeration. The amendment requires its own discovery (per D-14 of `scope-and-domain-axes.md`). The frontmatter schema for subagents-strategy files (mode, grade, capability assignments, recursion budget, lifecycle state) is itself an implementation-plan-level concern.

**Status:** Settled.

---

## Alternatives Considered

### A-1 — Name the concept `agents-strategy` (no sub- prefix)

**Rejected (D-1).** Considered for parallelism with the existing in-repo file name and shorter form, but the `sub-` prefix marks the actual scope of the discipline (dispatch *from* a parent agent) and prevents conflation with broader agent-design work.

### A-2 — Treat the constitution as the executable layer

**Rejected (D-3).** First draft of the connections table read constitution as `operationalized-by`. Conflates declarative rules with executable behavior. Without the split, the constitution becomes an unfalsifiable wishlist and the skill loses its identity as the only layer that runs code.

### A-3 — Robot-talks and subagents-strategy as sibling categories

**Rejected (D-4).** Forces every dispatch to satisfy robot-talks-specific rules (P-RT-3 tension discovery, P-RT-8 traceability) even when the dispatch is, e.g., parallel artifact production where those rules don't apply. Mode-of relationship is strictly cleaner.

### A-4 — Always-judgment-tier or always-inherit-parent capability selection

**Rejected (D-6, P-AD-2).** Always-judgment-tier burns budget on tasks the mechanical tier handles correctly. Always-inherit treats every subtask as if it needs the parent's reasoning capacity, which is rarely true. Cognitive-load tiering with one-tier-below-parent default is strictly cheaper and surfaces overrides as deliberate.

### A-5 — Mandatory strategy file for every dispatch including single mechanical-tier lookups

**Rejected (D-7, P-AD-9).** Imposes ceremony on tasks where it adds zero value (a single mechanical-tier grep). The threshold rules in P-AD-9 carve out the exempt case explicitly. This intentionally trades some auditability of trivial dispatch for low ceremony where ceremony does not pay.

### A-6 — Add `strategy` as a new `node_type`

**Resolved — see D-10.** Initially deferred. The user confirmed in this revision that `subagents-strategy` is admitted as a first-class node_type because existing types do not carry the mode/grade/per-subagent axes the dispatch plan requires.

### A-7 — Skip the schema-graduation framing; treat all layers as flat

**Rejected (D-2).** Without the gradient (premise → constitution → skill, with axiom as graduation target), there is no place where evidence accumulates and no falsification regime distinguishing layers. The schema's value is precisely that it learns axioms instead of declaring them.

---

## Open Questions

### OQ-1 — Does `subagents-strategy` deserve its own `node_type`?

`Resolved — see D-10.`

### OQ-2 — Final names for the constitution and skill

`Resolved — settled in this revision: premise = subagents-strategy-premises.md, constitution = subagents-strategy-constitution.md, file = subagents-strategy.md.`

### OQ-3 — Grading: automatic vs. assisted

`Resolved (partial) — Cost is mechanically computable; the other three are judgment-tier, evaluator-assisted with user confirmation. Full automation deferred until measurement instrumentation lands.`

### OQ-4 — Default token budgets per tier

`Resolved — see revised D-6. Per-strategy budgets only; no universal table.`

### OQ-5 — Recursion budget defaults

P-AD-8 mandates explicit depth/breadth budgets for recursive dispatch but does not specify defaults. Should the constitution name conservative defaults (e.g., depth ≤ 2, breadth ≤ 4 unless justified) or leave it entirely to the strategy file?

### OQ-6 — When does a graded premise graduate?

The graduation pipeline (premise → axiom) needs a threshold. How many graded observations? What confidence level? What constitutes a falsification event versus a noisy bad outcome? This question generalizes beyond subagents-strategy and overlaps with the corpus-measurement layer in `scope-and-domain-axes.md`.

### OQ-7 — Strategy folder location

Decision in this session: `<working_folder>/subagents-strategy/<slug>.md` — adjacent to where the user is working. Open: should there also be a project-level index (e.g., `vault/subagents-strategy-index.md`) that links to active and completed strategies for cross-investigation learning?

### OQ-8 — Mode vocabulary

Provisional modes: `task-fan-out`, `robot-talks`, `sequential`, `single`, `mixed`. May grow as more dispatch shapes are observed. Should mode be a closed enumeration or an open vocabulary like `domain` (per `scope-and-domain-axes.md`)?

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [subagents-strategy-premises.md](../premise/subagents-strategy-premises.md) | `proposes` | The premise set this discovery led to. Written this session, captures D-5, D-6, D-7, D-8. |
| [robot-talks-premises.md](../premise/robot-talks-premises.md) | `mode-of` | Robot-talks is one mode invokable by a subagents-strategy (D-4). Premises P-RT-2/6/7/8 generalize and ground P-AD-3/5. |
| [robot-talks-constitution.md](../constitution/robot-talks-constitution.md) | `mode-of` | The constitution that codifies the robot-talks mode specifically. |
| [system-premises.md](../premise/system-premises.md) | `derives-from` | P-SYS-3 (docs as source of truth) and P-SYS-7 (revisability) ground the briefing-contract (P-AD-6) and grading (P-AD-10) premises. |
| [scope-and-domain-axes.md](./scope-and-domain-axes.md) | `aligns-with` | The corpus-measurement layer described there is what would eventually let premise graduation become measured rather than judged (OQ-6). |
| `subagents-strategy-constitution.md` *(forthcoming)* | `proposes` | Declarative rules to be derived from subagents-strategy-premises. |
| `subagents-strategy` skill *(forthcoming)* | `proposes` | Executable behavior that enforces the constitution at dispatch time. |
| `templates/subagents-strategy.md` *(forthcoming)* | `proposes` | Per-investigation strategy file template. |
| `implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md` | `instantiates` | The single existing strategy file. Pre-dates the rename in D-1 and may be migrated to `subagents-strategy.md` separately (different scope — implementation feature work). Demonstrates the contract → parallel producers → consolidator shape that informed P-AD-5. |
