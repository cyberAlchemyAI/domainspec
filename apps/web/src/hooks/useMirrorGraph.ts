import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ApiError,
  DEFAULT_FEATURE_ID,
  DEFAULT_PROJECT_KEY,
  getMirrorCards,
  getRelationshipGraph,
  rebuildProjection,
  type AspectKind,
  type GraphBoard,
  type GraphEdge,
  type GraphNode,
  type MirrorCard,
  type ProjectionScopeInput,
  type SelectionSource,
  type WhiteboardCardType,
  type WhiteboardViewLevel,
} from "../lib/api";
import { queryKeys } from "../lib/query-keys";

interface MirrorNavigationState {
  activeAspect: AspectKind;
  viewLevel: WhiteboardViewLevel;
  selectedFeatureId: string | null;
  selectedGroupKey: string | null;
}

export interface SelectedWhiteboardCard {
  cardId: string;
  cardType: WhiteboardCardType;
  conceptId: string | null;
  groupKey: string | null;
  title: string;
  summary: string;
  source: SelectionSource;
}

interface MirrorGraphState {
  cards: MirrorCard[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  board: GraphBoard;
  navigation: MirrorNavigationState;
  selectedCard: SelectedWhiteboardCard | null;
  generatedAt: string | null;
  snapshotId: string | null;
  loading: boolean;
  syncing: boolean;
  errorMessage: string | null;
}

interface UseMirrorGraphInput extends ProjectionScopeInput {}

interface LoadProjectionOptions {
  forceRebuild: boolean;
  includeCards: boolean;
  navigation: MirrorNavigationState;
}

const INITIAL_NAVIGATION = readInitialNavigation();

const initialState: MirrorGraphState = {
  cards: [],
  nodes: [],
  edges: [],
  board: {
    viewLevel: INITIAL_NAVIGATION.viewLevel,
    activeAspect: INITIAL_NAVIGATION.activeAspect,
    selectedFeatureId: INITIAL_NAVIGATION.selectedFeatureId,
    selectedGroupKey: INITIAL_NAVIGATION.selectedGroupKey,
  },
  navigation: INITIAL_NAVIGATION,
  selectedCard: null,
  generatedAt: null,
  snapshotId: null,
  loading: true,
  syncing: false,
  errorMessage: null,
};

const AUTOREBUILD_ERROR_CODES = new Set([
  "MIRROR_PROJECTION_NOT_FOUND",
  "MIRROR_REQUIRED_FILE_MISSING",
]);

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.useMirrorGraph
 *     type: Hook
 *     concern: sys
 */
export function useMirrorGraph(input: UseMirrorGraphInput = {}) {
  const projectKey = input.projectKey ?? DEFAULT_PROJECT_KEY;
  const featureId = input.featureId ?? DEFAULT_FEATURE_ID;

  const [state, setState] = useState<MirrorGraphState>(initialState);
  const stateRef = useRef(state);
  const requestVersionRef = useRef(0);
  const historyWriteModeRef = useRef<"replace" | "push">("replace");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * domainspec:
   *   concept:
   *     id: ui.knowledge-graph-visualization.GraphDataBinding
   *     type: Binding
   *     concern: sys
   *   edges:
   *     - edge: fetches
   *       to: knowledge-graph-visualization.GetMirrorCards
   *     - edge: fetches
   *       to: knowledge-graph-visualization.GetRelationshipGraph
   */
  const loadProjection = useCallback(
    async (options: LoadProjectionOptions) => {
      const requestVersion = ++requestVersionRef.current;

      setState((previous) => ({
        ...previous,
        loading: previous.snapshotId === null && options.includeCards,
        syncing: true,
        errorMessage: null,
      }));

      try {
        const scope = { projectKey, featureId };

        if (options.forceRebuild) {
          await rebuildProjection(scope);
        }

        const cardsKey = queryKeys.kg.cards(projectKey, featureId);
        const graphKey = queryKeys.kg.graph(
          projectKey,
          featureId,
          options.navigation.activeAspect,
          options.navigation.viewLevel,
          options.navigation.selectedFeatureId,
          options.navigation.selectedGroupKey,
        );

        void cardsKey;
        void graphKey;

        const cardsPromise = options.includeCards
          ? getMirrorCards(scope, {
              activeAspect: options.navigation.activeAspect,
            })
          : Promise.resolve(null);
        const graphPromise = getRelationshipGraph(scope, {
          activeAspect: options.navigation.activeAspect,
          viewLevel: options.navigation.viewLevel,
          selectedFeatureId: options.navigation.selectedFeatureId,
          selectedGroupKey: options.navigation.selectedGroupKey,
        });

        const [cardsResponse, graphResponse] = await Promise.all([
          cardsPromise,
          graphPromise,
        ]);

        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        const previous = stateRef.current;

        setState({
          cards: cardsResponse?.cards ?? previous.cards,
          nodes: graphResponse.nodes,
          edges: graphResponse.edges,
          board: graphResponse.board,
          navigation: {
            activeAspect: graphResponse.board.activeAspect,
            viewLevel: graphResponse.board.viewLevel,
            selectedFeatureId: graphResponse.board.selectedFeatureId,
            selectedGroupKey: graphResponse.board.selectedGroupKey,
          },
          selectedCard: previous.selectedCard,
          generatedAt:
            cardsResponse?.generatedAt ?? graphResponse.generatedAt ?? null,
          snapshotId: cardsResponse?.snapshotId ?? graphResponse.snapshotId,
          loading: false,
          syncing: false,
          errorMessage: null,
        });
      } catch (error) {
        if (
          !options.forceRebuild &&
          error instanceof ApiError &&
          AUTOREBUILD_ERROR_CODES.has(error.code)
        ) {
          await loadProjection({
            ...options,
            forceRebuild: true,
          });
          return;
        }

        if (requestVersion !== requestVersionRef.current) {
          return;
        }

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
    [featureId, projectKey],
  );

  useEffect(() => {
    void loadProjection({
      forceRebuild: false,
      includeCards: true,
      navigation: INITIAL_NAVIGATION,
    });
  }, [loadProjection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("projectKey", projectKey);
    params.set("featureId", featureId);
    params.set("activeAspect", state.navigation.activeAspect);
    params.set("viewLevel", state.navigation.viewLevel);

    setOrDelete(
      params,
      "selectedFeatureId",
      state.navigation.selectedFeatureId,
    );
    setOrDelete(params, "selectedGroupKey", state.navigation.selectedGroupKey);
    setOrDelete(params, "selectedCardId", state.selectedCard?.cardId ?? null);

    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query.length > 0 ? `?${query}` : ""}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl === nextUrl) {
      historyWriteModeRef.current = "replace";
      return;
    }

    if (historyWriteModeRef.current === "push") {
      window.history.pushState(null, "", nextUrl);
      historyWriteModeRef.current = "replace";
      return;
    }

    window.history.replaceState(null, "", nextUrl);
  }, [
    featureId,
    projectKey,
    state.navigation.activeAspect,
    state.navigation.selectedFeatureId,
    state.navigation.selectedGroupKey,
    state.navigation.viewLevel,
    state.selectedCard?.cardId,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      const navigation = readNavigationFromUrl(window.location.search);

      historyWriteModeRef.current = "replace";
      setState((previous) => ({
        ...previous,
        navigation,
        selectedCard: null,
      }));

      void loadProjection({
        forceRebuild: false,
        includeCards: false,
        navigation,
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loadProjection]);

  const selectAspect = useCallback(
    (aspectKind: AspectKind, source: SelectionSource = "rail") => {
      const nextNavigation: MirrorNavigationState = {
        activeAspect: aspectKind,
        viewLevel: "aspect",
        selectedFeatureId: null,
        selectedGroupKey: null,
      };

      historyWriteModeRef.current = "push";

      setState((previous) => ({
        ...previous,
        navigation: nextNavigation,
        selectedCard: {
          cardId: `aspect:${aspectKind}`,
          cardType: "aspect",
          conceptId: null,
          groupKey: aspectKind,
          title: aspectKind,
          summary: `Aspect ${aspectKind}`,
          source,
        },
      }));

      void loadProjection({
        forceRebuild: false,
        includeCards: false,
        navigation: nextNavigation,
      });
    },
    [loadProjection],
  );

  /**
   * domainspec:
   *   concept:
   *     id: ui.knowledge-graph-visualization.ConceptFocusBinding
   *     type: Binding
   *     concern: sys
   *   edges:
   *     - edge: mutates
   *       to: knowledge-graph-visualization.SelectConcept
   */
  const selectWhiteboardCard = useCallback(
    (node: GraphNode, source: SelectionSource = "board") => {
      const previous = stateRef.current;
      const nextNavigation = applySelectConceptOperation(
        previous.navigation,
        node,
      );

      historyWriteModeRef.current = "push";

      setState((current) => ({
        ...current,
        navigation: nextNavigation,
        selectedCard: {
          cardId: node.cardId,
          cardType: node.cardType,
          conceptId: node.conceptId,
          groupKey: node.groupKey,
          title: node.title,
          summary: node.summary,
          source,
        },
      }));

      void loadProjection({
        forceRebuild: false,
        includeCards: false,
        navigation: nextNavigation,
      });
    },
    [loadProjection],
  );

  const refreshProjection = useCallback(async () => {
    await loadProjection({
      forceRebuild: true,
      includeCards: true,
      navigation: stateRef.current.navigation,
    });
  }, [loadProjection]);

  return useMemo(
    () => ({
      projectKey,
      featureId,
      ...state,
      selectAspect,
      selectWhiteboardCard,
      refreshProjection,
    }),
    [
      featureId,
      projectKey,
      refreshProjection,
      selectAspect,
      selectWhiteboardCard,
      state,
    ],
  );
}

function readInitialNavigation(): MirrorNavigationState {
  return readNavigationFromUrl();
}

function readNavigationFromUrl(search?: string): MirrorNavigationState {
  if (typeof window === "undefined") {
    return {
      activeAspect: "SPEC",
      viewLevel: "aspect",
      selectedFeatureId: null,
      selectedGroupKey: null,
    };
  }

  const params = new URLSearchParams(search ?? window.location.search);
  return {
    activeAspect: parseAspectKind(params.get("activeAspect"), "SPEC"),
    viewLevel: parseViewLevel(params.get("viewLevel"), "aspect"),
    selectedFeatureId: normalizeOptional(params.get("selectedFeatureId")),
    selectedGroupKey: normalizeOptional(params.get("selectedGroupKey")),
  };
}

function parseAspectKind(
  value: string | null,
  defaultValue: AspectKind,
): AspectKind {
  const normalized = value?.trim().toUpperCase();
  switch (normalized) {
    case "SPEC":
    case "DOMAIN":
    case "OPERATIONS":
    case "QUERIES":
    case "INTERFACES":
    case "MAPPINGS":
    case "WORKFLOWS":
    case "EVENTS":
    case "STATES":
      return normalized;
    default:
      return defaultValue;
  }
}

function parseViewLevel(
  value: string | null,
  defaultValue: WhiteboardViewLevel,
): WhiteboardViewLevel {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === "aspect" ||
    normalized === "feature" ||
    normalized === "concept"
  ) {
    return normalized;
  }
  return defaultValue;
}

function normalizeOptional(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.SelectConcept
 *     type: Operation
 *     concern: sys
 */
function applySelectConceptOperation(
  current: MirrorNavigationState,
  node: GraphNode,
): MirrorNavigationState {
  return deriveNextNavigation(current, node);
}

function deriveNextNavigation(
  current: MirrorNavigationState,
  node: GraphNode,
): MirrorNavigationState {
  if (node.cardType === "feature") {
    return {
      activeAspect: current.activeAspect,
      viewLevel: "feature",
      selectedFeatureId: resolveFeatureSelection(node),
      selectedGroupKey: null,
    };
  }

  if (node.cardType === "concept-group") {
    const selectedGroupKey =
      node.groupKey ?? normalizeCardSuffix(node.cardId, "concept-group:");
    return {
      activeAspect: current.activeAspect,
      viewLevel: "feature",
      selectedFeatureId: current.selectedFeatureId,
      selectedGroupKey,
    };
  }

  if (node.cardType === "concept" || node.cardType === "story") {
    return {
      activeAspect: current.activeAspect,
      viewLevel: "concept",
      selectedFeatureId: current.selectedFeatureId,
      selectedGroupKey: node.groupKey ?? current.selectedGroupKey,
    };
  }

  return current;
}

function resolveFeatureSelection(node: GraphNode): string | null {
  if (node.conceptId && node.conceptId.trim().length > 0) {
    return node.conceptId;
  }

  return normalizeCardSuffix(node.cardId, "feature:");
}

function normalizeCardSuffix(cardId: string, prefix: string): string | null {
  if (!cardId.startsWith(prefix)) {
    return null;
  }

  const suffix = cardId.slice(prefix.length).trim();
  return suffix.length > 0 ? suffix : null;
}

function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string | null,
): void {
  if (value && value.trim().length > 0) {
    params.set(key, value);
    return;
  }

  params.delete(key);
}
