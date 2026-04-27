# Implementation Plan Index

This plan is implementation focused.

Core orientation artifacts:

- [VISION.md](VISION.md) - north star and layer model for the implementation program.
- [TRACEABILITY.md](TRACEABILITY.md) - explicit mapping from task -> problem solved -> project contribution -> ADLC alignment.

## Start Here (Initial Organization Workflow Entrypoint)

Use this index as the operational entrypoint for organizing implementation work from day 0.

### Step 1 - Set Context and Ownership

1. Complete [context/CTX-01-context-objective-prioritization.md](context/CTX-01-context-objective-prioritization.md).
2. Complete [context/CTX-03-initiative-vision-tracker.md](context/CTX-03-initiative-vision-tracker.md).
3. Assign owner roles for each active stream: PO, stakeholder, QA, dev, governance owner.

Expected output:

- Active objective set.
- Prioritized initiative list.
- Clear ownership map.

### Step 2 - Establish Runtime and Telemetry Baseline

1. Complete [infra/INF-01-runtime-dispatch-gateway.md](infra/INF-01-runtime-dispatch-gateway.md).
2. Complete [infra/INF-02-agent-telemetry-saturn.md](infra/INF-02-agent-telemetry-saturn.md).
3. Complete [infra/INF-04-infra-security-baseline.md](infra/INF-04-infra-security-baseline.md).

Expected output:

- Unified runtime dispatch.
- Invocation telemetry and cost visibility.
- Security baseline with evidence.

### Step 3 - Enforce Governance by Default (Saturn Critical)

1. Complete [governance/GOV-01-axioms-constitution-tags-execution.md](governance/GOV-01-axioms-constitution-tags-execution.md).
2. Complete [governance/GOV-02-governance-validation-scripts.md](governance/GOV-02-governance-validation-scripts.md).
3. Complete [governance/GOV-03-blocking-gates-policy.md](governance/GOV-03-blocking-gates-policy.md).

Expected output:

- Executable governance chain.
- Automated validation.
- Blocking and escalation policy in operation.

### Step 4 - Close the Saturn Governance Loop

1. Complete [infra/INF-03-ci-governance-loop.md](infra/INF-03-ci-governance-loop.md).
2. Complete [governance/GOV-04-adlc-closure-scorecard.md](governance/GOV-04-adlc-closure-scorecard.md).

Expected output:

- Threshold to suggestion to governance evaluation loop running in CI.
- ADLC implementation closure tracked with explicit status and evidence.

### Step 5 - Activate Agentic Orchestration

1. Complete [agentic/AGT-01-orchestrator-interface.md](agentic/AGT-01-orchestrator-interface.md).
2. Complete [agentic/AGT-02-interviewer-greenfield.md](agentic/AGT-02-interviewer-greenfield.md).
3. Complete [agentic/AGT-03-interviewer-brownfield.md](agentic/AGT-03-interviewer-brownfield.md).
4. Complete [agentic/AGT-07-dynamic-goal-amendment.md](agentic/AGT-07-dynamic-goal-amendment.md).

Expected output:

- Prompt-to-pipeline orchestration path.
- Greenfield and brownfield interviewer flows.
- Dynamic goal amendment with controlled re-derivation.
- Transparent selection of agents and skills per request.

### Step 6 - Launch Harness and Scale

1. Complete [harness/HAR-01-domain-graph-chain-explorer.md](harness/HAR-01-domain-graph-chain-explorer.md).
2. Complete [harness/HAR-02-role-workspace-views.md](harness/HAR-02-role-workspace-views.md).
3. Complete [harness/HAR-03-owner-task-board.md](harness/HAR-03-owner-task-board.md).
4. Complete [harness/HAR-05-org-metrics-dashboard.md](harness/HAR-05-org-metrics-dashboard.md).
5. Complete [agentic/AGT-05-cross-project-skills-repository.md](agentic/AGT-05-cross-project-skills-repository.md).
6. Complete [agentic/AGT-06-agent-skill-mutation-pipeline.md](agentic/AGT-06-agent-skill-mutation-pipeline.md).

Expected output:

- Clickable graph with full relationship and transformation chain visibility.
- Role-specific workflow views and owner-prioritized board.
- Organizational metrics cockpit connected to active objectives.
- Reusable cross-project skill base.
- Controlled mutation and measurable closure progress.

## Scope Rules

- In scope: implementation tasks for productization, infrastructure, harness UX, agent orchestration, and governance automation.
- Out of scope: non-implementation research deliverables.
- Task model: one task per markdown file.

## Prioritization Framework

Use this scoring model to rank tasks every planning cycle:

Priority Score = (impact x 0.30) + (risk_reduction x 0.25) + (dependency_unlock x 0.20) + (time_criticality x 0.15) + (readiness x 0.10)

Kanban objective execution profile (Saturn/ADLC convergence mode):

- For profile `saturn-l-adlc-convergence`, use the CTX-01 operational score defined in [context/CTX-01-prioritization-spec.md](context/CTX-01-prioritization-spec.md).
- This profile disables deadline weighting and prioritizes Saturn impact plus ADLC convergence.
- Explainability notes for current top-10 cycle are published in [context/CTX-01-priority-notes-cycle-001.md](context/CTX-01-priority-notes-cycle-001.md).
- Precedence rule: for day-to-day Kanban ordering under this profile, CTX-01 operational score overrides the generic formula while Saturn critical overrides remain in force.

Dimension scale:

- 1 = low
- 2 = medium
- 3 = high

Task class guide:

- P0: score >= 2.4 or explicitly blocks runtime, governance, or owner workflow.
- P1: score < 2.4 and does not block P0 execution.

Saturn critical override:

- Always execute these before non-blocking work: `INF-02`, `INF-03`, `GOV-01`, `GOV-02`, `GOV-03`, `GOV-04`.
- If a harness or agentic task depends on unresolved Saturn-critical work, keep it in `ready` state until blockers close.

Tie-break rules:

1. Choose the task with higher dependency unlock.
2. If tied, choose the task with lower implementation uncertainty.
3. If tied, choose the task that improves owner decision speed.

## Top 10 Execution Queue (Traceability-Weighted)

Derived from [TRACEABILITY.md](TRACEABILITY.md) using:

Traceability Weight = (2 x number_of_gap_links) + (3 x number_of_adlc_task_links) + (2 if P0) + (5 if Saturn-critical)

Saturn-critical tasks:

- `INF-02`, `INF-03`, `GOV-01`, `GOV-02`, `GOV-03`, `GOV-04`

| Rank | Task | Weight | Why now |
| --- | --- | --- | --- |
| 1 | [infra/INF-03-ci-governance-loop.md](infra/INF-03-ci-governance-loop.md) | 24 | Closes the threshold -> suggestion -> governance evaluation loop and covers T1/T15/T20. |
| 2 | [governance/GOV-01-axioms-constitution-tags-execution.md](governance/GOV-01-axioms-constitution-tags-execution.md) | 22 | Makes the L4 -> L3 -> L6 governance chain executable with direct ADLC gate impact. |
| 3 | [governance/GOV-02-governance-validation-scripts.md](governance/GOV-02-governance-validation-scripts.md) | 22 | Operationalizes validator coverage and blocking enforcement for T1/T9/T20. |
| 4 | [governance/GOV-04-adlc-closure-scorecard.md](governance/GOV-04-adlc-closure-scorecard.md) | 22 | Provides the single closure surface for ADLC status, evidence, and blockers. |
| 5 | [governance/GOV-03-blocking-gates-policy.md](governance/GOV-03-blocking-gates-policy.md) | 20 | Enforces merge-time blocking and escalation behavior for governance safety. |
| 6 | [infra/INF-02-agent-telemetry-saturn.md](infra/INF-02-agent-telemetry-saturn.md) | 15 | Establishes Saturn telemetry and cost visibility required by governance and owner decisions. |
| 7 | [agentic/AGT-06-agent-skill-mutation-pipeline.md](agentic/AGT-06-agent-skill-mutation-pipeline.md) | 14 | Enables controlled agent evolution with governance gates and rollback safety. |
| 8 | [agentic/AGT-01-orchestrator-interface.md](agentic/AGT-01-orchestrator-interface.md) | 12 | Makes orchestration routing transparent and auditable for all intent classes. |
| 9 | [agentic/AGT-05-cross-project-skills-repository.md](agentic/AGT-05-cross-project-skills-repository.md) | 10 | Unlocks reusable cross-project capability packs and reduces skill duplication. |
| 10 | [harness/HAR-05-org-metrics-dashboard.md](harness/HAR-05-org-metrics-dashboard.md) | 9 | Connects role-based metrics directly to active decisions and objective steering. |

Refresh rule:

- Recompute the Top 10 weekly or whenever alignment links in [TRACEABILITY.md](TRACEABILITY.md) are updated.

## Operating Cadence

- Daily: triage blockers and update status for active tasks.
- Weekly: recompute priority scores and reorder top queue.
- Bi-weekly: governance review of blocking trends and policy effectiveness.
- Monthly: closure review against [governance/GOV-04-adlc-closure-scorecard.md](governance/GOV-04-adlc-closure-scorecard.md).

## Status Model

Use a consistent status for every task file:

- backlog
- ready
- in-progress
- blocked
- review
- done

WIP rule:

- Maximum 3 concurrent in-progress tasks per stream (context, infra, harness, agentic, governance).

## Execution Order

1. Context and ownership alignment
2. Saturn L-system foundation (runtime, telemetry, security)
3. Governance enforcement and CI closure loop
4. Agentic orchestration and interviewer activation
5. Harness UX and role adoption
6. Scaling with shared skills and controlled mutation

## Context

| ID | Priority | Task | File |
| --- | --- | --- | --- |
| CTX-01 | P0 | Context-objective prioritization model | [context/CTX-01-context-objective-prioritization.md](context/CTX-01-context-objective-prioritization.md) |
| CTX-02 | P1 | Knowledge mapping tutorial | [context/CTX-02-knowledge-mapping-tutorial.md](context/CTX-02-knowledge-mapping-tutorial.md) |
| CTX-03 | P0 | Initiatives, visions, and execution tracker | [context/CTX-03-initiative-vision-tracker.md](context/CTX-03-initiative-vision-tracker.md) |

## Infra

| ID | Priority | Task | File |
| --- | --- | --- | --- |
| INF-01 | P0 | Runtime dispatch gateway (local/VPS/cloud) | [infra/INF-01-runtime-dispatch-gateway.md](infra/INF-01-runtime-dispatch-gateway.md) |
| INF-02 | P0 | Agent telemetry for Saturn L-system metrics and costs | [infra/INF-02-agent-telemetry-saturn.md](infra/INF-02-agent-telemetry-saturn.md) |
| INF-03 | P0 | CI governance loop (threshold -> suggestion -> evaluation) | [infra/INF-03-ci-governance-loop.md](infra/INF-03-ci-governance-loop.md) |
| INF-04 | P0 | Infrastructure security baseline closure | [infra/INF-04-infra-security-baseline.md](infra/INF-04-infra-security-baseline.md) |

## Harness

| ID | Priority | Task | File |
| --- | --- | --- | --- |
| HAR-01 | P0 | Interactive domain graph and transformation chain | [harness/HAR-01-domain-graph-chain-explorer.md](harness/HAR-01-domain-graph-chain-explorer.md) |
| HAR-02 | P0 | Role-based harness workspaces | [harness/HAR-02-role-workspace-views.md](harness/HAR-02-role-workspace-views.md) |
| HAR-03 | P0 | Project-owner prioritized task board | [harness/HAR-03-owner-task-board.md](harness/HAR-03-owner-task-board.md) |
| HAR-04 | P1 | Frontend prototyping selector with Godel integration | [harness/HAR-04-prototyping-selector-godel.md](harness/HAR-04-prototyping-selector-godel.md) |
| HAR-05 | P0 | Organizational metrics cockpit | [harness/HAR-05-org-metrics-dashboard.md](harness/HAR-05-org-metrics-dashboard.md) |

## Agentic

| ID | Priority | Task | File |
| --- | --- | --- | --- |
| AGT-01 | P0 | Orchestrator interface for prompt-to-pipeline routing | [agentic/AGT-01-orchestrator-interface.md](agentic/AGT-01-orchestrator-interface.md) |
| AGT-02 | P0 | Interviewer flow for greenfield mapping | [agentic/AGT-02-interviewer-greenfield.md](agentic/AGT-02-interviewer-greenfield.md) |
| AGT-03 | P0 | Interviewer flow for brownfield mapping | [agentic/AGT-03-interviewer-brownfield.md](agentic/AGT-03-interviewer-brownfield.md) |
| AGT-04 | P1 | Agent-skill composition matrix | [agentic/AGT-04-agent-skill-composition-matrix.md](agentic/AGT-04-agent-skill-composition-matrix.md) |
| AGT-05 | P1 | Cross-project skills knowledge repository | [agentic/AGT-05-cross-project-skills-repository.md](agentic/AGT-05-cross-project-skills-repository.md) |
| AGT-06 | P1 | Automatic mutation pipeline for agents and skills | [agentic/AGT-06-agent-skill-mutation-pipeline.md](agentic/AGT-06-agent-skill-mutation-pipeline.md) |
| AGT-07 | P0 | Dynamic goal amendment and re-derivation | [agentic/AGT-07-dynamic-goal-amendment.md](agentic/AGT-07-dynamic-goal-amendment.md) |

## Governance

| ID | Priority | Task | File |
| --- | --- | --- | --- |
| GOV-01 | P0 | Axioms, constitution, and tags execution model | [governance/GOV-01-axioms-constitution-tags-execution.md](governance/GOV-01-axioms-constitution-tags-execution.md) |
| GOV-02 | P0 | Governance validation scripts and automation | [governance/GOV-02-governance-validation-scripts.md](governance/GOV-02-governance-validation-scripts.md) |
| GOV-03 | P0 | Blocking gates and escalation policy | [governance/GOV-03-blocking-gates-policy.md](governance/GOV-03-blocking-gates-policy.md) |
| GOV-04 | P0 | ADLC implementation closure scorecard | [governance/GOV-04-adlc-closure-scorecard.md](governance/GOV-04-adlc-closure-scorecard.md) |
| GOV-05 | P1 | Victor material intake and linkage placeholder | [governance/GOV-05-victor-material-intake.md](governance/GOV-05-victor-material-intake.md) |
