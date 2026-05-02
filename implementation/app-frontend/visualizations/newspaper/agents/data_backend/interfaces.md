---
tags: [data-backend, newspaper, interfaces, protocol, api]
node_type: conceptual
is_session: false
layer: architecture
nature: explanatory
status: active
veracidade: high
convicção: high
version: 1.0.0
last_updated: 2026-03-25
---

# Backend Agent — Interface Reference

> **Author:** Data & Backend Engineer Agent (The Analytics Plumber)
> **Audience:** All agents in the Gödel Machine ecosystem and the System Operator.
> **Purpose:** This document explains, from the Backend's perspective, how every interface works, what each data contract means, and why it exists. It is the plumber's map of every pipe in the system.

---

## 1. What "Interfaces" Mean in This Ecosystem

An interface in the Darwin-Gödel Machine is a **contractual boundary** between two agents. It defines:
- **The Shape** — exactly what JSON fields are required, what types they must be, and what values are valid.
- **The Direction** — who produces and who consumes.
- **The Transport** — whether the handoff happens via HTTP (API routes on `evolution_server.py`), via filesystem (JSON files), or via the communication protocol (`info-exchange.md`).

The Backend Agent sits at the **center of all data flow**. We do not create the data (that's the Editor or the Operator), and we do not interpret it (that's Darwin-Gödel). We **validate, persist, and serve** it. Every pipe is our responsibility.

---

## 2. The 4 API Routes — What They Do

All routes are served by [`evolution_server.py`](../../evolution/evolution_server.py) on port 8000 (auto-increments if blocked).

### 2.1 `POST /api/vote` — Atomic Vote Ingestion

| Property | Value |
|----------|-------|
| **Producer** | Platform Architect (via `registerAtomicVote()` in `index.html`) |
| **Consumer** | Backend persists → Darwin-Gödel reads later |
| **Persistence** | Appended to `telemetry_db.json` |

**What happens when a vote arrives:**
1. The Platform Architect's `index.html` captures a vote from an iframe template.
2. It fires `POST /api/vote` with a JSON body.
3. The Backend **validates** the payload against the canonical schema:
   - Rejects any legacy `{ sentiment, component }` format immediately.
   - Requires all 5 fields: `id`, `generation_id`, `metric_name`, `score`, `timestamp`.
   - Validates `metric_name` against the approved set of 9 canonical values.
   - Validates `score` is an integer between 1 and 5.
4. If valid: the vote is prepended to the `telemetry_db.json` array. Duplicates (by `id`) are silently ignored.
5. Returns `200 { "status": "success", "synced": true }` on success, or `400 { "error": "..." }` on validation failure.

**The canonical vote schema:**
```json
{
  "id": "uuid-v4",
  "generation_id": "gen_016_a_explore_synthesis",
  "metric_name": "<one of the 9 canonical values>",
  "score": 3,
  "comment": "optional free text",
  "timestamp": "2026-03-25T18:38:54.911Z"
}
```

**Why this matters:** This is the evolutionary loop's oxygen supply. If votes are malformed or lost, Darwin-Gödel starves and cannot compute fitness. The Backend is the last line of defense before data hits disk.

---

### 2.2 `GET /api/telemetry` — Telemetry Feed

| Property | Value |
|----------|-------|
| **Producer** | Backend (reads from `telemetry_db.json`) |
| **Consumer** | Darwin-Gödel Engine |
| **Query Params** | `?generation_id=XXX` (optional filter) |

**What happens:**
1. Darwin-Gödel (or any authorized agent) requests all votes.
2. If `?generation_id=gen_014_a_exploit_dynamic` is provided, only votes matching that generation are returned.
3. If omitted, the entire telemetry database is returned.
4. Returns a JSON array of vote objects.

**Why this matters:** Darwin needs the raw vote data to compute per-metric averages and map them to the internal `-2 to +2` space (via `internal_score = score - 3`). This is the direct telemetry feed — the mathematical foundation of the entire evolutionary loop.

---

### 2.3 `GET /api/payload?day=YYYY-MM-DD` — Daily Editorial Payload

| Property | Value |
|----------|-------|
| **Producer** | Editor-in-Chief (writes `daily_payload_YYYY-MM-DD.json`) |
| **Relay** | Backend serves it via HTTP |
| **Consumer** | UI Templates (via `window.parent.currentPayload`) |
| **Query Params** | `?day=YYYY-MM-DD` (optional; falls back to `daily_payload.json`) |

**What happens:**
1. The Editor-in-Chief generates a structured JSON payload containing news articles tiered into `exec`, `tech`, and `graph` reading levels.
2. The Backend simply serves this file. **We never modify the payload contents.**
3. If `?day=2026-03-25` is provided, we look for `daily_payload_2026-03-25.json`.
4. If no day is given, we fall back to `daily_payload.json`.
5. The Platform Architect's `index.html` fetches this on load and injects it as `window.currentPayload` for iframe templates to consume.

**Why this matters:** This is the **Daily Payload Contract** — the most important decoupling in the system. The Editor creates text. The UI consumes text. They never talk to each other directly. The Backend is the neutral relay ensuring the pipe stays clean.

**The News Object Schema:** (defined authoritatively in [`data-exchange-protocol.md`](../../docs/data-exchange-protocol.md))
```json
{
  "metadata": {
    "date": "2026-03-25",
    "generated_at": "...",
    "editorial_vectors": { "form": "...", "tone": "...", "structure": "..." },
    "stats": { "sessions": 12, "decisions": 5, "spec_changes": 3 }
  },
  "articles": [
    {
      "id": "article-uuid",
      "type": "decision | progress | discovery | risk",
      "tag": "CCB | Migration | Specs",
      "title": "string",
      "content": { "exec": "...", "tech": "...", "graph": "..." },
      "meta": { "impact": "high|medium|low", "risk": "breaking|safe|unknown", "source_files": [] }
    }
  ]
}
```

---

### 2.4 `GET /api/manifest` — Generations Manifest

| Property | Value |
|----------|-------|
| **Producer** | Darwin-Gödel Engine + Backend (co-owned) |
| **Consumer** | Platform Architect (Matrix dashboard), all agents |
| **File** | `generations_manifest.json` |

**What happens:**
1. The manifest is a registry of every genetic template generation, including trait scores, lineage, and fitness deltas.
2. The Backend serves it via HTTP and ensures atomicity on writes.
3. The Platform Architect reads it to render the Matrix card grid.

**Why this matters:** Without a manifest, there is no centralized knowledge of which generations exist, what their scores are, or how they relate to each other. It is the genealogical DNA of the entire system.

---

## 3. The 9 Canonical Metrics

These are the **only** valid values for `metric_name` in the voting system. Any other value will be rejected by the Backend.

| # | `metric_name` | Owner Agent | 1 (Low Extreme) | 3 (Optimal) | 5 (High Extreme) |
|---|---------------|-------------|-----------------|-------------|-------------------|
| 1 | `editorial_density` | Editor-in-Chief | Too Sparse | Perfect Equilibrium | Too Dense |
| 2 | `structure` | Editor-in-Chief | Flat / Monolithic | Perfect Hierarchy | Over-fragmented |
| 3 | `tone` | Editor-in-Chief | Robotic / Sterile | Perfect Resonance | Overly Theatrical |
| 4 | `form` | Editor-in-Chief | Visually Hostile | Perfect Form Mapping | Chaotic Formatting |
| 5 | `topology` | UI Evolution | Structurally Broken | Perfect Flow | Too Minimal |
| 6 | `visual_entropy` | UI Evolution | Visually Chaotic | Perfect Equilibrium | Sterile / Dead |
| 7 | `interaction_mechanics` | Platform Architect | High Friction | Invisible & Fluid | Overly Kinetic |
| 8 | `aesthetics` | UI Evolution | Dissonant / Ugly | Cohesive / Resonant | Visually Overwhelming |
| 9 | `global_fitness` | Darwin-Gödel | Catastrophic Regression | Stable Baseline | Evolutionary Leap |

**Key insight:** The scale is **bidirectional**. A score of `3` is **optimal**. Both `1` and `5` represent failure in opposite directions. Internally, Darwin maps `1-5 → -2 to +2` via `internal_score = score - 3`. This means a perfectly balanced template scores `0` on every axis — not a high number.

---

## 4. The 3 Communication Files — Backend's Role

| File | What It Contains | Backend's Relationship |
|------|-----------------|----------------------|
| [`system-state.md`](../system-state.md) | The authoritative live snapshot of the ecosystem | **READ FIRST** before any task. Backend does not write here. |
| [`evolution-wall.md`](../evolution-wall.md) | Chronological decision history | Backend may append domain-specific decisions. |
| [`info-exchange.md`](../info-exchange.md) | Live cross-agent communication | Backend appends `## SYNC:` blocks to report status or respond to blockers. |

**The Backend never flushes `info-exchange.md`.** Only the Orchestrator has flush authority.

---

## 5. The 5 Data Handoffs — Backend's Position

```
                          ┌─── Handoff 2 ───┐
  Editor-in-Chief ────────► BACKEND ─────────► UI Templates
                          │  (relay only)    │
                          └──────────────────┘

  Platform Architect ──── Handoff 1 ────► BACKEND ──── Handoff 3 ────► Darwin-Gödel
     (iframe votes)      POST /api/vote     │        GET /api/telemetry
                                            │
                                            └──── Handoff 4 ────► All Agents
                                                 GET /api/manifest
```

The Backend touches **4 of the 5 handoffs**. Handoff 5 (Mutation Request: Darwin → UI Evolution) is the only pipe we don't participate in — it's a direct file-based handoff (`mutation_request.json`).

---

## 6. What the Backend Does NOT Do

This is equally important. Violating these boundaries breaks the Mask Protocol:

- ❌ **We never design UI** — no HTML, no CSS. That's UI Evolution.
- ❌ **We never build `index.html`** — that's Platform Architect territory.
- ❌ **We never calculate fitness** — Darwin-Gödel owns the math.
- ❌ **We never generate editorial text** — that's the Editor-in-Chief.
- ❌ **We never modify the payload contents** — we relay it as-is.
- ❌ **We never flush `info-exchange.md`** — Orchestrator authority only.

---

## 7. File Ownership

| File | Backend's Role |
|------|---------------|
| `evolution/evolution_server.py` | **OWNER** — sole maintainer |
| `evolution/telemetry_db.json` | **OWNER** — sole writer |
| `evolution/generations_manifest.json` | **CO-OWNER** with Darwin-Gödel — we serve and ensure atomicity |
| `evolution/daily_payload_*.json` | **READ-ONLY** — served via API, never modified |
| `evolution/mutation_request.json` | **NO ACCESS** — Darwin → UI Evolution only |
| `evolution/gen_*.html` | **NO ACCESS** — UI Evolution domain |
| `evolution/index.html` | **NO ACCESS** — Platform Architect domain |

---

## 8. Known Open Loops

As of 2026-03-25T15:42:00-03:00, the following Backend-relevant tasks remain incomplete:

1. **`generations_manifest.json` does not exist.** The API route is implemented but returns 404. Co-creation with Darwin-Gödel is pending.
2. **No real Mutation Request** has ever been produced. Handoff 5 has never fired.
3. **The Exploit/Explore distinction** is a filename convention, not a server-enforced protocol.
4. **Vote Standardization Migration** is in progress on the emitter side (UI templates). The Backend receiver is forward-compatible.

---

## 9. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-25 | Initial interface documentation by Backend Agent |
