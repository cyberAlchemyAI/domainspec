import assert from "node:assert/strict";
import test from "node:test";

import type {
  CanonicalEdgeVocabularyPort,
  FeatureDocsParserPort,
  MirrorProjectionRepositoryPort,
} from "./ports.js";
import { makeRebuildMirrorProjectionUseCase } from "./rebuild-mirror-projection.js";
import { isKnowledgeGraphError } from "../domain/errors.js";
import type {
  MirrorProjection,
  ParsedSourceDocument,
} from "../domain/models.js";

interface TestContext {
  parser: FeatureDocsParserPort;
  canonicalVocabulary: CanonicalEdgeVocabularyPort;
  repository: MirrorProjectionRepositoryPort;
  savedProjections: MirrorProjection[];
}

test("rebuild rejects missing required mirror file", async () => {
  const context = createTestContext({
    scannedDocuments: [
      createParsedDocument({
        filePath: "SPEC.md",
        exists: true,
        content: "# spec",
      }),
      createParsedDocument({ filePath: "domain.md", exists: false }),
      createParsedDocument({
        filePath: "operations.md",
        exists: true,
        content: "# ops",
      }),
    ],
    parsedConceptIds: ["knowledge-graph-visualization.FeatureDocument"],
    parsedEdges: [],
    canonicalEdges: ["maps"],
  });

  const useCase = makeRebuildMirrorProjectionUseCase({
    docsParser: context.parser,
    canonicalEdgeVocabulary: context.canonicalVocabulary,
    repository: context.repository,
  });

  await assert.rejects(
    async () =>
      useCase({
        featureId: "knowledge-graph-visualization",
        sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
        requestedBy: "test",
      }),
    (error) => {
      assert.ok(isKnowledgeGraphError(error));
      assert.equal(error.code, "MIRROR_REQUIRED_FILE_MISSING");
      return true;
    },
  );
});

test("rebuild rejects non-canonical edge labels", async () => {
  const context = createTestContext({
    scannedDocuments: requiredParsedDocuments(),
    parsedConceptIds: [
      "knowledge-graph-visualization.FeatureDocument",
      "knowledge-graph-visualization.ConceptDefinition",
    ],
    parsedEdges: [
      {
        fromConceptId: "knowledge-graph-visualization.FeatureDocument",
        edge: "non-canonical",
        toConceptId: "knowledge-graph-visualization.ConceptDefinition",
        evidence: "SPEC.md#feature-concept-graph",
        notes: "",
      },
    ],
    canonicalEdges: ["maps", "contains"],
  });

  const useCase = makeRebuildMirrorProjectionUseCase({
    docsParser: context.parser,
    canonicalEdgeVocabulary: context.canonicalVocabulary,
    repository: context.repository,
  });

  await assert.rejects(
    async () =>
      useCase({
        featureId: "knowledge-graph-visualization",
        sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
        requestedBy: "test",
      }),
    (error) => {
      assert.ok(isKnowledgeGraphError(error));
      assert.equal(error.code, "MIRROR_EDGE_LABEL_INVALID");
      return true;
    },
  );
});

test("rebuild rejects unknown edge endpoints", async () => {
  const context = createTestContext({
    scannedDocuments: requiredParsedDocuments(),
    parsedConceptIds: ["knowledge-graph-visualization.FeatureDocument"],
    parsedEdges: [
      {
        fromConceptId: "knowledge-graph-visualization.FeatureDocument",
        edge: "maps",
        toConceptId: "knowledge-graph-visualization.ConceptDefinition",
        evidence: "SPEC.md#feature-concept-graph",
        notes: "",
      },
    ],
    canonicalEdges: ["maps"],
  });

  const useCase = makeRebuildMirrorProjectionUseCase({
    docsParser: context.parser,
    canonicalEdgeVocabulary: context.canonicalVocabulary,
    repository: context.repository,
  });

  await assert.rejects(
    async () =>
      useCase({
        featureId: "knowledge-graph-visualization",
        sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
        requestedBy: "test",
      }),
    (error) => {
      assert.ok(isKnowledgeGraphError(error));
      assert.equal(error.code, "MIRROR_EDGE_ENDPOINT_UNKNOWN");
      return true;
    },
  );
});

test("rebuild materializes and persists one projection snapshot", async () => {
  const context = createTestContext({
    scannedDocuments: requiredParsedDocuments(),
    parsedConceptIds: [
      "knowledge-graph-visualization.FeatureDocument",
      "knowledge-graph-visualization.ConceptDefinition",
    ],
    parsedEdges: [
      {
        fromConceptId: "knowledge-graph-visualization.FeatureDocument",
        edge: "maps",
        toConceptId: "knowledge-graph-visualization.ConceptDefinition",
        evidence: "mappings.md#documenttoconceptmapping",
        notes: "",
      },
    ],
    canonicalEdges: ["maps"],
  });

  const useCase = makeRebuildMirrorProjectionUseCase({
    docsParser: context.parser,
    canonicalEdgeVocabulary: context.canonicalVocabulary,
    repository: context.repository,
  });

  const result = await useCase({
    featureId: "knowledge-graph-visualization",
    sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
    requestedBy: "test",
    generatedAt: "2026-05-05T10:00:00.000Z",
  });

  assert.equal(context.savedProjections.length, 1);
  assert.equal(result.projection.featureId, "knowledge-graph-visualization");
  assert.equal(result.cardCount, 3);
  assert.equal(result.coverageRatio, 1);
  assert.equal(result.projection.edges.length, 1);
  assert.ok(result.projection.snapshotId.startsWith("snapshot-"));
  assert.deepEqual(
    result.projection.cards.map((card) => card.filePath),
    ["SPEC.md", "domain.md", "operations.md"],
  );
});

function requiredParsedDocuments(): ParsedSourceDocument[] {
  return [
    createParsedDocument({
      filePath: "SPEC.md",
      exists: true,
      content: "# spec",
    }),
    createParsedDocument({
      filePath: "domain.md",
      exists: true,
      content: "# domain",
    }),
    createParsedDocument({
      filePath: "operations.md",
      exists: true,
      content: "# operations",
    }),
  ];
}

function createParsedDocument(input: {
  filePath: string;
  exists: boolean;
  content?: string;
}): ParsedSourceDocument {
  return {
    filePath: input.filePath,
    absolutePath: `/tmp/${input.filePath}`,
    exists: input.exists,
    content: input.content ?? null,
    checksum: input.exists ? `hash-${input.filePath}` : "",
    updatedAt: "2026-05-05T10:00:00.000Z",
    aspectKind:
      input.filePath === "SPEC.md"
        ? "SPEC"
        : input.filePath === "domain.md"
          ? "DOMAIN"
          : "OPERATIONS",
  };
}

function createTestContext(input: {
  scannedDocuments: ParsedSourceDocument[];
  parsedConceptIds: string[];
  parsedEdges: {
    fromConceptId: string;
    edge: string;
    toConceptId: string;
    evidence: string;
    notes: string;
  }[];
  canonicalEdges: string[];
}): TestContext {
  const savedProjections: MirrorProjection[] = [];

  const parser: FeatureDocsParserPort = {
    async scanFeatureFiles() {
      return input.scannedDocuments;
    },
    parseSpec() {
      return {
        concepts: input.parsedConceptIds.map((conceptId) => ({
          conceptId,
          name: conceptId.split(".").at(-1) ?? conceptId,
          taxonomyType: "Entity",
          summary: "summary",
          sourceFilePath: "SPEC.md",
          sourceAnchor: "concepts",
          definitionPointer: {
            filePath: "SPEC.md",
            anchor: "concepts",
            lineHint: 0,
            label: conceptId,
          },
        })),
        edges: input.parsedEdges,
      };
    },
  };

  const canonicalVocabulary: CanonicalEdgeVocabularyPort = {
    async loadCanonicalEdges() {
      return new Set(input.canonicalEdges);
    },
  };

  const repository: MirrorProjectionRepositoryPort = {
    saveProjection(projection) {
      savedProjections.push(projection);
    },
    getLatestProjection() {
      return null;
    },
    close() {
      return;
    },
  };

  return {
    parser,
    canonicalVocabulary,
    repository,
    savedProjections,
  };
}
