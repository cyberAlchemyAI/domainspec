---
tags: [vault, infrastructure, vault_ctl, readme]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# `vault_ctl/features/` — Navigation

`vault_ctl` is the platform's **validator, edge-linter, and snapshotter** — the subsystem that converts the vault's currently-discipline-only metadata rules into mechanically enforced ones. Per discovery D-2, it is the **foundational** subsystem (built first) and per D-5 its scope is intentionally narrowed to those three jobs.

This folder holds the feature spec for the `vault_ctl` rescope. It is the receipt the vault writes for itself: if the catalog cannot express a rule, the spec flags it rather than inventing one.

## Layout

| Artifact | Purpose |
| -------- | ------- |
| [`spec/SPEC.md`](spec/SPEC.md) | DomainSpec feature spec — three commands (`validate`, `lint-edges`, `snapshot`) with their tier maps, capability inventory, concept registry, and cross-feature graph. |
| [`spec/architecture.md`](spec/architecture.md) | Six-view architecture companion: context, structure, components, workflow, decisions, dependencies. Includes the gate result. |
| [`spec/glossary.md`](spec/glossary.md) | Source-linked definitions of every concept the spec introduces. |

## Source Discoveries (read before changing the spec)

| Discovery | What it gives the spec |
| --------- | ---------------------- |
| [`vault/discovery/documents-metadata-enforcement/`](../../../vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md) | The 10 failure modes (F1–F10), the three validation tiers, and the five enforcement-surface candidates. **The validator command is the A-3 (`vault-lint` CLI) recommendation from §5 of that discovery.** |
| [`vault/discovery/inverse-edge-fix/`](../../../vault/discovery/inverse-edge-fix/inverse-edge-fix.md) | The ~90 missing-inverse population, the three-sinks bootstrap (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`), the three risk tiers. **The `lint-edges` command is the executable form of that plan.** |
| [`vault/discovery/two-layer-platform-architecture/`](../../../vault/discovery/two-layer-platform-architecture/discovery.md) | Platform decisions: **D-2** (foundational; snapshot zero day-1), **D-5** (rescope — promotion/demotion → `vault_telemetry`, session-close → `close-session` skill), **D-7** (stable test corpus tag `vault-corpus-v0`). |

## Upstream Kernel Dependency

`vault_ctl` is a direct consumer of [`vault_common`](../../vault_common/features/spec/SPEC.md). Every capability in the spec cites the kernel concept it builds on (`WalkVault`, `ParseFrontmatter`, `ExtractEdges`, `EmitEvents`). The spec is written against the **kernel SPEC contract**, not against the current on-disk kernel code; three live kernel drifts (OQ-A, OQ-B, OQ-D in the kernel spec) are tracked as explicit *kernel-debt* blockers on individual `vault_ctl` capabilities.

## Out of Scope (per D-5)

`vault_ctl` does NOT include any of the following — each lives elsewhere by deliberate scoping:

- **Promotion / demotion candidate flagging** → `vault_telemetry` (derived signal over `status × veracidade × convicção × age`).
- **Session-close logic** → existing `close-session` skill.
- **Residue counters, drift reports, telemetry dashboards** → `vault_telemetry`.
- **Catalog amendment** (adding/renaming/collapsing edges) → `vault/discovery/domainspec-vault-edges/` (parked in `_backlog.md`).
- **Cross-repo path normalization, dangling-target sweep** → separate workstreams parked in `vault/discovery/_backlog.md`.
- **Immutability enforcement on sessions / discovery READMEs** → pre-commit hook + CI (per discovery OQ-3); out of `vault_ctl` because it is filesystem policy, not a vault-data primitive.
- **CI runner configuration** — the spec defines the validator core and the CLI; CI wiring is consumer-side.
