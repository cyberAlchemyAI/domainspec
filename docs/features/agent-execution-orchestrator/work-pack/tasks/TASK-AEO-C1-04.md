# TASK-AEO-C1-04 - Single Selected-Stage Execution in Parent Run

## Goal

Run one selected stage through the full capability slice in a parent run: prompt builder output into stage execution with a terminal outcome.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-10 (UTC)
- Output artifacts:
  - [workflows.md](../../workflows.md)
  - [operations.md](../../operations.md)
  - [TEST-SPEC.md](../../TEST-SPEC.md)
  - [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)

## Prerequisite

- [TASK-AEO-C1-03.md](TASK-AEO-C1-03.md)

## Capability Slice

| Contract Area | Required Subset                                                                             |
| ------------- | ------------------------------------------------------------------------------------------- |
| Flow          | `selected stage -> prompt artifact -> parent run stage execution -> stage terminal outcome` |
| Evidence      | Prompt reference, stage execution record reference, and stage outcome classification        |
| Determinism   | Re-run of same controlled input does not change stage outcome class                         |

## DomainSpec Coverage

| Source                                                              | Coverage IDs                     |
| ------------------------------------------------------------------- | -------------------------------- |
| [workflows.md](../../workflows.md#featurelifecyclepipelineworkflow) | FeatureLifecyclePipelineWorkflow |
| [operations.md](../../operations.md#executepipelineroute)           | ExecutePipelineRoute             |
| [domain.md](../../domain.md#stageexecution)                         | StageExecution                   |
| [rules.md](../../rules.md#runstatemachine)                          | RunStateMachine                  |

## Implementation Directives

- Define one controlled single selected-stage scenario (`selectionPolicy=stage-subset`) in feature docs.
- Capture expected terminal outcomes and error boundaries.
- Add one test-spec obligation for this single-stage execution path.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- [x] Single-stage scenario is fully documented and executable.
- [x] Terminal outcome mapping is explicit for stage execution and parent run state progression.
- [x] Evidence references are listed for prompt, stage execution, and run outputs.

## Evidence References

- Prompt reference: [Controlled Single Selected-Stage Parent-Run Scenario (C1-04)](../../operations.md#controlled-single-selected-stage-parent-run-scenario-c1-04)
- Stage execution record reference: [Controlled Single Selected-Stage Parent-Run Scenario (C1-04)](../../operations.md#controlled-single-selected-stage-parent-run-scenario-c1-04), [StageExecution](../../domain.md#stageexecution)
- Run output classification reference: [Controlled Single Selected-Stage Parent-Run Scenario (C1-04)](../../operations.md#controlled-single-selected-stage-parent-run-scenario-c1-04), [Controlled Single Selected-Stage Scenario (C1-04)](../../workflows.md#controlled-single-selected-stage-scenario-c1-04)

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-04.md`
- `rg -n "selectionPolicy=stage-subset|single selected-stage|StageExecution|terminal outcome|ExecutePipelineRoute|FeatureLifecyclePipelineWorkflow" docs/features/agent-execution-orchestrator/{domain.md,workflows.md,operations.md,TEST-SPEC.md}`

### Latest Verification Run (2026-05-10 UTC)

- Link checks: PASS (`OK: all markdown links resolve`) for this task file.
- Targeted search evidence: PASS (matches found across `domain.md`, `workflows.md`, `operations.md`, and `TEST-SPEC.md` for `selectionPolicy=stage-subset`, single selected-stage scenario clauses, `StageExecution`, terminal outcome mappings, `ExecutePipelineRoute`, and `FeatureLifecyclePipelineWorkflow`).
