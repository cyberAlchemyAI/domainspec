import type {
  ExplorationSessionStorePort,
  MirrorProjectionRepositoryPort,
} from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type { SelectionSource } from "../domain/models.js";

export interface SelectConceptCommand {
  featureId: string;
  sessionId: string;
  conceptId: string;
  source: SelectionSource;
}

export interface SelectConceptResult {
  sessionId: string;
  conceptId: string;
  source: SelectionSource;
  inboundCount: number;
  outboundCount: number;
  selectedAt: string;
}

export type SelectConceptUseCase = (
  command: SelectConceptCommand,
) => SelectConceptResult;

export function makeSelectConceptUseCase(dependencies: {
  repository: MirrorProjectionRepositoryPort;
  sessionStore: ExplorationSessionStorePort;
}): SelectConceptUseCase {
  const { repository, sessionStore } = dependencies;

  return function selectConcept(
    command: SelectConceptCommand,
  ): SelectConceptResult {
    if (command.source !== "card" && command.source !== "graph") {
      throw createKnowledgeGraphError(
        "CONCEPT_SELECTION_SOURCE_INVALID",
        "Selection source must be card or graph",
        {
          source: command.source,
        },
      );
    }

    const projection = repository.getLatestProjection(command.featureId);
    if (!projection) {
      throw createKnowledgeGraphError(
        "MIRROR_PROJECTION_NOT_FOUND",
        "No projection snapshot is available for the requested feature",
        { featureId: command.featureId },
      );
    }

    const concept = projection.concepts.find(
      (candidate) => candidate.conceptId === command.conceptId,
    );
    if (!concept) {
      throw createKnowledgeGraphError(
        "CONCEPT_NOT_FOUND",
        "Concept was not found in the latest projection",
        {
          featureId: command.featureId,
          conceptId: command.conceptId,
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
          featureId: command.featureId,
          conceptId: command.conceptId,
        },
      );
    }

    sessionStore.setSelectedConcept({
      featureId: command.featureId,
      sessionId: command.sessionId,
      conceptId: command.conceptId,
      source: command.source,
    });

    return {
      sessionId: command.sessionId,
      conceptId: command.conceptId,
      source: command.source,
      inboundCount: projection.edges.filter(
        (edge) => edge.toConceptId === command.conceptId,
      ).length,
      outboundCount: projection.edges.filter(
        (edge) => edge.fromConceptId === command.conceptId,
      ).length,
      selectedAt: new Date().toISOString(),
    };
  };
}
