---
name: domainspec-context-builder
description: Build a minimal, deterministic task context pack using selector-level retrieval, interested-data subsets, and strict relevance gates.
argument-hint: "<feature-name> [--task <TASK-ID|task-path>] [--mode lean|standard|deep] [--max-files <n>] [--strict] [--emit markdown|json|both] [--dry-run]"
agent: domainspec-context-builder
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, Task
---

<objective>
Produce an exact task-ready context bundle that maximizes relevance and minimizes reading/input overhead using selector-level evidence only.
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
3a. Build an obligation matrix from parsed task inputs:
   - `obligationId` -> required evidence source
   - required architecture/layer constraints
   - required code references (symbols or endpoint contracts)
4. Build seed context from explicit task links first (link-first retrieval).
4a. For every seed candidate, extract selectors before inclusion:
   - Markdown: section anchors / table IDs.
   - Code: symbol names + minimal line ranges.
   - Drop candidate if selector extraction fails.
5. Expand candidates using index-first retrieval only for uncovered obligations:
   - Prefer docs index artifacts (`feature-map`, `features-index`, `tag-index`) when available.
   - Expand only directly related docs and code paths.
   - Exclude any expanded file that does not close at least one uncovered obligation.
6. Build architecture context from `architecture/ARCHITECTURE.md` retrieval map and include only selector-level references needed by this task.
6a. Build relationship interested-data subset:
   - Parse `docs/features/{feature}/SPEC.md#feature-concept-graph` and collect unique edge labels.
   - Reference only that subset from `RELATIONSHIPS.md`, never the full relationship catalog.
7. Build composability context only when required by uncovered obligations:
   - Include relevant sections from `governance/tags/CODE-TAG-COMPOSABILITY-PATTERNS.md`.
   - Include only matching snippet files from `governance/tags/examples/composability/`.
8. Build code snippet context:
   - Prefer files listed in task `Reusable legacy Assets`.
   - Extract symbol-level snippets (declarations + key call sites), not whole files.
   - Enforce minimal excerpt windows (only lines needed to resolve the symbol contract).
9. Rank candidates and minimize payload:
   - Score with `score = (1 - signal)*0.45 + cost*0.30 + ambiguity*0.25`.
   - Keep top-N by mode (`lean`, `standard`, `deep`) and `--max-files` override.
9a. Enforce strict relevance gates (`--strict`, default ON):
   - Every selected item must include at least one selector.
   - Every selected item must map to at least one obligation ID.
   - Remove any item that is only "nice to know" and not obligation-linked.
   - Enforce noise ratio: `noiseRatio = unboundSelections / totalSelections <= 0.15`.
   - Enforce excerpt budgets by mode:
     - `lean`: <= 8 files, <= 140 total excerpt lines
     - `standard`: <= 14 files, <= 280 total excerpt lines
     - `deep`: <= 24 files, <= 520 total excerpt lines
10. Emit deterministic context artifacts with selector schema:
   - `docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.md`
   - `docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.index.json`
   - Index must include `selected[].selectors`, `selected[].obligationRefs`, and `interestedData` subsets.
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
- Obligation coverage: <percent>
- Noise ratio: <value>
- Output markdown: docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.md
- Output index: docs/features/{feature}/work-pack/context/{task-id}-CONTEXT.index.json
- Blockers: <count>

### Included Context

- <path> — <why included> — <selectors> — <obligationRefs>

### Excluded Candidates

- <path> — <why excluded>

### Interested Data Subsets

- relationships: <edge list derived from SPEC feature graph>

### Next Actions

1. <action>
2. <action>
```

</output-contract>
