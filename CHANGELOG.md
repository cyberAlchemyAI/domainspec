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
