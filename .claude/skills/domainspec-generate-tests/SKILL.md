---
name: domainspec-generate-tests
description: Generate deterministic test specifications from DomainSpec artifacts.
argument-hint: "<feature-name> [--scaffold]"
agent: domainspec-test-designer
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Derive a feature test catalogue from formal docs and optionally scaffold test files.
</objective>

<context>
Derivation rules:
- domainspec/CHANGELOG.md
- domainspec/TEST-PIPELINE.md

Feature inputs:

- docs/features/{feature}/states.md
- docs/features/{feature}/operations.md
- docs/features/{feature}/interfaces.md
- docs/features/{feature}/events.md
  </context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Extract transitions, invalid transitions, invariants, rules, calculations, postconditions, and event obligations.
3. Create docs/features/{feature}/TEST-SPEC.md with traceable source references.
4. If --scaffold is set, create test stubs mapped to TEST-SPEC rows.
5. Report missing formal sections that block complete derivation.
</process>
