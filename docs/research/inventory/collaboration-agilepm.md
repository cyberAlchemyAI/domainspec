# Collaboration Agilepm — Domain Model Inventory

**Source:** BOOK-Vernon-IDDD + GH-IDDD-Samples
**Category:** B+A (DDD Literature + Reference Implementation)
**Reference:** Vernon, V. (2013) _Implementing Domain-Driven Design_ Part 2; https://github.com/VaughnVernon/IDDD_Samples
**Extracted:** 2026-04-20
**Confidence:** high
**Used in experiments:** E6 (D2), E9 run-2 rerun (CD2)

> Vernon's IDDD examples demonstrate multi-tenant SaaS architecture with explicit context mapping. Three bounded contexts with cross-context authorization, event-driven synchronization, and tenant-scoped operations. The IDDD_Samples GitHub repo provides Java implementations.

---

## Bounded Contexts

| # | Context | Description | Aggregate Roots | Key Events | Persistence |
|---|---------|-------------|-----------------|------------|-------------|
| 1 | **Identity & Access** | Manages users, roles, tenants, and access control. Central identity provider for all contexts. | Tenant, User, Role | UserRegistered, UserActivated, TenantProvisioned | Hibernate/REST |
| 2 | **Collaboration** | Forums, discussions, and team communication. Event-sourced with CQRS. | Forum, Discussion, Post | DiscussionStarted, PostPublished | Event Sourcing + CQRS |
| 3 | **Agile PM** | Sprint planning, backlog management, team velocity tracking. | Sprint, BacklogItem, Team | SprintCompleted, BacklogItemCompleted | LevelDB |

## Concept Inventory

| Concept | Meta-Type | Primary BC | Source Reference |
|---------|-----------|-----------|-----------------|
| BacklogItem | Entity | Collaboration | Vernon IDDD; IDDD_Samples discussion→backlog traceability |
| Discussion | Entity | Agile PM | Vernon IDDD; backlog item→discussion bidirectional link |
| Tenant | Entity | Identity & Access | Vernon IDDD Ch.4; multi-tenant SaaS scoping |
| User | Entity | Collaboration | Vernon IDDD Ch.2; IDDD_Samples iddd_collaboration references iddd_identityaccess |
| BacklogItemCompleted | Event | Agile PM | Vernon IDDD; work completion notification across contexts |
| DiscussionStarted | Event | Collaboration | Vernon IDDD Ch.13; discussion→backlog feedback loop |
| SprintCompleted | Event | Agile PM | Vernon IDDD; sprint→collaboration notification |
| UserActivated | Event | Identity & Access | Vernon IDDD; user lifecycle events across contexts |
| UserRegistered | Event | Identity & Access | Vernon IDDD Ch.8; IDDD_Samples event-driven provisioning |
| AuthorizationRule | Rule | Identity & Access | Vernon IDDD Ch.15; IDDD_Samples access control across contexts |
| TenantProvisioningSaga | Saga | Identity | Vernon IDDD; multi-context tenant provisioning with compensation |
| MemberProfile | Value Object | Identity & Access | Vernon IDDD; user profile projection across contexts |
| SprintReport | Value Object | Agile PM | Vernon IDDD; sprint data shared with collaboration context |

## Cross-Context Edges

| # | Edge ID | Source BC | Target BC | Concept | Type | Edge Type | Pattern | Orig Status |
|---|---------|----------|-----------|---------|------|-----------|---------|-------------|
| 1 | CD2-E01 | Collaboration | Identity & Access | User | Entity | references | P2-entity-reference | works |
| 2 | CD2-E02 | Agile PM | Identity & Access | User | Entity | references | P2-entity-reference | works |
| 3 | CD2-E03 | Identity & Access | Collaboration | AuthorizationRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 4 | CD2-E04 | Identity & Access | Agile PM | AuthorizationRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 5 | CD2-E05 | Identity & Access | Collaboration+Agile PM | Tenant | Entity | references | P6-shared-context | works |
| 6 | CD2-E06 | Identity & Access | Collaboration | UserRegistered | Event | triggers-cross | P3-event-trigger | broken |
| 7 | CD2-E07 | Identity & Access | Agile PM | UserActivated | Event | triggers-cross | P3-event-trigger | broken |
| 8 | CD2-E08 | Collaboration | Agile PM | DiscussionStarted | Event | triggers-cross | P3-event-trigger | broken |
| 9 | CD2-E09 | Agile PM | Collaboration | SprintCompleted | Event | triggers-cross | P3-event-trigger | broken |
| 10 | CD2-E10 | Identity+Collaboration+Agile PM | Identity+Collaboration+Agile PM | TenantProvisioningSaga | Saga | orchestrates | P4-saga | broken |
| 11 | CD2-E11 | Collaboration | Agile PM | BacklogItem | Entity | references | P2-entity-reference | works |
| 12 | CD2-E12 | Agile PM | Collaboration | Discussion | Entity | references | P2-entity-reference | works |
| 13 | CD2-E13 | Agile PM | Collaboration | SprintReport | Value Object | produces-for | P1-data-handoff | strained |
| 14 | CD2-E14 | Identity & Access | Collaboration | MemberProfile | Value Object | produces-for | P1-data-handoff | strained |
| 15 | CD2-E15 | Agile PM | Collaboration | BacklogItemCompleted | Event | triggers-cross | P3-event-trigger | broken |

## Composition Patterns Exercised

| Pattern | Present? | Edge Count |
|---------|:--------:|----------:|
| P1-data-handoff | ✅ | 2 |
| P2-entity-reference | ✅ | 4 |
| P3-event-trigger | ✅ | 5 |
| P4-saga | ✅ | 1 |
| P5-cross-enforcement | ✅ | 2 |
| P6-shared-context | ✅ | 1 |

## Meta-Type Coverage

| Meta-Type | Count | BCs |
|-----------|------:|-----|
| Event | 5 | Agile PM, Collaboration, Identity & Access |
| Entity | 4 | Agile PM, Collaboration, Identity & Access |
| Value Object | 2 | Agile PM, Identity & Access |
| Rule | 1 | Identity & Access |
| Saga | 1 | Identity |
