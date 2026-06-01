---
tags: [goldenquill-promotion-governance, spec, test]
node_type: spec
is_session: false
layer: application
nature: procedural, technical
status: draft
version: 0.1.0
last_updated: 2026-06-01
---

# Test Spec: GoldenQuill Promotion Governance

This test specification defines the fixture-only L0 validator contract for
GoldenQuill Promotion Governance. Tests should use synthetic/demo data only and
must not write production org memory, signed cards, dashboard state, org-vault
data, or canonical Ontology Vault artifacts.

## Fixture Corpus

The first fixture corpus must include:

- a pass path from `run_context` to `delivery_envelope`;
- a blocked path where `kgie_preflight` is blocked by `logician_gate_result`;
- a submitted-but-not-reviewed outcome;
- a declined-after-review outcome;
- an awarded-for-less-than-requested outcome;
- a successful post-award report or closeout outcome;
- positive candidate, governance projection, redaction/generalization, and owner
  decision cases;
- negative cases for missing source, missing denominator, premature approved
  uses, missing contradiction path, unsafe feedback reuse, missing projection
  evidence, and KPI-only promotion.

## Test Matrix

| ID | Test | Validates |
| --- | --- | --- |
| [T1](#t1-valid-run-dag-pass-path) | Valid run DAG captures pass path from `run_context` to `delivery_envelope`. | [SPEC execution DAG](SPEC.md#execution-dag-contract), [RecordGrantRunEvent R1-R4](operations.md#recordgrantrunevent) |
| [T2](#t2-blocked-preflight-stops-traversal) | `kgie_preflight blocked_by_gate logician_gate_result` prevents downstream draft and delivery. | [GrantRunTraversalState GRT-I1](states.md#grantruntraversalstate) |
| [T3](#t3-outcome-event-requires-source) | Outcome event without source fails. | [RecordOutcomeEvent R1](operations.md#recordoutcomeevent) |
| [T4](#t4-portal-status-is-not-final-outcome) | Portal validation advances stage but cannot prove final award/decline. | [EvidenceStatePolicy](workflows.md#evidencestatepolicy) |
| [T5](#t5-kpi-requires-denominator-definition) | Rate or ratio KPI without denominator definition fails. | [ComputeKpiObservation R1](operations.md#computekpiobservation) |
| [T6](#t6-kpi-cannot-promote-directly) | KPI threshold alone cannot create approved reuse. | [PromotionAuthorityPolicy](workflows.md#promotionauthoritypolicy) |
| [T7](#t7-candidate-forbids-approved-uses) | Candidate with `approved_allowed_uses` fails. | [CreatePromotionCandidate R2](operations.md#createpromotioncandidate) |
| [T8](#t8-candidate-requires-contradiction-path) | Candidate without contradiction path fails. | [CreatePromotionCandidate R3](operations.md#createpromotioncandidate) |
| [T9](#t9-governance-projection-requires-evidence-gate-and-contradiction) | Governance projection missing evidence, review gate, or contradiction path fails. | [ValidatePromotionGovernance R1-R3](operations.md#validatepromotiongovernance) |
| [T10](#t10-projection-does-not-mutate-target-artifacts) | Ontology Vault projection remains audit-only in L0. | [OntologyVaultProjection validation](mappings.md#ontologyvaultprojection) |
| [T11](#t11-org-scoped-feedback-blocks-workspace-reuse) | Org-scoped feedback cannot become workspace-safe without redaction/generalization and owner approval. | [RedactionGeneralizationGate R1-R3](operations.md#redactiongeneralizationgate) |
| [T12](#t12-valid-redacted-learning-candidate-passes) | Redacted/generalized org-scoped feedback candidate can proceed to owner decision. | [PromotionCandidateState PCS-I3](states.md#promotioncandidatestate) |
| [T13](#t13-owner-decision-owns-approved-uses) | Approved owner decision with approved uses passes. | [RecordOwnerDecision R1](operations.md#recordownerdecision) |
| [T14](#t14-non-approved-decision-cannot-grant-uses) | Rejected, retired, or contradicted decision with approved uses fails. | [RecordOwnerDecision R2](operations.md#recordownerdecision) |
| [T15](#t15-stage-depth-supports-profile-override) | Stage-depth can use global baseline and name a future profile override. | [ApplicationLifecycleState ALS-I3](states.md#applicationlifecyclestate) |
| [T16](#t16-submitted-but-not-reviewed-does-not-imply-quality) | Submitted/portal-validated fixture tracks operational completion only. | [Outcome Examples](SPEC.md#submitted-but-not-reviewed) |
| [T17](#t17-declined-after-review-creates-private-learning) | Declined-after-review fixture creates org-scoped candidate only. | [Outcome Examples](SPEC.md#declined-after-review) |
| [T18](#t18-awarded-for-less-than-requested-candidate-is-bounded) | Partial award creates budget-framing candidate without validating all claims. | [Outcome Examples](SPEC.md#awarded-for-less-than-requested) |
| [T19](#t19-successful-closeout-feeds-stewardship-learning) | Report accepted and closeout feed retention/stewardship candidate with privacy guard. | [Outcome Examples](SPEC.md#successful-closeout) |

## Test Details

### T1 - Valid Run DAG Pass Path

Fixture includes all minimum execution nodes and edges:

```text
run_context
project_context_reference
rfa_reference
scout_discovery_record
scout_verification_record
operator_review_decision
rfa_dissection
kgie_preflight
scribe_section_draft
editor_suggestion_report
judge_score_report
responsiveness_map
logician_gate_result
operator_signoff
delivery_envelope
```

Assert the graph can answer what happened, in what order, and which gate allowed
the next step.

### T2 - Blocked Preflight Stops Traversal

Fixture uses:

```text
kgie_preflight
  blocked_by_gate logician_gate_result
logician_gate_result(emits=evidence_gap)
```

Assert no [scribe_section_draft](domain.md#grantrunnodekind) or
[delivery_envelope](domain.md#grantrunnodekind) exists downstream unless reopen
evidence exists.

### T5 - KPI Requires Denominator Definition

For every rate or ratio [GrantKpiKind](domain.md#grantkpikind), omit
`denominator_definition` and assert the validator rejects the observation.

### T11 - Org-Scoped Feedback Blocks Workspace Reuse

Create a declined-after-review candidate with `privacy_scope=single_org`,
feedback refs, and proposed `workspace_reuse`. Assert the candidate remains
blocked until `redaction_status=generalized` and owner approval evidence exists.

### T3 - Outcome Event Requires Source

Omit [GrantOutcomeEvent](domain.md#grantoutcomeevent).`source_ref` and assert
[RecordOutcomeEvent](operations.md#recordoutcomeevent) rejects the event.

### T4 - Portal Status Is Not Final Outcome

Use a `portal_validated` event and assert it advances
[ApplicationLifecycleState](states.md#applicationlifecyclestate) only to
`portal_validated`, not `awarded` or `declined`.

### T6 - KPI Cannot Promote Directly

Create a high or low KPI value and assert it can create a
[PromotionCandidate](domain.md#promotioncandidate) only after validation. It
must not create [OwnerDecision](domain.md#ownerdecision) or approved reuse.

### T7 - Candidate Forbids Approved Uses

Create a candidate with `approved_allowed_uses` and assert
[CreatePromotionCandidate](operations.md#createpromotioncandidate) rejects it.

### T8 - Candidate Requires Contradiction Path

Create a candidate without `contradiction_path` and assert validation fails
closed.

### T9 - Governance Projection Requires Evidence Gate And Contradiction

Omit evidence refs, review gate, and contradiction path in separate fixtures and
assert each one blocks [ValidatePromotionGovernance](operations.md#validatepromotiongovernance).

### T10 - Projection Does Not Mutate Target Artifacts

Assert [OntologyVaultProjection](mappings.md#ontologyvaultprojection) produces
audit output only in L0 and cannot write to Ontology Vault, cards, org memory,
or production state.

### T12 - Valid Redacted Learning Candidate Passes

Create org-scoped feedback with `redaction_status=generalized`, owner approval
evidence, and bounded approved uses. Assert the candidate reaches
`decision_pending`.

### T13 - Owner Decision Owns Approved Uses

Create an approved [OwnerDecision](domain.md#ownerdecision) with
`approved_allowed_uses` and decision source evidence. Assert it passes.

### T14 - Non-Approved Decision Cannot Grant Uses

Create rejected, retired, and contradicted owner decisions with
`approved_allowed_uses`. Assert each fails.

### T15 - Stage Depth Supports Profile Override

Use the global stage baseline, then add a named funder-family
[StageProfile](domain.md#stageprofile) override with source evidence. Assert the
override is accepted only when the profile is named and sourced.

### T16 - Submitted But Not Reviewed Does Not Imply Quality

Use the submitted-but-not-reviewed fixture and assert it creates operational
completion metrics only, not proposal-quality validation.

### T17 - Declined After Review Creates Private Learning

Use a feedback-plus-decline fixture and assert candidate privacy remains
`single_org` unless redaction/generalization and owner approval pass.

### T18 - Awarded For Less Than Requested Candidate Is Bounded

Use an award event where awarded amount is lower than requested. Assert it feeds
`award_amount_realization` and possible budget-framing learning without
validating every proposal claim.

### T19 - Successful Closeout Feeds Stewardship Learning

Use `report_accepted` and `closed_out` outcome events and assert the candidate
feeds stewardship and retention learning while keeping org facts private unless
generalized.

## Source Completeness Gate

The generated validator is incomplete if any of these source-of-truth items are
missing from fixtures:

- all mandatory execution node kinds;
- all mandatory execution edge kinds;
- at least one source-backed outcome event;
- at least one denominator-safe KPI observation;
- one candidate with `proposed_allowed_uses`;
- one owner decision with `approved_allowed_uses`;
- one governance projection;
- one redaction/generalization case;
- one negative KPI-only promotion attempt.

## Out of Scope

- Live grant portal integration.
- Dashboard UI.
- Production org-vault mutation.
- Signed-card mutation.
- Canonical Ontology Vault mutation.
- Real client or org data.

## Connections

| Document | Type | Description |
| --- | --- | --- |
| [SPEC.md](SPEC.md) | `derives-from` | Feature source of truth. |
| [operations.md](operations.md) | `validates` | Operation rules and error states. |
| [states.md](states.md) | `validates` | State transitions and invariants. |
| [mappings.md](mappings.md) | `validates` | Ontology Vault projection and KPI/candidate mappings. |
