---
stage: S8-distill-repair
capability: distill
mode: validate
status: flag
updatedAt: 2026-06-08
---

# S8 Distill Repair

## Validation Finding

The design is coherent, but one execution surface is imperfect:

```text
tools/arcanum --resolve context-builder -> pass
tools/arcanum --resolve distill -> pass
tools/arcanum --resolve invoke -> unknown command
tools/arcanum --resolve interrogation -> unknown command
tools/arcanum --resolve refine -> unknown command
```

The current Codex native skill surface has the missing skills available, but
the repository-local deterministic command surface does not resolve all stage
capability IDs.

## Repair

Record this as a runtime-surface gap, not a conceptual blocker:

- stage artifacts may be produced through the current native skill surface,
- future execution tasks should not claim repo-local command completeness until
  `tools/arcanum --resolve` can see `invoke`, `interrogation`, and `refine`, or
  the dispatch explicitly records native-skill resolution outside the command
  surface.

## Plan Constraint Added

Add a first implementation task that checks/normalizes the DomainSpec-local
Inventory capability surface before relying on command resolution as proof.

## Verdict

Flag. The plan remains usable, but execution readiness must include runtime
surface normalization.

