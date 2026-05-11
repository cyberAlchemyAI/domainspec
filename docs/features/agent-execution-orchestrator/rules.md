# Rules: Agent Execution Orchestrator

## Capability Backlinks

- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## RunStateMachine

**Type:** State Machine
**Applies To:** [ExecutionRun](domain.md#executionrun)

### Transition Table

| From          | Event            | To            | Guard                                                                                                    | Effect                                                                                       |
| ------------- | ---------------- | ------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| queued        | run-started      | running       | Valid [PipelineRouteTemplate](domain.md#pipelineroutetemplate) exists                                    | Allocate [SandboxLease](domain.md#sandboxlease) and [WorktreeLease](domain.md#worktreelease) |
| running       | retry-requested  | waiting-retry | [RetryPolicy](#retrypolicy) budget not exhausted                                                         | Increment [ExecutionRun](domain.md#executionrun).retryCount                                  |
| waiting-retry | retry-started    | running       | Retry scope narrowed                                                                                     | Continue same stage with narrowed inputs                                                     |
| running       | resume-requested | resuming      | [SessionSnapshot](domain.md#sessionsnapshot) complete                                                    | Restore runtime context                                                                      |
| resuming      | resume-succeeded | running       | Snapshot validation passes                                                                               | Continue stage execution                                                                     |
| running       | stage-completed  | running       | Remaining stage executions exist and telemetry pair for completed stage is present                       | Advance to next [StageExecution](domain.md#stageexecution) in route order                    |
| running       | run-completed    | completed     | All selected stage executions are terminal and [TelemetryPairRequired](#telemetrypairrequired) satisfied | Release leases and finalize stage envelopes                                                  |
| running       | stage-blocked    | blocked       | Remediation available                                                                                    | Emit recovery signal                                                                         |
| running       | stage-failed     | failed        | Non-recoverable failure                                                                                  | Emit failure signal                                                                          |
| running       | superseded       | canceled      | [CancellationPolicy](#cancellationpolicy) chooses latest-run-wins                                        | Cancel active run and emit cancellation signal                                               |
| waiting-retry | retry-exhausted  | blocked       | Retry budget exhausted                                                                                   | Emit bounded retry remediation                                                               |

### Invariants

| ID     | Invariant                                      | Formal                                                                                      |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| I-SM-1 | Terminal states are explicit and finite        | `RunState in {completed,blocked,failed,canceled}`                                           |
| I-SM-2 | Lease cleanup is mandatory for terminal states | `RunState terminal -> sandboxLease.releasedAt != null and worktreeLease.leasePath released` |
| I-SM-3 | Resume path is deterministic                   | `RunState=resuming -> snapshot.complete=true`                                               |
| I-SM-4 | Stage execution order is deterministic         | `ExecutionRun.stageRuns.order follows PipelineRouteTemplate.selectedStages`                 |

---

## BranchStrategyPolicy

**Type:** Policy
**Applies To:** [ExecutePipelineRoute](operations.md#executepipelineroute)

### Decision Table

| Condition                          | Selected Behavior   | Notes                            |
| ---------------------------------- | ------------------- | -------------------------------- |
| No explicit override provided      | Use `merge-to-head` | Decision lock D-AEO-001          |
| Stage requires strict isolation    | Use `branch`        | Manual override allowed          |
| Stage is non-mutating and low risk | Use `head`          | Only when route contract permits |

### Constraints

| ID     | Constraint                                                                                    | Formal                                     |
| ------ | --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| P-BS-1 | Default strategy remains `merge-to-head` unless explicit policy exception                     | `overrideAbsent -> strategy=merge-to-head` |
| P-BS-2 | Strategy choice must be recorded in [TelemetryEnvelope](domain.md#telemetryenvelope) evidence | `strategy in envelope.decisionSnapshotRef` |

---

## RetryPolicy

**Type:** Policy
**Applies To:** [ExecutePipelineRoute](operations.md#executepipelineroute), [LatestRunWinsRecoveryWorkflow](workflows.md#latestrunwinsrecoveryworkflow)

### Configuration

| Parameter          | Type                             | Default                    | Description                                 |
| ------------------ | -------------------------------- | -------------------------- | ------------------------------------------- |
| maxRetries         | integer                          | 1                          | One bounded retry before terminal `blocked` |
| narrowingRequired  | boolean                          | true                       | Retry must reduce scope or thinking budget  |
| allowedRetryStates | [RunState](domain.md#runstate)[] | `running`, `waiting-retry` | Retry only in active states                 |

### Rules

| ID    | Rule                                                    | Formal                                                           |
| ----- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| P-R-1 | Retry count is bounded                                  | `retryCount <= maxRetries`                                       |
| P-R-2 | Retry must narrow execution scope                       | `retryCount > 0 -> narrowedScope=true`                           |
| P-R-3 | Retry exhaustion yields deterministic `blocked` outcome | `retryCount = maxRetries and failure -> terminalOutcome=blocked` |

---

## CancellationPolicy

**Type:** Policy
**Applies To:** [CancelSupersededRun](operations.md#cancelsupersededrun)

### Decision Table

| Condition                                             | Selected Behavior                             | Notes                                       |
| ----------------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| New run started for same route scope                  | Cancel older active run                       | Decision lock D-AEO-004 (`latest-run-wins`) |
| Manual cancellation requested with no replacement run | Cancel selected run and emit remediation note | Requires explicit operator reason           |
| Run already terminal                                  | No-op                                         | Preserve append-only history                |

### Rules

| ID    | Rule                                           | Formal                                           |
| ----- | ---------------------------------------------- | ------------------------------------------------ |
| P-C-1 | Latest run always wins supersession            | `exists newerRun -> olderRun.state=canceled`     |
| P-C-2 | Canceled run still requires terminal telemetry | `state=canceled -> terminalTelemetryRef != null` |

---

## WatchdogTimeoutRule

**Type:** Rule
**Applies To:** [ExecutionRun](domain.md#executionrun) stage monitoring

### Thresholds

| Delegation Profile | Timeout Budget |
| ------------------ | -------------- |
| quick              | 8 minutes      |
| standard           | 15 minutes     |
| deep               | 25 minutes     |

### Rule

`elapsedMs > profileBudgetMs -> suspectedStuck=true`

`suspectedStuck=true and retryCount < maxRetries -> nextState=waiting-retry`

`suspectedStuck=true and retryCount = maxRetries -> terminalOutcome=blocked`

### Boundary Notes

- Watchdog budgets are selected from `executionProfile` provided to [ExecutePipelineRoute](operations.md#executepipelineroute).
- Any watchdog-driven terminal transition must still satisfy [TerminalOutcomeRequired](#terminaloutcomerequired) for the same `stageRunId`.

---

## PlannerGateBeforeFeatureMutation

**Type:** Policy
**Applies To:** [AssemblePipelineRoute](operations.md#assemblepipelineroute) and any feature-doc mutation stages

### Rule

`featurePathMutation -> WORK-PACK plannerGateStatus = pass`

---

## StageSelectionContract

**Type:** Rule
**Applies To:** [AssemblePipelineRoute](operations.md#assemblepipelineroute)

### Rule

`selectionPolicy=stage-subset -> length(selectedStages)>=1 and distinct(selectedStages) and selectedStages subsetOf stageContracts.stage and preservesOrder(selectedStages, stageContracts.stage)`

### Constraints

| ID    | Constraint                                                | Formal                                                                                   |
| ----- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| SSC-1 | Stage-subset selection must be non-empty and distinct     | `selectionPolicy=stage-subset -> length(selectedStages)>=1 and distinct(selectedStages)` |
| SSC-2 | Stage-subset selection must preserve template stage order | `selectionPolicy=stage-subset -> preservesOrder(selectedStages, stageContracts.stage)`   |
| SSC-3 | Full-lifecycle selection expands to full template order   | `selectionPolicy=full-lifecycle -> selectedStages = stageContracts.stage`                |

---

## PromptBuildStepContract

**Type:** Rule
**Applies To:** [AssemblePipelineRoute](operations.md#assemblepipelineroute) prompt builder step

### Rule

`selectionResolved -> buildPromptArtifacts(selectedStages, stageContracts, stageInputRefsByStage, requiredArtifactRefsByStage, stageRunIdsByStage, handoffArtifactRefsByStagePair, decisionSnapshotRef, createdAtByStage)`

### Constraints

| ID     | Constraint                                                                   | Formal                                                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-PB-1 | Prompt build requires selected-stage inputs for every selected stage         | `forall s in selectedStages, length(stageInputRefsByStage[s])>=1`                                                                                                                     |
| P-PB-2 | Prompt build requires required-artifact refs for every selected stage        | `forall s in selectedStages, length(requiredArtifactRefsByStage[s])>=1`                                                                                                               |
| P-PB-3 | Prompt build requires one stageRunId per selected stage                      | `forall s in selectedStages, stageRunIdsByStage[s] != null`                                                                                                                           |
| P-PB-4 | Prompt artifact output order must equal selected stage order                 | `promptArtifacts.order = selectedStages`                                                                                                                                              |
| P-PB-5 | Prompt artifact set cardinality must equal selected stage count              | `length(promptArtifacts)=length(selectedStages)`                                                                                                                                      |
| P-PB-6 | Prompt build requires handoff refs for every consecutive selected-stage pair | `forall i in [0..length(selectedStages)-2], length(handoffArtifactRefsByStagePair[selectedStages[i] + "->" + selectedStages[i+1]])>=1`                                                |
| P-PB-7 | Consecutive handoff refs must satisfy next-stage required artifact refs      | `forall i in [0..length(selectedStages)-2], requiredArtifactRefsByStage[selectedStages[i+1]] subsetOf handoffArtifactRefsByStagePair[selectedStages[i] + "->" + selectedStages[i+1]]` |

### Failure Boundaries

| Condition                                                                          | Result                          |
| ---------------------------------------------------------------------------------- | ------------------------------- |
| Missing prompt build input bundle                                                  | `PROMPT_BUILD_INPUTS_REQUIRED`  |
| Selected stage has empty/missing `stageInputRefsByStage`                           | `PROMPT_STAGE_INPUT_MISSING`    |
| Selected stage has missing `stageRunIdsByStage`                                    | `PROMPT_STAGE_RUN_ID_MISSING`   |
| Consecutive selected-stage pair has empty/missing `handoffArtifactRefsByStagePair` | `PROMPT_STAGE_HANDOFF_MISSING`  |
| Consecutive handoff refs do not satisfy next-stage required artifact refs          | `PROMPT_STAGE_HANDOFF_MISMATCH` |
| Output order/count mismatch against selected stage set                             | `PROMPT_ARTIFACT_SET_INVALID`   |

---

## StageRunTopology

**Type:** Rule
**Applies To:** [ExecutionRun](domain.md#executionrun), [StageExecution](domain.md#stageexecution)

### Rule

`parentRun contains ordered stageRuns; stageRun.isolationMode=isolated-child-run -> exists childRun with parentRunId=parentRun.runId`

### Constraints

| ID     | Constraint                                                              | Formal                                                                                                                                                              |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-RT-1 | Parent run tracks one ordered stage record per selected stage           | `forall s in selectedStages, exists unique sr in parentRun.stageRuns where sr.stage=s`                                                                              |
| T-RT-2 | Stage identity is preserved from ordered prompt artifacts               | `sr.order=i -> sr.stageRunId = stagePromptArtifacts[i].stageRunId`                                                                                                  |
| T-RT-3 | Isolated child runs reconcile terminal outcomes to parent stage records | `sr.isolationMode=isolated-child-run and childRun.terminalOutcome=t -> sr.terminalOutcome=t`                                                                        |
| T-RT-4 | Consecutive stage records preserve handoff continuity                   | `forall i in [0..n-2], stageRuns[i].order + 1 = stageRuns[i+1].order and handoffArtifactRefsByStagePair[stageRuns[i].stage + "->" + stageRuns[i+1].stage] != empty` |

---

## StageHandoffMismatchClassification

**Type:** Rule
**Applies To:** [ExecutePipelineRoute](operations.md#executepipelineroute) consecutive stage transitions

### Rule

`requiredArtifactRefsByStage[nextStage] notSubsetOf handoffArtifactRefsByStagePair[currentStage->nextStage] -> stageTerminalOutcome=blocked and parentTerminalOutcome=blocked and reason=STAGE_HANDOFF_INPUT_UNRESOLVED`

`handoff topology mismatch (order or stageRunId continuity) -> stageTerminalOutcome=failed and parentTerminalOutcome=failed and reason=STAGE_HANDOFF_TOPOLOGY_MISMATCH`

### Remediation Hooks

| Condition                         | Required remediation                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `STAGE_HANDOFF_INPUT_UNRESOLVED`  | Regenerate previous-stage artifacts, rebuild prompt artifacts, and retry within [RetryPolicy](#retrypolicy) bounds |
| `STAGE_HANDOFF_TOPOLOGY_MISMATCH` | Stop run, repair ordered stage topology at route assembly, and restart run                                         |

---

## TerminalOutcomeRequired

**Type:** Invariant
**Applies To:** [ExecutionRun](domain.md#executionrun) and stage execution

### Rule

`forall sr in ExecutionRun.stageRuns, started(sr.stageRunId) -> exists terminal(sr.stageRunId) where outcome in {completed,blocked,failed,canceled}`

`ExecutionRun.currentState in {completed,blocked,failed,canceled} -> ExecutionRun.terminalOutcome in {completed,blocked,failed,canceled}`

`ExecutionRun.terminalOutcome = reduce(ExecutionRun.stageRuns.terminalOutcome, precedence failed > blocked > canceled > completed)`

---

## TelemetryPairRequired

**Type:** Rule
**Applies To:** [TelemetryEnvelope](domain.md#telemetryenvelope)

### Rule

`forall envelope in ExecutionRun.telemetryEnvelopes, envelope.startedTelemetryRef != null and envelope.terminalTelemetryRef != null`

---

## PromptArtifactSchemaRequired

**Type:** Rule
**Applies To:** Prompt artifact payload used by runner entry

### Rule

`required(promptVersion, pipelineId, templateId, stageRunId, stage, stageInputRefs, requiredArtifactRefs, decisionSnapshotRef, createdAt)`

### Constraints

| ID     | Constraint                         | Formal                                      |
| ------ | ---------------------------------- | ------------------------------------------- |
| P-PA-1 | Stage linkage is mandatory         | `stageRunId != null and stage in StageType` |
| P-PA-2 | Stage inputs cannot be empty       | `length(stageInputRefs) >= 1`               |
| P-PA-3 | Required artifacts cannot be empty | `length(requiredArtifactRefs) >= 1`         |

---

## PromptArtifactDeterminism

**Type:** Rule
**Applies To:** Prompt artifact serialization and validation

### Rule

`same(stageContract, stageInputRefs, requiredArtifactRefs, stageRunId, decisionSnapshotRef, createdAt) -> same(normalizedPromptArtifact)`

### Normalization Requirements

| ID     | Requirement                        | Formal                                                               |
| ------ | ---------------------------------- | -------------------------------------------------------------------- |
| P-PD-1 | Canonical key order                | `serializeKeys(promptArtifact) = lexicalOrder(keys(promptArtifact))` |
| P-PD-2 | Canonical input reference order    | `stageInputRefs = sortLex(stageInputRefs)`                           |
| P-PD-3 | Canonical required artifact order  | `requiredArtifactRefs = sortLex(requiredArtifactRefs)`               |
| P-PD-4 | Canonical timestamp representation | `createdAt in ISO8601-UTC`                                           |

### Multi-Stage Reproducibility Check

| ID     | Requirement                                                                                           | Formal                                                                                                                                                                                                |
| ------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-PD-5 | Repeated prompt build with same selected stage subset produces identical normalized artifact-set hash | `same(selectionPolicy, selectedStages, stageContracts, stageInputRefsByStage, requiredArtifactRefsByStage, stageRunIdsByStage, decisionSnapshotRef, createdAtByStage) -> same(promptArtifactSetHash)` |
| P-PD-6 | Build iteration order for hash computation must follow selected stage order                           | `hashInputOrder = selectedStages`                                                                                                                                                                     |
| P-PD-7 | Hash mismatch for same inputs is deterministic failure                                                | `sameInputs and hashMismatch -> PROMPT_ARTIFACT_NON_DETERMINISTIC`                                                                                                                                    |

---

## OrphanRateScopeEligibility

**Type:** Policy
**Applies To:** `orphan_stage_run_rate` in [observability.md](observability.md#metrics-derived-from-telemetry)

### Rule

Only delegated commands `domainspec-implement` and `domainspec-tag-code` are included in both `orphan_stage_run_rate` denominator and numerator.

Formal: `delegatedCommand in {domainspec-implement,domainspec-tag-code} -> included in orphan_stage_run_rate`

---

## ArtifactEvidenceMinimum

**Type:** Rule
**Applies To:** [TelemetryEnvelope](domain.md#telemetryenvelope)

### Rule

`required(startedTelemetryRef, terminalTelemetryRef, terminalGuardEvidenceRefs, transcriptExcerptRef, decisionSnapshotRef)`

### Standard Envelope Set

| Artifact                     | Required | Source Contract                                                    |
| ---------------------------- | -------- | ------------------------------------------------------------------ |
| Delegation started row       | yes      | [DELEGATION-TUNING.md](../../signals/DELEGATION-TUNING.md)         |
| Delegation terminal row      | yes      | [DELEGATION-TUNING.md](../../signals/DELEGATION-TUNING.md)         |
| Terminal guard evidence      | yes      | [TERMINAL-GUARD.md](../../../../../docs/signals/TERMINAL-GUARD.md) |
| Transcript excerpt reference | yes      | [WORK-PACK.md](WORK-PACK.md) decision lock D-AEO-003               |
| Decision snapshot reference  | yes      | [WORK-PACK.md](WORK-PACK.md) decision lock D-AEO-003               |
