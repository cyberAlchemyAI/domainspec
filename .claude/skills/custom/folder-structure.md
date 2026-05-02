---
description: Condensed folder structure rules — where files belong and import direction
---

# Folder Structure Skill

## Three-Layer Architecture

```
/shared_services  →  /domains  →  /infrastructure
```

- `/infrastructure` — shared abstractions, no views, imports from **nobody**
- `/domains` — business logic per domain, imports only from `/infrastructure`
- `/shared_services` — cross-domain orchestration + DI, imports from both

**No layer may import from a layer above it. No circular imports.**

## Domain Internal Structure (mandatory)

```
domains/<name>/
  /interfaces    ← entry point, normalizes inputs, registers endpoints
  /use_cases     ← flow orchestrators, no direct DB access
  /repositories  ← ORM models, apps.py, translates DB → Polars
  /domain        ← pure business rules + calculations, NO IO
  /tasks         ← Celery async tasks
  /tests         ← unit + e2e tests
  /aux           ← helpers that don't fit above
  /docs          ← domain documentation
```

## Key Rules

- **Screaming architecture**: top-level dirs map to business domains, not frameworks
- **Domain purity**: the inner `/domain` subfolder (calculations, rules, ports) cannot import from infrastructure libraries, Django views, serializers, or Celery tasks. Pure Polars/SQL only, no database access. The outer `domains/<name>/` module imports from `/infrastructure`.
- **DI lives in `/shared_services/di`** — the only place with cross-domain imports
- **Inter-domain communication**: synchronous via contract injection (DI), async via events (Celery tasks)
- **Direct cross-domain imports are prohibited**

## Escalation — When to Load the Constitution

- If a file doesn't fit any layer or subfolder in the tables above → read §Rule 2 and §Rule 3 in `docs/vault/constitution/folder-structure-constitution.md`
- If wiring DI or creating a new composition root entry → read §Rule 4 (Dependency Injection)
- If choosing between sync (contract injection) vs async (event-driven) for inter-domain communication → read §Rule 5
- If creating a new domain from scratch → read the full constitution for visual structure examples
- If you need to amend or question a structural rule → read the full constitution + its `derives-from` premises
