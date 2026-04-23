---
id: commodity-crisis-signal-mvp
feature: commodity-crisis-signal-mvp
type: observability
title: "Commodity Crisis Signal MVP - Observability Spec"
derived-from: "DomainSpec OBSERVABILITY rules O1-O16"
status: draft
---

# Commodity Crisis Signal MVP - Observability Spec

This specification derives production metrics from domain contracts to validate behavior, operational reliability, and business outcomes.
All instruments use Meter scope `investiment-strategy` and include `feature=commodity-crisis-signal-mvp`.

## Derivation Scope

| Rule | Source | Status | Notes |
| --- | --- | --- | --- |
| O1-O3 | [states.md](states.md) | applicable | Three state machines with explicit transitions and invariants |
| O4-O7 | [operations.md](operations.md) | applicable | Eight operations with rules, calculations, and postconditions |
| O8 | [interfaces.md](interfaces.md) | deferred | No HTTP transport endpoints in this MVP |
| O9 | [operations.md](operations.md) | applicable | Idempotency and dedupe rules (R10, R13) |
| O10 | [events.md](events.md) | applicable | Eight domain events with declared consumers |
| O11 | [queries.md](queries.md) | applicable | Four read models |
| O12 | [workflows.md](workflows.md) | applicable | Signal and thesis lifecycle workflows |
| O13 | [SPEC.md](SPEC.md) | applicable | Five capabilities |
| O14 | [STORIES.md](STORIES.md) | applicable | Eight stories with multi-step journeys |
| O15-O16 | [SPEC.md](SPEC.md) | provisional | SPEC has no pillar frontmatter, but feature carries financial risk semantics |

## Domain Fidelity Metrics

### State Machine Monitors (O1-O3)

#### RegimeState

Transition counter: `state.transition` Counter `{feature, entity="RegimeState", from, to, event}`

| From | To | Event |
| --- | --- | --- |
| Monitoring | Armed | IndicatorsAligned |
| Armed | Triggered | SignalGenerated |
| Triggered | Invalidated | InvalidationDetected |
| Invalidated | Monitoring | ResetApproved |

#### ThesisState

Transition counter: `state.transition` Counter `{feature, entity="ThesisState", from, to, event}`

| From | To | Event |
| --- | --- | --- |
| Draft | Candidate | CandidatePrepared |
| Candidate | Active | ActivateStrategyThesis |
| Active | Challenged | ThesisAlignmentBelowThreshold |
| Challenged | Active | ThesisAlignmentRecovered |
| Active | Invalidated | ProcessInvalidation |
| Challenged | Invalidated | ProcessInvalidation |
| Invalidated | Retired | RetirementApproved |

#### SignalDecisionState

Transition counter: `state.transition` Counter `{feature, entity="SignalDecisionState", from, to, event}`

| From | To | Event |
| --- | --- | --- |
| Draft | Emitted | GenerateSignal |
| Emitted | Emitted | ResolveEntryPricePlan |
| Emitted | Emitted | ResolveExitPricePlan |
| Emitted | Blocked | RiskBreachDetected |
| Emitted | Executed | RecordPaperExecution |
| Executed | Executed | ResolveExitPricePlan |
| Executed | Blocked | RiskBreachDetected |
| Executed | Closed | CloseSignalDecision |
| Blocked | Closed | CloseSignalDecision |

Invalid transition counter:

```yaml
- name: state.invalid_transition
  instrument: Counter
  unit: "{attempt}"
  description: "Rejected transitions outside documented state tables"
  attributes: [feature, entity, from, attempted_event, error_code]
  alert: any increment -> P0
```

State distribution metric:

```yaml
- name: state.population
  instrument: UpDownCounter
  unit: "{entity}"
  description: "Current entity counts by state"
  attributes: [feature, entity, state]
```

Invariant monitor metric:

```yaml
- name: invariant.violation
  instrument: Gauge
  unit: "{entity}"
  description: "Count of records violating documented invariants"
  attributes: [feature, entity, invariant_id, expression]
  alert: value > 0 -> P0
```

Invariants monitored: I1-I3 (RegimeState), I4-I6/I9-I10 (ThesisState), I7-I8/I11-I12 (SignalDecisionState).

### Operation Metrics (O4-O7)

Base metrics per operation (all operations in [operations.md](operations.md)):

```yaml
- name: operation.invocation
  instrument: Counter
  unit: "{invocation}"
  attributes: [feature, operation, result]

- name: operation.duration
  instrument: Histogram
  unit: "s"
  attributes: [feature, operation]

- name: operation.error
  instrument: Counter
  unit: "{error}"
  attributes: [feature, operation, error_code]

- name: postcondition.check
  instrument: Counter
  unit: "{check}"
  attributes: [feature, operation, postcondition_id, result]
```

Operations covered:
- ActivateStrategyThesis
- GenerateSignal
- ResolveEntryPricePlan
- ResolveExitPricePlan
- EvaluateThesisAlignment
- EvaluateRiskEnvelope
- ProcessInvalidation
- RecordPaperExecution
- CloseSignalDecision

Rule-violation monitor (O5):

```yaml
- name: rule.violation
  instrument: Counter
  unit: "{violation}"
  description: "Operation guard violations by rule id"
  attributes: [feature, operation, rule_id]
```

Required coverage: R1-R38 (including idempotency rules R10 and R13).

Calculation drift monitor (O6):

```yaml
- name: calculation.drift
  instrument: Histogram
  unit: "1"
  description: "Absolute drift between computed and replay-calculated values"
  attributes: [feature, calculation_id]
  alert: drift > 0 for deterministic formulas -> P0
```

Priority drift coverage: C1, C2, C3, C4, C5, C9, C10, C11, C12, C14, C15, C16, C18, C19, C20, C21.

## Operational Health Metrics

### Endpoint SLOs (O8)

Deferred in this MVP because [interfaces.md](interfaces.md) defines transport-agnostic command/query ports and no HTTP adapter contracts.
Activation condition: add explicit HTTP endpoints and status-code contracts.

### Idempotency Monitors (O9)

| Rule | Metric | Alert |
| --- | --- | --- |
| R10 duplicate invalidation | `idempotency.violation` Gauge `{feature, operation="ProcessInvalidation", rule_id="R10"}` | any value > 0 -> P0 |
| R13 duplicate close | `idempotency.violation` Gauge `{feature, operation="CloseSignalDecision", rule_id="R13"}` | any value > 0 -> P0 |
| R10,R13 dedupe events | `idempotency.dedup` Counter `{feature, operation, rule_id}` | informational |

### Event Flow (O10)

```yaml
- name: event.emit
  instrument: Counter
  unit: "{event}"
  attributes: [feature, event_type, producer]

- name: event.consume
  instrument: Counter
  unit: "{event}"
  attributes: [feature, event_type, consumer]

- name: event.consumer.lag
  instrument: Histogram
  unit: "s"
  attributes: [feature, event_type, consumer]
```

Lag SLO: <= 5s p95 for all events declared in [events.md](events.md).

### Query Performance (O11)

| Query | Latency SLO | Result Size Guard |
| --- | --- | --- |
| GetSignalTimeline | p95 <= 250 ms | pageSize <= 100 |
| GetRiskStatus | p95 <= 150 ms | single profile snapshot |
| GetOpenPositionPricing | p95 <= 200 ms | bounded by profile open positions |
| GetThesisStatus | p95 <= 200 ms | includeHistory optional branch |

Metric set:
- `query.duration` Histogram `{feature, query}`
- `query.result_size` Histogram `{feature, query}`
- `query.error` Counter `{feature, query, error_code}`

### Workflow Completion (O12)

| Workflow | Metric | Target |
| --- | --- | --- |
| SignalCycleWorkflow | `workflow.completion_rate` Gauge `{feature, workflow="SignalCycleWorkflow"}` | >= 99% |
| ThesisLifecycleWorkflow | `workflow.completion_rate` Gauge `{feature, workflow="ThesisLifecycleWorkflow"}` | >= 99% |
| CadenceSelectionPolicy | `workflow.policy_branch` Counter `{feature, policy="CadenceSelectionPolicy", branch}` | branch distribution monitored |

## Business Effectiveness Metrics

### Capability KPIs (O13)

| Capability | KPI Metric | Healthy Range |
| --- | --- | --- |
| Thesis Modeling and Governance | `business.thesis.active_ratio` Gauge | > 0 with no duplicate active thesis |
| Signal Generation and Regime Detection | `business.signal.generated_total` Counter | stable trend per cadence policy |
| Composable Entry and Exit Pricing | `business.pricing.agreement_score` Histogram | p50 >= thesis.minStrategyAgreementScore |
| Guardrail Enforcement | `business.risk.block_rate` Gauge | within expected guardrail envelope |
| Telemetry and Exit Control | `business.invalidation.lag_minutes` Histogram | low and non-increasing trend |

### Funnel Metrics (O14)

| Journey | Step Metric |
| --- | --- |
| US-4 thesis lifecycle governance | `funnel.step` Counter `{journey="US-4", step_name, outcome}` |
| US-1 deterministic signal generation | `funnel.step` Counter `{journey="US-1", step_name, outcome}` |
| US-8 composable pricing | `funnel.step` Counter `{journey="US-8", step_name, outcome}` |
| US-3 invalidation and unwind | `funnel.step` Counter `{journey="US-3", step_name, outcome}` |

Conversion metric:

```yaml
- name: funnel.conversion_rate
  instrument: Gauge
  unit: "1"
  attributes: [feature, journey]
  formula: step_n_completed / step_1_started
  alert: drop > 10% from 7d baseline -> P2
```

## Financial Integrity Metrics (O15-O16)

This feature is financially sensitive. Until SPEC frontmatter explicitly sets `pillar: finance`, treat this section as provisional but required for pilot risk governance.

```yaml
- name: reconciliation.mismatch
  instrument: Gauge
  unit: "{currency_minor}"
  attributes: [feature, entity]
  alert: mismatch > 0 -> P0

- name: transaction.duplicate
  instrument: Counter
  unit: "{duplicate}"
  attributes: [feature, transaction_type]
  alert: any increment -> P0

- name: settlement.cycle.error_rate
  instrument: Gauge
  unit: "1"
  attributes: [feature]
```

## Alert Runbook Index

| Alert | Severity | Investigation Start |
| --- | --- | --- |
| state.invalid_transition increment | P0 | Validate state/event pair in [states.md](states.md) and operation guards |
| invariant.violation > 0 | P0 | Inspect violating records and replay operation timeline |
| idempotency.violation > 0 | P0 | Check dedupe keys and duplicate command submissions |
| operation.error spike on GenerateSignal | P1 | Inspect R2/R3 stale coverage and source freshness |
| query.duration SLO breach | P1 | Check read-model projection lag and index coverage |
| funnel.conversion_rate drop | P2 | Inspect story-path step outcomes in timeline query |

## Coverage Checklist

- [x] Every documented transition family is counted (O1)
- [x] Every state machine has population tracking (O2)
- [x] Every invariant family has runtime monitor hooks (O3)
- [x] Every operation has base metrics (O4)
- [x] Every rule family maps to violation counters (O5)
- [x] Priority calculations map to drift checks (O6)
- [x] Postconditions map to verification counters (O7)
- [ ] HTTP endpoint SLOs deferred until transport adapter is explicit (O8)
- [x] Idempotency constraints are monitored (O9)
- [x] Event flow metrics are defined (O10)
- [x] Query performance metrics are defined (O11)
- [x] Workflow completion metrics are defined (O12)
- [x] Capability KPIs are defined (O13)
- [x] Story funnels are defined (O14)
- [x] Financial integrity metrics are provisionally defined (O15-O16)
