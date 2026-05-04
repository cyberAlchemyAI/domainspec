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
version: 2.0.0
last_updated: 2026-03-09
node_type: constitution
is_session: false

---

# Constitution: Repository Folder Structure

To facilitate context building and folder navigation for agents, the project must strictly follow these rules.

---

## Objective

This document is the **enforceable folder structure rulebook**. It answers the question: *"Where does every file belong, how are layers separated, and what import rules govern cross-boundary communication?"*

It defines the three-layer architecture (infrastructure → domains → shared_services), the internal structure of each domain, dependency direction, and inter-domain communication protocols.

---

## Index

1. [Overview: Three-Layer Architecture](#overview-three-layer-architecture)
2. [Rule 1 — Screaming Architecture](#rule-1-the-repository-root-must-scream-the-business-screaming-architecture)
3. [Rule 2 — Layer Purity](#rule-2-the-domain-interior-follows-layer-purity)
4. [Rule 3 — Domain Ledger Isolation](#rule-3-absolute-isolation-of-the-financial-core-domain-ledger-isolation)
5. [Rule 4 — Dependency Injection](#rule-4-dependency-injection-and-the-composition-root)
6. [Rule 5 — Inter-Domain Communication](#rule-5-inter-domain-communication-protocols)
7. [Rule 6 — Acyclic Import Rule](#rule-6-dependency-direction-acyclic-import-rule)
8. [Visual Structures](#visual-structure-domain-folder-example-stock)
9. [Connections](#connections)

## Overview: Three-Layer Architecture

This project follows a **three-layer architecture** inspired by Onion Architecture (Palermo), Clean Architecture (Martin), and Domain-Driven Design (Evans):

1. **`/infrastructure`** — Shared pure abstractions and wrappers for external tools. **Imports from nobody.**
2. **`/domains`** (e.g., `domains/aquisicao`, `domains/liquidacao`, `domains/estoque`) — Business logic, models, and services per domain. Import **from infrastructure only**.
3. **`/shared_services`** — Cross-domain orchestration, shared business services, DI, and shared views. Imports **from domains and infrastructure**.

---

## Rule 1: The Repository Root Must "Scream" the Business (Screaming Architecture)

The top-level directory structure must map one-to-one to the fund's business domains — never reflect framework names or software patterns. In addition to domain folders, the project root also contains:

- `/domains`: root folder containing all business domains (`aquisicao`, `liquidacao`, `estoque`). Domains are grouped here, not directly at the project root.
- `/infrastructure`: global abstractions, HTTP clients, messaging, storage, and shared Django models. **No views, HTTP interfaces, or dependency injection.** Does not import from any domain or `/shared_services`.
- `/shared_services`: services and interfaces that orchestrate cross-domain operations. Contains the `/di` folder (Composition Root), shared HTTP interfaces, and cross-domain tests. The **only** folder where cross-domain imports are permitted.
- `/config`: `settings.py`, `urls.py`, `wsgi.py`, `celery_configs.py`.
- `/migrations`: model migration files.
- `/management/commands`: scripts executable via `manage.py`.

---

## Rule 2: The Domain Interior Follows "Layer Purity"

Inside each domain folder, organization must be strictly divided by technical responsibilities. Mandatory subdivisions:

- `/interfaces`: Entry point that normalizes all inputs (CNPJs, dates, timezone) before they reach the domain. Responsible for formatting and delivery to the client. Registers all domain endpoints.
- `/use_cases`: Flow orchestrators coordinating actions between interfaces, domain, and repositories without mutating global state on their own.
- `/repositories`: Translate storage schemas into Polars DataFrames. Contains `models.py`, `apps.py`, `repositories.py`, and `admin.py`. The `apps.py` attribute `name = 'domain.repositories'` serves as the "Django App".
- `/domain`: Definitions of all calculations and business rules for the domain. Calculations are in Polars or SQL, with no database access.
- `/tests`: Unit and end-to-end tests for all domain functions.
- `/aux`: Functions/Classes that don't fit into any of the folders above.
- `/tasks`: Celery tasks for async execution.
- `/docs`: Relevant domain documentation, including `constitution.md` with business rules.

---

## Rule 3: Absolute Isolation of the Financial Core (Domain Ledger Isolation)

The `/domain` folder within each domain contains business rules and calculations in Polars or SQL. Importing infrastructure libraries, Django views, serializers, or Celery tasks into this layer is **strictly prohibited**.

**Logical Separation Sub-rule** — within `/domain`, files must be organized as:
- `polar_models.py` — schemas (column contracts and types) for Polars DataFrames
- `calculations.py` and `sql_policies.py` — mathematical calculation engines, PDD rules, amortization
- `ports.py` — abstract interfaces for the data access layer

---

## Rule 4: Dependency Injection and the Composition Root

Use Cases act as flow orchestrators and do not depend on concrete implementations. DI ensures the correct instances are passed to Use Cases, keeping architectural boundaries intact.

- **Location**: The Composition Root lives exclusively in **`/shared_services/di`** — the only place in the system with cross-domain imports.
- **Structure**: Inside `/shared_services/di`, files are separated by domain assembly (e.g., `stock_factories.py`) or a single `containers.py` using the `dependency-injector` library.
- **Responsibility**: The factory instantiates the concrete Repository, injects it into the Use Case, and delivers the ready-configured instance to the Interface/View.

---

## Rule 5: Inter-Domain Communication Protocols

Direct cross-domain imports between domains are **strictly prohibited**. All communication must follow one of two protocols:

- **Synchronous (Contract Injection)**: Domain A's Use Case receives Domain B's Interface via DI and calls it when needed. The Use Case never knows Domain B's internal implementation.
- **Asynchronous (Event-Driven)**: For flows without real-time response, the origin domain dispatches an event via messaging abstraction. The destination domain consumes it via `/tasks` (Celery).

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

This guarantees a **Directed Acyclic Graph (DAG)** of dependencies with no circular imports. Violations must be flagged in code review and resolved before merge.

---

## Visual Structure: Domain Folder (example: `stock`)

```
domains/stock/
    /docs
        constitution.md              ← Domain business rules
    /domain
        polar_models.py              ← Polars schema contracts
        calculations.py              ← Polars rules
        sql_policies.py              ← SQL rules
        ports.py                     ← Domain class abstractions
    /repositories
        models.py                    ← Django tables (inherits models.Model)
        apps.py                      ← App registration for migrations
        repositories.py              ← Converts DB → polar_models
        admin.py                     ← Admin interface registration
    /interfaces
        api.py                       ← Internal requests
        views.py                     ← External HTTP requests
        urls.py                      ← Domain URL registration
    /use_cases
        stock_orchestrator.py        ← Coordinates Interface, Repository, Domain
    /tasks
        celery_tasks.py              ← Celery tasks calling Use Cases
    /tests
        unity_tests.py
        full_tests.py
    /aux
        utils.py                     ← Generic domain helpers
```

## Visual Structure: `/infrastructure`

```
/infrastructure
    /database
        models.py                    ← Shared cross-domain Django models
        base_models.py               ← Custom base classes
        connections.py               ← Connection pool
    /storage
        minio_client.py              ← MinIO/S3 upload/download
    /remessa
        upload_rules_base.py         ← Base CSV processing algorithm
        upload_service.py            ← Shared upload pipeline
        cancel_remessa_service.py
        delete_remessa_service.py
    /http_clients
        base_client.py               ← Wrapper with retries, timeouts, logs
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
        justify_filter_override.py   ← Cross-domain orchestrator
    /tests
        test_batch_views.py
```

---

## Document Taxonomy

| Field | Value |
|---|---|
| **type** | `constitution` |
| **domain** | `cross-domain` |
| **objective** | Define the folder structure rules and layer boundaries that all repository code must follow |
| **level** | `architectural` |
| **audience** | `engineer` `tech-lead` `ai-agent` `new-member` |
| **lifecycle_stage** | `active` |

### Version History

| Version | Date | Change |
|---|---|---|
| 2.0.0 | 2026-02-27 | Added shared_services layer, updated infrastructure structure |
| 1.0.0 | 2025-11-30 | Initial creation |

---

## Connections

| Document                            | Type             | Description                                                        |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------ |
| [[system-premises]]        | `derives-from`   | P4 (domains are hypotheses) applies directly to this structure     |
| [[fidc-and-credit-rights]] | `cites` | Code domains mirror business market domains                        |
| [folder-structure (skill)](../../../.claude/skills/custom/folder-structure.md) | `operationalizes` | Condensed skill for agent execution |
| [[development-practices-constitution]] | `cited-by` | Development practices constitution cites this folder-structure constitution as the directory-organization application of its principles. |
| [[event-system-constitution]] | `cited-by` | Event-system constitution cites this folder-structure constitution to locate event_log_service.py, event_catalog.py, and domain folders. |
