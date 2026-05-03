# Relationship Adoption Rollout Plan

Date: 2026-05-03
Scope: DomainSpec relationship modeling in feature specifications, registry sync, and validation.

## Objective

Make relationships first-class, canonical, and machine-validated across feature specs and registry outputs.

## Workstream 1: Feature Concept Graph authoring model

Status: completed
Deliverables:

- docs/templates/FEATURE-CONCEPT-GRAPH.md
- templates/SPEC.md (Feature Concept Graph section integrated)
- docs/templates/SPEC.md (Feature Concept Graph section integrated)
- README.md Stage 3 guidance updated
- examples/payment-processing/SPEC.md populated graph example added

### Plan

1. Keep the new graph section as a standalone template fragment for initial review. ✅
2. After approval, integrate a "Feature Concept Graph" section into:

- templates/SPEC.md ✅
- docs/templates/SPEC.md ✅

3. Add short author guidance to README.md under Stage 3. ✅
4. Add one fully populated example in a reference feature for copy/paste onboarding. ✅

### Acceptance Criteria

- New SPEC files include a relationship table section.
- Relationship rows use canonical edge names only.
- Feature docs contain direct evidence links for each relationship row.

## Workstream 2: Registry parser and edge validation

Status: completed
Primary target: tools/generate-registry.ts
Deliverables:

- tools/generate-registry.ts parses Feature Concept Graph tables from feature SPEC docs
- registry output now emits normalized edges plus validation diagnostics
- registry stats now include edge and drift counts

### Plan

1. Parse Feature Concept Graph tables from docs/features/\*/SPEC.md. ✅
2. Build a normalized edge set and write to registry JSON (replace edges: []). ✅
3. Validate each edge label against RELATIONSHIPS.md canonical list. ✅
4. Validate edge endpoints against known concept IDs from SPEC concept tables. ✅
5. Emit drift diagnostics for unknown edges, missing endpoints, and duplicates. ✅

### Acceptance Criteria

- registry.json contains non-empty edges when feature graphs exist.
- Unknown edge labels are reported as validation failures.
- Duplicate (From, Edge, To) rows are rejected or flagged deterministically.

## Workstream 3: Guardrail for canonical relationship vocabulary

Status: completed (warning mode active during migration window)
Primary targets:

- tools/check_docs_sync.sh
- new validator script for relationship vocabulary
- tools/validate-relationships.ts

### Plan

1. Add a dedicated validator that checks:
   - Cross-Feature Dependencies Relationship values in SPEC files.
   - Feature Concept Graph Edge values in SPEC files.
2. Fail with clear diagnostics when non-canonical labels are used. ✅ (strict mode)
3. Wire validator into docs sync checks to block drift early. ✅ (warn mode in docs sync until migration completes)

### Acceptance Criteria

- Non-canonical labels (for example uses, validates) fail validation in strict mode.
- Error messages include file path, line, and suggested canonical alternatives.

## Workstream 4: Existing feature migration to canonical edges

Status: planned
Initial migration set:

- docs/features/payment-processing/SPEC.md
- docs/features/domainspec-gsd-integration/SPEC.md
- docs/features/knowledge-graph-visualization/SPEC.md

### Plan

1. Inventory current free-form relationship labels.
2. Build a migration mapping table from current labels to canonical edges.
3. For ambiguous mappings, open a short decision gate before mutation.
4. Update SPEC dependency sections and add Feature Concept Graph rows.
5. Re-run validators and sync scripts.

### Acceptance Criteria

- All migrated features use canonical edge labels only.
- Validation passes with zero unknown labels.
- Registry edge output reflects migrated relationships.

## Sequencing and Dependencies

1. Workstream 1 (section model) must be reviewed before broad migration.
2. Workstream 2 and Workstream 3 can be implemented in parallel after Workstream 1 review.
3. Workstream 4 starts after Workstream 3 guardrail is active.

## Risks and Mitigations

- Risk: Incorrect canonical mapping for legacy free-form labels.
  - Mitigation: explicit decision gate for ambiguous cases.
- Risk: Validator too strict for transitional docs.
  - Mitigation: support warning mode during short migration window, then enforce fail mode.
- Risk: Template drift between templates/ and docs/templates/.
  - Mitigation: update both and add parity check.

## Done Definition

- Feature SPECs contain explicit, canonical relationship tables.
- Registry generation emits validated edges.
- Docs checks block non-canonical relationship labels.
- Existing priority features are migrated and green under the new guardrails.
