# User Stories: App Release

> Navigate by capability: [Guided domain discovery](#guided-domain-discovery) · [Workspace projection and inspection](#workspace-projection-and-inspection) · [Governance and prototype steering](#governance-and-prototype-steering) · [Fractal playback presentation](#fractal-playback-presentation) · [Phase 1 specifics](#phase-1-specifics)

## Phase 1 Status

| Story | Phase 1 |
| ----- | ------- |
| US-1 Start a greenfield release workspace | in scope (interpreted as session creation) |
| US-2 Capture domain evidence through the interview loop | in scope (now via Claude Agent SDK with native tool dispatch) |
| US-3 Inspect the discovered domain through a graph-first workspace | in scope (live filesystem-derived index + 4 metric cards) |
| US-4 Inspect a graph node with workflow lineage and rationale | in scope (Phase 1 UX: navigate to expanded view at `/visualizations/ontology-visualization?source=domain_knowledge`) |
| US-5 Review highest-priority governance actions | deferred |
| US-6 Select a prototype direction without losing system coherence | deferred |
| US-7 Start local track playback for the experiential demo layer | deferred |
| US-8 Reject presentation behavior that outruns system understanding | deferred |
| **US-9 → US-13** (Phase 1 specifics — see below) | **new in Phase 1** |

## Guided Domain Discovery

### US-1: Start a greenfield release workspace

As a **Harness release operator**, I want **to start a workspace with fixed v1 decisions**, so that **the release flow begins with an approved scope and runtime shape**.

**Given** I am opening the release demo for a new domain
**When** I create a workspace with greenfield-only, local-only, and graph-first settings
**Then** the system creates a new release workspace and enters guided discovery mode

**Acceptance checks**

- [ ] The workspace is created only when `scopeMode`, `runtimeMode`, and `graphPriorityMode` match the approved v1 values.
- [ ] The workspace lifecycle enters `interviewing` immediately after creation.
- [ ] The initialization event preserves the selected v1 decisions.

**Domain coverage**

- Concepts: [ReleaseWorkspace](domain.md#releaseworkspace), [ReleaseScopeMode](domain.md#releasescopemode), [RuntimeMode](domain.md#runtimemode), [GraphPriorityMode](domain.md#graphprioritymode), [StartReleaseWorkspace](operations.md#startreleaseworkspace)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [Release Workspace API](interfaces.md#external-release-workspace-api-http), [GuidedReleaseWorkspaceWorkflow](workflows.md#guidedreleaseworkspaceworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-2: Capture domain evidence through the interview loop

As a **Harness release operator**, I want **my interview answers to become structured domain evidence**, so that **the system can build a reliable graph and governance view**.

**Given** an active release workspace is in `interviewing`
**When** I submit a discovery turn
**Then** the system persists the turn, extracts structured domain signals, and retains evidence links for generated concepts

**Acceptance checks**

- [ ] Empty interview turns are rejected.
- [ ] Generated concepts cannot be accepted without evidence links.
- [ ] Ambiguities found during extraction are preserved for later governance review.

**Domain coverage**

- Concepts: [DomainMap](domain.md#domainmap), [GraphEvidenceLink](domain.md#graphevidencelink), [CaptureInterviewTurn](operations.md#captureinterviewturn)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [GuidedReleaseWorkspaceWorkflow](workflows.md#guidedreleaseworkspaceworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Workspace Projection And Inspection

### US-3: Inspect the discovered domain through a graph-first workspace

As a **product stakeholder**, I want **the discovered domain projected into visible graph and overview surfaces**, so that **I can understand the system without reading raw chat history**.

**Given** the workspace has enough evidence for projection
**When** the system refreshes the workspace projection
**Then** the graph, metrics, governance, and prototype surfaces are synchronized into one overview

**Acceptance checks**

- [ ] Graph-first mode blocks projection when the graph would be empty.
- [ ] The overview includes graph counts and unresolved ambiguity counts.
- [ ] A projection refresh event is emitted after a successful refresh.

**Domain coverage**

- Concepts: [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection), [GetWorkspaceOverview](queries.md#getworkspaceoverview), [DomainMapToWorkspaceOverview](mappings.md#domainmaptoworkspaceoverview)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [ProjectionRefreshPolicy](workflows.md#projectionrefreshpolicy), [ReleaseWorkspaceProjection Interface](interfaces.md#internal-releaseworkspaceprojection-interface)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-4: Inspect a graph node with workflow lineage and rationale

As a **developer or QA reviewer**, I want **to inspect a graph node with its relationships and workflow lineage**, so that **I can understand why the node exists and what it affects**.

**Given** the workspace has an active domain map
**When** I request details for a graph node
**Then** the system returns its related relationships, evidence breadth, and lineage context

**Acceptance checks**

- [ ] Node inspection requires a valid workspace and node identifier.
- [ ] The response includes enough information to trace evidence and related edges.
- [ ] Governance links remain available when requested.

**Domain coverage**

- Concepts: [InspectGraphNode](queries.md#inspectgraphnode), [DomainMap](domain.md#domainmap)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [Release Workspace API](interfaces.md#external-release-workspace-api-http)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Governance And Prototype Steering

### US-5: Review the highest-priority governance actions

As a **product owner**, I want **the system to rank unresolved release decisions by urgency**, so that **I can resolve the most important blockers first**.

**Given** the workspace has projected discovery output
**When** the system reprioritizes the governance queue
**Then** I see a ranked list of actions with visible rationale and intended owner roles

**Acceptance checks**

- [ ] Every queue item includes rationale.
- [ ] Resolved items cannot outrank open blockers.
- [ ] Reprioritization emits an event with the top queue item.

**Domain coverage**

- Concepts: [GovernanceQueueItem](domain.md#governancequeueitem), [PrioritizeGovernanceQueue](operations.md#prioritizegovernancequeue), [ListGovernanceQueue](queries.md#listgovernancequeue)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [GuidedReleaseWorkspaceWorkflow](workflows.md#guidedreleaseworkspaceworkflow)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-6: Select a prototype direction without losing system coherence

As a **design-minded operator**, I want **to choose a prototype variant inside the workspace**, so that **visual exploration stays connected to the same release model**.

**Given** multiple prototype variants exist for the workspace
**When** I select one variant and optionally critique it
**Then** only that variant becomes active for the workspace

**Acceptance checks**

- [ ] Only one prototype variant can remain selected.
- [ ] The selected variant must belong to the active workspace.
- [ ] Critique feedback is persisted when supplied.

**Domain coverage**

- Concepts: [PrototypeVariant](domain.md#prototypevariant), [SelectPrototypeVariant](operations.md#selectprototypevariant)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [Release Workspace API](interfaces.md#external-release-workspace-api-http)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Fractal Playback Presentation

### US-7: Start local track playback for the experiential demo layer

As a **demo operator**, I want **to start a local track in the release workspace**, so that **the fractal layer can enhance the final presentation state**.

**Given** the workspace is already projected and ready for review
**When** I start playback from a generated or uploaded track
**Then** the system opens a playback session and transitions the workspace into a demo-ready state

**Acceptance checks**

- [ ] Playback is blocked unless the workspace runtime is local-only.
- [ ] Playback is blocked until projection exists.
- [ ] Starting playback emits a track playback started event.

**Domain coverage**

- Concepts: [TrackPlaybackSession](domain.md#trackplaybacksession), [StartTrackPlayback](operations.md#starttrackplayback), [TrackPlaybackStarted](events.md#trackplaybackstarted)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [LocalPlaybackPolicy](workflows.md#localplaybackpolicy)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

### US-8: Reject presentation behavior that outruns system understanding

As a **governance reviewer**, I want **the system to reject demo actions that bypass discovery or projection rules**, so that **the release remains legible rather than superficial**.

**Given** a workspace is still in `draft` or `interviewing`
**When** playback or graph-first projection would violate the active policies
**Then** the system blocks the action and returns a clear policy error

**Acceptance checks**

- [ ] Graph-first projection cannot succeed with zero nodes.
- [ ] Playback cannot start before the workspace reaches a valid projected or review-ready state.
- [ ] Policy violations are surfaced as explicit errors instead of silent fallback behavior.

**Domain coverage**

- Concepts: [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection), [StartTrackPlayback](operations.md#starttrackplayback), [LocalPlaybackPolicy](workflows.md#localplaybackpolicy)
- States/Rules: [ReleaseWorkspaceLifecycle](states.md#releaseworkspacelifecycle)
- Interfaces/Flows: [ProjectionRefreshPolicy](workflows.md#projectionrefreshpolicy), [LocalPlaybackPolicy](workflows.md#localplaybackpolicy)

**Capability links**

- [Capabilities](SPEC.md#capabilities)

## Phase 1 Specifics

### US-9: Agent file-write narrates inline as a tool-use box

As a **Harness release operator**, I want **the agent to show me, in chat, every file it writes during my turn**, so that **I trust what is happening and the graph below feels causally connected to the conversation**.

**Given** an active interview session and an agent reply that includes one or more native SDK tool calls
**When** each tool call (`WriteMarkdownNode`, `AppendSection`, `UpdateFrontmatter`, `AddConnection`) starts and finishes
**Then** the chat panel renders an in-progress narration box on `tool-use-start` and replaces it with a final `✓` (or `✗` on error) box on `tool-use-result`

**Acceptance checks**

- [ ] A `tool-use-start` event renders an in-progress box with the tool name and target path in the active turn.
- [ ] The matching `tool-use-result` event replaces that box with a success or error box (correlated by `toolUseId`).
- [ ] If a tool result carries `{ error }`, the box renders as `✗` with the error code; the rest of the turn continues if more text-deltas arrive.
- [ ] Narration boxes preserve their order relative to surrounding text-deltas in the turn.

**Domain coverage**

- Concepts: [WriteMarkdownNode](operations.md#writemarkdownnode), [AppendSection](operations.md#appendsection), [UpdateFrontmatter](operations.md#updatefrontmatter), [AddConnection](operations.md#addconnection), [ToolUseStart](events.md#tool-use-start), [ToolUseResult](events.md#tool-use-result), [InterviewTurnToDomainMapUpdate](mappings.md#interviewturntodomainmapupdate)
- States/Rules: [InterviewSessionLifecycle](states.md#interviewsessionlifecycle)
- Interfaces/Flows: [POST /api/sessions/:id/turns](interfaces.md#post-apisessionsidturns), [GET /api/sessions/:id/stream](interfaces.md#get-apisessionsidstream), [GuidedReleaseWorkspaceWorkflow](workflows.md#guidedreleaseworkspaceworkflow)

### US-10: Filesystem edit triggers a live graph delta in the UI

As a **Harness release operator**, I want **the embedded graph and metrics to update without me reloading**, so that **I see my domain knowledge accumulate as the agent writes files**.

**Given** a workspace UI subscribed to `GET /api/graph/stream`
**When** the agent (or I, manually editing) modifies any file under `domain_knowledge/`
**Then** within the debounce window (≤200ms) a `graph-delta` SSE event arrives carrying `{ added, updated, removed, metrics }` and the embedded graph + 4 metric cards update in place

**Acceptance checks**

- [ ] A new `.md` file appears in the graph as a node with no full-page reload.
- [ ] A removed `.md` file is reflected as a removed node within the next debounced batch.
- [ ] Metrics counters (Nodes, Edges, Axioms, Drafts) reflect the new totals after each delta.
- [ ] Files under `domain_knowledge/sessions/**` do not increment the Nodes count.
- [ ] `.git/**` and `node_modules/**` filesystem events do not produce `graph-delta` events.

**Domain coverage**

- Concepts: [GenerateWorkspaceProjection](operations.md#generateworkspaceprojection), [GraphDelta](events.md#graphdelta), [DomainMap](domain.md#domainmap), [GetWorkspaceOverview](queries.md#getworkspaceoverview)
- States/Rules: [ProjectionRefreshPolicy](workflows.md#projectionrefreshpolicy)
- Interfaces/Flows: [GET /api/graph/stream](interfaces.md#get-apigraphstream)

### US-11: Closing the window confirms all open sessions in one combined modal

As a **Harness release operator with multiple tabs open**, I want **a single confirmation that lists every active session when I close the window**, so that **I know exactly what is about to end and I can cancel without juggling multiple modals**.

**Given** two or more tabs are open with `active` sessions
**When** I close the browser window or click `Encerrar sessão` in any tab
**Then** a single combined modal renders, listing each active session with its title, and offers `Continuar conversa` (cancel) or `Encerrar e gerar resumo` (confirm-all)

**Acceptance checks**

- [ ] The combined modal lists every `active` session, not only the foreground tab.
- [ ] `Continuar conversa` dismisses the modal and leaves all sessions `active`.
- [ ] `Encerrar e gerar resumo` calls `POST /api/sessions/:id/end` for each listed session; after all calls succeed, the window closes (or the tab clears).
- [ ] If any end call fails, the modal stays open and surfaces which session failed; other sessions that already ended are not retriggered (idempotent).
- [ ] All UI strings appear in Portuguese.

**Domain coverage**

- Concepts: [EndSession](operations.md#endsession), [InterviewSession](domain.md#interviewsession)
- States/Rules: [InterviewSessionLifecycle](states.md#interviewsessionlifecycle)
- Interfaces/Flows: [POST /api/sessions/:id/end](interfaces.md#post-apisessionsidend)

### US-12: Resuming a past session appends to the original file and seeds context with summary only

As a **Harness release operator**, I want **resuming a past session to append a `## Resumed at <timestamp>` section to the original document and seed the agent with the summary, not the full transcript**, so that **the session's history stays linear and I do not pay tokens for replaying old turns**.

**Given** a session document under `domain_knowledge/sessions/` with a `## Summary` section
**When** I pick that session in `Sessões anteriores` and confirm resume
**Then** a new tab opens bound to a continuation, the original file gains a `## Resumed at <ISO-timestamp>` section appended in place, and the model context is seeded with `Summary` + `Next-session prompt` only

**Acceptance checks**

- [ ] The original file's pre-resume content is preserved byte-for-byte.
- [ ] A `## Resumed at <ISO-timestamp>` heading is appended below the existing content.
- [ ] The new SDK conversation's seed prompt does NOT include the document's transcript section.
- [ ] If the session has no `## Summary` section, the resume call returns `422 summary required to resume` and no new tab opens.

**Domain coverage**

- Concepts: [ResumeSession](operations.md#resumesession), [GetSessionSummary](queries.md#getsessionsummary), [InterviewSession](domain.md#interviewsession)
- States/Rules: [InterviewSessionLifecycle](states.md#interviewsessionlifecycle) — `ended → active`
- Interfaces/Flows: [POST /api/sessions/:id/resume](interfaces.md#post-apisessionsidresume)

### US-13: Ending a session writes a session document under `domain_knowledge/sessions/`

As a **Harness release operator**, I want **ending a session to produce a permanent markdown document with my decisions, files touched, summary, and next-session prompt**, so that **future me (or the agent on resume) can pick up where I left off**.

**Given** an `active` session with a non-empty `chatHistory` and `filesTouched` list
**When** I confirm `Encerrar e gerar resumo`
**Then** the app-runtime session-close skill writes `domain_knowledge/sessions/<timestamp>-<slug>.md` containing objective, summary, decisions, files touched, and next-session prompt; the in-memory session is cleared; a `done` SSE event closes the chat stream

**Acceptance checks**

- [ ] The new file exists at the expected path.
- [ ] The frontmatter includes `node_type: session` and a `last_updated` ISO date.
- [ ] The body contains the five required sections (objective, summary, decisions, files touched, next-session prompt).
- [ ] The slug is kebab-cased, ≤40 chars, derived from the objective; falls back to `untitled` when no objective is available.
- [ ] Calling `POST /api/sessions/:id/end` again returns `200` with `idempotent: true` and does NOT overwrite the document.

**Domain coverage**

- Concepts: [EndSession](operations.md#endsession), [InterviewSession](domain.md#interviewsession), [ListPastSessions](queries.md#listpastsessions)
- States/Rules: [InterviewSessionLifecycle](states.md#interviewsessionlifecycle) — `active → ended`
- Interfaces/Flows: [POST /api/sessions/:id/end](interfaces.md#post-apisessionsidend)

## Story Coverage Matrix

| Capability | Story IDs | Covered Concepts | Notes |
| ---------- | --------- | ---------------- | ----- |
| Guided domain discovery | US-1, US-2 | app-release.ReleaseWorkspace, app-release.ReleaseScopeMode, app-release.RuntimeMode, app-release.GraphPriorityMode, app-release.CaptureInterviewTurn | Public journey coverage |
| Workspace projection and inspection | US-3, US-4 | app-release.GenerateWorkspaceProjection, app-release.GetWorkspaceOverview, app-release.InspectGraphNode, app-release.DomainMapToWorkspaceOverview | Cross-role inspection coverage |
| Governance and prototype steering | US-5, US-6 | app-release.GovernanceQueueItem, app-release.PrioritizeGovernanceQueue, app-release.ListGovernanceQueue, app-release.PrototypeVariant | Admin/operations journey coverage |
| Fractal playback presentation | US-7, US-8 | app-release.TrackPlaybackSession, app-release.StartTrackPlayback, app-release.LocalPlaybackPolicy | Error and edge-case coverage |
| Phase 1 specifics | US-9, US-10, US-11, US-12, US-13 | app-release.WriteMarkdownNode, app-release.AppendSection, app-release.UpdateFrontmatter, app-release.AddConnection, app-release.GraphDelta, app-release.EndSession, app-release.ResumeSession, app-release.InterviewSession, app-release.SessionStatus, app-release.ListPastSessions, app-release.GetSessionSummary, app-release.InterviewSessionLifecycle | Native SDK tools, SSE delta, combined-modal close UX, append-on-resume, session document write |
