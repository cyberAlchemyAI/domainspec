import { AppSidebar } from "../components/layout/AppSidebar";
import { ConceptDetailPanel } from "../components/knowledge-graph/ConceptDetailPanel";
import { FocusStateIndicator } from "../components/knowledge-graph/FocusStateIndicator";
import { MirrorCardGrid } from "../components/knowledge-graph/MirrorCardGrid";
import { RelationshipGraphCanvas } from "../components/knowledge-graph/RelationshipGraphCanvas";
import type { ExplorationState } from "../hooks/useConceptFocus";
import type {
  ConceptDetailCard,
  GraphEdge,
  GraphNode,
  MirrorCard,
} from "../lib/api";

interface KnowledgeGraphPageLayoutProps {
  currentPath: string;
  featureId: string;
  generatedAt: string | null;
  syncing: boolean;
  cards: MirrorCard[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedConceptId: string | null;
  state: ExplorationState;
  detail: ConceptDetailCard | null;
  detailMessage: string | null;
  openingDefinition: boolean;
  onRefreshProjection: () => void;
  onSelectConcept: (conceptId: string, source: "card" | "graph") => void;
  onOpenDefinition: () => void;
}

export function KnowledgeGraphPageLayout(props: KnowledgeGraphPageLayoutProps) {
  return (
    <div className="kg-shell">
      <AppSidebar currentPath={props.currentPath} />

      <main className="kg-content">
        <header className="kg-header">
          <div>
            <p className="kg-header__eyebrow">{props.featureId}</p>
            <h1>Knowledge Graph Visualization</h1>
            <p className="kg-header__meta">
              {props.generatedAt
                ? `Projection generated at ${formatTimestamp(props.generatedAt)}`
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
          <MirrorCardGrid
            cards={props.cards}
            nodes={props.nodes}
            selectedConceptId={props.selectedConceptId}
            onSelectConcept={props.onSelectConcept}
          />
          <RelationshipGraphCanvas
            nodes={props.nodes}
            edges={props.edges}
            selectedConceptId={props.selectedConceptId}
            onSelectConcept={props.onSelectConcept}
          />
          <ConceptDetailPanel
            detail={props.detail}
            state={props.state}
            message={props.detailMessage}
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
