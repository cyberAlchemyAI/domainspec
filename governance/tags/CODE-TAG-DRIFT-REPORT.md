# CODE-TAG-DRIFT-REPORT

- Mode: strict
- Input: governance/tags/code-tags.json
- Features root: docs/features/agent-execution-orchestrator

## Summary

- Doc triples: 12
- Code triples: 49
- Docs only: 12
- Code only: 49
- Direction mismatch: 0
- Type mismatch: 0

## Docs Only (missing in code tags)

| From                                                            | Edge         | To                                                    | Source                                                 |
| --------------------------------------------------------------- | ------------ | ----------------------------------------------------- | ------------------------------------------------------ |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow   | orchestrates | agent-execution-orchestrator.ExecutePipelineRoute     | docs/features/agent-execution-orchestrator/SPEC.md:168 |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow   | orchestrates | agent-execution-orchestrator.EmitGovernanceSignals    | docs/features/agent-execution-orchestrator/SPEC.md:169 |
| agent-execution-orchestrator.AssemblePipelineRoute              | enforces     | agent-execution-orchestrator.StageContract            | docs/features/agent-execution-orchestrator/SPEC.md:170 |
| agent-execution-orchestrator.PipelineRouteTemplate              | contains     | agent-execution-orchestrator.StageContract            | docs/features/agent-execution-orchestrator/SPEC.md:171 |
| agent-execution-orchestrator.RunStateMachine                    | enforces     | agent-execution-orchestrator.ExecutePipelineRoute     | docs/features/agent-execution-orchestrator/SPEC.md:172 |
| agent-execution-orchestrator.BranchStrategyPolicy               | applies      | agent-execution-orchestrator.ExecutePipelineRoute     | docs/features/agent-execution-orchestrator/SPEC.md:173 |
| agent-execution-orchestrator.CancellationPolicy                 | applies      | agent-execution-orchestrator.CancelSupersededRun      | docs/features/agent-execution-orchestrator/SPEC.md:174 |
| agent-execution-orchestrator.RouteArtifactInterface             | exposes      | agent-execution-orchestrator.AssemblePipelineRoute    | docs/features/agent-execution-orchestrator/SPEC.md:175 |
| agent-execution-orchestrator.SandboxProviderInterface           | exposes      | agent-execution-orchestrator.ExecutePipelineRoute     | docs/features/agent-execution-orchestrator/SPEC.md:176 |
| agent-execution-orchestrator.DelegationTelemetryLedgerInterface | exposes      | agent-execution-orchestrator.EmitGovernanceSignals    | docs/features/agent-execution-orchestrator/SPEC.md:177 |
| agent-execution-orchestrator.RunArtifactMapping                 | maps         | agent-execution-orchestrator.TelemetryEnvelope        | docs/features/agent-execution-orchestrator/SPEC.md:178 |
| agent-execution-orchestrator.EmitGovernanceSignals              | produces     | agent-execution-orchestrator.GovernanceSignalEmission | docs/features/agent-execution-orchestrator/SPEC.md:179 |

## Code Only (missing in docs)

| From                                                         | Edge         | To                                                    | Source                                                                                     |
| ------------------------------------------------------------ | ------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ui.knowledge-graph-visualization.MirrorCardGrid              | consumes     | ui.knowledge-graph-visualization.useMirrorGraph       | apps/web/src/components/knowledge-graph/AspectCardRail.tsx:15                              |
| ui.knowledge-graph-visualization.ConceptDetailPanel          | displays     | knowledge-graph-visualization.ConceptDetailCard       | apps/web/src/components/knowledge-graph/CardInspectorPanel.tsx:15                          |
| ui.knowledge-graph-visualization.FocusStateIndicator         | reflects     | knowledge-graph-visualization.ExplorationState        | apps/web/src/components/knowledge-graph/FocusStateIndicator.tsx:14                         |
| ui.knowledge-graph-visualization.RelationshipGraphCanvas     | consumes     | ui.knowledge-graph-visualization.useConceptFocus      | apps/web/src/components/knowledge-graph/WhiteboardCanvas.tsx:34                            |
| ui.knowledge-graph-visualization.DefinitionNavigationBinding | mutates      | knowledge-graph-visualization.OpenDefinition          | apps/web/src/hooks/useConceptFocus.ts:191                                                  |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetMirrorCards          | apps/web/src/hooks/useMirrorGraph.ts:107                                                   |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetRelationshipGraph    | apps/web/src/hooks/useMirrorGraph.ts:107                                                   |
| ui.knowledge-graph-visualization.ConceptFocusBinding         | mutates      | knowledge-graph-visualization.SelectConcept           | apps/web/src/hooks/useMirrorGraph.ts:350                                                   |
| ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | wraps        | ui.knowledge-graph-visualization.route.canvas         | apps/web/src/layouts/KnowledgeGraphPageLayout.tsx:41                                       |
| ui-prototyping-studio.StudioWorkbenchPage                    | renders      | ui-prototyping-studio.VariantCanvas                   | apps/web/src/layouts/StudioWorkbenchLayout.tsx:53                                          |
| knowledge-graph-visualization.ConceptToDetailCardAdapter     | shapes       | knowledge-graph-visualization.ConceptDetailCard       | backend/src/modules/knowledge-graph/application/get-concept-detail-card.ts:101             |
| knowledge-graph-visualization.GetConceptDetailCard           | queries      | knowledge-graph-visualization.ConceptDefinition       | backend/src/modules/knowledge-graph/application/get-concept-detail-card.ts:24              |
| knowledge-graph-visualization.GetConceptDetailCard           | queries      | knowledge-graph-visualization.DocumentationWorkspace  | backend/src/modules/knowledge-graph/application/get-concept-detail-card.ts:24              |
| knowledge-graph-visualization.GetDefinitionPointer           | queries      | knowledge-graph-visualization.ConceptDefinition       | backend/src/modules/knowledge-graph/application/get-definition-pointer.ts:21               |
| knowledge-graph-visualization.GetDefinitionPointer           | queries      | knowledge-graph-visualization.DocumentationWorkspace  | backend/src/modules/knowledge-graph/application/get-definition-pointer.ts:21               |
| knowledge-graph-visualization.GetMirrorCards                 | queries      | knowledge-graph-visualization.MirrorProjection        | backend/src/modules/knowledge-graph/application/get-latest-mirror-projection.ts:73         |
| knowledge-graph-visualization.GetMirrorCards                 | queries      | knowledge-graph-visualization.DocumentationWorkspace  | backend/src/modules/knowledge-graph/application/get-latest-mirror-projection.ts:73         |
| knowledge-graph-visualization.GetRelationshipGraph           | queries      | knowledge-graph-visualization.MirrorProjection        | backend/src/modules/knowledge-graph/application/get-latest-mirror-projection.ts:108        |
| knowledge-graph-visualization.GetRelationshipGraph           | queries      | knowledge-graph-visualization.DocumentationWorkspace  | backend/src/modules/knowledge-graph/application/get-latest-mirror-projection.ts:108        |
| knowledge-graph-visualization.OpenDefinition                 | produces     | knowledge-graph-visualization.DefinitionOpened        | backend/src/modules/knowledge-graph/application/open-definition.ts:38                      |
| knowledge-graph-visualization.DefinitionOpened               | transitions  | knowledge-graph-visualization.ExplorationState        | backend/src/modules/knowledge-graph/application/open-definition.ts:19                      |
| knowledge-graph-visualization.ProjectSourceRegistry          | exposes      | knowledge-graph-visualization.ResolveProjectionScope  | backend/src/modules/knowledge-graph/application/ports.ts:40                                |
| knowledge-graph-visualization.CardSyncPolicy                 | applies      | knowledge-graph-visualization.RebuildMirrorProjection | backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.ts:168           |
| knowledge-graph-visualization.RebuildMirrorProjection        | produces     | knowledge-graph-visualization.MirrorProjectionBuilt   | backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.ts:52            |
| knowledge-graph-visualization.DocumentToMirrorCardAdapter    | shapes       | knowledge-graph-visualization.MirrorCardView          | backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.ts:285           |
| knowledge-graph-visualization.SelectConcept                  | produces     | knowledge-graph-visualization.ConceptSelected         | backend/src/modules/knowledge-graph/application/select-concept.ts:52                       |
| knowledge-graph-visualization.ConceptSelected                | transitions  | knowledge-graph-visualization.ExplorationState        | backend/src/modules/knowledge-graph/application/select-concept.ts:28                       |
| knowledge-graph-visualization.ConceptDefinition              | contains     | knowledge-graph-visualization.DefinitionPointer       | backend/src/modules/knowledge-graph/domain/models.ts:64                                    |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.RelationshipEdge        | backend/src/modules/knowledge-graph/domain/models.ts:145                                   |
| knowledge-graph-visualization.ProjectSourceRegistry          | exposes      | knowledge-graph-visualization.ResolveProjectionScope  | backend/src/modules/knowledge-graph/infrastructure/in-memory-project-source-registry.ts:32 |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.FeatureDocument         | backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts:34      |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.ConceptDefinition       | backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts:34      |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection | backend/src/modules/knowledge-graph/interface/http-routes.ts:177                           |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.SelectConcept           | backend/src/modules/knowledge-graph/interface/http-routes.ts:177                           |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.OpenDefinition          | backend/src/modules/knowledge-graph/interface/http-routes.ts:177                           |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetMirrorCards          | backend/src/modules/knowledge-graph/interface/http-routes.ts:102                           |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetRelationshipGraph    | backend/src/modules/knowledge-graph/interface/http-routes.ts:102                           |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetConceptDetailCard    | backend/src/modules/knowledge-graph/interface/http-routes.ts:102                           |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetDefinitionPointer    | backend/src/modules/knowledge-graph/interface/http-routes.ts:102                           |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.OpenDefinition          | backend/src/modules/knowledge-graph/interface/http-routes.ts:102                           |
| knowledge-graph-visualization.KnowledgeGraphModule           | exposes      | knowledge-graph-visualization.SelectConcept           | backend/src/modules/knowledge-graph/interface/http-routes.ts:166                           |
| ui-prototyping-studio.GetSessionSnapshot                     | queries      | ui-prototyping-studio.StudioSession                   | backend/src/modules/ui-prototyping-studio/application/get-session-snapshot.ts:9            |
| ui-prototyping-studio.ListSessionVariants                    | queries      | ui-prototyping-studio.PrototypeVariant                | backend/src/modules/ui-prototyping-studio/application/list-session-variants.ts:9           |
| ui-prototyping-studio.UIPrototypingStudioAPI                 | exposes      | ui-prototyping-studio.InitializeSession               | backend/src/modules/ui-prototyping-studio/interface/http-routes.ts:96                      |
| ui-prototyping-studio.UIPrototypingStudioAPI                 | exposes      | ui-prototyping-studio.SubmitPrompt                    | backend/src/modules/ui-prototyping-studio/interface/http-routes.ts:96                      |
| ui-prototyping-studio.UIPrototypingStudioAPI                 | exposes      | ui-prototyping-studio.GenerateVariants                | backend/src/modules/ui-prototyping-studio/interface/http-routes.ts:96                      |
| ui-prototyping-studio.UIPrototypingStudioAPI                 | exposes      | ui-prototyping-studio.SelectOrCommitBaseline          | backend/src/modules/ui-prototyping-studio/interface/http-routes.ts:96                      |
| ui-prototyping-studio.UIPrototypingStudioAPI                 | exposes      | ui-prototyping-studio.GetSessionSnapshot              | backend/src/modules/ui-prototyping-studio/interface/http-routes.ts:96                      |
| ui-prototyping-studio.UIPrototypingStudioAPI                 | exposes      | ui-prototyping-studio.ListSessionVariants             | backend/src/modules/ui-prototyping-studio/interface/http-routes.ts:96                      |

## Direction Mismatch

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Type Mismatch

| Concept ID | Code Type | Doc Type | Source |
| ---------- | --------- | -------- | ------ |
