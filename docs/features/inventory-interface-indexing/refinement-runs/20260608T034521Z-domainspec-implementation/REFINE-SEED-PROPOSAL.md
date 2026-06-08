---
docType: refine-seed-proposal
runId: 20260608T034521Z-domainspec-implementation
status: strategy-proposal
target: domainspec-implementation-inventory-interface-indexing
updatedAt: 2026-06-08
---

# Refine Seed Proposal: Inventory Inside DomainSpec Implementation

## Operator Intent

Refine the Inventory interface and indexing work so the first interface-driven
Inventory pilot happens inside the DomainSpec implementation repository.

## Target Boundary

Primary target:

```text
/home/vrondelli/projects/domainspec-core/implementation/domainspec
```

Target-local feature folder:

```text
docs/features/inventory-interface-indexing/
```

Capability source:

```text
/home/vrondelli/projects/domainspec-core/arcanum/arcana/inventory/
```

## Desired Outcome

Produce an MVP-ready, non-executed plan for integrating the Inventory
chat-first interface, JSON indexes, Markdown records, target confirmation, and
first pilot slice into DomainSpec implementation without mutating broad
repository surfaces.

## Source Context

| Source | Role |
| --- | --- |
| `arcanum/arcana/inventory/development/INTERFACE-ARCHITECTURE.md` | Inventory interface contract. |
| `arcanum/arcana/inventory/development/INDEX-TECHNIQUE-RESEARCH.md` | Index technique set and deferrals. |
| `arcanum/arcana/inventory/development/LINKING-DISCIPLINE.md` | Link ownership, edge vocabulary, and non-authority rules. |
| `arcanum/arcana/inventory/development/WORK-PACK.md` | Active task/SWU order. |
| `arcanum/arcana/inventory/development/decisions/INTERFACE-INDEXING-OPEN-GATE.md` | Open blockers and pilot target options. |
| `implementation/domainspec/AUTHORITY-MAP.md` | DomainSpec source authority reference. |
| `implementation/domainspec/templates/` | DomainSpec template authority surface. |
| `implementation/domainspec/docs/features/domainspec-arcanum-superset/` | Existing DomainSpec/Arcanum integration feature pack. |

## Write Scope For This Refinement

Allowed:

- this refinement run folder,
- optional future plan/spec/work-pack artifacts under
  `docs/features/inventory-interface-indexing/`.

Not allowed during the proposal stage:

- modifying Arcanum Inventory runtime behavior,
- mutating `.codex`, `.arcanum`, generated runtime state, or submodule content,
- creating the pilot slice before target confirmation,
- promoting Inventory links to ontology or definitions authority.

## Preset And Research

- Preset: `standard`
- Research mode: `research-if-gap-appears`
- External research: not authorized for the proposal.

## Planned Stage Configuration

The refinement route keeps the canonical ten-stage Refine loop:

1. Context Builder evidence baseline.
2. Invoke Define.
3. Interrogation refine-review.
4. Research decision.
5. Distill.
6. Invoke Redefine / Design.
7. Interrogation refine-design-review.
8. Distill Repair.
9. Invoke Plan.
10. Final Interrogation and Refine synthesis.

## Technique Overlays

| Overlay | Reason |
| --- | --- |
| `baseline_sequence` | The target needs an ordered refinement path before implementation. |
| `route_menu_for_ambiguity` | Pilot target, DomainSpec ownership boundary, and output home have multiple viable options. |
| `xray_for_hidden_structure` | Inventory indexing and DomainSpec authority/template surfaces are relationship-heavy. |
| `memory_residue_for_context_recovery` | Prior Inventory and DomainSpec/Arcanum integration work materially affect the plan. |

## Done Criteria

- Route dispatch validates against the dispatch schema.
- Strategy preview records permission state before execution.
- Refinement, if confirmed later, produces a plan that distinguishes:
  - Arcanum capability source,
  - DomainSpec implementation target,
  - inventory generated read models,
  - DomainSpec authority surfaces,
  - deferred pilot mutation.
- No consequential mutation happens before the user confirms the run.

