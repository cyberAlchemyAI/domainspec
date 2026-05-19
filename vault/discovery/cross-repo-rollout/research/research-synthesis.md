---
tags: [vault, research-synthesis, cross-repo-rollout]
node_type: research-synthesis
is_session: false
layer: architecture
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
---

# Research Synthesis — Cross-Repo Rollout of /domainspec Discipline

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Codify, from three repo-investigation lenses, the per-target-repo strategy for rolling out /domainspec discipline — separating universally-safe additive moves from per-repo blockers and items that require real reconciliation work.

## Context

/domainspec has stabilized 7 framework constitutions and is ready to export. Three consumer repos sit at radically different adoption baselines: `football-stats-oracle` (the seed of the vocabulary), `house_project` (the parent of the vocabulary), and `maestro-trama` (already mounts the framework via symlink). No two share a shape baseline; vocabulary is universally compatible.

## What Was Found

- Vocabulary parity is universal across all three repos; shape parity is not (see `research.md#theme-1-vocabulary-parity`).
- The seed-loop (football) has a real empirical gap: the close-session skill football authored has not been used in football — `sessions/` is empty despite the May-15 substantive bootstrap (see `research.md#theme-2-seed-loop`).
- `maestro-trama/domainspec` and `.claude` are symlinks to the canonical /domainspec; the "duplicate framework" premise is false. Symlink stability is unconfirmed (see `research.md#theme-3-symlink-mount`).
- Edge-acyclicity adoption is gated on declaring one source-of-truth where multiple ontology catalogs coexist (maestro explicitly; house_project implicitly across three formats) (see `research.md#theme-4-catalog-of-record`).
- A six-item universal additive layer (snapshot-zero, onboarding README, namespaced framework constitutions, empty bets/+amendments/ slots, MIGRATION-NOTES, single-line `verification:` backfill) is the only honest universal claim (see `research.md#theme-5-universal-additive-layer`).
- `internal_tools/` canonicalization is the only true high-cost item; only lens 03 investigated it (see `research.md#theme-6-internal-tools-canonicalization`).

## Decisions Taken

- Adopt the six-item universal additive layer as the safe-tonight envelope (`../discovery.md#4`).
- Defer all edge-format/catalog-of-record work behind explicit reconciliation gates (`../discovery.md#6`).
- Sequence rollout maestro → football → house_project, *conditional* on symlink stability (`../discovery.md#4`).
- Honor the reciprocal flow back to football as a load-bearing concept, not a footnote (`../discovery.md#5`).
- Treat `conversations/` (house_project, 474 files) as a legacy basin; do not retro-migrate (`../discovery.md#6`).

## Implications

- Per-repo profile (vocabulary / shape / process / mount) is needed before any non-additive move.
- The sequencing order inverts if OQ-1 (symlink stability) resolves to "transitional."
- A cross-repo `internal_tools/` audit (house_project ↔ maestro overlap) is missing from the lens slate and must precede OQ-2.

## Open Questions

- Is the lens-slate silence on house_project/maestro `internal_tools/` overlap a real gap? Recommend: schedule the audit (`../discovery.md#open-questions` OQ-2).
- Is "catalog-of-record reconciliation" maestro-specific or universal? Recommend: generalize (OQ-3).
- Symlink stability — permanent or transitional? Recommend: declare permanent unless reason exists (OQ-1).
- Reciprocal-flow framing — verifiable or editorial? Recommend: split empirical vs rhetorical (OQ-5).

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`

## Connections

- `derives-from` → `research.md`
