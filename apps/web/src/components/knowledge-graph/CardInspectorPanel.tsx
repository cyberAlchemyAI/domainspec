import type { ExplorationState } from "../../hooks/useConceptFocus";
import type { SelectedWhiteboardCard } from "../../hooks/useMirrorGraph";
import type { ConceptDetailCard } from "../../lib/api";

interface CardInspectorPanelProps {
  selectedCard: SelectedWhiteboardCard | null;
  detail: ConceptDetailCard | null;
  state: ExplorationState;
  message: string | null;
  messageTone: "info" | "error" | null;
  openingDefinition: boolean;
  onOpenDefinition: () => void;
}

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.ConceptDetailPanel
 *     type: Component
 *     concern: sys
 *   edges:
 *     - edge: displays
 *       to: knowledge-graph-visualization.ConceptDetailCard
 */
export function CardInspectorPanel(props: CardInspectorPanelProps) {
  const conceptualCard =
    props.selectedCard?.cardType === "concept" ||
    props.selectedCard?.cardType === "story";

  return (
    <section
      className="panel panel--inspector"
      aria-label="Card inspector panel"
    >
      <header className="panel__header">
        <h3>Card Inspector</h3>
        <p>Detail projection synchronized with the focused whiteboard card.</p>
      </header>

      {!props.selectedCard ? (
        <div className="inspector-placeholder" aria-live="polite">
          <p>Select an aspect or whiteboard card to inspect details.</p>
        </div>
      ) : (
        <article className="inspector-card" aria-live="polite">
          <h4>{props.selectedCard.title}</h4>
          <p>{props.selectedCard.summary}</p>

          <dl className="inspector-meta">
            <div>
              <dt>Card type</dt>
              <dd>{props.selectedCard.cardType}</dd>
            </div>
            <div>
              <dt>Card ID</dt>
              <dd>{props.selectedCard.cardId}</dd>
            </div>
            {props.selectedCard.groupKey ? (
              <div>
                <dt>Group</dt>
                <dd>{props.selectedCard.groupKey}</dd>
              </div>
            ) : null}
            {props.selectedCard.conceptId ? (
              <div>
                <dt>Concept</dt>
                <dd>{props.selectedCard.conceptId}</dd>
              </div>
            ) : null}
          </dl>

          {props.detail ? (
            <>
              <dl className="inspector-definition">
                <div>
                  <dt>Definition file</dt>
                  <dd>{props.detail.definition.filePath}</dd>
                </div>
                <div>
                  <dt>Definition anchor</dt>
                  <dd>#{props.detail.definition.anchor}</dd>
                </div>
              </dl>

              <div className="inspector-relations">
                <section>
                  <h5>Inbound relations</h5>
                  <ul>
                    {props.detail.inboundRelations.map((edge) => (
                      <li
                        key={`${edge.fromCardId}|${edge.edge}|${edge.toCardId}`}
                      >
                        <span>
                          {edge.fromCardId} <em>{edge.edge}</em> {edge.toCardId}
                        </span>
                        <span>{edge.evidence}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h5>Outbound relations</h5>
                  <ul>
                    {props.detail.outboundRelations.map((edge) => (
                      <li
                        key={`${edge.toCardId}|${edge.edge}|${edge.fromCardId}`}
                      >
                        <span>
                          {edge.fromCardId} <em>{edge.edge}</em> {edge.toCardId}
                        </span>
                        <span>{edge.evidence}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          ) : null}
        </article>
      )}

      <button
        type="button"
        className="inspector-open-definition"
        onClick={props.onOpenDefinition}
        disabled={props.openingDefinition}
        aria-label="Open definition for focused concept"
      >
        {props.openingDefinition ? "Opening definition..." : "Open definition"}
      </button>

      {!conceptualCard ? (
        <p className="inspector-hint" aria-live="polite">
          Select a concept card to enable definition navigation.
        </p>
      ) : null}

      <div className="inspector-status" aria-live="polite">
        <strong>State:</strong> {props.state}
      </div>

      {props.message ? (
        <p
          className={`inspector-message inspector-message--${props.messageTone ?? "info"}`}
          role={props.messageTone === "error" ? "alert" : "status"}
        >
          {props.message}
        </p>
      ) : null}
    </section>
  );
}
