# Test Specification: Commodity Crisis Signal MVP

## Purpose
Derive deterministic backend test obligations from feature documentation for `commodity-crisis-signal-mvp`.
This file follows DomainSpec derivation rules from [domainspec/TEST-PIPELINE.md](../../../domainspec/TEST-PIPELINE.md).

## Pipeline Scope
- Pipeline depth: tests only.
- Backend and domain test derivation: in scope.
- UI E2E derivation: out of scope in this pass (no UI-SPEC.md present).

## Derivation Inputs
- [SPEC.md](SPEC.md)
- [states.md](states.md)
- [operations.md](operations.md)
- [interfaces.md](interfaces.md)
- [events.md](events.md)
- [queries.md](queries.md)
- [workflows.md](workflows.md)
- [mappings.md](mappings.md)
- [STORIES.md](STORIES.md)

## Pilot Decision Gate Reference

Decision policy for this pilot run is frozen in [SPEC.md](SPEC.md#pilot-decision-gate-2026-04-23).
Canonical decision artifact: [PILOT-DECISIONS.md](PILOT-DECISIONS.md).
This test package enforces those decisions as deterministic obligations.

## Coverage Summary

| Source | Rule Family | Obligations |
| ------ | ----------- | ----------- |
| states.md | transitions + invalid transitions + invariants | 19 happy transitions, 15 negative transitions, 12 invariants |
| operations.md | rule validation + calculations + postconditions + errors | 35 rules (pass/fail), 19 calculations, 30 postconditions, 29 error states |
| interfaces.md | port contracts + field mappings | 16 command/query contract cases, 34 input/output mapping checks |
| events.md | producer + consumer behavior | 8 producer tests, 16 consumer tests |
| queries.md | output shape + filters + failure modes | 22 query tests |
| workflows.md | workflow steps + failure/compensation + policy tables | 24 workflow tests |
| mappings.md | field mapping + defaults + validation | 40 mapping tests |

## State Machine Tests

### Happy Transition Tests

| Test ID | Source | Scenario |
| ------- | ------ | -------- |
| ST-REG-001 | [RegimeState](states.md#regimestate) | `Monitoring -> Armed` on `IndicatorsAligned` when R1-R3 pass |
| ST-REG-002 | [RegimeState](states.md#regimestate) | `Armed -> Triggered` on `SignalGenerated` with confidence threshold met |
| ST-REG-003 | [RegimeState](states.md#regimestate) | `Triggered -> Invalidated` on `InvalidationDetected` with R9 pass |
| ST-REG-004 | [RegimeState](states.md#regimestate) | `Invalidated -> Monitoring` on `ResetApproved` with cooldown and governance approval |
| ST-THS-001 | [ThesisState](states.md#thesisstate) | `Draft -> Candidate` on `CandidatePrepared` |
| ST-THS-002 | [ThesisState](states.md#thesisstate) | `Candidate -> Active` on `ActivateStrategyThesis` with R14-R16 pass |
| ST-THS-003 | [ThesisState](states.md#thesisstate) | `Active -> Challenged` after 2 below-threshold cycles |
| ST-THS-004 | [ThesisState](states.md#thesisstate) | `Challenged -> Active` after 2 recovery cycles |
| ST-THS-005 | [ThesisState](states.md#thesisstate) | `Active -> Invalidated` on `ProcessInvalidation` with approved reason |
| ST-THS-006 | [ThesisState](states.md#thesisstate) | `Challenged -> Invalidated` on `ProcessInvalidation` with approved reason |
| ST-THS-007 | [ThesisState](states.md#thesisstate) | `Invalidated -> Retired` on `RetirementApproved` |
| ST-DEC-001 | [SignalDecisionState](states.md#signaldecisionstate) | `Draft -> Emitted` on `GenerateSignal` with R1-R5,R17 pass |
| ST-DEC-002 | [SignalDecisionState](states.md#signaldecisionstate) | `Emitted -> Emitted` on `ResolveEntryPricePlan` with R23-R26 pass |
| ST-DEC-003 | [SignalDecisionState](states.md#signaldecisionstate) | `Emitted -> Emitted` on `ResolveExitPricePlan` with R27-R30 pass |
| ST-DEC-004 | [SignalDecisionState](states.md#signaldecisionstate) | `Emitted -> Blocked` on `RiskBreachDetected` when R6 or R7 fail |
| ST-DEC-005 | [SignalDecisionState](states.md#signaldecisionstate) | `Emitted -> Executed` on `RecordPaperExecution` with R11,R12,R31,R32 pass |
| ST-DEC-006 | [SignalDecisionState](states.md#signaldecisionstate) | `Executed -> Executed` on `ResolveExitPricePlan` refresh |
| ST-DEC-007 | [SignalDecisionState](states.md#signaldecisionstate) | `Executed -> Blocked` on `RiskBreachDetected` when R6 or R7 fail |
| ST-DEC-008 | [SignalDecisionState](states.md#signaldecisionstate) | `Executed -> Closed` on `CloseSignalDecision` with R13,R33,R34,R35 pass |
| ST-DEC-009 | [SignalDecisionState](states.md#signaldecisionstate) | `Blocked -> Closed` on `CloseSignalDecision` with R13,R33,R34 pass |

### Negative Transition Tests

| Test ID | Source | Scenario |
| ------- | ------ | -------- |
| ST-NEG-001 | [RegimeState](states.md#regimestate) | reject `SignalGenerated` while `Monitoring` |
| ST-NEG-002 | [RegimeState](states.md#regimestate) | reject `ResetApproved` while not `Invalidated` |
| ST-NEG-003 | [ThesisState](states.md#thesisstate) | reject `ActivateStrategyThesis` when thesis is `Invalidated` |
| ST-NEG-004 | [ThesisState](states.md#thesisstate) | reject `ThesisAlignmentRecovered` while `Active` |
| ST-NEG-005 | [ThesisState](states.md#thesisstate) | reject direct `Invalidated -> Active` transition |
| ST-NEG-006 | [SignalDecisionState](states.md#signaldecisionstate) | reject `RecordPaperExecution` when decision is `Blocked` |
| ST-NEG-007 | [SignalDecisionState](states.md#signaldecisionstate) | reject `GenerateSignal` on already terminal `Closed` decision |
| ST-NEG-008 | [SignalDecisionState](states.md#signaldecisionstate) | reject `RiskBreachDetected` for `Draft` decision |
| ST-NEG-009 | [SignalDecisionState](states.md#signaldecisionstate) | reject `ResolveEntryPricePlan` when decision is not `Emitted` |
| ST-NEG-010 | [SignalDecisionState](states.md#signaldecisionstate) | reject `CloseSignalDecision` from `Emitted` without execution |
| ST-NEG-011 | [SignalDecisionState](states.md#signaldecisionstate) | reject `RecordPaperExecution` when entry plan is missing |
| ST-NEG-012 | [SignalDecisionState](states.md#signaldecisionstate) | reject `CloseSignalDecision` with non-positive close price |
| ST-NEG-013 | [states.md](states.md) | generate rejection tests for every undocumented state x event pair (regime) |
| ST-NEG-014 | [states.md](states.md) | generate rejection tests for every undocumented state x event pair (thesis) |
| ST-NEG-015 | [states.md](states.md) | verify terminal states reject all non-idempotent events |

### Invariant Property Tests

| Test ID | Source | Property |
| ------- | ------ | -------- |
| ST-INV-001 | [I1](states.md#regimestate) | invalidated regime never emits buy |
| ST-INV-002 | [I2](states.md#regimestate) | triggered regime always implies active profile |
| ST-INV-003 | [I3](states.md#regimestate) | every regime transition logs event |
| ST-INV-004 | [I4](states.md#thesisstate) | only one active thesis per profile |
| ST-INV-005 | [I5](states.md#thesisstate) | invalidated thesis cannot return active directly |
| ST-INV-006 | [I6](states.md#thesisstate) | each thesis evaluation updates `lastEvaluatedAt` |
| ST-INV-007 | [I7](states.md#signaldecisionstate) | closed decision is immutable |
| ST-INV-008 | [I8](states.md#signaldecisionstate) | blocked decision cannot return to emitted or executed |
| ST-INV-009 | [I9](states.md#thesisstate) | challenged status requires streak >= challenge window |
| ST-INV-010 | [I10](states.md#thesisstate) | recovery event requires streak >= recovery window |
| ST-INV-011 | [I11](states.md#signaldecisionstate) | executed decision stores positive entry execution price |
| ST-INV-012 | [I12](states.md#signaldecisionstate) | closed decision from executed state stores positive exit execution price |

## Operation Tests

### Rule Validation (pass + fail)

For each rule in [operations.md](operations.md), generate at least one passing and one failing case.

| Test Group | Rules |
| ---------- | ----- |
| OP-ACT-RULE | R14, R15, R16 |
| OP-SIG-RULE | R1, R2, R3, R4, R5, R17 |
| OP-ENT-RULE | R23, R24, R25, R26 |
| OP-EXT-RULE | R27, R28, R29, R30 |
| OP-ALN-RULE | R18, R19, R20, R21, R22 |
| OP-RSK-RULE | R6, R7, R8 |
| OP-INV-RULE | R9, R10 |
| OP-REC-RULE | R11, R12, R31, R32 |
| OP-CLS-RULE | R13, R33, R34, R35 |

Minimum deterministic count: `2 * 35 = 70` rule tests.

### Calculation Tests

| Test ID | Source | Formula Assertion |
| ------- | ------ | ----------------- |
| OP-CALC-001 | [C1](operations.md#generatesignal) | signal score uses balanced 0.25 weights across four components |
| OP-CALC-002 | [C2](operations.md#generatesignal) | confidence score clamps to `[0,1]` |
| OP-CALC-003 | [C3](operations.md#evaluateriskenvelope) | margin headroom equals `10 - marginUsagePercent` |
| OP-CALC-004 | [C4](operations.md#evaluateriskenvelope) | drawdown headroom equals `2 - currentDrawdownPercent` |
| OP-CALC-005 | [C5](operations.md#processinvalidation) | invalidation lag computed from detectedAt minus last signal timestamp |
| OP-CALC-006 | [C6](operations.md#recordpaperexecution) | simulated quantity equals notional divided by latest price |
| OP-CALC-007 | [C7](operations.md#closesignaldecision) | holding minutes computed from closedAt minus generatedAt |
| OP-CALC-008 | [C8](operations.md#activatestrategythesis) | thesis version increments monotonically |
| OP-CALC-009 | [C9](operations.md#evaluatethesisalignment) | alignment score uses balanced 0.25 weights |
| OP-CALC-010 | [C10](operations.md#evaluatethesisalignment) | invalidation pressure score uses 0.34/0.33/0.33 composition |
| OP-CALC-011 | [C11](operations.md#resolveentrypriceplan) | entry agreement score uses eligible-weight ratio |
| OP-CALC-012 | [C12](operations.md#resolveentrypriceplan) | composed entry price is weighted average of eligible proposals |
| OP-CALC-013 | [C13](operations.md#resolveentrypriceplan) | selected entry strategy uses max weighted confidence |
| OP-CALC-014 | [C14](operations.md#resolveexitpriceplan) | exit agreement score uses eligible-weight ratio |
| OP-CALC-015 | [C15](operations.md#resolveexitpriceplan) | protective stop uses weighted average of eligible stop proposals |
| OP-CALC-016 | [C16](operations.md#resolveexitpriceplan) | take-profit uses weighted average of eligible target proposals |
| OP-CALC-017 | [C18](operations.md#recordpaperexecution) | resolved entry price honors explicit override fallback logic |
| OP-CALC-018 | [C19](operations.md#closesignaldecision) | realized move uses direction-aware signed formula |

### Postcondition Tests

Assert every postcondition bullet in [operations.md](operations.md):
- thesis activation state and [ThesisActivated](events.md#thesisactivated) emission.
- signal persistence and [SignalGenerated](events.md#signalgenerated) emission.
- entry plan persistence and [EntryPricePlanResolved](events.md#entrypriceplanresolved) emission.
- exit plan persistence and [ExitPricePlanResolved](events.md#exitpriceplanresolved) emission.
- thesis counters and [ThesisAlignmentEvaluated](events.md#thesisalignmentevaluated) emission.
- risk breach blocking and [RiskBreachDetected](events.md#riskbreachdetected) emission.
- regime/thesis invalidation and [RegimeInvalidated](events.md#regimeinvalidated) emission.
- paper position write with entry execution price and decision close with exit execution price.

Minimum deterministic count: 30 postcondition assertions.

### Error State Tests

| Test Group | Required Errors |
| ---------- | --------------- |
| OP-ACT-ERR | `profile_inactive`, `thesis_not_activatable`, `active_thesis_already_exists` |
| OP-SIG-ERR | `profile_inactive`, `missing_asset_coverage`, `stale_data`, `cadence_misaligned`, `thesis_inactive` |
| OP-ENT-ERR | `decision_not_emitted_or_directional`, `missing_entry_strategy_config`, `required_entry_strategy_unavailable`, `insufficient_entry_agreement` |
| OP-EXT-ERR | `decision_not_price_plannable`, `missing_exit_strategy_config`, `required_exit_strategy_unavailable`, `insufficient_exit_agreement` |
| OP-ALN-ERR | `thesis_not_evaluable`, `missing_thesis_indicator`, `cadence_gap_violation` |
| OP-RSK-ERR | `margin_cap_breach`, `drawdown_stop_breach` |
| OP-INV-ERR | `unknown_reason` |
| OP-REC-ERR | `invalid_decision_state`, `invalid_notional`, `missing_entry_plan`, `slippage_limit_breach` |
| OP-CLS-ERR | idempotent duplicate close handling, `invalid_close_price`, `invalid_close_state`, `missing_exit_plan` |

Minimum deterministic count: 29 error tests.

## Interface Contract Tests

### Command and Query Contract Tests

| Test ID | Contract | Expected Result | Condition |
| ------- | -------- | --------------- | --------- |
| IF-001 | `EvaluateSignalCommand` | accepted | decision emitted |
| IF-002 | `EvaluateSignalCommand` | rejected | rule violation |
| IF-003 | `ActivateThesisCommand` | accepted | thesis activated |
| IF-004 | `ActivateThesisCommand` | rejected | activation guard failure |
| IF-005 | `GetThesisStatusQuery` | found | thesis found |
| IF-006 | `GetThesisStatusQuery` | missing | thesis missing |
| IF-007 | `GetSignalTimelineQuery` | found | valid query |
| IF-008 | `GetSignalTimelineQuery` | rejected | invalid date range |
| IF-009 | `GetRiskStatusQuery` | found | profile found |
| IF-010 | `GetRiskStatusQuery` | missing | profile missing |
| IF-011 | `InvalidateRegimeCommand` | accepted | accepted invalidation |
| IF-012 | `InvalidateRegimeCommand` | rejected | unknown reason code |
| IF-013 | `GetOpenPositionPricingQuery` | found | open position pricing returned |
| IF-014 | `GetOpenPositionPricingQuery` | missing | no open position found |
| IF-015 | `CloseSignalDecisionCommand` | accepted | close accepted |
| IF-016 | `CloseSignalDecisionCommand` | rejected | close guard failed |

### Interface Field Mapping Checks

Validate field mapping for all command/query contracts in [interfaces.md](interfaces.md), including:
- `thesisId` presence on `InvalidateRegimeCommand`.
- enum typing for `invalidationReason` mapped to [InvalidationReasonCode](domain.md#invalidationreasoncode).
- close payload mapping for `closePrice` and `exitStrategyCode` on `CloseSignalDecisionCommand`.
- open position pricing filter propagation for `marketVector` and `strategyCode`.
- timeline and thesis status filter propagation.

Minimum deterministic count: 34 mapping checks.

## Event Tests

### Producer Tests

| Test ID | Event | Producer |
| ------- | ----- | -------- |
| EV-P-001 | [ThesisActivated](events.md#thesisactivated) | [ActivateStrategyThesis](operations.md#activatestrategythesis) |
| EV-P-002 | [ThesisAlignmentEvaluated](events.md#thesisalignmentevaluated) | [EvaluateThesisAlignment](operations.md#evaluatethesisalignment) |
| EV-P-003 | [SignalGenerated](events.md#signalgenerated) | [GenerateSignal](operations.md#generatesignal) |
| EV-P-004 | [EntryPricePlanResolved](events.md#entrypriceplanresolved) | [ResolveEntryPricePlan](operations.md#resolveentrypriceplan) |
| EV-P-005 | [ExitPricePlanResolved](events.md#exitpriceplanresolved) | [ResolveExitPricePlan](operations.md#resolveexitpriceplan) |
| EV-P-006 | [RiskBreachDetected](events.md#riskbreachdetected) | [EvaluateRiskEnvelope](operations.md#evaluateriskenvelope) |
| EV-P-007 | [RegimeInvalidated](events.md#regimeinvalidated) | [ProcessInvalidation](operations.md#processinvalidation) |
| EV-P-008 | [SignalClosed](events.md#signalclosed) | [CloseSignalDecision](operations.md#closesignaldecision) |

### Consumer Tests

For each "Consumed by" row in [events.md](events.md), verify consumer reaction and payload usage.
Minimum deterministic count: 16 consumer tests.

## Query Tests

| Test Group | Source | Obligations |
| ---------- | ------ | ----------- |
| QRY-TIMELINE | [GetSignalTimeline](queries.md#getsignaltimeline) | output shape, date range validation, filters (`signalType`, `decisionStatus`, `marketVector`), pricing-plan fields, pagination behavior |
| QRY-OPEN-PRICING | [GetOpenPositionPricing](queries.md#getopenpositionpricing) | output shape, filters (`marketVector`, `strategyCode`), 404 behavior |
| QRY-RISK | [GetRiskStatus](queries.md#getriskstatus) | output shape, market vector filter, profile-not-found behavior |
| QRY-THESIS | [GetThesisStatus](queries.md#getthesisstatus) | output shape includes 2x2 window fields and counters, status filter, include-history behavior |

Minimum deterministic count: 22 query tests.

## Workflow and Policy Tests

| Test Group | Source | Obligations |
| ---------- | ------ | ----------- |
| WF-SIGNAL-STEP | [SignalCycleWorkflow](workflows.md#signalcycleworkflow) | step-by-step happy path through ingest -> generate -> align -> entry plan -> exit plan -> risk -> execution -> close -> projection |
| WF-SIGNAL-FAIL | [SignalCycleWorkflow](workflows.md#signalcycleworkflow) | generation failure, thesis evaluation failure, entry or exit strategy resolution failure, risk breach branch, blocked execution branch |
| WF-THESIS-STEP | [ThesisLifecycleWorkflow](workflows.md#thesislifecycleworkflow) | candidate -> activate -> evaluate -> invalidate -> archive |
| WF-THESIS-FAIL | [ThesisLifecycleWorkflow](workflows.md#thesislifecycleworkflow) | activation guard fail, evaluation fail, invalidation fail handling |
| WF-CADENCE | [CadenceSelectionPolicy](workflows.md#cadenceselectionpolicy) | four decision table branches + `nextRunAt` formula |
| WF-PROVIDER | [ProviderPriorityPolicy](workflows.md#providerprioritypolicy) | B3 fallback trigger, US stale-data rejection, macro fallback constraints, shipping proxy blocking |

Minimum deterministic count: 24 workflow and policy tests.

## Mapping Tests

| Test Group | Source | Obligations |
| ---------- | ------ | ----------- |
| MAP-THESIS | [NarrativeThesisToStrategyThesis](mappings.md#narrativethesistostrategythesis) | thesis fields plus entry/exit strategy composition, defaults, validations |
| MAP-PROVIDER | [ProviderPayloadToMarketSnapshot](mappings.md#providerpayloadtomarketsnapshot) | 5 field mappings, default source behavior, vector-specific source validation |
| MAP-SHIPPING | [ShippingProxyPayloadToRegimeTelemetry](mappings.md#shippingproxypayloadtoregimetelemetry) | proxy normalization fields, aggregate shipping score formula, validation bounds |
| MAP-LEDGER | [SignalDecisionToPaperLedgerEntry](mappings.md#signaldecisiontopaperledgerentry) | ledger field mappings including planned and executed prices, execution mode default, intent/confidence validations |

Minimum deterministic count: 40 mapping tests.

## Story Traceability Requirements

Validate that tests collectively satisfy acceptance paths in [STORIES.md](STORIES.md):
- US-4 thesis activation and 2x2 governance persistence.
- US-1 deterministic balanced-weight signal generation.
- US-6 provider fallback orchestration.
- US-8 composable pricing plans with required strategy participation and price evidence.
- US-2 risk envelope blocking.
- US-3 invalidation reason taxonomy and buy-block behavior.
- US-5 timeline and thesis provenance visibility.
- US-7 stale/incomplete telemetry rejection.

## Pilot Must-Pass Subset (Wave 1)

Target envelope: 56 deterministic tests.

Execution sequence:

| Wave Step | Scope | Must-Pass IDs or Groups | Gate |
| ---------- | ----- | ----------------------- | ---- |
| 1 | State transitions and invariants | ST-REG-001, ST-REG-002, ST-THS-002, ST-THS-003, ST-THS-004, ST-DEC-001, ST-DEC-004, ST-DEC-005, ST-INV-001, ST-INV-004, ST-INV-007, ST-INV-008 | Domain lifecycle correctness |
| 2 | Core rule and calculation checks | OP-SIG-RULE, OP-ALN-RULE, OP-RSK-RULE, OP-INV-RULE, OP-CALC-001, OP-CALC-002, OP-CALC-003, OP-CALC-004, OP-CALC-009, OP-CALC-010, OP-CALC-011, OP-CALC-014 | Deterministic decision model |
| 3 | Critical error paths | OP-SIG-ERR, OP-ALN-ERR, OP-RSK-ERR, OP-INV-ERR, OP-REC-ERR, OP-CLS-ERR | Fail-fast and safety blocking |
| 4 | Interface contracts | IF-001, IF-002, IF-003, IF-004, IF-008, IF-011, IF-012, IF-016 | Command and query boundary safety |
| 5 | Workflow and policy guards | WF-SIGNAL-STEP, WF-SIGNAL-FAIL, WF-CADENCE, WF-PROVIDER | End-to-end orchestration and fallback |
| 6 | Read-model and event integrity | EV-P-003, EV-P-006, EV-P-007, EV-P-008, QRY-TIMELINE, QRY-RISK, QRY-THESIS, MAP-LEDGER | Evidence and timeline trustworthiness |

Wave 1 pass rule:
- All six wave steps pass with zero blocker-level failure.

## Story-to-Test Mapping

| Story | Must-Pass Coverage |
| ----- | ------------------ |
| US-4 | ST-THS-002, ST-THS-003, ST-THS-004, OP-ACT-RULE, OP-ALN-RULE, IF-003, IF-005, WF-THESIS-STEP |
| US-1 | ST-DEC-001, OP-SIG-RULE, OP-CALC-001, OP-CALC-002, IF-001, WF-SIGNAL-STEP |
| US-6 | WF-PROVIDER, OP-SIG-ERR (`stale_data`), OP-ALN-ERR (`missing_thesis_indicator`) |
| US-8 | OP-ENT-RULE, OP-EXT-RULE, OP-CALC-011, OP-CALC-012, OP-CALC-014, OP-CALC-015, QRY-OPEN-PRICING, MAP-LEDGER |
| US-2 | ST-DEC-004, ST-DEC-007, OP-RSK-RULE, OP-RSK-ERR, IF-009 |
| US-3 | ST-REG-003, ST-THS-005, OP-INV-RULE, OP-INV-ERR, IF-011, IF-012 |
| US-5 | QRY-TIMELINE, IF-007, IF-008, EV-P-003, EV-P-008 |
| US-7 | OP-SIG-ERR, OP-ALN-ERR, ST-NEG-011, WF-SIGNAL-FAIL |

## Test Execution Checklist

- [ ] Freeze decision table reference from [SPEC.md](SPEC.md#pilot-decision-gate-2026-04-23).
- [ ] Execute Wave Step 1 and attach pass or fail evidence.
- [ ] Execute Wave Step 2 and attach pass or fail evidence.
- [ ] Execute Wave Step 3 and attach pass or fail evidence.
- [ ] Execute Wave Step 4 and attach pass or fail evidence.
- [ ] Execute Wave Step 5 and attach pass or fail evidence.
- [ ] Execute Wave Step 6 and attach pass or fail evidence.
- [ ] Confirm no blocker-level gaps remain open in Blockers Register.

## Blockers Register

| ID | Status | Description | Evidence Required |
| -- | ------ | ----------- | ----------------- |
| BR-001 | Open | Automated test artifacts for the Wave 1 subset are not yet attached in this repository. | CI log or local test run output for all Wave 1 groups |
| BR-002 | Open | Story-to-test mapping has not yet been validated against executable suites. | Mapping verification output with zero uncovered required stories |

## Evidence Package

Required pilot evidence bundle:
- Decision freeze reference to [SPEC.md](SPEC.md#pilot-decision-gate-2026-04-23).
- Verification command outputs for doc validation and sync checks.
- Wave 1 execution transcript or CI artifact links by wave step.
- Signed readiness verdict with any remaining blockers and owner.

## Missing Inputs and Deferred Areas

- UI E2E derivation (rules 15-20 from TEST-PIPELINE) is deferred because UI-SPEC.md and docs/UI-ARCHITECTURE.md are not present.
- Implementation-language-specific test scaffold files are deferred to implementation phase (`--scaffold` not requested in this pass).