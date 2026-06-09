---
stage: s3-interrogate-define
owner: interrogation
mode: refine-review
status: pass
---

# Interrogation Review: Define

## Review Verdict

Pass with guardrails.

## Checks

| Check | Verdict | Note |
| --- | --- | --- |
| Keeps DAG authority separate from analytics | pass | `ActionFact` derives from accepted events and projection receipts. |
| Keeps KPI correlation separate from causation | pass | Claim labels separate descriptive, correlation, controlled, and quasi-causal claims. |
| Keeps BI insight separate from approved reuse | pass | `BIInsightCandidate` requires governance before packet publication. |
| Preserves org scope and privacy | pass | Action context and packet path require scope and owner approval. |
| Names measurable response windows | pass | `KpiResponseWindow` prevents invalid temporal joins. |

## Required Repairs For Design Stage

- Add explicit time ordering: action must occur before KPI response window end.
- Add negative controls or falsification fixtures for apparent action-KPI
  patterns.
- Add data maturity gates so small samples default to descriptive BI.
- Add missingness and censoring rules for pending grant outcomes.
- Add contradiction path for every reusable BI insight candidate.
