---
tags: [vault, research-synthesis, close-session-redesign]
node_type: research-synthesis
is_session: false
layer: ontology
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
---

# Research Synthesis — Close-Session Redesign

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Codify, from 4 propose-wave lens findings and 3 evaluate-wave meta-lens findings, the shape `close-session` must take for football-stats-oracle's solo-dev scale: what discipline ships, what tooling defers, and which over-engineered moves drop.

## Context

The propose wave produced rich designs (7-gate routing trees, kernel/adapter shims, JSON validators, Emergence Ratio walkers, character-grammar enforcement) — correct in spirit but assuming infrastructure the solo dev will not build. The evaluate wave's meta-lenses (cross-cutting, gaps, adversarial) consolidated the propose wave into an MVP-sized synthesis. This document is the structural reformatting of that synthesis under the new convention.

## What Was Found

- All 4 lenses converge that the session note must be a signpost, not a document; hard caps on body length are load-bearing; in-prompt discipline alone fails (see `research.md#theme-1-signpost-not-document`).
- Closed-vocabulary tokens and fixed field grammars are the only real defense against prose contamination of Layer 1 (see `research.md#theme-2-closed-vocabulary`).
- Promotion and retirement are flag-only — close-session never writes to compressed-layer files in a promoting way (see `research.md#theme-3-flag-only`).
- The primary failure mode is **judgment laundering through structured-record fields**: every Layer 1 field requires micro-judgment, agent prose routes into field values, line caps don't constrain semantic inflation (see `research.md#theme-4-judgment-laundering`).
- "Compression," "emergence," "signpost" are operationally vacuous as stated; only Lens 04's Emergence Ratio gives a candidate operational proxy, and the walker is out of scope (see `research.md#theme-5-objective-terms`).
- Lens 04's fleet design (schema versioning, kernel/adapter, cross-repo `repo:` field) is rejected by Meta-C as designing for a fleet that does not exist (see `research.md#theme-6-fleet-vs-solo-dev`).
- Meta-B surfaces seven gaps the objective demands but no lens fills (auditability operationalization, session boundary, defer-close, self-provenance, per-session distillation, cold-start, post-write boundary check).

## Decisions Taken

- Adopt Meta-C's 5-field MVP skeleton: `created`, `files_touched`, `premise_tests`, `candidate_premises`, `artifacts` (`../discovery.md#core-concepts`).
- Layer high-corroboration moves from Meta-A (closed vocabulary, flag-only promotion/retirement, semantic triage).
- Honor Meta-B's "honest defers" as a Known Leaks block at the top of `SKILL.md`.
- Drop the 7-gate routing tree, sentinel comment, cooling period, schema versioning, kernel/adapter shim, JSON validator, Emergence Ratio walker.
- Keep `record_budget` but rename to `record_lines: auto | <int>` so it cannot become an "importance dial."

## Implications

- Ship the discipline today; defer the tooling with named placeholders.
- Promote `vault/discovery/close-session-redesign/proposal/SKILL.md` to football-stats-oracle's `close-session/SKILL.md` after user evaluation.
- Re-evaluate `record_lines` after 30 sessions; drop if no override ever fires.
- Defer porting to sister `close-session` skills (`domainspec`, `house_project`) until one quarter of proven use.

## Open Questions

- Which freeze mechanism (sentinel vs linter vs prompt-only) survives? Recommend prompt-only MVP.
- Does `record_lines` survive at all? Recommend keep, re-evaluate at 30 sessions.
- Promotion-candidate review cadence? Recommend manual quarterly triage.

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`
- Skill proposal: `../proposal/SKILL.md`

## Connections

- `derives-from` → `research.md`
