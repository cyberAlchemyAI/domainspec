---
tags: [subagents, dispatch-artifact, subagents-research]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-18
dispatch_slug: 2026-05-18-data-contract-formal-artifact-01
spec_file: vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `2026-05-18-data-contract-formal-artifact-01`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.

---

## Context

User asked whether data-contract should become a formal DomainSpec artifact. DomainSpec already encodes data-contract-like info in SPEC concept tables, aspects, observability/OTel specs, and infra. Open question: is a dedicated artifact justified, and should it be derived, governed, or tag-based.

## Goal

Produce a discovery-ready proposal for how (and whether) data-contract becomes a formal DomainSpec artifact, with implementation sketch.

---

## Agent 1 — L1-A1 (Repo audit: explicit data-contract surfaces)

Inventory of repo surfaces that carry data-contract-like info. Sources: `/Users/victorboscaro/domainspec/templates/SPEC.md`, `docs/features/payment-processing/SPEC.md`, `domain.md`, `operations.md`, `interfaces.md`, `events.md`, `docs/registry.md`, `OBSERVABILITY.md`, `templates/slos.md`, `AUTHORITY-MAP.md`, `templates/infra-architecture.md`.

Surfaces present: SPEC concept tables (concept name, ID, type, ownership via feature pack, dependencies, "Produces For" consumer registry); domain.md entity/VO definitions (fields, types, constraints, equality rules); operations.md (operation semantics, R-rules pre/postconditions, C-calculations, postcondition bullets); interfaces.md (endpoint path/method/auth, request/response shape, status codes, field-to-operation mappings); events.md (event name, producer, payload fields, consumer list with action description); queries.md (read models, query input/output); registry.md (concept ID, type, feature owner, concept graph with typed edges produces/enforces/queries/exposes/maps); SPEC frontmatter (feature name, version "current", status, last update, pillar, audience, priority, dependencies, owners); OBSERVABILITY.md (derived metrics per operation/state/event/query, O1–O16 rules, alert thresholds, SLO template availability≥99.9% p99≤threshold); slos.md template (global SLOs uptime/API p95/error rate, per-feature SLOs with O-rule refs, error budget, alert routing); AUTHORITY-MAP.md (canonical source per system piece, feature pack as feature authority); infra-architecture.md (network services/ports, Prometheus scrape config auto-derived from observability, Grafana dashboards per feature).

Fidelity assessment table (data-contract element / status / where present / fidelity gap):
- Shape (field names, types, nullability): ✓ Partial in domain.md, interfaces.md — no field deprecation or versioning within schema.
- Semantics (what a field means): ✓ Partial in glossary, concept definitions, operations.md postconditions — no consumer-facing semantics.
- Ownership (who owns this entity/API): ✓ Partial in SPEC frontmatter `owners:`, feature pack structure — no per-operation or per-field ownership, no contact/rotation.
- SLO/Availability: ✓ Partial in slos.md, OBSERVABILITY.md — per-feature not per-operation, no consumer-specific freshness.
- Consumers: ✓ Yes in events.md, SPEC "Produces For", interfaces.md — no per-consumer SLA (lag/loss tolerance).
- Versioning: ✗ Missing — feature version = "current", no schema versioning, no API versioning markers, no deprecation timelines.
- Breaking-change policy: ✗ Missing — no notification window, no impact assessment process.
- Data retention: ✗ Missing entirely.
- Schema evolution: ✗ Missing — no backward-compat guarantees or deprecation window.
- Consumer registry with SLA: ✓ Partial in events.md, registry.md concept graph — consumer list exists, no per-consumer lag/loss tolerance SLO.
- Calculation accuracy/drift: ✓ Partial in OBSERVABILITY.md O6 — alert only, no spec-level SLA on acceptable drift.

Key observations: (1) DomainSpec already encodes rich data-contract material at spec-read time; missing pieces are governance structure (who decides what's a breaking change) and versioning mechanics (how multiple schema versions coexist). (2) Ownership is at feature granularity, not entity/operation/field — a contract artifact would push ownership down 1-2 levels. (3) registry.md concept graph has producer/consumer/dependency edges but no edge metadata (when consumer joined, breaking-change notice window). (4) SLOs are per-feature not per-operation — a consumer of ProcessPayment doesn't have a distinct latency/availability SLO from the broader feature. (5) No formal deprecation/migration path — SPEC version is "current", no way to declare "field deprecated as of X, use newField, remove by Y."

---

## Agent 2 — L1-A2 (Repo audit: implicit contract seams)

8 seams identified with drift-risk assessment.

**Seam 1 — Event Payload Schema (HIGH risk)**. File: `docs/features/payment-processing/events.md` lines 1-100+. Flows: PaymentInitiated, PaymentCompleted, PaymentFailed, RefundCompleted with typed payloads (Money, TransactionId, OrderId, PaymentErrorCode). Declared: payload structure with field names/types/descriptions. Implicit/missing: no semantic versioning, types narrative-only ("Money", "TransactionId") not runtime-enforced, no payload validation rules, consumer expectations not machine-checked, no event envelope. Producer/consumer: Payment Processing → (Notifications, Order Management, Audit, Fraud Detection), no explicit consumer acknowledgement. Risk: field-name typo (transactionId → transaction_id) breaks all consumers silently.

**Seam 2 — OTel Attributes (MEDIUM-HIGH)**. File: `docs/features/agent-execution-orchestrator/observability.md` lines 1-100. Flows: Counters/Histograms/Gauges with attributes labels. Declared: metric name, instrument type, unit, attribute list, alert thresholds. Implicit/missing: no attribute cardinality limits/regex, no default-value contract, no timestamp skew tolerance, no attribute typing (string vs int vs enum), no observability spec versioning. Risk: attribute typos break alerts silently; high-cardinality crashes Prometheus.

**Seam 3 — Mapping Field Transformations (MEDIUM)**. File: `docs/features/payment-processing/mappings.md` lines 1-66. Flows: REST request → entity (RequestToTransaction); entity → REST response (TransactionToResponse). Declared: source/target/transformation/validation rules, defaults. Implicit/missing: transformation prose not executable, no cardinality guarantees, defaults not cross-referenced to operations.md postconditions, no idempotency contract, bidirectional consistency unchecked. Risk: field rename breaks mapping silently; calculated fields drift.

**Seam 4 — Interface Request/Response Contracts (MEDIUM)**. File: `docs/features/payment-processing/interfaces.md` lines 1-94. Flows: HTTP request/response bodies + internal module methods. Declared: field names/types/required, status codes, field-to-operation mapping. Implicit/missing: no JSON Schema/OpenAPI/TypeScript types (table not machine-parseable), error shape loose, no nullable semantics, no endpoint versioning, auth/rate-limit contracts missing, no example payloads. Risk: clients built against markdown break on field order/type change.

**Seam 5 — Cross-Feature Event Triggering (HIGH)**. File: `docs/features/payment-processing/_categorical/extraction.log.md` lines 163-175. Flows: events trigger downstream feature operations. Declared: event + consumer feature in SPEC.md "Produces For", consumer action in prose. Implicit/missing: NO consumer operation defined (extraction log flags this explicitly — `triggers-cross` edge cannot be emitted), no SLA for event delivery/lag, no ordering guarantees, no consumer ack/dead-letter handling, no payload schema versioning across boundary. Risk: payload changes break consumers; events emitted and discarded silently.

**Seam 6 — Workflow Handoff Artifacts (MEDIUM)**. File: `docs/features/agent-execution-orchestrator/workflows.md` lines 72-98, `observability.md` lines 85-88. Flows: stage-to-stage handoff refs. Declared: handoffArtifactRefsByStagePair required per consecutive pair, expected refs table, lineage refs in telemetry. Implicit/missing: no deterministic hash of handoff artifacts, ordering not enforced, no schema for referenced artifact, no recovery contract, lineage continuity observability-only not runtime-enforced. Risk: refs point to deleted/renamed sections; nondeterministic under parallel execution.

**Seam 7 — State Machine Transitions (MEDIUM)**. File: `docs/features/payment-processing/states.md` (implicit). Flows: events trigger PaymentStatus transitions Created → Processing → Completed/Failed. Declared: transitions table maps events to state changes, guard rules referenced but only 2 named Rule objects. Implicit/missing: inline guards (R4–R10) not declared as named Rule objects, no idempotency for event re-emission, no timeout/race-condition handling, invariants exist only implicitly. Risk: missing guard validations allow invalid transitions; implicit invariants violated by out-of-order events.

**Seam 8 — Concept-Table to Code Mapping (HIGH)**. File: SPEC.md concept tables + `_categorical/extraction.log.md`. Flows: L₁ concepts mapped to L₂ via @biz anchors / derivation rules. Declared: concept table with ID/type/anchors, categorical extractors derive expected L₂ per R1–R20 O1–O16. Implicit/missing: NO enforcement that code matches spec (payment-processing has 0 L₂ objects despite 21 L₁ concepts, no test fails, extraction silent); no bidirectional constraint (orphaned code not flagged); derivation rules prescriptive but not CI-enforced; multi-mapped concepts not detected; no cardinality constraints. Risk: concept definition changes without code update; coverage gaps silently introduced.

Cross-cutting observations: (1) Event payloads are highest-exposure seam (Seam 1+5) — a data-contract artifact should start here: envelope format, field cardinality, type strictness, versioning policy. (2) Observability metrics are implicit schemas (Seam 2) — data-contract could enforce attribute coercion/cardinality limits/versioning. (3) L₁→L₂ mapping is spec-drift-prone (Seam 8) — data-contract should define enforcement rules (every Event has ≥1 producer test; every Operation@A has witness if produces-for Entity@B). (4) Mappings are documentation not contracts (Seam 3) — could embed JSONSchema/TypeScript types and validate at compile time. (5) Interface contracts lack machine-readable form (Seam 4) — could mandate OpenAPI generation from SPEC + observability. (6) Handoff artifacts in multi-stage workflows are implicit lineage (Seam 6) — could enforce integrity via checksums.

Recommendation from L1-A2: dedicated artifact should focus on Seams 1, 2, 5 (events, OTel) where cross-feature boundaries and implicit schema risks are highest. Seams 3–4 benefit from schema registry integration (JSONSchema, OpenAPI). Seam 8 requires enforcement rules (derivation-rule validation in CI/CD), not a standalone artifact. Seam 6 is secondary unless workflow parallelism is enabled.

---

## Agent 3 — L1-A3 (Literature: data contracts movement)

5 sources surveyed.

**Andrew Jones — Driving Data Quality with Data Contracts (Packt 2023)**. Contains: agreed interface between data generators and consumers with expectations, governance terms, quality. Elements: purpose, dataset definition, schema, quality rules, SLA, ownership, versioning, consumer list. Four principles: data-as-product, federated computational governance, domain ownership, explicit/intentional generation. Owner/author: producer/generating team owns; data platform team enables. Lifecycle: design-time (negotiated interface), then publish-time enforced. Patterns: write-directly-to-interface, materialized views on CDC, transactional outbox, listen-to-yourself. Enforcement: code-generated producer/consumer stubs, CI schema-evolution checks, runtime validation at publish boundary. Schema relation: embedded (Protobuf/Avro/JSON Schema), contract is superset (adds semantics/SLA/ownership). Sources: O'Reilly book page, Select Star interview.

**Bitol / Open Data Contract Standard (ODCS) v3.1**. Contains: 11 sections — Fundamentals (id/version/status/domain), Schema (logical+physical types/columns/constraints), Data Quality (rules/dimensions/thresholds), SLA (availability/freshness/retention/latency), Team, Roles (with access tiers), Support & Communication, Pricing, Servers (physical deployment), References, Custom Properties. Owner/author: producer-authored, federated roles defined inside contract; Bitol is Linux Foundation AIDA-incubated. Lifecycle: design-time YAML spec. Enforcement: standard doesn't enforce; portable spec validated by JSON Schema; tools (data-contract-cli, Soda, GX, registries) generate runtime checks. Schema relation: first-class embedded but format-agnostic (Avro/Parquet/SQL DDL); JSON Schema is companion not definition. Sources: bitol-io.github.io ODCS v3.1, GitHub repo.

**dbt model contracts (dbt-core)**. Contains: per-model column names+types + column-level constraints (not_null, unique, primary_key, foreign_key, check). Narrowest — purely structural shape, no SLA/ownership/semantics. Owner/author: model author (analytics engineer) in dbt project YAML. Lifecycle: build-time (applied during `dbt run`/`dbt build`). Enforcement: preflight parse compares SELECT's projected columns/types to declared contract, build fails on mismatch; not_null/check become DDL on supporting warehouses (Postgres, Snowflake partial, BigQuery partial); other constraints declarative-only. Schema relation: contract IS the schema (typed columns + constraints); only works on table/incremental materializations. Sources: dbt docs.

**Data Mesh / Zhamak Dehghani — data product output port**. Contains: contract = output-port spec; per 8 data-product traits must encode discoverability, addressability, self-describing semantics+syntax, trustworthiness (SLOs), interoperability (global standards), security/access. Schema is one slice; semantics/lineage/SLOs/access policy are equal. Owner/author: domain team (decentralized); federated computational governance defines cross-domain rules. Lifecycle: full data-product lifecycle (design+build+runtime, always-on). Enforcement: computational — global policies enforced by platform sidecar/control plane. Schema relation: schema referenced from inside output-port contract; format per-port (SQL/file/event stream all valid). Sources: Data Mesh book, ML-Architects intro.

**PayPal data contract template (open-sourced 2023, Apache-2.0)**. Contains: UUID, dataset name, version, domain tag, dataset mode (Analytical vs Operational), schema (table+column with types+PII tags), data quality rules linked to columns, SLA (DP-QoS: freshness/completeness/latency), ownership (productDl email, productSlackChannel, feedbackUrl), physical access credentials. Heavily influenced ODCS (Jean-Georges Perrin contributed both). Owner/author: data product team; productDl = authoritative owner field. Lifecycle: design-time YAML in source control. Enforcement: template is spec only; PayPal pairs with internal tooling. Schema relation: embedded with custom logical-type vocabulary. Sources: GitHub paypal/data-contract-template, Mark Craddock writeup.

Comparison table (source / contains / owner / lifecycle / enforcement / schema relation):
- Jones: purpose+schema+quality+SLA+ownership+versioning+consumers / producing team (left-shifted) / design+publish-time / codegen+CI+runtime publish-boundary / embedded, contract is superset.
- ODCS: 11 sections / producer + federated roles in-contract / design-time YAML / none native, delegated to tools / embedded but format-agnostic.
- dbt: column names+types+constraints / analytics engineer / build-time / preflight parse fails build, some constraints → DDL / contract = schema, no separate doc.
- Mesh: schema+semantics+SLO+access+discoverability / domain team / design+build+runtime always-on / computational platform-enforced sidecar / schema referenced, one field among many.
- PayPal: UUID+mode+schema+PII+quality+SLA+ownership DL/Slack+access creds / data product team (productDl) / design-time YAML / template only, needs external tooling / embedded with custom logical types.

Convergent ideas (load-bearing core): (1) producer owns the contract; (2) schema necessary but insufficient; (3) ownership is structural not optional; (4) SLAs/quality are part of the contract not a side document; (5) design-time artifact with runtime consequences; (6) versioning is explicit and the contract carries it; (7) machine-readable single source of truth (YAML or YAML-equivalent in source control).

Divergent choices: (1) enforcement locus — dbt build-time only / Jones runtime publish boundary / Mesh always-on computational / ODCS/PayPal punt to ecosystem. (2) Scope — dbt narrowly structural / Mesh broadly everything to consume a data product / ODCS middle. Deepest disagreement. (3) Schema embedded vs referenced — dbt/PayPal embed custom; ODCS embeds format-neutral; Jones leans toward referencing canonical Protobuf/Avro/JSON Schema. (4) Federation vs central — Mesh/Jones federate explicitly; ODCS/PayPal silent on org model. (5) Whether constraints are runtime-enforced or only declared — dbt admits some are "definable but not enforced"; Jones/Mesh expect all to be operationally enforced.

---

## Agent 4 — L1-A4 (Literature: schema vs contract distinction)

Per-format summaries.

**JSON Schema (Draft 2020-12)**: encodes structural shape (types, required, ranges, regex, enums, conditional if/then/else, $ref composition). Validates single document at point in time. Does NOT encode ownership, SLA, version-evolution rules, semantic meaning, producer identity, change policy, runtime delivery guarantees. Typical use: payload validation at HTTP/queue boundaries, config validation, sub-component referenced by OpenAPI/AsyncAPI/ODCS.

**Avro**: binary serialization with shape (records, unions, logical types) plus formal **evolution rules** baked into spec (defaults enable backward compat, aliases enable rename, reader/writer schema resolution deterministic). Spec itself defines "compatible" — uniquely strong among listed formats. Does not encode ownership, SLA, semantic glossary, business rules beyond field-level defaults/aliases. Typical use: Kafka payloads with Schema Registry, analytical pipelines upstream of Parquet/Iceberg.

**Protobuf**: wire format + IDL. Shape via messages/fields with **tag numbers** as load-bearing evolution primitive (never reuse, reserved keyword). Evolution discipline is convention not spec-enforced — Confluent Schema Registry recommends BACKWARD_TRANSITIVE because new message types aren't forward-compat. Encodes nothing about ownership/SLA/semantics. Typical use: gRPC, internal RPC, polyglot microservices.

**OpenAPI (3.1)**: REST surface — endpoints, methods, parameters, request/response **schemas** (JSON Schema 2020-12 superset since 3.1), auth schemes, examples, server URLs, error responses. Beyond shape: encodes **interaction protocol** (verbs, status codes, auth). Does not encode SLA, ownership, change policy, semantic field definitions beyond `description` strings, rate-limit guarantees.

**AsyncAPI (3.0)**: event-driven analog — channels, operations (send/receive), messages, bindings (Kafka/AMQP/MQTT/WebSocket protocol config), pluggable **schemaFormat** (JSON Schema/Avro/Protobuf/OpenAPI Schema). 3.0 separated schema from message so same schema reusable across formats. Encodes transport binding (real contract concern). Does not encode ownership/SLA/retention/semantics beyond descriptions.

**Schema Registry (Confluent / Apicurio)**: runtime governance layer. Stores schemas per **subject** (typically `<topic>-value`/`<topic>-key`), enforces compatibility mode (BACKWARD/FORWARD/FULL/*_TRANSITIVE) at registration, blocks producers from publishing incompatible schemas. Closest to runtime-enforced contract — but shape compatibility only, not ownership/SLA/semantics.

**Schema vs contract — where the line falls**: A schema specifies *syntactic structure* of a payload (what fields, what types, what constraints) enforceable by a parser. A contract is a *governance object* wrapping a schema with social/operational obligations: who owns, who to call when broken, how often it lands, when it can change, what fields *mean*, what counts as breaking change. Schema answers "is this byte-string valid?"; contract answers "can I build a business on this?"

Three concrete examples:
1. Payment amount. Schema: `amount: integer, minimum: 0`. Contract adds: *unit is cents (not dollars/BRL), owned by billing-platform team (#billing-oncall), SLA 99.9% land in topic within 5s of authorization, breaking change requires 30-day deprecation + dual-write window*.
2. User event topic. Schema (Avro): `UserSignedIn { user_id: string, ts: long }` with BACKWARD compat enforced by registry. Contract adds: *user_id is canonical Auth0 sub NOT internal DB id, PII pseudonymous, retention 90 days, deletion-on-request 30 days, downstream consumers: analytics-pipeline, crm-sync*.
3. REST GET /invoices. OpenAPI defines response schema, 200/404, pagination params. Contract adds: *p99 latency ≤ 300ms, rate limit 100 rps/tenant, invoices eventually consistent up to 2s behind write path, deprecation: minor versions backward-compat for 12 months*.

In all three: schema necessary but not sufficient. Downstream team with only the schema cannot safely depend on the data.

**DomainSpec mapping**: SPEC concept tables (concept name, definition, type, source) + aspect/observability/infra together cover meaningful slice — but unevenly, descriptive (markdown prose) rather than machine-enforceable (YAML/JSON validated by registry). Concept table closer to *semantic dictionary* than *contract*: nails "what does this field mean" axis (which JSON Schema/Avro/Protobuf all miss) but leaves ownership/SLA/compat-policy/consumer-registry implicit or scattered.

Coverage table (contract element / captured today / gap → would need new artifact):
- Field shape/type: concept table `type` column / loose, not parser-validatable.
- Field semantics/definition: concept table `definition` (strong) / —.
- Source of truth: concept table `source` / partial, no producer-id formalism.
- Ownership/oncall: implicit (project decisions, infra) / yes — explicit team, contact slots.
- SLA (freshness/availability/latency): observability/OTel specs / partial, SLOs not bound to concept rows.
- Quality rules (not-null/ranges/uniqueness): aspects, rules.md / yes — needs machine-checkable form.
- Versioning + compatibility policy: none / yes — explicit compat mode per concept group.
- Change-notification/deprecation window: none / yes.
- Consumer registry: none / yes (who depends on this).
- Privacy/PII classification: none systematic / yes.
- Transport binding (topic/endpoint/table): infra spec (separate file) / cross-link not unified.

DomainSpec today sits at "JSON-Schema-plus-semantics" point — stronger than Avro/Protobuf on meaning, weaker than ODCS on operational governance.

Composition recommendation (bullets):
- **Reference, don't embed.** DomainSpec data-contract should `$ref` schemas (Avro/JSON Schema/Protobuf files in repo or registry subject) rather than redefine shapes. Embedding duplicates source of truth.
- **Schema lives next to producer; contract lives in DomainSpec.** Schema files belong with code that emits them; contract belongs in `docs/features/<f>/` because it expresses project's commitment.
- **Bind one contract to one subject/endpoint/table.** Contract's identity is wire location, not logical concept. Mirrors Schema Registry's subject-per-topic; avoids "what does this contract apply to?" ambiguity.
- **Compatibility mode is a first-class contract field.** Borrow Confluent's vocabulary (BACKWARD/FORWARD/FULL/*_TRANSITIVE) as enum on contract; CI enforces against referenced schema's history.
- **Concept table becomes the semantic layer the schema can't carry.** Keep concept table as canonical glossary; contract `$ref`s both schema (shape) and concept rows (meaning) so two stay linked. The DomainSpec-native move that ODCS/Avro/OpenAPI can't make on their own.

Sources cited: ODCS v3.1.0 announcement (Bitol), Open Data Contract Standard repo, datadef.io Data Contracts Guide, Confluent Schema Registry — Schema Evolution & Compatibility Types, Confluent Stream Governance — AsyncAPI integration, AsyncAPI Payload schema multi-format support, AsyncAPI 3.0.0 Release Notes, Monte Carlo Data Contracts explained, Atlan Data Contracts 2026, IBM Avro Data Schemas and Schema Registry.

---

## Agent 5 — L2-E1 (Evaluator: constructive comparison of three alternatives)

Comparison table (dimension / (a) derived view / (b) governed first-class artifact / (c) better tags):
- Single-source-of-truth integrity: strong (no new source) / weak (parallel surface kept in sync) / strong (semantics live where authored).
- Drift risk: low for captured fields, cannot invent missing governance / highest (hand-authored drifts from operations.md/events.md unless rigidly cross-linked) / low-medium (drift constrained to single edit site, cross-surface invariants still need checker).
- Authoring burden: near-zero (one-time generator + small frontmatter) / high (new file per concept group + governance review) / medium (template migration but no new files).
- Machine-checkability: high (generator IS the check) / medium (separate linter for contract↔SPEC alignment) / high (tags are structured fields, validatable by existing frontmatter tooling).
- Fit with L₁/L₂ layer laws: clean (view crosses without owning) / risky (new artifact must declare which layer; governance fields are infra/L₂ but bind L₁) / clean (extends per-layer surfaces).
- Evolution cost: low (change generator, all contracts re-emit) / high (every group needs hand-edit on schema change) / medium (template change cascades, mechanical).
- Owner: no new (producer owns inputs, generator owns output) / ambiguous (data steward? feature owner? new role?) / existing (concept-table owner, aspect owner).

Per-alternative analysis:

(a) **Derived view — `data-contract.md` generator** — tool in `internal_tools/` reads SPEC frontmatter, domain.md, events.md, operations.md, interfaces.md, slos.md, OBSERVABILITY.md and emits per-event/per-endpoint/per-table contract. Closes Seam 1 (event payload — fail when type renamed not propagated) and Seam 8 (L₁→L₂ — emit error when concept row has 0 implementations). Leaves on table: everything L1-A1 marked MISSING (per-field ownership, versioning, breaking-change policy, deprecation, retention, consumer-specific SLAs). Generator cannot manufacture governance metadata nobody authored — only surfaces what exists. Honest limit: derived view exposes drift but does not encode policy.

(b) **Governed first-class artifact — `data-contract.md` per concept group** — alongside SPEC.md/domain.md, new file (or YAML), hand-authored, with sections for owner, version, compatibility mode (per L1-A4), deprecation window, consumer registry with per-consumer SLA, retention, PII tags. Closes governance gap completely — this is what L1-A3 sources (ODCS, PayPal) look like. But violates "no third place to drift": consumer registry now lives in BOTH events.md ("Consumed by") AND contract file; operation pre/postconditions live in BOTH operations.md (R1–R5) AND contract's "guarantees" section. Without strict generator-or-linter making one a derived projection of the other, creates exactly the drift L1-A2 warns about — just at a new seam. Also forces layer-law decision project hasn't made: is data contract L₁ (semantic) or L₂ (operational/infra)?

(c) **Better tags on existing surfaces** — extend concept table with columns owner/version/compat_mode/deprecated_at; extend event payload tables with pii/cardinality_limit; extend operations.md R-rules with consumer_sla; extend aspect frontmatter with retention/oncall. Closes Seam 2 (OTel cardinality — now a tag), Seam 5 (cross-feature event triggers — consumer SLA becomes row attribute), partially Seam 4 (interfaces — schema_ref column pointing to producer-owned JSON Schema, per L1-A4's "reference don't embed"). Leaves on table: unified view — consumer asking "what is contract for event X?" must still assemble mentally from 4 files. Also: column proliferation has ceiling; eventually concept table unreadable.

Recommendation: **(c) + (a) hybrid — tag-first, generate the view**. Primary (c) extends existing surfaces with governance tags. Secondary (a) ships generator that compiles tags into per-contract derived view for consumers. Reasoning: (1) single source of truth — every fact at authoring site; generator produces read-only projection; by construction cannot drift. (2) Machine-checkable — every new tag is frontmatter/table-cell, validatable by existing tooling; generator doubles as checker. (3) Layer laws — (c) respects L₁/L₂ separation: semantic tags extend L₁ surfaces, operational tags extend L₂. A first-class artifact (b) would collapse them and force layer-law violation. (4) LLM-agnostic / no invented vocabulary — tags are additive schema change; no new artifact type, role, lifecycle.

Seams closed: Seam 1 (schema_ref tag binds payload to producer schema), Seam 2 (cardinality_limit tag), Seam 5 (consumer_sla tag), Seam 8 (generator fails when concept row has 0 implementations). Seams 3, 4, 6, 7 partially closed by mapping tags and schema_ref columns.

Migration: (1) extend templates with new optional columns/keys; (2) CI warns (not errors) on missing tags for 1 release cycle; (3) ship generator in `internal_tools/` emitting `docs/contracts/<feature>/<event-or-endpoint>.md`; (4) promote warnings to errors per-tag as adoption stabilizes.

Trade-off accepted: contract consumers (downstream teams, auditors) must accept canonical contract is *generated*, not hand-authored — only as rich as tags producers fill in. Correct trade-off for DomainSpec: optimize for producer-side correctness and machine-checkability over consumer-side hand-craftedness. If future consumer need (regulator-facing data sheet) demands hand-authored narrative, that becomes *separate* artifact downstream of generated contract, not replacement.

Rejected (b) — reintroduces drift L1-A2 catalogues under new filename. Rejected pure (a) — without (c)'s tag additions, generator has nothing new to surface; only re-renders what's already readable.

---

## Agent 6 — L2-E2 (Evaluator: adversarial steelman "do not formalize")

Adversarial verdict structured across 7 angles.

**1. Redundancy** — L1-A1's gap list misdiagnosed. Each item maps to existing DomainSpec surface; gap is *under-population*, not *missing artifact*. Table (gap / natural home / why new artifact overkill): Schema versioning → SPEC frontmatter `version` + concept table `version` column (versioning already first-class primitive). Per-field ownership → concept table `owner` column extended row-level (ownership granularity is column not artifact). Breaking-change policy → `rules.md` (just added in commit 4b29317, exists precisely for cross-cutting policy). Retention → `infra.md` / observability spec (operational concern lives where ops live). Deprecation → frontmatter `status: deprecated` + Connections `replaces`/`replaced_by` (already in graph schema). Consumer SLA → slos.md keyed by consumer (SLOs file exists, add consumer dimension). Claim: L1-A1 read "DomainSpec doesn't have X in one place" and concluded "needs new artifact." Non-sequitur. Honest framing: "six existing artifacts each need one column or section." Schema patch, not new node type.

**2. Drift hazard — third-place-to-drift**. DomainSpec's load-bearing claim is single source of truth. Data-contract necessarily restates field names+types (in concept tables), event payloads (in events.md), request/response shape (in interfaces.md), SLOs (in slos.md). N+1 places must agree. Original implicit drift (events.md says `user_id: uuid`, consumer reads `userId: string`) is *detectable* — only two sites. Add contract artifact → three sites, contract is what humans edit while producer/consumer code diverges silently. **Replaced detectable two-site drift with undetectable three-site drift and called it governance.** Only way out is automated derivation (contract = view-over-existing). But then artifact has zero authoring surface and is just a query — Option A from R23 — doesn't justify new node type; justifies `compose.py` view in `internal_tools/graph_retrieval/`.

**3. Scope creep — slippery slope short and steep**. Once data-contract.md exists, pressure to absorb adjacent concerns is mechanical: v0 "lightweight — fields+version+owner"; v1 "we need wire format" → absorbs interfaces.md payload; v2 "failure semantics" → absorbs slos.md error budgets; v3 "lineage" → absorbs concept tables; v4 "PII tagging" → absorbs aspects/governance; v5 contract is 60% of SPEC with 0% of SPEC's discipline. Not hypothetical — every "data contract" framework in L1-A3 exhibits this (ODCS alone has ~200 fields). DomainSpec's stated value is small surfaces composed by edges. Data-contract violates small-surface invariant within 2 versions.

**4. Authoring burden vs payoff for HIGH-risk seams**. Seams 1 & 5 (events): cheapest fix is CI lint that (a) validates events.md payload tables against co-located JSON Schema file, (b) walks `Produces For` edges to confirm every named consumer exists. Cost: one validator in `internal_tools/`. Contract artifact requires same validator PLUS new authoring surface PLUS edges PLUS node type. Seam 8 (L₁→L₂): cheapest fix is enforcing mapping table in SPEC itself (already where L₁→L₂ belongs). Contract artifact relocates mapping out of SPEC and creates *new* mapping problem (SPEC → contract). Pattern: every HIGH seam has lint-or-column fix costing <1 day. Contract artifact costs (schema design + template + dispatcher rules + graph edges + retrieval integration + docs + migration). ROI negative for seams it claims to fix.

**5. Governance burden — incoherent for meta-framework**. Contract requires promisor and promisee — both identifiable, contactable, answerable. DomainSpec is meta-framework imported as submodule into consumer repos (per MEMORY `project_domainspec_is_meta_framework`). At meta-framework level: no deployed producer, no consumer with SLA, no breaking-change blast radius (all template content). Contract artifact in DomainSpec-core is contract with no counterparties — ceremony. Contracts only coherent in *consumer repos* (house_project, football-stats-oracle, etc.), and those repos can adopt independently *without* DomainSpec sanctioning meta-level node type. **Promoting data-contract to DomainSpec-core artifact pushes governance theater upstream into framework where it has no referent.**

**6. Concrete scenarios where formalization is net negative**: (1) Small feature, single consumer (≤2 features deep) — contract overhead (~30 min/feature authoring + review) exceeds breaking change cost (one rename PR); net negative on any feature with <5 consumers. (2) Early-stage discovery work — DomainSpec emphasizes discovery-first (CLAUDE.md route 3); contracts presume stable consumers, premature in discovery phase, ossify shapes that should still be churning. (3) Solo-maintainer repos (actual current state of all four consumer repos) — contract = promise between people; no second person, no contract, just paperwork against yourself. (4) Internal-only events (no cross-team boundary) — contract pattern justified at team/system boundaries; intra-feature events have no governance asymmetry. (5) Schema-evolution-heavy domains (e.g., vault itself — see NodeType expansion commit 52b984c) — contracts make breaking changes expensive by design; in domains where schema is artifact under active iteration, cost lands wrong side.

**7. Failure mode summary** (failure mode / severity / trigger):
- Three-site drift (contract vs SPEC vs code) / HIGH / contract is hand-authored, not derived.
- Scope creep into second-SPEC / HIGH / contract gains >1 new section per quarter.
- Governance ceremony with no counterparty / HIGH / adopted at DomainSpec-core level rather than consumer-repo.
- Authoring tax > drift cost / MED-HIGH / average feature has <5 consumers.
- Discovery ossification / MEDIUM / contract written before consumers stabilize.
- Lint-equivalent value at higher cost / MEDIUM / same seams closable by CI validator on existing files.
- Edge explosion in KG / MEDIUM / each contract adds N×M edges (fields × consumers), retrieval cost grows.
- False sense of safety / LOW-MED / teams stop reviewing schemas because "contract covers it."

Verdict (anti-case): **L1-A1's "missing" list is a column-and-section patch, not artifact request; L1-A4's "weak on governance" finding describes meta-framework correctly, not a defect; every HIGH-risk seam in L1-A2 has cheaper lint-or-schema-column fix.** Introducing data-contract as first-class artifact buys governance theater, pays for it in drift surface and authoring tax, lands burden at meta-framework level where it has no counterparty. If anything justified: **Option A only (derived view in `graph_retrieval/compose.py`)** — and even that should be gated on consumer repo (not DomainSpec-core) demonstrating actual breaking-change pain that existing artifacts demonstrably failed to prevent.
