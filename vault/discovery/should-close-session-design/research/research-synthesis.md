---
tags: [vault, research-synthesis, should-close-session-design]
node_type: research-synthesis
is_session: false
layer: ontology
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Research Synthesis — Should-Close-Session Recommender Design

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Codify, from 4 propose-wave lenses and 3 evaluate-wave meta-lenses, whether a `should-close-session` recommender survives solo-dev scale — separating mechanical observation from calibration theater from reflexive failure.

## Context

The redesigned `close-session` already runs a post-hoc triage gate; a pre-hoc recommender either duplicates that gate with less information or contradicts it. The propose wave (signal design, form factor, non-nag discipline, adversarial) and the evaluate wave (cross-cutting, gap analysis, adversarial review) were dispatched on 2026-05-17 to test whether the recommender earns its place at all.

## What Was Found

- The `note_likely` triage rule from `close-session` is the load-bearing hard veto; silence is mandatory whenever closing would produce no note (`research.md#theme-1-triage-veto`).
- Reflexivity is the load-bearing failure mode and is structurally unfixable; mechanical-observables-only output is reduction, not elimination (`research.md#theme-2-reflexivity`).
- The calibrated discipline (trust-score arithmetic, per-signal snoozes, classification window) collapses under fixed-point: the state machine has no writer and the inputs are unobservable at solo-dev scale (`research.md#theme-3-calibrated-discipline-collapses`).
- Stop-hook timing fundamentally cannot deliver pre-emptive nudges — the hook fires *after* the assistant turn responding to a closing-shaped utterance, so the nudge is always one turn late (`research.md#theme-4-stop-hook-timing`).
- The bootstrap trap dominates: 10 bad fires permanently sink the skill at solo-dev volume; observe-only mode is the only honest entry (`research.md#theme-5-bootstrap-trap`).
- Scale-fit voids most calibration apparatus — trust score, snooze ledger, premise-vocabulary detection, rolling-window telemetry are all bigger than the thing calibrated (`research.md#theme-6-scale-fit`).

## Decisions Taken

- Form factor: Stop hook, project-level, no daemon (`../discovery.md#d-1`).
- Single hard gate: `git status --porcelain` non-empty AND sentinel absent (`../discovery.md#d-2`).
- Output is mechanical observables only — no verdict (`../discovery.md#d-3`).
- Single-fire sentinel co-located with scratchpads, no `close-session` coupling (`../discovery.md#d-4`).
- Observe-only bootstrap with env-var kill-switch (`../discovery.md#d-5`).
- Vault target is knowledge-scope; implementation lives in consumer repo (`../discovery.md#d-6`).

## Implications

- Spec follow-up: ship the ~30-line hook + `proposal/SKILL.md` in `football-stats-oracle/.claude/`; vault holds rationale only.
- Empirical follow-up: 20-session observe-only run with eyeball review; default is deletion, not retention.
- Backlog: if the experiment kills the hook, A-3 (extend `close-session` with `--triage-only`) is the next move — not a different recommender.
- Citation gate: do not port to `domainspec/` or `house_project/` until the 20-session experiment concludes.

## Open Questions

- Does Claude Code's Stop hook accept `additionalContext`? Recommend 5-minute spike before deploy (OQ-1).
- What is the canonical `session_id` derivation rule? Recommend oldest scratchpad mtime as v0 proxy (OQ-2).
- Does `note_likely` drift from close-session's actual gate matter? Recommend best-effort proxy + documented limitation (OQ-4).

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`

## Connections

- `derives-from` → `research.md`
