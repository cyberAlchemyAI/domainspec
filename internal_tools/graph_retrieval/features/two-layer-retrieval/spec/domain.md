---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, domain]
node_type: spec
is_session: false
layer: architecture, application
nature: technical, reference
status: draft
version: 0.2.0
last_updated: 2026-05-18
---

# Domain: Two-Layer Retrieval

Structural concepts: the value objects, enums, and protocol-typed seams
that the retriever operates on. The two seams (`VaultCorpus`,
`Embedder`) are `typing.Protocol` types so the algorithm in
[workflows.md](workflows.md) depends on contracts, not implementations.

## Value Objects

### NodeView

The load-bearing projection. Every retriever output must use this shape;
[rules.md](rules.md) F1 forbids dropping any field during projection.

Definition lives in [../../../compose.py](../../../compose.py) (lines
17–27). Reproduced here for the spec:

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| `path` | `str` | Vault-relative path; primary key inside a `VaultCorpus` |
| `node_type` | `str \| None` | One of the vault `node_type` values; nullable for legacy nodes |
| `status` | `str \| None` | One of [stage prior](#stage-prior) keys; nullable for unmarked nodes |
| `verification` | `list[str]` | Subset of `{"model-recall", "web-fetched", "local-files-read"}` |
| `body_sim` | `float` | Cosine similarity in `[0, 1]` between query and node body, precomputed |
| `inbound_edges` | `dict[str, list[str]]` | Edge type → list of source paths; must include every type the corpus carries |
| `outbound_edges` | `dict[str, list[str]]` | Edge type → list of target paths; same totality rule as inbound |
| `last_updated_days_ago` | `int \| None` | Derived from frontmatter `last_updated`; nullable |

**Equality:** Two `NodeView` instances are equal iff they have the same
`path` and the same edge dictionaries (verbatim). `body_sim` is
query-dependent and therefore excluded from equality.

### ScoredNode

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| `view` | [NodeView](#nodeview) | Full projection — edges intact per F1 |
| `score` | `float` | Range `[0, 1]`; produced by the intent's compose-function |
| `score_components` | `dict[str, float]` | Per-term breakdown for explainability (e.g. `{"stage_prior": 0.8, "verification": 1.0, "body_sim": 0.71}`) |

### RetrievalResult

Defined in [interfaces.md#retrievalresult](interfaces.md#retrievalresult).

## Enums

### Intent

Source of truth: [../../../intent.py](../../../intent.py) lines 9–17.

| Value | Question it answers | Family |
| ----- | ------------------- | ------ |
| `CANON` | "What do we currently believe about X?" | body-leaning |
| `PROVENANCE` | "What is the evidence for X?" | edge-leaning |
| `FRONTIER` | "What are we currently exploring?" | body-leaning |
| `TENSION` | "What contradicts Y?" | edge-leaning |
| `SEMANTIC` | "Anything near X" (fallback) | body-leaning |
| `BLAST_RADIUS` | "What breaks if I retire Z?" | edge-leaning |
| `LENS_TRIANGULATION` | "What angles bear on X?" | (no scorer in v0.1 — see [TEST-SPEC.md](TEST-SPEC.md) G1) |
| `DEFINITIONAL` | "What does T mean here?" | body-leaning |

Family selects the candidate-set construction strategy — see
[workflows.md#candidate-set-construction](workflows.md#candidate-set-construction).

### Stage Prior

The `status` axis from vault frontmatter, mapped to a numeric prior
used by [score_canon](workflows.md#scoring) and others. Source:
[../../../compose.py](../../../compose.py) lines 32–35.

| Status | Prior |
| ------ | ----- |
| `draft` | 0.10 |
| `exploratory` | 0.30 |
| `active` | 0.55 |
| `consolidated` | 0.80 |
| `evergreen` | 1.00 |
| `retracted` | 0.00 |
| _unmarked_ | 0.50 |

## Protocols

### VaultCorpus

The graph backend seam. Implementations: `NetworkXCorpus` (chosen for
v0.1), `KuzuCorpus` (deferred), `SQLiteCorpus` (deferred). See
[architecture.md#view-6-dependency-interface-view](architecture.md#view-6-dependency-interface-view)
for the rationale.

```python
class VaultCorpus(Protocol):
    def nodes(self) -> Iterable[NodeRecord]: ...
    def get_node(self, path: str) -> NodeRecord | None: ...
    def nodes_matching(self, query: str) -> list[str]: ...
    def inbound(self, path: str, edge_type: str | None = None) -> list[str]: ...
    def outbound(self, path: str, edge_type: str | None = None) -> list[str]: ...
    def inbound_edge_types(self, path: str) -> set[str]: ...
    def outbound_edge_types(self, path: str) -> set[str]: ...
    def search_body(self, query: str, k: int) -> list[tuple[str, float]]: ...
    def body_sim(self, query: str, path: str) -> float: ...
```

`body_sim(query, path)` returns cosine similarity in `[0, 1]` for a
single path — the per-candidate primitive consumed by
[NodeView projection](workflows.md#step-3-nodeview-projection) when
edge-leaning candidates need a `body_sim` field that did not come from
`search_body`. Implementations should cache the query encoding across
calls within a single `retrieve()` invocation.

`nodes_matching(query)` returns paths whose path-string appears as a
substring of the query — the seed-extraction primitive consumed by
[workflows.md Step 2b](workflows.md#step-2-candidate-set-construction).
`inbound_edge_types(path)` / `outbound_edge_types(path)` return the set
of edge-type keys materialized for that node, used by
[TEST-SPEC.md T4](TEST-SPEC.md#t4--f1-typed-edge-preservation) to assert
projection totality without enumerating every edge type upfront.

`NodeRecord` is impl-defined by each `VaultCorpus` implementation;
`retrieve()` does not depend on its concrete shape — it only consumes
the Protocol methods above plus [NodeView](#nodeview) (built via
projection in [workflows.md Step 3](workflows.md#step-3-nodeview-projection)).

### Embedder

Already defined at
[../../../../vault_common/embedder.py](../../../../vault_common/embedder.py).
v0.1 binds to `SentenceTransformerEmbedder` wrapping
`sentence-transformers/all-MiniLM-L6-v2`. `NullEmbedder` is the test
fallback. See [operations.md#embedding-matrix-warm-vs-cold](operations.md#embedding-matrix-warm-vs-cold)
for lifecycle.
