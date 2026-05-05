---
name: domainspec-context-builder
description: Build a minimal, deterministic context pack for a feature task using links, indexes, architecture references, composability patterns, and targeted code snippets.
argument-hint: "<feature-name> [--task <TASK-ID|task-path>] [--mode lean|standard|deep] [--max-files <n>] [--emit markdown|json|both] [--dry-run]"
agent: domainspec-context-builder
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, Task
---

<objective>
Produce an exact task-ready context bundle that maximizes relevance and minimizes reading/input overhead.
</objective>

<context>
Primary inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/WORK-PACK.md
- docs/features/{feature}/work-pack/tasks/*.md
- architecture/ARCHITECTURE.md
- architecture/ARCHITECTURE-PATTERN-LIBRARY.md
- architecture/pattern-library/**/*.md
- governance/tags/CODE-TAG-COMPOSABILITY-PATTERNS.md
- governance/tags/examples/composability/*

Optional indexing inputs (when present):

- docs/index/feature-map.md
- docs/index/features-index.json
- docs/index/tag-index.json
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command writes `docs/features/{feature}/work-pack/context/*`, require planner preflight gate.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Resolve target task:
   - Use `--task` when provided (TASK-ID or explicit task file path).
   - Else ask the user to select one task file from `docs/features/{feature}/work-pack/tasks/*.md`.
3. Parse task inputs from the selected file:
   - DomainSpec Coverage links and IDs
   - Architecture References
   - Implementation Directives
   - Reusable legacy Assets
   - Completion Criteria and Verification Evidence
4. Build the seed context set from explicit links in task docs first (link-first retrieval).
5. Expand candidates using index-first retrieval:
   - Prefer docs index artifacts (`feature-map`, `features-index`, `tag-index`) when available.
   - Expand only directly related docs and code paths.
6. Build architecture context from `architecture/ARCHITECTURE.md` retrieval map and include only referenced sub-docs needed by this task.
7. Build composability context:
   - Include relevant sections from `governance/tags/CODE-TAG-COMPOSABILITY-PATTERNS.md`.
   - Include only matching snippet files from `governance/tags/examples/composability/`.
8. Build code snippet context:
   - Prefer files listed in task `Reusable legacy Assets`.
   - Extract symbol-level snippets (declarations + key call sites), not whole files.
9. Rank candidates and minimize payload:
   - Score with `score = (1 - signal)*0.45 + cost*0.30 + ambiguity*0.25`.
   - Keep top-N by mode (`lean`, `standard`, `deep`) and `--max-files` override.
10. Emit deterministic context artifacts:
   - `docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.md`
   - `docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.index.json`
11. If `--dry-run`, return planned context file list/snippets only and do not write artifacts.
12. Return unresolved gaps as explicit blockers with proposed remediation links.
</process>

<output-contract>
Return:

```markdown
## Context Pack Summary

- Feature: <feature>
- Task: <task-id-or-path>
- Mode: lean | standard | deep
- Files selected: <count>
- Snippets selected: <count>
- Output markdown: docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.md
- Output index: docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.index.json
- Blockers: <count>

### Included Context

- <path> — <why included>

### Excluded Candidates

- <path> — <why excluded>

### Next Actions

1. <action>
2. <action>
```

</output-contract>
