# INF-04 - Infrastructure Security Baseline Closure

## Objective

Close pending infrastructure security and operations checklist items relevant to implementation execution.

## Problem

Open security checklist items reduce confidence in runtime safety and deployment integrity.

## Scope

- In scope:
  - Token and secret hygiene controls.
  - SSH hardening confirmation.
  - Env file and repository leakage checks.
- Out of scope:
  - Research environment threat modeling.

## Dependencies

- [INF-01-runtime-dispatch-gateway.md](INF-01-runtime-dispatch-gateway.md)
- [INF-02-agent-telemetry-saturn.md](INF-02-agent-telemetry-saturn.md)

## Implementation Tasks

1. Verify tokens are not present in repository history.
2. Validate provider token scope policies.
3. Verify env file ignore coverage and secret management paths.
4. Validate repository-level secret setup and rotation process.
5. Confirm key-only SSH and capture evidence.

## Deliverables

- Security checklist closure report.
- Secret and token policy verification evidence.
- SSH hardening verification evidence.

## Done Criteria

- [ ] All pending security checklist items are closed with evidence.
- [ ] Secret handling policy is documented and reproducible.
- [ ] Security verification can be rerun with deterministic outputs.
