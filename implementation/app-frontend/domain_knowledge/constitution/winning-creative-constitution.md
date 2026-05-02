---
tags: [creatives, classification, winning]
node_type: constitution
is_session: false
layer: domain
nature: reference
status: draft
version: 0.1.1
last_updated: 2026-04-22
---

# Winning Creative Constitution

> The formal classification of a creative as a "Criativo Vencedor" — a creative that demonstrably moved a business outcome. Three criteria (ROAS, Spend, Stock) × three impact tiers (Good, Success, Super Success) = nine possible classifications. A single creative may win under multiple criteria simultaneously.

---

## Objective

This constitution defines **what makes a creative a winner** and at what intensity. It answers: *"Given a creative and its performance data, does it qualify as Good, Success, or Super Success — under which criterion?"*

It formalizes a shared vocabulary across the team (so "winner" is not interpretation) and identifies the creatives that deserve qualitative investigation (Super Success is the priority class for "why did this work?" analysis).

Originates from Victor Boscaro's document dated 2025-07-08, here ratified with minor normalization.

---

## Index

1. [Purpose of the Classification](#purpose-of-the-classification)
2. [The Three Criteria](#the-three-criteria)
3. [The Three Tiers](#the-three-tiers)
4. [Methodology](#methodology)
5. [Criterion 1 — Spend](#criterion-1--spend)
6. [Criterion 2 — Receita (ROAS)](#criterion-2--receita-roas)
7. [Criterion 3 — Estoque](#criterion-3--estoque)
8. [Threshold Tables](#threshold-tables)
9. [Evaluation Window](#evaluation-window)
10. [Multiple Classifications per Creative](#multiple-classifications-per-creative)
11. [Open Points](#open-points)
12. [Connections](#connections)

---

## Purpose of the Classification

Two goals:

1. **Standardize internal language.** Without a shared definition, "winner" is whatever the speaker wants it to mean.
2. **Prioritize qualitative analysis.** Super Success creatives are the ones worth investing time to understand. The class is the flag that triggers deeper investigation.

The team's semester KR is to surface 16 super sucessos per half.

---

## The Three Criteria

A winning creative must have caused at least one of:

| Criterion | What it measures |
|---|---|
| **Spend** | The creative drove campaign-level investment up |
| **Receita (ROAS)** | The creative drove campaign-level profitability up |
| **Estoque** | The creative drove unit sales of a specific product up |

The hypothesis: more winners under any criterion translates to better channel outcomes.

---

## The Three Tiers

Within each criterion:

- **Good** — threshold passed; meaningful contribution
- **Success** — noticeably stronger than Good
- **Super Success** — outlier-scale contribution; demands qualitative investigation

Super Success implies Success implies Good.

---

## Methodology

All three criteria follow the same structure: compare the campaign's metrics after the creative's activation against a **temporal baseline** — the day before activation. This is a causal-heuristic approach, not a formal causal model.

**Why heuristics, not a model:**

- Interpretability — any operator can apply and challenge the rule
- Low implementation cost — no attribution model rework required
- Explicit trade-off: false positives are tolerable; false negatives are acceptable when they affect only marginal cases

Thresholds were set by two methods:

1. **Distribution percentiles** (e.g., creative ROAS distribution quantiles)
2. **Empirical iteration** — tuning against known-good and known-bad creatives from 2024–2025 H1

---

## Criterion 1 — Spend

A creative wins under Spend when it drove campaign investment up without collapsing ROAS.

**Required conditions (all must hold):**

### 1.1 — Campaign spend increased
Compare spend over the 3 days after the creative's activation against the day before.

- **Absolute uplift:** ≥ R$ 8,000 (Good), R$ 12,500 (Success), R$ 20,000 (Super Success)
- **Relative uplift:** ≥ 75% (Good), 150% (Success), 200% (Super Success) — measured against a baseline spend of ≥ R$ 1,000

### 1.2 — Campaign ROAS preserved
- Campaign ROAS must not decrease over the 3 days post-activation
- The creative's own ROAS must reach ≥ 1.0 over the following 7 days

### 1.3 — The creative materially contributed
- Spend Share ≥ 20% / 30% / 40% (per tier) in either the 3-day pre-activation window OR the 3-day post-activation window
- The creative must rank among the top 2 by spend in that same window

---

## Criterion 2 — Receita (ROAS)

A creative wins under Receita when it drove campaign profitability up, even with stable spend.

**Required conditions (all must hold):**

### 2.1 — Campaign performance improved
Compare post-activation performance against the day-before baseline:

- Revenue increased by ≥ 20% / 50% / 100% (per tier) with spend stable or lower, **or**
- ROAS increased by ≥ 10% / 25% / 50% (per tier) with spend stable or higher

### 2.2 — Creative-level ROAS floor
- Creative ROAS at 3 or 7 days ≥ 1.0 / 1.1 / 1.3 for 2024 creatives, or ≥ 1.5 / 1.7 / 2.0 for 2025 creatives (per tier)

### 2.3 — Creative was at meaningful scale
- Spend Share at 3 days ≥ 10% (same threshold across all tiers)

---

## Criterion 3 — Estoque

A creative wins under Estoque when it drove direct unit sales of a specific product.

Uses only **directly attributed** sales (no attribution-model weighting) against the product's average daily sales before the creative's activation.

### 3.1 — Single-day spike
- Attributed sales on at least one day ≥ 25% / 55% / 100% (per tier) of the product's pre-activation daily average
- Product must have averaged ≥ 54 units/day pre-activation; if half of that, the threshold doubles

### 3.2 — Sustained average
- Attributed sales averaged (over 3, 7, or 15 days) ≥ 20% / 35% / 60% (per tier) of pre-activation daily average
- For products averaging < 35 units/day, threshold rises to 40%

---

## Threshold Tables

### Spend

| Metric | Good | Success | Super Success |
|---|---|---|---|
| Absolute campaign spend uplift | R$ 8,000 | R$ 12,500 | R$ 20,000 |
| Relative campaign spend uplift | 75% | 150% | 200% |
| Spend share of creative | 20% | 30% | 40% |
| Minimum campaign ROAS uplift | 0% | 0% | 0% |

### Receita (ROAS)

| Metric | Good | Success | Super Success |
|---|---|---|---|
| Relative campaign revenue uplift | 20% | 50% | 100% |
| Relative campaign ROAS uplift | 10% | 25% | 50% |
| Minimum campaign spend uplift | 0% | 0% | 0% |
| Creative spend share | 10% | 10% | 10% |
| Creative 3- or 7-day ROAS (2024) | 1.0 | 1.1 | 1.3 |
| Creative 3- or 7-day ROAS (2025) | 1.5 | 1.7 | 2.0 |

### Estoque

| Metric | Good | Success | Super Success |
|---|---|---|---|
| Single-day attributed sales uplift | 25% | 55% | 100% |
| Averaged attributed sales uplift (3/7/15d) | 20% | 35% | 60% |
| Minimum product pre-activation daily average | 54 | 54 | 54 |

---

## Evaluation Window

A creative is eligible for classification only if it is ≤ 15 days old. Older creatives are excluded.

**Rationale:** the baseline comparison requires the day-before-activation state to be meaningfully comparable to the post-activation state. Longer lags weaken the comparison.

**Known trade-off:** creatives that "awaken" late are missed. Backtest on 2025 H1: 147 winners under unlimited window → 109 under 15-day window (Success count: 16 → 14). The 38 lost winners are the accepted false-negative cost. See [[premise/creative-premises#P-CRT-8]].

---

## Multiple Classifications per Creative

A single creative may classify under more than one criterion. Two handling options:

- **Duplicate record.** Show the creative as "Super Success" twice (or thrice), once per criterion.
- **Meta-tier.** Define a new combined tier (e.g., "double super success").

**Current decision:** duplicate records. The meta-tier option is deferred until we observe enough multi-criteria winners to calibrate a threshold.

---

## Open Points

1. **Fixed vs. percentile thresholds.** Absolute thresholds (e.g., R$ 8,000) do not adapt to channel-level growth. Percentile-based thresholds would self-calibrate. Trade-off: interpretability vs. drift-resistance.
2. **External events not modeled.** Bid changes, Black Friday, and other exogenous shifts can move the baseline. The current rule treats any post-activation uplift as attributable to the creative.
3. **15-day cap.** See above. Revisiting with a post-window re-evaluation pass has been discussed.
4. **Multi-criteria handling.** Deferred decision.
5. **New-client criterion.** The existing criteria do not reward new-customer acquisition specifically. A fourth criterion (% Novos Usuários) may be added.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[axiom/creative-axioms]] | `derives-from` | AX-CRT-1 justifies formalizing the winner class |
| [[premise/creative-premises]] | `derives-from` | P-CRT-7, P-CRT-8, P-CRT-9 motivate the specific shape of the rule |
| [[spec/creative-metrics]] | `depends-on` | All threshold metrics are defined in the metrics spec |
| [[constitution/creative-removal-constitution]] | `alternative-to` | The removal rule identifies losers; this constitution identifies winners. Complementary lenses on the same creative population. |
| [[constitution/creative-attribute-constitution]] | `contextualizes` | Attribute-level segmentation (Ângulo, Audiência, Produto) is what makes winner analysis interpretable |
| [[domain-dictionary]] | `contextualizes` | Terms used here are defined in the dictionary |
