# Decisions: Knowledge Graph Visualization

## Confirmed Decisions

- current uses a mirror-first model: cards are derived from feature files and must include SPEC, domain, and operations.
- Graph projection is sourced from canonical concept IDs and canonical relationship labels only.
- Concept click must resolve to a concrete definition pointer (`filePath#anchor`) before navigation.
- Concept detail card must show both inbound and outbound relations with evidence references.
- UI uses one page with three synchronized regions: mirror cards, relationship graph, and concept detail panel.

## Decision Gate Results (2026-05-03)

- D-KG-004 (layout determinism): Selected server-deterministic graph layout to guarantee reproducible node positions and stable verification evidence.
- D-KG-005 (definition open mode): Selected in-app markdown viewer as the default open-definition target to preserve flow continuity.
- D-KG-006 (optional aspect visibility): Selected progressive reveal so required cards are always visible and optional aspects are suggested contextually.

## Decision Gate Results (2026-05-06)

- D-KG-007 (cross-project source policy): Selected registered source keys (`projectKey`) instead of arbitrary filesystem paths to keep projection scope auditable and safe.
- D-KG-008 (external source pilot): Selected `poker-team` as the first external documentation source for validating cross-project projection behavior.
- D-KG-009 (scope invariants): Selected strict `(projectKey, featureId)` scope propagation across rebuild, read, select, and open-definition operations.

## Decision Gate Results (2026-05-07)

- D-KG-010 (adapter waiver for pilot): Accepted temporary risk of in-memory project-source/session adapters in route composition for pilot profile, with review target 2026-06-15.
- D-KG-011 (coverage-floor waiver for pilot): Accepted `FLAG`-level partial TEST-SPEC coverage for pilot readiness, with full catalogue closure deferred to subsequent execution wave.

## Deferred Scope

- Multi-feature graph federation in a single canvas view.
- Collaborative annotations and shared review comments on concept detail cards.
- Automatic remediation suggestions for missing definition anchors.
- Dynamic runtime registration of arbitrary project paths without registry governance.
