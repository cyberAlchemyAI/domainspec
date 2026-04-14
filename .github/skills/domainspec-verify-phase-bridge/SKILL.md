---
name: domainspec-verify-phase-bridge
description: Bridge delegated GSD verification artifacts into DomainSpec PASS FLAG BLOCK readiness decisions.
argument-hint: "<feature-name>"
agent: domainspec-verifier
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Normalize delegated evidence and produce a DomainSpec-owned readiness verdict.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/TEST-SPEC.md
- docs/features/{feature}/ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-PLAN.md
- .planning/phases/**/**-PLAN.md
- .planning/phases/**/**-SUMMARY.md
- .planning/phases/**/VERIFICATION.md
- automated test outputs
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Load DomainSpec acceptance obligations.
3. Load delegated evidence and normalize it to DomainSpec verification fields.
4. Detect unresolved semantic mismatches, layering drift, and missing evidence.
5. Return PASS, FLAG, or BLOCK with required next actions.
</process>

<authority-rule>
- Final verdict remains DomainSpec-owned even in delegated mode.
</authority-rule>
