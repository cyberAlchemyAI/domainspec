---
tags: [lean-code-validator, workflows, grading-pipeline]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Workflows: lean-code-validator

---

## GradingPipeline

**Orchestrates:** [gradeFor](operations.md#gradefor), [gradeP1Closure](operations.md#gradep1closure), [gradeP3Obligations](operations.md#gradep3obligations), [gradeP4Ambiguity](operations.md#gradep4ambiguity), [gradeP5Acyclic](operations.md#gradep5acyclic), [aggregateOverall](operations.md#aggregateoverall)

The end-to-end sequence from a raw L1 markdown spec to an emitted [CodegenReadinessReport](domain.md#codegenreadinessreport). Spans two systems: the external `audit_richness.py` pipeline (parse + emit), and the Lean grading pipeline (load + grade + aggregate).

**Steps:**

1. **Parse** (`audit_richness.py`) — [MarkdownToSpec](mappings.md#markdowntospec): extract concepts, edges, provenance, unresolved refs, profile frontmatter from the L1 markdown spec.
2. **Emit** (`audit_richness.py`) — [SpecToLean](mappings.md#spectolean): serialize the parsed representation as a Lean `Spec` instantiation in a `.lean` file.
3. **Resolve profile** (Lean) — read `spec.profile`; if absent, default to `paperBaseline`.
4. **Grade P1** (Lean) — [gradeP1Closure](operations.md#gradep1closure): check schema closure.
5. **Grade P2** (Lean compile) — structural; fires at Lean type-check time via [EdgeRow](domain.md#edgerow) `wellTyped` proof.
6. **Grade P3** (Lean) — [gradeP3Obligations](operations.md#gradep3obligations): check per-meta-type obligations.
7. **Grade P4** (Lean) — [gradeP4Ambiguity](operations.md#gradep4ambiguity): enumerate M6 witnesses.
8. **Grade P5** (Lean) — [gradeP5Acyclic](operations.md#gradep5acyclic): check codegen-dependency DAG.
9. **Aggregate** (Lean) — [aggregateOverall](operations.md#aggregateoverall): worst-component grade.
10. **Emit report** (Lean) — `#eval gradeFor spec` prints the [CodegenReadinessReport](domain.md#codegenreadinessreport); [ReportEmitted](events.md#reportemitted) fires logically.

**Invariant:** the workflow always completes. No step short-circuits or rejects the spec.
