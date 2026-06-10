---
tags: [docs, registry, glossary, features, navigation]
node_type: readme
is_session: false
layer: domain, application
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Project Domain Documentation

> Powered by [domainspec](../README.md) — domain-first documentation framework.

## What is this?

The `docs/` tree is the project's domain documentation surface. It holds the global concept registry, the ubiquitous-language glossary, per-feature vertical-slice specifications, shared value objects, research notes, signal logs, interview artifacts, and the document templates used by the DomainSpec pipeline.

## Business Context

DomainSpec separates "what the system means" (documentation) from "how it runs" (code). `docs/` is the meaning side: a stable home for the typed concepts, named relationships, and feature contracts that downstream agents (test designer, implementer, verifier) read to produce code, tests, observability, and infrastructure. Every concept declared in a feature `SPEC.md` rolls up into `registry.json`/`registry.md` for cross-feature lookup.

## Why it matters

If documentation drifts from the registry, downstream generation produces incoherent code; if features sprawl outside the vertical-slice layout, traceability collapses. This folder is the single canonical place agents and humans look for domain answers, and the templates here enforce a structure the rest of the pipeline depends on.

## 📁 Navigation

- **[CHANGELOG.md](CHANGELOG.md)** — Versioned changes to project documentation.
- **[PROJECT-DECISIONS.md](PROJECT-DECISIONS.md)** — Persisted project-level decisions.
- **[UI-ARCHITECTURE.md](UI-ARCHITECTURE.md)** — Frontend architecture constitution.
- **[glossary.md](glossary.md)** — Ubiquitous-language definitions.
- **[registry.md](registry.md)** — Human-readable global concept index.
- **[registry.json](registry.json)** — Machine-readable concept registry (source for sync tools).
- **[meta-model.mmd](meta-model.mmd)** / **[meta-model-operational.mmd](meta-model-operational.mmd)** — Mermaid meta-model diagrams.
- **[test-pipeline.md](test-pipeline.md)** — Doc-to-test pipeline notes.
- **`features/`** — Per-feature vertical slices (each subfolder holds `SPEC.md`, aspect docs, stories, tests).
- **`shared/`** — Cross-feature value objects, enums, governance baselines.
- **`research/`** — Research notes and explorations feeding feature specs.
- **`signals/`** — Telemetry/signal logs (e.g. delegation tuning JSONL).
- **`interviews/`** — Interview-driven discovery artifacts.
- **`templates/`** — Document templates copied when creating new features or specs.

## Reference

- **Framework root:** [`../README.md`](../README.md)
- **Taxonomy:** [`../TAXONOMY.md`](../TAXONOMY.md) — 25 meta-concept types.
- **Relationships:** [`../RELATIONSHIPS.md`](../RELATIONSHIPS.md) — 29 typed edge types.
- **Test pipeline rules:** [`../TEST-PIPELINE.md`](../TEST-PIPELINE.md)
- **Templates:** [`../templates/`](../templates/)
