---
tags: [vault, discovery, ontology, infrastructure, platform]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.1
last_updated: 2026-05-16
veracidade: medium
convicção: high
---

# Two-Layer Platform Architecture

## What is this?

Discovery folder scoping the operational infrastructure that supports empirical testing of the [graph-as-residue-attractor](../graph-as-residue-attractor/) framework. It collects the cross-cutting analysis, critical-path DAG, and gap analysis that reframe five proposed tools as **one platform with subsystems on a shared kernel**.

## Business Context

The parent discovery (graph-as-residue-attractor) predicts four residues and proposes EVōC-based convergence measurement. Testing those predictions requires walker, frontmatter parser, SQLite index, embedding store, and structured event sink — primitives that five independently proposed tools (retrieval, vault CLI, telemetry, convergence runner, Lean pipeline) all need. This discovery owns the architecture decision for how to build them without re-implementing the kernel five times. Home of all platform code is `/domainspec/internal_tools/`.

## Why it matters

Building the five tools independently re-implements the kernel five times and produces five incompatible event sinks — a textbook case of the framework's own residue-accounting prediction (schema-layer concerns recurring at infrastructure scale). The architectural fork — **who owns the frontmatter schema?** — drives every other decision. And the time-critical artifact is **snapshot zero**: the 30-day measurement clock for the four predicted residues cannot be retroactively started.

## 📁 Navigation

- [lenses/01-cross-cutting-analysis.md](lenses/01-cross-cutting-analysis.md) — Cross-cutting platform analysis; argues the one-platform reframe; specifies kernel API and subsystem boundaries; names frontmatter-ownership as the load-bearing fork.
- [lenses/02-critical-path.md](lenses/02-critical-path.md) — Critical-path DAG with `vault_ctl` as foundation; identifies empirical floor (3 subsystems, not 5); 6-week schedule; "if you can only build one thing" → `vault_ctl + snapshot zero on day 1`.
- [lenses/03-gap-analysis.md](lenses/03-gap-analysis.md) — Three load-bearing gaps the proposers missed (test corpus, migration discipline, immutability enforcement); honest defers.

## Claim

The framework's operational infrastructure must itself respect the framework's two-layer structure: **a thin shared kernel preserves form-invariance across subsystems, while each subsystem owns its content domain.** Five candidate tools overlap massively on five primitives — they are not five tools, they are **one vault platform with subsystems on a shared kernel**. The empirical floor for testing the parent discovery's predictions requires only three subsystems, and the time-critical artifact is **snapshot zero**.

## Status

Exploratory. Triangulated by three lenses. Movement requires: (a) take snapshot zero — hand-written if necessary, before any code; (b) make the **frontmatter ownership decision**; (c) build `vault_common/` kernel + `vault_ctl` MVP. All infrastructure lives in /domainspec (not maestro-trama); `vault_routing/` and `semantic_index/` in maestro-trama continue serving maestro-trama and are not extended.

## Summary

The investigation began with five parallel proposals for infrastructure to support empirical testing (graph retrieval prototype, vault CLI, telemetry, convergence runner, Lean pipeline). All five converged independently on the same five primitives: walker, frontmatter parser, SQLite index, embedding store, structured event sink. Building these as five independent tools would re-implement the walker and the parser five times and produce five incompatible event sinks.

The cross-cutting analysis (lens 01) makes the reframe sharp: **one platform with five subsystems on a shared kernel.** Each subsystem owns its content domain; subsystems communicate via events and the read-only walker — they never reach into each other's SQLite stores. The architectural fork: **who owns the frontmatter schema?** If `vault_common` owns it, every subsystem validates against one Pydantic model. If each subsystem owns its own view, the schema becomes folklore.

The critical-path analysis (lens 02) identifies `vault_ctl` as the foundational subsystem — hard dependency for every other tool. The empirical floor requires only three subsystems: `vault_ctl` MVP, `vault_telemetry` residue-counter only, `convergence_runner` dispatch-only half. **The single most important artifact — before any code — is snapshot zero.**

The gap analysis (lens 03) found three gaps that bite before month 3: **stable test corpus** (~1 hour to close by tagging `vault-corpus-v0`); **frontmatter migration** (already biting); **immutability enforcement on sessions and discovery READMEs** (the framework's I3 invariant is currently wishful). Three honest defers: Vladimir-onboarding, backups, publication pipeline.

## Open Questions

- Frontmatter ownership: `vault_common` owns one Pydantic model, or each subsystem owns its view? (Lens 01 §6.)
- Right schema-version field for the migration discipline (Gap 6)? `schema_version:` in every node, with per-version backfill in `vault/migrations/`?
- Should immutability enforcement (Gap 9) be a pre-commit hook, a CI check, or both? At what mtime granularity?
- How does this platform relate to maestro-trama's existing `vault_routing/` and `semantic_index/`?
- The four predicted residues — does telemetry's residue counter need them as frontmatter `addresses-residue:` tags, or can it derive them from edge-traversal?

## Next Moves

1. **Snapshot zero today.** Hand-write a manifest of `/domainspec/vault/`'s current state into `/domainspec/vault/snapshots/2026-05-16-v0.json`. Tag `vault-corpus-v0`.
2. **Make the frontmatter ownership decision** (lens 01 §6) — write as `vault/constitution/frontmatter-ownership-constitution.md`.
3. **Create `/domainspec/internal_tools/vault_common/`** — extract walker, frontmatter Pydantic model, edge extractor, SQLite kernel, event sink. ~3 engineer-days.
4. **Then `/domainspec/internal_tools/vault_ctl/`** MVP — validator + edge linter + snapshot CLI.
5. **Then in parallel: `vault_telemetry` (residue-counter MVP) and `convergence_runner` (dispatch-only half).** Re-dispatch the Gödel lens with hard-fetch by end of week 4.
6. **Deferred:** `graph_retrieval` (week 5-6), Lean pipeline (until content earns it), boundary classifier for convergence.
