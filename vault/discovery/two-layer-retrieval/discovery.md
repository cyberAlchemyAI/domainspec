---
tags: [vault, discovery, ontology, retrieval, two-layer, graphrag, yoneda]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: exploratory
version: 0.5.0
last_updated: 2026-05-25
---

# Two-Layer Retrieval: Discovery

> **v0.2.0 post-hoc alignment note (2026-05-18).** This discovery was originally drafted on 2026-05-17 directly from the 4 lens findings without an intermediate research-layer document. On 2026-05-18 a `research/` layer (`research.md` + `research-synthesis.md`) was retrofitted in to align with the new lens → research → discovery convention proven on `graph-as-residue-attractor`. The discovery's claims were not edited; only the upstream provenance chain was structurally aligned. Any tensions surfaced by the post-hoc independent read are filed as open questions in `research.md` for a future v0.3.0.

> **v0.3.0 multi-RAG expansion note (2026-05-25).** The retriever is no longer treated as one vault-only RAG. The new target is a **semantic substrate federation**: document/vault retrieval, code-symbol retrieval, theorem/Lean retrieval, session retrieval, and runtime retrieval share one identity discipline while keeping substrate-specific evidence, distances, and trust models. Embeddings remain useful seed signals; they are not the semantic object being stored.

> **v0.4.0 semantic-fidelity deepening note (2026-05-25).** The target is now sharper: a world-class RAG is a **semantic context operating system**, not a fixed top-K embedding service. It plans retrieval actions, preserves typed meaning where the substrate provides it, and returns a `DefectResidue` / structural void when the required semantics are absent, collapsed, stale, contradictory, or untrusted. The best RAG is therefore not the one that always returns plausible text; it is the one that knows what kind of meaning it preserved.

> **v0.5.0 subagent-review note (2026-05-25).** A six-agent review tightened the claim discipline and implementation path. "World-class" is now treated as a falsifiable target, not an achieved empirical result: semantic-faithful retrieval must be demonstrated through golden traces, hard negatives, explicit object boundaries, and staged adapters over current prototypes. The immediate implementation target is a Codex-facing `ContextBundle` and `RetrievalTrace`, not a wholesale rewrite of existing indices.

> A retriever over the graded vault must read **both** schema-layer structure (typed edges, node types, stages, verification) **and** instance-layer content (body embeddings). Pure vector retrieval cannot in principle satisfy the vault's own identity criterion on structurally-demanding queries; the minimum faithful architecture composes body-similarity, edge-traversal, and type/stage/verification filters under **query-intent conditioning**.

---

## Objective

Codify the design space for retrieval over the graded knowledge vault and its sibling semantic substrates: documents, code, mathematical declarations, sessions, and runtime traces. End state: a documented conceptual architecture for a world-class multi-RAG system whose retrieval units are semantic atoms, artifact footprints, retrieval traces, and defect residues, not contextless chunks.

In this document, "world-class" is an architecture target with pass/fail pressure, not a claim of achieved benchmark superiority. The falsifiable target is: for structurally-demanding queries, the system preserves the relevant typed semantics or returns an explicit defect/void; for simple lookup, it can degrade to lexical/vector retrieval without pretending graph structure is always superior.

---

## 1. Business Context

### Why now

The parent discovery [`graph-as-residue-attractor`](../graph-as-residue-attractor/) defines node identity through the Yoneda hom-presheaf — a node is what its typed-edge neighborhood is, not what its body says. A retriever that operates only on body-text similarity therefore violates the vault's own identity criterion at query time. Without a retrieval architecture that respects schema-layer structure, the framework's predictions become unfalsifiable: queries that should distinguish a paper from its retraction (the *supersedes pathology*) cannot, because their bodies are near-identical and only the edge differs.

### What's broken (in the current design space)

- **Body-only similarity collapses typed edges.** Documented across 7/10 surveyed failure modes (lens 03 §A, F1, F2, F5, F8) including multi-hop QA on MuSiQue and global sensemaking on Microsoft GraphRAG's Novorossiya example. *Formal counterpart:* lens 02 §C1 (no typed-edge preservation) and §C3 (supersedes-pathology counterexample) — load-bearing because they are derivations, not benchmarks.
- **Body-only similarity collapses node types.** 5/10 failures (lens 03 §A, F3, F4, F6, F7, F10) including CVT-node misreads in Mindful-RAG and schema-bound KPI query collapse documented in `arXiv:2506.05690` (vector RAG ≈0% vs. optimized GraphRAG 90%+). *Formal counterpart:* lens 02 §C2 (no type stratification).
- **Identity violation on near-identical bodies.** 6/10 failures (lens 03 §A) plus the formal Yoneda counterexample (lens 02 §C3): `e(n) = e(m)` with a `supersedes n → m` edge yields `h_n ≢ h_m` in the vault, but vector top-K returns them as interchangeable.
- **No surveyed GraphRAG variant exposes the full combination needed.** Lens 01 §B: pre-existing typed edges + query-intent-conditioned layer composition + evidence-stage filtering + verification-provenance ranking + Yoneda identity check was **not found in the surveyed set**. Closest single papers: NodeRAG (heterogeneous node types — hard-coded 7), REANO (query-conditioned edge attention — no stage/provenance), KG2RAG (pre-existing edges — no intent routing). This remains a survey-grade novelty claim until primary-source verification is complete.
- **The current prototype is single-corpus.** `internal_tools/graph_retrieval/retriever.py` assumes a `VaultCorpus` over markdown paths with `get_node`, `inbound`, `outbound`, `search_body`, and `body_sim`; `internal_tools/graph_retrieval/features/two-layer-retrieval/spec/architecture.md` explicitly leaves multi-corpus federation out of scope. This blocks queries whose answer lives across `DocumentChunk ↔ CodeSymbol ↔ LeanDeclaration`.
- **The code RAG and document RAG exist as separate ancestors.** In `house_project/internal_tools`, `semantic_index` extracts `CodeAnchor` records from `@biz/@sys/@edge` docstrings and embeds composed code-anchor text, while `vault_routing` embeds whole vault documents and ranks by similarity × trust. They do not yet share stable IDs, spans, trust metadata, graph traversal, or a comparable ranking surface.
- **Mathematical functions are not first-class retrieval atoms yet.** `domainspec-theorem/LEAN-TAXONOMY.md` catalogs Lean files, defs, theorems, morphisms, and proof status, while `FunctorialDefectDistance.lean` and `VectorOnlyRetrievalFailsEdges.lean` formalize semantic distance and body-only collapse. None of that is currently adapted into a queryable retrieval substrate.
- **No artifact footprint exists.** A session or document can discuss a dense set of code functions, mathematical functions, concepts, proofs, and edges, but the current retriever stores only node body plus local graph metadata. It cannot say "this artifact is mostly about `FunctorialDefectDistance`, `CodeAnchor`, `Edge Coverage Rate`, and the `DocumentChunk ↔ CodeSymbol` bridge" as a compact, evidence-backed semantic object.
- **No retrieval planner exists.** The v0.2/v0.3 architecture has intent-conditioned ranking, but not a budgeted planner that decomposes questions, resolves anchors, chooses substrates, expands graph neighborhoods, validates required evidence, and records stop criteria.
- **No common trace/defect surface exists.** A perfect RAG must return not just context, but `RetrievalTrace`, preserved edges, source spans, score components, structural voids, and `DefectResidue` when semantic structure was required but missing or collapsed.
- **No golden semantic evaluation harness exists.** There is no cross-substrate hard-negative suite covering exact symbol lookup, near-identical body/different edge, theorem-like-but-type-incompatible cases, stale code anchors, superseded sessions, no-answer queries, and prompt-injection-bearing retrieved text.
- **Retrieved context has no explicit security boundary.** The architecture distinguishes verification and trust metadata, but does not yet specify that retrieved text is evidence, not instruction, nor how executable/prompt-like/untrusted sources are isolated.

### What stays the same

- Pure vector retrieval remains correct for **simple-fact / pure-lookup queries** where the answer's identity does not depend on type/edge/stage structure. Lens 03 §C contrary finding: vector RAG scores 83.2% evidence recall on simple facts in `arXiv:2506.05690`, beating GraphRAG. The two-layer retriever's claimed advantage is **scoped to structurally-demanding queries**, not universal.
- The vault's existing frontmatter schema, edge catalog, and node-type taxonomy are inputs to this discovery, not outputs. Schema evolution belongs in `ontology-conventions.md` and `two-layer-platform-architecture/` (kernel + frontmatter ownership), not here.
- Body embeddings remain a first-class signal. The architecture composes vector similarity with structural signals; it does not replace one with the other.
- Architecture and prototype implementation are **out of scope** for this discovery. They belong to the application-side counterpart at `internal_tools/graph_retrieval/features/two-layer-retrieval/` (referenced, not authored here).
- The v0.2.0 two-layer retriever remains the document/vault substrate seed. v0.3.0 generalizes the conceptual target; it does not invalidate the existing acceptance tests or scorer shapes.
- `house_project/internal_tools/semantic_index` remains the code-RAG ancestor, not a dependency to vendor wholesale into `domainspec`.
- `domainspec-theorem` remains the theorem/proof substrate, not a requirement that every query become Lean-formalized. Formal distance is a high-authority signal when available.
- The formal results are scoped. `VectorOnlyRetrievalFailsEdges` witnesses a body-only collapse of edge semantics; it does not imply vector retrieval is worse for every query. `FunctorialDefectDistance` gives a coarse `0/⊤` gate around full faithfulness; it is not yet a rich Lawvere-style metric for ranking.
- Novelty claims remain survey-grade. The safe claim is that the exact combination was not found in the surveyed sources, not that it is absent from all literature.
- Federation is a staged migration target. Current prototypes should be wrapped as read-only substrates before any storage migration, embedding normalization, or schema consolidation.

---

## 2. Core Concepts

### C-1. Retrieval as a functor `R: Q → Sub(G)`

A retrieval operation is a functor from a query category `Q` (with refinements as morphisms) into the poset of subpresheaves of the vault `G`. Refinement narrows; functoriality enforces respect for the refinement lattice. (Lens 02 §A.) **Why this framing:** it makes "faithful" precisely definable rather than leaving it as a quality claim.

### C-2. Faithfulness = Yoneda-commutation up to natural iso

`R` is faithful iff for every retrieved node `n ∈ R(q)`, the inclusion `R(q) ↪ G` is **full on n** — `R(q)` inherits without addition or deletion the typed-edge structure `G` assigns to `n`. By Yoneda this is the smallest condition that forces node identity in `R(q)` to coincide with node identity in `G`. (Lens 02 §B.) **Why this framing:** it identifies the minimum requirement, not an optimization target.

### C-3. Two-layer composition

A faithful retriever reads two layers:
- **Schema layer** — typed edges, node types, evidence stages, verification provenance. Operated on by graph traversal, type/stage filters, edge-typed reachability.
- **Instance layer** — body embeddings. Operated on by cosine similarity.

Neither layer alone is sufficient on structurally-demanding queries (lens 02 §C1–C3). The minimum architecture composes them. (Lens 01 §C Option 3; lens 04 §B.)

### C-4. Query-intent conditioning

The *composition* of the two layers is not fixed at training time — it is selected per query by an **intent classifier**. Lens 04 §B proposes eight intents (Canon, Provenance, Frontier, Tension, Semantic, Blast-radius, Lens-triangulation, Definitional), each with a different ranking function composing body-similarity, edge-traversal, type filter, stage filter, and verification prior. **Why this framing:** lens 01 §B shows no published GraphRAG composes different layer stacks per intent — the closest precedents (REANO's query-conditioned edge attention, GraphRAG's user-selected global/local/DRIFT modes) either fix the stack or expose only 2–3 hardcoded modes.

### C-5. Verification-provenance as ranking signal (novel)

The vault's `verification` facet (`local-files-read`, `web-fetched`, `model-recall`, etc.) and its `evidence_stage` lattice (`draft → exploratory → active → consolidated → evergreen`) are first-class ranking inputs, not metadata. Lens 01 §B: this is **absent from every retrieved GraphRAG paper**. Closest analogs are SELF-RAG's ISREL/ISSUP reflection tokens (post-hoc grading, not retrieval-time) and ad-hoc metadata weighting in clinical-decision-support RAG. Lens 04 §D-5 sharpens the open question: verification should be **intent-conditioned** (`ν_i(π)`, not global `ν(π)`) — hard filter for Canon, soft demote for Frontier.

### C-6. Semantic substrate federation

A world-class retriever is a federation of typed substrates, not one universal vector index. The first substrates are:
- **Document substrate** — vault files, headings, chunks, frontmatter, connections, evidence stage, verification.
- **Code substrate** — code symbols, `CodeAnchor`s, docstring tags, AST spans, call/import edges, tests, runtime ownership.
- **Theorem substrate** — Lean declarations, types, imports, theorem statements, proof dependencies, sorries, morphisms, functorial defects, counterexamples.
- **Session substrate** — conversation decisions, assumptions, unresolved questions, artifact footprints, agent returns.
- **Runtime substrate** — EventLog entries, traces, production incidents, metrics, observed behaviors.

Each substrate has its own identity law and distance signals. Federation means a query routes into the right substrate set and then composes results through explicit cross-substrate edges.

### C-7. Semantic atom

A semantic atom is the minimum addressable unit whose identity can survive retrieval:

| Substrate | Atom examples | Identity evidence |
|---|---|---|
| Document | file, heading chunk, block span, frontmatter claim | path + heading/block id + source span + edges |
| Code | function, class, method, API endpoint, test, `CodeAnchor` | symbol + file span + signature + AST node + call/import graph |
| Theorem | Lean declaration, theorem, structure, class, instance, morphism | fully qualified name + type/statement + dependencies + proof status |
| Session | decision, assumption, question, child-agent finding | session id + message span + author/tool provenance |
| Runtime | event, trace, incident, metric window | event id + timestamp + emitter + schema |

The atom is not the embedding. The embedding is one projection of the atom.

### C-8. Artifact footprint

An artifact footprint is a dense semantic summary of what a document, session, code change, or proof attempt is about. It stores weighted references to semantic atoms plus roles:

```yaml
artifact_id: vault/discovery/two-layer-retrieval/discovery.md
mentions:
  - atom: lean:DomainSpec.FunctorialDefect.FunctorialDefectDistance
    role: formalizes-distance
    weight: 0.92
    evidence_span: "§C-9"
  - atom: code:semantic_index.CodeAnchor
    role: code-rag-unit
    weight: 0.84
    evidence_span: "§C-7"
  - atom: doc:two-layer-retrieval/research/2026-05-25-world-class-multi-rag.md
    role: derives-from
    weight: 1.0
```

This is the "extremely dense" storage layer: a compact sparse vector over typed semantic atoms, backed by spans and graph edges, plus optional dense embeddings for approximate search.

### C-9. Cross-substrate distance stack

Distance is intent-conditioned and multi-component, not one scalar:
- **lexical distance** — BM25/exact-symbol match for identifiers, theorem names, error codes.
- **embedding distance** — semantic similarity over composed text.
- **graph distance** — typed reachability, path shape, edge confidence, neighborhood overlap.
- **code distance** — call/import proximity, shared tests, shared domain anchors, blast radius.
- **math distance** — type/statement compatibility, dependency overlap, equivalence lemmas, natural isomorphism, functorial defect, counterexample obstruction.
- **trust distance** — status, verification, proof status, validation report, runtime freshness.

The ranking function chooses a projection of this vector by query intent. A proof query should privilege type/proof edges; an impact query should privilege code graph and runtime traces; a conceptual query should start from document/vault atoms and expand into code/theorem witnesses.

### C-10. Semantic faithfulness contract

Every retrieval result should be able to state which semantic structure it preserved. For a document query, that may mean path, heading, span, typed vault edges, stage, and verification. For a code query, it may mean symbol, signature, AST span, call/import/test edges, and runtime ownership. For a theorem query, it may mean declaration name, type/statement, imports, proof dependencies, proof status, and counterexample/equivalence edges.

This is the generalization of the `domainspec-theorem` insight: retrieval quality is not only empirical answer quality; it is preservation of the relevant hom-structure. When the retrieval map cannot preserve the required structure, the system should expose the defect instead of hiding it behind semantically plausible text.

### C-11. Retrieval planner / context operating system

The retriever should be a budgeted planner, not a fixed top-K service. The planner decomposes a query, resolves anchors, selects substrates, chooses exact/lexical/vector/graph/proof/runtime actions, validates evidence, and stops when the evidence target is met or the budget is exhausted.

The output is not only a ranked list. It is a context bundle: selected atoms, evidence spans, preserved relations, ranking components, conflicts, voids, and follow-up calibration work.

### C-12. `DefectResidue` as retrieval output

`DefectResidue` is the retrieval-side name for "the system knows which meaning it failed to preserve." Examples:

- the document mentions a function, but no code atom resolves;
- two chunks are body-similar, but one supersedes or refutes the other;
- a theorem statement is textually close, but type-incompatible;
- a session asserts a decision that was later contradicted;
- a code anchor claims an edge, but validation cannot find the target.

This turns retrieval failure into useful knowledge. The answer can say "not enough structure," and the harness can convert that into indexing/calibration work.

### C-13. Hyperedge / relation record

Binary edges remain useful, but the densest semantic memory is often n-ary:

```yaml
relation_id: rel:claim-supported-implemented-formalized
kind: semantic_witness
participants:
  claim: doc:two-layer-retrieval#C-10
  support: doc:research/2026-05-25-perfect-rag-deepening.md#P1
  implementation: code:graph_retrieval.Retriever
  formalization: lean:DomainSpec.FunctorialDefectDistance
confidence: 0.78
validation: partial
```

Relation records allow a session/document/code change/proof attempt to store extremely dense information without flattening it into prose or one embedding vector.

### C-14. Calibration finding

A world-class RAG should produce maintenance work as a byproduct:

- missing edge;
- stale embedding;
- unresolved symbol;
- unsupported claim;
- contradiction;
- no proof witness;
- code/doc drift;
- runtime/doc drift;
- unsafe retrieved context.

These findings connect retrieval to the knowledge-calibration and harness layers. The system improves because every hard query leaves typed residue behind.

### C-15. Evaluation and security harness

The architecture needs a golden suite before it optimizes ranking. It must include easy lookups, hard negatives, structural-void cases, no-answer queries, contradiction queries, theorem/type traps, stale code symbols, and prompt-injection-bearing sources.

Security is part of evaluation: retrieved text is evidence, not instruction. The trace must mark trust, verification, user-writable status, executable status, and prompt-like content.

### C-16. Object boundary discipline

The architecture distinguishes six object levels:

- `SemanticAtom` — the smallest stable retrievable identity, admitted only with locator, span/provenance, structured signature, version/hash, and substrate-owned identity evidence.
- `ArtifactFootprint` — an artifact-to-atom/relation projection describing what an artifact is about; it records salience, extraction confidence, validation status, trust, and evidence spans.
- `RelationRecord` / hyperedge — a validated n-ary semantic claim among atoms or artifacts, with participant roles, trust, and validation status.
- `RetrievalTrace` — the audit object for a query: required structure, retrieval actions, selected/rejected evidence, preserved relations, defects, fallback decisions, stop criteria, and emitted calibration findings.
- `DefectResidue` — a typed semantic failure, not merely low score.
- `CalibrationFinding` — actionable maintenance residue with evidence, severity, owner hint, suggested action, age/recurrence, confidence, and status.

This boundary prevents false precision. A footprint says "this artifact is about these atoms"; a relation record says "these participants stand in this semantic relation"; a trace says "this query followed this path"; a defect says "this required structure was missing/collapsed/unsafe"; a calibration finding says "this should be fixed or reviewed."

### C-17. `ContextBundle` as Codex-facing retrieval surface

For agent use, the retriever should return a compact `ContextBundle` by default and a full trace on request:

```python
class ContextBundle:
    verdict: Literal["usable", "usable_with_caveats", "void", "conflict", "unsafe"]
    agent_brief: str
    selected_spans: list[SourceSpan]
    atoms: list[SemanticAtom]
    preserved_relations: list[TypedEdge | RelationRecord]
    defects: list[DefectResidue]
    calibration_findings: list[CalibrationFinding]
    allowed_actions: list[str]
    trace: RetrievalTrace
```

Example CLI shape:

```bash
domainspec rag query "what breaks if we change X?" \
  --task code-change \
  --scope vault,code,theorem \
  --require file-line,typed-edges,trust \
  --budget 8s \
  --trace compact \
  --format codex
```

The agent reads `verdict`, `defects`, and `allowed_actions` before using snippets. Retrieved content is evidence; it does not become an instruction channel.

### C-18. Lean declaration atom

`LeanDeclaration` specializes `SemanticAtom` with theorem/proof structure:

- `fq_name`, `module`, `file_span`, namespace;
- `kind`: theorem, def, structure, class, instance, abbrev, lemma, morphism;
- `type_signature`: elaborated and pretty-printed type/statement;
- `imports`;
- `dependencies`: direct and transitive separated;
- `proof_status`: sorry-free, contains-sorry, statement-only, placeholder/contract;
- `morphism_role`: functor, natural transformation, adjunction side, equivalence, counterexample witness, when applicable;
- `semantic_edges`: proves, uses, refines, contradicts, counterexample-to, equivalent-to, imports, bridge-to;
- `distance_features`: type compatibility, dependency overlap, natural iso/equiv evidence, functorial defect;
- `trust/provenance`: extractor version, build target, lake status, content hash, generated_at.

The formal layer gives a hard gate (`0/⊤`) for structural loss; the operational ranker still uses a multi-component distance vector.

### C-19. Golden trace fixture

Evaluation fixtures should grade the retrieval trace, not only the answer:

```yaml
query:
  text:
  expected_intents:
  anchors:
  required_substrates:
  required_evidence:
expected_plan:
  actions:
  stop_condition:
must_select:
  - atom_id:
    required_edges:
    required_spans:
must_reject:
  - atom_id:
    reason:
expected_defects:
  - kind:
    severity:
security_expectations:
  prompt_injection_rejected:
  untrusted_isolated:
```

The initial suite should include simple lookup, near-identical body/different edge, exact symbol lookup, Lean type traps, cross-substrate witness, no-answer/structural void, contradiction/supersession, prompt injection, freshness/staleness, and stage-bound queries.

---

## 3. Decisions Taken

The lenses converge on the following decisions. Each is exploratory (`status: exploratory`); promotion requires the architecture spec and a falsification round.

### D-1. Adopt graph-aware retrieval as the minimum architecture

**Decision.** The retriever must read `Hom_C(-, -)` (typed-edge structure) in addition to body embeddings. Vector-only retrieval is rejected as the primary architecture for the vault.

**Rationale.** Lens 02 §D necessity theorem: any retriever that does not read typed-edge structure factors through a hom-non-faithful functor and therefore fails the faithfulness condition. The supersedes-pathology counterexample (§C3) is the load-bearing concrete instance — minimal, two-node, schema-driven, with proof-grade status.

**Scope.** Applies to structurally-demanding queries (intents I1–I4, I6, I7, I8 in lens 04 §B). Pure-semantic queries (I5) degrade gracefully to vector-only.

**Status.** Exploratory. The necessity theorem is proof-sketch (§D), not a fully general Lean theorem. A minimal body-only edge-collapse witness exists in `VectorOnlyRetrievalFailsEdges.lean`; any vault-specific `supersedes` formalization should still be tracked separately.

### D-2. Compose layers per query intent (not per training run)

**Decision.** The ranking function is selected per query by an intent classifier mapping each query to an ordered composition of (body-similarity, edge-traversal restricted to a typed subgraph, node-type filter, stage filter, verification prior). The composition is **not** fixed by the retriever's training.

**Rationale.** Lens 04 §A: no surveyed system parametrises the ranking function within a retriever by intent at query time. Lens 01 §B identifies this as the load-bearing novelty. Lens 04 §C derives two general templates that fall out of the eight intents: **body-leaning** `r = (type/stage filter) · ν(π) · cos`, and **edge-leaning** `r = 1[reachable via E'] · ρ_E'(a, n) · prior`.

**Status.** Exploratory. The intent taxonomy (8 classes) is a proposal, not validated against historical vault queries.

### D-3. Treat verification-provenance and evidence-stage as ranking signals, intent-conditioned

**Decision.** `ν_i(π)` (intent-conditioned verification prior) and `μ(σ)` (stage prior) participate in the ranking function. Verification is a hard filter for Canon-class intents (I1) and a soft demote for Frontier-class intents (I3).

**Rationale.** Lens 04 §D-5 surfaces the design question; lens 01 §B confirms no published GraphRAG variant ranks on `evidence_stage` or verification-provenance. Honest scope: lens 03 §C reports stage collapse as the *weakest-corroborated* failure mode (2/10) — the literature rarely names "evidence stage" as a missing primitive, so this design choice rests on the vault's own discipline more than on published benchmarks.

**Status.** Exploratory. Per-intent `ν_i` schedule is not specified; the architecture spec must enumerate.

### D-4. Treat "RAG" as plural: a federated semantic memory

**Decision.** The target architecture is a federation of RAGs/substrates sharing a semantic-atom protocol and cross-substrate edges, not a single monolithic embedding database.

**Rationale.** The local evidence already splits naturally: `domainspec` has graph-aware vault retrieval; `house_project` has code anchors and document trust routing; `domainspec-theorem` has mathematical declarations, proof status, and formal distance/collapse results. Forcing them into one vector space would erase precisely the identity information this discovery exists to preserve.

**Status.** Exploratory. Requires a future architecture spec for `FederatedCorpus` / `SemanticSubstrate` interfaces.

### D-5. Index code functions and mathematical functions as first-class atoms

**Decision.** Code symbols and mathematical declarations are first-class retrieval atoms. "Function" means both executable code functions and mathematical functions/functors/declared Lean objects, with substrate-specific identity evidence.

**Rationale.** `house_project/internal_tools/semantic_index` already treats code symbols as anchors with type, term, file, line, description, and edges. `domainspec-theorem/LEAN-TAXONOMY.md` already catalogs defs/functions, theorems, structures/classes, morphisms, and proof status. `FunctorialDefectDistance.lean` gives a formal distance seed for functorial loss; `VectorOnlyRetrievalFailsEdges.lean` proves that body-only retrieval cannot recover edge semantics.

**Status.** Exploratory. The extraction path for Lean declaration atoms is not implemented.

### D-6. Store semantic compression, not just embeddings

**Decision.** The dense object to preserve is the artifact footprint: a compact, typed, sparse graph of atom references, roles, weights, confidence, and spans. Dense embeddings are attached to atoms/footprints as approximate indexes, not treated as the only memory.

**Rationale.** Embeddings are excellent for candidate generation and fuzzy recall, but they are lossy. The project's own formal counterexample shows that a body quotient cannot recover edge semantics up to natural isomorphism. A footprint preserves the high-value structure explicitly and lets embeddings remain an accelerator.

**Status.** Exploratory. Needs schema, extraction heuristics, and evaluation.

### D-7. Make retrieval planned, traceable, and budgeted

**Decision.** The retriever should expose a `RetrievalPlanner` whose plan and stop criteria are part of the returned trace.

**Rationale.** External systems such as Self-RAG, CRAG, REAPER, and Chain-of-Retrieval point to the same pressure: fixed top-K is too weak for complex questions. Locally, the vault already has multiple substrates and intent classes, which means the system must decide where to search and what kind of evidence is sufficient.

**Status.** Exploratory. Requires a plan schema and trace schema before implementation.

### D-8. Deterministic edges outrank inferred edges for code and Lean

**Decision.** For `CodeSubstrate` and `LeanSubstrate`, graph edges should come from deterministic extraction whenever possible: AST, imports, call graph, type signatures, tests, Lean environment declarations, theorem dependencies, proof status, and counterexample/equivalence edges. LLM-inferred edges may exist only as low-trust hypotheses.

**Rationale.** Code and math semantics are brittle under paraphrase. A plausible explanation is not enough to prove that one function calls another or that one theorem depends on another. `VectorOnlyRetrievalFailsEdges.lean` gives the formal warning: body text can collapse edges that are semantically decisive.

**Status.** Exploratory. The Lean extractor and code-edge validator are not implemented in this repo yet.

### D-9. Return `RetrievalTrace` and `DefectResidue`, not only context

**Decision.** Every serious retrieval call should be able to return selected atoms, evidence spans, score components, preserved edges, conflicts, structural voids, and defect residues.

**Rationale.** This makes retrieval auditable, trainable, and improvable. It also lets the system distinguish "answer unavailable because graph structure is absent" from "answer unavailable because search failed."

**Status.** Exploratory. This is the output contract for a future `FederatedRetriever`.

### D-10. Build evaluation before optimizing ranking

**Decision.** The next implementation phase should define a golden semantic evaluation harness before tuning rankers.

**Rationale.** The project needs hard negatives: same text/different edge, same function name/different module, theorem-like/type-incompatible, stale symbol, no-answer, superseded session, prompt-injection text. Without this suite, "better RAG" will regress into answer fluency.

**Status.** Exploratory. Evaluation fixtures can start as YAML/JSON traces before the full engine exists.

### D-11. Stabilize contracts before changing rankers

**Decision.** Implementation should start with shared contracts (`SemanticAtom`, `SourceSpan`, `TypedEdge`, `TrustEnvelope`, `DistanceVector`, `RetrievalTrace`, `DefectResidue`, `ContextBundle`) before new ranking logic.

**Rationale.** The current prototypes disagree on corpus unit, trust model, embedding dimension, and query surface. Optimizing ranking before the result contract is stable would make evaluation impossible.

**Status.** Exploratory implementation decision.

### D-12. Wrap existing systems as read-only substrates first

**Decision.** `graph_retrieval`, `semantic_index`, and `vault_routing` should become adapters before any storage migration. They expose `search`, `resolve`, `neighbors`, and `explain`, converting native outputs into the common contract.

**Rationale.** This preserves working prototypes and lets the evaluation harness discover which fields deserve permanent schema support. It also avoids premature normalization of incompatible embedding stores.

**Status.** Exploratory implementation decision.

### D-13. Make `ContextBundle` the default agent surface

**Decision.** The Codex-facing API should return a compact `ContextBundle` with `verdict`, spans, atoms, preserved relations, defects, calibration findings, allowed actions, and trace reference. Full traces are available in debug/audit/eval modes.

**Rationale.** Agents need a small actionable context for daily work, not a massive raw trace. The trace remains central for audit, tests, and calibration.

**Status.** Exploratory implementation decision.

---

## 4. Alternatives Considered

### A-1. Pure vector RAG (with optional reranker)

**Sketch.** Standard top-K cosine over body embeddings, optionally followed by a cross-encoder rerank.

**Why considered.** Operational simplicity; large body of tooling; **wins on simple-fact queries** (83.2% evidence recall in `arXiv:2506.05690`, lens 03 §C contrary finding).

**Why rejected as primary.** Cannot in principle satisfy the Yoneda faithfulness criterion (lens 02 §C1–C3). Empirically fails on every multi-hop benchmark surveyed (lens 03 F1, F2, F8) and on schema-bound queries (F3, F10). The supersedes-pathology counterexample (§C3) is structurally decisive: even with infinite training, vector RAG returns a paper and its retraction as interchangeable.

**Scope of remaining use.** Intent I5 (pure semantic similarity) and as the body-similarity component of body-leaning intents (I1, I3, I8).

### A-2. Adopt NodeRAG, modify heavily

**Sketch.** Lens 01 §C Option 1. NodeRAG is the only published system with first-class heterogeneous nodes and a router that respects them. Modifications: swap its 7 fixed node types for the vault's 6 (premise/constitution/axiom/conceptual/discovery/session); swap LLM/HNSW edge construction for the vault's pre-existing typed edges; add `evidence_stage` and `verification` attributes; replace K-core/betweenness importance with a stage-weighted prior; add an intent classifier.

**Why considered.** Reuses the only published type-aware router; lowest invention cost.

**Why not chosen as primary.** The intent router is the load-bearing new piece, and NodeRAG has no such router — the substitution is so large that "adopt + modify" is closer to "rebuild." NodeRAG's structural metrics (K-core, betweenness) are content-independent; the vault needs stage/verification-aware priors that NodeRAG has no place to inject.

### A-3. Compose KG2RAG + REANO + SELF-RAG-style grader

**Sketch.** Lens 01 §C Option 2. KG2RAG gives "pre-existing KG with fact-level edges drives chunk expansion." REANO gives query-conditioned edge attention. SELF-RAG's reflection-token idea, repurposed, gives evidence-stage and verification-provenance grading. Glue: REANO is inner loop; KG2RAG bounds the candidate set; the grader is outer rerank.

**Why considered.** Maximum reuse of published systems; each component is independently validated.

**Why not chosen as primary.** Three independent codebases with different assumptions; integration cost likely exceeds the cost of specifying the architecture cleanly. REANO conditions edge attention on the query but does not select *which edge types to traverse* per intent — that selector is still missing.

### A-4. Specify a new architecture (lens 01 §C Option 3)

**Sketch.** Typed-edge presheaf index (Yoneda identity directly implemented) + intent → layer-composition table + stage-and-provenance prior + lenses-edge as runtime view-switch.

**Why provisionally adopted.** Items 1, 2, and 4 do not appear in any surveyed source (lens 01 §B). Item 3 generalizes the clinical-RAG metadata-weighting pattern into a graph retriever. This is the route that respects the vault's identity criterion by construction rather than by adaptation.

**Caveat.** Lens 01 §D notes that KG2RAG, REANO, Jin et al. [186], SELF-RAG, and MIND-RAG were only reached through secondhand survey descriptions — claims about them must be re-verified before publication. The "no published variant does this" conclusion is *strong but not exhaustive*.

### A-5. One universal vector space for everything

**Sketch.** Embed vault chunks, code anchors, Lean declarations, sessions, and runtime traces into one model/dimension and rank all results by cosine plus a global reranker.

**Why considered.** Operationally simple; matches common RAG infrastructure; can quickly cross-search mixed corpora.

**Why rejected as primary.** It collapses substrate identity. A code symbol, a theorem statement, and a conversation decision may be semantically close in text while playing incompatible roles. The architecture needs to know whether a result proves, implements, contradicts, tests, mentions, emits, or merely resembles another atom.

**Scope of remaining use.** Federated candidate generation and fallback search when no substrate-specific anchor can be resolved.

---

## 5. Open Questions

### OQ-1. How is query intent detected?

Rule-based is brittle; pure-LLM is expensive; the SetFit→LLM hybrid (lens 04 §A) needs labelled vault queries we do not yet have. **Recommendation:** bootstrap by hand-labelling ~200 historical queries from session logs, in parallel with generating synthetic queries from the lens 04 §B taxonomy; defer choice of classifier until labelled data exists.

### OQ-2. Hard filter or soft demote for verification?

Lens 04 §D-5. **Recommendation:** intent-conditioned `ν_i`, not global `ν`. Hard filter for I1 (Canon — `recall`-only axioms excluded); soft demote for I3 (Frontier — `recall` permitted but penalised); architecture spec must enumerate per intent.

### OQ-3. How does the architecture handle multi-intent queries?

"Evidence for X, and what contradicts it?" is I2 ∪ I4. Lens 04 §D-2 enumerates three options: decompose into sub-queries; product ranker `r_I2 · r_I4`; soft intent distribution `r = Σ_i p(i|q) · r_i`. **Recommendation:** start with decomposition (most explainable); revisit when telemetry shows the share of multi-intent queries.

### OQ-4. Which retrieval-collapse counterexamples should be formalized in Lean?

`VectorOnlyRetrievalFailsEdges.lean` already gives a minimal body-only edge-collapse witness. The open question is which project-specific pathologies should also be formalized: `supersedes`, `refutes`, proof-status collapse, type-incompatible theorem neighbors, or code-anchor edge collapse. **Recommendation:** treat formalized witnesses as scoped evidence, not universal benchmark claims.

### OQ-5. Where does the architecture degrade to vector RAG gracefully?

Lens 04 §D-3: I2 (Provenance) on a node with no inbound `derives-from` returns nothing. Fall back to I5 (semantic proxy)? Or report the structural void? **Recommendation:** report the structural void by default (the framework's discipline is to surface empty result sets as data); allow caller to request semantic-proxy fallback explicitly.

### OQ-6. Anchor resolution confidence threshold

Lens 04 §D-4: edge-leaning intents require an anchor; anchor resolution is itself a retrieval (I5/I8 two-stage). What confidence on anchor resolution justifies committing to the edge-leaning ranker? **Recommendation:** open; needs prototype data.

### OQ-7. Is "stage collapse" a real empirical gap or a vocabulary mismatch?

Lens 03 §C honest reporting: stage collapse is the *weakest-corroborated* failure mode (2/10). Either the literature does not name "evidence stage" as a missing primitive (vocabulary mismatch) or vector RAG does not in fact lose stage information measurably. **Recommendation:** the architecture spec must include a falsification test targeting stage-bound queries specifically (e.g., "what did we believe in March vs. May?" on the vault's own evolution); current evidence supports the design choice but does not yet confirm it.

### OQ-8. How is "formal faithfulness" distinguished from "empirically better"?

Lens 02 establishes a **formal** property (faithfulness as Yoneda-commutation): vector RAG cannot in principle satisfy it; graph-aware retrieval can. This is *not* the empirical claim that graph-aware retrieval scores higher on benchmarks — that claim rests on lens 03's 10 documented failures and remains subject to the lens 03 §C contrary finding on simple facts. The discovery must consistently distinguish: (i) formal impossibility on the Yoneda criterion (proof-grade, lens 02), (ii) empirical failure patterns (corroborated 5–7/10, lens 03), (iii) novelty of the proposed combination (absent from surveyed literature, lens 01). **Recommendation:** treat (i) as load-bearing for the architectural decision, (ii) as scope-defining for where the advantage applies, (iii) as honest reporting on prior art.

### OQ-9. What is the common atom protocol across substrates?

The federation needs one enough-common shape for identity, spans, edges, embeddings, trust, and provenance without flattening substrate-specific semantics. **Recommendation:** start with `SemanticAtom` fields: `atom_id`, `substrate`, `kind`, `stable_locator`, `surface_text`, `structured_signature`, `source_spans`, `typed_edges`, `trust`, `embeddings`, `version`.

### OQ-10. How should cross-substrate distances be calibrated?

Code graph distance, Lean proof distance, document trust, and embedding cosine are not naturally comparable. **Recommendation:** do not force comparability globally. Rank within substrates first, then fuse by intent-specific policies and explainable cross-substrate edges.

### OQ-11. How automatic should artifact-footprint extraction be?

Footprints can be authored, extracted, or hybrid. Pure automation risks hallucinated atom links; pure authorship is too expensive. **Recommendation:** bootstrap with automatic extraction plus confidence, then let high-value artifacts promote/curate their footprints when they become load-bearing.

### OQ-12. What is the schema for hyperedges / relation records?

Binary frontmatter edges are readable and simple, but code/document/theorem/runtime witness structures are often n-ary. **Recommendation:** keep frontmatter binary edges as the human-authored layer, and add machine-managed relation records for dense multi-participant semantics.

### OQ-13. What is the retrieved-context trust policy?

Retrieved text can be malicious, stale, user-authored, or prompt-like. **Recommendation:** separate "retrieved as evidence" from "allowed to instruct execution." The trace should carry verification, trust, user-writable status, executable status, and prompt-injection risk.

### OQ-14. Which storage/index layout can support federated atoms?

Current ancestors disagree on dimensions, schemas, and ranking surfaces. **Recommendation:** introduce a federated index manifest with source IDs, atom counts, embedding model/dimension, content hash, generated_at, extractor version, and validation status for each substrate.

### OQ-15. How should `DefectResidue` be graded?

A defect can be fatal, informative, or acceptable fallback depending on intent. **Recommendation:** classify defects by intent: fatal for proof/implementation claims, informative for frontier research, and optionally fallback-able for loose semantic exploration.

### OQ-16. Which retrieval modes expose full traces?

Normal agent use should be compact; audit/eval/debug need full traces. **Recommendation:** define modes: `compact`, `debug`, `audit`, `eval`. `compact` returns a `ContextBundle`; the other modes include candidate lists, rejected candidates, score components, policy decisions, and substrate timings.

### OQ-17. What are the first pass/fail thresholds?

The discovery now has metric families but not thresholds. **Recommendation:** define an initial golden suite with "verdict correct + evidence citability" as the first gate, then add stricter thresholds for edge preservation, hard-negative rejection, no-answer accuracy, and prompt-injection blocking.

### OQ-18. When do relation records graduate from sidecar to schema?

Hyperedges are powerful but premature if atom IDs and spans are unstable. **Recommendation:** keep relation records as sidecar JSONL/SQLite until atoms, spans, validation status, and trace fixtures stabilize.

---

## 6. Status of Each Claim (Epistemic Honesty)

Per user constraint on distinguishing formal property from empirical observation:

| Claim | Status | Source |
|-------|--------|--------|
| Vector-only retrieval violates the Yoneda identity criterion on edge-load-bearing examples | **Formal witness + proof sketch** (minimal body-only edge-collapse formalized; general necessity remains proof sketch) | Lens 02 §C3; `VectorOnlyRetrievalFailsEdges.lean` |
| Graph-aware retrieval (full-subpresheaf closure) is faithful | **Proof** (immediate from full-subpresheaf construction) | Lens 02 §D sufficiency |
| Graph-awareness is the minimum requirement | **Proof sketch** (hom-faithfulness reduction; not formalized) | Lens 02 §D necessity |
| Vector RAG fails on multi-hop, schema-bound, and global-sensemaking queries | **Empirical** (corroborated 5–7/10 in surveyed literature) | Lens 03 §A, §B |
| Vector RAG wins on simple-fact queries | **Empirical contrary finding** (83.2% on `arXiv:2506.05690`) | Lens 03 §C |
| Stage collapse is a documented failure mode | **Weakly empirical** (2/10; possibly vocabulary mismatch) | Lens 03 §C |
| The proposed combination is unpublished | **Survey-grade** (strong but not exhaustive; secondhand sources flagged) | Lens 01 §B, §D |
| Intent-conditioned layer composition has no published precedent | **Survey-grade** | Lens 01 §B; lens 04 §A |
| The eight-intent taxonomy partitions vault queries cleanly | **Proposal** (not validated against historical queries) | Lens 04 §B |
| RAG should be a federation of semantic substrates | **Local-architecture synthesis** | `research/2026-05-25-world-class-multi-rag.md` |
| Code symbols are first-class retrieval atoms | **Implemented ancestor + proposal** | `house_project/internal_tools/semantic_index` |
| Lean declarations and mathematical functions are first-class retrieval atoms | **Catalog-backed proposal** | `domainspec-theorem/LEAN-TAXONOMY.md`; `FunctorialDefectDistance.lean` |
| Artifact footprints are the dense storage layer | **Proposal** | v0.3.0 §C-8 |
| Perfect RAG means semantic faithfulness plus explicit defect reporting | **Theorem-informed architecture proposal** | `DefectResidue.lean`; `FunctorialDefectDistance.lean`; v0.4.0 §C-10/§C-12 |
| Retrieval should be planned and traceable, not fixed top-K | **External + local architecture synthesis** | Self-RAG, CRAG, REAPER, CoRAG; v0.4.0 §C-11 |
| Deterministic code/Lean graphs should outrank LLM-inferred graphs | **Engineering requirement + formal warning** | CodeRAG/LeanDojo lineage; `VectorOnlyRetrievalFailsEdges.lean` |
| A golden semantic evaluation harness must precede ranker tuning | **Evaluation-design requirement** | TREC RAG, ARES, RAGBench, RAGAS; v0.4.0 §D-10 |
| Retrieved context requires a trust/security boundary | **Security requirement** | PoisonedRAG, OWASP LLM Top 10, NIST AI 600-1; v0.4.0 §C-15 |
| Object boundaries among atoms, footprints, relation records, traces, defects, and calibration findings are required | **Subagent-review architecture correction** | `research/2026-05-25-subagent-review-implementation-plan.md` |
| Existing retrievers should be wrapped as adapters before migration | **Implementation-risk mitigation** | `graph_retrieval`; `semantic_index`; `vault_routing`; v0.5.0 §D-12 |
| `ContextBundle` is the Codex-facing API target | **Product/API proposal** | v0.5.0 §C-17 |
| Golden traces should grade retrieval traces, not answer text alone | **Evaluation-design requirement** | v0.5.0 §C-19 |

---

## 7. Implementation Sketch

This is not the full architecture spec. It is the staged path recommended by the v0.5.0 subagent review.

### Phase 0. Contracts before ranking

Create a small `internal_tools/semantic_retrieval/contracts.py` module with shared objects:

- `SourceSpan`
- `TypedEdge`
- `TrustEnvelope`
- `SemanticAtom`
- `DistanceVector`
- `RetrievalQuery`
- `RetrievalCandidate`
- `DefectResidue`
- `RetrievalTrace`
- `ContextBundle`
- `SemanticSubstrate` protocol

No existing retriever should be rewritten in this phase.

### Phase 1. Read-only substrate adapters

Wrap current ancestors:

- `VaultSubstrate` over `internal_tools/graph_retrieval`.
- `CodeSubstrate` over `house_project/internal_tools/semantic_index`.
- `DocumentSubstrate` over `house_project/internal_tools/vault_routing`.
- `LeanSubstrate` initially over `domainspec-theorem/LEAN-TAXONOMY.md`, later over mechanical Lean extraction.

Each adapter exposes:

```python
class SemanticSubstrate(Protocol):
    name: Substrate

    def search(self, query: RetrievalQuery, *, k: int) -> list[RetrievalCandidate]: ...
    def resolve(self, locator: str) -> SemanticAtom | None: ...
    def neighbors(self, atom_id: str, edge_types: set[str] | None = None) -> list[SemanticAtom]: ...
    def explain(self, atom_id: str) -> dict[str, Any]: ...
```

Adapters should preserve native embedding dimensions, score components, and trust metadata instead of averaging them into one global score.

### Phase 2. Codex-facing CLI / API mock

Expose a stable JSON surface even if the first backend is only `VaultSubstrate`:

```bash
domainspec rag query "..." --scope vault,code,theorem --trace compact --format codex
domainspec rag resolve "symbol-or-doc"
domainspec rag impact path/to/file.py --include docs,tests,runtime
domainspec rag trace <trace_id> --why-ranked
domainspec rag calibrations --status open
```

Default output is compact and actionable. Full traces are reserved for `debug`, `audit`, and `eval`.

### Phase 3. Golden trace harness

Create an initial 30-fixture suite. Primary pass/fail gate: correct `verdict` plus citability of selected evidence. Add edge preservation, hard-negative rejection, no-answer accuracy, and security blocking as secondary gates.

### Phase 4. Calibration queue

Persist `CalibrationFinding`s in JSONL or SQLite. Do not create a global "RAG score." Each finding needs evidence, severity, owner hint, suggested action, age/recurrence, confidence, and status.

### Phase 5. Code substrate MVP

Index code functions/classes/methods with spans, signatures, imports/calls where available, docstring anchors, and test witnesses. Keep current `semantic_index` storage intact.

### Phase 6. Structural validation gates

Consume `vault_ctl` validation, edge checks, snapshots, and `tower_explorer` origin certification as trust inputs to `ContextBundle.verdict`.

### Phase 7. Footprints and relation records

Add sidecar `ArtifactFootprint`s for sessions, discoveries, and specs. Add `RelationRecord`s only after atom IDs, spans, and validation statuses are stable.

### Phase 8. Lean substrate and security policy

Start with taxonomy/manifest extraction for Lean declarations. Move toward mechanical extraction of declarations, types, imports, dependencies, proof status, and equivalence/counterexample edges. Finalize trust/taint policy before retrieved content is allowed to guide edits or execution.

## 8. Next Moves

Tracked here so the next session does not invent them.

1. **Snapshot zero for the retrieval question** — capture the current vault's query distribution (if any session logs exist) and intent labels for a sample of ~50 queries. Without this baseline, OQ-1 cannot be answered empirically.
2. **Draft the architecture spec** under `internal_tools/graph_retrieval/features/two-layer-retrieval/` (application scope — not in this vault folder). Inputs: D-1, D-2, D-3 + the eight-intent taxonomy + the two ranking-function templates from lens 04 §C.
3. **Promote the supersedes-pathology counterexample to a `premise` file** under `vault/premise/` — it carries the formal weight of D-1 and currently lives only in lens 02 §C3.
4. **Run a falsification round.** Same query set across pure-vector and the proposed architecture on `/house_project/docs/vault/` or the domainspec vault itself. Targets: multi-hop (expected: architecture wins), simple-fact (expected: vector wins or ties — confirms scope), stage-bound (expected: architecture wins; falsifies OQ-7 if it does not).
5. **Re-verify the lens 01 secondhand sources** (KG2RAG, REANO, Jin et al. [186], SELF-RAG, MIND-RAG) by reading primary papers before any external publication of the novelty claim.
6. **Track Lean queue 0003** (OQ-4). If the supersedes counterexample does not formalize cleanly, revisit D-1's necessity argument.
7. **Coordinate with [`two-layer-platform-architecture/`](../two-layer-platform-architecture/)** — that discovery sequences `graph_retrieval` for week 5–6 and depends on the kernel + frontmatter-ownership decision landing first.
8. **Draft the semantic atom protocol.** Minimal schema: `SemanticAtom`, `ArtifactFootprint`, `TypedEdge`, `RetrievalTrace`.
9. **Define substrate adapters.** Start with `VaultSubstrate`, `CodeSubstrate`, and `LeanSubstrate`; keep `SessionSubstrate` and `RuntimeSubstrate` as follow-ons.
10. **Import the `house_project` lessons without copying its shape blindly.** Preserve `CodeAnchor`, taxonomy roles, composed embedding text, and edge-coverage validation; add source spans, trust, validation status, call/import graph, and tests.
11. **Create a Lean declaration extractor.** Use `LEAN-TAXONOMY.md` as bootstrap, then move toward mechanical extraction of declaration names, types, statements, imports, theorem dependencies, proof status, and equivalence/counterexample edges.
12. **Build a golden query suite across substrates.** Include queries that require document-only, code-only, theorem-only, and cross-substrate answers.
13. **Measure structural voids.** A world-class RAG must report when the graph has no edge, no proof, no code anchor, or no runtime witness instead of papering over the void with semantically similar text.
14. **Specify `RetrievalPlanner`, `RetrievalTrace`, and `DefectResidue`.** These three contracts are now the center of the architecture.
15. **Add hyperedge / relation-record design.** Preserve binary edges for authored frontmatter, but add relation records for dense code/document/theorem/runtime witness bundles.
16. **Create the semantic evaluation harness.** Start with YAML/JSON golden traces and hard negatives before optimizing any ranker.
17. **Define retrieved-context security policy.** Retrieved content is evidence, not instruction; classify prompt-like, executable, user-writable, stale, and untrusted content.
18. **Record and fix substrate-index drift.** Align embedding dimensions, source IDs, content hashes, and validation metadata across `graph_retrieval`, `semantic_index`, and `vault_routing`.
19. **Prototype `CalibrationFinding`.** Turn missing edges, stale embeddings, unresolved symbols, contradictions, and unsupported claims into first-class outputs that feed the harness layer.
20. **Create `ContextBundle` JSON schema.** This is the Codex-facing API contract and should precede CLI polish.
21. **Build read-only adapters before migration.** The first implementation should wrap existing retrievers, not rewrite them.
22. **Add compact/debug/audit/eval trace modes.** Normal agent use should not receive the full candidate trace unless requested.
23. **Define first pass/fail thresholds.** Start with verdict correctness and evidence citability, then add edge preservation, hard-negative rejection, no-answer accuracy, and security policy gates.
24. **Keep relation records sidecar until atom IDs stabilize.** Hyperedges should not become canonical schema before source spans and validation status are reliable.

---

## 9. Source Dispatch

This discovery promotes the findings collected in:

- `vault/discovery/two-layer-retrieval/README.md` — index and triangulation summary
- `vault/discovery/two-layer-retrieval/lenses/01-graphrag-state-of-the-art.md` — surveyed 7+ GraphRAG variants; novelty assessment
- `vault/discovery/two-layer-retrieval/lenses/02-formal-faithfulness.md` — Yoneda-indexed faithfulness criterion; impossibility results
- `vault/discovery/two-layer-retrieval/lenses/03-vector-rag-failure-modes.md` — 10 documented failure modes; pattern table
- `vault/discovery/two-layer-retrieval/lenses/04-query-intent-ranking.md` — 8-intent taxonomy; per-intent ranking functions
- `vault/discovery/two-layer-retrieval/research/2026-05-25-world-class-multi-rag.md` — local/external research synthesis for semantic substrate federation
- `vault/discovery/two-layer-retrieval/research/2026-05-25-perfect-rag-deepening.md` — second-round research synthesis upgrading federation into semantic-fidelity contracts, retrieval planning, defect output, evaluation, and security
- `vault/discovery/two-layer-retrieval/research/2026-05-25-subagent-review-implementation-plan.md` — third-round subagent review tightening claim discipline, object boundaries, implementation contracts, golden traces, and Codex-facing API shape
- `/Users/victorboscaro/house_project/internal_tools/semantic_index/` — code-RAG ancestor: dictionary terms, `CodeAnchor`s, `@edge`s, composed embedding text
- `/Users/victorboscaro/house_project/internal_tools/vault_routing/` — document-RAG ancestor: whole-document embeddings plus trust-weighted routing
- `/Users/victorboscaro/domainspec-theorem/LEAN-TAXONOMY.md` and `lean-formalization/` — theorem-RAG ancestor: Lean declarations, morphisms, proof status, formal distance/collapse witnesses

The original four-lens slate was dispatched and promoted under user confirmation in lifecycle step 7 of `/domainspec-subagents-strategy` on 2026-05-17. The v0.3.0 multi-RAG expansion was added on 2026-05-25 from local repo reads, three explorer subagents, and the external pressure check recorded in the first new research memo. The v0.4.0 deepening adds four more subagent passes and an expanded outside research sweep focused on perfect semantic capture. The v0.5.0 review adds six more subagent passes: conceptual coherence, implementation, Lean/math, evaluation/security, skeptical critique, and Codex product/API.

---

## 10. Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/two-layer-retrieval/README.md` | `derives-from` | This discovery promotes the triangulated findings indexed by the folder README. |
| `vault/discovery/two-layer-retrieval/research/research.md` | `derives-from` | The post-hoc research synthesis consolidating the four lens findings under the new convention. |
| `vault/discovery/two-layer-retrieval/research/2026-05-25-world-class-multi-rag.md` | `derives-from` | The v0.3.0 research memo generalizing two-layer retrieval into a semantic substrate federation spanning documents, code, Lean/theorem artifacts, sessions, and runtime traces. |
| `vault/discovery/two-layer-retrieval/research/2026-05-25-perfect-rag-deepening.md` | `derives-from` | The v0.4.0 research memo sharpening "best RAG in the world" into semantic faithfulness contracts, retrieval planning, defect residues, deterministic code/math graphs, evaluation, and safety. |
| `vault/discovery/two-layer-retrieval/research/2026-05-25-subagent-review-implementation-plan.md` | `derives-from` | The v0.5.0 review memo refining object boundaries, claim scope, implementation phases, golden trace harness, security fields, and the Codex-facing `ContextBundle`. |
| `vault/discovery/two-layer-retrieval/lenses/01-graphrag-state-of-the-art/findings.md` | `derives-from` | Lens 01 establishes the novelty assessment and the three architectural options that anchor §3 and §4. |
| `vault/discovery/two-layer-retrieval/lenses/02-formal-faithfulness/findings.md` | `derives-from` | Lens 02 provides the Yoneda-indexed faithfulness criterion that grounds D-1 and C-2. |
| `vault/discovery/two-layer-retrieval/lenses/03-vector-rag-failure-modes/findings.md` | `derives-from` | Lens 03 provides the empirical failure-mode catalog scoping the architecture's claimed advantage. |
| `vault/discovery/two-layer-retrieval/lenses/04-query-intent-ranking/findings.md` | `derives-from` | Lens 04 provides the eight-intent taxonomy and per-intent ranking functions anchoring D-2 and D-3. |
| `vault/discovery/graph-as-residue-attractor/README.md` | `derives-from` | The parent discovery's Yoneda-identity criterion is the load-bearing premise this retrieval discovery must satisfy. |
| `vault/discovery/two-layer-platform-architecture/README.md` | `cites` | The platform architecture discovery defines the kernel (`vault_common`) and subsystem boundary (`graph_retrieval`) within which the retrieval architecture spec must live; it sequences `graph_retrieval` for week 5–6. Cited as load-bearing context for §7 Next Moves item 7. |
| `vault/ontology-conventions.md` | `cites` | Edge catalog (Appendix C), node-type taxonomy, and evidence-stage / verification-provenance vocabulary are inputs to the ranking functions in §4 (D-2, D-3). |
