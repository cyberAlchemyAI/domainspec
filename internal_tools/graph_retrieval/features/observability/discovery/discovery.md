---
tags: [internal-tools, graph-retrieval, observability, discovery]
node_type: discovery
is_session: false
layer: architecture, application
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Discovery: Observability Seam for graph_retrieval

## Objective

Give `graph_retrieval` an OpenTelemetry seam: a `MeterProvider`
singleton, a small exporter taxonomy (no-op / console / OTLP), and a
debug-mode faithfulness guard so the F1/F4 violation counters in
[two-layer-retrieval/spec/observability.md](../../two-layer-retrieval/spec/observability.md)
can actually fire. End state: a notebook user sees zero output by
default; an opted-in dev sees console traces; a future service exports
via OTLP — all without changing `retriever.py` callers.

## 1. Business Context

### Why now

[two-layer-retrieval](../../two-layer-retrieval/spec/observability.md)
lists 15+ instruments and a P0 alert on F1/F4 violations, but
`retriever.py` emits **nothing**. Without instrumentation:

- The T8 falsification round teaches us the design *can* distinguish
  itself from vector-only — but nothing measures whether it *does*
  distinguish itself in real callers.
- F1/F4 faithfulness contracts are tested at acceptance time
  ([test_t4_typed_edge_preservation](../../../tests/test_two_layer_retrieval.py))
  but not enforced at runtime. A regression that breaks projection in
  prod would go unnoticed until the next test run.
- The retriever is already library-shaped (no service lifecycle), which
  is exactly the shape that *needs* a thought-through provider story —
  there's no application bootstrap to lean on.

### What's broken

- [retriever.py:108](../../../retriever.py) — `retrieve()` returns
  `RetrievalResult` with `duration_ms` populated but emits no metric;
  no span, no log.
- [observability.md](../../two-layer-retrieval/spec/observability.md)
  references `meter scope: domainspec` but no module sets one up.
- No `MeterProvider` exists anywhere in `internal_tools/`. Adding one
  ad-hoc in `retriever.py` would couple the algorithm file to OTel
  setup and violate
  [architecture.md R-001](../../two-layer-retrieval/spec/architecture.md#dependency-and-interface-rules)
  ("retrieve may import Protocols only").
- F1/F4 guard counters
  ([f1_violation, f4_violation](../../two-layer-retrieval/spec/observability.md))
  cannot fire because no projection-time consistency check exists in
  the code path.

### What stays the same

- The `VaultCorpus` and `Embedder` Protocols — observability does not
  touch the data seams.
- The `retrieve()` signature — adding a new keyword arg (`debug=False`)
  is backward-compatible; existing callers see no change.
- The instrument names, attributes, buckets, and alert thresholds in
  [two-layer-retrieval/spec/observability.md](../../two-layer-retrieval/spec/observability.md).
  Those belong to the *what*; this feature owns only the *how*.
- The OTel API surface choice — we use `opentelemetry-api` /
  `opentelemetry-sdk`; no custom wrapper.
- `compose.py` — pure functions, no I/O, stay untouched. R-002 holds.

## 2. Core Concepts

### MeterProvider lifecycle (singleton, lazy, overridable)

One process-wide `MeterProvider`. Set once at import-time via
`configure_observability(...)` or implicitly on first metric emission
(no-op default). Why singleton: notebook + script + future service all
want one. Why lazy: importing `graph_retrieval` must not download or
load any OTel SDK provider — that surprises notebook users. Why
overridable: tests need a `force=True` reset hook.

Alternative considered: per-call injection of a `Meter` into
`retrieve()`. Rejected — pollutes the call signature for a concern
that's always-on or always-off, never per-call.

### ExporterChoice (taxonomy of three)

```python
class ExporterChoice(str, Enum):
    NOOP = "noop"        # default — silent
    CONSOLE = "console"  # stderr; for dev / notebooks with explicit opt-in
    OTLP = "otlp"        # for services; endpoint via env (OTEL_EXPORTER_OTLP_ENDPOINT)
```

Why three and not more (jaeger, zipkin, prometheus): each adds an
optional dep; the three above cover library / dev / service. Prometheus
is reachable via OTLP collector; not a first-class choice here.

Why NOOP default: library code surprising notebook users with stderr
output is a UX bug. Opt-in is the conservative default.

### FaithfulnessGuardMode

```python
class FaithfulnessGuardMode(str, Enum):
    OFF = "off"          # default — no per-call edge consistency check
    DEBUG = "debug"      # check F1 / F4 on every result; increment counter on violation
```

The F1 counter from
[two-layer-retrieval/spec/observability.md](../../two-layer-retrieval/spec/observability.md#faithfulness-guard-metrics)
is meaningless without something checking F1 at runtime. The check is
cheap per-node but quadratic in pathological corpora; OFF by default
keeps hot-path latency unchanged.

The check itself is the same shape as
[test_t4_typed_edge_preservation](../../../tests/test_two_layer_retrieval.py):
`set(view.inbound_edges.keys()) == corpus.inbound_edge_types(view.path)`.
Moving it into the runtime — gated by mode — gives the production-only
detection the spec promises.

### Instrumented decorator (or context manager)

```python
@instrumented(name="retrieve", attributes_from_args=("intent", "backend"))
def retrieve(...) -> RetrievalResult: ...
```

Why a decorator: keeps span/metric boilerplate out of `retriever.py`
bodies. Alternative — manual `tracer.start_as_current_span` inside
`retrieve()` — was rejected because it duplicates wrapper logic across
every future workflow. The decorator owns: span start/end, duration
histogram emission, exception → ERROR log, `RetrievalResult.notes` →
WARN log.

## 3. Detailed Specifications

### Module placement

| Module | Owns | Why here |
| --- | --- | --- |
| `vault_common/otel.py` | `configure_observability`, provider singleton, exporter setup | Cross-cutting; `vault_common` already hosts `embedder`, `frontmatter` — utilities for all subsystems |
| `graph_retrieval/instrumentation.py` | Feature-scoped meter + instruments per [two-layer-retrieval/spec/observability.md](../../two-layer-retrieval/spec/observability.md); `@instrumented` decorator | Knows the instrument names; reads the `feature: two-layer-retrieval` attribute convention |
| `graph_retrieval/retriever.py` | One-line change: decorate `retrieve()` with `@instrumented`; accept `debug: FaithfulnessGuardMode = OFF` kwarg | Algorithm file stays clean; instrumentation is one import + one decoration |

### Configuration interface

```python
# Notebooks / scripts — explicit opt-in
from vault_common.otel import configure_observability, ExporterChoice
configure_observability(exporter=ExporterChoice.CONSOLE)

# Tests — programmatic reset
configure_observability(exporter=ExporterChoice.NOOP, force=True)

# Services — env-driven
# OTEL_EXPORTER=otlp OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4317
```

Precedence: explicit `configure_observability` call > env vars >
default (NOOP).

### F-guard wiring (debug mode)

```python
# Inside retrieve(), after step 5 but before return:
if debug == FaithfulnessGuardMode.DEBUG:
    for n in top:
        if set(n.view.inbound_edges.keys()) != corpus.inbound_edge_types(n.view.path):
            f1_violation.add(1, {"feature": "two-layer-retrieval", "intent": intent.value})
        if intent == Intent.CANON and n.view.verification == ["model-recall"]:
            f4_violation.add(1, {"feature": "two-layer-retrieval"})
```

The check uses the same Protocol methods the projection already calls,
so no new corpus contract is introduced. Cost: O(k) per call;
negligible against the model-encoding cost in the same call.

### Instrument lifecycle

Instruments (counters, histograms, gauges) are module-level singletons
in `instrumentation.py`. The `MeterProvider` may not be configured at
import time, so instruments resolve their underlying meter on first
use, not on definition. OTel's `get_meter()` handles this correctly
when called against a still-NOOP provider — emissions become no-ops.

### Test surface

| Test | What it pins |
| --- | --- |
| Default-NOOP — `retrieve()` runs, no exporter side-effects | UX guarantee |
| Configured-CONSOLE — captures stderr, asserts one span line emitted | Span wiring |
| F-guard OFF — synthetic F1-violating fixture, counter stays at 0 | Mode discipline |
| F-guard DEBUG — same fixture, counter increments by 1 | Detection works |
| `configure_observability(force=True)` — second call replaces provider | Test isolation |
| Env-driven setup — set `OTEL_EXPORTER=console`, import + call → CONSOLE active | Service path |

## 4. Open Questions

### OQ-1: Service deployment story — owned here or out-of-scope?

The current scope ships the OTLP exporter *choice* but not the
*receiver*. Question: do we ship a docker-compose receiver (OTel
collector + Prometheus + Grafana) under `internal_tools/` for local
prod simulation, or is that a separate infra concern?

**Recommendation:** Out of scope. Ship the exporter, document the env
vars, leave the receiver to whoever first runs `graph_retrieval` as a
service. The first such consumer probably wants their own infra story.

### OQ-2: Structured logs — separate Python logging or OTel logs API?

[observability.md](../../two-layer-retrieval/spec/observability.md#structured-logs)
calls for INFO `retrieve.completed` events. OTel has a logs API but
it's young; stdlib `logging` is universally consumed.

**Recommendation:** stdlib `logging` with a JSON formatter. Bridge to
OTel via the `LoggingInstrumentor` later if needed. Keeps the v0.1
surface small and notebooks-friendly (notebooks expect `logging`).

### OQ-3: Per-step histograms — emit always or only under DEBUG?

[observability.md](../../two-layer-retrieval/spec/observability.md#per-step-latency)
defines 4 per-step latency histograms. Each requires a `time.perf_counter`
pair around the step. Cost: ~µs per step, but adds 8 lines of
boilerplate to `retrieve()`.

**Recommendation:** Always-on. The cost is negligible; the diagnostic
value is high; and putting them behind a flag means they're absent
exactly when you need them most (production regression).

### OQ-4: Sampling — head, tail, or none?

For a library with <100 calls/sec (the realistic v0.1 ceiling), no
sampling is fine. For a high-throughput future, tail sampling on
duration would surface slow calls.

**Recommendation:** No sampling in v0.1. Revisit when call rate forces
the question.

## 5. Decision Log

| ID | Decision | Why |
| -- | -------- | --- |
| D-001 | Singleton `MeterProvider` over per-call injection | Always-on/always-off concern; per-call pollutes signature |
| D-002 | NOOP exporter default | Library UX — silent unless asked |
| D-003 | Three exporter choices: NOOP, CONSOLE, OTLP | Covers library / dev / service; more = optional-dep sprawl |
| D-004 | F-guard OFF by default, DEBUG opt-in | Runtime cost vs detection value; spec's P0 counter needs a checker to fire |
| D-005 | `@instrumented` decorator | Keeps span/metric boilerplate out of algorithm files |
| D-006 | Instrument resolution at first-use, not import-time | Provider may be still-NOOP at import; OTel handles this |
| D-007 | stdlib `logging` over OTel logs API | Mature, notebook-friendly, bridgeable later |
| D-008 | Always-on per-step histograms | Negligible cost, high diagnostic value |
| D-009 | No sampling in v0.1 | Call rate doesn't justify the complexity |
