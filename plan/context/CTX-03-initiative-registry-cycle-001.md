# CTX-03 Initiative Registry - Cycle 001

## Purpose

Track active initiatives with ownership, status, target metrics, linked tasks, and evidence.

## Active Initiatives

| Initiative ID        | Owner Role       | Status | Last Evidence Update | Review SLA Days | Target Metrics                                                                         | Linked Tasks                                   | Evidence Links                                                                                                                                                                                                             |
| -------------------- | ---------------- | ------ | -------------------- | --------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I-CONTEXT-FOUNDATION | po               | active | 2026-04-29           | 14              | Priority rationale coverage, queue reorder latency, ownership traceability             | CTX-01, CTX-02, CTX-03                         | [CTX-01-priority-notes-cycle-001.md](CTX-01-priority-notes-cycle-001.md), [CTX-03-initiative-tracker-spec.md](CTX-03-initiative-tracker-spec.md)                                                                           |
| I-SATURN-FOUNDATION  | dev              | active | 2026-04-29           | 14              | Invocation telemetry completeness, CI governance loop coverage, closure signal quality | INF-02, INF-03, GOV-01, GOV-02, GOV-03, GOV-04 | [../infra/INF-02-agent-telemetry-saturn.md](../infra/INF-02-agent-telemetry-saturn.md), [../infra/INF-03-ci-governance-loop.md](../infra/INF-03-ci-governance-loop.md)                                                     |
| I-AGENTIC-EXECUTION  | dev              | active | 2026-04-29           | 14              | Route transparency, decision trace coverage, amendment safety                          | AGT-01, AGT-02, AGT-03, AGT-07                 | [../agentic/AGT-01-orchestrator-interface.md](../agentic/AGT-01-orchestrator-interface.md), [../agentic/AGT-07-dynamic-goal-amendment.md](../agentic/AGT-07-dynamic-goal-amendment.md)                                     |
| I-HARNESS-ADOPTION   | po               | active | 2026-04-29           | 14              | Role-view adoption, priority explainability, decision-coupled metrics                  | HAR-01, HAR-02, HAR-03, HAR-05                 | [../harness/HAR-03-owner-task-board.md](../harness/HAR-03-owner-task-board.md), [../harness/HAR-05-org-metrics-dashboard.md](../harness/HAR-05-org-metrics-dashboard.md)                                                   |
| I-GOVERNANCE-CLOSURE | governance-owner | active | 2026-04-29           | 14              | Rule-to-gate traceability, validator pass coverage, blocker closure throughput         | GOV-01, GOV-02, GOV-03, GOV-04, GOV-05         | [../governance/GOV-01-axioms-constitution-tags-execution.md](../governance/GOV-01-axioms-constitution-tags-execution.md), [../governance/GOV-04-adlc-closure-scorecard.md](../governance/GOV-04-adlc-closure-scorecard.md) |

## Vision -> Initiative -> Output Chain

| Vision ID                    | Initiative ID        | Output Surface                                              |
| ---------------------------- | -------------------- | ----------------------------------------------------------- |
| V-CONTEXT-ALIGNMENT          | I-CONTEXT-FOUNDATION | Prioritized objective queue + explainability notes          |
| V-SATURN-CONTROL             | I-SATURN-FOUNDATION  | Telemetry + CI governance loop + closure scorecard          |
| V-ORCHESTRATION-TRANSPARENCY | I-AGENTIC-EXECUTION  | Prompt routing trace + interviewer outputs + amendment flow |
| V-HARNESS-USABILITY          | I-HARNESS-ADOPTION   | Role views + owner board + metrics cockpit                  |
| V-GOVERNANCE-EXECUTION       | I-GOVERNANCE-CLOSURE | Executable rule chain + validation + blocker policy         |

## Automated Stale-Detection Evidence

- Command: `bash tools/check_initiative_stale.sh plan/context/CTX-03-initiative-registry-cycle-001.md`
- Output: [CTX-03-stale-report-cycle-001.md](CTX-03-stale-report-cycle-001.md)
