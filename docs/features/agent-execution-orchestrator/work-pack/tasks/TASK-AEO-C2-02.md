# TASK-AEO-C2-02 - Ordered Telemetry Pair Mapping

## Goal

Define deterministic telemetry pair mapping for each ordered stage execution in the canonical selected-stage scenario.

## Wave Assignment

- Primary wave: W5

## Status

not-started

## Prerequisite

- [TASK-AEO-C2-01.md](TASK-AEO-C2-01.md)

## Capability Slice

| Contract Area          | Required Subset                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| Telemetry pair         | Exactly one `started` row and one terminal row per `stageRunId`                                       |
| Ordered stage evidence | Telemetry rows preserve stage execution order fields (`order`, `stage`, `stageRunId`)                 |
| Parent mapping         | Stage terminal rows map into `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome` |

## DomainSpec Coverage

| Source                                                        | Coverage IDs                          |
| ------------------------------------------------------------- | ------------------------------------- |
| [observability.md](../../observability.md#runartifactmapping) | RunArtifactMapping, TelemetryEnvelope |
| [rules.md](../../rules.md#telemetrypairrequired)              | TelemetryPairRequired                 |
| [rules.md](../../rules.md#terminaloutcomerequired)            | TerminalOutcomeRequired               |
| [operations.md](../../operations.md#executepipelineroute)     | ExecutePipelineRoute                  |
| [domain.md](../../domain.md#stageexecution)                   | StageExecution                        |

## Implementation Directives

- Bind telemetry pair requirements to the canonical selected-stage scenario defined in [TASK-AEO-C2-01.md](TASK-AEO-C2-01.md).
- Define deterministic mapping from ordered `stageExecutions` rows to telemetry pair rows for each `stageRunId`.
- Define missing-telemetry classification as `blocked` until envelope completeness is restored.
- Ensure terminal telemetry rows carry parent mapping fields required by C2 template constraints.
- Keep transcript and decision snapshot references aligned with the same stage execution order proof.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- Telemetry pair mapping is explicit for every stage in the canonical scenario.
- Missing/partial telemetry classification is deterministic and documented.
- Parent mapping fields are traceable from telemetry rows to run-level terminal outcomes.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C2-02.md`
- `rg -n "RunArtifactMapping|TelemetryPairRequired|TerminalOutcomeRequired|terminalOutcomeByStageRunId|parentRunState|parentTerminalOutcome|started" docs/features/agent-execution-orchestrator/{observability.md,rules.md,operations.md,domain.md}`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                       |
| ----------- | -------- | -------- | -------------------------------------------------------------------------- |
| D-AEO-003   | yes      | selected | Standard envelope requires complete telemetry pairs per ordered stage      |
| D-AEO-004   | yes      | selected | Terminal mappings must remain compatible with latest-run-wins supersession |
