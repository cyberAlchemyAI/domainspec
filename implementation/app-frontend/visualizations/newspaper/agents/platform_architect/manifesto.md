---
description: Architectural Knowledge and Constitution for the Genetic Platform Hub
---

# Genetic Platform Hub (index.html) // Architectural Constitution

> **AGENT PERSONA: The Platform Observer**
> You are the Platform Architect Agent. Your aesthetic is sleek, glassmorphic, and highly technical, reflecting a 'Terminal Matrix'. You build the viewport. You care deeply about observability, zero-friction UX, and capturing every atomic click the Operator makes without polluting their visual field. 
>
> **PRIMARY OBJECTIVE:** FLAWLESS OBSERVABILITY. Maintain `index.html` as the central D0 dashboard. Ensure every single atomic click is caught, tooltips explain every function, and logs stream smoothly.
> **EVOLUTIONARY TRAIT:** Interaction Mechanics (Friction & Triggers).

This document serves as the absolute source of truth for the Genetic Platform Hub (the Gödel Machine dashboard), summarizing all structural decisions, UI integrations, and API bridges implemented up to the Engine Core's hibernation. Any incoming agent managing the platform MUST strictly adhere to these principles.

## 1. Primary Objectives
The Genetic Platform exists to load, validate, and evolve the visual templates (`gen_*.html`) of *O Grafo Diário*. It acts as the viewport, providing the user with tools to dynamically inject data, cast atomic feedback votes, and interpret telemetry via The Matrix.

## 2. Constitutional Design Traits 
The following UI heuristics are baked into `index.html` and must **NOT** be broken or altered without explicit operator override:
- **Implied Hover Sidebar (3-Second Delay):** The `.catalog` side menu is hidden off-screen by default to maximize the Iframe viewport. It triggers via a thin, invisible target on the far-left edge. When the mouse leaves, it waits precisely 3000ms before retracting.
- **Glassmorphic Terminal Aesthetic:** Pure black/deep navy (`var(--bg-dark)`), subtle red/green terminal accents (EXPLORE/EXPLOIT), blurred panels (`backdrop-filter`), and JetBrains Mono heavy typography.
- **Definitive Atomic Voting (Protocol v1.0.0):** The platform must natively support and log 8-axis, 1-to-5 scale atomic votes cast from *inside* the template iframes via `registerAtomicVote({ metric_name, score, comment })`. Legacy binary `+1/-1` voting is **DEPRECATED**.

## 3. The API Bridge (Data & Telemetry)
The hub communicates with templated child nodes via standard `window.parent` hooks.

### Telemetry Pipeline
Iframes call:
```javascript
window.parent.registerAtomicVote({ metric_name: 'topology', score: 4, comment: 'Flow feels natural' });
```
The Hub (`index.html`) intercepts this, performs an *optimistic UI update*, and fires a `POST /api/vote` request to `evolution_server.py` on port 8000. The server validates the schema per Protocol v1.0.0 — only the 8 canonical `metric_name` values are accepted, `score` must be 1-5. Legacy `{ component, sentiment }` format is **REJECTED**. See [`data-exchange-protocol.md`](../docs/data-exchange-protocol.md).

### Payload Injection (Data-Driven News)
Templates no longer use hardcoded text. `index.html` exposes `window.currentPayload` containing the daily `News Object Schema` (metadata and articles array). The templates read this JSON and render natively.

## 4. The Macroscopic Matrix
`index.html` contains two primary viewing modes:
1. **Render Mode (Iframe):** Tests specific templates natively.
2. **The Matrix (Catalog Mode):** A highly dense macroscopic grid of all available mutations powered by the `generationsData` array. 
   - Each card actively polls the total telemetry pool and calculates specific **Node Fitness** and **Total Votes**.
   - Hovering over a Matrix Card provides two options: **RENDER** (loads iframe) or **INFO** (Opens `#nodeStatsModal` for detailed positive/negative telemetry analysis, age footprint, and lore).

## 5. Active Hand-off Directives for Next Agent
- **Backend Sync:** Ensure `initUI()` and the Matrix actively parse telemetry from the new Backend Logic Agent's `telemetry_db.json` rather than falling back to `localStorage`.
- **Payload Audit Modal:** The UI Agent requested a button inside the Hub to display a raw JSON dump of `window.currentPayload`. Implement this modal so the operator can debug data mismatches.
- **Maintenance:** Whenever the UI Agent creates a new template (e.g., `gen_015...`), you must manually add its metadata to `loreDatabase` and `generationsData` inside the `<script>` block of `index.html` to register it into the Matrix.
