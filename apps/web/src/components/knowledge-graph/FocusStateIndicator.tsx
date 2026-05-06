import type { ExplorationState } from "../../hooks/useConceptFocus";

interface FocusStateIndicatorProps {
  state: ExplorationState;
}

const stateLabel: Record<ExplorationState, string> = {
  Idle: "Idle",
  ProjectionReady: "Projection Ready",
  ConceptFocused: "Concept Focused",
  DefinitionOpened: "Definition Opened",
};

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.FocusStateIndicator
 *     type: State Indicator
 *     concern: sys
 *   edges:
 *     - edge: reflects
 *       to: knowledge-graph-visualization.ExplorationState
 */
export function FocusStateIndicator(props: FocusStateIndicatorProps) {
  return (
    <div className="focus-indicator" aria-live="polite">
      <span className="focus-indicator__label">State</span>
      <span className={`state-badge state-badge--${props.state}`}>
        {stateLabel[props.state]}
      </span>
    </div>
  );
}
