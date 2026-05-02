---
tags: [creatives, removal, backtest]
node_type: audit
is_session: false
layer: domain
nature: technical
status: consolidated
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-04-22
---

# Removal Rule — 2024 Backtest

## Objective

This audit records the evaluation of the creative removal rule ([[constitution/creative-removal-constitution]]) against the 2024 creative population. It answers: *"At each candidate spend-share threshold, what false-negative rate does the time-weighted Bayesian heuristic produce — and does that justify the operational threshold the constitution ratifies?"*

The removal constitution cites this backtest as its empirical warrant. When the rule is retuned (threshold change, prior recomputation, scope extension), this audit is the artifact rerun.

---

## Scope

- **Population:** 349 creatives that entered Meta campaigns between 2024-01-01 and 2024-12-31.
- **Signal evaluated:** the time-weighted cumulative spend share `H_ic = C_i / C_c` as defined in [[constitution/creative-removal-constitution#formal-specification]].
- **Metric computed:** false-negative rate — the fraction of *removed* creatives that would have gone on to exceed a given forward-looking spend share.
- **Supporting analysis:** per-creative day-1 spend share vs. 7-day forward spend share (Nicholas Domene).

Out of scope: rule-vs-rule comparison (see [[discovery/removal-rule-ab-testing]] for the open question), 2025 creatives, networks other than Meta.

---

## Headline Result

| Removal threshold | False-negative rate |
|---|---|
| ≥ 5.0% | 7.45% |
| ≥ 7.5% | 1.72% |
| ≥ 10.0% | 0.57% |
| ≥ 15.0% | 0.29% |

**Operational reading.** At a 10% future-spend-share bar, fewer than 1-in-150 removed creatives would have gone on to matter. This is the evidence behind the `threshold_removal = 10%` default ratified in the constitution.

**Day-1 signal strength (Domene).** A creative with < 5% spend share on its first full day has ~1.4% probability of reaching ≥ 15% spend share over the following 7 days. Day-1 underperformance is therefore already an actionable predictor — confirmation of [[premise/creative-premises#p-crt-5--day-1-spend-share-predicts-future-spend]].

---

## Method

1. For each of the 349 creatives, compute `H_ic(t)` for every t after launch using the formula in the removal constitution, with `prior_i` and `prior_c` set to the 2024 rolling means.
2. At each candidate threshold τ ∈ {5%, 7.5%, 10%, 15%}, simulate the removal rule: remove every creative whose `H_ic` fell below τ at any t ≥ 10 days.
3. For each removed creative, measure its forward-looking cumulative spend share over the 30 days following the hypothetical removal day.
4. A creative counts as a **false negative** if it was removed but its forward cumulative spend share exceeded τ within the 30-day window.
5. Report false-negative rate = (# false negatives) / (# removed).

---

## Limitations

- **Priors are static 2024 means.** The creative mix shifted in 2025 (7× more creatives, different campaign structure). The 2024 priors likely no longer fit. See [[constitution/creative-removal-constitution#open-points]] item 2.
- **No counterfactual on the other side.** This audit measures false negatives among *removed* creatives. It does not measure false positives (creatives kept alive that never paid off). Contrafactual sampling in production fills part of this gap ([[constitution/creative-removal-constitution#contrafactual-sampling]]), but not retrospectively for 2024.
- **Single-rule evaluation.** The backtest validates the current rule; it does not compare it against alternatives. See [[discovery/removal-rule-ab-testing]].
- **Forward window choice.** 30 days is a reasonable but ad-hoc bound. Longer windows would surface more late-blooming false negatives, at the cost of noisier comparison against the baseline.

---

## Provenance

- Primary document: Victor Boscaro + Nicholas Domene, 2024-10-10 (the document ratified as the removal constitution).
- Underlying data: `business.insider_revenue_attribution` (internal attribution model) and Meta spend records for 2024.
- Rerun cadence: recommended annually, or whenever `threshold_removal` or priors are changed.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[constitution/creative-removal-constitution]] | `validates` | This audit is the empirical evidence behind the rule's ratified threshold and prior structure |
| [[premise/creative-premises]] | `validates` | Directly validates P-CRT-5 (day-1 predictive power) and P-CRT-6 (Bayesian time-weighted signal) |
| [[spec/creative-metrics]] | `depends-on` | Uses the `Spend Share` and time-weighted cumulative definitions from the metrics spec |
| [[discovery/removal-rule-ab-testing]] | `questions` | This audit cannot compare rule variants; the A/B discovery is the open question it surfaces |
| [[domain-dictionary]] | `contextualizes` | Concepts used here are defined in the domain dictionary |
| [[metrics-dictionary]] | `depends-on` | `spend`, `spend_share`, `time_weighted_cumulative_spend`, and `removal_heuristic` are registered in the metrics dictionary |
