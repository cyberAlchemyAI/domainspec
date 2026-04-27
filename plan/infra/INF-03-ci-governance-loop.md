# INF-03 - CI Governance Loop (Threshold to Suggestion to Evaluation)

## Objective

Implement a closed loop where metric thresholds trigger CI suggestions and governance evaluation actions.

## Problem

Current loop detects some threshold conditions, but remediation and evaluation are not fully automated end-to-end.

## Scope

- In scope:
  - Threshold trigger policies.
  - Suggestion generation artifact.
  - Governance evaluation stage and disposition.
- Out of scope:
  - Experiment scoring workflows.

## Dependencies

- [INF-02-agent-telemetry-saturn.md](INF-02-agent-telemetry-saturn.md)
- [../governance/GOV-03-blocking-gates-policy.md](../governance/GOV-03-blocking-gates-policy.md)

## Implementation Tasks

1. Define threshold registry tied to implementation metrics.
2. Add CI stage that emits suggestion bundles on threshold breaches.
3. Add evaluation stage to classify suggestions: accept, defer, reject.
4. Add governance decision logging with owner and rationale.
5. Add rollback policy for harmful automated suggestions.

## Deliverables

- Threshold registry.
- Suggestion bundle schema.
- Evaluation workflow definition.
- Decision log format.

## Done Criteria

- [ ] Threshold breach generates actionable suggestion automatically.
- [ ] Suggestion receives explicit governance disposition.
- [ ] Accepted suggestions are traceable to resulting code or config changes.
