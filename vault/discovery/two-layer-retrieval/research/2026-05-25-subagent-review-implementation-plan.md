---
tags: [vault, research, retrieval, rag, implementation, subagents, evaluation, security]
node_type: research
is_session: false
layer: architecture, implementation
nature: explanatory, technical
status: exploratory
version: 0.1.0
last_updated: 2026-05-25
analysis-method: subagent-review, local-files-read
verification: [local-files-read]
---

# Research - Subagent Review and Implementation Plan

## Objective

Record the third review round for `two-layer-retrieval`: six subagents reviewed the v0.4.0 discovery from conceptual, implementation, theorem, security/evaluation, skeptical, and product-agent perspectives. The goal was to improve the discovery and make the implementation path concrete without turning exploratory claims into false guarantees.

## Synthesis

The review converged on one correction:

> Keep the ambition of "best RAG in the world", but define it as a falsifiable target: semantic-faithful retrieval with auditable traces, explicit defect residues, golden hard-negative evaluation, and staged migration.

The system should not begin by replacing existing retrievers. It should first define a small stable contract, wrap existing systems as read-only substrates, and prove value through golden traces.

## Major Review Findings

### 1. Object boundaries need discipline

`SemanticAtom`, `ArtifactFootprint`, `RelationRecord`, `RetrievalTrace`, `DefectResidue`, and `CalibrationFinding` must not blur together.

- `SemanticAtom`: smallest stable retrievable identity, admitted only with locator, span/provenance, structured signature, version/hash, and substrate-owned identity evidence.
- `ArtifactFootprint`: artifact-to-atoms/relation-ids projection describing aboutness; stores salience, extraction confidence, validation status, trust, and evidence spans.
- `RelationRecord`: validated n-ary semantic claim among atoms/artifacts, with participant roles and trust.
- `RetrievalTrace`: audit object for one query: required structure, retrieval actions, evidence selected/rejected, preserved relations, stop criteria, defects, fallback decisions, and calibration findings.
- `DefectResidue`: typed failure, not low score.
- `CalibrationFinding`: actionable maintenance residue, not dashboard metric.

### 2. Formal claims must stay scoped

The theorem layer supports a strong discipline, but not universal superiority claims.

- `FunctorialDefectDistance` is a hard `0/⊤` gate: zero iff fully faithful.
- Operational ranking still needs a multi-component `DistanceVector`, not one global metric.
- `VectorOnlyRetrievalFailsEdges` witnesses a body-only collapse of edge semantics; it does not prove vector retrieval is bad for all tasks.
- `DefectResidue` formalizes the FF/non-FF gate, not the whole taxonomy of RAG failures.

Safe claim:

> Body-only retrieval fails the vault's Yoneda-style identity criterion on structurally-demanding queries where typed edges, node types, stage, provenance, type signatures, or proof dependencies are load-bearing.

### 3. Implementation should be federated by adapter, not migration

Start with contracts and adapters:

- `VaultSubstrate`: wraps `domainspec/internal_tools/graph_retrieval`.
- `CodeSubstrate`: wraps `house_project/internal_tools/semantic_index`.
- `DocumentSubstrate`: wraps `house_project/internal_tools/vault_routing`.
- `LeanSubstrate`: starts from `domainspec-theorem/LEAN-TAXONOMY.md`, later moves to mechanical extraction.

Do not normalize embedding dimensions or migrate existing DBs in the first pass. Keep source systems alive and convert their outputs into the common contract.

### 4. The product surface is a `ContextBundle`

For Codex, the RAG should act like a context syscall:

```bash
domainspec rag query "o que quebra se mudarmos X?" \
  --task code-change \
  --scope vault,code,theorem \
  --require file-line,typed-edges,trust \
  --budget 8s \
  --trace compact \
  --format codex
```

Primary output:

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

The normal view should be compact. The full trace is available for audit/debug/eval.

### 5. Evaluation should use golden traces

Each fixture should grade the trace, not just final answer text:

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

Golden cases should include: simple lookup, near-identical body/different edge, exact symbol lookup, Lean type traps, cross-substrate witness, no-answer/void, contradiction/supersession, prompt injection, freshness/staleness, and stage-bound query.

### 6. Security is part of retrieval

Retrieved context is evidence, not instruction. `Candidate` and `RetrievalTrace` need taint/trust fields:

- `user_writable`
- `external_source`
- `generated_by_model`
- `executable`
- `prompt_like`
- `injection_risk`
- `secret_or_pii_risk`
- `taint_labels`
- `edge_validation_status`
- `superseded_by`
- `contradicts`

The policy gate decides whether a candidate can be selected, cited, used for editing, executed, or only reported as unsafe evidence.

## Proposed Contracts

```python
from dataclasses import dataclass, field
from typing import Any, Literal, Protocol

Substrate = Literal["document", "vault", "code", "lean", "session", "runtime"]

@dataclass(frozen=True)
class SourceSpan:
    uri: str
    start_line: int | None = None
    end_line: int | None = None
    byte_start: int | None = None
    byte_end: int | None = None

@dataclass(frozen=True)
class TypedEdge:
    source_atom_id: str
    edge_type: str
    target_atom_id: str
    confidence: float = 1.0
    provenance: Literal["deterministic", "validated", "inferred", "authored"] = "deterministic"

@dataclass
class TrustEnvelope:
    status: str | None = None
    verification: list[str] = field(default_factory=list)
    proof_status: str | None = None
    freshness: str | None = None
    user_writable: bool | None = None
    executable: bool | None = None
    prompt_like: bool | None = None
    taint_labels: list[str] = field(default_factory=list)

@dataclass
class SemanticAtom:
    atom_id: str
    substrate: Substrate
    kind: str
    stable_locator: str
    surface_text: str
    structured_signature: dict[str, Any] = field(default_factory=dict)
    source_spans: list[SourceSpan] = field(default_factory=list)
    typed_edges: list[TypedEdge] = field(default_factory=list)
    trust: TrustEnvelope = field(default_factory=TrustEnvelope)
    content_hash: str | None = None
    version: str | None = None

@dataclass
class DistanceVector:
    lexical: float | None = None
    embedding: float | None = None
    typed_edge: float | None = None
    code: float | None = None
    math: float | None = None
    trust: float | None = None
    functorial_defect: float | None = None

@dataclass
class DefectResidue:
    kind: Literal[
        "missing",
        "collapsed",
        "contradictory",
        "stale",
        "untrusted",
        "type_incompatible",
        "unsafe",
    ]
    severity: Literal["fatal", "informative", "fallbackable"]
    message: str
    required_structure: list[str] = field(default_factory=list)
    related_atoms: list[str] = field(default_factory=list)

class SemanticSubstrate(Protocol):
    name: Substrate

    def search(self, query: "RetrievalQuery", *, k: int) -> list["RetrievalCandidate"]: ...
    def resolve(self, locator: str) -> SemanticAtom | None: ...
    def neighbors(self, atom_id: str, edge_types: set[str] | None = None) -> list[SemanticAtom]: ...
    def explain(self, atom_id: str) -> dict[str, Any]: ...
```

## LeanDeclaration Atom

Lean atoms specialize `SemanticAtom` with:

- `fq_name`
- `module`
- `file_span`
- `kind`: theorem, def, structure, class, instance, abbrev, lemma, morphism
- `type_signature`
- `imports`
- `dependencies`: direct and transitive separated
- `proof_status`: sorry-free, contains-sorry, statement-only, placeholder/contract
- `morphism_role`
- `semantic_edges`: proves, uses, refines, contradicts, counterexample-to, equivalent-to, imports, bridge-to
- `distance_features`: type compatibility, dependency overlap, natural iso/equiv evidence, functorial defect
- `trust/provenance`: extractor version, build target, lake status, content hash, generated_at

## Migration Plan

### Phase 0 - Contracts

Create `internal_tools/semantic_retrieval/contracts.py` with the shared dataclasses. No ranker changes.

### Phase 1 - Read-only Adapters

Wrap existing systems:

- `VaultSubstrate` over `graph_retrieval`.
- `CodeSubstrate` over `semantic_index`.
- `DocumentSubstrate` over `vault_routing`.

Adapters convert outputs to `SemanticAtom`/`RetrievalCandidate`; they do not migrate storage.

### Phase 2 - CLI Mock

Add a stable JSON surface:

- `domainspec rag query`
- `domainspec rag resolve`
- `domainspec rag impact`
- `domainspec rag trace`
- `domainspec rag calibrations`

The first implementation can call only `VaultSubstrate`; the contract should already support federation.

### Phase 3 - Golden Trace Harness

Create 30 fixtures across the hard-negative classes. Primary metric: correct verdict plus citability, not fluency.

### Phase 4 - Calibration Queue

Persist findings as JSONL/SQLite. No global "RAG score"; each finding needs evidence, severity, owner hint, suggested action, age/recurrence, and status.

### Phase 5 - CodeSubstrate MVP

Index functions/classes/methods with spans, signatures, imports/calls where available, docstring anchors, and test witnesses.

### Phase 6 - Structural Validation Gates

Consume `vault_ctl validate`, edge checks, snapshots, and `tower_explorer` origin certification as trust signals.

### Phase 7 - Footprints and Relation Records

Add sidecar footprints for sessions/discoveries/specs. Add relation records only after atom IDs and source spans are stable.

### Phase 8 - LeanSubstrate and Security Policy

Start Lean extraction from taxonomy/manifest. Then move toward mechanical Lean environment extraction. Finalize trust/taint policy before allowing retrieved content to guide edits or execution.

## Implementation Risks

- Current `graph_retrieval` is path-centric and single-corpus.
- Anchor resolution is fragile for edge-leaning queries.
- Intent classifier is regex MVP.
- `semantic_index` has embedding/schema drift across 768d/3072d paths.
- `CodeAnchor` lacks rich spans/signatures/call graph.
- `vault_routing` embeds whole documents, not atoms/spans.
- Trust models differ across prototypes and must be fused by policy, not averaged globally.

## Discovery Changes Recommended

1. Add a v0.5.0 note defining "world-class" as falsifiable target, not achieved performance.
2. Add object-boundary discipline after C-15.
3. Add `ContextBundle` as Codex-facing product surface.
4. Add implementation phases and minimal contracts.
5. Add golden trace fixture shape.
6. Add explicit claim-scope guardrails.
7. Reword novelty and formal claims as survey-grade/proposal-grade unless formalized.
