---
id: goldenquill-promotion-governance
feature: GoldenQuill Promotion Governance
type: observability
title: "GoldenQuill Promotion Governance - Observability Spec"
derived-from: OBSERVABILITY.md rules O1-O16
status: draft
---

# GoldenQuill Promotion Governance - Observability Spec

Every metric in this file is an observation. Metrics do not create promotion
authority. Any metric-derived learning must pass [CreatePromotionCandidate](operations.md#createpromotioncandidate),
[ValidatePromotionGovernance](operations.md#validatepromotiongovernance), and
[RecordOwnerDecision](operations.md#recordownerdecision).

Event-spine metrics are also observations. Event acceptance, projection
latency, replay, conflict, and future-context hydration do not create approval
authority.

## Domain Fidelity Metrics

### State Machine Monitors

| State Machine | Transition Counter | Invalid Transition Alert | Source |
| --- | --- | --- | --- |
| [GrantRunTraversalState](states.md#grantruntraversalstate) | `gq.promotion_governance.grant_run_transition` | Any downstream traversal after `blocked_by_gate` without reopen -> P0 | [states.md](states.md#grantruntraversalstate) |
| [ApplicationLifecycleState](states.md#applicationlifecyclestate) | `gq.promotion_governance.application_stage_transition` | Final outcome without source -> P0 | [states.md](states.md#applicationlifecyclestate) |
| [PromotionCandidateState](states.md#promotioncandidatestate) | `gq.promotion_governance.candidate_transition` | Approved state without owner decision -> P0 | [states.md](states.md#promotioncandidatestate) |
| [OwnerDecisionState](states.md#ownerdecisionstate) | `gq.promotion_governance.owner_decision_transition` | Non-approved decision with approved uses -> P0 | [states.md](states.md#ownerdecisionstate) |

### Operation Metrics

| Operation | Invocation Metric | Rule Violation Metric | Important Rule |
| --- | --- | --- | --- |
| [AcceptGrantWorkEvent](operations.md#acceptgrantworkevent) | `gq.promotion_governance.accept_grant_work_event.invocation` | `gq.promotion_governance.rule_violation` with `operation=AcceptGrantWorkEvent` | Missing producer, source, idempotency key, interpretation limits, or adapter-set approved uses. |
| [ProjectEventToDag](operations.md#projecteventtodag) | `gq.promotion_governance.project_event_to_dag.invocation` | `gq.promotion_governance.rule_violation` with `operation=ProjectEventToDag` | Event must be accepted and projection receipt must exist. |
| [RecordGrantRunEvent](operations.md#recordgrantrunevent) | `gq.promotion_governance.record_grant_run_event.invocation` | `gq.promotion_governance.rule_violation` with `operation=RecordGrantRunEvent` | Unknown node/edge kind or illegal blocked traversal. |
| [RecordOutcomeEvent](operations.md#recordoutcomeevent) | `gq.promotion_governance.record_outcome_event.invocation` | `gq.promotion_governance.rule_violation` with `operation=RecordOutcomeEvent` | Missing source reference. |
| [ProjectEventToLifecycleAndKpi](operations.md#projecteventtolifecycleandkpi) | `gq.promotion_governance.project_event_to_lifecycle_and_kpi.invocation` | `gq.promotion_governance.rule_violation` with `operation=ProjectEventToLifecycleAndKpi` | Outcome and KPI projections must preserve source and denominator semantics. |
| [ComputeKpiObservation](operations.md#computekpiobservation) | `gq.promotion_governance.compute_kpi_observation.invocation` | `gq.promotion_governance.rule_violation` with `operation=ComputeKpiObservation` | Missing denominator definition. |
| [ProjectGrantActionFacts](operations.md#projectgrantactionfacts) | `gq.promotion_governance.project_grant_action_facts.invocation` | `gq.promotion_governance.rule_violation` with `operation=ProjectGrantActionFacts` | Action facts must trace to accepted events and projection receipts. |
| [BuildKpiResponseWindow](operations.md#buildkpiresponsewindow) | `gq.promotion_governance.build_kpi_response_window.invocation` | `gq.promotion_governance.rule_violation` with `operation=BuildKpiResponseWindow` | Response windows must block temporal leakage and preserve censoring. |
| [EvaluateActionKpiAssociation](operations.md#evaluateactionkpiassociation) | `gq.promotion_governance.evaluate_action_kpi_association.invocation` | `gq.promotion_governance.rule_violation` with `operation=EvaluateActionKpiAssociation` | Method registry, sample, field, bias, and claim-label gates must pass. |
| [CreateBIInsightCandidate](operations.md#createbiinsightcandidate) | `gq.promotion_governance.create_bi_insight_candidate.invocation` | `gq.promotion_governance.rule_violation` with `operation=CreateBIInsightCandidate` | BI candidates are PromotionCandidate profiles and cannot carry approved uses. |
| [CreatePromotionCandidate](operations.md#createpromotioncandidate) | `gq.promotion_governance.create_promotion_candidate.invocation` | `gq.promotion_governance.rule_violation` with `operation=CreatePromotionCandidate` | Candidate includes approved uses or lacks contradiction path. |
| [ValidatePromotionGovernance](operations.md#validatepromotiongovernance) | `gq.promotion_governance.validate_promotion_governance.invocation` | `gq.promotion_governance.rule_violation` with `operation=ValidatePromotionGovernance` | Missing evidence, review gate, contradiction path, or projection tries to mutate. |
| [RedactionGeneralizationGate](operations.md#redactiongeneralizationgate) | `gq.promotion_governance.redaction_gate.invocation` | `gq.promotion_governance.rule_violation` with `operation=RedactionGeneralizationGate` | Workspace-safe reuse without privacy gate. |
| [RecordOwnerDecision](operations.md#recordownerdecision) | `gq.promotion_governance.record_owner_decision.invocation` | `gq.promotion_governance.rule_violation` with `operation=RecordOwnerDecision` | Approved decision without approved uses or source. |
| [PublishApprovedReusePacket](operations.md#publishapprovedreusepacket) | `gq.promotion_governance.publish_approved_reuse_packet.invocation` | `gq.promotion_governance.rule_violation` with `operation=PublishApprovedReusePacket` | Packet requires approved owner decision and approved uses. |
| [HydrateFutureGrantContext](operations.md#hydratefuturegrantcontext) | `gq.promotion_governance.hydrate_future_grant_context.invocation` | `gq.promotion_governance.rule_violation` with `operation=HydrateFutureGrantContext` | Requested use and scope must match approved reuse packet. |

### Event Spine Metrics

| Metric | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `gq.promotion_governance.event.accepted` | Counter | Accepted events by producer kind and event kind. |
| `gq.promotion_governance.event.rejected` | Counter | Rejected events by producer kind, event kind, and blocked reason. |
| `gq.promotion_governance.event.projection_latency_ms` | Histogram | Time from event acceptance to projection receipt. |
| `gq.promotion_governance.event.idempotent_replay` | Counter | Duplicate idempotency key with identical content was safely skipped. |
| `gq.promotion_governance.event.duplicate_conflict` | Counter | Duplicate idempotency key with changed content was blocked. |
| `gq.promotion_governance.event.projection_receipt_completeness` | Gauge | Share of projections with created, skipped, or blocked refs recorded. |
| `gq.promotion_governance.reuse.packet_published` | Counter | Approved reuse packets published after owner decision. |
| `gq.promotion_governance.reuse.future_context_hydrated` | Counter | Future grant contexts hydrated from approved reuse packets. |

### Analytics Method Metrics

| Metric | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `gq.promotion_governance.analytics.method_sample_gate_failed` | Counter | Method blocked because observation or segment count was too low. |
| `gq.promotion_governance.analytics.temporal_leakage_blocked` | Counter | Action occurred after the KPI response measurement. |
| `gq.promotion_governance.analytics.censoring_required` | Counter | Pending outcome was handled as censored rather than loss. |
| `gq.promotion_governance.analytics.selection_bias_unchecked` | Counter | Association downgraded or blocked because treatment selection was not addressed. |
| `gq.promotion_governance.analytics.multiple_comparison_residue` | Counter | Exploratory scan emitted residue rather than candidate. |
| `gq.promotion_governance.analytics.aggregate_privacy_threshold_failed` | Counter | Aggregate was too small or scoped for safe reuse. |

## Business Effectiveness Metrics

### Lifecycle Depth

| KPI | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `stage_depth` | Gauge | Shows deepest verified stage reached; not final outcome truth. |
| `stage_depth_score` | Gauge | Compares lifecycle progress; profile override required for family-specific scoring. |
| `submission_validated_rate` | Gauge | Tracks portal completion quality. |
| `agency_retrieved_rate` | Gauge | Tracks movement past portal into agency receipt. |
| `review_reached_rate` | Gauge | Tracks whether proposals reached review, not whether they were strong. |
| `final_decision_rate` | Gauge | Tracks awarded plus declined over submitted applications. |
| `closeout_completed_rate` | Gauge | Tracks completed stewardship. |

### Outcome Evidence

| KPI | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `win_rate_by_count` | Gauge | Awarded over final decisions, with funder benchmark context. |
| `win_rate_by_dollars` | Gauge | Awarded dollars over requested dollars for final decisions. |
| `decline_rate` | Gauge | Declines over final decisions. |
| `pending_rate` | Gauge | Pending over submitted applications. |
| `award_amount_realization` | Gauge | Award amount over requested amount. |
| `partial_award_rate` | Gauge | Partial awards over awards. |
| `resubmission_success_rate` | Gauge | Awarded resubmissions over final-decision resubmissions. |
| `repeat_funder_win_rate` | Gauge | Repeat-funder awards over repeat-funder final decisions. |
| `new_funder_conversion_rate` | Gauge | New-funder awards over new-funder final decisions. |

### Quality And Review Movement

| KPI | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `compliance_pass_rate` | Gauge | Logician pre-submit gates passed over attempted. |
| `rubric_coverage_score` | Gauge | Covered rubric criteria over total criteria. |
| `reviewer_objection_resolution_rate` | Gauge | Resolved objections over total objections. |
| `evidence_gap_resolution_rate` | Gauge | Resolved evidence gaps over identified gaps. |
| `section_revision_delta` | Histogram | Score or risk improvement across draft iterations. |
| `review_feedback_quality` | Gauge | Coded feedback specificity and actionability. |
| `resubmission_delta` | Histogram | Score/review movement from prior submission to next. |

### Strategy Fit

| KPI | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `go_no_go_selectivity` | Gauge | Pursued opportunities over researched opportunities. |
| `high_match_pursuit_rate` | Gauge | High-fit pursued over high-fit identified. |
| `low_fit_avoidance_rate` | Gauge | Low-fit not pursued over low-fit identified. |
| `relationship_present_rate` | Gauge | Submissions with existing funder relationship over submissions. |
| `prior_award_alignment` | Gauge | Proposal fit against funder prior-award corpus. |
| `program_drift_rate` | Gauge | Changed requirements after discovery. |

### Effort, ROI, Capacity, And Relationship

| KPI | Instrument | Healthy Interpretation |
| --- | --- | --- |
| `hours_per_submission` | Histogram | Staff hours over submitted application. |
| `cost_per_submitted_application` | Histogram | Labor plus tools over submitted application. |
| `cost_per_award` | Histogram | Labor plus tools over awards. |
| `dollars_requested_per_hour` | Gauge | Requested dollars over grant-work hours. |
| `dollars_awarded_per_hour` | Gauge | Awarded dollars over grant-work hours. |
| `cycle_time_discovery_to_submit` | Histogram | Submission date minus discovery date. |
| `cycle_time_submit_to_decision` | Histogram | Decision date minus submission date. |
| `reporting_burden_hours` | Histogram | Post-award reporting hours over award. |
| `stakeholder_contacts` | Counter | Grant-seeking contacts per period. |
| `new_stakeholder_engagement_rate` | Gauge | New stakeholders engaged over stakeholders engaged. |
| `collaboration_artifacts_count` | Counter | MOUs, MOAs, support letters, partner commitments. |
| `staff_consultations` | Counter | Staff consultations for proposal/program development. |
| `internal_training_hours` | Histogram | Internal grant capability hours. |
| `funder_touchpoints` | Counter | Contacts with new and existing funders. |
| `grant_retention_rate` | Gauge | Repeat support year over year. |

## Governance Alerts

| Alert | Condition | Severity |
| --- | --- | --- |
| `source_missing` | Outcome event lacks [SourceRef](domain.md#sourceref). | P0 |
| `event_source_missing` | Source-backed [GrantWorkEvent](domain.md#grantworkevent) lacks required source ref. | P0 |
| `event_duplicate_conflict` | Same idempotency key appears with different content. | P0 |
| `event_projection_receipt_missing` | Event projection writes without [EventProjectionReceipt](domain.md#eventprojectionreceipt). | P0 |
| `denominator_missing` | Rate/ratio KPI lacks denominator definition. | P0 |
| `method_sample_gate_failed` | [StatisticalMethodSpec](analytics-methods.md#statisticalmethodspec) minimum observations or segments failed. | P1 |
| `temporal_leakage_blocked` | [KpiResponseWindow](analytics-methods.md#kpiresponsewindow) anchor action is not prior to response. | P0 |
| `aggregate_privacy_threshold_failed` | [BIInsightCandidate](analytics-methods.md#biinsightcandidate-profile) aggregate is too small or private for requested scope. | P0 |
| `premature_approved_use` | [PromotionCandidate](domain.md#promotioncandidate) contains approved allowed uses. | P0 |
| `adapter_approved_use_attempt` | [AdapterProducer](domain.md#adapterproducer) output tries to set approved uses. | P0 |
| `privacy_gate_bypass` | Workspace-safe reuse requested from org-scoped feedback without generalization and approval. | P0 |
| `projection_mutation_attempt` | [OntologyVaultProjection](mappings.md#ontologyvaultprojection) tries to mutate target artifact in L0. | P0 |
| `future_context_scope_violation` | Future grant context requests a use or scope not approved by [ApprovedReusePacket](domain.md#approvedreusepacket). | P0 |
| `dashboard_authority_drift` | Dashboard observation is treated as source truth or promotion authority. | P1 |
