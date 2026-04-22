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

3. Interactive questions phase (required)
- Ask focused decision questions only after research and first plan.
- Capture at minimum: scope, visibility, policy, rounding, auth gate, dedupe gate, audit metadata, failure policy, decision model.

4. Spec and test updates phase
- Update source first:
  - `domainspec/docs/features/{feature-name}/SPEC.md`
  - `domainspec/docs/features/{feature-name}/TEST-SPEC.md`
- Then sync project docs:
  - `docs/features/{feature-name}/SPEC.md`
  - `docs/features/{feature-name}/TEST-SPEC.md`
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
