---
tags: [vault, agents, ontology]
node_type: conceptual
is_session: false
layer: ontology
nature: procedural
status: consolidated
version: 0.1.0
last_updated: 2026-03-19
---

# Agent Navigation Guide

> **[AGENT INSTRUCTION] THIS DOCUMENT IS WRITTEN FOR YOU.**
> This file contains the optimal heuristics for traversing this knowledge graph. Do not attempt to read the entire vault linearly. Human readers may ignore this file.

This document exists at the root of the vault (schema-level) and is orthogonal to the business graph. It codifies the best practices for autonomous agents (LLMs) to retrieve context, make decisions, and update the graph.

---

## Objective

This document is the **agent-specific traversal manual** for the vault. It answers the question: *"As an LLM agent, how do I efficiently find, interpret, and update knowledge in this graph?"*

It provides heuristics for graph entry, trust hierarchy interpretation, edge traversal, and rules for modifying the graph without introducing noise or duplication.

---

## Index

1. [Navigating the Graph Space](#1-navigating-the-graph-space)
2. [Reading Node Connections](#2-reading-node-connections)
3. [Modifying the Graph](#3-modifying-the-graph)

---

## 1. Navigating the Graph Space

The vault is not a flat file system; it is a locally dense, typed graph. Your primary objective when dropped into a new problem is to resolve ambiguity using the shortest path to an `evergreen` or `consolidated` node.

### Heuristic 1: Start at the Constitutions
`Confidence: High | Veracidade: High`

When making an architectural or structural decision (e.g., "Where does this file belong?" or "How should I log this event?"), **always start by reading the relevant constitution** in `/constitution/`. Constitutions are the enforceable laws of the system.
- If a constitution exists for your problem space, follow it strictly.
- Constitutions link to axioms and premises (`derives-from`). If the constitution seems contradictory or lacks context, follow the link to the underpinning `axiom` or `premise` to understand the root intent.

### Heuristic 2: Use Grep for Tag-Based Entry Points
`Confidence: High | Veracidade: Medium`

When you have a loose domain concept (e.g., "remessa"), do not blindly list directories. Use `grep` or search tools to find documents tagged with that concept in their frontmatter.
- Example: `grep_search(query="#remessa", path="vault/")`
- Once you find an entry node, use its `## Connections` to traverse the local neighborhood.

### Heuristic 3: Sessions Are Provenance, Not Reference
`Confidence: High | Veracidade: High`

Session nodes (`is_session: true`) exist to preserve **why** a decision was made — the reasoning, alternatives considered, and context at the time. They are the archaeological layer of the vault.

**Do NOT read session nodes to understand how the system works.** For "what does the system do?" or "how is X implemented?", read specs, constitutions, and code — those are the living artifacts.

**Only read sessions when you need to trace why a specific decision was made** — for example, when a rule seems arbitrary, a spec choice is puzzling, or you need to understand the tradeoffs behind an architectural choice. Use `derives-from` edges or `promoted_candidates` in session frontmatter to find which sessions produced a given vault node.

### Heuristic 4: Trust Hierarchy (Status Matters)
`Confidence: High | Veracidade: High`

Not all Markdown in this vault is equal. You must read the `status` in the frontmatter before acting on the contents of a file.
- `evergreen` / `consolidated`: Treat as absolute truth. If codebase contradicts these, the codebase is likely wrong.
- `active`: Current system state. Good for implementation context.
- `exploratory` / `draft`: Do **not** use as authoritative justification for your decisions. These are hypotheses.

---

## 2. Reading Node Connections

The `## Connections` section at the bottom of every content node defines the directed edges of the graph.

### Heuristic 5: Traverse 'Derives-From' for Context
`Confidence: High | Veracidade: High`

`derives-from` is the canonical edge direction for all parent→child reasoning chains. If you are reading an `active` premise and need to know *why* it exists, follow the `derives-from` links back to the axiom or premise that motivated it.

### Heuristic 6: Resolve Contradictions ('contradicts' edges)
`Confidence: Medium | Veracidade: High`

If you see an edge typed `contradicts`, this is a high-priority tension in the graph. Before implementing a feature related to either node, you must inform the human user of the contradiction and ask for a resolution.

> The **absence** of `contradicts` edges does not mean the vault is contradiction-free — only that no contradictions have been formally identified and documented yet.

---

## 3. Modifying the Graph

You, the agent, are expected to keep the graph updated as you write code and learn about the system.

### Heuristic 7: The Orthogonality Principle
`Confidence: High | Veracidade: High`

Before creating a *new* document, ask: *"If I remove this document, is any information lost that cannot be recovered from the others?"*
- If no (the information exists elsewhere), **do not create the document**. Instead, add a link to the existing document or update it.
- Never duplicate information just to place it in a different folder.

### Heuristic 8: Downgrade on Evidence
`Confidence: High | Veracidade: Medium`

If you discover that the actual codebase contradicts a `consolidated` or `active` premise, and you are certain the code is correct (e.g., approved by the user), you must **proactively edit the premise document**.
- Change the `status` to `active` or `exploratory`.
- Add a note explaining the contradiction and link to the relevant codebase file.

### Heuristic 9: Update Edges When Files Move
`Confidence: High | Veracidade: High`

If you rename or move a file in the vault, you must run a search to find all other files that link to it (e.g., looking for `old-filename`) and update those links. Broken links destroy the graph's utility.
