---
tags: [vault, lens-findings, should-close-session-design, non-nag-discipline]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
lens_order: first
dispatch_status: backfilled-no-prompt-recoverable
synthesized-by: ../../research/research.md
synthesizes: []
retrofits: ../../discovery.md
---

# Findings — Non-Nag Discipline

## Objective

Specify the silence-by-default rules, prompt budgets, snooze/acknowledge state machine, and trust-recovery logic that keep the recommender from training itself out of relevance.

## Findings

# Lens 03 — Non-Nag Discipline

## Claim

The failure mode for `should-close-session` is not under-firing; it is over-firing. A recommender that costs the user one extra cognitive interruption per session, even a polite one, will be silenced within a week — and a silenced recommender is worse than no recommender, because it occupies the namespace where a future, sharper signal could live. The discipline this skill must enforce on itself is the inverse of what most "assistant" features encode: **the default action is silence**, and every prompt must be earned by clearing a multi-signal gate, a budget gate, a cooldown gate, and a "would close-session actually write something" gate. The skill's success metric is not "how many close-worthy moments did it catch" but "what fraction of its prompts did the user act on" — and the target for that fraction should be ≥ 70%. Anything below 50% means the skill is training itself out of relevance.

## Prompt budget

**Per-session cap: 1 prompt.** Not 2, not "1 then a gentle reminder." One. A working session, by the close-session skill's own definition, has at most one natural closing boundary — the moment the work-in-progress crosses from "in flight" to "recordable." A second prompt in the same session is, by construction, either (a) the first prompt was wrong and the session continued, in which case re-firing is exactly the nag failure mode, or (b) the user already closed and re-opened, in which case it's a *new* session and the counter resets.

**Per-day cap: 3 prompts.** Justification from first principles: a solo dev on a side project rarely does more than 2–3 genuine context-switches in a day (morning deep work, afternoon iteration, evening polish would be an unusually productive day). 3 is the ceiling, not the target; the expected daily count is 1–2.

**Per-week soft cap: 12 prompts.** If the recommender is firing more than ~12 times in a week, something is wrong with the signal calibration regardless of acceptance rate. The skill should self-report this to the user as a configuration question, not silently keep firing.

**Hard rule:** when any cap is hit, the recommender does not "queue" a prompt for later. It drops it on the floor. A missed close-worthy moment is a strictly cheaper failure than a nag.

## Silent-by-default rule

A prompt fires only if **all** of the following are true:

1. **Multi-signal threshold.** At least 2 independent close-worthy signals are crossing threshold simultaneously. Signals must come from distinct families (e.g., one time-based + one content-based; not "long session" + "many turns" which are correlated). A single very strong signal is not enough.
2. **Real-session-value precondition** (see dedicated section below) returns true — i.e., close-session would not bail out on its own triage rule.
3. **Cooldown clear.** No prompt has fired in the current session, and no prompt was dismissed within the last 4 hours of wall-clock time.
4. **Conversational quiet moment.** The user's last message was either a checkpoint-shaped utterance ("okay", "looks good", "thanks", "done", "let's stop here", a bare confirmation) OR there has been ≥ 2 minutes of inactivity since the last assistant turn. Never prompt mid-flow — never interrupt a user who just asked a question or kicked off a task.
5. **Budget gate clear.** Per-session, per-day, per-week caps all have headroom.

If any one of these fails: stay silent. No partial prompts. No "soft" pings. No status-bar indicator that turns yellow. Silence is binary.

## Snooze / acknowledge semantics

The recommender maintains a tiny persistent state file (e.g., `.claude/should-close-session/state.json`) with the following schema:

```
{
  "session_id": "<id>",
  "session_started_at": "<ts>",
  "last_prompt_at": "<ts | null>",
  "last_prompt_outcome": "accepted | dismissed | ignored | null",
  "last_prompt_reason_signals": ["<signal_a>", "<signal_b>"],
  "daily_prompt_count": <int>,
  "daily_window_start": "<ts>",
  "weekly_prompt_count": <int>,
  "weekly_window_start": "<ts>",
  "session_dismissals": <int>,
  "user_calibration": {
    "conservative_until": "<ts | null>",
    "trust_score": <float in [0,1]>
  }
}
```

State machine for a prompt's lifecycle:

- **fired → accepted**: user invoked `close-session`. Reset session state. Trust score +0.05 (capped at 1.0). No further prompts this session by definition (session ended).
- **fired → dismissed (explicit)**: user said "no", "not yet", "keep going", "still working". Record reason if user gave one. Apply *per-session global snooze*: no more prompts this session, period. Apply *per-signal-set snooze*: the specific 2-signal combination that triggered this prompt is suppressed for the next 24 hours across all sessions.
- **fired → ignored (no decision)**: user kept working past the prompt without acknowledging. Treat as a soft dismissal. Per-session global snooze applies. Trust score −0.02.

Snoozes are **per-signal-combination, not per-topic**, because the skill has no real understanding of "topic." A combination like `(long_session + many_file_edits)` snoozed for 24h means that exact pair won't re-trigger; a different pair like `(test_pass + checkpoint_utterance)` can still fire — but is gated by the per-session and per-day caps, which are themselves global.

Global snooze takes precedence over per-signal snooze. If a user dismisses anything today, the per-day count still increments toward the cap of 3.

## Cooldown after no-decision

The most dangerous failure mode is: prompt fires, user says nothing and just continues working, recommender re-fires 5 turns later because the signals still cross threshold. Rule:

**After a no-decision outcome, the per-session global snooze is absolute for the remainder of the session.** No re-firing. Not with a stronger signal, not with new signals, not "just to confirm." The session is silent until the user explicitly closes or starts a new session.

Operational definition of "no decision": prompt was emitted, and within the next 3 user turns the user neither (a) invoked close-session nor (b) issued any utterance that pattern-matches as a dismissal ("no", "not yet", "later", "keep going", "still working on it", etc.). At turn 4, the prompt is recorded as `ignored` and the session-global snooze locks in.

The 3-turn window is not a re-prompt window — it is purely a *classification* window so the state file records the right outcome for the trust score update. The skill emits **nothing** during those 3 turns.

## Escalation: no

Hard no on escalation. Reasoning:

- Escalation is the canonical nag pattern. "You've been working 90 minutes past the suggested close" is exactly the sentence that makes a user disable a tool.
- The skill's premise is that the user is a competent adult who knows when their session is done. The first prompt is information; a second, louder prompt is an opinion about the user's judgment. The skill is not entitled to that opinion.
- If the first prompt was wrong, escalating makes it more wrong, more loudly.
- If the first prompt was right and the user ignored it, the user has additional context the skill does not. Re-prompting with that context absent is condescending.
- The cost of missing a close-worthy moment is small (the next session opens, the work is still there, close-session can be invoked retroactively). The cost of nagging is the death of the signal.

**"Say it once, never again this session" is the correct policy.** The escalation ladder is one rung tall, and it ends at the ground.

The single exception: if the user has an active scratchpad >10,000 lines AND the session has been running >6 hours AND there has been zero prompt this session (because some signal never crossed threshold), the skill may emit one and only one *informational* line on the user's next checkpoint-shaped utterance: "Heads up: this session is unusually long. `close-session` when you're ready." This is not a prompt; it's a state observation, and it counts against the daily cap.

## Trust recovery

The skill maintains a single scalar `trust_score ∈ [0, 1]`, initialized to 0.7. Adjustments:

- Accepted prompt: `+0.05`
- Dismissed prompt (explicit): `−0.10`
- Ignored prompt (no decision): `−0.02`
- User explicitly says "you were wrong" / "this session isn't done" within the dismissal turn: `−0.20`

When `trust_score < 0.5`: the silent-by-default rule tightens. Multi-signal threshold raises from "≥ 2 independent signals" to "≥ 3 independent signals," and per-session cap remains 1, per-day cap drops to 1. The skill effectively goes dormant until it earns trust back.

When `trust_score < 0.3`: the skill stops prompting entirely for 7 days. After 7 days it resets to 0.5 and resumes in the tightened mode. If it falls below 0.3 a second time within 30 days, it disables itself and asks the user (via a one-time line at next session start) whether to keep it on at all.

Recalibration is **per-skill-installation, not per-session**. A session-only recalibration would let bad calibration leak across days; a permanent global recalibration is the correct unit because the user's tolerance for interruption is a property of the user, not the session.

## Real-session-value precondition

The skill must not prompt for a close that would produce a no-op note. Concretely, before firing, the recommender runs a cheap pre-check that mirrors close-session's own triage rule:

- Has any file been written/modified in the working tree since session start? (git status non-empty, or scratchpad has new content)
- Has any test/script/command been run with a recorded outcome?
- Has the conversation produced any candidate premise / decision / finding worth recording (heuristic: any user utterance that contains "let's", "decided", "going with", "won't", "instead of", or any assistant turn that surfaced an unexpected result)?

**If all three are no, the skill stays silent regardless of session length, turn count, or any other signal.** A 4-hour session of reading code and asking questions is not close-worthy; close-session would correctly produce nothing, and prompting would be pure noise.

This precondition is checked *before* the multi-signal threshold, not after, because it's the cheapest gate and the most important one. The other gates are about *when* to surface a close-worthy moment; this gate is about *whether one exists at all.*

## Open Questions

1. Where does the state file live so it survives across sessions but doesn't leak across repos? `.claude/should-close-session/state.json` in the project root seems right, but the trust score arguably should be user-global, not project-local — a user who dismisses prompts in repo A is probably the same human in repo B.
2. Is the 3-turn classification window correct, or should "no decision" be classified faster (e.g., after the next user turn that isn't a dismissal)? Faster classification means earlier state updates but more misclassifications when the user is just slow to respond.
3. The "checkpoint-shaped utterance" detector is a heuristic. What's the precision/recall target, and how is it measured without instrumenting every session? Possibly: log fired-prompt context for the user's own review, and let the user grade the detector retroactively.
4. Should the per-week soft cap of 12 ever auto-tighten the per-day cap, or only emit the self-report? Auto-tightening risks the skill silently disabling itself in a way the user doesn't notice.
5. The "informational line" escape hatch for very long sessions (>6h, >10k-line scratchpad) is the one place this lens admits a second utterance per session. Is it worth the consistency cost? It might be better to drop it entirely and accept that very long sessions sometimes go un-prompted.
6. Trust score initialization at 0.7 is a guess. Should new installations start at 1.0 (give the user the benefit of the doubt) or 0.5 (earn trust from neutral)? 0.7 assumes a competent default calibration; 0.5 assumes nothing.
7. Does "explicit dismissal" need natural-language understanding, or is a short keyword list sufficient? Keyword list is more predictable but will miss phrasings like "I want to keep pushing on this for a bit"; NLU is more accurate but introduces a dependency and a failure mode where misunderstood dismissals are recorded as ignores.

## Connections

- `derives-from` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
