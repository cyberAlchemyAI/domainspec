---
tags: [newspaper, agents, godel-machine, documentation]
node_type: readme
is_session: false
layer: application
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Newspaper Docs

## What is this?

Supplemental documentation for the Newspaper (O Grafo Diário) ecosystem. Contains protocol definitions, architecture references, editorial assets, discovery documents, and agent hand-off context that support the multi-agent Gödel Machine platform.

## Business Context

The newspaper ecosystem relies on multiple autonomous agents (Darwin Engine, Backend, UI Evolution, Editor-in-Chief, Platform Architect) that need shared schemas, communication protocols, and architectural references to operate coherently. This folder centralizes those cross-cutting documents.

## Why it matters

Without a single source of truth for data contracts, communication protocols, and architectural decisions, agents diverge in their assumptions. These docs ensure alignment across the ecosystem and provide efficient context transfer between agent sessions.

## 📁 Navigation

- **[HANDOFF_CONTEXT.md](HANDOFF_CONTEXT.md)**: Ultra-dense context transfer document for agent hand-offs — compressed mental model of the Evolution Platform.
- **`protocol/`**: Communication and data exchange specifications.
  - `data-exchange-protocol.md` — single source of truth for all data schemas exchanged between agents.
  - `newspaper-communication-protocol.md` — inter-agent communication protocol definitions.
- **`architecture/`**: System design and reference documents (agent ecosystem reference + overview, agent data contracts, Gödel Machine dictionary).
- **`editorial/`**: Frontend and editorial assets (frontend README, refactoring report).
- **`discovery/`**: Exploration and discovery documents (newspaper origin, knowledge-graph navigation).
