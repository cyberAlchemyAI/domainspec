---
name: domainspec-implement
description: Implement feature code from DomainSpec docs and generated test specifications.
argument-hint: "<feature-name> [--strict]"
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
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md (required when feature already has implementation)
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. If feature code already exists, run `domainspec-audit-layering` and convert findings to explicit tasks before edits.
3. Build implementation task list from documented concepts and behaviors.
4. Implement code and tests in small verifiable increments.
5. Run automated checks and report failures with remediation.
6. In --strict mode, stop on first doc-code mismatch and request spec fix.
</process>
