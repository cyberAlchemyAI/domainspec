# TASK-KG-IMP-05 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-05
- Mode: standard
- Strict relevance gate: on
- Framework constraints applied:
  - CHANGELOG 2.0.8: delegation profile rollout, bounded stuck-retry behavior, explicit telemetry failure surfacing.
  - CHANGELOG 2.0.4: strict selector-plus-obligation binding, interested-data subset policy, required index schema, and mode budgets.
- Files selected: 9
- Snippets selected: 32
- Excerpt lines: 226 / 280
- Noise ratio: 0.11
- Obligation coverage: 9 / 9

## Obligation Matrix

| Obligation ID | Requirement                                                                                                                               | Evidence Source                                                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1            | TASK-KG-IMP-05 remains the execution authority for coverage, directives, execution steps, completion criteria, and verification evidence. | `work-pack/tasks/TASK-KG-IMP-05.md` (`## DomainSpec Coverage`, `## Implementation Directives`, `## Execution Steps`, `## Completion Criteria`, `## Verification Evidence`) |
| O2            | Verification scope stays bound to current capability obligations, US-1..US-4, and full KG contract matrix.                                | `work-pack/tasks/TASK-KG-IMP-05.md` coverage table + `STORIES.md` + `TEST-SPEC.md`                                                                                         |
| O3            | W3 verification command and report output stay explicit and stage-bound.                                                                  | `work-pack/tasks/TASK-KG-IMP-05.md` directives + `WORK-PACK.md` mandatory closure obligations                                                                              |
| O4            | FLAG/BLOCK verdict requires owner-assigned and date-bound remediation actions.                                                            | `work-pack/tasks/TASK-KG-IMP-05.md` directives and completion criteria                                                                                                     |
| O5            | Work-pack task/stage synchronization must reflect verify-feature execution and evidence links.                                            | `WORK-PACK.md` (`## Task Status Board`, `## Pipeline Stage Coverage`)                                                                                                      |
| O6            | Architecture references remain selector-level and tied to verification behavior.                                                          | `architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model`, `architecture/pattern-library/TESTING-ALIGNMENT.md#layer-to-test-mapping`                          |
| O7            | Verification verdict semantics and TEST-SPEC coverage floor are enforced by command contract.                                             | `.github/skills/domainspec-verify-feature/SKILL.md` (`<objective>`, `<process>`, step 3a coverage gate)                                                                    |
| O8            | Interested relationship context is restricted to labels present in SPEC feature graph only.                                               | `SPEC.md#feature-concept-graph` edge column                                                                                                                                |
| O9            | Decision lock remains bound to D-KG-001, D-KG-002, D-KG-003.                                                                              | `work-pack/tasks/TASK-KG-IMP-05.md#decision-lock`                                                                                                                          |

## Included Context

- `docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-05.md`
  - Why included: primary task contract.
  - Selectors: `## DomainSpec Coverage` (line 15), `## Architecture References` (line 23), `## Implementation Directives` (line 28), `## Execution Steps` (line 34), `## Completion Criteria` (line 41), `## Verification Evidence` (line 46), `## Decision Lock` (line 55).
  - Obligation refs: O1, O2, O3, O4, O9.

- `docs/features/knowledge-graph-visualization/WORK-PACK.md`
  - Why included: planner/stage authority and verify-feature closure mapping.
  - Selectors: `## Planner Control Fields` (line 7), `## Task Status Board` (line 18), `KG-IMP-05` row (line 27), `## Mandatory Closure Obligations` (line 31), verify-feature command row (line 35), `## Wave Status Board` (line 70), `## Pipeline Stage Coverage` (line 79), verify-feature stage row (line 96).
  - Obligation refs: O3, O5.

- `docs/features/knowledge-graph-visualization/SPEC.md`
  - Why included: capability contract and feature-graph edge subset source.
  - Selectors: `## Overview` (line 10), `## Capabilities` (line 45), `### Cross-Project Documentation Scope` (line 79), `## Feature Concept Graph` (line 139).
  - Obligation refs: O2, O8.

- `docs/features/knowledge-graph-visualization/STORIES.md`
  - Why included: US-1..US-4 story authority used by verification mapping.
  - Selectors: `### US-1` (line 7), `### US-2` (line 30), `### US-3` (line 55), `### US-4` (line 78), `## Story Coverage Matrix` (line 127).
  - Obligation refs: O2.

- `docs/features/knowledge-graph-visualization/TEST-SPEC.md`
  - Why included: full KG contract matrix and acceptance/coverage sources.
  - Selectors: `## Backend Test Catalogue` (line 14), `### Capability Acceptance Obligations` (line 171), `## UI E2E Test Catalogue` (line 180), `## Coverage Summary` (line 216), `## Uncovered Formal Gaps` (line 228).
  - Obligation refs: O2, O7.

- `architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md`
  - Why included: layer model reference required by task architecture references.
  - Selectors: `## Principles` (line 5), `## Layer Model` (line 13), `## Layer Snapshot` (line 27).
  - Obligation refs: O6.

- `architecture/pattern-library/TESTING-ALIGNMENT.md`
  - Why included: architecture-to-test alignment baseline.
  - Selectors: `## Layer-to-Test Mapping` (line 5), `## Canonical Pipeline Reference` (line 17).
  - Obligation refs: O6.

- `.github/skills/domainspec-verify-feature/SKILL.md`
  - Why included: verification verdict contract and mandatory TEST-SPEC coverage gate.
  - Selectors: `<objective>` (line 9), `Return PASS, FLAG, or BLOCK` (line 10), `<process>` (line 30), `3a. TEST-SPEC obligation coverage gate (MANDATORY)` (line 38), final verdict floor step (line 60).
  - Obligation refs: O7.

- `CHANGELOG.md`
  - Why included: latest framework constraints for delegated stage execution.
  - Selectors: `## [2.0.8]` (line 26), `Delegation policy rollout` bullet (line 35), `## [2.0.4]` (line 63), strict relevance/index/budget bullets (lines 67, 69, 70).
  - Obligation refs: O1.

## Excluded Candidates

- `docs/index/feature-map.md`
  - Why excluded: not present in implementation repo.

- `docs/index/features-index.json`
  - Why excluded: not present in implementation repo.

- `docs/index/tag-index.json`
  - Why excluded: not present in implementation repo.

- `architecture/ARCHITECTURE-PATTERN-LIBRARY.md`
  - Why excluded: broad catalog; direct architecture obligations are fully satisfied by the two task-referenced pattern docs.

- `docs/features/knowledge-graph-visualization/UI-SPEC.md`
  - Why excluded: TASK-KG-IMP-05 contract is satisfied by stories plus TEST-SPEC authority for verification mapping; no additional obligation coverage gap remained.

## Interested Data Subsets

- `storyScope`: `US-1`, `US-2`, `US-3`, `US-4`
- `coverageScope`: `current capability obligations`, `full KG contract matrix`
- `decisionLock`: `D-KG-001`, `D-KG-002`, `D-KG-003`
- `relationshipEdgeLabels` (from `SPEC.md#feature-concept-graph` only):
  - `applies`
  - `consumes`
  - `contains`
  - `displays`
  - `exposes`
  - `fetches`
  - `maps`
  - `mutates`
  - `orchestrates`
  - `produces`
  - `queries`
  - `reflects`
  - `renders`
  - `shapes`
  - `transitions`
  - `wraps`

## Unresolved Blockers

- B1 (downstream execution gate): W2 and verify-feature stage statuses are not yet closed for execution handoff.
  - Evidence: `WORK-PACK.md` wave/status and pipeline rows (`## Wave Status Board`, `## Pipeline Stage Coverage`, verify-feature row at line 96).
  - Remediation: complete W2 evidence/status sync (or explicitly waive), then run `domainspec-verify-feature knowledge-graph-visualization` and publish `VERIFICATION.md`.

## Next Use

1. Use this pack as the deterministic retrieval baseline for TASK-KG-IMP-05 execution.
2. After verdict publication, sync `KG-IMP-05` and verify-related stage rows in `WORK-PACK.md`.
