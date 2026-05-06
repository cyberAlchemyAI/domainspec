import type {
  DefinitionAnchorResolverPort,
  ExplorationSessionStorePort,
} from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type { DefinitionPointer } from "../domain/models.js";
import type { GetDefinitionPointerQuery } from "./get-definition-pointer.js";

export interface OpenDefinitionCommand {
  featureId: string;
  sessionId: string;
  conceptId: string;
}

export interface OpenDefinitionResult {
  pointer: DefinitionPointer;
  target: string;
  openedAt: string;
}

export type OpenDefinitionUseCase = (
  command: OpenDefinitionCommand,
) => OpenDefinitionResult;

export function makeOpenDefinitionUseCase(dependencies: {
  getDefinitionPointer: GetDefinitionPointerQuery;
  sessionStore: ExplorationSessionStorePort;
  anchorResolver: DefinitionAnchorResolverPort;
}): OpenDefinitionUseCase {
  const { getDefinitionPointer, sessionStore, anchorResolver } = dependencies;

  return function openDefinition(
    command: OpenDefinitionCommand,
  ): OpenDefinitionResult {
    const session = sessionStore.getSession({
      featureId: command.featureId,
      sessionId: command.sessionId,
    });

    if (!session || session.selectedConceptId !== command.conceptId) {
      throw createKnowledgeGraphError(
        "DEFINITION_SESSION_MISMATCH",
        "Session focus does not match requested concept",
        {
          featureId: command.featureId,
          sessionId: command.sessionId,
          selectedConceptId: session?.selectedConceptId ?? null,
          requestedConceptId: command.conceptId,
        },
      );
    }

    const pointer = getDefinitionPointer({
      featureId: command.featureId,
      conceptId: command.conceptId,
      preferExactAnchor: true,
    });

    const resolution = anchorResolver.resolvePointer({
      featureId: command.featureId,
      pointer,
    });

    if (!resolution.fileExists) {
      throw createKnowledgeGraphError(
        "DEFINITION_POINTER_NOT_FOUND",
        "Definition pointer file does not exist",
        {
          featureId: command.featureId,
          conceptId: command.conceptId,
          filePath: pointer.filePath,
        },
      );
    }

    if (!resolution.anchorExists) {
      throw createKnowledgeGraphError(
        "DEFINITION_ANCHOR_NOT_FOUND",
        "Definition pointer anchor does not exist",
        {
          featureId: command.featureId,
          conceptId: command.conceptId,
          filePath: pointer.filePath,
          anchor: pointer.anchor,
        },
      );
    }

    const target = `${pointer.filePath}#${pointer.anchor}`;
    sessionStore.setLastDefinitionTarget({
      featureId: command.featureId,
      sessionId: command.sessionId,
      target,
    });

    return {
      pointer,
      target,
      openedAt: new Date().toISOString(),
    };
  };
}
