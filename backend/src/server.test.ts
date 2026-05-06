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
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization",
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
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization",
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
