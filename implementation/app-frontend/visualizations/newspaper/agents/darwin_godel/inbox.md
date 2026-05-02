---
description: Directives, tasks, and operator overrides specific to the Darwin-Gödel Engine.
---

# Darwin-Gödel Inbox (Directives & Plans)

> **Protocol:** This file is for directives specifically targeted at the Darwin-Gödel Engine. It bypasses the global `info-exchange.md` broadcast to provide focused, unpolluted instructions. 

---

## DIRECTIVE 001: Execute the First Evolutionary Loop (P0)

**[2026-03-25T15:37:33-03:00]**
**From:** Orchestrator (on behalf of System Operator)
**Status:** REQUIRED

### The Goal
The evolutionary architecture is wired, but it has never naturally fired. Your objective is to ingest real telemetry, calculate fitness, and produce the very first structurally sound `mutation_request.json` so the UI Evolution agent can build `gen_015` (or `gen_017` depending on the current epoch) strictly from your mathematical output.

### The Plan

**Step 1: Telemetry Ingestion**
- Ensure `evolution_server.py` is running.
- Fetch the historical telemetry data. If there is enough data, map it against the 9-axis metric framework (including the new Aesthetic Quality criteria).
- Convert the 1-to-5 voting scores into your internal `-2 to +2` mathematical space.

**Step 2: Calculate Global Fitness & Trait Weights**
- Determine baseline performance for existing generations.
- Use your Multi-Armed Bandit strategy to decide the next move:
  - **Exploit:** If a current template has high fitness, issue a mutation request to make minor CSS/variable tweaks.
  - **Explore:** If current templates are stagnating, issue a mutation request mandating radical structural topology changes.

**Step 3: Produce `mutation_request.json`**
- Write the final output file ` specs/newspaper/evolution/mutation_request.json`.
- The schema MUST include explicitly weighted traits (Topology, Density, Mechanics, Aesthetic).
- State clearly whether this is an **Exploit** or **Explore** mutation.
- Explain the logic behind your weighting clearly in the JSON so the UI Evolution agent understands the *why*.

**Step 4: Update the Manifest**
- Create or update `specs/newspaper/evolution/generations_manifest.json`.
- Log the fitness calculations for the evaluated generations and document the lineage of the new mutation request.

### Execution Constraints 
Do not write UI code. Do not worry about exact hex colors. Your domain is the math and the structural constraints. Output the numbers and let the UI Agent handle the translation.

**Acknowledge this plan and begin Step 1 immediately upon your next wake cycle.**

---

## DIRECTIVE 002: Produce MR-002 After Gen 017 + Gen 018 Votes

**[2026-03-25T20:00:00-03:00]**
**From:** Orchestrator (on behalf of System Operator)
**Status:** PENDING — activate after vote data available

### Context
DIRECTIVE 001 is complete. MR-001 produced Gen 017 A (Focused Warmth). Two new generations are now live and awaiting operator votes:

- `gen_017_a_focused_warmth` — EXPLORE, 70/30 topology, warm palette
- `gen_018_a_exploit_cold_slate` — EXPLOIT, **same topology as 017 A**, cold palette (controlled experiment)
- `gen_018_b_explore_signal_noise` — EXPLORE, **full-width no sidebar**, phosphor green terminal

### Key Experiment to Evaluate
Gen 018 A is a **controlled palette test**: topology is identical to Gen 017 A, only the palette changed. The fitness delta between these two will isolate whether **warmth** or **topology** is the dominant fitness driver.

### Your Objective
1. Ingest telemetry for `gen_017_a`, `gen_018_a`, `gen_018_b`.
2. Compute fitness deltas. Pay special attention to `gen_017_a` vs `gen_018_a` — if their global_fitness scores are close, topology is the dominant variable. If they diverge, palette is.
3. Evaluate `gen_018_b` full-width topology independently — does removing the sidebar improve or hurt editorial_density and topology scores?
4. Produce `mutation_request.json` as `mr-002-2026-03-25` following the same schema as MR-001.
5. Update `generations_manifest.json` with computed trait scores for Gen 017 A, 018 A, 018 B.

### Execution Constraints
Same as DIRECTIVE 001. Do not write UI code. Output the math, directives, and constraints. Let UI Evolution handle the translation.
