# INF-01 Dispatch, Retry, and Timeout Policy

## Purpose

Define deterministic request dispatch, retry behavior, and timeout tiers for runtime gateway execution.

## Operating Profiles

| Profile          | Status   | Policy expectation                                                                  |
| ---------------- | -------- | ----------------------------------------------------------------------------------- |
| minimal profile  | default  | deterministic local-first dispatch with bounded retries and explicit timeout tiers  |
| promoted profile | optional | durable orchestration can be enabled only after promotion-gate evidence is accepted |

Profile rules:

- minimal profile is the default runtime mode for harness execution.
- promoted profile activation must not change request and response envelope contracts.
- dispatch determinism requirements apply to both profiles.

## Dispatch Order Policy

Default target order:

1. `local`
2. `vps`
3. `cloud`

Policy rules:

- Use request-provided `runtime_target_preference` when present.
- Skip targets with `health_status=unhealthy`.
- Allow `degraded` targets only when no higher-priority healthy target is available.

## Retryability Classes

| Failure class            | Retryable | Retry notes                           |
| ------------------------ | --------- | ------------------------------------- |
| network-transient        | yes       | exponential backoff with jitter       |
| upstream-timeout         | yes       | retry if below retry cap              |
| rate-limit               | yes       | retry using provider cooldown         |
| validation-error         | no        | fix request payload before retry      |
| policy-block             | no        | requires governance or owner decision |
| adapter-misconfiguration | no        | requires runtime configuration fix    |

## Retry Budget

| Timeout tier | Max retries | Initial backoff |
| ------------ | ----------- | --------------- |
| fast         | 1           | 250ms           |
| standard     | 2           | 500ms           |
| extended     | 3           | 1000ms          |

Rules:

- retries must preserve `idempotency_key` and `request_id` lineage.
- each retry attempt must emit a traceable retry event.
- hard stop when `max_retries` is reached.

Promoted profile note:

- promoted profile enablement is gated to explicit trigger evidence: resumable long-running flow needs, human-in-loop pause/resume requirements, or strict crash-recovery guarantees.
- without trigger evidence, remain on minimal profile.

## Timeout Tiers

| Tier     | Default timeout | Intended use                               |
| -------- | --------------- | ------------------------------------------ |
| fast     | 15s             | low-latency control and routing operations |
| standard | 45s             | standard task and decision execution       |
| extended | 120s            | heavy execution with larger payloads       |

## Failure Handling Outcomes

| Outcome                | Condition                                            |
| ---------------------- | ---------------------------------------------------- |
| success                | adapter returns typed envelope and validation passes |
| retrying               | retryable failure class and retry budget remains     |
| failed-non-retryable   | non-retryable failure class                          |
| failed-retry-exhausted | retry budget exhausted                               |

## Traceability Requirements

- every dispatch attempt records target, attempt index, and timeout tier.
- every retry records failure class and next attempt policy.
- terminal failures record final failure class and decision path.
