import type {
  ExplorationSessionStorePort,
  MirrorProjectionRepositoryPort,
} from "./ports.js";
import { projectRelationshipGraph } from "./get-latest-mirror-projection.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type {
  AspectKind,
  SelectionSource,
  WhiteboardCardType,
  WhiteboardViewLevel,
} from "../domain/models.js";

export interface SelectConceptCommand {
  projectKey: string;
  featureId: string;
  sessionId: string;
  selectedCardId: string;
  selectedCardType: WhiteboardCardType;
  activeAspect: AspectKind;
  viewLevel: WhiteboardViewLevel;
  selectedFeatureId?: string;
  selectedGroupKey?: string;
  includeStories?: boolean;
  source: SelectionSource;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ConceptSelected
 *     type: Event
 *   edges:
 *     - edge: transitions
 *       to: knowledge-graph-visualization.ExplorationState
 */
export interface SelectConceptResult {
  sessionId: string;
  selectedCardId: string;
  selectedCardType: WhiteboardCardType;
  selectedConceptId: string | null;
  source: SelectionSource;
  inboundCount: number;
  outboundCount: number;
  selectedAt: string;
}

export type SelectConceptUseCase = (
  command: SelectConceptCommand,
) => SelectConceptResult;

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.SelectConcept
 *     type: Operation
 *   edges:
 *     - edge: produces
 *       to: knowledge-graph-visualization.ConceptSelected
 */
export function makeSelectConceptUseCase(dependencies: {
  repository: MirrorProjectionRepositoryPort;
  sessionStore: ExplorationSessionStorePort;
}): SelectConceptUseCase {
  const { repository, sessionStore } = dependencies;

  return function selectConcept(
    command: SelectConceptCommand,
  ): SelectConceptResult {
    if (!isSelectionSource(command.source)) {
      throw createKnowledgeGraphError(
        "CONCEPT_SELECTION_SOURCE_INVALID",
        "Selection source must be rail, board, detail, card, or graph",
        {
          projectKey: command.projectKey,
          featureId: command.featureId,
          source: command.source,
        },
      );
    }

    const existingSession = sessionStore.getSessionById(command.sessionId);
    if (
      existingSession &&
      (existingSession.projectKey !== command.projectKey ||
        existingSession.featureId !== command.featureId)
    ) {
      throw createKnowledgeGraphError(
        "CONCEPT_SCOPE_MISMATCH",
        "Selection session scope does not match request scope",
        {
          sessionId: command.sessionId,
          expectedProjectKey: existingSession.projectKey,
          expectedFeatureId: existingSession.featureId,
          receivedProjectKey: command.projectKey,
          receivedFeatureId: command.featureId,
        },
      );
    }

    const projection = repository.getLatestProjection({
      projectKey: command.projectKey,
      featureId: command.featureId,
    });
    if (!projection) {
      throw createKnowledgeGraphError(
        "MIRROR_PROJECTION_NOT_FOUND",
        "No projection snapshot is available for the requested feature",
        {
          projectKey: command.projectKey,
          featureId: command.featureId,
        },
      );
    }

    const graph = projectRelationshipGraph(projection, {
      projectKey: command.projectKey,
      featureId: command.featureId,
      activeAspect: command.activeAspect,
      viewLevel: command.viewLevel,
      selectedFeatureId: command.selectedFeatureId,
      selectedGroupKey: command.selectedGroupKey,
      includeStories: command.includeStories,
    });
    const selectedCard = graph.nodes.find(
      (node) =>
        node.cardId === command.selectedCardId &&
        node.cardType === command.selectedCardType,
    );
    if (!selectedCard) {
      throw createKnowledgeGraphError(
        "WHITEBOARD_CARD_NOT_FOUND",
        "Selected whiteboard card does not exist in the current board",
        {
          projectKey: command.projectKey,
          featureId: command.featureId,
          selectedCardId: command.selectedCardId,
          selectedCardType: command.selectedCardType,
          viewLevel: command.viewLevel,
          activeAspect: command.activeAspect,
        },
      );
    }

    let selectedConceptId: string | null = null;
    let inboundCount = 0;
    let outboundCount = 0;

    if (
      command.selectedCardType === "concept" ||
      command.selectedCardType === "story"
    ) {
      selectedConceptId = selectedCard.conceptId;
      if (!selectedConceptId) {
        throw createKnowledgeGraphError(
          "WHITEBOARD_CARD_MAPPING_UNRESOLVED",
          "Selected card does not resolve to a concept",
          {
            projectKey: command.projectKey,
            featureId: command.featureId,
            selectedCardId: command.selectedCardId,
            selectedCardType: command.selectedCardType,
          },
        );
      }

      const concept = projection.concepts.find(
        (candidate) => candidate.conceptId === selectedConceptId,
      );
      if (!concept) {
        throw createKnowledgeGraphError(
          "CONCEPT_NOT_FOUND",
          "Selected card concept was not found in the latest projection",
          {
            projectKey: command.projectKey,
            featureId: command.featureId,
            conceptId: selectedConceptId,
          },
        );
      }

      if (
        !concept.definitionPointer.filePath ||
        !concept.definitionPointer.anchor
      ) {
        throw createKnowledgeGraphError(
          "CONCEPT_DEFINITION_UNRESOLVED",
          "Selected concept does not have a resolvable definition pointer",
          {
            projectKey: command.projectKey,
            featureId: command.featureId,
            conceptId: selectedConceptId,
          },
        );
      }

      sessionStore.setSelectedConcept({
        projectKey: command.projectKey,
        featureId: command.featureId,
        sessionId: command.sessionId,
        conceptId: selectedConceptId,
        source: command.source,
      });

      inboundCount = projection.edges.filter(
        (edge) => edge.toConceptId === selectedConceptId,
      ).length;
      outboundCount = projection.edges.filter(
        (edge) => edge.fromConceptId === selectedConceptId,
      ).length;
    }

    return {
      sessionId: command.sessionId,
      selectedCardId: command.selectedCardId,
      selectedCardType: command.selectedCardType,
      selectedConceptId,
      source: command.source,
      inboundCount,
      outboundCount,
      selectedAt: new Date().toISOString(),
    };
  };
}

function isSelectionSource(value: SelectionSource): boolean {
  return (
    value === "card" ||
    value === "graph" ||
    value === "rail" ||
    value === "board" ||
    value === "detail"
  );
}
