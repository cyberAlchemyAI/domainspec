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
3. Generate relevant aspect files from templates.
4. Add formal rules, formulas, transitions, and invariants where applicable.
5. Validate cross-links, referenced field-name links, and concept ID naming.
6. If `docs/features/{feature}/WORK-PACK.md` and `work-pack/tasks/*.md` exist, run strict token coverage validation:
   - `pnpm dlx tsx tools/validate-work-pack-coverage.ts --mode strict --feature {feature} --require-all-concepts`
7. Resolve missing token ownership automatically when deterministic:
   - If exactly one task `DomainSpec Coverage` source row matches the concept source aspect, append token to that task `Coverage IDs`.
8. If ownership is ambiguous (no candidate or multiple candidates), ask the user to choose target task via selectable question and apply the answer.
9. Re-run validation until PASS or BLOCK on unresolved ownership questions.
10. Summarize what is ready and what remains undefined.
</process>
