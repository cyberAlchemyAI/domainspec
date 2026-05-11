# Context Pack: TASK-AEO-C1-03

## Build Metadata

- Task: TASK-AEO-C1-03
- Feature: agent-execution-orchestrator
- Stage run id: bf4947df-65f7-4cae-bab5-39e92965db3f
- Generated at: 2026-05-11T00:20:56Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-C1-03.md

## Framework Constraints Applied

- 2.0.10: terminal guard and bounded command/search behavior constrain runner execution semantics.
- 2.0.9: stale started telemetry rows must always reconcile to terminal outcomes.
- 2.0.8: delegated stage telemetry rows must include profile, thinking budget, suspected-stuck, retryCount, and duration fields.
- 2.0.7: suspected stuck delegated runs require one bounded retry before final blocked outcome.
- 2.0.4: context-builder output must be selector-bound, obligation-bound, interested-data scoped, and noise-budget compliant.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| OBL-C1-03-01   | Define runner input contract: parent run context, ordered stage prompt artifacts, and execution profile.                                 |
| OBL-C1-03-02   | Define runner output contract: stage-level terminal outcomes and parent-run terminal outcome mapping.                                    |
| OBL-C1-03-03   | Define timeout and stuck-detection semantics aligned to watchdog profile budgets.                                                        |
| OBL-C1-03-04   | Define isolation semantics for `shared-run` vs `isolated-child-run`, including parent/child linkage and reconciliation.                  |
| OBL-C1-03-05   | Cover operation contract for `ExecutePipelineRoute`.                                                                                     |
| OBL-C1-03-06   | Cover `StageExecution` value object constraints for stage-level run records.                                                             |
| OBL-C1-03-07   | Cover `StageIsolationMode` enum semantics.                                                                                               |
| OBL-C1-03-08   | Cover `TerminalOutcomeRequired` invariant for started-to-terminal pairing.                                                               |
| OBL-C1-03-09   | Cover `WatchdogTimeoutRule` thresholds and formal predicate.                                                                             |
| OBL-C1-03-10   | Cover `StageRunTopology` parent/child topology rule.                                                                                     |
| OBL-C1-03-11   | Cover `SandboxProviderInterface` provider-agnostic runner boundary.                                                                      |
| OBL-C1-03-12   | Carry forward C1-02 unresolved `stageRunIdsByStage` identity risk into runner identity semantics.                                        |
| OBL-C1-03-13   | Preserve lesson-log update obligation in capability sequence context.                                                                    |
| OBL-C1-03-14   | Enforce strict context-builder schema (`selected[].selectors`, `selected[].obligationRefs`, `interestedData`) and standard-mode budgets. |

## Candidate Ranking

Scoring formula applied per candidate:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

Lower score indicates higher inclusion priority.

## Selected Evidence (Strict, 10 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-C1-03.md
- Selectors: `# TASK-AEO-C1-03 - Runner Execution Contract` (line 1), `## Goal` (line 3), `## Prerequisites` (line 15), `## Capability Slice` (line 20), `## DomainSpec Coverage` (line 28), `## Implementation Directives` (line 40), `## Completion Criteria` (line 48), `## Verification Evidence` (line 54)
- ObligationRefs: OBL-C1-03-01, OBL-C1-03-02, OBL-C1-03-03, OBL-C1-03-04, OBL-C1-03-05, OBL-C1-03-06, OBL-C1-03-07, OBL-C1-03-08, OBL-C1-03-09, OBL-C1-03-10, OBL-C1-03-11, OBL-C1-03-12, OBL-C1-03-13
- Why included: primary task contract and all explicit coverage-id seed links.
- Excerpt:

> "Runner input | Parent run context, ordered stage prompt artifacts, and execution profile"
>
> "Runner output | Stage execution outcomes plus parent run terminal state"

### S02 - Immediate prerequisite identity and ordering carry-forward

- Source: ../tasks/TASK-AEO-C1-02.md
- Selectors: `## DomainSpec Coverage` (line 35), `## Decision Preflight Snapshot` (line 55), `### Unresolved Risks` (line 67), unresolved risk row referencing C1-03 (line 71)
- ObligationRefs: OBL-C1-03-01, OBL-C1-03-04, OBL-C1-03-12
- Why included: C1-03 must close the C1-02 identity-risk follow-up and preserve deterministic stage-order assumptions.
- Excerpt:

> "Revisit in TASK-AEO-C1-03 ... when parent/stage execution identity strategy is finalized."

### S03 - Upstream prompt baseline prerequisite

- Source: ../tasks/TASK-AEO-C1-01.md
- Selectors: `## DomainSpec Coverage` (line 29), `## Implementation Directives` (line 37)
- ObligationRefs: OBL-C1-03-01, OBL-C1-03-12
- Why included: runner input contract must remain compatible with the prompt schema baseline and deterministic prompt obligations.
- Excerpt:

> "Prompt schema | Required prompt fields, type constraints, and validation rules"

### S04 - Runner operation contract authority

- Source: ../../operations.md
- Selectors: `## ExecutePipelineRoute` (line 185), `### Input` (line 191), `### Rules` (line 203), `### Calculations` (line 215), `### State Transition` (line 222), `### Postconditions` (line 226), `### Error States` (line 233)
- ObligationRefs: OBL-C1-03-01, OBL-C1-03-02, OBL-C1-03-03, OBL-C1-03-04, OBL-C1-03-05
- Why included: defines canonical runner inputs/outputs, watchdog-based stuck predicate, parent-child run linkage, and blocked/failed boundaries.
- Excerpt:

> "parentRunId ... Present only when executing a stage as isolated child run"
>
> "Run must terminate with explicit outcome"
>
> "Retry budget exhausted | Return blocked with remediation"

### S05 - Domain model for stage/run records and isolation

- Source: ../../domain.md
- Selectors: `### ExecutionRun` (line 47), `### StageExecution` (line 89), `### StageIsolationMode` (line 185), `### TerminalOutcome` (line 205)
- ObligationRefs: OBL-C1-03-02, OBL-C1-03-04, OBL-C1-03-06, OBL-C1-03-07
- Why included: formal shape of parent run and stage execution records, isolation-mode and terminal-outcome enums.
- Excerpt:

> "stageRuns ... Ordered stage execution records under this run"
>
> "childRunId ... Required when isolationMode=isolated-child-run"

### S06 - Rule-level watchdog/topology/terminal invariants

- Source: ../../rules.md
- Selectors: `## WatchdogTimeoutRule` (line 108), `## StageRunTopology` (line 187), `## TerminalOutcomeRequired` (line 198)
- ObligationRefs: OBL-C1-03-03, OBL-C1-03-08, OBL-C1-03-09, OBL-C1-03-10
- Why included: provides formal watchdog threshold budgets, parent-child topology invariant, and started-to-terminal outcome invariant.
- Excerpt:

> "elapsedMs > profileBudgetMs -> suspectedStuck=true"
>
> "started(sr.stageRunId) -> exists terminal(sr.stageRunId)"

### S07 - Provider boundary and runtime isolation interface

- Source: ../../interfaces.md
- Selectors: `## Internal: SandboxProviderInterface` (line 76), `### Methods` (line 85), `### Contract Notes` (line 94)
- ObligationRefs: OBL-C1-03-01, OBL-C1-03-05, OBL-C1-03-11
- Why included: declares provider-agnostic runner interface and Sandcastle baseline semantics for create/release lifecycle.
- Excerpt:

> "createSandbox ... Maps To ExecutePipelineRoute"
>
> "MVP baseline requires ProviderAdapter value sandcastle"

### S08 - Feature graph and concept-id authority subset

- Source: ../../SPEC.md
- Selectors: `## Concept Registry` (line 123), concept rows for `StageExecution` (line 131), `StageIsolationMode` (line 137), `ExecutePipelineRoute` (line 144), `WatchdogTimeoutRule` (line 152), `SandboxProviderInterface` (line 155), `## Feature Concept Graph` (line 164), edge `RunStateMachine | enforces | ExecutePipelineRoute` (line 172), edge `SandboxProviderInterface | exposes | ExecutePipelineRoute` (line 176)
- ObligationRefs: OBL-C1-03-05, OBL-C1-03-06, OBL-C1-03-07, OBL-C1-03-09, OBL-C1-03-11, OBL-C1-03-14
- Why included: task coverage IDs map to these concept/edge anchors; also serves as source for interested-data edge subset.
- Excerpt:

> "StageExecution ... one execution record per selected stage with unique stageRunId"
>
> "SandboxProviderInterface ... exposes ... ExecutePipelineRoute"

### S09 - Capability lesson continuity sink

- Source: capability-sequence-lessons.md
- Selectors: `## Capability 1 Entries` (line 18), row for `TASK-AEO-C1-02` pattern carry-forward (line 24), `## Promotion Rule` (line 26)
- ObligationRefs: OBL-C1-03-13
- Why included: C1-03 directive explicitly requires one lesson entry on completion and must preserve capability-level sequencing contract.
- Excerpt:

> "place builder-contract tasks before runner tasks ... before enabling execution topology changes"

### S10 - Framework hard constraints for strict mode

- Source: ../../../../../CHANGELOG.md
- Selectors: `## [2.0.10]` (line 26), `## [2.0.9]` (line 37), `## [2.0.8]` (line 48), `## [2.0.7]` (line 61), `## [2.0.4]` (line 85)
- ObligationRefs: OBL-C1-03-03, OBL-C1-03-14
- Why included: governs current stage execution and strict context-builder requirements.
- Excerpt:

> "strict relevance gate ... selector-level evidence and obligation binding"
>
> "mode budgets hardened ... noise ratio <= 0.15"

## Architecture Retrieval Map Resolution

- Explicit architecture references are not declared in `TASK-AEO-C1-03.md` coverage table or implementation directives.
- No uncovered C1-03 obligation required expansion into `architecture/ARCHITECTURE.md` or `architecture/pattern-library/*`.
- Architecture expansion was excluded by strict gate (`no obligationRef -> exclude`).

## Interested Data Subsets

### Feature Graph Edge Subset (SPEC-scoped)

Only runner-contract edges needed by C1-03 obligations were retained.

| From                                                          | Edge         | To                                                | Evidence                        |
| ------------------------------------------------------------- | ------------ | ------------------------------------------------- | ------------------------------- |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow | orchestrates | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` |
| agent-execution-orchestrator.RunStateMachine                  | enforces     | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` |
| agent-execution-orchestrator.SandboxProviderInterface         | exposes      | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` |

### Runner Contract Field Subset

| Contract Element    | Required Subset                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Runner input        | `runId`, `parentRunId`, `pipelineId`, `templateId`, `provider`, `branchStrategy`, `stageInputs`, profile-bound watchdog budget |
| Runner output       | parent `ExecutionRun.currentState/terminalOutcome`, ordered `StageExecution[]`, per-stage terminal outcome                     |
| Guarding            | `suspectedStuck`, `retryCount`, watchdog profile thresholds (`quick`, `standard`, `deep`)                                      |
| Isolation topology  | `StageExecution.isolationMode`, `childRunId` requirement, child `ExecutionRun.parentRunId` linkage                             |
| Terminal invariants | `started(stageRunId) -> terminal(stageRunId)` where outcome in `{completed,blocked,failed,canceled}`                           |

## Excluded Candidates (Strict)

| Candidate                                                         | Exclusion Reason                                                                                                            |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ../../WORK-PACK.md                                                | Work-pack manifest is planning-derivative for this task; explicit task + aspect docs already satisfy all C1-03 obligations. |
| ../../workflows.md                                                | No direct C1-03 coverage ID binds workflow sections beyond what operation/rule contracts already provide.                   |
| ../../observability.md                                            | C1-03 scope is runner contract and execution topology; observability mappings are not direct obligations in this slice.     |
| ../../../../../architecture/ARCHITECTURE.md                       | No explicit architecture retrieval-map obligation for C1-03 (`no obligationRef -> exclude`).                                |
| ../../../../../architecture/pattern-library/                      | No C1-03 obligation requires pattern-library expansion.                                                                     |
| ../../../../../docs/index/feature-map.md and index json artifacts | Index expansion was unnecessary because explicit task links fully covered all obligations.                                  |

## Budget And Strict Gate Check

- Selected files: 10 / 14 (standard budget pass)
- Excerpt lines: 170 / 280 (standard budget pass)
- Noise ratio: 0.12 (must be <= 0.15, pass)
- Selector gate: pass (10/10 selected entries include selectors)
- Obligation binding gate: pass (10/10 selected entries include obligationRefs)

## Blockers

- None. All obligations from `TASK-AEO-C1-03.md` were covered by explicit task-scoped sources.
