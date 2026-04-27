# HAR-05 - Organizational Metrics Cockpit

## Objective

Display system metrics relevant to each user role and organizational context directly inside the harness.

## Problem

Metrics exist but are hard to consume in context, reducing decision quality and governance responsiveness.

## Scope

- In scope:
  - Role-aware metric sets.
  - Context filters by initiative, objective, and workflow stage.
  - Decision support indicators linked to task board items.
- Out of scope:
  - Research analytics dashboards.

## Dependencies

- [../infra/INF-02-agent-telemetry-saturn.md](../infra/INF-02-agent-telemetry-saturn.md)
- [HAR-03-owner-task-board.md](HAR-03-owner-task-board.md)

## Implementation Tasks

1. Define metric views for PO, stakeholder, QA, and dev.
2. Add context filters for objective, initiative, and timeframe.
3. Add decision indicators linked to task board priorities.
4. Add alerting for metric drift requiring governance action.
5. Add export for governance review records.

## Deliverables

- Role metric catalog.
- Metrics cockpit UI.
- Drift and alerting policy.
- Governance export format.

## Done Criteria

- [ ] Each role sees a focused metric set with context controls.
- [ ] Metrics are linked to active tasks and decisions.
- [ ] Drift alerts are actionable and traceable.
