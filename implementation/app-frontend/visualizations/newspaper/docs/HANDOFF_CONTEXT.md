---
type: handoff
status: active
description: Ultra-dense context transfer for the next Agent session.
layer: application, ontology
last_updated: 2026-04-10 (k9p2x)
---

# AGENT HANDOFF CONTEXT: THE GENETIC PLATFORM

> **ATTENTION NEXT AGENT:** Read this before doing anything. This is a compressed mental model of the entire Evolution Platform we just built.

## 1. What was built
We overhauled `specs/newspaper/evolution/`. We abandoned static layout planning and built a **Gödel Machine UI** (`index.html`) that allows the user to browse, mutate, and evaluate (vote on) HTML generations (`gen_008` through `gen_014`).

- **The Platform (`index.html`):** A macroscopic "Matrix" view. It hosts sidebar navigation, handles iframe cross-fades, and injects a mock JSON payload (`window.currentPayload`) directly into the templates.
- **Telemetry (`localStorage: zefracorp_evolution_data_v1`):** The platform exposes `window.registerAtomicVote(data)`. The child iframes (the mutated templates) call this when the user clicks a component vote button. 
- **Data-Driven Templates (`gen_014`):** The newest templates (`gen_014_a` and `gen_014_b`) have NO hardcoded news. They contain JavaScript that parses `window.parent.currentPayload` to render HTML blocks dynamically.

## 2. The Current AESTHETICS CONSTITUTION
We overwrote the old design laws. The new laws are "Mutable Constraints" (*Challengeable Traits*). As of Gen 013/014, the active constraints are:
1. **Instant Dismissal:** No more 3-second delays for side panels. Click outside = instant close.
2. **Ubiquitous Hover:** ALL interactive elements must have a highly visible hover state to lower cognitive friction (Entropy = 0).
3. **Definitive Atomic Voting:** The act of voting inside a template must instantly change the button state to a permanent `✓ VOTED & SYNCED` visual lock to provide absolute feedback.
4. **Context First:** The user must instantly know *where* news came from before reading it (Tagging, Impact Scoring).

## 3. The Data Payload (What you are rendering)

Templates consume the payload via `window.parent.currentPayload`. The full schema is in `data-exchange-protocol.md` (v1.2.0). Key fields:

```json
{
  "metadata": { "date": "2026-04-10", "stats": { "sessions": 28, "decisions": 28, "spec_changes": 30 } },
  "articles": [
    {
      "id": "node_1",
      "type": "architectural_decision",
      "tag": "Ontology | Pipeline",
      "title": "Example Title",
      "body": "<p><strong>What changed and what it enables</strong> — single dense HTML paragraph. Business-focused, opinionated. Use <strong> for decisions/risks, <code> for technical identifiers.</p>",
      "meta": { "impact": 9.5, "risk": "low", "source_files": ["path/to/file.md"] }
    }
  ]
}
```

**Critical:** `body` is a single HTML string injected via `innerHTML`. No exec/tech/graph tiers. No labels inside the body.
**Minimum:** 5 articles per edition.
**source_files:** exact vault filenames that contributed to the article — rendered as clickable links in the UI (feature pending implementation).

## 4. Editor Agent — Live as of 2026-04-10

✅ `editor_agent_scaffold.py` is **live and functional**. It:
- Reads up to 100 recent vault files, capped at `MAX_CHARS_PER_FILE = 1750` chars each (tunable constant at top of file)
- Calls `gemini-2.5-pro`
- Produces ≥5 articles in the **Business Philosopher voice** (see `docs/business-philosopher/write-style.md`)
- Single `body` field per article — no exec/tech/graph tiers
- Includes a few-shot reference example in the prompt (Domain-Tagging Constitution article)
- Saves to `publications/daily_payload_YYYY-MM-DD.json`
- Keeps a root copy at `daily_payload.json` for backward compat

**To run:** `set -a && source .env && set +a && python3 specs/newspaper/evolution/editor_agent_scaffold.py`

**To trigger via API:** `POST /api/trigger/editor` (note: server must be started with `.env` loaded for `GEMINI_API_KEY` to be inherited by the subprocess)

## 5. Publications Archive — Live as of 2026-04-10

Editions accumulate in `specs/newspaper/evolution/publications/`. The `daySelector` in `index.html` now populates dynamically from `GET /api/publications` — no hardcoding needed.

Current editions: `2026-03-25` (Edição 001), `2026-04-10` (Edição 002).

## 6. Next Steps for the Next Agent

1. **Vote on gen_019_a/b** — both have 0 votes, blocking MR-003. Or skip the queue and create MR-003 + gen_020 manually with a **Solarpunk × Horizontal Chronicle crossover** (gen_011_a's 3.5/5 aesthetic × gen_014_b's 5/5 topology).
2. **Source files clickable links** — `meta.source_files` filenames need a UI implementation: backend `GET /api/file?path=...` endpoint + frontend rendering as clickable links that open the full document.
3. **Regenerate today's payload** — the new prompt (Business Philosopher voice, single body, few-shot example) hasn't been run yet. Trigger it via `POST /api/trigger/editor` or run directly.
4. **Add `.env` auto-load to `evolution_server.py`** so `POST /api/trigger/editor` works without pre-loading env manually.
5. **Fix loreDatabase keys for gen_019** in `index.html` — currently keyed as `'evolution/gen_019_...'` but should be `'gen_019_...'` (no prefix) to match what `buildGenerationsData` produces from the manifest.
