---
stage: S2-invoke-define
capability: invoke
mode: define
status: pass
updatedAt: 2026-06-08
---

# S2 Invoke Define

## Definition

DomainSpec implementation should host a target-local Inventory integration
feature pack that explains, plans, and later validates how Arcanum Inventory can
inventorize DomainSpec implementation sources through chat-first target
confirmation, JSON indexes, Markdown records, and explicit authority boundaries.

## Problem Statement

The current Inventory package is ready for bounded implementation, but its first
pilot target was still framed around Arcanum examples. The user now wants the
work shaped inside DomainSpec implementation. Without a DomainSpec-local feature
pack, the effort can blur three distinct authorities:

- Arcanum Inventory as capability source,
- DomainSpec implementation as target evidence and authority surface,
- generated Inventory records as read models only.

## Primary Users

| User | Need |
| --- | --- |
| Operator | Call Inventory from a chat session and know what DomainSpec source will be inventorized before mutation. |
| Agent | Query cards, selectors, links, exclusions, and gaps without rereading the whole DomainSpec repo. |
| DomainSpec maintainer | Preserve DomainSpec authority rules and template ownership. |
| Inventory maintainer | Prove the interface/index MVP with a real non-Arcanum target. |

## Scope

In scope:

- DomainSpec-local feature/refinement artifacts,
- target proposal shape for DomainSpec implementation,
- candidate DomainSpec pilot target options,
- index/link/template/validator plan,
- task-session handoff after refinement.

Out of scope:

- broad DomainSpec repository inventorization,
- mutation of DomainSpec canonical source files during refine,
- Arcanum Inventory runtime implementation during refine,
- promotion of Inventory links into DomainSpec relationships, definitions, or ontology.

## Candidate Feature Name

`inventory-interface-indexing`

## Definition Verdict

Pass. The target is coherent and should be treated as a DomainSpec feature pack
for planning, with Arcanum Inventory as upstream capability evidence.

