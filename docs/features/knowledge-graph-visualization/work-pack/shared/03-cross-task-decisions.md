# Cross-Task Decisions

## Selected Decisions

| Decision ID | Scope      | Status   | Selected Option                                                                    | Source        | Date       |
| ----------- | ---------- | -------- | ---------------------------------------------------------------------------------- | ------------- | ---------- |
| D-KG-001    | cross-task | selected | Mirror-first model requires one card per required file: SPEC, domain, operations   | User request  | 2026-05-03 |
| D-KG-002    | cross-task | selected | Graph projection uses canonical concept IDs and canonical relationship labels only | User request  | 2026-05-03 |
| D-KG-003    | cross-task | selected | Concept click must support definition navigation and detail-card context           | User request  | 2026-05-03 |
| D-KG-004    | cross-task | selected | Server-deterministic graph layout engine                                           | Decision gate | 2026-05-03 |
| D-KG-005    | cross-task | selected | Open definition in app markdown viewer by default                                  | Decision gate | 2026-05-03 |
| D-KG-006    | cross-task | selected | Progressive reveal for optional aspect cards                                       | Decision gate | 2026-05-03 |

## Decision Application Rules

- KG-IMP-03 must implement server-deterministic layout and progressive reveal defaults.
- KG-IMP-02 must freeze the open-definition contract to in-app viewer default behavior.
- Record each selection in [DECISIONS.md](../../DECISIONS.md) and mirror it in this file.
