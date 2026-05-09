import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApiError,
  approveStudioMutationBatch,
  captureStudioCommentEvent,
  generateStudioVariants,
  getStudioSessionSnapshot,
  getStudioHandoffBundle,
  initializeStudioSession,
  listStudioRevisionManifest,
  selectOrCommitStudioBaseline,
  synthesizeStudioMutationBatch,
  submitStudioPrompt,
  type StudioCommentEvent,
  type StudioCommentSeverity,
  type StudioHandoffBundle,
  type StudioMutationBatch,
  type StudioRevisionManifestEntry,
  type StudioSessionSnapshot,
  type StudioVariant,
} from "../lib/api";
import { useApplyBatch } from "./useApplyBatch";
import { useDraftMutationBatch } from "./useDraftMutationBatch";

export interface StudioAnnotationDraft {
  selector: string;
  elementLabel: string;
  odId: string;
  severity: StudioCommentSeverity;
  intent: string;
  note: string;
}

export interface UseUiPrototypingStudioResult {
  session: StudioSessionSnapshot | null;
  variants: StudioVariant[];
  comments: StudioCommentEvent[];
  draftBatch: StudioMutationBatch | null;
  revisions: StudioRevisionManifestEntry[];
  handoffBundle: StudioHandoffBundle | null;
  prompt: string;
  variantCount: 1 | 2 | 3;
  annotationDraft: StudioAnnotationDraft;
  loading: boolean;
  busy: boolean;
  errorMessage: string | null;
  draftErrorMessage: string | null;
  annotationUnlocked: boolean;
  committedBaseline: boolean;
  approvalPending: boolean;
  applyEnabled: boolean;
  setPrompt: (value: string) => void;
  setVariantCount: (value: 1 | 2 | 3) => void;
  setAnnotationDraft: (value: Partial<StudioAnnotationDraft>) => void;
  startSession: () => Promise<void>;
  submitPrompt: () => Promise<void>;
  generateVariants: () => Promise<void>;
  selectBaseline: (label: string) => Promise<void>;
  captureComment: () => Promise<void>;
  synthesizeBatch: () => Promise<void>;
  approveBatch: () => Promise<void>;
  applyBatch: () => Promise<void>;
  exportHandoff: () => Promise<void>;
  refreshHandoffBundle: () => Promise<void>;
}

export function useUiPrototypingStudio(): UseUiPrototypingStudioResult {
  const initialVariantCount = readInitialVariantCount();

  const [session, setSession] = useState<StudioSessionSnapshot | null>(null);
  const [variants, setVariants] = useState<StudioVariant[]>([]);
  const [comments, setComments] = useState<StudioCommentEvent[]>([]);
  const [revisions, setRevisions] = useState<StudioRevisionManifestEntry[]>([]);
  const [handoffBundle, setHandoffBundle] =
    useState<StudioHandoffBundle | null>(null);
  const [prompt, setPrompt] = useState("");
  const [variantCount, setVariantCount] = useState<1 | 2 | 3>(
    initialVariantCount,
  );
  const [annotationDraft, setAnnotationDraftState] =
    useState<StudioAnnotationDraft>(defaultAnnotationDraft());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const draftMutationBatch = useDraftMutationBatch(session?.sessionId ?? null);
  const applyBatchHook = useApplyBatch(session?.sessionId ?? null);

  const refreshSession = useCallback(async (): Promise<void> => {
    if (!session) {
      return;
    }
    const snapshot = await getStudioSessionSnapshot(session.sessionId);
    setSession(snapshot);
  }, [session]);

  const refreshRevisionManifest = useCallback(async (): Promise<void> => {
    if (!session) {
      setRevisions([]);
      return;
    }

    const result = await listStudioRevisionManifest(session.sessionId, {
      limit: 50,
      newestFirst: true,
    });
    setRevisions(result.entries);
  }, [session]);

  const startSession = useCallback(async () => {
    setBusy(true);
    setErrorMessage(null);

    try {
      const nextSession = await initializeStudioSession({
        requestedVariantCount: variantCount,
        requestedBy: "web-ui",
      });

      setSession(nextSession);
      setVariantCount(nextSession.variantCount);
      setVariants([]);
      setComments([]);
      draftMutationBatch.setDraftBatch(null);
      setRevisions([]);
      setHandoffBundle(null);
      setAnnotationDraftState(defaultAnnotationDraft());
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }, [draftMutationBatch, variantCount]);

  const submitPromptAction = useCallback(async () => {
    if (!session) {
      setErrorMessage("Start a session before submitting a prompt.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const nextSession = await submitStudioPrompt(session.sessionId, {
        prompt,
        submittedBy: "web-ui",
      });
      setSession(nextSession);
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [prompt, session]);

  const generateVariantsAction = useCallback(async () => {
    if (!session) {
      setErrorMessage("Start a session before generating variants.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const result = await generateStudioVariants(session.sessionId, {
        requestedBy: "web-ui",
      });
      setSession(result.session);
      setVariants(result.variants);
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [session]);

  const selectBaseline = useCallback(
    async (label: string) => {
      if (!session) {
        setErrorMessage("Start a session before selecting baseline.");
        return;
      }

      setBusy(true);
      setErrorMessage(null);

      try {
        const result = await selectOrCommitStudioBaseline(session.sessionId, {
          selectedLabel: label,
          requestedBy: "web-ui",
        });
        setSession(result.session);
        setVariants(result.variants);
      } catch (error) {
        setErrorMessage(toUiMessage(error));
      } finally {
        setBusy(false);
      }
    },
    [session],
  );

  const captureComment = useCallback(async () => {
    if (!session) {
      setErrorMessage("Start a session before capturing comments.");
      return;
    }
    if (!session.revisionHeadId) {
      setErrorMessage("Revision head is required before capturing comments.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const comment = await captureStudioCommentEvent(session.sessionId, {
        revisionId: session.revisionHeadId,
        target: {
          selector: annotationDraft.selector,
          elementLabel: annotationDraft.elementLabel,
          ...(annotationDraft.odId.trim().length > 0
            ? { odId: annotationDraft.odId.trim() }
            : {}),
        },
        severity: annotationDraft.severity,
        intent: annotationDraft.intent,
        note: annotationDraft.note,
        createdBy: "web-ui",
      });

      setComments((previous) => [...previous, comment]);
      await refreshSession();
      setAnnotationDraftState((previous) => ({
        ...previous,
        note: "",
      }));
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [annotationDraft, refreshSession, session]);

  const synthesizeBatch = useCallback(async () => {
    if (!session) {
      setErrorMessage("Start a session before synthesis.");
      return;
    }
    if (!session.revisionHeadId) {
      setErrorMessage("Revision head is required before synthesis.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const result = await synthesizeStudioMutationBatch(session.sessionId, {
        sourceRevisionId: session.revisionHeadId,
        requestedBy: "web-ui",
      });
      setSession(result.session);
      draftMutationBatch.setDraftBatch(result.batch);
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [draftMutationBatch, session]);

  const approveBatch = useCallback(async () => {
    if (!session) {
      setErrorMessage("Start a session before approval.");
      return;
    }
    if (!draftMutationBatch.draftBatch) {
      setErrorMessage("Create a draft batch before approval.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const result = await approveStudioMutationBatch(
        session.sessionId,
        draftMutationBatch.draftBatch.batchId,
        {
          approvedBy: "web-ui",
          approvedAt: new Date().toISOString(),
        },
      );
      setSession(result.session);
      draftMutationBatch.setDraftBatch(result.batch);
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [draftMutationBatch, session]);

  const applyBatch = useCallback(async () => {
    if (!draftMutationBatch.draftBatch) {
      setErrorMessage("Create and approve a draft batch before apply.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const result = await applyBatchHook.applyBatch(
        draftMutationBatch.draftBatch.batchId,
        "web-ui",
      );
      setSession(result.session);
      draftMutationBatch.setDraftBatch(null);
      setRevisions((previous) => [result.revision, ...previous]);
      await refreshRevisionManifest();
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [applyBatchHook, draftMutationBatch, refreshRevisionManifest]);

  const exportHandoff = useCallback(async () => {
    setBusy(true);
    setErrorMessage(null);

    try {
      const result = await applyBatchHook.exportHandoff("web-ui", "mvp");
      setSession(result.session);
      setHandoffBundle(result.bundle);
    } catch (error) {
      setErrorMessage(toUiMessage(error));
    } finally {
      setBusy(false);
    }
  }, [applyBatchHook]);

  const refreshHandoffBundle = useCallback(async () => {
    if (!session) {
      return;
    }

    setBusy(true);
    setErrorMessage(null);
    try {
      const bundle = await getStudioHandoffBundle(session.sessionId);
      setHandoffBundle(bundle);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "HANDOFF_BUNDLE_NOT_READY"
      ) {
        setHandoffBundle(null);
      } else {
        setErrorMessage(toUiMessage(error));
      }
    } finally {
      setBusy(false);
    }
  }, [session]);

  const setAnnotationDraft = useCallback(
    (value: Partial<StudioAnnotationDraft>) => {
      setAnnotationDraftState((previous) => ({
        ...previous,
        ...value,
      }));
    },
    [],
  );

  useEffect(() => {
    void startSession();
  }, []);

  useEffect(() => {
    if (!session?.revisionHeadId) {
      setRevisions([]);
      return;
    }
    void refreshRevisionManifest();
  }, [refreshRevisionManifest, session?.revisionHeadId]);

  useEffect(() => {
    if (!session?.integration.uiPhaseBridgeReady) {
      setHandoffBundle(null);
      return;
    }
    void refreshHandoffBundle();
  }, [refreshHandoffBundle, session?.integration.uiPhaseBridgeReady]);

  const annotationUnlocked = useMemo(
    () => session?.selectionGate === "satisfied",
    [session],
  );

  const committedBaseline = useMemo(
    () => session?.baseline?.mode === "committed",
    [session],
  );

  const approvalPending = useMemo(
    () => draftMutationBatch.draftBatch?.status === "draft",
    [draftMutationBatch.draftBatch],
  );

  const applyEnabled = useMemo(
    () =>
      session?.applyGate === "satisfied" &&
      draftMutationBatch.draftBatch?.status === "approved",
    [draftMutationBatch.draftBatch, session],
  );

  const computedBusy =
    busy ||
    draftMutationBatch.loading ||
    applyBatchHook.applying ||
    applyBatchHook.exporting;

  return {
    session,
    variants,
    comments,
    draftBatch: draftMutationBatch.draftBatch,
    revisions,
    handoffBundle,
    prompt,
    variantCount,
    annotationDraft,
    loading,
    busy: computedBusy,
    errorMessage,
    draftErrorMessage: draftMutationBatch.errorMessage,
    annotationUnlocked,
    committedBaseline,
    approvalPending,
    applyEnabled,
    setPrompt,
    setVariantCount,
    setAnnotationDraft,
    startSession,
    submitPrompt: submitPromptAction,
    generateVariants: generateVariantsAction,
    selectBaseline,
    captureComment,
    synthesizeBatch,
    approveBatch,
    applyBatch,
    exportHandoff,
    refreshHandoffBundle,
  };
}

function defaultAnnotationDraft(): StudioAnnotationDraft {
  return {
    selector: "",
    elementLabel: "",
    odId: "",
    severity: "medium",
    intent: "",
    note: "",
  };
}

function readInitialVariantCount(): 1 | 2 | 3 {
  if (typeof window === "undefined") {
    return 3;
  }

  const value = new URLSearchParams(window.location.search).get("variantCount");
  const parsed = Number(value);

  if (parsed === 1 || parsed === 2 || parsed === 3) {
    return parsed;
  }

  return 3;
}

function toUiMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Unexpected request failure. Please retry.";
  }

  switch (error.code) {
    case "VARIANT_COUNT_OUT_OF_RANGE":
      return "Select a variant count between 1 and 3.";
    case "PROMPT_REQUIRED":
      return "Prompt is required.";
    case "PROMPT_NOT_SET":
      return "Submit a prompt before generating variants.";
    case "BASELINE_SELECTION_REQUIRED":
      return "Select a baseline before continuing.";
    case "BASELINE_LABEL_INVALID":
      return "Selected baseline label is invalid.";
    case "COMMENT_SCHEMA_INVALID":
      return "Comment is missing required fields.";
    case "BASELINE_GATE_UNSATISFIED":
      return "Select or commit baseline before commenting.";
    case "COMMENT_SET_EMPTY":
      return "Capture at least one comment before synthesis.";
    case "SOURCE_REVISION_INVALID":
      return "Revision is stale. Refresh session state and retry.";
    case "APPROVAL_METADATA_REQUIRED":
      return "Approval metadata is required.";
    case "BATCH_NOT_DRAFT":
      return "Only draft batches can be approved.";
    case "BATCH_APPROVAL_REQUIRED":
      return "Approve the draft batch before apply.";
    case "AUTO_APPLY_FORBIDDEN":
      return "Auto-apply is forbidden in MVP.";
    case "BATCH_STALE_FOR_HEAD":
      return "Batch source revision is stale. Re-synthesize the batch.";
    case "HANDOFF_REVISION_REQUIRED":
      return "Export requires at least one applied revision.";
    case "HANDOFF_REFERENCE_INCOMPLETE":
      return "Handoff references are incomplete.";
    case "UPS_AUTH_REQUIRED":
    case "UPS_AUTH_FORBIDDEN":
      return "Session permissions are missing for UI prototyping studio.";
    default:
      return error.message;
  }
}
