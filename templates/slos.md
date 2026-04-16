---
project: { project-name }
status: draft
created: { date }
updated: { date }
---

# Service Level Objectives

> Defines availability, latency, and error rate targets per feature.
> SLOs link to observability specs — each target references the O-rule that produces the metric.

---

## Global SLOs

| Metric             | Target   | Window      | Alert Threshold   | Severity |
| ------------------ | -------- | ----------- | ----------------- | -------- |
| Uptime             | {99.9%}  | 30d rolling | < target for 5min | P0       |
| API P95 latency    | {200ms}  | 1h rolling  | > target for 5min | P1       |
| Error rate (5xx)   | {< 0.1%} | 1h rolling  | > target for 5min | P1       |
| Deployment success | {100%}   | Per deploy  | Any failure       | P0       |

---

## Per-Feature SLOs

### {feature-name}

Source: `docs/features/{feature-name}/observability.md`

| Metric                    | O-Rule | Target    | Alert Expression                                                                                                                              | Severity |
| ------------------------- | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Endpoint P95 latency      | O8     | < {200ms} | `histogram_quantile(0.95, rate(http_server_request_duration_bucket{feature="{feature}"}[5m])) > 0.2`                                          | P1       |
| Operation error rate      | O4     | < {1%}    | `rate(operation_invocation_total{feature="{feature}",status="error"}[5m]) / rate(operation_invocation_total{feature="{feature}"}[5m]) > 0.01` | P1       |
| State transition failures | O1     | 0 invalid | `rate(state_invalid_transition_total{feature="{feature}"}[5m]) > 0`                                                                           | P0       |
| Invariant violations      | O3     | 0         | `invariant_violation_total{feature="{feature}"} > 0`                                                                                          | P0       |
| Rule violation rate       | O5     | < {5%}    | `rate(rule_violation_total{feature="{feature}"}[5m]) / rate(operation_invocation_total{feature="{feature}"}[5m]) > 0.05`                      | P2       |
| {Calculation drift}       | O6     | {< 0.01}  | `calculation_drift{feature="{feature}"} > 0.01`                                                                                               | P1       |

---

## Error Budget

| Feature   | SLO          | Budget (30d) | Remaining                  |
| --------- | ------------ | ------------ | -------------------------- |
| {feature} | 99.9% uptime | 43.2 min     | {calculated at query time} |

Error budget calculation: `budget_minutes = (1 - slo_target) × 30 × 24 × 60`

---

## Alert Routing

| Severity | Channel               | Response Time     |
| -------- | --------------------- | ----------------- |
| P0       | {on-call — immediate} | 15 min            |
| P1       | {team channel}        | 1 hour            |
| P2       | {daily review}        | Next business day |
| P3       | {backlog}             | Best effort       |

---

## Alert Rules Generation

Alert rules are derived from this file and generated into `infra/alerts/`:

```
slos.md → per-feature thresholds
    + observability.md → O-rule metric names
    → infra/alerts/{feature}.rules.yml
```

Each `.rules.yml` file contains Prometheus alerting rules matching the expressions above.

---

_Last updated: {date}_
