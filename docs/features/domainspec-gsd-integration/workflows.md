# Workflows: DomainSpec-GSD Integration

## DelegatedExecutionWorkflow

**Type:** Workflow
**Triggers:** Feature implementation in `gsd-phase` mode
**Orchestrates:** PlanPhaseBridge, ExecutePhaseBridge, VerifyPhaseBridge
**Compensation Strategy:** stop-and-flag on semantic conflict
**Idempotency:** conditional (depends on delegated phase command semantics)

### Steps

1. Read DomainSpec semantic artifacts.
2. Build bridge context and select `gsd-phase` mode.
3. Delegate planning orchestration and collect plan artifacts.
4. Delegate execution orchestration and collect execution summaries.
5. Normalize verification evidence and run DomainSpec verdict.
6. Return PASS, FLAG, or BLOCK with traceable remediation.

## AuthorityPolicy

**Type:** Policy
**Applies To:** All delegated operations

### Decision Table

| Condition                                 | Selected Behavior                         | Notes                                 |
| ----------------------------------------- | ----------------------------------------- | ------------------------------------- |
| DomainSpec and GSD outputs agree          | Continue                                  | Standard delegated flow               |
| GSD output conflicts with DomainSpec rule | DomainSpec wins; stop and flag            | Requires docs or execution correction |
| GSD artifacts incomplete                  | Flag and request rerun or native fallback | Prevents unverifiable completion      |

### Configuration Parameters

| Parameter                    | Type   | Default       | Description                         |
| ---------------------------- | ------ | ------------- | ----------------------------------- |
| defaultMode                  | string | native        | Default orchestration path          |
| delegatedComplexityThreshold | string | medium        | Minimum complexity to auto-delegate |
| conflictHandling             | string | stop-and-flag | Behavior on semantic mismatch       |
