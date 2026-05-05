---
tags:
  - system
  - architecture
layer: architecture
nature: technical
status: consolidated
audience: agent, engineer
version: 0.1.0
last_updated: 2026-03-09
node_type: axiom
is_session: false

---

# System Axioms

> Foundational commitments that back the architecture. We take these as given. Revising one requires rethinking everything built on top of it.

---

## Objective

This document defines the **non-negotiable technical commitments** of the platform. It answers the question: *"What architectural truths do we take as given, and what collapses if we revise them?"*

These axioms justify deterministic pipelines, domain isolation, history immutability, and strict observability. Every constitution and system premise derives from one or more of these.

---

## Index

1. [AX-SYS-1 — Deterministic Pipelines](#ax-sys-1--deterministic-pipelines-are-non-negotiable)
2. [AX-SYS-2 — Testable Code = Auditable Code](#ax-sys-2--code-that-cannot-be-tested-in-isolation-cannot-be-audited)
3. [AX-SYS-3 — Folder Structure as Business Hypothesis](#ax-sys-3--the-folder-structure-is-a-hypothesis-about-the-business)
4. [AX-SYS-4 — History is Immutable](#ax-sys-4--history-is-immutable)
5. [AX-SYS-5 — Observability Ambiguity is Failure](#ax-sys-5--ambiguity-in-observability-is-a-system-failure)
6. [Connections](#connections)

---

## AX-SYS-1 — Deterministic pipelines are non-negotiable

Same input must always produce the same output. A fund that cannot replay its own ledger from source data cannot be audited. There is no acceptable version of non-determinism in financial data pipelines — not for performance, not for convenience.

This axiom justifies: idempotent ingestion, checksum validation, immutable event logs, and the prohibition of random or time-dependent logic in the domain layer.

---

## AX-SYS-2 — Code that cannot be tested in isolation cannot be audited

The domain layer must be pure — not because purity is elegant, but because it is the only layer an auditor (human or agent) can verify without running the entire system. A business rule embedded in infrastructure is a rule that cannot be independently confirmed.

This axiom justifies: the prohibition of IO in the domain layer, the port/adapter pattern, and the requirement that domain modules have no external dependencies.

---

## AX-SYS-3 — The folder structure is a hypothesis about the business

The codebase structure is not a neutral convention — it is a statement about how the business is conceptually divided. A structure that does not reflect business reality generates friction every time someone decides where something belongs. When the business model changes, the structure must change too.

This axiom justifies: the screaming architecture principle, the domain-per-business-area rule, and the requirement that new domains be a business decision, not an engineering convenience.

---

## AX-SYS-4 — History is Immutable

What happened, happened. A system that can rewrite its own history cannot be trusted by auditors, investors, or agents. The event log is an append-only ledger of facts; correcting a mistake means logging the correction, never erasing the error. The database must reflect the reality of the timeline exactly as it unfolded.

---

## AX-SYS-5 — Ambiguity in Observability is a System Failure

If an action occurs and the system cannot interpret *what* it means, *who* did it, or *which* entity it affected, the observability has failed. Free-text logs are insufficient for automated systems. Agents and analytics cannot reliably parse strings. Events must adhere to strict, typed ontologies.

This axiom justifies: the central Event Catalog contract, strict validation of `event_type` and `payload_schema`, the mandatory distinction between `HUMAN` and `SYSTEM` actors, and strongly typed `entity_type` classifications.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[system-premises]] | `derives-from` | System premises sit on top of these axioms — expressed as `derives-from` on that document |
| [[development-practices-constitution]] | `derives-from` | AX-SYS-1 and AX-SYS-2 justify deterministic pipelines and domain isolation — expressed as `derives-from` on that document |
| [[event-system-constitution]] | `derives-from` | AX-SYS-4 and AX-SYS-5 enforce immutability and observability — expressed as `derives-from` on that document |
| [[ontology-axioms]] | `cited-by` | Ontology axioms cite system axioms as the architecture-layer equivalent of these ontology-layer commitments. |
| [[domainspec-axioms]] | `cited-by` | DomainSpec axioms cite system axioms as the architecture-layer foundation: AX-DS-1 leans on AX-SYS-1 and AX-SYS-2; AX-DS-3 leans on AX-SYS-2; AX-DS-4 leans on AX-SYS-4. |
