---
title: Graph Mechanics Reference
nature: conceptual
status: active
layer: ontology
audience: internal
---

# Graph Mechanics Reference

> How the Ontology Explorer renders, positions, and animates every node and edge you see on screen.

This document explains each behavioral rule powering the visualization. It's organized by system: **physics → visual → interaction → camera**.

---

## 1. The Gravity Engine

### 1.0 The Electrostatic Analogy — What We're Actually Modeling

The visualization uses a **gravitational metaphor** in its UI language — "mass", "gravity", "orbits" — but the underlying physics model is **electrostatic repulsion + springs**, not Newtonian gravity.

| | Real Gravity | Our Model |
|---|---|---|
| **Mass causes…** | Attraction (F = G·m₁·m₂/r²) | Repulsion (stronger push) |
| **Two unconnected heavy nodes…** | Pull toward each other | Flee from each other |
| **Attraction comes from…** | Mass itself | Explicit edges (springs) |
| **Equilibrium** | Orbits (dynamic) | Settlement (static) |

**Why heavy nodes end up central anyway**: Even though mass causes *repulsion*, heavy nodes have many edges (springs) pulling them toward the geometric mean of their neighbors. The equilibrium of "strong outward push + many inward springs" naturally places them at the hub of their cluster. The result *looks* gravitational — but it emerges from electrostatic repulsion, not attraction.

> The gravitational metaphor is kept because it's **intuitive** — "this document has more mass in the system" communicates the right idea even if the math underneath is inverted.

### 1.1 Charge (Repulsion)

The entire graph layout is driven by **d3-force** — a physics simulation that treats nodes as charged particles and edges as springs. Every frame, the simulation calculates repulsion, attraction, and collision forces, then updates each node's position.

Every node pushes every other node away. Heavier nodes push **harder**.

```
repulsion = -(100 + mass^exp × 40 × G)
```

- `mass` = the node's computed gravitational mass (see §1.4)
- `exp` = the **Mass Exponent** parameter (default `1.0`, range `0.5–2.0`). See §1.7.
- `G` = the global Physics Intensity slider (default `1.0`)

**Effect**: High-mass nodes (like axioms or constitutions with many citations) carve out large empty zones around themselves, while low-mass satellites crowd together in the gaps. This is why your "star" documents always sit at the center with lots of breathing room.

### 1.2 Link Distance (Springs)

Each edge acts like a spring with a variable rest length. The rule:

```
distance = max(30 + heavyFloor, 300 / (log(1 + combinedMass) × G))
```

Where:
- `combinedMass` = source mass + target mass
- `heavyFloor` = if both endpoints have mass > 2 → `min(sourceMass, targetMass) × 15`

**Effect**: Two high-mass nodes connected by an edge stay farther apart than two light nodes. This prevents your "stars" from merging into a single blob — they orbit each other at a respectful distance, like a binary star system.

### 1.3 Collision

A physical exclusion zone around each node that prevents overlap:

```
collisionRadius = 5 + massNorm^exp × 55 × √G
```

Where `massNorm` is mass normalized to `[0, 1]` relative to the heaviest node.

**Effect**: Light nodes have a ~5px "personal space". The heaviest node in the graph can have up to ~60px. This makes clusters readable even when the simulation settles.

### 1.4 Mass Formulas (Gravity Strategies)

Mass is the single most important number per node. It controls repulsion strength, collision radius, link distance, node size, label visibility, aura intensity, and link particle speed. You can switch between **five strategies** via the dropdown. Each strategy only changes **how mass is calculated** — the force formulas (§1.1–1.3) stay the same.

| Strategy | Formula | What it rewards |
|---|---|---|
| **PageRank + In-degree** (default) | `(pagerank / maxPR × α) + log(1 + in_degree)` | Authority + citation count |
| **Betweenness + Degree** | `betweenness_norm × β + log(1 + degree)` | Bridge nodes that connect clusters |
| **Degree Puro** | `log(1 + degree) × γ` | Raw connectivity, ignoring quality |
| **ForceAtlas2 (Central)** | `(degree + 1) × δ` | Linear degree with central radial pull |
| **Curvatura Epistêmica** | `weighted_in × ε + log(1 + degree)` | Citation quality (derives-from > contextualizes) |

Each strategy has a tunable parameter (α, β, γ, δ, ε) controllable via the slider below the dropdown. Changing the strategy **recalculates mass for all nodes**, then reheats the simulation so the graph reorganizes. The force formulas themselves are never modified — only the mass input changes.

#### Strategy Deep-Dives

##### PageRank + In-degree (default)

**In one sentence**: Nodes that are cited by other important nodes rise to the top.

**Intuition**: Imagine every document in the vault casts a "vote" for the documents it references. But not all votes are equal — a vote from an already-important document counts more. PageRank captures this recursive authority. The `log(1 + in_degree)` term adds a floor: even if a node is cited by 10 obscure documents, the sheer volume of citations still gives it some mass.

**When to use**: Default for general exploration. Shows the "natural hierarchy" of the knowledge graph — foundational axioms and heavily-cited specs rise to the center.

**The math**: PageRank runs 20 iterations with damping factor 0.85 (the classic Google formula). Nodes with no outgoing edges distribute their rank evenly ("dangling node" handling). The parameter `α` (PR Weight) controls how much PageRank dominates — at α=1, it's mostly in-degree; at α=20, PageRank almost fully determines mass.

##### Betweenness + Degree

**In one sentence**: Bridge documents that sit on the shortest path between other documents get rewarded.

**Intuition**: Some documents aren't heavily cited, but they're the **only connection** between two otherwise-isolated clusters. They're like bridges between islands — without them, entire groups of documents become unreachable. Betweenness centrality measures this: "how many shortest paths in the entire graph pass through me?"

**When to use**: When you want to find **structural bottlenecks** — documents whose removal would fragment the knowledge graph.

**The math**: Uses Brandes' algorithm (O(V·E)) to compute betweenness centrality, normalized to `[0, 1]`. The parameter `β` (Bridge Weight) controls how much betweenness dominates vs. raw degree. At β=1, it's mostly degree; at β=20, bridge nodes dominate massively.

##### Degree Puro

**In one sentence**: Pure connectivity count, no quality weighting.

**Intuition**: Doesn't care *who* links to you or *what kind* of link it is. A `contextualizes` counts the same as a `derives-from`. A link from a random session node counts the same as one from a foundational axiom. This is the "democratic" strategy where every connection is equal.

**When to use**: When you suspect PageRank is over-rewarding a few elite nodes and want to see the graph's raw connectivity structure.

**The math**: `log(1 + degree) × γ`. The logarithm prevents extreme-degree nodes from totally dominating. The parameter `γ` (Degree Scale) is a linear multiplier — at γ=1 the effect is subtle, at γ=10 high-degree nodes become very heavy.

##### ForceAtlas2 (Central)

**In one sentence**: An algorithm designed for publication-quality graph layouts, with a built-in radial force.

**Intuition**: ForceAtlas2 was designed by the Gephi team specifically for making graphs look good. Its key insight: instead of just repulsion + springs, add a **central gravity** that pulls everything inward. But the pull is inversely proportional to mass — lighter nodes feel it more, heavier nodes resist. This prevents the "explosion" problem where low-degree peripheral nodes drift infinitely outward.

**When to use**: When the graph feels too scattered and you want a denser, more compact layout. Also useful for presentation screenshots.

**The math**: Mass = `(degree + 1) × δ`. The `+1` prevents zero-mass nodes. Additionally, this strategy activates a **radial force**: `strength = δ / mass`. This means a node with mass 10 feels 10× less central pull than one with mass 1 — heavy hubs anchor in place while satellites spiral inward.

##### Curvatura Epistêmica

**In one sentence**: Not all citations are equal — a `derives-from` link carries more weight than a `contextualizes`.

**Intuition**: In your ontology, different link types carry different epistemic weight. A document that `derives-from` another is making a strong dependency claim. One that merely `contextualizes` is providing background color. This strategy weights incoming edges by their semantic strength, so nodes that are the foundation for derivation chains become heavier than those that merely get mentioned in passing.

**When to use**: When you want the graph to reflect the **epistemic hierarchy** of the vault — the knowledge derivation chain rather than raw popularity.

**The math**: Each incoming link contributes its type weight (see table below) multiplied by `ε`. Added to `log(1 + degree)` as a floor.

#### Link Type Weights (Epistemic Curvature)

When using Curvatura Epistêmica, incoming edges are weighted by type:

| Link Type | Weight | Rationale |
|---|---|---|
| `derives-from` | 3.0 | Strongest dependency — "I wouldn't exist without this" |
| `validates` | 2.5 | Formal verification — "I prove this is correct" |
| `extends` | 2.0 | Building on top — "I add to this" |
| `contradicts` | 2.0 | Equally strong — "I disagree with this" |
| `exemplifies` | 1.5 | Illustration — "I'm a concrete case of this" |
| `contextualizes` | 1.0 | Background — "I mention this for context" |

A node that receives three `derives-from` links weighs more than one that receives ten `contextualizes` links.

### 1.5 ForceAtlas2 Central Gravity

Only active when the ForceAtlas2 strategy is selected. Adds a **radial force** pulling all nodes toward the center:

```
radialStrength = δ / mass
```

Light nodes feel the pull more than heavy ones. This prevents the graph from exploding outward — low-degree peripheral nodes get tugged inward while heavy hubs resist. The result is a denser, more compact layout.

### 1.6 Simulation Decay

The simulation is not perpetual:
- **Alpha decay**: `0.015` — simulation slowly cools toward equilibrium
- **Velocity decay**: `0.3` — nodes lose 30% of their velocity each tick

When you change filters or strategies, the simulation reheats (`d3ReheatSimulation`) to let nodes find their new equilibrium positions.

### 1.7 Mass Exponent

The **Mass Exponent** parameter (`exp`) controls how mass scales in the force formulas. Found in the **Model Parameters** section.

```
chargeStrength = -(100 + mass^exp × 40 × G)
collisionRadius = 5 + massNorm^exp × 55 × √G
```

| Value | Name | Effect |
|---|---|---|
| `0.5` | Sub-linear | Heavy nodes are *less* dominant. Differences between high-mass and low-mass flatten out. More egalitarian layout. |
| `1.0` | Linear (default) | Current behavior. Mass contributes proportionally. |
| `1.5` | Super-linear | Heavy nodes are noticeably more dominant. Stars create larger voids. |
| `2.0` | Quadratic | Heavy nodes dominate dramatically. The heaviest document creates an enormous exclusion zone. Satellites cluster tightly in distant gaps. |

> **Intuition**: At `exp=1.0`, a node with mass 10 is 10× stronger than mass 1. At `exp=2.0`, it's 100× stronger. At `exp=0.5`, it's only ~3.2× stronger. This parameter lets you control **how much inequality** the layout expresses.

---

## 2. Visual Rendering

### 2.1 Node Sizing

```
radius = 3 + log(1 + degree) × 2.5
```

An isolated node (`degree=0`) has radius 3. A node with 20 connections has radius ~10.5. The logarithm prevents extreme-degree nodes from dominating the canvas.

### 2.2 Node Coloring

Nodes are colored by a categorical field (default: `node_type`). Each type has a hand-picked color:

| Type | Color | Hex |
|---|---|---|
| axiom | vivid pink | `#f06292` |
| premise | warm orange | `#ff8a65` |
| constitution | sky blue | `#7ecbff` |
| discovery | amber/gold | `#ffd54f` |
| implementation-plan | teal | `#4dd0e1` |
| spec | green | `#81c784` |
| audit | coral/red | `#ef5350` |
| conceptual | purple | `#ba68c8` |
| test | light green | `#aed581` |

You can switch the color field to `layer`, `status`, `nature`, etc. via the "Color by" dropdown.

### 2.3 Progressive Labels

Not all labels are shown at all times. A label appears only when:

```
labelScore = massNorm × zoom > 0.25
```

Where `zoom` = `globalScale` (2D) or `600 / cameraDistance` (3D).

- Labels **fade in** over a range of `0.5` above the threshold — no abrupt pop-in
- Nodes below `massNorm = 0.02` **never** show persistent labels regardless of zoom
- Labels wrap at word boundaries, max 3 lines, truncated with `…`
- Font opacity scales with mass — heavier nodes have brighter labels

**Why it works this way**: Showing all labels makes the graph unreadable. This rule ensures that as you zoom in, labels progressively reveal themselves, with the most important nodes always visible first.

### 2.4 Aura Glow

Nodes with `massNorm ≥ 0.15` get a radial gradient aura:

- **2D**: Canvas radial gradient from the node color to transparent
- **3D**: A translucent sphere with additive blending (literally glows)

The aura radius scales with mass. This creates the "gravity well" visual — heavy nodes look like they have a field of influence.

### 2.5 Link Rendering

Links encode gravity information visually:

| Property | Formula | Effect |
|---|---|---|
| **Color opacity** | `0.25 + (combinedMass / 20) × 0.30` | Links between heavy nodes are brighter |
| **Width** | `1.0 + (combinedMass / 20) × 1.8` | Heavier connections are thicker |
| **Curvature** | `0.05 + massDiffRatio × 0.2` | Asymmetric links curve more (satellite → star) |
| **Particles** | `floor(combinedMass / 4) + 1` (max 4) | Heavy links show flowing particles |
| **Particle speed** | `0.002 + (combinedMass / 20) × 0.01 × G` | Faster flow = stronger gravitational pull |

### 2.6 Focus Mode

Clicking a node enters focus mode:
- The clicked node → white, full opacity
- Its direct neighbors → original color, 85% opacity
- Everything else → dimmed to 8% opacity
- Links to/from the focused node → bright, others → nearly invisible

Right-click background to clear focus.

---

## 3. Camera & Navigation

### 3.1 Keyboard Controls

**2D mode**:
- `WASD` / arrow keys → pan the graph

**3D mode**:
- `W/S` → forward/backward
- `A/D` → strafe left/right
- `Space` → descend, `Shift` → ascend
- `Q/E` → orbit yaw (rotate around target)
- `R` → reset camera to initial position
- `F` → fly to the focused node

Keyboard velocity has **damping** (`0.9` per frame) — releasing a key doesn't stop instantly, it decelerates smoothly.

### 3.2 Auto-Orbit (3D only)

When enabled, the camera **continuously rotates** around the current orbit target on the world Y-axis (horizontal turntable).

**How it works per frame**:
1. Compute the offset vector from `controls.target` to `camera.position`
2. Rotate the offset in the **XZ plane** by a fixed angle (`speed` radians):
   ```
   newX = offset.x × cos(speed) - offset.z × sin(speed)
   newZ = offset.x × sin(speed) + offset.z × cos(speed)
   ```
3. `offset.y` is **never touched** — pure horizontal rotation regardless of viewing angle
4. Reposition the camera at `target + rotated_offset`
5. Call `controls.update()` to sync OrbitControls' internal spherical state

> **Why `controls.update()` instead of `camera.lookAt()`?** OrbitControls maintains its own internal spherical coordinates. If we call `camera.lookAt()`, OrbitControls' next `update()` (from the render loop) snaps the camera back to its stale internal state, causing stuttering. By calling `controls.update()` ourselves, OrbitControls adopts our new camera position as ground truth.

**Key behaviors**:
- The orbit is always **horizontal** — the camera circles at its current elevation, never tilts up or down on its own
- **Direction is constant** — user interactions (drag, zoom, click) do not reverse the rotation
- **Distance is preserved** — cos/sin rotation doesn't change the offset magnitude, so no zoom drift
- If you fly-to a node (which changes the orbit target), auto-orbit starts circling the new target
- Works simultaneously with keyboard input — you can WASD while the graph gently rotates

**Speed scale** (radians per frame at ~60fps):

| Slider Value | Display | Time Per Revolution |
|---|---|---|
| `0.0001` | 0.1x | ~17.5 minutes |
| `0.001` | 1x | ~105 seconds |
| `0.005` | 5x | ~21 seconds |
| `0.01` | 10x | ~10.5 seconds |

### 3.3 Fly-To Animation

When you click a node in 3D or press `F`, the camera smoothly flies to it:
- Uses **quaternion Slerp** for rotation (spherical interpolation, no gimbal lock)
- Uses **position lerp** for translation
- Easing: cubic ease-in-out (`t < 0.5 ? 4t³ : 1 - (-2t+2)³/2`)
- Duration: 1400ms
- Maintains the camera's current direction relative to the target (approaches from the same angle)

### 3.4 Frustum Updates

The camera's near/far clipping planes are dynamically adjusted based on distance:

```
near = max(1, distance × 0.01)
far  = max(distance × 5, shelfRange × 3, 8000)
```

This prevents nodes from disappearing when you zoom very far in or out.

### 3.5 Camera Center Shift (3D only)

**Left-click** on an empty area of the 3D background to smoothly shift the camera's orbit center to that point.

**How it works**:
1. A raycaster projects the click onto a virtual plane at `controls.target` distance from the camera
2. The orbit center (`controls.target`) is animated from its current position to the clicked point
3. Animation uses **ease-out cubic** interpolation over 800ms
4. `camera.lookAt()` is called each frame to keep the camera pointing at the moving target

**Right-click** background resets the orbit center to `(0, 0, 0)` using the same smooth animation.

> This is a pure camera operation — it does not move or re-layout any nodes. It just changes what the camera orbits around.

---

## 4. Shelves (3D only)

When enabled, nodes are separated into Z-axis layers based on a categorical field (default: `status`):

| Status | Z-Level |
|---|---|
| draft | 0 |
| exploratory | 150 |
| active | 300 |
| evergreen | 450 |

Each shelf is 150 units apart. Nodes still interact gravitationally within and across shelves — a `derives-from` link between an `active` doc and a `draft` doc creates a diagonal spring.

---

## 5. Visibility & Filtering

### 5.1 Node Filters

Every categorical field (`node_type`, `layer`, `status`, `nature`, `veracidade`, `convicção`, `audience`) has checkboxes. **Only nodes matching at least one checked value** per active field are shown.

### 5.2 Toggle Filters

- **Hide Sessions**: Removes session-type nodes
- **Hide Isolated**: Removes nodes with no edges
- **Hide Non-Vault**: Removes nodes whose path doesn't start with `docs/vault/`

### 5.3 Search

Text filter on node label and path. Case-insensitive. Hides non-matching nodes.

---

## 6. UI Behaviors

### 6.1 Inactivity Fade

After **4 seconds** of no mouse movement, clicks, key presses, scroll, or touch:
- The left panel, HUD badges (stats, zoom, keyboard hint, focus hint), fullscreen button, legend, and closed sidebar all fade to `opacity: 0`
- Any interaction immediately restores them
- The fade is suppressed if the sidebar or document modal is open (prevents UI disappearing while you're reading)

### 6.2 Collapsible HUD Icons

Each HUD element (📊 stats, 🔍 zoom, ⌨ keyboard hint, 🎯 focus hint) displays as a **small icon** by default. Clicking the icon toggles its text content visible/collapsed. State uses the CSS class `.collapsed`.

### 6.3 Panels-Hidden Mode

The `◫` button toggles `body.panels-hidden`, which hides the left panel, sidebar, legend, stats, zoom, keyboard hint, focus hint, and fullscreen button via CSS `display: none !important`. The `togglePanels()` function also strips inline `style.display` from HUD elements (set by JS during 2D/3D switching) so the CSS class can take effect.

### 6.4 Fullscreen-Clean Mode

The `⛶` button requests `document.documentElement.requestFullscreen()`. On entry, `body.fullscreen-clean` hides **all** UI including the fullscreen button itself, modals, and HUD. On exit (via Escape or `fullscreenchange`), UI is restored.

### 6.5 State Persistence

All toggle states, filter selections, selected metrics, gravity strategy, and speed values are saved to `localStorage` under `ontology-explorer-state`. On reload, the graph restores your exact configuration. A `STATE_VERSION` counter forces a reset when new features are added.

---

## 7. Pre-Computed Metrics

All computed at page load. Available in the sidebar when you click a node and in the Statistics tab.

| Metric | How It's Computed |
|---|---|
| **Mass** | Depends on selected gravity strategy (see §1.4) |
| **Degree** | in_degree + out_degree |
| **In-Degree** | Count of edges pointing to this node |
| **Out-Degree** | Count of edges leaving this node |
| **PageRank** | 20 iterations, damping factor 0.85, normalized to 0–100 |
| **Betweenness** | Brandes' algorithm — how many shortest paths pass through this node |
| **Local Clustering** | Fraction of a node's neighbors that are also connected to each other |
| **Relationship Types** | Count of distinct edge types (`derives-from`, `validates`, etc.) |
| **Neighbor Type Diversity** | Count of distinct `node_type` values among neighbors |
