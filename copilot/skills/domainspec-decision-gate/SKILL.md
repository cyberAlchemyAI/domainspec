---
name: domainspec-decision-gate
description: Resolve and persist unresolved multi-option decisions before planning or document mutation.
argument-hint: "<feature-name> [--profile pilot|pipeline|generic]"
agent: domainspec-planner
allowed-tools: Read, Write, Glob, Grep, AskQuestions, Task
---

<objective>
Force explicit user decisions for every blocker-level multi-option choice and persist a reusable decision artifact.
</objective>

<context>
Framework constraints:
- domainspec/CHANGELOG.md

Feature inputs:

- docs/features/{feature-name}/SPEC.md
- docs/features/{feature-name}/interfaces.md
- docs/features/{feature-name}/operations.md
- docs/features/{feature-name}/states.md
- docs/features/{feature-name}/PILOT-ROADMAP.md (if present)
- docs/features/{feature-name}/STORIES.md (if present)

Output artifact:

- default and pipeline profile: `docs/features/{feature-name}/DECISIONS.md`
- pilot profile: `docs/features/{feature-name}/PILOT-DECISIONS.md`
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read `domainspec/CHANGELOG.md` and active feature documents.
2. Enumerate every unresolved decision with more than one viable option.
3. Prepare concrete options with concise trade-offs for each decision.
4. Ask the user each decision:
   - Preferred: AskQuestions tool.
   - Fallback: plain conversation with numbered options if AskQuestions is unavailable.
5. Continue until all blocker-level decisions are resolved.
6. If any blocker-level decision is unresolved, return BLOCK and stop.
7. Write the decision artifact with a table containing:
   - decision
   - considered options
   - selected option
   - rationale
   - source (AskQuestions or chat fallback)
   - timestamp
8. Return decision-gate summary with resolved decisions and remaining blockers.
</process>

<required-pilot-decisions>
When `--profile pilot` is used, capture at minimum:
- scope
- visibility
- policy strictness
- rounding
- auth gate
- dedupe gate
- audit metadata
- failure policy
- decision model
- verification command substitution
</required-pilot-decisions>

<authority-rule>
No SPEC, TEST-SPEC, or implementation mutation may proceed while this skill returns BLOCK.
</authority-rule>
