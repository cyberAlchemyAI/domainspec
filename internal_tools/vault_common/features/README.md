---
tags: [vault, infrastructure, kernel, vault_common]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# `vault_common` Feature Documents

This directory holds DomainSpec feature specifications for the shared kernel package `internal_tools/vault_common/`. The kernel is the load-bearing infrastructure for every other internal tool in `/domainspec/internal_tools/` (`vault_ctl`, `vault_telemetry`, `convergence_runner`, `graph_retrieval`, future Lean pipeline).

## Source discovery

The architecture commitments codified here are **not** invented in the spec — they derive from:

- [`../../../vault/discovery/two-layer-platform-architecture/discovery.md`](../../../vault/discovery/two-layer-platform-architecture/discovery.md) — the load-bearing discovery (D-1 through D-7, OQ-1 through OQ-6).
- [`../../../vault/discovery/two-layer-platform-architecture/lenses/01-cross-cutting-analysis/findings.md`](../../../vault/discovery/two-layer-platform-architecture/lenses/01-cross-cutting-analysis/findings.md) — the shared-primitives spec and subsystem-boundary table.
- [`../../../vault/constitution/frontmatter-ownership-constitution.md`](../../../vault/constitution/frontmatter-ownership-constitution.md) — ratified resolution of OQ-1 (frontmatter ownership).
- [`../../../vault/ontology-conventions.md`](../../../vault/ontology-conventions.md) — the schema text the Pydantic model is the executable form of.

If a downstream subsystem spec (e.g., `vault_ctl/features/spec/SPEC.md`) needs to depart from a kernel contract defined here, the chain is: amend the discovery first, then this spec, then the subsystem spec.

## Contents

| File | Purpose |
| ---- | ------- |
| [`spec/SPEC.md`](spec/SPEC.md) | DomainSpec feature spec for the `vault_common` kernel API surface |
| [`spec/architecture.md`](spec/architecture.md) | Six-view architecture companion |
| [`spec/glossary.md`](spec/glossary.md) | Source-linked glossary for kernel concepts |

## Status

Initial draft on 2026-05-18. Spec was written *after* the kernel had partial implementation (walker, frontmatter, edges, sqlite, embedder, events, plus four additional modules — `governance`, `cycles`, `amendments`, `bets` — not enumerated by the source discovery). Open questions in `SPEC.md` flag those mismatches rather than silently retconning them.
