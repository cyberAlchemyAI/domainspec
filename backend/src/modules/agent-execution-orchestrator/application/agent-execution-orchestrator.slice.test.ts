import assert from "node:assert/strict";
import test from "node:test";

import { isAgentExecutionOrchestratorError } from "../domain/errors.js";
import type {
  BuildPromptArtifactsInput,
  PromptArtifact,
  StageContract,
} from "../domain/models.js";
import { createAgentExecutionOrchestratorModule } from "./agent-execution-orchestrator-module.js";
import { buildPromptArtifacts } from "./build-prompt-artifacts.js";
import { makeExecutePipelineRouteUseCase } from "./execute-pipeline-route.js";
import type { SandboxProviderPort } from "./ports.js";

const STAGE_CONTRACTS: StageContract[] = [
  {
    stage: "spec",
    isolationMode: "shared-run",
    requiredArtifacts: [
      "docs/features/agent-execution-orchestrator/SPEC.md#concept-registry",
    ],
  },
  {
    stage: "tests",
    isolationMode: "shared-run",
    requiredArtifacts: [
      "docs/features/agent-execution-orchestrator/TEST-SPEC.md",
    ],
  },
  {
    stage: "implementation",
    isolationMode: "shared-run",
    requiredArtifacts: ["docs/signals/delegation-tuning.jsonl"],
  },
];

test("AEO-C1-02 buildPromptArtifacts returns ordered stage prompt artifacts keyed by stageRunId", () => {
  const input = createBuildPromptArtifactsInput();

  const output = buildPromptArtifacts(input);

  assert.deepEqual(output.buildOrder, ["spec", "tests", "implementation"]);
  assert.deepEqual(
    output.promptArtifacts.map((artifact) => artifact.stageRunId),
    ["aeo-c1-spec-0001", "aeo-c1-tests-0001", "aeo-c1-implementation-0001"],
  );

  const stageRunIdKeys = Object.keys(output.promptArtifactsByStageRunId).sort();
  assert.deepEqual(stageRunIdKeys, [
    "aeo-c1-implementation-0001",
    "aeo-c1-spec-0001",
    "aeo-c1-tests-0001",
  ]);

  const firstArtifact = output.promptArtifacts[0];
  assert.ok(firstArtifact);
  assert.deepEqual(firstArtifact.stageInputRefs, [
    "docs/features/agent-execution-orchestrator/SPEC.md#concept-registry",
    "docs/features/agent-execution-orchestrator/workflows.md#featurelifecyclepipelineworkflow",
  ]);
  assert.deepEqual(firstArtifact.requiredArtifactRefs, [
    "docs/features/agent-execution-orchestrator/SPEC.md#concept-registry",
  ]);

  const repeatedOutput = buildPromptArtifacts(cloneInput(input));
  assert.equal(
    output.promptArtifactSetHash,
    repeatedOutput.promptArtifactSetHash,
  );
});

test("AEO-C1-02 buildPromptArtifacts rejects selected stage without stageRunId", () => {
  const input = createBuildPromptArtifactsInput();
  delete input.stageRunIdsByStage.tests;

  assert.throws(
    () => buildPromptArtifacts(input),
    (error) => {
      assert.ok(isAgentExecutionOrchestratorError(error));
      assert.equal(error.code, "PROMPT_STAGE_RUN_ID_MISSING");
      return true;
    },
  );
});

test("AEO-C1-03 ExecutePipelineRoute consumes pipeline-built prompt artifacts in stage order", () => {
  const input = createBuildPromptArtifactsInput();
  const buildOutput = buildPromptArtifacts(input);

  const consumedPromptArtifacts: PromptArtifact[] = [];
  const provider: SandboxProviderPort = {
    executeStage({ stagePromptArtifact }) {
      consumedPromptArtifacts.push(stagePromptArtifact);
      return {
        stageRunId: stagePromptArtifact.stageRunId,
        terminalOutcome:
          stagePromptArtifact.stage === "tests" ? "blocked" : "completed",
      };
    },
  };

  const executePipelineRoute = makeExecutePipelineRouteUseCase(provider);
  const execution = executePipelineRoute({
    runId: "aeo-c1-parent-0001",
    pipelineId: input.pipelineId,
    templateId: input.templateId,
    provider: "sandcastle",
    executionProfile: "standard",
    stageContracts: input.stageContracts,
    selectedStages: input.selectedStages,
    stagePromptArtifacts: buildOutput.promptArtifacts,
    stageInputs: {
      stageInputRefsByStage: input.stageInputRefsByStage,
      requiredArtifactRefsByStage: input.requiredArtifactRefsByStage,
      handoffArtifactRefsByStagePair: input.handoffArtifactRefsByStagePair,
    },
  });

  assert.deepEqual(
    consumedPromptArtifacts.map((artifact) => artifact.stageRunId),
    buildOutput.promptArtifacts.map((artifact) => artifact.stageRunId),
  );
  assert.deepEqual(
    execution.stageExecutions.map(
      (stageExecution) => stageExecution.stageRunId,
    ),
    buildOutput.promptArtifacts.map((artifact) => artifact.stageRunId),
  );
  assert.equal(execution.parentRunState, "blocked");
  assert.equal(execution.parentTerminalOutcome, "blocked");
  assert.equal(
    execution.terminalOutcomeByStageRunId["aeo-c1-tests-0001"],
    "blocked",
  );
});

test("AEO-C1-03 ExecutePipelineRoute rejects ad-hoc prompt artifact order mismatch", () => {
  const input = createBuildPromptArtifactsInput();
  const buildOutput = buildPromptArtifacts(input);

  const first = buildOutput.promptArtifacts[0];
  const second = buildOutput.promptArtifacts[1];
  const third = buildOutput.promptArtifacts[2];
  assert.ok(first);
  assert.ok(second);
  assert.ok(third);

  const executePipelineRoute = makeExecutePipelineRouteUseCase({
    executeStage({ stagePromptArtifact }) {
      return {
        stageRunId: stagePromptArtifact.stageRunId,
        terminalOutcome: "completed",
      };
    },
  });

  assert.throws(
    () =>
      executePipelineRoute({
        runId: "aeo-c1-parent-0002",
        pipelineId: input.pipelineId,
        templateId: input.templateId,
        provider: "sandcastle",
        executionProfile: "standard",
        stageContracts: input.stageContracts,
        selectedStages: input.selectedStages,
        stagePromptArtifacts: [second, first, third],
        stageInputs: {
          stageInputRefsByStage: input.stageInputRefsByStage,
          requiredArtifactRefsByStage: input.requiredArtifactRefsByStage,
          handoffArtifactRefsByStagePair: input.handoffArtifactRefsByStagePair,
        },
      }),
    (error) => {
      assert.ok(isAgentExecutionOrchestratorError(error));
      assert.equal(error.code, "PROMPT_ARTIFACT_SET_INVALID");
      return true;
    },
  );
});

test("AEO-C2-01 module renders base pipeline prompt context with stage prompt sections", () => {
  const input = createBuildPromptArtifactsInput();
  const module = createAgentExecutionOrchestratorModule({
    executeStage({ stagePromptArtifact }) {
      return {
        stageRunId: stagePromptArtifact.stageRunId,
        terminalOutcome: "completed",
      };
    },
  });

  const renderedPrompt = module.renderPromptContext(input);

  assert.match(renderedPrompt, /# Agent Execution Orchestrator Prompt Context/);
  assert.match(renderedPrompt, /buildOrder: spec -> tests -> implementation/);
  assert.match(renderedPrompt, /### 1\. spec/);
  assert.match(renderedPrompt, /### 2\. tests/);
  assert.match(renderedPrompt, /### 3\. implementation/);
  assert.match(renderedPrompt, /stageRunId: aeo-c1-tests-0001/);
  assert.match(renderedPrompt, /promptArtifactSetHash: [0-9a-f]{64}/);
});

function createBuildPromptArtifactsInput(): BuildPromptArtifactsInput {
  return {
    pipelineId: "agent-execution-orchestrator",
    templateId: "route-template-v1",
    selectionPolicy: "stage-subset",
    selectedStages: ["spec", "tests", "implementation"],
    stageContracts: STAGE_CONTRACTS,
    stageInputRefsByStage: {
      spec: [
        "docs/features/agent-execution-orchestrator/workflows.md#featurelifecyclepipelineworkflow",
        "docs/features/agent-execution-orchestrator/SPEC.md#concept-registry",
      ],
      tests: [
        "docs/features/agent-execution-orchestrator/TEST-SPEC.md",
        "docs/features/agent-execution-orchestrator/operations.md#executepipelineroute",
      ],
      implementation: [
        "docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-C1-03.md",
      ],
    },
    requiredArtifactRefsByStage: {
      spec: [
        "docs/features/agent-execution-orchestrator/SPEC.md#concept-registry",
      ],
      tests: ["docs/features/agent-execution-orchestrator/TEST-SPEC.md"],
      implementation: ["docs/signals/delegation-tuning.jsonl"],
    },
    stageRunIdsByStage: {
      spec: "aeo-c1-spec-0001",
      tests: "aeo-c1-tests-0001",
      implementation: "aeo-c1-implementation-0001",
    },
    handoffArtifactRefsByStagePair: {
      "spec->tests": [
        "docs/features/agent-execution-orchestrator/TEST-SPEC.md",
      ],
      "tests->implementation": ["docs/signals/delegation-tuning.jsonl"],
    },
    decisionSnapshotRef:
      "docs/features/agent-execution-orchestrator/WORK-PACK.md#resolved-decision-gate",
    createdAtByStage: {
      spec: "2026-05-11T00:00:00Z",
      tests: "2026-05-11T00:01:00Z",
      implementation: "2026-05-11T00:02:00Z",
    },
    promptVersion: "1.0.0",
  };
}

function cloneInput(
  input: BuildPromptArtifactsInput,
): BuildPromptArtifactsInput {
  return {
    pipelineId: input.pipelineId,
    templateId: input.templateId,
    selectionPolicy: input.selectionPolicy,
    selectedStages: [...input.selectedStages],
    stageContracts: input.stageContracts.map((contract) => ({
      stage: contract.stage,
      isolationMode: contract.isolationMode,
      requiredArtifacts: [...contract.requiredArtifacts],
    })),
    stageInputRefsByStage: cloneStageMap(input.stageInputRefsByStage),
    requiredArtifactRefsByStage: cloneStageMap(
      input.requiredArtifactRefsByStage,
    ),
    stageRunIdsByStage: { ...input.stageRunIdsByStage },
    handoffArtifactRefsByStagePair: Object.fromEntries(
      Object.entries(input.handoffArtifactRefsByStagePair).map(
        ([key, refs]) => [key, [...refs]],
      ),
    ),
    decisionSnapshotRef: input.decisionSnapshotRef,
    createdAtByStage: { ...input.createdAtByStage },
    promptVersion: input.promptVersion,
  };
}

function cloneStageMap(
  map: BuildPromptArtifactsInput["stageInputRefsByStage"],
): BuildPromptArtifactsInput["stageInputRefsByStage"] {
  const clone: BuildPromptArtifactsInput["stageInputRefsByStage"] = {};
  for (const [stage, refs] of Object.entries(map)) {
    clone[stage as keyof typeof clone] = [...refs];
  }

  return clone;
}
