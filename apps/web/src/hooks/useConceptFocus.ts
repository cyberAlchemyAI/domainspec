import { useCallback, useMemo, useState } from "react";

import {
  ApiError,
  DEFAULT_FEATURE_ID,
  getConceptDetailCard,
  getDefinitionPointer,
  openDefinition,
  type ConceptDetailCard,
  type DefinitionPointer,
  type GraphEdge,
  type GraphNode,
} from "../lib/api";

export type ExplorationState =
  | "Idle"
  | "ProjectionReady"
  | "ConceptFocused"
  | "DefinitionOpened";

interface ConceptFocusState {
  sessionId: string;
  state: ExplorationState;
  selectedConceptId: string | null;
  selectedSource: "card" | "graph" | null;
  detail: ConceptDetailCard | null;
  message: string | null;
  openingDefinition: boolean;
}

interface UseConceptFocusInput {
  featureId?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  projectionReady: boolean;
}

export function useConceptFocus(input: UseConceptFocusInput) {
  const featureId = input.featureId ?? DEFAULT_FEATURE_ID;
  const [focus, setFocus] = useState<ConceptFocusState>({
    sessionId: crypto.randomUUID(),
    state: "Idle",
    selectedConceptId: null,
    selectedSource: null,
    detail: null,
    message: null,
    openingDefinition: false,
  });

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

  const selectConcept = useCallback(
    async (conceptId: string, source: "card" | "graph") => {
      const sessionId = focus.sessionId;
      const baseDetail = deriveDetail(
        input.nodes,
        input.edges,
        conceptId,
        featureId,
      );

      setFocus((previous) => ({
        ...previous,
        state: "ConceptFocused",
        selectedConceptId: conceptId,
        selectedSource: source,
        detail: baseDetail,
        message: null,
      }));

      try {
        const remoteDetail = await getConceptDetailCard(conceptId, featureId, {
          sessionId,
          source,
        });
        setFocus((previous) => ({
          ...previous,
          detail: remoteDetail,
        }));
      } catch {
        // Fallback detail from graph projection keeps interaction usable.
      }
    },
    [featureId, focus.sessionId, input.edges, input.nodes],
  );

  const openFocusedDefinition = useCallback(async () => {
    if (!focus.selectedConceptId) {
      setFocus((previous) => ({
        ...previous,
        message: "Select a concept before opening definition",
      }));
      return;
    }

    setFocus((previous) => ({
      ...previous,
      openingDefinition: true,
      message: null,
    }));

    try {
      const result = await openDefinition(
        {
          sessionId: focus.sessionId,
          conceptId: focus.selectedConceptId,
        },
        featureId,
      );
      const target = buildTarget(result);

      setFocus((previous) => ({
        ...previous,
        state: "DefinitionOpened",
        openingDefinition: false,
        message: `Definition opened: ${target}`,
      }));

      window.location.hash = target;
      return;
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped = mapDefinitionError(error.code);
        setFocus((previous) => ({
          ...previous,
          openingDefinition: false,
          message: mapped,
        }));
        return;
      }

      setFocus((previous) => ({
        ...previous,
        openingDefinition: false,
        message: "Definition link is not available for this concept.",
      }));
    }

    try {
      const pointer = await getDefinitionPointer(
        focus.selectedConceptId,
        featureId,
      );
      const fallbackTarget = buildTarget(pointer);
      setFocus((previous) => ({
        ...previous,
        state: "DefinitionOpened",
        message: `Definition opened: ${fallbackTarget}`,
      }));
      window.location.hash = fallbackTarget;
    } catch {
      // Keep mapped message from primary mutation call.
    }
  }, [featureId, focus.selectedConceptId, focus.sessionId]);

  return {
    state,
    selectedConceptId: focus.selectedConceptId,
    selectedSource: focus.selectedSource,
    detail: focus.detail,
    message: focus.message,
    openingDefinition: focus.openingDefinition,
    selectConcept,
    openFocusedDefinition,
  };
}

function deriveDetail(
  nodes: GraphNode[],
  edges: GraphEdge[],
  conceptId: string,
  featureId: string,
): ConceptDetailCard {
  const node = nodes.find((candidate) => candidate.conceptId === conceptId);
  const inboundRelations = edges.filter(
    (edge) => edge.toConceptId === conceptId,
  );
  const outboundRelations = edges.filter(
    (edge) => edge.fromConceptId === conceptId,
  );

  return {
    conceptId,
    title: node?.name ?? conceptId,
    summary: node?.summary ?? "No summary available.",
    definition: {
      filePath: `docs/features/${featureId}/SPEC.md`,
      anchor: "concepts",
      lineHint: 0,
      label: node?.name ?? conceptId,
    },
    inboundRelations,
    outboundRelations,
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
