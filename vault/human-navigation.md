---
tags: [vault, ontology]
node_type: conceptual
is_session: false
layer: ontology
nature: procedural
status: consolidated
version: 0.1.0
last_updated: 2026-03-19
---

# Human Navigation Guide

> This document is your map for navigating the vault as a human reader. The vault is structured as a locally dense graph, not a linear book. Reading it sequentially by folder will lack context. This guide provides the optimal entry points and traversal paths.

---

## Objective

This document is the **human-specific reading guide** for the vault. It answers the question: *"As a human reader (new or existing team member), where do I start and how do I traverse this knowledge graph?"*

It provides ordered reading paths for gaining context, scenario-based entry points for day-to-day use, and instructions on how to interpret a node's frontmatter before trusting its content.

---

## Index

1. [Where to Start: Gaining Context](#1-where-to-start-gaining-context)
2. [Day-to-Day Navigation: How to Traverse](#2-day-to-day-navigation-how-to-traverse)
3. [How to Read a Node in the Graph](#3-how-to-read-a-node-in-the-graph)

---

## 1. Where to Start: Gaining Context

If you are new to the project or need to refresh your high-level understanding of what we are building and how we make decisions, follow this ordered path. These documents form the conceptual foundation of the system.

### Step 0: Understand the System
Before reading the content, you need to understand the medium. 
1. Read **`ontology-constitution.md`** — This explains the three intellectual pillars of this vault (Connections, Maturation, Confidence) as well as the label for each object, specially the documents itself and its edges.

### Step 1: The Business Reality
Start by understanding the market and why Zefra exists. Without this, the technical decisions will seem arbitrary.
1. Read **`conceptual/fidc-and-credit-rights.md`** — This explains the market mechanics, what a CCB is, and the difference between face value and acquisition value.
2. Read **`conceptual/mission.md`** — This takes the market reality and explains *our specific strategy* within it (why we focus on operational efficiency first, and why proximity to origin matters).

### Step 2: The Foundational Rules (Axioms)
Before looking at architecture, read the non-negotiable constraints. These are the bedrock principles.
1. Read **`axiom/business-axioms.md`** — Understand why verifiable collateral and reproducible accounting are not just features, but existential requirements.
2. Read **`axiom/system-axioms.md`** — Understand why the system demands deterministic pipelines and strict domain isolation.

### Step 3: How We Reason (Meta-Premises)
Read **`premise/system-premises.md`** (P-SYS-3 to P-SYS-8). This document is crucial for understanding *how the team operates* — particularly how we view the role of AI agents, why domains are treated as hypotheses, and why we don't demand perfect granularity upfront.

---

## 2. Day-to-Day Navigation: How to Traverse

When you are actively working in the codebase and need specific answers, your entry point changes based on what you are trying to do.

### Scenario A: Making a Structural or Technical Decision
If you need to know where a file goes, how domains communicate, or how to emit an event:
1. **Entry Point:** Go directly to the `/constitution` folder and read the relevant **Constitution**.
   - e.g., `constitution/folder-structure-constitution.md` or `constitution/event-system-constitution.md`.
2. **Traversal:** If the constitution feels too rigid or you want to challenge it, check its `## Connections` block at the bottom and follow the `derives-from` links to the underlying premise or axiom. You challenge a constitution by refuting the premise it stands on.

### Scenario B: Understanding a Business Rule
If you are looking at a messy piece of logic and wondering *why* the business wants it that way:
1. **Entry Point:** Search the vault (via Obsidian or standard search) for the relevant `#business` tag or keyword. Look for `Premises` or `Concepts`.
2. **Traversal:** Use `derives-from` edges to traverse up the logic tree toward source axioms and premises.
   - Example: You find a rule about remessa approval. The `derives-from` edge might point to `premise/business-premises.md` explaining the hypothesis about administrator data errors.

---

## 3. How to Read a Node in the Graph

Because the vault is a living graph, you cannot assume a document is an absolute, unquestionable truth just because it exists.

When you open any document, **look at the Frontmatter (`status`) first:**
- `draft` or `exploratory`: This is an idea or a hypothesis. Engage with it, debate it, but do not structure the codebase tightly around it yet.
- `active`: This reflects how the system currently works today. It might not be perfect, but it is real.
- `consolidated` or `evergreen`: This is the established team consensus or system law. Rely on this heavily.

**Look at the dimensions of confidence:**
- A document might have `convicção: high` (we are betting heavily on this) but `veracidade: low` (we don't have hard evidence yet). Treat these as strategic bets, not established facts.

**Always check the Connections:**
- At the bottom of the file (or ideally, view it in the Obsidian Local Graph), look at what this note connects to. If a node has a `contradicts` edge pointing to another node, read both before proceeding.
