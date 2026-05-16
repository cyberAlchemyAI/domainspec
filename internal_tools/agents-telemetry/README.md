---
tags: [telemetry, agents, skills, hooks, observability, claude-code, copilot, internal-tools, cross-repo]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: exploratory
version: 0.3.0
last_updated: 2026-05-16
---

# `internal_tools/agents-telemetry/` — Subagent & Skill Telemetry

## What is this?

A local-first telemetry feature that captures one structured event per domainspec agent dispatch and skill invocation, writing to SQLite so usage of the agent/skill catalog can be measured rather than guessed.

## Business Context

domainspec ships ~44 hand-authored agents and ~113 skills. Catalog growth has outpaced our knowledge of what actually gets used in real sessions. This feature instruments the harness (Claude Code hooks on `Agent` and `Skill`) so every dispatch produces a row in a local database — no data leaves the user's machine until explicitly shipped.

## Why it matters

Without telemetry, the catalog is a set of intentions. With it, we can answer: which agents/skills get used, with what prompts, how often, and how long do they run? That visibility unblocks pruning, prioritization, and the eventual closed-loop tuning cycle.

## 📁 Navigation

- **[docs/architecture.md](docs/architecture.md)** — design proposal: cross-repo framing, components, data flow, opt-in mechanism, install path, callsigns, open questions.
- **[features/claude-event-capture/](features/claude-event-capture/)** — the active Phase 1 feature (Mechanism A).
- **[scripts/log.sh](scripts/log.sh)** — hook entry point. Reads PreToolUse/PostToolUse JSON from stdin, filters to domainspec catalog, inserts into SQLite.
- **[scripts/schema.sql](scripts/schema.sql)** — SQLite schema for `events.db`: WAL mode, agent_id correlation column, full token + cache breakdown, `shipped_at` for Phase 2.
- **[canon.json](canon.json)** — thinker list used to generate per-dispatch callsigns.
- **`data/`** *(gitignored)* — runtime location of `events.db`.

## Status

Phase 1 — scaffolded. SQLite logger written and smoke-tested (20 concurrent writes → 20 rows, no drops). Hooks are **not yet wired** in `.claude/settings.json`; until that's done, the script is dead code. Fan-out research that drives `SCHEMA.md` has not run yet.

## Scope phasing

**Phase 1 (current):** instrument domainspec from within domainspec. Hooks in this repo's `.claude/settings.json`; data in `internal_tools/agents-telemetry/data/events.db` (gitignored); opt-in via a marker file. Local-first, repo-scoped.

**Phase 2 (future):** extend to consumer repos that import domainspec (`house_project`, `business-philosopher`, …). Requires global data path, global hook config, a Claude-side install script, and the `project` field as a load-bearing join key. Forward-compatibility is preserved in the Phase 1 envelope so the migration is a reconfigure, not a redesign.

Design specifics live in [docs/architecture.md](docs/architecture.md).

## Two hosts, two mechanisms (different reliability)

The two hosts that consume domainspec agents expose different dispatch surfaces:

### Mechanism A — Claude Code: harness hook (deterministic)

`PreToolUse` and `PostToolUse` on the `Task` and `Skill` tools capture every dispatch and skill invocation. Lossless, no agent cooperation required, zero token cost. **This is the active feature** — see [features/claude-event-capture/](features/claude-event-capture/).

### Mechanism B — Copilot custom agents: prompt-side self-report (lossy)

The Copilot extension does not expose a `PreToolUse`-equivalent hook for dispatching custom agents we authored in `.github/agents/`. The dispatch is internal to the closed extension. The fallback is an MCP tool the agent must call ("agent agreed it was dispatched"), which is lossy and depends on the LLM obeying the instruction. **Deferred** — held in reserve as a future `features/copilot-event-capture/`. Revisit once Claude-side capture produces real data.

### Analysis discipline

When both mechanisms exist, do **not** sum events across `source: claude-code` and `source: copilot` and present the total as "agent dispatches." Different reliability. Always break out by `source` and `mechanism`.

## 📁 Navigation

- **[docs/architecture.md](docs/architecture.md)** — design proposal: cross-repo framing, components, data flow, opt-in mechanism, install path, callsigns, open questions.
- **[features/claude-event-capture/](features/claude-event-capture/)** — the active feature (Mechanism A).
  - **[features/claude-event-capture/research/research-strategy.md](features/claude-event-capture/research/research-strategy.md)** — fan-out plan to stress-test the architecture and produce `SCHEMA.md`.

## Related

- [../../.claude/README.md](../../.claude/README.md) — harness configuration overview; explains the existing `PreToolUse` hook pattern this builds on.
- [../../.claude/agents/](../../.claude/agents/) — Claude Code subagent catalog (active Mechanism A target set).
- [../../.github/agents/](../../.github/agents/) — Copilot custom agent catalog (deferred Mechanism B target set).
- [../../.claude/skills/](../../.claude/skills/) — Claude skills catalog (active Mechanism A target set, Claude-only).
- [../../.claude/skills/custom/frontmatter.md](../../.claude/skills/custom/frontmatter.md) — frontmatter schema this README follows.
