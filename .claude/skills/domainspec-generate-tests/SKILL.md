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
ENGINE-FIRST — the backend-domain block is generated deterministically; the LLM never authors it:
0. Run the deterministic engine for the backend-domain obligations + gaps:
     node tools/test-derivation-engine/dist/cli.js derive {feature} --out
   (dev: `npx tsx tools/test-derivation-engine/src/cli.ts derive {feature} --out`).
   This writes the fenced ENGINE-REGION of docs/features/{feature}/TEST-SPEC.engine.md
   (source completeness gate, coverage summary, harness/formal tier split, backend
   obligations with stable IDs, needs_formal/needs-harness gaps) plus the committed
   id-map. It is byte-stable and drift-checkable. You MUST NOT edit inside the fence.
1. Read domainspec/CHANGELOG.md for framework context only (the engine owns backend derivation in step 0).
2. Author ONLY LLM-owned sections OUTSIDE the fence: UI/E2E (Playwright) obligations, scaffolding, and the story→test map. Reference engine obligation IDs read-only; never redefine a backend obligation.
3. Surface, do not fabricate: where the engine reports needs_formal/coverage_gap, leave a visible gap (optionally an explicit advisory) — never silently author a backend test the engine refused to derive.
4. If --scaffold is set, scaffold backend stubs mapped to engine IDs + UI/E2E stubs (Playwright convention).
5. Verify the merge boundary fail-closed:
     node tools/test-derivation-engine/dist/cli.js check {feature}
   FRESH = engine region matches the docs AND no LLM row redefined an engine ID. On DRIFT, re-run step 0 / fix the LLM block; never hand-edit the fence.
6. Report missing formal sections that block complete derivation.

SCOPE: the engine replaces the BACKEND-DOMAIN test-spec slice only; UI/E2E + scaffolding remain LLM-authored. This is not a full LLM replacement.
</process>
