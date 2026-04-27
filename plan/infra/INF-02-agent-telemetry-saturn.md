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

## Execution Session Decisions (2026-04-27)

1. Cycle resolution: contract-first INF-02 execution to break INF-01 <-> INF-02 dependency cycle.
2. Schema granularity: balanced core schema plus governance facets.
3. Emitter boundaries: runtime gateway is mandatory, plus tool-usage and agent-decision workflow events.
4. Aggregation cadence: 5-minute window plus daily rollup.
5. Completion policy: mark design deliverables complete and keep runtime implementation criteria open.

Trade-off summary:

- Contract-first unblocks INF-01 and INF-03 integration with low coordination delay, but final completion still depends on runtime adoption.
- Balanced schema provides strong governance visibility without exhaustive high-cardinality overhead.
- Adding tool and decision workflow events improves explainability, with moderate instrumentation cost.

## Gate Handling Outcome

- Gate verdict for this session: PASS (design and contract scope).
- Dependency handling: INF-01 and INF-03 consume INF-02 contract artifacts; runtime integration remains downstream.

## Implementation Tasks

1. Define telemetry schema for span, event, and summary records.
2. Map existing metrics to Saturn dimensions and close field gaps.
3. Add emitters at runtime gateway and orchestrator boundaries.
4. Add aggregation jobs for per-role and per-objective metrics.
5. Define dashboard contracts for project owners and governance owners.

## Deliverables

- Telemetry schema document: [INF-02-telemetry-schema.md](INF-02-telemetry-schema.md)
- Instrumentation integration plan: [INF-02-instrumentation-integration-plan.md](INF-02-instrumentation-integration-plan.md)
- Aggregation definitions: [INF-02-aggregation-definitions.md](INF-02-aggregation-definitions.md)
- Dashboard field contract: [INF-02-dashboard-field-contract.md](INF-02-dashboard-field-contract.md)

## Done Criteria

- [ ] Every agent invocation emits telemetry with stable schema.
- [ ] Cost and governance metrics are visible by role and objective.
- [ ] Missing metric fields are identified and closed.

Session status:

- Design deliverables are complete in this session.
- Runtime integration and evidence capture are pending INF-01 and INF-03 execution.
