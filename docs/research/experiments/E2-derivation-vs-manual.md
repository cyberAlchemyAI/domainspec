# E2: Derivation vs Manual Coverage

**Status:** not started
**Paper Claim:** C2 — derived tests ≥ manual tests
**Paper Section:** §5.2–5.3 (Test Rules, Cardinality)
**Priority:** P0 | **Effort:** Medium

---

**Claim:** Deterministic derivation produces test coverage ≥ manually authored tests, with higher traceability.

## Protocol

1. For each of the 7 features, have a human tester independently write a test plan from the same spec docs (without seeing derived tests). Time-box at 30 min per feature.
2. Compare derived test set (D) vs manual test set (M) on:
   - **Count:** |D| vs |M|
   - **Coverage overlap:** |D ∩ M| / |D ∪ M|
   - **Unique to derivation:** D \ M (what derivation catches that humans miss)
   - **Unique to manual:** M \ D (what humans catch that derivation misses)
   - **Traceability:** % of tests traceable to a specific spec line

## Data Collected

| Column                  | Type     | Description                       |
| ----------------------- | -------- | --------------------------------- |
| `feature_id`            | string   |                                   |
| `derived_count`         | int      | \|D\|                             |
| `manual_count`          | int      | \|M\|                             |
| `overlap_count`         | int      | \|D ∩ M\|                         |
| `derived_unique`        | string[] | Tests in D but not M, categorized |
| `manual_unique`         | string[] | Tests in M but not D, categorized |
| `derived_traceable_pct` | float    | % of D with spec line reference   |
| `manual_traceable_pct`  | float    | % of M with spec line reference   |
| `human_time_minutes`    | int      | Time spent on manual plan         |

## Success Criteria

- |D| ≥ |M| for ≥ 6/7 features.
- `derived_traceable_pct` > 95%.
- `manual_traceable_pct` < 80% (hypothesis: humans rarely write traceability links).
- D \ M reveals at least 1 non-trivial test category per feature (e.g., negative state transitions, idempotency checks).
