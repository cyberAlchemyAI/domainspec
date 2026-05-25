---
tags: [vault, research, retrieval, rag, semantic-memory, agentic-rag, theorem-rag, code-rag, evaluation]
node_type: research
is_session: false
layer: ontology, architecture
nature: explanatory, technical
status: exploratory
version: 0.1.0
last_updated: 2026-05-25
analysis-method: local-repo-read, subagent-parallel-read, external-source-check
verification: [local-files-read, web-fetched]
---

# Research - Perfect RAG Deepening

## Objective

Run a second research pass over `domainspec`, `domainspec-theorem`, and outside RAG/code/math retrieval literature to improve the two-layer retrieval idea into a world-class semantic RAG architecture.

The main conclusion: the target should not be "a better embedding index." It should be a **semantic context operating system** that can plan retrieval, preserve typed meaning, retrieve across documents/code/math/sessions/runtime, and report a formal defect or structural void when it cannot preserve meaning.

## Research Method

- Local repo read: `domainspec/vault/discovery/two-layer-retrieval`, `domainspec/vault/ontology-conventions.md`, `domainspec/vault/discovery/knowledge-calibration-geometry`, `domainspec/vault/discovery/harness-as-enforcement-layer`, `domainspec/internal_tools/graph_retrieval`.
- Theorem repo read: `domainspec-theorem/LEAN-TAXONOMY.md`, `LEAN-ARCHITECTURE.md`, `lean-formalization/FunctorialDefectDistance.lean`, `lean-formalization/files/new/VectorOnlyRetrievalFailsEdges.lean`, `lean-formalization/DefectResidue.lean`.
- Implementation ancestry read: `house_project/internal_tools/semantic_index`, `house_project/internal_tools/vault_routing`, and `house_project/docs/code-edges-validation.md`.
- Parallel subagent research: local conceptual synthesis, theorem/math synthesis, implementation synthesis, and outside literature pressure check.
- External source check: agentic RAG, GraphRAG, code RAG, theorem retrieval, multimodal RAG, memory systems, evaluation, and safety.

## The Upgrade

The prior v0.3.0 discovery already says that the project needs a federation of semantic substrates. This round sharpens that into a contract:

> A perfect RAG is semantically faithful where the substrate provides enough structure, and defect-bearing where it does not.

This means every answer should be able to say:

- which semantic atoms were retrieved;
- which typed relations were preserved;
- which substrate produced each claim;
- which proof/code/runtime/document evidence supports it;
- which relations were absent, contradictory, stale, or untrusted;
- which approximation was used when exact structure was unavailable.

In `domainspec-theorem` terms, retrieval quality should be measured like a functor: if the retrieval map preserves the relevant hom-structure, it is faithful; if not, the system returns a `DefectResidue` rather than pretending cosine similarity solved meaning.

## External State-of-the-Art Pressure

### Agentic and Planned Retrieval

Self-RAG, CRAG, REAPER, and Chain-of-Retrieval all push away from fixed top-k retrieval toward systems that decide when to retrieve, what to retrieve, how to revise, and when to stop. The lesson for this project is not to copy their exact controllers, but to make retrieval a **budgeted plan** with a trace.

Implication: `QueryIntent` is not enough. The architecture needs a `RetrievalPlanner` that decomposes a query, chooses substrates, chooses exact/graph/vector/search actions, and records why each action ran.

Sources: Self-RAG, CRAG, REAPER, CoRAG.

### Hybrid Retrieval Is Candidate Generation, Not Semantics

Contextual Retrieval and modern hybrid systems show that lexical + vector + reranking beats naive vector search. For this project, exact identifiers are even more important: theorem names, Lean declarations, function names, edge verbs, file paths, incident IDs, and business terms must not be dissolved into embedding space.

Implication: BM25/exact-symbol search, code symbol search, Lean declaration lookup, and graph expansion should seed candidates before embedding similarity and reranking.

Source: Anthropic Contextual Retrieval.

### GraphRAG Is Useful, But Graphs Must Be Substrate-True

Microsoft GraphRAG, DRIFT search, LightRAG, HippoRAG, and RAPTOR show the value of graphs and hierarchies for global sensemaking. But external work also warns that graph structure can hurt simple lookup or become noise if the graph is inferred poorly.

Implication: use graphs selectively. For code and Lean, graph edges should come from deterministic extractors (AST/import/call/type/proof dependencies), not from LLM guesses. LLM-inferred edges can exist only as low-trust hypotheses.

Sources: Microsoft GraphRAG, Local-to-Global GraphRAG, DRIFT Search, LightRAG, HippoRAG, RAPTOR, "When to Use Graphs in RAG".

### Code and Theorem RAG Require Deterministic Structure

CodeRAG-Bench, Repoformer, CodexGraph, and LeanDojo/ReProver point to the same lesson: code and proof retrieval are not ordinary document retrieval. The identity of an answer depends on definitions, imports, call graphs, type signatures, tests, proof dependencies, namespace, and local context.

Implication: `CodeSubstrate` and `LeanSubstrate` must expose declarations/functions as atoms with typed edges. They should also expose hard negatives: same name, same body text, similar theorem statement, incompatible type, stale symbol, renamed symbol, dead code, wrong import.

Sources: CodeRAG-Bench, Repoformer, CodexGraph, LeanDojo/ReProver.

### Multimodal Documents Need Layout-Preserving Atoms

Docling, ColPali, and VisRAG show why PDFs, tables, figures, equations, and page layout should not be flattened into Markdown too early. If a document artifact contains a formula, table, figure, signature block, or page-local reference, layout is part of meaning.

Implication: `DocumentSubstrate` should support page/table/figure/equation atoms and should keep source coordinates or page spans when available.

Sources: Docling, ColPali, VisRAG.

### Evaluation Must Be Built Before Ranking Optimizations

TREC RAG, ARES, RAGBench, and RAGAS all reinforce that RAG quality cannot be claimed from "answers look good." The project needs golden traces, hard negatives, unanswered queries, citation coverage, contradiction tests, and per-substrate metrics.

Implication: build a retrieval harness before polishing rankers. A world-class RAG should optimize against semantic faithfulness, not just answer fluency.

Sources: TREC 2024 RAG, ARES, RAGBench, RAGAS.

### Retrieved Context Is Untrusted Input

PoisonedRAG, OWASP LLM Top 10, and NIST GenAI risk guidance make one thing non-negotiable: retrieved text can be malicious or stale. In this project, retrieved code snippets, prompts, and documents must carry trust/provenance boundaries.

Implication: retrieval should separate evidence from instruction. The answerer may cite retrieved content as evidence, but it should not execute retrieved instructions unless they pass a trust policy.

Sources: PoisonedRAG, OWASP LLM Top 10, NIST AI 600-1.

## Local Convergence

### `domainspec`

The vault already has the right conceptual raw material:

- typed frontmatter edges and node taxonomies in `vault/ontology-conventions.md`;
- stage and verification metadata as ranking signals;
- `graph-as-residue-attractor` and Yoneda-style identity;
- knowledge calibration queues: evidence, divergence, enforcement;
- harness-as-enforcement-layer as the future place to make retrieval quality operational;
- `internal_tools/graph_retrieval` as the document/vault prototype.

The main gap is that the current prototype is still a markdown corpus. It does not yet have a common atom protocol, substrate adapter interface, cross-substrate trace, evaluation suite, or security policy.

### `domainspec-theorem`

The theorem repo gives the strongest conceptual upgrade:

- `FunctorialDefectDistance.lean` frames retrieval loss as loss of full faithfulness on hom-sets.
- `VectorOnlyRetrievalFailsEdges.lean` formalizes why body-only retrieval cannot recover edge semantics.
- `DefectResidue.lean` turns failure into a first-class output.
- `LEAN-TAXONOMY.md` and `LEAN-ARCHITECTURE.md` identify declarations, morphisms, defects, counterexamples, and proof status as retrievable mathematical atoms.

The key move is to import this discipline into the general RAG architecture: when retrieval cannot preserve a needed semantic relation, return the defect.

### `house_project/internal_tools`

The implementation ancestors show what should be kept and what should be fixed:

- keep `CodeAnchor`, `@biz`, `@sys`, and `@edge` as a code-semantic seed;
- keep trust-weighted document routing from `vault_routing`;
- add stable source IDs, source spans, validation status, graph edges, tests, embedding metadata, and a common `Candidate` model;
- fix dimensional/storage drift before treating current embeddings as canonical;
- implement edge validation rather than leaving it as a document-only plan.

## Proposed Principles

### P1. Semantic Faithfulness Contract

Every retrieval result should state what semantic structure it preserved. For graph-sensitive queries, the trace should show edges, spans, types, and substrate provenance. If the system cannot preserve the relevant structure, it should return a `DefectResidue`.

### P2. Retrieval Planner, Not Fixed Top-K

The system should plan retrieval actions:

1. parse intent and anchors;
2. decompose complex questions;
3. choose substrates;
4. run exact lookup, graph expansion, lexical search, vector search, and rerank as needed;
5. stop when evidence is sufficient or budget is exhausted;
6. return trace and voids.

### P3. Deterministic Structure First for Code and Math

For code and theorem substrates, deterministic extractors outrank LLM-inferred semantics:

- code: AST, imports, call graph, definitions, tests, docstring anchors, runtime traces;
- Lean: declarations, types, imports, proof dependencies, theorem statements, instances, sorries, theorem equivalences/counterexamples.

### P4. Embeddings Are Projections of Atoms

The semantic object is the atom or footprint. Embeddings are projections used for approximate recall, clustering, and reranking. The project should store embedding model, dimensions, source text recipe, created_at, and content hash for every vector.

### P5. Hyperedges / Relation Records

Binary edges are not enough for dense semantic memory. Many important facts are n-ary:

- claim X is supported by document span Y, implemented by code symbol Z, formalized by theorem W, observed in runtime trace T;
- session S decided D under assumption A, later contradicted by evidence E;
- function f is semantically close to theorem g under role "implements" but far under role "proves".

Represent these as relation records with roles, participants, evidence, confidence, and validation status.

### P6. Calibration Queues Are Retrieval Outputs

The RAG should not only answer. It should produce calibration work:

- missing edge;
- stale embedding;
- unindexed function;
- contradiction;
- no proof witness;
- code/doc drift;
- runtime/doc drift;
- unsupported claim.

These become first-class `CalibrationFinding`s and can feed the harness layer.

### P7. Evaluation Harness With Hard Negatives

The golden set should include:

- exact symbol lookup;
- near-identical body but different edge;
- same function name in different modules;
- theorem statement similar but type-incompatible;
- document says one thing, code does another;
- session decision superseded by later decision;
- no-answer queries;
- prompt-injection-bearing retrieved text;
- stale runtime evidence;
- simple fact where vector search should win or tie.

### P8. Security Boundary

Retrieved content is evidence, not instruction. The trace should mark source trust, user-writable status, verification type, and whether the content is executable, prompt-like, or merely documentary.

### P9. Multimodal Source Preservation

Document atoms should preserve page, table, figure, equation, and layout coordinates when available. Flattened Markdown is acceptable as one projection, not as the sole representation.

### P10. Budgeted Agentic Retrieval

Agentic retrieval must have budget, timeout, trace, and stop criteria. "Let an agent search until it feels good" is not a retrieval architecture.

## Architecture Sketch

```python
class FederatedQuery:
    query: str
    intents: list[str]
    anchors: list[str]
    required_evidence: list[str]
    scope: list[str]
    budget: dict
    debug: bool

class SemanticAtom:
    atom_id: str
    substrate: str
    kind: str
    stable_locator: str
    surface_text: str
    structured_signature: dict
    source_spans: list[dict]
    typed_edges: list[dict]
    trust: dict
    embeddings: list[dict]
    version: str

class Candidate:
    atom: SemanticAtom
    snippet: str
    score_components: dict
    provenance: dict

class RetrievalTrace:
    query: FederatedQuery
    plan: list[dict]
    candidates: list[Candidate]
    selected: list[Candidate]
    preserved_edges: list[dict]
    defects: list[dict]
    structural_voids: list[dict]

class DefectResidue:
    required_structure: dict
    missing_or_collapsed_structure: dict
    witness: dict
    severity: str
```

Recommended retrieval loop:

1. Resolve anchors and intent.
2. Build a retrieval plan.
3. Run substrate-specific candidate generation.
4. Expand deterministic graph neighborhoods.
5. Fuse with lexical/vector/rerank scores.
6. Validate required evidence and typed edges.
7. Return answer context, trace, defects, and calibration findings.

## Metrics

### Retrieval Metrics

- precision@k, recall@k, MRR, nDCG;
- exact symbol hit rate;
- no-answer accuracy;
- hard-negative rejection;
- source diversity;
- freshness lag.

### Faithfulness Metrics

- edge preservation rate;
- required-evidence coverage;
- citation/path-line coverage;
- contradiction surfacing;
- hallucination leakage;
- `DefectResidue` correctness.

### Code Metrics

- `@edge` coverage rate;
- declaration precision;
- AST/call/import edge coverage;
- test witness coverage;
- stale symbol rate.

### Theorem Metrics

- declaration resolution accuracy;
- type compatibility;
- import/dependency preservation;
- proof status accuracy;
- false theorem-neighbor rejection;
- functorial defect distance when available.

### Federation Metrics

- substrate contribution by intent;
- rerank delta;
- conflict rate;
- cross-substrate edge coverage;
- calibration findings per query.

### Safety Metrics

- prompt-injection rejection;
- untrusted-source isolation;
- executable-context isolation;
- source verification coverage.

## What Not To Copy

- Pure vector chunks as the memory model.
- One embedding dimension/model for every substrate.
- LLM-invented graphs as ground truth.
- GraphRAG as a universal solution for every query.
- Agentic retrieval without budget/trace/stop criteria.
- RAFT/fine-tuning as a replacement for living retrieval.
- PDF-to-Markdown flattening as the only document representation.
- Synthetic-only benchmarks without hard negatives.

## Immediate Improvements to the Discovery

1. Add `SemanticFaithfulnessContract` as the central design promise.
2. Promote `DefectResidue` from theorem artifact to general retrieval output.
3. Add a `RetrievalPlanner` / context operating system concept.
4. Add deterministic code/math graph extraction as a requirement.
5. Add hyperedges/reified relation records.
6. Add `CalibrationFinding` as a retrieval byproduct.
7. Add a golden evaluation harness before optimizing ranking.
8. Add a security/trust boundary for retrieved context.
9. Add multimodal document atoms.
10. Record storage/index drift as an implementation risk.

## Sources

- Self-RAG: <https://arxiv.org/abs/2310.11511>
- CRAG: <https://arxiv.org/abs/2401.15884>
- REAPER: <https://arxiv.org/abs/2407.18553>
- Chain-of-Retrieval (CoRAG): <https://arxiv.org/abs/2501.14342>
- Anthropic Contextual Retrieval: <https://www.anthropic.com/engineering/contextual-retrieval>
- Microsoft GraphRAG: <https://www.microsoft.com/en-us/research/project/graphrag/>
- From Local to Global GraphRAG: <https://arxiv.org/abs/2404.16130>
- DRIFT Search: <https://microsoft.github.io/graphrag/query/drift_search/>
- LightRAG: <https://arxiv.org/abs/2410.05779>
- HippoRAG: <https://arxiv.org/abs/2405.14831>
- When to Use Graphs in RAG: <https://arxiv.org/abs/2506.05690>
- RAPTOR: <https://arxiv.org/abs/2401.18059>
- CodeRAG-Bench: <https://arxiv.org/abs/2406.14497>
- Repoformer: <https://arxiv.org/abs/2403.10059>
- CodexGraph: <https://arxiv.org/abs/2408.03910>
- LeanDojo/ReProver: <https://arxiv.org/abs/2306.15626>
- LeanDojo docs: <https://leandojo.org/leandojo.html>
- Docling technical report: <https://research.ibm.com/publications/docling-technical-report>
- ColPali: <https://arxiv.org/abs/2407.01449>
- VisRAG: <https://arxiv.org/abs/2410.10594>
- Letta/MemGPT: <https://docs.letta.com/guides/agents/architectures/memgpt>
- A-MEM: <https://arxiv.org/abs/2502.12110>
- TREC 2024 RAG overview: <https://pages.nist.gov/trec-browser/trec33/rag/overview/>
- TREC RAG evaluation: <https://trec-rag.github.io/annoucements/evaluation/>
- ARES: <https://aclanthology.org/2024.naacl-long.20/>
- RAGBench: <https://arxiv.org/abs/2407.11005>
- RAGAS: <https://arxiv.org/abs/2309.15217>
- Lost in the Middle: <https://arxiv.org/abs/2307.03172>
- PoisonedRAG: <https://arxiv.org/abs/2402.07867>
- OWASP Top 10 for LLM Applications: <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- NIST AI 600-1: <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- RAFT: <https://openreview.net/pdf?id=rzQGHXNReU>
