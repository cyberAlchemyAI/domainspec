import { createHash } from "node:crypto";

export const REQUIRED_MIRROR_FILES = [
  "SPEC.md",
  "domain.md",
  "operations.md",
] as const;

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

const ASPECT_BY_FILE: Record<string, AspectKind> = {
  "SPEC.md": "SPEC",
  "domain.md": "DOMAIN",
  "operations.md": "OPERATIONS",
  "queries.md": "QUERIES",
  "interfaces.md": "INTERFACES",
  "mappings.md": "MAPPINGS",
  "workflows.md": "WORKFLOWS",
  "events.md": "EVENTS",
  "states.md": "STATES",
};

const REQUIRED_FILE_ORDER: Map<string, number> = new Map(
  REQUIRED_MIRROR_FILES.map((filePath, index) => [filePath, index]),
);

export type FreshnessStatus = "up-to-date" | "stale" | "missing";

export type SelectionSource = "card" | "graph" | "rail" | "board" | "detail";

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.FeatureDocument
 *     type: Entity
 */
export interface FeatureDocument {
  id: string;
  projectKey: string;
  featureId: string;
  path: string;
  aspectKind: AspectKind;
  checksum: string;
  updatedAt: string;
}

export interface DefinitionPointer {
  filePath: string;
  anchor: string;
  lineHint: number;
  label: string;
  aspectKind?: AspectKind;
}

export interface ConceptDefinition {
  conceptId: string;
  name: string;
  taxonomyType: string;
  summary: string;
  sourceFilePath: string;
  sourceAnchor: string;
  definitionPointer: DefinitionPointer;
}

export interface RelationshipEdge {
  fromConceptId: string;
  edge: string;
  toConceptId: string;
  evidence: string;
  notes: string;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.MirrorCardView
 *     type: View Model
 */
export interface MirrorCardView {
  projectKey: string;
  filePath: string;
  title: string;
  aspectKind: AspectKind;
  conceptCount: number;
  relationCount: number;
  freshness: FreshnessStatus;
}

export type WhiteboardViewLevel = "aspect" | "feature" | "concept";

export type WhiteboardCardType =
  | "aspect"
  | "feature"
  | "story"
  | "concept-group"
  | "concept";

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.WhiteboardCard
 *     type: View Model
 */
export interface WhiteboardCard {
  cardId: string;
  cardType: WhiteboardCardType;
  title: string;
  projectKey: string;
  featureId: string;
  conceptId: string | null;
  groupKey: string | null;
  aspectKind: AspectKind | null;
}

export interface WhiteboardLevelProjection {
  level: WhiteboardViewLevel;
  cards: WhiteboardCard[];
  edges: RelationshipEdge[];
}

export interface WhiteboardProjection {
  aspect: WhiteboardLevelProjection;
  feature: WhiteboardLevelProjection;
  concept: WhiteboardLevelProjection;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.MirrorProjection
 *     type: Entity
 */
export interface MirrorProjection {
  snapshotId: string;
  projectKey: string;
  featureId: string;
  generatedAt: string;
  nodeCount: number;
  edgeCount: number;
  concepts: ConceptDefinition[];
  cards: MirrorCardView[];
  edges: RelationshipEdge[];
  whiteboard: WhiteboardProjection;
}

export interface ConceptDetailCard {
  conceptId: string;
  title: string;
  summary: string;
  aspectKind: AspectKind;
  definition: DefinitionPointer;
  inboundRelations: RelationshipEdge[];
  outboundRelations: RelationshipEdge[];
  relatedStories: string[];
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ExplorationSession
 *     type: Entity
 */
export interface ExplorationSession {
  sessionId: string;
  projectKey: string;
  featureId: string;
  selectedConceptId: string;
  selectedSource: SelectionSource;
  lastDefinitionTarget: string | null;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ProjectionScope
 *     type: Value Object
 */
export interface ProjectionScope {
  projectKey: string;
  featureId: string;
  workspaceRootDir: string;
  featureDocsRootDir: string;
  relationshipsFilePath: string;
}

export interface ParsedSourceDocument {
  filePath: string;
  absolutePath: string;
  exists: boolean;
  content: string | null;
  checksum: string;
  updatedAt: string;
  aspectKind: AspectKind;
}

export interface RelationshipGraphNode {
  conceptId: string;
  name: string;
  taxonomyType: string;
  summary: string;
}

export function normalizeFilePath(input: string): string {
  return input.replaceAll("\\", "/").replace(/^\.\//, "").trim();
}

export function inferAspectKind(filePath: string): AspectKind {
  const normalized = normalizeFilePath(filePath);
  const baseName = normalized.split("/").at(-1) ?? normalized;
  return ASPECT_BY_FILE[baseName] ?? "SPEC";
}

export function buildChecksum(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

export function compareFilePathsByMirrorOrder(
  left: string,
  right: string,
): number {
  const leftNormalized = normalizeFilePath(left);
  const rightNormalized = normalizeFilePath(right);

  const leftIndex = REQUIRED_FILE_ORDER.get(leftNormalized);
  const rightIndex = REQUIRED_FILE_ORDER.get(rightNormalized);

  if (leftIndex !== undefined && rightIndex !== undefined) {
    return leftIndex - rightIndex;
  }

  if (leftIndex !== undefined) {
    return -1;
  }

  if (rightIndex !== undefined) {
    return 1;
  }

  return leftNormalized.localeCompare(rightNormalized);
}

export function compareFeatureDocuments(
  left: FeatureDocument,
  right: FeatureDocument,
): number {
  return compareFilePathsByMirrorOrder(left.path, right.path);
}

export function compareConceptDefinitions(
  left: ConceptDefinition,
  right: ConceptDefinition,
): number {
  return left.conceptId.localeCompare(right.conceptId);
}

export function compareRelationshipEdges(
  left: RelationshipEdge,
  right: RelationshipEdge,
): number {
  const fromCompare = left.fromConceptId.localeCompare(right.fromConceptId);
  if (fromCompare !== 0) {
    return fromCompare;
  }

  const edgeCompare = left.edge.localeCompare(right.edge);
  if (edgeCompare !== 0) {
    return edgeCompare;
  }

  const toCompare = left.toConceptId.localeCompare(right.toConceptId);
  if (toCompare !== 0) {
    return toCompare;
  }

  return left.evidence.localeCompare(right.evidence);
}

export function buildSnapshotId(
  projectKey: string,
  featureId: string,
  generatedAt: string,
  concepts: ConceptDefinition[],
  edges: RelationshipEdge[],
): string {
  const payload = {
    projectKey,
    featureId,
    generatedAt,
    concepts: concepts.map((concept) => concept.conceptId),
    edges: edges.map(
      (edge) => `${edge.fromConceptId}|${edge.edge}|${edge.toConceptId}`,
    ),
  };

  const digest = createHash("sha256")
    .update(JSON.stringify(payload), "utf8")
    .digest("hex")
    .slice(0, 16);

  return `snapshot-${digest}`;
}
