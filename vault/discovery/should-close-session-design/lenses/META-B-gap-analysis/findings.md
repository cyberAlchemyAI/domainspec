---
tags: [vault, lens-findings, should-close-session-design, meta-lens, gap-analysis]
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

# Findings — Gap Analysis (Meta-Lens B)

## Objective

Enumerate the gaps the design target demands but no propose-wave lens fills, run a first-use walkthrough to surface missing pieces, inventory undrafted artifacts (SKILL.md, hook script), and name the load-bearing honest defers.

## Findings

# Meta-Lens B — Gap Analysis

## Gaps the design target demands but no lens fills

1. **No definition of "session" the hook can actually see.** All four lenses use "session" as a stable unit — for cooldowns, sentinels, observe-only counters, trust scores. But a Stop hook does not know what a session is. `/clear`, `/compact`, a fresh `claude` invocation, a resumed transcript, and a user who walks away for 4 hours and comes back all look different from outside. Lens 02 hand-waves with "per-session sentinel in `.claude/current_conversations/`" but never says which file proves session identity, what happens when two scratchpads coexist (close-session's own `MULTIPLE_SCRATCHPADS` state), or what the hook does when no scratchpad exists at all. Without a concrete `session_id` derivation rule, sentinel + trust score + "1 fire per session" are all undefined.

2. **No spec for the SKILL.md half of the artifact.** Lens 02 names it but never writes it. Lens 03's whole apparatus assumes *something* reads outcomes after the prompt fires — but the only thing that reads the prompt is the agent's next turn, and the agent has no machinery to write `last_prompt_outcome` back to the state file. The lenses describe a state machine with no state writer.

3. **Reflexivity (Lens 04 Failure 2) is acknowledged then violated.** Lens 04 says the only defense is mechanical-observables-only output. Lens 01's tiers emit normative verdicts. Lens 02's `additionalContext` payload is explicitly a normative speech act. No lens reconciles them. The skill as currently specified ships with the failure mode Lens 04 calls out as load-bearing.

4. **No connection between Lens 01's signals and Lens 02's hook capabilities.** S2 (vocabulary), S4 (axis), S11 (note-likelihood), S12 (idle cue) all require reading conversation content. A Stop hook receives `transcript_path` and can grep JSONL, but Lens 02 says "prefer FS-visible signals" and never specifies how the JSONL gets parsed under the 500ms timeout.

5. **Bootstrap vs first-use are in tension.** Lens 04 mandates 20-session observe-only mode. Lens 02 specifies hook firing on day one. Lens 03 initializes `trust_score = 0.7` from session one. None say which regime ships first, who flips the switch, or where the observation log lives (Lens 04 names `vault/discovery/...` which is in `domainspec`, not in football-stats-oracle).

6. **No abort criterion or kill-switch wiring.** Lens 04 declares thresholds. Lens 03 declares self-report caps. Neither says: who computes the metric, when, on what cadence, how the user is alerted. A kill-switch never evaluated is just decoration.

7. **No interaction model with the redesigned close-session's `CLOSE_DEFERRED` / `MULTIPLE_SCRATCHPADS` / `Q&A-only` exits.** The sibling has three legitimate non-write exits. Nobody specifies what the hook does when the user *did* invoke close-session and it bailed. Does the sentinel stay or clear? Both are defensible, neither is chosen.

## First-use walkthrough — what's missing

Scenario: solo dev opens football-stats-oracle for the first time after install. Edits a couple of files in `src/`, asks Claude about an xG calibration question, has a 40-minute back-and-forth ending with a one-line decision. Stop hook fires after the last assistant turn.

Steps + gaps:
1. Hook runs `git status --porcelain` (3 files modified), `ls .claude/current_conversations/*.md` (one scratchpad, ~120 lines), checks sentinel (absent), evaluates Lens 01's score.
2. Phase boundary detection requires JSONL parsing Lens 02 deferred. **Gap: hook either skips this signal (score never crosses tier-2) or runs the parse (unspecified).**
3. Assume soft-hint tier. Hook writes sentinel, emits `additionalContext`. **Gap: the agent has already finished its turn — the user does not see the nudge until they send the next message.** On a final turn, the nudge surfaces on the *next* session. By then it's stale.
4. If user keeps going, the agent ends its next response with the nudge. **Gap: user has never seen this skill before. The line is presented with zero affordance — no explanation, no dismissal path.**
5. User types "not yet". **Gap: Lens 03's dismissal classifier wants to read this and update state. Nothing reads it. The state file remains at `null`.**
6. User finishes the session. No telemetry written (Lens 04 mandates it; nothing implements it).

Unstated assumptions:
- That `additionalContext` reaches a turn the user actually reads. It doesn't, on the final turn.
- That the agent relays the nudge verbatim. SKILL.md is unwritten; behavior undefined.
- That dismissal classification happens. It doesn't.
- That the user understands `/close-session` on first encounter. The skill ships with no orientation.

## Skill-as-prompt-text and hook-as-shell-script — unspecified pieces

**The SKILL.md (prompt text agent reads when `additionalContext` arrives) is undrafted.** Must contain at minimum:
- Literal trigger string in `additionalContext` the agent recognizes.
- Exact one-line nudge text, character-bounded.
- Explicit prohibition on auto-invoking `/close-session`.
- Explicit prohibition on interpreting signals (mechanical-observables discipline).
- Instructions for "user dismissed" — either write state file or admit no writeback.
- Instructions for "no scratchpad / two scratchpads / close-session mid-run."
- Refusal table for re-asks.
- Cold-start clause: first 20 sessions observe-only.

**The hook script (bash/Node) is undrafted.** Must contain at minimum:
- Session-id derivation (Gap 1 above).
- `git status` + scratchpad + sentinel check with `timeout 2`.
- Lens 01's scoring math with explicit handling of "signal not measurable from FS alone."
- Sentinel write semantics: atomic, location, cleanup.
- Telemetry append. Path question: domainspec vs football-stats-oracle. Cross-repo write is unspecified.
- Exit code discipline (always 0; output JSON to stdout).
- `DEBUG=1` mode logging every decision.

## Scale-fit for football-stats-oracle

Specific overshoots:
- **Lens 03's trust-score state machine** (4 signal types, dormancy, week disable, self-uninstall): calibration system bigger than the thing calibrated.
- **Lens 03's per-signal-combination snoozes for 24h across all sessions**: requires snooze ledger, cross-session persistence. For 1 user 1 repo.
- **Lens 01's S2 (premise vocabulary shift)**: requires maintaining vault vocabulary and diffing across turns. For project with `<3 premises` (sibling's cold-start), this signal is degenerate.
- **Lens 04's 20-session observe-only with hand-review**: Lens 04 itself flags "who reviews the log? solo dev has no second reviewer." Right size: ship live with tightest gate, review after 5 fires.
- **Lens 04's telemetry pipeline with 30-session rolling windows**: statistical significance is fictional at this volume.
- **Lens 02's PreCompact secondary trigger**: adds second emission path. Stop hook alone covers the cases.

Right shape: **one Stop hook with one hard veto (`note_likely==0`), one sentinel per scratchpad, optional minimal SKILL.md, no trust score, no telemetry beyond append-only JSONL, no observe-only bootstrap requiring rituals.** Ship that. If it nags, tighten. If it never fires, drop it.

## Honest defers that are load-bearing

Things lenses defer that *must* appear in the SKILL.md or hook comments:

1. **`note_likely` may diverge from close-session's actual gate.** If they drift, the user runs close-session and gets "Q&A-only, no note" — exactly the trust-destroying outcome. Name this; ideally expose close-session as `--triage-only`.
2. **Session identity is not defined by the harness.** Until Claude Code exposes a stable session id to Stop hooks, the sentinel is best-effort. Name the limitation; document fallback (sentinel keyed by oldest scratchpad mtime).
3. **`additionalContext` at Stop is unverified.** Lens 02 OQ#1. Spike not run. Skill must ship with fallback (stderr print or file-based handoff) until OQ is closed.
4. **Dismissal classification has no writer.** Without it, Lens 03's state machine is decorative. SKILL.md must either include explicit "write outcome to state file" agent instructions OR drop the trust score entirely.
5. **Reflexivity is unfixable in principle.** Lens 04 Failure 2's "honest cannot fix." The SKILL.md must declare that every normative output is suspect because the reader is the writer.
6. **No kill-switch evaluator exists.** Either commit to quarterly hand-review or drop thresholds and replace with "if it annoys you, delete the file at `<path>`."
7. **Cross-repo write to `domainspec/vault/discovery/...`**: hook lives in football-stats-oracle; telemetry lives in domainspec. Either move telemetry to football-stats-oracle's `.claude/` or specify cross-repo write contract.
8. **Sentinel cleanup**: Lens 02 says either close-session deletes it or it lives next to scratchpad and dies naturally. Pick one. If neither, every session after the first starts with stale sentinel and the recommender is permanently silent.

## Connections

- `derives-from` → `../01-signal-design/findings.md`
- `derives-from` → `../02-form-factor/findings.md`
- `derives-from` → `../03-non-nag-discipline/findings.md`
- `derives-from` → `../04-adversarial/findings.md`
- `cited-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
