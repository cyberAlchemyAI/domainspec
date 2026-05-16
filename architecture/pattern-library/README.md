---
tags: [architecture, pattern-library, concepts, reference]
node_type: readme
is_session: false
layer: architecture, ontology
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# DomainSpec Pattern Library

## What is this?

The pattern library is the curated set of architecture concept cards and reference docs (layering, dependency rules, testing alignment, observability alignment) used as **selective context** during implementation. Backend and UI concept files document a single typed concept each (e.g. `entity`, `value-object`, `workflow`, `page`, `form`) with the rules and examples needed to apply it correctly.

## Business Context

DomainSpec specs reference typed concepts from the 24-meta-type taxonomy. When an implementer or planner agent works on a task, loading the entire taxonomy is wasteful and noisy; loading only the cards needed for the task is precise. This library is the source of those cards, paired with the relationship cards in `../ARCHITECTURE-PATTERN-LIBRARY.md`.

## Why it matters

Without per-concept cards, implementation drifts: agents reinvent rules, miss layering constraints, and produce code that violates dependency direction or testing alignment. The selection recipe in this folder keeps context windows small and the produced code correct. It is the practical bridge between the abstract taxonomy and concrete implementation choices.

## 📁 Navigation

Reference documents:

- **[ARCHITECTURE-FOUNDATIONS.md](ARCHITECTURE-FOUNDATIONS.md)** — Foundational architecture principles.
- **[LAYERING-REFERENCE.md](LAYERING-REFERENCE.md)** — Layer definitions and placement rules.
- **[DEPENDENCY-RULES.md](DEPENDENCY-RULES.md)** — Allowed/forbidden dependency directions across layers.
- **[TESTING-ALIGNMENT.md](TESTING-ALIGNMENT.md)** — How each concept type maps to test obligations.
- **[OBSERVABILITY-ALIGNMENT.md](OBSERVABILITY-ALIGNMENT.md)** — How each concept type maps to observability signals.

Concept cards:

- **`concepts/backend/`** — Backend concept cards: `entity.md`, `value-object.md`, `enum-type.md`, `operation.md`, `query.md`, `calculation.md`, `rule.md`, `policy.md`, `workflow.md`, `saga.md`, `interface.md`, `event.md`, `mapping.md`, `state-machine.md`.
- **`concepts/ui/`** — UI concept cards: `page.md`, `layout.md`, `component.md`, `view-model.md`, `hook.md`, `form.md`, `action.md`, `guard.md`, `binding.md`, `adapter.md`, `state-indicator.md`.

## Selection Recipe

1. Start from the work-pack task intent.
2. Open only the concept files needed by that intent.
3. Open only the relationship cards (in `../ARCHITECTURE-PATTERN-LIBRARY.md`) connecting those concepts.
4. Implement and test per selected cards.
