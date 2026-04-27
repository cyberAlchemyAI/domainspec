# HAR-01 - Interactive Domain Graph and Transformation Chain

## Objective

Create a graph interface where selecting any object displays full relationship chain and transformation flow across workflows.

## Problem

Domain knowledge transfer fails when users cannot see how an object evolves across operations, events, and state transitions.

## Scope

- In scope:
  - Click-to-trace graph interaction.
  - Relationship chain panel.
  - Transformation timeline across workflow stages.
- Out of scope:
  - Static diagram export as the primary experience.

## Dependencies

- [../infra/INF-01-runtime-dispatch-gateway.md](../infra/INF-01-runtime-dispatch-gateway.md)
- [HAR-05-org-metrics-dashboard.md](HAR-05-org-metrics-dashboard.md)

## Implementation Tasks

1. Define graph data contract from concepts, relationships, and workflows.
2. Implement click behavior returning full inbound and outbound chain.
3. Implement transformation timeline visualization per selected object.
4. Add filters by bounded context, role, and lifecycle stage.
5. Add deep-link support for shared investigation sessions.

## Deliverables

- Graph data contract.
- Interactive graph UI.
- Chain and transformation panels.
- Filter and deep-link features.

## Done Criteria

- [ ] User can click an object and see full chain in one view.
- [ ] Transformation sequence is readable end-to-end.
- [ ] Role filters do not break chain integrity.
