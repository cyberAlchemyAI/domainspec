import { useMemo } from "react";

import type {
  GraphBoard,
  GraphEdge,
  GraphNode,
  SelectionSource,
  WhiteboardCardType,
  WhiteboardViewLevel,
} from "../../lib/api";
import { WhiteboardCard } from "./WhiteboardCard";

interface WhiteboardCanvasProps {
  board: GraphBoard;
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedCardId: string | null;
  onSelectCard: (node: GraphNode, source: SelectionSource) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

const cardTypeRank: Record<WhiteboardCardType, number> = {
  aspect: 0,
  feature: 1,
  "concept-group": 2,
  concept: 3,
  story: 4,
};

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.RelationshipGraphCanvas
 *     type: Component
 *     concern: sys
 *   edges:
 *     - edge: consumes
 *       to: ui.knowledge-graph-visualization.useConceptFocus
 */
export function WhiteboardCanvas(props: WhiteboardCanvasProps) {
  const orderedNodes = useMemo(() => sortNodes(props.nodes), [props.nodes]);
  const positions = useMemo(
    () => buildNodePositions(orderedNodes, props.board.viewLevel),
    [orderedNodes, props.board.viewLevel],
  );

  return (
    <section className="panel panel--whiteboard" aria-label="Whiteboard canvas">
      <header className="panel__header">
        <h3>Whiteboard Canvas</h3>
        <p>
          View level <strong>{props.board.viewLevel}</strong> with deterministic
          layout ordering for stable E2E behavior.
        </p>
      </header>

      <p className="whiteboard-canvas__summary">
        activeAspect={props.board.activeAspect} · selectedFeatureId=
        {props.board.selectedFeatureId ?? "none"} · selectedGroupKey=
        {props.board.selectedGroupKey ?? "none"}
      </p>

      <div
        className="whiteboard-canvas"
        role="img"
        aria-label="Deterministic whiteboard canvas"
      >
        <svg viewBox="0 0 920 460" preserveAspectRatio="xMidYMid meet">
          {props.edges.map((edge) => {
            const from = positions.get(edge.fromCardId);
            const to = positions.get(edge.toCardId);

            if (!from || !to) {
              return null;
            }

            return (
              <line
                key={`${edge.fromCardId}|${edge.edge}|${edge.toCardId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="whiteboard-edge"
              />
            );
          })}

          {orderedNodes.map((node) => {
            const position = positions.get(node.cardId);
            if (!position) {
              return null;
            }

            const selected = props.selectedCardId === node.cardId;
            return (
              <g key={node.cardId}>
                <rect
                  x={position.x - 76}
                  y={position.y - 28}
                  width={152}
                  height={56}
                  rx={12}
                  ry={12}
                  className={`whiteboard-node ${selected ? "is-selected" : ""}`}
                  onClick={() => props.onSelectCard(node, "graph")}
                />
                <text
                  x={position.x}
                  y={position.y - 4}
                  textAnchor="middle"
                  className="whiteboard-node-label"
                >
                  {node.cardType}
                </text>
                <text
                  x={position.x}
                  y={position.y + 12}
                  textAnchor="middle"
                  className="whiteboard-node-title"
                >
                  {truncate(node.title, 22)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="whiteboard-canvas__fallback">
        <h4>Keyboard card list</h4>
        <ul className="whiteboard-fallback-list">
          {orderedNodes.map((node) => (
            <li key={node.cardId}>
              <WhiteboardCard
                node={node}
                selected={props.selectedCardId === node.cardId}
                source="board"
                onSelect={props.onSelectCard}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="whiteboard-canvas__edges">
        <h4>Canonical edges</h4>
        <ul>
          {props.edges.map((edge) => {
            const evidence = parseEvidenceLink(edge.evidence);
            return (
              <li
                key={`${edge.fromCardId}|${edge.edge}|${edge.toCardId}|${edge.evidence}`}
              >
                <span>
                  {edge.fromCardId} <em>{edge.edge}</em> {edge.toCardId}
                </span>
                {evidence ? (
                  <a href={evidence.href}>{evidence.label}</a>
                ) : (
                  <span>{edge.evidence}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function sortNodes(nodes: GraphNode[]): GraphNode[] {
  return [...nodes].sort((left, right) => {
    const typeCompare =
      cardTypeRank[left.cardType] - cardTypeRank[right.cardType];
    if (typeCompare !== 0) {
      return typeCompare;
    }

    return left.cardId.localeCompare(right.cardId);
  });
}

function buildNodePositions(
  nodes: GraphNode[],
  viewLevel: WhiteboardViewLevel,
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const columns = viewLevel === "aspect" ? 3 : 4;
  const startX = 140;
  const startY = 80;
  const stepX = 200;
  const stepY = 104;

  nodes.forEach((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);

    positions.set(node.cardId, {
      x: startX + column * stepX,
      y: startY + row * stepY,
    });
  });

  return positions;
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function parseEvidenceLink(
  rawEvidence: string,
): { label: string; href: string } | null {
  const match = rawEvidence.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!match) {
    return null;
  }

  const label = match[1]?.trim();
  const href = match[2]?.trim();
  if (!label || !href) {
    return null;
  }

  return { label, href };
}
