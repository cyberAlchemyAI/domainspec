---
tags: [internal-tools, graph-retrieval, observability, spec, domain]
node_type: spec
is_session: false
layer: architecture, application
nature: technical, reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Domain: graph_retrieval Observability

Structural types. Three enums and one value object that describe the
configurable observability surface.

## Enums

### ExporterChoice

```python
class ExporterChoice(str, Enum):
    NOOP = "noop"
    CONSOLE = "console"
    OTLP = "otlp"
```

| Value | Span destination | Metric destination | Optional dep |
| ----- | --------------- | ------------------ | ------------ |
| `NOOP` | `/dev/null` (no span processor registered) | `/dev/null` | none |
| `CONSOLE` | stderr (`ConsoleSpanExporter`) | stderr (`ConsoleMetricExporter`) | none (in `opentelemetry-sdk`) |
| `OTLP` | OTLP/gRPC endpoint via `OTEL_EXPORTER_OTLP_ENDPOINT` | same endpoint | `opentelemetry-exporter-otlp` |

### FaithfulnessGuardMode (feature-scoped — NOT kernel)

```python
# Lives at graph_retrieval.instrumented, NOT vault_common.otel.
class FaithfulnessGuardMode(str, Enum):
    OFF = "off"
    DEBUG = "debug"
```

| Value | Behavior |
| ----- | -------- |
| `OFF` | Hot path unchanged; F1/F4 counters never increment |
| `DEBUG` | The wrapper at [`graph_retrieval.instrumented.retrieve`](../../../instrumented.py) re-checks every result against [F1](../../two-layer-retrieval/spec/rules.md#f1--typed-edge-preservation) and [F4](../../two-layer-retrieval/spec/rules.md#f4--verification-provenance-respect); violations increment the corresponding counter |

This enum is **feature-scoped**, not kernel. The kernel (`vault_common.otel`) has no concept of faithfulness — that's a graph_retrieval contract. Other features that want their own runtime-check modes declare their own enums; nothing about `MeterProvider` lifecycle changes per-feature.

### LogLevel

Standard `logging` levels — `DEBUG`, `INFO`, `WARN`, `ERROR`. Default
`INFO`. Honored by the JSON formatter set up by
[configure_observability](interfaces.md#configure_observability).

## Value Object

### MeterProviderState (kernel)

The introspectable state of the kernel singleton. **Does not** carry
feature-specific concerns like `guard_mode`.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `exporter` | [ExporterChoice](#exporterchoice) | Active exporter |
| `configured` | `bool` | `True` if `configure_observability` was called; `False` if running on the lazy default |
| `provider_id` | `str` | `id(provider)` as hex — used by tests to confirm `force=True` swapped the provider |

## Defaults

When no `configure_observability(...)` call is made:

| Field | Default | Owned by |
| ----- | ------- | -------- |
| `exporter` | `NOOP` | kernel |
| `log_level` | `INFO` | kernel |
| `guard_mode` | `OFF` | graph_retrieval feature |

Env-var overrides:

| Var | Maps to | Owned by | Notes |
| --- | ------- | -------- | ----- |
| `OTEL_EXPORTER` | `exporter` | kernel | `noop` / `console` / `otlp` (case-insensitive) — standard OTel env |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP target | kernel | Only honored when `exporter = OTLP` — standard OTel env |
| `GRAPH_RETRIEVAL_GUARD_MODE` | `guard_mode` | graph_retrieval feature | `off` / `debug` — read by `_resolve_guard_mode` in `graph_retrieval.instrumented` |

Explicit kwarg always wins over env. The kernel honors only standard
`OTEL_*` env vars; feature-scoped vars are read by the feature's own
module.
