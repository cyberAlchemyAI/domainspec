---
tags: [newspaper, orchestrator, system-state]
node_type: conceptual
is_session: false
layer: architecture
nature: procedural
status: active
version: 2.0.0
last_updated: 2026-04-10
---

# Gödel Machine — System State Dashboard

> **Last updated:** 2026-04-10T03:30:00-03:00
> **Updated by:** Orchestrator (Context Router)

⚠️ **AGENTS: Read this file FIRST.** This is the authoritative snapshot of the entire ecosystem. For chronological decision history, see [`evolution-wall.md`](./evolution-wall.md). For live cross-agent communication, see [`info-exchange.md`](./info-exchange.md).

---

## 0. Philosophical Foundation

All architectural decisions in this ecosystem trace back to `docs/business-philosopher/manifesto.md`:

| Principle | System Application |
|-----------|-------------------|
| **Variance Reduction** | Darwin-Gödel fitness convergence; the Matrix absorbs 16+ templates into one ranked queue |
| **Antifragility** | EXPLORE branches; failed mutations enrich the fitness landscape |
| **The Nudge** | Mask Protocol; constitutional rules guide agents without over-constraining |
| **Form is Content** | `exec/tech/graph` tiering; self-documenting 3-file observability; voting icon (◉) as inline artifact context |

---

## 1. Active Generation Under Test

| Generation | File | Type | Strategy | Status |
|------------|------|------|----------|--------|
| Gen 019 A | `evolution/gen_019_a_exploit_focus_density.html` | Exploit | Radical Focus II — same 70/30 topology, max editorial density (Bloomberg/Dark Sepia) | Active — awaiting votes |
| Gen 019 B | `evolution/gen_019_b_explore_horizontal_chronicle.html` | Explore | Horizontal chronicle layout | Active — awaiting votes |
| Gen 018 A | `evolution/gen_018_a_exploit_cold_slate.html` | Exploit | Cold palette test vs Gen 017 A topology | Active — awaiting votes |
| Gen 018 B | `evolution/gen_018_b_explore_signal_noise.html` | Explore | Full-width dispatch terminal, no sidebar | Active — awaiting votes |
| Gen 017 A | `evolution/gen_017_a_focused_warmth.html` | Explore | Focused Warmth, 70/30 + accordion | Active — awaiting votes |

**Archive (voted/evaluated):** Gen 016 A/B, Gen 015 A/B, Gen 014 A/B, Gen 013 A, Gen 012 A/B, Gen 011 A/B, Gen 010 Explore/Exploit, Gen 009 A/B, Gen 008, Gen 007, Gen 005.

**Mockup Fossils** (in `mockups/`): `a_dark_sepia`, `b_swiss_minimalism`, `c_terminal_green`, `d_brazilian_modernist`, `e_futuristic_context`, plus Tropical Cybernetics variants. All wired to telemetry.

**Last Mutation Request:** `mr-001-2026-03-25` — produced Gen 017 A. MR-002 pending Gen 017 + Gen 018 + Gen 019 vote data.

---

## 2. Active Backend Services

| Service | File | Port | Status |
|---------|------|------|--------|
| Evolution Server | `evolution/evolution_server.py` | 8000 | 🟢 Running |
| Editor Agent Scaffold | `evolution/editor_agent_scaffold.py` | — | 🟢 Operational — automated pipeline (gemini-2.5-pro, 30 vault files, ≥5 articles) |

**Data store:** `evolution/telemetry_db.json` — persists atomic votes from `registerAtomicVote()`.

**Publications archive:** `evolution/publications/` — accumulates dated editions (`daily_payload_YYYY-MM-DD.json`). Current editions: `2026-03-25`, `2026-04-10`. Served via `GET /api/publications`.

**Dependency:** `google-genai` pip package required (installed in project venv 2026-04-10). `GEMINI_API_KEY` must be in `.env` and the server started with `.env` loaded for `POST /api/trigger/editor` to work.

---

## 3. Agent Trait Assignments

Each agent owns one evolutionary characteristic. Darwin-Gödel consumes all of them.

| Agent | Trait Owned | Metric Signal |
|-------|-------------|---------------|
| **Editor-in-Chief** | Editorial Density & Structure | Usage of reading depth toggles (`exec`/`tech`/`graph`) |
| **UI Evolution** | Topology & Visual Entropy | Atomic votes tagged "Layout Structure" and "Visual Fatigue" |
| **Platform Architect** | Interaction Mechanics | Interaction latency, panel dismissal rates |
| **Data & Backend** | Telemetry Fidelity | Zero data loss in `telemetry_db.json` |
| **Darwin-Gödel** | Global Fitness (synthesis) | Consumes all trait data, outputs JSON Mutation Requests |

---

## 4. Voting System — 1-to-5 Metric Scales (9 Independent Axes)

All atomic voting uses a **1-to-5 scale** with explicit tooltip definitions.

### Editor-in-Chief — 4 Metrics

| Metric | 1 | 3 | 5 |
|--------|---|---|---|
| **Editorial Density** | Too Sparse / Incomplete | Perfect Equilibrium | Too Dense / Overwhelming |
| **Structure (Tiering)** | Flat / Monolithic | Perfect Hierarchy | Fractured / Over-fragmented |
| **Tone (Voice)** | Robotic / Sterile | Perfect Resonance ("Dark Sepia") | Overly Theatrical |
| **Form (Formatting)** | Visually Hostile | Perfect Form Mapping | Chaotic Formatting |

### UI Evolution — 3 Metrics

| Metric | 1 | 3 | 5 |
|--------|---|---|---|
| **Topology (Layout)**| Structurally Broken | Perfect Flow | Too Minimal / Empty |
| **Visual Entropy** | Visually Chaotic | Perfect Visual Equilibrium | Sterile / Dead |
| **Aesthetics** | Dissonant / Ugly | Cohesive / Resonant | Visually Overwhelming |

### Platform Architect — 1 Metric

| Metric | 1 | 3 | 5 |
|--------|---|---|---|
| **Interaction Mechanics** | High Friction | Invisible & Fluid | Overly Kinetic |

### Darwin-Gödel — 1 Metric

| Metric | 1 | 3 | 5 |
|--------|---|---|---|
| **Global Fitness** | Catastrophic Regression | Stable Baseline | Evolutionary Leap |

**Mathematical mapping:** 1-to-5 scale → -2 to +2 internal space for Multi-Armed Bandit calculations.

---

## 5. Established Data Contracts

> **The single source of truth for all data schemas is [`data-exchange-protocol.md`](../docs/protocol/data-exchange-protocol.md).**

That document defines the 5 handoffs in the evolutionary loop:

| Handoff | Producer | Consumer | Schema |
|---------|----------|----------|--------|
| 1. Atomic Vote | Platform Architect | Data & Backend | `POST /api/vote` — 8 canonical `metric_name` values, `score` 1-5 |
| 2. Daily Payload | Editor-in-Chief | Backend → UI Templates | `GET /api/payload?day=YYYY-MM-DD` — News Object Schema |
| 3. Telemetry Feed | Data & Backend | Darwin-Gödel | `GET /api/telemetry?generation_id=XXX` — filtered votes |
| 4. Generations Manifest | Darwin-Gödel + Backend | All agents | `GET /api/manifest` — trait scores, fitness, lineage |
| 5. Mutation Request | Darwin-Gödel | UI Evolution | `mutation_request.json` — trait directives + aesthetic references |

### Quick Reference: API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/vote` | Persist atomic vote (validates schema) |
| `GET` | `/api/telemetry` | All votes (optionally `?generation_id=`) |
| `GET` | `/api/payload?day=YYYY-MM-DD` | Daily news payload |
| `GET` | `/api/manifest` | Generations manifest |


---

## 6. Emerging Conventions (Constitutional Rules)

1. **Context Persona Switching (Mask Protocol):** Orchestrator loads one agent manifesto, executes, removes mask.
2. **Atomic Telemetry:** All feedback is numeric (1-to-5 scale). No fuzzy qualitative data.
3. **Explicit Reference Tracking (Fashion Board):** UI Agent must declare aesthetic references explicitly.
4. **Daily Payload Contract:** Editor produces JSON schema, UI templates blindly consume it. Never tightly coupled.
5. **Mandatory Context Provisioning:** All UI buttons/triggers must include tooltips explaining purpose to Operator.
6. **Strict Append-Only Communication Protocol:** `info-exchange.md` follows rigorous logging format per `newspaper-communication-protocol.md`.
7. **Exploit/Explore Dual Engine:** Exploit = programmatic CSS variable swaps for minor traits. Explore = agentic LLM code generation for structural topology mutations.
8. **Mandatory Voting UI (Rule #6):** Every `gen_*.html` MUST embed Global Voting Bar (1-to-5) and Atomic Context Evaluators. UI Agent builds ballot, Data Backend persists votes.
9. **Periodic Info-Exchange Flush (The Condensation Law):** `info-exchange.md` is flushed by the Orchestrator when it exceeds ~50 entries or ~30KB. Relevant state → `system-state.md`, decisions → `evolution-wall.md`. See Section 5 of `newspaper-communication-protocol.md`.
10. **Universal Hover Context (The Golden Rule):** Every semantic element in every `gen_*.html` template MUST carry a `data-tip` attribute. A global tooltip engine (`#tt` div + mouseover JS) renders explanations on hover. No element is silent. Implementation: fixed `#tt` div + `data-tip` attributes + 10-line JS mouseover block. Recommended for `index.html` as well.

---

## 7. Agent Manifestos (Quick Links)

| Agent | Manifesto |
|-------|-----------|
| Orchestrator | `specs/newspaper/orchestrator/manifesto.md` |
| Platform Architect | `specs/newspaper/agents/platform_architect/manifesto.md` |
| Darwin-Gödel Engine | `specs/newspaper/agents/darwin_godel/manifesto.md` |
| Data & Backend | `specs/newspaper/agents/data_backend/manifesto.md` |
| UI Evolution | `specs/newspaper/agents/ui_evolution/manifesto.md` |
| Editor-in-Chief | `specs/newspaper/agents/editor_in_chief/manifesto.md` |

---

## 8. Open Loops (What Has NOT Been Done Yet)

- ✅ **First Mutation Request (MR-001) produced.** Darwin-Gödel Engine consumed real telemetry (7 votes across 5 generations) and output `mr-001-2026-03-25`. CLOSED 2026-03-25T15:44:00.
- ✅ **Editor-in-Chief** produced first real vault-derived payload: `daily_payload_2026-03-25.json` (12 articles). CLOSED 2026-03-25T09:37:00.
- ✅ **Real vault data injected.** `index.html` dynamically fetches payload. CLOSED.
- ✅ **`generations_manifest.json`** created and updated with MR-001 trait scores. CLOSED.
- ✅ **Darwin-Gödel** consumed telemetry, produced MR-001. CLOSED.
- ✅ **Agent Manifestos Updated.** Protocol v1.0.0 enforced. CLOSED 2026-03-25T11:38:00.
- ✅ **Gen 017 A deployed** (Focused Warmth) — first LLM-generated template from a real Mutation Request. CLOSED.
- ✅ **Gen 018 A/B deployed** — Cold Slate (EXPLOIT palette test) + Signal/Noise (EXPLORE full-width topology). CLOSED 2026-03-25T20:00:00.
- ✅ **Gen 019 A/B deployed** — Radical Focus II (EXPLOIT) + Horizontal Chronicle (EXPLORE). CLOSED (date unknown — deployed after 2026-03-25).
- ✅ **Editor Agent fully automated.** `editor_agent_scaffold.py` upgraded to `gemini-2.5-pro`, 30-file scan, ≥5 articles, HTML content, numeric impact scores. `publications/` archive created. CLOSED 2026-04-10.
- ✅ **`daySelector` in `index.html` is now dynamic.** Populated from `GET /api/publications` on startup. No more hardcoded dates. CLOSED 2026-04-10.
- ✅ **Data Exchange Protocol corrected to v1.1.0.** `meta.impact` fixed to float, `meta.risk` corrected, `type` opened, HTML content requirement formalized. CLOSED 2026-04-10.
- ❌ **MR-002 not yet produced.** Darwin-Gödel must ingest votes from Gen 017 A + Gen 018 A/B + Gen 019 A/B to compute next mutation request. Waiting on operator votes.
- ⚠️ **Vote Standardization Migration (In Progress).** Legacy templates (Gen 014, 013, 012, 010/011, mockups) still emit old vote schemas. Priority: Gen 014 → Gen 013 → Gen 012 → Gen 010/011 → Mockups.
- ❌ **`renderTelemetry` in `index.html`** still uses fuzzy matching instead of the 9 canonical `metric_name` buckets.
- ❌ **No cron for Editor trigger.** `POST /api/trigger/editor` exists but no automated daily schedule. Must be called manually or via `python3 editor_agent_scaffold.py`.
- ❌ **Server does not auto-load `.env`.** `GEMINI_API_KEY` must be in environment before starting `evolution_server.py` for the trigger endpoint to work.
- ❌ **Platform Architect: `index.html` tooltip system** — The Golden Rule (Constitutional Rule #10) recommends applying `data-tip` + `#tt` to `index.html` itself. Not yet done.

