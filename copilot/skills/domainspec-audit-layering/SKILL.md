---
name: domainspec-audit-layering
description: Audit domain layering drift and produce deterministic migration plan tied to DomainSpec concepts.
argument-hint: "<feature-name>"
agent: domainspec-layering-auditor
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Ensure business/domain behavior lives in domain layers and not in use-case orchestration code.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/*.md
- related source and tests
Outputs:
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-PLAN.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Build concept-to-code map from feature docs.
3. Identify misplaced domain behavior in use-cases.
4. Emit prioritized remediation plan.
</process>
