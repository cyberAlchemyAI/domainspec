# WORK-PACK: knowledge-graph-visualization

## Purpose

Algorithm-first planning manifest for `knowledge-graph-visualization` after clean reset of prior work-pack artifacts.

This slice is planning-only: no implementation code mutations are included.

## Planner Control Fields

| Field             | Value                                                             | Notes                                                                          |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| plannerGateStatus | pass                                                              | Pass for planning baseline creation                                            |
| complexity        | high                                                              | Cross-cutting algorithm, source-registry, UI behavior, and closure obligations |
| architectureWave  | W0                                                                | Mandatory first wave for architecture and governance baseline                  |
| activePlanRef     | docs/features/knowledge-graph-visualization/work-pack/waves/W0.md | Current baseline wave reference                                                |
| lastPlannedAt     | 2026-05-10T00:00:00Z                                              | ISO timestamp                                                                  |
| readinessProfile  | pilot                                                             | Initial verification target profile                                            |

## Planner Gate Evidence

Status: PASS

- New clean work-pack entrypoint created.
- Required split modules created under `work-pack/shared`, `work-pack/waves`, and `work-pack/tasks`.
- Canonical pipeline-stage matrix included with all required stages.
- Architecture-guided directives included with coverage IDs and architecture references.
- Decision locks include source strategy, deterministic hierarchy, and prototype-first anchor.

## Mode Resolution

- Requested mode: `native`
- Delegation mode selected: `native`
- Determinism mode: non-interactive, authority-seed-driven algorithm planning baseline

## Explicit Planner Requirements

- W0 is mandatory and cannot be skipped; downstream waves require W0 gate evidence.
- Canonical Pipeline Stage Coverage matrix must list all required stages.
- Seed closure tasks for `verify-feature`, `audit-alignment`, and `audit-layering` at planning time.
- Source strategy is non-exclusive; `poker-team` is baseline/example evidence only.
- Deterministic hierarchy is fixed as `feature -> file -> concept`.
- Concept cards must include enrichment for rules/descriptions when available, with deterministic fallback behavior.

## Current Framework Constraints (domainspec/CHANGELOG.md)

- `2.0.10`: terminal execution hardening expects safer execution paths and bounded tooling behavior.
- `2.0.9`: delegated stage telemetry must reconcile stale `started` rows into terminal outcomes.
- `2.0.8`: delegation telemetry rows require profile/thinking/retry/outcome shape consistency.
- `2.0.5`: plan/spec flows require explicit post-spec task synchronization via work-pack artifacts.

## Discovery Path Selection

Pre-filter shortcut status: not applicable. `SPEC.md` frontmatter does not fully resolve required file graph via `includes` + `dependencies`.

Score formula:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

| Path                     | Signal | Cost | Ambiguity | Score  |
| ------------------------ | ------ | ---- | --------- | ------ |
| links-tags-first         | 0.93   | 0.20 | 0.14      | 0.1265 |
| broad-search-first       | 0.78   | 0.58 | 0.38      | 0.3680 |
| focused-researcher-first | 0.86   | 0.44 | 0.22      | 0.2500 |
| capability-graph-first   | 0.83   | 0.36 | 0.27      | 0.2520 |

Selected path: `links-tags-first`.

Supporting artifact: [work-pack/shared/01-context.md](work-pack/shared/01-context.md)

## Implementation Presence and Audit Baseline

Existing implementation is present in backend and web modules for this feature.

Planning obligations for implemented-feature closure are seeded now:

- `domainspec-verify-feature knowledge-graph-visualization`
- `domainspec-audit-alignment knowledge-graph-visualization`
- `domainspec-audit-layering knowledge-graph-visualization`

Consolidated dependency-ordered remediation track is defined in [work-pack/shared/04-traceability.md](work-pack/shared/04-traceability.md).

## UI Detection Gate

- HTTP endpoints in `interfaces.md`: yes
- `docs/UI-ARCHITECTURE.md` exists: yes
- `docs/features/knowledge-graph-visualization/UI-SPEC.md` exists: yes

Gate result:

- Keep UI obligations in scope through algorithm planning tasks.
- Include UI test generation and UI implementation planning obligations as explicit task directives (without mutation in this slice).

## Resolved Decision Gate

| Decision | Selected Option                                                                                                                            | Rationale                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| D-KG-012 | Poker-team is baseline/example evidence only; source strategy stays non-exclusive across registered sources.                               | Prevents source lock-in and preserves cross-project projection goals.            |
| D-KG-013 | Deterministic hierarchy contract is fixed as `feature -> file -> concept`, with concept-card rules/descriptions enrichment when available. | Freezes reproducible graph structure, deterministic card shape, and testability. |
| D-KG-014 | Prototype-first planning anchor: `WHITEBOARD-PROTOTYPE.html` is the interaction anchor, while aspect docs remain normative for contracts.  | Keeps behavior planning concrete without replacing canonical docs authority.     |

Decision details: [work-pack/shared/03-cross-task-decisions.md](work-pack/shared/03-cross-task-decisions.md)

## Spec-Compliance Self-Check

| Required Step                                                | Status    | Evidence                                                                                                          |
| ------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------- |
| 1. Read framework changelog                                  | completed | [WORK-PACK.md](WORK-PACK.md#current-framework-constraints-domainspecchangelogmd)                                  |
| 2. Context discovery with weighted path selection            | completed | [work-pack/shared/01-context.md](work-pack/shared/01-context.md#discovery-path-result)                            |
| 3. Implemented-feature closure obligations (verify + audits) | completed | [work-pack/shared/04-traceability.md](work-pack/shared/04-traceability.md#closure-remediation-track-ordered)      |
| 4. UI detection gate                                         | completed | [WORK-PACK.md](WORK-PACK.md#ui-detection-gate)                                                                    |
| 5. Decision gate resolved and recorded                       | completed | [work-pack/shared/03-cross-task-decisions.md](work-pack/shared/03-cross-task-decisions.md#resolved-decision-gate) |
| 6. Pre-plan compliance check emitted                         | completed | this section                                                                                                      |

## Task Status Board

| Task ID                     | Goal                                                                                                 | Complexity | Assigned Waves | Gate Status       | Status      |
| --------------------------- | ---------------------------------------------------------------------------------------------------- | ---------- | -------------- | ----------------- | ----------- |
| TASK-KG-ALG-01              | Freeze deterministic algorithm contract (`feature -> file -> concept`) and authority map.            | high       | W1             | ready-after-W0    | in-progress |
| TASK-KG-ALG-02              | Define source registry abstraction and full-index ingestion plan with non-exclusive source strategy. | high       | W1             | ready-after-W0    | not-started |
| TASK-KG-ALG-03              | Define concept-card enrichment plan for rules/descriptions and deterministic fallback behavior.      | high       | W2             | ready-after-01-02 | not-started |
| TASK-KG-ALG-04              | Map prototype behavior to contracts and UI behavior plan for deterministic interactions.             | high       | W2             | ready-after-01-02 | not-started |
| TASK-KG-ALG-05              | Plan verification and closure track merging verify/alignment/layering obligations.                   | high       | W3             | ready-after-03-04 | not-started |
| TASK-KG-ALG-VERIFY          | Execute feature verification verdict (`domainspec-verify-feature`).                                  | high       | W3             | ready-after-05    | not-started |
| TASK-KG-ALG-AUDIT-ALIGNMENT | Execute alignment audit (`domainspec-audit-alignment`).                                              | high       | W3             | ready-after-05    | not-started |
| TASK-KG-ALG-AUDIT-LAYERING  | Execute layering audit (`domainspec-audit-layering`).                                                | high       | W3             | ready-after-05    | not-started |

## Mandatory Closure Obligations

| Obligation           | Required Command                                           | Task Mapping                | Baseline Output                | Current State |
| -------------------- | ---------------------------------------------------------- | --------------------------- | ------------------------------ | ------------- |
| Feature verification | `domainspec-verify-feature knowledge-graph-visualization`  | TASK-KG-ALG-VERIFY          | `VERIFICATION.md`              | seeded        |
| Alignment audit      | `domainspec-audit-alignment knowledge-graph-visualization` | TASK-KG-ALG-AUDIT-ALIGNMENT | `ALIGNMENT-REPORT.md`          | seeded        |
| Layering audit       | `domainspec-audit-layering knowledge-graph-visualization`  | TASK-KG-ALG-AUDIT-LAYERING  | `LAYERING-ALIGNMENT-REPORT.md` | seeded        |

## Architecture-Guided Task Directives

| Task ID        | DomainSpec Sources                                                                                                                                     | Coverage IDs                                                                                            | Architecture References                                                                                                                                                       | Implementation Directive                                                                                               | Verification Evidence                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| TASK-KG-ALG-01 | [SPEC.md](SPEC.md), [domain.md](domain.md), [mappings.md](mappings.md), [queries.md](queries.md)                                                       | FR-001, FR-002, FR-003, FR-004, AC-001..AC-006, INV-001..INV-003, RelationshipEdge, ConceptDefinition   | [ARCHITECTURE.md](../../../ARCHITECTURE.md), [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md), [RELATIONSHIPS.md](../../../RELATIONSHIPS.md)                                    | Freeze deterministic graph contract, canonical ordering keys, and file-to-concept projection sequence.                 | [TASK-KG-ALG-01.md](work-pack/tasks/TASK-KG-ALG-01.md) |
| TASK-KG-ALG-02 | [operations.md](operations.md), [interfaces.md](interfaces.md), [SPEC.md](SPEC.md), [queries.md](queries.md)                                           | ResolveProjectionScope.R1..R3, RebuildMirrorProjection.R0..R6, ProjectSourceRegistry, KG-BE-OP-001..010 | [ARCHITECTURE.md](../../../ARCHITECTURE.md), [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md), [DEPENDENCY-RULES.md](../../../architecture/pattern-library/DEPENDENCY-RULES.md) | Define registry-backed source abstraction and full-index ingestion strategy that remains non-exclusive and scope-safe. | [TASK-KG-ALG-02.md](work-pack/tasks/TASK-KG-ALG-02.md) |
| TASK-KG-ALG-03 | [domain.md](domain.md), [mappings.md](mappings.md), [queries.md](queries.md), [TEST-SPEC.md](TEST-SPEC.md)                                             | ConceptDefinition, ConceptToDetailCardAdapter, GetConceptDetailCard, KG-BE-QRY-009..012, KG-UI-JRN-004  | [ARCHITECTURE.md](../../../ARCHITECTURE.md), [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md)                                                                                   | Specify deterministic concept-card enrichment for rules/descriptions with explicit precedence and fallback semantics.  | [TASK-KG-ALG-03.md](work-pack/tasks/TASK-KG-ALG-03.md) |
| TASK-KG-ALG-04 | [WHITEBOARD-PROTOTYPE.html](WHITEBOARD-PROTOTYPE.html), [UI-SPEC.md](UI-SPEC.md), [SPEC.md](SPEC.md), [TEST-SPEC.md](TEST-SPEC.md)                     | KG-UI-NAV-001..002, KG-UI-JRN-001..004, KG-UI-STATE-001..004, FR-003, AC-004                            | [ARCHITECTURE.md](../../../ARCHITECTURE.md), [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md)                                                                                   | Map prototype interactions to contractual UI behaviors and testable route-state transitions.                           | [TASK-KG-ALG-04.md](work-pack/tasks/TASK-KG-ALG-04.md) |
| TASK-KG-ALG-05 | [TEST-SPEC.md](TEST-SPEC.md), [STORIES.md](STORIES.md), [SPEC.md](SPEC.md), [work-pack/shared/04-traceability.md](work-pack/shared/04-traceability.md) | KG-BE-ST-001..015, KG-BE-OP-001..020, KG-BE-API-001..016, KG-UI-\* readiness set                        | [ARCHITECTURE.md](../../../ARCHITECTURE.md), [TEST-PIPELINE.md](../../../TEST-PIPELINE.md), [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md)                                    | Produce one dependency-ordered closure plan that merges verification, alignment, and layering remediation obligations. | [TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md) |

## Required Links

### Split mode (active)

- [work-pack/shared/01-context.md](work-pack/shared/01-context.md)
- [work-pack/shared/02-cross-task-gaps-and-questions.md](work-pack/shared/02-cross-task-gaps-and-questions.md)
- [work-pack/shared/03-cross-task-decisions.md](work-pack/shared/03-cross-task-decisions.md)
- [work-pack/shared/04-traceability.md](work-pack/shared/04-traceability.md)
- [work-pack/waves/W0.md](work-pack/waves/W0.md)
- [work-pack/waves/W1.md](work-pack/waves/W1.md)
- [work-pack/waves/W2.md](work-pack/waves/W2.md)
- [work-pack/waves/W3.md](work-pack/waves/W3.md)
- [work-pack/tasks/TASK-KG-ALG-01.md](work-pack/tasks/TASK-KG-ALG-01.md)
- [work-pack/tasks/TASK-KG-ALG-02.md](work-pack/tasks/TASK-KG-ALG-02.md)
- [work-pack/tasks/TASK-KG-ALG-03.md](work-pack/tasks/TASK-KG-ALG-03.md)
- [work-pack/tasks/TASK-KG-ALG-04.md](work-pack/tasks/TASK-KG-ALG-04.md)
- [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)
- [work-pack/tasks/TASK-KG-ALG-VERIFY.md](work-pack/tasks/TASK-KG-ALG-VERIFY.md)
- [work-pack/tasks/TASK-KG-ALG-AUDIT-ALIGNMENT.md](work-pack/tasks/TASK-KG-ALG-AUDIT-ALIGNMENT.md)
- [work-pack/tasks/TASK-KG-ALG-AUDIT-LAYERING.md](work-pack/tasks/TASK-KG-ALG-AUDIT-LAYERING.md)

## Wave Status Board

| Wave | Objective                                                                  | Entry Gate        | Exit Gate                                                      | Status      | Evidence                                       |
| ---- | -------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------- | ----------- | ---------------------------------------------- |
| W0   | Lock architecture baseline, decision locks, and traceability scaffolding.  | WORK-PACK created | W0 checks pass with shared artifacts populated                 | in-progress | [work-pack/waves/W0.md](work-pack/waves/W0.md) |
| W1   | Freeze deterministic contract and source-registry ingestion plan.          | W0 in-progress    | TASK-KG-ALG-01 and TASK-KG-ALG-02 closure criteria pass        | not-started | [work-pack/waves/W1.md](work-pack/waves/W1.md) |
| W2   | Plan concept enrichment and prototype-to-contract UI behavior mapping.     | W1 completed      | TASK-KG-ALG-03 and TASK-KG-ALG-04 closure criteria pass        | not-started | [work-pack/waves/W2.md](work-pack/waves/W2.md) |
| W3   | Plan and execute verification/audit closure path and remediation ordering. | W2 completed      | TASK-KG-ALG-05 plus seeded closure tasks have evidence outputs | not-started | [work-pack/waves/W3.md](work-pack/waves/W3.md) |

## Canonical Pipeline Stage Coverage Matrix

| Stage                 | Required | Wave Mapping | Status      | Evidence                                                                                         | Skip Reason |
| --------------------- | -------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------ | ----------- |
| plan                  | yes      | W0           | in-progress | [WORK-PACK.md](WORK-PACK.md)                                                                     | -           |
| architecture-baseline | yes      | W0           | in-progress | [work-pack/waves/W0.md](work-pack/waves/W0.md)                                                   | -           |
| spec                  | yes      | W1+          | not-started | [SPEC.md](SPEC.md)                                                                               | -           |
| stories               | yes      | W1+          | not-started | [STORIES.md](STORIES.md)                                                                         | -           |
| tests                 | yes      | W1+          | not-started | [TEST-SPEC.md](TEST-SPEC.md)                                                                     | -           |
| backend-implement     | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-02.md](work-pack/tasks/TASK-KG-ALG-02.md)                           | -           |
| ui-pipeline           | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-04.md](work-pack/tasks/TASK-KG-ALG-04.md)                           | -           |
| observability-spec    | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)                           | -           |
| instrument-otel       | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)                           | -           |
| otel-verify           | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)                           | -           |
| infra-deploy          | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)                           | -           |
| registry-sync         | yes      | W2+          | not-started | [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)                           | -           |
| verify-readiness      | yes      | W3+          | not-started | [work-pack/tasks/TASK-KG-ALG-05.md](work-pack/tasks/TASK-KG-ALG-05.md)                           | -           |
| verify-feature        | yes      | W3+          | not-started | [work-pack/tasks/TASK-KG-ALG-VERIFY.md](work-pack/tasks/TASK-KG-ALG-VERIFY.md)                   | -           |
| audit-alignment       | yes      | W3+          | not-started | [work-pack/tasks/TASK-KG-ALG-AUDIT-ALIGNMENT.md](work-pack/tasks/TASK-KG-ALG-AUDIT-ALIGNMENT.md) | -           |
| audit-layering        | yes      | W3+          | not-started | [work-pack/tasks/TASK-KG-ALG-AUDIT-LAYERING.md](work-pack/tasks/TASK-KG-ALG-AUDIT-LAYERING.md)   | -           |

## Decision Lock Summary

| Decision ID | Scope      | Status   | Selected Option                                                                                        | Source                       | Date       |
| ----------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------ | ---------------------------- | ---------- |
| D-KG-012    | cross-task | selected | Poker-team baseline-only, non-exclusive source strategy                                                | [DECISIONS.md](DECISIONS.md) | 2026-05-10 |
| D-KG-013    | cross-task | selected | Deterministic hierarchy `feature -> file -> concept` with rules/descriptions enrichment when available | [DECISIONS.md](DECISIONS.md) | 2026-05-10 |
| D-KG-014    | cross-task | selected | Prototype-first planning anchor with docs as normative contracts                                       | [DECISIONS.md](DECISIONS.md) | 2026-05-10 |

## Blockers

No blocker-level unresolved decisions remain for planning baseline.

## Notes

- Source strategy remains non-exclusive by design. `poker-team` is baseline/example evidence only.
- Prototype is interaction anchor; retained aspect docs remain behavioral contract authority.
- Mandatory closure tasks are seeded without marking execution complete in this planning slice.
- Markdown-link validation obligations are captured in [work-pack/shared/04-traceability.md](work-pack/shared/04-traceability.md).

## Change Log

| Date       | Change                                                                       | Author  |
| ---------- | ---------------------------------------------------------------------------- | ------- |
| 2026-05-10 | Created clean algorithm-first work-pack baseline after prior artifact reset. | Copilot |
