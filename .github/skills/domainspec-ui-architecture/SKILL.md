---
name: domainspec-ui-architecture
description: Define or evolve frontend architecture constitution for a DomainSpec project. Detects existing stack, asks interactive questions, produces UI-ARCHITECTURE.md, installs tools, and scaffolds layout.
argument-hint: "[--update]"
agent: domainspec-ui-architect
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, WebFetch, Task
---

<objective>
Produce a complete frontend architecture constitution (docs/UI-ARCHITECTURE.md) and scaffold the initial frontend setup before any feature UI work begins.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/templates/ui-architecture.md

Detection targets:

- {web-app}/package.json, tsconfig.json, components.json
- {web-app}/astro.config._ | next.config._ | vite.config.\*
- {web-app}/src/styles/\*.css
- {web-app}/src/components/\*\*
- {web-app}/src/pages/** | {web-app}/app/**

Output:

- docs/UI-ARCHITECTURE.md
- Installed dependencies and configured tools
- Layout scaffolding and design tokens
- Lib files (api client, query keys)
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read domainspec/templates/ui-architecture.md.
3. Detect existing frontend stack (framework, CSS, component lib, fonts, routes).
4. Check for docs/UI-ARCHITECTURE.md:
   - If exists → enter **update mode** (diff and apply changes).
   - If missing → enter **create mode** (full setup).
5. Use AskQuestions tool to gather user preferences for unanswered categories:
   - Component library, design tone, color mode, layout pattern
   - Data fetching, form handling, typography, MVP pages
   - Skip questions answered by detection
6. Fill ui-architecture.md template with detection + user answers.
7. Write docs/UI-ARCHITECTURE.md.
8. In create mode:
   a. Install dependencies (component lib CLI, data fetching, forms, fonts, icons, utilities).
   b. Initialize component library (e.g., shadcn init).
   c. Install core components (sidebar, button, card, input, table, etc.).
   d. Configure design tokens in global.css for chosen color mode.
   e. Scaffold layouts and shell components.
   f. Create API client and query key factory.
   g. Update home page to use new layout.
   h. Run build + type check.
9. In update mode:
   a. Apply incremental changes.
   b. Run build + type check.
10. Return summary of created/updated artifacts.
</process>

<auto-detection>
This skill is auto-suggested by the planner when:
- A feature's interfaces.md declares `transport: http` endpoints
- No docs/UI-ARCHITECTURE.md exists yet
- The planner includes frontend tasks in the plan
The user can also invoke it standalone.
</auto-detection>
