import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import { isKnowledgeGraphError } from "../domain/errors.js";
import { createMarkdownFeatureDocsParser } from "./markdown-feature-docs-parser.js";

test("parseSpec reads relationship index from feature graph, cross-feature dependencies, and produces-for", () => {
  const parser = createMarkdownFeatureDocsParser();

  const specContent = [
    "## Concepts",
    "| Concept | ID | Type | Description |",
    "| ------- | -- | ---- | ----------- |",
    "| [FeatureDocument](domain.md#featuredocument) | knowledge-graph-visualization.FeatureDocument | Entity | Source file tracked by projection |",
    "| [ConceptDefinition](domain.md#conceptdefinition) | knowledge-graph-visualization.ConceptDefinition | Entity | Canonical concept row |",
    "",
    "## Feature Concept Graph",
    "| From | Edge | To | Evidence | Notes |",
    "| ---- | ---- | -- | -------- | ----- |",
    "| knowledge-graph-visualization.FeatureDocument | maps | knowledge-graph-visualization.ConceptDefinition | mappings.md#documenttoconceptmapping | Parse table rows |",
    "",
    "## Cross-Feature Dependencies",
    "| Depends On | Relationship | Why |",
    "| ---------- | ------------ | --- |",
    "| [payment-processing](../payment-processing/SPEC.md) | queries | Uses canonical edge examples |",
    "",
    "## Produces For",
    "| Consumer | Via | What |",
    "| -------- | --- | ---- |",
    "| Feature authors | Query | Mirror cards proving one-to-one file coverage |",
  ].join("\n");

  const parsed = parser.parseSpec({
    scope: {
      projectKey: "domainspec-core",
      featureId: "knowledge-graph-visualization",
      workspaceRootDir: "/workspace/domainspec",
      featureDocsRootDir: "/workspace/domainspec/docs/features",
      relationshipsFilePath: "/workspace/domainspec/RELATIONSHIPS.md",
    },
    specContent,
  });

  const edgeLabels = new Set(parsed.edges.map((edge) => edge.edge));
  assert.ok(edgeLabels.has("maps"));
  assert.ok(edgeLabels.has("queries"));
  assert.ok(edgeLabels.has("produces-for"));

  const conceptIds = new Set(
    parsed.concepts.map((concept) => concept.conceptId),
  );
  assert.ok(conceptIds.has("feature.knowledge-graph-visualization"));
  assert.ok(conceptIds.has("feature.payment-processing"));
  assert.ok(
    conceptIds.has("consumer.knowledge-graph-visualization.feature-authors"),
  );
});

test("scanFeatureFiles rejects path escapes before file reads", async () => {
  const parser = createMarkdownFeatureDocsParser();

  const workspaceRootDir = mkdtempSync(`${tmpdir()}/kg-parser-workspace-`);
  const featureDocsRootDir = resolve(workspaceRootDir, "docs", "features");
  const featureDir = resolve(
    featureDocsRootDir,
    "knowledge-graph-visualization",
  );
  mkdirSync(featureDir, { recursive: true });

  await assert.rejects(
    async () =>
      parser.scanFeatureFiles({
        scope: {
          projectKey: "domainspec-core",
          featureId: "knowledge-graph-visualization",
          workspaceRootDir,
          featureDocsRootDir,
          relationshipsFilePath: resolve(workspaceRootDir, "RELATIONSHIPS.md"),
        },
        sourceFiles: ["../SPEC.md"],
        indexedAt: "2026-05-06T00:00:00.000Z",
      }),
    (error) => {
      assert.ok(isKnowledgeGraphError(error));
      assert.equal(error.code, "MIRROR_SOURCE_ROOT_INVALID");
      return true;
    },
  );
});
