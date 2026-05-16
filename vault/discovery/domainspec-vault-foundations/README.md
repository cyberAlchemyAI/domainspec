---
tags: [vault, ontology, navigation, readme, epistemic-chain, classification]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.3.1
last_updated: 2026-05-16
---

# domainspec-vault-foundations

## What is this?

Discovery folder consolidating the **structural foundations of the vault itself** — how knowledge is classified and how it matures. Holds two discovery documents (`scope-and-domain-axes.md` defining how documents are categorized; `epistemic-chain.md` defining how they graduate from raw observation to enforceable rule) and the research wave that produced their evidence.

## Business Context

Sits at the foundation of the vault's structural model. Defines the vocabulary (`node_type`, `scope`, `domain`, `veracidade`, `convicção`, `axiom`, `premise`, `discovery`, `constitution`) used by every other folder. Subagents-strategy and robot-talks were previously housed here as a "third pillar" but are not part of the vault's structural model — they are orchestration disciplines that run *on top of* the vault and now live as siblings: [vault/discovery/domainspec-subagents-strategy-definitions/](../domainspec-subagents-strategy-definitions/) and [vault/discovery/robot-talks-definitions/](../robot-talks-definitions/).

## Why it matters

The vault's original `layer` field conflated two unrelated axes (epistemic-stack position vs subject matter); the meaning of `node_type` values was nowhere written down. Without resolving both, every downstream rule rests on undefined vocabulary. This folder is the canonical place that fixes both, and is the right first stop for any reader trying to understand the vault's structural rules.

## 📁 Navigation

- [scope-and-domain-axes.md](scope-and-domain-axes.md) — Discovery: design space and decisions for splitting `layer` into `scope` + `domain` axes. Status: exploratory.
- [epistemic-chain.md](epistemic-chain.md) — Discovery: full lifecycle model for how knowledge matures; defines all `node_type` values. Status: draft. **Read first.**
- [research/T1-empirical-history.md](research/T1-empirical-history.md) — Research: empirical history of real-world taxonomies (Linnaean, DDC, MeSH, etc.).
- [research/T2-upper-ontologies.md](research/T2-upper-ontologies.md) — Research: survey of upper ontologies (BFO, DOLCE, SUMO, Cyc) and their lessons.
- [research/T3-tree-dag-lattice.md](research/T3-tree-dag-lattice.md) — Research: structural analysis of tree vs. DAG vs. lattice for taxonomy growth.
- [research/T4-growth-governance.md](research/T4-growth-governance.md) — Research: governance rules for controlled vocabulary growth and retirement.
- [research/SYNTHESIS.md](research/SYNTHESIS.md) — Synthesis of T1–T4; resolves OQ-1 through OQ-4 from scope-and-domain-axes.
- [research/epistemic-chain-evidence-survey.md](research/epistemic-chain-evidence-survey.md) — Evidence survey for epistemic-chain.
- [research/scope-and-domain-axes-evidence.md](research/scope-and-domain-axes-evidence.md) — Evidence survey for scope-and-domain-axes.

## The Two Pillars

### 1. The classification schema (`scope-and-domain-axes.md`)

The vault's original `layer` field conflated two unrelated axes. This discovery records the decision to split that field into two orthogonal axes — `scope` (epistemic-stack position) and `domain` (open, growable controlled vocabulary of subject matter). Four parallel research agents (T1–T4) investigated how real-world taxonomies have handled the problem; their synthesis is in `research/SYNTHESIS.md`.

### 2. The epistemic chain (`epistemic-chain.md`)

Every document carries a `node_type` label, but its meaning was not written down anywhere. This discovery defines the lifecycle: raw evidence becomes `research`, research crystallizes into `discovery`, discoveries validate into `premise`, premises that survive enough falsification graduate to `axiom`, and `constitution` codifies the rules derived from settled knowledge. The document opens with a full glossary; it is the single most important document to read first.

## Suggested Reading Order

### For a new reader

1. **[epistemic-chain.md](epistemic-chain.md)** — first, linearly. Defines every term used downstream.
2. **[scope-and-domain-axes.md](scope-and-domain-axes.md)** — shows the current major design problem and decisions taken.
3. **[research/SYNTHESIS.md](research/SYNTHESIS.md)** — only if you want the evidence base for scope/domain decisions.
4. **research/T1–T4** — only to verify a specific claim or trace evidence for a particular finding.

For orchestration concepts that used to be filed here, read [domainspec-subagents-strategy-definitions/](../domainspec-subagents-strategy-definitions/) (parent) and [robot-talks-definitions/](../robot-talks-definitions/) (mode).

### For a returning reader

Go straight to the two discovery documents. Open-questions sections tell you what is unresolved. Skim `research/SYNTHESIS.md` to see which of OQ-1 through OQ-4 have been resolved.

## Status

Both discoveries are works-in-progress:

- `scope-and-domain-axes.md` — `status: exploratory`. OQ-5 answered in the 2026-05-02 session (don't split scope: ontology); OQ-6 deferred. Constitution amendments not drafted.
- `epistemic-chain.md` — `status: draft`. Lifecycle model written and internally consistent; not validated against full corpus or promoted to constitution.

This folder represents current thinking, not settled rules.

## What Is NOT in This Folder

- Constitution amendments (the actual updated rules for `scope` and `domain` fields)
- File migration scripts or classification tooling
- Any orchestration / dispatch concept (subagents-strategy, robot-talks) — those live in sibling folders
- Any implementation code

When those artifacts are written, they will live in `vault/constitution/`, `vault/axiom/`, `vault/premise/`, and the relevant implementation directories.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../ontology-conventions.md](../../ontology-conventions.md) | `targets-amendment` | The constitution this work proposes to amend; defines the current `layer` field. |
| [../../confidence-levels.md](../../confidence-levels.md) | `cites` | Defines `veracidade` and `convicção` — required background. |
| [../../axiom/](../../axiom/) | `targets` | Holds existing axiom documents — graduation targets that premises aspire to. |
| [../../premise/](../../premise/) | `targets` | Holds existing premise documents. |
| [../../constitution/](../../constitution/) | `targets` | Holds existing constitution documents. |
| [../domainspec-subagents-strategy-definitions/](../domainspec-subagents-strategy-definitions/) | `sibling-of` | Orchestration concept formerly filed here as "pillar 3". |
| [../robot-talks-definitions/](../robot-talks-definitions/) | `sibling-of` | Robot-talks dispatch mode (mode-of domainspec-subagents-strategy). |
| [../../../TUNING-LOOP.md](../../../TUNING-LOOP.md) | `cites` | Defines the drift-convergence pipeline; the two pillars are inputs at the `discovery` stage. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | Session renamed this folder from `vault-foundations/` to `domainspec-vault-foundations/`. |
