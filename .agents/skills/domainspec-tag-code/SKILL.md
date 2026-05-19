---
name: domainspec-tag-code
description: Apply DomainSpec source tags to implementation code after feature implementation and validate extract/validate/drift outcomes.
argument-hint: "<feature-name> [--include <comma-paths>] [--mode strict|warn] [--dry-run]"
agent: domainspec-code-tagger
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Tag implemented code symbols with canonical DomainSpec docstring YAML and verify tagging quality gates.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- governance/tags/CODE-TAG-SCHEMA.md
- governance/tags/CODE-TAG-REMEDIATION.md
- governance/tags/examples/code-tags/*.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/*.md
</context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Validate required feature docs exist and include concept registry entries.
3. Resolve target include paths:
   - Use `--include` when provided.
   - Otherwise default to `backend/src,apps/web/src`.
4. Add or update docstring YAML tags following `governance/tags/CODE-TAG-SCHEMA.md`.
5. If `--dry-run`, output planned files/symbols and stop.
6. Run extractor:
   - `pnpm dlx tsx governance/tags/tools/extract-code-tags.ts --include <include> --output governance/tags/code-tags.json --mode <mode>`
7. Run validator:
   - `pnpm dlx tsx governance/tags/tools/validate-code-tags.ts --input governance/tags/code-tags.json --waivers governance/tags/code-tag-waivers.yaml --features-root docs/features/{feature} --mode <mode>`
8. Run drift comparator:
   - `pnpm dlx tsx governance/tags/tools/compare-code-tag-drift.ts --input governance/tags/code-tags.json --features-root docs/features/{feature} --report governance/tags/CODE-TAG-DRIFT-REPORT.md --mode <mode>`
9. In `strict` mode, return BLOCK on critical/high validation failures or drift mismatches.
10. Return summary with tagged symbols, issue counts, and unresolved remediation items.
</process>

<output-contract>
Return:

```markdown
## DomainSpec Tagging Summary

- Feature: <feature>
- Include paths: <paths>
- Mode: strict | warn
- Tagged symbols: <count>
- Validation blockers: <count>
- Drift blockers: <count>
- Report: governance/tags/CODE-TAG-DRIFT-REPORT.md

### Next Actions

- <remediation or confirmation>
```

</output-contract>
