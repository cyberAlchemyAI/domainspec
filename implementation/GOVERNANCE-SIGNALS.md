# GOVERNANCE-SIGNALS.md — Schema for Inner & Outer Loop Metrics

This document defines the signal schema for DomainSpec's governance loops — what metrics capture "what is going wrong" in domain operations, how they flow to stakeholders and agents, and how they drive decisions.

Canonical drift/convergence reference:

- [../DRIFT-CONVERGENCE.md](../DRIFT-CONVERGENCE.md)

---

## Overview: The Dual-Loop Model

```
┌─ Inner Loop (L1→L2→L6) ────────────────┐
│  Domain Concept → Test Derivation       │
│  Test → Coverage Metrics                │
│  Production → Observability Signals     │
│  ↓                                      │
│  INNER SIGNALS (observation phase)      │
└──────────────────────────────────────────┘
        ↓ (signal aggregation, E7)
┌─ Signal Analysis (L6) ──────────────────┐
│  M-001: Orphan Rate (concept usage)     │
│  M-002: Attenuation Curve (layer decay) │
│  M-003: Role Disagreement (agent consensus) │
│  M-004: Cost per Decision (token budget) │
│  M-005: Test Failure Rate (quality)     │
│  M-006: Discovery Efficiency (knowledge nav) │
└──────────────────────────────────────────┘
        ↓ (decision trigger, L5)
┌─ Outer Loop (L3→L6→L3) ─────────────────┐
│  Stakeholder: See vision-drift → adjust │
│  PO: See coverage gaps → propose features │
│  Dev: See composition stress → refactor  │
│  QA: See test gaps → request edge cases  │
│  Framework: See attenuation → intervene  │
└──────────────────────────────────────────┘
        ↓ (improvement, E8)
      (Framework evolution via A6 + C10)
```

---

## Inner Loop Signals

Signals that capture what's happening in domain operations and test execution. These are collected live from poker-team features.

### Signal Category: Concept Drift

**What it measures:** Domain definitions are changing faster than implementations can follow.

| Signal ID | Name                         | Definition                                                                                                  | Collection Point                                                 | Success Threshold                           | Interpretation                                              |
| --------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| IS-001    | Concept Definition Stability | Number of changes to a concept's definition (bounded context, operations, rules, postconditions) per sprint | Feature spec update logs (`docs/features/*/SPEC.md` git history) | ≤1 change per concept per 2-week sprint     | ≤1 is stable; >2 indicates high uncertainty                 |
| IS-002    | Cross-Context Edge Changes   | Number of new or deleted relationships between bounded contexts per sprint                                  | Experiment E9 data (cross-feature edges) or git diffs to SPEC.md | ≤1 new edge per feature per sprint          | Stable composition; >3 indicates refactoring strain         |
| IS-003    | Postcondition Modifications  | Edits to "guarantee" sections of operations per sprint                                                      | Ops section edit history                                         | ≤1 per operation per sprint                 | Stable contracts; frequent changes = uncertain requirements |
| IS-004    | Vocabulary Churn             | Concepts added vs removed vs deprecated per sprint                                                          | CHANGELOG.md tracking (see Feature Changelog Policy)             | Additions ≥ Removals (always growing vocab) | Removal > Addition = concept retirement (planned or crisis) |

### Signal Category: Coverage Gaps

**What it measures:** Derived tests don't cover all domain scenarios.

| Signal ID | Name                        | Definition                                                                          | Collection Point                                 | Success Threshold                        | Interpretation                                    |
| --------- | --------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------- |
| IS-005    | Uncovered Rules             | Rules defined in `operations.md` that have no corresponding test case               | Derived test suite vs SPEC.md audit (E2)         | 0 uncovered rules                        | Any uncovered rule = test derivation gap          |
| IS-006    | Uncovered State Transitions | State transitions in `states.md` or workflows without happy-path + negative tests   | Test coverage report                             | 100% transition coverage                 | Missing negatives = edge case risk                |
| IS-007    | Edge Case Discovery Rate    | Number of QA-discovered edge cases that derived tests missed, per feature           | QA test reports + derived test suite comparison  | Edge cases ≤ 5% of total test suite      | High discovery rate = derivation rules incomplete |
| IS-008    | API Contract Gaps           | Endpoints (GET /resource/{id}) with missing status code tests (404, 403, 422, etc.) | Derived test inventory vs OpenAPI/interface defs | All documented status codes have ≥1 test | Missing status tests = incomplete error handling  |

### Signal Category: Composition Stress

**What it measures:** Cross-feature interactions are breaking under expected load patterns.

| Signal ID | Name                           | Definition                                                                              | Collection Point                                  | Success Threshold                    | Interpretation                        |
| --------- | ------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------ | ------------------------------------- |
| IS-009    | Cross-Feature Event Failures   | Events triggered by BC1 that BC2 fails to handle, per sprint                            | Integration test failures + event stream logs     | 0 cross-feature event failures       | >0 = composition boundary broken      |
| IS-010    | Saga Compensation Rate         | Distributed transactions requiring rollback, as % of all sagas                          | Observability system (OpenTelemetry), Saga metric | <5% of sagas require compensation    | >10% = saga design is fragile         |
| IS-011    | Cross-Context Data Consistency | Updates to shared value objects propagated across contexts with ≤100ms lag              | Transaction logs + eventual consistency audit     | 100% eventual consistency within SLA | Violations indicate race conditions   |
| IS-012    | Composition Pattern Violation  | Observed edge relationships (IS-002) that violate P1-P6 patterns (see TEST-PIPELINE.md) | E9-style analysis on live features                | 0 pattern violations                 | Violations = undocumented composition |

### Signal Category: Test Execution Health

**What it measures:** How well test suites are catching real failures.

| Signal ID | Name                | Definition                                                                           | Collection Point                 | Success Threshold           | Interpretation                                 |
| --------- | ------------------- | ------------------------------------------------------------------------------------ | -------------------------------- | --------------------------- | ---------------------------------------------- |
| IS-013    | Test Failure Rate   | % of tests failing on main branch, per feature                                       | CI/CD pipeline (`test-results/`) | 0% failures on main         | >0% = regressions introduced                   |
| IS-014    | Flaky Test Count    | Tests that pass/fail non-deterministically (Stryker mutation, network mocks, timing) | Test infrastructure metrics      | ≤1% of test suite is flaky  | High flakiness = test reliability crisis       |
| IS-015    | Mutation Kill Rate  | % of injected mutations caught by derived tests (Stryker)                            | Mutation testing reports (E3)    | ≥85% for derived tests      | <70% = tests missing assertions                |
| IS-016    | Test Execution Time | Time to run full feature test suite                                                  | CI/CD logs                       | <30 sec for typical feature | >5 min = test suite bloat or inefficient setup |

---

## Outer Loop Signals: Meta-Health Metrics

Aggregate metrics that measure framework health, governance fidelity, and agent decision-making quality.

### Signal Category: Concept Coverage

**What it measures:** Are domain concepts being exercised by features?

| Signal ID | Name                        | Definition                                                                                                                           | Collection Point                                          | Success Threshold              | Interpretation                                                                     | Hypothesis                      |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------- |
| M-001     | Orphan Rate                 | % of concepts defined in `SPEC.md` that are not referenced by any feature's tests (operation calls, state transitions, calculations) | Derived test inventory + SPEC.md cross-reference          | Orphan rate → 0 over time      | High orphan rate = unused vocabulary; trending to 0 = C4 (self-governance) working | E8 validates trend              |
| M-002     | Coverage Saturation         | % of DomainSpec meta-types (24 types) exercised by feature tests across all features                                                 | Meta-type coverage audit (E6-like analysis on production) | ≥95% of 24 types covered       | If <90%, some meta-type patterns never tested; gap in derivation rules             | E1, E6 validate threshold       |
| M-003     | Cross-Feature Concept Reuse | % of concepts shared across feature boundaries                                                                                       | Cross-feature reference audit                             | 20–40% reuse (domain coupling) | <10% = fragmented domain; >60% = tight coupling                                    | E9 measures this in live system |

### Signal Category: Governance Attenuation

**What it measures:** Does governance fidelity decrease as layers accumulate?

| Signal ID | Name                           | Definition                                                                                                                         | Collection Point                                           | Success Threshold                                                                                | Interpretation                                                                          | Hypothesis                                |
| --------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| M-004     | Layer Fidelity Curve           | Agent compliance rate per governance layer (L3 constitution, L6 enforcement gates, L7 pipeline steps), plotted against layer count | Multi-layer feature deployment logs + agent decision audit | Fidelity curve stays ≥80% across L3–L7 (no attenuation, OR attenuation reversed by intervention) | Declining curve = C3 attenuation present; flat curve = structural interventions working | E4, E5 measure intervention effectiveness |
| M-005     | Signal Detection Latency       | Time from problem occurrence in production to signal being observable in M-001–M-006, in minutes                                   | Observability system timestamps (OpenTelemetry)            | <5 min latency (near real-time detection)                                                        | >30 min = governance loop is too slow to respond                                        | E7 measures this                          |
| M-006     | Governance Rule Execution Time | Time for each governance gate (C1, C5, C10, etc.) to execute, in ms                                                                | Agent execution logs                                       | <100ms per gate (not on critical path)                                                           | >500ms = gates become bottleneck                                                        | E12 measures intervention latency         |

### Signal Category: Role Coordination

**What it measures:** Do stakeholder roles (PO, QA, Dev, Stakeholder) reach consensus on decisions?

| Signal ID | Name                         | Definition                                                                                              | Collection Point                                  | Success Threshold                       | Interpretation                                                  | Hypothesis                          |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------- | ----------------------------------- |
| M-007     | PO-Dev Priority Agreement    | % of feature priorities where PO agent and Dev agent agree on story order and task decomposition        | Multi-agent feature discovery logs (E13-E16 data) | ≥80% agreement                          | <60% agreement = role conflict, unclear domain semantics        | E13 validates role protocols        |
| M-008     | QA-Dev Coverage Agreement    | % of edge cases identified by QA agent that Dev agent's code already handles                            | QA proposal + implementation audit                | ≥80% (QA suggests, Dev already covered) | <50% = QA discovering gaps derivation missed                    | E13 measures convergence            |
| M-009     | Stakeholder-System Alignment | % of system metrics (M-001–M-008) trending toward stakeholder goals (e.g., lower cost, higher coverage) | Stakeholder decision logs vs metric trends        | >70% of metrics trending favorably      | Low alignment = governance not responsive to stakeholder intent | E18 validates human-agent alignment |

### Signal Category: Cost & Efficiency

**What it measures:** Token budgets and decision costs per agent role.

| Signal ID | Name                            | Definition                                                                                         | Collection Point                | Success Threshold                               | Interpretation                                                         | Hypothesis                    |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------- |
| M-010     | Cost per Feature Discovery      | Tokens consumed by PO + QA + Dev agents to discover and spec one feature end-to-end                | Agent telemetry (LLM call logs) | <50k tokens per feature                         | <30k = excellent; 50–100k = acceptable; >100k = verbose agents         | E17 measures cost efficiency  |
| M-011     | Token Attribution per Role      | Tokens consumed per agent role as % of total; e.g., PO: 35%, QA: 25%, Dev: 40%                     | Agent role telemetry            | Role distribution reflects decision authority   | Skewed distribution = bottleneck role consuming most tokens            | E17 enables role optimization |
| M-012     | Knowledge Navigation Efficiency | Token cost to query the knowledge graph (SPEC.md, inventory, architecture docs) per agent decision | Query cost telemetry (E15 data) | <2000 tokens per navigation query               | >5000 = nav queries too expensive; indicates inventory/indexing issues | E15 validates reuse savings   |
| M-013     | Cost ROI per Feature            | Feature value delivered (story points / business value) ÷ cost-per-discovery (M-010)               | Product roadmap + agent costs   | ROI > 1.5 (value delivered outpaces agent cost) | ROI <1 = automation may not justify cost                               | E17 cost-benefit analysis     |

---

## Signal Flow: From Inner Loop to Decisions

### For Stakeholders (Vision & Strategy)

1. **Observe:** M-001 (orphan rate), M-003 (concept reuse), M-009 (alignment)
2. **Interpret:** "Core concepts are unused" (M-001 high) or "domain is fragmenting" (M-003 low)
3. **Decide:** Retire unused concepts (Axiom A6), refactor domain boundaries (Constitution Rule C7), or pivot feature roadmap

### For Product Owners

1. **Observe:** IS-004 (vocabulary churn), M-007 (priority agreement), M-010 (cost per feature)
2. **Interpret:** "Requirements are unstable" (high churn) or "Dev agent is expensive relative to value" (cost ROI low)
3. **Decide:** Stabilize spec before more features, invest in domain clarity, or adjust agent tuning

### For QA

1. **Observe:** IS-005–IS-008 (coverage gaps), IS-014 (flaky tests), M-008 (QA-Dev agreement)
2. **Interpret:** "Derived tests miss edge cases" (IS-007 high) or "test suite is fragile" (flakiness high)
3. **Decide:** Request derivation rule improvements (E2 input), run mutation testing (E3), propose edge case tests

### For Developers

1. **Observe:** IS-009–IS-012 (composition stress), IS-016 (test time), M-004 (governance latency)
2. **Interpret:** "Features are tightly coupled" (edge failures high) or "governance is slowing us down" (latency high)
3. **Decide:** Refactor aggregate boundaries (IS-012 reduction), optimize test performance, or request governance intervention

### For the Framework (Meta-Loop, E8)

1. **Observe:** M-001 (orphan rate), M-002 (coverage saturation), M-004 (attenuation curve)
2. **Compute:** Trends over time; flag if orphan rate is not decreasing or attenuation is increasing
3. **Act:** Apply Axiom A6 (retireunused concepts), Constitution Rule C10 (prune governance), or trigger Phase advances

---

## Signal Instrumentation Plan

### Phase 1 Implementation (Weeks 1-2)

Deploy collection for IS-001–IS-008, M-001–M-006 (inner loop + core meta health):

| Instrumentation                       | Agent/System        | Data Source                                   | Effort                           |
| ------------------------------------- | ------------------- | --------------------------------------------- | -------------------------------- |
| Concept definition stability (IS-001) | Researcher          | Git history of `docs/features/*/SPEC.md`      | Low (git grep)                   |
| Cross-context edge tracking (IS-002)  | E9 experiment agent | E9 JSONL data + live SPEC audits              | Low (already have E9 data)       |
| Test failure rate (IS-013)            | CI/CD pipeline      | GitHub Actions test reports                   | Low (parse existing logs)        |
| Orphan rate (M-001)                   | Audit agent         | Meta-type census + feature test refs          | Medium (build coverage auditor)  |
| Attenuation curve (M-004)             | Multi-layer audit   | Agent compliance per layer, K-fold by feature | Medium (needs agent log parsing) |

### Phase 2 Implementation (Weeks 3-4)

Add M-007–M-009 (role coordination) once agents exist:

| Instrumentation              | Requires           | Data Source                       | Effort                           |
| ---------------------------- | ------------------ | --------------------------------- | -------------------------------- |
| Role agreement (M-007–M-009) | PO, QA, Dev agents | Feature discovery logs (E13, E16) | High (agents must log decisions) |

### Phase 3 Implementation (Weeks 5-6)

Add cost/efficiency metrics (M-010–M-013):

| Instrumentation                  | Requires                 | Data Source                                  | Effort                       |
| -------------------------------- | ------------------------ | -------------------------------------------- | ---------------------------- |
| Token attribution (M-010–M-011)  | Agent telemetry          | LLM call logs (system prompts, token counts) | High (agent SDK integration) |
| Knowledge nav efficiency (M-012) | Inventory system working | Query cost telemetry (E15 validation)        | Medium (once inventory live) |

---

## Thresholds & Alerting

When to escalate signals to human review:

| Signal                    | Red (escalate immediately) | Yellow (track closely) | Green (nominal) |
| ------------------------- | -------------------------- | ---------------------- | --------------- |
| IS-013: Test failure rate | >5% on main                | 2–5%                   | <2%             |
| M-001: Orphan rate        | Increasing                 | Flat                   | Decreasing      |
| M-004: Attenuation curve  | Fidelity <60%              | 60–80%                 | >80%            |
| M-007: Role agreement     | <50%                       | 50–80%                 | >80%            |
| M-010: Cost per feature   | >150k tokens               | 100–150k               | <100k           |

Red signals block feature deployments and trigger governance interventions (E5-style experiment).

---

## Mapping to Experiments & Paper Claims

| Signal Group                  | Experiments     | Paper Claims                      | Use Case                                   |
| ----------------------------- | --------------- | --------------------------------- | ------------------------------------------ |
| IS-001–004 (Concept Drift)    | E1, E6, E8      | C2 (derivation completeness)      | Validate vocabulary sufficiency            |
| IS-005–008 (Coverage Gaps)    | E2, E3, E7      | C2 (test derivation)              | Validate derived tests are complete        |
| IS-009–012 (Composition)      | E9              | §9.2 (composition patterns)       | Validate cross-feature structure           |
| IS-013–016 (Test Health)      | E3, E7          | C2 (test quality)                 | Validate mutation effectiveness            |
| M-001–003 (Concept Coverage)  | E8, E6          | C4 (self-governance), C2          | Validate orphan rate trends to 0           |
| M-004–006 (Attenuation)       | E4, E5, E7, E12 | C3 (governance attenuation)       | Validate attenuation curve + interventions |
| M-007–009 (Role Coordination) | E13, E16, E18   | C1 (multi-agent governance)       | Validate agent role convergence            |
| M-010–013 (Cost & Efficiency) | E17, E15        | §9.4(d) (productivity comparison) | Validate cost savings hypothesis           |

---

## References

- OpenTelemetry: https://opentelemetry.io/
- Stryker: https://stryker-mutator.io/
- DomainSpec AXIOMS.md: axioms A1–A6
- DomainSpec CONSTITUTION.md: rules C1–C11
- Feature Changelog Policy: see copilot-instructions.md
