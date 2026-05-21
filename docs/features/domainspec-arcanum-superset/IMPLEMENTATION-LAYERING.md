---
feature: domainspec-arcanum-superset
version: current
status: draft
updatedAt: 2026-05-20
docType: implementation-layering
owners:
  - domainspec-core
---

# DomainSpec Arcanum Superset Implementation Layering

This document defines the progressive implementation model for transforming DomainSpec into a superset of Arcanum.

Scope note: Layer 0 proves the concept with a non-mutating inventory and ontology crosswalk. Later layers add runtime compatibility, governance enforcement, observability, and distribution.

## Layering Method

- POC-first: prove that Arcanum capabilities can be represented as DomainSpec concepts and relationships.
- Progressive hardening: add runtime bridge behavior only after the semantic map is reviewable.
- Non-regression: existing Arcanum command and lifecycle behavior remains valid until an explicit deprecation path exists.
- Authority preservation: DomainSpec can orchestrate and govern, but lifecycle owners still own sigil, spell, and task mutation.

## Layer Boundary Heuristic

```text
After this layer, we know whether {decision unlocked}.
```

## Layer Decision Framing

| Layer    | Decision Question                                                                                   | Minimum Working Unit                                                                                             | Deferred Scope                                                         | Promotion Decision                                                    |
| -------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| L0 (POC) | After this, we know whether Arcanum's capability model can be faithfully represented in DomainSpec. | Static inventory and ontology crosswalk for sigils, spells, tiers, lifecycle routes, and observability concepts. | Runtime adapter changes, source mutation, UI, full registry migration. | Continue when the map covers core concepts and exposes concrete gaps. |
| L1       | After this, we know whether compatibility routing can run without breaking existing Arcanum usage.  | Read-only bridge that resolves existing Arcanum commands and emits DomainSpec-compatible metadata.               | Deprecated adapter removal, consumer rollout, strict blocking gates.   | Harden when parity checks pass on representative commands.            |
| L2       | After this, we know whether governance and observability hold under repeated capability runs.       | Deterministic validation for capability records, adapter inventory, signal crosswalk, and reflection routing.    | Full product packaging and multi-repo distribution.                    | Scale when gates are stable and false positives are acceptable.       |
| L3       | After this, we know whether the superset is distributable as the new canonical framework.           | Packaged DomainSpec capability domain with migration guide, generated registries, and compatibility policy.      | Future product UI and marketplace behavior.                            | Pilot or package when consumer install and validation evidence pass.  |

## Capability-to-Layer Progression

| Capability            | Layer 0 (POC proof)                                   | Layer 1 (first hardening)                                          | Layer 2+ (advanced hardening/scale)                   |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Capability ontology   | Candidate concepts and relationship map.              | Generated registry crosswalk.                                      | Canonical validation and promotion workflow.          |
| Arcanum compatibility | Source inventory only.                                | Command/runtime bridge metadata.                                   | Adapter parity checks and deprecation gates.          |
| Lifecycle routing     | Route map from Arcanum owners to DomainSpec concepts. | Invoke/Spellcraft/Sigil Development/Task Session handoff wrappers. | Blocking route validation and reflection integration. |
| Observability         | Telemetry source map.                                 | Dual emission or crosswalk report.                                 | Unified signal schema and reflection thresholds.      |
| Distribution          | No distribution.                                      | Local dev bridge.                                                  | Consumer install, migration docs, package validation. |

## Layer Definitions

| Layer    | Objective                           | Builds On | Primary Scope                                                      | Exit Evidence                                                              | Value/Cost Notes                                                |
| -------- | ----------------------------------- | --------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| L0 (POC) | Prove semantic fit.                 | none      | Docs-only inventory, ontology map, gap report.                     | `ARCHITECTURE.md`, candidate `SPEC.md`, generated/static inventory report. | High value because it prevents premature runtime consolidation. |
| L1       | Prove compatibility bridge.         | L0        | Command resolution metadata, adapter inventory, route wrappers.    | Passing parity checks for selected Arcanum commands.                       | Adds runtime value while keeping rollback simple.               |
| L2       | Prove governance and observability. | L1        | Validators, signal crosswalk, reflection routing, registry checks. | Passing governance checks and observed-run evidence.                       | Worth the cost once compatibility behavior is stable.           |
| L3       | Prove distribution and migration.   | L2        | Packaging, migration guide, generated docs, consumer harness.      | Pilot install report and validation run.                                   | Should wait until single-repo behavior is credible.             |

## Layer 0 - Minimum Working Unit POC

### Goal

Create a non-mutating proof that Arcanum's concepts, relationships, lifecycle owners, and runtime surfaces can be represented inside DomainSpec's taxonomy, relationships, registry, and governance model.

### Included Scope

- Feature architecture and work-pack.
- Candidate capability ontology map.
- Arcanum registry inventory snapshot.
- Lifecycle route map.
- Gap ledger for missing DomainSpec meta-types or relationships.

### Explicitly Deferred Beyond L0

- Editing Arcanum sigils or spells.
- Replacing runtime adapters.
- Generating consumer packages.
- UI/workbench changes.
- Strict CI enforcement.

### Exit Criteria

- All registry concepts in `arcanum/registry/SIGILS.md` and `arcanum/registry/SPELLS.md` have a candidate DomainSpec representation.
- Lifecycle owners are mapped without flattening Invoke, Spellcraft, Sigil Development, or Task Session.
- Relationship gaps are named with examples and candidate enforcement checks.
- A reviewer can identify which changes belong to DomainSpec, Arcanum compatibility, or deferred lifecycle owners.

### Promotion Decision

- Continue when: semantic coverage is clear, gaps are bounded, and no lifecycle owner conflict remains.
- Pivot when: core Arcanum concepts require DomainSpec meta-types that would distort the taxonomy.
- Stop when: the model cannot preserve Arcanum lifecycle authority or runtime compatibility.

## Layer-by-Layer Improvements

### Layer 1 Improvements Over L0

- Added scope: compatibility metadata and command-resolution bridge.
- Hardening delta: parity checks for selected existing Arcanum commands.
- Verification delta: adapter inventory and command resolution tests.

### Layer 2 Improvements Over Layer 1

- Added scope: deterministic validators, signal crosswalk, registry/gap enforcement.
- Hardening delta: governance gates can pass, flag, or block capability changes.
- Verification delta: governance validation scripts and observed-run reports.

### Layer 3 Improvements Over Layer 2

- Added scope: packaging, migration, generated docs, consumer pilot.
- Hardening delta: install and rollback paths become explicit.
- Verification delta: consumer repository harness and migration validation.

## Implementation Wave Backbone

| Wave | Target Layer | Goal                                      | Key Artifacts                                                                      | Verification                                  |
| ---- | ------------ | ----------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| W0   | L0           | Architecture and semantic proof.          | `ARCHITECTURE.md`, `IMPLEMENTATION-LAYERING.md`, `WORK-PACK.md`, future `SPEC.md`. | Review plus markdown link check.              |
| W1   | L1           | Compatibility bridge design and metadata. | Adapter inventory, route map, parity fixture plan.                                 | Command-resolution fixture checks.            |
| W2   | L2           | Governance and observability validators.  | Registry validator, signal crosswalk, reflection route map.                        | `pnpm`/script validation once implemented.    |
| W3   | L3           | Packaging and rollout.                    | Migration guide, generated registries, install docs.                               | Consumer install pilot and readiness verdict. |

## Source-of-Truth References

- `ARCHITECTURE.md`
- `WORK-PACK.md`
- `implementation/domainspec/README.md`
- `implementation/domainspec/TAXONOMY.md`
- `implementation/domainspec/RELATIONSHIPS.md`
- `implementation/domainspec/CONSTITUTION.md`
- `arcanum/README.md`
- `arcanum/registry/SIGILS.md`
- `arcanum/registry/SPELLS.md`
- `arcanum/spells/invoke/README.md`

## Open Decisions

- Whether the capability ontology should live as a DomainSpec feature pack only, or also become a root-level framework concept after validation.
- Whether Arcanum registry files remain canonical during migration or become generated compatibility views from DomainSpec.
- Which runtime adapter should be the first parity target: Codex, GitHub Copilot, or Claude.
