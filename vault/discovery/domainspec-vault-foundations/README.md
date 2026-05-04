---
tags: [vault, ontology, navigation, readme, epistemic-chain, classification]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.3.0
last_updated: 2026-05-02
---

# domainspec-vault-foundations — Navigation README

This folder consolidates the **structural foundations of the vault itself** — how knowledge is classified and how it matures. It holds the two discovery documents that define *how documents are categorized* and *how they graduate from raw observation to enforceable rule*, along with the research wave that produced the evidence those discoveries draw on. If you want to understand the vault's structural rules and where they come from, this is the right starting point.

> **Scope note (2026-05-02 split).** Subagents-strategy and robot-talks were previously housed here as a "third pillar" but are not part of the vault's structural model — they are orchestration disciplines that run *on top of* the vault. They now live as siblings: [vault/discovery/domainspec-subagents-strategy-definitions/](../domainspec-subagents-strategy-definitions/) (parent concept) and [vault/discovery/robot-talks-definitions/](../robot-talks-definitions/) (one mode of domainspec-subagents-strategy).

---

## The Two Pillars

### 1. The classification schema (`scope-and-domain-axes.md`)

The vault's original `layer` field conflated two unrelated axes: where a document sits in the epistemic stack versus what subject matter it covers. This discovery records the decision to split that field into two orthogonal axes — `scope` (epistemic-stack position) and `domain` (open, growable controlled vocabulary of subject matter). Four parallel research agents (T1–T4) investigated how real-world taxonomies have handled this problem; their synthesis is in `research/SYNTHESIS.md`. The discovery locks in the decisions already taken, names the alternatives rejected, and enumerates the open questions that must resolve before constitution amendments can be drafted.

### 2. The epistemic chain (`epistemic-chain.md`)

Every document in the vault carries a `node_type` label, but the meaning of that label was not written down anywhere. This discovery defines the full lifecycle: raw evidence becomes `research`, research gets crystallized into `discovery`, discoveries are validated into `premise`, premises that survive enough falsification graduate to `axiom`, and `constitution` codifies the rules derived from that settled knowledge. The document opens with a full glossary so that any reader — including one who has never seen the vault — can read it linearly and arrive at an unambiguous understanding of the chain. This is the single most important document to read first.

---

## File Map

| File | Type | Purpose | Status |
|---|---|---|---|
| [scope-and-domain-axes.md](scope-and-domain-axes.md) | discovery | Design space and decisions for splitting `layer` into `scope` + `domain` axes | exploratory |
| [epistemic-chain.md](epistemic-chain.md) | discovery | Full lifecycle model for how knowledge matures; defines all `node_type` values | draft |
| [research/T1-empirical-history.md](research/T1-empirical-history.md) | research | Empirical history of real-world taxonomies (Linnaean, DDC, MeSH, etc.) | — |
| [research/T2-upper-ontologies.md](research/T2-upper-ontologies.md) | research | Survey of upper ontologies (BFO, DOLCE, SUMO, Cyc) and their lessons | — |
| [research/T3-tree-dag-lattice.md](research/T3-tree-dag-lattice.md) | research | Structural analysis of tree vs. DAG vs. lattice for taxonomy growth | — |
| [research/T4-growth-governance.md](research/T4-growth-governance.md) | research | Governance rules for controlled vocabulary growth and retirement | — |
| [research/SYNTHESIS.md](research/SYNTHESIS.md) | discovery | Synthesis of T1–T4 findings; resolves OQ-1 through OQ-4 from scope-and-domain-axes | draft |
| [research/epistemic-chain-evidence-survey.md](research/epistemic-chain-evidence-survey.md) | research | Evidence survey supporting the epistemic-chain discovery | — |
| [research/scope-and-domain-axes-evidence.md](research/scope-and-domain-axes-evidence.md) | research | Evidence supporting the scope-and-domain-axes discovery | — |

---

## Suggested Reading Order

### For a new reader (never seen the vault)

1. **[epistemic-chain.md](epistemic-chain.md)** — read this first, linearly. It defines every term used in the other documents (`node_type`, `axiom`, `premise`, `discovery`, `constitution`, `veracidade`, `convicção`). Without this, the other documents will refer to undefined terms.
2. **[scope-and-domain-axes.md](scope-and-domain-axes.md)** — once you have the vocabulary, this shows the current major design problem and the decisions taken so far.
3. **[research/SYNTHESIS.md](research/SYNTHESIS.md)** — only if you want to understand the evidence base for the scope/domain decisions; this is the convergence document from the T1–T4 research wave.
4. **research/T1–T4 files** — only if you want to verify a specific claim or trace the evidence chain for a particular finding.

For the orchestration concepts that used to be filed here, read [vault/discovery/domainspec-subagents-strategy-definitions/](../domainspec-subagents-strategy-definitions/) (parent concept) and [vault/discovery/robot-talks-definitions/](../robot-talks-definitions/) (mode) — they are now siblings of this folder.

### For a returning reader (knows the vault, wants the current state)

Go straight to the two discovery documents. The open questions sections of each tell you what has not been resolved. Skim `research/SYNTHESIS.md` to see which of the original open questions (OQ-1 through OQ-4) have been resolved and which remain (OQ-5 and OQ-6).

---

## Cross-Folder Connections

- **[vault/ontology-conventions.md](../../ontology-conventions.md)** — the constitution this work proposes to amend. It defines the current `layer` field that `scope-and-domain-axes.md` targets for a breaking change. Read it to understand what the current rules are before reading about what they might become.
- **[vault/confidence-levels.md](../../confidence-levels.md)** — defines `veracidade` and `convicção`, the two confidence dimensions used throughout both discoveries. Required background if those terms are unfamiliar.
- **[vault/axiom/](../../axiom/)** — holds existing axiom documents. These are the graduation targets that premises aspire to; `epistemic-chain.md` explains what it takes to get there.
- **[vault/premise/](../../premise/)** — holds existing premise documents.
- **[vault/constitution/](../../constitution/)** — holds existing constitution documents.
- **[vault/discovery/domainspec-subagents-strategy-definitions/](../domainspec-subagents-strategy-definitions/)** — sibling folder for the orchestration concept (formerly "pillar 3" here). Subagents-strategy runs on top of the vault's structural model defined in this folder.
- **[vault/discovery/robot-talks-definitions/](../robot-talks-definitions/)** — sibling folder for the robot-talks dispatch mode (mode-of domainspec-subagents-strategy).
- **[TUNING-LOOP.md](../../../TUNING-LOOP.md)** — defines the drift-convergence pipeline (`research → analyze → summarize → discovery → plan → spec → ...`). The two pillars in this folder are inputs to that pipeline at the `discovery` stage.

---

## What Is NOT in This Folder

This folder contains the **design and rationale for vault structure** — the thinking, the decisions, the evidence, and the open questions behind classification and lifecycle. It does not contain:

- Constitution amendments (the actual updated rules for `scope` and `domain` fields)
- File migration scripts or classification tooling
- Any orchestration / dispatch concept (domainspec-subagents-strategy, robot-talks) — those live in sibling folders
- Any implementation code

When those artifacts are written, they will live in `vault/constitution/`, `vault/axiom/`, `vault/premise/`, and the relevant implementation directories. Do not look here for the rules themselves — look here for the reasoning behind them.

---

## Status

Both discoveries are works-in-progress:

- `scope-and-domain-axes.md` — `status: exploratory`. Open questions OQ-5 and OQ-6 from the research wave remain unresolved (OQ-5 was answered in the 2026-05-02 session: don't split scope: ontology; OQ-6 deferred). Constitution amendments have not been drafted.
- `epistemic-chain.md` — `status: draft`. The lifecycle model is written and internally consistent, but has not been validated against the full corpus or promoted to constitution status.

This folder represents current thinking, not settled rules. Treat every document here as input to a future decision, not as the decision itself.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session renamed this folder from `vault-foundations/` to `domainspec-vault-foundations/`; this README is the navigable file at the new path. |
