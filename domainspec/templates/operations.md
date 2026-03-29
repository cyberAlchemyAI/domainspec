# Operations: {Feature Name}

<!-- Behavioral concepts: Operations (mutations) with their rules, calculations,
     pre/postconditions, state transitions, and error states.
     Each operation is a business action that changes state. -->

## {OperationName}

**Type:** Operation (mutation)
**Actor:** <!-- Who triggers this: Authenticated User, System, Scheduler, etc. -->
**Triggers:** <!-- What causes this to happen: user action, event, schedule -->

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| | | | |

### Rules

<!-- Business constraints that must hold. Each rule maps to 1+ validation tests. -->

| ID | Rule | Formal |
|----|------|--------|
| R1 | | `<!-- formal expression -->` |

### Calculations

<!-- Derived values computed during the operation. Each maps to correctness tests. -->

| ID | Calculation | Formula |
|----|------------|---------|
| C1 | | `<!-- formula -->` |

### State Transition

`{Entity}: {FromState} → {ToState}`

### Postconditions

<!-- Guaranteed results after successful execution. Each maps to an assertion test. -->

- <!-- postcondition 1 -->
- <!-- postcondition 2 -->

### Error States

<!-- What happens when rules are violated or external calls fail. Each maps to a negative test. -->

| Condition | Result |
|-----------|--------|
| | |
