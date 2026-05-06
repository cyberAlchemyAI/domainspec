import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

import type { DefinitionAnchorResolverPort } from "../application/ports.js";
import { normalizeFilePath } from "../domain/models.js";

export function createFeatureDocsDefinitionAnchorResolver(): DefinitionAnchorResolverPort {
  return {
    resolvePointer(input) {
      const normalizedPath = normalizeFilePath(input.pointer.filePath);
      if (normalizedPath.length === 0 || normalizedPath.includes("..")) {
        return {
          fileExists: false,
          anchorExists: false,
        };
      }

      const featureDir = resolve(
        input.scope.featureDocsRootDir,
        input.scope.featureId,
      );
      if (!isPathWithin(input.scope.workspaceRootDir, featureDir)) {
        return {
          fileExists: false,
          anchorExists: false,
        };
      }

      const absolutePath = resolve(featureDir, normalizedPath);
      if (!isPathWithin(featureDir, absolutePath)) {
        return {
          fileExists: false,
          anchorExists: false,
        };
      }

      if (!existsSync(absolutePath)) {
        return {
          fileExists: false,
          anchorExists: false,
        };
      }

      const content = readFileSync(absolutePath, "utf8");
      const anchors = extractAnchors(content);
      const requestedAnchor = input.pointer.anchor.trim().toLowerCase();

      return {
        fileExists: true,
        anchorExists:
          requestedAnchor.length > 0 && anchors.has(requestedAnchor),
      };
    },
  };
}

function isPathWithin(basePath: string, targetPath: string): boolean {
  const relativePath = relative(basePath, targetPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
}

function extractAnchors(markdown: string): Set<string> {
  const anchors = new Set<string>();
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (!headingMatch) {
      continue;
    }

    const headingText = headingMatch[1]?.trim() ?? "";
    const anchor = toAnchor(headingText);
    if (anchor.length > 0) {
      anchors.add(anchor);
    }
  }

  return anchors;
}

function toAnchor(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
