# E3: Mutation Testing Effectiveness

**Status:** not started
**Paper Claim:** C2 — derived tests catch real faults
**Paper Section:** §9.5 (Threats — construct validity)
**Priority:** P0 | **Effort:** Medium

---

**Claim:** Derived tests have meaningful fault-detection capability, not just high count.

## Protocol

1. For each feature's backend domain code, run a mutation testing tool (Stryker for TypeScript).
2. Measure mutation score (killed / total mutants) for:
   - (a) Derived test suite only
   - (b) Current manually-written test suite only (existing tests in repo)
   - (c) Combined suite
3. Classify surviving mutants by category: trivial (cosmetic/logging), moderate (edge case), critical (business rule violation).

## Data Collected

| Column                    | Type   | Description                                |
| ------------------------- | ------ | ------------------------------------------ |
| `feature_id`              | string |                                            |
| `total_mutants`           | int    | Total mutations generated                  |
| `killed_by_derived`       | int    | Mutants killed by derived tests            |
| `killed_by_manual`        | int    | Mutants killed by existing tests           |
| `killed_by_combined`      | int    | Mutants killed by both                     |
| `mutation_score_derived`  | float  | killed_by_derived / total_mutants          |
| `mutation_score_manual`   | float  | killed_by_manual / total_mutants           |
| `mutation_score_combined` | float  |                                            |
| `survivors_critical`      | int    | Surviving mutants affecting business rules |
| `survivors_moderate`      | int    |                                            |
| `survivors_trivial`       | int    |                                            |

## Success Criteria

- `mutation_score_derived` ≥ 70% for all features.
- `mutation_score_derived` ≥ `mutation_score_manual` for ≥ 5/7 features.
- `survivors_critical` = 0 for derived tests (all business rule mutants are caught).
