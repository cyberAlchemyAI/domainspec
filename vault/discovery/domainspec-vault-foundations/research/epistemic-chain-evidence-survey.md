---
tags: [vault, ontology, research, epistemic-chain, evidence-survey]
node_type: discovery
# Forward-looking note: under the model being finalized in vault/discovery/epistemic-chain.md, this would be node_type: research
is_session: false
session_ref: null
layer: ontology
nature: reference
status: draft
veracidade: medium
convicção: low
version: 0.1.0
last_updated: 2026-05-02
---

# Epistemic-Chain Evidence Survey

> Ground-level catalog of existing vault content, written to support `vault/discovery/epistemic-chain.md`. Surveys every axiom, premise, constitution, and discovery in the vault, assesses reclassification candidates under the proposed epistemic-chain model, and surfaces tensions the model has not yet handled.

---

## Objective

This document provides the **concrete evidence base** for W1's discovery. It answers: *"What does the vault actually contain today, and how does that content map — or resist mapping — onto the proposed `research → discovery → premise → axiom` chain?"*

It is not a design document. It is a catalog and a tension-finder.

---

## Index

1. [Catalog of Existing Axioms](#1-catalog-of-existing-axioms)
2. [Catalog of Existing Premises](#2-catalog-of-existing-premises)
3. [Catalog of Existing Constitutions](#3-catalog-of-existing-constitutions)
4. [Catalog of Existing Discoveries](#4-catalog-of-existing-discoveries)
5. [Reclassification Candidates Under the New Model](#5-reclassification-candidates-under-the-new-model)
6. [Premises with Accumulating Evidence (Axiom-Promotion Candidates)](#6-premises-with-accumulating-evidence-axiom-promotion-candidates)
7. [Tensions Surfaced by the Proposed Model](#7-tensions-surfaced-by-the-proposed-model)
8. [Recommendations for W1](#8-recommendations-for-w1)

---

## 1. Catalog of Existing Axioms

### `vault/axiom/system-axioms.md`

**Topic:** Foundational architectural commitments (determinism, testability, folder-as-hypothesis, immutability, observability).

**Asserts:** Five named axioms (AX-SYS-1 through AX-SYS-5) that define non-negotiable properties of the financial data platform. Example: "Same input must always produce the same output" (AX-SYS-1).

| Field | Value |
|-------|-------|
| `status` | `consolidated` |
| `veracidade` | not present |
| `convicção` | not present |

**Note:** Unusually, this file omits `veracidade` and `convicção` despite making foundational architectural bets. The `node_type: axiom` declaration and `status: consolidated` carry the weight instead.

---

### `vault/axiom/ontology-axioms.md`

**Topic:** Non-negotiable commitments of the classification system itself (entropy minimization, label orthogonality, unique nodes, explicit knowledge, explicit questions, navigability, reasoning-as-navigation).

**Asserts:** Seven named axioms (AX-ONT-1 through AX-ONT-7) with full information-theoretic foundations and external academic references. Includes an internal derivation hierarchy: AX-ONT-7 (reasoning is navigation) is the root; all others derive from it.

| Field | Value |
|-------|-------|
| `status` | `exploratory` |
| `veracidade` | `low` |
| `convicção` | `high` |

**Note:** This is the most significant tension in the current axiom layer. The document is labeled `node_type: axiom` but carries `veracidade: low` and `status: exploratory`. By the vault's own definitions, axioms are "foundational commitments taken as given" — yet this file explicitly acknowledges that AX-ONT-7 ("reasoning is navigation") is a working hypothesis, not a proven theorem. This is a self-declared strategic bet masquerading as an axiom. The file's own text says: *"We do not treat this as a proven theorem. We treat it as the operating hypothesis."* Under the proposed epistemic-chain model, this is a `premise` at best, possibly even a `discovery`.

---

### `vault/axiom/frontend-axioms.md`

**Topic:** Universal truths about React frontend architecture (determinism, unidirectional data flow, separation of data fetching and rendering).

**Asserts:** Three axioms (A1–A3) about React's fundamental behavior constraints. These are grounded in the React paradigm itself — not the team's bets.

| Field | Value |
|-------|-------|
| `status` | `active` |
| `veracidade` | not present |
| `convicção` | not present |

**Note:** `nature: universal` is a non-standard value not in the ontology conventions catalog. `layer: architecture` is correct. The axioms themselves are genuinely foundational within the React paradigm — closer to true axioms than the ontology-axioms file.

---

## 2. Catalog of Existing Premises

### `vault/premise/system-premises.md`

**Topic:** Technical and behavioral working bets about the platform architecture (domain isolation, Polars, docs-as-source-of-truth, architectural complexity, ontological boundaries, implicit knowledge, refactoring primacy, granularity, lifecycle trees, fail-open logging, deterministic identity).

**Asserts:** 11 named premises (P-SYS-1 through P-SYS-11) with explicit `convicção`/`veracidade` pairs.

| Field | Value |
|-------|-------|
| `status` | `exploratory` |
| `veracidade` | not present (per-premise only) |
| `convicção` | not present (per-premise only) |

**Notable:** P-SYS-4, P-SYS-5, P-SYS-6, P-SYS-7, P-SYS-9 are all marked `convicção: high / veracidade: high`. These are the most consolidated premises in the vault — they have survived production use and match observed behavior.

---

### `vault/premise/ontology-premises.md`

**Topic:** Working hypotheses about the classification system itself (label sufficiency, linear status hierarchy, two confidence dimensions, session classifiability, MI achievability, frontmatter as SoT, density over granularity, session provenance, system adaptability).

**Asserts:** 9 named premises (P-ONT-1 through P-ONT-9) with explicit per-premise confidence.

| Field | Value |
|-------|-------|
| `status` | `exploratory` |
| `veracidade` | `low` (file-level) |
| `convicção` | `high` (file-level) |

**Notable:** P-ONT-4 ("Sessions produce knowledge classifiable by the same labels") is the highest-confidence premise in this file: `convicção: high / veracidade: high`, with evidence: "Already applied to ~20 sessions in the vault. All were classified without ambiguity."

---

### `vault/premise/robot-talks-premises.md`

**Topic:** Working hypotheses for multi-agent parallel investigation (cross-layer tensions require multi-perspective investigation, scope design determines signal quality, synthesis is tension discovery, localization precedes reduction, pulsed orchestration, bounded scope precondition, non-overlapping concerns, fidelity-traceability chain).

**Asserts:** 8 named premises (P-RT-1 through P-RT-8), all but one marked `convicção: high / veracidade: high`.

| Field | Value |
|-------|-------|
| `status` | `active` |
| `veracidade` | `high` (file-level) |
| `convicção` | `high` (file-level) |

**Notable:** This is the most operationally validated premise file. P-RT-1 through P-RT-4, P-RT-6, P-RT-7, P-RT-8 all cite a specific POC (frontend-backend alignment, 2026-04-10) as evidence. P-RT-5 is the only exception (`veracidade: medium`), pending cost-function instrumentation. This file is close to axiom-promotion territory for several premises.

---

### `vault/premise/frontend-premises.md`

**Topic:** Current product bets about the React frontend (filter state in React state, Portuguese-only hardcoding, infinite scroll as default, page-level state management without a library).

**Asserts:** 4 premises (P1–P4), each with explicit cost declarations and "when to revisit" conditions.

| Field | Value |
|-------|-------|
| `status` | `active` |
| `veracidade` | not present |
| `convicção` | not present |

**Note:** This file has no `veracidade`/`convicção` at the file or premise level — an ontology violation given that these are belief documents. The premises are purely strategic bets with no experimental grounding. No falsification tests are named.

---

### `vault/premise/agent-dispatch-premises.md`

**Topic:** Working assumptions governing when, how, and with what model subagents are dispatched (dispatch threshold, model-tier selection, parallelization independence, single-message fan-out, gate-before-fan-out, briefing contract quality, trust-but-verify, recursion budgeting, no dispatch without strategy, strategy grading).

**Asserts:** 10 named premises (P-AD-1 through P-AD-10) with `convicção`/`veracidade` per premise and explicit falsification tests.

| Field | Value |
|-------|-------|
| `status` | `exploratory` |
| `veracidade` | `medium` (file-level) |
| `convicção` | `high` (file-level) |

**Notable:** This is the newest premise file (created 2026-05-02). P-AD-3, P-AD-4, P-AD-5, P-AD-6, P-AD-7 are `veracidade: high` (grounded mechanically or by POC). P-AD-10 is the most speculative: `convicção: medium / veracidade: low` — no grades collected yet.

---

## 3. Catalog of Existing Constitutions

### `vault/constitution/development-practices-constitution.md`

**Topic:** Enforceable rulebook for all development work — domain purity, deterministic pipelines, SLA, use-case orchestration, repository isolation, agent autonomy rules, testing expectations.

**Summary:** Governs code architecture across every engineer and agent.

| Field | Value |
|-------|-------|
| `status` | `active` |
| `veracidade` | `high` |
| `convicção` | `high` |

**Derives from:** `system-premises.md` (P-SYS-1, P-SYS-3, P-SYS-7). Has a `derives-from` edge to `system-axioms.md`.

**Premise chain:** Traceable. AX-SYS-1/AX-SYS-2 → system-premises → this constitution.

---

### `vault/constitution/event-system-constitution.md`

**Topic:** Obligations, prohibitions, and contracts for the event system — append-only log, registered event types, stream hierarchy, actor typing, idempotency, fail-open logging, deterministic hashes.

**Summary:** Governs every component's participation in the audit/observability layer.

| Field | Value |
|-------|-------|
| `status` | `consolidated` |
| `veracidade` | `high` |
| `convicção` | `high` |

**Derives from:** AX-SYS-4 (immutability) and AX-SYS-5 (observability) explicitly named in `system-axioms.md` connections. Also P-SYS-9, P-SYS-10, P-SYS-11.

**Premise chain:** Fully traceable. This is the vault's clearest example of the complete chain: axiom → premise → constitution.

---

### `vault/constitution/folder-structure-constitution.md`

**Topic:** Enforceable folder structure rules — three-layer architecture (infrastructure/domains/shared_services), screaming architecture, domain isolation, dependency injection, acyclic imports.

**Summary:** Governs where every file belongs and how layers communicate.

| Field | Value |
|-------|-------|
| `status` | `consolidated` |
| `veracidade` | `high` |
| `convicção` | `high` |

**Derives from:** P-SYS-1 (domain isolation) and P-SYS-5 (ontological boundaries as hypotheses) in connections. AX-SYS-3 (folder structure as business hypothesis) is the axiom root.

**Premise chain:** Fully traceable.

---

### `vault/constitution/robot-talks-constitution.md`

**Topic:** Rules governing multi-agent parallel investigation for complexity reduction — the three phases (scope, execution, synthesis), bounded scope requirement, synthesis as tension discovery, human gate.

**Summary:** Operationalizes the robot-talks pattern as a repeatable governance contract.

| Field | Value |
|-------|-------|
| `status` | `active` |
| `veracidade` | not present |
| `convicção` | not present |

**Derives from:** `robot-talks-premises.md` (8 premises). The premises file exists and is well-evidenced.

**Premise chain:** Traceable. Premises → constitution. The constitution reproduces the premises inline, which creates some duplication with `robot-talks-premises.md`.

---

### `vault/constitution/frontend-constitution.md`

**Topic:** Enforceable patterns for React frontend development — context reservation for auth/session only, API as source of truth for mutations, presentational components never fetch.

**Summary:** Governs how every new frontend page or component is built.

| Field | Value |
|-------|-------|
| `status` | `active` |
| `veracidade` | not present |
| `convicção` | not present |

**Derives from:** `frontend-axioms.md` and `frontend-premises.md` explicitly.

**Premise chain:** Traceable at the axiom level (React paradigm constraints) and premise level (product strategy bets). The connection is explicit in the document.

---

### `vault/constitution/commit-message-constitution.md`

**Topic:** Enforceable rules for all commit messages — type prefix, subject line format, body requirements, file listing, test description, document reference.

**Summary:** Governs commit history quality for both humans and agents.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | not present |
| `convicção` | not present |

**Derives from:** `development-practices-constitution.md` (inherits governance process).

**Premise chain:** This constitution does NOT trace to a specific premise. It derives from another constitution, not from a premise or axiom. It is a **stylistic governance convention** — a formatting rule — rather than an application of a tested empirical belief. This is a tension case for the model (see Section 7).

---

### `vault/constitution/domain-tagging-constitution.md`

**Topic:** Mandatory rules for annotating code with `@biz` and `@sys` tags, maintaining dictionary entries, structuring dictionaries for the extraction pipeline, edge vocabulary, automated enforcement.

**Summary:** Governs the bridge between domain vocabulary and code.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | not present |
| `convicção` | not present |

**Derives from:** `domain-tagging-discovery.md` (external to vault, referenced via path). Also references `ontology-conventions.md` in alignment.

**Premise chain:** Traces to a discovery (not yet promoted to premise or axiom). The discovery is the intellectual parent; no premise exists that stands between the discovery and this constitution. This is another tension case.

---

### `vault/constitution/ontology-constitution.md`

**Topic:** Foundational constitution of the vault itself — intellectual traditions (Zettelkasten, Evergreen Notes, Bayesian Epistemology), purpose of the vault as a knowledge graph, DRY principle applied to documents.

**Summary:** Explains what the vault is and why it exists. Sets the philosophical register.

| Field | Value |
|-------|-------|
| `status` | `consolidated` |
| `veracidade` | not present |
| `convicção` | not present |

**Derives from:** No explicit `derives-from` edges to premises or axioms. This is a **meta-narrative document** — it grounds the intellectual traditions but does not itself derive from a testable premise. This is the purest example of a constitution that exists independently of the premise chain (see Section 7 tension).

---

## 4. Catalog of Existing Discoveries

### `vault/discovery/scope-and-domain-axes.md`

**Topic:** Design space for splitting the overloaded `layer` field into two cleaner axes (`scope` and `domain`) for a universal-domain vault.

**Summary:** Maps decisions taken, alternatives rejected, and open questions (OQ-1 through OQ-4) ahead of a research wave.

| Field | Value |
|-------|-------|
| `status` | `exploratory` |
| `veracidade` | `low` |
| `convicção` | `high` |

**Note:** This is the canonical discovery that commissioned the T1-T4 + SYNTHESIS research wave. It is a proper discovery: explores possibility space without prescribing action. The intended successor is an `implementation-plan`.

---

### `vault/discovery/agents-strategy.md`

**Topic:** Design space for the agents-strategy concept — when dispatch is allowed, model selection rules, token budgets, gating, grading.

**Summary:** Records decisions from the 2026-05-02 session, alternatives considered, and open questions before the constitution and skill are drafted.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `low` |
| `convicção` | `high` |

**Note:** Two nearly identical files exist: `vault/discovery/agents-strategy.md` and `vault/discovery/agents-strategy-rules/agents-strategy.md`. This is a potential AX-ONT-3 violation (unique node contribution): two documents may be redundant. The `-rules/` subfolder version is a near-duplicate.

---

### `vault/discovery/agents-strategy-rules/agents-strategy.md`

**Topic:** Same as above — agents-strategy discovery (appears to be a duplicate or near-duplicate of the root-level file).

**Summary:** Near-identical content to `vault/discovery/agents-strategy.md`.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `low` |
| `convicção` | `high` |

**Note:** Should be investigated for merger or explicit differentiation. If one supersedes the other, a `supersedes` edge should be declared.

---

### `vault/discovery/research/T1-empirical-history.md`

**Topic:** Empirical history of hierarchical taxonomies (Linnaeus, MeSH, DDC/LCC, Wikipedia categories) — what triggered level changes, governance process, losses during redesign, antipatterns.

**Summary:** Research output for OQ-1 (domain axis structure) and OQ-3 (growth rules), surveying four real-world taxonomies.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `medium` |
| `convicção` | `low` |

---

### `vault/discovery/research/T2-upper-ontologies.md`

**Topic:** Survey of upper ontologies (BFO, DOLCE, SUMO, Cyc, schema.org, WordNet) and whether any provide a defensible reference for the vault's `scope` axis or upper `domain` levels.

**Summary:** Research output for OQ-4, evaluating which upper-ontology distinctions survived 20+ years of use.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `medium` |
| `convicção` | `low` |

---

### `vault/discovery/research/T3-tree-dag-lattice.md`

**Topic:** Structural commitment for the `domain` axis — tree vs. DAG vs. lattice, surveying OBO Foundry, Wikidata, Formal Concept Analysis, ontology-alignment failures.

**Summary:** Research output for OQ-1, recommending a structural commitment for the vault's domain taxonomy.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `medium` |
| `convicção` | `low` |

---

### `vault/discovery/research/T4-growth-governance.md`

**Topic:** Governance of taxonomy growth — split/merge/promote/retire rules derived from six real-world governance processes (Wikidata, OBO Foundry, ACM CCS, JEL, MSC, schema.org).

**Summary:** Research output for OQ-3, distilling four growth operations for the vault's `domain` axis.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `medium` |
| `convicção` | `low` |

---

### `vault/discovery/research/SYNTHESIS.md`

**Topic:** Synthesis of T1-T4 findings — convergent findings (multi-parent problem, top-level regret, provenance-preserving retirement), five-operation growth rule set, structural commitment for `domain`, OQ resolutions (OQ-1 through OQ-4), application-graph framing.

**Summary:** Intended as the direct input to constitution amendments that implement the `scope`/`domain` split.

| Field | Value |
|-------|-------|
| `status` | `draft` |
| `veracidade` | `medium` |
| `convicção` | `high` |

**Note:** The mixed confidence profile (`veracidade: medium` from individual agents, `convicção: high` from the synthesis framing) is coherent: the team is betting on implementing these recommendations even before all T1-T4 findings are fully evidenced.

---

## 5. Reclassification Candidates Under the New Model

The proposed epistemic chain adds `research` as a distinct node type that sits below `discovery`. Under this model:

### T1-T4 + SYNTHESIS.md → `node_type: research`

| File | Current type | Proposed type | Justification |
|------|-------------|---------------|---------------|
| `vault/discovery/research/T1-empirical-history.md` | `discovery` | `research` | Pure empirical survey with no design decision yet. It does not map a possibility space for action — it gathers raw evidence to inform one. |
| `vault/discovery/research/T2-upper-ontologies.md` | `discovery` | `research` | Survey of external ontologies, no design commitment made. Feeds `scope-and-domain-axes.md` which is the actual discovery. |
| `vault/discovery/research/T3-tree-dag-lattice.md` | `discovery` | `research` | Structural survey. Its recommendations are inputs to `SYNTHESIS.md`, not a design decision itself. |
| `vault/discovery/research/T4-growth-governance.md` | `discovery` | `research` | Governance process survey. Same pattern as T1-T3. |
| `vault/discovery/research/SYNTHESIS.md` | `discovery` | `research` | Synthesis of raw research. It feeds `scope-and-domain-axes.md` (the actual discovery) with resolved open questions — it is evidence, not exploration. |

---

### Axioms that are actually premises

| File | Axiom | Problem | Proposed type |
|------|-------|---------|---------------|
| `vault/axiom/ontology-axioms.md` (AX-ONT-7) | "Reasoning is navigation; topology can be engineered" | The file itself says: *"We do not treat this as a proven theorem. We treat it as the operating hypothesis."* No external experiment validates it. `veracidade: low`, `status: exploratory`. This is exactly the definition of a premise — an informed bet awaiting evidence. | `premise` |
| `vault/axiom/ontology-axioms.md` (entire file) | All 7 ontology axioms | The whole file carries `veracidade: low` and `status: exploratory`. The axioms are commitments made without external validation. They may be defensible bets, but they do not meet the "well-established principle in the industry/academia" bar for `veracidade: high` required of true axioms. | Consider reclassifying the file as `premise` with the note that some axioms may be promoted after operational evidence accumulates. |
| `vault/axiom/frontend-axioms.md` | A1/A2/A3 | These are genuinely grounded in the React paradigm — React's own documentation and design principles validate them. However the file carries `nature: universal` (not a valid `nature` value) and `status: active` (not `consolidated`). The axioms themselves may be correct, but the metadata is malformed. | Keep `axiom`; fix `nature` value and consider promoting `status`. |

---

### Premises that could be promoted to axiom

| File | Premise(s) | Rationale |
|------|-----------|-----------|
| `vault/premise/robot-talks-premises.md` | P-RT-3, P-RT-6, P-RT-7, P-RT-8 | All four are `convicção: high / veracidade: high` with POC evidence. P-RT-6 ("bounded scope is a precondition") and P-RT-7 ("concerns must not overlap") are structural invariants, not context-sensitive bets. They may be ready for axiom status within the multi-agent investigation domain. |
| `vault/premise/system-premises.md` | P-SYS-6 ("Implied knowledge is lost knowledge"), P-SYS-7 ("Refactoring is the primary mechanism") | P-SYS-6 is `veracidade: high`, has been applied consistently, and maps directly to AX-ONT-4. P-SYS-7 is operationally validated across multiple refactors. Both are closer to axioms than bets. |

---

### Other reclassification flags

| File | Issue | Recommendation |
|------|-------|----------------|
| `vault/discovery/agents-strategy.md` and `vault/discovery/agents-strategy-rules/agents-strategy.md` | Two documents with nearly identical content and metadata. AX-ONT-3 violation. | Merge or declare one as superseding the other with a `supersedes` edge. |
| `vault/sessions/2026-05-02-1646-agents-strategy-discovery.md` | `node_type: discovery` but `is_session: true`. This is not a category error per P-ONT-4, but the `node_type` should reflect the session's epistemic role. The session produced premises and a discovery document — its role is `conceptual` (provenance context) or `discovery` only if its own content is exploratory. | Reclassify as `conceptual` (the session is provenance for the discovery it produced, not itself a discovery). |
| `vault/ontology-architecture-draft.md` | `node_type: conceptual` but describes an architectural blueprint for the vault's agent system. It sits at the boundary between `conceptual` (background context) and `spec` (behavioral description). | Evaluate whether it accurately describes current system behavior; if yes, reclassify as `spec`. |
| `vault/conceptual/epistemic-principles.md` | `node_type: conceptual` — correctly classified. Lookup table of reasoning heuristics. No reclassification needed. | Correct as-is. |

---

## 6. Premises with Accumulating Evidence (Axiom-Promotion Candidates)

### P-RT-6 — Bounded Scope Is a Precondition

**File:** `vault/premise/robot-talks-premises.md`

**Current confidence:** `convicção: high / veracidade: high`

**Evidence in vault:** POC (2026-04-10) demonstrated that all four agents with explicit scope exclusions produced clean synthesis; an early planning attempt with unbounded "frontend agent" created confusion and had to be re-scoped. The evidence is specific, traceable, and the failure case (unbounded scope → synthesis ambiguity) has been observed directly.

**Why it could be promoted:** The claim is structural: *if you cannot state what an agent is NOT investigating, you do not have a robot-talk.* This is not a context-sensitive bet — it is a logical constraint on decomposition quality. It is the kind of claim that, once understood, becomes self-evident. The test for falsification ("unbounded scopes produce equivalent or better synthesis") has never been observed to pass.

---

### P-RT-8 — Fidelity Increases as Information Rises (Traceability Chain)

**File:** `vault/premise/robot-talks-premises.md`

**Current confidence:** `convicção: high / veracidade: high`

**Evidence in vault:** All four tensions from the POC were traced to specific code locations. One finding was excluded from synthesis until traced. The failure mode (opinion aggregation without evidence) has a known cost.

**Why it could be promoted:** The traceability requirement (`evidence → finding → tension → recommendation`) is an information-theoretic necessity, not a style preference. It parallels AX-ONT-4 ("implicit knowledge is lost knowledge") applied to investigation. At `veracidade: high` with concrete POC validation, this is closer to an axiom than a bet.

---

### P-ONT-4 — Sessions Produce Knowledge Classifiable by the Same Labels

**File:** `vault/premise/ontology-premises.md`

**Current confidence:** `convicção: high / veracidade: high`

**Evidence in vault:** "Already applied to ~20 sessions in the vault. All were classified without ambiguity." The falsification condition (a session requiring `node_type: session`) has never been triggered.

**Why it could be promoted:** This premise has the most explicit in-vault evidence of any ontology premise. It has been tested at scale (20 sessions), not just conceptually validated. Promoting it to axiom would mean: *"Sessions are not a special category; the existing node_type vocabulary is sufficient."* This is a stable, tested claim.

---

## 7. Tensions Surfaced by the Proposed Model

### T-1 — Constitutions That Are Not Derived from a Premise

The proposed chain (`research → discovery → premise → axiom`) implies constitutions are derived from premises. But surveying the actual constitutions, several do not trace to a premise at all:

**`vault/constitution/commit-message-constitution.md`** is a formatting convention. Its rules (use imperative mood, max 72 chars, include a body) are stylistic governance, not applications of an empirically tested belief. There is no premise that says "imperative-mood commit messages reduce bugs at a measured rate." The constitution derives from another constitution (`development-practices-constitution.md`) — it is a rule derived from a rule, not a rule derived from evidence.

**`vault/constitution/ontology-constitution.md`** is a meta-narrative. It explains the intellectual traditions (Zettelkasten, Evergreen Notes, Bayesian Epistemology) that inspired the vault's design, but it does not apply a tested premise. It is philosophy-grounding, not evidence-grounding.

**Implication for W1:** The chain needs to account for two classes of constitutions: (a) empirically grounded constitutions that trace to premises (`event-system-constitution.md`, `folder-structure-constitution.md`, `development-practices-constitution.md`) and (b) stylistic/meta-narrative constitutions that trace to design philosophy or other constitutions, not to testable premises. The model should not require all constitutions to derive from premises — or it must distinguish these two classes.

---

### T-2 — Audit Findings That Do Not Generate a Discovery

The proposed chain includes `audit → discovery` (audits feed back into the cycle by spawning new discoveries). But the vault currently contains no `node_type: audit` documents. What does exist is evidence scattered in premise files: the agents-strategy discovery references an audit pass (reconnaissance grep), the robot-talks POC functions as an audit of a cross-layer design, and `ontology-architecture-draft.md` describes the agent framework but has no audit counterpart.

The question is: are audit findings always discoveries, or can they be `research`? An audit that finds "these 20 tests fail" produces a finding that is raw evidence — more like `research` than `discovery`. Only if the audit finding requires exploring a solution space does it become a `discovery`. The chain's handling of audits needs finer grain.

---

### T-3 — Where Do `essay` and `conceptual` Documents Sit in the Chain?

**`conceptual`:** `vault/conceptual/epistemic-principles.md` is a lookup table of reasoning heuristics. It is not derived from a premise, does not generate a discovery, and does not inform an axiom. It is background context that is orthogonal to the chain. It provides the thinking tools that help humans and agents choose between options — but it doesn't participate in the epistemic lifecycle.

**`essay`:** No `essay` documents exist in the vault yet, but the ontology conventions define them as "committed arguments from lived experience" with authorial voice. Essays are explicitly not exploratory (too committed) and not operational (no enforcement power). Under the proposed chain, essays don't fit anywhere: they are not research (no survey method), not discoveries (no possibility space mapping), not premises (no falsification test), and not axioms (not foundational). They are a separate epistemic register entirely.

**Implication for W1:** The chain is not the complete picture. `conceptual` and `essay` documents are *orthogonal* to the chain — they provide context, background, and committed arguments, but do not participate in the maturation lifecycle. The discovery should acknowledge this and position the chain as covering *belief documents* while leaving room for non-belief documents that serve other roles.

---

### T-4 — The Ontology Axioms File Is Its Own Refutation

`vault/axiom/ontology-axioms.md` carries `veracidade: low` and `status: exploratory`. AX-ONT-1 asserts that the classification system should minimize retrieval entropy. AX-ONT-2 asserts labels must be orthogonal. Yet the file that makes these assertions has not itself been validated (low veracidade). The foundational axioms of the classification system are — by the system's own confidence metrics — unproven.

This is not a fatal flaw: the file explicitly names AX-ONT-7 as a "working hypothesis" and acknowledges the circularity. But the proposed epistemic chain must account for the possibility that axioms start as premises. The chain `premise → axiom` implies a promotion pathway. What does it take to promote `ontology-axioms.md` from `exploratory / veracidade: low` to the evidence levels expected of axioms?

---

### T-5 — The Session Document Classification Problem

`vault/sessions/2026-05-02-1646-agents-strategy-discovery.md` has `node_type: discovery` and `is_session: true`. This is technically valid per P-ONT-4. But it creates a tension: the session's content is a summary of decisions made, not an exploration of a possibility space. A session that records what was decided is closer to `conceptual` (provenance context) than `discovery` (exploration). The proposed chain needs to clarify whether session documents participate in the chain at all, or whether they are provenance records that sit alongside it.

---

## 8. Recommendations for W1

The following are concrete examples W1 should weave into the discovery to make the epistemic chain tangible. Each includes the file path and the reason it is a good illustrative example.

### R1 — The canonical full chain

**File:** `vault/axiom/system-axioms.md` → `vault/premise/system-premises.md` → `vault/constitution/event-system-constitution.md`

**Why:** This is the cleanest three-step chain in the vault. AX-SYS-4 (immutability) grounds P-SYS-9 (lifecycle trees) which grounds the event-system constitution's Rule 1 (append-only log). Every link has an explicit `derives-from` edge. This is the vault's best example of the model working as intended.

---

### R2 — The strategic-bet axiom as a model failure case

**File:** `vault/axiom/ontology-axioms.md` (AX-ONT-7)

**Why:** The file acknowledges AX-ONT-7 is "the operating hypothesis that makes engineering the topology worth doing at all" — explicitly not a proven theorem. With `veracidade: low` and `status: exploratory`, this is a premise misclassified as an axiom. It is the vault's clearest example of the classification ambiguity the epistemic chain is meant to resolve. W1 should use it as the motivating case: *"We need a `premise` type precisely to distinguish AX-ONT-7 from AX-SYS-4."*

---

### R3 — The research-to-discovery handoff

**Files:** `vault/discovery/research/T1-empirical-history.md` → `vault/discovery/research/SYNTHESIS.md` → `vault/discovery/scope-and-domain-axes.md`

**Why:** T1-T4 gather raw evidence (surveys of external systems). SYNTHESIS aggregates and resolves that evidence. `scope-and-domain-axes.md` is the actual discovery that maps the design space. This three-document sequence is the vault's best example of why `research` and `discovery` deserve to be distinct types: the T-reports are not exploring design possibilities — they are gathering evidence to inform the exploration.

---

### R4 — The high-evidence premise as axiom-promotion candidate

**File:** `vault/premise/robot-talks-premises.md` (P-RT-6, P-RT-8)

**Why:** Both premises are `convicção: high / veracidade: high` with specific POC evidence and named failure modes. They illustrate the promotion pathway in the chain: a premise that survives falsification tests, accumulates specific evidence, and generalizes beyond its origin context is a candidate for axiom. W1 can use them to make the `premise → axiom` transition concrete.

---

### R5 — The constitution without a premise (stylistic governance)

**File:** `vault/constitution/commit-message-constitution.md`

**Why:** This constitution has no discoverable premise ancestor. Its rules are formatting conventions, not applications of empirically tested beliefs. It derives from another constitution (`development-practices-constitution.md`). This is a real case where the `research → discovery → premise → axiom` chain does not apply, and W1 should acknowledge this class of document explicitly rather than forcing all constitutions into the chain.

---

### R6 — The two-document redundancy as an AX-ONT-3 violation

**Files:** `vault/discovery/agents-strategy.md` and `vault/discovery/agents-strategy-rules/agents-strategy.md`

**Why:** Two documents with nearly identical content violate AX-ONT-3 (unique node contribution). This is a live case of what happens when the classification system is not enforced consistently. W1 can use it to illustrate why the chain must include admission criteria at each level — not just a taxonomy.

---

### R7 — The session-as-provenance pattern

**File:** `vault/sessions/2026-05-02-1646-agents-strategy-discovery.md`

**Why:** This session document has `is_session: true` and `node_type: discovery`. P-ONT-8 mandates that sessions which generated higher-level documents must be kept permanently as provenance. This file shows the session's role: it did not itself explore a design space — it produced `vault/premise/agent-dispatch-premises.md` and `vault/discovery/agents-strategy.md`. The session is provenance for those documents, not a discovery in its own right. This is a good case for the chain's handling of session documents.

---

### R8 — The well-evidenced premise cluster

**File:** `vault/premise/robot-talks-premises.md` (the whole file)

**Why:** This is the vault's most operationally validated premise file. Seven of eight premises are `veracidade: high` with a named POC, specific evidence bullets, and falsification tests that have not been triggered. It shows what a "mature premise" looks like — enough evidence to approach axiom status but still carrying the bet character because the domain (multi-agent investigation) is young. W1 can use this as the model for what premises look like at high maturity.

---

### R9 — The circular-reference tension in the ontology layer

**File:** `vault/axiom/ontology-axioms.md` (whole file, `veracidade: low / status: exploratory`)

**Why:** The ontology's own axioms have not been validated by the ontology's own standards. The file that defines what axioms are (`vault/ontology-conventions.md`) says `veracidade: high` for axioms means "tested against reality." But AX-ONT-1 through AX-ONT-7 have `veracidade: low`. This circularity is the vault's deepest structural tension. W1 should name it explicitly: the chain needs a bootstrapping story for how foundational axioms ever achieve `veracidade: high`, since they cannot be tested by experiments derived from themselves.

---

### R10 — The ontology constitution as philosophy-grounding without premises

**File:** `vault/constitution/ontology-constitution.md`

**Why:** This constitution cites Zettelkasten, Evergreen Notes, and Bayesian Epistemology as intellectual foundations. None of these are tested premises in the vault. They are design philosophies that inspired the architecture. This is the clearest case of a constitution that exists orthogonally to the epistemic chain — it is not derived from research, and it is not validated by evidence. W1 should use it to establish that the chain describes one pathway (empirical maturation) while acknowledging that foundational design philosophy enters through a different, deliberative pathway.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/epistemic-chain.md` | `informs` | This survey provides the concrete evidence base for W1's discovery |
| `vault/ontology-conventions.md` | `derives-from` | The node_type definitions used throughout this survey |
| `vault/confidence-levels.md` | `derives-from` | The maturity lifecycle used to assess promotion candidates |
| `vault/axiom/ontology-axioms.md` | `questions` | AX-ONT-7 classification as axiom is challenged by this survey |
| `vault/discovery/research/T1-empirical-history.md` | `contextualizes` | Part of the research wave surveyed here |
| `vault/discovery/research/SYNTHESIS.md` | `contextualizes` | Synthesis document surveyed here |
