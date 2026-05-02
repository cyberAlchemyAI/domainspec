---
tags: [app-release, phase-1, planning, spec, tests, implementation, sse, agent-sdk, workspace]
node_type: implementation-plan
is_session: true
layer: application, architecture, tooling
nature: descriptive, technical
status: active
created: 2026-05-01
timestamp: 2026-05-01T13:41:19-03:00
expires: 2026-07-30
conversation_id: ~
decisions_made: true
contradictions_found: false
specs_updated:
  - implementation/app-frontend/docs/features/app-release/PHASE-1-DESIGN.md
  - implementation/app-frontend/docs/features/app-release/PHASE-1-PLAN.md
  - implementation/app-frontend/docs/features/app-release/SPEC.md
  - implementation/app-frontend/docs/features/app-release/DECISIONS.md
  - implementation/app-frontend/docs/features/app-release/domain.md
  - implementation/app-frontend/docs/features/app-release/operations.md
  - implementation/app-frontend/docs/features/app-release/interfaces.md
  - implementation/app-frontend/docs/features/app-release/queries.md
  - implementation/app-frontend/docs/features/app-release/mappings.md
  - implementation/app-frontend/docs/features/app-release/workflows.md
  - implementation/app-frontend/docs/features/app-release/states.md
  - implementation/app-frontend/docs/features/app-release/events.md
  - implementation/app-frontend/docs/features/app-release/STORIES.md
  - implementation/app-frontend/docs/features/app-release/TEST-SPEC.md
promoted_candidates:
  - "Plan structure axiom: documentation alignment must precede implementation waves (DomainSpec authority rule)."
  - "Decision-gate-as-mandatory-step: every multi-option deferred decision in DESIGN must be resolved interactively before any code is written."
expected_importance: 9
importance_rationale: "Establishes the entire Phase 1 surface of the app-release workspace end-to-end — plan, narrowed SPEC, all aspect-doc updates, derived test obligations, and a working local implementation that runs against the live domain_knowledge/ tree. Sets the contract every later wave (live SDK activation, UI polish, governance queue, fractal) will narrow against."
---

# App Release — Phase 1 End-to-End: Plan, Spec, Tests, Implementation

## Objective

This document records the session in which `domainspec-planner` was driven through the full Phase 1 pipeline (plan → spec → stories → tests → implement) for the app-release workspace, producing a runnable local web app backed by `domain_knowledge/`. It answers: what was decided, what shipped, and what remains.

## Summary

The session executed `domainspec-planner` against [PHASE-1-DESIGN.md](../../docs/features/app-release/PHASE-1-DESIGN.md) under the `domainspec-pipeline` skill, advancing through the pipeline in stages with explicit checkpoints (`--spec-only`, `--test-only`, then full implementation).

### What changed

1. **Decision Gate (mandatory step 4 of the planner).** Four architectural decisions deferred during DESIGN were resolved interactively:
   - Tool-use mechanism → **native Claude Agent SDK tool API**
   - Live graph push transport → **Server-Sent Events (SSE)**
   - End-session-on-window-close UX → **combined modal listing all open sessions**
   - Resume file model → **append `## Resumed at <timestamp>` section to the original session document**
   These are recorded in [DECISIONS.md](../../docs/features/app-release/DECISIONS.md) and [PHASE-1-DESIGN.md § Resolved Architecture Decisions](../../docs/features/app-release/PHASE-1-DESIGN.md).

2. **Plan reordered to docs-first.** The first plan draft (v0.1.0) put doc updates in the final wave (W9); on user pushback we corrected it to v0.2.0, where W1 is now the **Documentation alignment gate** that blocks all implementation waves W3+. This honors DomainSpec's authority rule (`SPEC + aspect docs are the source of truth, code derives from them`) and matches the pipeline's `plan → spec → stories → tests → implement` order.

3. **Spec phase (Step 2-3).** Narrowed [SPEC.md](../../docs/features/app-release/SPEC.md) to the Phase 1 surface — added a "Phase 1 Surface" section, expanded the Concept Registry to 39 rows with a Phase 1 column, and introduced 8 new concept IDs (`InterviewSession`, `SessionStatus`, `EndSession`, `ResumeSession`, four agent tool ops, `ListPastSessions`, `GetSessionSummary`, plus the `InterviewSessionLifecycle` state machine and seven new SSE event types). Each aspect doc (`domain.md`, `operations.md`, `interfaces.md`, `queries.md`, `mappings.md`, `workflows.md`, `states.md`, `events.md`) gained a Phase 1 Status header marking concepts as in-scope, deferred, or new. [STORIES.md](../../docs/features/app-release/STORIES.md) gained five new BDD scenarios (US-9 through US-13). All 227 internal anchor links validated.

4. **Test phase (Step 4).** Authored [TEST-SPEC.md](../../docs/features/app-release/TEST-SPEC.md) — ~148 test obligations derived per the rules in [TEST-PIPELINE.md](../../../../TEST-PIPELINE.md), each row traceable to a specific source row in operations/interfaces/events/queries/mappings/workflows/states/STORIES.

5. **Implementation phase (Step 5).** Wrote the Phase 1 surface end-to-end:
   - **Foundation libs** — markdown parser (frontmatter + `## Connections` table), in-memory `GraphIndex` with 4-metric exposure (`{nodes, edges, axioms, drafts}` excluding `sessions/**`), `chokidar` watcher with debounce and `WATCHER_OVERFLOW` handling.
   - **Session store** — `draft → active → ended` lifecycle, append-on-resume, idempotent end, summary-only `getSummary` (transcript never leaks into seed).
   - **Agent tools dispatcher** — pure-fs implementations of `WriteMarkdownNode`, `AppendSection`, `UpdateFrontmatter`, `AddConnection` with path-traversal guards, idempotent connection-row writes, frontmatter merge preserving body bytes.
   - **ChatProvider interface** + `MockChatProvider` (deterministic, scriptable) + `claude-oauth` provider scaffold (emits `AUTH_MISSING`/`SDK_MISSING`/`NOT_ACTIVATED` until env-gated activation; tool schemas declared, system prompt inlined since W5 skills are sourced from this repo's `.claude/` rather than authored fresh).
   - **Server** — `node:http`, no Express. All 7 Phase 1 REST endpoints with documented status codes (201/200/202/400/404/409/422), two SSE streams (`/api/graph/stream`, `/api/sessions/:id/stream`) with the seven event types, ToolUseId correlation between start/result events, test-only state introspection at `/api/_test/state`.
   - **UI** — single `index.html` with embedded CSS, `app.mjs` controller. Multi-tab bar (active=green dot, paused=gray), Portuguese-first labels (`+ Nova sessão`, `Sessões anteriores`, `Encerrar sessão`, `Continuar conversa`, `Encerrar e gerar resumo`), chat panel with inline tool-use narration boxes, embedded `force-graph` 2D mount, four metrics cards, combined end-session modal, sessions picker drawer, toast banner for SSE errors (including `AUTH_MISSING` UX prompt to "abrir Claude Code e fazer login").
   - **Ontology adapter** — new `visualizations/ontology-visualization/index.html`. By default redirects to `explorer.html`. With `?source=domain_knowledge` it mounts a full-screen `force-graph` view backed by `/api/graph/index` and re-renders on `graph-delta` SSE.

6. **Tests.** 78/78 pass. Distribution: 17 foundation-lib tests, 15 session-store, 5 chat-provider, 17 agent-tools, 5 claude-oauth, 12 server REST+SSE, 7 E2E (happy-path, multi-tab close, resume).

7. **Audits (W9.5).**
   - **Layering**: ✓ no violations. `lib/*` does not import from `server.mjs` or `app.mjs`; server doesn't import browser code.
   - **Stub & dead code**: ✓ none.
   - **Alignment**: ⚠ FLAG. 12 of 18 in-scope concept IDs (mostly enums and abstract workflow names) lack a direct code-symbol reference because their implementation is implicit (e.g. `GetWorkspaceOverview` ≡ `GET /api/graph/index`). Not a blocker; remediation is to add `// @concept` anchors.

8. **Live verification.** Server brought up against the real `implementation/app-frontend/domain_knowledge/` (18 nodes / 97 edges / 1 axiom / 11 drafts). UI page loads. User comment: "the UI is horrible, but we can improve later" — visual polish deferred.

### Two surprising threads worth remembering

- **Mandatory Decision Gate enforcement actually paid off.** The planner agent contract says `Planning is BLOCKED until all multi-option decisions are resolved`. Honoring that strictly — running `AskUserQuestion` for the four PHASE-1-DESIGN deferred decisions before producing any task breakdown — meant zero "the architecture changed mid-build" rework downstream.
- **Docs-first reordering was caught by the user, not by the planner.** v0.1.0 of the plan put `STORIES.md` and `TEST-SPEC.md` updates as the *last* wave (W9), AFTER implementation. The user flagged this with one question — "shouldn't we update the documentation first?" — and the v0.2.0 reordering became axiom-level: documentation alignment is W1, gates everything else. This is the highest-importance pattern from the session because it says: *the planner agent's default ordering is wrong against the pipeline contract, and the user catching it means the agent should bake docs-first into its template, not trust its own first draft*.

## Decisions made

| Decision | Outcome |
| --- | --- |
| Tool dispatch mechanism | Native Claude Agent SDK tool API |
| Live graph push transport | SSE (with bootstrap delta on connect, `Last-Event-ID` reconnect) |
| End-session-on-window-close UX | Combined modal listing every active session |
| Resume file model | Append `## Resumed at <timestamp>` section in place |
| Plan ordering | Docs-first: W1 doc alignment gates W2+ implementation |
| Skill authoring scope | W5 (interview-script, app-runtime-close-session) skipped: skills sourced from this repo's `.claude/` |
| Live SDK activation | Deferred: `claude-oauth` provider ships scaffolded with `NOT_ACTIVATED` and explicit `AUTH_MISSING`/`SDK_MISSING` paths |
| Test runner choice | `node --test` (no Jest/Vitest); E2E uses `node:test`+`fetch` rather than installing Playwright |
| Server runtime | `node:http`, no Express/Fastify |
| Repo layout | Phase 1 extends `visualizations/app-release/` rather than introducing a new top-level directory |
| Brownfield startpoint artifacts | Acknowledged FLAG; not authored this session — verify-feature will FLAG until `domainspec-start brownfield` is run |

## Files touched

### Documentation (W1 alignment)

- implementation/app-frontend/docs/features/app-release/PHASE-1-DESIGN.md
- implementation/app-frontend/docs/features/app-release/PHASE-1-PLAN.md (created, then v0.1.0 → v0.2.0)
- implementation/app-frontend/docs/features/app-release/SPEC.md
- implementation/app-frontend/docs/features/app-release/DECISIONS.md
- implementation/app-frontend/docs/features/app-release/domain.md
- implementation/app-frontend/docs/features/app-release/operations.md
- implementation/app-frontend/docs/features/app-release/interfaces.md
- implementation/app-frontend/docs/features/app-release/queries.md
- implementation/app-frontend/docs/features/app-release/mappings.md
- implementation/app-frontend/docs/features/app-release/workflows.md
- implementation/app-frontend/docs/features/app-release/states.md
- implementation/app-frontend/docs/features/app-release/events.md
- implementation/app-frontend/docs/features/app-release/STORIES.md
- implementation/app-frontend/docs/features/app-release/TEST-SPEC.md (created)

### Implementation (W2 – W8)

- implementation/app-frontend/visualizations/app-release/package.json (created)
- implementation/app-frontend/visualizations/app-release/server.mjs (rewritten)
- implementation/app-frontend/visualizations/app-release/server.test.mjs (rewritten)
- implementation/app-frontend/visualizations/app-release/index.html (rewritten)
- implementation/app-frontend/visualizations/app-release/app.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/markdown-parser.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/graph-index.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/graph-watcher.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/session-store.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/agent-tools.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/chat-provider.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/app-release/lib/providers/claude-oauth.mjs + .test.mjs (created)
- implementation/app-frontend/visualizations/ontology-visualization/index.html (created — `?source=domain_knowledge` adapter)

### Tests (W9)

- implementation/app-frontend/visualizations/app-release/tests/e2e/happy-path.spec.mjs (created)
- implementation/app-frontend/visualizations/app-release/tests/e2e/multi-tab-close.spec.mjs (created)
- implementation/app-frontend/visualizations/app-release/tests/e2e/resume.spec.mjs (created)

## Open threads

- **UI visual polish** — explicit deferral by the user; current UI is functional but unrefined.
- **Live `claude-oauth` SDK activation** — provider scaffolded but emits `NOT_ACTIVATED` until the env-gated activation work happens. Without it, agent file-writes do not run; UI/REST/SSE/graph-update plumbing is fully exercisable.
- **Brownfield startpoint artifacts** missing under `implementation/app-frontend/docs/`: `PROJECT-OVERVIEW.md`, `INITIAL-DEFINITIONS.md`, `PROJECT-DECISIONS.md`. Verify-feature will FLAG until `domainspec-start brownfield` runs.
- **Signals queue not flushed** — 4× `decision`, 1× `spec-gap`, 1× `proposal`, 1× `step-verdict`, 1× `rework` queued for `domainspec-emit-signals` but `docs/signals/pipeline-signals.jsonl` does not exist yet.
- **Alignment audit FLAG** — 12 in-scope concept IDs lack direct code-symbol references; remediation is to add `// @concept` anchors.

## Next-session prompt

> "Activate the live `claude-oauth` SDK loop in `lib/providers/claude-oauth.mjs` (currently returns `NOT_ACTIVATED`). Wire the SDK's tool-use streaming through the same `ChatEvent` discriminated union the MockChatProvider exposes. Add an integration test that runs against the real SDK behind a `CLAUDE_CODE_OAUTH=1` env gate, skipped in CI by default."

## Connections

| Document | Type | Description |
| --- | --- | --- |
| [[PHASE-1-DESIGN]] | `derives-from` | The design document this session implemented end-to-end |
| [[PHASE-1-PLAN]] | `realizes` | The plan whose waves W0–W9 this session executed (W5 skipped) |
| [[2026-04-29-0821-app-release-tests-and-ui-fix]] | `supersedes-context` | Prior session on the same workspace; this session rewrote the prototype it left behind |
