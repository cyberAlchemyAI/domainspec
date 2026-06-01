---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-01
docType: workflows
---

# Workflows: GoldenQuill Promotion Governance

## GrantPromotionGovernanceWorkflow

**Type:** Workflow
**Triggers:** A grant opportunity enters a bounded GoldenQuill run and later produces outcome evidence or KPI learning signals.
**Orchestrates:** [RecordGrantRunEvent](operations.md#recordgrantrunevent), [RecordOutcomeEvent](operations.md#recordoutcomeevent), [ComputeKpiObservation](operations.md#computekpiobservation), [CreatePromotionCandidate](operations.md#createpromotioncandidate), [ValidatePromotionGovernance](operations.md#validatepromotiongovernance), [RedactionGeneralizationGate](operations.md#redactiongeneralizationgate), [RecordOwnerDecision](operations.md#recordownerdecision)
**Compensation Strategy:** fail closed, record residue, and preserve source evidence without promoting.
**Idempotency:** conditional. Replaying the same source-backed event is safe only when `event_id` and `source_ref` match.

### Steps

```mermaid
graph TD
    A[Create run_context] --> B[Attach project_context_reference and rfa_reference]
    B --> C[Record scout_discovery_record]
    C --> D[Record scout_verification_record]
    D --> E{Operator review decision}
    E -->|no-go| Z[Stop run and preserve residue]
    E -->|go| F[Emit rfa_dissection]
    F --> G[Run kgie_preflight]
    G --> H{Logician gate}
    H -->|blocked| I[Emit evidence_gap and stop traversal]
    H -->|allowed| J[Emit scribe_section_draft]
    J --> K[Emit editor_suggestion_report]
    K --> L[Emit judge_score_report and responsiveness_map]
    L --> M[Optional red_team_review]
    M --> N{Pre-submit logician gate}
    N -->|blocked| I
    N -->|allowed| O[Operator signoff]
    O --> P[Emit delivery_envelope]
    P --> Q[Record real-world outcome events]
    Q --> R[Project lifecycle state]
    R --> S[Compute KPI observations]
    S --> T[Generate promotion candidate]
    T --> U[Run Ontology Vault governance checks]
    U --> V{Org-scoped feedback?}
    V -->|yes| W[Run redaction/generalization gate]
    V -->|no| X[Ask owner decision]
    W --> X
    X --> Y[Record approved, rejected, retired, or contradicted decision]
```

### Step Table

| # | Step | Actor | Operation | On Success | On Failure | Compensation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Create run context | GoldenQuill | [RecordGrantRunEvent](operations.md#recordgrantrunevent) | Attach context references | Reject missing run id | Stop run |
| 2 | Record discovery and verification | Scout | [RecordGrantRunEvent](operations.md#recordgrantrunevent) | Ask operator decision | Preserve residue | Stop pursuit |
| 3 | Operator go/no-go | Operator | [RecordGrantRunEvent](operations.md#recordgrantrunevent) | Emit RFA dissection | Stop run | Preserve decision source |
| 4 | Preflight and gate | Logician | [RecordGrantRunEvent](operations.md#recordgrantrunevent) | Draft may begin | Block traversal | Emit evidence gap |
| 5 | Draft/review/score/map | Scribe, Editor, Judge | [RecordGrantRunEvent](operations.md#recordgrantrunevent) | Gate and signoff | Revise or block | Preserve revision edge |
| 6 | Delivery | Operator | [RecordGrantRunEvent](operations.md#recordgrantrunevent) | Outcome tracking begins | No delivery | Keep run as paused or blocked |
| 7 | Outcome event capture | GoldenQuill/operator | [RecordOutcomeEvent](operations.md#recordoutcomeevent) | Lifecycle projection | Reject source-less event | Preserve source gap |
| 8 | KPI projection | Metrics | [ComputeKpiObservation](operations.md#computekpiobservation) | Candidate generation allowed | Reject denominatorless metric | Preserve metric gap |
| 9 | Candidate creation | Validator/operator | [CreatePromotionCandidate](operations.md#createpromotioncandidate) | Governance projection | Reject unsafe candidate | Preserve residue |
| 10 | Governance validation | Ontology Vault layer | [ValidatePromotionGovernance](operations.md#validatepromotiongovernance) | Privacy gate or owner decision | Candidate blocked/rejected | Preserve blockers |
| 11 | Privacy gate | Privacy layer/operator | [RedactionGeneralizationGate](operations.md#redactiongeneralizationgate) | Owner decision may proceed | Candidate remains org-scoped | Preserve private residue |
| 12 | Owner decision | Owner/operator | [RecordOwnerDecision](operations.md#recordownerdecision) | Approved/rejected/retired/contradicted | Decision rejected | Return to decision pending |

### Invariants

| ID | Invariant | Formal |
| --- | --- | --- |
| W-I1 | No source-less outcome event enters KPI or candidate generation. | `RecordOutcomeEvent.failed -> no downstream KPI/candidate` |
| W-I2 | No KPI creates approved reuse directly. | `KPI -> candidate_allowed and promotion_forbidden` |
| W-I3 | No workspace-safe reuse from org-scoped feedback without privacy gate and owner decision. | `workspace_reuse -> generalized and owner_approved` |
| W-I4 | No production mutation in L0. | `L0 -> no org_vault_write and no card_write and no dashboard_write` |

## PromotionAuthorityPolicy

**Type:** Policy
**Applies To:** [CreatePromotionCandidate](operations.md#createpromotioncandidate), [ValidatePromotionGovernance](operations.md#validatepromotiongovernance), [RecordOwnerDecision](operations.md#recordownerdecision)
**Trigger Conditions:** Any outcome event, KPI observation, feedback signal, or gate result proposes reusable learning.

### Decision Table

| Condition | Selected Behavior | Notes |
| --- | --- | --- |
| Source event is missing | Reject candidate generation | No grant truth from prose, dashboard label, or memory. |
| KPI lacks denominator definition | Reject KPI and candidate path | Denominator semantics are required. |
| Candidate includes `approved_allowed_uses` | Reject candidate | Approved uses live only on owner decision. |
| Candidate lacks contradiction path | Block promotion governance | Future counterevidence must be possible. |
| Candidate contains org-scoped feedback | Keep org-private unless redaction/generalization and owner approval pass | Prevents cross-client leakage. |
| Ontology Vault projection passes | Ask owner decision | Projection is still not mutation. |
| Owner approves | Record approved allowed uses on [OwnerDecision](domain.md#ownerdecision) | This is the first point where approved reuse exists. |

### Formula

```text
candidate_may_reach_owner =
  has_source_evidence
  and has_review_gate
  and has_contradiction_path
  and kpi_denominators_resolved
  and (not org_scoped_feedback or redaction_generalization_passed)
```

## EvidenceStatePolicy

**Type:** Policy
**Applies To:** [RecordOutcomeEvent](operations.md#recordoutcomeevent), [ComputeKpiObservation](operations.md#computekpiobservation), [ApplicationLifecycleState](states.md#applicationlifecyclestate)
**Trigger Conditions:** Any grant status, outcome, review feedback, award, decline, report, closeout, or dashboard observation is interpreted.

### Decision Table

| Condition | Selected Behavior | Notes |
| --- | --- | --- |
| Portal validates package | Advance application stage only | Does not mean agency review or final outcome. |
| Agency retrieves application | Advance lifecycle and feed cycle-time metrics | Does not prove proposal quality. |
| Review feedback arrives | Record source-backed feedback and possible org-scoped candidate | Feedback is not funding validation. |
| Award arrives | Record final outcome and amount realization metrics | Award does not validate every proposal claim. |
| Decline arrives | Record final outcome and review/strategy learning candidates | Decline is not automatic writing failure. |
| Report accepted or award closed out | Record stewardship and retention learning | Post-award success remains source-scoped. |

### Formula

```text
grant_truth =
  source_truth
  + application_stage
  + final_outcome
  + validation_state
  + interpretation_limits
```
