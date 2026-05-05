# Observability Alignment

Use this document for architecture-level observability expectations.

## Metric Obligation Families

Production observability metrics are derived from documentation that drives tests:

- Domain Fidelity: state machine counters, invariant monitors, rule violation rates, calculation drift
- Operational Health: endpoint SLOs (RED metrics), idempotency monitors, event flow, query performance
- Business Effectiveness: capability KPIs, funnel metrics from user journeys
- Financial Integrity: mandatory for `pillar: finance` features, including transaction reconciliation and duplicate detection

## Naming and Instrument Conventions

Use OpenTelemetry semantic conventions:

- dot-separated names (`{domain_area}.{semantic_name}`)
- typed instruments (Counter, Histogram, Gauge, UpDownCounter)
- `feature` as an attribute, not a name prefix

Each metric should carry `@source`, `@rule`, and `@constraint` annotations for traceability.

## Canonical Derivation Reference

For full derivation rules and templates, use `../../OBSERVABILITY.md`.
