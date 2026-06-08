---
stage: S6-invoke-design
capability: invoke
mode: design
status: pass
updatedAt: 2026-06-08
---

# S6 Invoke Redefine / Design

## Design Statement

Create `docs/features/inventory-interface-indexing/` as a DomainSpec
implementation feature pack that acts as the local planning and execution
surface for Inventory's interface/index MVP.

## Architecture Shape

```text
User prompt
  -> DomainSpec-local Inventory target proposal
  -> confirmation gate
  -> bounded DomainSpec source slice
  -> JSON Inventory indexes
  -> Markdown coverage/read views
  -> DomainSpec authority/gap handoff
```

## Layers

| Layer | Owner | Purpose |
| --- | --- | --- |
| Interface layer | Inventory | Infer target, show confirmation, expose status/explain/lookup views. |
| DomainSpec target layer | DomainSpec implementation | Provides source files, feature packs, templates, authority map, and rules. |
| Slice layer | Inventory | Writes cards, index, retrieval, and coverage for a confirmed target. |
| Index layer | Inventory | Stores tag, selector, link, backlink, traceability, query, projection, and gap/risk indexes. |
| Authority layer | DomainSpec/Definitions/Ontology owners | Decides semantic promotion, definitions, relationships, and canonical source conflicts. |

## DomainSpec Pilot Target Options

| Option | Benefit | Risk | Best Use |
| --- | --- | --- | --- |
| A. `domainspec-arcanum-superset` feature pack | Rich boundary evidence and existing Arcanum mapping context. | Can mix with older blocked superset work if not scoped tightly. | Best first DomainSpec pilot after templates/validator exist. |
| B. `AUTHORITY-MAP.md` plus templates folder | Directly tests authority and template ownership. | Too narrow if cards need workflow and feature context. | Good validator fixture target. |
| C. `ui-prototyping-studio` feature pack | Real feature pack with inventory subfolder and UI docs. | Could pull in UI complexity. | Good second pilot for lookup/status ergonomics. |
| D. Root DomainSpec navigation docs | Easy to parse and high-level. | Risk of broad repo-summary cards. | Use only for status/explain examples. |

## Recommended Pilot Direction

Recommended first DomainSpec pilot after contract/templates/validator:

```text
docs/features/domainspec-arcanum-superset/
```

Reason: it already contains the exact authority tension this work needs, but
inside the DomainSpec implementation repository.

## Design Verdict

Pass, with one caution: the plan must prevent the superset feature from becoming
the execution pack for Inventory. It is a pilot corpus candidate, not the owner
of Inventory behavior.

