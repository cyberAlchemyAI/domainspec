# CTX-03 Initiative Tracker Specification

## Purpose

Define the canonical tracker schema, status lifecycle, and relationship model for implementation initiatives.

## Initiative Schema

| Field                  | Type    | Required | Description                                                   |
| ---------------------- | ------- | -------- | ------------------------------------------------------------- |
| initiative_id          | string  | yes      | Stable identifier (for example `I-SATURN-FOUNDATION`).        |
| initiative_name        | string  | yes      | Initiative title.                                             |
| vision_id              | string  | yes      | Upstream vision identifier.                                   |
| owner_role             | enum    | yes      | `po`, `stakeholder`, `qa`, `dev`, `governance-owner`.         |
| status                 | enum    | yes      | `backlog`, `active`, `blocked`, `review`, `done`, `archived`. |
| governance_constraints | list    | yes      | Rules and gates constraining implementation.                  |
| target_metrics         | list    | yes      | Metrics used to evaluate progress.                            |
| linked_tasks           | list    | yes      | Linked plan task IDs and file references.                     |
| evidence_links         | list    | yes      | Supporting outputs, reports, or validation evidence.          |
| last_evidence_update   | date    | yes      | Last evidence update in `YYYY-MM-DD`.                         |
| review_sla_days        | integer | yes      | Maximum days allowed without evidence update.                 |

## Status Lifecycle Policy

| Status   | Entry condition                                         | Exit condition                             |
| -------- | ------------------------------------------------------- | ------------------------------------------ |
| backlog  | Initiative defined but not activated                    | Moved to `active` when execution starts    |
| active   | Execution and evidence updates are ongoing              | Move to `review`, `blocked`, or `done`     |
| blocked  | Dependency or governance blocker prevents progress      | Blocker resolved then return to `active`   |
| review   | Work complete and pending governance/owner verification | Verified to `done` or returned to `active` |
| done     | Exit criteria verified with evidence                    | May move to `archived`                     |
| archived | Initiative closed and frozen                            | No exit                                    |

## Relationship Model

Primary chain:

`vision_id -> initiative_id -> linked_tasks -> evidence_links -> delivered_output`

Relationship requirements:

- Every active initiative must link to at least one task.
- Every active initiative must link to at least one evidence artifact.
- Every evidence artifact must map to a task or governance decision.

## Owner-Role Assignment Contract

Owner-role assignments are maintained in:

- [CTX-03-owner-role-assignment-cycle-001.md](CTX-03-owner-role-assignment-cycle-001.md)

Rule:

- each active stream must have one accountable role assignment.

## Review and Stale Detection Contract

Review protocol and stale policy are maintained in:

- [CTX-03-review-cadence-protocol.md](CTX-03-review-cadence-protocol.md)

Automated stale detection script:

- `tools/check_initiative_stale.sh`

Current scan output:

- [CTX-03-stale-report-cycle-001.md](CTX-03-stale-report-cycle-001.md)
