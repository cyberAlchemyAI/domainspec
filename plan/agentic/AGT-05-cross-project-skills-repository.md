# AGT-05 - Cross-Project Skills Knowledge Repository

## Objective

Create a reusable skills knowledge repository that is not restricted to one project and supports implementation reuse.

## Problem

Skills are often stored in project-local silos, reducing reuse and increasing duplication.

## Scope

- In scope:
  - Shared repository metadata model.
  - Discovery and tagging for implementation capabilities.
  - Import and sync policy for project-local overlays.
- Out of scope:
  - Research-only skill catalogs.

## Dependencies

- [AGT-04-agent-skill-composition-matrix.md](AGT-04-agent-skill-composition-matrix.md)
- [../governance/GOV-01-axioms-constitution-tags-execution.md](../governance/GOV-01-axioms-constitution-tags-execution.md)

## Implementation Tasks

1. Define shared skill metadata schema.
2. Define capability tags and compatibility markers.
3. Add repository indexing and search strategy.
4. Add sync policy between shared and project-local layers.
5. Add governance checks for imported skills.

## Deliverables

- Shared repository schema.
- Tagging and compatibility model.
- Sync policy document.
- Governance check list for imports.

## Done Criteria

- [ ] Skills are discoverable by capability and compatibility.
- [ ] Cross-project reuse path is documented and executable.
- [ ] Imported skills pass governance checks before activation.
