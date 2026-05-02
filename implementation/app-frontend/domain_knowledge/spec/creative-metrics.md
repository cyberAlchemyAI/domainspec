---
tags: [creatives, metrics, performance-marketing]
node_type: spec
is_session: false
layer: domain
nature: reference
status: draft
version: 0.1.1
last_updated: 2026-04-22
---

# Creative Metrics — Spec

> Canonical definitions of the metrics used to evaluate creatives, classify winners, and trigger removal. Every metric name used elsewhere in `/domain_knowledge` must match the definition here. If a metric is referenced in the code, the code must compute it the way this document says.

---

## Objective

This document is the **behavioral contract** for creative metrics. It answers: *"Given a creative and a time window, how is each metric computed?"*

It covers three categories: the decomposable ROAS identity, the primary evaluation metrics, and the derived signals used by the constitutions.

---

## Index

1. [Primary Metrics](#primary-metrics)
2. [The ROAS Identity](#the-roas-identity)
3. [Derived Signals](#derived-signals)
4. [Evaluation Windows](#evaluation-windows)
5. [Open Points](#open-points)
6. [Connections](#connections)

---

## Primary Metrics

| Metric | Definition | Unit |
|---|---|---|
| **Spend** | Total amount spent placing the creative over the window | BRL |
| **Impressions** | Count of times the creative was served | count |
| **Clicks** | Count of clicks the creative received | count |
| **Orders** | Count of orders attributed to the creative | count |
| **New Clients Orders** | Orders attributed to the creative from first-time customers | count |
| **Revenue (Attributed)** | BRL revenue attributed to the creative by internal attribution | BRL |
| **ROAS** | `Revenue / Spend` | ratio |
| **CPM** | `Spend / Impressions × 1000` | BRL per 1000 impressions |
| **CTR** | `Clicks / Impressions × 100` | % |
| **Conversion Rate** | `Orders / Clicks × 100` | % |
| **Average Ticket** | `Revenue / Orders` | BRL |
| **% Novos Usuários** | `New Clients Orders / Orders × 100` | % |

> **Attribution:** Revenue and order counts come from Insider's internal attribution model, not from the ad-platform-reported revenue. The internal model is the decision signal; platform-reported revenue is secondary. Lift tests are run occasionally to calibrate the internal model.

---

## The ROAS Identity

ROAS is not a primitive — it decomposes into the four primary signals:

```
ROAS = (1000 × CTR × ConvRate × AverageTicket) / CPM
```

Each factor corresponds to a stage in the funnel:

| Factor | Funnel stage |
|---|---|
| **CTR** | impression → click |
| **ConvRate** | click → order |
| **AverageTicket** | order → revenue |
| **CPM** | cost per impression (denominator) |

Creatives influence **every numerator term** (they shape who clicks, who buys, and how much they spend) and, indirectly, CPM (the platform's auction rewards creatives with higher predicted outcomes). This is why creatives are the dominant lever — see [[conceptual/performance-marketing-context#the-four-levers]].

---

## Derived Signals

### Spend Share
```
spend_share(creative, campaign, window) = spend_criativo / spend_campanha
```

The fraction of a campaign's spend that a specific creative captured over a window. Primary input to the removal rule. A proxy for "the network sees signal in this creative" — see [[axiom/creative-axioms#AX-CRT-4]].

### Time-Weighted Cumulative Spend
Used by the removal rule to bias recent days more than older days:
```
C(t) = Σ_{τ=1..d} spend(τ) · τ + prior
```

Where `τ` is the day offset from creative start, `d` is today's offset, and `prior` is the mean first-full-day spend across historical creatives (or campaigns, depending on which side is being computed). The prior is what gives historically strong creatives a grace period.

### Removal Heuristic
```
H(creative, campaign) = C_creative / C_campaign
```

If `H` falls below a configured threshold after the creative's minimum evaluation period, the creative is flagged for removal. Full spec in [[constitution/creative-removal-constitution]].

### Relative Campaign Deltas (for Winning Classification)
The winning-creative classification compares campaign-level metrics in the window after the creative's activation against a baseline (day before activation):

```
Δ_relative(metric) = (metric_post - metric_baseline) / metric_baseline
```

Used with metric ∈ {Spend, Revenue, ROAS}. Full thresholds in [[constitution/winning-creative-constitution]].

---

## Evaluation Windows

| Context | Window | Reason |
|---|---|---|
| Removal eligibility | 10 days after creative enters campaign | Gives a creative enough time to accumulate meaningful spend before being pulled |
| Removal heuristic prior | First full day of the creative | Predictive (see [[premise/creative-premises#P-CRT-5]]) |
| Winning-creative classification | Up to 15 days after creative enters | See [[premise/creative-premises#P-CRT-8]] |
| Campaign baseline for winning | Day before creative entered campaign | Controls for campaign state at the moment of activation |

---

## Open Points

- **ConvRate definition drift.** The stakeholder deck writes Conversion Rate as `Clicks / Orders × 100`. That's inverted. The operational definition used in dashboards and this spec is `Orders / Clicks × 100`. Codebase and presentations should be normalized.
- **Attribution model version.** The internal attribution model has undergone revisions. Metric values computed across model versions are not strictly comparable. A version tag on attributed revenue would let us detect drift.
- **ROAS identity assumes single-product orders.** For multi-SKU orders, `AverageTicket` is order-level, not SKU-level, which inflates the per-product picture. Stock-criterion winning classifications should use SKU-attributed revenue, not order-attributed revenue.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[metrics-dictionary]] | `pairs-with` | Flat registry of every metric with machine-parseable YAML entries (formulas, units, dependencies). This spec is the narrative; the metrics dictionary is the catalog. |
| [[domain-dictionary]] | `depends-on` | Metric names ultimately reference concept terms defined in the domain dictionary |
| [[constitution/winning-creative-constitution]] | `depends-on` | Winning-creative rules are evaluated against the metrics defined here |
| [[constitution/creative-removal-constitution]] | `depends-on` | Removal rule is evaluated against the metrics defined here |
| [[conceptual/performance-marketing-context]] | `contextualizes` | The ROAS decomposition is what makes the four-levers framing load-bearing |
