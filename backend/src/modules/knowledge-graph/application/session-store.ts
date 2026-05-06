import type { ExplorationSessionStorePort } from "./ports.js";
import type { ExplorationSession } from "../domain/models.js";

export function createInMemoryExplorationSessionStore(): ExplorationSessionStorePort {
  const sessions = new Map<string, ExplorationSession>();

  return {
    setSelectedConcept(input) {
      const existing = sessions.get(key(input.featureId, input.sessionId));
      const updated: ExplorationSession = {
        sessionId: input.sessionId,
        featureId: input.featureId,
        selectedConceptId: input.conceptId,
        selectedSource: input.source,
        lastDefinitionTarget: existing?.lastDefinitionTarget ?? null,
      };

      sessions.set(key(input.featureId, input.sessionId), updated);
      return updated;
    },

    getSession(input) {
      return sessions.get(key(input.featureId, input.sessionId)) ?? null;
    },

    setLastDefinitionTarget(input) {
      const existing = sessions.get(key(input.featureId, input.sessionId));
      const updated: ExplorationSession = {
        sessionId: input.sessionId,
        featureId: input.featureId,
        selectedConceptId: existing?.selectedConceptId ?? "",
        selectedSource: existing?.selectedSource ?? "graph",
        lastDefinitionTarget: input.target,
      };

      sessions.set(key(input.featureId, input.sessionId), updated);
      return updated;
    },
  };
}

function key(featureId: string, sessionId: string): string {
  return `${featureId}::${sessionId}`;
}
