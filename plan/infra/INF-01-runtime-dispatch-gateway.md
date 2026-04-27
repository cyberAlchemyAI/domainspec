# INF-01 - Runtime Dispatch Gateway (Local, VPS, Cloud)

## Objective

Ensure every user input is executed by an agent runtime adapter and returns a typed implementation output.

## Problem

Execution paths vary by environment and are not normalized, which makes governance and observability inconsistent.

## Scope

- In scope:
  - Runtime adapter contract for local, VPS, and cloud execution.
  - Request routing, retries, timeout policy, and typed output envelope.
  - Output classes: task, decision, metric, implemented code.
- Out of scope:
  - Provider-specific billing optimization.
  - Non-implementation sandbox research.

## Dependencies

- [INF-02-agent-telemetry-saturn.md](INF-02-agent-telemetry-saturn.md)
- [../agentic/AGT-01-orchestrator-interface.md](../agentic/AGT-01-orchestrator-interface.md)

## Implementation Tasks

1. Define runtime adapter interface and common request envelope.
2. Add adapters for local process, VPS service, and cloud endpoint.
3. Add execution policy: retries, idempotency key, timeout tiers.
4. Define typed output schema and validation.
5. Add runtime health checks and fallback order.

## Deliverables

- Runtime adapter specification.
- Adapter integration layer.
- Output schema and validators.
- Fallback and timeout policy.

## Done Criteria

- [ ] All inputs are routed through one runtime gateway.
- [ ] Outputs are emitted in typed envelopes.
- [ ] Failed runtime calls are retryable with traceable state.
