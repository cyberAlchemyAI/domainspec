# Cross-Task Gaps and Questions

## Purpose

Track cross-task gaps and non-blocking questions discovered during algorithm planning.

## Gap Register

| Gap ID         | Description                                                                                                     | Impact | Owner         | Routed Task                                              | Status |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ------ | ------------- | -------------------------------------------------------- | ------ |
| KG-ALG-GAP-001 | Deterministic tie-break rule for equal-rank edges is not yet frozen in docs contracts.                          | Medium | feature-owner | [../tasks/TASK-KG-ALG-01.md](../tasks/TASK-KG-ALG-01.md) | open   |
| KG-ALG-GAP-002 | Full-index ingestion fallback order (`index files` vs `SPEC graph`) needs explicit precedence contract.         | High   | feature-owner | [../tasks/TASK-KG-ALG-02.md](../tasks/TASK-KG-ALG-02.md) | open   |
| KG-ALG-GAP-003 | Rule/description enrichment density target per concept card is not quantified.                                  | Medium | feature-owner | [../tasks/TASK-KG-ALG-03.md](../tasks/TASK-KG-ALG-03.md) | open   |
| KG-ALG-GAP-004 | Prototype pan/zoom and route-history behavior needs one deterministic event-sequence contract.                  | Medium | feature-owner | [../tasks/TASK-KG-ALG-04.md](../tasks/TASK-KG-ALG-04.md) | open   |
| KG-ALG-GAP-005 | Unified remediation ordering policy for verify/alignment/layering findings needs one canonical severity ladder. | High   | feature-owner | [../tasks/TASK-KG-ALG-05.md](../tasks/TASK-KG-ALG-05.md) | open   |

## Questions Log

| Question ID  | Question                                                                                                          | Decision Needed | Routed Task                                              | Status |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------- | ------ |
| KG-ALG-Q-001 | Should unknown relation-color fallback use hash(edge) only, or hash(edge + scope)?                                | yes             | [../tasks/TASK-KG-ALG-01.md](../tasks/TASK-KG-ALG-01.md) | open   |
| KG-ALG-Q-002 | Should source ingestion require all index files (`feature-map`, `features-index`, `tag-index`) before activation? | yes             | [../tasks/TASK-KG-ALG-02.md](../tasks/TASK-KG-ALG-02.md) | open   |
| KG-ALG-Q-003 | Should concept enrichment include `rule ID` badges directly on nodes or inspector-only?                           | yes             | [../tasks/TASK-KG-ALG-03.md](../tasks/TASK-KG-ALG-03.md) | open   |
| KG-ALG-Q-004 | Should prototype visual chips map one-to-one to route query params or to internal-only UI state?                  | yes             | [../tasks/TASK-KG-ALG-04.md](../tasks/TASK-KG-ALG-04.md) | open   |

## Blocker Assessment

No blocker-level unresolved decision remains at work-pack baseline.

Decision lock authority: [03-cross-task-decisions.md](03-cross-task-decisions.md)
