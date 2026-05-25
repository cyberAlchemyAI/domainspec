---
name: domainspec-structure-gate
description: Run DomainSpec Gate 0 and Gate 1 in order for a feature or vault root.
argument-hint: "<feature-name> [--vault-root vault] [--strict]"
agent: domainspec-verifier
allowed-tools: Read, Bash, Glob, Grep
---

<objective>
Run the structural gate (`tower-explorer`) before the categorical gate (`categorical-tooling-guard`) and report one combined verdict.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- vault/
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/TEST-SPEC.md (when present)
- internal_tools/README.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and confirm current framework constraints.
2. Run Gate 0 first:
   - `tower-explorer certify-origin <vault-root>`
   - if Gate 0 returns a blocking verdict, stop and report BLOCK.
3. Run Gate 1 second:
   - `categorical-tooling-guard docs/features/{feature}`
   - include `--require-lean` only when the caller explicitly asks for Lean-backed enforcement.
4. Return a combined verdict with both tool outputs summarized.
5. If `--strict` is implied by the request, treat any Gate 0 or Gate 1 flag as non-pass guidance and call out the exact remediation.
</process>

<output-contract>
Return:

```markdown
## Structure Gate Verdict

- Feature: <feature>
- Gate 0: PASS | FLAG | BLOCK
- Gate 1: PASS | FLAG | BLOCK
- Overall: PASS | FLAG | BLOCK
- Required next actions: <ordered list>
```
</output-contract>
