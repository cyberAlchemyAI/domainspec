# Drift and Convergence

## Role and Precedence

This document is the canonical implementation-level reference for drift and convergence in DomainSpec.

It explains what drift means in operational terms, how convergence is recognized, and how the relevant implementation documents fit together.

Research-level normative semantics remain anchored in:

- `research/projects/domainspec/definitions/DEFINITIONS.md`
- `research/projects/domainspec/definitions/DEFINITIONS-INDEX.md`

This file does not replace those research definitions. It is the authoritative operational interpretation for the implementation surface.

## Canonical Definitions

### Drift

Drift is any measurable divergence between intended DomainSpec behavior and observed system reality.

That divergence can appear in multiple places:

- semantic drift: modeled concepts or relationships no longer reflect the domain clearly
- contract drift: documented feature behavior and derived obligations no longer match implementation behavior
- runtime drift: production behavior deviates from expected rules, states, calculations, or workflows
- governance drift: enforcement fidelity weakens and blocking or escalation behavior stops matching policy intent
- coordination drift: human and agent decisions stop aligning around the same priorities, risks, or closure evidence

Drift is the problem signal.

### Convergence

Convergence is the sustained reduction of critical drift, backed by explicit evidence.

A system is converging when:

- formal contracts remain stable enough to guide implementation
- derived tests and metrics continue to match intended behavior
- production violations, governance gaps, and coordination failures trend downward
- closure evidence becomes clearer and blockers shrink over time
- priorities increasingly reflect live objectives and measured system conditions

Convergence is the desired trend.

## Relationship to Saturn L-System

Saturn L-system is not the definition of drift.
Saturn is the control loop that acts on drift.

The relationship is:

- drift defines what is going wrong
- convergence defines what improvement looks like
- Saturn L-system observes drift, decides responses, executes those responses, and verifies whether convergence is improving

Canonical Saturn reference:

- `plan/SATURN-L-SYSTEM.md`

## Drift Surfaces in DomainSpec

### 1. Build-Time Fidelity

Primary authority:

- `TEST-PIPELINE.md`

This surface detects whether formalized behavior still derives into the expected test obligations.

Typical drift detected here:

- uncovered rules
- missing transition coverage
- derivation gaps
- mismatch between feature contracts and test inventory

### 2. Production Runtime Fidelity

Primary authority:

- `OBSERVABILITY.md`

This surface detects whether deployed behavior still matches the formal model.

Typical drift detected here:

- invariant violations
- calculation drift
- invalid transitions
- workflow or event anomalies

### 3. Governance and Meta-Health Signals

Primary authority:

- `implementation/GOVERNANCE-SIGNALS.md`

This surface detects whether governance fidelity, coordination quality, and framework health are degrading.

Typical drift detected here:

- governance attenuation
- role disagreement
- coverage stagnation
- signal detection latency

### 4. Async Learning and Framework Tuning

Primary authority:

- `TUNING-LOOP.md`

This surface detects repeated cross-run patterns that should change the framework itself.

Typical drift detected here:

- recurring governance blind spots
- repeated rework patterns
- excessive orchestration overhead
- signal thresholds that imply structural tuning is needed

### 5. Implementation Closure and Execution Progress

Primary authority:

- `ADLC-ALIGNMENT.md`
- `plan/TRACEABILITY.md`

This surface detects whether the implementation program is actually closing the intended gaps.

Typical drift detected here:

- blockers not shrinking
- unresolved ADLC gaps
- tasks progressing without closing target contributions
- execution sequence drifting away from critical-path needs

## Operational Convergence Criteria

DomainSpec is converging when most of the following become true over time:

- concept and relationship changes become more deliberate and less chaotic
- derived tests cover the intended rules, transitions, and error paths reliably
- production violations trend down or remain bounded within explicit thresholds
- governance blockers are detected earlier and with less ambiguity
- priority changes are explainable through objective state plus live evidence
- closure scorecards show fewer unresolved blockers and more evidence-backed completion

## Distinguishing the Related Control Documents

Use the documents below for different questions:

| Question                                               | Canonical document                     |
| ------------------------------------------------------ | -------------------------------------- |
| What is drift and what counts as convergence?          | `DRIFT-CONVERGENCE.md`                 |
| What loop acts on drift operationally?                 | `plan/SATURN-L-SYSTEM.md`              |
| How do we derive runtime metrics from formal docs?     | `OBSERVABILITY.md`                     |
| How do we define governance and meta-health signals?   | `implementation/GOVERNANCE-SIGNALS.md` |
| How do we tune the framework across runs?              | `TUNING-LOOP.md`                       |
| How do we derive build-time quality obligations?       | `TEST-PIPELINE.md`                     |
| How do we measure closure against implementation gaps? | `ADLC-ALIGNMENT.md`                    |

## One-Sentence Summary

Drift is measurable divergence from intended behavior, convergence is evidence-backed reduction of that divergence over time, and Saturn L-system is the operational loop that turns drift signals into corrective action.
