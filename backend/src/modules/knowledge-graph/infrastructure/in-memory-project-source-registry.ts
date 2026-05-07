import { existsSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

import type {
  ProjectSourceRegistryPort,
  ResolveProjectionScopeInput,
} from "../application/ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";

export type ProjectSourceStatus = "active" | "disabled";

export interface DocumentationWorkspaceSource {
  projectKey: string;
  workspaceRootDir: string;
  featureDocsRootDir: string;
  relationshipsFilePath: string;
  status?: ProjectSourceStatus;
}

interface InMemoryProjectSourceRegistryConfig {
  readonly sources: DocumentationWorkspaceSource[];
}

interface ResolvedDocumentationWorkspaceSource {
  projectKey: string;
  workspaceRootDir: string;
  featureDocsRootDir: string;
  relationshipsFilePath: string;
  status: ProjectSourceStatus;
}

/**
 * domainspec:
 *   concept:
 *     id: knowledge-graph-visualization.ProjectSourceRegistry
 *     type: Interface
 *   edges:
 *     - edge: exposes
 *       to: knowledge-graph-visualization.ResolveProjectionScope
 */
export function createInMemoryProjectSourceRegistry(
  config: InMemoryProjectSourceRegistryConfig,
): ProjectSourceRegistryPort {
  const sourcesByProjectKey = new Map<
    string,
    ResolvedDocumentationWorkspaceSource
  >();

  for (const source of config.sources) {
    const projectKey = source.projectKey.trim();
    if (projectKey.length === 0) {
      continue;
    }

    sourcesByProjectKey.set(projectKey, {
      projectKey,
      workspaceRootDir: resolve(source.workspaceRootDir),
      featureDocsRootDir: resolve(source.featureDocsRootDir),
      relationshipsFilePath: resolve(source.relationshipsFilePath),
      status: source.status ?? "active",
    });
  }

  /**
   * domainspec:
   *   concept:
   *     id: knowledge-graph-visualization.ResolveProjectionScope
   *     type: Operation
   */
  function resolveProjectionScope(input: ResolveProjectionScopeInput) {
    const projectKey = input.projectKey.trim();
    const featureId = input.featureId.trim();

    if (projectKey.length === 0 || featureId.length === 0) {
      throw createKnowledgeGraphError(
        "MIRROR_REBUILD_INPUT_INVALID",
        "projectKey and featureId are required",
        {
          projectKey,
          featureId,
        },
      );
    }

    const source = sourcesByProjectKey.get(projectKey);
    if (!source || source.status !== "active") {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_PROJECT_UNKNOWN",
        "Unknown or disabled source project",
        {
          projectKey,
        },
      );
    }

    if (!isPathWithin(source.workspaceRootDir, source.featureDocsRootDir)) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_ROOT_INVALID",
        "Feature docs root escapes workspace root",
        {
          projectKey,
          workspaceRootDir: source.workspaceRootDir,
          featureDocsRootDir: source.featureDocsRootDir,
        },
      );
    }

    if (!isPathWithin(source.workspaceRootDir, source.relationshipsFilePath)) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_ROOT_INVALID",
        "Relationships file escapes workspace root",
        {
          projectKey,
          workspaceRootDir: source.workspaceRootDir,
          relationshipsFilePath: source.relationshipsFilePath,
        },
      );
    }

    if (
      featureId.includes("..") ||
      featureId.includes("/") ||
      featureId.includes("\\")
    ) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_ROOT_INVALID",
        "featureId contains invalid path characters",
        {
          projectKey,
          featureId,
        },
      );
    }

    if (!existsSync(source.featureDocsRootDir)) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_ROOT_INVALID",
        "Feature docs root directory does not exist",
        {
          projectKey,
          featureDocsRootDir: source.featureDocsRootDir,
        },
      );
    }

    const featureDir = resolve(source.featureDocsRootDir, featureId);
    if (!isPathWithin(source.featureDocsRootDir, featureDir)) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_ROOT_INVALID",
        "Resolved feature directory escapes feature docs root",
        {
          projectKey,
          featureId,
          featureDir,
        },
      );
    }

    if (!existsSync(featureDir) || !statSync(featureDir).isDirectory()) {
      throw createKnowledgeGraphError(
        "MIRROR_SOURCE_FEATURE_UNAVAILABLE",
        "Feature docs directory is unavailable for the selected source",
        {
          projectKey,
          featureId,
          featureDir,
        },
      );
    }

    return {
      projectKey,
      featureId,
      workspaceRootDir: source.workspaceRootDir,
      featureDocsRootDir: source.featureDocsRootDir,
      relationshipsFilePath: source.relationshipsFilePath,
    };
  }

  return {
    resolveProjectionScope,
  };
}

function isPathWithin(basePath: string, targetPath: string): boolean {
  const relativePath = relative(basePath, targetPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
}
