---
lens: graphrag-state-of-the-art
date: 2026-05-16
dispatched_by: subagent (general-purpose, Sonnet) — 18 tool calls, web-fetched
addresses: Survey the GraphRAG ecosystem and determine whether the proposed combination (typed edges + intent-conditioned ranking + stage and verification filtering + Yoneda identity) is published anywhere
sources:
  - https://arxiv.org/abs/2404.16130 (Microsoft GraphRAG, Edge et al. 2024)
  - https://microsoft.github.io/graphrag/
  - https://microsoft.github.io/graphrag/index/inputs/
  - https://arxiv.org/abs/2410.05779 (LightRAG, HKU 2024)
  - https://github.com/HKUDS/LightRAG
  - https://arxiv.org/abs/2405.14831 (HippoRAG, OSU 2024)
  - https://arxiv.org/abs/2401.18059 (RAPTOR, Stanford 2024)
  - https://arxiv.org/abs/2504.11544 (NodeRAG 2025)
  - https://arxiv.org/abs/2501.00309 (GraphRAG survey, Jan 2025)
  - https://aclanthology.org/2025.naacl-long.449/ (KG2RAG, NAACL 2025)
  - https://www.mdpi.com/2079-9292/14/21/4227 (Clinical RAG metadata-aware ranking)
  - https://github.com/DEEP-PolyU/Awesome-GraphRAG
verification: [web-fetched]
---

# GraphRAG Ecosystem Survey: Fit for a Typed, Stage-Aware, Intent-Conditioned Vault

## A. Comparison table

| Variant | (1) Pre-existing typed edges? | (2) Node-type filtering at retrieval? | (3) Evidence-stage / epistemic-status ranking? | (4) Query-intent-conditioned ranking? | Notes |
|---|---|---|---|---|---|
| **Microsoft GraphRAG** (Edge et al., 2404.16130) | No by default — LLM extracts entities/relations/claims; but **supports BYOG** ("Custom Graphs") via DataFrame ingestion | No native typed-node filtering at query time; community summaries are the unit | No — communities and entities have no epistemic-tier metadata | **Partial** — global vs. local vs. DRIFT are *fixed* query modes the user selects, not learned intent routing | Closest to "intent modes," but only 3 hardcoded ones |
| **LightRAG** (HKU, 2410.05779) | No — LLM-extracted entity/relation graph | No node-type-aware retrieval; nodes are flat entities | No epistemic stage; supports a reranker but content-only | **Partial** — "dual-level" (low-level entity vs. high-level theme) + "mix mode"; two retrieval granularities, not intent classes | Granularity ≠ intent |
| **HippoRAG** (OSU, 2405.14831) | No — OpenIE LLM extraction; only two edge types (relation, synonymy) | No — uniform PPR over all nodes; only "node specificity" (IDF-like) weighting | No | No — single PPR pipeline regardless of query | Node specificity is a structural prior, not provenance |
| **NodeRAG** (Xu et al., 2504.11544) | No — LLM + algorithmic edge construction; 7 **heterogeneous node types** baked in | **Yes — partially**: dual search routes queries through title-node entry points → vector search on rich-content nodes; non-retrievable types excluded | No epistemic tier; uses structural metrics (K-core, betweenness) instead | No mode-specific pathways — uniform dual search + 2-step PPR | Schema is fixed by NodeRAG, not user-defined |
| **RAPTOR** (Stanford, 2401.18059) | No edges at all — clustering tree, not a typed graph | No (tree levels, not node types) | No | No — collapsed vs. tree-traversal retrieval, but content-only | Out of scope structurally |
| **KG2RAG** (NAACL 2025) | **Yes** — assumes a pre-built KG with fact-level edges between chunks | Edge-typed expansion, but no node-type-aware ranking | No | No | Closest to "pre-existing edges as first-class" |
| **REANO** (cited in 2501.00309 survey) | Uses pre-built KG triples | No node-type filter | No | **Yes** — encodes query into edge-specific attention weights, conditional on the query | Only paper with *learned* query-conditioned edge weighting |
| **Jin et al.** [186] in 2501.00309 survey | Mixed | **Yes** — LLM recognizes node *types* and routes retrieval to type-matched nodes | No | No | Closest published precedent for type-aware retrieval routing |
| **SELF-RAG** (general RAG, not graph) | n/a | n/a | **Partial** — ISREL / ISSUP reflection tokens grade relevance and support | No | Not graph; but its evidence-grading tokens are the nearest analog to evidence-stage tags |
| **Clinical-decision-support metadata-aware RAG** (MDPI 14/21/4227, 2025) | n/a | n/a | **Yes** — confidence weights from author credentials, regulatory status, peer-review history, document age | No | Domain-specific; ad-hoc weighting, not a general framework |

## B. Novelty assessment

**Well-covered:** Pre-existing typed edges as input (BYOG in Microsoft GraphRAG; default in KG2RAG, REANO). Multiple retrieval modes per query (GraphRAG's global/local/DRIFT, LightRAG's dual-level/mix, RAPTOR's tree-vs-collapsed). None of them, though, *learn* the mode from intent — the caller picks it.

**Partially covered:** Node-type-aware retrieval (NodeRAG hard-codes 7 types; Jin et al. [186] learns to match node types to the query). Query-intent-conditioned ranking (REANO conditions edge attention on the query; Microsoft's mode switch is intent-shaped). But no paper retrieved composes *different layer stacks* (body-sim vs. edge-traversal vs. type-filter) per intent class.

**Genuinely absent in the GraphRAG literature:** Evidence-stage / verification-provenance as a first-class ranking signal in a graph-RAG retriever. The only close cases were SELF-RAG's ISREL/ISSUP reflection tokens (post-hoc grading) and ad-hoc metadata weighting in domain RAGs (clinical, manufacturing). No GraphRAG variant retrieved exposes a `draft → exploratory → active → consolidated → evergreen` lattice or a `local-files-read / web-fetched / model-recall` provenance dimension. The Yoneda-style "node identity = hom-presheaf" criterion has no precedent in this literature at all.

**The combination** — pre-existing human-authored typed edges + query-intent-conditioned layer composition + evidence-stage + verification-provenance as ranking filters + identity-by-edges — is **not published anywhere I could reach**. The closest single papers are Jin et al. [186] (type-aware routing) and REANO (query-conditioned edge weighting); neither touches epistemic stage or provenance, neither composes intent-specific layer stacks, and neither addresses identity-by-edges. **Treat the combination as novel.**

## C. Recommendation — three options

**Option 1 — Adopt NodeRAG, modify heavily.** NodeRAG is the only published system with first-class heterogeneous nodes and a router that respects them. Modifications required: replace its 7 fixed node types with our 6 (premise/constitution/axiom/conceptual/discovery/session); swap LLM/HNSW edge construction for our pre-existing typed edges; add `evidence_stage` and `provenance` attributes; replace structural importance (K-core/betweenness) with a stage-weighted prior; add an intent classifier that selects which retrievable-node types and which edge types to traverse. The intent router is the load-bearing new piece — NodeRAG has no such router.

**Option 2 — Compose KG2RAG + REANO + a SELF-RAG-style grader.** KG2RAG gives "pre-existing KG with fact-level edges drives chunk expansion." REANO gives query-conditioned edge-attention weights. SELF-RAG's reflection-token idea, repurposed, gives evidence-stage and verification-provenance grading. Glue: REANO's edge-attention is the inner loop; KG2RAG's expansion bounds the candidate set; the grader is the outer rerank. Intent ↔ a selector function toggling which edge types REANO is allowed to attend to.

**Option 3 — Specify a new architecture (recommended given the gap).** Sketch:
1. **Typed-edge presheaf index.** For each node, materialize its hom-presheaf (incoming + outgoing edges grouped by type). Nodes are identified by presheaf equality — directly implements the Yoneda criterion. No published GraphRAG does this.
2. **Intent → layer-composition table.** An intent classifier maps each query to an ordered composition of (a) body-similarity lens, (b) edge-traversal lens restricted to a typed subgraph, (c) node-type filter, (d) stage filter.
3. **Stage-and-provenance prior.** Replace structural priors (PageRank, K-core) with a learned prior over (stage, provenance) — `evergreen+local-files-read` beats `draft+model-recall` by default, but intent can invert it.
4. **Lens edges as first-class retrieval operators.** The `lenses` edge type becomes a runtime view-switch, not just a stored relation — a published novelty.

Items 1, 2, and 4 do not appear in any retrieved source. Item 3 generalizes the clinical-RAG metadata-weighting idea into a graph retriever.

## D. Sources

URLs in frontmatter. Not reached as primary sources: KG2RAG full PDF, REANO original paper, Jin et al. [186], SELF-RAG paper, MIND-RAG. Only known through the survey's secondhand description or search snippets. Claims attributed to them should be re-verified before publication.
