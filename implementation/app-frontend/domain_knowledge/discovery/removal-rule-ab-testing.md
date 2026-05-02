---
tags: [creatives, removal, experimentation]
node_type: discovery
is_session: false
layer: domain
nature: explanatory
status: exploratory
veracidade: low
convicção: medium
version: 0.1.0
last_updated: 2026-04-22
---

# Discovery — Removal Rule A/B Testing

## Objective

Explore how to compare **alternative removal rules** against the current time-weighted Bayesian heuristic in production — not merely measure the current rule's false-negative rate, which contrafactual sampling already does. Answers: *"How do we know a candidate removal rule is better than the one in production, given we can only run one rule at a time per campaign?"*

This discovery formalizes the open question flagged in [[constitution/creative-removal-constitution#open-points]] item 3 ("Removal-rule A/B testing").

---

## Context

- The current rule is validated by [[audit/removal-rule-backtest-2024]] against 349 creatives from 2024.
- Contrafactual sampling ([[constitution/creative-removal-constitution#contrafactual-sampling]]) monitors the **current** rule's false-negative rate in production, but provides no mechanism to compare it against an alternative rule.
- Candidate alternatives that have been mentioned but never structured for evaluation:
  - ROAS-gated removal (current rule + an additional ROAS floor).
  - Percentile-based threshold (replace the 10% absolute floor with a 10th-percentile dynamic floor).
  - Multi-armed bandit with removal rules as arms.
  - Rule conditioned on creative age tier (aggressive ≤ 10d; lenient > 10d).

---

## Open Questions

1. **What's the experimental unit?** Per-campaign (each campaign gets assigned a rule for a period) vs. per-creative-cohort (random assignment of creatives to rule variants within the same campaign). Per-campaign has less contamination but slower learning; per-cohort has faster learning but risks cross-creative interference via shared campaign budget.
2. **What's the metric?** Creative-level ROAS over the 30 days post-eligibility is a candidate, but aggregation over many creatives introduces the same attribution-model-version confound flagged for longitudinal analysis.
3. **Minimum sample size?** At 2024's FN-rate of 0.57% (10% threshold), detecting a 0.2 pp improvement requires thousands of removals per arm. 2025 has the volume; earlier years didn't.
4. **Power vs. contamination trade-off**. MAB allocates budget to arms dynamically, which is statistically efficient but makes post-hoc analysis harder.
5. **Rollback path**. How do we detect a rule variant is *worse* early enough to stop?

---

## Candidate Approach

A two-phase structure:

**Phase 1 — Shadow evaluation.** Run every candidate rule in parallel *on paper*, against the same stream of eligible creatives, without acting on the alternatives' decisions. Record the counterfactual removal set for each candidate. Compare forward-looking spend share and ROAS of the shadow-removed creatives (all of which remain alive under the production rule) across candidates. Cheap; requires no production routing changes.

**Phase 2 — Live arm.** After a candidate has survived shadow evaluation, promote it to a live arm on 10–20% of campaigns for a full cycle. Compare campaign-level outcomes against the control arm.

---

## Evidence Needed

- 2025 creative cohort fully labeled for shadow evaluation (requires `threshold_removal` variants to be computable from `time_weighted_cumulative_spend` and `removal_heuristic` history).
- A materialized table of `removal_heuristic` per-creative per-day — today computed on the fly; see [[metrics-dictionary#removal_heuristic]]. Shadow evaluation is ~free if this exists.

---

## Consequences if Adopted

- [[constitution/creative-removal-constitution#operational-parameters]] grows a `rule_variant` field; `threshold_removal` becomes rule-variant-scoped.
- [[audit/removal-rule-backtest-2024]] rerun recipe changes — instead of one FN-rate per threshold, we now have one FN-rate per (rule, threshold) pair.
- New audit nodes accumulate over time, one per variant promoted to live.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[constitution/creative-removal-constitution]] | `questions` | Surfaces the A/B testing gap noted in the constitution's open points |
| [[audit/removal-rule-backtest-2024]] | `questions` | This audit only evaluates a single rule; the discovery asks how to compare multiple |
| [[premise/creative-premises]] | `questions` | Outcome will sharpen P-CRT-6 (Bayesian heuristic) or introduce a sibling premise |
| [[metrics-dictionary]] | `depends-on` | Shadow evaluation needs `removal_heuristic` materialized |
| [[domain-dictionary]] | `contextualizes` | `Contrafactual`, `Falso Negativo`, `Feedback Loop` are the relevant concepts |
