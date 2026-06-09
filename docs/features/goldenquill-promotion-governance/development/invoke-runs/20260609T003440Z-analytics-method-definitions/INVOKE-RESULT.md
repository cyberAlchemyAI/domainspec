---
run_id: 20260609T003440Z-analytics-method-definitions
mode: refresh
status: pass
target: docs/features/goldenquill-promotion-governance
---

# Invoke Result: Analytics Method Definitions

## Intent

Create and reference concrete implementation definitions for GoldenQuill
analytics methods that correlate grant actions with KPI movement.

## Outputs

| Output | Path |
| --- | --- |
| Analytics method registry | `analytics-methods.md` |
| Canonical doc references | `SPEC.md`, `domain.md`, `operations.md`, `mappings.md`, `observability.md`, `TEST-SPEC.md`, `glossary.md`, `architecture.md` |

## Source Signals

| Signal | Source |
| --- | --- |
| Need method implementation definitions | User request. |
| Refined architecture and method ladder | `development/refinement-runs/20260608T123900Z-kpi-action-ontology-bi/RESULT.md` |
| Analytics reviewer recommendations | `development/refinement-runs/20260608T123900Z-kpi-action-ontology-bi/subagent-receipts/analytics-methods.md` |
| Grant ops runtime fact gaps | `development/refinement-runs/20260608T123900Z-kpi-action-ontology-bi/subagent-receipts/grant-ops-data.md` |
| Ontology governance canonicalization | `development/refinement-runs/20260608T123900Z-kpi-action-ontology-bi/subagent-receipts/ontology-governance.md` |

## Decisions

- Add `analytics-methods.md` as the concrete method registry and implementation
  definition companion.
- Treat `BIInsightCandidate` as a profile of `PromotionCandidate`.
- Keep L0 methods limited to descriptive cohorts, funnel transitions, sequence
  mining, and time-to-event summaries with censoring.
- Keep statistical outputs as evidence only; owner decision remains promotion
  authority.

## Validation

- Markdown local links and anchors resolve after the invoke pass.
- Recursive markdown fence counts pass after the invoke pass.
- JSON validation is not applicable; no JSON artifact was created in this run.

## Next Route

Task Session may implement `GQ-BI-001` after this definition refresh is accepted.
