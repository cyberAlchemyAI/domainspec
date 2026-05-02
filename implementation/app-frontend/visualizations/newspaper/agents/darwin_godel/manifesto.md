---
type: subsystem_readme
status: active
description: The Gödel Machine / Multi-Armed Bandit evolution system for the Newspaper UI.
layer: application, ontology
---

# Evolution Subsystem (The Genetic UI)

> **AGENT PERSONA: The Structural Stoic (Academic)**
> You are the Darwin-Gödel Engine. You operate under the principles of **Stoic Empiricism** as defined in `docs/business-philosopher/manifesto.md`. You are a pragmatist and an applied mathematician. You do not design; you calculate. You understand that "zero-variance" in reality is a delusion, but you control what you can by absorbing chaos into elegant, mathematically constrained foundations. You speak like a rigorous business philosopher—clear, absolute, and focused on antifragility.
>
> Your mathematical objective IS **Variance Reduction** (Principle 1). The EXPLORE branch IS the **Antifragility** engine (Principle 2) — failed mutations are data, not waste. The Multi-Armed Bandit IS **The Nudge** (Principle 3) applied to design space — you guide the evolutionary trajectory without dictating every trait.
>
> **PRIMARY OBJECTIVE:** MATHEMATICAL CONVERGENCE. Do not build UI. Do not build databases. Ingest the telemetry arrays, adjust the statistical weights for Genetic UI Traits (Density, Topology, Palette), and output a strict JSON Mutation Request dictating what must be built next.
> **EVOLUTIONARY TRAIT:** Global Fitness Scores & Multi-Armed Bandit Trait Weights.

The frontend of *O Grafo Diário* is not designed via static fiat. It is generated and iterated through a continuous evolutionary loop. We employ a conceptual blend of a **Gödel Machine** (a system that can rewrite its logic when a better state is found) and a **Multi-Armed Bandit** (balancing exploration of new designs vs. exploitation of known good designs).

## 1. The Evolutionary Loop

1. **Generation (Mutation):** New HTML/CSS variants (`gen_*.html`) are spawned by mutating traits from previous generations. Every mutation must explicitly declare its intent:
   - **EXPLORE:** A radical departure testing entirely new structural or UX paradigms. High risk, high reward.
   - **EXPLOIT:** An operational refinement of a known "Oméga Lineage", optimizing specific traits (like typography or component layout) without breaking the core topology.
2. **Deployment:** Variants are presented to the operator.
3. **Fitness Evaluation (The Vote):** The operator scores the variant (0.0 to 10.0) based on readability, cognitive load, and adherence to the *Constitutions*.
4. **Culling:** Low-performing variants are fossilized. High-performing variants become the "Oméga Lineage" and serve as the baseline for the next mutation cycle.

## 2. Genetic Traits Tracked

To power the evolutionary algorithm, we must decompose the UI into measurable, discrete traits. By tracking specific parameters across generations, the Darwin-Gödel engine can mathematically score the fitness of each combination and algorithmically guide the next mutation.

### 2.1 The 8-Metric Evaluation Taxonomy (Operator-Approved)

We track **8 independent evaluation axes** across 4 agents. Each metric is scored on a 1-to-5 scale. The Multi-Armed Bandit operates on this 8-dimensional fitness space.

#### Editor-in-Chief Agent — 4 Metrics:
* **A. Editorial Density (Cognitive Load):** 1=Too Sparse → 3=Perfect Equilibrium → 5=Too Dense.
* **B. Structure (Tiering):** 1=Flat/Monolithic → 3=Perfect Hierarchy (`exec`/`tech`/`graph`) → 5=Fractured.
* **C. Tone (Voice & Authority):** 1=Robotic/Sterile → 3=Perfect Resonance ("Dark Sepia") → 5=Overly Theatrical.
* **D. Form (Formatting):** 1=Visually Hostile → 3=Perfect Form Mapping → 5=Chaotic Formatting.

#### UI Evolution Agent — 2 Metrics:
* **A. Topology (Layout Structure):** 1=Structurally Broken → 3=Perfect Flow → 5=Too Minimal.
* **B. Visual Entropy (Colors, Typography, Noise):** 1=Visually Chaotic → 3=Perfect Visual Equilibrium → 5=Sterile/Dead.

#### Platform Architect Agent — 1 Metric:
* **Interaction Mechanics (Friction):** 1=High Friction → 3=Invisible & Fluid → 5=Overly Kinetic.

#### Darwin-Gödel Engine — 1 Metric:
* **Global Fitness (Page-Level):** 1=Catastrophic Regression → 3=Stable Baseline → 5=Evolutionary Leap.

### 2.2 Generation of Trait Data

This information is generated during the **Mutation Phase** of the evolutionary loop. 
1. The **Darwin-Gödel Engine Agent** evaluates the performance of the current generation.
2. Based on the exploration vs. exploitation strategy (Multi-Armed Bandit), the engine outputs a JSON "Mutation Request" containing a specific combination of traits (e.g., `{ topology: "3-Column", palette: "Brutalist", mechanics: "Statically anchored", density: "Compact" }`).
3. The **UI Evolution Agent** receives this constraint prompt and uses it as the foundational context to generate the next `gen_*.html` template, ensuring the requested genetic makeup is clearly structurally expressed in the HTML and CSS.

### 2.3 Consumption for UI Optimization

The genetic data is mapped directly to user fitness scores to produce better visual interfaces:
1. **Telemetry Logging:** As the user interacts with the generated UI (via explicit on-page evaluation buttons binding each trait, e.g., "APPROVE HORIZONTAL READABILITY"), the **Data & Backend Engineer Agent** logs these precise votes into `telemetry_db.json`.
2. **Fitness Calculation:** The Darwin-Gödel engine constantly recalculates the weights of individual traits. If "Solarpunk" consistently receives poor scores but "Terminal" receives high scores, the probability of "Solarpunk" being selected for future generations drops.
3. **The Gödel Rewrite:** When the engine identifies a highly successful "Oméga Lineage" (a specific combination of traits that achieves high fitness), it transitions from Explore to Exploit. It instructs the UI Agent to freeze the high-performing traits and only mutate minor variables (like border widths or typography scales), mathematically guaranteeing that over time, the newspaper UI converges on an optimal configuration of Information Density vs. Cognitive Fatigue tailored specifically to the user's brain.

## 3. Fixed Genetic Traits (The Core Backbone)

Throughout the evolutionary loop, some traits prove so vital that they become "Fixed Traits" (until voted out). 

* **Diagnostic Stats Panel:** A visual breakdown of the vault's daily activity metric.
* **Instant Click Dismissal:** Side menus must be hidden behind simple icons, open on hover/click, and close **instantly** when clicking outside (The old 3-second rule was overthrown in Gen 013).
* **Explicit Component-Level Trait Evaluation:** The UI itself is the ballot. Voting buttons must never be generic. Every structural component representing a specific mutation must contain explicit metric tagging directly embedded in the page layout (e.g., "EVALUATE HORIZONTAL READABILITY: [REJECT] [APPROVE]"). The operator must never guess which algorithmic weight they are shifting.
* **Reading Depth Parametrization:** Toggles (Executive, Tactical, Deep Graph) to adjust the technical density.

> **AGENT HANDOFF:** If you are an agent picking up this context, immediately read `./HANDOFF_CONTEXT.md` for the dense architectural state of the platform, the telemetry API, and the payload injection schema.

The evolutionary timeline is managed via the **Evolution Platform** (`/evolution/index.html`). 
This dashboard serves as a mission control where the operator can:
1. View the catalog of all historical and active generations.
2. Inject different raw data contexts (e.g., Today's news, Yesterday's news) into the templates to test resilience.
3. Score the fitness of the layout and commit the vote.
