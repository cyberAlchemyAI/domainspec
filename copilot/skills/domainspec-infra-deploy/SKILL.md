---
name: domainspec-infra-deploy
description: Generate or update deployment artifacts (Pulumi, compose, prometheus, alerts, Caddyfile) from INFRA-ARCHITECTURE.md and feature observability specs. Run after adding features or changing infrastructure preset.
argument-hint: "[--preview] [--alerts-only] [--prometheus-only]"
agent: domainspec-infra-architect
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Synchronize deployment artifacts with the current state of INFRA-ARCHITECTURE.md, feature observability specs, and SLO definitions. This is the infrastructure equivalent of `domainspec-sync-registry` — it keeps infra configs in sync with domain specs.
</objective>

<context>
Source references:
- docs/INFRA-ARCHITECTURE.md (constitution — preset, stack, networking, conventions)
- docs/slos.md (SLO targets per feature)
- docs/features/*/observability.md (O-rule instrument declarations)
- domainspec/CHANGELOG.md

Targets:

- infra/prometheus.yml (scrape config)
- infra/alerts/\*.rules.yml (Prometheus alerting rules)
- infra/docker-compose.prod.yml (production compose)
- infra/Caddyfile (reverse proxy routes)
- infra/index.ts (Pulumi IaC — only if topology changes)
- .github/workflows/ci.yml, deploy.yml (CI/CD)
  </context>

<flags>
- `--preview`: Show what would change without writing files. Print a diff summary.
- `--alerts-only`: Only regenerate alert rules from slos.md. Skip all other artifacts.
- `--prometheus-only`: Only regenerate prometheus.yml and alert rules.
</flags>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md.
2. Read docs/INFRA-ARCHITECTURE.md — extract preset, stack choices, networking, environments.
3. Read docs/slos.md — extract per-feature targets and alert expressions.
4. Collect all docs/features/*/observability.md files.
5. For each observability spec:
   a. Parse YAML instrument declarations.
   b. Map instrument names to Prometheus metric names (OTel → Prometheus naming).
   c. Cross-reference with slos.md thresholds.
6. Generate/update infra/prometheus.yml:
   - Scrape config: target app OTel exporter (app:9464).
   - Scrape interval from INFRA-ARCHITECTURE.md.
   - Rule file references.
7. Generate/update infra/alerts/{feature}.rules.yml for each feature:
   - One alert per SLO threshold.
   - Labels: severity, feature.
   - Annotations: summary, source O-rule.
8. If --alerts-only or --prometheus-only, stop here.
9. Verify docker-compose.prod.yml services match INFRA-ARCHITECTURE.md networking table:
   - Check ports, service names, image references.
   - Add missing services, flag removed ones.
10. Verify Caddyfile routes match networking table:
    - Each exposed service has a reverse proxy entry.
    - Domain names from INFRA-ARCHITECTURE.md.
11. Verify CI/CD workflows match preset:
    - Dev: ci.yml only.
    - Single VPS+: ci.yml + deploy.yml.
    - Split VPS+: + promotion gates.
12. If --preview: print summary of changes without writing.
13. Otherwise: write all updated files.
14. Run validation:
    - `docker compose -f infra/docker-compose.prod.yml config` (compose syntax check)
    - If Pulumi project exists: `cd infra && npx tsc --noEmit` (IaC compilation)
15. Return summary: files updated, alerts generated, any drift detected.
</process>

<prometheus-naming>
OTel instrument names → Prometheus metric names mapping:

| OTel Instrument                          | Prometheus Metric                           |
| ---------------------------------------- | ------------------------------------------- |
| operation.invocation (Counter)           | operation_invocation_total                  |
| operation.duration (Histogram)           | operation_duration_seconds_bucket           |
| rule.violation (Counter)                 | rule_violation_total                        |
| state.transition (Counter)               | state_transition_total                      |
| state.invalid_transition (Counter)       | state_invalid_transition_total              |
| invariant.violation (Counter)            | invariant_violation_total                   |
| calculation.drift (Histogram)            | calculation_drift                           |
| http.server.request.duration (Histogram) | http_server_request_duration_seconds_bucket |
| event.emit (Counter)                     | event_emit_total                            |
| workflow.invocation (Counter)            | workflow_invocation_total                   |
| workflow.duration (Histogram)            | workflow_duration_seconds_bucket            |
| reconciliation.mismatch (Counter)        | reconciliation_mismatch_total               |

Use this mapping when generating alert expressions from slos.md.
</prometheus-naming>

<alert-template>
```yaml
groups:
  - name: {feature}
    rules:
      - alert: {Feature}{MetricName}Breach
        expr: |
          {prometheus_expression_from_slos_md}
        for: 5m
        labels:
          severity: {severity_from_slos_md}
          feature: {feature}
        annotations:
          summary: "{feature}: {human_readable_description}"
          source_rule: "{O-rule}"
          slo_target: "{target_from_slos_md}"
          runbook: "docs/features/{feature}/observability.md"
```
</alert-template>

<constraints>
- Never modify domain code — this skill only generates infrastructure configs.
- Never create new observability specs — only read existing ones.
- Alert expressions must match exactly the format in slos.md.
- Prometheus scrape targets are internal Docker network addresses (service:port).
- All generated YAML must be valid — validate with appropriate tools.
- Grafana dashboards reference the same metric names as alerts.
</constraints>

<auto-detection>
This skill is auto-suggested by the planner when:
- New features have been added with observability.md since last deploy sync
- INFRA-ARCHITECTURE.md preset has changed
- slos.md has been updated with new thresholds
- `domainspec-infra-architecture` has run and scaffolded initial infra
</auto-detection>
