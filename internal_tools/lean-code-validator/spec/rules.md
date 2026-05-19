---
tags: [lean-code-validator, rules, predicates, grading]
node_type: spec
is_session: false
layer: [domain]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Rules: lean-code-validator

> These are the five grading predicates. Each rule is evaluated by a corresponding operation in [operations.md](operations.md). P2 is free from the data structure; P1, P3, P4, P5 each have an explicit grading operation.

---

## P1ClosureRule

**Enforced by:** [gradeP1Closure](operations.md#gradep1closure)

Every concept name referenced in the spec — in edges, in subsection links, or in parser-identified cross-references — must be declared in [ConceptSpace](domain.md#conceptspace). Undeclared names that the parser could not resolve appear as `unresolvedRefs` on [Spec](domain.md#spec).

**Formal:** `∀ name ∈ spec.unresolvedRefs, name ∉ spec.conceptSpace.concepts.map(.name)` → each such `name` is a P1 `FAIL` finding.

| Grade | Condition |
|---|---|
| `fail` | At least one unresolved reference exists. |
| `pass` | `spec.unresolvedRefs` is empty. |

---

## P2SigmaRule

**Structural — free from [EdgeRow](domain.md#edgerow) compilation.**

Every edge in `spec.edges` must respect σ for the spec's profile. This constraint is encoded as the `wellTyped` proof obligation on [EdgeRow](domain.md#edgerow). Violations are caught at Lean compile time or at emit time (when `audit_richness.py`'s Lean emitter generates the `EdgeRow` and Lean type-checks the proof). No `gradeP2` operation runs at eval time.

**Formal:** `∀ e : EdgeRow, sigmaValid spec.profile e.edgeType e.src.meta e.tgt.meta = true`.

> All 8 R_U edges have no canonical σ-triple and are encoded with empty σ. A spec using them cannot construct a `wellTyped` proof for `paperBaseline` — the parser emits an `EdgeRow` with a `sorry`-placeholder proof, which surfaces as a Lean warning. Grade: `WARN` (D12 default).

---

## P3ObligationRule

**Enforced by:** [gradeP3Obligations](operations.md#gradep3obligations)

For each declared [Concept](domain.md#concept), the minimum required σ-edges for its [Meta](domain.md#meta) must be present in `spec.edges`. One rule per meta-type (A6 resolution: per-meta-type granularity, not per-predicate-clause).

**Formal:** `∀ c : Concept ∈ spec.conceptSpace, ∀ ob ∈ obligationsForMeta spec.profile c.meta, ∃ e : EdgeRow ∈ spec.edges, ob.satisfied e c`.

| Grade | Condition |
|---|---|
| `warn` | At least one obligation is missing. (Table is our derivation, not a doc citation — see H2.) |
| `pass` | All obligations satisfied. |

> Persistent `warn` dismissals across multiple specs feed back into obligation-table softening for v4. The `warn`-not-`fail` posture is deliberate (D1).

---

## P4AmbiguityRule

**Enforced by:** [gradeP4Ambiguity](operations.md#gradep4ambiguity)

No M6 witnesses should be declared without a disambiguating relation. An M6 witness is two distinct sources converging on the same non-Entity target via the same edge type. Grade depends on [EdgeProvenance](domain.md#edgeprovenance): declared-provenance witnesses are unambiguous authorial intent and grade `fail`; sigmaFallback-provenance witnesses may be parser artefacts and grade `warn`.

| Grade | Condition |
|---|---|
| `fail` | M6 witness with `declared` or `contextInferred` provenance. |
| `warn` | M6 witness with `sigmaFallback` provenance only. |
| `pass` | No M6 witnesses. |

---

## P5AcyclicRule

**Enforced by:** [gradeP5Acyclic](operations.md#gradep5acyclic)

The codegen-dependency subgraph of `spec.edges` must be acyclic. A cycle means there is no valid emission order for the involved concepts. The subgraph is built by filtering `spec.edges` to those where `isCodegenDependency edgeType = true`.

**Formal:** let `G = {(e.src, e.tgt) | e ∈ spec.edges, isCodegenDependency e.edgeType}` — `G` must be a DAG.

| Grade | Condition |
|---|---|
| `fail` | At least one cycle detected in the codegen-dependency subgraph. |
| `pass` | `G` is acyclic. |

> Any P5 `fail` that the spec author believes is a legitimate cycle triggers D11 review of the `isCodegenDependency` partition.
