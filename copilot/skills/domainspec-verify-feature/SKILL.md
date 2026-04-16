---
name: domainspec-verify-feature
description: Verify feature readiness from specs, tests, implementation, and alignment results.
argument-hint: "<feature-name>"
agent: domainspec-verifier
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Return PASS, FLAG, or BLOCK for a feature based on evidence, not assumptions.
</objective>

<context>
Inputs include:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/STORIES.md (if present)
- docs/features/{feature}/capabilities/*.md (if present)
- docs/features/{feature}/TEST-SPEC.md
- docs/features/{feature}/ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-PLAN.md
- automated test outputs
- delegated evidence artifacts when present:
	- .planning/phases/**/**-PLAN.md
	- .planning/phases/**/**-SUMMARY.md
	- .planning/phases/**/VERIFICATION.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Validate artifact completeness and structural quality, including capability-driven SPEC layout and `## Stories` link behavior.
3. Validate automated verification evidence.
4. When delegated evidence exists, validate consistency between GSD verification outputs and DomainSpec acceptance obligations.
5. Validate unresolved semantic and layering drift with risk level, including missing capability backlinks in aspect docs.
6. **Production Readiness gate** — when feature has backend implementation:
   a. **Repository binding**: every domain port must have a real adapter bound in production-path code. Stub/in-memory repos in route files or entry point → BLOCK.
   b. **Migration completeness**: if schema.ts defines tables for this feature, `drizzle/` must contain migration files, `migrate.ts` must exist, CI must run migrations before tests, and app entry point must call `runMigrations()` before accepting traffic.
   c. **Lifecycle hooks**: if operations.md defines seed/bootstrap operations, verify they are implemented and wired into startup (before `app.listen()`).
   d. **Dockerfile**: if migrations exist, verify the Dockerfile copies `drizzle/` into the runtime image.
7. **Cross-feature obligation check:**
   a. Scan the feature's use-case and domain directories for stub files (empty functions, TODO markers, `// Stub` comments). Any stub → BLOCK.
   b. Check SPEC.md for a `## Deferred Obligations` section. If obligations exist and are not yet implemented, flag each with severity based on age and business impact.
   c. Check dependent features' `events.md` for events this feature should consume. Verify handlers exist and are not stubs.
   d. Scan for dead code: deprecated files, imports from non-existent modules. Flag as HIGH.
8. Return verdict with required next actions.
</process>
