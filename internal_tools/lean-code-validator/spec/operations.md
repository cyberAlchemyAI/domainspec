---
tags: [lean-code-validator, operations, grader, predicates]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-06-10
---

# Operations: lean-code-validator

> All operations are pure Lean 4 functions. There is no I/O in the grading operations — they take a [Spec](domain.md#spec) and return a [CodegenReadinessReport](domain.md#codegenreadinessreport) or [PredicateReport](domain.md#predicatereport). No state mutation.

---

## gradeFor

**Performs on:** [Spec](domain.md#spec) → [CodegenReadinessReport](domain.md#codegenreadinessreport)

Top-level grader. Single entry point for the entire grading pipeline. Runs P1, P3, P4, P5 in sequence (P2 is free from [EdgeRow](domain.md#edgerow) compilation), collects the four [PredicateReport](domain.md#predicatereport)s, delegates to [aggregateOverall](operations.md#aggregateoverall), and returns the completed [CodegenReadinessReport](domain.md#codegenreadinessreport). Always returns — never throws or short-circuits.

**Emits:** [ReportEmitted](events.md#reportemitted)
**Orchestrates:** [gradeP1Closure](operations.md#gradep1closure), [gradeP3Obligations](operations.md#gradep3obligations), [gradeP4Ambiguity](operations.md#gradep4ambiguity), [gradeP5Acyclic](operations.md#gradep5acyclic), [aggregateOverall](operations.md#aggregateoverall)

| Precondition | Description |
|---|---|
| `spec.profile` is set | Defaults to `paperBaseline` if absent from input; must be resolved before call. |

| Postcondition | Description |
|---|---|
| Report always produced | `gradeFor` returns a `CodegenReadinessReport` for any well-formed `Spec`. |
| Predicate count = 4 | `predicateReports` has exactly 4 entries (P1, P3, P4, P5). P2 is structural, not a report entry. |

---

## gradeP1Closure

**Performs on:** [Spec](domain.md#spec) → [PredicateReport](domain.md#predicatereport)

Evaluates predicate P1 (schema closure): every concept name appearing in `spec.edges` and in `spec.unresolvedRefs` must be declared in `spec.conceptSpace`. Produces one [Finding](domain.md#finding) per undeclared name. Grades `fail` if any undeclared reference is found; `pass` otherwise.

**Enforces:** [P1ClosureRule](rules.md#p1closurerule)

| Input | Description |
|---|---|
| `spec.unresolvedRefs` | Names the parser could not resolve to a declared concept. |
| `spec.conceptSpace` | The declared concept namespace. |

---

## gradeP3Obligations

**Performs on:** [Spec](domain.md#spec) → [PredicateReport](domain.md#predicatereport)

Evaluates predicate P3 (per-meta-type signature completeness): for each declared [Concept](domain.md#concept), checks that the minimum required σ-edges for its [Meta](domain.md#meta) are present in `spec.edges`. Obligations are looked up via [obligationsForMeta](queries.md#obligationsformeta). Produces one [Finding](domain.md#finding) per missing obligation. Grades `warn` for missing obligations (never `fail` — per D1; the obligation table is our v3 inference, not a doc citation — see H2 in HYPOTHESES.md); `pass` if all obligations are met. Obligations tagged PENDING EX1 in [queries.md](queries.md) are emitted as `warn` findings whose dismissal rate during EX1 calibrates the table; directions are σ-verified (D2).

**Enforces:** [P3ObligationRule](rules.md#p3obligationrule)
**Queries:** [obligationsForMeta](queries.md#obligationsformeta)

---

## gradeP4Ambiguity

**Performs on:** [Spec](domain.md#spec) → [PredicateReport](domain.md#predicatereport)

Evaluates predicate P4 (codegen ambiguity): detects M6-witness patterns — two distinct sources converging on the same non-Entity target with the same edge type without a disambiguating relation. Wraps the v2 `m6Witnesses` enumeration. Grades by provenance: `declared`-provenance M6 witnesses grade `fail`; `sigmaFallback`-provenance M6 witnesses grade `warn`. No M6 witnesses → `pass`.

**Enforces:** [P4AmbiguityRule](rules.md#p4ambiguityrule)

---

## gradeP5Acyclic

**Performs on:** [Spec](domain.md#spec) → [PredicateReport](domain.md#predicatereport)

Evaluates predicate P5 (generation-order DAG): restricts `spec.edges` to the codegen-dependency subgraph ([isCodegenDependency](queries.md#iscodegendependency) = `true` for the edge type), then checks the subgraph for cycles. Cycle detection is implemented from scratch (no Mathlib — D3). Grades `fail` if a cycle is detected; `pass` otherwise. A cycle that the spec author considers legitimate triggers D11 review.

**Enforces:** [P5AcyclicRule](rules.md#p5acyclicrule)
**Queries:** [isCodegenDependency](queries.md#iscodegendependency)

---

## aggregateOverall

**Performs on:** List [PredicateReport](domain.md#predicatereport) → [Grade](domain.md#grade)

Combines per-predicate grades into the overall grade by worst-component rule: `fail` if any predicate grades `fail`; `warn` if any grades `warn` and none `fail`; `pass` only when all predicates grade `pass`. Pure function, no I/O.

**Calculates:** [Grade](domain.md#grade)
