# AGT-03 - Interviewer Flow for Brownfield Mapping

## Objective

Provide interviewer-assisted mapping for already implemented domains by combining repository evidence with guided questions.

## Problem

Brownfield projects require both evidence extraction and human clarification to avoid mismatched domain maps.

## Scope

- In scope:
  - Evidence-first brownfield analysis.
  - Clarification prompts for unresolved boundaries and rules.
  - As-is mapping outputs and gap reports.
- Out of scope:
  - Greenfield-only discovery.

## Dependencies

- [AGT-01-orchestrator-interface.md](AGT-01-orchestrator-interface.md)
- [../governance/GOV-02-governance-validation-scripts.md](../governance/GOV-02-governance-validation-scripts.md)

## Implementation Tasks

1. Define brownfield evidence extraction checklist.
2. Define unresolved-area interview prompts.
3. Define as-is mapping output and gap report format.
4. Add confidence score for mapped concepts.
5. Add remediation recommendations for uncovered gaps.

## Deliverables

- Brownfield mapping checklist.
- Clarification prompt catalog.
- As-is map and gap report template.
- Confidence scoring model.

## Done Criteria

- [ ] Brownfield run produces as-is map with explicit evidence links.
- [ ] Unclear boundaries are highlighted and resolved through prompts.
- [ ] Gap report includes remediation path for implementation teams.
