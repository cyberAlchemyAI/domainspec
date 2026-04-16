---
id: {feature-id}
feature: {FeatureName}
type: observability
title: "{FeatureName} — Observability Spec"
derived-from: OBSERVABILITY.md rules O1–O16
status: draft
---

# {FeatureName} — Observability Spec

> Derived from feature docs using [OBSERVABILITY.md](../../domainspec/OBSERVABILITY.md) derivation rules.
> Every metric traces to a specific doc section.

## Domain Fidelity Metrics

### State Machine Monitors (O1–O3)

<!-- One section per state machine in states.md -->

#### {EntityName} State Machine

**Transition counters (O1):**

| From | To | Event | Metric |
|------|-----|-------|--------|
| | | | `{feature}.{Entity}.transition.total{from, to, event}` |

**Invalid transition counter:**
```yaml
metric: {feature}.{Entity}.invalid_transition.total
labels: [from, attempted_event, error_code]
alert: any increment → P0
source: states.md#{EntityName}
```

**State distribution (O2):**
```yaml
metric: {feature}.{Entity}.state_distribution
labels: [state]
states: [list all states from states.md]
alert: accumulation in non-terminal state > {threshold} → P1
```

**Invariant monitors (O3):**

| ID | Invariant | Check | Alert |
|----|-----------|-------|-------|
| | | | P0 if violated |

### Operation Metrics (O4–O7)

<!-- One section per operation in operations.md -->

#### {OperationName}

**Base metrics (O4):**
```yaml
- {feature}.{Operation}.executed.total
- {feature}.{Operation}.succeeded.total
- {feature}.{Operation}.failed.total{error_code, rule_violated}
- {feature}.{Operation}.duration.seconds  # histogram
```

**Rule violation rates (O5):**

| Rule | Expression | Metric | Alert Threshold |
|------|-----------|--------|-----------------|
| R1 | | `rule_violation.total{rule="R1"}` | |
| R2 | | `rule_violation.total{rule="R2"}` | |

**Calculation drift (O6):**

<!-- Only if operation has calculations -->

| Calc | Formula | Drift Metric | Frequency | Alert |
|------|---------|-------------|-----------|-------|
| C1 | | `calculation_drift.percentage{calc="C1"}` | | drift > 1% → P0 |

**Postcondition verification (O7):**

| Postcondition | Verified Metric | Violated Metric | Alert |
|--------------|----------------|----------------|-------|
| | `.postcondition.verified.total` | `.postcondition.violated.total` | any violated → P1 |

---

## Operational Health Metrics

### Endpoint SLOs (O8)

<!-- One row per endpoint in interfaces.md -->

| Endpoint | Availability SLO | Latency p99 SLO | Throughput Baseline |
|----------|-----------------|-----------------|-------------------|
| | ≥ 99.9% | ≤ ms | req/min |

### Idempotency Monitors (O9)

<!-- Only for operations with idempotency constraints -->

| Rule | Constraint | Metric | Alert |
|------|-----------|--------|-------|
| | | `idempotency_violation` | any > 0 → P0 |
| | | `idempotency_deduplicated.total` | informational |

### Event Flow (O10)

<!-- One row per event in events.md -->

| Event | Producer | Consumers | Lag SLO |
|-------|---------|-----------|---------|
| | | | ≤ s |

### Query Performance (O11)

<!-- One row per query in queries.md -->

| Query | p95 Latency SLO | Max Result Size | Cache TTL |
|-------|-----------------|----------------|-----------|
| | ≤ ms | rows | s |

---

## Business Effectiveness Metrics

### Capability KPIs (O13)

<!-- One section per capability in SPEC.md -->

#### {CapabilityName}

```yaml
metric: {feature}.{capability}.{kpi_name}
type: counter | gauge | histogram
business_question: "What does this answer?"
healthy_range: {range or trend direction}
alert: deviation condition → P2
```

### Funnel Metrics (O14)

<!-- Only for multi-step user journeys in STORIES.md -->

#### {JourneyName} Funnel

| Step | Metric | Expected Conversion |
|------|--------|-------------------|
| 1. | `funnel.{journey}.step.total{step="1", outcome}` | — |
| 2. | `funnel.{journey}.step.total{step="2", outcome}` | ≥ % |
| N. | | |

**Conversion rate:**
```yaml
metric: {feature}.funnel.{journey}.conversion_rate
formula: step_N_completed / step_1_started
window: 7d rolling
alert: rate drops > 10% from baseline → P2
```

---

## Financial Integrity Metrics (O15–O16)

<!-- Only for features with pillar: finance in SPEC frontmatter -->

### Transaction Integrity (O15)

```yaml
reconciliation:
  metric: {feature}.reconciliation.balance_mismatch
  check: |computed - stored|
  frequency: hourly
  alert: mismatch > 0 → P0

duplicate_detection:
  metric: {feature}.transaction.duplicate.total
  check: group by idempotency_key, count > 1
  alert: any increment → P0

monetary_exposure:
  metric: {feature}.exposure.amount
  unit: currency
  alert: exposure > 0 → P0
```

### Settlement Cycle Metrics (O16)

<!-- Only for settlement/payout features -->

```yaml
total_settlements: counter
total_payout_amount: counter (currency sum)
total_makeup_applied: counter (currency sum)
avg_settlement_value: gauge
settlement_error_rate: ratio (failed / total)
profit_recalculation_drift: gauge (recompute vs stored)
```

---

## Alert Runbook Index

| Alert | Severity | Investigation Steps | Source Doc |
|-------|----------|-------------------|-----------|
| | P0 | | operations.md# |
| | P1 | | states.md# |
| | P2 | | SPEC.md# |

---

## Coverage Checklist

- [ ] Every state transition has a counter (O1)
- [ ] Every state machine has a distribution gauge (O2)
- [ ] Every invariant has a runtime monitor (O3)
- [ ] Every operation has 4 base metrics (O4)
- [ ] Every rule has a violation counter (O5)
- [ ] Every calculation has a drift monitor (O6)
- [ ] Every postcondition has verification (O7)
- [ ] Every endpoint has SLOs (O8)
- [ ] Every idempotency rule has a monitor (O9)
- [ ] Every event has flow metrics (O10)
- [ ] Every query has performance metrics (O11)
- [ ] Every capability has at least 1 KPI (O13)
- [ ] Every multi-step journey has a funnel (O14)
- [ ] Finance features have integrity metrics (O15–O16)
