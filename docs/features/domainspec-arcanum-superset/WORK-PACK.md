# WORK-PACK: domainspec-arcanum-superset

## Purpose

Plan-first execution manifest for transforming DomainSpec into a superset of Arcanum through a governed, compatibility-preserving migration. This work-pack is medium complexity because it spans ontology, registry, runtime compatibility, governance, observability, and distribution boundaries.

## Planner Control Fields

| Field             | Value                                                                              | Notes                                                                         |
| ----------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| plannerGateStatus | block                                                                              | Mutation-capable work is blocked until L0 semantic proof and `SPEC.md` exist. |
| complexity        | medium                                                                             | Cross-system design with multiple layers and governance surfaces.             |
| architectureWave  | W0                                                                                 | Architecture baseline created in this folder.                                 |
| activePlanRef     | `implementation/domainspec/docs/features/domainspec-arcanum-superset/WORK-PACK.md` | Current planning entrypoint.                                                  |
| lastPlannedAt     | 2026-05-20T00:00:00Z                                                               | Planning date placeholder; update on execution.                               |
| readinessProfile  | pilot                                                                              | Target is a local pilot before framework-wide promotion.                      |

## Task Status Board

| Task ID               | Goal                                                                    | Complexity | Assigned Waves | Gate Status      | Status      |
| --------------------- | ----------------------------------------------------------------------- | ---------- | -------------- | ---------------- | ----------- |
| TASK-DSAS-001         | Create feature `SPEC.md` and candidate glossary for the superset model. | medium     | W0             | ready            | not-started |
| TASK-DSAS-002         | Build non-mutating Arcanum capability inventory and ontology crosswalk. | medium     | W0             | ready-after-spec | not-started |
| TASK-DSAS-003         | Design runtime compatibility bridge and adapter inventory.              | medium     | W1             | blocked-on-L0    | not-started |
| TASK-DSAS-004         | Add deterministic registry, relationship, and signal validation plan.   | medium     | W2             | blocked-on-W1    | not-started |
| TASK-DSAS-005         | Prepare packaging and migration guide for consumer pilot.               | medium     | W3             | blocked-on-W2    | not-started |
| TASK-VERIFY           | Execute feature verification verdict and publish validation evidence.   | medium     | W3             | ready-after-impl | not-started |
| TASK-SIGNAL-ALIGNMENT | Emit alignment signal obligation for docs-only L0 planning.             | medium     | W0             | ready-after-docs | not-started |
| TASK-SIGNAL-LAYERING  | Emit governance/layering signal obligation for docs-only L0 planning.   | medium     | W0             | ready-after-docs | not-started |

## Closure Strategy Obligations

Current W0 is docs-only and non-mutating. Alignment and layering audit tasks are deferred until mutation-capable work begins. For W0, closure obligations are:

- Seed one verification task that reviews the feature pack and validates markdown links.
- Seed one alignment signal task for any mismatch between DomainSpec authority and Arcanum lifecycle authority.
- Seed one layering signal task for any attempt to move runtime bridge work into L0.

If later waves mutate source code, add:

- one alignment audit task that runs the relevant DomainSpec alignment check and publishes `ALIGNMENT-REPORT.md`,
- one layering audit task that runs the relevant DomainSpec layering check and publishes `LAYERING-ALIGNMENT-REPORT.md`.

## Architecture-Guided Task Directives

| Task ID       | DomainSpec Sources                                            | Coverage IDs         | Architecture References                                                                                           | Implementation Directive                                                                                                                                       | Verification Evidence                                  |
| ------------- | ------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| TASK-DSAS-001 | `ARCHITECTURE.md`; DomainSpec taxonomy; Arcanum README        | D-001, D-002, R-001  | `ARCHITECTURE.md#capability-ontology-mapping`; `IMPLEMENTATION-LAYERING.md#layer-0---minimum-working-unit-poc`    | Author a `SPEC.md` that names capability-domain concepts, boundaries, rules, workflows, interfaces, and local vocabulary without promoting global definitions. | Reviewable `SPEC.md` and glossary candidates.          |
| TASK-DSAS-002 | Arcanum registries; DomainSpec relationships                  | R-001, R-003, RK-001 | `ARCHITECTURE.md#view-3-low-level-components-view`; `ARCHITECTURE.md#dependency-and-interface-rules`              | Generate or draft a read-only inventory mapping sigils, spells, tiers, lifecycle owners, and runtime surfaces to DomainSpec candidate records.                 | Inventory report with unmapped gaps.                   |
| TASK-DSAS-003 | Invoke contract; Arcanum command surface                      | D-002, R-002         | `ARCHITECTURE.md#view-6-dependency-interface-view`; `IMPLEMENTATION-LAYERING.md#layer-1-improvements-over-l0`     | Design adapter metadata and parity checks before replacing any command surface.                                                                                | Adapter inventory and command-resolution fixture plan. |
| TASK-DSAS-004 | DomainSpec constitution; signal schema; Arcanum observability | R-004, RK-003        | `ARCHITECTURE.md#governance-and-validation-layer`; `IMPLEMENTATION-LAYERING.md#layer-2-improvements-over-layer-1` | Define deterministic validators for registry crosswalk, relationship examples, signal crosswalk, and lifecycle route ownership.                                | Validator design and sample pass/flag/block cases.     |
| TASK-DSAS-005 | DomainSpec README; Arcanum install docs                       | RK-004               | `ARCHITECTURE.md#extension-points`; `IMPLEMENTATION-LAYERING.md#layer-3-improvements-over-layer-2`                | Create migration and packaging plan only after local validation evidence exists.                                                                               | Migration guide draft and pilot checklist.             |

## Required Links

Single-file mode is acceptable for the initial plan. Split into `work-pack/tasks/` and `work-pack/waves/` after W0 if task contracts exceed this file.

## Wave Status Board

| Wave | Objective                            | Entry Gate                                   | Exit Gate                                                | Status      | Evidence                                                        |
| ---- | ------------------------------------ | -------------------------------------------- | -------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| W0   | Prove semantic fit without mutation. | Architecture, layering, and work-pack exist. | `SPEC.md`, inventory crosswalk, and gap ledger reviewed. | in-progress | `ARCHITECTURE.md`, `IMPLEMENTATION-LAYERING.md`, `WORK-PACK.md` |
| W1   | Prove runtime compatibility bridge.  | W0 exit evidence accepted.                   | Representative command parity checks pass.               | not-started | pending                                                         |
| W2   | Prove governance and observability.  | W1 parity evidence accepted.                 | Validators and signal crosswalk pass sample cases.       | not-started | pending                                                         |
| W3   | Prove packaging and rollout.         | W2 governance evidence accepted.             | Consumer pilot install and readiness check pass.         | not-started | pending                                                         |

## Pipeline Stage Coverage

| Stage                 | Required | Wave Mapping | Status      | Evidence          | Skip Reason                                                 |
| --------------------- | -------- | ------------ | ----------- | ----------------- | ----------------------------------------------------------- |
| plan                  | yes      | W0           | in-progress | `WORK-PACK.md`    |                                                             |
| architecture-baseline | yes      | W0           | in-progress | `ARCHITECTURE.md` |                                                             |
| spec                  | yes      | W0           | not-started | pending `SPEC.md` |                                                             |
| stories               | yes      | W1+          | not-started | pending           |                                                             |
| tests                 | yes      | W1+          | not-started | pending           |                                                             |
| backend-implement     | yes      | W2+          | skipped     | none              | No backend mutation in L0/W1 planning.                      |
| ui-pipeline           | yes      | W3+          | skipped     | none              | UI/workbench deferred until data contracts stabilize.       |
| observability-spec    | yes      | W2           | not-started | pending           |                                                             |
| instrument-otel       | yes      | W2+          | skipped     | none              | Instrumentation deferred until signal crosswalk is defined. |
| otel-verify           | yes      | W2+          | skipped     | none              | Depends on instrumentation.                                 |
| infra-deploy          | yes      | W3           | skipped     | none              | Packaging/pilot only after validation.                      |
| registry-sync         | yes      | W2           | not-started | pending           |                                                             |
| verify-readiness      | yes      | W3           | not-started | pending           |                                                             |
| verify-feature        | yes      | W3           | not-started | pending           |                                                             |
| audit-alignment       | yes      | W3           | skipped     | none              | No mutation-capable task in current W0 docs-only scope.     |
| audit-layering        | yes      | W3           | skipped     | none              | No mutation-capable task in current W0 docs-only scope.     |

## Smallest Working Unit Manifest

| SWU ID       | Parent Task   | Goal                                                                      | Dependencies                              | Write Scope                                                                   | Done Criteria                                                                | Acceptance Evidence       | Verification                      | Owner          |
| ------------ | ------------- | ------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------- | --------------------------------- | -------------- |
| SWU-DSAS-001 | TASK-DSAS-001 | Draft `SPEC.md` for the capability-domain superset.                       | Architecture approved enough to continue. | `implementation/domainspec/docs/features/domainspec-arcanum-superset/SPEC.md` | Concepts, rules, workflows, interfaces, and gaps are explicit.               | Reviewable feature spec.  | Markdown review and link check.   | local-fallback |
| SWU-DSAS-002 | TASK-DSAS-002 | Draft Arcanum-to-DomainSpec ontology crosswalk.                           | `SPEC.md` exists.                         | New crosswalk doc in feature folder.                                          | Sigils, spells, tiers, lifecycle owners, and run evidence mapped or flagged. | Crosswalk report.         | Review unmapped entries.          | subagent       |
| SWU-DSAS-003 | TASK-DSAS-003 | Define adapter inventory schema and parity target list.                   | W0 exit accepted.                         | Feature docs and future tooling plan only.                                    | Adapter states and parity checks are named.                                  | Adapter inventory design. | Review selected command fixtures. | subagent       |
| SWU-DSAS-004 | TASK-DSAS-004 | Define validation rules for registry, relationship, and signal crosswalk. | W1 bridge design accepted.                | Feature docs and future tool specs.                                           | Pass/flag/block examples exist.                                              | Validation design report. | Review sample cases.              | subagent       |
| SWU-DSAS-005 | TASK-DSAS-005 | Draft migration and pilot packaging guide.                                | W2 validation evidence accepted.          | Feature docs and packaging plan.                                              | Consumer pilot path and rollback policy are explicit.                        | Migration guide draft.    | Pilot checklist review.           | local-fallback |

## Task Detail Specs

### TASK-DSAS-001 - Feature Spec and Local Vocabulary

Purpose: convert this architecture into a DomainSpec feature pack baseline.

Inputs:

- `ARCHITECTURE.md`
- `IMPLEMENTATION-LAYERING.md`
- DomainSpec taxonomy and relationships
- Arcanum README, registries, and Invoke contract

Outputs:

- `SPEC.md`
- optional `glossary.md`
- named blockers and candidate global-definition requests

Rules:

- Do not promote local capability terms globally.
- Preserve Arcanum lifecycle owners as source concepts.
- Keep the L0 proof non-mutating.

Edge cases and failure modes:

- If a concept cannot map to an existing DomainSpec type, record a candidate type or relationship gap.
- If lifecycle authority is ambiguous, block runtime planning until routed.

### TASK-DSAS-002 - Capability Inventory and Ontology Crosswalk

Purpose: prove that existing Arcanum artifacts can be indexed by DomainSpec without rewriting them.

Inputs:

- `arcanum/registry/SIGILS.md`
- `arcanum/registry/SPELLS.md`
- representative `SKILL.md` and spell files

Outputs:

- capability inventory snapshot
- ontology crosswalk
- unmapped gap ledger

Ordered rules:

1. Read registry tables as source evidence.
2. For each sigil/spell, assign candidate DomainSpec concept type, owner, tier, source path, and lifecycle status.
3. Mark missing validation, missing observability, or unclear runtime adapter as gaps.
4. Do not edit Arcanum sources.

### TASK-DSAS-003 - Runtime Compatibility Bridge

Purpose: design a bridge that lets DomainSpec govern capability routing while Arcanum commands remain stable.

Inputs:

- W0 crosswalk
- Arcanum command surface and runtime adapters

Outputs:

- adapter inventory
- command parity fixture list
- bridge policy

Failure modes:

- If adapter behavior differs by runtime, keep runtime-specific metadata.
- If a command cannot be resolved deterministically, flag it as compatibility gap.

### TASK-DSAS-004 - Governance and Observability Validators

Purpose: define deterministic checks before enforcing superset behavior.

Inputs:

- DomainSpec constitution
- signal schema
- Arcanum observed invocation behavior

Outputs:

- validator design
- pass/flag/block examples
- reflection route mapping

Rules:

- Critical lifecycle authority violations block.
- Missing telemetry flags until the compatibility layer can emit it deterministically.
- Registry promotion requires explicit approval and evidence.

### TASK-DSAS-005 - Packaging and Migration

Purpose: prepare the first consumer-facing pilot only after local evidence passes.

Inputs:

- W0-W2 evidence
- current DomainSpec and Arcanum install flows

Outputs:

- migration guide
- packaging plan
- pilot checklist

Rules:

- Preserve rollback to existing Arcanum usage.
- Do not remove compatibility adapters until a deprecation window is documented.

## Decision Lock Summary

| Decision ID | Scope        | Status   | Selected Option                                              | Source                       | Date       |
| ----------- | ------------ | -------- | ------------------------------------------------------------ | ---------------------------- | ---------- |
| D-001       | architecture | selected | DomainSpec superset substrate with Arcanum capability domain | `ARCHITECTURE.md`            | 2026-05-20 |
| D-002       | migration    | selected | Compatibility bridge before consolidation                    | `ARCHITECTURE.md`            | 2026-05-20 |
| D-003       | planning     | selected | Medium complexity, layered waves                             | `IMPLEMENTATION-LAYERING.md` | 2026-05-20 |

## Blockers

| Blocker ID | Scope | Description                                                  | Owner           | Next Action                                        | Target Date |
| ---------- | ----- | ------------------------------------------------------------ | --------------- | -------------------------------------------------- | ----------- |
| B-001      | W0    | Approved feature `SPEC.md` does not yet exist.               | domainspec-core | Execute TASK-DSAS-001.                             | TBD         |
| B-002      | W0    | Arcanum-to-DomainSpec ontology crosswalk does not yet exist. | domainspec-core | Execute TASK-DSAS-002 after `SPEC.md`.             | TBD         |
| B-003      | W1    | First runtime parity target is undecided.                    | domainspec-core | Decide Codex vs GitHub Copilot vs Claude after W0. | TBD         |

## Notes

- This work-pack intentionally blocks mutation-capable work.
- W0 should remain non-mutating and reviewable.
- Medium/high execution should target one SWU at a time.
- If subagents are used later, assign them by SWU with the write scopes above.

## Change Log

| Date       | Change                                                                            | Author |
| ---------- | --------------------------------------------------------------------------------- | ------ |
| 2026-05-20 | Initial architecture, layering, and work-pack created through invoke design/plan. | Codex  |
