# Feature Concept Graph Template

Use this section in feature specifications when relationships must be explicit and machine-validated.

## Feature Concept Graph

| From                 | Edge           | To                   | Evidence                 | Notes          |
| -------------------- | -------------- | -------------------- | ------------------------ | -------------- |
| feature-a.ConceptA   | queries        | feature-a.EntityA    | queries.md#getquerya     | optional notes |
| feature-a.OperationA | produces       | feature-a.EventA     | operations.md#operationa | optional notes |
| feature-a.RuleA      | enforces       | feature-a.OperationA | operations.md#operationa | optional notes |
| feature-a.EventA     | triggers-cross | feature-b.OperationB | events.md#eventa         | cross-feature  |

## Authoring Rules

1. Use only canonical edge values defined in RELATIONSHIPS.md.
2. Use concept IDs that exist in the current feature Concept Registry or a referenced external feature.
3. Keep one relationship per row. Do not combine multiple targets in one cell.
4. Set Evidence to an anchor that shows where this relationship is declared or verified.
5. For cross-feature relationships, keep fully qualified concept IDs (for example feature-b.OperationB).

## Validation Targets

- Edge vocabulary check against RELATIONSHIPS.md.
- Endpoint existence check for From and To IDs in SPEC concept tables.
- Duplicate row detection for (From, Edge, To).
- Optional evidence-link existence check.
