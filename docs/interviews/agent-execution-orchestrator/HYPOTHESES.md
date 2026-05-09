# Hypotheses

## Hypothesis Register

| ID  | Proposition                                                                                                                                      | Expected Effect                                                                           | Confidence | Status   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------- | -------- |
| H1  | If run lifecycle is formalized as a state machine with explicit completion signals and idle-timeout guards, suspected-stuck rate will decrease.  | Reduce `suspected_stuck_rate` by at least 40% from baseline window.                       | medium     | proposed |
| H2  | If every run uses isolated sandbox and worktree leases, cross-run contamination incidents will decrease without materially harming throughput.   | Reduce contamination incidents by at least 60% while keeping completion time within +15%. | medium     | proposed |
| H3  | If default branch strategy is set to `merge-to-head` for successful runs, end-to-end throughput will improve versus always-isolated branch mode. | Improve stage completion throughput by at least 20% with regression increase <= 5%.       | low        | proposed |
| H4  | If session snapshot and resume are first-class operations, retry count and manual recovery effort will decrease after watchdog events.           | Improve retry resolution rate and reduce median retry count by at least 30%.              | medium     | proposed |

## Hypothesis Details

### H1 - Explicit Run State Model

- Proposition: A formal run state machine with mandatory terminal outcomes and idle-timeout guards will materially reduce ambiguous or stuck execution outcomes.
- Decision owner: feature owner and orchestration maintainers
- Primary signal: `suspected_stuck_rate`
- Expected direction: reduce
- Current evidence: observed policy contracts define stuck and terminal outcomes but feature-level implementation is not unified
- Evidence type: observed + hypothesized
- Why this might be true: current policy spread implies lifecycle responsibilities are distributed and can produce ambiguity
- Strongest counterargument: most stuck outcomes are caused by terminal command quality, so lifecycle modeling alone may not help
- Confounders: workload mix changes, parallel stage volume, operator behavior shifts
- Disconfirming outcome: no statistically meaningful reduction in stuck rate after adopting explicit state model
- Scope notes: applies to delegated stage orchestration, not arbitrary local shell sessions

### H2 - Isolation-First Execution

- Proposition: Per-run sandbox and worktree isolation will reduce contamination defects and make recovery more deterministic.
- Decision owner: feature owner and infrastructure maintainers
- Primary signal: `cross_run_contamination_incidents`
- Expected direction: reduce
- Current evidence: user requirement and Sandcastle reference emphasize isolation as a key concern
- Evidence type: stated + hypothesized
- Why this might be true: isolation prevents residual filesystem/branch side effects across runs
- Strongest counterargument: isolation overhead can slow execution and increase operational complexity
- Confounders: provider startup variance, branch conflict frequency, artifact size
- Disconfirming outcome: contamination incidents do not fall or completion latency degrades beyond tolerance
- Scope notes: applies to orchestrated agent runs in this feature lifecycle

### H3 - Merge-To-Head Default Strategy

- Proposition: `merge-to-head` default for successful runs will balance throughput and integration quality better than always-isolated branch mode.
- Decision owner: feature owner
- Primary signal: `mean_time_to_stage_completion`
- Expected direction: improve
- Current evidence: branch strategy alternatives are defined by user-provided Sandcastle summary
- Evidence type: stated + hypothesized
- Why this might be true: reducing manual integration steps can shorten cycle time
- Strongest counterargument: direct merge pressure can increase regressions and drift
- Confounders: feature complexity, reviewer load, parallel branch contention
- Disconfirming outcome: throughput gain is negligible or regression rate rises above threshold
- Scope notes: strategy may vary by stage type (implement vs review)

### H4 - Session Capture And Resume

- Proposition: Deterministic session snapshot/resume will reduce manual recovery and repeated retries after interruptions.
- Decision owner: feature owner and operators
- Primary signal: `retry_resolution_rate`
- Expected direction: improve
- Current evidence: resume capability is a stated reference requirement from Sandcastle summary; no local feature baseline yet
- Evidence type: stated + hypothesized
- Why this might be true: resume avoids full restart and preserves partial progress
- Strongest counterargument: snapshot inconsistency can create false confidence and failed resumes
- Confounders: snapshot completeness, external provider state, timeout tuning
- Disconfirming outcome: resumes fail frequently or do not reduce retries/recovery effort
- Scope notes: applies only when interrupted runs have valid snapshot payloads

## Prioritization

| Hypothesis ID | Value If True | Cost To Test | Risk If Wrong | Priority |
| ------------- | ------------- | ------------ | ------------- | -------- |
| H1            | high          | medium       | high          | now      |
| H2            | high          | medium       | high          | now      |
| H3            | medium        | medium       | medium        | later    |
| H4            | medium        | medium       | medium        | now      |
