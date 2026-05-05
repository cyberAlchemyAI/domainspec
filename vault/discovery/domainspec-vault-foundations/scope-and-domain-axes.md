---
tags: [vault, ontology, agents, classification]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, reference
status: exploratory
veracidade: low
convicção: high
version: 0.2.0
last_updated: 2026-05-02
---

# Discovery — Scope and Domain Axes for the Universal Vault

> A discovery document mapping the design space for splitting the overloaded `layer` field into two cleaner axes (`scope` and `domain`) so the vault can hold knowledge from any discipline (mathematics, biology, finance, marketing) while preserving the orthogonality discipline. Records decisions taken so far, the rationale behind each, and the alternatives considered and rejected.

---

## Objective

This document captures the **early-stage decisions and open questions** behind the redesign of the vault's classification system, motivated by the requirement that the vault must be able to absorb knowledge from any domain — not only ZefraHub's FIDC / credit-rights origin. It is exploratory: it does not prescribe the final schema, but it locks in the decisions already taken, names the alternatives that were considered and rejected, and enumerates the open design questions that the next research wave (four parallel subagents on hierarchical taxonomy growth) is meant to answer.

This is a `node_type: discovery` document — high context, written for humans, intended to be superseded by an `implementation-plan` once the open questions resolve.

---

## Index

1. [Context — Why This Discovery Exists](#context--why-this-discovery-exists)
2. [Decisions Taken](#decisions-taken)
3. [Alternatives Considered](#alternatives-considered)
4. [Open Questions for the Research Wave](#open-questions-for-the-research-wave)
5. [Proposed But Deferred — Domain Taxonomy Seed Proposal](#proposed-but-deferred--domain-taxonomy-seed-proposal)
6. [Connections](#connections)

---

## Context — Why This Discovery Exists

### The trigger

The vault was originally designed as ZefraHub's internal knowledge graph — its `layer` field (`ontology` / `architecture` / `market` / `domain` / `application`) was sized for the company's own concerns. In the conversation of 2026-05-02, the design intent was reframed: the vault is to be a **universal-domain knowledge graph** capable of absorbing any subject matter — mathematics, biology, finance, marketing, regulations — and serving as a generative environment where ideas are thrown in, discussed, and either absorbed or discarded by the network.

Three structural problems with the current schema surfaced in that conversation:

1. **The `layer` field conflates two unrelated axes.** It mixes *epistemic-stack position* (where in the meta-stack: about-the-vault vs about-our-system vs about-the-world) with *topical scope* (what subject matter). A document about mathematics has no clean home: `layer: market` distorts it, `layer: domain` was reserved for ZefraHub's business domains.

2. **The `layer` value vocabulary cannot grow without distortion.** A flat enumeration of five values cannot scale to "any discipline + any business domain." It needs an extensibility mechanism — an open, growable controlled vocabulary with explicit growth rules.

3. **The orthogonality principle was over-stated.** It was being applied as a measured rule (mutual information ≈ 0 between labels) when in fact the vault has no instrumentation that computes mutual information over the corpus. Until the Bayesian agent or equivalent measurement layer lands, "orthogonality" is a human-applied design heuristic, not a verified property.

### The surrounding constraint

The vault is intended to be a **generative epistemic system**, not a compressed encoding. Generative systems require productive redundancy (cross-checking, triangulation), slack for surprise (room to absorb genuinely new dimensions), and explicit treatment of correlations as *findings*, not bugs. A schema designed for maximum Shannon-orthogonality is a schema optimized for the *wrong* loss function in this setting. The right discipline is *orthogonality of labels at admission, productive correlation of values during evolution.*

---

## Decisions Taken

The following decisions were taken in the 2026-05-02 design conversation. Each is paired with the rationale, the consequences, and a flag indicating whether it is settled or pending further research.

### D-1 — Demote orthogonality from `axiom` to `premise`

**Decision:** The orthogonality principle is reclassified from a foundational axiom to a working premise (`node_type: premise`, `veracidade: low`, `convicção: high`).

**Rationale:** Until corpus-level instrumentation exists to compute mutual information between labels, orthogonality is a *strategic bet* — we are betting on it as a design discipline (high `convicção`) but cannot point to measured evidence (low `veracidade`). The 2×2 confidence matrix in `ontology-conventions.md` literally names this state "strategic bet" — the existing schema has the right vocabulary for the move. Treating an unverifiable heuristic as an axiom would create false rigor and bake mistakes into `evergreen` documents.

**Consequence:** The constitution must be updated to clarify that orthogonality is a *human-applied design discipline* until the Bayesian agent / measurement layer lands. Any future `axiom` claim of similar nature must pass the bar of "is this measured, or is it a heuristic?"

**Status:** Settled. Awaits constitution edit.

---

### D-2 — Premises are hypotheses; no new `hypothesis` node_type

**Decision:** Premises ARE the vault's hypotheses. The `premise` node_type, combined with the `veracidade` axis, fully captures the hypothesis-validation lifecycle. No separate `hypothesis` node_type will be added.

**Rationale:** Adding `hypothesis` would violate the orthogonality discipline — its values would be predictable from `premise` + `status: draft|exploratory` + `veracidade: low`. The information is already expressible.

**Consequence:** Add a short clarification to `ontology-conventions.md` (or the `premise/` folder readme) making this explicit: *"Premises are our hypotheses. They must be validated by evidence over time — that validation lifecycle is the `veracidade` axis."*

**Status:** Settled.

---

### D-3 — Split the overloaded `layer` field into two axes: `scope` and `domain`

**Decision:** The current `layer` field is decomposed into two independent axes:

- **`scope`** — closed enumeration capturing *epistemic-stack position*
- **`domain`** — open, growable controlled vocabulary capturing *topical subject matter*

**Rationale:** The two jobs `layer` was doing are not predictable from each other (a document about mathematics has no fixed `scope`; a document about our codebase architecture has no fixed `domain`). Separating them passes the orthogonality discipline at the label level. The asymmetry — `scope` closed, `domain` open — is the key extensibility mechanism: stable structure with growable content.

**Consequence:** The existing `layer` field is deprecated. Documents will be migrated. The new fields enter the constitution.

**Status:** Settled at the structural level; value vocabularies pending (see D-4 and D-5).

---

### D-4 — `scope` values: `ontology`, `world`, `artifact`

**Decision:** The `scope` axis takes one of three values (multi-value allowed for bridge documents):

| Value | Meaning | Captures the old `layer` values |
|-------|---------|--------------------------------|
| **`ontology`** | Documents that govern the knowledge graph itself — its rules, classification system, governance, growth discipline. | old `layer: ontology` |
| **`world`** | Documents about reality that exists independently of us — disciplines (math, biology), markets, regulations, external domain knowledge. | old `layer: market`, parts of `layer: domain` |
| **`artifact`** | Documents about what we are constructing — our codebase, architecture, application, our specific product implementation. | old `layer: architecture`, `layer: application`, parts of `layer: domain` |

**Rationale:** These three values cover the meta-stack cleanly without overlap: every document is about *the knowledge system*, *the world*, or *what we build*. Bridge documents (e.g., a spec mapping FIDC regulations to our code) are expressed by multi-value: `scope: world, artifact` — the multi-value is the bridge marker.

The name `ontology` was preferred over `meta` because "meta" is too vague (there can be multiple meta-levels — meta-ontology, meta-system, meta-process). `ontology` names the specific thing this scope contains: the rules and laws governing the knowledge and the knowledge graph.

**Consequence:** The constitution must define each of the three scope values with examples. Existing vault documents must be migrated from `layer:` to `scope:`. The deprecation is a structural change tracked in `ontology_events`.

**Forward consideration:** `scope: ontology` may be split later (e.g., `ontology-rules` vs `ontology-governance`) if the value accumulates heterogeneous content the existing distinction can't resolve. Recorded as a future-watch item, not a today-problem.

**Status:** Settled.

---

### D-5 — `domain` is open, growable, and (likely) hierarchical

**Decision:** The `domain` axis is an open controlled vocabulary that grows with the corpus. Its value vocabulary differs in *content* across scopes (world-scope: `mathematics`, `biology`, `finance`, `fidc`; artifact-scope: `auth`, `payments`, `ontology-instrumentation`) but its *meaning* is consistent across all scopes: **what topic the document addresses**. The field's semantics do not shape-shift across scopes.

**Rationale:** Letting `domain` mean different things in different scopes would create a non-uniform query surface (queries would need to know the scope to interpret the domain) and would break the orthogonality discipline at the label level. Keeping `domain` semantically uniform with a scope-conditional value vocabulary is strictly cleaner.

**Open structural question:** Whether `domain` is a tree, a DAG, or a lattice. This is the central question for the next research wave. The choice has material consequences:

- **Tree** — every domain has exactly one parent. Clean, but breaks under cross-disciplinary work (biochemistry has two parents: biology and chemistry).
- **DAG** — multiple parents allowed, no cycles. Wikidata-style. More expressive, harder to query.
- **Lattice (FCA)** — concepts emerge from object-attribute incidence. Most flexible, most overhead.

Linnaean biology was a tree until phylogenetics broke it; it's now closer to a DAG. Wikidata properties are a DAG by construction.

**Status:** Structure (open / growable / scope-conditional vocabulary) is settled. Hierarchy structure (tree / DAG / lattice) is pending the research wave. Initial value seed and growth rules also pending.

---

### D-6 — `node_type` covers artifact-role; do not add a new label

**Decision:** The artifact-role distinction (spec / discovery / implementation-plan / audit) is already captured by the existing `node_type` values. No new label is added to express "what kind of artifact this is."

**Rationale:** The user's observation — "discovery for humans, plan for technical humans, spec for agents" — is real, but the role part of the distinction is already in `node_type`. Adding a parallel `artifact_kind` label would be predictable from `node_type` and would violate the orthogonality discipline at the label level.

**Status:** Settled.

---

### D-7 — The discovery → plan → spec density gradient is recorded as a productive correlation

**Decision:** The empirical observation that artifact-scope `node_type` values carry a density/audience gradient — `discovery` (high context, human reader), `implementation-plan` (technical human reader), `spec` (dense, agent-targeted) — is documented in the constitution as a **productive correlation** rather than as a new label.

**Rationale:** This is exactly the case the productive-correlation rule (the second-axis governance rule alongside admission-orthogonality) was designed for. The pattern is informative — it tells operators *how to read* a document of a given `node_type` — but it does not earn its own label because the information is fully predictable from `node_type` once the operator is aware of the gradient. Adding an `audience` or `density` label would be redundant.

**Consequence:** The constitution gains a short subsection: *"Across the artifact-scope `node_type` values, there is an empirical density/audience gradient: discovery → implementation-plan → spec moves from human-context-dense to agent-target-dense. This is a productive correlation. Operators should expect it; we do not encode it as a separate label."*

**Status:** Settled.

---

### D-8 — Instrument only `discovery` and (later) `implementation-plan` for now

**Decision:** In the first instrumentation wave, only `discovery` documents (and, in a follow-up, `implementation-plan` documents) gain explicit graph labels and edges. Specs remain uninstrumented at the manual level — they inherit context from their parent plan/discovery, and divergence is caught by audits.

**Rationale:** Specs are downstream artifacts produced by the planner agent. They are dense and machine-targeted; manual graph annotation would be busywork until specs themselves drift from their parents (at which point an `audit` catches the drift and produces explicit `contradicts` edges). Discoveries, by contrast, are human-written, carry the most reasoning context, and are where graph annotation produces the most retrieval leverage.

**Status:** Settled for the first instrumentation wave.

---

### D-9 — Defer growth-rule definition to after the research wave

**Decision:** The four growth rules (split / merge / promote / retire) for the `domain` value set will be defined *after* the parallel research wave returns its findings on how real hierarchical taxonomies have grown.

**Rationale:** The growth rules are the discipline's most consequential output. Designing them before the empirical research lands would risk re-inventing rules that real taxonomies have already evolved (Wikidata properties, OBO Foundry, MeSH, Linnaean rank revisions, ACM CCS restructures). The four research mandates are explicitly designed to feed the growth-rule design.

**Status:** Settled (deferred by intent). Now resolved — see D-11.

---

### D-10 — Structural commitment: typed DAG with tree-constrained `subclass-of` edges

**Decision:** The `domain` axis at the value-catalog level is a typed DAG. The `subclass-of` edge type (and only that one) is constrained to be a tree (one parent per value). All other typed edges (`cross-cuts`, `historically-derived-from`, etc.) are unconstrained but mechanically cycle-checked.

**Rationale:** This synthesizes the empirical-history evidence (every tree eventually became a DAG) and the structural-commitment evidence (authoring discipline: agents will explode parents under pure DAG); both are documented in `scope-and-domain-axes-evidence.md`. The key insight from the structural-commitment track is that a pure DAG allows agent authors to systematically pick "all plausible parents," producing edge-count explosion identical to Wikidata's million-scale anti-patterns — without Wikidata's curator population to clean it. Constraining `subclass-of` to a tree gives cheap authoring, cheap navigation breadcrumbs, and a single canonical parent path while preserving full DAG expressivity through typed cross-cutting edges.

The structural-commitment track's "type every edge from day one" finding is load-bearing — it avoids the Gene Ontology `is_a` overloading mistake the empirical-history track documented, where a single generic edge type had to carry subsumption, part-of, and regulation semantics simultaneously, requiring the retroactive Relations Ontology (RO) retrofit.

**Consequence:** The domain value catalog must declare a typed edge vocabulary at initialization. At minimum: `subclass-of` (tree-constrained), `cross-cuts`, `historically-derived-from`. Additional types may be added via the governance process (D-12, D-14). Cycle detection must run on all edge types; single-parent enforcement runs on `subclass-of` specifically.

**Status:** Settled. Resolves OQ-1.

---

### D-11 — Five growth operations, not four

**Decision:** The `domain` value set evolves through exactly five named operations: **Split**, **Merge**, **Promote-tag**, **Promote-level**, **Retire**. Each has explicit criteria drawn from the empirical-history and governance evidence in `scope-and-domain-axes-evidence.md`.

**Split** — one domain value becomes two or more.
- Trigger: ≥ 8 documents tagged with the value AND ≥ 2 separable sub-clusters in a manual sample (initial threshold; raise to ≥ 15 documents at corpus milestone of ~100 documents). When the Bayesian agent is instrumented, the Bayesian residual within-value entropy above threshold replaces the manual sample.
- Migration: all existing documents reclassified; old value retired with `split-into` edges pointing to successors. The old value is never deleted — it enters `retired` state per the Retire operation below.
- Anti-trigger: do not split because a domain is large. MeSH's `Diseases` category has thousands of descriptors and has not been split at the top level — depth, not breadth, is the splitting criterion.

**Merge** — two domain values become one.
- Trigger: document-set Jaccard overlap ≥ 70% on a sustained basis (from the governance evidence), OR audit identifies the same topic under different names.
- Migration: re-tag all documents to the canonical value; deprecated value enters `retired` with a `merged-into` edge pointing to the canonical.

**Promote-tag** — a `tags` value graduates to a controlled `domain` value.
- Trigger: ≥ 5 documents using the tag AND ≥ 30 days stable usage AND passes orthogonality discipline (the tag carries information no current `domain` value carries). Borrowed from schema.org's `pending` namespace flow (governance evidence).
- Migration: update all documents carrying the tag; tag retired from the tag namespace.

**Promote-level** — a new upper-level parent is created over existing domain values.
- Trigger: ≥ 3 children exist that share an articulable semantic basis AND that basis is query-relevant (you can name a specific question that requires the parent to answer it, not just to group). The empirical-history criterion: DDC's failure mode was adding top-level structure before evidence forced it; do not add a parent until the query case is concrete.

**Retire** — a domain value is deprecated.
- Never delete. Mark `status: retired` with: reason (`split`, `merged`, `obsolete`, `superseded`), date, successor value(s) if any, and migration record. All logged in `ontology_events`.
- Slugs are never reused for a different meaning — the OBO Foundry IRI-stability principle.
- Retirement pre-announced ≥ 7 days before it takes effect.
- Historical queries scoped to a past date return the original classifications.

**Status:** Settled. Resolves OQ-3.

---

### D-12 — Governance roles separated structurally in `ontology_events`

**Decision:** Even when the same human fills multiple roles, the audit log records four separate role events for each growth operation: **proposer**, **reviewer**, **decider**, **migrator**.

**Rationale:** The JEL closed-committee failure mode (from the governance evidence) shows that when a single body proposes, decides, and migrates without separation, the audit trail collapses and the process loses its accountability surface. Even with one human and agents, the role separation is the *trail*, not the personnel count. An audit agent can verify that a proposal existed before a decision, that a review happened before ratification, and that migration was completed after decision — none of which it can verify if a single event combines all four roles.

**Consequence:** The `ontology_events` schema must include `role` as a required field on each event, with the four roles as an enumeration. Proposals are `node_type: discovery` documents under `vault/discovery/ontology-proposals/`.

**Status:** Settled.

---

### D-13 — Knowledge graph vs application graph; vault is source-of-truth for both schemas

**Decision:** A `node_type: discovery` document can target the *knowledge graph* (the vault itself), the *application graph* (the product's structural graph), or both. The `scope` axis labels which:

- `scope: ontology` → modifies the knowledge graph schema
- `scope: artifact` → modifies the application graph schema (or instance)
- `scope: world` → updates content of either graph but neither schema
- Multi-value scope (`ontology, artifact`) → modifies both schemas in one discovery

The vault is the canonical source of truth for both schemas. The application graph's *runtime instance* is derived from the codebase, but its *schema* (valid node types, valid edges) lives as documents in the vault. Code is downstream of the vault.

**Rationale:** Without this explicit separation, schema changes can be made directly to `ontology-conventions.md` or to codebase definitions without a corresponding discovery document, breaking the auditability of the design rationale. This decision names the vault as the authoritative schema registry for both graphs and defines `scope` as the field that declares which graph a discovery affects.

**Status:** Settled.

---

### D-14 — Discoveries are the only authorized path for schema evolution

**Decision:** Schema changes — new node_types, edge types, scope values, growth rules, domain values — never bypass a `node_type: discovery` document. Direct edits to `ontology-conventions.md` without an originating discovery are not authorized. The discovery → implementation-plan → spec → audit lifecycle is the governance loop for both graphs.

**Rationale:** Without a discovery gate, schema changes accumulate as informal edits with no design rationale, no alternatives-considered record, and no way to trace *why* a value exists. The discovery document is the institution of record: it is the proposer's accountability artifact (D-12), the place where alternatives are named and rejected, and the document that implementation-plans and specs derive from. Making it mandatory closes the loop that D-12 defines.

**Consequence:** Any current direct edits to `ontology-conventions.md` that lack a corresponding discovery are flagged as governance debt and must be back-filled with a discovery or formally acknowledged via an audit.

**Status:** Settled.

---

## Alternatives Considered

The following alternatives were considered and rejected. They are recorded so future readers do not relitigate them without understanding why.

### A-1 — Keep the single `layer` field and just add more values

**Rejected.** Would compound the existing problem. Adding `mathematics`, `biology`, `marketing` etc. as `layer` values mixes them with `architecture` and `application`, which are categorically different. The values would not be orthogonal even at the conceptual level.

### A-2 — Add a separate `discipline` field alongside `layer`

**Rejected.** Would only solve the world-scope case (academic disciplines) and leave business domains and bridge documents unhandled. Adding three or four narrow fields ("discipline", "business-domain", "regulatory-domain") is strictly worse than one open `domain` field with a scope-conditional value vocabulary.

### A-3 — Add a new `hypothesis` node_type

**Rejected (D-2).** Information is already expressible via `premise` + `veracidade`. Predictable from existing labels.

### A-4 — Add an `audience` or `density` label

**Rejected (D-7).** Predictable from `node_type` once the gradient is documented. Recorded as productive correlation instead.

### A-5 — Make `domain` shape-shift its meaning across scopes

**Rejected.** Was raised in conversation: "world-scope domain = topic; artifact-scope domain = kind of artifact (spec/discovery/plan)." Rejected because (a) `node_type` already captures the artifact-kind distinction, and (b) a field whose semantics depend on another field's value creates a non-uniform query surface and breaks the orthogonality discipline.

### A-6 — Use `meta` instead of `ontology` as the scope value name

**Rejected (D-4).** "Meta" is too vague; multiple meta-levels exist. `ontology` is the concrete name for *the rules governing the knowledge graph itself*.

### A-7 — Pre-enumerate the full domain taxonomy upfront

**Rejected.** DDC took 150 years and is still wrong about half of computer science. Designing the *growth rules* and letting the corpus drive the value set is the only approach that scales. The seed should be small (whatever we already document), not exhaustive.

### A-8 — Treat orthogonality as Shannon-style "I = 0" rule

**Rejected.** Conceded that mutual information is non-stationary (depends on the corpus, not just the schema), that strict I=0 is empirically rare even in the existing vault (e.g., `nature` partially correlates with `node_type`), and that the *operational* rule is weaker: each label must carry non-trivial residual entropy. The constitution will state this honestly.

### A-9 — Pure DAG with no tree constraint on `subclass-of`

**Rejected in synthesis.** From the structural-commitment evidence: agent authors will systematically pick "all plausible parents" under a pure DAG, exploding edge counts without the curator population (Wikidata has a dedicated WikiProject Ontology; we do not). The instance-vs-subclass confusion Wikidata documents at millions-of-instances scale would appear here at hundreds-of-documents scale. The synthesized form (D-10) preserves DAG expressivity on non-`subclass-of` edges while constraining the primary navigation edge — the one most often misused — to a tree. Start strict, relax later; the reversal is tractable in one direction only.

### A-10 — Pure FCA lattice for `domain`

**Rejected.** From the structural-commitment evidence: FCA (Formal Concept Analysis) lattices are valuable as a diagnostic tool but are hostile to direct human authoring. Lattice outputs are often non-intuitive (mathematically real concepts may have no natural-language name), computationally expensive in the worst case (exponential in attributes), and brittle to sparse or noisy data — a single mis-tagged document shifts the lattice. No production knowledge graph surveyed in either the empirical-history or structural-commitment tracks uses FCA as its primary structure. Reserved as an offline diagnostic auditing tool: run FCA over the document × domain-tag matrix when the corpus is large enough to detect whether the imposed hierarchy disagrees with the data-implied lattice, then use disagreement as a signal for Split/Merge operations.

---

## Open Questions for the Research Wave

The following questions were posed to four parallel research subagents (empirical history, upper ontologies, structural commitment, governance — now consolidated as appendices in `scope-and-domain-axes-evidence.md`). OQ-1 through OQ-4 are now resolved.

### OQ-1 — Tree vs DAG vs lattice for `domain` — **RESOLVED**

**Resolution:** Typed DAG with `subclass-of` tree-constrained (one parent per value); all other typed edges (`cross-cuts`, `historically-derived-from`) are unconstrained but mechanically cycle-checked. See D-10. Resolved by the empirical-history evidence (every tree eventually became a DAG; cycle enforcement is the difference between MeSH and Wikipedia) + the structural-commitment evidence (authoring discipline: tree-constraint on the primary navigation edge prevents agent-induced edge explosion) + D-10. See `scope-and-domain-axes-evidence.md`.

### OQ-2 — Initial value seed for `domain` — **RESOLVED**

**Resolution:** 12 flat seed values drawn from documents the vault currently holds. No upper-level groupings at day one — the DDC and LCC evidence is consistent that top-level commitments made before the corpus forces them become permanent debt (empirical-history + governance evidence in `scope-and-domain-axes-evidence.md`). Upper-level groupings added only when ≥ 3 siblings need a common parent AND a specific query names the need (D-11, Promote-level). Specific proposed values are in the "Proposed But Deferred" section below.

### OQ-3 — Growth rules (split / merge / promote / retire) — **RESOLVED**

**Resolution:** Five operations with explicit criteria: Split, Merge, Promote-tag, Promote-level, Retire. Criteria drawn from Wikidata property proposals, OBO Foundry admission + retirement, ACM CCS corpus-evidence triggers, schema.org pending namespace, MSC decadal versioning, and JEL (as a negative example of closed-committee opacity). See D-11. Resolved by the empirical-history + governance evidence in `scope-and-domain-axes-evidence.md` + D-11.

### OQ-4 — Top-of-tree alignment with upper ontologies — **RESOLVED**

**Resolution:** No upper ontology aligns with `scope: ontology / world / artifact` — the `scope` axis is an epistemic-stack axis, not a metaphysical taxonomy. None of BFO, DOLCE, SUMO, schema.org, or WordNet has a category for "documents about the rules of the knowledge graph itself" (upper-ontology evidence in `scope-and-domain-axes-evidence.md`).

Cyc's **microtheory device** is cited as prior art for the move `scope` is making: each scope value is effectively a context of accountability (ontology-rules context, world-reality context, artifact-construction context), and cross-scope documents are the inter-microtheory bridges Cyc would recognize. This is a conceptual citation, not a structural commitment.

For eventual upper levels of `domain`, **DOLCE's physical/non-physical/abstract split** is the named reference: it coincidentally maps onto natural / social-and-cognitive / formal sciences and is descriptivist (about how we model the world, not about what the world is), matching the vault's role as a knowledge graph rather than a scientific instrument. We are not committing to DOLCE — we are naming it as the reference to evaluate against when the corpus demands upper levels. Resolved by the upper-ontology evidence in `scope-and-domain-axes-evidence.md`.

### OQ-5 — Forward consideration: `scope: ontology` split

If `scope: ontology` accumulates heterogeneous content (rules vs governance vs measurement), it may need to be split into two values. Watch-item, not a today-problem.

### OQ-6 — Instrumentation for measured orthogonality

When does the Bayesian agent / corpus-measurement layer land such that orthogonality can be promoted from "design discipline" to "verified property"? Implementation-plan deferred.

---

## Proposed But Deferred — Domain Taxonomy Seed Proposal

This section proposes a concrete day-one seed for the `domain` value vocabulary, informed by the research wave and grounded in documents the vault currently holds. It is a **proposal pending implementation** — it does not take effect until ratified through a discovery → implementation-plan → spec lifecycle per D-14. The implementation plan (not yet written) is the next document in the governance lifecycle.

### Proposed day-one seed: 12 values

Drawn from documents in the current vault, partitioned by `scope`. The discipline is: seed flat, no upper-level groupings, let the corpus grow the rest (empirical-history + governance evidence in `scope-and-domain-axes-evidence.md`).

**Ontology-scope** (`scope: ontology`) — documents about the knowledge graph itself:

- `ontology-classification` — the classification system: field definitions, value vocabularies, admission rules. Covers `ontology-conventions.md`, `domain-tagging-constitution.md`, `confidence-levels.md`.
- `ontology-governance` — the governance process: growth rules, `ontology_events`, proposal lifecycle, role separation. Covers `ontology-constitution.md`, the discovery files, growth-operation proposals.
- `ontology-instrumentation` — the Bayesian measurement layer, corpus analytics, automated orthogonality checking. Covers `ontology-architecture-draft.md`. (Currently sparse; will grow when instrumentation is implemented.)

**World-scope** (`scope: world`) — documents about reality independent of us:

- `fidc` — FIDC (Fundos de Investimento em Direitos Creditórios) as a financial instrument: structure, regulation, credit rights mechanics. Covers `fidc-and-credit-rights.md` (referenced in conventions as the canonical world-scope example).
- `event-sourcing` — event sourcing as a pattern in distributed systems: history, theory, tradeoffs. Covers `event-system-foundations.md` (the external-knowledge aspect of event sourcing, distinct from our specific implementation).

**Artifact-scope** (`scope: artifact`) — documents about what we are constructing:

- `event-system` — our specific event system implementation: the constitution, the specification, the behavioral rules. Covers `event-system-constitution.md` and downstream specs.
- `folder-structure` — our vault and codebase directory layout: conventions, enforcement, rationale. Covers `folder-structure-constitution.md`.
- `frontend` — our frontend architecture, axioms, premises, and constitutions. Covers `frontend-constitution.md`, `frontend-axioms.md`, `frontend-premises.md`.
- `agent-system` — the dispatch and orchestration layer: subagent model, multi-agent premises, robot-talks protocol. Covers `domainspec-subagents-strategy-premises.md`, `robot-talks-constitution.md`, `robot-talks-premises.md`.
- `commit-discipline` — git commit conventions and development practices. Covers `commit-message-constitution.md`, `development-practices-constitution.md`.
- `vault-navigation` — human and agent navigation guides for the vault: how to read it, how to traverse it. Covers `agent-navigation.md`, `human-navigation.md`.

**Multi-scope** (`scope: ontology, artifact`) — bridge documents:

- `confidence-system` — the veracidade × convicção framework: both a schema rule (`scope: ontology`) and something implemented in vault tooling (`scope: artifact`). Covers `confidence-levels.md`, `epistemic-principles.md`. (Multi-value domain is the bridge marker per D-4.)

That is 12 values (11 single-scope + 1 noted as naturally multi-scope). `confidence-system` could alternatively be split into `ontology-classification` for its schema rules and a separate artifact-scope value when tooling lands — this is an admitted judgment call in the seed.

### What is deliberately excluded from the seed

- `system-premises` and `system-axioms` contents: covered by `ontology-classification` (for ontology-scope) and `artifact`-scoped values for the system-specific architectural premises.
- Any world-scope academic discipline (`mathematics`, `biology`, `marketing`): no current vault document exists in these domains. These values enter via Promote-tag when the corpus actually holds them, not as preemptive slots.
- Any upper-level grouping (`formal-sciences`, `natural-sciences`): deferred per D-11's Promote-level rule. No current child set of ≥ 3 exists under a proposed world-scope parent.

### A possible future hierarchy sketch (still illustrative)

When the corpus grows to justify upper levels, the world-scope branch might use DOLCE's physical/non-physical/abstract as a loose reference (upper-ontology evidence, recommendation R-3 in `scope-and-domain-axes-evidence.md`): natural sciences (physical), social sciences and economics (non-physical/social), formal sciences (abstract). Artifact-scope is expected to remain flat (one or two levels deep at most, tracking actual codebase structure). Ontology-scope will stay flat unless `scope: ontology` is itself split (OQ-5).

These are not commitments. They are orientation points for the implementation plan.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [ontology-conventions.md](../../ontology-conventions.md) | `refines` | This discovery proposes amendments to the conventions: split `layer` into `scope` + `domain`, demote orthogonality to premise, document the density gradient as productive correlation. |
| [confidence-levels.md](../../confidence-levels.md) | `derives-from` | Uses the existing 2×2 `veracidade` × `convicção` matrix; specifically, classifies orthogonality as a "strategic bet" (low veracidade, high convicção) using that matrix. |
| [ontology-architecture-draft.md](../../ontology-architecture-draft.md) | `cites` | The Bayesian agent described there is the future instrumentation layer that would promote orthogonality from heuristic to measured rule. |
| [conceptual/epistemic-principles.md](../../conceptual/epistemic-principles.md) | `questions` | The Orthogonality Principle entry needs revision — current text presents it as if it were measurable; this discovery flags it as currently a heuristic. |
| [research/scope-and-domain-axes-evidence.md](research/scope-and-domain-axes-evidence.md) | `derives-from` | Consolidated evidence survey resolving OQ-1 through OQ-4. Combines empirical history of taxonomy evolution (Linnaean biology, MeSH, DDC, Wikipedia categories), upper-ontology survey (BFO, DOLCE, SUMO, Cyc, schema.org, WordNet), structural analysis (tree vs DAG vs lattice), and governance survey (Wikidata, OBO Foundry, ACM CCS, JEL, MSC, schema.org pending) into a single research document. The original four parallel research tracks (T1–T4) and their synthesis are preserved as named appendix sections within. |
| `implementation-plan TBD` | `superseded-by` | The implementation plan that operationalizes these decisions has not yet been written. This discovery is the input to that plan. |
| [epistemic-chain.md](epistemic-chain.md) | `derives` | The epistemic-chain discovery extends the meta-classification work begun here; D-1 (orthogonality demotion) is the canonical example it cites. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session executed an in-content rename sweep (`vault-foundations` → `domainspec-vault-foundations` and related `subagents-*` → `domainspec-*` references). |
| `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md` | `cited-by` | The vault-edges domainspec-subagents-strategy research cites D-3, D-5, D-10 here as a structural constraint on edge typology (typed-DAG with tree-constrained `subclass-of`). |
