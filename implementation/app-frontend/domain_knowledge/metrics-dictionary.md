---
tags: [creatives, metrics, performance-marketing, attribution]
node_type: conceptual
is_session: false
layer: domain
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-04-22
---

# Creative Operations — Metrics Dictionary

> Flat registry of every metric that exists in the Creative Operations domain. One canonical ID per metric; one formula per ID. Attribution variants and windowed variants get distinct IDs. If a number appears in a dashboard, pipeline, or rule, its ID must resolve here. The [[domain-dictionary]] is the naming layer for concepts; this is the naming layer for numbers.

---

## Objective

Answers: *"Given a metric name, how is the number computed, what does it depend on, where does it live in data, and which rules consume it?"*

This dictionary is intentionally **parseable**. Each entry is a YAML block with a fixed shape, followed by a short prose note. The YAML is the contract; the prose is the reader's aid.

---

## Metric ID convention

Dot-separated, lowercase, singular. Parts get more specific left-to-right:

- `spend` — primitive
- `revenue.attributed` — qualified by attribution variant
- `conv_rate.raw` / `conv_rate.attributed` — qualified by attribution variant
- `cum_spend_share.3d.backward` / `cum_spend_share.3d.forward` — qualified by window + direction
- `orders.first_purchase.attributed` — qualified by filter + attribution

When a metric has no qualifier (e.g., `roas`), its default variant is **attribution-model-weighted** — because that is the decision signal in this system. Non-default variants are always explicitly qualified (`roas.raw`).

---

## Entry schema

Every entry declares:

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Canonical metric ID |
| `name` | string | Human-readable name |
| `category` | enum | `primary` \| `derived` \| `campaign_relative` \| `windowed` \| `lifecycle` |
| `formula` | string | Formula in terms of other metric IDs (or `primitive` for raw observations) |
| `unit` | enum | `BRL` \| `count` \| `ratio` \| `%` \| `days` \| `rank` |
| `grain` | string | Minimum grain at which the metric is well-defined |
| `source` | string | Data location (table.column or SQL expression) |
| `depends_on` | list | Other metric IDs used in the formula |
| `attribution` | enum | `none` \| `model` \| `platform` — which attribution variant the numbers come from |
| `window` | string | `point-in-time` \| `aggregate` \| `Nd-backward` \| `Nd-forward` \| `lifetime` |
| `used_by` | list | Constitutions / rules / dashboards that consume this metric |
| `status` | enum | `ratified` \| `exploratory` \| `drift` — `drift` means doc/code disagree today |
| `spec_ref` | string | Anchor in [[spec/creative-metrics]] (optional) |

---

## Index

1. [Primary Metrics](#primary-metrics)
2. [Derived Metrics](#derived-metrics)
3. [Campaign-Relative Signals](#campaign-relative-signals)
4. [Windowed Signals](#windowed-signals)
5. [Lifecycle Metrics](#lifecycle-metrics)
6. [The ROAS Identity](#the-roas-identity)
7. [Open Points](#open-points)
8. [Connections](#connections)

---

## Primary Metrics

Directly observed quantities — the data that enters the system before any ratio, window, or derivation.

### `spend`

```yaml
id: spend
name: Spend
category: primary
formula: primitive
unit: BRL
grain: (ad_id, campaign_id, date)
source: advertising_reports.spend
depends_on: []
attribution: none
window: point-in-time
used_by:
  - winning-creative-constitution:criterion-1-spend
  - winning-creative-constitution:criterion-2-receita
  - creative-removal-constitution:heuristic
  - metrics:cpa
  - metrics:cac
  - metrics:cpm
  - metrics:roas
  - metrics:spend_share
status: ratified
spec_ref: spec/creative-metrics#primary-metrics
```

**Definition.** BRL paid to the network to deliver the creative, as reported by the ad platform. Denominated in BRL; no attribution model involved.

**Domain terms.** [[domain-dictionary#criativo-creative--ad]], [[domain-dictionary#campanha-campaign]].

---

### `impressions`

```yaml
id: impressions
name: Impressions
category: primary
formula: primitive
unit: count
grain: (ad_id, campaign_id, date)
source: advertising_reports.impressions
depends_on: []
attribution: none
window: point-in-time
used_by:
  - metrics:ctr
  - metrics:cpm
status: ratified
```

**Definition.** Number of times the creative was served by the network.

---

### `clicks`

```yaml
id: clicks
name: Clicks
category: primary
formula: primitive
unit: count
grain: (ad_id, campaign_id, date)
source: advertising_reports.clicks
depends_on: []
attribution: none
window: point-in-time
used_by:
  - metrics:ctr
  - metrics:conv_rate.raw
  - metrics:conv_rate.attributed
status: ratified
```

**Definition.** Number of clicks the creative received, as reported by the ad platform.

---

### `orders.raw`

```yaml
id: orders.raw
name: Orders (Raw)
category: primary
formula: COUNT(DISTINCT order_id)
unit: count
grain: (ad_id, date)
source: insider_revenue_attribution (filtered to ad_id, order_date)
depends_on: []
attribution: none
window: point-in-time
used_by:
  - metrics:conv_rate.raw
status: ratified
```

**Definition.** Raw count of attributed orders, unweighted by the internal attribution model. Reference point; not the decision signal.

---

### `orders.attributed`

```yaml
id: orders.attributed
name: Orders (Attributed)
category: primary
formula: SUM(weight)
unit: count
grain: (ad_id, date)
source: insider_revenue_attribution.weight
depends_on: []
attribution: model
window: point-in-time
used_by:
  - metrics:conv_rate.attributed
  - metrics:cpa
  - metrics:average_ticket
status: ratified
```

**Definition.** Model-weighted order count. Same order can contribute fractional weight across multiple ads. This is the denominator the team uses for CPA and conversion rate in decision contexts.

**Domain terms.** [[domain-dictionary#attribution-model-interno]], [[domain-dictionary#weight]].

---

### `orders.first_purchase.raw`

```yaml
id: orders.first_purchase.raw
name: Orders — First Purchase (Raw)
category: primary
formula: COUNT(DISTINCT order_id WHERE order_rank = 1)
unit: count
grain: (ad_id, date)
source: insider_revenue_attribution (filtered to order_rank = 1)
depends_on: []
attribution: none
window: point-in-time
used_by:
  - metrics:pct_novos_usuarios
status: ratified
```

**Definition.** Unweighted count of orders placed by first-time customers.

---

### `orders.first_purchase.attributed`

```yaml
id: orders.first_purchase.attributed
name: Orders — First Purchase (Attributed)
category: primary
formula: SUM(weight WHERE order_rank = 1)
unit: count
grain: (ad_id, date)
source: insider_revenue_attribution.weight (filtered to order_rank = 1)
depends_on: []
attribution: model
window: point-in-time
used_by:
  - metrics:cac
status: ratified
```

**Definition.** Model-weighted count of first-purchase orders. Central to CAC and to any future new-customer winning criterion.

---

### `revenue.attributed`

```yaml
id: revenue.attributed
name: Revenue (Attributed)
category: primary
formula: SUM(weighted_revenue)
unit: BRL
grain: (ad_id, date)
source: insider_revenue_attribution.weighted_revenue
depends_on: []
attribution: model
window: point-in-time
used_by:
  - metrics:roas
  - metrics:average_ticket
  - winning-creative-constitution:criterion-2-receita
status: ratified
```

**Definition.** BRL revenue attributed to the creative by the internal attribution model. Canonical numerator of ROAS in this system.

**Domain terms.** [[domain-dictionary#attribution-model-interno]], [[domain-dictionary#weight]].

---

### `revenue.platform_reported`

```yaml
id: revenue.platform_reported
name: Revenue (Platform-Reported)
category: primary
formula: primitive
unit: BRL
grain: (ad_id, campaign_id, date)
source: advertising_reports.revenue
depends_on: []
attribution: platform
window: point-in-time
used_by:
  - triangulation (not a decision signal)
status: ratified
```

**Definition.** Revenue as reported by the ad platform's own attribution (Meta Pixel, Google Conversion Tracking). Used for triangulation and drift detection against `revenue.attributed`; not consumed by removal or winning rules.

---

## Derived Metrics

Simple ratios over the primary metrics. No windows, no campaign relativity — one row of primaries in, one scalar out.

### `roas`

```yaml
id: roas
name: ROAS (Return on Ad Spend)
category: derived
formula: revenue.attributed / spend
unit: ratio
grain: row grain of inputs
source: performance.roas = SAFE_DIVIDE(SUM(w_rev), SUM(spend))
depends_on: [revenue.attributed, spend]
attribution: model
window: aggregate
used_by:
  - winning-creative-constitution:criterion-1-spend (floor ≥ 1.0)
  - winning-creative-constitution:criterion-2-receita (floor 1.0 – 2.0 per tier)
status: ratified
spec_ref: spec/creative-metrics#the-roas-identity
```

**Definition.** Return generated per BRL spent. Default variant uses the internal attribution model. The identity `roas = (1000 · ctr · conv_rate.attributed · average_ticket) / cpm` decomposes the metric into its funnel stages — see [The ROAS Identity](#the-roas-identity).

---

### `roas.raw`

```yaml
id: roas.raw
name: ROAS (Raw, Platform-Attributed)
category: derived
formula: revenue.platform_reported / spend
unit: ratio
grain: row grain of inputs
source: derived (not materialized)
depends_on: [revenue.platform_reported, spend]
attribution: platform
window: aggregate
used_by:
  - triangulation
status: exploratory
```

**Definition.** Platform-attributed ROAS. Not currently materialized in `creatives_performance`; would be computed as a reference column if platform-reported revenue were joined in.

---

### `ctr`

```yaml
id: ctr
name: CTR (Click-Through Rate)
category: derived
formula: (clicks / impressions) × 100
unit: "%"
grain: row grain of inputs
source: performance.ctr = SAFE_DIVIDE(SUM(clicks), SUM(impressions)) × 100
depends_on: [clicks, impressions]
attribution: none
window: aggregate
used_by:
  - metrics:roas (via identity)
  - dashboards
status: ratified
```

**Definition.** Share of impressions that produced a click. Funnel stage: impression → click.

---

### `cpm`

```yaml
id: cpm
name: CPM (Cost per Mille)
category: derived
formula: (spend / impressions) × 1000
unit: BRL per 1000 impressions
grain: row grain of inputs
source: derived
depends_on: [spend, impressions]
attribution: none
window: aggregate
used_by:
  - metrics:roas (via identity, as denominator)
  - dashboards
status: ratified
```

**Definition.** Cost to deliver 1,000 impressions. Denominator of the ROAS identity — the network's price for eyeballs.

---

### `average_ticket`

```yaml
id: average_ticket
name: Average Ticket
category: derived
formula: revenue.attributed / orders.attributed
unit: BRL
grain: row grain of inputs
source: derived
depends_on: [revenue.attributed, orders.attributed]
attribution: model
window: aggregate
used_by:
  - metrics:roas (via identity)
  - dashboards
status: ratified
```

**Definition.** Average attributed revenue per attributed order. Funnel stage: order → revenue.

---

### `conv_rate.raw`

```yaml
id: conv_rate.raw
name: Conversion Rate (Total)
category: derived
formula: (orders.raw / clicks) × 100
unit: "%"
grain: row grain of inputs
source: performance.conv_rate_total = SAFE_DIVIDE(SUM(n_orders_total), SUM(clicks))
depends_on: [orders.raw, clicks]
attribution: none
window: aggregate
used_by:
  - triangulation vs conv_rate.attributed
status: drift
notes: SQL omits the × 100; spec mandates × 100. Fix one side.
spec_ref: spec/creative-metrics#primary-metrics
```

**Definition.** Raw share of clicks that became orders. Reference counterpart to `conv_rate.attributed`; not used as a decision signal.

---

### `conv_rate.attributed`

```yaml
id: conv_rate.attributed
name: Conversion Rate (Modelada)
category: derived
formula: (orders.attributed / clicks) × 100
unit: "%"
grain: row grain of inputs
source: performance.conv_rate_model = SAFE_DIVIDE(SUM(n_orders_weight), SUM(clicks))
depends_on: [orders.attributed, clicks]
attribution: model
window: aggregate
used_by:
  - metrics:roas (via identity)
  - dashboards
status: drift
notes: SQL omits the × 100; spec mandates × 100. Fix one side.
```

**Definition.** Attributed-model share of clicks that became orders. The operational conversion rate used by the team's dashboards and the ROAS identity.

---

### `cpa`

```yaml
id: cpa
name: CPA (Cost per Acquisition)
category: derived
formula: spend / orders.attributed
unit: BRL
grain: row grain of inputs
source: performance.cpa = SAFE_DIVIDE(SUM(spend), SUM(n_orders_weight))
depends_on: [spend, orders.attributed]
attribution: model
window: aggregate
used_by:
  - budget reviews
  - CFO-facing reporting
status: ratified
```

**Definition.** Average spend to acquire one attributed order. Not a removal or winning signal today; budget-posture metric.

---

### `cac`

```yaml
id: cac
name: CAC (Customer Acquisition Cost)
category: derived
formula: spend / orders.first_purchase.attributed
unit: BRL
grain: row grain of inputs
source: performance.cac = SAFE_DIVIDE(SUM(spend), SUM(n_orders_first_purchase_weight))
depends_on: [spend, orders.first_purchase.attributed]
attribution: model
window: aggregate
used_by:
  - budget reviews
  - candidate fourth winning criterion (see winning-creative-constitution:open-points)
status: ratified
```

**Definition.** Average spend to acquire one first-purchase customer. Differs from CPA only by the order-rank filter on the denominator.

---

### `pct_novos_usuarios`

```yaml
id: pct_novos_usuarios
name: "% Novos Usuários"
category: derived
formula: (orders.first_purchase.raw / orders.raw) × 100
unit: "%"
grain: row grain of inputs
source: derived
depends_on: [orders.first_purchase.raw, orders.raw]
attribution: none
window: aggregate
used_by:
  - strategic dashboards
  - candidate fourth winning criterion
status: ratified
```

**Definition.** Share of attributed orders that came from first-time customers. Uses raw counts per convention; an attributed variant could be defined if the rule ever depends on it.

---

## Campaign-Relative Signals

Metrics that compare a creative to its campaign. Grain is always `(ad_id, campaign_id, date)` — the creative alone is not enough; the campaign's state on the same day is the denominator.

### `spend_share`

```yaml
id: spend_share
name: Spend Share
category: campaign_relative
formula: spend[ad_id, campaign_id, date] / spend[campaign_id, date]
unit: ratio
grain: (ad_id, campaign_id, date)
source: derived in winners pipeline (spend_share column in spend_df)
depends_on: [spend]
attribution: none
window: point-in-time
used_by:
  - creative-removal-constitution:heuristic (base signal)
  - winning-creative-constitution (all criteria)
status: ratified
spec_ref: spec/creative-metrics#spend-share
```

**Definition.** The creative's share of its campaign's spend on a given day. A proxy for "did the network see signal in this creative?" per [[axiom/creative-axioms#ax-crt-4--the-networks-interest-aligns-with-the-campaign-objective]].

---

### `cum_spend_share.Nd.backward`

```yaml
id: cum_spend_share.Nd.backward
name: Cumulative Spend Share — trailing N days
category: windowed
formula: SUM(spend[ad], τ∈[t-N, t]) / SUM(spend[campaign], τ∈[t-N, t])
unit: ratio
grain: (ad_id, campaign_id, date)
source: winners pipeline — ad_cum_spend_share_3d, _7d, _15d
depends_on: [spend_share]
attribution: none
window: Nd-backward
parameterization: N ∈ {3, 7, 15}
used_by:
  - winning-creative-constitution:criterion-1-spend (3d variant)
  - winning-creative-constitution:criterion-2-receita (3d, 7d, 15d variants)
status: ratified
```

**Definition.** Spend share computed over the trailing N days, not just the current day. Smooths out single-day noise so the classifier doesn't over-credit one-day spikes.

---

### `cum_spend_share.Nd.forward`

```yaml
id: cum_spend_share.Nd.forward
name: Cumulative Spend Share — forward N days
category: windowed
formula: SUM(spend[ad], τ∈[t, t+N]) / SUM(spend[campaign], τ∈[t, t+N])
unit: ratio
grain: (ad_id, campaign_id, date)
source: winners pipeline — ad_cum_spend_share_next_3d, _next_7d, _next_15d
depends_on: [spend_share]
attribution: none
window: Nd-forward
parameterization: N ∈ {3, 7, 15}
used_by:
  - winning-creative-constitution:criterion-1-spend
  - winning-creative-constitution:criterion-2-receita
status: ratified
```

**Definition.** Spend share computed over the N days *after* a reference date — used when the classifier has retrospective access to post-activation performance.

---

### `cum_roas.Nd.backward`

```yaml
id: cum_roas.Nd.backward
name: Cumulative ROAS — trailing N days
category: windowed
formula: SUM(revenue.attributed[ad], τ∈[t-N, t]) / SUM(spend[ad], τ∈[t-N, t])
unit: ratio
grain: (ad_id, date)
source: winners pipeline — ad_cum_roas_3d, _7d, _15d
depends_on: [revenue.attributed, spend]
attribution: model
window: Nd-backward
parameterization: N ∈ {3, 7, 15}
used_by:
  - winning-creative-constitution:criterion-2-receita (creative ROAS floor)
status: ratified
```

**Definition.** ROAS computed over a trailing N-day window. Tests whether the creative has sustained performance, not just a one-day spike.

---

### `cum_roas.Nd.forward`

```yaml
id: cum_roas.Nd.forward
name: Cumulative ROAS — forward N days
category: windowed
formula: SUM(revenue.attributed[ad], τ∈[t, t+N]) / SUM(spend[ad], τ∈[t, t+N])
unit: ratio
grain: (ad_id, date)
source: winners pipeline — ad_cum_roas_next_3d, _next_7d, _next_15d
depends_on: [revenue.attributed, spend]
attribution: model
window: Nd-forward
parameterization: N ∈ {3, 7, 15}
used_by:
  - winning-creative-constitution:criterion-1-spend (next-7d ≥ 1.0)
  - winning-creative-constitution:criterion-2-receita
status: ratified
```

**Definition.** ROAS computed over a forward N-day window. Used when evaluating whether a creative that entered on day t earned its keep over the following week.

---

### `spend_rank`

```yaml
id: spend_rank
name: Spend Rank (daily)
category: campaign_relative
formula: DENSE_RANK() OVER (PARTITION BY campaign_id, date ORDER BY spend DESC)
unit: rank
grain: (ad_id, campaign_id, date)
source: winners pipeline — spend_rank
depends_on: [spend]
attribution: none
window: point-in-time
used_by:
  - winning-creative-constitution:criterion-2-receita (top-5)
status: ratified
```

**Definition.** The creative's rank by daily spend inside its campaign. Lower is better (rank 1 = highest spend).

---

### `spend_rank.Nd`

```yaml
id: spend_rank.Nd
name: Spend Rank (N-day window)
category: windowed
formula: DENSE_RANK() OVER (PARTITION BY campaign_id, window ORDER BY SUM(spend) OVER (trailing N days) DESC)
unit: rank
grain: (ad_id, campaign_id, date)
source: winners pipeline — spend_3d_rank
depends_on: [spend]
attribution: none
window: Nd-backward
parameterization: N ∈ {3}
used_by:
  - winning-creative-constitution:criterion-1-spend (top-2 within 3d)
status: ratified
```

**Definition.** Spend rank computed over an N-day trailing window rather than a single day. Currently only the 3-day variant is used by the classifier.

---

## Windowed Signals

Metrics that live in the time-structure domain: baselines, deltas, time-weighted accumulators. Used by the rules more than by dashboards.

### `delta_relativo`

```yaml
id: delta_relativo
name: Relative Delta (Δ)
category: windowed
formula: (metric_post - metric_baseline) / metric_baseline
unit: ratio
grain: (campaign_id, date)
source: winners pipeline — campaign_spend_3d_rel_diff_d0, campaign_revenue_3d_rel_diff_d0, campaign_roas_3d_rel_diff_d0, etc.
depends_on: [<any campaign-level metric>]
attribution: inherits from the wrapped metric
window: pre-vs-post comparison
parameterization:
  - metric ∈ {spend, revenue.attributed, roas}
  - window ∈ {3d, 7d}
  - baseline = d0 (day before creative activation)
used_by:
  - winning-creative-constitution:criterion-1-spend
  - winning-creative-constitution:criterion-2-receita
status: ratified
spec_ref: spec/creative-metrics#relative-campaign-deltas-for-winning-classification
```

**Definition.** Relative change in a campaign-level metric comparing a post-activation window against a baseline point (typically d0 = day before the creative entered the campaign). The core "did this creative move the needle?" signal.

**Domain terms.** [[domain-dictionary#baseline-temporal-d0]].

---

### `time_weighted_cumulative_spend`

```yaml
id: time_weighted_cumulative_spend
name: Time-Weighted Cumulative Spend (C)
category: windowed
formula: |
  C(t) = Σ_{τ=1..t} spend(τ) · τ + prior
  where prior = mean first-full-day spend across historical creatives (or campaigns)
unit: BRL · days  (weighted sum, not BRL)
grain: (ad_id, date) or (campaign_id, date)
source: computed by the removal rule; not materialized in this dataset
depends_on: [spend]
attribution: none
window: lifetime (from ad's day 1 to current day)
parameterization:
  - subject ∈ {ad, campaign}
used_by:
  - creative-removal-constitution:heuristic (C_i / C_c)
status: ratified
spec_ref: spec/creative-metrics#time-weighted-cumulative-spend
```

**Definition.** A Bayesian accumulator that biases recent days more heavily than older days. The prior prevents day-1 explosions; the time-weighting gives recent evidence more pull than historical performance. Computed once for the creative (`C_i`) and once for the campaign (`C_c`).

---

### `removal_heuristic`

```yaml
id: removal_heuristic
name: Removal Heuristic (H)
category: windowed
formula: time_weighted_cumulative_spend[ad] / time_weighted_cumulative_spend[campaign]
unit: ratio
grain: (ad_id, campaign_id, date)
source: computed by the removal rule
depends_on: [time_weighted_cumulative_spend]
attribution: none
window: lifetime
used_by:
  - creative-removal-constitution:decision-rule (H < threshold → remove)
status: ratified
spec_ref: spec/creative-metrics#removal-heuristic
```

**Definition.** The removal rule's decision variable. When `H` falls below `threshold_removal` (operational default: 0.10) and the creative's `ad_age ≥ 10`, Maestro retires the creative at its next pass.

---

## Lifecycle Metrics

Measured quantities that describe the state of a creative or campaign in time. Treated as metrics because they have formulas and parameterize every evaluation window.

### `ad_age`

```yaml
id: ad_age
name: Ad Age
category: lifecycle
formula: DATE_DIFF(observation_date, rollout_date, DAY)
unit: days
grain: (ad_id, observation_date)
source: performance.ad_age = DATE_DIFF(date, rollout_date, DAY)
depends_on: [rollout_date]
attribution: none
window: point-in-time
used_by:
  - creative-removal-constitution (min_age_days = 10)
  - winning-creative-constitution (max age ≤ 15)
status: ratified
```

**Definition.** Days elapsed since the creative's [[domain-dictionary#rollout-date]]. Not a performance signal; a *gate* that determines when other rules are allowed to evaluate the creative.

---

### `campaign_age`

```yaml
id: campaign_age
name: Campaign Age
category: lifecycle
formula: DATE_DIFF(observation_date, campaign_first_spend_date, DAY)
unit: days
grain: (campaign_id, observation_date)
source: winners pipeline — campaign_age
depends_on: [spend]
attribution: none
window: point-in-time
used_by:
  - winning-creative-constitution (campaign_age ≥ 7)
status: ratified
```

**Definition.** Days elapsed since the campaign's first spend date. Eligibility floor — avoids crediting a creative with moving a campaign that itself just launched.

---

## The ROAS Identity

The ROAS metric decomposes into four other metrics in this dictionary:

```
roas = (1000 · ctr · conv_rate.attributed · average_ticket) / cpm
```

| Factor | Funnel stage | Metric ID |
|---|---|---|
| CTR | impression → click | `ctr` |
| Conv Rate (Modelada) | click → order | `conv_rate.attributed` |
| Average Ticket | order → revenue | `average_ticket` |
| CPM (denominator) | cost per impression | `cpm` |

This identity is why creatives are the dominant lever in performance marketing — they shape every numerator term and, indirectly, the denominator (the platform auction rewards creatives with higher predicted outcomes). See [[axiom/creative-axioms#ax-crt-1--creatives-produce-extraordinary-financial-outcomes]].

---

## Open Points

- **`× 100` drift on conversion rates.** Spec mandates × 100 (percent); SQL omits it (ratio). Both `conv_rate.raw` and `conv_rate.attributed` carry `status: drift`. Resolving requires a decision on whether percent or ratio is canonical, then normalizing either the spec or the SQL.
- **No attribution-model version tag on any metric.** Every entry with `attribution: model` silently depends on whichever version of the internal model was active at query time. Adding an explicit `attribution_version` field to attributed metrics is overdue — see [[spec/creative-metrics#open-points]].
- **`roas.raw` is not materialized.** Declared here but not present in the performance table. Materializing it would give analysts a cheap triangulation column.
- **`time_weighted_cumulative_spend` and `removal_heuristic` are not materialized.** Computed on the fly inside the removal rule's code path. If they became materialized columns in a scheduled table, debugging removal decisions would be much faster.
- **Multi-product orders inflate `average_ticket`.** Order-level ticket ≠ SKU-level ticket. Stock-criterion winning classifications should use SKU-attributed revenue, not order-attributed revenue. Flagged in [[spec/creative-metrics#open-points]] item 3.
- **Embedding-derived metrics are not modeled.** Vector similarity, cluster membership, nearest-winner distance — none exist here yet. Will land only if a rule depends on them.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[domain-dictionary]] | `pairs-with` | Domain-dictionary names concepts; this dictionary names numbers. Every metric references a concept there. |
| [[spec/creative-metrics]] | `implements` | The spec is the narrative explanation; this is the flat registry. Formulas must match. |
| [[constitution/winning-creative-constitution]] | `consumed-by` | Criteria 1, 2, 3 all reference metrics registered here |
| [[constitution/creative-removal-constitution]] | `consumed-by` | The heuristic consumes `spend`, `spend_share`, `time_weighted_cumulative_spend`, `removal_heuristic` |
| [[axiom/creative-axioms]] | `justified-by` | AX-CRT-4 is what makes spend-based metrics decision-grade |
| [[premise/creative-premises]] | `justified-by` | P-CRT-5, P-CRT-6, P-CRT-7, P-CRT-8 are the specific bets these metrics support |
| [data/performance/](../data/performance/README.md) | `sourced-from` | Primary metrics land here |
| [data/winners/](../data/winners/README.md) | `sourced-from` | Windowed and campaign-relative signals are computed in this pipeline |
