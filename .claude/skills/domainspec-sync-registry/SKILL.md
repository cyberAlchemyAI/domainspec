---
name: domainspec-sync-registry
description: Sync global registry and glossary from feature SPEC concept tables.
argument-hint: "[feature-name] [--all]"
agent: domainspec-registry-sync
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Align docs/registry.md and docs/glossary.md with feature-level source-of-truth concepts.
</objective>

<context>
Framework updates:
- domainspec/CHANGELOG.md

Source of truth:
- docs/features/*/SPEC.md

Targets:

- docs/registry.md
- docs/glossary.md
  </context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Parse concept tables from selected feature or all features.
3. Update registry sections by meta-type.
4. Update concept graph edges and detect duplicates.
5. Propose or add glossary entries for new terms.
6. Emit drift warnings and sync summary.
</process>
