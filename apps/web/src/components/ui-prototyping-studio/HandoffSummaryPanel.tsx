import type {
  StudioHandoffBundle,
  StudioIntegrationReadiness,
} from "../../lib/api";

interface HandoffSummaryPanelProps {
  busy: boolean;
  integration: StudioIntegrationReadiness | null;
  bundle: StudioHandoffBundle | null;
  onExportHandoff: () => void;
  onRefreshBundle: () => void;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.HandoffSummaryPanel
 *     type: Component
 *     concern: sys
 */
export function HandoffSummaryPanel(props: HandoffSummaryPanelProps) {
  return (
    <section className="panel ups-panel" aria-labelledby="ups-handoff-heading">
      <header className="panel__header">
        <h3 id="ups-handoff-heading">Handoff Summary Panel</h3>
        <p>
          Export and inspect handoff references for downstream UI/test
          implementation.
        </p>
      </header>

      <p className="ups-note" data-testid="ups-handoff-status">
        {props.bundle
          ? "handoff=ready"
          : props.integration?.uiPhaseBridgeReady
            ? "handoff=refresh-required"
            : "handoff=pending"}
      </p>

      <div className="ups-button-row">
        <button
          type="button"
          className="ups-button"
          onClick={props.onExportHandoff}
          disabled={props.busy}
          data-testid="ups-export-handoff"
        >
          Export Handoff
        </button>
        <button
          type="button"
          className="ups-button ups-button--secondary"
          onClick={props.onRefreshBundle}
          disabled={props.busy}
          data-testid="ups-refresh-handoff"
        >
          Refresh Bundle
        </button>
      </div>

      {props.bundle ? (
        <ul className="ups-handoff-list" data-testid="ups-handoff-list">
          <li>stories={props.bundle.storyRefs.join(", ")}</li>
          <li>requirements={props.bundle.requirementRefs.join(", ")}</li>
          <li>acceptance={props.bundle.acceptanceRefs.join(", ")}</li>
          <li>uiSpec={props.bundle.uiSpecRef}</li>
          <li>testSpec={props.bundle.testSpecRef}</li>
        </ul>
      ) : (
        <p className="ups-note">No handoff bundle exported yet.</p>
      )}
    </section>
  );
}
