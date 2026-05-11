# Cross-Task Decisions

## Resolved Decision Gate

| Decision ID | Option Set                                                                                             | Selected Option | Rationale                                                                                          | Source                                   | Date       |
| ----------- | ------------------------------------------------------------------------------------------------------ | --------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------- |
| D-KG-012    | A) Poker-team exclusive source, B) Poker-team baseline only with multi-source registry                 | B               | Keeps projection strategy reusable across registered sources and avoids lock-in.                   | [../../DECISIONS.md](../../DECISIONS.md) | 2026-05-10 |
| D-KG-013    | A) Deterministic hierarchy `feature -> file -> concept`, B) dynamic hierarchy by runtime score         | A               | Guarantees repeatable layout input and stable verification evidence.                               | [../../DECISIONS.md](../../DECISIONS.md) | 2026-05-10 |
| D-KG-014    | A) Prototype-first planning anchor with docs normative, B) docs-only planning without prototype anchor | A               | Preserves practical interaction mapping while keeping contracts sourced from retained aspect docs. | [../../DECISIONS.md](../../DECISIONS.md) | 2026-05-10 |

## Additional Locked Inputs

| Decision ID | Scope      | Locked Statement                                                                                                |
| ----------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| D-KG-004    | cross-task | Layout determinism remains server-deterministic baseline for reproducibility.                                   |
| D-KG-009    | cross-task | `(projectKey, featureId)` scope invariants remain strict across rebuild/read/select/open-definition operations. |

## Decision Guardrails for This Work-Pack

1. Do not introduce source-strategy wording that implies poker-team exclusivity.
2. Keep deterministic hierarchy contract explicit in every algorithm task.
3. Keep prototype references as planning anchors only; behavior authority remains in retained aspect docs.

## Blocker Check

No unresolved blocker-level architectural decision remains.

# Cross-Task Decisions

## Selected Decisions

| Decision ID | Scope      | Status   | Selected Option                                                                                                                         | Source             | Date       |
| ----------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| D-KG-001    | cross-task | selected | Mirror-first model requires one card per required file: SPEC, domain, operations                                                        | User request       | 2026-05-03 |
| D-KG-002    | cross-task | selected | Graph projection uses canonical concept IDs and canonical relationship labels only                                                      | User request       | 2026-05-03 |
| D-KG-003    | cross-task | selected | Concept click must support definition navigation and detail-card context                                                                | User request       | 2026-05-03 |
| D-KG-004    | cross-task | selected | Server-deterministic graph layout engine                                                                                                | Decision gate      | 2026-05-03 |
| D-KG-005    | cross-task | selected | Open definition in app markdown viewer by default                                                                                       | Decision gate      | 2026-05-03 |
| D-KG-006    | cross-task | selected | Progressive reveal for optional aspect cards                                                                                            | Decision gate      | 2026-05-03 |
| D-KG-011    | cross-task | selected | Poker-team is baseline evidence only; source strategy MUST remain non-exclusive and include domainspec-core feature corpus validation   | User clarification | 2026-05-10 |
| D-KG-012    | cross-task | selected | Registry-backed full-index ingestion and deterministic hierarchy (`feature -> file -> concept`) with concept enrichment where available | Decision gate      | 2026-05-10 |

## Decision Application Rules

- KG-IMP-03 must implement server-deterministic layout and progressive reveal defaults.
- KG-IMP-02 must freeze the open-definition contract to in-app viewer default behavior.
- KG-IMP-11 must enforce non-exclusive source registry strategy and baseline-vs-validation source evidence rules.
- KG-IMP-11 must lock deterministic hierarchy and concept enrichment directives for all source classes.
- Record each selection in [DECISIONS.md](../../DECISIONS.md) and mirror it in this file.
