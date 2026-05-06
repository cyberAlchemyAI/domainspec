import type { ConceptDetailCard } from "../../lib/api";
import type { ExplorationState } from "../../hooks/useConceptFocus";

interface ConceptDetailPanelProps {
  detail: ConceptDetailCard | null;
  state: ExplorationState;
  message: string | null;
  openingDefinition: boolean;
  onOpenDefinition: () => void;
}

export function ConceptDetailPanel(props: ConceptDetailPanelProps) {
  return (
    <section className="panel panel--detail" aria-label="Concept detail panel">
      <header className="panel__header">
        <h3>Concept Detail</h3>
        <p>Inbound and outbound relation evidence for the focused concept.</p>
      </header>

      {!props.detail ? (
        <div className="detail-placeholder" aria-live="polite">
          <p>
            Select a concept from the cards or graph to inspect related context.
          </p>
        </div>
      ) : (
        <article className="detail-card" aria-live="polite">
          <h4>{props.detail.title}</h4>
          <p>{props.detail.summary}</p>

          <dl className="detail-definition">
            <div>
              <dt>Definition file</dt>
              <dd>{props.detail.definition.filePath}</dd>
            </div>
            <div>
              <dt>Definition anchor</dt>
              <dd>#{props.detail.definition.anchor}</dd>
            </div>
          </dl>

          <div className="relation-columns">
            <section>
              <h5>Inbound Relations</h5>
              <ul>
                {props.detail.inboundRelations.map((edge) => (
                  <li
                    key={`in-${edge.fromConceptId}-${edge.edge}-${edge.toConceptId}`}
                  >
                    <span>
                      {edge.fromConceptId} <em>{edge.edge}</em>
                    </span>
                    <span>{edge.evidence}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h5>Outbound Relations</h5>
              <ul>
                {props.detail.outboundRelations.map((edge) => (
                  <li
                    key={`out-${edge.fromConceptId}-${edge.edge}-${edge.toConceptId}`}
                  >
                    <span>
                      {edge.toConceptId} <em>{edge.edge}</em>
                    </span>
                    <span>{edge.evidence}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      )}

      <button
        type="button"
        className="detail-open-definition"
        onClick={props.onOpenDefinition}
        disabled={props.openingDefinition}
        aria-label="Open definition for focused concept"
      >
        {props.openingDefinition ? "Opening definition..." : "Open definition"}
      </button>

      <div className="detail-status" aria-live="polite">
        <strong>State:</strong> {props.state}
      </div>
      {props.message ? <p className="detail-message">{props.message}</p> : null}
    </section>
  );
}
