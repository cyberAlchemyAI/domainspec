# Implementation Plan — Hierarchical Orbital Gravity

**Date:** 2026-03-20
**Completed:** 2026-04-07
**Module:** Ontology Visualization / Physics Model
**Status:** ✅ Completed

## Goal Description
Implement a true n-body celestial mechanics model ("Hierarchical Orbital Gravity") where massive nodes (stars) attract lighter nodes (satellites) into steady orbits, while repelling other massive nodes to prevent overlapping. This creates distinct, readable clusters organized around foundational business documents without allowing massive hubs to clump together.

## Proposed Changes

### 1. New Gravity Strategy Definition
Add `Strategy 6: Hierarchical Orbital Gravity` to the `GRAVITY_STRATEGIES` array in `specs/ontology/ontology-visualization/explorer.template.html`.

**Formula Configuration:**
- Mass calculation can remain identical to PageRank + In-degree or Betweenness (e.g., `mass = (pagerank/maxPR * a) + log(1+deg)`).
- The difference lies in the **forces applied** during the physics simulation.

### 2. Custom D3 Force Implementation
Create a custom force function in `explorer.template.html` named `forceOrbitalGravity(alpha)`.
- **Purpose**: Iterate over all nodes during each simulation tick.
- **Logic**: For each low-mass node, find the nearest high-mass node (within a configurable `influence_radius`). Calculate the distance vector and apply a velocity (`vx, vy, vz`) to pull the low-mass node toward the heavy node.
- **Exclusion**: The existing `collide` force (which uses a large exclusion zone for heavy nodes) will prevent the light nodes from crashing perfectly into the center of the heavy node, effectively pushing them into a stable "orbit" ring resting against the collision boundary.

### 3. Mass-Differential Link Strengths
Modify the `graph.d3Force('link')` setup in `setPhysics`:
- **For Heavy ↔ Light edges**: Increase `strength` to lock satellites tightly into the orbit of their parent hub. Link `distance` should be proportional to `heavyNode.mass`.
- **For Heavy ↔ Heavy edges**: Decrease `strength` drastically. This bungee-like connection prevents two massive hubs from violently pulling each other, respecting their massive exclusionary charge radii, allowing distinct "galaxies" to form.

### 4. UI Controls
Add UI slider controls for:
- `Orbital Distance`: Base radius distance for satellites.
- `Hub Repulsion`: Modifier for heavy-heavy link weakness.

## Verification Plan
### Automated Tests
- *(No automated tests for UI visualization physics; relies on manual testing)*

### Manual Verification
1. Open the updated `explorer.html`.
2. Select the "Hierarchical Orbital Gravity" strategy from the Layout Strategy dropdown.
3. Verify that heavy nodes form distinct, well-separated centers.
4. Verify that light nodes tightly cluster in rings/orbits around their respective nearest heavy nodes.

---

## ✅ Implementation Complete (2026-04-07)

### What Was Implemented

**Core Mechanics:**
- Custom d3-force function `forceOrbitalGravity()` that pulls nodes toward their orbital hubs
- Hub selection algorithm: `orbit_score = LINK_WEIGHTS[linkType] × neighbor.mass`
- Orbital distance formula: `max(minDist, baseRadius / satelliteMass)`
- Orphan fallback: unlinked nodes drift toward nearest heavy hub by spatial proximity

**UI Controls:**
- Strategy selector showing "Hierarchical Orbital" option
- `Base Orbital Radius` parameter (20–150px, default 50)
- `Orphan Drift Strength` parameter (0–1, default 0.5)
- Both parameters updated dynamically without reheat

**Additional Enhancement:**
- **Node Size by Mass** parameter (0–3) added globally
- Controls size variation based on mass (subtle to strong hierarchy)
- Located in "⚙ Model Parameters" section

### Code Changes
- `explorer.template.html`: +450 lines (strategy definition, orbital force, UI, state management)
- `explorer.html`: Regenerated with embedded graph data
- STATE_VERSION: 13 → 14

### Design Decisions
1. **Lighter satellites orbit closer** — reveals hierarchy through visual clustering
2. **Dual-factor hub selection** — edge strength × hub mass (not just one factor)
3. **Subtle node size scaling** — enhances without overwhelming
4. **Orphan drift fallback** — ensures no isolated nodes when links are sparse

### Testing
- All 6 strategies selectable and functional
- Mass recalculation works per strategy
- Node sizes update when strategy changes (if `nodeSizeByMass` > 0)
- Orbital mechanics stable and visually clear
- UI responsive to all parameter changes

### Known Behavior
- Mass recalculation happens on strategy change (visible in node size if scaling enabled)
- Orphans defined as nodes with zero incoming links
- Minimum orbital distance prevents hub-satellite collapse
- Physics simulation reheats for force-related changes, but not for visual-only changes

---

## 🔧 Parameter Smoothness Fix (2026-04-07 — Commit 7402892)

### Issue
Parameters were unresponsive during dragging. Physics simulation only updated on slider release (`onchange`), not during drag (`oninput`), making parameter tuning feel sluggish.

### Fix Applied
Implemented throttled `oninput` handlers for all three key sliders:

**Base Orbital Radius:**
- Now updates orbital distances smoothly during drag
- Physics recalculates every ~100ms while dragging
- Final update on release ensures all changes captured

**Orphan Drift Strength:**
- Physics updates during drag instead of waiting for release
- Provides immediate visual feedback as user adjusts pull strength

**Node Size by Mass:**
- Visual updates now happen during drag (no physics reheat)
- Throttled to 100ms for smooth resize feedback

### Implementation Details
```javascript
// Before: Only display updated during drag, physics on release
oninput → display only
onchange → full physics recalc (delayed)

// After: Immediate state + throttled physics
oninput → state update + throttled physics (100ms)
onchange → final state + physics (clears pending throttle)
```

### Result
- All parameter sliders now feel responsive and smooth
- Users get real-time visual feedback while adjusting orbital mechanics
- Performance maintained through 100ms throttling (prevents excessive recalculation)
- No changes to core algorithm, only interaction smoothness
