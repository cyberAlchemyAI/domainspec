---
name: domainspec-audit-alignment
description: Audit implementation fidelity against DomainSpec and produce alignment report.
argument-hint: "<feature-name>"
agent: domainspec-alignment-auditor
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Measure and report how closely implementation matches domain documentation contracts.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/*.md
- docs/features/{feature}/capabilities/*.md (if present)
- related source and tests
- delegated execution evidence when present:
	- .planning/phases/**/**-PLAN.md
	- .planning/phases/**/**-SUMMARY.md
	- .planning/phases/**/VERIFICATION.md
Output:
- docs/features/{feature}/ALIGNMENT-REPORT.md
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Extract expected behaviors and contracts from docs.
3. Inspect implementation evidence in code and tests.
4. Classify each item as compliant, partial, missing, or extra.
4a. **Test obligation coverage gate (MANDATORY):**
   a. Parse `docs/features/{feature}/TEST-SPEC.md` `## Test Catalogue` and build the expected obligation ID set (for example `KGV1-*`).
   b. Build implemented-evidence ID set by scanning executable test sources and automated test outputs for obligation IDs in test names (`KGV1-[A-Z0-9-]+`).
   c. For each expected ID, verify at least one executable test or deterministic evidence row references that exact ID.
   d. Emit coverage summary with counts and lists: expected IDs, covered IDs, uncovered IDs, orphan IDs.
   e. Severity policy:
      - Any uncovered ID in `V1 Pipeline Must-Pass Subset` (`P0`) -> **BLOCK**.
      - Any uncovered non-`P0` ID -> **FLAG**.
      - **PASS** only when uncovered IDs = 0.
   f. Never treat aggregate command pass counts alone as sufficient obligation coverage evidence.
5. **Infrastructure Binding audit** — for each feature with implementation:
   a. Identify all repository/gateway ports defined in domain layer (types, interfaces).
   b. For each port, verify a real (DB-backed) adapter exists in `infrastructure/repositories/`.
   c. Scan production-path wiring (route files, entry points) for stub/in-memory/mock bindings. Flag any non-test file that imports or instantiates a stub repo as **BLOCK**.
   d. If `infrastructure/database/schema.ts` defines tables for this feature:
      - Verify migration files exist in `drizzle/` (generated via `drizzle-kit generate`).
      - Verify `infrastructure/database/migrate.ts` exists and is called from the app entry point.
      - Verify CI workflow includes a migration step before tests.
   e. If `operations.md` or `interfaces.md` defines lifecycle hooks (seed, bootstrap):
      - Verify the hook is implemented and wired into the app startup sequence.
6. **Cross-feature stub and dead code scan:**
   a. Search all use-case and domain directories for the feature for files containing stub markers: empty function bodies, `TODO` comments, `// Stub` comments, or underscore-prefixed unused parameters (e.g., `_event`). Flag each as BLOCK with remediation: implement fully or delete.
   b. Search for deprecated files: files with `@deprecated` JSDoc tags, imports from non-existent modules, or references to non-existent schema tables. Flag as HIGH with remediation: delete dead code.
   c. Cross-reference `events.md` "Consumed by" tables: for each declared consumer, verify the consuming handler exists and is wired (not a stub). Flag missing handlers as BLOCK.
   d. Cross-reference other features' `events.md` for events this feature should consume (check SPEC.md dependencies): verify handlers exist. Flag missing as HIGH.
7. Enforce verdict floor from obligation coverage gate before finalizing report.
8. Emit prioritized remediation actions.
</process>
