import cors from "@fastify/cors";
import Fastify from "fastify";

import { requireScopes } from "./auth.js";
import { checkDatabaseConnection } from "./db.js";
import {
  CONCEPT_TYPES,
  EDGE_TYPES,
  getCapabilityNeighborhood,
  getConceptInspectorContext,
  getDependencyMatrix,
  getFeatureAtlas,
  isConceptType,
  isEdgeType,
  isFeatureDocStatus,
} from "./knowledge-graph.js";
import { SCOPES } from "./scopes.js";

function firstQueryValue(raw: unknown): string | undefined {
  if (Array.isArray(raw)) {
    const firstValue = raw[0];
    return typeof firstValue === "string" ? firstValue : undefined;
  }

  return typeof raw === "string" ? raw : undefined;
}

function parseBooleanQuery(raw: unknown): boolean | undefined | null {
  const value = firstQueryValue(raw);
  if (value === undefined) {
    return undefined;
  }

  if (value === "true" || value === "1") {
    return true;
  }

  if (value === "false" || value === "0") {
    return false;
  }

  return null;
}

function parseNumberQuery(raw: unknown): number | undefined | null {
  const value = firstQueryValue(raw);
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function parseStringListQuery(raw: unknown): string[] | undefined | null {
  if (raw === undefined) {
    return undefined;
  }

  const sources = Array.isArray(raw) ? raw : [raw];
  const values: string[] = [];

  for (const source of sources) {
    if (typeof source !== "string") {
      return null;
    }

    values.push(
      ...source
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    );
  }

  return values;
}

function sendValidationError(
  reply: { code: (status: number) => { send: (body: unknown) => void } },
  message: string,
): void {
  reply.code(400).send({
    error: "validation_error",
    message,
  });
}

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.get("/health", async () => {
    const database = await checkDatabaseConnection();
    return {
      service: "knowledge-graph-runtime",
      status: database.ok ? "ok" : "degraded",
      database,
    };
  });

  app.get(
    "/knowledge-graph/features",
    { preHandler: requireScopes([SCOPES.READ]) },
    async (request, reply) => {
      const query = request.query as Record<string, unknown>;
      const includeCapabilities = parseBooleanQuery(query.includeCapabilities);

      if (includeCapabilities === null) {
        sendValidationError(reply, "includeCapabilities must be true or false");
        return;
      }

      const status = firstQueryValue(query.status);
      if (status !== undefined && !isFeatureDocStatus(status)) {
        sendValidationError(
          reply,
          "status must be one of draft, planned, in-progress, implemented, PASS, FLAG, BLOCK",
        );
        return;
      }

      return getFeatureAtlas({
        profileId: firstQueryValue(query.profileId),
        includeCapabilities,
        filter: {
          pillar: firstQueryValue(query.pillar),
          status,
          priority: firstQueryValue(query.priority),
          tag: firstQueryValue(query.tag),
          searchText: firstQueryValue(query.search),
        },
      });
    },
  );

  app.get(
    "/knowledge-graph/features/:featureId/capabilities/:capabilityKey/neighborhood",
    { preHandler: requireScopes([SCOPES.READ]) },
    async (request, reply) => {
      const params = request.params as {
        featureId: string;
        capabilityKey: string;
      };
      const query = request.query as Record<string, unknown>;

      const depth = parseNumberQuery(query.depth);
      if (
        depth === null ||
        (depth !== undefined && (!Number.isInteger(depth) || depth < 1))
      ) {
        sendValidationError(reply, "depth must be an integer >= 1");
        return;
      }

      if ((depth ?? 1) > 1) {
        sendValidationError(reply, "V1 neighborhood depth is bounded to 1");
        return;
      }

      const conceptTypes = parseStringListQuery(query.conceptTypes);
      if (conceptTypes === null) {
        sendValidationError(reply, "conceptTypes must be string values");
        return;
      }

      const edgeTypes = parseStringListQuery(query.edgeTypes);
      if (edgeTypes === null) {
        sendValidationError(reply, "edgeTypes must be string values");
        return;
      }

      if (conceptTypes?.some((value) => !isConceptType(value))) {
        sendValidationError(
          reply,
          `conceptTypes must use canonical ConceptType values: ${CONCEPT_TYPES.join(", ")}`,
        );
        return;
      }

      if (edgeTypes?.some((value) => !isEdgeType(value))) {
        sendValidationError(
          reply,
          `edgeTypes must use canonical EdgeType values: ${EDGE_TYPES.join(", ")}`,
        );
        return;
      }

      const crossFeatureOnly = parseBooleanQuery(query.crossFeatureOnly);
      if (crossFeatureOnly === null) {
        sendValidationError(reply, "crossFeatureOnly must be true or false");
        return;
      }

      const response = getCapabilityNeighborhood({
        featureId: params.featureId,
        capabilityKey: params.capabilityKey,
        depth: depth ?? 1,
        filter: {
          conceptTypes,
          edgeTypes,
          crossFeatureOnly,
        },
      });

      if (!response) {
        reply.code(404).send({
          error: "not_found",
          message: "Feature or capability was not found",
        });
        return;
      }

      return response;
    },
  );

  app.get(
    "/knowledge-graph/concepts/:conceptId",
    { preHandler: requireScopes([SCOPES.READ]) },
    async (request, reply) => {
      const params = request.params as { conceptId: string };
      const query = request.query as Record<string, unknown>;

      const includeIncoming = parseBooleanQuery(query.includeIncoming);
      if (includeIncoming === null) {
        sendValidationError(reply, "includeIncoming must be true or false");
        return;
      }

      const includeOutgoing = parseBooleanQuery(query.includeOutgoing);
      if (includeOutgoing === null) {
        sendValidationError(reply, "includeOutgoing must be true or false");
        return;
      }

      const edgeTypes = parseStringListQuery(query.edgeTypes);
      if (edgeTypes === null) {
        sendValidationError(reply, "edgeTypes must be string values");
        return;
      }

      if (edgeTypes?.some((value) => !isEdgeType(value))) {
        sendValidationError(
          reply,
          `edgeTypes must use canonical EdgeType values: ${EDGE_TYPES.join(", ")}`,
        );
        return;
      }

      const response = getConceptInspectorContext({
        conceptId: params.conceptId,
        filter: {
          includeIncoming,
          includeOutgoing,
          edgeTypes,
        },
      });

      if (!response) {
        reply.code(404).send({
          error: "not_found",
          message: "Concept was not found",
        });
        return;
      }

      return response;
    },
  );

  app.get(
    "/knowledge-graph/dependency-matrix",
    { preHandler: requireScopes([SCOPES.GOVERNANCE_READ]) },
    async () => {
      return getDependencyMatrix();
    },
  );

  return app;
}
