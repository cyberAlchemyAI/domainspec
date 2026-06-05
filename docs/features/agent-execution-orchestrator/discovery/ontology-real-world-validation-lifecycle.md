---
tags: [domainspec, ontology, validation, promotion]
node_type: discovery
is_session: false
layer: ontology, application
nature: explanatory, procedural, technical
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-27
---

# Ontology Real-World Validation Lifecycle

## Objective

Define how DomainSpec ontology knowledge can be validated against real-world data before it becomes a premise, promoted entry, constitution, or axiom. The end state is a promotion lifecycle where every claim carries observable consequences, witness sources, contradiction conditions, and a scoped reliance decision.

## 1. Business Context

### Why now

DomainSpec already treats specs as source and code as compiled image, but the ontology promotion path is still too easy to confuse with documentation maturity. The new lifecycle must answer a harder question: when a claim inside the ontology says something about the world, the system, or agent behavior, what real-world evidence is strong enough to rely on it?

### What's broken

- `vault/axiom/domainspec-axioms.md` defines load-bearing methodology commitments, but promotion provenance is prose-heavy and does not define a standard real-world witness package for future axiom promotions.
- `vault/axiom/ontology-axioms.md` states the ontology should improve retrieval and reasoning, but it does not define the measurement loop that validates whether a candidate ontology change actually improves agent retrieval, reasoning, or governance outcomes.
- `vault/constitution/governs-runtime-witness-constitution.md` creates the right enforcement idea for constitutions, but it is currently constitution-specific; it does not generalize into a lifecycle for validating ontology claims before promotion.
- `/home/vrondelli/projects/domainspec-core/arcanum/arcana/ontology-vault/development/handoffs/DOMAIN-SPEC-ONTOLOGY-LIFECYCLE-HANDOFF.md` correctly separates general ontology lifecycle from DomainSpec/AEO particulars, but leaves the DomainSpec-owned validation package unwritten.

### What stays the same

- DomainSpec remains governed by spec -> code directionality; real-world data does not reverse-compile intent from code except in explicit brownfield bootstrap cases.
- Arcanum Ontology Vault remains owner of the general ontology lifecycle model; DomainSpec owns only its software lifecycle and AEO evidence-envelope particulars.
- Runtime telemetry, agent outputs, CI logs, and production observations remain evidence inputs, not truth by themselves.
- Canonical vault mutation still requires explicit promotion records, owner review, scope, rollback, and contradiction path.

## 2. Core Concepts

### Ontology Claim

An atomic statement in the ontology that can be reviewed for reliance. The claim must be small enough to name its evidence, scope, owner, and contradiction condition without bundling unrelated assertions.

### Real-World Witness

An observed source outside the claim text that can support or challenge the claim. In DomainSpec, valid witnesses include production behavior, runtime telemetry, user decisions, CI/audit output, issue history, alignment-auditor results, route/stage execution envelopes, and external domain facts when the claim depends on market, legal, or business reality.

### Observable Consequence

A prediction the claim makes about what should be seen if the claim is true enough to rely on. This is the missing bridge between “sounds right” and “validated”: every promotable ontology claim must say what evidence would support it and what evidence would contradict it.

### Validation Envelope

A structured package that binds a claim to witness data, selectors, observed result, expected result, confidence split, contradiction scan, and review decision. It is DomainSpec's particular version of the general `LifecycleEvidenceEnvelope`.

### Promotion Record

The governance object that decides whether a validated claim becomes candidate, premise, promoted entry, policy, constitution, axiom, contradicted, retired, rejected, or deferred. It must separate evidence confidence from commitment confidence.

## 3. Validation Model

Every ontology claim should be classified before validation:

| Claim type | Example | Real-world validation surface |
| --- | --- | --- |
| Meaning claim | “A spec is source, code is compiled image.” | Traceability audits, drift findings, brownfield exceptions, downstream agent behavior. |
| System claim | “This route produces an evidence envelope.” | CI, command output, generated artifacts, schema checks, run logs. |
| Operational claim | “Agents navigate better when this edge exists.” | Retrieval tests, agent-route success rate, reduced clarification loops, fewer wrong-file reads. |
| Governance claim | “A constitution must declare a runtime witness.” | `vault-ctl governance audit`, declared validators, governed path coverage. |
| External-world claim | “This domain rule reflects market/legal behavior.” | User-confirmed domain data, external source selectors, production exceptions, dated legal/market references. |

The lifecycle should require a different evidence threshold per outcome:

| Outcome | Minimum real-world proof |
| --- | --- |
| Candidate | One relevant witness or explicit user decision plus visible uncertainty. |
| Premise | Falsifiable claim, expected observation, contradiction path, and review owner. |
| Promoted entry | Multiple supporting witnesses or one strong witness plus owner approval and scoped use. |
| Constitution | Governed artifact/form/model, declared runtime witness or coverage pattern, rollback path. |
| Axiom | Invariant-bearing claim, dependency review, repeated or formal evidence, contradiction monitoring, explicit commitment. |

## 4. Promotion Flow

```text
Ontology claim
  -> claim classification
  -> observable consequence statement
  -> witness plan
  -> real-world data collection
  -> validation envelope
  -> contradiction scan
  -> promotion record
  -> bridge validation
  -> scoped operational use
  -> monitoring / reaffirm / contradict / retire
```

Promotion must block when any of these are missing:

- claim scope;
- witness source and selector;
- expected observation;
- observed result;
- contradiction condition;
- evidence confidence;
- commitment confidence;
- review owner;
- rollback or retirement path.

## 5. Real-World Data Sources

DomainSpec should admit real-world data in tiers:

| Tier | Source | Use |
| --- | --- | --- |
| T0 | User decision with scope and rationale | Commitment and authority, not empirical proof alone. |
| T1 | Repository artifacts with selectors | Verifies what was specified, planned, generated, or decided. |
| T2 | Runtime and CI evidence | Verifies what the system or agent actually did. |
| T3 | Production or operational evidence | Verifies behavior in real use. |
| T4 | External dated source | Verifies market, legal, platform, API, or business-world claims. |

No tier promotes alone by default. Strong promotion comes from alignment across tiers: intent artifact, system/runtime witness, operational result, and owner decision.

## 6. Axiom And Constitution Gates

### Constitution Gate

A constitution can be promoted only if it names what it governs and how conformance is witnessed. This can be a mechanical validator, a governed path pattern with coverage reporting, or an explicit prose-only limitation. A constitution without a witness is not governance; it is advice wearing formal clothes.

### Axiom Gate

An axiom can be promoted only when the claim is load-bearing and the cost of revising it is explicitly understood. Repeated observation is not enough. The axiom needs invariant-bearing consequences, dependency review, contradiction monitoring, and a statement of what would break if the axiom changed.

## 7. Bridge Validation

Bridge validation is required when a claim crosses ontology meaning, DomainSpec intent, implementation, and observed runtime behavior.

| Bridge result | Meaning | Promotion effect |
| --- | --- | --- |
| `aligned` | Witnesses support the intended relation. | Eligible for scoped reliance. |
| `partial` | Witnesses support a narrower claim. | Narrow scope or remain premise. |
| `drift` | Runtime/system behavior diverges from intended meaning. | Create contradiction or maintenance record. |
| `insufficient` | Evidence does not yet prove alignment. | Defer promotion. |
| `contradicted` | Evidence actively challenges the claim. | Block promotion and route repair. |

## 8. Open Questions

### Where should validation envelopes live?

Recommendation: start under `docs/features/agent-execution-orchestrator/development/ontology-validation/` while the model is still DomainSpec/AEO-specific. Promote a shared template only after two or three real fixtures prove the fields are stable.

### Should external data be mandatory for every axiom?

Recommendation: no. Some axioms are methodological or formal. Require real-world data when the axiom makes an empirical or operational claim; require formal dependency review and contradiction monitoring when it is a methodological invariant.

### What is the first fixture?

Recommendation: use `governs-runtime-witness-constitution` as the first fixture. It already has a concrete validator concept, governed path, runtime audit command, and promotion condition. That makes it a better first test than a broad axiom.

