---
project: domainspec
status: approved
framework: vite
ui-framework: react
styling: css
component-lib: xyflow
color-mode: light-only
created: 2026-05-02
updated: 2026-05-05
---

# Frontend Architecture Constitution

> Governing document for frontend decisions in this project.
> Feature UI contracts must conform to these conventions.

## Stack

| Layer          | Choice               | Version | Notes                                  |
| -------------- | -------------------- | ------- | -------------------------------------- |
| Meta-framework | Vite                 | 5.x     | SPA delivery                           |
| UI framework   | React                | 18.x    | Client-rendered application            |
| Styling        | Plain CSS            | n/a     | Global tokens + component class blocks |
| Component lib  | @xyflow/react        | 12.x    | Graph rendering for topology views     |
| Icons          | Unicode + inline SVG | n/a     | Keep dependency footprint minimal      |
| Data fetching  | Fetch API            | n/a     | Hook-driven server-side filtering      |
| Forms          | Native form controls | n/a     | URL/query driven filters               |
| Font           | Space Grotesk        | n/a     | Local CSS fallback stack               |

## Design Principles

1. Deterministic first: UI state is derived directly from API contracts.
2. Contract-bound filtering: filter logic is executed by backend endpoints.
3. Graph literacy: topology must be readable without advanced controls.
4. Evidence visibility: concept and edge evidence paths are first-class UI elements.
5. Graceful degradation: show explicit loading/error/degraded states.

## Color System

Light-only theme using CSS custom properties.

| Token                                    | Role                             |
| ---------------------------------------- | -------------------------------- |
| `--background` / `--foreground`          | Page background and primary text |
| `--card` / `--card-foreground`           | Surface cards                    |
| `--primary` / `--primary-foreground`     | Primary actions                  |
| `--secondary` / `--secondary-foreground` | Secondary actions                |
| `--muted` / `--muted-foreground`         | Helper text and subtle surfaces  |
| `--accent` / `--accent-foreground`       | Highlight and selected states    |
| `--destructive`                          | Errors and destructive actions   |
| `--border`                               | Borders and separators           |
| `--ring`                                 | Focus states                     |
| `--chart-1..5`                           | Graph node color groups          |

Palette direction: cool blue/teal surfaces with high-contrast dark text and warm highlight accents for selection.

## Typography

| Usage       | Font                                           | Weight        |
| ----------- | ---------------------------------------------- | ------------- |
| Body / UI   | Space Grotesk, Segoe UI, sans-serif            | 400, 500, 600 |
| Code / Mono | ui-monospace, SFMono-Regular, Menlo, monospace | 400, 500      |

Base size: 16px.

## Layout

```
+-------------------------+-----------------------------------------------+
| Sidebar navigation      | Header: title + projection freshness + state |
| (Feature Atlas)         +------------------------+----------------------+
|                         | Mirror cards           | Relationship graph   |
|                         +------------------------+----------------------+
|                         | Concept detail panel (inbound/outbound edges) |
+-------------------------+-----------------------------------------------+
```

- Header: run status and quick metadata.
- Left panel: navigation and route entrypoint.
- Center panel: mirror cards and deterministic graph visualization.
- Right/bottom panel: focused concept inspector with traceability evidence.

## Breakpoint Contract

| Breakpoint | Width Range | Contract                                                                     |
| ---------- | ----------- | ---------------------------------------------------------------------------- |
| mobile     | `<= 680px`  | Panels stack vertically; relation columns collapse to one column.            |
| tablet     | `681-940px` | Sidebar becomes top bar; three UI regions remain visible in one-column flow. |
| desktop    | `> 940px`   | Sidebar + content split; cards, graph, detail visible concurrently.          |

## Routing and Page Structure

Vite SPA route shell under `apps/web/src/`.

```
apps/web/src/
├── App.tsx
├── components/
│   ├── layout/
│   │   └── AppSidebar.tsx
│   └── knowledge-graph/
│       ├── MirrorCardGrid.tsx
│       ├── RelationshipGraphCanvas.tsx
│       ├── ConceptDetailPanel.tsx
│       └── FocusStateIndicator.tsx
├── hooks/
│   ├── useMirrorGraph.ts
│   └── useConceptFocus.ts
├── lib/
│   ├── api.ts
│   └── query-keys.ts
├── layouts/
│   └── KnowledgeGraphPageLayout.tsx
├── styles.css
└── main.tsx
```

## Component Organization

```
apps/web/src/
├── components/
│   ├── layout/
│   │   └── AppSidebar.tsx
│   └── knowledge-graph/
│       ├── MirrorCardGrid.tsx
│       ├── RelationshipGraphCanvas.tsx
│       ├── ConceptDetailPanel.tsx
│       └── FocusStateIndicator.tsx
├── hooks/
│   ├── useMirrorGraph.ts
│   └── useConceptFocus.ts
├── lib/
│   ├── api.ts
│   └── query-keys.ts
├── layouts/
│   └── KnowledgeGraphPageLayout.tsx
├── App.tsx
└── styles.css
```

## Data Layer

### API client

- Base URL from `VITE_API_BASE`, default `http://localhost:3000`.
- Default scope header for read endpoints: `x-scopes: domainspec.kg.read`.
- Error handling returns typed `ApiError` with `status`, `error`, and `message`.

### Query keys

- `queryKeys.featureAtlas(filters)`
- `queryKeys.neighborhood(featureId, capabilityKey, filters)`
- `queryKeys.conceptInspector(conceptId, filters)`

### Forms

- Native controls, no client-side schema library required for V1 filters.

## Conventions

### Naming

| Item            | Convention          | Example                  |
| --------------- | ------------------- | ------------------------ |
| Component files | PascalCase `.tsx`   | `NeighborhoodCanvas.tsx` |
| Hook files      | camelCase `use*.ts` | `useFeatureAtlas.ts`     |
| Utility files   | kebab-case `.ts`    | `query-keys.ts`          |
| CSS variables   | kebab-case          | `--chart-1`              |

### Imports

- Relative imports within `apps/web/src`.
- Keep external UI libs isolated to component boundary files.

### Do NOT

- Do not implement client-side filter semantics that diverge from API contracts.
- Do not render non-canonical edge labels.
- Do not hide source evidence links when provided.
- Do not add dark mode styles in V1.

_Last updated: 2026-05-05_
