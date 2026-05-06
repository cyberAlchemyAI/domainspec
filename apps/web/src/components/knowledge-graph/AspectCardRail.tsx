import type { AspectKind, MirrorCard } from "../../lib/api";

interface AspectCardRailProps {
  cards: MirrorCard[];
  activeAspect: AspectKind;
  onSelectAspect: (aspectKind: AspectKind) => void;
}

const requiredAspectOrder = new Map<AspectKind, number>([
  ["SPEC", 0],
  ["DOMAIN", 1],
  ["OPERATIONS", 2],
]);

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.MirrorCardGrid
 *     type: Component
 *     concern: sys
 *   edges:
 *     - edge: consumes
 *       to: ui.knowledge-graph-visualization.useMirrorGraph
 */
export function AspectCardRail(props: AspectCardRailProps) {
  const orderedCards = [...props.cards].sort((left, right) => {
    const leftRank = requiredAspectOrder.get(left.aspectKind) ?? 99;
    const rightRank = requiredAspectOrder.get(right.aspectKind) ?? 99;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.aspectKind.localeCompare(right.aspectKind);
  });

  return (
    <section className="panel panel--aspect-rail" aria-label="Aspect card rail">
      <header className="panel__header">
        <h3>Aspect Rail</h3>
        <p>Select a documentation aspect to scope whiteboard drill state.</p>
      </header>

      <ul className="aspect-rail__list">
        {orderedCards.map((card) => {
          const active = card.aspectKind === props.activeAspect;

          return (
            <li key={card.cardId}>
              <button
                type="button"
                className={`aspect-card ${active ? "is-active" : ""}`}
                aria-current={active ? "true" : undefined}
                aria-label={`Activate ${card.aspectKind} aspect`}
                onClick={() => props.onSelectAspect(card.aspectKind)}
              >
                <span className="aspect-card__title">{card.title}</span>
                <span className="aspect-card__path">{card.filePath}</span>
                <span className="aspect-card__meta">
                  <strong>{card.conceptCount}</strong> concepts ·{" "}
                  <strong>{card.relationCount}</strong> relations
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
