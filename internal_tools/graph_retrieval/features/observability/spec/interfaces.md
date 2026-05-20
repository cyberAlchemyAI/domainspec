---
tags: [internal-tools, graph-retrieval, observability, spec, interfaces]
node_type: spec
is_session: false
layer: application
nature: technical, reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Interfaces: graph_retrieval Observability

Two public surfaces: a configuration function and a decorator.

## Internal: `configure_observability` (kernel)

Lives at `vault_common.otel`. Subsystem-neutral — owns ONLY OTel SDK
lifecycle. Feature-specific knobs live in the feature's own module.

```python
def configure_observability(
    exporter: ExporterChoice = ExporterChoice.NOOP,
    log_level: str = "INFO",
    *,
    force: bool = False,
) -> MeterProviderState: ...
```

| Field | Required | Description |
| ----- | -------- | ----------- |
| `exporter` | no | Span + metric destination; see [domain.md ExporterChoice](domain.md#exporterchoice) |
| `log_level` | no | stdlib `logging` level name; installs the JSON formatter on the root logger |
| `force` | no | If `True`, swap the existing provider even if one was already configured (tests); if `False`, second call without `force` raises `RuntimeError` |

The kernel does **not** know about `FaithfulnessGuardMode` or any other
feature-specific mode. Feature modules read their own env vars.

Returns the [MeterProviderState](domain.md#meterproviderstate) reflecting the
configuration just installed.

### Error contract

| Condition | Result |
| --------- | ------ |
| Second call without `force=True` | `RuntimeError("observability already configured; pass force=True to override")` |
| `OTLP` selected but `opentelemetry-exporter-otlp` not installed | `ModuleNotFoundError` propagated; no partial setup |
| Invalid `log_level` string | `ValueError` |

## Internal: `@instrumented` decorator

```python
def instrumented(
    name: str,
    *,
    attributes_from_args: tuple[str, ...] = (),
    attributes_from_result: tuple[str, ...] = (),
    duration_instrument: str | None = None,
) -> Callable[[F], F]: ...
```

| Field | Required | Description |
| ----- | -------- | ----------- |
| `name` | yes | Span name and metric name suffix (e.g. `"retrieve"`) |
| `attributes_from_args` | no | Names of kw-args (or positional names) to copy into span attributes |
| `attributes_from_result` | no | Names of `RetrievalResult` (or any dataclass) fields to copy onto the span at end |
| `duration_instrument` | no | Metric name for the duration histogram; defaults to `f"{name}.duration"` |

Decorator behavior:
- Span: opens `name`, sets `feature: two-layer-retrieval` attribute,
  copies `attributes_from_args` at entry, copies
  `attributes_from_result` at exit.
- Duration: records a histogram in `ms`.
- Exception: span status → `ERROR`, exception recorded, log entry at
  `ERROR`; exception is re-raised.
- Notes: if the returned object has a non-empty `notes` field
  (RetrievalResult convention), emits a log entry at `WARN`.

### Example

```python
from graph_retrieval.instrumentation import instrumented

@instrumented(
    name="retrieve",
    attributes_from_args=("k",),
    attributes_from_result=("intent", "candidate_set_size", "backend"),
)
def retrieve(query, corpus, k=10, intent_override=None): ...
```

## Internal: `current_state` accessor (kernel)

```python
def current_state() -> MeterProviderState: ...
```

Returns the live [MeterProviderState](domain.md#meterproviderstate-kernel).
Used by tests to assert the provider was swapped (`provider_id`
differs).

## Feature-scoped: `_resolve_guard_mode` (graph_retrieval)

Lives at `graph_retrieval.instrumented`. Reads the feature env var
`GRAPH_RETRIEVAL_GUARD_MODE` and applies kwarg-wins-over-env precedence.

```python
def _resolve_guard_mode(
    explicit: FaithfulnessGuardMode | None,
) -> FaithfulnessGuardMode: ...
```

The `retrieve()` wrapper at `graph_retrieval.instrumented` calls this on
every invocation. Other features replicate the pattern — declare their
own mode enum + resolver — without changing the kernel.

## Out of scope (interface-level)

- A CLI for configuring observability — env vars cover the deploy
  story; the function covers the in-process story; nothing else needed.
- A per-instrument creation API — instruments are defined in
  `graph_retrieval/instrumentation.py` as module-level singletons per
  [domain.md Instrument lifecycle](../discovery/discovery.md#instrument-lifecycle)
  and are not part of the user-facing surface.
