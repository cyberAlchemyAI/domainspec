# Experiment Candidates

## Candidate Register

| ID   | Hypothesis | Intervention                                                                                                                  | Primary Signal                      | Cost   | Priority |
| ---- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------ | -------- |
| EX-1 | H1         | Introduce explicit run state machine contract in orchestration prototype and compare stuck outcomes against baseline process. | `suspected_stuck_rate`              | medium | now      |
| EX-2 | H2         | Run matched task set with isolation-first sandbox/worktree leases versus shared workspace execution.                          | `cross_run_contamination_incidents` | medium | now      |
| EX-3 | H3         | Compare branch strategies (`head`, `merge-to-head`, `branch`) over fixed run batch and measure throughput/regressions.        | `mean_time_to_stage_completion`     | medium | later    |
| EX-4 | H4         | Add session snapshot/resume path for interrupted runs and compare retries/recovery effort versus restart-only flow.           | `retry_resolution_rate`             | medium | now      |

## Candidate Details

### EX-1 - Run State Contract Pilot

- Linked hypothesis: H1
- Decision owner: feature owner
- Business question: Does explicit lifecycle modeling reduce stuck outcomes enough to justify feature investment?
- Intervention: Apply state model with terminal outcome requirement and idle-timeout guard in orchestration pilot flow.
- Target segment or scope: delegated stage runs for one feature lifecycle sample set
- Duration or observation window: 1 week or 30+ comparable stage runs
- Primary signal: `suspected_stuck_rate`
- Secondary signals: `terminal_outcome_coverage`, `retry_count_median`
- Expected effect: stuck rate decreases by at least 40% and terminal outcome coverage approaches 100%
- Disconfirming outcome: stuck rate remains near baseline or terminal coverage remains partial
- Risks: instrumentation mismatch, small sample bias, profile drift
- Preconditions: baseline telemetry extraction from delegation tuning ledger and run classification consistency
- Minimum instrumentation needed: stageRunId linkage, terminal outcomes, suspectedStuck, retryCount
- Recommended next step: run now

### EX-2 - Isolation A/B Run Set

- Linked hypothesis: H2
- Decision owner: feature owner
- Business question: Is isolation-first execution materially safer without unacceptable throughput cost?
- Intervention: Execute matched tasks in two cohorts: isolation-first sandbox/worktree leases vs shared execution path.
- Target segment or scope: medium-complexity feature stage runs in comparable workload windows
- Duration or observation window: 1 week or minimum 20 runs per cohort
- Primary signal: `cross_run_contamination_incidents`
- Secondary signals: `mean_time_to_stage_completion`, `failure_rate`
- Expected effect: contamination incidents decrease by at least 60% with completion time increase <= 15%
- Disconfirming outcome: contamination reduction is negligible or throughput penalty exceeds tolerance
- Risks: provider startup variability, branch conflict spikes, non-comparable run mix
- Preconditions: contamination incident definition and run labeling in telemetry
- Minimum instrumentation needed: sandbox/worktree mode tag, incident classification, completion timing
- Recommended next step: run now

### EX-3 - Branch Strategy Comparison

- Linked hypothesis: H3
- Decision owner: feature owner
- Business question: Which default branch strategy best balances speed and integration quality?
- Intervention: Controlled trial across `head`, `merge-to-head`, and `branch` for similar run types.
- Target segment or scope: implement and review runs with comparable task size
- Duration or observation window: 2 weeks or 15+ runs per strategy
- Primary signal: `mean_time_to_stage_completion`
- Secondary signals: merge conflict rate, regression rate, manual reconciliation effort
- Expected effect: one strategy outperforms others with acceptable regression and conflict rates
- Disconfirming outcome: no clear winner or best throughput strategy causes unacceptable quality regressions
- Risks: reviewer availability, external code churn, sample imbalance
- Preconditions: strategy tagging and consistent regression classification
- Minimum instrumentation needed: strategy tag, completion time, conflict/regression outcomes
- Recommended next step: refine hypothesis

### EX-4 - Resume Versus Restart Recovery Trial

- Linked hypothesis: H4
- Decision owner: feature owner
- Business question: Does resume support lower recovery overhead compared to restart-only recovery?
- Intervention: For interrupted runs, compare snapshot resume path against forced restart path.
- Target segment or scope: runs interrupted by watchdog or explicit cancellation in controlled sample
- Duration or observation window: 2 weeks or 25+ interrupted runs
- Primary signal: `retry_resolution_rate`
- Secondary signals: median retry count, operator recovery steps, final outcome rate
- Expected effect: resume cohort shows higher resolution rate and lower median retries
- Disconfirming outcome: resume cohort does not improve or introduces instability
- Risks: incomplete snapshots, provider state drift, resume policy ambiguity
- Preconditions: snapshot schema definition and interruption cause tagging
- Minimum instrumentation needed: interruption reason, snapshot completeness flag, resume attempt/result fields
- Recommended next step: run now

## Sequencing Notes

1. Execute EX-1 first to validate lifecycle signal quality before running larger strategy comparisons.
2. Run EX-2 in parallel with EX-1 only if cohort labeling is stable and non-overlapping.
3. Use EX-3 to close blocker B-002 before locking default branch strategy in spec.
4. Run EX-4 after snapshot schema is minimally defined to avoid false negatives.
