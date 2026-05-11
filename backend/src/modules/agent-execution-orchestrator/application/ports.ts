import type {
  PromptArtifact,
  StageIsolationMode,
  TerminalOutcome,
} from "../domain/models.js";

export interface StageExecutionResult {
  stageRunId: string;
  terminalOutcome: TerminalOutcome | null;
  childRunId?: string;
}
export interface SandboxProviderPort {
  executeStage(input: {
    runId: string;
    parentRunId?: string;
    stagePromptArtifact: PromptArtifact;
    isolationMode: StageIsolationMode;
    executionProfile: string;
  }): StageExecutionResult;
}
