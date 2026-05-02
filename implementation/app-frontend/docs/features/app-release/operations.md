# Operations: App Release

## Phase 1 Status

| Operation | Phase 1 |
| --------- | ------- |
| [StartReleaseWorkspace](#startreleaseworkspace) | in scope (creates a new [InterviewSession](domain.md#interviewsession); state transition adapted to `draft → active`) |
| [CaptureInterviewTurn](#captureinterviewturn) | in scope (now streams via Claude Agent SDK; tool-use side effects narrated inline) |
| [EndSession](#endsession) | **new in Phase 1** |
| [ResumeSession](#resumesession) | **new in Phase 1** |
| [WriteMarkdownNode](#writemarkdownnode) | **new in Phase 1** (agent tool) |
| [AppendSection](#appendsection) | **new in Phase 1** (agent tool) |
| [UpdateFrontmatter](#updatefrontmatter) | **new in Phase 1** (agent tool) |
| [AddConnection](#addconnection) | **new in Phase 1** (agent tool) |
| [GenerateWorkspaceProjection](#generateworkspaceprojection) | in scope (now triggered by the chokidar watcher under [ProjectionRefreshPolicy](workflows.md#projectionrefreshpolicy)) |
| [PrioritizeGovernanceQueue](#prioritizegovernancequeue) | deferred |
| [SelectPrototypeVariant](#selectprototypevariant) | deferred |
| [StartTrackPlayback](#starttrackplayback) | deferred |

## StartReleaseWorkspace

**Type:** Operation (mutation)
**Actor:** Harness release operator
**Triggers:** A user starts the app-release flow for a new greenfield domain

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| title | string | yes | Name for the release workspace |
| scopeMode | [ReleaseScopeMode](domain.md#releasescopemode) | yes | Must be `greenfield-only` for v1 |
| runtimeMode | [RuntimeMode](domain.md#runtimemode) | yes | Must be `local-only` for v1 |
| graphPriorityMode | [GraphPriorityMode](domain.md#graphprioritymode) | yes | Must be `graph-first` for v1 |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | v1 workspaces must stay greenfield-first | `scopeMode = "greenfield-only"` |
| R2 | v1 runtime must stay local | `runtimeMode = "local-only"` |
| R3 | v1 must treat graph as first-class | `graphPriorityMode = "graph-first"` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Initial readiness score | `(configured_decisions / 3.0)` |

### State Transition

`[ReleaseWorkspace](domain.md#releaseworkspace): draft -> interviewing`

### Postconditions

- A new [ReleaseWorkspace](domain.md#releaseworkspace) exists with explicit scope, runtime, and graph decisions.
- An initial [WorkspaceInitialized](events.md#workspaceinitialized) event is emitted.

### Error States

| Condition | Result |
| --------- | ------ |
| Any decision value differs from the approved v1 mode | Reject workspace creation with a validation error |
| Title is empty | Reject workspace creation with a required-field error |

## CaptureInterviewTurn

**Type:** Operation (mutation)
**Actor:** Harness release operator or orchestrator
**Triggers:** A user submits a discovery answer in the chat-first workspace

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |
| turnText | string | yes | Raw interview content |
| actorRole | string | yes | Role speaking in this turn |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Empty discovery turns are not persisted | `length(trim(turnText)) > 0` |
| R2 | A turn must belong to an active workspace | `workspace.status in {"interviewing","projected","review-ready"}` |
| R3 | Every structured extraction must retain evidence | `forall generatedNode: exists evidenceLink` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Ambiguity increment | `count(extracted_ambiguities)` |
| C2 | Evidence coverage ratio | `(generated_nodes_with_evidence / generated_nodes_total)` |

### State Transition

`[ReleaseWorkspace](domain.md#releaseworkspace): interviewing -> interviewing`

### Postconditions

- The active [DomainMap](domain.md#domainmap) receives extracted entities, relationships, or ambiguities.
- Evidence is recorded through [GraphEvidenceLink](domain.md#graphevidencelink) instances.

### Error States

| Condition | Result |
| --------- | ------ |
| Workspace is missing | Reject with not-found error |
| Extraction produces nodes without evidence | Reject projection update and flag governance gap |

## GenerateWorkspaceProjection

**Type:** Operation (mutation)
**Actor:** Orchestrator
**Triggers:** The system needs to refresh visible graph, governance, and prototype surfaces after discovery changes

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |
| projectionReason | string | yes | Why the refresh is happening |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Projection must be based on the active domain map | `workspace.activeDomainMapId != null` |
| R2 | Graph-first mode requires visible graph content | `graphPriorityMode = "graph-first" => domainMap.nodeCount > 0` |
| R3 | Governance output must explain priority | `forall queueItem: queueItem.rationale != ""` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Projection completeness | `(visible_surfaces_populated / 4.0)` |
| C2 | Review readiness score | `(graph_surface + governance_surface + prototype_surface + metrics_surface) / 4.0` |

### State Transition

`[ReleaseWorkspace](domain.md#releaseworkspace): interviewing -> projected`

### Postconditions

- The workspace overview read model is refreshed.
- A [ProjectionRefreshed](events.md#projectionrefreshed) event is emitted.

### Error States

| Condition | Result |
| --------- | ------ |
| Active domain map is missing | Reject projection refresh |
| Projection would hide the graph surface in graph-first mode | Reject with policy violation |

## PrioritizeGovernanceQueue

**Type:** Operation (mutation)
**Actor:** Orchestrator
**Triggers:** Discovery changes, confidence gaps, or explicit user review requests

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |
| contextGoal | string | yes | Current release objective |
| confidenceGapCount | integer | yes | Number of unresolved ambiguities or weak assumptions |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Queue order must be explainable | `forall item: item.rationale != ""` |
| R2 | Higher confidence gaps increase urgency | `confidenceGapCount > 0 => exists item.priorityScore > 0` |
| R3 | Resolved items cannot outrank open blockers | `resolved.priorityScore <= min(open.priorityScore)` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Priority score | `(goal_impact * 0.5) + (confidence_gap * 0.3) + (role_urgency * 0.2)` |

### State Transition

`[ReleaseWorkspace](domain.md#releaseworkspace): projected -> review-ready`

### Postconditions

- Governance queue items are ranked with visible rationale.
- A [GovernanceQueueReprioritized](events.md#governancequeuereprioritized) event is emitted.

### Error States

| Condition | Result |
| --------- | ------ |
| Queue items are missing rationale | Reject reprioritization |
| Context goal is empty | Reject reprioritization with required-field error |

## SelectPrototypeVariant

**Type:** Operation (mutation)
**Actor:** Harness release operator
**Triggers:** The user chooses or critiques a proposed presentation direction

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |
| prototypeVariantId | string | yes | Chosen [PrototypeVariant](domain.md#prototypevariant) |
| critiqueSummary | string | no | Optional recorded feedback |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Only one prototype variant may be selected | `count(selectionStatus = "selected") = 1` |
| R2 | Selected variant must belong to the workspace | `variant.workspaceId = workspaceId` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Selection confidence | `(positive_signals / total_signals)` |

### State Transition

`[ReleaseWorkspace](domain.md#releaseworkspace): review-ready -> review-ready`

### Postconditions

- The chosen [PrototypeVariant](domain.md#prototypevariant) becomes the active variant for the workspace.

### Error States

| Condition | Result |
| --------- | ------ |
| Variant belongs to another workspace | Reject selection |
| Multiple variants remain selected | Reject mutation and require reconciliation |

## StartTrackPlayback

**Type:** Operation (mutation)
**Actor:** Harness release operator
**Triggers:** The user starts a provided or uploaded track in the local app

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |
| trackSource | string | yes | `generated` or `uploaded` |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Playback is local-only in v1 | `workspace.runtimeMode = "local-only"` |
| R2 | Playback requires a reviewable workspace | `workspace.status in {"review-ready","demo-ready"}` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Demo immersion score | `(playback_active + fractal_active) / 2.0` |

### State Transition

`[ReleaseWorkspace](domain.md#releaseworkspace): review-ready -> demo-ready`

### Postconditions

- A [TrackPlaybackSession](domain.md#trackplaybacksession) enters `playing`.
- A [TrackPlaybackStarted](events.md#trackplaybackstarted) event is emitted.

### Error States

| Condition | Result |
| --------- | ------ |
| Runtime is not local-only | Reject playback start |
| Workspace is still only in draft or interviewing | Reject playback until projection exists |

## EndSession

**Type:** Operation (mutation)
**Actor:** Harness release operator (via Encerrar button or window close)
**Triggers:** The user confirms a session-end intent in the combined end-session modal

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| sessionId | string | yes | Target [InterviewSession](domain.md#interviewsession) |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Only `active` sessions can be ended | `session.status = "active"` |
| R2 | End is idempotent | `endSession(s) twice = endSession(s) once` |
| R3 | Session document write must complete before in-memory state clears | `domain_knowledge/sessions/<ts>-<slug>.md exists before session removed from memory` |

### State Transition

`[InterviewSession](domain.md#interviewsession): active -> ended`

### Postconditions

- The app-runtime session-close skill writes the session document at `domain_knowledge/sessions/<timestamp>-<slug>.md` (objective, summary, decisions, files touched, next-session prompt).
- The server clears the in-memory session.
- A `done` SSE event is emitted on the session's chat stream before the stream closes.

### Error States

| Condition | Result |
| --------- | ------ |
| Session does not exist | Return 404 |
| Session is already `ended` | Return 200 with idempotent ack (no second skill invocation) |
| Skill invocation fails | Keep session `active`, surface error to UI, leave session document unwritten |

## ResumeSession

**Type:** Operation (mutation)
**Actor:** Harness release operator (via "Sessões anteriores" picker)
**Triggers:** The user picks a past session document to continue

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| sessionId | string | yes | Target session (file under `domain_knowledge/sessions/`) |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Only `ended` sessions can be resumed | `session.status = "ended"` |
| R2 | The model context is seeded with the **summary section only**, not the full transcript | `prompt_context_includes(summarySection) AND NOT prompt_context_includes(transcript)` |
| R3 | The original session file is preserved; resume appends a new section | `existing_file_size_after >= existing_file_size_before` |

### State Transition

`[InterviewSession](domain.md#interviewsession): ended -> active`

### Postconditions

- A fresh Claude Agent SDK conversation is opened, seeded with the original session's `## Summary` and `## Next-session prompt` sections.
- The original session document gains a `## Resumed at <ISO-timestamp>` section appended in place (per Decision Gate #4).
- A new tab is opened in the UI bound to this session's continuation.

### Error States

| Condition | Result |
| --------- | ------ |
| Session file is missing | Return 404 |
| Session document has no `## Summary` section | Return 422 with "summary required to resume" |
| Append-section skill invocation fails | Roll back: do not open the new SDK conversation; surface error to UI |

## WriteMarkdownNode

**Type:** Operation (agent tool)
**Actor:** Claude Agent SDK (declared as native tool)
**Triggers:** The agent decides to create a new node during an interview turn

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| path | string | yes | Path under `domain_knowledge/`, must end in `.md` |
| frontmatter | object | yes | YAML frontmatter (`node_type`, `tags`, `status`, etc.) |
| body | string | yes | Markdown body |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Path must be inside `domain_knowledge/` (no `..`, no absolute paths) | `path.startsWith("domain_knowledge/") AND NOT path.contains("..")` |
| R2 | Path must not already exist (to avoid clobbering) | `NOT exists(path)` |
| R3 | Frontmatter must include `node_type` | `"node_type" in frontmatter` |

### Postconditions

- A new file exists at `domain_knowledge/<path>`.
- The chokidar watcher emits an `IndexDelta` containing the new node.
- The graph SSE stream emits a `graph-delta` event.
- The chat SSE stream emits a `tool-use-result` event narrating "✓ wrote `<path>`".

### Error States

| Condition | Result |
| --------- | ------ |
| Path violates R1 | Tool call rejected; agent receives error and may retry with a corrected path |
| File already exists (R2 violation) | Tool call rejected; suggest [AppendSection](#appendsection) or [UpdateFrontmatter](#updatefrontmatter) instead |

## AppendSection

**Type:** Operation (agent tool)
**Actor:** Claude Agent SDK (declared as native tool)
**Triggers:** The agent extends an existing node with a new section

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| path | string | yes | Path under `domain_knowledge/`, must already exist |
| heading | string | yes | The `## Heading` to append (or update if it already exists at the end) |
| content | string | yes | Markdown body for the section |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Path must be inside `domain_knowledge/` | `path.startsWith("domain_knowledge/")` |
| R2 | Path must already exist | `exists(path)` |
| R3 | Heading must start with `## ` | `heading.startsWith("## ")` |

### Postconditions

- The file at `domain_knowledge/<path>` ends with the new section.
- The watcher emits an `IndexDelta` (an updated edge or content change).
- The chat SSE stream emits a `tool-use-result` event narrating "✓ appended `<heading>` to `<path>`".

## UpdateFrontmatter

**Type:** Operation (agent tool)
**Actor:** Claude Agent SDK (declared as native tool)
**Triggers:** The agent revises a node's metadata (status, tags, layer, etc.)

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| path | string | yes | Path under `domain_knowledge/`, must already exist |
| patch | object | yes | Partial frontmatter; merged shallow-into existing |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Patch cannot remove `node_type` | `"node_type" not in patch OR patch.node_type != null` |
| R2 | Patch may not include `last_updated` keys other than the current ISO date | If `last_updated` set, must equal today's ISO date |

### Postconditions

- The file's frontmatter reflects the merged patch; body is preserved verbatim.
- The watcher emits an `IndexDelta` for an updated node.

## AddConnection

**Type:** Operation (agent tool)
**Actor:** Claude Agent SDK (declared as native tool)
**Triggers:** The agent links two existing nodes via the `## Connections` table

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| sourcePath | string | yes | Path of the file whose `## Connections` table receives the new row |
| targetWikilink | string | yes | Target reference, e.g. `[[axiom/foo]]` |
| relationType | string | yes | Edge type — one of the documented relation vocabulary (`derives-from`, `narrows`, `references`, etc.) |
| description | string | yes | Why the edge exists |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Source file must exist | `exists(sourcePath)` |
| R2 | Source file must already have a `## Connections` heading; if not, the tool creates it before appending | — |
| R3 | The `(targetWikilink, relationType)` pair must not already be present (idempotent) | `NOT row_exists(source.Connections, target, relationType)` |

### Postconditions

- A new row is appended to the `## Connections` table in `sourcePath`.
- The watcher emits an `IndexDelta` adding the new edge.
- The chat SSE stream emits a `tool-use-result` event narrating "✓ linked `<sourcePath>` → `<targetWikilink>` (`<relationType>`)".
