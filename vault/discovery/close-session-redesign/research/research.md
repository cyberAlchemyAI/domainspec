---
tags: [vault, research, close-session-redesign]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
backfilled: true
analysis-method: meta-lens-consolidation
synthesizes: [../lenses/01-record-layer-mechanics/findings.md, ../lenses/02-reckon-layer-discipline/findings.md, ../lenses/03-adversarial/findings.md, ../lenses/04-cross-skill-continuity/findings.md, ../lenses/META-cross-cutting/findings.md, ../lenses/META-gap-analysis/findings.md, ../lenses/META-adversarial-review/findings.md]
---

# Research — Close-Session Redesign

> **Backfill note (meta-lens consolidation).** This research synthesis was not produced from scratch by reading the 4 propose-wave lens findings post-hoc. The original evaluate-wave dispatch already produced three meta-lens documents (A: Cross-Cutting, B: Gap Analysis, C: Adversarial Review) that *are* the cross-lens consolidation in everything but filename. This document **structurally re-presents those three meta-lenses under the new convention's research-layer schema** (Lens Inventory, Cross-Lens Analysis, Unique Contributions, Open Questions Forwarded to Discovery). It cites the meta-lenses as primary sources because they ARE the analysis; nothing in the substantive findings below is independently re-derived. `analysis-method: meta-lens-consolidation` (not `post-hoc-independent-read`) records this honestly.

## Objective

Reconcile the four propose-wave lens findings on close-session redesign — Record-layer mechanics, Reckon-layer discipline, Adversarial analysis, Cross-skill continuity — into a single research view that surfaces convergences, gaps, weaknesses, and the operational disagreements that must be resolved before the discovery can commit to a design.

## Lens Inventory

| # | Lens | Framing | Headline finding | Confidence |
|---|------|---------|------------------|------------|
| 01 | [Record Layer Mechanics](../lenses/01-record-layer-mechanics/findings.md) | Schema / structural | Layer 1 must be mechanical + auto-derived + closed-vocab + freeze-by-write-order with a sentinel comment; `record_budget: auto` formula scales with counted artifacts, not narrative. | high (`[design-spec]`) |
| 02 | [Reckon Layer Discipline](../lenses/02-reckon-layer-discipline/findings.md) | Routing / discipline | Layer 2 is a routing layer (7-gate strict-order tree), not a summary; 10-line cap is structural; verbatim refusals over agent judgment; promotion/retirement as flag-only. | high (`[design-spec]`) |
| 03 | [Adversarial Analysis](../lenses/03-adversarial/findings.md) | Adversarial / drift | Load-bearing failure is **judgment laundering through structured-record fields**; line caps don't constrain semantic inflation; objective terms (compression, emergence, signpost) are operationally un-falsifiable. | high (`[red-team]`) |
| 04 | [Cross-Skill Continuity](../lenses/04-cross-skill-continuity/findings.md) | Continuity / fleet | Value scales with mechanical-consumer count; commit to versioned schema + migrations; bidirectional discovery↔session, unidirectional premise/constitution↔session; kernel + per-repo adapter shims; Emergence Ratio as operational definition. | medium (`[fleet-design, partial-fit]`) |
| Meta-A | [Cross-Cutting](../lenses/META-cross-cutting/findings.md) | Cross-cutting (second-order) | Eight ≥3-lens convergences; eight compatible-but-uncombined moves; shared "write-once append-only valve in a directional compression pipeline" mental model. | high (`[evaluator-aggregate]`) |
| Meta-B | [Gap Analysis](../lenses/META-gap-analysis/findings.md) | Gap analysis (second-order) | Seven holes the objective demands but no lens fills (auditability operationalization, session boundary, defer-close exit, self-provenance, per-session distillation check, cold-start, post-write Layer-1/Layer-2 check). | high (`[evaluator-aggregate]`) |
| Meta-C | [Adversarial Review](../lenses/META-adversarial-review/findings.md) | Adversarial review (second-order) | Lens 04 is weakest (designs for a fleet that doesn't exist); Lens 03 is most over-engineered; Lens 02's hard-refuse at line 11 + cooling period are most likely to be ignored; proposes 5-rule MVP. | high (`[evaluator-aggregate]`) |

## Cross-Lens Analysis

### Theme 1 — Signpost-not-document is the load-bearing telos

- **Lenses speaking to it.** 01, 02, 03, 04, Meta-A, Meta-C.
- **Convergence.** All four propose-wave lenses converge on hard caps as load-bearing (01: 120-line frontmatter; 02: 10-line Reckon refuse at line 11; 03: caps paired with grammar; 04: avg body length flat as success metric). Meta-A names this as the #1 convergence.
- **Disagreement.** Mechanism varies: 01 wants write-order + sentinel, 02 wants in-prompt refusal, 03 wants post-write linter, 04 wants schema versioning. All four agree in-prompt discipline alone fails (Meta-A convergence #4).
- **Resolution.** `[lens-supported, mechanism-contested]` — adopt the cap; pick the cheapest mechanism that the solo dev will actually maintain.
- **Implication for discovery.** Cap is non-negotiable; mechanism (sentinel vs linter vs prompt-only) becomes an Open Question.

### Theme 2 — Closed-vocabulary tokens / fixed grammars replace prose in Layer 1

- **Lenses speaking to it.** 01, 02, 03, 04, Meta-A.
- **Convergence.** All four lenses converge: verdict ∈ `{supported, refuted, inconclusive}` (01); Gates A–G as enumeration + verbatim refusals (02); "field grammar is the only real defense" (03); Pydantic round-trip (04). Meta-A names this as convergence #2.
- **Disagreement.** None on principle. 03 raises that even closed-vocab fields require micro-judgment to populate ("which file counts as touched?") — but this is a refinement, not a contradiction.
- **Resolution.** `[lens-supported]` — adopt the discipline; per-field char cap is the second-order defense.
- **Implication for discovery.** Forbidden-fields list is required; per-field grammar is required; ≤80-char inline cap is recommended (no linter yet).

### Theme 3 — Promotion and retirement are flag-only

- **Lenses speaking to it.** 01, 02, 04, Meta-A.
- **Convergence.** Three of four lenses converge: close-session never writes to `premise/`, `constitution/`, or axiom files in a way that promotes; it sets `promotion_candidate: true` (≥3 corroborations) or `retired: true` (single clean falsification) — Popperian asymmetry. Meta-A names this convergence #3.
- **Disagreement.** None.
- **Resolution.** `[lens-supported]` — load-bearing.
- **Implication for discovery.** Two single-line frontmatter flags on the target premise file are the entire external write surface.

### Theme 4 — Judgment laundering is the primary failure mode

- **Lenses speaking to it.** 03 (alone, adversarial), with corroborating implications for 01 and 02.
- **Convergence.** Only Lens 03 named it explicitly, but every Lens-01 field requiring micro-judgment (`semantic`, slug, verdict assignment) and every Lens-02 refusal that can be paraphrased are surface area for the failure mode. Meta-C reinforced this in the fixed-point walkthrough (Layer 1 inflated `experiments_run` fires Gate E spuriously).
- **Disagreement.** Lens 03 prescribes infrastructure (JSON validator, post-write linter, audit-vault skill) that Meta-C calls "sized for a team with a platform engineer." The diagnosis is accepted; the fixes are scoped down.
- **Resolution.** `[lens-supported]` for the diagnosis; `[honest gap]` for the operational defense.
- **Implication for discovery.** Forbidden-fields list and per-field grammar are the immediate defenses; auditing is named in the Known Leaks block as a deferred discipline.

### Theme 5 — Objective terms are rhetorically strong, operationally vacuous

- **Lenses speaking to it.** 03 (raised), 04 (partially answers), Meta-A (acknowledges as quiet contradiction).
- **Convergence.** Lens 03 names "compression," "emergence," "signpost" as un-falsifiable as stated; Lens 04 proposes the Emergence Ratio (axioms reachable / total axioms) as the one operational proxy; Meta-A concedes the walker doesn't exist.
- **Disagreement.** Lens 03 doubts any single metric rescues the terms; Lens 04 commits to ER as the operational anchor.
- **Resolution.** `[lens-supported]` for ER as the named definition; `[empirical bet]` for whether it actually anchors meaning over 6 months.
- **Implication for discovery.** Adopt ER as a footnote pointer in SKILL.md; computation is deferred. Named, not yet measured.

### Theme 6 — Fleet design vs solo-dev scale

- **Lenses speaking to it.** 04 (proposes fleet design), Meta-C (rejects most of it).
- **Convergence.** None — Meta-C identifies Lens 04 as the weakest proposal precisely because it designs for cross-repo synthesizers, curator agents, migration tooling, and an ER walker that football-stats-oracle does not have and will not build in the first quarter.
- **Disagreement.** Sharp. Lens 04 wants `schema_version:`, `layer:`, `repo:`, `parent_session:`, `reckon_gates_fired:`; Meta-C wants exactly five fields.
- **Resolution.** Meta-C wins on present scope. Lens 04's framing (kernel + adapter, ER as success metric) survives as long-term direction; the fields are dropped from the MVP and added to a forbidden-fields list so re-adding them requires justification.
- **Implication for discovery.** Adopt Meta-C's 5-field MVP as the skeleton (`created`, `files_touched`, `premise_tests`, `candidate_premises`, `artifacts`). Defer everything else with named placeholders.

### Theme 7 — Gaps the objective demands but no lens fills (Meta-B)

- **Lenses speaking to it.** Meta-B alone, with each gap pointing back at a lens that should have but didn't.
- **Convergence.** N/A (sole voice). The seven gaps: (1) "auditable both directions" never operationalized; (2) no session-boundary definition; (3) no defer-close path; (4) no self-provenance for the close-session run; (5) no per-session distillation check; (6) no cold-start story; (7) no post-write Layer-1/Layer-2 boundary check.
- **Disagreement.** N/A — each gap is real and acknowledged.
- **Resolution.** `[lens-supported]` — all seven must be addressed in the discovery or honestly deferred.
- **Implication for discovery.** Adopt grep audit recipes (gap 1), defer-close exit `CLOSE_DEFERRED: <reason>` (gap 3), cold-start clause when `premise/` has <3 files (gap 6), Known Leaks block at top of SKILL.md (gaps 4, 5, 7). Gap 2 (session boundary) is deferred to the brainstorming/close-brainstorm boundary discovery.

### Theme 8 — Most-likely-to-be-ignored rules (Meta-C)

- **Lenses speaking to it.** Meta-C alone, naming two rules.
- **Convergence.** N/A. The two rules are (a) Reckon hard-refuses at line 11 with narrative-marker diagnostics (workaround: semicolon-joined lines, push into Layer 1 values); (b) retirement-replacement cooling period (intolerable in practice when working memory is loaded).
- **Disagreement.** N/A — Meta-C's prediction stands until empirically tested.
- **Resolution.** `[lens-supported, prediction]`.
- **Implication for discovery.** Drop the cooling period (Lens 02's rule). Keep the line cap but accept the workaround risk (OQ-10).

## Unique Contributions

- **Lens 01.** Complete Layer-1 schema (~20 fields), `record_budget: auto` formula with explicit coefficients, write-order-plus-sentinel freeze enforcement, collapse rule for mass-touch sessions.
- **Lens 02.** Strict-order 7-gate routing tree, verbatim refusal table (6 entries), flag-only promotion criteria (≥3 corroborations, no prior `retires:`), 10-line cap with three escalation tiers.
- **Lens 03.** Catalog of 8 failure modes with concrete examples, judgment-laundering diagnosis, drift patterns over 100 sessions (field-name rot, optional-field accretion, session-as-premise substitution, verdict template ossification, backfill rot).
- **Lens 04.** Downstream-reader table with hard requirements per reader, bidirectional-vs-unidirectional edge rule with the "immutable evidence-stage targets receive no inverse rows" generalization, Emergence Ratio definition, kernel/adapter pattern.
- **Meta-A.** Eight ≥3-lens convergences, eight compatible-but-uncombined moves, shared mental model ("write-once, append-only valve in a directional compression pipeline").
- **Meta-B.** Seven gaps the objective demands but no lens fills, first-use walkthrough, skill-as-prompt-text requirements, scale-fit critique for football-stats-oracle, honest-defers list.
- **Meta-C.** Weakest-proposal naming (Lens 04 = designs for a fleet that doesn't exist), most-over-engineered (Lens 03 = sized for a platform team), most-likely-to-be-ignored (Lens 02's hard refuse + cooling period), fixed-point walkthrough showing Lens 01 + Lens 02 verbatim produce mutually-contradicting notes, 5-rule MVP.

## Open Questions Forwarded to Discovery

These are decision-shaped questions that lens-layer investigation cannot resolve.

- **Q-R1.** Which freeze mechanism survives? Write-order + sentinel (01), in-prompt refusal (02), post-write linter (03)? **Recommendation.** Write-order + closed-vocab field grammar for MVP; sentinel and linter named in Known Leaks. Becomes discovery OQ-1 and OQ-10.
- **Q-R2.** Does `record_budget` survive? **Recommendation.** Keep as `record_lines: auto | <int>` (renamed to prevent "importance dial" misreading); re-evaluate after 30 sessions. Becomes discovery OQ-2.
- **Q-R3.** Refusal escalation on re-ask? **Recommendation.** Repeat verbatim, never escalate, never comply. Becomes discovery OQ-3.
- **Q-R4.** Cold-start exit condition? **Recommendation.** Bootstrap clause turns off when `premise/` has ≥3 files. Becomes discovery OQ-4.
- **Q-R5.** Multi-route sessions (e.g., refutation + replacement)? **Recommendation.** Honor both fields; drop Lens 02's cooling period per Meta-C. Becomes discovery OQ-5.
- **Q-R6.** Port to sister repos? **Recommendation.** Defer until one quarter of proven use in football-stats-oracle. Becomes discovery OQ-6.
- **Q-R7.** Operational definition of "emergence"? **Recommendation.** Adopt Lens 04's ER as footnote pointer; computation deferred. Becomes discovery OQ-7.
- **Q-R8.** Promotion-candidate review cadence? **Recommendation.** Manual quarterly triage by user; named in Known Leaks. Becomes discovery OQ-8.
- **Q-R9.** Drift detection cadence? **Recommendation.** Every ~30 sessions, re-read most recent 5 by eye. Named in Known Leaks. Becomes discovery OQ-9.

## Provenance

- **Lens slate dispatched on.** 2026-05-16 (propose wave, N=4) and 2026-05-17 (evaluate wave, M=3), pre-migration. Original dispatch prompts are not recoverable; `dispatch_status: historical` on every lens findings file.
- **Strategist.** Not recorded. These lenses predate the `/domainspec-subagents-strategy` skill's bootstrap convention; no strategist file exists.
- **Lens count.** 4 propose-wave + 3 evaluate-wave meta-lenses = 7 total, all consolidated here.
- **Method note.** This research synthesis is `analysis-method: meta-lens-consolidation` — it re-presents the three meta-lens findings under the new convention's schema rather than re-deriving cross-lens analysis from the 4 propose-wave lenses independently. The substantive analytic work is already in the meta-lenses; this file is a structural reformat for the new lens → research → discovery convention.

## Connections

- `derives-from` → `../lenses/01-record-layer-mechanics/findings.md`
- `derives-from` → `../lenses/02-reckon-layer-discipline/findings.md`
- `derives-from` → `../lenses/03-adversarial/findings.md`
- `derives-from` → `../lenses/04-cross-skill-continuity/findings.md`
- `derives-from` → `../lenses/META-cross-cutting/findings.md`
- `derives-from` → `../lenses/META-gap-analysis/findings.md`
- `derives-from` → `../lenses/META-adversarial-review/findings.md`
- `cited-by` → `research-synthesis.md`
- `cited-by` → `../discovery.md`
