---
name: domainspec-execute-phase-bridge
description: Bridge DomainSpec implementation execution to GSD phase execution while preserving DomainSpec behavior contracts.
argument-hint: "<feature-name> [--mode native|gsd-phase] [--strict]"
agent: domainspec-implementer
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Execute DomainSpec implementation in native or delegated mode and keep clause-level traceability for tests and acceptance checks.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
- docs/features/{feature}/TEST-SPEC.md (if present)
- .planning/phases/** (delegated evidence)
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Resolve mode: `native` by default, `gsd-phase` when requested.
3. Build execution task list from DomainSpec clauses.
4. In `gsd-phase`, run delegated execution flow and collect SUMMARY artifacts.
5. Verify each code-producing task has automated verification evidence.
6. In `--strict`, stop on doc-code mismatch and request corrective action.
7. Return implementation summary with concept traceability.
</process>

<authority-rule>
- DomainSpec behavior contracts are authoritative.
- Delegated orchestration does not change acceptance semantics.
</authority-rule>
