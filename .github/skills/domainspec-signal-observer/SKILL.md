---
name: domainspec-signal-observer
description: Post-session observer that derives behavior-level governance signals from telemetry bundles and appends async-observer signals.
argument-hint: "--bundle <path> [--feature <feature-id>] [--mode new|evolution|audit]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Provide independent observation of execution sessions by reading telemetry bundles and emitting behavior-level signals with source=async-observer.
</objective>

<context>
Inputs:
- Telemetry bundle built by domainspec/tools/build-telemetry-bundle.ts
- domainspec/templates/SIGNAL-SCHEMA.md
- docs/signals/pipeline-signals.jsonl

This skill is non-blocking and runs after session completion as part of Step 11 in domainspec-pipeline.
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Load telemetry bundle (`--bundle`).
2. Validate expected telemetry fields exist (ordered events, changed files, test chronology).
3. Derive behavior-level signals:
   - rework from fail->fix->pass sequences.
   - pattern from useful cross-cutting hardening behavior.
   - governance-gap from scope drift patterns.
4. Emit signals with source="async-observer" to docs/signals/pipeline-signals.jsonl.
5. Re-run signal validation (`validate-signals`) to keep contract consistency.
6. Return signal counts by type and any recommended follow-up actions.
</process>

<authority-rule>
- This skill never modifies application source code or feature specs.
- It appends signals only.
- Blocking decisions are made by fast observer gates; this skill enriches the outer loop.
</authority-rule>
