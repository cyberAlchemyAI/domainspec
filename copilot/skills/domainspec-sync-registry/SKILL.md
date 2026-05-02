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

- docs/features/\*/SPEC.md

Targets:

- docs/registry.md
- docs/glossary.md
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Parse concept tables from selected feature or all features.
3. Update registry sections by meta-type.
4. Update concept graph edges and detect duplicates.
5. Propose or add glossary entries for new terms.
6. Emit drift warnings and sync summary.
</process>
