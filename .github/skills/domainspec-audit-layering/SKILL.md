---
name: domainspec-audit-layering
description: Audit domain layering drift and produce deterministic migration plan tied to DomainSpec concepts.
argument-hint: "<feature-name> [--mode native|gsd-phase]"
agent: domainspec-layering-auditor
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Ensure business/domain behavior lives in domain layers and not in use-case orchestration code.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
- backend/src/domain/**
- backend/src/use-cases/**
Outputs:
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-PLAN.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Build concept-to-code map from SPEC and aspect docs.
3. Identify misplaced domain behavior in use-cases.
4. Classify each item as critical, high, medium, or low.
5. Produce dependency-ordered migration tasks with explicit file targets.
6. Include verification commands for unit, integration, and docs checks.
</process>

<authority-rule>
- DomainSpec docs remain semantic source of truth.
- Migration plans must reference concept IDs from SPEC.md.
</authority-rule>
