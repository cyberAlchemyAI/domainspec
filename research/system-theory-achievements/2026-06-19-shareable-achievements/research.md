# System-Theory Achievements Evidence Pack

Date: 2026-06-19
Dispatch: 2026-06-19-domainspec-system-theory-achievements
Scope: implementation/domainspec evidence only

## Purpose

Collect local evidence for a shareable account of DomainSpec achievements through a system-theory, control, and governance lens.

This pack preserves the research boundary. It is not itself public copy. The shareable synthesis is in `findings.md`.

## Evidence Boundary

Included evidence:

- Files under `implementation/domainspec/`.
- Local source files, templates, tools, plans, docs, tests, and feature specs inside that submodule.

Excluded from shareable claims:

- Sibling repositories and paths outside `implementation/domainspec/`.
- Absolute local paths, emails, host-specific test fixture locations, or private workspace names.
- Unsupported claims of novelty, firstness, production proof, or full platform completion.
- Claims that a specified control loop is already continuously operating unless a source proves emitted signal, threshold comparison, intervention, and verified effect.

## Evidence Classes

The reviewers required these classes to stay separate:

1. Canonical semantics: taxonomy, relationships, templates, authority maps, definitions.
2. Specified control architecture: drift/convergence, Saturn loop, tuning loop, governance signals.
3. Executable but manually invoked tools: validators, analyzers, generators, pruning tools, retrieval prototypes.
4. Demonstrated proof points: only local slices with direct evidence, such as a committed drift report or tests for a implemented slice.

## Citation Map

### Architecture and Formalization

[A1] Typed representational grammar

Evidence:

- `TAXONOMY.md`
- `templates/SPEC.md`
- `README.md`
- `CHANGELOG.md`

Claim supported:

DomainSpec defines a typed representational grammar for backend and UI concepts. Feature specs are required to declare a Concept Registry and typed Feature Concept Graph.

Caveat:

Some summary documents still mention older 24/26 counts. Current count claims should cite the current taxonomy and relationship files directly.

[A2] Relationship grammar

Evidence:

- `RELATIONSHIPS.md`
- `backend/src/modules/knowledge-graph/infrastructure/markdown-canonical-edge-vocabulary.ts`

Claim supported:

DomainSpec defines a typed relationship vocabulary and has backend knowledge-graph code that reads the relationship file as canonical edge vocabulary.

[A3] Authority and drift adjudication

Evidence:

- `AUTHORITY-MAP.md`
- `DRIFT-CONVERGENCE.md`

Claim supported:

DomainSpec distinguishes authority surfaces for formal semantics, framework behavior, implementation plans, and per-feature truth. These authority rules make drift adjudicable by establishing which surface wins when representations conflict.

[A4] Spec-first pipeline and test derivation scaffold

Evidence:

- `README.md`
- `templates/SPEC.md`
- `tools/test-derivation-engine/README.md`

Claim supported:

DomainSpec describes a pipeline from taxonomy and relationships to specification, tests, implementation, and observability. The test-derivation engine has an L0 deterministic skeleton with stable obligation keys and round-trip comparison.

Caveat:

The test-derivation engine README says parser and derivation rules are typed stubs. Do not claim complete deterministic test derivation from arbitrary feature docs.

[A5] Template surface

Evidence:

- `templates/`

Claim supported:

DomainSpec ships templates for specs, architecture, UI specs, observability, test specs, implementation layering, work packs, and related artifacts. The templates encode typed concepts, relationships, source contracts, and downstream obligations.

[A6] Architecture pattern library

Evidence:

- `architecture/`
- `architecture/pattern-library/`

Claim supported:

DomainSpec includes an architecture pattern library with foundations, layering, dependency rules, testing alignment, observability alignment, per-concept cards, and a selective-context recipe.

[A7] System-theory framing boundary

Evidence:

- `GOVERNANCE-ATTENUATION.md`
- `DRIFT-CONVERGENCE.md`
- `docs/research/domainspec-paper.md`
- `docs/research/EXPERIMENTS.md`

Claim supported:

The strongest system-theory framing is cybernetic and control-oriented. The local paper itself marks C1, C3, and C4 as insufficiently evidenced and architectural/analytical rather than empirically validated; several experiments remain not started.

### Governance and Control

[B1] Saturn control-loop architecture

Evidence:

- `plan/SATURN-L-SYSTEM.md`
- `DRIFT-CONVERGENCE.md`

Claim supported:

DomainSpec documents a Saturn loop: observe, evaluate, decide, act, verify. It ties this loop to governance, objectives, telemetry, and Harness concepts.

Caveat:

This is a documented control architecture. The required building blocks include plan items that are not complete in the current dashboard.

[B2] Drift decomposition

Evidence:

- `DRIFT-CONVERGENCE.md`

Claim supported:

DomainSpec decomposes drift into semantic, contract, runtime, governance, and coordination drift, then maps those surfaces to build-time fidelity, runtime fidelity, governance/meta-health, async tuning, and closure progress.

[B3] Observability derivation rules

Evidence:

- `OBSERVABILITY.md`

Claim supported:

DomainSpec specifies observability derivation rules from states, operations, interfaces, events, queries, workflows, and feature specs.

Caveat:

This proves derivation rules, not deployed instrumentation coverage for every feature.

[B4] Runtime drift failure classes

Evidence:

- `OBSERVABILITY.md`

Claim supported:

DomainSpec names runtime drift failure classes such as invalid transitions, invariant violations, calculation drift, postcondition failures, idempotency breaches, event loss or stall, workflow failures, reconciliation mismatch, duplicate transactions, and monetary exposure.

Caveat:

These are specified failure classes, not necessarily observed production failures.

[B5] Governance signal schema

Evidence:

- `implementation/GOVERNANCE-SIGNALS.md`
- `templates/SIGNAL-SCHEMA.md`

Claim supported:

DomainSpec defines governance and meta-health signals, including layer fidelity, detection latency, governance execution time, role agreement, and cost efficiency.

[B6] Governance validation and analysis tools

Evidence:

- `tools/governance-attenuation-audit.ts`
- `tools/validate-governance-chain.ts`
- `tools/validate-signals.ts`
- `tools/analyze-signals.ts`

Claim supported:

DomainSpec includes local tools for governance-chain validation, signal/session completeness validation, and threshold analysis.

[B7] Governance-chain validation

Evidence:

- `tools/validate-governance-chain.ts`
- `plan/governance/GOV-01-axioms-constitution-tags-execution.md`

Claim supported:

DomainSpec can check whether constitution rules map to axioms and gates, and can flag orphaned axioms or missing gate mappings.

[B8] Signal loop and tuning design

Evidence:

- `TUNING-LOOP.md`
- `tools/analyze-signals.ts`
- `docs/signals/pipeline-signals.jsonl`

Claim supported:

DomainSpec specifies append-only signal collection, threshold analysis, escalation to reflection, and approved changes back into skills, agents, templates, or governance.

Caveat:

Evidence supports the design and tooling. It does not prove routine production tuning.

[B9] Governance pruning tooling

Evidence:

- `tools/prune-governance.ts`

Claim supported:

DomainSpec includes tooling intended to identify governance rules with insufficient supporting evidence, so governance can be reduced as well as added.

[B10] Meta-health reporting tooling

Evidence:

- `tools/generate-meta-health.ts`

Claim supported:

DomainSpec includes meta-health reporting for governance substrate measures.

Caveat:

At least one metric is explicitly `N/A` because lifecycle timestamps are not yet modeled.

[B11] Drift-comparison proof point

Evidence:

- `governance/tags/CODE-TAG-DRIFT-REPORT.agent-execution-orchestrator.md`
- `governance/tags/tools/compare-code-tag-drift.ts`

Claim supported:

One committed report demonstrates code-tag drift comparison for the agent-execution-orchestrator slice, with matched doc/code triples and zero mismatches.

Caveat:

This is one slice, not global drift-free evidence.

[B12] Fast observer tooling

Evidence:

- `tools/run-fast-observer.ts`
- `tools/detect-signals.ts`

Claim supported:

DomainSpec includes change-time observer tooling for detecting scope drift, missing anchors, unresolved markers, and related signals.

[B13] Governance maturity caveat

Evidence:

- `docs/research/EXPERIMENTS.md`
- `docs/research/experiments/E4-governance-attenuation-curve.md`
- `docs/research/domainspec-paper.md`

Claim supported:

Several governance and attenuation experiments are marked not started. The paper states that C1, C3, and C4 remain insufficiently evidenced pending experiments.

### Product, Agentic Harness, and Tooling

[C1] Unified product model

Evidence:

- `plan/DOMAINSPEC-UNIFIED-PRODUCT-VISION.md`
- `plan/context/CONTEXT-PRODUCT-OVERVIEW.md`
- `plan/infra/INFRA-PRODUCT-OVERVIEW.md`
- `plan/agentic/AGENTIC-PRODUCT-OVERVIEW.md`
- `plan/governance/GOVERNANCE-PRODUCT-OVERVIEW.md`
- `plan/harness/HARNESS-PRODUCT-OVERVIEW.md`

Claim supported:

DomainSpec has a unified product model that ties semantics, formal specs, derived quality, observability, context, infrastructure, agentic routing, governance, and harness into a single operating-loop vision.

Caveat:

This is product architecture and direction, not proof that the full platform is complete.

[C2] Role-aware execution contracts

Evidence:

- `plan/context/CTX-03-owner-role-assignment-cycle-001.md`
- `plan/context/CTX-03-initiative-vision-tracker.md`
- `plan/infra/INF-01-runtime-adapter-spec.md`
- `plan/infra/INF-02-telemetry-schema.md`

Claim supported:

DomainSpec formalizes role-aware execution through owner-role assignment, initiative ownership, and runtime/telemetry contracts that carry role and objective context.

[C3] Decision operations

Evidence:

- `plan/context/CTX-01-context-objective-prioritization.md`
- `docs/PROJECT-DECISIONS.md`

Claim supported:

DomainSpec formalizes decision operations including weighted prioritization, blocker overrides, dependency-first unblocking, explainability, and explicit project decisions.

[C4] Installable workflow pack

Evidence:

- `copilot/README.md`
- `copilot/INSTALL.md`
- `copilot/install.sh`
- `copilot/agents/domainspec-orchestrator.agent.md`
- `copilot/skills/domainspec-context-builder/SKILL.md`
- `plan/infra/INF-05-codex-runtime-distribution.md`

Claim supported:

DomainSpec has a packaged workflow distribution with an orchestrator, specialist agents and commands, a context-builder skill, delegation policy, and installer.

Caveat:

This supports distribution and routing contracts. It does not prove every workflow executes end to end in every host.

[C5] Governance-aware orchestration design

Evidence:

- `copilot/agents/domainspec-orchestrator.agent.md`
- `plan/agentic/AGT-01-orchestrator-interface.md`
- `plan/agentic/AGT-06-agent-skill-mutation-pipeline.md`
- `plan/agentic/AGT-07-dynamic-goal-amendment.md`

Claim supported:

DomainSpec orchestration design includes routing constraints, stage telemetry, stuck-subagent detection, and blocked-stage stopping.

[C6] Typed graph retrieval prototype

Evidence:

- `internal_tools/graph_retrieval/features/two-layer-retrieval/spec/SPEC.md`
- `internal_tools/graph_retrieval/intent.py`
- `internal_tools/graph_retrieval/compose.py`
- `internal_tools/graph_retrieval/retriever.py`
- `internal_tools/graph_retrieval/instrumented.py`
- `internal_tools/tests/test_two_layer_retrieval.py`
- `internal_tools/tests/test_observability.py`

Claim supported:

DomainSpec includes an internal typed two-layer retrieval prototype with intent taxonomy, intent-specific scoring, preserved typed edges, structured results, observability wrappers, and tests.

Caveat:

The retrieval prototype is internal and incomplete. Lens triangulation raises `NotImplementedError`, some tests reference a local fixture path, and the prototype is not yet productized.

[C7] Backend knowledge-graph slice

Evidence:

- `backend/src/modules/knowledge-graph/`
- `docs/features/knowledge-graph-visualization/interfaces.md`
- `docs/features/knowledge-graph-visualization/queries.md`

Claim supported:

DomainSpec has a backend knowledge-graph slice with routes, use cases, persistence, and deterministic API contracts.

[C8] Knowledge-graph productization slice

Evidence:

- `docs/features/knowledge-graph-visualization/UI-SPEC.md`
- `docs/features/knowledge-graph-visualization/STORIES.md`
- `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts`

Claim supported:

The knowledge-graph visualization slice has UI specification, user stories, and end-to-end journey tests.

[C9] Internal knowledge substrate

Evidence:

- `internal_tools/README.md`
- `internal_tools/pyproject.toml`
- `internal_tools/vault_common/frontmatter.py`
- `internal_tools/vault_common/edges.py`
- `internal_tools/vault_ctl/cli.py`
- `internal_tools/vault_telemetry/cli.py`

Claim supported:

DomainSpec includes internal knowledge tooling with shared frontmatter schema, edge extraction, invariant checking, telemetry CLI, and subsystem boundaries.

System role:

This is a memory and traceability substrate, not a control loop by itself.

[C10] Completion caveat

Evidence:

- `plan/COMPLETENESS-DASHBOARD.md`

Claim supported:

The full platform is not complete. The dashboard snapshot reports 8% overall completion, with Infra, Harness, Agentic, and Governance streams at 0%.

## Collected Returns

### Explorer A: Architecture and Formalization

Key points:

- DomainSpec has a typed concept grammar and a required feature graph surface.
- DomainSpec has a typed relationship grammar and backend code that reads relationship vocabulary.
- DomainSpec has an authority map that distinguishes formal semantics, implementation behavior, plan authority, and feature truth.
- DomainSpec has a spec-first pipeline and a deterministic test-derivation engine skeleton.
- DomainSpec ships a broad template surface and an architecture pattern library.
- System-theory claims are most supported around governance and control, not every framework claim.

Important caveats:

- Exact ontology counts evolved from older 24/26 summaries toward 25/29 surfaces.
- Sibling formalization paths cited in the raw return were excluded from the shareable evidence boundary.

### Explorer B: Governance and Control

Key points:

- DomainSpec documents a Saturn observe/evaluate/decide/act/verify loop.
- Drift is decomposed into semantic, contract, runtime, governance, and coordination drift.
- Observability derivation rules are specified from feature documentation surfaces.
- Governance signals and attenuation are modeled as first-class concerns.
- Governance validation, signal analysis, pruning, meta-health, and fast-observer tools exist.
- One code-tag drift report demonstrates a matched doc/code comparison for a specific slice.

Important caveats:

- Several governance items are plan-plus-tooling rather than demonstrated closed-loop production outcomes.
- Attenuation experiments remain not started.

### Explorer C: Product, Agentic Harness, and Tooling

Key points:

- DomainSpec has a unified product model for semantics, quality, observability, context, infrastructure, agentic routing, governance, and harness.
- Role-aware execution and decision operations are formalized in plan artifacts.
- DomainSpec has a packaged Copilot/workflow distribution with installer and orchestrator.
- Graph retrieval is a strong internal implemented prototype.
- Knowledge-graph backend/UI/e2e slices are tangible.
- Internal tools provide a knowledge substrate for traceability and retrieval.

Important caveats:

- The full product platform is not complete.
- Graph retrieval remains internal/prototype and has explicit gaps.

## Review Outcomes

### Non-vacuity Reviewer

Required revisions applied:

- Downgraded "closed-loop engineering system" to "structural prerequisites and selected implemented slices."
- Added completeness dashboard caveat.
- Reframed test-derivation engine as L0 skeleton with typed stubs.
- Reframed Saturn as documented control-loop architecture.
- Reframed observability as derivation rules, not deployed metric coverage.
- Reframed governance as schemas and local tools, not completed production tuning.
- Scoped Copilot and graph-retrieval claims.

### Definitional-Soundness Reviewer

Required revisions applied:

- Added a definition of "system-theory achievement."
- Preferred "cybernetic/control-oriented" over broad "systems thinking."
- Classified evidence into reference models, observed variables, comparators, actuators, feedback/adaptation paths, and proof points.
- Removed any implication that DomainSpec has already demonstrated a fully self-regulating platform.

## Accepted Thesis

DomainSpec's clearest system-theoretic achievement is not completion of a self-regulating engineering platform. It is the decomposition of software development into typed reference models, authority-ranked truth surfaces, observable drift variables, comparator tools, and specified feedback paths, plus selected implemented slices that show parts of the architecture can work locally.

## Claims To Avoid

- "First ever"
- "Complete self-regulating platform"
- "Production-proven closed loop"
- "All workflows execute end to end"
- "All governance is empirically validated"
- "Global drift-free codebase"
- Any shareable claim that depends on evidence outside `implementation/domainspec/`
