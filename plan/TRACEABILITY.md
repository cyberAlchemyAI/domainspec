# Alignment Traceability Matrix

This document traces implementation tasks to ADLC gaps and ADLC roadmap tasks so it is clear what each task solves and how it contributes to the whole project.

## How To Read

- `Solves` = immediate problem this task removes.
- `Project contribution` = why this matters to system-level outcomes.
- `Alignment` = direct trace to ADLC gaps (`G*`) and roadmap tasks (`T*`).

## Task Intent and Contribution

| Task | Solves | Project contribution | Alignment |
| --- | --- | --- | --- |
| CTX-01 | Unclear objective prioritization | Keeps execution aligned with current value and constraints | G5, G7, G15 |
| CTX-02 | Weak onboarding for mapping method | Improves knowledge transfer and adoption consistency | G1, G15 |
| CTX-03 | Fragmented initiative visibility | Maintains vision-to-task continuity for owners | G2, G15 |
| INF-01 | Inconsistent runtime execution path | Stabilizes delivery path for all agent outputs | G3, G4, G5 |
| INF-02 | Partial telemetry and cost visibility | Enables Saturn metrics and governance evidence | G2, G3, G7, G15 |
| INF-03 | Manual governance response loop | Enables threshold -> suggestion -> evaluation automation | G2, G4, G8, G15, T1, T15, T20 |
| INF-04 | Open security baseline risks | Protects execution integrity and deployment safety | G4 |
| HAR-01 | Opaque object relationships and transformations | Improves human understanding of domain behavior | G1, G12 |
| HAR-02 | Role friction across one shared workflow | Improves role coordination and handoff quality | G1, G5 |
| HAR-03 | Non-objective task queues | Improves owner decision quality and timeline control | G5, G7, G15 |
| HAR-04 | Slow UI prototyping choices | Speeds interface iteration and display-fit decisions | G1, G12 |
| HAR-05 | Metrics not actionable in context | Links system health directly to operational decisions | G7, G15, T14 |
| AGT-01 | Opaque orchestration routing | Makes agent selection understandable and auditable | G3, G5, T16, T17 |
| AGT-02 | Greenfield domain ambiguity | Produces implementation-ready problem framing | G1, G5 |
| AGT-03 | Brownfield mapping uncertainty | Bridges existing code and domain definitions | G11, G12 |
| AGT-04 | Unstructured agent-skill composition | Standardizes orchestration bundles and quality expectations | G1, G10, T12 |
| AGT-05 | Skills trapped per project | Enables reusable, version-aware capability sharing | G10, G12, T2, T10 |
| AGT-06 | Manual agent/skill evolution | Enables controlled mutation with governance gates | G2, G4, G9, G10, T13, T15 |
| AGT-07 | Static feature goals during execution | Enables safe mid-flow goal amendment and re-derivation | G6, T18 |
| GOV-01 | Implicit axiom-rule-gate chain | Makes governance executable and derivable | G13, G14, G16, T5, T6, T7 |
| GOV-02 | Validation scripts not unified operationally | Enforces governance checks consistently in CI | G4, G11, G16, T1, T9, T20 |
| GOV-03 | Unclear blocking/escalation behavior | Reduces governance ambiguity and merge risk | G4, G5, T1, T17, T20 |
| GOV-04 | No single implementation closure view | Tracks ADLC progress and unresolved blockers | G2, G4, G15, T14, T15, T20 |
| GOV-05 | External material intake is informal | Keeps external assets versioned and governed | G10, G12, T2 |

## ADLC Gap Coverage (G1-G16)

| Gap | Covered by tasks |
| --- | --- |
| G1 | HAR-01, HAR-02, AGT-02, CTX-02 |
| G2 | INF-02, INF-03, AGT-06, GOV-04 |
| G3 | INF-01, INF-02, AGT-01 |
| G4 | INF-03, GOV-02, GOV-03, AGT-06 |
| G5 | CTX-01, HAR-02, HAR-03, AGT-01 |
| G6 | AGT-07 |
| G7 | INF-02, HAR-03, HAR-05 |
| G8 | INF-03, GOV-04 |
| G9 | AGT-06 |
| G10 | AGT-05, AGT-06, GOV-05 |
| G11 | AGT-03, GOV-01, GOV-02 |
| G12 | HAR-01, AGT-03, AGT-05 |
| G13 | GOV-01 |
| G14 | GOV-01 |
| G15 | INF-02, HAR-05, GOV-04, CTX-01 |
| G16 | GOV-01, GOV-02 |

## ADLC Task Coverage (T1-T20)

| ADLC task | Coverage in implementation plan |
| --- | --- |
| T1 | INF-03, GOV-02, GOV-03 |
| T2 | AGT-05, GOV-05 |
| T3 | Already implemented baseline (PIPELINE-REPORT + Step 10 counters) |
| T4 | Already implemented baseline (Economy of Action section in pipeline reporting) |
| T5 | GOV-01 |
| T6 | GOV-01 |
| T7 | GOV-01, GOV-02 |
| T8 | GOV-01, AGT-04 |
| T9 | GOV-02, INF-03 |
| T10 | AGT-05, HAR-01 |
| T11 | AGT-05, HAR-01 (optional path) |
| T12 | AGT-04 |
| T13 | AGT-06 |
| T14 | INF-02, HAR-05, GOV-04 |
| T15 | INF-03, AGT-06, GOV-04 |
| T16 | INF-02, AGT-01 |
| T17 | AGT-01, GOV-03, HAR-03 |
| T18 | AGT-07 |
| T19 | Already implemented baseline via T4b (`domainspec-reflect`) |
| T20 | INF-03, GOV-02, GOV-03, GOV-04 |

## Current Notes

- This traceability matrix is implementation-only and does not include paper or experiment workflow management.
- If a new ADLC gap or task is added, update this file and `plan/index.md` in the same change.
