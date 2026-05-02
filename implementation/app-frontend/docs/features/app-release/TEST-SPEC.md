---
tags: [app-release, harness, phase-1, test-spec]
node_type: test
is_session: false
layer: application, architecture
nature: technical, reference
status: draft
version: 0.1.0
last_updated: 2026-04-30
---

# Test Specification: App Release (Phase 1)

## Objective

This document is the executable test obligations contract for the Phase 1 surface of the app-release feature. It answers the question: "what must be true of the implementation, and which test asserts it?" Every row traces back to a row in [SPEC.md](./SPEC.md), [domain.md](./domain.md), [operations.md](./operations.md), [interfaces.md](./interfaces.md), [events.md](./events.md), [queries.md](./queries.md), [mappings.md](./mappings.md), [workflows.md](./workflows.md), [states.md](./states.md), or [STORIES.md](./STORIES.md) per the rules in [`TEST-PIPELINE.md`](../../../../../TEST-PIPELINE.md). Tests for deferred concepts (governance queue, prototype variant, fractal playback) are out of scope here.

## Test Infrastructure

| Item | Convention |
| ---- | ---------- |
| Unit/integration runner | `node --test` (no extra dep) |
| E2E runner | `@playwright/test ^1.59.x`, chromium project, headless against `http://127.0.0.1:8770` started by the test harness |
| Test directory (unit/integration) | `visualizations/app-release/lib/*.test.mjs`, `visualizations/app-release/server.test.mjs` |
| Test directory (E2E) | `visualizations/app-release/tests/e2e/*.spec.mjs` |
| Fixture dir | `visualizations/app-release/tests/fixtures/domain_knowledge/` — minimal seeded markdown nodes for graph parser tests |
| Mocking strategy | `claude-oauth` provider is mocked in unit tests via a `MockChatProvider` that emits a deterministic event stream; real SDK only exercised in one tagged `live` E2E test (skipped in CI without `CLAUDE_CODE_OAUTH=1`) |
| Watcher fixture | Tests against a temp `domain_knowledge/` dir created via `mkdtemp()` to avoid polluting the real one |

## Implementation Test Hooks

The Phase 1 server exposes minimal hooks for deterministic testing:

| Hook | Returns / Effect |
| ---- | ---------------- |
| `GET /api/_test/state` (only when `NODE_ENV=test`) | `{ activeSessionIds, watcherDebounceQueueLength, indexSnapshotVersion }` |
| `MockChatProvider` (test-only) | A `ChatProvider` impl whose `respond()` returns a scripted async iterable; tests inject the script at session start |
| `forceWatcherFlush()` (test-only export) | Drains the debounce queue synchronously |

## Source Coverage Summary

| Source | Rule | Estimated Tests |
| ------ | ---- | ---------------:|
| states.md (`InterviewSessionLifecycle`) | TP-1 transition + TP-2 negative + TP-3 invariant | ~10 |
| operations.md (Phase 1 ops only) | TP-4 rule + TP-5 calc + TP-6 postcondition + TP-7 error | ~75 |
| interfaces.md (Phase 1 REST + SSE) | TP-8 contract | ~30 |
| events.md (Phase 1 SSE events) | TP-10 producer + TP-11 consumer | ~14 |
| queries.md (Phase 1 queries) | TP-12 query | ~10 |
| workflows.md | TP-13 workflow | ~6 |
| mappings.md | TP-14 mapping | ~14 |
| STORIES.md (US-1, US-2, US-3, US-4, US-9 → US-13) | E2E | ~9 |
| **Total** | | **~168** |

---

## Catalogue

Each row: ID · Test description · Source row in the spec · Spec file · Notes.

### state-machine — InterviewSessionLifecycle (states.md)

> Source: [states.md § InterviewSessionLifecycle](./states.md#interviewsessionlifecycle)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-IS-1 | `draft → active` on session creation | Transition row 1 | `lib/session-store.test.mjs` | TP-1 |
| T-IS-2 | `active → ended` on confirmed end | Transition row 2 | `lib/session-store.test.mjs` | TP-1 |
| T-IS-3 | `ended → active` on resume when summary present | Transition row 3 | `lib/session-store.test.mjs` | TP-1 |
| T-IS-4 | reject `end` on a `draft` session (no `active` skip) | I1 | `lib/session-store.test.mjs` | TP-2 |
| T-IS-5 | reject `resume` when summary section missing (state stays `ended`) | Transition row 3 guard | `lib/session-store.test.mjs` | TP-2 |
| T-IS-6 | reject `turns` on an `ended` session | implicit from R2 of CaptureInterviewTurn | `lib/session-store.test.mjs` | TP-2 |
| T-IS-7 | property: every reachable `ended` session was preceded by `active` | I1 | `lib/session-store.test.mjs` | TP-3 |
| T-IS-8 | property: file size after resume ≥ file size before resume | I2 | `lib/session-store.test.mjs` | TP-3 |
| T-IS-9 | property: in-memory map only holds `active` sessions | I3 | `lib/session-store.test.mjs` | TP-3 |
| T-IS-10 | concurrent active sessions: 3 sessions can be `active` simultaneously without lock contention | I4 | `lib/session-store.test.mjs` | TP-3 |

### operations — StartReleaseWorkspace (operations.md)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-SRW-1 | accepts greenfield-only / local-only / graph-first | R1, R2, R3 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-SRW-2 | rejects non-greenfield scope mode | R1 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-SRW-3 | rejects non-local runtime mode | R2 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-SRW-4 | rejects empty title | error states row 2 | `lib/session-store.test.mjs` | TP-7 |
| T-OP-SRW-5 | initial readiness score = (configured/3.0) | C1 | `lib/session-store.test.mjs` | TP-5 |
| T-OP-SRW-6 | postcondition: workspace exists with explicit decisions | postconditions bullet 1 | `lib/session-store.test.mjs` | TP-6 |
| T-OP-SRW-7 | postcondition: WorkspaceInitialized event emitted | postconditions bullet 2 | `lib/session-store.test.mjs` | TP-6 |

### operations — CaptureInterviewTurn (operations.md)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-CIT-1 | rejects empty/whitespace turn text | R1 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-CIT-2 | rejects turn against `ended` session | R2 + InterviewSessionLifecycle | `lib/session-store.test.mjs` | TP-4 |
| T-OP-CIT-3 | every generated node retains evidence link | R3 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-CIT-4 | ambiguity increment = `count(extracted_ambiguities)` | C1 | `lib/providers/claude-oauth.test.mjs` | TP-5 |
| T-OP-CIT-5 | evidence coverage ratio computed correctly | C2 | `lib/providers/claude-oauth.test.mjs` | TP-5 |
| T-OP-CIT-6 | postcondition: DomainMap receives extracted entities | postconditions bullet 1 | integration | TP-6 |

### operations — EndSession (operations.md)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-END-1 | only `active` sessions can be ended | R1 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-END-2 | ending an `ended` session is idempotent | R2 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-END-3 | session document write completes before in-memory clear | R3 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-END-4 | postcondition: `domain_knowledge/sessions/<ts>-<slug>.md` exists with required sections | postconditions bullet 1 | `lib/skill-runner.test.mjs` | TP-6 |
| T-OP-END-5 | postcondition: in-memory session cleared | postconditions bullet 2 | `lib/session-store.test.mjs` | TP-6 |
| T-OP-END-6 | postcondition: `done` SSE emitted before stream close | postconditions bullet 3 | `server.test.mjs` | TP-6 |
| T-OP-END-7 | error state: 404 on missing session | error states row 1 | `server.test.mjs` | TP-7 |
| T-OP-END-8 | error state: skill failure leaves session `active` and surfaces error | error states row 3 | `lib/session-store.test.mjs` | TP-7 |

### operations — ResumeSession (operations.md)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-RES-1 | only `ended` sessions can be resumed | R1 | `lib/session-store.test.mjs` | TP-4 |
| T-OP-RES-2 | model context contains summary section, not transcript | R2 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-RES-3 | original file is preserved (size monotonic) | R3 | `lib/skill-runner.test.mjs` | TP-4 |
| T-OP-RES-4 | postcondition: original file gains `## Resumed at <ISO-timestamp>` section | postconditions bullet 2 | `lib/skill-runner.test.mjs` | TP-6 |
| T-OP-RES-5 | postcondition: new SDK conversation seeded with summary + next-session prompt | postconditions bullet 1 | `lib/providers/claude-oauth.test.mjs` | TP-6 |
| T-OP-RES-6 | error state: 404 on missing session file | error states row 1 | `server.test.mjs` | TP-7 |
| T-OP-RES-7 | error state: 422 when summary section missing | error states row 2 | `server.test.mjs` | TP-7 |
| T-OP-RES-8 | error state: append-section failure rolls back (no new tab opened) | error states row 3 | `lib/session-store.test.mjs` | TP-7 |

### operations — WriteMarkdownNode (operations.md, agent tool)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-WMN-1 | accepts path inside `domain_knowledge/` | R1 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-WMN-2 | rejects `..` traversal | R1 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-WMN-3 | rejects absolute paths | R1 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-WMN-4 | rejects when path already exists (suggests AppendSection/UpdateFrontmatter) | R2 + error states row 2 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-WMN-5 | rejects when frontmatter missing `node_type` | R3 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-WMN-6 | postcondition: file exists with given content | postconditions bullet 1 | `lib/providers/claude-oauth.test.mjs` | TP-6 |
| T-OP-WMN-7 | postcondition: watcher emits IndexDelta with new node | postconditions bullet 2 | `lib/graph-watcher.test.mjs` | TP-6 |
| T-OP-WMN-8 | postcondition: graph SSE emits `graph-delta` | postconditions bullet 3 | `server.test.mjs` | TP-6 |
| T-OP-WMN-9 | postcondition: chat SSE emits `tool-use-result` narrating "✓ wrote `<path>`" | postconditions bullet 4 | `server.test.mjs` | TP-6 |

### operations — AppendSection (operations.md, agent tool)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-APS-1 | accepts path inside `domain_knowledge/` | R1 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-APS-2 | rejects when path does not exist | R2 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-APS-3 | rejects heading not starting with `## ` | R3 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-APS-4 | postcondition: file ends with new section | postconditions bullet 1 | `lib/providers/claude-oauth.test.mjs` | TP-6 |
| T-OP-APS-5 | postcondition: watcher emits IndexDelta with content change | postconditions bullet 2 | `lib/graph-watcher.test.mjs` | TP-6 |
| T-OP-APS-6 | postcondition: chat SSE emits `tool-use-result` | postconditions bullet 3 | `server.test.mjs` | TP-6 |

### operations — UpdateFrontmatter (operations.md, agent tool)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-UFM-1 | rejects patches that null-out `node_type` | R1 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-UFM-2 | rejects `last_updated` set to a non-current ISO date | R2 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-UFM-3 | postcondition: frontmatter reflects merged patch; body preserved verbatim | postconditions bullet 1 | `lib/providers/claude-oauth.test.mjs` | TP-6 |
| T-OP-UFM-4 | postcondition: watcher emits IndexDelta for updated node | postconditions bullet 2 | `lib/graph-watcher.test.mjs` | TP-6 |

### operations — AddConnection (operations.md, agent tool)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-ADC-1 | rejects when source file missing | R1 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-ADC-2 | creates `## Connections` header if absent then appends | R2 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-ADC-3 | rejects duplicate (target, relationType) row (idempotent) | R3 | `lib/providers/claude-oauth.test.mjs` | TP-4 |
| T-OP-ADC-4 | postcondition: new row appended to `## Connections` table | postconditions bullet 1 | `lib/providers/claude-oauth.test.mjs` | TP-6 |
| T-OP-ADC-5 | postcondition: watcher emits IndexDelta with new edge | postconditions bullet 2 | `lib/graph-watcher.test.mjs` | TP-6 |
| T-OP-ADC-6 | postcondition: chat SSE emits `tool-use-result` narration | postconditions bullet 3 | `server.test.mjs` | TP-6 |

### operations — GenerateWorkspaceProjection (operations.md, in scope, watcher-triggered)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-OP-GWP-1 | watcher event triggers projection refresh within debounce window | R1 + ProjectionRefreshPolicy | `lib/graph-watcher.test.mjs` | TP-4 |
| T-OP-GWP-2 | empty graph in graph-first mode blocks refresh | R2 | `lib/graph-index.test.mjs` | TP-4 |
| T-OP-GWP-3 | projection completeness ratio computed | C1 | `lib/graph-index.test.mjs` | TP-5 |
| T-OP-GWP-4 | postcondition: ProjectionRefreshed event emitted (mapped to `graph-delta` SSE) | postconditions bullet 2 | `server.test.mjs` | TP-6 |

### interfaces — Phase 1 HTTP API (interfaces.md)

> Source: [interfaces.md § External: Phase 1 HTTP API](./interfaces.md#external-phase-1-http-api)

| Test ID | Description | Endpoint × status | File | Type |
| ------- | ----------- | ----------------- | ---- | ---- |
| T-IF-1 | POST /api/sessions returns 201 with `{ sessionId, status: "active", createdAt }` | POST /api/sessions → 201 | `server.test.mjs` | TP-8 |
| T-IF-2 | POST /api/sessions returns 400 on validation error | POST /api/sessions → 400 | `server.test.mjs` | TP-8 |
| T-IF-3 | GET /api/sessions returns past sessions sorted by endedAt desc | GET /api/sessions → 200 | `server.test.mjs` | TP-8 |
| T-IF-4 | GET /api/sessions/:id returns summary fields | GET /api/sessions/:id → 200 | `server.test.mjs` | TP-8 |
| T-IF-5 | GET /api/sessions/:id returns 404 for missing session | GET /api/sessions/:id → 404 | `server.test.mjs` | TP-8 |
| T-IF-6 | POST /api/sessions/:id/turns returns 202 ack with turnId | POST /api/sessions/:id/turns → 202 | `server.test.mjs` | TP-8 |
| T-IF-7 | POST /api/sessions/:id/turns returns 404 for missing session | → 404 | `server.test.mjs` | TP-8 |
| T-IF-8 | POST /api/sessions/:id/turns returns 409 when session not active | → 409 | `server.test.mjs` | TP-8 |
| T-IF-9 | POST /api/sessions/:id/end returns 200 with filePath | POST /api/sessions/:id/end → 200 | `server.test.mjs` | TP-8 |
| T-IF-10 | POST /api/sessions/:id/end is idempotent (409 with `idempotent: true` on already-ended) | → 409 idempotent | `server.test.mjs` | TP-8 |
| T-IF-11 | POST /api/sessions/:id/end returns 404 for missing session | → 404 | `server.test.mjs` | TP-8 |
| T-IF-12 | POST /api/sessions/:id/resume returns 200 with `resumedFromFilePath` | POST /api/sessions/:id/resume → 200 | `server.test.mjs` | TP-8 |
| T-IF-13 | POST /api/sessions/:id/resume returns 404 for missing file | → 404 | `server.test.mjs` | TP-8 |
| T-IF-14 | POST /api/sessions/:id/resume returns 422 when summary missing | → 422 | `server.test.mjs` | TP-8 |
| T-IF-15 | GET /api/graph/index returns `{ nodes, edges, metrics: {nodes,edges,axioms,drafts} }` | GET /api/graph/index → 200 | `server.test.mjs` | TP-8 |
| T-IF-16 | GET /api/graph/index excludes `domain_knowledge/sessions/**` from `metrics.nodes` | metrics spec | `server.test.mjs` | TP-8 |

### interfaces — Phase 1 SSE Streams (interfaces.md)

| Test ID | Description | SSE shape | File | Type |
| ------- | ----------- | --------- | ---- | ---- |
| T-IF-SSE-1 | GET /api/graph/stream emits `Content-Type: text/event-stream` | header | `server.test.mjs` | TP-8 |
| T-IF-SSE-2 | GET /api/graph/stream emits `graph-delta` after a watcher event | event flow | `server.test.mjs` | TP-8 |
| T-IF-SSE-3 | GET /api/graph/stream supports `Last-Event-ID` reconnect | reconnect | `server.test.mjs` | TP-8 |
| T-IF-SSE-4 | GET /api/sessions/:id/stream emits `session-created` once on first read | event flow | `server.test.mjs` | TP-8 |
| T-IF-SSE-5 | GET /api/sessions/:id/stream emits sequence `text-delta*, tool-use-start?, tool-use-result?, done` per turn | event flow | `server.test.mjs` | TP-8 |
| T-IF-SSE-6 | GET /api/sessions/:id/stream emits `error` on tool rejection without closing if more text-deltas follow | error handling | `server.test.mjs` | TP-8 |
| T-IF-SSE-7 | GET /api/sessions/:id/stream emits `error` with code `AUTH_MISSING` and closes when OAuth absent | error handling | `server.test.mjs` | TP-8 |

### events — Phase 1 SSE event payloads (events.md)

| Test ID | Description | Source | File | Type |
| ------- | ----------- | ------ | ---- | ---- |
| T-EV-1 | SessionCreated payload contains `{ sessionId, createdAt, firstQuestion }` | events.md SessionCreated | `server.test.mjs` | TP-10 |
| T-EV-2 | GraphDelta payload contains `{ added, updated, removed, metrics }` | events.md GraphDelta | `server.test.mjs` | TP-10 |
| T-EV-3 | TextDelta payload contains `{ text }` and concatenates in order client-side | events.md TextDelta | `tests/e2e/happy-path.spec.mjs` | TP-10 |
| T-EV-4 | Tool-Use Start payload contains `{ toolUseId, toolName, input }` | events.md Tool-Use Start | `server.test.mjs` | TP-10 |
| T-EV-5 | Tool-Use Result payload contains `{ toolUseId, toolName, output }` correlating with the matching start | events.md Tool-Use Result | `server.test.mjs` | TP-10 |
| T-EV-6 | Done event has empty payload and signals turn end | events.md Done | `server.test.mjs` | TP-10 |
| T-EV-7 | SSE Error payload contains stable `code` from {AUTH_MISSING, WATCHER_OVERFLOW, TOOL_REJECTED} | events.md SSE Error | `server.test.mjs` | TP-10 |
| T-EV-CONS-1 | UI consumer renders new tab on `session-created` | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |
| T-EV-CONS-2 | embedded graph applies delta on `graph-delta` without full re-render | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |
| T-EV-CONS-3 | metrics cards update after `graph-delta` | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |
| T-EV-CONS-4 | chat panel renders in-progress narration box on `tool-use-start` | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |
| T-EV-CONS-5 | chat panel replaces narration box with ✓ on `tool-use-result` | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |
| T-EV-CONS-6 | UI re-enables input on `done` | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |
| T-EV-CONS-7 | UI surfaces banner on SSE error with `AUTH_MISSING` instructing "abrir Claude Code e fazer login" | consumer row | `tests/e2e/happy-path.spec.mjs` | TP-11 |

### queries — Phase 1 (queries.md)

| Test ID | Description | Source | File | Type |
| ------- | ----------- | ------ | ---- | ---- |
| T-Q-1 | GetWorkspaceOverview returns metrics shape `{ nodes, edges, axioms, drafts }` | queries.md GetWorkspaceOverview | `lib/graph-index.test.mjs` | TP-12 |
| T-Q-2 | GetWorkspaceOverview excludes `domain_knowledge/sessions/**` from node count | metrics spec | `lib/graph-index.test.mjs` | TP-12 |
| T-Q-3 | GetWorkspaceOverview returns 0 metrics for an empty `domain_knowledge/` | empty result | `lib/graph-index.test.mjs` | TP-12 |
| T-Q-4 | InspectGraphNode returns relationships and evidence breadth | queries.md InspectGraphNode | `lib/graph-index.test.mjs` | TP-12 |
| T-Q-5 | ListPastSessions returns sessions sorted by `endedAt` desc | queries.md ListPastSessions output ordering | `server.test.mjs` | TP-12 |
| T-Q-6 | ListPastSessions respects `limit` filter | filters row | `server.test.mjs` | TP-12 |
| T-Q-7 | ListPastSessions respects `since` filter | filters row | `server.test.mjs` | TP-12 |
| T-Q-8 | ListPastSessions returns empty array when no session files exist | empty result | `server.test.mjs` | TP-12 |
| T-Q-9 | GetSessionSummary returns named sections only (no transcript) | queries.md GetSessionSummary "Important" note | `server.test.mjs` | TP-12 |
| T-Q-10 | GetSessionSummary returns 422 when document has no `## Summary` section | implicit from the "Important" rule | `server.test.mjs` | TP-12 |

### workflows — GuidedReleaseWorkspaceWorkflow + ProjectionRefreshPolicy (workflows.md)

| Test ID | Description | Source row | File | Type |
| ------- | ----------- | ---------- | ---- | ---- |
| T-WF-1 | happy path: workspace start → turn → projection refresh → review-ready (Phase 1 stops at tool-write loop, asserts no progression beyond that) | step table rows 1–4 | `tests/e2e/happy-path.spec.mjs` | TP-13 |
| T-WF-2 | every projected graph node has evidence link | invariant I1 | `lib/graph-index.test.mjs` | TP-13 |
| T-WF-3 | watcher debounce coalesces multi-file batch from a single tool call into one delta within 200ms | ProjectionRefreshPolicy `watcherDebounceMs` | `lib/graph-watcher.test.mjs` | TP-13 |
| T-WF-4 | watcher ignores `.git/**` and `node_modules/**` | ProjectionRefreshPolicy `watcherIgnoreGlobs` | `lib/graph-watcher.test.mjs` | TP-13 |
| T-WF-5 | watcher overflow: batch > `watcherBatchOverflow` triggers full re-snapshot + `WATCHER_OVERFLOW` error event | ProjectionRefreshPolicy `watcherBatchOverflow` | `lib/graph-watcher.test.mjs` | TP-13 |
| T-WF-6 | empty graph in graph-first mode blocks projection refresh | LocalPlaybackPolicy is deferred; ProjectionRefreshPolicy decision row 1 | `lib/graph-index.test.mjs` | TP-13 |

### mappings — InterviewTurnToDomainMapUpdate pipeline (mappings.md)

| Test ID | Description | Stage | File | Type |
| ------- | ----------- | ----- | ---- | ---- |
| T-MP-1 | stage 1: turn against an active session begins `respond()` async iterator | Stage 1 | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-2 | stage 1 failure: turn against ended session returns 409 | Stage 1 failure | `server.test.mjs` | TP-14 |
| T-MP-3 | stage 2: ChatProvider emits expected ChatEvent variants | Stage 2 | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-4 | stage 2 failure: missing OAuth → `error` event with `AUTH_MISSING` | Stage 2 failure | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-5 | stage 3: tool-use-start dispatches the matching tool op | Stage 3 | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-6 | stage 3 failure: bad tool input → `tool-use-result { error }` | Stage 3 failure | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-7 | stage 4: tool input writes a file under `domain_knowledge/` | Stage 4 | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-8 | stage 4 failure: path-escape rejected | Stage 4 failure | `lib/providers/claude-oauth.test.mjs` | TP-14 |
| T-MP-9 | stage 5: file write produces typed `IndexDelta` after debounce | Stage 5 | `lib/graph-watcher.test.mjs` | TP-14 |
| T-MP-10 | stage 5 failure: overflow triggers full re-snapshot + WATCHER_OVERFLOW | Stage 5 failure | `lib/graph-watcher.test.mjs` | TP-14 |
| T-MP-11 | stage 6: IndexDelta produces `graph-delta` SSE event | Stage 6 | `server.test.mjs` | TP-14 |
| T-MP-12 | stage 6 failure: client disconnect → buffered for `Last-Event-ID` reconnect | Stage 6 failure | `server.test.mjs` | TP-14 |
| T-MP-13 | DomainMapToWorkspaceOverview: nodeCount/edgeCount/unresolvedAmbiguityCount mapped direct | mappings.md DomainMapToWorkspaceOverview | `lib/graph-index.test.mjs` | TP-14 |
| T-MP-14 | DomainMapToWorkspaceOverview validation: status must align with [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle) | validation row | `lib/graph-index.test.mjs` | TP-14 |

### E2E — STORIES.md (Phase 1 in scope)

> Source: [STORIES.md](./STORIES.md). Each scenario maps to one Playwright spec; existing US-1 → US-4 are reinterpreted in the Phase 1 surface.

| Test ID | Story | Acceptance criteria | Spec file |
| ------- | ----- | ------------------- | --------- |
| T-E2E-US1 | US-1 Start a greenfield release workspace | session created with greenfield/local/graph-first; lifecycle enters `active`; SessionCreated event preserves decisions | `tests/e2e/happy-path.spec.mjs` |
| T-E2E-US2 | US-2 Capture domain evidence through the interview loop | empty turns rejected; generated concepts retain evidence; ambiguities preserved | `tests/e2e/happy-path.spec.mjs` |
| T-E2E-US3 | US-3 Inspect the discovered domain through a graph-first workspace | empty graph blocks projection; overview includes counts; `graph-delta` event emitted | `tests/e2e/happy-path.spec.mjs` |
| T-E2E-US4 | US-4 Inspect a graph node with workflow lineage and rationale | clicking a node opens expanded view at `/visualizations/ontology-visualization?source=domain_knowledge` | `tests/e2e/happy-path.spec.mjs` |
| T-E2E-US9 | US-9 Agent file-write narrates inline as a tool-use box | in-progress box on `tool-use-start`; replaced with ✓/✗ on `tool-use-result`; correlation by `toolUseId`; ordering preserved | `tests/e2e/happy-path.spec.mjs` |
| T-E2E-US10 | US-10 Filesystem edit triggers a live graph delta | new node within debounce window; removed node reflected; metrics update; `sessions/**` excluded; `.git/**`, `node_modules/**` ignored | `tests/e2e/happy-path.spec.mjs` |
| T-E2E-US11 | US-11 Combined-modal close across multi-tab | two tabs → combined modal lists both → confirm calls end on each → idempotent on partial failure → all strings in Portuguese | `tests/e2e/multi-tab-close.spec.mjs` |
| T-E2E-US12 | US-12 Resume appends to original file with summary-only seed | original preserved byte-for-byte before timestamp section; transcript NOT in seed prompt; 422 when no summary | `tests/e2e/resume.spec.mjs` |
| T-E2E-US13 | US-13 End writes session document under `domain_knowledge/sessions/` | file exists at expected path; frontmatter has `node_type: session` + `last_updated`; 5 required sections; slug derivation rules; idempotent re-end | `tests/e2e/happy-path.spec.mjs` |

### Stories deferred for Phase 1 (NOT generating tests)

US-5 (governance queue), US-6 (prototype variant), US-7, US-8 (track playback) — tests will be derived when those capabilities ship.

---

## Traceability

Every test must include a `@source` reference per [TEST-PIPELINE.md § Traceability Format](../../../../../TEST-PIPELINE.md#traceability-format):

```js
/**
 * @source features/app-release/operations.md#endsession
 * @rule R1
 * @test-id T-OP-END-1
 */
test("EndSession rejects on draft session", () => { ... })
```

This enables doc-change → test-grep and test-failure → spec-traceback workflows. Coverage audit: every row in this catalogue must have a corresponding `@test-id` annotation in the implementation.

## Acceptance for the Phase 1 Test Suite

The Phase 1 test suite is considered complete when:

1. Every row in this catalogue has a corresponding test in the named file.
2. All tests pass under `node --test` for unit/integration and `npx playwright test` for E2E.
3. The OAuth-gated E2E test (`tests/e2e/happy-path.spec.mjs` with `live` tag) is skipped by default in CI but documented as runnable locally with `CLAUDE_CODE_OAUTH=1`.
4. Coverage report shows ≥ 90% line coverage on `visualizations/app-release/lib/**` and `visualizations/app-release/server.mjs`.
5. `domainspec-verify-feature app-release` returns `PASS` or `FLAG` with no `BLOCK` from test evidence.

## Connections

| Document | Type | Description |
|---|---|---|
| [[SPEC]] | `derives-from` | Concept Registry maps concept IDs to test sections. |
| [[operations]] | `derives-from` | Each operation row generates rule, calculation, postcondition, error tests. |
| [[interfaces]] | `derives-from` | Each endpoint × status generates a contract test. |
| [[events]] | `derives-from` | Each event row generates producer + consumer tests. |
| [[queries]] | `derives-from` | Each query row generates output, filter, empty-result tests. |
| [[mappings]] | `derives-from` | Each mapping stage generates success + failure tests. |
| [[workflows]] | `derives-from` | Each workflow step generates happy + compensation tests. |
| [[states]] | `derives-from` | InterviewSessionLifecycle generates transition + invariant tests. |
| [[STORIES]] | `derives-from` | Each in-scope user story produces an E2E test. |
| [[PHASE-1-PLAN]] | `realizes` | Implementation work in W2–W9 must satisfy these tests. |
