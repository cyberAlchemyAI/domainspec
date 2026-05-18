---
tags: [vault, architecture, data-contract, ontology, governance]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: exploratory
version: 0.1.0
last_updated: 2026-05-18
---

# Data Contract as Formal Artifact

> DomainSpec-core should ship schema patches (tag columns on existing surfaces) plus CI validator lints and an OPTIONAL `contract_view` generator — but it should NOT introduce a first-class `DATA-CONTRACT` artifact node type. A "contract" presupposes a producer and a consumer; DomainSpec-core has neither. The contract becomes coherent only at the consumer-repo level, where the generated view bound to a wire location (subject / endpoint / table) IS the contract.

---

## Claim

The data-contract concept is real and load-bearing for downstream repos, but it does not earn its keep as a new artifact node type inside DomainSpec-core. The producer-owned, consumer-promised semantics that define a contract (per the literature's seven convergent ideas, F3) require counterparties that DomainSpec-core, as a meta-framework, does not have (T2). What DomainSpec-core CAN do — and should do — is (a) extend existing surfaces with the governance metadata they are currently missing, (b) ship CI lints that close the HIGH-risk drift seams those existing surfaces leave open, and (c) optionally ship a `contract_view` generator that produces read-only derived views in consumer repos. The generated view, bound to one wire location, is the contract.

## Status

`exploratory`. The position emerged from a single triangulation dispatch (`2026-05-18-data-contract-formal-artifact-01`, spec_hash `1ac5bc0c…632ea`) with 4 L1 investigators (repo audit explicit / repo audit implicit / literature movement / literature schema-vs-contract) and 2 L2 evaluators (constructive / adversarial). The two evaluators converged sharper than they diverged (T1) and both rejected the hand-authored alternative outright (F6, F7). The position has not been stress-tested by an actual consumer-repo adoption attempt. Promotion to `active` should wait for (a) at least one consumer repo (house_project or football-stats-oracle) actually adopting the tag schema and generating a `contract_view`, or (b) explicit refutation surfaced by a counter-dispatch.

## Context

A user question — *"should data-contract become a formal DomainSpec artifact?"* — surfaced an inventory gap: DomainSpec already encodes substantial data-contract-like material across at least six surfaces (SPEC concept tables, aspect specs, event payload schemas, OTel attribute specs, slos.md, infra.md), but it does so without explicit governance metadata (versioning, breaking-change policy, per-field ownership, per-consumer SLA, retention) and without a single surface that aggregates the producer's contractual position. The temptation was to coin a new `DATA-CONTRACT.md` artifact and start migrating material into it. The dispatch tested that temptation against four independent investigations and two evaluator stances.

The investigation's structure mattered: the constructive evaluator (L2-E1) and the adversarial evaluator (L2-E2) ran with sharp prior disagreement (formalize vs. do-not-formalize), and they both arrived at a hybrid position narrower than either started with. The disagreement that survives is operational (does the `contract_view` generator live in DomainSpec-core or only in consumer repos?), not architectural (is a new node type justified at DomainSpec-core level?). On the architectural question both evaluators said no.

---

## Decisions taken

### D-1 — No `DATA-CONTRACT` node type at DomainSpec-core

**Decision.** DomainSpec-core ships zero new artifact node types for data contracts. The 16-value `node_type` enum stays as-is. No `## Connections` edges are coined for "contract" relationships at the DomainSpec-core level.

**Rationale.** A contract presupposes counterparties (promisor + promisee). DomainSpec-core is a meta-framework imported as a submodule into consumer repos; it ships templates and tooling but operates no producer and binds no consumer (T2). Coining a `DATA-CONTRACT` node type at this level would create an artifact with no party able to make or receive the promise it encodes. The adversarial evaluator's strongest argument is here: *the gap is governance metadata on existing surfaces, not a missing artifact* (F7). The constructive evaluator agreed under analysis (T1).

**Status.** `active` within this discovery. Will be re-tested if a consumer repo finds the tag-plus-generator approach insufficient.

### D-2 — Tag-first on existing surfaces (schema patches as the load-bearing change)

**Decision.** DomainSpec-core extends existing surfaces with governance-tag columns rather than spawning a new file type:

- Concept table → `owner`, `version`, `compat_mode`, `deprecated_at`, `schema_ref`
- Event payload tables → `pii`, `cardinality_limit`, `schema_ref`
- OTel attribute spec → `cardinality_limit`, `enum_ref`
- `slos.md` → `consumer` dimension

**Rationale.** The genuine gaps from F1 (versioning, breaking-change policy, per-field ownership, per-consumer SLA, retention) all map onto fields, not onto documents. The "reference, don't embed" composition rule from F5 means each schema lives next to its producer; the governance wrapper is the set of tag columns layered on top, with `schema_ref` doing the binding to the producer-owned schema artifact. This preserves a single source of truth and avoids the three-site drift that a hand-authored governance artifact would reintroduce (T1 / F6).

**Status.** `active` within this discovery, pending OQ-1 and OQ-2 below.

### D-3 — CI lints close the HIGH-risk drift seams

**Decision.** Ship lints (in `internal_tools/`) that enforce:
- Every `Produces For` consumer must resolve to an existing operation.
- Every event payload field has `schema_ref` or is flagged untyped.
- Every concept row with zero L₂ implementations fails extraction.

**Rationale.** The HIGH-risk seams identified by L1-A2 — Seam 1 (event payload schema drift), Seam 5 (cross-feature event triggering), Seam 8 (L₁ concept-table → L₂ code mapping) — are mechanically detectable from the existing surfaces. They do not require a new artifact to surface; they require a checker run in CI (F2, F7). The adversarial evaluator's claim that *cheaper to lint than to formalize* (F7) is accepted.

**Status.** `active`. Implementation lives in `internal_tools/`; specifics deferred to an implementation-plan.

### D-4 — Optional `contract_view` generator, location undecided

**Decision.** Ship a generator (canonical name: `contract_view`) that emits `docs/contracts/<feature>/<wire-location>.md` as a read-only derived view. The generated view is the contract. Consumer repos opt in.

**Rationale.** The view-as-contract pattern resolves the layer split: DomainSpec-core remains contract-artifact-free (D-1), while consumer repos get a concrete document bound to one wire location that producers and consumers can both point at. The generator doubles as a checker (it can refuse to emit if tag fill rates are below a threshold), which is the constructive evaluator's strongest argument (F6). Whether the generator binary itself lives in DomainSpec-core or only in consumer repos is unresolved — see OQ-4.

**Status.** `active` in principle, `exploratory` on location. The 4-stage migration sketched by L2-E1 (extend templates optional → warnings 1 cycle → ship generator → promote warnings to errors per-tag) is accepted as the rollout shape.

---

## Alternatives considered

### A-1 — First-class hand-authored `DATA-CONTRACT.md` artifact

**Shape.** Coin a new `node_type: data-contract`, ship a template, require producers to author and maintain a `DATA-CONTRACT.md` per feature alongside SPEC / RULES / TEST-SPEC.

**Why rejected.** Both evaluators rejected this outright (T1). Reintroduces three-site drift between the contract, the producer's schema, and the consumer's expectation; the file would either restate material already in concept tables / event payload specs (redundant, violates orthogonality) or invent new material with no automated tie-back to the implementation surfaces it governs (drift-prone). The producer-owns axiom from the literature (F3) cannot be satisfied by a hand-authored doc in a meta-framework that has no producer (T2).

### A-2 — Pure generator without tag patches

**Shape.** Ship only the `contract_view` generator that synthesizes a contract view from the existing un-tagged surfaces.

**Why rejected.** The generator would have nothing new to surface beyond what is already readable from concept tables and event payload specs (F6). The genuine gaps from F1 (governance metadata) are not in the structure of the existing files — they are in the columns those files don't have. A generator with no tag input would produce a contract view that exactly recapitulates the existing surfaces, which fails the orthogonality test (it adds no information that isn't already present).

### A-3 — Pure tag patches without generator

**Shape.** Extend existing surfaces with governance tags (D-2) and ship CI lints (D-3), but do not ship the generator (D-4).

**Why rejected — but only weakly.** This is exactly the adversarial evaluator's preferred end-state and survives all of L2-E2's objections (F7). The reason it isn't chosen is that without the generator, the producer's contractual position remains scattered across six surfaces — there is no single artifact that a consumer can point at and say *"this is what I'm holding the producer to."* The constructive evaluator's argument for the generator (F6) is that the synthesizing view is itself a useful artifact even though it is derived. This is the surviving disagreement; see OQ-4.

---

## Open questions

Carried forward from the dispatch's Analysis section.

### OQ-1 — Tag granularity for `compat_mode`

Is `compat_mode` declared at concept-row granularity (one row, one mode) or feature granularity (one mode covers the whole concept table)? Roots in F1's per-field-ownership gap. Concept-row granularity is more expressive but harder to author; feature granularity is cheaper but may force a feature to declare its loosest mode globally.

### OQ-2 — `schema_ref` resolution target

Does `schema_ref` resolve to a co-located file (e.g., `./schemas/foo.avsc` relative to the SPEC) or to a registry subject (e.g., a Confluent Schema Registry subject string)? Roots in F5's bind-to-wire-location rule. Co-located is simpler for repos without infra; registry is more aligned with the data-contracts movement literature (F3).

### OQ-3 — Consumer SLA placement

Does the per-consumer SLA live on the `Produces For` edge rows (one SLA per producer-consumer pair stated where the edge is declared) or on `slos.md` keyed by `(producer, consumer)` (one SLA per pair stated centrally)? Roots in F1's per-consumer-SLA gap. Edge-row placement keeps the SLA next to the relationship it describes; centralized placement gives a single read for SLA audit.

### OQ-4 — `contract_view` generator location (the surviving evaluator disagreement)

Does the generator binary live in DomainSpec-core (so every consumer repo inherits it by submodule update) or only in consumer repos (so each repo opts in by copying or implementing the generator locally)? L2-E2 leans consumer-only — keeps DomainSpec-core's surface minimal, consistent with D-1. L2-E1 leans core — single implementation, single bug surface, single upgrade path. This is the only surviving architectural disagreement from the dispatch.

### OQ-5 — Interaction with the existing extraction pipeline

The contract view is, structurally, an L₂ projection of L₁ material (concept tables, aspect specs) plus L₁-tagged governance. Does it integrate into `_categorical/extraction.log.md` as another L₂ projection, or sit as a separate layer downstream of extraction? Roots in F2's Seam 8 (L₁ → L₂ mapping). The former keeps one extraction pipeline; the latter keeps the contract view's mapping rules independent of the categorical extraction's mapping rules.

---

## Implementation sketch

Carried verbatim from L2-E1's recommended rollout (F6) and the cross-cutting synthesis. This is sketch-level; the binding implementation-plan is downstream.

**Schema patches.** Extend the templates listed under D-2. Each column starts optional, defaults to blank, and is documented in the template's HTML-commented example block (consistent with the template-calibration-discipline discovery's `required minimum + demonstrated optional` rule).

**CI lints.** Implement the three lints listed under D-3 in `internal_tools/`. Run in CI on every PR touching a SPEC. Start with warnings; promote to errors per-tag per the migration schedule below.

**Generator.** `internal_tools/contract_view/` (location subject to OQ-4) consumes tagged concept tables + event payload specs + slos.md + OTel attribute specs for a feature and emits `docs/contracts/<feature>/<wire-location>.md` as a read-only derived view. The view is regenerated on every CI run; manual edits to the generated file fail CI.

**4-stage migration.**

1. Extend templates with the new tag columns; mark all new columns optional.
2. Ship CI lints as warnings only (one cycle).
3. Ship the generator; consumer repos opt in.
4. Promote warnings to errors per-tag as fill rates allow.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../../docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-findings.md](../../../docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-findings.md) | `derives-from` | The triangulation-dispatch findings file this discovery synthesizes. All load-bearing claims (D-1 through D-4, A-1 through A-3, OQ-1 through OQ-5) trace to numbered F-, T-, or OQ-items in that file. |
| [../../../docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-research.md](../../../docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-research.md) | `cites` | Raw per-agent research feeding the findings; cited transitively for evidence. |
| `vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml` | `derives-from` | Frozen dispatch spec (spec_hash `1ac5bc0c3ae56829c773d730bf2ad450d90eb435bbdbc69d93bc63eb54e632ea`) under which the six agents ran. |
| [../../constitution/domainspec-subagents-strategy-constitution.md](../../constitution/domainspec-subagents-strategy-constitution.md) | `governed-by` | The dispatch lifecycle that produced this discovery is governed by the subagents-strategy constitution (R15, R16, R17, R18, R21, R22, R23). |
| [../template-calibration-discipline/README.md](../template-calibration-discipline/README.md) | `cites` | The `required minimum + demonstrated optional` rule from template-calibration-discipline directly informs D-2's optional-tag-column posture. |

---

## Source dispatch

- **Dispatch slug:** `2026-05-18-data-contract-formal-artifact-01`
- **Spec file:** `vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml`
- **Spec hash:** `1ac5bc0c3ae56829c773d730bf2ad450d90eb435bbdbc69d93bc63eb54e632ea`
- **Findings file:** `docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-findings.md`
- **Research file:** `docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-research.md`
- **Mode:** triangulation (4 L1 + 2 L2 + parent synth)
- **Telemetry:** `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` @ 2026-05-18T00:00:00Z; event `subagent-strategy.dispatched`; corpus_hash `7e4b339b65ca7dfa6055b893c40189c2dcad7b92c46120842285f5798c471438`
