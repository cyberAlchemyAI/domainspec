import { useConceptFocus } from "./hooks/useConceptFocus";
import { useMirrorGraph } from "./hooks/useMirrorGraph";
import { KnowledgeGraphPageLayout } from "./layouts/KnowledgeGraphPageLayout";
import { DEFAULT_FEATURE_ID } from "./lib/api";

const KNOWLEDGE_GRAPH_ROUTE = "/knowledge-graph";

export function App() {
  const currentPath = currentPathname();
  const isKnowledgeGraphRoute =
    currentPath === "/" || currentPath === KNOWLEDGE_GRAPH_ROUTE;

  const mirrorGraph = useMirrorGraph(DEFAULT_FEATURE_ID);
  const conceptFocus = useConceptFocus({
    featureId: DEFAULT_FEATURE_ID,
    nodes: mirrorGraph.nodes,
    edges: mirrorGraph.edges,
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

  if (mirrorGraph.loading && mirrorGraph.snapshotId === null) {
    return (
      <main className="kg-screen-state">
        <h1>Building projection...</h1>
        <p>
          Loading mirror cards and relationship graph from backend contracts.
        </p>
      </main>
    );
  }

  if (mirrorGraph.errorMessage && mirrorGraph.snapshotId === null) {
    return (
      <main className="kg-screen-state">
        <h1>Unable to load knowledge graph</h1>
        <p>{mirrorGraph.errorMessage}</p>
        <button
          type="button"
          onClick={() => void mirrorGraph.refreshProjection()}
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <KnowledgeGraphPageLayout
      currentPath={currentPath}
      featureId={DEFAULT_FEATURE_ID}
      generatedAt={mirrorGraph.generatedAt}
      syncing={mirrorGraph.syncing}
      cards={mirrorGraph.cards}
      nodes={mirrorGraph.nodes}
      edges={mirrorGraph.edges}
      selectedConceptId={conceptFocus.selectedConceptId}
      state={conceptFocus.state}
      detail={conceptFocus.detail}
      detailMessage={conceptFocus.message ?? mirrorGraph.errorMessage}
      openingDefinition={conceptFocus.openingDefinition}
      onRefreshProjection={() => void mirrorGraph.refreshProjection()}
      onSelectConcept={(conceptId, source) => {
        void conceptFocus.selectConcept(conceptId, source);
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
