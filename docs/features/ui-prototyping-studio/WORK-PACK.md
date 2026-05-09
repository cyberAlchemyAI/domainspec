# WORK-PACK: ui-prototyping-studio

## Purpose

Planner-managed native execution manifest for UI Prototyping Studio MVP implementation and verification.

## Planner Control Fields

| Field             | Value                                                     | Notes                                                                   |
| ----------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| plannerGateStatus | pass                                                      | PASS after W0 baseline, stage matrix, directives, and seeded task files |
| complexity        | high                                                      | Cross-cutting docs, tests, backend, UI, and audit sequencing            |
| architectureWave  | W0                                                        | Mandatory first wave for architecture and governance baseline           |
| activePlanRef     | docs/features/ui-prototyping-studio/work-pack/waves/W0.md | Active architecture baseline artifact                                   |
| lastPlannedAt     | 2026-05-07T23:45:00Z                                      | ISO timestamp                                                           |
| readinessProfile  | pilot                                                     | Initial verification target profile                                     |

## Planner Gate Evidence

Status: PASS

- Manifest entrypoint created at this file.
- `work-pack/waves/W0.md` created with explicit dependency-direction and boundary exit gates.
- `work-pack/tasks/` created with mutation-capable planning tasks and seeded closure tasks.
- `Pipeline Stage Coverage` includes all canonical stages with wave mapping and status.
- `Architecture-Guided Task Directives` includes one row per mutation-capable task with exact coverage IDs and architecture links.

## Mode Resolution

- Requested mode: `native`
- Delegation mode selected: `native`
- Determinism: non-interactive planning execution using existing feature docs and locked decisions

## Discovery Path Selection

Score formula:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

| Path                     | Signal | Cost | Ambiguity | Score  |
| ------------------------ | ------ | ---- | --------- | ------ |
| links-tags-first         | 0.88   | 0.25 | 0.20      | 0.1790 |
| broad-search-first       | 0.74   | 0.60 | 0.35      | 0.3845 |
| focused-researcher-first | 0.82   | 0.50 | 0.30      | 0.3060 |
| capability-graph-first   | 0.79   | 0.42 | 0.24      | 0.2805 |

Selected path: `links-tags-first` (lowest score).

## UI Detection Gate

- HTTP endpoints in `interfaces.md`: yes
- `docs/UI-ARCHITECTURE.md`: present
- `docs/features/ui-prototyping-studio/UI-SPEC.md`: present
- Gate result: execute split flow through vertical capability slices (`TASK-UPS-WP-01/02/03`) and keep `ui-pipeline` stage as `skipped` because UI delivery is embedded in slice tasks.

## Resolved Decision Gate

| Decision          | Selected Option                                                         | Rationale                                               |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------- |
| D-001             | Use `shadcn/ui` + `Radix` + `Tailwind` for studio surfaces              | Locked MVP decision in `DECISIONS.md`                   |
| D-002             | Keep output HTML-first in MVP                                           | Preserves deterministic artifact contract               |
| D-003             | Canonical comment schema `{target,severity,intent,note}`                | Enables deterministic synthesis and validation          |
| D-004             | Auto-task generation remains draft-only until human confirmation        | Maintains governance without removing automation        |
| D-005             | Manual baseline and apply gates, auto-apply forbidden                   | Auditability and deterministic control points           |
| D-006             | `variantCount` bounded to `1..3`, default `3`, single variant committed | Bounded exploration with deterministic single-path mode |
| D-007             | Newspaper integration is adapter-only, no runtime dependency            | Reuse contract shape without runtime coupling           |
| O-001/O-002/O-003 | Kept as non-blocking post-MVP decisions                                 | Explicitly marked open and out of MVP blocker scope     |

## Task Status Board

| Task ID                | Goal                                                                                                                                      | Complexity | Assigned Waves | Gate Status           | Status      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | --------------------- | ----------- |
| UPS-WP-01              | Capability Slice 01: session start + variant generation + baseline gate with integrated backend/UI/test checkpoints and prototype proof   | high       | W1             | ready                 | completed   |
| UPS-WP-02              | Capability Slice 02: annotation + deterministic synthesis + approval gate with integrated backend/UI/test checkpoints and prototype proof | high       | W1, W2         | ready-after-UPS-WP-01 | completed   |
| UPS-WP-03              | Capability Slice 03: manual apply + revision evidence + handoff with integrated backend/UI/test checkpoints and prototype proof           | high       | W2             | ready-after-UPS-WP-02 | completed   |
| UPS-WP-VERIFY          | Execute feature verification verdict (`domainspec-verify-feature ui-prototyping-studio`)                                                  | high       | W3             | ready-after-impl      | not-started |
| UPS-WP-AUDIT-ALIGNMENT | Execute alignment audit (`domainspec-audit-alignment ui-prototyping-studio`)                                                              | high       | W3             | ready-after-impl      | blocked     |
| UPS-WP-AUDIT-LAYERING  | Execute layering audit (`domainspec-audit-layering ui-prototyping-studio`)                                                                | high       | W3             | ready-after-impl      | not-started |

## Continuous Test-As-You-Go Policy

### Per-Task Check Sequence

| Task ID   | Before Mutation (must pass)                                                                                       | After Slice (must pass)             | Evidence Capture                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| UPS-WP-01 | Execute `UPS-WP-01-CP1` command set (backend check + web check + targeted backend tests + targeted web e2e tests) | Execute `UPS-WP-01-CP2` command set | `TASK-UPS-WP-01.md` checkpoint logs plus `work-pack/evidence/UPS-WP-01/prototype-proof.md` |
| UPS-WP-02 | Execute `UPS-WP-02-CP1` command set (backend check + web check + targeted backend tests + targeted web e2e tests) | Execute `UPS-WP-02-CP2` command set | `TASK-UPS-WP-02.md` checkpoint logs plus `work-pack/evidence/UPS-WP-02/prototype-proof.md` |
| UPS-WP-03 | Execute `UPS-WP-03-CP1` command set (backend check + web check + targeted backend tests + targeted web e2e tests) | Execute `UPS-WP-03-CP2` command set | `TASK-UPS-WP-03.md` checkpoint logs plus `work-pack/evidence/UPS-WP-03/prototype-proof.md` |

Rules:

- If a targeted command reports no matched tests, treat the checkpoint as failed and BLOCK wave progression until coverage exists.
- Every mutation slice ends only after all listed after-slice commands pass.
- Every capability slice is incomplete until its prototype proof artifact exists and passes the acceptance script in the task file.
- Persist raw outputs per checkpoint under `docs/features/ui-prototyping-studio/work-pack/evidence/<TASK-ID>/<CHECKPOINT-ID>.log`.

### Wave Exit Test Gates

| Wave | Exit Condition (testing cadence)                                                                              | Required Evidence                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| W1   | UPS-WP-01 and UPS-WP-02 complete CP1/CP2/CP3 with targeted backend + web/e2e suites green                     | Checkpoint logs plus `prototype-proof.md` artifacts for UPS-WP-01 and UPS-WP-02 |
| W2   | UPS-WP-03 completes CP1/CP2/CP3 with targeted backend + web/e2e suites green                                  | Checkpoint logs plus `prototype-proof.md` artifact for UPS-WP-03                |
| W3   | Closure commands pass: `domainspec-verify-feature`, `domainspec-audit-alignment`, `domainspec-audit-layering` | Verification and audit report artifacts linked in seeded closure tasks          |

## Mandatory Closure Obligations

| Obligation           | Required Command                                   | Task Mapping           | Baseline Report              | Current State |
| -------------------- | -------------------------------------------------- | ---------------------- | ---------------------------- | ------------- |
| Feature verification | `domainspec-verify-feature ui-prototyping-studio`  | UPS-WP-VERIFY          | VERIFICATION.md              | seeded        |
| Alignment audit      | `domainspec-audit-alignment ui-prototyping-studio` | UPS-WP-AUDIT-ALIGNMENT | ALIGNMENT-REPORT.md          | seeded        |
| Layering audit       | `domainspec-audit-layering ui-prototyping-studio`  | UPS-WP-AUDIT-LAYERING  | LAYERING-ALIGNMENT-REPORT.md | seeded        |

## Architecture-Guided Task Directives

| Task ID   | DomainSpec Sources                                                            | Coverage IDs                                                                                                                                                                                                           | Architecture References                                                                                                                                                                                                                                              | Implementation Directive                                                                                                                     | Verification Evidence                                                                        |
| --------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| UPS-WP-01 | operations.md; queries.md; states.md; interfaces.md; UI-SPEC.md; TEST-SPEC.md | InitializeSession, SubmitPrompt, GenerateVariants, SelectOrCommitBaseline, GetSessionSnapshot, ListSessionVariants, UPS-ST-001..UPS-ST-004, UPS-API-001..UPS-API-003, UPS-UI-001..UPS-UI-005, UPS-CON-001..UPS-CON-003 | ../../../domainspec/ARCHITECTURE.md; ../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model; ../../../architecture/pattern-library/TESTING-ALIGNMENT.md; ../../UI-ARCHITECTURE.md                                                             | Deliver backend contracts and UI route behavior for initialization/variant/baseline capability in one slice with deterministic gate behavior | Targeted backend + web/e2e checkpoints and `work-pack/evidence/UPS-WP-01/prototype-proof.md` |
| UPS-WP-02 | operations.md; queries.md; states.md; interfaces.md; UI-SPEC.md; TEST-SPEC.md | CaptureCommentEvent, SynthesizeMutationBatch, ApproveMutationBatch, GetDraftMutationBatch, UPS-ST-005, UPS-API-004..UPS-API-006, UPS-UI-003, UPS-UI-006, UPS-UI-007, UPS-CON-004, UPS-CON-005                          | ../../../domainspec/ARCHITECTURE.md; ../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model; ../../../architecture/pattern-library/LAYERING-REFERENCE.md; ../../../architecture/pattern-library/DEPENDENCY-RULES.md; ../../UI-ARCHITECTURE.md | Deliver backend + UI annotation/synthesis/approval flow with deterministic checksum and explicit approval gating                             | Targeted backend + web/e2e checkpoints and `work-pack/evidence/UPS-WP-02/prototype-proof.md` |
| UPS-WP-03 | operations.md; queries.md; states.md; interfaces.md; UI-SPEC.md; TEST-SPEC.md | ApplyApprovedBatch, ExportDesignHandoff, ListRevisionManifest, GetHandoffBundle, UPS-ST-006, UPS-ST-008, UPS-ST-009, UPS-API-007, UPS-API-008, UPS-API-010, UPS-UI-007, UPS-UI-008, UPS-CON-006..UPS-CON-010           | ../../../domainspec/ARCHITECTURE.md; ../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model; ../../../architecture/pattern-library/LAYERING-REFERENCE.md; ../../../architecture/pattern-library/DEPENDENCY-RULES.md; ../../UI-ARCHITECTURE.md | Deliver backend + UI apply/revision/handoff capability with manual-apply guarantees and adapter-only boundary compliance                     | Targeted backend + web/e2e checkpoints and `work-pack/evidence/UPS-WP-03/prototype-proof.md` |

## Required Links

### Split mode (active)

- work-pack/tasks/TASK-UPS-WP-01.md
- work-pack/tasks/TASK-UPS-WP-02.md
- work-pack/tasks/TASK-UPS-WP-03.md
- work-pack/tasks/TASK-UPS-WP-VERIFY.md
- work-pack/tasks/TASK-UPS-WP-AUDIT-ALIGNMENT.md
- work-pack/tasks/TASK-UPS-WP-AUDIT-LAYERING.md
- work-pack/waves/W0.md

## Wave Status Board

| Wave | Objective                                                                   | Entry Gate        | Exit Gate                                                                         | Status      | Evidence                              |
| ---- | --------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| W0   | Lock architecture baseline, decision gate, and stage coverage               | WORK-PACK created | W0 baseline checks and directives completed                                       | completed   | work-pack/waves/W0.md                 |
| W1   | Execute vertical capability slices 01 and 02 (backend + UI + tests in-task) | W0 completed      | UPS-WP-01 and UPS-WP-02 CP1/CP2/CP3 pass with prototype proof artifacts published | completed   | work-pack/tasks/TASK-UPS-WP-02.md     |
| W2   | Execute vertical capability slice 03 and finalize implementation evidence   | W1 completed      | UPS-WP-03 CP1/CP2/CP3 pass with prototype proof artifact published                | completed   | work-pack/tasks/TASK-UPS-WP-03.md     |
| W3   | Execute readiness and closure audits                                        | W2 completed      | verify-feature, alignment, layering reports published                             | not-started | work-pack/tasks/TASK-UPS-WP-VERIFY.md |

## Pipeline Stage Coverage

| Stage                 | Required | Wave Mapping | Status      | Evidence                                                                                                            | Skip Reason                                                                    |
| --------------------- | -------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| plan                  | yes      | W0           | completed   | WORK-PACK.md                                                                                                        | -                                                                              |
| architecture-baseline | yes      | W0           | completed   | work-pack/waves/W0.md                                                                                               | -                                                                              |
| spec                  | yes      | W0           | completed   | SPEC.md                                                                                                             | -                                                                              |
| stories               | yes      | W0           | completed   | STORIES.md                                                                                                          | -                                                                              |
| tests                 | yes      | W1, W2       | completed   | work-pack/tasks/TASK-UPS-WP-01.md, work-pack/tasks/TASK-UPS-WP-02.md, work-pack/tasks/TASK-UPS-WP-03.md             | Executed inside capability slices with targeted backend + web/e2e checkpoints  |
| backend-implement     | yes      | W1, W2       | completed   | work-pack/tasks/TASK-UPS-WP-01.md, work-pack/tasks/TASK-UPS-WP-02.md, work-pack/tasks/TASK-UPS-WP-03.md             | Implemented inside capability slices rather than isolated backend-only wave    |
| ui-pipeline           | yes      | W1           | skipped     | UI-SPEC.md, work-pack/tasks/TASK-UPS-WP-01.md, work-pack/tasks/TASK-UPS-WP-02.md, work-pack/tasks/TASK-UPS-WP-03.md | UI-SPEC already exists; UI execution is embedded in vertical capability slices |
| observability-spec    | yes      | W2           | not-started | pending                                                                                                             | -                                                                              |
| instrument-otel       | yes      | W2           | not-started | pending                                                                                                             | -                                                                              |
| otel-verify           | yes      | W2, W3       | not-started | pending                                                                                                             | -                                                                              |
| infra-deploy          | yes      | W2, W3       | skipped     | pending                                                                                                             | docs/INFRA-ARCHITECTURE.md not present; no infra mutation in this plan scope   |
| registry-sync         | yes      | W2, W3       | not-started | pending                                                                                                             | -                                                                              |
| verify-readiness      | yes      | W3           | not-started | pending                                                                                                             | -                                                                              |
| verify-feature        | yes      | W3           | not-started | work-pack/tasks/TASK-UPS-WP-VERIFY.md                                                                               | -                                                                              |
| audit-alignment       | yes      | W3           | blocked     | work-pack/tasks/TASK-UPS-WP-AUDIT-ALIGNMENT.md                                                                      | ALIGNMENT-REPORT.md verdict BLOCK with remediation backlog                     |
| audit-layering        | yes      | W3           | not-started | work-pack/tasks/TASK-UPS-WP-AUDIT-LAYERING.md                                                                       | -                                                                              |

## Decision Lock Summary

| Decision ID | Scope      | Status   | Selected Option                                             | Source       | Date       |
| ----------- | ---------- | -------- | ----------------------------------------------------------- | ------------ | ---------- |
| D-001       | cross-task | selected | shadcn/ui + Radix + Tailwind for studio surfaces            | DECISIONS.md | 2026-05-07 |
| D-002       | cross-task | selected | HTML-first prototype artifacts in MVP                       | DECISIONS.md | 2026-05-07 |
| D-003       | cross-task | selected | Canonical comment schema                                    | DECISIONS.md | 2026-05-07 |
| D-004       | cross-task | selected | Draft-only auto-generation until human approval             | DECISIONS.md | 2026-05-07 |
| D-005       | cross-task | selected | Manual governance gates, no auto-apply                      | DECISIONS.md | 2026-05-07 |
| D-006       | cross-task | selected | `variantCount` bounded to `1..3` with committed single path | DECISIONS.md | 2026-05-07 |
| D-007       | cross-task | selected | Adapter-only newspaper compatibility                        | DECISIONS.md | 2026-05-07 |

## Blockers

No blocker-level unresolved decisions in MVP scope.

## Notes

- Feature implementation for MVP slices UPS-WP-01..03 is complete with CP logs and prototype-proof artifacts; closure audits remain seeded and deferred.
- W1/W2 execution is capability-slice based: each mutation task must include backend + UI directives, targeted test checkpoints, and a prototype proof artifact.
- `docs/index/feature-map.md`, `docs/index/features-index.json`, and `docs/index/tag-index.json` are not present; links-and-feature-doc path was used for deterministic planning.
- Revalidate planner gate before any mutation-capable stage.

## Change Log

| Date       | Change                                                                                                                                          | Author  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 2026-05-07 | Refined W1/W2 into vertical capability slices with integrated backend/UI/test checkpoints and mandatory prototype-proof evidence per slice task | Copilot |
| 2026-05-08 | Created native work-pack with W0 baseline, stage coverage, directives, and seeded closure tasks                                                 | Copilot |
| 2026-05-08 | Completed UPS-WP-02 and UPS-WP-03 implementation slices with CP1/CP2 logs and prototype-proof artifacts                                         | Copilot |
