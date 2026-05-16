---
tags: [newspaper, agents, godel-machine, evolution]
node_type: readme
is_session: false
layer: application
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Newspaper Specifications — O Grafo Diário

## What is this?

Specifications for **O Grafo Diário** — an internal daily newspaper that synthesizes vault activity into a browsable publication, driven by an autonomous 5-agent evolutionary Gödel Machine ecosystem.

## Business Context

ZefraHub's vault produces rich structured data every day: conversation nodes with importance scores, key decisions, file changes, and epistemic signals (contradictions, status transitions). This information is currently only discoverable by manually browsing `docs/vault/conversations/`. The newspaper transforms this raw graph activity into a readable daily digest, functioning as a real-time reporting tool.

## Why it matters

As the vault grows past hundreds of sessions, the cost of staying oriented increases. The newspaper solves the "what happened while I wasn't looking?" problem — compressing a day's activity into a 5-minute read, prioritized by relevance, every morning.

## 📁 Navigation

- **[backlog.md](backlog.md)**: Cross-agent backlog for the Gödel Machine ecosystem.
- **`agents/`**: Constitutions and constraints for the specialized domain agents (Darwin Engine, Backend, UI Evolution, Editor-in-Chief, Platform Architect).
  - `system-state.md` — slim snapshot of current ecosystem state (START HERE).
  - `info-exchange.md` — historical archive of cross-agent communication.
  - `evolution-wall.md` — macroscopic log of system-level decisions.
- **`docs/`**: Supplemental documentation, design references, hand-off context (protocol, architecture, editorial, discovery).
- **`evolution/`**: Evolutionary Subsystem (Gödel Machine / Multi-Armed Bandit) and the UI matrix.
- **`mockups/`**: Design inspiration and static mockups for O Grafo Diário.
- **`orchestrator/`**: Context Router and Root Manifesto — entry point for the System Operator when interacting with the multi-agent ecosystem.
