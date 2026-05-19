---
name: domainspec-feature-glossary
description: Create or evolve a per-feature glossary that distills definitions for every feature concept.
argument-hint: "<feature-name> [--update]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Glob, Grep
---

<objective>
Produce `docs/features/{feature-name}/glossary.md` as the concise human-readable vocabulary layer for the feature: plain-language feature terms first, formal concept definitions second.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/templates/glossary.md
- docs/features/{feature-name}/SPEC.md
- docs/features/{feature-name}/*.md
Target location:
- docs/features/{feature-name}/glossary.md
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read domainspec/templates/glossary.md.
3. Read `docs/features/{feature}/SPEC.md` and extract the Concept Registry table.
4. Read aspect docs linked by the Concept Registry and any aspect-level concept registries, including UI concept registries when present.
5. Create or update `docs/features/{feature}/glossary.md` with a `Feature Language` section for important embedded words that readers need before formal concepts make sense:
   - explain terms like "baseline", "gate", "revision", "variant", or feature-specific equivalents,
   - define what the term means in this feature,
   - link each plain-language term to related formal concepts.
6. Add one formal concept row per declared concept:
   - term,
   - namespaced concept ID,
   - DomainSpec meta-type,
   - one-sentence domain definition that teaches the term rather than restating the concept table,
   - source link to the authoritative aspect anchor.
7. Include cross-feature terms only when the feature depends on external concepts or shared definitions.
8. Keep definitions explanatory but non-normative; if a definition needs new behavior, update the source aspect doc first.
9. Ensure `SPEC.md` links to `glossary.md` when the glossary artifact exists.
10. Validate cross-links, concept ID naming, duplicate terms, missing definitions, and stale source anchors.
11. Summarize glossary coverage and any undefined terms that require source-doc decisions.
</process>
