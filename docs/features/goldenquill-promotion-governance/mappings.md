---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-08
docType: mappings
---

# Mappings: GoldenQuill Promotion Governance

## GrantWorkEventToDagNode

**From:** [GrantWorkEvent](domain.md#grantworkevent)
**To:** [GrantRunNode](domain.md#grantrunnode)
**Direction:** Internal projection

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `event_id` | `artifact_ref` or projection source | reference | Preserves accepted event identity. |
| `event_kind=run_node_recorded` | `node_kind` | mapped enum | Must map to [GrantRunNodeKind](domain.md#grantrunnodekind). |
| `envelope.run_id` | `run_id` | direct | Required for DAG projection. |
| `envelope.org_scope` | `org_scope` | direct | Preserves privacy boundary. |
| `envelope.source_ref` | `source_ref` | direct | Required for source-backed facts. |
| `envelope.gate_refs[]` | `gate_ref` | select relevant gate | Gate metadata follows the node. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `event.validation_state` | Must be `checked`. | Reject projection. |
| `node_kind` | Must be known. | Reject projection. |
| `run_id` | Must be present. | Reject projection. |

## GrantWorkEventToDagEdge

**From:** [GrantWorkEvent](domain.md#grantworkevent)
**To:** [GrantRunEdge](domain.md#grantrunedge)
**Direction:** Internal projection

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `event_kind=run_edge_recorded` | `edge_kind` | mapped enum | Must map to [GrantRunEdgeKind](domain.md#grantrunedgekind). |
| `envelope.run_id` | `run_id` | direct | Edges stay local to one run. |
| `envelope.source_ref` | `evidence_ref` | direct | Evidence for edge assertion. |
| `producer.producer_id` | `created_by` | direct | Preserves adapter source. |
| `validation_state` | `validation_state` | direct | Candidate, checked, failed, waived, or contradicted. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `edge_kind` | Must be known. | Reject projection. |
| `from_node` and `to_node` | Must be valid local run nodes. | Reject projection. |
| `blocked_by_gate` | Must prevent downstream traversal unless reopened. | Block traversal. |

## GrantWorkEventToOutcomeEvent

**From:** [GrantWorkEvent](domain.md#grantworkevent)
**To:** [GrantOutcomeEvent](domain.md#grantoutcomeevent)
**Direction:** Internal projection

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `event_kind=outcome_event_recorded` | `event_kind` | mapped enum | Must map to [GrantOutcomeEventKind](domain.md#grantoutcomeeventkind). |
| `event_id` | `event_id` | direct or namespaced | Stable source-backed event id. |
| `payload.application_id` | `application_id` | direct | Required. |
| `envelope.source_ref` | `source_ref` | direct | Source-backed outcome evidence. |
| `envelope.occurred_at` | `event_date` | date extraction | Uses source or operator-verified date. |
| `payload.amount_requested` | `amount_requested` | direct | Optional. |
| `payload.amount_awarded` | `amount_awarded` | direct | Optional. |
| `envelope.interpretation_limits` | `interpretation_limits` | direct | Required. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `source_ref` | Required. | Reject outcome projection. |
| `interpretation_limits` | Required. | Reject outcome projection. |
| `portal_status` | Cannot become final outcome without source. | Reject interpretation. |

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

## ActionKpiAssociationToBIInsightCandidate

**From:** [ActionKpiAssociation](analytics-methods.md#actionkpiassociation)
**To:** [BIInsightCandidate](analytics-methods.md#biinsightcandidate-profile)
**Direction:** Internal BI candidate-generation mapping

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `association_id` | `association_refs[]` | append reference | Preserves analytics evidence. |
| `method_id` | `method_id` | direct | Names method registry entry. |
| `claim_label` | `claim_label` | direct | Caps how the insight may be interpreted. |
| `confidence_summary` | `confidence_class` | classify | Keeps uncertainty visible. |
| `bias_notes` | `promotion_blockers` or `residue` | preserve | Bias cannot disappear during candidate creation. |
| `interpretation_limits` | `interpretation_limits` | direct | Prevents method overreach. |
| `source_refs` | `source_packets` or `source_events` | append refs | Evidence lineage. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `claim_label` | Must not be `blocked_or_residue`. | Reject candidate. |
| `method_id` | Must resolve to [StatisticalMethodSpec](analytics-methods.md#statisticalmethodspec). | Reject candidate. |
| `proposed_allowed_uses` | May include candidate-level uses only. | Reject if approved use appears. |
| `contradiction_path` | Required. | Reject candidate. |

## ActionKpiAssociationToOptimizationChainDefinition

**From:** [ActionKpiAssociation](analytics-methods.md#actionkpiassociation)
**To:** [OptimizationChainDefinition](optimization-chains.md#core-definition)
**Direction:** Internal BI explanation mapping

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `association_id` | `association_refs[]` | append reference | Preserves method evidence. |
| `action_pattern_ref` | `action_fact_refs[]` | map to action query or fact refs | Keeps the grant action visible. |
| `kpi_window_refs` | `response_window_refs[]` | direct | Preserves temporal and denominator boundary. |
| `method_id` | `analytics_method_ref` | direct | Must resolve to method registry. |
| `claim_label` | `claim_label` | direct or downgrade | Chain cannot exceed source claim. |
| `confidence_summary` | `confidence_class` | classify | Converts method uncertainty into plain class. |
| `interpretation_limits` | `interpretation_limits[]` | direct | Keeps caveats attached to all sentence forms. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `expression_set` | Must include plain-language, operator, executive, contract, causal-careful, dashboard-label, and ontology forms. | Reject chain. |
| `desired_bi_optimization` | Must be named and tied to KPI movement. | Reject chain. |
| `claim_label` | Must not exceed association claim or method spec. | Downgrade or reject. |
| `governance_route` | Must require BIInsightCandidate, Ontology Vault projection, owner decision, and approved reuse packet before reuse. | Reject chain. |

## BIInsightCandidateToOntologyVaultProjection

**From:** [BIInsightCandidate](analytics-methods.md#biinsightcandidate-profile)
**To:** [OntologyVaultProjection](#ontologyvaultprojection)
**Direction:** Governance compatibility mapping

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `candidate_id` | `local_record_id` | direct | Candidate identity. |
| `method_id` | `source_method_ref` | direct | Analytics method evidence. |
| `claim_label` | `claim_class` | direct | Prevents correlation from becoming causal truth. |
| `association_refs` | `evidence_refs[]` | append | Association evidence. |
| `privacy_scope` | `scope` | direct | Org/workspace boundary. |
| `redaction_status` | `privacy_state` | direct | Required for workspace-safe reuse. |
| `interpretation_limits` | `limits` | direct | Keeps caveats attached. |
| `proposed_allowed_uses` | `requested_allowed_uses` | direct | Owner still decides. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `claim_label` | Causal or controlled claims require matching method maturity. | Downgrade or reject projection. |
| `minimum_group_threshold` | Must satisfy aggregate privacy gate. | Block projection. |
| `redaction_status` | Must satisfy requested scope. | Block workspace-safe projection. |
| `owner_decision_ref` | Must be empty before owner decision. | Reject premature approval. |

## OwnerDecisionToApprovedReusePacket

**From:** [OwnerDecision](domain.md#ownerdecision)
**To:** [ApprovedReusePacket](domain.md#approvedreusepacket)
**Direction:** Outbound/internal approved reuse handoff

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `decision_id` | `decision_id` | direct | Owner decision authority. |
| `candidate_id` | `candidate_id` | direct | Candidate being authorized. |
| `approved_allowed_uses` | `approved_allowed_uses` | direct | Required only for approved decisions. |
| `decision_source` | `source_refs[]` | append | Decision evidence. |
| `conditions` | `conditions` | direct | Approval conditions. |
| `contradiction_path` | `contradiction_path` | direct | Required. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `decision` | Must be `approved`. | Reject packet. |
| `approved_allowed_uses` | Must be non-empty. | Reject packet. |
| `reuse_scope` | Must not exceed owner approval or redaction status. | Block packet. |

## ApprovedReusePacketToFutureGrantContext

**From:** [ApprovedReusePacket](domain.md#approvedreusepacket)
**To:** Future Scout, Scribe, Judge, Logician, Funding Goal, memory query, or card/funder context
**Direction:** Internal context hydration

### Field Mapping

| Source Field | Target Field | Transform | Notes |
| --- | --- | --- | --- |
| `packet_id` | `context_source_ref` | direct | Preserves audit trail. |
| `approved_allowed_uses` | `allowed_uses` | direct | Consumer may use only approved uses. |
| `reuse_scope` | `scope` | direct | Enforces org/workspace boundary. |
| `source_refs` | `evidence_refs` | direct | Keeps source evidence attached. |
| `conditions` | `context_conditions` | direct | Conditions travel with the hydrated context. |

### Validation

| Field | Validation | On Failure |
| --- | --- | --- |
| `requested_use` | Must be in `approved_allowed_uses`. | Reject hydration. |
| `consumer.scope` | Must fit `reuse_scope`. | Reject hydration. |
| `packet.status` | Must not be retired or contradicted. | Reject hydration. |
