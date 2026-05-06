---
name: domainspec-execute-phase-bridge
description: Bridge DomainSpec implementation execution to GSD phase execution while preserving DomainSpec behavior contracts.
argument-hint: "<feature-name> [--mode native|gsd-phase] [--strict]"
agent: domainspec-implementer
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Execute DomainSpec implementation in native or delegated mode and keep clause-level traceability for tests and acceptance checks.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
- docs/features/{feature}/TEST-SPEC.md (if present)
- .planning/phases/** (delegated evidence)
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
1a. Apply delegation tuning + tracking for delegated execution stages in `gsd-phase` mode:
   - Use per-stage profile (`quick|standard|deep`) with lowest-cost viable default; avoid `xhigh` unless explicitly required.
   - On suspected-stuck after `high|xhigh`, retry once with reduced thinking and narrowed scope before final BLOCK.
   - Append one telemetry row per delegated stage to `docs/signals/delegation-tuning.jsonl` with profile, thinking budget, outcome, retries, and notes.
   - If telemetry append fails, continue but return FLAG details with remediation.
2. Resolve mode: `native` by default, `gsd-phase` when requested.
3. Build execution task list from DomainSpec clauses.
4. In `gsd-phase`, run delegated execution flow and collect SUMMARY artifacts.
5. Verify each code-producing task has automated verification evidence.
6. In `--strict`, stop on doc-code mismatch and request corrective action.
7. Return implementation summary with concept traceability.
</process>

<authority-rule>
- DomainSpec behavior contracts are authoritative.
- Delegated orchestration does not change acceptance semantics.
</authority-rule>
