# CODE-TAG-DRIFT-REPORT

- Mode: strict
- Input: governance/tags/code-tags.json
- Features root: docs/features

## Summary

- Doc triples: 38
- Code triples: 0
- Docs only: 38
- Code only: 0
- Direction mismatch: 0
- Type mismatch: 0

## Docs Only (missing in code tags)

| From                                                         | Edge         | To                                                       | Source                                                  |
| ------------------------------------------------------------ | ------------ | -------------------------------------------------------- | ------------------------------------------------------- |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.FeatureDocument            | docs/features/knowledge-graph-visualization/SPEC.md:98  |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:99  |
| knowledge-graph-visualization.DocumentToMirrorCardAdapter    | shapes       | knowledge-graph-visualization.MirrorCardView             | docs/features/knowledge-graph-visualization/SPEC.md:100 |
| knowledge-graph-visualization.ConceptToDetailCardAdapter     | shapes       | knowledge-graph-visualization.ConceptDetailCard          | docs/features/knowledge-graph-visualization/SPEC.md:101 |
| knowledge-graph-visualization.CardSyncPolicy                 | applies      | knowledge-graph-visualization.RebuildMirrorProjection    | docs/features/knowledge-graph-visualization/SPEC.md:102 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection    | docs/features/knowledge-graph-visualization/SPEC.md:103 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:104 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:105 |
| knowledge-graph-visualization.RebuildMirrorProjection        | produces     | knowledge-graph-visualization.MirrorProjectionBuilt      | docs/features/knowledge-graph-visualization/SPEC.md:106 |
| knowledge-graph-visualization.SelectConcept                  | produces     | knowledge-graph-visualization.ConceptSelected            | docs/features/knowledge-graph-visualization/SPEC.md:107 |
| knowledge-graph-visualization.OpenDefinition                 | produces     | knowledge-graph-visualization.DefinitionOpened           | docs/features/knowledge-graph-visualization/SPEC.md:108 |
| knowledge-graph-visualization.ConceptSelected                | transitions  | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:109 |
| knowledge-graph-visualization.DefinitionOpened               | transitions  | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:110 |
| knowledge-graph-visualization.GetMirrorCards                 | queries      | knowledge-graph-visualization.MirrorProjection           | docs/features/knowledge-graph-visualization/SPEC.md:111 |
| knowledge-graph-visualization.GetRelationshipGraph           | queries      | knowledge-graph-visualization.MirrorProjection           | docs/features/knowledge-graph-visualization/SPEC.md:112 |
| knowledge-graph-visualization.GetConceptDetailCard           | queries      | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:113 |
| knowledge-graph-visualization.GetDefinitionPointer           | queries      | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:114 |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetMirrorCards             | docs/features/knowledge-graph-visualization/SPEC.md:115 |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetRelationshipGraph       | docs/features/knowledge-graph-visualization/SPEC.md:116 |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetConceptDetailCard       | docs/features/knowledge-graph-visualization/SPEC.md:117 |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetDefinitionPointer       | docs/features/knowledge-graph-visualization/SPEC.md:118 |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:119 |
| knowledge-graph-visualization.KnowledgeGraphModule           | exposes      | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:120 |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetMirrorCards             | docs/features/knowledge-graph-visualization/SPEC.md:121 |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetRelationshipGraph       | docs/features/knowledge-graph-visualization/SPEC.md:122 |
| ui.knowledge-graph-visualization.ConceptFocusBinding         | mutates      | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:123 |
| ui.knowledge-graph-visualization.DefinitionNavigationBinding | mutates      | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:124 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.MirrorCardGrid          | docs/features/knowledge-graph-visualization/SPEC.md:125 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.RelationshipGraphCanvas | docs/features/knowledge-graph-visualization/SPEC.md:126 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.ConceptDetailPanel      | docs/features/knowledge-graph-visualization/SPEC.md:127 |
| ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | wraps        | ui.knowledge-graph-visualization.route.canvas            | docs/features/knowledge-graph-visualization/SPEC.md:128 |
| ui.knowledge-graph-visualization.MirrorCardGrid              | consumes     | ui.knowledge-graph-visualization.useMirrorGraph          | docs/features/knowledge-graph-visualization/SPEC.md:129 |
| ui.knowledge-graph-visualization.RelationshipGraphCanvas     | consumes     | ui.knowledge-graph-visualization.useConceptFocus         | docs/features/knowledge-graph-visualization/SPEC.md:130 |
| ui.knowledge-graph-visualization.ConceptDetailPanel          | displays     | knowledge-graph-visualization.ConceptDetailCard          | docs/features/knowledge-graph-visualization/SPEC.md:131 |
| ui.knowledge-graph-visualization.FocusStateIndicator         | reflects     | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:132 |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.RelationshipEdge           | docs/features/knowledge-graph-visualization/SPEC.md:133 |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.MirrorCardView             | docs/features/knowledge-graph-visualization/SPEC.md:134 |
| knowledge-graph-visualization.ConceptDefinition              | contains     | knowledge-graph-visualization.DefinitionPointer          | docs/features/knowledge-graph-visualization/SPEC.md:135 |

## Code Only (missing in docs)

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Direction Mismatch

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Type Mismatch

| Concept ID | Code Type | Doc Type | Source |
| ---------- | --------- | -------- | ------ |
