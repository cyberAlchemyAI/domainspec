---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, test]
node_type: spec
is_session: false
layer: application
nature: procedural, technical
status: draft
version: 0.2.0
last_updated: 2026-05-18
---

# Test Spec: Two-Layer Retrieval

Acceptance tests for the [retrieve](interfaces.md#internal-retrieve-top-level-function)
workflow. Tests live in
`internal_tools/tests/test_two_layer_retrieval.py` and run against a
fixture corpus built from
[/Users/victorboscaro/house_project/docs/vault/](/Users/victorboscaro/house_project/docs/vault/).

## Test Matrix

| ID | Test | Validates |
| -- | ---- | --------- |
| [T1](#t1--intent-classification) | `classify_intent` returns expected intent for 24 sample queries (3 per intent) | [workflows.md Step 1](workflows.md#step-1-intent-classification) |
| [T2](#t2--corpus-load) | `NetworkXCorpus` loads `house_project` vault and reports ≥1 node per `node_type` present | [domain.md VaultCorpus](domain.md#vaultcorpus) |
| [T3](#t3--f2-and-f3-stratification-canon) | `retrieve("what do we believe about residue?", k=5)` returns only `node_type ∈ {axiom, constitution}` with `status ∈ {consolidated, evergreen}` | [rules.md F2](rules.md#f2--type-stratification), [F3](rules.md#f3--stage-stratification) |
| [T4](#t4--f1-typed-edge-preservation) | Every result's `view.inbound_edges` equals `corpus.inbound(view.path)` exactly | [rules.md F1](rules.md#f1--typed-edge-preservation) |
| [T5](#t5--f4-canon-rejects-model-recall-only) | `CANON` query never returns a `model-recall`-only node | [rules.md F4](rules.md#f4--verification-provenance-respect) |
| [T6](#t6--f5-supersedes-pathology) | Synthetic `A` and `A'` with identical bodies; `CANON` ranks `A'` strictly above `A` | [rules.md F5](rules.md#f5--supersedes-pathology) |
| [T7](#t7--provenance-edge-presence) | `retrieve("evidence for graph-as-residue?", k=5)` returns nodes with `inbound_edges["derives-from"]` non-empty | [workflows.md Step 2](workflows.md#step-2-candidate-set-construction), `PROVENANCE` |
| [T8](#t8--falsification-round-vector-only-baseline) | Same query set, vector-only baseline ranks differently from two-layer for ≥1/3 of structurally-demanding queries | discovery falsification round |

## Test Details

### T1 — Intent classification

Sample-driven: 3 queries per intent × 8 intents = 24 cases. Each
asserts `classify_intent(query) == expected_intent`. Source queries are
fixture-data inside the test file so they version with the test.

### T2 — Corpus load

Load `house_project` vault. Assert `corpus.nodes()` yields > 0 records.
For each `node_type` value found in the fixture's frontmatter, assert
the corpus contains ≥ 1 node of that type. Catches regression in the
loader after vault schema changes.

### T3 — F2 and F3 stratification (CANON)

Query: `"what do we believe about residue?"`, k=5. Assert every
returned node satisfies `node_type ∈ {"axiom", "constitution"}` and
`status ∈ {"consolidated", "evergreen"}`. Covers
[F2](rules.md#f2--type-stratification) and
[F3](rules.md#f3--stage-stratification).

### T4 — F1 typed-edge preservation

For every result node, assert
`set(view.inbound_edges.keys()) == corpus.inbound_edge_types(view.path)`
and for each key the source lists match `corpus.inbound(view.path, edge_type=k)`
exactly. Mirror the assertion for `outbound_edges` /
`corpus.outbound_edge_types` / `corpus.outbound`. Run across CANON,
PROVENANCE, SEMANTIC queries — the contract holds regardless of intent.

### T5 — F4 CANON rejects model-recall-only

Inject a fixture node `M` with body matching the query closely but
`verification: ["model-recall"]`. Assert `M.path` does not appear in
`result.nodes` for any CANON query.

### T6 — F5 supersedes pathology

Synthetic fixture: nodes `A` and `A'` with identical bodies; `A'` has
`outbound_edges["supersedes"] = ["A.md"]`. Run a CANON query whose
body matches both equally. Assert `score(A') > score(A)` strictly. This
is the test that distinguishes the two-layer retriever from any pure
vector retriever.

### T7 — Provenance edge presence

Query: `"evidence for graph-as-residue?"`, k=5. Assert ≥ 1 result has
non-empty `view.inbound_edges["derives-from"]`. Confirms edge-leaning
candidate construction (step 2b) is running and that scorer
`score_provenance` is wired.

### T8 — Falsification round (vector-only baseline)

Run a 9-query "structurally-demanding" set (CANON, PROVENANCE, TENSION,
BLAST_RADIUS × representative cases) through two pipelines:

1. **Two-layer** — the full `retrieve` pipeline.
2. **Vector-only baseline** — skip step 2 hard filter and step 4
   compose; rank purely by `body_sim`.

Assert the top-k orderings disagree (Kendall τ < 1.0 or set difference
≥ 1) for ≥ 3 of the 9 queries. **Failing T8 means the two-layer
architecture is empirically indistinguishable from vector RAG on this
corpus and the design should be re-examined** — this is the
falsification round called for by the discovery's "Next Moves" section.

## Known Gaps (deferred test coverage)

Tracked here because each gap implies a missing or weak test. Sourced
from §9 of the original SPEC.

### G1 — `LENS_TRIANGULATION` has no scorer

[Intent.LENS_TRIANGULATION](domain.md#intent) is in
[../../../intent.py](../../../intent.py) but absent from
`compose.SCORERS` at
[../../../compose.py](../../../compose.py) lines 101–109. v0.1 raises
`NotImplementedError` if classified. **v0.2 obligation:** add a scorer
or remove the intent. **Negative test:** assert classifying a
LENS_TRIANGULATION query and calling `retrieve` raises
`NotImplementedError` with a message naming the intent.

### G2 — Multi-intent queries

[classify_intent](../../../intent.py) returns a single intent; queries
that span CANON + PROVENANCE are scored as one. Discovery open question
O3. **v0.2 obligation:** return a ranked list or a primary-with-secondary
shape.

### G3 — Intent confidence is binary

`intent_confidence` is `1.0` or `0.5`. A real classifier should return
a calibrated probability. [interfaces.md](interfaces.md) RetrievalResult
schema is forward-compatible — only the producer needs to change.

### G4 — `search_body` is raw cosine

Lens 04 of the discovery implies a learned per-intent reranker is the
long-term answer. Out of scope for v0.1; track as v0.3+ work.

## Out of Scope

- Lean formalization of the Yoneda criterion (queued in
  `/domainspec-theorem/pipeline/queue/0003`).
- Vault mutation (this retriever is read-only — no operations.md
  mutation tests).
- Query rewriting / expansion.
- Multi-corpus federation.
- Caching, persistence, or warm-start of the embedding matrix beyond
  what is described in
  [operations.md#embedding-matrix-warm-vs-cold](operations.md#embedding-matrix-warm-vs-cold).
- Anything tied to a specific UI surface.
