# Use Case: {UseCaseName}

<!-- Implementation-facing template that maps DomainSpec Operation/Query/Workflow to an executable application function. -->
<!-- Linking rule: every referenced concept/type/field name must be a markdown link.
  Use [ConceptName](relative-file.md#conceptname) and [EntityName](domain.md#entityname).fieldName formats. -->

## Metadata

| Field             | Value                                     |
| ----------------- | ----------------------------------------- |
| Kind              | `Operation` / `Query` / `Workflow`        |
| Source Concept ID | `{feature}.{ConceptName}`                 |
| Layer             | Application                               |
| Public API        | `export function make{UseCaseName}(deps)` |
| Output Function   | `async function {useCaseName}(input)`     |

## Purpose

Describe the business intent and expected outcome.

## Inputs

| Field | Type | Required | Source                             |
| ----- | ---- | -------- | ---------------------------------- |
|       |      | yes/no   | API / Event / Scheduler / Internal |

## Output

| Field | Type | Description |
| ----- | ---- | ----------- |
|       |      |             |

## Dependencies (Ports)

| Port       | Type Signature | Why Needed |
| ---------- | -------------- | ---------- |
| Repository |                |            |
| Gateway    |                |            |
| Event Bus  |                |            |

## Business Rules

| Rule ID | Rule | Enforcement Point   |
| ------- | ---- | ------------------- |
|         |      | before/after step X |

## Calculations

| Calc ID | Formula / Function | Used At |
| ------- | ------------------ | ------- |
|         |                    |         |

## State Effects

| Entity | From | To  | Condition |
| ------ | ---- | --- | --------- |
|        |      |     |           |

## Events Emitted

| Event | When | Payload Notes |
| ----- | ---- | ------------- |
|       |      |               |

## Error Mapping

| Condition | Error Type | Code | Retryable |
| --------- | ---------- | ---- | --------- |
|           |            |      | yes/no    |

## Workflow Steps (only for Kind=Workflow)

| #   | Step | Action Function | Compensation |
| --- | ---- | --------------- | ------------ |
| 1   |      |                 |              |

## Pseudocode

```typescript
export function make{UseCaseName}(deps: Deps) {
  return async function {useCaseName}(input: Input): Promise<Output> {
    // 1) Validate rules
    // 2) Perform calculations
    // 3) Execute transitions / side effects
    // 4) Persist through ports
    // 5) Emit events
    // 6) Return result
  }
}
```

## Verification Checklist

- [ ] All input validation rules enforced.
- [ ] All referenced calculations applied.
- [ ] State transitions match `states.md`.
- [ ] Events match `events.md` definitions.
- [ ] Query has no side effects.
- [ ] Workflow compensation path defined (if applicable).
- [ ] Errors mapped to documented codes.
