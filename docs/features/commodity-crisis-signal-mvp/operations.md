# Operations: Commodity Crisis Signal MVP

## ActivateStrategyThesis

**Type:** Operation (mutation)
**Actor:** Founder-operator
**Triggers:** Thesis governance decision to activate a strategy thesis

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Target strategy profile |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | yes | Thesis to activate |
| activatedAt | string (ISO-8601) | yes | Activation timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R14 | Profile must be active before thesis activation | `profile.status == Active` |
| R15 | Thesis must be candidate or draft before activation | `thesis.status in {Draft, Candidate}` |
| R16 | Profile can have at most one active thesis | `count(activeThesis where profileId) == 0` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C8  | thesisVersionNext | `max(existingThesis.version for profileId) + 1` |

### State Transition

[ThesisState](states.md#thesisstate): Candidate -> Active

### Postconditions

- [StrategyThesis](domain.md#strategythesis) is marked active with activation timestamp and version.
- [ThesisActivated](events.md#thesisactivated) is emitted.

### Error States

| Condition | Result |
| --------- | ------ |
| R14 fails | Reject activation with profile_inactive |
| R15 fails | Reject activation with thesis_not_activatable |
| R16 fails | Reject activation with active_thesis_already_exists |

## GenerateSignal

**Type:** Operation (mutation)
**Actor:** System Scheduler or Event Trigger
**Triggers:** Scheduled cadence or regime event

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Target strategy profile |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | yes | Active thesis controlling signal scoring |
| telemetry | [RegimeTelemetry](domain.md#regimetelemetry) | yes | Macro telemetry snapshot |
| marketSnapshots | [MarketSnapshot](domain.md#marketsnapshot)[] | yes | Input snapshots for required assets |
| triggerTimestamp | string (ISO-8601) | yes | Decision trigger timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R1  | Profile must be active | `profile.status == Active` |
| R2  | Required asset coverage must be complete | `requiredSymbols subsetOf marketSnapshots.symbol` |
| R3  | Data freshness must satisfy V1 latency budget | `max(now - snapshot.observedAt) <= 5 minutes` |
| R4  | Buy signals are blocked in invalidated regime | `regimeState == Invalidated -> signalType != Buy` |
| R5  | Intraday cadence must match configured schedule | `cadenceMode includes Intraday -> now alignedWith configuredInterval` |
| R17 | Thesis must be active for the provided thesisId | `thesis.status == Active and thesis.id == thesisId` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C1  | signalScore | `0.25*energySignal + 0.25*inputsSignal + 0.25*agriSignal + 0.25*macroSignal` |
| C2  | confidenceScore | `min(1, abs(signalScore) / confidenceNormalizer)` |

### State Transition

[SignalDecision](domain.md#signaldecision): Draft -> Emitted
[ThesisState](states.md#thesisstate): Active -> Active

### Postconditions

- A [SignalDecision](domain.md#signaldecision) is persisted with deterministic [SignalType](domain.md#signaltype).
- The emitted [SignalDecision](domain.md#signaldecision) is bound to [StrategyThesis](domain.md#strategythesis) id and version.
- The emitted decision remains in `Emitted` state until entry execution is recorded.
- [SignalGenerated](events.md#signalgenerated) is emitted with reason code and confidence.
- Decision is queryable through [GetSignalTimeline](queries.md#getsignaltimeline).

### Error States

| Condition | Result |
| --------- | ------ |
| R1 fails | Reject generation with profile_inactive |
| R2 fails | Reject generation with missing_asset_coverage |
| R3 fails | Reject generation with stale_data |
| R5 fails | Reject generation with cadence_misaligned |
| R17 fails | Reject generation with thesis_inactive |

---

## ResolveEntryPricePlan

**Type:** Operation (mutation)
**Actor:** Pricing Strategy Engine
**Triggers:** Immediately after [GenerateSignal](#generatesignal) for executable decisions

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | yes | Emitted decision to enrich with entry plan |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | yes | Thesis that owns strategy configuration |
| marketSnapshots | [MarketSnapshot](domain.md#marketsnapshot)[] | yes | Latest snapshots used by strategy modules |
| evaluatedAt | string (ISO-8601) | yes | Plan resolution timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R23 | Decision must be emitted and directional | `decision.status == Emitted and decision.signalType in {Buy, Sell}` |
| R24 | Thesis must define at least one entry strategy | `count(thesis.entryPriceStrategies) >= 1` |
| R25 | Required entry strategies must be eligible | `forAll(required entryStrategies, strategy.eligible == true)` |
| R26 | Composed agreement must satisfy threshold | `entryAgreementScore >= thesis.minStrategyAgreementScore` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C11 | entryAgreementScore | `sum(weight where proposal.eligible) / sum(weight across configuredEntryStrategies)` |
| C12 | composedEntryPrice | `sum(proposal.proposedEntryPrice * proposal.participationWeight) / sum(proposal.participationWeight where proposal.eligible)` |
| C13 | selectedEntryStrategy | `strategyCode of max(confidenceScore * participationWeight) among eligible proposals` |

### State Transition

[SignalDecision](domain.md#signaldecision): Emitted -> Emitted

### Postconditions

- [SignalDecision](domain.md#signaldecision).entryPricePlan is persisted with composed entry price and strategy breakdown.
- [SignalDecision](domain.md#signaldecision).strategyAgreementScore is updated with entry agreement value.

### Error States

| Condition | Result |
| --------- | ------ |
| R23 fails | Reject resolution with decision_not_emitted_or_directional |
| R24 fails | Reject resolution with missing_entry_strategy_config |
| R25 fails | Reject resolution with required_entry_strategy_unavailable |
| R26 fails | Reject resolution with insufficient_entry_agreement |

---

## ResolveExitPricePlan

**Type:** Operation (mutation)
**Actor:** Pricing Strategy Engine
**Triggers:** After [ResolveEntryPricePlan](#resolveentrypriceplan) and during open-position monitoring

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | yes | Decision to enrich with exit plan |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | yes | Thesis that owns strategy configuration |
| marketSnapshots | [MarketSnapshot](domain.md#marketsnapshot)[] | yes | Latest market snapshots |
| riskEnvelope | [RiskEnvelope](domain.md#riskenvelope) | yes | Current stop and margin envelope |
| positionAgeMinutes | number | no | Age of active position in minutes for time-stop evaluation |
| realizedVolatility | number | no | Current realized volatility estimate used by volatility trailing stop |
| structureSnapshot | object | no | Support and resistance levels for structure-break evaluation |
| evaluatedAt | string (ISO-8601) | yes | Plan resolution timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R27 | Decision must be emitted or executed | `decision.status in {Emitted, Executed}` |
| R28 | Thesis must define at least one exit strategy | `count(thesis.exitPriceStrategies) >= 1` |
| R29 | Required exit strategies must be eligible | `forAll(required exitStrategies, strategy.eligible == true)` |
| R30 | Composed agreement must satisfy threshold | `exitAgreementScore >= thesis.minStrategyAgreementScore` |
| R36 | Volatility trailing strategy needs volatility inputs and parameters | `exitStrategies includes volatility_trailing_stop -> realizedVolatility > 0 and strategy.volatilityLookbackPeriods >= 2 and strategy.volatilityMultiplier > 0` |
| R37 | Time-stop strategy needs holding-window inputs | `exitStrategies includes time_stop_window -> positionAgeMinutes >= 0 and strategy.maxHoldingMinutes > 0` |
| R38 | Structure-break strategy needs valid structure snapshot | `exitStrategies includes structure_break_exit -> structureSnapshot.supportLevel > 0 and structureSnapshot.resistanceLevel > 0 and 0 <= strategy.structureBreakBufferPercent <= 5` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C14 | exitAgreementScore | `sum(weight where proposal.eligible) / sum(weight across configuredExitStrategies)` |
| C15 | protectiveStopPrice | `sum(proposal.proposedStopPrice * proposal.participationWeight) / sum(proposal.participationWeight where proposal.eligible)` |
| C16 | takeProfitPrice | `sum(proposal.proposedTargetPrice * proposal.participationWeight) / sum(proposal.participationWeight where proposal.eligible)` |
| C17 | volatilityStopProposal | `if strategyCode == volatility_trailing_stop and signalType == Buy then lastPrice - (strategy.volatilityMultiplier * realizedVolatility) else if strategyCode == volatility_trailing_stop and signalType == Sell then lastPrice + (strategy.volatilityMultiplier * realizedVolatility)` |
| C20 | timeStopTriggered | `strategyCode == time_stop_window and positionAgeMinutes >= strategy.maxHoldingMinutes` |
| C21 | structureBreakTriggered | `if strategyCode == structure_break_exit and signalType == Buy then lastPrice <= structureSnapshot.supportLevel * (1 - strategy.structureBreakBufferPercent/100) else if strategyCode == structure_break_exit and signalType == Sell then lastPrice >= structureSnapshot.resistanceLevel * (1 + strategy.structureBreakBufferPercent/100)` |

### State Transition

[SignalDecision](domain.md#signaldecision): Emitted -> Emitted
[SignalDecision](domain.md#signaldecision): Executed -> Executed

### Postconditions

- [SignalDecision](domain.md#signaldecision).exitPricePlan is persisted with protective stop and take-profit targets.
- Exit plan remains traceable to selected strategy code and agreement score.
- Exit plan strategy breakdown includes module-level trigger evidence for volatility, time-stop, and structure-break modules when configured.

### Error States

| Condition | Result |
| --------- | ------ |
| R27 fails | Reject resolution with decision_not_price_plannable |
| R28 fails | Reject resolution with missing_exit_strategy_config |
| R29 fails | Reject resolution with required_exit_strategy_unavailable |
| R30 fails | Reject resolution with insufficient_exit_agreement |
| R36 fails | Reject resolution with missing_volatility_input |
| R37 fails | Reject resolution with missing_time_stop_input |
| R38 fails | Reject resolution with missing_structure_snapshot |

---

## EvaluateThesisAlignment

**Type:** Operation (mutation)
**Actor:** Signal engine
**Triggers:** Immediately after [GenerateSignal](#generatesignal) during signal cycle

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | yes | Active thesis to evaluate |
| telemetry | [RegimeTelemetry](domain.md#regimetelemetry) | yes | Current macro telemetry |
| marketSnapshots | [MarketSnapshot](domain.md#marketsnapshot)[] | yes | Current market snapshots |
| evaluatedAt | string (ISO-8601) | yes | Evaluation timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R18 | Thesis must be active or challenged | `thesis.status in {Active, Challenged}` |
| R19 | Required thesis indicators must be present | `{brentPrice, brlUsd, bdiTrendScore, containerFreightTrendScore, disruptionEventScore} subsetOf telemetryAndSnapshots` |
| R20 | Evaluation cadence must not skip configured windows | `evaluatedAt - thesis.lastEvaluatedAt <= allowedCadenceGap` |
| R21 | Challenge transition requires persistence | `alignmentScore < thesis.minAlignmentScore for 2 consecutive evaluations -> thesis.status = Challenged` |
| R22 | Recovery transition requires persistence | `thesis.status == Challenged and alignmentScore >= thesis.minAlignmentScore for 2 consecutive evaluations -> thesis.status = Active` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C9  | alignmentScore | `0.25*energyConsistency + 0.25*inputTransmission + 0.25*agriLatency + 0.25*macroStability` |
| C10 | invalidationPressureScore | `0.34*brentFloorBreak + 0.33*shippingRecovery + 0.33*fxNormalization` |

### State Transition

[ThesisState](states.md#thesisstate): Active -> Challenged
[ThesisState](states.md#thesisstate): Challenged -> Active

### Postconditions

- [StrategyThesis](domain.md#strategythesis).lastAlignmentScore and lastEvaluatedAt are updated.
- [StrategyThesis](domain.md#strategythesis).consecutiveBelowThresholdCount and consecutiveRecoveryCount are updated.
- [ThesisAlignmentEvaluated](events.md#thesisalignmentevaluated) is emitted.
- Thesis transitions to challenged only after 2 consecutive below-threshold evaluations.
- Challenged thesis transitions back to active only after 2 consecutive recovery evaluations.

### Error States

| Condition | Result |
| --------- | ------ |
| R18 fails | Reject evaluation with thesis_not_evaluable |
| R19 fails | Reject evaluation with missing_thesis_indicator |
| R20 fails | Reject evaluation with cadence_gap_violation |

---

## EvaluateRiskEnvelope

**Type:** Operation (mutation)
**Actor:** Risk Engine
**Triggers:** After signal emission and during simulated position updates

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | yes | Decision under validation |
| riskEnvelope | [RiskEnvelope](domain.md#riskenvelope) | yes | Current risk envelope |
| marketVector | [MarketVector](domain.md#marketvector) | yes | Market exposure vector |
| instrumentClass | string | yes | Instrument category, such as equity, etf, or futures |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R6  | Margin usage must not exceed hard cap | `riskEnvelope.marginUsagePercent <= 10` |
| R7  | B3 futures drawdown must stay within stop boundary | `marketVector == B3 and instrumentClass == futures -> currentDrawdownPercent <= 2` |
| R8  | Blocked decisions cannot be executed | `decision.status == Blocked -> deny execution` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C3  | marginHeadroomPercent | `10 - marginUsagePercent` |
| C4  | drawdownHeadroomPercent | `2 - currentDrawdownPercent` |

### State Transition

[SignalDecision](domain.md#signaldecision): Emitted -> Blocked

### Postconditions

- Breaching decisions transition to blocked state.
- [RiskBreachDetected](events.md#riskbreachdetected) is emitted for downstream consumers.

### Error States

| Condition | Result |
| --------- | ------ |
| R6 fails | Block decision with margin_cap_breach |
| R7 fails | Block decision with drawdown_stop_breach |

---

## ProcessInvalidation

**Type:** Operation (mutation)
**Actor:** Telemetry Processor
**Triggers:** Invalidation signal from shipping, Brent floor breach, or regime controls

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| profileId | [StrategyProfileId](domain.md#strategyprofileid) | yes | Profile to invalidate |
| thesisId | [StrategyThesisId](domain.md#strategythesisid) | yes | Thesis to invalidate |
| invalidationReason | [InvalidationReasonCode](domain.md#invalidationreasoncode) | yes | Deterministic invalidation reason |
| detectedAt | string (ISO-8601) | yes | Detection timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R9  | Invalidation reason must map to approved taxonomy | `invalidationReason in {brent_floor_break_2cycles, shipping_recovery_2cycles, fx_normalization_2cycles, thesis_governance_retire}` |
| R10 | Duplicate invalidation must be idempotent | `alreadyInvalidated(profileId) -> no state change` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C5  | invalidationLagMinutes | `(detectedAt - lastSignalTimestamp) in minutes` |

### State Transition

[RegimeState](states.md#regimestate): Triggered -> Invalidated
[ThesisState](states.md#thesisstate): Active -> Invalidated

### Postconditions

- Regime switches to invalidated.
- [StrategyThesis](domain.md#strategythesis) status is set to invalidated.
- [RegimeInvalidated](events.md#regimeinvalidated) is emitted.
- New buy signals are prohibited while invalidated.

### Error States

| Condition | Result |
| --------- | ------ |
| R9 fails | Reject invalidation with unknown_reason |

---

## RecordPaperExecution

**Type:** Operation (mutation)
**Actor:** Paper Execution Adapter
**Triggers:** Emitted signal accepted for simulation

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | yes | Decision to simulate |
| instrumentSymbol | string | yes | Target instrument |
| marketVector | [MarketVector](domain.md#marketvector) | yes | B3 or US |
| notionalValue | number | yes | Simulated exposure size |
| executionPrice | number | no | Optional execution price override for paper fill simulation |
| executedAt | string (ISO-8601) | yes | Execution timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R11 | Only emitted decisions may be simulated | `decision.status == Emitted` |
| R12 | Notional must be positive | `notionalValue > 0` |
| R31 | Entry plan must exist before execution | `decision.entryPricePlan.composedEntryPrice > 0` |
| R32 | Execution slippage must stay within strategy allowance | `abs(resolvedEntryPrice - decision.entryPricePlan.composedEntryPrice) / decision.entryPricePlan.composedEntryPrice * 100 <= strategy.maxSlippagePercent` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C18 | resolvedEntryPrice | `if executionPrice provided then executionPrice else decision.entryPricePlan.composedEntryPrice` |
| C6  | simulatedQuantity | `notionalValue / resolvedEntryPrice` |

### State Transition

[SignalDecision](domain.md#signaldecision): Emitted -> Executed

### Postconditions

- [PaperPosition](domain.md#paperposition) is created or updated with planned entry and protective exit metadata.
- [SignalDecision](domain.md#signaldecision).executedAt and executedEntryPrice are persisted.

### Error States

| Condition | Result |
| --------- | ------ |
| R11 fails | Reject simulation with invalid_decision_state |
| R12 fails | Reject simulation with invalid_notional |
| R31 fails | Reject simulation with missing_entry_plan |
| R32 fails | Reject simulation with slippage_limit_breach |

---

## CloseSignalDecision

**Type:** Operation (mutation)
**Actor:** Exit Controller
**Triggers:** Exit threshold reached or invalidation workflow completion

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| decisionId | [SignalDecisionId](domain.md#signaldecisionid) | yes | Decision to close |
| closeReason | string | yes | Exit reason code |
| closePrice | number | yes | Exit execution price for closure record |
| exitStrategyCode | [ExitPriceStrategyCode](domain.md#exitpricestrategycode) | no | Strategy code used to trigger or execute closure |
| closedAt | string (ISO-8601) | yes | Closure timestamp |

### Rules

| ID  | Rule | Formal |
| --- | ---- | ------ |
| R13 | Decision must not already be closed | `decision.status != Closed` |
| R33 | Close price must be positive | `closePrice > 0` |
| R34 | Only executed or blocked decisions can close | `decision.status in {Executed, Blocked}` |
| R35 | Executed decisions require an exit plan before closure | `decision.status == Executed -> decision.exitPricePlan exists` |

### Calculations

| ID  | Calculation | Formula |
| --- | ----------- | ------- |
| C7  | holdingMinutes | `(closedAt - decision.generatedAt) in minutes` |
| C19 | realizedMovePercent | `if decision.status == Blocked and decision.executedEntryPrice is null then 0 else if signalType == Buy then (closePrice - decision.executedEntryPrice) / decision.executedEntryPrice else (decision.executedEntryPrice - closePrice) / decision.executedEntryPrice` |

### State Transition

[SignalDecision](domain.md#signaldecision): Executed -> Closed
[SignalDecision](domain.md#signaldecision): Blocked -> Closed

### Postconditions

- Decision is terminal and immutable.
- [SignalDecision](domain.md#signaldecision).executedExitPrice is persisted.
- Close event is recorded with reason and execution price.

### Error States

| Condition | Result |
| --------- | ------ |
| R13 fails | Ignore duplicate close request (idempotent) |
| R33 fails | Reject close with invalid_close_price |
| R34 fails | Reject close with invalid_close_state |
| R35 fails | Reject close with missing_exit_plan |
