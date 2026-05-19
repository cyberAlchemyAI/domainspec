---
tags: [vault, lens-findings, should-close-session-design, form-factor]
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

# Findings — Form Factor

## Objective

Choose the Claude Code surface (Stop hook, UserPromptSubmit, Skill self-invocation, cron, slash command, etc.) that delivers the recommender with minimum solo-dev maintenance burden and the right signal-to-noise.

## Findings

# Lens 02 — Form Factor

## Claim

The `should-close-session` skill should fire as a **Stop hook** configured in `/Users/victorboscaro/football-stats-oracle/.claude/settings.json`, emitting a structured `additionalContext` payload (same protocol as the in-tree GitNexus hook at `/Users/victorboscaro/.claude/hooks/gitnexus/gitnexus-hook.cjs`) only when a cheap, stateless check over `git status` + `.claude/current_conversations/` crosses a threshold. The hook surfaces a one-line nudge to the *agent's* next turn, not to the user; the agent then either self-invokes `/close-session` or, if conditions warrant, prints a single visible line for the user. A skill SKILL.md file ships alongside so the agent has rules for what to do when the nudge arrives — i.e. the "skill" is half hook (the trigger), half SKILL.md (the response contract). No cron, no slash command, no LLM polling.

## Form factor survey

| Mechanism | Trigger | Surface | State access | Cost | Verdict for this skill |
|---|---|---|---|---|---|
| **Stop hook** (`hooks.Stop[].command`) | Every time the assistant finishes a turn | `hookSpecificOutput.additionalContext` injects into next agent context; can also `stderr` to user | Working dir, env, can shell out to `git`, `ls .claude/current_conversations/`, `wc -l` on scratchpads. No conversation transcript directly, but transcript path is passed in stdin JSON. | Runs on every Stop. Must be fast (~<500ms) and silent when no signal — otherwise spammy. Zero LLM tokens for the check itself. | **Chosen.** Right granularity (per turn), right access (filesystem + git), invisible when quiet. |
| **UserPromptSubmit hook** | When user submits a prompt | Same `additionalContext` protocol, prepended to that user turn | Same FS access. Sees `user_prompt` field. | Same cost as Stop, but fires *before* the model sees the prompt. Slightly worse: the signal we care about (turn count, accumulated scratchpad) ratchets *after* the model acts, so Stop is the natural moment. | Reject. Wrong moment in the loop. |
| **Self-invoked Skill tool** | Agent decides to call `should-close-session` skill mid-turn | Skill body executed inline; agent reads result | Full agent context (transcript, todo list, files read) | Burns tokens loading SKILL.md every time the agent considers it. Relies on agent remembering — exactly the failure mode the user wants to eliminate. | Reject as the *trigger* mechanism. Keep the SKILL.md as the *response* manual the hook points to. |
| **CLI command + cron / `loop` skill** | Wall-clock interval | Push notification or stderr; can't inject into a specific session's context | No knowledge of which session is active; reads repo state only | Fires whether or not a session is running. Cross-session noise. Can't see scratchpads tied to *this* session reliably. | Reject. Wrong axis (time vs. turn). |
| **Slash command** (`/should-close`) | User types it | Standard skill invocation | Full agent context | Useless for *proactive* suggestion — by the time the user thinks to type it, the skill has failed its purpose. | Reject as primary, but cheap to ship as a backup `Skill` invocation for explicit checks. |
| **SessionStart hook** | Session open / clear / compact | `additionalContext` once at start | Same FS access | Wrong direction — fires at the *start* of a session, not when it should end. Could pre-load a counter file but that's all. | Reject as trigger. Possibly use to reset a per-session state file. |
| **PostToolUse hook on Write/Edit** | Every file write | `additionalContext` | Tool input/output + FS | Fires far too often (every edit). Would need its own debounce. Stop already debounces naturally to once per turn. | Reject. Stop dominates it. |
| **PreCompact hook** | Just before context compaction | `additionalContext` to the compaction prompt | FS access | Useful as a *secondary* trigger — compaction is a strong signal the session has run long. Cheap to add alongside Stop. | Accept as secondary. |

## Chosen form factor

**Stop hook, with PreCompact as a secondary trigger, and a co-located SKILL.md that defines the response contract.**

Grounding from the harness:

- `/Users/victorboscaro/.claude/settings.json` lines 1444–1471 already wires `PreToolUse` and `PostToolUse` hooks for GitNexus using the same `command` form and the same `hookSpecificOutput` JSON protocol. So Stop hooks are a known-good pattern in this user's environment, and the response shape is established: `console.log(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext: "..." } }))`. See `/Users/victorboscaro/.claude/hooks/gitnexus/gitnexus-hook.cjs` lines ~210–225 (`sendHookResponse`).
- `/Users/victorboscaro/football-stats-oracle/.claude/settings.json` currently has *no* `hooks` block (only `permissions`). The project is a clean canvas — we own the Stop slot if we add it. No collision with existing hooks.
- `/Users/victorboscaro/.claude/plugins/superpowers/hooks/hooks.json` demonstrates that plugin-level hooks coexist with user-level hooks under separate `hooks` blocks; the harness merges them. So a *project-level* Stop hook in `football-stats-oracle/.claude/settings.json` does not interfere with the superpowers SessionStart hook, nor with the global GitNexus PreToolUse/PostToolUse hooks. No coordination needed.
- The `update-config` skill is the canonical mechanism for editing `settings.json` and confirms that "automated behaviors — *whenever X*" are hook-shaped, not memory-shaped. The phrasing of the request ("watches a running session, signals when to invoke close-session") is exactly the hook-shaped contract.

Justification against the four criteria:

- **(a) Solo-dev maintenance burden.** One shell script (~50 lines of bash/node) + one settings.json stanza + one SKILL.md. No daemon, no cron, no service. The check is `git status --porcelain | wc -l` plus `ls .claude/current_conversations/*.md 2>/dev/null | wc -l` plus a turn counter in a tmpfile. Fits in a coffee break. Solo dev can read the whole thing in one screen.
- **(b) Signal-to-noise.** Stop fires every turn, but the hook *emits nothing* unless thresholds cross. The user (and the agent) only see output when the recommender thinks closing is due. Compare a Skill-tool form factor where the agent burns tokens evaluating whether to consider the skill every turn even when no signal exists — Stop hooks are strictly cheaper at quiet times.
- **(c) Surfacing output.** `additionalContext` lands in the agent's next-turn context as a system message. The agent can then act (self-invoke `/close-session`) or, more importantly, the agent's response naturally includes a visible line for the user because the nudge says so. We do *not* need the hook to print directly to the user terminal (which Stop hooks can also do via stderr, but is jarring). The agent-mediated surface is the right one for a *suggestion*.
- **(d) State access.** The hook reads `git status`, scratchpad file count + line counts, and a tiny `~/.claude/state/football-stats-oracle.turn-count` counter it maintains itself. The hook's stdin includes `transcript_path` (per the hook protocol — visible in how the GitNexus hook receives `input.cwd`, `input.tool_name`, etc.), so if we ever need transcript-level signals we can `wc -l` or grep the JSONL. No need for live conversation introspection.

## Integration contract with close-session

The hook fires after every assistant turn. Its decision tree:

1. **Gate.** If none of the conditions in Lens 01 (signals) crosses threshold, emit nothing. Exit 0. Total cost: a few `stat` calls.
2. **Single-fire per session.** Maintain `.claude/current_conversations/.should-close-fired` (a zero-byte sentinel). If present, exit 0. Prevents nagging on every Stop after the first nudge.
3. **Fire.** Write the sentinel, then emit:
   ```json
   {"hookSpecificOutput": {"hookEventName": "Stop", "additionalContext": "should-close-session: signals crossed [<reason tokens>]. Per the should-close-session skill, surface a single user-visible line offering to run /close-session. Do not auto-invoke."}}
   ```
4. **Agent sees the additionalContext on the next turn.** The co-located SKILL.md (`football-stats-oracle/.claude/skills/should-close-session/SKILL.md`) defines exactly one rule: when this additionalContext arrives, the agent's next response ends with one line: *"Heads up: this session looks ready to close (<reason>). Run `/close-session` when you're at a stopping point."* Nothing else. No auto-stage, no scratchpad edits, no preemptive `git status`. The skill is a *speech act*, not a workflow.
5. **`/close-session` runs unmodified.** It already does Step 0 triage (scratchpad check, semantic question, activity check). The should-close-session skill makes *no* preparation that close-session would have to undo. Cleanest possible contract: should-close-session emits a sentence, close-session does the work. The sibling SKILL.md at `/Users/victorboscaro/domainspec/vault/discovery/close-session-redesign/proposal/SKILL.md` is unchanged.
6. **Sentinel cleanup.** `close-session`'s existing "delete the scratchpad" step is extended by one line to also delete `.should-close-fired` if present. (Alternatively: the sentinel lives in `.claude/current_conversations/` so it dies with the scratchpads naturally. Prefer this — zero coupling.)
7. **User ignores nudge.** Sentinel suppresses re-fire. No second nudge this session. If they want one, they delete the sentinel or start a new session.

The contract is deliberately thin. The hook does not stage commits, does not pre-write frontmatter, does not call `/close-session`. Every one of those would create a "skill A did half of skill B's job" coupling that breaks the moment close-session's contract changes.

## Failure modes

Honest about what this form factor *cannot* do:

- **Hook output suppression.** If a future Claude Code release tightens what Stop hooks can inject (or if the user runs a CLI version that drops `additionalContext` from Stop), the nudge silently disappears. Mitigation: also write the reason string to `.claude/current_conversations/.should-close-reason` so a human grep finds it. The skill stays useful as a passive log even with the surface broken.
- **First-install empty state.** On the very first turn of the very first session after install, the turn counter file doesn't exist and git might be clean. The check sees "no signal" and emits nothing. Correct behavior. No special bootstrapping needed. The counter file is created the first time any signal-relevant condition would update it.
- **User ignores the nudge N times in a row.** Sentinel means there *is no* second nudge in the same session. Across sessions, the next session starts fresh and the recommender may fire again. There is no escalation, no "you really should close this" — by design. Repeated nudges in one session is the failure mode this lens is built to avoid. If the user habitually ignores nudges, the right fix is tightening the signals (Lens 01), not louder nudges.
- **Hook latency.** Stop hooks block the turn-end. A slow `git status` in a huge repo would noticeably delay the agent's "done" state. Mitigation: hard timeout in the script (e.g. `timeout 2 git status --porcelain`); if it times out, emit nothing. Better silent than slow.
- **Cross-project pollution.** The hook is in *project* settings, not user settings, so it only fires when Claude Code is launched with cwd inside `football-stats-oracle/`. If the user opens a subshell that drifts cwd elsewhere mid-session, the hook may stop firing — acceptable, since "the session is no longer about football-stats-oracle" is itself a reasonable close signal.
- **Sentinel orphans.** If `/close-session` exits via `CLOSE_DEFERRED` or `MULTIPLE_SCRATCHPADS`, the scratchpad is preserved by design — and so is the sentinel, suppressing future nudges. This is actually desirable: the user has been told once, and the deferred close is a known state.
- **Hook can't see conversation content.** Signals that require reading the transcript (e.g. "the agent said 'we're done' three times") are out of reach unless the script parses the JSONL transcript at `transcript_path` itself. That's possible but expensive. Lens 01 should prefer signals visible from the filesystem.
- **No surface to the user if the agent doesn't respond.** If the user has just sent a turn and the assistant is mid-response, the Stop hook fires *after* the response is rendered. The `additionalContext` lands in the *next* turn — meaning the user has to send one more message before they see the nudge. Acceptable, since the nudge is about session shape, not about an emergency. A direct-to-user stderr path exists but creates a jarring out-of-band message; not worth it.

## Open Questions

- Does Claude Code's Stop hook accept `additionalContext` the same way PostToolUse does, or only `decision`/`stopReason`? The GitNexus hook only demonstrates Pre/PostToolUse. Worth a 5-minute spike with a no-op Stop hook that emits a known string and inspecting the next turn's context. If `additionalContext` is rejected at Stop, fall back to writing the reason to a file the *agent* is taught to read via SKILL.md on session start.
- Should the sentinel be per-session (dies with scratchpad) or per-day (dies at midnight)? Per-session is cleaner; per-day would suppress nudges across sessions on a single workday. Per-session is the default; revisit if the user reports same-day re-nudge noise.
- Is there a `Notification` or `PreCompact` hook surface in this Claude Code version that gives a *more user-visible* nudge than `additionalContext`? Worth checking the harness changelog. If `Notification` posts a system notification, it might be the right secondary surface for the "you've been at this 4 hours" signal.
- Does the project-level `hooks` block fully merge with the global one in `~/.claude/settings.json`, or does either override the other for the same event? The plugin hooks coexisting with user hooks suggests merge, but worth confirming before shipping — a silently-overridden hook is worse than no hook.
- Should the SKILL.md be in `football-stats-oracle/.claude/skills/` (per-project, where folder-structure and close-session already live) or in `~/.claude/skills/` (user-global, reusable across projects)? Per-project for v1 — this skill's signals are tuned to this repo's vault shape. If a second project ever wants it, extract then.

## Connections

- `derives-from` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
