---
description: Condensed frontend rules — React patterns, state management, mutation handling
---

# Frontend Skill

## Rules (non-negotiable)

**R1 — Context = session/auth only.** Page data lives in page-local state. Never put lists, filters, or derived data in global context.

**R2 — Server is source of truth.** Mutations call API first. Optimistic updates OK for status changes, but revert on failure. Never silently fail.

**R3 — Presenters never fetch.** Container components fetch and own state. Sub-components receive props and render. If a sub-component needs to fetch, promote it to container.

**R4 — Three explicit states on every list/table page:** loading (spinner), error (inline message + retry), empty (icon + message). Never show blank table with headers.

**R5 — Destructive actions need confirmation.** Status changes: inline button. Irreversible actions (delete, void): modal or dual confirmation.

**R6 — Mutations via explicit handlers only.** onClick/onSubmit — never useEffect side effects. Set `submitting` flag, call API, handle success/failure.

**R7 — Separate loading states.** `loading` for first page, `loadingMore` for subsequent pages (infinite scroll). Full-page spinner only on initial load.

## Patterns (conventions)

- **Infinite scroll**: `IntersectionObserver` on sentinel div. Only trigger when `hasMore && !loadingMore && !loading`. Exception: action-heavy tables use explicit pagination.
- **Tests**: co-located (`MyPage.test.jsx` next to `MyPage.jsx`), no `__tests__/` folder.
- **API client**: always use generic `apiClient` from `hooks/apiClient`.
- **Expanded rows**: single string state (`expandedRow`), one row at a time. Cache sub-data in `{ [key]: data }` map.
- **Styling**: dark gradient header, 4-col summary grid, `rounded-lg border border-slate-200` tables, `#4B8C8F` accent. All text pt-BR.

## Escalation — When to Load the Constitution

- If you need to understand *why* a rule exists (e.g., "why can't presenters fetch?") → read the Rationale under the relevant rule in `docs/vault/constitution/frontend-constitution.md`
- If proposing to override or change a rule → read §Governance & Amendment for the approval process
- If a pattern (P1-P5) doesn't fit a new page type → read the full Pattern section for exception guidance
- If you need to amend or question a frontend rule → read the full constitution + its `grounded-in` axioms
