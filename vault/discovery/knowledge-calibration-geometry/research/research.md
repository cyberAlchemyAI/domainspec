---
tags: [research, knowledge-calibration-geometry, refinement, lens-assembly]
node_type: subagents-research
is_session: false
layer: architecture, application
nature: reference
status: active
backfilled: false
analysis-method: live-during-dispatch
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Research Assembly — Refinement of `knowledge-calibration-geometry/discovery.md` v0.4.0

## Context

User asked for a refinement pass on `vault/discovery/knowledge-calibration-geometry/discovery.md` (693 lines, v0.4.0) — the load-bearing discovery that reframes DomainSpec as a knowledge-calibration surface across `C_head`, `C_spec`, `C_system`, with psychometric guardrails. Originally proposed as a 2-subagent pass; expanded to 4 axes ("todos os eixos") on user direction. Architecture: 4 parallel children → research.md (mechanical assembly) → findings.md (synthesis). Note: subagent runtime blocked Write to vault paths in this dispatch; the orchestrator persisted all 4 lens files manually from agent returns.

## Goal

Produce four lens-level findings on the discovery (adversarial-constructive, psychometric-geometric, coherence-evidence, hypotheses-model), then a cross-cutting synthesis that the user can apply as concrete patches to `discovery.md` v0.5.0 — without inventing claims beyond what the lenses surfaced.

## Lenses dispatched

| Slug | Axis | Modes | Output |
|---|---|---|---|
| `axis-adversarial-constructive` | Pressure-test + tightening | Math-as-decoration / unfalsifiable hypotheses / over-commitments + redundancy / vague defs / weak ordering | [lenses/axis-adversarial-constructive/findings.md](../lenses/axis-adversarial-constructive/findings.md) |
| `axis-psychometric-geometric` | Technical rigor | Validity (Kane/Messick/ECD) + measurement-theoretic axioms (Stevens/Tversky/metric spaces) | [lenses/axis-psychometric-geometric/findings.md](../lenses/axis-psychometric-geometric/findings.md) |
| `axis-coherence-evidence` | Doc-internal + literature | Cross-hypothesis consistency / term drift + L-pillar value test / missing literature | [lenses/axis-coherence-evidence/findings.md](../lenses/axis-coherence-evidence/findings.md) |
| `axis-hypotheses-model` | Forward-looking | Per-hypothesis falsifiability scorecard + experiment operationalization (2 eng × 2 weeks viability) | [lenses/axis-hypotheses-model/findings.md](../lenses/axis-hypotheses-model/findings.md) |

## Headline citations per lens

### Adversarial-Constructive (cf. `lenses/axis-adversarial-constructive/findings.md`)

- 13 adversarial (A1–A13), 15 constructive (C1–C15), 5 cross-cutting patterns.
- **A1, A2, A9** — "geometry"/"distance"/"functorial" used as branding without committed axioms or carrier space.
- **A3** — H-5, H-10, H-11 are governance/discipline, not hypotheses; mixing them inflates apparent empirical content.
- **A4** — psychometric vocabulary borrowed (Messick, Kane, AERA/APA/NCME, ECD) without naming a single running construct.
- **A5** — "reference surface" load-bearing but never operationally chosen.
- **A10** — 2-channel `C_head` table (lines 360–367) contradicts H-9's 4-way model.
- **A12** — OQ-12 (frame-level falsifier) buried at question 12 of 23.
- **A13** — Working Model section (~250 lines) heavier than Hypotheses section, contradicting "pre-implementation" framing.
- **C1, C8, C10** — discovery grew by accretion: Hypothesis paragraph vs Summary, H-11 vs Anti-dashboard, H-8 vs rule-formation footer are all duplicates.
- **C11** — "Next Moves" (16 bullets) is a backlog masquerading as a roadmap.

### Psychometric-Geometric (cf. `lenses/axis-psychometric-geometric/findings.md`)

- 12 psychometric (P1–P12), 14 geometric (G1–G14), 26-term glossary of imported terms.
- **P1** — `C_head` floats between latent trait / discrete knowledge state / behavioral disposition — three frameworks with incompatible math (IRT vs DINA/LCDM vs propensity). Forced fork before any spec.
- **P2** — Kane is cited but applied as checklist not as Interpretation/Use Argument (scoring→generalization→extrapolation→implication).
- **P3** — ECD vocabulary partial: Evidence Model fragment conflates Student Model and Task Model columns; no measurement-model column.
- **P4** — Reliability **entirely absent**: no test-retest / internal consistency / inter-rater / G-theory framing. Validity ≤ √reliability — so silence here caps the whole claim.
- **P5** — Dang/King/Inzlicht implication softened: declared and operational knowledge are *different constructs*, not noisy measurements of one.
- **P6** — Measurement invariance (configural/metric/scalar/strict) named once, never structured; no invariance target groups.
- **G1, G2** — "Geometry" rhetorical; none of the 5 proposed `d(·,·)` verified against metric axioms. `d(head, reference)` violates symmetry (Tversky 1977); `d(spec, system)` is asymmetric (coverage vs conformance).
- **G3** — `d(spec, system)` collapses coverage and conformance, losing the actionable signal H-11 demands.
- **G4** — Stevens scale types (ordinal vs interval vs ratio) never addressed; many proposed operations silently assume interval.
- **G8** — Inter-rater agreement missing despite LLM-as-judge being the likely scoring mechanism.
- **G12** — Cross-category distances assume shared scale; `C_head`/`C_spec`/`C_system` have no shared carrier — requires a canonical claim layer projection that the discovery never names.

### Coherence-Evidence (cf. `lenses/axis-coherence-evidence/findings.md`)

- 11 internal-coherence (C1–C11), 10 external-evidence (E1–E10), 1 terminology audit table (32 entries).
- **C1** — H-11 vs OQ-23 vs anti-pattern list vs `alignment(group)` *contradict within one document* on whether aggregates are forbidden, conditional, or shipped.
- **C2** — H-9's "questions the person asks" is also H-3's primary probe; same observable gives evidence on two sides; evidence-design matrix presumes one observable → one inference.
- **C5** — "Reference surface" has *three undeclared scopes* (singular global, per-domain, per-task); every distance in the working model is `d(_, reference)`.
- **C10** — H-8's single event `formalization-created` quietly expands to three event classes by the Working Model.
- **C11** — H-9 declares 12 evidence channels; first experiment uses 5–7, all direct — uncalled scope cut.
- **E1** — Of L-1..L-5, only **L-5 (psychometrics) is load-bearing**; L-3 and L-4 are ornament — removing them changes nothing.
- **E3** — Missing pillar: **knowledge engineering / ontology engineering** (Gruber/Studer/Noy & McGuinness). Resolves OQ-2b for free.
- **E4** — Missing pillar: **calibration of belief / epistemic uncertainty** (Brier/Cooke/Tetlock). "Calibration" used 20+ times metaphorically; this pillar makes it operational.
- **E5** — Missing pillar: **communities of practice / boundary objects** (Wenger; Star & Griesemer). Resolves OQ-4.
- **E6** — Missing pillar: **distributed cognition** (Hutchins). Discovery treats `C_head` as per-person container — must reject distributed cognition explicitly or add relational view.
- **Terminology audit** — densest drift site is the line-392 distance table; `reference surface` (3 scopes), `alignment`/`fidelity`/`residue` each carry two meanings.

### Hypotheses-Model (cf. `lenses/axis-hypotheses-model/findings.md`)

- Hypotheses scorecard with falsifiability buckets: **Y: 3** (H-3, H-6, H-9). **Partial: 5** (H-1, H-2, H-4, H-7, H-8). **N: 3** (H-5, H-10, H-11 — actually guardrails).
- **Three node-types conflated under "hypothesis"** — H-5 is a language rule, H-10/H-11 are governance gates.
- **H-3 bundles two non-substitutable claims** — bidirectionality (testable) + game-shaping (asserted, never tested). Split into H-3a / H-3b.
- **H-2 is asymmetric across categories** — intra-consistency for `C_spec`/`C_system` is days of work; for `C_head` it is the unsolved OQ-1. Hides three sub-hypotheses of wildly different maturity.
- **Wrong test order** — empirical order should be H-1 → H-9 → H-3a → H-2 → H-4; defer H-6, H-7, H-8.
- **Missing H-12 (drift detection lag)** and **H-13 (recruitment/consent feasibility)** — calibration-loop value depends on time-to-surface; H-3/H-9 both assume sustained voluntary participation.
- **First experiment is under-specified for 2-engineer-2-week build** — no sample-size logic, recruitment plan, time budget, instrumentation, or kill-switch beyond prose.
- **Anti-dashboard discipline is aspirational, not enforceable** — six gate questions, no gatekeeper, no failure mode. Collapses under shipping pressure without a named owner.
- **First useful product distances are not on a flat shelf** — computability ladder: `d(spec, system)` computable today; the rest blocked on people/probes. **Cheapest first instrumentation = `d(spec, system)`** — no recruitment, tests the backbone (H-1, H-2).
- **Suggested MVP** — `spec-system` drift micro-probe: 1 feature spec + impl, 5 paired probes, classify divergences, calibration queue (not score). ~40–50 person-hours. Success/kill criteria fully specified in the lens.

## Method note

All four lens agents ran in parallel against the same target. Two of four hit a subagent-runtime restriction on Write to `vault/` paths and returned full file content inline; orchestrator persisted those manually. Agent 1's first run lost its full content (only headline summary returned); a re-run with explicit instructions ("Write is not blocked") still hit the same restriction but returned full content for orchestrator persistence. No synthesis was performed in this file — claims above are headline citations only. Cross-cutting synthesis lives in `../findings.md`.
