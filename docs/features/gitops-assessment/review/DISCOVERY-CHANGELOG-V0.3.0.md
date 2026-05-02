---
tags: [gitops, discovery, changelog, vault-pilot]
node_type: audit
is_session: false
layer: governance
nature: reference
status: active
version: 0.3.0
last_updated: 2026-05-02
---

# DISCOVERY-CHANGELOG-V0.3.0

Pivot: v1 GitOps target reframed from generic framework rollout to **the `/vault/` directory as the v1 pilot**. Framework patterns extracted in v2; runtime reconciler deferred to v3.

## Changed sections

- **Frontmatter** — `0.2.0→0.3.0`; `vault-pilot` tag; title "— Vault as v1 Target".
- **Objective** — v1/v2/v3 statement.
- **§1 Why now** — vault-as-smallest-blast-radius paragraph; vault drifting from its own `status: active` spec.
- **§1 What's broken** — 9 vault items added (uninvoked agents, missing validators, Heuristics 6/9, `ontology_events`, empty `backlog/`); framework items kept as side-effect closures.
- **§1 What stays the same** — vault-pilot OUT-OF-SCOPE block (RAG, generalization, payment regen, VPS, framework extraction); stale "vault out of scope" line marked.
- **§2 Core Concepts** — concept→vault-construct mapping table; 2.1/2.2/2.5 rescoped.
- **§3 Repo Topology** — `vault/.compiled/`, `vault/backlog/intake/`, 5 new validator scripts replace `generated/`+`infra/`; v2/v3 deferrals explicit.
- **§4 CI Substrate** — 3 workflows (no `deploy.yml`); bot-orchestration paragraph.
- **§5 Deterministic Regen Pipeline** — 5 vault validator rows added.
- **§6 Bot-PR Pipeline** — Vault Keeper + Updater mermaid replaces 9-agent flow; trust-gate split.
- **§7 Runtime Reconciler** — one-paragraph v3 deferral notice.
- **§8 Secrets** — `GH_PAT_AGENT` only in v1; 3 others deferred to v3.
- **§9 Phased Delivery** — mermaid restructured v1→v2→v3; Phase 3 DEPRIORITIZED.
- **§10 Open Questions** — all 10 vault-specific; Q5 repurposed for v2 buckets; **new Q11** on vault-compiled-tree locality.
