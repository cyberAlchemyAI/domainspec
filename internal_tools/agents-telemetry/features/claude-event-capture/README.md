---
tags: [telemetry, claude-code, hooks, feature, internal-tools]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: exploratory
version: 0.1.0
last_updated: 2026-05-12
---

# claude-event-capture

## Status

Discovery — design proposal exists in [../../docs/architecture.md](../../docs/architecture.md); fan-out research strategy ready to dispatch; no implementation yet.

## Scope

**Phase 1 (current):** Capture structured events for every domainspec agent dispatch and skill invocation in Claude Code sessions **within the domainspec repo itself**. Mechanism: Pre/Post hooks on the `Task` and `Skill` tools, wired in this repo's `.claude/settings.json`. Data: SQLite at `internal_tools/agents-telemetry/data/events.db` (gitignored). Opt-in: explicit, via a marker file (`internal_tools/agents-telemetry/.enabled`).

Extension to consumer repos that import domainspec is **Phase 2** — see [docs/architecture.md → Phase 2](../../docs/architecture.md#phase-2--cross-repo-extension-future).

## Out of scope (this feature, Phase 1)

- Capture in consumer repos that import domainspec (`house_project`, `business-philosopher`, …) — Phase 2.
- Copilot custom agent capture — deferred to a future `features/copilot-event-capture/`.
- IDE-chat agent-mode capture (Copilot inside VS Code chat) — depends on hook-coverage test; not addressed here.
- Cloud shipping — separate cycle once local capture is real.

## Navigation

- **research/** — research artifacts driving the schema.
  - [research/research-strategy.md](research/research-strategy.md) — fan-out plan: A typology, B supply, C demand, D gap-critic, E hoarding-critic.
  - `research/domainspec-research.md` *(produced when fan-out runs)*.
  - `research/domainspec-findings.md` *(produced when fan-out runs)*.

## Related

- [../../README.md](../../README.md) — parent telemetry intent doc.
- [../../docs/architecture.md](../../docs/architecture.md) — design proposal this feature implements.
- [../../../../.claude/skills/custom/frontmatter.md](../../../../.claude/skills/custom/frontmatter.md) — frontmatter schema this doc follows.
