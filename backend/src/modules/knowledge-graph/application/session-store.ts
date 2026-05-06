import type { ExplorationSessionStorePort } from "./ports.js";
import type { ExplorationSession } from "../domain/models.js";

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ExplorationSession
 *     type: Entity
 */
export function createInMemoryExplorationSessionStore(): ExplorationSessionStorePort {
  const sessions = new Map<string, ExplorationSession>();

  return {
    setSelectedConcept(input) {
      const existing = sessions.get(
        key(input.projectKey, input.featureId, input.sessionId),
      );
      const updated: ExplorationSession = {
        sessionId: input.sessionId,
        projectKey: input.projectKey,
        featureId: input.featureId,
        selectedConceptId: input.conceptId,
        selectedSource: input.source,
        lastDefinitionTarget: existing?.lastDefinitionTarget ?? null,
      };

      sessions.set(
        key(input.projectKey, input.featureId, input.sessionId),
        updated,
      );
      return updated;
    },

    getSession(input) {
      return (
        sessions.get(key(input.projectKey, input.featureId, input.sessionId)) ??
        null
      );
    },

    getSessionById(sessionId) {
      for (const session of sessions.values()) {
        if (session.sessionId === sessionId) {
          return session;
        }
      }

      return null;
    },

    setLastDefinitionTarget(input) {
      const existing = sessions.get(
        key(input.projectKey, input.featureId, input.sessionId),
      );
      const updated: ExplorationSession = {
        sessionId: input.sessionId,
        projectKey: input.projectKey,
        featureId: input.featureId,
        selectedConceptId: existing?.selectedConceptId ?? "",
        selectedSource: existing?.selectedSource ?? "graph",
        lastDefinitionTarget: input.target,
      };

      sessions.set(
        key(input.projectKey, input.featureId, input.sessionId),
        updated,
      );
      return updated;
    },
  };
}

function key(projectKey: string, featureId: string, sessionId: string): string {
  return `${projectKey}::${featureId}::${sessionId}`;
}
