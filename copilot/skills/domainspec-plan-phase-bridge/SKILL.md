---
name: domainspec-plan-phase-bridge
description: Bridge DomainSpec feature planning to GSD phase planner while preserving DomainSpec semantic authority.
argument-hint: "<feature-name> [--mode native|gsd-phase]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Delegate planning orchestration to GSD when requested, then normalize output into a DomainSpec-traceable implementation plan.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
- .planning/** (when delegated artifacts exist)
- docs/features/{feature}/ALIGNMENT-REPORT.md (if present)
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md (if present)
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
1a. Apply delegation tuning + tracking for all delegated stages in this bridge:
   - Use per-stage profile (`quick|standard|deep`) with lowest-cost viable default; avoid `xhigh` unless explicitly required.
   - On suspected-stuck after `high|xhigh`, retry once with reduced thinking and narrowed scope before final BLOCK.
   - Append one telemetry row per delegated stage to `docs/signals/delegation-tuning.jsonl` with profile, thinking budget, outcome, retries, and notes.
   - If telemetry append fails, continue but return FLAG details with remediation.
2. Resolve mode: `native` by default, `gsd-phase` when requested.
3. If the feature already has implementation files, run `domainspec-audit-alignment` and `domainspec-audit-layering` as **parallel subagents**, then consolidate obligations into a single remediation backlog.
4. Ensure `docs/features/{feature}/WORK-PACK.md` exists and is the planning manifest entrypoint.
5. Enforce mandatory first wave `W0` for architecture and governance baseline.
6. Enforce `Pipeline Stage Coverage` matrix in `WORK-PACK.md` with all canonical stages (`plan`, `architecture-baseline`, `spec`, `stories`, `tests`, `backend-implement`, `ui-pipeline`, `observability-spec`, `instrument-otel`, `otel-verify`, `infra-deploy`, `registry-sync`, `verify-readiness`, `verify-feature`, `audit-alignment`, `audit-layering`) plus wave mapping and status per row.
7. Enforce mandatory closure task seeding in medium/high work-packs:
   - one verification task (`domainspec-verify-feature`)
   - one alignment audit task (`domainspec-audit-alignment`)
   - one layering audit task (`domainspec-audit-layering`)
8. Enforce `Architecture-Guided Task Directives` in `WORK-PACK.md` for medium/high scope:
   - one row per mutation-capable task
   - exact DomainSpec coverage IDs (concept/rule/calculation/workflow/query/endpoint IDs)
   - architecture references to `domainspec/ARCHITECTURE.md` and, when applicable, `docs/UI-ARCHITECTURE.md` and `docs/INFRA-ARCHITECTURE.md`
   - imperative implementation instructions with explicit layer placement
   - verification evidence targets (tests, audits, commands)
   - when `ui-pipeline` is not skipped, include `UI-SPEC.md` and UI architecture linkage
9. Enforce work-pack concept-token coverage cycle when task files exist:
   - Run `pnpm dlx tsx tools/validate-work-pack-coverage.ts --mode strict --feature {feature} --require-all-concepts`.
   - Auto-fill deterministic ownership by appending missing concept tokens to the only matching task source row.
   - For ambiguous ownership, ask the user to pick the target task and update coverage IDs accordingly.
   - Re-run until PASS; BLOCK if unresolved ownership questions remain.
10. In `native`, produce DomainSpec plan directly.
11. In `gsd-phase`, run GSD plan-phase orchestration and collect PLAN artifacts.
12. Map each delegated task back to DomainSpec concept IDs and acceptance obligations, including both semantic and layering findings.
13. Return normalized plan with assumptions and risk notes, including W0, stage-coverage, and directive-matrix references.
</process>

<authority-rule>
- DomainSpec docs are semantic source of truth.
- GSD outputs are orchestration evidence and must not override DomainSpec rules.
- W0 architecture baseline, full stage coverage, and seeded verification/alignment/layering closure tasks are mandatory planning outputs for medium/high scope.
- Architecture-guided task directives with exact coverage IDs and architecture links are mandatory planning outputs for medium/high scope.
- Full concept-token ownership coverage in work-pack task `DomainSpec Coverage` rows is mandatory once task files exist.
</authority-rule>
