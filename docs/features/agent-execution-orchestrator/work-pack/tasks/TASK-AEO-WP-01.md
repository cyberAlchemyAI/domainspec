# TASK-AEO-WP-01 - Capability Mapping and Inventory of Current Commands and Agents

## Goal

Build an authoritative inventory of current DomainSpec commands and agent roles, then map each item to orchestrator lifecycle responsibilities and concept tokens for the feature baseline.

## Wave Assignment

- Primary wave: W1

## Status

completed

- Completed at: 2026-05-08 (UTC)
- Output artifact: [command-agent-inventory.md](../context/command-agent-inventory.md)

## Capability Contract Subset

| Contract Area         | Required Subset                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Command inventory     | All mutation-capable and verification `domainspec-*` commands relevant to execution orchestration |
| Agent/skill inventory | Routing/orchestration and specialist execution agents/skills currently active in the repo         |
| Governance contracts  | Delegation tuning, terminal guard, and signal-observer telemetry touchpoints                      |

## DomainSpec Coverage

| Source                                                                                                       | Coverage IDs                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [PROJECT-OVERVIEW.md](../../../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)               | Run Orchestration, Sandbox Isolation, Branch And Worktree Control, Reliability And Recovery, Observability And Artifacts           |
| [INITIAL-DEFINITIONS.md](../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md)         | ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy, RetryPolicy, CancellationPolicy, RunArtifactMapping |
| [PROJECT-DECISIONS.md](../../../../interviews/agent-execution-orchestrator/PROJECT-DECISIONS.md)             | PD-002, PD-005                                                                                                                     |
| [domainspec-orchestrate SKILL.md](../../../../../copilot/skills/domainspec-orchestrate/SKILL.md)             | planner-first enforcement, delegated stage routing                                                                                 |
| [domainspec-plan-phase-bridge SKILL.md](../../../../../copilot/skills/domainspec-plan-phase-bridge/SKILL.md) | W0BaselineRequired, StageCoverageMatrixRequired, ClosureTaskSeedRequired                                                           |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [ARCHITECTURE-FOUNDATIONS.md](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [LAYERING-REFERENCE.md](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [governance-baseline.md](../../../../shared/governance-baseline.md)
- [DELEGATION-TUNING.md](../../../../signals/DELEGATION-TUNING.md)

## Implementation Directives

- Create a command/agent inventory artifact at `docs/features/agent-execution-orchestrator/work-pack/context/command-agent-inventory.md`.
- Map each command/agent to lifecycle stage, source skill/agent file, expected artifacts, and telemetry contracts.
- Include explicit route anchors for discovery, spec, test-spec, implement, audits, and verify stages.
- Capture unresolved ownership or naming conflicts in this task under `Gaps and Questions`.

## Completion Criteria

- [x] Inventory includes all relevant orchestration commands and agent roles.
- [x] Every inventory row maps to at least one feature concept token from initial definitions.
- [x] Command-to-stage mapping is explicit and references source artifacts.

## Verification Evidence

- `rg -n "^name:\s+domainspec-(orchestrate|start|context-builder|plan-phase-bridge|spec-feature|generate-tests|implement|audit-alignment|audit-layering|verify-feature|signal-observer|tag-code)$" copilot/skills/**/SKILL.md` (see [EV-01](../context/command-agent-inventory.md#ev-01-skill-command-declarations))
- `rg -n "^name:\s+domainspec-(orchestrator|planner|context-builder|spec-writer|test-designer|implementer|alignment-auditor|layering-auditor|verifier|story-sync)$" copilot/agents/*.agent.md` (see [EV-02](../context/command-agent-inventory.md#ev-02-agent-declarations))
- `rg -n "stageRunId|suspectedStuck|retryCount|outcome|started|terminal" docs/signals/DELEGATION-TUNING.md docs/signals/delegation-tuning.jsonl` (see [EV-03](../context/command-agent-inventory.md#ev-03-delegation-telemetry-schema-and-startedterminal-pairing))
- `rg -n "terminal_guard.sh|run --timeout|nudge|terminal-guard.jsonl|commandHash" ../../docs/signals/TERMINAL-GUARD.md` (see [EV-04](../context/command-agent-inventory.md#ev-04-terminal-guard-contract))
- `rg -n "merge-to-head|Sandcastle|latest-run-wins|discovery stage|spec stage|tests stage|implementation stage|audits stage|verify stage" docs/features/agent-execution-orchestrator/{SPEC.md,workflows.md,operations.md,WORK-PACK.md}` (see [EV-05](../context/command-agent-inventory.md#ev-05-route-anchors-and-decision-lock-evidence))
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-WP-01.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/context/command-agent-inventory.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/WORK-PACK.md` (see [EV-06](../context/command-agent-inventory.md#ev-06-markdown-link-validation-post-update))

## Gaps and Questions

- None.

## Deliverables

- [command-agent-inventory.md](../context/command-agent-inventory.md) with lifecycle route anchors for discovery, spec, tests, implement, audits, and verify.
- Command and agent inventories mapped to source files, expected artifacts, telemetry contracts, and concept tokens.
- Embedded evidence log with command outputs and decision-lock preservation references.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                    |
| ----------- | -------- | -------- | ----------------------------------------------------------------------- |
| D-AEO-001   | yes      | selected | Inventory must model `merge-to-head` branch policy as default           |
| D-AEO-002   | yes      | selected | Inventory must include Sandcastle adapter as required provider baseline |
