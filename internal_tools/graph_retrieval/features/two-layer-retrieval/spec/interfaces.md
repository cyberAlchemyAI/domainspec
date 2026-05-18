---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, interfaces]
node_type: spec
is_session: false
layer: application
nature: technical, reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Interfaces: Two-Layer Retrieval

The feature exposes one Python-internal entrypoint. There is no external
network surface; this is a library, not a service. See
[architecture.md#view-6-dependency-interface-view](architecture.md#view-6-dependency-interface-view)
for boundary rules.

## Internal: `retrieve` (top-level function)

**Consumers:** any Python caller inside `internal_tools/` and notebooks
that want a structured subgraph response from the vault. No CLI in v0.1;
the function is the contract.

### Signature

```python
def retrieve(
    query: str,
    corpus: VaultCorpus,
    k: int = 10,
    intent_override: Intent | None = None,
) -> RetrievalResult: ...
```

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `query` | `str` | yes | Natural-language query string |
| `corpus` | [VaultCorpus](domain.md#vaultcorpus) | yes | Backend; v0.1 prototype binds to `NetworkXCorpus` |
| `k` | `int` | no (default `10`) | Number of results to return; `> 0` |
| `intent_override` | [Intent](domain.md#intent) `\| None` | no | Bypass the classifier; useful for tests and callers that already know their intent |

### Output: RetrievalResult

```python
@dataclass
class RetrievalResult:
    query: str
    intent: Intent
    intent_confidence: float          # 1.0 for rule-match, 0.5 for fallback
    nodes: list[ScoredNode]           # length <= k, sorted by score desc
    candidate_set_size: int           # how many nodes were scored
    backend: str                      # "networkx" | "kuzu" | ...
    duration_ms: int
    notes: list[str]                  # warnings (e.g. path-free edge-leaning query)
```

| Field | Type | Maps To |
| ----- | ---- | ------- |
| `query` | `str` | Echoed input |
| `intent` | [Intent](domain.md#intent) | [classify_intent](workflows.md#step-1-intent-classification) result (or `intent_override`) |
| `intent_confidence` | `float` | `1.0` for rule-match, `0.5` for `SEMANTIC` fallback. See [TEST-SPEC.md](TEST-SPEC.md) G3 for the known-gap binary nature of this field |
| `nodes` | `list[`[ScoredNode](domain.md#scorednode)`]` | Top-k after [step 5](workflows.md#step-5-top-k-selection) |
| `candidate_set_size` | `int` | Size of the candidate set produced by [step 2](workflows.md#step-2-candidate-set-construction) |
| `backend` | `str` | Identity of the `VaultCorpus` implementation |
| `duration_ms` | `int` | Wall-clock for the whole call; emitted as the `retrieve.duration` histogram in [observability.md](observability.md) |
| `notes` | `list[str]` | Non-fatal warnings, e.g. "path-free query on edge-leaning intent — fell back to body-leaning candidate construction" |

### Error contract

| Condition | Result |
| --------- | ------ |
| `k <= 0` | `ValueError` |
| `query == ""` | `ValueError` |
| `corpus` does not satisfy `VaultCorpus` Protocol | `TypeError` at first method call |
| Classified intent has no scorer (e.g. `LENS_TRIANGULATION` in v0.1) | `NotImplementedError` — see [TEST-SPEC.md](TEST-SPEC.md) G1 |
| Embedder fails to encode the query | propagate the underlying exception; do not swallow |

## Internal: `VaultCorpus` Protocol

See [domain.md#vaultcorpus](domain.md#vaultcorpus) for the method list.
This Protocol is the contract; `NetworkXCorpus` is the v0.1
implementation referenced in
[architecture.md#view-3-low-level-components-view](architecture.md#view-3-low-level-components-view).

## Internal: `Embedder` Protocol

Defined at
[../../../../vault_common/embedder.py](../../../../vault_common/embedder.py).
Consumed by both `NetworkXCorpus.search_body` and (potentially) future
per-intent rerankers.
