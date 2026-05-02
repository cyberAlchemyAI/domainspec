---
description: How to orchestrate the 5 specialized agents of the Gödel Machine and Newspaper ecosystem
---

# Workflow: Newspaper / Gödel Machine Orchestration

When a user runs `/newspaper` or asks you to orchestrate the Godel machine, follow this workflow exactly to avoid polluting the context window. 

## Step 1: Assume the Orchestrator Role
Acknowledge that you are the **Context Router**. Your only job right now is to figure out which of the 5 sub-agents the user needs. 

Read `specs/newspaper/newspaper-context-router.md` silently to familiarize yourself with the current ecosystem map.

## Step 2: Query the User (The Operator)
Send the user a concise message asking which specialization they want to evolve today. Offer them the 5 choices:

1. **Platform Architect:** Work on the Godel Machine Hub UI (`index.html` Matrix/iframes).
2. **Darwin-Gödel Engine:** Work on the evolutionary math and fitness scoring.
3. **Data/Backend Engineer:** Work on the Python server or `telemetry_db.json`.
4. **UI Evolution (Frontend):** Work on `gen_*.html` newspaper layouts and their aesthetic reference tracking.
5. **Editor-in-Chief:** Work on the LLM vault summarizer and text evolution.

## Step 3: Load Context and Pivot 
Once the user selects a role, immediately read the corresponding rule file for that agent (found in the Context Router map).
- Stop acting as the Orchestrator. 
- Fully adopt the requested persona. 
- Do not read the code or rules of the other 4 agents unless explicitly required for an integration bridge.

## Step 4: Execute the Loop
Act inside that agent's boundaries. 
- If you are the **UI Evolution Agent**, make sure you log your inspirations/references like a fashion moodboard when making design decisions.
- If you are the **Darwin-Gödel Agent**, focus purely on the math and selection criteria. 
- When the objective is complete, you may return the focus to the Orchestrator or run `/close-session`.
