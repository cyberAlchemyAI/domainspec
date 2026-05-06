import type { MirrorProjectionRepositoryPort } from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type {
  MirrorProjection,
  RelationshipGraphNode,
} from "../domain/models.js";

export type GetLatestMirrorProjectionQuery = (
  featureId: string,
) => MirrorProjection;

export function makeGetLatestMirrorProjectionQuery(
  repository: MirrorProjectionRepositoryPort,
): GetLatestMirrorProjectionQuery {
  return function getLatestMirrorProjection(
    featureId: string,
  ): MirrorProjection {
    const projection = repository.getLatestProjection(featureId);
    if (!projection) {
      throw createKnowledgeGraphError(
        "MIRROR_PROJECTION_NOT_FOUND",
        "No projection snapshot is available for the requested feature",
        { featureId },
      );
    }
    return projection;
  };
}

export function toGraphNodes(
  projection: MirrorProjection,
): RelationshipGraphNode[] {
  return projection.concepts.map((concept) => ({
    conceptId: concept.conceptId,
    name: concept.name,
    taxonomyType: concept.taxonomyType,
    summary: concept.summary,
  }));
}
