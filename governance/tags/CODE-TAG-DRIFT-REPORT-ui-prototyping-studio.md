# CODE-TAG-DRIFT-REPORT

- Mode: strict
- Input: governance/tags/code-tags-ui-prototyping-studio.json
- Features root: docs/features

## Summary

- Doc triples: 73
- Code triples: 14
- Docs only: 59
- Code only: 0
- Direction mismatch: 0
- Type mismatch: 0

## Docs Only (missing in code tags)

| From                                                      | Edge         | To                                                       | Source                                                  |
| --------------------------------------------------------- | ------------ | -------------------------------------------------------- | ------------------------------------------------------- |
| knowledge-graph-visualization.ProjectSourceRegistry       | exposes      | knowledge-graph-visualization.ResolveProjectionScope     | docs/features/knowledge-graph-visualization/SPEC.md:143 |
| knowledge-graph-visualization.DocumentToConceptMapping    | maps         | knowledge-graph-visualization.FeatureDocument            | docs/features/knowledge-graph-visualization/SPEC.md:144 |
| knowledge-graph-visualization.DocumentToConceptMapping    | maps         | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:145 |
| knowledge-graph-visualization.DocumentToMirrorCardAdapter | shapes       | knowledge-graph-visualization.MirrorCardView             | docs/features/knowledge-graph-visualization/SPEC.md:146 |
| knowledge-graph-visualization.ConceptToDetailCardAdapter  | shapes       | knowledge-graph-visualization.ConceptDetailCard          | docs/features/knowledge-graph-visualization/SPEC.md:147 |
| knowledge-graph-visualization.CardSyncPolicy              | applies      | knowledge-graph-visualization.RebuildMirrorProjection    | docs/features/knowledge-graph-visualization/SPEC.md:148 |
| knowledge-graph-visualization.MirrorInteractionWorkflow   | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection    | docs/features/knowledge-graph-visualization/SPEC.md:149 |
| knowledge-graph-visualization.MirrorInteractionWorkflow   | orchestrates | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:150 |
| knowledge-graph-visualization.MirrorInteractionWorkflow   | orchestrates | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:151 |
| knowledge-graph-visualization.RebuildMirrorProjection     | produces     | knowledge-graph-visualization.MirrorProjectionBuilt      | docs/features/knowledge-graph-visualization/SPEC.md:152 |
| knowledge-graph-visualization.SelectConcept               | produces     | knowledge-graph-visualization.ConceptSelected            | docs/features/knowledge-graph-visualization/SPEC.md:153 |
| knowledge-graph-visualization.OpenDefinition              | produces     | knowledge-graph-visualization.DefinitionOpened           | docs/features/knowledge-graph-visualization/SPEC.md:154 |
| knowledge-graph-visualization.ConceptSelected             | transitions  | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:155 |
| knowledge-graph-visualization.DefinitionOpened            | transitions  | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:156 |
| knowledge-graph-visualization.GetMirrorCards              | queries      | knowledge-graph-visualization.MirrorProjection           | docs/features/knowledge-graph-visualization/SPEC.md:157 |
| knowledge-graph-visualization.GetMirrorCards              | queries      | knowledge-graph-visualization.DocumentationWorkspace     | docs/features/knowledge-graph-visualization/SPEC.md:158 |
| knowledge-graph-visualization.GetRelationshipGraph        | queries      | knowledge-graph-visualization.MirrorProjection           | docs/features/knowledge-graph-visualization/SPEC.md:159 |
| knowledge-graph-visualization.GetRelationshipGraph        | queries      | knowledge-graph-visualization.DocumentationWorkspace     | docs/features/knowledge-graph-visualization/SPEC.md:160 |
| knowledge-graph-visualization.GetConceptDetailCard        | queries      | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:161 |
| knowledge-graph-visualization.GetConceptDetailCard        | queries      | knowledge-graph-visualization.DocumentationWorkspace     | docs/features/knowledge-graph-visualization/SPEC.md:162 |
| knowledge-graph-visualization.GetDefinitionPointer        | queries      | knowledge-graph-visualization.ConceptDefinition          | docs/features/knowledge-graph-visualization/SPEC.md:163 |
| knowledge-graph-visualization.GetDefinitionPointer        | queries      | knowledge-graph-visualization.DocumentationWorkspace     | docs/features/knowledge-graph-visualization/SPEC.md:164 |
| knowledge-graph-visualization.KnowledgeGraphAPI           | exposes      | knowledge-graph-visualization.GetMirrorCards             | docs/features/knowledge-graph-visualization/SPEC.md:165 |
| knowledge-graph-visualization.KnowledgeGraphAPI           | exposes      | knowledge-graph-visualization.GetRelationshipGraph       | docs/features/knowledge-graph-visualization/SPEC.md:166 |
| knowledge-graph-visualization.KnowledgeGraphAPI           | exposes      | knowledge-graph-visualization.GetConceptDetailCard       | docs/features/knowledge-graph-visualization/SPEC.md:167 |
| knowledge-graph-visualization.KnowledgeGraphAPI           | exposes      | knowledge-graph-visualization.GetDefinitionPointer       | docs/features/knowledge-graph-visualization/SPEC.md:168 |
| knowledge-graph-visualization.KnowledgeGraphAPI           | exposes      | knowledge-graph-visualization.OpenDefinition             | docs/features/knowledge-graph-visualization/SPEC.md:169 |
| knowledge-graph-visualization.KnowledgeGraphModule        | exposes      | knowledge-graph-visualization.SelectConcept              | docs/features/knowledge-graph-visualization/SPEC.md:170 |
| ui.knowledge-graph-visualization.route.canvas             | renders      | ui.knowledge-graph-visualization.MirrorCardGrid          | docs/features/knowledge-graph-visualization/SPEC.md:175 |
| ui.knowledge-graph-visualization.route.canvas             | renders      | ui.knowledge-graph-visualization.RelationshipGraphCanvas | docs/features/knowledge-graph-visualization/SPEC.md:176 |
| ui.knowledge-graph-visualization.route.canvas             | renders      | ui.knowledge-graph-visualization.ConceptDetailPanel      | docs/features/knowledge-graph-visualization/SPEC.md:177 |
| ui.knowledge-graph-visualization.MirrorCardGrid           | consumes     | ui.knowledge-graph-visualization.useMirrorGraph          | docs/features/knowledge-graph-visualization/SPEC.md:179 |
| ui.knowledge-graph-visualization.RelationshipGraphCanvas  | consumes     | ui.knowledge-graph-visualization.useConceptFocus         | docs/features/knowledge-graph-visualization/SPEC.md:180 |
| ui.knowledge-graph-visualization.ConceptDetailPanel       | displays     | knowledge-graph-visualization.ConceptDetailCard          | docs/features/knowledge-graph-visualization/SPEC.md:181 |
| ui.knowledge-graph-visualization.FocusStateIndicator      | reflects     | knowledge-graph-visualization.ExplorationState           | docs/features/knowledge-graph-visualization/SPEC.md:182 |
| knowledge-graph-visualization.MirrorProjection            | contains     | knowledge-graph-visualization.RelationshipEdge           | docs/features/knowledge-graph-visualization/SPEC.md:183 |
| knowledge-graph-visualization.ConceptDefinition           | contains     | knowledge-graph-visualization.DefinitionPointer          | docs/features/knowledge-graph-visualization/SPEC.md:184 |
| ui-prototyping-studio.InitializeSession                   | enforces     | ui-prototyping-studio.VariantCount                       | ui-prototyping-studio:SPEC.md:190                       |
| ui-prototyping-studio.SubmitPrompt                        | transitions  | ui-prototyping-studio.StudioSessionState                 | ui-prototyping-studio:SPEC.md:191                       |
| ui-prototyping-studio.GenerateVariants                    | produces     | ui-prototyping-studio.PrototypeVariant                   | ui-prototyping-studio:SPEC.md:192                       |
| ui-prototyping-studio.SelectOrCommitBaseline              | transitions  | ui-prototyping-studio.StudioSessionState                 | ui-prototyping-studio:SPEC.md:193                       |
| ui-prototyping-studio.CaptureCommentEvent                 | produces     | ui-prototyping-studio.CommentEvent                       | ui-prototyping-studio:SPEC.md:194                       |
| ui-prototyping-studio.SynthesizeMutationBatch             | produces     | ui-prototyping-studio.MutationBatch                      | ui-prototyping-studio:SPEC.md:195                       |
| ui-prototyping-studio.ApproveMutationBatch                | transitions  | ui-prototyping-studio.MutationBatchStatus                | ui-prototyping-studio:SPEC.md:196                       |
| ui-prototyping-studio.ApplyApprovedBatch                  | produces     | ui-prototyping-studio.RevisionManifestEntry              | ui-prototyping-studio:SPEC.md:197                       |
| ui-prototyping-studio.ExportDesignHandoff                 | exposes      | ui-prototyping-studio.GetHandoffBundle                   | ui-prototyping-studio:SPEC.md:198                       |
| ui-prototyping-studio.GetDraftMutationBatch               | queries      | ui-prototyping-studio.MutationBatch                      | ui-prototyping-studio:SPEC.md:201                       |
| ui-prototyping-studio.ListRevisionManifest                | queries      | ui-prototyping-studio.RevisionManifestEntry              | ui-prototyping-studio:SPEC.md:202                       |
| ui-prototyping-studio.GetHandoffBundle                    | queries      | ui-prototyping-studio.RevisionManifestEntry              | ui-prototyping-studio:SPEC.md:203                       |
| ui-prototyping-studio.UIPrototypingStudioAPI              | exposes      | ui-prototyping-studio.ApplyApprovedBatch                 | ui-prototyping-studio:SPEC.md:210                       |
| ui-prototyping-studio.StudioOrchestrationModule           | exposes      | ui-prototyping-studio.MVPStudioIterationWorkflow         | ui-prototyping-studio:SPEC.md:211                       |
| ui-prototyping-studio.NewspaperContractAdapter            | maps         | ui-prototyping-studio.CommentEvent                       | ui-prototyping-studio:SPEC.md:212                       |
| ui-prototyping-studio.NewspaperContractAdapter            | maps         | ui-prototyping-studio.MutationBatch                      | ui-prototyping-studio:SPEC.md:213                       |
| ui-prototyping-studio.NewspaperContractAdapter            | maps         | ui-prototyping-studio.RevisionManifestEntry              | ui-prototyping-studio:SPEC.md:214                       |
| ui-prototyping-studio.MVPStudioIterationWorkflow          | orchestrates | ui-prototyping-studio.ApplyApprovedBatch                 | ui-prototyping-studio:SPEC.md:215                       |
| ui-prototyping-studio.GovernanceGatePolicy                | enforces     | ui-prototyping-studio.ApplyApprovedBatch                 | ui-prototyping-studio:SPEC.md:216                       |
| ui-prototyping-studio.StudioSessionState                  | enforces     | ui-prototyping-studio.VariantCount                       | ui-prototyping-studio:SPEC.md:217                       |
| ui-prototyping-studio.StudioWorkbenchPage                 | renders      | ui-prototyping-studio.AnnotationPanel                    | ui-prototyping-studio:SPEC.md:219                       |
| ui-prototyping-studio.StudioWorkbenchPage                 | renders      | ui-prototyping-studio.MutationApprovalPanel              | ui-prototyping-studio:SPEC.md:220                       |

## Code Only (missing in docs)

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Direction Mismatch

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Type Mismatch

| Concept ID | Code Type | Doc Type | Source |
| ---------- | --------- | -------- | ------ |
