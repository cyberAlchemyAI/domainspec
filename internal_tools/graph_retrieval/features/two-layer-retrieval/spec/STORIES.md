---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, stories]
node_type: spec
is_session: false
layer: application
nature: explanatory, reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# User Stories: Two-Layer Retrieval

> Navigate by intent: [Canon](#canon) · [Provenance](#provenance) · [Frontier](#frontier) · [Tension](#tension) · [Semantic](#semantic) · [Blast Radius](#blast-radius) · [Definitional](#definitional) · [Lens Triangulation](#lens-triangulation)

The "actor" in every story is a **vault reader** — typically the
project author querying their own vault through a notebook, REPL, or
downstream tool. There is no end-user surface in v0.1.

## Canon

### US-1: Find what we currently believe about a topic

As a **vault reader**, I want **to ask "what do we believe about X?"
and get back only canonized claims**, so that **I do not confuse a
draft with an evergreen axiom**.

**Given** a vault with mixed-status nodes
**When** I call `retrieve("what do we believe about residue?", corpus, k=5)`
**Then** every returned node has `node_type ∈ {axiom, constitution}` and
`status ∈ {consolidated, evergreen}` and none has
`verification == ["model-recall"]`.

**Acceptance checks**

- [ ] `result.intent == Intent.CANON`
- [ ] Every `n.view.node_type ∈ {"axiom", "constitution"}` ([rules.md F2](rules.md#f2--type-stratification))
- [ ] Every `n.view.status ∈ {"consolidated", "evergreen"}` ([rules.md F3](rules.md#f3--stage-stratification))
- [ ] No `n.view.verification == ["model-recall"]` ([rules.md F4](rules.md#f4--verification-provenance-respect))
- [ ] If a node `A'` supersedes `A`, `A'` ranks strictly above `A` ([rules.md F5](rules.md#f5--supersedes-pathology))

**Domain coverage**

- Concepts: [Intent.CANON](domain.md#intent), [NodeView](domain.md#nodeview), [Stage Prior](domain.md#stage-prior)
- Rules: [F2](rules.md#f2--type-stratification), [F3](rules.md#f3--stage-stratification), [F4](rules.md#f4--verification-provenance-respect), [F5](rules.md#f5--supersedes-pathology)
- Flow: [workflows.md Step 2a](workflows.md#step-2-candidate-set-construction)

## Provenance

### US-2: Trace the evidence for a claim

As a **vault reader**, I want **to ask "what is the evidence for X?"
and walk back through `derives-from` and `cites` edges**, so that **I
can audit the support chain for a load-bearing claim**.

**Given** a vault with provenance edges materialized
**When** I call `retrieve("evidence for graph-as-residue?", corpus, k=5)`
**Then** at least one returned node has a non-empty
`inbound_edges["derives-from"]` list.

**Acceptance checks**

- [ ] `result.intent == Intent.PROVENANCE`
- [ ] ≥ 1 result has `inbound_edges["derives-from"]` non-empty
- [ ] Edge-leaning candidate construction (step 2b) ran (verified via `result.notes` absent or non-warning)

**Domain coverage**

- Concepts: [Intent.PROVENANCE](domain.md#intent), [NodeView](domain.md#nodeview)
- Flow: [workflows.md Step 2b](workflows.md#step-2-candidate-set-construction), Step 4 `score_provenance`

## Frontier

### US-3: See what is currently being explored

As a **vault reader**, I want **to ask "what are we exploring around
X?" and get back recent drafts**, so that **I can resume work without
hunting through file lists**.

**Given** a vault with drafts dated across a range
**When** I call `retrieve("what are we exploring about <topic>?", corpus, k=5)`
**Then** every returned node has `status ∈ {draft, exploratory}` and
the ordering favors more recent `last_updated`.

**Acceptance checks**

- [ ] `result.intent == Intent.FRONTIER`
- [ ] Every `n.view.status ∈ {"draft", "exploratory"}` ([rules.md F3](rules.md#f3--stage-stratification))
- [ ] For two results with equal `body_sim`, the more recent ranks higher (recency decay applied)

## Tension

### US-4: Surface contradictions for a claim

As a **vault reader**, I want **to ask "what contradicts Y?" and get
back nodes connected by `contradicts` or `supersedes` edges**, so that
**I can resolve live disagreements before they ossify**.

**Given** a vault with at least one `contradicts` edge
**When** I call `retrieve("what contradicts <claim>?", corpus, k=5)`
**Then** results are sorted by inbound `contradicts` + `supersedes`
count.

**Acceptance checks**

- [ ] `result.intent == Intent.TENSION`
- [ ] Top result has the highest inbound `contradicts` + `supersedes` count among candidates

## Semantic

### US-5: Default fuzzy fallback

As a **vault reader**, I want **a fallback retrieval mode when my query
matches no specific intent**, so that **I always get something useful
back**.

**Given** a query with no intent-matching keywords (e.g. `"residue
attractor"`)
**When** I call `retrieve(query, corpus, k=5)`
**Then** `result.intent == Intent.SEMANTIC`, `intent_confidence == 0.5`,
and results are ranked by `body_sim` only.

**Acceptance checks**

- [ ] `result.intent == Intent.SEMANTIC`
- [ ] `result.intent_confidence == 0.5`
- [ ] Results sorted by `body_sim` descending

## Blast Radius

### US-6: Estimate impact of retiring a node

As a **vault reader**, I want **to ask "what breaks if I retire Z?"
and get back nodes that depend on Z via `governs` or `derives-from`**,
so that **I can scope the impact of a retraction**.

**Given** a vault with `governs` and `derives-from` edges
**When** I call `retrieve("what breaks if I retire <path>?", corpus, k=5)`
**Then** results are ranked by inbound dependency count, weighted by
stage prior.

**Acceptance checks**

- [ ] `result.intent == Intent.BLAST_RADIUS`
- [ ] Path-matching seed extraction located the target node
- [ ] Result ordering reflects `0.7 * governs_in + 0.3 * derives_in` weighting

## Definitional

### US-7: Look up what a term means in this vault

As a **vault reader**, I want **to ask "what does T mean here?" and
get back active or consolidated `conceptual` nodes**, so that **I can
ground my use of a term in this vault's specific definition**.

**Given** a vault with `conceptual` nodes
**When** I call `retrieve("what does <term> mean?", corpus, k=5)`
**Then** every returned node has `node_type == "conceptual"` and
`status ∈ {active, consolidated, evergreen}`.

**Acceptance checks**

- [ ] `result.intent == Intent.DEFINITIONAL`
- [ ] Every `n.view.node_type == "conceptual"` ([rules.md F2](rules.md#f2--type-stratification))
- [ ] Every `n.view.status ∈ {"active", "consolidated", "evergreen"}` ([rules.md F3](rules.md#f3--stage-stratification))

## Lens Triangulation

### US-8: (Deferred) See multiple angles on a topic

As a **vault reader**, I want **to ask "what angles bear on X?" and
get back a curated set spanning multiple lenses**, so that **I avoid
single-perspective blind spots**.

**Status:** Deferred to v0.2. v0.1 raises `NotImplementedError` — see
[TEST-SPEC.md G1](TEST-SPEC.md#g1--lens_triangulation-has-no-scorer).
This story exists so the obligation is visible in the story coverage
matrix below.

## Story Coverage Matrix

| Intent | Story IDs | Covered Concepts | Notes |
| ------ | --------- | ---------------- | ----- |
| CANON | US-1 | `two-layer-retrieval.Intent`, `two-layer-retrieval.NodeView`, F2, F3, F4, F5 | Load-bearing — exercises every faithfulness rule |
| PROVENANCE | US-2 | `two-layer-retrieval.Intent`, edge closure | Edge-leaning representative |
| FRONTIER | US-3 | `two-layer-retrieval.Intent`, recency decay | Body-leaning with time prior |
| TENSION | US-4 | `two-layer-retrieval.Intent`, contradicts/supersedes edges | Edge-leaning |
| SEMANTIC | US-5 | `two-layer-retrieval.Intent` fallback path | Documents the rule-classifier's escape hatch |
| BLAST_RADIUS | US-6 | `two-layer-retrieval.Intent`, governs/derives-from weighting | Edge-leaning, path-seeded |
| DEFINITIONAL | US-7 | `two-layer-retrieval.Intent`, conceptual node filter | Body-leaning with hard filters |
| LENS_TRIANGULATION | US-8 | (deferred) | Tracks v0.2 obligation |
