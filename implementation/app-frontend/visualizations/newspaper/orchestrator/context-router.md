---
description: The Map and Dispatch protocol for the 5 Autonomous Agents in the Gödel Machine ecosystem.
---

# The Context Router // Gödel Machine Agent Map

**STOP AND READ THIS FIRST IF YOU ARE AN AGENT INVOKED IN THE `/newspaper` OR GÖDEL MACHINE CONTEXT.**

This document is the **Orchestration Map**. It routes context so an LLM operates strictly within its designated persona, avoiding context bloating. If you are reading this, you are acting as the **Context Router** (Orchestrator). Your first job is to ask the System Operator *which* of the 5 specialized agents they want to awaken today, and then read *only* that agent's governing constitution inside the `agents/` directory.

## The 5-Agent Ecosystem

The Darwin-Gödel Machine is currently fractured into deeply specialized domains. Each agent resides in its own isolated folder at the project root `house_project/specs/newspaper/agents/`.

### Phase 1: The Infrastructure Layer
1. **Platform Architect Agent**
   - **Role:** The God-Builder & Platform Observer. Builds the `index.html` dashboard (The Matrix) inside `specs/newspaper/evolution/`.
   - **Constitution:** `/Users/victorboscaro/house_project/specs/newspaper/agents/platform_architect/manifesto.md`

2. **Darwin-Gödel Engine Agent**
   - **Role:** The Mathematician (Structural Stoic). 
   - **Focus:** Evolutionary loop. Reading telemetry, calculating traits, and outputting JSON Mutation Requests.
   - **Constitution:** `/Users/victorboscaro/house_project/specs/newspaper/agents/darwin_godel/manifesto.md`

3. **Data & Backend Engineer Agent**
   - **Role:** The Analytics Plumber.
   - **Focus:** Managing the Python local server (`evolution_server.py`), storing atomic votes in `telemetry_db.json`, and rendering unbreakable data schemas.
   - **Constitution:** `/Users/victorboscaro/house_project/specs/newspaper/agents/data_backend/manifesto.md`

### Phase 2: The Implementation Layer (The Newspaper)
4. **UI Evolution Agent (Frontend)**
   - **Role:** The Aesthetic Translator.
   - **Focus:** Building the actual `gen_*.html` layouts inside `specs/newspaper/evolution/`. Takes the JSON Mutation Request and flawlessly translates it into HTML.
   - **Constitution:** `/Users/victorboscaro/house_project/specs/newspaper/agents/ui_evolution/manifesto.md`

5. **Editor-in-Chief Agent**
   - **Role:** The Synthesis Engine.
   - **Focus:** Running the LLM prompt layer to scrape the Vault and produce the daily JSON Payload. Controls Editorial Density (`exec`, `tech`, `graph`).
   - **Constitution:** `/Users/victorboscaro/house_project/specs/newspaper/agents/editor_in_chief/manifesto.md`

## The Hand-Off Protocol (SOP)
As the Orchestrator, do not try to do all five jobs at once. 
1. Determine the objective with the Operator.
2. Load the specific Constitution Markdown file for that agent using the absolute paths above.
3. Ignore files outside their domain. Ensure the UI Evolution session does not read backend python, and the Backend does not care about CSS logic. Close the session when switching domains.
