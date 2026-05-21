# TASK-UPS-WP-07-PROMOTION - L3 Governed Self-Improvement Pilot

## Goal

Pilot generation-rule promotion only after proof pass, owner approval, lineage evidence, and rollback evidence exist.

## Wave Assignment

- Primary wave: W6
- Layer: L3 scale/pilot

## Status

deferred

## DomainSpec Coverage

| Source                                                         | Coverage IDs                       |
| -------------------------------------------------------------- | ---------------------------------- |
| [DECISIONS.md](../../DECISIONS.md)                             | O-004, O-005                       |
| [operations.md](../../operations.md)                           | PromoteEvolutionRule               |
| [workflows.md](../../workflows.md)                             | GodelProofGatePolicy               |
| [IMPLEMENTATION-LAYERING.md](../../IMPLEMENTATION-LAYERING.md) | L3 governed self-improvement pilot |

## Architecture References

- [ARCHITECTURE.md](../../ARCHITECTURE.md#decision-flow-view)
- [IMPLEMENTATION-LAYERING.md](../../IMPLEMENTATION-LAYERING.md#layer-definitions)

## Implementation Directives

- Do not start this task until UPS-WP-06-PROOF-GATE passes.
- Require explicit owner approval before any rule promotion.
- Define rollback before promotion.
- Use one narrow pilot rule type; do not enable autonomous multi-cycle execution.

## Completion Criteria

- Promotable rule type is explicitly selected.
- Proof pass evidence exists.
- Owner approval is captured.
- Rollback evidence exists.
- Pilot report documents outcome and residual risk.

## Verification Evidence

- Pilot report.
- Proof pass record.
- Rollback verification.
- Owner approval record.

## Gaps and Questions

- O-004 fitness scoring model must be resolved before weighted promotion.
- O-005 promotable generation-rule types must be resolved before pilot.

## Decision Lock

| Decision ID | Required         | Status   | Note                                          |
| ----------- | ---------------- | -------- | --------------------------------------------- |
| D-009       | yes              | selected | Promotion is proof-gated                      |
| O-004       | yes-before-start | open     | Fitness scoring must be selected or ruled out |
| O-005       | yes-before-start | open     | Promotable rule type must be selected         |
