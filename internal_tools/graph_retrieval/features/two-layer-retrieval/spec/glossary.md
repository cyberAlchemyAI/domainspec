---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, glossary]
node_type: spec
is_session: false
layer: ontology, application
nature: reference, explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-17
feature: two-layer-retrieval
docType: glossary
---

# Glossary: Two-Layer Retrieval

Quick-reference glossary of the language used in this feature.
Authoritative behavior, fields, rules, and lifecycle contracts remain
in the linked source documents.

## Feature Language

Plain-English terms that appear inside the formal concepts and rules.
Reading these first makes the formal rows make sense.

| Term | Meaning in this feature | Related Concepts |
| ---- | ----------------------- | ---------------- |
| Two-layer | The retriever reads both the **schema layer** (typed edges, node types, stages, verification provenance) and the **instance layer** (body embeddings). Pure vector RAG reads only the instance layer. | [Intent](domain.md#intent), [NodeView](domain.md#nodeview) |
| Faithfulness | The retriever does not silently drop schema-layer information on its way to ranking. Formalized as F1–F5 in [rules.md](rules.md). | [rules.md](rules.md) |
| Candidate set | The list of node paths the retriever scores. Built before scoring; pruned by per-intent hard filters. Size reported as `candidate_set_size`. | [workflows.md Step 2](workflows.md#step-2-candidate-set-construction) |
| Compose-function | The per-intent scoring function. One per [Intent](domain.md#intent); all live in [../../../compose.py](../../../compose.py) and return a score in `[0, 1]` plus a `score_components` breakdown. | [ScoredNode](domain.md#scorednode) |
| Intent classifier | The component that maps a query string to an [Intent](domain.md#intent). Rule-based in v0.1; deterministic; SEMANTIC fallback on no match. | [workflows.md Step 1](workflows.md#step-1-intent-classification) |
| Stage prior | A numeric prior over the vault `status` axis (draft, exploratory, active, consolidated, evergreen, retracted). Source of truth is [domain.md Stage Prior](domain.md#stage-prior). | [Stage Prior](domain.md#stage-prior) |
| Verification prior | Intent-conditioned multiplier ν_i over the `verification` provenance list. CANON × `["model-recall"]` hard-zeros; other intents soft-demote. | [rules.md F4](rules.md#f4--verification-provenance-respect) |
| Body-leaning intent | Intent whose candidate set starts from `corpus.search_body` (vector lookup). Includes CANON, SEMANTIC, DEFINITIONAL, FRONTIER. | [workflows.md Step 2a](workflows.md#step-2-candidate-set-construction) |
| Edge-leaning intent | Intent whose candidate set starts from path seeds + edge closure. Includes PROVENANCE, BLAST_RADIUS, TENSION. | [workflows.md Step 2b](workflows.md#step-2-candidate-set-construction) |
| Falsification round | The T8 acceptance test that compares two-layer retrieval against a pure vector-only baseline; the experiment that justifies the architecture's existence. | [TEST-SPEC.md T8](TEST-SPEC.md#t8--falsification-round-vector-only-baseline) |
| Supersedes pathology | The counterexample case where two nodes have identical bodies but one supersedes the other; pure vector retrieval cannot distinguish them. Formalized as F5. | [rules.md F5](rules.md#f5--supersedes-pathology) |

## Terms

| Term | Concept ID | Type | Definition | Source |
| ---- | ---------- | ---- | ---------- | ------ |
| `retrieve` | `two-layer-retrieval.retrieve` | Interface (function) | The single entrypoint; takes a query and corpus and returns a top-k `RetrievalResult`. | [interfaces.md](interfaces.md#internal-retrieve-top-level-function) |
| `RetrievalResult` | `two-layer-retrieval.RetrievalResult` | Value Object | The full response: intent, intent confidence, ranked nodes, candidate-set size, backend identity, duration, and notes. | [interfaces.md](interfaces.md#output-retrievalresult) |
| `ScoredNode` | `two-layer-retrieval.ScoredNode` | Value Object | A single retrieval hit: full `NodeView`, score, and per-term `score_components` breakdown. | [domain.md](domain.md#scorednode) |
| `NodeView` | `two-layer-retrieval.NodeView` | Value Object | The load-bearing projection of a corpus node into the shape compose-functions need. Edges preserved verbatim per F1. | [domain.md](domain.md#nodeview) |
| `Intent` | `two-layer-retrieval.Intent` | Enum | The 8-value query-intent taxonomy: CANON, PROVENANCE, FRONTIER, TENSION, SEMANTIC, BLAST_RADIUS, LENS_TRIANGULATION, DEFINITIONAL. | [domain.md](domain.md#intent) |
| `VaultCorpus` | `two-layer-retrieval.VaultCorpus` | Protocol | The graph-backend seam: nodes, get_node, inbound, outbound, search_body. | [domain.md](domain.md#vaultcorpus) |
| `Embedder` | `two-layer-retrieval.Embedder` | Protocol | The query/body-encoder seam. Implementation lives in `vault_common/embedder.py`. | [domain.md](domain.md#embedder) |
| `classify_intent` | `two-layer-retrieval.classify_intent` | Function | Rule-based classifier; returns an `Intent` with `1.0` confidence on rule match or `Intent.SEMANTIC` with `0.5` confidence on fallback. | [../../../intent.py](../../../intent.py) |
| `compose.score` | `two-layer-retrieval.compose.score` | Function | Dispatch into the per-intent scorer for `(intent, query, NodeView)`. | [../../../compose.py](../../../compose.py) |
| `stage_prior` | `two-layer-retrieval.stage_prior` | Function | Maps a `status` string to a numeric prior. Defaults to `0.50` for unmarked. | [../../../compose.py](../../../compose.py) |
| `verification_prior` | `two-layer-retrieval.verification_prior` | Function | Intent-conditioned ν_i; hard-zeros CANON × model-recall-only. | [../../../compose.py](../../../compose.py) |
| F1 — Typed-edge preservation | `two-layer-retrieval.F1` | Rule | Projection must not drop edge types. | [rules.md](rules.md#f1--typed-edge-preservation) |
| F2 — Type stratification | `two-layer-retrieval.F2` | Rule | Per-intent `node_type` hard filters. | [rules.md](rules.md#f2--type-stratification) |
| F3 — Stage stratification | `two-layer-retrieval.F3` | Rule | Per-intent `status` hard filters. | [rules.md](rules.md#f3--stage-stratification) |
| F4 — Verification-provenance respect | `two-layer-retrieval.F4` | Rule | CANON excludes model-recall-only; other intents demote. | [rules.md](rules.md#f4--verification-provenance-respect) |
| F5 — Supersedes pathology | `two-layer-retrieval.F5` | Rule | CANON ranks superseding node strictly above superseded under body-equal conditions. | [rules.md](rules.md#f5--supersedes-pathology) |

## Cross-Feature Terms

These terms belong to other modules but are used in this feature.

| Term | Concept ID | Type | Definition | Source |
| ---- | ---------- | ---- | ---------- | ------ |
| Embedder Protocol | `vault_common.Embedder` | Protocol | Generic embedder shape used across `internal_tools/`. | [../../../../vault_common/embedder.py](../../../../vault_common/embedder.py) |
| Frontmatter parser | `vault_common.frontmatter` | Module | Parses YAML frontmatter from vault `.md` files. Used by `NetworkXCorpus` only. | [../../../../vault_common/](../../../../vault_common/) |
| Edge extractor | `vault_common.edges` | Module | Extracts typed edges from vault `.md` files. Used by `NetworkXCorpus` only. | [../../../../vault_common/](../../../../vault_common/) |
| `node_type` axis | `vault.node_type` | Enum | The vault's structural classification (axiom, premise, constitution, conceptual, discovery, …). | `vault/constitution/discovery-structure-constitution.md` |
| `status` axis | `vault.status` | Enum | The vault's lifecycle classification (draft, exploratory, active, consolidated, evergreen, retracted). | `vault/constitution/frontmatter-ownership-constitution.md` |
| `verification` axis | `vault.verification` | List | Provenance list for a vault claim: subset of `{"model-recall", "web-fetched", "local-files-read"}`. | `vault/foundational-knowledges.md` |
| Yoneda criterion | `vault.discovery.faithfulness-yoneda` | Discovery | The categorical criterion that grounds F1–F5 formally. | [../../../../../vault/discovery/two-layer-retrieval/](../../../../../vault/discovery/two-layer-retrieval/) (lens 02) |

## Maintenance Rules

- Update this glossary whenever a concept in [domain.md](domain.md),
  [interfaces.md](interfaces.md), or [rules.md](rules.md) is renamed or
  its definition changes.
- Plain-English explanations in **Feature Language** must stay accurate
  in ordinary product language; if a term becomes too technical to
  explain plainly, split it into a feature-language term + a formal
  term row.
- Do not introduce canonical behavior here. Behavior lives in the
  aspect docs.
- Cross-feature terms must link to the owning module's source, not to a
  re-stating here.
