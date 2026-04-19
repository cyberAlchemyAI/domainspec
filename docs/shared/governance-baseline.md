# Governance Baseline

## Purpose

This document defines cross-feature guardrails that apply to every feature before implementation starts.

It is a governance layer, not a single feature specification.

## Authority

- Backend is the business-logic authority.
- Web consumes backend contracts through adapters.
- Behavior changes must update feature docs before or with code changes.

## Deterministic Defaults

| Decision Area | Default | Why |
| --- | --- | --- |
| Auth gate | deny-by-default | Prevents implicit permission drift. |
| Failure policy | fail-closed | Protects financial and operational integrity. |
| Money precision | two-decimal normalized at boundaries | Keeps calculations predictable and reconcilable. |
| Idempotency | required for duplicate-sensitive writes | Prevents accidental double effects. |
| Audit metadata | createdBy/createdAt/updatedBy/updatedAt required | Preserves accountability and traceability. |

## Mandatory Contracts

1. Auth and permissions
- All write paths require explicit permission keys.
- Missing permission mapping resolves to deny.

2. Monetary integrity
- Rounding behavior is explicit in operations and tests.
- Contract outputs are normalized to two decimals.

3. Deduplication and idempotency
- Duplicate-sensitive operations define deterministic keys.
- Conflict responses are stable and testable.

4. Auditability
- Governance mutations capture actor and timestamp metadata.
- Decision traces include evaluated inputs and final rationale.

5. Failure handling
- Governance evaluation failures block writes by default.
- Failure outcomes are observable.

## Feature Readiness Gate

Before implementation starts for any feature:

1. Capability and ownership are explicit in SPEC.md.
2. Required aspect docs exist for intended behavior.
3. STORIES.md includes public, admin, cross-feature, and edge/error journeys.
4. TEST-SPEC.md obligations are derived from the docs.

## Project-Specific Link

- Cash game governance blueprint: shared/cash-game-management-governance.md
