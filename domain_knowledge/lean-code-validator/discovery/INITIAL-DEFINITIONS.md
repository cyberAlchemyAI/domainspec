# Initial Definitions — lean-code-validator (v3)

## Objective

This document fixes the vocabulary v3 will use — glossary terms, candidate bounded contexts, core objects (with `observed` / `stated` / `hypothesized` provenance), and unresolved ambiguities. It exists so the spec-writer stage can lift these terms directly into SPEC.md without re-deriving them, and so any future agent has a single authoritative term list for the tool's domain.

## Bounded contexts

The validator's domain decomposes into three bounded contexts. Each is small and has a clear seam.

| Context | Concern | Authority |
|---|---|---|
| **Vocabulary** | What metas, edges, profiles, and σ-triples exist | `domainspec-core` (lifted into v3 read-only) |
| **Spec representation** | What a parsed L1 spec looks like as Lean data | v3 (`Spec`, `EdgeRow`, etc.) |
| **Grading** | How a `Spec` is evaluated against the predicates and reported | v3 (`PredicateReport`, `CodegenReadinessReport`, the five predicate functions) |

The Vocabulary context is *upstream* — v3 mirrors `domainspec-core`. The Spec representation context is the data layer. The Grading context is the behavior layer. Operations and rules live in Grading; concept declarations (Meta, EdgeType, Profile) live in Vocabulary; the bridge (parsed-spec data structures) lives in Spec representation.

## Glossary

Terms grouped by bounded context. Provenance: `observed` (in code/docs today), `stated` (declared in research/findings), `hypothesized` (proposed by v3, not yet in any artifact).

### Vocabulary context

| Term | Provenance | Definition |
|---|---|---|
| **Meta** | observed | A node-type label — one of 25 values across backend (13), UI (11), composition (1). Source: `domainspec-core` DEFINITIONS.md DS-D1. |
| **EdgeType** | observed | An edge-type label — one of 29 values across R_B (12), R_U (8), R_X (6), R_CF (3). Source: DS-D2. |
| **σ (sigma)** | observed | The signature operator `EdgeType → P(Meta) × P(Meta)`, declaring which (source-meta, target-meta) pairs are valid for each edge type. Source: DS-D8 + paper Tables 3 & 4. |
| **Profile** | stated | A named subset of (Meta, EdgeType, σ) that a spec declares it conforms to. Two defined: `paperBaseline` and `compositionExtension`. |
| **σ-triple** | stated | A concrete `(EdgeType, Meta, Meta)` instance certified valid by σ. |
| **R_B / R_U / R_X / R_CF** | observed | The four edge families: Backend, UI, Cross-layer, Cross-feature. Source: DS-D2 + DS-D7 (disjointness). |
| **Unsigned edge type** | hypothesized | An EdgeType named in DEFINITIONS.md but with no σ-triple in the paper. All 8 R_U edges fall here. v3 ships them with empty σ — any use becomes a `WARN`. `renders` and `submits` appear in example traces but lack a ratified σ-triple and are also treated as unsigned. |

### Spec representation context

| Term | Provenance | Definition |
|---|---|---|
| **Spec** | observed | A v3 `structure` capturing one parsed L1 spec: its profile, concept space, edge list, plus parser metadata (unresolved refs, per-concept counts). |
| **ConceptSpace** | observed | The concept type for a given spec — name set + `metaOf` classification. Inherited from v2 `Richness.lean`. |
| **Concept** | observed | One declared name in a spec (e.g., `Invitation`, `AcceptInvitation`), classified by a `Meta`. |
| **EdgeRow** | observed | A typed edge `(src, edge, tgt)` with a compile-time `wellTyped` proof obligation. v2 mechanism, retained in v3. |
| **EdgeProvenance** | hypothesized | How the parser inferred a given edge: `declared` (bold-prefix), `contextInferred` (e.g. Rules subsection), `sigmaFallback` (incidental markdown link). New in v3. |
| **UnresolvedReference** | hypothesized | A concept name appearing in markdown that the parser failed to resolve to a declared concept. Currently silently dropped; v3 surfaces it. |

### Grading context

| Term | Provenance | Definition |
|---|---|---|
| **Grade** | stated | One of `pass`, `warn`, `fail`. Aggregates by worst-component rule. |
| **Predicate** | stated | One of P1-P5: schema closure, σ-typing, signature completeness, codegen ambiguity, generation-order DAG. |
| **Finding** | stated | A structured per-issue record: concept name + one-line message + recommendation. |
| **PredicateReport** | stated | Per-predicate result: `(predicate name, grade, findings list)`. |
| **CodegenReadinessReport** | stated | The full grader output for one spec: profile + overall grade + per-predicate reports. |
| **Codegen-ready** | hypothesized | Informal label for a spec that grades `pass` on all five predicates. **Not** a binary contract — a graded property. |
| **M6 witness** | observed | Two distinct sources converging on the same non-Entity target with the same edge type without a disambiguating relation. v2 already enumerates these. |
| **Codegen dependency** | hypothesized | The subset of edge types that imply "the target's class must be emitted before the source's." v3 partitions `EdgeType` via `isCodegenDependency`. Not all R_B edges are codegen dependencies (e.g., `transitions` crosses a runtime state boundary, not a compile-time type boundary). All R_X edges are codegen dependencies. All R_U edges are not. |
| **Obligation** | hypothesized | A per-meta-type minimum-viable wiring rule (e.g., "every `Operation` must have a performing `Entity`"). Drawn from σ; not enumerated in any canonical doc. |

## Core objects (candidate Entities / VOs / Operations)

Mapping the vocabulary onto DomainSpec meta-types so the spec-writer stage can populate `domain.md`, `operations.md`, etc. directly. Provenance reflects whether the object exists in v2 code (`observed`), is described in research.md (`stated`), or is new in v3 (`hypothesized`).

### Entities

| Concept | Provenance | Notes |
|---|---|---|
| `Spec` | observed (v2) | Carries the whole parsed spec. v3 extends with `profile`, `unresolvedRefs`, `conceptCount`. |
| `Concept` | observed (v2) | Per-spec concept type. |
| `EdgeRow` | observed (v2) | Typed edge with compile-time well-typedness. |
| `Sigma` | hypothesized | Reified σ-table as a queryable structure (currently a function). May or may not need entity status — could stay a `def`. |
| `CodegenReadinessReport` | stated | The grader output. |

### ValueObjects

| Concept | Provenance | Notes |
|---|---|---|
| `Meta` | observed | Inductive enum, 25 cases. |
| `EdgeType` | observed | Inductive enum, 29 cases. |
| `Profile` | stated | Inductive enum, 2 cases (extensible). |
| `Grade` | stated | Inductive enum, 3 cases. |
| `EdgeProvenance` | hypothesized | Inductive enum, 3 cases. |
| `Finding` | stated | Carries concept + message + recommendation. |
| `PredicateReport` | stated | Per-predicate aggregation. |

### Operations

| Concept | Provenance | Notes |
|---|---|---|
| `gradeFor` | stated | Top-level grader: `Spec → CodegenReadinessReport`. |
| `gradeP1Closure` | stated | Predicate evaluator. |
| `gradeP3Obligations` | stated | Predicate evaluator (per-concept loop). |
| `gradeP4Ambiguity` | stated | Predicate evaluator (wraps `m6Witnesses`). |
| `gradeP5Acyclic` | stated | Predicate evaluator (cycle detection). |
| `aggregateOverall` | stated | Combines per-predicate grades into the overall grade. |

### Queries

| Concept | Provenance | Notes |
|---|---|---|
| `metaTypesInProfile` | stated | `Profile → List Meta`. |
| `edgeTypesInProfile` | stated | `Profile → List EdgeType`. |
| `obligationsForMeta` | stated | `Profile → Meta → List Obligation`. |
| `isCodegenDependency` | hypothesized | `EdgeType → Bool`. |
| `sigmaValid` | observed (v2) | `Profile → EdgeType → Meta → Meta → Bool`. |

### Events

| Concept | Provenance | Notes |
|---|---|---|
| `ReportEmitted` | hypothesized | Logical event when a `CodegenReadinessReport` is produced. May or may not need first-class representation — depends on whether v3 wires into `domainspec-readiness-gate`. |

### Workflows

| Concept | Provenance | Notes |
|---|---|---|
| `GradingPipeline` | stated | Parse → resolve profile → grade each predicate → aggregate → emit. |

### Interfaces

| Concept | Provenance | Notes |
|---|---|---|
| `LeanEvalInterface` | observed | `#eval gradeFor spec` in any Lean file. |
| `CliInterface` | hypothesized | `lake env lean --run examples/X.lean` driving the grader. |
| `JsonReportInterface` | hypothesized | Optional JSON emission for downstream consumers. **Open question**: needed for v3 or deferred? |

### Mappings

| Concept | Provenance | Notes |
|---|---|---|
| `MarkdownToSpec` | observed | The parser pipeline (`audit_richness.py`). External to Lean but part of the validator's lifecycle. |
| `SpecToLean` | observed | The Lean emission pipeline (also in `audit_richness.py`). |

### Rules

| Concept | Provenance | Notes |
|---|---|---|
| `P1ClosureRule` | stated | "Every referenced concept must be declared." |
| `P2SigmaRule` | observed | "Every edge respects σ for its profile." Free from `EdgeRow`. |
| `P3ObligationRule[Meta]` | stated | One rule per meta-type. ~13 backend + 8 UI + 1 composition rules. |
| `P4AmbiguityRule` | stated | "No declared M6 witnesses; warn on fallback-only M6 witnesses." |
| `P5AcyclicRule` | stated | "Codegen-dependency graph is acyclic." |

### StateMachines

| Concept | Provenance | Notes |
|---|---|---|
| `FindingLifecycle` | hypothesized | `open → dismissed → resolved`. Only needed if per-finding suppression ships in v3 (open question). Likely deferred to v4. |

## Unresolved ambiguities

These need decisions before the spec-writer stage can produce a clean SPEC.md.

| # | Ambiguity | Owner | Note |
|---|---|---|---|
| A1 | Is `Sigma` an `Entity`, or just a `def`? | tool maintainer | Affects whether σ shows up in `domain.md` as a first-class concept. |
| A2 | Does `ReportEmitted` need to be a real `Event`, or is the grader pure? | tool maintainer | Becomes real if v3 integrates with `domainspec-readiness-gate`. |
| A3 | Is `CliInterface` distinct from `LeanEvalInterface`, or is the CLI just `lake env lean --run`? | operator | Cleanest answer: `lake env lean --run` IS the CLI; `CliInterface` collapses into `LeanEvalInterface`. |
| A4 | Is `JsonReportInterface` in scope for v3? | operator | Defer to PROJECT-DECISIONS. |
| A5 | Does `FindingLifecycle` ship in v3, or wait for v4? | operator | Per-finding suppression is convenient but not core. |
| A6 | **RESOLVED: one rule per meta-type.** Granularity of `P3ObligationRule[Meta]` — one rule per meta-type, or one per (meta-type × predicate-clause)? | tool maintainer | Affects how `rules.md` is structured. Decided (D13 sprint): one `P3ObligationRule` per meta-type; multi-clause metas (e.g. `Operation`) list multiple obligations under one rule. Reversible if EX1 shows per-clause suppression is needed. |
| A7 | What grade does v3 emit when a spec uses an `unsigned` R_U edge? `WARN` (current proposal) or `FAIL` (strict)? | tool maintainer | Drives how aggressively v3 surfaces the canonical R_U gap. |
