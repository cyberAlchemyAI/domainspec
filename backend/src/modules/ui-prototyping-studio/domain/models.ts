import { createUiPrototypingStudioError } from "./errors.js";

export type VariantCount = 1 | 2 | 3;
export type VariantLabel = "A" | "B" | "C";
export type GateState = "pending" | "satisfied" | "blocked";
export type BaselineMode = "selected" | "committed";
export type PrototypeVariantStatus = "candidate" | "selected" | "committed";
export type CommentSeverity = "blocker" | "high" | "medium" | "low";
export type MutationBatchStatus = "draft" | "approved" | "applied" | "rejected";
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

export interface BaselineProvenance {
  mode: BaselineMode;
  label: VariantLabel;
}

export interface IntegrationReadiness {
  uiPhaseBridgeReady: boolean;
  generateTestsUiReady: boolean;
  uiImplementReady: boolean;
}

export interface AnnotationTarget {
  selector: string;
  elementLabel: string;
  odId: string | null;
}

export interface CommentEvent {
  commentId: string;
  sessionId: string;
  revisionId: string;
  target: AnnotationTarget;
  severity: CommentSeverity;
  intent: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface MutationTask {
  taskId: string;
  target: string;
  intent: string;
  changeType: string;
  acceptanceText: string;
  priority: string;
}

export interface BatchApproval {
  required: true;
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface MutationBatch {
  batchId: string;
  sessionId: string;
  sourceRevisionId: string;
  status: MutationBatchStatus;
  generatedFromCommentIds: string[];
  tasks: MutationTask[];
  approval: BatchApproval;
  checksum: string;
}

export interface DiffSummary {
  added: number;
  changed: number;
  removed: number;
}

export interface RevisionManifestEntry {
  revisionId: string;
  parentRevisionId: string;
  sessionId: string;
  variantCount: VariantCount;
  baseline: BaselineProvenance;
  appliedBatchId: string;
  appliedTaskIds: string[];
  unresolvedCommentIds: string[];
  diffSummary: DiffSummary;
  createdAt: string;
}

export interface HandoffBundle {
  sessionId: string;
  revisionHeadId: string;
  baseline: BaselineProvenance;
  variantCount: VariantCount;
  storyRefs: string[];
  requirementRefs: string[];
  acceptanceRefs: string[];
  uiSpecRef: string;
  testSpecRef: string;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.StudioSession
 *     type: Entity
 */
export interface StudioSession {
  sessionId: string;
  prompt: string | null;
  variantCount: VariantCount;
  variantLabels: VariantLabel[];
  baseline: BaselineProvenance | null;
  revisionHeadId: string | null;
  selectionGate: GateState;
  applyGate: GateState;
  integration: IntegrationReadiness;
  state: StudioSessionState;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.PrototypeVariant
 *     type: Entity
 */
export interface PrototypeVariant {
  sessionId: string;
  variantLabel: VariantLabel;
  htmlArtifactRef: string;
  componentsUsed: string[];
  rationale: string;
  tradeoffs: string;
  risk: string;
  status: PrototypeVariantStatus;
}

const VARIANT_LABELS: VariantLabel[] = ["A", "B", "C"];
const COMMENT_SEVERITIES: CommentSeverity[] = [
  "blocker",
  "high",
  "medium",
  "low",
];

export function resolveVariantCount(
  requestedVariantCount: number | undefined,
): VariantCount {
  if (requestedVariantCount === undefined) {
    return 3;
  }

  if (
    !Number.isInteger(requestedVariantCount) ||
    requestedVariantCount < 1 ||
    requestedVariantCount > 3
  ) {
    throw createUiPrototypingStudioError(
      "VARIANT_COUNT_OUT_OF_RANGE",
      "Variant count must be between 1 and 3",
      {
        requestedVariantCount,
      },
    );
  }

  return requestedVariantCount as VariantCount;
}

export function buildVariantLabels(variantCount: VariantCount): VariantLabel[] {
  return VARIANT_LABELS.slice(0, variantCount);
}

export function parseCommentSeverity(rawValue: string): CommentSeverity {
  const normalized = rawValue.trim().toLowerCase();
  if (
    normalized !== "blocker" &&
    normalized !== "high" &&
    normalized !== "medium" &&
    normalized !== "low"
  ) {
    throw createUiPrototypingStudioError(
      "COMMENT_SCHEMA_INVALID",
      "Comment severity is invalid",
      {
        severity: rawValue,
        allowedValues: COMMENT_SEVERITIES,
      },
    );
  }

  return normalized;
}
