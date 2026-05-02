---
tags: [newspaper, agents, godel-machine, evolution]
description: Navigation Map and context guide for the Newspaper specifications and Gödel Machine ecosystem.
node_type: readme
is_session: false
layer: application
nature: reference
status: active
last_updated: 2026-04-10
---

# Newspaper Specifications — Navigation Map

## 1. What is this?
This directory contains the specifications for **O Grafo Diário** — an internal daily newspaper that synthesizes vault activity into a browsable publication, driven by an autonomous 5-agent evolutionary Gödel Machine ecosystem.

## 2. Business Context
ZefraHub's vault produces rich structured data every day: conversation nodes with importance scores, key decisions, file changes, and epistemic signals (contradictions, status transitions). This information is currently only discoverable by manually browsing the `docs/vault/conversations/` directory. The newspaper transforms this raw graph activity into a readable daily digest, functioning as a real-time reporting tool.

## 3. Why it matters
As the vault grows past hundreds of sessions, the cost of staying oriented increases. The newspaper solves the "what happened while I wasn't looking?" problem — compressing a day's activity into a 5-minute read, prioritized by relevance, every morning.

## 4. 📁 Navigation

- **[README.md](README.md)**: This navigation map and context guide.
- **[backlog.md](backlog.md)**: The general cross-agent backlog for the Gödel Machine ecosystem.
- **`agents/`**: Contains the constitutions and constraints for the specialized domain agents (Darwin Engine, Backend, UI Evolution, Editor-in-Chief, Platform Architect).
  - **[system-state.md](agents/system-state.md)**: **START HERE.** Slim snapshot of the current ecosystem state.
  - **[info-exchange.md](agents/info-exchange.md)**: Historical archive of cross-agent communication.
  - **[evolution-wall.md](agents/evolution-wall.md)**: Macroscopic log of system-level decisions.
- **`docs/`**: Supplemental documentation, design references, and hand-off context.
  - **[docs/protocol/](docs/protocol/)**: `data-exchange-protocol.md` (single source of truth for all schemas), `newspaper-communication-protocol.md`
  - **[docs/architecture/](docs/architecture/)**: Agent ecosystem overview, data contracts, Gödel Machine dictionary
  - **[docs/editorial/](docs/editorial/)**: Frontend README, refactoring report
  - **[docs/discovery/](docs/discovery/)**: Discovery documents (newspaper origin, knowledge graph navigation)
  - **[HANDOFF_CONTEXT.md](docs/HANDOFF_CONTEXT.md)**: Ultra-dense context transfer for agent hand-offs
- **`evolution/`**: The main directory for the Evolutionary Subsystem (Gödel Machine/Multi-Armed Bandit) and the UI matrix.
- **`mockups/`**: Design inspiration and static mockups for O Grafo Diário.
- **`orchestrator/`**: The Context Router and Root Manifesto. The entry point for the System Operator when interacting with the multi-agent ecosystem.
