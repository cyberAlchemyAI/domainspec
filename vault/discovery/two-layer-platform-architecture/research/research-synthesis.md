---
tags: [vault, research-synthesis, two-layer-platform-architecture]
node_type: research-synthesis
is_session: false
layer: architecture
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Research Synthesis — Two-Layer Platform Architecture

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Codify, from 3 lens findings, whether the five infrastructure proposals collapse into one platform (kernel + thin subsystems with strict seams) or stay independent — and identify which decisions are forced by the lens evidence vs which remain operational preference.

## Context

Five infrastructure proposals (graph retrieval, vault CLI, telemetry, convergence runner, Lean pipeline) landed independently and converged on the same five primitives. The parent `graph-as-residue-attractor` discovery's 30-day residue-prediction window starts now; snapshot zero cannot be retroactively taken. Every subsystem either consumes the graded vault or writes a structured artifact others want to read.

## What Was Found

- The platform reframe is forced, not preferred: five independent walkers produce five divergent frontmatter schemas within a quarter (see `research.md#theme-1-kernel-vs-autonomy`).
- Frontmatter ownership is the load-bearing fork — every other architectural decision is downstream of whether `vault_common` owns one Pydantic model or each subsystem owns its view (see `research.md#theme-2-frontmatter-ownership`).
- Snapshot zero is the single time-irreversible artifact; a week-3 snapshot cannot become a week-1 snapshot (see `research.md#theme-3-snapshot-zero`).
- `vault_ctl` sits on the hard side of every dependency edge AND needs rescoping (strip promotion/demotion to telemetry; strip session-close to existing skill) — these are independent decisions (see `research.md#theme-4-vault-ctl-hard-side`).
- The empirical floor is three subsystems, not five: `vault_ctl` + `vault_telemetry` (residue-counter-only) + `convergence_runner` (dispatch-and-log-only) (see `research.md#theme-5-empirical-floor`).
- The convergence boundary classifier is theory-blocked — refuse to merge until an operational proxy is named in a discovery file (see `research.md#theme-6-classifier-theory-blocked`).
- Lens 03's 10 gaps are not uniform: three are biting (Gap 5 test corpus, Gap 6 frontmatter migration, Gap 9 immutability), four are deferrable (see `research.md#theme-7-gap-prioritization`).

## Decisions Taken

- Adopt the platform reframe with kernel + thin subsystems on strict seams (`../discovery.md#d-1`).
- `vault_ctl` foundational; snapshot zero on day 1, hand-written if necessary (`../discovery.md#d-2`).
- Greenfield in `/domainspec`, not migration from maestro-trama (`../discovery.md#d-3`).
- Cross-subsystem seam is events + read-only walker; never reach into another's SQLite store (`../discovery.md#d-4`).
- Rescope `vault_ctl`; absorb promotion/demotion into telemetry; route session-close to existing skill (`../discovery.md#d-5`).
- Empirical floor = three subsystems; defer `graph_retrieval` and `pipeline (Lean)` past week 4 (`../discovery.md#d-6`).
- Stable test corpus tag `vault-corpus-v0` is non-negotiable (`../discovery.md#d-7`).

## Implications

- Constitution follow-up: write `frontmatter-ownership-constitution.md` BEFORE any `vault_common` code.
- Backlog: add `schema_version:`, migration directory, and immutability pre-commit hook in weeks 1–2.
- Sibling discovery: open `convergence-boundary-classifier-definitions/` when an operational proxy candidate appears.

## Open Questions

- Frontmatter ownership ratification — `vault_common` Pydantic model vs per-subsystem views (`../discovery.md#oq-1`).
- Schema-version + migrations directory shape (`../discovery.md#oq-2`).
- Immutability enforcement — pre-commit hook, CI, or both (`../discovery.md#oq-3`).
- Convergence boundary classifier operational proxy (`../discovery.md#oq-6`).

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`

## Connections

- `derives-from` → `research.md`
