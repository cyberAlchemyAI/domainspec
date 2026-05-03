# Cross-Task Gaps and Questions

## Open Gaps

| Gap ID   | Question                                                                                               | Impact                                       | Owner         | Target Date | Status |
| -------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------- | ----------- | ------ |
| G-KG-001 | Which deterministic graph layout engine should be used (server-deterministic vs client-deterministic)? | Affects reproducibility and E2E stability    | web-core      | 2026-05-05  | open   |
| G-KG-002 | Should "open definition" navigate inside app markdown viewer or route to editor deep-link?             | Affects interaction contract and link format | platform-core | 2026-05-05  | open   |
| G-KG-003 | Should optional aspect cards (events, workflows, states, mappings) be visible by default?              | Affects UX density and first-load complexity | product-owner | 2026-05-05  | open   |

## Resolved Inputs

| Item                  | Resolution                                                   | Source                 |
| --------------------- | ------------------------------------------------------------ | ---------------------- |
| Required mirror cards | Always include SPEC, domain, operations                      | User request, D-KG-001 |
| Graph semantics       | Canonical edge vocabulary only                               | User request, D-KG-002 |
| Click behavior        | Concept click must support deep-link and detail card context | User request, D-KG-003 |

## Cross-Task Dependencies

| Depends On                          | Needed By            | Why                                               |
| ----------------------------------- | -------------------- | ------------------------------------------------- |
| Layout engine decision (G-KG-001)   | KG-IMP-03, KG-IMP-04 | Stable UI behavior and test determinism           |
| Definition target mode (G-KG-002)   | KG-IMP-02, KG-IMP-03 | API contract finalization and UX action flow      |
| Optional card visibility (G-KG-003) | KG-IMP-03            | Final default filter and component state behavior |

## Mitigation Until Closure

- Implement API contracts with mode-compatible fields so UI decision can switch without backend rewrite.
- Keep graph node ordering deterministic independent of final layout algorithm.
- Keep optional aspects behind query filter flag to avoid lock-in before product decision.
