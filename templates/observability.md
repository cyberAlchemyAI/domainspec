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
> Every metric traces to a specific doc section. Instrumented via OpenTelemetry API.
> Meter scope: `{project-name}`. All instruments carry `feature: {feature-id}` as an attribute.

## Domain Fidelity Metrics

### State Machine Monitors (O1–O3)

<!-- One section per state machine in states.md -->

#### {EntityName} State Machine

**Transition counters (O1):**

| From | To | Event | Attributes |
|------|-----|-------|-----------|
| | | | `{feature, entity, from, to, event}` |

**Invalid transition counter:**
```yaml
# @source states.md#{EntityName}
- name: state.invalid_transition
  instrument: Counter
  unit: "{attempt}"
  attributes: [feature, entity, from, attempted_event, error_code]
  alert: any increment → P0
```

**State distribution (O2):**
```yaml
- name: state.population
  instrument: UpDownCounter
  unit: "{entity}"
  attributes: [feature, entity, state]
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
# @source operations.md#{OperationName}
- name: operation.invocation
  instrument: Counter
  unit: "{invocation}"
  attributes: [feature, operation, result]  # result: success | error

- name: operation.duration
  instrument: Histogram
  unit: "s"
  attributes: [feature, operation]
```

**Rule violation rates (O5):**

| Rule | Expression | Instrument | Alert Threshold |
|------|-----------|-----------|-----------------|
| R1 | | `rule.violation` Counter `{feature, operation, rule_id="R1"}` | |
| R2 | | `rule.violation` Counter `{feature, operation, rule_id="R2"}` | |

**Calculation drift (O6):**

<!-- Only if operation has calculations -->

| Calc | Formula | Instrument | Frequency | Alert |
|------|---------|-----------|-----------|-------|
| C1 | | `calculation.drift` Histogram `{feature, calculation_id="C1"}` | | drift > 0 → P0 |

**Postcondition verification (O7):**

| Postcondition | Instrument | Alert |
|--------------|-----------|-------|
| | `postcondition.check` Counter `{feature, operation, postcondition_id, result}` | any result=violated → P1 |

---

## Operational Health Metrics

### Endpoint SLOs (O8)

<!-- Uses OTel HTTP semantic conventions: http.server.request.duration + custom `feature` attribute -->

| Endpoint | Availability SLO | Latency p99 SLO | Throughput Baseline |
|----------|-----------------|-----------------|-------------------|
| | ≥ 99.9% | ≤ ms | req/min |

### Idempotency Monitors (O9)

<!-- Only for operations with idempotency constraints -->

| Rule | Constraint | Instrument | Alert |
|------|-----------|-----------|-------|
| | | `idempotency.violation` Gauge `{feature, operation, rule_id}` | any > 0 → P0 |
| | | `idempotency.dedup` Counter `{feature, operation, rule_id}` | informational |

### Event Flow (O10)

<!-- One row per event in events.md -->

| Event | Producer | Consumers | Lag SLO |
|-------|---------|-----------|---------|
| | | | ≤ s |

```yaml
# @source events.md
- name: event.emit      # Counter {feature, event_type, producer}
- name: event.consume    # Counter {feature, event_type, consumer}
- name: event.consumer.lag  # Histogram (s) {feature, event_type, consumer}
```

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
- name: business.{kpi_name}
  instrument: Counter | Gauge | Histogram
  unit: "{unit}"
  attributes: [feature, capability]
  business_question: "What does this answer?"
  healthy_range: "{range or trend direction}"
  alert: deviation condition → P2
```

### Funnel Metrics (O14)

<!-- Only for multi-step user journeys in STORIES.md -->

#### {JourneyName} Funnel

| Step | Instrument | Expected Conversion |
|------|-----------|-------------------|
| 1. | `funnel.step` Counter `{feature, journey, step_name="1", outcome}` | — |
| 2. | `funnel.step` Counter `{feature, journey, step_name="2", outcome}` | ≥ % |

**Conversion rate:**
```yaml
- name: funnel.conversion_rate
  instrument: Gauge
  unit: "1"  # ratio
  attributes: [feature, journey]
  formula: step_N_completed / step_1_started
  window: 7d rolling
  alert: rate drops > 10% from baseline → P2
```

---

## Financial Integrity Metrics (O15–O16)

<!-- Only for features with pillar: finance in SPEC frontmatter -->

### Transaction Integrity (O15)

```yaml
# @rule O15: Transaction Integrity
- name: reconciliation.mismatch
  instrument: Gauge
  unit: "{currency_minor}"
  attributes: [feature, entity]
  check: |computed - stored|
  frequency: hourly
  alert: mismatch > 0 → P0

- name: transaction.duplicate
  instrument: Counter
  unit: "{duplicate}"
  attributes: [feature, transaction_type]
  check: group by idempotency_key, count > 1
  alert: any increment → P0

- name: exposure.amount
  instrument: Gauge
  unit: "{currency_minor}"
  attributes: [feature]
  alert: exposure > 0 → P0
```

### Settlement Cycle Metrics (O16)

<!-- Only for settlement/payout features -->

```yaml
# @rule O16: Settlement Cycle
- name: settlement.cycle.invocations     # Counter {feature}
- name: settlement.cycle.payout_amount   # Counter {currency_minor} {feature}
- name: settlement.cycle.makeup_applied  # Counter {currency_minor} {feature}
- name: settlement.cycle.avg_value       # Gauge {currency_minor} {feature}
- name: settlement.cycle.error_rate      # Gauge (ratio) {feature}
- name: settlement.recalculation.drift   # Gauge {currency_minor} {feature, calculation_id}
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
