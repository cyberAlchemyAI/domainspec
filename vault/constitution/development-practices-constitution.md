---
tags:
  - architecture
  - governance
layer: architecture
nature: procedural, technical
status: active
veracidade: high
convicção: high
audience: agent, engineer, tech-lead, new-member
version: 2.0.1
last_updated: 2026-05-19
node_type: constitution
is_session: false

---

# Development Practices Constitution

> This document is the primary reference for development principles and governance. It is **not an absolute truth** — it must be reviewed as the system evolves. Treat it as the best current agreement, subject to amendment via the process defined in Governance.

---

## Objective

This document is the **enforceable rulebook** for all development work. It answers the question: *"What principles must every engineer and agent follow when writing code, structuring logic, and making architectural decisions?"*

It defines core principles (domain purity, deterministic pipelines, use-case orchestration), architecture guardrails, AI agent autonomy boundaries, testing expectations, and the governance process for amendments.

---

## Index

1. [Core Principles](#core-principles)
2. [Architecture Guardrails](#architecture-guardrails)
3. [AI Agent Autonomy Rules](#ai-agent-autonomy-rules)
4. [Workflow & Testing Expectations](#workflow--testing-expectations)
5. [Governance](#governance)
6. [Connections](#connections)

---

## Core Principles

### Semantic Simplicity First

Code MUST remain readable through semantic naming, straightforward control flow, and the smallest abstraction set that solves the problem. Prefer copying a few clear lines over building indirection that obscures intent. Functional techniques are welcome for pure operations, procedural steps for orchestration; choose whichever keeps the code self-evident. Any abstraction must document the specific pain it removes.

### Pure Domain Slices

The domain layer is strictly split into Entities, Calculations, and Rules. These modules MUST stay framework-agnostic, avoid external packages, expose deterministic functions, and be the only location for unit tests. Domain code never reaches into IO, persistence, or controllers and MUST compile without infrastructure packages present.

### Deterministic Data Pipelines

All ingestion flows (CNAB, XML, XLSX, manual uploads, or partner APIs) MUST be deterministic and idempotent: reruns of the same payload replace prior rows instead of duplicating data, and checksum mismatches block ingestion. Each converter publishes its schema version, validation fences, and sample fixtures so finance auditors can reproduce any ledger. Determinism is non-negotiable because fund administrators depend on these ledgers for regulatory filings.

### Single Level of Abstraction (SLA) & Single Responsibility
Functions and methods MUST do exactly one thing and operate at a **single level of abstraction**. Never mix high-level orchestration (e.g., verifying a business rule, transitioning status) with low-level details (e.g., parsing JSON strings, handling `BytesIO` streams, or manually mapping PDF coordinates) in the same function. 
- **Modularity Over "God Functions":** Pipelines involving distinct steps (like File Upload, Text Extraction, and Domain Validation) must be severely isolated. Orchestrator functions must be built as a readable sequence of explicit step-calls (e.g., `step_upload()`, `step_extract()`) and pass only necessary context or DTOs between them. 
- **I/O and Logic Separation:** External interactions (APIs, filesystem) must be kept at the edges of the pipeline and never intertwined with core domain validations or conditional branching.

### Use-Case Orchestration

Every user-visible behavior is implemented as a use-case module that orchestrates domain calls and repository operations. Use cases encapsulate application rules, coordinate dependencies in a single place, and return domain primitives or DTOs without leaking transport details. Cross-use-case coupling is prohibited — compose via shared domain rules instead.

### Repository Isolation

Each repository method or query lives in its own file to keep side effects traceable. Repositories only translate between storage and domain data structures; they never embed business logic or reuse hidden shared state. Repository modules include docstrings describing source freshness, unique keys, and failure handling — making operational troubleshooting and data lineage audits straightforward.

### Validated Interfaces

Controllers must validate and normalize every incoming input (dates, CNPJ, currency precision) before invoking use cases. Every use case requires at least one integration test that drives the controller-to-repository path. Invalid inputs are rejected at the boundary, never inside domain code.

### Auditability via Event System

Every significant system action MUST emit an event to the Event Log. Dashboards, exports, and alerting endpoints must read from canonical tables populated by tested pipelines. Every outward-facing insight must be traceable back to the originating event: `event_id`, `stream_id`, rule version, and timestamp. If event emission fails and is not caught, the release is blocked until observability is restored.

> See `event-system-constitution.md` for the full Event System contract.

### Rule Catalog Fidelity

Classification rules constitute the contract between domain logic and analytics. Rule catalogs MUST live in dedicated domain files, expose deterministic predicates, declare their metadata (identifier, scope, dependencies), and ship with golden-set unit tests. No ad-hoc rule strings, dynamic eval, or controller-defined logic is permitted.

---

## Architecture Guardrails

- **Layer order (Clean + Screaming Architecture Mix)**: `use_cases → domain → infrastructure`. Flow is strictly one-directional; lower layers never import higher ones.
- **Infrastructure**: The foundational shared layer. It contains utilities, base repositories, and shared configurations used by everyone. It **NEVER** imports from `domain` or `use_cases`, and it **NEVER** contains views.
- **Domain**: The business modules (e.g., `domains/aquisicao`). This is where core business logic lives. It can import from `infrastructure`. It **CAN** have views.
- **Use Cases**: Shared services and cross-domain orchestration. They sit at the top, capable of importing from both `infrastructure` and `domain`. They **CAN** have views.
- Background jobs that mutate ledgers MUST be idempotent and tagged with a traceable batch ID so they can be replayed safely.
- Secrets, tokens, and fund-specific credentials stay in environment configuration and are never copied into source files or fixtures.

---

## AI Agent Autonomy Rules

> **Under discussion.** These rules define what agents may decide autonomously vs. what requires human approval.

### Agents MAY act autonomously when:
- Writing or modifying code covered by existing tests that continue to pass
- Adding new tests for existing functionality
- Implementing features fully described by an `active` or higher constitution/spec
- Refactoring within the same layer without changing contracts

### Agents MUST request human approval before:
- Changing database schema or creating migrations
- Modifying any `evergreen` or `consolidated` document
- Deploying to production or staging environments
- Introducing a new external dependency
- Making decisions where the primary reference document has `status: draft` or `veracidade: low`

### Agents MUST declare in every deliverable:
- Which documents were used as context and their confidence level (`status`, `veracidade`)
- Any assumption made where documentation was silent
- Any deviation from the constitution and the justification

---

## Workflow & Testing Expectations

- Feature plans enumerate which principle(s) they touch and document mitigations when a rule cannot be followed; unresolved violations block work.
- Specs describe user stories in terms of data lineage: origin source, transformation, persistence target, and surfaces impacted.
- Each use case includes: unit tests in the domain layer, integration tests through the controller/API, and if applicable contract tests for third-party services.
- Golden-set fixtures exist for every rule catalog and reconciliation formula; any change must update the fixture, tests, and spec.
- Plans, specs, and task templates remain synchronized with this constitution; reviewers reject deliverables if mandatory sections are missing.

---

## Governance

- This constitution is the primary reference. It is not absolute — it must be reviewed as the system evolves, especially when new architectural patterns (e.g., multi-tenancy, AI agents) are introduced.
- **Amendment process**: open a PR that updates this file and every affected template. Semantic versioning applies — MAJOR for removing/redefining principles, MINOR for adding principles or sections, PATCH for clarifications.
- **Ratification** requires at least one maintainer review plus confirmation that plan/spec/task templates reference any new rules.
- **Compliance reviews** happen during planning and code review: verify layer boundaries, event system usage, test coverage, and repository transparency before approval.

---

### Version History

| Version | Date | Change |
|---|---|---|
| 2.0.0 | 2026-03-09 | Merged from `constitution.md` + `constitution_developement_practices.md`. Added Agent Autonomy section. Added Event System coverage. Removed unverifiable performance baselines. Translated to English. |
| 1.0.0 | 2025-11-30 | Initial creation (as `constitution_developement_practices.md`) |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[folder-structure-constitution]] | `cites` | Folder structure constitution applies these principles to directory organization |
| [[system-premises]] | `derives-from` | P1, P3, P6 directly motivate these development practices |
| [robot-talks-constitution.md](./robot-talks-constitution.md) | `cited-by` | Robot-talks constitution cites these development practices as governance patterns (inverse of `cites` from robot-talks-constitution; added 2026-05-19 alongside that file's `informs`→`cites` rename). |
