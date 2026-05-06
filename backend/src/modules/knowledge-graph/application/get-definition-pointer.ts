import type { MirrorProjectionRepositoryPort } from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import {
  inferAspectKind,
  type AspectKind,
  type DefinitionPointer,
} from "../domain/models.js";

export interface GetDefinitionPointerInput {
  projectKey: string;
  featureId: string;
  conceptId: string;
  aspectHint?: AspectKind;
  preferExactAnchor?: boolean;
}

export type GetDefinitionPointerQuery = (
  input: GetDefinitionPointerInput,
) => DefinitionPointer;

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.GetDefinitionPointer
 *     type: Query
 *   edges:
 *     - edge: queries
 *       to: knowledge-graph-visualization.ConceptDefinition
 *     - edge: queries
 *       to: knowledge-graph-visualization.DocumentationWorkspace
 */
export function makeGetDefinitionPointerQuery(
  repository: MirrorProjectionRepositoryPort,
): GetDefinitionPointerQuery {
  return function getDefinitionPointer(
    input: GetDefinitionPointerInput,
  ): DefinitionPointer {
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

    const pointer = concept.definitionPointer;
    if (!pointer.filePath || !pointer.anchor) {
      throw createKnowledgeGraphError(
        "DEFINITION_POINTER_NOT_FOUND",
        "Concept definition pointer is unavailable",
        {
          projectKey: input.projectKey,
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
          projectKey: input.projectKey,
          featureId: input.featureId,
          conceptId: input.conceptId,
          expectedAnchor: concept.sourceAnchor,
          receivedAnchor: pointer.anchor,
        },
      );
    }

    const aspectKind = input.aspectHint ?? inferAspectKind(pointer.filePath);

    return {
      ...pointer,
      aspectKind,
    };
  };
}
