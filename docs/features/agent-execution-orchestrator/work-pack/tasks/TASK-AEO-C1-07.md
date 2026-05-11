# TASK-AEO-C1-07 - Capability Gate Run and Lessons Export

## Goal

Execute the Capability 1 gate and publish reusable lessons for planning Capability 2+ tasks.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-11 (UTC)
- Stage run id: `170df857-61a7-441a-94e6-3c43c8b06f15`
- Gate evidence sync: revalidated after C1-06 recovery/supersession contract refresh.
- Output artifacts:
  - [TASK-AEO-C1-07.md](./TASK-AEO-C1-07.md)
  - [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)
  - [W4.md](../waves/W4.md)
  - [WORK-PACK.md](../../WORK-PACK.md)

## Prerequisite

- [TASK-AEO-C1-06.md](TASK-AEO-C1-06.md)

## Capability Slice

| Contract Area | Required Subset                                                       |
| ------------- | --------------------------------------------------------------------- |
| Gate run      | End-to-end selected stage-subset execution capability demo            |
| Evidence      | Full standard envelope references for parent run and stage executions |
| Feed-forward  | At least three lessons recorded for next capability task design       |

## DomainSpec Coverage

| Source                                                                          | Coverage IDs                          |
| ------------------------------------------------------------------------------- | ------------------------------------- |
| [observability.md](../../observability.md#standard-evidence-envelope-checklist) | TelemetryEnvelope, RunArtifactMapping |
| [domain.md](../../domain.md#stageexecution)                                     | StageExecution                        |
| [rules.md](../../rules.md#stageselectioncontract)                               | StageSelectionContract                |
| [TEST-SPEC.md](../../TEST-SPEC.md#coverage-summary)                             | Coverage Summary                      |
| [STORIES.md](../../STORIES.md#story-coverage-matrix)                            | Story Coverage Matrix                 |

## Implementation Directives

- Run the capability gate scenario defined in [CAP-AEO-C1-PIPELINE-EXECUTION.md](../capabilities/CAP-AEO-C1-PIPELINE-EXECUTION.md).
- Produce one concise capability verdict: pass, flag, or block.
- Include route selection evidence (`selectionPolicy`, `selectedStages`) and stage execution order evidence in the gate bundle.
- Append at least three non-duplicate lesson entries to [capability-sequence-lessons.md](../context/capability-sequence-lessons.md).
- Draft the reusable task template constraints for Capability 2+ based on recorded lessons.

## Completion Criteria

- [x] Capability gate run has auditable evidence references.
- [x] Capability gate run includes parent run and stage execution references.
- [x] Verdict includes remediation items for all flags/blocks.
- [x] Lessons file satisfies promotion rule for next capability planning.

## Capability Gate Verdict

| Item              | Value                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gate scenario     | [Capability Gate Demo (Definition of Done)](../capabilities/CAP-AEO-C1-PIPELINE-EXECUTION.md#capability-gate-demo-definition-of-done)                     |
| Verdict           | `pass`                                                                                                                                                    |
| Concise rationale | Route selection evidence is explicit, stage execution order evidence is explicit, and envelope mapping references are complete for parent/stage outcomes. |
| Remediation       | none                                                                                                                                                      |

## Gate Evidence Bundle

### Route Selection Evidence

| Field             | Evidence                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectionPolicy` | `stage-subset` from [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05)        |
| `selectedStages`  | `[plan, spec, tests]` from [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05) |

### Stage Execution Order Evidence

| order | stage   | stageRunId             | Reference                                                                                                                  |
| ----- | ------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 0     | `plan`  | `aeo-c1-05-plan-0001`  | [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05) |
| 1     | `spec`  | `aeo-c1-05-spec-0001`  | [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05) |
| 2     | `tests` | `aeo-c1-05-tests-0001` | [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05) |

### Parent/Stage Reference Bundle

| Contract element                       | Evidence reference                                                                                                                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent run reference                   | `runId=aeo-c1-05-parent-0001` in [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05)                                                                             |
| Ordered stage execution records        | `stageExecutions[0..2]` with matching `stageRunId` + `order` in [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05)                                              |
| Parent terminal mapping                | `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome` in [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05)                                  |
| Standard envelope checklist            | [Standard Evidence Envelope Checklist](../../observability.md#standard-evidence-envelope-checklist), [RunArtifactMapping](../../observability.md#runartifactmapping), [TerminalOutcomeRequired](../../rules.md#terminaloutcomerequired) |
| Stage-order workflow invariant         | [Ordered Stage-Subset Chaining Scenario (C1-05)](../../workflows.md#ordered-stage-subset-chaining-scenario-c1-05), [RunStateMachine](../../rules.md#runstatemachine)                                                                    |
| Capability 2+ feed-forward constraints | [Capability 2+ Task Template Constraints (Draft)](../context/capability-sequence-lessons.md#capability-2-task-template-constraints-draft)                                                                                               |

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-07.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/context/capability-sequence-lessons.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/waves/W4.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/WORK-PACK.md`
- `rg -n "selectionPolicy|selectedStages|stageExecutions|order|stageRunId|pass|flag|block|Capability 2\+ Task Template Constraints" docs/features/agent-execution-orchestrator/{operations.md,workflows.md,rules.md,work-pack/tasks/TASK-AEO-C1-07.md,work-pack/context/capability-sequence-lessons.md}`

### Latest Verification Run (2026-05-11 UTC)

- Link checks: PASS for `TASK-AEO-C1-07.md`, `capability-sequence-lessons.md`, `W4.md`, and `WORK-PACK.md`.
- Targeted search evidence: PASS for route selection (`selectionPolicy`, `selectedStages`), ordered stage execution evidence (`stageExecutions`, `order`, `stageRunId`), verdict token (`pass|flag|block`), and Capability 2+ template constraints.
