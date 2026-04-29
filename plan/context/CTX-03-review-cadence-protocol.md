# CTX-03 Review Cadence Protocol

## Purpose

Define review cadence, stale-detection policy, and escalation actions for initiative tracking.

## Cadence

- Weekly: refresh initiative status, target metrics, and evidence links.
- Event-driven: refresh immediately when blocker state, governance gate state, or objective profile changes.

## Stale-Detection Rule

An initiative is flagged stale when all conditions hold:

1. `status` is not `done` and not `archived`.
2. `today - last_evidence_update > review_sla_days`.

Detection command:

- `bash tools/check_initiative_stale.sh plan/context/CTX-03-initiative-registry-cycle-001.md`

Generated output:

- [CTX-03-stale-report-cycle-001.md](CTX-03-stale-report-cycle-001.md)

## Escalation Actions

| Condition                   | Required action                                                       | Owner                   |
| --------------------------- | --------------------------------------------------------------------- | ----------------------- |
| Stale flag = yes            | Move initiative status to `blocked` or `review`, add remediation task | initiative owner role   |
| Two consecutive stale scans | Escalate to governance-owner for sequencing decision                  | governance-owner        |
| Stale + unresolved blocker  | Trigger dependency-first unblock sequencing                           | stream accountable role |

## Audit Notes

- Stale scan output is evidence and should be retained per cycle.
- Any manual override must include rationale in the next stale report.
