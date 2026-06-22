# Architecture Index: DomainSpec Implementation Model (Functional TypeScript)

> Purpose: canonical navigation index for architecture context. Load only the files needed for the current implementation slice.

## How To Use This Index

1. Identify the task type.
2. Open only the referenced file(s) for that task.
3. Avoid loading unrelated architecture artifacts.

## Retrieval Map

| If You Need                                          | Open This File                                |
| ---------------------------------------------------- | --------------------------------------------- |
| Principles and layer model baseline                  | `pattern-library/ARCHITECTURE-FOUNDATIONS.md` |
| Detailed layer responsibilities and folder blueprint | `pattern-library/LAYERING-REFERENCE.md`       |
| Dependency constraints and import-boundary checks    | `pattern-library/DEPENDENCY-RULES.md`         |
| SQL/PostgreSQL persistence and migration obligations | `pattern-library/SQL-PERSISTENCE.md`          |
| Backend concept implementation guidance              | `pattern-library/concepts/backend/`           |
| UI concept implementation guidance                   | `pattern-library/concepts/ui/`                |
| Relationship cards and context packs                 | `ARCHITECTURE-PATTERN-LIBRARY.md`             |
| Architecture-to-testing obligations                  | `pattern-library/TESTING-ALIGNMENT.md`        |
| Architecture-to-observability obligations            | `pattern-library/OBSERVABILITY-ALIGNMENT.md`  |

## Canonical Companions

- `../TAXONOMY.md` for concept types
- `../RELATIONSHIPS.md` for edge semantics
- `../TEST-PIPELINE.md` for full verification derivation
- `../OBSERVABILITY.md` for metric derivation rules

## Pattern Library Entrypoint

- `pattern-library/README.md`

## Maintenance Rule

Keep this file index-only. Do not add implementation snippets, layer playbooks, or recipe details here.
