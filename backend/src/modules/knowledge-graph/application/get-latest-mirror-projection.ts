import type { MirrorProjectionRepositoryPort } from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import {
  inferAspectKind,
  type AspectKind,
  type ConceptDefinition,
  type MirrorProjection,
  type RelationshipEdge,
  type WhiteboardCardType,
  type WhiteboardViewLevel,
} from "../domain/models.js";

export interface GetLatestMirrorProjectionInput {
  projectKey: string;
  featureId: string;
}

export type GetLatestMirrorProjectionQuery = (
  input: GetLatestMirrorProjectionInput,
) => MirrorProjection;

export interface GetRelationshipGraphInput {
  projectKey: string;
  featureId: string;
  activeAspect: AspectKind;
  viewLevel: WhiteboardViewLevel;
  selectedFeatureId?: string;
  selectedGroupKey?: string;
  includeStories?: boolean;
  cardTypes?: WhiteboardCardType[];
  edgeKinds?: string[];
}

export interface RelationshipGraphNode {
  cardId: string;
  cardType: WhiteboardCardType;
  title: string;
  summary: string;
  groupKey: string | null;
  conceptId: string | null;
  aspectKind: AspectKind | null;
}

export interface RelationshipGraphEdge {
  fromCardId: string;
  edge: string;
  toCardId: string;
  evidence: string;
}

export interface RelationshipGraphProjection {
  board: {
    viewLevel: WhiteboardViewLevel;
    activeAspect: AspectKind;
    selectedFeatureId: string | null;
    selectedGroupKey: string | null;
  };
  nodes: RelationshipGraphNode[];
  edges: RelationshipGraphEdge[];
}

export interface GetRelationshipGraphResult extends RelationshipGraphProjection {
  snapshotId: string;
  projectKey: string;
  featureId: string;
  generatedAt: string;
}

export type GetRelationshipGraphQuery = (
  input: GetRelationshipGraphInput,
) => GetRelationshipGraphResult;

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.GetMirrorCards
 *     type: Query
 *   edges:
 *     - edge: queries
 *       to: knowledge-graph-visualization.MirrorProjection
 *     - edge: queries
 *       to: knowledge-graph-visualization.DocumentationWorkspace
 */
export function makeGetLatestMirrorProjectionQuery(
  repository: MirrorProjectionRepositoryPort,
): GetLatestMirrorProjectionQuery {
  return function getLatestMirrorProjection(
    input: GetLatestMirrorProjectionInput,
  ): MirrorProjection {
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
    return projection;
  };
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.GetRelationshipGraph
 *     type: Query
 *   edges:
 *     - edge: queries
 *       to: knowledge-graph-visualization.MirrorProjection
 *     - edge: queries
 *       to: knowledge-graph-visualization.DocumentationWorkspace
 */
export function makeGetRelationshipGraphQuery(
  repository: MirrorProjectionRepositoryPort,
): GetRelationshipGraphQuery {
  return function getRelationshipGraph(
    input: GetRelationshipGraphInput,
  ): GetRelationshipGraphResult {
    const projection = requireProjection(repository, {
      projectKey: input.projectKey,
      featureId: input.featureId,
    });
    const graph = projectRelationshipGraph(projection, input);

    return {
      snapshotId: projection.snapshotId,
      projectKey: projection.projectKey,
      featureId: projection.featureId,
      generatedAt: projection.generatedAt,
      ...graph,
    };
  };
}

export function projectRelationshipGraph(
  projection: MirrorProjection,
  input: GetRelationshipGraphInput,
): RelationshipGraphProjection {
  const conceptMap = new Map(
    projection.concepts.map((concept) => [concept.conceptId, concept]),
  );

  const featureNodes = buildFeatureNodes(projection, conceptMap);
  const conceptNodes = projection.concepts
    .filter((concept) => !isStoryConcept(concept))
    .map((concept) => toConceptNode(concept));
  const storyNodes = projection.concepts
    .filter((concept) => isStoryConcept(concept))
    .map((concept) => toStoryNode(concept));
  const groupNodes = buildConceptGroupNodes(conceptNodes);

  const selectedFeatureId = normalizeFeatureConceptId(input.selectedFeatureId);
  if (selectedFeatureId) {
    const selectedFeatureCardId = `feature:${selectedFeatureId}`;
    if (!featureNodes.some((node) => node.cardId === selectedFeatureCardId)) {
      throw createKnowledgeGraphError(
        "WHITEBOARD_CARD_NOT_FOUND",
        "Selected feature card is not available in the current board",
        {
          projectKey: input.projectKey,
          featureId: input.featureId,
          selectedCardId: selectedFeatureCardId,
          selectedCardType: "feature",
        },
      );
    }
  }

  const includeStories = input.includeStories ?? true;

  let scopedConceptNodes = conceptNodes;
  let scopedStoryNodes = includeStories ? storyNodes : [];
  let scopedGroupNodes = groupNodes;

  if (input.viewLevel !== "aspect") {
    scopedConceptNodes = scopedConceptNodes.filter(
      (node) => node.aspectKind === input.activeAspect,
    );
    scopedStoryNodes = scopedStoryNodes.filter(
      (node) => node.aspectKind === input.activeAspect,
    );
    scopedGroupNodes = scopedGroupNodes.filter(
      (node) => node.aspectKind === input.activeAspect,
    );
  }

  const selectedGroupKey = normalizeOptional(input.selectedGroupKey);
  if (selectedGroupKey) {
    const selectedGroupCardId = `concept-group:${selectedGroupKey}`;
    if (!scopedGroupNodes.some((node) => node.cardId === selectedGroupCardId)) {
      throw createKnowledgeGraphError(
        "WHITEBOARD_CARD_NOT_FOUND",
        "Selected concept group card is not available in the current board",
        {
          projectKey: input.projectKey,
          featureId: input.featureId,
          selectedCardId: selectedGroupCardId,
          selectedCardType: "concept-group",
        },
      );
    }
  }

  if (selectedGroupKey && input.viewLevel === "concept") {
    scopedConceptNodes = scopedConceptNodes.filter(
      (node) => node.groupKey === selectedGroupKey,
    );
  }

  let nodes: RelationshipGraphNode[];
  switch (input.viewLevel) {
    case "aspect":
      nodes = featureNodes;
      break;
    case "feature":
      nodes = [...scopedGroupNodes, ...scopedConceptNodes, ...scopedStoryNodes];
      break;
    case "concept":
      nodes = scopedConceptNodes;
      break;
    default:
      nodes = scopedConceptNodes;
      break;
  }

  const allowedCardTypes =
    input.cardTypes && input.cardTypes.length > 0
      ? new Set(input.cardTypes)
      : null;
  if (allowedCardTypes) {
    nodes = nodes.filter((node) => allowedCardTypes.has(node.cardType));
  }

  nodes = [...nodes].sort((left, right) =>
    left.cardId.localeCompare(right.cardId),
  );

  const sourceEdges =
    input.viewLevel === "aspect"
      ? projection.whiteboard.feature.edges
      : projection.edges;
  const edges = mapEdgesToCards(sourceEdges, nodes, input.edgeKinds);

  return {
    board: {
      viewLevel: input.viewLevel,
      activeAspect: input.activeAspect,
      selectedFeatureId,
      selectedGroupKey,
    },
    nodes,
    edges,
  };
}

function requireProjection(
  repository: MirrorProjectionRepositoryPort,
  input: GetLatestMirrorProjectionInput,
): MirrorProjection {
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

  return projection;
}

function buildFeatureNodes(
  projection: MirrorProjection,
  conceptsById: Map<string, ConceptDefinition>,
): RelationshipGraphNode[] {
  const sourceCards = projection.whiteboard.feature.cards.filter(
    (card) => card.cardType === "feature",
  );

  if (sourceCards.length === 0) {
    const conceptId = `feature.${projection.featureId}`;
    const concept = conceptsById.get(conceptId);
    return [
      {
        cardId: `feature:${conceptId}`,
        cardType: "feature",
        title: concept?.name ?? projection.featureId,
        summary: concept?.summary ?? `Feature ${projection.featureId}`,
        groupKey: "feature",
        conceptId,
        aspectKind: "SPEC",
      },
    ];
  }

  return sourceCards
    .map((card) => {
      const concept = card.conceptId
        ? conceptsById.get(card.conceptId)
        : undefined;
      return {
        cardId: card.cardId,
        cardType: "feature" as const,
        title: card.title,
        summary: concept?.summary ?? `Feature ${card.title}`,
        groupKey: card.groupKey,
        conceptId: card.conceptId,
        aspectKind: card.aspectKind,
      };
    })
    .sort((left, right) => left.cardId.localeCompare(right.cardId));
}

function toConceptNode(concept: ConceptDefinition): RelationshipGraphNode {
  const groupKey = sourceFileGroupKey(concept.sourceFilePath);
  return {
    cardId: `concept:${concept.conceptId}`,
    cardType: "concept",
    title: concept.name,
    summary: concept.summary,
    groupKey,
    conceptId: concept.conceptId,
    aspectKind: inferAspectKind(concept.sourceFilePath),
  };
}

function toStoryNode(concept: ConceptDefinition): RelationshipGraphNode {
  const groupKey = sourceFileGroupKey(concept.sourceFilePath);
  return {
    cardId: `story:${concept.conceptId}`,
    cardType: "story",
    title: concept.name,
    summary: concept.summary,
    groupKey,
    conceptId: concept.conceptId,
    aspectKind: inferAspectKind(concept.sourceFilePath),
  };
}

function buildConceptGroupNodes(
  conceptNodes: RelationshipGraphNode[],
): RelationshipGraphNode[] {
  const groups = new Map<
    string,
    {
      aspectKind: AspectKind | null;
      count: number;
    }
  >();

  for (const conceptNode of conceptNodes) {
    const groupKey = conceptNode.groupKey;
    if (!groupKey) {
      continue;
    }

    const existing = groups.get(groupKey);
    groups.set(groupKey, {
      aspectKind: conceptNode.aspectKind,
      count: (existing?.count ?? 0) + 1,
    });
  }

  return Array.from(groups.entries())
    .map(([groupKey, value]) => ({
      cardId: `concept-group:${groupKey}`,
      cardType: "concept-group" as const,
      title: groupKey,
      summary: `${value.count} concepts in ${groupKey}`,
      groupKey,
      conceptId: null,
      aspectKind: value.aspectKind,
    }))
    .sort((left, right) => left.cardId.localeCompare(right.cardId));
}

function mapEdgesToCards(
  sourceEdges: RelationshipEdge[],
  nodes: RelationshipGraphNode[],
  edgeKinds: string[] | undefined,
): RelationshipGraphEdge[] {
  const allowedEdgeKinds =
    edgeKinds && edgeKinds.length > 0
      ? new Set(edgeKinds.map((edgeKind) => edgeKind.trim()))
      : null;

  const cardByConceptId = new Map<string, string>();
  for (const node of nodes) {
    if (!node.conceptId || cardByConceptId.has(node.conceptId)) {
      continue;
    }
    cardByConceptId.set(node.conceptId, node.cardId);
  }

  const edges: RelationshipGraphEdge[] = [];
  for (const edge of sourceEdges) {
    if (allowedEdgeKinds && !allowedEdgeKinds.has(edge.edge)) {
      continue;
    }

    const fromCardId = cardByConceptId.get(edge.fromConceptId);
    const toCardId = cardByConceptId.get(edge.toConceptId);
    if (!fromCardId || !toCardId) {
      continue;
    }

    edges.push({
      fromCardId,
      edge: edge.edge,
      toCardId,
      evidence: edge.evidence,
    });
  }

  return edges.sort((left, right) => {
    const fromCompare = left.fromCardId.localeCompare(right.fromCardId);
    if (fromCompare !== 0) {
      return fromCompare;
    }

    const edgeCompare = left.edge.localeCompare(right.edge);
    if (edgeCompare !== 0) {
      return edgeCompare;
    }

    const toCompare = left.toCardId.localeCompare(right.toCardId);
    if (toCompare !== 0) {
      return toCompare;
    }

    return left.evidence.localeCompare(right.evidence);
  });
}

function normalizeFeatureConceptId(
  selectedFeatureId: string | undefined,
): string | null {
  const rawValue = normalizeOptional(selectedFeatureId);
  if (!rawValue) {
    return null;
  }

  if (rawValue.startsWith("feature:")) {
    return rawValue.slice("feature:".length);
  }

  if (rawValue.startsWith("feature.")) {
    return rawValue;
  }

  return `feature.${rawValue}`;
}

function sourceFileGroupKey(sourceFilePath: string): string {
  return sourceFilePath.split("/").at(-1) ?? sourceFilePath;
}

function normalizeOptional(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function isStoryConcept(concept: ConceptDefinition): boolean {
  const normalizedType = concept.taxonomyType.trim().toLowerCase();
  return (
    normalizedType.includes("story") || concept.conceptId.startsWith("story.")
  );
}
