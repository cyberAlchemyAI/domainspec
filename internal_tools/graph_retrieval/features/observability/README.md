---
tags: [internal-tools, graph-retrieval, observability, feature]
node_type: readme
is_session: false
layer: architecture, application
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Feature: Observability (graph_retrieval)

OpenTelemetry seam for `graph_retrieval`. Owns the **how** —
`MeterProvider` lifecycle, `Exporter` choice, `Instrumented` decorator
wiring. Does **not** own the **what** — instrument names, attributes,
buckets, and alert thresholds live in
[two-layer-retrieval/spec/observability.md](../two-layer-retrieval/spec/observability.md)
and any future per-feature observability specs.

Two-layer-retrieval *emits*; this feature *receives*.

## Lifecycle order

```
discovery (here)  →  spec (here)  →  code (vault_common/otel.py, graph_retrieval/instrumentation.py, retriever.py edits)
```

## Layout

```
features/observability/
├── README.md          # this file
├── discovery/
│   └── discovery.md   # design space — provider lifecycle, exporter, F-guard mode
└── spec/
    ├── SPEC.md
    ├── domain.md      # MeterProvider, ExporterChoice, FaithfulnessGuardMode
    ├── interfaces.md  # configure_observability(), Instrumented decorator
    └── operations.md  # env vars, default no-op, dev vs prod
```

## Status

Draft. Discovery is the first concrete proposal; spec follows. No code
exists yet; `retriever.py` currently emits nothing.

## Out of scope

- Wiring to a live Prometheus or Grafana instance (infra, not this feature).
- Per-instrument design — that's owned by the feature that *emits* the metric.
- Trace-context propagation across process boundaries (graph_retrieval is library-internal; no boundaries to cross in v0.1).
