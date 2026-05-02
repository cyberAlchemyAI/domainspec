---
tags: [vault, agents, visualization]
node_type: discovery
is_session: true
layer: ontology
module: core-engine
nature: technical
status: active
veracidade: low
convicção: medium
version: 0.3.0
last_updated: 2026-03-19
---

# ZefraHub Vault Explorer — Discovery & Design Plan

## Objective
Create a standalone, visually minimal web application for exploring the ZefraHub Vault knowledge graph. The app parses markdown files in `docs/vault/` and `specs/`, extracts frontmatter classification labels and link edges, and renders an interactive graph.

A human must be able to:
1. **Filter** the visible graph by any frontmatter label — not just one or two hardcoded axes.
2. **Shelve** the graph (3D Z-axis) by any ordinal label of their choosing, not a fixed field.
3. **Navigate** quickly to any document via search, click, and sidebar detail.

## Architecture & Location

Tool lives in **`/specs/ontology/ontology-visualization/`** — isolated from Django, domain logic, and frontend.

> **Authoritative reference for runtime behavior:** See [graph-mechanics.md](file:///Users/victorboscaro/house_project/specs/ontology/ontology-visualization/graph-mechanics.md) for the complete, up-to-date specification of all physics, visual, camera, and UI rules. This discovery document captures the *original design intent* and high-level architecture.

---

### 1. Parser: `specs/ontology/ontology-visualization/explorer.py`

A Python script that generates the data layer:

| Phase | What it does |
|-------|-------------|
| 1 | Traverse `docs/vault/` and `specs/` for `.md` files |
| 2 | Parse YAML frontmatter — capture all known label fields |
| 3 | Parse `## Connections` tables → directional edges (`source`, `target`, `type`) |
| 4 | Compile nodes + links into JSON and inject into the HTML template |

**Frontmatter fields tracked per node:**

| Field | Example values |
|-------|---------------|
| `node_type` | axiom, constitution, premise, spec, conceptual, business |
| `layer` | architecture, business, ontology |
| `status` | draft, active, exploratory, evergreen |
| `nature` | technical, procedural, conceptual, business |
| `veracidade` | low, medium, high |
| `convicção` | low, medium, high |
| `audience` | agent, engineer, product, tech-lead |
| `tags` | free-form list |

---

### 2. GUI: `specs/ontology/ontology-visualization/explorer.template.html`

A single-file static HTML application.

#### Renderer
- `3d-force-graph` (3D mode) and `force-graph` (2D mode) from unpkg CDNs.
- Dark mode, minimalist. Hover highlights and glowing link edges.

---

#### Control Panel — Full Specification

The left-side panel is organized in **collapsible sections**, one per filterable label. Each section shows a colored badge per distinct value and a checkbox to toggle visibility. All sections are independent — filters stack (AND logic).

```
┌─────────────────────────────┐
│  🔍  Search nodes...         │  ← text input, filters by title/path
├─────────────────────────────┤
│  VISUAL MODE                │
│  [ ] 2D / 3D toggle         │
│  [ ] Enable Shelves         │
│  Shelf Dimension: [status ▾]│  ← dropdown, see §Shelf Dimension
├─────────────────────────────┤
│  ▾ Node Type                │  ← collapsible
│  ☑ axiom (●)                │
│  ☑ constitution (●)         │
│  ☑ premise (●)              │
│  ☑ spec (●)                 │
│  ☑ conceptual (●)           │
│  ☑ business (●)             │
├─────────────────────────────┤
│  ▾ Layer                    │
│  ☑ architecture (●)         │
│  ☑ business (●)             │
│  ☑ ontology (●)             │
│  ☑ (undefined) (●)          │
├─────────────────────────────┤
│  ▾ Status                   │
│  ☑ draft (●)                │
│  ☑ active (●)               │
│  ☑ exploratory (●)          │
│  ☑ evergreen (●)            │
├─────────────────────────────┤
│  ▾ Nature                   │
│  ☑ technical (●)            │
│  ☑ procedural (●)           │
│  ☑ conceptual (●)           │
│  ☑ business (●)             │
├─────────────────────────────┤
│  ▾ Veracidade               │
│  ☑ low (●)                  │
│  ☑ medium (●)               │
│  ☑ high (●)                 │
├─────────────────────────────┤
│  ▾ Convicção                │
│  ☑ low (●)                  │
│  ☑ medium (●)               │
│  ☑ high (●)                 │
├─────────────────────────────┤
│  ▾ Audience                 │
│  ☑ agent (●)                │
│  ☑ engineer (●)             │
│  ☑ product (●)              │
│  ☑ tech-lead (●)            │
└─────────────────────────────┘
```

**UX rules:**
- Section headers show a count badge: **Node Type (3/7 active)**.
- "Select all / Clear" quick-action buttons per section.
- Sections for fields where no document has a value are hidden.
- Values not present in any currently visible node are greyed out (not removed).

---

#### Shelf Dimension — Selectable Z-Axis

When **Shelves** are enabled in 3D mode, a **"Shelf Dimension"** dropdown appears. The user can select any of these ordinal fields:

| Dimension | Ordinal scale (bottom → top) |
|-----------|------------------------------|
| `status` | draft → exploratory → active → evergreen |
| `veracidade` | low → medium → high |
| `convicção` | low → medium → high |
| `layer` | business → ontology → architecture |

The selected field maps each node to a Z-band. Nodes without that field float at the base level.

**Why it matters:** A human can instantly ask questions like:
- *"Where are my high-conviction, draft-status nodes?"* → shelf by `status`, filter `convicção=high`
- *"Which architecture-layer documents have low veracidade?"* → filter `layer=architecture`, shelf by `veracidade`

---

#### Node Color

Each filter section can independently drive the **node color mode**. A "Color by" dropdown at the top selects which label field drives node color:

| Color by | Effect |
|----------|--------|
| `node_type` | Default — matches the "Epistemic Role" palette |
| `layer` | Colors group documents by knowledge layer |
| `status` | Traffic-light: draft=red, active=green, evergreen=cyan |
| `veracidade` | Red→yellow→green gradient |
| `convicção` | Red→yellow→green gradient |

---

#### Node Sidebar (click to inspect)

Clicking any node opens a right-side panel:

```
┌─────────────────────────────┐
│  📄 mission.md              │
│  business/mission           │
├─────────────────────────────┤
│  node_type  : business      │
│  layer      : business      │
│  status     : draft         │
│  veracidade : low           │
│  convicção  : high          │
│  audience   : agent, eng.   │
├─────────────────────────────┤
│  CONNECTIONS                │
│  → derives-from (3)         │
│  ← contextualizes (1)       │
├─────────────────────────────┤
│  [Open in editor ↗]         │
└─────────────────────────────┘
```

Clicking a connection target highlights the target node + its edges in the graph.

---

## Implementation Notes

- The control panel state is serialized to `localStorage` so filter presets survive page reload.
- The "Search" input immediately highlights matching nodes and dims non-matching ones (does not remove).
- The parser must emit a `_meta` block in the JSON with all discovered distinct values per field so the UI can build checkboxes dynamically — no hardcoded label lists in the HTML.
- All filter sections and the color-by/shelf-by dropdowns are built dynamically from `_meta`.

## Rationale for Location
Keeps exploratory tooling isolated from Django, `/domains/` logic, and `/frontend/`, providing a clean boundary for graph tools and agent tasks.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[vault/agent-navigation]] | `contextualizes` | Explorer complements text-based agent navigation with visual graph exploration |
