# CTX-01 - Context-Objective Prioritization Model

## Objective

Define how implementation tasks are prioritized by current project objectives and governance signals.

## Problem

Task lists become static and role-neutral, causing weak alignment between what is urgent now and what should be done first by project owners.

## Scope

- In scope:
  - Objective registry for the current project context.
  - Priority scoring for task, decision, and governance work.
  - Explicit tradeoff notes per prioritized item.
- Out of scope:
  - Experiment protocol ranking.
  - Paper narrative prioritization.

## Dependencies

- [../infra/INF-02-agent-telemetry-saturn.md](../infra/INF-02-agent-telemetry-saturn.md)
- [../harness/HAR-03-owner-task-board.md](../harness/HAR-03-owner-task-board.md)

## Implementation Tasks

1. Define objective model with fields: objective_id, horizon, owner_role, target_metrics, blockers.
2. Define scoring formula for urgency, impact, dependency pressure, and governance risk.
3. Add decision card format with explicit tradeoffs and timeline implications.
4. Implement periodic reprioritization trigger based on metric deltas.
5. Publish prioritization explainability notes for each top-10 task.

## Deliverables

- Objective schema document.
- Priority scoring module specification.
- Decision tradeoff template.
- Reprioritization trigger policy.

## Done Criteria

- [ ] Every active task has a priority score and rationale.
- [ ] Top-priority order changes when context objectives change.
- [ ] Owner can explain why a task is above another in one sentence.
