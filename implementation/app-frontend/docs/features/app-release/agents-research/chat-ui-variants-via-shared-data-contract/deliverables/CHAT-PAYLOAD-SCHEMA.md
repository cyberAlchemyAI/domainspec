---
tags: [app-release, ui, schema, data-contract]
node_type: conceptual
is_session: false
layer: application, architecture
nature: descriptive, procedural
status: active
version: 1.1.0
last_updated: 2026-05-01
---

# Chat Payload Schema

> **TEMPLATE AUTHORS:** This is the single source of truth for the data contract every layout reads. The parent page exposes one object — `window.chatPayload` (= `window.parent.chatPayload` from inside an iframe) — and that object's shape is defined below. If you find yourself wishing for a field that is not listed here, log it as an Open Question for Phase 1; do not invent fields.
>
> See [INJECTION-CONTRACT.md](./INJECTION-CONTRACT.md) for HOW to read it. See [ELEMENT-TAXONOMY.md](./ELEMENT-TAXONOMY.md) for WHICH element renders WHICH field.

## Overview

The Phase 1 backend exposes:
- REST under `/api/sessions/...` and `/api/graph/...`
- SSE on `/api/graph/stream` (`graph-delta` events) and `/api/sessions/:id/stream` (`session-created`, `text-delta`, `tool-use-start`, `tool-use-result`, `done`, `error`).

The parent page (the harness shell) is the **sole consumer** of these wire formats. It folds REST responses + SSE deltas into one in-memory object — `window.chatPayload` — and re-emits a `payload-update` `postMessage` whenever it mutates. Templates render `window.chatPayload`; they NEVER touch REST or SSE directly.

This indirection is what lets four wildly different UIs share one backend.

## Top-level schema

```json
{
  "version": "1.1.0",
  "generatedAt": "2026-05-01T13:41:19-03:00",
  "activeSessionId": "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
  "tabs": [ /* SessionTab */ ],
  "chats": {
    "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01": { /* SessionChat */ }
  },
  "pastSessions": [ /* PastSessionRef */ ],
  "graph": {
    "snapshot": { /* GraphSnapshot */ },
    "lastDelta": { /* GraphDelta | null */ },
    "lastDeltaAt": "2026-05-01T13:41:09-03:00",
    "expandedView": { /* ExpandedView */ }
  },
  "ui": {
    "endModalOpen": false,
    "pickerOpen": false,
    "creatingSession": false,
    "inputDisabled": false,
    "graphOverlayOpen": false
  },
  "connection": {
    "status": "ok",
    "code": null,
    "message": null,
    "lastChangeAt": "2026-05-01T13:31:00-03:00"
  },
  "toasts": [ /* Toast */ ],
  "user": { /* UserState */ },
  "i18n": {
    "locale": "pt-BR",
    "strings": { /* see §"Fixed UI strings" */ }
  }
}
```

### Field rules — top-level

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `version` | string | yes | Semver. This document is `1.1.0`. Templates SHOULD warn (not crash) on a mismatched MAJOR. |
| `generatedAt` | timestamp | yes | Set by parent on every fold. See [NORMALIZATIONS.md § Timestamps](./NORMALIZATIONS.md#timestamps). |
| `activeSessionId` | uuid \| null | yes | `null` means "no active session". When non-null, MUST appear as a `tabs[].sessionId`. See [NORMALIZATIONS.md § IDs](./NORMALIZATIONS.md#ids). |
| `tabs` | `SessionTab[]` | yes | May be empty. Order = user-facing tab order. |
| `chats` | `Record<sessionId, SessionChat>` | yes | Keys MUST be a subset of `tabs[].sessionId`. May be empty. |
| `pastSessions` | `PastSessionRef[]` | yes | May be empty. Sorted by `endedAt` desc. |
| `graph` | `GraphState` | yes | Always present, even with empty snapshot. Includes `expandedView` (v1.1+). |
| `ui` | `UiState` | yes | Drives modal/picker/disabled/graph-overlay affordances. |
| `connection` | `ConnectionState` | yes | `status==="ok"` is the steady-state. |
| `toasts` | `Toast[]` | yes | May be empty. Toasts are owned by the parent. Templates render; templates emit `intent:dismiss-toast` only for severities `warning` and `error` (see [Toast](#toast)). |
| `user` | `UserState` | yes | User identity (reserved for auth) + per-user preferences persisted by the parent. New in v1.1. |
| `i18n` | `I18nState` | yes | `locale` is `pt-BR` for Phase 1. `strings` is exhaustive (see below). |

## SessionTab

```json
{
  "sessionId": "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
  "title": "Discovery — domínio de cobranças",
  "status": "active",
  "createdAt": "2026-05-01T13:30:02-03:00"
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `sessionId` | uuid | yes | UUID v4 (see [NORMALIZATIONS.md § IDs](./NORMALIZATIONS.md#ids)). Treat opaque. |
| `title` | string | yes | Human label; truncate at render time if long. |
| `status` | enum | yes | One of `"active" \| "ended"`. Mirrors `app-release.SessionStatus`. (v1.1: `draft` removed.) |
| `createdAt` | timestamp | yes | From `POST /api/sessions` response. |

## SessionChat

```json
{
  "sessionId": "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
  "turns": [ /* ChatTurn */ ],
  "streaming": false
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `sessionId` | string | yes | Mirrors the map key. |
| `turns` | `ChatTurn[]` | yes | May be empty (renders `empty-state-awaiting-first-question`). |
| `streaming` | boolean | yes | `true` while a `text-delta`/`tool-use-*` is in flight for this session; parent flips it on first event after a `POST /turns` and off on `done`/`error`. Template uses this to disable the input. |

## ChatTurn

```json
{
  "turnId": "9b6b1c4a-1f8a-4d9c-9c61-5b6e9d2a0e22",
  "role": "agent",
  "text": "Vamos começar pelo objetivo desta release. Qual é o resultado mínimo viável?",
  "narrations": [ /* ToolNarration */ ],
  "streaming": false,
  "createdAt": "2026-05-01T13:30:05-03:00",
  "filesCreated": ["domain_knowledge/contexts/cobrancas.md"],
  "filesChanged": [],
  "filesDeleted": []
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `turnId` | uuid | yes | Stable per turn. UUID v4 for both agent and user turns (see [NORMALIZATIONS.md § IDs](./NORMALIZATIONS.md#ids)). |
| `role` | enum | yes | `"user" \| "agent"`. |
| `text` | string | no | Aggregated `text-delta` chunks for agent turns; raw user text for user turns. May be empty for an agent turn that emitted only tool-use narrations. Newlines `\n` MUST be honored as line breaks. Templates MUST HTML-escape. |
| `narrations` | `ToolNarration[]` | no | Empty or absent for user turns. Order = arrival order on the SSE stream. |
| `streaming` | boolean | no | `true` while this specific turn is still receiving deltas; `false` after `done` or `error`. Default `false`. |
| `createdAt` | timestamp | yes | First event timestamp for the turn. |
| `filesCreated` | string[] | no | POSIX paths created by this turn's tool uses. Default `[]`. (v1.1: replaces `filesTouched`.) |
| `filesChanged` | string[] | no | POSIX paths modified by this turn's tool uses. Default `[]`. |
| `filesDeleted` | string[] | no | POSIX paths deleted by this turn's tool uses. Default `[]`. |

> All path values follow [NORMALIZATIONS.md § File paths](./NORMALIZATIONS.md#file-paths). The parent fans out a `file-op` postMessage event each time these arrays mutate; see [INJECTION-CONTRACT.md § Event names](./INJECTION-CONTRACT.md#event-names-parent--template).

## ToolNarration

```json
{
  "toolUseId": "1f2e3d4c-5b6a-4798-8c0d-1e2f3a4b5c6d",
  "toolName": "WriteMarkdownNode",
  "state": "success",
  "input": {
    "path": "domain_knowledge/concepts/release-window.md",
    "frontmatter": {"node_type": "concept", "tags": ["release"]}
  },
  "output": {
    "path": "domain_knowledge/concepts/release-window.md",
    "bytes": 412
  },
  "error": null,
  "startedAt": "2026-05-01T13:30:06-03:00",
  "endedAt": "2026-05-01T13:30:06-03:00"
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `toolUseId` | uuid | yes | Correlates `tool-use-start` with `tool-use-result`. UUID v4 (see [NORMALIZATIONS.md § IDs](./NORMALIZATIONS.md#ids)). |
| `toolName` | enum | yes | One of `"WriteMarkdownNode" \| "AppendSection" \| "UpdateFrontmatter" \| "AddConnection"`. Unknown values render with the generic verb `tool`. |
| `state` | enum | yes | `"pending" \| "success" \| "error"`. Parent sets `pending` on `tool-use-start`, then flips to `success` or `error` on `tool-use-result`. |
| `input` | object | no | Tool input arguments as received from SSE. Templates may extract `input.path` or `input.sourcePath` for the narration target. |
| `output` | object | no | Tool result as received from SSE. May include `path` (used as fallback target). May include `error` (legacy field — parent normalizes to top-level `error`). |
| `error` | string \| null | no | Present only when `state==="error"`. Localized message recommended; raw provider error acceptable. |
| `startedAt` | timestamp | yes | From `tool-use-start`. |
| `endedAt` | timestamp \| null | no | From `tool-use-result`. `null` while `state==="pending"`. |

### Verb mapping (informational; templates re-use)

| `toolName` | pt-BR verb |
| --- | --- |
| `WriteMarkdownNode` | `escreveu` |
| `AppendSection` | `anexou seção em` |
| `UpdateFrontmatter` | `atualizou frontmatter de` |
| `AddConnection` | `conectou` |
| (anything else) | `tool` |

## PastSessionRef

```json
{
  "sessionId": "a1b2c3d4-e5f6-4789-90ab-cdef01234567",
  "title": "Onboarding de stakeholders",
  "endedAt": "2026-04-29T16:14:00-03:00",
  "summaryExcerpt": "Mapeamos três personas operacionais, fechamos escopo do MVP em greenfield-only e adiamos a ponte com cobrança recorrente."
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `sessionId` | uuid | yes | UUID v4. Opaque. |
| `title` | string | yes | From the session file's frontmatter. |
| `endedAt` | timestamp | yes | From `GET /api/sessions`. Parent normalizes per [NORMALIZATIONS.md § Timestamps](./NORMALIZATIONS.md#timestamps). |
| `summaryExcerpt` | string | no | Up to ~280 chars. May be empty. Templates fallback to em-dash. |

## GraphState

```json
{
  "snapshot": {
    "nodes": [
      {
        "id": "domain_knowledge/concepts/release-window.md",
        "title": "Release Window",
        "frontmatter": {"node_type": "concept", "layer": "domain"}
      }
    ],
    "edges": [
      {"source": "domain_knowledge/concepts/release-window.md", "target": "domain_knowledge/concepts/cadence.md", "type": "relates-to"}
    ],
    "metrics": {"nodes": 47, "edges": 92, "axioms": 5, "drafts": 3}
  },
  "lastDelta": {
    "added": [],
    "updated": [{"id": "domain_knowledge/concepts/release-window.md"}],
    "removed": [],
    "metrics": {"nodes": 47, "edges": 92, "axioms": 5, "drafts": 3},
    "bootstrap": false
  },
  "lastDeltaAt": "2026-05-01T13:32:09-03:00",
  "expandedView": {
    "available": true,
    "overlayRoute": "/graph",
    "standaloneRoute": "/graph?session=:sessionId"
  }
}
```

### `expandedView` (v1.1)

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `available` | boolean | yes | Always `true` in v1.1. Reserved as a kill-switch for future variants. |
| `overlayRoute` | string | yes | The route the parent intercepts to render the in-page overlay. Default `"/graph"`. The parent does NOT navigate when this is hit through `intent:open-graph-overlay` — it sets `payload.ui.graphOverlayOpen=true` and emits `payload-update`. |
| `standaloneRoute` | string | yes | The target for `window.open(..., '_blank')` when the user picks "open in new tab". `:sessionId` is interpolated by the parent against `payload.activeSessionId`. |

### `snapshot`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `nodes` | `GraphNode[]` | yes | May be empty. |
| `edges` | `GraphEdge[]` | yes | May be empty. |
| `metrics` | `{ nodes:int, edges:int, axioms:int, drafts:int }` | yes | All four keys MUST be present (zero is valid). Used by the four metric cards. |

### `GraphNode`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `id` | string | yes | Repo-relative file path, used as both DOM id and graph node id. |
| `title` | string | no | Falls back to `id` when absent. |
| `frontmatter` | object | no | Free-form. `frontmatter.node_type` is used to color nodes. |

### `GraphEdge`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `source` | string | yes | A node `id`. |
| `target` | string | yes | A node `id`. |
| `type` | string | no | Edge label (e.g. `relates-to`, `derives-from`). Default `relates-to`. |

### `lastDelta`

Optional (`null` until the first delta arrives). Fields mirror the `graph-delta` SSE payload from [events.md § GraphDelta](../../events.md#graphdelta). `bootstrap` is `true` for the initial fan-out on stream-open.

## UiState

```json
{
  "endModalOpen": false,
  "pickerOpen": false,
  "creatingSession": false,
  "inputDisabled": false,
  "graphOverlayOpen": false
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `endModalOpen` | boolean | yes | Drives `end-session-modal` visibility. |
| `pickerOpen` | boolean | yes | Drives `past-sessions-picker` visibility. |
| `creatingSession` | boolean | yes | `true` between user click on `+ Nova sessão` and the parent receiving `201` from `POST /api/sessions`. Templates SHOULD show a pending state on `tab-action-new`. |
| `inputDisabled` | boolean | yes | `true` while the active session's last turn is `streaming` OR while a request is in flight. Templates MUST disable `chat-input-send-button` and SHOULD visually mute the textarea. |
| `graphOverlayOpen` | boolean | yes | Drives `graph-overlay` visibility. Default `false`. Set to `true` on `intent:open-graph-overlay`, `false` on `intent:close-graph-overlay`. |

## ConnectionState

```json
{
  "status": "ok",
  "code": null,
  "message": null,
  "lastChangeAt": "2026-05-01T13:31:00-03:00"
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `status` | enum | yes | `"ok" \| "reconnecting" \| "degraded" \| "auth-missing"`. |
| `code` | string \| null | no | When `status!=="ok"`, mirrors the SSE `error.code` (e.g. `"AUTH_MISSING"`, `"PROVIDER_CRASH"`, `"WATCHER_OVERFLOW"`). |
| `message` | string \| null | no | Pre-localized pt-BR string for `connection-banner`. Templates render verbatim. |
| `lastChangeAt` | timestamp | yes | Updated on every status transition. |

Mapping rules (parent applies these):
- SSE `error` with `code==="AUTH_MISSING"` → `status: "auth-missing"`, `message: "Login do Claude Code não encontrado. Abra o Claude Code e faça login."`
- EventSource `onerror` while reconnecting → `status: "reconnecting"`, `message: "Reconectando ao servidor…"`.
- All other SSE errors → `status: "degraded"`, `message: "Erro: <code> — <message>"`.
- Recovery → `status: "ok"`, `code: null`, `message: null`.

## Toast

```json
{
  "id": "5c3a8f12-9d4b-4e21-8a7c-1f9e2d3b4c5d",
  "severity": "error",
  "message": "Falha ao encerrar \"Discovery — domínio de cobranças\": session not found",
  "createdAt": "2026-05-01T13:32:30-03:00"
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `id` | uuid | yes | UUID v4 (see [NORMALIZATIONS.md § IDs](./NORMALIZATIONS.md#ids)). |
| `severity` | enum | yes | `"info" \| "success" \| "warning" \| "error"`. (v1.1: replaces `kind`.) Drives auto-dismiss + manual-dismiss behavior — see table below. |
| `message` | string | yes | Pre-localized pt-BR (NFC, trimmed; see [NORMALIZATIONS.md § Strings](./NORMALIZATIONS.md#strings)). May come from `i18n.strings` or be interpolated. Templates render verbatim. |
| `createdAt` | timestamp | yes | Used to sort newest-first. |

### Severity-driven dismissal rules

Per-severity behavior is fixed by the contract; templates implement these rules but do not vary them per toast:

| `severity` | Auto-dismiss | Manual close affordance |
| --- | --- | --- |
| `info` | After `4000ms`. Template self-clears via timer; emits NOTHING to the parent. | NOT rendered. Toast is non-dismissible by the user. |
| `success` | After `4000ms`. Template self-clears via timer; emits NOTHING to the parent. | NOT rendered. Toast is non-dismissible by the user. |
| `warning` | After `8000ms`. Template emits `intent:dismiss-toast` when the timer fires OR when the user clicks the close button. | Rendered (close button). |
| `error` | NO auto-dismiss. Stays until the user acknowledges. | REQUIRED. The user MUST be able to dismiss; template emits `intent:dismiss-toast` on click. |

`intent:dismiss-toast` is therefore only emitted by templates rendering severity `warning` or `error`. Templates rendering `info` / `success` toasts MUST NOT emit it — they remove the toast from their own DOM via timer and rely on the parent's coarse `payload-update` (which prunes expired entries) for state convergence.

## UserState (v1.1)

```json
{
  "id": null,
  "preferences": {
    "activeTabId": "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
    "chosenTemplate": "layout-full-width",
    "cardCollapseStates": { "metrics-panel": false },
    "splitPaneDividerPct": 55
  }
}
```

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `id` | uuid \| null | yes | `null` in current local-single-user mode; reserved for auth. UUID v4 once populated. |
| `preferences` | `UserPreferences` | yes | Per-user UI preferences persisted by the parent. Templates emit `intent:update-preference` to mutate; never write directly. |

### `UserPreferences`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `activeTabId` | uuid \| null | yes | Last-selected session tab. Used by the parent to restore selection on reload. May be `null` if no tab has been chosen yet. |
| `chosenTemplate` | string \| null | yes | The template id the user last picked (e.g. `"layout-full-width"`). May be `null` before first selection. |
| `cardCollapseStates` | `Record<elementId, boolean>` | yes | Per-card collapsed/expanded boolean. Keys are taxonomy `element_id` values. Default `{}`. |
| `splitPaneDividerPct` | number \| null | yes | 0–100. Used only by the split-pane template. May be `null` for templates that do not need it. |

### Persistence

- The parent reads / writes `user.preferences` to / from `localStorage` under key `app-release:user-preferences:v1`.
- Templates do NOT touch localStorage directly. They emit `intent:update-preference` postMessages and the parent persists.
- **Future-state:** when auth lands, the parent will swap the localStorage backend for a server-side per-user cache identified by an httpOnly session cookie. The contract surface (`user.preferences`) does not change — only the parent's persistence backend swaps. Templates remain unaware.

## I18nState

```json
{
  "locale": "pt-BR",
  "strings": {
    "tabActionNew": "+ Nova sessão",
    "tabActionPast": "☰ Sessões anteriores",
    "headerEyebrowActive": "Sessão ativa",
    "headerEyebrowInactive": "Sem sessão ativa",
    "headerDefaultTitle": "Harness Workspace",
    "btnEndSession": "Encerrar sessão",
    "panelChat": "Conversa",
    "panelGraph": "Grafo do domínio",
    "panelMetrics": "Métricas",
    "graphExpand": "⤢ Open in /visualizations",
    "metricNodes": "Nós",
    "metricEdges": "Arestas",
    "metricAxioms": "Axiomas",
    "metricDrafts": "Rascunhos",
    "roleUser": "Você",
    "roleAgent": "Agente",
    "inputPlaceholder": "Digite sua resposta…",
    "inputSend": "Enviar",
    "emptyNoSession": "Nenhuma sessão ativa. Clique em + Nova sessão para começar.",
    "emptyAwaitingFirstQuestion": "Aguardando primeira pergunta do agente…",
    "endModalTitleOne": "Encerrar \"{title}\"?",
    "endModalTitleMany": "Encerrar {count} sessões?",
    "endModalBody": "As sessões abaixo serão encerradas e seus resumos serão gravados em domain_knowledge/sessions/. Esta ação é definitiva.",
    "endModalCancel": "Continuar conversa",
    "endModalConfirm": "Encerrar e gerar resumo",
    "pickerHeader": "Sessões anteriores",
    "pickerEmpty": "Nenhuma sessão anterior encontrada."
  }
}
```

Templates MUST source these strings from `payload.i18n.strings` (NOT hardcode them) so a future locale switch reaches the UI without template changes. The keys above are the closed set for v1.0.0.

## Validation rules (cross-cutting)

> **Normalization rules** — timestamps, IDs, file paths, enums, strings, numbers, booleans — are defined once in [NORMALIZATIONS.md](./NORMALIZATIONS.md). That document is the single source of truth; this schema and the field tables above reference it rather than restating its rules. Server-side producers and the parent's fold layer MUST conform; templates render values as-is and MUST NOT re-emit them in different formats.

1. **Closed enums:** unknown values for `tab.status`, `turn.role`, `narration.state`, `connection.status`, `toolName`, `toast.severity` MUST be tolerated (rendered with a sensible fallback) — templates MUST NOT crash. See [NORMALIZATIONS.md § Enums](./NORMALIZATIONS.md#enums).
2. **Referential integrity:**
   - `activeSessionId`, when non-null, MUST be present in `tabs[]`.
   - Every key of `chats` MUST be in `tabs[]`.
   - Every `pastSessions[].sessionId` MUST NOT collide with any open `tab.sessionId` (resume creates a new session id).
   - `user.preferences.activeTabId`, when non-null, SHOULD be a `tabs[].sessionId`; if not, the parent treats it as stale and clears it.
3. **Times, IDs, paths, strings, numbers, booleans:** see [NORMALIZATIONS.md](./NORMALIZATIONS.md).
4. **HTML escaping:** templates MUST HTML-escape any field that may contain user/agent text (`turn.text`, `tab.title`, `pastSessions[].summaryExcerpt`, `narration.error`, `narration.input.path`, `narration.output.path`, `toast.message`).
5. **Versioning:** if `payload.version` MAJOR ≠ `1`, templates SHOULD render a banner ("UI desatualizada") but continue rendering best-effort.

## Versioning policy

- `version: "1.0.0"` for initial ratification.
- Backwards-compatible additions (new optional fields, new enum values that templates already tolerate) bump MINOR.
- Any breaking change (rename, removal, type change, semantic change) bumps MAJOR; Phase 3 must re-run on all templates.
- This document is the change log; append a row to `## Version history` on every bump.

## `mockPayload` (copy-pasteable)

Every template MUST embed this verbatim as a fallback when `window.parent.chatPayload` is undefined. It exercises every element state — empty, populated, pending, success, error, modal, picker, toast, degraded connection.

```javascript
const mockPayload = {
  version: "1.1.0",
  generatedAt: "2026-05-01T13:41:19-03:00",
  activeSessionId: "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
  tabs: [
    { sessionId: "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01", title: "Discovery — domínio de cobranças", status: "active", createdAt: "2026-05-01T13:30:02-03:00" },
    { sessionId: "8d4a9c2b-3e7f-4a16-9b25-6c1d8e4a3b22", title: "Mapeamento de personas",            status: "active", createdAt: "2026-05-01T13:31:40-03:00" },
    { sessionId: "2e7c1f5a-9b34-4c8d-87a1-0d3e6f2c9b14", title: "Sessão encerrada (resumo)",          status: "ended",  createdAt: "2026-05-01T12:55:18-03:00" }
  ],
  chats: {
    "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01": {
      sessionId: "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
      streaming: true,
      turns: [
        {
          turnId: "9b6b1c4a-1f8a-4d9c-9c61-5b6e9d2a0e22",
          role: "agent",
          text: "Vamos começar pelo objetivo desta release. Qual é o resultado mínimo viável que demonstra valor para um stakeholder externo?",
          narrations: [],
          streaming: false,
          createdAt: "2026-05-01T13:30:03-03:00",
          filesCreated: [],
          filesChanged: [],
          filesDeleted: []
        },
        {
          turnId: "0c4f9d3e-2b71-4f56-8a9d-3e1c5b7a2d14",
          role: "user",
          text: "Quero validar que conseguimos transformar uma transcrição de entrevista em um grafo navegável de conceitos.",
          narrations: [],
          streaming: false,
          createdAt: "2026-05-01T13:30:48-03:00",
          filesCreated: [],
          filesChanged: [],
          filesDeleted: []
        },
        {
          turnId: "f2a1b3c4-5d6e-4789-8a9b-0c1d2e3f4a5b",
          role: "agent",
          text: "Entendido. Vou registrar o objetivo como um axioma, criar o conceito raiz e remover um rascunho obsoleto.",
          streaming: true,
          createdAt: "2026-05-01T13:30:49-03:00",
          filesCreated: [
            "domain_knowledge/axioms/release-objective.md",
            "domain_knowledge/concepts/vault.md"
          ],
          filesChanged: [
            "domain_knowledge/concepts/release-window.md"
          ],
          filesDeleted: [
            "domain_knowledge/drafts/old-cadence.md"
          ],
          narrations: [
            {
              toolUseId: "1f2e3d4c-5b6a-4798-8c0d-1e2f3a4b5c6d",
              toolName: "WriteMarkdownNode",
              state: "success",
              input: { path: "domain_knowledge/axioms/release-objective.md", frontmatter: { node_type: "axiom" } },
              output: { path: "domain_knowledge/axioms/release-objective.md", bytes: 318 },
              error: null,
              startedAt: "2026-05-01T13:30:50-03:00",
              endedAt:   "2026-05-01T13:30:50-03:00"
            },
            {
              toolUseId: "2a3b4c5d-6e7f-4890-9a1b-2c3d4e5f6a7b",
              toolName: "AppendSection",
              state: "pending",
              input: { sourcePath: "domain_knowledge/concepts/release-window.md", section: "## Critérios de aceitação" },
              output: null,
              error: null,
              startedAt: "2026-05-01T13:30:51-03:00",
              endedAt: null
            },
            {
              toolUseId: "3b4c5d6e-7f80-4a91-8b2c-3d4e5f6a7b8c",
              toolName: "AddConnection",
              state: "error",
              input: { source: "domain_knowledge/axioms/release-objective.md", target: "domain_knowledge/concepts/missing-node.md" },
              output: null,
              error: "target node not found",
              startedAt: "2026-05-01T13:30:51-03:00",
              endedAt:   "2026-05-01T13:30:51-03:00"
            }
          ]
        }
      ]
    },
    "8d4a9c2b-3e7f-4a16-9b25-6c1d8e4a3b22": {
      sessionId: "8d4a9c2b-3e7f-4a16-9b25-6c1d8e4a3b22",
      streaming: false,
      turns: []
    }
  },
  pastSessions: [
    {
      sessionId: "a1b2c3d4-e5f6-4789-90ab-cdef01234567",
      title: "Onboarding de stakeholders",
      endedAt: "2026-04-29T16:14:00-03:00",
      summaryExcerpt: "Mapeamos três personas operacionais, fechamos escopo do MVP em greenfield-only e adiamos a ponte com cobrança recorrente."
    },
    {
      sessionId: "b2c3d4e5-f6a7-4890-91bc-def012345678",
      title: "Definição de glossário",
      endedAt: "2026-04-28T19:02:11-03:00",
      summaryExcerpt: "Consolidamos 14 termos no glossário e marcamos 3 como ambíguos para revisitar."
    }
  ],
  graph: {
    snapshot: {
      nodes: [
        { id: "domain_knowledge/concepts/release-window.md",    title: "Release Window",    frontmatter: { node_type: "concept" } },
        { id: "domain_knowledge/concepts/cadence.md",           title: "Cadence",           frontmatter: { node_type: "concept" } },
        { id: "domain_knowledge/axioms/release-objective.md",   title: "Release Objective", frontmatter: { node_type: "axiom" } },
        { id: "domain_knowledge/personas/operator.md",          title: "Operator",          frontmatter: { node_type: "persona" } }
      ],
      edges: [
        { source: "domain_knowledge/concepts/release-window.md",  target: "domain_knowledge/concepts/cadence.md",          type: "relates-to" },
        { source: "domain_knowledge/axioms/release-objective.md", target: "domain_knowledge/concepts/release-window.md",   type: "scopes" }
      ],
      metrics: { nodes: 4, edges: 2, axioms: 1, drafts: 1 }
    },
    lastDelta: {
      added: [{ id: "domain_knowledge/axioms/release-objective.md" }],
      updated: [],
      removed: [],
      metrics: { nodes: 4, edges: 2, axioms: 1, drafts: 1 },
      bootstrap: false
    },
    lastDeltaAt: "2026-05-01T13:30:50-03:00",
    expandedView: {
      available: true,
      overlayRoute: "/graph",
      standaloneRoute: "/graph?session=:sessionId"
    }
  },
  ui: {
    endModalOpen: false,
    pickerOpen: false,
    creatingSession: false,
    inputDisabled: true,
    graphOverlayOpen: false
  },
  connection: {
    status: "ok",
    code: null,
    message: null,
    lastChangeAt: "2026-05-01T13:30:00-03:00"
  },
  toasts: [
    {
      id: "5c3a8f12-9d4b-4e21-8a7c-1f9e2d3b4c5d",
      severity: "info",
      message: "Sessão \"Mapeamento de personas\" criada.",
      createdAt: "2026-05-01T13:31:40-03:00"
    },
    {
      id: "6d4b9023-ae5c-4f32-9b8d-2e0f3a4c5d6e",
      severity: "warning",
      message: "Conexão lenta detectada — algumas atualizações podem demorar.",
      createdAt: "2026-05-01T13:32:05-03:00"
    },
    {
      id: "7e5ca134-bf6d-4043-acae-3f102b5d6e7f",
      severity: "error",
      message: "AUTH_MISSING — Login do Claude Code não encontrado. Abra o Claude Code e faça login.",
      createdAt: "2026-05-01T13:32:30-03:00"
    }
  ],
  user: {
    id: null,
    preferences: {
      activeTabId: "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
      chosenTemplate: "layout-full-width",
      cardCollapseStates: { "metrics-panel": false },
      splitPaneDividerPct: 55
    }
  },
  i18n: {
    locale: "pt-BR",
    strings: {
      tabActionNew: "+ Nova sessão",
      tabActionPast: "☰ Sessões anteriores",
      headerEyebrowActive: "Sessão ativa",
      headerEyebrowInactive: "Sem sessão ativa",
      headerDefaultTitle: "Harness Workspace",
      btnEndSession: "Encerrar sessão",
      panelChat: "Conversa",
      panelGraph: "Grafo do domínio",
      panelMetrics: "Métricas",
      graphExpand: "⤢ Open in /visualizations",
      metricNodes: "Nós",
      metricEdges: "Arestas",
      metricAxioms: "Axiomas",
      metricDrafts: "Rascunhos",
      roleUser: "Você",
      roleAgent: "Agente",
      inputPlaceholder: "Digite sua resposta…",
      inputSend: "Enviar",
      emptyNoSession: "Nenhuma sessão ativa. Clique em + Nova sessão para começar.",
      emptyAwaitingFirstQuestion: "Aguardando primeira pergunta do agente…",
      endModalTitleOne: "Encerrar \"{title}\"?",
      endModalTitleMany: "Encerrar {count} sessões?",
      endModalBody: "As sessões abaixo serão encerradas e seus resumos serão gravados em domain_knowledge/sessions/. Esta ação é definitiva.",
      endModalCancel: "Continuar conversa",
      endModalConfirm: "Encerrar e gerar resumo",
      pickerHeader: "Sessões anteriores",
      pickerEmpty: "Nenhuma sessão anterior encontrada."
    }
  }
};
```

The `mockPayload` deliberately exercises:
- An active session with a streaming agent turn (`streaming: true`).
- A second active session with zero turns (renders `empty-state-awaiting-first-question`).
- An ended session tab still in `tabs[]` (gray dot in `tab-item`).
- Three narration states in one turn: `success`, `pending`, `error`.
- Per-turn file telemetry: `filesCreated`, `filesChanged`, `filesDeleted` populated on the streaming agent turn (drives `live-file-ops`).
- A non-empty `pastSessions[]` (drives picker).
- Three `toasts[]` covering the severity matrix: `info` (auto-dismiss only), `warning` (auto + manual), `error` (manual only, e.g. `AUTH_MISSING`).
- `inputDisabled: true` (because the active session is streaming).
- A populated graph with two nodes/edges, the four metric keys, and the v1.1 `expandedView` block.
- A populated `user.preferences` with `activeTabId`, `chosenTemplate`, one `cardCollapseStates` entry, and `splitPaneDividerPct`.
- `ui.graphOverlayOpen: false` (the overlay is wired but currently closed).

## Version history

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 1.0.0 | 2026-05-01 | ui-element-researcher | Initial schema. Mirrors Phase 1 REST + SSE fan-out into a single window.chatPayload object. |
| 1.1.0 | 2026-05-01 | contract-patch agent | SessionStatus.draft removed; NORMALIZATIONS.md split out; toast severity-driven dismissal; filesTouched → filesCreated/Changed/Deleted + file-op event + live-file-ops element; user.preferences slot + localStorage rules; graph expandedView with overlay + new-tab routes. |
