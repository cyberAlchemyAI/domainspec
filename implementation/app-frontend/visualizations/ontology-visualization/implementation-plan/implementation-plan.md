---
tags: [vault, agents, visualization, ontology]
node_type: implementation-plan
layer: ontology
module: core-engine
nature: technical
status: active
version: 1.0.0
last_updated: 2026-03-19
---

# Ontology Visualization — Implementation Plan

## Objective

Build a **standalone, zero-dependency browser tool** that:
1. Parses `docs/vault/` and `specs/` markdown files (YAML frontmatter + `## Connections` tables)
2. Renders an interactive **2D/3D force-directed graph** of the knowledge graph
3. Lets the user filter, shelve, color, and inspect nodes — all dynamically derived from the actual metadata in the corpus

The tool runs with **one command** from the repo root and opens automatically in the browser. No Django, no npm, no build step.

---

## Deliverables

| File | Role |
|------|------|
| `specs/ontology/ontology-visualization/explorer.py` | Python parser — reads markdown files, emits `graph_data.json` |
| `specs/ontology/ontology-visualization/explorer.html` | Single-file static app — the browser UI |
| `specs/ontology/ontology-visualization/run.sh` | One-line launcher: parse → open browser |

---

## Phase 1 — Parser (`explorer.py`)

### Input
All `.md` files under:
- `docs/vault/` (recursive)
- `specs/` (recursive, excluding `ontology-visualization/` itself)

### Output: `graph_data.json`

```json
{
  "_meta": {
    "node_type": ["axiom", "constitution", "premise", "spec", "conceptual", "business"],
    "layer": ["architecture", "business", "ontology"],
    "status": ["draft", "active", "exploratory", "evergreen"],
    "nature": ["technical", "procedural", "conceptual", "business"],
    "veracidade": ["low", "medium", "high"],
    "convicção": ["low", "medium", "high"],
    "audience": ["agent", "engineer", "product", "tech-lead"],
    "tags": ["..."]
  },
  "nodes": [
    {
      "id": "docs/vault/business/mission.md",
      "label": "mission",
      "path": "docs/vault/business/mission.md",
      "node_type": "business",
      "layer": "business",
      "status": "draft",
      "veracidade": "low",
      "convicção": "high",
      "audience": ["agent", "engineer"],
      "tags": ["business", "mission"]
    }
  ],
  "links": [
    {
      "source": "docs/vault/business/mission.md",
      "target": "docs/vault/ontology-consitution.md",
      "type": "derives-from"
    }
  ]
}
```

### Parser Steps

1. **Walk** both directory trees, collect all `.md` files
2. **Parse YAML frontmatter** using `python-frontmatter` or manual regex (stdlib only preferred)
3. **Extract `## Connections` table** — Regex over the table rows:
   - Column 1: `[[wikilink]]` or plain path → resolve to a file path
   - Column 2: link type (`derives-from`, `contextualizes`, etc.)
   - Column 3: description (stored on the edge)
4. **Resolve wikilinks** — `[[vault/agent-navigation]]` → search for matching file path
5. **Emit** `graph_data.json` into the tool's own folder
6. **Print** summary: N nodes, M edges, K unresolved links

### Stdlib-only constraint
Use only Python stdlib (`re`, `pathlib`, `json`, `os`) — no `pip install` required.

---

## Phase 2 — Browser UI (`explorer.html`)

### Libraries (CDN, no install)
```html
<script src="https://unpkg.com/3d-force-graph"></script>
<script src="https://unpkg.com/force-graph"></script>
```

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  LEFT PANEL (280px)          │  GRAPH CANVAS (flex)  │  SIDEBAR  │
│                              │                        │  (300px,  │
│  🔍 Search...                │   ← force-graph here → │  slides   │
│  ─────────────────────────   │                        │  in on    │
│  VISUAL MODE                 │                        │  click)   │
│  [2D / 3D toggle]            │                        │           │
│  [☐ Enable shelves]          │                        │           │
│  [Shelf by: status ▾]        │                        │           │
│  [Color by: node_type ▾]     │                        │           │
│  ─────────────────────────   │                        │           │
│  ▾ Node Type  (5/6)          │                        │           │
│    ☑ axiom ●                 │                        │           │
│    ☑ constitution ●          │                        │           │
│    ...                       │                        │           │
│  ▾ Layer  (3/3)              │                        │           │
│  ▾ Status  (2/4)             │                        │           │
│  ▾ Nature                    │                        │           │
│  ▾ Veracidade                │                        │           │
│  ▾ Convicção                 │                        │           │
│  ▾ Audience                  │                        │           │
└──────────────────────────────┴────────────────────────┴───────────┘
```

### Graph Behaviour

| Feature | Spec |
|---------|------|
| **2D/3D toggle** | Switches between `force-graph` and `3d-force-graph` instances |
| **Shelves (3D only)** | Z-position of each node is set to `SHELF_SCALE[field][value]` |
| **Filters (AND logic)** | A node is visible only if it matches ALL active filter checkboxes |
| **Search** | Highlights matching nodes, dims others (no removal) |
| **Color by** | Dropdown selects which field drives color; each distinct value gets a fixed hue |
| **Node click** | Opens right sidebar with all metadata + connection list |
| **Edge click / hover** | Highlights edge + its two endpoint nodes |
| **localStorage** | Filter state persisted across reloads |

### Shelf Ordinal Scales

```js
const SHELF_SCALES = {
  status:     { draft: 0, exploratory: 1, active: 2, evergreen: 3 },
  veracidade: { low: 0, medium: 1, high: 2 },
  convicção:  { low: 0, medium: 1, high: 2 },
  layer:      { business: 0, ontology: 1, architecture: 2 },
};
const SHELF_GAP = 120; // px between levels in 3D
```

### Node Sidebar (click to inspect)

```
📄 mission.md
docs/vault/business/mission.md
──────────────────────────────
node_type  : business
layer      : business
status     : draft
veracidade : low
convicção  : high
audience   : agent, engineer
──────────────────────────────
CONNECTIONS
→ derives-from (2)   [clickable — focus target node]
← contextualizes (1)
──────────────────────────────
[Open file path ↗]
```

### Color Palette

Each field value gets a **fixed HSL color** computed deterministically from the value's hash, so colors are stable across reloads and sessions.

### Visual Style
- Dark background (`#0d0d0f`)
- Node glow on hover (`bloom` effect if 3D)
- Minimalist sans-serif font (Inter via Google Fonts)
- Left panel: glass-morphism card (`rgba(255,255,255,0.05)`, blur)

---

## Phase 3 — Launcher (`run.sh`)

```bash
#!/bin/bash
# From repo root:
python specs/ontology/ontology-visualization/explorer.py
open specs/ontology/ontology-visualization/explorer.html   # macOS
# or: xdg-open ... for Linux
```

The HTML file embeds `graph_data.json` inline (via `<script>` tag) so it works without a local HTTP server (avoids CORS).

---

## Implementation Order

1. **`explorer.py`** — parser, outputs `graph_data.json` embedded in `explorer.html`
2. **`explorer.html`** — static UI with 2D graph, filters, search, sidebar
3. **3D mode + shelves** — extend the renderer
4. **`run.sh`** — one-command launcher
5. **Polish** — color by, localStorage, UX fine-tuning

---

## Non-Goals (v1)

- No authentication, no server
- No real-time file watching (run script again to refresh)
- No write-back / editing of frontmatter from the UI
- No npm, no build step, no venv required

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `specs/ontology/ontology-visualization/vault-explorer-discovery.md` | `derives-from` | This plan implements the design decisions in the discovery |
| `docs/vault/ontology-consitution.md` | `derives-from` | Frontmatter schema and connection types defined there |
| `docs/vault/agent-navigation.md` | `contextualizes` | Explorer complements text-based agent navigation |
