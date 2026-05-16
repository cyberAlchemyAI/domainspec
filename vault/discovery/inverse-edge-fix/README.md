---
tags: [vault, edges, hygiene, inverse, readme]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.1
last_updated: 2026-05-16
---

# inverse-edge-fix

## What is this?

Discovery folder scoping the actionable plan for repairing the ~90 vault-internal missing-inverse edges (Category 4) surfaced by the `edges-hygiene-2026-05-03` dispatch, plus bootstrap of three high-traffic vault sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) currently carrying no `## Connections` block.

## Business Context

Sits inside the vault's edge-hygiene work. Downstream of the 2026-05-03 cross-boundary-rule session that ruled "skills/agents are not vault graph nodes" — the load-bearing decision that scopes this discovery to vault-internal targets only. Cross-repo absolute paths, repo-escaping relative paths, dangling targets, off-catalog edge-name reconciliation, the `Scope` column proposal, and README prose-vs-table standardization are explicitly deferred to `vault/discovery/_backlog.md`. CI / curator wiring is deferred to `vault/discovery/curator-pipeline-integration/`.

## Why it matters

Without repair, the vault's bidirectionality invariant is wishful and the graph cannot be trusted as a queryable structure. The discovery exists to convert the inventory from the edges-hygiene dispatch into a concrete, scope-bounded repair plan that one pass can close.

## 📁 Navigation

- [inverse-edge-fix.md](inverse-edge-fix.md) — Full discovery: inventory of Category 4 misses, three-sink bootstrap, repair sequencing, explicit deferrals.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `created-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session created this README alongside the main discovery file. |
