---
tags: [app-release, harness, phase-1, plan, ui, agent, knowledge-graph, oauth]
node_type: implementation-plan
is_session: false
layer: application, architecture
nature: technical, procedural
status: draft
version: 0.2.0
last_updated: 2026-04-30
---

# Phase 1 Plan — Harness App-Release Workspace

> Executable plan derived by `domainspec-planner` from [PHASE-1-DESIGN.md](./PHASE-1-DESIGN.md), [DECISIONS.md](./DECISIONS.md), [SPEC.md](./SPEC.md), and [`docs/features/discovery/app-release-discovery.md`](../discovery/app-release-discovery.md). Mode: `gsd-phase` (delegated to [`.github/skills/domainspec-plan-phase-bridge/SKILL.md`](../../../../../.github/skills/domainspec-plan-phase-bridge/SKILL.md)).
>
> **v0.2.0:** Restructured to honor DomainSpec's authority rule — `SPEC + aspect docs are the source of truth, code derives from them`. Documentation alignment is now W1 and gates all implementation waves. Per the pipeline order: `plan → spec → stories → tests → implement`.

## Resolved Decision Gate

These four multi-option decisions, deferred from PHASE-1-DESIGN, were resolved interactively before task production. Planning was BLOCKED until each was answered, per `domainspec-planner.agent.md` step 4.

| # | Decision | Selected Option | Rationale |
|---|---|---|---|
| 1 | Tool-use mechanism (agent → filesystem) | **Native Agent SDK tool API** | Less custom plumbing, automatic tool-use streaming, prompt caching preserved. Matches PHASE-1-DESIGN default assumption. |
| 2 | Live graph push transport | **Server-Sent Events (SSE)** | One-way server→client stream is the correct shape for graph deltas; native `EventSource`; simpler than websockets. |
| 3 | End-session-on-window-close UX | **Combined modal listing all open sessions** | Single confirmation enumerating every active session; simpler implementation; clearer mental model with 3+ tabs. |
| 4 | Resume file model | **Append `## Resumed at <timestamp>` section to original file** | One file per logical session thread keeps history linear and human-readable; close-session skill owns the append. |

## Pre-flight Observations

| Check | State | Action |
|---|---|---|
| `domainspec/CHANGELOG.md` | v2.0.2 (orchestrator-first; brownfield gates active) | Honored. |
| Feature SPEC + aspect files | Present and DECISIONS-resolved at v1 scope, but not yet narrowed to Phase 1 surface | Updated in W1. |
| Governance baseline | `docs/shared/governance-baseline.md` ✓ | Honored (deny-by-default; audit metadata mandatory). |
| Brownfield scope artifacts | `docs/PROJECT-OVERVIEW.md`, `docs/INITIAL-DEFINITIONS.md`, `docs/PROJECT-DECISIONS.md` MISSING under `implementation/app-frontend/docs/` | **FLAG** — Phase 1 implementation can begin once these are authored. Requires `domainspec-start brownfield` (or `auto`) before Wave 3 (Implement). Does not block planning. |
| Existing implementation surface | `visualizations/app-release/{index.html, server.mjs, server.test.mjs, workspace-store.mjs, data/release-workspaces.json}` | Treated as prototype to be rewritten per PHASE-1-DESIGN. Audits run against the new implementation in W9.5; archaeological-only against the prototype since the surface is being replaced. |
| Embedded graph engine | `visualizations/ontology-visualization/` exists with `explorer.html` + `explorer.py` + graph parser | Reusable. Phase 1 adds a `domain_knowledge/`-sourced adapter. |

## Complexity Classification

**High.** Phase 1 spans:
- multi-file UI rewrite,
- new server with watcher + SSE,
- third-party SDK integration with OAuth,
- two new external skills,
- cross-package adapter into `visualizations/ontology-visualization`,
- E2E across multi-tab + filesystem effects.

This satisfies all three `gsd-phase` triggers from the planner's delegation contract: cross-cutting docs/tests/implementation sequencing, dependencies across multiple aspect files, and waves with checkpointed execution.

**Mode:** `gsd-phase`. The plan below is normalized back to DomainSpec terminology and includes explicit GSD→DomainSpec concept mapping per the planner's output rule.

## Concept-to-Wave Mapping

Every task below maps to one or more concepts from [SPEC.md](./SPEC.md). Phase 1 narrows the SPEC surface (defers governance queue, prototype variant, fractal playback) but the core concepts still apply, plus several new Phase-1-specific operations introduced in W1.

| SPEC Concept ID | Phase 1 Manifestation |
|---|---|
| `app-release.ReleaseWorkspace` | Session entity (in-memory + draft markdown file) |
| `app-release.DomainMap` | Filesystem-derived graph index over `domain_knowledge/` |
| `app-release.ReleaseWorkspaceLifecycle` | Session state machine: `draft → active → ended`; resume re-enters `active` |
| `app-release.StartReleaseWorkspace` | `POST /api/sessions` |
| `app-release.CaptureInterviewTurn` | `POST /api/sessions/:id/turns` (streams via SDK) |
| `app-release.EndSession` *(new in W1)* | `POST /api/sessions/:id/end` (runs close-session skill) |
| `app-release.ResumeSession` *(new in W1)* | `POST /api/sessions/:id/resume` (loads summary, appends `## Resumed at`) |
| `app-release.WriteMarkdownNode` *(new in W1)* | Native SDK tool — creates a `.md` node under `domain_knowledge/` |
| `app-release.AppendSection` *(new in W1)* | Native SDK tool — appends a `## Heading` block to an existing file |
| `app-release.UpdateFrontmatter` *(new in W1)* | Native SDK tool — patches a node's YAML frontmatter |
| `app-release.AddConnection` *(new in W1)* | Native SDK tool — adds a row to a node's `## Connections` table |
| `app-release.GenerateWorkspaceProjection` | Watcher-triggered index rebuild + SSE delta |
| `app-release.GetWorkspaceOverview` | `GET /api/graph/index` (nodes, edges, metrics) |
| `app-release.InspectGraphNode` | Click-to-inspect on embedded graph (Phase 1: navigate to expanded view) |
| `app-release.ListPastSessions` *(new in W1)* | `GET /api/sessions` (sessions browser) |
| `app-release.GetSessionSummary` *(new in W1)* | `GET /api/sessions/:id` (summary section only) |
| `app-release.InterviewTurnToDomainMapUpdate` | Agent tool-use → file write → watcher → index delta |
| `app-release.GuidedReleaseWorkspaceWorkflow` | Interview-script skill + chat dispatch |
| `app-release.ProjectionRefreshPolicy` | Debounced watcher push (≤200ms coalesce) |
| `app-release.WorkspaceInitialized` | SSE `session-created` event |
| `app-release.ProjectionRefreshed` | SSE `graph-delta` event |
| Deferred for Phase 1 | `GovernanceQueueItem`, `PrototypeVariant`, `TrackPlaybackSession`, `PrioritizeGovernanceQueue`, `SelectPrototypeVariant`, `StartTrackPlayback`, `GovernanceQueueReprioritized`, `TrackPlaybackStarted`, `LocalPlaybackPolicy` |

## Wave Plan

Waves execute sequentially; tasks within a wave can run in parallel unless an explicit `depends-on` is noted. Each task lists files, mapped concepts, and a verification command.

> **Authority rule:** No implementation wave (W3+) may start until W1 ships and W9.5 audits run against the new docs. SPEC + aspect docs define behavior; code derives from them.

### Wave 0 — Prerequisites & DECISIONS update

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W0.1 | Append resolved Phase 1 architecture decisions to `DECISIONS.md` (the four from the Decision Gate above). | [`DECISIONS.md`](./DECISIONS.md) | — | `grep -q "Tool-use mechanism" DECISIONS.md && grep -q "SSE" DECISIONS.md` |
| W0.2 | Author brownfield startpoint artifacts under `implementation/app-frontend/docs/`: `PROJECT-OVERVIEW.md`, `INITIAL-DEFINITIONS.md`, `PROJECT-DECISIONS.md`. Use `domainspec/templates/project-decisions.md` as the template; capture local-only Phase 1 baseline. | `implementation/app-frontend/docs/PROJECT-OVERVIEW.md`, `INITIAL-DEFINITIONS.md`, `PROJECT-DECISIONS.md` | — | `test -f docs/PROJECT-OVERVIEW.md && test -f docs/INITIAL-DEFINITIONS.md && test -f docs/PROJECT-DECISIONS.md` |
| W0.3 | Pin Claude Agent SDK package: add `@anthropic-ai/claude-agent-sdk` and `chokidar` to `package.json` (or new sub-package under `visualizations/app-release/`). Decide: extend existing prototype dir vs. new `apps/workspace/`. **Recommend extending** `visualizations/app-release/` to keep the rewrite local. | `visualizations/app-release/package.json` | — | `node -e "require('@anthropic-ai/claude-agent-sdk')" && node -e "require('chokidar')"` |

### Wave 1 — Documentation alignment (gate before any implementation)

This wave updates DomainSpec's source-of-truth documents to match the resolved Phase 1 surface. Implementation waves W3+ are blocked on W1.

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W1.1 | Flip PHASE-1-DESIGN's "Deferred Architecture Decisions" section to "Resolved" with a forward-link to [DECISIONS.md § Resolved During Phase 1 Planning](./DECISIONS.md#resolved-during-phase-1-planning-2026-04-30) and to this plan's Resolved Decision Gate. Keep the original options visible for archaeological context. | [`PHASE-1-DESIGN.md`](./PHASE-1-DESIGN.md) | — | `grep -q "Resolved Architecture Decisions" PHASE-1-DESIGN.md` |
| W1.2 | Narrow [`SPEC.md`](./SPEC.md) to the Phase 1 surface: keep the broader concept registry but mark deferred concepts (`GovernanceQueueItem`, `PrototypeVariant`, `TrackPlaybackSession`, `PrioritizeGovernanceQueue`, `SelectPrototypeVariant`, `StartTrackPlayback`, `GovernanceQueueReprioritized`, `TrackPlaybackStarted`, `LocalPlaybackPolicy`) with an explicit `Phase 1: deferred` column or callout. Add the eight new Phase-1 concepts (`EndSession`, `ResumeSession`, `WriteMarkdownNode`, `AppendSection`, `UpdateFrontmatter`, `AddConnection`, `ListPastSessions`, `GetSessionSummary`) to the registry table. | `SPEC.md` | All Phase 1 concepts | `grep -q "EndSession" SPEC.md && grep -q "deferred" SPEC.md` |
| W1.3 | Update [`operations.md`](./operations.md): document `StartReleaseWorkspace`, `CaptureInterviewTurn`, `EndSession`, `ResumeSession`, plus the four agent tool ops (`WriteMarkdownNode`, `AppendSection`, `UpdateFrontmatter`, `AddConnection`). Each operation needs preconditions, postconditions, idempotency rules where applicable, and rule violations. Tool ops must specify the `domain_knowledge/` path constraint. | `operations.md` | `app-release.StartReleaseWorkspace`, `app-release.CaptureInterviewTurn`, `app-release.EndSession`, `app-release.ResumeSession`, `app-release.WriteMarkdownNode`, `app-release.AppendSection`, `app-release.UpdateFrontmatter`, `app-release.AddConnection` | `for op in StartReleaseWorkspace CaptureInterviewTurn EndSession ResumeSession WriteMarkdownNode AppendSection UpdateFrontmatter AddConnection; do grep -q "$op" operations.md \|\| { echo "MISS $op"; exit 1; }; done` |
| W1.4 | Update [`interfaces.md`](./interfaces.md): document the HTTP contracts. REST: `POST /api/sessions`, `GET /api/sessions`, `GET /api/sessions/:id`, `POST /api/sessions/:id/turns`, `POST /api/sessions/:id/end`, `POST /api/sessions/:id/resume`, `GET /api/graph/index`. SSE: `GET /api/graph/stream`, `GET /api/sessions/:id/stream`. Each entry includes request/response shape, auth (none in Phase 1, local-only), error codes, and SSE event types. | `interfaces.md` | All Phase 1 server-facing concepts | `grep -q "/api/sessions" interfaces.md && grep -q "/api/graph/stream" interfaces.md` |
| W1.5 | Update [`states.md`](./states.md): formalize `ReleaseWorkspaceLifecycle` as `draft → active → ended`. Resume re-enters `active` from `ended`. Document invariants: only `active` accepts new turns; `ended` is terminal unless resumed; transitions emit events. | `states.md` | `app-release.ReleaseWorkspaceLifecycle` | `grep -q "draft" states.md && grep -q "ended" states.md && grep -q "Resumed" states.md` |
| W1.6 | Update [`events.md`](./events.md): document SSE event types — `session-created`, `text-delta`, `tool-use-start`, `tool-use-result`, `done`, `error`, `graph-delta`. Each event documents producer, consumer, payload shape, ordering guarantees. | `events.md` | `app-release.WorkspaceInitialized`, `app-release.ProjectionRefreshed` | `for ev in session-created text-delta tool-use-start tool-use-result graph-delta; do grep -q "$ev" events.md \|\| { echo "MISS $ev"; exit 1; }; done` |
| W1.7 | Update [`queries.md`](./queries.md): document `GetWorkspaceOverview` (graph index + metrics shape), `ListPastSessions` (sessions browser response shape), `GetSessionSummary` (summary section extraction). Each query specifies inputs, output shape, and read-model derivation. | `queries.md` | `app-release.GetWorkspaceOverview`, `app-release.InspectGraphNode`, `app-release.ListPastSessions`, `app-release.GetSessionSummary` | `grep -q "ListPastSessions" queries.md && grep -q "GetSessionSummary" queries.md` |
| W1.8 | Update [`mappings.md`](./mappings.md): formalize `InterviewTurnToDomainMapUpdate` as the pipeline `userTurn → SDK chat-event stream → tool-call dispatched → file write under domain_knowledge/ → watcher emits IndexDelta → SSE graph-delta event`. Each stage has a typed input/output. | `mappings.md` | `app-release.InterviewTurnToDomainMapUpdate`, `app-release.DomainMapToWorkspaceOverview` | `grep -q "InterviewTurnToDomainMapUpdate" mappings.md` |
| W1.9 | Update [`workflows.md`](./workflows.md): formalize `GuidedReleaseWorkspaceWorkflow` (chat-driven interview loop) and `ProjectionRefreshPolicy` (debounced watcher → SSE push, ≤200ms coalesce, ignore `.git/**` and `node_modules/**`). | `workflows.md` | `app-release.GuidedReleaseWorkspaceWorkflow`, `app-release.ProjectionRefreshPolicy` | `grep -q "GuidedReleaseWorkspaceWorkflow" workflows.md && grep -q "ProjectionRefreshPolicy" workflows.md` |
| W1.10 | Update [`STORIES.md`](./STORIES.md): add classic + BDD scenarios for the Phase 1 happy path and the four Decision-Gate behaviors — native SDK tool dispatch, SSE delta arrival, combined close-modal across multi-tab, append-on-resume. Cover error paths (no Claude OAuth login, watcher overflow). | `STORIES.md` | All Phase 1 concepts | `grep -c "^Scenario:" STORIES.md` ≥ 5 |
| W1.11 | Generate [`TEST-SPEC.md`](./TEST-SPEC.md) via `domainspec-generate-tests app-release` from the updated aspect docs. The generator derives obligations from W1.3–W1.10. | `TEST-SPEC.md` | All Phase 1 concepts | `test -f TEST-SPEC.md && grep -q "EndSession" TEST-SPEC.md` |
| W1.12 | Markdown link validation across PHASE-1-DESIGN, PHASE-1-PLAN, SPEC, DECISIONS, all aspect docs, and STORIES. Every concept/type/field name referenced as a link must resolve. | — | — | `npx markdown-link-check docs/features/app-release/*.md` exit 0 |

### Wave 2 — Filesystem-as-graph index (foundation)

Blocks every subsequent wave that reads or pushes graph state. Implements the data structures contracted in `mappings.md` (W1.8) and the metric definitions in `queries.md` (W1.7).

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W2.1 | Implement frontmatter + `## Connections` table parser. Input: a markdown file. Output: `{ node, edges[] }` typed object per `mappings.md`. Excludes `domain_knowledge/sessions/**` from node count by default (per metrics spec). | `visualizations/app-release/lib/markdown-parser.mjs`, `visualizations/app-release/lib/markdown-parser.test.mjs` | `app-release.DomainMap`, `app-release.InterviewTurnToDomainMapUpdate` | `node --test visualizations/app-release/lib/markdown-parser.test.mjs` |
| W2.2 | Implement `GraphIndex` in-memory store with operations: `loadAll(dir)`, `upsert(file)`, `remove(file)`, `snapshot()`, `metrics()`. Metrics: nodes, edges, axioms (`node_type: axiom`), drafts (`status: draft`). Output shape per `queries.md`. | `visualizations/app-release/lib/graph-index.mjs`, `visualizations/app-release/lib/graph-index.test.mjs` | `app-release.DomainMap`, `app-release.GetWorkspaceOverview` | `node --test visualizations/app-release/lib/graph-index.test.mjs` |
| W2.3 | Wire `chokidar` watcher per `workflows.md` (W1.9): subscribe to `domain_knowledge/**/*.md`, ignore `.git/**` and `node_modules/**`, debounce events (~150ms), emit typed `IndexDelta` objects on the index's event emitter. | `visualizations/app-release/lib/graph-watcher.mjs`, `visualizations/app-release/lib/graph-watcher.test.mjs` | `app-release.GenerateWorkspaceProjection`, `app-release.ProjectionRefreshPolicy`, `app-release.ProjectionRefreshed` | `node --test visualizations/app-release/lib/graph-watcher.test.mjs` |

### Wave 3 — Server skeleton + REST APIs

Depends on W1 (interface contracts) and W2 (graph index).

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W3.1 | Replace `server.mjs` with the Phase 1 server. Keep `node:http` (no Express dep). Mount: static UI assets, `/api/sessions/*`, `/api/graph/*` per `interfaces.md` (W1.4). Drop fractal telemetry routes (deferred). | `visualizations/app-release/server.mjs` | — | `node visualizations/app-release/server.mjs &` then `curl -fsS localhost:8770/api/graph/index \| jq .nodes` |
| W3.2 | Sessions API per `operations.md` (W1.3) + `interfaces.md` (W1.4): `POST /api/sessions` (`StartReleaseWorkspace`), `GET /api/sessions` (`ListPastSessions`), `GET /api/sessions/:id` (`GetSessionSummary`), `POST /api/sessions/:id/turns` (`CaptureInterviewTurn`), `POST /api/sessions/:id/end` (`EndSession`), `POST /api/sessions/:id/resume` (`ResumeSession`). | `visualizations/app-release/server.mjs`, `visualizations/app-release/lib/session-store.mjs`, `visualizations/app-release/lib/session-store.test.mjs` | `app-release.StartReleaseWorkspace`, `app-release.CaptureInterviewTurn`, `app-release.EndSession`, `app-release.ResumeSession`, `app-release.ListPastSessions`, `app-release.GetSessionSummary`, `app-release.ReleaseWorkspaceLifecycle`, `app-release.WorkspaceInitialized` | `node --test visualizations/app-release/lib/session-store.test.mjs` |
| W3.3 | Graph API: `GET /api/graph/index` returns `{ nodes, edges, metrics }` from current `GraphIndex.snapshot()` per `queries.md` (W1.7). | `visualizations/app-release/server.mjs` | `app-release.GetWorkspaceOverview`, `app-release.InspectGraphNode` | `curl -fsS localhost:8770/api/graph/index \| jq '.metrics.nodes,.metrics.edges,.metrics.axioms,.metrics.drafts'` |

### Wave 4 — ChatProvider interface + claude-oauth

Depends on W0.3, W3. Implements operations defined in `operations.md` (W1.3) and event types from `events.md` (W1.6).

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W4.1 | Define `ChatProvider` interface per `interfaces.md` (W1.4): single method `respond(sessionId, userTurn, ctx) → AsyncIterable<ChatEvent>`. `ChatEvent` discriminated union matching the SSE types declared in `events.md` (W1.6): `text-delta`, `tool-use-start`, `tool-use-result`, `done`, `error`. | `visualizations/app-release/lib/chat-provider.mjs` (interface + types as JSDoc) | — | `node -e "require('./visualizations/app-release/lib/chat-provider.mjs')"` |
| W4.2 | Implement `claude-oauth` provider wrapping `@anthropic-ai/claude-agent-sdk`. Auth: read existing Claude Code OAuth credentials (no `ANTHROPIC_API_KEY`). Declare native SDK tools matching the four agent tool ops in `operations.md` (W1.3): `WriteMarkdownNode`, `AppendSection`, `UpdateFrontmatter`, `AddConnection`. Tool implementations write under `domain_knowledge/`. | `visualizations/app-release/lib/providers/claude-oauth.mjs`, `visualizations/app-release/lib/providers/claude-oauth.test.mjs` | `app-release.GuidedReleaseWorkspaceWorkflow`, `app-release.InterviewTurnToDomainMapUpdate`, `app-release.WriteMarkdownNode`, `app-release.AppendSection`, `app-release.UpdateFrontmatter`, `app-release.AddConnection` | `node --test visualizations/app-release/lib/providers/claude-oauth.test.mjs` (mocks SDK) |
| W4.3 | Wire ChatProvider into `/api/sessions/:id/turns`: receive user text → call `respond` → relay events as SSE chunks to UI. | `visualizations/app-release/server.mjs` | `app-release.CaptureInterviewTurn`, `app-release.ProjectionRefreshed` | Manual: open browser, type a turn, observe inline tool-use narration. |

### Wave 5 — Skills (interview-script, app-runtime session-close)

Depends on W4. Skills carry contracts that match `workflows.md` (W1.9) and `states.md` (W1.5).

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W5.1 | Author **interview-script skill v0** at `.claude/skills/interview-script/SKILL.md`. Defines: greenfield discovery question flow (domain, intent, actors, workflows, constraints, ambiguities), advance/branch/wrap rules, file-write conventions for `axiom/`, `premise/`, `conceptual/`, etc. Loadable by `claude-oauth` provider on session start. | `.claude/skills/interview-script/SKILL.md` | `app-release.GuidedReleaseWorkspaceWorkflow` | `grep -q "## Question Flow" .claude/skills/interview-script/SKILL.md` |
| W5.2 | Author **app-runtime session-close skill** at `.claude/skills/app-runtime-close-session/SKILL.md`. Mirrors `.claude/skills/close-session/SKILL.md` contract shape but writes under `domain_knowledge/sessions/<timestamp>-<slug>.md`. Document structure: objective, summary, decisions, files touched, next-session prompt. **Resume contract** (per Decision Gate #4 + `states.md` W1.5): when invoked with `--resume`, append `## Resumed at <ISO-timestamp>` section to the existing file rather than creating a new one. | `.claude/skills/app-runtime-close-session/SKILL.md` | `app-release.EndSession`, `app-release.ResumeSession`, `app-release.ReleaseWorkspaceLifecycle` | `grep -q "Resumed at" .claude/skills/app-runtime-close-session/SKILL.md` |
| W5.3 | Implement skill loader/runner in server: invoked from `/api/sessions/:id/end` and `/api/sessions/:id/resume`. | `visualizations/app-release/lib/skill-runner.mjs`, `visualizations/app-release/lib/skill-runner.test.mjs` | — | `node --test visualizations/app-release/lib/skill-runner.test.mjs` |

### Wave 6 — SSE push wiring

Depends on W2, W3. Event shapes contracted in `events.md` (W1.6).

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W6.1 | Add `GET /api/graph/stream` (SSE). On every `IndexDelta` from the watcher, emit `event: graph-delta` with `{ added, updated, removed, metrics }` per `events.md` (W1.6). | `visualizations/app-release/server.mjs` | `app-release.ProjectionRefreshed` | `curl -N localhost:8770/api/graph/stream` then touch a file under `domain_knowledge/` and observe a delta line. |
| W6.2 | Add `GET /api/sessions/:id/stream` for chat-event SSE per session (relays `ChatProvider.respond` events). | `visualizations/app-release/server.mjs` | `app-release.CaptureInterviewTurn` | Manual stream-read against an active session. |

### Wave 7 — UI rewrite

Depends on W3 (REST shape), W6 (SSE shape). Can scaffold in parallel with W4/W5.

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W7.1 | Replace `index.html` shell. Tab bar (active=green, paused=gray, `+ Nova sessão`, `☰ Sessões anteriores`). Active tab header with `Encerrar sessão` button. Vertical scroll layout. Portuguese-first labels. | `visualizations/app-release/index.html`, `visualizations/app-release/styles/workspace.css` | `app-release.ReleaseWorkspaceLifecycle` | Visual review against [PHASE-1-DESIGN § UI Layout](./PHASE-1-DESIGN.md#ui-layout). |
| W7.2 | Chat panel above the fold. Turn list, agent narration boxes for tool-use (`✓ wrote axiom/foo.md`), text input + Send. Subscribes to `/api/sessions/:id/stream` SSE and renders `text-delta`, `tool-use-start`, `tool-use-result` event types distinctly. | `visualizations/app-release/ui/chat-panel.mjs`, `visualizations/app-release/ui/tool-narration.mjs` | `app-release.CaptureInterviewTurn`, `app-release.InterviewTurnToDomainMapUpdate` | Manual: type a turn, observe streamed text + green tool-use boxes. |
| W7.3 | Below-the-fold embedded graph mount + metrics cards (Nodes, Edges, Axioms, Drafts). Subscribes to `/api/graph/stream`. Expand button navigates to `/visualizations/ontology-visualization/index.html?source=domain_knowledge`. | `visualizations/app-release/ui/graph-embed.mjs`, `visualizations/app-release/ui/metrics-cards.mjs` | `app-release.GetWorkspaceOverview`, `app-release.InspectGraphNode`, `app-release.GenerateWorkspaceProjection` | Manual: edit a `.md`, watch graph + metrics update without reload. |
| W7.4 | End-session confirmation modal: triggered by both Encerrar button and `beforeunload`. **Combined modal** (per Decision Gate #3) listing every open tab/session; Continuar conversa / Encerrar e gerar resumo. | `visualizations/app-release/ui/end-session-modal.mjs` | `app-release.EndSession`, `app-release.ReleaseWorkspaceLifecycle` | E2E in W9.2. |
| W7.5 | "Sessões anteriores" picker reading `GET /api/sessions`, opens chosen session via `/api/sessions/:id/resume` in a new tab. | `visualizations/app-release/ui/sessions-picker.mjs` | `app-release.ListPastSessions`, `app-release.ResumeSession` | Manual: pick past session → new tab with continuation chat. |

### Wave 8 — `/visualizations/ontology-visualization` adapter

Depends on W3.3.

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W8.1 | Add `?source=domain_knowledge` query handling to `explorer.html` + `explorer.py` (or its js loader). When set, fetch graph from the app-release server's `/api/graph/index` instead of the default static `graph_data.json`. | `visualizations/ontology-visualization/explorer.html`, `visualizations/ontology-visualization/explorer.template.html` | `app-release.GetWorkspaceOverview`, `app-release.InspectGraphNode` | Open `/visualizations/ontology-visualization/index.html?source=domain_knowledge` and confirm node count matches `/api/graph/index`. |
| W8.2 | Reuse the same engine inside the workspace embed (W7.3) by importing the renderer module rather than reimplementing — keep one engine, two mounts. | `visualizations/app-release/ui/graph-embed.mjs` (imports from ontology-visualization) | — | `grep -q "ontology-visualization" visualizations/app-release/ui/graph-embed.mjs` |

### Wave 9 — Tests & verification

Depends on all prior waves. E2E obligations derive from `STORIES.md` (W1.10) and `TEST-SPEC.md` (W1.11).

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W9.1 | E2E: greenfield happy path — start session → first agent question rendered → user reply → tool-use writes `axiom/foo.md` → graph delta arrives over SSE → metrics increment → end session → `domain_knowledge/sessions/<ts>-<slug>.md` exists. | `visualizations/app-release/tests/e2e/happy-path.spec.mjs` | All Phase 1 concepts | `node --test visualizations/app-release/tests/e2e/happy-path.spec.mjs` |
| W9.2 | E2E: multi-tab close — open 2 tabs, close window → combined modal lists both → confirm → both session docs exist on disk; cancel path leaves both sessions active. | `visualizations/app-release/tests/e2e/multi-tab-close.spec.mjs` | `app-release.EndSession`, `app-release.ReleaseWorkspaceLifecycle` | `node --test visualizations/app-release/tests/e2e/multi-tab-close.spec.mjs` |
| W9.3 | E2E: resume — past session selected → SDK is seeded with summary only (assert raw transcript NOT present in prompt) → second turn → original session doc gains `## Resumed at <ts>` section. | `visualizations/app-release/tests/e2e/resume.spec.mjs` | `app-release.ResumeSession`, `app-release.ReleaseWorkspaceLifecycle` | `node --test visualizations/app-release/tests/e2e/resume.spec.mjs` |
| W9.4 | Re-run markdown link validation (covers any new files created by implementation). | — | — | `npx markdown-link-check docs/features/app-release/*.md` exit 0 |
| W9.5 | Run `domainspec-audit-alignment` and `domainspec-audit-layering` as **parallel subagents** against the implemented Phase 1 surface. Merge findings into a single dependency-ordered remediation track and resolve before W10. | `docs/features/app-release/ALIGNMENT-REPORT.md` | — | Exit code 0 from both audits OR remediation track empty. |

### Wave 10 — Wrap & sync

| ID | Task | Files | Concepts | Verify |
|---|---|---|---|---|
| W10.1 | Run `domainspec-sync-registry` to refresh `docs/registry.md` and `docs/glossary.md`. | `docs/registry.md`, `docs/glossary.md` | — | `git diff --quiet docs/registry.md && git diff --quiet docs/glossary.md` after sync. |
| W10.2 | Run `domainspec-verify-feature app-release` and capture verdict in `docs/features/app-release/PIPELINE-REPORT.md`. | `docs/features/app-release/PIPELINE-REPORT.md` | — | Verdict `PASS` or `FLAG` with named gaps; no `BLOCK`. |

## Assumptions

These are explicit assumptions filled where docs were silent. If any is wrong, the affected wave must be revisited.

1. **Repo layout.** Phase 1 implementation extends `implementation/app-frontend/visualizations/app-release/` rather than introducing a new top-level `apps/` directory. Reasoning: keeps the existing prototype's deployment shape and minimizes dep churn.
2. **Server runtime.** Stay on `node:http` (no Express/Fastify) for Phase 1 to avoid a new runtime dependency. SSE is implementable on raw `node:http`.
3. **Test runner.** Use `node --test` (already implied by `server.test.mjs`) rather than introducing Jest/Vitest.
4. **Skill location.** New skills live under `.claude/skills/` so they are discoverable by both Claude Code (for authoring) and the app-runtime skill loader. Path may be revised when the reusable-skills library design lands (deferred Open Question #6 in discovery).
5. **OAuth credential discovery.** `claude-oauth` provider reads the user's existing Claude Code login config from its standard location. No new auth flow is shipped.
6. **Slug derivation for session filenames.** Slug is derived from the agent's session-summary "objective" line (kebab-cased, ≤40 chars). If unavailable, fallback to `untitled`.
7. **Watcher debounce window.** 150ms coalesces typical batch writes from one tool-call without making the UI feel laggy. Tunable.
8. **Graph engine reuse.** `visualizations/ontology-visualization` exposes its renderer in a way that can be imported as a module from `visualizations/app-release/`. If it does not (only HTML mount), W8.2 expands to extract a small renderer module first.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Claude Agent SDK OAuth integration fails on user's machine (no Claude Code login present). | W4.2 emits a clear error path; UI surfaces an "Open Claude Code and sign in" instruction rather than crashing. Error event documented in `events.md` (W1.6). |
| Watcher fires storms during git operations (rebase/checkout). | W2.3 debounces and ignores `.git/**`, `node_modules/**` per `workflows.md` (W1.9). Guard against single-batch deltas exceeding N files (cap; full re-snapshot if exceeded). |
| Session file write race (two tabs ending the same session in succession). | W3.2 serializes per-session-id writes via an in-memory mutex; close-session skill is idempotent on second invocation per `operations.md` (W1.3). |
| Ontology-visualization engine cannot be imported as a module. | Extract a small renderer module first (W8.2 contingency) before W7.3 wiring. |
| Brownfield gate artifacts (W0.2) blocked on user input. | Plan does not block on this for waves W1–W2 (docs + foundation); W3 implementation requires `domainspec-start brownfield` resolution; W10.2 verification will FLAG until resolved. |
| Aspect-doc updates in W1 drift from PHASE-1-DESIGN intent. | W1 tasks each forward-link to specific PHASE-1-DESIGN sections; W1.12 markdown-link validation catches dangling refs. |

## Spec-Compliance Self-Check

| Step | Evidence |
|---|---|
| 1. Read `domainspec/CHANGELOG.md` | ✓ — v2.0.2 cited in Pre-flight. |
| 2. Load existing feature docs | ✓ — SPEC, DECISIONS, PHASE-1-DESIGN, discovery all loaded. |
| 3. Audits if implementation exists | ✓ — Existing prototype acknowledged; audits scheduled in W9.5 against the new implementation; archaeological-only against the prototype. |
| 4. Interactive Decision Gate | ✓ — All four multi-option decisions surfaced via `AskUserQuestion`, answered, recorded in **Resolved Decision Gate** section above. Planning was BLOCKED until resolution. |
| 5. Spec-compliance self-check | ✓ — This table. |
| 6. Deterministic tasks + checks | ✓ — Wave plan with file paths and verify commands. |
| 7. Concept mapping | ✓ — Concept-to-Wave Mapping table + per-task `Concepts` column. |
| 8. Complexity classification | ✓ — High; mode `gsd-phase`. |
| 9–10. Mode selection | ✓ — `gsd-phase`; plan still rendered in DomainSpec form. |
| 11. Assumptions explicit | ✓ — Assumptions section. |
| 12. Emit signals | Pending — handed to `domainspec-emit-signals` skill (see Signals to Emit below). |
| **Authority rule** | ✓ — W1 (documentation alignment) gates all implementation waves W3+. SPEC + aspect docs define behavior; code derives from them. |

## Signals to Emit

To be appended to `docs/signals/pipeline-signals.jsonl` per `.github/skills/domainspec-emit-signals/SKILL.md` after this plan is accepted. Source: `session-epilogue`.

- **decision** × 4 — one per Resolved Decision Gate row, with `feature: app-release`, `phase: 1`, `selected: <option>`, `rationale: <text>`.
- **decision** × 1 — plan reordering to docs-first; `selected: W1-documentation-alignment-gates-implementation`, `rationale: DomainSpec authority rule`.
- **spec-gap** × 1 — brownfield startpoint artifacts missing under `implementation/app-frontend/docs/`. Severity: medium. Remediation: run `domainspec-start brownfield`.
- **proposal** × 1 — extract ontology-visualization renderer into a reusable module if W8.2 finds it not importable. Target: `visualizations/ontology-visualization/`.
- **step-verdict** × 1 — `step: plan`, `verdict: PASS`, `retriesNeeded: 1`, `delegatesUsed: [domainspec-decision-gate]`. Retry reason: initial wave order put doc updates after implementation, corrected to docs-first per user feedback.
- **rework** × 1 — `step: plan`, `iteration: 2`, `rootCause: planner-default-deferred-doc-updates-to-final-wave`, `correction: docs-first-ordering-restored`.

## Connections

| Document | Type | Description |
|---|---|---|
| [[PHASE-1-DESIGN]] | `derives-from` | Every wave maps to a PHASE-1-DESIGN section; the four resolved decisions are PHASE-1-DESIGN's deferred decisions. |
| [[DECISIONS]] | `extends` | Adds Phase 1 architecture decisions on top of the v1 scope decisions already recorded. |
| [[SPEC]] | `narrows` | W1.2 narrows the SPEC concept registry to the Phase 1 surface; deferred concepts are listed explicitly. |
| [[app-release-discovery]] | `derives-from` (transitive via PHASE-1-DESIGN) | — |
