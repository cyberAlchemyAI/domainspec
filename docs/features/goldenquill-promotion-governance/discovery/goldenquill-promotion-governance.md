---
feature: goldenquill-promotion-governance
version: current
status: complete
updatedAt: 2026-06-01
docType: discovery
sourcePacket:
  - projects/goldenquill/docs/strategy/goldenquill_promotion_governance_proposal_2026-06-01.md
  - projects/goldenquill/docs/strategy/goldenquill_promotion_governance_architecture_design_2026-06-01.md
  - projects/goldenquill/docs/strategy/goldenquill_promotion_mechanism_refresh_report_2026-06-01.md
  - projects/goldenquill/docs/strategy/goldenquill_ontology_dag_grant_research_synthesis_2026-06-01.md
  - projects/goldenquill/docs/decisions/goldenquill-promotion-mechanism-open-gaps.md
  - projects/goldenquill/docs/decisions/goldenquill-promotion-mechanism-interrogation.md
---

# Discovery: GoldenQuill Promotion Governance

This discovery artifact satisfies the DomainSpec spec-writer discovery
precondition for `goldenquill-promotion-governance`.

## Discovery Result

GoldenQuill needs a local promotion-governance feature that records what
happened in a grant run, preserves the order and gate history of the run,
captures source-backed real-world outcomes, computes evidence-safe KPI
observations, creates promotion candidates from selected validated signals, and
routes every candidate through an Ontology Vault governance layer before any
approved reuse.

The new source of truth for the feature is the DomainSpec artifact set in this
folder. Earlier GoldenQuill proposal artifacts are migration evidence only.

## Resolved Decisions

| Decision | Result |
| --- | --- |
| Promotion unit home | GoldenQuill local model with Ontology Vault as explicit governance layer. |
| First implementation location | GoldenQuill local `grant_dag` package with `promotion`, `ontology_vault`, `metrics`, and `privacy` layers. |
| Allowed uses | `PromotionCandidate` owns `proposed_allowed_uses`; `OwnerDecision` owns `approved_allowed_uses`. |
| KPI authority | Selected KPI observations may create candidates after validation; they never promote directly. |
| Feedback generalization | Feedback is org-scoped by default and becomes workspace-safe only through redaction/generalization and owner approval. |
| Stage-depth scoring | Use a global stage baseline with optional funder-family profile override. |

## Mandatory Execution DAG

The feature must preserve a grant-run execution DAG that answers:

- what happened in the grant run;
- in what order it happened;
- what gate allowed or blocked the next step.

Minimum node kinds:

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
red_team_review
logician_gate_result
operator_signoff
delivery_envelope
```

Minimum edge kinds:

```text
precedes
consumes
emits
blocked_by_gate
revised_by
approved_by
delivered_as
```

## Real-World Evidence Model

The grant model separates:

| State | Meaning |
| --- | --- |
| application stage | Where the application is in the grant process. |
| outcome event | Source-backed award, decline, withdrawal, report acceptance, closeout, or other final notification. |
| validation state | Whether a claim, KPI denominator, compliance result, or feedback interpretation was checked. |
| graph authority | The authored trace is visible first; structured edges are authoritative only after validator parity. |
| source truth | Proposal prose, dashboard labels, and staff memory do not become grant truth without a source. |

Rules:

```text
application status != outcome truth
review feedback != funding validation
award notification != post-award performance
proposal claim != source fact
dashboard KPI != promotion authority
```

## KPI Families

The feature tracks lifecycle depth, outcome evidence, quality and review
movement, strategy fit, effort and ROI, and capacity and relationship work.
Every KPI observation requires source events, denominator semantics, and
interpretation limits.

## Vocabulary Gate

Implementation-facing docs must use GoldenQuill-native terms:

- application stage;
- final outcome;
- validation state;
- evidence packet;
- source-backed event;
- grant outcome event;
- KPI observation;
- stage-depth score;
- promotion candidate;
- owner decision;
- governance layer;
- proposed allowed uses;
- approved allowed uses;
- redaction/generalization gate;
- org-scoped feedback;
- workspace-safe learning.

## Spec-Writing Instruction

Copy the governing content into the DomainSpec feature docs. Do not leave the
new spec as a reference-only wrapper over the proposal packet.
