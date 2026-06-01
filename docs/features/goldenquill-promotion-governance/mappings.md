---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-01
docType: mappings
---

# Mappings: GoldenQuill Promotion Governance

## OntologyVaultProjection

**From:** [PromotionCandidate](domain.md#promotioncandidate) plus optional [OwnerDecision](domain.md#ownerdecision)
**To:** Ontology Vault governance-compatible projection
**Direction:** Outbound audit projection, not production mutation

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| [PromotionCandidate](domain.md#promotioncandidate).`candidate_id` | `candidate_id` | direct | Preserves local id. |
| [PromotionCandidate](domain.md#promotioncandidate).`candidate_kind` | `record_kind` | mapped enum | Learning, process, budget, stewardship, or strategy candidate. |
| [PromotionCandidate](domain.md#promotioncandidate).`proposed_relation` | `target_relation` | direct | Proposed relation remains candidate-level. |
| [PromotionCandidate](domain.md#promotioncandidate).`source_packets` | `evidence_refs` | normalize to source refs | Evidence refs required. |
| [PromotionCandidate](domain.md#promotioncandidate).`source_events` | `evidence_refs` | append source-backed event refs | Outcome events can support candidate. |
| [PromotionCandidate](domain.md#promotioncandidate).`review_gate` | `review_gate` | direct | Required. |
| [PromotionCandidate](domain.md#promotioncandidate).`contradiction_path` | `contradiction_path` | direct | Required. |
| [PromotionCandidate](domain.md#promotioncandidate).`current_state` | `governance_state` | map candidate lifecycle to governance state | Does not imply promotion. |
| [OwnerDecision](domain.md#ownerdecision).`approved_allowed_uses` | `approved_allowed_uses` | direct only after approval | Forbidden before owner decision. |
| [OwnerDecision](domain.md#ownerdecision).`decision` | `owner_decision` | direct | Approved, rejected, retired, or contradicted. |

### Defaults

| Target Field | Default Value | Condition |
| --- | --- | --- |
| `validation_result` | `candidate` | Before [ValidatePromotionGovernance](operations.md#validatepromotiongovernance). |
| `approved_allowed_uses` | empty list | No approved [OwnerDecision](domain.md#ownerdecision). |
| `mutation_allowed` | `false` | Always false in L0. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `evidence_refs` | Must be non-empty. | Block projection. |
| `review_gate` | Must be present. | Block projection. |
| `contradiction_path` | Must be present. | Block projection. |
| `approved_allowed_uses` | May appear only with approved owner decision. | Block projection. |
| `mutation_allowed` | Must be false in L0. | Block route. |

## OutcomeEventToLifecycleState

**From:** [GrantOutcomeEvent](domain.md#grantoutcomeevent)
**To:** [ApplicationLifecycleState](states.md#applicationlifecyclestate)
**Direction:** Internal projection

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `application_id` | `application_id` | direct | Same application. |
| `event_kind=submitted` | `current_stage=application_submitted` | mapped stage | Requires source. |
| `event_kind=portal_validated` | `current_stage=portal_validated` | mapped stage | Not final outcome. |
| `event_kind=agency_retrieved` | `current_stage=agency_retrieved` | mapped stage | Feeds cycle-time metrics. |
| `event_kind=agency_tracking_assigned` | `current_stage=agency_tracking_assigned` | mapped stage | Feeds lifecycle depth. |
| `event_kind=under_review` | `current_stage=under_review` | mapped stage | Does not mean award/decline. |
| `event_kind=feedback_received` | `current_stage=review_feedback_received` | mapped stage | May create org-scoped learning. |
| `event_kind=awarded` | `current_stage=awarded` | mapped stage and final outcome | Requires award source. |
| `event_kind=declined` | `current_stage=declined` | mapped stage and final outcome | Requires decline source. |
| `event_kind=withdrawn` | `current_stage=withdrawn` | mapped stage and final outcome | Blocks win/loss interpretation. |
| `event_kind=report_accepted` | `current_stage=reporting_current` | mapped stage | Post-award reporting. |
| `event_kind=closed_out` | `current_stage=closed_out` | mapped stage and final outcome | Stewardship/retention signal. |
| `source_ref` | `source_event_id` | reference | Required. |
| `event_date` | `last_verified_utc` | captured timestamp | Use source or capture timestamp. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `source_ref` | Required. | Reject lifecycle projection. |
| `current_stage` | Must be in [ApplicationStage](domain.md#applicationstage). | Reject projection. |
| `profile_override` | Requires [StageProfile](domain.md#stageprofile). | Reject override. |

## KpiObservationToPromotionCandidate

**From:** [GrantKpiObservation](domain.md#grantkpiobservation)
**To:** [PromotionCandidate](domain.md#promotioncandidate)
**Direction:** Internal candidate-generation mapping

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `metric_id` | `source_kpis[]` | append reference | KPI supports candidate only after validation. |
| `metric_kind` | `candidate_kind` | map to lesson type | Example: `award_amount_realization` -> `budget_framing_lesson`. |
| `source_events` | `source_events[]` | append references | Source-backed evidence required. |
| `interpretation_limits` | `promotion_blockers` or `residue` | preserve limits | Prevents metric overreach. |
| `segment` | `target_artifact` or candidate scope | optional | Keeps funder/org/program context explicit. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `denominator_definition` | Required for rates/ratios. | Reject candidate generation. |
| `source_events` | Required. | Reject candidate generation. |
| `proposed_allowed_uses` | May include candidate-level uses only. | Reject if approved use appears. |
