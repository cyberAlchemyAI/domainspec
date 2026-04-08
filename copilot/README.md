# DomainSpec Copilot Agent Pack

This package provides reusable custom agents and commands for DomainSpec-driven development.

## What is included

### Agents
- domainspec-planner
- domainspec-spec-writer
- domainspec-registry-sync
- domainspec-test-designer
- domainspec-implementer
- domainspec-alignment-auditor
- domainspec-verifier
- domainspec-researcher

### Commands
- /domainspec-init
- /domainspec-spec-feature
- /domainspec-sync-registry
- /domainspec-generate-tests
- /domainspec-implement
- /domainspec-audit-alignment
- /domainspec-verify-feature
- /domainspec-help

## Workflow

1. /domainspec-init
2. /domainspec-spec-feature <feature>
3. /domainspec-sync-registry --all
4. /domainspec-generate-tests <feature>
5. /domainspec-implement <feature>
6. /domainspec-audit-alignment <feature>
7. /domainspec-verify-feature <feature>

## Installation

Use INSTALL.md for copy instructions into .github/agents and .github/skills.

During scripted install, choose a tools profile (`full`, `standard`, `minimal`, or `custom`) to control what installed DomainSpec agents are allowed to do.
