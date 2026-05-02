---
tags: [creatives, sourcing, operations]
node_type: conceptual
is_session: false
layer: domain
nature: explanatory
status: exploratory
version: 0.1.1
last_updated: 2026-04-22
---

# Creative Sourcing Flows

> The three ways creatives enter the system, the operational steps each follows, and the trade-offs that shaped the current design. Background for the Creatives Manager system and the constitutions that govern it.

---

## Objective

This document describes, at a high level, how creatives are sourced, approved, registered, placed into campaigns, and retired. It answers: *"Where do creatives come from, and what is the path each type takes from idea to live campaign?"*

It is not an implementation spec. It describes the flows as they operate today, with their observed friction points — which the constitutions and premises respond to.

---

## Index

1. [The Three Sources](#the-three-sources)
2. [Common Path — After Approval](#common-path--after-approval)
3. [Source 1 — Produção Interna](#source-1--produção-interna)
4. [Source 2 — Briefings Especiais](#source-2--briefings-especiais)
5. [Source 3 — Posts Influs](#source-3--posts-influs)
6. [Systems Involved](#systems-involved)
7. [Known Friction](#known-friction)
8. [Connections](#connections)

---

## The Three Sources

As of 2025-07-26:

| Source | #Ads | Spend | ROAS |
|---|---|---|---|
| Produção Interna | 1,001 | R$ 12M | 1.49 |
| Posts Influs | 391 | R$ 1.5M | 1.38 |
| Briefing Especial | 77 | R$ 0.6M | 1.34 |

Each source feeds the same downstream pipeline after approval. The differences are upstream — in cost, operator effort, and how content is ideated.

---

## Common Path — After Approval

Once approved, every creative follows the same path:

```
Creative (approved) → CapoMastro → Maestro → Campaign → [Removal Rule] → Morte
```

1. Register metadata in **CapoMastro** (produto, tema, campanha, source, etc.)
2. **Maestro** selects from the queue and places the creative into a campaign when there is a slot
3. The creative accumulates spend and performance for up to 10 days before becoming eligible for removal
4. The Creative Removal Rule evaluates spend share; if the creative underperforms, Maestro removes it
5. Removed creatives are archived but not re-evaluated — they exit the pipeline ("Morte")

---

## Source 1 — Produção Interna

Creatives ideated internally — images and videos — drawing from:

- External references (trends observed off-platform)
- Top-performing creatives already in our campaigns
- Benchmark brands (Shapermint, True Classic)

**Approval:** internal review, then direct registration in CapoMastro.

**Characteristics:**
- Largest volume by far
- Highest ROAS among the three sources (1.49)
- Fully under operational control

This is the flow the Creative Ops area was primarily designed around.

---

## Source 2 — Briefings Especiais

One-off creative requests routed to the Influs squad, outside the standard production contract.

**Path:**
1. Brief created for the Influs squad
2. Squad locates an available influencer
3. Content is recorded (extra cost)
4. Internal approval
5. Registered in CapoMastro and follows the common path

**Characteristics:**
- Highest operational overhead
- Lowest ROAS of the three (1.34)
- Currently the noisiest flow: low visibility into what's in flight vs. what reached the campaign vs. what was rejected
- Paid content outside the baseline influencer contract

**Active work:** improving visibility and operational leverage. The Influs team is separately working on reducing per-briefing effort.

---

## Source 3 — Posts Influs

Organic influencer posts captured from the existing content pipeline.

**Path:**
1. Content surfaces in **Mighty Scout** (external)
2. Approved in **Creatives Please** (approval tool)
3. Cards auto-generated in CapoMastro
4. Prioritized by organic-performance metrics
5. Placed in campaign when a slot exists

**Characteristics:**
- Lowest operator effort per creative
- Already-high organic signal (the content performed organically before being promoted)
- Middle ROAS (1.38)
- **Overflow problem:** 141 approved posts backlogged without campaign slots as of 2025-07

**Active work:** a dedicated test-campaign lane will pre-qualify backlogged posts before they move to main campaigns (see [[premise/creative-premises#P-CRT-13]]).

---

## Systems Involved

| System | Role |
|---|---|
| **Mighty Scout** | External content-discovery platform. Upstream of Posts Influs flow. |
| **Creatives Please** | Approval gate for Mighty-Scout-sourced content before it enters CapoMastro. |
| **CapoMastro (CM)** | Internal system of record. Stores creative metadata. Central queue. |
| **Maestro** | Orchestrator. Handles rollout and removal against the networks (Meta, Google, etc.). |
| **Ad platforms** | Meta, Google, TikTok, Criteo, Bing, Pinterest. Meta concentrates >70% of spend. |

---

## Known Friction

Three friction points, in order of severity:

1. **Visibility on Briefings Especiais** — it's unclear at any given moment what's in briefing, what's been recorded, what's been approved, and what has reached a campaign. Under active work.
2. **Post Influ backlog** — more content is approved than campaigns can absorb. Being addressed via test-campaign lanes.
3. **Campaign structure may be suboptimal** — a mentorship with Shapermint flagged that the current FEM/MASC/PROMO structure likely over-spends. A reorganization into "dores do cliente" buckets is one of the major H2/2025 bets.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[conceptual/performance-marketing-context]] | `contextualizes` | These flows live inside Insider's operating posture |
| [[premise/creative-premises]] | `contextualizes` | P-CRT-12, P-CRT-13 make claims about the system that owns these flows |
| [[constitution/creative-removal-constitution]] | `contextualizes` | The removal rule operates on creatives in the common path |
| [[constitution/creative-attribute-constitution]] | `contextualizes` | The attribute schema is the metadata format for CapoMastro registration |
| [[domain-dictionary]] | `contextualizes` | Terms used here are defined in the dictionary |
