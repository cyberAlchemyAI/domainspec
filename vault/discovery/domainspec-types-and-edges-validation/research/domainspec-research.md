---
tags: [template, subagents, dispatch-artifact, subagents-research]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.1
last_updated: 2026-05-08
template_for: domainspec-subagents-research.md
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
dispatch_slug: domainspec-types-and-edges-validation
---

# Subagents-Research — `domainspec-types-and-edges-validation`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

Investigating DomainSpec's foundational catalog (`TAXONOMY.md`): 25 meta-concepts in 4+4 categories, with edges formalized in `RELATIONSHIPS.md` (29 canonical labels). User hinted at potential gaps — categories like `Pattern` with `SAGA`, and missing types/edges. Wave 1 surfaced that `RELATIONSHIPS.md` exists (edges are NOT implicit as initially framed) but only 8/29 edges are composability-enforced, and synthetic runtime types `Feature`/`Consumer` live outside `TAXONOMY.md`.

## Goal

Produce evidence-backed verdicts (adopt / defer / reject) per candidate category, meta-concept, and edge — and decide whether the edge catalog needs additions, renames, or composability-enforcement work.

## Dispatch metadata

- Mode: `task-fan-out` in two parallel waves (R19).
- Wave 1: C1 catalog-inventory (sonnet), C2 external-frame-survey (opus), C3 internal-pressure-audit (opus).
- Wave 2: C4 categories-and-pattern-meta-inquiry (opus), C5 edge-catalog-proposal (opus), C6 ui-symmetry-check (sonnet).
- Sequencing: Wave 2 children read Wave 1 outputs verbatim.
- Recursion budget: depth 2 / breadth 5 / total cap 10. Used 6 children. Within budget.

---

## Agent 1 — catalog-inventory: enumerate every meta-concept, template, example, and code-level enforcement artifact

I now have everything needed to produce the full inventory. Let me compile the output.

---

## C1 Output — Catalog Inventory

### Table 1 — Meta-concepts × categories

| Meta-concept | Category | Stack | One-line purpose | Template path | Example demonstration |
|---|---|---|---|---|---|
| Entity | Structural | Backend | Identity-bearing domain object with lifecycle and unique ID | `templates/domain.md` | `examples/payment-processing/domain.md` — PaymentTransaction |
| Value Object | Structural | Backend | Immutable, identity-less concept defined entirely by its field values | `templates/domain.md`, `templates/shared-value-object.md` | `examples/shared/money.md` — Money |
| Enum / Type | Structural | Backend | Fixed, finite set of named values that classify or categorize | `templates/domain.md` | `examples/payment-processing/domain.md` — PaymentMethod, PaymentErrorCode |
| Operation | Behavioral | Backend | Business action that changes state (mutation / write side) | `templates/operations.md` | `examples/payment-processing/operations.md` — ProcessPayment, RefundPayment, RetryPayment |
| Query | Behavioral | Backend | Read operation that retrieves data without side effects | `templates/queries.md` | `examples/payment-processing/queries.md` — GetPaymentStatus, GetPaymentHistory |
| Calculation | Behavioral | Backend | Pure, deterministic function that derives a value from inputs | `templates/operations.md` | `examples/payment-processing/operations.md` — FeeCalculation |
| Rule | Behavioral | Backend | Business constraint that must hold for an operation to proceed | `templates/operations.md` | `examples/payment-processing/operations.md` — R1 through R10 inside ProcessPayment |
| Policy | Behavioral | Backend | Decision logic that selects between strategies at runtime | `templates/workflows.md` | `examples/payment-processing/workflows.md` — RetryPolicy |
| Workflow | Behavioral | Backend | Multi-step orchestration of operations within one feature or context | `templates/workflows.md` | `examples/payment-processing/workflows.md` — RetryPaymentWorkflow |
| Saga | Behavioral | Backend | Cross-feature transactional orchestration with explicit compensation | `templates/workflows.md` | `examples/order-management/workflows.md` — OrderFulfillmentSaga |
| Interface | Connective | Backend | API boundary (REST, GraphQL, internal module contract) | `templates/interfaces.md` | `examples/payment-processing/interfaces.md` — PaymentAPI, PaymentModule |
| Event | Connective | Backend | Notification that a domain state change happened (past tense) | `templates/events.md` | `examples/payment-processing/events.md` — PaymentInitiated, PaymentCompleted, PaymentFailed, RefundCompleted |
| Mapping | Connective | Backend | Field-by-field data transformation between two shapes at a boundary | `templates/mappings.md` | `examples/payment-processing/mappings.md` — RequestToTransaction, TransactionToResponse |
| State Machine | Lifecycle | Backend | Formal specification of entity states, transitions, guards, effects, invariants | `templates/states.md` | `examples/payment-processing/states.md` — PaymentStatus (8 states, 9 transitions) |
| Page | UI Structural | UI | Routable URL view with layout and auth gate | `templates/ui-spec.md` | No dedicated example in `examples/`; demonstrated in `docs/features/knowledge-graph-visualization/UI-SPEC.md` |
| Layout | UI Structural | UI | Reusable page shell (sidebar, header, slot) shared across pages | `templates/ui-spec.md` | Same as Page — `docs/features/knowledge-graph-visualization/UI-SPEC.md` |
| Component | UI Structural | UI | Composable UI building block with typed props | `templates/ui-spec.md` | Same as Page |
| View Model | UI Structural | UI | Typed data shape optimized for rendering, derived from entities | `templates/ui-spec.md` | Same as Page |
| Hook | UI Behavioral | UI | Encapsulated reactive data/state logic exposed as a composable function | `templates/ui-spec.md` | Same as Page |
| Form | UI Behavioral | UI | Schema-validated user input contract (fields + Zod schema + error mapping) | `templates/ui-spec.md` | Same as Page |
| Action | UI Behavioral | UI | User-triggered mutation or navigation (event handler calling mutation hook) | `templates/ui-spec.md` | Same as Page |
| Guard | UI Behavioral | UI | Client-side access gate based on auth / permissions | `templates/ui-spec.md` | Same as Page |
| Binding | UI Connective | UI | Named connection between a hook and a specific API endpoint | `templates/ui-spec.md` | Same as Page |
| Adapter | UI Connective | UI | Data shape transformation at the UI boundary (API response → view model) | `templates/ui-spec.md` | Same as Page |
| State Indicator | UI Presentational | UI | Visual encoding of a domain state value (badge, icon, color map) | `templates/ui-spec.md` | Same as Page |

**Notes on Table 1:**
- All 11 UI meta-concepts share a single template file (`templates/ui-spec.md`). There is no dedicated `examples/` entry for any UI meta-concept. The only live UI example is `docs/features/knowledge-graph-visualization/UI-SPEC.md`, which is a real feature spec, not a curated example.
- Calculation, Rule, and Policy all share `templates/operations.md` (Calculation/Rule) or `templates/workflows.md` (Policy) as their template. They are not self-standing template files.
- Saga uses `templates/workflows.md` (same as Workflow). No dedicated saga template file exists.
- Shared Value Objects have a separate template: `templates/shared-value-object.md`.

---

### Table 2 — Implicit edges

These are relationships expressed through natural-language phrases or structural conventions inside templates or TAXONOMY.md prose, but not formalized as named edges in `RELATIONSHIPS.md`.

| Source meta-concept | Target meta-concept | Natural-language phrase in template | File:line |
|---|---|---|---|
| Entity | State Machine | `**Lifecycle:** See [{StateMachineName}](states.md#...)` | `templates/domain.md:21` |
| Entity | Operation | `**Operations:** [{OperationName}](operations.md#...)` | `templates/domain.md:22` |
| Event | Operation | `**Produced by:** [{OperationName}](operations.md#...)` | `templates/events.md:11` |
| Event | State Machine | `**Triggers transition:** [{FromState} → {ToState}](states.md#...)` | `templates/events.md:12` |
| Event | (untyped consumer) | `### Consumed by` table with `Consumer | Action` columns | `templates/events.md:22-24` |
| Interface (external) | Operation | `**Exposes:** [{OperationName}](operations.md#...)` + request `Maps To` column | `templates/interfaces.md:13, 18` |
| Interface (external) | Operation | Request field row: `Maps To` → `[OperationName](operations.md#...).{field}` | `templates/interfaces.md:18-21` |
| Interface (internal) | Operation | `Maps To` column: `{OperationName} operation` | `templates/interfaces.md:36-37` |
| Interface (internal) | Query | `Maps To` column: `{QueryName} query` | `templates/interfaces.md:37` |
| Operation | Entity | `State Transition: [{Entity}](domain.md#...): {FromState} -> {ToState}` | `templates/operations.md:40-41` |
| Workflow | Operation | `**Orchestrates:** [{Op1}](operations.md#op1), [{Op2}](operations.md#op2)` | `templates/workflows.md:13` |
| Workflow | Operation | Step Table `Operation` column: `[{OperationName}](operations.md#)` | `templates/workflows.md:32-33` |
| Workflow | Operation | Step Table `Compensation` column: `[{CompensationOp}](operations.md#)` | `templates/workflows.md:33` |
| Policy | Workflow | `**Applies To:** <!-- {WorkflowName} step # or {OperationName} -->` | `templates/workflows.md:47` |
| Query | Entity | Output table `Source` column: `[EntityName](domain.md#entityname).fieldName` | `templates/queries.md:30-32` |
| Query | Entity | `### Reads From` table: `Entity | Relationship | Fields Used` | `templates/queries.md:33-39` |
| Mapping | (source type) | `**From:** {SourceType}` (free-text, not a typed link) | `templates/mappings.md:11` |
| Mapping | (target type) | `**To:** {TargetType}` (free-text, not a typed link) | `templates/mappings.md:12` |
| Value Object | (cross-feature) | `**Shared:** [docs/shared/{name}.md](...)` | `templates/domain.md:30` |
| View Model | Entity | `Source entity reference` note inside hook return type / Data Flow section | `templates/ui-spec.md` (prose in TAXONOMY.md:394-398) |
| State Indicator | State Machine / Enum | `<!-- Cross-layer edge: reflects → State Machine / Enum -->` comment | `templates/ui-spec.md:122` |
| Form | Interface | `<!-- Cross-layer edge: contracts → Interface -->` comment | `templates/ui-spec.md:95` |
| Component | Hook | `<!-- Cross-layer edges: each component may consume Hooks -->` comment | `templates/ui-spec.md:65` |
| Binding (Hook) | Query | `<!-- Cross-layer edges: fetches → Query -->` Data Flow comment | `templates/ui-spec.md:76` |
| Binding (Hook) | Operation | `<!-- Cross-layer edges: mutates → Operation -->` Data Flow comment | `templates/ui-spec.md:76` |

**Key observation:** The `templates/ui-spec.md` file has explicit cross-layer edge annotations buried inside HTML comments (lines 65, 76, 95, 122). These edges (`reflects`, `contracts`, `consumes/fetches/mutates`) ARE formally named in `RELATIONSHIPS.md`, so they are not "missing" from the vocabulary — but they are documented only in template comments, not enforced by the template structure itself. The `Consumed by` table in `templates/events.md` is the clearest gap: it captures consumer-action pairs in free text with no typed edge.

---

### Table 3 — Code-level enforcement

| Artifact path | Role | Types / edges touched | Brief notes |
|---|---|---|---|
| `governance/tags/tools/extract-code-tags.ts` | Extractor | All 25 meta-concept types (reads `TAXONOMY.md` via validate step); all 29 canonical edges from `RELATIONSHIPS.md` | Scans `backend/src` and `apps/web/src` for `/** domainspec: ... */` JSDoc blocks; outputs `governance/tags/code-tags.json`. Supports TS, TSX, JS, JSX, Python. |
| `governance/tags/tools/lib/code-tag-adapters/js-like.ts` | Extractor (adapter) | Parses `domainspec:` YAML inside JSDoc `/** */` blocks | Core extraction logic for JS/TS family; detects next symbol after the JSDoc block. |
| `governance/tags/tools/lib/code-tag-adapters/py.ts` | Extractor (adapter) | Python-language variant of same extraction | Handles `.py` files via separate adapter. |
| `governance/tags/tools/validate-code-tags.ts` | Validator | All 25 meta-concept types (via `TAXONOMY.md`); all 29 canonical edges (via `RELATIONSHIPS.md`); concept catalog (via `docs/features/**/SPEC.md`) | Checks: concept type must exist in `TAXONOMY.md`; edge labels must be canonical per `RELATIONSHIPS.md`; edge type constraints (from-type/to-type compatibility); concept.id must match a known concept in the SPEC catalog; duplicate symbol-to-concept mappings; optional `spec_ref` alignment. Severity codes CT-001 through CT-00x. |
| `governance/tags/tools/lib/code-tag-rules.ts` | Rules engine | Parses `TAXONOMY.md` for valid type names; parses `RELATIONSHIPS.md` for edge directional rules (`from → to` type constraints); loads concept catalog from SPEC files | Used as a shared library by `validate-code-tags.ts` and `compare-code-tag-drift.ts`. `parseTaxonomyTypes()` reads the meta-concept table rows. `parseRelationshipRules()` reads `| \`edge\` | From → To |` rows. |
| `governance/tags/tools/check-code-tag-composability.ts` | Validator (composability) | Edges: `enforces`, `calculates`, `applies`, `exposes`, `mutates`, `fetches`, `orchestrates`, `enforces-cross` (8 of 29 edges); types: `rule`, `operation`, `calculation`, `policy`, `interface`, `query`, `binding`, `workflow` | Checks that when edge X connects A→B, B's implementation calls A (or A calls B, depending on direction). Codes CT-COMP-001 through CT-COMP-009. Does NOT cover: `produces`, `transitions`, `contains`, `queries`, `emits`, `performs`, `maps`, all intra-UI edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`), and cross-layer edges `reflects`, `derives`, `contracts`, `mirrors`. |
| `governance/tags/tools/compare-code-tag-drift.ts` | Drift detector | All concept types; all edges | Compares tag types in source code against types declared in SPEC concept table; reports mismatches (code says `Rule`, SPEC says `Calculation`, etc.). Also reports edge drift. Outputs `governance/tags/CODE-TAG-DRIFT-REPORT.md`. |
| `tools/validate-relationships.ts` | Validator (spec edges) | All 29 canonical edge labels from `RELATIONSHIPS.md` | Scans every `docs/features/**/SPEC.md` for `## Cross-Feature Dependencies` and `## Feature Concept Graph` tables; flags any edge label not present in `RELATIONSHIPS.md`. Levenshtein-based suggestions for misspellings. |
| `tools/generate-registry.ts` | Extractor + validator | All meta-concept types (from SPEC concept tables); all 29 canonical edges (from SPEC feature-concept-graph tables); older `@biz / @sys` inline tag format | Generates `docs/registry.json` from SPEC files. Validates edge labels against `RELATIONSHIPS.md`, checks for missing concept endpoints, flags duplicates. Also scans `backend/src` and `apps/web/src` for the legacy `@(biz\|sys) <conceptId> | type: <type>` inline comment format (different from the YAML `domainspec:` block format used by `extract-code-tags.ts`). |
| `tools/validate-orphans.ts` | Validator (coverage) | All concept types (indirectly — reads registry.json) | Checks that concepts in SPEC have a code anchor, and code anchors reference known concepts. Enforces concept-to-code coverage ratios. |
| `tools/validate-doc-links.ts` | Validator (link integrity) | All files in `docs/features/` | Validates that markdown links within feature docs resolve to real targets. Does not directly enforce types or edges, but keeps cross-file concept links live. |
| `backend/src/modules/knowledge-graph/infrastructure/markdown-canonical-edge-vocabulary.ts` | Runtime loader | All 29 canonical edges | Reads `RELATIONSHIPS.md` at runtime and builds a `Set<string>` of canonical edge names for the KG mirror rebuild. Throws `MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE` if the file is missing or empty. |
| `backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts` | Runtime extractor | `AspectKind` values (`SPEC`, `DOMAIN`, `OPERATIONS`, `QUERIES`, `INTERFACES`, `MAPPINGS`, `WORKFLOWS`, `EVENTS`, `STATES`); edge labels from `Feature Concept Graph` table; `produces-for` synthetic edge; cross-feature `depends-on` edges | Parses SPEC.md sections at runtime: Concepts table, Feature Concept Graph table, Cross-Feature Dependencies table, Produces For table. Normalizes edge labels (aliases: `query` → `queries`, `interface` → `exposes`). The `AspectKind` enum in `domain/models.ts` maps 9 file names to aspect categories — it does NOT include `ui-spec.md`, meaning UI aspects are not parsed at runtime. |
| `backend/src/modules/knowledge-graph/domain/models.ts` | Domain model | Types: `Entity`, `View Model`, `Mapping`, `Value Object` (via JSDoc `domainspec:` tags on the model interfaces themselves) | Defines `AspectKind` as a union of 9 file-based buckets (no UI-SPEC). The `REQUIRED_MIRROR_FILES` constant requires only `SPEC.md`, `domain.md`, and `operations.md`. The inline JSDoc tags on this file itself demonstrate the code-tagging contract. |
| `governance/tags/CODE-TAG-SCHEMA.json` | Schema definition | All types and edges (declarative schema) | JSON Schema file defining the canonical shape of `domainspec:` YAML tags for tooling use. |

---

### Notes

**Anomalies and naming inconsistencies:**

1. **Dual tag formats exist in the codebase.** `generate-registry.ts` scans for the legacy `@biz <conceptId> | type: <type>` inline comment format (regex: `/@(biz|sys)\s+([^|\n]+)\|\s*type:\s*([a-zA-Z-]+)/`). The governance `extract-code-tags.ts` suite uses the newer `/** domainspec: ... */` YAML block format. No source files in `backend/src` were found to use the `@biz/@sys` format — it may be a dormant scanner targeting a convention that was never adopted or has been fully migrated.

2. **`AspectKind` in the runtime domain model has no UI equivalent.** `models.ts` enumerates 9 aspect kinds mapping to 9 backend template files. `ui-spec.md` is absent. This means the KG mirror projection does not parse or index UI-layer concepts at runtime — the code-tagging pipeline (`extract-code-tags.ts`) is the only runtime mechanism that covers UI meta-concepts.

3. **Calculation, Rule, and Policy share template files** with Operation/Workflow. TAXONOMY.md lists them as distinct meta-concepts, but they have no standalone template. Rule and Calculation are always documented inline within an Operation's section. Policy is a standalone `## {PolicyName}` section inside `workflows.md`.

4. **Saga and Workflow share a template** (`templates/workflows.md`). The template has a single section format for both. The distinction is handled in the `**Type:**` field (`Type: Workflow` vs `Type: Saga`), not by a structural template difference.

5. **All 11 UI meta-concepts are served by a single template** (`templates/ui-spec.md`). Within it, each UI concept occupies a section (`Route Table` for Page/Layout/Guard; `Component Inventory` for Component/Form/State Indicator; `Data Flow` for Hook/Binding/Action/View Model; etc.). There is no `examples/*/ui-spec.md` — the only example is the live feature spec at `docs/features/knowledge-graph-visualization/UI-SPEC.md`.

6. **`produces-for` edge is synthetic.** The KG runtime parser hard-codes `produces-for` as a constant (`PRODUCES_FOR_EDGE_LABEL = "produces-for"`) and creates synthetic `Consumer` concept nodes from the `## Produces For` SPEC table section. This edge exists in `RELATIONSHIPS.md` but is the only edge generated by a dedicated parser path, not from the generic `Feature Concept Graph` table. The concept type `"Consumer"` and `"Feature"` appear as synthetic taxonomy types created in the parser — they are not listed in `TAXONOMY.md`.

7. **`Feature` and `Consumer` are synthetic concept types** used by `markdown-feature-docs-parser.ts` (`taxonomyType: "Feature"` and `taxonomyType: "Consumer"`) for cross-feature graph nodes. Neither `Feature` nor `Consumer` appears in `TAXONOMY.md` as a meta-concept. This is a de-facto catalog extension not visible in the taxonomy doc.

8. **Composability checker covers only 8 of 29 edges.** `check-code-tag-composability.ts` has explicit rules for: `enforces`, `calculates`, `applies`, `exposes` (×2), `mutates`, `fetches`, `orchestrates`, `enforces-cross`. The remaining 21 edges (`produces`, `transitions`, `contains`, `queries`, `emits`, `performs`, `maps`, `produces-for`, `triggers-cross`, and all 8 intra-UI + 4 cross-layer edges) have no composability enforcement.

9. **`REQUIRED_MIRROR_FILES` requires only 3 files** (`SPEC.md`, `domain.md`, `operations.md`). The other 6 aspect files (`queries.md`, `interfaces.md`, `mappings.md`, `workflows.md`, `events.md`, `states.md`) are optional from the runtime's perspective.

10. **No `user-account` example has a `workflows.md`.** The `examples/user-account/` directory contains domain, events, interfaces, mappings, operations, queries, states, and SPEC but no `workflows.md`. This means Workflow, Saga, and Policy have no user-account example demonstration.

11. **The `edge` normalizer in `markdown-feature-docs-parser.ts`** explicitly aliases `"query"` → `"queries"` and `"interface"` → `"exposes"` (lines 619–629). These aliased labels are not documented in `RELATIONSHIPS.md` — if someone writes `query` or `interface` in a SPEC graph table, it silently succeeds at runtime but would fail `validate-relationships.ts` (which checks exact canonical labels).

---

## Agent 2 — external-frame-survey: enumerate candidate meta-concepts from DDD, CQRS, EIP, hexagonal, and UI canon that DomainSpec lacks

**Route identification**: This task is a subagents-strategy child dispatch (Route 13). I am child C2 doing an external-frame survey. Per instructions R5, I do NOT write files — I return Markdown as my final message. I do NOT need to read DomainSpec internals (that's C1/C3). I do NOT need GitNexus or semantic-index tools — the survey is theoretical, not codebase-grounded.

No tool calls needed. Producing the survey directly.

---

## C2 Output — External Frame Survey

### Backend candidates

| Candidate | Definition (1 sentence) | Why it doesn't fit any existing DomainSpec meta-concept | Severity | Canonical source |
|-----------|------------------------|----------------------------------------------------------|----------|------------------|
| Aggregate | A cluster of associated objects treated as a single unit for data changes, with a defined consistency boundary and transactional invariants. | Entity is a single identity-bearing object; it doesn't encode a *boundary* (which entities/VOs are inside, what invariants hold across them, what the transactional unit is). Aggregate is the load-bearing DDD concept; without it, "Entity" silently does two jobs. | essential | Evans, *Domain-Driven Design* (2003), ch. 6 "The Life Cycle of a Domain Object"; Vernon, *Implementing DDD* (2013), ch. 10. |
| Aggregate Root | The single Entity inside an Aggregate that serves as the only external entry point and guards the aggregate's invariants. | Entity is flat — every entity is equal. The "root-vs-internal" distinction (who external code may reference, who enforces invariants) is unexpressed. | essential | Evans, *DDD*, ch. 6. |
| Repository | An abstraction that provides collection-like access to Aggregates, encapsulating persistence and querying. | Interface is too generic (any contract); Mapping is structural translation. Repository specifically targets Aggregate lifecycle (load whole aggregate, save whole aggregate) and has invariants neither captures. | essential | Evans, *DDD*, ch. 6; Fowler, *PoEAA* (2002), "Repository" pattern. |
| Domain Service | A stateless operation that expresses domain logic which doesn't naturally belong to any single Entity or Value Object. | Operation in DomainSpec exists, but the *domain-service* distinction (logic that crosses aggregates, vs an aggregate method) is missing. Without it, cross-aggregate logic gets misplaced inside one aggregate. | essential | Evans, *DDD*, ch. 5 "A Model Expressed in Software". |
| Bounded Context | An explicit boundary within which a particular domain model is defined and applicable. | DomainSpec has no first-class notion of model scope/boundary — any term is implicitly global. Multiple meanings of "Account" or "Customer" cannot coexist cleanly. | essential | Evans, *DDD*, ch. 14; Vernon, *IDDD*, ch. 2. |
| Context Map | A named integration relationship between two Bounded Contexts (shared kernel, customer/supplier, conformist, ACL, etc.). | No meta-concept formalizes the *relationship between models*. Mapping handles field-to-field translation, not strategic context relationships. | essential (if Bounded Context lands) | Evans, *DDD*, ch. 14; Vernon, *IDDD*, ch. 3. |
| Anti-Corruption Layer | A translation layer that isolates one Bounded Context's model from another's, preventing semantic leakage. | Adapter (UI) and Mapping cover narrower shapes; ACL is specifically about *defending* a model from a foreign one. | nice-to-have | Evans, *DDD*, ch. 14. |
| Specification | A predicate-bearing object that encapsulates a business rule for selection, validation, or construction, and is composable (and/or/not). | Rule is closer but typically modeled as a yes/no constraint; Specification is reified, composable, and queryable (used in repositories too). | nice-to-have | Evans, *DDD*, ch. 9; Fowler & Evans, "Specifications" white paper (2003). |
| Factory | A construction operation that encapsulates the creation rules for a complex Aggregate or Value Object. | Operation can host it, but the *invariant-establishing-at-birth* semantic isn't named. Without it, construction logic leaks into application code. | nice-to-have | Evans, *DDD*, ch. 6; GoF, *Design Patterns* (1994), Factory Method / Abstract Factory. |
| Command | A named imperative request to change state, distinct from a Query. | Operation conflates command and query intent. CQRS literature treats them as fundamentally different (one mutates, one reads; different scaling/consistency). | essential (if CQRS posture is taken) | Meyer, *Object-Oriented Software Construction* (1997), Command-Query Separation; Young, "CQRS Documents" (2010). |
| Read Model / Projection | A denormalized view of state built specifically to serve a query, often derived from events. | Query is the *act*; the *projection* is the materialized artifact with its own lifecycle, rebuild semantics, and staleness model. View Model on the UI side is different (UI-shaped). | essential (if events/projections used) | Young, "CQRS Documents" (2010); Fowler, "Materialized View" (martinfowler.com bliki). |
| Event Store | An append-only log of domain events that is the system of record. | Not Interface, not Mapping. Event Store has unique semantics: append-only, replayable, the source of truth. | nice-to-have | Vernon, *IDDD*, ch. 8; Young & Fowler on Event Sourcing. |
| Snapshot | A periodically materialized state of an Aggregate, used to bound replay cost in event-sourced systems. | No existing concept; State Machine captures transitions but not the optimization checkpoint. | nice-to-have | Vernon, *IDDD*, ch. 8; Fowler, "Event Sourcing" bliki. |
| Outbox | A transactional table that buffers events for reliable post-commit publishing. | Crucial reliability pattern; no current home (not Mapping, not Workflow). | essential (if cross-service eventing exists) | Kleppmann, *Designing Data-Intensive Applications* (2017), ch. 11; Microservices.io "Transactional Outbox". |
| Inbox | A persisted record of consumed events used to enforce consumer idempotency. | Same gap as Outbox on the receiving side. | nice-to-have | Kleppmann, *DDIA*, ch. 11. |
| Process Manager | A stateful coordinator that listens to events and issues commands to drive a long-running business process; distinct from a Saga in that it is centralized/orchestrated. | DomainSpec has Saga and Workflow, but Process Manager (orchestrated, listens-and-decides) is a distinct pattern. Saga is often used to mean the choreographed variant. | nice-to-have | Hohpe & Woolf, *Enterprise Integration Patterns* (2003), "Process Manager"; Vernon, *IDDD*, ch. 12. |
| Domain Event vs Integration Event | A distinction between events meaningful *within* a Bounded Context (rich domain semantics) and events published *across* contexts (stable, versioned contracts). | Event is flat. The intra/inter-context distinction drives versioning, schema policy, and coupling — all currently unstated. | essential | Vernon, *IDDD*, ch. 8; Microsoft .NET microservices guide ("Domain events vs Integration events"). |
| Port | An abstract, technology-free interface owned by the application/domain that defines an interaction it needs. | Interface is generic; Port has the specific semantic of *belonging to the inside* and being implemented by an Adapter on the outside. | essential (if hexagonal posture is taken) | Cockburn, "Hexagonal Architecture" (2005). |
| Adapter (driving / driven) | A concrete implementation that connects an external technology (driving = inbound, driven = outbound) to a Port. | DomainSpec has UI Adapter; the *backend* port/adapter pair is missing. Interface alone doesn't encode direction. | essential | Cockburn, "Hexagonal Architecture" (2005). |
| Use Case (Interactor) | An application-layer object representing a single user/system intent, orchestrating domain objects to fulfill it. | Operation is closer but lower-level (a method on a domain service or aggregate). Use Case is the *application orchestration unit*. Workflow is multi-step / long-running; Use Case is single-transaction. | essential | Martin, *Clean Architecture* (2017), ch. 20; Jacobson, *OOSE* (1992). |
| Gateway | An object that encapsulates access to an external system, exposing a domain-friendly API. | Adapter, Interface, and Mapping all touch this space but none is precisely it. | nice-to-have | Fowler, *PoEAA* (2002), "Gateway". |
| Unit of Work | An object that tracks changes to a set of objects during a business transaction and coordinates persistence. | Saga and Workflow are too coarse; Unit of Work is the per-request transactional boundary. | nice-to-have | Fowler, *PoEAA* (2002), "Unit of Work". |
| Identity Map | A cache ensuring each entity is loaded only once per session, preserving reference identity. | Pure persistence concern, but if DomainSpec aspires to be implementation-agnostic at this layer, it may not need it. Currently no home, but arguably out of scope. | reject | Fowler, *PoEAA* (2002), "Identity Map". |
| Lazy Load | Deferred loading of associated data until accessed. | Implementation tactic, not a domain concept. | reject | Fowler, *PoEAA* (2002), "Lazy Load". |
| Active Record | An object that wraps a row in a table and includes domain logic alongside persistence. | Anti-pattern relative to DDD posture; subsumed/rejected by Entity + Repository split. | reject | Fowler, *PoEAA* (2002), "Active Record". |
| Service Layer | A coarse-grained API boundary defining the application's available operations. | Largely subsumed by Use Case + Interface together. | reject | Fowler, *PoEAA* (2002), "Service Layer". |
| Strategy | A family of interchangeable algorithms encapsulated behind a common interface. | Generic OO pattern; arguably subsumed by Policy (which is "configurable rule") or Interface. | reject | GoF, *Design Patterns* (1994), "Strategy". |
| Observer | An object that subscribes to state changes in another. | Subsumed by Event + subscription semantics. | reject | GoF, *Design Patterns* (1994), "Observer". |
| Publish/Subscribe Channel | A named asynchronous transport with multi-consumer fan-out semantics. | Event is the *message*; the *channel/topic* with its delivery guarantees is not modeled. | nice-to-have | Hohpe & Woolf, *EIP* (2003), "Publish-Subscribe Channel". |
| Event Schema Registry | A versioned catalog of event schemas governing producer/consumer compatibility. | No existing meta-concept; governance artifact. | nice-to-have | Confluent Schema Registry docs (industry canon); Kleppmann, *DDIA*, ch. 4. |
| Idempotency Key | A client-supplied identifier ensuring repeated requests produce the effect at most once. | Policy could host it as a rule, but the *key* itself is a first-class artifact in mature APIs. | nice-to-have | Stripe API docs (industry canon); Helland, "Idempotence Is Not a Medical Condition" (ACM Queue, 2012). |
| Dead-Letter Queue | A destination for messages that cannot be processed after retry policy is exhausted. | Operational/transport concern; no current home. | nice-to-have | Hohpe & Woolf, *EIP* (2003), "Dead Letter Channel". |
| Scheduled Job | A unit of work triggered by time rather than by request or event. | Workflow can host it, but the *trigger* (cron, interval) is unmodeled. Operation lacks temporal trigger semantics. | nice-to-have | No single canonical source — folklore (cron, *EIP* "Polling Consumer"). |
| Background Worker | A long-lived process that consumes from a queue or stream and executes operations asynchronously. | Workflow is the *plan*; the *worker* is the runtime. Arguably an implementation concern. | reject (deployment concern) | No canonical source — folklore. |
| Stream Processor | A continuously-running operation that consumes an event stream and emits derived events or projections. | Distinct from Saga (business process) and Calculation (one-shot). | nice-to-have | Kleppmann, *DDIA*, ch. 11; Akidau et al., "The Dataflow Model" (VLDB 2015). |
| Materialized View | A precomputed, persistently-stored query result, refreshed on a schedule or via change-data-capture. | Overlaps Read Model but is broader (also a DB concept). | nice-to-have | Fowler, "Materialized View" bliki; CQRS literature. |
| Webhook | An outbound HTTP callback fired on an event, addressed to a subscriber-supplied URL. | Event + Integration are close but the *callback-to-external-URL* pattern with its retry/signing semantics is its own thing. | nice-to-have | No single canonical source — industry folklore (Stripe, GitHub webhook docs). |

### UI candidates

| Candidate | Definition | Why it doesn't fit | Severity | Canonical source |
|-----------|------------|--------------------|----------|------------------|
| Modal / Dialog lifecycle | A transient overlay component with explicit open/close/confirm/cancel states and focus-management invariants. | Component is too generic; Modal has lifecycle (open → submit → close, with backdrop and a11y rules) that resembles a mini state machine for UI. | essential | WAI-ARIA Authoring Practices, "Dialog (Modal) Pattern"; Material Design "Dialogs". |
| Wizard / Multi-step Flow | A sequenced UI process with step state, validation per step, and navigation (next/back/skip) rules. | Workflow on the backend is process; the UI equivalent (with per-step Form + Guard + persistence) has no home. Page + Form can compose it, but the *step graph* is unnamed. | essential | Tidwell, *Designing Interfaces* (3rd ed., 2020), "Wizard"; Nielsen Norman Group articles on wizards. |
| Notification / Toast | A transient, non-blocking message surface for system feedback, with severity and dismissal semantics. | State Indicator is closer but typically inline-bound; a Toast is a global ephemeral channel. | essential | Material Design "Snackbars"; Tidwell, *Designing Interfaces*. |
| Realtime Subscription | A UI-side listener that consumes a server-pushed stream (WebSocket, SSE) and updates view state reactively. | Hook is close but generic; the *subscription with lifecycle + reconnect + backpressure* is its own pattern. Binding is data-shape, not push-channel. | essential | Confluence between Reactive Programming canon (ReactiveX docs); Facebook/Meta on GraphQL Subscriptions; "The Reactive Manifesto" (2014). |
| Optimistic Update | A pattern where the UI applies an action's expected result immediately, then reconciles or rolls back when the server responds. | Action is the trigger; the *optimistic-then-reconcile* state model has no home. | essential | TanStack Query docs (canonical industry reference); Meteor's original "Latency Compensation" docs. |
| Empty / Loading / Error states | First-class representations of the absence, in-flight, or failure states of a data-bound view. | State Indicator may cover this, but the *three-state triad* per data dependency is a discipline worth naming explicitly. | nice-to-have | Wroblewski, *Web Form Design* (2008); Nielsen Norman Group, "Empty States". |
| Analytics Event | A named, payload-bearing record emitted from the UI to capture user behavior. | Event on the backend is domain; UI analytics events have different consumers (product analytics) and governance (taxonomy). | nice-to-have | Segment "Tracking Plan" docs; Amplitude/Mixpanel taxonomy guides — no single canonical source, industry-standard. |
| Theme / Design Token | A named, versioned design primitive (color, spacing, typography) consumed by Components to enforce visual consistency. | Layout governs structure; tokens govern *visual primitives*. Distinct concern. | nice-to-have | Salesforce Lightning Design System; W3C Design Tokens Community Group spec (draft). |
| Permission UI / Capability-driven rendering | The rendering policy that hides, disables, or annotates UI affordances based on the current user's capabilities. | Guard covers route-level access; per-component capability rendering is a finer grain. | essential | NIST RBAC standard (informs the model); no UI-specific canonical source — industry folklore (Auth0, Casbin docs). |
| Form Field / Input Primitive | The atomic input element with its own validation, format, and a11y contract, distinct from a Form (which is a composition). | Form exists; the *field* as a typed, validated primitive isn't named. | nice-to-have | Wroblewski, *Web Form Design* (2008); HTML Living Standard. |
| Route | A URL pattern bound to a Page, with parameters, query string, and lifecycle hooks. | Page exists; the *route* (URL ↔ Page mapping, with params and guards) is implicit. | nice-to-have | React Router / Next.js docs (industry canon); no single book. |
| Navigation / Breadcrumb model | The user-facing structural model of where they are and how they got there. | Layout governs spatial structure; navigation model governs *path/history* semantics. | nice-to-have | Nielsen Norman Group, "Breadcrumbs"; Tidwell, *Designing Interfaces*. |
| Permission-aware Form | A form where field visibility/editability is determined by capability at render time. | Composition of Form + Permission UI; likely doesn't need its own meta-concept. | reject | Folklore. |
| Skeleton / Placeholder | A lightweight visual stand-in shown during data loading. | Subsumed by Loading state. | reject | Material Design "Skeleton". |
| Command Palette | A keyboard-invoked overlay that exposes searchable actions. | Composition of existing concepts (Modal + Action + search). | reject | Industry folklore (VS Code, Linear, Slack). |

### Category-level observations

The surveyed literature points to three categorical gaps in DomainSpec's 4+4 grouping.

First, **boundary / scope** is invisible. DDD's Bounded Context, Aggregate, and Context Map are not "structural" in the sense Entity is — they are *meta-structural*: they declare what's grouped, what's isolated, and how groups relate. Folding them under Structural would silently flatten the most important distinction in mature domain modeling.

Second, **cross-cutting / operational concerns** have no home. Outbox, Inbox, Idempotency Key, Dead-Letter Queue, Snapshot, Schema Registry — these are neither structural nor behavioral nor a lifecycle of a domain object; they are *delivery-reliability* and *evolution* concerns. Hohpe & Woolf's *EIP* treats them as a category in its own right ("messaging endpoints" / "system management").

Third, on the UI side, **temporal / ephemeral surfaces** (Modal, Toast, Wizard step, Optimistic Update, Realtime Subscription) collectively suggest a missing "interaction-lifecycle" axis distinct from Presentational. The current categories treat UI as static composition + behavior; they don't carve out the *time-bound, transient* surface that mature UX patterns require.

### Edge-level observations

The surveyed frames formalize several named relationships DomainSpec likely needs:

- **Aggregate Root *contains* Entity / Value Object** (DDD; one-aggregate-one-transaction invariant).
- **Repository *manages* Aggregate** (DDD; one repo per aggregate root is the convention).
- **Use Case *orchestrates* Domain Service / Aggregate / Repository** (Clean Architecture; the dependency-rule edge).
- **Port *implemented-by* Adapter** (Hexagonal; the directional edge defines driving vs driven).
- **Process Manager *listens-to* Event** and **Process Manager *issues* Command** (EIP / CQRS; the two edges together define orchestration).
- **Saga *coordinates* Aggregates across Bounded Contexts** (choreographed variant; Vernon).
- **Projection *derived-from* Event Stream** (CQRS/ES; rebuild semantics depend on this edge being explicit).
- **Bounded Context *integrates-with* Bounded Context via Context Map relationship** (typed: ACL, conformist, shared kernel, customer/supplier — the relationship *type* is itself the edge label).
- **Outbox *publishes-to* Channel** and **Inbox *consumes-from* Channel** (reliability edges).
- **Domain Event *promoted-to* Integration Event** via translation (versioning edge).
- **UI**: **Page *navigates-to* Page** (route graph), **Component *binds-to* View Model**, **Optimistic Action *reconciles-with* Server Response**, **Subscription *updates* View Model**, **Guard *gates* Route / Action**.

The pattern across frames: edges are *typed and directional*, and many carry their own invariants (e.g., "one Aggregate per transaction"). C5 should expect the edge catalog to be ~as large as the node catalog.

---

## Agent 3 — internal-pressure-audit: scan existing specs for cases where meta-concepts are being stretched or abused

Same pattern — same `Event` template for internal-only state-machine triggers (UserVerified internal transition) and Notifications-targeted integration signals (EmailVerificationSent has no internal state transition; its only job is to cross the boundary to the notifications system). Confirmed pattern.

I have enough evidence. Let me compose the final report.

---

## C3 Output — Internal Pressure Audit

### Audit scope
- Files read: 18 (TAXONOMY.md + 17 spec files across `examples/payment-processing`, `examples/order-management`, `examples/inventory-management`, `examples/user-account`, `docs/features/agent-execution-orchestrator`, `docs/features/knowledge-graph-visualization`, `docs/features/domainspec-gsd-integration`).
- Paths surveyed: 4 spec roots (`examples/**`, `docs/features/**`, `docs/features/gitops-assessment`, `.data/poker-team-demo-features` excluded after sizing — single domain, no novel signals).
- Total cases inspected: ~22 (5 Entities, 7 Operations, 6 Events, 4 Queries, 3 Workflows, 1 UI-SPEC component inventory). 8 ruled IN, 14 ruled OUT.

### Type-abuse cases (file:line evidence)

| # | Location (file:line) | Current meta-concept | Concept being forced | Evidence quote (≤2 lines) | Severity |
|---|----------------------|----------------------|----------------------|---------------------------|----------|
| 1 | `/Users/victorboscaro/domainspec/docs/features/agent-execution-orchestrator/domain.md:45-66` | Entity (`ExecutionRun`) | Aggregate Root | `ExecutionRun` owns `sandboxLease`, `worktreeLease`, `sessionSnapshot`, `telemetryEnvelope` as required Value-Object children and carries cross-child invariants (telemetry-pair completeness I-WF-2; envelope-complete-before-terminal I-WF-4 in `workflows.md:55-57`). It is not "an object with state" — it is the consistency boundary across 4 sub-objects and a retry counter. | high |
| 2 | `/Users/victorboscaro/domainspec/docs/features/agent-execution-orchestrator/operations.md:84-93` | Operation (`ExecutePipelineRoute`) | Cross-cutting policy bundle (Retry / Idempotency / Watchdog / Cancellation) | Rules R2 telemetry-pair, R3 terminal-outcome, R4 retry-bounded, R5 cancellation-policy, plus C2 stuck-flag (`suspectedStuck = elapsed > watchdogBudget`) are 5 distinct cross-cutting concerns smuggled inside one Operation's rules table — none promoted to first-class Policy or "Aspect" meta-concepts. | high |
| 3 | `/Users/victorboscaro/domainspec/docs/features/agent-execution-orchestrator/workflows.md:11-49` | Workflow (`FeatureLifecyclePipelineWorkflow`) | Saga (or "Stage Pipeline" pattern) | Coordinates 11 stages across Operator/Runtime/Provider boundaries, owns its own compensation-strategy declaration "stop-and-flag" and a compensation column per step. Single-feature workflow vs. cross-feature saga distinction does not fit: this crosses orchestrator/sandbox/worktree/telemetry/governance contexts but stays inside one feature. Workflow's "one feature" definition leaks. | medium |
| 4 | `/Users/victorboscaro/domainspec/docs/features/knowledge-graph-visualization/queries.md:1-98` | Query (`GetMirrorCards`, `GetRelationshipGraph`) | Read Model / Projection | Both queries serve denormalized, UI-pre-shaped output (`cards[].isActive` derived from request context; `cardId`, `cardType`, `groupKey` derived during projection build) read from `MirrorProjection`, a snapshot persisted by `RebuildMirrorProjection` (operations.md:39-97) and maintained by event `MirrorProjectionBuilt` (events.md:11-32). Classic event-maintained read-model — but typed as plain Query. | high |
| 5 | `/Users/victorboscaro/domainspec/examples/payment-processing/events.md:3-53` | Event (single `Event` type) | Domain Event vs. Integration Event conflation | `PaymentInitiated` is internal (consumers: AuditLog, FraudDetection within same boundary). `PaymentCompleted` is cross-boundary (consumed by Order Management to advance fulfillment, AND carries external `gatewayRef` field). Both use the same payload schema with no versioning, no envelope, no integration-contract marker. | medium |
| 6 | `/Users/victorboscaro/domainspec/examples/user-account/events.md:27-46` | Event (`EmailVerificationSent`) | Integration Event / Outbound Notification Command | Has `Triggers transition: none — supplementary notification`. Its only consumer is `Notifications`, its only purpose is to cross the bounded-context boundary. This is structurally an integration signal, not a domain state-change announcement, yet uses the same Event template. | low |
| 7 | `/Users/victorboscaro/domainspec/examples/payment-processing/domain.md:5-26` | Entity (`PaymentTransaction`) | Aggregate Root (Transaction + Refund children) | Fields `retryCount` and `refundedAmount` plus operations.md R7 invariant `amount <= tx.amount - tx.refundedAmount` express a cross-child invariant (total partial refunds ≤ original charge), but there is no `RefundAttempt` child entity — refunds are flattened into a running total on the parent. The invariant is real, the aggregate boundary is implicit. | medium |
| 8 | `/Users/victorboscaro/domainspec/docs/features/knowledge-graph-visualization/UI-SPEC.md:33-65, 109-114` | Component (`WhiteboardCanvas`) | Interactive Canvas / Stateful Surface (with URL-bound selection state) | `WhiteboardCanvas` is listed as a single `Component` but the Route Query Parameters (`activeAspect`, `viewLevel`, `selectedCardId`, `selectedFeatureId`, `selectedGroupKey`) externalize its drilldown state to URL, and the Interaction Contract Levels 1–5 describe browser-back history restoration order — that's stateful canvas/router-bound surface, not a plain composable component. | low |

Severity legend: **high** = the existing meta-concept actively misleads spec readers; **medium** = workable but distorts the spec; **low** = cosmetic / borderline.

### Cases inspected but NOT abuse

- **`OrderFulfillmentSaga`** (`examples/order-management/workflows.md:3-67`) — correctly typed as Saga; explicit cross-feature compensation; fits taxonomy cleanly.
- **`AllocateInventoryWorkflow`** (`examples/inventory-management/workflows.md:1-40`) — single-feature scope, fits Workflow. The header line "Compensation Strategy: saga" is terminology overlap, not type-abuse.
- **`FulfillmentRoutingPolicy`** (`examples/order-management/workflows.md:72-105`) — fits Policy cleanly: selects warehouse strategy from decision table.
- **`RetryPayment`** (`examples/payment-processing/operations.md:106-140`) — borderline (retry is cross-cutting), but the Operation IS a discrete user/system action with its own rules R9/R10; calling it pure retry-policy state is a stretch. Ruled OUT.
- **`FeeCalculation`** (`examples/payment-processing/operations.md:144-170`) — pure deterministic formula; fits Calculation perfectly.
- **`PaymentTransaction` state machine** (`examples/payment-processing/states.md`) — fits State Machine cleanly.
- **`Money`, `Quantity`, `SKU`** value objects — fit cleanly.
- **`InventoryBatch`, `InventoryAllocation`, `Product`** — flat Entities with simple lifecycles; Aggregate-Root pressure is moderate but defensible because invariants are local.
- **`AuthorityPolicy`** (`domainspec-gsd-integration/workflows.md:20-39`) — fits Policy.
- **No Modal/Dialog/Wizard abuse found** at spec level. UI-MOCKUP.md mentions a "Drawer" once; spec layer does not stretch `Component` for modal lifecycle today.
- **Hook abuse / websocket abuse**: `useMirrorGraph`, `useConceptFocus` are normal TanStack-style hooks bound to REST endpoints; no realtime/subscription abuse detected.

### Patterns observed

Abuse is clustered around **two** meta-concepts:

1. **`Operation` as a swallow-all bucket for cross-cutting concerns.** The `ExecutePipelineRoute` case is the load-bearing example: retry policy, idempotency, watchdog/stuck-detection, cancellation policy, and telemetry-pair obligations all live inside one Operation's rules table. The taxonomy offers Policy for "select between strategies" but has no meta-concept for "cross-cutting concern that applies to many Operations." Result: critical orchestration semantics are buried where readers don't expect them.
2. **`Query` vs. `Read Model / Projection`.** Knowledge-graph-visualization shows the canonical pattern — projection persisted by an Operation, refreshed by an Event, served by 4 Queries — but the taxonomy has no name for the read-model artifact itself. `MirrorProjection` is documented as an Entity, but it is not domain state — it is denormalized cache. This is hiding in plain sight across the catalog and will recur in any feature with a complex view layer.

Secondary cluster: **`Event` as a single type for two roles** (internal state-change announcement vs. outbound integration signal). The conflation is mild today because there are few external consumers, but it will hurt the moment a cross-system contract needs schema versioning.

UI side is largely fine at spec level — but the catalog's lack of Modal/Drawer/Wizard meta-concepts is **not under pressure yet** because the only real feature with significant UI is knowledge-graph-visualization, which is canvas-shaped and avoids those patterns. Wave 2 should treat UI gaps as theoretical, not pressing.

### Conclusion

DomainSpec's catalog **is under real pressure, but concentrated in two specific places**: the `Operation` meta-concept is being asked to absorb cross-cutting orchestration concerns (the `agent-execution-orchestrator` feature alone shows 5 distinct concerns inside one Operation), and the `Query` meta-concept is being used to label what are actually event-maintained Read Models / Projections (clearly visible in `knowledge-graph-visualization`). The `Entity → Aggregate Root` and `Event → Domain vs. Integration` tensions are real but lower-severity — workable today, will bite when scaling to more external consumers. UI-side meta-concepts (Modal, Wizard, Realtime hook) show **no current pressure** — Wave 2 should defer those candidates. The 8 cases above (3 high, 3 medium, 2 low) are enough to make at least one new meta-concept and one renaming/splitting decision in Wave 2 non-deferrable; the rest can be evaluated against severity.

---

## Agent 4 — categories-and-pattern-meta-inquiry: should `Pattern` become a meta-concept, and what new categories does evidence demand

## Route Declaration

**Route**: This task is a Wave 2 child of `/domainspec-subagents-strategy` (Route 13). I am operating on already-loaded Wave 1 outputs (C1, C2, C3) embedded in the prompt. No file reads required — the inputs are load-bearing and self-contained per the dispatcher's instructions. R5 forbids file writes.

**Files I will read**: None. C4's job is synthesis over Wave 1 outputs, not fresh discovery. Reading additional files would duplicate C1/C2/C3 work and violate the "already ruled out" list.

---

## C4 Output — Categories & Pattern-Meta Inquiry

### Q1 — Pattern as a first-class meta-concept?

**Verdict: reject**

**Reasoning:**

Pattern-as-meta-concept fails the load-bearing test on three grounds.

**First, it doesn't match how DomainSpec uses meta-concepts.** A DomainSpec meta-concept (Entity, Operation, Workflow, Event, etc.) is a *shape with rules* — it dictates template structure, parser behavior, allowed edges, and composability checks (C1: 29 canonical edges, 8 enforced). "Pattern" has no shape of its own; SAGA, CQRS-Outbox, Repository, Specification, and Process Manager share nothing structurally except "people gave them names in books." Making Pattern a meta-concept would force the parser and KG runtime to treat a SAGA's compensating-action structure the same as a Repository's data-access contract — which collapses the very distinctions that make meta-concepts useful.

**Second, C2's "essential" list is already shape-distinguishable.** Aggregate, Repository, Outbox, Read Model, Port/Adapter, Use Case, Command — each has a recognizable artifact shape. C2 promotes them as candidates for *new meta-concepts or new categories*, not as instances of a generic Pattern type. None of C3's eight evidence cases asks for "Pattern" — they ask for **Aggregate Root** (cases 1, 7), **Cross-cutting concern** (case 2), **Saga** (case 3), **Read Model / Projection** (case 4), and **Integration Event** (cases 5, 6). The pressure is for *specific* missing meta-concepts, not a parent abstraction over them.

**Third, the user's "Pattern" intuition is real but mislabeled.** What the framing actually wants is a **navigational grouping** — readers want to find "all the messaging patterns" or "all the persistence patterns" in one place. That's what **categories** are for (Q2). Pattern-as-tag would also work for cross-referencing (e.g., "this Operation participates in the Outbox pattern"), but as a tag — not a meta-concept.

**Better handling**: introduce a `pattern:` frontmatter tag (free-form, curator-governed) that can be attached to any meta-concept instance to signal "this is the Outbox half of a broader pattern." No new meta-concept; no parser changes; no edge-label inflation.

**Citations:**
- **C2**: Candidates C2 marked essential (Aggregate, Repository, Outbox, Read Model, Port, Adapter, Use Case, Command) would NOT collapse into Pattern instances — C2 framed them as standalone meta-concepts or category members, never as siblings of a Pattern type. C2's category-level claim explicitly calls for *new categories* (boundary, cross-cutting, temporal), not a new abstraction layer.
- **C3**: Zero of the eight evidence cases name "Pattern" as the missing concept. Cases 1, 7 want Aggregate Root; case 2 wants a cross-cutting-concern home; case 3 wants Saga distinguished from Workflow; case 4 wants Read Model / Projection; cases 5, 6 want Integration Event. The pressure is granular, not abstract.

---

### Q2 — New categories?

| Proposed category | Verdict | Members that would live here (from C2) | Evidence supporting (from C3) | Citation chain |
|-------------------|---------|----------------------------------------|-------------------------------|----------------|
| **Cross-cutting / Operational** | **adopt** | Idempotency Key, Dead-Letter Queue, Snapshot, Retry Policy (implicit), Audit Log, Cancellation Policy (implicit), Logging/Tracing (implicit) | C3 case #2 (`ExecutePipelineRoute` bundling retry + idempotency + watchdog + cancellation + telemetry inside one Operation) — high severity | C2: "cross-cutting / operational concerns have no home — Outbox, Inbox, Idempotency Key, DLQ, Snapshot, Schema Registry are neither structural nor behavioral nor lifecycle" + C3 case #2 + C3 conclusion ("pressure concentrated at Operation (cross-cutting)") |
| **Temporal** | **defer** | Scheduled Job, Snapshot, (Cron, Time Window not in C2 list) | None of C3's 8 cases cite temporal pressure | C2 lists Scheduled Job and Snapshot only as "nice-to-have"; C3 shows no evidence pressure. Adopting now would be speculative. Revisit when first temporal abuse case appears. |
| **Integration** | **adopt** | Outbox, Inbox, Webhook, Anti-Corruption Layer, Gateway, Context Map, Domain Event vs Integration Event split | C3 case #5 (`payment-processing/events.md` — Domain vs Integration Event conflation, medium); C3 case #6 (`user-account/events.md` — Event as outbound command, low) | C2 marks Outbox and Domain-vs-Integration-Event split as **essential**; Gateway, ACL, Context Map, Inbox, Webhook as nice-to-have. C3 cases #5 and #6 confirm Event meta-concept is overloaded across boundary-crossing. C2 also flagged boundary/scope as the FIRST categorical gap. |
| **Persistence** | **adopt** | Aggregate, Aggregate Root, Repository, Read Model / Projection, Materialized View, Event Store | C3 case #1 (Entity forced into Aggregate Root, high); C3 case #4 (Queries acting as Read Models, high); C3 case #7 (Entity hiding Aggregate Root, medium) | C2 marks Aggregate, Aggregate Root, Repository, Read Model as **essential**. C3 has THREE evidence cases (#1, #4, #7) — strongest evidence pressure of any proposed category. C3 conclusion explicitly names "Query vs Read Model / Projection" as one of two concentrated abuse sites. |
| **Quality / Trust** | **defer** | Invariant (cross-aggregate), Post-condition, Specification | None of C3's 8 cases cite invariant/specification pressure | C2 lists Specification only as nice-to-have; cross-aggregate Invariant and Post-condition aren't in C2's enumerated list. No C3 evidence. Defer until pressure surfaces — possibly subsumed by existing Policy / Rule meta-concepts (C1 notes these already share templates with Operation/Workflow). |

**Three adopt, two defer, zero reject.** Adopted categories cover all eight C3 evidence cases when combined with existing 4+4. Deferred categories lack both C2 essential-tier endorsement and C3 evidence pressure.

---

### Cross-cutting verdict

Q1 is **reject** and Q2 adopts three categories — no framing collision.

If Q1 had been adopt, the collision would have been acute: `Outbox` would simultaneously be a Pattern instance, an Integration category member, and a Persistence-adjacent artifact. Resolving that would have required either (a) categories-of-Patterns (two layers of taxonomy, doubling navigation complexity), or (b) declaring Pattern orthogonal to categories (which is just "Pattern is a tag," i.e., the rejection verdict in disguise).

With Q1 rejected, the model stays clean: categories are the **primary axis** (where does this meta-concept live?), and an optional `pattern:` tag is the **secondary axis** (which named pattern does this instance participate in?). `Outbox` becomes a meta-concept in the **Integration** category, optionally tagged `pattern: transactional-outbox` if the curator wants to link it to Inbox on the receiver side.

This preserves DomainSpec's existing principle (C1) that meta-concepts have *shape* and edges, while admitting that human readers also need *thematic* navigation — the latter handled by tags and categories, not by inventing a meta-meta-concept.

---

### Open questions for Wave 2 strategist

- **Category-name collisions**: "Persistence" overlaps semantically with existing **Structural** (which today houses Entity, Value Object, Aggregate-shaped concepts in practice). Does Persistence *replace* part of Structural, or sit alongside? Strategist must decide partition vs addition.
- **"Integration" vs the implicit boundary axis C2 flagged**: C2 called out *boundary / scope* (Bounded Context, Aggregate, Context Map) as a separate categorical gap. Is "Integration" the same axis under a different name, or two distinct categories (Boundary + Integration)? Bounded Context and Context Map plausibly belong to Boundary; Outbox/Inbox/Webhook to Integration. Needs strategist call.
- **Cross-cutting category and the existing Policy meta-concept**: C1 notes Policy already shares a template with Operation/Workflow. If Cross-cutting/Operational becomes a category, does Policy migrate there, or does Policy remain in its current category and Cross-cutting hold only the *new* meta-concepts (Idempotency Key, Retry Policy, DLQ)? Risks fragmenting Policy semantics.
- **RELATIONSHIPS.md impact**: New categories likely require new edge labels (e.g., `outboxes-to`, `projects-from`, `idempotent-via`). C1 reports only 8 of 29 canonical edges are enforced today — adding more without enforcement plan worsens the gap. Strategist should scope a parallel edge-enforcement decision.
- **Pattern-tag governance**: If `pattern:` becomes a frontmatter tag, who governs the allowed vocabulary? Free-form risks tag sprawl; curated risks bottleneck. Recommend deferring to curator role definition outside Wave 2.
- **Synthetic types Feature/Consumer (C1)**: Not addressed by Q1 or Q2 but live in the same taxonomy surface. Strategist should flag whether the new categories surface these or leave them runtime-only.

---

## Agent 5 — edge-catalog-proposal: audit `RELATIONSHIPS.md`, propose additions/renames, decide forward-only vs forward+inverse, and rank composability-enforcement priorities

Confirmed parsing contract: `parseRelationshipRules` keys only by forward `edge` label, splits the From→To with `→`, and uses `/` as the type-union separator. No inverse-label parsing, no cardinality parsing, no enforcement metadata. I now have everything to produce the audit.

---

## C5 Output — Edge Catalog Proposal

### Section 0 — Baseline counts (confirmation)

Confirmed against `RELATIONSHIPS.md` and `check-code-tag-composability.ts`:
- **29 edges** total: 15 backend + 8 intra-UI + 6 cross-layer. Matches C1 finding.
- **8 distinct edges enforced** by composability checker: `enforces`, `enforces-cross`, `calculates`, `applies`, `exposes` (overloaded across operation + query), `mutates`, `fetches`, `orchestrates`. The other **21 edges are unenforced**. Matches C1 finding.
- `parseRelationshipRules` (lib/code-tag-rules.ts:67-117) is the sole consumer of `RELATIONSHIPS.md`. It is **forward-label-only**, keyed by the edge token, splits From→To on `→`, accepts type-unions on either side via `/`, and silently drops `@<scope>` and `[<cardinality>]` markers. Nothing else in the parser reads any inverse or cardinality data.

---

### Section 1 — Audit of `RELATIONSHIPS.md` baseline

| Edge | From | To | Inverse? | Cardinality (declared) | Composability-enforced? |
|------|------|----|----------|------------------------|-------------------------|
| `performs` | Entity | Operation | none | none declared | no |
| `produces` | Operation | Event | none | none | no |
| `produces-for` | Operation@A | Entity@B | none | none | no |
| `triggers-cross` | Event@A | Operation@B | none | none | no |
| `enforces-cross` | Rule@A | Operation@B | none | none | **yes** (CT-COMP-009) |
| `enforces` | Rule | Operation | none | none | **yes** (CT-COMP-001) |
| `calculates` | Calculation | Operation | none | none | **yes** (CT-COMP-002) |
| `transitions` | Event | State Machine | none | none | no |
| `exposes` | Interface | Operation / Query | none | none (union via `/`) | **yes** (CT-COMP-004 + 005) |
| `orchestrates` | Workflow | Operation | none | `[]` cardinality hint, ignored | **yes** (CT-COMP-008) |
| `applies` | Policy | Operation | none | none | **yes** (CT-COMP-003) |
| `maps` | Mapping | Entity / Interface | none | none | no |
| `contains` | Entity | Value Object | none | none | no |
| `queries` | Query | Entity | none | none | no |
| `emits` | Entity | Event | none | none | no |
| `renders` | Page | Component | none | `[]` hint, ignored | no |
| `wraps` | Layout | Page | none | `[]` hint, ignored | no |
| `composes` | Component | Component | none | `[]` hint, ignored | no |
| `consumes` | Component | Hook | none | none | no |
| `submits` | Form | Action | none | none | no |
| `shapes` | Adapter | View Model | none | none | no |
| `protects` | Guard | Page | none | none | no |
| `displays` | Component | View Model | none | none | no |
| `fetches` | Binding | Query | none | none | **yes** (CT-COMP-007) |
| `mutates` | Binding | Operation | none | none | **yes** (CT-COMP-006) |
| `reflects` | State Indicator | State Machine | none | none | no |
| `derives` | View Model | Entity | none | none | no |
| `contracts` | Form | Interface | none | none | no |
| `mirrors` | Guard | Rule | none | none | no |

**Observations:**
1. No inverse labels exist anywhere in `RELATIONSHIPS.md`. The catalog is purely forward.
2. Cardinality is hinted with `[]` in 4 rows (`orchestrates`, `renders`, `wraps`, `composes`) but the parser strips it (`parseTypeSide`, line 181). It is decorative.
3. The `@A` / `@B` scope markers on cross-feature edges are also stripped by the parser. They are documentation-only.
4. `exposes` and `maps` use the `/` union; the parser does turn that into a multi-element `Set<string>` but the composability checker side-steps the union by registering two rule rows for `exposes`. `maps` has no enforcement so the union just sits there.
5. The 14-meta-concept backend taxonomy (TAXONOMY.md) has Saga as a meta-concept but **no edge in `RELATIONSHIPS.md` references Saga as a participant**. Saga is orphan in the edge graph.

---

### Section 2 — Gaps from implicit edges (C1 Table 2)

| Implicit phrase (template) | Already in `RELATIONSHIPS.md`? | Proposed name | Notes |
|---|---|---|---|
| Entity → State Machine ("Lifecycle: …") | NO. There is no `Entity → State Machine` edge; `transitions` is `Event → State Machine`. | `has-lifecycle` (Entity → State Machine, 1:0..1) | Templates reference it from `domain.md:21` but registry can't represent it today. |
| Entity → Operation ("Operations: …") | Yes via `performs` (Entity → Operation). | — | Verb mismatch: template says "Operations:" but edge is `performs`. Tolerable; document the synonym. |
| Event → Operation ("Produced by …") | YES but inverse of `produces`. | — | Today the directional convention is `Operation produces Event`. Template phrasing is fine as a read-back. |
| Event → State Machine ("Triggers transition …") | Yes via `transitions`. | — | OK. |
| Event → (untyped consumer) | No typed edge. | `consumed-by` (Event → Operation/Workflow/Saga) **OR** rely on `triggers-cross`. | C1 noted the consumer table is free-text. Recommend formalizing as `consumed-by` for intra-feature consumers; `triggers-cross` already handles inter-feature. |
| Interface → Operation (Maps To column) | Yes via `exposes`. | — | OK. |
| Operation → Entity (state transition "{Entity}: {From}→{To}") | NO direct `Operation → Entity` edge. Today it's `Operation produces Event` and `Event transitions StateMachine` and `Entity contains StateMachine` is missing. | `transitions-on` (Operation → State Machine) **OR** make `Operation → Entity` explicit via a new edge. | Adding `transitions-on (Operation → State Machine)` is more precise than `Operation → Entity`. |
| Workflow → Operation (Orchestrates / step table) | Yes via `orchestrates`. | — | OK. |
| Policy → Workflow ("Applies To: {WorkflowName} step #") | NO. `applies` is Policy → Operation. | Extend `applies` to `Policy → Operation/Workflow` (union via `/`). | The parser supports this union out of the box; checker would need a Workflow variant. |
| Query → Entity ("Reads From") | Yes via `queries`. Also: **alias `query`→`queries`** silently accepted by parser, not documented. | Document the canonical label and drop the alias. | See Section 8. |
| Mapping → (source type, untyped) | Yes via `maps` (Mapping → Entity/Interface). | — | The "from" type is ambiguous because `maps` doesn't say which side is From. Recommend explicit `maps-from` / `maps-to` (or a single `transforms` with both type-unions). |
| View Model → Entity (source entity reference) | Yes via `derives`. | — | OK. |
| State Indicator → State Machine/Enum (HTML comment "reflects → …") | Partial. `reflects` is State Indicator → State Machine. **Enum target is missing.** | Extend `reflects` to State Indicator → State Machine/Enum. | Trivial union extension. |
| Form → Interface (HTML comment "contracts → Interface") | Yes via `contracts`. | — | OK. |
| Component → Hook (HTML comment "consume Hooks") | Yes via `consumes`. | — | OK. |
| Binding (Hook) → Query (HTML comment "fetches → Query") | Yes via `fetches`. | — | OK. |
| Binding (Hook) → Operation (HTML comment "mutates → Operation") | Yes via `mutates`. | — | OK. |
| **`interface`→`exposes`** alias (parser line 619-629) | NO. The alias short-circuits to `exposes` but is undocumented. | Remove the alias **or** add an `interface` edge synonym row. | See Section 8. |

**Net new backend edges proposed from C1:**
1. `has-lifecycle` (Entity → State Machine)
2. `transitions-on` (Operation → State Machine) — replaces ambiguous `Operation → Entity → State` chain
3. `consumed-by` (Event → Operation) — intra-feature consumer typing
4. Extend `applies` to also target Workflow
5. Extend `reflects` to also target Enum

---

### Section 3 — Gaps from external frames (C2)

For each C2 observation, classify and propose. Severity: **must** = breaks if not added, **should** = needed for completeness, **nice** = aesthetic.

| Proposed edge | From | To | Cardinality | Rationale (C2) | Severity |
|---|---|---|---|---|---|
| `contains` (extend) | Entity (Aggregate Root) | Entity / Value Object | 1:N | C2: Aggregate Root contains child entities + VOs. Today `contains` is Entity → VO only. | should — only matters if Aggregate Root meta-concept lands; without it, this is over-fitting |
| `manages` | Repository | Entity (Aggregate Root) | 1:1 | C2: Repository manages Aggregate. Requires Repository meta-concept (not in TAXONOMY today). | nice — defer until Repository is decided by C4 |
| `orchestrates` (extend From) | Use Case / Workflow | Operation / DomainService / Repository | N:M | C2: Use Case orchestrates DomainService + Repository, not just Operation. | should — but DomainService + Repository are new meta-concepts (C4 scope). For now, only widen the To side to include Workflow recursion. |
| `implements` | Adapter | Port (Interface) | N:1 | C2: Port-Adapter pattern. Today `exposes` is Interface→Operation, but there's no edge for Adapter→Interface. | should — applicable if hexagonal terminology lands; otherwise rename existing UI `shapes` is unrelated. |
| `listens-to` | ProcessManager / Saga | Event | N:M | C2: Process Manager + Saga subscribe to events. | should — Saga is already a meta-concept (TAXONOMY line 220) but has zero edges. **This is the most concrete Saga edge to add.** |
| `issues` | ProcessManager / Saga | Command / Operation | 1:N | C2: Process Manager issues Commands. Without a Command meta-concept, target is Operation. | should — same Saga-orphan reasoning. |
| `coordinates` | Saga | Aggregate / Operation@A,B | N:M | C2: Saga coordinates Aggregates across Bounded Contexts. | must — Saga is in TAXONOMY with no edges; this is the gap. Proposed name: `coordinates-cross`. |
| `derived-from` | Projection / Read Model | Event / Event Stream | N:M | C2 + C3 case #4. Read model rebuilt from event stream. | must — required to type Case #4 (knowledge-graph-visualization/queries.md). |
| `integrates-with` | Bounded Context | Bounded Context | N:M (labeled by Context Map type) | C2: Context Map. | nice — Bounded Context is implicit today (the `@A`/`@B` markers); formalizing this needs governance work. Defer. |
| `publishes-to` | Outbox | Channel / Topic | N:1 | C2: Outbox → Channel. Outbox is a new meta-concept; defer. | nice (defer with Outbox) |
| `consumes-from` | Inbox | Channel / Topic | N:1 | C2: Inbox ← Channel. | nice (defer with Inbox) |
| `promotes-to` | Domain Event | Integration Event | 1:1 | C2 + C3 cases #5/#6. | must — without it, no way to type the domestic→integration boundary. Even without a new meta-concept, this edge is meaningful if the system relies on `@A/@B` scope to distinguish. |
| `navigates-to` | Page | Page | N:M | C2: UI navigation graph. | should — today nothing in `RELATIONSHIPS.md` types Page→Page navigation, but it shows up implicitly in user-journey traces. |
| `binds-to` | Component | View Model | 1:1 | C2 says "Component binds-to View Model". But `displays` (Component → View Model) already exists. | already covered — `displays` is the canonical name. Reject duplicate. |
| `reconciles-with` | Optimistic Action | Server Response | 1:1 | C2: optimistic UI. | nice — only if optimistic-update meta-concept lands. Defer. |
| `updates` | Subscription | View Model | 1:N | C2: realtime subscriptions. | nice — only if Subscription meta-concept lands. Defer. |

**Net new edges proposed from C2 (after filtering for what fits the existing taxonomy):**
1. `coordinates-cross` (Saga → Operation@A,B) — closes Saga-orphan gap
2. `listens-to` (Saga → Event)
3. `issues` (Saga → Operation)
4. `derived-from` (Query/View Model → Event) — for projection/read-model patterns (Query already in taxonomy, View Model on UI side; this is the cross-layer companion to `derives`)
5. `promotes-to` (Event@A → Event@B) — domain↔integration event distinction without needing a new meta-concept
6. `navigates-to` (Page → Page)

---

### Section 4 — Gaps from evidence (C3)

| Evidence case | Today | Missing edge | Proposed addition |
|---|---|---|---|
| Case #2 — `agent-execution-orchestrator/operations.md:84-93`: five cross-cutting concerns bundled in rules | `enforces` collapses all rule kinds | `enforces-cross-cutting` (Policy → Operation/Workflow) **OR** a new `Concern` meta-concept | At minimum, **extend `applies`** to allow Policy → Workflow (already in Section 2). Full fix requires C4's CrossCuttingConcern decision. |
| Case #4 — `knowledge-graph-visualization/queries.md:1-98`: projection persisted by Operation, refreshed by Event, served by Query | `queries` (Query → Entity) alone; no signal that the entity is a projection | `derived-from` (Query → Event) — captures projection lineage | Add `derived-from`. |
| Case #5 — domain-internal events | `produces`, `transitions` apply uniformly | no way to mark intra-context-only | `promotes-to` (Event → Event) **negative form**: if event has no `promotes-to`, it's domain-internal. | Add `promotes-to`. |
| Case #6 — cross-boundary integration events | Same as #5 | Same: `promotes-to` | Same as #5. |
| Cases 1, 3, 7, 8 (not detailed in input but referenced) | — | — | Insufficient data — flagged for follow-up. |

**Net new edges from C3:** `derived-from`, `promotes-to` (both also surfaced by C2 — converging signal).

---

### Section 5 — Forward / inverse design choice

**Decision: keep DomainSpec edges one-directional (forward-only). Do not adopt vault-style forward+inverse pairs.**

**Rationale:**
1. **Different ontology level.** Vault edges connect *content nodes* (one file per node); inverse labels matter because the reader navigates files. DomainSpec edges connect *meta-concepts in YAML tag headers*; the consumer is the parser, which already builds a graph in memory and can traverse forward edges in either direction by index.
2. **The parser today only reads forward labels** (`parseRelationshipRules` lib line 89: `const edge = cleanCell(...)`). Adding inverse names is a non-trivial parser change and adds a class of drift bugs (forward says X, inverse says Y, validators disagree).
3. **No callsite needs inverse labels.** `check-code-tag-composability.ts` works off `(fromType, toType, direction)` tuples — the direction enum (`source-calls-target` / `target-calls-source`) already encodes inversion at the *enforcement* level, not at the *naming* level. This is cleaner than vault-style.
4. **Documentation cost.** Adding 29 inverse names doubles maintenance burden for zero behavior gain.

**What I do propose instead:** add a one-line "read-back phrase" column to each edge table in `RELATIONSHIPS.md` for human readers (e.g., for `produces`: read-back = "is produced by"). This is doc-only, parser ignores it, and gives writers a clean way to phrase the inverse in prose without inventing an edge label.

---

### Section 6 — Cross-stack edges

C1 found that the following are in HTML comments inside `templates/ui-spec.md` and not formalized in `RELATIONSHIPS.md`:

| Edge | UI source | Backend target | Status today |
|---|---|---|---|
| `reflects` | State Indicator | State Machine | **In `RELATIONSHIPS.md`.** Need to extend to State Machine / Enum. |
| `derives` | View Model | Entity | **In `RELATIONSHIPS.md`.** OK. |
| `contracts` | Form | Interface | **In `RELATIONSHIPS.md`.** OK. |
| `mirrors` | Guard | Rule | **In `RELATIONSHIPS.md`.** OK. |
| `fetches` | Binding | Query | **In `RELATIONSHIPS.md` + enforced.** OK. |
| `mutates` | Binding | Operation | **In `RELATIONSHIPS.md` + enforced.** OK. |
| Component → Hook | (intra-UI, listed as `consumes`) | n/a | OK. |
| Binding → Query/Operation | listed above | n/a | OK. |
| **`reflects` extension** | State Indicator | Enum | **Gap.** Templates allow Enum target via HTML comment, catalog doesn't. |
| **`displays` cross-stack overload** | Component | View Model (intra-UI) | OK intra-UI; cross-stack version is `derives` chain. Don't overload. |
| **Form → Interface field-level alignment** | Form fields | Interface request fields | Cosmetic; today `contracts` is form-level. Don't add field-level edge — graph would explode. |

**Net new cross-stack proposals:**
1. Extend `reflects` target to `State Machine / Enum` (one-character change in `RELATIONSHIPS.md`; parser handles the union).
2. Formalize all current HTML-comment annotations in `templates/ui-spec.md` by removing the HTML comments and pointing to `RELATIONSHIPS.md` once the edges above are confirmed canonical. Pure documentation hygiene — no behavior change.

The good news: **the cross-layer surface is mostly already formalized**. The HTML comments are mostly redundant, not novel.

---

### Section 7 — Composability enforcement recommendations

Of the 21 unenforced edges + 6 newly proposed, here is the priority list for adding rules to `check-code-tag-composability.ts`. Severity: **must / should / nice**.

| Edge | Severity | Why | Rule sketch |
|---|---|---|---|
| `produces` (Operation → Event) | **must** | Operations emit events; this is *the* most-traveled edge. Drift here is invisible. | `source-calls-target`: operation body should reference event constructor/publisher symbol. |
| `queries` (Query → Entity) | **must** | Today the alias `query`→`queries` is a silent passthrough (C1). Enforcing the canonical edge would surface the alias. | `target-calls-source`: query body should reference entity-typed select. Likely too loose; consider only "query function signature returns entity-shaped result". |
| `transitions` (Event → State Machine) | **must** | Without this, "Event X transitions Y" can drift from the actual state-machine transition table. | `target-calls-source`: state machine transition table contains an entry triggered by this event. Requires state-machine artifact parsing — bigger investment. |
| `consumed-by` (Event → Operation) NEW | should | Once added, enforce so consumers don't silently disappear. | `target-calls-source`: operation handler signature accepts the event type. |
| `derived-from` (Query → Event) NEW | should | Projection lineage; high drift risk. | `source-calls-target`: query bootstrap or rebuild function references event payload type. |
| `coordinates-cross` (Saga → Operation@A,B) NEW | should | Saga is currently unenforced; this is the entry point. | `source-calls-target`: saga step function references operation symbol. |
| `listens-to` (Saga → Event) NEW | should | Same. | `source-calls-target`: saga subscription registers event type. |
| `emits` (Entity → Event) | should | Already implied by Operation → Event, but Entity is also tagged emitter. Redundant unless explicit emit method. | `source-calls-target`: entity method body references event constructor. |
| `performs` (Entity → Operation) | nice | Actor declaration; cosmetic. | Hard to enforce — actors are not always callable symbols. Skip. |
| `maps` (Mapping → Entity/Interface) | should | Today entirely free-text. | `source-calls-target`: mapping function references source + target types. |
| `contains` (Entity → VO) | nice | Could be enforced via field type check, but slim payoff. | Skip unless cheap. |
| `produces-for` (Operation@A → Entity@B) | should | Cross-feature write-back; high drift risk and exactly where the @A/@B scope matters. | `source-calls-target`: operation body references foreign-entity write API. Watch for boundary leakage. |
| `triggers-cross` (Event@A → Operation@B) | should | Cross-feature activation. | `target-calls-source`: cross-feature operation handler registers for event type. |
| `applies` extension (Policy → Workflow) NEW | should | Match existing Policy → Operation enforcement. | Same shape as CT-COMP-003. |
| `promotes-to` (Event@A → Event@B) NEW | nice | Type-level distinction; symbol-level enforcement is awkward. | Skip code enforcement; require docs only. |
| `has-lifecycle` (Entity → State Machine) NEW | nice | Trivially enforceable by checking entity type has a `status`/lifecycle field. Low payoff. | Defer. |
| `transitions-on` (Operation → State Machine) NEW | should | Pairs with `transitions`. | `source-calls-target`: operation invokes state machine transition function. |
| `navigates-to` (Page → Page) NEW | nice | UI-only; routers already enforce. | Skip. |
| Intra-UI edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) | nice | Most have framework-level enforcement (the bundler will fail if a component doesn't exist). | Skip unless drift evidence appears. |

**Top 5 to enforce next:** `produces`, `transitions`, `queries`, `produces-for`, `triggers-cross`.

---

### Section 8 — Aliases and synthetic types decision

**Decision A: aliases `query`→`queries` and `interface`→`exposes`.**

- C1 confirmed these are silently rewritten by `markdown-feature-docs-parser.ts:619-629` and would fail `validate-relationships.ts`.
- **Recommendation: remove the aliases.** Force canonical labels.
- **Rationale:** silent rewriting is the worst kind of "helpful." It diverges parser output from the documented catalog, breaks the principle that `RELATIONSHIPS.md` is the contract, and creates the exact "silent passthrough" failure mode C1 surfaced. The fix is a 3-step migration:
  1. Add a warning-mode pass to the parser that logs `[deprecated-alias] query → queries` for one release.
  2. Update existing feature docs to use canonical labels.
  3. Remove the rewriting code.
- **Alternative (worse):** document the aliases in `RELATIONSHIPS.md` as canonical synonyms. This bloats the catalog and invites more aliases. Reject.

**Decision B: synthetic types `Feature` and `Consumer` at runtime.**

- C1 noted these participate in `produces-for` edges at runtime but aren't in `TAXONOMY.md`.
- **Recommendation: split the two cases.**
  - **`Feature`:** keep as a synthetic *namespace marker* — not a meta-concept. It's the equivalent of the `@A`/`@B` scope marker, not a node type. Document it explicitly in `RELATIONSHIPS.md` as "scope qualifier, not a meta-concept."
  - **`Consumer`:** decide whether this is shorthand for "any external-system meta-concept" or a missing meta-concept. If it represents external consumers (downstream services), promote to TAXONOMY (probably as a variant of `Interface` or a new `ExternalSystem` meta-concept — C4's call). If it's just lazy typing on the producer side, drop it and require concrete types.
- **Rationale:** runtime types that don't appear in TAXONOMY break the "every concept maps to exactly one meta-type" contract from TAXONOMY.md line 4.

---

### Section 9 — Open questions

1. **Saga + edge gap.** Saga is in TAXONOMY but has zero edges in `RELATIONSHIPS.md`. Decision needed: add at minimum `coordinates-cross`, `listens-to`, `issues`, or accept that Saga is documented-only and not graph-navigable. (Recommend: add `coordinates-cross` as a baseline.)
2. **`applies` target widening to Workflow.** Templates reference Policy applying to Workflow steps (`templates/workflows.md:47`), but `applies` is Policy → Operation. Decision: widen via union `Operation/Workflow`. Migration cost: 0 — parser handles `/`.
3. **`reflects` target widening to Enum.** Templates allow it via HTML comment. Decision: widen via union. Migration cost: 0.
4. **`promotes-to` Event@A → Event@B.** C2 + C3 both want this. But it implies that Event has subtypes (Domain Event vs Integration Event). Decision: either add the edge with the same Event meta-concept on both ends (relying on `@A`/`@B` scope) **or** wait for C4 to formalize Domain/Integration Event subtyping.
5. **`derived-from` (Query → Event).** Clean addition. Open question: is the From side `Query` or a new `Projection`/`ReadModel` meta-concept? C4 decision.
6. **Alias removal migration.** Removing `query`→`queries` and `interface`→`exposes` is a breaking change for any existing feature doc that uses the short form. Migration: scan + rewrite. Cost: low if done in one PR.
7. **Synthetic `Feature` vs `Consumer`.** C4 + governance call. Documented above as Decision B.
8. **Read-back phrase column in `RELATIONSHIPS.md`.** Pure doc improvement to substitute for vault-style inverse labels. Decision: add or skip. (Recommend: add — zero parser impact.)
9. **`@A`/`@B` scope markers.** Today they're documented but stripped by the parser (`parseTypeSide`, line 181). If cross-feature drift is a real concern, the parser should preserve them so the composability checker can enforce *foreign* vs *local* targets differently. Currently it can't distinguish `produces-for` boundary crossings from regular `produces` ones at the type level.

---

**Summary of net deltas to `RELATIONSHIPS.md`:**
- **Add 6 backend edges:** `has-lifecycle`, `transitions-on`, `consumed-by`, `coordinates-cross`, `listens-to`, `issues`.
- **Add 2 cross-cutting edges:** `derived-from`, `promotes-to`.
- **Add 1 UI edge:** `navigates-to`.
- **Extend 2 existing edges** via union: `applies` (+ Workflow), `reflects` (+ Enum).
- **Remove 2 silent parser aliases:** `query`→`queries`, `interface`→`exposes`.
- **Clarify status of 2 synthetic runtime types:** `Feature` (scope marker, not meta-concept), `Consumer` (decide promote-or-drop).
- **Prioritized enforcement work** in `check-code-tag-composability.ts` for: `produces`, `transitions`, `queries`, `produces-for`, `triggers-cross` (the top 5 high-traffic unenforced edges).

The most load-bearing single fix is removing the silent aliases — they are an active source of drift today and unblock canonical validation.

---

## Agent 6 — ui-symmetry-check: verify whether the UI-layer meta-concept catalog is under symmetric pressure or whether C3's "UI not under pressure" verdict holds

All three files read. Now I have everything I need to produce the verdicts. Let me analyze each candidate carefully against the evidence.

**Reading summary before analysis:**

- `UI-SPEC.md` confirms C3's Case #8: `WhiteboardCanvas` is typed as plain `Component`, but externalized URL-bound selection state (`viewLevel`, `selectedCardId`, `selectedFeatureId`) lives in Route Query Parameters. The spec uses all 11 existing meta-concepts correctly (Page, Layout, Component, Hook, Binding, State Indicator, Form contracts, Action via mutations table, Guard via Route Table auth column). No Modal, no Dialog, no Toast, no Wizard, no Analytics, no Realtime subscription present.
- `templates/ui-spec.md` confirms C1's finding: HTML comment annotations for cross-layer edges at lines 35, 47, 65, 75, 95, 122 — structural hints for authors, not enforced.
- `TAXONOMY.md` confirms the 11 UI meta-concepts and their definitions. `Component` examples include "AssignPlayerDialog" — Modal/Dialog is currently absorbed as a special-case Component type, with `aria-modal` a11y guidance appearing in the template's Accessibility section but no dedicated meta-concept.

---

## C6 Output — UI Symmetry Check

### Per-candidate verdict table

| Candidate | Verdict | C2 severity | C3 evidence | Adoption-unblocker (if defer) | Citation chain |
|-----------|---------|-------------|-------------|-------------------------------|----------------|
| Modal / Dialog lifecycle | **defer** | essential | None — C3 found no Modal/Dialog abuse at spec level | First feature spec that registers a Modal as a plain `Component` and then needs to document open/close/focus-trap lifecycle in a way `Component` cannot express | C2 essential + C3 "no Modal abuse found" + TAXONOMY.md Component examples include "AssignPlayerDialog" (implying current absorption path works) + templates/ui-spec.md Accessibility row `{DialogName}` treated as vanilla a11y annotation |
| Wizard / Multi-step Flow | **defer** | essential | None — no multi-step flow feature exists yet | First feature spec that introduces a sequenced step-progression UI where per-step validation and back/forward navigation cannot be captured by a Hook + Form combination | C2 essential + C3 no Wizard evidence + only live spec is canvas-shaped with no step model |
| Notification / Toast | **defer** | essential | None — no Toast/notification surface referenced in UI-SPEC.md | First feature spec that must document a toast's severity variants, dismissal timer, and screen-reader announcement in a place where `Action` "On Success" column is insufficient | C2 essential + C3 no Toast evidence + current live spec uses `On Success: Invalidate ... and navigate` — adequate for canvas feature |
| Realtime Subscription | **defer** | essential | None — C3 found no WebSocket/SSE usage in specs | First feature spec that introduces a long-lived server-push connection where `Hook` + `Binding` cannot capture reconnect policy, backpressure, or subscription lifecycle | C2 essential + C3 explicit "no realtime/websocket abuse detected" + UI-SPEC.md Data Flow uses `GET` polling only, no subscription column |
| Optimistic Update | **defer** | essential | None — mutation hooks show standard `On Success: Invalidate` pattern, no optimistic rollback semantics documented | First feature spec where `useMutation` sets `onMutate` / `onError` rollback and that contract must be documented for correctness reviewers | C2 essential + C3 no Optimistic Update evidence + UI-SPEC.md mutations table `POST /api/knowledge-graph/rebuild → Invalidate card rail` — no rollback path visible |
| Empty / Loading / Error states | **partial-defer** (note below) | nice-to-have | Weak implicit evidence: `State-to-UI Mapping` table in UI-SPEC.md maps `Idle` → "Empty board prompt" — this is a loading/empty state encoded as a Domain Value, not a dedicated meta-concept. `FocusStateIndicator` is typed `State Indicator` not a loading skeleton. No evidence of spec-level confusion that required a new concept. | A second or third feature spec that must document skeleton loaders, error boundaries, or retry affordances in a way that authors consistently reach for the wrong meta-concept (e.g., labelling a loading skeleton as a `Component` with no further contract) | C2 nice-to-have + UI-SPEC.md State-to-UI `Idle` row + C3 low-severity Case #8 (adjacent to this — canvas stateful surface, not loading state) + TAXONOMY.md State Indicator definition does not mention absence/in-flight states explicitly |
| Analytics Event | **defer** | nice-to-have | None — no analytics calls, event payloads, or tracking hooks referenced anywhere in the only live spec | First feature spec that must instrument user behavior and the author reaches for `Action` "On Success" column or adds an ad-hoc `trackEvent()` call undocumented in the spec | C2 nice-to-have + C3 no analytics evidence + UI-SPEC.md has no tracking section |
| Theme / Design Token | **reject** | nice-to-have | None — but nature of the concept makes it orthogonal to the feature-scoped UI-SPEC format. Design tokens are a design-system concern, not a per-feature spec concern. Adding a meta-concept here would push token governance into UI-SPECs, which is the wrong layer for a shared design system primitive. | N/A — recommendation is reject, not defer. If token governance is needed, it belongs in a separate design-system spec type, not added to the 11 UI meta-concepts. | C2 nice-to-have + C1 (one template, one live spec — no design system spec type exists) + TAXONOMY.md UI layer is feature-scoped by design |
| Permission UI / Capability rendering | **conditional-defer** (note below) | essential | Weak structural evidence: UI-SPEC.md Route Table has `Permission: domainspec.kg.read` column — Guard meta-concept already captures this at the route level. The gap C2 identifies is per-component hide/disable/annotate based on user capabilities, which is finer-grained than a Guard. This is an architectural gap, but no spec has yet been written where a component renders differently per-capability inside a page. | First feature spec that must document component-level conditional rendering (hide a button, disable an action, annotate with "requires X plan") where a route-level Guard is provably insufficient | C2 essential + UI-SPEC.md Guard in Route Table (`domainspec.kg.read`) shows Guard works at route grain but spec is silent on component-grain capability rendering + TAXONOMY.md Guard definition: "A page or component should only render for certain users/roles" — technically covers both grains, but no template section enforces it |
| Form Field / Input Primitive | **reject** | nice-to-have | The live spec already uses Form meta-concept (Form Contracts section, field tables, Zod schemas). A `Form Field` sub-concept would be a nested decomposition below `Form` — adding it gains nothing in the spec vocabulary while increasing authoring overhead. The field table inside Form Contracts already captures field-level a11y and validation. | N/A — recommend reject. The existing Form meta-concept already has a field table in the template. Sub-atomizing below Form yields spec verbosity without expressiveness gain. | C2 nice-to-have + UI-SPEC.md Form and Selection Contracts section already captures field-level contracts (e.g., `OpenDefinitionAction` field table) + TAXONOMY.md Form definition covers field/validation/schema |
| Route | **reject** | nice-to-have | Route already exists implicitly as the mechanism that defines `Page`. TAXONOMY.md says: "A routable URL that renders a complete view" — the Page meta-concept owns the Route semantics. UI-SPEC.md's Route Table section is the Page section. Introducing Route as a separate meta-concept would split what is currently an atomic Page concept, creating a containment ambiguity: does a Page contain a Route or is it a Route? | N/A — recommend reject. Page already absorbs Route. If Route parameters need richer documentation, the Route Table in UI-SPEC template should grow columns (params, lifecycle hooks), not spawn a new meta-concept. | C2 nice-to-have + UI-SPEC.md Route Table + Route Query Parameters already captured as sub-section of Page + TAXONOMY.md Page definition + C3 Case #8 (URL-bound state is documented via Route Query Parameters without requiring a new concept) |
| Navigation / Breadcrumb model | **defer** | nice-to-have | None — the live spec documents Level 5 Browser Back Navigation as an Interaction Contract prose section, not a named meta-concept. The canvas feature avoids traditional breadcrumb navigation entirely. | First feature spec that must document a multi-level breadcrumb trail where each crumb carries its own route, label, and active-state logic in a way that does not fit the Interaction Contract prose pattern | C2 nice-to-have + UI-SPEC.md Level 5 Browser Back Navigation handled as prose Interaction Contract — no structural pressure to formalize + C3 "UI is largely fine at spec level" |

**Notes on non-binary verdicts:**

- **Empty / Loading / Error states** is marked `partial-defer` rather than `defer` because the `State Indicator` definition in TAXONOMY.md is silent about absence and in-flight states. This is a definition gap that should be patched (expand State Indicator's "When to use" to explicitly include loading skeletons and empty-state prompts) before the next UI feature lands. Cost: one sentence in TAXONOMY.md. This is not worth a new meta-concept, but it is worth a definition amendment.

- **Permission UI / Capability rendering** is marked `conditional-defer` because the Guard meta-concept's definition technically covers component-grain capability rendering ("A page or component should only render for certain users/roles"), but the template has no section that enforces or documents component-level capability contracts. The gap is a template gap, not a meta-concept gap. Unblock: add a `Capability Contracts` section to `templates/ui-spec.md` rather than adopting a new meta-concept.

---

### UI infrastructure verdicts (orthogonal to candidates)

**1. `AspectKind` excludes `ui-spec.md` — should the runtime KG mirror parse UI specs?**

**Verdict: defer, with a concrete condition.**

Rationale: The current exclusion is consistent with the purpose of the runtime mirror. `AspectKind` indexes backend spec files to build a structural knowledge graph of the domain model. `ui-spec.md` is a presentation contract, not a domain model artifact — it documents which components render which view models, not what the domain entities are. Parsing it into the mirror would conflate two distinct graph layers (domain knowledge vs. UI contract).

However, there is a real gap: the only live UI spec (`knowledge-graph-visualization/UI-SPEC.md`) references domain concepts (`MirrorCard`, `ConceptFocus`, aspect kinds) but those references are in prose tables, not indexed. If the mirror ever needs to answer "which UI components depend on which domain concepts," it cannot, because UI-SPEC.md is invisible to it.

The condition for revisiting: when a cross-stack edge validation use case emerges (e.g., C5's edge enforcement requires knowing which Hooks bind to which Operations), add a lightweight `ui-spec` aspect kind to the mirror that indexes the UI Concept Registry table only — not the full narrative sections. Do not parse UI prose; only parse the structured registry.

**2. Cross-layer edges hidden in HTML comments — should `templates/ui-spec.md` lift them into structured sections?**

**Verdict: adopt, small scope.**

The current HTML comments (lines 35, 47, 65, 75, 95, 122 in the template) are author hints — they tell the spec writer "this section touches cross-layer edges" but they are not parseable, not enforced, and invisible in rendered output. Any author who writes a UI-SPEC by reading the rendered template (e.g., via a preview) gets no guidance at all.

The fix is minimal and low-risk: replace or supplement the HTML comments with visible annotation lines in the template sections — for example, a one-line "Cross-layer: [Hook] → [Binding] → [Interface]" note at the top of the Data Flow section. This costs one doc-edit to the template and yields durable author guidance without requiring tooling.

This is the one infrastructure change that has a clear cost-benefit asymmetry in favor of acting now. The template is used for every new UI feature — the comment-to-visible-annotation upgrade compounds.

---

### Stance summary

C3's verdict — "UI is not under pressure yet" — is confirmed by direct reading of the only live spec. Every candidate on C2's list is either absorbed by an existing meta-concept, handled by the template's prose sections, or simply absent from the spec corpus. The appropriate overall stance is:

**Defer all new UI meta-concepts; address two non-concept gaps now.**

The two gaps worth acting on immediately are not candidate adoptions — they are internal consistency issues: (a) the `State Indicator` definition should be extended by one sentence to cover absence and in-flight states (so authors do not orphan loading skeletons as plain Components); (b) the HTML comments in `templates/ui-spec.md` should become visible author guidance. Both changes touch taxonomy definitions or the template, not the meta-concept count.

The three `reject` verdicts (Theme / Design Token, Form Field / Input Primitive, Route) are not "defer until evidence" — they are structurally wrong fits for the feature-scoped UI-SPEC format and should not be revisited without a fundamental change to how DomainSpec scopes UI documentation.

---

### Open questions

1. **Template grain vs. concept grain for Permission UI**: The Guard definition covers component-grain capability rendering by text, but the template has no section that captures it. Is a new `Capability Contracts` template section sufficient, or does the distinction between route-gate and component-gate need to be formalized as two meta-concepts? This needs strategist input before any authoring guidance is issued.

2. **State Indicator scope expansion**: Expanding the State Indicator definition to include loading/empty/error states is a small edit — but does it change the semantic boundary enough to warrant a taxonomy changelog entry? Strategist should confirm whether definition amendments require a version bump.

3. **`ui-spec.md` AspectKind condition**: The proposed condition (add a `ui-spec` aspect kind that indexes only the UI Concept Registry table) has an implicit schema dependency — the Concept Registry table format must be stable for parsing to be safe. Is the Concept Registry format frozen, or is it still evolving? C5's edge enforcement work may have a view on this.

4. **C3's `WhiteboardCanvas` / Stateful Surface finding**: C3 noted this as low-severity but did not recommend adopting "Stateful Surface" as a meta-concept. C6 concurs — the URL-bound state is fully documented in the Route Query Parameters section without needing a new type. But if C5's edge work produces a new edge type for "UI Component → Route Parameter", the `WhiteboardCanvas` case becomes the canonical example, and the taxonomy entry for Component may need a disambiguation note. Strategist should flag to C5.

5. **Template visible annotations (infrastructure verdict 2)**: Lifting HTML comments to visible text is unambiguously low-risk, but which section headers get the annotation and in what format? A concrete proposal (e.g., a `> Cross-layer:` blockquote under each section header) should be reviewed by the strategist before the template edit is made, to avoid format churn.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-findings.md](./domainspec-findings.md) | `cited-by` | Findings file's load-bearing claims (F1–F11, T1–T5) cite the per-agent sections of this research file per R17. |
| [../discovery.md](../discovery.md) | `derives` | The `domainspec-types-and-edges-validation` discovery derives its decisions and alternatives from the per-child evidence assembled here (via the findings synthesis). |
