# WORK-PACK: agent-execution-orchestrator

## Purpose

Planner-managed native execution manifest for Agent Execution Orchestrator planning and staged delivery.

## Planner Control Fields

| Field             | Value                                                            | Notes                                                                                            |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| plannerGateStatus | pass                                                             | PASS after W0 baseline, stage matrix, directive matrix, and seeded task files                    |
| complexity        | high                                                             | Cross-cutting docs, tests, backend orchestration design, telemetry contracts, and closure audits |
| architectureWave  | W0                                                               | Mandatory first wave for architecture and governance baseline                                    |
| activePlanRef     | docs/features/agent-execution-orchestrator/work-pack/waves/W0.md | Active baseline artifact                                                                         |
| lastPlannedAt     | 2026-05-08T04:45:00Z                                             | ISO timestamp                                                                                    |
| readinessProfile  | pilot                                                            | Initial verification target profile                                                              |

## Planner Gate Evidence

Status: PASS

- Manifest entrypoint established at this file.
- `work-pack/waves/W0.md` created with dependency-direction and governance exit gates.
- `work-pack/tasks/` seeded with mandatory planning and closure tasks.
- `Pipeline Stage Coverage` includes all canonical stages with wave mapping and status.
- `Architecture-Guided Task Directives` includes coverage IDs, architecture references, and verification evidence targets.

## Mode Resolution

- Requested mode: `native`
- Delegation mode selected: `native`
- Determinism: non-interactive planning execution with explicit decision lock and interview-linked evidence

## Current Framework Constraints (domainspec/CHANGELOG.md)

- `2.0.10`: terminal execution hardening requires guard-first execution for risky commands.
- `2.0.9`: delegated stage runs must reconcile stale telemetry rows so `started` rows always receive terminal outcomes.
- `2.0.8`: delegation telemetry rows must include profile, thinking budget, suspected-stuck, retry count, and outcome.
- `2.0.7`: suspected stuck delegated stages require one bounded retry with reduced thinking before final BLOCK.
- `2.0.5`: plan/spec workflows must enforce post-spec task synchronization via work-pack/task artifacts.

## Discovery Path Selection

Pre-filter shortcut status: not applicable, because `SPEC.md` does not exist yet and `includes`/`dependencies` are unresolved.

Score formula:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

| Path                     | Signal | Cost | Ambiguity | Score  |
| ------------------------ | ------ | ---- | --------- | ------ |
| links-tags-first         | 0.92   | 0.18 | 0.15      | 0.1275 |
| broad-search-first       | 0.70   | 0.62 | 0.38      | 0.4160 |
| focused-researcher-first | 0.84   | 0.44 | 0.22      | 0.2590 |
| capability-graph-first   | 0.79   | 0.40 | 0.20      | 0.2645 |

Selected path: `links-tags-first` (lowest score). Uncertainty rule also favors links-tags-first because runner-up paths are within `<= 0.03` difference.

## Planning Input Artifacts

- [Interview Project Overview](../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)
- [Interview Initial Definitions](../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md)
- [Interview Project Decisions](../../interviews/agent-execution-orchestrator/PROJECT-DECISIONS.md)
- [Delegation Tuning Contract](../../signals/DELEGATION-TUNING.md)
- [Terminal Guard Contract](../../../../../docs/signals/TERMINAL-GUARD.md)

## Implementation Presence and Audit Baseline

Feature implementation presence: partial brownfield behavior exists across orchestration skills and governance docs.

### Alignment baseline obligations

| Severity | Obligation                                                                                                                    | Evidence                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| high     | Consolidate fragmented run lifecycle semantics into one feature-scoped contract (state machine + sandbox/provider interface). | [PROJECT-OVERVIEW.md](../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)       |
| medium   | Require explicit terminal outcome coverage for every delegated stage and map it to feature metrics.                           | [DELEGATION-TUNING.md](../../signals/DELEGATION-TUNING.md)                                     |
| medium   | Define minimum evidence envelope and enforce output consistency across stages.                                                | [INITIAL-DEFINITIONS.md](../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md) |

### Layering baseline obligations

| Severity | Obligation                                                                              | Evidence                                                                                         |
| -------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| high     | Keep orchestration core contracts independent from provider/runtime adapters.           | [INITIAL-DEFINITIONS.md](../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md)   |
| medium   | Keep dependency direction explicit (interface/infrastructure depend inward).            | [ARCHITECTURE-FOUNDATIONS.md](../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md) |
| medium   | Isolate telemetry emission policy from stage orchestration logic via contract mappings. | [TERMINAL-GUARD.md](../../../../../docs/signals/TERMINAL-GUARD.md)                               |

## UI Detection Gate

- HTTP endpoints declared in feature `interfaces.md`: no (file not created yet)
- `docs/UI-ARCHITECTURE.md` present: yes
- `docs/features/agent-execution-orchestrator/UI-SPEC.md` present: no
- Gate result: `ui-pipeline` remains listed but `skipped` in baseline plan until HTTP/UI obligations exist.

## Resolved Decision Gate

| Decision                                    | Selected Option           | Rationale                                                                   |
| ------------------------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| D-AEO-001 Branch strategy default           | `merge-to-head`           | Balances isolation and throughput for orchestrated runs                     |
| D-AEO-002 MVP provider baseline             | `Sandcastle adapter only` | Aligns with requested reference semantics while keeping first slice bounded |
| D-AEO-003 Minimum evidence envelope         | `Standard`                | Includes telemetry pair plus transcript/decision context for auditability   |
| D-AEO-004 Superseded-run cancellation model | `latest-run-wins`         | Keeps run state deterministic and prevents stale active runs                |

## Spec-Compliance Self-Check

| Required Step                                     | Status    | Evidence                                                                  |
| ------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| 1. Read `domainspec/CHANGELOG.md`                 | completed | [domainspec/CHANGELOG.md](../../../domainspec/CHANGELOG.md)               |
| 2. Context discovery with weighted path selection | completed | [WORK-PACK.md](./WORK-PACK.md#discovery-path-selection)                   |
| 3. Alignment + layering baseline probes           | completed | [WORK-PACK.md](./WORK-PACK.md#implementation-presence-and-audit-baseline) |
| 4. UI detection gate                              | completed | [WORK-PACK.md](./WORK-PACK.md#ui-detection-gate)                          |
| 5. Interactive architecture decision gate         | completed | [WORK-PACK.md](./WORK-PACK.md#resolved-decision-gate)                     |
| 6. Pre-plan compliance check                      | completed | this section                                                              |

## Task Status Board (Current Slice)

| Task ID                 | Goal                                                                                | Complexity | Assigned Waves | Gate Status           | Status      |
| ----------------------- | ----------------------------------------------------------------------------------- | ---------- | -------------- | --------------------- | ----------- |
| AEO-WP-01               | Capability mapping and inventory of current commands + agents                       | high       | W1             | completed             | completed   |
| AEO-WP-02               | Composable pipeline assembly model and explicit route schema                        | high       | W1, W2         | completed             | completed   |
| AEO-WP-03               | Observability and governance-signal instrumentation + telemetry mapping             | high       | W2             | ready-after-AEO-WP-02 | in-progress |
| AEO-WP-SIGNAL-ALIGNMENT | Emit `alignment-gap` signal obligations for docs-only/non-mutation slices           | medium     | W2, W3         | ready-after-AEO-WP-03 | not-started |
| AEO-WP-SIGNAL-LAYERING  | Emit `governance-gap` layering signal obligations for docs-only/non-mutation slices | medium     | W2, W3         | ready-after-AEO-WP-03 | not-started |
| AEO-WP-VERIFY           | Execute feature verification verdict (`domainspec-verify-feature`)                  | high       | W3             | ready-after-AEO-WP-03 | not-started |

## Deferred Mutation Closure Queue

| Task ID                | Goal                                                                    | Complexity | Assigned Waves | Gate Status             | Status                  |
| ---------------------- | ----------------------------------------------------------------------- | ---------- | -------------- | ----------------------- | ----------------------- |
| AEO-WP-TAG             | Apply DomainSpec code tags and validate extract/validate/drift outcomes | medium     | W3             | deferred-until-mutation | deferred-until-mutation |
| AEO-WP-AUDIT-ALIGNMENT | Execute alignment audit (`domainspec-audit-alignment`)                  | high       | W3             | deferred-until-mutation | deferred-until-mutation |
| AEO-WP-AUDIT-LAYERING  | Execute layering audit (`domainspec-audit-layering`)                    | high       | W3             | deferred-until-mutation | deferred-until-mutation |

## Closure Strategy Obligations

| Obligation                             | Required Command                                          | Task Mapping            | Baseline Report                             | Current State           |
| -------------------------------------- | --------------------------------------------------------- | ----------------------- | ------------------------------------------- | ----------------------- |
| Feature verification                   | `domainspec-verify-feature agent-execution-orchestrator`  | AEO-WP-VERIFY           | VERIFICATION.md                             | seeded                  |
| Alignment signal (non-mutation slices) | emit `alignment-gap`                                      | AEO-WP-SIGNAL-ALIGNMENT | `pipeline-signals.jsonl` alignment entries  | seeded                  |
| Layering signal (non-mutation slices)  | emit `governance-gap` with layering-boundary evidence     | AEO-WP-SIGNAL-LAYERING  | `pipeline-signals.jsonl` governance entries | seeded                  |
| Tag code (mutation slices)             | `domainspec-tag-code agent-execution-orchestrator`        | AEO-WP-TAG              | Tag extraction/validation reports           | deferred-until-mutation |
| Alignment audit (mutation slices)      | `domainspec-audit-alignment agent-execution-orchestrator` | AEO-WP-AUDIT-ALIGNMENT  | ALIGNMENT-REPORT.md                         | deferred-until-mutation |
| Layering audit (mutation slices)       | `domainspec-audit-layering agent-execution-orchestrator`  | AEO-WP-AUDIT-LAYERING   | LAYERING-ALIGNMENT-REPORT.md                | deferred-until-mutation |

## Governance Signal Obligations (Docs-Only/Non-Mutation)

| Obligation ID  | Signal Type      | Task Mapping            | Trigger                                                                               | Evidence Target                                                | Status |
| -------------- | ---------------- | ----------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------ |
| alignment-gap  | `alignment-gap`  | AEO-WP-SIGNAL-ALIGNMENT | Contract drift or spec/code completeness risk discovered before mutation stages start | [pipeline-signals.jsonl](../../signals/pipeline-signals.jsonl) | seeded |
| governance-gap | `governance-gap` | AEO-WP-SIGNAL-LAYERING  | Layering-boundary risk identified while audit stages are deferred                     | [pipeline-signals.jsonl](../../signals/pipeline-signals.jsonl) | seeded |

## Architecture-Guided Task Directives

| Task ID    | DomainSpec Sources                                                                                | Coverage IDs                                                                                                                             | Architecture References                                                                                                                                                                                                                                   | Implementation Directive                                                                                                                                                                                                                 | Verification Evidence                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AEO-WP-01  | PROJECT-OVERVIEW.md; INITIAL-DEFINITIONS.md; PROJECT-DECISIONS.md; domainspec-orchestrate skill   | ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy, PlannerGateBeforeFeatureMutation, TerminalOutcomeRequired | [domainspec/ARCHITECTURE.md](../../../domainspec/ARCHITECTURE.md); [ARCHITECTURE-FOUNDATIONS.md](../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md); [LAYERING-REFERENCE.md](../../../architecture/pattern-library/LAYERING-REFERENCE.md) | Build inventory of current commands/agents, map each to lifecycle stage and concept IDs, and record deterministic ownership boundaries before spec authoring.                                                                            | [command-agent-inventory.md](work-pack/context/command-agent-inventory.md) + TASK-AEO-WP-01 link checks                                                    |
| AEO-WP-02  | INITIAL-DEFINITIONS.md; PROJECT-DECISIONS.md; plan-first-execution-contract.md                    | ExecuteRun, ResumeRun, RunTerminated, RetryPolicy, CancellationPolicy, D-AEO-001, D-AEO-002, D-AEO-004                                   | [domainspec/ARCHITECTURE.md](../../../domainspec/ARCHITECTURE.md); [DEPENDENCY-RULES.md](../../../architecture/pattern-library/DEPENDENCY-RULES.md); [RELATIONSHIPS.md](../../../domainspec/RELATIONSHIPS.md)                                             | Assemble explicit composable pipeline routes (discovery -> spec -> stories -> tests -> implementation -> observability -> audits -> verify) and encode Sandcastle-style lifecycle contracts and merge strategy defaults in feature docs. | [route-artifact-prompt-pack.md](work-pack/context/route-artifact-prompt-pack.md) + TASK-AEO-WP-02 verification commands                                    |
| AEO-WP-03  | INITIAL-DEFINITIONS.md; DELEGATION-TUNING.md; TERMINAL-GUARD.md; domainspec-signal-observer skill | RunArtifactMapping, suspected_stuck_rate, terminal_outcome_coverage, retry_resolution_rate, cross_run_contamination_incidents, D-AEO-003 | [domainspec/ARCHITECTURE.md](../../../domainspec/ARCHITECTURE.md); [TEST-PIPELINE.md](../../../TEST-PIPELINE.md); [OBSERVABILITY.md](../../../OBSERVABILITY.md)                                                                                           | Define observability mappings from stage lifecycle to governance telemetry contracts (delegation tuning + terminal guard + signal observer) with a standard evidence envelope and Hermes benchmarked session-lineage inventory.          | [TASK-AEO-WP-03.md](work-pack/tasks/TASK-AEO-WP-03.md); [hermes-session-compaction-inventory.md](work-pack/context/hermes-session-compaction-inventory.md) |
| AEO-WP-TAG | SPEC.md; operations.md; workflows.md; interfaces.md                                               | ExecutionRun, RunStateMachine, ExecuteRun, ResumeRun, RunArtifactMapping                                                                 | [TAXONOMY.md](../../../domainspec/TAXONOMY.md); [RELATIONSHIPS.md](../../../domainspec/RELATIONSHIPS.md)                                                                                                                                                  | Apply code/source tags after implementation and publish extract/validate/drift outcomes without dropping prior evidence rows.                                                                                                            | `domainspec-tag-code` output bundle                                                                                                                        |

## Required Links

### Split mode (active)

- work-pack/tasks/TASK-AEO-WP-01.md
- work-pack/tasks/TASK-AEO-WP-02.md
- work-pack/tasks/TASK-AEO-WP-03.md
- work-pack/tasks/TASK-AEO-WP-SIGNAL-ALIGNMENT.md
- work-pack/tasks/TASK-AEO-WP-SIGNAL-LAYERING.md
- work-pack/tasks/TASK-AEO-WP-TAG-CODE.md
- work-pack/tasks/TASK-AEO-WP-VERIFY.md
- work-pack/tasks/TASK-AEO-WP-AUDIT-ALIGNMENT.md
- work-pack/tasks/TASK-AEO-WP-AUDIT-LAYERING.md
- work-pack/waves/W0.md

## Wave Status Board

| Wave | Objective                                                                       | Entry Gate        | Exit Gate                                                                                                       | Status      | Evidence                                                                                    |
| ---- | ------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| W0   | Lock architecture/governance baseline, decisions, and stage matrix              | WORK-PACK created | W0 checks complete and directives populated                                                                     | completed   | work-pack/waves/W0.md                                                                       |
| W1   | Inventory current orchestration capability and seed explicit route contracts    | W0 completed      | AEO-WP-01 completed, AEO-WP-02 completed                                                                        | completed   | work-pack/context/route-artifact-prompt-pack.md                                             |
| W2   | Finalize route schema and observability/governance mappings                     | W1 completed      | AEO-WP-02 and AEO-WP-03 completed                                                                               | in-progress | work-pack/tasks/TASK-AEO-WP-03.md; work-pack/context/hermes-session-compaction-inventory.md |
| W3   | Execute closure strategy outputs (signals now; audits/tag when mutation starts) | W2 completed      | verification + alignment/layering signal evidence published; mutation audits/tag remain deferred-until-mutation | not-started | work-pack/tasks/TASK-AEO-WP-VERIFY.md                                                       |

## Pipeline Stage Coverage

| Stage                 | Required | Wave Mapping | Status      | Evidence                                                                                    | Skip Reason                                                                                                           |
| --------------------- | -------- | ------------ | ----------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| plan                  | yes      | W0           | completed   | WORK-PACK.md                                                                                | -                                                                                                                     |
| architecture-baseline | yes      | W0           | completed   | work-pack/waves/W0.md                                                                       | -                                                                                                                     |
| spec                  | yes      | W1+          | completed   | SPEC.md; work-pack/context/route-artifact-prompt-pack.md                                    | -                                                                                                                     |
| stories               | yes      | W1+          | completed   | STORIES.md; work-pack/context/route-artifact-prompt-pack.md                                 | -                                                                                                                     |
| tests                 | yes      | W1+          | completed   | TEST-SPEC.md; work-pack/context/route-artifact-prompt-pack.md                               | -                                                                                                                     |
| backend-implement     | yes      | W2+          | not-started | work-pack/tasks/TASK-AEO-WP-02.md                                                           | -                                                                                                                     |
| ui-pipeline           | yes      | W2+          | skipped     | work-pack/waves/W0.md                                                                       | No HTTP interface/UI obligations in current feature baseline                                                          |
| observability-spec    | yes      | W2+          | in-progress | work-pack/tasks/TASK-AEO-WP-03.md; work-pack/context/hermes-session-compaction-inventory.md | -                                                                                                                     |
| instrument-otel       | yes      | W2+          | not-started | work-pack/tasks/TASK-AEO-WP-03.md                                                           | -                                                                                                                     |
| otel-verify           | yes      | W2+          | not-started | work-pack/tasks/TASK-AEO-WP-03.md                                                           | -                                                                                                                     |
| infra-deploy          | yes      | W2+          | skipped     | work-pack/waves/W0.md                                                                       | No infra architecture delta in this planning slice                                                                    |
| registry-sync         | yes      | W2+          | not-started | work-pack/tasks/TASK-AEO-WP-03.md                                                           | -                                                                                                                     |
| verify-readiness      | yes      | W3+          | not-started | work-pack/tasks/TASK-AEO-WP-VERIFY.md                                                       | -                                                                                                                     |
| verify-feature        | yes      | W3+          | not-started | work-pack/tasks/TASK-AEO-WP-VERIFY.md                                                       | -                                                                                                                     |
| audit-alignment       | yes      | W3+          | skipped     | work-pack/tasks/TASK-AEO-WP-SIGNAL-ALIGNMENT.md                                             | Deferred until first mutation-capable stage starts; covered by `alignment-gap` obligation in current docs-only slice  |
| audit-layering        | yes      | W3+          | skipped     | work-pack/tasks/TASK-AEO-WP-SIGNAL-LAYERING.md                                              | Deferred until first mutation-capable stage starts; covered by `governance-gap` obligation in current docs-only slice |

## Decision Lock Summary

| Decision ID | Scope      | Status   | Selected Option                               | Source        | Date       |
| ----------- | ---------- | -------- | --------------------------------------------- | ------------- | ---------- |
| D-AEO-001   | cross-task | selected | merge-to-head branch strategy                 | decision gate | 2026-05-08 |
| D-AEO-002   | cross-task | selected | Sandcastle adapter only MVP provider baseline | decision gate | 2026-05-08 |
| D-AEO-003   | cross-task | selected | Standard run evidence envelope                | decision gate | 2026-05-08 |
| D-AEO-004   | cross-task | selected | latest-run-wins cancellation semantics        | decision gate | 2026-05-08 |

## Blockers

| Blocker ID | Scope      | Description                                                      | Owner         | Next Action                                        | Target Date |
| ---------- | ---------- | ---------------------------------------------------------------- | ------------- | -------------------------------------------------- | ----------- |
| none       | cross-task | No blocker-level unresolved decisions remain for planning stage. | feature owner | Proceed to observability mapping task (AEO-WP-03). | 2026-05-08  |

## Notes

- This stage is planning only; no implementation code mutations are included.
- This slice is docs-only/non-mutation: alignment/layering audits and tag-code remain deferred until mutation stages begin.
- Do not mark deferred mutation tasks as completed in this slice; reactivate them when the first mutation-capable stage starts.
- Interview artifacts remain authoritative planning input until feature docs are authored.
- Revalidate markdown links and drift checks before entering spec mutation stage.

## Change Log

| Date       | Change                                                                                                                                                     | Author  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 2026-05-08 | Started AEO-WP-03 and added Hermes session-compaction inventory artifact to guide observability/session-handoff mapping.                                   | Copilot |
| 2026-05-08 | Marked W1 completed and advanced W2 to in-progress after AEO-WP-02 route artifact publication.                                                             | Copilot |
| 2026-05-08 | Completed AEO-WP-02: published prompt-ready route artifact pack and advanced docs-stage coverage (`spec`, `stories`, `tests`) to completed.                | Copilot |
| 2026-05-08 | Completed AEO-WP-01: published command/agent inventory artifact, updated task evidence, and advanced W1 status to in-progress.                             | Copilot |
| 2026-05-08 | Created native work-pack with W0 baseline, canonical stage matrix, decision lock, and seeded planning/closure tasks for agent-execution-orchestrator.      | Copilot |
| 2026-05-08 | Applied mutation-aware closure policy: added alignment/layering signal obligations for docs-only slice and deferred audit/tag tasks until mutation stages. | Copilot |
