---
tags:
  - architecture
  - folder-structure
layer: architecture
nature: procedural, technical
status: consolidated
veracidade: high
convicção: high
audience: agent, engineer
version: 3.0.0
last_updated: 2026-05-26
node_type: constitution
is_session: false

---

# Constitution: Repository Folder Structure

To facilitate context building and folder navigation for agents, any project adopting the domainspec convention must strictly follow these rules, regardless of business domain or framework choice.

---

## Objective

This document is the **enforceable, framework-generic folder structure rulebook**. It answers the question: *"Where does every file belong, how are layers separated, and what import rules govern cross-boundary communication?"*

It defines the three-layer architecture (infrastructure → domains → shared_services), the internal structure of each domain, dependency direction, and inter-domain communication protocols. Concrete library and framework choices belong in per-app sub-constitutions (see **Sub-Constitution Slot** below), not here.

---

## Index

1. [Overview: Three-Layer Architecture](#overview-three-layer-architecture)
2. [Rule 1 — Screaming Architecture](#rule-1-the-repository-root-must-scream-the-business-screaming-architecture)
3. [Rule 2 — Layer Purity](#rule-2-the-domain-interior-follows-layer-purity)
4. [Rule 3 — Domain Layer Purity](#rule-3-domain-layer-purity)
5. [Rule 4 — Dependency Injection](#rule-4-dependency-injection-and-the-composition-root)
6. [Rule 5 — Inter-Domain Communication](#rule-5-inter-domain-communication-protocols)
7. [Rule 6 — Acyclic Import Rule](#rule-6-dependency-direction-acyclic-import-rule)
8. [Sub-Constitution Slot](#sub-constitution-slot)
9. [Visual Structures](#visual-structure-domain-folder-generic-example)
10. [Connections](#connections)

## Overview: Three-Layer Architecture

This convention follows a **three-layer architecture** inspired by Onion Architecture (Palermo), Clean Architecture (Martin), and Domain-Driven Design (Evans):

1. **`/infrastructure`** — Shared pure abstractions and wrappers for external tools (databases, object storage, messaging, HTTP clients). **Imports from nobody.**
2. **`/domains`** — Business logic, models, and services per domain (e.g., `domains/<domain-a>`, `domains/<domain-b>`). Imports **from infrastructure only**.
3. **`/shared_services`** — Cross-domain orchestration, shared business services, DI Composition Root, and shared views. Imports **from domains and infrastructure**.

---

## Rule 1: The Repository Root Must "Scream" the Business (Screaming Architecture)

The top-level directory structure must map one-to-one to the project's business domains — never reflect framework names or software patterns. In addition to domain folders, the project root also contains:

- `/domains`: root folder containing all business domains (illustrative examples: `orders`, `inventory`, `billing`). Domains are grouped here, not directly at the project root.
- `/infrastructure`: global abstractions, HTTP clients, messaging, object storage, and shared persistence models. **No views, HTTP interfaces, or dependency injection.** Does not import from any domain or `/shared_services`.
- `/shared_services`: services and interfaces that orchestrate cross-domain operations. Contains the `/di` folder (Composition Root), shared HTTP interfaces, and cross-domain tests. The **only** folder where cross-domain imports are permitted.
- `/config`: project configuration (settings, URL routing, app entrypoints, async-runner configuration). Concrete filenames depend on the chosen framework.
- `/migrations`: persistence schema migration files (when applicable to the chosen ORM / data layer).
- `/management` or equivalent: scripts and CLI entrypoints (e.g., Django `manage.py` commands, Typer/Click CLIs, Make targets).

---

## Rule 2: The Domain Interior Follows "Layer Purity"

Inside each domain folder, organization must be strictly divided by technical responsibilities. The following subdivisions are **mandatory** (their names are fixed by this constitution; their internal contents may be tooling-specific per the app's ARCHITECTURE.md):

- `/interfaces`: Entry point that normalizes all inputs (identifiers, dates, timezones, units) before they reach the domain. Responsible for formatting and delivery to the client. Registers all domain endpoints.
- `/use_cases`: Flow orchestrators coordinating actions between interfaces, domain, and repositories without mutating global state on their own.
- `/repositories`: Translate storage schemas into the domain's in-memory record shape (DataFrame, dataclass, pydantic model — whichever the per-app ARCHITECTURE.md mandates). Typically contains data models, framework app registration (when applicable), repository classes, and admin interface registration (when applicable).
- `/domain`: Definitions of all calculations and business rules for the domain. Pure logic only — no I/O, no database access, no framework imports.
- `/tests`: Unit and end-to-end tests for all domain functions.
- `/aux`: Functions/Classes that don't fit into any of the folders above.
- `/tasks`: Asynchronous task definitions (Celery, arq, RQ, asyncio runners — chosen by the per-app ARCHITECTURE.md).
- `/docs`: Relevant domain documentation, including `constitution.md` with business rules.

---

## Rule 3: Domain Layer Purity

The `/domain` folder within each domain contains business rules and calculations expressed in whatever calculation library the per-app ARCHITECTURE.md selects (Polars, pandas, native SQL, pydantic-only, dataclasses, etc.). Importing infrastructure libraries, framework views/serializers, persistence sessions, or async-task definitions into this layer is **strictly prohibited**.

**Logical Separation Sub-rule** — within `/domain`, files must be organized by role. Suggested role names (concrete filenames are specified by the per-app ARCHITECTURE.md):

- `models.py` — schemas (column contracts and types) for the in-memory record shape. (Illustrative concrete filenames: `polar_models.py` when Polars is used; `pydantic_models.py` for pydantic; `dataclasses.py` for native dataclasses.)
- `calculations.py` and/or `sql_policies.py` — mathematical calculation engines and pure business rules.
- `ports.py` — abstract interfaces for the data access layer (so `/domain` depends on contracts, never on concrete repositories).

---

## Rule 4: Dependency Injection and the Composition Root

Use Cases act as flow orchestrators and must not depend on concrete implementations. DI ensures the correct instances are passed to Use Cases, keeping architectural boundaries intact.

- **Location**: The Composition Root lives exclusively in **`/shared_services/di`** — the only place in the system with cross-domain imports.
- **Structure**: Inside `/shared_services/di`, files are separated by domain assembly (e.g., `<domain>_factories.py`) or a single `containers.py`. The concrete DI library (a DI container library suitable for the chosen framework — e.g., `dependency-injector`, `punq`, `wireup`, hand-rolled factories) is selected by the per-app ARCHITECTURE.md.
- **Responsibility**: The factory instantiates the concrete Repository, injects it into the Use Case, and delivers the ready-configured instance to the Interface/View.

---

## Rule 5: Inter-Domain Communication Protocols

Direct cross-domain imports between domains are **strictly prohibited**. All communication must follow one of two protocols:

- **Synchronous (Contract Injection)**: Domain A's Use Case receives Domain B's Interface via DI and calls it when needed. The Use Case never knows Domain B's internal implementation.
- **Asynchronous (Event-Driven)**: For flows without real-time response, the origin domain dispatches an event via the messaging abstraction. The destination domain consumes it via `/tasks` (using the async-runner chosen by the per-app ARCHITECTURE.md).

---

## Rule 6: Dependency Direction (Acyclic Import Rule)

Import flow must strictly follow this order:

```
/shared_services  →  /domains  →  /infrastructure
```

**No layer may import from a layer above it:**
- `/infrastructure` imports from **nobody**
- `/domains` import only from `/infrastructure`
- `/shared_services` imports from `/domains` and `/infrastructure`

This guarantees a **Directed Acyclic Graph (DAG)** of dependencies with no circular imports. Violations must be flagged in code review and resolved before merge. Per-app ARCHITECTURE.md may add mechanical enforcement (e.g., `import-linter` contracts, mypy plugins, custom CI checks).

---

## Sub-Constitution Slot

Project-specific concretizations live in **per-app sub-constitutions**, not in this document. Each `apps/<app>/ARCHITECTURE.md` (or, for single-app projects, the repo root `ARCHITECTURE.md`) may amend or specialize these rules — for example by:

- Naming the concrete web framework (Django, FastAPI, Litestar, Flask, or none).
- Naming the concrete data-access library (Django ORM, SQLAlchemy + alembic, Drizzle, Prisma, raw drivers).
- Naming the concrete calculation library inside `/domain` (Polars, pandas, native SQL, pydantic-only, dataclasses).
- Naming the async task runner (Celery, arq, asyncio runner, RQ).
- Naming the DI container library.
- Naming the object storage backend (MinIO, S3, GCS, local filesystem).
- Adding domain-purity enforcement mechanisms (import-linter contracts, mypy plugins, custom CI checks).

Any sub-constitution amendment must explicitly cite the rule it specializes from this constitution. Sub-constitutions **cannot weaken** the rules; they may only narrow them or add to them. See `[[discovery-structure-constitution]]` for how documentation about these decisions is recorded and `[[domainspec-implementation-axioms]]` (AX-DS-4) for the decision-gate requirement.

---

## Visual Structure: Domain Folder (generic example)

The example below uses `<domain>` as a placeholder folder name. Filenames and library hints are **illustrative only**; concrete choices belong in the per-app ARCHITECTURE.md.

```
domains/<domain>/
    /docs
        constitution.md              ← Domain business rules
    /domain
        models.py                    ← In-memory record schema (e.g., polar_models.py, pydantic_models.py)
        calculations.py              ← Pure calculation rules
        sql_policies.py              ← SQL rules (when applicable)
        ports.py                     ← Abstract interfaces for data access
    /repositories
        models.py                    ← Persistence models (e.g., Django models, SQLAlchemy mappings)
        apps.py                      ← Framework app registration (when applicable; e.g., Django apps.py)
        repositories.py              ← Converts storage rows → domain record shape
        admin.py                     ← Admin interface registration (when applicable; e.g., Django admin.py)
    /interfaces
        api.py                       ← Internal requests
        views.py                     ← External HTTP requests
        urls.py                      ← Domain route registration
    /use_cases
        <domain>_orchestrator.py     ← Coordinates Interface, Repository, Domain
    /tasks
        async_tasks.py               ← Async tasks (Celery / arq / RQ / asyncio runner) calling Use Cases
    /tests
        unit_tests.py
        full_tests.py
    /aux
        utils.py                     ← Generic domain helpers
```

## Visual Structure: `/infrastructure`

Filenames are illustrative. Add/remove components as the project requires.

```
/infrastructure
    /database
        models.py                    ← Shared cross-domain persistence models
        base_models.py               ← Custom base classes
        connections.py               ← Connection pool / engine
    /storage
        object_store_client.py       ← Object storage wrapper (e.g., MinIO, S3, GCS)
    /http_clients
        base_client.py               ← HTTP wrapper with retries, timeouts, logs
    /messaging
        publisher.py                 ← Event dispatching
        event_bus.py                 ← Central event router
```

## Visual Structure: `/shared_services`

```
/shared_services
    /di
        containers.py                ← DI container connecting all domains
    /interfaces
        batch_views.py
        upload_views.py
        download_views.py
        urls.py
    /use_cases
        cross_domain_orchestrator.py ← Example cross-domain orchestrator
    /tests
        test_batch_views.py
```

---

## Document Taxonomy

| Field | Value |
|---|---|
| **type** | `constitution` |
| **domain** | `cross-domain` |
| **objective** | Define the framework-generic folder structure rules and layer boundaries that any domainspec-conforming repository must follow |
| **level** | `architectural` |
| **audience** | `engineer` `tech-lead` `ai-agent` `new-member` |
| **lifecycle_stage** | `active` |

### Version History

| Version | Date | Change |
|---|---|---|
| 3.0.0 | 2026-05-26 | Abstracted to framework-generic. Removed financial/FIDC and Django/Polars/Celery hard mandates; introduced Sub-Constitution Slot for per-app specialization. Rule 3 renamed "Domain Layer Purity" from "Absolute Isolation of the Financial Core". Visual Structures genericized. |
| 2.0.0 | 2026-02-27 | Added shared_services layer, updated infrastructure structure |
| 1.0.0 | 2025-11-30 | Initial creation |

---

## Connections

| Document                            | Type             | Description                                                        |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------ |
| [[system-premises]]                 | `derives-from`   | P4 (domains are hypotheses) applies directly to this structure     |
| [[discovery-structure-constitution]] | `references`    | Cross-cutting governance sibling; records how per-app architectural decisions are documented |
| [[domainspec-implementation-axioms]] | `references`    | AX-DS-2 and AX-DS-4 govern adherence to this constitution and the decision-gate for sub-constitution amendments |
| [folder-structure (skill)](../../../.claude/skills/custom/folder-structure.md) | `operationalizes` | Condensed skill for agent execution |
| [[development-practices-constitution]] | `cited-by`    | Development practices constitution cites this folder-structure constitution as the directory-organization application of its principles. |
| [[event-system-constitution]]       | `cited-by`       | Event-system constitution cites this folder-structure constitution to locate event log services, event catalog, and domain folders. |
| `vault/foundational-knowledges.md`  | `cited-by`       | The foundational-knowledges L5 software-architecture layer cites this constitution as the load-bearing expression of folder-structure-as-architecture (physical layout encoding intent). |
