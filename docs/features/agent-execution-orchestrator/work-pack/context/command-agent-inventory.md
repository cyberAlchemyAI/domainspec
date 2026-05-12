# Command and Agent Inventory - Legacy WP-01 Baseline

## Scope and Authority

- Legacy source: WP-01 planning inventory baseline (retired 2026-05-11)
- Feature: `agent-execution-orchestrator`
- Source context pack/index: retired alongside legacy WP task-file cleanup
- Framework constraints applied: `2.0.10`, `2.0.9`, `2.0.8`, `2.0.4` from [domainspec/CHANGELOG.md](../../../../../domainspec/CHANGELOG.md)

## Decision-Lock Preservation

| Decision  | Locked Value                | Source                                                    | Inventory Impact                                                          |
| --------- | --------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| D-AEO-001 | `merge-to-head`             | [WORK-PACK.md](../../WORK-PACK.md#resolved-decision-gate) | Branch-policy mappings keep `merge-to-head` as default in lifecycle rows. |
| D-AEO-002 | Sandcastle adapter baseline | [WORK-PACK.md](../../WORK-PACK.md#resolved-decision-gate) | Provider mappings require Sandcastle MVP compatibility in execution rows. |
| D-AEO-004 | `latest-run-wins`           | [WORK-PACK.md](../../WORK-PACK.md#resolved-decision-gate) | Cancellation mappings preserve superseded-run termination semantics.      |

## Canonical Lifecycle Route Anchors

| Lifecycle Stage | Canonical Anchor                                                                                             | Routed Commands                                                                                         | Primary Agent Roles                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| discovery       | [workflows.md#featurelifecyclepipelineworkflow](../../workflows.md#featurelifecyclepipelineworkflow) step 3  | `domainspec-start`, `domainspec-context-builder`, optional `domainspec-plan-phase-bridge` pre-bootstrap | `domainspec-orchestrator`, `domainspec-interviewer`, `domainspec-context-builder`, `domainspec-planner` |
| spec            | [workflows.md#featurelifecyclepipelineworkflow](../../workflows.md#featurelifecyclepipelineworkflow) step 4  | `domainspec-spec-feature`                                                                               | `domainspec-spec-writer`                                                                                |
| tests           | [workflows.md#featurelifecyclepipelineworkflow](../../workflows.md#featurelifecyclepipelineworkflow) step 6  | `domainspec-generate-tests`                                                                             | `domainspec-test-designer`                                                                              |
| implement       | [workflows.md#featurelifecyclepipelineworkflow](../../workflows.md#featurelifecyclepipelineworkflow) step 7  | `domainspec-implement` (+ `domainspec-tag-code` post-edit)                                              | `domainspec-implementer`, `domainspec-code-tagger`                                                      |
| audits          | [workflows.md#featurelifecyclepipelineworkflow](../../workflows.md#featurelifecyclepipelineworkflow) step 9  | `domainspec-audit-alignment`, `domainspec-audit-layering`                                               | `domainspec-alignment-auditor`, `domainspec-layering-auditor`                                           |
| verify          | [workflows.md#featurelifecyclepipelineworkflow](../../workflows.md#featurelifecyclepipelineworkflow) step 10 | `domainspec-verify-feature`                                                                             | `domainspec-verifier`                                                                                   |

## Command Inventory

| Command                        | Lifecycle Stage Anchor                                      | Source Skill and Agent                                                                                                                                          | Expected Artifacts                                                                                                                            | Telemetry Contracts                                                                                                                                                                                             | Concept Tokens                                                                                                                     |
| ------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `domainspec-orchestrate`       | discovery -> spec -> tests -> implement -> audits -> verify | [copilot/skills/domainspec-orchestrate/SKILL.md](../../../../../copilot/skills/domainspec-orchestrate/SKILL.md) (`agent: domainspec-orchestrator`)              | Routed-stage decision summary; staged specialist outputs; mandatory post-spec task refresh when spec stage runs                               | [DELEGATION-TUNING.md](../../../../signals/DELEGATION-TUNING.md) started/terminal pairing by `stageRunId`; [TERMINAL-GUARD.md](../../../../../../../docs/signals/TERMINAL-GUARD.md) for risky terminal commands | ExecutionRun, RunStateMachine, RetryPolicy, CancellationPolicy, RunArtifactMapping                                                 |
| `domainspec-start`             | discovery                                                   | [copilot/skills/domainspec-start/SKILL.md](../../../../../copilot/skills/domainspec-start/SKILL.md) (`agent: domainspec-interviewer`)                           | `docs/PROJECT-OVERVIEW.md`, `docs/INITIAL-DEFINITIONS.md`, `docs/PROJECT-DECISIONS.md`, `docs/HYPOTHESES.md`, `docs/EXPERIMENT-CANDIDATES.md` | Delegated stage telemetry to [docs/signals/delegation-tuning.jsonl](../../../../signals/delegation-tuning.jsonl)                                                                                                | ExecutionRun, RunStateMachine, RunArtifactMapping                                                                                  |
| `domainspec-plan-phase-bridge` | discovery bootstrap / planner gate before mutation          | [copilot/skills/domainspec-plan-phase-bridge/SKILL.md](../../../../../copilot/skills/domainspec-plan-phase-bridge/SKILL.md) (`agent: domainspec-planner`)       | `docs/features/{feature}/WORK-PACK.md`, full pipeline stage matrix, seeded closure tasks, architecture-guided directives                      | Delegated stage telemetry to [docs/signals/delegation-tuning.jsonl](../../../../signals/delegation-tuning.jsonl); stale-stage reconciliation obligations from changelog `2.0.9`                                 | BranchStrategyPolicy, RetryPolicy, CancellationPolicy, RunArtifactMapping                                                          |
| `domainspec-context-builder`   | discovery/pre-implement context stage                       | [copilot/skills/domainspec-context-builder/SKILL.md](../../../../../copilot/skills/domainspec-context-builder/SKILL.md) (`agent: domainspec-context-builder`)   | `work-pack/context/{task-id}-CONTEXT.md`, `work-pack/context/{task-id}-CONTEXT.index.json`                                                    | Suspected-stuck handling and bounded search under delegation policy; if delegated, telemetry rows in [docs/signals/delegation-tuning.jsonl](../../../../signals/delegation-tuning.jsonl)                        | RunArtifactMapping, ExecutionRun, RunStateMachine                                                                                  |
| `domainspec-spec-feature`      | spec                                                        | [copilot/skills/domainspec-spec-feature/SKILL.md](../../../../../copilot/skills/domainspec-spec-feature/SKILL.md) (`agent: domainspec-spec-writer`)             | `docs/features/{feature}/SPEC.md` and aspect docs; strict concept-token coverage validation against work-pack tasks                           | Planner-first gate + post-spec refresh expectation via `domainspec-orchestrate`; delegated stage telemetry in orchestrated runs                                                                                 | ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy                                                      |
| `domainspec-generate-tests`    | tests                                                       | [copilot/skills/domainspec-generate-tests/SKILL.md](../../../../../copilot/skills/domainspec-generate-tests/SKILL.md) (`agent: domainspec-test-designer`)       | `docs/features/{feature}/TEST-SPEC.md`; optional backend/UI test scaffolds                                                                    | Planner-first route and delegated stage telemetry when orchestrated                                                                                                                                             | RunStateMachine, RetryPolicy, RunArtifactMapping                                                                                   |
| `domainspec-implement`         | implement                                                   | [copilot/skills/domainspec-implement/SKILL.md](../../../../../copilot/skills/domainspec-implement/SKILL.md) (`agent: domainspec-implementer`)                   | Implementation code/tests; task scaffold (`{task-id}-SCAFFOLD.md`); post-edit tag-code stage                                                  | Delegated stage telemetry in [docs/signals/delegation-tuning.jsonl](../../../../signals/delegation-tuning.jsonl); bounded retry/de-escalation                                                                   | ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy, RetryPolicy, CancellationPolicy, RunArtifactMapping |
| `domainspec-tag-code`          | implement handoff                                           | [copilot/skills/domainspec-tag-code/SKILL.md](../../../../../copilot/skills/domainspec-tag-code/SKILL.md) (`agent: domainspec-code-tagger`)                     | Strict extract/validate/drift tag outputs and code-tag evidence bundle                                                                        | Follows planner-gate mutation guard; telemetry routed when delegated by orchestrator                                                                                                                            | RunArtifactMapping, ExecutionRun                                                                                                   |
| `domainspec-audit-alignment`   | audits                                                      | [copilot/skills/domainspec-audit-alignment/SKILL.md](../../../../../copilot/skills/domainspec-audit-alignment/SKILL.md) (`agent: domainspec-alignment-auditor`) | `docs/features/{feature}/ALIGNMENT-REPORT.md` with obligation coverage gate                                                                   | Verification evidence expectations and delegated-stage telemetry when orchestrated                                                                                                                              | RunStateMachine, RunArtifactMapping, ExecutionRun                                                                                  |
| `domainspec-audit-layering`    | audits                                                      | [copilot/skills/domainspec-audit-layering/SKILL.md](../../../../../copilot/skills/domainspec-audit-layering/SKILL.md) (`agent: domainspec-layering-auditor`)    | `docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md`, `LAYERING-ALIGNMENT-PLAN.md`                                                          | Planner-first mutation guard + delegated-stage telemetry when orchestrated                                                                                                                                      | BranchStrategyPolicy, SandboxProviderInterface, RunArtifactMapping                                                                 |
| `domainspec-verify-feature`    | verify                                                      | [copilot/skills/domainspec-verify-feature/SKILL.md](../../../../../copilot/skills/domainspec-verify-feature/SKILL.md) (`agent: domainspec-verifier`)            | Verification verdict artifact (`VERIFICATION.md` per work-pack closure obligations) with PASS/FLAG/BLOCK                                      | TEST-SPEC obligation coverage gate and delegated-stage telemetry when orchestrated                                                                                                                              | RunStateMachine, RetryPolicy, RunArtifactMapping                                                                                   |
| `domainspec-signal-observer`   | post-verify governance observer path                        | [copilot/skills/domainspec-signal-observer/SKILL.md](../../../../../copilot/skills/domainspec-signal-observer/SKILL.md) (`agent: domainspec-planner`)           | Append-only rows in `docs/signals/pipeline-signals.jsonl` with `source=async-observer`                                                        | Signal schema conformance in [domainspec/templates/SIGNAL-SCHEMA.md](../../../../../domainspec/templates/SIGNAL-SCHEMA.md)                                                                                      | RunArtifactMapping                                                                                                                 |

## Agent Inventory

| Agent                          | Lifecycle Ownership                                                          | Source File                                                                                                                 | Routed Commands                                              | Expected Artifacts                                                                      | Telemetry Contracts                                                                                                                                                                                                       | Concept Tokens                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `domainspec-orchestrator`      | End-to-end route composition and delegated stage execution                   | [copilot/agents/domainspec-orchestrator.agent.md](../../../../../copilot/agents/domainspec-orchestrator.agent.md)           | `domainspec-orchestrate`                                     | Stage-level route decisions and orchestrated specialist outputs                         | Heartbeat + terminal pairing in [docs/signals/delegation-tuning.jsonl](../../../../signals/delegation-tuning.jsonl); guarded terminal policy via [TERMINAL-GUARD.md](../../../../../../../docs/signals/TERMINAL-GUARD.md) | ExecutionRun, RunStateMachine, RetryPolicy, CancellationPolicy, RunArtifactMapping                             |
| `domainspec-planner`           | Discovery bootstrap and planning authority; also async signal observer agent | [copilot/agents/domainspec-planner.agent.md](../../../../../copilot/agents/domainspec-planner.agent.md)                     | `domainspec-plan-phase-bridge`, `domainspec-signal-observer` | Work-pack baseline artifacts, stage coverage matrix, closure tasks; async observer rows | Delegation telemetry for delegated planning stages; observer append-only policy in `pipeline-signals.jsonl`                                                                                                               | BranchStrategyPolicy, RetryPolicy, CancellationPolicy, RunArtifactMapping                                      |
| `domainspec-context-builder`   | Task-context construction before mutation                                    | [copilot/agents/domainspec-context-builder.agent.md](../../../../../copilot/agents/domainspec-context-builder.agent.md)     | `domainspec-context-builder`                                 | Context markdown + index with selector and obligation bindings                          | Suspected-stuck search guard + telemetry when delegated                                                                                                                                                                   | RunArtifactMapping, ExecutionRun                                                                               |
| `domainspec-spec-writer`       | Spec stage authoring                                                         | [copilot/agents/domainspec-spec-writer.agent.md](../../../../../copilot/agents/domainspec-spec-writer.agent.md)             | `domainspec-spec-feature`                                    | SPEC + aspect docs + story synchronization handoff                                      | Planner-first mutation guard; delegated-stage telemetry when orchestrated                                                                                                                                                 | ExecutionRun, RunStateMachine, BranchStrategyPolicy                                                            |
| `domainspec-test-designer`     | Tests stage derivation                                                       | [copilot/agents/domainspec-test-designer.agent.md](../../../../../copilot/agents/domainspec-test-designer.agent.md)         | `domainspec-generate-tests`                                  | TEST-SPEC and optional test scaffolds                                                   | Planner-first mutation guard; delegated-stage telemetry when orchestrated                                                                                                                                                 | RunStateMachine, RetryPolicy, RunArtifactMapping                                                               |
| `domainspec-implementer`       | Implement stage execution                                                    | [copilot/agents/domainspec-implementer.agent.md](../../../../../copilot/agents/domainspec-implementer.agent.md)             | `domainspec-implement`                                       | Feature code/test updates and task scaffold obligations                                 | Delegation telemetry for audits/context/bridges; bounded retry and de-escalation                                                                                                                                          | ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy, RetryPolicy, CancellationPolicy |
| `domainspec-alignment-auditor` | Audits stage (fidelity)                                                      | [copilot/agents/domainspec-alignment-auditor.agent.md](../../../../../copilot/agents/domainspec-alignment-auditor.agent.md) | `domainspec-audit-alignment`                                 | ALIGNMENT-REPORT and prioritized remediation                                            | Coverage evidence gate under verification policy                                                                                                                                                                          | RunStateMachine, RunArtifactMapping                                                                            |
| `domainspec-layering-auditor`  | Audits stage (layering drift)                                                | [copilot/agents/domainspec-layering-auditor.agent.md](../../../../../copilot/agents/domainspec-layering-auditor.agent.md)   | `domainspec-audit-layering`                                  | LAYERING-ALIGNMENT-REPORT and LAYERING-ALIGNMENT-PLAN                                   | Strict severity policy for unresolved drift                                                                                                                                                                               | BranchStrategyPolicy, SandboxProviderInterface, RunArtifactMapping                                             |
| `domainspec-verifier`          | Verify stage readiness verdict                                               | [copilot/agents/domainspec-verifier.agent.md](../../../../../copilot/agents/domainspec-verifier.agent.md)                   | `domainspec-verify-feature`                                  | PASS/FLAG/BLOCK readiness verdict and required next actions                             | TEST-SPEC obligation coverage enforcement; delegated-stage telemetry when orchestrated                                                                                                                                    | RunStateMachine, RetryPolicy, RunArtifactMapping                                                               |

## Verification Evidence Execution Log

### EV-01 Skill command declarations

Command:

```bash
rg -n "^name:\s+domainspec-(orchestrate|start|context-builder|plan-phase-bridge|spec-feature|generate-tests|implement|audit-alignment|audit-layering|verify-feature|signal-observer|tag-code)$" copilot/skills/**/SKILL.md
```

Output excerpt:

```text
copilot/skills/domainspec-plan-phase-bridge/SKILL.md:2:name: domainspec-plan-phase-bridge
copilot/skills/domainspec-generate-tests/SKILL.md:2:name: domainspec-generate-tests
copilot/skills/domainspec-context-builder/SKILL.md:2:name: domainspec-context-builder
copilot/skills/domainspec-orchestrate/SKILL.md:2:name: domainspec-orchestrate
copilot/skills/domainspec-tag-code/SKILL.md:2:name: domainspec-tag-code
copilot/skills/domainspec-audit-layering/SKILL.md:2:name: domainspec-audit-layering
copilot/skills/domainspec-audit-alignment/SKILL.md:2:name: domainspec-audit-alignment
copilot/skills/domainspec-start/SKILL.md:2:name: domainspec-start
copilot/skills/domainspec-spec-feature/SKILL.md:2:name: domainspec-spec-feature
copilot/skills/domainspec-signal-observer/SKILL.md:2:name: domainspec-signal-observer
copilot/skills/domainspec-verify-feature/SKILL.md:2:name: domainspec-verify-feature
copilot/skills/domainspec-implement/SKILL.md:2:name: domainspec-implement
```

### EV-02 Agent declarations

Command:

```bash
rg -n "^name:\s+domainspec-(orchestrator|planner|context-builder|spec-writer|test-designer|implementer|alignment-auditor|layering-auditor|verifier|story-sync)$" copilot/agents/*.agent.md
```

Output excerpt:

```text
copilot/agents/domainspec-test-designer.agent.md:2:name: domainspec-test-designer
copilot/agents/domainspec-layering-auditor.agent.md:2:name: domainspec-layering-auditor
copilot/agents/domainspec-implementer.agent.md:2:name: domainspec-implementer
copilot/agents/domainspec-verifier.agent.md:2:name: domainspec-verifier
copilot/agents/domainspec-story-sync.agent.md:2:name: domainspec-story-sync
copilot/agents/domainspec-context-builder.agent.md:2:name: domainspec-context-builder
copilot/agents/domainspec-alignment-auditor.agent.md:2:name: domainspec-alignment-auditor
copilot/agents/domainspec-planner.agent.md:2:name: domainspec-planner
copilot/agents/domainspec-orchestrator.agent.md:2:name: domainspec-orchestrator
copilot/agents/domainspec-spec-writer.agent.md:2:name: domainspec-spec-writer
```

### EV-03 Delegation telemetry schema and started/terminal pairing

Command:

```bash
rg -n "stageRunId|suspectedStuck|retryCount|outcome|started|terminal" docs/signals/DELEGATION-TUNING.md docs/signals/delegation-tuning.jsonl
```

Output excerpt:

```text
docs/signals/DELEGATION-TUNING.md:11:- stageRunId
docs/signals/DELEGATION-TUNING.md:18:- outcome (`started`, `completed`, `blocked`, `failed`)
docs/signals/DELEGATION-TUNING.md:19:- suspectedStuck (boolean)
docs/signals/DELEGATION-TUNING.md:20:- retryCount (integer)
docs/signals/DELEGATION-TUNING.md:27:- For every delegated stage, append one `started` row before invocation and one terminal row (`completed|blocked|failed`) after completion, both with the same `stageRunId`.
```

### EV-04 Terminal guard contract

Command:

```bash
rg -n "terminal_guard.sh|run --timeout|nudge|terminal-guard.jsonl|commandHash" ../../docs/signals/TERMINAL-GUARD.md
```

Output excerpt:

```text
../../docs/signals/TERMINAL-GUARD.md:3:`tools/terminal_guard.sh` helps prevent terminal-driven agent stalls
../../docs/signals/TERMINAL-GUARD.md:14:./tools/terminal_guard.sh nudge -- rg -n "stageRunId" docs/signals/delegation-tuning.jsonl
../../docs/signals/TERMINAL-GUARD.md:20:./tools/terminal_guard.sh run --timeout 20 -- rg -n "stageRunId" docs/signals/delegation-tuning.jsonl
../../docs/signals/TERMINAL-GUARD.md:23:- Appends telemetry rows to `docs/signals/terminal-guard.jsonl` by default.
```

### EV-05 Route anchors and decision-lock evidence

Command:

```bash
rg -n "merge-to-head|Sandcastle|latest-run-wins|discovery stage|spec stage|tests stage|implementation stage|audits stage|verify stage" docs/features/agent-execution-orchestrator/{SPEC.md,workflows.md,operations.md,WORK-PACK.md}
```

Output excerpt:

```text
docs/features/agent-execution-orchestrator/workflows.md:23:    B --> C[Step 3: Execute discovery stage]
docs/features/agent-execution-orchestrator/workflows.md:24:    C --> D[Step 4: Execute spec stage]
docs/features/agent-execution-orchestrator/workflows.md:26:    E --> F[Step 6: Execute tests stage]
docs/features/agent-execution-orchestrator/workflows.md:27:    F --> G[Step 7: Execute implementation stage]
docs/features/agent-execution-orchestrator/workflows.md:29:    H --> I[Step 9: Execute audits stage]
docs/features/agent-execution-orchestrator/workflows.md:30:    I --> J[Step 10: Execute verify stage]
docs/features/agent-execution-orchestrator/WORK-PACK.md:98:| D-AEO-001 Branch strategy default | `merge-to-head` |
docs/features/agent-execution-orchestrator/WORK-PACK.md:99:| D-AEO-002 MVP provider baseline | `Sandcastle adapter only` |
docs/features/agent-execution-orchestrator/WORK-PACK.md:101:| D-AEO-004 Superseded-run cancellation model | `latest-run-wins` |
```

### EV-06 Markdown link validation (post-update)

Commands:

```bash
bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/context/route-artifact-prompt-pack.md
bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/context/command-agent-inventory.md
bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/WORK-PACK.md
```

Output:

```text
OK: all markdown links resolve
OK: all markdown links resolve
OK: all markdown links resolve
```

## Coverage Check Against WP-01 Completion Criteria

| Completion Criterion                                               | Coverage | Evidence                                                                                                                                                                                |
| ------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inventory includes relevant orchestration commands and agent roles | pass     | [Command Inventory](#command-inventory), [Agent Inventory](#agent-inventory), [EV-01](#ev-01-skill-command-declarations), [EV-02](#ev-02-agent-declarations)                            |
| Every row maps to at least one feature concept token               | pass     | `Concept Tokens` column populated for each row                                                                                                                                          |
| Command-to-stage mapping is explicit with source anchors           | pass     | [Canonical Lifecycle Route Anchors](#canonical-lifecycle-route-anchors), [EV-05](#ev-05-route-anchors-and-decision-lock-evidence), [EV-06](#ev-06-markdown-link-validation-post-update) |
