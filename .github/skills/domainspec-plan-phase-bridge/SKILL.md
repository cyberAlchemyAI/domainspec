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
2. Resolve mode: `native` by default, `gsd-phase` when requested.
3. If the feature already has implementation files, run `domainspec-audit-alignment` and `domainspec-audit-layering` as **parallel subagents**, then consolidate obligations into a single remediation backlog.
4. Ensure `docs/features/{feature}/WORK-PACK.md` exists and is the planning manifest entrypoint.
5. Enforce mandatory first wave `W0` for architecture and governance baseline:
   - Ensure `work-pack/waves/W0.md` exists.
   - Capture architecture constraints from `domainspec/ARCHITECTURE.md` plus `docs/UI-ARCHITECTURE.md` and `docs/INFRA-ARCHITECTURE.md` when present.
   - Require explicit W0 exit gate covering dependency-direction and boundary checks.
6. Enforce `Pipeline Stage Coverage` matrix in `WORK-PACK.md` with all canonical stages (`plan`, `architecture-baseline`, `spec`, `stories`, `tests`, `backend-implement`, `ui-pipeline`, `observability-spec`, `instrument-otel`, `otel-verify`, `infra-deploy`, `registry-sync`, `verify-readiness`, `verify-feature`, `audit-alignment`, `audit-layering`) plus wave mapping and status per row.
7. Enforce closure seeding strategy in medium/high work-packs:
    - Always seed one verification task (`domainspec-verify-feature`).
    - If at least one mutation-capable stage is planned and not skipped (`backend-implement`, `ui-pipeline`, `instrument-otel`, `infra-deploy`), also seed:
       - one alignment audit task (`domainspec-audit-alignment`)
       - one layering audit task (`domainspec-audit-layering`)
    - If all mutation-capable stages are skipped (docs-only/non-mutation slice), do not seed alignment/layering audit tasks.
    - For docs-only/non-mutation slices, require `WORK-PACK.md` to include `Governance Signal Obligations` covering:
       - `alignment-gap`: quality signal when contract drift is detected.
       - `governance-gap`: signal with explicit layering-boundary evidence.
8. In `native`, produce DomainSpec plan directly.
9. In `gsd-phase`, run GSD plan-phase orchestration and collect PLAN artifacts.
10. Map each delegated task back to DomainSpec concept IDs and acceptance obligations, including both semantic and layering findings.
11. Return normalized plan with assumptions and risk notes, including W0 and stage-coverage references.
</process>

<authority-rule>
- DomainSpec docs are semantic source of truth.
- GSD outputs are orchestration evidence and must not override DomainSpec rules.
- W0 architecture baseline and full stage coverage are mandatory planning outputs.
- Seeded verification closure task is mandatory for medium/high scope.
- Alignment/layering closure tasks are mandatory only when mutation-capable stages are planned and not skipped.
- For docs-only/non-mutation slices, alignment/layering governance signal obligations are mandatory.
</authority-rule>
