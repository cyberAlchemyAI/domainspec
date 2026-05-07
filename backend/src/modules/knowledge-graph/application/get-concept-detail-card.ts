import type { MirrorProjectionRepositoryPort } from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import {
  inferAspectKind,
  type AspectKind,
  type ConceptDetailCard,
  type MirrorProjection,
} from "../domain/models.js";

export interface GetConceptDetailCardInput {
  projectKey: string;
  featureId: string;
  conceptId: string;
  aspectHint?: AspectKind;
  includeInbound?: boolean;
  includeOutbound?: boolean;
  includeStories?: boolean;
}

export type GetConceptDetailCardQuery = (
  input: GetConceptDetailCardInput,
) => ConceptDetailCard;

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.GetConceptDetailCard
 *     type: Query
 *   edges:
 *     - edge: queries
 *       to: knowledge-graph-visualization.ConceptDefinition
 *     - edge: queries
 *       to: knowledge-graph-visualization.DocumentationWorkspace
 */
export function makeGetConceptDetailCardQuery(
  repository: MirrorProjectionRepositoryPort,
): GetConceptDetailCardQuery {
  return function getConceptDetailCard(
    input: GetConceptDetailCardInput,
  ): ConceptDetailCard {
    const projection = repository.getLatestProjection({
      projectKey: input.projectKey,
      featureId: input.featureId,
    });
    if (!projection) {
      throw createKnowledgeGraphError(
        "MIRROR_PROJECTION_NOT_FOUND",
        "No projection snapshot is available for the requested feature",
        {
          projectKey: input.projectKey,
          featureId: input.featureId,
        },
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
          projectKey: input.projectKey,
          featureId: input.featureId,
          conceptId: input.conceptId,
        },
      );
    }

    const includeInbound = input.includeInbound ?? true;
    const includeOutbound = input.includeOutbound ?? true;
    const includeStories = input.includeStories ?? true;
    const aspectKind =
      input.aspectHint ?? inferAspectKind(concept.sourceFilePath);

    return {
      conceptId: concept.conceptId,
      title: concept.name,
      summary: concept.summary,
      aspectKind,
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
      relatedStories: includeStories
        ? collectRelatedStories(projection, concept.conceptId)
        : [],
    };
  };
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ConceptToDetailCardAdapter
 *     type: Adapter
 *   edges:
 *     - edge: shapes
 *       to: knowledge-graph-visualization.ConceptDetailCard
 */
function collectRelatedStories(
  projection: MirrorProjection,
  conceptId: string,
): string[] {
  const conceptsById = new Map(
    projection.concepts.map((concept) => [concept.conceptId, concept]),
  );
  const relatedStories = new Set<string>();

  for (const edge of projection.edges) {
    if (edge.fromConceptId !== conceptId && edge.toConceptId !== conceptId) {
      continue;
    }

    const relatedConceptId =
      edge.fromConceptId === conceptId ? edge.toConceptId : edge.fromConceptId;
    const relatedConcept = conceptsById.get(relatedConceptId);
    if (
      !relatedConcept ||
      !isStoryConcept(relatedConcept.conceptId, relatedConcept.taxonomyType)
    ) {
      continue;
    }

    relatedStories.add(relatedConceptId);
  }

  return Array.from(relatedStories).sort((left, right) =>
    left.localeCompare(right),
  );
}

function isStoryConcept(conceptId: string, taxonomyType: string): boolean {
  const normalizedType = taxonomyType.trim().toLowerCase();
  return normalizedType.includes("story") || conceptId.startsWith("story.");
}
