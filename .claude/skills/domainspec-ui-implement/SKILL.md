---
name: domainspec-ui-implement
description: Implement frontend pages and components for a feature from DomainSpec docs, UI-ARCHITECTURE.md constitution, and UI-SPEC.md design contract.
argument-hint: "<feature-name> [--strict]"
agent: domainspec-ui-architect
allowed-tools: Read, Write, Bash, Glob, Grep, Task, WebFetch
---

<objective>
Build production frontend code (pages, components, hooks, API calls) that matches the documented domain model, UI architecture constitution, and feature UI design contract.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/UI-ARCHITECTURE.md (authoritative frontend constitution)
- docs/features/{feature}/SPEC.md (concept inventory)
- docs/features/{feature}/UI-SPEC.md (per-feature design contract)
- docs/features/{feature}/interfaces.md (HTTP endpoints → API calls)
- docs/features/{feature}/operations.md (user actions → forms, mutations)
- docs/features/{feature}/queries.md (data views → query hooks)
- docs/features/{feature}/states.md (state transitions → conditional rendering)
- docs/features/{feature}/STORIES.md (user journeys → page flows)

Output:

- {web-app}/src/pages/{feature}/\*.astro (or equivalent framework routes)
- {web-app}/src/components/{feature}/\*.tsx (React components)
- {web-app}/src/hooks/use-{resource}.ts (data hooks per resource)
- Updated {web-app}/src/lib/query-keys.ts (new query keys)
- Updated {web-app}/src/components/layout/AppSidebar.tsx (new nav items)
  </context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read docs/UI-ARCHITECTURE.md for conventions, naming, imports, component patterns.
3. Read feature docs: SPEC.md, UI-SPEC.md, interfaces.md, operations.md, queries.md, states.md, STORIES.md.
4. Derive implementation tasks from feature docs:
   a. **Query hooks**: One per query in queries.md → `usePlayer()`, `usePlayers()`, etc.
   b. **Mutation hooks**: One per operation in operations.md → `useCreatePlayer()`, etc.
   c. **Components**: One per major UI element from UI-SPEC.md → tables, forms, cards, modals.
   d. **Pages**: One Astro page per route, importing React islands with `client:load`.
   e. **Nav updates**: Add feature routes to sidebar navigation.
5. For each task:
   a. Use shadcn/ui components from UI-ARCHITECTURE.md component inventory.
   b. Follow naming conventions from UI-ARCHITECTURE.md.
   c. Use query keys from lib/query-keys.ts.
   d. Use API client from lib/api.ts.
   e. Validate against UI-SPEC.md design contract (spacing, color, typography, copywriting).
6. Run build + type check after each page.
7. In --strict mode, stop on any UI-SPEC violation and request correction.
8. Return implementation summary with concept-to-file mapping.
</process>

<generation-rules>
- All interactive content lives in React components with `client:load` or `client:visible`.
- Astro pages are thin wrappers: layout + React island.
- Every API call goes through the typed `api()` helper.
- Every data query uses TanStack Query with keys from query-keys.ts.
- Every form uses React Hook Form with Zod resolver.
- Component imports use `@/` path alias.
- No inline styles — use Tailwind utility classes and design tokens only.
- No light mode styles — respect UI-ARCHITECTURE.md color mode setting.
</generation-rules>

<authority-rule>
- DomainSpec feature docs define what the UI must do (behavior).
- UI-ARCHITECTURE.md defines how the project is structured (conventions).
- UI-SPEC.md defines how the feature looks (presentation).
- Code must satisfy all three. When conflicts arise: DomainSpec behavior > constitution > design contract.
</authority-rule>
