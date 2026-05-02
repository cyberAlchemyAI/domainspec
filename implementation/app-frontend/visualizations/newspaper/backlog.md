---
tags: [newspaper, orchestrator, backlog]
node_type: backlog
is_session: false
layer: architecture
nature: procedural
status: active
version: 1.0.0
last_updated: 2026-03-25
---

# Backlog: O Grafo Diário — General (Cross-Agent)

This is the system-level backlog for the Gödel Machine ecosystem. Tasks here are either cross-cutting (require multiple agents) or owned by the Orchestrator. Agent-specific tasks live in each agent's `backlog.md`.

## Backlog Categories

# Critical Path — Closing the Evolutionary Loop
---
## [2026-03-25] [P0] — Close the Evolutionary Loop End-to-End — ❌ NOT DONE

**Context:**
The full evolutionary cycle has been architecturally designed but never executed. No JSON Mutation Request has been produced, no real vault data has been injected, and all generations were hand-built on aesthetic intuition rather than Darwin's math.

**What needs to be done (multi-agent):**
1. **Editor-in-Chief:** Build the real vault-to-JSON extraction pipeline in `editor_agent_scaffold.py`. Output a real `daily_payload.json`.
2. **Data & Backend:** Ensure `evolution_server.py` routes the real payload to `window.currentPayload` and that `telemetry_db.json` maps votes to specific traits.
3. **Darwin-Gödel:** Ingest telemetry, calculate trait weights, and produce the **first real JSON Mutation Request**.
4. **UI Evolution:** Build `gen_015` strictly from the Mutation Request — not from vibes.
5. **Platform Architect:** Display the Mutation Request and resulting fitness delta in the Matrix dashboard.

**Success criteria:** A generation exists whose traits were calculated by the Darwin engine and whose fitness score is tracked in persistent telemetry.

---
## [2026-03-25] [P1] — Create `generations_manifest.json` — ❌ NOT DONE

**Context:**
There are 14 `gen_*.html` files and 6 mockups but no metadata file recording what traits each generation expresses, what mutation request produced it, or its final fitness score.

**What needs to be done:**
- Define a JSON schema mapping each generation to: traits expressed, mutation request (if any), creation date, exploit/explore flag, cumulative fitness score.
- Retrospectively populate for existing generations (traits will be approximate for hand-built gens).
- Darwin-Gödel and Backend own this artifact going forward.

**Affected files:**
- `specs/newspaper/evolution/generations_manifest.json` (new)

# Architectural Resilience & Robustness
---
## [2026-03-25] [P2] — Modularize `index.html` (93KB) — ❌ NOT DONE

**Context:**
The Genetic Platform dashboard is a single monolithic HTML file approaching 100KB. All JS logic (Matrix rendering, telemetry, modals, iframe management) lives inline.

**What needs to be done:**
- Extract JS into separate modules (`matrix.js`, `telemetry.js`, `modals.js`).
- Extract CSS into `platform.css`.
- Platform Architect owns this.

**Affected files:**
- `specs/newspaper/evolution/index.html`

---
## [2026-03-25] [P2] — Formalize Exploit vs Explore Protocol — ❌ NOT DONE

**Context:**
The dual-engine strategy (programmatic CSS for Exploit, agentic code generation for Explore) was agreed in info-exchange but never implemented as an enforced protocol.

**What needs to be done:**
- Define when Darwin issues an Exploit vs Explore mutation request.
- Define the mechanical difference (CSS variable swap vs full file generation).
- Document in Darwin-Gödel manifesto and UI Evolution manifesto.

# Technical Debt & Refactoring
---
## [2026-03-25] [P3] — Decide on `newsletter.md` Files — ❌ NOT DONE

**Context:**
Every agent has a `newsletter.md` (629–1837 bytes). Nothing reads or renders them. They are orphaned artifacts.

**What needs to be done:**
- System Operator decides: are these meant to become agent-authored reports? If so, define a consumer. If not, prune them.

# Completed / Done
---
## [2026-03-25] — Orchestrator Documentation Restructure — ✅ DONE

**What was done:**
- Created `system-state.md` as the slim state dashboard.
- Archived `info-exchange.md` with a header redirect.
- Backfilled `evolution-wall.md` with 8 key decisions.
- Fixed stale path in `newspaper-communication-protocol.md`.
- Standardized manifesto paths to absolute.
- Moved `HANDOFF_CONTEXT.md` and `README_FRONTEND.md` to `docs/`.
