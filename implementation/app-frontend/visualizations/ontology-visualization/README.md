---
tags: [ontology, visualization, explorer, graph]
node_type: readme
is_session: false
layer: ontology, architecture
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Ontology Visualization Explorer

## What is this?

A Python-driven tool that parses the vault's Markdown frontmatter and wikilinks, builds a graph dataset (`graph_data.json`), and renders it as an interactive 2D/3D web visualization using `3d-force-graph` and `THREE.js`. Also hosts discovery and implementation-plan documents for the explorer's features.

## Business Context

The vault is a growing knowledge graph of specs, decisions, and domain definitions. Without tooling, the graph structure is invisible — relationships between nodes are only discoverable by reading files individually. As the graph grows past hundreds of nodes, manual navigation becomes impractical. The explorer provides a visual interface to the same graph that GitNexus indexes programmatically.

## Why it matters

Visual exploration makes structural patterns visible that cannot be detected by reading Markdown: orphaned nodes, hub overload, cross-domain connections, and status distributions. It also serves as a sanity check on ontology health — a disconnected cluster or a massively central node signals a governance problem that needs attention.

## 📁 Navigation

**Tool files:**
- **[explorer.py](explorer.py)**: Central data extraction script. Reads markdown files, parses frontmatter and link tables, resolves dependencies, and builds `graph_data.json`.
- **[explorer.template.html](explorer.template.html)**: Core visualization framework — 2D/3D UI controls, custom rendering pipelines, node interaction, embedded physics strategies. Modify this, not `explorer.html`.
- **[explorer.html](explorer.html)**: Output file with injected `GRAPH_DATA`. Do not edit directly.
- **[graph_data.json](graph_data.json)**: Generated graph dataset. Regenerate by running `explorer.py`.
- **[index.html](index.html)**: Static landing/index page for the explorer surface.
- **[graph-mechanics.md](graph-mechanics.md)**: Reference for the graph physics model and mass/gravity configuration.

**Subfolders:**
- **`discovery/`**: Discovery documents — rationale, design decisions, and scope across vault explorer, 3D navigation, gravity strategies, progressive labels, and spacetime grid.
- **`implementation-plan/`**: Implementation plans for the explorer, 3D navigation, and orbital gravity strategies.
- **`__pycache__/`**: Python bytecode cache (auto-generated; do not edit).

## Runtime

`python explorer.py` from this directory regenerates `graph_data.json` and `explorer.html`. Open `explorer.html` via an HTTP server (e.g., `http://localhost:8888`) — direct `file://` loads will fail document-fetch checks.

## Feature Notes

### Hierarchical Orbital Gravity (Strategy 6)
Nodes orbit around their strongest dependencies. Light satellites cluster tightly; heavy satellites push outward. Reveals knowledge hierarchy and emergence as the vault grows.

UI controls (smooth/responsive):
- `Base Orbital Radius`: 20–150px, updates during drag.
- `Orphan Drift Strength`: 0–1, real-time feedback.
- All parameter sliders provide immediate visual feedback while dragging (throttled to 100ms).

### Node Size by Mass
Controls how much node size varies with mass. Subtle variation (1.0) to dramatic hierarchy (3.0). Located in "⚙ Model Parameters."
