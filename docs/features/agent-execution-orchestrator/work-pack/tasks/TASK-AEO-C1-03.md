# TASK-AEO-C1-03 - Runner Execution Contract

## Goal

Define the minimal runner contract that executes selected stages under one parent run and returns deterministic per-stage and parent-run outcomes.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-10 (UTC)
- Output artifacts:
  - [operations.md](../../operations.md)
  - [domain.md](../../domain.md)
  - [rules.md](../../rules.md)
  - [interfaces.md](../../interfaces.md)
  - [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)

## Prerequisites

- [TASK-AEO-C1-01.md](TASK-AEO-C1-01.md)
- [TASK-AEO-C1-02.md](TASK-AEO-C1-02.md)

## Capability Slice

| Contract Area | Required Subset                                                                               |
| ------------- | --------------------------------------------------------------------------------------------- |
| Runner input  | Parent run context, ordered stage prompt artifacts, and execution profile                     |
| Runner output | Stage execution outcomes plus parent run terminal state                                       |
| Guarding      | Guard/watchdog boundaries and isolation-mode execution (`shared-run` vs `isolated-child-run`) |

## DomainSpec Coverage

| Source                                                                 | Coverage IDs             |
| ---------------------------------------------------------------------- | ------------------------ |
| [operations.md](../../operations.md#executepipelineroute)              | ExecutePipelineRoute     |
| [domain.md](../../domain.md#stageexecution)                            | StageExecution           |
| [domain.md](../../domain.md#stageisolationmode)                        | StageIsolationMode       |
| [rules.md](../../rules.md#terminaloutcomerequired)                     | TerminalOutcomeRequired  |
| [rules.md](../../rules.md#watchdogtimeoutrule)                         | WatchdogTimeoutRule      |
| [rules.md](../../rules.md#stageruntopology)                            | StageRunTopology         |
| [interfaces.md](../../interfaces.md#internal-sandboxproviderinterface) | SandboxProviderInterface |

## Implementation Directives

- Define runner input/output contract and error taxonomy.
- Define timeout and stuck detection semantics aligned with watchdog rules.
- Define how runner updates stage execution records and reports terminal outcomes even when recovered from interruption.
- Define isolated-stage child-run linkage requirements and parent-run reconciliation behavior.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- [x] Runner contract includes stage-level and parent-run terminal outcome mapping.
- [x] Watchdog and recovery boundaries are explicit.
- [x] Error taxonomy includes at least one blocked and one failed path with stage execution context.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-03.md`
- `rg -n "StageExecution|StageIsolationMode|parentRunId|terminal outcome|watchdog|blocked|failed|canceled" docs/features/agent-execution-orchestrator/{domain.md,operations.md,rules.md,interfaces.md}`

### Latest Verification Run (2026-05-10 UTC)

- Link checks: PASS (`OK: all markdown links resolve`) for this task file and edited C1-03 contract artifacts.
- Targeted search evidence: PASS (matches found across `domain.md`, `operations.md`, `rules.md`, and `interfaces.md` for `StageExecution`, `StageIsolationMode`, `parentRunId`, watchdog boundaries, and blocked/failed/canceled terminal outcomes).
