import type {
  DefinitionAnchorResolverPort,
  ExplorationSessionStorePort,
} from "./ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type { AspectKind, DefinitionPointer } from "../domain/models.js";
import type { ProjectionScope } from "../domain/models.js";
import type { GetDefinitionPointerQuery } from "./get-definition-pointer.js";

export interface OpenDefinitionCommand {
  projectKey: string;
  featureId: string;
  sessionId: string;
  conceptId: string;
  scope: ProjectionScope;
  aspectHint?: AspectKind;
}

export interface OpenDefinitionResult {
  pointer: DefinitionPointer;
  target: string;
  openedAt: string;
}

export type OpenDefinitionUseCase = (
  command: OpenDefinitionCommand,
) => OpenDefinitionResult;

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.OpenDefinition
 *     type: Operation
 *   edges:
 *     - edge: produces
 *       to: knowledge-graph-visualization.DefinitionOpened
 */
export function makeOpenDefinitionUseCase(dependencies: {
  getDefinitionPointer: GetDefinitionPointerQuery;
  sessionStore: ExplorationSessionStorePort;
  anchorResolver: DefinitionAnchorResolverPort;
}): OpenDefinitionUseCase {
  const { getDefinitionPointer, sessionStore, anchorResolver } = dependencies;

  return function openDefinition(
    command: OpenDefinitionCommand,
  ): OpenDefinitionResult {
    const scopedSession = sessionStore.getSession({
      projectKey: command.projectKey,
      featureId: command.featureId,
      sessionId: command.sessionId,
    });

    if (!scopedSession) {
      const sessionById = sessionStore.getSessionById(command.sessionId);
      if (
        sessionById &&
        (sessionById.projectKey !== command.projectKey ||
          sessionById.featureId !== command.featureId)
      ) {
        throw createKnowledgeGraphError(
          "DEFINITION_SCOPE_MISMATCH",
          "Definition request scope does not match session scope",
          {
            sessionId: command.sessionId,
            expectedProjectKey: sessionById.projectKey,
            expectedFeatureId: sessionById.featureId,
            receivedProjectKey: command.projectKey,
            receivedFeatureId: command.featureId,
          },
        );
      }

      throw createKnowledgeGraphError(
        "DEFINITION_SESSION_MISMATCH",
        "Session focus does not match requested concept",
        {
          projectKey: command.projectKey,
          featureId: command.featureId,
          sessionId: command.sessionId,
          selectedConceptId: null,
          requestedConceptId: command.conceptId,
        },
      );
    }

    if (scopedSession.selectedConceptId !== command.conceptId) {
      throw createKnowledgeGraphError(
        "DEFINITION_SESSION_MISMATCH",
        "Session focus does not match requested concept",
        {
          projectKey: command.projectKey,
          featureId: command.featureId,
          sessionId: command.sessionId,
          selectedConceptId: scopedSession.selectedConceptId,
          requestedConceptId: command.conceptId,
        },
      );
    }

    const pointer = getDefinitionPointer({
      projectKey: command.projectKey,
      featureId: command.featureId,
      conceptId: command.conceptId,
      aspectHint: command.aspectHint,
      preferExactAnchor: true,
    });

    const resolution = anchorResolver.resolvePointer({
      scope: command.scope,
      pointer,
    });

    if (!resolution.fileExists) {
      throw createKnowledgeGraphError(
        "DEFINITION_POINTER_NOT_FOUND",
        "Definition pointer file does not exist",
        {
          projectKey: command.projectKey,
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
          projectKey: command.projectKey,
          featureId: command.featureId,
          conceptId: command.conceptId,
          filePath: pointer.filePath,
          anchor: pointer.anchor,
        },
      );
    }

    const target = `${pointer.filePath}#${pointer.anchor}`;
    sessionStore.setLastDefinitionTarget({
      projectKey: command.projectKey,
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
