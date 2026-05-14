---
tags: [telemetry, agents, skills, hooks, observability, internal-tools]
node_type: research
is_session: true
layer: architecture, application
nature: explanatory, procedural
status: active
created: 2026-05-12
timestamp: 2026-05-12T01:36:00-03:00
expires: 2026-07-11
conversation_id: agents-skills-telemetry-design-2026-05-12
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 4
importance_rationale: "Scoped a new telemetry tooling area and produced a research strategy, but made no final design decisions — value is directional, not load-bearing."
---

# Agents & Skills Telemetry Design

## Summary

Designed telemetry to track explicitly-authored agents (`.claude/agents/`, `.github/agents/`) and skills (`.claude/skills/`, `~/.claude/skills/`) across Claude Code and GitHub Copilot. Decided on two deterministic hook-based mechanisms — Claude `PreToolUse` for `Task` and `Skill` tools, Copilot `.github/hooks/*.json` for cloud agent and CLI — with in-IDE Copilot Chat coverage deferred to an empirical Phase 5 test. Produced a v0.1 README documenting intent and a v0.1 research strategy proposing a 5-agent fan-out (typology, payload audit, consumer questions, gap critic, hoarding critic) to design SCHEMA before any implementation. Two course corrections during the session: initially overclaimed Copilot lacks a hook surface (retracted after user surfaced GitHub's hooks doc), and added skills as first-class scope after user flagged that 126 skills also need telemetry.

## Files touched

- internal_tools/agents-telemetry/README.md
- internal_tools/agents-telemetry/research-strategy.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/agents-telemetry/README.md` | `creates` | New v0.1 README produced this session — did not exist before; documents the two-mechanism telemetry intent. |
| `internal_tools/agents-telemetry/research-strategy.md` | `creates` | New v0.1 research strategy produced this session — did not exist before; defines the 5-agent fan-out for SCHEMA design. |
