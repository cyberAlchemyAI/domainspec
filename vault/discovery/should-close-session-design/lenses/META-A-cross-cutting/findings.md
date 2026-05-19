---
tags: [vault, lens-findings, should-close-session-design, meta-lens, cross-cutting]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
lens_order: second
dispatch_status: backfilled-no-prompt-recoverable
synthesized-by: ../../research/research.md
synthesizes:
  - ../01-signal-design/findings.md
  - ../02-form-factor/findings.md
  - ../03-non-nag-discipline/findings.md
  - ../04-adversarial/findings.md
retrofits: ../../discovery.md
---

# Findings — Cross-Cutting (Meta-Lens A)

## Objective

Triangulate the four propose-wave lenses: catalog convergences (≥3 lenses agree), surface compatible-but-uncombined moves, name the shared mental model, and audit corroboration vs contradiction against the design target.

## Findings

# Meta-Lens A — Cross-Cutting

## Convergences (≥3 lenses agree)

1. **The triage rule from `close-session` (note_likely) is the load-bearing hard veto — silence is mandatory whenever closing would produce no note.** All 4 lenses. 01: `note_likely == 0` is "hard veto" that "eliminates most nagging." 02: hook gate mirrors the same precondition. 03: "real-session-value precondition" is checked first because it's "the cheapest gate and the most important one." 04 Failure 3 fix: "Recommender must never fire when `files_touched=0` AND `scratchpad=0`."
2. **Silence is the default; the system is quiet by construction, not by tuning.** All 4 lenses. 01: "Silent by default… one fire per phase." 02: "emits nothing unless thresholds cross." 03: "default action is silence." 04: Stop-hook only prints when conditions cross; auto-invocation is itself the failure mode.
3. **One fire per session, no escalation.** Lenses 01, 02, 03. 01 caps at 1/phase, 2/session, "escalates to silence, not louder." 02 enforces via sentinel. 03: "Say it once, never again this session… The escalation ladder is one rung tall, and it ends at the ground."
4. **Agent's introspective "wrapping up" sense is disqualified.** Lenses 01, 02, 04. 01 disqualifies S13 ("trained to be agreeable… precisely the failure mode this skill exists to compensate for"). 04's central thesis is reflexivity. 02 routes the trigger to a filesystem hook outside the agent loop.
5. **Signals are mechanical / filesystem-observable, never introspective.** Lenses 01, 02, 04. 01's top signals are all FS checks. 02 chose a hook because inputs are `git status`, scratchpad ls/wc, sentinel. 04 Failure 2 fix: "emit only mechanical observables, never normative judgments."
6. **Cross-session state matters; per-session-only state leaks calibration.** Lenses 02, 03, 04. All maintain some sort of persisted state, though they invent it independently.
7. **Turn count, wall-clock, context-pressure are not triggers.** Lenses 01, 03 (implicit), 04. 04 Failure 5: "loudest when its advice is most costly to follow."

## Compatible but uncombined moves

1. **Lens 02's Stop-hook form factor cleanly delivers Lens 04's "mechanical observables only" mandate.** 02 owns the surface; 04 owns the content discipline; neither references the other.
2. **Lens 03's persistent `state.json` is the natural home for Lens 04's `telemetry.jsonl` and Lens 01's cooldown counters.** One file, three consumers — no lens noticed they were all inventing the same store.
3. **Lens 04's observe-only bootstrap (20 sessions, no emission) resolves Lens 03's "trust_score=0.7 initialization is a guess" open question.** Initialize from empirical observation, not a literal prior.
4. **Lens 01's signal families (git delta, vocabulary, tool-mix, scratchpad) supply Lens 03's unspecified "two independent signal families" requirement.**
5. **Lens 04's `close-session --dry-run` alternative subsumes Lens 01's OQ#6** ("Should `note_likely` peek at close-session's logic?"). Both arrive at "call the authoritative gate" independently.
6. **Lens 02's PreCompact secondary handles Lens 01's S6 (context-pressure) without violating Lens 04's Failure 5.** Compaction is a different event from closing; they don't conflict.
7. **Lens 03's "checkpoint utterance or quiet" gate satisfies Lens 01's S12 + Lens 04's "user-initiated only" simultaneously.** Three positions collapse to: "speak only at quiet moments."

## Shared mental model

All four lenses converge on one picture: the user is a competent solo dev whose close-session behavior is mostly already correct, the redesigned `close-session` already encodes the authoritative "is this session worth marking" judgment via its Step 0 triage gate, and the role of `should-close-session` is therefore narrow — a **passive, mechanical, single-shot, filesystem-driven nudge** that fires at most once per session, only when the authoritative gate would write a note, only at quiet conversational moments, only with output the agent cannot easily reinterpret as a verdict. The dominant failure mode is over-firing / reflexive bias, not under-firing; the cost of a missed close is small (close next turn), the cost of a wrong close or a nag is large. Lenses disagree only on *where on the build-vs-don't-build spectrum* this lands.

## Corroboration & contradiction with the design target

**Corroboration.** The design target says "signals when to invoke close-session… does NOT auto-close… balances closing too late vs nagging." All four lenses treat these as load-bearing and operationalize them congruently. The non-auto-close requirement is honored by every lens. The nag/late balance is treated as asymmetric — nagging is worse — which matches solo-dev (no other user to dilute irritation). The sibling skill's triage rule is adopted verbatim as a precondition by every lens.

**Contradiction.** The design target's framing ("watches a running session, signals **when** to invoke") presumes the skill exists. Lens 04 directly challenges this: its steelman concludes the skill should likely not be built and proposes `close-session --dry-run` as a strictly better tool. Lens 02 embeds a softer contradiction — its hook does not "watch" continuously, it is a stateless per-turn check. A second tension: the target's "signals when" implies positive prescription, while Lenses 01, 03, 04 all argue the output should be either silent or maximally restrained. The unresolved disagreement is whether the primary output is a *recommendation* (target framing) or an *observation* (Lens 04's structural fix). That is the open design question the meta-lens cannot collapse from the inputs alone.

## Connections

- `derives-from` → `../01-signal-design/findings.md`
- `derives-from` → `../02-form-factor/findings.md`
- `derives-from` → `../03-non-nag-discipline/findings.md`
- `derives-from` → `../04-adversarial/findings.md`
- `cited-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
