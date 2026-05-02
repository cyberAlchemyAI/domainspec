---
tags: [creatives, removal, bayesian]
node_type: constitution
is_session: false
layer: domain
nature: technical
status: draft
version: 0.1.1
last_updated: 2026-04-22
---

# Creative Removal Constitution

> The ratified rule by which creatives are retired from live campaigns. Uses a Bayesian, time-weighted spend-share heuristic that considers both recent and historical performance. Tuned to minimize false negatives (removing a creative that would have performed).

---

## Objective

This constitution defines **when a creative is removed** from a live campaign. It answers: *"Given a creative's spend history relative to its campaign, is it time to retire it?"*

The rule balances two forces: (a) creatives that never captured signal should be removed quickly so their slots free up for new candidates; (b) creatives that once performed deserve grace before being cut, because a temporary slump may recover.

Originates from Victor Boscaro and Nicholas Domene's document dated 2024-10-10, here ratified.

---

## Index

1. [Scope and Mandate](#scope-and-mandate)
2. [Why Spend Only](#why-spend-only)
3. [The Heuristic](#the-heuristic)
4. [Formal Specification](#formal-specification)
5. [Backtest Results](#backtest-results)
6. [Contrafactual Sampling](#contrafactual-sampling)
7. [Operational Parameters](#operational-parameters)
8. [Open Points](#open-points)
9. [Connections](#connections)

---

## Scope and Mandate

The rule applies to **every creative in every active campaign** operated by Maestro. After a minimum age, the creative becomes removal-eligible; at each rollout pass, Maestro evaluates every eligible creative and removes those below the threshold.

Out of scope:
- Creatives under manual protection (explicit operator override)
- Test-campaign creatives (different removal logic will be defined for the test lane — see [[premise/creative-premises#P-CRT-13]])

---

## Why Spend Only

The rule evaluates spend, not ROAS, CTR, or any other quality signal. Two reasons:

1. **A creative that isn't spending has zero revenue potential.** Spend is an upstream necessity; ROAS is downstream and dependent on spend existing.
2. **Spend share is the network's own signal.** Per [[axiom/creative-axioms#AX-CRT-4]], the network increases spend share on creatives its internal model expects to perform. Absence of spend is the network telling us it has not seen signal.

Other signals (ROAS, CTR) may be layered on in future iterations. Today they are not.

---

## The Heuristic

We want the rule to respect a creative's **history**. A creative that performed well for two months and weakened in the last week should not be cut as aggressively as a creative that never performed at all.

This maps naturally to a Bayesian posture: past spend is the **prior**; recent spend is the **evidence**. Time-weighting biases the posterior toward recent days, so a creative that consistently underperforms today is removed even if its history was strong.

Visually (from the 2024 document):
- **spend_share_day** (green) swings sharply with daily noise
- **spend_share_cumulative** (blue) lags badly — strong past carries forever
- **spend_share_posterior** (orange) smooths daily noise with a prior
- **heuristic** (purple) is the time-weighted posterior — picks up recent decay faster than cumulative, but slower than raw daily

---

## Formal Specification

Let:

- `t` — day offset from creative launch (1, 2, 3, ...)
- `d` — current day offset
- `S_i(t)` — daily spend of the creative on day `t`
- `S_c(t)` — daily spend of the campaign during the creative's day `t`
- `prior_i` — average first-full-day spend across all historical creatives
- `prior_c` — average first-full-day campaign spend (measured per-creative at each creative's entry day)

**Time-weighted cumulative spend:**

```
C_i = Σ_{t=1..d} S_i(t) · t  +  prior_i
C_c = Σ_{t=1..d} S_c(t) · t  +  prior_c
```

**Removal heuristic:**

```
H_ic = C_i / C_c
```

**Decision rule:**

```
if H_ic < threshold_removal  →  remove creative at next Maestro pass
```

The `threshold_removal` is the operational knob. See [Operational Parameters](#operational-parameters).

The priors prevent the heuristic from exploding on day 1 (where a single-day spike would dominate) and keep the heuristic stable in the first week.

The `· t` multiplier is the time-weighting — day `d` is weighted `d` times more heavily than day 1.

---

## Backtest Results

The ratified `threshold_removal = 10%` is justified by a 2024 backtest on 349 creatives: at that bar, the rule's false-negative rate is 0.57% — fewer than 1-in-150 removed creatives would have gone on to matter. Full threshold sweep, method, and limitations are captured in [[audit/removal-rule-backtest-2024]].

Rerun the audit whenever `threshold_removal`, `prior_i`, or `prior_c` is changed, or annually regardless.

---

## Contrafactual Sampling

To monitor false-negative rate **in production** (not just in backtest), the system samples contrafactuals: at each removal pass, each removal-eligible creative has a **10% probability** of being kept alive anyway.

**Implications:**

- Roughly 10% of campaign slots are occupied by creatives that would have been removed
- Over time, the kept-alive creatives provide a running estimate of how often the rule's removals were wrong
- When the false-negative rate drifts upward, the rule needs retuning

The 10% cost (fewer slots for new creatives) is accepted as the price of continuous calibration.

---

## Operational Parameters

The rule currently exposes:

| Parameter | Default | Meaning |
|---|---|---|
| `min_age_days` | 10 | A creative is ineligible for removal before this age |
| `threshold_removal` | 10% spend share (heuristic floor) | H_ic below this triggers removal |
| `contrafactual_rate` | 0.10 | Probability an eligible-for-removal creative is kept alive for monitoring |
| `prior_i`, `prior_c` | recomputed quarterly | Rolling means of first-full-day spends |

Changing any parameter requires a version bump on this constitution and a backtest run.

---

## Open Points

1. **Layered signals.** ROAS, CTR, or %Novos Usuários could be added as secondary gates. The current rule is intentionally minimal until we've validated that additions improve outcomes.
2. **Prior freshness.** Priors are "average across historical creatives", but the creative mix has shifted materially between 2024 and 2025. A drift-detection mechanism on the priors is overdue.
3. **Removal-rule A/B testing.** Contrafactuals measure false negatives for a single rule, not rule-vs-rule performance. A multi-armed-bandit setup or A/B test is needed to compare alternative rules.
4. **Test-campaign rule.** The test lane ([[premise/creative-premises#P-CRT-13]]) likely needs a separate, more aggressive removal rule. Not specified yet.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[axiom/creative-axioms]] | `derives-from` | AX-CRT-2 (predicting is impossible) and AX-CRT-4 (network interest aligns) are the bedrock |
| [[premise/creative-premises]] | `derives-from` | P-CRT-5 and P-CRT-6 are the specific bets this rule implements |
| [[spec/creative-metrics]] | `depends-on` | The `Spend Share` and time-weighted cumulative definitions live in the metrics spec |
| [[constitution/winning-creative-constitution]] | `alternative-to` | This rule identifies losers; the winning constitution identifies winners. Complementary. |
| [[constitution/creative-attribute-constitution]] | `contextualizes` | Removal evaluates creatives at the granularity defined by the attribute schema |
| [[audit/removal-rule-backtest-2024]] | `validates` | 2024 backtest of the rule on 349 creatives; false-negative-rate table per threshold |
| [[conceptual/creative-flows]] | `contextualizes` | Removal is a step in the common post-approval path |
| [[domain-dictionary]] | `contextualizes` | Terms referenced here are defined in the dictionary |
