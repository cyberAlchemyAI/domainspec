---
tags: [vault, research, graph-as-residue-attractor]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.1
last_updated: 2026-05-19
backfilled: true
analysis-method: post-hoc-independent-read
---

# Research — Graph as Residue Attractor

> **Backfill note.** This research synthesis was written AFTER `discovery.md` was already drafted (the discovery was written earlier on 2026-05-17 from the 7 lenses directly, without an intermediate research-layer document). It exists to retrofit the new convention's lens → research → discovery chain onto an existing artifact. The analysis below was conducted post-hoc by reading the 7 lens findings; it deliberately does not look at the discovery during analysis, to test whether the discovery's commitments survive an independent cross-lens read.

## Objective

Synthesize, from the 7 lens findings alone, what the design space around the "graph as residue attractor" claim actually contains — which pieces are mathematically load-bearing, which are metaphor, and which are empirical bets. Surface cross-lens convergence and disagreement before they collapse into the discovery's narrative.

## Lens Inventory

| # | Lens | Framing | Headline finding | Confidence |
|---|------|---------|------------------|------------|
| 01 | [Invariants and layer alignment](../lenses/01-invariants-and-layer-alignment/findings.md) | Structural | 12 schema + 12 instance invariants; 4 alignment residues (convicção, schema-meta evolution, derives-chain circularity, governs-edges enforcement); S7/S12 lack uniqueness sketches | high (`[local-files-read]`) |
| 02 | [EVōC algorithm](../lenses/02-evoc-algorithm/findings.md) | Operational | EVōC's persistence hierarchy is a candidate geometric realizer of the condensation operator; convergence as bottleneck distance on persistence diagrams is falsifiable | high (`[web-fetched]`) |
| 03 | [Gödel / Lawvere limits](../lenses/03-godel-lawvere-limits/findings.md) | Limitative (synthesis) | Lawvere refutes unique-fixed-point framing; reflection-tower is the strongest honest reformulation | **low** (`[model-recall]`) |
| 03b | [Gödel / Tarski / Löb corroborated](../lenses/03b-godel-tarski-lob-corroborated/findings.md) | Limitative (corroboration) | Lens 03's logic-side claims confirmed against SEP/Wikipedia/nLab; no material correction | high (`[web-fetched]`) |
| 03c | [Lawvere / Yanofsky corroborated](../lenses/03c-lawvere-yanofsky-corroborated/findings.md) | Limitative (corroboration) | Lens 03's categorical claims confirmed against Lawvere 1969 TAC PDF and Yanofsky arXiv; precision: weakly-point-surjective is the actual hypothesis | high (`[web-fetched-primary]`) |
| 04 | [Yoneda lemma](../lenses/04-yoneda-lemma/findings.md) | Categorical | Yoneda is load-bearing in exactly 3 places (M2, M6′ base case, forced node identity); upgrades 2 slogans to theorems; "embedding ≈ restricted Yoneda" gives EVōC a principled bridge | high (`[local-files-read, model-recall]`) |
| 05 | [Kauffman precedent check](../lenses/05-kauffman-precedent-check/findings.md) | Adversarial | Kauffman has the synchronic four-component synthesis in print; framework's novel pieces narrow to (i) diachronic reflection tower, (ii) Spivak two-layer split, (iii) RG/Noether physics-precedent framing | high (`[web-fetched]`) |

## Cross-Lens Analysis

### Theme 1 — Math vs metaphor discipline

- **Lenses speaking to it.** 03, 03b, 03c, 04, 05
- **Convergence.** All five lenses converge on the same epistemic posture: theorems-cited (e.g., Lawvere 1.2, Yoneda) carry the source's authority; theorems-as-applied (e.g., "the GKG instantiates Lawvere's hypotheses") are only as load-bearing as the hypothesis check; metaphors (e.g., "residue is the Lawvere diagonal witness") carry no deductive weight. Lens 03c §4 makes this explicit ("the condition that bites is..."), lens 04 §B.5 names the three places Yoneda is actually load-bearing (vs scaffolding), and lens 05 enforces it adversarially.
- **Disagreement.** None across these five. Lens 03 produced the synthesis from recall; 03b/03c corroborated without correcting the formal statements. The verification level disagreement (03 vs 03b/03c) is itself the math-vs-metaphor discipline at work.
- **Resolution.** `[lens-supported]` — the discipline is the working epistemic norm.
- **Implication for discovery.** The discovery must carry per-claim flags (`[theorem-cited]`, `[theorem-as-applied, informal]`, `[metaphor]`, `[empirical bet]`) and must not collapse them to a single document-level confidence. Discovery D-5 honors this.

### Theme 2 — Reflection-tower reformulation as the load-bearing structural revision

- **Lenses speaking to it.** 03, 03b, 03c
- **Convergence.** Lens 03 (recall) proposed the move from "unique fixed point" to "within-level attractor of a canonical reflection tower"; lens 03b corroborated the logic-side argument (G1, G2, Tarski, Löb all push toward stratification or reflection); lens 03c corroborated the categorical-side argument against the Lawvere 1969 TAC PDF directly — precision-confirming "weakly point-surjective" is the actual hypothesis, and offering three escapes (restrict naming, enlarge $Y$, stratify), with stratify identified as the honest move (§5).
- **Disagreement.** Lens 03 cites a `[model-recall]` Yanofsky version; 03c verifies it against the arXiv PDF and finds it correct but adds precision (the universal scheme; T → T×T → Y → Y composite). No material correction.
- **Resolution.** `[lens-supported]` with `[theorem-as-applied, informal]` status — the move is mathematically defensible but not yet Lean-grade against a concrete GKG category.
- **Implication for discovery.** D-1 (the reformulation) is well-grounded. The honest gap (still informal hypothesis-check) must be carried as an open question — OQ-1 (transfinite extension as iterated Yoneda) and OQ-4 (right truth-object $Y$).

### Theme 3 — Yoneda load-bearing-ness

- **Lenses speaking to it.** 04, 05 (adversarial), 03c (uses Yoneda)
- **Convergence.** Lens 04 narrows Yoneda's load-bearing role to three specific places (M2 representability, M6′ base case, forced node-identity criterion). Lens 03c uses Yoneda idiomatically in the Lawvere proof but the headline is cartesian closure + diagonal — confirming lens 04's "scaffolding vs load-bearing" distinction.
- **Disagreement.** None directly, but lens 05 implicitly cautions: the "two slogans upgrade to theorems" claim depends on the typed-edge category being well-defined and locally small. If that base is contested, Yoneda is silent. This is a real load-bearing condition the discovery should not paper over.
- **Resolution.** `[lens-supported]` for the three load-bearing places; `[analyst-judgment]` for "Yoneda is everywhere" being decoration not deductive weight.
- **Implication for discovery.** D-4 (naming the three places explicitly) honors this. The base-category dependency is OQ-3 (M2 representability for the specific category) — not yet decided.

### Theme 4 — Kauffman precedent and novelty repositioning

- **Lenses speaking to it.** 05 alone, but with adversarial implications for 01, 04, the discovery framing
- **Convergence.** None — lens 05 is the sole voice and it lands an adversarial finding: the synchronic four-component synthesis (form-as-conserved + fractal + strange-loop + emergence-via-residue) is prior art in Kauffman's open writings (ANPA 2002, Kybernetes 2005, arXiv 1109.1892). Verified by grep across all three open PDFs.
- **Disagreement.** The discovery's headline framing ("residue attractor") could be read as claiming novel synchronic synthesis. Lens 05 refuses that reading and narrows the novelty claim to three pieces.
- **Resolution.** `[lens-supported]` — adversarial finding stands; novelty must be repositioned.
- **Implication for discovery.** D-3 honors this. The Constructivist Foundations 2009 paper is OQ-7 (unread, gated). The 1987 "Self-reference and recursive forms" and 1995-96 "Virtual logic" are not yet checked — a gap.

### Theme 5 — EVōC relevance and the empirical bridge

- **Lenses speaking to it.** 02 (operational), 04 (categorical bridge)
- **Convergence.** Lens 02 proposes EVōC as the geometric realizer of condensation; lens 04 §4 shows embeddings ARE a partial Yoneda embedding (restriction of $\mathrm{y}$ to an anchor set, scalar-collapsed). The two lenses together yield a falsifiable bridge: a persistence level survives iff the anchors at that resolution form a dense subcategory of the latent typed-edge category.
- **Disagreement.** Lens 02 flags EVōC's algorithm is unpublished and PLSCAN (Bot/McInnes/Aerts 2025) is the only cited cluster-extraction source. Lens 04 does not address this — the categorical bridge is silent on whether EVōC specifically will give faithful results. This is the bridge claim's real risk.
- **Resolution.** `[lens-supported]` for the bridge concept; `[empirical bet]` for whether EVōC instantiates it well.
- **Implication for discovery.** C5 carries the right status (`[empirical bet]`). A-3 (replace EVōC with in-house) is correctly retained as fallback. The "what would move this" section needs at least one EVōC run to give the bridge any evidence either way.

### Theme 6 — Layer alignment, invariants, and the four predicted residues

- **Lenses speaking to it.** 01 alone; 04 touches the typed-edge category dependency
- **Convergence.** Lens 01 is the only lens that decomposed κ into 12+12 invariants and tabulated alignment. Four residues are flagged as prediction sites. Lens 04 reinforces one of them indirectly: chain-circularity (residue iii) is exactly the M2-analog Yoneda flags.
- **Disagreement.** S7 and S12 lack uniqueness sketches in lens 01 §D — flagged as `[honest gap]`. No other lens engages this directly.
- **Resolution.** `[lens-supported]` for the residue catalog; `[honest gap]` for S7/S12; `[empirical bet]` for the prediction that new constitutions emerge at the four residues over the next month.
- **Implication for discovery.** OQ-2 and OQ-5 are honest carriers of this. The discovery should not over-claim the four-residue prediction's confidence until +30d audit data exists.

## Unique Contributions

- **Lens 01.** The only lens that produced a complete invariant catalog (24 total) and explicit alignment table. The boundary-statement enumeration (§E, 7 boundary cases) is also unique to 01.
- **Lens 02.** The only lens with an operational pipeline proposal and a concrete convergence metric (bottleneck distance on persistence diagrams). The PLSCAN provenance trail is unique to 02.
- **Lens 03.** The original synthesis statement that triggered the corroboration runs. Its enduring value is the synthesis-then-falsify shape — lens 03 is the artifact that lenses 03b/03c exist *to audit*.
- **Lens 03b.** Verifiable source-chain for the logic side. Unique value: the verification ledger format (URL / status / notes) and the honest negatives section.
- **Lens 03c.** Primary-source quotes from Lawvere 1969 directly. Unique to 03c: the precision that "weakly point-surjective" (not point-surjective) is Lawvere's actual hypothesis; the Yanofsky universal scheme as a T → T×T → Y → Y composite.
- **Lens 04.** The triage of where Yoneda is load-bearing vs scaffolding. The "embeddings as restricted Yoneda" bridge is unique to 04 and gives lens 02 its categorical justification.
- **Lens 05.** The grep-verified negatives against Kauffman (zero hits for `renormaliz` and `noether` across three PDFs). No other lens did adversarial precedent checking.

## Open Questions Forwarded to Discovery

These are decision-shaped questions that lens-layer investigation cannot resolve.

- **Q-R1.** Should the discovery commit to one truth-object $Y$ per tower level or leave the choice deferred? **Recommendation.** Defer per OQ-4; commit at structure-theorem-writeup time, not in the discovery.
- **Q-R2.** Does the discovery treat the four predicted residues (lens 01 §C) as falsifiable bets or as design constraints? **Recommendation.** Bets — promote to `vault/premise/` per the discovery's existing "next moves," with explicit falsification tests. This is exactly what OQ-2 says.
- **Q-R3.** Should the framework drop the RG/Noether framing entirely (lens 05's adversarial point) or keep it as `[metaphor]`? **Recommendation.** Keep as `[metaphor]` with explicit downgrade; do not commit to it being load-bearing until either an RG-flow on the GKG is defined or a continuous symmetry of κ is identified and Noether is actually applied. The discovery's A-4 alternative captures this honestly.
- **Q-R4.** Lens 05 could not read the Kauffman 2009 *Constructivist Foundations* paper. Should the discovery be revisited if that paper is later obtained? **Recommendation.** Yes — block any axiom-grade promotion of the reflection-tower-as-novel claim until OQ-7 is closed.

## Provenance

- **Lens slate dispatched on.** 2026-05-16 (per all individual lens `date` fields, pre-migration).
- **Strategist.** Not recorded. These lenses predate the `/domainspec-subagents-strategy` skill's bootstrap convention; no strategist file exists.
- **Lens count.** 7 (01, 02, 03, 03b, 03c, 04, 05). 03b and 03c are corroboration re-dispatches of 03.
- **Notable absences.** No lens dispatched on: (a) Spivak two-layer specifically (the discovery's C1 imports it from `/domainspec-theorem` without its own lens); (b) RG/Noether physics-precedent claim (no lens checked it independently — lens 05 only verified Kauffman doesn't make it); (c) Constructivist Foundations 2009 Kauffman paper (gated, OQ-7).

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../lenses/01-invariants-and-layer-alignment/findings.md` | `synthesizes` | Schema/instance invariant decomposition consolidated into Theme 6. |
| `../lenses/02-evoc-algorithm/findings.md` | `synthesizes` | EVōC operational pipeline consolidated into Theme 5. |
| `../lenses/03-godel-lawvere-limits/findings.md` | `synthesizes` | Original limitative synthesis consolidated into Theme 2 (with verification caveat). |
| `../lenses/03b-godel-tarski-lob-corroborated/findings.md` | `synthesizes` | Hard-fetch logic-side corroboration consolidated into Theme 2. |
| `../lenses/03c-lawvere-yanofsky-corroborated/findings.md` | `synthesizes` | Hard-fetch categorical-side corroboration consolidated into Theme 2. |
| `../lenses/04-yoneda-lemma/findings.md` | `synthesizes` | Yoneda load-bearing triage consolidated into Theme 3 and bridge to Theme 5. |
| `../lenses/05-kauffman-precedent-check/findings.md` | `synthesizes` | Adversarial Kauffman precedent check consolidated into Theme 4. |
| `../lenses/01-invariants-and-layer-alignment/findings.md` | `retrofits` | Backfill marker: this research was written after the findings already existed. |
| `../lenses/02-evoc-algorithm/findings.md` | `retrofits` | Backfill marker. |
| `../lenses/03-godel-lawvere-limits/findings.md` | `retrofits` | Backfill marker. |
| `../lenses/03b-godel-tarski-lob-corroborated/findings.md` | `retrofits` | Backfill marker. |
| `../lenses/03c-lawvere-yanofsky-corroborated/findings.md` | `retrofits` | Backfill marker. |
| `../lenses/04-yoneda-lemma/findings.md` | `retrofits` | Backfill marker. |
| `../lenses/05-kauffman-precedent-check/findings.md` | `retrofits` | Backfill marker. |
| `research-synthesis.md` | `cited-by` | The ≤500-word synthesis cites this research file for every claim. |
| `../discovery.md` | `derives` | The discovery's commitments derive from this cross-lens synthesis. |
