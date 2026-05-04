---
tags: [vault, edges, hygiene, inverse, readme]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
---

# inverse-edge-fix

This discovery scopes the actionable plan for repairing the ~90 vault-internal missing-inverse edges (Category 4) surfaced by the `edges-hygiene-2026-05-03` dispatch, plus the bootstrap of three high-traffic vault sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) that currently carry no `## Connections` block at all. It explicitly defers cross-repo absolute paths, repo-escaping relative paths, dangling targets, off-catalog edge-name reconciliation, the `Scope` column proposal, and README prose-vs-table standardization to `vault/discovery/_backlog.md`, and it defers CI/curator wiring to `vault/discovery/curator-pipeline-integration/`. The user's "skills/agents are not vault graph nodes" ruling is the load-bearing decision that scopes the work to vault-internal targets only.

See: [inverse-edge-fix.md](./inverse-edge-fix.md).

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `created-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session created this README alongside the main discovery file. |
