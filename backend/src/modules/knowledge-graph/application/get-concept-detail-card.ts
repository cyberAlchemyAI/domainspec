import type { MirrorProjectionRepositoryPort } from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type { ConceptDetailCard } from "../domain/models.js";

export interface GetConceptDetailCardInput {
  featureId: string;
  conceptId: string;
  includeInbound?: boolean;
  includeOutbound?: boolean;
}

export type GetConceptDetailCardQuery = (
  input: GetConceptDetailCardInput,
) => ConceptDetailCard;

export function makeGetConceptDetailCardQuery(
  repository: MirrorProjectionRepositoryPort,
): GetConceptDetailCardQuery {
  return function getConceptDetailCard(
    input: GetConceptDetailCardInput,
  ): ConceptDetailCard {
    const projection = repository.getLatestProjection(input.featureId);
    if (!projection) {
      throw createKnowledgeGraphError(
        "MIRROR_PROJECTION_NOT_FOUND",
        "No projection snapshot is available for the requested feature",
        { featureId: input.featureId },
      );
    }

    const concept = projection.concepts.find(
      (candidate) => candidate.conceptId === input.conceptId,
    );

    if (!concept) {
      throw createKnowledgeGraphError(
        "CONCEPT_NOT_FOUND",
        "Concept was not found in the latest projection",
        {
          featureId: input.featureId,
          conceptId: input.conceptId,
        },
      );
    }

    const includeInbound = input.includeInbound ?? true;
    const includeOutbound = input.includeOutbound ?? true;

    return {
      conceptId: concept.conceptId,
      title: concept.name,
      summary: concept.summary,
      definition: concept.definitionPointer,
      inboundRelations: includeInbound
        ? projection.edges.filter(
            (edge) => edge.toConceptId === concept.conceptId,
          )
        : [],
      outboundRelations: includeOutbound
        ? projection.edges.filter(
            (edge) => edge.fromConceptId === concept.conceptId,
          )
        : [],
    };
  };
}
