---
tags: [newspaper, orchestrator, protocol, data-contracts]
node_type: conceptual
is_session: false
layer: architecture
nature: procedural
status: active
version: 1.3.0
last_updated: 2026-04-10
---

# Agent Data Exchange Protocol

> **AGENTS: This is the single source of truth for all data schemas in the Gödel Machine.**
> Every handoff between agents MUST conform to the schemas defined here.
> If a schema needs to change, the Orchestrator must approve and version-bump this document.

## Overview

The evolutionary loop consists of **5 data handoffs** forming a closed feedback cycle:

```
Editor → Backend → UI Templates → Operator → Backend → Darwin → UI Evolution
  (2)      (2)        (1)          (1)         (3)      (4+5)     (5)
```

---

## Handoff 1: Operator Vote → Backend (via Platform)

**Producer:** Platform Architect (iframe `postMessage`)
**Consumer:** Data & Backend Engineer (`POST /api/vote` → `telemetry_db.json`)

### Atomic Vote Schema

```json
{
  "id": "uuid-v4",
  "generation_id": "gen_014_a_exploit_dynamic",
  "metric_name": "<one of the 8 canonical values>",
  "score": 3,
  "comment": "optional free text",
  "timestamp": "2026-03-25T03:50:00-03:00"
}
```

### `metric_name` — The 9 Canonical Values

| Value | Owner Agent | Scale: 1 | Scale: 3 | Scale: 5 |
|-------|-------------|----------|----------|----------|
| `editorial_density` | Editor-in-Chief | Too Sparse | Perfect Equilibrium | Too Dense |
| `structure` | Editor-in-Chief | Flat / Monolithic | Perfect Hierarchy | Over-fragmented |
| `tone` | Editor-in-Chief | Robotic / Sterile | Perfect Resonance | Overly Theatrical |
| `form` | Editor-in-Chief | Visually Hostile | Perfect Form Mapping | Chaotic Formatting |
| `topology` | UI Evolution | Structurally Broken | Perfect Flow | Too Minimal |
| `visual_entropy` | UI Evolution | Visually Chaotic | Perfect Equilibrium | Sterile / Dead |
| `interaction_mechanics` | Platform Architect | High Friction | Invisible & Fluid | Overly Kinetic |
| `aesthetics` | UI Evolution | Dissonant / Ugly | Cohesive / Resonant | Visually Overwhelming |
| `global_fitness` | Darwin-Gödel | Catastrophic Regression | Stable Baseline | Evolutionary Leap |

**Mathematical mapping:** `internal_score = score - 3` (maps 1-5 → -2 to +2).

### Validation Rules

- `score` MUST be an integer 1-5.
- `metric_name` MUST be one of the 9 canonical values above.
- `generation_id` MUST match a filename in `evolution/` (without `.html`).
- `id` MUST be a UUID v4.
- Votes with `sentiment` or `component` fields are **REJECTED** (legacy format).

---

## Handoff 2: Editor-in-Chief → Backend → UI Templates (Daily Payload)

**Producer:** Editor-in-Chief (`editor_agent_scaffold.py` → `publications/daily_payload_YYYY-MM-DD.json`)
**Relay:** Data & Backend Engineer (`GET /api/payload?day=YYYY-MM-DD`, `GET /api/publications`)
**Consumer:** UI Templates (`window.parent.currentPayload`)

### News Object Schema

```json
{
  "metadata": {
    "date": "2026-04-10",
    "generated_at": "2026-04-10T06:10:25.121076+00:00",
    "editorial_vectors": {
      "form": "narrative | analytical | telegraphic",
      "tone": "dark_sepia | clinical | lyrical",
      "structure": "hierarchical | flat | fractal"
    },
    "stats": {
      "sessions": 28,
      "decisions": 28,
      "spec_changes": 30
    }
  },
  "articles": [
    {
      "id": "article-uuid",
      "type": "string (open) — e.g. decision, progress, discovery, risk, architectural_decision, constitutional_rule, feature_evolution, meta_reflection, domain_context, risk_alert",
      "tag": "CCB | Migration | Specs",
      "title": "string",
      "body": "<p>Single dense HTML article body. Business-focused, opinionated, decision-relevant. Use <p>, <strong>, <code> tags.</p>",
      "meta": {
        "impact": 9.5,
        "risk": "low | medium | high",
        "source_files": ["path/to/relevant/file.md"]
      }
    }
  ]
}
```

**File location:** `specs/newspaper/evolution/publications/daily_payload_YYYY-MM-DD.json`
**Root fallback:** `specs/newspaper/evolution/daily_payload.json` (latest copy, for backward compat)
**API endpoint:** `GET /api/payload?day=YYYY-MM-DD`
**Archive endpoint:** `GET /api/publications`

### Field Rules

- `type` — open string. Prefer rich types (`architectural_decision`, `constitutional_rule`, `risk_alert`) over generic ones.
- `body` — MUST be an HTML string. Single dense paragraph. Templates inject via `innerHTML`. No tier labels.
- `meta.impact` — float `0.0–10.0`. Use 9.0–10.0 for breaking decisions, 7.0–8.9 for major changes, 5.0–6.9 medium, <5.0 minor.
- `meta.risk` — one of `"low" | "medium" | "high"`.
- `editorial_vectors` — declared by the editor so Darwin can correlate vote scores to content style.
- Templates MUST blindly consume the payload without assumptions about article count. Minimum 5 articles per edition.
- The Backend serves the payload; it never modifies it.

### Frontend Payload Injection Contract

This is the canonical handshake between `index.html` (Platform Architect) and any `gen_*.html` template (UI Evolution).

**Injection flow (index.html):**
```javascript
// 1. Fetch payload from backend
GET /api/payload?day=YYYY-MM-DD
// 2. Set on window before iframe loads
window.currentPayload = StyleMAB.applyStyle(data);
// 3. Load the iframe — template reads the payload in its onload
iframe.src = 'evolution/gen_XXX.html?day=YYYY-MM-DD';
```

**Consumption contract (every gen_*.html):**
```javascript
// Templates MUST read from window.parent.currentPayload
const payload = window.parent.currentPayload;
const articles = payload && payload.articles ? payload.articles : mockPayload.articles;
```

**Rules:**
- `window.currentPayload` is set by `index.html` BEFORE the iframe `src` is assigned. Templates can safely read it synchronously on load.
- Every template MUST define a local `mockPayload` fallback for standalone development (running the template directly without the platform).
- Templates MUST NOT fetch `GET /api/payload` directly — the Platform injects the payload. This decouples template rendering from server availability.
- Templates receive the payload post-StyleMAB transformation (writing style variant may be applied). The schema remains identical.
- Source files listed in `meta.source_files` MUST be rendered as clickable links: `href="/api/doc?path=${f}"` opening in a new tab/window.

---

## Handoff 3: Backend → Darwin-Gödel (Telemetry Feed)

**Producer:** Data & Backend Engineer (`GET /api/telemetry?generation_id=XXX`)
**Consumer:** Darwin-Gödel Engine (fitness calculation)

### Filtered Telemetry Response

```json
[
  {
    "id": "vote-uuid",
    "generation_id": "gen_014_a_exploit_dynamic",
    "metric_name": "topology",
    "score": 4,
    "comment": "",
    "timestamp": "2026-03-25T03:50:00-03:00"
  }
]
```

Darwin aggregates per-metric averages per generation and converts to internal `-2 to +2` space.

### Rules

- When `generation_id` is provided as query param, only votes for that generation are returned.
- When omitted, all votes are returned.
- Backend guarantees zero data loss. Every `POST /api/vote` is persisted before `200 OK`.

---

## Handoff 4: Darwin-Gödel → Generations Manifest

**Producer:** Darwin-Gödel Engine (writes `generations_manifest.json`)
**Consumer:** Platform Architect (Matrix dashboard), all agents (reference)

### Generations Manifest Schema

```json
{
  "generations": [
    {
      "id": "gen_014_a_exploit_dynamic",
      "created_at": "2026-03-25T01:00:00-03:00",
      "type": "exploit | explore",
      "source_mutation_request": null,
      "aesthetic_references": ["Solarpunk", "Bloomberg Terminal"],
      "trait_scores": {
        "editorial_density": 3.2,
        "structure": null,
        "tone": null,
        "form": null,
        "topology": 2.8,
        "visual_entropy": 3.5,
        "interaction_mechanics": null,
        "global_fitness": 3.0
      },
      "vote_count": 12,
      "fitness_delta": null
    }
  ]
}
```

**File location:** `specs/newspaper/evolution/generations_manifest.json`
**API endpoint:** `GET /api/manifest`

### Rules

- `trait_scores` values are averages of all votes for that metric (1-5 scale). `null` = no votes yet.
- `source_mutation_request` links to the mutation request ID that produced this gen (`null` for hand-built gens).
- `fitness_delta` = `global_fitness(this_gen) - global_fitness(parent_gen)`. `null` if no parent.
- Backend co-owns this file: serves it via API and ensures atomicity on writes.

---

## Handoff 5: Darwin-Gödel → UI Evolution (Mutation Request)

**Producer:** Darwin-Gödel Engine (writes `mutation_request.json`)
**Consumer:** UI Evolution Agent (reads + generates `gen_015_*.html`)

### JSON Mutation Request Schema

```json
{
  "request_id": "uuid-v4",
  "created_at": "2026-03-25T04:00:00-03:00",
  "strategy": "exploit | explore",
  "base_generation": "gen_014_a_exploit_dynamic",
  "blend_sources": ["gen_012_a_clarity", "gen_010_exploit_solarpunk"],
  "trait_directives": {
    "editorial_density": { "action": "hold", "target": 3 },
    "topology": { "action": "mutate", "target": 4, "note": "Increase vertical whitespace" },
    "visual_entropy": { "action": "reduce", "target": 2, "note": "Reduce color palette noise" }
  },
  "aesthetic_references": ["Swiss Minimalism", "Dark Sepia"],
  "constraints": [
    "MUST embed Global Voting Bar (1-to-5)",
    "MUST embed 9-axis Atomic Evaluators (7 per-article + global_fitness + aesthetics)",
    "MUST call window.parent.registerAtomicVote({ metric_name, score, comment })",
    "MUST implement Universal Hover Context (Constitutional Rule #10): data-tip on every semantic element"
  ]
}
```

**File location:** `specs/newspaper/evolution/mutation_request.json`

### `trait_directives.action` Values

| Action | Meaning |
|--------|---------|
| `hold` | Keep this trait near current level |
| `mutate` | Actively change toward `target` |
| `reduce` | Decrease this trait's score |
| `increase` | Increase this trait's score |
| `explore` | Try something radically different |

### Rules

- Only traits with votes inform the directive. Darwin never guesses on un-voted traits.
- `constraints` are non-negotiable. The UI Agent cannot skip them.
- After generating, the UI Agent MUST register the new gen in `generations_manifest.json` with `source_mutation_request` pointing to this `request_id`.

---

## API Routes Summary

| Method | Route | Served By | Description |
|--------|-------|-----------|-------------|
| `POST` | `/api/vote` | `evolution_server.py` | Persist an atomic vote |
| `GET` | `/api/telemetry` | `evolution_server.py` | All votes (optionally filtered by `?generation_id=`) |
| `GET` | `/api/payload?day=YYYY-MM-DD` | `evolution_server.py` | Serve daily news payload |
| `GET` | `/api/manifest` | `evolution_server.py` | Serve generations manifest |
| `POST` | `/api/trigger/editor` | `evolution_server.py` | Trigger Editor-in-Chief scaffold (non-blocking, runs in background ~10-20s) |
| `GET` | `/api/trigger/status` | `evolution_server.py` | Returns loop state: latest payload file, mutation request ID, latest generation ID |
| `GET` | `/api/publications` | `evolution_server.py` | Lists all available editions sorted newest-first: `[{date, filename}]` |

---

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0.0 | 2026-03-25 | Orchestrator | Initial protocol — 5 handoffs formalized |
| 1.1.0 | 2026-04-10 | Editor Agent | Handoff 2 schema corrected: `impact` → float 0-10 (was string), `risk` → low/medium/high (was breaking/safe/unknown), `type` → open string, `content.*` → HTML required. File location moved to `publications/`. New `/api/publications` endpoint added. |
| 1.2.0 | 2026-04-10 | Orchestrator | Handoff 2: replaced 3-tier content (exec/tech/graph) with single `body` field. Business-focused editorial model. |
| 1.3.0 | 2026-04-10 | Platform Architect | Handoff 2: Frontend Payload Injection Contract formalized. `window.currentPayload` injection flow, mock fallback requirement, and source file link rule documented. |
