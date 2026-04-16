---
id: { feature-id }-ui
feature: { feature-id }
title: "{ Feature Name } UI Specification"
summary: { one-line description of what the UI covers }
status: draft
pillar: { pillar }
domain: { feature-id }-ui
audience:
  - developers
priority: { p0 | p1 | p2 | p3 }
lang: en
owners:
  - web-core
updatedAt: { date }
dependencies:
  - SPEC.md
  - interfaces.md
  - operations.md
  - queries.md
  - states.md
includes: []
constitution: docs/UI-ARCHITECTURE.md
---

# UI Specification: { Feature Name }

> Governs the frontend presentation of { what this feature shows and does }.
> Constrained by [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md).

---

## Route Table

<!-- Meta-concept: Page (UI Structural) + Layout + Guard -->

| Route     | Page Title | Layout          | Auth Required | Permission |
| --------- | ---------- | --------------- | ------------- | ---------- |
| `/{path}` | {title}    | DashboardLayout | Yes           | {perm}     |

---

## Page Layouts

### /{route} ({Page Title})

<!-- Meta-concept: Page renders Component[] -->

```
┌──────────────────────────────────────────────┐
│ Header: "{Page Title}"                       │
├──────────────────────────────────────────────┤
│ {ComponentName}                              │
│ ┌──────┬───────┬──────────┬────────────────┐ │
│ │Col1  │Col2   │Col3      │Actions         │ │
│ └──────┴───────┴──────────┴────────────────┘ │
└──────────────────────────────────────────────┘
```

---

## Component Inventory

<!-- Meta-concept types: Component, Form, State Indicator (UI Structural / Behavioral / Presentational) -->
<!-- Cross-layer edges: each component may consume Hooks, display View Models, submit Actions -->

| Component         | Type  | Location                          | Purpose        |
| ----------------- | ----- | --------------------------------- | -------------- |
| `{ComponentName}` | Table | `components/{feature}/{file}.tsx` | {what it does} |

---

## Data Flow

<!-- Meta-concepts: Hook (UI Behavioral), Binding (UI Connective) -->
<!-- Cross-layer edges: fetches → Query, mutates → Operation -->

### /{route}

| API Call          | Hook          | Cache Key         | Triggers   |
| ----------------- | ------------- | ----------------- | ---------- |
| `GET /{endpoint}` | `use{Name}()` | `queryKeys.{key}` | Page mount |

### Mutations

| API Call           | Hook             | On Success                           |
| ------------------ | ---------------- | ------------------------------------ |
| `POST /{endpoint}` | `useCreate{X}()` | Invalidate {keys}, navigate to {url} |

---

## Form Contracts

<!-- Meta-concept: Form (UI Behavioral) -->
<!-- Cross-layer edge: contracts → Interface -->

### {FormName}

| Field   | Type   | HTML Input | Validation | Error Message         |
| ------- | ------ | ---------- | ---------- | --------------------- |
| {field} | string | `text`     | Required   | "{field} is required" |

**Zod schema:**

```typescript
z.object({
  // field: z.string().min(1, "error message"),
});
```

**Error Code → UI Message Mapping:**

| API Error Code | HTTP Status | UI Message           |
| -------------- | ----------- | -------------------- |
| {CODE}         | {status}    | "{user-facing text}" |

---

## State-to-UI Mapping

<!-- Meta-concept: State Indicator (UI Presentational) -->
<!-- Cross-layer edge: reflects → State Machine / Enum -->

| Domain Value | UI Representation          | Color / Variant  |
| ------------ | -------------------------- | ---------------- |
| {STATE_A}    | Badge with label "{label}" | green / default  |
| {STATE_B}    | Badge with label "{label}" | yellow / warning |

---

## Accessibility Requirements

| Component    | Requirement                                   |
| ------------ | --------------------------------------------- |
| {FormName}   | `role="form"`, `aria-label="{label}"`         |
| {TableName}  | Semantic `<table>` with column headers        |
| {DialogName} | `aria-modal="true"`, focus trap, Esc to close |
| {Badge}      | `aria-label` describing current state         |

---

## UI Concept Registry

<!-- Concept table for this feature's UI concepts (validated against global registry) -->

| Concept         | ID                           | Type            |
| --------------- | ---------------------------- | --------------- |
| /{route}        | ui.{feature}.{route}         | Page            |
| {ComponentName} | ui.{feature}.{ComponentName} | Component       |
| use{Name}       | ui.{feature}.use{Name}       | Hook / Binding  |
| {FormName}      | ui.{feature}.{FormName}      | Form            |
| {StatusBadge}   | ui.{feature}.{StatusBadge}   | State Indicator |
