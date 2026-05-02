---
tags: [creatives, performance-marketing]
node_type: premise
is_session: false
layer: domain
nature: technical
status: exploratory
version: 0.2.1
last_updated: 2026-04-22
---

# Creative Premises

> Working hypotheses about how creative operations should be run — at Insider specifically, under the current stack (Meta-heavy, internal attribution, context-based segmentation). Each premise carries explicit `convicção` and `veracidade`. These are expected to be revised as evidence accumulates.

---

## Objective

This document captures the **operational bets** the team is currently making about creatives. It answers the question: *"What do we believe about how to run creative operations — and how confident are we in each belief?"*

Unlike axioms (taken as given), premises are actively revisable. When a premise is falsified, the rules derived from it must be re-examined.

---

## Index

1. [Strategic Bets — How to Run the Area](#strategic-bets--how-to-run-the-area)
2. [Operational Bets — How to Rank and Retire Creatives](#operational-bets--how-to-rank-and-retire-creatives)
3. [Structural Bets — How to Organize the System](#structural-bets--how-to-organize-the-system)
4. [Connections](#connections)

---

## Strategic Bets — How to Run the Area

### P-CRT-1 — Volume beats prediction
`convicção: high` `veracidade: high`

Because predicting winners is effectively impossible (see [[axiom/creative-axioms#AX-CRT-2]]), the highest-leverage investment is in increasing the **number** of creatives we test per unit time, not in increasing the average quality of any single creative. From 2024 to 2025 H1, creative count grew from 677 → 1,469 alongside 2.66x spend and 3.88x attributed revenue growth.

*Validated: the 2025 H1 result is the primary evidence. Bet that it continues to hold at higher volumes.*

### P-CRT-2 — Exploit proven angles across products
`convicção: high` `veracidade: medium`

Once a creative wins, the angle it used can be systematically replicated across other products to raise the base rate of future winners. The stirrup-nao-marca → 16+ derivatives chain is the canonical example.

*Replication works in practice; no formal measurement of the replication-winner rate vs. a cold-start rate.*

### P-CRT-3 — Creatives are the dominant lever in performance marketing
`convicção: high` `veracidade: medium`

Among the four available levers — user segmentation, bid, campaign structure, and creatives — creatives produce the largest outcome variance. This is why the team invested H2/2024 in building a creative pipeline rather than refining segmentation or bidding.

*Defensible against internal comparison; not formally A/B tested against a creatives-frozen baseline.*

### P-CRT-4 — Context-based segmentation beats demographic segmentation
`convicção: medium` `veracidade: medium`

Segmenting campaigns by the creative shown (FEM / MASC / PROMO) rather than by demographic targeting lets the network optimize delivery against signals embedded in the creative itself. Currently used as the primary segmentation strategy on Meta.

*Under active revision: H2/2025 is moving toward "dor do cliente" segmentation based on a Shapermint mentorship. If the new structure outperforms, `convicção` on P-CRT-4 drops.*

---

## Operational Bets — How to Rank and Retire Creatives

### P-CRT-5 — Day-1 spend share predicts future spend
`convicção: high` `veracidade: high`

A creative that fails to capture ≥5% spend share on its first full day has ~1.4% probability of reaching ≥15% spend share over the following 7 days. Day-1 performance is therefore an actionable predictor for early retirement.

*Validated on 2024 backtest. Source: Nicholas Domene's analysis referenced in the removal-rule document. Revalidation recommended annually.*

### P-CRT-6 — A Bayesian time-weighted spend-share heuristic is the right removal signal
`convicção: high` `veracidade: medium`

Carrying past spend-share as a prior (with time-weighted updates favoring recent days) gives creatives that were once strong a grace period before removal, while still pulling the trigger on creatives that never performed. Backtested false-negative rates at spend-share thresholds of ≥7.5% and ≥10% are 1.72% and 0.57%, respectively.

*Validated against 2024 creatives (n=349). Continuously monitored via 10% contrafactual sampling.*

### P-CRT-7 — Three criteria × three tiers capture creative-level impact
`convicção: medium` `veracidade: low`

A creative is classified as winning under at most three criteria (ROAS, Spend, Stock), each at three tiers (Good, Success, Super Success). The thresholds were set partly by distribution percentiles and partly by empirical iteration.

*Low veracidade: the thresholds have not been tested against a held-out period, and the Stock criterion in particular uses hard-coded values that may not generalize.*

### P-CRT-8 — 15-day evaluation window captures most creative impact
`convicção: medium` `veracidade: medium`

Creatives older than 15 days are excluded from the Criativo Vencedor evaluation, under the hypothesis that relevant impact manifests early. Backtest shows 147 qualifying creatives at unlimited window vs. 109 at 15 days (38 false negatives).

*Trade-off accepted; the 38 edge cases are not currently re-evaluated after the window closes.*

### P-CRT-9 — Maximizing ROAS per acquisition is the right optimization target
`convicção: high` `veracidade: high`

The team operates to maximize ROAS on each acquisition rather than holding ROAS at a target and maximizing volume. This choice underwrites the dynamic-budget posture (P-CRT-10) and the removal rule's willingness to cut creatives that have not yet proven ROAS.

*Validated by sustained 2.0 ROAS and 3.88x revenue growth in 2025 H1.*

### P-CRT-10 — Budget should follow performance, not a monthly plan
`convicção: high` `veracidade: high`

We operate a dynamic budget that scales up when ROAS holds and scales down when it erodes, rather than committing to a fixed monthly spend. This is the operating posture of the Performance Marketing team.

*Validated empirically over 2024–2025.*

---

## Structural Bets — How to Organize the System

### P-CRT-11 — Creative Operations deserves to exist as a discrete area
`convicção: high` `veracidade: medium`

The analytic, operational, and feedback-loop responsibilities around creatives are distinct enough from bid, segmentation, and campaign-structure work that they warrant a dedicated area (Creative Ops) and a dedicated system (Creatives Manager). See the founding document.

*The area has been running for one cycle and has produced the removal rule, the winning-creative classification, and the TRAMA attribute schema. Full validation pending another cycle of observed outcomes.*

### P-CRT-12 — The Creatives Manager system must own register-allocate-evaluate end-to-end
`convicção: high` `veracidade: medium`

A single system records creative metadata, allocates creatives into campaigns, evaluates their performance, and feeds decisions back to production. Splitting this across tools fragments the feedback loop and loses information between stages.

*In place via CapoMastro + Maestro + Creatives Please integration. Friction exists in the Briefings Especiais flow, which indicates the integration is incomplete, not that the bet is wrong.*

### P-CRT-13 — Low-effort sources (Post Influs) need their own test-campaign lane
`convicção: high` `veracidade: low`

The Post Influ flow produces more approved content than the main campaigns can absorb (141-creative backlog as of 2025-07). Rather than starving the backlog, a dedicated test-campaign lane will pre-qualify content before it reaches the main campaigns.

*Planned for H2/2025, not yet implemented. Falsified if the test-lane hit rate is indistinguishable from random.*

### P-CRT-14 — Every automatically generated creative must carry complete lineage
`convicção: high` `veracidade: low`

When a creative is produced by an automated generation system (TRAMA or any successor), the system must persist the full causal chain that produced it: parent creative(s), reference assets, agent prompts and decisions, template resolution, and output metadata. Lineage is the primary epistemic asset of automated creative production — the side-effect dataset that hand-tagged creatives structurally cannot produce, and the substrate on which every future iteration of the agents will be trained, evaluated, and debugged. Without it, auto-generation delivers only a production-speed win; with it, it becomes a compounding knowledge asset.

This premise is **prescriptive**: it is the non-negotiable structural property we commit to for any auto-generation system entering the Creatives Manager pipeline. It cascades into a schema change in the creative-attribute constitution (the addition of parent-lineage fields) and into contracts for every agent in the generation pipeline.

*Not yet validated: TRAMA has produced no creatives. Falsifiable when, in production, lineage either proves load-bearing (measurable agent improvement from lineage-derived datasets, downstream analytics unlocked) or does not. Falsification would demote this from a structural must-have to an optional instrumentation.*

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[axiom/creative-axioms]] | `derives-from` | Every premise here traces to one or more axioms |
| [[constitution/winning-creative-constitution]] | `derives-from` | P-CRT-7, P-CRT-8, P-CRT-9 justify the classification rules |
| [[constitution/creative-removal-constitution]] | `derives-from` | P-CRT-5, P-CRT-6 justify the removal heuristic |
| [[constitution/creative-attribute-constitution]] | `derives-from` | P-CRT-11, P-CRT-12 justify a formal attribute schema; P-CRT-14 adds parent-lineage fields |
| [[audit/removal-rule-backtest-2024]] | `validates` | 2024 backtest is the empirical evidence for P-CRT-5 and P-CRT-6 |
| [[discovery/segmentation-dores-do-cliente]] | `questions` | Directly questions P-CRT-4; outcome drives revision |
| [[discovery/removal-rule-ab-testing]] | `questions` | Surfaces an open question on P-CRT-6 (current rule vs. alternatives) |
| [[discovery/creative-embedding-applications]] | `questions` | Candidate new premise P-CRT-15 depends on this discovery |
| [[backlog/creative-attribute-pending]] | `depends-on` | Implementation track for P-CRT-14 lives in the backlog |
| [[conceptual/performance-marketing-context]] | `contextualizes` | The historical context makes these bets interpretable |
| [[conceptual/creative-flows]] | `contextualizes` | P-CRT-12 and P-CRT-13 reference the sourcing flows described there |
