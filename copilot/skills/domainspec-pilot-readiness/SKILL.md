---
name: domainspec-pilot-readiness
description: Use when preparing a feature for pilot testing using DomainSpec-first discovery and updates, then syncing project docs and verification artifacts.
argument-hint: "<feature-name|--discover> [--mode native|gsd-phase]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, Task
---

<objective>
Prepare a feature for pilot testing through a deterministic sequence: research first, first plan second, interactive questions third, then spec/test updates and verification.
</objective>

<context>
Authoritative-first doc roots:
- domainspec/docs/features/{feature-name}/
- docs/features/{feature-name}/

Framework constraints:

- domainspec/CHANGELOG.md
- domainspec/TEST-PIPELINE.md
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
0a. Apply delegation tuning + tracking for all delegated stages in this command:
  - Use per-stage profile (`quick|standard|deep`) with lowest-cost viable default; avoid `xhigh` unless explicitly required.
  - On suspected-stuck after `high|xhigh`, retry once with reduced thinking and narrowed scope before final BLOCK.
  - Append one telemetry row per delegated stage to `docs/signals/delegation-tuning.jsonl` with profile, thinking budget, outcome, retries, and notes.
  - If telemetry append fails, continue but return FLAG details with remediation.
0. DomainSpec-first discovery
- If feature is unknown, discover candidates in `domainspec/docs/features/` first.
- Build initial gap map from DomainSpec source docs.

1. Research phase

- Run `domainspec-spec-writer` read-only audit for SPEC/story gaps.
- Run `domainspec-test-designer` read-only audit for test derivation gaps.
- Run `mars-researcher` read-only for operational risk and mitigations.
- Optionally run `domainspec-layering-auditor` for implemented features.

2. First plan phase

- Produce dependency-ordered plan with blockers vs non-blockers.
- Keep DomainSpec semantics authoritative.

3. Interactive questions phase (required, hard gate)

- Delegate to `domainspec-decision-gate {feature-name} --profile pilot` after research and first plan.
- Required artifact: `docs/features/{feature-name}/PILOT-DECISIONS.md`.
- Decision set must include at minimum: scope, visibility, policy, rounding, auth gate, dedupe gate, audit metadata, failure policy, decision model.
- If AskQuestions tooling is unavailable, run the same decision round in plain conversation and record choices in the artifact.
- If any blocker-level decision remains unresolved, return BLOCK and stop before spec/test updates.

4. Spec and test updates phase

- Update source first:
  - `domainspec/docs/features/{feature-name}/SPEC.md`
  - `domainspec/docs/features/{feature-name}/TEST-SPEC.md`
- Then sync project docs:
  - `docs/features/{feature-name}/SPEC.md`
  - `docs/features/{feature-name}/TEST-SPEC.md`
- Reference `PILOT-DECISIONS.md` in updated SPEC and TEST-SPEC sections so pilot policy provenance remains explicit.
- Ensure SPEC has `## User Stories` and `## Story Coverage Matrix`.
- Ensure TEST-SPEC has pilot must-pass subset, story-to-test mapping, execution checklist, blockers register, and evidence package.

5. Verification phase

- Run `npm run docs:index`.
- Run targeted must-pass tests when code changed.
- Run `domainspec-verifier` for PASS/FLAG/BLOCK verdict.
- Validate no semantic drift between DomainSpec source docs and project docs.
  </process>

<output-contract>
Always return:
1. Pilot readiness verdict: PASS, FLAG, or BLOCK.
2. Open blockers with status and required evidence.
3. Resolved decisions table.
4. Wave 1 must-pass test subset.
5. Dependency-ordered next actions.
</output-contract>
