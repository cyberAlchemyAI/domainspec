# INF-01 Output Envelope Schema

## Purpose

Define the typed runtime response envelope and validation contract for gateway outputs.

## Runtime Response Envelope

| Field           | Type              | Required | Description                                                              |
| --------------- | ----------------- | -------- | ------------------------------------------------------------------------ |
| request_id      | string            | yes      | Original request identifier.                                             |
| invocation_id   | string            | yes      | Invocation identifier from request context.                              |
| adapter_target  | enum              | yes      | `local`, `vps`, `cloud`.                                                 |
| attempt_index   | integer           | yes      | Execution attempt number.                                                |
| status          | enum              | yes      | `success`, `failed-non-retryable`, `failed-retry-exhausted`, `retrying`. |
| started_at_utc  | string (RFC3339)  | yes      | Attempt start timestamp.                                                 |
| finished_at_utc | string (RFC3339)  | yes      | Attempt finish timestamp.                                                |
| duration_ms     | integer           | yes      | Attempt duration.                                                        |
| outputs         | list(TypedOutput) | no       | Typed output list when status is success.                                |
| error           | RuntimeError      | no       | Error object when status is non-success.                                 |

Validation rules:

- `outputs` is required when `status=success`.
- `error` is required when `status!=success`.
- `request_id` and `invocation_id` must match request envelope context.

## Typed Output Model

```text
TypedOutput =
  TaskOutput | DecisionOutput | MetricOutput | ImplementedCodeOutput
```

### TaskOutput

| Field       | Type         | Required | Description                                           |
| ----------- | ------------ | -------- | ----------------------------------------------------- |
| output_type | const `task` | yes      | Typed discriminator.                                  |
| task_id     | string       | yes      | Task reference.                                       |
| task_status | enum         | yes      | `not-started`, `in-progress`, `completed`, `blocked`. |
| summary     | string       | yes      | Task update summary.                                  |

### DecisionOutput

| Field           | Type             | Required | Description          |
| --------------- | ---------------- | -------- | -------------------- |
| output_type     | const `decision` | yes      | Typed discriminator. |
| decision_id     | string           | yes      | Decision identifier. |
| selected_option | string           | yes      | Chosen option id.    |
| rationale       | string           | yes      | Decision rationale.  |

### MetricOutput

| Field        | Type           | Required | Description                   |
| ------------ | -------------- | -------- | ----------------------------- |
| output_type  | const `metric` | yes      | Typed discriminator.          |
| metric_name  | string         | yes      | Metric identifier.            |
| metric_value | number         | yes      | Metric value.                 |
| metric_unit  | string         | no       | Metric unit where applicable. |

### ImplementedCodeOutput

| Field             | Type                     | Required | Description                       |
| ----------------- | ------------------------ | -------- | --------------------------------- |
| output_type       | const `implemented_code` | yes      | Typed discriminator.              |
| artifact_path     | string                   | yes      | Changed artifact path.            |
| change_summary    | string                   | yes      | Summary of implementation update. |
| validation_result | enum                     | no       | `pass`, `flag`, `fail`.           |

## Runtime Error Model

| Field       | Type    | Required | Description                         |
| ----------- | ------- | -------- | ----------------------------------- |
| error_class | string  | yes      | Failure class used by retry policy. |
| error_code  | string  | yes      | Stable error code.                  |
| message     | string  | yes      | Human-readable error summary.       |
| retryable   | boolean | yes      | Retryability classification.        |

## Versioning

- schema_version: `inf-01-envelope-v1`
- compatibility rule: additive fields are backward-compatible; required-field removal is breaking.
