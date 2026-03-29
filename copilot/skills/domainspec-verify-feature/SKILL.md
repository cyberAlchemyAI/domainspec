---
name: domainspec-verify-feature
description: Verify feature readiness from specs, tests, implementation, and alignment results.
argument-hint: "<feature-name>"
agent: domainspec-verifier
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Return PASS, FLAG, or BLOCK for a feature based on evidence, not assumptions.
</objective>

<context>
Inputs include:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/TEST-SPEC.md
- docs/features/{feature}/ALIGNMENT-REPORT.md
- automated test outputs
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Validate artifact completeness and structural quality.
3. Validate automated verification evidence.
4. Validate unresolved drift and risk level.
5. Return verdict with required next actions.
</process>
