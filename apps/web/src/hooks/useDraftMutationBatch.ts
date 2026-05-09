import { useCallback, useEffect, useState } from "react";

import {
  ApiError,
  getDraftStudioMutationBatch,
  type StudioMutationBatch,
} from "../lib/api";

export interface UseDraftMutationBatchResult {
  draftBatch: StudioMutationBatch | null;
  loading: boolean;
  errorMessage: string | null;
  setDraftBatch: (batch: StudioMutationBatch | null) => void;
  fetchDraftBatch: (batchId?: string) => Promise<StudioMutationBatch | null>;
}

export function useDraftMutationBatch(
  sessionId: string | null,
): UseDraftMutationBatchResult {
  const [draftBatch, setDraftBatch] = useState<StudioMutationBatch | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDraftBatch = useCallback(
    async (batchId?: string): Promise<StudioMutationBatch | null> => {
      if (!sessionId) {
        setDraftBatch(null);
        setErrorMessage(null);
        return null;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const batch = await getDraftStudioMutationBatch(sessionId, {
          batchId,
        });
        setDraftBatch(batch);
        return batch;
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.code === "DRAFT_BATCH_NOT_FOUND"
        ) {
          setDraftBatch(null);
          return null;
        }
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to load draft mutation batch.";
        setErrorMessage(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  useEffect(() => {
    setDraftBatch(null);
    setErrorMessage(null);
  }, [sessionId]);

  return {
    draftBatch,
    loading,
    errorMessage,
    setDraftBatch,
    fetchDraftBatch,
  };
}
