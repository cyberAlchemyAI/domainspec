import type { FastifyInstance } from "fastify";
import { resolve } from "node:path";

import { makeGetConceptDetailCardQuery } from "../application/get-concept-detail-card.js";
import { makeGetDefinitionPointerQuery } from "../application/get-definition-pointer.js";
import {
  makeGetRelationshipGraphQuery,
  makeGetLatestMirrorProjectionQuery,
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
import {
  REQUIRED_MIRROR_FILES,
  type AspectKind,
  type SelectionSource,
  type WhiteboardCardType,
  type WhiteboardViewLevel,
} from "../domain/models.js";
import { createDrizzleMirrorProjectionRepository } from "../infrastructure/drizzle-mirror-projection-repository.js";
import { createFeatureDocsDefinitionAnchorResolver } from "../infrastructure/feature-docs-definition-anchor-resolver.js";
import {
  createInMemoryProjectSourceRegistry,
  type DocumentationWorkspaceSource,
} from "../infrastructure/in-memory-project-source-registry.js";
import { createMarkdownCanonicalEdgeVocabulary } from "../infrastructure/markdown-canonical-edge-vocabulary.js";
import { createMarkdownFeatureDocsParser } from "../infrastructure/markdown-feature-docs-parser.js";

export interface RegisterKnowledgeGraphRoutesOptions {
  readonly projectRootDir?: string;
  readonly projectKey?: string;
  readonly featureDocsRootDir?: string;
  readonly relationshipsFilePath?: string;
  readonly databaseFilePath?: string;
  readonly projectSources?: DocumentationWorkspaceSource[];
}

interface RebuildRouteBody {
  projectKey?: string;
  featureId?: string;
  sourceFiles?: string[];
  requestedBy?: string;
}

interface FeatureQuerystring {
  projectKey?: string;
  featureId?: string;
}

interface MirrorCardsQuerystring extends FeatureQuerystring {
  includeOptionalAspects?: string;
  aspectKinds?: string | string[];
}

interface GraphQuerystring extends FeatureQuerystring {
  activeAspect?: string;
  viewLevel?: string;
  selectedFeatureId?: string;
  selectedGroupKey?: string;
  includeStories?: string;
  cardTypes?: string | string[];
  edgeKinds?: string | string[];
}

interface ConceptParams {
  conceptId: string;
}

interface ConceptQuerystring extends FeatureQuerystring {
  aspectHint?: string;
  activeAspect?: string;
  viewLevel?: string;
  selectedFeatureId?: string;
  selectedGroupKey?: string;
  includeStories?: string;
  selectedCardId?: string;
  selectedCardType?: string;
  includeInbound?: string;
  includeOutbound?: string;
  sessionId?: string;
  source?: string;
}

interface DefinitionQuerystring extends FeatureQuerystring {
  aspectHint?: string;
  preferExactAnchor?: string;
}

interface OpenDefinitionRouteBody {
  sessionId?: string;
  conceptId?: string;
  aspectHint?: string;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.KnowledgeGraphAPI
 *     type: Interface
 *   edges:
 *     - edge: exposes
 *       to: knowledge-graph-visualization.GetMirrorCards
 *     - edge: exposes
 *       to: knowledge-graph-visualization.GetRelationshipGraph
 *     - edge: exposes
 *       to: knowledge-graph-visualization.GetConceptDetailCard
 *     - edge: exposes
 *       to: knowledge-graph-visualization.GetDefinitionPointer
 *     - edge: exposes
 *       to: knowledge-graph-visualization.OpenDefinition
 */
export function registerKnowledgeGraphRoutes(
  app: FastifyInstance,
  options: RegisterKnowledgeGraphRoutesOptions = {},
): void {
  const projectRootDir = options.projectRootDir ?? resolve(process.cwd(), "..");
  const defaultProjectKey = options.projectKey ?? "domainspec-core";
  const featureDocsRootDir =
    options.featureDocsRootDir ?? resolve(projectRootDir, "docs", "features");
  const relationshipsFilePath =
    options.relationshipsFilePath ??
    resolve(projectRootDir, "RELATIONSHIPS.md");
  const databaseFilePath =
    options.databaseFilePath ??
    resolve(projectRootDir, ".data", "knowledge-graph-projections.sqlite");

  const projectSourceRegistry = createInMemoryProjectSourceRegistry({
    sources: mergeProjectSources([
      {
        projectKey: defaultProjectKey,
        workspaceRootDir: projectRootDir,
        featureDocsRootDir,
        relationshipsFilePath,
        status: "active",
      },
      ...(options.projectSources ?? []),
    ]),
  });

  const parser = createMarkdownFeatureDocsParser();
  const canonicalVocabulary = createMarkdownCanonicalEdgeVocabulary();
  const definitionAnchorResolver = createFeatureDocsDefinitionAnchorResolver();
  const repository = createDrizzleMirrorProjectionRepository({
    databaseFilePath,
  });
  const sessionStore = createInMemoryExplorationSessionStore();

  const rebuildMirrorProjection = makeRebuildMirrorProjectionUseCase({
    projectSourceRegistry,
    docsParser: parser,
    canonicalEdgeVocabulary: canonicalVocabulary,
    repository,
  });
  const getLatestProjection = makeGetLatestMirrorProjectionQuery(repository);
  const getRelationshipGraph = makeGetRelationshipGraphQuery(repository);
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
        const projectKey = request.body.projectKey ?? defaultProjectKey;
        const featureId =
          request.body.featureId ?? "knowledge-graph-visualization";
        const sourceFiles = request.body.sourceFiles ?? [
          ...REQUIRED_MIRROR_FILES,
        ];
        const requestedBy = request.body.requestedBy ?? "system";

        const result = await rebuildMirrorProjection({
          projectKey,
          featureId,
          sourceFiles,
          requestedBy,
        });

        return reply.status(200).send({
          snapshotId: result.projection.snapshotId,
          projectKey: result.projection.projectKey,
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

  app.get<{ Querystring: MirrorCardsQuerystring }>(
    "/api/knowledge-graph/mirror-cards",
    async (request, reply) => {
      try {
        assertReadScope(request.headers["x-scopes"]);

        const projectKey = request.query.projectKey ?? defaultProjectKey;
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const includeOptionalAspects = parseBoolean(
          request.query.includeOptionalAspects,
          true,
        );
        const requestedAspectKinds = parseAspectKinds(
          request.query.aspectKinds,
        );

        projectSourceRegistry.resolveProjectionScope({ projectKey, featureId });
        const projection = getLatestProjection({
          projectKey,
          featureId,
        });
        const cards = filterMirrorCards({
          cards: projection.cards,
          includeOptionalAspects,
          aspectKinds: requestedAspectKinds,
        });

        return reply.status(200).send({
          snapshotId: projection.snapshotId,
          projectKey: projection.projectKey,
          featureId: projection.featureId,
          generatedAt: projection.generatedAt,
          cards: cards.map((card) => ({
            cardId: `aspect:${card.filePath}`,
            ...card,
          })),
        });
      } catch (error) {
        return handleKnowledgeGraphError(reply, error);
      }
    },
  );

  app.get<{ Querystring: GraphQuerystring }>(
    "/api/knowledge-graph/graph",
    async (request, reply) => {
      try {
        assertReadScope(request.headers["x-scopes"]);

        const projectKey = request.query.projectKey ?? defaultProjectKey;
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const activeAspect = parseAspectKind(
          request.query.activeAspect,
          "SPEC",
        );
        const viewLevel = parseViewLevel(request.query.viewLevel, "aspect");
        const selectedFeatureId = normalizeOptional(
          request.query.selectedFeatureId,
        );
        const selectedGroupKey = normalizeOptional(
          request.query.selectedGroupKey,
        );
        const includeStories = parseBoolean(request.query.includeStories, true);
        const cardTypes = parseCardTypes(request.query.cardTypes);
        const edgeKinds = parseQueryList(request.query.edgeKinds);

        projectSourceRegistry.resolveProjectionScope({ projectKey, featureId });
        const projection = getRelationshipGraph({
          projectKey,
          featureId,
          activeAspect,
          viewLevel,
          selectedFeatureId: selectedFeatureId ?? undefined,
          selectedGroupKey: selectedGroupKey ?? undefined,
          includeStories,
          cardTypes,
          edgeKinds,
        });

        return reply.status(200).send({
          snapshotId: projection.snapshotId,
          projectKey: projection.projectKey,
          featureId: projection.featureId,
          generatedAt: projection.generatedAt,
          board: projection.board,
          nodes: projection.nodes,
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

        const projectKey = request.query.projectKey ?? defaultProjectKey;
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        projectSourceRegistry.resolveProjectionScope({ projectKey, featureId });
        const conceptId = request.params.conceptId;
        const aspectHint = parseAspectKindOptional(request.query.aspectHint);
        const activeAspect = parseAspectKind(
          request.query.activeAspect,
          aspectHint ?? "SPEC",
        );
        const viewLevel = parseViewLevel(request.query.viewLevel, "concept");
        const selectedFeatureId = normalizeOptional(
          request.query.selectedFeatureId,
        );
        const selectedGroupKey = normalizeOptional(
          request.query.selectedGroupKey,
        );
        const includeStories = parseBoolean(request.query.includeStories, true);
        const includeInbound = parseBoolean(request.query.includeInbound, true);
        const includeOutbound = parseBoolean(
          request.query.includeOutbound,
          true,
        );
        const sessionId = request.query.sessionId?.trim();

        if (sessionId && sessionId.length > 0) {
          const selectedCardId =
            normalizeOptional(request.query.selectedCardId) ??
            `concept:${conceptId}`;
          const selectedCardType = parseSelectableCardType(
            request.query.selectedCardType,
            "concept",
          );

          const selection = selectConcept({
            projectKey,
            featureId,
            sessionId,
            selectedCardId,
            selectedCardType,
            activeAspect,
            viewLevel,
            selectedFeatureId: selectedFeatureId ?? undefined,
            selectedGroupKey: selectedGroupKey ?? undefined,
            includeStories,
            source: normalizeSelectionSource(request.query.source),
          });

          if (
            (selectedCardType === "concept" || selectedCardType === "story") &&
            selection.selectedConceptId !== conceptId
          ) {
            throw createKnowledgeGraphError(
              "WHITEBOARD_CARD_MAPPING_UNRESOLVED",
              "Selected whiteboard card does not map to requested concept detail",
              {
                projectKey,
                featureId,
                selectedCardId,
                selectedCardType,
                selectedConceptId: selection.selectedConceptId,
                requestedConceptId: conceptId,
              },
            );
          }
        }

        const detail = getConceptDetailCard({
          projectKey,
          featureId,
          conceptId,
          aspectHint,
          includeInbound,
          includeOutbound,
          includeStories,
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

        const projectKey = request.query.projectKey ?? defaultProjectKey;
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        projectSourceRegistry.resolveProjectionScope({ projectKey, featureId });
        const conceptId = request.params.conceptId;
        const aspectHint = parseAspectKindOptional(request.query.aspectHint);
        const preferExactAnchor = parseBoolean(
          request.query.preferExactAnchor,
          true,
        );

        const pointer = getDefinitionPointer({
          projectKey,
          featureId,
          conceptId,
          aspectHint,
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

        const projectKey = request.query.projectKey ?? defaultProjectKey;
        const featureId =
          request.query.featureId ?? "knowledge-graph-visualization";
        const scope = projectSourceRegistry.resolveProjectionScope({
          projectKey,
          featureId,
        });
        const conceptId = request.params.conceptId;
        const aspectHint = parseAspectKindOptional(request.body.aspectHint);
        const sessionId = request.body.sessionId?.trim() ?? "";
        const bodyConceptId = request.body.conceptId?.trim();

        if (sessionId.length === 0) {
          throw createKnowledgeGraphError(
            "DEFINITION_SESSION_MISMATCH",
            "Session ID is required",
            {
              projectKey,
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
              projectKey,
              featureId,
              pathConceptId: conceptId,
              bodyConceptId,
            },
          );
        }

        const result = openDefinition({
          projectKey,
          featureId,
          sessionId,
          conceptId,
          scope,
          aspectHint,
        });

        return reply.status(200).send({
          filePath: result.pointer.filePath,
          anchor: result.pointer.anchor,
          lineHint: result.pointer.lineHint,
          label: result.pointer.label,
          aspectKind: result.pointer.aspectKind,
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

function parseAspectKind(
  rawValue: string | undefined,
  defaultValue: AspectKind,
): AspectKind {
  const normalized = rawValue?.trim().toUpperCase();
  if (!normalized || normalized.length === 0) {
    return defaultValue;
  }

  if (!isAspectKind(normalized)) {
    throw createKnowledgeGraphError(
      "MIRROR_REBUILD_INPUT_INVALID",
      "Aspect kind filter is invalid",
      {
        aspectKind: rawValue,
      },
    );
  }

  return normalized;
}

function parseAspectKindOptional(
  rawValue: string | undefined,
): AspectKind | undefined {
  const normalized = rawValue?.trim();
  if (!normalized || normalized.length === 0) {
    return undefined;
  }

  return parseAspectKind(normalized, "SPEC");
}

function parseViewLevel(
  rawValue: string | undefined,
  defaultValue: WhiteboardViewLevel,
): WhiteboardViewLevel {
  const normalized = rawValue?.trim().toLowerCase();
  if (!normalized || normalized.length === 0) {
    return defaultValue;
  }

  if (
    normalized !== "aspect" &&
    normalized !== "feature" &&
    normalized !== "concept"
  ) {
    throw createKnowledgeGraphError(
      "MIRROR_REBUILD_INPUT_INVALID",
      "Whiteboard viewLevel is invalid",
      {
        viewLevel: rawValue,
      },
    );
  }

  return normalized;
}

function parseAspectKinds(
  rawValue: string | string[] | undefined,
): AspectKind[] | undefined {
  const values = parseQueryList(rawValue);
  if (values.length === 0) {
    return undefined;
  }

  return values.map((value) => parseAspectKind(value, "SPEC"));
}

function parseCardTypes(
  rawValue: string | string[] | undefined,
): WhiteboardCardType[] | undefined {
  const values = parseQueryList(rawValue);
  if (values.length === 0) {
    return undefined;
  }

  return values.map((value) => {
    const normalized = value.trim().toLowerCase();
    if (!isWhiteboardCardType(normalized)) {
      throw createKnowledgeGraphError(
        "MIRROR_REBUILD_INPUT_INVALID",
        "Whiteboard cardTypes filter is invalid",
        {
          cardType: value,
        },
      );
    }
    return normalized;
  });
}

function parseSelectableCardType(
  rawValue: string | undefined,
  defaultValue: "feature" | "story" | "concept-group" | "concept",
): "feature" | "story" | "concept-group" | "concept" {
  const normalized = rawValue?.trim().toLowerCase();
  if (!normalized || normalized.length === 0) {
    return defaultValue;
  }

  if (
    normalized === "feature" ||
    normalized === "story" ||
    normalized === "concept-group" ||
    normalized === "concept"
  ) {
    return normalized;
  }

  throw createKnowledgeGraphError(
    "WHITEBOARD_CARD_MAPPING_UNRESOLVED",
    "Selected whiteboard card type is invalid",
    {
      selectedCardType: rawValue,
    },
  );
}

function parseQueryList(rawValue: string | string[] | undefined): string[] {
  if (rawValue === undefined) {
    return [];
  }

  const values = Array.isArray(rawValue) ? rawValue : [rawValue];
  const parsed: string[] = [];

  for (const value of values) {
    const parts = value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    parsed.push(...parts);
  }

  return parsed;
}

function filterMirrorCards<T extends { aspectKind: AspectKind }>(input: {
  cards: T[];
  includeOptionalAspects: boolean;
  aspectKinds?: AspectKind[];
}): T[] {
  const requiredAspectKinds = new Set<AspectKind>([
    "SPEC",
    "DOMAIN",
    "OPERATIONS",
  ]);
  const aspectFilter =
    input.aspectKinds && input.aspectKinds.length > 0
      ? new Set(input.aspectKinds)
      : null;

  return input.cards.filter((card) => {
    if (
      !input.includeOptionalAspects &&
      !requiredAspectKinds.has(card.aspectKind)
    ) {
      return false;
    }

    if (aspectFilter && !aspectFilter.has(card.aspectKind)) {
      return false;
    }

    return true;
  });
}

function normalizeOptional(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeSelectionSource(
  rawSource: string | undefined,
): SelectionSource {
  if (!rawSource) {
    return "graph";
  }

  if (
    rawSource === "card" ||
    rawSource === "graph" ||
    rawSource === "rail" ||
    rawSource === "board" ||
    rawSource === "detail"
  ) {
    return rawSource;
  }

  throw createKnowledgeGraphError(
    "CONCEPT_SELECTION_SOURCE_INVALID",
    "Selection source must be rail, board, detail, card, or graph",
    {
      source: rawSource,
    },
  );
}

function isAspectKind(value: string): value is AspectKind {
  return (
    value === "SPEC" ||
    value === "DOMAIN" ||
    value === "OPERATIONS" ||
    value === "QUERIES" ||
    value === "INTERFACES" ||
    value === "MAPPINGS" ||
    value === "WORKFLOWS" ||
    value === "EVENTS" ||
    value === "STATES"
  );
}

function isWhiteboardCardType(value: string): value is WhiteboardCardType {
  return (
    value === "aspect" ||
    value === "feature" ||
    value === "story" ||
    value === "concept-group" ||
    value === "concept"
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
    case "MIRROR_SOURCE_PROJECT_UNKNOWN":
    case "MIRROR_SOURCE_FEATURE_UNAVAILABLE":
      return 404;
    case "CONCEPT_NOT_FOUND":
    case "WHITEBOARD_CARD_NOT_FOUND":
    case "CONCEPT_DEFINITION_UNRESOLVED":
    case "DEFINITION_POINTER_NOT_FOUND":
    case "DEFINITION_ANCHOR_NOT_FOUND":
    case "MIRROR_PROJECTION_NOT_FOUND":
      return 404;
    case "DEFINITION_SESSION_MISMATCH":
    case "CONCEPT_SCOPE_MISMATCH":
    case "DEFINITION_SCOPE_MISMATCH":
      return 409;
    case "MIRROR_REBUILD_INPUT_INVALID":
    case "MIRROR_REQUIRED_FILE_MISSING":
    case "MIRROR_SPEC_PARSE_FAILED":
    case "MIRROR_RELATIONSHIP_INDEX_INVALID":
    case "MIRROR_SOURCE_ROOT_INVALID":
    case "MIRROR_EDGE_LABEL_INVALID":
    case "MIRROR_EDGE_ENDPOINT_UNKNOWN":
    case "CONCEPT_SELECTION_SOURCE_INVALID":
    case "WHITEBOARD_CARD_MAPPING_UNRESOLVED":
      return 422;
    case "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE":
    case "MIRROR_PROJECTION_PERSISTENCE_FAILED":
    default:
      return 500;
  }
}

function mergeProjectSources(
  sources: DocumentationWorkspaceSource[],
): DocumentationWorkspaceSource[] {
  const byProjectKey = new Map<string, DocumentationWorkspaceSource>();

  for (const source of sources) {
    const projectKey = source.projectKey.trim();
    if (projectKey.length === 0) {
      continue;
    }

    byProjectKey.set(projectKey, {
      ...source,
      projectKey,
    });
  }

  return Array.from(byProjectKey.values());
}
