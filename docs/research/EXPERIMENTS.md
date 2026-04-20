# DomainSpec — Experiment Design & Data Collection Plan

This document defines the experiments needed to strengthen the empirical evidence in the DomainSpec research paper. Each experiment maps to a specific paper claim, defines a protocol, expected data output, and success criteria.

---

## Overview

| ID  | Experiment                            | Paper Claim                               | Priority | Effort |
| --- | ------------------------------------- | ----------------------------------------- | -------- | ------ |
| E1  | Derivation Determinism                | C2 — same spec → same tests               | P0       | Low    |
| E2  | Derivation vs Manual Coverage         | C2 — derived tests ≥ manual tests         | P0       | Medium |
| E3  | Mutation Testing Effectiveness        | C2 — derived tests catch real faults      | P0       | Medium |
| E4  | Governance Attenuation Curve          | C3 — fidelity decreases with layer count  | P0       | High   |
| E5  | Observer-Executor Separation Impact   | C3 — intervention restores fidelity       | P1       | Medium |
| E6  | Vocabulary Sufficiency Across Domains | C2 — 24 types cover business domains      | P1       | High   |
| E7  | Signal Emission Rate Tracking         | C3/C4 — empirical attenuation measurement | P0       | Low    |
| E8  | Meta-Health Convergence               | C4 — M-001 orphan rate trends toward 0    | P1       | Low    |
| E9  | Cross-Feature Composition Stress      | §9.2 — composition gaps                   | P2       | Medium |
| E10 | Developer Productivity Comparison     | §9.4(d) — DomainSpec vs freeform          | P2       | High   |

---

## E1: Derivation Determinism

**Claim:** Given the same concept graph G and rule set Δ, the derivation function produces identical test obligations on every invocation.

### Protocol

1. Select 3 features with varying complexity: `auth-access-control` (12 concepts), `player-management` (14 concepts), `financial-settlement` (18 concepts).
2. Run the test derivation pipeline 10 times per feature, each in a fresh agent session.
3. For each run, capture the full list of derived test obligation IDs, names, and cardinalities.
4. Compute pairwise Jaccard similarity between all 10 runs for each feature.

### Data Collected

| Column                   | Type     | Description                      |
| ------------------------ | -------- | -------------------------------- | --- | ------------ |
| `feature_id`             | string   | Feature under test               |
| `run_number`             | int      | 1–10                             |
| `agent_session_id`       | string   | Unique session identifier        |
| `test_obligations`       | string[] | Ordered list of derived test IDs |
| `obligation_count`       | int      |                                  | T   | for this run |
| `derivation_rules_fired` | object   | Count per δ rule                 |
| `timestamp`              | ISO 8601 |                                  |

### Success Criteria

- Jaccard similarity = 1.0 across all 10 runs for each feature (perfect determinism).
- If any run deviates: classify deviation as (a) rule ambiguity, (b) agent hallucination, (c) concept graph interpretation error. Record root cause.

### Control

- Run the same 3 features with a bare LLM prompt ("write tests for this feature spec") 10 times. Measure Jaccard similarity. This establishes the stochastic baseline.

---

## E2: Derivation vs Manual Coverage

**Claim:** Deterministic derivation produces test coverage ≥ manually authored tests, with higher traceability.

### Protocol

1. For each of the 7 features, have a human tester independently write a test plan from the same spec docs (without seeing derived tests). Time-box at 30 min per feature.
2. Compare derived test set (D) vs manual test set (M) on:
   - **Count:** |D| vs |M|
   - **Coverage overlap:** |D ∩ M| / |D ∪ M|
   - **Unique to derivation:** D \ M (what derivation catches that humans miss)
   - **Unique to manual:** M \ D (what humans catch that derivation misses)
   - **Traceability:** % of tests traceable to a specific spec line

### Data Collected

| Column                  | Type     | Description                       |
| ----------------------- | -------- | --------------------------------- | ----- | --- |
| `feature_id`            | string   |                                   |
| `derived_count`         | int      |                                   | D     |     |
| `manual_count`          | int      |                                   | M     |     |
| `overlap_count`         | int      |                                   | D ∩ M |     |
| `derived_unique`        | string[] | Tests in D but not M, categorized |
| `manual_unique`         | string[] | Tests in M but not D, categorized |
| `derived_traceable_pct` | float    | % of D with spec line reference   |
| `manual_traceable_pct`  | float    | % of M with spec line reference   |
| `human_time_minutes`    | int      | Time spent on manual plan         |

### Success Criteria

- |D| ≥ |M| for ≥ 6/7 features.
- `derived_traceable_pct` > 95%.
- `manual_traceable_pct` < 80% (hypothesis: humans rarely write traceability links).
- D \ M reveals at least 1 non-trivial test category per feature (e.g., negative state transitions, idempotency checks).

---

## E3: Mutation Testing Effectiveness

**Claim:** Derived tests have meaningful fault-detection capability, not just high count.

### Protocol

1. For each feature's backend domain code, run a mutation testing tool (Stryker for TypeScript).
2. Measure mutation score (killed / total mutants) for:
   - (a) Derived test suite only
   - (b) Current manually-written test suite only (existing tests in repo)
   - (c) Combined suite
3. Classify surviving mutants by category: trivial (cosmetic/logging), moderate (edge case), critical (business rule violation).

### Data Collected

| Column                    | Type   | Description                                |
| ------------------------- | ------ | ------------------------------------------ |
| `feature_id`              | string |                                            |
| `total_mutants`           | int    | Total mutations generated                  |
| `killed_by_derived`       | int    | Mutants killed by derived tests            |
| `killed_by_manual`        | int    | Mutants killed by existing tests           |
| `killed_by_combined`      | int    | Mutants killed by both                     |
| `mutation_score_derived`  | float  | killed_by_derived / total_mutants          |
| `mutation_score_manual`   | float  | killed_by_manual / total_mutants           |
| `mutation_score_combined` | float  |                                            |
| `survivors_critical`      | int    | Surviving mutants affecting business rules |
| `survivors_moderate`      | int    |                                            |
| `survivors_trivial`       | int    |                                            |

### Success Criteria

- `mutation_score_derived` ≥ 70% for all features.
- `mutation_score_derived` ≥ `mutation_score_manual` for ≥ 5/7 features.
- `survivors_critical` = 0 for derived tests (all business rule mutants are caught).

---

## E4: Governance Attenuation Curve

**Claim:** Per-rule compliance rate decreases as total governance instruction count increases, bounded by channel capacity.

### Protocol

1. Create 5 instruction-set variants with increasing governance density:
   - **V1 (minimal):** Agent definition only, no governance rules (baseline)
   - **V2 (light):** Agent + 3 core rules (document-first, type-safety, derivation)
   - **V3 (moderate):** Agent + 6 axiom-level rules
   - **V4 (heavy):** Agent + 11 constitution rules + 6 axioms
   - **V5 (overloaded):** V4 + 10 additional procedural instructions (signal emission, formatting, naming conventions, etc.)
2. For each variant, run 10 pipeline sessions on the same feature (`financial-settlement`).
3. For each session, score compliance on every rule present (binary: followed / not followed).
4. Compute per-rule compliance rate = (times followed) / (times applicable).
5. Plot: x-axis = total rule count, y-axis = average per-rule compliance rate.

### Data Collected

| Column                    | Type    | Description                      |
| ------------------------- | ------- | -------------------------------- |
| `variant`                 | V1–V5   | Instruction set                  |
| `rule_count`              | int     | Total rules in instruction set   |
| `session_id`              | string  |                                  |
| `rule_id`                 | string  | Individual rule being measured   |
| `compliant`               | boolean | Was this rule followed?          |
| `evidence`                | string  | How compliance was determined    |
| `session_total_rules`     | int     | Rules applicable in this session |
| `session_compliant_rules` | int     | Rules actually followed          |

### Success Criteria

- Average per-rule compliance for V1 > V2 > V3 > V4 > V5 (monotonic decrease).
- The curve shape matches the Shannon capacity model: gradual decline through V3, then steeper decline in V4–V5.
- Identify the inflection point k\* where adding rules starts hurting more than helping.

### Analysis

- Fit the data to: $C(k) = B \cdot \log_2(1 + S/(N_0 + \alpha k))$ where k = rule count.
- Extract fitted parameters B, S, N₀, α.
- Compare fitted k\* against the theoretical prediction of 6–7 from Miller/Ashby.

---

## E5: Observer-Executor Separation Impact

**Claim:** Splitting observation from execution restores governance fidelity.

### Protocol

1. **Control group (unified):** Run 10 pipeline sessions where the executor agent also emits signals (current behavior).
2. **Treatment group (separated):** Run 10 pipeline sessions with the same executor but add a separate observer agent that reads session output and produces signals independently.
3. For both groups, measure:
   - Signal emission rate = (signals emitted) / (signals expected based on session activity)
   - Signal accuracy = (accurate signals) / (signals emitted), judged by human review
   - Governance gap detection rate = (gaps detected) / (gaps present), with ground truth from human audit

### Data Collected

| Column                     | Type                | Description                             |
| -------------------------- | ------------------- | --------------------------------------- |
| `group`                    | unified / separated |                                         |
| `session_id`               | string              |                                         |
| `signals_expected`         | int                 | Human-assessed expected signal count    |
| `signals_emitted`          | int                 | Actually emitted                        |
| `signals_accurate`         | int                 | Correctly describe real issues          |
| `signals_false_positive`   | int                 | Describe non-issues                     |
| `governance_gaps_present`  | int                 | Human-identified ground truth           |
| `governance_gaps_detected` | int                 | Detected by signal system               |
| `executor_context_tokens`  | int                 | Token usage by executor                 |
| `observer_context_tokens`  | int                 | Token usage by observer (0 for unified) |
| `total_cost`               | float               | Combined API cost                       |

### Success Criteria

- Separated group signal emission rate ≥ 2× unified group.
- Separated group governance-gap detection rate ≥ 60% (vs current ~30–40%).
- Cost overhead of observer agent ≤ 20% of total session cost.

---

## E6: Vocabulary Sufficiency Across Domains

**Claim:** The 24 meta-type vocabulary covers common business domain semantics.

### Protocol

1. Select 3 domains outside poker team management:
   - **Domain A:** E-commerce (orders, payments, inventory, shipping)
   - **Domain B:** Healthcare scheduling (appointments, providers, patients, insurance)
   - **Domain C:** SaaS subscription management (plans, billing, usage metering, feature flags)
2. For each domain, write a DomainSpec feature specification for 2 representative features (6 total new specs).
3. During specification, track:
   - Every concept that fits cleanly into an existing meta-type (covered)
   - Every concept that requires forcing into a poor-fit meta-type (strained)
   - Every concept that has no adequate meta-type (uncovered)
4. Compute coverage = covered / (covered + strained + uncovered).

### Data Collected

| Column                   | Type     | Description                      |
| ------------------------ | -------- | -------------------------------- |
| `domain`                 | string   | A / B / C                        |
| `feature_id`             | string   |                                  |
| `total_concepts`         | int      |                                  |
| `covered`                | int      | Clean meta-type fit              |
| `strained`               | int      | Poor fit, forced                 |
| `uncovered`              | int      | No adequate meta-type            |
| `uncovered_descriptions` | string[] | What the missing concepts are    |
| `suggested_new_types`    | string[] | Meta-types that would fix gaps   |
| `relationship_coverage`  | float    | % of edges covered by existing R |

### Success Criteria

- Coverage ≥ 85% across all 6 features.
- No single domain has coverage < 75%.
- Any uncovered concepts cluster into ≤ 3 new meta-types (vocabulary is close, not fundamentally insufficient).

---

## E7: Signal Emission Rate Tracking

**Claim:** Governance attenuation manifests as signal loss, measurable over pipeline runs.

### Protocol

1. For every pipeline session going forward, instrument the session to record:
   - Feature worked on
   - Pipeline stages executed
   - Expected signals (based on stage count and feature complexity)
   - Actual signals emitted
   - Signal types emitted vs expected
2. After every 5 sessions, compute rolling averages.
3. Run this continuously as the project evolves — this is a longitudinal study.

### Data Collected (per session)

| Column                  | Type                | Description                                                 |
| ----------------------- | ------------------- | ----------------------------------------------------------- |
| `session_id`            | string              |                                                             |
| `timestamp`             | ISO 8601            |                                                             |
| `feature_id`            | string              |                                                             |
| `stages_executed`       | string[]            | Which pipeline stages ran                                   |
| `expected_signal_count` | int                 | Based on heuristic: 1 per stage + 1 per alignment gap found |
| `actual_signal_count`   | int                 |                                                             |
| `emission_rate`         | float               | actual / expected                                           |
| `signal_types_expected` | string[]            |                                                             |
| `signal_types_emitted`  | string[]            |                                                             |
| `missed_types`          | string[]            | Expected but not emitted                                    |
| `agent_mode`            | unified / separated | Whether observer was separate                               |

### Success Criteria

- Accumulate ≥ 30 session data points.
- Show statistically significant emission rate difference between unified and separated modes (if E5 runs concurrently).
- Identify which signal types have the lowest emission rates (hypothesis: governance-gap is worst).

### Automation

Add to every pipeline session epilogue:

```jsonl
{"experiment":"E7","session_id":"...","emission_rate":0.XX,...}
```

---

## E8: Meta-Health Convergence

**Claim:** The meta-circular governance system (M-001–M-006) converges toward healthy values over time.

### Protocol

1. After every 5 pipeline sessions, run `tools/generate-meta-health.ts` and record all 6 metrics.
2. Track the time series of each metric over ≥ 20 measurement points.
3. Test for convergence: is M-001 (orphan rate) trending down? Is M-005 (governance ratio) trending up?

### Data Collected

| Column                   | Type     | Description                                 |
| ------------------------ | -------- | ------------------------------------------- |
| `measurement_id`         | int      | Sequential                                  |
| `timestamp`              | ISO 8601 |                                             |
| `sessions_since_last`    | int      | Pipeline sessions between measurements      |
| `m001_orphan_rate`       | float    | 0–1                                         |
| `m002_friction_rate`     | float    | 0–1                                         |
| `m003_time_to_alignment` | float    | Hours (when available)                      |
| `m004_l4_volatility`     | int      | Commits touching axioms/constitution in 30d |
| `m005_governance_ratio`  | float    | 0–1                                         |
| `m006_overhead_ratio`    | float    | 0–1                                         |
| `concepts_total`         | int      | Total registry concepts                     |
| `concepts_anchored`      | int      | Concepts with code binding                  |

### Success Criteria

- M-001 orphan rate decreases from 100% (current) to < 30% within 20 measurement points.
- M-005 governance ratio increases monotonically (with possible plateaus).
- M-006 overhead ratio stabilizes below 0.5 (governance doesn't dominate domain work).
- At least one self-correction cycle observed: metric degrades → signal emitted → tuning applied → metric recovers.

---

## E9: Cross-Feature Composition Stress Test

**Claim:** Features operate as independent concept graphs; cross-feature edges are not yet formally handled.

### Protocol

1. Identify all cross-feature concept dependencies in the current 7 features:
   - Shared entities (Player appears in 5+ features)
   - Shared enums (Role, Status types)
   - Cross-feature workflows (onboarding → management → settlement)
2. Enumerate edges that cross feature boundaries.
3. Attempt to model these using the current ontology. Record where the model breaks.
4. Propose and test a composition operator $G_{A \oplus B}$.

### Data Collected

| Column           | Type                      | Description                                  |
| ---------------- | ------------------------- | -------------------------------------------- |
| `source_feature` | string                    |                                              |
| `target_feature` | string                    |                                              |
| `shared_concept` | string                    | Concept that appears in both                 |
| `edge_type`      | string                    | Relationship connecting them                 |
| `model_status`   | works / strained / broken | Can current ontology represent this?         |
| `failure_reason` | string                    | Why it broke (if applicable)                 |
| `proposed_fix`   | string                    | Composition operator or new edge type needed |

### Success Criteria

- Document all cross-feature edges (expected: 15–25).
- Identify which composition patterns work and which require new formal operators.
- Produce a concrete proposal for the composition algebra referenced in paper §9.2.

---

## E10: Developer Productivity Comparison

**Claim:** DomainSpec improves developer productivity for spec-governed agent-assisted development.

### Protocol

1. Recruit 4 developers (2 familiar with DomainSpec, 2 not).
2. Each developer implements the same new feature twice:
   - **Condition A (DomainSpec):** Use DomainSpec pipeline (spec → derive → implement → verify).
   - **Condition B (Freeform):** Use LLM agents with no DomainSpec structure (just a natural language description and direct coding).
3. Counterbalance: half do A-then-B, half do B-then-A, on different features.
4. Measure time, defect rate, test coverage, and spec-implementation alignment.

### Data Collected

| Column                     | Type       | Description                              |
| -------------------------- | ---------- | ---------------------------------------- |
| `developer_id`             | string     | Anonymized                               |
| `domainspec_familiarity`   | low / high |                                          |
| `condition`                | A / B      |                                          |
| `feature`                  | string     |                                          |
| `time_to_complete_minutes` | int        |                                          |
| `tests_written`            | int        |                                          |
| `test_coverage_pct`        | float      | Line coverage                            |
| `defects_found_in_review`  | int        | Post-implementation review               |
| `alignment_score`          | float      | Spec-to-code alignment audit score (0–1) |
| `rework_events`            | int        | How many times code was revised          |
| `satisfaction_score`       | int        | 1–5 developer self-report                |

### Success Criteria

- Condition A produces higher alignment scores (> 0.8 vs < 0.6 for B).
- Condition A produces more tests per feature.
- Time for Condition A is ≤ 1.5× Condition B (DomainSpec is not significantly slower despite more structure).
- Defects in review are lower for Condition A.

---

## Execution Rules

### Data Integrity

1. **Raw data only.** Store all experiment data as JSONL in `domainspec/docs/research/data/`. Never edit raw data after collection.
2. **Session isolation.** Each experiment run uses a fresh agent session with a documented system prompt. No session carries over from a previous run.
3. **Ground truth annotation.** For experiments requiring human judgment (E2, E4, E5), annotate with a structured rubric documented alongside the data.
4. **Reproducibility.** Record the exact model version, temperature, system prompt hash, and DomainSpec version for every run.

### Metadata per Run

Every experiment data point must include:

```json
{
  "experiment_id": "E1",
  "run_id": "uuid",
  "timestamp": "2026-04-20T...",
  "domainspec_version": "1.8.x",
  "model": "claude-sonnet-4-20250514",
  "model_temperature": 0,
  "system_prompt_hash": "sha256:...",
  "feature_id": "financial-settlement",
  "operator": "vrondelli"
}
```

### Execution Order

```
Phase 1 (immediate — can run on existing project):
  E1  Derivation Determinism          ~2 hours
  E7  Signal Emission Rate            ongoing (instrument now)
  E8  Meta-Health Convergence         ongoing (instrument now)

Phase 2 (requires test implementation):
  E3  Mutation Testing                ~4 hours (needs Stryker setup)
  E2  Derivation vs Manual Coverage   ~6 hours (needs human tester)

Phase 3 (requires intervention implementation):
  E5  Observer-Executor Separation    ~4 hours (needs observer agent)
  E4  Governance Attenuation Curve    ~8 hours (needs 50 pipeline runs)

Phase 4 (requires external work):
  E6  Vocabulary Sufficiency          ~12 hours (needs 3 new domain specs)
  E9  Cross-Feature Composition       ~4 hours
  E10 Developer Productivity          ~20 hours (needs external developers)
```

### Reporting

After each experiment completes, produce a summary in `domainspec/docs/research/results/EX-results.md` with:

- Protocol deviations (what changed from this plan)
- Raw data location
- Summary statistics
- Visualizations (tables or ASCII charts)
- Conclusions and impact on paper claims
- Recommended paper revisions

---

## Traceability to Paper Sections

| Experiment | Paper Section                        | What it strengthens                       |
| ---------- | ------------------------------------ | ----------------------------------------- |
| E1         | §5.1 (Derivation Function)           | Proves determinism claim empirically      |
| E2         | §5.2–5.3 (Test Rules, Cardinality)   | Proves coverage superiority               |
| E3         | §9.5 (Threats — construct validity)  | Addresses mutation testing gap            |
| E4         | §6.3–6.4 (Channel Capacity, Bounds)  | Empirical validation of attenuation model |
| E5         | §6.6 (Structural Interventions)      | Proves intervention effectiveness         |
| E6         | §9.1 (Vocabulary Completeness)       | Addresses external validity threat        |
| E7         | §6.5 (Empirical Evidence)            | Longitudinal attenuation data             |
| E8         | §3.4 (Meta-Circular Self-Governance) | Proves convergence claim                  |
| E9         | §9.2 (Cross-Feature Composition)     | Advances future work into evidence        |
| E10        | §9.4(d) (Controlled Experiments)     | Developer productivity claim              |
