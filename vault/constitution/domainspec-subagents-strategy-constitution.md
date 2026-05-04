---
tags: [agents, dispatch, subagents, orchestration, domainspec-subagents-strategy, constitution]
node_type: constitution
is_session: false
layer: architecture
nature: procedural, technical
status: active
version: 0.1.4
last_updated: 2026-05-02
derives_from: vault/premise/domainspec-subagents-strategy-premises.md@v0.4.0
---

# Subagents-Strategy Constitution

> **Charter:** Declarative rules governing when, how, and with which model we dispatch subagents. Codifies [domainspec-subagents-strategy-premises.md@v0.4.0](../premise/domainspec-subagents-strategy-premises.md). The skill `.claude/skills/domainspec-subagents-strategy/` (forthcoming) implements these rules; this document does not execute.

---

## Index

1. [Premise Reference](#1-premise-reference)
2. [Trigger Rules](#2-trigger-rules)
3. [Lifecycle Rules](#3-lifecycle-rules)
4. [Coordination Rules](#4-coordination-rules)
5. [Briefing & Verification Rules](#5-briefing--verification-rules)
6. [Budget & Model Selection Rules](#6-budget--model-selection-rules)
7. [Artifact Rules](#7-artifact-rules)
8. [Mode Rules](#8-mode-rules)
9. [Grading Rules](#9-grading-rules)
10. [Governance](#10-governance)
11. [Connections](#11-connections)

---

## 1. Premise Reference

Each rule below cites one or more of the following premises. Full statements with falsification tests and evidence live in [domainspec-subagents-strategy-premises.md](../premise/domainspec-subagents-strategy-premises.md). One-line reference here:

- **P-SS-1** — Dispatch a subagent only when synthesis / context-protection / isolation / parallelism applies.
- **P-SS-2** — Strategist proposes a model per child by task difficulty; user validates in chat. Token budgets are per-strategy and model-orthogonal.
- **P-SS-3** — Parallel dispatch requires task independence.
- **P-SS-4** — N parallel agents must be launched in a single assistant message.
- **P-SS-5** — Lock the shared contract before fan-out.
- **P-SS-6** — Briefing prompt determines output quality; required fields specified.
- **P-SS-7** — A subagent's report describes intent; verify the actual artifact.
- **P-SS-8** — Recursion needs an explicit budget; defaults are depth 2 / breadth 5 / total 10.
- **P-SS-9** — Fan-out or recursion produces a two-file artifact set; chat-only proposal; six-step lifecycle.
- **P-SS-10** — Every dispatch is graded at close on coverage / independence / fidelity / cost; only cost is mechanical.

---

## 2. Trigger Rules

### R1 — Dispatch only when a trigger holds

A subagent MUST be dispatched only when at least one of the following holds:

- **Synthesis** — 3+ sources must be combined to answer.
- **Context protection** — raw output exceeds ~500 tokens and only a summary is needed downstream.
- **Isolation** — exploratory work whose output may be discarded.
- **Parallelism** — independent tasks that can fan out and the wall-clock saving exceeds orchestration cost.

Otherwise the work runs inline.

*Source:* P-SS-1.

### R2 — Two-file artifact set is mandatory for fan-out and recursion

A dispatch involving **fan-out (2+ agents) OR recursion** MUST produce two files in `<working_folder>/research/`:

- `domainspec-subagents-research.md`
- `domainspec-subagents-findings.md`

Single-agent dispatches MUST NOT produce these files; the parent's briefing and the agent's return is the audit trail.

*Source:* P-SS-9.

---

## 3. Lifecycle Rules

### R3 — Seven-step lifecycle is fixed

For dispatches that trigger R2, the following seven steps execute in order:

1. **Strategist proposes** the strategy in chat (mode, agents, model per child with difficulty justification, budgets, sequencing, recursion budget, **suggested working folder(s) per R15**).
2. **User confirms** the proposal (or revises / abandons; nothing persists on rejection).
3. **Strategist dispatches** all children in a single message (R8) and collects returns.
4. **Strategist returns** the collected child outputs (verbatim per child) plus the original Context + Goal — **does not write any file itself**.
5. **Research-writer** dispatches; receives the collected returns + Context + Goal in its briefing; writes `domainspec-subagents-research.md` using the template (R5, R15, R23).
6. **Findings-writer** dispatches; reads `domainspec-subagents-research.md`; writes `domainspec-subagents-findings.md` (R16, R17, R18, R23).
7. **User gates discovery promotion**; if confirmed, the strategist classifies the discovery's scope (`knowledge` → `vault/discovery/<topic>-definitions/<slug>.md` or `application` → `docs/features/<feature>/discovery/<slug>.md`) and proposes the target path; the user confirms; **discovery-writer** dispatches and writes the discovery node at the confirmed path. If declined, the dispatch ends with the two artifact files.

Skipping or reordering steps is a constitution violation.

**Rationale for the four-writer separation** (strategist orchestrates only; research-writer / findings-writer / discovery-writer each own exactly one artifact): symmetric single-responsibility, no agent both orchestrates and persists. The strategist holds dispatch state and could plausibly contaminate persistence with its own framing; isolating persistence into dedicated agents that receive only their input keeps each artifact traceable to a clean transformation.

*Source:* P-SS-9.

### R4 — Strategy proposal MUST NOT persist as a file

The strategist's proposal lives only in the chat conversation. No `domainspec-subagents-strategy.md` or equivalent proposal file is ever written to disk. The proposal-confirmation gate is enforced by the conversation, not by a phantom file.

*Source:* P-SS-9, A-8 of domainspec-subagents-strategy.md discovery.

### R5 — Only dedicated writer agents persist files

Child agents return findings; the strategist returns collected returns + Context + Goal; **neither writes any file**. File persistence is the exclusive responsibility of the dedicated writer agents:

- `domainspec-subagents-research-writer` writes `domainspec-subagents-research.md` from the strategist's collected returns.
- `domainspec-subagents-findings-writer` writes `domainspec-subagents-findings.md` from research.md.
- `domainspec-subagents-discovery-writer` (optional, user-gated) writes the discovery node from findings.md to either a vault path (knowledge scope) or a feature-folder path (application scope) per R15.

Allowing children or the strategist to write directly causes silent parallel-write race conditions and conflates orchestration with persistence.

*Source:* P-SS-9.

### R6 — Two user-confirmation gates are mandatory

(a) Before child dispatch (lifecycle step 2): user explicitly confirms the strategist's proposal.

(b) Before discovery promotion (lifecycle step 6): user explicitly confirms whether findings get promoted to a vault discovery node.

Neither gate may be skipped or implied; both require explicit user response in chat.

*Source:* P-SS-9.

---

## 4. Coordination Rules

### R7 — Parallel dispatch requires independence

Agents MAY only run in parallel when their tasks share no state and have no sequential dependency. When in doubt, sequential — debugging entangled parallel agents costs more than the wall-clock saved.

*Source:* P-SS-3.

### R8 — Single-message fan-out

When dispatching N parallel agents, all dispatch tool calls MUST be made in a single assistant message. Sequential dispatch silently loses parallelism.

*Source:* P-SS-4.

### R9 — Lock contract before fan-out

Before launching parallel agents, the shared contract — data schema, scope boundaries, taxonomy, decomposition — MUST be defined and recorded in the strategist's chat proposal (lifecycle step 1).

*Source:* P-SS-5.

---

## 5. Briefing & Verification Rules

### R10 — Required briefing fields

Every subagent dispatch MUST include in its briefing prompt:

- **Goal** — what the agent is asked to produce.
- **Why it matters** — context for judgment calls.
- **Already ruled out** — paths the agent should not re-explore.
- **Expected output shape** — structure / length / format the parent expects.
- **Length cap** — token or word limit.

Terse command-style prompts ("find the bug", "review this") violate R10.

*Source:* P-SS-6.

### R11 — Trust-but-verify on writes and verification claims

For any subagent that wrote code, edited files, or claimed a verification passed, the parent MUST inspect the actual diff or run the actual check before treating the work as done.

*Source:* P-SS-7.

---

## 6. Budget & Model Selection Rules

### R12 — Token budgets are per-strategy and model-orthogonal

The strategist sets per-subagent token budgets at dispatch time, justified by the task's expected output shape. Budgets constrain output length, not model choice. Strategies for unbounded exploratory work MAY declare no budget; budgets and model selection are independent decisions.

*Source:* P-SS-2.

### R13 — Recursion budget defaults

For recursive dispatch (children may themselves dispatch), defaults are:

- **Depth: 2** (parent → child → grandchild)
- **Breadth: 5** children per level
- **Total cap: 10** agents per dispatch tree

The strategist tracks live agent count and MUST refuse the next dispatch when the cap would be exceeded, escalating to the user with the question: *"Budget hit at N agents — continue with raised budget, stop, or revise scope?"*

The chat proposal (lifecycle step 1) MAY override defaults with explicit justification, recorded in the Dispatch record (R18).

*Source:* P-SS-8.

### R14 — Strategist proposes model per child with difficulty justification

The strategist's chat proposal MUST name a concrete model per child agent and include a one-line difficulty justification per child. The user validates each model selection in lifecycle step 2.

There is no fixed difficulty taxonomy and no fixed tier→model rule. The strategist describes each task in its own words.

*Source:* P-SS-2.

---

## 7. Artifact Rules

### R15 — File locations: working folder for artifacts; scope-routed discovery promotion

**Working folder for dispatch artifacts.** Every dispatch's `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` MUST be persisted under `docs/features/<feature>/research/<topic>/`, where `<feature>` is the active feature the dispatch supports and `<topic>` is the dispatch slug. The folder lives alongside the feature's specs so that research evidence and the specs that derive from it are co-located.

**Forbidden working folders:**
- `.planning/**` — historical convention, deprecated. Legacy artifacts stay in place but no new dispatch writes there.
- `vault/**` — vault is reserved for codified discipline (premises, axioms, constitutions, discoveries). Raw dispatch evidence is not codified discipline.

**No active feature?** Halt at Step 1 of the lifecycle and ask the user which feature this dispatch belongs to. Never default to `.planning/` or `vault/`. If the work genuinely doesn't fit any existing feature, the user must either name a new feature or decline the dispatch.

**Migration note.** Legacy `.planning/<topic>/research/` artifacts are grandfathered; new dispatches use the feature-folder rule above.

**Discovery promotion is the only mechanism by which dispatch outputs reach a stable home** — and only the discovery node itself, not the original research/findings artifacts (R3 step 7). The promotion target is one of two patterns, classified by the discovery's scope:

- **Knowledge scope** → `vault/discovery/<topic>-definitions/<slug>.md`. The vault remains reserved for codified discipline; a discovery whose load-bearing claims govern the vault's own ontology, schema, edges, agent/skill protocols, premises, or constitutions belongs here.
- **Application scope** → `docs/features/<feature>/discovery/<slug>.md`. A discovery whose claims live or die with one feature (feature design, refactor scoping, internal tradeoffs) belongs with that feature, not in the vault. Promoting it to the vault would dilute the "vault is for codified discipline" stance.

The classification is the strategist's call at lifecycle step 7, surfaced in the user-gate prompt with the proposed path family; the user confirms (or revises) before `domainspec-subagents-discovery-writer` is dispatched. There is no `regime` or equivalent frontmatter field — existing labels (`layer`, `scope`, `tags`) carry the conceptual discrimination, and the path encodes the operational choice. The `discovery` row of [ontology-conventions.md](../ontology-conventions.md) Appendix B already permits dual-location discoveries; this rule formalizes the routing without altering the schema.

*Source:* P-SS-9, D-1 / D-11 of domainspec-subagents-strategy.md discovery; ontology-conventions.md Appendix B `discovery` row.

### R16 — Findings file structure

`domainspec-subagents-findings.md` MUST contain three sections in this order:

1. **Dispatch record** — structured metadata defined in R18.
2. **Findings** — scannable summary plus implications.
3. **Analysis** — tensions, contradictions, cross-cutting reasoning.

Each section header MUST appear; the order is fixed.

*Source:* P-SS-9, D-11 of domainspec-subagents-strategy.md discovery.

### R17 — Citation requirement

Every load-bearing claim in the **Findings** and **Analysis** sections MUST cite a passage in `domainspec-subagents-research.md` (file path + per-child header anchor). Synthesis without traceable citation is uncitable opinion and violates R17.

*Source:* P-SS-9, D-8 fidelity component.

### R18 — Dispatch record schema

The Dispatch record section of `domainspec-subagents-findings.md` MUST contain:

- **Mode** — one of the R19 enum.
- **Per-agent table** with: agent id, model, one-line difficulty justification, token budget (or "unbounded"), declared output shape.
- **Sequencing** — linear chain, parallel set, or DAG description.
- **Recursion budget actually used** — depth, breadth, total agent count.
- **Actual spend** — tokens in / tokens out / total per agent, plus sum.
- **Four-component grade** per R21 (with judgment markers per R22).

Missing any field violates R18.

*Source:* P-SS-9, D-11.

### R23 — Context + Goal preamble required on both artifact files

Both `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` MUST begin with a **Context + Goal preamble** before any other section:

- **Context** — where the need for this dispatch arose (the situation, the question, the upstream artifact or conversation that triggered it).
- **Goal** — what the dispatch was trying to achieve. Stated concretely enough that Coverage (R21) can be evaluated against it.

The preamble appears before the per-child sections (in `domainspec-subagents-research.md`) and before the Dispatch record (in `domainspec-subagents-findings.md`). Without a recorded goal, Coverage cannot be graded; without recorded context, the artifact is not interpretable in isolation.

*Source:* P-SS-9 (artifact as audit trail) + P-SS-10 Coverage component (requires a goal to evaluate against).

---

### R24 — Strategist is enacted by the skill; writers are platform-registered subagents

The lifecycle splits into two implementation surfaces:

- **Strategist role** — enacted by the parent Claude session through the skill `domainspec-subagents-strategy` (`.claude/skills/domainspec-subagents-strategy/SKILL.md` for Claude Code; equivalent for other runtimes). The strategist is **not** a separate subagent; the skill's body instructs the parent how to propose, dispatch, collect, and hand off. This matches the brainstorming/robot-talks pattern — orchestration lives in conversation, not in a dispatched process.
- **Three writer subagents** — defined in the runtime platform's agent registry:
  - **Claude Code**: `.claude/agents/<name>.agent.md`
  - **GitHub Copilot / VSCode**: `.github/agents/<name>.agent.md`
  - **Other runtimes**: their respective registry path.

The three writer agents: `domainspec-subagents-research-writer`, `domainspec-subagents-findings-writer`, `domainspec-subagents-discovery-writer`. Each definition MUST honor the role contract below.

**Cross-platform deployments** maintain parallel agent definitions with the same role contract; the constitution governs the role, not the platform binding. A platform-specific implementation MUST NOT relax or extend the role contract; it MAY adapt the tool list to the platform's tool taxonomy.

The role contracts:

| Surface | Receives | Returns / Persists |
|---|---|---|
| **Strategist** (skill body, parent session) | User intent | Chat proposal (R3 step 1) → after user confirm: dispatches children (step 3), collects returns (step 4), then dispatches the writer agents in turn (steps 5–7). Persists nothing directly. |
| `domainspec-subagents-research-writer` (subagent) | Strategist's collected child returns + Context + Goal + working-folder path | Persists `<working_folder>/research/domainspec-subagents-research.md` per template (R5, R15, R23). Returns confirmation of write. |
| `domainspec-subagents-findings-writer` (subagent) | Path to `domainspec-subagents-research.md` + original Context + Goal | Persists `<working_folder>/research/domainspec-subagents-findings.md` per template (R16, R17, R18, R23). Returns confirmation. |
| `domainspec-subagents-discovery-writer` (subagent) | Path to `domainspec-subagents-findings.md` + user-confirmed discovery target path (knowledge: `vault/discovery/<topic>-definitions/<slug>.md`, or application: `docs/features/<feature>/discovery/<slug>.md`) + scope label | Persists the discovery node at the confirmed path with proper ontology frontmatter and connections. Returns the node path. |

Child agents (the N agents the strategist dispatches in step 3) have ad-hoc role contracts defined per-dispatch in their R10 briefings; they are not pre-registered as named lifecycle agents.

*Source:* P-SS-2 / P-SS-9 (separation of orchestration from persistence), the LLM-agnostic / platform-agnostic principle in feedback memory, and the brainstorming/robot-talks precedent (orchestrator role enacted by parent session, not dispatched).

---

## 8. Mode Rules

### R19 — Each dispatch declares one mode

Every dispatch declares exactly one of:

- `single` — one agent, one question.
- `task-fan-out` — N agents, partitioned concerns, parallel.
- `robot-talks` — N agents, same question, declared perspectives, tensions desired.
- `sequential` — linear chain; agent B depends on agent A.
- `mixed` — multi-phase combinations; explicit DAG required.

The mode is declared in the strategist's chat proposal and recorded in the Dispatch record (R18).

*Source:* D-4 of domainspec-subagents-strategy.md discovery.

### R20 — Robot-talks mode binds robot-talks-constitution

A dispatch with `mode: robot-talks` additionally binds [robot-talks-constitution.md](robot-talks-constitution.md) on top of this constitution. Conflicts resolve in favor of robot-talks-constitution within robot-talks dispatches (it is more specific).

*Source:* D-4 of domainspec-subagents-strategy.md discovery.

---

## 9. Grading Rules

### R21 — Four-component grade recorded at dispatch close

At dispatch close, the four-component grade MUST be recorded in the Dispatch record (R18) on a 0–1 scale:

- **Coverage** — did the decomposition cover the goal?
- **Independence** — were concerns non-overlapping?
- **Fidelity** — were findings traceable to evidence?
- **Cost discipline** — did agents stay within declared budgets?

The grade MUST be present even when only the cost component is mechanically computed.

*Source:* P-SS-10.

### R22 — Judgments MUST be marked as judgments

Of the four components, **only cost discipline is mechanically computed** (declared budget vs. actual spend). The other three are evaluator judgments. The Dispatch record MUST mark each judgment score with `(judgment)` next to the value, distinguishing it from the mechanical cost score. Treating the aggregate as a metric is a constitution violation.

*Source:* P-SS-10 discipline note.

---

## 10. Governance

### Adoption

This constitution is binding for all subagent dispatch initiated after its `last_updated` date. Pre-existing artifacts (notably the chat-ui-variants strategy file at `implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md`) are **grandfathered**: they remain valid in their current form and are flagged for opportunistic migration when next touched. Forced retroactive migration is not required.

### Amendment process

Rules in this constitution are derived from premises. To change a rule:

1. Revise the source premise(s) in `domainspec-subagents-strategy-premises.md` (bump version, update version history).
2. Revise the dependent rule(s) here (bump version, update version history).
3. Revise the implementing skill (forthcoming) to match.

A rule MUST NOT change without a corresponding premise change. A premise change MAY happen without a rule change (e.g., evidence accumulation that does not yet alter the rule).

### Non-negotiable principles

The following are load-bearing — they cannot be relaxed without revisiting the foundational premises and likely the schema chain:

- **R4** — proposal never persists. Phantom files break the user-confirmation gate.
- **R5** — children never write files. Race conditions are silent and corrupting.
- **R6** — both user gates are mandatory. Skipping either turns dispatch into improvisation.
- **R11** — trust-but-verify on writes. Without it, subagent self-reports drift from reality.
- **R17** — citation requirement on synthesis. Without it, fidelity collapses into opinion aggregation.

### Known drift to fix in a separate ontology-amendment discovery

[`ontology-conventions.md`](../ontology-conventions.md) currently lists `domainspec-subagents-strategy` as a `node_type` value (line 56, line 123, line 609). D-10 of `domainspec-subagents-strategy.md` discovery was **reversed in v0.3.0** — no `domainspec-subagents-strategy` node_type is required because the dispatch record now lives as a section inside `domainspec-subagents-findings.md`. Removing it from the ontology requires its own discovery (per the schema-evolution gate). This constitution does not depend on the unused node_type, but the drift should be cleaned up.

---

## 11. Connections

| Document | Type | Description |
|----------|------|-------------|
| [domainspec-subagents-strategy-premises.md](../premise/domainspec-subagents-strategy-premises.md) | `derives-from` | Source premises (P-SS-1..10) for every rule here. Each rule cites the source premise inline. |
| [domainspec-subagents-strategy.md](../discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md) | `discovery-of` | Discovery document that records the design decisions (D-1..12), alternatives considered (A-1..8), and open questions (OQ-1..7). |
| [robot-talks-constitution.md](robot-talks-constitution.md) | `binds-when` | Mode-conditional binding — applies additionally when a dispatch declares `mode: robot-talks` (R20). |
| [robot-talks-premises.md](../premise/robot-talks-premises.md) | `mode-of-source` | Source premises for the robot-talks-specific rules that R20 transitively binds. |
| [system-premises.md](../premise/system-premises.md) | `derives-from` | P-SYS-3 (docs as source of truth) and P-SYS-7 (revisability) ground R10 (briefing) and R21 (grading). |
| [ontology-conventions.md](../ontology-conventions.md) | `governed-by` | Frontmatter and node_type compliance. See §10 governance for known drift. |
| [templates/domainspec-subagents-research.md](../templates/domainspec-subagents-research.md) | `shape-contract-for` | Skill-emitted research file template. Implements R5, R15 (per-child header convention). |
| [templates/domainspec-subagents-findings.md](../templates/domainspec-subagents-findings.md) | `shape-contract-for` | Skill-emitted findings file template. Implements R15, R16, R17, R18, R21, R22. |
| `.claude/skills/domainspec-subagents-strategy/` *(forthcoming)* | `operationalized-by` | Executable behavior that enforces this constitution at dispatch time. |
| `vault/sessions/2026-05-03-0327-domainspec-subagents-strategy-scope-routed-promotion.md` | `modified-by` | Session that edited R3 step 7, R5, R15 (rewritten), R24 table row, and added Version History v0.1.5 entry. |
| [../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session executed the project-wide rename (`domainspec-subagents-strategy-constitution` → `domainspec-subagents-strategy-constitution`). |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.1.5 | 2026-05-03 | **R15 + R3 step 7 + R24 revised — scope-routed discovery promotion.** Discovery-promotion target is no longer hardcoded to `vault/discovery/`. Knowledge-scope discoveries (claims governing vault discipline) still land at `vault/discovery/<topic>-definitions/<slug>.md`; application-scope discoveries (claims internal to one feature) land at `docs/features/<feature>/discovery/<slug>.md`. The strategist classifies at lifecycle step 7 and proposes the path; the user confirms before dispatch. No new frontmatter field — existing labels (`layer`, `scope`, `tags`) carry the conceptual discrimination, and the path encodes the operational choice. Resolves the divergence flagged in vault session `2026-05-03-0140-subagents-strategy-discovery-target-divergence`. |
| 0.1.4 | 2026-05-02 | **R24 revised — strategist enacted by skill, not a subagent.** The strategist role is now embedded in the skill body (`.claude/skills/domainspec-subagents-strategy/SKILL.md`); the parent Claude session enacts it directly, matching the brainstorming/robot-talks precedent. Result: 3 subagent files instead of 4. Avoids the round-trip overhead of relaying every chat turn between user and a "strategist" subagent. The role-contracts table now has one strategist row (skill-body surface) and three writer-agent rows (subagent surface). |
| 0.1.3 | 2026-05-02 | **Working folder + agent registry rules.** (1) **R15 strengthened**: artifacts MUST NOT be written to the vault — vault is reserved for codified discipline. The strategist's chat proposal MUST suggest one or more candidate working folders based on active context; the user explicitly confirms in lifecycle step 2. Discovery promotion is the only path to vault. (2) **R24 added**: agent definitions live in the platform's agent registry (`.claude/agents/` for Claude Code, `.github/agents/` for GitHub Copilot/VSCode, etc.); constitution governs the role contract, not the platform binding. Includes a role-contract table for the four lifecycle agents (receives / returns / persists). |
| 0.1.2 | 2026-05-02 | **Research-writer split.** R3 lifecycle grew from 6 to 7 steps — strategist now *returns* collected child outputs and the original Context + Goal but does NOT write any file; a dedicated `domainspec-subagents-research-writer` agent persists `domainspec-subagents-research.md` (new step 5). R5 rewritten to make file persistence the exclusive responsibility of three dedicated writer agents (research-writer, findings-writer, discovery-writer); both children AND strategist are now forbidden from writing. Rationale: symmetric single-responsibility — every artifact has a dedicated writer; the strategist becomes pure orchestrator. Knock-on edits in discovery doc D-9 (4 lifecycle agents instead of 3) and §Lifecycle ASCII pending. |
| 0.1.1 | 2026-05-02 | Added **R23 — Context + Goal preamble required on both artifact files**. Both `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` MUST begin with Context (where the need arose) + Goal (what the dispatch is trying to achieve). Derives from P-SS-9 (audit trail) and P-SS-10 Coverage (needs a goal to grade against). Templates updated to include the preamble. Total rules: 23. |
| 0.1.0 | 2026-05-02 | Initial constitution. Codifies domainspec-subagents-strategy-premises.md@v0.4.0 into 22 rules across 8 rule sections plus governance. Templates for `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` created at `templates/`. Notes drift in `ontology-conventions.md` (`domainspec-subagents-strategy` listed as node_type but D-10 reversed in v0.3.0) for follow-up discovery. |
