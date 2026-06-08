---
stage: S5-distill
capability: distill
mode: standard
status: pass
updatedAt: 2026-06-08
---

# S5 Distill

## Broad Layer

Inventory inside DomainSpec implementation could mean many things:

- a runtime command install,
- a repository-wide indexing project,
- a DomainSpec feature pack,
- a pilot slice,
- a template governance crosswalk,
- a search/indexing substrate.

## Smallest Coherent Unit

The smallest coherent unit is:

```text
A DomainSpec-local Inventory interface feature pack that plans the chat-first
Inventory MVP and defers pilot mutation until a confirmed DomainSpec target.
```

## Why This Unit Is Small Enough

- It creates one bounded feature planning surface.
- It avoids broad repository inventorization.
- It does not require runtime implementation yet.
- It can produce a Task Session handoff for `SWU-INT-001` style execution.

## Why This Unit Is Still Meaningful

- DomainSpec authority and feature-pack rules are present from the start.
- The future pilot can be a real DomainSpec implementation target.
- Arcanum Inventory remains the source capability rather than being forked.
- The plan can recompose into interface contract, templates, validators, and
  pilot slices.

## Recomposition

| Upper Layer | Recomposition |
| --- | --- |
| Inventory MVP | Reuses the same contract/templates/validator/pilot order from Arcanum Inventory. |
| DomainSpec implementation | Hosts target-local feature docs and authority-aware pilot choices. |
| DomainSpec/Arcanum superset | Provides evidence and boundary lessons without becoming the active execution pack. |

## Verdict

Pass. Optimize around a target-local feature pack and defer pilot mutation.

