---
tags:
  - frontend
  - architecture
  - axioms
node_type: axiom
is_session: false
layer: architecture
nature: universal
status: active
version: 1.0.0
last_updated: 2026-04-10
---

# Frontend Axioms

> Universal truths about how React frontends must work. These do not change unless the fundamental architecture changes.

---

## A1: Components Are Deterministic Functions

A component is a pure function: given the same props, it always renders the same JSX. Components do not perform side effects during render (no API calls, no state mutations, no external reads). Side effects happen in event handlers or hooks like `useEffect`, isolated from the render phase.

**Why:** Determinism is the foundation of React's reconciliation algorithm. Breaking this breaks debugging, memoization, and testing.

---

## A2: State Flows Downward, Mutations Bubble Upward

Data always flows from parent to child via props. Mutations (state changes) happen in the parent, triggered by callbacks passed to children. A child never mutates the parent's state directly. This is the React data model.

**Why:** Unidirectional data flow is the only way to make state changes traceable and predictable in a component tree.

---

## A3: Data Fetching and UI Rendering Are Separate Concerns

The responsibility to fetch data belongs to one component (usually the page). The responsibility to render belongs to another (usually sub-components). Never mix: a component that fetches should not also be a deep presentational tree. A component that renders should not fetch.

**Why:** Mixing concerns creates tight coupling, makes components hard to test, and causes unnecessary re-renders.

---

## Governance

These axioms are immutable within the React paradigm. Changing an axiom requires abandoning React or fundamentally rearchitecting the system. Consensus among all senior engineers is required.

---

## Connections

| Document | Relationship | Description |
|----------|--------------|-------------|
| [[frontend-premises]] | `inform` | Premises operationalize these axioms |
| [[frontend-constitution]] | `derive-from` | Constitutional rules implement these axioms |
| [[development-practices-constitution]] | `aligns-with` | Core Principle: "Pure Domain Slices" mirrors A1 |
