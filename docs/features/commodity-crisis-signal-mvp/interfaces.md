# Interfaces: Commodity Crisis Signal MVP

## External Boundary: StrategyApplicationPort (Transport-Agnostic)

This MVP intentionally defines transport-neutral contracts first.
Concrete HTTP, gRPC, CLI, or message-bus adapters can be implemented later without changing domain semantics.

### StrategyCommandPort

#### EvaluateSignalCommand

**Exposes:** [GenerateSignal](operations.md#generatesignal)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [GenerateSignal](operations.md#generatesignal).profileId |
| thesisId | string | [GenerateSignal](operations.md#generatesignal).thesisId |
| telemetry | object | [GenerateSignal](operations.md#generatesignal).telemetry |
| marketSnapshots | array | [GenerateSignal](operations.md#generatesignal).marketSnapshots |
| triggerTimestamp | string | [GenerateSignal](operations.md#generatesignal).triggerTimestamp |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| accepted | Decision emitted | decisionId, thesisId, thesisVersion, signalType, confidenceScore, plannedEntryPrice, protectiveStopPrice, takeProfitPrice, reasonCode |
| rejected | Rule violation | errorCode, failedRule |

---

#### ActivateThesisCommand

**Exposes:** [ActivateStrategyThesis](operations.md#activatestrategythesis)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [ActivateStrategyThesis](operations.md#activatestrategythesis).profileId |
| thesisId | string | [ActivateStrategyThesis](operations.md#activatestrategythesis).thesisId |
| activatedAt | string | [ActivateStrategyThesis](operations.md#activatestrategythesis).activatedAt |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| accepted | Thesis activated | profileId, thesisId, thesisVersion, thesisStatus |
| rejected | Activation guard failed | errorCode, failedRule |

---

#### InvalidateRegimeCommand

**Exposes:** [ProcessInvalidation](operations.md#processinvalidation)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [ProcessInvalidation](operations.md#processinvalidation).profileId |
| thesisId | string | [ProcessInvalidation](operations.md#processinvalidation).thesisId |
| invalidationReason | [InvalidationReasonCode](domain.md#invalidationreasoncode) | [ProcessInvalidation](operations.md#processinvalidation).invalidationReason |
| detectedAt | string | [ProcessInvalidation](operations.md#processinvalidation).detectedAt |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| accepted | Invalidation accepted | profileId, regimeState |
| rejected | Unknown reason | errorCode, message |

---

#### CloseSignalDecisionCommand

**Exposes:** [CloseSignalDecision](operations.md#closesignaldecision)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| decisionId | string | [CloseSignalDecision](operations.md#closesignaldecision).decisionId |
| closeReason | string | [CloseSignalDecision](operations.md#closesignaldecision).closeReason |
| closePrice | number | [CloseSignalDecision](operations.md#closesignaldecision).closePrice |
| exitStrategyCode | string | [CloseSignalDecision](operations.md#closesignaldecision).exitStrategyCode |
| closedAt | string | [CloseSignalDecision](operations.md#closesignaldecision).closedAt |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| accepted | Close accepted | decisionId, closePrice, closeReason, closedAt |
| rejected | Close guard failed | errorCode, failedRule |

---

### StrategyQueryPort

#### GetThesisStatusQuery

**Exposes:** [GetThesisStatus](queries.md#getthesisstatus)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [GetThesisStatus](queries.md#getthesisstatus).profileId |
| thesisId | string | [GetThesisStatus](queries.md#getthesisstatus).thesisId |
| thesisStatus | string | [GetThesisStatus](queries.md#getthesisstatus).thesisStatus |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| found | Query success | thesis status payload |
| missing | Thesis not found | errorCode, message |

---

#### GetSignalTimelineQuery

**Exposes:** [GetSignalTimeline](queries.md#getsignaltimeline)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [GetSignalTimeline](queries.md#getsignaltimeline).profileId |
| from | string | [GetSignalTimeline](queries.md#getsignaltimeline).from |
| to | string | [GetSignalTimeline](queries.md#getsignaltimeline).to |
| signalType | string | [GetSignalTimeline](queries.md#getsignaltimeline).signalType |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| found | Query success | timeline array, pagination |
| rejected | Invalid date range | errorCode, message |

---

#### GetOpenPositionPricingQuery

**Exposes:** [GetOpenPositionPricing](queries.md#getopenpositionpricing)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [GetOpenPositionPricing](queries.md#getopenpositionpricing).profileId |
| decisionId | string | [GetOpenPositionPricing](queries.md#getopenpositionpricing).decisionId |
| marketVector | string | [GetOpenPositionPricing](queries.md#getopenpositionpricing).marketVector |
| strategyCode | string | [GetOpenPositionPricing](queries.md#getopenpositionpricing).strategyCode |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| found | Query success | position pricing array |
| missing | No open position found | errorCode, message |

---

#### GetRiskStatusQuery

**Exposes:** [GetRiskStatus](queries.md#getriskstatus)

**Input:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| profileId | string | [GetRiskStatus](queries.md#getriskstatus).profileId |
| at | string | [GetRiskStatus](queries.md#getriskstatus).at |

**Output Variants:**

| Result | Condition | Body |
| ------ | --------- | ---- |
| found | Query success | margin and drawdown metrics |
| missing | Profile not found | errorCode, message |

---

### Deferred Transport Realization

1. Concrete external API services are deferred by design in this MVP phase.
2. Future transport adapters must map these command/query contracts without changing operation or query semantics.

## Internal: MarketDataProvider Interface

**Consumers:** Signal generation workflow

| Method | Maps To | Description |
| ------ | ------- | ----------- |
| fetchSnapshots(profileId, at) | [GenerateSignal](operations.md#generatesignal) operation | Returns normalized market snapshots for required symbols |
| fetchTelemetry(profileId, at) | [GenerateSignal](operations.md#generatesignal) operation | Returns regime telemetry vector |
| fetchOrderBookDepth(symbol, at) | [ResolveEntryPricePlan](operations.md#resolveentrypriceplan) operation | Returns depth map required by order-book interest zone strategy |
| fetchVolatilityMetrics(symbol, at, lookbackPeriods) | [ResolveExitPricePlan](operations.md#resolveexitpriceplan) operation | Returns realized volatility inputs for volatility trailing stop |
| fetchStructureLevels(symbol, at, lookbackBars) | [ResolveExitPricePlan](operations.md#resolveexitpriceplan) operation | Returns support/resistance snapshot for structure-break exit |
| fetchPositionAge(decisionId, at) | [ResolveExitPricePlan](operations.md#resolveexitpriceplan) operation | Returns position age for time-stop evaluation |
| fetchThesisInputs(thesisId, at) | [EvaluateThesisAlignment](operations.md#evaluatethesisalignment) operation | Returns thesis-specific indicators and lag observations |
| fetchShippingProxies(profileId, at) | [EvaluateThesisAlignment](operations.md#evaluatethesisalignment) operation | Returns BDI trend, container freight trend, and disruption event proxy inputs |
| reportFreshness(symbols) | [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope) operation | Reports age and quality of latest data |

### Source Priority Contract (V1)

1. B3 leg: broker-native paper feed/export primary, brapi Pro fallback.
2. US and macro leg: Twelve Data primary.
3. Shipping proxies: public proxy set with manual event-tag fallback.
