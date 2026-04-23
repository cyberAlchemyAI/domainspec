# User Stories: Commodity Crisis Signal MVP

> Navigate by capability: [Thesis Modeling and Governance](#thesis-modeling-and-governance) · [Signal Generation and Regime Detection](#signal-generation-and-regime-detection) · [Composable Entry and Exit Pricing](#composable-entry-and-exit-pricing) · [Guardrail Enforcement](#guardrail-enforcement) · [Telemetry and Exit Control](#telemetry-and-exit-control)

## Thesis Modeling and Governance

### US-4: Activate and govern thesis lifecycle

Slice: Admin/operations journey

As a **founder-operator**, I want **the strategy thesis represented as a versioned lifecycle entity**, so that **every signal can be traced to an explicit proposition and invalidation logic**.

**Given** a candidate [StrategyThesis](domain.md#strategythesis)
**When** [ActivateStrategyThesis](operations.md#activatestrategythesis) succeeds
**Then** [ThesisState](states.md#thesisstate) transitions to active and future [SignalDecision](domain.md#signaldecision) records include thesis id and version

**Acceptance checks**

- [ ] Only one active thesis exists per [StrategyProfile](domain.md#strategyprofile).
- [ ] Every emitted decision is traceable to an active thesis id and version.
- [ ] Thesis challenge and recovery follow a 2-cycle persistence policy.

**Domain coverage**

- Concepts: [StrategyThesis](domain.md#strategythesis), [ActivateStrategyThesis](operations.md#activatestrategythesis), [EvaluateThesisAlignment](operations.md#evaluatethesisalignment)
- States/Rules: [ThesisState](states.md#thesisstate), R14-R22 in [operations.md](operations.md)
- Interfaces/Flows: [ActivateThesisCommand](interfaces.md#activatethesiscommand), [GetThesisStatusQuery](interfaces.md#getthesisstatusquery), [ThesisLifecycleWorkflow](workflows.md#thesislifecycleworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Signal Generation and Regime Detection

### US-1: Deterministic signal generation from configured cadence

Slice: Core strategy journey

As a **founder-operator**, I want **signals generated deterministically across daily, intraday, and event-driven triggers**, so that **execution does not depend on discretionary decisions**.

**Given** an active [StrategyProfile](domain.md#strategyprofile)
**When** [GenerateSignal](operations.md#generatesignal) is triggered with fresh [MarketSnapshot](domain.md#marketsnapshot) and [RegimeTelemetry](domain.md#regimetelemetry)
**Then** a [SignalDecision](domain.md#signaldecision) is emitted with reason code, confidence score, and bound thesis metadata

**Acceptance checks**

- [ ] Each valid trigger produces exactly one emitted decision.
- [ ] Decision payload includes signal type, confidence, and reason code.
- [ ] Decision scoring uses balanced weights across energy, inputs, agriculture, and macro.

**Domain coverage**

- Concepts: [StrategyProfile](domain.md#strategyprofile), [SignalDecision](domain.md#signaldecision), [GenerateSignal](operations.md#generatesignal)
- States/Rules: [SignalDecisionState](states.md#signaldecisionstate), R1-R5 in [GenerateSignal](operations.md#generatesignal)
- Interfaces/Flows: [StrategyApplicationPort](interfaces.md#external-boundary-strategyapplicationport-transport-agnostic), [EvaluateSignalCommand](interfaces.md#evaluatesignalcommand), [SignalCycleWorkflow](workflows.md#signalcycleworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Composable Entry and Exit Pricing

### US-8: Compose entry and exit pricing from modular strategy set

Slice: Pricing strategy journey

As a **founder-operator**, I want **entry and exit prices resolved by composable strategy modules**, so that **the execution plan can combine convergence, order-book, and thesis governance behavior deterministically**.

**Given** an emitted directional [SignalDecision](domain.md#signaldecision) with configured strategy modules in [StrategyThesis](domain.md#strategythesis)
**When** [ResolveEntryPricePlan](operations.md#resolveentrypriceplan) and [ResolveExitPricePlan](operations.md#resolveexitpriceplan) succeed
**Then** the decision stores composed entry and exit plans before [RecordPaperExecution](operations.md#recordpaperexecution)

**Acceptance checks**

- [ ] Entry and exit plans are composed only from eligible configured strategies.
- [ ] Required strategy modules must participate or the decision becomes non-executable.
- [ ] Volatility trailing stop uses declared volatility lookback and multiplier parameters.
- [ ] Time-stop strategy can trigger deterministic closure when max holding window is exceeded.
- [ ] Structure-break strategy can trigger deterministic closure on support or resistance break.
- [ ] Executed decisions record both planned and executed price evidence for audit.

**Domain coverage**

- Concepts: [EntryPricePlan](domain.md#entrypriceplan), [ExitPricePlan](domain.md#exitpriceplan), [ResolveEntryPricePlan](operations.md#resolveentrypriceplan), [ResolveExitPricePlan](operations.md#resolveexitpriceplan)
- States/Rules: [SignalDecisionState](states.md#signaldecisionstate), R23-R38 in [operations.md](operations.md)
- Interfaces/Flows: [GetOpenPositionPricingQuery](interfaces.md#getopenpositionpricingquery), [SignalCycleWorkflow](workflows.md#signalcycleworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-6: Resolve provider priority with deterministic fallback

Slice: Cross-feature integration journey

As a **system integrator**, I want **source-priority rules for each market vector**, so that **the signal cycle remains deterministic when one provider leg degrades**.

**Given** the Option D provider stack
**When** B3 primary source freshness fails for 2 consecutive cycles
**Then** [ProviderPriorityPolicy](workflows.md#providerprioritypolicy) routes B3 reads to fallback and preserves deterministic [GenerateSignal](operations.md#generatesignal) behavior

**Acceptance checks**

- [ ] B3 source priority is broker-native primary then brapi Pro fallback.
- [ ] US and macro source priority is Twelve Data primary.
- [ ] Source degradation emits an auditable marker for timeline analysis.

**Domain coverage**

- Concepts: [MarketSnapshot](domain.md#marketsnapshot), [RegimeTelemetry](domain.md#regimetelemetry), [ProviderPayloadToMarketSnapshot](mappings.md#providerpayloadtomarketsnapshot)
- States/Rules: R3 and R19 in [operations.md](operations.md)
- Interfaces/Flows: [MarketDataProvider Interface](interfaces.md#internal-marketdataprovider-interface), [ProviderPriorityPolicy](workflows.md#providerprioritypolicy)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Guardrail Enforcement

### US-2: Automatic risk blocking on margin and drawdown breaches

Slice: Risk operations journey

As a **risk reviewer**, I want **risk envelope checks to block unsafe decisions automatically**, so that **paper-trading behavior reflects strict strategy discipline**.

**Given** an emitted [SignalDecision](domain.md#signaldecision)
**When** [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope) detects margin or drawdown breach
**Then** the decision transitions to blocked and emits [RiskBreachDetected](events.md#riskbreachdetected)

**Acceptance checks**

- [ ] Decisions breaching 10 percent margin cap are blocked.
- [ ] Futures drawdown breaches above 2 percent trigger blocked state.
- [ ] Blocked decisions never reach paper position creation.

**Domain coverage**

- Concepts: [RiskEnvelope](domain.md#riskenvelope), [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope)
- States/Rules: [SignalDecisionState](states.md#signaldecisionstate), R6-R8 in [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope)
- Interfaces/Flows: [GetRiskStatus](queries.md#getriskstatus), [SignalCycleWorkflow](workflows.md#signalcycleworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Telemetry and Exit Control

### US-3: Regime invalidation triggers deterministic unwind behavior

Slice: Invalidation lifecycle journey

As a **founder-operator**, I want **regime invalidation to stop buy signals and trigger exit workflow**, so that **macro-thesis failure is handled consistently**.

**Given** a triggered regime state
**When** [ProcessInvalidation](operations.md#processinvalidation) is called with approved reason
**Then** the system transitions to invalidated state and blocks new buy decisions

**Acceptance checks**

- [ ] Invalidation produces [RegimeInvalidated](events.md#regimeinvalidated).
- [ ] No buy signal is emitted while regime is invalidated.
- [ ] Invalidation reason is one of the approved [InvalidationReasonCode](domain.md#invalidationreasoncode) values.

**Domain coverage**

- Concepts: [RegimeStateType](domain.md#regimestatetype), [ProcessInvalidation](operations.md#processinvalidation)
- States/Rules: [RegimeState](states.md#regimestate), R9-R10 in [ProcessInvalidation](operations.md#processinvalidation)
- Interfaces/Flows: [InvalidateRegimeCommand](interfaces.md#invalidateregimecommand), [SignalCycleWorkflow](workflows.md#signalcycleworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-5: Inspect thesis-backed signal timeline before acting

Slice: Public journey

As an **independent investor**, I want **a timeline view showing signal outcome plus thesis provenance**, so that **I can understand why the strategy is recommending an action**.

**Given** historical decisions for a profile
**When** I query [GetSignalTimeline](queries.md#getsignaltimeline)
**Then** each row includes signal type, confidence, reason code, thesis id, and thesis version

**Acceptance checks**

- [ ] Timeline rows are filterable by signal type, status, and market vector.
- [ ] Every row is traceable to one thesis id and version.
- [ ] Query rejects invalid date ranges deterministically.

**Domain coverage**

- Concepts: [SignalDecision](domain.md#signaldecision), [GetSignalTimeline](queries.md#getsignaltimeline), [GetThesisStatus](queries.md#getthesisstatus)
- States/Rules: [SignalDecisionState](states.md#signaldecisionstate), query filters and output contracts in [queries.md](queries.md)
- Interfaces/Flows: [GetSignalTimelineQuery](interfaces.md#getsignaltimelinequery), [GetThesisStatusQuery](interfaces.md#getthesisstatusquery)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-7: Reject stale or incomplete telemetry before decision emission

Slice: Error/edge-case journey

As a **system operator**, I want **the signal cycle to fail fast on stale or incomplete telemetry**, so that **invalid data never propagates into paper execution**.

**Given** a trigger with stale market snapshots or missing shipping proxy fields
**When** [GenerateSignal](operations.md#generatesignal) or [EvaluateThesisAlignment](operations.md#evaluatethesisalignment) runs
**Then** the operation rejects with deterministic error and no [SignalDecision](domain.md#signaldecision) is emitted

**Acceptance checks**

- [ ] Stale snapshot input returns `stale_data`.
- [ ] Missing thesis indicator input returns `missing_thesis_indicator`.
- [ ] No paper execution is recorded for rejected attempts.

**Domain coverage**

- Concepts: [GenerateSignal](operations.md#generatesignal), [EvaluateThesisAlignment](operations.md#evaluatethesisalignment), [RecordPaperExecution](operations.md#recordpaperexecution)
- States/Rules: R3, R19, R20 in [operations.md](operations.md)
- Interfaces/Flows: [EvaluateSignalCommand](interfaces.md#evaluatesignalcommand), [SignalCycleWorkflow](workflows.md#signalcycleworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Story Coverage Matrix

| Capability | Story IDs | Covered Concepts | Notes |
| ---------- | --------- | ---------------- | ----- |
| Thesis Modeling and Governance | US-4 | commodity-crisis-signal-mvp.StrategyThesis, commodity-crisis-signal-mvp.ActivateStrategyThesis, commodity-crisis-signal-mvp.EvaluateThesisAlignment | Covers activation plus 2x2 challenge and recovery policy |
| Signal Generation and Regime Detection | US-1, US-6 | commodity-crisis-signal-mvp.StrategyProfile, commodity-crisis-signal-mvp.GenerateSignal, commodity-crisis-signal-mvp.StrategyApplicationPort | Covers deterministic scoring and provider fallback orchestration |
| Composable Entry and Exit Pricing | US-8 | commodity-crisis-signal-mvp.EntryPricePlan, commodity-crisis-signal-mvp.ExitPricePlan, commodity-crisis-signal-mvp.ResolveEntryPricePlan, commodity-crisis-signal-mvp.ResolveExitPricePlan | Covers modular strategy composition and price evidence traceability |
| Guardrail Enforcement | US-2 | commodity-crisis-signal-mvp.RiskEnvelope, commodity-crisis-signal-mvp.EvaluateRiskEnvelope | Covers margin and drawdown blocking with execution lockout |
| Telemetry and Exit Control | US-3, US-5, US-7 | commodity-crisis-signal-mvp.RegimeState, commodity-crisis-signal-mvp.ProcessInvalidation, commodity-crisis-signal-mvp.GetSignalTimeline, commodity-crisis-signal-mvp.GetThesisStatus | Covers invalidation, public traceability, and error-path rejection |

## Unmapped Concept Warnings

- None for V1 blocking scope. All declared capabilities have at least one story and acceptance path.
