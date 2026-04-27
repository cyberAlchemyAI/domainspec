---
name: domainspec-help
description: Show DomainSpec command reference, unified startpoint workflow, and recommended next step.
argument-hint: "[command-name]"
agent: domainspec-planner
allowed-tools: Read, Glob
---

<objective>
Provide a concise command guide and the right next command for current project state.
</objective>

<context>
Read command definitions under domainspec/copilot/skills/, package docs under domainspec/copilot/, and framework updates in domainspec/CHANGELOG.md.
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. List available domainspec-* commands and one-line purpose, with `domainspec-start` as the default first command.
3. If a command-name is provided, show detailed usage and prerequisites.
4. Recommend next command based on detected docs and feature readiness.
	- If `docs/PROJECT-OVERVIEW.md`, `docs/INITIAL-DEFINITIONS.md`, or `docs/PROJECT-DECISIONS.md` is missing, recommend `domainspec-start`.
	- If baseline exists but docs scaffolding is incomplete, recommend `domainspec-init`.
	- If baseline and scaffolding exist, recommend `domainspec-pipeline <feature>` or the specific stage command requested.
</process>
