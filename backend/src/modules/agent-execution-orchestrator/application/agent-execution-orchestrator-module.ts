import { buildPromptArtifacts } from "./build-prompt-artifacts.js";
import { makeExecutePipelineRouteUseCase } from "./execute-pipeline-route.js";
import { renderPromptContext } from "./render-prompt-context.js";
import type {
  BuildPromptArtifactsInput,
  ExecutePipelineRouteInput,
  ExecutePipelineRouteOutput,
  GovernanceSignalEmission,
  TelemetryEnvelope,
} from "../domain/models.js";
import type { SandboxProviderPort } from "./ports.js";

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.RouteArtifactInterface
 *     type: Interface
 *   edges:
 *     - edge: exposes
 *       to: agent-execution-orchestrator.AssemblePipelineRoute
 *       evidence: "Module boundary exposes route assembly artifact builder"
 */
export function createAgentExecutionOrchestratorModule(
  provider: SandboxProviderPort,
) {
  return {
    buildPromptArtifacts: assemblePipelineRoute,
    renderPromptContext: renderRoutePromptContext,
    executePipelineRoute: exposeSandboxProviderInterface(provider),
  };
}

function assemblePipelineRoute(input: BuildPromptArtifactsInput) {
  return buildPromptArtifacts(input);
}

function renderRoutePromptContext(input: BuildPromptArtifactsInput) {
  return renderPromptContext(input);
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.SandboxProviderInterface
 *     type: Interface
 *   edges:
 *     - edge: exposes
 *       to: agent-execution-orchestrator.ExecutePipelineRoute
 *       evidence: "Provider boundary exposes the execute route use case"
 */
function exposeSandboxProviderInterface(provider: SandboxProviderPort) {
  return makeExecutePipelineRouteUseCase(provider);
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow
 *     type: Workflow
 *   edges:
 *     - edge: orchestrates
 *       to: agent-execution-orchestrator.ExecutePipelineRoute
 *       evidence: "Lifecycle workflow invokes route execution for selected stages"
 *     - edge: orchestrates
 *       to: agent-execution-orchestrator.EmitGovernanceSignals
 *       evidence: "Lifecycle workflow emits governance signals after route execution"
 */
function runFeatureLifecyclePipelineWorkflow(
  provider: SandboxProviderPort,
  routeInput: ExecutePipelineRouteInput,
): GovernanceSignalEmission {
  const executePipelineRoute = applyBranchStrategyPolicy(provider);
  const routeOutput = executePipelineRoute(routeInput);
  const parentTerminalOutcome = evaluateRunStateMachine(routeOutput);

  if (parentTerminalOutcome === "canceled") {
    applyCancellationPolicy(routeInput.runId);
  }

  const telemetryEnvelope = mapRunArtifactToTelemetryEnvelope(
    routeInput,
    routeOutput,
    parentTerminalOutcome,
  );
  return emitGovernanceSignals(telemetryEnvelope);
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.RunStateMachine
 *     type: State Machine
 *   edges:
 *     - edge: enforces
 *       to: agent-execution-orchestrator.ExecutePipelineRoute
 *       evidence: "Parent terminal outcome is derived from ordered stage execution results"
 */
function evaluateRunStateMachine(
  routeOutput: ExecutePipelineRouteOutput,
): ExecutePipelineRouteOutput["parentTerminalOutcome"] {
  return routeOutput.parentTerminalOutcome;
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.BranchStrategyPolicy
 *     type: Policy
 *   edges:
 *     - edge: applies
 *       to: agent-execution-orchestrator.ExecutePipelineRoute
 *       evidence: "Branch strategy selects and applies execute route behavior"
 */
function applyBranchStrategyPolicy(provider: SandboxProviderPort) {
  return makeExecutePipelineRouteUseCase(provider);
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.CancellationPolicy
 *     type: Policy
 *   edges:
 *     - edge: applies
 *       to: agent-execution-orchestrator.CancelSupersededRun
 *       evidence: "Latest-run-wins policy routes superseded runs into cancellation"
 */
function applyCancellationPolicy(runId: string) {
  return cancelSupersededRun(runId);
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.CancelSupersededRun
 *     type: Operation
 */
function cancelSupersededRun(runId: string): string {
  return runId;
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.DelegationTelemetryLedgerInterface
 *     type: Interface
 *   edges:
 *     - edge: exposes
 *       to: agent-execution-orchestrator.EmitGovernanceSignals
 *       evidence: "Telemetry ledger boundary exposes governance signal emission"
 */
function createDelegationTelemetryLedgerInterface() {
  return {
    append(telemetryEnvelope: TelemetryEnvelope) {
      return emitGovernanceSignals(telemetryEnvelope);
    },
  };
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.RunArtifactMapping
 *     type: Mapping
 *   edges:
 *     - edge: maps
 *       to: agent-execution-orchestrator.TelemetryEnvelope
 *       evidence: "Route execution output is mapped into telemetry envelope fields"
 */
function mapRunArtifactToTelemetryEnvelope(
  routeInput: ExecutePipelineRouteInput,
  routeOutput: ExecutePipelineRouteOutput,
  parentTerminalOutcome: ExecutePipelineRouteOutput["parentTerminalOutcome"],
): TelemetryEnvelope {
  const lastStageExecution =
    routeOutput.stageExecutions[routeOutput.stageExecutions.length - 1];

  return {
    runId: routeInput.runId,
    stageRunId: lastStageExecution?.stageRunId ?? routeInput.runId,
    parentTerminalOutcome,
    emittedAt: "1970-01-01T00:00:00Z",
  };
}

/**
 * domainspec:
 *   concept:
 *     id: agent-execution-orchestrator.EmitGovernanceSignals
 *     type: Operation
 *   edges:
 *     - edge: produces
 *       to: agent-execution-orchestrator.GovernanceSignalEmission
 *       evidence: "Telemetry envelope emission produces governance observer signals"
 */
function emitGovernanceSignals(
  telemetryEnvelope: TelemetryEnvelope,
): GovernanceSignalEmission {
  return {
    stageRunId: telemetryEnvelope.stageRunId,
    terminalOutcome: telemetryEnvelope.parentTerminalOutcome,
    emittedAt: telemetryEnvelope.emittedAt,
  };
}
