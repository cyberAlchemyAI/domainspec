import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ApiError,
  DEFAULT_FEATURE_ID,
  DEFAULT_PROJECT_KEY,
  getConceptDetailCard,
  openDefinition,
  type AspectKind,
  type ConceptDetailCard,
  type DefinitionPointer,
  type ProjectionScopeInput,
  type WhiteboardCardType,
  type WhiteboardViewLevel,
} from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import type { SelectedWhiteboardCard } from "./useMirrorGraph";

export type ExplorationState =
  | "Idle"
  | "ProjectionReady"
  | "ConceptFocused"
  | "DefinitionOpened";

interface ConceptFocusState {
  sessionId: string;
  state: ExplorationState;
  selectedConceptId: string | null;
  detail: ConceptDetailCard | null;
  message: string | null;
  messageTone: "info" | "error" | null;
  openingDefinition: boolean;
}

interface UseConceptFocusInput extends ProjectionScopeInput {
  activeAspect: AspectKind;
  viewLevel: WhiteboardViewLevel;
  selectedFeatureId: string | null;
  selectedGroupKey: string | null;
  selectedCard: SelectedWhiteboardCard | null;
  projectionReady: boolean;
}

/**
 * domainspec:
 *   concept:
 *     id: ui.knowledge-graph-visualization.useConceptFocus
 *     type: Hook
 *     concern: sys
 */
export function useConceptFocus(input: UseConceptFocusInput) {
  const projectKey = input.projectKey ?? DEFAULT_PROJECT_KEY;
  const featureId = input.featureId ?? DEFAULT_FEATURE_ID;
  const [focus, setFocus] = useState<ConceptFocusState>({
    sessionId: safeSessionId(),
    state: "Idle",
    selectedConceptId: null,
    detail: null,
    message: null,
    messageTone: null,
    openingDefinition: false,
  });
  const requestVersionRef = useRef(0);

  const state = useMemo<ExplorationState>(() => {
    if (focus.state === "DefinitionOpened") {
      return "DefinitionOpened";
    }
    if (focus.state === "ConceptFocused") {
      return "ConceptFocused";
    }
    if (input.projectionReady) {
      return "ProjectionReady";
    }
    return "Idle";
  }, [focus.state, input.projectionReady]);

  useEffect(() => {
    if (!input.projectionReady) {
      requestVersionRef.current += 1;
      setFocus((previous) => ({
        ...previous,
        state: "Idle",
        selectedConceptId: null,
        detail: null,
        message: null,
        messageTone: null,
      }));
      return;
    }

    const selectedCard = input.selectedCard;
    if (
      !selectedCard ||
      !isConceptualCard(selectedCard.cardType) ||
      !selectedCard.conceptId
    ) {
      requestVersionRef.current += 1;
      setFocus((previous) => ({
        ...previous,
        state: "ProjectionReady",
        selectedConceptId: null,
        detail: null,
        message: null,
        messageTone: null,
      }));
      return;
    }

    const requestVersion = ++requestVersionRef.current;
    const detailKey = queryKeys.kg.detail(
      projectKey,
      featureId,
      selectedCard.conceptId,
      input.activeAspect,
      input.viewLevel,
      input.selectedFeatureId,
      input.selectedGroupKey,
    );
    void detailKey;

    setFocus((previous) => ({
      ...previous,
      state: "ConceptFocused",
      selectedConceptId: selectedCard.conceptId,
      detail:
        previous.detail && previous.detail.conceptId === selectedCard.conceptId
          ? previous.detail
          : fallbackDetail(selectedCard, featureId),
      message: null,
      messageTone: null,
    }));

    void getConceptDetailCard(
      selectedCard.conceptId,
      {
        projectKey,
        featureId,
      },
      {
        sessionId: focus.sessionId,
        source: selectedCard.source,
        includeInbound: true,
        includeOutbound: true,
        includeStories: true,
        activeAspect: input.activeAspect,
        viewLevel: input.viewLevel,
        selectedFeatureId: input.selectedFeatureId,
        selectedGroupKey: input.selectedGroupKey,
        selectedCardId: selectedCard.cardId,
        selectedCardType: selectedCard.cardType,
      },
    )
      .then((detail) => {
        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        setFocus((previous) => ({
          ...previous,
          detail,
          message: null,
          messageTone: null,
        }));
      })
      .catch((error) => {
        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        if (error instanceof ApiError) {
          setFocus((previous) => ({
            ...previous,
            message: `${error.message} (${error.code})`,
            messageTone: "error",
          }));
        }
      });
  }, [
    featureId,
    focus.sessionId,
    input.activeAspect,
    input.projectionReady,
    input.selectedCard,
    input.selectedFeatureId,
    input.selectedGroupKey,
    input.viewLevel,
    projectKey,
  ]);

  /**
   * domainspec:
   *   concept:
   *     id: ui.knowledge-graph-visualization.DefinitionNavigationBinding
   *     type: Binding
   *     concern: sys
   *   edges:
   *     - edge: mutates
   *       to: knowledge-graph-visualization.OpenDefinition
   */
  const openFocusedDefinition = useCallback(async () => {
    if (!focus.selectedConceptId) {
      setFocus((previous) => ({
        ...previous,
        message: "Select a concept before opening definition.",
        messageTone: "error",
      }));
      return;
    }

    setFocus((previous) => ({
      ...previous,
      openingDefinition: true,
      message: null,
      messageTone: null,
    }));

    try {
      const definitionKey = queryKeys.kg.definition(
        projectKey,
        featureId,
        focus.selectedConceptId,
      );
      void definitionKey;

      const result = await openDefinition(
        {
          sessionId: focus.sessionId,
          conceptId: focus.selectedConceptId,
          aspectHint: input.activeAspect,
        },
        {
          projectKey,
          featureId,
        },
      );
      const target = result.target ?? buildTarget(result);

      setFocus((previous) => ({
        ...previous,
        state: "DefinitionOpened",
        openingDefinition: false,
        message: `Definition opened: ${target}`,
        messageTone: "info",
      }));

      if (typeof window !== "undefined") {
        window.location.hash = normalizeHashTarget(target);
      }
      return;
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped = mapDefinitionError(error.code);
        setFocus((previous) => ({
          ...previous,
          state: "ConceptFocused",
          openingDefinition: false,
          message: mapped,
          messageTone: "error",
        }));
        return;
      }

      setFocus((previous) => ({
        ...previous,
        state: "ConceptFocused",
        openingDefinition: false,
        message: "Definition link is not available for this concept.",
        messageTone: "error",
      }));
    }
  }, [
    featureId,
    focus.selectedConceptId,
    focus.sessionId,
    input.activeAspect,
    projectKey,
  ]);

  return {
    state,
    selectedCard: input.selectedCard,
    selectedConceptId: focus.selectedConceptId,
    detail: focus.detail,
    message: focus.message,
    messageTone: focus.messageTone,
    openingDefinition: focus.openingDefinition,
    openFocusedDefinition,
  };
}

function fallbackDetail(
  selectedCard: SelectedWhiteboardCard,
  featureId: string,
): ConceptDetailCard {
  return {
    conceptId: selectedCard.conceptId ?? selectedCard.cardId,
    title: selectedCard.title,
    summary: selectedCard.summary,
    definition: {
      filePath: `docs/features/${featureId}/SPEC.md`,
      anchor: "concepts",
      lineHint: 0,
      label: selectedCard.title,
    },
    inboundRelations: [],
    outboundRelations: [],
    relatedStories: [],
  };
}

function mapDefinitionError(code: string): string {
  switch (code) {
    case "DEFINITION_SESSION_MISMATCH":
      return "Selection changed. Please select the concept again.";
    case "DEFINITION_POINTER_NOT_FOUND":
      return "Definition link is not available for this concept.";
    case "DEFINITION_ANCHOR_NOT_FOUND":
      return "Definition anchor is outdated. Refresh projection and try again.";
    default:
      return "Definition link is not available for this concept.";
  }
}

function buildTarget(pointer: DefinitionPointer): string {
  return `${pointer.filePath}#${pointer.anchor}`;
}

function normalizeHashTarget(target: string): string {
  const hashIndex = target.indexOf("#");
  if (hashIndex >= 0 && hashIndex < target.length - 1) {
    return `#${target.slice(hashIndex + 1)}`;
  }

  return target.startsWith("#") ? target : `#${target}`;
}

function safeSessionId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `kg-session-${Date.now()}`;
}

function isConceptualCard(cardType: WhiteboardCardType): boolean {
  return cardType === "concept" || cardType === "story";
}
