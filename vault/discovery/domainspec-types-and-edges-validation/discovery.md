---
tags: [domainspec, taxonomy, relationships, edges, meta-concepts, composability]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: draft
veracidade: medium
convicção: high
version: 0.4.0
last_updated: 2026-05-11
---

# DomainSpec Types & Edges — Validation of `TAXONOMY.md` and `RELATIONSHIPS.md`

> Discovery synthesizing the `domainspec-types-and-edges-validation` dispatch (Wave 1 + Wave 2, six children + findings synthesis). Settles which meta-concept categories, meta-concepts, and edges DomainSpec should adopt, defer, or reject — and which composability rules should land next. All load-bearing verdicts trace to `research/domainspec-findings.md`, which in turn cites per-child evidence in `research/domainspec-research.md`.

---

## Objective

Validate DomainSpec's foundational catalog — the 25 meta-concepts in 4+4 categories declared by `TAXONOMY.md`, the 29 canonical edges declared by `RELATIONSHIPS.md`, and the composability rules in `governance/tags/tools/check-code-tag-composability.ts` — against (a) canonical DDD/CQRS/EIP/hexagonal literature, (b) live `docs/features/` pressure, and (c) the runtime parser at `backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts`. The end state is a written-down set of verdicts on categories, meta-concepts, and edges, so future amendments to `TAXONOMY.md` / `RELATIONSHIPS.md` derive from a recorded design rationale rather than ad-hoc reaction.

---

## Context

Investigating DomainSpec's foundational catalog (`TAXONOMY.md`): 25 meta-concepts in 4+4 categories, with edges formalized in `RELATIONSHIPS.md` (29 canonical labels). The user surfaced suspicion of gaps — "categories like `Pattern` with `SAGA`, missing types/edges." Wave 1 of the dispatch surfaced two surprises: (1) `RELATIONSHIPS.md` exists (edges are NOT implicit as the framing initially suggested) but only **8 of 29 edges have composability rules** in the checker; (2) synthetic runtime types `Feature` and `Consumer` live outside `TAXONOMY.md` — they are invented by the markdown parser but never declared in the catalog. Wave 2 produced evidence-backed verdicts (adopt / defer / reject) per candidate category, meta-concept, and edge, and decided whether the edge catalog needs additions, renames, or composability-enforcement work. The goal driving this discovery: produce a written design rationale so that amendments to `TAXONOMY.md` and `RELATIONSHIPS.md` derive from recorded reasoning rather than ad-hoc reaction.

### High-level summary of recommendations

The dispatch produced six load-bearing recommendations. Each is grounded in either internal pressure (C3 file:line evidence in `docs/features/**`) or canonical literature (C2: Evans/Vernon/Fowler/Cockburn/Hohpe&Woolf). Briefly:

1. **Grow categories from 4+4 to 7+4** — add **Cross-cutting/Operational**, **Integration**, **Persistence** on the backend side. *Why it matters:* today the `Operation` meta-concept silently absorbs cross-cutting concerns (retry / idempotency / watchdog / cancellation) inside its rule table, and `Entity` silently absorbs Aggregate Roots. Specs become harder to read and harder to validate because the catalog has no slot for these concerns. Three high-severity C3 cases (#1, #2, #4) all trace to this gap.
2. **Adopt six essential new meta-concepts** — **Aggregate**, **Aggregate Root**, **Repository**, **Read Model / Projection**, **Outbox**, **Domain Event vs Integration Event split**. *Why it matters:* these are the C2 ∩ C3 intersection — concepts that canonical literature treats as essential *and* the live `docs/features/**` corpus is already abusing existing meta-concepts to represent. Five more meta-concepts (Bounded Context, Domain Service, Command, Port, Adapter) are queued as "adopt-strong" — sequenced after essentials. (C2's seventh candidate, **Use Case**, was rejected during review because `Operation` already plays that role per `TAXONOMY.md`'s Architecture Mapping Appendix.)
3. **Defer all 11 new UI meta-concept candidates** (Modal, Wizard, Toast, Realtime, Optimistic Update, etc.). *Why it matters:* C3 found zero UI pressure in the only live UI spec (`knowledge-graph-visualization/UI-SPEC.md`). The catalog must not bloat ahead of evidence. Two tiny non-concept fixes ship now (extend `State Indicator` definition, lift HTML-comment annotations in `templates/ui-spec.md`); the next non-canvas UI feature is the forcing event for the rest.
4. **Add 9 edges, extend 2, remove 2 silent aliases** in `RELATIONSHIPS.md` (29 → 38 canonical edges). *Why it matters:* **Saga is currently a graph-orphan** — declared in `TAXONOMY.md` with zero edges in `RELATIONSHIPS.md`. Three new edges (`coordinates-cross`, `listens-to`, `issues`) close that gap. The two parser aliases `query` → `queries` and `interface` → `exposes` (`markdown-feature-docs-parser.ts:619-629`) are silent rewriters that diverge from `validate-relationships.ts` — C5 called their removal **"the most load-bearing single fix"** because they are an active source of drift today.
5. **Reject Pattern as a meta-concept; replace with a `pattern:` tag.** *Why it matters:* the user's hint surfaces a real navigational need — "let me find all messaging patterns in one place" — but Pattern has no structural shape. A category groups meta-concepts that share a template skeleton and an edge surface; SAGA / Outbox / Repository / Specification share neither. A free-form `pattern:` frontmatter tag delivers the navigational outcome without forcing the validator to treat structurally unrelated artifacts as siblings.
6. **Add composability rules for the top 5 priority edges** (`produces`, `transitions`, `queries`, `produces-for`, `triggers-cross`). *Why it matters:* adding 9 new edges in (4) without enforcement work worsens the enforcement ratio from 8/29 to 8/38. Bringing the top 5 unenforced load-bearing edges under composability checks lifts the ratio to 13/38. Edge additions and enforcement must land together or the catalog claim "edges are canonical" weakens further.

**Headline framing.** The catalog is mostly correct but **under pressure in two specific places** (`Operation` doing three jobs; `Query` doing two) and has **two silent integrity holes** (Saga is graph-orphan; parser aliases diverge from the catalog). The dispatch decided which gaps to close now, which to defer with explicit unblock conditions, and which to reject outright.

---

## Decisions Taken

### D-1. Categories — adopt three, defer two, reject one

**Decision.** Grow `TAXONOMY.md`'s category axes from **4 backend + 4 UI** to **7 backend + 4 UI**:

| Verdict | Category | Justification |
|---------|----------|---------------|
| **Adopt** | **Cross-cutting/Operational** | Backed by C3 case #2 (`ExecutePipelineRoute` bundles retry / idempotency / watchdog / cancellation / telemetry inside one Operation). Maps a load-bearing gap visible in live specs. |
| **Adopt** | **Integration** | Backed by C3 cases #5 and #6 (event boundary crossings; Domain Event vs Integration Event distinction collapses today). Aligns with EIP/DDD canonical separation. |
| **Adopt** | **Persistence** | Strongest evidence in the dispatch — three C3 cases (#1 Aggregate Root, #4 Read Model / Projection, #7 Repository contracts) all rest on a missing persistence-shape axis. |
| **Defer** | Temporal | No C3 evidence; theoretical only. Revisit when a feature spec surfaces time-bounded entities or scheduled state transitions. |
| **Defer** | Quality/Trust | No C3 evidence; C2 candidates (Validator, Policy in trust sense) lack repo grounding. Revisit when a compliance/governance feature ships. |
| **Reject** | **Pattern as meta-meta-concept** | "Pattern has no shape of its own; SAGA, CQRS-Outbox, Repository, Specification, Process Manager share nothing structurally except that people gave them names in books." Free-form `pattern:` frontmatter tag layered on specific meta-concepts gives the navigational outcome without the meta-meta-concept cost. |

#### Category profiles

The adopted/deferred categories are listed below with definition, intended members, evidence basis, and what concretely changes in `TAXONOMY.md`, templates, or specs. The Pattern-rejection rationale is expanded at the end of this section since it competes with the category framing.

##### Cross-cutting / Operational — adopt

**What it is.** Concerns that aren't part of any single business operation but apply *across* many of them: retry, idempotency, timeouts, audit logging, cancellation, dead-letter handling. Distinct from existing meta-concepts: not "business action that changes state" (Operation), not "constraint that blocks an action" (Rule), not "strategy that selects behavior" (Policy). These are **invariants of execution itself** — properties the system must guarantee no matter which Operation runs.

**Members (starter set).** Idempotency Key, Retry Policy, Dead-Letter Queue, Audit Log, Cancellation Policy, Watchdog/Timeout Policy, Snapshot.

**Why it's relevant.** Strongest single evidence case in the dispatch (C3 case #2, high severity): `docs/features/agent-execution-orchestrator/operations.md:84-93` buries five distinct cross-cutting concerns inside one Operation's rules table — R2 telemetry-pair, R3 terminal-outcome, R4 bounded retry, R5 cancellation policy, C2 stuck-flag (watchdog). None of these are business rules of `ExecutePipelineRoute`; they are system-wide guarantees that apply to every long-running operation. Lumping them into one Operation's rule table hides them from readers looking for them as concerns in their own right, and every new Operation either re-implements them inline or silently omits them — the catalog never says "you must declare your retry policy."

**What changes.** `TAXONOMY.md` gains a Cross-cutting/Operational category with 3–5 starter meta-concepts. Operation templates gain a section "Cross-cutting concerns applied" — a link to declared artifacts in this category. Policy meta-concept may migrate here (OQ-3).

##### Integration — adopt

**What it is.** The boundary between systems: how this system talks to others, how foreign messages enter, how local events get promoted into stable external contracts. The current `Event` meta-concept collapses two roles — *internal domain announcement* ("PaymentCompleted, for our own state machine") and *external integration signal* ("PaymentCompleted, contract v2.1, consumed by 4 downstream services"). Different governance: internal events evolve freely; integration events are versioned contracts.

**Members (starter set).** Outbox (transactional event publishing), Inbox (consumer idempotency), Webhook, Anti-Corruption Layer (translation defending one model from another), Gateway (encapsulated external-system access), Context Map relationships (typed integration between two bounded contexts). Domain-Event-vs-Integration-Event distinction sits here too — likely as a frontmatter flag on `Event` rather than two separate meta-concepts (decided alongside OQ-2).

**Why it's relevant.** Two C3 evidence cases. `examples/payment-processing/events.md:3-53` (medium severity): `PaymentInitiated` is internal (AuditLog, FraudDetection); `PaymentCompleted` carries an external `gatewayRef` field and is consumed by Order Management across a boundary. Both use the same template, no versioning, no envelope. `examples/user-account/events.md:27-46` (low severity): `EmailVerificationSent` has `Triggers transition: none — supplementary notification`. It's an outbound command to the notifications system, not a state-change announcement. It works today only because external consumers are few; the moment a partner integrates against `PaymentCompleted` and the spec changes a field, the partner breaks silently. Outbox isn't a "nice pattern to have" — it's the reliability primitive that prevents committed transactions from losing their downstream notifications when the message broker is briefly unavailable.

**What changes.** Outbox and Domain/Integration Event split land as initial members. Events grow an `integration: true | false` flag (or split into two meta-concepts, pending OQ-2). Cross-feature edges `produces-for` and `triggers-cross` fit here naturally.

##### Persistence — adopt

**What it is.** The storage and consistency shape of the data model: what's a transactional unit, who owns invariants across multiple entities, what's denormalized for reading versus authoritative for writing. The current `Entity` meta-concept does two jobs — "a thing with an ID" *and* "a consistency boundary that owns invariants across multiple sub-things." DDD calls the second thing an **Aggregate Root**; the distinction is the single most important decision in mature domain modeling.

**Members (starter set).** Aggregate (consistency boundary), Aggregate Root (the only Entity the outside can touch — guards invariants), Repository (collection-like access at the Aggregate granularity), Read Model / Projection (denormalized view built specifically to serve a query, often event-maintained), Materialized View, Event Store.

**Why it's relevant.** Strongest evidence basis — three C3 cases, two high severity:

- `docs/features/agent-execution-orchestrator/domain.md:45-66` (high): `ExecutionRun` is typed `Entity` but actually owns 4 Value-Object children and enforces cross-child invariants `I-WF-2` and `I-WF-4`. A reader looking at "what's an Entity here" gets a flat object; the consistency boundary across 4 sub-objects is invisible.
- `docs/features/knowledge-graph-visualization/queries.md:1-98` (high): Four "queries" return denormalized, UI-pre-shaped data from `MirrorProjection`, persisted by an Operation and refreshed by an Event. This is a textbook event-maintained Read Model. Calling them Queries hides the rebuild lifecycle, the staleness model, and the fact that `MirrorProjection` itself isn't domain state.
- `examples/payment-processing/domain.md:5-26` (medium): `PaymentTransaction` has a `refundedAmount` field and an invariant `amount ≤ tx.amount - tx.refundedAmount`. That invariant spans the parent and implicit `RefundAttempt` children. The aggregate is real; the spec flattens it.

**What changes.** Aggregate Root becomes a meta-concept distinct from Entity; specs declare which Entity is the root. Read Model / Projection becomes a meta-concept distinct from Query (knowledge-graph-visualization queries get reclassified). New edges land: `manages` (Repository → Aggregate Root), `derived-from` (Read Model → Event — already adopted in D-4). The Structural category may be partitioned (OQ-1): does Persistence sit alongside Structural, or absorb the data-modeling pieces of it?

##### Temporal — defer

**What it is.** Time-triggered concerns: scheduled jobs (cron), time windows, snapshots taken at intervals, deadline-bounded operations.

**Why deferred.** C2 listed Scheduled Job and Snapshot only as nice-to-have. C3 found zero evidence cases in any spec where the team was forced to model a time-trigger awkwardly. The catalog isn't under pressure here; adopting now would be speculative.

**Unblocker.** First feature spec that introduces a cron-triggered operation or a periodic snapshot rebuild — Scheduled Job and Snapshot would be the first members at that point.

##### Quality / Trust — defer

**What it is.** Cross-aggregate invariants, post-conditions, and reified specifications (the DDD Specification pattern — composable predicates combinable with and/or/not).

**Why deferred.** C2 marked Specification as nice-to-have only. C3 found no evidence cases. The current Rule meta-concept handles single-operation constraints adequately; the gap (composable cross-aggregate invariants) hasn't shown up in any spec yet, and is possibly subsumed by Rule + Policy.

**Unblocker.** A spec that needs to reuse the same complex predicate across three Operations and a Query — that's when Specification earns its place.

##### Why "Pattern" is not a category

The user's hint — "could SAGA live under a Pattern category alongside CQRS, Outbox, Repository?" — surfaces a real navigational need but proposes the wrong mechanism. A DomainSpec category is a grouping of meta-concepts that share a **structural family**: Structural concepts have field shapes and identity rules; Behavioral concepts have action shapes with rules + calculations; Connective concepts cross boundaries; Lifecycle concepts encode states + transitions. Each category constrains the meta-concept templates that live in it.

"Pattern" has no shape. SAGA, Outbox, Repository, and Specification share the property of being named in books but nothing structural — they cannot be linted as one family, they cannot share an edge surface, they cannot share a template skeleton. Making Pattern a category would either force the validator to treat structurally unrelated artifacts as siblings (collapsing the distinction) or make Pattern a category-with-no-rules (semantically empty).

The navigational need is genuine and is solved differently: an optional `pattern:` frontmatter tag on individual meta-concept instances. `Outbox` is a meta-concept in the **Integration** category, optionally tagged `pattern: transactional-outbox` to link it to Inbox. Readers searching for "all the messaging patterns" use the tag index; the catalog stays structurally honest.

#### Rationale (category-axis decision)

Two principles applied: (a) prefer adopting categories that have **internal pressure evidence** (C3 file:line) over those that have only **external canon** (C2 literature); (b) treat the user's "Pattern" intuition as a naming/navigation need, not a structural one.

**Status.** Adopted. `TAXONOMY.md` migration plan deferred to spec stage.

---

### D-2. Backend meta-concepts — adopt-essential / adopt-strong / reject lists

**Decision.** Three-tier outcome:

**Adopt as essential** (strong C2 + C3 convergence, non-deferrable):

- **Aggregate** and **Aggregate Root** — `ExecutionRun` is structurally an Aggregate Root forced into `Entity` (C3 #1).
- **Repository** — repository contracts already exist in the code but have no meta-concept (C3 #7).
- **Read Model / Projection** — `MirrorProjection` and the `GetMirrorCards` / `GetRelationshipGraph` queries serve event-maintained projections, not transient reads (C3 #4).
- **Outbox** — already named in the user's framing; canon-confirmed essential meta-concept (C2 essential tier).
- **Domain Event vs Integration Event split** — current `Event` meta-concept collapses both; C3 cases #5 and #6 surface real ambiguity.

**Adopt as strong** (essential in C2, lower C3 pressure — sequence behind essentials):

- **Bounded Context** — sits behind Aggregate work; needed once cross-context edges are typed.
- **Domain Service** — currently absorbed by Operation; needed once Operation is decomposed.
- **Command** — paired with Query (currently asymmetric).
- **Port**, **Adapter (driving/driven)** — hexagonal pair; lands together with hexagonal terminology or not at all.

**Reject** (out of scope, anti-pattern, or already subsumed):

- **Use Case** — *subsumed by `Operation`.* `TAXONOMY.md`'s Architecture Mapping Appendix explicitly maps Operation to the application layer as a "use-case factory" (`makeX(deps) -> (input) => Promise<output>`). Operation already plays the Clean Architecture interactor role; adopting Use Case would create a synonym, not a new shape. C2 imported the term from canonical literature without checking the existing layer mapping — caught during review.
- **Identity Map**, **Lazy Load** — ORM-implementation concerns; below DomainSpec's level.
- **Active Record**, **Service Layer** — anti-patterns vs current architecture.
- **Strategy**, **Observer** — GoF patterns; not domain concepts (this is the same rejection as Pattern-as-meta-concept, D-1, applied to specific cases).
- **Background Worker** — operational primitive; covered by Operation + Cross-cutting/Operational category.

**Rationale.** Cosmetic verdicts (rename, defer, adopt one category) miss the structural cause T1 surfaces: `Operation` is doing three jobs (domain action, application orchestration, cross-cutting concern host) and `Query` is doing two (transient read, materialized projection). Until Aggregate Root + Read Model land, Operation will continue absorbing whatever doesn't fit. (Use Case was originally listed here as a third lever, but Operation already plays that role — see rejection note above; the residual "is Operation doing too many jobs?" question now sits at OQ-8.)

**Status.** Adopted. Order: Aggregate Root + Read Model first (C3 non-deferrable); Repository, Outbox, Event-split follow; strong tier sequences after essential lands.

---

### D-3. UI meta-concepts — defer all candidates, reject three, apply two non-concept fixes

**Decision.**

- **Defer** all 11 new UI meta-concept candidates: Modal, Wizard, Toast, Realtime Subscription, Optimistic Update, Empty State, Loading State, Error State, Analytics Event, Permission UI, Navigation/Breadcrumb. Re-evaluate at the **next non-canvas feature spec** (forcing event).
- **Reject** three structurally wrong-fit candidates: **Theme / Design Token**, **Form Field / Input Primitive**, **Route** — these do not fit the feature-scoped UI-SPEC format and should not be revisited without a fundamental change to how DomainSpec scopes UI documentation.
- **Apply two non-concept fixes now:**
  - Extend the **`State Indicator` definition** by one sentence to cover loading / empty / error states (so authors do not orphan loading skeletons as plain Components).
  - Lift the **HTML-comment annotations in `templates/ui-spec.md`** to visible author guidance.

**Rationale.** C3 + C6 independently found no UI meta-concept abuse in the only live UI spec (`knowledge-graph-visualization/UI-SPEC.md`). All 11 UI meta-concepts share one template; there is no `examples/*/ui-spec.md`; the runtime `AspectKind` enum has no UI equivalent. UI is correctly under-pressure today, but T5 flags that the asymmetry (11 UI concepts vs. 1 spec exercising them) means the next non-canvas feature is a forcing event — the defer verdict has a half-life.

**Status.** Adopted. The two non-concept fixes can ship as a low-risk demonstration.

---

### D-4. Edges — add 9, extend 2, remove 2 aliases, keep forward-only

**Decision.** `RELATIONSHIPS.md` grows from **29 to 38 canonical edges** via the following deltas:

| Layer | Edge | Direction | Why |
|-------|------|-----------|-----|
| Backend | `has-lifecycle` | Entity / Aggregate Root → Lifecycle | Names the state-machine relationship currently encoded only in prose. |
| Backend | `transitions-on` | Lifecycle → Event | Pairs with `has-lifecycle`; closes the lifecycle subgraph. |
| Backend | `consumed-by` | Event → Operation / Saga | Names the consumer side of `produces`. |
| Backend | `coordinates-cross` | Saga → Feature | Saga is currently an edge-orphan; this is the minimum to make it graph-navigable. |
| Backend | `listens-to` | Saga → Event | Completes Saga's surface. |
| Backend | `issues` | Saga → Command | Completes Saga's surface. |
| Cross-cutting | `derived-from` | UI Component → Aggregate / Read Model | Cross-stack lineage edge (UI surfaces derived from backend types). |
| Cross-cutting | `promotes-to` | Domain Event → Integration Event | Names the boundary-crossing promotion captured by the Domain/Integration Event split. |
| UI | `navigates-to` | UI Component / Route → UI Component | Names UI flow (currently encoded in prose). |
| Backend (extend) | `applies` | + Workflow target | Migration cost: 0 (parser already handles type union). |
| Backend (extend) | `reflects` | + Enum target | Migration cost: 0 (parser already handles type union). |

**Remove silent parser aliases.** `markdown-feature-docs-parser.ts:619-629` silently rewrites `query` → `queries` and `interface` → `exposes`. These aliases are undocumented and diverge from `validate-relationships.ts`. Remove them via a three-step migration: warn → rewrite docs → delete alias code. C5 calls this **"the most load-bearing single fix"** — it is an active source of drift today.

**Forward-only retained.** Do not adopt vault-style forward+inverse edge pairs. Keep `RELATIONSHIPS.md` forward-label-only. Add an optional doc-only **"read-back phrase" column** for human readers. Vault's edge convention does not transfer to DomainSpec because (a) different ontology level, (b) the parser is forward-only by design, (c) the enforcer already encodes direction via `(fromType, toType, direction)` tuples, (d) documentation cost outweighs benefit.

**Status.** Adopted. Saga's three edges (`coordinates-cross`, `listens-to`, `issues`) close the most surprising graph defect surfaced (F5 — Saga is currently orphan in `RELATIONSHIPS.md`).

---

### D-5. Composability enforcement — top 5 priorities

**Decision.** Beyond the 8/29 edges already enforced, prioritize composability rules for these five edges next:

1. **`produces`** — Operation → Event (event production is load-bearing for the KG mirror).
2. **`transitions`** — Lifecycle → State (state machine correctness; gates Aggregate work).
3. **`queries`** — Query → Entity / Read Model (closes the read-side surface).
4. **`produces-for`** — Operation → Consumer (cross-feature contracts; sole production user of the synthetic `Consumer` type).
5. **`triggers-cross`** — Operation / Saga → Operation in another Feature (cross-feature side effects).

**Rationale.** Adding 9 new edges in D-4 without enforcement work worsens the ratio from 8/29 to 8/38. Adopting these five enforcement targets simultaneously brings the ratio to **13/38** — still under half, but covering the load-bearing edges (event production, state transitions, query↔entity, cross-feature writes, cross-feature events). T2 frames this as a hard sequencing constraint: edge additions and enforcement land together or the catalog claim "edges are canonical" weakens further.

**Status.** Adopted as enforcement priority list. Implementation deferred to spec stage.

---

### D-6. Synthetic types `Feature` and `Consumer` — split treatment

**Decision.**

- **`Feature`** — treat as a **scope qualifier**, not a meta-concept. Document its synthetic origin in `TAXONOMY.md` as a non-meta-concept aspect, but do not promote it to the meta-concept list.
- **`Consumer`** — **open question** (OQ-4 below). Two viable paths: (a) promote to `TAXONOMY.md` as a first-class meta-concept (since `produces-for` is its sole production user); (b) drop in favor of concrete types named at the call site.

**Rationale.** `Feature` and `Consumer` are created at runtime by `markdown-feature-docs-parser.ts` but never declared in `TAXONOMY.md` — a violation of "RELATIONSHIPS.md is the contract." The split is unavoidable: `Feature` is structurally scope-shaped, `Consumer` is structurally type-shaped, so a single uniform treatment would mis-classify one of them.

**Status.** `Feature` resolved (scope qualifier). `Consumer` deferred to OQ-4.

---

## Alternatives Considered

### A-1. Pattern as a first-class meta-concept (rejected)

**Considered.** Promote `Pattern` to TAXONOMY.md as a meta-meta-concept, with SAGA / Outbox / Repository / Specification / Process Manager as instances. This was the user's initial intuition from the dispatch framing.

**Rejected because.** Pattern has no shape of its own. The candidates that would live under it share **nothing structurally** beyond having names in canonical literature. Adopting Pattern would force the catalog to carry an abstract type whose only purpose is grouping — a navigational concern, not a structural one. A free-form `pattern:` frontmatter tag layered onto specific meta-concepts delivers the same navigational outcome without the meta-meta cost. (T3 in findings.)

**Trace.** `research/domainspec-research.md#agent-4--categories-and-pattern-meta-inquiry` Q1.

---

### A-2. Adopt all C2 essential candidates immediately (rejected for those without C3 evidence)

**Considered.** Accept C2's full "essential" tier as adoption-ready, on the strength of canonical literature alone (Evans/Vernon/Fowler/Cockburn/Hohpe&Woolf).

**Rejected because.** C2 explicitly did zero codebase reads ("I do NOT need to read DomainSpec internals — that's C1/C3"). Its "essential" tier is **frame-relative** (essential in literature), not **repo-relative** (essential to DomainSpec right now). Adopting C2's tier wholesale would import canonical pressure that DomainSpec does not yet experience — bloating the catalog with under-justified meta-concepts. D-2's "adopt-essential" list is narrowed to the **C2 ∩ C3 intersection** (six concepts where both lenses converge); the rest are demoted to "adopt-strong" (sequence behind essential) or deferred.

**Trace.** T4 in findings (Independence as a feature, not a bug); `research/domainspec-research.md#agent-2-...` preamble.

---

### A-3. Adopt vault-style forward+inverse edge pairs (rejected)

**Considered.** Mirror the vault's bidirectionality discipline in `RELATIONSHIPS.md` — every edge gets a forward and an inverse label, both declared explicitly. (`derives-from` / `derives`, `cites` / `cited-by`, etc.)

**Rejected because.** Four-point rationale:

1. **Different ontology level.** Vault edges describe relationships between knowledge artifacts (premises, discoveries); DomainSpec edges describe relationships between code-level meta-concepts (Operations, Events, Entities). The reading discipline differs.
2. **Parser cost.** The markdown parser is forward-only by design; introducing inverse names doubles the surface to validate.
3. **Enforcer already encodes direction.** `(fromType, toType, direction)` tuples in `check-code-tag-composability.ts` carry the direction without needing a second name.
4. **Documentation cost outweighs reader benefit.** A doc-only "read-back phrase" column on each edge gives readers the inverse phrasing without forcing an authoring obligation.

**Trace.** `research/domainspec-research.md#agent-5--edge-catalog-proposal` Section 5.

---

### A-4. Document the parser aliases instead of removing them (rejected)

**Considered.** Keep `query` → `queries` and `interface` → `exposes` as legitimate aliases. Just document them in `RELATIONSHIPS.md` so they are no longer silent.

**Rejected because.** "Silent rewriting is the worst kind of 'helpful.'" Documenting aliases legitimizes a divergence between the parser and the catalog, bloats the canonical edge list, and invites more aliases in the future. The catalogs must be **the contract** — the parser is a consumer, not a parallel source of truth. Three-step migration (warn → rewrite docs → delete alias code) is strictly cleaner than perpetuating the alias surface.

**Trace.** `research/domainspec-research.md#agent-5--edge-catalog-proposal` Section 8 Decision A.

---

## Open Questions

### OQ-1. "Persistence" vs "Structural" boundary — partition or addition?

The newly adopted **Persistence** category (D-1) overlaps semantically with the existing **Structural** category — both describe shape concerns. Does Persistence carve out a sub-region of Structural (partition), or does it sit alongside as a peer (addition)? **Recommendation:** treat as an addition for the first iteration; revisit if Structural's membership thins to the point where re-merging becomes obvious.

### OQ-2. "Integration" vs "Boundary" axis from C2 — one category or two?

C2's literature survey hinted at a "Boundary" axis (Bounded Context, Anti-Corruption Layer, Port) distinct from "Integration" (Event, Message, Channel). D-1 collapsed both into **Integration**. **Recommendation:** keep collapsed for now; split only if a future feature spec surfaces evidence that the two axes need different membership rules.

### OQ-3. Policy meta-concept migration if Cross-cutting/Operational becomes a category

If the **Cross-cutting/Operational** category (D-1) is fully populated, the existing `Policy` meta-concept may migrate from its current category. **Recommendation:** defer the migration decision until at least three Cross-cutting/Operational meta-concepts are nominated, so the category's membership shape is concrete.

### OQ-4. `Consumer` synthetic type — promote to `TAXONOMY.md` or drop?

D-6 left `Consumer` open. The `produces-for` edge is its sole production user. **Recommendation:** promote `Consumer` to a first-class meta-concept under **Integration** (D-1), since its only role is naming a cross-feature integration endpoint. The alternative (drop and inline concrete types) loses the abstraction value when the same downstream Feature consumes from multiple producers.

### OQ-5. `@A`/`@B` scope marker enforcement

C1 surfaced `@A` / `@B` scope markers in some feature docs but found no enforcement path. **Recommendation:** treat as documentation convention only until a feature spec actively depends on cross-scope edge resolution; then promote to parser-enforced syntax.

### OQ-6. Pattern-tag governance — free-form or curated vocabulary?

D-1 rejected Pattern as a meta-concept and replaced it with a free-form `pattern:` frontmatter tag. **Recommendation:** start free-form (no curation); if tag drift becomes visible after the first six months of use, propose a curated tag vocabulary via a new discovery rather than retro-promoting Pattern to a meta-concept.

### OQ-7. Migration plan for breaking alias removal

D-4 prescribes removing the `query` → `queries` and `interface` → `exposes` aliases. **Recommendation:** three-step migration — (1) parser emits warnings on alias usage with file:line; (2) batch-rewrite all `docs/features/**/*.md` callers; (3) delete alias code. Each step lands as its own PR so the warning-to-removal gap is reviewable.

### OQ-8. Is `Operation` doing two jobs — application orchestration *and* domain service?

D-2 rejected **Use Case** because Operation already plays the application-interactor role per `TAXONOMY.md`'s Architecture Mapping Appendix (Operation → Application layer, "use-case factory"). That resolves the Use Case question but exposes a residual ambiguity: where does *stateful, cross-aggregate domain logic* live? Today the options are Calculation (pure derivation), Rule (pure predicate), or — by default — another Operation. But if Operation is application-layer, then cross-aggregate domain logic inside an Operation is in the wrong layer. The candidate Domain Service in the adopt-strong list addresses this gap, but only if Operation truly stops at orchestration. **Recommendation:** surface this only when the first cross-aggregate domain-logic case appears in a feature spec (e.g., a transfer between two Aggregate Roots, a settlement that spans multiple Aggregates). Premature splitting is more dangerous than the current ambiguity; the live corpus does not yet have a clean test case. If Domain Service lands first via adopt-strong sequencing, this question may resolve naturally — Domain Service absorbs the misplaced cross-aggregate logic and Operation tightens to pure orchestration.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [research/domainspec-findings.md](research/domainspec-findings.md) | `derives-from` | The synthesis this discovery directly derives from. Every D-* and A-* in this discovery traces to an F* or T* claim in findings. |
| [research/domainspec-research.md](research/domainspec-research.md) | `derives-from` | The verbatim per-child research the findings cites. Edge-level evidence (C3 file:line cases, C5 section structure, C2/C6 tables) lives here. |

> **Note on `TAXONOMY.md` and `RELATIONSHIPS.md`.** These files at the repo root are project artifacts, not vault graph nodes — they carry no `node_type` frontmatter and no `## Connections` block. Per the `edges.md` carve-out principle (forward edges into non-vault files are forward-only, with no inverse obligation on the target), references to them are listed under `## References` below as plain markdown links rather than as `cites` edge rows. The audit script does not have a carve-out for repo-root project files; using References avoids generating spurious asymmetry warnings.

---

## References

- [/Users/victorboscaro/domainspec/TAXONOMY.md](../../../TAXONOMY.md) — the 25 meta-concepts and 4+4 category axes this discovery validates and proposes to grow to 7+4.
- [/Users/victorboscaro/domainspec/RELATIONSHIPS.md](../../../RELATIONSHIPS.md) — the 29 canonical edges this discovery validates and proposes to grow to 38 with the deltas in D-4.
- [/Users/victorboscaro/domainspec/governance/tags/tools/check-code-tag-composability.ts](../../../governance/tags/tools/check-code-tag-composability.ts) — the composability checker. 8 of 29 edges enforced today; D-5 lists the next five priorities.
- [/Users/victorboscaro/domainspec/backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts](../../../backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts) — the runtime parser. Source of the silent `query` → `queries` and `interface` → `exposes` aliases (lines 619-629) that D-4 removes. Also the origin of the synthetic `Feature` and `Consumer` types that D-6 disposes of.
- [/Users/victorboscaro/domainspec/templates/ui-spec.md](../../../templates/ui-spec.md) — the single UI spec template all 11 UI meta-concepts share. D-3 prescribes lifting its HTML-comment annotations to visible author guidance.

---

## Source dispatch

This discovery derives from the `domainspec-types-and-edges-validation` subagents dispatch:

- **Findings** (synthesis): `vault/discovery/domainspec-types-and-edges-validation/research/domainspec-findings.md`
- **Research** (raw per-child): `vault/discovery/domainspec-types-and-edges-validation/research/domainspec-research.md`
- **Dispatch shape:** DAG, two waves, 6 children (C1 catalog-inventory, C2 external-frame-survey, C3 internal-pressure-audit, C4 categories-and-pattern-meta-inquiry, C5 edge-catalog-proposal, C6 ui-symmetry-check) + 2 writer agents. ~194k tokens total. Coverage 0.85, Independence 0.9, Fidelity 0.95, Cost discipline 0.92 (all but cost are judgments per R22).
