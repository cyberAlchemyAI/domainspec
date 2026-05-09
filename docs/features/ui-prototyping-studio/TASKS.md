# Tasks: UI Prototyping Studio

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## Ordered Design and Planning Tasks

| Task ID    | Task                                                                           | Owner Role  | Required Output                   | Done Definition                                                            |
| ---------- | ------------------------------------------------------------------------------ | ----------- | --------------------------------- | -------------------------------------------------------------------------- |
| UPS-DES-01 | Consolidate feature anchor spec and remove duplicate contract fragments.       | Spec writer | Updated [SPEC.md](SPEC.md)        | One canonical capability-first spec with required sections                 |
| UPS-DES-02 | Formalize domain entities, value objects, enums, and concept IDs.              | Spec writer | [domain.md](domain.md)            | Structural concepts link to operations/states and preserve MVP constraints |
| UPS-DES-03 | Define mutation operations with rules, transitions, and error states.          | Spec writer | [operations.md](operations.md)    | All FR/AC governance obligations have operation anchors                    |
| UPS-DES-04 | Define read models for session, variants, draft batch, manifest, and handoff.  | Spec writer | [queries.md](queries.md)          | Handoff output and resume traceability are queryable                       |
| UPS-DES-05 | Define external/internal interfaces and adapter boundary.                      | Spec writer | [interfaces.md](interfaces.md)    | API field mappings and adapter-only constraints are explicit               |
| UPS-DES-06 | Document workflow orchestration and gate policies.                             | Spec writer | [workflows.md](workflows.md)      | Baseline/apply gates and variant count policy are deterministic            |
| UPS-DES-07 | Document lifecycle state machine with invariants.                              | Spec writer | [states.md](states.md)            | All loop transitions and invariants are testable                           |
| UPS-DES-08 | Define UI contract for route/layout/interactions/forms/accessibility/security. | Spec writer | [UI-SPEC.md](UI-SPEC.md)          | UI obligations align with domain operations and state transitions          |
| UPS-DES-09 | Derive spec-level verification obligations matrix.                             | Spec writer | [TEST-SPEC.md](TEST-SPEC.md)      | Stories, FRs, ACs, operations, states, and interfaces are covered          |
| UPS-DES-10 | Lock and publish MVP decisions and open-decision register.                     | Spec writer | [DECISIONS.md](DECISIONS.md)      | D-001..D-007 locked and non-blocking open decisions listed                 |
| UPS-DES-11 | Refresh stories with capability coverage and concept links.                    | Spec writer | [STORIES.md](STORIES.md)          | Every story links to concept/aspect evidence                               |
| UPS-DES-12 | Validate markdown links for all changed feature docs.                          | Spec writer | Validation report in stage output | Link checker passes for each updated markdown artifact                     |

## Planning Completion Criteria

- All required aspect docs exist in `docs/features/ui-prototyping-studio/`.
- [SPEC.md](SPEC.md) includes concepts table, feature graph, aspects index, dependency/produce tables, design contract sections, and traceability matrix.
- `variantCount` contract remains bounded to `1..3` with default `3` and committed baseline semantics for `1`.
- Manual governance remains explicit (`baseline selection gate`, `approval gate`, `auto-apply forbidden`).
- Adapter-only newspaper compatibility boundary remains explicit.

## Deferred Non-MVP Planning Tasks

- Evaluate pre-generation brief normalization lane (`O-001`).
- Evaluate optional live-data prototype mode (`O-002`).
- Evaluate bounded autonomous multi-cycle mode (`O-003`).
