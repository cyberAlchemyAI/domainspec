---
tags: [architecture, application, ontology]
node_type: discovery
is_session: true
layer: architecture, application
nature: explanatory, reference
status: active
created: 2026-05-25
timestamp: 2026-05-25T20:51:29-0300
expires: 2026-07-24
conversation_id: ""
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Establishing 9 cross-cutting contracts and exposing which components violate them creates the shared compliance surface that future component work will be held against."
---

# Product Components — Cross-Component Invariants and Introduction Rewrite

## Summary

This session substantially rewrote PRODUCT-COMPONENTS-IDEA.md. A Cross-Component Invariants section was added declaring 9 contracts across three groups (structural, behavioral, process) with a table mapping which product components comply today and which carry design debt. The Introduction was rewritten to build a precise reasoning chain — bad specs cost money, coding got cheaper with agents, alignment and discovery are the two things the product solves for — replacing an earlier version with epistemic labels inline that read as a compliance report rather than a product argument. A `created_by` provenance placeholder field was added to the frontmatter schema (ontology-conventions.md v2.2.0 and frontmatter skill).

## Files touched

- PRODUCT-COMPONENTS-IDEA.md
- vault/ontology-conventions.md
- .claude/skills/custom/frontmatter.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `PRODUCT-COMPONENTS-IDEA.md` | `modifies` | Substantially rewrote the introduction and added the Cross-Component Invariants section with 9 contracts mapped to current component compliance. |
| `vault/ontology-conventions.md` | `modifies` | Added the `created_by` provenance placeholder field and bumped schema to v2.2.0. |
| `.claude/skills/custom/frontmatter.md` | `modifies` | Added `created_by` field definition and documentation to the frontmatter cheatsheet. |
