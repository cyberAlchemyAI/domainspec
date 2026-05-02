---
tags: [vault, visualization, physics, spacetime, gravity]
node_type: discovery
layer: ontology
module: physics-model
nature: technical
status: in-progress
veracidade: medium
convicção: medium
version: 0.2.0
last_updated: 2026-03-20
---

# Discovery — Visualizing Space-Time Fabric Deformation

## Context

The Ontology Explorer already implements a gravitational physics model where nodes have **mass** (computed via PageRank, betweenness, degree, or epistemic link weights) and that mass determines:

- Node size & repulsion (gravity wells)
- Link distance (orbital tightness)
- Link curvature (differential mass bending)
- Visual auras & persistent labels (high-mass glow)

But the **fabric of space itself** — the medium being deformed — is invisible. The user sees the *effects* of gravity (orbits, clusters, curves) but not the *field* that produces them. In General Relativity, mass warps the geometry of spacetime, and objects follow geodesics in that warped geometry. We want to **make the warp visible**.

The idea: a toggle button ("Show Spacetime Grid") that renders a deformable grid/mesh behind the graph. Massive nodes sink into the grid, creating visible wells. The user can *see* the topology of gravitational influence — not just the nodes, but the field between them.

---

## The Physics Analogy

In GR, the Einstein field equations relate the curvature of spacetime (the metric tensor $g_{\mu\nu}$) to the energy-momentum distribution (mass). The classic teaching tool is the **rubber sheet analogy**: a flat 2D membrane that deforms when you place heavy balls on it. Lighter objects roll toward the wells.

For the Explorer, we don't need full GR. We need a **scalar potential field** — a height map where each point in space has a "depth" proportional to the gravitational influence of nearby nodes. This is closer to Newtonian gravity:

$$\Phi(\vec{r}) = -G \sum_{i} \frac{m_i}{|\vec{r} - \vec{r}_i| + \epsilon}$$

Where:
- $\Phi(\vec{r})$ is the potential at any point in the canvas
- $m_i$ is the computed mass of node $i$
- $\vec{r}_i$ is the position of node $i$
- $G$ is the gravitational constant (already exists as a slider in the UI)
- $\epsilon$ is a softening constant to avoid singularities at node centers (e.g. `20`)

The depth of the grid at any point is `z = Φ(r)`. Massive nodes create deep wells; empty regions stay flat. Overlapping fields from nearby nodes merge into shared valleys (galaxy-cluster-like shapes).

---

## Visual Representation

### 2D Mode — Contour Lines or Color Field

In 2D, we can't displace the grid in Z. Two options:

1. **Heatmap underlay**: render the potential field as a color gradient on a background canvas layer. Deep wells glow warm (e.g. purple/magenta), flat space stays dark. This is cheap — compute a low-res grid (e.g. 50×50), sample $\Phi$ at each cell, map to color, draw with `ctx.fillRect`.

2. **Contour lines (isopotentials)**: draw iso-lines of $\Phi$ — concentric rings around massive nodes that merge where fields overlap. Like a topographic map of gravity. Uses marching squares on the sampled grid.

### 3D Mode — Displaced Mesh (Rubber Sheet)

In 3D, we can literally deform a mesh:

1. Create a `THREE.PlaneGeometry(width, height, subdivisions, subdivisions)` positioned at `y = 0` (or below the graph).
2. For each vertex of the plane, compute $\Phi$ from all nodes and displace the vertex downward by that amount.
3. Use a wireframe material (`THREE.MeshBasicMaterial({ wireframe: true, color: 0x7c6af7, opacity: 0.15 })`) so the deformation is visible but doesn't occlude nodes.
4. Update vertex positions every N frames (not every frame — the potential changes slowly as d3-force settles).

The grid would look like a flat mesh that dips into wells under massive hub nodes, with shallow valleys connecting gravitationally linked clusters.

---

## Key Formulas to Implement

### Potential Field Sampling (both 2D and 3D)

```
for each grid point (gx, gy):
    Φ = 0
    for each node n:
        dx = gx - n.x
        dy = gy - n.y
        dist = sqrt(dx² + dy²) + ε
        Φ -= G * n._mass / dist
    grid[gx][gy] = Φ
```

### Performance: Barnes-Hut or Truncation

With ~200 nodes and a 50×50 grid, that's 500,000 distance calculations per frame. Options:
- **Truncation radius**: skip nodes farther than R from the grid point (e.g. R = 500). Most grid points are only influenced by ~10–20 nearby nodes.
- **Low-res + interpolation**: compute on a 30×30 grid and bilinear-interpolate for finer display.
- **Update throttle**: recompute only every 10 frames or on simulation tick, not on render frame.

### Deformation Depth Scaling

The raw $\Phi$ values will vary wildly. Normalize to a visual range:

```
depth = clamp(Φ / maxΦ, -1, 0) × MAX_DEFORMATION
```

Where `MAX_DEFORMATION` could be ~80 units in 3D (enough to see a well but not so deep it clips through things).

---

## UI Integration

A single toggle button in the control panel:

```
┌─────────────────────────────┐
│  ☐ Show Spacetime Grid      │
└─────────────────────────────┘
```

When toggled:
- **2D**: draws the heatmap/contour layer behind the graph (on a separate canvas or underlay)
- **3D**: adds the deformable wireframe mesh to the Three.js scene
- The grid respects the current gravity strategy and G slider — changing G or mass strategy recomputes the field

State addition: `showSpacetimeGrid: false` in `defaultState()`.

---

## What This Reveals That's Currently Hidden

| Invisible today | Visible with the grid |
|---|---|
| Why two clusters are close | Shared gravity well pulling them into the same valley |
| Where the "empty space" is | Flat regions of the grid = epistemic desert |
| Relative gravitational dominance | Depth of the well = how much a node warps the knowledge space |
| Field interference patterns | Where two massive nodes compete, the grid shows a saddle point |
| The "event horizon" of a hub | The contour where the well gets steep = the boundary of a hub's influence |

---

## Open Questions

1. ~~**Should the grid be below the nodes or at the same plane?**~~ **Answered in v0.2**: Below the nodes, creating the rubber-sheet illusion. Current implementation uses a fixed offset that needs to become dynamic (see known issues).
2. **Animated deformation?** When a node is dragged or the simulation settles, should the grid ripple and settle? (gravitational waves!) — beautiful but potentially expensive.
3. **Interaction with shelves?** In 3D with shelves enabled, should each shelf have its own grid plane, or one global grid projected at the base?

---

## Implementation Status (v0.2)

**Implemented:**
- 3D wireframe mesh (`THREE.PlaneGeometry`, 50×50 subdivisions) with gravitational potential field deformation
- Toggle in control panel (3D-only, purple accent)
- 500ms throttled updates as simulation settles
- Truncation radius optimization (600px cutoff)
- Proper cleanup on toggle-off and graph reinit

**Known Issue — Grid-Node Alignment:**
The mesh sits at a fixed `Y = -80`, but force-graph-3d scatters nodes across all three axes. The grid needs dynamic Y positioning (below the lowest node) and full 3-axis extent calculation to properly wrap the node cloud.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[ontology-visualization/discovery-gravity-strategies]] | `derives-from` | Mass calculation strategies that define the Φ field |
| [[ontology-visualization/vault-explorer-discovery]] | `contextualizes` | Original explorer design |
| [[ontology-visualization/implementation-plan]] | `contextualizes` | Base implementation plan for the explorer |

