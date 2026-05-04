---
name: domainspec-readiness-gate
description: Unified readiness gate with profile-based verification (`pilot`, `release-candidate`, `production`) and compatibility with `domainspec-pilot-readiness`.
argument-hint: "<feature-name> [--profile pilot|release-candidate|production] [--mode native|gsd-phase]"
agent: domainspec-verifier
allowed-tools: Read, Write, Bash, Glob, Grep, AskUserQuestion, Task
---

<objective>
Provide one profile-driven readiness command while preserving pilot-readiness compatibility.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/WORK-PACK.md (when present)
- docs/features/{feature}/DECISIONS.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/TEST-SPEC.md
- docs/features/{feature}/ALIGNMENT-REPORT.md (if present)
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md (if present)
</context>

<process>
1. Read `domainspec/CHANGELOG.md` and feature readiness artifacts.
2. Resolve profile:
   - default: `pilot`
   - supported: `pilot`, `release-candidate`, `production`
3. Planner gate check (for mutation-capable readiness updates):
   - if feature complexity is medium/high or `WORK-PACK.md` exists, require planner gate PASS from work-pack manifest.
   - if planner gate is missing/stale, return BLOCK and request planner preflight.
4. Run profile-specific readiness behavior:
   - `pilot`: delegate to `domainspec-pilot-readiness <feature> [--mode ...]`.
   - `release-candidate`: run `domainspec-verify-feature <feature>` and enforce that blocker-level decisions are resolved and must-pass evidence is present.
   - `production`: run `domainspec-verify-feature <feature>` and enforce release-candidate conditions plus observability and infrastructure evidence completeness.
5. Return unified readiness verdict with profile context.
</process>

<output-contract>
Return:

```markdown
## Readiness Gate Verdict

- Feature: <feature>
- Profile: pilot | release-candidate | production
- Verdict: PASS | FLAG | BLOCK
- Blocking gaps: <list>
- Required next actions: <ordered list>
```

</output-contract>

<compatibility>
- `domainspec-pilot-readiness` remains callable.
- This command is the generalized profile-driven entrypoint.
</compatibility>
