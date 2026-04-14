---
name: domainspec-implement
description: Implement feature code from DomainSpec docs and generated test specifications.
argument-hint: "<feature-name> [--strict] [--mode native|gsd-phase]"
agent: domainspec-implementer
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Build production code that matches the documented domain model and test obligations.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
- docs/features/{feature}/TEST-SPEC.md (if present)
- docs/features/{feature}/ALIGNMENT-REPORT.md (required when feature already has implementation)
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md (required when feature already has implementation)
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Resolve execution mode (`native` by default, `gsd-phase` when explicitly requested).
3. If feature code already exists, run `domainspec-audit-alignment` and `domainspec-audit-layering`, then convert combined findings to explicit tasks before edits.
4. Build implementation task list from documented concepts and behaviors.
5. In `gsd-phase` mode, delegate orchestration to GSD execution flow and normalize outputs back to DomainSpec traceability.
6. Implement code and tests in small verifiable increments.
7. Run automated checks and report failures with remediation.
8. In --strict mode, stop on first doc-code mismatch and request spec fix.
</process>
