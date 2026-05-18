---
tags: [vault, ontology, epistemic-chain, classification, governance]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, reference
status: draft
veracidade: low
convicção: high
version: 0.3.0
last_updated: 2026-05-02
---

# Discovery — The Epistemic Chain of the Vault

> This document defines the full lifecycle through which knowledge is created, classified, validated, and applied inside the vault. It is the epistemic spine of the knowledge graph: without this model, the meaning of every `node_type` label is ambiguous. Any reader — including one who has never seen the vault before — should be able to read this document linearly and arrive at a complete understanding of how knowledge matures here.

---

## Objective

**Question answered:** What is the lifecycle of a piece of knowledge inside the vault — from raw observation to established truth to enforceable rule — and how is each stage classified?

**Who this is for:** Any contributor (human or agent) who creates, promotes, references, or challenges a vault document. It is also the reference for anyone auditing the classification system's coherence.

**How to read it:** Read linearly on first encounter. The Definitions section (§4) is a prerequisite for every subsequent section — terms are defined once there and used without further explanation. After the first read, use the Index for reference.

---

## Index

1. [Context — Why This Discovery Exists](#context--why-this-discovery-exists)
2. [Definitions / Glossary](#definitions--glossary)
3. [The Epistemic Chain](#the-epistemic-chain)
4. [Decisions Taken](#decisions-taken)
5. [Alternatives Considered](#alternatives-considered)
6. [Open Questions](#open-questions)
7. [Connections](#connections)

---

## Definitions / Glossary

Every term used in this document is defined here, once, before it appears in any other section. Cross-references within the vault are noted in parentheses where they help ground the definition in concrete examples.

**Vault** — the structured knowledge graph that stores and classifies all working knowledge for a project. Documents in the vault are not free-form notes; they carry mandatory metadata labels (`node_type`, `status`, `veracidade`, etc.) that determine how each document participates in the system. The vault is the canonical source of truth for both design decisions and the rules that govern those decisions.

**Knowledge graph** — a network of documents connected by typed edges (e.g., `derives-from`, `validates`, `refines`). The graph structure makes relationships between documents explicit and queryable, unlike a flat folder of files. The vault *is* a knowledge graph: every document is a node, and every declared relationship is a directed edge.

**node_type** — a mandatory frontmatter label that classifies what epistemic role a document plays. It answers the question: *"If someone challenges this document, what is the right response?"* It is the most important label in the vault — it determines how a document participates in the graph, how much authority it carries, and what can be built on top of it. The twelve current values include `axiom`, `premise`, `discovery`, `research`, `constitution`, `implementation-plan`, `spec`, and `audit`. (Defined in full in `ontology-conventions.md`.)

**Axiom** — a foundational commitment taken as given. Revising an axiom requires rethinking everything built on top of it. Example: `system-axioms.md` contains `AX-SYS-4 — History is Immutable`, which is the foundation for the event log's append-only design. Axioms are not "facts of the world" — they are structural bets so deeply load-bearing that treating them as revisable would make the system incoherent.

**Premise** — a working bet: an informed hypothesis that guides design decisions but may be disproven by evidence. Every premise carries explicit `veracidade` and `convicção` labels. Example: `ontology-premises.md` contains `P-ONT-5 — Zero mutual information is practically achievable` — a strategic bet the team is acting on before it has been measured. Premises are the vault's hypotheses; they are the stage that exists *between* exploration (discovery) and proof (axiom).

**Discovery** — a document that consolidates a decision session. It captures: the trigger observation, the decision taken, the rationale, the alternatives considered, and the open questions that remain. It is a *crystallization point*, not an exploration log. Example: `scope-and-domain-axes.md` is a discovery that locked in the decision to split the `layer` field into two axes (`scope` and `domain`). A discovery does not explore; it commits to a set of decisions while preserving the audit trail of what was considered.

**Research** — raw, multi-source evidence gathering. Unlike a discovery, a research document does not decide — it surveys, benchmarks, and records findings. Research files are the *input* to a discovery. Example: `vault/discovery/research/T1-empirical-history.md`, `T2-upper-ontologies.md`, `T3-tree-dag-lattice.md`, and `T4-growth-governance.md` are research files that were produced in parallel and then synthesized by the `scope-and-domain-axes.md` discovery. Research is exploratory; discovery is committal.

**Constitution** — an enforceable rule the team has formally ratified. Constitutions are versioned, amended through a governance process, and represent the *application* of one or more premises to produce an enforceable standard. Example: `event-system-constitution.md` (version 2.2.0, status: consolidated) enumerates thirteen numbered rules for how every component must interact with the event log. Constitutions do not make claims about the world; they prescribe behavior.

**Skill** — a transferable pattern or procedure, embodied as an executable or reusable artifact. Like constitutions, skills apply premises. Unlike constitutions, skills are portable — they encode know-how that can be invoked across contexts rather than rules that govern a specific domain. Skills are currently referenced in the vault's cognitive model but do not yet hold a first-class `node_type` value (see OQ-2).

**Implementation-plan** — an actionable execution roadmap with phases, dependencies, and success criteria. It is downstream of a discovery: once a discovery locks in the decisions, an implementation-plan operationalizes them. Example: `scope-and-domain-axes.md` explicitly states it is to be "superseded by an implementation-plan once the open questions resolve."

**Spec** — a behavioral description of how a part of the system currently works. A spec stays in sync with code; when the code changes, the spec is updated. It is downstream of an implementation-plan and is the most concrete, agent-targeted document in the lifecycle.

**Audit** — an evaluative document that assesses the current state of the system against constitutions, axioms, or quality standards. An audit identifies violations, risks, and gaps. Critically, audits generate evidence: a finding that a premise's prediction was correct (or incorrect) is the mechanism that drives `veracidade` up or down.

**Veracidade** — the evidence dimension of confidence. It measures how much external reality confirms a claim: production data, experiments, test results. `veracidade: low` means untested; `veracidade: high` means tested and confirmed. This is determined by reality, not intention. It is the promotion mechanism for moving a premise toward axiom status.

**Convicção** — the commitment dimension of confidence. It measures how hard the team is betting on a claim: how much architecture, hiring, or resource allocation is built around it. `convicção: high` means "we are building around this, even if not yet proven." It is determined by team posture, not evidence. Example: a new premise about which database to use might have `veracidade: low` (untested in production) but `convicção: high` (we already chose it and built around it).

**Status** — the maturity lifecycle position of a document: `draft` → `exploratory` → `active` → `consolidated` → `evergreen`. This is distinct from `veracidade` (which measures evidence) and `convicção` (which measures commitment). A `consolidated` document has been reviewed and survived scrutiny; an `evergreen` document has been approved by formal review with no known contradictions. (Full criteria in `confidence-levels.md`.)

---

## Context — Why This Discovery Exists

### The trigger

The vault's `node_type` catalog lists twelve values. But until this document, no single place explained *how those types relate to each other* — what the path is from a raw finding to a foundational truth, or why `discovery` and `research` are different types rather than one. This created three compounding problems:

1. **The lifecycle was implicit.** Contributors knew that `premise` was "less proven" than `axiom," but there was no explicit model of the path from one to the other, or how `research` and `discovery` fed into the belief chain. → resolved by **D-1** (the epistemic chain is defined as: research → discovery → premise → axiom, with implementation branch from discovery)

2. **Research and discovery were conflated.** Early vault versions used `discovery` to mean both the exploratory phase (gathering evidence, brainstorming) and the consolidation phase (locking in decisions). These are structurally different activities: one is parallel and generative, the other is singular and committal. Conflating them produced documents that were neither rigorous explorations nor accountable decisions. → resolved by **D-2** (research = exploration; discovery = consolidation; they are distinct `node_type` values)

3. **The validation loop was invisible.** It was understood that axioms were "more proven" than premises, but no mechanism was named for how a premise *becomes* an axiom. What is the gate? Who decides? How does evidence from production feed back into the belief system? The loop was real but undocumented. → resolved by **D-3** (premise → axiom promotion is via the `veracidade` axis; audits provide the evidence)

4. **Constitutions appeared to float free of premises.** The vault contained several constitutions (e.g., `event-system-constitution.md`, `commit-message-constitution.md`) that were being updated without explicit reference to the premises they applied. Without a documented model showing that constitutions *apply* premises, there was no enforcement of the derivation chain. → resolved by **D-4** (premises are applied through constitutions and skills; the derivation must be explicit)

5. **The research files in `vault/discovery/research/` had the wrong `node_type`.** The T1–T4 files and the SYNTHESIS file were classified as `node_type: discovery` even though they are exploratory research outputs, not decision documents. Misclassification corrupts the graph: querying for all discoveries would return raw evidence files alongside actual decision records. → resolved by **D-6** (T1–T4 and SYNTHESIS reclassified to `node_type: research`)

---

## The Epistemic Chain

### Overview

The vault's epistemic model defines a progression from raw curiosity to established truth. At each stage, a document plays a different role, carries different authority, and responds differently to challenge. The chain has two branches, joined at the discovery stage.

The following diagram will show the linear chain from research through to axiom.

<!-- W3-MERMAID-LINEAR-CHAIN -->

### Stage 1 — Research

Research is the generative front of the chain. A research document gathers evidence from multiple sources, explores alternatives, benchmarks approaches, and records raw findings. It does not decide. Multiple research documents can run in parallel — each targeting a different dimension of the same question.

The research stage is the only stage in the chain where parallel production is the norm. In practice, this means multiple agents or contributors can each produce a research file simultaneously, with no coordination required beyond agreeing on the question being explored.

**Concrete example:** Before the `scope-and-domain-axes.md` discovery was written, four parallel research files were produced: `T1-empirical-history.md` (how real taxonomies have grown over time), `T2-upper-ontologies.md` (survey of upper ontologies like DOLCE and BFO), `T3-tree-dag-lattice.md` (structural analysis of tree vs DAG vs lattice), and `T4-growth-governance.md` (governance process survey). Each file explored one dimension; together they provided the evidence base for the discovery's decisions.

Research documents are not yet committed to any position. Their `veracidade` may be high (thorough survey) or low (cursory review), but they carry no prescriptive weight. A research file that is contradicted by another research file is not a problem — that is the point. Contradiction at the research stage is signal.

**node_type:** `research` · **Challenge response:** "It's exploration — add more evidence or let a discovery consolidate it."

### Stage 2 — Discovery

A discovery document is the crystallization point. It reads the research, identifies which alternatives were considered, locks in a set of decisions, and records the rationale and consequences for each. After a discovery, the decisions are committed. The vault does not re-litigate them without a new discovery or an explicit superseding document.

Critically, a discovery is *singular*: where research is parallel and generative, discovery is consolidating and accountable. There should be one discovery per question (or one per coherent cluster of related decisions), and it should reference all the research it consumed.

**Concrete example:** `scope-and-domain-axes.md` is a discovery that consumed T1–T4 and the SYNTHESIS file. It produced fourteen decisions (D-1 through D-14), each with explicit status (`settled`, `settled (deferred)`, `pending`). The alternatives section records nine rejected approaches (A-1 through A-10), so future readers do not relitigate them. This is the form a discovery takes.

The discovery stage is also the **hinge point** where the chain bifurcates into two branches: the belief branch (premise → axiom) and the implementation branch (implementation-plan → spec → audit).

**node_type:** `discovery` · **Challenge response:** "It's a decision record — enrich it or supersede it with a new discovery."

### The Bifurcation at Discovery

Every discovery produces two types of outputs: *beliefs* about how the world works (which feed the belief branch) and *prescriptions* for what to do (which feed the implementation branch). These are fundamentally different things and are tracked separately.

The following diagram will show the bifurcation from discovery into both branches.

<!-- W3-MERMAID-BIFURCATION -->

**Belief branch:** A discovery that commits to a belief about the world spawns a `premise`. The premise captures the working bet in explicit form, with `veracidade` and `convicção` labels. It is actionable as a design guideline but explicitly revisable. Example: `scope-and-domain-axes.md`'s D-1 demotes orthogonality from `axiom` to `premise` — the decision that orthogonality is "a strategic bet, not a measured property" is now a `premise` in `ontology-premises.md` with `veracidade: low` (unmeasured) and `convicção: high` (we are building around it). That is a premise.

**Implementation branch:** A discovery that commits to a plan of action spawns an `implementation-plan`. The plan operationalizes the decisions: it lists phases, dependencies, checkboxes, and success criteria. The plan is then implemented, and the result is described in a `spec`. A spec is what the system actually does; it is the most agent-targeted document in the chain.

The two branches are not independent. An implementation-plan derives from a discovery, and the spec that results from the plan is what audits measure against. Audit findings are evidence that feeds back to the belief branch — specifically, they raise or lower the `veracidade` of premises.

### Stage 3a — Premise (Belief Branch)

A premise is a working bet. It is derived from a discovery and represents what the team currently commits to believing — with the explicit acknowledgment that evidence could change that belief. Premises carry both `veracidade` (how much evidence backs the bet) and `convicção` (how hard we are building around it).

The 2×2 formed by `veracidade` and `convicção` produces four archetypes:
- `low veracidade` + `high convicção` → **strategic bet**: we are building around this before it is proven
- `high veracidade` + `high convicção` → **consolidated law**: proven and central to the design
- `high veracidade` + `low convicção` → **ignored fact**: established but not acted on
- `low veracidade` + `low convicção` → **loose thread**: unexplored, not acted on

Most new premises start as strategic bets. Over time, as audits and experiments produce evidence, `veracidade` rises.

**Concrete example:** `P-ONT-5 — Zero mutual information is practically achievable` in `ontology-premises.md` is a strategic bet: `veracidade: low` (we haven't measured it at corpus scale), `convicção: medium` (we are designing toward it but not staking everything on it). Its falsification criterion is explicit: if, when the vault exceeds 100 nodes, label-pair mutual information remains consistently high, the premise is wrong.

### Stage 3b — Implementation-Plan, Spec, Audit (Implementation Branch)

The implementation branch follows a different maturity logic: it is about execution fidelity, not belief. An implementation-plan prescribes steps; a spec describes the current state of the system; an audit measures alignment between the spec and reality.

Audits are the mechanism that closes the validation loop. When an audit finds that a system behaves as the spec predicted, and the spec was derived from a premise, that is evidence that the premise is correct. This evidence feeds back as a `validates` edge from the audit to the premise, raising the premise's `veracidade`.

### Stage 4 — Axiom (The Promotion Target)

An axiom is a premise that has accumulated enough evidence, through audit findings and production validation, to be treated as foundational. The key difference from a premise is the weight of the derivation burden: everything built on a premise is expected to survive revision; everything built on an axiom is not. Revising an axiom is a structural event — it requires rethinking everything derived from it.

Promotion from premise to axiom is not a formal ceremony but a threshold crossing: when `veracidade` rises to `high` — meaning concrete, reproducible, production-backed evidence exists — and when the team's `convicção` is also `high`, the premise can be reclassified as `axiom`. The reclassification itself is a governance decision that should be documented (in a discovery or through a constitution amendment process).

**Concrete example of the full cycle:** Orthogonality was originally stated as `node_type: axiom` in the vault's early ontology. In the 2026-05-02 design conversation recorded in `scope-and-domain-axes.md` (D-1), it was demoted to `node_type: premise` because no corpus-level measurement had been run — the "axiom" was actually an unvalidated heuristic, which is exactly the definition of a premise. Its current state: `premise` with `veracidade: low`, `convicção: high`. If the Bayesian instrumentation layer is eventually built and confirms that mutual information between vault labels is statistically near zero at corpus scale, that evidence would raise `veracidade` to `high`, and orthogonality could be promoted back to `axiom`. That full arc — axiom → demoted to premise → validated by instrumentation → promoted back to axiom — is the epistemic chain in action.

### The Application Layer: Premises Become Rules

Premises do not enforce themselves. A premise is a belief; it only shapes behavior if it is applied. The vault has two application mechanisms: **constitutions** and **skills**.

A constitution is a formally ratified rule set derived from one or more premises. It is the mechanism that turns a belief into enforcement. `event-system-constitution.md` derives from `AX-SYS-4 — History is Immutable` and `AX-SYS-5 — Ambiguity in Observability is a System Failure` — axioms that are also beliefs. The constitution's thirteen rules are the direct application of those beliefs to the event system's behavior.

A skill is a transferable procedure: it packages know-how into a reusable pattern that can be invoked across contexts, rather than a rule that governs a specific domain.

The following diagram will show how premises flow into constitutions and skills.

<!-- W3-MERMAID-APPLICATION -->

The application layer is where the vault's epistemic work becomes operational. Without constitutions and skills, the belief branch (research → discovery → premise → axiom) would produce knowledge that lives in documents but never changes behavior. The application layer is the mechanism that closes this gap.

### The Validation Feedback Loop

The full model, with both branches and the feedback loop, works as follows:

1. **Research** gathers evidence about a question.
2. **Discovery** consolidates the evidence into decisions and spawns two outputs: a **premise** (what we now believe) and an **implementation-plan** (what we will do).
3. The implementation-plan is executed, producing a **spec** (what the system does) and eventually an **audit** (how well the system matches the spec and the constitutions).
4. Audit findings generate evidence. Evidence raises or lowers the `veracidade` of premises via `validates` edges.
5. A premise whose `veracidade` reaches `high` becomes a candidate for promotion to **axiom**.
6. Axioms ground constitutions and skills (the application layer), which produce behavior that generates system outputs, which are observed by future research and audits.

The loop is closed. New observations become research; research becomes discovery; discovery becomes premises and plans; plans become specs and audits; audits validate or invalidate premises; premises become axioms; axioms ground rules; rules shape behavior; behavior generates new observations.

---

## Decisions Taken

### D-1 — The epistemic chain is: research → discovery → (premise → axiom) + (implementation-plan → spec → audit)

**Decision:** The vault's knowledge lifecycle is formalized as a two-branch chain. The primary linear chain is `research → discovery → premise → axiom`. At discovery, the chain bifurcates: the belief branch continues toward premise and axiom; the implementation branch continues toward implementation-plan, spec, and audit. Audits close the loop by feeding evidence back to premises.

**Rationale:** The chain was already implicit in how the vault was being used — `system-axioms.md` derives from the architectural commitments that premises in `system-premises.md` have matured into; `ontology-premises.md` derives from a series of design conversations; constitutions explicitly derive from axioms and premises. Making the chain explicit ensures it can be enforced, queried, and taught.

**Consequence:** Every document in the vault can now be located on the chain. Documents that cannot be located — that have no clear epistemic role — need reclassification. The chain is also the governance model: creating a new axiom without a corresponding discovery is a violation of the chain, not just an informal gap.

**Status:** Settled.

---

### D-2 — Research is a distinct node_type from discovery (research = exploration; discovery = consolidation)

**Decision:** `research` is a first-class `node_type`, distinct from `discovery`. A research document surveys, benchmarks, and gathers evidence without committing to decisions. A discovery consolidates research into committed decisions. They are categorically different epistemic acts.

**Rationale:** The distinction matters for graph integrity. If a query asks "what decisions have been made about the vault's classification system?", it should return discovery documents only — not research files that merely surveyed options. In the early vault, this was conflated: the T1–T4 files in `vault/discovery/research/` had `node_type: discovery` even though they are evidence surveys. This meant a query for discoveries would return raw evidence alongside decision records, corrupting the result. The challenge responses are also different: a research document says "add more evidence or let a discovery consolidate it"; a discovery says "supersede it with a new discovery."

**Consequence:** The twelve `node_type` values in `ontology-conventions.md` must be updated to include `research` as a named, defined value. Existing research files (T1–T4, SYNTHESIS) must be reclassified.

**Status:** Settled. Reclassification is tracked in D-6.

---

### D-3 — Premise → axiom promotion happens via the `veracidade` axis

**Decision:** The gate between premise and axiom is the `veracidade` dimension. A premise with `veracidade: low` or `medium` is a working bet. A premise whose `veracidade` rises to `high` — through audit findings, production evidence, or experimental validation — becomes a candidate for promotion to `axiom`. The promotion is a deliberate governance act, not an automatic reclassification.

**Rationale:** The `veracidade` axis already captures exactly this gradient: untested hypothesis (`low`) → derived from established patterns (`medium`) → tested against reality and confirmed (`high`). No new mechanism is needed. The existing 2×2 confidence matrix names the `low veracidade + high convicção` state "strategic bet" — that is precisely what a new premise is. The `high veracidade + high convicção` state is "consolidated law" — that is precisely what a mature axiom is.

**Consequence:** The promotion threshold is currently informal (see OQ-1). The governance act of reclassifying a premise as an axiom should be documented — either via a discovery document or a constitution amendment. The `validates` edge type is the mechanism for attaching audit evidence to premises.

**Status:** Settled. Promotion threshold is an open question (OQ-1).

---

### D-4 — Premises are applied through constitutions and skills (they do not enforce themselves)

**Decision:** A premise is a belief; a constitution is an enforceable rule derived from that belief. The derivation must be explicit: every belief-derived constitution should declare, in its `Connections` section, the premises or axioms it derives from. Skills follow the same rule for procedural know-how. Norm-only constitutions (per D-7) are exempt from this requirement; they declare `nature: norm` instead.

**Rationale:** Without explicit derivation, constitutions appear to float free — their rules seem arbitrary because the beliefs that justify them are not visible. When orthogonality was treated as an axiom in `ontology-conventions.md`, the rules derived from it (e.g., "each label must carry information no other label provides") were correctly stated but incompletely grounded: a reader couldn't verify whether the rule held by checking the underlying claim, because the underlying claim was buried in the axiom. Making the premise → constitution derivation explicit allows audits to evaluate not just whether rules are followed, but whether the beliefs behind the rules are still sound.

**Consequence:** Existing constitutions that derive from premises or axioms must add explicit `derives-from` edges in their Connections sections. Any constitution that lacks a belief-chain derivation is flagged as governance debt (either it derives from an undocumented premise, or it is a stylistic norm that does not derive from a belief — see OQ-4).

**Status:** Settled.

---

### D-5 — Audits feed evidence back to premises (the validation loop closes here)

**Decision:** An audit document's primary epistemic function is generating evidence. When an audit confirms that a system behaves as predicted by a spec (which was derived from a premise), that finding raises the `veracidade` of the originating premise. The mechanism is the `validates` edge: `audit.md validates premise.md`. When an audit finds violations, it may lower `veracidade` or add `contradicts` edges.

**Rationale:** Without this rule, the audit is a terminal document — it produces findings, but those findings go nowhere in the epistemic system. With this rule, audits are the primary instrument for promoting premises toward axiom status. The chain becomes a loop: research → discovery → premise → ... → audit → (evidence) → premise → axiom. The loop is what makes the vault a living epistemic system rather than a static archive.

**Consequence:** Audit documents must include Connections entries that declare `validates` or `contradicts` edges pointing to the premises whose predictions they are evaluating. This is not optional — an audit without these edges does not close the validation loop.

**Status:** Settled.

---

### D-6 — Existing T1–T4 and SYNTHESIS files reclassified to `node_type: research`; `scope-and-domain-axes.md` remains `node_type: discovery`

**Decision:** The files `vault/discovery/research/T1-empirical-history.md`, `T2-upper-ontologies.md`, `T3-tree-dag-lattice.md`, `T4-growth-governance.md`, and `SYNTHESIS.md` are currently labeled `node_type: discovery` but are research documents by function (they survey evidence and do not commit to decisions). They must be reclassified to `node_type: research`. The `scope-and-domain-axes.md` file correctly holds `node_type: discovery` and requires no change.

**Rationale:** The misclassification was caused by the absence of a `research` node_type at the time those files were created — the only available exploration-adjacent `node_type` was `discovery`. Now that `research` is defined (D-2), the correct classification is available. The reclassification is not a demotion; it is a precision correction. The files' epistemic content is unchanged; only their role in the graph is corrected.

**Consequence:** The `node_type` frontmatter in each of the five files must be updated. Any graph query for all discovery documents will, after reclassification, return only `scope-and-domain-axes.md` from this cluster — which is correct.

**Status:** Settled. Reclassification pending implementation.

---

### D-7 — Constitutions may exist without a premise derivation when they encode team norms

**Decision:** A constitution that expresses a team convention (e.g., a commit-message style, a folder layout preference) is permitted to exist without a `derives-from` edge to a premise. Such constitutions must declare their nature explicitly via a `nature: norm` (or equivalent) frontmatter marker, signaling that the rule is adopted-by-preference rather than derived-from-belief. A future evolution may demote norm-only constitutions to skills (per the user's note that commit-message can become a skill later), but that migration is out of scope for this discovery.

**Rationale:** D-4 mandated derivation chains, but some constitutions are stylistic norms — forcing a derivation manufactures false premises. Explicitly recognizing norm-only constitutions preserves auditability (the `nature: norm` marker is searchable) without forcing fake derivations.

**Consequence:** Existing constitutions like `commit-message-constitution.md` that lack premise derivation are not governance debt — they are norm-classified constitutions. The vault's audit tooling must distinguish "constitution missing derivation" (debt) from "constitution declared as norm" (legitimate).

**Status:** Settled.

---

### D-8 — Axioms are demoted via a discovery document; the orthogonality demotion is the canonical precedent

**Decision:** When an axiom is contradicted by evidence — through audit findings, production data, or recognition that it was always an unmeasured heuristic — its demotion to `premise` (or retirement) is performed by writing a discovery document that records (a) the trigger evidence, (b) the new classification (`premise` with explicit `veracidade` and `convicção`, or retired), (c) the migration consequences for documents that previously derived from it as axiom, and (d) the alternatives considered. The existing demotion of orthogonality from axiom to premise (D-1 of `scope-and-domain-axes.md`) is the canonical precedent and reference template.

**Rationale:** Axiom-level claims carry derivation burden; demoting one cascades to derived documents. A discovery is the only artifact that records the reasoning, alternatives, and consequences with the rigor that decision warrants. Audit findings alone are insufficient because they describe symptoms, not the schema-level governance act of reclassification.

**Consequence:** Audit findings that suggest an axiom is wrong must trigger a discovery rather than a direct frontmatter edit. The discovery → demotion rule mirrors D-14 of `scope-and-domain-axes.md` (discoveries are the only authorized path for schema evolution) — extending the same governance discipline to the demotion direction.

**Status:** Settled.

---

### D-9 — Discovery is canonical; sessions and research feed into it

**Decision:** Discovery documents are the canonical artifact in the epistemic chain. Research files and session logs feed *into* discoveries — they record provenance, evidence, and the reasoning trail — but they do not override the text of the discovery itself. When a session log and a discovery document disagree about the status or content of a decision, the discovery wins; the session log is treated as provenance only. Changing a decision requires editing the discovery document directly. The session log records that the edit happened, but it cannot substitute for the edit.

**Rationale:** Without this rule, the epistemic chain has two competing canons: the discovery (a consolidated decision record) and the session log (an exploratory transcript). Session logs are by their nature time-ordered and conversational — they capture the flow of reasoning, including dead ends and reversals. Treating them as authoritative would mean the "current state" of a decision could only be reconstructed by reading every session in order, which is exactly the failure mode discoveries were introduced to solve (D-2). Promoting the discovery to canonical status keeps the on-disk text as the single point of truth, while preserving session logs in their proper role as the provenance of how the discovery got to its current shape.

**Consequence:** Every "Settled" status in a discovery means "settled on disk in the discovery doc." A decision that exists only in a session log — even if the session declared it resolved — is not yet settled in the chain; it is a pending edit awaiting promotion into a discovery. Audits that check decision status must read discoveries, not sessions. This rule closes OQ-NEW-2 from `vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md` and the T2 tension surfaced in `vault/discovery/robot-talks-definitions/examples/robots-discussing.md` Turn 2.

**Status:** Settled.

---

### D-10 — Premise and axiom are two evidence-states of one claim; promotion is a file move, not a re-authoring

**Decision:** A given epistemic claim has a single identity across its lifecycle. `premise` and `axiom` are not two distinct claims — they are two evidence-states of the same claim. The choice of which `node_type` to assign expresses the claim's current evidential standing; promotion (premise → axiom) or demotion (axiom → premise) reclassifies the same claim and is implemented as a *file move* between the corresponding folders (`vault/premise/<slug>.md` ↔ `vault/axiom/<slug>.md`), not as the creation of a new document.

The discovery that authorizes the reclassification (per D-3 for promotion, D-8 for demotion) is the governance record. The file move is the *mechanical consequence* of that decision. Frontmatter changes (`node_type`, `veracidade`) and any tooling reindex follow the move; they do not substitute for it.

**Rationale:** D-3 framed promotion as a `veracidade` threshold crossing; D-8 framed demotion as a discovery-driven governance act; neither stated how the on-disk artifact transitions. The two natural answers — "same file, frontmatter edit" vs "new file, old file retired" — have load-bearing consequences. Same-file-with-frontmatter-edit silently changes the claim's `node_type` without any folder signal and breaks the folder-as-stratification discipline the fractal-folder lens depends on. New-file-with-retirement fragments the git history of a single claim across two files and forces every inbound edge to be retargeted under a "claim was X, now Y" lookup table. Naming this explicitly — *one claim, identity preserved across a move* — keeps the folder layer honest (each folder still cleanly partitions by evidence-state) while preserving the audit trail (the move is one commit per reclassification, attributable to the authorizing discovery).

This decision also closes a latent gap in the chain: a reader could otherwise interpret D-3 as license to edit a premise file's `node_type` to `axiom` in place, which would leave the file living under `vault/premise/` while declaring itself an axiom — a path/content drift the frontmatter-ownership constitution and any future fractal-layout validator would flag as inconsistent.

**Consequence:**

- The promotion/demotion operation is a single git commit that (a) moves the file between `vault/premise/` and `vault/axiom/`, (b) updates frontmatter (`node_type`, `veracidade`), and (c) cites the authorizing discovery in the commit message and in the file's `Connections`.
- The slug should be preserved across the move when possible, so the claim's identifier is stable (only the folder changes).
- Inbound edges (`derives-from`, `validates`, `contradicts`, etc.) become a real problem: a `derives-from` edge whose target was `vault/premise/foo.md` is broken the moment `foo.md` moves to `vault/axiom/foo.md`. The resolution mechanism is the subject of OQ-6.
- Tooling (`vault_ctl`, retrieval indexes, snapshot pipelines) must treat the move as a *rename event*, not a delete + create — the claim's history continues across the move.

**Status:** Settled (claim-identity rule). Edge-target resolution mechanism deferred to OQ-6.

---

## Alternatives Considered

### A-1 — Keep `discovery` to mean both exploration and consolidation

**Alternative:** Do not distinguish research from discovery; treat all pre-decision exploration as `node_type: discovery` regardless of whether it commits to decisions.

**Rejection reason:** This was the status quo, and it produced the misclassification problem described in D-2 and D-6. Conflating the two roles means graph queries cannot distinguish "what have we decided?" from "what have we considered?" — a fundamental epistemic distinction. The challenge responses are different: "enrich or supersede this exploration" (research) versus "supersede this with a new discovery" (discovery). Conflating them collapses the chain at its most generative stage.

---

### A-2 — Treat premise and axiom as the same node_type

**Alternative:** Merge `premise` and `axiom` into a single `belief` type, differentiated only by `veracidade` level.

**Rejection reason:** The validation gate between premise and axiom is not just a `veracidade` threshold — it is a structural commitment. An axiom carries derivation burden: everything built on it is expected to remain stable. A premise does not carry this burden; it is explicitly revisable. Merging them would eliminate the ability to say "this is foundational — changing it breaks derived documents." The challenge responses are categorically different: "show me evidence and we'll update it" (premise) versus "that's foundational — revisiting it breaks everything built on it" (axiom). These are different roles, not different maturity levels of the same role.

---

### A-3 — Skip premise; go from discovery directly to axiom

**Alternative:** After a discovery locks in a decision, immediately classify the resulting belief as an `axiom`, skipping the premise stage.

**Rejection reason:** Skipping premise eliminates the strategic-bet phase, which is the most important phase for new and unvalidated beliefs. A belief that has just been committed to in a discovery session has `veracidade: low` (untested) and `convicção: high` (we are building around it) — which is exactly what the 2×2 matrix names "strategic bet." Classifying it as an axiom would imply foundational certainty that doesn't exist yet. The orthogonality demotion in `scope-and-domain-axes.md` (D-1) is a concrete example of what goes wrong when this gate is skipped: orthogonality was an axiom (foundational certainty) before it was proven, which created false rigor and baked an unvalidated heuristic into evergreen documents.

---

### A-4 — Keep `research` as a folder convention but not a `node_type`

**Alternative:** Use the `vault/discovery/research/` folder to signal "these are research files" rather than introducing a new `node_type` value.

**Rejection reason:** The vault's governing principle (P-ONT-6 in `ontology-premises.md`) is that frontmatter is the single source of truth. Folder location is not classification; it is storage. A file's `node_type` determines its epistemic role and how it participates in graph queries. If `node_type` remains `discovery` for research files, every graph query for decisions will incorrectly include them. The folder convention would require readers to know to look at the path — invisible to agents querying by frontmatter. `node_type` carries the epistemic role; folder carries the storage location. These are orthogonal, and the role must be explicit.

---

### A-5 — Model the chain as flat types with no implied ordering

**Alternative:** Define `research`, `discovery`, `premise`, `axiom`, `implementation-plan`, `spec`, `audit` as a flat set of independently defined document types with no formal chain or ordering between them.

**Rejection reason:** The chain is not an arbitrary organizational preference — it maps real epistemic dependencies. A spec without a derivation from a discovery has no design rationale. A premise without a derivation from a discovery has no crystallization point. An axiom without a derivation from a validated premise has no evidence trail. The chain enforces that each type's authority is grounded in the types below it. Flattening it would allow — and normalize — documents that float free of their epistemic foundations, which is exactly the "governance debt" problem D-4's consequence flags.

---

### A-6 — Make `veracidade` a property of the chain level, not of individual documents

**Alternative:** Instead of attaching `veracidade` to each document, define it as an intrinsic property of the `node_type` level (e.g., axioms are always `high`, premises are always `low`).

**Rejection reason:** This conflates the role of a document with its current evidential state. A new axiom can be `status: draft` — it is proposing a foundational commitment that hasn't been reviewed yet. A premise can have `veracidade: high` if it was immediately validated by production evidence. The decoupling of `node_type` (role, which is fixed) from `veracidade` (evidence level, which changes) is one of the three-way distinctions the vault draws explicitly in `ontology-conventions.md`: "An axiom stays an axiom whether it's `draft` or `evergreen`. Trust levels are captured by `status`, `veracidade`, and `convicção`."

---

## Open Questions

### OQ-1 — Threshold for premise → axiom promotion

**Question:** When exactly does `veracidade` cross from `medium` to `high` enough to warrant reclassification from `premise` to `axiom`? The current criteria for `veracidade: high` are: "tested against reality: production data confirms it, experiments validate it, or it matches external authoritative sources. You can point to concrete evidence." But for a specific premise, what counts as "concrete evidence"? Is one successful deployment sufficient? Two experiments? A formal measurement at corpus scale?

**Why it matters:** Without a threshold, the promotion decision is fully discretionary, which means it is subject to motivated reasoning — the team might promote a convenient premise early or defer a politically complicated one indefinitely. The threshold is a governance boundary.

**Bridge rule (interim):** Until instrumentation lands, premise → axiom promotion is a qualitative governance judgment recorded in a discovery document. The proposing discovery must cite (a) at least one audit cycle whose findings confirmed predictions derived from the premise, (b) no contradicting audits in the prior review window, and (c) explicit acknowledgment that the threshold is judgment, not measurement. This is a discipline, not a measured rule, until the Bayesian instrumentation layer lands.

**Status:** Deferred — pending corpus-measurement instrumentation.

---

### OQ-2 — Skills as a `node_type`

**Question:** Skills are mentioned in the epistemic chain as one of the two application mechanisms for premises (alongside constitutions). But `skill` is not currently a first-class `node_type` in `ontology-conventions.md`. Should it be?

**Arguments for:** Skills play a distinct epistemic role — they encode portable, reusable procedures, unlike constitutions (which are domain-specific enforceable rules). The challenge response would be different: "apply this skill or improve the procedure," not "change it through governance." Omitting `skill` from `node_type` means skills cannot be queried, linked, or classified with the same precision as constitutions.

**Arguments against:** Skills may be adequately captured by `node_type: constitution` with `nature: procedural`. Adding a new `node_type` value should pass the orthogonality admission test: is there information about a skill that cannot be recovered from `constitution` + existing labels? This requires examination of real vault skills before deciding.

**Status:** Open.

---

### OQ-3 — Multi-source research

**Question:** Can a single discovery have multiple research files as inputs? What does the relationship look like in the graph? Is there a ceiling on how many research files a single discovery can consume? And what is the minimum — can a discovery be written without any research input?

**Why it matters:** The T1–T4 + SYNTHESIS pattern in `scope-and-domain-axes.md` is a concrete example of multi-source research feeding one discovery. The relationship is currently expressed as `derives-from` edges (the discovery declares `derives-from` each research file). But the SYNTHESIS file complicates this: it synthesizes the T1–T4 files into a consolidated summary, which the discovery then reads. This is a two-level derivation chain (research → synthesis → discovery). Should synthesis files be their own `node_type`? Or is SYNTHESIS itself a `node_type: research` file that aggregates?

**Note:** Partially addressed by the research consolidation pass on 2026-05-02; the consolidated file pattern is the working answer until a more general rule is needed.

**Status:** Open.

---

### OQ-4 — Constitutions not derived from premises

**Question:** Some constitutions may be purely stylistic norms, not the application of a belief about the world. For example, a commit-message convention (`commit-message-constitution.md`) might be: "we use conventional commits because it's a widely adopted standard" — a norm, not a premise. Should such constitutions be required to declare a premise derivation? Or is it acceptable for some constitutions to derive from nothing more than "this is the convention we adopted"?

**Why it matters:** D-4 requires every constitution to declare its derivation chain. But if some constitutions are norms rather than applied beliefs, requiring a premise derivation would force false derivations — linking a commit convention to some stretched premise about knowledge organization. The honest classification might be: "this constitution derives from a team preference, not a belief about the world." The vault's model needs to accommodate this gracefully.

**Status:** Resolved — see D-7. Norm-only constitutions are admitted explicitly with `nature: norm`.

---

### OQ-5 — Demotion path for axioms

**Question:** If an axiom is contradicted by evidence — not just "challenged" but actually falsified — what is the path back? The chain as defined runs upward (premise → axiom). The demotion direction (axiom → premise, or axiom retirement) is not formally specified. The `confidence-levels.md` document notes that "downgrade is possible and expected" for `status`, but says nothing about `node_type` demotion.

**Concrete precedent:** Orthogonality was demoted from `axiom` to `premise` via a discovery decision (D-1 of `scope-and-domain-axes.md`). That demotion happened through a governance act — a discovery document recorded the decision. Should this be the canonical path? Is a discovery document always required to demote an axiom? Or can an audit finding trigger demotion directly?

**Status:** Resolved — see D-8. Demotion is via discovery; orthogonality demotion in `scope-and-domain-axes.md` D-1 is the canonical precedent.

---

### OQ-6 — Edge-target identity across promotion/demotion moves

**Question:** D-10 establishes that promotion/demotion is a file move between `vault/premise/<slug>.md` and `vault/axiom/<slug>.md`. The move breaks every inbound path-based edge to the claim. What is the canonical resolution mechanism — and is the resolution permanent (target shape is path-stable) or maintenance-based (a rewrite pass runs at move time)?

**Why it matters:** D-1 of `scope-and-domain-axes.md` already executed one such demotion (orthogonality, axiom → premise). At today's vault size, manual link rewriting is tractable. As the vault grows and more claims promote/demote, an unsolved edge-resolution model produces silent broken edges, partial rewrites, or rotting `Connections` tables — all of which degrade the graph's integrity faster than they are noticed.

**Three candidate resolutions:**

(a) **Stable claim-id with path resolution.** Each claim carries a stable identifier in frontmatter (a slug, a UUID, or the existing slug treated as identifier). Edges target the claim-id, not the path. A lookup layer (frontmatter index, `vault_ctl` query) resolves identifier → current path at read time. Moves are free at the edge level; the cost is the indirection layer and the requirement that no two claims (even across `premise/` and `axiom/`) collide on identifier.

(b) **Path-based edges with mandatory rewrite pass.** Edges continue to target paths. Every promotion/demotion commit must include a sweep that rewrites all inbound edges and `Connections` references to the new path. The cost is the rewrite tool and the discipline of running it; the benefit is that edges remain locally readable in any document without an indirection layer.

(c) **Accept breakage as governance signal.** Treat the rewrite as manual curation work attached to the authorizing discovery. The broken edges become a checklist that the discovery's author resolves explicitly. Cost: human cycles per move, and risk of partial coverage. Benefit: no tooling investment; the discipline is visible.

**Interim rule:** Until this resolves, demotion/promotion authors must (i) list all inbound edges in the authorizing discovery's `Consequence` section, (ii) rewrite them by hand in the same commit as the move, and (iii) leave a note in the moved file's `Connections` recording the prior path. This is option (c) by default, with an upgrade path to (a) or (b) once `vault_ctl` lands.

**Status:** Open.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [scope-and-domain-axes.md](scope-and-domain-axes.md) | `derives-from` | This discovery extends the meta-classification work begun in scope-and-domain-axes; D-1 of that discovery (orthogonality demotion) is a concrete example of the epistemic chain in action. |
| [ontology-conventions.md](../../ontology-conventions.md) | `refines` | This discovery proposes amendments: adding `research` as a named `node_type` value and clarifying the epistemic chain model for the existing `node_type` definitions. |
| [confidence-levels.md](../../confidence-levels.md) | `derives-from` | The `veracidade` axis defined there is the promotion mechanism for premise → axiom (D-3); the `status` lifecycle informs the maturity model of the chain. |
| `research/epistemic-chain-evidence-survey.md` | `derives-from` | The parallel evidence survey by W2 (running in parallel with this draft — file may not yet exist at time of writing; forward-reference declared). |
| `vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md` | `created-by` | Session that surfaced OQ-NEW-2 (discovery vs session canonicity); D-9 records the resolution on disk. Replaces deprecated `provenance-for` per ontology-conventions Appendix C. |
| `vault/discovery/robot-talks-definitions/examples/robots-discussing.md` | `created-by` | Turn 2 raised the T2 tension between session logs and discovery text as competing canons; D-9 settles it in favor of the discovery. Replaces deprecated `provenance-for` per ontology-conventions Appendix C. |
| `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md` | `cited-by` | The vault-edges domainspec-subagents-strategy research cites D-1 through D-9 here as canonical chain edges that constrain its edge catalog. |
| `vault/discovery/robot-talks-definitions/robot-talks.md` | `cited-by` | The robot-talks discovery cites D-9 (discovery is canonical, sessions are provenance only) as a precedence rule. |
