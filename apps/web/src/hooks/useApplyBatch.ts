import { useCallback, useState } from "react";

import {
  applyStudioMutationBatch,
  exportStudioDesignHandoff,
  type StudioApplyBatchMutationResponse,
  type StudioExportHandoffResponse,
} from "../lib/api";

export interface UseApplyBatchResult {
  applying: boolean;
  exporting: boolean;
  applyBatch: (
    batchId: string,
    applyRequestedBy: string,
  ) => Promise<StudioApplyBatchMutationResponse>;
  exportHandoff: (
    requestedBy: string,
    exportProfile?: string,
  ) => Promise<StudioExportHandoffResponse>;
}

export function useApplyBatch(sessionId: string | null): UseApplyBatchResult {
  const [applying, setApplying] = useState(false);
  const [exporting, setExporting] = useState(false);

  const applyBatch = useCallback(
    async (
      batchId: string,
      applyRequestedBy: string,
    ): Promise<StudioApplyBatchMutationResponse> => {
      if (!sessionId) {
        throw new Error("Session is required before apply.");
      }

      setApplying(true);
      try {
        return await applyStudioMutationBatch(sessionId, batchId, {
          applyRequestedBy,
        });
      } finally {
        setApplying(false);
      }
    },
    [sessionId],
  );

  const exportHandoff = useCallback(
    async (
      requestedBy: string,
      exportProfile?: string,
    ): Promise<StudioExportHandoffResponse> => {
      if (!sessionId) {
        throw new Error("Session is required before handoff export.");
      }

      setExporting(true);
      try {
        return await exportStudioDesignHandoff(sessionId, {
          exportProfile,
          requestedBy,
        });
      } finally {
        setExporting(false);
      }
    },
    [sessionId],
  );

  return {
    applying,
    exporting,
    applyBatch,
    exportHandoff,
  };
}
