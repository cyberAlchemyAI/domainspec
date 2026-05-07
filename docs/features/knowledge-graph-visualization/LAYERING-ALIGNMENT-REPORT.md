# Layering Alignment Report: knowledge-graph-visualization

Date: 2026-05-07
Auditor: domainspec-layering-auditor

## Scope

- Mandatory authority read: `implementation/domainspec/CHANGELOG.md`
- Feature authority: `SPEC.md`, `domain.md`, `operations.md`, `workflows.md`
- Implementation touchpoints:
  - `backend/src/modules/knowledge-graph/domain/models.ts`
  - `backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.ts`
  - `backend/src/modules/knowledge-graph/application/get-latest-mirror-projection.ts`
  - `backend/src/modules/knowledge-graph/application/select-concept.ts`
  - `backend/src/modules/knowledge-graph/application/open-definition.ts`
  - `backend/src/modules/knowledge-graph/application/get-concept-detail-card.ts`
  - `backend/src/modules/knowledge-graph/application/get-definition-pointer.ts`
  - `backend/src/modules/knowledge-graph/interface/http-routes.ts`

## Current-Framework Constraints Extracted From Changelog

1. Delegated stages must remain bounded and explicitly diagnosable (2.0.8, 2.0.7, 2.0.6).
2. Retrieval and selection should be deterministic and relevance-gated (2.0.4).
3. DomainSpec workflows should preserve contract visibility with explicit stage outcomes (2.0.7+).

These constraints are compatible with strict domain-layer extraction because domain policies can be pure and testable while application/use-case layers keep orchestration and diagnostics.

## Concept-to-Implementation Mapping

| DomainSpec Concept                      | Expected Layer                            | Current Touchpoint                                                          | Alignment     |
| --------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| `RebuildMirrorProjection`               | Application orchestration + Domain policy | `application/rebuild-mirror-projection.ts`                                  | Partial drift |
| `CardSyncPolicy`                        | Domain policy                             | `assertRequiredMirrorFiles` in `application/rebuild-mirror-projection.ts`   | Drift         |
| `DocumentToMirrorCardAdapter`           | Domain adapter/service                    | `materializeMirrorCards` in `application/rebuild-mirror-projection.ts`      | Drift         |
| `GetRelationshipGraph` projection rules | Domain service                            | `projectRelationshipGraph` in `application/get-latest-mirror-projection.ts` | Drift         |
| `SelectConcept` invariants              | Domain policy + app orchestration         | `application/select-concept.ts`                                             | Partial drift |
| `OpenDefinition` invariants             | Domain policy + app orchestration         | `application/open-definition.ts`                                            | Partial drift |
| `ConceptToDetailCardAdapter`            | Domain adapter/service                    | `collectRelatedStories` in `application/get-concept-detail-card.ts`         | Drift         |

## Layering Drift Findings

### F1 (High): CardSync and rebuild invariants live in application use-case implementation

- Evidence:
  - `assertRequiredMirrorFiles(...)`
  - `validateCanonicalEdges(...)`
  - `validateEdgeEndpoints(...)`
  - `findSpecDocument(...)`
  - all in `application/rebuild-mirror-projection.ts`
- Why this is drift:
  - These are domain invariants from `operations.md` (`R1`, `R3`) and `workflows.md` (`CardSyncPolicy`), but they are embedded as use-case-private helpers.
- Risk:
  - Invariant reuse is hard across commands; policy behavior can diverge if similar logic is re-implemented elsewhere.

### F2 (High): Whiteboard graph projection behavior is implemented as application query internals

- Evidence:
  - `projectRelationshipGraph(...)`
  - `buildFeatureNodes(...)`
  - `buildConceptGroupNodes(...)`
  - `mapEdgesToCards(...)`
  - in `application/get-latest-mirror-projection.ts`
- Why this is drift:
  - These functions encode feature-level/ concept-level semantics, card-grouping semantics, and edge projection rules that belong to domain projection services.
- Risk:
  - Graph semantics become query-endpoint coupled; adding another consumer can duplicate or bypass core behavior.

### F3 (Medium): Concept classification policy is duplicated across application queries

- Evidence:
  - `isStoryConcept(...)` in `application/get-latest-mirror-projection.ts`
  - `isStoryConcept(...)` in `application/get-concept-detail-card.ts`
- Why this is drift:
  - Story classification is domain taxonomy policy, but it is duplicated in multiple application files.
- Risk:
  - Classification drift over time, inconsistent related-story behavior between endpoints.

### F4 (Medium): Selection and definition guard rules are mixed with orchestration concerns

- Evidence:
  - session scope and pointer guards in `application/select-concept.ts` and `application/open-definition.ts`
  - exact-anchor policy in `application/get-definition-pointer.ts`
- Why this is drift:
  - Guard semantics are domain rules for exploration session and definition navigation but are not centralized as domain policy primitives.
- Risk:
  - Rule changes require touching multiple use-cases; brittle error-code consistency.

### F5 (Low): Interface route includes behavior coupling with selection flow

- Evidence:
  - `/api/knowledge-graph/concepts/:conceptId` route in `interface/http-routes.ts` performs select-then-detail orchestration and cross-checks selected concept mapping.
- Why this is drift:
  - Boundary layer should primarily validate/translate transport concerns and delegate behavior sequencing to an application facade.
- Risk:
  - Harder to share same workflow via non-HTTP interfaces.

## Overall Verdict

- Layering status: **MISALIGNED (recoverable)**
- Primary issue pattern: domain policies and projection semantics reside inside application/query helpers.
- Blockers to planning: none.

## Recommended Target Layering

1. Domain layer owns policy and projection semantics (pure functions/services).
2. Application layer owns orchestration across ports, persistence, and error mapping.
3. Interface layer owns transport mapping only.

This target is captured as executable migration tasks in `LAYERING-ALIGNMENT-PLAN.md`.
