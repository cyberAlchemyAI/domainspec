# TASK-AEO-C1-05 - Stage Chaining and Handoff

## Goal

Extend single-stage execution to an ordered stage-subset chain (for example `plan -> spec -> tests`) with deterministic handoff between stages.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-10 (UTC)
- Output artifacts:
  - [operations.md](../../operations.md)
  - [workflows.md](../../workflows.md)
  - [rules.md](../../rules.md)
  - [TEST-SPEC.md](../../TEST-SPEC.md)
  - [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)

## Prerequisite

- [TASK-AEO-C1-04.md](TASK-AEO-C1-04.md)

## Capability Slice

| Contract Area | Required Subset                                                                     |
| ------------- | ----------------------------------------------------------------------------------- |
| Chaining      | Selected stage subset executes in declared order                                    |
| Handoff       | Stage N outputs mapped as stage N+1 required inputs                                 |
| Session state | Snapshot/handoff references and stage execution records are captured for continuity |

## DomainSpec Coverage

| Source                                                              | Coverage IDs                     |
| ------------------------------------------------------------------- | -------------------------------- |
| [domain.md](../../domain.md#sessionsnapshot)                        | SessionSnapshot                  |
| [domain.md](../../domain.md#stageexecution)                         | StageExecution                   |
| [workflows.md](../../workflows.md#featurelifecyclepipelineworkflow) | FeatureLifecyclePipelineWorkflow |
| [operations.md](../../operations.md#resumeexecutionrun)             | ResumeExecutionRun               |
| [rules.md](../../rules.md#stageselectioncontract)                   | StageSelectionContract           |

## Implementation Directives

- Define handoff contract fields between consecutive stages.
- Define one stage-subset execution scenario (minimum three ordered stages) with expected handoff artifact references.
- Define mismatch behavior when stage N outputs cannot satisfy stage N+1 requirements.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- [x] Stage-subset chain contract is documented.
- [x] Handoff evidence fields are explicit.
- [x] Mismatch path includes deterministic failure classification.

## Evidence References

- Handoff fields and chained scenario: [Stage-Subset Chaining and Handoff Scenario (C1-05)](../../operations.md#stage-subset-chaining-and-handoff-scenario-c1-05)
- Workflow chain and expected handoff refs: [Ordered Stage-Subset Chaining Scenario (C1-05)](../../workflows.md#ordered-stage-subset-chaining-scenario-c1-05)
- Mismatch terminal classification and remediation: [StageHandoffMismatchClassification](../../rules.md#stagehandoffmismatchclassification)
- Test obligation anchor: [AEO-BE-OP-047](../../TEST-SPEC.md#operation-obligations)

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-05.md`
- `rg -n "selectedStages|handoffArtifactRefsByStagePair|STAGE_HANDOFF|SessionSnapshot|StageExecution|resume|stage" docs/features/agent-execution-orchestrator/{domain.md,workflows.md,operations.md,rules.md,TEST-SPEC.md}`

### Latest Verification Run (2026-05-10 UTC)

- Link checks: PASS (`OK: all markdown links resolve`) for this task file.
- Targeted search evidence: PASS (matches found across `domain.md`, `workflows.md`, `operations.md`, `rules.md`, and `TEST-SPEC.md` for `selectedStages`, `handoffArtifactRefsByStagePair`, `STAGE_HANDOFF`, `SessionSnapshot`, `StageExecution`, and resume/stage clauses).
- Cross-artifact link sweep: PASS (`OK: all markdown links resolve`) for `operations.md`, `workflows.md`, `rules.md`, `TEST-SPEC.md`, and `work-pack/context/capability-sequence-lessons.md`.
