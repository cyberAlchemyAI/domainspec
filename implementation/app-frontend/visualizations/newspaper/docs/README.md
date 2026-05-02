---
tags: [newspaper, agents, godel-machine, documentation]
description: Navigation map for supplemental documentation, design references, and hand-off context for the Newspaper ecosystem.
node_type: readme
is_session: false
layer: application
nature: reference
status: active
last_updated: 2026-04-10
---

# Newspaper Docs — Navigation Map

## What is this?

Supplemental documentation for the Newspaper (O Grafo Diário) ecosystem. Contains protocol definitions, architecture references, editorial assets, discovery documents, and agent hand-off context that support the multi-agent Gödel Machine platform.

## Business Context

The newspaper ecosystem relies on multiple autonomous agents (Darwin Engine, Backend, UI Evolution, Editor-in-Chief, Platform Architect) that need shared schemas, communication protocols, and architectural references to operate coherently. This folder centralizes those cross-cutting documents.

## Why it matters

Without a single source of truth for data contracts, communication protocols, and architectural decisions, agents diverge in their assumptions. These docs ensure alignment across the ecosystem and provide efficient context transfer between agent sessions.

## 📁 Navigation

- **[HANDOFF_CONTEXT.md](HANDOFF_CONTEXT.md)**: Ultra-dense context transfer document for agent hand-offs — compressed mental model of the Evolution Platform.
- **`protocol/`**: Communication and data exchange specifications.
  - **[data-exchange-protocol.md](protocol/data-exchange-protocol.md)**: Single source of truth for all data schemas exchanged between agents.
  - **[newspaper-communication-protocol.md](protocol/newspaper-communication-protocol.md)**: Inter-agent communication protocol definitions.
- **`architecture/`**: System design and reference documents.
  - **[agent-ecosystem-reference.md](architecture/agent-ecosystem-reference.md)**: Agent ecosystem reference guide.
  - **[agent_ecosystem_overview.md](architecture/agent_ecosystem_overview.md)**: High-level overview of the agent ecosystem.
  - **[agent-data-contracts.md](architecture/agent-data-contracts.md)**: Data contracts between agents.
  - **[godel-machine-dictionary.md](architecture/godel-machine-dictionary.md)**: Dictionary of Gödel Machine terminology.
- **`editorial/`**: Frontend and editorial assets.
  - **[README_FRONTEND.md](editorial/README_FRONTEND.md)**: Frontend-specific README for the newspaper UI.
  - **[refactoring-report.md](editorial/refactoring-report.md)**: Report on editorial/UI refactoring efforts.
- **`discovery/`**: Exploration and discovery documents.
  - **[newspaper-discovery.md](discovery/newspaper-discovery.md)**: Origin discovery document for the newspaper concept.
  - **[knowledge-graph-navigation-discovery.md](discovery/knowledge-graph-navigation-discovery.md)**: Discovery on knowledge graph navigation patterns.
