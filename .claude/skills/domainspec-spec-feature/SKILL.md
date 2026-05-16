---
name: domainspec-spec-feature
description: Create or evolve a feature specification using DomainSpec templates and taxonomy.
argument-hint: "<feature-name> [--update]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Glob, Grep
---

<objective>
Produce complete and consistent DomainSpec documentation for one feature before implementation starts.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/TAXONOMY.md
- domainspec/RELATIONSHIPS.md
- domainspec/templates/*.md
Target location:
- docs/features/{feature-name}/
</context>

<process>
0. **Discovery-existence precondition (soft gate).** Before any spec-authoring step:
   1. Determine the feature slug from the invocation context (the `<feature-name>` argument, path, or briefing).
   2. Parse skill arguments for `--skip-discovery`. If present, the next non-flag token (or the value after `=`) is the one-line waiver reason; capture it as `discovery_waiver_reason`. If `--skip-discovery` is absent, treat the gate as armed.
   3. Search for an existing discovery at BOTH:
      - `vault/discovery/<topic>-definitions/<slug>.md` (knowledge scope)
      - `docs/features/<feature>/discovery/<slug>.md` (application scope)
   4. If found → proceed to existing logic (step 1 below).
   5. If MISSING AND `--skip-discovery` was passed:
      - Proceed to existing logic, AND ensure the resulting SPEC.md frontmatter includes `discovery_waived: true` plus `discovery_waiver_reason: "<one-line reason supplied by user>"`. (The spec-writer agent applies the writeback during SPEC.md creation/update.)
   6. If MISSING AND no flag → HALT with a recommendation block (NOT a hard refuse). The exact wording must include:
      - "No discovery exists for <feature>."
      - Pointer: "Write the discovery first via `.claude/skills/custom/discovery-writing.md`."
      - Override: "Or pass `--skip-discovery` (with a one-line waiver reason) to proceed without one."
      - Bounce option: "Or invoke `domainspec-interviewer` for help classifying scope (knowledge → vault, application → feature folder)."
      - Wait for user response. Do NOT proceed until user resolves.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Create or update SPEC.md and concept table.
3. Generate or update `architecture.md` as a required default companion artifact from `domainspec/templates/architecture.md`, unless an equivalent feature architecture document already exists and is being updated in place. Populate Architecture Intent, Source Contracts, the six required architecture views, dependency/interface rules, decision log, risks, design transport notes, and Gate Result from current DomainSpec contracts.
4. Generate `glossary.md` as a default companion artifact from `domainspec/templates/glossary.md`, distilling one definition for every feature concept.
5. Generate relevant aspect files from templates.
6. Ensure `SPEC.md` links to `architecture.md` and `glossary.md` when those artifacts exist.
7. Add formal rules, formulas, transitions, and invariants where applicable.
8. Validate the feature architecture contract: source contracts present or discovery mode explicitly approved, all six views present, dependency/interface rules recorded, decision log populated or explicitly empty with reason, Gate Result includes status and reason, and architecture-to-aspect references resolve.
9. Summarize what is ready and what remains undefined.
</process>
