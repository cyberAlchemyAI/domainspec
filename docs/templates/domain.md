# Domain: {Feature Name}

<!-- Structural concepts: Entities, Value Objects, Enums/Types.
     Each entity should link to its state machine (if any) and operations that act on it. -->
<!-- Linking rule: every referenced concept/type/field name must be a markdown link.
     Local concepts: [ConceptName](#conceptname)
     Cross-file concepts: [OperationName](operations.md#operationname-lowercase)
     Field refs: [EntityName](domain.md#entityname).fieldName -->

## Entities

### {EntityName}

<!-- Description: what this entity represents and its business purpose -->

| Field | Type     | Required | Description       |
| ----- | -------- | -------- | ----------------- |
| id    | [{IdType}](#idtype-lowercase) | yes      | Unique identifier |
|       |          |          |                   |

**Lifecycle:** See [{StateMachineName}](states.md#{statemachinename-lowercase})
**Operations:** [{OperationName}](operations.md#{operationname-lowercase})

---

## Value Objects

### {ValueObjectName}

<!-- If shared across features: **Shared:** [docs/shared/{name}.md](../../shared/{name}.md) -->

| Field | Type | Constraint |
| ----- | ---- | ---------- |
|       |      |            |

**Equality:** <!-- How two instances are compared for equality -->

---

## Enums

### {EnumName}

| Value | Description |
| ----- | ----------- |
|       |             |
