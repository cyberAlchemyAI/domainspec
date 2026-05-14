---
tags: [agents, architecture, infrastructure]
node_type: audit
is_session: true
layer: architecture
nature: technical
status: active
created: 2026-05-14
timestamp: 2026-05-14T00:00:00-03:00
expires: 2026-07-13
conversation_id: 845ad22b-2d49-4eb3-933c-390b92b8c456
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Closes the load-bearing parent↔child session correlation question that all subsequent telemetry schema work depends on."
---

# Agents Telemetry — Empirical Hook Test Closure & Schema Design

## Summary

This session continued the agents-telemetry work for domainspec. The primary deliverable was closing the empirical test for parent↔child session correlation: probe log confirmed all events share a single `session_id`, child events carry `agent_id`/`agent_type` fields absent on parent events, and the parent's PostToolUse response holds a matching `agentId` — no `parent_session_id` exists. The `docs/architecture.md` was updated with these findings plus two other confirmed facts: `tool_name` in hook payloads is `"Agent"` (not `"Task"` as the matcher label suggests), and the PostToolUse response is richer than anticipated (free `totalDurationMs`, `toolStats`, full cache breakdown). A schema design discussion affirmed SQLite over YAML, and proposed an envelope+payload pattern with shared typed columns and per-event-type JSON blobs. Skill auto-load hook coverage (Test 2) remains open — needs a fresh session.

## Files touched

- `internal_tools/agents-telemetry/docs/architecture.md`
- `internal_tools/agents-telemetry/features/claude-event-capture/README.md`
- `internal_tools/agents-telemetry/features/claude-event-capture/research/research-strategy.md`
- `internal_tools/agents-telemetry/canon.json`
- `internal_tools/agents-telemetry/README.md`
- `.claude/settings.json`
- `.gitignore`

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/agents-telemetry/docs/architecture.md` | `creates` | This session produced the architecture doc as a new file recording confirmed empirical findings. |
| `internal_tools/agents-telemetry/features/claude-event-capture/README.md` | `creates` | This session produced the claude-event-capture feature README as a new file. |
| `internal_tools/agents-telemetry/features/claude-event-capture/research/research-strategy.md` | `creates` | This session produced the research-strategy file as a new file. |
| `internal_tools/agents-telemetry/canon.json` | `creates` | This session produced the canon.json file as a new artifact. |
| `internal_tools/agents-telemetry/README.md` | `modifies` | This session updated the top-level telemetry README with findings from the empirical hook test closure. |
| `.claude/settings.json` | `modifies` | This session modified settings.json (hook configuration changes tied to the telemetry work). |
| `.gitignore` | `modifies` | This session modified .gitignore (telemetry data paths added). |
