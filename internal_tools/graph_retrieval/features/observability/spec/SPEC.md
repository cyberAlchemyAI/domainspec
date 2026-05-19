---
tags: [internal-tools, graph-retrieval, observability, spec]
node_type: spec
is_session: false
layer: architecture, application
nature: explanatory, technical
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Spec: graph_retrieval Observability

## 1. Summary

Process-wide OpenTelemetry seam for `graph_retrieval`. Exposes
`configure_observability(exporter, force=False)` and an `@instrumented`
decorator that turns any workflow function into one that emits a span,
a duration histogram, and structured logs without changing the
function body. Provides a `FaithfulnessGuardMode` knob so the F1/F4
violation counters from
[../../two-layer-retrieval/spec/observability.md](../../two-layer-retrieval/spec/observability.md)
can fire at runtime, not just in tests.

## 2. Aspect documents

| Aspect | Contains |
| ------ | -------- |
| [domain.md](domain.md) | `ExporterChoice`, `FaithfulnessGuardMode`, `MeterProviderState` value object |
| [interfaces.md](interfaces.md) | `configure_observability`, `@instrumented`, env-var precedence |
| [operations.md](operations.md) | Provider lifecycle, env config, test isolation, exporter setup |

## 3. Scope

**Owned:**
- `MeterProvider` singleton management.
- Exporter taxonomy and setup.
- `@instrumented` decorator for workflow functions.
- Runtime F1/F4 faithfulness-guard wiring.
- Structured-log formatter that mirrors
  [../../two-layer-retrieval/spec/observability.md#structured-logs](../../two-layer-retrieval/spec/observability.md#structured-logs).

**Excluded:**
- Instrument *definitions* (names, attributes, buckets) — those live
  in the feature that emits them.
- Receiver-side infra (collectors, Prometheus, Grafana).
- Trace-context propagation across process boundaries — graph_retrieval
  is library-internal in v0.1.

**Neighboring:**
- [two-layer-retrieval](../../two-layer-retrieval/) — the first caller
  of `@instrumented`; the consumer of the meter; the source of the
  instrument catalogue.
- [vault_common](../../../../vault_common/) — host module for the
  cross-cutting `otel.py`.

## 4. Lifecycle

```
import graph_retrieval         # provider NOT touched
configure_observability(NOOP)  # explicit no-op or default-on-first-use
configure_observability(CONSOLE, force=True)   # override
retrieve(...)                                  # spans + metrics emit per config
```

## 5. References

- Discovery: [../discovery/discovery.md](../discovery/discovery.md)
- Instrument catalogue: [../../two-layer-retrieval/spec/observability.md](../../two-layer-retrieval/spec/observability.md)
- F1/F4 contracts: [../../two-layer-retrieval/spec/rules.md](../../two-layer-retrieval/spec/rules.md)
- Architecture rule R-001 (algorithm imports Protocols only):
  [../../two-layer-retrieval/spec/architecture.md](../../two-layer-retrieval/spec/architecture.md#dependency-and-interface-rules)
