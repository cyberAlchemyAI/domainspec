# Interfaces: App Release

## Phase 1 Status

The Phase 1 implementation supersedes the abstract `/api/release-workspaces/...` shape below with concrete `/api/sessions/...` and `/api/graph/...` endpoints, plus two SSE streams. Older endpoints below (governance-queue, prototype-selection, track-playback) are deferred. See [PHASE-1-DESIGN.md § Architecture](./PHASE-1-DESIGN.md#architecture) for the runtime shape.

## External: Phase 1 HTTP API

All endpoints are local-only (`http://127.0.0.1:8770` by default). No auth header is required (single-user local-only runtime per [DECISIONS.md](./DECISIONS.md)). All bodies are JSON unless noted.

### POST /api/sessions

**Exposes:** [StartReleaseWorkspace](operations.md#startreleaseworkspace)

**Request:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| title | string | Optional human-readable session title; default derives from interview-script's first question |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 201 | Success | `{ sessionId, status: "active", createdAt }` |
| 400 | Validation error | `{ error: "..." }` |

The server emits a `session-created` event on the matching `/api/sessions/:id/stream` after this call returns.

---

### GET /api/sessions

**Exposes:** [ListPastSessions](queries.md#listpastsessions)

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | `[{ sessionId, title, status, endedAt, summaryExcerpt }]` (sorted by `endedAt` desc) |

Reads files under `domain_knowledge/sessions/` and parses their summary excerpts.

---

### GET /api/sessions/:id

**Exposes:** [GetSessionSummary](queries.md#getsessionsummary)

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | `{ sessionId, title, summary, decisions, filesTouched, nextSessionPrompt }` |
| 404 | Not found | `{ error: "session not found" }` |

---

### POST /api/sessions/:id/turns

**Exposes:** [CaptureInterviewTurn](operations.md#captureinterviewturn)

**Request:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| turnText | string | User's message |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 202 | Accepted | `{ turnId, ack: true }` (full response streams via SSE on `/api/sessions/:id/stream`) |
| 404 | Session missing | — |
| 409 | Session not active | — |

---

### POST /api/sessions/:id/end

**Exposes:** [EndSession](operations.md#endsession)

**Request:** empty body.

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | `{ sessionId, status: "ended", filePath }` |
| 404 | Session missing | — |
| 409 | Already ended | `{ sessionId, status: "ended", filePath, idempotent: true }` |

---

### POST /api/sessions/:id/resume

**Exposes:** [ResumeSession](operations.md#resumesession)

**Request:** empty body.

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | `{ sessionId, status: "active", resumedFromFilePath }` |
| 404 | Session file missing | — |
| 422 | Session has no summary section | `{ error: "summary required to resume" }` |

---

### GET /api/graph/index

**Exposes:** [GetWorkspaceOverview](queries.md#getworkspaceoverview), [InspectGraphNode](queries.md#inspectgraphnode)

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | `{ nodes: [...], edges: [...], metrics: { nodes, edges, axioms, drafts } }` |

`metrics.nodes` excludes `domain_knowledge/sessions/**` per spec.

---

## External: Phase 1 SSE Streams

Both streams use `text/event-stream`. Each `event:` line corresponds to one of the documented event types in [events.md](events.md). Clients reconnect with `Last-Event-ID` to resume.

### GET /api/graph/stream

Emits `graph-delta` events (one per debounced watcher batch under [ProjectionRefreshPolicy](workflows.md#projectionrefreshpolicy)).

```
event: graph-delta
id: <monotonic-id>
data: { "added": [...], "updated": [...], "removed": [...], "metrics": {...} }
```

### GET /api/sessions/:id/stream

Emits chat events for one session. Sequence per turn:

```
event: text-delta            # repeated, streaming
event: tool-use-start         # zero or more
event: tool-use-result        # one per tool-use-start
event: text-delta            # may resume after tool use
event: done                   # one per turn
```

`error` events may interrupt at any point and end the turn.

---

## Internal: ChatProvider Interface

**Consumers:** server's `/api/sessions/:id/turns` handler

```
respond(sessionId: string, userTurn: string, ctx: SessionContext): AsyncIterable<ChatEvent>

ChatEvent =
  | { type: "text-delta", text: string }
  | { type: "tool-use-start", toolName: string, input: object }
  | { type: "tool-use-result", toolName: string, output: object | { error: string } }
  | { type: "done" }
  | { type: "error", message: string }
```

Phase 1 ships one implementation: `claude-oauth` wrapping `@anthropic-ai/claude-agent-sdk`. Future implementations (`claude-api`, `openai-api`, `gemini-api`) slot in alongside.

---

## External: Release Workspace API (HTTP)

> **Phase 1 status:** the endpoints below are the broader long-term API surface. Phase 1 implements the narrower `/api/sessions/...` and `/api/graph/...` shape above. The endpoints below remain the reference for governance-queue, prototype-selection, and track-playback when those capabilities ship.

### POST /api/release-workspaces

**Exposes:** [StartReleaseWorkspace](operations.md#startreleaseworkspace)
**Auth:** Local authenticated operator session

**Request:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| title | string | [StartReleaseWorkspace](operations.md#startreleaseworkspace).title |
| scopeMode | string | [StartReleaseWorkspace](operations.md#startreleaseworkspace).scopeMode |
| runtimeMode | string | [StartReleaseWorkspace](operations.md#startreleaseworkspace).runtimeMode |
| graphPriorityMode | string | [StartReleaseWorkspace](operations.md#startreleaseworkspace).graphPriorityMode |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 201 | Success | Workspace identifier and initial status |
| 400 | Rule violation | Validation errors |

---

### POST /api/release-workspaces/{workspaceId}/interview-turns

**Exposes:** [CaptureInterviewTurn](operations.md#captureinterviewturn)
**Auth:** Local authenticated operator session

**Request:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| turnText | string | [CaptureInterviewTurn](operations.md#captureinterviewturn).turnText |
| actorRole | string | [CaptureInterviewTurn](operations.md#captureinterviewturn).actorRole |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 202 | Success | Accepted turn and extraction summary |
| 404 | Workspace missing | Not-found error |

---

### POST /api/release-workspaces/{workspaceId}/projection-refresh

**Exposes:** [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection)
**Auth:** Local authenticated operator session

**Request:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| projectionReason | string | [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection).projectionReason |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | Refreshed overview payload |
| 409 | Policy violation | Projection blocking error |

---

### GET /api/release-workspaces/{workspaceId}/overview

**Exposes:** [GetWorkspaceOverview](queries.md#getworkspaceoverview)
**Auth:** Local authenticated operator session

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | Synchronized workspace overview |
| 404 | Workspace missing | Not-found error |

---

### GET /api/release-workspaces/{workspaceId}/graph/nodes/{nodeId}

**Exposes:** [InspectGraphNode](queries.md#inspectgraphnode)
**Auth:** Local authenticated operator session

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | Node details, relationships, and workflow lineage |
| 404 | Node missing | Not-found error |

---

### GET /api/release-workspaces/{workspaceId}/governance-queue

**Exposes:** [ListGovernanceQueue](queries.md#listgovernancequeue)
**Auth:** Local authenticated operator session

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | Prioritized governance items |

---

### POST /api/release-workspaces/{workspaceId}/prototype-selection

**Exposes:** [SelectPrototypeVariant](operations.md#selectprototypevariant)
**Auth:** Local authenticated operator session

**Request:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| prototypeVariantId | string | [SelectPrototypeVariant](operations.md#selectprototypevariant).prototypeVariantId |
| critiqueSummary | string | [SelectPrototypeVariant](operations.md#selectprototypevariant).critiqueSummary |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | Selected variant summary |
| 409 | Rule violation | Selection conflict error |

---

### POST /api/release-workspaces/{workspaceId}/track-playback

**Exposes:** [StartTrackPlayback](operations.md#starttrackplayback)
**Auth:** Local authenticated operator session

**Request:**

| Field | Type | Maps To |
| ----- | ---- | ------- |
| trackSource | string | [StartTrackPlayback](operations.md#starttrackplayback).trackSource |

**Responses:**

| Status | Condition | Body |
| ------ | --------- | ---- |
| 200 | Success | Playback session state |
| 409 | Policy violation | Playback start rejected |

---

## Internal: ReleaseWorkspaceProjection Interface

**Consumers:** Local workspace shell, graph panel, governance panel, prototype panel

| Method | Maps To | Description |
| ------ | ------- | ----------- |
| refreshProjection | [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection) operation | Recomputes synchronized workspace surfaces |
| getWorkspaceOverview | [GetWorkspaceOverview](queries.md#getworkspaceoverview) query | Reads the current release summary |
| inspectGraphNode | [InspectGraphNode](queries.md#inspectgraphnode) query | Reads node-level graph and workflow detail |
| listGovernanceQueue | [ListGovernanceQueue](queries.md#listgovernancequeue) query | Reads prioritized next actions |
