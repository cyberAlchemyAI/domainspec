# CAP-AEO-C1 - Pipeline Execution Capability Pilot

## Intent

Define the first value-driven capability task sequence for Agent Execution Orchestrator.

This pilot treats each task as a minimal working unit that unlocks exactly one new executable behavior. The sequence is complete only when the capability gate demo runs end-to-end with deterministic evidence.

## Capability Outcome

Given a deterministic stage contract, the system can:

1. compose an ordered stage subset route (for example `plan -> spec -> tests`),
2. build valid prompt artifacts for each selected stage,
3. execute selected stages under one parent run with stage execution records,
4. capture per-stage terminal outcomes and parent run terminal state,
5. emit complete evidence envelopes for every executed stage.

## Capability Gate Demo (Definition of Done)

A single controlled parent run executes an ordered stage subset through the full flow:

`selectedStages -> stage prompt builder -> parent run stage executions -> per-stage terminal outcomes -> telemetry pairs -> evidence envelopes`

Required evidence bundle:

- route selection evidence (`selectionPolicy`, `selectedStages`),
- parent run reference,
- stage execution record references,
- prompt artifact reference,
- runner output reference,
- telemetry `started` row reference,
- telemetry terminal row reference,
- decision snapshot reference,
- transcript excerpt reference.

When a stage uses isolated execution mode, include parent-child run linkage evidence.

## Sequential Enablement Rules

- Each task unlocks one next behavior only.
- No task can depend on more than two immediate predecessors.
- A task is complete only when its completion check is executable and documented.
- Before execution of each not-started task, run the decision preflight from [grill-with-docs-interviewer-inventory.md](../context/grill-with-docs-interviewer-inventory.md).
- Every completed task appends one lesson entry to [capability-sequence-lessons.md](../context/capability-sequence-lessons.md).

## Task Sequence (Capability 1)

| Order | Task                                            | Enables                                                    |
| ----- | ----------------------------------------------- | ---------------------------------------------------------- |
| 1     | [TASK-AEO-C1-01.md](../tasks/TASK-AEO-C1-01.md) | Prompt contract baseline                                   |
| 2     | [TASK-AEO-C1-02.md](../tasks/TASK-AEO-C1-02.md) | Deterministic prompt builder for selected stage sets       |
| 3     | [TASK-AEO-C1-03.md](../tasks/TASK-AEO-C1-03.md) | Parent-run and stage-execution runner contract             |
| 4     | [TASK-AEO-C1-04.md](../tasks/TASK-AEO-C1-04.md) | Single selected-stage execution in parent run              |
| 5     | [TASK-AEO-C1-05.md](../tasks/TASK-AEO-C1-05.md) | Ordered stage-subset chaining and handoff                  |
| 6     | [TASK-AEO-C1-06.md](../tasks/TASK-AEO-C1-06.md) | Failure handling, retry, supersession, and stage isolation |
| 7     | [TASK-AEO-C1-07.md](../tasks/TASK-AEO-C1-07.md) | Capability gate and lessons export                         |

## Feed-Forward Contract For Remaining Capabilities

When Capability 1 completes:

1. extract anti-patterns and successful constraints from [capability-sequence-lessons.md](../context/capability-sequence-lessons.md),
2. convert them into a reusable task template,
3. apply the template to Capability 2+ with only capability-specific differences.

## Related Feature Aspects

- [SPEC.md](../../SPEC.md#capabilities)
- [operations.md](../../operations.md)
- [interfaces.md](../../interfaces.md)
- [rules.md](../../rules.md)
- [workflows.md](../../workflows.md)
- [observability.md](../../observability.md)
