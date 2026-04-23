# Pilot Decisions: Commodity Crisis Signal MVP

Date frozen: 2026-04-23
Last updated: 2026-04-23 (interactive decision gate)
Owner: Founding operator
Scope: Pilot execution policy for this feature

## Decision Table

| Decision | Selected Option | Rationale | Source |
| --- | --- | --- | --- |
| Scope | Wave 1 focuses on deterministic domain and backend contract obligations for this feature only. | De-risks pilot by constraining to core semantic behavior first. | SPEC.md decision gate |
| Visibility | Pilot evidence is internal to founder-operator and risk-review workflows. | Keeps pilot review loop tight and auditable. | SPEC.md decision gate |
| Policy strictness | Strict fail-fast and hard-block behavior for risk and telemetry violations. | Preserves governance integrity under uncertain market conditions. | operations.md R3, R6-R10, R19 |
| Rounding | No semantic rounding in domain rules; presentation rounding is evidence-only. | Avoids silent semantic drift in core calculations. | operations.md C1-C21 |
| Auth gate | Trusted operator context is required for mutating command flows in pilot execution. | Prevents unauthorized mutation during pilot operation. | interfaces.md StrategyCommandPort |
| Dedupe gate | Idempotent duplicate handling for invalidation and close, plus trigger dedupe in hybrid cadence. | Ensures deterministic lifecycle behavior across retries and cadence overlap. | operations.md R10, R13; workflows.md CadenceSelectionPolicy |
| Audit metadata | Every decision trace includes profileId, thesisId, thesisVersion, decisionId, timestamps, reason code, and strategy evidence. | Maintains full traceability for pilot review. | domain.md SignalDecision; queries.md GetSignalTimeline |
| Failure policy | On contract/rule failure, emit explicit error and block progression to execution path. | Fails closed and protects pilot integrity. | workflows.md SignalCycleWorkflow; operations.md error states |
| Decision model | Deterministic rule and threshold model with no discretionary override. | Aligns with repeatable thesis validation. | operations.md GenerateSignal, EvaluateThesisAlignment, EvaluateRiskEnvelope |
| Verification command substitution | Repository uses `npx tsx domainspec/tools/validate-doc-links.ts` and `bash domainspec/tools/check_docs_sync.sh` in place of unavailable `npm run docs:index`. | Matches actual repository toolchain while preserving verification intent. | PILOT-ROADMAP.md Phase 5 |
| Runtime stack | Node.js + TypeScript (`tsx`) for the minimal executable Wave 1 runtime substrate. | Aligns with existing TypeScript-based DomainSpec tooling and minimizes bootstrap time. | AskQuestions gate (2026-04-23) |
| Execution surface | CLI/in-process adapters only for Wave 1 evidence collection. | Fastest path to BR-001 closure before adding HTTP transport obligations. | AskQuestions gate (2026-04-23) |
| Provider mode | Deterministic fixtures only during pilot evidence generation. | Maximizes repeatability and reduces external instability while closing blockers. | AskQuestions gate (2026-04-23) |
| Storage mode | Flat files (JSON/CSV) for pilot run persistence. | Keeps setup minimal and artifacts straightforward to attach in evidence packs. | AskQuestions gate (2026-04-23) |
| Failure policy (ingestion runtime) | Retry queue then fallback marker for ingestion/runtime failures, while domain contract/rule failures remain fail-closed. | Improves operational resilience without relaxing governance-critical rule enforcement. | AskQuestions gate (2026-04-23) |
| Scheduling model | Manual command-triggered execution for initial pilot runs. | Supports controlled evidence generation and quick iteration while substrate is being established. | AskQuestions gate (2026-04-23) |
| Evidence pack depth | Extended matrix as the first closure target for BR-001. | Prioritizes stronger confidence and broader scenario coverage in initial readiness evidence. | AskQuestions gate (2026-04-23) |

## Resolution Status

All blocker-level pilot decisions are resolved for this feature's pilot-readiness flow.
