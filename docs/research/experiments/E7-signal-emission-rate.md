# E7: Signal Emission Rate Tracking

**Status:** not started
**Paper Claim:** C3/C4 — empirical attenuation measurement
**Paper Section:** §6.5 (Empirical Evidence)
**Priority:** P0 | **Effort:** Low

---

**Claim:** Governance attenuation manifests as signal loss, measurable over pipeline runs.

## Protocol

1. For every pipeline session going forward, instrument the session to record:
   - Feature worked on
   - Pipeline stages executed
   - Expected signals (based on stage count and feature complexity)
   - Actual signals emitted
   - Signal types emitted vs expected
2. After every 5 sessions, compute rolling averages.
3. Run this continuously as the project evolves — this is a longitudinal study.

## Data Collected (per session)

| Column                  | Type                | Description                                                 |
| ----------------------- | ------------------- | ----------------------------------------------------------- |
| `session_id`            | string              |                                                             |
| `timestamp`             | ISO 8601            |                                                             |
| `feature_id`            | string              |                                                             |
| `stages_executed`       | string[]            | Which pipeline stages ran                                   |
| `expected_signal_count` | int                 | Based on heuristic: 1 per stage + 1 per alignment gap found |
| `actual_signal_count`   | int                 |                                                             |
| `emission_rate`         | float               | actual / expected                                           |
| `signal_types_expected` | string[]            |                                                             |
| `signal_types_emitted`  | string[]            |                                                             |
| `missed_types`          | string[]            | Expected but not emitted                                    |
| `agent_mode`            | unified / separated | Whether observer was separate                               |

## Success Criteria

- Accumulate ≥ 30 session data points.
- Show statistically significant emission rate difference between unified and separated modes (if E5 runs concurrently).
- Identify which signal types have the lowest emission rates (hypothesis: governance-gap is worst).

## Automation

Add to every pipeline session epilogue:

```jsonl
{"experiment":"E7","session_id":"...","emission_rate":0.XX,...}
```
