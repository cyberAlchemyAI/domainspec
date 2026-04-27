# GOV-03 - Blocking Gates and Escalation Policy

## Objective

Define when implementation changes must be blocked, when advisory mode is acceptable, and how escalations are handled.

## Problem

Blocking behavior can be inconsistent without a clear severity-to-action policy.

## Scope

- In scope:
  - Blocking thresholds for critical governance violations.
  - Advisory mode criteria and expiration windows.
  - Escalation path and ownership.
- Out of scope:
  - Non-implementation governance proposals.

## Dependencies

- [GOV-02-governance-validation-scripts.md](GOV-02-governance-validation-scripts.md)
- [../infra/INF-03-ci-governance-loop.md](../infra/INF-03-ci-governance-loop.md)

## Implementation Tasks

1. Define severity classes and block policies.
2. Define emergency advisory fallback policy with strict timeout.
3. Define escalation owner chain and SLA.
4. Define rollback and recovery protocol after governance incidents.
5. Add policy checks to CI workflow configuration.

## Deliverables

- Severity-to-action policy.
- Escalation and SLA matrix.
- Recovery protocol.
- CI policy enforcement mapping.

## Done Criteria

- [ ] Critical and high violations consistently block merges.
- [ ] Advisory exceptions are time-bound and audited.
- [ ] Escalations are routed with explicit ownership and SLA.
