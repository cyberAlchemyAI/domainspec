import type { StudioCommentEvent, StudioCommentSeverity } from "../../lib/api";
import type { StudioAnnotationDraft } from "../../hooks/useUiPrototypingStudio";

interface AnnotationPanelProps {
  unlocked: boolean;
  busy: boolean;
  revisionHeadId: string | null;
  draft: StudioAnnotationDraft;
  comments: StudioCommentEvent[];
  onChangeDraft: (value: Partial<StudioAnnotationDraft>) => void;
  onCaptureComment: () => void;
}

const SEVERITY_OPTIONS: StudioCommentSeverity[] = [
  "blocker",
  "high",
  "medium",
  "low",
];

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.AnnotationPanel
 *     type: Component
 *     concern: sys
 */
export function AnnotationPanel(props: AnnotationPanelProps) {
  return (
    <section
      className="panel ups-panel"
      aria-labelledby="ups-annotation-heading"
    >
      <header className="panel__header">
        <h3 id="ups-annotation-heading">Annotation Panel</h3>
        <p>
          Capture canonical comments in {`{target,severity,intent,note}`} shape.
        </p>
      </header>

      <p className="ups-note" data-testid="ups-annotation-gate">
        {props.unlocked
          ? "Annotation gate unlocked"
          : "Annotation gate locked: select baseline first"}
      </p>
      <p className="ups-note" data-testid="ups-revision-head">
        revisionHead={props.revisionHeadId ?? "pending"}
      </p>

      <label className="ups-form-field" htmlFor="ups-comment-target-selector">
        <span>Target selector</span>
        <input
          id="ups-comment-target-selector"
          value={props.draft.selector}
          onChange={(event) => {
            props.onChangeDraft({ selector: event.target.value });
          }}
          disabled={!props.unlocked || props.busy}
          data-testid="ups-comment-target-selector"
        />
      </label>

      <label className="ups-form-field" htmlFor="ups-comment-target-label">
        <span>Element label</span>
        <input
          id="ups-comment-target-label"
          value={props.draft.elementLabel}
          onChange={(event) => {
            props.onChangeDraft({ elementLabel: event.target.value });
          }}
          disabled={!props.unlocked || props.busy}
          data-testid="ups-comment-target-label"
        />
      </label>

      <label className="ups-form-field" htmlFor="ups-comment-od-id">
        <span>OD ID (optional)</span>
        <input
          id="ups-comment-od-id"
          value={props.draft.odId}
          onChange={(event) => {
            props.onChangeDraft({ odId: event.target.value });
          }}
          disabled={!props.unlocked || props.busy}
          data-testid="ups-comment-od-id"
        />
      </label>

      <label className="ups-form-field" htmlFor="ups-comment-severity">
        <span>Severity</span>
        <select
          id="ups-comment-severity"
          value={props.draft.severity}
          onChange={(event) => {
            const value = event.target.value as StudioCommentSeverity;
            props.onChangeDraft({ severity: value });
          }}
          disabled={!props.unlocked || props.busy}
          data-testid="ups-comment-severity"
        >
          {SEVERITY_OPTIONS.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
      </label>

      <label className="ups-form-field" htmlFor="ups-comment-intent">
        <span>Intent</span>
        <input
          id="ups-comment-intent"
          value={props.draft.intent}
          onChange={(event) => {
            props.onChangeDraft({ intent: event.target.value });
          }}
          disabled={!props.unlocked || props.busy}
          data-testid="ups-comment-intent"
        />
      </label>

      <label className="ups-form-field" htmlFor="ups-comment-note">
        <span>Note</span>
        <textarea
          id="ups-comment-note"
          value={props.draft.note}
          onChange={(event) => {
            props.onChangeDraft({ note: event.target.value });
          }}
          disabled={!props.unlocked || props.busy}
          rows={4}
          data-testid="ups-comment-note"
        />
      </label>

      <button
        type="button"
        className="ups-button"
        onClick={props.onCaptureComment}
        disabled={!props.unlocked || props.busy}
        data-testid="ups-capture-comment"
      >
        Capture Comment
      </button>

      <ul className="ups-comment-stream" data-testid="ups-comment-stream">
        {props.comments.map((comment) => (
          <li key={comment.commentId}>
            <p>
              {comment.target.selector} [{comment.severity}] {comment.intent}
            </p>
            <p>{comment.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
