---
docType: refine-result
runId: 20260608T034521Z-domainspec-implementation
status: flag
updatedAt: 2026-06-08
---

# Refine Result: Inventory Inside DomainSpec Implementation

## Target

```text
/home/vrondelli/projects/domainspec-core/implementation/domainspec
```

## Status

Flag.

The refinement is complete enough to hand off a first bounded Task Session, but
it is not permission to create a pilot slice yet.

## Final Synthesis

Inventory should be introduced inside DomainSpec implementation as a
target-local feature pack:

```text
docs/features/inventory-interface-indexing/
```

This feature pack should plan and govern how the Arcanum Inventory interface MVP
is exercised against DomainSpec implementation sources. Arcanum Inventory remains
the capability source. DomainSpec implementation remains the target and source
authority. Generated Inventory artifacts remain read models.

## Refined Architecture

```text
DomainSpec user prompt
  -> Inventory target inference
  -> DomainSpec-aware confirmation proposal
  -> confirmed bounded DomainSpec source slice
  -> Inventory cards/index/retrieval/coverage
  -> JSON selector/link/tag/gap indexes
  -> Markdown status/explain/lookup projections
  -> DomainSpec authority or downstream owner handoff
```

## Refined Plan

| Task | Goal | Gate |
| --- | --- | --- |
| TASK-DS-INV-001 | Create feature pack baseline: `SPEC.md`, `ARCHITECTURE.md`, `IMPLEMENTATION-PLAN.md`, `WORK-PACK.md`. | ready |
| TASK-DS-INV-002 | Normalize/check DomainSpec-local Inventory runtime/capability surface. | ready-after-001 |
| TASK-DS-INV-003 | Adapt `$inventory` interface contract to DomainSpec target rules. | ready-after-001 |
| TASK-DS-INV-004 | Add DomainSpec target proposal and chat-view templates. | blocked-by-003 |
| TASK-DS-INV-005 | Add DomainSpec-aware index/link templates. | blocked-by-003 |
| TASK-DS-INV-006 | Extend validator for DomainSpec authority and link/index discipline. | blocked-by-005 |
| TASK-DS-INV-007 | Confirm and create first DomainSpec pilot slice. | blocked-by-006-and-target-confirmation |
| TASK-DS-INV-008 | Sync readiness, docs, and Task Session handoff. | blocked-by-007 |

## Recommended First Pilot

Recommended, not yet selected:

```text
implementation/domainspec/docs/features/domainspec-arcanum-superset/
```

Why: it already expresses the DomainSpec/Arcanum authority tension, while living
inside DomainSpec implementation.

## Required Gates

1. Do not run a broad DomainSpec repository inventory sweep.
2. Do not mutate pilot slices before target confirmation.
3. Do not treat Inventory read-model links as DomainSpec relationships,
   definitions, or ontology.
4. Do not treat repo-local `tools/arcanum --resolve` as complete until the
   missing `invoke`, `interrogation`, and `refine` command handles are normalized
   or explicitly bridged to native skill resolution.
5. Keep Arcanum Inventory implementation changes separate from DomainSpec-local
   planning artifacts unless a Task Session explicitly owns that write scope.

## Stage Evidence

| Stage | Verdict | Artifact |
| --- | --- | --- |
| Context Builder evidence baseline | pass | `stages/S1-context-builder.md` |
| Invoke Define | pass | `stages/S2-invoke-define.md` |
| Interrogation refine-review | flag | `stages/S3-interrogation-review.md` |
| Research decision | pass | `stages/S4-research-decision.md` |
| Distill | pass | `stages/S5-distill.md` |
| Invoke Redefine / Design | pass | `stages/S6-invoke-design.md` |
| Interrogation refine-design-review | pass | `stages/S7-design-review.md` |
| Distill Repair | flag | `stages/S8-distill-repair.md` |
| Invoke Plan | pass | `stages/S9-invoke-plan.md` |
| Final Interrogation and Synthesis | flag | `stages/S10-final-interrogation-synthesis.md` |

## Recommended Next Route

Run `task-session` for:

```text
TASK-DS-INV-001: Create the DomainSpec-local Inventory interface/indexing
feature pack baseline.
```

This first task should write only feature-pack planning artifacts under:

```text
implementation/domainspec/docs/features/inventory-interface-indexing/
```

It should not create a pilot slice yet.

