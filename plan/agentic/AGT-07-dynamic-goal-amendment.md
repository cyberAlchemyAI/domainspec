# AGT-07 - Dynamic Goal Amendment and Re-Derivation

## Objective

Allow goals to be amended during implementation and re-derive impacted downstream artifacts safely.

## Problem

Current flow treats goals as mostly static, which delays adaptation when business direction changes mid-execution.

## Scope

- In scope:
  - Amendment command and payload contract.
  - Impact analysis on specs, stories, tests, implementation tasks, and governance checks.
  - Controlled re-derivation sequence.
- Out of scope:
  - Unbounded goal churn without governance approval.

## Dependencies

- [AGT-01-orchestrator-interface.md](AGT-01-orchestrator-interface.md)
- [../governance/GOV-03-blocking-gates-policy.md](../governance/GOV-03-blocking-gates-policy.md)
- [../context/CTX-01-context-objective-prioritization.md](../context/CTX-01-context-objective-prioritization.md)

## Implementation Tasks

1. Define amendment request schema with objective linkage.
2. Define impact analyzer for affected artifacts and checks.
3. Define re-derivation order and rollback points.
4. Add approval policy for high-impact amendments.
5. Add amendment audit log and traceability references.

## Deliverables

- Dynamic amendment command contract.
- Impact analysis model.
- Re-derivation and rollback workflow.
- Governance approval and audit policy.

## Done Criteria

- [ ] Goal amendment can be requested with explicit rationale and scope.
- [ ] Impacted artifacts are re-derived deterministically.
- [ ] High-impact amendments require explicit governance approval.
- [ ] Amendment history is queryable and auditable.
