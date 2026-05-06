import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import { buildServer } from "./server.js";

const READ_SCOPE_HEADERS = {
  "x-scopes": "domainspec.kg.read",
};

test("health endpoint returns ok", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    service: "domainspec-backend",
    status: "ok",
  });
});

test("rebuild persists projection and read endpoints return latest snapshot", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-projection-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  const rebuildResponse = await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  assert.equal(rebuildResponse.statusCode, 200);
  const rebuildBody = rebuildResponse.json() as {
    snapshotId: string;
  };

  const cardsResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/mirror-cards?featureId=knowledge-graph-visualization",
    headers: READ_SCOPE_HEADERS,
  });

  assert.equal(cardsResponse.statusCode, 200);
  const cardsBody = cardsResponse.json() as {
    snapshotId: string;
    cards: Array<{ filePath: string }>;
  };
  assert.equal(cardsBody.snapshotId, rebuildBody.snapshotId);
  assert.deepEqual(
    cardsBody.cards.map((card) => card.filePath),
    ["SPEC.md", "domain.md", "operations.md"],
  );

  const graphResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization",
    headers: READ_SCOPE_HEADERS,
  });

  assert.equal(graphResponse.statusCode, 200);
  const graphBody = graphResponse.json() as {
    snapshotId: string;
    edges: Array<{ edge: string }>;
  };

  assert.equal(graphBody.snapshotId, rebuildBody.snapshotId);
  assert.ok(graphBody.edges.length > 0);

  const canonicalEdgeSubset = new Set([
    "applies",
    "consumes",
    "contains",
    "displays",
    "exposes",
    "fetches",
    "maps",
    "mutates",
    "orchestrates",
    "produces",
    "produces-for",
    "queries",
    "reflects",
    "renders",
    "shapes",
    "transitions",
    "wraps",
  ]);

  for (const edge of graphBody.edges) {
    assert.ok(canonicalEdgeSubset.has(edge.edge));
  }
});

test("concept detail, definition, and open-definition endpoints satisfy stage-2 contract", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const graphResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });
  const graphBody = graphResponse.json() as {
    nodes: Array<{ conceptId: string }>;
  };
  assert.ok(graphBody.nodes.length > 0);

  const conceptId = graphBody.nodes[0]!.conceptId;
  const sessionId = "session-stage2";

  const unauthorizedDetailResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}?featureId=knowledge-graph-visualization`,
  });
  assert.equal(unauthorizedDetailResponse.statusCode, 401);

  const detailResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}?featureId=knowledge-graph-visualization&sessionId=${sessionId}&source=graph`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(detailResponse.statusCode, 200);
  const detailBody = detailResponse.json() as {
    conceptId: string;
    definition: { filePath: string; anchor: string };
  };
  assert.equal(detailBody.conceptId, conceptId);
  assert.ok(detailBody.definition.filePath.length > 0);
  assert.ok(detailBody.definition.anchor.length > 0);

  const definitionResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}/definition?featureId=knowledge-graph-visualization`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(definitionResponse.statusCode, 200);
  const definitionBody = definitionResponse.json() as {
    filePath: string;
    anchor: string;
  };
  assert.ok(definitionBody.filePath.length > 0);
  assert.ok(definitionBody.anchor.length > 0);

  const openResponse = await app.inject({
    method: "POST",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}/open-definition?featureId=knowledge-graph-visualization`,
    headers: READ_SCOPE_HEADERS,
    payload: {
      sessionId,
      conceptId,
    },
  });
  assert.equal(openResponse.statusCode, 200);
  const openBody = openResponse.json() as {
    filePath: string;
    anchor: string;
    target: string;
  };
  assert.equal(openBody.target, `${openBody.filePath}#${openBody.anchor}`);
});

test("open-definition returns deterministic mismatch diagnostics", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-mismatch-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const graphResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });
  const graphBody = graphResponse.json() as {
    nodes: Array<{ conceptId: string }>;
  };

  assert.ok(graphBody.nodes.length > 1);
  const selectedConceptId = graphBody.nodes[0]!.conceptId;
  const requestedConceptId = graphBody.nodes[1]!.conceptId;
  const sessionId = "session-mismatch";

  const selectionResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(selectedConceptId)}?featureId=knowledge-graph-visualization&sessionId=${sessionId}&source=graph`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(selectionResponse.statusCode, 200);

  const mismatchResponse = await app.inject({
    method: "POST",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(requestedConceptId)}/open-definition?featureId=knowledge-graph-visualization`,
    headers: READ_SCOPE_HEADERS,
    payload: {
      sessionId,
      conceptId: requestedConceptId,
    },
  });

  assert.equal(mismatchResponse.statusCode, 409);
  const mismatchBody = mismatchResponse.json() as { code: string };
  assert.equal(mismatchBody.code, "DEFINITION_SESSION_MISMATCH");
});

test("rebuild rejects unknown project with deterministic code", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-scope-unknown-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      projectKey: "unknown-project",
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  assert.equal(response.statusCode, 404);
  const body = response.json() as { code: string };
  assert.equal(body.code, "MIRROR_SOURCE_PROJECT_UNKNOWN");
});

test("graph query maps board-level fields and validates selected group card", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-graph-board-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const conceptGraphResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(conceptGraphResponse.statusCode, 200);
  const conceptGraphBody = conceptGraphResponse.json() as {
    board: { viewLevel: string; activeAspect: string };
    nodes: Array<{ groupKey: string | null }>;
  };
  assert.equal(conceptGraphBody.board.viewLevel, "concept");
  assert.equal(conceptGraphBody.board.activeAspect, "SPEC");

  const selectedGroupKey = conceptGraphBody.nodes.find(
    (node) => node.groupKey !== null,
  )?.groupKey;
  assert.ok(selectedGroupKey);

  const scopedResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC&selectedGroupKey=${encodeURIComponent(
      selectedGroupKey!,
    )}&cardTypes=concept`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(scopedResponse.statusCode, 200);
  const scopedBody = scopedResponse.json() as {
    board: { selectedGroupKey: string | null };
    nodes: Array<{ cardType: string; groupKey: string | null }>;
  };
  assert.equal(scopedBody.board.selectedGroupKey, selectedGroupKey);
  assert.ok(scopedBody.nodes.every((node) => node.cardType === "concept"));
  assert.ok(
    scopedBody.nodes.every((node) => node.groupKey === selectedGroupKey),
  );

  const invalidGroupResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC&selectedGroupKey=missing-group",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(invalidGroupResponse.statusCode, 404);
  const invalidGroupBody = invalidGroupResponse.json() as { code: string };
  assert.equal(invalidGroupBody.code, "WHITEBOARD_CARD_NOT_FOUND");
});

test("concept detail selection enforces whiteboard card validation diagnostics", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-card-validation-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const graphResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(graphResponse.statusCode, 200);
  const graphBody = graphResponse.json() as {
    nodes: Array<{ conceptId: string | null; cardId: string }>;
  };
  assert.ok(graphBody.nodes.length > 1);

  const conceptId = graphBody.nodes[0]!.conceptId!;
  const alternateConceptId = graphBody.nodes[1]!.conceptId!;
  const sessionId = "session-card-validation";

  const missingCardResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}?featureId=knowledge-graph-visualization&sessionId=${sessionId}&source=board&viewLevel=concept&activeAspect=SPEC&selectedCardType=concept&selectedCardId=${encodeURIComponent(
      "concept:missing.concept",
    )}`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(missingCardResponse.statusCode, 404);
  const missingCardBody = missingCardResponse.json() as { code: string };
  assert.equal(missingCardBody.code, "WHITEBOARD_CARD_NOT_FOUND");

  const mappingMismatchResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}?featureId=knowledge-graph-visualization&sessionId=${sessionId}&source=board&viewLevel=concept&activeAspect=SPEC&selectedCardType=concept&selectedCardId=${encodeURIComponent(
      `concept:${alternateConceptId}`,
    )}`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(mappingMismatchResponse.statusCode, 422);
  const mappingMismatchBody = mappingMismatchResponse.json() as {
    code: string;
  };
  assert.equal(mappingMismatchBody.code, "WHITEBOARD_CARD_MAPPING_UNRESOLVED");
});

test("concept and definition operations return scope mismatch diagnostics for reused session IDs", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-scope-mismatch-`);
  const projectRootDir = resolve(process.cwd(), "..");
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir,
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
      projectSources: [
        {
          projectKey: "alt-project",
          workspaceRootDir: projectRootDir,
          featureDocsRootDir: resolve(projectRootDir, "docs", "features"),
          relationshipsFilePath: resolve(projectRootDir, "RELATIONSHIPS.md"),
          status: "active",
        },
      ],
    },
  });

  t.after(async () => {
    await app.close();
  });

  await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      projectKey: "domainspec-core",
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const graphResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?projectKey=domainspec-core&featureId=knowledge-graph-visualization&viewLevel=concept&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });
  const graphBody = graphResponse.json() as {
    nodes: Array<{ conceptId: string | null }>;
  };
  const conceptId = graphBody.nodes[0]!.conceptId!;
  const sessionId = "session-scope-mismatch";

  const baselineSelectionResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}?projectKey=domainspec-core&featureId=knowledge-graph-visualization&sessionId=${sessionId}&source=board&viewLevel=concept&activeAspect=SPEC`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(baselineSelectionResponse.statusCode, 200);

  const conceptScopeMismatchResponse = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}?projectKey=alt-project&featureId=knowledge-graph-visualization&sessionId=${sessionId}&source=board&viewLevel=concept&activeAspect=SPEC`,
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(conceptScopeMismatchResponse.statusCode, 409);
  const conceptScopeMismatchBody = conceptScopeMismatchResponse.json() as {
    code: string;
  };
  assert.equal(conceptScopeMismatchBody.code, "CONCEPT_SCOPE_MISMATCH");

  const definitionScopeMismatchResponse = await app.inject({
    method: "POST",
    url: `/api/knowledge-graph/concepts/${encodeURIComponent(conceptId)}/open-definition?projectKey=alt-project&featureId=knowledge-graph-visualization`,
    headers: READ_SCOPE_HEADERS,
    payload: {
      sessionId,
      conceptId,
    },
  });
  assert.equal(definitionScopeMismatchResponse.statusCode, 409);
  const definitionScopeMismatchBody =
    definitionScopeMismatchResponse.json() as {
      code: string;
    };
  assert.equal(definitionScopeMismatchBody.code, "DEFINITION_SCOPE_MISMATCH");
});

test("rebuild rejects invalid feature path escapes before file reads", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-scope-root-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      projectKey: "domainspec-core",
      featureId: "../escape",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  assert.equal(response.statusCode, 422);
  const body = response.json() as { code: string };
  assert.equal(body.code, "MIRROR_SOURCE_ROOT_INVALID");
});
