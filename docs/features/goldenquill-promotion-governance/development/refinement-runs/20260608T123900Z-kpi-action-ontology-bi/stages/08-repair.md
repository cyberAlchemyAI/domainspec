---
stage: s8-distill-repair
owner: distill
mode: validate
status: pass
---

# Repair

## Repairs Applied To Design

| Issue | Repair |
| --- | --- |
| Temporal leakage | `KpiResponseWindow` requires anchor action refs, baseline ref, response ref, and start/end bounds. |
| Missingness and pending outcomes | Method registry requires missingness and censoring bias checks. |
| Small-sample overclaiming | L0 methods limited to descriptive, funnel, sequence, and time-to-event summaries. |
| Multiple exploratory scans | Association output must record bias notes and residue for multiple comparisons. |
| Ontology overpromotion | Analytics output becomes `BIInsightCandidate`, never approved reuse. |
| Privacy leakage | Scope, redaction/generalization, and owner decision remain required before future context hydration. |

## Validated Boundary

```text
ActionKpiAssociation != BIInsightCandidate
BIInsightCandidate != ApprovedReusePacket
ApprovedReusePacket != automatic action
```

## Remaining Residue

- Exact minimum observation thresholds need calibration after first fixture data.
- Production causal claims need future study design and treatment-selection logs.
- Dashboard UX is out of scope for this refine run.
