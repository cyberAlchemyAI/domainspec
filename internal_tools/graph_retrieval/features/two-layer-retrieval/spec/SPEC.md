---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, retrieval, rag]
node_type: spec
is_session: false
layer: architecture, application
nature: explanatory, technical
status: draft
version: 0.2.0
last_updated: 2026-05-17
---

# Spec: Two-Layer Retrieval

## 1. Summary

`graph_retrieval` exposes a single function `retrieve(query, corpus, k) →
RetrievalResult` that classifies the query's intent, builds a candidate
set from a vault corpus, projects each candidate into a `NodeView`,
scores each candidate via the intent's compose-function, and returns the
top-k subgraph along with provenance for every score. The retriever is
faithful per the discovery's faithfulness criterion: typed edges are
preserved end-to-end and never collapsed into the body-similarity
channel.

## 2. Aspect documents

| Aspect | Contains |
| ------ | -------- |
| [architecture.md](architecture.md) | Six-view architecture, source contracts, decision log, risks |
| [domain.md](domain.md) | `NodeView`, `Intent`, `VaultCorpus`, `Embedder`, value-object shapes |
| [interfaces.md](interfaces.md) | `retrieve` function signature, `RetrievalResult`, `ScoredNode` |
| [workflows.md](workflows.md) | The 5-stage retrieval algorithm (classify → candidate → project → score → top-k) |
| [rules.md](rules.md) | Faithfulness contract F1–F5 and invariants |
| [operations.md](operations.md) | Config loading, error handling, corpus reload, embedding-matrix warm vs cold |
| [observability.md](observability.md) | Metrics, structured logs, traces around `retrieve()` |
| [glossary.md](glossary.md) | Feature-local definitions: faithfulness, candidate set, NodeView, stage prior, … |
| [STORIES.md](STORIES.md) | User stories derived from the 8 intents |
| [TEST-SPEC.md](TEST-SPEC.md) | Acceptance tests T1–T8, including the vector-only falsification round |

## 11. References

- Discovery (canonical, in vault):
  [../../../../../vault/discovery/two-layer-retrieval/](../../../../../vault/discovery/two-layer-retrieval/)
  via [../discovery/README.md](../discovery/README.md)
- Intent enum + classifier: [../../../intent.py](../../../intent.py)
- Score functions + `NodeView`: [../../../compose.py](../../../compose.py)
- Embedder Protocol:
  [../../../../vault_common/embedder.py](../../../../vault_common/embedder.py)
- Parent discovery (faithfulness root):
  [../../../../../vault/discovery/graph-as-residue-attractor/](../../../../../vault/discovery/graph-as-residue-attractor/)
- Bet B-001:
  [../../../../../vault/bets/B-001-graph-as-residue-attractor-load-bearing.md](../../../../../vault/bets/B-001-graph-as-residue-attractor-load-bearing.md)
