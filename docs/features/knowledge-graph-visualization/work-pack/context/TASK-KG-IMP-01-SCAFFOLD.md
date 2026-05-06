# TASK-KG-IMP-01 Implementation Scaffold

## Purpose

This scaffold turns the TASK-KG-IMP-01 context references into a function-first implementation blueprint aligned with architecture foundations and layering rules.

## Source References Used

- Task contract: TASK-KG-IMP-01
- Domain entities and value objects: domain.md
- Rebuild rules and calculations: operations.md (R1-R5, C1-C3)
- Parsing/mapping contracts: mappings.md
- Concepts and edge source data: SPEC.md
- Canonical edge vocabulary: RELATIONSHIPS.md (edge subset from feature graph)
- Verification obligations: TEST-SPEC.md (KG-OP-001, KG-OP-002, KG-OP-005, KG-API-001, KG-API-002, KG-API-005)
- Architecture constraints: ARCHITECTURE-FOUNDATIONS.md and LAYERING-REFERENCE.md

## Layered File Skeleton

- backend/src/modules/knowledge-graph/domain/
  - models.ts
  - errors.ts
- backend/src/modules/knowledge-graph/application/
  - ports.ts
  - rebuild-mirror-projection.ts
  - get-latest-mirror-projection.ts
- backend/src/modules/knowledge-graph/infrastructure/
  - markdown-feature-docs-parser.ts
  - markdown-canonical-edge-vocabulary.ts
  - drizzle-mirror-projection-repository.ts
- backend/src/modules/knowledge-graph/interface/
  - http-routes.ts

## Function-First Signatures

### Application Use-Cases

- makeRebuildMirrorProjectionUseCase(dependencies)
  - input: { featureId, sourceFiles, requestedBy, generatedAt? }
  - output: { projection, cardCount, coverageRatio, edgeDensity }
  - validates:
    - required files (R1)
    - canonical edge labels (R3)
    - edge endpoint resolution (R4)
  - persists projection atomically (R5)

- makeGetLatestMirrorProjectionQuery(repository)
  - input: featureId
  - output: latest projection snapshot

### Infrastructure Adapters

- createMarkdownFeatureDocsParser(config)
  - scanFeatureFiles(input)
  - parseSpec(input)

- createMarkdownCanonicalEdgeVocabulary(config)
  - loadCanonicalEdges()

- createDrizzleMirrorProjectionRepository(config)
  - saveProjection(projection)
  - getLatestProjection(featureId)
  - close()

## Boundary Rules (Hard)

- Infrastructure only:
  - file I/O and markdown parsing
  - Drizzle and SQLite persistence details
- Application only:
  - canonical validation and rejection logic
  - use-case orchestration and calculation outputs
- Interface only:
  - HTTP request/response parsing and error mapping

## Determinism Rules

- Required files ordered: SPEC.md, domain.md, operations.md
- Concepts sorted by conceptId
- Edges sorted by from, edge, to, evidence
- Mirror cards sorted by required-file priority then lexical fallback

## Test Scaffold Mapping

- KG-OP-001
  - missing required file rejects with MIRROR_REQUIRED_FILE_MISSING
- KG-OP-002
  - unknown endpoint rejects with MIRROR_EDGE_ENDPOINT_UNKNOWN
- KG-OP-005
  - rebuild materializes and persists one snapshot atomically
- KG-API-001
  - mirror-cards endpoint returns required cards
- KG-API-002
  - graph endpoint edges are canonical
- KG-API-005
  - read endpoints return latest persisted snapshot

## Implementation Checklist

1. Build parser adapter from SPEC concept and graph tables.
2. Materialize FeatureDocument, ConceptDefinition, RelationshipEdge, MirrorProjection as domain shapes.
3. Validate canonical edge labels against RELATIONSHIPS subset.
4. Validate edge endpoints against parsed concept IDs.
5. Persist projection through Drizzle repository transaction.
6. Expose rebuild and read endpoints.
7. Execute test obligations above.
