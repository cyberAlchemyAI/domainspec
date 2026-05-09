# Interfaces: Agent Execution Orchestrator

## Capability Backlinks

- [Explicit Pipeline Route Composition](SPEC.md#explicit-pipeline-route-composition)
- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## Internal: RouteArtifactInterface

**Purpose:** Publish explicit [PipelineRouteTemplate](domain.md#pipelineroutetemplate) artifacts for orchestrator and prompt contexts.

### Exposes

- [AssemblePipelineRoute](operations.md#assemblepipelineroute)

### Methods

| Method                | Input                                                                                                      | Output                                                   | Maps To                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| `saveRouteTemplate`   | [ExecutionPipeline](domain.md#executionpipeline), [PipelineRouteTemplate](domain.md#pipelineroutetemplate) | Route artifact reference                                 | [AssemblePipelineRoute](operations.md#assemblepipelineroute) |
| `getRouteTemplate`    | `pipelineId`, `version`                                                                                    | [PipelineRouteTemplate](domain.md#pipelineroutetemplate) | [ExecutePipelineRoute](operations.md#executepipelineroute)   |
| `renderPromptContext` | [PipelineRouteTemplate](domain.md#pipelineroutetemplate)                                                   | Prompt-safe markdown artifact                            | [SPEC.md](SPEC.md#explicit-pipeline-route-composition)       |

---

## Internal: SandboxProviderInterface

**Purpose:** Keep run lifecycle provider-agnostic while enforcing Sandcastle baseline semantics.

### Exposes

- [ExecutePipelineRoute](operations.md#executepipelineroute)
- [ResumeExecutionRun](operations.md#resumeexecutionrun)

### Methods

| Method             | Input                                                                                | Output                                   | Maps To                                                    |
| ------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------- |
| `createSandbox`    | [ExecutionRun](domain.md#executionrun), [ProviderAdapter](domain.md#provideradapter) | [SandboxLease](domain.md#sandboxlease)   | [ExecutePipelineRoute](operations.md#executepipelineroute) |
| `createWorktree`   | [ExecutionRun](domain.md#executionrun), [BranchStrategy](domain.md#branchstrategy)   | [WorktreeLease](domain.md#worktreelease) | [ExecutePipelineRoute](operations.md#executepipelineroute) |
| `resumeSession`    | [SessionSnapshot](domain.md#sessionsnapshot)                                         | Runtime resume result                    | [ResumeExecutionRun](operations.md#resumeexecutionrun)     |
| `releaseResources` | [ExecutionRun](domain.md#executionrun)                                               | Release confirmation                     | [RunStateMachine](rules.md#runstatemachine)                |

### Contract Notes

- MVP baseline requires [ProviderAdapter](domain.md#provideradapter) value `sandcastle`.
- Alternate providers are extension hooks and must preserve [RunStateMachine](rules.md#runstatemachine) semantics.

---

## Internal: DelegationTelemetryLedgerInterface

**Purpose:** Append stage telemetry rows to delegation tuning ledger with strict started/terminal pairing.

### Exposes

- [EmitGovernanceSignals](operations.md#emitgovernancesignals)
- [ExecutePipelineRoute](operations.md#executepipelineroute)

### Methods

| Method              | Input                                                                                                    | Output                  | Maps To                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `appendStartedRow`  | `stageRunId`, `stage`, `delegationProfile`, `thinkingBudget`                                             | Row reference           | [TelemetryPairRequired](rules.md#telemetrypairrequired)     |
| `appendTerminalRow` | `stageRunId`, [TerminalOutcome](domain.md#terminaloutcome), `suspectedStuck`, `retryCount`, `durationMs` | Row reference           | [TelemetryPairRequired](rules.md#telemetrypairrequired)     |
| `auditUnpairedRows` | time window                                                                                              | Unpaired stage run list | [TerminalOutcomeRequired](rules.md#terminaloutcomerequired) |

### Contract Notes

- Backed by [DELEGATION-TUNING.md](../../signals/DELEGATION-TUNING.md) schema.
- History is append-only; row rewrites are forbidden.

---

## Internal: TerminalGuardInterface

**Purpose:** Bind orchestration to guarded command execution and deterministic terminal recovery evidence.

### Exposes

- [ExecutePipelineRoute](operations.md#executepipelineroute)
- [EmitGovernanceSignals](operations.md#emitgovernancesignals)

### Methods

| Method       | Input                       | Output                                   | Maps To                                                                     |
| ------------ | --------------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `nudge`      | command descriptor          | Nudge classification and recommendations | [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule)                         |
| `runGuarded` | command descriptor, timeout | Guard execution result and telemetry ref | [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)                 |
| `recover`    | terminal error context      | Recovery result                          | [LatestRunWinsRecoveryWorkflow](workflows.md#latestrunwinsrecoveryworkflow) |

### Contract Notes

- Contract source: [TERMINAL-GUARD.md](../../../../../docs/signals/TERMINAL-GUARD.md).
- Guard evidence references are required in [TelemetryEnvelope](domain.md#telemetryenvelope).

---

## Internal: SignalObserverInterface

**Purpose:** Publish observer-compatible governance signal rows for asynchronous tuning and governance loops.

### Exposes

- [EmitGovernanceSignals](operations.md#emitgovernancesignals)

### Methods

| Method                 | Input                                                                                                      | Output                      | Maps To                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------- |
| `appendSignalRows`     | [GovernanceSignalType](domain.md#governancesignaltype)[], [TelemetryEnvelope](domain.md#telemetryenvelope) | Signal row references       | [GovernanceSignalEmission](observability.md#governancesignalemission) |
| `validateSignalSchema` | signal rows                                                                                                | PASS/FLAG validation report | [observability.md](observability.md#signal-observer-mapping)          |

### Contract Notes

- Signal vocabulary follows `workflow-gap`, `contract-gap`, `evidence-gap`, `decision-friction`, `proposal`, `pattern`.
- Emission targets async-observer flows described in `domainspec-signal-observer` skill.
