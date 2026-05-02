---
tags: [app-release, ui, injection, contract, postMessage, sse]
node_type: conceptual
is_session: false
layer: application, architecture
nature: procedural
status: active
version: 1.1.0
last_updated: 2026-05-01
---

# Injection Contract — Parent ↔ Template Handshake

> **TEMPLATE AUTHORS:** Read this once. It defines exactly how your template receives data, how it learns about updates, and how it communicates user intents back to the parent. There is no other path.
>
> Companions: [ELEMENT-TAXONOMY.md](./ELEMENT-TAXONOMY.md), [CHAT-PAYLOAD-SCHEMA.md](./CHAT-PAYLOAD-SCHEMA.md).

## Topology

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Parent shell  (visualizations/app-release/index.html + app.mjs evolution)  │
│                                                                            │
│   REST  ─►  /api/sessions, /api/graph                                      │
│   SSE   ─►  /api/graph/stream, /api/sessions/:id/stream                    │
│                                                                            │
│   ┌── fold ─────────────────────────────────────────────────┐              │
│   │  window.chatPayload  (single object — the contract)     │              │
│   └─────────────────────────────────────────────────────────┘              │
│         │                                  ▲                               │
│         │ postMessage('payload-update', …) │ postMessage('intent:*', …)    │
│         ▼                                  │                               │
│   ┌─────────────────────────────────────────────────────────┐              │
│   │  <iframe src="templates/layout-XYZ.html">               │              │
│   │     reads window.parent.chatPayload                     │              │
│   │     listens to message events on window                 │              │
│   │     emits intents via window.parent.postMessage(...)    │              │
│   └─────────────────────────────────────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────────┘
```

The parent owns ALL network I/O. Templates own ALL rendering and user-input capture. There is exactly ONE source of truth (`window.chatPayload`) and ONE message bus (`postMessage` on `window`).

## The parent's responsibilities

1. Open SSE streams to `/api/graph/stream` and to `/api/sessions/:id/stream` for every open tab.
2. Open and close REST calls (`POST /api/sessions`, `GET /api/sessions`, `POST /api/sessions/:id/turns`, `POST /api/sessions/:id/end`, `POST /api/sessions/:id/resume`, `GET /api/graph/index`) in response to user intents.
3. Fold all wire data into a single `window.chatPayload` object whose shape matches [CHAT-PAYLOAD-SCHEMA.md](./CHAT-PAYLOAD-SCHEMA.md).
4. **Set `window.chatPayload` BEFORE assigning `iframe.src`** so templates can read it synchronously on load.
5. Re-emit `payload-update` postMessage events on EVERY mutation. The whole payload is sent (not a diff). Cheap, deterministic, and lets templates do shallow diffing if they care.
6. Optionally emit fine-grained companion events (see §"Event names") so templates can animate without re-rendering everything.
7. Receive `intent:*` postMessages from templates and translate them to REST calls.
8. Maintain `payload.connection.status` based on SSE health.

## The template's responsibilities

1. On load: read `window.parent.chatPayload`. If undefined, fall back to embedded `mockPayload` (see [CHAT-PAYLOAD-SCHEMA.md § mockPayload](./CHAT-PAYLOAD-SCHEMA.md#mockpayload-copy-pasteable)).
2. Render every `element_id` from [ELEMENT-TAXONOMY.md](./ELEMENT-TAXONOMY.md). Required elements MUST appear; optional elements MUST be implemented even if hidden.
3. Subscribe to `message` events on `window` and re-render (or patch) on `payload-update`.
4. Translate user actions (clicks, submits, dismisses) into `intent:*` postMessages addressed to the parent. NEVER call `fetch` or open `EventSource`.
5. Be defensive: every field is "trusted but defended" — HTML-escape user/agent text, tolerate unknown enum values, render zero-state when arrays are empty.

Templates never:
- Call `fetch()`.
- Open `EventSource`.
- Mutate `window.parent.chatPayload` directly.
- Hardcode pt-BR strings (read them from `payload.i18n.strings`).
- Persist to `localStorage` or `IndexedDB`. User preferences are mutated via `intent:update-preference`; the parent owns persistence (see [CHAT-PAYLOAD-SCHEMA.md § UserState](./CHAT-PAYLOAD-SCHEMA.md#userstate-v11)).

## Reading the payload

```javascript
// Top of every template's <script>:
const mockPayload = { /* see CHAT-PAYLOAD-SCHEMA.md */ };

function getPayload() {
  try {
    if (window.parent && window.parent !== window && window.parent.chatPayload) {
      return window.parent.chatPayload;
    }
  } catch (_) { /* cross-origin parent — fall through */ }
  return mockPayload;
}

let payload = getPayload();
render(payload);
```

**Standalone mode.** When a template is opened directly (not embedded by the parent), `window.parent === window` and `window.parent.chatPayload` is undefined. Templates fall back to `mockPayload` so designers can iterate without booting the parent.

**Cross-origin defense.** Reading `window.parent.chatPayload` may throw if the parent is cross-origin. The `try/catch` keeps the template renderable even in that pathological case.

## Listening for updates

The parent emits all updates as `postMessage` events on its own window (which propagate to every iframe via `window.addEventListener("message", …)`).

```javascript
window.addEventListener("message", (event) => {
  // The parent and the iframe are same-origin in the harness, but defend anyway.
  if (event.source !== window.parent) return;
  const msg = event.data;
  if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
  if (!msg.type.startsWith("payload-update") &&
      !msg.type.startsWith("tool-use-progress") &&
      !msg.type.startsWith("session-status-change") &&
      !msg.type.startsWith("graph-delta") &&
      !msg.type.startsWith("connection-change") &&
      !msg.type.startsWith("toast") &&
      !msg.type.startsWith("file-op")) return;

  switch (msg.type) {
    case "payload-update":          payload = msg.payload; renderAll(payload); break;
    case "tool-use-progress":       patchNarration(msg.sessionId, msg.toolUseId, msg.state); break;
    case "session-status-change":   patchTab(msg.sessionId, msg.status);                     break;
    case "graph-delta":             patchGraph(msg.delta);                                   break;
    case "connection-change":       patchConnection(msg.connection);                         break;
    case "toast":                   patchToasts(msg.toasts);                                 break;
    case "file-op":                 patchFileOps(msg.payload);                               break;
  }
});
```

Templates that want simplicity MAY ignore every fine-grained event and re-render fully on `payload-update` only (which the parent emits after every state change anyway). The fine-grained events exist for templates that want progressive rendering or animation.

## Event names (parent → template)

| `type` | Fired when | Payload shape | Notes |
| --- | --- | --- | --- |
| `payload-update` | After ANY mutation to `window.chatPayload`. | `{ type: "payload-update", payload: <full chatPayload> }` | Always emitted. Templates can rely on this alone. |
| `tool-use-progress` | On SSE `tool-use-start` and `tool-use-result`. | `{ type, sessionId, turnId, toolUseId, state, narration }` | Lets templates animate the pill from `pending`→`success`/`error`. |
| `session-status-change` | On session create / end / resume. | `{ type, sessionId, status, tab }` | Drives tab dot color, modal lists. |
| `graph-delta` | On SSE `graph-delta` (mirrors the wire event). | `{ type, delta, snapshot }` | `snapshot` is the post-delta full snapshot for templates that prefer redraw. |
| `connection-change` | On SSE health transitions. | `{ type, connection }` | `connection` matches `payload.connection`. |
| `toast` | On any `toasts[]` mutation. | `{ type, toasts }` | Full toast array each time. |
| `file-op` | On each file create / change / delete observed for any active session's tool use. (v1.1) | `{ type: "file-op", payload: { op, path, sessionId, turnId, toolUseId, timestamp } }` | Templates with a `live-file-ops` element MAY use this to animate per-event. Parent ALSO emits `payload-update` after each `file-op` so coarse-subscriber templates do not miss the mutation to `turn.filesCreated/Changed/Deleted`. |

### `file-op` payload (v1.1)

```json
{
  "type": "file-op",
  "payload": {
    "op": "create",
    "path": "domain_knowledge/concepts/vault.md",
    "sessionId": "6b2f7b3e-2c11-4f8e-9a51-3d4c2b9a1f01",
    "turnId":    "f2a1b3c4-5d6e-4789-8a9b-0c1d2e3f4a5b",
    "toolUseId": "1f2e3d4c-5b6a-4798-8c0d-1e2f3a4b5c6d",
    "timestamp": "2026-05-01T13:30:50-03:00"
  }
}
```

| `payload.op` | Meaning |
| --- | --- |
| `"create"` | A new file was written. The path is appended to `turn.filesCreated`. |
| `"change"` | An existing file was modified. The path is appended to `turn.filesChanged`. |
| `"delete"` | A file was deleted. The path is appended to `turn.filesDeleted`. |

All fields obey [NORMALIZATIONS.md](./NORMALIZATIONS.md): `op` is a snake_case enum, `path` is POSIX, IDs are UUID v4, `timestamp` is ISO-8601 with explicit offset.

All companion events are SHADOWS of `payload-update`: the parent ALWAYS emits `payload-update` immediately after a fine-grained event, so templates that subscribe only to `payload-update` never miss anything.

## Event names (template → parent)

Templates emit user intents via `window.parent.postMessage({ type: "intent:...", ... }, "*")`. The parent translates these to REST calls. Required intents:

| `type` | Fired when | Required fields | Parent action |
| --- | --- | --- | --- |
| `intent:create-session` | User clicks `tab-action-new`. | `{ type, title? }` | `POST /api/sessions` |
| `intent:select-session` | User clicks a `tab-item`. | `{ type, sessionId }` | Sets `payload.activeSessionId` and emits `payload-update`. No REST. |
| `intent:end-session-modal` | User clicks `btn-end-session`. | `{ type, sessionId }` | Sets `payload.ui.endModalOpen=true`. |
| `intent:end-session-confirm` | User clicks `Encerrar e gerar resumo`. | `{ type, sessionIds: string[] }` | `POST /api/sessions/:id/end` for each. |
| `intent:end-session-cancel` | User clicks `Continuar conversa` or backdrop. | `{ type }` | Sets `payload.ui.endModalOpen=false`. |
| `intent:open-picker` | User clicks `tab-action-past-sessions`. | `{ type }` | `GET /api/sessions`, then sets `payload.ui.pickerOpen=true`. |
| `intent:close-picker` | User dismisses picker. | `{ type }` | Sets `payload.ui.pickerOpen=false`. |
| `intent:resume-session` | User clicks a `past-session-item`. | `{ type, sessionId }` | `POST /api/sessions/:id/resume`. |
| `intent:send-turn` | User submits the chat input. | `{ type, sessionId, turnText }` | `POST /api/sessions/:sessionId/turns`. Parent ALSO optimistically appends the user turn to `payload.chats[sessionId].turns[]` before the REST roundtrip. |
| `intent:open-graph-fullscreen` | (Legacy v1.0) User clicks `graph-expand-link`. | `{ type }` | `window.open('/visualizations/ontology-visualization/index.html?source=domain_knowledge', '_blank')`. New templates SHOULD prefer the overlay intents below. |
| `intent:open-graph-overlay` | User clicks `graph-expand-trigger`. | `{ type }` | Sets `payload.ui.graphOverlayOpen=true` and emits `payload-update`. The overlay renderer reads `payload.graph.expandedView.overlayRoute`. |
| `intent:close-graph-overlay` | User presses ESC, clicks the overlay backdrop, or clicks the close button. | `{ type }` | Sets `payload.ui.graphOverlayOpen=false` and emits `payload-update`. |
| `intent:open-graph-newtab` | User clicks `graph-overlay-newtab-link`. | `{ type }` | `window.open(payload.graph.expandedView.standaloneRoute /* with :sessionId interpolated */, '_blank')`. |
| `intent:dismiss-toast` | User clicks a toast's close affordance. ONLY emitted by templates rendering severity `warning` or `error`. Templates rendering `info` / `success` toasts MUST NOT emit it (they self-clear via timer; see [CHAT-PAYLOAD-SCHEMA.md § Toast](./CHAT-PAYLOAD-SCHEMA.md#toast)). | `{ type, toastId }` | Removes the toast from `payload.toasts[]`. |
| `intent:update-preference` | User changes a UI preference handled by the parent (selected tab, chosen template, card collapse state, split-pane divider position, etc.). | `{ type, key: string, value: any }` | Mutates the matching field under `payload.user.preferences` and persists to `localStorage` under key `app-release:user-preferences:v1`. Emits `payload-update`. `key` is a dot-path against `user.preferences` (e.g. `"activeTabId"`, `"chosenTemplate"`, `"cardCollapseStates.metrics-panel"`, `"splitPaneDividerPct"`). |

Unknown `intent:*` types are logged by the parent and ignored. Templates SHOULD NOT invent new intents in v1.1.0; if you find a missing intent, log it as an Open Question.

### Graph overlay UX rules (v1.1)

The `graph-overlay` element is governed by these contract-level UX rules — templates MUST conform:

- **ESC** closes the overlay → emit `intent:close-graph-overlay`.
- **Click-outside** (on the backdrop, outside the overlay's content box) closes the overlay → emit `intent:close-graph-overlay`.
- **Focus trap** inside the overlay while open: the first/last focusable elements wrap to each other; focus does NOT escape to the underlying page.
- The overlay root element MUST carry `aria-modal="true"` and an accessible label sourced from `i18n.strings` (templates may reuse `panelGraph`).
- The overlay is in-page, not an OS-level popup. The new-tab affordance — `graph-overlay-newtab-link` — is the ONLY route to a real new browser tab and uses `payload.graph.expandedView.standaloneRoute`.

### Intent envelope

Every intent message MUST include:

```json
{ "type": "intent:<name>", "templateId": "layout-card-deck", "ts": 1714579931402 }
```

`templateId` is informational — the value of `<!-- @template-id -->` in the file. `ts` is `Date.now()`. The parent uses these for telemetry and for ignoring duplicate clicks within ~50ms.

## SSE → parent → templates fan-out

The four SSE event types map cleanly to payload mutations:

| SSE event | Parent mutation to `window.chatPayload` | Companion postMessage |
| --- | --- | --- |
| `session-created` (on `/api/sessions/:id/stream`) | Push or update `tabs[]`; if `data.firstQuestion`, append agent turn. | `session-status-change` + `payload-update` |
| `text-delta` | Append `data.text` to the active agent turn's `text`; set `chats[sid].streaming=true`, `turn.streaming=true`. | `payload-update` only (fine-grained text deltas would spam the bus). |
| `tool-use-start` | Push a new narration with `state: "pending"` to the active agent turn. | `tool-use-progress` + `payload-update` |
| `tool-use-result` | Find narration by `toolUseId`; set `state` to `success` or `error`; fill `output`/`error`/`endedAt`. For each path observed in `output.created` / `output.changed` / `output.deleted` (or equivalent fields), append to the matching `turn.filesCreated` / `filesChanged` / `filesDeleted` array. | `tool-use-progress` + `file-op` (one per affected path) + `payload-update` |
| `done` | Set `chats[sid].streaming=false`, `turn.streaming=false`, `ui.inputDisabled=false`. | `payload-update` |
| `error` | Update `payload.connection` per [CHAT-PAYLOAD-SCHEMA.md § ConnectionState mapping](./CHAT-PAYLOAD-SCHEMA.md#connectionstate); push a toast for non-fatal errors. | `connection-change` + `toast` + `payload-update` |
| `graph-delta` (on `/api/graph/stream`) | Refold `payload.graph.snapshot` (Phase 1 parent does a full re-fetch on delta — simpler than incremental); set `payload.graph.lastDelta`. | `graph-delta` + `payload-update` |

**Templates do NOT open EventSource.** Period. Same-origin restrictions and connection-count caps make multiplexing through the parent the only sane design.

## Fallback rules

| Condition | Template behavior |
| --- | --- |
| `window.parent === window` (standalone) | Use `mockPayload`. Render all elements. User intents are dropped (or logged to console for designer feedback). |
| `window.parent.chatPayload` is undefined but `window.parent !== window` | Render `connection-banner` with text "Aguardando contrato do harness…". Use empty arrays/null for everything until first `payload-update`. |
| `window.parent.chatPayload.version` MAJOR ≠ 1 | Render a banner ("Templates desatualizados — atualize o harness ou o template."). Continue rendering best-effort. |
| `payload.activeSessionId` is null | `chat-history-list` renders `empty-state-no-session`; `chat-input-form` and `btn-end-session` are hidden. |
| `payload.tabs.length === 0` | `tab-bar` renders only `tab-action-new` and `tab-action-past-sessions`. |
| `payload.chats[sid].turns.length === 0` | Render `empty-state-awaiting-first-question`. |
| `payload.graph.snapshot.nodes.length === 0` | `graph-mount` renders an empty-state placeholder; `metric-card`s show zeroes. |
| `payload.connection.status !== "ok"` | `connection-banner` visible with `payload.connection.message`. |
| Cross-origin parent (read throws) | Same as standalone — fall back to `mockPayload`. |

## Error handling

1. **Missing payload.** Treat as standalone (above).
2. **Malformed payload.** A template MUST never crash. Wrap rendering in `try { … } catch (err) { renderFatal(err); }`. `renderFatal` puts a single visible `<pre>` with the error and the offending JSON near `connection-banner`. The parent will eventually emit a clean `payload-update` and the template recovers.
3. **Unknown enum values** (`tab.status`, `narration.state`, `connection.status`, `toolName`). Render with neutral defaults (gray dot, plain pill, "tool" verb).
4. **Lost SSE.** Parent flips `connection.status` to `reconnecting`; templates show the banner. Do nothing else — recovery is the parent's job.
5. **PostMessage failure.** If `window.parent.postMessage` throws (parent gone), templates SHOULD swallow and render a toast-equivalent inline ("Conexão com o harness perdida.").

## Lifecycle in three steps

```
T=0  parent: window.chatPayload = initialPayload
     parent: iframe.src = "templates/layout-XYZ.html"
T=1  template loads → reads window.parent.chatPayload → renders.
T=2+ parent mutates window.chatPayload AND postMessage({type:"payload-update", payload}).
     template re-renders.
```

Inverse direction:

```
T=N  user clicks "+ Nova sessão" inside the template
     template: window.parent.postMessage({type:"intent:create-session", templateId, ts}, "*")
T=N+1 parent: POST /api/sessions → mutate payload → postMessage({type:"payload-update", payload})
     template re-renders.
```

## Coverage attestation header

Every template file MUST start with these two HTML comments (immediately after `<!DOCTYPE html>`):

```html
<!-- @template-id layout-card-deck -->
<!-- @taxonomy-coverage workspace-shell, tab-bar, tab-item, … (see ELEMENT-TAXONOMY.md) -->
```

Phase 3 validation will read these headers to scorecard each template.

## What lives outside this contract

- Visual style, motion, density: **out of scope** (Phase 2 freedom).
- Auth: **none today** (single-user local-only per [DECISIONS.md](../../DECISIONS.md)). `user.id` is reserved; when auth lands, the parent swaps the localStorage backend for a server-side per-user cache identified by an httpOnly session cookie. The contract surface (`user.preferences`) does not change — only the parent's persistence backend swaps. Templates remain unaware.
- Telemetry / vote registration: **out of scope** (newspaper has it; this app does not in v1.1.0).
- Persisting layout state per template: **in scope as of v1.1** via `user.preferences` + `intent:update-preference`. Templates do not touch `localStorage` directly — they emit the intent and the parent persists.
