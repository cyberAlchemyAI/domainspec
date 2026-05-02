---
tags: [platform-architect, newspaper, backlog]
node_type: backlog
is_session: false
layer: architecture
nature: procedural
status: draft
version: 1.0.0
last_updated: 2026-03-25
---

# Backlog: Platform Architect

This is the task backlog for the Platform Architect agent. It prioritizes the evolutionary tasks required for this domain within the Gödel Machine.

## Backlog Categories

# New Features
---
## [2026-03-25] [HIGH] — Define Initial Roadmap — ❌ NOT DONE

**Context:**
The backlog has just been initialized per the System Operator's instructions. A formal roadmap is required.

**What needs to be done:**
- Review the agent manifesto.
- Extract any pending tasks.
- Define success criteria.

**Affected files:**
- `specs/newspaper/agents/platform_architect/manifesto.md`
- `specs/newspaper/agents/platform_architect/newsletter.md`

# User Experience (UX)
---
## [2026-03-25] [P1] — Display Mutation Requests in the Matrix Dashboard — ❌ NOT DONE

**Context:**
When Darwin-Gödel produces its first JSON Mutation Request, the Platform must display it alongside the resulting generation's fitness delta. Currently the Matrix only shows vote counts.

**What needs to be done:**
- Add a "Mutation Source" column or detail view to the Matrix grid.
- Show the JSON Mutation Request that produced each generation (if any; hand-built gens show "Manual").
- Display fitness delta (before/after) when available.

**Affected files:**
- `specs/newspaper/evolution/index.html`

# Architectural Resilience & Robustness
---
## [2026-03-25] [P2] — Modularize `index.html` (93KB) — ❌ NOT DONE

**Context:**
The Genetic Platform is a single monolithic 93KB HTML file. All JS (Matrix rendering, telemetry, modals, iframe management) and CSS lives inline. This will become unmaintainable.

**What needs to be done:**
- Extract JS into separate modules (`matrix.js`, `telemetry.js`, `modals.js`).
- Extract CSS into `platform.css`.
- Ensure `evolution_server.py` serves these new static files correctly.

**Affected files:**
- `specs/newspaper/evolution/index.html`
- `specs/newspaper/evolution/matrix.js` (new)
- `specs/newspaper/evolution/telemetry.js` (new)
- `specs/newspaper/evolution/platform.css` (new)

# Bug Fixes & Correctness
---

# Technical Debt & Refactoring
---
## [2026-03-25] [HIGH] — Vote Standardization Migration (Receiver Side) — ❌ NOT DONE

**Context:**
The UI Evolution agent is standardizing all templates to emit Protocol v1.0.0 `{ metric_name, score, comment }`. While `registerAtomicVote()` already handles this, the telemetry dashboard uses fuzzy 4-bucket grouping instead of the 8 canonical protocol metrics. 

**What needs to be done:**
- Refactor `renderTelemetry()` to use the 8 canonical `metric_name` values directly instead of fuzzy matching (`Topology`, `Density`, `Entropy`, `Mechanics`).
- Fix the hardcoded "UPVOTE PLATFORM" button in the matrix to use Protocol v1.0.0 (`{ metric_name: 'interaction_mechanics', score: 4 }` instead of `{ component, sentiment }`).

**Affected files:**
- `specs/newspaper/evolution/index.html`

---
## [2026-03-25] [P3] — Log Tooltip Invocation Counts to Backend — ❌ NOT DONE

**Context:**
Darwin-Gödel requires raw data on whether `[data-tooltip]` context-overlays are actively used or ignored. Currently tooltips render but don't log any telemetry.

**What needs to be done:**
- Instrument tooltip hover events to call a lightweight telemetry endpoint.
- Backend must store these events for Darwin to analyze.

**Affected files:**
- `specs/newspaper/evolution/index.html`
- `specs/newspaper/evolution/evolution_server.py`

# Completed / Done
---
## [2026-03-25] [HIGH] — Evolution Wall Drawer UI — ✅ DONE
**What was done:**
Implemented the right-side hover catalog in `index.html` to parse and display the Orchestrator's `evolution-wall.md` directly within the platform.
