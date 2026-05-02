---
tags:
  - system
  - architecture
layer: architecture
nature: technical
status: exploratory
audience: agent, engineer
version: 0.2.0
last_updated: 2026-03-09
node_type: premise
is_session: false

---

# System Premises

> Working hypotheses about the technical approach, architecture, and team behavior. These are informed bets — expected to be revised as we accumulate evidence. Each statement carries an explicit confidence level.

---

## Objective

This document captures the **technical and behavioral bets** the team is making. It answers the question: *"What working hypotheses guide our architecture, tooling, and team practices — and how confident are we in each?"*

Unlike axioms (which are taken as given), premises are expected to be revised. Each carries explicit `convicção` and `veracidade` labels.

---

## Index

1. [Technical & Architectural Bets](#technical--architectural-bets)
2. [Behavioral & Structural Bets](#behavioral--structural-bets)
3. [Connections](#connections)

---

## Technical & Architectural Bets

### P-SYS-1 — Domain isolation pays off at our scale
`convicção: high` `veracidade: medium`

Domain isolation (DDD / Clean Architecture) reduces coupling between business areas and makes each domain independently testable and deployable. The assumption: we will have more than 2 domains with meaningfully distinct lifecycles. If the system stays simpler than expected, this structure adds friction without benefit.

*Under validation — we have 3 domains today (aquisicao, liquidacao, estoque) and the boundaries are holding.*

### P-SYS-2 — Polars is the right choice for tabular financial data processing
`convicção: medium` `veracidade: medium`

Polars offers better performance and a cleaner API than Pandas for the kind of column-oriented financial data processing we do. Chosen empirically, not from a formal benchmark.

*No formal performance validation done. Should be tested before scaling significantly.*

---

## Behavioral & Structural Bets

### P-SYS-3 — Code is the Compiled Output of Documentation
`convicção: high` `veracidade: medium`

Documentation is the source code of intent; Python/TypeScript is merely the compiled execution of that intent by an agent or human. If the codebase and the documentation diverge, it is a compilation error. We do not reverse-engineer intent from undocumented code.

### P-SYS-4 — Architectural Complexity is Justified by Conceptual Correctness
`convicção: high` `veracidade: high`

Agents make writing boilerplate and glue code cheap. Therefore, we do not compromise architectural boundaries just to "save typing". Architectural divisions (like strict CQRS or Event Sourcing) that would be "over-engineering" for a fast-moving human team are correct here if they perfectly reflect the true geometry of the business.

### P-SYS-5 — Ontological Boundaries are Working Hypotheses
`convicção: high` `veracidade: high`

Folders, domains (`aquisicao`, `liquidacao`), and tags are not fundamental truths; they are bets about how the business operates *today*. If a domain boundary consistently generates friction or circular dependencies, the boundary is mathematically wrong and must be moved. We do not torture the code to fit the folder.

### P-SYS-6 — Implied Knowledge is Lost Knowledge
`convicção: high` `veracidade: high`

Agents break on implicit "everyone knows" conventions. If a rule, connection, or definition is not explicitly stated in the graph, *it does not exist*. This justifies the rigorous enforcement of typed edges, mandatory frontmatter, and written Constitutions over unwritten "team habits".

### P-SYS-7 — Refactoring is the Primary Mechanism of Architecture
`convicção: high` `veracidade: high`

An architecture optimized for "getting it right the first time" will fail in a complex domain. The architecture must strictly optimize for *revisability*. This is why every premise has a lifecycle (`draft` → `evergreen`) and why we mandate orthogonal, decoupled services.

### P-SYS-8 — Entropy is Handled via Granularity on Demand
`convicção: medium` `veracidade: medium`

Splitting files or concepts prematurely creates fragmented noise that destroys context windows. We start with large, coarse-grained nodes. We only split a document or a domain when its semantic density makes it impossible to reason about a single problem.

---

### P-SYS-9 — Lifecycles are Trees, not Lines (Stream Hierarchy)
`convicção: high` `veracidade: high`

Grouping all events in a single global trace creates noise that is impossible to navigate efficiently for specific business contexts. Grouping events by distinct business lifecycles (streams) that point to their initiators (`parent_event`) creates a navigable causal tree. This ensures observability can scale while allowing readers to pull only the relevant layer.

*This justifies: `stream_id` independence per entity, `parent_event` tracking.*

### P-SYS-10 — Fail-Open Logging Protects the Business Flow
`convicção: high` `veracidade: medium`

The core business cannot stop because the logging infrastructure threw an unexpected exception. It is vastly preferable to have an operation succeed with a missing log (caught by ERROR monitoring) than to roll back a valid financial operation due to an auxiliary observability failure.

*This justifies: `log_event_safe` failing silently in production but alerting infrastructure.*

### P-SYS-11 — Granular Entities Require Deterministic Identity
`convicção: high` `veracidade: medium`

Database auto-increment primary keys are fragile constraints of physical storage, not conceptual identities. Identifying granular entities via deterministic business hashes ensures that the event log maintains integrity and continuity regardless of database migrations, row resets, or re-imports.

*This justifies: Use of `entity_identity.py` hashes for `entity_id`.*

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[system-axioms]] | `derives-from` | System axioms are the foundational layer below these premises |
| [[folder-structure-constitution]] | `derives-from` | P-SYS-1 and P-SYS-5 justify the directory structures — expressed as `derives-from` on that document |
| [[development-practices-constitution]] | `derives-from` | P-SYS-3 and P-SYS-7 are the primary justification — expressed as `derives-from` on that document |
| [[event-system-constitution]] | `derives-from` | P-SYS-9, P-SYS-10, and P-SYS-11 justify the event pipeline rules — expressed as `derives-from` on that document |
