import type { StudioRevisionManifestEntry } from "../../lib/api";

interface RevisionTimelineProps {
  revisions: StudioRevisionManifestEntry[];
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.RevisionTimeline
 *     type: Component
 *     concern: sys
 */
export function RevisionTimeline(props: RevisionTimelineProps) {
  return (
    <section className="panel ups-panel" aria-labelledby="ups-revision-heading">
      <header className="panel__header">
        <h3 id="ups-revision-heading">Revision Timeline</h3>
        <p>Append-only revision evidence for each successful apply.</p>
      </header>

      {props.revisions.length === 0 ? (
        <p className="ups-note">No revisions recorded yet.</p>
      ) : (
        <ol className="ups-revision-list" data-testid="ups-revision-list">
          {props.revisions.map((revision) => (
            <li key={revision.revisionId}>
              <p>
                revision={revision.revisionId} parent=
                {revision.parentRevisionId}
              </p>
              <p>
                batch={revision.appliedBatchId} tasks=
                {revision.appliedTaskIds.length}
              </p>
              <p>
                diff={revision.diffSummary.added}/{revision.diffSummary.changed}
                /{revision.diffSummary.removed}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
