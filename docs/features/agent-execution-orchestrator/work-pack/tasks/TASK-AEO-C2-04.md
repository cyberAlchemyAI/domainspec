# TASK-AEO-C2-04 - Governance Signal Emission Linkage

## Goal

Define deterministic governance signal emission mappings that are traceable to the same canonical parent/stage evidence bundle used for telemetry completion.

## Wave Assignment

- Primary wave: W5

## Status

not-started

## Prerequisite

- [TASK-AEO-C2-03.md](TASK-AEO-C2-03.md)

## Capability Slice

| Contract Area     | Required Subset                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Signal linkage    | Governance signals reference canonical `stageRunId` and parent run evidence                      |
| Signal scope      | Contract-gap, evidence-gap, and decision signals are classified with deterministic criteria      |
| Envelope coupling | Signal rows are emitted only after required telemetry pair and envelope references are available |

## DomainSpec Coverage

| Source                                                                | Coverage IDs             |
| --------------------------------------------------------------------- | ------------------------ |
| [operations.md](../../operations.md#emitgovernancesignals)            | EmitGovernanceSignals    |
| [observability.md](../../observability.md#governancesignalemission)   | GovernanceSignalEmission |
| [domain.md](../../domain.md#governancesignaltype)                     | GovernanceSignalType     |
| [interfaces.md](../../interfaces.md#internal-signalobserverinterface) | SignalObserverInterface  |
| [rules.md](../../rules.md#telemetrypairrequired)                      | TelemetryPairRequired    |

## Implementation Directives

- Define signal payload linkage fields that bind each signal row to canonical `selectionPolicy`, `selectedStages`, and `stageRunId` evidence.
- Define deterministic classification rules for `contract-gap`, `evidence-gap`, and decision signal emissions in Capability 2 scope.
- Require terminal telemetry pair references before signal emission can pass completion checks.
- Keep docs-only versus mutation-capable closure behavior consistent with [WORK-PACK.md](../../WORK-PACK.md#closure-strategy-obligations).
- Ensure signal rows remain observer-compatible and append-only.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- Signal linkage contract is explicit and traceable to canonical stage evidence fields.
- Signal type classification rules are deterministic and auditable.
- Closure-strategy compatibility is maintained for docs-only and mutation-capable slices.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C2-04.md`
- `rg -n "EmitGovernanceSignals|GovernanceSignalEmission|GovernanceSignalType|SignalObserverInterface|contract-gap|evidence-gap|decision" docs/features/agent-execution-orchestrator/{operations.md,observability.md,domain.md,interfaces.md,WORK-PACK.md}`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                              |
| ----------- | -------- | -------- | ----------------------------------------------------------------- |
| D-AEO-003   | yes      | selected | Signal emission depends on standard envelope completeness         |
| D-AEO-004   | yes      | selected | Supersession behavior must remain deterministic in signal lineage |
