# Rules: Agent Execution Orchestrator

## Capability Backlinks

- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## RunStateMachine

**Type:** State Machine
**Applies To:** [ExecutionRun](domain.md#executionrun)

### Transition Table

| From          | Event            | To            | Guard                                                                                                             | Effect                                                                                       |
| ------------- | ---------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| queued        | run-started      | running       | Valid [PipelineRouteTemplate](domain.md#pipelineroutetemplate) exists                                             | Allocate [SandboxLease](domain.md#sandboxlease) and [WorktreeLease](domain.md#worktreelease) |
| running       | retry-requested  | waiting-retry | [RetryPolicy](#retrypolicy) budget not exhausted                                                                  | Increment [ExecutionRun](domain.md#executionrun).retryCount                                  |
| waiting-retry | retry-started    | running       | Retry scope narrowed                                                                                              | Continue same stage with narrowed inputs                                                     |
| running       | resume-requested | resuming      | [SessionSnapshot](domain.md#sessionsnapshot) complete                                                             | Restore runtime context                                                                      |
| resuming      | resume-succeeded | running       | Snapshot validation passes                                                                                        | Continue stage execution                                                                     |
| running       | stage-completed  | completed     | [TerminalOutcomeRequired](#terminaloutcomerequired) and [TelemetryPairRequired](#telemetrypairrequired) satisfied | Release leases and finalize [TelemetryEnvelope](domain.md#telemetryenvelope)                 |
| running       | stage-blocked    | blocked       | Remediation available                                                                                             | Emit recovery signal                                                                         |
| running       | stage-failed     | failed        | Non-recoverable failure                                                                                           | Emit failure signal                                                                          |
| running       | superseded       | canceled      | [CancellationPolicy](#cancellationpolicy) chooses latest-run-wins                                                 | Cancel active run and emit cancellation signal                                               |
| waiting-retry | retry-exhausted  | blocked       | Retry budget exhausted                                                                                            | Emit bounded retry remediation                                                               |

### Invariants

| ID     | Invariant                                      | Formal                                                                                      |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| I-SM-1 | Terminal states are explicit and finite        | `RunState in {completed,blocked,failed,canceled}`                                           |
| I-SM-2 | Lease cleanup is mandatory for terminal states | `RunState terminal -> sandboxLease.releasedAt != null and worktreeLease.leasePath released` |
| I-SM-3 | Resume path is deterministic                   | `RunState=resuming -> snapshot.complete=true`                                               |

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

---

## PlannerGateBeforeFeatureMutation

**Type:** Policy
**Applies To:** [AssemblePipelineRoute](operations.md#assemblepipelineroute) and any feature-doc mutation stages

### Rule

`featurePathMutation -> WORK-PACK plannerGateStatus = pass`

---

## TerminalOutcomeRequired

**Type:** Invariant
**Applies To:** [ExecutionRun](domain.md#executionrun) and stage execution

### Rule

`started(stageRunId) -> exists terminal(stageRunId) where outcome in {completed,blocked,failed,canceled}`

---

## TelemetryPairRequired

**Type:** Rule
**Applies To:** [TelemetryEnvelope](domain.md#telemetryenvelope)

### Rule

`TelemetryEnvelope.startedTelemetryRef != null and TelemetryEnvelope.terminalTelemetryRef != null`

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
