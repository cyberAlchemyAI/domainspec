# TASK-AEO-WP-02 - Composable Pipeline Assembly Model and Route Schema

## Goal

Define the explicit composable pipeline model and route schema for Agent Execution Orchestrator, including Sandcastle-style lifecycle semantics and policy-bound stage transitions.

## Wave Assignment

- Primary waves: W1, W2

## Status

completed

- Completed at: 2026-05-08 (UTC)
- Output artifact: [route-artifact-prompt-pack.md](../context/route-artifact-prompt-pack.md)

## Capability Contract Subset

| Contract Area      | Required Subset                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Pipeline assembly  | Explicit route chain for discovery -> spec -> test-spec -> implement -> audits -> verify |
| Lifecycle contract | Stage state progression, terminal outcomes, retry/cancel rules, resume semantics         |
| Integration policy | Branch/worktree policy and provider adapter baseline integration                         |

## DomainSpec Coverage

| Source                                                                                               | Coverage IDs                                                                                                                            |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [PROJECT-OVERVIEW.md](../../../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)       | Start delegated run workflow, retry and recovery loop, session capture and resume                                                       |
| [INITIAL-DEFINITIONS.md](../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md) | AssemblePipelineRoute, ExecutePipelineRoute, ResumeExecutionRun, RunStateMachine, BranchStrategyPolicy, RetryPolicy, CancellationPolicy |
| [PROJECT-DECISIONS.md](../../../../interviews/agent-execution-orchestrator/PROJECT-DECISIONS.md)     | PD-004, PD-005, D-AEO-001, D-AEO-002, D-AEO-004                                                                                         |
| [plan-first-execution-contract.md](../../../../research/plan-first-execution-contract.md)            | Rule 1 complexity gate, W0-first planning baseline                                                                                      |
| [work-pack template](../../../../../domainspec/templates/work-pack.md)                               | Canonical stage coverage and closure-task constraints                                                                                   |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [RELATIONSHIPS.md](../../../../../domainspec/RELATIONSHIPS.md)
- [TAXONOMY.md](../../../../../domainspec/TAXONOMY.md)
- [ARCHITECTURE-FOUNDATIONS.md](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [DEPENDENCY-RULES.md](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)

## Implementation Directives

- Author feature contracts in `SPEC.md`, `operations.md`, `workflows.md`, `interfaces.md`, and `events.md` with explicit stage route composition.
- Model runner lifecycle using Sandcastle-style semantics for sandbox/worktree/session behavior while keeping provider adapters abstracted.
- Encode `merge-to-head` as the default branch strategy policy and document alternative strategy hooks.
- Encode `latest-run-wins` cancellation semantics and bounded retry policy in lifecycle transitions.
- Define stage-level failure handling, terminal outcomes, and recovery obligations with deterministic evidence expectations.

## Completion Criteria

- [x] Pipeline route schema is explicit and traceable across feature docs.
- [x] Lifecycle transitions include success, blocked, failed, canceled, and resumed states.
- [x] Branch strategy, provider baseline, and cancellation decisions are reflected in spec contracts.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/context/route-artifact-prompt-pack.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/SPEC.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/workflows.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/operations.md`

## Deliverables

- [route-artifact-prompt-pack.md](../context/route-artifact-prompt-pack.md)

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                 |
| ----------- | -------- | -------- | -------------------------------------------------------------------- |
| D-AEO-001   | yes      | selected | Route schema must use `merge-to-head` default policy                 |
| D-AEO-002   | yes      | selected | Provider contract baseline is Sandcastle adapter only                |
| D-AEO-004   | yes      | selected | Superseded runs must follow `latest-run-wins` cancellation semantics |
