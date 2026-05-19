---
name: domainspec-ui-pipeline
description: End-to-end UI pipeline for a feature. Reads existing DomainSpec docs, ensures UI-ARCHITECTURE.md exists, generates UI-SPEC.md, derives Playwright E2E tests, implements frontend, and runs visual audit — all in one command.
argument-hint: "<feature-name> [--skip-audit] [--spec-only] [--dry-run]"
agent: domainspec-ui-architect
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, WebFetch, Task
---

<objective>
Execute the full UI lifecycle for a single feature in one pass — from existing DomainSpec backend docs through to working frontend pages with E2E tests and visual audit.
</objective>

<flags>
- `--spec-only`: Stop after generating UI-SPEC.md (Steps 1–2). Useful for review before implementation.
- `--skip-audit`: Skip the visual audit step (Step 5).
- `--dry-run`: Show the plan without executing. Lists what would be created/modified.
</flags>

<context>
Prerequisites (must already exist):
- docs/features/{feature}/SPEC.md (concept inventory)
- docs/features/{feature}/interfaces.md (HTTP endpoints — at least one with transport: http)

Also reads (when present):

- docs/features/{feature}/operations.md (user actions → forms, mutations)
- docs/features/{feature}/queries.md (data views → tables, cards)
- docs/features/{feature}/states.md (state transitions → conditional rendering)
- docs/features/{feature}/events.md (real-time updates)
- docs/features/{feature}/STORIES.md (user journeys → page flows)
- docs/features/{feature}/capabilities/\*.md (capability-driven features)

Created/updated by this skill:

- docs/UI-ARCHITECTURE.md (if missing — created via interactive questions)
- docs/features/{feature}/UI-SPEC.md (per-feature design contract)
- docs/features/{feature}/TEST-SPEC.md (E2E section appended)
- {web-app}/e2e/{feature}/\*.spec.ts (Playwright test scaffolds)
- {web-app}/src/pages/{feature}/\*.astro (page routes)
- {web-app}/src/components/{feature}/\*.tsx (React components)
- {web-app}/src/hooks/use-{resource}.ts (data hooks)
- {web-app}/src/lib/query-keys.ts (updated with new keys)
- {web-app}/src/components/layout/AppSidebar.tsx (updated navigation)
- docs/features/{feature}/UI-REVIEW.md (visual audit report)
  </context>

<process>
## Pre-flight checks

1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Validate feature prerequisites:
   a. Confirm docs/features/{feature}/SPEC.md exists → BLOCK if missing.
   b. Confirm docs/features/{feature}/interfaces.md exists and has HTTP endpoints → BLOCK if missing.
   c. Load all available aspect files (operations, queries, states, events, STORIES, capabilities).
3. If --dry-run, output the plan and stop.

## Step 1 — Ensure UI Architecture

4. Check if docs/UI-ARCHITECTURE.md exists.
   - If missing → delegate to `domainspec-ui-architecture` skill (interactive questions, scaffolding, dependency install).
   - If exists → read it as the authoritative constitution.
5. Verify the web app builds: run build + type check. BLOCK if build fails.

## Step 2 — Generate UI-SPEC

6. Delegate to `domainspec-ui-phase-bridge {feature}`:
   - Reads SPEC.md, interfaces.md, operations.md, queries.md, states.md, STORIES.md
   - Constrained by UI-ARCHITECTURE.md
   - Produces docs/features/{feature}/UI-SPEC.md
7. Present UI-SPEC summary to user for review.
8. If --spec-only, stop here and return summary.

## Step 3 — Generate E2E Tests

9. Delegate to `domainspec-generate-tests --ui --scaffold {feature}`:
   - Derives E2E test obligations from UI-SPEC.md (rules 15–20)
   - Appends UI E2E section to TEST-SPEC.md
   - Scaffolds Playwright test files under {web-app}/e2e/{feature}/

## Step 4 — Implement Frontend

10. Delegate to `domainspec-ui-implement {feature}`:
    - Creates pages, components, hooks, mutations from UI-SPEC + UI-ARCHITECTURE
    - Updates navigation sidebar
    - Updates query-keys.ts
11. Run build + type check. If build fails, fix issues and retry (max 2 iterations).

## Step 5 — Visual Audit

12. If --skip-audit, skip to step 13.
13. Delegate to `domainspec-ui-audit-bridge {feature}`:
    - 6-pillar visual review (copywriting, visuals, color, typography, spacing, registry safety)
    - Produces docs/features/{feature}/UI-REVIEW.md
    - Maps findings to DomainSpec concept IDs

## Completion

14. Return pipeline summary: - Artifacts created/updated (file paths) - E2E test count (by category) - Build status (pass/fail) - Audit verdict (PASS/FLAG/BLOCK per pillar, or skipped) - Concept coverage (which SPEC concepts now have UI representation)
    </process>

<error-handling>
- Missing SPEC.md or interfaces.md → BLOCK with clear message naming the missing file.
- No HTTP endpoints in interfaces.md → BLOCK: "Feature has no HTTP endpoints. UI pipeline requires at least one."
- UI-ARCHITECTURE.md creation fails → BLOCK: cannot proceed without constitution.
- UI-SPEC generation fails → BLOCK at step 2, report which aspect files are missing.
- Build failure after implementation → attempt fix (max 2 retries), then FLAG with details.
- Audit BLOCK findings → report but do not revert implementation.
</error-handling>

<authority-rule>
- DomainSpec feature docs define what the UI must do (behavior).
- UI-ARCHITECTURE.md defines project conventions (constitution).
- UI-SPEC.md defines feature presentation (design contract).
- This skill orchestrates — it never overrides decisions made by delegate skills.
- When delegate skills ask interactive questions, those propagate to the user.
</authority-rule>
