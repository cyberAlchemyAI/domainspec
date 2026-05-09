import { makeApplyApprovedBatchUseCase } from "./apply-approved-batch.js";
import { makeApproveMutationBatchUseCase } from "./approve-mutation-batch.js";
import { makeCaptureCommentEventUseCase } from "./capture-comment-event.js";
import { makeExportDesignHandoffUseCase } from "./export-design-handoff.js";
import { makeGenerateStudioVariantsUseCase } from "./generate-variants.js";
import { makeGetDraftMutationBatchQuery } from "./get-draft-mutation-batch.js";
import { makeGetHandoffBundleQuery } from "./get-handoff-bundle.js";
import { makeGetStudioSessionSnapshotQuery } from "./get-session-snapshot.js";
import { makeInitializeStudioSessionUseCase } from "./initialize-session.js";
import { makeListRevisionManifestQuery } from "./list-revision-manifest.js";
import { makeListStudioSessionVariantsQuery } from "./list-session-variants.js";
import type { StudioSessionStorePort } from "./ports.js";
import { makeSelectOrCommitBaselineUseCase } from "./select-or-commit-baseline.js";
import { makeSubmitStudioPromptUseCase } from "./submit-prompt.js";
import { makeSynthesizeMutationBatchUseCase } from "./synthesize-mutation-batch.js";

interface CreateStudioOrchestrationModuleOptions {
  featureDocsRootDir: string;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.StudioOrchestrationModule
 *     type: Interface
 */
export function createStudioOrchestrationModule(
  store: StudioSessionStorePort,
  options: CreateStudioOrchestrationModuleOptions,
) {
  return {
    initializeSession: makeInitializeStudioSessionUseCase(store),
    submitPrompt: makeSubmitStudioPromptUseCase(store),
    generateVariants: makeGenerateStudioVariantsUseCase(store),
    selectOrCommitBaseline: makeSelectOrCommitBaselineUseCase(store),
    captureCommentEvent: makeCaptureCommentEventUseCase(store),
    synthesizeMutationBatch: makeSynthesizeMutationBatchUseCase(store),
    approveMutationBatch: makeApproveMutationBatchUseCase(store),
    applyApprovedBatch: makeApplyApprovedBatchUseCase(store),
    exportDesignHandoff: makeExportDesignHandoffUseCase(store, {
      featureDocsRootDir: options.featureDocsRootDir,
    }),
    getSessionSnapshot: makeGetStudioSessionSnapshotQuery(store),
    listSessionVariants: makeListStudioSessionVariantsQuery(store),
    getDraftMutationBatch: makeGetDraftMutationBatchQuery(store),
    listRevisionManifest: makeListRevisionManifestQuery(store),
    getHandoffBundle: makeGetHandoffBundleQuery(store),
  };
}
