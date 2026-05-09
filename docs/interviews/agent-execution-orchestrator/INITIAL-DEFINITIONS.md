# Initial Definitions

## Glossary Seed

| Term                | Working Definition                                                              | Category | Status | Evidence Type |
| ------------------- | ------------------------------------------------------------------------------- | -------- | ------ | ------------- |
| Execution Run       | A single orchestrated agent stage execution from trigger to terminal outcome    | workflow | draft  | observed      |
| Sandbox Provider    | Adapter that provisions isolated runtime environments for execution runs        | system   | draft  | stated        |
| Worktree Lease      | Managed lifecycle handle for branch/worktree allocation per run                 | workflow | draft  | stated        |
| Branch Strategy     | Policy selecting `head`, `merge-to-head`, or `branch` integration path          | policy   | draft  | stated        |
| Completion Signal   | Explicit terminal indicator for a run (`completed`, `blocked`, `failed`)        | metric   | draft  | observed      |
| Idle Timeout Policy | Rule that marks a run as stalled when no progress occurs in configured window   | policy   | draft  | observed      |
| Session Snapshot    | Persisted execution context that allows deterministic resume after interruption | workflow | draft  | stated        |
| Artifact Bundle     | Structured collection of logs, outputs, and decisions emitted per run           | system   | draft  | observed      |
| Retry Count         | Number of bounded retries attempted for one stage run                           | metric   | draft  | observed      |
| Suspected Stuck     | Boolean signal that watchdog or non-progress heuristic has fired                | metric   | draft  | observed      |

## Bounded Context Definitions

| Context                       | Responsibility                                           | In Scope                                                        | Out Of Scope                                             | Status    |
| ----------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- | --------- |
| Run Orchestration             | Manage run-state progression and terminal outcomes       | run lifecycle state model, completion semantics, stage outcomes | feature business rules unrelated to orchestration        | candidate |
| Sandbox Lifecycle             | Isolate runtime execution and environment setup/teardown | sandbox create/lease/release, provider contract                 | provider implementation internals in MVP                 | candidate |
| Branch And Worktree Lifecycle | Control git worktree and branch integration strategy     | strategy selection, lifecycle hooks, merge behavior policy      | repository-wide branching policy changes outside feature | candidate |
| Reliability Controls          | Apply cancellation, retry, and stuck mitigation          | watchdog thresholds, bounded retry, cancellation semantics      | autonomous long-horizon schedulers in first slice        | candidate |
| Observability And Evidence    | Emit deterministic telemetry and artifact outputs        | run logs, structured output envelope, evidence links            | analytics dashboards beyond minimum telemetry contract   | candidate |

## Core Concepts

| Concept                  | Suggested Meta-Type | Context                       | Description                                                               | Status  |
| ------------------------ | ------------------- | ----------------------------- | ------------------------------------------------------------------------- | ------- | ------ | ---------- | ----- |
| ExecutionRun             | Entity              | Run Orchestration             | Identity-bearing run object with status, stageRunId, timing, and outcomes | draft   |
| RunStateMachine          | State Machine       | Run Orchestration             | Allowed transitions for run lifecycle (`queued -> running -> completed    | blocked | failed | canceled`) | draft |
| ExecuteRun               | Operation           | Run Orchestration             | Operation that starts and supervises one run                              | draft   |
| ResumeRun                | Operation           | Run Orchestration             | Operation that restores a session snapshot and continues execution        | draft   |
| CancellationPolicy       | Policy              | Reliability Controls          | Determines when and how active runs are canceled                          | draft   |
| RetryPolicy              | Policy              | Reliability Controls          | Defines bounded retry count, narrowing strategy, and escalation behavior  | draft   |
| WatchdogTimeoutRule      | Rule                | Reliability Controls          | Run must emit progress/terminal evidence before watchdog threshold        | draft   |
| SandboxProviderInterface | Interface           | Sandbox Lifecycle             | Provider-agnostic contract for environment provisioning and cleanup       | draft   |
| BranchStrategyPolicy     | Policy              | Branch And Worktree Lifecycle | Selects integration path and merge handling by run type                   | draft   |
| RunTerminated            | Event               | Run Orchestration             | Event emitted when run reaches terminal state with evidence payload       | draft   |
| RunArtifactMapping       | Mapping             | Observability And Evidence    | Maps raw run outputs to deterministic artifact bundle schema              | draft   |

## Rules And Policies

| Name                             | Type      | Description                                                               | Source                                | Status |
| -------------------------------- | --------- | ------------------------------------------------------------------------- | ------------------------------------- | ------ |
| PlannerGateBeforeFeatureMutation | policy    | Feature-path mutation requires planner preflight PASS and work-pack gate  | observed repo policy                  | draft  |
| TerminalOutcomeRequired          | invariant | Every delegated stage must end with explicit terminal outcome             | observed repo policy                  | draft  |
| BoundedRetryOnly                 | policy    | Retry attempts are finite and must narrow scope before final block        | observed repo policy                  | draft  |
| ProviderAgnosticExecution        | policy    | Orchestration logic should work across sandbox providers through adapters | operator                              | draft  |
| ArtifactEvidenceMinimum          | rule      | Each run must publish a minimal evidence bundle for auditability          | inferred from observed telemetry/docs | draft  |

## External Interfaces

| Interface                                    | Purpose                                                                                 | Owner                                        | Dependency Type | Status    |
| -------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------- | --------------- | --------- |
| Sandcastle Semantic Reference                | Provide orchestration reference semantics for sandbox, worktree, and multi-run behavior | external reference (`mattpocock/sandcastle`) | partner         | candidate |
| Git Worktree / Branch Interface              | Provision and reconcile branch/worktree lifecycle per run                               | local git runtime                            | internal        | candidate |
| Telemetry Ledger (`delegation-tuning.jsonl`) | Persist stage run outcomes and stuck/retry signals                                      | DomainSpec docs/signals                      | internal        | observed  |
| Terminal Guard Tooling                       | Enforce safer execution patterns and bounded terminal behavior                          | repository tools                             | internal        | observed  |

## Metrics And Definitions

| Metric                              | Definition                                                    | Decision It Supports                               | Status |
| ----------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- | ------ |
| `suspected_stuck_rate`              | suspected-stuck terminal rows / total terminal rows in window | Whether watchdog and lifecycle model are effective | draft  |
| `terminal_outcome_coverage`         | runs with explicit terminal outcome / runs started            | Whether run states are unambiguous                 | draft  |
| `retry_resolution_rate`             | runs resolved after retry / runs retried                      | Whether retry policy improves completion           | draft  |
| `cross_run_contamination_incidents` | number of runs with workspace/sandbox leakage evidence        | Whether isolation controls are sufficient          | draft  |
| `resume_success_rate`               | resumed runs completed terminally / resumed runs attempted    | Whether session snapshot and resume are viable     | draft  |

## Ambiguities To Resolve

| Topic                        | Why Ambiguous                                                                 | Resolution Needed                                                     |
| ---------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Default branch strategy      | Trade-off between speed and isolation is not yet validated for this repo      | Controlled experiment comparing `head`, `merge-to-head`, and `branch` |
| MVP provider set             | Sandcastle semantics are defined but concrete provider baseline is unselected | Decision lock for required provider adapters in first slice           |
| Cancellation semantics       | Superseded runs and manual cancellation precedence are undefined              | Policy decision and state transition rules                            |
| Artifact retention boundary  | Required evidence scope is known, retention/cleanup policy is not             | Define minimal artifact envelope and retention window                 |
| Resume fidelity requirements | Session snapshot fields are not yet bounded                                   | Define mandatory snapshot schema and reject incomplete resumes        |
