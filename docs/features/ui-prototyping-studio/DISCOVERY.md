---
id: ui-prototyping-studio-discovery
feature: ui-prototyping-studio
title: "UI Prototyping Studio Discovery"
summary: Discovery baseline for a DomainSpec-native prototyping workflow with design-system reuse, element comments, comment-to-task automation, and iterative agent patching.
status: draft
owners:
  - web-core
updatedAt: 2026-05-07
references:
  - ../knowledge-graph-visualization/UI-MOCKUP.md
  - ../knowledge-graph-visualization/WHITEBOARD-PROTOTYPE.html
  - ../../UI-ARCHITECTURE.md
---

# UI Prototyping Studio - Discovery

## 1. Problem

Current UI prototyping in this project is effective but manual and conversationally heavy:

- prompt -> prototype -> user feedback -> manual edits
- no native element comment capture with structured issue lifecycle
- no automatic conversion from visual comments to DomainSpec tasks
- no formal bridge from prototype iteration to UI-SPEC and implementation workflow

The target is a DomainSpec-native tool where a user can:

1. describe an idea,
2. receive a working prototype,
3. click elements and leave comments,
4. have comments converted into tasks,
5. run an agent loop that applies changes,
6. converge into formal UI-SPEC + implementation flow.

## 2. Desired Outcome

A reusable interface inside DomainSpec that supports:

- HTML-first rapid prototyping mode,
- design-system-aware component reuse,
- annotation and feedback capture on prototype elements,
- deterministic comment-to-task generation,
- iterative patch and review loop,
- handoff into DomainSpec UI pipeline artifacts.

## 3. What Already Exists In This Repository

### 3.1 Existing DomainSpec tooling we can reuse

- [domainspec-ui-architecture skill](../../../../../.github/skills/domainspec-ui-architecture/SKILL.md): project UI constitution and stack decisions.
- [domainspec-ui-phase-bridge skill](../../../../../.github/skills/domainspec-ui-phase-bridge/SKILL.md): derive UI-SPEC from feature docs.
- [domainspec-ui-implement skill](../../../../../.github/skills/domainspec-ui-implement/SKILL.md): implement frontend from UI-SPEC.
- [domainspec-generate-tests skill](../../../../../.github/skills/domainspec-generate-tests/SKILL.md): derive Playwright test obligations from UI-SPEC and stories.
- [domainspec-ui-audit-bridge skill](../../../../../.github/skills/domainspec-ui-audit-bridge/SKILL.md): retroactive UI quality audit with findings.
- [domainspec-ui-pipeline skill](../../../../../.github/skills/domainspec-ui-pipeline/SKILL.md): end-to-end UI lifecycle orchestration.

### 3.2 Existing prototype assets we can reuse

- [UI mockup](../knowledge-graph-visualization/UI-MOCKUP.md): interaction storyboard and layout framing.
- [whiteboard prototype](../knowledge-graph-visualization/WHITEBOARD-PROTOTYPE.html): HTML-first prototype with lane interaction, zoom/pan, and in-board detail card.

These prove the workflow works, but they are feature-local and not yet generalized as a productized prototyping studio.

### 3.3 Local external reference inventory

- [inventory/README.md](inventory/README.md): feature-local snapshots of imported design references and Open Design skill contracts.

## 4. Web Landscape - Related Tools

There are tools with partial overlap, but no one tool exactly matches the required DomainSpec-native loop.

### 4.1 Strong references

- Builder: AI prototyping and design-system-aligned code workflows for real codebases.
  - Source: https://www.builder.io/
- UXPin: code-backed components, design-system sync, realistic prototype behavior.
  - Source: https://www.uxpin.com/
- Plasmic: visual builder integrated with existing codebase and registered components.
  - Source: https://www.plasmic.app/
- Storybook: component catalog, isolated development, docs, and testable story states.
  - Source: https://storybook.js.org/
- Chromatic: review/sign-off, comments/change requests near live components, CI integration.
  - Source: https://www.chromatic.com/
- Figma: design systems, Dev Mode, MCP/context-to-code pathways.
  - Source: https://www.figma.com/
- v0 and Lovable: fast prompt-to-UI generation and iterative chat loop.
  - Sources: https://v0.app/ and https://lovable.dev/
- Penpot: open-source collaborative design with design-system/token support.
  - Source: https://www.penpot.app/

### 4.2 Build-vs-buy conclusion

- Existing tools cover pieces of the flow.
- The gap is DomainSpec-native traceability:
  - comment -> DomainSpec task,
  - task -> UI-SPEC obligations,
  - obligations -> implementation and verification artifacts.

## 5. Newspaper Reuse Opportunities

The cloned visualization/newspaper project contains reusable patterns for controlled iterative evolution.

### 5.1 Reusable mechanisms

- Strict handoff schemas and versioned protocol:
  - Atomic vote schema, daily payload schema, mutation request schema, generation manifest.
  - Source: data exchange protocol in newspaper app docs.
- Explicit multi-agent role boundaries:
  - router/orchestrator pattern that isolates concerns per agent role.
- Explore vs exploit mutation strategy:
  - supports both safe refinement and radical variation.
- Telemetry-backed iteration loop:
  - feedback persisted and used to drive next generation decisions.

### 5.2 How to adapt for this feature

Adapt newspaper contracts from editorial generation to UI prototyping:

- Atomic vote -> element-level comment and severity event.
- Mutation request -> batch of UI change tasks generated from comments.
- Generations manifest -> prototype revision history.
- Payload contract -> prototype model plus component usage metadata.

### 5.3 MVP Newspaper Integration (Explicit)

For MVP, we are not importing newspaper as a runtime dependency. We are reusing its contract pattern inside DomainSpec UI prototyping artifacts.

#### 5.3.1 What we reuse now (in MVP)

- Contract-first iteration loop:
  - comments are captured as structured records, then normalized into a mutation request, then applied as a tracked revision.
- Revision manifest discipline:
  - every prototype patch is recorded with before/after summary and status.
- Role separation pattern:
  - capture/synthesis/apply/report are explicit stages, even if one agent executes all stages in MVP.

#### 5.3.2 MVP mapping table

| Newspaper concept    | MVP adaptation in UI Prototyping Studio                             | Output artifact   |
| -------------------- | ------------------------------------------------------------------- | ----------------- |
| Atomic vote          | Element comment event (`target`, `severity`, `intent`, `note`)      | comments log      |
| Mutation request     | Aggregated UI change request generated from comments                | mutation batch    |
| Generation manifest  | Revision ledger for each patch cycle                                | revision manifest |
| Daily payload schema | Prototype session payload (`prompt`, `component usage`, `revision`) | session payload   |

#### 5.3.3 MVP execution slice

1. Generate prototype revision `R1` from prompt.
2. Capture element comments as structured comment events.
3. Synthesize events into one mutation batch for the next patch cycle.
4. Apply mutation batch to produce revision `R2`.
5. Append manifest entry with applied tasks, unresolved items, and links for DomainSpec handoff.

#### 5.3.4 Out of scope for MVP (defer)

- Full newspaper-style multi-agent explore/exploit orchestration.
- Parallel strategy branches and ranking across many candidate generations.
- Cross-day autonomous loops and long-horizon scheduling.

Those patterns stay as Phase 2+ once the single-loop contract is stable.

## 6. Proposed Product Shape (MVP)

### 6.1 Core flow

1. Prompt intake:
   - user describes desired UI.
2. Variant generation:

- agent creates a configurable number of HTML-first prototype options from design-system-aware component mapping, with `variantCount` constrained to `1..3`.
- default `variantCount` is `3`, rendered as side-by-side options (`A`, `B`, `C`).

3. Variant selection gate:

- for `variantCount > 1`, user selects exactly one option before any apply loop continues; no auto-apply is allowed before this decision.
- for `variantCount = 1`, system generates one committed baseline and this satisfies the gate before annotation/iteration.

4. Annotation mode:
   - user clicks prototype elements and adds structured comments.
5. Task synthesis:
   - comments are normalized into TASK items with priority and acceptance text.
6. Iteration loop:
   - agent applies tasks, patches prototype, and records revision.
7. Formalization:
   - export/update UI-SPEC sections and seed implementation/test tasks.

### 6.2 System modules

- Component Registry:
  - index existing design-system components and usage constraints.
- Prototype Engine:
  - prompt-to-html generation and patch application.
- Annotation Layer:
  - element targeting, comments, metadata capture.
- Task Synthesizer:
  - comment-to-task mapping with deterministic IDs.
- Iteration Orchestrator:
  - apply tasks, produce next revision, summarize diff.
- Newspaper Adapter (contract compatibility layer):
  - keeps comment event, mutation batch, and revision manifest schema-stable.
- DomainSpec Bridge:
  - write/update feature docs and create links to UI pipeline stages.

### 6.3 Variant Generation and Selection (MVP Contract)

- Variant count and layout:
  - MVP generation MUST accept `variantCount` in the closed range `1..3`.
  - default `variantCount` is `3`, producing three candidate options (`A`, `B`, `C`) in one side-by-side review surface for the same prompt.
  - when `variantCount = 1`, MVP MUST generate one committed baseline option and proceed without multi-option comparison.
- Per-option metadata contract:
  - each generated option MUST expose the same metadata shape before selection or committed-baseline activation:
    - design-system components used,
    - rationale summary,
    - trade-offs,
    - risk.
- Deterministic decision gate:
  - for `variantCount > 1`, no mutation batch, patch apply, or revision advancement may run until the user explicitly selects one option.
  - auto-apply before explicit selection is forbidden when `variantCount > 1`.
  - for `variantCount = 1`, the gate is satisfied by committed baseline generation.
- Selection handoff into iteration loop:
  - for `variantCount > 1`, the selected option becomes the active baseline revision for annotation.
  - for `variantCount = 1`, the committed baseline is the active baseline revision for annotation.
  - comments captured on the active baseline feed the same deterministic contract loop:
    1. comment events,
    2. mutation batch synthesis,
    3. revision patch apply,
    4. manifest append.
  - the manifest MUST record `variantCount` and active baseline label as source provenance for downstream traceability.

## 7. Design System Library Candidates

These options are practical for a React + Vite context.

### Option A - shadcn/ui + Radix + Tailwind

- Pros:
  - component source is local and editable,
  - fast AI prototyping and easy override,
  - huge ecosystem support.
- Cons:
  - requires Tailwind adoption and token discipline.

### Option B - MUI

- Pros:
  - strong enterprise component coverage and theming,
  - mature docs and stable APIs.
- Cons:
  - heavier visual baseline and override complexity.

### Option C - Mantine

- Pros:
  - broad built-in component set and fast feature velocity,
  - good DX for app-style interfaces.
- Cons:
  - less universal than MUI/shadcn in AI-generated starter flows.

### Option D - Keep current plain CSS + focused primitives

- Pros:
  - minimal dependency risk and maximal control.
- Cons:
  - slower to scale reusable UI building blocks.

### Recommendation for MVP

- Adopt Option A for the prototyping studio interface while keeping existing app areas stable.
- Use the studio itself to maintain and test the component registry and token consistency.

## 8. Existing Internal Constraints To Respect

From [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md):

- current baseline is React + Vite + plain CSS,
- color mode is light-only,
- deterministic API-contract-driven behavior is mandatory.

This means design-system adoption should be incremental and scoped to this new feature first.

## 9. Initial Capability Set (for upcoming SPEC)

- Capability 1: Design-system component registry and match engine.
- Capability 2: Prompt-to-prototype generation with configurable `variantCount (1..3)`, explicit selection gate for multi-option mode, and committed baseline mode for `variantCount = 1`.
- Capability 3: Element comment capture and review UI.
- Capability 4: Comment-to-task conversion with traceability.
- Capability 5: Agent patch loop and revision tracking.
- Capability 6: Export to DomainSpec UI-SPEC and implementation-ready obligations.

## 10. Decisions Closed (MVP)

| Decision ID | Selected option                                                                                                                                                                                                                            | Rationale                                                                                                                   | Downstream implication                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| D-001       | Use Option A (`shadcn/ui` + `Radix` + `Tailwind`) for studio surfaces only; keep existing plain-CSS areas unchanged.                                                                                                                       | Fastest path to reusable component primitives while containing migration risk to this feature boundary.                     | Component registry, prototype chrome, and annotation UI target shadcn-first mappings; no forced rewrite of unrelated app areas.              |
| D-002       | First runtime target is HTML-first prototype output; React islands are deferred beyond MVP.                                                                                                                                                | Keeps generation deterministic and contract-first while minimizing runtime variability in the initial loop.                 | Prototype engine emits HTML-first revisions and records deterministic diffs; React-island support is explicitly post-MVP scope.              |
| D-003       | Canonical comment event schema is fixed as `{ target, severity, intent, note }` with severity enum `blocker/high/medium/low`; task synthesis is deterministic from this schema.                                                            | A strict, minimal schema ensures traceable comment-to-task conversion and stable adapter mapping.                           | Annotation and synthesis modules validate against one schema; revision manifests can be audited and replayed consistently.                   |
| D-004       | Auto-task generation runs as deterministic draft generation, but mutation batch commit always requires explicit human confirmation.                                                                                                        | Preserves deterministic automation while preventing ambiguous auto-commit behavior in MVP.                                  | Task synthesizer produces proposed tasks plus acceptance text; only confirmed batches can advance the patch cycle.                           |
| D-005       | Governance gate is manual and two-step: (1) baseline selection gate (`variantCount > 1`) and (2) explicit apply approval per mutation batch; no auto-apply in MVP.                                                                         | Enforces contract-first decision gates and aligns with manual control semantics required by current governance posture.     | Iteration orchestrator must block patch/apply until both gates are satisfied; manifests record approvals as traceability evidence.           |
| D-006       | `variantCount` is bounded to `1..3`, default is `3`, and `variantCount = 1` is a committed baseline path that satisfies selection gating. Session control resets to default `3` on new sessions unless explicitly overridden for that run. | Matches MVP exploration needs while preserving a deterministic single-path fallback and predictable session-start behavior. | Session payload and manifest must persist `variantCount` and active baseline provenance; single-option mode proceeds directly to annotation. |
| D-007       | Newspaper integration remains an adapter compatibility pattern, not a runtime dependency.                                                                                                                                                  | Reuses proven contract structure without introducing coupling to external runtime modules.                                  | Contract mapper stays internal to this feature; dependency graph remains DomainSpec-local for MVP.                                           |

## 11. Suggested Next DomainSpec Steps

1. Create formal [SPEC.md](SPEC.md) for this feature from this discovery.
2. Add aspect docs (domain, operations, queries, interfaces, workflows, states).
3. Run ui-phase-bridge to generate UI-SPEC after core behavior contracts are stable.
4. Derive Playwright obligations with generate-tests --ui.

## 12. Open Design External References (Context Linkage)

This discovery links the external Open Design contracts used by the feature spec inventory. Tiering and contract-level integration mapping are maintained in [SPEC.md](SPEC.md) under "External References Inventory (Open Design)".

- Protocol and extension schema: [skills-protocol.md](https://github.com/nexu-io/open-design/blob/main/docs/skills-protocol.md)
- Core generation and iteration skills:
  - [web-prototype](https://github.com/nexu-io/open-design/tree/main/skills/web-prototype)
  - [web-prototype-taste-editorial](https://github.com/nexu-io/open-design/tree/main/skills/web-prototype-taste-editorial)
  - [web-prototype-taste-brutalist](https://github.com/nexu-io/open-design/tree/main/skills/web-prototype-taste-brutalist)
  - [web-prototype-taste-soft](https://github.com/nexu-io/open-design/tree/main/skills/web-prototype-taste-soft)
  - [critique](https://github.com/nexu-io/open-design/tree/main/skills/critique)
  - [tweaks](https://github.com/nexu-io/open-design/tree/main/skills/tweaks)
  - [wireframe-sketch](https://github.com/nexu-io/open-design/tree/main/skills/wireframe-sketch)
- Archetype skills for near-term expansion:
  - [dashboard](https://github.com/nexu-io/open-design/tree/main/skills/dashboard)
  - [docs-page](https://github.com/nexu-io/open-design/tree/main/skills/docs-page)
  - [mobile-app](https://github.com/nexu-io/open-design/tree/main/skills/mobile-app)
  - [saas-landing](https://github.com/nexu-io/open-design/tree/main/skills/saas-landing)
- Optional live mode contracts:
  - [live-dashboard](https://github.com/nexu-io/open-design/tree/main/skills/live-dashboard)
  - [live-artifact](https://github.com/nexu-io/open-design/tree/main/skills/live-artifact)
