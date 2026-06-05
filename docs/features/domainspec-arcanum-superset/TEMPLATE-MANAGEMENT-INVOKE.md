---
feature: domainspec-arcanum-superset
version: current
status: draft
updatedAt: 2026-05-26
docType: invoke-result
owners:
  - domainspec-core
---

# Template Management Invoke Result

## Invoke Result

- Mode: design
- Spell: invoke
- Canonical ID: invoke
- Scope: library
- Phase status: flag
- Mode contract: `arcanum/spells/invoke/design.md`
- Outputs: `implementation/domainspec/docs/features/domainspec-arcanum-superset/TEMPLATE-MANAGEMENT-INVOKE.md`
- Template/profile selection: focused design note; no new template family selected or promoted
- Decisions: manage templates through a read-only catalog and authority crosswalk before any merge, rewrite, or generated view
- Unresolved gaps: exact template schema, canonical precedence rules for duplicate template purposes, validation example coverage
- Next route: `TASK-DSAS-001`, then `TASK-DSAS-002`

## Decision

Templates should be managed, but not merged in L0.

DomainSpec and Arcanum already have separate template authority:

- DomainSpec owns delivery and product artifact templates under `implementation/domainspec/templates/`.
- Arcanum owns capability, lifecycle, runtime, observability, invoke, spell, and sigil templates under Arcanum capability folders, especially `arcanum/spells/invoke/templates/`.
- The superset should own a catalog and crosswalk first, not template bodies.

## L0 Management Model

| Object | DomainSpec Representation | Arcanum Source | L0 Behavior |
| --- | --- | --- | --- |
| Template | `Interface` or `Mapping` candidate, depending on whether it defines an artifact contract or transforms intent into an artifact shape | Any `templates/` file | Inventory only |
| Template Family | `Enum / Type` or local `CapabilityTemplateFamily` candidate | Invoke families such as `module-formulae`, `sigil`, `spell`, `architecture`, `work-pack` | Local vocabulary only |
| Template Selection Policy | `Policy` | Invoke mode contracts and template READMEs | Record eligibility and tie behavior |
| Template Validation Example | `ValidationExperiment` candidate, likely a `Workflow` plus evidence artifact | `examples/passing.md`, `examples/missing-input.md`, harness evidence | Record coverage and gaps |
| Template Authority Record | `Rule` plus `Policy` | DomainSpec authority map, Arcanum registry/lifecycle contracts | Decide precedence, no mutation |

## Management Rules

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| TM-001 | Template bodies stay in their owning system until a generated-view policy exists. | W0 crosswalk review |
| TM-002 | Template selection must record source path, owning capability/framework, intended artifact type, validation status, and promotion status. | Template catalog schema |
| TM-003 | Candidate template families are not canonical merely because invoke can use them. | Invoke template gate |
| TM-004 | Duplicate template purposes must be resolved by explicit precedence, not folder order. | Registry authority rule |
| TM-005 | Generated DomainSpec views of Arcanum templates must preserve source provenance and lifecycle owner. | L1+ bridge validation |

## Required W0 Addition

`TASK-DSAS-002` should include templates in the same non-mutating inventory as sigils and spells:

- DomainSpec template inventory from `implementation/domainspec/templates/`
- Invoke template inventory from `arcanum/spells/invoke/templates/`
- Arcanum capability template inventory from `arcanum/**/templates/`
- Template-family crosswalk
- Validation-example coverage map
- Duplicate-purpose gap ledger

## Gate Result

Status: `flag`

This is a coherent management model, but it is not ready for implementation. It needs to be carried into `SPEC.md` as local vocabulary and into the W0 crosswalk before any registry, generated view, or runtime adapter work begins.
