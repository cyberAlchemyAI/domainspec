# Harness Product Overview

## One-Line Positioning

Harness is the human execution surface for DomainSpec: a role-aware system that turns complex domain logic, governance rules, and agent outputs into clear decisions and coordinated action.

## What Problem Harness Solves

Teams building agentic systems often fail at execution because:

- Domain knowledge is fragmented across docs, code, and people.
- Different roles (product, engineering, QA, governance) see different truths.
- Priorities are hard to justify when objectives and telemetry are disconnected.
- Governance signals arrive too late to prevent bad merges and costly drift.

Harness solves this by giving everyone one shared operational map, one decision queue, and one context-aware control surface.

## Who It Is For

- Project owners who need objective-based prioritization and fast trade-off decisions.
- Engineering and QA teams who need traceable workflow and domain behavior visibility.
- Governance owners who need early signals and enforceable quality boundaries.
- Stakeholders who need confidence that execution aligns with strategy.

## Product Vision

Harness is Layer 3 of the implementation vision: the human interface where complex execution becomes understandable, collaborative, and governable.

It is designed to work with:

- Layer 2 Runtime/Telemetry foundations (INF-01, INF-02, INF-03).
- Layer 4 Agentic orchestration (AGT-01 and related flows).
- Layer 5 Governance controls (GOV-01..GOV-04).

## Core Capabilities

### 1) Interactive Domain Graph and Transformation Chain (HAR-01)

- Click any domain object and trace inbound and outbound relationships.
- Visualize how objects transform across operations, events, and states.
- Share deep links for investigation and collaboration.

Value:

- Dramatically reduces interpretation gaps and onboarding time.

### 2) Role-Based Workspace Views (HAR-02)

- Tailored views for PO, stakeholder, QA, and developer.
- Shared source of truth with role-specific controls and detail levels.
- Explicit handoff markers and cross-role collaboration points.

Value:

- Preserves alignment while improving role efficiency.

### 3) Owner-Prioritized Task Board (HAR-03)

- Dynamic queue linked to active objectives and governance constraints.
- Task rationale and trade-offs visible on each top item.
- Reprioritization controls with traceable history.

Value:

- Converts strategy into daily execution with transparent prioritization.

### 4) Organizational Metrics Cockpit (HAR-05)

- Role-specific metrics tied to objective and initiative context.
- Decision indicators connected directly to task board priorities.
- Drift alerts and governance-ready exports.

Value:

- Turns telemetry into action instead of passive dashboards.

### 5) Prototyping Selector with Godel Integration (HAR-04)

- Compare display strategies without rewriting core workflow logic.
- Preview alternatives side-by-side.
- Persist strategy per project context with compatibility checks.

Value:

- Speeds interface experimentation while keeping behavior integrity.

## End-to-End User Workflow

1. Open a domain object in the graph and inspect its transformation chain.
2. Switch to role-specific workspace lens for current task context.
3. Review top priorities and rationale in the owner task board.
4. Validate current signals in the metrics cockpit before decision.
5. Execute or re-prioritize with explicit trade-off and audit trace.

## Why This Is Different

- Not just a graph viewer: it is execution-linked and role-aware.
- Not just a backlog board: priorities are objective and governance grounded.
- Not just a dashboard: metrics are decision-coupled and workflow-native.
- Not just an agent shell: human and agent workflows share one operational context.

## Business Impact (Expected)

- Faster onboarding and less interpretation friction.
- Shorter time from objective change to queue adaptation.
- Better decision quality through explicit trade-off visibility.
- Fewer late governance surprises and lower rework cost.
- Stronger ADLC convergence through traceable execution signals.

## Rollout Strategy

### Foundation Prerequisites

- Runtime and telemetry baseline active (INF-01, INF-02).
- Governance loop and blocking policy active (INF-03, GOV-03).

### MVP

- HAR-01 + HAR-02 + HAR-03
- Goal: establish shared domain visibility and objective-driven execution.

### Expansion

- HAR-05 metrics cockpit
- Goal: close decision loop with role-context telemetry.

### Optimization

- HAR-04 prototyping selector
- Goal: accelerate UI strategy exploration and fit-to-workflow outcomes.

## Success Metrics

- Time to trace a concept end-to-end.
- Time to explain top-priority ranking rationale.
- Queue reorder latency after objective or signal change.
- Governance issues detected pre-merge vs post-merge.
- Cross-role handoff clarity and rework rate.

## Pitch Summary (Short)

Harness is the operational cockpit for DomainSpec execution. It unifies graph-level domain understanding, role-aware collaboration, objective-prioritized decision flow, and governance-linked telemetry in one interface. The result is faster alignment, better decisions, and safer execution at scale.
