# Commodity Crisis Signal MVP - Changelog

All notable changes to the commodity-crisis-signal-mvp feature are documented in this file.

## 2026-04-23

### Added

- **composable pricing concepts** - Added entry and exit pricing strategy configuration objects, composition modes, and plan value objects to the domain model.
- **pricing operations** - Added `ResolveEntryPricePlan` and `ResolveExitPricePlan` with deterministic rules, formulas, and error contracts.
- **pricing events and query** - Added `EntryPricePlanResolved`, `ExitPricePlanResolved`, and `GetOpenPositionPricing` for operational visibility.
- **close interface contract** - Added `POST /api/v1/signals/close` and explicit closure price fields for deterministic auditability.
- **whole-system concept chart** - Added an end-to-end SPEC diagram linking interfaces, domain concepts, operations, state machines, events, and queries.

### Changed

- **signal lifecycle** - Updated signal decision lifecycle to include `Executed` state so entry execution and exit closure are distinct stages.
- **paper execution contract** - `RecordPaperExecution` now uses composed entry plans with slippage checks instead of implicit latest-price-only sizing.
- **telemetry timeline** - Timeline and ledger mappings now carry planned and executed entry/exit prices plus strategy agreement evidence.
- **stories and tests** - Added story coverage and test obligations for composable entry/exit pricing behavior.
- **external boundary abstraction** - Replaced endpoint-centric external interface contracts with transport-agnostic command/query ports to keep MVP decoupled from concrete API services.
- **exit strategy catalogue** - Expanded composable exit strategy set with volatility trailing stop, time stop window, and structure break exit options.
- **exit module clarification profile** - Added default parameter profile and strategy-specific validation contracts for volatility trailing stop, time stop, and structure break exit.
- **whole-system chart readability** - Simplified the SPEC whole-system concept chart into lane-based flow with reduced arrow density for easier interpretation.

## 2026-04-22

### Added

- **commodity-crisis-signal-mvp.StrategyProfile** - Defined profile lifecycle, cadence configuration, and ownership boundaries.
- **commodity-crisis-signal-mvp.StrategyThesis** - Added first-class thesis entity, lifecycle state machine, and traceability contract for all emitted signals.
- **commodity-crisis-signal-mvp.SignalDecision** - Added deterministic decision entity with confidence and reason code traceability.
- **operations and state models** - Added signal generation, risk enforcement, invalidation handling, and lifecycle transitions.
- **interface contracts** - Added first-pass HTTP and internal provider interface definitions for paper-trading execution.
- **stories and workflow** - Added capability-scoped stories and workflow orchestration baseline for V1.
- **SPEC ownership and module map** - Clarified thesis-governed execution boundary and explicit feedback/invalidation loop in the top-level feature map.

### Changed

- **provider strategy contract** - Finalized Option D with Twelve Data for US and macro, broker-native B3 primary, and brapi Pro fallback plus explicit source-priority policy.
- **thesis governance policy** - Formalized balanced alignment weights and 2-cycle challenge/recovery persistence windows.
- **invalidation taxonomy** - Replaced free-form invalidation reasons with explicit `InvalidationReasonCode` enum and aligned interfaces/events.
- **story coverage matrix** - Expanded stories to include public, admin, cross-integration, and error-path mandatory slices.
