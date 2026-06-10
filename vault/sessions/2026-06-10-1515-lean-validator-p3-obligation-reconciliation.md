---
tags: [lean-code-validator, validation, ontology, architecture, close-session]
node_type: spec
is_session: true
layer: architecture, domain
nature: technical
status: active
created: 2026-06-10
timestamp: 2026-06-10T15:15:53-03:00
expires: 2026-08-09
conversation_id: 2026-06-10-lean-validator-p3-obligation-reconciliation
decisions_made: true
contradictions_found: false
specs_updated: [internal_tools/lean-code-validator/spec/queries.md, internal_tools/lean-code-validator/spec/rules.md, internal_tools/lean-code-validator/spec/operations.md]
promoted_candidates: []
expected_importance: 7
importance_rationale: "Locks the authoritative behavioral contract for the lean-code-validator P3 predicate by reconciling two contradicting obligation-table drafts against the canonical σ-signature, preventing divergent implementations."
---

# Lean-Code-Validator: P3 Obligation Table Reconciliation

## Summary

The session asked whether the lean-code-validator's P3 predicate (per-meta obligation completeness) was ready to implement, and surfaced that its obligation table existed as two contradicting drafts. Adjudicating both against the canonical σ-signature (`Sigma.lean`) proved `spec/queries.md` had four reversed-direction rows (Event, Rule, Mapping, Interface) while `research.md §2` was σ-correct — so the fix split into a mechanical σ-direction reconciliation (forced by decision D2) and a deferred *mandatoriness* decision (gated on experiment EX1 per hypothesis H2, graded `warn`-only). Four writer + four reviewer subagents updated five docs: reconciled the authoritative obligation table in `queries.md`, recorded decision **D13**, resolved open-question **A6** (one rule per meta-type), and aligned `rules.md`/`operations.md` to the warn-only/PENDING-EX1 posture. Implementation of P3 (Lean `obligationsForMeta` def + running EX1) remains the next step.

## Files touched

- internal_tools/lean-code-validator/spec/queries.md
- internal_tools/lean-code-validator/spec/rules.md
- internal_tools/lean-code-validator/spec/operations.md
- domain_knowledge/lean-code-validator/discovery/PROJECT-DECISIONS.md
- domain_knowledge/lean-code-validator/discovery/INITIAL-DEFINITIONS.md
