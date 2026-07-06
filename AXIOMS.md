# AXIOMS.md

> Epistemic foundations for DomainSpec governance.
> Via Negativa policy: each axiom exists because its absence has already caused measurable harm.

> Clause references below (`C1`–`C11`) denote the sibling [CONSTITUTION.md](CONSTITUTION.md) —
> DomainSpec governance. Distinct namespaces, do not conflate: cav2 authority uses `CAV2-C*`
> (`cyberAlchemy-v2/authority/constitutions/`); the research doc-hygiene constitution uses
> `RC1`–`RC3` (`research/projects/domainspec/definitions/CONSTITUTION.md`).

---

## Axiom A1 — Semantic Authority Precedes Implementation

Statement:
Domain semantics are authored in DomainSpec artifacts first. Code, workflows, and automation are downstream realizations.

Evidence of harm when absent:

1. Recurrent alignment drift between specs and implementation.
2. Divergent behavior introduced by implementation-first edits.

Governs:

1. C1 in CONSTITUTION — DomainSpec source-first authority.
2. C6 in CONSTITUTION — Code-to-spec binding enforcement.

## Axiom A2 — Decisions Belong To The Domain, Not Adapters

Statement:
Domain policy, invariants, and state transitions belong in domain and application layers, never infrastructure adapters.

Evidence of harm when absent:

1. Layering drift where adapters accumulate policy logic.
2. Hard-to-audit behavior because business rules are scattered in technical modules.

Governs:

1. C2 in CONSTITUTION — Layering boundary enforcement.
2. C7 in CONSTITUTION — Mandatory layering audits as gates.

## Axiom A3 — Governance Must Be Computable To Be Reliable

Statement:
Critical governance checks must be deterministic and machine-verifiable; instruction-only enforcement is insufficient.

Evidence of harm when absent:

1. Missing or inconsistent signal emission across sessions.
2. Post-hoc discovery of violations that could have been blocked earlier.

Governs:

1. C3 in CONSTITUTION — Signal contract and completeness invariants.
2. C8 in CONSTITUTION — Deterministic detector and validator gates.

## Axiom A4 — Observation Must Be Independent From Execution

Statement:
Observer and executor responsibilities must be separated for trustworthy governance telemetry.

Evidence of harm when absent:

1. Self-report blind spots in governance-gap detection.
2. Under-reporting of behavior-level events when execution context is saturated.

Governs:

1. C4 in CONSTITUTION — Dual-phase observer model.
2. C9 in CONSTITUTION — Telemetry bundle as observer input contract.

## Axiom A5 — Control Should Shift Left, Reflection Stays Outer Loop

Statement:
Blocking controls should run before merge/close, while reflection and pruning run asynchronously on accumulated evidence.

Evidence of harm when absent:

1. Manual-trigger L6 controls allow drift to accumulate.
2. Overhead grows when governance is only retrospective.

Governs:

1. C5 in CONSTITUTION — Immediate blocking governance gates.
2. C10 in CONSTITUTION — Async pruning and tuning cadence.

## Axiom A6 — Governance Itself Needs A Feedback Budget

Statement:
Governance artifacts compete for finite cognitive and instruction bandwidth; low-yield rules must be pruned.

Evidence of harm when absent:

1. Instruction dilution from redundant governance sources.
2. Decreasing enforcement fidelity despite adding more rules.

Governs:

1. C10 in CONSTITUTION — Governance pruning protocol.
2. C11 in CONSTITUTION — Metrics-driven governance health reporting.
