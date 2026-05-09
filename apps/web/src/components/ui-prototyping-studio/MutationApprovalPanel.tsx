import type { StudioMutationBatch } from "../../lib/api";

interface MutationApprovalPanelProps {
  busy: boolean;
  draftBatch: StudioMutationBatch | null;
  approvalPending: boolean;
  applyEnabled: boolean;
  onSynthesizeBatch: () => void;
  onApproveBatch: () => void;
  onApplyBatch: () => void;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.MutationApprovalPanel
 *     type: Component
 *     concern: sys
 */
export function MutationApprovalPanel(props: MutationApprovalPanelProps) {
  return (
    <section className="panel ups-panel" aria-labelledby="ups-mutation-heading">
      <header className="panel__header">
        <h3 id="ups-mutation-heading">Mutation Approval Panel</h3>
        <p>
          Synthesize deterministic draft tasks, approve manually, then apply.
        </p>
      </header>

      <p className="ups-note" data-testid="ups-approval-status">
        {props.draftBatch
          ? `draftStatus=${props.draftBatch.status}`
          : "draftStatus=none"}
      </p>
      <p className="ups-note" data-testid="ups-apply-gate">
        {props.applyEnabled ? "applyGate=satisfied" : "applyGate=pending"}
      </p>

      <div className="ups-button-row">
        <button
          type="button"
          className="ups-button ups-button--secondary"
          onClick={props.onSynthesizeBatch}
          disabled={props.busy}
          data-testid="ups-synthesize-batch"
        >
          Synthesize Draft
        </button>
        <button
          type="button"
          className="ups-button"
          onClick={props.onApproveBatch}
          disabled={props.busy || !props.approvalPending}
          data-testid="ups-approve-batch"
        >
          Approve Draft
        </button>
      </div>

      <button
        type="button"
        className="ups-button"
        onClick={props.onApplyBatch}
        disabled={props.busy || !props.applyEnabled}
        data-testid="ups-apply-batch"
      >
        Apply Approved Batch
      </button>

      {props.draftBatch ? (
        <ul className="ups-task-list" data-testid="ups-draft-task-list">
          {props.draftBatch.tasks.map((task) => (
            <li key={task.taskId}>
              <p>
                {task.taskId} {"->"} {task.target}
              </p>
              <p>
                {task.changeType} [{task.priority}] {task.intent}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ups-note">No draft mutation batch available.</p>
      )}
    </section>
  );
}
