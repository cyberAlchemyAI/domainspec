import type { Page, Route } from "@playwright/test";

type VariantCount = 1 | 2 | 3;
type SessionState =
  | "SessionInitialized"
  | "PromptCaptured"
  | "VariantsReady"
  | "BaselineReady"
  | "CommentsCaptured"
  | "MutationDrafted"
  | "MutationApproved"
  | "RevisionApplied"
  | "RevisionRecorded"
  | "SessionCompleted";
type GateState = "pending" | "satisfied" | "blocked";
type BaselineMode = "selected" | "committed";
type VariantLabel = "A" | "B" | "C";
type CommentSeverity = "blocker" | "high" | "medium" | "low";
type MutationBatchStatus = "draft" | "approved" | "applied" | "rejected";

interface MockSession {
  sessionId: string;
  prompt: string | null;
  variantCount: VariantCount;
  variantLabels: VariantLabel[];
  baseline: { mode: BaselineMode; label: VariantLabel } | null;
  revisionHeadId: string | null;
  selectionGate: GateState;
  applyGate: GateState;
  integration: {
    uiPhaseBridgeReady: boolean;
    generateTestsUiReady: boolean;
    uiImplementReady: boolean;
  };
  state: SessionState;
}

interface MockVariant {
  sessionId: string;
  variantLabel: VariantLabel;
  htmlArtifactRef: string;
  componentsUsed: string[];
  rationale: string;
  tradeoffs: string;
  risk: string;
  status: "candidate" | "selected" | "committed";
}

interface MockCommentEvent {
  commentId: string;
  sessionId: string;
  revisionId: string;
  target: {
    selector: string;
    elementLabel: string;
    odId: string | null;
  };
  severity: CommentSeverity;
  intent: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

interface MockMutationTask {
  taskId: string;
  target: string;
  intent: string;
  changeType: string;
  acceptanceText: string;
  priority: string;
}

interface MockMutationBatch {
  batchId: string;
  sessionId: string;
  sourceRevisionId: string;
  status: MutationBatchStatus;
  generatedFromCommentIds: string[];
  tasks: MockMutationTask[];
  approval: {
    required: true;
    approvedBy: string | null;
    approvedAt: string | null;
  };
  checksum: string;
}

interface MockRevisionManifestEntry {
  revisionId: string;
  parentRevisionId: string;
  sessionId: string;
  variantCount: VariantCount;
  baseline: { mode: BaselineMode; label: VariantLabel };
  appliedBatchId: string;
  appliedTaskIds: string[];
  unresolvedCommentIds: string[];
  diffSummary: {
    added: number;
    changed: number;
    removed: number;
  };
  createdAt: string;
}

interface MockHandoffBundle {
  sessionId: string;
  revisionHeadId: string;
  baseline: { mode: BaselineMode; label: VariantLabel };
  variantCount: VariantCount;
  storyRefs: string[];
  requirementRefs: string[];
  acceptanceRefs: string[];
  uiSpecRef: string;
  testSpecRef: string;
}

export async function installUiPrototypingStudioApiMocks(
  page: Page,
): Promise<void> {
  const sessions = new Map<string, MockSession>();
  const variantsBySession = new Map<string, MockVariant[]>();
  const commentsBySession = new Map<string, MockCommentEvent[]>();
  const batchesBySession = new Map<string, MockMutationBatch[]>();
  const revisionsBySession = new Map<string, MockRevisionManifestEntry[]>();
  const handoffBySession = new Map<string, MockHandoffBundle>();

  let sessionCounter = 0;
  let commentCounter = 0;
  let batchCounter = 0;
  let revisionCounter = 0;

  await page.route("**/api/ui-prototyping-studio/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (
      request.method() === "POST" &&
      url.pathname === "/api/ui-prototyping-studio/sessions"
    ) {
      const body = parseBody(request.postData());
      const requestedVariantCount = Number(body.requestedVariantCount ?? 3);

      if (
        !Number.isInteger(requestedVariantCount) ||
        requestedVariantCount < 1 ||
        requestedVariantCount > 3
      ) {
        await respond(route, 422, {
          code: "VARIANT_COUNT_OUT_OF_RANGE",
          message: "Variant count must be between 1 and 3",
          details: {
            requestedVariantCount,
          },
        });
        return;
      }

      sessionCounter += 1;
      const sessionId = `ups-session-${String(sessionCounter).padStart(4, "0")}`;
      const variantCount = requestedVariantCount as VariantCount;
      const session = buildSession(sessionId, variantCount);

      sessions.set(sessionId, session);
      variantsBySession.set(sessionId, []);
      commentsBySession.set(sessionId, []);
      batchesBySession.set(sessionId, []);
      revisionsBySession.set(sessionId, []);

      await respond(route, 201, session);
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/prompt$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respond(route, 404, {
          code: "SESSION_NOT_FOUND",
          message: "Session not found",
          details: { sessionId },
        });
        return;
      }

      const body = parseBody(request.postData());
      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
      if (prompt.length === 0) {
        await respond(route, 422, {
          code: "PROMPT_REQUIRED",
          message: "Prompt is required",
          details: {},
        });
        return;
      }

      const updated: MockSession = {
        ...session,
        prompt,
        state: "PromptCaptured",
      };
      sessions.set(sessionId, updated);

      await respond(route, 200, updated);
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/variants\/generate$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-3) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respond(route, 404, {
          code: "SESSION_NOT_FOUND",
          message: "Session not found",
          details: { sessionId },
        });
        return;
      }

      if (!session.prompt || session.prompt.trim().length === 0) {
        await respond(route, 409, {
          code: "PROMPT_NOT_SET",
          message: "Prompt must be submitted before variant generation",
          details: { sessionId },
        });
        return;
      }

      const variants = buildVariants(session);
      let updatedSession: MockSession = {
        ...session,
        state: "VariantsReady",
      };

      if (session.variantCount === 1) {
        updatedSession = {
          ...updatedSession,
          selectionGate: "satisfied",
          applyGate: "pending",
          baseline: {
            mode: "committed",
            label: "A",
          },
          revisionHeadId: "rev-0000",
          state: "BaselineReady",
        };
      } else {
        updatedSession = {
          ...updatedSession,
          selectionGate: "pending",
          applyGate: "pending",
          baseline: null,
        };
      }

      sessions.set(sessionId, updatedSession);
      variantsBySession.set(sessionId, variants);

      await respond(route, 200, {
        session: updatedSession,
        variants,
      });
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/baseline$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respond(route, 404, {
          code: "SESSION_NOT_FOUND",
          message: "Session not found",
          details: { sessionId },
        });
        return;
      }

      const variants = variantsBySession.get(sessionId) ?? [];
      if (variants.length === 0) {
        await respond(route, 500, {
          code: "VARIANT_GENERATION_COUNT_MISMATCH",
          message: "Baseline requires generated variants",
          details: { sessionId },
        });
        return;
      }

      const body = parseBody(request.postData());
      let label: VariantLabel;
      let mode: BaselineMode;

      if (session.variantCount > 1) {
        const selectedLabel =
          typeof body.selectedLabel === "string"
            ? body.selectedLabel.trim().toUpperCase()
            : "";

        if (!selectedLabel) {
          await respond(route, 409, {
            code: "BASELINE_SELECTION_REQUIRED",
            message: "Select a baseline before continuing",
            details: { sessionId },
          });
          return;
        }

        if (
          selectedLabel !== "A" &&
          selectedLabel !== "B" &&
          selectedLabel !== "C"
        ) {
          await respond(route, 422, {
            code: "BASELINE_LABEL_INVALID",
            message: "Selected baseline label is invalid",
            details: { selectedLabel },
          });
          return;
        }

        label = selectedLabel;
        mode = "selected";
      } else {
        label = "A";
        mode = "committed";
      }

      const updatedVariants = variants.map((variant) => {
        if (variant.variantLabel !== label) {
          return {
            ...variant,
            status: "candidate" as const,
          };
        }

        return {
          ...variant,
          status:
            mode === "committed"
              ? ("committed" as const)
              : ("selected" as const),
        };
      });

      const updatedSession: MockSession = {
        ...session,
        baseline: {
          mode,
          label,
        },
        selectionGate: "satisfied",
        applyGate: "pending",
        revisionHeadId: session.revisionHeadId ?? "rev-0000",
        state: "BaselineReady",
      };

      sessions.set(sessionId, updatedSession);
      variantsBySession.set(sessionId, updatedVariants);

      await respond(route, 200, {
        session: updatedSession,
        variants: updatedVariants,
      });
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/comments$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      if (session.selectionGate !== "satisfied") {
        await respond(route, 409, {
          code: "BASELINE_GATE_UNSATISFIED",
          message: "Baseline gate must be satisfied before comments",
          details: { sessionId },
        });
        return;
      }

      const body = parseBody(request.postData());
      const revisionId =
        typeof body.revisionId === "string" ? body.revisionId.trim() : "";
      const target =
        body.target && typeof body.target === "object"
          ? (body.target as Record<string, unknown>)
          : null;
      const selector =
        target && typeof target.selector === "string"
          ? target.selector.trim()
          : "";
      const elementLabel =
        target && typeof target.elementLabel === "string"
          ? target.elementLabel.trim()
          : "";
      const severity =
        typeof body.severity === "string"
          ? body.severity.trim().toLowerCase()
          : "";
      const intent = typeof body.intent === "string" ? body.intent.trim() : "";
      const note = typeof body.note === "string" ? body.note.trim() : "";

      if (
        !revisionId ||
        !selector ||
        !elementLabel ||
        !intent ||
        !note ||
        !["blocker", "high", "medium", "low"].includes(severity)
      ) {
        await respond(route, 422, {
          code: "COMMENT_SCHEMA_INVALID",
          message: "Comment payload is invalid",
          details: { sessionId },
        });
        return;
      }

      if (session.revisionHeadId && session.revisionHeadId !== revisionId) {
        await respond(route, 422, {
          code: "SOURCE_REVISION_INVALID",
          message: "Revision does not match current head",
          details: {
            sessionId,
            revisionHeadId: session.revisionHeadId,
            revisionId,
          },
        });
        return;
      }

      commentCounter += 1;
      const comment: MockCommentEvent = {
        commentId: `ups-comment-${String(commentCounter).padStart(5, "0")}`,
        sessionId,
        revisionId,
        target: {
          selector,
          elementLabel,
          odId:
            target &&
            typeof target.odId === "string" &&
            target.odId.trim().length > 0
              ? target.odId.trim()
              : null,
        },
        severity: severity as CommentSeverity,
        intent,
        note,
        createdBy:
          typeof body.createdBy === "string" && body.createdBy.trim().length > 0
            ? body.createdBy.trim()
            : "web-ui",
        createdAt: new Date().toISOString(),
      };

      const comments = commentsBySession.get(sessionId) ?? [];
      comments.push(comment);
      commentsBySession.set(sessionId, comments);

      sessions.set(sessionId, {
        ...session,
        state: "CommentsCaptured",
      });

      await respond(route, 201, comment);
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/mutation-batches\/synthesize$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-3) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const body = parseBody(request.postData());
      const sourceRevisionId =
        typeof body.sourceRevisionId === "string"
          ? body.sourceRevisionId.trim()
          : "";

      if (!sourceRevisionId) {
        await respond(route, 422, {
          code: "SOURCE_REVISION_INVALID",
          message: "Source revision is required",
          details: { sessionId },
        });
        return;
      }

      if (
        session.revisionHeadId &&
        session.revisionHeadId !== sourceRevisionId
      ) {
        await respond(route, 422, {
          code: "SOURCE_REVISION_INVALID",
          message: "Source revision does not match revision head",
          details: {
            sessionId,
            revisionHeadId: session.revisionHeadId,
            sourceRevisionId,
          },
        });
        return;
      }

      const orderedComments = (commentsBySession.get(sessionId) ?? []).filter(
        (comment) => comment.revisionId === sourceRevisionId,
      );
      if (orderedComments.length === 0) {
        await respond(route, 409, {
          code: "COMMENT_SET_EMPTY",
          message: "At least one comment is required for synthesis",
          details: { sessionId, sourceRevisionId },
        });
        return;
      }

      batchCounter += 1;
      const tasks: MockMutationTask[] = orderedComments.map(
        (comment, index) => ({
          taskId: `task-${sourceRevisionId.replace(/[^a-zA-Z0-9]/g, "")}-${String(index + 1).padStart(2, "0")}`,
          target: comment.target.selector,
          intent: comment.intent,
          changeType: inferChangeType(comment.intent),
          acceptanceText: `Apply ${comment.intent} at ${comment.target.selector}: ${comment.note}`,
          priority: inferPriority(comment.severity),
        }),
      );
      const generatedFromCommentIds = orderedComments.map(
        (comment) => comment.commentId,
      );

      const checksum = JSON.stringify({
        sourceRevisionId,
        generatedFromCommentIds,
        tasks,
      });

      const batch: MockMutationBatch = {
        batchId: `ups-batch-${String(batchCounter).padStart(5, "0")}`,
        sessionId,
        sourceRevisionId,
        status: "draft",
        generatedFromCommentIds,
        tasks,
        approval: {
          required: true,
          approvedBy: null,
          approvedAt: null,
        },
        checksum,
      };

      const batches = batchesBySession.get(sessionId) ?? [];
      batches.push(batch);
      batchesBySession.set(sessionId, batches);

      const updatedSession: MockSession = {
        ...session,
        applyGate: "pending",
        state: "MutationDrafted",
      };
      sessions.set(sessionId, updatedSession);

      await respond(route, 201, {
        session: updatedSession,
        batch,
      });
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/mutation-batches\/[^/]+\/approve$/.test(
        url.pathname,
      )
    ) {
      const parts = url.pathname.split("/");
      const sessionId = parts.at(-4) ?? "";
      const batchId = parts.at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const batches = batchesBySession.get(sessionId) ?? [];
      const batch = batches.find((candidate) => candidate.batchId === batchId);
      if (!batch) {
        await respond(route, 404, {
          code: "BATCH_NOT_FOUND",
          message: "Batch not found",
          details: { sessionId, batchId },
        });
        return;
      }

      if (batch.status !== "draft") {
        await respond(route, 409, {
          code: "BATCH_NOT_DRAFT",
          message: "Batch must be draft before approval",
          details: { batchId, status: batch.status },
        });
        return;
      }

      const body = parseBody(request.postData());
      const approvedBy =
        typeof body.approvedBy === "string" ? body.approvedBy.trim() : "";
      const approvedAt =
        typeof body.approvedAt === "string" ? body.approvedAt.trim() : "";
      if (!approvedBy || !approvedAt || Number.isNaN(Date.parse(approvedAt))) {
        await respond(route, 422, {
          code: "APPROVAL_METADATA_REQUIRED",
          message: "Approval metadata is required",
          details: { sessionId, batchId },
        });
        return;
      }

      if (
        session.revisionHeadId &&
        batch.sourceRevisionId !== session.revisionHeadId
      ) {
        await respond(route, 409, {
          code: "APPROVAL_STALE",
          message: "Approval is stale",
          details: {
            sessionId,
            revisionHeadId: session.revisionHeadId,
            sourceRevisionId: batch.sourceRevisionId,
          },
        });
        return;
      }

      const updatedBatch: MockMutationBatch = {
        ...batch,
        status: "approved",
        approval: {
          required: true,
          approvedBy,
          approvedAt,
        },
      };

      batchesBySession.set(
        sessionId,
        batches.map((candidate) =>
          candidate.batchId === batchId ? updatedBatch : candidate,
        ),
      );

      const updatedSession: MockSession = {
        ...session,
        applyGate: "satisfied",
        state: "MutationApproved",
      };
      sessions.set(sessionId, updatedSession);

      await respond(route, 200, {
        session: updatedSession,
        batch: updatedBatch,
      });
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/mutation-batches\/[^/]+\/apply$/.test(
        url.pathname,
      )
    ) {
      const parts = url.pathname.split("/");
      const sessionId = parts.at(-4) ?? "";
      const batchId = parts.at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const body = parseBody(request.postData());
      const applyRequestedBy =
        typeof body.applyRequestedBy === "string"
          ? body.applyRequestedBy.trim()
          : "web-ui";

      if (applyRequestedBy.toLowerCase() === "system:auto") {
        await respond(route, 409, {
          code: "AUTO_APPLY_FORBIDDEN",
          message: "Auto-apply is forbidden",
          details: { applyRequestedBy },
        });
        return;
      }

      const batches = batchesBySession.get(sessionId) ?? [];
      const batch = batches.find((candidate) => candidate.batchId === batchId);
      if (!batch) {
        await respond(route, 404, {
          code: "BATCH_NOT_FOUND",
          message: "Batch not found",
          details: { sessionId, batchId },
        });
        return;
      }

      if (batch.status !== "approved") {
        await respond(route, 409, {
          code: "BATCH_APPROVAL_REQUIRED",
          message: "Batch approval is required",
          details: { batchId, status: batch.status },
        });
        return;
      }

      if (
        session.revisionHeadId &&
        batch.sourceRevisionId !== session.revisionHeadId
      ) {
        await respond(route, 422, {
          code: "BATCH_STALE_FOR_HEAD",
          message: "Batch source revision is stale",
          details: {
            revisionHeadId: session.revisionHeadId,
            sourceRevisionId: batch.sourceRevisionId,
          },
        });
        return;
      }

      revisionCounter += 1;
      const revisionId = `rev-${String(revisionCounter).padStart(4, "0")}`;
      const parentRevisionId = session.revisionHeadId ?? "rev-0000";

      const appliedBatch: MockMutationBatch = {
        ...batch,
        status: "applied",
      };
      batchesBySession.set(
        sessionId,
        batches.map((candidate) =>
          candidate.batchId === batchId ? appliedBatch : candidate,
        ),
      );

      const revision: MockRevisionManifestEntry = {
        revisionId,
        parentRevisionId,
        sessionId,
        variantCount: session.variantCount,
        baseline: session.baseline ?? { mode: "committed", label: "A" },
        appliedBatchId: batchId,
        appliedTaskIds: appliedBatch.tasks.map((task) => task.taskId),
        unresolvedCommentIds: [],
        diffSummary: buildDiffSummary(appliedBatch.tasks),
        createdAt: new Date().toISOString(),
      };

      const revisions = revisionsBySession.get(sessionId) ?? [];
      revisions.push(revision);
      revisionsBySession.set(sessionId, revisions);

      const updatedSession: MockSession = {
        ...session,
        revisionHeadId: revisionId,
        applyGate: "pending",
        state: "RevisionRecorded",
      };
      sessions.set(sessionId, updatedSession);

      await respond(route, 200, {
        session: updatedSession,
        batch: appliedBatch,
        revision,
      });
      return;
    }

    if (
      request.method() === "POST" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/handoff\/export$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-3) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const revisions = revisionsBySession.get(sessionId) ?? [];
      if (
        revisions.length === 0 ||
        !session.revisionHeadId ||
        !session.baseline
      ) {
        await respond(route, 409, {
          code: "HANDOFF_REVISION_REQUIRED",
          message: "Handoff export requires applied revisions",
          details: { sessionId },
        });
        return;
      }

      const bundle: MockHandoffBundle = {
        sessionId,
        revisionHeadId: session.revisionHeadId,
        baseline: session.baseline,
        variantCount: session.variantCount,
        storyRefs: ["docs/features/ui-prototyping-studio/STORIES.md"],
        requirementRefs: [
          "docs/features/ui-prototyping-studio/SPEC.md#functional-requirements-mvp",
        ],
        acceptanceRefs: [
          "docs/features/ui-prototyping-studio/SPEC.md#acceptance-criteria-mvp",
        ],
        uiSpecRef: "docs/features/ui-prototyping-studio/UI-SPEC.md",
        testSpecRef: "docs/features/ui-prototyping-studio/TEST-SPEC.md",
      };
      handoffBySession.set(sessionId, bundle);

      const updatedSession: MockSession = {
        ...session,
        integration: {
          uiPhaseBridgeReady: true,
          generateTestsUiReady: true,
          uiImplementReady: true,
        },
        state: "RevisionRecorded",
      };
      sessions.set(sessionId, updatedSession);

      await respond(route, 200, {
        session: updatedSession,
        bundle,
      });
      return;
    }

    if (
      request.method() === "GET" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+$/.test(url.pathname)
    ) {
      const sessionId = url.pathname.split("/").at(-1) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respond(route, 404, {
          code: "SESSION_NOT_FOUND",
          message: "Session not found",
          details: { sessionId },
        });
        return;
      }

      await respond(route, 200, session);
      return;
    }

    if (
      request.method() === "GET" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/variants$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respond(route, 404, {
          code: "SESSION_NOT_FOUND",
          message: "Session not found",
          details: { sessionId },
        });
        return;
      }

      await respond(route, 200, {
        variants: variantsBySession.get(sessionId) ?? [],
      });
      return;
    }

    if (
      request.method() === "GET" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/mutation-batches\/draft$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-3) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const batchId = url.searchParams.get("batchId")?.trim();
      const drafts = (batchesBySession.get(sessionId) ?? []).filter(
        (batch) => batch.status === "draft",
      );

      const batch = batchId
        ? drafts.find((candidate) => candidate.batchId === batchId)
        : drafts.at(-1);

      if (!batch) {
        await respond(route, 404, {
          code: "DRAFT_BATCH_NOT_FOUND",
          message: "Draft batch not found",
          details: { sessionId, batchId },
        });
        return;
      }

      await respond(route, 200, batch);
      return;
    }

    if (
      request.method() === "GET" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/revisions$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const entries = [...(revisionsBySession.get(sessionId) ?? [])];
      const newestFirst = url.searchParams.get("newestFirst") !== "false";
      entries.sort((left, right) =>
        newestFirst
          ? right.createdAt.localeCompare(left.createdAt)
          : left.createdAt.localeCompare(right.createdAt),
      );

      const limitParam = Number(url.searchParams.get("limit") ?? "50");
      const limit =
        Number.isInteger(limitParam) && limitParam > 0 ? limitParam : 50;

      await respond(route, 200, {
        entries: entries.slice(0, limit),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      /\/api\/ui-prototyping-studio\/sessions\/[^/]+\/handoff$/.test(
        url.pathname,
      )
    ) {
      const sessionId = url.pathname.split("/").at(-2) ?? "";
      const session = sessions.get(sessionId);
      if (!session) {
        await respondNotFound(route, sessionId);
        return;
      }

      const bundle = handoffBySession.get(sessionId);
      if (!bundle) {
        await respond(route, 409, {
          code: "HANDOFF_BUNDLE_NOT_READY",
          message: "Handoff bundle not ready",
          details: { sessionId },
        });
        return;
      }

      await respond(route, 200, bundle);
      return;
    }

    await route.continue();
  });
}

function buildSession(
  sessionId: string,
  variantCount: VariantCount,
): MockSession {
  return {
    sessionId,
    prompt: null,
    variantCount,
    variantLabels: ["A", "B", "C"].slice(0, variantCount) as VariantLabel[],
    baseline: null,
    revisionHeadId: null,
    selectionGate: "pending",
    applyGate: "pending",
    integration: {
      uiPhaseBridgeReady: false,
      generateTestsUiReady: false,
      uiImplementReady: false,
    },
    state: "SessionInitialized",
  };
}

function buildVariants(session: MockSession): MockVariant[] {
  return session.variantLabels.map((variantLabel, index) => ({
    sessionId: session.sessionId,
    variantLabel,
    htmlArtifactRef: `/artifacts/ui-prototyping-studio/${session.sessionId}/${variantLabel.toLowerCase()}.html`,
    componentsUsed: [
      "StudioHeader",
      "VariantCanvas",
      index % 2 === 0 ? "SessionControlsPanel" : "SessionStateIndicator",
    ],
    rationale: `Variant ${variantLabel} emphasizes deterministic controls.`,
    tradeoffs: `Variant ${variantLabel} balances speed and reviewability.`,
    risk: `Variant ${variantLabel} may require baseline tuning.`,
    status: session.variantCount === 1 ? "committed" : "candidate",
  }));
}

function inferChangeType(intent: string): string {
  const normalized = intent.toLowerCase();
  if (normalized.includes("add") || normalized.includes("create")) {
    return "add";
  }
  if (normalized.includes("remove") || normalized.includes("delete")) {
    return "remove";
  }
  return "change";
}

function inferPriority(severity: CommentSeverity): string {
  switch (severity) {
    case "blocker":
      return "p0";
    case "high":
      return "p1";
    case "medium":
      return "p2";
    case "low":
    default:
      return "p3";
  }
}

function buildDiffSummary(tasks: MockMutationTask[]): {
  added: number;
  changed: number;
  removed: number;
} {
  let added = 0;
  let changed = 0;
  let removed = 0;

  for (const task of tasks) {
    if (task.changeType === "add") {
      added += 1;
      continue;
    }
    if (task.changeType === "remove") {
      removed += 1;
      continue;
    }
    changed += 1;
  }

  return {
    added,
    changed,
    removed,
  };
}

function parseBody(rawBody: string | null): Record<string, unknown> {
  if (!rawBody || rawBody.trim().length === 0) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawBody) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

async function respond(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function respondNotFound(route: Route, sessionId: string) {
  await respond(route, 404, {
    code: "SESSION_NOT_FOUND",
    message: "Session not found",
    details: { sessionId },
  });
}
