import type { MirrorProjectionRepositoryPort } from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type { DefinitionPointer } from "../domain/models.js";

export interface GetDefinitionPointerInput {
  featureId: string;
  conceptId: string;
  preferExactAnchor?: boolean;
}

export type GetDefinitionPointerQuery = (
  input: GetDefinitionPointerInput,
) => DefinitionPointer;

export function makeGetDefinitionPointerQuery(
  repository: MirrorProjectionRepositoryPort,
): GetDefinitionPointerQuery {
  return function getDefinitionPointer(
    input: GetDefinitionPointerInput,
  ): DefinitionPointer {
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

    const pointer = concept.definitionPointer;
    if (!pointer.filePath || !pointer.anchor) {
      throw createKnowledgeGraphError(
        "DEFINITION_POINTER_NOT_FOUND",
        "Concept definition pointer is unavailable",
        {
          featureId: input.featureId,
          conceptId: input.conceptId,
        },
      );
    }

    const preferExactAnchor = input.preferExactAnchor ?? true;
    if (
      preferExactAnchor &&
      concept.sourceAnchor &&
      pointer.anchor !== concept.sourceAnchor
    ) {
      throw createKnowledgeGraphError(
        "DEFINITION_ANCHOR_NOT_FOUND",
        "Concept definition anchor is not exact",
        {
          featureId: input.featureId,
          conceptId: input.conceptId,
          expectedAnchor: concept.sourceAnchor,
          receivedAnchor: pointer.anchor,
        },
      );
    }

    return pointer;
  };
}
