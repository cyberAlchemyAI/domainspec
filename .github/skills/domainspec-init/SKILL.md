---
name: domainspec-init
description: Initialize DomainSpec docs structure and starter artifacts in a project.
argument-hint: "[feature-name] [--with-example]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Set up DomainSpec in a target project, enforce brownfield discovery prerequisites, bootstrap governance and project decisions baselines, and scaffold the first feature documentation skeleton.
</objective>

<context>
Use templates from domainspec/templates and starter files from domainspec/starter.
Also read domainspec/CHANGELOG.md to apply latest framework updates.
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Ensure docs, docs/features, docs/shared, docs/registry.md, and docs/glossary.md exist.
3. Detect brownfield indicators.
   - Treat the repository as brownfield when implementation directories such as `src/`, `apps/`, `backend/`, `frontend/`, or `services/` already exist.
4. Brownfield scope gate (hard gate).
   - If brownfield indicators are present and either `docs/PROJECT-OVERVIEW.md` or `docs/INITIAL-DEFINITIONS.md` is missing, return BLOCK.
   - Remediation command: `domainspec-start brownfield` (or `domainspec-start auto`) before continuing with init.
5. Ensure docs/shared/governance-baseline.md exists.
	- If missing, create it from domainspec/templates/governance-baseline.md.
	- Keep any existing domain-specific governance blueprint (for example, docs/shared/cash-game-management-governance.md) as a companion artifact.
6. Ensure `docs/PROJECT-DECISIONS.md` exists.
   - If missing, create it from `domainspec/templates/project-decisions.md`.
7. Create docs/features/{feature}/SPEC.md from template when feature name is provided.
8. If --with-example is set, copy payment-processing example into docs/features.
9. In the checklist, require markdown links for referenced concept/type/field names in authored docs and explicit decision references when blockers exist.
10. Output a short next-step checklist.
</process>
