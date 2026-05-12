# TASK-AEO-C2-03 - Resume Continuity and Compaction Evidence

## Goal

Define deterministic resume and compaction continuity evidence so resumed stages preserve canonical scenario lineage and envelope completeness.

## Wave Assignment

- Primary wave: W5

## Status

not-started

## Prerequisite

- [TASK-AEO-C2-02.md](TASK-AEO-C2-02.md)

## Capability Slice

| Contract Area      | Required Subset                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Resume continuity  | [SessionSnapshot](../../domain.md#sessionsnapshot) linkage across interrupted and resumed stage executions   |
| Compaction lineage | Parent-child or resumed-stage lineage is explicit in decision snapshot references                            |
| Evidence handoff   | Transcript excerpt and continuity summary references are bound to the same canonical selected-stage scenario |

## DomainSpec Coverage

| Source                                                           | Coverage IDs                          |
| ---------------------------------------------------------------- | ------------------------------------- |
| [operations.md](../../operations.md#resumeexecutionrun)          | ResumeExecutionRun                    |
| [domain.md](../../domain.md#sessionsnapshot)                     | SessionSnapshot                       |
| [workflows.md](../../workflows.md#latestrunwinsrecoveryworkflow) | LatestRunWinsRecoveryWorkflow         |
| [observability.md](../../observability.md#runartifactmapping)    | RunArtifactMapping, TelemetryEnvelope |
| [rules.md](../../rules.md#runstatemachine)                       | RunStateMachine                       |

## Implementation Directives

- Add resume-path evidence requirements anchored to the canonical selected-stage scenario from [TASK-AEO-C2-01.md](TASK-AEO-C2-01.md).
- Require resumed stages to retain ordered stage execution evidence fields (`order`, `stage`, `stageRunId`) and parent mapping references.
- Require continuity summary and transcript references for resumed/compacted stages.
- Require decision snapshot references that preserve lineage between original and resumed stage executions.
- Classify missing continuity evidence as `blocked` and topology mismatch as `failed`.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- Resume continuity contract is explicit and linked to `SessionSnapshot` semantics.
- Compaction/resume lineage requirements are documented with deterministic failure classes.
- Canonical scenario evidence remains intact across resume branches.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C2-03.md`
- `rg -n "ResumeExecutionRun|SessionSnapshot|resum|compaction|lineage|transcript|decision snapshot|RunStateMachine" docs/features/agent-execution-orchestrator/{operations.md,domain.md,workflows.md,observability.md,rules.md}`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                     |
| ----------- | -------- | -------- | ------------------------------------------------------------------------ |
| D-AEO-003   | yes      | selected | Resume/compaction branches must still satisfy standard envelope evidence |
| D-AEO-004   | yes      | selected | Supersession semantics remain latest-run-wins during resumed execution   |
