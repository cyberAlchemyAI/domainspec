# TASK-AEO-C1-02 - Deterministic Prompt Builder

## Goal

Design the prompt builder slice that creates deterministic prompt artifacts for each stage in an ordered selected stage set.

## Wave Assignment

- Primary wave: W4

## Status

completed

- Completed at: 2026-05-10 (UTC)
- Output artifacts:
  - [operations.md](../../operations.md)
  - [workflows.md](../../workflows.md)
  - [interfaces.md](../../interfaces.md)
  - [rules.md](../../rules.md)
  - [capability-sequence-lessons.md](../context/capability-sequence-lessons.md)

## Prerequisite

- [TASK-AEO-C1-01.md](TASK-AEO-C1-01.md)

## Capability Slice

| Contract Area  | Required Subset                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Builder input  | Stage contracts, `selectionPolicy`, `selectedStages`, context refs, and decision snapshot pointer |
| Builder output | Ordered prompt artifact set compliant with Task C1-01 schema and keyed by `stageRunId`            |
| Stability      | Same selected stage set and inputs yield same normalized prompt artifact set                      |

## DomainSpec Coverage

| Source                                                     | Coverage IDs              |
| ---------------------------------------------------------- | ------------------------- |
| [operations.md](../../operations.md#assemblepipelineroute) | AssemblePipelineRoute     |
| [domain.md](../../domain.md#stagecontract)                 | StageContract             |
| [domain.md](../../domain.md#pipelineroutetemplate)         | PipelineRouteTemplate     |
| [rules.md](../../rules.md#stageselectioncontract)          | StageSelectionContract    |
| [rules.md](../../rules.md#promptartifactdeterminism)       | PromptArtifactDeterminism |

## Implementation Directives

- Run decision preflight using [grill-with-docs-interviewer-inventory.md](../context/grill-with-docs-interviewer-inventory.md) before implementation work begins.
- Add an explicit build-step contract for prompt generation.
- Define stage-subset build semantics (`selectionPolicy=stage-subset`) and stage ordering expectations.
- Define required failure states for missing stage inputs.
- Define deterministic ordering for generated prompt blocks and ordered prompt artifact sets.
- Add a short "Decision Preflight Snapshot" section to this task with selected answers and rejected alternatives.
- Record one lesson entry in [capability-sequence-lessons.md](../context/capability-sequence-lessons.md) when complete.

## Decision Preflight Snapshot

Preflight source: [grill-with-docs-interviewer-inventory.md](../context/grill-with-docs-interviewer-inventory.md#decision-preflight-questions-minimum-set)

| Question                                                 | Selected Answer                                                                                                                                                                | Rejected Alternatives                                                                                                                                         | Supporting Links                                                                                                                                                                                            |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Which route selection mode applies?                      | `stage-subset` for this task's builder semantics.                                                                                                                              | `full-lifecycle` (rejected because C1-02 must prove subset handling explicitly).                                                                              | [operations.md](../../operations.md#prompt-builder-build-step-contract), [rules.md](../../rules.md#stageselectioncontract)                                                                                  |
| Which ordered stages are in scope and why this order?    | `spec -> tests -> implementation`; this is the minimum multi-stage set used for reproducibility checks and preserves template order.                                           | Unordered set or ad-hoc ordering (rejected because deterministic replay requires one canonical order).                                                        | [operations.md](../../operations.md#deterministic-reproducibility-check), [workflows.md](../../workflows.md#featurelifecyclepipelineworkflow), [rules.md](../../rules.md#multi-stage-reproducibility-check) |
| Does any selected stage require `isolated-child-run`?    | No, prompt building is a pre-execution contract step and is not a stage runtime isolation decision.                                                                            | Forcing `isolated-child-run` at build time (rejected as category mismatch with runtime execution topology).                                                   | [operations.md](../../operations.md#assemblepipelineroute), [rules.md](../../rules.md#stageruntopology)                                                                                                     |
| Which evidence fields are mandatory now versus deferred? | Mandatory now: `stageRunId`, `stageInputRefs`, `requiredArtifactRefs`, `decisionSnapshotRef`, per-stage `createdAt`. Deferred: `transcriptExcerptRef` until terminal emission. | Deferring `decisionSnapshotRef` or `stageRunId` (rejected because builder validation/failure boundaries depend on both).                                      | [interfaces.md](../../interfaces.md#prompt-builder-build-step-contract), [interfaces.md](../../interfaces.md#prompt-artifact-schema-c1-baseline), [rules.md](../../rules.md#artifactevidenceminimum)        |
| Which terminology was ambiguous and how was it resolved? | "Deterministic" resolved to normalized ordered artifact-set hash equality for identical inputs; "selected stage set" resolved to order-preserving subset of stage contracts.   | "Deterministic" interpreted as best-effort ordering only (rejected because no reproducibility proof), subset treated as unordered set (rejected by contract). | [rules.md](../../rules.md#promptartifactdeterminism), [rules.md](../../rules.md#stageselectioncontract)                                                                                                     |

### Unresolved Risks

| Risk                                                                                                                                                       | Impact                                                                                         | Current Mitigation                                                                                           | Follow-up                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Upstream callers could supply different `stageRunIdsByStage` seeds across equivalent reruns, reducing cross-run comparability even when structure matches. | Medium (reproducibility check still passes per input set, but cross-run diffs become noisier). | Contract now requires explicit `stageRunIdsByStage` input and deterministic hash checks per build input set. | Revisit in [TASK-AEO-C1-03.md](TASK-AEO-C1-03.md) when parent/stage execution identity strategy is finalized. |

## Completion Criteria

- [x] Prompt builder contract is documented with inputs and outputs.
- [x] Stage-subset input and ordering constraints are explicit.
- [x] Failure states and validation boundaries are defined.
- [x] At least one deterministic reproducibility check is documented for a multi-stage selected set.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-02.md`
- `rg -n "selectedStages|selectionPolicy|build|prompt|deterministic" docs/features/agent-execution-orchestrator/{operations.md,workflows.md,interfaces.md,rules.md}`

### Latest Verification Run (2026-05-10 UTC)

- Link checks: PASS (`OK: all markdown links resolve`) for all edited C1-02 files, including this task file.
- Targeted search evidence: PASS (matches found for all required terms across `operations.md`, `workflows.md`, `interfaces.md`, and `rules.md`; includes prompt build step, stage-subset ordering, failure states, and reproducibility-check clauses).
