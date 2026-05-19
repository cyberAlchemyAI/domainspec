---
tags: [lean-code-validator, queries, sigma, profile, vocabulary]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Queries: lean-code-validator

> All queries are pure Lean 4 functions. They read from the [Sigma](domain.md#sigma) vocabulary table and the spec's [Profile](domain.md#profile). No I/O.

---

## metaTypesInProfile

**Queries:** [Profile](domain.md#profile) → List [Meta](domain.md#meta)

Returns the set of [Meta](domain.md#meta) values active under a given [Profile](domain.md#profile). Used by P3 to enumerate which metas need obligation checking, and by P1 to validate that declared concepts use only profile-active metas.

| Profile | Result size |
|---|---|
| `paperBaseline` | 24 |
| `compositionExtension` | 25 |

---

## edgeTypesInProfile

**Queries:** [Profile](domain.md#profile) → List [EdgeType](domain.md#edgetype)

Returns the set of [EdgeType](domain.md#edgetype) values active under a given [Profile](domain.md#profile). Used by P2 (via [sigmaValid](queries.md#sigmavalid)) and P5 (via [isCodegenDependency](queries.md#iscodegendependency)) to restrict the edge universe to profile-declared types.

| Profile | Result size |
|---|---|
| `paperBaseline` | 26 |
| `compositionExtension` | 29 |

---

## obligationsForMeta

**Queries:** [Profile](domain.md#profile) → [Meta](domain.md#meta) → List Obligation

Returns the minimum-viable wiring obligations for a given meta-type under a given profile. An Obligation is a `(required EdgeType, direction)` pair — e.g., "every `Operation` must have at least one incoming `performs` edge from an `Entity`". Used by P3 ([gradeP3Obligations](operations.md#gradep3obligations)).

> The obligation table is derived from σ, not cited directly in `domainspec-core`. It is a v3 interpretation — see H2 in [`HYPOTHESES.md`](../discovery/HYPOTHESES.md). Persistent dismissals across multiple specs calibrate this table for v4.

**Representative obligations (non-exhaustive):** The full `def` in Lean covers all 25 canonical metas. Metas with no required wiring (e.g., `ValueObject`, `Enum`, UI leaf types) return an empty obligation list — they are checked but never fail P3. The table below shows the 7 metas that carry non-empty obligations.

| Meta | Required edge | Direction | Note |
|---|---|---|---|
| `Operation` | `performs` | incoming from `Entity` | Entity must declare the operation. |
| `Query` | `queries` | outgoing to `Entity` | Query must target a declared entity. |
| `Event` | `emits` | incoming from `Operation` | Event must be emitted by some operation. |
| `Rule` | `enforces` | incoming from `Operation` | Rule must be enforced by some operation. |
| `Workflow` | `orchestrates` | outgoing to `Operation` | Workflow must call at least one operation. |
| `Mapping` | `maps` | incoming from `Entity` or `Operation` | Mapping must be invoked. |
| `Interface` | `exposes` | incoming from `Entity` or `Operation` | Interface must expose something. |

---

## isCodegenDependency

**Queries:** [EdgeType](domain.md#edgetype) → Bool

Returns `true` if this edge type represents a codegen-time dependency — i.e., the target's class must be emitted before the source's. Used by P5 ([gradeP5Acyclic](operations.md#gradep5acyclic)) to build the dependency subgraph for cycle detection.

> Partition is the D11 proposed default. Any P5 `WARN` cycle that the spec author considers legitimate triggers D11 review (see [`PROJECT-DECISIONS.md`](../discovery/PROJECT-DECISIONS.md#d11)).

| Codegen dependencies (`true`) | Not codegen dependencies (`false`) |
|---|---|
| `performs`, `produces`, `enforces`, `calculates`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits` (R_B, all except `transitions`) | `transitions` (R_B — runtime state transition, not a compile-time import) |
| `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors` (all R_X) | All 8 R_U edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) — intra-UI-layer composition |
| R_CF edges (`produces-for`, `triggers-cross`, `enforces-cross`) — codegen dependencies in `compositionExtension` only | (absent from `paperBaseline`; not applicable in that profile) |

---

## sigmaValid

**Queries:** [Profile](domain.md#profile) → [EdgeType](domain.md#edgetype) → [Meta](domain.md#meta) → [Meta](domain.md#meta) → Bool

Returns `true` if the triple `(edgeType, srcMeta, tgtMeta)` is a valid σ-triple for the given profile. This is the primary σ-typing check. Used by the [EdgeRow](domain.md#edgerow) compile-time proof obligation (P2 free) and by P3 to verify obligation satisfaction.

All 8 R_U edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) have no σ-triple in the canonical paper and return `false` for all `(Meta, Meta)` pairs — any use in an [EdgeRow](domain.md#edgerow) produces a `WARN` at grading time (D12 default: `WARN`, not `FAIL`). Two edges (`renders` and `submits`) appear in example traces but lack a ratified σ-triple; they are treated as unevidenced until the R_U σ-table is ratified.
