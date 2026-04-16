# DomainSpec Copilot Agent Pack

This package provides reusable custom agents and commands for DomainSpec-driven development.

## What is included

### Agents

| Agent                        | Role                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| domainspec-planner           | Builds executable plans with context search heuristic and GSD delegation            |
| domainspec-spec-writer       | Authors capability-driven specs with context search heuristic and story enforcement |
| domainspec-researcher        | Navigates DomainSpec artifacts with structured output contract                      |
| domainspec-implementer       | Implements from specs with audit gates and GSD execution delegation                 |
| domainspec-test-designer     | Derives test specifications from formal aspect docs                                 |
| domainspec-alignment-auditor | Audits implementation fidelity against domain docs                                  |
| domainspec-layering-auditor  | Detects domain-logic drift into application layers                                  |
| domainspec-verifier          | PASS/FLAG/BLOCK readiness verdict                                                   |
| domainspec-registry-sync     | Syncs global registry and glossary from SPEC concept tables                         |
| domainspec-story-sync        | Maintains STORIES.md aligned with capability and aspect changes                     |

### Context Search Heuristic

The spec-writer and planner agents use a weighted heuristic to choose the most efficient context discovery path before acting:

```
score = (1 - signal) × 0.45 + cost × 0.30 + ambiguity × 0.25
```

Four strategies are evaluated: `links-tags-first`, `broad-search-first`, `focused-researcher-first`, and `capability-graph-first`. A pre-filter shortcut skips scoring entirely when SPEC frontmatter `includes` and `dependencies` resolve the full file graph.

Validated by `tools/context-search-heuristic.test.mjs` (9 scenarios, 100% accuracy).

### Commands

- /domainspec-pipeline (full lifecycle — plan → spec → stories → tests → implement → UI → verify)
- /domainspec-init
- /domainspec-spec-feature
- /domainspec-sync-user-stories
- /domainspec-sync-registry
- /domainspec-generate-tests
- /domainspec-implement
- /domainspec-ui-pipeline
- /domainspec-audit-alignment
- /domainspec-verify-feature
- /domainspec-help

## Workflow

One command runs the entire pipeline:

```
@domainspec-planner domainspec-pipeline <feature>
```

Or run each stage individually:

1. /domainspec-init
2. /domainspec-spec-feature <feature>
3. /domainspec-sync-user-stories <feature>
4. /domainspec-generate-tests <feature>
5. /domainspec-implement <feature>
6. /domainspec-ui-pipeline <feature>
7. /domainspec-verify-feature <feature>

## Installation

Use INSTALL.md for copy instructions into .github/agents and .github/skills.

During scripted install, choose a tools profile (`full`, `standard`, `minimal`, or `custom`) to control what installed DomainSpec agents are allowed to do.
