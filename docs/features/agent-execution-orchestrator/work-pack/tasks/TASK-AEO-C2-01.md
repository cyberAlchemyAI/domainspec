# TASK-AEO-C2-01 - Canonical Scenario and Evidence Template Lock

## Goal

Define the canonical selected-stage scenario and bind Capability 2 execution to reusable C2 template constraints before telemetry and signal mutation tasks start.

## Wave Assignment

- Primary wave: W5

## Status

not-started

## Prerequisite

- [TASK-AEO-C1-07.md](TASK-AEO-C1-07.md)

## Capability Slice

| Contract Area            | Required Subset                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Canonical scenario       | Locked subset `plan -> spec -> tests` (`selectionPolicy=stage-subset`, ordered `selectedStages=[plan,spec,tests]`) |
| Ordered execution proof  | Required fields: `order`, `stage`, `stageRunId`                                                                    |
| Parent/evidence baseline | Required fields: `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`, envelope refs           |

## DomainSpec Coverage

| Source                                                                                                                   | Coverage IDs                          |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| [rules.md](../../rules.md#stageselectioncontract)                                                                        | StageSelectionContract                |
| [domain.md](../../domain.md#stageexecution)                                                                              | StageExecution                        |
| [operations.md](../../operations.md#executepipelineroute)                                                                | ExecutePipelineRoute                  |
| [observability.md](../../observability.md#runartifactmapping)                                                            | RunArtifactMapping, TelemetryEnvelope |
| [capability-sequence-lessons.md](../context/capability-sequence-lessons.md#capability-2-task-template-constraints-draft) | C2-TPL-01..C2-TPL-07                  |

## Implementation Directives

- Lock one canonical selected-stage scenario for Capability 2 gate evidence to the reused C1-05 subset (`selectionPolicy=stage-subset`, `selectedStages=[plan,spec,tests]`).
- Require route selection evidence fields (`selectionPolicy`, `selectedStages`) for all downstream C2 tasks.
- Require ordered stage execution evidence fields (`order`, `stage`, `stageRunId`) for all downstream C2 tasks.
- Require parent mapping evidence fields (`terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`) for all downstream C2 tasks.
- Require standard envelope references (`started` + terminal telemetry pair, transcript ref, decision snapshot ref) before completion can pass.
- Preserve single verdict token requirement (`pass`, `flag`, or `block`) for capability gate outputs.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Interrogation Decision Snapshot

### Decision Snapshot: D-AEO-C2-005

- Question: Which canonical selected-stage scenario should be locked for Capability 2 telemetry mapping?
- Selected answer: Reuse C1-05 subset `plan -> spec -> tests`.
- Rejected alternatives: `implementation` single-stage only; define a new subset.
- Rationale: Reusing the proven C1-05 ordered subset maximizes stage-order and parent-mapping evidence coverage while avoiding pre-mapping scenario drift.
- Evidence links: [workflows.md](../../workflows.md#ordered-stage-subset-chaining-scenario-c1-05), [WORK-PACK.md](../../WORK-PACK.md#task-status-board-current-slice), [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)
- Patch targets: [TASK-AEO-C2-01.md](TASK-AEO-C2-01.md), [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)
- Residual risk: Low; branch-specific scenarios can still be added after canonical C2 telemetry mapping is stabilized.
- Owner: operators-maintainers
- Timestamp: 2026-05-16

## Completion Criteria

- Canonical selected-stage scenario is documented and linked from C2 artifacts.
- C2 template constraints are explicitly mapped to this capability sequence.
- Promotion rule evidence remains traceable to non-duplicate Capability 1 lessons.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C2-01.md`
- `rg -n "C2-TPL-0[1-7]|Promotion Rule|selectionPolicy|selectedStages|stageRunId|parentRunState|parentTerminalOutcome" docs/features/agent-execution-orchestrator/work-pack/context/capability-sequence-lessons.md docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C2-01.md`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID  | Required | Status   | Note                                                                                              |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------- |
| D-AEO-003    | yes      | selected | Standard evidence envelope is mandatory for C2 completion checks                                  |
| D-AEO-004    | yes      | selected | Canonical scenario mapping must preserve latest-run-wins terminal lineage                         |
| D-AEO-C2-005 | yes      | selected | Canonical selected-stage scenario is locked to `plan -> spec -> tests` by interrogation preflight |
