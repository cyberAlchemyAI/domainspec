# CAP-AEO-C2 - Governance Telemetry and Signal Emission Capability Pilot

## Intent

Define the second value-driven capability task sequence for Agent Execution Orchestrator.

This capability extends the C1 execution baseline by enforcing deterministic telemetry envelope completeness and governance signal emission semantics over one canonical selected-stage scenario.

## Capability Outcome

Given the canonical selected-stage scenario (`plan -> spec -> tests`), the system can:

1. bind route-selection evidence (`selectionPolicy`, ordered `selectedStages`) to one canonical scenario,
2. preserve ordered stage execution evidence (`order`, `stage`, `stageRunId`) across the run,
3. publish parent mapping evidence (`terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`),
4. enforce standard envelope completeness (`started` + terminal telemetry row, transcript ref, decision snapshot ref),
5. emit deterministic governance signals linked to the same parent/stage evidence set.

## Capability Gate Demo (Definition of Done)

A single controlled parent run for the canonical selected-stage scenario demonstrates deterministic telemetry + governance output:

`selectionPolicy/selectedStages -> stage execution order table -> telemetry pair coverage -> parent terminal mapping -> governance signal rows -> gate verdict`

Required evidence bundle:

- route selection evidence (`selectionPolicy`, `selectedStages`),
- ordered stage execution evidence (`order`, `stage`, `stageRunId`),
- parent run reference,
- parent terminal mapping references,
- telemetry `started` row references,
- telemetry terminal row references,
- transcript excerpt reference,
- decision snapshot reference,
- governance signal row references,
- single verdict token (`pass`, `flag`, or `block`) and remediation only when non-pass.

## Sequential Enablement Rules

- Each task unlocks one next behavior only.
- No task can depend on more than two immediate predecessors.
- A task is complete only when its completion check is executable and documented.
- Before execution of each not-started task, run the decision preflight from [grill-with-docs-interviewer-inventory.md](../context/grill-with-docs-interviewer-inventory.md).
- Apply [Capability 2+ Task Template Constraints (Draft)](../context/capability-sequence-lessons.md#capability-2-task-template-constraints-draft) to every C2 task (`C2-TPL-01` through `C2-TPL-06`).
- Promotion gate is satisfied before C2 task creation: non-duplicate lessons with executable evidence exist in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md#capability-1-entries).
- Every completed task appends one lesson entry to [capability-sequence-lessons.md](../context/capability-sequence-lessons.md).

## Task Sequence (Capability 2)

| Order | Task                                            | Enables                                                  |
| ----- | ----------------------------------------------- | -------------------------------------------------------- |
| 1     | [TASK-AEO-C2-01.md](../tasks/TASK-AEO-C2-01.md) | Canonical scenario + C2 evidence template lock           |
| 2     | [TASK-AEO-C2-02.md](../tasks/TASK-AEO-C2-02.md) | Ordered telemetry pair mapping contract                  |
| 3     | [TASK-AEO-C2-03.md](../tasks/TASK-AEO-C2-03.md) | Resume continuity and compaction evidence mapping        |
| 4     | [TASK-AEO-C2-04.md](../tasks/TASK-AEO-C2-04.md) | Governance signal emission linkage contract              |
| 5     | [TASK-AEO-C2-05.md](../tasks/TASK-AEO-C2-05.md) | Capability gate verdict and feed-forward lessons for C3+ |

## Feed-Forward Contract For Remaining Capabilities

When Capability 2 completes:

1. extract telemetry/signal anti-patterns and successful constraints from [capability-sequence-lessons.md](../context/capability-sequence-lessons.md),
2. update reusable task template constraints for C3+,
3. apply template updates with only capability-specific differences.

## Related Feature Aspects

- [SPEC.md](../../SPEC.md#governance-telemetry-and-signal-emission)
- [observability.md](../../observability.md)
- [operations.md](../../operations.md)
- [rules.md](../../rules.md)
- [workflows.md](../../workflows.md)
- [interfaces.md](../../interfaces.md)
