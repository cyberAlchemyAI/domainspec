# INF-02 Aggregation Definitions

## Cadence

- Primary window: 5-minute aggregation.
- Secondary rollup: daily aggregation.

## Aggregation Keys

All metrics aggregate by:

- `objective_profile`
- `role_context`
- `runtime_target`
- `task_id`
- `status` or `governance_gate_result`

## 5-Minute Window Metrics

| Metric | Type | Definition |
| --- | --- | --- |
| invocations_total_5m | counter | Number of completed invocations in the window. |
| invocation_errors_5m | counter | Number of invocations with `status=error`. |
| p95_duration_ms_5m | histogram percentile | 95th percentile invocation duration. |
| estimated_cost_usd_5m | sum | Estimated cost sum in window. |
| tool_calls_total_5m | counter | Sum of tool calls across invocations. |
| governance_blocks_5m | counter | Count of `governance_gate_result=block`. |
| decision_events_total_5m | counter | Count of decision-selected events. |

## Daily Rollup Metrics

| Metric | Type | Definition |
| --- | --- | --- |
| invocations_total_1d | counter | Total daily invocations. |
| success_rate_1d | ratio | `success / total invocations`. |
| block_rate_1d | ratio | `governance blocks / total invocations`. |
| avg_cost_per_invocation_1d | ratio | `sum estimated cost / total invocations`. |
| alignment_convergence_score_1d | derived | Daily convergence trend signal for Saturn/ADLC tasks. |
| decision_traceability_score_1d | derived | Coverage of explicit decisions over high-risk paths. |

## Alerting Baselines

| Condition | Alert Severity | Action |
| --- | --- | --- |
| block_rate_1d > 0.20 | high | Trigger governance policy review and backlog re-rank. |
| p95_duration_ms_5m > threshold for 3 windows | medium | Trigger runtime performance investigation. |
| estimated_cost_usd_5m spike > 30 percent | medium | Trigger cost-control review for active objective profile. |
| missing required field rate > 0 | high | Trigger schema compliance remediation. |

## Data Retention

- Raw events: 30 days.
- 5-minute aggregates: 90 days.
- Daily rollups: 365 days.
