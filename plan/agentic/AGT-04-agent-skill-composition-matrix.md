# AGT-04 - Agent-Skill Composition Matrix

## Objective

Define reusable sets of agents and skills that compose implementation workflows for common intents.

## Problem

Without explicit composition sets, routing logic and team expectations drift across similar requests.

## Scope

- In scope:
  - Composition matrix by intent class.
  - Input and output contract per composition set.
  - Compatibility notes for optional and required components.
- Out of scope:
  - Project-specific hardcoded pipelines.

## Dependencies

- [AGT-01-orchestrator-interface.md](AGT-01-orchestrator-interface.md)
- [AGT-05-cross-project-skills-repository.md](AGT-05-cross-project-skills-repository.md)

## Implementation Tasks

1. Define intent classes and required capability bundles.
2. Map each bundle to agents, skills, and runtime requirements.
3. Define output contracts and failure handling per bundle.
4. Add versioning and compatibility fields.
5. Add matrix publication and update workflow.

## Deliverables

- Composition matrix specification.
- Bundle contract definitions.
- Compatibility and versioning policy.

## Done Criteria

- [ ] Every implementation intent maps to a documented composition set.
- [ ] Composition changes are versioned and traceable.
- [ ] Orchestrator uses matrix as source of truth.
