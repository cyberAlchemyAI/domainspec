---
name: domainspec-audit-alignment
description: Audit implementation fidelity against DomainSpec and produce alignment report.
argument-hint: "<feature-name>"
agent: domainspec-alignment-auditor
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Measure and report how closely implementation matches domain documentation contracts.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/*.md
- related source and tests
Output:
- docs/features/{feature}/ALIGNMENT-REPORT.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Extract expected behaviors and contracts from docs.
3. Inspect implementation evidence in code and tests.
4. Classify each item as compliant, partial, missing, or extra.
5. Emit prioritized remediation actions.
</process>
