---
name: domainspec-generate-tests
description: Generate deterministic test specifications from DomainSpec artifacts. Supports backend unit/integration tests and Playwright E2E UI tests.
argument-hint: "<feature-name> [--scaffold] [--ui] [--all]"
agent: domainspec-test-designer
allowed-tools: Read, Write, Bash, Glob, Grep
---

<objective>
Derive a feature test catalogue from formal docs and optionally scaffold test files.
When --ui or --all is passed, also derive Playwright E2E test specifications from UI-SPEC.md and STORIES.md.
</objective>

<context>
Derivation rules:
- domainspec/CHANGELOG.md
- domainspec/TEST-PIPELINE.md (includes UI E2E test generation rules)

Feature inputs (backend):

- docs/features/{feature}/states.md
- docs/features/{feature}/operations.md
- docs/features/{feature}/interfaces.md
- docs/features/{feature}/events.md
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/STORIES.md (if present)
- docs/features/{feature}/capabilities/\*.md (if present)

Feature inputs (UI — when --ui or --all):

- docs/UI-ARCHITECTURE.md (routes, breakpoints, component lib)
- docs/features/{feature}/UI-SPEC.md (design contract)
- docs/features/{feature}/STORIES.md (user journeys for E2E)
- docs/features/{feature}/operations.md (validation rules for form tests)
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. BACKEND-DOMAIN block is ENGINE-GENERATED (deterministic; the LLM never authors it). Run:
     node tools/test-derivation-engine/dist/cli.js derive {feature} --out
   This writes the fenced ENGINE-REGION of docs/features/{feature}/TEST-SPEC.engine.md
   (source completeness gate, coverage summary, harness/formal tier split, backend
   obligations with stable IDs, needs_formal/needs-harness gaps) + the committed id-map.
   Do NOT edit inside the fence. Read domainspec/CHANGELOG.md for framework context only.
2. (Backend transitions / invalid-transitions / invariants / rules / calculations / postconditions / events / domain-model / policy-decisions are derived by the engine in step 1 — do not re-author them. Capability/story acceptance narrative stays LLM-authored, outside the fence.)
3. Keep the LLM-authored TEST-SPEC.md (capability/story narrative) OUTSIDE the engine fence; reference engine obligation IDs read-only; never redefine a backend obligation.
4. If --ui or --all is passed and UI-SPEC.md exists:
   a. Read docs/UI-ARCHITECTURE.md for route conventions and breakpoints.
   b. Read docs/features/{feature}/UI-SPEC.md for pages, forms, states, components.
   c. Derive UI E2E test obligations per TEST-PIPELINE.md rules 15-20:
      - Navigation tests (1 per route)
      - User journey tests (1 per story with UI steps)
      - Form validation tests (rules × forms)
      - State reflection tests (empty/loading/error per page)
      - Responsive layout tests (pages × breakpoints)
      - Accessibility tests (keyboard nav + ARIA per page)
   d. Append UI E2E section to docs/features/{feature}/TEST-SPEC.md.
5. If --scaffold is set, create test stubs:
   - Backend stubs under backend/src/ mapped to TEST-SPEC rows.
   - UI E2E stubs under {web-app}/e2e/{feature}/ following Playwright convention:
     - {feature}.navigation.spec.ts
     - {feature}.journey.spec.ts
     - {feature}.forms.spec.ts
     - {feature}.states.spec.ts
     - {feature}.responsive.spec.ts
6. Report missing formal sections that block complete derivation.
7. Verify the merge boundary fail-closed:
     node tools/test-derivation-engine/dist/cli.js check {feature}
   FRESH = engine region matches the docs AND no LLM/UI row redefined a backend engine ID. On DRIFT, re-run step 1 / fix the LLM block; never hand-edit the fence.

SCOPE: the engine replaces the BACKEND-DOMAIN test-spec slice only; UI/E2E (Playwright) + scaffolding remain LLM-authored. This is not a full LLM replacement.
</process>

<playwright-scaffold-template>
Generated Playwright test stubs follow this pattern:

```typescript
import { test, expect } from "@playwright/test";

/**
 * @source features/{feature}/UI-SPEC.md#{section}
 * @story {story-id}
 */
test.describe("{Feature} - {Test Category}", () => {
  test("{test description}", async ({ page }) => {
    // TODO: Implement — derived from {source-ref}
  });
});
```

A `playwright.config.ts` is generated at the E2E root if missing, using base URL and breakpoints from UI-ARCHITECTURE.md.
</playwright-scaffold-template>
