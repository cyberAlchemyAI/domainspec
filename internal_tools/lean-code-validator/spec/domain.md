---
tags: [lean-code-validator, domain, spec, edgerow, concept, grading, vocabulary]
node_type: spec
is_session: false
layer: [domain]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Domain: lean-code-validator

> Structural concepts (entities and value objects) for the lean-code-validator v3.
> Authority: [INITIAL-DEFINITIONS.md](../discovery/INITIAL-DEFINITIONS.md) — every concept traces to a bounded context and provenance entry there.
> Linking rule: every referenced concept is a markdown link to its source aspect file.

---

## Entities

### Spec

The central data structure for one parsed L1 spec. Carries the spec's declared [Profile](#profile), its [ConceptSpace](#conceptspace), its typed edge list, and parser metadata. All five predicate functions operate on a `Spec`.

| Field | Type | Required | Description |
|---|---|---|---|
| profile | [Profile](#profile) | yes | Declared profile; defaults to `paperBaseline` if absent from frontmatter. |
| conceptSpace | [ConceptSpace](#conceptspace) | yes | Full set of declared concepts with their meta-type classification. |
| edges | List [EdgeRow](#edgerow) | yes | All typed edges extracted by the parser. |
| unresolvedRefs | List String | yes | Concept names appearing in markdown that the parser could not resolve. Surfaces P1 findings. |
| conceptCount | Nat | yes | Total declared concepts; used for P3 coverage checks. |

**Operations:** [gradeFor](operations.md#gradefor), [gradeP1Closure](operations.md#gradep1closure), [gradeP3Obligations](operations.md#gradep3obligations), [gradeP4Ambiguity](operations.md#gradep4ambiguity), [gradeP5Acyclic](operations.md#gradep5acyclic)
**Queries:** [metaTypesInProfile](queries.md#metatypesinprofile), [edgeTypesInProfile](queries.md#edgetypesinprofile), [sigmaValid](queries.md#sigmavalid)

---

### Concept

One declared name in a spec, classified by a [Meta](#meta). A concept is the atomic unit that edges connect. Every name in the `ConceptSpace` is a `Concept`; names appearing only in edge markdown that the parser cannot resolve become `unresolvedRefs` on [Spec](#spec), not `Concept` entries.

| Field | Type | Required | Description |
|---|---|---|---|
| name | String | yes | The declared concept name (e.g., `Invitation`, `AcceptInvitation`). |
| meta | [Meta](#meta) | yes | Meta-type classification. Determines which σ-obligations apply (P3). |

**Queries:** [obligationsForMeta](queries.md#obligationsformeta)

---

### EdgeRow

A typed edge `(src, edgeType, tgt)` with a compile-time `wellTyped` proof obligation. The proof obligation is the σ-typing constraint: the `(edgeType, src.meta, tgt.meta)` triple must be a valid σ-triple for the spec's profile. **P2 is free from this data structure** — no separate gradeP2 operation exists; σ-typing failures are detected at Lean compile time or emit time.

| Field | Type | Required | Description |
|---|---|---|---|
| src | [Concept](#concept) | yes | Source concept. |
| edgeType | [EdgeType](#edgetype) | yes | Edge type label. |
| tgt | [Concept](#concept) | yes | Target concept. |
| provenance | [EdgeProvenance](#edgeprovenance) | yes | How the parser inferred this edge. |
| wellTyped | σ-proof | yes | Compile-time proof that `(edgeType, src.meta, tgt.meta)` is valid for the spec's profile. |

**Rules:** [P2SigmaRule](rules.md#p2sigmarule)

---

### CodegenReadinessReport

The full grader output for one [Spec](#spec). Carries the profile under which the spec was graded, the overall [Grade](#grade) (worst-component of all predicates), and per-predicate [PredicateReport](#predicatereport)s. This is always produced — the grader never rejects a spec (D1).

| Field | Type | Required | Description |
|---|---|---|---|
| profile | [Profile](#profile) | yes | The profile used for grading. |
| overallGrade | [Grade](#grade) | yes | Worst-component grade across all predicate reports. |
| predicateReports | List [PredicateReport](#predicatereport) | yes | One entry per predicate P1–P5. |

**Operations:** [aggregateOverall](operations.md#aggregateoverall)
**Events:** [ReportEmitted](events.md#reportemitted)

---

## Value Objects

### Meta

A node-type label. One of 25 values across backend (13), UI (11), and composition (1). Source of truth: `domainspec-core` DEFINITIONS.md DS-D1. Encoded as a Lean inductive enum. The `paperBaseline` profile activates 24 of 25 metas (all except `Saga`); `compositionExtension` activates all 25.

**Values (backend, 13):** `Entity`, `ValueObject`, `Enum`, `Operation`, `Query`, `Calculation`, `Rule`, `Policy`, `Workflow`, `Interface`, `Event`, `Mapping`, `StateMachine`
**Values (UI, 11):** `Page`, `Layout`, `Component`, `ViewModel`, `Hook`, `Form`, `Action`, `Guard`, `Binding`, `Adapter`, `StateIndicator`
**Values (composition, 1):** `Saga`

**Queries:** [obligationsForMeta](queries.md#obligationsformeta), [metaTypesInProfile](queries.md#metatypesinprofile)

---

### EdgeType

An edge-type label. One of 29 values across R_B (12), R_U (8), R_X (6), R_CF (3). Source of truth: DS-D2. Encoded as a Lean inductive enum. All 8 R_U edges have no σ-triple in the canonical paper — they are encoded with empty σ and produce a `WARN` on use.

**Values (R_B, 12):** `performs`, `produces`, `enforces`, `calculates`, `transitions`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits`
**Values (R_U, 8):** `renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`
**Values (R_X, 6):** `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`
**Values (R_CF, 3):** `produces-for`, `triggers-cross`, `enforces-cross`

**Queries:** [edgeTypesInProfile](queries.md#edgetypesinprofile), [isCodegenDependency](queries.md#iscodegendependency), [sigmaValid](queries.md#sigmavalid)
**Rules:** [P2SigmaRule](rules.md#p2sigmarule)

---

### Profile

A named subset of (Meta, EdgeType, σ) that a spec declares conformance to. Two values: `paperBaseline` and `compositionExtension`. Default if no frontmatter declaration: `paperBaseline`.

| Value | Active metas | Active edges | Notes |
|---|---|---|---|
| `paperBaseline` | 24 | 26 | All R_B (12) + all R_U (8) + all R_X (6); excludes `Saga` meta and R_CF edges. |
| `compositionExtension` | 25 | 29 | Adds `Saga` meta and 3 R_CF edges to the baseline. |

**Queries:** [metaTypesInProfile](queries.md#metatypesinprofile), [edgeTypesInProfile](queries.md#edgetypesinprofile)

---

### Grade

One of three grading outcomes. Aggregates by worst-component rule: if any predicate grades `fail`, the overall grade is `fail`; if any grades `warn` (and none fail), overall is `warn`; `pass` only when all predicates pass.

**Values:** `pass`, `warn`, `fail`

**Operations:** [aggregateOverall](operations.md#aggregateoverall)

---

### ConceptSpace

The concept namespace for a given [Spec](#spec): the full set of declared concept names plus their `metaOf` classification. Inherited from the v2 `Richness.lean` mechanism. Provides the membership check for P1 (closure) and the per-meta enumeration for P3 (obligations).

| Field | Type | Required | Description |
|---|---|---|---|
| concepts | List [Concept](#concept) | yes | All declared concepts. |
| metaOf | String → Option [Meta](#meta) | yes | Lookup function from name to meta-type. |

**Rules:** [P1ClosureRule](rules.md#p1closurerule), [P3ObligationRule](rules.md#p3obligationrule)

---

### EdgeProvenance

How the parser inferred a given edge. New in v3; not present in v2. Carried on every [EdgeRow](#edgerow). Affects P4: `sigmaFallback` provenance on a multi-source M6 pattern produces a `WARN`; `declared` provenance on the same pattern produces a `FAIL`.

**Values:**
- `declared` — edge extracted from a bold-prefix syntax (e.g., `**performs** →`).
- `contextInferred` — edge inferred from structural context (e.g., Rules subsection implying `enforces`).
- `sigmaFallback` — edge inferred from an incidental markdown link, accepted as a σ-typed edge as a fallback.

**Rules:** [P4AmbiguityRule](rules.md#p4ambiguityrule)

---

### Finding

A structured per-issue record attached to a [PredicateReport](#predicatereport). Every `WARN` and `FAIL` outcome produces at least one `Finding` with a concrete witness (the concept name) and a one-line recommendation. No suppression in v3 (D10 default).

| Field | Type | Required | Description |
|---|---|---|---|
| concept | String | yes | The concept name involved (or `"spec"` for spec-level issues). |
| message | String | yes | One-line description of the issue. |
| recommendation | String | yes | One-line suggested fix. |

---

### PredicateReport

Per-predicate aggregation: predicate name, its [Grade](#grade), and the list of [Finding](#finding)s it produced.

| Field | Type | Required | Description |
|---|---|---|---|
| predicate | String | yes | Predicate identifier: `P1`, `P2`, `P3`, `P4`, or `P5`. |
| grade | [Grade](#grade) | yes | Grade for this predicate. |
| findings | List [Finding](#finding) | yes | All findings for this predicate (empty on `pass`). |

---

### Sigma

The reified σ-table: a queryable mapping from [EdgeType](#edgetype) to the set of valid `(Meta, Meta)` source-target pairs for a given [Profile](#profile). Upstream source: `domainspec-core` paper Tables 3 & 4. In Lean, this may be implemented as a pure `def` (not a `structure`) — see A1 in INITIAL-DEFINITIONS. Treated here as a VO because it has queryable identity.

**Queries:** [sigmaValid](queries.md#sigmavalid)
**Rules:** [P2SigmaRule](rules.md#p2sigmarule)
