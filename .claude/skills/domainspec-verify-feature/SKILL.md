---
name: domainspec-verify-feature
description: Verify feature readiness from specs, tests, implementation, and alignment results.
argument-hint: "<feature-name>"
agent: domainspec-verifier
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Return PASS, FLAG, or BLOCK for a feature based on evidence, not assumptions.
</objective>

<context>
Inputs include:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/discovery/<slug>.md (any discovery file under the `discovery/` subfolder; when present, cited in coverage)
- docs/features/{feature}/TEST-SPEC.md
- docs/features/{feature}/ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-PLAN.md
- automated test outputs
- delegated evidence artifacts when present:
	- .planning/phases/**/**-PLAN.md
	- .planning/phases/**/**-SUMMARY.md
	- .planning/phases/**/VERIFICATION.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Validate artifact completeness and structural quality. Discovery is part of artifact coverage:
   - If any discovery exists under `docs/features/{feature}/discovery/` (glob `*.md`) → coverage includes it; the verification report references each discovery path under "Artifacts inspected".
   - If SPEC frontmatter has `discovery_waived: true` → coverage still PASSes when other criteria pass, but the report calls out the waiver explicitly with this line: `⚠️ Discovery was waived (reason: <discovery_waiver_reason>). Audit signal preserved.`
   - If neither a discovery file nor a `discovery_waived: true` waiver exists → flag as a soft coverage gap (`⚠️ Discovery missing and no waiver on SPEC frontmatter`); do NOT auto-fail the verdict on this signal alone.
3. Validate automated verification evidence.
4. When delegated evidence exists, validate consistency between GSD verification outputs and DomainSpec acceptance obligations.
5. Validate unresolved semantic and layering drift with risk level.
6. Return verdict with required next actions. The verdict (PASS / FLAG / BLOCK) is not changed by discovery state alone — discovery is reported as an audit signal, never as the sole blocker.
</process>
