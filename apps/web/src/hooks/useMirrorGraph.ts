import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApiError,
  DEFAULT_FEATURE_ID,
  getMirrorCards,
  getRelationshipGraph,
  rebuildProjection,
  type GraphEdge,
  type GraphNode,
  type MirrorCard,
} from "../lib/api";
import { queryKeys } from "../lib/query-keys";

interface MirrorGraphState {
  cards: MirrorCard[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  generatedAt: string | null;
  snapshotId: string | null;
  loading: boolean;
  syncing: boolean;
  errorMessage: string | null;
}

const initialState: MirrorGraphState = {
  cards: [],
  nodes: [],
  edges: [],
  generatedAt: null,
  snapshotId: null,
  loading: true,
  syncing: false,
  errorMessage: null,
};

export function useMirrorGraph(featureId = DEFAULT_FEATURE_ID) {
  const [state, setState] = useState<MirrorGraphState>(initialState);

  const loadProjection = useCallback(
    async (forceRebuild: boolean) => {
      setState((previous) => ({
        ...previous,
        loading: previous.snapshotId === null,
        syncing: true,
        errorMessage: null,
      }));

      try {
        if (forceRebuild) {
          await rebuildProjection(featureId);
        }

        const cardsKey = queryKeys.kg.cards(featureId);
        const graphKey = queryKeys.kg.graph(featureId);

        void cardsKey;
        void graphKey;

        let cardsResponse;
        let graphResponse;

        try {
          [cardsResponse, graphResponse] = await Promise.all([
            getMirrorCards(featureId),
            getRelationshipGraph(featureId),
          ]);
        } catch (error) {
          if (
            error instanceof ApiError &&
            (error.code === "MIRROR_PROJECTION_NOT_FOUND" ||
              error.code === "MIRROR_REQUIRED_FILE_MISSING")
          ) {
            await rebuildProjection(featureId);
            [cardsResponse, graphResponse] = await Promise.all([
              getMirrorCards(featureId),
              getRelationshipGraph(featureId),
            ]);
          } else {
            throw error;
          }
        }

        setState({
          cards: cardsResponse.cards,
          nodes: graphResponse.nodes,
          edges: graphResponse.edges,
          generatedAt: cardsResponse.generatedAt,
          snapshotId: cardsResponse.snapshotId,
          loading: false,
          syncing: false,
          errorMessage: null,
        });
      } catch (error) {
        const message =
          error instanceof ApiError
            ? `${error.message} (${error.code})`
            : "Unable to load knowledge graph projection.";

        setState((previous) => ({
          ...previous,
          loading: false,
          syncing: false,
          errorMessage: message,
        }));
      }
    },
    [featureId],
  );

  useEffect(() => {
    void loadProjection(false);
  }, [loadProjection]);

  const refreshProjection = useCallback(async () => {
    await loadProjection(true);
  }, [loadProjection]);

  return useMemo(
    () => ({
      ...state,
      refreshProjection,
    }),
    [state, refreshProjection],
  );
}
