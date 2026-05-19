---
tags: [vault, research, two-layer-retrieval]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
backfilled: true
analysis-method: post-hoc-independent-read
---

# Research — Two-Layer Retrieval

> **Backfill note.** This research synthesis was written on 2026-05-18, AFTER `discovery.md` was already drafted on 2026-05-17 directly from the 4 lens findings without an intermediate research-layer document. It exists to retrofit the new convention's lens → research → discovery chain onto an existing artifact. The cross-lens analysis below was conducted by reading the 4 lens findings without consulting `discovery.md` during analysis — to test whether the discovery's commitments survive an independent cross-lens read. They did, with two qualifications surfaced as open questions.

## Objective

Determine the minimum admissible retrieval architecture over the graded knowledge vault, given the vault's own typed-edge identity criterion; survey published precedents; and derive ranking-function shapes that can support per-query-intent composition.

## Lens Inventory

| # | Lens | Framing | Headline finding | Confidence |
|---|------|---------|------------------|------------|
| 01 | [graphrag-state-of-the-art](../lenses/01-graphrag-state-of-the-art/findings.md) | What does the published GraphRAG ecosystem do? Where are the gaps? | The combination of typed edges + intent-conditioned layer composition + evidence-stage + verification-provenance + Yoneda identity is unpublished. Closest precedents are NodeRAG (type-aware routing only), REANO (query-conditioned edge attention only), KG2RAG (pre-existing typed edges only). | high (survey-grade); secondhand caveat on KG2RAG / REANO / Jin et al. / SELF-RAG / MIND-RAG |
| 02 | [formal-faithfulness](../lenses/02-formal-faithfulness/findings.md) | What is the smallest formal condition forcing retrieval to respect vault identity? | Retrieval is a functor `R: Q → Sub(G)`; faithfulness is full-subpresheaf inclusion; vector-only retrieval cannot satisfy it (proof-grade via the supersedes-pathology counterexample); graph-aware retrieval is the minimum. | high (proof-grade for §C1–C3 and §D sufficiency); proof-sketch for §D necessity |
| 03 | [vector-rag-failure-modes](../lenses/03-vector-rag-failure-modes/findings.md) | What do published vector-RAG failures look like in graph-structured corpora? | 10 documented failures; pattern: edge erasure (7/10) and identity violation (6/10) dominate; type erasure 5/10; stage collapse 2/10 (weakest-corroborated). Contrary finding: vector RAG wins on simple-fact queries. | high (empirical, web-fetched); contrary finding bounds the scope of the critique |
| 04 | [query-intent-ranking](../lenses/04-query-intent-ranking/findings.md) | What query intents arise over a graded vault, and what ranking functions do they imply? | Eight-intent taxonomy (Canon, Provenance, Frontier, Tension, Semantic, Blast-radius, Lens-triangulation, Definitional); two ranking templates fall out (body-leaning, edge-leaning); no published system parametrises a single retriever's ranking function by intent at query time. | medium (proposal-grade for the taxonomy; survey-grade for the published-precedent gap) |

## Cross-Lens Analysis

### Theme 1 — Formal property vs. empirical observation (load-bearing)

- **Lenses speaking to it:** 02, 03
- **Convergence:** Both lenses agree vector RAG fails on structurally-demanding queries. Lens 02 says it cannot satisfy the faithfulness condition (proof-grade); lens 03 says it does fail across 7–10/10 documented modes (empirical).
- **Disagreement:** None on the conclusion, but a **register difference** that risks reader confusion. Lens 02's §C prose ("Vector RAG returns them as equivalent. The framework returns them as distinct") reads empirical but is rigorously formal — a statement about model expressiveness. Lens 03's failure catalog is genuinely empirical. The two should never be cited interchangeably.
- **Resolution:** `[lens-supported]` — the lenses themselves carry the distinction (lens 02 §Status; lens 03 §C contrary finding). The discovery's §6 epistemic-honesty table is the authoritative separator and it survives this independent read.
- **Implication for discovery:** D-1 (graph-aware as minimum architecture) is correctly anchored on lens 02 formal-proof, with lens 03 empirical evidence scoping where the advantage applies. The discovery already carries this distinction; no change needed.

### Theme 2 — Yoneda load-bearing-ness

- **Lenses speaking to it:** 02 primarily; 01 cites the sibling discovery's Yoneda lens
- **Convergence:** The Yoneda criterion (node identity = hom-presheaf) is the single formal property that forces typed-edge structure into retrieval. Without it, "two-layer retrieval" is a heuristic rather than a derived requirement.
- **Disagreement:** None internally. But lens 02's §D necessity is proof-sketch only, not formalized — if Lean queue 0003 fails, the load-bearing necessity weakens.
- **Resolution:** `[unresolved]` pending Lean. Track as the load-bearing falsification target.
- **Implication for discovery:** OQ-4 correctly identifies this as a falsification gate. The discovery's status as `exploratory` is the right hedge.

### Theme 3 — Novelty assessment (combination, not components)

- **Lenses speaking to it:** 01 primarily; 02 (Yoneda-identity precedent), 04 (intent-conditioned ranking precedent)
- **Convergence:** Each individual component has at least one published precedent. The **combination** (typed edges + intent-conditioned layer composition + evidence-stage + verification-provenance + Yoneda identity) is unpublished.
- **Disagreement:** None — but lens 01 itself flags the strong-but-not-exhaustive caveat (KG2RAG, REANO, Jin et al., SELF-RAG, MIND-RAG only reached secondhand).
- **Resolution:** `[lens-supported]` with explicit hedge. The novelty claim is survey-grade, not exhaustive.
- **Implication for discovery:** §7 Next Move 5 (re-verify secondhand sources before external publication) is the correct guard. The discovery correctly does not stake novelty as proof-grade.

### Theme 4 — Empirical-vs-formal separation between lenses 02 and 03

- **Lenses speaking to it:** 02, 03
- **Convergence:** Both lenses establish that graph-aware retrieval beats vector-only on structurally-demanding queries, but for different reasons (formal impossibility vs. observed failure rates).
- **Disagreement:** Lens 02's supersedes-pathology counterexample uses near-identical bodies; lens 03's failure cases F1–F8 do not — they are real-world structural failures. The lens 02 counterexample is a synthetic minimal case, not an empirical instance. Reading them as the same claim conflates "in principle impossible" with "in practice failing."
- **Resolution:** `[analyst-judgment]` — the discovery's §6 table separates them correctly; this research re-reads the lenses and confirms the separation holds.
- **Implication for discovery:** No change. The §6 epistemic-honesty table is the load-bearing separator. Any v0.3.0 must preserve it.

### Theme 5 — Stage-collapse weakness as an open empirical question

- **Lenses speaking to it:** 03 (2/10 weakest), 04 (D-5 intent-conditioned verification)
- **Convergence:** Stage collapse is the weakest-corroborated failure mode. Lens 04 nonetheless proposes intent-conditioned verification priors as if stage is first-class.
- **Disagreement:** **Internal tension.** If stage collapse is the weakest empirical signal, why does the architecture promote `evidence_stage` to a first-class ranking input? Lens 03 cannot rule out vocabulary mismatch (literature simply does not name "stage"); lens 04 builds on the framework's own discipline.
- **Resolution:** `[unresolved]` — the discovery (D-3, OQ-7) correctly carries this as an open empirical question. The architecture spec must include a stage-bound falsification test.
- **Implication for discovery:** OQ-7 is correctly framed. Recommendation: any v0.3.0 should also explicitly identify the *risk* — if stage collapse is vocabulary mismatch, D-3 may be over-architected and a simpler verification-only ranking input would suffice.

### Theme 6 — Intent-conditioned composition is the load-bearing novelty

- **Lenses speaking to it:** 04 (taxonomy), 01 (no precedent)
- **Convergence:** No published GraphRAG variant composes different layer stacks per query intent. Lens 04 derives two ranking templates (body-leaning, edge-leaning) and proposes 8 intents that partition vault queries.
- **Disagreement:** Lens 04 itself flags D-1 (intent detection mechanism unspecified) as the open front door. Without it, the architecture has no entry point.
- **Resolution:** `[unresolved]` — OQ-1 in the discovery acknowledges this gap.
- **Implication for discovery:** D-2 is correctly anchored on lens 04's templates; OQ-1 correctly carries the intent-detection gap. Architecture spec must specify the classifier before any prototype can be evaluated.

## Unique Contributions

- **Lens 01 alone:** the comparison table grading 9 GraphRAG variants on 4 axes, and the explicit identification that intent-conditioned layer composition has no precedent.
- **Lens 02 alone:** the formal model of retrieval as a functor `R: Q → Sub(G)` and the Yoneda-indexed faithfulness condition. No other lens derives this.
- **Lens 03 alone:** the empirical failure catalog (10 cases) and the contrary finding that vector RAG wins on simple facts. No other lens cites empirical benchmarks.
- **Lens 04 alone:** the 8-intent taxonomy, the eight per-intent ranking sketches, and the two-template generalization. No other lens proposes ranking-function shapes.

## Open Questions Forwarded to Discovery

(All carried in `discovery.md` §5; recommendations summarized here for traceability.)

- **OQ-1.** Intent detection mechanism — recommend hand-labelled bootstrap from session logs in parallel with synthetic taxonomy queries.
- **OQ-2.** Hard filter vs. soft demote for verification — recommend intent-conditioned $\nu_i(\pi)$, not global.
- **OQ-3.** Multi-intent queries — recommend decomposition first; revisit when telemetry exists.
- **OQ-4.** Lean formalization of the supersedes counterexample (queue 0003) — load-bearing falsification target.
- **OQ-5.** Graceful degradation when structure is absent — recommend reporting the structural void; allow opt-in semantic fallback.
- **OQ-6.** Anchor resolution confidence threshold — open, needs prototype data.
- **OQ-7.** Stage collapse: real empirical gap or vocabulary mismatch — recommend stage-bound falsification test in architecture spec. **New (research-layer):** if vocabulary-mismatch hypothesis confirmed, D-3 may be over-architected; a simpler verification-only ranking input would suffice. File for v0.3.0 consideration.
- **OQ-8.** Formal-faithfulness vs. empirically-better — discovery's §6 table is authoritative separator; preserve through any future evolution.

## Provenance

- Lens slate dispatched on: 2026-05-16 (per lens frontmatter dates)
- Strategist (if meta-dispatched): not recorded — pre-convention dispatch
- Lens count: 4
- Notable absences: no adversarial-on-the-Yoneda-claim lens; no lens explicitly attacking the 8-intent taxonomy partition; no cost / latency / training-budget lens. The discovery's §7 Next Moves (falsification round, re-verification) carry these as future obligations.

## Connections

- `retrofits` → `../lenses/01-graphrag-state-of-the-art/findings.md`
- `retrofits` → `../lenses/02-formal-faithfulness/findings.md`
- `retrofits` → `../lenses/03-vector-rag-failure-modes/findings.md`
- `retrofits` → `../lenses/04-query-intent-ranking/findings.md`
- `synthesizes` ← `../lenses/01-graphrag-state-of-the-art/findings.md`
- `synthesizes` ← `../lenses/02-formal-faithfulness/findings.md`
- `synthesizes` ← `../lenses/03-vector-rag-failure-modes/findings.md`
- `synthesizes` ← `../lenses/04-query-intent-ranking/findings.md`
- `cited-by` → `research-synthesis.md`
- `cited-by` → `../discovery.md`
