---
name: domainspec-implement
description: Implement feature code from DomainSpec docs and generated test specifications.
argument-hint: "<feature-name> [--strict] [--mode native|gsd-phase]"
agent: domainspec-implementer
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Build production code that matches the documented domain model and test obligations.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/STORIES.md (if present)
- docs/features/{feature}/capabilities/*.md (if present)
- docs/features/{feature}/*.md
- docs/features/{feature}/TEST-SPEC.md (if present)
- docs/features/{feature}/ALIGNMENT-REPORT.md (required when feature already has implementation)
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md (required when feature already has implementation)
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Resolve execution mode (`native` by default, `gsd-phase` when explicitly requested).
3. If feature code already exists, run `domainspec-audit-alignment` and `domainspec-audit-layering` as **parallel subagents**, then convert combined findings to explicit tasks before edits.
4. Build implementation task list from documented concepts and behaviors.
5. In `gsd-phase` mode, delegate orchestration to GSD execution flow and normalize outputs back to DomainSpec traceability.
6. Implement code and tests in small verifiable increments.
7. **Post-implementation infrastructure binding check:**
   a. For each repository port used by the feature, verify a real DB-backed adapter is bound in all production-path files (routes, entry point). Flag stub/in-memory repos as BLOCK.
   b. If the feature introduces or modifies database tables: ensure migration files exist (`drizzle-kit generate`), `migrate.ts` runner exists and is called on startup, and Dockerfile includes migration files.
   c. If the feature defines lifecycle operations (seed, bootstrap): verify they are wired into the app startup sequence before `app.listen()`.
   d. If any infrastructure binding gaps are found, fix them before proceeding.
8. **Cross-feature stub prohibition:**
   a. NEVER create stub/placeholder files in another feature's use-case or domain directory. If implementation requires a handler that belongs to feature B, stop and document the obligation instead of creating an empty function.
   b. If a cross-feature event consumer is needed (e.g., feature A emits event, feature B reacts), add a `## Deferred Obligations` entry to the consuming feature's SPEC.md with: source feature, event name, expected behavior, and the commit/PR that identified the need.
   c. If existing stubs are found in the feature's code during pre-implementation audit (step 3), treat them as implementation tasks — either implement fully with tests or delete and update docs.
9. Run automated checks and report failures with remediation.
10. In --strict mode, stop on first doc-code mismatch and request spec fix.
</process>
