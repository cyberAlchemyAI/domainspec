# HAR-03 - Project-Owner Prioritized Task Board

## Objective

Implement the central task interface showing prioritized implementation tasks and decisions based on active context objectives.

## Problem

Project owners need a dynamic, objective-driven queue that explains why each task matters now.

## Scope

- In scope:
  - Prioritized list of tasks, decisions, and governance actions.
  - Priority explanations and tradeoff summaries.
  - Timeline and role impact overlays.
- Out of scope:
  - Generic backlog views without objective linkage.

## Dependencies

- [../context/CTX-01-context-objective-prioritization.md](../context/CTX-01-context-objective-prioritization.md)
- [HAR-02-role-workspace-views.md](HAR-02-role-workspace-views.md)

## Implementation Tasks

1. Define task card schema with objective and metric linkage.
2. Add priority scoring integration and rationale display.
3. Add role impact and timeline impact fields.
4. Add decision-type task templates for governance tradeoffs.
5. Add review and re-prioritization controls for owners.

## Deliverables

- Task board data schema.
- Prioritized board UI.
- Rationale and tradeoff panels.
- Reprioritization workflow.

## Done Criteria

- [ ] Board always presents objective-prioritized queue.
- [ ] Every top task includes tradeoff and direction rationale.
- [ ] Owner can reprioritize with full audit trail.
