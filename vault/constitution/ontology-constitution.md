---
tags: [vault, ontology]
node_type: constitution
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-03-19
---

# ZefraHub Vault

> This vault is a **knowledge system** for the ZefraHub platform. It is not a wiki, a personal notebook, or a documentation dump. It is a structured graph of interconnected documents whose primary purpose is to make the system's decisions, premises, and rules legible — to humans and AI agents equally.

> **Root-level files:** `ontology-constitution.md`, `conventions.md`, `confidence-levels.md`, `human-navigation.md`, and `agent-navigation.md` live here — explicitly outside the knowledge graph. They are its schema and manuals, not its content. They do not use wikilinks and do not appear as nodes.

---

## Objective

This document is the **foundational constitution** of the vault. It answers the question: *"What is this system, why does it exist, and what intellectual traditions inform it?"*

It does NOT define schemas, edge types, frontmatter rules, or maturity levels — those belong to their respective reference documents:

- **ontology-conventions.md** — The grammar: frontmatter schema, edge types, tag system, directionality rules.
- **confidence-levels.md** — The maturity lifecycle: from `draft` to `evergreen`, with entry/exit criteria.

This document is the *why*. Those documents are the *how*.

---

## Index

1. [The High-Level Idea](#the-high-level-idea)
2. [Intellectual Foundations](#intellectual-foundations)
   - [Zettelkasten](#1-zettelkasten-niklas-luhmann)
   - [Evergreen Notes](#2-evergreen-notes-andy-matuschak)
   - [Bayesian Epistemology](#3-bayesian-epistemology)
3. [What We Do Here](#what-we-do-here)
4. [Redundancy & The DRY Principle](#redundancy--the-dry-principle)
5. [Folder Structure](#folder-structure)
6. [Core Documents](#core-documents)

---

## The High-Level Idea

The main ideal of this vault is to create and keep updated a trustable knowledge graph, making connections and inferences explicit. This knowledge graph will serve humans, but the primary user of this graph are LLM (or SLM) agents. They must be able to understand what is going on through this network, and they must keep it updated.

This ideal is not close for now, so we must lay a foundation so this ideal can become a reality. That foundation is guided by three intellectual traditions synthesized into a single system.

---

## Intellectual Foundations

The vault does not follow a single system. It is a deliberate synthesis of three traditions, each contributing a distinct piece:

> **Zettelkasten** for connections — **Evergreen Notes** for maturation — **Bayesian Epistemology** for confidence.

---

### 1. Zettelkasten (Niklas Luhmann)

**Origin:** A method created by German sociologist **Niklas Luhmann (1927–1998)**, who produced over 70 books and 400 academic papers using a network of ~90,000 handwritten index cards ("Zettel" = slip of paper). Each card captured a single idea and referenced others explicitly. No card was isolated; the network was the product.

**Core principle:** The value of a knowledge system does not reside in individual notes — it resides in the **connections between them**. A well-linked note that points to three others and is pointed to by five more carries far more epistemic weight than an isolated, well-written page.

**What this vault took:**
- The Obsidian graph view is the direct visual implementation of the Zettelkasten network.
- The **typed-edge system** (see `conventions.md` → Edge Types) is the semantic implementation: not just that two documents are connected, but *how* and *why* they are. The graph makes links visible; the edge types make their *meaning* explicit.

**Further reading:** Sönke Ahrens, *How to Take Smart Notes* (2017).

---

### 2. Evergreen Notes (Andy Matuschak)

**Origin:** A system developed by **Andy Matuschak** (researcher, ex-Apple, ex-Khan Academy) that distinguishes between *fleeting* notes (a moment's capture, disposable) and *evergreen* notes (that mature into stable, reusable knowledge over time). Published openly at [notes.andymatuschak.org](https://notes.andymatuschak.org).

**Core principle:** Notes are not static documents — they are **living objects that mature**. A note begins as a rough idea and grows through review, linking, and validation until it becomes an anchor of consolidated understanding. The maturation process is explicit and has defined exit criteria for each level.

**What we took:**
- The maturity lifecycle — from `draft` to `evergreen` — is directly inspired by this lifecycle (see `confidence-levels.md` for the full specification). A document at `evergreen` level is considered true until explicitly refuted and serves as an anchor for everything built on top of it.
- The principle that **investment in a note should be proportional to its accumulated evidence** — you do not split and fully structure something that is still a rough hypothesis.

---

### 3. Bayesian Epistemology

**Origin:** A philosophical tradition in formal epistemology that treats **beliefs as probability distributions**, not binary true/false states. Beliefs (priors) are updated as new evidence arrives, producing a posterior. Associated with philosophers like **Rudolf Carnap** and **Richard Jeffrey**, and the statistical tradition of **Thomas Bayes** and **Pierre-Simon Laplace**.

**Core principle:** There is no "absolute certainty" — only degrees of confidence calibrated against accumulated evidence. The best epistemic state is having *calibrated* beliefs: neither overconfident without evidence, nor dismissive without reason.

**What this vault took:**
- The two per-statement confidence labels: `convicção` (how strongly we believe it) and `veracidade` (how well-evidenced it is). These are **orthogonal** — one does not imply the other. See `conventions.md` → The Two Dimensions of Confidence for the full specification and examples.
- The investment principle: start with a coarse prior and invest in refinement proportionally to how much uncertainty has been reduced. Exploration phases demand low structure; consolidation phases demand high precision.

---

## What We Do Here

### 1. Record Premises
Before writing a rule, we write the bet behind it. Why do we believe this rule is necessary? Where does it come from? This prevents rules from becoming arbitrary over time.

### 2. Write Constitutions
Constitutions are the enforceable rules of the system — for folder structure, event system usage, development practices. They reference the premises that justify them. They are kept short, actionable, and versioned.

### 3. Map Business Context
The market, the mission, and the FIDC domain have their own documents. These are not product specs — they are the **context** that makes technical decisions interpretable.

### 4. Evolve the Ontology
The vault itself is a living thing. The tag system, the edge types, and the folder structure are not final. They evolve as our understanding of the system deepens.

### 5. Trustable System
We need a system to manage the knowledge graph. This system must assess what is in, what is updated, what is trustable, how things are imputed and evolve inside the network. This system is complex by itself, and we should also start slowly. This was not well thought yet, as of 2026-03-09; for now we are only generating and labeling data.

---

## Redundancy & The DRY Principle

The graph operates under strict rules regarding information duplication, dependent on the maturity of the document:

- **Evergreen / Consolidated (Top Levels):** Redundancy is a **Foe**. The exact same piece of foundational information (an Axiom, a core rule) must exist natively in exactly **one** place. If it exists in two places, the graph can contradict itself when an agent updates one but not the other. Other documents must transclude (link/blockquote) the original source.
- **Draft / Active (Lower Levels):** Redundancy is a **Friend**. These are working, messy documents. We allow duplication here because it lowers the friction of capturing ideas. It is the explicit job of the governance agents to consolidate and deduplicate this information *before* it gets promoted to Evergreen.

---

## Folder Structure

| File / Folder | Contents |
|---------------|----------|
| `ontology-constitution.md` | This file — navigation and intellectual foundations |
| `ontology-conventions.md` | Grammar of the vault — edge types, tags, frontmatter rules |
| `confidence-levels.md` | Maturity lifecycle — from draft to evergreen |
| `agent-navigation.md` | Navigation rules and traversal heuristics for LLM agents |
| `human-navigation.md` | Navigation guide and entry points for human readers |
| `dictionary-business.md` | Vocabulary and term definitions |
| `axiom/` | Foundational commitments (business, system, ontology) |
| `premise/` | Working hypotheses and bets |
| `constitution/` | Enforceable rules (folder structure, event system, development practices) |
| `conceptual/` | Background context (market, mission, epistemology, event system foundations) |
| `discovery/` | Exploratory documents mapping possibility spaces |
| `backlog/` | Prioritized pending work items and open questions |
| `conversations/` | Session records, grouped by `node_type` (e.g. `conversations/spec/`, `conversations/test/`) |
| `assets/` | Images and diagrams embedded in documents |

---

## Core Documents

### Graph Schema (outside the graph)

These documents define the **rules the graph runs on** — edge types, maturity levels, tag catalog, frontmatter requirements. They are not nodes making claims about the business or the system; they are the schema. The same way an index does not violate orthogonality because its function is navigation, these documents do not occupy a position in the knowledge graph because their function is to define how the graph works.

| Document | What it is |
|----------|-----------| 
| `ontology-conventions.md` | Edge types, tag catalog, frontmatter rules — the grammar of the vault |
| `confidence-levels.md` | The lifecycle from draft to evergreen — the maturity model |
| `human-navigation.md` | Where human readers should start and how they should traverse |
| `agent-navigation.md` | How autonomous agents should traverse and evolve the vault |

---

### Graph Content

Documents that live inside the graph, making claims about the business, the system, or the architecture. Each is a node with typed edges to others.

| Document                                            | What it is                                         |
| --------------------------------------------------- | -------------------------------------------------- |
| `premise/system-premises.md`                        | Working hypotheses about the technical approach and team operation   |
| `premise/business-premises.md`                      | Working hypotheses about the market                |
| `axiom/business-axioms.md`                          | Foundational business commitments                  |
| `axiom/system-axioms.md`                            | Foundational technical commitments                 |
| `conceptual/mission.md`                             | Why we're building this                            |
| `conceptual/fidc-and-credit-rights.md`              | FIDC market context                                |

| `constitution/folder-structure-constitution.md`      | Folder structure rules                             |
| `constitution/development-practices-constitution.md` | Development principles                             |
| `constitution/event-system-constitution.md`          | Event system rules                                 |
| `conceptual/event-system-foundations.md`             | Ontology, Digital Twins, and Event Sourcing — why the event system is designed this way |
