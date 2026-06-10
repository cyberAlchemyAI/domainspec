---
tags: [lean-code-validator, queries, sigma, profile, vocabulary]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-06-10
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

> Edge directions are σ-verified against `LeanCodeValidator/Sigma.lean` (D2: canonical σ wins). Obligation *mandatoriness* — whether a σ-permitted edge is *required* ≥1 — is a v3 inference (H2), not stated in σ; items tagged PENDING EX1 are graded `warn`-only (D1) until EX1 calibrates them. Four backend rows (Event, Rule, Mapping, Interface) were corrected from reversed-direction drafts.

**Authoritative obligation table (σ-verified):** The full `def` in Lean covers all canonical metas. Metas with no required wiring (e.g., `Entity`, `Enum`, `ValueObject` non-obligations, UI leaf types) return an empty obligation list — they are checked but never fail P3. The tables below are split by layer.

**Backend metas** (apply in both profiles):

| Meta | Obligation | Direction (relative to the meta) | Confidence/Status |
|---|---|---|---|
| `Operation` | ≥1 `performs` from `Entity` | incoming | HIGH (σ-correct; both drafts agree) |
| `Operation` | ≥1 `produces` to `Event` | outgoing | PENDING EX1 — void-operation question (σ permits the edge but does not mandate ≥1) |
| `Query` | ≥1 `queries` to `Entity` | outgoing | HIGH |
| `Calculation` | ≥1 `calculates` to `Operation` | outgoing | MEDIUM |
| `Rule` | ≥1 `enforces` to `Operation` | outgoing | HIGH (corrected — was reversed) |
| `Policy` | ≥1 `applies` to `Operation` | outgoing | MEDIUM |
| `Workflow` | ≥1 `orchestrates` to `Operation` | outgoing | HIGH |
| `Interface` | ≥1 `exposes` to `Operation` ∨ `Query` | outgoing | HIGH (corrected — was reversed) |
| `Event` | ≥1 `produces` from `Operation` OR ≥1 `emits` from `Entity` | incoming | MEDIUM (corrected — was `emits` from Operation) |
| `Mapping` | ≥1 `maps` to `Entity` ∨ `Interface` | outgoing | HIGH (corrected — was reversed) |
| `StateMachine` | ≥1 `transitions` from `Event` | incoming | PENDING EX1 |
| `ValueObject` | ≥1 `contains` from `Entity` | incoming | PENDING EX1 — likely too strict |
| `Entity`, `Enum` | (no obligation) | — | — |

**UI metas** (R_X-based obligations are σ-verified; R_U-based ones reference unsigned edges):

| Meta | Obligation | Status |
|---|---|---|
| `Form` | ≥1 `contracts` to `Interface` (R_X) | UNTESTED — no UI spec exists yet |
| `ViewModel` | ≥1 `derives` to `Entity` (R_X) | UNTESTED |
| `Binding` | ≥1 `fetches` to `Query` OR ≥1 `mutates` to `Operation` (R_X) | UNTESTED |
| `Guard` | ≥1 `mirrors` to `Rule` (R_X) | UNTESTED |
| `StateIndicator` | ≥1 `reflects` to `StateMachine` (R_X) | UNTESTED |
| `Page` | ≥1 outgoing R_U edge to `Layout`/`Component` | PENDING R_U σ-ratification (D12) — warn/informational only |
| `Hook` | ≥1 outgoing R_U edge OR R_X edge to `Query` | PENDING R_U σ-ratification |
| `Action` | ≥1 outgoing R_U edge to `Binding` | PENDING R_U σ-ratification |
| `Adapter`, `Layout`, `Component` | (no obligation) | — |

**Composition meta** (`compositionExtension` profile only):

| Meta | Obligation | Status |
|---|---|---|
| `Saga` | ≥1 R_CF edge (`produces-for` ∨ `triggers-cross` ∨ `enforces-cross`) crossing ≥2 features | UNTESTED |

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
