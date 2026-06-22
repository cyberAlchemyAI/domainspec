# DomainSpec System-Theory Achievements

Date: 2026-06-19
Evidence boundary: local `implementation/domainspec/` sources

## Summary

DomainSpec's strongest shareable achievement is not that it has completed a self-regulating software platform. The supported claim is more precise: DomainSpec defines structural prerequisites for a governed, observable, typed software-development system, and it has selected implemented slices inside that architecture.

The useful system-theory frame is cybernetic rather than generic. DomainSpec gives software work a control vocabulary:

- Reference models: typed concepts, typed relationships, feature specs, and authority maps.
- Observed variables: tests, runtime metrics, governance signals, drift reports, and meta-health measures.
- Comparators: derivation rules, validators, analyzers, and drift-comparison tools.
- Actuators: feature work, governance changes, pruning, agent routing, and human decisions.
- Adaptation paths: signal accumulation, threshold analysis, reflection, and approved framework changes.

This makes software governance structurally inspectable. It does not yet prove a continuously operating closed loop across the whole platform. [A1] [A2] [A3] [B1] [B2] [B6] [B13] [C10]

## What Counts Here As A System-Theory Achievement

In this document, a system-theory achievement means a concrete DomainSpec structure that maps to a control-system role: reference model, observed variable, comparator, actuator, feedback path, boundary, or adaptation rule.

Generic governance language does not count unless it identifies one of those roles.

## 1. Typed Reference Models

DomainSpec defines a typed representational grammar for software artifacts. Its taxonomy covers backend and UI concept types, and its feature specification template requires a Concept Registry and typed Feature Concept Graph. That makes feature meaning nameable and checkable rather than only implicit in prose or code. [A1]

DomainSpec also defines a typed relationship vocabulary across backend, UI, and cross-layer edges. The backend knowledge-graph code reads the relationship file as canonical edge vocabulary, so the model is connected to implementation machinery rather than existing only as documentation. [A2]

This is a reference-model achievement:

- typed concept vocabulary
- typed relationship vocabulary
- required feature concept graphs
- backend use of canonical edge vocabulary

Caveat: exact count claims should cite the current taxonomy and relationship files directly. Some summaries still reflect older counts. [A1]

## 2. Authority-Ranked Truth Surfaces

A governed system needs a way to decide what wins when its representations disagree. DomainSpec does this through an authority map: formal semantics, framework behavior, implementation plans, and per-feature truth have different sources of authority. [A3]

This does not control drift by itself. It makes drift adjudicable. When semantic, contract, runtime, governance, or coordination drift appears, DomainSpec has a documented way to ask which surface is authoritative for that kind of conflict. [A3] [B2]

This is a boundary and precedence achievement:

- authority map
- drift-surface decomposition
- source precedence for conflict resolution

## 3. Spec-First Derivation Architecture

DomainSpec's documented pipeline moves from taxonomy and relationships into feature specifications, tests, implementation, and observability. The SPEC template is the source for registry sync and typed graph declaration. [A4] [A5]

There is also a deterministic test-derivation engine scaffold. The safe claim is narrow: it has an L0 deterministic skeleton with stable obligation keys and round-trip comparison. The parser and derivation rules are still typed stubs. [A4]

This is a feed-forward derivation achievement:

- feature specs as typed source artifacts
- templates that connect specification to downstream quality obligations
- L0 deterministic derivation skeleton

Caveat: this should not be described as complete arbitrary-doc test derivation yet. [A4]

## 4. Documented Control-Loop Architecture

DomainSpec documents a Saturn loop: observe, evaluate, decide, act, verify. The loop is tied to governance, objectives, telemetry, Harness concepts, and drift convergence. [B1]

The important claim is architectural. DomainSpec documents and partially implements mechanisms intended to support control, but the full loop is not shown as continuously operating across the platform. The completion dashboard still shows several prerequisite streams as not started. [B1] [C10]

This is a control-architecture achievement:

- explicit observe/evaluate/decide/act/verify loop
- drift model connected to telemetry and governance
- Harness positioned as a human decision surface

Caveat: documented control architecture is not the same as production-proven closed-loop operation. [B1] [C10]

## 5. Observable Drift Variables

DomainSpec decomposes drift into semantic, contract, runtime, governance, and coordination drift. It also maps those surfaces to build-time fidelity, runtime fidelity, governance and meta-health, async tuning, and closure progress. [B2]

Its observability document specifies derivation rules from states, operations, interfaces, events, queries, workflows, and feature specs. Those rules define metrics and monitors for transitions, invariants, calculations, postconditions, event flow, workflows, and business signals. [B3]

It also names runtime drift failure classes such as invalid transitions, invariant violations, calculation drift, postcondition failures, idempotency breaches, event loss or stall, workflow failures, reconciliation mismatch, duplicate transactions, and monetary exposure. [B4]

This is a sensing achievement:

- named drift variables
- spec-derived observability rules
- explicit runtime failure classes

Caveat: these are derivation rules and specified failure classes. They should not be read as proof of deployed metric coverage for every feature. [B3] [B4]

## 6. Governance Schemas And Comparator Tools

DomainSpec treats governance as something that can itself be observed. Its governance signal model names layer fidelity, detection latency, governance execution time, role agreement, and cost efficiency. [B5]

It also includes local tools for governance-chain validation, signal validation, signal analysis, and governance attenuation auditing. The governance-chain validator can check whether constitution rules map to axioms and gates, and can flag orphaned axioms or missing gate mappings. [B6] [B7]

This is a comparator achievement:

- governance signal schemas
- validation and analysis tools
- governance-chain mapping checks
- threshold analysis foundations

Caveat: empirical governance attenuation and production tuning are not complete. Several experiments are still marked not started. [B13]

## 7. Pruning And Meta-Health Tooling

Governance systems often fail by accumulating more process than the system can actually use. DomainSpec includes tooling intended to prune governance rules when evidence does not justify their continued weight. [B9]

It also includes meta-health reporting tooling for governance substrate measures. At least one metric is explicitly unavailable because lifecycle timestamps are not yet modeled, so the safe claim is "tooling/design," not routine operational measurement. [B10]

This is an adaptation-support achievement:

- governance pruning tool
- meta-health report generator
- governance overhead treated as a measurable design concern

Caveat: pruning and meta-health should be described as tooling/design unless a specific executed report is cited. [B9] [B10]

## 8. A Local Drift-Comparison Proof Point

One committed report demonstrates a code-tag drift comparison for the agent-execution-orchestrator slice, with matched documentation/code triples and zero mismatches. The comparison tool is present in the governance tag tooling. [B11]

This is a demonstrated proof point:

- one slice compared
- doc/code triples matched
- zero mismatches in that report

Caveat: this is not evidence that all DomainSpec code and documentation are globally drift-free. [B11]

## 9. Role-Aware Decision Operations

DomainSpec has a unified product model that connects semantics, formal specs, derived quality, observability, context, infrastructure, agentic routing, governance, and Harness into one operating-loop vision. [C1]

Role-aware execution is formalized through owner-role assignment, initiative ownership, and runtime/telemetry contracts that carry role and objective context. Decision operations include weighted prioritization, blocker overrides, dependency-first unblocking, explainability, and explicit project decisions. [C2] [C3]

This is a decision-surface achievement:

- role and objective context in execution contracts
- owner-role assignment
- explicit prioritization and blocker logic
- project decision records

Caveat: this is product architecture plus local contracts. It is not proof that a full role-aware product system is running end to end. [C1] [C10]

## 10. Installable Workflow Distribution

DomainSpec has a packaged workflow distribution with an orchestrator, specialist agents and commands, a context-builder skill, delegation policy, and installer. [C4]

The orchestration design includes routing constraints, stage telemetry, stuck-subagent detection, and blocked-stage stopping. In control terms, this gives the workflow surface some routing and failure-stop behavior rather than leaving every action as an ad hoc prompt. [C5]

This is an actuator and routing achievement:

- installable workflow pack
- orchestrator and specialist command surface
- context-building skill
- installer
- routing and blocked-stage contracts

Caveat: the pack supports distribution and routing contracts. It should not be read as proof that every workflow executes end to end in every host. [C4] [C10]

## 11. Implemented Knowledge And Retrieval Slices

DomainSpec includes an internal typed two-layer retrieval prototype with intent taxonomy, intent-specific scoring, preserved typed edges, structured results, observability wrappers, and tests. [C6]

It also has a backend knowledge-graph slice with routes, use cases, persistence, and deterministic API contracts. The knowledge-graph visualization slice has UI specification, user stories, and end-to-end journey tests. [C7] [C8]

This is an implemented-slice achievement:

- internal typed graph retrieval prototype
- retrieval observability tests
- backend knowledge-graph routes and use cases
- UI spec, stories, and e2e tests for knowledge-graph visualization

Caveat: graph retrieval is internal and incomplete. Lens triangulation is not implemented, some tests reference local fixture paths, and the retrieval prototype is not yet productized. [C6]

## 12. Internal Knowledge Substrate

DomainSpec includes internal knowledge tooling with a shared frontmatter schema, edge extraction, invariant checking, telemetry CLI, and subsystem boundaries. [C9]

The system-theory role of this substrate is memory and traceability. It stores and checks the structure that later retrieval, validation, and governance tools depend on. It is not a control loop by itself. [C9]

This is a state-substrate achievement:

- structured frontmatter handling
- edge extraction
- invariant checking
- telemetry CLI
- subsystem boundaries

## Overall Finding

The safest shareable claim is:

DomainSpec has local evidence for a typed specification and governance substrate: canonical concept and edge vocabularies, feature graph templates, authority rules, observability and signal schemas, governance validators and analyzers, code-tag drift comparison, a packaged workflow distribution, a knowledge-graph product slice, and an internal two-layer retrieval prototype. The larger control-loop platform remains partially implemented rather than complete.

The system-theory contribution is therefore not a claim of completion. It is a decomposition of software development into control-relevant structures: reference models, authority boundaries, drift variables, sensors, comparators, actuators, and adaptation paths.

## Evidence Appendix

[A1] `TAXONOMY.md`; `templates/SPEC.md`; `README.md`; `CHANGELOG.md`

[A2] `RELATIONSHIPS.md`; `backend/src/modules/knowledge-graph/infrastructure/markdown-canonical-edge-vocabulary.ts`

[A3] `AUTHORITY-MAP.md`; `DRIFT-CONVERGENCE.md`

[A4] `README.md`; `templates/SPEC.md`; `tools/test-derivation-engine/README.md`

[A5] `templates/`

[A6] `architecture/`; `architecture/pattern-library/`

[A7] `GOVERNANCE-ATTENUATION.md`; `DRIFT-CONVERGENCE.md`; `docs/research/domainspec-paper.md`; `docs/research/EXPERIMENTS.md`

[B1] `plan/SATURN-L-SYSTEM.md`; `DRIFT-CONVERGENCE.md`

[B2] `DRIFT-CONVERGENCE.md`

[B3] `OBSERVABILITY.md`

[B4] `OBSERVABILITY.md`

[B5] `implementation/GOVERNANCE-SIGNALS.md`; `templates/SIGNAL-SCHEMA.md`

[B6] `tools/governance-attenuation-audit.ts`; `tools/validate-governance-chain.ts`; `tools/validate-signals.ts`; `tools/analyze-signals.ts`

[B7] `tools/validate-governance-chain.ts`; `plan/governance/GOV-01-axioms-constitution-tags-execution.md`

[B8] `TUNING-LOOP.md`; `tools/analyze-signals.ts`; `docs/signals/pipeline-signals.jsonl`

[B9] `tools/prune-governance.ts`

[B10] `tools/generate-meta-health.ts`

[B11] `governance/tags/CODE-TAG-DRIFT-REPORT.agent-execution-orchestrator.md`; `governance/tags/tools/compare-code-tag-drift.ts`

[B12] `tools/run-fast-observer.ts`; `tools/detect-signals.ts`

[B13] `docs/research/EXPERIMENTS.md`; `docs/research/experiments/E4-governance-attenuation-curve.md`; `docs/research/domainspec-paper.md`

[C1] `plan/DOMAINSPEC-UNIFIED-PRODUCT-VISION.md`; layer product overviews under `plan/`

[C2] `plan/context/CTX-03-owner-role-assignment-cycle-001.md`; `plan/context/CTX-03-initiative-vision-tracker.md`; `plan/infra/INF-01-runtime-adapter-spec.md`; `plan/infra/INF-02-telemetry-schema.md`

[C3] `plan/context/CTX-01-context-objective-prioritization.md`; `docs/PROJECT-DECISIONS.md`

[C4] `copilot/README.md`; `copilot/INSTALL.md`; `copilot/install.sh`; `copilot/agents/domainspec-orchestrator.agent.md`; `copilot/skills/domainspec-context-builder/SKILL.md`; `plan/infra/INF-05-codex-runtime-distribution.md`

[C5] `copilot/agents/domainspec-orchestrator.agent.md`; `plan/agentic/AGT-01-orchestrator-interface.md`; `plan/agentic/AGT-06-agent-skill-mutation-pipeline.md`; `plan/agentic/AGT-07-dynamic-goal-amendment.md`

[C6] `internal_tools/graph_retrieval/features/two-layer-retrieval/spec/SPEC.md`; `internal_tools/graph_retrieval/intent.py`; `internal_tools/graph_retrieval/compose.py`; `internal_tools/graph_retrieval/retriever.py`; `internal_tools/graph_retrieval/instrumented.py`; `internal_tools/tests/test_two_layer_retrieval.py`; `internal_tools/tests/test_observability.py`

[C7] `backend/src/modules/knowledge-graph/`; `docs/features/knowledge-graph-visualization/interfaces.md`; `docs/features/knowledge-graph-visualization/queries.md`

[C8] `docs/features/knowledge-graph-visualization/UI-SPEC.md`; `docs/features/knowledge-graph-visualization/STORIES.md`; `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts`

[C9] `internal_tools/README.md`; `internal_tools/pyproject.toml`; `internal_tools/vault_common/frontmatter.py`; `internal_tools/vault_common/edges.py`; `internal_tools/vault_ctl/cli.py`; `internal_tools/vault_telemetry/cli.py`

[C10] `plan/COMPLETENESS-DASHBOARD.md`
