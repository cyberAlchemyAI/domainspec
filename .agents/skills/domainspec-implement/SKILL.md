---
name: domainspec-implement
description: Implement feature code from DomainSpec docs and generated test specifications.
argument-hint: "<feature-name> [--strict] [--mode native|gsd-phase]"
agent: domainspec-implementer
allowed-tools: Read, Write, Bash, Glob, Grep, AskUserQuestion, Task
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
4a. When implementing work-pack tasks (`TASK-*`), run `domainspec-context-builder <feature> --task <task-id> --mode standard --strict --emit both` before code edits.
4b. Generate `docs/features/{feature}/work-pack/context/{task-id}-SCAFFOLD.md` from context artifacts by mapping obligations to:
	- function-first signatures,
	- layer boundaries (domain/application/infrastructure/interface),
	- concrete file/symbol targets,
	- verification obligations from `TEST-SPEC.md`.
4c. Treat this scaffold as the implementation source-of-truth for the active task; if architecture/spec references conflict, stop and request decision-gate resolution before coding.
4d. Run an implementation baseline interview gate before code edits:
	- Detect architecture-pack gaps (missing `lib/architecture/` and missing architecture baseline docs such as `architecture/ARCHITECTURE.md`).
	- Detect project decision gaps (missing `docs/PROJECT-DECISIONS.md` or no explicit architecture/data-layer decision for the feature).
	- Detect database baseline gaps (no declared database engine and no project-local database lib/module definition).
4e. If any baseline gap exists, run an interactive interview using AskUserQuestion and explain what each option entails:
	- Architecture pack option (default: **Use current architecture pack**; alternatives: bootstrap canonical DomainSpec pack, or custom pack path).
	- Whether persistent storage is required for this feature.
	- Database engine choice when persistence is required (Postgres default, MySQL/MariaDB, SQLite, MongoDB, other) with brief trade-offs.
	- Data access library choice for the selected engine (for example Drizzle, Prisma, TypeORM, Mongoose, native driver).
4f. Persist interview outcomes to `docs/PROJECT-DECISIONS.md` under an `Implementation Baseline Interview` section and scaffold missing baseline assets:
	- `lib/architecture/` (or project-equivalent) with selected architecture pack notes and layer boundaries.
	- `lib/database/` (or project-equivalent) with selected engine and adapter entrypoint.
	- If a blocker-level decision remains unresolved, stop and request `domainspec-decision-gate`.
5. In `gsd-phase` mode, delegate orchestration to GSD execution flow and normalize outputs back to DomainSpec traceability.
6. Implement code and tests in small verifiable increments.
7. Run `domainspec-tag-code <feature> --mode strict` after implementation changes.
8. Run automated checks and report failures with remediation.
9. In --strict mode, stop on first doc-code mismatch and request spec fix.
</process>
