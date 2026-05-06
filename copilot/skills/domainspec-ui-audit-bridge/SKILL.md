---
name: domainspec-ui-audit-bridge
description: Bridge DomainSpec verification to GSD UI audit for retroactive 6-pillar visual review of implemented frontend code.
argument-hint: "<feature-name>"
agent: domainspec-ui-architect
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Conduct retroactive UI audit of an implemented feature's frontend by delegating to gsd-ui-auditor and mapping findings back to DomainSpec concepts.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/UI-ARCHITECTURE.md (constitution constraint)
- docs/features/{feature}/UI-SPEC.md (design contract baseline, if exists)
- docs/features/{feature}/SPEC.md (concept traceability)
- docs/features/{feature}/interfaces.md (expected endpoints)
- {web-app}/src/pages/** (implemented pages)
- {web-app}/src/components/{feature}/** (implemented components)

Output:

- docs/features/{feature}/UI-REVIEW.md (scored audit report)
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
1a. Apply delegation tuning + tracking to delegated audit stage (`gsd-ui-auditor`):
   - Use lowest-cost viable profile (`quick|standard|deep`) and avoid `xhigh` unless explicitly required.
   - On suspected-stuck after `high|xhigh`, retry once with reduced thinking and narrowed scope before final BLOCK.
   - Append one telemetry row per delegated stage to `docs/signals/delegation-tuning.jsonl` with profile, thinking budget, outcome, retries, and notes.
   - If telemetry append fails, continue but return FLAG details with remediation.
2. Read docs/UI-ARCHITECTURE.md and docs/features/{feature}/UI-SPEC.md (if exists).
3. Locate implemented frontend files for the feature.
4. Delegate to gsd-ui-auditor subagent with:
   - Implemented file paths
   - UI-SPEC.md as audit baseline (or abstract standards if missing)
   - UI-ARCHITECTURE.md as constitution constraint
5. Receive scored UI-REVIEW.md from auditor (6 pillars: Copywriting, Visuals, Color, Typography, Spacing, Registry Safety).
6. Map each finding to DomainSpec concept IDs from SPEC.md.
7. Classify findings as BLOCK / FLAG / PASS per DomainSpec verification convention.
8. Write docs/features/{feature}/UI-REVIEW.md.
9. Return summary with top 3 priority fixes and concept traceability.
</process>

<authority-rule>
- UI-ARCHITECTURE.md is the constitution — deviations are findings.
- UI-SPEC.md (if exists) is the feature-level contract — deviations are findings.
- DomainSpec behavior requirements override visual preferences.
</authority-rule>
