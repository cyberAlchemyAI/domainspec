# Domain: Commodity Crisis Signal MVP

## Entities

### StrategyProfile

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | [StrategyProfileId](#strategyprofileid) | yes | Unique profile identifier |
| name | string | yes | Human-readable profile name |
| status | [ProfileStatus](#profilestatus) | yes | Profile lifecycle status |
| cadenceMode | [CadenceMode](#cadencemode) | yes | Signal cadence strategy |
| intradayIntervalMinutes | integer | no | Configurable intraday schedule when cadence includes intraday |
| createdAt | string (ISO-8601) | yes | Creation timestamp |
| updatedAt | string (ISO-8601) | yes | Last update timestamp |

**Lifecycle:** See [RegimeState](states.md#regimestate)
**Operations:** [ActivateStrategyThesis](operations.md#activatestrategythesis), [GenerateSignal](operations.md#generatesignal), [ProcessInvalidation](operations.md#processinvalidation)

---

### StrategyThesis

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | [StrategyThesisId](#strategythesisid) | yes | Unique thesis identifier |
| profileId | [StrategyProfileId](#strategyprofileid) | yes | Owning strategy profile |
| thesisVersion | integer | yes | Monotonic thesis version |
| thesisStatement | string | yes | Formal proposition under test |
| thesisStatus | [ThesisStatus](#thesisstatus) | yes | Thesis lifecycle status |
| brentFloorUsd | number | yes | Brent floor assumption for invalidation checks |
| lagWindowDays | integer | yes | Expected propagation latency window |
| minAlignmentScore | number | yes | Minimum acceptable alignment score from evaluation |
| entryPriceStrategies | [EntryPriceStrategyConfig](#entrypricestrategyconfig)[] | yes | Ordered entry-price strategy modules with deterministic weights |
| exitPriceStrategies | [ExitPriceStrategyConfig](#exitpricestrategyconfig)[] | yes | Ordered exit-price strategy modules with deterministic weights |
| priceCompositionMode | [PriceCompositionMode](#pricecompositionmode) | yes | Composition behavior used when combining strategy module proposals |
| minStrategyAgreementScore | number | yes | Minimum weighted agreement required to accept composed pricing plans |
| challengeWindowCycles | integer | yes | Consecutive below-threshold evaluations required to mark challenged (V1 = 2) |
| recoveryWindowCycles | integer | yes | Consecutive recovery evaluations required to return active (V1 = 2) |
| lastAlignmentScore | number | no | Latest computed thesis alignment score |
| consecutiveBelowThresholdCount | integer | no | Rolling count of below-threshold alignment results |
| consecutiveRecoveryCount | integer | no | Rolling count of above-threshold recovery results while challenged |
| lastEvaluatedAt | string (ISO-8601) | no | Last thesis evaluation timestamp |
| activeFrom | string (ISO-8601) | no | Activation timestamp |
| invalidatedAt | string (ISO-8601) | no | Invalidation timestamp |

**Lifecycle:** See [ThesisState](states.md#thesisstate)
**Operations:** [ActivateStrategyThesis](operations.md#activatestrategythesis), [EvaluateThesisAlignment](operations.md#evaluatethesisalignment), [ProcessInvalidation](operations.md#processinvalidation)

---

### SignalDecision

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | [SignalDecisionId](#signaldecisionid) | yes | Unique decision identifier |
| profileId | [StrategyProfileId](#strategyprofileid) | yes | Owning strategy profile |
| thesisId | [StrategyThesisId](#strategythesisid) | yes | Active thesis used for scoring |
| thesisVersion | integer | yes | Thesis version bound to this decision |
| signalType | [SignalType](#signaltype) | yes | Buy, sell, or hold outcome |
| confidenceScore | number | yes | Confidence from 0.0 to 1.0 |
| entryPricePlan | [EntryPricePlan](#entrypriceplan) | no | Composed entry-price plan resolved for executable decisions |
| exitPricePlan | [ExitPricePlan](#exitpriceplan) | no | Composed exit-price plan resolved for executable decisions |
| strategyAgreementScore | number | no | Weighted agreement score across participating pricing strategies |
| decisionStatus | [DecisionStatus](#decisionstatus) | yes | Decision lifecycle state |
| regimeState | [RegimeStateType](#regimestatetype) | yes | Regime state at decision time |
| reasonCode | string | yes | Deterministic explanation code |
| generatedAt | string (ISO-8601) | yes | Decision creation timestamp |
| executedAt | string (ISO-8601) | no | Entry execution timestamp when paper execution is recorded |
| executedEntryPrice | number | no | Entry execution price used for quantity and PnL baseline |
| executedExitPrice | number | no | Exit execution price recorded at closure |
| closedAt | string (ISO-8601) | no | Terminal closure timestamp |

**Lifecycle:** See [SignalDecisionState](states.md#signaldecisionstate)
**Operations:** [GenerateSignal](operations.md#generatesignal), [ResolveEntryPricePlan](operations.md#resolveentrypriceplan), [ResolveExitPricePlan](operations.md#resolveexitpriceplan), [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope), [RecordPaperExecution](operations.md#recordpaperexecution), [CloseSignalDecision](operations.md#closesignaldecision)

---

### PaperPosition

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | [PaperPositionId](#paperpositionid) | yes | Unique paper position identifier |
| decisionId | [SignalDecisionId](#signaldecisionid) | yes | Source decision |
| instrumentSymbol | string | yes | Traded instrument symbol |
| marketVector | [MarketVector](#marketvector) | yes | B3 or US exposure vector |
| notionalValue | number | yes | Intended notional exposure |
| entryStrategyCode | [EntryPriceStrategyCode](#entrypricestrategycode) | no | Entry strategy code selected by composition policy |
| exitStrategyCode | [ExitPriceStrategyCode](#exitpricestrategycode) | no | Exit strategy code selected at close |
| plannedEntryPrice | number | no | Planned entry price from composed entry plan |
| protectiveStopPrice | number | no | Planned protective stop from composed exit plan |
| takeProfitPrice | number | no | Planned target from composed exit plan |
| entryExecutedPrice | number | no | Executed entry price used in paper ledger |
| exitExecutedPrice | number | no | Executed exit price when position closes |
| simulatedPnl | number | no | Simulated mark-to-market result |
| openedAt | string (ISO-8601) | yes | Open time |
| closedAt | string (ISO-8601) | no | Close time |

**Lifecycle:** See [SignalDecisionState](states.md#signaldecisionstate)
**Operations:** [RecordPaperExecution](operations.md#recordpaperexecution), [CloseSignalDecision](operations.md#closesignaldecision)

---

## Value Objects

### ThesisAlignmentSnapshot

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| thesisId | [StrategyThesisId](#strategythesisid) | Must reference existing thesis |
| alignmentScore | number | `0 <= alignmentScore <= 1` |
| floorPressureScore | number | `0 <= floorPressureScore <= 1` |
| invalidationPressureScore | number | `0 <= invalidationPressureScore <= 1` |
| evaluatedAt | string (ISO-8601) | Must be monotonic per thesis |

**Equality:** Same thesisId and evaluatedAt values.

---

### RiskEnvelope

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| marginUsagePercent | number | `0 <= marginUsagePercent <= 100` |
| maxMarginPercent | number | `maxMarginPercent = 10` in V1 |
| stopDrawdownPercent | number | `stopDrawdownPercent = 2` for futures legs |
| currentDrawdownPercent | number | `0 <= currentDrawdownPercent <= 100` |

**Equality:** Field-by-field equality across all numeric fields.

---

### MarketSnapshot

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| symbol | string | Must map to known instrument universe |
| marketVector | [MarketVector](#marketvector) | Must be B3 or US |
| lastPrice | number | `lastPrice > 0` |
| observedAt | string (ISO-8601) | Must be within freshness window |
| source | string | Must map to approved provider source |

**Equality:** Same symbol, timestamp, and source.

---

### RegimeTelemetry

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| brentPrice | number | `brentPrice > 0` |
| henryHubPrice | number | `henryHubPrice > 0` |
| brlUsd | number | `brlUsd > 0` |
| bdiTrendScore | number | `0 <= score <= 1` |
| containerFreightTrendScore | number | `0 <= score <= 1` |
| disruptionEventScore | number | `0 <= score <= 1` |
| shippingDisruptionScore | number | `0 <= score <= 1` |
| observedAt | string (ISO-8601) | Must satisfy freshness constraints |

**Equality:** Same observedAt plus all metric values equal.

---

### EntryPriceStrategyConfig

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| strategyCode | [EntryPriceStrategyCode](#entrypricestrategycode) | Must be one supported entry strategy |
| weight | number | `0 < weight <= 1` |
| minConfidence | number | `0 <= minConfidence <= 1` |
| maxSlippagePercent | number | `0 <= maxSlippagePercent <= 5` |
| required | boolean | Required strategy must participate in composed plan |

**Equality:** Same strategyCode and parameter values.

---

### ExitPriceStrategyConfig

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| strategyCode | [ExitPriceStrategyCode](#exitpricestrategycode) | Must be one supported exit strategy |
| weight | number | `0 < weight <= 1` |
| stopOffsetPercent | number | `0 < stopOffsetPercent <= 10` |
| targetMultipleR | number | `targetMultipleR > 0` |
| volatilityLookbackPeriods | integer | `strategyCode == volatility_trailing_stop -> volatilityLookbackPeriods >= 2` |
| volatilityMultiplier | number | `strategyCode == volatility_trailing_stop -> volatilityMultiplier > 0` |
| maxHoldingMinutes | integer | `strategyCode == time_stop_window -> maxHoldingMinutes > 0` |
| structureLookbackBars | integer | `strategyCode == structure_break_exit -> structureLookbackBars >= 2` |
| structureBreakBufferPercent | number | `strategyCode == structure_break_exit -> 0 <= structureBreakBufferPercent <= 5` |
| required | boolean | Required strategy must participate in composed plan |

**Equality:** Same strategyCode and parameter values.

---

### StrategyPriceProposal

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| strategyCode | string | Must map to configured strategy code |
| proposedEntryPrice | number | `proposedEntryPrice > 0` when entry proposal is present |
| proposedStopPrice | number | `proposedStopPrice > 0` when stop proposal is present |
| proposedTargetPrice | number | `proposedTargetPrice > 0` when target proposal is present |
| confidenceScore | number | `0 <= confidenceScore <= 1` |
| participationWeight | number | `0 < participationWeight <= 1` |
| eligible | boolean | true when proposal can participate in composition |

**Equality:** Same strategyCode and resolved values.

---

### EntryPricePlan

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| composedEntryPrice | number | `composedEntryPrice > 0` |
| selectedStrategyCode | [EntryPriceStrategyCode](#entrypricestrategycode) | Must be in configured entry strategy set |
| agreementScore | number | `0 <= agreementScore <= 1` |
| strategyBreakdown | [StrategyPriceProposal](#strategypriceproposal)[] | Non-empty when signal is executable |
| resolvedAt | string (ISO-8601) | Must be >= decision.generatedAt |

**Equality:** Same composedEntryPrice, selectedStrategyCode, and resolvedAt.

---

### ExitPricePlan

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| protectiveStopPrice | number | `protectiveStopPrice > 0` |
| takeProfitPrice | number | `takeProfitPrice > 0` |
| selectedStrategyCode | [ExitPriceStrategyCode](#exitpricestrategycode) | Must be in configured exit strategy set |
| agreementScore | number | `0 <= agreementScore <= 1` |
| strategyBreakdown | [StrategyPriceProposal](#strategypriceproposal)[] | Non-empty when signal is executable |
| resolvedAt | string (ISO-8601) | Must be >= decision.generatedAt |

**Equality:** Same protectiveStopPrice, takeProfitPrice, selectedStrategyCode, and resolvedAt.

---

## Enums

### StrategyThesisId

| Value | Description |
| ----- | ----------- |
| string | Opaque identifier |

### StrategyProfileId

| Value | Description |
| ----- | ----------- |
| string | Opaque identifier |

### SignalDecisionId

| Value | Description |
| ----- | ----------- |
| string | Opaque identifier |

### PaperPositionId

| Value | Description |
| ----- | ----------- |
| string | Opaque identifier |

### ProfileStatus

| Value | Description |
| ----- | ----------- |
| Draft | Profile is being configured |
| Active | Profile is eligible for signal generation |
| Paused | Profile is temporarily disabled |
| Archived | Profile is permanently inactive |

### ThesisStatus

| Value | Description |
| ----- | ----------- |
| Draft | Thesis registered but not yet active |
| Candidate | Thesis is prepared for activation checks |
| Active | Thesis drives signal generation |
| Challenged | Thesis is under stress due weak alignment |
| Invalidated | Thesis has failed invalidation criteria |
| Retired | Thesis is archived and not reusable |

### SignalType

| Value | Description |
| ----- | ----------- |
| Buy | Positive directional signal |
| Sell | Negative directional signal |
| Hold | Neutral/no-action signal |

### DecisionStatus

| Value | Description |
| ----- | ----------- |
| Draft | Candidate not yet emitted |
| Emitted | Published to paper execution ledger |
| Executed | Paper entry executed and awaiting closure |
| Blocked | Blocked by risk controls |
| Closed | Terminal state |

### RegimeStateType

| Value | Description |
| ----- | ----------- |
| Monitoring | Baseline observation state |
| Armed | Trigger preconditions are aligned |
| Triggered | Active signal window |
| Invalidated | Thesis invalidation state |

### InvalidationReasonCode

| Value | Description |
| ----- | ----------- |
| brent_floor_break_2cycles | Brent floor remained below threshold for 2 consecutive cycles |
| shipping_recovery_2cycles | Shipping disruption normalized for 2 consecutive cycles |
| fx_normalization_2cycles | FX stress normalized for 2 consecutive cycles |
| thesis_governance_retire | Governance committee retired the active thesis |

### CadenceMode

| Value | Description |
| ----- | ----------- |
| Daily | End-of-day evaluation |
| Intraday | Fixed schedule intraday evaluation |
| EventDriven | Triggered by event conditions |
| Hybrid | Daily plus intraday plus event-driven |

### EntryPriceStrategyCode

| Value | Description |
| ----- | ----------- |
| snapshot_anchor | Entry anchor from latest validated market snapshot |
| ma_convergence_zone | Entry anchor from multi-window moving-average convergence zone |
| order_book_interest_zone | Entry anchor from order-book liquidity interest zone |

### ExitPriceStrategyCode

| Value | Description |
| ----- | ----------- |
| fixed_r_multiple | Exit target and stop derived from fixed risk multiple |
| volatility_trailing_stop | Exit stop distance adapts to observed market volatility |
| time_stop_window | Exit when expected move does not occur within max holding window |
| structure_break_exit | Exit when support or resistance structure breaks against position |
| trailing_convergence_break | Exit follows convergence-break trailing behavior |
| thesis_invalidation_market | Exit immediately at market when thesis is invalidated |

### PriceCompositionMode

| Value | Description |
| ----- | ----------- |
| WeightedAverage | Compose strategy proposals by deterministic weighted averaging |
| RequiredConsensus | Require all required strategies plus agreement threshold before accepting plan |

### MarketVector

| Value | Description |
| ----- | ----------- |
| B3 | Domestic market vector |
| US | US market vector |
