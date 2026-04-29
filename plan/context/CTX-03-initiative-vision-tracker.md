# CTX-03 - Initiatives, Visions, and Execution Tracker

## Objective

Track implementation initiatives, visions, and active workstreams with status, ownership, and evidence links.

## Problem

Execution context is fragmented across docs and pipelines, making it hard to see what is being pursued and why.

## Scope

- In scope:
  - Tracker model for initiative, vision, and execution item.
  - Status lifecycle and ownership fields.
  - Evidence links to decisions, tasks, metrics, and code outputs.
- Out of scope:
  - Research registry maintenance.
  - Paper submission tracking.

## Dependencies

- [../harness/HAR-03-owner-task-board.md](../harness/HAR-03-owner-task-board.md)
- [../harness/HAR-05-org-metrics-dashboard.md](../harness/HAR-05-org-metrics-dashboard.md)

## Execution Session Decisions (2026-04-29)

1. Tracker representation: markdown-first tracker package with explicit schema + cycle registry.
2. Ownership mapping model: role-accountability assignments by stream (role-first, person-agnostic at this stage).
3. Stale detection model: rule-based automatic stale scan from tracker data using a deterministic script.
4. Evidence chain model: explicit Vision -> Initiative -> Output linkage table with document references.

Trade-off summary:

- Markdown-first artifacts keep review and governance traceability high, with lower setup cost than database-backed tracking.
- Role-first ownership closes immediate Step 1 accountability requirements while deferring named assignee resolution.
- Scripted stale detection adds objective flagging with minimal runtime coupling, at the cost of periodic command execution.

## Gate Handling Outcome

- Gate verdict for this session: PASS.
- Dependency interpretation: HAR-03 and HAR-05 remain integration dependencies for runtime harness behavior, not blockers for defining CTX-03 tracking contracts and governance-ready tracker artifacts.
- Follow-up rule: when harness integration begins, consume CTX-03 schema and registry artifacts as input contracts.

## Implementation Tasks

1. Define initiative schema and status lifecycle.
2. Add fields for owner role, target outcomes, and governance constraints.
3. Add relationship mapping between initiative and implementation tasks.
4. Add evidence links for decisions, telemetry snapshots, and delivered outputs.
5. Add a periodic review process for stale initiatives.

## Deliverables

- Initiative tracker schema and lifecycle policy: [CTX-03-initiative-tracker-spec.md](CTX-03-initiative-tracker-spec.md)
- Initiative registry for active cycle: [CTX-03-initiative-registry-cycle-001.md](CTX-03-initiative-registry-cycle-001.md)
- Owner role assignment map: [CTX-03-owner-role-assignment-cycle-001.md](CTX-03-owner-role-assignment-cycle-001.md)
- Review cadence protocol: [CTX-03-review-cadence-protocol.md](CTX-03-review-cadence-protocol.md)
- Automated stale-detection report: [CTX-03-stale-report-cycle-001.md](CTX-03-stale-report-cycle-001.md)

## Done Criteria

- [x] Every active initiative has owner, status, target metrics, and linked tasks.
- [x] Stale initiatives are detected and flagged automatically.
- [x] Owner can inspect vision -> initiative -> output chain without manual aggregation.
