---
tags: [data-backend, newspaper, backlog]
node_type: backlog
is_session: false
layer: architecture
nature: procedural
status: draft
version: 1.0.0
last_updated: 2026-03-25
---

# Backlog: Data Backend

This is the task backlog for the Data Backend agent. It prioritizes the evolutionary tasks required for this domain within the Gödel Machine.

## Backlog Categories

# New Features
---
## [2026-03-25] [P0] — Map Atomic Votes to Specific Genetic Traits — ❌ NOT DONE

**Context:**
`telemetry_db.json` currently logs votes by generation ID, but Darwin needs votes mapped to *specific traits* (Editorial Density, Topology, etc.). Without this, Darwin cannot calculate per-trait fitness.

**What needs to be done:**
- Ensure `telemetry_db.json` schema records which trait was being evaluated when a vote was cast.
- When the Editor adds `Form`, `Tone`, `Structure` to the payload, record which text variant was rendered at vote time.
- Coordinate with Darwin-Gödel to validate the schema meets analytical needs.

**Affected files:**
- `specs/newspaper/evolution/telemetry_db.json`
- `specs/newspaper/evolution/evolution_server.py`

---
## [2026-03-25] [P1] — Co-Create `generations_manifest.json` — ❌ NOT DONE

**Context:**
Co-owned with Darwin-Gödel. 14 generations exist with no persistent metadata.

**What needs to be done:**
- Build the JSON schema and storage mechanism.
- Ensure `evolution_server.py` can serve and update the manifest.

**Affected files:**
- `specs/newspaper/evolution/generations_manifest.json` (new)
- `specs/newspaper/evolution/evolution_server.py`

---
## [2026-03-25] [P1] — Route Real Editor Payload via HTTP — ❌ NOT DONE

**Context:**
Once the Editor-in-Chief produces a real `daily_payload.json`, the backend must serve it to `window.currentPayload` via `evolution_server.py`.

**What needs to be done:**
- Add a route in `evolution_server.py` to serve the JSON payload dynamically for `?day=YYYY-MM-DD`.
- Handle payload size growth (the Operator wants significantly heavier payloads).

**Affected files:**
- `specs/newspaper/evolution/evolution_server.py`

---
## [2026-03-25] [HIGH] — Define Initial Roadmap — ❌ NOT DONE

**Context:**
The backlog has just been initialized per the System Operator's instructions. A formal roadmap is required.

**What needs to be done:**
- Review the agent manifesto.
- Extract any pending tasks.
- Define success criteria.

**Affected files:**
- `specs/newspaper/agents/data_backend/manifesto.md`
- `specs/newspaper/agents/data_backend/newsletter.md`

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
