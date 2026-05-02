---
name: domainspec-brownfield-translation
description: "Translate an already implemented project into DomainSpec as-is artifacts by auditing code and docs, asking gap-filling questions, and executing research-plan-execute translation waves."
argument-hint: "[scope|auto] [--audit-only] [--plan-only] [--execute] [--max-features <n>]"
agent: domainspec-interviewer
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions
---

<objective>
Convert an already implemented project into DomainSpec documentation that reflects current behavior as it exists today.

This skill is for brownfield adoption, not greenfield design. It captures what is real in code and docs, then records the gaps that block DomainSpec alignment.
</objective>

<when-to-use>
Use this skill when:
- code already exists and the team needs DomainSpec artifacts without rewriting behavior first
- documentation exists but is inconsistent, incomplete, or disconnected from implementation
- you need per-feature as-is specs before planning refactors or roadmap work
- you want governance and ontology gap visibility before enforcing DomainSpec workflows
</when-to-use>

<inputs>
Primary evidence sources:
- `README*`
- `docs/**`
- `research/**`
- `src/**`, `apps/**`, `backend/**`, `frontend/**`, `services/**`
- tests and fixtures that reveal expected behavior

DomainSpec references:

- `domainspec/CHANGELOG.md`
- `domainspec/ARCHITECTURE.md`
- `domainspec/TAXONOMY.md`
- `domainspec/RELATIONSHIPS.md`
- `domainspec/templates/SPEC.md`
- `domainspec/templates/domain.md`
- `domainspec/templates/operations.md`
- `domainspec/templates/states.md`
- `domainspec/templates/interfaces.md`
- `domainspec/templates/events.md`
- `domainspec/templates/queries.md`
- `domainspec/templates/workflows.md`
- `domainspec/templates/project-overview.md`
- `domainspec/templates/initial-definitions.md`
- `domainspec/templates/hypotheses.md`
- `domainspec/templates/experiment-candidates.md`
  </inputs>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
### Stage 1 - Research (always first)
1. Read DomainSpec references before repository inspection.
2. Perform brownfield evidence scan:
   - identify implemented features from routes, modules, bounded directories, tests, and existing docs
   - capture observed actors, workflows, rules, and integrations with path evidence
3. Build an as-is feature inventory with confidence labels:
   - `observed` (backed by code, tests, or docs)
   - `stated` (operator confirmed)
   - `hypothesized` (inference pending confirmation)
4. Ask targeted questions for missing intent or ambiguous behavior. Ask only what cannot be resolved from repository evidence.

### Stage 2 - Plan

5. Write translation plan artifact with wave ordering and dependencies:
   - Wave A: project baseline and feature inventory
   - Wave B: per-feature as-is spec generation
   - Wave C: cross-feature ontology normalization
   - Wave D: governance and alignment gap reporting
6. Stop after this stage when `--plan-only` is provided.

### Stage 3 - Execute Translation

7. Create or update project-level baseline artifacts:
   - `docs/PROJECT-OVERVIEW.md` (actual current state, not target state)
   - `docs/INITIAL-DEFINITIONS.md` (core vocabulary and bounded contexts)
   - `docs/HYPOTHESES.md` (explicit assumptions to validate)
   - `docs/EXPERIMENT-CANDIDATES.md` (validation experiments)
8. For each discovered feature, create DomainSpec as-is docs under `docs/features/{feature}/`:
   - `SPEC.md` plus relevant aspect docs (`domain.md`, `operations.md`, `states.md`, `interfaces.md`, `events.md`, `queries.md`, `workflows.md`)
   - document behavior exactly as implemented, including known inconsistencies and undocumented edge cases
   - tag every major claim as `observed`, `stated`, or `hypothesized`
9. Produce brownfield alignment artifacts:
   - `docs/BROWNFIELD-TRANSLATION-RESEARCH.md`
   - `docs/BROWNFIELD-TRANSLATION-PLAN.md`
   - `docs/GOVERNANCE-GAPS.md`
   - `docs/ONTOLOGY-GAPS.md`
   - `docs/BROWNFIELD-ALIGNMENT-BACKLOG.md` (prioritized remediation actions)
10. If `--audit-only` is provided, stop after Stage 1 and emit only research findings.

If the repository already uses a nonstandard docs layout, preserve it and place equivalent artifacts in that structure.
</process>

<gap-taxonomy>
Governance gaps include:
- missing decision records, unclear policy ownership, absent acceptance criteria, or weak traceability
- lifecycle breaks between spec, tests, implementation, and verification

Ontology gaps include:

- duplicate terms for the same concept
- one term overloaded with multiple meanings
- missing definitions for high-frequency concepts
- inconsistent concept relationships across features
  </gap-taxonomy>

<quality-bar>
- As-is first: do not rewrite behavior in docs to match a desired future state.
- Every feature spec must cite repository evidence for core claims.
- Unknowns must become explicit questions, not silent assumptions.
- Gaps must include severity, impact, and a concrete remediation path.
- Outputs must be usable by `domainspec-spec-feature`, `domainspec-generate-tests`, and `domainspec-verify-feature` without re-discovery.
</quality-bar>

<output-contract>
Return:

```markdown
## Brownfield Translation Summary

- Scope: <scope>
- Features discovered: <n>
- Features translated: <n>
- Interview questions asked: <n>
- Translation status: audit-only | plan-only | execute

### Artifacts

- Project overview: <path>
- Initial definitions: <path>
- Hypotheses: <path>
- Experiment candidates: <path>
- Research report: <path>
- Translation plan: <path>
- Governance gaps: <path>
- Ontology gaps: <path>
- Alignment backlog: <path>

### Feature Coverage

| Feature | Evidence status | Spec status | Notes |
| ------- | --------------- | ----------- | ----- |

### Highest-Risk Gaps

1. <gap>
2. <gap>

### Recommended Next Step

- <one concrete action>
```

</output-contract>

<examples>
- `/domainspec-brownfield-translation auto --execute`
- `/domainspec-brownfield-translation payments --plan-only`
- `/domainspec-brownfield-translation auto --audit-only`
</examples>
