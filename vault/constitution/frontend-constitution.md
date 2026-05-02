---
tags:
  - architecture
  - frontend
  - governance
  - constitution
node_type: constitution
is_session: false
layer: architecture, application
nature: procedural, technical
status: active
version: 1.0.0
last_updated: 2026-04-10
---

# Frontend Constitution

> Defines enforceable patterns for all frontend development. Answers: *"How should any new frontend page or component be built in this project?"*
>
> This document specifies **Constitutional Rules** (what you must do) and **Patterns** (how you do it). It is grounded in [[frontend-axioms]] and [[frontend-premises]].

---

## Index

1. [Constitutional Rules](#constitutional-rules)
2. [Patterns](#patterns)
3. [Governance & Amendment](#governance--amendment)
4. [Connections](#connections)

---

## Constitutional Rules

> These are non-negotiable rules. Violating them breaks the system's contract. They operationalize the axioms and premises.

### R1: Context Is Reserved for Session and Auth State Only

Global React context (from `infrastructure/state/`) is strictly for session-level data: authenticated user identity, auth tokens, session metadata, app-wide configuration.

Page-level data (lists, filters, summaries, derived computations) **always** lives in page-local state. Never move page data into context. If you're tempted, you're missing a container/presentational split.

**Rationale:** Comes from Axiom A1 (determinism) and A2 (unidirectional flow). Global context obscures data ownership.

---

### R2: API Calls Are the Source of Truth for All Mutations

Mutations (POST, PUT, DELETE) never update client state directly. The canonical state always lives on the server. When a mutation is initiated:

1. Optimistic updates are acceptable for status changes (e.g., "pending" → "approved"). Set a local `submitting` flag.
2. On API success: refetch the affected data or trust the API response if it returns the updated item.
3. On API failure: revert the optimistic update and show a visible inline error. Never silently fail.

**Rationale:** Comes from Axiom A3 (separation of concerns). The server is the single source of truth.

---

### R3: Presentational Components Never Fetch

A component is either a **container** (fetches data, owns state, manages the page lifecycle) or a **presenter** (receives props, renders JSX, handles clicks).

- Container components live at the page level.
- Sub-components are presenters — they render props and never call `fetch`, `useQuery`, or read from context.
- If a sub-component needs to fetch, it should be promoted to a container, not kept as a presenter.

**Rationale:** Comes from Axiom A3 (separation). Enforceable through code review.

---

### R4: Every List and Table Page Has Three Explicit States

Every page that displays a list or table **must** handle three states explicitly:

1. **Loading state (initial):** Show a centered spinner while fetching the first page of data.
2. **Error state:** If the API fails, show a visible error message inline with a retry option.
3. **Empty state:** If the API returns zero rows, show an empty state (icon + message), never a blank table with headers.

These states are not optional. They are the contract with the user.

**Rationale:** Comes from Premise P3 (infinite scroll). Dense lists require clear feedback at every step.

---

### R5: Destructive Mutations Require Explicit Confirmation

Actions that are irreversible (delete, reject, void, mark as final) must require explicit user confirmation:

- **Status changes** (approve, deny): inline button or simple confirmation. The action can be undone by overriding.
- **Destructive actions** (delete, void): explicit modal or dual confirmation. A single click never deletes anything.

**Rationale:** Product safety. Irreversible actions must not be accidental.

---

### R6: Mutations Happen Through Explicit Handler Functions, Never `useEffect` Side Effects

Every mutation is triggered by an explicit event handler (onClick, onSubmit). Never mutate state as a side effect of a render or dependency change. Handlers must:

1. Set a `submitting` flag to prevent double-submit.
2. Call the API.
3. On success: update local state or refetch.
4. On failure: revert and show an error.

Never use `useEffect` to trigger a mutation based on state change — that creates implicit coupling and race conditions.

**Rationale:** Comes from Axiom A1 (determinism). Explicit handlers are traceable and testable.

---

### R7: Separate First-Load and Subsequent-Page Loading States

When implementing infinite scroll, use **two separate state variables** to track loading:

- `loading`: true while fetching the first page of data.
- `loadingMore`: true while fetching subsequent pages.

This prevents showing a full-page spinner (confusing to users) when they trigger a scroll-to-load event. Show `loading` in the center of the page. Show `loadingMore` as a spinner at the bottom of the list.

**Rationale:** Comes from Premise P3 (infinite scroll). UX clarity requires distinguishing initial load from progressive load.

---

## Patterns

> These are implementation conventions. They are not constitutional — they can change when you learn something better. But standardize on them until you have a reason to deviate.

### Pattern 1: Infinite Scroll Implementation

For list pages, use `IntersectionObserver` on a sentinel `<div>` at the bottom of the list. Only trigger when `hasMore && !loadingMore && !loading` — never initiate concurrent fetches.

**Exception:** Action-heavy tables (approval workflows) use explicit pagination to avoid row-shift confusion during mutations.

**Reference:** See the frontend patterns library for exact IntersectionObserver wiring and state shape.

---

### Pattern 2: Test Files Co-Located

Test files live alongside the file they test, in the same directory:

```
frontend/src/pages/
  MyPage.jsx
  MyPage.test.jsx        ← test file, not in __tests__/
```

No `__tests__/` subfolder. True co-location keeps the pairing obvious.

---

### Pattern 3: API Client Naming (Generic, Not Domain-Specific)

All pages use a generic `apiClient` from `hooks/apiClient`. Never reference domain-specific clients.

```js
import { apiClient } from 'hooks/apiClient';

const response = await apiClient.get('/api/remessas');
```

If domain-specific overrides are ever needed, they extend from the base `apiClient`, not replace it.

---

### Pattern 4: Expanded Row Tracking

For table rows that expand to show detail, track the expanded state as a single string (the row's unique key):

```js
const [expandedRow, setExpandedRow] = useState(null);
```

Only one row can be expanded at a time. This is a UX choice (from Premise P3), not a technical constraint — if a future page needs multi-expand, override with product justification.

Lazily-fetched sub-data (e.g., checklist items per contract) is cached in a `{ [key]: data }` map to avoid re-fetching on re-expand.

---

### Pattern 5: UI Styling Conventions

- **Page header:** dark gradient card with title, subtitle, optional filter tabs inline.
- **Summary cards:** 4-column grid of summary metrics below the header.
- **Tables:** `rounded-lg border border-slate-200 bg-white shadow-sm`. Header row uses `bg-slate-50` with light text.
- **Empty state:** centered icon + Portuguese message. Never show an empty table with headers.
- **Error state:** inline red box with visible error message and retry button.
- **Brand accent color:** `#4B8C8F` for progress fills, active indicators, loading spinners.

All text is in **Portuguese (pt-BR)**. Numbers use `toLocaleString("pt-BR")`.

---

## Governance & Amendment

This constitution is the enforceable reference for all frontend work. It is **not absolute** — it must evolve as the system and product evolve.

### Approval Process by Tier

| Tier | Change Type | Approval Required |
|------|-------------|-------------------|
| Rules | Operational improvements or clarifications | One maintainer review |
| Patterns | Implementation convention updates | Lightweight review; can iterate fast |

**Note:** Changes to axioms or premises go through those documents' governance processes, not this one.

### Amendment Process

1. Open a PR that updates this file.
2. Cite which rules/patterns change and why.
3. Update any affected code examples or templates.
4. Get approval per the tier above.
5. Update the version (MINOR for new rules/patterns, PATCH for clarifications).
6. Merge once approved.

### Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-10 | Initial ratification. Separated axioms and premises into own documents. Rules (R1-R7) define obligations. Patterns (P1-P5) show implementation. |

---

## Connections

| Document | Relationship | Description |
|----------|--------------|-------------|
| [[frontend-axioms]] | `grounded-in` | These rules and patterns implement the axioms |
| [[frontend-premises]] | `operationalize` | These rules operationalize the premises |
| [[development-practices-constitution]] | `derives-from` | Frontend rules implement broader development principles |
| [[robot-talks-frontend]] | `ratified-by` | Two-agent dialogue that debated and validated these rules |
| [frontend (skill)](../../../.claude/skills/custom/frontend.md) | `operationalizes` | Condensed skill for agent execution |
