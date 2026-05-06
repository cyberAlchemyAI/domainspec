const DEFAULT_API_BASE = "http://localhost:3000";
const DEFAULT_FEATURE_ID_FALLBACK = "knowledge-graph-visualization";
const configuredFeatureId = import.meta.env.VITE_KG_FEATURE_ID;
export const DEFAULT_FEATURE_ID =
  typeof configuredFeatureId === "string" &&
  configuredFeatureId.trim().length > 0
    ? configuredFeatureId.trim()
    : DEFAULT_FEATURE_ID_FALLBACK;

export type ApiErrorCode =
  | "KG_AUTH_REQUIRED"
  | "MIRROR_PROJECTION_NOT_FOUND"
  | "MIRROR_REBUILD_INPUT_INVALID"
  | "MIRROR_REQUIRED_FILE_MISSING"
  | "MIRROR_SPEC_PARSE_FAILED"
  | "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE"
  | "MIRROR_EDGE_LABEL_INVALID"
  | "MIRROR_EDGE_ENDPOINT_UNKNOWN"
  | "MIRROR_PROJECTION_PERSISTENCE_FAILED"
  | "DEFINITION_SESSION_MISMATCH"
  | "DEFINITION_POINTER_NOT_FOUND"
  | "DEFINITION_ANCHOR_NOT_FOUND"
  | "CONCEPT_NOT_FOUND"
  | "CONCEPT_DEFINITION_UNRESOLVED"
  | "CONCEPT_SELECTION_SOURCE_INVALID"
  | "UNKNOWN";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code: ApiErrorCode = "UNKNOWN",
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type FreshnessStatus = "up-to-date" | "stale" | "missing";

export interface MirrorCard {
  filePath: string;
  title: string;
  aspectKind: string;
  conceptCount: number;
  relationCount: number;
  freshness: FreshnessStatus;
}

export interface GraphNode {
  conceptId: string;
  name: string;
  taxonomyType: string;
  summary: string;
}

export interface GraphEdge {
  fromConceptId: string;
  edge: string;
  toConceptId: string;
  evidence: string;
  notes: string;
}

export interface MirrorCardsResponse {
  snapshotId: string;
  featureId: string;
  generatedAt: string;
  cards: MirrorCard[];
}

export interface RelationshipGraphResponse {
  snapshotId: string;
  featureId: string;
  generatedAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface RebuildProjectionResponse {
  snapshotId: string;
  featureId: string;
  generatedAt: string;
  nodeCount: number;
  edgeCount: number;
  cardCount: number;
  coverageRatio: number;
  edgeDensity: number;
}

export interface DefinitionPointer {
  filePath: string;
  anchor: string;
  lineHint: number;
  label: string;
}

export interface ConceptDetailCard {
  conceptId: string;
  title: string;
  summary: string;
  definition: DefinitionPointer;
  inboundRelations: GraphEdge[];
  outboundRelations: GraphEdge[];
}

export interface GetConceptDetailCardOptions {
  sessionId?: string;
  source?: "card" | "graph";
  includeInbound?: boolean;
  includeOutbound?: boolean;
}

function apiBase(): string {
  const configured = import.meta.env.VITE_API_BASE;
  return configured && configured.trim().length > 0
    ? configured.trim()
    : DEFAULT_API_BASE;
}

function featureDefault(featureId?: string): string {
  return featureId && featureId.trim().length > 0
    ? featureId.trim()
    : DEFAULT_FEATURE_ID;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-scopes": "domainspec.kg.read",
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text.length > 0 ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    const code =
      typeof body === "object" && body !== null && "code" in body
        ? String((body as { code: unknown }).code)
        : "UNKNOWN";
    const details =
      typeof body === "object" && body !== null && "details" in body
        ? ((body as { details: Record<string, unknown> }).details ?? {})
        : {};

    throw new ApiError(message, response.status, code as ApiErrorCode, details);
  }

  return body as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function rebuildProjection(
  featureId?: string,
): Promise<RebuildProjectionResponse> {
  return request<RebuildProjectionResponse>("/api/knowledge-graph/rebuild", {
    method: "POST",
    body: JSON.stringify({
      featureId: featureDefault(featureId),
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "web-ui",
    }),
  });
}

export async function getMirrorCards(
  featureId?: string,
): Promise<MirrorCardsResponse> {
  const targetFeature = encodeURIComponent(featureDefault(featureId));
  return request<MirrorCardsResponse>(
    `/api/knowledge-graph/mirror-cards?featureId=${targetFeature}`,
  );
}

export async function getRelationshipGraph(
  featureId?: string,
): Promise<RelationshipGraphResponse> {
  const targetFeature = encodeURIComponent(featureDefault(featureId));
  return request<RelationshipGraphResponse>(
    `/api/knowledge-graph/graph?featureId=${targetFeature}`,
  );
}

export async function getConceptDetailCard(
  conceptId: string,
  featureId?: string,
  options: GetConceptDetailCardOptions = {},
): Promise<ConceptDetailCard> {
  const targetFeature = featureDefault(featureId);
  const encodedConceptId = encodeURIComponent(conceptId);
  const query = new URLSearchParams({ featureId: targetFeature });

  if (options.sessionId && options.sessionId.trim().length > 0) {
    query.set("sessionId", options.sessionId.trim());
  }
  if (options.source) {
    query.set("source", options.source);
  }
  if (typeof options.includeInbound === "boolean") {
    query.set("includeInbound", String(options.includeInbound));
  }
  if (typeof options.includeOutbound === "boolean") {
    query.set("includeOutbound", String(options.includeOutbound));
  }

  return request<ConceptDetailCard>(
    `/api/knowledge-graph/concepts/${encodedConceptId}?${query.toString()}`,
  );
}

export async function getDefinitionPointer(
  conceptId: string,
  featureId?: string,
): Promise<DefinitionPointer> {
  const targetFeature = encodeURIComponent(featureDefault(featureId));
  const encodedConceptId = encodeURIComponent(conceptId);
  return request<DefinitionPointer>(
    `/api/knowledge-graph/concepts/${encodedConceptId}/definition?featureId=${targetFeature}`,
  );
}

export async function openDefinition(
  input: { sessionId: string; conceptId: string },
  featureId?: string,
): Promise<DefinitionPointer> {
  const targetFeature = encodeURIComponent(featureDefault(featureId));
  const encodedConceptId = encodeURIComponent(input.conceptId);
  return request<DefinitionPointer>(
    `/api/knowledge-graph/concepts/${encodedConceptId}/open-definition?featureId=${targetFeature}`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
