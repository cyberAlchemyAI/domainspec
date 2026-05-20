---
tags: [vault, lens-findings, graph-as-residue-attractor]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
dispatch_status: historical
lens_order: first
version: 0.1.1
last_updated: 2026-05-19
---

# Findings — EVōC Algorithm

## Objective

Identify the EVōC algorithm, assess relevance to the condensation operator and the multi-agent convergence criterion, and propose a concrete pipeline.

## Findings

### EVōC — Research Note

## 1. What it is

**EVōC (Embedding Vector Oriented Clustering)** is a clustering library from the Tutte Institute (lead: Leland McInnes, also the author of UMAP and HDBSCAN), released in 2024 and actively iterated through 2025–26. It is specialized for high-dimensional embedding vectors (CLIP, sentence-transformers, OpenAI/Cohere embeddings). Core operation: ANN kNN graph → smoothed/symmetrized weighted graph → UMAP-style layout with a modified repulsion term → MST over mutual-reachability distances → **hierarchy of clusterings extracted via persistence analysis**. It also auto-detects near-duplicates and exposes **multiple layers of cluster granularity**. The algorithm itself is unpublished; the cluster-extraction step cites the PLSCAN paper (Bot, McInnes, Aerts, arXiv:2512.16558, 2025). Primary use case: faster, lower-tuning replacement for UMAP+HDBSCAN on embedding corpora.

## 2. Disambiguation

"EVoC" can also resolve to: (a) **Evolution of Cooperation** (game-theory literature), (b) **Extended Vocabulary** tokenizer variants, (c) **E-VoC** voice-cloning systems. Given the calling context (clustering, ontology construction, embeddings, "new tool", 2024–26), the McInnes EVōC library is the overwhelmingly likely referent — it is the only "EVoC" that is genuinely new tooling in the embedding/ontology space.

## 3. Relevance

**To the condensation operator.** Strong. Condensation = "compress lower-stage bundles + evidence into higher-stage nodes." EVōC's persistence-based hierarchy gives you exactly a graded stratification of an embedding cloud: each persistence level *is* a candidate stage, and the parent-cluster relation *is* a candidate condensation map. The MST + mutual-reachability backbone also gives you the evidence (which lower-stage points justify the higher-stage node) for free.

**To multi-agent convergence measurement.** Moderate. Two agents producing embedding sets over the same corpus can each be EVōC-clustered; convergence then becomes a comparison between two persistence hierarchies (e.g., bottleneck/Wasserstein distance on the persistence diagrams, or hierarchy-aware NMI). This is more principled than flat-cluster ARI because it respects the graded structure the structure theorem is about. It does not, by itself, align *labels* — a separate concept-naming step is still required.

**To schema/instance coherence.** Partial. EVōC operates at the instance layer (points in embedding space). It can surface candidate schema nodes (cluster centroids / persistent components) but does not distinguish "concept-naming symmetry" from "populated-state symmetry." The two-layer split must be imposed by the user; EVōC supplies the bottom layer's geometry but is agnostic to renaming invariance.

## 4. Concrete proposal

Plug EVōC in as the **geometric realizer** of the condensation operator. Pipeline: (i) embed all stage-0 notes/bundles with a fixed encoder; (ii) run EVōC to obtain the full persistence hierarchy; (iii) define stage-k nodes as clusters surviving above persistence threshold τ_k, with the evidence set = member points and the condensation map = persistence parent pointer; (iv) for the convergence test, have each agent independently embed and cluster, then compare persistence diagrams (bottleneck distance) and hierarchy alignment (hierarchy-NMI or tree-edit distance on the cluster tree) — declare convergence when both metrics fall below ε at every stage. This gives a concrete, falsifiable instantiation of the multi-agent convergence criterion, and the persistence structure is exactly the kind of object structure-theorem-grade results live on (cf. stability theorems for persistence modules).

## Caveats

- The EVōC algorithm itself is unpublished; the cluster-extraction step cites the PLSCAN paper (Bot, McInnes, Aerts, arXiv:2512.16558, 2025).
- The pipeline has not been run on any real vault — this is an empirical bet, not a tested result.
- EVōC is agnostic to the schema/instance distinction; the two-layer split must be imposed by the user.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../../research/research.md` | `synthesized-by` | Consolidated into the cross-lens research synthesis (Theme 5). |
| `../../discovery.md` | `derives` | The discovery's commitments derive from EVōC as candidate geometric realizer of κ. |
