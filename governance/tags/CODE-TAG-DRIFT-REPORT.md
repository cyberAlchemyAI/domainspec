# CODE-TAG-DRIFT-REPORT

- Mode: strict
- Input: governance/tags/code-tags.json
- Features root: docs/features

## Summary

- Doc triples: 46
- Code triples: 29
- Docs only: 18
- Code only: 0
- Direction mismatch: 0
- Type mismatch: 0

## Docs Only (missing in code tags)

| From                                                      | Edge         | To                                                    | Source                                                  |
| --------------------------------------------------------- | ------------ | ----------------------------------------------------- | ------------------------------------------------------- |
| knowledge-graph-visualization.ResolveProjectionScope      | maps         | knowledge-graph-visualization.DocumentationWorkspace  | docs/features/knowledge-graph-visualization/SPEC.md:143 |
| knowledge-graph-visualization.ResolveProjectionScope      | produces     | knowledge-graph-visualization.ProjectionScope         | docs/features/knowledge-graph-visualization/SPEC.md:144 |
| knowledge-graph-visualization.RebuildMirrorProjection     | applies      | knowledge-graph-visualization.ProjectionScope         | docs/features/knowledge-graph-visualization/SPEC.md:146 |
| knowledge-graph-visualization.DocumentToConceptMapping    | maps         | knowledge-graph-visualization.FeatureDocument         | docs/features/knowledge-graph-visualization/SPEC.md:147 |
| knowledge-graph-visualization.DocumentToConceptMapping    | maps         | knowledge-graph-visualization.ConceptDefinition       | docs/features/knowledge-graph-visualization/SPEC.md:148 |
| knowledge-graph-visualization.DocumentToMirrorCardAdapter | shapes       | knowledge-graph-visualization.MirrorCardView          | docs/features/knowledge-graph-visualization/SPEC.md:149 |
| knowledge-graph-visualization.ConceptToDetailCardAdapter  | shapes       | knowledge-graph-visualization.ConceptDetailCard       | docs/features/knowledge-graph-visualization/SPEC.md:150 |
| knowledge-graph-visualization.CardSyncPolicy              | applies      | knowledge-graph-visualization.RebuildMirrorProjection | docs/features/knowledge-graph-visualization/SPEC.md:151 |
| knowledge-graph-visualization.MirrorInteractionWorkflow   | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection | docs/features/knowledge-graph-visualization/SPEC.md:152 |
| knowledge-graph-visualization.MirrorInteractionWorkflow   | orchestrates | knowledge-graph-visualization.SelectConcept           | docs/features/knowledge-graph-visualization/SPEC.md:153 |
| knowledge-graph-visualization.MirrorInteractionWorkflow   | orchestrates | knowledge-graph-visualization.OpenDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:154 |
| knowledge-graph-visualization.RebuildMirrorProjection     | produces     | knowledge-graph-visualization.MirrorProjectionBuilt   | docs/features/knowledge-graph-visualization/SPEC.md:155 |
| knowledge-graph-visualization.ConceptSelected             | transitions  | knowledge-graph-visualization.ExplorationState        | docs/features/knowledge-graph-visualization/SPEC.md:158 |
| knowledge-graph-visualization.DefinitionOpened            | transitions  | knowledge-graph-visualization.ExplorationState        | docs/features/knowledge-graph-visualization/SPEC.md:159 |
| knowledge-graph-visualization.KnowledgeGraphModule        | exposes      | knowledge-graph-visualization.SelectConcept           | docs/features/knowledge-graph-visualization/SPEC.md:173 |
| knowledge-graph-visualization.MirrorProjection            | contains     | knowledge-graph-visualization.RelationshipEdge        | docs/features/knowledge-graph-visualization/SPEC.md:186 |
| knowledge-graph-visualization.MirrorProjection            | contains     | knowledge-graph-visualization.MirrorCardView          | docs/features/knowledge-graph-visualization/SPEC.md:187 |
| knowledge-graph-visualization.ConceptDefinition           | contains     | knowledge-graph-visualization.DefinitionPointer       | docs/features/knowledge-graph-visualization/SPEC.md:188 |

## Code Only (missing in docs)

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Direction Mismatch

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Type Mismatch

| Concept ID | Code Type | Doc Type | Source |
| ---------- | --------- | -------- | ------ |
