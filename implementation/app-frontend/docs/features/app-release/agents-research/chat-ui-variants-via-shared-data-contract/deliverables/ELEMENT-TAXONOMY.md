---
tags: [app-release, ui, taxonomy, data-contract]
node_type: conceptual
is_session: false
layer: application
nature: descriptive
status: active
version: 1.1.0
last_updated: 2026-05-01
---

# Element Taxonomy — Chat UI Variants

> **TEMPLATE AUTHORS:** This is the closed set of semantic elements every layout MUST render. You may freely re-style, re-order, group, collapse, or relocate elements, but you may NOT silently drop one. Optional elements MUST still be implemented (with the documented empty state) — they may legitimately remain hidden when their data dependency is empty.
>
> Each row's `data dependencies` column references field paths in [CHAT-PAYLOAD-SCHEMA.md](./CHAT-PAYLOAD-SCHEMA.md). Each row's `element_id` MUST appear, character-for-character, in the `<!-- @taxonomy-coverage -->` comment at the top of every template file.

## How to read this document

- **`element_id`** — stable kebab-case identifier. Use as DOM attribute or class hook (e.g. `data-element="tab-bar"`). Never invent new IDs.
- **`required`** — `R` means the element MUST be rendered (even when empty, with its documented empty state). `O` means it may be hidden when its data dependency is empty/falsy.
- **`data dependencies`** — schema field paths. If multiple paths are listed, the element renders when ANY are non-empty unless noted.
- **`example states`** — enumerates the visual states a template MUST handle (empty, populated, error, etc.).

All UI strings in this taxonomy are Portuguese (pt-BR) to match the existing surface (`+ Nova sessão`, `Encerrar sessão`, `Sessões anteriores`, `Conversa`, `Grafo do domínio`, `Métricas`).

## Element table

| element_id | purpose | required | data dependencies | example states |
| --- | --- | --- | --- | --- |
| `workspace-shell` | Outermost container; owns global layout, dark theme, and viewport. | R | `payload.version` (presence proves contract bound) | `loading` (no payload yet), `bound` (payload present) |
| `tab-bar` | Horizontal strip of open session tabs. | R | `payload.tabs[]` | `empty` (zero tabs — show only the actions), `single`, `multi`, `overflow` (4+ tabs scroll/wrap) |
| `tab-item` | One open session tab; click switches active session. Status dot reflects `tab.status`. Label = `tab.title`. Active when `tab.sessionId === payload.activeSessionId`. | R (per tab) | `payload.tabs[].sessionId`, `payload.tabs[].title`, `payload.tabs[].status`, `payload.activeSessionId` | `inactive`, `active` (green dot), `ended` (gray dot), `truncated-title` |
| `tab-action-new` | Button "+ Nova sessão". Emits intent `intent:create-session`. | R | none | `idle`, `pending` (parent set `payload.ui.creatingSession=true`) |
| `tab-action-past-sessions` | Button "☰ Sessões anteriores". Toggles past-sessions picker. | R | none | `idle`, `picker-open` |
| `active-session-header` | Eyebrow ("Sessão ativa" / "Sem sessão ativa") + title + end-session button. | R | `payload.activeSessionId`, `payload.tabs[]` (to find the active tab title) | `no-active-session`, `active-session`, `ended-session-tab-still-open` |
| `active-session-eyebrow` | Small uppercase label above the H1. Reads `Sem sessão ativa` when `activeSessionId` is null, `Sessão ativa` otherwise. | R | `payload.activeSessionId` | `none`, `active` |
| `active-session-title` | H1; renders the active tab's `title` or the literal `Harness Workspace` when none. | R | `payload.activeSessionId`, `payload.tabs[].title` | `default`, `session-title`, `truncated` |
| `btn-end-session` | Encerrar sessão. Hidden when no active session. Emits `intent:end-session-modal`. | R (always rendered, hidden when no active session) | `payload.activeSessionId` | `hidden`, `idle`, `confirming` |
| `chat-panel` | Section wrapping the conversation. | R | `payload.activeSessionId`, `payload.chats[activeSessionId]` | `empty-no-session`, `empty-awaiting-first-question`, `populated` |
| `chat-history-list` | Scrollable list of turns for the active session. | R | `payload.chats[activeSessionId].turns[]` | `empty`, `populated`, `streaming`, `at-bottom`, `scrolled-up` |
| `chat-turn` | One conversational turn. Has a `role` (`user` \| `agent`) and a `body`. | R (per turn) | `turns[].turnId`, `turns[].role`, `turns[].text`, `turns[].narrations[]`, `turns[].streaming` | `user`, `agent-text-only`, `agent-with-narrations`, `agent-streaming`, `agent-error-only` |
| `chat-turn-role-label` | Small label "Você" (user) or "Agente" (agent). | R (when turn rendered) | `turns[].role` | `user`, `agent` |
| `chat-turn-text` | The prose body of a turn (multi-paragraph; `\n` → line breaks; HTML-escaped). | O (rendered when `text` non-empty) | `turns[].text` | `single-line`, `multi-paragraph`, `streaming-partial` |
| `tool-use-narration` | Inline pill inside an agent turn, one per tool invocation. | O (rendered when narrations present) | `turns[].narrations[]` | `pending`, `success`, `error` |
| `tool-use-narration-icon` | Leading glyph: `…` pending, `✓` success, `✗` error. | R (when narration rendered) | `narrations[].state` | `pending`, `success`, `error` |
| `tool-use-narration-verb` | Localized pt-BR verb derived from `toolName`: `WriteMarkdownNode→escreveu`, `AppendSection→anexou seção em`, `UpdateFrontmatter→atualizou frontmatter de`, `AddConnection→conectou`, default→`tool`. | R (when narration rendered) | `narrations[].toolName` | one per tool name, plus `unknown-tool` |
| `tool-use-narration-target` | Inline `<code>` with the file path (`narrations[].input.path` or `.input.sourcePath` or `.output.path`, first non-empty). | O (when any path field present) | `narrations[].input.path`, `narrations[].input.sourcePath`, `narrations[].output.path` | `path-rendered`, `no-path-fallback` |
| `tool-use-narration-error` | Trailing error message after `—` for failed tools. | O (rendered when `state==="error"`) | `narrations[].error` | `error-message` |
| `chat-input-form` | Textarea + send button. Hidden when no active session. Emits `intent:send-turn` with `{ sessionId, turnText }`. | R (always rendered, hidden when no active session) | `payload.activeSessionId`, `payload.ui.inputDisabled` | `hidden`, `idle`, `disabled-while-streaming`, `pending-send` |
| `chat-input-textarea` | Multi-line input. Placeholder `Digite sua resposta…`. | R (when `chat-input-form` visible) | none | `empty`, `with-text`, `disabled` |
| `chat-input-send-button` | Submit button "Enviar". Disabled when textarea empty or `ui.inputDisabled` true. | R (when `chat-input-form` visible) | `payload.ui.inputDisabled` | `disabled`, `idle`, `pending` |
| `graph-panel` | Section wrapping the embedded ontology graph. | R | `payload.graph.snapshot` | `loading`, `populated`, `empty-graph`, `error` |
| `graph-actions` | Header row inside `graph-panel` with title + expand button. | R | none | `idle` |
| `graph-mount` | Container the force-graph (or chosen renderer) attaches into. Templates may swap renderers but MUST receive `nodes`/`edges` from the payload. | R | `payload.graph.snapshot.nodes[]`, `payload.graph.snapshot.edges[]` | `empty`, `bootstrapped`, `delta-applied`, `library-missing-fallback` |
| `graph-expand-link` | Legacy "⤢ Open in /visualizations" affordance retained for backwards compatibility with v1.0.0 templates. New templates SHOULD prefer `graph-expand-trigger` + `graph-overlay`. Emits `intent:open-graph-fullscreen` (parent maps to `window.open` of the standalone visualization). | O (templates MAY omit when they implement `graph-expand-trigger` + `graph-overlay-newtab-link`, which together subsume its purpose) | none | `idle`, `hidden` |
| `graph-expand-trigger` | Button / icon on the graph element. Click emits `intent:open-graph-overlay`. Primary v1.1 expand affordance. | R | none | `idle`, `hover`, `active` |
| `graph-overlay` | Full-viewport in-page overlay (NOT an OS-level popup) that renders the graph at giant scale. Always present in the DOM; visible only when the user activates `graph-expand-trigger`. ESC closes; click-outside closes; focus-trap inside while open; carries `aria-modal="true"`. | R | `payload.graph.expandedView`, `payload.graph.snapshot.nodes[]`, `payload.graph.snapshot.edges[]` | `hidden`, `open`, `closing` |
| `graph-overlay-newtab-link` | Secondary affordance inside `graph-overlay` ("Abrir em nova aba"). Emits `intent:open-graph-newtab` so the parent invokes `window.open(payload.graph.expandedView.standaloneRoute, '_blank')`. | R (when `graph-overlay` rendered) | `payload.graph.expandedView.standaloneRoute` | `idle`, `hover` |
| `metrics-panel` | Section wrapping the four KPI cards. | R | `payload.graph.snapshot.metrics` | `zeroes`, `populated` |
| `metric-card` | One KPI card. Four MUST appear: `nodes` (Nós), `edges` (Arestas), `axioms` (Axiomas), `drafts` (Rascunhos). | R (×4) | `payload.graph.snapshot.metrics.{nodes,edges,axioms,drafts}` | `zero`, `non-zero`, `delta-flash` (briefly highlight after `graph-delta`) |
| `end-session-modal` | Confirmation modal listing every `active` tab; primary CTA "Encerrar e gerar resumo". Dismissed by `ui.endModalOpen=false`. | R (always in DOM, hidden by default) | `payload.ui.endModalOpen`, `payload.tabs[]` (filtered to `status==="active"`) | `hidden`, `single-session`, `multi-session`, `confirming` |
| `end-session-modal-list` | `<ul>` of active session titles. Title pluralization: `Encerrar "X"?` for one, `Encerrar N sessões?` for many. | R (when modal visible) | `payload.tabs[]` | `one`, `many` |
| `past-sessions-picker` | Slide-in side drawer listing ended sessions. Toggled by `ui.pickerOpen`. | R (always in DOM, hidden by default) | `payload.ui.pickerOpen`, `payload.pastSessions[]` | `hidden`, `loading`, `empty`, `populated` |
| `past-session-item` | One row in the picker; click emits `intent:resume-session` with `{ sessionId }`. Shows `title`, `endedAt`, `summaryExcerpt`. | R (per past session) | `pastSessions[].sessionId`, `pastSessions[].title`, `pastSessions[].endedAt`, `pastSessions[].summaryExcerpt` | `idle`, `hover`, `resuming` |
| `toast-stack` | Stack of transient notifications anchored top-right. Templates render every `payload.toasts[]` entry. Auto-dismiss + manual-dismiss behavior is driven by `toast.severity` (see [CHAT-PAYLOAD-SCHEMA.md § Toast](./CHAT-PAYLOAD-SCHEMA.md#toast)): `info` and `success` self-clear after 4000ms with NO close button; `warning` self-clears after 8000ms and renders a close button; `error` has NO auto-dismiss and REQUIRES a close button. Templates emit `intent:dismiss-toast` ONLY for severities `warning` and `error`. | R | `payload.toasts[]`, `payload.toasts[].severity` | `empty`, `info`, `success`, `warning`, `error`, `multiple` |
| `live-file-ops` | Sidebar / footer / inline element showing real-time file operations across all turns in the active session. Updates as `file-op` postMessage events arrive (parent fans out from SSE) and as `turn.filesCreated` / `turn.filesChanged` / `turn.filesDeleted` change. Suggested visual treatments (NOT prescriptive — templates choose): `+ create`, `~ change`, `- delete` indicators; live list updating per event. | R | `payload.chats[activeSessionId].turns[].filesCreated`, `...filesChanged`, `...filesDeleted` | `empty`, `populated`, `streaming-updates` |
| `connection-banner` | Banner shown when `payload.connection.status !== "ok"` (e.g. SSE down, `AUTH_MISSING`). pt-BR copy is provided in the payload (`connection.message`). | O (visible only on degraded connection) | `payload.connection.status`, `payload.connection.message`, `payload.connection.code` | `ok-hidden`, `auth-missing`, `provider-crash`, `reconnecting` |
| `empty-state-no-session` | Placeholder shown inside `chat-history-list` when no active session: `Nenhuma sessão ativa. Clique em + Nova sessão para começar.` | R (when `activeSessionId` is null) | `payload.activeSessionId` | `visible`, `hidden` |
| `empty-state-awaiting-first-question` | Placeholder shown inside `chat-history-list` when an active session has zero turns: `Aguardando primeira pergunta do agente…` | R (when active session and `turns.length===0`) | `turns[]` | `visible`, `hidden` |

**Element count: 36 distinct element_ids.**

## Element relationships

Composition rules (parent → child / co-occurrence). Templates may re-arrange siblings but MUST preserve parent-child containment. Non-listed pairings are forbidden.

- `workspace-shell` contains everything else. There is exactly one per page.
- `tab-bar` contains zero or more `tab-item` plus `tab-action-new` and `tab-action-past-sessions`. Order of the two actions relative to the tabs is free.
- `active-session-header` contains `active-session-eyebrow`, `active-session-title`, and `btn-end-session`. The header is rendered even when no active session (eyebrow + default title), but `btn-end-session` is hidden in that case.
- `chat-panel` contains `chat-history-list` and `chat-input-form`. The list contains zero or more `chat-turn`; when zero, exactly one of `empty-state-no-session` or `empty-state-awaiting-first-question` is shown in its place.
- `chat-turn` contains exactly one `chat-turn-role-label` plus zero-or-one `chat-turn-text` plus zero-or-more `tool-use-narration`. A `tool-use-narration` MUST always be nested inside a `chat-turn` of `role==="agent"`. It is illegal under a `role==="user"` turn.
- A `tool-use-narration` contains exactly one `tool-use-narration-icon`, one `tool-use-narration-verb`, optionally one `tool-use-narration-target`, optionally one `tool-use-narration-error`. Tools rendered without a target use a generic verb-only form (`escreveu`).
- `chat-input-form` contains `chat-input-textarea` and `chat-input-send-button`. They MUST appear in that visual order or be replaceable by an equivalent input affordance (e.g. terminal-style prompt) — but the send button MUST exist to accept submit.
- `graph-panel` contains `graph-actions` and `graph-mount`. `graph-actions` contains the panel title and `graph-expand-trigger` (and, optionally, the legacy `graph-expand-link`). `graph-overlay` is a SIBLING of `workspace-shell`'s body content (rendered at the document root so it can cover the entire viewport); it contains a re-mounted graph renderer plus `graph-overlay-newtab-link` and a close affordance. `graph-overlay` MUST be present in the DOM at all times so toggling is purely a CSS/state change.
- `metrics-panel` contains exactly four `metric-card` instances. They MAY be reordered, regrouped, or visually fused, but all four metric keys (`nodes`, `edges`, `axioms`, `drafts`) MUST appear with their pt-BR labels.
- `end-session-modal` and `past-sessions-picker` are SIBLINGS of the main panels — they overlay everything else when visible. They MUST be present in the DOM at all times so toggling is purely a CSS/state change driven by `payload.ui`.
- `toast-stack` is a sibling of `workspace-shell`'s body content; it MUST not be clipped by panels.
- `live-file-ops` MAY be placed as a sidebar pane, a footer strip, an inline ribbon above `chat-history-list`, or any other location templates choose. It is bound to the active session — switching the active session re-derives its contents from `payload.chats[activeSessionId].turns[].files{Created,Changed,Deleted}`.
- `connection-banner` MAY be placed at the top of `workspace-shell`, inline above `chat-panel`, or as part of `toast-stack`. Templates choose, but it MUST be visible whenever `payload.connection.status !== "ok"`.

## Ordering freedom and constraints

Templates have **complete freedom** over:
- Visual hierarchy (which element looks "primary").
- Spatial placement (left/right pane, top/bottom, card grid, drawer).
- Typography, color, motion, density.
- Whether `tab-bar` is horizontal, vertical, dropdown, or replaced by a session switcher palette.
- Whether `metric-card`s are large hero KPIs, sparkline strip, or terminal-status line.

Templates have **no freedom** over:
- The set of elements (closed; this table is exhaustive).
- The data each element binds to.
- The intent names emitted on user actions (defined in [INJECTION-CONTRACT.md](./INJECTION-CONTRACT.md)).
- The pt-BR copy of fixed strings (`+ Nova sessão`, `Encerrar sessão`, `Sessões anteriores`, `Conversa`, `Grafo do domínio`, `Métricas`, `Você`, `Agente`, `Digite sua resposta…`, `Enviar`, `Nenhuma sessão ativa.`, `Aguardando primeira pergunta do agente…`, `Encerrar e gerar resumo`, `Continuar conversa`).

## Coverage comment

Every template file MUST include, near the top:

```html
<!-- @taxonomy-coverage
workspace-shell, tab-bar, tab-item, tab-action-new, tab-action-past-sessions,
active-session-header, active-session-eyebrow, active-session-title, btn-end-session,
chat-panel, chat-history-list, chat-turn, chat-turn-role-label, chat-turn-text,
tool-use-narration, tool-use-narration-icon, tool-use-narration-verb,
tool-use-narration-target, tool-use-narration-error,
chat-input-form, chat-input-textarea, chat-input-send-button,
graph-panel, graph-actions, graph-mount, graph-expand-link,
graph-expand-trigger, graph-overlay, graph-overlay-newtab-link,
metrics-panel, metric-card,
end-session-modal, end-session-modal-list, past-sessions-picker, past-session-item,
toast-stack, connection-banner, live-file-ops,
empty-state-no-session, empty-state-awaiting-first-question
-->
```

Phase 3 validation will grep for these tokens in each template.
