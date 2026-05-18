---
name: should-close-session-companion
description: Minimal companion to the should-close-session Stop hook. Describes how the agent should surface the hook's observation to the user without rationalizing it as a verdict. Optional — the hook works without this skill.
---

# Should-Close-Session — Agent Companion

The `should-close-session` Stop hook (at `.claude/hooks/should-close-session.sh`) may inject an `additionalContext` line into your next turn. This skill tells you what to do with it.

---

## Recognizing the signal

The injected line starts with the literal prefix `should-close-session:` and contains **only mechanical observations** (file counts, scratchpad size, "close-session would write a note"). It contains **no verdict** ("close now," "looks done," "ready to close" are absent by design).

If you ever see a `should-close-session:` line that contains a verdict, the hook is misconfigured — surface it to the user as-is and do not amplify.

---

## What to do

1. **Surface the observation to the user once, verbatim, at the end of your turn.** One line. Do not rephrase. Do not interpret. Example:
   > *Heads-up from `should-close-session`: git shows 3 file(s) changed in vault paths; scratchpad 2026-05-16-1430 has 142 lines; close-session would write a note.*

2. **Do not auto-invoke `/close-session`.** The hook's purpose is to give the user a chance to close, not to close for them.

3. **If the user replies "close" / "yes" / runs `/close-session`** — invoke the close-session skill normally.

4. **If the user ignores the observation or replies with unrelated work** — do nothing. The single-fire sentinel prevents the hook from re-firing this session. Do not nudge again.

5. **If the user replies "snooze" / "not now" / "ignore"** — acknowledge in one line and continue. Do not write any state file; the sentinel already prevents re-fire.

---

## What NOT to do

- **Do not turn the observation into a verdict.** "Looks like this is a good time to close" is exactly the reflexive failure the hook is designed against. Stick to "git shows N files changed."
- **Do not justify the observation.** The user can read the mechanical facts and decide. Adding "because we touched the xG normalization and that's a meaningful change" is verdict-by-stealth.
- **Do not preempt the hook by suggesting close-session on your own.** If your reasoning agrees with the hook, that's fine — but route through the hook's mechanical line, not your own.
- **Do not interpret the absence of the observation as "keep going."** The hook is silent by default; silence means "no signal," not "permission to continue."

---

## Known limitations (don't paper over these)

- **The hook fires *after* the assistant turn that responded to a closing-shaped user utterance.** The nudge will sometimes land one turn late, duplicating something the user already implied. Surface it anyway — the duplication is preferable to suppression.
- **Stop-hook `additionalContext` is not guaranteed in all Claude Code builds.** If you have never seen a `should-close-session:` line despite working in football-stats-oracle for weeks, check `.claude/state/should-close-observations.jsonl` to see whether the hook is firing at all.
- **The hook does not know what a "session" is.** It uses the oldest scratchpad as a proxy. If `/clear` was called or scratchpads are weird, the sentinel may be stale or missing.
- **This is a 20-session experiment, not a permanent skill.** If `OBSERVE_ONLY=1` is still set in `.claude/settings.json` after 20+ sessions, the user has not yet reviewed the log — do not assume the hook is "working." Suggest the user run `wc -l .claude/state/should-close-observations.jsonl` and decide.
