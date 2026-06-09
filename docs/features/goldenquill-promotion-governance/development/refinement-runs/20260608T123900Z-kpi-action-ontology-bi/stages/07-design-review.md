---
stage: s7-interrogate-design
owner: interrogation
mode: refine-design-review
status: pass
---

# Design Review

## Verdict

Pass with implementation cautions.

## Findings

| Finding | Severity | Resolution |
| --- | --- | --- |
| Action facts need source-backed lineage to events and DAG nodes. | high | `ActionFact` requires `event_ids`, `dag_node_refs`, and `source_refs`. |
| KPI windows can leak future information if anchored after the response. | high | Require action time before response window end and record baseline/response refs. |
| Small samples will tempt overclaiming. | high | Method registry defaults early methods to descriptive/correlation labels only. |
| Org-scoped data can leak through aggregate BI. | high | Require scope, redaction/generalization, minimum group thresholds, and owner decision. |
| Ontology projection could look like final truth. | medium | Use `BIInsightCandidate` and claim labels; approved reuse remains owner-owned. |

## Required Repairs

- Include missingness, censoring, and selection-bias checks in method registry.
- Add multiple-comparison residue for broad exploratory scans.
- Make `BIInsightCandidate` target owner explicit.
- Ensure approved packet carries allowed uses and confidence/limits.
