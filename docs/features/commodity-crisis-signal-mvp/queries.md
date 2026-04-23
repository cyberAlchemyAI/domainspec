# Queries: Commodity Crisis Signal MVP

## GetSignalTimeline

**Type:** Query (read-only)
**Actor:** Founder-operator, Analyst, System Dashboard

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Profile to inspect |
| from | string (ISO-8601) | yes | Start timestamp |
| to | string (ISO-8601) | yes | End timestamp |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| signalType | [SignalType](domain.md#signaltype) | all | Optional type filter |
| decisionStatus | [DecisionStatus](domain.md#decisionstatus) | all | Optional lifecycle status filter |
| marketVector | [MarketVector](domain.md#marketvector) | all | Optional market vector filter |
| pageSize | integer | 100 | Page size for large timelines |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| decisionId | string | [SignalDecision](domain.md#signaldecision).id | Decision identifier |
| thesisId | string | [SignalDecision](domain.md#signaldecision).thesisId | Thesis bound to decision |
| thesisVersion | integer | [SignalDecision](domain.md#signaldecision).thesisVersion | Thesis version bound to decision |
| generatedAt | string (ISO-8601) | [SignalDecision](domain.md#signaldecision).generatedAt | Creation timestamp |
| signalType | string | [SignalDecision](domain.md#signaldecision).signalType | Decision type |
| confidenceScore | number | [SignalDecision](domain.md#signaldecision).confidenceScore | Confidence |
| plannedEntryPrice | number | [SignalDecision](domain.md#signaldecision).entryPricePlan.composedEntryPrice | Composed entry price |
| protectiveStopPrice | number | [SignalDecision](domain.md#signaldecision).exitPricePlan.protectiveStopPrice | Composed protective stop |
| takeProfitPrice | number | [SignalDecision](domain.md#signaldecision).exitPricePlan.takeProfitPrice | Composed take-profit target |
| strategyAgreementScore | number | [SignalDecision](domain.md#signaldecision).strategyAgreementScore | Weighted strategy agreement score |
| executedEntryPrice | number | [SignalDecision](domain.md#signaldecision).executedEntryPrice | Actual entry execution price |
| executedExitPrice | number | [SignalDecision](domain.md#signaldecision).executedExitPrice | Actual exit execution price |
| decisionStatus | string | [SignalDecision](domain.md#signaldecision).decisionStatus | Lifecycle status |
| reasonCode | string | [SignalDecision](domain.md#signaldecision).reasonCode | Deterministic explanation code |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [SignalDecision](domain.md#signaldecision) | queries | id, thesisId, thesisVersion, generatedAt, signalType, confidenceScore, entryPricePlan, exitPricePlan, strategyAgreementScore, executedEntryPrice, executedExitPrice, decisionStatus, reasonCode |

---

## GetRiskStatus

**Type:** Query (read-only)
**Actor:** Risk dashboard and governance checks

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Profile to evaluate |
| at | string (ISO-8601) | no | Point-in-time snapshot |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| marketVector | [MarketVector](domain.md#marketvector) | all | Scope risk to B3 or US vector |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| marginUsagePercent | number | [RiskEnvelope](domain.md#riskenvelope).marginUsagePercent | Current margin usage |
| maxMarginPercent | number | [RiskEnvelope](domain.md#riskenvelope).maxMarginPercent | Configured max margin |
| currentDrawdownPercent | number | [RiskEnvelope](domain.md#riskenvelope).currentDrawdownPercent | Current drawdown |
| stopDrawdownPercent | number | [RiskEnvelope](domain.md#riskenvelope).stopDrawdownPercent | Configured stop |
| regimeState | string | [SignalDecision](domain.md#signaldecision).regimeState | Current regime snapshot |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [SignalDecision](domain.md#signaldecision) | queries | regimeState |
| [RiskEnvelope](domain.md#riskenvelope) | queries | marginUsagePercent, maxMarginPercent, currentDrawdownPercent, stopDrawdownPercent |

---

## GetOpenPositionPricing

**Type:** Query (read-only)
**Actor:** Founder-operator, risk dashboard, strategy reviewer

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Profile to inspect |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | no | Optional specific decision |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| marketVector | [MarketVector](domain.md#marketvector) | all | Scope positions by market vector |
| strategyCode | string | all | Filter by entry or exit strategy code |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| decisionId | string | [SignalDecision](domain.md#signaldecision).id | Decision identifier |
| entryStrategyCode | string | [PaperPosition](domain.md#paperposition).entryStrategyCode | Selected entry strategy |
| exitStrategyCode | string | [PaperPosition](domain.md#paperposition).exitStrategyCode | Selected exit strategy |
| plannedEntryPrice | number | [PaperPosition](domain.md#paperposition).plannedEntryPrice | Entry plan anchor |
| protectiveStopPrice | number | [PaperPosition](domain.md#paperposition).protectiveStopPrice | Protective stop |
| takeProfitPrice | number | [PaperPosition](domain.md#paperposition).takeProfitPrice | Take-profit target |
| entryExecutedPrice | number | [PaperPosition](domain.md#paperposition).entryExecutedPrice | Actual entry fill |
| exitExecutedPrice | number | [PaperPosition](domain.md#paperposition).exitExecutedPrice | Exit fill when closed |
| decisionStatus | string | [SignalDecision](domain.md#signaldecision).decisionStatus | Lifecycle status |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [SignalDecision](domain.md#signaldecision) | queries | id, decisionStatus |
| [PaperPosition](domain.md#paperposition) | queries | decisionId, entryStrategyCode, exitStrategyCode, plannedEntryPrice, protectiveStopPrice, takeProfitPrice, entryExecutedPrice, exitExecutedPrice |

---

## GetThesisStatus

**Type:** Query (read-only)
**Actor:** Founder-operator, governance reviewer, risk dashboard

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Profile to inspect |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | no | Specific thesis to inspect |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| thesisStatus | [ThesisStatus](domain.md#thesisstatus) | all | Optional status filter |
| includeHistory | boolean | false | Include previous thesis versions |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| thesisId | string | [StrategyThesis](domain.md#strategythesis).id | Thesis identifier |
| thesisVersion | integer | [StrategyThesis](domain.md#strategythesis).thesisVersion | Thesis version |
| thesisStatus | string | [StrategyThesis](domain.md#strategythesis).thesisStatus | Current thesis lifecycle status |
| lastAlignmentScore | number | [StrategyThesis](domain.md#strategythesis).lastAlignmentScore | Latest alignment score |
| minAlignmentScore | number | [StrategyThesis](domain.md#strategythesis).minAlignmentScore | Governance threshold |
| challengeWindowCycles | integer | [StrategyThesis](domain.md#strategythesis).challengeWindowCycles | Consecutive below-threshold evaluations required |
| recoveryWindowCycles | integer | [StrategyThesis](domain.md#strategythesis).recoveryWindowCycles | Consecutive recovery evaluations required |
| consecutiveBelowThresholdCount | integer | [StrategyThesis](domain.md#strategythesis).consecutiveBelowThresholdCount | Current below-threshold streak |
| consecutiveRecoveryCount | integer | [StrategyThesis](domain.md#strategythesis).consecutiveRecoveryCount | Current recovery streak while challenged |
| lastEvaluatedAt | string (ISO-8601) | [StrategyThesis](domain.md#strategythesis).lastEvaluatedAt | Last evaluation timestamp |
| invalidatedAt | string (ISO-8601) | [StrategyThesis](domain.md#strategythesis).invalidatedAt | Invalidation timestamp if present |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [StrategyThesis](domain.md#strategythesis) | queries | id, thesisVersion, thesisStatus, lastAlignmentScore, minAlignmentScore, challengeWindowCycles, recoveryWindowCycles, consecutiveBelowThresholdCount, consecutiveRecoveryCount, lastEvaluatedAt, invalidatedAt |
