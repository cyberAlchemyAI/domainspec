---
role_id: grant-ops-data
agent_id: 019ea993-5dfa-7703-a8c9-f94618d5da5f
status: pass
---

# Subagent Receipt: Grant Ops Data

## Source Paths Read

- `SPEC.md`
- `domain.md`
- `events.md`
- `mappings.md`
- `operations.md`
- `states.md`
- `observability.md`
- `pipeline/funding_lattice/models.py`
- `pipeline/funding_lattice/projections/lattice_summary.py`
- `pipeline/nervous_system/models.py`
- `pipeline/nervous_system/event_append_boundary.py`
- `pipeline/nervous_system/event_candidate_boundary.py`
- `pipeline/nervous_system/action_registry.py`
- `pipeline/nervous_system/vault_projection_adapter.py`
- `pipeline/nervous_system/stub_projection_adapter.py`

## Findings

- `GrantWorkEvent` is the right replayable source for DAG, lifecycle, KPI,
  candidates, and reuse handoffs, with source refs, idempotency, timing, org
  scope, and interpretation limits.
- DAG projection exists for nodes, edges, and outcome events, but action facts
  are not yet first-class.
- BI needs lifecycle transition facts over time, not just current/deepest stage.
- Outcome events are source-backed, but BI needs explicit outcome fact families
  for submitted, portal validated, agency retrieved, under review, feedback
  received, awarded, declined, withdrawn, report accepted, and closed out.
- KPI response windows need durable start/end anchors, expected response
  deadline, actual response date, stale/pending state, and denominator cohort.
- Cycle cost is catalog intent but not runtime fact: labor, tool/model spend,
  rate assumptions, currency, allocation basis, and DAG-linked rollups are
  missing.
- Current projection surfaces are mostly current-state UI projections, not
  event-spine, KPI observation, lifecycle history, cost ledger, or time-series
  BI payloads.

## Recommended Deltas

- Add fact projections: `GrantActionFact`, `GrantLifecycleTransitionFact`,
  `GrantOutcomeFact`, `GrantKpiObservationFact`, `GrantCostFact`, and
  `GrantBiSnapshot`.
- Extend `GrantWorkEvent` payload families so accepted events can project to DAG
  refs, action facts, lifecycle transitions, outcome events, KPI observations,
  and cost facts.
- Define KPI response windows with `window_id`, `application_id`, `run_id`,
  `window_kind`, `start_event_id`, `end_event_id`, `opened_at`, `expected_by`,
  `closed_at`, `status`, `days_open`, `source_refs`, and
  `interpretation_limits`.
- Add cost capture: labor minutes, actor/seat, tool/model cost, external spend,
  currency, rate card/version, allocation method, cost period, and rollup grain.
- Make BI projections append/replay-friendly: immutable event journal ->
  projection receipts -> materialized facts by org, run, opportunity, funder,
  program, stage, month/quarter, and cohort.
- Keep `funding_lattice` as target/readiness context, not system of record for
  grant-run outcomes or costs.

## Blockers

- No concrete runtime data models found for the promotion-governance event spine
  contracts.
- No durable BI/time-series projection surface found for KPI response windows,
  lifecycle histories, or cycle cost.
- Current projection adapter is not connected to promotion-governance event
  spine.

## Residue

- Backfill policy must carry source locators, capture time, original occurrence
  time, idempotency key, and validation state.
- Denominator semantics remain high risk for win rate, final decision rate,
  pending rate, and response-time cohorts.
- Resubmissions and repeat funder relationships need stable cross-run linking.
- Privacy boundaries must travel into BI aggregates.

## Validation

Read-only review. Verdict: pass; grant-ops BI needs explicit runtime fact and
projection models before implementation.
