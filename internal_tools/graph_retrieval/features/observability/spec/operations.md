---
tags: [internal-tools, graph-retrieval, observability, spec, operations]
node_type: spec
is_session: false
layer: application
nature: procedural, technical
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Operations: graph_retrieval Observability

How the provider, exporters, and F-guard behave at runtime.

## Provider lifecycle

```
[import time]              MeterProvider = None
[first metric emission]    if None: read env, build provider (default NOOP if env empty)
[configure_observability]  build provider per args; set as global; record state
[configure_observability(force=True)]  shutdown old provider, build new
[process exit]             on best-effort, flush + shutdown
```

Importing `graph_retrieval` MUST NOT touch the global `MeterProvider`.
The provider is built lazily either by `configure_observability` or by
the first metric emission. Notebooks that never call into `retrieve()`
pay zero observability cost.

## Environment configuration

Kernel vars (read by `vault_common.otel`, only if
`configure_observability` has not been called):

| Var | Type | Default | Effect |
| --- | ---- | ------- | ------ |
| `OTEL_EXPORTER` | enum string | `noop` | `noop` / `console` / `otlp` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL | unset | Target for OTLP exporter; required when `OTEL_EXPORTER=otlp` |

Feature vars (read by `graph_retrieval.instrumented`, on every call):

| Var | Type | Default | Effect |
| --- | ---- | ------- | ------ |
| `GRAPH_RETRIEVAL_GUARD_MODE` | enum string | `off` | `off` / `debug` |

## Exporter setup

### NOOP

No provider components installed beyond the no-op MeterProvider /
TracerProvider that OTel ships. Zero work, zero output.

### CONSOLE

- `ConsoleSpanExporter` wrapped in `BatchSpanProcessor` (batch flush
  on shutdown).
- `ConsoleMetricExporter` polled by `PeriodicExportingMetricReader`
  every 30s by default.
- Logs go to stderr via the JSON formatter installed under the
  `graph_retrieval` logger.

### OTLP

- `OTLPSpanExporter(endpoint=$OTEL_EXPORTER_OTLP_ENDPOINT)` in
  `BatchSpanProcessor`.
- `OTLPMetricExporter` in `PeriodicExportingMetricReader` (60s).
- Requires `opentelemetry-exporter-otlp` (optional dep).

## Faithfulness-guard runtime cost

For `guard_mode = DEBUG`:

- Per call: O(k) Protocol-method invocations
  (`corpus.inbound_edge_types` × k, plus the same for outbound).
- Per result: 2 set comparisons, 1 verification check.
- Wall-clock: <1 ms for `k ≤ 50`. Negligible against the embedding
  cost of a single `retrieve()` call.
- Counter emissions: one per violation; counters are cheap
  (lock-free incremental).

## Test isolation

Tests that touch observability MUST:

1. Call `configure_observability(NOOP, force=True)` in the setup
   hook to wipe any prior provider.
2. Assert `current_state().provider_id` changed after the call.
3. If testing CONSOLE behavior, use `capsys` to capture stderr.
4. If testing OTLP behavior, monkeypatch the OTLP exporter class —
   never hit a network endpoint from tests.

## Log envelope

Every `retrieve.completed` log entry has this exact shape:

```json
{
  "event": "retrieve.completed",
  "feature": "two-layer-retrieval",
  "query_hash": "<sha256[:12]>",
  "intent": "canon",
  "intent_source": "classifier",
  "intent_confidence": 1.0,
  "backend": "NetworkXCorpus",
  "candidate_set_size": 47,
  "result_count": 5,
  "duration_ms": 23,
  "notes": []
}
```

The raw query MUST NOT be logged. Only the SHA-256 prefix.

At `WARN`: same envelope, plus `notes` non-empty.
At `ERROR`: same envelope, plus `error_class` and `error_message`.

## Process exit

A best-effort `atexit` handler calls `provider.shutdown()` to flush
batch exporters. If the process dies abruptly (SIGKILL), batched spans
may be lost — acceptable for a v0.1 library.

## Out of scope (operations-level)

- Hot reload of exporter choice mid-process (use `force=True` if you
  really need it; not recommended).
- Multi-provider setups (one per feature, etc.) — singleton is the
  contract.
- Sampling, head or tail — see [discovery OQ-4](../discovery/discovery.md#oq-4-sampling--head-tail-or-none).
