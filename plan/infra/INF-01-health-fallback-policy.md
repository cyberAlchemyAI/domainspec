# INF-01 Health and Fallback Policy

## Purpose

Define runtime gateway health checks and fallback behavior across local, VPS, and cloud adapters.

## Health Check Model

Health check categories:

1. adapter reachability
2. authentication and authorization
3. schema compatibility
4. latency threshold compliance

Health result states:

- `healthy`
- `degraded`
- `unhealthy`

## Check Cadence

| Check type            | Cadence     | Trigger                   |
| --------------------- | ----------- | ------------------------- |
| baseline reachability | every 60s   | scheduled                 |
| auth/schema check     | every 5m    | scheduled                 |
| latency compliance    | per request | request completion        |
| forced recheck        | immediate   | before fallback promotion |

## Fallback Rules

1. Use primary preferred target when state is `healthy`.
2. If primary is `degraded`, allow execution only when no higher-priority healthy target exists.
3. If primary is `unhealthy`, skip target and move to next preference.
4. If all targets are `unhealthy`, return terminal failure with traceable failure state.

## Promotion and Recovery

- a degraded target is promoted back to healthy only after two consecutive passing baseline checks.
- an unhealthy target is reintroduced only after a successful forced recheck.

## Traceability Requirements

- record target health state at dispatch time.
- record fallback transitions with reason codes.
- record recovery promotion events.

## Integration Contracts

- health signals must align with [INF-02-telemetry-schema.md](INF-02-telemetry-schema.md).
- fallback outcomes must be representable by [INF-01-output-envelope-schema.md](INF-01-output-envelope-schema.md).
