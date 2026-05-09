import { useMemo } from "react";

import { useConceptFocus } from "./hooks/useConceptFocus";
import { useMirrorGraph } from "./hooks/useMirrorGraph";
import { useUiPrototypingStudio } from "./hooks/useUiPrototypingStudio";
import { KnowledgeGraphPageLayout } from "./layouts/KnowledgeGraphPageLayout";
import { StudioWorkbenchLayout } from "./layouts/StudioWorkbenchLayout";
import { DEFAULT_FEATURE_ID, DEFAULT_PROJECT_KEY } from "./lib/api";

const KNOWLEDGE_GRAPH_ROUTE = "/knowledge-graph";
const UI_PROTOTYPING_STUDIO_ROUTE = "/ui-prototyping-studio";

export function App() {
  const currentPath = currentPathname();

  if (currentPath === "/" || currentPath === KNOWLEDGE_GRAPH_ROUTE) {
    return <KnowledgeGraphRoute currentPath={currentPath} />;
  }

  if (currentPath === UI_PROTOTYPING_STUDIO_ROUTE) {
    return <UiPrototypingStudioRoute currentPath={currentPath} />;
  }

  return (
    <main className="kg-screen-state">
      <h1>Route not found</h1>
      <p>This workspace exposes knowledge graph and UI prototyping routes.</p>
      <a href={KNOWLEDGE_GRAPH_ROUTE}>Open /knowledge-graph</a>
      <a href={UI_PROTOTYPING_STUDIO_ROUTE}>Open /ui-prototyping-studio</a>
    </main>
  );
}

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.route.canvas
 *     type: Page
 *     concern: sys
 */
function KnowledgeGraphRoute(props: { currentPath: string }) {
  const scope = useMemo(resolveRouteScope, []);
  const mirrorGraph = useMirrorGraph(scope);
  const conceptFocus = useConceptFocus({
    projectKey: mirrorGraph.projectKey,
    featureId: mirrorGraph.featureId,
    activeAspect: mirrorGraph.navigation.activeAspect,
    viewLevel: mirrorGraph.navigation.viewLevel,
    selectedFeatureId: mirrorGraph.navigation.selectedFeatureId,
    selectedGroupKey: mirrorGraph.navigation.selectedGroupKey,
    selectedCard: mirrorGraph.selectedCard,
    projectionReady:
      !mirrorGraph.loading &&
      mirrorGraph.errorMessage === null &&
      mirrorGraph.snapshotId !== null,
  });

  return (
    <KnowledgeGraphPageLayout
      currentPath={props.currentPath}
      projectKey={mirrorGraph.projectKey}
      featureId={mirrorGraph.featureId}
      generatedAt={mirrorGraph.generatedAt}
      loading={mirrorGraph.loading}
      syncing={mirrorGraph.syncing}
      cards={mirrorGraph.cards}
      board={mirrorGraph.board}
      nodes={mirrorGraph.nodes}
      edges={mirrorGraph.edges}
      selectedCard={mirrorGraph.selectedCard}
      state={conceptFocus.state}
      detail={conceptFocus.detail}
      detailMessage={conceptFocus.message ?? mirrorGraph.errorMessage}
      detailMessageTone={conceptFocus.messageTone}
      openingDefinition={conceptFocus.openingDefinition}
      onRefreshProjection={() => void mirrorGraph.refreshProjection()}
      onSelectAspect={(aspectKind) => {
        mirrorGraph.selectAspect(aspectKind, "rail");
      }}
      onSelectWhiteboardCard={(node, source) => {
        mirrorGraph.selectWhiteboardCard(node, source);
      }}
      onOpenDefinition={() => {
        void conceptFocus.openFocusedDefinition();
      }}
    />
  );
}

function UiPrototypingStudioRoute(props: { currentPath: string }) {
  const studio = useUiPrototypingStudio();

  return (
    <StudioWorkbenchLayout
      currentPath={props.currentPath}
      session={studio.session}
      variants={studio.variants}
      comments={studio.comments}
      draftBatch={studio.draftBatch}
      revisions={studio.revisions}
      handoffBundle={studio.handoffBundle}
      prompt={studio.prompt}
      variantCount={studio.variantCount}
      annotationDraft={studio.annotationDraft}
      busy={studio.busy}
      loading={studio.loading}
      errorMessage={studio.errorMessage}
      draftErrorMessage={studio.draftErrorMessage}
      annotationUnlocked={studio.annotationUnlocked}
      committedBaseline={studio.committedBaseline}
      approvalPending={studio.approvalPending}
      applyEnabled={studio.applyEnabled}
      onPromptChange={studio.setPrompt}
      onVariantCountChange={studio.setVariantCount}
      onAnnotationDraftChange={studio.setAnnotationDraft}
      onStartSession={() => {
        void studio.startSession();
      }}
      onSubmitPrompt={() => {
        void studio.submitPrompt();
      }}
      onGenerateVariants={() => {
        void studio.generateVariants();
      }}
      onSelectBaseline={(label) => {
        void studio.selectBaseline(label);
      }}
      onCaptureComment={() => {
        void studio.captureComment();
      }}
      onSynthesizeBatch={() => {
        void studio.synthesizeBatch();
      }}
      onApproveBatch={() => {
        void studio.approveBatch();
      }}
      onApplyBatch={() => {
        void studio.applyBatch();
      }}
      onExportHandoff={() => {
        void studio.exportHandoff();
      }}
      onRefreshHandoffBundle={() => {
        void studio.refreshHandoffBundle();
      }}
    />
  );
}

function currentPathname(): string {
  if (typeof window === "undefined") {
    return KNOWLEDGE_GRAPH_ROUTE;
  }

  return window.location.pathname;
}

function resolveRouteScope() {
  if (typeof window === "undefined") {
    return {
      projectKey: DEFAULT_PROJECT_KEY,
      featureId: DEFAULT_FEATURE_ID,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const projectKey = params.get("projectKey")?.trim();
  const featureId = params.get("featureId")?.trim();

  return {
    projectKey:
      projectKey && projectKey.length > 0 ? projectKey : DEFAULT_PROJECT_KEY,
    featureId:
      featureId && featureId.length > 0 ? featureId : DEFAULT_FEATURE_ID,
  };
}
