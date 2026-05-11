# Context Pack: knowledge-graph-visualization Algorithm Planning

## Scope

Build a clean planning baseline for deterministic graph algorithm delivery, source-registry abstraction, concept-card enrichment, prototype-to-contract mapping, and closure obligations.

## Discovery Path Result

Pre-filter shortcut: not applicable (`SPEC.md` frontmatter does not fully resolve file graph through `includes` and `dependencies`).

Score formula:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

| Path                     | Signal | Cost | Ambiguity | Score  |
| ------------------------ | ------ | ---- | --------- | ------ |
| links-tags-first         | 0.93   | 0.20 | 0.14      | 0.1265 |
| broad-search-first       | 0.78   | 0.58 | 0.38      | 0.3680 |
| focused-researcher-first | 0.86   | 0.44 | 0.22      | 0.2500 |
| capability-graph-first   | 0.83   | 0.36 | 0.27      | 0.2520 |

Selected path: `links-tags-first`.

## Current Framework Constraints

- Follow latest framework changelog constraints from [../../../CHANGELOG.md](../../../CHANGELOG.md).
- Keep planning artifacts synchronized with closure obligations for implemented features.
- Keep deterministic planning outputs auditable and link-valid.

## Existing Feature Artifacts

### Normative feature docs

- [../../SPEC.md](../../SPEC.md)
- [../../domain.md](../../domain.md)
- [../../operations.md](../../operations.md)
- [../../queries.md](../../queries.md)
- [../../interfaces.md](../../interfaces.md)
- [../../mappings.md](../../mappings.md)
- [../../workflows.md](../../workflows.md)
- [../../events.md](../../events.md)
- [../../states.md](../../states.md)
- [../../STORIES.md](../../STORIES.md)
- [../../TEST-SPEC.md](../../TEST-SPEC.md)
- [../../UI-SPEC.md](../../UI-SPEC.md)
- [../../DECISIONS.md](../../DECISIONS.md)

### Prototype and research authority seeds

- [../../WHITEBOARD-PROTOTYPE.html](../../WHITEBOARD-PROTOTYPE.html)
- [../../research/sugiyama_framework.md](../../research/sugiyama_framework.md)
- [../../research/edge_routing.md](../../research/edge_routing.md)
- [../../research/dagre_readme.md](../../research/dagre_readme.md)
- [../../research/elk_readme.md](../../research/elk_readme.md)
- [../../research/d3_hierarchy_readme.md](../../research/d3_hierarchy_readme.md)

### Data seed

- [../../data/player-management-full-index.json](../../data/player-management-full-index.json)

## Relevant Contracts

- Deterministic graph contract in [../../SPEC.md](../../SPEC.md#graph-layout--edge-semantics-algorithm)
- Source-scope contract in [../../operations.md](../../operations.md#resolveprojectionscope)
- Registry interface in [../../interfaces.md](../../interfaces.md#internal-projectsourceregistry-interface)
- Concept detail enrichment contract in [../../queries.md](../../queries.md#getconceptdetailcard)
- UI behavior contract in [../../UI-SPEC.md](../../UI-SPEC.md#interaction-contract)

## Naming Constraints

- Task IDs use `TASK-KG-ALG-*` only.
- No reuse of prior `KG-IMP` series.
- Decision references use `D-KG-*` IDs present in [../../DECISIONS.md](../../DECISIONS.md).

## Link Graph Snapshot

| Anchor Node            | Outgoing Link Classes                                 | Primary Targets                                                       |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| SPEC capability tables | concept references, FR/AC/INV contracts, aspect links | domain, operations, queries, interfaces, mappings, workflows, UI-SPEC |
| operations rules       | rule/calculation IDs, state transitions               | states, events, interfaces                                            |
| queries outputs        | concept-detail/read-model fields                      | domain, mappings, UI-SPEC                                             |
| UI-SPEC interactions   | route/query-state transitions and component contracts | interfaces, queries, TEST-SPEC                                        |

## Matched Tags and Vocabulary

- Backend taxonomy: entity, value object, operation, query, mapping, workflow, policy, interface, event, state machine.
- UI taxonomy: page, layout, component, hook, binding, action, state indicator.
- Relationship vocabulary used: `queries`, `exposes`, `maps`, `orchestrates`, `transitions`, `fetches`, `mutates`, `reflects`, `contains`, `shapes`.

## Open Questions (Non-Blocking)

1. Which deterministic tie-breaker should be preferred when two edges share identical rank and weight after hierarchy assignment?
2. Should index-ingestion fallback prefer `SPEC` relationship tables or parser-derived merge when both are present but inconsistent?
3. Should concept enrichment expose rules inline in cards or in inspector-only payload for first release?

Tracking file: [02-cross-task-gaps-and-questions.md](02-cross-task-gaps-and-questions.md)

## Assumptions

- Poker-team index artifacts are reference baseline only and do not constrain source strategy exclusivity.
- Existing aspect docs remain canonical behavioral contracts even when prototype interaction details are used as planning anchor.
- This slice produces planning artifacts only.

# KG Work-Pack Context

## Feature Objective

Rebuild the Knowledge Graph feature as a source-agnostic, mirror-first capability where the same graph algorithm maps all features across all layers (`feature -> file -> concept`) for any registered documentation source.

This scope treats `validation/poker-team` as baseline/example evidence only and requires parity validation against additional source classes (including `implementation/domainspec/docs/features`).

Core behavior remains:

- cards mirror feature files,
- graph mirrors canonical concept relationships,
- clicking a concept resolves to its definition,
- concept detail card shows related context and relation evidence.

## Source of Truth

- [SPEC.md](../../SPEC.md)
- [domain.md](../../domain.md)
- [operations.md](../../operations.md)
- [queries.md](../../queries.md)
- [interfaces.md](../../interfaces.md)
- [mappings.md](../../mappings.md)
- [workflows.md](../../workflows.md)
- [events.md](../../events.md)
- [states.md](../../states.md)
- [UI-SPEC.md](../../UI-SPEC.md)
- [TEST-SPEC.md](../../TEST-SPEC.md)

## Scope In

- Source registry abstraction supporting non-exclusive project source strategy.
- Per-feature full-index ingestion for the selected source before graph derivation.
- Deterministic hierarchical layout across layers: `feature -> file -> concept`.
- Concept card enrichment with rules/descriptions when available in source docs.
- Required validation against at least two source classes: poker-team baseline + domainspec-core feature corpus.
- Backend projection pipeline from docs to cards and graph.
- Canonical relationship validation and endpoint resolution.
- Read and interaction API contracts.
- UI three-pane interaction surface (cards, graph, detail panel).
- Deterministic test obligations and pilot-readiness verification path.

## Scope Out (Initial current)

- Exclusive single-source strategy (for example poker-team-only ingestion mode).
- Unregistered filesystem crawling outside source registry contracts.
- Shared annotation/comment workflow.
- Auto-remediation of missing anchors.

## Hard Constraints

- Source selection MUST be registry-driven and non-exclusive; poker-team cannot be treated as the only supported source.
- Every selected source MUST ingest full feature index content before layout/edge derivation.
- Hierarchical layout order MUST remain deterministic as `feature -> file -> concept`.
- Concept cards MUST enrich with rules/descriptions when those fields are present in source docs.
- Required mirror cards must include `SPEC.md`, `domain.md`, and `operations.md`.
- Feature concept graph edges must use canonical labels from [RELATIONSHIPS.md](../../../../../RELATIONSHIPS.md).
- Every graph edge endpoint must resolve to a known concept ID in feature concept tables.
- Deep-link open must return explicit error diagnostics when target cannot be resolved.

## Required Validation Source Classes

| Source Class                              | Baseline Role                           | Required Coverage                                                    |
| ----------------------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `validation/poker-team`                   | Baseline/example evidence               | Demonstrate compatibility with current external project docs.        |
| `implementation/domainspec/docs/features` | Required non-baseline validation corpus | Prove source-agnostic behavior across framework-native feature docs. |

## Execution Streams

1. Stream A (backend projection): parser, canonical validation, projection storage.
2. Stream B (backend API): read contracts plus select/open interaction operations.
3. Stream C (UI): cards, graph, details, and definition navigation UX.
4. Stream D (cross-source algorithm): registry abstraction, full-index ingestion, deterministic hierarchy output, concept enrichment.
5. Stream E (verification): tests, readiness evidence, verify/alignment/layering audits with source-class parity evidence.

## legacy Reuse Inventory (Code Already Implemented)

### Reuse with adaptation

- [backend/src/server.ts](../../../../../backend/src/server.ts): Fastify app bootstrap, route registration pattern, and baseline health contract.
- [backend/src/server.test.ts](../../../../../backend/src/server.test.ts): inject harness pattern for endpoint-level contract tests.
- [apps/web/src/App.tsx](../../../../../apps/web/src/App.tsx): base component composition shell for feature surface insertion.
- [apps/web/src/main.tsx](../../../../../apps/web/src/main.tsx): client bootstrap and root render wiring.

### Reuse as-is

- No KG-specific reusable module remains as-is in current baseline; treat projection/graph contracts as fresh implementation from docs.

### Do not reuse unchanged

- Deleted legacy modules under `backend/src/knowledge-graph*.ts` and repository-import helpers must not be restored verbatim.
- Deleted legacy endpoint assumptions in UI hooks/components must not be reintroduced unless backed by current interfaces.
- `apps/web/src/hooks/useEdgeTypeProjection.ts` legacy contract `/knowledge-graph/projections/edge-types` must not be reused unless that route is explicitly implemented in this cycle.

## Success Criteria

- Required mirror cards are always present.
- Graph and cards remain synchronized to same snapshot.
- Graph projection supports full feature mapping across all registered source classes.
- Hierarchy remains deterministic as `feature -> file -> concept` across repeated runs.
- Concept cards expose rules/descriptions when available without source-specific branching.
- Concept click reliably opens definition pointer.
- Detail card always reflects selected concept and related edges.
- Validation evidence covers poker-team baseline and domainspec-core feature corpus.
- Pilot profile reaches PASS or explicit dated FLAG with action owners.
