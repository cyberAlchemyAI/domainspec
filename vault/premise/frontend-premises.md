---
tags:
  - frontend
  - architecture
  - premises
node_type: premise
is_session: false
layer: architecture, product
nature: strategic, context-dependent
status: active
version: 1.1.0
last_updated: 2026-04-10
---

# Frontend Premises

> These are explicit bets about the current product and infrastructure. Each states its cost. When the cost becomes unacceptable, we revisit the premise and operationalize a new one.

---

## P1: Page-Level Filter State (No URL Encoding)

**Premise:** Filter state (status, search, date range) lives in React state at the page level. It does not encode into the URL.

**Cost:** 
- Users lose their filter state on refresh
- Links cannot deep-link to a filtered view
- Sharing a filtered view requires additional UI (copy filter state as JSON, import it later)

**When to revisit:** When deep-linking or persistent filter sharing becomes an explicit product requirement. At that point, migrate affected pages to URL-encoded state.

**Current status:** Acceptable. Deep-linking is not a priority.

---

## P2: Portuguese-Only Hardcoded (No i18n Infrastructure)

**Premise:** All user-visible text is hardcoded in Portuguese (pt-BR). No i18n framework (i18next, react-intl, etc.) exists.

**Cost:** Translating the UI to another language requires a full codebase sweep. Every text string must be extracted, cataloged, and replaced with a translation lookup.

**When to revisit:** When localization is an explicit product requirement. At that point, introduce an i18n layer, extract strings, and add translation infrastructure.

**Current status:** Acceptable. Single-language market for now.

---

## P3: Infinite Scroll is the Default for Lists

**Premise:** List and table pages use infinite scroll (scroll to bottom, load more) rather than prev/next pagination buttons.

**Cost:** 
- Dense tables with many columns become harder to navigate (user loses their place when scrolling)
- High-volume lists may become unwieldy
- Users cannot jump to a specific page

**When to revisit:** When a specific page (e.g., an approval queue with action density) justifies pagination. At that point, use pagination as an exception with explicit product sign-off.

**Current status:** Acceptable. Current user workflows favor browsing over jumping.

---

## P4: Page-Level State Management (Library Choice Deferred)

**Premise:** Page-level state (filters, expanded rows, local form state) is managed with React's built-in `useState` and React Context, not a separate state management library (Redux, Zustand, Jotai, MobX).

**Cost:** 
- As pages grow in complexity, prop drilling and state passing may become cumbersome
- No time-travel debugging or middleware for analytics/logging
- State persisting (across page reloads or tabs) requires manual implementation
- Complex cross-page state synchronization requires custom solutions

**When to revisit:** When a page's local state complexity exceeds what `useState` + custom hooks can reasonably handle, or when a product feature (cross-tab sync, undo/redo, state replay) demands it.

**Current status:** Acceptable. Pages currently favor simplicity; complexity is managed via container/presenter splits and custom hooks.

---

## Governance

These premises are the team's current best guesses about product direction and infrastructure maturity. They are revisited when:
- A premise's cost becomes intolerable
- The product direction changes
- Infrastructure becomes available (e.g., a translation service)

Changing a premise requires alignment between Product and Engineering. The cost of the change and the benefit must be explicit.

---

## Connections

| Document | Relationship | Description |
|----------|--------------|-------------|
| [[frontend-axioms]] | `operationalize` | These premises apply the axioms to the current product context |
| [[frontend-constitution]] | `drive` | Constitutional rules operationalize these premises |
