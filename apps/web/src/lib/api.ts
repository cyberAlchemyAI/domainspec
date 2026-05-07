const DEFAULT_API_BASE = "http://localhost:3000";
const DEFAULT_PROJECT_KEY_FALLBACK = "domainspec-core";
const DEFAULT_FEATURE_ID_FALLBACK = "knowledge-graph-visualization";
const configuredProjectKey = import.meta.env.VITE_KG_PROJECT_KEY;
const configuredFeatureId = import.meta.env.VITE_KG_FEATURE_ID;
export const DEFAULT_PROJECT_KEY =
  typeof configuredProjectKey === "string" &&
  configuredProjectKey.trim().length > 0
    ? configuredProjectKey.trim()
    : DEFAULT_PROJECT_KEY_FALLBACK;
export const DEFAULT_FEATURE_ID =
  typeof configuredFeatureId === "string" &&
  configuredFeatureId.trim().length > 0
    ? configuredFeatureId.trim()
    : DEFAULT_FEATURE_ID_FALLBACK;

export type ApiErrorCode =
  | "KG_AUTH_REQUIRED"
  | "KG_AUTH_FORBIDDEN"
  | "MIRROR_SOURCE_PROJECT_UNKNOWN"
  | "MIRROR_SOURCE_FEATURE_UNAVAILABLE"
  | "MIRROR_SOURCE_ROOT_INVALID"
  | "MIRROR_PROJECTION_NOT_FOUND"
  | "MIRROR_REBUILD_INPUT_INVALID"
  | "MIRROR_REQUIRED_FILE_MISSING"
  | "MIRROR_SPEC_PARSE_FAILED"
  | "MIRROR_RELATIONSHIP_INDEX_INVALID"
  | "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE"
  | "MIRROR_EDGE_LABEL_INVALID"
  | "MIRROR_EDGE_ENDPOINT_UNKNOWN"
  | "MIRROR_PROJECTION_PERSISTENCE_FAILED"
  | "WHITEBOARD_CARD_NOT_FOUND"
  | "WHITEBOARD_CARD_MAPPING_UNRESOLVED"
  | "DEFINITION_SESSION_MISMATCH"
  | "DEFINITION_POINTER_NOT_FOUND"
  | "DEFINITION_ANCHOR_NOT_FOUND"
  | "DEFINITION_SCOPE_MISMATCH"
  | "CONCEPT_NOT_FOUND"
  | "CONCEPT_DEFINITION_UNRESOLVED"
  | "CONCEPT_SCOPE_MISMATCH"
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

export type AspectKind =
  | "SPEC"
  | "DOMAIN"
  | "OPERATIONS"
  | "QUERIES"
  | "INTERFACES"
  | "MAPPINGS"
  | "WORKFLOWS"
  | "EVENTS"
  | "STATES";

export type WhiteboardViewLevel = "aspect" | "feature" | "concept";

export type WhiteboardCardType =
  | "aspect"
  | "feature"
  | "story"
  | "concept-group"
  | "concept";

export type SelectionSource = "card" | "graph" | "rail" | "board" | "detail";

export interface ProjectionScopeInput {
  projectKey?: string;
  featureId?: string;
}

export interface MirrorCard {
  cardId: string;
  filePath: string;
  title: string;
  aspectKind: AspectKind;
  conceptCount: number;
  storyCount: number;
  freshness: FreshnessStatus;
  isActive: boolean;
}

export interface GraphBoard {
  viewLevel: WhiteboardViewLevel;
  activeAspect: AspectKind;
  selectedFeatureId: string | null;
  selectedGroupKey: string | null;
}

export interface GraphNode {
  cardId: string;
  cardType: WhiteboardCardType;
  title: string;
  summary: string;
  groupKey: string | null;
  conceptId: string | null;
  aspectKind: AspectKind | null;
}

export interface GraphEdge {
  fromCardId: string;
  edge: string;
  toCardId: string;
  evidence: string;
}

export interface MirrorCardsResponse {
  snapshotId: string;
  projectKey: string;
  featureId: string;
  generatedAt: string;
  cards: MirrorCard[];
}

export interface RelationshipGraphResponse {
  snapshotId: string;
  projectKey: string;
  featureId: string;
  generatedAt: string;
  board: GraphBoard;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface RebuildProjectionResponse {
  snapshotId: string;
  projectKey: string;
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
  aspectKind?: AspectKind;
}

export interface ConceptDetailCard {
  conceptId: string;
  title: string;
  summary: string;
  aspectKind?: AspectKind;
  definition: DefinitionPointer;
  inboundRelations: GraphEdge[];
  outboundRelations: GraphEdge[];
  relatedStories?: string[];
}

export interface GetConceptDetailCardOptions {
  sessionId?: string;
  source?: SelectionSource;
  includeInbound?: boolean;
  includeOutbound?: boolean;
  includeStories?: boolean;
  activeAspect?: AspectKind;
  viewLevel?: WhiteboardViewLevel;
  selectedFeatureId?: string | null;
  selectedGroupKey?: string | null;
  selectedCardId?: string;
  selectedCardType?: WhiteboardCardType;
}

export interface GetMirrorCardsOptions {
  includeOptionalAspects?: boolean;
  aspectKinds?: AspectKind[];
  activeAspect?: AspectKind;
}

export interface GetRelationshipGraphOptions {
  activeAspect?: AspectKind;
  viewLevel?: WhiteboardViewLevel;
  selectedFeatureId?: string | null;
  selectedGroupKey?: string | null;
  includeStories?: boolean;
  cardTypes?: WhiteboardCardType[];
  edgeKinds?: string[];
}

export interface GetDefinitionPointerOptions {
  aspectHint?: AspectKind;
  preferExactAnchor?: boolean;
}

export interface OpenDefinitionInput {
  sessionId: string;
  conceptId: string;
  aspectHint?: AspectKind;
}

export interface OpenDefinitionResult extends DefinitionPointer {
  target?: string;
  openedAt?: string;
}

function apiBase(): string {
  const configured = import.meta.env.VITE_API_BASE;
  return configured && configured.trim().length > 0
    ? configured.trim()
    : DEFAULT_API_BASE;
}

function projectDefault(projectKey?: string): string {
  return projectKey && projectKey.trim().length > 0
    ? projectKey.trim()
    : DEFAULT_PROJECT_KEY;
}

function featureDefault(featureId?: string): string {
  return featureId && featureId.trim().length > 0
    ? featureId.trim()
    : DEFAULT_FEATURE_ID;
}

function normalizeScope(scope: ProjectionScopeInput): {
  projectKey: string;
  featureId: string;
} {
  return {
    projectKey: projectDefault(scope.projectKey),
    featureId: featureDefault(scope.featureId),
  };
}

function appendString(
  query: URLSearchParams,
  key: string,
  value: string | null | undefined,
): void {
  if (value === undefined || value === null) {
    return;
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    return;
  }

  query.set(key, normalized);
}

function appendBoolean(
  query: URLSearchParams,
  key: string,
  value: boolean | undefined,
): void {
  if (typeof value !== "boolean") {
    return;
  }

  query.set(key, String(value));
}

function appendList(
  query: URLSearchParams,
  key: string,
  values: string[] | undefined,
): void {
  if (!values || values.length === 0) {
    return;
  }

  const normalized = values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (normalized.length === 0) {
    return;
  }

  query.set(key, normalized.join(","));
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
  scope: ProjectionScopeInput = {},
): Promise<RebuildProjectionResponse> {
  const normalizedScope = normalizeScope(scope);
  return request<RebuildProjectionResponse>("/api/knowledge-graph/rebuild", {
    method: "POST",
    headers: {
      "x-scopes": "domainspec.kg.read domainspec.kg.write",
    },
    body: JSON.stringify({
      projectKey: normalizedScope.projectKey,
      featureId: normalizedScope.featureId,
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "web-ui",
    }),
  });
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.GetMirrorCards
 *     type: Query
 *     concern: sys
 */
export async function getMirrorCards(
  scope: ProjectionScopeInput = {},
  options: GetMirrorCardsOptions = {},
): Promise<MirrorCardsResponse> {
  const normalizedScope = normalizeScope(scope);
  const query = new URLSearchParams({
    projectKey: normalizedScope.projectKey,
    featureId: normalizedScope.featureId,
  });

  appendBoolean(
    query,
    "includeOptionalAspects",
    options.includeOptionalAspects,
  );
  appendList(query, "aspectKinds", options.aspectKinds);
  appendString(query, "activeAspect", options.activeAspect);

  return request<MirrorCardsResponse>(
    `/api/knowledge-graph/mirror-cards?${query.toString()}`,
  );
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.GetRelationshipGraph
 *     type: Query
 *     concern: sys
 */
export async function getRelationshipGraph(
  scope: ProjectionScopeInput = {},
  options: GetRelationshipGraphOptions = {},
): Promise<RelationshipGraphResponse> {
  const normalizedScope = normalizeScope(scope);
  const query = new URLSearchParams({
    projectKey: normalizedScope.projectKey,
    featureId: normalizedScope.featureId,
  });

  appendString(query, "activeAspect", options.activeAspect);
  appendString(query, "viewLevel", options.viewLevel);
  appendString(query, "selectedFeatureId", options.selectedFeatureId);
  appendString(query, "selectedGroupKey", options.selectedGroupKey);
  appendBoolean(query, "includeStories", options.includeStories);
  appendList(query, "cardTypes", options.cardTypes);
  appendList(query, "edgeKinds", options.edgeKinds);

  return request<RelationshipGraphResponse>(
    `/api/knowledge-graph/graph?${query.toString()}`,
  );
}

export async function getConceptDetailCard(
  conceptId: string,
  scope: ProjectionScopeInput = {},
  options: GetConceptDetailCardOptions = {},
): Promise<ConceptDetailCard> {
  const normalizedScope = normalizeScope(scope);
  const encodedConceptId = encodeURIComponent(conceptId);
  const query = new URLSearchParams({
    projectKey: normalizedScope.projectKey,
    featureId: normalizedScope.featureId,
  });

  appendString(query, "sessionId", options.sessionId);
  appendString(query, "source", options.source);
  appendBoolean(query, "includeInbound", options.includeInbound);
  appendBoolean(query, "includeOutbound", options.includeOutbound);
  appendBoolean(query, "includeStories", options.includeStories);
  appendString(query, "activeAspect", options.activeAspect);
  appendString(query, "viewLevel", options.viewLevel);
  appendString(query, "selectedFeatureId", options.selectedFeatureId ?? null);
  appendString(query, "selectedGroupKey", options.selectedGroupKey ?? null);
  appendString(query, "selectedCardId", options.selectedCardId);
  appendString(query, "selectedCardType", options.selectedCardType);

  return request<ConceptDetailCard>(
    `/api/knowledge-graph/concepts/${encodedConceptId}?${query.toString()}`,
  );
}

export async function getDefinitionPointer(
  conceptId: string,
  scope: ProjectionScopeInput = {},
  options: GetDefinitionPointerOptions = {},
): Promise<DefinitionPointer> {
  const normalizedScope = normalizeScope(scope);
  const encodedConceptId = encodeURIComponent(conceptId);
  const query = new URLSearchParams({
    projectKey: normalizedScope.projectKey,
    featureId: normalizedScope.featureId,
  });

  appendString(query, "aspectHint", options.aspectHint);
  appendBoolean(query, "preferExactAnchor", options.preferExactAnchor);

  return request<DefinitionPointer>(
    `/api/knowledge-graph/concepts/${encodedConceptId}/definition?${query.toString()}`,
  );
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.OpenDefinition
 *     type: Operation
 *     concern: sys
 */
export async function openDefinition(
  input: OpenDefinitionInput,
  scope: ProjectionScopeInput = {},
): Promise<OpenDefinitionResult> {
  const normalizedScope = normalizeScope(scope);
  const encodedConceptId = encodeURIComponent(input.conceptId);
  const query = new URLSearchParams({
    projectKey: normalizedScope.projectKey,
    featureId: normalizedScope.featureId,
  });

  return request<OpenDefinitionResult>(
    `/api/knowledge-graph/concepts/${encodedConceptId}/open-definition?${query.toString()}`,
    {
      method: "POST",
      body: JSON.stringify({
        sessionId: input.sessionId,
        conceptId: input.conceptId,
        aspectHint: input.aspectHint,
      }),
    },
  );
}
