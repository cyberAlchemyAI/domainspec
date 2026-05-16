---
tags: [governance, code-tags, examples, edges]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Code Tag Example Pack

## What is this?

Compact, scope-sliced examples for the canonical DomainSpec relationship edges expressed as code tags. Each file in this pack covers a different surface (backend, UI, cross-layer) so agents can load the smallest relevant slice.

## Business Context

When an agent or developer adds tags to a new symbol, they need a concrete example of the right shape — not the full edge catalog. This pack splits the catalog by surface so each task pulls only the slice it needs, keeping prompts narrow and decisions clear.

## Why it matters

Loading the entire relationship corpus on every tagging task burns context and dilutes signal. Slicing by surface (backend / UI / cross-layer) keeps token cost proportional to scope and makes the "look up the right edge" step deterministic.

## 📁 Navigation

- **[backend.md](backend.md)**: Backend edges (15) — domain, use-case, persistence, calculation, policy, workflow relationships.
- **[ui.md](ui.md)**: Intra-UI edges (8) — page, component, hook, binding relationships within the UI layer.
- **[cross-layer.md](cross-layer.md)**: Cross-layer edges (6) — bindings, interfaces, and integrations that cross UI/backend boundaries.

## Context Optimization for Agents

Use only the smallest file needed for the implementation task:

- Backend use-case/domain work: load `backend.md` only.
- UI component/page/hook work: load `ui.md` only.
- API binding and integration work: load `cross-layer.md` only.

This avoids injecting the full relationship corpus when a narrower example slice is sufficient.
