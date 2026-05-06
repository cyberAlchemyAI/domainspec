import type {
  CanonicalEdgeVocabularyPort,
  FeatureDocsParserPort,
  MirrorProjectionRepositoryPort,
} from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import {
  buildSnapshotId,
  compareFeatureDocuments,
  compareRelationshipEdges,
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
  const { docsParser, canonicalEdgeVocabulary, repository } = dependencies;

  return async function rebuildMirrorProjection(
    command: RebuildMirrorProjectionCommand,
  ): Promise<RebuildMirrorProjectionResult> {
    const featureId = command.featureId.trim();
    const sourceFiles = command.sourceFiles.map(normalizeFilePath);

    if (featureId.length === 0 || sourceFiles.length === 0) {
      throw createKnowledgeGraphError(
        "MIRROR_REBUILD_INPUT_INVALID",
        "featureId and sourceFiles are required",
      );
    }

    const generatedAt = command.generatedAt ?? new Date().toISOString();
    const parsedDocuments = await docsParser.scanFeatureFiles({
      featureId,
      sourceFiles,
      indexedAt: generatedAt,
    });

    assertRequiredMirrorFiles(parsedDocuments);

    const specDocument = findSpecDocument(parsedDocuments);
    const { concepts, edges } = docsParser.parseSpec({
      featureId,
      specContent: specDocument.content,
    });

    const canonicalEdges = await canonicalEdgeVocabulary.loadCanonicalEdges();
    validateCanonicalEdges(edges, canonicalEdges);
    validateEdgeEndpoints(
      edges,
      new Set(concepts.map((concept) => concept.conceptId)),
    );

    const featureDocuments = materializeFeatureDocuments(
      featureId,
      parsedDocuments,
    );
    const cards = materializeMirrorCards(featureDocuments, concepts, edges);
    const sortedEdges = [...edges].sort(compareRelationshipEdges);

    const projection: MirrorProjection = {
      snapshotId: buildSnapshotId(
        featureId,
        generatedAt,
        concepts,
        sortedEdges,
      ),
      featureId,
      generatedAt,
      nodeCount: concepts.length,
      edgeCount: sortedEdges.length,
      concepts,
      cards,
      edges: sortedEdges,
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
  featureId: string,
  parsedDocuments: ParsedSourceDocument[],
): FeatureDocument[] {
  return parsedDocuments
    .filter((document) => document.exists)
    .map((document) => ({
      id: `${featureId}:${document.filePath}`,
      featureId,
      path: document.filePath,
      aspectKind: document.aspectKind,
      checksum: document.checksum,
      updatedAt: document.updatedAt,
    }))
    .sort(compareFeatureDocuments);
}

function materializeMirrorCards(
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
      filePath: document.path,
      title: document.aspectKind,
      aspectKind: document.aspectKind,
      conceptCount: conceptsBySourceFile.get(fileName) ?? 0,
      relationCount: relationsBySourceFile.get(fileName) ?? 0,
      freshness: "up-to-date",
    };
  });
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
