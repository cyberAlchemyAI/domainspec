---
description: The absolute source of truth for HOW, WHERE, and WITH WHOM each agent communicates.
tags: [architecture, agents, contracts, protocol]
---

# Agent Data Contracts & Patterns

**AGENTS:** This document is your operational cheat sheet. It defines your exact Inputs (what you read), Outputs (what you write), and Communication Patterns (how you talk to other agents). **You must never violate these boundaries.**

---

## 1. Orchestrator (Context Router)
- **Role:** Controls the ecosystem state, enforces rules, and manages context flow.
- **Reads From:** 
  - `info-exchange.md` (to monitor other agents' SYNC requests).
- **Writes To:** 
  - `info-exchange.md` (to issue cross-agent SYNC commands).
  - `system-state.md` (to update the live architectural dashboard).
  - `evolution-wall.md` (to permanently log finalized decisions).
- **Communication Pattern:** Periodically executes the **Condensation Protocol**: sweeping noisy logs from `info-exchange.md` into the official history (`evolution-wall.md`) to keep the system lean.

## 2. Editor-in-Chief
- **Role:** Generates the raw newspaper content and ontology payloads.
- **Reads From:** 
  - `docs/vault/` (to extract ZefraHub business logic and ontology).
  - `system-state.md` (to know the current Epoch and context).
- **Writes To:** 
  - `specs/newspaper/evolution/daily_payload.json` (the exact News Object Schema).
- **Communication Pattern:** Drops the JSON payload, then appends a `## SYNC:` block in `info-exchange.md` notifying all agents that new editorial content is ready for consumption.

## 3. UI Evolution Agent
- **Role:** Builds visual interfaces (HTML/CSS templates) that mutate based on evolutionary pressure.
- **Reads From:** 
  - `/api/payload` or `daily_payload.json` (to inject text into templates).
  - `mutation_request.json` (to know which traits to mutate next).
- **Writes To:** 
  - `specs/newspaper/evolution/gen_XXX_YYY.html` (the newly built template code).
- **Communication Pattern:** Strictly implements the 8-axis Atomic Voting metrics into the HTML. Once a template is built, issues a `## SYNC:` in `info-exchange.md` notifying the Platform Architect to add the new file to the manifest.

## 4. Platform Architect
- **Role:** Owns the Matrix Dashboard (`index.html`) and frontend data infrastructure.
- **Reads From:** 
  - `/api/manifest` (to render the Matrix generation list).
  - `gen_XXX.html` (via iframe rendering).
- **Writes To:** 
  - `index.html` (updating Matrix frontend code).
  - `generations_manifest.json` (registering new UI templates so they appear on the dashboard).
- **Communication Pattern:** Listens to `info-exchange.md` for new templates created by the UI Agent. Updates the manifest and ensures `registerAtomicVote()` accurately routes clicks from the iframe to the Backend.

## 5. Data & Backend Engineer
- **Role:** Ensures data persistence, API routing, and telemetry integrity.
- **Reads From:** 
  - Incoming `POST /api/vote` requests triggered by the Matrix.
- **Writes To:** 
  - `telemetry_db.json` (saving the votes permanently).
  - `evolution_server.py` (updating backend logic).
- **Communication Pattern:** Acts as the strict data bridge. Guarantees 0 data loss. Never makes UI or editorial decisions. Responds to architectural blockers in `info-exchange.md`.

## 6. Darwin-Gödel Engine (The Mathematician)
- **Role:** Calculates fitness and decides the mathematical parameters for next genetic mutations.
- **Reads From:** 
  - `GET /api/telemetry` (pulls all user votes).
- **Writes To:** 
  - `specs/newspaper/evolution/mutation_request.json` (the mathematical blueprint for the UI Evolution Agent).
- **Communication Pattern:** Consumes telemetry quietly. Only speaks when generating a new `mutation_request.json`. Post a `## SYNC:` to `info-exchange.md` commanding the UI Evolution Agent to execute the new mutation blueprint.

---

## ⚡ The 3 Golden Rules of ZefraHub Agent Exchange

1. **Stay in your lane:** If you need telemetry, ask the Backend. If you need text, read the Payload. Never modify files outside your explicit "Writes To" list without Operator permission.
2. **Never communicate outside `info-exchange.md`:** All inter-agent requests, status updates, and task handoffs must be logged as a `## SYNC:` block at the absolute bottom of `specs/newspaper/agents/info-exchange.md`.
3. **Strict Formatting:** All JSON payloads must be perfectly formatted. Telemetry voting MUST strictly use the 1-to-5 numeric scale mapping to the 8 canonical metric names (`editorial_density`, `structure`, `tone`, `form`, `topology`, `visual_entropy`, `interaction_mechanics`, `global_fitness`).
