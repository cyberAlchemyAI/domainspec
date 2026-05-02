# Domain: App Release

## Phase 1 Status

| Concept | Phase 1 |
| ------- | ------- |
| [ReleaseWorkspace](#releaseworkspace) | in scope (project container; one per `domain_knowledge/` directory) |
| [InterviewSession](#interviewsession) | **new in Phase 1** (per-tab session, the entity with the Phase 1 lifecycle) |
| [DomainMap](#domainmap) | in scope (filesystem-derived live index) |
| [GovernanceQueueItem](#governancequeueitem) | deferred |
| [PrototypeVariant](#prototypevariant) | deferred |
| [TrackPlaybackSession](#trackplaybacksession) | deferred |
| [ReleaseScopeMode](#releasescopemode) | in scope |
| [RuntimeMode](#runtimemode) | in scope |
| [GraphPriorityMode](#graphprioritymode) | in scope |
| [WorkspaceStatus](#workspacestatus) | in scope (later values `review-ready`, `demo-ready` are deferred) |
| [SessionStatus](#sessionstatus) | **new in Phase 1** |
| [GraphEvidenceLink](#graphevidencelink) | in scope |

## Entities

### ReleaseWorkspace

The root entity for one public-facing release demo session. It binds the interview history, derived graph state, governance queue, prototype choice, and optional playback state into one local workspace.

> **Phase 1 note:** the workspace becomes a *project-level container* — one `domain_knowledge/` directory = one workspace = one shared graph across all open sessions. The visible per-tab lifecycle is owned by [InterviewSession](#interviewsession); ReleaseWorkspace stays implicit in Phase 1 (no separate persistence — the directory IS the workspace).

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Stable workspace identifier |
| title | string | yes | Human-readable session title |
| scopeMode | [ReleaseScopeMode](#releasescopemode) | yes | Release scope decision for this workspace |
| runtimeMode | [RuntimeMode](#runtimemode) | yes | Runtime deployment mode |
| graphPriorityMode | [GraphPriorityMode](#graphprioritymode) | yes | Visibility priority for graph exploration |
| status | [WorkspaceStatus](#workspacestatus) | yes | Current lifecycle state |
| activeDomainMapId | string | no | Active [DomainMap](#domainmap) reference |
| selectedPrototypeVariantId | string | no | Active [PrototypeVariant](#prototypevariant) reference |
| activePlaybackSessionId | string | no | Active [TrackPlaybackSession](#trackplaybacksession) reference |

**Lifecycle:** See [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
**Operations:** [StartReleaseWorkspace](operations.md#startreleaseworkspace), [CaptureInterviewTurn](operations.md#captureinterviewturn), [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection)

---

### InterviewSession

**New in Phase 1.** A per-tab chat session. Multiple sessions can be `active` concurrently in the same project; each tab holds one `sessionId`.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| sessionId | string | yes | Stable session identifier (timestamp + slug) |
| title | string | yes | Display title; derived from the interview-script's first question or set explicitly |
| status | [SessionStatus](#sessionstatus) | yes | `draft`, `active`, or `ended` |
| createdAt | datetime | yes | ISO timestamp |
| endedAt | datetime | no | ISO timestamp; populated when status transitions to `ended` |
| documentPath | string | no | Path under `domain_knowledge/sessions/`; populated after first end |
| filesTouched | array | yes | Paths under `domain_knowledge/` modified during this session (used by the close-session skill) |
| chatHistory | array | yes | In-memory ordered turn list (NOT persisted as transcript by default; only summary persists) |

**Lifecycle:** See [InterviewSessionLifecycle](states.md#interviewsessionlifecycle)
**Operations:** [StartReleaseWorkspace](operations.md#startreleaseworkspace), [CaptureInterviewTurn](operations.md#captureinterviewturn), [EndSession](operations.md#endsession), [ResumeSession](operations.md#resumesession)

---

### DomainMap

The structured representation of the discovered domain, including graph nodes, relationships, workflows, and evidence references from the interview stream.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| domainMapId | string | yes | Stable graph snapshot identifier |
| workspaceId | string | yes | Owning [ReleaseWorkspace](#releaseworkspace) |
| nodeCount | integer | yes | Number of nodes in the current projection |
| edgeCount | integer | yes | Number of relationships in the current projection |
| evidenceTurnCount | integer | yes | Number of interview turns contributing evidence |
| unresolvedAmbiguityCount | integer | yes | Remaining ambiguities requiring governance follow-up |

**Operations:** [CaptureInterviewTurn](operations.md#captureinterviewturn), [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection)

---

### GovernanceQueueItem

An actionable governance or scope item surfaced by the system because a decision, ambiguity, or missing constraint blocks clearer execution.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| queueItemId | string | yes | Stable task identifier |
| workspaceId | string | yes | Owning [ReleaseWorkspace](#releaseworkspace) |
| title | string | yes | Human-readable action summary |
| rationale | string | yes | Why this item is prioritized |
| priorityScore | decimal | yes | Computed execution urgency |
| ownerRole | string | yes | Intended role for resolution |
| status | string | yes | `open`, `in-progress`, or `resolved` |

**Operations:** [PrioritizeGovernanceQueue](operations.md#prioritizegovernancequeue)

---

### PrototypeVariant

A candidate presentation direction for the product surface, used to compare and select visual or interaction approaches inside the release workspace.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| prototypeVariantId | string | yes | Stable variant identifier |
| workspaceId | string | yes | Owning [ReleaseWorkspace](#releaseworkspace) |
| label | string | yes | Variant name shown to the user |
| selectionStatus | string | yes | `candidate` or `selected` |
| critiqueSummary | string | no | Captured user feedback for the variant |

**Operations:** [SelectPrototypeVariant](operations.md#selectprototypevariant)

---

### TrackPlaybackSession

The local playback state for a chosen or uploaded track that drives the experiential fractal layer.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| playbackSessionId | string | yes | Stable playback session identifier |
| workspaceId | string | yes | Owning [ReleaseWorkspace](#releaseworkspace) |
| trackSource | string | yes | `generated` or `uploaded` |
| playbackStatus | string | yes | `ready`, `playing`, `paused`, or `stopped` |
| startedAt | datetime | no | Local playback start time |

**Operations:** [StartTrackPlayback](operations.md#starttrackplayback)

## Value Objects

### GraphEvidenceLink

Connects a generated graph element back to an interview turn or derived planning rationale.

| Field | Type | Constraint |
| ----- | ---- | ---------- |
| sourceType | string | Must be `interview-turn` or `planner-rationale` |
| sourceRef | string | Must reference an existing local artifact |
| confidence | decimal | `0.0 <= confidence <= 1.0` |

**Equality:** Two instances are equal when `sourceType`, `sourceRef`, and `confidence` are equal.

## Enums

### ReleaseScopeMode

| Value | Description |
| ----- | ----------- |
| greenfield-only | v1 supports only project-from-zero release discovery |

### RuntimeMode

| Value | Description |
| ----- | ----------- |
| local-only | All runtime behavior stays in the local app window for v1 |

### GraphPriorityMode

| Value | Description |
| ----- | ----------- |
| graph-first | The graph is a first-class surface, not a secondary view |

### WorkspaceStatus

| Value | Description | Phase 1 |
| ----- | ----------- | ------- |
| draft | Workspace exists but discovery is not yet structured | in scope |
| interviewing | The interview loop is actively collecting domain evidence | in scope |
| projected | Graph, governance, and prototype surfaces have been refreshed | in scope |
| review-ready | The workspace is coherent enough for guided inspection | deferred |
| demo-ready | The release story is ready for presentation | deferred |

### SessionStatus

**New in Phase 1.** Lifecycle states for [InterviewSession](#interviewsession).

| Value | Description |
| ----- | ----------- |
| draft | Session record created in memory; no agent turns yet |
| active | At least one agent turn has been emitted; session accepts new user turns |
| ended | App-runtime session-close skill has written the session document to `domain_knowledge/sessions/`; in-memory record cleared |
