---
tags: [vault, ontology, navigation, readme, epistemic-chain, classification, subagents-strategy]
node_type: readme
is_session: false
session_ref: null
layer: ontology
nature: reference
status: draft
version: 0.2.0
last_updated: 2026-05-02
---

# vault-foundations — Navigation README

This folder consolidates the foundational design work for the vault's classification and governance system. It holds the three discovery documents that define *how knowledge is classified*, *how it matures*, and *how agents are dispatched* — along with the research wave that produced the evidence those discoveries draw on. If you want to understand the vault's structural rules and where they come from, this is the right starting point.

---

## The Three Pillars

### 1. The classification schema (`scope-and-domain-axes.md`)

The vault's original `layer` field conflated two unrelated axes: where a document sits in the epistemic stack versus what subject matter it covers. This discovery records the decision to split that field into two orthogonal axes — `scope` (epistemic-stack position) and `domain` (open, growable controlled vocabulary of subject matter). Four parallel research agents (T1–T4) investigated how real-world taxonomies have handled this problem; their synthesis is in `research/SYNTHESIS.md`. The discovery locks in the decisions already taken, names the alternatives rejected, and enumerates the open questions that must resolve before constitution amendments can be drafted.

### 2. The epistemic chain (`epistemic-chain.md`)

Every document in the vault carries a `node_type` label, but the meaning of that label was not written down anywhere. This discovery defines the full lifecycle: raw evidence becomes `research`, research gets crystallized into `discovery`, discoveries are validated into `premise`, premises that survive enough falsification graduate to `axiom`, and `constitution` codifies the rules derived from that settled knowledge. The document opens with a full glossary so that any reader — including one who has never seen the vault — can read it linearly and arrive at an unambiguous understanding of the chain. This is the single most important document to read first.

### 3. Subagents-strategy (`subagents-strategy.md`)

Subagent invocation was recurring in feature work with no foundational treatment. This discovery records the design decisions behind **subagents-strategy** (renamed from `agents-strategy` in the 2026-05-02 redesign): the governing concept for when and how to dispatch subagents, which **capability tier** to use (`mechanical / synthesis / judgment` — LLM-agnostic, with tier→model as configuration), and how the dispatch discipline relates to the existing `robot-talks-constitution.md` (robot-talks is now a *mode*, not a sibling concept). The discovery locks in the premise set already written, names rejected alternatives, and enumerates what must resolve before the constitution and skill can be drafted.

**Subagents-strategy is a tool, not a drift-convergence pipeline stage.** The drift-convergence pipeline (`research → analyze → summarize → discovery → plan → spec → ...`, see [TUNING-LOOP.md](../../../TUNING-LOOP.md)) has its own upstream stages; subagents-strategy is the **mechanism** that may execute the `research / analyze / summarize` stages efficiently when parallel dispatch is warranted. A non-trivial dispatch produces a three-file `/research/` output set (process record + raw evidence + findings-with-analysis).

---

## File Map

| File | Type | Purpose | Status |
|---|---|---|---|
| [scope-and-domain-axes.md](scope-and-domain-axes.md) | discovery | Design space and decisions for splitting `layer` into `scope` + `domain` axes | exploratory |
| [epistemic-chain.md](epistemic-chain.md) | discovery | Full lifecycle model for how knowledge matures; defines all `node_type` values | draft |
| [subagents-strategy.md](subagents-strategy.md) | discovery | Decisions and open questions for the subagents-strategy governance concept (renamed from agents-strategy 2026-05-02) | draft — Phase 2 recovery pending |
| [agents-strategy.md](agents-strategy.md) | discovery | **SUPERSEDED** by `subagents-strategy.md` (concept renamed + duplicate merged). Preserved as historical context. | superseded |
| [research/T1-empirical-history.md](research/T1-empirical-history.md) | research | Empirical history of real-world taxonomies (Linnaean, DDC, MeSH, etc.) | — |
| [research/T2-upper-ontologies.md](research/T2-upper-ontologies.md) | research | Survey of upper ontologies (BFO, DOLCE, SUMO, Cyc) and their lessons | — |
| [research/T3-tree-dag-lattice.md](research/T3-tree-dag-lattice.md) | research | Structural analysis of tree vs. DAG vs. lattice for taxonomy growth | — |
| [research/T4-growth-governance.md](research/T4-growth-governance.md) | research | Governance rules for controlled vocabulary growth and retirement | — |
| [research/SYNTHESIS.md](research/SYNTHESIS.md) | discovery | Synthesis of T1–T4 findings; resolves OQ-1 through OQ-4 from scope-and-domain-axes | draft |
| [research/epistemic-chain-evidence-survey.md](research/epistemic-chain-evidence-survey.md) | research | Evidence survey supporting the epistemic-chain discovery | — |
| [research/agents-strategy-prior-version.md](research/agents-strategy-prior-version.md) | historical | **SUPERSEDED** prior version of agents-strategy; merged into `subagents-strategy.md` 2026-05-02. Kept for audit trail. | superseded |

---

## Suggested Reading Order

### For a new reader (never seen the vault)

1. **[epistemic-chain.md](epistemic-chain.md)** — read this first, linearly. It defines every term used in the other documents (`node_type`, `axiom`, `premise`, `discovery`, `constitution`, `veracidade`, `convicção`). Without this, the other documents will refer to undefined terms.
2. **[scope-and-domain-axes.md](scope-and-domain-axes.md)** — once you have the vocabulary, this shows the current major design problem and the decisions taken so far.
3. **[subagents-strategy.md](subagents-strategy.md)** — shorter; covers the governance gap around subagent dispatch. (Do **not** read the legacy `agents-strategy.md` or `research/agents-strategy-prior-version.md` — both are superseded; they exist only for historical audit.)
4. **[research/SYNTHESIS.md](research/SYNTHESIS.md)** — only if you want to understand the evidence base for the scope/domain decisions; this is the convergence document from the T1–T4 research wave.
5. **research/T1–T4 files** — only if you want to verify a specific claim or trace the evidence chain for a particular finding.

### For a returning reader (knows the vault, wants the current state)

Go straight to the three discovery documents. The open questions sections of each tell you what has not been resolved. Skim `research/SYNTHESIS.md` to see which of the original open questions (OQ-1 through OQ-4) have been resolved and which remain (OQ-5 and OQ-6).

---

## Cross-Folder Connections

- **[vault/ontology-conventions.md](../../ontology-conventions.md)** — the constitution this work proposes to amend. It defines the current `layer` field that `scope-and-domain-axes.md` targets for a breaking change. Read it to understand what the current rules are before reading about what they might become.
- **[vault/confidence-levels.md](../../confidence-levels.md)** — defines `veracidade` and `convicção`, the two confidence dimensions used throughout all three discoveries. Required background if those terms are unfamiliar.
- **[vault/axiom/](../../axiom/)** — holds existing axiom documents. These are the graduation targets that premises aspire to; `epistemic-chain.md` explains what it takes to get there.
- **[vault/premise/](../../premise/)** — holds existing premise documents. The subagents-strategy discovery produced a new premise set (currently at `agent-dispatch-premises.md`, pending rename to `subagents-strategy-premises.md` and `P-AD-* → P-SS-*` ID rename).
- **[vault/constitution/](../../constitution/)** — holds existing constitution documents, including `robot-talks-constitution.md`, which is the adjacent governance document to `subagents-strategy.md` (robot-talks is now formally a *mode* of subagents-strategy).
- **[TUNING-LOOP.md](../../../TUNING-LOOP.md)** — defines the drift-convergence pipeline (`research → analyze → summarize → discovery → plan → spec → ...`). The pillar 3 discovery clarifies that subagents-strategy is a **tool** that may execute the upstream stages, not itself a pipeline stage.

---

## What Is NOT in This Folder

This folder contains the **design and rationale** — the thinking, the decisions, the evidence, and the open questions. It does not contain:

- Constitution amendments (the actual updated rules for `scope` and `domain` fields)
- File migration scripts or classification tooling
- The subagents-strategy constitution or skill
- Any implementation code

When those artifacts are written, they will live in `vault/constitution/`, `vault/axiom/`, `vault/premise/`, and the relevant implementation directories. Do not look here for the rules themselves — look here for the reasoning behind them.

---

## Status

All three discoveries are works-in-progress:

- `scope-and-domain-axes.md` — `status: exploratory`. Open questions OQ-5 and OQ-6 from the research wave remain unresolved. Constitution amendments have not been drafted.
- `epistemic-chain.md` — `status: draft`. The lifecycle model is written and internally consistent, but has not been validated against the full corpus or promoted to constitution status.
- `subagents-strategy.md` — `status: draft, Phase 2 recovery pending`. The premise set is written; the discovery has been merged from two duplicates and partially redesigned (capability tiers landed, three-file output set + operational mode definitions + lifecycle section pending direct re-application after a subagent applier reported false success on its edits). The constitution and skill are deferred until other design decisions resolve. See [vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md](../../sessions/2026-05-02-1711-subagents-strategy-redesign.md) for the full execution log and current open questions.

This folder represents current thinking, not settled rules. Treat every document here as input to a future decision, not as the decision itself.
