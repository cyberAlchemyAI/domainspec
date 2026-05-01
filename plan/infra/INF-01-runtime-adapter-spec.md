# INF-01 Runtime Adapter Specification

## Purpose

Define a shared adapter contract for runtime execution targets: local process, VPS service, and cloud endpoint, with an optional durability boundary that stays decoupled from harness-core contracts.

## Runtime Adapter Interface

```text
interface RuntimeAdapter {
  execute(request: RuntimeRequestEnvelope): RuntimeResponseEnvelope
  health(check: HealthCheckRequest): HealthCheckResult
  capabilities(): AdapterCapabilities
}
```

## Durability Boundary (Optional)

Minimal profile requires a noop durability adapter by default.

```text
interface DurabilityAdapter {
  enabled(): boolean
  schedule(request: RuntimeRequestEnvelope): DurableHandle
  resume(handle_id: string): RuntimeResponseEnvelope
}
```

Durability policy notes:

- minimal profile behavior: `NoopDurabilityAdapter` is required and `enabled()` returns `false`.
- promoted profile behavior: a durability adapter implementation (for example Temporal-backed) may be provided when promotion gates are passed.
- contract rule: harness-core request/response contracts must remain durability-engine agnostic.
- prohibition: harness foundation modules and INF-01 request/response envelope definitions must not import or reference Temporal SDK symbols.

## Runtime Request Envelope

| Field                     | Type             | Required | Description                                                     |
| ------------------------- | ---------------- | -------- | --------------------------------------------------------------- |
| request_id                | string           | yes      | Unique request identifier.                                      |
| invocation_id             | string           | yes      | Invocation identifier shared with telemetry.                    |
| idempotency_key           | string           | yes      | Stable idempotency key for retries.                             |
| submitted_at_utc          | string (RFC3339) | yes      | Request submission timestamp.                                   |
| task_id                   | string           | yes      | Plan task scope (for example `INF-01`).                         |
| objective_profile         | string           | yes      | Objective context propagated from CTX-01.                       |
| role_context              | enum             | yes      | `po`, `stakeholder`, `qa`, `dev`, `governance-owner`, `system`. |
| runtime_target_preference | list(enum)       | yes      | Ordered target preference (`local`, `vps`, `cloud`).            |
| timeout_tier              | enum             | yes      | `fast`, `standard`, `extended`.                                 |
| max_retries               | integer          | yes      | Maximum retries allowed by policy.                              |
| payload_type              | enum             | yes      | `task`, `decision`, `metric`, `implemented_code`.               |
| payload_ref               | string           | no       | Reference to external payload artifact.                         |
| payload_inline            | object           | no       | Inline payload when small enough.                               |

Validation rules:

- exactly one of `payload_ref` or `payload_inline` must be present.
- `idempotency_key` must remain stable across retries.
- `runtime_target_preference` must contain only supported targets.

## Adapter Targets

### local-process adapter

- execution mode: same-host process execution.
- primary use: development and local validation loops.

### vps-service adapter

- execution mode: remote service call to VPS-hosted runtime.
- primary use: stable shared environment execution.

### cloud-endpoint adapter

- execution mode: managed cloud runtime endpoint.
- primary use: scalable execution fallback or primary in cloud profile.

## Adapter Capabilities Contract

| Field                  | Type       | Description                               |
| ---------------------- | ---------- | ----------------------------------------- |
| target                 | enum       | `local`, `vps`, `cloud`                   |
| supports_payload_types | list(enum) | Supported payload classes                 |
| supports_timeout_tiers | list(enum) | Supported timeout tiers                   |
| supports_streaming     | boolean    | Whether streaming responses are supported |
| health_status          | enum       | `healthy`, `degraded`, `unhealthy`        |

## Compatibility Notes

- Telemetry propagation fields must remain compatible with [INF-02-telemetry-schema.md](INF-02-telemetry-schema.md).
- Routing context fields must remain compatible with [../agentic/AGT-01-orchestrator-interface.md](../agentic/AGT-01-orchestrator-interface.md).
- Durable promotion must preserve request and response envelope compatibility with this adapter specification.
