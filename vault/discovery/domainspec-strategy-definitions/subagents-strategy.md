---
tags: [vault, agents, dispatch, orchestration, domainspec-subagents-strategy]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, technical
status: draft
veracidade: low
convicção: high
version: 0.4.1
last_updated: 2026-05-02
---

# Discovery — Subagents-Strategy: When and How We Invoke Subagents

> A discovery document recording the design space and early decisions behind **domainspec-subagents-strategy** — the orchestration concept that governs when, how, and with which model we dispatch subagents. Records what was decided in the 2026-05-02 session, the alternatives considered and rejected, and the open questions that the next iteration must resolve.

> **NOTE — Naming cascade (2026-05-02 redesign).** The rename `agents-strategy → domainspec-subagents-strategy` cascades to: the premise file (`agent-dispatch-premises.md → domainspec-subagents-strategy-premises.md` — done), the constitution (`domainspec-subagents-strategy-constitution.md` — pending), the skill directory (`.claude/skills/domainspec-subagents-strategy/` — pending), and premise IDs (`P-SS-* → P-SS-*` — done in this revision via Phase 3 sweep).

---

## Objective

This document captures the **early-stage decisions and open questions** behind domainspec-subagents-strategy: the cross-cutting discipline for invoking subagents anywhere in the project. It locks in the decisions already taken (premise-set written, schema clarified, naming chosen, mode relationship to robot-talks settled), names alternatives that were considered and rejected, and enumerates the open design questions that must resolve before the constitution and skill can be drafted.

This is a `node_type: discovery` document — high context, written for humans, intended to be superseded by an `implementation-plan` and then the constitution + skill once the open questions resolve.

---

## Index

1. [Context — Why This Discovery Exists](#context--why-this-discovery-exists)
2. [Decisions Taken](#decisions-taken)
3. [Lifecycle](#lifecycle)
4. [Alternatives Considered](#alternatives-considered)
5. [Open Questions](#open-questions)
6. [Connections](#connections)

---

## Context — Why This Discovery Exists

### The trigger

In the 2026-05-02 session, the user observed that subagent strategy keeps surfacing in feature work but has no foundational treatment in axioms, premises, constitutions, or skills. A reconnaissance pass found:

- **Exactly one** `agents-strategy.md` file exists in the repo (`implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md`). That file pre-dates the rename described in D-1 below and may be migrated separately.
- **Zero** mentions of provider model names anywhere in vault, `.claude/agents/`, or `.claude/skills/`. Per-child model selection has never been written down.
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

Mid-session it became clear that **domainspec-subagents-strategy and robot-talks are not sibling categories**. Robot-talks is a *mode* invokable by a domainspec-subagents-strategy — one specific dispatch pattern (multi-perspective investigation aimed at tension discovery) among several. Other modes the existing repo demonstrates or implies:

- **Task fan-out** — N agents producing N artifacts against a shared contract (chat-ui-variants Phase 2).
- **Sequential lookup chain** — agent A's output feeds agent B.
- **Single scoped dispatch** — one agent, one job (today's mechanical-tier investigation).
- **Robot-talks** — multi-perspective investigation; goal is tension discovery (P-RT-3).

A given dispatch declares its mode (or modes, if mixed) in the strategist's chat proposal and records it in the Dispatch record section of `domainspec-subagents-findings.md`. Mode determines which additional rules apply: a robot-talks-mode dispatch must satisfy `robot-talks-premises` (P-RT-3, P-RT-8); a task-fan-out dispatch does not.

---

## Decisions Taken

### D-1 — The orchestration concept is named `domainspec-subagents-strategy`

**Decision:** The umbrella concept is called **domainspec-subagents-strategy**. Per-investigation files live in `<working_folder>/research/` (v0.3.0; previously `<working_folder>/domainspec-subagents-strategy/<slug>.md`, see D-7 / D-11 revisions). This reverses an earlier intra-session rename to `agents-strategy` because the prefix communicates a real distinction: this discipline governs the dispatch of *subagents* from a parent agent, not the design of agents themselves. The earlier rationale (parallel to existing in-repo file naming) is acknowledged but the precision win of `sub-` outweighs it; the existing in-repo file will be renamed.

**Status:** Settled.

---

### D-2 — Schema chain: axiom → premise → constitution → skill

**Decision:** Vault layers form a chain. Premises are bets; constitutions codify the rules derived from premises; skills are the only layer that executes; axioms are the graduation target.

**Rationale:** Each layer has a different falsification regime. Premises are easy to write and expected to churn. Constitutions are written when a premise has accumulated evidence. Skills are the executable form. Axioms are reserved for premises whose revision is now more costly than their constraints. Mixing the layers (e.g., treating constitutions as if they execute) flattens this gradient and removes the place where evidence accumulates.

**Consequence:** `domainspec-subagents-strategy` produces three vault artifacts in sequence: `domainspec-subagents-strategy-premises.md` (written this session), `domainspec-subagents-strategy-constitution.md` (next), and `domainspec-subagents-strategy` skill (after that). Names of constitution and skill are settled per OQ-2.

**Status:** Settled.

---

### D-3 — Constitutions codify; skills implement

**Decision:** A constitution is the *declarative* form of the rules derived from a premise. A skill is the *executable* form. The constitution does not run; the skill does. Premises connect to their constitution via `codified-as` and to their skill via `operationalized-by`.

**Rationale:** This was a correction made mid-session. The first draft of the connections table called the constitution `operationalized-by` — wrong. Constitutions describe what should happen; skills make it happen. Without this distinction the constitution becomes an unfalsifiable wishlist.

**Consequence:** `domainspec-subagents-strategy-premises.md` was edited to reflect this. The same correction applies to `robot-talks-premises.md` — its connections table currently calls the constitution `operationalized-by` and should be split into `codified-as` (constitution) + `operationalized-by` (the `.claude/skills/robot-talks/` skill). Cleanup deferred to its own pass.

**Status:** Settled (applied to domainspec-subagents-strategy-premises; pending for robot-talks-premises).

---

### D-4 — Subagents-strategy is the umbrella; robot-talks is a mode (with operational definitions)

**Decision:** Robot-talks is a **mode-of** domainspec-subagents-strategy, not a sibling concept. Each dispatch declares exactly one mode (in the strategist's chat proposal, and recorded in the Dispatch record section of findings.md). Modes are distinguished operationally — by *dispatch shape* (how the parent coordinates children) — not by topic. The five admitted modes:

- **`single`** — one agent, one question. No coordination. Use when scope fits one agent's context budget and no second perspective is needed.
- **`task-fan-out`** — N agents, **partitioned concerns**, parallel. Each agent owns a distinct slice; outputs compose without overlap. Use when work is naturally divisible and concerns don't intersect.
- **`robot-talks`** — N agents, **same question**, declared perspectives, tensions desired. Output value comes from disagreement, not consensus. Use when a single answer would hide load-bearing trade-offs. **Additional binding**: strategies in this mode bind to `robot-talks-premises` (P-RT-3 declared-perspectives, P-RT-7 tension-surfacing, P-RT-8 evidence-traceability) on top of the universal domainspec-subagents-strategy premises.
- **`sequential`** — linear chain; agent B depends on agent A's output. Use when later steps require earlier outputs as inputs (no parallelism possible).
- **`mixed`** — multi-phase combinations of the above. Use when no single shape fits; **explicit DAG required** in the chat proposal and the Dispatch record section of findings.md (nodes = agents, edges = output→input dependencies).

**Rationale:** A universal constitution plus mode-conditional rules beats a sibling constitution per mode (which would duplicate the universal rules). Operational definitions distinguished by dispatch shape prevent mode-creep based on topic similarity. The job a strategy performs varies meaningfully — investigation aimed at tension discovery has different rules (full traceability per P-RT-8, tension-not-aggregation per P-RT-3) than parallel artifact production (which mostly needs gate-before-fan-out per P-SS-5).

**Consequence:** Robot-talks-specific rules (P-RT-3, P-RT-7, P-RT-8) bind only when `mode: robot-talks` is declared; all other modes inherit only the universal domainspec-subagents-strategy premises. The vocabulary starts as a closed enum (see OQ-8 — resolved to `closed-for-now`) and graduates to an open enum only when a real new mode is observed in practice.

**Status:** Settled with operational definitions.

---

### D-5 — First premise set written: `domainspec-subagents-strategy-premises.md` (P-SS-1 through P-SS-10)

**Decision:** Ten premises were written this session covering: dispatch threshold (P-SS-1), model selection by task difficulty with user validation (P-SS-2; v0.4.0 — earlier versions framed this as capability-tier selection), independence requirement for parallelization (P-SS-3), single-message fan-out (P-SS-4), gate before fan-out (P-SS-5), briefing contract (P-SS-6), trust-but-verify (P-SS-7), recursion budget (P-SS-8), no-dispatch-without-confirmed-strategy (P-SS-9), and grading (P-SS-10).

**Rationale:** Synthesized from the chat-ui-variants strategy file, robot-talks premises (which generalize), and the operational subagent-dispatch experience accumulated in the session itself. Confidence levels mark which are mechanically grounded (P-SS-3/4/5/6/7 — high `veracidade`) versus which are logically sound but operationally unmeasured (P-SS-1/2/8/9 — medium `veracidade`) versus which are introduced fresh by this work (P-SS-10 — low `veracidade`).

**Status:** Settled (file written).

---

### D-6 — Model selection by task difficulty, user-validated

**Decision (revised v0.4.0):** When dispatching a subagent, the strategist names a concrete model per child in its chat proposal, with a one-line difficulty justification. The user validates the selection in the chat confirmation step (P-SS-9 step 2). There is no fixed difficulty taxonomy and no fixed tier→model mapping rule; model selection is per-task and per-dispatch.

**Rationale:** Parent inheritance treats every subtask as if it requires the parent's reasoning capacity, which is almost never true and burns budget. A speculative tier vocabulary (mechanical / synthesis / judgment) was tried in v0.2.x–v0.3.x but pre-committed to a taxonomy without operational evidence; the vocabulary risked being treated as a rule rather than a description. The current shape — strategist proposes, user validates, no fixed taxonomy — is the minimum that surfaces model choice as a deliberate per-dispatch decision while leaving room for vocabulary to emerge from accumulated proposals.

**Consequence — token budgets are per-strategy, model-orthogonal:** Token budgets are set per-strategy by the strategist at dispatch time, justified by the task's expected output shape. Strategies for unbounded exploratory work declare no budget; strategies for scoped tasks with a known output shape declare a budget. Budgets constrain output length, not model choice — the two decisions are independent.

**Reverses:** the v0.2.x–v0.3.x form, which prescribed a three-level capability-tier vocabulary (mechanical/synthesis/judgment) with a "default one tier below parent" selection rule. Reasoning for reversal: pre-committing to a taxonomy before evidence accumulates speculative structure that downstream code would have to honor. Patterns may be re-codified later if accumulated chat proposals show stable difficulty buckets.

**Status:** Settled (revised).

---

### D-7 — Strategy proposal lives in chat; two-file artifact set is mandatory for fan-out / recursion

**Decision (revised v0.3.0):** Any dispatch involving **fan-out (2+ agents) or recursion** must produce a two-file artifact set in `<working_folder>/research/` (`domainspec-subagents-research.md` + `domainspec-subagents-findings.md`). The strategy proposal itself is not persisted as a file — it lives in chat as the strategist's proposal and the user's confirmation. Single-agent dispatches produce no files regardless of tier; the parent's briefing and the agent's return is the audit trail.

**Rationale:** The proposal-confirmation gate is enforced by the conversation, not by a phantom file. A separate strategy file added ceremony without adding auditability beyond what the chat already provides. The two-file artifact set still makes the *outcome* of dispatch an auditable artifact: research.md preserves verbatim child evidence, findings.md carries the dispatch record (agents, tiers, budgets, actual spend) plus findings and analysis. The repository accumulates a graded record across investigations through the Dispatch record sections of past findings files.

**Consequence:** P-SS-9 codifies this. The skill must enforce: (a) chat-only proposal, (b) two-file artifact emission after dispatch completes, (c) children-do-not-write-files invariant. The earlier "Non-trivial" carve-out (which included "single agent above mechanical tier") is dropped — tier no longer determines artifact requirement; structural complexity (fan-out / recursion) does.

**Status:** Settled at the rule level; skill pending.

**Reverses:** the v0.2.x form of this decision, which mandated a separate `domainspec-subagents-strategy.md` file and treated single synthesis-tier dispatch as artifact-requiring.

---

### D-8 — Strategy files are evaluated against four components; only one is a measurement, three are disciplines

**Decision:** Every completed strategy file is evaluated on four components. **Cost discipline** is mechanically computable from the execution log (declared budget vs actual token usage) and yields a numerical score. **Coverage** is partially mechanical (count of declared success criteria the outputs address) but requires judgment to assess fit. **Independence** and **fidelity** are evaluator judgments — they are disciplines, not measurements. We present these on a 0–1 scale for orientation, but the scale is a coordination device, not a metric. Persistent low scores on a component are *signals* that the underlying premise may be wrong; sustained high scores are *signals* of accumulating evidence. Treating the score as a measurement would manufacture false rigor.

**Rationale:** Without an evaluation surface, domainspec-subagents-strategy cannot accumulate evidence, and premises cannot graduate. P-SS-10 names this; the discovery records *why* the gradient matters at the schema level — and *why* three of the four dimensions cannot be promoted to measurements without instrumentation that does not yet exist.

**Consequence:** The grading mechanism is partially deferred — see OQ-3.

**Status:** Settled.

---

### D-9 — Three dedicated subagents handle propose+dispatch / findings / discovery promotion

**Decision (revised v0.4.1):** When the user begins an investigation that triggers D-7, **four dedicated subagents** handle the lifecycle, plus N child agents executing the actual work:

1. **`subagents-strategist`** — drafts the proposed strategy **in chat only** (mode, agents, model per child with difficulty justification, budgets, sequencing, recursion budget). After user confirmation, dispatches the children in a single message (P-SS-4), collects their returns, and **returns the collected returns + Context + Goal to the parent — does not write any file**.
2. **`domainspec-subagents-research-writer`** *(new in v0.4.1)* — receives the strategist's collected returns + Context + Goal in its briefing; writes `domainspec-subagents-research.md` using the template, assembling each child's verbatim return under per-child headers (`## Agent N — <brief>`).
3. **`domainspec-subagents-findings-writer`** — reads `domainspec-subagents-research.md` and writes `domainspec-subagents-findings.md` with the Context + Goal preamble plus three sections: Dispatch record (top), Findings (middle, citing research.md), Analysis (bottom, citing research.md).
4. **`domainspec-subagents-discovery-writer`** — *optional, dispatched only after explicit user confirmation* in step 7 of the lifecycle. Reads findings.md and writes a vault discovery document with proper ontology frontmatter and connections.

The strategist proposes its own model and the model for each of these four lifecycle agents in chat, validated by the user — same rule as for any child dispatch (P-SS-2 / D-6).

**Reverses (in part):** the v0.4.0 form, which assigned `domainspec-subagents-research.md` writing to the strategist. Reasoning for the v0.4.1 reversal: symmetric single-responsibility — every artifact has a dedicated writer agent; strategist becomes pure orchestrator. The earlier collapse argument (no proposal file → no separate write step) does not apply to research.md, which IS written.

Each subagent sets a per-call token budget when the task is scoped enough to justify one.

**Rationale:** Three reasons for this shape. (1) **One agent per output** — strategist owns propose+dispatch+research (all coordination concerns); findings-writer owns synthesis; discovery-writer owns vault-format promotion. Each agent has a single artifact responsibility. (2) **Children-don't-write invariant** — parallel writes from independent subagent processes to the same file are unsynchronized and clobber each other; the strategist assembles returns instead, matching the chat-ui-variants Phase 2 → Phase 3 pattern. (3) **User-gated discovery promotion** — discovery is a vault-permanent artifact; requiring explicit user consent before writing it prevents accidental promotion of low-value dispatches.

**Reverses:** the v0.2.2 split into `subagents-strategist` / `domainspec-subagents-strategy-writer` / `domainspec-subagents-strategy-dispatcher`. Reasoning: with the strategy file removed (D-7 revision), there is no separate "write" step to isolate; and the dispatcher-reads-only-from-disk argument no longer applies because there is no on-disk strategy to read.

**Status:** Settled at the role level; agent definitions pending the skill draft.

---

### D-10 — `domainspec-subagents-strategy` is NOT a node_type (reversed)

**Decision (reversed v0.3.0):** Subagents-strategy does not require its own `node_type`. The two artifact files use existing node types: `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` both carry `node_type: findings` (verbatim child findings and synthesized findings, respectively). The optional discovery-promotion output uses the existing `node_type: discovery`.

**Rationale for reversal:** D-10 originally admitted `domainspec-subagents-strategy` as a node_type to carry mode/grade/per-subagent axes for the strategy file. With D-7 revised to remove the strategy file (proposal lives only in chat), the carrying surface for those axes moved into the **Dispatch record** section of `domainspec-subagents-findings.md`. A node_type is justified only when its frontmatter axes don't fit existing types; with the dispatch axes now living *inside* a findings file's body, the existing `findings` type covers it.

**Consequence:** No amendment to `ontology-conventions.md` is required. The Dispatch record section schema (agents, model per agent with difficulty justification, budgets, mode, sequencing, recursion budget, actual spend, four-component grade) is a content convention within `domainspec-subagents-findings.md`, not an ontology axis. The skill enforces the section structure; no node_type policing needed.

**Status:** Reversed in v0.3.0. Originally settled in v0.2.x.

---

### D-11 — Two-file `/research/` output set per fan-out / recursion dispatch

**Decision (revised v0.3.0):** Each fan-out or recursion dispatch produces two files in a `/research/` folder colocated with the working folder where the dispatch occurs:

- **`domainspec-subagents-research.md`** — raw per-agent findings only. Each child's verbatim return appears under a per-child header (`## Agent N — <brief>`). **No synthesis, no tensions, no cross-cutting analysis** (those move to findings.md). Children do not write this file directly; the strategist assembles it from collected child returns. Required for P-RT-8 traceability and for grading fidelity (D-8).
- **`domainspec-subagents-findings.md`** — THREE sections in one file:
  - **(1) Dispatch record** at the top — agents chosen, **model per agent (with one-line difficulty justification)**, token budget per agent, sequencing/DAG, dispatch mode, recursion budget, and **actual spend recorded after the fact**, plus the four-component grade (D-8).
  - **(2) Findings** in the middle — scannable, compressed, prioritized summary plus implications, with pointers (file + section anchor) into `domainspec-subagents-research.md` for every load-bearing claim.
  - **(3) Analysis** below — tensions, contradictions, cross-cutting reasoning that explain the findings.

**Rationale:** Two files, not three. The strategy proposal is no longer an artifact (D-7 revision); the dispatch record that the old `domainspec-subagents-strategy.md` carried now lives as a section at the top of findings, where it stays adjacent to the synthesized output it describes. Splitting evidence (research) from synthesis+metadata (findings) keeps both honest. Findings, analysis, and dispatch record live in the same document because separating them creates files most readers skip; co-locating them serves the scanner (top section), the synthesizer (middle), the auditor (bottom + dispatch record).

**Consequence:** The skill emits both files. The grader (D-8 fidelity component) checks that every claim in BOTH the Findings and Analysis sections resolves to a passage in `domainspec-subagents-research.md`. The strategist assembles `domainspec-subagents-research.md` from child returns; `domainspec-subagents-findings-writer` produces `domainspec-subagents-findings.md`.

**Status:** Settled (revised). Reverses the v0.2.x three-file set that included a separate `domainspec-subagents-strategy.md`.

---

### D-12 — Subagents-strategy is a tool, not a drift-convergence pipeline stage

**Decision:** Subagents-strategy is the **mechanism** that may execute the `research → findings` upstream stages of the drift-convergence pipeline (see [TUNING-LOOP.md](../../../TUNING-LOOP.md)) when parallel dispatch is warranted. It is not itself a pipeline stage. The pipeline stages exist independently of whether subagents are used; domainspec-subagents-strategy is one way to fulfill them efficiently. Per D-11, analysis and the dispatch record are co-located inside `findings`, so the dispatch outputs map cleanly onto the two-stage pipeline: `domainspec-subagents-research.md` → `research`, `domainspec-subagents-findings.md` → `findings`.

**Rationale:** Confusing tool with stage would force every drift-convergence run to either dispatch subagents or skip the upstream stages entirely. The actual relationship: stages are *what* must happen; domainspec-subagents-strategy is *how* to do it efficiently when work warrants parallelism. A solo human can satisfy `research → findings` without any dispatch.

**Consequence:** TUNING-LOOP.md and the domainspec-vault-foundations README are the authoritative artifacts for the pipeline; this discovery is the authoritative artifact for the dispatch mechanism. Cross-references between them are explicit.

**Status:** Settled.

---

## Lifecycle

The following flow describes how a fan-out / recursion dispatch proceeds. The strategy proposal lives entirely in chat — no file ever holds it.

```
user request
     │
     ▼
parent agent decides dispatch is fan-out / recursion (per D-7)
     │
     ▼
parent launches `subagents-strategist`
     │   — strategist's own model is part of the proposal (P-SS-2)
     ▼
strategist drafts a proposal IN CHAT (no file ever written for it)
     │   — includes: mode, agents, model per agent (with difficulty
     │     justification), budgets, sequencing/DAG, recursion budget
     ▼
strategist returns proposal to parent, which presents it
INLINE AS A QUESTION to the user
     │   — "Here is what I propose to dispatch. Confirm, revise, or abandon?"
     ▼
user confirms ─────── user revises ──► strategist re-drafts (loop)
     │                user abandons ──► stop (nothing persisted)
     ▼
strategist dispatches all children in a SINGLE MESSAGE (P-SS-4)
and collects their returns
     │   — children execute in parallel; they return findings,
     │     they do NOT write files (avoids parallel-write race)
     ▼
strategist returns collected child outputs + Context + Goal
to the parent (does NOT write any file)
     │
     ▼
parent dispatches `domainspec-subagents-research-writer`
which writes <working_folder>/research/domainspec-subagents-research.md
     │   — assembles each child's verbatim return under
     │     "## Agent N — <brief>" headers + Context+Goal preamble
     ▼
parent dispatches `domainspec-subagents-findings-writer`
which reads research.md and writes
<working_folder>/research/domainspec-subagents-findings.md
     │   — three sections: Dispatch record (top, with grade & spend),
     │     Findings (middle), Analysis (bottom)
     ▼
parent presents findings to user with the question:
"Promote this to a discovery node?"
     │
     ├── user says NO ──► dispatch ends here. Two artifact files remain.
     │
     ▼ user says YES
parent dispatches `domainspec-subagents-discovery-writer`
which reads findings.md and writes a vault discovery node
with proper ontology frontmatter and connections
     │
     ▼
graded dispatch feeds back into premise refinement
```

**Why the proposal is never persisted:** A proposal file the user never confirms is worse than no file at all — it creates a phantom artifact that graders and indexers cannot distinguish from a confirmed one. Keeping the proposal in chat forces the confirmation gate (P-SS-9) to be a real gate, not a paperwork step. See A-8 below.

**Why children don't write files:** Different subagents are different processes. If two children write to `domainspec-subagents-research.md` in parallel, one clobbers the other — the Edit-tool serialization only protects writes from a *single* agent. Having the strategist assemble returns instead matches the chat-ui-variants Phase 2 → Phase 3 pattern and preserves verbatim attribution by header.

**Why discovery promotion is user-gated:** Discovery nodes are vault-permanent. Auto-promoting every dispatch's findings into a discovery would flood the graph with low-value nodes. The user gate ensures only dispatches with cross-investigation value get the persistent discovery surface.

---

## Alternatives Considered

### A-1 — Name the concept `agents-strategy` (no sub- prefix)

**Rejected (D-1).** Considered for parallelism with the existing in-repo file name and shorter form, but the `sub-` prefix marks the actual scope of the discipline (dispatch *from* a parent agent) and prevents conflation with broader agent-design work.

### A-2 — Treat the constitution as the executable layer

**Rejected (D-3).** First draft of the connections table read constitution as `operationalized-by`. Conflates declarative rules with executable behavior. Without the split, the constitution becomes an unfalsifiable wishlist and the skill loses its identity as the only layer that runs code.

### A-3 — Robot-talks and domainspec-subagents-strategy as sibling categories

**Rejected (D-4).** Forces every dispatch to satisfy robot-talks-specific rules (P-RT-3 tension discovery, P-RT-8 traceability) even when the dispatch is, e.g., parallel artifact production where those rules don't apply. Mode-of relationship is strictly cleaner.

### A-4 — Fixed model-selection rules (always-most-capable, always-inherit-parent, fixed-tier-taxonomy)

**Rejected (D-6, P-SS-2).** Always-most-capable-model burns budget on tasks cheaper models handle correctly. Always-inherit treats every subtask as if it needs the parent's reasoning capacity, which is rarely true. A fixed-tier taxonomy (mechanical/synthesis/judgment) was tried in v0.2.x–v0.3.x but pre-committed to a vocabulary without operational evidence and risked being treated as a rule rather than a description. Per-dispatch user-validated selection (per v0.4.0) is the minimum that surfaces model choice as a deliberate decision while leaving room for vocabulary to emerge from accumulated proposals.

### A-5 — Mandatory strategy file for every dispatch including single-agent lookups

**Rejected (D-7, P-SS-9).** Imposes ceremony on tasks where it adds zero value (e.g., a single grep dispatched as a subagent for context isolation). The trigger rule in P-SS-9 carves out the exempt case explicitly: only fan-out (2+ agents) or recursion produces the two-file artifact set. This intentionally trades some auditability of trivial dispatch for low ceremony where ceremony does not pay.

### A-6 — Add `strategy` as a new `node_type`

**Reversed (v0.3.0) — see D-10.** Originally added as a first-class node_type to carry mode/grade/per-subagent axes for the strategy file. With the strategy file removed (D-7 revision), those axes moved into the Dispatch record section of `domainspec-subagents-findings.md`, which uses the existing `findings` node_type. No new node_type is required.

### A-7 — Skip the schema-graduation framing; treat all layers as flat

**Rejected (D-2).** Without the gradient (premise → constitution → skill, with axiom as graduation target), there is no place where evidence accumulates and no falsification regime distinguishing layers. The schema's value is precisely that it learns axioms instead of declaring them.

### A-8 — Persist `proposed` strategy as a file before user confirmation

**Rejected (2026-05-02 redesign, see §Lifecycle).** Persisting a `proposed` file before user confirmation creates a phantom artifact: graders and indexers cannot distinguish a proposal the user never saw from one that was actually confirmed. It also weakens the confirmation gate (P-SS-9) into a paperwork step. The replacement (per v0.3.0): the strategist holds the proposal in chat, the parent presents it inline as a question, and on confirmation the strategist proceeds to dispatch+research without ever persisting the proposal itself. The dispatch record (mode, agents, model per agent with difficulty justification, budgets, sequencing, actual spend) is written into the Dispatch record section of `domainspec-subagents-findings.md` *after* dispatch completes, not before.

---

## Open Questions

### OQ-1 — Does `domainspec-subagents-strategy` deserve its own `node_type`?

`Resolved — see D-10.`

### OQ-2 — Final names for the constitution and skill

`Resolved — premise = domainspec-subagents-strategy-premises.md, constitution = domainspec-subagents-strategy-constitution.md (forthcoming). The artifact files (per v0.3.0) are domainspec-subagents-research.md + domainspec-subagents-findings.md; no separate strategy file exists.`

### OQ-3 — Grading: automatic vs. assisted

`Resolved (partial) — Cost is mechanically computable; the other three are evaluator judgments, surfaced for user confirmation at dispatch close. Full automation deferred until measurement instrumentation lands.`

### OQ-4 — Default token budgets per tier

`Moot (v0.4.0) — tier vocabulary stripped. Token budgets are per-strategy and model-orthogonal; see revised D-6.`

### OQ-5 — Recursion budget defaults

`Resolved (v0.3.0) — P-SS-8 now names defaults: depth 2, breadth 5, total cap 10 agents per dispatch tree. The strategist tracks live agent count and refuses dispatches that would exceed the cap, escalating to the user. The chat proposal MAY override defaults with explicit justification recorded in the Dispatch record section of findings.md.`

### OQ-6 — When does a graded premise graduate?

The graduation pipeline (premise → axiom) needs a threshold. How many graded observations? What confidence level? What constitutes a falsification event versus a noisy bad outcome? This question generalizes beyond domainspec-subagents-strategy and overlaps with the corpus-measurement layer in `scope-and-domain-axes.md`.

### OQ-7 — Cross-investigation index

Artifact location is settled: `<working_folder>/research/domainspec-subagents-research.md` + `<working_folder>/research/domainspec-subagents-findings.md` (per D-11, v0.3.0 revision). Open: should there also be a project-level index (e.g., `vault/subagents-dispatch-index.md`) that links to past dispatches' findings files for cross-investigation learning, or does the discovery-promotion step (lifecycle step 6) provide enough cross-investigation surface on its own?

### OQ-8 — Mode vocabulary

`Resolved (closed-for-now) — see revised D-4. The five modes (`single`, `task-fan-out`, `robot-talks`, `sequential`, `mixed`) are operationally defined and the enum is closed. Promotion to an open vocabulary (like `domain`) requires evidence of a real new dispatch shape that none of the five fit, observed in practice.`

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [domainspec-subagents-strategy-premises.md](../premise/domainspec-subagents-strategy-premises.md) | `proposes` | The premise set this discovery led to. Written this session, captures D-5, D-6, D-7, D-8. |
| [robot-talks-premises.md](../premise/robot-talks-premises.md) | `mode-of` | Robot-talks is one mode invokable by a domainspec-subagents-strategy (D-4). Premises P-RT-2/6/7/8 generalize and ground P-SS-3/5. |
| [robot-talks-constitution.md](../constitution/robot-talks-constitution.md) | `mode-of` | The constitution that codifies the robot-talks mode specifically. |
| [system-premises.md](../premise/system-premises.md) | `derives-from` | P-SYS-3 (docs as source of truth) and P-SYS-7 (revisability) ground the briefing-contract (P-SS-6) and grading (P-SS-10) premises. |
| [vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md](../domainspec-vault-foundations/scope-and-domain-axes.md) | `aligns-with` | The corpus-measurement layer described there is what would eventually let premise graduation become measured rather than judged (OQ-6). |
| `domainspec-subagents-strategy-constitution.md` *(forthcoming)* | `proposes` | Declarative rules to be derived from domainspec-subagents-strategy-premises. |
| `domainspec-subagents-strategy` skill *(forthcoming)* | `proposes` | Executable behavior that enforces the constitution at dispatch time. |
| `templates/domainspec-subagents-research.md` *(forthcoming)* | `proposes` | Skill-emitted research file template: per-agent verbatim findings under per-child headers. |
| `templates/domainspec-subagents-findings.md` *(forthcoming)* | `proposes` | Skill-emitted findings file template: Dispatch record + Findings + Analysis sections. |
| `implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md` | `instantiates` | The single existing pre-redesign strategy file. Pre-dates both the rename in D-1 and the v0.3.0 removal of strategy files; if migrated, its content would split between the chat-only proposal pattern and the Dispatch record section of a `domainspec-subagents-findings.md`. Demonstrates the contract → parallel producers → consolidator shape that informed P-SS-5. |
