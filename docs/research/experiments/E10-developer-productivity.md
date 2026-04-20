# E10: Developer Productivity Comparison

**Status:** not started
**Paper Claim:** §9.4(d) — DomainSpec vs freeform
**Paper Section:** §9.4(d) (Controlled Experiments)
**Priority:** P2 | **Effort:** High

---

**Claim:** DomainSpec improves developer productivity for spec-governed agent-assisted development.

## Protocol

1. Recruit 4 developers (2 familiar with DomainSpec, 2 not).
2. Each developer implements the same new feature twice:
   - **Condition A (DomainSpec):** Use DomainSpec pipeline (spec → derive → implement → verify).
   - **Condition B (Freeform):** Use LLM agents with no DomainSpec structure (just a natural language description and direct coding).
3. Counterbalance: half do A-then-B, half do B-then-A, on different features.
4. Measure time, defect rate, test coverage, and spec-implementation alignment.

## Data Collected

| Column                     | Type       | Description                              |
| -------------------------- | ---------- | ---------------------------------------- |
| `developer_id`             | string     | Anonymized                               |
| `domainspec_familiarity`   | low / high |                                          |
| `condition`                | A / B      |                                          |
| `feature`                  | string     |                                          |
| `time_to_complete_minutes` | int        |                                          |
| `tests_written`            | int        |                                          |
| `test_coverage_pct`        | float      | Line coverage                            |
| `defects_found_in_review`  | int        | Post-implementation review               |
| `alignment_score`          | float      | Spec-to-code alignment audit score (0–1) |
| `rework_events`            | int        | How many times code was revised          |
| `satisfaction_score`       | int        | 1–5 developer self-report                |

## Success Criteria

- Condition A produces higher alignment scores (> 0.8 vs < 0.6 for B).
- Condition A produces more tests per feature.
- Time for Condition A is ≤ 1.5× Condition B (DomainSpec is not significantly slower despite more structure).
- Defects in review are lower for Condition A.
