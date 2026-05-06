import type {
  CanonicalEdgeVocabularyPort,
  FeatureDocsParserPort,
  MirrorProjectionRepositoryPort,
  ProjectSourceRegistryPort,
} from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import {
  buildSnapshotId,
  compareConceptDefinitions,
  compareFeatureDocuments,
  compareRelationshipEdges,
  inferAspectKind,
  normalizeFilePath,
  REQUIRED_MIRROR_FILES,
} from "../domain/models.js";
import type {
  ConceptDefinition,
  FeatureDocument,
  MirrorCardView,
  MirrorProjection,
  ParsedSourceDocument,
  RelationshipEdge,
} from "../domain/models.js";

export interface RebuildMirrorProjectionCommand {
  projectKey: string;
  featureId: string;
  sourceFiles: string[];
  requestedBy: string;
  generatedAt?: string;
}

export interface RebuildMirrorProjectionResult {
  projection: MirrorProjection;
  cardCount: number;
  coverageRatio: number;
  edgeDensity: number;
}

export interface RebuildMirrorProjectionDependencies {
  projectSourceRegistry: ProjectSourceRegistryPort;
  docsParser: FeatureDocsParserPort;
  canonicalEdgeVocabulary: CanonicalEdgeVocabularyPort;
  repository: MirrorProjectionRepositoryPort;
}

export type RebuildMirrorProjectionUseCase = (
  command: RebuildMirrorProjectionCommand,
) => Promise<RebuildMirrorProjectionResult>;

export function makeRebuildMirrorProjectionUseCase(
  dependencies: RebuildMirrorProjectionDependencies,
): RebuildMirrorProjectionUseCase {
  const {
    projectSourceRegistry,
    docsParser,
    canonicalEdgeVocabulary,
    repository,
  } = dependencies;

  return async function rebuildMirrorProjection(
    command: RebuildMirrorProjectionCommand,
  ): Promise<RebuildMirrorProjectionResult> {
    const projectKey = command.projectKey.trim();
    const featureId = command.featureId.trim();
    const sourceFiles = command.sourceFiles.map(normalizeFilePath);

    if (
      projectKey.length === 0 ||
      featureId.length === 0 ||
      sourceFiles.length === 0
    ) {
      throw createKnowledgeGraphError(
        "MIRROR_REBUILD_INPUT_INVALID",
        "projectKey, featureId, and sourceFiles are required",
      );
    }

    const scope = projectSourceRegistry.resolveProjectionScope({
      projectKey,
      featureId,
    });

    const generatedAt = command.generatedAt ?? new Date().toISOString();
    const parsedDocuments = await docsParser.scanFeatureFiles({
      scope,
      sourceFiles,
      indexedAt: generatedAt,
    });

    assertRequiredMirrorFiles(parsedDocuments);

    const specDocument = findSpecDocument(parsedDocuments);
    const { concepts, edges } = docsParser.parseSpec({
      scope,
      specContent: specDocument.content,
    });

    const canonicalEdges = await canonicalEdgeVocabulary.loadCanonicalEdges({
      scope,
    });
    validateCanonicalEdges(edges, canonicalEdges);
    validateEdgeEndpoints(
      edges,
      new Set(concepts.map((concept) => concept.conceptId)),
    );

    const featureDocuments = materializeFeatureDocuments(
      scope.projectKey,
      featureId,
      parsedDocuments,
    );
    const cards = materializeMirrorCards(
      scope.projectKey,
      featureDocuments,
      concepts,
      edges,
    );
    const sortedEdges = [...edges].sort(compareRelationshipEdges);
    const sortedConcepts = [...concepts].sort(compareConceptDefinitions);

    const projection: MirrorProjection = {
      snapshotId: buildSnapshotId(
        scope.projectKey,
        featureId,
        generatedAt,
        sortedConcepts,
        sortedEdges,
      ),
      projectKey: scope.projectKey,
      featureId,
      generatedAt,
      nodeCount: sortedConcepts.length,
      edgeCount: sortedEdges.length,
      concepts: sortedConcepts,
      cards,
      edges: sortedEdges,
      whiteboard: materializeWhiteboardProjection({
        projectKey: scope.projectKey,
        featureId,
        concepts: sortedConcepts,
        cards,
        edges: sortedEdges,
      }),
    };

    repository.saveProjection(projection);

    return {
      projection,
      cardCount: cards.length,
      coverageRatio: coverageRatio(cards),
      edgeDensity: edgeDensity(projection.nodeCount, projection.edgeCount),
    };
  };
}

function assertRequiredMirrorFiles(
  parsedDocuments: ParsedSourceDocument[],
): void {
  const existingFiles = new Set(
    parsedDocuments
      .filter((document) => document.exists)
      .map((document) => document.filePath),
  );

  const missingRequiredFiles = REQUIRED_MIRROR_FILES.filter(
    (requiredFile) => !existingFiles.has(requiredFile),
  );

  if (missingRequiredFiles.length > 0) {
    throw createKnowledgeGraphError(
      "MIRROR_REQUIRED_FILE_MISSING",
      "Missing required mirror files",
      { missingRequiredFiles },
    );
  }
}

function findSpecDocument(parsedDocuments: ParsedSourceDocument[]): {
  content: string;
} {
  const specDocument = parsedDocuments.find(
    (document) =>
      document.filePath === "SPEC.md" && document.exists && document.content,
  );

  if (!specDocument || !specDocument.content) {
    throw createKnowledgeGraphError(
      "MIRROR_REQUIRED_FILE_MISSING",
      "SPEC.md is required for projection rebuild",
      { missingRequiredFiles: ["SPEC.md"] },
    );
  }

  return { content: specDocument.content };
}

function validateCanonicalEdges(
  edges: RelationshipEdge[],
  canonicalEdgeVocabulary: Set<string>,
): void {
  const invalidEdges = edges.filter(
    (edge) => !canonicalEdgeVocabulary.has(edge.edge),
  );

  if (invalidEdges.length > 0) {
    throw createKnowledgeGraphError(
      "MIRROR_EDGE_LABEL_INVALID",
      "Feature Concept Graph contains non-canonical edge labels",
      {
        invalidEdges: invalidEdges.map((edge) => ({
          fromConceptId: edge.fromConceptId,
          edge: edge.edge,
          toConceptId: edge.toConceptId,
        })),
      },
    );
  }
}

function validateEdgeEndpoints(
  edges: RelationshipEdge[],
  conceptIds: Set<string>,
): void {
  const unknownEndpoints = edges
    .filter(
      (edge) =>
        !conceptIds.has(edge.fromConceptId) ||
        !conceptIds.has(edge.toConceptId),
    )
    .map((edge) => ({
      fromConceptId: edge.fromConceptId,
      toConceptId: edge.toConceptId,
      edge: edge.edge,
    }));

  if (unknownEndpoints.length > 0) {
    throw createKnowledgeGraphError(
      "MIRROR_EDGE_ENDPOINT_UNKNOWN",
      "Feature Concept Graph contains edge endpoints that do not resolve to concept IDs",
      { unknownEndpoints },
    );
  }
}

function materializeFeatureDocuments(
  projectKey: string,
  featureId: string,
  parsedDocuments: ParsedSourceDocument[],
): FeatureDocument[] {
  return parsedDocuments
    .filter((document) => document.exists)
    .map((document) => ({
      id: `${featureId}:${document.filePath}`,
      projectKey,
      featureId,
      path: document.filePath,
      aspectKind: document.aspectKind,
      checksum: document.checksum,
      updatedAt: document.updatedAt,
    }))
    .sort(compareFeatureDocuments);
}

function materializeMirrorCards(
  projectKey: string,
  featureDocuments: FeatureDocument[],
  concepts: ConceptDefinition[],
  edges: RelationshipEdge[],
): MirrorCardView[] {
  const conceptsBySourceFile = new Map<string, number>();
  const relationsBySourceFile = new Map<string, number>();

  for (const concept of concepts) {
    const conceptFile =
      normalizeFilePath(concept.sourceFilePath).split("/").at(-1) ?? "";
    conceptsBySourceFile.set(
      conceptFile,
      (conceptsBySourceFile.get(conceptFile) ?? 0) + 1,
    );
  }

  for (const edge of edges) {
    const evidenceSource = parseEvidenceSourceFile(edge.evidence);
    if (!evidenceSource) {
      continue;
    }
    relationsBySourceFile.set(
      evidenceSource,
      (relationsBySourceFile.get(evidenceSource) ?? 0) + 1,
    );
  }

  return featureDocuments.map((document) => {
    const fileName =
      normalizeFilePath(document.path).split("/").at(-1) ?? document.path;
    return {
      projectKey,
      filePath: document.path,
      title: document.aspectKind,
      aspectKind: document.aspectKind,
      conceptCount: conceptsBySourceFile.get(fileName) ?? 0,
      relationCount: relationsBySourceFile.get(fileName) ?? 0,
      freshness: "up-to-date",
    };
  });
}

function materializeWhiteboardProjection(input: {
  projectKey: string;
  featureId: string;
  concepts: ConceptDefinition[];
  cards: MirrorCardView[];
  edges: RelationshipEdge[];
}): MirrorProjection["whiteboard"] {
  const conceptById = new Map(
    input.concepts.map((concept) => [concept.conceptId, concept]),
  );

  const aspectCards = input.cards.map((card) => ({
    cardId: `aspect:${card.filePath}`,
    cardType: "aspect" as const,
    title: card.title,
    projectKey: input.projectKey,
    featureId: input.featureId,
    conceptId: null,
    groupKey: card.aspectKind,
    aspectKind: card.aspectKind,
  }));

  const featureConceptIds = new Set<string>();
  for (const concept of input.concepts) {
    if (
      concept.taxonomyType.toLowerCase() === "feature" ||
      concept.conceptId.startsWith("feature.")
    ) {
      featureConceptIds.add(concept.conceptId);
    }
  }
  featureConceptIds.add(`feature.${input.featureId}`);

  const featureCards = Array.from(featureConceptIds)
    .sort((left, right) => left.localeCompare(right))
    .map((conceptId) => {
      const concept = conceptById.get(conceptId);
      const title = concept?.name ?? conceptId.split(".").at(-1) ?? conceptId;
      return {
        cardId: `feature:${conceptId}`,
        cardType: "feature" as const,
        title,
        projectKey: input.projectKey,
        featureId: input.featureId,
        conceptId,
        groupKey: "feature",
        aspectKind: concept ? inferAspectKind(concept.sourceFilePath) : "SPEC",
      };
    });

  const featureEdges = input.edges.filter(
    (edge) =>
      featureConceptIds.has(edge.fromConceptId) &&
      featureConceptIds.has(edge.toConceptId),
  );

  const conceptCards = input.concepts
    .map((concept) => {
      const fileName =
        normalizeFilePath(concept.sourceFilePath).split("/").at(-1) ??
        concept.sourceFilePath;
      return {
        cardId: `concept:${concept.conceptId}`,
        cardType: "concept" as const,
        title: concept.name,
        projectKey: input.projectKey,
        featureId: input.featureId,
        conceptId: concept.conceptId,
        groupKey: fileName,
        aspectKind: inferAspectKind(concept.sourceFilePath),
      };
    })
    .sort((left, right) => left.conceptId!.localeCompare(right.conceptId!));

  return {
    aspect: {
      level: "aspect",
      cards: aspectCards,
      edges: [],
    },
    feature: {
      level: "feature",
      cards: featureCards,
      edges: featureEdges,
    },
    concept: {
      level: "concept",
      cards: conceptCards,
      edges: input.edges,
    },
  };
}

function parseEvidenceSourceFile(evidence: string): string | null {
  const value = evidence.trim();
  if (value.length === 0) {
    return null;
  }

  const markdownLink = value.match(/\[[^\]]+\]\(([^)]+)\)/);
  const rawTarget = markdownLink?.[1] ?? value;
  const [rawPath] = rawTarget.split("#", 2);

  if (!rawPath) {
    return null;
  }

  return normalizeFilePath(rawPath).split("/").at(-1) ?? null;
}

function coverageRatio(cards: MirrorCardView[]): number {
  const available = new Set(cards.map((card) => card.filePath));
  let covered = 0;

  for (const requiredFile of REQUIRED_MIRROR_FILES) {
    if (available.has(requiredFile)) {
      covered += 1;
    }
  }

  return covered / REQUIRED_MIRROR_FILES.length;
}

function edgeDensity(nodeCount: number, edgeCount: number): number {
  return edgeCount / Math.max(nodeCount, 1);
}
