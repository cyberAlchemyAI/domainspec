import { buildPromptArtifacts } from "./build-prompt-artifacts.js";
import type {
  BuildPromptArtifactsInput,
  BuildPromptArtifactsOutput,
  PromptArtifact,
} from "../domain/models.js";

export function renderPromptContext(
  input: BuildPromptArtifactsInput,
  output: BuildPromptArtifactsOutput = buildPromptArtifacts(input),
): string {
  const lines: string[] = [
    "# Agent Execution Orchestrator Prompt Context",
    `pipelineId: ${input.pipelineId}`,
    `templateId: ${input.templateId}`,
    `selectionPolicy: ${input.selectionPolicy}`,
    `buildOrder: ${output.buildOrder.join(" -> ")}`,
    `promptArtifactSetHash: ${output.promptArtifactSetHash}`,
    `decisionSnapshotRef: ${input.decisionSnapshotRef}`,
    "",
    "## Stage Prompt Artifacts",
  ];

  for (const [index, promptArtifact] of output.promptArtifacts.entries()) {
    lines.push(...renderPromptArtifact(index, promptArtifact));
  }

  return `${lines.join("\n")}\n`;
}

function renderPromptArtifact(
  index: number,
  promptArtifact: PromptArtifact,
): string[] {
  const lines: string[] = [
    `### ${index + 1}. ${promptArtifact.stage}`,
    `stageRunId: ${promptArtifact.stageRunId}`,
    `createdAt: ${promptArtifact.createdAt}`,
    "stageInputRefs:",
  ];

  for (const ref of promptArtifact.stageInputRefs) {
    lines.push(`- ${ref}`);
  }

  lines.push("requiredArtifactRefs:");
  for (const ref of promptArtifact.requiredArtifactRefs) {
    lines.push(`- ${ref}`);
  }

  lines.push("");
  return lines;
}
