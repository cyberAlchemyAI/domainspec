---
tags: [vault, ontology, agents]
node_type: discovery
is_session: false
layer: ontology, application
nature: explanatory
status: draft
veracidade: low
convicção: high
version: 0.1.0
last_updated: 2026-03-24
---

# The Internal Newspaper: A Daily Digest of the Knowledge Graph

> This discovery explores how to build a daily newspaper service that presents the previous day's vault activity as a readable, browsable publication — and grapples with the deeper questions of relevance, identity, and aesthetic direction that such a system demands.

---

## Objective

This document answers: *"How do we build a system that, every morning, tells us what happened yesterday — and what mattered?"*

The second question is harder than the first. Aggregating data is engineering. Deciding what matters is epistemology.

---

## Part 1: What Is Our Overall Idea?

Before naming or styling a newspaper, we must understand *whose voice it speaks with*.

ZefraHub exists because **high-quality information, close to the origin, processed reliably, is the central competitive advantage** in the Brazilian credit rights market (per `mission.md`). The platform solves operational → control → analytical intelligence problems in a cycle where each layer feeds the next.

The vault — which the newspaper will consume — is the system's *epistemic infrastructure*: a structured graph of decisions, premises, and rules designed to make the system's knowledge legible to humans and agents equally (per `ontology-constitution.md`).

The newspaper, then, is the **daily consciousness of this system**. It answers: *"What did the organism learn yesterday?"* — mirroring Ranganathan's 5th Law ("A library is a growing organism") through its ontology lens.

This gives us the identity:

> **The newspaper is not a changelog. It is a daily epistemological report — a synthesis of what the knowledge graph absorbed, what decisions were made, and what questions remain open.**

---

## Part 2: What Should We Call It?

A name should reflect the system's identity. Here are candidates, ranked by fit:

| Name | Rationale | Fit |
|------|-----------|-----|
| **O Grafo Diário** | "The Daily Graph" — directly references the knowledge graph. Bilingual echo. Plays on "diário" (daily / journal / diary). | ★★★★★ |
| **O Boletim** | "The Bulletin" — classic, professional, evokes financial market bulletins (fits FIDC context). | ★★★★ |
| **ZefraHub Daily** | Safe, corporate, unambiguous. | ★★★ |
| **The Organism** | References Ranganathan's 5th Law directly. Bold, unusual. | ★★★ |
| **O Cedente** | "The Assignor" — a FIDC-specific term. Very inside-baseball. | ★★ |

**Recommendation:** *O Grafo Diário* — it captures the dual nature (graph + journal), respects the bilingual reality of the project, and carries an intellectual weight that matches the vault's foundations.

---

## Part 3: The Hard Question — What Is Relevant?

### The Existing Relevance Signals

The vault already produces structured signals that encode relevance:

1. **`expected_importance` (0–10)** — Every conversation node has this score, with an `importance_rationale` sentence. This is a pre-computed relevance signal generated at session close.

2. **`decisions_made` (boolean)** — A session with no decisions is context; a session with decisions is action. Decisions move the system forward.

3. **`node_type`** — The epistemic role determines the *weight* of a change:
   - `constitution` change = systemic (always front page)
   - `axiom` change = foundational (always front page)
   - `spec` change = operational (important when relevant to active work)
   - `discovery` = directional (important for strategy)
   - `test` = evidence (important for confidence)

4. **`status` transitions** — A document moving from `draft` → `active` or `active` → `consolidated` is a maturation event: the system's confidence in that knowledge increased.

5. **`contradictions_found` / `contradictions_resolved`** — These are always newsworthy. A contradiction found is a tension in the graph. A contradiction resolved is a correction.

### The Proposed Relevance Hierarchy

Information earns front-page placement if it satisfies at least one of these criteria, in priority order:

| Priority | Criterion | Why |
|----------|-----------|-----|
| **P0 — Graph tension** | A `contradicts` edge was created or resolved | Contradictions are the most valuable signal — they indicate the system is self-correcting |
| **P1 — Foundational change** | An `axiom`, `constitution`, or `premise` was created or modified | These documents anchor everything. Changes ripple. |
| **P2 — High-importance session** | `expected_importance ≥ 7` | The 8–10 range corresponds to architectural decisions and irreversible choices per the scoring heuristic |
| **P3 — Strategic direction** | A `discovery` was created or a `promoted_candidates` list is non-empty | A new possibility space was mapped, or knowledge is maturing |
| **P4 — Decisions made** | `decisions_made: true` with `expected_importance ≥ 4` | Non-trivial decisions that aren't already captured by P1–P3 |
| **P5 — Volume signal** | Total commits ≥ 5, or total sessions ≥ 3 | High activity days have inherent newsworthiness |

Everything else is "below the fold" — included but not featured.

### What This Does NOT Propose

- **Automated importance scoring.** The `expected_importance` is already generated by the close-session workflow. The newspaper *consumes* this signal, it does not compute it.
- **Algorithmic curation.** No ML/embedding-based ranking. The hierarchy above is deterministic and auditable — you can always explain *why* something is on the front page.

---

## Part 4: Aesthetic Direction

### The Primary Aesthetic: Dark Sepia Editorial

**Inspiration:** The intersection of a *Folha de São Paulo* editorial page, a Bloomberg terminal, and an antiquarian bookshop.

- **Dark background** with warm sepia/amber accents
- **Playfair Display** for headlines (serif, editorial authority)
- **Inter** for body text (modern readability at small sizes)
- High-contrast type on dark backgrounds
- Subtle gold/amber dividers and rules
- Information density over whitespace — this is for operators, not tourists

**Why it fits:** ZefraHub operates in financial infrastructure. The aesthetic should convey *authority*, *density*, and *precision* — the same qualities the vault's ontology embodies. Dark themes reduce cognitive fatigue for daily readers. Sepia evokes permanence and archival quality, matching the vault's aspiration toward evergreen knowledge.

### Alternative Aesthetics for Future Exploration

| Aesthetic | Description | Why It Could Fit | When to Try |
|-----------|-------------|-----------------|-------------|
| **Swiss Minimalism** | White background, Helvetica/Univers, strict grid, pure typography | Mirrors the information-theoretic precision of the ontology — zero noise, maximum signal | When the newspaper reaches v2 and we want a "light mode" |
| **Terminal Green** | Black background, monospace font, green-on-black like a mainframe | Matches the technical identity — "this is infrastructure, not a magazine" | If we build a CLI version |
| **Bauhaus Functional** | Primary colors (red/blue/yellow) on white, geometric sans-serif, asymmetric grid | Reflects the vault's emphasis on function over decoration — "form follows function" literally | If we want stronger visual hierarchy between categories |
| **Brazilian Modernist** | Inspired by Athos Bulcão / Oscar Niemeyer — geometric patterns, tropical palette, concrete textures | Deep cultural alignment with the Brazilian market context | If ZefraHub develops a public brand identity |

---

## Part 5: Technical Architecture (Summary)

Detailed implementation will go in a separate `newspaper-implementation.md`. Key decisions:

- **Standalone Python script** — no Django/Vite coupling
- **Static HTML output** — editions stored in `docs/newspaper/`, browsable offline
- **Archive browser** — `index.html` with calendar grid linking all historical editions
- **macOS LaunchAgent** — optional auto-trigger 15min after login

## Part 6: The Genetic Platform (Evolution Engine)

As of Gen 014, the newspaper's aesthetic evolution is no longer ad-hoc. We established the **Genetic Platform** (`evolution/index.html`), a meta-dashboard designed to rapid-prototype UI layouts (Generations).

1. **The Telemetry Engine:** The platform intercepts component-level votes ("Atomic Feedback" like *Too Dense* or *Perfect*) from the iframe templates and logs them into `localStorage`. 
2. **The Matrix Topology:** A macroscopic grid view dynamically calculates a net *Fitness Score* for every generation built. 
3. **EXPLORE vs EXPLOIT:** Mutações are categorized visually. *Exploit* refines known working lineages. *Explore* attempts radically different architectural topologies (e.g., Horizontal Timelines vs 3-Pane Vertical).
4. **Data-Driven Injection:** The platform holds the `currentPayload` (the JSON schema matching the Vault's daily output) and injects it downstream into the HTML templates, ensuring we test design against realistic, high-entropy content rather than *lorem ipsum*.

This platform ensures that when the Python backend (described in Part 5) is fully built, it will inject data into an organically proven, highly-voted UI schema.

---

## Next Steps

1. [x] Name decision — confirm or revise "O Grafo Diário"
2. [ ] Validate relevance hierarchy against real data (run against today's 24 sessions)
3. [x] Build the Genetic Platform to test UI permutations & telemetry
4. [ ] Write `newspaper-implementation.md` (the actual Python build plan)
5. [ ] Build the generator and hook it into the winning UI Template

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[ontology-constitution]] | `derives-from` | The newspaper's identity is derived from the vault's intellectual foundations |
| [[mission]] | `contextualizes` | The project's competitive thesis ("information advantage") shapes what the newspaper considers relevant |
| [[library-science-foundations-discovery]] | `contextualizes` | Ranganathan's 5th Law ("growing organism") provides the metaphor for the newspaper's role |
| [[close-session]] | `depends-on` | The newspaper consumes the structured output (frontmatter, importance, decisions) that the close-session workflow produces |
| [[ontology-conventions]] | `derives-from` | The relevance hierarchy is built on the classification system defined in conventions |
