import { AppSidebar } from "../components/layout/AppSidebar";
import { AspectCardRail } from "../components/knowledge-graph/AspectCardRail";
import { CardInspectorPanel } from "../components/knowledge-graph/CardInspectorPanel";
import { FocusStateIndicator } from "../components/knowledge-graph/FocusStateIndicator";
import { WhiteboardCanvas } from "../components/knowledge-graph/WhiteboardCanvas";
import type { ExplorationState } from "../hooks/useConceptFocus";
import type { SelectedWhiteboardCard } from "../hooks/useMirrorGraph";
import type {
  AspectKind,
  ConceptDetailCard,
  GraphBoard,
  GraphEdge,
  GraphNode,
  MirrorCard,
  SelectionSource,
} from "../lib/api";

interface KnowledgeGraphPageLayoutProps {
  currentPath: string;
  projectKey: string;
  featureId: string;
  generatedAt: string | null;
  loading: boolean;
  syncing: boolean;
  cards: MirrorCard[];
  board: GraphBoard;
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedCard: SelectedWhiteboardCard | null;
  state: ExplorationState;
  detail: ConceptDetailCard | null;
  detailMessage: string | null;
  detailMessageTone: "info" | "error" | null;
  openingDefinition: boolean;
  onRefreshProjection: () => void;
  onSelectAspect: (aspectKind: AspectKind) => void;
  onSelectWhiteboardCard: (node: GraphNode, source: SelectionSource) => void;
  onOpenDefinition: () => void;
}

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.KnowledgeGraphPageLayout
 *     type: Layout
 *     concern: sys
 *   edges:
 *     - edge: wraps
 *       to: ui.knowledge-graph-visualization.route.canvas
 */
export function KnowledgeGraphPageLayout(props: KnowledgeGraphPageLayoutProps) {
  return (
    <div className="kg-shell">
      <AppSidebar currentPath={props.currentPath} />

      <main className="kg-content">
        <header className="kg-header">
          <div>
            <p className="kg-header__eyebrow">
              {props.projectKey} / {props.featureId}
            </p>
            <h1>Knowledge Graph Visualization</h1>
            <p className="kg-header__meta">
              {props.generatedAt
                ? `Projection generated at ${formatTimestamp(props.generatedAt)}`
                : props.loading
                  ? "Building projection from mirrored docs..."
                  : "Projection not generated yet."}
            </p>
          </div>

          <div className="kg-header__controls">
            <FocusStateIndicator state={props.state} />
            <button
              type="button"
              className="kg-refresh"
              onClick={props.onRefreshProjection}
              aria-label="Rebuild and reload mirror projection"
            >
              {props.syncing ? "Syncing..." : "Rebuild Projection"}
            </button>
          </div>
        </header>

        <section className="kg-panels">
          <AspectCardRail
            cards={props.cards}
            activeAspect={props.board.activeAspect}
            onSelectAspect={props.onSelectAspect}
          />
          <WhiteboardCanvas
            board={props.board}
            nodes={props.nodes}
            edges={props.edges}
            selectedCardId={props.selectedCard?.cardId ?? null}
            onSelectCard={props.onSelectWhiteboardCard}
          />
          <CardInspectorPanel
            selectedCard={props.selectedCard}
            detail={props.detail}
            state={props.state}
            message={props.detailMessage}
            messageTone={props.detailMessageTone}
            openingDefinition={props.openingDefinition}
            onOpenDefinition={props.onOpenDefinition}
          />
        </section>
      </main>
    </div>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
}
