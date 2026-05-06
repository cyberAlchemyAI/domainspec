import type {
  ConceptDefinition,
  DefinitionPointer,
  ExplorationSession,
  MirrorProjection,
  ParsedSourceDocument,
  RelationshipEdge,
  SelectionSource,
} from "../domain/models.js";

export interface ScanFeatureFilesInput {
  featureId: string;
  sourceFiles: string[];
  indexedAt: string;
}

export interface ParseSpecInput {
  featureId: string;
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

export interface CanonicalEdgeVocabularyPort {
  loadCanonicalEdges(): Promise<Set<string>>;
}

export interface MirrorProjectionRepositoryPort {
  saveProjection(projection: MirrorProjection): void;
  getLatestProjection(featureId: string): MirrorProjection | null;
  close(): void;
}

export interface ExplorationSessionStorePort {
  setSelectedConcept(input: {
    featureId: string;
    sessionId: string;
    conceptId: string;
    source: SelectionSource;
  }): ExplorationSession;
  getSession(input: {
    featureId: string;
    sessionId: string;
  }): ExplorationSession | null;
  setLastDefinitionTarget(input: {
    featureId: string;
    sessionId: string;
    target: string;
  }): ExplorationSession;
}

export interface DefinitionAnchorResolverPort {
  resolvePointer(input: { featureId: string; pointer: DefinitionPointer }): {
    fileExists: boolean;
    anchorExists: boolean;
  };
}
