import { useMemo } from "react";

import type { GraphEdge, GraphNode } from "../../lib/api";

interface RelationshipGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedConceptId: string | null;
  onSelectConcept: (conceptId: string, source: "card" | "graph") => void;
}

interface NodePosition {
  x: number;
  y: number;
}

export function RelationshipGraphCanvas(props: RelationshipGraphCanvasProps) {
  const orderedNodes = useMemo(
    () =>
      [...props.nodes].sort((left, right) =>
        left.conceptId.localeCompare(right.conceptId),
      ),
    [props.nodes],
  );
  const positions = useMemo(
    () => buildNodePositions(orderedNodes),
    [orderedNodes],
  );

  return (
    <section
      className="panel panel--graph"
      aria-label="Relationship graph canvas"
    >
      <header className="panel__header">
        <h3>Relationship Graph</h3>
        <p>Deterministic radial layout for stable verification evidence.</p>
      </header>

      <div
        className="graph-canvas"
        role="img"
        aria-label="Concept relationship graph"
      >
        <svg viewBox="0 0 860 420" preserveAspectRatio="xMidYMid meet">
          {props.edges.map((edge) => {
            const fromPosition = positions.get(edge.fromConceptId);
            const toPosition = positions.get(edge.toConceptId);

            if (!fromPosition || !toPosition) {
              return null;
            }

            return (
              <g key={`${edge.fromConceptId}|${edge.edge}|${edge.toConceptId}`}>
                <line
                  x1={fromPosition.x}
                  y1={fromPosition.y}
                  x2={toPosition.x}
                  y2={toPosition.y}
                  className="graph-edge"
                />
              </g>
            );
          })}

          {orderedNodes.map((node) => {
            const position = positions.get(node.conceptId);
            if (!position) {
              return null;
            }

            const selected = node.conceptId === props.selectedConceptId;
            return (
              <g key={node.conceptId}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={selected ? 25 : 21}
                  className={`graph-node ${selected ? "is-selected" : ""}`}
                  onClick={() => props.onSelectConcept(node.conceptId, "graph")}
                />
                <text
                  x={position.x}
                  y={position.y + 4}
                  textAnchor="middle"
                  className="graph-node-label"
                >
                  {shortLabel(node.name)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="graph-canvas__legend">
        <h4>Node fallback list</h4>
        <ul className="graph-node-fallback">
          {orderedNodes.map((node) => (
            <li key={node.conceptId}>
              <button
                type="button"
                className={
                  node.conceptId === props.selectedConceptId
                    ? "is-selected"
                    : ""
                }
                onClick={() => props.onSelectConcept(node.conceptId, "graph")}
                aria-label={`Focus concept ${node.name}`}
              >
                <strong>{node.name}</strong>
                <span>{node.taxonomyType}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="graph-canvas__edge-list">
        <h4>Canonical edges</h4>
        <ul>
          {props.edges.map((edge) => {
            const parsedEvidence = parseEvidenceLink(edge.evidence);
            return (
              <li
                key={`${edge.fromConceptId}|${edge.edge}|${edge.toConceptId}|${edge.evidence}`}
              >
                <span>
                  {edge.fromConceptId} <em>{edge.edge}</em> {edge.toConceptId}
                </span>
                {parsedEvidence ? (
                  <a href={parsedEvidence.href}>{parsedEvidence.label}</a>
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

function buildNodePositions(nodes: GraphNode[]): Map<string, NodePosition> {
  const centerX = 430;
  const centerY = 210;
  const radius = 150;
  const count = Math.max(nodes.length, 1);

  const positions = new Map<string, NodePosition>();

  nodes.forEach((node, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.set(node.conceptId, { x, y });
  });

  return positions;
}

function shortLabel(name: string): string {
  return name.length <= 14 ? name : `${name.slice(0, 12)}...`;
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
