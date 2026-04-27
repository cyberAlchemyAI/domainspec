# AGT-06 - Automatic Mutation Pipeline for Agents and Skills

## Objective

Implement automatic mutation for agent and skill definitions with governance verification before adoption.

## Problem

Manual evolution of agents and skills is slow and inconsistent, while ungoverned mutation can degrade behavior.

## Scope

- In scope:
  - Mutation proposal generation.
  - Safety and governance checks.
  - Adoption workflow and rollback policy.
- Out of scope:
  - Unreviewed direct mutation in production.

## Dependencies

- [../governance/GOV-02-governance-validation-scripts.md](../governance/GOV-02-governance-validation-scripts.md)
- [../governance/GOV-03-blocking-gates-policy.md](../governance/GOV-03-blocking-gates-policy.md)

## Implementation Tasks

1. Define mutation candidate generation strategy.
2. Define mutation test and governance gate sequence.
3. Add evaluation scorecard for mutation impact.
4. Add approval workflow with rollback checkpoint.
5. Add mutation audit trail and retention policy.

## Deliverables

- Mutation pipeline specification.
- Gate sequence definitions.
- Mutation evaluation scorecard.
- Audit trail format.

## Done Criteria

- [ ] Mutation candidates are generated automatically.
- [ ] No mutation can be adopted without passing governance gates.
- [ ] Regressions can be rolled back with full traceability.
