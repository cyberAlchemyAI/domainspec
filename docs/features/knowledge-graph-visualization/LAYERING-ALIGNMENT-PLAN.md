# Layering Alignment Plan: knowledge-graph-visualization

Date: 2026-05-07
Source report: `LAYERING-ALIGNMENT-REPORT.md`

## Goal

Move domain behavior currently embedded in application/query/use-case helpers into explicit domain policy/service modules while preserving existing API contracts and error semantics.

## Dependency-Ordered Migration Waves

## Wave 1: Stabilize Current Behavior With Characterization Tests

### KG-LAY-01 Add characterization tests for rebuild and graph projection behavior

- Target files:
  - `backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.test.ts`
  - `backend/src/modules/knowledge-graph/application/*graph*.test.ts` (new if needed)
- Cover:
  - required file enforcement,
  - canonical edge label rejection,
  - unresolved endpoint rejection,
  - feature/card/group projection shape by view level.
- Depends on: none.
- Validation gate:
  - tests fail when policy behavior changes unintentionally.

### KG-LAY-02 Add characterization tests for selection/definition guards

- Target files:
  - `backend/src/modules/knowledge-graph/application/select-concept*.test.ts` (new if needed)
  - `backend/src/modules/knowledge-graph/application/open-definition*.test.ts` (new if needed)
- Cover:
  - scope mismatch,
  - invalid selection source,
  - unresolved card mapping,
  - session mismatch and anchor checks.
- Depends on: none.
- Validation gate:
  - current error codes and guard outcomes are frozen before refactor.

## Wave 2: Extract Domain Policy Primitives

### KG-LAY-03 Create domain policy module for mirror rebuild invariants

- Add module: `backend/src/modules/knowledge-graph/domain/policies/rebuild-policy.ts`
- Move from application:
  - `assertRequiredMirrorFiles`,
  - `validateCanonicalEdges`,
  - `validateEdgeEndpoints`,
  - `findSpecDocument` contract guard.
- Depends on: KG-LAY-01.
- Validation gate:
  - new domain-policy unit tests pass,
  - existing characterization tests remain green.

### KG-LAY-04 Create domain taxonomy/classification policy module

- Add module: `backend/src/modules/knowledge-graph/domain/policies/concept-classification.ts`
- Centralize:
  - story concept classification currently duplicated in queries.
- Depends on: KG-LAY-01.
- Validation gate:
  - all story-related behaviors use one function,
  - no duplicate `isStoryConcept` logic remains in application files.

### KG-LAY-05 Create domain policy module for exploration guard rules

- Add module: `backend/src/modules/knowledge-graph/domain/policies/exploration-guards.ts`
- Centralize:
  - session scope checks,
  - concept pointer availability rules,
  - exact-anchor preference semantics.
- Depends on: KG-LAY-02.
- Validation gate:
  - selection/open-definition tests continue passing without behavior drift.

## Wave 3: Extract Domain Projection Services

### KG-LAY-06 Create domain service for whiteboard projection materialization

- Add module: `backend/src/modules/knowledge-graph/domain/services/whiteboard-projection.ts`
- Move from application rebuild use-case:
  - feature card inference,
  - group card derivation,
  - feature-edge scoping,
  - concept/story card projection shaping.
- Depends on: KG-LAY-03, KG-LAY-04.
- Validation gate:
  - snapshot whiteboard output remains byte-equivalent in tests for same inputs.

### KG-LAY-07 Create domain service for relationship graph projection

- Add module: `backend/src/modules/knowledge-graph/domain/services/relationship-graph-projection.ts`
- Move from query layer:
  - `projectRelationshipGraph`,
  - feature/group selection validation,
  - edge-to-card mapping.
- Depends on: KG-LAY-04, KG-LAY-06.
- Validation gate:
  - graph endpoint contract test snapshots unchanged.

### KG-LAY-08 Create domain adapter/service for concept detail enrichment

- Add module: `backend/src/modules/knowledge-graph/domain/services/concept-detail-projection.ts`
- Move from query layer:
  - related story derivation,
  - inbound/outbound relation assembly defaults.
- Depends on: KG-LAY-04.
- Validation gate:
  - concept detail payload parity maintained.

## Wave 4: Thin Application and Interface Layers

### KG-LAY-09 Refactor application use-cases to orchestrate only

- Update:
  - `application/rebuild-mirror-projection.ts`
  - `application/get-latest-mirror-projection.ts`
  - `application/get-concept-detail-card.ts`
  - `application/select-concept.ts`
  - `application/open-definition.ts`
  - `application/get-definition-pointer.ts`
- Rule:
  - application calls domain policies/services and ports,
  - no domain invariants duplicated in application private helpers.
- Depends on: KG-LAY-03..KG-LAY-08.
- Validation gate:
  - all characterization tests and new domain tests pass.

### KG-LAY-10 Reduce interface-level behavior coupling

- Update: `backend/src/modules/knowledge-graph/interface/http-routes.ts`
- Move select-then-detail orchestration into explicit application facade/use-case (transport-independent).
- Keep route responsibilities:
  - parse/validate transport input,
  - call one application entry,
  - map response/error to HTTP.
- Depends on: KG-LAY-09.
- Validation gate:
  - endpoint behavior parity,
  - no domain rule logic in route helpers beyond transport parsing.

## Completion Criteria

1. All high/medium findings in `LAYERING-ALIGNMENT-REPORT.md` are closed.
2. Domain rules exist in domain modules with dedicated unit tests.
3. Application files contain orchestration only (ports + composition + error propagation).
4. HTTP routes are transport adapters only.
5. Existing endpoint contracts remain backward compatible.

## Remediation if Drift Reappears

1. Re-run layering audit on this feature after each major refactor wave.
2. Block merge when new domain invariants are added in application or interface folders without domain-policy placement.
