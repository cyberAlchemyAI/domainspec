# E1: Derivation Determinism

**Status:** not started
**Paper Claim:** C2 — same spec → same tests
**Paper Section:** §5.1 (Derivation Function)
**Priority:** P0 | **Effort:** Low

---

**Claim:** Given the same concept graph G and rule set Δ, the derivation function produces identical test obligations on every invocation.

## Protocol

1. Select 3 features with varying complexity: `auth-access-control` (12 concepts), `player-management` (14 concepts), `financial-settlement` (18 concepts).
2. Run the test derivation pipeline 10 times per feature, each in a fresh agent session.
3. For each run, capture the full list of derived test obligation IDs, names, and cardinalities.
4. Compute pairwise Jaccard similarity between all 10 runs for each feature.

## Data Collected

| Column                   | Type     | Description                      |
| ------------------------ | -------- | -------------------------------- |
| `feature_id`             | string   | Feature under test               |
| `run_number`             | int      | 1–10                             |
| `agent_session_id`       | string   | Unique session identifier        |
| `test_obligations`       | string[] | Ordered list of derived test IDs |
| `obligation_count`       | int      | \|T\| for this run               |
| `derivation_rules_fired` | object   | Count per δ rule                 |
| `timestamp`              | ISO 8601 |                                  |

## Success Criteria

- Jaccard similarity = 1.0 across all 10 runs for each feature (perfect determinism).
- If any run deviates: classify deviation as (a) rule ambiguity, (b) agent hallucination, (c) concept graph interpretation error. Record root cause.

## Control

- Run the same 3 features with a bare LLM prompt ("write tests for this feature spec") 10 times. Measure Jaccard similarity. This establishes the stochastic baseline.
