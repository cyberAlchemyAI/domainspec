---
tags: [domainspec, definitions, inventory, schema, edges, audit]
node_type: research
is_session: false
layer: application, governance
nature: reference, exploratory
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-26
---

# Formal Definitions Layer — Repository Inventory

> Empirical substrate for the `formal-definitions-layer` discovery research dispatch. Produced by a single Explore-style subagent pass over the repo on 2026-05-26. Several rows are marked `(assumed)` where the agent inferred structure without reading the file end-to-end — those should be verified before being treated as load-bearing.

## Purpose

Map every artifact in this repo that does the work of "defining a business/domain concept, rule, metric, workflow, role, or interface" — even informally. This grounds the upstream research lenses (schema, elicitation, governance, failure modes, plus the meta-vs-domain split) in what already exists, rather than starting from abstract literature.

---

## 1. Inventory Table

| Path | Encodes | Implicit Schema | Domain/Universal | Maturity | Governance Signals |
|------|---------|-----------------|-------------------|----------|-------------------|
| `/TAXONOMY.md` | Meta-type vocabulary (25 backend + 11 UI concepts) | meta-type \| purpose \| template link \| example | Universal (meta-schema) | Template (canonical reference) | version, canonical status |
| `/AUTHORITY-MAP.md` | Authority structure: canonical sources per system piece | system-piece \| canonical-source \| authority-form \| notes | Universal (meta) | Reference doc | status: canonical |
| `/AXIOMS.md` | 6 governance axioms with harm evidence | axiom-id \| statement \| harm-evidence \| governs | Universal (governance) | Consolidated | explicit version, status |
| `/CONSTITUTION.md` | 11 enforceable governance rules + L4→L6 mapping | rule-id \| statement \| axiom-link \| enforcement-gate | Universal (governance) | Consolidated | explicit mappings, gate references |
| `/RELATIONSHIPS.md` | 29 typed edges: 15 backend, 8 UI, 6 cross-layer | edge-name \| from→to \| cardinality \| description | Universal (meta) | Reference doc | canonical vocabulary |
| `/DRIFT-CONVERGENCE.md` | Operational interpretation of drift/convergence | (prose, not tabular) | Universal (meta-operational) | Reference | status in AUTHORITY-MAP |
| `/OBSERVABILITY.md` | Derivation rules for observability metrics from SPEC | (placeholder; derivation contract) | Universal (process) | Template | references TEST-PIPELINE |
| `/TEST-PIPELINE.md` | Derivation rules for test obligations from SPEC | (placeholder; derivation contract) | Universal (process) | Template | references OBSERVABILITY |
| `/templates/initial-definitions.md` | Template: glossary seed + bounded context defs + rules | term \| definition \| category \| status \| evidence-type | Universal (template) | Template (prescriptive) | table-driven schema |
| `/templates/glossary.md` | Template: per-feature quick-reference glossary | term \| meaning \| related-concepts | Universal (template) | Template | frontmatter: feature, docType, status |
| `/templates/domain.md` | Template: entities, value objects, enums | field \| type \| required \| description | Universal (template) | Template | markdown table schema |
| `/templates/rules.md` | Template: business rules with formal expressions | rule-id \| type \| applies-to \| formal \| checked-by | Universal (template) | Template | explicit test-traceability |
| `/templates/states.md` | Template: state machines with mermaid + transitions | state \| terminal? \| from \| event \| to \| guard \| effect | Universal (template) | Template | mermaid diagram convention |
| `/templates/operations.md` | Template: operations with rules, calculations, transitions | (inferred from TAXONOMY reference) | Universal (template) | Template | inherits from TAXONOMY |
| `/templates/interfaces.md` | Template: API boundaries with request/response shapes | method \| path \| exposes \| request-fields \| response-table | Universal (template) | Template | explicit concept-mapping |
| `/templates/events.md` | Template: domain events with payload and consumers | produced-by \| triggers-transition \| payload-fields \| consumed-by | Universal (template) | Template | explicit lifecycle tracing |
| `/templates/mappings.md` | Template: data transformations at boundaries | source→target \| field-mapping \| defaults \| validation | Universal (template) | Template | inferred from RELATIONSHIPS.md |
| `/templates/workflows.md` | Template: multi-step orchestrations (inferred) | (from TAXONOMY reference) | Universal (template) | Template | references RELATIONSHIPS orchestrates |
| `/templates/queries.md` | Template: read operations (inferred) | (from TAXONOMY reference) | Universal (template) | Template | references TAXONOMY |
| `/templates/SPEC.md` | Template: feature pack overview with concept registry | concept \| id \| type \| description \| source | Universal (template) | Template (6449 bytes, v current) | frontmatter + concept registry |
| `/templates/TEST-SPEC.md` | Template: test obligations derived from SPEC | test-id \| rule-covered \| scenario \| assertion | Universal (template) | Template | explicit rule-traceability |
| `/templates/ui-spec.md` | Template: UI routes, components, hooks, forms, guards | route \| page \| layout \| component \| hook-binding | Universal (template) | Template | 5247 bytes, references TAXONOMY |
| `/docs/glossary.md` | Global glossary: Payment Processing terms (filled) | term \| definition \| feature(s) \| see-also | Domain-specific (payment-processing) | Partially filled | 18 rows, cross-feature links |
| `/docs/registry.md` | Concept registry: all concepts across all features | concept-id \| concept \| feature \| type \| (meta-cols) | Universal + domain-specific (hybrid) | Filled registry | auto-synced, validates against SPEC |
| `/starter/glossary.md` | Empty template glossary | term \| definition \| feature(s) \| see-also | Universal (template) | Empty template | same schema as /docs/glossary |
| `/starter/registry.md` | Empty template registry | (same as /docs/registry) | Universal (template) | Empty template | (stub) |
| `/vault/ontology-conventions.md` | Vault constitution: frontmatter schema, edge types, confidence dimensions | node_type (16 values) \| layer (5 values) \| nature (4 values) \| status (5 stages) \| veracidade \| convicção | Universal (meta) | Consolidated (v 2.3.0, modified) | explicitly versioned, status, layer, veracidade, convicção |
| `/vault/confidence-levels.md` | Maturity lifecycle: draft→evergreen with entry/exit criteria | status-level \| entry-criteria \| duration \| exit-criteria | Universal (meta) | Reference | canonical in AUTHORITY-MAP |
| `/vault/ontology-constitution.md` | Philosophical foundations of vault: Zettelkasten + Evergreen Notes + Bayesian Epistemology | (prose explanation) | Universal (meta) | Consolidated | status: consolidated, v 0.1.0 |
| `/vault/axiom/domainspec-axioms.md` | 4 DomainSpec methodology axioms + derivation hierarchy | axiom-id \| context \| operationalization \| appendix-formalism | Universal (methodology) | Exploratory (v 0.6.0, medium veracidade) | veracidade: medium, convicção: high |
| `/vault/axiom/system-axioms.md` | 5 system/architecture axioms | axiom-id \| statement \| justification | Universal (architecture) | Consolidated (v 0.2.1, high veracidade) | veracidade: high, convicção: high |
| `/vault/axiom/ontology-axioms.md` | (assumed) ontology layer axioms | (similar to system/domainspec axioms) | Universal (ontology) | (likely exploratory) | (likely versioned) |
| `/vault/axiom/frontend-axioms.md` | (assumed) frontend design axioms | (UI-specific axioms) | Universal (UI layer) | (status unknown) | (versioned) |
| `/vault/axiom/category-theory-compilation-axiom.md` | Category-theoretic formalization of compilation invariant (L1→L2 functor) | (formal mathematical statement) | Universal (methodology formalization) | (draft-like) | (likely low veracidade pending L1/L2 extraction maturity) |
| `/vault/premise/domainspec-premises.md` | 12 DomainSpec methodology bets | premise-id \| statement \| convicção \| veracidade \| validation-status | Universal (methodology) | Exploratory (v 0.1.0) | explicit convicção/veracidade per premise |
| `/vault/premise/system-premises.md` | System layer bets | (similar structure) | Universal (architecture) | (status unknown) | (versioned) |
| `/vault/premise/ontology-premises.md` | Ontology layer bets | (similar structure) | Universal (ontology) | (status unknown) | (versioned) |
| `/vault/premise/frontend-premises.md` | UI design bets | (similar structure) | Universal (UI) | (status unknown) | (versioned) |
| `/vault/premise/domainspec-subagents-strategy-premises.md` | Premises specific to multi-agent dispatch | (similar structure) | Universal (methodology) | (status unknown) | (versioned) |
| `/vault/premise/multi-agent-composition-premise.md` | Multi-agent composition bets | (similar structure) | Universal (orchestration) | (status unknown) | (versioned) |
| `/vault/premise/robot-talks-premises.md` | Robot-talks dispatch mode premises | (similar structure) | Universal (orchestration) | (status unknown) | (versioned) |
| `/vault/constitution/ontology-constitution.md` | Governance rules for vault structure (formal ontology Constitution — deprecated; see ontology-conventions.md) | (legacy; superseded) | Universal (meta) | Superseded | status: legacy |
| `/vault/constitution/domain-tagging-constitution.md` | 12 rules for `@biz`/`@sys` code annotation and dictionary structure | rule-id \| rule-statement \| heuristics-or-examples | Universal (governance) | Draft (v 0.3.0) | explicit procedures, review checklist |
| `/vault/constitution/event-system-constitution.md` | Rules for domain events: typed payload, immutability, actor classification | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/development-practices-constitution.md` | Governance rules for development workflow | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/edge-acyclicity-constitution.md` | Rule: vault knowledge graph must remain acyclic | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/domainspec-subagents-strategy-constitution.md` | Governance for multi-agent dispatch strategy | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/research-constitution.md` | Rules for research node structure and evidence | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/discovery-structure-constitution.md` | Rules for discovery node format and epistemic chain | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/commit-message-constitution.md` | Rules for commit message structure | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/cross-repo-canonicalization-protocol-constitution.md` | Rules for syncing canonical definitions across repos | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/frontmatter-ownership-constitution.md` | Rules for frontmatter field ownership and mutability | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/folder-structure-constitution.md` | Rules for vault folder organization | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/constitution/schema-amendment-discipline-constitution.md` | Rules for amending vault schema | (assumed structure) | Universal (governance) | (status unknown) | (versioned) |
| `/vault/discovery/domainspec-vault-foundations/README.md` | Navigation guide: vault classification schema | (organizational; not a definition surface itself) | Universal (meta) | Draft | scope and domain axes pending |
| `/vault/discovery/domainspec-vault-foundations/epistemic-chain.md` | Knowledge lifecycle: research→discovery→premise→axiom→constitution with entry/exit criteria | epistemic-role \| challenge-response \| lifecycle-position | Universal (meta) | Draft | foundational for all vault classification |
| `/vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | Design space: should `layer` field split into `scope` (epistemic level) + `domain` (subject matter)? | (options, trade-offs, open questions) | Universal (meta-governance) | Exploratory | unresolved design decision |
| `/vault/discovery/domainspec-axioms/research/domainspec-findings.md` | Empirical findings from axiom research | (RCT-style structured findings) | Universal (empirical) | (research status) | evidence-based |
| `/vault/discovery/domainspec-axioms/research/domainspec-research.md` | Raw research on axiom evidence | (unstructured research notes) | Universal (research) | (exploratory) | work-in-progress |
| `/vault/discovery/domainspec-strategy-definitions/subagents-strategy.md` | Strategy definition: how to dispatch parallel subagents | (strategy specification) | Universal (orchestration) | (status unknown) | (versioned, likely references parametrization) |
| `/vault/discovery/domainspec-vault-edges/research/findings.md` | Edge-type taxonomy findings | (findings per discovery pattern) | Universal (meta) | (research status) | derives from edge-catalog audit |
| `/vault/discovery/data-contract-as-formal-artifact/README.md` | Discovery: position paper on data contracts as formal definitions | (discovery context) | Universal (research) | Draft | node_type: discovery |
| `/governance/tags/CODE-TAG-SCHEMA.md` | Code tag contract: required/optional fields for `@biz` and `@sys` annotations | concept.id \| concept.type \| concern \| spec_ref \| edges[] | Universal (governance) | Reference | YAML schema specification |
| `/governance/tags/CODE-TAG-COMPOSABILITY-PATTERNS.md` | Patterns for composable code annotation (assumed) | (pattern definitions) | Universal (governance) | (status unknown) | (reference doc) |
| `/governance/tags/CODE-TAG-DRIFT-REPORT.md` | Analysis of code tag alignment gaps (meta-report) | (assumed) | Universal (audit) | (audit doc, refreshable) | audit report structure |
| `/governance/tags/CODE-TAG-WAIVERS.md` | Recorded exceptions to code tag requirements | (assumed) | Universal (governance) | (reference) | explicit exception list |
| `/governance/tags/README.md` | Navigation for governance/tags/ folder | (organizational) | Universal (meta) | Reference | folder guide |
| `/governance/README.md` | Navigation for governance/ folder | (organizational) | Universal (meta) | Reference | folder guide |
| `/implementation/GOVERNANCE-SIGNALS.md` | Signal schema: inner loop (IS-001..IS-016) + outer loop (M-001..M-013) metrics | signal-id \| signal-name \| definition \| collection-point \| threshold \| interpretation | Universal (meta-governance) | Reference (active) | 6 metric categories, success thresholds |
| `/docs/features/payment-processing/SPEC.md` | Feature overview: concepts table, aspect links, cross-feature dependencies | concept \| id \| type \| description \| source \| feature-aspects | Domain-specific (payment-processing) | Filled template | frontmatter: feature spec |
| `/docs/features/payment-processing/domain.md` | Entities, value objects, enums for payment-processing | entity-name \| field \| type \| required \| description | Domain-specific | Filled from template | table-driven, state machine links |
| `/docs/features/payment-processing/operations.md` | Business operations (ProcessPayment, RefundPayment, RetryPayment, FeeCalculation) | operation-name \| actor \| trigger \| inputs \| rules \| calculations \| state-transition \| postconditions \| errors | Domain-specific | Filled from template | rule table, calculation formulas |
| `/docs/features/payment-processing/states.md` | State machine: PaymentStatus (8 states, mermaid diagram, transitions, invariants) | state \| terminal? \| from \| event \| to \| guard \| effect \| invariant-id \| formal | Domain-specific | Filled from template | mermaid diagram, formal invariants |
| `/docs/features/payment-processing/interfaces.md` | PaymentAPI (REST), PaymentModule (internal) | endpoint-path \| method \| auth \| request-field \| response-status \| internal-method | Domain-specific | Filled from template | explicit concept-field mappings |
| `/docs/features/payment-processing/events.md` | PaymentInitiated, PaymentCompleted, PaymentFailed, RefundCompleted | event-name \| produced-by \| triggers-transition \| payload-field \| consumer \| action | Domain-specific | Filled from template | explicit producer-consumer edges |
| `/docs/features/payment-processing/queries.md` | GetPaymentStatus, GetPaymentHistory with filters and output shapes | query-name \| filters \| output-shape | Domain-specific | Filled from template | (inferred from template) |
| `/docs/features/payment-processing/mappings.md` | RequestToTransaction (inbound), TransactionToResponse (outbound) | mapping-name \| from→to \| field-mapping \| defaults \| validation | Domain-specific | Filled from template | transformation rules |
| `/docs/features/payment-processing/workflows.md` | (assumed) orchestration of payment operations | (from TAXONOMY reference) | Domain-specific | (assumed template) | (versioned) |
| `/docs/features/payment-processing/glossary.md` | Feature-specific glossary | term \| meaning \| related-concepts | Domain-specific | Template | frontmatter: feature, docType, status |
| `/docs/features/gitops-assessment/SPEC.md` | Feature overview | (same structure as payment-processing) | Domain-specific | (likely filled) | (versioned) |
| `/docs/features/agent-execution-orchestrator/SPEC.md` | Feature overview | (same structure as payment-processing) | Domain-specific | (likely filled) | (versioned) |
| `/.claude/skills/custom/domain-dictionary.md` | Skill: rules for dictionary entry structure (H3 heading + prose + optional aliases) | term \| description \| aliases-codebase \| aliases-conversation | Universal (meta) | Reference (procedural) | Authority: domain-tagging-constitution.md |
| `/.claude/skills/custom/frontmatter.md` | Skill: frontmatter reference for every YAML field and value | field \| values \| meaning \| applicability | Universal (reference) | Reference (authoritative) | comprehensive field catalog |
| `/.claude/skills/custom/frontmatter-semantics.md` | Skill: semantic meaning of frontmatter combinations | (assumed) | Universal (reference) | Reference | (status unknown) |
| `/.claude/skills/custom/edge-catalog.md` | Skill: legality matrix for edges (source/target node_type pairs, cardinality, directionality carve-outs) | forward-edge \| inverse \| source-node_type \| target-node_type \| cardinality \| definition | Universal (meta) | Reference (authoritative) | defines bidirectionality rules, exceptions |
| `/.claude/skills/custom/edges.md` | Skill: edge picker (30-second decision for "which edge type applies") | (decision-tree / glossary form) | Universal (reference) | Reference | brief author-facing guide |
| `/.claude/skills/custom/domain-tagging-code.md` | Skill: rules for placing `@biz`/`@sys` tags in docstrings | (procedural rules + code examples) | Universal (procedural) | Reference | references domain-tagging-constitution.md |
| `/.claude/skills/custom/discovery-writing.md` | Skill: discovery document structure and epistemic chain positioning | (structure template + narrative) | Universal (procedural) | Reference | references epistemic-chain.md |
| `/.claude/skills/custom/domainspec-findings-writing.md` | Skill: domainspec findings document structure | (structure template) | Universal (procedural) | Reference | (status unknown) |
| `/.claude/skills/custom/domainspec-research-writing.md` | Skill: domainspec research document structure | (structure template) | Universal (procedural) | Reference | (status unknown) |

---

## 2. Schema Drift Findings

### 2.1 Glossary Schemas Diverge

- `/docs/glossary.md` (filled): 4-col (term | definition | feature(s) | see-also).
- `/templates/glossary.md` (template): 2+ sections with 5-col tables and concept-IDs + source anchors.
- Filled instance is **simpler** than template prescribes. `domainspec-sync-registry` should reconcile; not known whether it's run operationally.

### 2.2 Concept Registry vs Feature SPEC (Source-of-Truth Ambiguity)

- `/docs/registry.md` (global): per-type sections with feature rows.
- Each `docs/features/*/SPEC.md`: inline concept registry table.
- Global registry is **derivable from** feature SPECs. Hand-edits to global registry lose fidelity. Implicit rule: SPEC tables are source; global registry is auto-synced. Not codified anywhere.

### 2.3 Templates Don't Embed Their "Why"

- `TAXONOMY.md` carries the decision criteria (when to use entity vs value object, etc.).
- `/templates/domain.md` only carries the table structure.
- Agents filling templates must cross-reference TAXONOMY. Templates should embed link-back comments.

### 2.4 State Machine Schema Conflicts

- `/templates/states.md`: mermaid + transition table (from/event/to/guard/effect) + invariants.
- `RELATIONSHIPS.md`: defines `transitions` edge but no cardinality table.
- `/templates/rules.md`: rules with P-R-1..P-R-3 IDs.
- Rules that guard transitions live in `rules.md`; state machine has a "Guard" column → two sources, no sync rule.

### 2.5 Rules Live in Multiple Surfaces

- `/templates/rules.md`: stable IDs (R1, F1, P-X-1), formal expressions, "Checked by".
- `/templates/operations.md`: rules inline within operation definitions.
- Payment-processing has **both** `operations.md` (with rules) and `rules.md` (separate). No guidance on which is canonical.

### 2.6 Confidence Dimensions Under-Applied

- `ontology-conventions.md`: `veracidade` (evidence) + `convicção` (commitment), required for axiom/premise, optional for discovery/audit.
- Many vault nodes carry neither. When `discovery` has no confidence dims — is that intentional (non-belief) or oversight?

---

## 3. Duplications and Conflicts

| Type | Surfaces | Severity | Current Governance |
|------|----------|----------|-------------------|
| Synonym duplication | TAXONOMY meta-types vs registry column headers | Low | TAXONOMY canonical by location; no sync rule |
| Authority duplication | `/CONSTITUTION.md` vs `/vault/constitution/` files | **High** | AUTHORITY-MAP lists only root CONSTITUTION; vault constitutions orphaned |
| Modification surface duplication | SPEC concept table vs RELATIONSHIPS edges for cross-feature deps | Medium | No sync rule; manual coordination |
| Schema evolution lag | `/templates/glossary.md` vs `/docs/glossary.md` | Medium | `domainspec-sync-registry` should rebuild; status unclear |
| Scattered rule definitions | rules.md AND inline in operations.md | Medium | No consistent rule stated |
| Code tagging surfaces | `/vault/constitution/domain-tagging-constitution.md` + `/governance/tags/CODE-TAG-SCHEMA.md` + `/.claude/skills/custom/domain-tagging-code.md` | Medium | Constitution authoritative; CODE-TAG-SCHEMA does not reference constitution → orphan risk |

---

## 4. Universal-vs-Domain Patterns Observed

### 4.1 Established Patterns

- **Meta-Schema Layer (Universal):** TAXONOMY.md, RELATIONSHIPS.md, ontology-conventions.md, AUTHORITY-MAP.md, all `/templates/*.md`.
- **Domain-Specific Instantiation:** `/docs/features/{feature}/*.md` files.
- **Hybrid:** `/docs/glossary.md` and `/docs/registry.md` (template is universal; filled content is domain-aggregated).
- **Vault axioms/premises/constitutions:** mixed — some universal (system-axioms), some methodology-universal (domainspec-axioms), no per-feature domain axioms observed.

### 4.2 Missing Patterns

- No `/templates/feature-pack.md` describing the multi-file feature pack structure (SPEC + domain + operations + states + interfaces + events + queries + mappings + glossary). The feature pack is **inferred from usage**, not codified as a meta-structure.
- No per-domain axiom surface (e.g., no payment-processing axioms separate from system axioms).
- No explicit precedence rule for when a domain-specific axiom may override a universal one.

### 4.3 Implicit Layered Authority

From AUTHORITY-MAP, layering is implicit:

- **L4 Axiomatic:** AXIOMS.md, AUTHORITY-MAP.md, TAXONOMY.md, RELATIONSHIPS.md, CONSTITUTION.md.
- **L3 Governance:** vault/axiom, vault/premise, vault/constitution.
- **Domain:** docs/features/{feature}/*.
- **Implementation:** code (out of scope).

Layering is implicit, not explicitly stated as a meta-schema.

---

## 5. Edge Taxonomy in Use

### 5.1 Three Independent Edge Namespaces

| Namespace | Source | Examples | Purpose |
|-----------|--------|----------|---------|
| **Vault (epistemic)** | `vault/ontology-conventions.md` Appendix C, `edge-catalog.md` | `derives-from`, `cites`, `contradicts`, `codified-as`, `operationalized-by`, `implements`, `validates`, `refines`, `governed-by`, `creates`, `modifies`, `revisits`, `refutes`, `opens-question`, `closes-question` | Connect knowledge artifacts |
| **Domain (concept relations)** | `/RELATIONSHIPS.md` | `enforces`, `produces`, `triggers-cross`, `transitions`, `exposes`, `orchestrates` | Connect business concepts |
| **Code (symbolic)** | `/governance/tags/CODE-TAG-SCHEMA.md` | edges in YAML schema (concept→concept in docstrings) | Connect code symbols to concepts |

### 5.2 Naming Collision Risk

A `produces` edge in **domain space** (`Operation → Event`) is different from a `produces` edge in **vault space** (deprecated). Both systems are "typed edges" with no namespace prefix. Author confusion risk is real.

### 5.3 Directionality Discipline

`ontology-conventions.md` defines bidirectionality + two carve-outs (skills/agents forward-only-by-target; sessions forward-only-by-source). `CODE-TAG-SCHEMA.md` adds "edges are canonical outbound from the tagged concept." Discipline exists, but the carve-outs are complex.

### 5.4 Under-Used Edges

`subclass-of`, `part-of`, `alternative-to` defined in `edge-catalog.md` but not observed in sampled artifacts.

---

## 6. Dead Zones / Abandoned Surfaces

| Artifact | Status | Signal | Recommendation |
|----------|--------|--------|-----------------|
| `vault/ontology-constitution.md` | Foundational but superseded by `ontology-conventions.md` | Low activity; philosophical vs operational split | Archive as historical reference |
| `starter/glossary.md`, `starter/registry.md` | Empty templates | No integration path documented | Either integrate into onboarding or remove |
| `docs/features/{gitops-assessment, agent-execution-orchestrator}` | Status unknown | Not in AUTHORITY-MAP | Clarify active vs example status |
| `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | Exploratory, OQ-6 deferred | Foundational debate unresolved | Accept as work-in-progress; track debt |
| **L1/L2/Δ extraction machinery** | **Aspirational but degenerate** | P-DS-2/P-DS-3 demoted; extractors emit only degenerate outputs; not invoked in any pipeline | Either activate with CI gates or archive as research |
| `docs/registry.md` sync | Documented but no enforcement | `domainspec-sync-registry` skill exists; unclear if run | Add registry-sync to CI gates; measure M-009 operationally |
| Code tagging enforcement | Partially enforced | WAIVERS + DRIFT-REPORT suggest gaps, not resolution | Escalate non-conformance to blocking status or archive schema |
| M-001..M-013 governance metrics | Defined on paper | No data source, no collection cadence visible | Specify (source, cadence, threshold, escalation) per metric or archive |

---

## 7. Quick Recommendations for Upstream Research

The following gaps should be explicitly addressed by the upstream 5-lens research dispatch (`formal-definitions-layer`).

1. **Schema proliferation & drift risk.** Define a canonical-source principle per concept type. Lens: A1-meta (schema) + A3 (governance).
2. **Universal-vs-domain boundary underspecified.** Propose a layered authority model with explicit precedence. Lens: A1-domain.
3. **Rule definition surfaces fragmented.** Propose rule definition lifecycle (author SPEC → check TEST-SPEC → enforce code+CI) with sync gates. Lens: A1-meta + A3.
4. **Confidence dimensions under-applied.** Propose confidence assignment algorithm (auto-infer from node_type or make required). Lens: A2 (elicitation) + A3.
5. **Cross-artifact traceability inconsistent.** Propose unified traceability schema (Checked by + Produced by + Consumes + derives-from + code-tag edges → single query surface). Lens: A1-meta + A3.
6. **Categorization tensions (node_type vs layer vs nature).** Propose orthogonality audit of frontmatter axes. Lens: A1-meta.
7. **Schema amendment discipline unclear.** Propose meta-governance protocol for amending foundational schemas; define breaking vs additive. Lens: A3 + A4.
8. **Operational verification aspirational.** Propose verification maturity ladder (L1 automated → L4 infeasible). Lens: A4.
9. **Edge taxonomy overloaded (3 namespaces).** Propose namespace scheme (`domain:` / `vault:` / `code:`) or explain why they must remain separate. Lens: A1-meta + A1-domain.
10. **Coverage saturation & meta-health metrics need grounding.** Propose implementation roadmap per metric (data source, cadence, threshold, escalation). Lens: A3 + A4.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../discovery.md` | `derives` | This inventory is the empirical substrate the `formal-definitions-layer` discovery stands on (inverse of the discovery's `derives-from` toward this file). |
| `../../../knowledge-calibration-geometry/discovery.md` | `cites` | Source of the calibration-geometry framing this layer materializes as the reference surface. |
| `../../../../templates/initial-definitions.md` | `cites` | Existing template for definition elicitation; major substrate audited here. |
| `../../../../TAXONOMY.md` | `cites` | Universal meta-type vocabulary; load-bearing for the universal-vs-domain split analysis. |
| `../../../../RELATIONSHIPS.md` | `cites` | Universal edge vocabulary (domain namespace); load-bearing for edge taxonomy analysis. |
| `../../../../vault/ontology-conventions.md` | `cites` | Vault frontmatter + edge schema (epistemic namespace); load-bearing. |
| `../../../../governance/tags/CODE-TAG-SCHEMA.md` | `cites` | Code tag schema (code namespace); load-bearing for the 3-namespace edge analysis. |
| `../../../domainspec-vault-foundations/scope-and-domain-axes.md` | `cites` | Open debate on splitting `layer` into `scope` + `domain` — directly relevant to the meta-vs-domain question this research engages. |
