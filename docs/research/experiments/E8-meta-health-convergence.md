# E8: Meta-Health Convergence

**Status:** not started
**Paper Claim:** C4 — M-001 orphan rate trends toward 0
**Paper Section:** §3.4 (Meta-Circular Self-Governance)
**Priority:** P1 | **Effort:** Low

---

**Claim:** The meta-circular governance system (M-001–M-006) converges toward healthy values over time.

## Protocol

1. After every 5 pipeline sessions, run `tools/generate-meta-health.ts` and record all 6 metrics.
2. Track the time series of each metric over ≥ 20 measurement points.
3. Test for convergence: is M-001 (orphan rate) trending down? Is M-005 (governance ratio) trending up?

## Data Collected

| Column                   | Type     | Description                                 |
| ------------------------ | -------- | ------------------------------------------- |
| `measurement_id`         | int      | Sequential                                  |
| `timestamp`              | ISO 8601 |                                             |
| `sessions_since_last`    | int      | Pipeline sessions between measurements      |
| `m001_orphan_rate`       | float    | 0–1                                         |
| `m002_friction_rate`     | float    | 0–1                                         |
| `m003_time_to_alignment` | float    | Hours (when available)                      |
| `m004_l4_volatility`     | int      | Commits touching axioms/constitution in 30d |
| `m005_governance_ratio`  | float    | 0–1                                         |
| `m006_overhead_ratio`    | float    | 0–1                                         |
| `concepts_total`         | int      | Total registry concepts                     |
| `concepts_anchored`      | int      | Concepts with code binding                  |

## Success Criteria

- M-001 orphan rate decreases from 100% (current) to < 30% within 20 measurement points.
- M-005 governance ratio increases monotonically (with possible plateaus).
- M-006 overhead ratio stabilizes below 0.5 (governance doesn't dominate domain work).
- At least one self-correction cycle observed: metric degrades → signal emitted → tuning applied → metric recovers.
