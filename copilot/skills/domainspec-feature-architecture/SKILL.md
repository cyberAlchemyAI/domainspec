---
name: domainspec-feature-architecture
description: Create or evolve a feature-level architecture companion document aligned to a DomainSpec feature specification.
argument-hint: "<feature-name> [--update]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Glob, Grep
---

<objective>
Produce a consumer-readable architecture document for one feature that explains the feature contracts, component responsibilities, flows, and guardrails without drifting into implementation-detail speculation.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/templates/architecture.md
- docs/features/{feature-name}/SPEC.md
- docs/features/{feature-name}/*.md
Target location:
- docs/features/{feature-name}/architecture.md
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read domainspec/templates/architecture.md.
3. Read `docs/features/{feature}/SPEC.md` plus the aspect files and capability docs it links.
4. Create or update `docs/features/{feature}/architecture.md` as the architecture companion to the current feature contracts.
5. Keep the document consumer-readable and docs-first:
   - explain architecture implied by the feature contracts,
   - link to authoritative aspect docs for source-of-truth details,
   - avoid claiming implementation completeness beyond what the specs define.
6. Validate cross-links, architecture-to-aspect references, and any mermaid examples or artifact tables.
7. Summarize what is now architecturally defined and what still needs explicit feature decisions.
</process>
