---
name: domainspec-spec-feature
description: Create or evolve a feature specification using DomainSpec templates and taxonomy.
argument-hint: "<feature-name> [--update]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Glob, Grep
---

<objective>
Produce complete and consistent DomainSpec documentation for one feature before implementation starts.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/TAXONOMY.md
- domainspec/RELATIONSHIPS.md
- domainspec/templates/*.md
Target location:
- docs/features/{feature-name}/
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Create or update SPEC.md and concept table.
3. Generate or update `architecture.md` as a required default companion artifact from `domainspec/templates/architecture.md`, unless an equivalent feature architecture document already exists and is being updated in place. Populate Architecture Intent, Source Contracts, the six required architecture views, dependency/interface rules, decision log, risks, design transport notes, and Gate Result from current DomainSpec contracts.
4. Generate `glossary.md` as a default companion artifact from `domainspec/templates/glossary.md`, distilling one definition for every feature concept.
5. Generate relevant aspect files from templates.
6. Ensure `SPEC.md` links to `architecture.md` and `glossary.md` when those artifacts exist.
7. Add formal rules, formulas, transitions, and invariants where applicable.
8. When introducing or changing gate-critical terms, sync canonical definitions first via `.github/skills/domainspec-definitions-governance/SKILL.md`.
9. Validate the feature architecture contract: source contracts present or discovery mode explicitly approved, all six views present, dependency/interface rules recorded, decision log populated or explicitly empty with reason, Gate Result includes status and reason, and architecture-to-aspect references resolve.
10. Summarize what is ready and what remains undefined.
</process>
