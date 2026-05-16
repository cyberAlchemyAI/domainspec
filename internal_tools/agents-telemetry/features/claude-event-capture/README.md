---
tags: [telemetry, claude-code, hooks, feature, internal-tools]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: exploratory
version: 0.2.0
last_updated: 2026-05-16
---

# claude-event-capture

## What is this?

The Phase 1 feature inside agents-telemetry that captures one row per domainspec agent dispatch and skill invocation via Claude Code `PreToolUse`/`PostToolUse` hooks on the `Agent` and `Skill` tools, writing to a local SQLite database.

## Business Context

This is the deterministic capture mechanism (Mechanism A) — Claude Code's hook system fires synchronously with every tool call, so no agent cooperation is required and capture is lossless. It is the active feature for Phase 1; a Copilot equivalent (Mechanism B, prompt-side self-report) is deferred.

## Why it matters

Mechanism A is the only path that produces trustworthy usage data without trusting the agent to self-report. Everything downstream — pruning, prioritization, tuning loops — depends on having a complete event log.

## 📁 Navigation

- **[research/research-strategy.md](research/research-strategy.md)** — fan-out plan: A typology, B supply, C demand, D gap-critic, E hoarding-critic. Drives the eventual `SCHEMA.md`.
- *(planned)* `research/domainspec-research.md` — produced when the fan-out runs.
- *(planned)* `research/domainspec-findings.md` — produced when the fan-out runs.

## Status

Scaffolded with working logger.

- `../../scripts/log.sh` — written, opt-in via `.enabled` marker, filters to domainspec catalog (`domainspec-*`, `gsd-*`, `mars-*` prefixes), harvests rich PostToolUse payload (duration, total tokens, cache breakdown, agent_id for parent/child correlation).
- `../../scripts/schema.sql` — WAL-mode SQLite, indices on `ts`, `session_id`, `agent_name`, `shipped_at`.
- Smoke-tested: 20 concurrent writes → 20 rows, no drops; non-matching tools (e.g. `Read`) filtered out correctly; POST events correctly correlate via `tool_response.agentId`.

Outstanding before this feature actually captures real sessions:

1. Wire hooks in `.claude/settings.json` (`PreToolUse`/`PostToolUse` matchers on `Agent` and `Skill`, command `internal_tools/agents-telemetry/scripts/log.sh`). Use `matcher: "Agent"` — not `"Task"` — per the empirical finding in architecture.md.
2. Address ~360 ms per-event latency (architecture target: sub-50 ms). Currently dominated by ~12 `jq` forks + `sqlite3` cold start per invocation.
3. Run the fan-out research and produce `SCHEMA.md`.

## Scope

**Phase 1 (current):** Capture structured events for every domainspec agent dispatch and skill invocation in Claude Code sessions **within the domainspec repo itself**. Mechanism: Pre/Post hooks on the `Agent` and `Skill` tools, wired in this repo's `.claude/settings.json`. Data: SQLite at `internal_tools/agents-telemetry/data/events.db` (gitignored). Opt-in: explicit, via a marker file (`internal_tools/agents-telemetry/.enabled`).

Extension to consumer repos that import domainspec is **Phase 2** — see [docs/architecture.md → Phase 2](../../docs/architecture.md#phase-2--cross-repo-extension-future).

## Out of scope (this feature, Phase 1)

- Capture in consumer repos that import domainspec (`house_project`, `business-philosopher`, …) — Phase 2.
- Copilot custom agent capture — deferred to a future `features/copilot-event-capture/`.
- IDE-chat agent-mode capture (Copilot inside VS Code chat) — depends on hook-coverage test; not addressed here.
- Cloud shipping — separate cycle once local capture is real.

## Related

- [../../README.md](../../README.md) — parent telemetry intent doc.
- [../../docs/architecture.md](../../docs/architecture.md) — design proposal this feature implements.
- [../../../../.claude/skills/custom/frontmatter.md](../../../../.claude/skills/custom/frontmatter.md) — frontmatter schema this doc follows.
