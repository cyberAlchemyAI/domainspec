# CTX-01 Prioritization Specification

## Objective Profile

- profile_id: saturn-l-adlc-convergence
- planning_mode: kanban
- deadline_weighting: disabled
- primary_goal: converge ADLC and complete first Saturn L-system implementation in a real project
- secondary_goal: establish reusable DomainSpec agent-system execution model
- deferred_focus: harness-heavy work that does not unlock Saturn or ADLC convergence

## Objective Schema

| Field                     | Type          | Required | Description                                                     |
| ------------------------- | ------------- | -------- | --------------------------------------------------------------- |
| objective_id              | string        | yes      | Unique objective identifier.                                    |
| objective_name            | string        | yes      | Human-readable objective title.                                 |
| objective_profile         | enum          | yes      | `saturn-l-adlc-convergence` for this cycle.                     |
| owner_role                | enum          | yes      | Owner role accountable for prioritization decisions.            |
| kanban_lane               | enum          | yes      | `backlog`, `ready`, `in-progress`, `blocked`, `review`, `done`. |
| saturn_l_impact           | integer (0-5) | yes      | Expected contribution to Saturn L-system convergence.           |
| adlc_convergence_impact   | integer (0-5) | yes      | Expected contribution to ADLC gap/task closure.                 |
| dependency_unlock         | integer (0-5) | yes      | Degree of downstream unblock value.                             |
| governance_risk_reduction | integer (0-5) | yes      | Reduction of governance and merge risk.                         |
| implementation_readiness  | integer (0-5) | yes      | Current readiness to execute without rework.                    |
| blocker_count             | integer       | yes      | Number of unresolved blockers.                                  |
| blockers                  | list          | yes      | Blockers with id, type, owner, and status.                      |
| rationale                 | string        | yes      | One-sentence explanation for current priority rank.             |
| evidence_links            | list          | yes      | Supporting links to docs, decisions, metrics, or checks.        |

## Priority Scoring Module

### Base Formula

PriorityScore =
(saturn_l_impact x 0.35) +
(adlc_convergence_impact x 0.30) +
(dependency_unlock x 0.20) +
(governance_risk_reduction x 0.10) +
(implementation_readiness x 0.05) -
harness_only_penalty

Where:

- harness_only_penalty = 0.40 when a task is primarily harness-facing and does not unlock Saturn or ADLC convergence.
- all score dimensions use a 0-5 integer scale.

### Overrides (Hard Rules)

1. Saturn-critical override:
   - If task is Saturn-critical and not blocker-constrained, set class to P0.
2. Blocker override:
   - If blocker_count > 0 and blocker severity is high/critical, status becomes blocked regardless of score.
3. Dependency-first rule:
   - If target task is blocked by a dependency, run dependency unblock task first, then return to original task.

## Decision Trade-off Card Template

Use this template when selecting among implementation options:

| Field                   | Description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Decision ID             | Stable identifier for audit traceability.                                           |
| Decision Question       | The exact choice being made.                                                        |
| Option                  | Candidate option label.                                                             |
| Entails                 | What implementation work the option requires.                                       |
| Short-term Consequences | Immediate effects in delivery speed/quality/risk.                                   |
| Long-term Consequences  | Maintainability, scalability, governance, and adaptation impact.                    |
| Trade-offs              | Explicit pros and cons across speed, complexity, risk, governance, and maintenance. |
| Recommended?            | yes/no with objective rationale.                                                    |
| Selected Option         | Final chosen option.                                                                |
| Selection Rationale     | Why this option was chosen for current objective profile.                           |

## Reprioritization Trigger Policy

### Baseline Cadence

- Weekly full recalculation of active queue scores.

### Event Triggers

Trigger immediate reprioritization when one or more occur:

1. Dependency state change (blocked -> ready or ready -> blocked).
2. Governance gate state change from validator outcomes.
3. Saturn or ADLC metric delta greater than or equal to 15 percent.
4. New critical objective insertion or existing objective profile change.

### Cooldown Rule

- A task cannot change more than one priority band inside 24 hours unless a critical governance or Saturn blocker event occurs.

## Evidence and Integration Notes

- This specification operationalizes CTX-01 for a Kanban process with no deadline weighting.
- Explainability output for this cycle is published in `CTX-01-priority-notes-cycle-001.md`.
