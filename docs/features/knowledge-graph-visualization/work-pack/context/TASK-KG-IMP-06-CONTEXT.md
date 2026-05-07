# TASK-KG-IMP-06 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-06
- Mode: standard
- Strict relevance gate: on
- Framework constraints applied:
  - CHANGELOG 2.0.8: delegated-stage profile and telemetry handling constraints stay explicit.
  - CHANGELOG 2.0.4: selector-plus-obligation inclusion, interested-data subsets, required index schema, and mode budgets.
- Files selected: 11
- Snippets selected: 36
- Excerpt lines: 254 / 280
- Noise ratio: 0.12
- Obligation coverage: 11 / 11

## Obligation Matrix

| Obligation ID | Requirement                                                                                                                            | Evidence Source                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1            | TASK-KG-IMP-06 remains the authority for coverage scope, directives, execution steps, completion criteria, and verification evidence.  | `work-pack/tasks/TASK-KG-IMP-06.md` (`## DomainSpec Coverage`, `## Implementation Directives`, `## Execution Steps`, `## Completion Criteria`, `## Verification Evidence`) |
| O2            | Alignment scope must cover concept/relationship, API, UI behavior, and contract-test obligations from the task coverage table.         | `TASK-KG-IMP-06.md` coverage table + `SPEC.md` + `interfaces.md` + `UI-SPEC.md` + `TEST-SPEC.md`                                                                           |
| O3            | Architecture evidence must be resolved through task-linked pattern-library selectors, including Interface/Adapters layering authority. | `architecture/ARCHITECTURE-PATTERN-LIBRARY.md`, `architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer`                                             |
| O4            | Alignment execution is gated on current verification evidence and existing W3 readiness signals.                                       | `VERIFICATION.md` + `WORK-PACK.md`                                                                                                                                         |
| O5            | Alignment command contract and report emission semantics must follow the `domainspec-audit-alignment` process contract.                | `.github/skills/domainspec-audit-alignment/SKILL.md`                                                                                                                       |
| O6            | Non-PASS outcomes must include owner/date remediation rows and rerun plan details.                                                     | `TASK-KG-IMP-06.md` directives + `domainspec-audit-alignment` process requirements                                                                                         |
| O7            | Output must publish/update `ALIGNMENT-REPORT.md` and map findings to contract IDs plus implementation files.                           | `TASK-KG-IMP-06.md` execution steps + audit skill output contract                                                                                                          |
| O8            | Follow-up actions must be reflected in work-pack task/stage tracking.                                                                  | `WORK-PACK.md` (`KG-IMP-06`, `audit-alignment` stage)                                                                                                                      |
| O9            | Decision lock for this stage is bound to D-KG-002 and D-KG-003.                                                                        | `TASK-KG-IMP-06.md#decision-lock`                                                                                                                                          |
| O10           | Relationship context is constrained to the edge labels present in `SPEC.md` Feature Concept Graph only.                                | `SPEC.md#feature-concept-graph`                                                                                                                                            |
| O11           | Context-builder output must satisfy latest strict relevance/index schema/budget framework constraints.                                 | `CHANGELOG.md` (`## [2.0.8]`, `## [2.0.4]`)                                                                                                                                |

## Included Context

- `docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-06.md`
  - Why included: primary execution authority for stage scope and acceptance.
  - Selectors: `## DomainSpec Coverage` (line 15), `## Architecture References` (line 24), `## Implementation Directives` (line 29), `## Execution Steps` (line 35), `## Completion Criteria` (line 42), `## Verification Evidence` (line 47), `## Decision Lock` (line 56), `D-KG-002` (line 60), `D-KG-003` (line 61).
  - Obligation refs: O1, O2, O3, O6, O7, O9.

- `docs/features/knowledge-graph-visualization/WORK-PACK.md`
  - Why included: stage/task synchronization authority for KG-IMP-06 and audit-alignment closure.
  - Selectors: `## Task Status Board`, `KG-IMP-06` row, `## Mandatory Closure Obligations`, `Alignment audit` row, `## Pipeline Stage Coverage`, `audit-alignment` row.
  - Obligation refs: O4, O8.

- `docs/features/knowledge-graph-visualization/VERIFICATION.md`
  - Why included: upstream verification-current gate and pending remediation signals impacting alignment closure.
  - Selectors: `## Verdict` (line 3), `### Coverage Summary` (line 53), `## Action Matrix (Required for FLAG)` (line 108), `A-KG-VER-001` row (line 112).
  - Obligation refs: O4, O8.

- `docs/features/knowledge-graph-visualization/SPEC.md`
  - Why included: concept/relationship contract authority and relationship-edge interested-data source.
  - Selectors: `## Capabilities` (line 45), `## Feature Concept Graph` (line 139).
  - Obligation refs: O2, O10.

- `docs/features/knowledge-graph-visualization/interfaces.md`
  - Why included: API exposure contract authority for alignment coverage and drift classification.
  - Selectors: `## External: KnowledgeGraphAPI (REST)`, `## Internal: KnowledgeGraphModule Interface`, `## Internal: ProjectSourceRegistry Interface`.
  - Obligation refs: O2.

- `docs/features/knowledge-graph-visualization/UI-SPEC.md`
  - Why included: UI behavior contract authority for click/focus/navigation alignment checks.
  - Selectors: `## Route Table` (line 33), `## Interaction Contract` (line 69), `## Data Flow` (line 112), `## State-to-UI Mapping`.
  - Obligation refs: O2.

- `docs/features/knowledge-graph-visualization/TEST-SPEC.md`
  - Why included: contract test matrix IDs and coverage expectations used by audit coverage gate.
  - Selectors: `## Backend Test Catalogue`, `### Interface Contract Obligations`, `### Capability Acceptance Obligations`, `## UI E2E Test Catalogue`, `## Coverage Summary`, `## Uncovered Formal Gaps`.
  - Obligation refs: O2, O5.

- `architecture/ARCHITECTURE-PATTERN-LIBRARY.md`
  - Why included: task-linked architecture reference for composable context pack selection.
  - Selectors: `## How To Use Minimal Context`, `## Context Packs`.
  - Obligation refs: O3.

- `architecture/pattern-library/LAYERING-REFERENCE.md`
  - Why included: exact layering authority for interface/adapters-bound drift checks.
  - Selectors: `## Layer Responsibilities`, `### Interface / Adapters Layer` (line 39), `## Module Boundary Guidelines`.
  - Obligation refs: O3.

- `.github/skills/domainspec-audit-alignment/SKILL.md`
  - Why included: command contract, mandatory coverage gate, severity policy, and output path.
  - Selectors: `<objective>`, `<context>`, `<process>`, `4a. Test obligation coverage gate (MANDATORY)`, `Output: docs/features/{feature}/ALIGNMENT-REPORT.md`.
  - Obligation refs: O5, O6, O7.

- `CHANGELOG.md`
  - Why included: latest framework constraints governing strict context-builder output.
  - Selectors: `## [2.0.8]` (line 26), `## [2.0.4]` (line 63).
  - Obligation refs: O11.

## Excluded Candidates

- `docs/index/feature-map.md`
  - Why excluded: optional index artifact not present in implementation repo.

- `docs/index/features-index.json`
  - Why excluded: optional index artifact not present in implementation repo.

- `docs/index/tag-index.json`
  - Why excluded: optional index artifact not present in implementation repo.

- `docs/features/knowledge-graph-visualization/ALIGNMENT-REPORT.md`
  - Why excluded: this task treats the alignment report as the stage output artifact to refresh, not authoritative input for obligation extraction.

- `architecture/ARCHITECTURE.md`
  - Why excluded: direct architecture obligations are fully satisfied by the two task-linked architecture references.

## Interested Data Subsets

- `coverageScope`:
  - concept and relationship contracts
  - API exposure contracts
  - UI behavior contract coverage
  - contract test matrix IDs
- `decisionLock`: `D-KG-002`, `D-KG-003`
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
- `alignmentVerdictLevels`: `PASS`, `FLAG`, `BLOCK`

## Unresolved Blockers

- B1 (downstream closure risk): `VERIFICATION.md` is currently `FLAG` with open action `A-KG-VER-003` (TEST-SPEC coverage debt), which can keep alignment closure in non-PASS state until remediated.
  - Evidence: `VERIFICATION.md` `## Action Matrix (Required for FLAG)`.

- B2 (runtime path risk): direct shell runtime previously reported DomainSpec command entrypoint gaps for mandatory W3 audits; execute alignment in delegated DomainSpec runtime path.
  - Evidence: `VERIFICATION.md` contract-check row for mandatory W3 audits command availability.

## Next Use

1. Use this pack as deterministic input for `domainspec-audit-alignment knowledge-graph-visualization`.
2. Publish/update `ALIGNMENT-REPORT.md` with severity + contract-impact mapping and owner/date remediation rows when non-PASS.
3. Sync `KG-IMP-06` and `audit-alignment` stage rows in `WORK-PACK.md` after report publication.
