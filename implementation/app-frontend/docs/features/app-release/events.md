# Events: App Release

## Phase 1 Status

Phase 1 introduces a set of SSE events emitted on `/api/graph/stream` and `/api/sessions/:id/stream` per [interfaces.md](interfaces.md). Existing domain events below are retained; some are mapped to new SSE events, some are deferred.

| Event | Phase 1 | Channel |
| ----- | ------- | ------- |
| [WorkspaceInitialized](#workspaceinitialized) | in scope | internal (no SSE) |
| [SessionCreated](#sessioncreated) | **new in Phase 1** | `/api/sessions/:id/stream` |
| [GraphDelta](#graphdelta) | **new in Phase 1** | `/api/graph/stream` |
| [TextDelta](#textdelta) | **new in Phase 1** | `/api/sessions/:id/stream` |
| [ToolUseStart](#tooluse-start) | **new in Phase 1** | `/api/sessions/:id/stream` |
| [ToolUseResult](#tooluse-result) | **new in Phase 1** | `/api/sessions/:id/stream` |
| [Done](#done) | **new in Phase 1** | `/api/sessions/:id/stream` |
| [SseError](#sse-error) | **new in Phase 1** | both streams |
| [ProjectionRefreshed](#projectionrefreshed) | in scope (mapped to [GraphDelta](#graphdelta) on the wire) | internal |
| [GovernanceQueueReprioritized](#governancequeuereprioritized) | deferred | — |
| [TrackPlaybackStarted](#trackplaybackstarted) | deferred | — |

## SessionCreated

**Produced by:** [StartReleaseWorkspace](operations.md#startreleaseworkspace)
**SSE channel:** `/api/sessions/:id/stream`
**SSE event name:** `session-created`

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| sessionId | string | New session identifier |
| createdAt | datetime | ISO timestamp |
| firstQuestion | string | First agent turn from the interview-script skill |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Workspace UI | Renders the new tab and seeds chat panel with the first agent turn |

## GraphDelta

**Produced by:** [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection) (via watcher)
**SSE channel:** `/api/graph/stream`
**SSE event name:** `graph-delta`

Wire-level mapping of [ProjectionRefreshed](#projectionrefreshed). Fired once per debounced watcher batch.

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| added | array | New `{ path, frontmatter }` records |
| updated | array | Updated records |
| removed | array | `{ path }` of files removed |
| metrics | object | `{ nodes, edges, axioms, drafts }` post-delta |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Embedded graph mount | Applies the delta without full re-render |
| Metrics cards | Updates the four counters |
| Open `/visualizations/ontology-visualization?source=domain_knowledge` mounts | Same delta application |

## TextDelta

**Produced by:** Claude Agent SDK (relayed by `claude-oauth` ChatProvider)
**SSE channel:** `/api/sessions/:id/stream`
**SSE event name:** `text-delta`

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| text | string | Incremental text chunk |

Multiple `text-delta` events compose one agent turn; UI concatenates in order.

## Tool-Use Start

**Produced by:** Claude Agent SDK
**SSE channel:** `/api/sessions/:id/stream`
**SSE event name:** `tool-use-start`

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| toolUseId | string | Correlation id |
| toolName | string | One of [WriteMarkdownNode](operations.md#writemarkdownnode), [AppendSection](operations.md#appendsection), [UpdateFrontmatter](operations.md#updatefrontmatter), [AddConnection](operations.md#addconnection) |
| input | object | Tool input arguments |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Chat panel | Renders an inline narration box ("escrevendo `axiom/foo.md`...") in the active turn |

## Tool-Use Result

**Produced by:** Claude Agent SDK
**SSE channel:** `/api/sessions/:id/stream`
**SSE event name:** `tool-use-result`

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| toolUseId | string | Correlates with the matching [ToolUseStart](#tooluse-start) |
| toolName | string | Same as the start event |
| output | object | Tool result; on error, contains `{ error: string }` |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Chat panel | Replaces the in-progress narration box with a final `✓ wrote ...` (or `✗` on error) box |

## Done

**Produced by:** Claude Agent SDK or `claude-oauth` provider (turn end)
**SSE channel:** `/api/sessions/:id/stream`
**SSE event name:** `done`

Empty payload. Signals the agent's turn is complete; UI re-enables the input.

## SSE Error

**Produced by:** ChatProvider, watcher, or server
**SSE channel:** both streams
**SSE event name:** `error`

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| code | string | Stable error code (`AUTH_MISSING`, `WATCHER_OVERFLOW`, `TOOL_REJECTED`, etc.) |
| message | string | Human-readable detail |

The stream may close after `error`. UI surfaces a banner; for `AUTH_MISSING` it instructs "abrir Claude Code e fazer login" rather than crashing.

## WorkspaceInitialized

**Produced by:** [StartReleaseWorkspace](operations.md#startreleaseworkspace)
**Triggers transition:** [draft -> interviewing](states.md#releaseworkspacelifecycle)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| workspaceId | string | New workspace identifier |
| scopeMode | [ReleaseScopeMode](domain.md#releasescopemode) | Persisted v1 scope decision |
| runtimeMode | [RuntimeMode](domain.md#runtimemode) | Persisted v1 runtime decision |
| graphPriorityMode | [GraphPriorityMode](domain.md#graphprioritymode) | Persisted graph priority decision |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Guided release workspace shell | Opens the main release workspace |

## ProjectionRefreshed

**Produced by:** [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection)
**Triggers transition:** [interviewing -> projected](states.md#releaseworkspacelifecycle)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| workspaceId | string | Workspace identifier |
| nodeCount | integer | Current graph node count |
| edgeCount | integer | Current graph relationship count |
| unresolvedAmbiguityCount | integer | Remaining ambiguity count |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Graph panel | Re-renders the graph |
| Metrics panel | Updates release visibility metrics |

## GovernanceQueueReprioritized

**Produced by:** [PrioritizeGovernanceQueue](operations.md#prioritizegovernancequeue)
**Triggers transition:** [projected -> review-ready](states.md#releaseworkspacelifecycle)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| workspaceId | string | Workspace identifier |
| topQueueItemId | string | Highest-priority queue item |
| topPriorityScore | decimal | Highest priority score |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Governance panel | Re-renders next actions |
| Chat/orchestrator panel | Explains why the queue changed |

## TrackPlaybackStarted

**Produced by:** [StartTrackPlayback](operations.md#starttrackplayback)
**Triggers transition:** [review-ready -> demo-ready](states.md#releaseworkspacelifecycle)

### Payload

| Field | Type | Description |
| ----- | ---- | ----------- |
| workspaceId | string | Workspace identifier |
| playbackSessionId | string | Active playback session |
| trackSource | string | `generated` or `uploaded` |

### Consumed by

| Consumer | Action |
| -------- | ------ |
| Fractal surface | Starts audio-reactive mode |
| Workspace overview | Reflects active playback state |
