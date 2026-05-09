import type {
  StudioGateState,
  StudioSessionState,
  StudioBaselineProvenance,
} from "../../lib/api";

interface SessionStateIndicatorProps {
  state: StudioSessionState;
  selectionGate: StudioGateState;
  applyGate: StudioGateState;
  baseline: StudioBaselineProvenance | null;
}

export function SessionStateIndicator(props: SessionStateIndicatorProps) {
  return (
    <div className="ups-state-indicator" aria-live="polite">
      <p className="ups-state-indicator__label">Session State</p>
      <span className={`ups-state-badge ups-state-badge--${props.state}`}>
        {props.state}
      </span>
      <p className="ups-state-indicator__meta">
        selectionGate={props.selectionGate}
      </p>
      <p
        className="ups-state-indicator__meta"
        data-testid="ups-apply-gate-badge"
      >
        applyGate={props.applyGate}
      </p>
      <p className="ups-state-indicator__meta" data-testid="ups-baseline-badge">
        {props.baseline
          ? `baseline=${props.baseline.mode}:${props.baseline.label}`
          : "baseline=pending"}
      </p>
    </div>
  );
}
