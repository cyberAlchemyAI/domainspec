# INF-02 Telemetry Schema

## Purpose

Define invocation-level Saturn telemetry with balanced core plus governance facets.

## Record Types

1. `invocation_span`
2. `execution_event`
3. `invocation_summary`

## Common Dimensions

| Field                | Type             | Required | Description                                                     |
| -------------------- | ---------------- | -------- | --------------------------------------------------------------- |
| run_id               | string           | yes      | End-to-end pipeline/session identifier.                         |
| invocation_id        | string           | yes      | Unique invocation identifier.                                   |
| parent_invocation_id | string           | no       | Parent invocation for nested execution.                         |
| timestamp_utc        | string (RFC3339) | yes      | Event or span timestamp.                                        |
| task_id              | string           | yes      | Task reference (for example `INF-02`).                          |
| feature_or_scope     | string           | yes      | Feature or scope label for grouping.                            |
| runtime_target       | enum             | yes      | `local`, `vps`, `cloud`.                                        |
| role_context         | enum             | yes      | `po`, `stakeholder`, `qa`, `dev`, `governance-owner`, `system`. |
| objective_profile    | string           | yes      | Objective profile key from CTX-01 model.                        |

## invocation_span

| Field              | Type    | Required | Description                            |
| ------------------ | ------- | -------- | -------------------------------------- |
| span_start_utc     | string  | yes      | Span start timestamp.                  |
| span_end_utc       | string  | yes      | Span end timestamp.                    |
| duration_ms        | integer | yes      | Span duration.                         |
| status             | enum    | yes      | `success`, `flag`, `block`, `error`.   |
| error_class        | string  | no       | Error category when status is `error`. |
| tokens_in          | integer | no       | Input token count when available.      |
| tokens_out         | integer | no       | Output token count when available.     |
| estimated_cost_usd | number  | no       | Estimated execution cost.              |

## execution_event

| Field       | Type   | Required | Description                                                                         |
| ----------- | ------ | -------- | ----------------------------------------------------------------------------------- |
| event_type  | enum   | yes      | `tool-usage`, `agent-routing`, `gate-check`, `decision-selected`, `validation-run`. |
| actor       | string | yes      | Agent, tool, or policy actor.                                                       |
| action      | string | yes      | Action name (for example `run_in_terminal`).                                        |
| outcome     | enum   | yes      | `success`, `fail`, `skipped`, `blocked`.                                            |
| reason      | string | no       | Short reason for fail/skip/block.                                                   |
| payload_ref | string | no       | Reference to larger payload/log artifact.                                           |

## invocation_summary

| Field                  | Type    | Required | Description                                |
| ---------------------- | ------- | -------- | ------------------------------------------ |
| total_duration_ms      | integer | yes      | End-to-end invocation duration.            |
| tool_calls_count       | integer | yes      | Total tool invocations.                    |
| delegated_agents_count | integer | yes      | Number of delegated agents.                |
| governance_gate_result | enum    | yes      | `pass`, `flag`, `block`.                   |
| decision_count         | integer | yes      | Number of explicit decisions resolved.     |
| retry_count            | integer | yes      | Number of retries in this invocation.      |
| saturn_signal_count    | integer | yes      | Number of Saturn-relevant emitted signals. |

## Saturn Facets

These fields must be available through span or summary records:

- `cost_efficiency_score` (number)
- `governance_integrity_score` (number)
- `latency_reliability_score` (number)
- `decision_traceability_score` (number)
- `alignment_convergence_score` (number)

## Field Gap Register

| Gap ID | Missing Field                                   | Current Status | Closure Path                                           |
| ------ | ----------------------------------------------- | -------------- | ------------------------------------------------------ |
| FG-01  | objective_profile propagation                   | open           | Add objective context propagation in runtime envelope. |
| FG-02  | decision_traceability_score                     | open           | Derive from decision and gate event coverage.          |
| FG-03  | estimated_cost_usd on all runtime targets       | open           | Add target-specific cost adapters.                     |
| FG-04  | governance_integrity_score standard calculation | open           | Define in INF-03 evaluation policy.                    |
