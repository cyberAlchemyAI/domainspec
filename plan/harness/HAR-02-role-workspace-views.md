# HAR-02 - Role-Based Harness Workspace Views

## Objective

Provide role-aware workspace modes for PO, stakeholder, QA, and dev while preserving shared source-of-truth context.

## Problem

Different roles need different detail and controls, but they must collaborate on the same mapped reality.

## Scope

- In scope:
  - Role-specific default layouts and lenses.
  - Shared object references across role views.
  - Role transition and handoff support.
- Out of scope:
  - Separate disconnected role tools.

## Dependencies

- [HAR-01-domain-graph-chain-explorer.md](HAR-01-domain-graph-chain-explorer.md)
- [HAR-03-owner-task-board.md](HAR-03-owner-task-board.md)

## Implementation Tasks

1. Define role capabilities and required data views.
2. Implement role lens presets and navigation shortcuts.
3. Add handoff markers between role stages.
4. Add cross-role comments linked to graph objects and tasks.
5. Validate role views with representative workflows.

## Deliverables

- Role lens specification.
- Workspace view presets.
- Handoff and collaboration model.
- Validation checklist.

## Done Criteria

- [ ] PO, stakeholder, QA, and dev each have tailored workspace mode.
- [ ] Handoffs are explicit and traceable.
- [ ] Role view differences do not create contradictory state.
