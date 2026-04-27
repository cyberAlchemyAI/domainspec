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

## Execution Session Decisions (2026-04-27)

1. Horizon model: hybrid rolling Kanban horizon with milestone checkpoints (no fixed deadline weighting in base scoring).
2. Scoring model: hybrid weighted score with blocker overrides, optimized for Saturn L-system convergence and ADLC closure.
3. Reprioritization trigger: hybrid weekly baseline plus event thresholds and cooldown.
4. Explainability format: dedicated markdown notes per cycle.
5. Dependency mode: dependency-first unblock policy. If a dependency blocks execution, clear the blocker first, then resume the original task.

Trade-off summary:

- This maximizes convergence on Saturn and ADLC goals, but requires stronger governance thresholds and periodic score calibration.
- Weekly plus event-driven reprioritization improves responsiveness while reducing queue thrashing through cooldown.
- Dedicated markdown explainability improves auditability, with moderate manual documentation overhead.

## Gate Handling Outcome

- Gate verdict for this session: PASS.
- Dependency interpretation: INF-02 and HAR-03 are integration dependencies for operational rollout, not blockers for defining the CTX-01 prioritization model artifacts.
- Follow-up rule: when a downstream execution task is blocked by unresolved dependencies, run dependency-first unblock flow and then return to the original task.

## Implementation Tasks

1. Define objective model with fields: objective_id, horizon, owner_role, target_metrics, blockers.
2. Define scoring formula for urgency, impact, dependency pressure, and governance risk.
3. Add decision card format with explicit tradeoffs and timeline implications.
4. Implement periodic reprioritization trigger based on metric deltas.
5. Publish prioritization explainability notes for each top-10 task.

## Deliverables

- Objective schema document: [CTX-01-prioritization-spec.md](CTX-01-prioritization-spec.md)
- Priority scoring module specification: [CTX-01-prioritization-spec.md](CTX-01-prioritization-spec.md)
- Decision tradeoff template: [CTX-01-prioritization-spec.md](CTX-01-prioritization-spec.md)
- Reprioritization trigger policy: [CTX-01-prioritization-spec.md](CTX-01-prioritization-spec.md)
- Explainability notes for current top-10 cycle: [CTX-01-priority-notes-cycle-001.md](CTX-01-priority-notes-cycle-001.md)

## Done Criteria

- [x] Every active task in the current cycle scope has a priority score and rationale.
- [x] Top-priority order changes when context objectives change (documented via scenario comparison in cycle notes).
- [x] Owner can explain why a task is above another in one sentence (pairwise explanations published in cycle notes).
