---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, observability]
node_type: spec
is_session: false
layer: application
nature: technical, reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Observability: Two-Layer Retrieval

The retriever is a library, not a service — so "observability" here is
**structured logs around `retrieve()` calls and a small set of
in-process metrics** that any caller (notebook, script, future service)
can scrape via the OTel API. Meter scope: `domainspec`. Every
instrument carries `feature: two-layer-retrieval` as an attribute.

## Operation Metrics

Source: [interfaces.md retrieve](interfaces.md#internal-retrieve-top-level-function),
[workflows.md](workflows.md).

```yaml
# Counts each retrieve() call, grouped by intent and outcome
- name: retrieve.invocation
  instrument: Counter
  unit: "{invocation}"
  description: "Counts retrieve() calls, grouped by intent and outcome"
  attributes: [feature, intent, backend, result]   # result: success | error
  alert: error rate > 1% over 5min → P2

# Wall-clock duration of retrieve() in milliseconds
- name: retrieve.duration
  instrument: Histogram
  unit: "ms"
  description: "Wall-clock duration of retrieve() in ms (mirrors RetrievalResult.duration_ms)"
  attributes: [feature, intent, backend]
  buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500]
  alert: p99 > 1000ms → P3
```

## Per-Step Latency

Source: [workflows.md](workflows.md) steps 1–5.

```yaml
# Latency of intent classification (step 1)
- name: retrieve.step.classify_intent.duration
  instrument: Histogram
  unit: "ms"
  attributes: [feature, intent, source]   # source: classifier | override

# Latency of candidate-set construction (step 2)
- name: retrieve.step.candidate_set.duration
  instrument: Histogram
  unit: "ms"
  attributes: [feature, intent, strategy]   # strategy: body_leaning | edge_leaning | fallback

# Latency of NodeView projection (step 3)
- name: retrieve.step.project.duration
  instrument: Histogram
  unit: "ms"
  attributes: [feature, intent, backend]

# Latency of scoring (step 4) — per-intent breakdown matters because
# compose-functions vary in cost (e.g. PROVENANCE walks inbound edges)
- name: retrieve.step.score.duration
  instrument: Histogram
  unit: "ms"
  attributes: [feature, intent]
```

## Candidate-Set Shape

Source: [interfaces.md RetrievalResult.candidate_set_size](interfaces.md#output-retrievalresult).

```yaml
# Distribution of how many candidates the retriever scored
- name: retrieve.candidate_set_size
  instrument: Histogram
  unit: "{node}"
  description: "How many candidates the retriever scored (before top-k)"
  attributes: [feature, intent, strategy]
  buckets: [10, 25, 50, 100, 250, 500, 1000]
  alert: p50 < 5 for any intent over 1h → P2  # likely starvation
```

## Intent Classification

Source: [workflows.md Step 1](workflows.md#step-1-intent-classification).

```yaml
# Counts intent assignments, grouped by classification source
- name: retrieve.intent.assigned
  instrument: Counter
  unit: "{classification}"
  attributes: [feature, intent, source, confidence_bucket]   # source: classifier | override; confidence_bucket: low | high

# Counts SEMANTIC fallback hits — proxies "rule classifier missed"
- name: retrieve.intent.fallback
  instrument: Counter
  unit: "{fallback}"
  attributes: [feature]
  alert: fallback rate > 30% over 1h → P3   # upgrade-classifier signal (discovery O1)
```

## Faithfulness Guard Metrics

Source: [rules.md](rules.md) F1–F5. Every increment indicates a
contract violation in a deployed retriever and demands investigation.

```yaml
# Counts F1 violations detected by debug-mode edge-preservation check
- name: retrieve.faithfulness.f1_violation
  instrument: Counter
  unit: "{violation}"
  attributes: [feature, intent]
  alert: any increment → P0

# Counts F4 violations: model-recall-only node reached a CANON result
- name: retrieve.faithfulness.f4_violation
  instrument: Counter
  unit: "{violation}"
  attributes: [feature]
  alert: any increment → P0

# Counts NotImplementedError raises (e.g. LENS_TRIANGULATION)
- name: retrieve.unimplemented_intent
  instrument: Counter
  unit: "{occurrence}"
  attributes: [feature, intent]
  alert: any increment → P2   # tells us callers want the deferred intent
```

## Backend Health

Source: [domain.md VaultCorpus](domain.md#vaultcorpus),
[operations.md](operations.md).

```yaml
# Tracks node count in the loaded corpus (per backend instance)
- name: corpus.node_count
  instrument: UpDownCounter
  unit: "{node}"
  attributes: [feature, backend]

# Embedding-matrix readiness — 0 = cold, 1 = warm
- name: corpus.embedding_matrix.ready
  instrument: Gauge
  unit: "1"
  attributes: [feature, backend]

# Latency of corpus.search_body (vector lookup)
- name: corpus.search_body.duration
  instrument: Histogram
  unit: "ms"
  attributes: [feature, backend]
```

## Structured Logs

Every `retrieve()` call emits one log entry at INFO with this shape:

```json
{
  "event": "retrieve.completed",
  "feature": "two-layer-retrieval",
  "query_hash": "<sha256 prefix>",
  "intent": "CANON",
  "intent_source": "classifier",
  "intent_confidence": 1.0,
  "backend": "networkx",
  "candidate_set_size": 47,
  "result_count": 5,
  "duration_ms": 23,
  "notes": []
}
```

The raw query is **never** logged (vault queries can be sensitive);
only a `sha256` prefix to allow cross-event correlation.

At WARN, the same envelope is emitted whenever `notes` is non-empty
(e.g. step 2b fallback). At ERROR, the entry includes `error_class` and
`error_message`.

## Traces

One span per `retrieve()` call, with child spans for each step:

```
retrieve(query)                                       [span: retrieve]
├── classify_intent                                   [span: retrieve.classify]
├── candidate_set (strategy=body_leaning|edge_leaning) [span: retrieve.candidates]
│   └── corpus.search_body | corpus.closure          [span: corpus.search_body]
├── project (per candidate, batched into one span)   [span: retrieve.project]
│   └── corpus.inbound/outbound                      [span: corpus.edges]
├── score                                            [span: retrieve.score]
└── top_k                                            [span: retrieve.topk]
```

Span attributes mirror the metric attributes above (`feature`,
`intent`, `backend`). The `retrieve` root span carries
`candidate_set_size` and `result_count` for quick filtering in trace
UIs.

## Coverage Notes

This feature has no `states.md`, `operations.md` mutations,
`interfaces.md` external endpoints, `events.md`, or `queries.md`, so
the OBSERVABILITY.md derivation rules O1–O3, O7, O8, O10, O11, O15, O16
do not apply. The instruments above cover:

- O4 (operation base metrics) → `retrieve.invocation`, `retrieve.duration`
- O5 (rule violations) → `retrieve.faithfulness.f1_violation`, `f4_violation`
- O13 (capability KPIs) → `retrieve.intent.fallback` (proxy for classifier health)

## Alert Runbook Index

| Alert | Severity | Investigation Steps | Source |
| ----- | -------- | ------------------- | ------ |
| `retrieve.faithfulness.f1_violation` > 0 | P0 | Inspect last `retrieve.completed` log; diff `NodeView.inbound_edges` against `corpus.inbound`; check recent `NetworkXCorpus` changes | [rules.md F1](rules.md#f1--typed-edge-preservation) |
| `retrieve.faithfulness.f4_violation` > 0 | P0 | Find offending node; check `verification` frontmatter; check `verification_prior` short-circuit | [rules.md F4](rules.md#f4--verification-provenance-respect) |
| `retrieve.intent.fallback` rate > 30% | P3 | Sample fallback queries; consider promoting the LLM classifier upgrade (discovery O1) | [workflows.md Step 1](workflows.md#step-1-intent-classification) |
| `retrieve.duration` p99 > 1000ms | P3 | Check `corpus.node_count`; check `retrieve.step.*.duration` for the slow step | [operations.md](operations.md) |
| `retrieve.candidate_set_size` p50 < 5 | P2 | Likely hard-filter starvation; check `K_CANDIDATES` and intent's filter selectivity | [workflows.md Step 2](workflows.md#step-2-candidate-set-construction) |
