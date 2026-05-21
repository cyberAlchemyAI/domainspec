# TASK-UPS-WP-06-PROOF-GATE - L2 Proof Promotion Enforcement

## Goal

Implement proof obligation evaluation and self-improvement deferral gates so unsafe generation-rule promotion remains blocked.

## Wave Assignment

- Primary wave: W5
- Layer: L2 governance/reliability hardening

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                 |
| ------------------------------------ | ------------------------------------------------------------ |
| [domain.md](../../domain.md)         | ProofObligation, ProofStatus, RulePromotionRequest           |
| [operations.md](../../operations.md) | EvaluateProofGate, PromoteEvolutionRule                      |
| [workflows.md](../../workflows.md)   | GodelProofGatePolicy, GodelDarwinEvolutionWorkflow           |
| [states.md](../../states.md)         | EvolutionCycleState, EC4, EC5                                |
| [queries.md](../../queries.md)       | ListRulePromotionRequests                                    |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | UPS-CON-012, UPS-ST-011, UPS-OP-012, UPS-OP-013, UPS-API-015 |

## Architecture References

- [ARCHITECTURE.md](../../ARCHITECTURE.md#evolution-engine)
- [ARCHITECTURE.md](../../ARCHITECTURE.md#decision-flow-view)
- [EVOLUTION-ARCHITECTURE.md](../../EVOLUTION-ARCHITECTURE.md#gate-rules)
- [EVOLUTION-ARCHITECTURE.md](../../EVOLUTION-ARCHITECTURE.md#failure-semantics)
- [IMPLEMENTATION-LAYERING.md](../../IMPLEMENTATION-LAYERING.md#layer-definitions)
- [Dependency rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)

## Implementation Directives

- Implement `EvaluateProofGate` as deterministic pass/flag/block evaluation.
- Treat missing evidence as `block`.
- Keep MVP generation-rule promotion deferred/rejected.
- Reject `system:auto` for promotion paths and preserve the existing apply actor guard.
- Preserve existing `ApplyApprovedBatch` manual approval semantics.

## Completion Criteria

- Proof obligations can be evaluated as `pass`, `flag`, or `block`.
- Any blocker obligation blocks promotion.
- Missing evidence blocks by default.
- MVP rule-promotion attempts return deferred/rejected status without mutating generation rules.

## Verification Evidence

- Proof gate unit/contract tests for pass, flag, block.
- Negative tests for missing evidence and auto-promotion.
- Regression tests for manual apply gate.

## Gaps and Questions

- L3 rule-promotion registry and rollback design remain deferred.

## Decision Lock

| Decision ID | Required | Status   | Note                                                |
| ----------- | -------- | -------- | --------------------------------------------------- |
| D-009       | yes      | selected | Self-improvement requires proof and is MVP-deferred |
| O-005       | no       | open     | Promotable rule types remain unresolved for L2      |
