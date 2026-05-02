---
name: domainspec-definitions-governance
description: "DomainSpec-specific profile of definitions governance. For cross-project MARS usage, prefer mars-research-definitions-governance."
argument-hint: "[--add DS-*] [--update DS-*] [--sync] [--audit]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Keep DomainSpec definitions authoritative, interpretable, and traceable.

Use this skill when you need to add or revise gate-critical terms, formulas, notation, or definition families, and when downstream docs must stay aligned with canonical definitions.
</objective>

<context>
Canonical authority:
- `research/projects/domainspec/definitions/DEFINITIONS.md`

Lookup/index layer:

- `research/projects/domainspec/definitions/DEFINITIONS-INDEX.md`

Condensed narrative artifact:

- `research/projects/domainspec/papers/domainspec-paper.md`

Downstream consumers and checks:

- `research/projects/domainspec/protocols/DOMAINSPEC-PROTOCOL-CHECKLIST.md`
- `research/projects/domainspec/registry/TRACEABILITY-MATRIX.md`
- `research/projects/domainspec/PROJECT.yaml`
- `research/projects/domainspec/README.md`
  </context>

<authority-model>
1. `DEFINITIONS.md` is normative.
2. `DEFINITIONS-INDEX.md` is discovery and traceability support.
3. Paper text is condensed synthesis and must not redefine normative semantics.
</authority-model>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read the canonical definitions and index first.
2. Add or update DS-* entries with stable IDs and precise normative wording.
3. For any mathematical construct, keep this minimum package together:
   - formal expression,
   - variable/notation meaning,
   - operational interpretation.
4. Keep intuition inline, directly under each affected DS-* definition section, as non-normative explanatory guidance.
5. If a global synthesis section exists, keep it consistent with the inline intuition blocks.
6. Sync `DEFINITIONS-INDEX.md` so each DS-* anchor is discoverable and mapped to relevant artifacts.
7. Audit downstream drift:
   - protocol anchors,
   - traceability matrix definition references,
   - paper wording conflicts.
8. Emit explicit remediation items for undefined, ambiguous, or conflicting terms.
9. Validate structure with:
   - `./tools/check_research_structure.sh`
</process>

<quality-bar>
- No new gate-critical term is normative unless it exists in `DEFINITIONS.md`.
- No formula without explicit symbol meaning and plain-language intent.
- Inline intuition is colocated with each updated DS-* section (no detached explanation only).
- Plain-language intuition must not contradict formal semantics.
- DS IDs are unique, stable, and referenced consistently.
- Drift findings include exact file targets for remediation.
</quality-bar>

<output-contract>
Return a concise maintenance summary:

```markdown
## Definitions Governance Summary

- Definitions updated: <list DS-IDs>
- Index synced: yes/no
- Paper drift found: yes/no
- Protocol anchor gaps: <count>
- Traceability gaps: <count>
- Validation: pass/fail

### Follow-ups

1. <action>
2. <action>
```

</output-contract>
