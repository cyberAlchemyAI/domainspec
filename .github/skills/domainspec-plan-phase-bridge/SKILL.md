---
name: domainspec-plan-phase-bridge
description: Bridge DomainSpec feature planning to GSD phase planner while preserving DomainSpec semantic authority.
argument-hint: "<feature-name> [--mode native|gsd-phase]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Delegate planning orchestration to GSD when requested, then normalize output into a DomainSpec-traceable implementation plan.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
- .planning/** (when delegated artifacts exist)
- docs/features/{feature}/ALIGNMENT-REPORT.md (if present)
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md (if present)
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Resolve mode: `native` by default, `gsd-phase` when requested.
3. If the feature already has implementation files, run `domainspec-audit-alignment` and `domainspec-audit-layering`, then consolidate obligations into a single remediation backlog.
4. In `native`, produce DomainSpec plan directly.
5. In `gsd-phase`, run GSD plan-phase orchestration and collect PLAN artifacts.
6. Map each delegated task back to DomainSpec concept IDs and acceptance obligations, including both semantic and layering findings.
7. Return normalized plan with assumptions and risk notes.
</process>

<authority-rule>
- DomainSpec docs are semantic source of truth.
- GSD outputs are orchestration evidence and must not override DomainSpec rules.
</authority-rule>
