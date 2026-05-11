import { createAgentExecutionOrchestratorError } from "../domain/errors.js";
import type {
  ExecutePipelineRouteInput,
  ExecutePipelineRouteOutput,
  StageExecution,
  StageType,
  TerminalOutcome,
} from "../domain/models.js";
import type { SandboxProviderPort } from "./ports.js";

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.ExecutePipelineRoute
 *     type: Operation
 */
export function makeExecutePipelineRouteUseCase(provider: SandboxProviderPort) {
  return function executePipelineRoute(
    input: ExecutePipelineRouteInput,
  ): ExecutePipelineRouteOutput {
    validateExecuteInput(input);
    validatePromptArtifactOrder(input);
    validateConsecutiveHandoffs(input);

    const stageContractByStage = new Map(
      input.stageContracts.map(
        (contract) => [contract.stage, contract] as const,
      ),
    );

    const stageExecutions: StageExecution[] = [];
    const terminalOutcomeByStageRunId: Record<string, TerminalOutcome> = {};
    const childRunIdsByStageRunId: Record<string, string> = {};

    for (const [
      order,
      promptArtifact,
    ] of input.stagePromptArtifacts.entries()) {
      const contract = stageContractByStage.get(promptArtifact.stage);
      if (!contract) {
        throw createAgentExecutionOrchestratorError(
          "PROMPT_ARTIFACT_SET_INVALID",
          "Prompt artifact stage is not declared by stage contracts",
          {
            stage: promptArtifact.stage,
          },
        );
      }

      const stageInputRefs =
        input.stageInputs.stageInputRefsByStage[promptArtifact.stage];
      if (!Array.isArray(stageInputRefs) || stageInputRefs.length === 0) {
        throw createAgentExecutionOrchestratorError(
          "PROMPT_STAGE_INPUT_MISSING",
          "Execution stage is missing stage input refs",
          {
            stage: promptArtifact.stage,
          },
        );
      }

      const requiredArtifactRefs =
        input.stageInputs.requiredArtifactRefsByStage[promptArtifact.stage];
      if (
        !Array.isArray(requiredArtifactRefs) ||
        requiredArtifactRefs.length === 0
      ) {
        throw createAgentExecutionOrchestratorError(
          "PROMPT_STAGE_INPUT_MISSING",
          "Execution stage is missing required artifact refs",
          {
            stage: promptArtifact.stage,
          },
        );
      }

      let executionResult;
      try {
        executionResult = provider.executeStage({
          runId: input.runId,
          parentRunId: input.parentRunId,
          stagePromptArtifact: promptArtifact,
          isolationMode: contract.isolationMode,
          executionProfile: input.executionProfile,
        });
      } catch (error) {
        throw createAgentExecutionOrchestratorError(
          "PROVIDER_UNAVAILABLE",
          "Provider execution failed",
          {
            stage: promptArtifact.stage,
            reason: error instanceof Error ? error.message : String(error),
          },
        );
      }

      if (executionResult.stageRunId !== promptArtifact.stageRunId) {
        throw createAgentExecutionOrchestratorError(
          "STAGE_HANDOFF_TOPOLOGY_MISMATCH",
          "Provider returned stageRunId that does not match prompt artifact",
          {
            expectedStageRunId: promptArtifact.stageRunId,
            actualStageRunId: executionResult.stageRunId,
          },
        );
      }

      if (!executionResult.terminalOutcome) {
        throw createAgentExecutionOrchestratorError(
          "TERMINAL_OUTCOME_MISSING",
          "Provider returned no terminal outcome for started stage run",
          {
            stageRunId: promptArtifact.stageRunId,
          },
        );
      }

      const stageExecution: StageExecution = {
        stageRunId: promptArtifact.stageRunId,
        stage: promptArtifact.stage,
        order,
        isolationMode: contract.isolationMode,
        childRunId: executionResult.childRunId,
        state: executionResult.terminalOutcome,
        terminalOutcome: executionResult.terminalOutcome,
      };

      stageExecutions.push(stageExecution);
      terminalOutcomeByStageRunId[promptArtifact.stageRunId] =
        executionResult.terminalOutcome;

      if (executionResult.childRunId) {
        childRunIdsByStageRunId[promptArtifact.stageRunId] =
          executionResult.childRunId;
      }
    }

    const parentTerminalOutcome = reduceParentTerminalOutcome(stageExecutions);

    return {
      stageExecutions,
      terminalOutcomeByStageRunId,
      parentRunState: parentTerminalOutcome,
      parentTerminalOutcome,
      childRunIdsByStageRunId:
        Object.keys(childRunIdsByStageRunId).length > 0
          ? childRunIdsByStageRunId
          : undefined,
    };
  };
}

function validateExecuteInput(input: ExecutePipelineRouteInput): void {
  if (input.provider !== "sandcastle" && input.provider !== "custom") {
    throw createAgentExecutionOrchestratorError(
      "PROVIDER_UNAVAILABLE",
      "Provider adapter is not supported",
      {
        provider: input.provider,
      },
    );
  }

  if (input.selectedStages.length === 0) {
    throw createAgentExecutionOrchestratorError(
      "ROUTE_STAGE_SELECTION_INVALID",
      "Selected stages must be non-empty",
    );
  }

  if (new Set(input.selectedStages).size !== input.selectedStages.length) {
    throw createAgentExecutionOrchestratorError(
      "ROUTE_STAGE_SELECTION_INVALID",
      "Selected stages must be distinct",
      {
        selectedStages: input.selectedStages,
      },
    );
  }
}

function validatePromptArtifactOrder(input: ExecutePipelineRouteInput): void {
  if (input.stagePromptArtifacts.length !== input.selectedStages.length) {
    throw createAgentExecutionOrchestratorError(
      "PROMPT_ARTIFACT_SET_INVALID",
      "Prompt artifact count does not match selected stages",
      {
        expectedCount: input.selectedStages.length,
        actualCount: input.stagePromptArtifacts.length,
      },
    );
  }

  const stageOrder = new Map<StageType, number>();
  for (const [index, contract] of input.stageContracts.entries()) {
    if (stageOrder.has(contract.stage)) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "Stage contracts must be unique by stage",
        { stage: contract.stage },
      );
    }

    stageOrder.set(contract.stage, index);
  }

  const usedStageRunIds = new Set<string>();
  let previousOrder = -1;

  for (const [index, stage] of input.selectedStages.entries()) {
    const promptArtifact = input.stagePromptArtifacts[index];
    if (!promptArtifact) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_ARTIFACT_SET_INVALID",
        "Prompt artifact is missing at selected stage index",
        {
          index,
          stage,
        },
      );
    }

    if (promptArtifact.stage !== stage) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_ARTIFACT_SET_INVALID",
        "Prompt artifact stage order does not match selected stages",
        {
          index,
          expectedStage: stage,
          actualStage: promptArtifact.stage,
        },
      );
    }

    if (usedStageRunIds.has(promptArtifact.stageRunId)) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_ARTIFACT_SET_INVALID",
        "Prompt artifact set has duplicate stageRunId",
        {
          stageRunId: promptArtifact.stageRunId,
        },
      );
    }

    usedStageRunIds.add(promptArtifact.stageRunId);

    const templateOrder = stageOrder.get(stage);
    if (templateOrder === undefined) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "Selected stage is missing from stage contracts",
        { stage },
      );
    }

    if (templateOrder < previousOrder) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "Selected stage order does not preserve template order",
        { stage },
      );
    }

    previousOrder = templateOrder;
  }
}

function validateConsecutiveHandoffs(input: ExecutePipelineRouteInput): void {
  if (input.selectedStages.length <= 1) {
    return;
  }

  for (let index = 0; index < input.selectedStages.length - 1; index += 1) {
    const currentStage = input.selectedStages[index];
    const nextStage = input.selectedStages[index + 1];
    if (!currentStage || !nextStage) {
      continue;
    }

    const handoffKey = `${currentStage}->${nextStage}`;
    const handoffRefs =
      input.stageInputs.handoffArtifactRefsByStagePair[handoffKey];

    if (!Array.isArray(handoffRefs) || handoffRefs.length === 0) {
      throw createAgentExecutionOrchestratorError(
        "STAGE_HANDOFF_INPUT_UNRESOLVED",
        "Consecutive stage handoff refs are missing",
        {
          handoffKey,
        },
      );
    }

    const requiredArtifactRefs: string[] =
      input.stageInputs.requiredArtifactRefsByStage[nextStage] ?? [];
    const handoffSet = new Set(handoffRefs);
    const missingRefs = requiredArtifactRefs.filter(
      (requiredRef) => !handoffSet.has(requiredRef),
    );

    if (missingRefs.length > 0) {
      throw createAgentExecutionOrchestratorError(
        "STAGE_HANDOFF_INPUT_UNRESOLVED",
        "Consecutive handoff refs do not satisfy next-stage required refs",
        {
          handoffKey,
          missingRefs,
        },
      );
    }
  }
}

function reduceParentTerminalOutcome(
  stageExecutions: StageExecution[],
): TerminalOutcome {
  if (
    stageExecutions.some(
      (stageExecution) => stageExecution.terminalOutcome === "failed",
    )
  ) {
    return "failed";
  }

  if (
    stageExecutions.some(
      (stageExecution) => stageExecution.terminalOutcome === "blocked",
    )
  ) {
    return "blocked";
  }

  if (
    stageExecutions.some(
      (stageExecution) => stageExecution.terminalOutcome === "canceled",
    )
  ) {
    return "canceled";
  }

  return "completed";
}
