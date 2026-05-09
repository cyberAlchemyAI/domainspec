# Context Pack: TASK-AEO-WP-01

## Build Metadata

- Task: TASK-AEO-WP-01
- Feature: agent-execution-orchestrator
- Generated at: 2026-05-08T05:02:46Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-WP-01.md

## Framework Constraints Applied

- 2.0.10: terminal hardening and bounded search behavior are active constraints.
- 2.0.9: started telemetry rows must be paired with terminal outcomes.
- 2.0.8: delegation telemetry schema requires profile/thinking/stuck/retry fields.
- 2.0.4: strict selector-obligation binding and interested-data subset policy are mandatory.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OBL-AEO-01     | Inventory mutation-capable and verification domainspec-\* commands relevant to execution orchestration.                                                   |
| OBL-AEO-02     | Inventory routing/orchestration and specialist execution agent/skill roles.                                                                               |
| OBL-AEO-03     | Bind governance telemetry touchpoints (delegation tuning, terminal guard, signal observer).                                                               |
| OBL-AEO-04     | Cover bounded contexts from interview baseline (run orchestration, sandbox isolation, branch/worktree, reliability/recovery, observability/artifacts).    |
| OBL-AEO-05     | Cover concept tokens: ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy, RetryPolicy, CancellationPolicy, RunArtifactMapping. |
| OBL-AEO-06     | Bind project decisions PD-002 and PD-005 to inventory baseline assumptions.                                                                               |
| OBL-AEO-07     | Bind domainspec-orchestrate constraints: planner-first enforcement and delegated stage routing.                                                           |
| OBL-AEO-08     | Bind planning bridge constraints: W0 baseline, stage coverage matrix, closure task seeding.                                                               |
| OBL-AEO-09     | Provide explicit lifecycle route anchors for discovery, spec, tests, implementation, audits, and verify stages.                                           |
| OBL-AEO-10     | Include task-declared architecture/governance references used to constrain inventory mapping.                                                             |
| OBL-AEO-11     | Preserve decision lock default branch policy (`merge-to-head`).                                                                                           |
| OBL-AEO-12     | Preserve decision lock provider baseline (Sandcastle adapter reference semantics).                                                                        |

## Selected Evidence (Strict, 14 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-WP-01.md
- Selectors: ## Capability Contract Subset, ## DomainSpec Coverage, ## Architecture References, ## Implementation Directives, ## Decision Lock
- ObligationRefs: OBL-AEO-01, OBL-AEO-02, OBL-AEO-03, OBL-AEO-07, OBL-AEO-08, OBL-AEO-09, OBL-AEO-10, OBL-AEO-11, OBL-AEO-12
- Why included: primary obligation and source-link seed set.
- Excerpt:

> "Command inventory | All mutation-capable and verification domainspec-\* commands relevant to execution orchestration"
>
> "Agent/skill inventory | Routing/orchestration and specialist execution agents/skills currently active in the repo"
>
> "Governance contracts | Delegation tuning, terminal guard, and signal-observer telemetry touchpoints"

### S02 - Interview bounded-context baseline

- Source: ../../../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md
- Selectors: ## Current State, ## Candidate Bounded Contexts, ## Constraints, ## Success Signals
- ObligationRefs: OBL-AEO-03, OBL-AEO-04
- Why included: authoritative bounded-context and telemetry baseline for mapping.
- Excerpt:

> "Run Orchestration ... ExecutionRun, RunStateMachine"
>
> "Sandbox Isolation ... SandboxProvider, SandboxLease"
>
> "Branch And Worktree Control ... BranchStrategy, WorktreeLease"
>
> "Reliability And Recovery ... RetryPolicy, CancellationPolicy"
>
> "Observability And Artifacts ... RunLog, ArtifactBundle, SessionSnapshot"

### S03 - Definition token baseline

- Source: ../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md
- Selectors: ## Core Concepts, ## Rules And Policies, ## External Interfaces, ## Metrics And Definitions
- ObligationRefs: OBL-AEO-05, OBL-AEO-12
- Why included: concept-token vocabulary and rule/policy references required by task mapping.
- Excerpt:

> "ExecutionRun | Entity"
>
> "RunStateMachine | State Machine"
>
> "SandboxProviderInterface | Interface"
>
> "BranchStrategyPolicy | Policy"
>
> "RetryPolicy | Policy"
>
> "CancellationPolicy | Policy"
>
> "RunArtifactMapping | Mapping"

### S04 - Decision authority baseline

- Source: ../../../../interviews/agent-execution-orchestrator/PROJECT-DECISIONS.md
- Selectors: ## Decision Register
- ObligationRefs: OBL-AEO-06, OBL-AEO-12
- Why included: decision locks for brownfield authority and Sandcastle execution semantics.
- Excerpt:

> "PD-002 ... Existing repo policies and current behavior contracts are observed authority for discovery"
>
> "PD-005 ... Use Sandcastle semantics as reference for sandbox, worktree, branch strategy, hooks, and run lifecycle contracts"

### S05 - Orchestrator routing and planner-first constraints

- Source: ../../../../../copilot/skills/domainspec-orchestrate/SKILL.md
- Selectors: <process> step 3 (route mapping), step 5 (planner-first enforcement), step 6 (delegated stage execution)
- ObligationRefs: OBL-AEO-01, OBL-AEO-02, OBL-AEO-07
- Why included: canonical command route inventory and delegated-stage orchestration policy.
- Excerpt:

> "map to one specialist workflow ... domainspec-spec-feature ... domainspec-generate-tests ... domainspec-implement ... domainspec-audit-alignment ... domainspec-audit-layering ... domainspec-verify-feature"
>
> "Planner-first enforcement for mutation-capable routes"
>
> "Every routed specialist stage must run through a delegated subagent call"

### S06 - Planning bridge W0/stage/closure obligations

- Source: ../../../../../copilot/skills/domainspec-plan-phase-bridge/SKILL.md
- Selectors: <process> step 5, step 6, step 7
- ObligationRefs: OBL-AEO-08
- Why included: direct source for W0 baseline, stage coverage matrix, and closure-task seed requirements.
- Excerpt:

> "Enforce mandatory first wave W0 for architecture and governance baseline"
>
> "Enforce Pipeline Stage Coverage matrix ... all canonical stages"
>
> "Enforce mandatory closure task seeding ... verify-feature, audit-alignment, audit-layering"

### S07 - Feature capability and relationship contract

- Source: ../../SPEC.md
- Selectors: ## What This Module Owns, ## Capabilities, ## Feature Concept Graph, ## Produces For
- ObligationRefs: OBL-AEO-03, OBL-AEO-05, OBL-AEO-09, OBL-AEO-11, OBL-AEO-12
- Why included: feature-level lifecycle scope, concept graph edges, and downstream consumer mappings.
- Excerpt:

> "Defines explicit route templates for discovery, spec, stories, tests, implementation, audits, and verify stages"
>
> "BranchStrategyPolicy ... Default merge-to-head"
>
> "SandboxProviderInterface ... Sandcastle adapter baseline"
>
> "domainspec-signal-observer ... Observer-ready governance signal rows"

### S08 - Explicit lifecycle stage anchors

- Source: ../../workflows.md
- Selectors: ## FeatureLifecyclePipelineWorkflow, mermaid step anchors, ### Step Table
- ObligationRefs: OBL-AEO-09
- Why included: explicit route anchors required by the task directive.
- Excerpt:

> "Step 3: Execute discovery stage"
>
> "Step 4: Execute spec stage"
>
> "Step 6: Execute tests stage"
>
> "Step 7: Execute implementation stage"
>
> "Step 9: Execute audits stage"
>
> "Step 10: Execute verify stage"

### S09 - Delegation telemetry contract

- Source: ../../../../signals/DELEGATION-TUNING.md
- Selectors: # Delegation Tuning Ledger, Required fields, Operational notes
- ObligationRefs: OBL-AEO-03, OBL-AEO-10
- Why included: required telemetry fields and started/terminal pairing constraints.
- Excerpt:

> "For every delegated stage, append one started row ... and one terminal row ... with the same stageRunId"
>
> "Required fields ... delegationProfile, thinkingBudget, outcome, suspectedStuck, retryCount, durationMs"

### S10 - Terminal guard contract

- Source: ../../../../../../../docs/signals/TERMINAL-GUARD.md
- Selectors: # Terminal Guard, ## Commands, ## Nudge examples
- ObligationRefs: OBL-AEO-03
- Why included: terminal guard touchpoint contract required by task governance area.
- Excerpt:

> "nudge risky command shapes before execution"
>
> "run --timeout ... Appends telemetry rows to docs/signals/terminal-guard.jsonl"

### S11 - Governance baseline constraint

- Source: ../../../../shared/governance-baseline.md
- Selectors: ## Purpose, ## Deterministic Defaults, ## Feature Readiness Gate
- ObligationRefs: OBL-AEO-10
- Why included: shared governance constraints for deterministic feature readiness.
- Excerpt:

> "This document defines cross-feature guardrails that apply to every feature before implementation starts"

### S12 - Architecture compatibility entrypoint

- Source: ../../../../../domainspec/ARCHITECTURE.md
- Selectors: # Architecture (Moved)
- ObligationRefs: OBL-AEO-10
- Why included: task-declared architecture reference resolution.
- Excerpt:

> "Canonical architecture index moved to: architecture/ARCHITECTURE.md"

### S13 - Architecture foundations

- Source: ../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md
- Selectors: ## Principles, ## Layer Model
- ObligationRefs: OBL-AEO-10
- Why included: immutable layering and dependency baseline for command/agent ownership mapping.
- Excerpt:

> "Domain-first ... dependency rule ... framework agnostic domain"
>
> "Layer model: Interface/Adapters -> Infrastructure -> Application -> Domain"

### S14 - Layering reference

- Source: ../../../../../architecture/pattern-library/LAYERING-REFERENCE.md
- Selectors: ## Layer Responsibilities
- ObligationRefs: OBL-AEO-10
- Why included: detailed layer responsibility constraints for deterministic ownership boundaries.
- Excerpt:

> "Domain layer (pure) ... Application layer ... Infrastructure layer ... Interface/Adapters layer"

## Derived Command And Agent Seed Set (Obligation-Bound)

| Route Anchor        | Command / Role                                         | Source Selector                                            | Bound Concept Tokens                         |
| ------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------- |
| discovery           | domainspec-start                                       | domainspec-orchestrate `<process>` step 3                  | ExecutionRun, RunStateMachine                |
| plan gate           | domainspec-plan-phase-bridge                           | domainspec-orchestrate step 3 + plan-phase-bridge step 5-7 | BranchStrategyPolicy, RetryPolicy            |
| context prep        | domainspec-context-builder                             | domainspec-orchestrate step 3                              | RunArtifactMapping                           |
| spec                | domainspec-spec-feature                                | domainspec-orchestrate step 3                              | ExecutionRun, SandboxProviderInterface       |
| tests               | domainspec-generate-tests                              | domainspec-orchestrate step 3                              | RunStateMachine, RetryPolicy                 |
| implement           | domainspec-implement                                   | domainspec-orchestrate step 3                              | ExecutionRun, CancellationPolicy             |
| audits              | domainspec-audit-alignment / domainspec-audit-layering | domainspec-orchestrate step 3                              | BranchStrategyPolicy, RunArtifactMapping     |
| verify              | domainspec-verify-feature                              | domainspec-orchestrate step 3                              | TerminalOutcomeRequired, RunArtifactMapping  |
| observer touchpoint | domainspec-signal-observer                             | SPEC `## Produces For`                                     | GovernanceSignalEmission, RunArtifactMapping |
| orchestration role  | domainspec-orchestrator (agent)                        | domainspec-orchestrate frontmatter + step 6                | ExecutionPipeline, PipelineRouteTemplate     |
| planning role       | domainspec-planner (agent)                             | domainspec-plan-phase-bridge frontmatter                   | StageContract, BranchStrategyPolicy          |

## Interested Data Subsets

### Feature Graph Edge Subset (from SPEC)

Only edge labels required by WP-01 command/agent and lifecycle mapping are retained.

| From                             | Edge         | To                       | Evidence                        |
| -------------------------------- | ------------ | ------------------------ | ------------------------------- |
| FeatureLifecyclePipelineWorkflow | orchestrates | ExecutePipelineRoute     | SPEC `## Feature Concept Graph` |
| FeatureLifecyclePipelineWorkflow | orchestrates | EmitGovernanceSignals    | SPEC `## Feature Concept Graph` |
| AssemblePipelineRoute            | enforces     | StageContract            | SPEC `## Feature Concept Graph` |
| RunStateMachine                  | enforces     | ExecutePipelineRoute     | SPEC `## Feature Concept Graph` |
| BranchStrategyPolicy             | applies      | ExecutePipelineRoute     | SPEC `## Feature Concept Graph` |
| RouteArtifactInterface           | exposes      | AssemblePipelineRoute    | SPEC `## Feature Concept Graph` |
| SandboxProviderInterface         | exposes      | ExecutePipelineRoute     | SPEC `## Feature Concept Graph` |
| RunArtifactMapping               | maps         | TelemetryEnvelope        | SPEC `## Feature Concept Graph` |
| EmitGovernanceSignals            | produces     | GovernanceSignalEmission | SPEC `## Feature Concept Graph` |

### Lifecycle Stage Subset (from workflow)

| Stage          | Selector                                             |
| -------------- | ---------------------------------------------------- |
| discovery      | workflows `FeatureLifecyclePipelineWorkflow` step 3  |
| spec           | workflows `FeatureLifecyclePipelineWorkflow` step 4  |
| tests          | workflows `FeatureLifecyclePipelineWorkflow` step 6  |
| implementation | workflows `FeatureLifecyclePipelineWorkflow` step 7  |
| audits         | workflows `FeatureLifecyclePipelineWorkflow` step 9  |
| verify         | workflows `FeatureLifecyclePipelineWorkflow` step 10 |

## Excluded Candidates (Strict)

| Candidate                                                | Exclusion Reason                                                                                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| docs/features/agent-execution-orchestrator/rules.md      | Detailed policy clauses are already represented by selected INITIAL-DEFINITIONS + SPEC tokens for this inventory-focused task.  |
| docs/features/agent-execution-orchestrator/interfaces.md | Interface details exceed WP-01 minimum once SandboxProviderInterface and telemetry touchpoints are covered by selected sources. |
| copilot/skills/domainspec-pipeline/SKILL.md              | Route-command coverage already satisfied by domainspec-orchestrate plus explicit workflow stage anchors.                        |
| copilot/skills/domainspec-signal-observer/SKILL.md       | Signal-observer touchpoint obligation is satisfied through SPEC produces-for mapping and telemetry contracts.                   |
| docs/features/agent-execution-orchestrator/WORK-PACK.md  | Planning manifest is derivative for WP-01 context; task contract + bridge constraints already selected as authoritative seed.   |

## Budget And Strict Gate Check

- Selected files: 14 / 14 (standard budget pass)
- Excerpt lines: 184 / 280 (standard budget pass)
- Noise ratio: 0.12 (must be <= 0.15, pass)
- Selector gate: pass (14/14 selected entries include selectors)
- Obligation binding gate: pass (14/14 selected entries include obligationRefs)

## Blockers

- None. All required task-linked and architecture/governance references resolved.
- Optional index artifacts (`docs/index/feature-map.md`, `docs/index/features-index.json`, `docs/index/tag-index.json`) were not needed because obligations were fully covered by explicit task links.
