---
feature: agent-execution-orchestrator
version: current
status: draft
updatedAt: 2026-05-08
---

# Agent Execution Orchestrator Stories

> Navigate by capability: [Explicit Pipeline Route Composition](#explicit-pipeline-route-composition) · [Sandcastle-Aligned Run Lifecycle](#sandcastle-aligned-run-lifecycle) · [Policy-Governed Branch and Cancellation Control](#policy-governed-branch-and-cancellation-control) · [Governance Telemetry and Signal Emission](#governance-telemetry-and-signal-emission)

## Explicit Pipeline Route Composition

### US-001 Compose Explicit Lifecycle Route

As a **DomainSpec operator**, I want **a route artifact that explicitly lists lifecycle stages**, so that **execution is deterministic and auditable across prompt contexts**.

**Given** a feature requires discovery-through-verify execution
**When** I assemble a route template
**Then** every mandatory stage contract is present and ordered.

**Acceptance checks**

- [ ] Route template rejects missing mandatory stages.
- [ ] Route template rejects duplicate stage contracts.
- [ ] Route artifact can be rendered for orchestrator and prompt contexts.

**Covered concepts (IDs)**

- [ExecutionPipeline](domain.md#executionpipeline) (`agent-execution-orchestrator.ExecutionPipeline`)
- [PipelineRouteTemplate](domain.md#pipelineroutetemplate) (`agent-execution-orchestrator.PipelineRouteTemplate`)
- [StageContract](domain.md#stagecontract) (`agent-execution-orchestrator.StageContract`)
- [AssemblePipelineRoute](operations.md#assemblepipelineroute) (`agent-execution-orchestrator.AssemblePipelineRoute`)

**Aspect evidence**

- [AssemblePipelineRoute](operations.md#assemblepipelineroute)
- [RouteArtifactInterface](interfaces.md#internal-routeartifactinterface)
- [PlannerGateBeforeFeatureMutation](rules.md#plannergatebeforefeaturemutation)

**Capability links**

- [Explicit Pipeline Route Composition](SPEC.md#explicit-pipeline-route-composition)

## Sandcastle-Aligned Run Lifecycle

### US-002 Execute Route With Isolated Sandbox and Worktree

As an **operator**, I want **run execution to allocate isolated sandbox/worktree leases**, so that **stage outcomes are deterministic and cross-run contamination is minimized**.

**Given** a validated route template
**When** execution starts with Sandcastle baseline provider
**Then** each stage runs with isolated leases and reaches an explicit terminal outcome.

**Acceptance checks**

- [ ] MVP run uses [ProviderAdapter](domain.md#provideradapter) value `sandcastle`.
- [ ] Each stage records one `started` and one terminal telemetry row.
- [ ] Run terminal state is one of `completed|blocked|failed|canceled`.

**Covered concepts (IDs)**

- [ExecutionRun](domain.md#executionrun) (`agent-execution-orchestrator.ExecutionRun`)
- [SandboxLease](domain.md#sandboxlease) (`agent-execution-orchestrator.SandboxLease`)
- [WorktreeLease](domain.md#worktreelease) (`agent-execution-orchestrator.WorktreeLease`)
- [ExecutePipelineRoute](operations.md#executepipelineroute) (`agent-execution-orchestrator.ExecutePipelineRoute`)
- [RunStateMachine](rules.md#runstatemachine) (`agent-execution-orchestrator.RunStateMachine`)

**Aspect evidence**

- [ExecutePipelineRoute](operations.md#executepipelineroute)
- [SandboxProviderInterface](interfaces.md#internal-sandboxproviderinterface)
- [FeatureLifecyclePipelineWorkflow](workflows.md#featurelifecyclepipelineworkflow)

**Capability links**

- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)

### US-003 Resume Interrupted Run Deterministically

As an **operator**, I want **resume support backed by session snapshots**, so that **interrupted runs can continue without losing evidence continuity**.

**Given** a running stage was interrupted
**When** resume is invoked with a complete snapshot
**Then** the run transitions through `resuming` and continues or terminates with deterministic remediation.

**Acceptance checks**

- [ ] Resume rejects incomplete snapshot payloads.
- [ ] Resume attempts preserve stageRunId evidence continuity.
- [ ] Resume outcomes are reflected in terminal telemetry.

**Covered concepts (IDs)**

- [SessionSnapshot](domain.md#sessionsnapshot) (`agent-execution-orchestrator.SessionSnapshot`)
- [ResumeExecutionRun](operations.md#resumeexecutionrun) (`agent-execution-orchestrator.ResumeExecutionRun`)
- [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule) (`agent-execution-orchestrator.WatchdogTimeoutRule`)

**Aspect evidence**

- [ResumeExecutionRun](operations.md#resumeexecutionrun)
- [RunStateMachine](rules.md#runstatemachine)
- [LatestRunWinsRecoveryWorkflow](workflows.md#latestrunwinsrecoveryworkflow)

**Capability links**

- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)

## Policy-Governed Branch and Cancellation Control

### US-004 Enforce Merge-To-Head Default Strategy

As a **maintainer**, I want **branch strategy defaults encoded in policy**, so that **execution behavior is consistent across stages and auditable over time**.

**Given** no explicit branch strategy override
**When** a run executes
**Then** strategy defaults to `merge-to-head` and is recorded in evidence.

**Acceptance checks**

- [ ] Default strategy is `merge-to-head`.
- [ ] Alternate `head` and `branch` strategies require explicit policy conditions.
- [ ] Strategy choice is recorded in decision snapshot evidence.

**Covered concepts (IDs)**

- [BranchStrategy](domain.md#branchstrategy) (`agent-execution-orchestrator.BranchStrategy`)
- [BranchStrategyPolicy](rules.md#branchstrategypolicy) (`agent-execution-orchestrator.BranchStrategyPolicy`)
- [ExecutePipelineRoute](operations.md#executepipelineroute) (`agent-execution-orchestrator.ExecutePipelineRoute`)

**Aspect evidence**

- [BranchStrategyPolicy](rules.md#branchstrategypolicy)
- [ExecutePipelineRoute](operations.md#executepipelineroute)
- [WorktreeLease](domain.md#worktreelease)

**Capability links**

- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)

### US-005 Cancel Superseded Runs With Latest-Run-Wins

As a **runtime operator**, I want **superseded runs canceled deterministically**, so that **only the newest active run controls lifecycle progression**.

**Given** two active runs target the same route scope
**When** the newer run is accepted
**Then** the older run is canceled and emits terminal telemetry.

**Acceptance checks**

- [ ] Superseded run transitions to terminal `canceled`.
- [ ] Canceled run still records terminal telemetry row.
- [ ] Cancellation emits governance signal rows with remediation context.

**Covered concepts (IDs)**

- [CancellationPolicy](rules.md#cancellationpolicy) (`agent-execution-orchestrator.CancellationPolicy`)
- [CancelSupersededRun](operations.md#cancelsupersededrun) (`agent-execution-orchestrator.CancelSupersededRun`)
- [TerminalOutcome](domain.md#terminaloutcome) (`agent-execution-orchestrator.TerminalOutcome`)

**Aspect evidence**

- [CancelSupersededRun](operations.md#cancelsupersededrun)
- [LatestRunWinsRecoveryWorkflow](workflows.md#latestrunwinsrecoveryworkflow)
- [CancellationPolicy](rules.md#cancellationpolicy)

**Capability links**

- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)

## Governance Telemetry and Signal Emission

### US-006 Emit Standard Evidence Envelope Per Stage

As a **governance maintainer**, I want **every stage to emit a standard evidence envelope**, so that **delegation tuning and audits can verify deterministic completion**.

**Given** a stage reaches terminal outcome
**When** envelope validation runs
**Then** telemetry pair, terminal guard evidence, transcript excerpt, and decision snapshot are present.

**Acceptance checks**

- [ ] Missing `started` or terminal row fails envelope validation.
- [ ] Missing terminal guard evidence reference fails envelope validation.
- [ ] Envelope fields map one-to-one to delegation tuning schema fields.

**Covered concepts (IDs)**

- [TelemetryEnvelope](domain.md#telemetryenvelope) (`agent-execution-orchestrator.TelemetryEnvelope`)
- [TelemetryPairRequired](rules.md#telemetrypairrequired) (`agent-execution-orchestrator.TelemetryPairRequired`)
- [RunArtifactMapping](observability.md#runartifactmapping) (`agent-execution-orchestrator.RunArtifactMapping`)

**Aspect evidence**

- [RunArtifactMapping](observability.md#runartifactmapping)
- [DelegationTelemetryLedgerInterface](interfaces.md#internal-delegationtelemetryledgerinterface)
- [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)

**Capability links**

- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

### US-007 Emit Observer-Compatible Governance Signals

As a **governance observer**, I want **stage outcomes mapped to observer signal types**, so that **cross-run drift and recovery patterns become auditable trends**.

**Given** stage outcomes and envelope evidence exist
**When** governance signals are emitted
**Then** observer rows include signal type, stageRunId, outcome, and evidence reference.

**Acceptance checks**

- [ ] Signal types are limited to contract vocabulary.
- [ ] Each emitted signal links to envelope evidence.
- [ ] Blocked/failure outcomes always emit at least one governance signal row.

**Covered concepts (IDs)**

- [GovernanceSignalType](domain.md#governancesignaltype) (`agent-execution-orchestrator.GovernanceSignalType`)
- [EmitGovernanceSignals](operations.md#emitgovernancesignals) (`agent-execution-orchestrator.EmitGovernanceSignals`)
- [GovernanceSignalEmission](observability.md#governancesignalemission) (`agent-execution-orchestrator.GovernanceSignalEmission`)

**Aspect evidence**

- [EmitGovernanceSignals](operations.md#emitgovernancesignals)
- [SignalObserverInterface](interfaces.md#internal-signalobserverinterface)
- [Signal Observer Mapping](observability.md#signal-observer-mapping)

**Capability links**

- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## Story Coverage Matrix

| Capability                                      | Story IDs      | Covered Concepts                                                                                                                                                                                                                | Notes                                                 |
| ----------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Explicit Pipeline Route Composition             | US-001         | agent-execution-orchestrator.ExecutionPipeline, agent-execution-orchestrator.PipelineRouteTemplate, agent-execution-orchestrator.StageContract, agent-execution-orchestrator.AssemblePipelineRoute                              | Covers explicit route artifact creation               |
| Sandcastle-Aligned Run Lifecycle                | US-002, US-003 | agent-execution-orchestrator.ExecutionRun, agent-execution-orchestrator.SandboxLease, agent-execution-orchestrator.WorktreeLease, agent-execution-orchestrator.ResumeExecutionRun, agent-execution-orchestrator.RunStateMachine | Covers normal run path and interrupted resume path    |
| Policy-Governed Branch and Cancellation Control | US-004, US-005 | agent-execution-orchestrator.BranchStrategyPolicy, agent-execution-orchestrator.CancellationPolicy, agent-execution-orchestrator.CancelSupersededRun, agent-execution-orchestrator.TerminalOutcome                              | Encodes locked branch and cancellation decisions      |
| Governance Telemetry and Signal Emission        | US-006, US-007 | agent-execution-orchestrator.TelemetryEnvelope, agent-execution-orchestrator.RunArtifactMapping, agent-execution-orchestrator.EmitGovernanceSignals, agent-execution-orchestrator.GovernanceSignalEmission                      | Covers evidence envelope and observer signal contract |
