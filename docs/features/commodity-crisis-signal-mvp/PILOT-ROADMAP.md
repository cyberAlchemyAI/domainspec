# Pilot Readiness Roadmap: Commodity Crisis Signal MVP

Date: 2026-04-23
Owner: Founding operator + documentation pipeline
Constraint: No external API services added in this phase

## Objective

Prepare the feature for pilot testing through a deterministic path:
research baseline -> decision gate -> project doc updates -> consistency sync -> verification.

## Baseline Snapshot

Current strengths:
- Domain coverage is broad and internally consistent across SPEC, STORIES, and TEST-SPEC.
- Transport-agnostic command/query ports are already defined.

Current blockers:
- BR-001: Wave 1 executable test artifacts are not yet attached.
- BR-002: Story-to-test mapping is not yet validated against runnable suites.

Consistency risk:
- Structural updates in SPEC and TEST-SPEC can drift from STORIES and interface naming unless synced explicitly.

## Dependency-Ordered Phases

| Phase | Name | Type | Depends On | Status |
| --- | --- | --- | --- | --- |
| 1 | Pilot Decision Gate | Blocker | None | Completed |
| 2 | SPEC Hardening | Blocker | 1 | Completed |
| 3 | TEST-SPEC Pilot Pack | Blocker | 2 | Completed |
| 4 | Project Doc Consistency Sync | Blocker | 3 | Completed |
| 5 | Verification and Verdict | Blocker | 4 | Completed (BLOCK) |
| 6 | Optional Non-Blockers | Non-blocker | 5 | Planned |

### Phase 1: Pilot Decision Gate

Goal:
- Resolve mandatory pilot decisions before doc edits.

Required decisions:
- Scope
- Visibility
- Policy strictness
- Rounding
- Auth gate
- Dedupe gate
- Audit metadata
- Failure policy
- Decision model
- Verification command substitution for this repository

Exit criteria:
- Decision table completed and referenced by SPEC and TEST-SPEC updates.

### Phase 2: SPEC Hardening

Goal:
- Add pilot-required structural sections to project SPEC.

Changes:
- Add `## User Stories` with explicit link and ownership statement.
- Add `## Story Coverage Matrix` in SPEC.
- Confirm capability-to-story traceability remains deterministic.

Exit criteria:
- SPEC exposes required pilot structure with no ambiguity.

### Phase 3: TEST-SPEC Pilot Pack

Goal:
- Convert broad derivation catalogue into pilot execution package.

Changes:
- Add `## Pilot Must-Pass Subset` (Wave 1).
- Add `## Story-to-Test Mapping`.
- Add `## Test Execution Checklist`.
- Add `## Blockers Register`.
- Add `## Evidence Package`.

Exit criteria:
- Wave 1 tests are explicit, sequenced, and auditable.
- Evidence and blockers are trackable without external assumptions.

### Phase 4: Project Doc Consistency Sync

Goal:
- Sync structural and naming alignment across project docs after edits.

Sync targets:
- `docs/features/commodity-crisis-signal-mvp/SPEC.md`
- `docs/features/commodity-crisis-signal-mvp/STORIES.md`
- `docs/features/commodity-crisis-signal-mvp/TEST-SPEC.md`
- `docs/features/commodity-crisis-signal-mvp/interfaces.md`

Exit criteria:
- No semantic drift inside the project doc root.

### Phase 5: Verification and Verdict

Goal:
- Produce a pilot readiness verdict from evidence.

Verification actions:
- Run markdown/frontmatter/link checks.
- Run documentation indexing/sync checks available in this repository.
- Validate consistency across SPEC, STORIES, TEST-SPEC, and interfaces.

Exit criteria:
- Verdict set to PASS, FLAG, or BLOCK.
- Open blockers include required evidence to clear.

### Phase 6: Optional Non-Blockers

Examples:
- Legacy changelog wording cleanup that references old HTTP endpoint examples.
- Additional formatting and readability improvements.
- UI E2E derivation (still deferred until UI contract is in scope).

Exit criteria:
- Optional updates do not alter pilot semantics.

## Wave 1 Must-Pass Subset (Target Envelope)

Target size: ~50 to 60 deterministic tests.

Coverage bands:
- Core state transitions and invariants.
- Core operation happy paths.
- Critical error paths (stale telemetry, invalidation, risk breaches, missing strategy modules).
- Query contract sanity checks.
- Workflow policy happy path plus key fallback branch.

## Ready-for-Pilot PASS Criteria

1. Required SPEC headings are present and traceable.
2. Required TEST-SPEC pilot sections are present and complete.
3. Wave 1 must-pass subset is explicit and story-mapped.
4. Evidence package and blockers register are present.
5. Consistency checks across project docs pass.
6. Verification checks pass with no unresolved blocker-level findings.

## Execution Snapshot (2026-04-23)

Completed artifacts:
- Phase 1: Decision gate frozen in [SPEC.md](SPEC.md#pilot-decision-gate-2026-04-23).
- Phase 2: SPEC now includes `## User Stories` and `## Story Coverage Matrix`.
- Phase 3: TEST-SPEC now includes pilot packaging sections and Wave 1 sequencing.
- Phase 4: SPEC, STORIES, TEST-SPEC, and interfaces naming is aligned around transport-agnostic command/query contracts.

Verification results:
- `npx tsx domainspec/tools/validate-doc-links.ts` -> PASS.
- `bash domainspec/tools/check_docs_sync.sh` -> PASS.

Current readiness verdict:
- BLOCK.

Open blockers for PASS:
- BR-001: Wave 1 executable test artifacts not attached yet.
- BR-002: Story-to-test mapping not yet validated against executable suite.
- Prerequisite gap: executable backend runtime surface is absent in this repository, so Wave 1 evidence cannot be produced yet.

Resolved blockers:
- BR-003: Docs-sync guard fixed by adding and syncing repository root README mirror and command reference coverage.

## Immediate Next Actions

1. Establish a minimal executable backend runtime substrate for Wave 1 test execution.
2. Execute and attach Wave 1 must-pass test evidence per TEST-SPEC sequence.
3. Validate story-to-test mapping against runnable test suites.
4. Re-run verification checks and update verdict from BLOCK to PASS when blockers are closed.
