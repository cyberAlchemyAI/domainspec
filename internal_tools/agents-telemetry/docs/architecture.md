---
tags: [telemetry, agents, skills, hooks, architecture, claude-code, internal-tools]
node_type: conceptual
is_session: false
layer: architecture
nature: design
status: exploratory
version: 0.2.0
last_updated: 2026-05-12
---

# Architecture — agents & skills telemetry

## Status

Design hypothesis, not a decided architecture. This doc captures the proposal that the fan-out in [../features/claude-event-capture/research/research-strategy.md](../features/claude-event-capture/research/research-strategy.md) will stress-test. Synthesis (Phase 2 of that strategy) will produce `SCHEMA.md` and may revise this doc.

## Scope phasing

**Phase 1 (this iteration) — instrument domainspec from within domainspec.**
Hooks live in this repo's `.claude/settings.json`. Data lands in `internal_tools/agents-telemetry/data/events.db` (gitignored). Captures dispatches and skill invocations during work done in the domainspec repo. Three components, no install script, no global paths, no consumer concerns.

**Phase 2 (future) — extend to consumer repos that import domainspec.**
domainspec is a framework imported (as submodule) into consumer repos: `house_project`, `business-philosopher`, more to come. Eventually we want telemetry from those sessions too. That extension needs global paths (`~/.claude/telemetry/`), a global hook config, a Claude-side installer, and the `project` field as a load-bearing join key. **Not in scope now.** Documented at the bottom in [Phase 2 — cross-repo extension (future)](#phase-2--cross-repo-extension-future) so the design leaves room.

The rest of this doc describes Phase 1.

## What this doc covers

The mechanical shape of how telemetry is captured in Phase 1: where hooks live, where data lands, how telemetry is toggled on/off, how the callsign system works. Does **not** define the full event field list — that's `SCHEMA.md`'s job once the research-strategy synthesis runs.

## Constraint — opt-in, local-first

- Telemetry is off by default. Turning it on is a deliberate, recorded action.
- Data lives in this repo's gitignored data directory; nothing leaves the user's machine.
- Future cloud-shipping is a separate cycle, not part of this design.

## Three components (Phase 1)

### 1. Hook scripts

Location: `internal_tools/agents-telemetry/scripts/log.sh`. Responsibilities:
- Read tool-event JSON from stdin (Claude Code passes it there).
- Fast-path bail if telemetry disabled (`stat internal_tools/agents-telemetry/.enabled`, sub-millisecond when off).
- Filter: log only events whose `subagent_type` matches the domainspec catalog (prefixes `domainspec-*`, `gsd-*`, `mars-*`) or whose `skill` is in the domainspec skill catalog.
- Pick a random callsign from `internal_tools/agents-telemetry/canon.json`.
- Insert one row into `data/events.db`.
- Exit fast (sub-50ms target; sub-1ms when disabled).

### 2. Local store

SQLite at `internal_tools/agents-telemetry/data/events.db` (gitignored), WAL mode. Chosen over JSONL because:
- Parallel `Task` dispatches mean concurrent writers; SQLite WAL handles this natively.
- Queryable from day one without log-parsing tooling.
- A `shipped_at` column leaves room for future cloud-shipping without a schema break.
- File is local; can be deleted at any time.

`internal_tools/agents-telemetry/data/` is added to `.gitignore` when the directory is initialized.

### 3a. Empirically confirmed hook payload shape (2026-05-12)

From a live test, the actual JSON Claude Code passes to hook stdin:

**PreToolUse — parent Agent dispatch:**
```json
{
  "session_id": "845ad22b-...",
  "cwd": "/Users/.../domainspec",
  "permission_mode": "acceptEdits",
  "hook_event_name": "PreToolUse",
  "tool_name": "Agent",
  "tool_input": { "description": "...", "prompt": "...", "subagent_type": "general-purpose" },
  "tool_use_id": "toolu_..."
}
```

**PreToolUse — child tool call (inside subagent):**
```json
{
  "session_id": "845ad22b-...",
  "agent_id": "a0272365f299f578c",
  "agent_type": "general-purpose",
  "hook_event_name": "PreToolUse",
  "tool_name": "Read",
  "tool_input": { ... }
}
```

**PostToolUse — parent Agent response:**
```json
{
  "session_id": "845ad22b-...",
  "tool_name": "Agent",
  "tool_response": {
    "status": "completed",
    "agentId": "a0272365f299f578c",
    "agentType": "general-purpose",
    "content": [{ "type": "text", "text": "..." }],
    "totalDurationMs": 5042,
    "totalTokens": 21265,
    "totalToolUseCount": 1,
    "usage": { "input_tokens": 1, "cache_creation_input_tokens": 7269, "cache_read_input_tokens": 13986, "output_tokens": 9, ... },
    "toolStats": { "readCount": 1, "bashCount": 0, "editFileCount": 0, ... }
  },
  "duration_ms": 5046
}
```

Key discrepancy: the `Task` matcher in settings.json matches correctly, but the `tool_name` in the actual payload is `"Agent"`, not `"Task"`. Log scripts must match against `"Agent"`, not `"Task"`.

The PostToolUse payload is richer than anticipated — `totalDurationMs`, `totalTokens`, full cache breakdown, and `toolStats` are all available without any agent cooperation. The schema can harvest these for free.

### 3. Hook wiring

`.claude/settings.json` at the repo root. The hook command path is relative to the repo (Claude Code invokes hooks with the repo as cwd). Example:

```json
"hooks": {
  "PreToolUse": [
    { "matcher": "Task",  "hooks": [{"type": "command", "command": "internal_tools/agents-telemetry/scripts/log.sh pre task"}]},
    { "matcher": "Skill", "hooks": [{"type": "command", "command": "internal_tools/agents-telemetry/scripts/log.sh pre skill"}]}
  ],
  "PostToolUse": [
    { "matcher": "Task",  "hooks": [{"type": "command", "command": "internal_tools/agents-telemetry/scripts/log.sh post task"}]}
  ]
}
```

Why repo-local: in Phase 1 the only consumer of these hooks is this repo. The wiring is part of the codebase, version-controlled, no install step needed.

## Opt-in mechanism (Phase 1)

One marker file, one config file:
- `internal_tools/agents-telemetry/.enabled` — presence = on. Hook `stat`s this first; absent → exit in <1ms.
- `internal_tools/agents-telemetry/config.json` — `{capture_prompts: bool, ...}`. Read only when enabled.

Toggle off: `rm internal_tools/agents-telemetry/.enabled`. Toggle on: `touch internal_tools/agents-telemetry/.enabled`. Both files are gitignored.

No install script in Phase 1. The hook wiring is committed in `.claude/settings.json`; cloning the repo gets the hooks. Telemetry stays off until someone runs `touch .enabled`.

## Data flow

```
Claude Code session in /Users/.../domainspec
        │ user dispatches subagent or invokes skill
        ▼
.claude/settings.json hooks
  PreToolUse  matcher=Task   → internal_tools/agents-telemetry/scripts/log.sh pre task
  PostToolUse matcher=Task   → internal_tools/agents-telemetry/scripts/log.sh post task
  PreToolUse  matcher=Skill  → internal_tools/agents-telemetry/scripts/log.sh pre skill
        │
        ▼
log.sh
  stat internal_tools/agents-telemetry/.enabled || exit 0    # fast-path off
  read stdin JSON
  match agent/skill against domainspec catalog → skip if not ours
  callsign = pick_random(canon.json)
  INSERT INTO data/events.db (...)
        │
        ▼
internal_tools/agents-telemetry/data/events.db               # local, gitignored
```

## Event envelope (sketch — full schema in SCHEMA.md)

```json
{
  "ts": "2026-05-12T14:03:11Z",
  "session_id": "claude-session-uuid",
  "project": "domainspec",
  "event": "dispatch.start | dispatch.end | skill.start",
  "tool": "Task | Skill",
  "agent_name": "domainspec-spec-writer",
  "callsign": "Christopher Alexander-7f3a",
  "purpose": "discovery",
  "prompt_sha256": "...",
  "prompt_chars": 1842
}
```

`agent_name` carries mechanical identity; `callsign` is the human-readable per-dispatch tag. `project` is a constant `"domainspec"` in Phase 1 — kept in the envelope so Phase 2 doesn't require a schema break.

## Callsign — random pick from canon

- `internal_tools/agents-telemetry/canon.json` lists thinkers from the project's intellectual canon (source: [../../../../business-philosopher/discovery/persona.md](../../../../business-philosopher/discovery/persona.md)): Donella Meadows, Karl Popper, Nassim Taleb, Daniel Kahneman, Richard Thaler, Cass Sunstein, Eliyahu Goldratt, Douglas Hofstadter, Sönke Ahrens, Daron Acemoglu, Christopher Alexander.
- Format: `<FirstName> <LastName>-<4hex>` (hex from session_id + dispatch index).
- Random pick per dispatch; repeats allowed.
- Callsign is **flavor**, not identity. Logs stay queryable by `agent_name` and `tool`.
- Canon expansion requires explicit user approval.

## Real risks

1. **Hook latency.** Every tool call blocks on log.sh. Shell cold-start is ~5–10ms on macOS. Mitigations: sub-1ms fast-path bail when disabled, batch writes (later), compiled binary (later). For v1: shell is fine; measure before optimizing.
2. **Catalog drift.** Hook filter is by name prefix today. New families need an update. Promote to `internal_tools/agents-telemetry/catalog.json` so the prefix list is data, not code.
3. **Parent ↔ child session correlation.** ~~Unverified.~~ **Empirically confirmed (2026-05-12).** All events — parent and child tool calls — share the same `session_id`. No `parent_session_id` field exists. Child tool calls carry two extra fields absent on parent calls: `agent_id` (unique per dispatch) and `agent_type`. The parent's PostToolUse response carries a matching `agentId` inside `tool_response`. Correlation: filter events by `agent_id` = the value in `tool_response.agentId` of the parent's PostToolUse. Schema consequence: add `agent_id` as a nullable column; null = parent-context event, non-null = child event.
4. **Implicit skill auto-loads.** Some skills load via `<system-reminder>` injection at session start. Whether that path fires the `Skill` PreToolUse hook is **unverified — must test in a fresh session.** Mid-session test was inconclusive (hook wired after auto-loads had already run).
5. **Privacy stance.** Default: no prompt text, only `prompt_sha256` + length. Capture only if `TELEMETRY_CAPTURE_PROMPTS=1` set in the session.

## Open questions (Phase 1)

1. **Catalog as prefix list or explicit name allowlist.** Prefix list (`domainspec-`, `gsd-`, `mars-`) is cheaper but couples to naming convention. Explicit allowlist is more maintainable but needs an update on every new agent. Probably prefix list with explicit overrides.
2. **Commit `.claude/settings.json` with hooks already wired, or keep wiring opt-in?** If committed, every clone gets the hook config (but stays off until `.enabled` exists). If opt-in, the wiring is a separate step. Committed is simpler — the marker file is the real on/off. Lean committed.
3. **PostToolUse on Skill** — capture or skip? `duration_ms` is meaningless for a context injection. Probably skip; only Pre is informative for skills.

## Non-goals (Phase 1)

- Full event field list — `SCHEMA.md`, produced by the fan-out synthesis.
- Cloud-ship schema, endpoint design, auth — separate cycle once local capture is real.
- Cross-repo / consumer-repo capture — Phase 2 (see below).
- Copilot (`.github/agents/*`) capture — separate feature, deferred.
- IDE-chat agent-mode capture — depends on hook-coverage test.
- Hook implementation code — after schema synthesis.

## Phase 2 — cross-repo extension (future)

When telemetry needs to capture sessions in consumer repos (`house_project`, `business-philosopher`, future), the following changes from Phase 1:

- **Data path becomes global**: `~/.claude/telemetry/events.db`. One store per user, not one per consumer. The `project` field becomes a load-bearing join key (no longer a constant).
- **Hook wiring becomes global**: `~/.claude/settings.json` so the hooks follow the user across consumer repos.
- **Install script appears**: `domainspec/install/claude.sh` — idempotent, copies scripts and canon to `~/.claude/telemetry/`, merges hook entries into `~/.claude/settings.json`, prompts for opt-in.
- **Per-consumer opt-out**: `.domainspec/telemetry-opt-out` file in a consumer repo (hook checks during project detection).
- **`project` detection**: from `cwd` via `git rev-parse --show-toplevel | xargs basename`, with `.domainspec/project.json` override.

The Phase 1 design is forward-compatible: the event envelope already carries `project`, the SQLite schema is the same, only the data path and hook scope change. The Phase 1 → Phase 2 migration is a copy-database + reconfigure step, not a redesign.

## Related

- [../README.md](../README.md) — telemetry intent and navigation.
- [../features/claude-event-capture/README.md](../features/claude-event-capture/README.md) — active feature.
- [../features/claude-event-capture/research/research-strategy.md](../features/claude-event-capture/research/research-strategy.md) — fan-out to stress-test this design.
- [../../../../business-philosopher/discovery/persona.md](../../../../business-philosopher/discovery/persona.md) — source of the thinker canon.
- [../../../.claude/skills/custom/frontmatter.md](../../../.claude/skills/custom/frontmatter.md) — frontmatter schema this doc follows.
