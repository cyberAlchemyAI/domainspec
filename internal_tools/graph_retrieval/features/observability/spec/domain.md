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

### FaithfulnessGuardMode

```python
class FaithfulnessGuardMode(str, Enum):
    OFF = "off"
    DEBUG = "debug"
```

| Value | Behavior |
| ----- | -------- |
| `OFF` | Hot path unchanged; F1/F4 counters never increment |
| `DEBUG` | After step 5 of [retrieve workflow](../../two-layer-retrieval/spec/workflows.md), every result is checked against [F1](../../two-layer-retrieval/spec/rules.md#f1--typed-edge-preservation) and [F4](../../two-layer-retrieval/spec/rules.md#f4--verification-provenance-respect); violations increment the corresponding counter |

### LogLevel

Standard `logging` levels — `DEBUG`, `INFO`, `WARN`, `ERROR`. Default
`INFO`. Honored by the JSON formatter set up by
[configure_observability](interfaces.md#configure_observability).

## Value Object

### MeterProviderState

The introspectable state of the singleton — useful for tests and the
runbook.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `exporter` | [ExporterChoice](#exporterchoice) | Active exporter |
| `guard_mode` | [FaithfulnessGuardMode](#faithfulnessguardmode) | Active F-guard mode |
| `configured` | `bool` | `True` if `configure_observability` was called; `False` if running on the lazy default |
| `provider_id` | `str` | `id(provider)` as hex — used by tests to confirm `force=True` swapped the provider |

## Defaults

When no `configure_observability(...)` call is made:

| Field | Default |
| ----- | ------- |
| `exporter` | `NOOP` |
| `guard_mode` | `OFF` |
| `log_level` | `INFO` |

Env-var overrides (read once at first metric emission):

| Var | Maps to | Notes |
| --- | ------- | ----- |
| `OTEL_EXPORTER` | `exporter` | `noop` / `console` / `otlp` (case-insensitive) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP target | Only honored when `exporter = OTLP` |
| `GRAPH_RETRIEVAL_GUARD_MODE` | `guard_mode` | `off` / `debug` |
| `GRAPH_RETRIEVAL_LOG_LEVEL` | `log_level` | Standard `logging` level names |

Explicit `configure_observability` always wins over env.
