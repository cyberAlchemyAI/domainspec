# TASK-AEO-C1-01 - Prompt Contract Baseline

## Goal

Define the minimal prompt contract that the pipeline execution capability will use for deterministic stage execution.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-10 (UTC)
- Output artifacts:
  - [interfaces.md](../../interfaces.md)
  - [operations.md](../../operations.md)
  - [rules.md](../../rules.md)

## Capability Slice

| Contract Area | Required Subset                                                             |
| ------------- | --------------------------------------------------------------------------- |
| Prompt schema | Required prompt fields, type constraints, and validation rules              |
| Stage linkage | Prompt must carry `stageRunId`, stage type, and required input references   |
| Determinism   | Prompt output must be reproducible from the same stage contract and context |

## DomainSpec Coverage

| Source                                                               | Coverage IDs                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------- |
| [SPEC.md](../../SPEC.md#explicit-pipeline-route-composition)         | ExecutionPipeline, PipelineRouteTemplate, StageContract |
| [interfaces.md](../../interfaces.md#internal-routeartifactinterface) | RouteArtifactInterface                                  |
| [rules.md](../../rules.md#artifactevidenceminimum)                   | ArtifactEvidenceMinimum                                 |

## Implementation Directives

- Define a prompt artifact schema section in feature docs with required and optional fields.
- Add one valid example payload and two invalid payload examples.
- Document normalization rules for deterministic field ordering.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Completion Criteria

- Prompt contract exists and links from capability docs.
- Validation rules are explicit and testable.
- Valid/invalid examples are included.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-01.md`
- `rg -n "Prompt|schema|stageRunId|deterministic" docs/features/agent-execution-orchestrator/{interfaces.md,operations.md,rules.md}`
- `rg -n "Prompt Artifact Schema \(C1 Baseline\)|PA-VALID-01|PA-INVALID-01|PA-INVALID-02|Prompt Artifact Normalization" docs/features/agent-execution-orchestrator/{interfaces.md,operations.md}`
- `rg -n "PromptArtifactSchemaRequired|PromptArtifactDeterminism" docs/features/agent-execution-orchestrator/rules.md`

## Decision Lock

| Decision ID | Required | Status   | Note                                                            |
| ----------- | -------- | -------- | --------------------------------------------------------------- |
| D-AEO-003   | yes      | selected | Prompt contract must support standard evidence envelope mapping |
