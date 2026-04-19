---
name: domainspec-init
description: Initialize DomainSpec docs structure and starter artifacts in a project.
argument-hint: "[feature-name] [--with-example]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Set up DomainSpec in a target project, bootstrap a governance baseline, and scaffold the first feature documentation skeleton.
</objective>

<context>
Use templates from domainspec/templates and starter files from domainspec/starter.
Also read domainspec/CHANGELOG.md to apply latest framework updates.
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Ensure docs, docs/features, docs/shared, docs/registry.md, and docs/glossary.md exist.
3. Ensure docs/shared/governance-baseline.md exists.
	- If missing, create it from domainspec/templates/governance-baseline.md.
	- Keep any existing domain-specific governance blueprint (for example, docs/shared/cash-game-management-governance.md) as a companion artifact.
4. Create docs/features/{feature}/SPEC.md from template when feature name is provided.
5. If --with-example is set, copy payment-processing example into docs/features.
6. In the checklist, require markdown links for referenced concept/type/field names in authored docs.
7. Output a short next-step checklist.
</process>
