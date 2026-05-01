# HAR-06 - Runtime Harness Minimal Profile

## Objective

Define the default harness runtime profile as a minimal, deterministic, local-first execution path with a clean durability adapter seam.

## Problem

Harness implementation can become overbuilt too early when durable orchestration is treated as a baseline requirement instead of a gated promotion path.

## Scope

- In scope:
  - Minimal profile as the default runtime operating mode.
  - Deterministic routing, retry, timeout, and typed envelope validation behavior.
  - Health-aware fallback behavior aligned with INF-01 contracts.
  - Explicit durability adapter seam with noop default.
- Out of scope:
  - Full durable orchestration rollout and worker infrastructure.
  - Queue-first architecture changes not required for deterministic minimal profile.

## Dependencies

- [../infra/INF-01-runtime-dispatch-gateway.md](../infra/INF-01-runtime-dispatch-gateway.md)
- [../infra/INF-01-runtime-adapter-spec.md](../infra/INF-01-runtime-adapter-spec.md)
- [../infra/INF-01-dispatch-policy.md](../infra/INF-01-dispatch-policy.md)
- [../infra/INF-01-output-envelope-schema.md](../infra/INF-01-output-envelope-schema.md)
- [../infra/INF-01-health-fallback-policy.md](../infra/INF-01-health-fallback-policy.md)
- [../infra/INF-02-agent-telemetry-saturn.md](../infra/INF-02-agent-telemetry-saturn.md)

## Implementation Tasks

1. Lock minimal profile as the default runtime mode in INF-01 artifacts.
2. Ensure request and response envelope contracts are validated deterministically.
3. Ensure dispatch, retry, and timeout policy execution is deterministic and traceable.
4. Ensure fallback transitions emit stable reason codes and health-state evidence.
5. Preserve an optional durability adapter seam with noop default in minimal profile.

## Deliverables

- Minimal profile operating contract.
- Deterministic validation matrix inputs and expected outcomes.
- Durability seam definition with noop baseline behavior.
- Telemetry evidence mapping for retries, fallbacks, and terminal states.

## Non-Goals

- Adopting Temporal as a mandatory foundation dependency for harness-core.
- Introducing infrastructure-heavy orchestration before trigger-based promotion criteria are met.

## Done Criteria

- [ ] Minimal profile is explicitly documented as the default harness runtime path.
- [ ] Durable orchestration is explicitly documented as a gated promoted profile.
- [ ] Deterministic local-first verification scenarios are defined for routing, retries, and fallback.
- [ ] Typed envelope validation is required for runtime success and failure outputs.
- [ ] Durability seam is adapter-based and does not require Temporal symbols in harness-core contracts.
