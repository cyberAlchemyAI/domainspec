# Agent Execution Orchestrator

## Summary

Agent Execution Orchestrator is a proposed DomainSpec feature that coordinates full task-lifecycle execution by coding agents with deterministic controls for sandbox setup, worktree and branch strategy, completion signaling, and run telemetry. The feature goal is to unify existing orchestration behavior into a feature-scoped contract that is easier to reason about, verify, and evolve. Sandcastle is used as the execution reference model for sandbox and multi-run orchestration semantics.

## Discovery Mode

- Mode: brownfield
- Project state: active implementation
- Interview date: 2026-05-08
- Operator / owner: domainspec-core operator

## Problem Framing

- Primary user or customer: DomainSpec operators and maintainers running delegated agent workflows
- Core problem: execution orchestration behavior exists across multiple policies and skills, but there is no dedicated feature contract that owns end-to-end agent execution lifecycle management
- Value proposition: deterministic execution orchestration with isolated runtime control, run-state observability, and explicit failure recovery
- Business goal: improve execution reliability and reduce stalled or ambiguous delegated runs while preserving DomainSpec governance
- Non-goals: implementing product feature logic unrelated to orchestration, replacing specialist skill semantics, forcing provider lock-in in the first slice

## Current State

| Item                    | Status  | Evidence Type | Notes                                                                                                                                                                                         |
| ----------------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product scope           | partial | observed      | Existing orchestration and gating policies are documented in `.github/skills/domainspec-orchestrate/SKILL.md` and `implementation/domainspec/docs/research/plan-first-execution-contract.md`. |
| Domain boundaries       | partial | stated        | User states scope is a new feature that runs and manages all other tasks and agent executions for that lifecycle.                                                                             |
| Existing implementation | partial | observed      | Delegation telemetry contract exists in `implementation/domainspec/docs/signals/DELEGATION-TUNING.md` and terminal hardening exists in `docs/signals/TERMINAL-GUARD.md`.                      |
| Metrics baseline        | partial | observed      | Stuck/retry telemetry fields exist (`suspectedStuck`, `retryCount`) in delegation tuning schema, but no feature-level run metrics baseline is defined yet.                                    |
| External reference fit  | known   | stated        | Sandcastle capabilities are provided as reference semantics: `run()`, `createSandbox()`, `createWorktree()`, branch strategies, hooks, idle timeouts, and session resume flows.               |

Evidence type:

- `observed` = seen in repository artifacts
- `stated` = provided by operator in this interview request
- `hypothesized` = inferred and still unvalidated

## Actors And Stakeholders

| Actor                    | Goal                                            | Pain Point                                               | Frequency         | Evidence Type |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------- | ----------------- | ------------- |
| DomainSpec operator      | Execute feature lifecycle tasks reliably        | Delegated stages can stall or require manual recovery    | daily             | observed      |
| Feature owner            | Track execution status and outcomes             | No single feature contract for run lifecycle boundaries  | per feature cycle | stated        |
| Governance maintainer    | Preserve deterministic execution evidence       | Existing policies are distributed across multiple files  | per release       | observed      |
| Agent runner integration | Support multiple sandbox providers consistently | Provider-specific env handling and lifecycle differences | per run           | hypothesized  |

## Candidate Bounded Contexts

| Context                     | Responsibility                                     | Key Concepts                                     | Status    | Evidence Type |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------ | --------- | ------------- |
| Run Orchestration           | Own run lifecycle from request to terminal verdict | ExecutionRun, RunStateMachine, CompletionSignal  | candidate | stated        |
| Sandbox Isolation           | Create and dispose isolated execution environments | SandboxProvider, SandboxLease, IdleTimeoutPolicy | candidate | stated        |
| Branch And Worktree Control | Manage branch strategy and worktree lifecycle      | BranchStrategy, WorktreeLease, MergePolicy       | candidate | stated        |
| Reliability And Recovery    | Handle retries, cancellation, and stuck detection  | RetryPolicy, CancellationPolicy, StuckHeuristic  | candidate | observed      |
| Observability And Artifacts | Persist logs, outputs, and run evidence bundles    | RunLog, ArtifactBundle, SessionSnapshot          | candidate | observed      |

## Core Workflows

| Workflow                      | Trigger                                                  | Main Steps                                                                             | Failure Mode                                             | Evidence Type |
| ----------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------- |
| Start delegated run           | New stage run requested                                  | Classify profile -> allocate sandbox/worktree -> execute -> collect terminal outcome   | Missing completion signal causes ambiguous run state     | observed      |
| Multi-run implement to review | Feature lifecycle needs implementation and review passes | Run implement stage -> capture artifacts -> run review stage -> reconcile outcomes     | Branch strategy mismatch causes merge or drift conflicts | stated        |
| Retry and recovery loop       | Watchdog or non-progress signal                          | Classify stuck -> bounded retry -> emit block with remediation                         | Repeated retries without narrowed scope                  | observed      |
| Session capture and resume    | Interrupted run or operator pause                        | Persist run snapshot -> restore environment -> continue or terminate deterministically | Snapshot incompleteness breaks resume fidelity           | stated        |

## Constraints

| Constraint                                                   | Type        | Why It Matters                                                                     | Evidence Type |
| ------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------- | ------------- |
| Planner gate required for `docs/features/{feature}` mutation | governance  | Feature-path mutation is blocked without planner preflight PASS and work-pack gate | observed      |
| Deterministic evidence required for delegated stages         | operational | Terminal outcomes and telemetry fields must be explicit for every stage            | observed      |
| Provider-agnostic sandbox abstraction                        | technical   | Feature must avoid hard coupling to one runtime provider                           | stated        |
| No implementation in interview scope                         | process     | Current stage must remain discovery artifacts only                                 | stated        |

## Success Signals

| Signal                              | Why It Matters                                 | Current Baseline         | Target Direction |
| ----------------------------------- | ---------------------------------------------- | ------------------------ | ---------------- |
| `suspected_stuck_rate`              | Direct measure of orchestration reliability    | unknown at feature scope | reduce           |
| `run_terminal_outcome_coverage`     | Ensures no ambiguous stage completion states   | partial (schema exists)  | improve          |
| `retry_resolution_rate`             | Measures effectiveness of bounded retry logic  | unknown                  | improve          |
| `cross_run_contamination_incidents` | Validates sandbox/worktree isolation           | unknown                  | reduce           |
| `mean_time_to_stage_completion`     | Captures throughput and orchestration overhead | unknown                  | stabilize        |

## Risks And Unknowns

| Risk                                | Why Risky                                                     | Severity | What Would Reduce It                                             |
| ----------------------------------- | ------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| Over-engineered orchestration layer | Added abstraction may increase latency and complexity         | medium   | Timeboxed MVP with strict success/failure criteria               |
| Branch strategy selection drift     | Wrong default can increase merge conflicts or review delays   | high     | Controlled branch strategy experiment and explicit decision lock |
| Provider environment variance       | Env provisioning differences can break deterministic behavior | high     | Provider adapter contract and compatibility tests                |
| Artifact explosion                  | Excessive logs/artifacts can reduce signal quality            | medium   | Minimal evidence schema and retention policy                     |

## Counter-Positioning

| Main Proposition                                                          | Counter-Position                                                                                                | Invalidation Signal                                                                     |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A dedicated orchestration feature will improve execution reliability      | Existing distributed policies already solve the reliability problem and only need minor cleanup                 | No measurable reduction in stuck or retry metrics after orchestration feature MVP       |
| Sandcastle-style sandbox/worktree semantics should be a primary reference | Existing in-repo execution controls are sufficient and external reference adds unnecessary abstraction pressure | Adapter design introduces complexity without measurable reliability or throughput gains |
| Multi-run implement then review should be first-class in feature scope    | Single-run execution with stronger post-run verification is simpler and equally effective                       | Multi-run flow increases cycle time and raises integration regressions                  |

## Open Questions

1. Which branch strategy should be default for successful runs: `head`, `merge-to-head`, or isolated `branch`?
2. Which sandbox provider contract must be mandatory in MVP versus optional adapters?
3. What artifact bundle is minimally sufficient to support auditability without creating operator noise?
4. Which cancellation semantics are required when runs are superseded by newer requests?

## Interview Readiness Verdict

Needs more discovery before feature-path spec mutation. Discovery baseline is complete, but planner preflight gate for `docs/features/agent-execution-orchestrator/` is not yet PASS.
