# TASK-AEO-C1-06 - Failure Handling, Retry, and Supersession

## Goal

Make the pipeline execution capability resilient by defining minimal recovery behavior for failure, retry, superseded-run cancellation, and isolated-stage reconciliation.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-11 (UTC)
- Stage run id: `c6dc62fd-d2bb-4e5d-83dc-59067969c3d3`
- Output artifacts:
  - [operations.md](../../operations.md)
  - [workflows.md](../../workflows.md)
  - [TEST-SPEC.md](../../TEST-SPEC.md)
  - [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)

## Prerequisite

- [TASK-AEO-C1-05.md](TASK-AEO-C1-05.md)

## Capability Slice

| Contract Area | Required Subset                                                    |
| ------------- | ------------------------------------------------------------------ |
| Retry         | Bounded retry semantics with narrowed scope                        |
| Supersession  | `latest-run-wins` cancellation path for superseded runs            |
| Recovery      | Stuck/recovery branch with terminal outcome guarantee              |
| Isolation     | `isolated-child-run` stage behavior with parent-run reconciliation |

## DomainSpec Coverage

| Source                                                           | Coverage IDs                  |
| ---------------------------------------------------------------- | ----------------------------- |
| [rules.md](../../rules.md#retrypolicy)                           | RetryPolicy                   |
| [rules.md](../../rules.md#cancellationpolicy)                    | CancellationPolicy            |
| [workflows.md](../../workflows.md#latestrunwinsrecoveryworkflow) | LatestRunWinsRecoveryWorkflow |
| [rules.md](../../rules.md#terminaloutcomerequired)               | TerminalOutcomeRequired       |
| [rules.md](../../rules.md#stageruntopology)                      | StageRunTopology              |
| [domain.md](../../domain.md#stageisolationmode)                  | StageIsolationMode            |

## Implementation Directives

- Define one forced-failure scenario with bounded retry behavior.
- Define supersession scenario proving `latest-run-wins` cancellation semantics.
- Define terminal-outcome guarantees for recovery branches.
- Define one isolated-stage failure scenario where child-run outcome is reconciled into parent stage execution record.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- [x] Retry and cancellation flows are explicitly documented.
- [x] Recovery path maps to terminal outcomes deterministically.
- [x] One scenario each exists for retry, supersession, and isolated-stage reconciliation.

## Evidence References

- Forced-failure bounded retry branch: [Failure, Retry, Supersession, and Isolated Reconciliation Scenario (C1-06)](../../operations.md#failure-retry-supersession-and-isolated-reconciliation-scenario-c1-06)
- Supersession latest-run-wins cancellation branch: [Failure, Retry, Supersession, and Isolated Reconciliation Scenario (C1-06)](../../operations.md#failure-retry-supersession-and-isolated-reconciliation-scenario-c1-06), [CancelSupersededRun](../../operations.md#cancelsupersededrun)
- Recovery branch terminal-outcome guarantees: [Recovery Branch Scenario (C1-06)](../../workflows.md#recovery-branch-scenario-c1-06), [TerminalOutcomeRequired](../../rules.md#terminaloutcomerequired)
- Isolated child-run failure reconciliation: [Failure, Retry, Supersession, and Isolated Reconciliation Scenario (C1-06)](../../operations.md#failure-retry-supersession-and-isolated-reconciliation-scenario-c1-06), [StageRunTopology](../../rules.md#stageruntopology), [StageIsolationMode](../../domain.md#stageisolationmode)
- Test obligation anchors: [Operation Obligations](../../TEST-SPEC.md#operation-obligations), [Rules and Workflow Obligations](../../TEST-SPEC.md#rules-and-workflow-obligations)

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-06.md`
- `rg -n "C1-06|RETRY_BUDGET_EXHAUSTED|latest-run-wins|canceled|isolated-child-run|childRunId|terminalOutcomeByStageRunId|I-RW-5|I-RW-6|AEO-BE-OP-048|AEO-BE-OP-051|AEO-BE-WF-004|AEO-BE-RULE-027" docs/features/agent-execution-orchestrator/{operations.md,workflows.md,rules.md,TEST-SPEC.md}`
- `for f in docs/features/agent-execution-orchestrator/operations.md docs/features/agent-execution-orchestrator/workflows.md docs/features/agent-execution-orchestrator/TEST-SPEC.md docs/features/agent-execution-orchestrator/work-pack/context/capability-sequence-lessons.md; do bash tools/check_markdown_links.sh "$f"; done`

### Latest Verification Run (2026-05-11 UTC)

- Link checks: PASS (`OK: all markdown links resolve`) for this task file.
- Targeted search evidence: PASS (matches found across `operations.md`, `workflows.md`, `rules.md`, and `TEST-SPEC.md` for C1-06 retry/supersession/recovery/isolation clauses and new test IDs).
- Cross-artifact link sweep: PASS (`OK: all markdown links resolve`) for `operations.md`, `workflows.md`, `TEST-SPEC.md`, and `work-pack/context/capability-sequence-lessons.md` (executed as per-file checks).
