---
tags: [app-release, harness, phase-1, design, ui, agent, knowledge-graph, oauth]
node_type: implementation-plan
is_session: false
layer: application, architecture
nature: technical, procedural
status: draft
version: 0.1.0
last_updated: 2026-04-30
---

# Phase 1 Design — Harness App-Release Workspace

## Objective

This document is the consolidated implementation design for Phase 1 of the Harness app-release workspace. It captures every locked decision from `app-release-discovery.md`, names the components, fixes the data flow, and pins down which questions are deferred to planning. It is the contract that Phase 1 implementation work answers to.

## Scope

Phase 1 ships a single-screen, vertically scrolling, multi-tabbed local web app where a user holds LLM-driven interview sessions about a domain. The agent writes markdown into `domain_knowledge/` while the user watches the resulting graph grow in real time. Sessions can be ended explicitly, browsed, and resumed.

**In scope:**
- Multi-tab session UI (chat above the fold, interactive 2D domain graph + metrics below)
- Real bidirectional chat with Claude via Claude Agent SDK + OAuth
- Filesystem-as-truth domain graph derived from `domain_knowledge/**/*.md`, kept live via file watcher
- Session lifecycle: start, end with confirmation, browse past, resume from summary
- Skill-defined contracts for the interview script and the session-close behavior
- Embedded interactive graph using the same engine as `/visualizations/ontology-visualization`, with an expand action that navigates to the full mount

**Out of scope (deferred):**
- Code graph (will share the same engine when added)
- Multi-provider model selection (Gemini, ChatGPT, Claude-via-API-key)
- Fractal playback surface
- Governance queue and prototype variant steering from `SPEC.md`
- Telemetry ingestion, agent-cost surfacing, CI governance loop
- Cloud / multi-user / multi-project switching

## Architecture

Five components, all running locally:

1. **Web UI** — `visualizations/app-release/index.html` (major rewrite of the existing prototype). Vertical-scroll page with tab bar at top, chat above the fold, interactive 2D graph + metrics cards below the fold. End-session confirmation modal. Portuguese-first labels.

2. **Local Node server** — `visualizations/app-release/server.mjs` (extended). Owns: sessions API (create, list, resume, end), chat API (proxies user turns to the Claude Agent SDK and streams responses back), graph API (serves the derived index), watcher lifecycle.

3. **Filesystem-as-graph + watcher** — `domain_knowledge/` is canonical. Server parses every `.md` file at startup, builds an in-memory index of nodes (frontmatter) and edges (parsed from each document's `## Connections` table), and updates the index via a `chokidar` filesystem watcher. The UI reads the index over the graph API. There is no separate normalized store of truth; git is the persistence layer.

4. **LLM agent layer** — `@anthropic-ai/claude-agent-sdk`, authenticated via the user's existing Claude Code OAuth login. The agent loop is driven by the Agent SDK's built-in dispatch; tool-use, file editing, and prompt caching are handled by the SDK. The agent's question flow is provided by an external **interview-script skill** (authored separately, easy to evolve). Tool calls (file writes, links, etc.) stream into the chat as inline narration boxes ("✓ wrote `axiom/foo.md`", "✓ linked to `bar.md`").

5. **Session-close skill (app-runtime)** — analogous to `.claude/skills/close-session/SKILL.md`, but writes session documents under `domain_knowledge/sessions/<timestamp>-<slug>.md`. Invoked by the server when the user confirms End Session. The skill defines the document structure (objective, summary, decisions, files touched, next-session prompt) so the contract evolves without code changes.

### Chat dispatch is an interface

Even though Phase 1 only ships one implementation, the server exposes chat dispatch behind a small `ChatProvider` interface (single-method `respond(sessionId, userTurn) -> stream`). The Phase 1 implementation, `claude-oauth`, wraps the Claude Agent SDK. Phase 2 can add `claude-api`, `openai-api`, `gemini-api` slots without rewriting the server.

## Data Flow

### New session
1. User clicks **+ Nova sessão**.
2. Server creates a session record (in-memory + draft file at `domain_knowledge/sessions/<timestamp>-draft.md`).
3. Server opens an Agent SDK conversation seeded with the interview-script skill's first question.
4. UI receives the new tab; chat panel renders the agent's first turn.

### User reply
1. UI POSTs the turn to the chat API with the session ID.
2. Server appends to the session's chat history and forwards the turn to the Agent SDK.
3. Agent SDK streams the response. Tool calls (file writes, link insertions) execute against `domain_knowledge/`.
4. The watcher fires on every file change; the graph index updates; the graph API pushes the delta to the UI (server-sent events or polling, decided in planning).
5. Tool-call results render inline in the chat as narration boxes; the graph and metrics re-render below the fold.

### End session (button or tab/window close)
1. Both paths trigger the same confirmation modal.
2. On confirm, server invokes the session-close skill, passing the session's chat history and the list of files touched.
3. The skill writes the final session document at `domain_knowledge/sessions/<timestamp>-<slug>.md`.
4. Server clears the in-memory session; UI closes the tab.
5. On dismiss, the modal closes and the session continues unchanged.

### Resume past session
1. User opens **Sessões anteriores**, picks a session.
2. Server reads the session document but extracts **only the summary section** as starting context.
3. Server opens a fresh Agent SDK conversation seeded with that summary plus any "next-session prompt" the document carries.
4. UI opens a new tab tied to a continuation of that original session (the new chat appends to the same session document on next end).
5. The full original transcript stays on disk for human reference but is **not** replayed into the model context.

## Multi-Tab State

- Tabs are client-side. Each tab holds a session ID.
- Server keeps each session's chat state in memory keyed by session ID.
- Graph + metrics are **global per project**: one `domain_knowledge/` = one graph. Switching tabs switches only the chat history shown; the graph below the fold is the same authoritative live view across tabs.
- Closing the browser window closes all tabs; the confirmation modal must run for **each active tab** before the window actually closes (or, simpler: a single combined modal listing all active sessions to be closed — exact UX deferred to planning).

## `/visualizations` Integration

- The embedded graph on the workspace page is the **same engine** as `/visualizations/ontology-visualization`, mounted in a smaller container.
- Both reads come from the same graph API on the local server.
- The expand button navigates to `/visualizations/ontology-visualization/index.html?source=domain_knowledge` (or equivalent), which mounts the engine full-screen against the same data.
- A small adapter may be needed in the existing `ontology-visualization` to point at `domain_knowledge/` rather than its current default; minor, scoped during planning.

## Skills To Author

Both skills are authored outside this codebase deliverable but Phase 1 needs a v0 of each before the demo works:

1. **interview-script skill** — defines the structured question flow for greenfield discovery (domain, intent, actors, workflows, constraints, ambiguities). Specifies how the agent decides when to advance, branch, or wrap up.
2. **app-runtime session-close skill** — defines the structure of session documents in `domain_knowledge/sessions/`. Mirrors the contract shape of `.claude/skills/close-session/SKILL.md` but targets a different audience (end users of the Harness app, not Claude Code conversations about Harness itself).

## Auth Model

- **No `ANTHROPIC_API_KEY`** required. The Claude Agent SDK reads the user's existing Claude Code login via OAuth; chat usage counts against the user's Pro/Max subscription.
- **Single-user, local-only.** This is consistent with the Phase 1 runtime decision in the discovery (`local-only runtime with a local window for user interaction`).
- **No multi-tenant story.** Adding multi-tenant or cloud is a Phase 2+ concern that requires the `claude-api` / `openai-api` / `gemini-api` `ChatProvider` slots to come online.

## UI Layout

The locked layout from the visual-companion mockup:

- **Tab bar** at the top: open sessions (active = green dot, paused = gray), `+ Nova sessão`, `☰ Sessões anteriores`.
- **Active tab header**: session label, "Sessão ativa" eyebrow, **Encerrar sessão** button (warm accent).
- **Chat panel** above the fold: turn list, agent narration of tool-use inline (green boxes), text input + Send.
- **Below the fold** (scroll): interactive 2D domain graph (same engine as `/visualizations`), with `⤢ Open in /visualizations`.
- **Further below**: metrics cards — Nodes, Edges, Axioms, Drafts.
- **End-session modal**: title "Encerrar 'X'?", explanatory body, "Continuar conversa" / "Encerrar e gerar resumo" buttons.

UI language is Portuguese-first ("Encerrar sessão", "Nova sessão", "Sessões anteriores", "Continuar conversa", "Encerrar e gerar resumo").

## Metrics (Phase 1 set)

- **Nodes** — total count of `.md` files indexed under `domain_knowledge/` (excluding `sessions/` by default)
- **Edges** — total count of declared connections across all `## Connections` tables
- **Axioms** — count of nodes with `node_type: axiom`
- **Drafts** — count of nodes with `status: draft`

Additional cuts (by `layer`, by `nature`, by `status`) are deferred to a later iteration.

## Resolved Architecture Decisions

These four decisions were deferred during DESIGN and resolved by the `domainspec-planner` Decision Gate on 2026-04-30. Source of truth: [DECISIONS.md § Resolved During Phase 1 Planning](./DECISIONS.md#resolved-during-phase-1-planning-2026-04-30) and [PHASE-1-PLAN.md § Resolved Decision Gate](./PHASE-1-PLAN.md#resolved-decision-gate).

1. **Tool-use mechanism — Native Agent SDK tool API.** File edits flow through `@anthropic-ai/claude-agent-sdk` native tool dispatch. Reason: less custom plumbing, automatic tool-use streaming, prompt caching preserved. Original alternative considered: server-interpreted structured JSON.
2. **Live graph push mechanism — Server-Sent Events (SSE).** One-way server→client stream over `EventSource`. Reason: correct shape for unidirectional graph deltas; simpler than websockets. Original alternatives considered: polling, websocket.
3. **End-session-on-window-close UX — Combined modal.** A single confirmation modal enumerates every active session when the window closes. Reason: simpler implementation, clearer mental model with 3+ tabs. Original alternative considered: one modal per active tab in sequence.
4. **Sessions vs continuation file model — Append `## Resumed at <timestamp>` section to original file.** One file per logical session thread; the close-session skill handles the append on resume. Reason: keeps history linear and human-readable. Original alternatives considered: new continuation file per resume, or overwrite original.

## Open Questions Deferred Past Phase 1

These are listed in the discovery and remain open:
- Telemetry ingestion shape and metric set
- Reusable-skills library / discovery model
- Visual direction for landing page / editorial framing
- Long-form governance metric set

## Related Documents

- Upstream framing: [`docs/features/discovery/app-release-discovery.md`](../discovery/app-release-discovery.md)
- DomainSpec spec for the feature: [`docs/features/app-release/SPEC.md`](./SPEC.md)
- Existing prototype (will be rewritten): [`visualizations/app-release/`](../../../visualizations/app-release/)
- Existing visualization to embed: [`visualizations/ontology-visualization/`](../../../visualizations/ontology-visualization/)
- Pattern for the session-close skill: [`.claude/skills/close-session/SKILL.md`](../../../.claude/skills/close-session/SKILL.md)
- Source of truth for the graph: [`domain_knowledge/`](../../../domain_knowledge/)

## Connections

| Document | Type | Description |
|---|---|---|
| [[app-release-discovery]] | `derives-from` | Every locked decision in this design comes from the discovery's "Current Scope Decisions" |
| [[app-release/SPEC]] | `narrows` | This design narrows the existing app-release SPEC to the Phase 1 surface; the broader SPEC stays the long-term reference |
| [[close-session]] (skill) | `references` | The new app-runtime session-close skill mirrors this skill's contract pattern |
