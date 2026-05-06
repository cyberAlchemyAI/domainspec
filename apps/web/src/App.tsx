import { useMemo } from "react";

import { useConceptFocus } from "./hooks/useConceptFocus";
import { useMirrorGraph } from "./hooks/useMirrorGraph";
import { KnowledgeGraphPageLayout } from "./layouts/KnowledgeGraphPageLayout";
import { DEFAULT_FEATURE_ID, DEFAULT_PROJECT_KEY } from "./lib/api";

const KNOWLEDGE_GRAPH_ROUTE = "/knowledge-graph";

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.route.canvas
 *     type: Page
 *     concern: sys
 *   edges:
 *     - edge: renders
 *       to: ui.knowledge-graph-visualization.MirrorCardGrid
 *     - edge: renders
 *       to: ui.knowledge-graph-visualization.RelationshipGraphCanvas
 *     - edge: renders
 *       to: ui.knowledge-graph-visualization.ConceptDetailPanel
 */
export function App() {
  const scope = useMemo(resolveRouteScope, []);
  const currentPath = currentPathname();
  const isKnowledgeGraphRoute =
    currentPath === "/" || currentPath === KNOWLEDGE_GRAPH_ROUTE;

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

  if (!isKnowledgeGraphRoute) {
    return (
      <main className="kg-screen-state">
        <h1>Route not found</h1>
        <p>This workspace currently exposes the knowledge graph page only.</p>
        <a href={KNOWLEDGE_GRAPH_ROUTE}>Open /knowledge-graph</a>
      </main>
    );
  }

  return (
    <KnowledgeGraphPageLayout
      currentPath={currentPath}
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
