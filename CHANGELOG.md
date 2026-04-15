# Changelog

All notable changes to the DomainSpec framework are documented in this file.

Scope:

- Track framework-level documentation and template evolution in this directory.
- Do not track project-specific feature documentation here. Use ../docs/CHANGELOG.md instead.

Versioning guidance:

- Major: taxonomy or relationship semantics change that can alter interpretation of existing specs.
- Minor: new templates, new framework capabilities, or additive guidance.
- Patch: clarifications, wording improvements, and non-semantic fixes.

## [1.0.0] - 2026-03-29

### Added

- Framework foundation documents:
  - TAXONOMY.md defining 13 meta-concept types for typed domain modeling.
  - RELATIONSHIPS.md defining typed concept edges for a navigable concept graph.
  - TEST-PIPELINE.md defining documentation-to-test transformation rules.
- Reusable authoring templates under templates/:
  - SPEC.md, domain.md, operations.md, states.md, interfaces.md, events.md, queries.md, workflows.md, mappings.md, shared-value-object.md.
- Starter scaffolding under starter/:
  - registry.md and glossary.md seeds for project-level domain documentation.
- Reference examples under examples/:
  - Full payment-processing feature slice and shared money value object examples.
- Copilot integration pack under copilot/:
  - Installable commands, skills, and agents for DomainSpec-driven workflows.

### Changed

- README.md codifies the framework operating model:
  - Domain docs first, then formal states, then tests, then implementation.
  - Clear separation between framework assets (domainspec/) and project-owned docs (docs/).

## [1.0.1] - 2026-03-29

### Changed

- Copilot agent pack updates under copilot/agents:
  - All DomainSpec agents now treat CHANGELOG.md as a mandatory initial read.
  - Agent execution steps now explicitly extract current-framework constraints from CHANGELOG.md before proceeding.

## [1.0.2] - 2026-03-29

### Changed

- Copilot command skill updates under copilot/skills:
  - All domainspec-\* skills now read CHANGELOG.md before running command workflows.
  - Skill process steps now explicitly extract current-framework constraints from CHANGELOG.md prior to action.

## [1.1.0] - 2026-04-08

### Added

- DomainSpec-GSD delegation contract support in the local `.github` integration layer:
  - DomainSpec planner/implementer now support explicit execution mode selection (`native` or `gsd-phase`).
  - Verification and alignment skills now recognize delegated GSD evidence artifacts under `.planning/phases/**`.

### Changed

- Delegation authority model is now explicit:
  - DomainSpec artifacts remain source of truth for semantics and acceptance.
  - GSD workflows provide orchestration (phase planning, execution ordering, checkpoints, summaries).

## [1.2.0] - 2026-04-14

### Added

- Context search heuristic for intelligent discovery path selection:
  - Agents now evaluate four strategies (`links-tags-first`, `broad-search-first`, `focused-researcher-first`, `capability-graph-first`) using a weighted scoring formula before gathering context.
  - Pre-filter shortcut: when SPEC frontmatter `includes` and `dependencies` fully resolve the file graph, scoring is skipped.
  - Tie-breaker defaults to `links-tags-first` (trust existing DomainSpec navigation).
  - Validated by `tools/context-search-heuristic.test.mjs` with 9 representative scenarios at 100% accuracy.
- New `domainspec-story-sync` agent for maintaining user-story files aligned with capability and aspect changes.
- Structured output contract for researcher agent: callers receive `featureArtifacts`, `relevantContracts`, `namingConstraints`, `linkGraph`, `matchedTags`, `openQuestions`, and `recommendation`.

## [1.3.0] - 2026-04-15

### Added

- UI architecture and frontend lifecycle support:
  - New `ui-architecture.md` template for defining project-wide frontend constitution (stack, theme, layout, data patterns, form strategy).
  - New `domainspec-ui-architect` agent for interactive frontend architecture definition.
  - New `domainspec-ui-architecture` skill for creating or evolving UI-ARCHITECTURE.md from DomainSpec contracts.
  - New `domainspec-ui-phase-bridge` skill for generating per-feature UI-SPEC.md design contracts via GSD UI workflow delegation.
  - New `domainspec-ui-implement` skill for implementing frontend pages and components from UI-SPEC.md and UI-ARCHITECTURE.md.
  - New `domainspec-ui-audit-bridge` skill for retroactive 6-pillar visual audits of implemented UI code.
- Playwright E2E test generation pipeline:
  - TEST-PIPELINE.md extended with UI E2E Test Generation Rules (rules 15–20): Navigation, Journey, Form Validation, State Reflection, Responsive Layout, Accessibility.
  - `domainspec-generate-tests` skill now supports `--ui` and `--all` flags for Playwright E2E test scaffold generation from UI-SPEC.md.
  - `domainspec-test-designer` agent updated with UI E2E test design capability and Playwright scaffold conventions.
  - E2E scaffold convention: `{web-app}/e2e/{feature}/` with `.navigation.spec.ts`, `.journey.spec.ts`, `.forms.spec.ts`, `.states.spec.ts`, `.responsive.spec.ts`.
  - Traceability format: `@source features/{feature}/UI-SPEC.md#{section}`, `@story {story-id}`, `@journey {journey-name}`.
- MCP Playwright integration in installer:
  - `install.sh` now auto-detects web app directory and optionally installs `@playwright/test`, Chromium, and generates `playwright.config.ts`.
  - Creates `.vscode/mcp.json` with `@playwright/mcp@latest` server entry for browser-interactive agent workflows.
  - Supports `DOMAINSPEC_SKIP_PLAYWRIGHT=1` environment variable for non-interactive skipping.

### Changed

- Planner agent now includes a **UI detection gate** (execution step 4):
  - Auto-detects frontend aspects by checking for HTTP endpoints in `interfaces.md`, presence of `UI-ARCHITECTURE.md`, and `UI-SPEC.md`.
  - Automatically includes UI architecture, UI-SPEC generation, UI implementation, UI audit, and Playwright E2E tasks based on detected state.
  - `domainspec-ui-architect` added to planner's agent delegation list.

### Changed

- `domainspec-spec-writer` agent:
  - Capability-driven SPEC structure (capabilities first, aspects second).
  - Governance thresholds for SPEC size → STORIES.md / capabilities/ splits.
  - Story coverage enforcement with `domainspec-story-sync` delegation.
  - Context search heuristic with 4 strategies and pre-filter shortcut.
- `domainspec-planner` agent:
  - Context search heuristic with 4 strategies and pre-filter shortcut.
  - Subagent delegation to `Explore`, `domainspec-researcher`, and audit agents.
  - GSD phase delegation contract for medium/high complexity planning.
- `domainspec-researcher` agent:
  - DomainSpec-aware navigation using index artifacts, frontmatter signals, and capability anchors.
  - `Explore` subagent delegation for broad discovery fallback.
  - Structured output contract matching caller expectations.
- `domainspec-implementer` agent:
  - Audit gates (alignment + layering) before implementation edits.
  - GSD execution delegation contract.
  - Extended context inputs: STORIES.md, capabilities/*.md.
- Heuristic weights tuned from `signal:0.45 / cost:0.35 / ambiguity:0.20` to `signal:0.45 / cost:0.30 / ambiguity:0.25` to reflect cheaper search costs from index artifacts.

## [1.1.1] - 2026-04-09

### Added

- Layering enforcement artifacts in the local `.github` integration layer:
  - New `domainspec-layering-auditor` agent to detect domain-logic drift into application/use-case layers.
  - New `domainspec-audit-layering` skill to produce deterministic remediation plans tied to DomainSpec concepts.

### Changed

- DomainSpec planning and implementation workflows are expected to include a layering audit gate for features that already have production code.
