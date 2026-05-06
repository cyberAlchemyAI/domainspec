import type {
  ConceptDefinition,
  DefinitionPointer,
  ExplorationSession,
  MirrorProjection,
  ParsedSourceDocument,
  ProjectionScope,
  RelationshipEdge,
  SelectionSource,
} from "../domain/models.js";

export interface ScanFeatureFilesInput {
  scope: ProjectionScope;
  sourceFiles: string[];
  indexedAt: string;
}

export interface ParseSpecInput {
  scope: ProjectionScope;
  specContent: string;
}

export interface ParseSpecOutput {
  concepts: ConceptDefinition[];
  edges: RelationshipEdge[];
}

export interface FeatureDocsParserPort {
  scanFeatureFiles(
    input: ScanFeatureFilesInput,
  ): Promise<ParsedSourceDocument[]>;
  parseSpec(input: ParseSpecInput): ParseSpecOutput;
}

export interface ResolveProjectionScopeInput {
  projectKey: string;
  featureId: string;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ProjectSourceRegistry
 *     type: Interface
 *   edges:
 *     - edge: exposes
 *       to: knowledge-graph-visualization.ResolveProjectionScope
 */
export interface ProjectSourceRegistryPort {
  resolveProjectionScope(input: ResolveProjectionScopeInput): ProjectionScope;
}

export interface CanonicalEdgeVocabularyPort {
  loadCanonicalEdges(input: { scope: ProjectionScope }): Promise<Set<string>>;
}

export interface MirrorProjectionRepositoryPort {
  saveProjection(projection: MirrorProjection): void;
  getLatestProjection(input: {
    projectKey: string;
    featureId: string;
  }): MirrorProjection | null;
  close(): void;
}

export interface ExplorationSessionStorePort {
  setSelectedConcept(input: {
    projectKey: string;
    featureId: string;
    sessionId: string;
    conceptId: string;
    source: SelectionSource;
  }): ExplorationSession;
  getSession(input: {
    projectKey: string;
    featureId: string;
    sessionId: string;
  }): ExplorationSession | null;
  getSessionById(sessionId: string): ExplorationSession | null;
  setLastDefinitionTarget(input: {
    projectKey: string;
    featureId: string;
    sessionId: string;
    target: string;
  }): ExplorationSession;
}

export interface DefinitionAnchorResolverPort {
  resolvePointer(input: {
    scope: ProjectionScope;
    pointer: DefinitionPointer;
  }): {
    fileExists: boolean;
    anchorExists: boolean;
  };
}
