# Events: Commodity Crisis Signal MVP

## ThesisActivated

**Produced by:** [ActivateStrategyThesis](operations.md#activatestrategythesis)
**Triggers transition:** [Candidate -> Active](states.md#thesisstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | Activated thesis identifier |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | Owning profile |
| thesisVersion | integer | Activated version number |
| activatedAt | string (ISO-8601) | Activation timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Signal engine | Bind active thesis for scoring |
| Governance timeline projection | Record thesis lifecycle transition |

---

## ThesisAlignmentEvaluated

**Produced by:** [EvaluateThesisAlignment](operations.md#evaluatethesisalignment)
**Triggers transition:** [Active -> Challenged](states.md#thesisstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | Evaluated thesis |
| thesisStatus | [ThesisStatus](domain.md#thesisstatus) | Status after evaluation |
| alignmentScore | number | Current alignment score |
| invalidationPressureScore | number | Composite invalidation pressure |
| consecutiveBelowThresholdCount | integer | Rolling below-threshold count |
| consecutiveRecoveryCount | integer | Rolling recovery count while challenged |
| challengeWindowCycles | integer | Configured challenge persistence window (V1 = 2) |
| recoveryWindowCycles | integer | Configured recovery persistence window (V1 = 2) |
| evaluatedAt | string (ISO-8601) | Evaluation timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Thesis governance review | Track degradation and recovery windows |
| Alerting policy | Raise warning when thesis remains challenged |

---

## SignalGenerated

**Produced by:** [GenerateSignal](operations.md#generatesignal)
**Triggers transition:** [Draft -> Emitted](states.md#signaldecisionstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | Generated decision identifier |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | Profile origin |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | Thesis used for scoring |
| thesisVersion | integer | Thesis version used for scoring |
| signalType | [SignalType](domain.md#signaltype) | Buy, sell, or hold |
| confidenceScore | number | Decision confidence |
| reasonCode | string | Deterministic explanation code |
| generatedAt | string (ISO-8601) | Event timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Paper execution adapter | Simulate intended execution |
| Signal timeline projection | Build read model for chronology |
| Risk engine | Run envelope validation |

---

## EntryPricePlanResolved

**Produced by:** [ResolveEntryPricePlan](operations.md#resolveentrypriceplan)
**Triggers transition:** [Emitted -> Emitted](states.md#signaldecisionstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | Decision enriched with entry plan |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | Thesis that provided strategy configuration |
| composedEntryPrice | number | Composed entry price from eligible strategies |
| selectedStrategyCode | [EntryPriceStrategyCode](domain.md#entrypricestrategycode) | Dominant entry strategy selected by composition |
| agreementScore | number | Weighted agreement score for entry proposals |
| resolvedAt | string (ISO-8601) | Resolution timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Risk engine | Validate execution eligibility after pricing plan resolution |
| Paper execution adapter | Use composed entry price as execution anchor |

---

## ExitPricePlanResolved

**Produced by:** [ResolveExitPricePlan](operations.md#resolveexitpriceplan)
**Triggers transition:** [Emitted -> Emitted](states.md#signaldecisionstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | Decision enriched with exit plan |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | Thesis that provided strategy configuration |
| protectiveStopPrice | number | Composed protective stop price |
| takeProfitPrice | number | Composed take-profit target |
| selectedStrategyCode | [ExitPriceStrategyCode](domain.md#exitpricestrategycode) | Dominant exit strategy selected by composition |
| agreementScore | number | Weighted agreement score for exit proposals |
| resolvedAt | string (ISO-8601) | Resolution timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Exit controller | Monitor trigger conditions using composed plan |
| Timeline projection | Expose pre-close exit plan context |

---

## RiskBreachDetected

**Produced by:** [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope)
**Triggers transition:** [Emitted -> Blocked](states.md#signaldecisionstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | Affected decision |
| breachType | string | margin_cap_breach or drawdown_stop_breach |
| observedValue | number | Breach metric value |
| thresholdValue | number | Rule threshold |
| observedAt | string (ISO-8601) | Event timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Risk dashboard projection | Surface compliance drift |
| Alerting policy | Flag P0 risk conditions |

---

## RegimeInvalidated

**Produced by:** [ProcessInvalidation](operations.md#processinvalidation)
**Triggers transition:** [Triggered -> Invalidated](states.md#regimestate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | Invalidated profile |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | Invalidated thesis |
| invalidationReason | [InvalidationReasonCode](domain.md#invalidationreasoncode) | Trigger source |
| brentPrice | number | Brent snapshot at invalidation |
| shippingDisruptionScore | number | Shipping score at invalidation |
| detectedAt | string (ISO-8601) | Detection timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Exit workflow | Start phased unwind |
| Signal engine | Block buy emissions |

---

## SignalClosed

**Produced by:** [CloseSignalDecision](operations.md#closesignaldecision)
**Triggers transition:** [Executed -> Closed](states.md#signaldecisionstate), [Blocked -> Closed](states.md#signaldecisionstate)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | Closed decision |
| closeReason | string | Reason code |
| closePrice | number | Exit execution price |
| exitStrategyCode | [ExitPriceStrategyCode](domain.md#exitpricestrategycode) | Exit strategy used at closure |
| realizedMovePercent | number | Signed move from entry to close |
| closedAt | string (ISO-8601) | Closure timestamp |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Performance analytics | Compute hold duration and outcomes |
| Audit trail | Persist terminal lifecycle evidence |
