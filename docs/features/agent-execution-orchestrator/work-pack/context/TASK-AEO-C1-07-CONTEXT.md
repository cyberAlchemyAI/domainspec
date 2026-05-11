# Context Pack: TASK-AEO-C1-07

## Build Metadata

- Task: TASK-AEO-C1-07
- Feature: agent-execution-orchestrator
- Stage run id: 1cb963ff-6fa0-4d95-a5de-d4bd7af607e9
- Command contract: domainspec-context-builder agent-execution-orchestrator --task TASK-AEO-C1-07 --mode standard --strict --emit both
- Generated at: 2026-05-10T00:00:00Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-C1-07.md

## Framework Constraints Applied

- 2.0.10: bounded execution and search hardening constrain deterministic gate evidence references.
- 2.0.9: every started stage row must reconcile to a terminal outcome row.
- 2.0.8: delegated stage telemetry requires profile/thinking/stuck/retry terminal metadata.
- 2.0.7: suspected-stuck path allows one bounded retry before final blocked outcome.
- 2.0.4: strict selector-level + obligation-bound inclusion and interested-data subsets are mandatory.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| OBL-C1-07-01   | Execute the Capability 1 gate scenario defined in CAP-AEO-C1 with one selected stage-subset flow.                    |
| OBL-C1-07-02   | Produce one concise capability verdict (`pass`, `flag`, or `block`).                                                 |
| OBL-C1-07-03   | Include route selection evidence (`selectionPolicy`, `selectedStages`).                                              |
| OBL-C1-07-04   | Include ordered stage execution evidence (`stageRunId`, `order`, stage execution records).                           |
| OBL-C1-07-05   | Include parent run and stage execution references in the gate evidence bundle.                                       |
| OBL-C1-07-06   | Include full standard envelope references for stage and parent outcomes (telemetry pair + decision/transcript refs). |
| OBL-C1-07-07   | Bind DomainSpec coverage IDs `TelemetryEnvelope` and `RunArtifactMapping`.                                           |
| OBL-C1-07-08   | Bind DomainSpec coverage ID `StageExecution`.                                                                        |
| OBL-C1-07-09   | Bind DomainSpec coverage ID `StageSelectionContract`.                                                                |
| OBL-C1-07-10   | Bind `TEST-SPEC.md` coverage summary rows relevant to gate run evidence and lifecycle contracts.                     |
| OBL-C1-07-11   | Bind `STORIES.md` story coverage matrix rows for lifecycle + evidence/signal capabilities.                           |
| OBL-C1-07-12   | Preserve prerequisite continuity from TASK-AEO-C1-06 recovery/topology semantics.                                    |
| OBL-C1-07-13   | Append at least three non-duplicate lesson entries to capability-sequence-lessons.                                   |
| OBL-C1-07-14   | Draft reusable Capability 2+ task template constraints from lesson outputs.                                          |
| OBL-C1-07-15   | Keep definitions-phase scope explicit as docs-only/non-mutation.                                                     |
| OBL-C1-07-16   | Enforce strict schema gates (`selected[].selectors`, `selected[].obligationRefs`, `interestedData`).                 |
| OBL-C1-07-17   | Enforce standard-mode context budget and `noiseRatio <= 0.15`.                                                       |
| OBL-C1-07-18   | Apply latest changelog constraints (2.0.10, 2.0.9, 2.0.8, 2.0.7, 2.0.4).                                             |

## Candidate Ranking

Scoring formula applied per candidate:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

Lower score means higher inclusion priority.

## Selected Evidence (Strict, 14 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-C1-07.md
- Selectors: `# TASK-AEO-C1-07 - Capability Gate Run and Lessons Export` (line 1), `## Goal` (line 3), `## Wave Assignment` (line 7), `## Prerequisite` (line 15), `## Capability Slice` (line 19), `## DomainSpec Coverage` (line 27), `## Implementation Directives` (line 37), `## Completion Criteria` (line 45), `## Verification Evidence` (line 52)
- ObligationRefs: OBL-C1-07-01, OBL-C1-07-02, OBL-C1-07-03, OBL-C1-07-04, OBL-C1-07-05, OBL-C1-07-06, OBL-C1-07-12, OBL-C1-07-13, OBL-C1-07-14, OBL-C1-07-15
- Why included: primary C1-07 contract and obligation seed set.

### S02 - Capability gate and feed-forward contract

- Source: ../capabilities/CAP-AEO-C1-PIPELINE-EXECUTION.md
- Selectors: `# CAP-AEO-C1 - Pipeline Execution Capability Pilot` (line 1), `## Capability Gate Demo (Definition of Done)` (line 19), selected-stage gate flow line (line 23), route selection evidence line (line 27), stage execution record references line (line 29), `## Feed-Forward Contract For Remaining Capabilities` (line 59)
- ObligationRefs: OBL-C1-07-01, OBL-C1-07-03, OBL-C1-07-04, OBL-C1-07-05, OBL-C1-07-14
- Why included: canonical gate bundle shape and reusable Capability 2+ feed-forward rules.

### S03 - Prerequisite continuity source

- Source: ../tasks/TASK-AEO-C1-06.md
- Selectors: `# TASK-AEO-C1-06 - Failure Handling, Retry, and Supersession` (line 1), `## Goal` (line 3), `## Capability Slice` (line 27), `## DomainSpec Coverage` (line 36), `## Implementation Directives` (line 47), `## Completion Criteria` (line 55)
- ObligationRefs: OBL-C1-07-12
- Why included: C1-07 gate must preserve prior recovery/reconciliation contract continuity.

### S04 - Envelope mapping authority

- Source: ../../observability.md
- Selectors: `## RunArtifactMapping` (line 8), mapping row for `started` telemetry reference (line 19), mapping row for terminal telemetry reference (line 20), transcript reference row (line 25), decision snapshot row (line 26), `## Standard Evidence Envelope Checklist` (line 127)
- ObligationRefs: OBL-C1-07-06, OBL-C1-07-07
- Why included: binds standard evidence envelope completeness and TelemetryEnvelope field mapping.

### S05 - Stage execution identity authority

- Source: ../../domain.md
- Selectors: `### ExecutionRun` (line 47), `stageRuns` row (line 62), `telemetryEnvelopes` row (line 68), `### StageExecution` (line 90), `stageRunId` row (line 94), `order` row (line 96), `### TelemetryEnvelope` (line 153), envelope `stageRunId` row (line 157)
- ObligationRefs: OBL-C1-07-04, OBL-C1-07-05, OBL-C1-07-08
- Why included: formal source for ordered stage records and stage-to-envelope correlation keys.

### S06 - Stage selection and terminalization rule authority

- Source: ../../rules.md
- Selectors: `## RunStateMachine` (line 9), invariant `I-SM-4` deterministic stage order (line 37), `## StageSelectionContract` (line 147), selection formula line (line 154), constraints `SSC-1` (line 160), `SSC-2` (line 161), `## TerminalOutcomeRequired` (line 240)
- ObligationRefs: OBL-C1-07-03, OBL-C1-07-04, OBL-C1-07-09
- Why included: enforces ordered selected-stage constraints and explicit terminalization guarantees.

### S07 - Gate-run output and evidence references authority

- Source: ../../operations.md
- Selectors: `## ExecutePipelineRoute` (line 186), output rows `stageExecutions` (line 210), `terminalOutcomeByStageRunId` (line 211), `parentRunState` (line 212), `parentTerminalOutcome` (line 213), rule `R8` (line 227), calculation `C3` (line 238), `### Stage-Subset Chaining and Handoff Scenario (C1-05)` (line 279), ordered stage execution record evidence row (line 313), parent classification mapping evidence row (line 315)
- ObligationRefs: OBL-C1-07-04, OBL-C1-07-05, OBL-C1-07-06, OBL-C1-07-12
- Why included: operation-level contract for gate-run outcome mapping and auditable evidence references.

### S08 - Workflow ordering authority

- Source: ../../workflows.md
- Selectors: `## FeatureLifecyclePipelineWorkflow` (line 10), step 2 selected-stage order row (line 41), step 3 ordered prompt artifacts row (line 42), invariant `I-WF-1` (line 104), invariant `I-WF-2` (line 105), invariant `I-WF-3` (line 106)
- ObligationRefs: OBL-C1-07-04, OBL-C1-07-06
- Why included: workflow-level ordering and telemetry pair invariants for gate scenario proof.

### S09 - Test traceability coverage authority

- Source: ../../TEST-SPEC.md
- Selectors: trace row `AEO-TR-002` (line 38), trace row `AEO-TR-006` (line 42), trace row `AEO-TR-012` (line 48), `### Operation Obligations` (line 88), `### Observability and Evidence Obligations` (line 205), `## Coverage Summary` (line 232)
- ObligationRefs: OBL-C1-07-10
- Why included: provides deterministic test-obligation anchors tied to lifecycle and envelope coverage IDs.

### S10 - Story coverage authority

- Source: ../../STORIES.md
- Selectors: `## Sandcastle-Aligned Run Lifecycle` (line 45), `### US-002 Execute Route With Isolated Sandbox and Worktree` (line 47), `### US-003 Resume Interrupted Run Deterministically` (line 79), `## Governance Telemetry and Signal Emission` (line 171), `### US-006 Emit Standard Evidence Envelope Per Stage` (line 173), `### US-007 Emit Observer-Compatible Governance Signals` (line 203), `## Story Coverage Matrix` (line 233), matrix rows for lifecycle (line 238) and telemetry/signal (line 240)
- ObligationRefs: OBL-C1-07-11
- Why included: story-level coverage matrix binds lifecycle and evidence capabilities to testable user outcomes.

### S11 - Lessons sink and promotion gate

- Source: capability-sequence-lessons.md
- Selectors: `## Capability 1 Entries` (line 18), C1-05 lesson row (line 27), C1-06 lesson row (line 28), `## Promotion Rule` (line 30)
- ObligationRefs: OBL-C1-07-13, OBL-C1-07-14
- Why included: direct sink for required new lessons and reusable template constraints.

### S12 - Definitions-phase non-mutation scope guard

- Source: ../../WORK-PACK.md
- Selectors: `## Governance Signal Obligations (Docs-Only/Non-Mutation)` (line 174), planning-only note line (line 264), docs-only/non-mutation note line (line 265)
- ObligationRefs: OBL-C1-07-15
- Why included: explicit scope guard that this context pack is definitions-phase docs-only.

### S13 - Feature concept and graph subset authority

- Source: ../../SPEC.md
- Selectors: `## Concept Registry` (line 123), concept rows `StageExecution` (line 131), `TelemetryEnvelope` (line 135), `ExecutePipelineRoute` (line 144), `FeatureLifecyclePipelineWorkflow` (line 159), `RunArtifactMapping` (line 161), `## Feature Concept Graph` (line 164), edge rows at lines 168, 169, 172, 178
- ObligationRefs: OBL-C1-07-07, OBL-C1-07-08, OBL-C1-07-09, OBL-C1-07-16
- Why included: canonical concept IDs and relationship edges required for interested-data subset extraction.

### S14 - Framework strict-mode source

- Source: ../../../../../CHANGELOG.md
- Selectors: `## [2.0.10]` (line 26), `## [2.0.9]` (line 37), `## [2.0.8]` (line 48), `## [2.0.7]` (line 61), `## [2.0.4]` (line 85)
- ObligationRefs: OBL-C1-07-16, OBL-C1-07-17, OBL-C1-07-18
- Why included: strict relevance, budget/noise, and telemetry terminalization policy authority.

## Architecture Retrieval Map Resolution

- Explicit architecture references are not declared in `TASK-AEO-C1-07.md` coverage table or directives.
- Optional index artifacts under `docs/index/` are absent in this workspace and were not required to close any uncovered C1-07 obligations.
- Architecture expansion into `architecture/ARCHITECTURE.md` or `architecture/pattern-library/*` is excluded by strict gate (`no obligationRef -> exclude`).

## Interested Data Subsets

### Feature Graph Edge Subset (SPEC-scoped)

Only C1-07-relevant relationship edges were retained.

| From                                                          | Edge         | To                                                 | Evidence                    |
| ------------------------------------------------------------- | ------------ | -------------------------------------------------- | --------------------------- |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow | orchestrates | agent-execution-orchestrator.ExecutePipelineRoute  | SPEC feature graph line 168 |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow | orchestrates | agent-execution-orchestrator.EmitGovernanceSignals | SPEC feature graph line 169 |
| agent-execution-orchestrator.RunStateMachine                  | enforces     | agent-execution-orchestrator.ExecutePipelineRoute  | SPEC feature graph line 172 |
| agent-execution-orchestrator.RunArtifactMapping               | maps         | agent-execution-orchestrator.TelemetryEnvelope     | SPEC feature graph line 178 |

### Gate Evidence Subset

| Contract Element               | Required Subset                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Route selection evidence       | `selectionPolicy`, ordered `selectedStages`                                                              |
| Stage execution order evidence | Ordered `stageExecutions`, each with stable `stageRunId` and `order`                                     |
| Parent/stage mapping evidence  | `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`                                 |
| Standard envelope evidence     | one `started` row + one terminal row per `stageRunId`, transcript reference, decision snapshot reference |
| Gate verdict                   | exactly one concise verdict (`pass` or `flag` or `block`) with remediation when not pass                 |

### Lessons Feed-Forward Subset

| Contract Element   | Required Subset                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Lesson append rule | At least three non-duplicate Capability 1 lessons available before Capability 2 task design |
| Reuse constraints  | Convert proven C1 patterns into reusable C2+ task template constraints                      |
| Promotion gate     | Lessons must include executable evidence references and reuse rules                         |

## Excluded Candidates (Strict)

| Candidate                                                                                                                         | Exclusion Reason                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ../../interfaces.md                                                                                                               | No direct C1-07 coverage ID or directive requires interface expansion for this definitions-phase gate task.             |
| ../waves/W4.md                                                                                                                    | Wave status tracker contributes schedule metadata only; no unique gate-contract clauses beyond task/capability sources. |
| ../../architecture/ARCHITECTURE.md and ../../architecture/pattern-library/\*                                                      | No architecture obligation binding exists for C1-07 (`no obligationRef -> exclude`).                                    |
| ../../../../../docs/index/feature-map.md, ../../../../../docs/index/features-index.json, ../../../../../docs/index/tag-index.json | Optional index artifacts are absent and explicit task-linked sources already satisfy all obligations.                   |

## Budget And Strict Gate Check

- Selected files: 14 / 14 (standard budget pass)
- Excerpt lines: 276 / 280 (standard budget pass)
- Noise ratio: 0.14 (must be <= 0.15, pass)
- Selector gate: pass (14/14 selected entries include selectors)
- Obligation binding gate: pass (14/14 selected entries include obligationRefs)

## Blockers

- None. All C1-07 obligations are covered by scoped, selector-bound feature sources.
