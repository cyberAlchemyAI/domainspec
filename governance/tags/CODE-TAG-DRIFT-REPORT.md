# CODE-TAG-DRIFT-REPORT

- Mode: strict
- Input: governance/tags/code-tags.json
- Features root: docs/features/knowledge-graph-visualization

## Summary

- Doc triples: 46
- Code triples: 17
- Docs only: 30
- Code only: 0
- Direction mismatch: 0
- Type mismatch: 0

## Docs Only (missing in code tags)

| From                                                         | Edge         | To                                                       | Source                                                  |
| ------------------------------------------------------------ | ------------ | -------------------------------------------------------- | ------------------------------------------------------- |
| knowledge-graph-visualization.ResolveProjectionScope         | maps         | knowledge-graph-visualization.DocumentationWorkspace     | docs/features/knowledge-graph-visualization/SPEC.md:143 |
| knowledge-graph-visualization.ResolveProjectionScope         | produces     | knowledge-graph-visualization.ProjectionScope            | docs/features/knowledge-graph-visualization/SPEC.md:144 |
| knowledge-graph-visualization.RebuildMirrorProjection        | applies      | knowledge-graph-visualization.ProjectionScope            | docs/features/knowledge-graph-visualization/SPEC.md:146 |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.FeatureDocument            | docs/features/knowledge-graph-visualization/SPEC.md:147 |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:148 |
| knowledge-graph-visualization.DocumentToMirrorCardAdapter    | shapes       | knowledge-graph-visualization.MirrorCardView             | docs/features/knowledge-graph-visualization/SPEC.md:149 |
| knowledge-graph-visualization.ConceptToDetailCardAdapter     | shapes       | knowledge-graph-visualization.ConceptDetailCard          | docs/features/knowledge-graph-visualization/SPEC.md:150 |
| knowledge-graph-visualization.CardSyncPolicy                 | applies      | knowledge-graph-visualization.RebuildMirrorProjection    | docs/features/knowledge-graph-visualization/SPEC.md:151 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection    | docs/features/knowledge-graph-visualization/SPEC.md:152 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:153 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:154 |
| knowledge-graph-visualization.RebuildMirrorProjection        | produces     | knowledge-graph-visualization.MirrorProjectionBuilt      | docs/features/knowledge-graph-visualization/SPEC.md:155 |
| knowledge-graph-visualization.ConceptSelected                | transitions  | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:158 |
| knowledge-graph-visualization.DefinitionOpened               | transitions  | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:159 |
| knowledge-graph-visualization.KnowledgeGraphModule           | exposes      | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:173 |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetMirrorCards             | docs/features/knowledge-graph-visualization/SPEC.md:174 |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetRelationshipGraph       | docs/features/knowledge-graph-visualization/SPEC.md:175 |
| ui.knowledge-graph-visualization.ConceptFocusBinding         | mutates      | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:176 |
| ui.knowledge-graph-visualization.DefinitionNavigationBinding | mutates      | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:177 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.MirrorCardGrid          | docs/features/knowledge-graph-visualization/SPEC.md:178 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.RelationshipGraphCanvas | docs/features/knowledge-graph-visualization/SPEC.md:179 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.ConceptDetailPanel      | docs/features/knowledge-graph-visualization/SPEC.md:180 |
| ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | wraps        | ui.knowledge-graph-visualization.route.canvas            | docs/features/knowledge-graph-visualization/SPEC.md:181 |
| ui.knowledge-graph-visualization.MirrorCardGrid              | consumes     | ui.knowledge-graph-visualization.useMirrorGraph          | docs/features/knowledge-graph-visualization/SPEC.md:182 |
| ui.knowledge-graph-visualization.RelationshipGraphCanvas     | consumes     | ui.knowledge-graph-visualization.useConceptFocus         | docs/features/knowledge-graph-visualization/SPEC.md:183 |
| ui.knowledge-graph-visualization.ConceptDetailPanel          | displays     | knowledge-graph-visualization.ConceptDetailCard          | docs/features/knowledge-graph-visualization/SPEC.md:184 |
| ui.knowledge-graph-visualization.FocusStateIndicator         | reflects     | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:185 |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.RelationshipEdge           | docs/features/knowledge-graph-visualization/SPEC.md:186 |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.MirrorCardView             | docs/features/knowledge-graph-visualization/SPEC.md:187 |
| knowledge-graph-visualization.ConceptDefinition              | contains     | knowledge-graph-visualization.DefinitionPointer          | docs/features/knowledge-graph-visualization/SPEC.md:188 |

## Code Only (missing in docs)

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Direction Mismatch

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Type Mismatch

| Concept ID | Code Type | Doc Type | Source |
| ---------- | --------- | -------- | ------ |
