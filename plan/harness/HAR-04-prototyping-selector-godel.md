# HAR-04 - Frontend Prototyping Selector with Godel Integration

## Objective

Offer a prototyping interface where users select product display strategies and preview outcomes through Victor's Godel machine implementation.

## Problem

Users need fast UI strategy exploration without rewriting core workflow logic.

## Scope

- In scope:
  - Prototyping selector UI.
  - Adapter contract for Godel machine integration.
  - Preview and comparison of alternative display modes.
- Out of scope:
  - Full visual design system replacement.

## Dependencies

- [HAR-01-domain-graph-chain-explorer.md](HAR-01-domain-graph-chain-explorer.md)
- [../agentic/AGT-01-orchestrator-interface.md](../agentic/AGT-01-orchestrator-interface.md)

## Implementation Tasks

1. Define display strategy model and variant catalog.
2. Define adapter interface for Godel machine renderer.
3. Implement preview mode with side-by-side comparison.
4. Add persistence for selected strategy per project context.
5. Add validation checks for workflow compatibility per strategy.

## Deliverables

- Strategy model.
- Godel adapter contract.
- Prototyping selector UI.
- Strategy compatibility checker.

## Done Criteria

- [ ] User can switch and preview display strategies in-session.
- [ ] Selected strategy persists by project context.
- [ ] Incompatible strategy is blocked with clear reason.
