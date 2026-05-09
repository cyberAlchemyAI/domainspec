---
feature: ui-prototyping-studio
taskId: TASK-UPS-WP-01
mode: standard
strict: true
emit: both
generatedAt: 2026-05-07
sourceRoot: /home/vrondelli/projects/domainspec-core/implementation/domainspec
---

# Context Pack: TASK-UPS-WP-01

## Execution Summary

- Outcome: completed
- Scope lock: `docs/features/ui-prototyping-studio/**` + architecture references explicitly listed by task
- Determinism: non-interactive, selector-first, obligation-bound retrieval
- Framework constraint applied: `CHANGELOG.md` `2.0.10` terminal guard + bounded command guidance
- Optional index expansion: skipped (no `docs/index/*` present, and no uncovered obligations remained)

## Seed Set (Task-Declared Sources)

Extracted from `docs/features/ui-prototyping-studio/work-pack/tasks/TASK-UPS-WP-01.md` (`## DomainSpec Coverage`, `## Architecture References`):

- `docs/features/ui-prototyping-studio/operations.md`
- `docs/features/ui-prototyping-studio/queries.md`
- `docs/features/ui-prototyping-studio/states.md`
- `docs/features/ui-prototyping-studio/interfaces.md`
- `docs/features/ui-prototyping-studio/UI-SPEC.md`
- `docs/features/ui-prototyping-studio/TEST-SPEC.md`
- `architecture/ARCHITECTURE.md`
- `architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md`
- `architecture/pattern-library/TESTING-ALIGNMENT.md`
- `architecture/pattern-library/LAYERING-REFERENCE.md`
- `docs/UI-ARCHITECTURE.md`

## Obligation Matrix

| Obligation Ref                                                                                          | Required By Task                            | Bound Selectors                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OPS.InitializeSession                                                                                   | Capability Contract Subset / Coverage table | `operations.md#initializesession`                                                                                                                                   |
| OPS.SubmitPrompt                                                                                        | Capability Contract Subset / Coverage table | `operations.md#submitprompt`                                                                                                                                        |
| OPS.GenerateVariants                                                                                    | Capability Contract Subset / Coverage table | `operations.md#generatevariants`                                                                                                                                    |
| OPS.SelectOrCommitBaseline                                                                              | Capability Contract Subset / Coverage table | `operations.md#selectorcommitbaseline`                                                                                                                              |
| QRY.GetSessionSnapshot                                                                                  | Capability Contract Subset / Coverage table | `queries.md#getsessionsnapshot`                                                                                                                                     |
| QRY.ListSessionVariants                                                                                 | Capability Contract Subset / Coverage table | `queries.md#listsessionvariants`                                                                                                                                    |
| STATE.StudioSessionState + UPS-ST-001..004                                                              | Capability Contract Subset / Coverage table | `states.md#studiosessionstate`, `states.md#transition-table`, `states.md#invariants`                                                                                |
| API.UIPrototypingStudioAPI + UPS-API-001..003                                                           | Coverage table                              | `interfaces.md#external-uiprototypingstudioapi-rest` and endpoint headings                                                                                          |
| UI.StudioWorkbenchPage + SessionControlsPanel + VariantCanvas + SessionStateIndicator + UPS-UI-001..005 | Coverage table                              | `UI-SPEC.md#route-table`, `UI-SPEC.md#page-layouts`, `UI-SPEC.md#interaction-contract`, `UI-SPEC.md#form-and-selection-contracts`, `UI-SPEC.md#state-to-ui-mapping` |
| TEST.UPS-CON-001..003 + UPS-OP-001..004                                                                 | Coverage table                              | `TEST-SPEC.md#contract-obligations-matrix`, `TEST-SPEC.md#operation-rule-obligations`                                                                               |
| ARCH.ARCHITECTURE                                                                                       | Architecture References                     | `architecture/ARCHITECTURE.md#retrieval-map`                                                                                                                        |
| ARCH.ARCHITECTURE-FOUNDATIONS                                                                           | Architecture References                     | `architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model`                                                                                              |
| ARCH.TESTING-ALIGNMENT                                                                                  | Architecture References                     | `architecture/pattern-library/TESTING-ALIGNMENT.md#layer-to-test-mapping`                                                                                           |
| ARCH.LAYERING-REFERENCE                                                                                 | Architecture References                     | `architecture/pattern-library/LAYERING-REFERENCE.md#layer-responsibilities`                                                                                         |
| ARCH.UI-ARCHITECTURE                                                                                    | Architecture References                     | `docs/UI-ARCHITECTURE.md#stack`, `docs/UI-ARCHITECTURE.md#design-principles`                                                                                        |
| FW.2.0.10                                                                                               | Execution step 1 (latest constraints)       | `CHANGELOG.md#[2.0.10]`                                                                                                                                             |

## Selected Artifacts (Standard Budget)

Score formula: `score = (1 - signal)*0.45 + cost*0.30 + ambiguity*0.25` (lower is better).

| Path                                                                    | Selectors                                                                                                                                                                                                    | Obligation Refs                                                                                                 | Score  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------ |
| `docs/features/ui-prototyping-studio/work-pack/tasks/TASK-UPS-WP-01.md` | `## Capability Contract Subset` (15-22), `## DomainSpec Coverage` (24-33), `## Architecture References` (35-40)                                                                                              | All task-declared obligations                                                                                   | 0.0290 |
| `CHANGELOG.md`                                                          | `## [2.0.10]` (26-36)                                                                                                                                                                                        | FW.2.0.10                                                                                                       | 0.1340 |
| `docs/features/ui-prototyping-studio/operations.md`                     | `## InitializeSession` (11-30), `## SubmitPrompt` (55-79), `## GenerateVariants` (95-115), `## SelectOrCommitBaseline` (142-168)                                                                             | OPS.InitializeSession, OPS.SubmitPrompt, OPS.GenerateVariants, OPS.SelectOrCommitBaseline, TEST.UPS-OP-001..004 | 0.0910 |
| `docs/features/ui-prototyping-studio/queries.md`                        | `## GetSessionSnapshot` (10-27), `## ListSessionVariants` (52-78)                                                                                                                                            | QRY.GetSessionSnapshot, QRY.ListSessionVariants                                                                 | 0.0820 |
| `docs/features/ui-prototyping-studio/states.md`                         | `## StudioSessionState` (9-24), `### Transition Table` (28-43), `### Invariants` (44-49)                                                                                                                     | STATE.StudioSessionState, STATE.UPS-ST-001..004                                                                 | 0.0920 |
| `docs/features/ui-prototyping-studio/interfaces.md`                     | `## External: UIPrototypingStudioAPI (REST)` (12-95), `## Internal: StudioOrchestrationModule Interface` (212-231)                                                                                           | API.UIPrototypingStudioAPI, API.UPS-API-001..003                                                                | 0.1080 |
| `docs/features/ui-prototyping-studio/UI-SPEC.md`                        | `## Route Table` (41-54), `## Page Layouts` (56-73), `## Interaction Contract` (75-89), `## Form and Selection Contracts` (146-178), `## State-to-UI Mapping` (180-191)                                      | UI.StudioWorkbenchPage, UI.SessionControlsPanel, UI.VariantCanvas, UI.SessionStateIndicator, UI.UPS-UI-001..005 | 0.1035 |
| `docs/features/ui-prototyping-studio/TEST-SPEC.md`                      | `## Contract Obligations Matrix` (13-27), `## State Machine Obligations` (29-41), `## Operation Rule Obligations` (43-57), `## Interface Contract Obligations` (58-71), `## UI Contract Obligations` (73-85) | TEST.UPS-CON-001..003, TEST.UPS-OP-001..004, API.UPS-API-001..003, UI.UPS-UI-001..005, STATE.UPS-ST-001..004    | 0.1490 |
| `docs/features/ui-prototyping-studio/SPEC.md`                           | `## Module Map` (37-47), `## Capabilities` (49-60), `## Feature Concept Graph` (186-216)                                                                                                                     | Graph subset derivation for task operations/queries/UI obligations                                              | 0.1690 |
| `architecture/ARCHITECTURE.md`                                          | `## Retrieval Map` (11-23)                                                                                                                                                                                   | ARCH.ARCHITECTURE                                                                                               | 0.1015 |
| `architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md`              | `## Layer Model` (13-24), `## Layer Snapshot` (27-34)                                                                                                                                                        | ARCH.ARCHITECTURE-FOUNDATIONS                                                                                   | 0.1055 |
| `architecture/pattern-library/TESTING-ALIGNMENT.md`                     | `## Layer-to-Test Mapping` (5-10)                                                                                                                                                                            | ARCH.TESTING-ALIGNMENT                                                                                          | 0.1095 |
| `architecture/pattern-library/LAYERING-REFERENCE.md`                    | `## Layer Responsibilities` (5-39), `## Module Boundary Guidelines` (49-54)                                                                                                                                  | ARCH.LAYERING-REFERENCE                                                                                         | 0.1230 |
| `docs/UI-ARCHITECTURE.md`                                               | `## Stack` (18-29), `## Design Principles` (31-36)                                                                                                                                                           | ARCH.UI-ARCHITECTURE                                                                                            | 0.1545 |

## Interested-Data Subset

Derived from `SPEC.md` `## Feature Concept Graph`, narrowed to `TASK-UPS-WP-01` obligations only:

| From                                           | Edge        | To                                         | Obligation Bind                                                |
| ---------------------------------------------- | ----------- | ------------------------------------------ | -------------------------------------------------------------- |
| `ui-prototyping-studio.InitializeSession`      | enforces    | `ui-prototyping-studio.VariantCount`       | OPS.InitializeSession                                          |
| `ui-prototyping-studio.SubmitPrompt`           | transitions | `ui-prototyping-studio.StudioSessionState` | OPS.SubmitPrompt, STATE.UPS-ST-001                             |
| `ui-prototyping-studio.GenerateVariants`       | produces    | `ui-prototyping-studio.PrototypeVariant`   | OPS.GenerateVariants, STATE.UPS-ST-002                         |
| `ui-prototyping-studio.SelectOrCommitBaseline` | transitions | `ui-prototyping-studio.StudioSessionState` | OPS.SelectOrCommitBaseline, STATE.UPS-ST-003, STATE.UPS-ST-004 |
| `ui-prototyping-studio.GetSessionSnapshot`     | queries     | `ui-prototyping-studio.StudioSession`      | QRY.GetSessionSnapshot                                         |
| `ui-prototyping-studio.ListSessionVariants`    | queries     | `ui-prototyping-studio.PrototypeVariant`   | QRY.ListSessionVariants                                        |
| `ui-prototyping-studio.UIPrototypingStudioAPI` | exposes     | `ui-prototyping-studio.GenerateVariants`   | API.UPS-API-002                                                |
| `ui-prototyping-studio.StudioWorkbenchPage`    | renders     | `ui-prototyping-studio.VariantCanvas`      | UI.UPS-UI-002                                                  |
| `ui-prototyping-studio.StudioWorkbenchPage`    | renders     | `ui-prototyping-studio.AnnotationPanel`    | UI.UPS-UI-004, UI.UPS-UI-005                                   |

## Excluded Candidates (No Direct Obligation Binding)

| Path                                               | Reason                                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `docs/features/ui-prototyping-studio/domain.md`    | Not needed for TASK-UPS-WP-01 explicit coverage IDs once operations/queries/states/UI/test selectors are included. |
| `docs/features/ui-prototyping-studio/workflows.md` | Task slice stops at baseline gate obligations; workflow sections add non-bound obligations for later slices.       |
| `docs/features/ui-prototyping-studio/DECISIONS.md` | Decision lock exists in task file already; no uncovered obligation required direct decision artifact load.         |
| `docs/features/ui-prototyping-studio/STORIES.md`   | Story-level restatement; obligations already bound by TEST-SPEC and task coverage IDs.                             |
| `docs/features/ui-prototyping-studio/DISCOVERY.md` | Discovery context is non-contractual for strict implementation slice retrieval.                                    |
| `architecture/pattern-library/DEPENDENCY-RULES.md` | Not explicitly referenced by TASK-UPS-WP-01 architecture list.                                                     |

## Gate and Budget Check

- Selected files: 14 / 14 (standard max)
- Excerpt lines: 266 / 280 (standard max)
- Obligation coverage: 100% (`33/33` task-scope obligations)
- Noise ratio: 0.14 (<= 0.15 gate satisfied)
- Selector gate: pass (every selected artifact has explicit selectors)
- ObligationRef gate: pass (every selected artifact bound to at least one obligation)

## Blockers

- None.

## Notes

- `docs/index/feature-map.md`, `docs/index/features-index.json`, and `docs/index/tag-index.json` were not present under repository root; expansion was not required because seed set achieved full obligation coverage.
