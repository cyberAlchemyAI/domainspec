# TASK-KG-ALG-03 - Concept Card Enrichment Plan (Rules and Descriptions)

## Goal

Plan deterministic concept-card enrichment for rules/descriptions and define fallback behavior when source coverage is partial.

## Wave Assignment

- Primary wave: W2

## Status

not-started

## Prerequisite

- [TASK-KG-ALG-01.md](TASK-KG-ALG-01.md)
- [TASK-KG-ALG-02.md](TASK-KG-ALG-02.md)

## DomainSpec Coverage

| Source                             | Coverage IDs                                            |
| ---------------------------------- | ------------------------------------------------------- |
| [domain.md](../../domain.md)       | ConceptDefinition, ConceptDetailCard, DefinitionPointer |
| [mappings.md](../../mappings.md)   | ConceptToDetailCardAdapter, DocumentToConceptMapping    |
| [queries.md](../../queries.md)     | GetConceptDetailCard, GetDefinitionPointer              |
| [SPEC.md](../../SPEC.md)           | Feature Drilldown By Aspect capability                  |
| [TEST-SPEC.md](../../TEST-SPEC.md) | KG-BE-QRY-009..016, KG-BE-CAP-004                       |

## Architecture References

- [ARCHITECTURE.md](../../../../../ARCHITECTURE.md)
- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)
- [TEST-PIPELINE.md](../../../../../TEST-PIPELINE.md)

## Implementation Directives

1. Define enrichment precedence for summary, rules, and description signals by aspect source.
2. Keep card payload deterministic for identical input snapshots.
3. Specify behavior when a concept lacks rule text or definition pointer details.
4. Ensure enrichment fields remain compatible with detail panel and query contracts.
5. Link enrichment fields to test obligations for query output and UI detail behavior.

## Completion Criteria

- [ ] Enrichment precedence and fallback contracts are documented.
- [ ] Query and UI obligations are mapped to enrichment outputs.
- [ ] No unresolved blocker decision remains for enrichment scope.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-ALG-03.md`
- `rg -n "ConceptDetailCard|summary|rule|description|GetConceptDetailCard" docs/features/knowledge-graph-visualization/{domain.md,mappings.md,queries.md,TEST-SPEC.md,work-pack/tasks/TASK-KG-ALG-03.md}`

## Gaps and Questions

- Rule badge density and placement decision remains open (`KG-ALG-GAP-003`, `KG-ALG-Q-003`).

## Decision Lock

| Decision ID | Required | Status   | Note                                                            |
| ----------- | -------- | -------- | --------------------------------------------------------------- |
| D-KG-013    | yes      | selected | Deterministic hierarchy and grouping remain fixed.              |
| D-KG-014    | yes      | selected | Prototype-first anchor can guide display behavior expectations. |
