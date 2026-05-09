# Operations: Agent Execution Orchestrator

## Capability Backlinks

- [Explicit Pipeline Route Composition](SPEC.md#explicit-pipeline-route-composition)
- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## AssemblePipelineRoute

**Type:** Operation (mutation)
**Actor:** DomainSpec operator
**Triggers:** New route artifact request or route update request

Builds a deterministic route from an ordered DomainSpec skill chain. The operator chooses a pipeline intent (for example kickoff, docs-only bootstrap, bugfix, or full feature delivery), maps that intent to a `domainspec-*` sequence, and validates each stage contract before publishing the route artifact.

### Skill-Chain Profiles

| Profile                      | Ordered Skills                                                                                                                                                                                      | Stage Contract Focus                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Kickoff baseline             | `domainspec-start`                                                                                                                                                                                  | Scope gate, baseline decisions, readiness profile     |
| Docs bootstrap               | `domainspec-init`                                                                                                                                                                                   | Artifact structure, includes/dependencies integrity   |
| Context-first implementation | `domainspec-context-builder -> domainspec-implement -> domainspec-tag-code -> domainspec-audit-alignment -> domainspec-audit-layering -> domainspec-verify-feature`                                 | Mutation closure with tag/audit/verify evidence       |
| Bugfix controlled pipeline   | `domainspec-plan-phase-bridge -> domainspec-context-builder -> domainspec-implement -> domainspec-tag-code -> domainspec-audit-alignment -> domainspec-audit-layering -> domainspec-verify-feature` | Task bootstrap + deterministic mutation closure trail |
| Full feature delivery        | `domainspec-pipeline`                                                                                                                                                                               | End-to-end governed lifecycle in one pipeline command |

Docs-only slices keep the route mutation-safe by deferring mutation-only closure skills and satisfying governance obligations via signal emission until mutation stages begin.

### Input

| Field           | Type                                                     | Required | Description                                                        |
| --------------- | -------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| pipelineId      | string                                                   | yes      | Target [ExecutionPipeline](domain.md#executionpipeline).pipelineId |
| template        | [PipelineRouteTemplate](domain.md#pipelineroutetemplate) | yes      | Candidate route template                                           |
| requestedBy     | string                                                   | yes      | Operator identity                                                  |
| capabilityScope | string[]                                                 | yes      | Capability names covered by this route                             |

### Rules

| ID  | Rule                                                           | Formal                                                                            |
| --- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| R1  | Mandatory stages are required for the selected route profile   | `forall s in mandatoryCoverage, exists stageContracts.stage = s`                  |
| R2  | Stage contracts are unique by [StageType](domain.md#stagetype) | `distinct(stageContracts.stage)`                                                  |
| R3  | Stage contract evidence obligations must be complete           | `forall c in stageContracts, c.requiredArtifacts != empty`                        |
| R4  | Feature-path mutation requires planner gate pass               | See [PlannerGateBeforeFeatureMutation](rules.md#plannergatebeforefeaturemutation) |

### State Transition

[ExecutionPipeline](domain.md#executionpipeline): `route-draft -> route-ready`

### Postconditions

- [ExecutionPipeline](domain.md#executionpipeline).routeTemplate is updated to the validated [PipelineRouteTemplate](domain.md#pipelineroutetemplate).
- [RouteArtifactInterface](interfaces.md#internal-routeartifactinterface) can expose the route artifact for prompt contexts.

### Error States

| Condition                 | Result                              |
| ------------------------- | ----------------------------------- |
| Missing mandatory stage   | Reject with `ROUTE_STAGE_MISSING`   |
| Duplicate stage contract  | Reject with `ROUTE_STAGE_DUPLICATE` |
| Missing planner gate pass | Reject with `PLANNER_GATE_REQUIRED` |

---

## ExecutePipelineRoute

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Execute request against route template

### Input

| Field          | Type                                         | Required | Description                                                                                  |
| -------------- | -------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| runId          | string                                       | yes      | New [ExecutionRun](domain.md#executionrun).runId                                             |
| pipelineId     | string                                       | yes      | Source [ExecutionPipeline](domain.md#executionpipeline).pipelineId                           |
| templateId     | string                                       | yes      | Source [PipelineRouteTemplate](domain.md#pipelineroutetemplate).templateId                   |
| provider       | [ProviderAdapter](domain.md#provideradapter) | yes      | Provider baseline (`sandcastle` for MVP)                                                     |
| branchStrategy | [BranchStrategy](domain.md#branchstrategy)   | no       | Strategy override; default resolved by [BranchStrategyPolicy](rules.md#branchstrategypolicy) |
| stageInputs    | object                                       | yes      | Stage-scoped execution inputs                                                                |

### Rules

| ID  | Rule                                                       | Formal                                                          |
| --- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| R1  | Provider adapter must satisfy MVP baseline                 | `provider = sandcastle OR provider in approvedExtensionSet`     |
| R2  | Every stage run must publish telemetry pair                | See [TelemetryPairRequired](rules.md#telemetrypairrequired)     |
| R3  | Run must terminate with explicit outcome                   | See [TerminalOutcomeRequired](rules.md#terminaloutcomerequired) |
| R4  | Retry attempts are bounded and narrowed                    | See [RetryPolicy](rules.md#retrypolicy)                         |
| R5  | Superseded active runs follow latest-run-wins cancellation | See [CancellationPolicy](rules.md#cancellationpolicy)           |

### Calculations

| ID  | Calculation               | Formula                                              |
| --- | ------------------------- | ---------------------------------------------------- |
| C1  | Stage completion duration | `durationMs = terminalTimestamp - startedTimestamp`  |
| C2  | Stuck flag decision       | `suspectedStuck = elapsed > watchdogBudget(profile)` |

### State Transition

[ExecutionRun](domain.md#executionrun): `queued -> running -> completed|blocked|failed|canceled`

### Postconditions

- One [SandboxLease](domain.md#sandboxlease) and one [WorktreeLease](domain.md#worktreelease) are allocated and released deterministically.
- Each stage has one `started` and one terminal row in [DelegationTelemetryLedgerInterface](interfaces.md#internal-delegationtelemetryledgerinterface).
- [TelemetryEnvelope](domain.md#telemetryenvelope) is complete for each terminal stage.

### Error States

| Condition                     | Result                                 |
| ----------------------------- | -------------------------------------- |
| Provider contract unavailable | Reject with `PROVIDER_UNAVAILABLE`     |
| Missing terminal outcome row  | Reject with `TERMINAL_OUTCOME_MISSING` |
| Retry budget exhausted        | Return `blocked` with remediation      |

---

## ResumeExecutionRun

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Resume request for interrupted run

### Input

| Field       | Type                                         | Required | Description                                         |
| ----------- | -------------------------------------------- | -------- | --------------------------------------------------- |
| runId       | string                                       | yes      | Target [ExecutionRun](domain.md#executionrun).runId |
| snapshot    | [SessionSnapshot](domain.md#sessionsnapshot) | yes      | Captured resume payload                             |
| requestedBy | string                                       | yes      | Operator or runtime identity                        |

### Rules

| ID  | Rule                                               | Formal                                                                         |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| R1  | Snapshot must match run identity and stage         | `snapshot.runId = runId`                                                       |
| R2  | Snapshot schema must be complete for resume        | `required(snapshot.cwd, snapshot.terminalSessionId, snapshot.snapshotVersion)` |
| R3  | Resume cannot bypass terminal evidence obligations | See [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)                |

### State Transition

[ExecutionRun](domain.md#executionrun): `running|waiting-retry -> resuming -> running|completed|blocked|failed|canceled`

### Postconditions

- Resume path either reaches a terminal state or returns deterministic blocked remediation.
- Resume attempt and outcome are appended to [TelemetryEnvelope](domain.md#telemetryenvelope).

### Error States

| Condition                        | Result                                     |
| -------------------------------- | ------------------------------------------ |
| Snapshot missing required fields | Reject with `SNAPSHOT_INCOMPLETE`          |
| Snapshot version incompatible    | Reject with `SNAPSHOT_VERSION_UNSUPPORTED` |

---

## CancelSupersededRun

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Newer run supersedes active run for same route scope

### Input

| Field           | Type   | Required | Description                                             |
| --------------- | ------ | -------- | ------------------------------------------------------- |
| supersededRunId | string | yes      | Previous [ExecutionRun](domain.md#executionrun).runId   |
| winningRunId    | string | yes      | New active [ExecutionRun](domain.md#executionrun).runId |
| reason          | string | yes      | Cancellation rationale                                  |

### Rules

| ID  | Rule                                             | Formal                                                         |
| --- | ------------------------------------------------ | -------------------------------------------------------------- |
| R1  | Newest run has precedence                        | `startedAt(winningRunId) > startedAt(supersededRunId)`         |
| R2  | Superseded run must record terminal canceled row | `terminalOutcome(supersededRunId)=canceled`                    |
| R3  | Cancellation emits governance signal             | `exists signal where type = decision-friction OR workflow-gap` |

### State Transition

[ExecutionRun](domain.md#executionrun): `running|waiting-retry -> canceled`

### Postconditions

- Superseded run emits deterministic `canceled` terminal telemetry row.
- [WorktreeLease](domain.md#worktreelease) and [SandboxLease](domain.md#sandboxlease) for superseded run are released.

### Error States

| Condition                       | Result                               |
| ------------------------------- | ------------------------------------ |
| Superseded run already terminal | Return no-op with `ALREADY_TERMINAL` |
| Winning run missing             | Reject with `WINNING_RUN_MISSING`    |

---

## EmitGovernanceSignals

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Stage terminal outcome, recovery branch, or verification handoff

### Input

| Field       | Type                                                     | Required | Description                                         |
| ----------- | -------------------------------------------------------- | -------- | --------------------------------------------------- |
| runId       | string                                                   | yes      | Source [ExecutionRun](domain.md#executionrun).runId |
| stage       | [StageType](domain.md#stagetype)                         | yes      | Stage that produced the signal                      |
| outcome     | [TerminalOutcome](domain.md#terminaloutcome)             | yes      | Terminal outcome for stage                          |
| envelope    | [TelemetryEnvelope](domain.md#telemetryenvelope)         | yes      | Evidence payload                                    |
| signalTypes | [GovernanceSignalType](domain.md#governancesignaltype)[] | yes      | Signal rows to emit                                 |

### Rules

| ID  | Rule                                                      | Formal                                                          |
| --- | --------------------------------------------------------- | --------------------------------------------------------------- |
| R1  | Evidence envelope must be complete before signal emission | See [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum) |
| R2  | Signal types must match observer contract vocabulary      | `signalTypes subsetOf GovernanceSignalType`                     |
| R3  | Emission appends rows without rewriting history           | `appendOnly(pipeline-signals.jsonl)`                            |

### State Transition

[ExecutionRun](domain.md#executionrun): `completed|blocked|failed|canceled -> terminal-signal-emitted`

### Postconditions

- Governance signal rows are appended for [SignalObserverInterface](interfaces.md#internal-signalobserverinterface) consumption.
- Signal rows reference [TelemetryEnvelope](domain.md#telemetryenvelope).stageRunId for traceability.

### Error States

| Condition                       | Result                                   |
| ------------------------------- | ---------------------------------------- |
| Missing evidence envelope field | Reject with `SIGNAL_EVIDENCE_INCOMPLETE` |
| Unknown signal type             | Reject with `SIGNAL_TYPE_INVALID`        |
