---
tags: [lean-code-validator, events]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Events: lean-code-validator

---

## ReportEmitted

**Emitted by:** [gradeFor](operations.md#gradefor)

Logical event signaling that a [CodegenReadinessReport](domain.md#codegenreadinessreport) was produced for a [Spec](domain.md#spec). In v3 this may not need first-class Lean representation — the grader is a pure function and the "event" is implicit in the return value. Becomes a real named event if v3 integrates with `domainspec-readiness-gate` (D9 pending). See A2 in [`INITIAL-DEFINITIONS.md`](../discovery/INITIAL-DEFINITIONS.md).

| Field | Type | Description |
|---|---|---|
| specProfile | [Profile](domain.md#profile) | Profile under which the report was graded. |
| overallGrade | [Grade](domain.md#grade) | The overall grade of the emitted report. |
