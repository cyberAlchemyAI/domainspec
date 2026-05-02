# V1 Full Pipeline Implementation Plan: Knowledge Graph Visualization

## Goal

Implement V1 Capability Atlas Board end-to-end through the full DomainSpec pipeline, from implementation to verification, while keeping existing V2 and V3 docs intact.

## Scope

- In scope:
  - V1 capability implementation from existing contracts
  - Backend implementation for V1 query and interface obligations
  - UI implementation for V1 atlas, neighborhood preview, and concept inspector
  - Observability instrumentation and verification
  - Infra sync, registry sync, and final readiness verify
- Out of scope:
  - New V2 and V3 capability behavior
  - V2 and V3 contract rewrites

## Baseline Inputs

Required existing artifacts (already present):

- `SPEC.md`
- `STORIES.md`
- `TEST-SPEC.md`
- `DECISIONS.md`
- `decisions.en.md`
- `capabilities/v1-capability-atlas-board.md`
- `PIPELINE-WAVE-EXECUTION-PLAN.md`

## Command Route

Default route (recommended):

```text
@domainspec-orchestrator domainspec-orchestrate "run full pipeline for knowledge-graph-visualization focused on V1 Capability Atlas Board implementation"
```

Advanced direct route:

```text
@domainspec-planner domainspec-pipeline knowledge-graph-visualization
```

## Execution Waves

Use this per-wave structure during execution:

- Objective
- Inputs
- Runbook
- Expected outputs
- Validation checks
- Gate decision

## Wave 0: Pre-flight and Gate Readiness

Objective:

- Confirm all hard gates and runtime prerequisites before any mutation stages.

Inputs:

- `DECISIONS.md`
- `decisions.en.md`
- `docs/shared/governance-baseline.md`
- `capabilities/v1-capability-atlas-board.md`
- `queries.md`
- `interfaces.md`
- `mappings.md`

Runbook:

1. Confirm decision gate is resolved from `DECISIONS.md`.
2. Confirm governance baseline exists in `docs/shared/governance-baseline.md`.
3. Confirm V1 contracts are stable and unchanged in semantic scope:
   - `capabilities/v1-capability-atlas-board.md`
   - `queries.md`
   - `interfaces.md`
   - `mappings.md`
4. Confirm implementation target workspace exists for both layers:

- Backend runtime (for API/query implementation)
- Frontend runtime (for atlas/neighborhood/inspector screens)

5. Record Wave 0 status in `PIPELINE-REPORT.md` before continuing.

Expected outputs:

- Wave 0 status note in `PIPELINE-REPORT.md`
- Confirmed go/no-go checklist for backend and UI execution

Validation checks:

- Decision table contains no unresolved blocker items.
- Governance baseline file exists.
- V1 core contracts are linkable and internally coherent.

Gate decision:

- Decision gate status is resolved.
- Runtime implementation layers are available for backend and UI steps.
- If either condition fails: BLOCK and stop before Wave 1.

## Wave 1: V1 Contract Refresh Lock

Objective:

- Re-sync V1 contracts, stories, and tests so implementation starts from a deterministic baseline.

Inputs:

- `SPEC.md`
- `STORIES.md`
- `TEST-SPEC.md`
- `capabilities/v1-capability-atlas-board.md`
- `DECISIONS.md`

Runbook:

1. Refresh spec details without changing V2/V3 semantics:

```text
@domainspec-spec-writer domainspec-spec-feature knowledge-graph-visualization --update
```

2. Regenerate stories from updated docs:

```text
@domainspec-story-sync domainspec-sync-user-stories knowledge-graph-visualization
```

3. Regenerate tests and keep V1 must-pass subset explicit:

```text
@domainspec-test-designer domainspec-generate-tests knowledge-graph-visualization
```

4. Review generated changes and confirm that V1 remains primary implementation scope.
5. Add Wave 1 result summary to `PIPELINE-REPORT.md`.

Expected outputs:

- Updated `SPEC.md` (if needed)
- Updated `STORIES.md` (if needed)
- Updated `TEST-SPEC.md` (if needed)
- Wave 1 status note in `PIPELINE-REPORT.md`

Validation checks:

- V1 stories map to V1 queries and concepts.
- `TEST-SPEC.md` still contains explicit V1 must-pass obligations.
- No unintended capability regressions in V2 or V3 sections.

Gate decision:

- `SPEC.md`, `STORIES.md`, and `TEST-SPEC.md` are synchronized.
- V1 obligations remain deterministic and traceable.
- If contract/test drift is unresolved: FLAG and resolve before Wave 2.

## Wave 2: Backend Implementation (V1)

Objective:

- Implement backend behavior for V1 atlas, neighborhood, and concept inspector contracts.

Inputs:

- `TEST-SPEC.md`
- `queries.md`
- `interfaces.md`
- `mappings.md`
- `capabilities/v1-capability-atlas-board.md`

Runbook:

1. Implement backend from V1 contracts and tests:

```text
@domainspec-implementer domainspec-implement knowledge-graph-visualization
```

2. Validate infra binding gate after implementation (pipeline Step 5b).
3. Ensure V1 endpoint/query coverage includes:

- Feature atlas retrieval
- Capability neighborhood retrieval (depth = 1)
- Concept inspector retrieval with evidence links

4. Ensure implementation tests cover contract, mapping, and acceptance obligations.
5. Add Wave 2 outcome and evidence to `PIPELINE-REPORT.md`.

Expected focus:

- Read API handlers for V1 atlas, neighborhood, and concept inspector
- Query and mapping implementations for V1 contracts
- Backend tests mapped to V1 test obligations

Expected outputs:

- Backend implementation artifacts for V1 contracts
- Backend test artifacts mapped to V1 obligations
- Wave 2 status note in `PIPELINE-REPORT.md`

Validation checks:

- Backend compiles and test suite executes for V1 obligations.
- No production-path stubs remain for runtime bindings.
- Step 5b infrastructure binding checks pass.

Gate decision:

- Backend compile and tests pass for V1 obligations.
- No production-path stub repository bindings remain.
- If compile/test/binding fails: BLOCK and fix before Wave 3.

## Wave 3: UI Implementation (V1)

Objective:

- Deliver V1 user-facing experience for atlas navigation, neighborhood preview, and concept inspection.

Inputs:

- `capabilities/v1-capability-atlas-board.md`
- `STORIES.md` (V1 stories)
- `interfaces.md` (V1 read endpoints)
- Backend outputs from Wave 2

Runbook:

1. Ensure UI architecture constitution exists (if missing):

```text
@domainspec-ui-architect domainspec-ui-architecture
```

2. Run UI pipeline for feature implementation:

```text
@domainspec-ui-architect domainspec-ui-pipeline knowledge-graph-visualization
```

3. Confirm implementation coverage for V1 UI surface:

- Atlas board with feature and capability cards
- Neighborhood preview bounded to one hop
- Concept inspector with source evidence links

4. Ensure UI tests and audit evidence are captured in pipeline outputs.
5. Add Wave 3 status and audit result to `PIPELINE-REPORT.md`.

Expected focus:

- V1 atlas board view
- Capability neighborhood panel (depth = 1)
- Concept inspector panel with evidence links

Expected outputs:

- UI implementation artifacts for V1 pages/components
- UI test and audit outputs
- Wave 3 status note in `PIPELINE-REPORT.md`

Validation checks:

- UI behavior matches V1 capability acceptance checks.
- UI audit result is PASS or acceptable FLAG with remediation plan.
- No V1 contract violations against read API responses.

Gate decision:

- UI contracts satisfy V1 acceptance checks.
- UI audit does not return BLOCK.
- If UI audit or acceptance checks fail: BLOCK and fix before Wave 4.

## Wave 4: Observability and Infra

Objective:

- Make V1 implementation observable and operationally deployable.

Inputs:

- Backend implementation outputs (Wave 2)
- UI/interaction flows (Wave 3)
- Feature docs used by observability derivation rules

Runbook:

1. Ensure feature observability spec exists or is refreshed (`observability.md`, pipeline Step 7a).
2. Instrument OTel from feature docs:

```text
@domainspec-planner domainspec-instrument-otel knowledge-graph-visualization
```

3. Verify instrumentation coverage:

```text
@domainspec-planner domainspec-otel-verify knowledge-graph-visualization
```

4. Sync infra monitoring artifacts:

```text
@domainspec-infra-architect domainspec-infra-deploy knowledge-graph-visualization
```

5. Capture Wave 4 observability and infra results in `PIPELINE-REPORT.md`.

Expected outputs:

- `observability.md`
- `OBSERVABILITY-REPORT.md`
- Infra monitoring artifacts (prometheus/alerts updates when applicable)
- Wave 4 status note in `PIPELINE-REPORT.md`

Validation checks:

- OTel verify report has no unresolved blocking gaps.
- Instrumentation is mapped to declared feature rules.
- Infra sync validation passes.

Gate decision:

- `OBSERVABILITY-REPORT.md` exists with no blocking gaps.
- Infra sync validation passes.
- If observability or infra checks fail: FLAG/BLOCK and fix before Wave 5.

## Wave 5: Registry and Final Verify

Objective:

- Finalize cross-feature catalog consistency and obtain final readiness verdict.

Inputs:

- All prior wave outputs
- `PIPELINE-REPORT.md`

Runbook:

1. Sync registry and glossary:

```text
@domainspec-registry-sync domainspec-sync-registry
```

2. Run readiness verification:

```text
@domainspec-verifier domainspec-verify-feature knowledge-graph-visualization
```

3. Run complete pipeline consolidation pass:

```text
@domainspec-planner domainspec-pipeline knowledge-graph-visualization
```

4. Update final verdict and unresolved items (if any) in `PIPELINE-REPORT.md`.

Expected outputs:

- Updated `docs/registry.md`
- Updated `docs/glossary.md`
- Final verification evidence
- Consolidated `PIPELINE-REPORT.md` verdict

Validation checks:

- Registry/glossary include feature concepts correctly.
- Verify-feature verdict is PASS (or explicit remediation list if FLAG/BLOCK).
- Pipeline consolidation run confirms stage coherence.

Gate decision:

- Final verdict is PASS.
- V1 implementation evidence is complete across docs, backend, UI, and observability.
- If final verdict is not PASS: keep pipeline open and execute recovery path.

## Wave Status Board

| Wave | Name                          | Owner         | Status                   | Evidence                                                                                                                                                                                              |
| ---- | ----------------------------- | ------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Pre-flight and Gate Readiness | platform-core | PASS                     | `backend/` and `apps/web` runtime layers scaffolded; workspace install and type checks passed                                                                                                         |
| 1    | V1 Contract Refresh Lock      | platform-core | PASS (manual-equivalent) | Attempted `domainspec-pipeline knowledge-graph-visualization --test-only`; shell runtime missing specialist CLI, Wave 1 contract refresh/sync/derivation checks completed with deterministic evidence |
| 2    | Backend Implementation (V1)   | platform-core | pending                  | Ready to execute                                                                                                                                                                                      |
| 3    | UI Implementation (V1)        | platform-core | pending                  | Ready to execute                                                                                                                                                                                      |
| 4    | Observability and Infra       | platform-core | pending                  | Ready to execute                                                                                                                                                                                      |
| 5    | Registry and Final Verify     | platform-core | pending                  | Ready to execute                                                                                                                                                                                      |

Execution updates (2026-05-02):

- Initial wave run stopped at Wave 0 due missing runtime layers.
- Unblock remediation completed: runtime layers scaffolded and validated with `pnpm check`.
- Wave 1 Contract Refresh Lock executed in manual-equivalent test-only mode; V1 contracts stayed synchronized and V2/V3 semantics were preserved.
- Wave 2 can proceed from existing artifacts without additional Wave 1 mutations.

## Deliverables Checklist

- `PIPELINE-REPORT.md` with full-lifecycle PASS evidence
- Backend implementation and tests for V1 API/query contracts
- UI implementation and audit output for V1 atlas flows
- `observability.md` and `OBSERVABILITY-REPORT.md`
- Updated `docs/registry.md` and `docs/glossary.md`
- Verification verdict from `domainspec-verify-feature`

## Recovery Path (if FLAG or BLOCK)

1. Resolve the first blocking stage only.
2. Re-run that stage command.
3. Re-run `domainspec-verify-feature knowledge-graph-visualization`.
4. Re-run full pipeline command as final consolidation.

Do not continue to later stages while an earlier stage remains BLOCK.
