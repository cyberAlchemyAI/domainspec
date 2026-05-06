import type { FastifyInstance } from "fastify";
import { resolve } from "node:path";

import { makeGetConceptDetailCardQuery } from "../application/get-concept-detail-card.js";
import { makeGetDefinitionPointerQuery } from "../application/get-definition-pointer.js";
import {
  makeGetLatestMirrorProjectionQuery,
  toGraphNodes,
} from "../application/get-latest-mirror-projection.js";
import { makeOpenDefinitionUseCase } from "../application/open-definition.js";
import { makeRebuildMirrorProjectionUseCase } from "../application/rebuild-mirror-projection.js";
import { createInMemoryExplorationSessionStore } from "../application/session-store.js";
import { makeSelectConceptUseCase } from "../application/select-concept.js";
import {
  createKnowledgeGraphError,
  isKnowledgeGraphError,
} from "../domain/errors.js";
import type { KnowledgeGraphErrorCode } from "../domain/errors.js";
import { REQUIRED_MIRROR_FILES } from "../domain/models.js";
import { createDrizzleMirrorProjectionRepository } from "../infrastructure/drizzle-mirror-projection-repository.js";
import { createFeatureDocsDefinitionAnchorResolver } from "../infrastructure/feature-docs-definition-anchor-resolver.js";
import { createMarkdownCanonicalEdgeVocabulary } from "../infrastructure/markdown-canonical-edge-vocabulary.js";
import { createMarkdownFeatureDocsParser } from "../infrastructure/markdown-feature-docs-parser.js";

export interface RegisterKnowledgeGraphRoutesOptions {
  readonly projectRootDir?: string;
  readonly featureDocsRootDir?: string;
  readonly relationshipsFilePath?: string;
  readonly databaseFilePath?: string;
}

interface RebuildRouteBody {
  featureId?: string;
  sourceFiles?: string[];
  requestedBy?: string;
}

interface FeatureQuerystring {
  featureId?: string;
}

interface ConceptParams {
  conceptId: string;
}

interface ConceptQuerystring extends FeatureQuerystring {
  includeInbound?: string;
  includeOutbound?: string;
  sessionId?: string;
  source?: string;
}

interface DefinitionQuerystring extends FeatureQuerystring {
  preferExactAnchor?: string;
}

interface OpenDefinitionRouteBody {
  sessionId?: string;
  conceptId?: string;
}

export function registerKnowledgeGraphRoutes(
  app: FastifyInstance,
  options: RegisterKnowledgeGraphRoutesOptions = {},
): void {
  const projectRootDir = options.projectRootDir ?? resolve(process.cwd(), "..");
  const featureDocsRootDir =
    options.featureDocsRootDir ?? resolve(projectRootDir, "docs", "features");
  const relationshipsFilePath =
    options.relationshipsFilePath ??
    resolve(projectRootDir, "RELATIONSHIPS.md");
  const databaseFilePath =
    options.databaseFilePath ??
    resolve(projectRootDir, ".data", "knowledge-graph-projections.sqlite");

  const parser = createMarkdownFeatureDocsParser({
    featuresRootDir: featureDocsRootDir,
  });
  const canonicalVocabulary = createMarkdownCanonicalEdgeVocabulary({
    relationshipsFilePath,
  });
  const definitionAnchorResolver = createFeatureDocsDefinitionAnchorResolver({
    featuresRootDir: featureDocsRootDir,
  });
  const repository = createDrizzleMirrorProjectionRepository({
    databaseFilePath,
  });
  const sessionStore = createInMemoryExplorationSessionStore();

  const rebuildMirrorProjection = makeRebuildMirrorProjectionUseCase({
    docsParser: parser,
    canonicalEdgeVocabulary: canonicalVocabulary,
    repository,
  });
  const getLatestProjection = makeGetLatestMirrorProjectionQuery(repository);
  const getConceptDetailCard = makeGetConceptDetailCardQuery(repository);
  const getDefinitionPointer = makeGetDefinitionPointerQuery(repository);
  const selectConcept = makeSelectConceptUseCase({ repository, sessionStore });
  const openDefinition = makeOpenDefinitionUseCase({
    getDefinitionPointer,
    sessionStore,
    anchorResolver: definitionAnchorResolver,
  });

  app.addHook("onClose", async () => {
    repository.close();
  });

  app.post<{ Body: RebuildRouteBody }>(
    "/api/knowledge-graph/rebuild",
    async (request, reply) => {
      try {
        const featureId =
          request.body.featureId ?? "knowledge-graph-visualization";
        const sourceFiles = request.body.sourceFiles ?? [
          ...REQUIRED_MIRROR_FILES,
        ];
        const requestedBy = request.body.requestedBy ?? "system";

        const result = await rebuildMirrorProjection({
          featureId,
          sourceFiles,
          requestedBy,
        });

        return reply.status(200).send({
          snapshotId: result.projection.snapshotId,
          featureId: result.projection.featureId,
          generatedAt: result.projection.generatedAt,
          nodeCount: result.projection.nodeCount,
          edgeCount: result.projection.edgeCount,
          cardCount: result.cardCount,
          coverageRatio: result.coverageRatio,
          edgeDensity: result.edgeDensity,
        });
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );

  app.get<{ Querystring: FeatureQuerystring }>(
    "/api/knowledge-graph/mirror-cards",
    async (request, reply) => {
      try {
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const projection = getLatestProjection(featureId);

        return reply.status(200).send({
          snapshotId: projection.snapshotId,
          featureId: projection.featureId,
          generatedAt: projection.generatedAt,
          cards: projection.cards,
        });
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );

  app.get<{ Querystring: FeatureQuerystring }>(
    "/api/knowledge-graph/graph",
    async (request, reply) => {
      try {
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const projection = getLatestProjection(featureId);

        return reply.status(200).send({
          snapshotId: projection.snapshotId,
          featureId: projection.featureId,
          generatedAt: projection.generatedAt,
          nodes: toGraphNodes(projection),
          edges: projection.edges,
        });
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );

  app.get<{ Params: ConceptParams; Querystring: ConceptQuerystring }>(
    "/api/knowledge-graph/concepts/:conceptId",
    async (request, reply) => {
      try {
        assertReadScope(request.headers["x-scopes"]);

        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const conceptId = request.params.conceptId;
        const includeInbound = parseBoolean(request.query.includeInbound, true);
        const includeOutbound = parseBoolean(
          request.query.includeOutbound,
          true,
        );
        const sessionId = request.query.sessionId?.trim();

        if (sessionId && sessionId.length > 0) {
          selectConcept({
            featureId,
            sessionId,
            conceptId,
            source: normalizeSelectionSource(request.query.source),
          });
        }

        const detail = getConceptDetailCard({
          featureId,
          conceptId,
          includeInbound,
          includeOutbound,
        });

        return reply.status(200).send(detail);
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );

  app.get<{ Params: ConceptParams; Querystring: DefinitionQuerystring }>(
    "/api/knowledge-graph/concepts/:conceptId/definition",
    async (request, reply) => {
      try {
        assertReadScope(request.headers["x-scopes"]);

        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const conceptId = request.params.conceptId;
        const preferExactAnchor = parseBoolean(
          request.query.preferExactAnchor,
          true,
        );

        const pointer = getDefinitionPointer({
          featureId,
          conceptId,
          preferExactAnchor,
        });

        return reply.status(200).send(pointer);
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );

  app.post<{
    Params: ConceptParams;
    Querystring: FeatureQuerystring;
    Body: OpenDefinitionRouteBody;
  }>(
    "/api/knowledge-graph/concepts/:conceptId/open-definition",
    async (request, reply) => {
      try {
        assertReadScope(request.headers["x-scopes"]);

        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const conceptId = request.params.conceptId;
        const sessionId = request.body.sessionId?.trim() ?? "";
        const bodyConceptId = request.body.conceptId?.trim();

        if (sessionId.length === 0) {
          throw createKnowledgeGraphError(
            "DEFINITION_SESSION_MISMATCH",
            "Session ID is required",
            {
              featureId,
              conceptId,
            },
          );
        }

        if (bodyConceptId && bodyConceptId !== conceptId) {
          throw createKnowledgeGraphError(
            "DEFINITION_SESSION_MISMATCH",
            "Path concept ID and body concept ID do not match",
            {
              featureId,
              pathConceptId: conceptId,
              bodyConceptId,
            },
          );
        }

        const result = openDefinition({
          featureId,
          sessionId,
          conceptId,
        });

        return reply.status(200).send({
          filePath: result.pointer.filePath,
          anchor: result.pointer.anchor,
          lineHint: result.pointer.lineHint,
          label: result.pointer.label,
          target: result.target,
          openedAt: result.openedAt,
        });
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );
}

function assertReadScope(rawScopes: unknown): void {
  const values =
    typeof rawScopes === "string"
      ? [rawScopes]
      : Array.isArray(rawScopes)
        ? rawScopes.filter(
            (value): value is string => typeof value === "string",
          )
        : [];

  const scopes = values
    .join(" ")
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (!scopes.includes("domainspec.kg.read")) {
    throw createKnowledgeGraphError(
      "KG_AUTH_REQUIRED",
      "Read scope domainspec.kg.read is required",
      {
        requiredScope: "domainspec.kg.read",
      },
    );
  }
}

function parseBoolean(
  rawValue: string | undefined,
  defaultValue: boolean,
): boolean {
  if (rawValue === undefined) {
    return defaultValue;
  }

  const value = rawValue.trim().toLowerCase();
  if (value === "true" || value === "1") {
    return true;
  }
  if (value === "false" || value === "0") {
    return false;
  }

  return defaultValue;
}

function normalizeSelectionSource(
  rawSource: string | undefined,
): "card" | "graph" {
  if (!rawSource) {
    return "graph";
  }

  if (rawSource === "card" || rawSource === "graph") {
    return rawSource;
  }

  throw createKnowledgeGraphError(
    "CONCEPT_SELECTION_SOURCE_INVALID",
    "Selection source must be card or graph",
    {
      source: rawSource,
    },
  );
}

function handleKnowledgeGraphError(
  reply: {
    status: (statusCode: number) => { send: (payload: unknown) => unknown };
  },
  error: unknown,
): unknown {
  if (isKnowledgeGraphError(error)) {
    return reply.status(errorStatusCode(error.code)).send({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  return reply.status(500).send({
    code: "MIRROR_PROJECTION_PERSISTENCE_FAILED",
    message: "Unexpected knowledge graph failure",
    details: {
      reason: String(error),
    },
  });
}

function errorStatusCode(code: KnowledgeGraphErrorCode): number {
  switch (code) {
    case "KG_AUTH_REQUIRED":
      return 401;
    case "CONCEPT_NOT_FOUND":
    case "CONCEPT_DEFINITION_UNRESOLVED":
    case "DEFINITION_POINTER_NOT_FOUND":
    case "DEFINITION_ANCHOR_NOT_FOUND":
    case "MIRROR_PROJECTION_NOT_FOUND":
      return 404;
    case "DEFINITION_SESSION_MISMATCH":
      return 409;
    case "MIRROR_REBUILD_INPUT_INVALID":
    case "MIRROR_REQUIRED_FILE_MISSING":
    case "MIRROR_SPEC_PARSE_FAILED":
    case "MIRROR_EDGE_LABEL_INVALID":
    case "MIRROR_EDGE_ENDPOINT_UNKNOWN":
    case "CONCEPT_SELECTION_SOURCE_INVALID":
      return 422;
    case "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE":
    case "MIRROR_PROJECTION_PERSISTENCE_FAILED":
    default:
      return 500;
  }
}
