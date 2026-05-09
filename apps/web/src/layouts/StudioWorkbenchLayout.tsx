import { AppSidebar } from "../components/layout/AppSidebar";
import { AnnotationPanel } from "../components/ui-prototyping-studio/AnnotationPanel";
import { HandoffSummaryPanel } from "../components/ui-prototyping-studio/HandoffSummaryPanel";
import { MutationApprovalPanel } from "../components/ui-prototyping-studio/MutationApprovalPanel";
import { RevisionTimeline } from "../components/ui-prototyping-studio/RevisionTimeline";
import { SessionControlsPanel } from "../components/ui-prototyping-studio/SessionControlsPanel";
import { SessionStateIndicator } from "../components/ui-prototyping-studio/SessionStateIndicator";
import { VariantCanvas } from "../components/ui-prototyping-studio/VariantCanvas";
import type { StudioAnnotationDraft } from "../hooks/useUiPrototypingStudio";
import type {
  StudioCommentEvent,
  StudioHandoffBundle,
  StudioMutationBatch,
  StudioRevisionManifestEntry,
  StudioSessionSnapshot,
  StudioVariant,
} from "../lib/api";

interface StudioWorkbenchLayoutProps {
  currentPath: string;
  session: StudioSessionSnapshot | null;
  variants: StudioVariant[];
  comments: StudioCommentEvent[];
  draftBatch: StudioMutationBatch | null;
  revisions: StudioRevisionManifestEntry[];
  handoffBundle: StudioHandoffBundle | null;
  prompt: string;
  variantCount: 1 | 2 | 3;
  annotationDraft: StudioAnnotationDraft;
  busy: boolean;
  loading: boolean;
  errorMessage: string | null;
  draftErrorMessage: string | null;
  annotationUnlocked: boolean;
  committedBaseline: boolean;
  approvalPending: boolean;
  applyEnabled: boolean;
  onPromptChange: (value: string) => void;
  onVariantCountChange: (value: 1 | 2 | 3) => void;
  onAnnotationDraftChange: (value: Partial<StudioAnnotationDraft>) => void;
  onStartSession: () => void;
  onSubmitPrompt: () => void;
  onGenerateVariants: () => void;
  onSelectBaseline: (label: string) => void;
  onCaptureComment: () => void;
  onSynthesizeBatch: () => void;
  onApproveBatch: () => void;
  onApplyBatch: () => void;
  onExportHandoff: () => void;
  onRefreshHandoffBundle: () => void;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.StudioWorkbenchPage
 *     type: Page
 *     concern: sys
 *   edges:
 *     - edge: renders
 *       to: ui-prototyping-studio.VariantCanvas
 */
export function StudioWorkbenchLayout(props: StudioWorkbenchLayoutProps) {
  return (
    <div className="kg-shell">
      <AppSidebar currentPath={props.currentPath} />

      <main className="kg-content">
        <header className="kg-header">
          <div>
            <p className="kg-header__eyebrow">domainspec.ui-prototyping.read</p>
            <h1>UI Prototyping Studio</h1>
            <p className="kg-header__meta">
              Session start, bounded variant generation, and baseline gate
              controls.
            </p>
          </div>

          {props.session ? (
            <SessionStateIndicator
              state={props.session.state}
              selectionGate={props.session.selectionGate}
              applyGate={props.session.applyGate}
              baseline={props.session.baseline}
            />
          ) : null}
        </header>

        {props.errorMessage ? (
          <p className="ups-error" role="alert">
            {props.errorMessage}
          </p>
        ) : null}

        {props.draftErrorMessage ? (
          <p className="ups-error" role="alert">
            {props.draftErrorMessage}
          </p>
        ) : null}

        {props.loading ? (
          <p className="ups-note">
            Initializing UI prototyping studio session...
          </p>
        ) : null}

        <section className="ups-grid ups-grid--primary">
          <SessionControlsPanel
            prompt={props.prompt}
            variantCount={props.variantCount}
            busy={props.busy}
            sessionId={props.session?.sessionId ?? null}
            onPromptChange={props.onPromptChange}
            onVariantCountChange={props.onVariantCountChange}
            onStartSession={props.onStartSession}
            onSubmitPrompt={props.onSubmitPrompt}
            onGenerateVariants={props.onGenerateVariants}
          />
          <VariantCanvas
            variants={props.variants}
            selectionGate={props.session?.selectionGate ?? "pending"}
            baseline={props.session?.baseline ?? null}
            variantCount={props.variantCount}
            busy={props.busy}
            onSelectBaseline={props.onSelectBaseline}
          />
          <AnnotationPanel
            unlocked={props.annotationUnlocked}
            busy={props.busy}
            revisionHeadId={props.session?.revisionHeadId ?? null}
            draft={props.annotationDraft}
            comments={props.comments}
            onChangeDraft={props.onAnnotationDraftChange}
            onCaptureComment={props.onCaptureComment}
          />
        </section>

        <section className="ups-grid ups-grid--secondary">
          <MutationApprovalPanel
            busy={props.busy}
            draftBatch={props.draftBatch}
            approvalPending={props.approvalPending}
            applyEnabled={props.applyEnabled}
            onSynthesizeBatch={props.onSynthesizeBatch}
            onApproveBatch={props.onApproveBatch}
            onApplyBatch={props.onApplyBatch}
          />
          <RevisionTimeline revisions={props.revisions} />
          <HandoffSummaryPanel
            busy={props.busy}
            integration={props.session?.integration ?? null}
            bundle={props.handoffBundle}
            onExportHandoff={props.onExportHandoff}
            onRefreshBundle={props.onRefreshHandoffBundle}
          />
        </section>

        {props.committedBaseline ? (
          <p className="ups-note" data-testid="ups-committed-branch">
            Committed baseline branch is active for variantCount=1.
          </p>
        ) : null}
      </main>
    </div>
  );
}
