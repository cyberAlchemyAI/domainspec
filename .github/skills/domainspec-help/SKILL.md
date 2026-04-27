---
name: domainspec-help
description: Show DomainSpec command reference, orchestrator-first workflow, and recommended next step.
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
2. List available domainspec-* commands and one-line purpose, with `domainspec-orchestrate` as the default user-facing first command. Mark direct specialist commands as advanced/internal direct paths.
3. If a command-name is provided, show detailed usage and prerequisites.
4. Recommend next command based on detected docs and feature readiness.
	- If `docs/PROJECT-OVERVIEW.md`, `docs/INITIAL-DEFINITIONS.md`, or `docs/PROJECT-DECISIONS.md` is missing, recommend `domainspec-orchestrate "start DomainSpec for this repository"` and include `domainspec-start` as the advanced direct equivalent.
	- If baseline exists but docs scaffolding is incomplete, recommend `domainspec-orchestrate "initialize DomainSpec docs scaffold"` and include `domainspec-init` as the advanced direct equivalent.
	- If baseline and scaffolding exist, recommend `domainspec-orchestrate "run pipeline for <feature>"` and include `domainspec-pipeline <feature>` (or the specific stage command requested) as the advanced direct equivalent.
</process>
