# INF-02 - Agent Telemetry for Saturn L-System Metrics and Costs

## Objective

Instrument agent execution with cost and governance telemetry required for Saturn L-system visibility.

## Problem

Metrics are partially available but not unified per invocation across runtimes and roles.

## Scope

- In scope:
  - Invocation-level telemetry schema.
  - Cost, latency, error, governance, and role metrics.
  - Aggregation for organizational dashboards.
- Out of scope:
  - Non-implementation analytics dashboards.

## Dependencies

- [INF-01-runtime-dispatch-gateway.md](INF-01-runtime-dispatch-gateway.md)
- [INF-03-ci-governance-loop.md](INF-03-ci-governance-loop.md)

## Implementation Tasks

1. Define telemetry schema for span, event, and summary records.
2. Map existing metrics to Saturn dimensions and close field gaps.
3. Add emitters at runtime gateway and orchestrator boundaries.
4. Add aggregation jobs for per-role and per-objective metrics.
5. Define dashboard contracts for project owners and governance owners.

## Deliverables

- Telemetry schema document.
- Instrumentation integration plan.
- Aggregation definitions.
- Dashboard field contract.

## Done Criteria

- [ ] Every agent invocation emits telemetry with stable schema.
- [ ] Cost and governance metrics are visible by role and objective.
- [ ] Missing metric fields are identified and closed.
