import type {
  CommentEvent,
  HandoffBundle,
  MutationBatch,
  PrototypeVariant,
  RevisionManifestEntry,
  StudioSession,
} from "../domain/models.js";

export interface StudioSessionStorePort {
  allocateSessionId(): string;
  allocateCommentId(): string;
  allocateBatchId(): string;
  allocateRevisionId(parentRevisionId: string | null): string;
  saveSession(session: StudioSession): void;
  getSession(sessionId: string): StudioSession | null;
  saveVariants(sessionId: string, variants: PrototypeVariant[]): void;
  listVariants(sessionId: string): PrototypeVariant[];
  appendComment(comment: CommentEvent): void;
  listComments(sessionId: string, revisionId: string): CommentEvent[];
  saveBatch(batch: MutationBatch): void;
  getBatch(sessionId: string, batchId: string): MutationBatch | null;
  getDraftBatch(sessionId: string, batchId?: string): MutationBatch | null;
  listBatches(sessionId: string): MutationBatch[];
  appendRevision(entry: RevisionManifestEntry): void;
  listRevisions(sessionId: string): RevisionManifestEntry[];
  saveHandoffBundle(bundle: HandoffBundle): void;
  getHandoffBundle(sessionId: string): HandoffBundle | null;
}
