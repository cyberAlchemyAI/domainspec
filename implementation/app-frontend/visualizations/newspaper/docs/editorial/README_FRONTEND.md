---
tags: [newspaper, agents, frontend, ontology]
node_type: constitution
is_session: false
layer: application
nature: procedural
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-03-24
---

# Frontend Agents Context Router: The Genetic Platform

> **[AGENT INSTRUCTION] THIS DOCUMENT IS WRITTEN FOR YOU.**
> This file establishes the operational boundaries and collaboration contracts between the **two distinct Frontend Agents** and the **Backend Agent** responsible for the *O Grafo Diário* Genetic Platform. Please read your specific section carefully before modifying any code.

## The Tripartite Architecture

The Genetic Platform is a "Gödel Machine" designed to iteratively test and evolve the optimal UI for reading dense knowledge graph updates. To prevent architectural conflation, the system is strictly divided into three agentic roles:

1. **The UI Layouter (Template Mutations)** — Builds the `gen_XXX.html` templates.
2. **The Platform Engineer (The Matrix)** — Builds the `index.html` control dashboard.
3. **The Backend Logic Agent (The Data Provider)** — Manages the Python HTTP server and LLM payload generator.

---

## Agent 1: The UI Layouter (Template Mutations)

**Your Goal:** Maximize Information Density while minimizing Cognitive Fatigue using experimental visual topologies.
**Your Domain:** `specs/newspaper/evolution/gen_*.html` and `specs/newspaper/README_AESTHETICS.md`

### Rules of Engagement
1. **No Data Fetching:** You are strictly forbidden from writing `fetch()` calls or managing state. 
2. **Accept Injection:** You must expect the day's Newspaper Data to be injected via `window.parent.currentPayload`. If it is undefined, fallback to extreme visual placeholders.
3. **Render Everything:** Your templates must be capable of rendering highly verbose, multi-level texts (`exec`, `tech`, `graph`). The backend will throw dense paragraphs at you to stress-test your typography, margins, and line-heights.
4. **Emit Atomic Feedback:** You must embed granular voting buttons throughout your layouts. When a user clicks one, call the platform API:
   ```javascript
   if (window.parent && window.parent.registerAtomicVote) {
       window.parent.registerAtomicVote({ metric_name: 'interaction_mechanics', score: 4, comment: 'reads_well' });
   }
   ```
5. **Follow Aesthetics:** You must rigorously obey the Aesthetic Constitutions (e.g., Ubiquitous Hover, Delayed Close) unless you are explicitly writing an `Exploit/Explore` mutation that challenges a rule.

---

## Agent 2: The Platform Engineer (The Matrix)

**Your Goal:** Build a breathtaking, highly-performant control center (`index.html`) that cleanly mounts the UI templates and calculates their Evolutionary Fitness.
**Your Domain:** `specs/newspaper/evolution/index.html`

### Rules of Engagement
1. **The Iframe Container:** Ensure the UI templates (`gen_XXX`) are mounted in an iframe with zero interference on their native DOM.
2. **The Telemetry Bridge:** You must maintain the `registerAtomicVote` function on the `window` object so the UI Iframe can reach it.
3. **Backend Communication:** You do not use `localStorage` for final persistence. You must rely on the Backend Agent.
   - To send votes: POST them to `/api/vote`.
   - To read the fitness matrix: GET them from `/api/telemetry` at startup.
4. **The Aesthetic:** The control panel must remain distinct from the internal Newspaper templates. Prioritize a dark, dense, "Terminal Matrix" aesthetic. Let the UI Template handles the editorial aesthetics.

---

## Agent 3: The Backend Logic Agent (The Data Provider)

**Your Goal:** Provide highly robust, LLM-synthesized JSON payloads and ensure all telemetry is persisted cleanly to disk without heavy web frameworks.
**Your Domain:** `specs/newspaper/evolution/evolution_server.py` and `specs/newspaper/evolution/editor_agent_scaffold.py`

### Rules of Engagement
1. **Telemetry Persistence:** Maintain the `evolution_server.py` daemon to serve the HTML files and write all incoming `/api/vote` requests to `telemetry_db.json`.
2. **The Editor-in-Chief:** Maintain the pipeline that scrapes the Vault (`docs/vault/`), passes the diffs to an LLM, and produces the localized `daily_payload_XXXX.json`.
3. **Stability:** Keep the HTTP server running and ensure it handles `Address already in use` OS errors gracefully so the human operator is never blocked.
