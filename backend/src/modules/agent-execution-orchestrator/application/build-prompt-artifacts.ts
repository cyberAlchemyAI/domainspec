import { createHash } from "node:crypto";

import { createAgentExecutionOrchestratorError } from "../domain/errors.js";
import type {
  BuildPromptArtifactsInput,
  BuildPromptArtifactsOutput,
  PromptArtifact,
  StageRefsByStage,
  StageType,
} from "../domain/models.js";

const DEFAULT_PROMPT_VERSION = "1.0.0";

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.AssemblePipelineRoute
 *     type: Operation
 *   edges:
 *     - edge: enforces
 *       to: agent-execution-orchestrator.StageContract
 *       evidence: "Route assembly validates declared stage contracts before building artifacts"
 */
export function buildPromptArtifacts(
  input: BuildPromptArtifactsInput,
): BuildPromptArtifactsOutput {
  validateBuildInputBundle(input);

  const selectedStages = resolveSelectedStages(input);
  validateOrderedSelection(selectedStages, input.stageContracts);

  const promptArtifacts: PromptArtifact[] = [];
  const promptArtifactsByStageRunId: Record<string, PromptArtifact> = {};

  for (const stage of selectedStages) {
    const stageInputRefs = normalizeRefs(input.stageInputRefsByStage[stage]);
    if (stageInputRefs.length === 0) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_STAGE_INPUT_MISSING",
        "Selected stage is missing stage input refs",
        { stage },
      );
    }

    const requiredArtifactRefs = normalizeRefs(
      input.requiredArtifactRefsByStage[stage],
    );
    if (requiredArtifactRefs.length === 0) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_STAGE_INPUT_MISSING",
        "Selected stage is missing required artifact refs",
        { stage },
      );
    }

    const stageRunId = normalizeString(input.stageRunIdsByStage[stage]);
    if (stageRunId.length === 0) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_STAGE_RUN_ID_MISSING",
        "Selected stage is missing stageRunId",
        { stage },
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        promptArtifactsByStageRunId,
        stageRunId,
      )
    ) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_ARTIFACT_SET_INVALID",
        "Prompt artifact set contains duplicate stageRunId",
        { stageRunId },
      );
    }

    const createdAt = normalizeString(input.createdAtByStage[stage]);
    if (createdAt.length === 0) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_BUILD_INPUTS_REQUIRED",
        "Selected stage is missing createdAt timestamp",
        { stage },
      );
    }

    const promptArtifact: PromptArtifact = {
      promptVersion:
        normalizeString(input.promptVersion) || DEFAULT_PROMPT_VERSION,
      pipelineId: input.pipelineId,
      templateId: input.templateId,
      stageRunId,
      stage,
      stageInputRefs,
      requiredArtifactRefs,
      decisionSnapshotRef: input.decisionSnapshotRef,
      createdAt,
    };

    promptArtifacts.push(promptArtifact);
    promptArtifactsByStageRunId[stageRunId] = promptArtifact;
  }

  validateStageHandoffs(
    selectedStages,
    input.handoffArtifactRefsByStagePair,
    input.requiredArtifactRefsByStage,
  );

  if (promptArtifacts.length !== selectedStages.length) {
    throw createAgentExecutionOrchestratorError(
      "PROMPT_ARTIFACT_SET_INVALID",
      "Prompt artifact set does not match selected stage cardinality",
      {
        expectedCount: selectedStages.length,
        actualCount: promptArtifacts.length,
      },
    );
  }

  return {
    promptArtifacts,
    promptArtifactsByStageRunId,
    buildOrder: selectedStages,
    promptArtifactSetHash: computePromptArtifactSetHash(promptArtifacts),
  };
}

function validateBuildInputBundle(input: BuildPromptArtifactsInput): void {
  if (
    normalizeString(input.pipelineId).length === 0 ||
    normalizeString(input.templateId).length === 0 ||
    normalizeString(input.decisionSnapshotRef).length === 0 ||
    !Array.isArray(input.stageContracts) ||
    input.stageContracts.length === 0
  ) {
    throw createAgentExecutionOrchestratorError(
      "PROMPT_BUILD_INPUTS_REQUIRED",
      "Prompt build input bundle is incomplete",
    );
  }

  if (
    !input.stageInputRefsByStage ||
    !input.requiredArtifactRefsByStage ||
    !input.stageRunIdsByStage ||
    !input.createdAtByStage ||
    !input.handoffArtifactRefsByStagePair
  ) {
    throw createAgentExecutionOrchestratorError(
      "PROMPT_BUILD_INPUTS_REQUIRED",
      "Prompt build input maps are required",
    );
  }
}

function resolveSelectedStages(input: BuildPromptArtifactsInput): StageType[] {
  if (input.selectionPolicy === "full-lifecycle") {
    const templateStages = input.stageContracts.map(
      (contract) => contract.stage,
    );
    if (input.selectedStages.length === 0) {
      return templateStages;
    }

    if (!isSameStageSequence(input.selectedStages, templateStages)) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "full-lifecycle selection must match template stage order",
      );
    }

    return [...input.selectedStages];
  }

  if (
    input.selectedStages.length === 0 ||
    !hasDistinctStages(input.selectedStages)
  ) {
    throw createAgentExecutionOrchestratorError(
      "ROUTE_STAGE_SELECTION_INVALID",
      "stage-subset selection must be non-empty and distinct",
      {
        selectedStages: input.selectedStages,
      },
    );
  }

  return [...input.selectedStages];
}

function validateOrderedSelection(
  selectedStages: StageType[],
  stageContracts: { stage: StageType }[],
): void {
  const stageOrder = new Map<StageType, number>();
  for (const [index, contract] of stageContracts.entries()) {
    if (stageOrder.has(contract.stage)) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "Stage contracts must be unique by stage",
        {
          stage: contract.stage,
        },
      );
    }

    stageOrder.set(contract.stage, index);
  }

  let previousOrder = -1;
  for (const stage of selectedStages) {
    const currentOrder = stageOrder.get(stage);
    if (currentOrder === undefined) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "Selected stage is not declared by stage contracts",
        { stage },
      );
    }

    if (currentOrder < previousOrder) {
      throw createAgentExecutionOrchestratorError(
        "ROUTE_STAGE_SELECTION_INVALID",
        "Selected stage order does not preserve template order",
        { stage },
      );
    }

    previousOrder = currentOrder;
  }
}

function validateStageHandoffs(
  selectedStages: StageType[],
  handoffArtifactRefsByStagePair: Record<string, string[]>,
  requiredArtifactRefsByStage: StageRefsByStage,
): void {
  if (selectedStages.length <= 1) {
    return;
  }

  for (let index = 0; index < selectedStages.length - 1; index += 1) {
    const currentStage = selectedStages[index];
    const nextStage = selectedStages[index + 1];
    if (!currentStage || !nextStage) {
      continue;
    }

    const handoffKey = `${currentStage}->${nextStage}`;

    const handoffRefs = normalizeRefs(
      handoffArtifactRefsByStagePair[handoffKey],
    );
    if (handoffRefs.length === 0) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_STAGE_HANDOFF_MISSING",
        "Consecutive stage handoff refs are missing",
        {
          handoffKey,
        },
      );
    }

    const requiredForNextStage = normalizeRefs(
      requiredArtifactRefsByStage[nextStage],
    );
    const handoffSet = new Set(handoffRefs);
    const missingRefs = requiredForNextStage.filter(
      (requiredRef) => !handoffSet.has(requiredRef),
    );

    if (missingRefs.length > 0) {
      throw createAgentExecutionOrchestratorError(
        "PROMPT_STAGE_HANDOFF_MISMATCH",
        "Consecutive stage handoff refs do not satisfy next-stage required refs",
        {
          handoffKey,
          missingRefs,
        },
      );
    }
  }
}

function normalizeRefs(refs: string[] | undefined): string[] {
  if (!Array.isArray(refs)) {
    return [];
  }

  return [
    ...new Set(refs.map(normalizeString).filter((value) => value.length > 0)),
  ].sort((left, right) => left.localeCompare(right));
}

function normalizeString(value: string | undefined): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function hasDistinctStages(stages: StageType[]): boolean {
  return new Set(stages).size === stages.length;
}

function isSameStageSequence(left: StageType[], right: StageType[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((stage, index) => stage === right[index]);
}

function computePromptArtifactSetHash(
  promptArtifacts: PromptArtifact[],
): string {
  const normalizedArtifacts = promptArtifacts.map((artifact) => ({
    ...artifact,
    stageInputRefs: normalizeRefs(artifact.stageInputRefs),
    requiredArtifactRefs: normalizeRefs(artifact.requiredArtifactRefs),
  }));

  const hashInput = stableStringify(normalizedArtifacts);
  return createHash("sha256").update(hashInput).digest("hex");
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortObjectKeys(value));
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sortObjectKeys(entry));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const sortable = value as Record<string, unknown>;
  const sortedKeys = Object.keys(sortable).sort((left, right) =>
    left.localeCompare(right),
  );

  const normalized: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    normalized[key] = sortObjectKeys(sortable[key]);
  }

  return normalized;
}
