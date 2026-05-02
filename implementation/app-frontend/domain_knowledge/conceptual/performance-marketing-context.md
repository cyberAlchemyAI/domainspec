---
tags: [performance-marketing, history, strategy]
node_type: conceptual
is_session: false
layer: market, domain
nature: explanatory
status: exploratory
version: 0.1.1
last_updated: 2026-04-22
---

# Performance Marketing — Context

> Background context for the rest of the creatives graph. Explains what performance marketing is, how the market got here, and what operating posture Insider takes inside it. Not a product spec — it is the environment the creative axioms and premises are set in.

---

## Objective

This document answers three questions:

1. What does "performance marketing" mean in this graph?
2. What did the world look like before the current infrastructure existed, and how did that shape the discipline?
3. How does Insider specifically operate inside this market?

Without this context, the axioms and premises read like isolated assertions. With it, they read as responses to a specific shape of the world.

---

## Index

1. [Definition](#definition)
2. [Historical Context — Before vs. Now](#historical-context--before-vs-now)
3. [Insider's Flywheel](#insiders-flywheel)
4. [Insider's Operating Posture](#insiders-operating-posture)
5. [The Four Levers](#the-four-levers)
6. [Why Creatives Became the Focus](#why-creatives-became-the-focus)
7. [Connections](#connections)

---

## Definition

> **Performance marketing** is a marketing process automated to the point where it can be steered by declaring a business objective into a software system. The system must be intelligent enough to understand a high-level objective (e.g., acquire new customers, maximize revenue), learn from past outcomes, and optimize future actions. — *Introduction to Algorithmic Marketing*, p. 4

Two features follow from this definition:

- The target of optimization is a **business objective**, not a campaign output
- The system must **close the loop** — past outcomes feed future actions

Everything in `/domain_knowledge` is structured around making that loop legible and controllable for the creatives lever.

---

## Historical Context — Before vs. Now

### What it used to be

- Impressions sold directly between advertiser and publisher (manual negotiation)
- Limited cross-site user tracking
- Primitive attribution models
- No meaningful regulation

**Consequences:**
- Hard to know which channels actually worked
- Heavy operational overhead per campaign
- Coarse, slow data
- Ad spam that eroded brand equity

### What it is now

- Cross-device user identification (IDs, third-party cookies, server-side tracking)
- Real-time auctions for impressions (RTB)
- Sophisticated attribution (multi-touch, data-driven, incrementality tests)
- Global regulation and consent requirements (LGPD, GDPR, ATT)

**Consequences for creatives:**
- Creatives can be iterated faster and tested in live auctions
- Attribution gives per-creative revenue, which makes classification (Criativo Vencedor) possible
- Regulatory constraints on tracking increase the value of creative itself (context) relative to audience (demographics)

---

## Insider's Flywheel

Insider's growth model is a flywheel where operational excellence and hiring (People) funds marketing investment, which acquires customers, which generates data, which improves content, which lowers acquisition cost, which funds more of the same. Creatives sit at the junction of **investment in marketing → more clients → more data → better content → lower acquisition cost**.

```
People → EOS → marketing investment
                  ↓
            more clients ←───────────┐
                  ↓                  │
             more data               │
                  ↓                  │
    better content / distribution    │
                  ↓                  │
       lower acquisition cost ───────┘
```

Creatives appear twice in this loop: as **input** (the content being served) and as **output** (the data about what works). The Creative Ops area is what closes the loop for this specific lever.

---

## Insider's Operating Posture

Three choices distinguish how Insider runs performance marketing:

1. **Optimize for ROAS per acquisition**, not volume at a ROAS floor.
2. **Dynamic budget that follows performance**, not a pre-committed monthly spend.
3. **Use internal attribution** as the primary decision signal, complemented by occasional lift tests.

### 2025 Snapshot

- Investimento: R$ 7.3M
- Receita Atribuída: R$ 31M
- Receita Bruta Atribuída (após CMV e frete): R$ 14.7M
- ROAS Margem: 2.2
- Meta concentrates >70% of spend

Google and Meta are the two primary channels, with TikTok still below 1% of attributed revenue as of 2025-Q1.

---

## The Four Levers

Performance marketing decisions operate on four axes:

1. **User segmentation** — who sees the ad
2. **Bid** — how much we're willing to pay per slot
3. **Campaign structure** — how ad sets and audiences are organized
4. **Creatives** — what the user actually sees

The expected value of a bid decomposes as:

```
E[bid] = P(click | impression) × P(purchase | click) × E[ticket | purchase]
```

Creatives enter **every term** of this decomposition: they shape click probability, conversion probability, and ticket size. This is why creatives are treated as the dominant lever — not because bid and structure don't matter, but because creatives touch all three terms simultaneously.

---

## Why Creatives Became the Focus

In H2/2024 the team made an explicit bet: the largest-remaining upside on the performance marketing channel was not in refining segmentation or bids, but in establishing a durable **production → rollout → evaluation → retirement** pipeline for creatives.

The 2024 → 2025 H1 result validated the bet:

| Year | Receita | Spend | ROAS | Ads |
|---|---|---|---|---|
| 2024 | R$ 6.9M | R$ 5M | 1.37 | 173 |
| 2025 H1 (through 2025-07-26) | R$ 27M | R$ 13.5M | 2.0 | 1,233 |

Revenue grew 3.88x on 2.66x spend while the number of creatives grew ~7x. The pipeline — not the individual creatives — was what scaled.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[axiom/creative-axioms]] | `contextualizes` | The axioms are responses to this market and history |
| [[premise/creative-premises]] | `contextualizes` | The premises encode Insider's specific operating posture |
| [[conceptual/creative-flows]] | `contextualizes` | The sourcing flows exist inside the Meta-heavy channel mix described here |
| [[domain-dictionary]] | `contextualizes` | Terms used in this document are defined in the dictionary |
