---
tags: [vault, research, retrieval, rag, graphrag, code-rag, theorem-rag, semantic-memory]
node_type: research
is_session: false
layer: ontology, architecture
nature: explanatory, technical
status: exploratory
version: 0.1.0
last_updated: 2026-05-25
analysis-method: local-repo-read, subagent-parallel-read, external-source-check
---

# Research — World-Class Multi-RAG Conceptual Architecture

## Objective

Determine what the next retrieval discovery must become if the target is not "a better vector RAG" but the best possible semantic memory for documents, code, mathematical functions, proof artifacts, sessions, and runtime traces.

## Trigger

The existing two-layer retrieval discovery proves the local point: body-only retrieval cannot preserve typed-edge identity. The new question is broader: if several RAGs will coexist, what common conceptual layer lets them behave as one faithful memory without flattening code, documents, and mathematics into contextless embeddings?

## Research Method

This research combines:
- Local read of `domainspec/vault/discovery/two-layer-retrieval/` and `domainspec/internal_tools/graph_retrieval/`.
- Local read of `domainspec-theorem/LEAN-TAXONOMY.md` and the Lean files around functorial defect, vector-only failure, universal residue, and fractal naming.
- Local read of `house_project/internal_tools/semantic_index`, `vault_routing`, and `docs/code-edges-validation.md`.
- Three parallel explorer-agent reads: one for the current `domainspec` RAG, one for theorem/Lean semantics, one for `house_project` code/document RAG.
- Current external pressure check against GraphRAG, Contextual Retrieval, LightRAG, and HippoRAG.

## 1. Local Evidence

### 1.1 `domainspec`: graph-aware vault retrieval already exists

The canonical discovery says retrieval must read schema-layer structure and instance-layer content. The prototype implements that shape:
- `internal_tools/graph_retrieval/retriever.py` exposes `retrieve(query, corpus, k, intent_override)` and runs a five-step pipeline: classify intent, build candidates, project to `NodeView`, score, sort.
- `internal_tools/graph_retrieval/compose.py` defines `NodeView`, stage prior, verification prior, and per-intent scoring.
- The current `VaultCorpus` surface is markdown-path oriented: `get_node`, `inbound`, `outbound`, `search_body`, `body_sim`.
- `LENS_TRIANGULATION` remains a known gap; multi-corpus federation is explicitly out of scope in the current implementation spec.

Conclusion: this is a strong vault/document substrate seed, not yet a multi-RAG architecture.

### 1.2 `house_project`: code-RAG and document-RAG ancestors exist, but are split

`house_project/internal_tools/semantic_index` is the code/domain ancestor:
- It extracts `CodeAnchor` records from `@biz` / `@sys` docstring tags.
- It validates taxonomy type and `@edge` verbs.
- It builds `domains/spec.yaml`.
- It composes rich embedding text for terms and anchors, including symbol, term, type, file, description, and edges.
- It exposes MCP tools such as `domain_context` and `semantic_query`.

`house_project/internal_tools/vault_routing` is the document ancestor:
- It indexes vault markdown documents.
- It stores frontmatter-derived trust signals: status, node type, veracidade, convicção.
- It returns both pure semantic ranking and trust-weighted routing ranking.

`house_project/internal_tools/docs/code-edges-validation.md` identifies the missing edge layer: compare L1 declared `@edge`s against L2 code call/import graph, producing Aligned, Code-only, Dictionary-only, and Indirect buckets. That is the code analogue of the two-layer retrieval problem: objects are anchored, but morphism preservation is still unverified.

Conclusion: the ingredients are good, but `Document ↔ Term ↔ CodeAnchor ↔ CodeGraphEdge` is not yet one graph.

### 1.3 `domainspec-theorem`: theorem-RAG should index declarations, types, and defects

`domainspec-theorem/LEAN-TAXONOMY.md` is already a semantic catalog: files, imports, structures/classes, defs/functions, theorems, exposed morphisms, and proof status.

The Lean layer gives retrieval semantics that ordinary RAG usually lacks:
- `FunctorialDefectDistance.lean` defines `HomDefect` and `FunctorialDefectDistance`; zero defect is exactly fully faithful, invariant under natural isomorphism, and subadditive under composition.
- `VectorOnlyRetrievalFailsEdges.lean` formalizes the body-collapse obstruction: a retriever factoring through body equivalence cannot recover edge semantics up to natural isomorphism.
- `UniversalResidueFunctor.lean` packages carrier, schema, signal/noise, refinement, and monotonicity into `ResidueStructure`.
- `FractalOP.lean` distinguishes `LanFaithful`, `InstanceFractal`, `SchemaFractal`, and `Fractal` across instance/schema layers.
- `NAMING.md` maps project terms to standard Mathlib terms, making alias/equivalence retrieval first-class.

Conclusion: theorem-RAG cannot be chunk retrieval. Its atoms are declarations, types, theorem statements, morphisms, adjunction units/counits, equivalence lemmas, proof status, and counterexamples.

## 2. External Pressure Check

The current RAG field is moving in the same direction, but not all the way to the local target.

- Microsoft GraphRAG frames graph retrieval as combining text extraction, network analysis, prompting, and summarization into one system, with local/global search variants. Source: [Microsoft Research GraphRAG](https://www.microsoft.com/en-us/research/project/graphrag/).
- Anthropic's Contextual Retrieval argues that traditional chunking often destroys context and improves retrieval by prepending chunk-specific context before embedding and BM25 indexing. Source: [Anthropic Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval).
- LightRAG explicitly criticizes flat data representations and combines graph structures with vector representations, including incremental updates. Source: [arXiv:2410.05779](https://arxiv.org/abs/2410.05779).
- HippoRAG targets integration across passage boundaries by orchestrating LLMs, knowledge graphs, and Personalized PageRank. Source: [NeurIPS 2024 paper](https://papers.neurips.cc/paper_files/paper/2024/file/6ddc001d07ca4f319af96a3024f6dbd1-Paper-Conference.pdf).

These sources support the direction: graph, context, hierarchy, and memory integration matter. The local system goes further by demanding substrate-specific identity: code symbols, Lean declarations, proof/counterexample edges, and authored trust cannot be reduced to one textual chunk representation.

## 3. Core Synthesis

### S-1. The best RAG is a semantic substrate federation

There should be several RAGs, but they should not be isolated products. They should be substrates behind one protocol:
- document/vault substrate;
- code-symbol substrate;
- theorem/Lean substrate;
- session substrate;
- runtime/event substrate.

Each substrate owns its identity and distance laws. Federation composes them through typed cross-substrate edges.

### S-2. The unit of memory is the semantic atom

A chunk is sometimes an atom, but not usually the best atom. The atom should be the smallest retrievable thing whose identity is stable:
- `DocumentChunk` with source span and frontmatter context;
- `DictionaryTerm`;
- `CodeSymbol` / `CodeAnchor`;
- `DeclaredEdge` / `CodeGraphEdge`;
- `LeanDeclaration`;
- `MathMorphism`;
- `TheoremClaim`;
- `SessionDecision`;
- `RuntimeEvent`.

Each atom should carry: stable ID, substrate, kind, locator, surface text, structured signature, source spans, typed edges, trust/proof/validation metadata, embeddings, and version.

### S-3. The dense layer is the artifact footprint

The user intuition about dense storage is right, but the density should not be only a dense numeric embedding. A better dense object is a sparse typed footprint:

```yaml
artifact_id: session:2026-05-25-rag-concept
atoms:
  - atom_id: code:semantic_index.CodeAnchor
    role: code-rag-unit
    weight: 0.88
    evidence: house_project/internal_tools/semantic_index/application/models/models.py
  - atom_id: lean:DomainSpec.FunctorialDefect.FunctorialDefectDistance
    role: math-distance
    weight: 0.91
    evidence: domainspec-theorem/lean-formalization/FunctorialDefectDistance.lean
  - atom_id: doc:two-layer-retrieval/discovery
    role: retrieval-identity-source
    weight: 1.0
    evidence: domainspec/vault/discovery/two-layer-retrieval/discovery.md
```

This object is compact and semantically loaded: it says what the artifact is about, what role each function/declaration/concept plays, where the evidence is, and how confident extraction was.

### S-4. Mathematical functions need their own retrieval semantics

For code, distance can use symbol names, call graph, tests, type signatures, shared domain anchors, and runtime traces.

For mathematics, distance needs different components:
- same declaration or alpha-renaming;
- equivalent theorem via `iff`, iso, natural iso, or named equivalence lemma;
- same functor/property but different layer or adjunction side;
- shared hypotheses/conclusion shape;
- dependency overlap;
- proof status and sorry status;
- obstruction by connected counterexample;
- functorial defect distance when available.

Embeddings can find nearby prose. They cannot decide whether two functors are naturally isomorphic, whether a unit is an iso, or whether a counterexample blocks a claim.

### S-5. Retrieval should report structural voids

A faithful RAG must sometimes return "the edge is missing", "the declaration has no proof", "the code relation is code-only", "the document has no theorem witness", or "the runtime trace has no matching event." This is not a failure mode; it is one of the most valuable outputs of the system.

## 4. Candidate Architecture

### 4.1 Interfaces

```python
class SemanticSubstrate:
    substrate_id: str
    def seed(self, query, intent) -> list[AtomHit]: ...
    def resolve(self, reference) -> AtomResolution: ...
    def neighbors(self, atom_id, edge_filter=None) -> list[TypedEdge]: ...
    def distance(self, query_or_atom, atom_id, intent) -> DistanceVector: ...
    def evidence(self, atom_id) -> EvidenceBundle: ...

class FederatedRetriever:
    def retrieve(self, query, intent=None, substrates=None) -> RetrievalTrace: ...
```

This preserves the spirit of `VaultCorpus` while admitting code and theorem substrates that do not identify objects by markdown path.

### 4.2 Retrieval Flow

1. Classify query intent and required substrates.
2. Resolve anchors: document terms, code symbols, Lean declarations, aliases, theorem names.
3. Seed each substrate with lexical + embedding + known-anchor signals.
4. Close over typed edges relevant to intent.
5. Compose artifact footprints and atom neighborhoods.
6. Rank within substrate; fuse across substrates by intent policy.
7. Return answer context, evidence spans, score components, and structural voids.
8. Store the retrieval trace for future evaluation.

### 4.3 Cross-Substrate Edges

Initial edge vocabulary:
- `documents` — document chunk discusses a term/symbol/declaration.
- `defines` — dictionary/vault node defines a term.
- `implements` — code symbol implements a term/spec.
- `calls` / `imports` — code graph relation.
- `tests` — test symbol validates code symbol.
- `formalizes` — Lean declaration formalizes a vault claim.
- `refutes` — theorem/counterexample blocks a claim.
- `proves` — declaration proves a theorem claim.
- `operationalizes` — runtime event witnesses a code/documented behavior.
- `supersedes` / `contradicts` / `derives-from` — existing vault relations.

## 5. Evaluation Shape

The evaluation suite should include:
- vector-only baseline;
- document-only graph-aware retrieval;
- code-only semantic index retrieval;
- theorem-only declaration retrieval;
- cross-substrate queries requiring at least two substrates;
- structural-void queries where the correct result is absence of an edge/proof/runtime witness.

Metrics should include:
- recall@k and MRR for known relevant atoms;
- citation/span precision;
- edge-preservation recall;
- structural-void precision;
- code edge coverage / declaration precision;
- proof-state accuracy;
- answer usefulness judged against golden traces.

## 6. Open Questions

### Q1. What is the minimum atom schema?

Recommendation: start with `SemanticAtom`, `TypedEdge`, `ArtifactFootprint`, `DistanceVector`, and `RetrievalTrace`. Avoid choosing the storage engine first.

### Q2. How should code anchors and Lean declarations share space?

Recommendation: do not put them into one ontology prematurely. Connect them by explicit edges (`formalizes`, `implements`, `refutes`, `tests`) and only compare distances after intent selection.

### Q3. How much extraction should be automatic?

Recommendation: automatic first pass with confidence, curated promotion for load-bearing discoveries, constitutions, theorem claims, and code contracts.

### Q4. What is the first implementation slice?

Recommendation: implement the protocol around three substrates only: vault documents, code anchors, Lean declarations. Add sessions and runtime after the atom/footprint model is stable.

## 7. Research Conclusion

The right design is not "better embeddings over better chunks." It is a typed semantic memory where embeddings are one retrieval lens over a graph of atoms. The dense layer should store what an artifact means by referencing the functions, mathematical declarations, claims, proofs, code symbols, and edges it depends on. That makes the RAG both compact and faithful: compact because footprints are small; faithful because identity and distance are substrate-aware.

## Connections

| Document | Type | Description |
|---|---|---|
| `../discovery.md` | `derives` | This research supports the v0.3.0 multi-RAG expansion. |
| `research.md` | `extends` | Extends the v0.2.0 two-layer retrieval research from vault-only retrieval to substrate federation. |
| `/Users/victorboscaro/house_project/internal_tools/semantic_index/README.md` | `cites` | Code/domain semantic-index ancestor. |
| `/Users/victorboscaro/house_project/internal_tools/vault_routing/` | `cites` | Document retrieval/trust-ranking ancestor. |
| `/Users/victorboscaro/domainspec-theorem/LEAN-TAXONOMY.md` | `cites` | Lean declaration catalog ancestor. |
| `/Users/victorboscaro/domainspec-theorem/lean-formalization/FunctorialDefectDistance.lean` | `cites` | Formal seed for mathematical distance. |
| `/Users/victorboscaro/domainspec-theorem/lean-formalization/files/new/VectorOnlyRetrievalFailsEdges.lean` | `cites` | Formal body-only collapse witness. |
