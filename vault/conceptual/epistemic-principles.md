---
tags: [ontology, agents]
node_type: conceptual
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-03-19
---

# Epistemic Principles

> Catalog of meta-principles that guide design decisions across the entire project — from code architecture to the ontology itself. These are not domain-specific rules; they are **thinking tools** that help the team (and agents) choose between competing approaches.

---

## Objective

This document is a **lookup table** of reasoning heuristics adopted by the project. Each principle is stated concisely, with its origin, the practical implication for this codebase, and at least one concrete example of where it was applied.

Agents should consult this document when choosing between approaches. The question is always: *"Which option do the principles favor?"*

---

## The Principles

### 1. Navalha de Occam (Occam's Razor)

**Statement:** Among competing explanations or designs, prefer the one that makes the fewest assumptions.

**Origin:** William of Ockham, c. 1287–1347. Formalized in logic and the philosophy of science. Used in machine learning (regularization), physics (minimum description length), and engineering (KISS principle).

**Lindy age:** ~700 years.

**Implication for this project:**
- When designing a system (event system, ontology schema, agent architecture), start with the simplest possible implementation. Add complexity only when the simpler version demonstrably fails.
- Prefer fewer labels, fewer tables, fewer agents — until the system proves it needs more.

**Applied in:**
- The decision to use Postgres with pgvector instead of Neo4j + Pinecone (fewer components, same result).
- The Agent Event System: em vez de um subagente complexo observando o agente principal em tempo real, a solução mais simples é o **self-monitoring** — o próprio agente emite eventos sobre si mesmo via o workflow `/close-session` que já existe.

---

### 2. Efeito Lindy (The Lindy Effect)

**Statement:** For non-perishable things (ideas, technologies, patterns), the future life expectancy is proportional to their current age. Something that has survived 500 years is likely to survive another 500. Something invented last year may not survive the next.

**Origin:** Named after Lindy's Deli in New York, where comedians observed that the longest-running Broadway shows tended to keep running. Formalized by Nassim Nicholas Taleb in *Antifragile* (2012), building on Benoît Mandelbrot's work.

**Lindy age:** The concept itself was formalized ~60 years ago, but the underlying observation (durable things endure) is ancient.

**Implication for this project:**
- Prefer technologies and patterns that have survived decades: relational databases, event sourcing (double-entry bookkeeping since 1494), append-only logs, Unix conventions (READMEs).
- Be skeptical of patterns that are less than 2 years old (e.g., "LLM-as-a-judge" for logging, arbitrary "AI supervisor" architectures).
- Trust the vault's foundational design to Lindy-tested ideas: Git for version control, Markdown for text, SQL for structured queries.

**Applied in:** The choice of event sourcing for the ontology (pattern from 1494). The rejection of an LLM observer to generate logs (pattern from 2023).

---

### 3. Event Sourcing como Ledger (The Ledger, Not the Balance)

**Statement:** Store the complete sequence of events (the journal), not just the current state (the balance). The current state is a derivable projection; the event history is the irreducible source of truth.

**Origin:** Double-entry bookkeeping (Luca Pacioli, 1494). Formalized for software by Eric Evans (DDD, 2003) and Martin Fowler.

**Lindy age:** ~530 years (bookkeeping); ~23 years (software pattern).

**Implication for this project:**
- The application's `EventLog` is the source of truth, not the status fields on models.
- The ontology's `ontology_events` table will be the source of truth for the vault's history, not the current state of the Markdown files.
- Agent events (`DOCUMENT_REFERENCED`, `DOCUMENT_MODIFIED`) follow the same pattern: record the fact, derive the insight later.

**Applied in:** The entire `infrastructure/messaging/event_catalog.py` and `infrastructure/database/event_log_service.py`.

---

### 4. Princípio da Ortogonalidade (Orthogonality Principle)

**Statement:** Every classification label, dimension, or signal in a system should carry information that no other label can express. Redundant signals increase complexity without increasing knowledge.

**Origin:** Information theory (Claude Shannon, 1948). Linear algebra (orthogonal vectors). Applied to software design as "separation of concerns" (Edsger Dijkstra, 1974).

**Lindy age:** ~80 years (Shannon); ~50 years (Dijkstra).

**Implication for this project:**
- The ontology's 7 labels (`node_type`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `tags`) are designed to be mutually independent. Adding a new label requires proving it carries non-redundant information.
- Before adding a feature, ask: "Can I express this with what already exists?" If yes, do not add.

**Applied in:** The entire `ontology-conventions.md` classification system. The removal of `layer: cross` (replaced by multi-value syntax). The removal of `node_type: session` (replaced by `is_session: true`).

---

### 5. Elegância Estrutural e o "Nudge" (Structural Elegance)

**Statement:** Absorb complexity into the underlying structure so the humans and algorithmic agents interacting with it do not have to carry that weight. Guide behavior through elegant architecture and curation (the "nudge") rather than rigid, bureaucratic force.

**Origin:** Tesler's Law of the Conservation of Complexity (Larry Tesler, 1984), combined with Stoic pragmatism (controlling the system, accepting the chaos) and architectural elegance.

**Lindy age:** ~40+ years (Tesler's Law), ~2000 years (Stoicism).

**Implication for this project:**
- Complexity cannot be destroyed, only shifted. Shift it to the architecture.
- Design the API, the UI, and the ontology rules so that doing the *right* thing is the path of least resistance. 
- Form is structurally identical to content. If a system requires deep academic translation to be operated, the design has failed.

**Applied in:** 
- The design of *O Grafo Diário* (the internal newspaper) converting high-entropy vault data into a low-cognitive-load, accessible visual interface. 
- The architectural mandate: "We reduce cognitive fatigue in the world."

## Adding a New Principle

Before adding a principle to this catalog, it must pass:

1. **The Lindy test:** Has the principle survived at least 50 years in some form?
2. **The application test:** Can we point to at least one concrete decision in this project where it was (or should have been) applied?
3. **The non-redundancy test:** Does it say something that no existing principle already covers?

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [ontology-conventions.md](file:///Users/victorboscaro/house_project/docs/vault/ontology-conventions.md) | `contextualizes` | The Orthogonality Principle is the governing constraint of the conventions |
| [event-system-foundations.md](file:///Users/victorboscaro/house_project/docs/vault/conceptual/event-system-foundations.md) | `contextualizes` | Event Sourcing as Ledger principle applied to the event system |
| [ontology-architecture-draft.md](file:///Users/victorboscaro/house_project/docs/vault/ontology-architecture-draft.md) | `contextualizes` | Occam's Razor applied to the technology choices |
