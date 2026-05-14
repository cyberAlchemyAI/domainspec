---
tags: [telemetry, agents, skills, hooks, observability, claude-code, copilot, internal-tools, cross-repo]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: exploratory
version: 0.2.0
last_updated: 2026-05-12
---

# `internal_tools/agents-telemetry/` — Subagent & Skill Telemetry

## Objective

Capture a structured event every time an agent or skill authored as part of **domainspec** is dispatched or invoked. Phase 1 instruments the domainspec repo itself; Phase 2 (future) extends to consumer repos. Answers: "which of our agents and skills actually get used, with what prompts, how often, and how long do they run?"

## Why this exists

domainspec ships ~44 hand-authored agents and ~113 skills. We currently have **no idea** which actually get invoked, which sit unused, which run silently to failure. Telemetry turns the catalog from a set of intentions into a measurable surface — on the user's own machine, opt-in, no data leaves until explicitly shipped.

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
