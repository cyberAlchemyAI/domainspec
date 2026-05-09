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
  | "UPS_AUTH_REQUIRED"
  | "UPS_AUTH_FORBIDDEN"
  | "VARIANT_COUNT_OUT_OF_RANGE"
  | "SESSION_NOT_FOUND"
  | "PROMPT_REQUIRED"
  | "PROMPT_NOT_SET"
  | "VARIANT_GENERATION_COUNT_MISMATCH"
  | "BASELINE_SELECTION_REQUIRED"
  | "BASELINE_LABEL_INVALID"
  | "BASELINE_GATE_UNSATISFIED"
  | "COMMENT_SCHEMA_INVALID"
  | "COMMENT_SET_EMPTY"
  | "SOURCE_REVISION_INVALID"
  | "DRAFT_BATCH_NOT_FOUND"
  | "BATCH_NOT_FOUND"
  | "BATCH_NOT_DRAFT"
  | "APPROVAL_METADATA_REQUIRED"
  | "APPROVAL_STALE"
  | "AUTO_APPLY_FORBIDDEN"
  | "BATCH_APPROVAL_REQUIRED"
  | "BATCH_STALE_FOR_HEAD"
  | "HANDOFF_REVISION_REQUIRED"
  | "HANDOFF_REFERENCE_INCOMPLETE"
  | "HANDOFF_BUNDLE_NOT_READY"
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

export interface ConceptRelationEdge {
  fromConceptId: string;
  edge: string;
  toConceptId: string;
  evidence: string;
  notes?: string;
  fromCardId?: string;
  toCardId?: string;
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
  inboundRelations: ConceptRelationEdge[];
  outboundRelations: ConceptRelationEdge[];
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

export type StudioBaselineMode = "selected" | "committed";
export type StudioGateState = "pending" | "satisfied" | "blocked";
export type StudioSessionState =
  | "SessionInitialized"
  | "PromptCaptured"
  | "VariantsReady"
  | "BaselineReady"
  | "CommentsCaptured"
  | "MutationDrafted"
  | "MutationApproved"
  | "RevisionApplied"
  | "RevisionRecorded"
  | "SessionCompleted";

export type StudioCommentSeverity = "blocker" | "high" | "medium" | "low";
export type StudioMutationBatchStatus =
  | "draft"
  | "approved"
  | "applied"
  | "rejected";

export interface StudioBaselineProvenance {
  mode: StudioBaselineMode;
  label: "A" | "B" | "C";
}

export interface StudioIntegrationReadiness {
  uiPhaseBridgeReady: boolean;
  generateTestsUiReady: boolean;
  uiImplementReady: boolean;
}

export interface StudioSessionSnapshot {
  sessionId: string;
  prompt: string | null;
  variantCount: 1 | 2 | 3;
  variantLabels: Array<"A" | "B" | "C">;
  baseline: StudioBaselineProvenance | null;
  revisionHeadId: string | null;
  selectionGate: StudioGateState;
  applyGate: StudioGateState;
  integration: StudioIntegrationReadiness;
  state: StudioSessionState;
}

export type StudioVariantStatus = "candidate" | "selected" | "committed";

export interface StudioVariant {
  sessionId: string;
  variantLabel: "A" | "B" | "C";
  htmlArtifactRef: string;
  componentsUsed: string[];
  rationale: string;
  tradeoffs: string;
  risk: string;
  status: StudioVariantStatus;
}

export interface StudioAnnotationTarget {
  selector: string;
  elementLabel: string;
  odId: string | null;
}

export interface StudioCommentEvent {
  commentId: string;
  sessionId: string;
  revisionId: string;
  target: StudioAnnotationTarget;
  severity: StudioCommentSeverity;
  intent: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface StudioMutationTask {
  taskId: string;
  target: string;
  intent: string;
  changeType: string;
  acceptanceText: string;
  priority: string;
}

export interface StudioBatchApproval {
  required: true;
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface StudioMutationBatch {
  batchId: string;
  sessionId: string;
  sourceRevisionId: string;
  status: StudioMutationBatchStatus;
  generatedFromCommentIds: string[];
  tasks: StudioMutationTask[];
  approval: StudioBatchApproval;
  checksum: string;
}

export interface StudioDiffSummary {
  added: number;
  changed: number;
  removed: number;
}

export interface StudioRevisionManifestEntry {
  revisionId: string;
  parentRevisionId: string;
  sessionId: string;
  variantCount: 1 | 2 | 3;
  baseline: StudioBaselineProvenance;
  appliedBatchId: string;
  appliedTaskIds: string[];
  unresolvedCommentIds: string[];
  diffSummary: StudioDiffSummary;
  createdAt: string;
}

export interface StudioHandoffBundle {
  sessionId: string;
  revisionHeadId: string;
  baseline: StudioBaselineProvenance;
  variantCount: 1 | 2 | 3;
  storyRefs: string[];
  requirementRefs: string[];
  acceptanceRefs: string[];
  uiSpecRef: string;
  testSpecRef: string;
}

export interface InitializeStudioSessionInput {
  requestedVariantCount?: number;
  requestedBy: string;
}

export interface SubmitStudioPromptInput {
  prompt: string;
  submittedBy: string;
}

export interface GenerateStudioVariantsInput {
  requestedBy: string;
}

export interface SelectOrCommitStudioBaselineInput {
  selectedLabel?: string;
  requestedBy: string;
}

export interface CaptureStudioCommentEventInput {
  revisionId: string;
  target: {
    selector: string;
    elementLabel: string;
    odId?: string;
  };
  severity: StudioCommentSeverity;
  intent: string;
  note: string;
  createdBy: string;
}

export interface SynthesizeStudioMutationBatchInput {
  sourceRevisionId: string;
  requestedBy: string;
}

export interface ApproveStudioMutationBatchInput {
  approvedBy: string;
  approvedAt: string;
}

export interface ApplyStudioMutationBatchInput {
  applyRequestedBy: string;
}

export interface ExportStudioHandoffInput {
  exportProfile?: string;
  requestedBy: string;
}

export interface GetDraftMutationBatchOptions {
  batchId?: string;
}

export interface ListRevisionManifestOptions {
  limit?: number;
  newestFirst?: boolean;
}

export interface StudioVariantsMutationResponse {
  session: StudioSessionSnapshot;
  variants: StudioVariant[];
}

export interface StudioMutationBatchMutationResponse {
  session: StudioSessionSnapshot;
  batch: StudioMutationBatch;
}

export interface StudioApplyBatchMutationResponse {
  session: StudioSessionSnapshot;
  batch: StudioMutationBatch;
  revision: StudioRevisionManifestEntry;
}

export interface StudioExportHandoffResponse {
  session: StudioSessionSnapshot;
  bundle: StudioHandoffBundle;
}

export interface StudioVariantsQueryResponse {
  variants: StudioVariant[];
}

export interface StudioRevisionManifestResponse {
  entries: StudioRevisionManifestEntry[];
}

const UPS_READ_SCOPES = "domainspec.ui-prototyping.read";
const UPS_WRITE_SCOPES =
  "domainspec.ui-prototyping.read domainspec.ui-prototyping.write";

export async function initializeStudioSession(
  input: InitializeStudioSessionInput,
): Promise<StudioSessionSnapshot> {
  return request<StudioSessionSnapshot>("/api/ui-prototyping-studio/sessions", {
    method: "POST",
    headers: {
      "x-scopes": UPS_WRITE_SCOPES,
    },
    body: JSON.stringify(input),
  });
}

export async function submitStudioPrompt(
  sessionId: string,
  input: SubmitStudioPromptInput,
): Promise<StudioSessionSnapshot> {
  return request<StudioSessionSnapshot>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/prompt`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function generateStudioVariants(
  sessionId: string,
  input: GenerateStudioVariantsInput,
): Promise<StudioVariantsMutationResponse> {
  return request<StudioVariantsMutationResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/variants/generate`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function selectOrCommitStudioBaseline(
  sessionId: string,
  input: SelectOrCommitStudioBaselineInput,
): Promise<StudioVariantsMutationResponse> {
  return request<StudioVariantsMutationResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/baseline`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function getStudioSessionSnapshot(
  sessionId: string,
): Promise<StudioSessionSnapshot> {
  return request<StudioSessionSnapshot>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: {
        "x-scopes": UPS_READ_SCOPES,
      },
    },
  );
}

export async function listStudioSessionVariants(
  sessionId: string,
): Promise<StudioVariantsQueryResponse> {
  return request<StudioVariantsQueryResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/variants`,
    {
      headers: {
        "x-scopes": UPS_READ_SCOPES,
      },
    },
  );
}

export async function captureStudioCommentEvent(
  sessionId: string,
  input: CaptureStudioCommentEventInput,
): Promise<StudioCommentEvent> {
  return request<StudioCommentEvent>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/comments`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function synthesizeStudioMutationBatch(
  sessionId: string,
  input: SynthesizeStudioMutationBatchInput,
): Promise<StudioMutationBatchMutationResponse> {
  return request<StudioMutationBatchMutationResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/mutation-batches/synthesize`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function approveStudioMutationBatch(
  sessionId: string,
  batchId: string,
  input: ApproveStudioMutationBatchInput,
): Promise<StudioMutationBatchMutationResponse> {
  return request<StudioMutationBatchMutationResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/mutation-batches/${encodeURIComponent(batchId)}/approve`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function applyStudioMutationBatch(
  sessionId: string,
  batchId: string,
  input: ApplyStudioMutationBatchInput,
): Promise<StudioApplyBatchMutationResponse> {
  return request<StudioApplyBatchMutationResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/mutation-batches/${encodeURIComponent(batchId)}/apply`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function getDraftStudioMutationBatch(
  sessionId: string,
  options: GetDraftMutationBatchOptions = {},
): Promise<StudioMutationBatch> {
  const query = new URLSearchParams();
  if (options.batchId && options.batchId.trim().length > 0) {
    query.set("batchId", options.batchId.trim());
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  return request<StudioMutationBatch>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/mutation-batches/draft${suffix}`,
    {
      headers: {
        "x-scopes": UPS_READ_SCOPES,
      },
    },
  );
}

export async function listStudioRevisionManifest(
  sessionId: string,
  options: ListRevisionManifestOptions = {},
): Promise<StudioRevisionManifestResponse> {
  const query = new URLSearchParams();
  if (
    typeof options.limit === "number" &&
    Number.isInteger(options.limit) &&
    options.limit > 0
  ) {
    query.set("limit", String(options.limit));
  }
  if (typeof options.newestFirst === "boolean") {
    query.set("newestFirst", String(options.newestFirst));
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  return request<StudioRevisionManifestResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/revisions${suffix}`,
    {
      headers: {
        "x-scopes": UPS_READ_SCOPES,
      },
    },
  );
}

export async function exportStudioDesignHandoff(
  sessionId: string,
  input: ExportStudioHandoffInput,
): Promise<StudioExportHandoffResponse> {
  return request<StudioExportHandoffResponse>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/handoff/export`,
    {
      method: "POST",
      headers: {
        "x-scopes": UPS_WRITE_SCOPES,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function getStudioHandoffBundle(
  sessionId: string,
): Promise<StudioHandoffBundle> {
  return request<StudioHandoffBundle>(
    `/api/ui-prototyping-studio/sessions/${encodeURIComponent(sessionId)}/handoff`,
    {
      headers: {
        "x-scopes": UPS_READ_SCOPES,
      },
    },
  );
}
