export type AgentExecutionOrchestratorErrorCode =
  | "ROUTE_STAGE_SELECTION_INVALID"
  | "PROMPT_BUILD_INPUTS_REQUIRED"
  | "PROMPT_STAGE_INPUT_MISSING"
  | "PROMPT_STAGE_RUN_ID_MISSING"
  | "PROMPT_STAGE_HANDOFF_MISSING"
  | "PROMPT_STAGE_HANDOFF_MISMATCH"
  | "PROMPT_ARTIFACT_SET_INVALID"
  | "STAGE_HANDOFF_INPUT_UNRESOLVED"
  | "STAGE_HANDOFF_TOPOLOGY_MISMATCH"
  | "PROVIDER_UNAVAILABLE"
  | "TERMINAL_OUTCOME_MISSING";

export type AgentExecutionOrchestratorError = Error & {
  code: AgentExecutionOrchestratorErrorCode;
  details: Record<string, unknown>;
};

export function createAgentExecutionOrchestratorError(
  code: AgentExecutionOrchestratorErrorCode,
  message: string,
  details: Record<string, unknown> = {},
): AgentExecutionOrchestratorError {
  const error = new Error(message) as AgentExecutionOrchestratorError;
  error.name = "AgentExecutionOrchestratorError";
  error.code = code;
  error.details = details;
  return error;
}

export function isAgentExecutionOrchestratorError(
  value: unknown,
): value is AgentExecutionOrchestratorError {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AgentExecutionOrchestratorError>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.code === "string" &&
    typeof candidate.details === "object"
  );
}
