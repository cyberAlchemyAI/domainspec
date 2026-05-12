# TASK-AEO-C2-05 - Capability Gate Run and Lessons Export

## Goal

Execute the Capability 2 gate and publish reusable lessons for Capability 3+ planning.

## Wave Assignment

- Primary wave: W5

## Status

not-started

## Prerequisite

- [TASK-AEO-C2-04.md](TASK-AEO-C2-04.md)

## Capability Slice

| Contract Area | Required Subset                                                                 |
| ------------- | ------------------------------------------------------------------------------- |
| Gate run      | End-to-end canonical selected-stage scenario with telemetry and signal evidence |
| Evidence      | Full standard envelope references plus governance signal linkage                |
| Feed-forward  | At least three non-duplicate Capability 2 lessons for C3+ planning              |

## DomainSpec Coverage

| Source                                                                                                                           | Coverage IDs                          |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [CAP-AEO-C2-GOVERNANCE-TELEMETRY.md](../capabilities/CAP-AEO-C2-GOVERNANCE-TELEMETRY.md#capability-gate-demo-definition-of-done) | Capability gate contract              |
| [rules.md](../../rules.md#stageselectioncontract)                                                                                | StageSelectionContract                |
| [domain.md](../../domain.md#stageexecution)                                                                                      | StageExecution                        |
| [observability.md](../../observability.md#runartifactmapping)                                                                    | RunArtifactMapping, TelemetryEnvelope |
| [observability.md](../../observability.md#governancesignalemission)                                                              | GovernanceSignalEmission              |

## Implementation Directives

- Run the capability gate scenario defined in [CAP-AEO-C2-GOVERNANCE-TELEMETRY.md](../capabilities/CAP-AEO-C2-GOVERNANCE-TELEMETRY.md).
- Produce one concise capability verdict token: `pass`, `flag`, or `block`.
- Include route selection evidence (`selectionPolicy`, `selectedStages`) and ordered stage execution evidence (`order`, `stage`, `stageRunId`).
- Include parent mapping evidence (`terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`) and full standard envelope references.
- Include governance signal evidence rows linked to the same canonical scenario and parent/stage references.
- Append at least three non-duplicate Capability 2 lesson entries to [capability-sequence-lessons.md](../context/capability-sequence-lessons.md).

## Completion Criteria

- Capability gate run has auditable evidence references.
- Gate verdict is a single token with remediation only when non-pass.
- Lessons file satisfies promotion rule for next capability planning.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C2-05.md`
- `rg -n "selectionPolicy|selectedStages|stageRunId|terminalOutcomeByStageRunId|parentRunState|parentTerminalOutcome|pass|flag|block|GovernanceSignalEmission" docs/features/agent-execution-orchestrator/{operations.md,rules.md,domain.md,observability.md,work-pack/tasks/TASK-AEO-C2-05.md}`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                              |
| ----------- | -------- | -------- | ----------------------------------------------------------------- |
| D-AEO-003   | yes      | selected | Gate completion requires standard evidence envelope completeness  |
| D-AEO-004   | yes      | selected | Gate lineage must preserve latest-run-wins cancellation semantics |
