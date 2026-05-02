---
name: domainspec-ui-phase-bridge
description: Bridge DomainSpec feature specs to GSD UI phase workflow for per-feature UI design contracts. Always delegates to gsd-ui-researcher and gsd-ui-checker.
argument-hint: "<feature-name>"
agent: domainspec-ui-architect
allowed-tools: Read, Write, Bash, Glob, Grep, Task, AskQuestions, WebFetch
---

<objective>
Generate a UI design contract (UI-SPEC.md) for a specific feature by bridging DomainSpec feature documentation to the GSD UI phase workflow. The contract is constrained by docs/UI-ARCHITECTURE.md.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/UI-ARCHITECTURE.md (authoritative frontend constitution)
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/interfaces.md (HTTP endpoints, request/response shapes)
- docs/features/{feature}/operations.md (user actions)
- docs/features/{feature}/queries.md (data views)
- docs/features/{feature}/states.md (state transitions reflected in UI)
- docs/features/{feature}/STORIES.md (user journeys → page flows)

Output:

- docs/features/{feature}/UI-SPEC.md (per-feature design contract)
  </context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read docs/UI-ARCHITECTURE.md — this is the authoritative constraint.
3. Load feature SPEC.md, interfaces.md, operations.md, queries.md, states.md, STORIES.md.
4. Extract UI-relevant information:
   - HTTP endpoints → API calls the frontend must make
   - Operations → user actions → buttons, forms, CTAs
   - Queries → data views → tables, cards, lists
   - States → status badges, conditional rendering, empty/error states
   - Stories → page flows, user journeys
5. Delegate to gsd-ui-researcher subagent with:
   - Feature context extracted above
   - UI-ARCHITECTURE.md as constitution constraint
   - Pre-populated decisions from architecture (tokens, spacing, typography, component lib)
6. Validate result with gsd-ui-checker subagent.
7. If checker returns BLOCK findings, send back to researcher for revision (max 2 iterations).
8. Write approved UI-SPEC.md to docs/features/{feature}/UI-SPEC.md.
9. Return summary with concept-to-UI mapping.
</process>

<authority-rule>
- UI-ARCHITECTURE.md constrains all design contract decisions.
- DomainSpec feature docs define what the UI must do (behavior).
- GSD UI researcher/checker define how it looks (presentation).
- When conflicts arise: DomainSpec behavior > UI-ARCHITECTURE constitution > GSD suggestions.
</authority-rule>
