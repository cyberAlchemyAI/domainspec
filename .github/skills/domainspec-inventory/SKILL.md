---
name: domainspec-inventory
description: "Inventorize (inventory) DomainSpec feature/task capabilities, command-agent routes, and telemetry contracts for reusable execution pipelines."
argument-hint: "<ingest|lookup|validate|backfill> <feature-name> [--task <TASK-ID|task-path>] [--scope capabilities|commands|agents|routes|telemetry|all] [--out <path>] [--dry-run]"
agent: domainspec-context-builder
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, Task
---

<objective>
Maintain a persistent, structured inventory for one DomainSpec feature/task so operators can reuse deterministic execution-pipeline building blocks without re-discovering capabilities every run.
</objective>

<context>
Primary inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/WORK-PACK.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/STORIES.md
- docs/features/{feature}/TEST-SPEC.md
- docs/features/{feature}/work-pack/tasks/*.md
- docs/features/{feature}/work-pack/context/*.md
- .github/skills/domainspec-*/SKILL.md
- .github/agents/*.agent.md
- docs/signals/DELEGATION-TUNING.md
- docs/signals/delegation-tuning.jsonl
- docs/signals/TERMINAL-GUARD.md
- docs/signals/terminal-guard.jsonl

Outputs (default):

- docs/features/{feature}/work-pack/context/inventory/INVENTORY-INDEX.md
- docs/features/{feature}/work-pack/context/inventory/{task-or-feature}-INVENTORY.md
  </context>

<principles>
1. Inventorize once, reuse many times.
2. Keep inventory structured with stable tables, not freeform notes.
3. Map every inventory row to stage, concept IDs, and evidence links.
4. Preserve telemetry pairing requirements in every route/instrumentation entry.
5. Prefer additive inventory updates; avoid deleting prior evidence history.
</principles>

<flags>
- ingest: create or refresh inventory artifacts from current feature/task docs.
- lookup: return matching inventory entries for requested scope.
- validate: check inventory completeness against work-pack, stage coverage, and telemetry contracts.
- backfill: rebuild inventory rows from existing telemetry/task artifacts when inventory files are missing.
- --task <TASK-ID|task-path>: scope extraction to one task.
- --scope capabilities|commands|agents|routes|telemetry|all: choose what to inventory.
- --out <path>: custom output path for the primary inventory file.
- --dry-run: show planned inventory rows and files without writing.
</flags>

<process>
0. Planner gate hard rollout (feature mutation):
   - If writing under docs/features/{feature}/work-pack/context/inventory/*, require planner preflight gate PASS in WORK-PACK.md.
   - If gate is not PASS, return BLOCK and request domainspec-plan-phase-bridge refresh.
1. Read domainspec/CHANGELOG.md and extract current framework constraints.
2. Resolve feature and optional task scope.
3. Build a source matrix from feature docs, work-pack tasks, skills, agents, and telemetry contracts.
4. Extract inventory dimensions:
   - capability inventory (capability -> concept IDs -> source docs)
   - command inventory (command -> stage -> expected artifacts -> source skill)
   - agent inventory (agent -> role -> stage bindings)
   - route inventory (route stage chain -> gate expectations -> retries/recovery)
   - telemetry inventory (required fields, started/terminal pairing, guard evidence, signal emission)
5. Generate or update index and detailed inventory files.
6. For validate mode, return gaps:
   - missing stage coverage rows
   - unpaired telemetry rows
   - command/agent references without source artifacts
   - missing concept-ID mappings for critical stages
7. For backfill mode, reconstruct inventory rows from existing docs/features/{feature}/work-pack/context/* plus telemetry ledgers.
8. Return summary with coverage percentages and blockers.
</process>

<output-contract>
Return:

```markdown
## Inventory Summary

- Mode: ingest | lookup | validate | backfill
- Feature: <feature>
- Task: <task-or-feature>
- Scope: capabilities | commands | agents | routes | telemetry | all
- Output index: docs/features/{feature}/work-pack/context/inventory/INVENTORY-INDEX.md
- Output detail: docs/features/{feature}/work-pack/context/inventory/{task-or-feature}-INVENTORY.md
- Coverage:
  - capabilities: <percent>
  - commands: <percent>
  - agents: <percent>
  - routes: <percent>
  - telemetry: <percent>
- Blockers: <count>

### Gaps

- <gap>

### Next Actions

1. <action>
2. <action>
```

</output-contract>
