# Agents Findings — Chat UI Variants via Shared Data Contract

This file accumulates raw findings from each agent in the multi-phase research effort.
See [agents-strategy.md](./agents-strategy.md) for the phase plan and [agents/](./agents/) for per-agent role specs.

---

## Agent 01 — ui-element-researcher

**Status:** complete

**Deliverables:**
- [deliverables/ELEMENT-TAXONOMY.md](./deliverables/ELEMENT-TAXONOMY.md) — 32 elements, with parent/child relationships and a closed coverage comment.
- [deliverables/CHAT-PAYLOAD-SCHEMA.md](./deliverables/CHAT-PAYLOAD-SCHEMA.md) — v1.0.0; 9 top-level sections (`version`, `generatedAt`, `activeSessionId`, `tabs`, `chats`, `pastSessions`, `graph`, `ui`, `connection`, `toasts`, `i18n`); fully-populated `mockPayload` exercising every documented element state.
- [deliverables/INJECTION-CONTRACT.md](./deliverables/INJECTION-CONTRACT.md) — parent ↔ template handshake, six parent→template event names (`payload-update`, `tool-use-progress`, `session-status-change`, `graph-delta`, `connection-change`, `toast`), eleven template→parent intent names, fallback + error matrix, SSE fan-out mapping.

**Surprising findings:**
- The current monolithic UI implements `narration.error` ambiguously: `tool-use-result` events with `output.error` are reshaped client-side into a top-level `error` field, but the server's [events.md](../../events.md) documents `output: { error: string }` as the canonical wire shape. The schema standardizes on top-level `narration.error` (parent normalizes); both shapes survive at the wire layer.
- The existing `app.mjs` mutates the same agent turn for sequential agent text + tool-use cycles (`appendToLastTurn`). I codified `turn.streaming` and `chats[sid].streaming` as explicit booleans so templates can render typing indicators without inferring state from "last turn is agent and recent".
- The `metric-card.axioms` and `metric-card.drafts` keys are exposed on `/api/graph/index`'s `metrics` object today, but neither is currently emitted as a SSE field beyond the bootstrap snapshot — Phase 1 parent re-fetches the full snapshot on every `graph-delta`. The schema documents the four metrics as required and templates render them blindly; the re-fetch policy is invisible to templates.
- The `firstQuestion` field of `session-created` exists on the wire but is fired on the per-session SSE stream AFTER the `POST /api/sessions` response returns. The schema folds it into `chats[sid].turns[0]` so templates never need to know about the timing nuance.
- `connection.status` is a derived field. The wire layer has only `error` events with arbitrary codes; the parent maps them to four enum values (`ok`, `reconnecting`, `degraded`, `auth-missing`). Templates that need finer granularity should rely on `connection.code`.

**Decisions made:**
- One schema, no variants. `version: "1.0.0"`. Forward compatibility lives in MINOR bumps.
- Templates NEVER touch REST or SSE. The parent is the sole network actor; templates speak only `postMessage`.
- All pt-BR strings live in `payload.i18n.strings` (closed key set) so templates don't hardcode copy.
- Coverage attestation is a `<!-- @taxonomy-coverage … -->` HTML comment at the top of every template — Phase 3 greps for it.
- Companion postMessage events (`tool-use-progress`, `graph-delta`, `connection-change`, `toast`, `session-status-change`) are SHADOWS of `payload-update`: the parent always emits `payload-update` immediately after a fine-grained event so simpler templates that ignore the fine-grained bus never miss data.
- Template→parent intents use the `intent:*` namespace with a fixed envelope (`{type, templateId, ts}`).
- Fallback rule: standalone or cross-origin → `mockPayload`. Cross-origin reads guarded with `try/catch`.

**Open questions for human:**
- `app-release.SessionStatus` enum has `draft | active | ended` per [SPEC.md](../../SPEC.md), but the wire today only emits `active` and `ended`. Should `draft` ever surface to UI tabs, or is it a transient internal-only state? I exposed all three in the schema; templates render `draft` identical to `active` until clarified.
- The `pastSessions[].endedAt` field is currently a free-form string from the server (parsed from frontmatter). Should the schema mandate ISO-8601 normalization on the parent side? I documented ISO-8601 in v1.0.0 — confirms the parent must normalize before exposure.
- The `intent:dismiss-toast` intent is listed as optional. Should toasts always auto-dismiss (no user dismissal), or is manual dismissal a Phase 2 design freedom? I left it optional.
- `filesTouched` on a chat turn is best-effort today (the server collects from `output.files` or `output.path`). Should templates render this as a per-turn affordance ("ver arquivos tocados"), or is it metadata only? I documented it as optional metadata; templates may surface it but are not required to.
- The Phase 1 backend has no `intent:select-session` (tab switching is purely client state). Should the schema persist active-tab choice across reloads, and via which channel? Today the parent holds it in memory; nothing backs it.
- The `graph-expand-link` opens the standalone ontology visualization. Should this also pass the active session's filtered subgraph as a query param? Out of scope for v1.0.0; logged for future.

---

## Agent 01b — contract-patch (v1.0.0 → v1.1.0)

**Status:** complete
**Deliverables modified:**
- ELEMENT-TAXONOMY.md (32 → 36 elements)
- CHAT-PAYLOAD-SCHEMA.md (v1.0.0 → v1.1.0, mockPayload regenerated)
- INJECTION-CONTRACT.md (added file-op event, intent:update-preference, 3 graph-overlay intents)

**Deliverables created:**
- NORMALIZATIONS.md (single source of truth for timestamp/id/path/enum/string/number/boolean rules)

**Resolutions applied:**
1. SessionStatus → active|ended (draft removed)
2. NORMALIZATIONS.md split out + referenced from schema
3. Toast severity drives auto-dismiss + manual-dismiss rules
4. filesTouched → filesCreated/Changed/Deleted + file-op SSE event + live-file-ops element
5. user.preferences slot + localStorage rules + future cookie-backed swap path
6. Graph expand: overlayRoute + standaloneRoute + 4 new elements + 3 new intents

**Open questions for human:** none — all six closed.
