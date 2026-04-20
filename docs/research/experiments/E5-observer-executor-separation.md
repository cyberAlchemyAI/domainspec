# E5: Observer-Executor Separation Impact

**Status:** not started
**Paper Claim:** C3 — intervention restores fidelity
**Paper Section:** §6.6 (Structural Interventions)
**Priority:** P1 | **Effort:** Medium

---

**Claim:** Splitting observation from execution restores governance fidelity.

## Protocol

1. **Control group (unified):** Run 10 pipeline sessions where the executor agent also emits signals (current behavior).
2. **Treatment group (separated):** Run 10 pipeline sessions with the same executor but add a separate observer agent that reads session output and produces signals independently.
3. For both groups, measure:
   - Signal emission rate = (signals emitted) / (signals expected based on session activity)
   - Signal accuracy = (accurate signals) / (signals emitted), judged by human review
   - Governance gap detection rate = (gaps detected) / (gaps present), with ground truth from human audit

## Data Collected

| Column                     | Type                | Description                             |
| -------------------------- | ------------------- | --------------------------------------- |
| `group`                    | unified / separated |                                         |
| `session_id`               | string              |                                         |
| `signals_expected`         | int                 | Human-assessed expected signal count    |
| `signals_emitted`          | int                 | Actually emitted                        |
| `signals_accurate`         | int                 | Correctly describe real issues          |
| `signals_false_positive`   | int                 | Describe non-issues                     |
| `governance_gaps_present`  | int                 | Human-identified ground truth           |
| `governance_gaps_detected` | int                 | Detected by signal system               |
| `executor_context_tokens`  | int                 | Token usage by executor                 |
| `observer_context_tokens`  | int                 | Token usage by observer (0 for unified) |
| `total_cost`               | float               | Combined API cost                       |

## Success Criteria

- Separated group signal emission rate ≥ 2× unified group.
- Separated group governance-gap detection rate ≥ 60% (vs current ~30–40%).
- Cost overhead of observer agent ≤ 20% of total session cost.
