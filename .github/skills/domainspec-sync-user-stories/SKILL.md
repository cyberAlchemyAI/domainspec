---
name: domainspec-sync-user-stories
description: Generate and refresh story-driven STORIES files from DomainSpec aspect docs whenever feature documentation is updated.
argument-hint: "<feature-name> [--changed-files ...]"
agent: domainspec-story-sync
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions
---

<objective>
Keep `docs/features/{feature}/STORIES.md` understandable through deterministic user stories that mirror vertical slices and concept coverage.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/STORIES.md (if present)
- docs/features/{feature}/*.md
- docs/index/features-index.json (optional discovery)

Output:

- Updated capability-scoped stories and coverage matrix in `docs/features/{feature}/STORIES.md`
- Updated `## Stories` link section in `docs/features/{feature}/SPEC.md` when missing
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Load feature SPEC, STORIES (or create it), and all referenced aspect files.
3. Ask focused clarification questions when actor, outcome, or acceptance behavior is ambiguous.
4. Build capability-scoped stories in both formats:
   - Classic: As a <actor>, I want <goal>, so that <outcome>.
   - BDD: Given/When/Then scenario.
5. Enforce mandatory slice coverage:
   - Public journey
   - Admin/operations journey
   - Cross-feature integration journey
   - Error/edge-case journey
6. Add acceptance checks and explicit links to concept IDs and aspect anchors, plus link-back to capability sections in SPEC.
7. Refresh the capability-scoped Story Coverage Matrix and flag unmapped concepts.
8. Ensure SPEC includes a `## Stories` section linking to STORIES.md.
9. Return unresolved questions and drift warnings.
</process>
