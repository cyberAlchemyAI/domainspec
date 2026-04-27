# CTX-03 - Initiatives, Visions, and Execution Tracker

## Objective

Track implementation initiatives, visions, and active workstreams with status, ownership, and evidence links.

## Problem

Execution context is fragmented across docs and pipelines, making it hard to see what is being pursued and why.

## Scope

- In scope:
  - Tracker model for initiative, vision, and execution item.
  - Status lifecycle and ownership fields.
  - Evidence links to decisions, tasks, metrics, and code outputs.
- Out of scope:
  - Research registry maintenance.
  - Paper submission tracking.

## Dependencies

- [../harness/HAR-03-owner-task-board.md](../harness/HAR-03-owner-task-board.md)
- [../harness/HAR-05-org-metrics-dashboard.md](../harness/HAR-05-org-metrics-dashboard.md)

## Implementation Tasks

1. Define initiative schema and status lifecycle.
2. Add fields for owner role, target outcomes, and governance constraints.
3. Add relationship mapping between initiative and implementation tasks.
4. Add evidence links for decisions, telemetry snapshots, and delivered outputs.
5. Add a periodic review process for stale initiatives.

## Deliverables

- Initiative tracker schema.
- Lifecycle status policy.
- Relationship model between initiative and task.
- Review cadence protocol.

## Done Criteria

- [ ] Every active initiative has owner, status, target metrics, and linked tasks.
- [ ] Stale initiatives are detected and flagged automatically.
- [ ] Owner can inspect vision -> initiative -> output chain without manual aggregation.
