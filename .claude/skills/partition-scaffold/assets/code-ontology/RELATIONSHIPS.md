---
tags: [code-ontology, relationships, edges]
node_type: conceptual
is_session: false
layer: ontology
nature: reference
status: active
veracidade: high
convicção: high
version: 1.0.0
last_updated: 2026-06-09
---

# Code Ontology — Typed Relationships

> **Generated view of [`code-ontology.json`](code-ontology.json). Edit the JSON, not this file.**
> 29 edges in 4 disjoint families (P5). Each edge has a signature `source → target`; an edge
> instance is valid iff the endpoints' meta-types are in the signature sets (P1, type safety,
> enforced by `validate_ontology.py`). Tokens below are canonical (see [`TAXONOMY.md`](TAXONOMY.md)).

## R_B — backend (12) · backend → backend, within a feature

| edge | source | target | card. | semantics |
|------|--------|--------|-------|-----------|
| `performs` | Entity | Operation | 1:1 | An entity initiates / is the actor of an operation. |
| `produces` | Operation | Event | 1:1 | An operation emits an event upon completion. |
| `enforces` | Rule | Operation | 1:1 | A rule constrains when an operation can execute. |
| `calculates` | Calculation | Operation | 1:1 | A calculation derives values used by an operation. |
| `transitions` | Event | StateMachine | 1:1 | An event triggers a state transition. |
| `exposes` | Interface | Operation ∨ Query | 1:1 | An interface makes an operation or query accessible. |
| `orchestrates` | Workflow | Operation | 1:N | A workflow coordinates multiple operations. |
| `applies` | Policy | Operation | 1:1 | A policy governs how an operation behaves. |
| `maps` | Mapping | Entity ∨ Interface | 1:1 | A mapping transforms data between shapes. |
| `contains` | Entity | ValueObject | 1:1 | An entity embeds a value object as a field. |
| `queries` | Query | Entity | 1:1 | A query reads data from an entity. |
| `emits` | Entity | Event | 1:1 | An entity is the source of a domain event. |

## R_CF — cross-feature (3) · backend@A → backend@B

| edge | source | target | card. | semantics |
|------|--------|--------|-------|-----------|
| `produces-for` | Operation | Entity | 1:1 | An operation in A mutates/projects data into an entity owned by B. |
| `triggers-cross` | Event | Operation | 1:1 | An event in A triggers an operation owned by B. |
| `enforces-cross` | Rule | Operation | 1:1 | A rule in A constrains whether B can execute an operation. |

## R_U — intra-UI (8) · UI → UI

| edge | source | target | card. | semantics |
|------|--------|--------|-------|-----------|
| `renders` | Page | Component | 1:N | A page renders components as interactive islands. |
| `wraps` | Layout | Page | 1:N | A layout wraps pages, providing the visual shell. |
| `composes` | Component | Component | 1:N | A component includes child components. |
| `consumes` | Component | Hook | 1:1 | A component consumes a hook for data/state. |
| `submits` | Form | Action | 1:1 | A form validates input then delegates to an action. |
| `shapes` | Adapter | ViewModel | 1:1 | An adapter transforms API data into a view model. |
| `protects` | Guard | Page | 1:1 | A guard controls access to a page. |
| `displays` | Component | ViewModel | 1:1 | A component renders data from a view model. |

## R_X — cross-layer (6) · UI → backend (unidirectional, P3)

| edge | source | target | card. | semantics |
|------|--------|--------|-------|-----------|
| `fetches` | Binding | Query | 1:1 | A binding fetches data from a backend query. |
| `mutates` | Binding | Operation | 1:1 | A binding invokes a backend operation. |
| `reflects` | StateIndicator | StateMachine | 1:1 | A UI indicator mirrors a domain lifecycle state. |
| `derives` | ViewModel | Entity | 1:1 | A view model is derived from entity fields. |
| `contracts` | Form | Interface | 1:1 | A form schema aligns with an interface endpoint. |
| `mirrors` | Guard | Rule | 1:1 | A client-side guard mirrors a backend access rule. |

## Properties (enforced by `validate_ontology.py`)

- **P1 — Type safety.** Every edge instance respects its signature.
- **P2 — Partition disjointness.** Backend ∩ UI meta-types = ∅.
- **P3 — Cross-layer unidirectionality.** R_X is always UI → backend.
- **P4 — Cross-feature is backend→backend.** R_CF endpoints are both backend, across features.
- **P5 — Edge-family partition.** R = R_B ⊎ R_CF ⊎ R_U ⊎ R_X.
