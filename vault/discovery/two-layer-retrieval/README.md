---
tags: [vault, discovery, ontology, retrieval, two-layer]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.1
last_updated: 2026-05-16
veracidade: medium
convicção: high
---

# Two-Layer Retrieval

## What is this?

Discovery folder for the architecture of retrieval over the graded knowledge vault. It collects a GraphRAG state-of-the-art survey, a formal faithfulness derivation, an empirical failure-mode catalog of vector RAG, and a query-intent taxonomy with per-intent ranking functions.

## Business Context

The [parent discovery](../graph-as-residue-attractor/) defines node identity through the Yoneda hom-presheaf, not through body embeddings. Any retriever that operates only on body-text similarity systematically violates the vault's own identity criterion. This folder owns the design space for a retrieval architecture that respects schema-layer structure (typed edges, node types, evidence stages, verification provenance) alongside instance-layer content.

## Why it matters

Pure vector retrieval is provably non-faithful on structurally-demanding queries — it violates the Yoneda identity criterion, erases typed edges, and collapses stages (the *supersedes pathology*: a paper and its retraction have near-identical bodies but opposite edge semantics). Without a two-layer retriever, the vault's own categorical identity rules dissolve at query time and falsifiability of the framework's predictions becomes impossible.

## 📁 Navigation

- [lenses/01-graphrag-state-of-the-art.md](lenses/01-graphrag-state-of-the-art.md) — Survey of 7+ GraphRAG variants (Microsoft GraphRAG, LightRAG, HippoRAG, NodeRAG, KG2RAG, RAPTOR, REANO); confirms the proposed combination is not published.
- [lenses/02-formal-faithfulness.md](lenses/02-formal-faithfulness.md) — Categorical derivation of the faithfulness criterion; minimum-requirement theorem; four boundary regimes.
- [lenses/03-vector-rag-failure-modes.md](lenses/03-vector-rag-failure-modes.md) — 10 documented failures with sources; pattern table mapping to the four schema-layer concerns.
- [lenses/04-query-intent-ranking.md](lenses/04-query-intent-ranking.md) — 8-intent taxonomy (Canon, Provenance, Frontier, Tension, Semantic, Blast-radius, Lens-triangulation, Definitional); per-intent ranking functions; open design questions.

## Claim

Retrieval from a graded knowledge vault must read **both schema-layer structure** and **instance-layer content**. Pure vector retrieval is provably non-faithful on structurally-demanding queries. The minimum faithful architecture combines graph-aware traversal with **query-intent-conditioned ranking metrics** that compose body-similarity, edge-traversal, and type/stage/verification filters per intent.

## Status

Exploratory. Triangulated by four lenses. Movement requires: write architecture spec, prototype against `/house_project/docs/vault/`, run a falsification round against existing GraphRAG variants. Boundary: pure-lookup queries are well-served by vector RAG (per lens 03's contrary finding — vector RAG scores 83.2% on simple facts); the architecture's advantage is on structurally-demanding queries specifically.

## Summary

Lens 01 surveys the GraphRAG ecosystem. Closest precedents: NodeRAG (heterogeneous node types), REANO (query-conditioned edge attention), KG2RAG (pre-existing edges as first-class). **No published GraphRAG variant** supports the full combination of pre-existing typed edges + query-intent-conditioned layer composition + evidence-stage filtering + verification-provenance ranking + Yoneda identity check.

Lens 02 derives the formal faithfulness criterion: a retrieval functor $R: \mathcal{Q} \to \mathrm{Sub}(\mathcal{G})$ is faithful iff it commutes with the Yoneda embedding up to natural isomorphism. Three proof-grade impossibility results (no typed-edge preservation, no type stratification, Yoneda-violation counterexample on the supersedes case) show vector-only retrieval cannot in principle satisfy this. Graph-aware retrieval that closes the seed set under typed-edge traversal can.

Lens 03 anchors the abstract critique empirically: 10 documented failures of vector RAG (multi-hop QA collapse on MuSiQue, compound-value-type confusion in Mindful-RAG, chunk-level context loss documented by Anthropic Contextual Retrieval, schema-bound query collapse from `arXiv:2506.05690`). Edge erasure corroborated 7/10; identity violation 6/10; type erasure 5/10. Stage collapse is the weakest-corroborated (2/10).

Lens 04 proposes an intent taxonomy with a written ranking function for each. Two general templates emerge: body-leaning (filter + ν(π) + cos) and edge-leaning (reachability × decay × prior). The sharpest open design question: **verification-provenance must be intent-conditioned** (ν_i, not ν).

## Open Questions

- How to detect query intent: rule-based, LLM-classified, or hybrid? SetFit→LLM is the closest published pattern.
- Should verification-provenance be a hard filter (Canon) or a soft demote (Frontier)? Likely intent-conditioned (ν_i not ν).
- How does the architecture handle multi-intent queries?
- Does the C3 supersedes-pathology counterexample formalize cleanly in Lean? (Queued in `/domainspec-theorem/pipeline/queue/0003`.)
- Where does the architecture degrade to vector RAG gracefully?

## Next Moves

- Draft the architecture spec in `/domainspec/vault/discovery/two-layer-retrieval/spec/`.
- Prototype the geometric realizer (lens 02 of parent discovery via EVōC) on `/house_project/docs/vault/`.
- Promote the supersedes-pathology counterexample to a premise file under `vault/premise/`.
- Run a comparison round: same query set, vector-only vs proposed architecture, on `/house_project/docs/vault/`.
- Folded into `two-layer-platform-architecture/` for execution sequencing.
