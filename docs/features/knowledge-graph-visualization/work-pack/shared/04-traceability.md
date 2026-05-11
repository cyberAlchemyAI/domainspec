# Traceability

## Task-to-Capability Mapping

| Task ID                                                                | Capability Focus                                   | Capability Anchors                                                                                                                                     | Concept/Contract IDs                                               |
| ---------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [TASK-KG-ALG-01](../tasks/TASK-KG-ALG-01.md)                           | Deterministic algorithm contract freeze            | [../../SPEC.md](../../SPEC.md#graph-layout--edge-semantics-algorithm)                                                                                  | FR-001..FR-004, AC-001..AC-006, INV-001..INV-003, RelationshipEdge |
| [TASK-KG-ALG-02](../tasks/TASK-KG-ALG-02.md)                           | Source registry abstraction + full-index ingestion | [../../operations.md](../../operations.md#resolveprojectionscope), [../../interfaces.md](../../interfaces.md#internal-projectsourceregistry-interface) | ResolveProjectionScope.R1..R3, RebuildMirrorProjection.R0..R6      |
| [TASK-KG-ALG-03](../tasks/TASK-KG-ALG-03.md)                           | Concept-card enrichment (rules/descriptions)       | [../../queries.md](../../queries.md#getconceptdetailcard), [../../mappings.md](../../mappings.md#concepttodetailcardadapter)                           | ConceptDefinition, ConceptDetailCard, KG-BE-QRY-009..012           |
| [TASK-KG-ALG-04](../tasks/TASK-KG-ALG-04.md)                           | Prototype-to-contract UI behavior mapping          | [../../WHITEBOARD-PROTOTYPE.html](../../WHITEBOARD-PROTOTYPE.html), [../../UI-SPEC.md](../../UI-SPEC.md#interaction-contract)                          | KG-UI-NAV-001..002, KG-UI-JRN-001..004, KG-UI-STATE-001..004       |
| [TASK-KG-ALG-05](../tasks/TASK-KG-ALG-05.md)                           | Verification and audit closure planning            | [../../TEST-SPEC.md](../../TEST-SPEC.md), [../../STORIES.md](../../STORIES.md)                                                                         | KG-BE-_ and KG-UI-_ closure envelopes                              |
| [TASK-KG-ALG-VERIFY](../tasks/TASK-KG-ALG-VERIFY.md)                   | Feature verification                               | [../../SPEC.md](../../SPEC.md), [../../TEST-SPEC.md](../../TEST-SPEC.md)                                                                               | verify-feature obligations                                         |
| [TASK-KG-ALG-AUDIT-ALIGNMENT](../tasks/TASK-KG-ALG-AUDIT-ALIGNMENT.md) | Alignment closure                                  | [../../SPEC.md](../../SPEC.md), [../../operations.md](../../operations.md)                                                                             | alignment audit obligations                                        |
| [TASK-KG-ALG-AUDIT-LAYERING](../tasks/TASK-KG-ALG-AUDIT-LAYERING.md)   | Layering closure                                   | [../../domain.md](../../domain.md), [../../interfaces.md](../../interfaces.md)                                                                         | layering audit obligations                                         |

## Feature -> File -> Concept Contract Freeze Seeds

| Level   | Canonical Source                                                                                                                                                                                                                                                                         | Freeze Objective                                                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Feature | [../../SPEC.md](../../SPEC.md)                                                                                                                                                                                                                                                           | Fix capability, FR/AC/INV, and relationship-index authority for algorithm planning. |
| File    | [../../domain.md](../../domain.md), [../../operations.md](../../operations.md), [../../queries.md](../../queries.md), [../../interfaces.md](../../interfaces.md), [../../mappings.md](../../mappings.md), [../../UI-SPEC.md](../../UI-SPEC.md), [../../TEST-SPEC.md](../../TEST-SPEC.md) | Freeze concept and behavior extraction boundaries per aspect file.                  |
| Concept | [../../domain.md](../../domain.md#conceptdefinition), [../../domain.md](../../domain.md#relationshipedge), [../../queries.md](../../queries.md#getconceptdetailcard)                                                                                                                     | Freeze concept-card identity, relation semantics, and enrichment field contract.    |

## Closure Remediation Track (Ordered)

1. Execute [TASK-KG-ALG-VERIFY](../tasks/TASK-KG-ALG-VERIFY.md) and capture baseline verification verdict.
2. Execute [TASK-KG-ALG-AUDIT-ALIGNMENT](../tasks/TASK-KG-ALG-AUDIT-ALIGNMENT.md); normalize findings by severity and impacted contracts.
3. Execute [TASK-KG-ALG-AUDIT-LAYERING](../tasks/TASK-KG-ALG-AUDIT-LAYERING.md); normalize findings by layer boundary and dependency direction.
4. Merge alignment + layering findings into one dependency-ordered remediation queue (highest severity first, then dependency unlock order).
5. Re-run verification after remediation set closure.

## Markdown Link Validation Obligations

Run per-file checks as tasks progress:

1. `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/WORK-PACK.md`
2. `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/shared/01-context.md`
3. `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/shared/02-cross-task-gaps-and-questions.md`
4. `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/shared/03-cross-task-decisions.md`
5. `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/shared/04-traceability.md`

Task-level link checks are listed in each task artifact.
