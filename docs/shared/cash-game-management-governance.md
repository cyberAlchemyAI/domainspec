# Cash Game Management Governance Blueprint

## Purpose

This document defines a cross-feature governance layer for a stable cash game poker team management platform.

It is intentionally not a single feature specification.

It exists to provide guardrails, ontology, and deterministic policy defaults that every feature must follow.

## Position In The Architecture

- Layer G0: governance and ontology blueprint (this document)
- Layer G1: feature specifications in docs/features/*
- Layer G2: implementation in backend and web code
- Layer G3: observability, infra, and operational controls

Authority model:
- Domain behavior remains backend-owned.
- Web consumes backend contracts through adapters.
- Every behavior change updates feature docs before or with code.

## Management Definition

Cash game management is the disciplined control of player lifecycle, gameplay constraints, money movement, performance feedback, and settlement outcomes under auditable policy.

Management includes:
- Operational orchestration: who can do what, when, and in what state.
- Financial integrity: consistent calculations, deterministic rounding, and reconciliation.
- Risk governance: fail-closed decisions, traceability, and control checks.
- Learning loop: measurable outcomes and feedback into future policies.

## Business Ontology Methods (Reference Set)

Use the following methods as conceptual references and adapt them to DomainSpec artifacts:

1. Business capability mapping (Business Architecture Guild, BIZBOK family)
- Use to define stable capabilities independent of org chart.
- Map each capability to one or more DomainSpec features.

2. Process taxonomy (APQC PCF)
- Use to classify and standardize recurring operational flows.
- Map each process class to operations/workflows/states artifacts.

3. IT governance control objectives (COBIT 2019)
- Use to define control ownership, accountability, and audit intent.
- Map controls to rules, policies, and evidence in TEST-SPEC.

4. Risk management profile model (NIST CSF 2.0)
- Use to define risk posture and response pathways.
- Map risk controls to auth, observability, and failure policies.

5. Architecture modeling language (ArchiMate)
- Use as a conceptual language for cross-domain relationship clarity.
- Keep DomainSpec taxonomy and typed relationships as implementation-facing source of truth.

## Capability Map For A Cash Game Team

Core capability groups that should remain stable across feature evolution:

1. Identity And Access Governance
- AuthN/AuthZ, permission catalog, deny-by-default controls.
- Typical feature anchors: auth-access-control.

2. Player Master Governance
- Player identity, lifecycle, coach assignment, visibility scope.
- Typical feature anchors: player-management, player-onboarding.

3. Session And Gameplay Governance
- Session boundaries, table/stake policy, operational controls.
- This is the future primary home for cash game operations policy.

4. Financial Integrity Governance
- Makeup accounting, settlement generation, financial reconciliation.
- Typical feature anchors: player-makeup, financial-settlement.

5. Performance Intelligence Governance
- Stats ingestion, progression policies, coaching analytics.
- Typical feature anchors: player-stats, player-progression.

## DomainSpec Alignment Rules

Every new or evolved feature must satisfy these rules:

1. SPEC authority
- SPEC.md defines ownership boundaries, dependencies, and concept registry IDs.

2. Story authority
- STORIES.md must include public journey, admin journey, cross-feature integration, and edge/error journey.
- Stories must include classic format plus Given/When/Then.

3. Test derivation authority
- TEST-SPEC.md must be generated from documented rules, calculations, states, interfaces, events, queries, mappings, and workflows.
- Each obligation has deterministic assertions.

4. Traceability authority
- Story to test mapping is mandatory.
- Pilot must-pass subset is explicit.
- Evidence files are explicit.

5. Drift control authority
- Alignment and layering audits are mandatory for implemented features.

## Deterministic Governance Defaults (Current Decisions)

| Decision Area | Chosen Default | Rationale |
| --- | --- | --- |
| Scope model | Holistic cross-operation governance | Enables one control frame across operations, finance, and analytics. |
| Visibility | Guideline-level objective, feature-specific visibility later | Avoids premature coupling while keeping governance direction stable. |
| Rounding policy | round-down-cent | Conservative financial behavior and predictable reconciliation. |
| Auth gate | deny-by-default-strict | Prevents implicit authorization drift. |
| Dedupe gate | scope + effectiveFrom + active | Supports versioned policies without duplicate active collisions. |
| Audit metadata | full-audit | Preserves change accountability and decision traceability. |
| Failure policy | fail-closed | Protects financial and access integrity under uncertainty. |
| Decision model | precedence deny > restrict > allow | Deterministic conflict resolution with explainable outcomes. |

## Mandatory Policy Contracts

1. Authentication and authorization
- Any write path must require explicit permission keys.
- Any missing mapping defaults to deny.

2. Money and precision
- Monetary outputs are normalized to two decimals at contract boundaries.
- Rounding policy must be explicit in operations and tests.

3. Idempotency and deduplication
- Duplicate-sensitive operations define deterministic keys.
- Conflicts return explicit, stable error contracts.

4. Auditability
- All governance mutations capture createdBy/createdAt/updatedBy/updatedAt.
- Decision traces include policy inputs and final rationale.

5. Failure handling
- Governance evaluation failures block writes by default.
- Failure outcomes are observable and auditable.

6. Cross-feature compatibility
- Features consume shared concepts through declared contracts, not hidden coupling.

## Ontology Starter Set (Concept Families)

These concept families should be reused and refined, not reinvented per feature:

- Structural: Player, Coach, Table, Session, StakeProfile, SettlementBatch, AuditRecord.
- Behavioral: Register, Assign, Record, Reconcile, Settle, Promote, Authorize.
- Constraint: Rule, Policy, Threshold, Window, Eligibility, Limit.
- Lifecycle: Draft, Active, Suspended, Closed, Settled, Archived.
- Evidence: DecisionTrace, EvidencePackage, Blocker, VerificationVerdict.

## Relationship Rules (Using DomainSpec Typed Edges)

- Rules enforce operations.
- Policies apply to operations.
- Workflows orchestrate operations.
- Interfaces expose operations and queries.
- Events signal cross-feature side effects.
- Queries read entities without mutation.

When in doubt, model the relationship explicitly before coding.

## Feature Development Guardrails

For any new feature proposal:

1. Define capability ownership first.
2. Define concept IDs and boundaries second.
3. Define operations/rules/calculations/states third.
4. Define interface and query contracts fourth.
5. Define stories and test obligations fifth.
6. Implement code only after the above are reviewable.

Do not skip directly to implementation for behavior that changes money, permissions, or lifecycle transitions.

## Pilot Readiness Gate (Wave 1 Must-Pass)

A pilot is not ready without these minimum checks:

1. Auth and permission gates
- 401/403/2xx route behavior is tested for protected endpoints.

2. Monetary determinism
- Calculation and rounding tests prove deterministic output.

3. Deduplication and idempotency
- Duplicate write paths are blocked with stable conflict responses.

4. Audit integrity
- Mutation paths record required audit metadata and decision traces.

5. Failure policy
- Governance evaluation failures fail closed for write paths.

6. Cross-feature invariants
- Settlement, makeup, stats, and player visibility contracts remain consistent.

## Evidence Package Standard

Every pilot-ready feature should provide:

- Test IDs and deterministic assertions.
- Story-to-test matrix.
- Must-pass subset.
- Blockers register with owner and unblock criteria.
- Verification command output references.

## Adoption Sequence

1. Keep this blueprint stable as Layer G0.
2. Evolve feature docs under docs/features/* using these guardrails.
3. Derive TEST-SPEC obligations from docs.
4. Implement and verify.
5. Feed lessons learned back into this blueprint.

## Out Of Scope

- UI visual design system details (handled by UI architecture and per-feature UI-SPEC).
- Infrastructure provisioning details (handled by INFRA-ARCHITECTURE and SLO/monitoring docs).
- Day-to-day coaching pedagogy content.

## Change Protocol For This Blueprint

When updating this document:

1. Preserve deterministic defaults unless there is explicit approval to change them.
2. Record what changed and why in release notes or session report.
3. Re-check dependent feature docs for semantic drift.
4. Re-run docs indexing after synchronized updates in project docs.
