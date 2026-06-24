import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import { createInMemoryStudioSessionStore } from "./modules/ui-prototyping-studio/application/session-store.js";
import { createStudioOrchestrationModule } from "./modules/ui-prototyping-studio/application/studio-orchestration-module.js";
import { createNewspaperContractAdapter } from "./modules/ui-prototyping-studio/infrastructure/newspaper-contract-adapter.js";
import { buildServer } from "./server.js";

const READ_SCOPE_HEADERS = {
  "x-scopes": "domainspec.kg.read",
};

const WRITE_SCOPE_HEADERS = {
  "x-scopes": "domainspec.kg.read domainspec.kg.write",
};

const UPS_READ_SCOPE_HEADERS = {
  "x-scopes": "domainspec.ui-prototyping.read",
};

const UPS_WRITE_SCOPE_HEADERS = {
  "x-scopes": "domainspec.ui-prototyping.read domainspec.ui-prototyping.write",
};

async function setupUpsDraftBatch(app: ReturnType<typeof buildServer>) {
  const sessionResponse = await app.inject({
    method: "POST",
    url: "/api/ui-prototyping-studio/sessions",
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedVariantCount: 3,
      requestedBy: "test-suite",
    },
  });
  const session = sessionResponse.json() as { sessionId: string };

  await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${session.sessionId}/prompt`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      prompt: "Prototype deterministic mutation workflow",
      submittedBy: "test-suite",
    },
  });

  await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${session.sessionId}/variants/generate`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedBy: "test-suite",
    },
  });

  await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${session.sessionId}/baseline`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      selectedLabel: "B",
      requestedBy: "test-suite",
    },
  });

  await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${session.sessionId}/comments`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      revisionId: "rev-0000",
      target: {
        selector: "#hero",
        elementLabel: "Hero panel",
      },
      severity: "high",
      intent: "Increase readability",
      note: "Raise contrast for headings.",
      createdBy: "test-suite",
    },
  });

  const synthesizeResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${session.sessionId}/mutation-batches/synthesize`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      sourceRevisionId: "rev-0000",
      requestedBy: "test-suite",
    },
  });

  const synthesizeBody = synthesizeResponse.json() as {
    batch: { batchId: string };
  };

  return {
    sessionId: session.sessionId,
    batchId: synthesizeBody.batch.batchId,
  };
}

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

test("UPS-API-001 ui-prototyping-studio POST /sessions maps InitializeSession request fields", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/ui-prototyping-studio/sessions",
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedVariantCount: 2,
      requestedBy: "test-suite",
    },
  });

  assert.equal(response.statusCode, 201);
  const body = response.json() as {
    variantCount: number;
    variantLabels: string[];
    state: string;
  };
  assert.equal(body.variantCount, 2);
  assert.deepEqual(body.variantLabels, ["A", "B"]);
  assert.equal(body.state, "SessionInitialized");
});

test("UPS-API-002 ui-prototyping-studio POST /sessions/:sessionId/variants/generate exposes GenerateVariants", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const sessionResponse = await app.inject({
    method: "POST",
    url: "/api/ui-prototyping-studio/sessions",
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedVariantCount: 3,
      requestedBy: "test-suite",
    },
  });
  const sessionBody = sessionResponse.json() as { sessionId: string };

  const promptResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}/prompt`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      prompt: "Generate a deterministic dashboard",
      submittedBy: "test-suite",
    },
  });
  assert.equal(promptResponse.statusCode, 200);

  const response = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}/variants/generate`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedBy: "test-suite",
    },
  });

  assert.equal(response.statusCode, 200);
  const body = response.json() as {
    session: { state: string; selectionGate: string };
    variants: Array<{ variantLabel: string }>;
  };
  assert.equal(body.session.state, "VariantsReady");
  assert.equal(body.session.selectionGate, "pending");
  assert.deepEqual(
    body.variants.map((variant) => variant.variantLabel),
    ["A", "B", "C"],
  );
});

test("UPS-API-003 ui-prototyping-studio POST /sessions/:sessionId/baseline exposes SelectOrCommitBaseline", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const sessionResponse = await app.inject({
    method: "POST",
    url: "/api/ui-prototyping-studio/sessions",
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedVariantCount: 3,
      requestedBy: "test-suite",
    },
  });
  const sessionBody = sessionResponse.json() as { sessionId: string };

  await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}/prompt`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      prompt: "Create a baseline selection flow",
      submittedBy: "test-suite",
    },
  });

  await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}/variants/generate`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedBy: "test-suite",
    },
  });

  const missingSelectionResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}/baseline`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedBy: "test-suite",
    },
  });
  assert.equal(missingSelectionResponse.statusCode, 409);
  assert.equal(
    (missingSelectionResponse.json() as { code: string }).code,
    "BASELINE_SELECTION_REQUIRED",
  );

  const selectedResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}/baseline`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedBy: "test-suite",
      selectedLabel: "B",
    },
  });
  assert.equal(selectedResponse.statusCode, 200);
  const selectedBody = selectedResponse.json() as {
    session: {
      state: string;
      selectionGate: string;
      baseline: { mode: string; label: string };
    };
  };
  assert.equal(selectedBody.session.state, "BaselineReady");
  assert.equal(selectedBody.session.selectionGate, "satisfied");
  assert.equal(selectedBody.session.baseline.mode, "selected");
  assert.equal(selectedBody.session.baseline.label, "B");

  const snapshotResponse = await app.inject({
    method: "GET",
    url: `/api/ui-prototyping-studio/sessions/${sessionBody.sessionId}`,
    headers: UPS_READ_SCOPE_HEADERS,
  });
  assert.equal(snapshotResponse.statusCode, 200);
});

test("UPS-API-004 UPS-API-005 UPS-API-006 ui-prototyping-studio comments, synthesis, and approval endpoints expose WP-02 contracts", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const seeded = await setupUpsDraftBatch(app);

  const commentResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/comments`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      revisionId: "rev-0000",
      target: {
        selector: "#cta",
        elementLabel: "CTA button",
      },
      severity: "medium",
      intent: "Improve hierarchy",
      note: "Increase button prominence.",
      createdBy: "test-suite",
    },
  });
  assert.equal(commentResponse.statusCode, 201);
  assert.equal(
    (commentResponse.json() as { severity: string }).severity,
    "medium",
  );

  const synthesizeResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/mutation-batches/synthesize`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      sourceRevisionId: "rev-0000",
      requestedBy: "test-suite",
    },
  });
  assert.equal(synthesizeResponse.statusCode, 201);
  const synthesizeBody = synthesizeResponse.json() as {
    batch: {
      batchId: string;
      status: string;
      tasks: Array<{ taskId: string }>;
    };
  };
  assert.equal(synthesizeBody.batch.status, "draft");
  assert.ok(synthesizeBody.batch.tasks.length >= 2);

  const approveResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/mutation-batches/${synthesizeBody.batch.batchId}/approve`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      approvedBy: "qa-reviewer",
      approvedAt: "2026-05-08T00:00:00.000Z",
    },
  });
  assert.equal(approveResponse.statusCode, 200);
  const approveBody = approveResponse.json() as {
    session: { applyGate: string; state: string };
    batch: { status: string; approval: { approvedBy: string } };
  };
  assert.equal(approveBody.batch.status, "approved");
  assert.equal(approveBody.batch.approval.approvedBy, "qa-reviewer");
  assert.equal(approveBody.session.applyGate, "satisfied");
  assert.equal(approveBody.session.state, "MutationApproved");
});

test("UPS-API-007 UPS-API-008 ui-prototyping-studio apply and handoff endpoints expose WP-03 contracts", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const seeded = await setupUpsDraftBatch(app);

  const approveResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/mutation-batches/${seeded.batchId}/approve`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      approvedBy: "qa-reviewer",
      approvedAt: "2026-05-08T00:10:00.000Z",
    },
  });
  assert.equal(approveResponse.statusCode, 200);

  const applyResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/mutation-batches/${seeded.batchId}/apply`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      applyRequestedBy: "test-suite",
    },
  });
  assert.equal(applyResponse.statusCode, 200);
  const applyBody = applyResponse.json() as {
    session: { revisionHeadId: string; state: string };
    revision: { revisionId: string; appliedBatchId: string };
  };
  assert.equal(applyBody.revision.appliedBatchId, seeded.batchId);
  assert.equal(applyBody.session.revisionHeadId, applyBody.revision.revisionId);
  assert.equal(applyBody.session.state, "RevisionRecorded");

  const exportResponse = await app.inject({
    method: "POST",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/handoff/export`,
    headers: UPS_WRITE_SCOPE_HEADERS,
    payload: {
      requestedBy: "test-suite",
      exportProfile: "mvp",
    },
  });
  assert.equal(exportResponse.statusCode, 200);

  const handoffResponse = await app.inject({
    method: "GET",
    url: `/api/ui-prototyping-studio/sessions/${seeded.sessionId}/handoff`,
    headers: UPS_READ_SCOPE_HEADERS,
  });
  assert.equal(handoffResponse.statusCode, 200);
  const handoffBody = handoffResponse.json() as {
    storyRefs: string[];
    requirementRefs: string[];
    acceptanceRefs: string[];
    uiSpecRef: string;
    testSpecRef: string;
  };
  assert.deepEqual(handoffBody.storyRefs, ["ui-prototyping-studio:STORIES.md"]);
  assert.equal(handoffBody.uiSpecRef, "ui-prototyping-studio:UI-SPEC.md");
  assert.equal(handoffBody.testSpecRef, "ui-prototyping-studio:TEST-SPEC.md");
  assert.equal(handoffBody.requirementRefs.length, 1);
  assert.equal(handoffBody.acceptanceRefs.length, 1);
});

test("UPS-API-009 ui-prototyping-studio orchestration module exposes full MVP method surface", () => {
  const store = createInMemoryStudioSessionStore();
  const module = createStudioOrchestrationModule(store, {
    featureDocsRootDir: resolve(
      process.cwd(),
      "..",
      "docs",
      "features",
      "ui-prototyping-studio",
    ),
  });

  assert.equal(typeof module.initializeSession, "function");
  assert.equal(typeof module.submitPrompt, "function");
  assert.equal(typeof module.generateVariants, "function");
  assert.equal(typeof module.selectOrCommitBaseline, "function");
  assert.equal(typeof module.captureCommentEvent, "function");
  assert.equal(typeof module.synthesizeMutationBatch, "function");
  assert.equal(typeof module.approveMutationBatch, "function");
  assert.equal(typeof module.applyApprovedBatch, "function");
  assert.equal(typeof module.exportDesignHandoff, "function");
  assert.equal(typeof module.getSessionSnapshot, "function");
  assert.equal(typeof module.listSessionVariants, "function");
  assert.equal(typeof module.getDraftMutationBatch, "function");
  assert.equal(typeof module.listRevisionManifest, "function");
  assert.equal(typeof module.getHandoffBundle, "function");
});

test("UPS-API-010 ui-prototyping-studio newspaper adapter remains adapter-only and runtime-independent", () => {
  const adapter = createNewspaperContractAdapter();

  const mappedComment = adapter.mapCommentEvent({
    commentId: "ups-comment-00001",
    sessionId: "ups-session-0001",
    revisionId: "rev-0000",
    target: {
      selector: "#hero",
      elementLabel: "Hero panel",
      odId: null,
    },
    severity: "high",
    intent: "Improve clarity",
    note: "Increase contrast.",
    createdBy: "qa",
    createdAt: "2026-05-08T00:00:00.000Z",
  });
  assert.equal(mappedComment.id, "ups-comment-00001");
  assert.equal(mappedComment.target, "#hero");

  const mappedBatch = adapter.mapMutationBatch({
    batchId: "ups-batch-00001",
    sessionId: "ups-session-0001",
    sourceRevisionId: "rev-0000",
    status: "approved",
    generatedFromCommentIds: ["ups-comment-00001"],
    tasks: [
      {
        taskId: "task-0001",
        target: "#hero",
        intent: "Improve clarity",
        changeType: "change",
        acceptanceText: "Apply clarity update.",
        priority: "p1",
      },
    ],
    approval: {
      required: true,
      approvedBy: "qa",
      approvedAt: "2026-05-08T00:00:00.000Z",
    },
    checksum: "checksum-001",
  });
  assert.equal(mappedBatch.taskCount, 1);
  assert.equal(mappedBatch.tasks[0]?.id, "task-0001");

  const mappedRevision = adapter.mapRevisionManifestEntry({
    revisionId: "rev-0001",
    parentRevisionId: "rev-0000",
    sessionId: "ups-session-0001",
    variantCount: 3,
    baseline: {
      mode: "selected",
      label: "B",
    },
    appliedBatchId: "ups-batch-00001",
    appliedTaskIds: ["task-0001"],
    unresolvedCommentIds: [],
    diffSummary: {
      added: 0,
      changed: 1,
      removed: 0,
    },
    createdAt: "2026-05-08T00:00:10.000Z",
  });
  assert.equal(mappedRevision.appliedBatchId, "ups-batch-00001");

  const adapterSource = readFileSync(
    new URL(
      "./modules/ui-prototyping-studio/infrastructure/newspaper-contract-adapter.ts",
      import.meta.url,
    ),
    "utf8",
  );
  assert.equal(adapterSource.includes("newspaper/runtime"), false);
});

test("KG-BE-API-014 KG-BE-API-015 rebuild requires write scope and returns deterministic 401/403 diagnostics", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-auth-rebuild-`);
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir: resolve(process.cwd(), ".."),
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
    },
  });

  t.after(async () => {
    await app.close();
  });

  const unauthorizedResponse = await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  assert.equal(unauthorizedResponse.statusCode, 401);
  const unauthorizedBody = unauthorizedResponse.json() as { code: string };
  assert.equal(unauthorizedBody.code, "KG_AUTH_REQUIRED");

  const forbiddenResponse = await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    headers: READ_SCOPE_HEADERS,
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  assert.equal(forbiddenResponse.statusCode, 403);
  const forbiddenBody = forbiddenResponse.json() as { code: string };
  assert.equal(forbiddenBody.code, "KG_AUTH_FORBIDDEN");
});

test("KG-BE-API-016 KG-BE-QRY-001 rebuild persists projection and read endpoints return latest snapshot", async (t) => {
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
    headers: WRITE_SCOPE_HEADERS,
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
    cards: Array<{ filePath: string; storyCount: number; isActive: boolean }>;
  };
  assert.equal(cardsBody.snapshotId, rebuildBody.snapshotId);
  assert.deepEqual(
    cardsBody.cards.map((card) => card.filePath),
    ["SPEC.md", "domain.md", "operations.md"],
  );
  assert.ok(cardsBody.cards.every((card) => card.storyCount >= 0));
  assert.equal(
    cardsBody.cards.find((card) => card.filePath === "SPEC.md")?.isActive,
    true,
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
    headers: WRITE_SCOPE_HEADERS,
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
    headers: WRITE_SCOPE_HEADERS,
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
    headers: WRITE_SCOPE_HEADERS,
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

test("KG-BE-API-001 KG-BE-IFMAP-001 KG-BE-IFMAP-002 mirror-cards maps feature and aspect filters deterministically", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-ifmap-cards-`);
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
    headers: WRITE_SCOPE_HEADERS,
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const response = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/mirror-cards?featureId=knowledge-graph-visualization&includeOptionalAspects=false&aspectKinds=SPEC,OPERATIONS",
    headers: READ_SCOPE_HEADERS,
  });

  assert.equal(response.statusCode, 200);
  const body = response.json() as {
    featureId: string;
    cards: Array<{ aspectKind: string }>;
  };

  assert.equal(body.featureId, "knowledge-graph-visualization");
  assert.deepEqual(body.cards.map((card) => card.aspectKind).sort(), [
    "OPERATIONS",
    "SPEC",
  ]);
});

test("KG-BE-API-004 KG-BE-IFMAP-004 graph applies edgeKinds filter", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-ifmap-graph-`);
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
    headers: WRITE_SCOPE_HEADERS,
    payload: {
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });

  const baselineResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=aspect&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });

  assert.equal(baselineResponse.statusCode, 200);
  const baselineBody = baselineResponse.json() as {
    edges: Array<{ edge: string }>;
  };

  assert.ok(baselineBody.edges.length > 0);
  const selectedEdgeKind = baselineBody.edges[0]!.edge;

  const response = await app.inject({
    method: "GET",
    url: `/api/knowledge-graph/graph?featureId=knowledge-graph-visualization&viewLevel=aspect&activeAspect=SPEC&edgeKinds=${encodeURIComponent(
      selectedEdgeKind,
    )}`,
    headers: READ_SCOPE_HEADERS,
  });

  assert.equal(response.statusCode, 200);
  const body = response.json() as {
    board: { viewLevel: string; activeAspect: string };
    edges: Array<{ edge: string }>;
  };

  assert.equal(body.board.viewLevel, "aspect");
  assert.equal(body.board.activeAspect, "SPEC");
  assert.ok(body.edges.length > 0);
  assert.ok(body.edges.every((edge) => edge.edge === selectedEdgeKind));
});

test("cross-project scope guards reject disabled project keys and unavailable features", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-scope-guards-`);
  const projectRootDir = resolve(process.cwd(), "..");
  const app = buildServer({
    knowledgeGraph: {
      projectRootDir,
      databaseFilePath: resolve(tempDir, "knowledge-graph.sqlite"),
      projectSources: [
        {
          projectKey: "disabled-project",
          workspaceRootDir: projectRootDir,
          featureDocsRootDir: resolve(projectRootDir, "docs", "features"),
          relationshipsFilePath: resolve(projectRootDir, "RELATIONSHIPS.md"),
          status: "disabled",
        },
      ],
    },
  });

  t.after(async () => {
    await app.close();
  });

  const disabledProjectResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/mirror-cards?projectKey=disabled-project&featureId=knowledge-graph-visualization",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(disabledProjectResponse.statusCode, 404);
  const disabledProjectBody = disabledProjectResponse.json() as {
    code: string;
  };
  assert.equal(disabledProjectBody.code, "MIRROR_SOURCE_PROJECT_UNKNOWN");

  const missingFeatureResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/graph?projectKey=domainspec-core&featureId=missing-feature&viewLevel=aspect&activeAspect=SPEC",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(missingFeatureResponse.statusCode, 404);
  const missingFeatureBody = missingFeatureResponse.json() as {
    code: string;
  };
  assert.equal(missingFeatureBody.code, "MIRROR_SOURCE_FEATURE_UNAVAILABLE");
});

test("cross-project scope guards isolate snapshots per (projectKey, featureId)", async (t) => {
  const tempDir = mkdtempSync(`${tmpdir()}/kg-stage2-scope-isolation-`);
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

  const rebuildAltProjectResponse = await app.inject({
    method: "POST",
    url: "/api/knowledge-graph/rebuild",
    headers: WRITE_SCOPE_HEADERS,
    payload: {
      projectKey: "alt-project",
      featureId: "knowledge-graph-visualization",
      sourceFiles: ["SPEC.md", "domain.md", "operations.md"],
      requestedBy: "test-suite",
    },
  });
  assert.equal(rebuildAltProjectResponse.statusCode, 200);

  const altProjectCardsResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/mirror-cards?projectKey=alt-project&featureId=knowledge-graph-visualization",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(altProjectCardsResponse.statusCode, 200);

  const defaultProjectCardsResponse = await app.inject({
    method: "GET",
    url: "/api/knowledge-graph/mirror-cards?projectKey=domainspec-core&featureId=knowledge-graph-visualization",
    headers: READ_SCOPE_HEADERS,
  });
  assert.equal(defaultProjectCardsResponse.statusCode, 404);
  const defaultProjectBody = defaultProjectCardsResponse.json() as {
    code: string;
  };
  assert.equal(defaultProjectBody.code, "MIRROR_PROJECTION_NOT_FOUND");
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
    headers: WRITE_SCOPE_HEADERS,
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
    headers: WRITE_SCOPE_HEADERS,
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
    headers: WRITE_SCOPE_HEADERS,
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
    headers: WRITE_SCOPE_HEADERS,
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
