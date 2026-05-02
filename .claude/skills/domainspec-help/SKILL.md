---
name: domainspec-help
description: Show DomainSpec command reference, workflow, and recommended next step.
argument-hint: "[command-name]"
agent: domainspec-planner
allowed-tools: Read, Glob
---

<objective>
Provide a concise command guide and the right next command for current project state.
</objective>

<context>
Read command definitions under domainspec/claude/skills/, package docs under domainspec/claude/, and framework updates in domainspec/CHANGELOG.md.
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. List available domainspec-* commands and one-line purpose.
3. If a command-name is provided, show detailed usage and prerequisites.
4. Recommend next command based on detected docs and feature readiness.
</process>
