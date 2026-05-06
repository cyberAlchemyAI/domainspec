import type { GraphNode, SelectionSource } from "../../lib/api";

interface WhiteboardCardProps {
  node: GraphNode;
  selected: boolean;
  source: SelectionSource;
  onSelect: (node: GraphNode, source: SelectionSource) => void;
}

export function WhiteboardCard(props: WhiteboardCardProps) {
  return (
    <button
      type="button"
      className={`whiteboard-card ${props.selected ? "is-selected" : ""}`}
      aria-label={`Focus ${props.node.cardType} card ${props.node.title}`}
      onClick={() => props.onSelect(props.node, props.source)}
    >
      <span className="whiteboard-card__type">{props.node.cardType}</span>
      <strong className="whiteboard-card__title">{props.node.title}</strong>
      {props.node.groupKey ? (
        <span className="whiteboard-card__group">
          group: {props.node.groupKey}
        </span>
      ) : null}
    </button>
  );
}
