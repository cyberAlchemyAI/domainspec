export const STAGE_TYPES = [
  "plan",
  "architecture-baseline",
  "discovery",
  "spec",
  "stories",
  "tests",
  "implementation",
  "observability",
  "audits",
  "verify",
] as const;

export type StageType = (typeof STAGE_TYPES)[number];

export type StageIsolationMode = "shared-run" | "isolated-child-run";

export type SelectionPolicy = "full-lifecycle" | "stage-subset";

export type RunState =
  | "queued"
  | "running"
  | "waiting-retry"
  | "resuming"
  | "completed"
  | "blocked"
  | "failed"
  | "canceled";

export type TerminalOutcome = "completed" | "blocked" | "failed" | "canceled";

export type TerminalRunState = Extract<
  RunState,
  "completed" | "blocked" | "failed" | "canceled"
>;

export type ProviderAdapter = "sandcastle" | "custom";

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.StageContract
 *     type: Value Object
 */
export interface StageContract {
  stage: StageType;
  isolationMode: StageIsolationMode;
  requiredArtifacts: string[];
}

export interface PromptArtifact {
  promptVersion: string;
  pipelineId: string;
  templateId: string;
  stageRunId: string;
  stage: StageType;
  stageInputRefs: string[];
  requiredArtifactRefs: string[];
  decisionSnapshotRef: string;
  transcriptExcerptRef?: string;
  createdAt: string;
}

export type StageRefsByStage = Partial<Record<StageType, string[]>>;
export type StageRunIdByStage = Partial<Record<StageType, string>>;
export type CreatedAtByStage = Partial<Record<StageType, string>>;

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.PipelineRouteTemplate
 *     type: Entity
 *   edges:
 *     - edge: contains
 *       to: agent-execution-orchestrator.StageContract
 *       evidence: "Route template carries ordered stage contract entries"
 */
export interface BuildPromptArtifactsInput {
  pipelineId: string;
  templateId: string;
  selectionPolicy: SelectionPolicy;
  selectedStages: StageType[];
  stageContracts: StageContract[];
  stageInputRefsByStage: StageRefsByStage;
  requiredArtifactRefsByStage: StageRefsByStage;
  stageRunIdsByStage: StageRunIdByStage;
  handoffArtifactRefsByStagePair: Record<string, string[]>;
  decisionSnapshotRef: string;
  createdAtByStage: CreatedAtByStage;
  promptVersion?: string;
}

export interface BuildPromptArtifactsOutput {
  promptArtifacts: PromptArtifact[];
  promptArtifactsByStageRunId: Record<string, PromptArtifact>;
  buildOrder: StageType[];
  promptArtifactSetHash: string;
}

export interface StageInputs {
  stageInputRefsByStage: StageRefsByStage;
  requiredArtifactRefsByStage: StageRefsByStage;
  handoffArtifactRefsByStagePair: Record<string, string[]>;
}

export interface ExecutePipelineRouteInput {
  runId: string;
  parentRunId?: string;
  pipelineId: string;
  templateId: string;
  provider: ProviderAdapter;
  executionProfile: string;
  stageContracts: StageContract[];
  selectedStages: StageType[];
  stagePromptArtifacts: PromptArtifact[];
  stageInputs: StageInputs;
}

export interface StageExecution {
  stageRunId: string;
  stage: StageType;
  order: number;
  isolationMode: StageIsolationMode;
  childRunId?: string;
  state: TerminalRunState;
  terminalOutcome: TerminalOutcome;
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.TelemetryEnvelope
 *     type: Value Object
 */
export interface TelemetryEnvelope {
  runId: string;
  stageRunId: string;
  parentTerminalOutcome: TerminalOutcome;
  emittedAt: string;
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.GovernanceSignalEmission
 *     type: Event
 */
export interface GovernanceSignalEmission {
  stageRunId: string;
  terminalOutcome: TerminalOutcome;
  emittedAt: string;
}

export interface ExecutePipelineRouteOutput {
  stageExecutions: StageExecution[];
  terminalOutcomeByStageRunId: Record<string, TerminalOutcome>;
  parentRunState: TerminalRunState;
  parentTerminalOutcome: TerminalOutcome;
  childRunIdsByStageRunId?: Record<string, string>;
}
