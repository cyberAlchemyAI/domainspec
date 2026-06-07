# DomainSpec Authority Map

## Purpose

This document identifies the canonical source for each major piece of the DomainSpec system.

Use it when you need to answer one of these questions:

- where is this concept defined?
- which document wins if two documents describe the same thing differently?
- is this subsystem canonicalized as one file or as a multi-file pack?

## Authority Rules

1. Research definitions are normative for formal DomainSpec semantics.
2. Implementation root documents are authoritative for framework behavior and operational interpretation.
3. `plan/` documents are authoritative for the current implementation program and productization path.
4. Feature behavior is canonicalized as a feature pack, not a single file.
5. Pitches, overviews, and papers summarize; they do not override the authoritative source for semantics or behavior.

When two artifacts differ, use the more authoritative artifact from the list below.

## System Authority Table

| System piece                                  | Canonical source                                                                                                                                                                                                             | Authority form  | Notes                                                                                                   |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| Formal DomainSpec semantics                   | `research/projects/domainspec/definitions/DEFINITIONS.md`                                                                                                                                                                    | single file     | Normative DS-\* definition source.                                                                      |
| Definition lookup/index                       | `research/projects/domainspec/definitions/DEFINITIONS-INDEX.md`                                                                                                                                                              | single file     | Discovery and traceability support, not normative semantics.                                            |
| Meta-type vocabulary                          | `TAXONOMY.md`                                                                                                                                                                                                                | single file     | Canonical concept-type inventory for implementation use.                                                |
| Relationship vocabulary                       | `RELATIONSHIPS.md`                                                                                                                                                                                                           | single file     | Canonical edge vocabulary and relationship signatures.                                                  |
| Reflection tower / promotion functor   | `vault/conceptual/reflection-tower-in-domainspec.md` | single file     | Canonical stocktake of the promotion-with-anchoring discipline and the promotion functor `P : L_n ⥤ L_{n+1}` (faithful, reflects-iso, introduces no new lower-level morphisms; not essentially surjective). Read-side map of where the tower lives in this vault and in the sibling Lean repo `domainspec-theorem/lean-formalization/ReflectionTowerAnchored.lean`. |
| Layered framework architecture                | `ARCHITECTURE.md`                                                                                                                                                                                                            | single file     | Canonical architecture surface for layered behavior.                                                    |
| Governance principles                         | `AXIOMS.md`                                                                                                                                                                                                                  | single file     | Highest-level governance logic.                                                                         |
| Governance execution contract                 | `CONSTITUTION.md`                                                                                                                                                                                                            | single file     | Executable rule and governance contract surface.                                                        |
| Build-time derivation                         | `TEST-PIPELINE.md`                                                                                                                                                                                                           | single file     | Canonical source for derived test obligations.                                                          |
| Production metric derivation                  | `OBSERVABILITY.md`                                                                                                                                                                                                           | single file     | Canonical source for derived observability obligations.                                                 |
| Drift and convergence                         | `DRIFT-CONVERGENCE.md`                                                                                                                                                                                                       | single file     | Canonical operational interpretation of drift, convergence, and how related docs fit together.          |
| Governance and meta-health signal schema      | `implementation/GOVERNANCE-SIGNALS.md`                                                                                                                                                                                       | single file     | Canonical signal model for governance loops and meta-health metrics.                                    |
| Async framework tuning                        | `TUNING-LOOP.md`                                                                                                                                                                                                             | single file     | Canonical cross-run framework learning loop.                                                            |
| ADLC gap closure and implementation alignment | `ADLC-ALIGNMENT.md`                                                                                                                                                                                                          | single file     | Canonical surface for implementation gap closure and alignment evidence.                                |
| Saturn control loop                           | `plan/SATURN-L-SYSTEM.md`                                                                                                                                                                                                    | single file     | Canonical implementation-program definition of the operational control loop.                            |
| Implementation north star                     | `plan/VISION.md`                                                                                                                                                                                                             | single file     | Canonical current implementation vision and layer model.                                                |
| Implementation program entrypoint             | `plan/index.md`                                                                                                                                                                                                              | single file     | Canonical execution entrypoint for the current plan.                                                    |
| Task-to-contribution traceability             | `plan/TRACEABILITY.md`                                                                                                                                                                                                       | single file     | Canonical mapping from tasks to problems, contributions, and ADLC links.                                |
| Unified product narrative                     | `plan/DOMAINSPEC-UNIFIED-PRODUCT-VISION.md`                                                                                                                                                                                  | single file     | Canonical product narrative for the current implementation program, not normative semantics.            |
| Layer product views                           | `plan/context/CONTEXT-PRODUCT-OVERVIEW.md`, `plan/infra/INFRA-PRODUCT-OVERVIEW.md`, `plan/agentic/AGENTIC-PRODUCT-OVERVIEW.md`, `plan/governance/GOVERNANCE-PRODUCT-OVERVIEW.md`, `plan/harness/HARNESS-PRODUCT-OVERVIEW.md` | multi-file pack | Each layer has its own canonical overview.                                                              |
| Feature behavior                              | `docs/features/<feature>/SPEC.md` plus aspect docs (`domain.md`, `operations.md`, `states.md`, `interfaces.md`, `events.md`, `queries.md`, `workflows.md`, `mappings.md`)                                                    | multi-file pack | Feature behavior is intentionally canonicalized as a pack.                                              |
| Shared concept registry                       | `docs/registry.md`                                                                                                                                                                                                           | single file     | Canonical registry for cross-feature concept lookup.                                                    |
| Shared glossary                               | `docs/glossary.md`                                                                                                                                                                                                           | single file     | Canonical terminology lookup for implementation docs.                                                   |
| Reusable Copilot pack                         | `copilot/README.md` plus `copilot/agents/` and `copilot/skills/`                                                                                                                                                             | multi-file pack | Packaged reusable agent and skill source.                                                               |
| Workspace-local Copilot overlays              | `.github/agents/` and `.github/skills/`                                                                                                                                                                                      | multi-file pack | Local overlay layer for this repository; does not supersede packaged framework semantics automatically. |

## Important Non-Authority Artifacts

These are useful, but they are not the final source of truth for framework semantics:

- `README.md`: framework onboarding and narrative entrypoint
- `plan/DOMAINSPEC-PITCH-SCRIPTS.md`: presentation artifact
- research papers: synthesis and discussion artifact
- changelogs: history, not authoritative semantics

## Quick Usage Rules

- If you need the exact meaning of a DomainSpec term, start with `research/projects/domainspec/definitions/DEFINITIONS.md`.
- If you need implementation behavior, use the root implementation docs in this folder.
- If you need the current productization or execution plan, use `plan/`.
- If you need feature truth, read the whole feature pack rather than only `SPEC.md`.

## One-Sentence Summary

DomainSpec has one authority map: research definitions govern formal semantics, implementation root docs govern framework behavior, plan docs govern the current implementation program, and feature packs govern per-feature truth.
