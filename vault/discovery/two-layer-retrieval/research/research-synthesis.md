---
tags: [vault, research-synthesis, two-layer-retrieval]
node_type: research-synthesis
is_session: false
layer: ontology
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Research Synthesis — Two-Layer Retrieval

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Identify the minimum admissible retrieval architecture over the graded vault, given the vault's own typed-edge identity criterion.

## Context

The parent discovery `graph-as-residue-attractor` defines node identity via the Yoneda hom-presheaf — a node is what its typed-edge neighborhood is, not what its body says. Pure body-text retrieval therefore violates the vault's own identity criterion at query time. This synthesis determines what architectural shape *can* satisfy that criterion and where the design space remains open.

## What Was Found

- **Vector-only retrieval cannot in principle satisfy the Yoneda faithfulness condition.** Proof-grade counterexample is the supersedes-pathology: a paper and its retraction with near-identical bodies and opposite edge semantics are returned as interchangeable. (`research.md#theme-1`, theme 4)
- **Graph-aware retrieval (full-subpresheaf closure over a vector seed set) is the minimum faithful architecture.** Proof-sketch via the hom-faithfulness reduction; Lean formalization pending at queue 0003. (`research.md#theme-2`)
- **Empirical failures of vector RAG dominate on edge erasure (7/10) and identity violation (6/10).** Contrary finding scopes the critique: vector RAG wins on simple-fact queries (83.2%), so the advantage is specific to structurally-demanding queries. (`research.md#theme-1`)
- **No published GraphRAG variant exposes the full combination** of typed edges + intent-conditioned layer composition + evidence-stage + verification-provenance + Yoneda identity. Closest single precedents fall short. (`research.md#theme-3`)
- **Per-query-intent ranking-function composition is the load-bearing novelty**, generalizable to two templates (body-leaning, edge-leaning). The intent classifier itself is unspecified. (`research.md#theme-6`)

## Decisions Taken

- **D-1.** Adopt graph-aware retrieval as the minimum architecture. (`../discovery.md#d-1`)
- **D-2.** Compose layers per query intent, not per training run. (`../discovery.md#d-2`)
- **D-3.** Treat verification-provenance and evidence-stage as ranking signals, intent-conditioned. (`../discovery.md#d-3`)

## Implications

- **Architecture spec** for `internal_tools/graph_retrieval/features/two-layer-retrieval/` (application scope; out of this discovery folder).
- **Premise file** promoting the supersedes-pathology counterexample to `vault/premise/` (currently lives only in lens 02 §C3).
- **Lean queue 0003** is load-bearing — if the necessity argument fails to formalize, D-1's necessity weakens.
- **Falsification round** comparing pure-vector and the proposed architecture on the vault's own evolution.

## Open Questions

- **OQ-1.** Intent detection mechanism — recommend hand-labelled bootstrap from session logs. (`../discovery.md#oq-1`)
- **OQ-4.** Lean formalization of the supersedes counterexample — track queue 0003. (`../discovery.md#oq-4`)
- **OQ-7.** Stage collapse real-gap-vs-vocabulary-mismatch — architecture spec must include a stage-bound falsification test; if vocabulary, D-3 may be over-architected. (`../discovery.md#oq-7`)
- **OQ-8.** Preserve the formal-vs-empirical distinction through any v0.3.0 evolution. (`../discovery.md#oq-8`)

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`

## Connections

- `derives-from` → `research.md`
