---
project: { project-name }
status: draft
framework: { astro|next|remix|vite|other }
ui-framework: { react|vue|svelte|solid|none }
styling: { tailwind|css-modules|styled-components|other }
component-lib: { shadcn|radix|headless-ui|none }
color-mode: { dark-only|light-only|light-dark }
created: { date }
updated: { date }
---

# Frontend Architecture Constitution

> Governing document for all frontend decisions in this project.
> Every contributor must follow these conventions. Deviations require explicit approval.

---

## Stack

| Layer          | Choice | Version | Notes                      |
| -------------- | ------ | ------- | -------------------------- |
| Meta-framework | {name} | {x.x}   | {routing model}            |
| UI framework   | {name} | {x.x}   | {rendering strategy}       |
| Styling        | {name} | {x.x}   | {approach}                 |
| Component lib  | {name} | {x.x}   | {source: copy-paste / npm} |
| Icons          | {name} | {x.x}   | {icon style}               |
| Data fetching  | {name} | {x.x}   | {caching strategy}         |
| Forms          | {name} | {x.x}   | {validation approach}      |
| Font           | {name} | {x.x}   | {loading method}           |

---

## Design Principles

1. **{Principle 1}** — {description}
2. **{Principle 2}** — {description}
3. **{Principle 3}** — {description}
4. **{Principle 4}** — {description}
5. **{Principle 5}** — {description}

---

## Color System

{color-mode} theme using {token-format} values.

| Token                                    | Role                            |
| ---------------------------------------- | ------------------------------- |
| `--background` / `--foreground`          | Page background / default text  |
| `--card` / `--card-foreground`           | Elevated surfaces               |
| `--popover` / `--popover-foreground`     | Floating overlays               |
| `--primary` / `--primary-foreground`     | Brand actions, CTAs             |
| `--secondary` / `--secondary-foreground` | Lower-emphasis actions          |
| `--muted` / `--muted-foreground`         | Subtle backgrounds, helper text |
| `--accent` / `--accent-foreground`       | Hover/focus/active states       |
| `--destructive`                          | Error & destructive actions     |
| `--border`                               | Borders and dividers            |
| `--input`                                | Form control borders            |
| `--ring`                                 | Focus rings                     |
| `--sidebar-*`                            | Sidebar-specific theming        |
| `--chart-1..5`                           | Chart palette                   |

Palette direction: {describe palette approach}

---

## Typography

| Usage       | Font   | Weight    |
| ----------- | ------ | --------- |
| Body / UI   | {font} | {weights} |
| Code / Mono | {font} | {weights} |

Base size: {px}. Scale: {description of scale}.

---

## Layout

```
{ASCII diagram of shell layout}
```

- **{Region 1}** — {description of region behavior}
- **{Region 2}** — {description of region behavior}
- **{Region 3}** — {description of region behavior}

---

## Routing & Page Structure

{Framework} file-based routing under `{routes-dir}/`.

```
{routes-dir}/
├── {route-tree}
```

---

## Component Organization

```
{src-dir}/
├── components/
│   ├── ui/           → {component lib} primitives (auto-generated)
│   ├── layout/       → Shell, navigation, page wrappers
│   └── {feature}/    → Feature-specific components
├── hooks/            → Shared hooks
├── lib/              → Utilities (api client, helpers)
├── layouts/          → Page layouts
├── pages/            → Routes
└── styles/
    └── global.css    → Theme tokens + framework imports
```

---

## Data Layer

### API Client

{Describe typed API client approach — base URL, auth headers, error handling}

### {Data fetching lib}

- Query key organization: {approach}
- One custom hook per resource
- Mutations with invalidation

### Forms

- {Form lib} with {validation approach}
- Shared schemas from {shared package path} where possible

---

## Conventions

### Naming

| Item            | Convention         | Example                |
| --------------- | ------------------ | ---------------------- |
| Component files | PascalCase .tsx    | `PlayerCard.tsx`       |
| Hook files      | camelCase use\*.ts | `usePlayer.ts`         |
| Utility files   | kebab-case .ts     | `query-keys.ts`        |
| Page files      | {convention}       | {example}              |
| CSS variables   | kebab-case         | `--sidebar-background` |

### Imports

- Use `{alias}` path alias for internal imports
- Use `{shared-alias}` for shared contracts

### Do NOT

- {Anti-pattern 1}
- {Anti-pattern 2}
- {Anti-pattern 3}
- {Anti-pattern 4}

---

## Dependencies to Install

```bash
# {Component lib CLI}
{install-command}

# {Data fetching}
{install-command}

# {Forms}
{install-command}

# {Font}
{install-command}

# {Icons}
{install-command}

# {Utility}
{install-command}
```

---

## Initial Components

```bash
{component install commands}
```

---

_Last updated: {date}_
