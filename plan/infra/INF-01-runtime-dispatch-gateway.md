# INF-01 - Runtime Dispatch Gateway (Local, VPS, Cloud)

## Objective

Ensure every user input is executed by an agent runtime adapter and returns a typed implementation output, with minimal profile as the default operating mode and durable orchestration as an explicit promoted profile.

## Problem

Execution paths vary by environment and are not normalized, which makes governance and observability inconsistent.

## Scope

- In scope:
  - Minimal profile default path for deterministic local-first execution.
  - Runtime adapter contract for local, VPS, and cloud execution.
  - Request routing, retries, timeout policy, and typed output envelope.
  - Output classes: task, decision, metric, implemented code.
- Out of scope:
  - Full durable orchestration rollout before promotion-gate evidence.
  - Provider-specific billing optimization.
  - Non-implementation sandbox research.

## Dependencies

- [INF-02-agent-telemetry-saturn.md](INF-02-agent-telemetry-saturn.md)
- [../agentic/AGT-01-orchestrator-interface.md](../agentic/AGT-01-orchestrator-interface.md)

## Execution Session Decisions (2026-04-29)

1. Adapter contract model: one shared runtime adapter interface with target-specific implementations.
2. Routing policy: deterministic target order with health-aware fallback.
3. Retry strategy: class-based retryability with idempotency key enforcement.
4. Timeout model: explicit timeout tiers (`fast`, `standard`, `extended`) carried by request envelope.
5. Output envelope policy: versioned typed output envelope for task, decision, metric, and implemented code outputs.
6. Profile policy: minimal profile default with trigger-gated promoted profile for durability.

Trade-off summary:

- A unified adapter contract increases implementation consistency, with moderate adapter implementation overhead.
- Deterministic fallback order improves auditability and predictability, with less dynamic optimization flexibility.
- Class-based retries and idempotency reduce duplicate side effects, with additional envelope/state validation requirements.

## Gate Handling Outcome

- Gate verdict for this session: PASS (design and contract scope).
- Dependency interpretation: INF-02 contract artifacts are available for integration; AGT-01 remains a downstream integration dependency and does not block INF-01 contract definition.
- Follow-up rule: runtime integration in implementation code must consume INF-02 telemetry fields and AGT-01 routing context before marking runtime criteria complete.

## Implementation Tasks

1. Define runtime adapter interface and common request envelope.
2. Add adapters for local process, VPS service, and cloud endpoint.
3. Add execution policy: retries, idempotency key, timeout tiers.
4. Define typed output schema and validation.
5. Add runtime health checks and fallback order.

## Deliverables

- Runtime adapter specification: [INF-01-runtime-adapter-spec.md](INF-01-runtime-adapter-spec.md)
- Dispatch, retry, and timeout policy: [INF-01-dispatch-policy.md](INF-01-dispatch-policy.md)
- Output envelope schema and validator contract: [INF-01-output-envelope-schema.md](INF-01-output-envelope-schema.md)
- Health checks and fallback order policy: [INF-01-health-fallback-policy.md](INF-01-health-fallback-policy.md)

## Done Criteria

- [ ] All inputs are routed through one runtime gateway.
- [ ] Outputs are emitted in typed envelopes.
- [ ] Failed runtime calls are retryable with traceable state.

Session status:

- Contract and policy deliverables are defined in this session.
- Runtime integration evidence is pending implementation-path adoption.
