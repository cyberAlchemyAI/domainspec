# Pipeline Wave Execution Plan: Knowledge Graph Visualization

## Goal

Provide a copy-paste execution plan so each wave can be run with minimal decision overhead while preserving DomainSpec pipeline gates.

## Current Baseline

- Wave 1 status: complete
- Wave 2 status: complete
- Wave 3 status: complete
- Capability pipeline run for V1 (`--test-only`): complete

Use this plan for reruns, future iterations, and implementation-stage continuation.

## Canonical Pipeline Steps (reference)

| Step       | Stage                 | Main Command                                     | Primary Output                              |
| ---------- | --------------------- | ------------------------------------------------ | ------------------------------------------- |
| Pre-flight | Scope and gate checks | `domainspec-start` (if needed)                   | Project baseline readiness                  |
| 1          | Plan                  | `domainspec-pipeline <feature>`                  | Task decomposition and risks                |
| 1b         | Decision gate         | `domainspec-decision-gate <feature>` (if needed) | Decision artifact                           |
| 2          | Spec                  | `domainspec-spec-feature <feature> --update`     | SPEC + aspect docs                          |
| 3          | Stories               | `domainspec-sync-user-stories <feature>`         | STORIES.md                                  |
| 4          | Tests                 | `domainspec-generate-tests <feature>`            | TEST-SPEC.md                                |
| 5          | Implement backend     | `domainspec-implement <feature>`                 | Backend code + tests                        |
| 5b         | Infra binding gate    | pipeline-integrated                              | Binding and migration compliance            |
| 6          | UI pipeline           | `domainspec-ui-pipeline <feature>`               | UI-SPEC + UI implementation + UI review     |
| 7a         | Observability spec    | pipeline-integrated                              | observability.md                            |
| 7b         | OTel instrumentation  | `domainspec-instrument-otel <feature>`           | Instrumented backend                        |
| 7c         | OTel verify           | `domainspec-otel-verify <feature>`               | OBSERVABILITY-REPORT.md                     |
| 7d         | Infra sync            | `domainspec-infra-deploy <feature>`              | Prometheus and alert artifacts              |
| 8          | Registry sync         | `domainspec-sync-registry`                       | docs/registry.md and docs/glossary.md       |
| 9          | Verify                | `domainspec-verify-feature <feature>`            | PASS/FLAG/BLOCK feature verdict             |
| 10         | Emit signals          | pipeline-integrated                              | docs/signals/pipeline-signals.jsonl updates |
| 11         | Observer              | pipeline-integrated                              | Fast and async observer signals             |

## One-Time Pre-Flight Checklist

Run before any wave rerun:

1. Confirm project baseline artifacts exist:
   - `docs/PROJECT-OVERVIEW.md`
   - `docs/INITIAL-DEFINITIONS.md`
   - `docs/PROJECT-DECISIONS.md`
2. Confirm governance baseline exists:
   - `docs/shared/governance-baseline.md` (preferred)
   - or `docs/shared/cash-game-management-governance.md` (compatibility)
3. Confirm no blocker decisions remain unresolved in `docs/PROJECT-DECISIONS.md`.
4. Confirm feature scope folder exists: `docs/features/knowledge-graph-visualization/`.

## Command Routes

Default route (recommended):

```text
@domainspec-orchestrator domainspec-orchestrate "run pipeline for knowledge-graph-visualization <flags>"
```

Advanced direct route:

```text
@domainspec-planner domainspec-pipeline knowledge-graph-visualization <flags>
```

## Wave Execution Packs

## Wave 1 Pack: V1 Capability Atlas Board

Primary purpose: learnability-first contracts.

Suggested run command:

```text
@domainspec-planner domainspec-pipeline knowledge-graph-visualization --test-only
```

Expected artifacts:

- `SPEC.md` (V1 sections)
- `domain.md`, `queries.md`, `interfaces.md`, `mappings.md`
- `capabilities/v1-capability-atlas-board.md`
- `STORIES.md`
- `TEST-SPEC.md`
- `WAVE1-CHECKPOINT.md`

Wave 1 gate checklist:

1. Learnability and IA review passed.
2. Concept ID consistency passed.
3. Story coverage for V1 passed.

## Wave 2 Pack: V2 Relationship Constellation Canvas

Primary purpose: analysis-first graph exploration.

Suggested run command:

```text
@domainspec-orchestrator domainspec-orchestrate "evolve knowledge-graph-visualization for V2 Relationship Constellation Canvas and run pipeline test-only"
```

Expected artifacts:

- `events.md` (V2 signals)
- `workflows.md` (V2 analysis workflows)
- `capabilities/v2-relationship-constellation-canvas.md`
- `queries.md` (V2 analysis queries)
- `mappings.md` (V2 projection mappings)
- `STORIES.md` (V2 analyst stories)
- `WAVE2-CHECKPOINT.md`

Wave 2 gate checklist:

1. Architecture and semantic review passed.
2. Canonical edge-verb audit passed.
3. Cross-feature path examples with concept IDs passed.

## Wave 3 Pack: V3 Dependency Matrix + Trace Storyboard

Primary purpose: governance and release-risk decisions.

Suggested run command:

```text
@domainspec-orchestrator domainspec-orchestrate "evolve knowledge-graph-visualization for V3 Dependency Matrix and Trace Storyboard and run pipeline test-only"
```

Expected artifacts:

- `operations.md`
- `states.md`
- `capabilities/v3-dependency-matrix-trace-storyboard.md`
- `domain.md` (feature-pair impact and exception concepts)
- `queries.md` and `interfaces.md` (matrix/storyboard contracts)
- `events.md` and `workflows.md` (governance flows)
- `STORIES.md` (V3 governance stories)
- `WAVE3-CHECKPOINT.md`

Wave 3 gate checklist:

1. Governance and readiness review passed.
2. Risk-scoring rationale passed.
3. End-to-end traceability matrix->concept/event/story passed.

## Full Delivery Pack (Implementation and Verification)

Use this after spec waves are stable.

Suggested run command:

```text
@domainspec-planner domainspec-pipeline knowledge-graph-visualization
```

Expected additional artifacts (implementation stage):

- Backend code and tests for operations and queries
- Optional UI delivery artifacts (if UI applies)
- Observability + OTel reports
- Infra sync artifacts
- Final verify verdict and signals

## Rerun Policy

Use this order for safe reruns:

1. Rerun one wave pack only.
2. Re-run that wave checkpoint.
3. Re-run `--test-only` pipeline.
4. If all gates pass, proceed to next wave or full delivery.

Do not skip checkpoints between waves.
