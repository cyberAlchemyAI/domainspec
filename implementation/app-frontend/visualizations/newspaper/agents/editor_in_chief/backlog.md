---
tags: [editor-in-chief, newspaper, backlog]
node_type: backlog
is_session: false
layer: architecture
nature: procedural
status: draft
version: 1.0.0
last_updated: 2026-03-25
---

# Backlog: Editor In Chief

This is the task backlog for the Editor In Chief agent. It prioritizes the evolutionary tasks required for this domain within the Gödel Machine.

## Backlog Categories

# New Features
---
## [2026-03-25] [P0] — Build the Real Vault-to-JSON Extraction Pipeline — ❌ NOT DONE

**Context:**
`editor_agent_scaffold.py` is a 2KB stub. All `currentPayload` data remains mocked. The newspaper has never displayed a real day's news. This is the single biggest blocker to closing the evolutionary loop.

**What needs to be done:**
- Build the LLM prompt layer that reads recent vault conversations, extracts relevance signals (importance, decisions, status transitions), and produces a real `daily_payload.json` matching the agreed News Object Schema.
- Output must explicitly declare `Form`, `Tone`, and `Structure` vectors so Darwin can map them to telemetry.
- Coordinate with the Data & Backend Agent for serving the payload via `evolution_server.py`.

**Affected files:**
- `specs/newspaper/evolution/editor_agent_scaffold.py`
- `specs/newspaper/evolution/daily_payload.json` (new)

---
## [2026-03-25] [HIGH] — Experiment with Higher Narrative Density — ❌ NOT DONE

**Context:**
The System Operator has mandated that the default fallback payload must provide "more complete news" with "more text" so they can actually read what happened without needing to explicitly vote. The Orchestrator has authorized the Editor-in-Chief to start testing new things.

**What needs to be done:**
- Increase the baseline verbosity and comprehensiveness of the generated text across all levels (`exec`, `tech`, `graph`).
- Experiment with new structural mappings or summary formats to deliver the highest possible density constraint.
- Ensure the `daily_payload.json` reflects these denser textual objects.

**Affected files:**
- `specs/newspaper/agents/editor_in_chief/manifesto.md`
- `editor_agent_scaffold.py` (when implementing)

## [2026-03-25] [HIGH] — Define Initial Roadmap — ❌ NOT DONE

**Context:**
The backlog has just been initialized per the System Operator's instructions. A formal roadmap is required.

**What needs to be done:**
- Review the agent manifesto.
- Extract any pending tasks.
- Define success criteria.

**Affected files:**
- `specs/newspaper/agents/editor_in_chief/manifesto.md`
- `specs/newspaper/agents/editor_in_chief/newsletter.md`

# User Experience (UX)
---

# Architectural Resilience & Robustness
---

# Bug Fixes & Correctness
---

# Technical Debt & Refactoring
---

# Completed / Done
---
