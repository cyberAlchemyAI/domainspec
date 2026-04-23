# Mappings: Commodity Crisis Signal MVP

## NarrativeThesisToStrategyThesis

**From:** [Strategy Thesis and Asset Matrix](../../STRATEGY-THESIS.md)
**To:** [StrategyThesis](domain.md#strategythesis)
**Direction:** Inbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| ------------ | ------------ | --------- | ----- |
| Macro Thesis statement | [StrategyThesis](domain.md#strategythesis).thesisStatement | direct | Canonical proposition text |
| Telemetry and Exit Parameters (Brent threshold) | [StrategyThesis](domain.md#strategythesis).brentFloorUsd | computed | Parse numeric floor threshold from thesis contract |
| Propagation Logic expected delay | [StrategyThesis](domain.md#strategythesis).lagWindowDays | computed | Convert delay bands to integer window |
| Approved V1 Threshold Profile | [StrategyThesis](domain.md#strategythesis).minAlignmentScore | computed | Convert profile to minimum thesis score baseline |
| Entry strategy composition table | [StrategyThesis](domain.md#strategythesis).entryPriceStrategies | computed | Normalize each row into deterministic strategy config |
| Exit strategy composition table | [StrategyThesis](domain.md#strategythesis).exitPriceStrategies | computed | Normalize each row into deterministic strategy config |
| Composition policy declaration | [StrategyThesis](domain.md#strategythesis).priceCompositionMode | computed | Map policy text to enum mode |
| Strategy agreement threshold | [StrategyThesis](domain.md#strategythesis).minStrategyAgreementScore | computed | Parse numeric agreement threshold |

### Defaults

| Target Field | Default Value | Condition |
| ------------ | ------------- | --------- |
| [StrategyThesis](domain.md#strategythesis).thesisStatus | Draft | On first registration |
| [StrategyThesis](domain.md#strategythesis).priceCompositionMode | WeightedAverage | Composition mode is omitted in source thesis |
| [StrategyThesis](domain.md#strategythesis).minStrategyAgreementScore | 0.55 | Agreement threshold is omitted in source thesis |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies[].volatilityLookbackPeriods | 14 | strategyCode is volatility_trailing_stop and field is omitted |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies[].volatilityMultiplier | 2.0 | strategyCode is volatility_trailing_stop and field is omitted |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies[].maxHoldingMinutes | 1440 | strategyCode is time_stop_window and field is omitted |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies[].structureLookbackBars | 20 | strategyCode is structure_break_exit and field is omitted |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies[].structureBreakBufferPercent | 0.35 | strategyCode is structure_break_exit and field is omitted |

### Validation

| Field | Validation | On Failure |
| ----- | ---------- | ---------- |
| [StrategyThesis](domain.md#strategythesis).thesisStatement | non-empty narrative | Reject mapping with missing_thesis_statement |
| [StrategyThesis](domain.md#strategythesis).lagWindowDays | `lagWindowDays > 0` | Reject mapping with invalid_lag_window |
| [StrategyThesis](domain.md#strategythesis).entryPriceStrategies | `count(entryPriceStrategies) >= 1 and sum(weight) == 1` | Reject mapping with invalid_entry_strategy_weights |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies | `count(exitPriceStrategies) >= 1 and sum(weight) == 1` | Reject mapping with invalid_exit_strategy_weights |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies | `strategyCode == volatility_trailing_stop -> volatilityLookbackPeriods >= 2 and volatilityMultiplier > 0` | Reject mapping with invalid_volatility_exit_config |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies | `strategyCode == time_stop_window -> maxHoldingMinutes > 0` | Reject mapping with invalid_time_stop_config |
| [StrategyThesis](domain.md#strategythesis).exitPriceStrategies | `strategyCode == structure_break_exit -> structureLookbackBars >= 2 and 0 <= structureBreakBufferPercent <= 5` | Reject mapping with invalid_structure_break_config |
| [StrategyThesis](domain.md#strategythesis).minStrategyAgreementScore | `0 <= minStrategyAgreementScore <= 1` | Reject mapping with invalid_strategy_agreement_threshold |

---

## ProviderPayloadToMarketSnapshot

**From:** External provider response
**To:** [MarketSnapshot](domain.md#marketsnapshot)
**Direction:** Inbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| ------------ | ------------ | --------- | ----- |
| ticker or symbol | [MarketSnapshot](domain.md#marketsnapshot).symbol | direct | Normalize aliases to canonical symbol |
| venue | [MarketSnapshot](domain.md#marketsnapshot).marketVector | computed | Map exchange code to B3 or US |
| close or last or price | [MarketSnapshot](domain.md#marketsnapshot).lastPrice | computed | Prefer real-time last, fallback to delayed close |
| timestamp | [MarketSnapshot](domain.md#marketsnapshot).observedAt | direct | Convert to ISO-8601 UTC |
| sourceName | [MarketSnapshot](domain.md#marketsnapshot).source | direct | Persist provider identifier |

### Defaults

| Target Field | Default Value | Condition |
| ------------ | ------------- | --------- |
| [MarketSnapshot](domain.md#marketsnapshot).source | unknown_provider | Source is missing |

### Validation

| Field | Validation | On Failure |
| ----- | ---------- | ---------- |
| [MarketSnapshot](domain.md#marketsnapshot).lastPrice | `lastPrice > 0` | Reject payload and log invalid_price |
| [MarketSnapshot](domain.md#marketsnapshot).observedAt | within freshness window | Reject payload and log stale_snapshot |
| [MarketSnapshot](domain.md#marketsnapshot).source | `marketVector == B3 -> source in {broker_native_primary, brapi_pro_fallback}; marketVector == US -> source == twelve_data_primary` | Reject payload and log invalid_source_for_market_vector |

---

## ShippingProxyPayloadToRegimeTelemetry

**From:** Shipping and geopolitical proxy feeds
**To:** [RegimeTelemetry](domain.md#regimetelemetry)
**Direction:** Inbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| ------------ | ------------ | --------- | ----- |
| balticDryIndexTrend | [RegimeTelemetry](domain.md#regimetelemetry).bdiTrendScore | normalize to 0..1 | Higher means stronger disruption pressure |
| containerFreightTrend | [RegimeTelemetry](domain.md#regimetelemetry).containerFreightTrendScore | normalize to 0..1 | Captures freight persistence |
| disruptionEventTags | [RegimeTelemetry](domain.md#regimetelemetry).disruptionEventScore | weighted event scoring | Uses curated event taxonomy |
| computed aggregate | [RegimeTelemetry](domain.md#regimetelemetry).shippingDisruptionScore | `0.34*bdiTrendScore + 0.33*containerFreightTrendScore + 0.33*disruptionEventScore` | Deterministic proxy aggregate |

### Validation

| Field | Validation | On Failure |
| ----- | ---------- | ---------- |
| [RegimeTelemetry](domain.md#regimetelemetry).bdiTrendScore | `0 <= score <= 1` | Reject mapping with invalid_bdi_score |
| [RegimeTelemetry](domain.md#regimetelemetry).containerFreightTrendScore | `0 <= score <= 1` | Reject mapping with invalid_container_score |
| [RegimeTelemetry](domain.md#regimetelemetry).disruptionEventScore | `0 <= score <= 1` | Reject mapping with invalid_event_score |

---

## SignalDecisionToPaperLedgerEntry

**From:** [SignalDecision](domain.md#signaldecision)
**To:** Paper-trading ledger DTO
**Direction:** Outbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| ------------ | ------------ | --------- | ----- |
| [SignalDecision](domain.md#signaldecision).id | ledgerEntry.decisionId | direct | Primary correlation key |
| [SignalDecision](domain.md#signaldecision).thesisId | ledgerEntry.thesisId | direct | Trace decision back to thesis version family |
| [SignalDecision](domain.md#signaldecision).thesisVersion | ledgerEntry.thesisVersion | direct | Trace exact thesis version |
| [SignalDecision](domain.md#signaldecision).signalType | ledgerEntry.intent | direct | buy/sell/hold intent |
| [SignalDecision](domain.md#signaldecision).confidenceScore | ledgerEntry.confidence | direct | 0.0 to 1.0 score |
| [SignalDecision](domain.md#signaldecision).entryPricePlan.composedEntryPrice | ledgerEntry.plannedEntryPrice | direct | Composed entry anchor |
| [SignalDecision](domain.md#signaldecision).exitPricePlan.protectiveStopPrice | ledgerEntry.protectiveStopPrice | direct | Composed stop anchor |
| [SignalDecision](domain.md#signaldecision).exitPricePlan.takeProfitPrice | ledgerEntry.takeProfitPrice | direct | Composed target anchor |
| [SignalDecision](domain.md#signaldecision).executedEntryPrice | ledgerEntry.entryExecutedPrice | direct | Realized entry fill |
| [SignalDecision](domain.md#signaldecision).executedExitPrice | ledgerEntry.exitExecutedPrice | direct | Realized exit fill |
| [SignalDecision](domain.md#signaldecision).reasonCode | ledgerEntry.reasonCode | direct | Deterministic traceability |
| [SignalDecision](domain.md#signaldecision).generatedAt | ledgerEntry.createdAt | direct | UTC timestamp |

### Defaults

| Target Field | Default Value | Condition |
| ------------ | ------------- | --------- |
| ledgerEntry.executionMode | paper | Always in V1 |

### Validation

| Field | Validation | On Failure |
| ----- | ---------- | ---------- |
| ledgerEntry.intent | in {buy,sell,hold} | Reject mapping with invalid_intent |
| ledgerEntry.confidence | `0 <= confidence <= 1` | Reject mapping with invalid_confidence |
| ledgerEntry.plannedEntryPrice | `plannedEntryPrice > 0` for executable intents | Reject mapping with invalid_planned_entry_price |
| ledgerEntry.entryExecutedPrice | `entryExecutedPrice > 0` when decisionStatus in {Executed, Closed} | Reject mapping with invalid_entry_execution_price |
