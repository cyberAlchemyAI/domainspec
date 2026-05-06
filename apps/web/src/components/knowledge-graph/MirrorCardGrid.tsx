import type { GraphNode, MirrorCard } from "../../lib/api";

interface MirrorCardGridProps {
  cards: MirrorCard[];
  nodes: GraphNode[];
  selectedConceptId: string | null;
  onSelectConcept: (conceptId: string, source: "card" | "graph") => void;
}

export function MirrorCardGrid(props: MirrorCardGridProps) {
  const sortedNodes = [...props.nodes].sort((left, right) =>
    left.conceptId.localeCompare(right.conceptId),
  );

  return (
    <section className="panel panel--cards" aria-label="Mirror cards">
      <header className="panel__header">
        <h3>Mirror Cards</h3>
        <p>Required docs are always visible: SPEC, domain, operations.</p>
      </header>
      <ul className="mirror-card-grid">
        {props.cards.map((card, index) => {
          const suggestedConcept =
            sortedNodes.length > 0
              ? sortedNodes[index % sortedNodes.length]
              : null;
          const isSelected =
            props.selectedConceptId !== null && suggestedConcept
              ? props.selectedConceptId === suggestedConcept.conceptId
              : false;

          return (
            <li key={card.filePath} className="mirror-card">
              <div className="mirror-card__top-row">
                <strong>{card.title}</strong>
                <span
                  className={`freshness-badge freshness-badge--${card.freshness}`}
                >
                  {card.freshness}
                </span>
              </div>
              <p className="mirror-card__path">{card.filePath}</p>
              <dl className="mirror-card__stats">
                <div>
                  <dt>Aspect</dt>
                  <dd>{card.aspectKind}</dd>
                </div>
                <div>
                  <dt>Concepts</dt>
                  <dd>{card.conceptCount}</dd>
                </div>
                <div>
                  <dt>Relations</dt>
                  <dd>{card.relationCount}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="mirror-card__focus-button"
                disabled={!suggestedConcept}
                onClick={() => {
                  if (suggestedConcept) {
                    props.onSelectConcept(suggestedConcept.conceptId, "card");
                  }
                }}
                aria-label={
                  suggestedConcept
                    ? `Focus concept ${suggestedConcept.name} from card ${card.title}`
                    : `No concept available for card ${card.title}`
                }
              >
                {isSelected
                  ? "Focused"
                  : suggestedConcept
                    ? `Focus ${suggestedConcept.name}`
                    : "No concept available"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
