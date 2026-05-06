import { readFileSync } from "node:fs";

import type { CanonicalEdgeVocabularyPort } from "../application/ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";

export function createMarkdownCanonicalEdgeVocabulary(): CanonicalEdgeVocabularyPort {
  return {
    async loadCanonicalEdges(input): Promise<Set<string>> {
      const relationshipsFilePath = input.scope.relationshipsFilePath;
      let content = "";

      try {
        content = readFileSync(relationshipsFilePath, "utf8");
      } catch (error) {
        throw createKnowledgeGraphError(
          "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE",
          "Unable to load RELATIONSHIPS.md",
          { filePath: relationshipsFilePath, reason: String(error) },
        );
      }

      const canonicalEdges = new Set<string>();
      const edgeHeadingPattern = /^###\s+`([^`]+)`/gm;

      for (const match of content.matchAll(edgeHeadingPattern)) {
        const edge = match[1]?.trim();
        if (edge) {
          canonicalEdges.add(edge);
        }
      }

      if (canonicalEdges.size === 0) {
        throw createKnowledgeGraphError(
          "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE",
          "RELATIONSHIPS.md did not expose canonical edge headings",
          { filePath: relationshipsFilePath },
        );
      }

      return canonicalEdges;
    },
  };
}
