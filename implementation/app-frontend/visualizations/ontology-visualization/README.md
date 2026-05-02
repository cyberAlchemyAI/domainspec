---
description: Navigation map and context guide for the Ontology Visualization Explorer.
---

# Ontology Visualization Explorer — Navigation Map

## What is this?

This directory contains the Ontology Visualization Explorer — a Python-driven tool that parses the vault's Markdown frontmatter and wikilinks, builds a graph dataset (`graph_data.json`), and renders it as an interactive 2D/3D web visualization using `3d-force-graph` and `THREE.js`. It also contains discovery and implementation-plan documents for the explorer's features.

## Business Context

The vault is a growing knowledge graph of specs, decisions, and domain definitions. Without tooling, the graph structure is invisible — relationships between nodes are only discoverable by reading files individually. As the graph grows past hundreds of nodes, manual navigation becomes impractical. The explorer provides a visual interface to the same graph that GitNexus indexes programmatically.

## Why it matters

Visual exploration makes structural patterns visible that cannot be detected by reading Markdown: orphaned nodes, hub overload, cross-domain connections, and status distributions. It also serves as a sanity check on ontology health — a disconnected cluster or a massively central node signals a governance problem that needs attention.

## 📁 Navigation

**Tool files:**
- **[explorer.py](explorer.py)**: Central data extraction script. Reads markdown files, parses frontmatter and link tables, resolves dependencies, and builds `graph_data.json`.
- **[explorer.template.html](explorer.template.html)**: Core visualization framework — 2D/3D UI controls, custom rendering pipelines, node interaction, and embedded physics strategies. Modify this, not `explorer.html`.
- **[explorer.html](explorer.html)**: Output file with injected `GRAPH_DATA`. Do not edit directly.
- **[graph_data.json](graph_data.json)**: Generated graph dataset. Regenerate by running `explorer.py`.

**Discoveries:**
- **[vault-explorer-discovery.md](vault-explorer-discovery.md)**: Original discovery — rationale, design decisions, and scope of the visualization tool.
- **[discovery-3d-navigation.md](discovery-3d-navigation.md)**: Discovery for 3D navigation features and shelf-mode layout.
- **[discovery-gravity-strategies.md](discovery-gravity-strategies.md)**: Discovery for physics/gravity strategy options (PageRank, Betweenness, ForceAtlas2, Curvatura Epistêmica, **Hierarchical Orbital Gravity**). All 6 strategies now implemented and selectable.
- **[discovery-progressive-labels.md](discovery-progressive-labels.md)**: Discovery for progressive label rendering based on zoom and mass.
- **[discovery-spacetime-grid.md](discovery-spacetime-grid.md)**: Discovery for the spacetime grid layout mode.
- **[graph-mechanics.md](graph-mechanics.md)**: Reference for graph physics model and mass/gravity configuration.

**Implementation Plans:**
- **[implementation-plan.md](implementation-plan.md)**: Main implementation plan for the explorer.
- **[implementation-plan-3d-navigation.md](implementation-plan-3d-navigation.md)**: Implementation plan for 3D navigation.
- **[implementation-plan-orbital-gravity.md](implementation-plan-orbital-gravity.md)**: Implementation plan for orbital gravity strategies.

---

## 🚀 Latest Features (2026-04-07)

### Hierarchical Orbital Gravity (Strategy 6)
Nodes orbit around their strongest dependencies. Light satellites cluster tightly; heavy satellites push outward. Reveals knowledge hierarchy and emergence as the vault grows.

**UI Controls (now smooth & responsive):**
- `Base Orbital Radius`: Scale of orbital zones (20–150px) — updates during drag
- `Orphan Drift Strength`: Pull of unlinked nodes toward nearest hub (0–1) — real-time feedback
- All parameter sliders now provide immediate visual feedback while dragging (throttled to 100ms for performance)

### Node Size by Mass
Control how much node size varies based on their mass. Subtle variation (1.0) to dramatic hierarchy (3.0). Located in "⚙ Model Parameters." — also smooth during drag.

---

> **To run the explorer:** `python specs/ontology/docs/ontology-visualization/explorer.py` from the repository root, then open `explorer.html` in a browser via `http://localhost:8888` (requires HTTP server for document fetching).
