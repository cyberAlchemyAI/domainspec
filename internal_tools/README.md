---
tags: [internal-tools, vault, platform, kernel, telemetry]
node_type: readme
is_session: false
layer: architecture, application
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# internal_tools

## What is this?

`internal_tools/` is the vault platform for `/domainspec` — one platform with a thin shared kernel (`vault_common`) and subsystems (ctl, telemetry, retrieval, runner, agents-telemetry) communicating through strict seams. It hosts the Python packages, CLIs, and data stores that read, validate, embed, and observe the vault knowledge graph.

## Business Context

The vault is DomainSpec's evolving knowledge graph — discoveries, sessions, ontology conventions, constitutions, premises. Operating on it (validating frontmatter, extracting edges, running residue counters, dispatching multi-agent experiments, indexing for retrieval) requires deterministic tooling rather than ad-hoc scripts. These subsystems are that tooling, and they enforce vault invariants (frontmatter ownership, event-only inter-subsystem communication, per-subsystem databases) that keep the graph trustworthy as it grows.

## Why it matters

If subsystems reach into each other's SQLite stores or fork the frontmatter model, the kernel's contracts break and the vault stops being a reliable substrate for downstream agents. Centralizing the kernel here, enforcing event-based inter-subsystem communication, and shipping per-subsystem CLIs makes vault operations reproducible, auditable, and safe to evolve. The agents-telemetry subsystem in particular is what turns agent activity into observable signals the framework can learn from.

## 📁 Navigation

- **[pyproject.toml](pyproject.toml)** — Workspace Python project (`pip install -e .` exposes the CLIs).
- **`vault_common/`** — The kernel. Walker, frontmatter Pydantic models, edge extractor, SQLite kernel, embedder protocol, event sink. Every subsystem depends on this.
- **`vault_ctl/`** — Invariant enforcement: frontmatter validation, edge consistency, snapshot CLI. Emits events. CLI: `vault-ctl validate | edges-check | snapshot`.
- **`vault_telemetry/`** — Read-only metrics aggregator. The residue counter (MVP) measures whether the four predicted residues from `graph-as-residue-attractor` empirically generate new constitutions. CLI: `vault-telemetry scan | report | residues`.
- **`convergence_runner/`** — Multi-agent dispatch with structured logging. Re-runs lens experiments with hard-fetch enforcement. CLI: `convergence-runner dispatch | replay`.
- **`graph_retrieval/`** — Two-layer retrieval prototype. Per-intent compose-functions over typed-edge subgraph.
- **`categorical_tooling_guard/`** — Gate 1 CLI/CI wrapper over `scripts/audit_richness.py`, normalizing L1 audit output into `pass | flag | block`.
- **`tower_explorer/`** — Gate 0 structural checker for vault-style knowledge graphs, starting with origin-rung certification on cross-layer edges.
- **`agents-telemetry/`** — Agent-activity telemetry pipeline (canon, features, scripts, docs, data).
- **`visualizations/`** — Vault visualization assets.
- **`tests/`** — Test suite covering the kernel and subsystems.

## Architecture

See `vault/discovery/two-layer-platform-architecture/` for the design rationale. Key rules:

- Subsystems communicate via **events** (JSONL append-only) and the **read-only walker**. Never reach into each other's SQLite stores.
- **Frontmatter ownership:** `vault_common.frontmatter` owns the single Pydantic model. Per `vault/constitution/frontmatter-ownership-constitution.md`.
- Each subsystem owns its own `*.db` file. `vault_common` provides the kernel only.

## Install

```bash
cd /Users/victorboscaro/domainspec/internal_tools
pip install -e .
```

## Status

MVP scaffolding. Day-0 build. Snapshot zero taken at `vault/snapshots/2026-05-16-v0.json` (corpus_hash `11dcdd90a82fc32a...`).
