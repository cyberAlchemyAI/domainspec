---
tags: [code-ontology, taxonomy, meta-types]
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

# Code Ontology — Meta-Types

> **Generated view of [`code-ontology.json`](code-ontology.json). Edit the JSON, not this file.**
> 25 meta-types across two disjoint partitions (P2): 14 backend, 11 UI. Every domain concept
> in a feature spec declares exactly one. `token` is the canonical identifier (used in
> generated artifacts / `L1.json`); `display` is the human name.

## Backend (14)

| token | display | category | definition |
|-------|---------|----------|------------|
| `Entity` | Entity | Structural | Identity-bearing domain object with a lifecycle. |
| `ValueObject` | Value Object | Structural | Identity-less reusable concept (Money, Address). |
| `Enum` | Enum / Type | Structural | Finite set of states or categories. |
| `Operation` | Operation | Behavioral | Business action that changes state (a mutation). |
| `Query` | Query | Behavioral | Reads data without side effects. |
| `Calculation` | Calculation | Behavioral | Derives a value from inputs. |
| `Rule` | Rule | Governing | Business constraint or validation that gates actions. |
| `Policy` | Policy | Governing | Decision logic that selects behavior. |
| `Workflow` | Workflow | Connective | Multi-step orchestration of operations within a feature. |
| `Saga` | Saga | Connective | Cross-feature transactional orchestration. *(Repo extension; not in the paper.)* |
| `Interface` | Interface | Connective | API boundary — REST, GraphQL, or module contract. |
| `Event` | Event | Connective | Notification that something happened in the domain. |
| `Mapping` | Mapping | Connective | Data transformation between shapes across a boundary. |
| `StateMachine` | State Machine | Connective | States + transitions + guards + effects governing a lifecycle. |

## UI (11)

| token | display | category | definition |
|-------|---------|----------|------------|
| `Page` | Page | Structural | Routable URL view with layout and auth gate. |
| `Layout` | Layout | Structural | Reusable page shell (sidebar, header, slot). |
| `Component` | Component | Structural | Composable UI building block with typed props. |
| `ViewModel` | View Model | Behavioral | Shaped data optimized for rendering. |
| `Hook` | Hook | Behavioral | Encapsulated reactive data/state logic. |
| `Form` | Form | Behavioral | Schema-validated user input contract. |
| `Action` | Action | Behavioral | User-triggered mutation or navigation. |
| `Guard` | Guard | Governing | Client-side access gate (auth, permissions). |
| `Binding` | Binding | Connective | Named connection between a hook and an API endpoint. |
| `Adapter` | Adapter | Connective | Data-shape transformation at the UI boundary. |
| `StateIndicator` | State Indicator | Connective | Visual encoding of domain state (badge, icon, color). |

See [`RELATIONSHIPS.md`](RELATIONSHIPS.md) for the typed edges that connect these.
