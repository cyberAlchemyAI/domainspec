# Tasks: Knowledge Graph Visualization (V1-V3 Spec Waves)

## Objective

Author three connected feature-spec visions with distinct purposes:

1. V1 - Capability Atlas Board (learnability-first)
2. V2 - Relationship Constellation Canvas (analysis-first)
3. V3 - Dependency Matrix + Trace Storyboard (governance and risk-first)

This plan is for specification authoring only. No implementation tasks are included.

Operational execution playbook:

- `PIPELINE-WAVE-EXECUTION-PLAN.md`
- `V1-FULL-PIPELINE-IMPLEMENTATION-PLAN.md`

## Shared Governance Baseline (required before Wave 1)

1. Freeze shared concept namespace: `knowledge-graph-visualization.*`.
2. Freeze canonical relationship verbs from `RELATIONSHIPS.md`.
3. Define version boundaries:
   - V1 owns comprehension and navigation contracts.
   - V2 owns graph analysis and multi-hop tracing contracts.
   - V3 owns dependency governance and risk contracts.
4. Record unresolved choices in `decisions.en.md` before mutating aspect docs.

## Wave 1: V1 Spec (Capability Atlas Board)

## Purpose

Enable fast understanding of feature landscape, taxonomy, and concept-aspect linkage.

Primary users: new developers, product stakeholders, operators.

## Authoring Scope

- `SPEC.md`
- `capabilities/v1-capability-atlas-board.md`
- `domain.md`
- `queries.md`
- `interfaces.md`
- `mappings.md`
- `STORIES.md`

## Ordered Tasks

1. Draft `SPEC.md` skeleton sections:
   - Overview
   - Concepts table
   - Aspects
   - Cross-Feature Dependencies
   - Produces For
2. Define shared concepts in `domain.md`:
   - GraphNode, GraphEdge, CapabilityAnchor, ViewFilter, VisualizationProfile.
3. Define V1 navigation queries in `queries.md`:
   - GetFeatureAtlas
   - GetCapabilityNeighborhood
   - GetConceptInspectorContext
4. Define V1 interaction contracts in `interfaces.md`:
   - KnowledgeGraphReadAPI for atlas, filters, drill-down, and trace previews.
5. Define transformation contracts in `mappings.md`:
   - IndexToGraphMapping
   - FeatureDocsToCapabilityCards
6. Author `capabilities/v1-capability-atlas-board.md` with:
   - User journey
   - Information architecture
   - Filtering model
   - Drill-down behavior
   - Cross-feature preview behavior
7. Author `STORIES.md` and ensure each story maps to at least one V1 concept and one query.
8. Add decision records in `decisions.en.md` for naming and edge-label UI aliases.

## Wave 1 Review Checkpoint

- Review type: learnability and information architecture.
- Required reviewers: product + architecture.
- Evidence:
  - Story coverage matrix for V1 capabilities.
  - Concept ID consistency check against `SPEC.md` concept table.

## Wave 1 Exit Criteria

1. Every V1 UI view is traceable to canonical concepts and queries.
2. No non-canonical relationship verbs introduced.
3. V1 capability spec is approved and marked stable for Wave 2 dependencies.

## Wave 2: V2 Spec (Relationship Constellation Canvas)

## Purpose

Enable deep graph analysis, relationship exploration, and multi-hop cross-feature tracing.

Primary users: architects, senior engineers, spec maintainers.

## Authoring Scope

- `SPEC.md` (extend)
- `capabilities/v2-relationship-constellation-canvas.md`
- `queries.md` (extend)
- `mappings.md` (extend)
- `workflows.md`
- `events.md`
- `STORIES.md` (extend)

## Ordered Tasks

1. Extend `SPEC.md` with V2 capability and analysis responsibilities.
2. Extend `queries.md` with V2 traversal contracts:
   - GetShortestCrossFeaturePath
   - GetNeighborhoodByDepth
   - GetEdgeTypedProjection
3. Extend `mappings.md` with projection transforms:
   - GraphToCanvasProjection
   - RelationshipFamilyProjection
4. Author `workflows.md` for analysis sequences:
   - TraceSelectionWorkflow
   - MultiHopAnalysisWorkflow
5. Author `events.md` for analysis lifecycle signals:
   - ProjectionBuilt
   - TraceComputed
   - LensSaved
6. Author `capabilities/v2-relationship-constellation-canvas.md` with:
   - Graph exploration controls
   - Path analysis logic
   - Edge-family lenses
   - Analyst drill-down flows
7. Extend `STORIES.md` with analyst scenarios and acceptance checks.
8. Update `decisions.en.md` for path-ranking policy and depth limits.

## Wave 2 Review Checkpoint

- Review type: architecture and semantic-correctness.
- Required reviewers: architecture + platform.
- Evidence:
  - Canonical edge verb audit.
  - Cross-feature path examples with concept IDs.

## Wave 2 Exit Criteria

1. All V2 relations are expressed with canonical relationship verbs.
2. Multi-hop path rules are deterministic and documented.
3. V2 analysis semantics are approved and stable for Wave 3 governance layering.

## Wave 3: V3 Spec (Dependency Matrix + Trace Storyboard)

## Purpose

Enable governance-grade dependency analysis, release-risk visibility, and audit traceability.

Primary users: governance leads, release managers, risk owners.

## Authoring Scope

- `SPEC.md` (extend)
- `capabilities/v3-dependency-matrix-trace-storyboard.md`
- `operations.md`
- `states.md`
- `events.md` (extend)
- `workflows.md` (extend)
- `queries.md` (extend)
- `interfaces.md` (extend)
- `STORIES.md` (extend)

## Ordered Tasks

1. Extend `SPEC.md` with V3 governance goals and risk contracts.
2. Author `operations.md` for governance operations:
   - ComputeDependencyRiskScore
   - BuildImpactStoryboard
   - ApproveRiskException
3. Author `states.md` for dependency health lifecycle:
   - Stable, Watch, Warning, Critical, Mitigated.
4. Extend `events.md` for governance events:
   - DependencyRiskRaised
   - DependencyRiskMitigated
   - StoryboardPublished
5. Extend `workflows.md` with governance flows:
   - RiskAssessmentWorkflow
   - ReleaseImpactWorkflow
6. Extend `queries.md` and `interfaces.md` with matrix and storyboard retrieval contracts.
7. Author `capabilities/v3-dependency-matrix-trace-storyboard.md` with:
   - Matrix semantics
   - Coupling score bands
   - Storyboard trace evidence model
   - Risk triage interactions
8. Extend `STORIES.md` with governance and release-readiness scenarios.
9. Update `decisions.en.md` with approved scoring formula and override policy.

## Wave 3 Review Checkpoint

- Review type: governance and readiness.
- Required reviewers: governance + architecture + operations.
- Evidence:
  - Risk scoring rationale.
  - End-to-end traceability from matrix cell to concept/event/story.

## Wave 3 Exit Criteria

1. Risk rules are formalized with clear calculations and guards.
2. High-risk dependencies are traceable to concept IDs, events, and stories.
3. V1, V2, and V3 are coherent under one shared concept registry.

## Cross-Wave Stability Rules

1. No concept renames after Wave 1 without a documented migration note.
2. No relationship verb expansion after Wave 2 without governance approval.
3. Shared semantics live in core aspect docs; version files contain view-specific behavior only.
4. Run story consistency pass after each wave and resolve all concept-story orphan links.

## Execution Sequence (Spec Authoring Sessions)

1. Run Wave 1 authoring session and complete Wave 1 exit criteria.
2. Run Wave 2 authoring session only after Wave 1 stability lock.
3. Run Wave 3 authoring session only after Wave 2 semantic lock.

## Ownership Labels

- docs: SPEC and aspect documentation quality and traceability.
- architecture: concept and edge semantic integrity.
- governance: risk policy and release-readiness criteria.
- product: comprehension and journey clarity for V1.

## Execution Log

### Wave 1 Execution Status (2026-05-01)

Status: completed

Produced artifacts:

- `SPEC.md`
- `domain.md`
- `queries.md`
- `interfaces.md`
- `mappings.md`
- `STORIES.md`
- `decisions.en.md`
- `capabilities/v1-capability-atlas-board.md`
- `WAVE1-CHECKPOINT.md`

Checkpoint result:

1. Learnability and IA review (product + architecture): PASS.
2. Concept ID consistency audit against `SPEC.md` concept table: PASS.
3. Story coverage validation for V1 acceptance checks: PASS.

### Wave 2 Execution Status (2026-05-01)

Status: completed

Produced artifacts:

- `events.md`
- `workflows.md`
- `capabilities/v2-relationship-constellation-canvas.md`
- `SPEC.md` (extended for V2 concepts and capability)
- `queries.md` (extended with V2 analysis queries)
- `mappings.md` (extended with V2 projection mappings)
- `STORIES.md` (extended with V2 analyst stories)
- `decisions.en.md` (updated with V2 policy decisions)
- `WAVE2-CHECKPOINT.md`

Checkpoint result:

1. Architecture and semantic-correctness review: PASS.
2. Canonical edge verb audit for new V2 flows: PASS.
3. Cross-feature path examples validation with concept IDs: PASS.

### Wave 3 Execution Status (2026-05-01)

Status: completed

Produced artifacts:

- `operations.md`
- `states.md`
- `capabilities/v3-dependency-matrix-trace-storyboard.md`
- `events.md` (extended with governance events)
- `workflows.md` (extended with governance workflows)
- `queries.md` (extended with matrix and storyboard retrieval contracts)
- `interfaces.md` (extended with matrix/storyboard and governance operation endpoints)
- `mappings.md` (extended with matrix/storyboard mappings)
- `domain.md` (extended with feature-pair impact and exception concepts)
- `SPEC.md` (extended for V3 capability and concept registry)
- `STORIES.md` (extended with V3 governance scenarios)
- `decisions.en.md` (updated with V3 formula and override policy)
- `WAVE3-CHECKPOINT.md`

Checkpoint result:

1. Governance and readiness review: PASS.
2. Risk scoring rationale review: PASS.
3. End-to-end traceability from matrix cell to concept/event/story: PASS.

### V1 Capability Pipeline Run (2026-05-01)

Status: completed

Route executed:

- `domainspec-pipeline knowledge-graph-visualization --test-only`

Produced artifacts:

- `TEST-SPEC.md`
- `PIPELINE-REPORT.md`

Run verdict:

1. Plan/spec/stories consistency gates: PASS.
2. V1 deterministic test derivation: PASS (35 obligations).
3. Capability-scoped pipeline verdict: PASS.

### Full Lifecycle Pipeline Re-run (2026-05-02)

Status: completed with FLAG

Route executed:

- `domainspec-orchestrate "run pipeline for knowledge-graph-visualization"`
- `domainspec-pipeline knowledge-graph-visualization`

Run verdict:

1. Decision gate artifact `DECISIONS.md` accepted; blocker-level options are resolved.
2. V1/V2/V3 spec and story artifacts remained stable and were preserved.
3. Implementation and UI stages were flagged because runnable backend/frontend layers are not present in this project scope.
4. Final rerun verdict: FLAG. See `PIPELINE-REPORT.md` for full stage-by-stage evidence.

### V1 Full Pipeline Wave Run (2026-05-02)

Status: stopped at Wave 0 (BLOCK)

Route executed:

- `domainspec-orchestrate "run full pipeline for knowledge-graph-visualization focused on V1 Capability Atlas Board implementation"`

Wave run verdict:

1. Wave 0 gate checks passed for decisions, governance baseline, and V1 contracts.
2. Wave 0 blocked because backend/frontend runtime layers are missing in the current `implementation/domainspec` project scope.
3. Waves 1-5 were deferred according to gate policy in `V1-FULL-PIPELINE-IMPLEMENTATION-PLAN.md`.
4. Execution evidence is captured in `PIPELINE-REPORT.md` under `V1 Wave Execution Attempt (2026-05-02)`.

### Wave 0 Unblock Remediation (2026-05-02)

Status: completed

Scaffolded runtime layers:

- `implementation/domainspec/backend/` (TypeScript + Fastify + PostgreSQL wiring + scope middleware)
- `implementation/domainspec/apps/web/` (Vite + React + TypeScript)
- `implementation/domainspec/package.json` and `pnpm-workspace.yaml`

Validation result:

1. `pnpm install` executed successfully in `implementation/domainspec`.
2. `pnpm check` passed for both backend and web workspaces.
3. Wave 0 gate is now unblocked and Waves 1-5 are ready to run.

### Wave 1 Contract Refresh Lock (2026-05-02)

Status: completed (manual-equivalent test-only run)

Route executed:

- `domainspec-pipeline knowledge-graph-visualization --test-only` (direct shell attempt returned `command not found`)
- Manual-equivalent Wave 1 sequence: spec refresh lock -> stories sync lock -> test derivation lock

Run verdict:

1. `SPEC.md`, `STORIES.md`, and `TEST-SPEC.md` remained synchronized for V1 scope.
2. V2/V3 semantics were preserved (capability references and story slices remained present).
3. V1 deterministic test obligations remained stable at 35 with explicit must-pass subset retained.
4. Wave 1 verdict: PASS; Wave 2 is ready to start.
