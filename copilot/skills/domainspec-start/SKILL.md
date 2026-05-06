---
name: domainspec-start
description: Unified DomainSpec startpoint. Detect greenfield or brownfield scope, run discovery, enforce brownfield scope gates, initialize docs baseline, and persist project decisions before feature pipelines.
argument-hint: "[greenfield|brownfield|auto] [project-or-feature-scope] [--audit-only] [--no-init]"
agent: domainspec-interviewer
allowed-tools: Read, Write, Glob, Grep, AskQuestions, Task
---

<objective>
Create a stable project baseline before `domainspec-init`, `domainspec-spec-feature`, or `domainspec-pipeline` mutate feature artifacts.
</objective>

<context>
Read first:
- `domainspec/CHANGELOG.md`
- `domainspec/ARCHITECTURE.md`
- `domainspec/TAXONOMY.md`
- `domainspec/RELATIONSHIPS.md`

Uses:

- `.github/skills/domainspec-interview-scope/SKILL.md`
- `.github/skills/domainspec-init/SKILL.md`
- `domainspec/templates/project-overview.md`
- `domainspec/templates/initial-definitions.md`
- `domainspec/templates/project-decisions.md`
- `domainspec/templates/hypotheses.md`
- `domainspec/templates/experiment-candidates.md`
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read framework references and detect mode (`greenfield`, `brownfield`, `auto`).
1a. Apply delegation tuning + tracking for delegated stages in this command (`domainspec-interview-scope`, optional `domainspec-init`):
   - Use lowest-cost viable profile (`quick|standard|deep`) and avoid `xhigh` unless explicitly required.
   - On suspected-stuck after `high|xhigh`, retry once with reduced thinking and narrowed scope before final BLOCK.
   - Append one telemetry entry per delegated stage to `docs/signals/delegation-tuning.jsonl` including profile, thinking budget, outcome, retries, and notes.
   - If telemetry append fails, continue but return FLAG details with remediation.
2. Delegate scoped discovery to `domainspec-interview-scope`.
   - `auto` must inspect the repository and choose mode.
   - If `--audit-only`, stop after discovery and gate verdict.
3. Enforce startpoint artifacts:
   - `docs/PROJECT-OVERVIEW.md`
   - `docs/INITIAL-DEFINITIONS.md`
   - `docs/PROJECT-DECISIONS.md`
   - `docs/HYPOTHESES.md`
   - `docs/EXPERIMENT-CANDIDATES.md`
4. Build project decisions baseline:
   - If `docs/PROJECT-DECISIONS.md` is missing, create it from `domainspec/templates/project-decisions.md`.
   - Capture at minimum: scope boundary, initial delivery slice, source-of-truth policy (docs vs code), migration strictness, and verification baseline command.
   - Persist unresolved blockers with `status: blocked`.
5. Brownfield scope gates (hard gate for `brownfield` or `auto` resolving to brownfield):
   - Gate A - Evidence coverage: at least one observed evidence source per in-scope context.
   - Gate B - Boundary clarity: explicit in-scope and out-of-scope contexts documented.
   - Gate C - Decision closure: no blocker-level decision left unresolved in `docs/PROJECT-DECISIONS.md`.
   - If any gate fails, return BLOCK and stop before init/pipeline guidance.
6. If `--no-init` is not set, delegate to `domainspec-init` after gates pass.
7. Return startpoint summary with mode, gate results, artifacts, and next recommended command.
</process>

<output-contract>
Return:

```markdown
## DomainSpec Startpoint Summary

- Mode selected: greenfield | brownfield
- Gate verdict: PASS | BLOCK
- Init status: skipped | completed
- Decision blockers: <count>

### Artifacts

- Project overview: <path>
- Initial definitions: <path>
- Project decisions: <path>
- Hypotheses: <path>
- Experiment candidates: <path>

### Brownfield Scope Gates

| Gate | Verdict | Notes |
| ---- | ------- | ----- |

### Recommended Next Command

- <exact command with arguments>
```

</output-contract>

<authority-rule>
- For brownfield scope, no feature-level pipeline (`domainspec-pipeline`) should run while startpoint gate verdict is BLOCK.
- `docs/PROJECT-DECISIONS.md` is the project-level authority for unresolved multi-option decisions before feature execution.
</authority-rule>

<examples>
- `/domainspec-start auto`
- `/domainspec-start brownfield payments and settlements`
- `/domainspec-start greenfield pricing experiments --no-init`
- `/domainspec-start auto --audit-only`
</examples>
