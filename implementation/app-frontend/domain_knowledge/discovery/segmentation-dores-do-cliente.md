---
tags: [creatives, segmentation, strategy]
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

# Discovery — "Dores do Cliente" Segmentation

## Objective

Explore whether replacing the current FEM / MASC / PROMO / PROMO2 context segmentation on Meta with a segmentation structured around **customer pain points** ("dores do cliente") produces better channel outcomes than the current structure. Answers: *"What would a pain-point-organized campaign structure look like, what would it replace, and what evidence would let us decide to adopt, modify, or reject it?"*

This discovery is the explicit H2/2025 revision bet flagged in [[premise/creative-premises#p-crt-4--context-based-segmentation-beats-demographic-segmentation]] and [[conceptual/creative-flows#known-friction]]. Its outcome directly governs whether P-CRT-4 retains `convicção: medium` or drops, and whether `03. Audiência` in the attribute constitution needs a value-catalog overhaul.

---

## Context

- The current segmentation (FEM / MASC / PROMO / PROMO2) encodes **who the creative is aimed at** (audience archetype + product flavor), not **what need it speaks to**.
- A Shapermint mentorship in H1/2025 surfaced the hypothesis that the current structure likely over-spends — too many ad sets competing for the same pocket of attention — and that organizing campaigns around customer pain points (e.g., *"não tenho tempo"*, *"quero parecer mais alta"*, *"não quero marcar"*) would let Meta's optimizer isolate intent more cleanly.
- The current segmentation is documented in [[domain-dictionary#audi%C3%AAncia]] and enforced by [[constitution/creative-attribute-constitution#03-audi%C3%AAncia]].

---

## Open Questions

1. **What is the minimum viable list of pain points?** Too few collapses into the current structure; too many fragments spend below the network's learning-phase floor.
2. **How does a pain-point campaign coexist with PROMO mechanics?** Promo creatives speak to price/deal, not pain — they may need to stay on a separate axis.
3. **Re-labeling cost.** Every existing creative in CapoMastro carries an `Audiência`. Moving to pain points requires either retroactive relabeling or a dual schema during transition.
4. **Attribution continuity.** When the segmentation shifts, pre-shift and post-shift performance are not comparable at the ad-set level. Do we version-tag the structure change the way we should be tagging attribution model versions?
5. **What's the decision rule?** If the new structure ships at cost X and produces outcome Y, what Y triggers adopt / revert / iterate?

---

## Candidate Approach

A staged rollout rather than a cutover:

1. **Side-lane experiment.** Run 3–5 pain-point campaigns in parallel with the existing FEM / MASC structure, spending ≤ 15% of Meta budget. Same creatives, different campaign containers.
2. **Measurement.** Compare creative-level ROAS and `cum_spend_share.7d.forward` between the same creative running in a pain-point campaign vs. a current-structure campaign.
3. **Gate.** Only proceed to full rollout if the pain-point campaigns dominate on both metrics, controlling for spend.

---

## Evidence Needed

- Shapermint case study (referenced in mentorship, not yet captured in this graph).
- Meta's own documentation on ad-set learning-phase requirements at different spend levels — to size the pain-point list correctly.
- Backtest: segment 2025 H1 creatives by their implicit pain point (manual labeling) and compute whether pain-point cohorts show different performance curves.

---

## Consequences if Adopted

- [[premise/creative-premises#p-crt-4--context-based-segmentation-beats-demographic-segmentation]] — re-evaluation; `convicção` likely drops, replaced by a new premise encoding pain-point segmentation.
- [[constitution/creative-attribute-constitution#03-audi%C3%AAncia]] — value catalog changes; schema version bump; all existing creatives re-labeled.
- [[domain-dictionary#audi%C3%AAncia]] — entry rewritten to describe pain-point buckets.
- Campaign naming convention on Meta changes; data-pipeline parsers that extract audience from `campaign_name` need updates.

---

## Consequences if Rejected

- P-CRT-4 retains current `convicção`, potentially upgraded to `high`.
- This discovery supersedes itself with a written-up rationale for *why* pain-point didn't win — which is itself useful (avoids re-litigating the idea).

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[premise/creative-premises]] | `questions` | Directly questions P-CRT-4; outcome drives revision |
| [[constitution/creative-attribute-constitution]] | `questions` | Outcome reshapes the `Audiência` value catalog |
| [[domain-dictionary]] | `contextualizes` | `Audiência`, `Campanha`, and `Ângulo` are the concepts in play |
| [[conceptual/creative-flows]] | `contextualizes` | Known friction #3 is this question |
| [[conceptual/performance-marketing-context]] | `contextualizes` | The four-levers framing motivates testing segmentation changes directly |
