---
tags: [vault, discovery, skill-design, should-close-session, hook]
node_type: readme
is_session: false
layer: ontology
nature: hook-design
status: proposed
version: 0.1.1
last_updated: 2026-05-16
veracidade: medium
convicção: high
parent_discovery: ../close-session-redesign/
---

# Should-Close-Session Design

## What is this?

Discovery folder for the design of a recommender that watches a session and suggests when to invoke `close-session`. Holds four propose-wave lenses, three evaluate-wave meta-lenses, and a concrete proposal artifact set (hook script, settings fragment, optional companion SKILL.md).

## Business Context

Sits one layer downstream of [close-session-redesign](../close-session-redesign/). The close-session skill is solo-dev-scaled and append-only; without a recommender, the user must remember to invoke it. The recommender lives in `football-stats-oracle/.claude/` (not domainspec), because that is the repo where the experiment runs. The vault folder holds only the design rationale and the proposal artifacts.

## Why it matters

Every lens in the design synthesis converges on the same load-bearing tension: the recommender's signal can create the closeability it is supposed to measure (reflexivity). If the design over-engineers (tiered scoring, trust-score state machines, snooze ledgers), it produces fake precision over unmeasurable inputs and the agent rationalizes the verdict. The discovery's job is to defend against that failure mode and ship a 20-session experiment, not a long-lived skill.

## 📁 Navigation

- [lenses/01-signal-design.md](lenses/01-signal-design.md) — 13-signal catalog, ranking, scoring tiers, disqualified signals.
- [lenses/02-form-factor.md](lenses/02-form-factor.md) — Stop hook vs UserPromptSubmit vs Skill self-invocation; harness inspection of existing GitNexus hooks; integration contract with close-session.
- [lenses/03-non-nag-discipline.md](lenses/03-non-nag-discipline.md) — Prompt budget, silent-by-default gate, snooze semantics, trust-score state machine.
- [lenses/04-adversarial.md](lenses/04-adversarial.md) — Steelman against building, reflexivity as load-bearing failure, observe-only bootstrap as structural defense, kill-switch metric.
- [meta-lenses/A-cross-cutting.md](meta-lenses/A-cross-cutting.md) — Seven convergences, seven compatible-but-uncombined moves, shared mental model, observation-vs-prescription tension.
- [meta-lenses/B-gap-analysis.md](meta-lenses/B-gap-analysis.md) — Seven holes, first-use walkthrough, undrafted-artifacts inventory, scale-fit critique, load-bearing honest defers.
- [meta-lenses/C-adversarial-review.md](meta-lenses/C-adversarial-review.md) — Weakest proposal, most over-engineered, fixed-point conflict, 5-rule MVP.
- [proposal/should-close-session.sh](proposal/should-close-session.sh) — The hook (~50 lines bash).
- [proposal/settings.json.fragment](proposal/settings.json.fragment) — Snippet to paste into `football-stats-oracle/.claude/settings.json`.
- [proposal/SKILL.md](proposal/SKILL.md) — Minimal companion (~40 lines) documenting the agent contract for surfacing the observation. Optional; the hook works without it.

## Claim

A recommender that watches a session and suggests when to invoke `close-session` is **best built as a ~30-line Stop hook**, not a Skill. The hook runs **one hard gate** (`git status --porcelain` non-empty in vault-relevant paths AND no per-session sentinel present) and emits **mechanical observables only** — no normative verdict. It ships in **observe-only mode for ~20 sessions** writing decisions to a JSONL log; if hand-review shows the hook would catch nothing the user wouldn't catch themselves, **delete the hook and abandon the project**.

## Status

Proposed. Triangulated by 4 propose-wave lenses and 3 evaluate-wave meta-lenses. Synthesis converges on Meta-C's MVP: not a Skill, not a state machine, just a hook + a sentinel + an observation log.

## Summary

Four propose-wave lenses were dispatched in parallel — **Lens 01 — Signal Design** (13 candidate signals, ranked, with a tiered scoring rule); **Lens 02 — Form Factor** (Stop hook + co-located SKILL.md after inspecting existing GitNexus hooks); **Lens 03 — Non-Nag Discipline** (trust-score state machine with snooze, escalation refusal, self-uninstall); **Lens 04 — Adversarial** (steelman against building, reflexivity as load-bearing failure, observe-only bootstrap + mechanical-observables as the only structural defenses).

Three evaluate-wave meta-lenses then reviewed all four. **Meta-A** found seven strong convergences (triage-rule veto load-bearing, silence default, one fire per session no escalation, agent introspection disqualified, signals must be FS-observable, cross-session state matters, time/turn/pressure are not triggers). **Meta-B** surfaced seven holes (session identity undefined; SKILL.md undrafted; reflexivity acknowledged then violated by Lens 01/02; bootstrap vs first-use tension; no kill-switch evaluator; no interaction model with `close-session`'s exit states; fragile cross-repo telemetry path). **Meta-C** identified Lens 03 as weakest (fake precision arithmetic), Lens 01's tiered scoring as most over-engineered, two rules most likely to be ignored, and a fixed-point walkthrough showing Lens 02's Stop-hook timing fundamentally cannot deliver Lens 03's "prompt before the user closes" — the nudge always lands one turn late.

The synthesis collapses to Meta-C's 5-rule MVP. Adopted: **Stop hook form factor**; **`git status` non-empty as the single hard gate**; **sentinel in `.claude/current_conversations/` for single-fire-per-session**; **mechanical-observables-only output**; **observe-only bootstrap with kill-switch via env var**. Dropped: tiered scoring, trust score, snooze ledger, classification window, transcript JSONL parsing, premise-vocabulary detection, PreCompact secondary trigger, escalation, cross-repo telemetry write.

The honest framing: **this is a 20-session experiment, not a long-lived skill.** If the observation log after 20 sessions shows the hook fires correlate with sessions the user would have closed at the same moment anyway, the hook earned nothing and should be deleted.

A subtle point: the design target's verb "**signals when**" implies positive prescription, but every surviving lens argues the output should be observation, not prescription — the agent reading any prescription will rationalize it, and the recommender's signal will create the closeability it is supposed to measure.

## Open Questions

- **Stop-hook `additionalContext` is empirically unverified.** Run a 5-minute spike before deploying.
- **Cross-repo concern for the observation log.** Local fragile path vs canonical cross-repo write. Proposal picks local; can be moved later.
- **Sibling triage gate may drift.** If `close-session`'s Step 0 changes, the hook's `note_likely` proxy lies. Proposal v0 takes the trust-the-user path; shared `triage.sh` is a follow-up.
- **Port to domainspec / house_project?** Defer until the football-stats-oracle 20-session experiment concludes.

## Next Moves

1. **Run the 5-minute spike** to verify whether Stop hooks support `additionalContext` injection in the current Claude Code build.
2. **User evaluates** the proposal artifacts.
3. **Deploy in observe-only mode** for 20 real sessions in football-stats-oracle.
4. **Hand-review after 20 sessions.** Three outcomes: (a) good correlation → flip `OBSERVE_ONLY=0`. (b) poor correlation → delete the hook. (c) the hook never fires → delete the hook, conclude the recommender solves a non-problem for this user.
5. **Defer until needed:** SKILL.md companion, trust-score machinery, snooze ledgers, PreCompact secondary trigger, premise-vocabulary signal, cross-repo port.
