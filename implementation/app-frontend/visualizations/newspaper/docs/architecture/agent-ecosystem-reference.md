---
tags: [newspaper, orchestrator, agents, architecture]
node_type: conceptual
is_session: false
layer: architecture
nature: procedural
status: active
version: 1.0.0
last_updated: 2026-03-25
description: Single-source-of-truth reference for the 6-agent Gödel Machine ecosystem
---

# The Gödel Machine — Agent Ecosystem Reference

> **Purpose:** This is the single place to understand who does what, who talks to whom, and how the 6 agents collaborate to evolve the newspaper UI. If you're onboarding, start here.

---

## 1. System Architecture Overview

The Darwin-Gödel Machine is a **genetic UI evolution engine** for *O Grafo Diário* (The Daily Graph). It decomposes the newspaper into measurable traits, tests mutations against operator feedback, and converges on an optimal configuration of **Information Density vs. Cognitive Fatigue**.

The system runs on a **closed evolutionary loop**:

```
  ┌─────────────┐    Payload     ┌───────────────┐   Renders    ┌─────────────┐
  │  Editor-in-  │──────────────▶│  Data & Backend │─────────────▶│ UI Templates │
  │    Chief     │  (Handoff 2)  │   Engineer     │  (via API)   │ (gen_*.html) │
  └─────────────┘               └───────┬───────┘              └──────┬──────┘
                                        │                             │
                                        │ Telemetry                   │ Operator
                                        │ (Handoff 3)                 │ Votes
                                        ▼                             │ (Handoff 1)
                                ┌───────────────┐                     │
                                │  Darwin-Gödel  │◀────────────────────┘
                                │    Engine      │       (via Platform
                                └───────┬───────┘        Architect)
                                        │
                                        │ Mutation Request
                                        │ (Handoffs 4+5)
                                        ▼
                                ┌───────────────┐
                                │  UI Evolution   │──── generates next gen_*.html
                                │    Agent        │
                                └────────────────┘
```

**The Orchestrator** sits above this loop as the context router and single interface to the System Operator.

---

## 2. The 6 Agents

### 2.1 Orchestrator (Context Router)

| | |
|---|---|
| **Persona** | The Context Router |
| **Objective** | Context Purity — ensure no agent hallucinates outside its domain |
| **Trait Owned** | System Workflow Sequence |
| **Manifesto** | [`orchestrator/manifesto.md`](../orchestrator/manifesto.md) |

**What it does:**
- The Operator's single interface. Routes tasks to the correct agent using the **Mask Protocol** (load one agent's constitution, execute, remove mask).
- Maintains the three-file observability architecture: `system-state.md` (what IS), `evolution-wall.md` (what WAS DECIDED), `info-exchange.md` (what IS HAPPENING NOW).
- Only entity with authority to **flush** `info-exchange.md` (The Condensation Law).

**What it does NOT do:**
- Write HTML/CSS, Python, or editorial content.
- Operate two agent personas simultaneously.

---

### 2.2 Platform Architect

| | |
|---|---|
| **Persona** | The Platform Observer |
| **Objective** | Flawless Observability — maintain `index.html` as the central D0 dashboard |
| **Trait Owned** | Interaction Mechanics (friction, triggers, response latency) |
| **Metric** | `interaction_mechanics` (1-5) |
| **Manifesto** | [`agents/platform_architect/manifesto.md`](../agents/platform_architect/manifesto.md) |

**What it does:**
- Builds and maintains `index.html` — the Genetic Platform dashboard (The Matrix, Agents View, Genealogy tab, iframe viewer).
- Implements `registerAtomicVote()` — the receiver function that intercepts iframe votes and routes them to `POST /api/vote`.
- Exposes `window.currentPayload` to child iframes so templates can consume daily news data.
- Manages the Matrix card grid, telemetry visualizations, lore database, and keyboard navigation.

**What it does NOT do:**
- Build `gen_*.html` templates (UI Evolution).
- Persist votes or manage `telemetry_db.json` (Data & Backend).
- Calculate fitness or produce Mutation Requests (Darwin-Gödel).

---

### 2.3 Darwin-Gödel Engine

| | |
|---|---|
| **Persona** | The Structural Stoic (Academic) |
| **Objective** | Mathematical Convergence — calculate trait fitness and guide mutations |
| **Trait Owned** | Global Fitness Scores & Multi-Armed Bandit Trait Weights |
| **Metric** | `global_fitness` (1-5) |
| **Manifesto** | [`agents/darwin_godel/manifesto.md`](../agents/darwin_godel/manifesto.md) |

**What it does:**
- Consumes telemetry via `GET /api/telemetry?generation_id=XXX`.
- Computes per-metric averages and maps 1-5 scores to internal `-2 to +2` space.
- Decides **Exploit** (refine proven layouts) vs. **Explore** (radical mutations) strategy.
- Produces `mutation_request.json` — the exact trait directives for the next generation.
- Co-owns `generations_manifest.json` — populates `trait_scores`, `fitness_delta`, and lineage data.

**What it does NOT do:**
- Build UI. Write HTML. Design aesthetics.
- Persist data (Backend).
- Generate editorial text (Editor-in-Chief).

---

### 2.4 Data & Backend Engineer

| | |
|---|---|
| **Persona** | The Analytics Plumber |
| **Objective** | Unbreakable Pipelines — zero data loss, validated schemas |
| **Trait Owned** | Telemetry Fidelity (data integrity, latency) |
| **Manifesto** | [`agents/data_backend/manifesto.md`](../agents/data_backend/manifesto.md) |

**What it does:**
- Owns and operates `evolution_server.py` (Python HTTP server on port 8000).
- Owns `telemetry_db.json` — the raw persistence layer for all atomic votes.
- Serves 4 API routes: `POST /api/vote`, `GET /api/telemetry`, `GET /api/payload`, `GET /api/manifest`.
- Validates vote schemas per Protocol v1.0.0 — rejects legacy `{ component, sentiment }` format.
- Co-owns `generations_manifest.json` with Darwin-Gödel — ensures atomicity on writes.

**What it does NOT do:**
- Design UI templates (UI Evolution).
- Build `index.html` (Platform Architect).
- Calculate fitness (Darwin-Gödel).
- Generate editorial text (Editor-in-Chief).

---

### 2.5 UI Evolution Agent (Frontend)

| | |
|---|---|
| **Persona** | The Aesthetic Translator |
| **Objective** | Perfect Trait Translation — turn Mutation Requests into breathtaking HTML |
| **Traits Owned** | Topology & Visual Entropy |
| **Metrics** | `topology` (1-5), `visual_entropy` (1-5) |
| **Manifesto** | [`agents/ui_evolution/manifesto.md`](../agents/ui_evolution/manifesto.md) |

**What it does:**
- Generates `gen_*.html` templates — the actual newspaper layouts the Operator evaluates.
- Receives `mutation_request.json` from Darwin-Gödel and translates abstract trait directives into HTML/CSS.
- Embeds the **Global Voting Bar** (`global_fitness`) and **Atomic Context Evaluators** (7 per-article metrics) in every template.
- All template votes call `window.parent.registerAtomicVote({ metric_name, score, comment })`.
- Maintains explicit aesthetic references (Fashion Board convention).

**What it does NOT do:**
- Persist votes or manage backends (Data & Backend).
- Build `index.html` (Platform Architect).
- Calculate evolutionary fitness (Darwin-Gödel).
- Generate editorial text (Editor-in-Chief).

---

### 2.6 Editor-in-Chief

| | |
|---|---|
| **Persona** | The Synthesis Engine |
| **Objective** | Variable Density Synthesis — produce daily JSON payloads tiered into `exec`/`tech`/`graph` |
| **Traits Owned** | Editorial Density & Structure |
| **Metrics** | `editorial_density`, `structure`, `tone`, `form` (all 1-5) |
| **Manifesto** | [`agents/editor_in_chief/manifesto.md`](../agents/editor_in_chief/manifesto.md) |

**What it does:**
- Scrapes the Vault (`docs/vault/conversations/`) for recent sessions.
- Synthesizes raw session data into structured JSON payloads matching the **News Object Schema**.
- Each article contains 3 reading tiers: `exec` (executive summary), `tech` (technical detail), `graph` (deep structural analysis).
- Publishes `daily_payload_YYYY-MM-DD.json` to `evolution/`.
- Declares `editorial_vectors` (form, tone, structure) so Darwin can correlate votes to content style.

**What it does NOT do:**
- Build UI or HTML templates (UI Evolution).
- Persist or serve data via API (Data & Backend).
- Design the dashboard (Platform Architect).

---

## 3. How Agents Collaborate — The 5 Data Handoffs

> Full schemas: [`data-exchange-protocol.md`](./data-exchange-protocol.md)

| # | Handoff | Producer → Consumer | Data | Route |
|---|---------|---------------------|------|-------|
| 1 | **Operator Vote** | Platform Architect → Data & Backend | `{ metric_name, score, comment }` | `POST /api/vote` |
| 2 | **Daily Payload** | Editor-in-Chief → Backend → UI Templates | News Object Schema JSON | `GET /api/payload?day=` |
| 3 | **Telemetry Feed** | Data & Backend → Darwin-Gödel | Filtered vote arrays | `GET /api/telemetry?generation_id=` |
| 4 | **Generations Manifest** | Darwin-Gödel + Backend → All | Trait scores, lineage | `GET /api/manifest` |
| 5 | **Mutation Request** | Darwin-Gödel → UI Evolution | Trait directives + constraints | `mutation_request.json` |

### The Voting Pipeline (End-to-End)

1. Operator opens a template in `index.html`'s iframe viewer.
2. Template renders voting UI (Global Voting Bar + 7 Atomic Evaluators per article).
3. Operator scores on 1-5 scale → template calls `window.parent.registerAtomicVote(...)`.
4. `index.html` receives the call → optimistic UI update + `POST /api/vote` to backend.
5. `evolution_server.py` validates schema and persists to `telemetry_db.json`.
6. Darwin-Gödel consumes votes via `/api/telemetry`, computes fitness, outputs Mutation Request.
7. UI Evolution reads the Mutation Request and generates the next `gen_*.html`.

---

## 4. The 8-Metric Evaluation System

All voting uses a **1-to-5 scale** where **3 = optimal**. Values map internally to `-2 to +2`.

| Metric | Owner | 1 (Bad) | 3 (Optimal) | 5 (Bad — other extreme) |
|--------|-------|---------|-------------|-------------------------|
| `editorial_density` | Editor | Too Sparse | Perfect Equilibrium | Too Dense |
| `structure` | Editor | Flat / Monolithic | Perfect Hierarchy | Over-fragmented |
| `tone` | Editor | Robotic / Sterile | Perfect Resonance | Overly Theatrical |
| `form` | Editor | Visually Hostile | Perfect Form Mapping | Chaotic Formatting |
| `topology` | UI Evolution | Structurally Broken | Perfect Flow | Too Minimal |
| `visual_entropy` | UI Evolution | Visually Chaotic | Perfect Equilibrium | Sterile / Dead |
| `interaction_mechanics` | Platform Architect | High Friction | Invisible & Fluid | Overly Kinetic |
| `global_fitness` | Darwin-Gödel | Catastrophic Regression | Stable Baseline | Evolutionary Leap |

---

## 5. Communication Protocol

> Full rules: [`newspaper-communication-protocol.md`](./newspaper-communication-protocol.md)

### The Three-File Observability Architecture

| File | Purpose | Who writes | Mutability |
|------|---------|------------|------------|
| [`system-state.md`](../agents/system-state.md) | **What IS** — authoritative snapshot | Orchestrator only | Overwritten on state changes |
| [`evolution-wall.md`](../agents/evolution-wall.md) | **What WAS DECIDED** — decision log | Orchestrator + agents | Append-only (newest first) |
| [`info-exchange.md`](../agents/info-exchange.md) | **What IS HAPPENING NOW** — live comms | All agents | Append-only; periodically flushed |

### Rules

1. **Read `system-state.md` first** before any task.
2. **Append-only** — never edit another agent's log entry.
3. **SYNC template** — every entry needs `## SYNC:`, timestamp, `From:`, `To:`, `Status:`, `Action Required:`.
4. **Condensation Law** — Orchestrator flushes `info-exchange.md` when it exceeds ~50 entries or ~30KB.

---

## 6. Constitutional Rules (Immutable Unless Operator Overrides)

1. **Mask Protocol** — Orchestrator loads one agent at a time.
2. **Atomic Telemetry** — All feedback is numeric (1-5). No fuzzy qualitative data.
3. **Fashion Board** — UI Agent must declare aesthetic references explicitly.
4. **Daily Payload Contract** — Editor produces JSON, templates blindly consume. Never coupled.
5. **Context Provisioning** — All UI elements include tooltips explaining their purpose.
6. **Append-Only Protocol** — `info-exchange.md` strict formatting per communication protocol.
7. **Exploit/Explore Dual Engine** — Exploit = CSS variable swaps. Explore = agentic LLM generation.
8. **Mandatory Voting UI** — Every `gen_*.html` embeds Global Voting Bar + 8-axis Atomic Evaluators.
9. **Condensation Law** — Orchestrator flushes info-exchange periodically into system-state + evolution-wall.

---

## 7. File Ownership Map

| File / Directory | Owner Agent |
|------------------|-------------|
| `evolution/index.html` | Platform Architect |
| `evolution/gen_*.html` | UI Evolution |
| `evolution/evolution_server.py` | Data & Backend |
| `evolution/telemetry_db.json` | Data & Backend |
| `evolution/daily_payload_*.json` | Editor-in-Chief |
| `evolution/generations_manifest.json` | Darwin-Gödel + Data & Backend |
| `evolution/mutation_request.json` | Darwin-Gödel |
| `agents/system-state.md` | Orchestrator |
| `agents/evolution-wall.md` | Orchestrator + agents |
| `agents/info-exchange.md` | All agents (Orchestrator flushes) |
| `docs/data-exchange-protocol.md` | Orchestrator (versioned) |
| `docs/newspaper-communication-protocol.md` | Orchestrator |

---

## 8. Quick Reference: Agent Manifesto Locations

| Agent | Manifesto Path |
|-------|----------------|
| Orchestrator | [`specs/newspaper/orchestrator/manifesto.md`](../orchestrator/manifesto.md) |
| Platform Architect | [`specs/newspaper/agents/platform_architect/manifesto.md`](../agents/platform_architect/manifesto.md) |
| Darwin-Gödel Engine | [`specs/newspaper/agents/darwin_godel/manifesto.md`](../agents/darwin_godel/manifesto.md) |
| Data & Backend | [`specs/newspaper/agents/data_backend/manifesto.md`](../agents/data_backend/manifesto.md) |
| UI Evolution | [`specs/newspaper/agents/ui_evolution/manifesto.md`](../agents/ui_evolution/manifesto.md) |
| Editor-in-Chief | [`specs/newspaper/agents/editor_in_chief/manifesto.md`](../agents/editor_in_chief/manifesto.md) |
