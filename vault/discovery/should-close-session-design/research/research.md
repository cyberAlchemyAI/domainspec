---
tags: [vault, research, should-close-session-design]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
backfilled: true
analysis-method: meta-lens-consolidation
---

# Research — Should-Close-Session Recommender Design

> **Backfill note.** This research synthesis was written AFTER `discovery.md` was already drafted (the discovery was written on 2026-05-17 directly from the 4 propose-wave lenses and 3 evaluate-wave meta-lenses, without an intermediate research-layer document). The post-hoc consolidation re-reads the three second-order meta-lenses as a single research artifact to retrofit the new lens → research → discovery chain. The analysis-method is **meta-lens-consolidation**: Meta-A (cross-cutting), Meta-B (gap analysis), and Meta-C (adversarial review) were originally dispatched as a parallel evaluate wave over the four propose-wave lenses; this document is their joined reading.

## Objective

Synthesize, from the 4 propose-wave lenses (signal design, form factor, non-nag discipline, adversarial) and the 3 evaluate-wave meta-lenses (cross-cutting, gap analysis, adversarial review), what the design space around the `should-close-session` recommender actually contains — which pieces are mechanically load-bearing, which are calibration theater, and which are empirical bets. Surface cross-lens convergence and the load-bearing fixed-point conflict before they collapse into the discovery's narrative.

## Lens Inventory

| # | Lens | Wave | Framing | Headline finding | Confidence |
|---|------|------|---------|------------------|------------|
| 01 | [Signal design](../lenses/01-signal-design/findings.md) | propose | Structural | 13-signal catalog ranked; `note_likely` is the hard veto; tiered scoring (Silent / Soft hint / Clear / Hard) for everything else | medium (`[model-recall]`) |
| 02 | [Form factor](../lenses/02-form-factor/findings.md) | propose | Operational | Stop hook in `football-stats-oracle/.claude/settings.json` + co-located SKILL.md; PreCompact as secondary; sentinel co-located with scratchpads | high (`[local-files-read]`) |
| 03 | [Non-nag discipline](../lenses/03-non-nag-discipline/findings.md) | propose | Behavioral | Per-session cap=1, per-day=3, trust-score state machine with explicit decay, real-session-value precondition first | medium (`[model-recall]`) |
| 04 | [Adversarial](../lenses/04-adversarial/findings.md) | propose | Limitative | Steelman: don't build it; reflexivity is unfixable; only mechanical observables; 20-session observe-only bootstrap; declared kill-switch | high (`[model-recall, structural-argument]`) |
| META-A | [Cross-cutting](../lenses/META-A-cross-cutting/findings.md) | evaluate | Triangulation | 7 convergences (triage veto, silence default, one-fire, agent introspection disqualified, FS-observable signals, cross-session state, time/turn/pressure not triggers); 7 compatible-but-uncombined moves | high (`[lens-derived]`) |
| META-B | [Gap analysis](../lenses/META-B-gap-analysis/findings.md) | evaluate | Gap-hunt | 7 holes (session-id undefined, SKILL.md undrafted, reflexivity acknowledged-then-violated, bootstrap tension, no kill-switch evaluator, no close-session exit interaction model, cross-repo telemetry); first-use walkthrough surfaces 4 unstated assumptions | high (`[lens-derived]`) |
| META-C | [Adversarial review](../lenses/META-C-adversarial-review/findings.md) | evaluate | Stress-test | Lens 03 weakest (trust-score arithmetic is fake precision); Lens 01 most over-engineered (tier ladder contradicts silence rule); fixed-point walk shows Stop-hook timing fundamentally cannot deliver Lens 03's "prompt before close"; 5-rule MVP collapses to Lens 04 + one concession | high (`[lens-derived]`) |

## Cross-Lens Analysis

### Theme 1 — Triage veto is the load-bearing gate

- **Lenses speaking to it.** 01, 02, 03, 04, META-A
- **Convergence.** All four propose-wave lenses independently derive the same load-bearing rule: if closing right now would produce no note (`close-session`'s Step 0 triage gate fails), the recommender stays silent regardless of any other signal. Meta-A names it convergence #1.
- **Disagreement.** None. The disagreement is *upstream* of this rule — Lens 04 argues the existence of this rule inside close-session makes the recommender redundant; Lenses 01–03 take the rule as load-bearing input.
- **Resolution.** `[lens-supported]` — load-bearing, multi-corroborated.
- **Implication for discovery.** D-2 (single hard gate: `git status` non-empty AND sentinel absent) implements this. The `note_likely` proxy may drift from close-session's actual gate (OQ-4) — a documented risk, not a design choice.

### Theme 2 — Reflexivity is the load-bearing failure mode

- **Lenses speaking to it.** 04 (proposes it), META-A (corroborates as convergence #4–5), META-B (Gap 3: acknowledged-then-violated), META-C (Lens 04 is the only lens that survives the fixed-point walk intact)
- **Convergence.** Reflexivity — the agent that reads any recommender output is the same agent that produced the work and writes the note — is named load-bearing by lens 04, corroborated by META-A as the reason agent introspection is disqualified, and confirmed by META-B as the reason Lenses 01 and 02 quietly violate the mechanical-observables rule with normative payloads. META-C's fixed-point walk shows lens 04 is the only one whose prescriptions survive intact.
- **Disagreement.** Lenses 01 and 02 emit normative verdicts ("close now," "consider closing"). META-B names this as the acknowledged-then-violated gap; the lenses themselves do not engage the contradiction.
- **Resolution.** `[lens-supported]` with `[honest gap]` status — reflexivity reduction is the only structural defense, but it is *reduction* not *elimination* (lens 04's "honest cannot fix"). The agent will still interpret mechanical observables.
- **Implication for discovery.** D-3 (output is mechanical observables only) honors this. The honest framing in §6 tension 2 ("the recommender does not measure closeability — it can create it") carries the unfixable residue.

### Theme 3 — Calibrated discipline collapses under fixed-point

- **Lenses speaking to it.** 03 (proposes), META-C (refutes), META-A (compatible-but-uncombined moves #2, #3 try to rescue), META-B (Gap 2: state-machine has no writer)
- **Convergence.** META-C ranks lens 03 as the weakest proposal because its trust-score arithmetic, per-signal-combination snoozes, and 3-turn classification window all require inputs the system cannot reliably observe (dismissal classification on solo-dev replies, multi-turn state coordination from a Stop hook). META-B names the same problem structurally: the state machine has no writer.
- **Disagreement.** Lens 03 itself does not engage the writer problem. META-A tries to rescue lens 03 by treating lens 04's observe-only bootstrap as the trust-score initialization (move #3), but this conflates calibration with measurement.
- **Resolution.** `[lens-refuted]` for the calibrated form; `[lens-supported]` for the underlying principle (silence as default, no escalation).
- **Implication for discovery.** D-4 (single-fire sentinel, no `close-session` coupling) implements the surviving principle; the trust score, snooze ledger, and classification window are explicitly dropped per A-2 (rejected as "weakest proposal"). The tension surfaces in §6 tension 1.

### Theme 4 — Stop-hook timing cannot deliver pre-emptive nudges

- **Lenses speaking to it.** 02 (chose Stop hook), META-C (fixed-point walk identifies the timing flaw), META-B (Gap 1: first-use walkthrough confirms nudge lands one turn late)
- **Convergence.** META-C's fixed-point walkthrough of a real session shows the Stop hook fires *after* the assistant turn responding to a closing-shaped utterance — the nudge is always structurally one turn late. META-B's first-use walkthrough reaches the same conclusion: on the final turn of a session, `additionalContext` lands in the *next* session by which time it is stale.
- **Disagreement.** Lens 02 acknowledges hook-latency and "no surface if agent doesn't respond" as failure modes but treats the timing flaw as acceptable; META-C escalates it to load-bearing.
- **Resolution.** `[lens-supported]` for the diagnosis; `[empirical bet]` for whether the "one turn late" cost matters at solo-dev scale.
- **Implication for discovery.** Discovery §1 "What's broken" bullet #4 names this honestly. The MVP accepts the timing limitation; the 20-session experiment is the falsification test.

### Theme 5 — Bootstrap trap dominates calibration math

- **Lenses speaking to it.** 04 (proposes 20-session observe-only), META-A (move #3 connects to lens 03), META-B (Gap 5: regime tension between lens 04 day-zero observe-only and lens 03 day-one trust-score=0.7), META-C (rule 5 of MVP)
- **Convergence.** Notification-fatigue research (lens 04 §Bootstrap trap) says a tool dismissed >5 times in its first 10 uses is silenced permanently. For a solo dev at ~20 sessions/month, 10 bad fires permanently sinks the skill. All evaluate-wave meta-lenses adopt observe-only-mode as the only honest entry; META-C makes the kill-switch a single env var.
- **Disagreement.** Lens 02 specifies hook firing on day one; lens 03 initializes trust score on session one. META-B names this regime tension as unresolved; META-C resolves it by making lens 04's bootstrap the only first-deploy state.
- **Resolution.** `[lens-supported]` for observe-only; `[empirical bet]` for the 20-session threshold.
- **Implication for discovery.** D-5 honors this. The honest framing — "this is a 20-session experiment, not a long-lived skill" — is the discovery's structural commitment, not garnish.

### Theme 6 — Scale-fit: solo-dev voids most calibration apparatus

- **Lenses speaking to it.** META-B (scale-fit critique), META-C (most over-engineered ranking)
- **Convergence.** META-B's scale-fit section explicitly drops: lens 03's trust-score state machine (calibration system bigger than the thing calibrated), lens 03's per-signal snooze ledger (cross-session persistence for 1 user 1 repo), lens 01's S2 premise vocabulary shift (degenerate at `<3 premises`), lens 04's 30-session rolling-window telemetry (statistical significance fictional at this volume), lens 02's PreCompact secondary trigger (compaction rare on this project). META-C's MVP adopts this verbatim.
- **Disagreement.** None across the evaluate wave. Propose-wave lenses do not engage scale-fit directly.
- **Resolution.** `[lens-supported]` — scale-fit is the dominant constraint, not a tiebreaker.
- **Implication for discovery.** A-1 (Lens 01's 13-signal scoring), A-2 (Lens 03's trust score) explicitly rejected on scale-fit grounds. The discovery's design space is shaped by the user's 20-sessions/month volume, not by recommender-systems literature.

## Unique Contributions

- **Lens 01.** The only lens with a complete signal catalog (13 signals) and explicit ranking by reliability for this user's workflow. The disqualification of S13 (agent self-assessment) is unique to 01.
- **Lens 02.** The only lens grounded in concrete harness artifacts (`gitnexus-hook.cjs` line refs, `football-stats-oracle/.claude/settings.json` empty-canvas confirmation). The form-factor survey (8 mechanisms) and the integration contract with close-session are unique to 02.
- **Lens 03.** The only lens that operationalizes a trust-recovery loop (trust_score ∈ [0,1] with adjustment deltas and dormancy bands). Its enduring value is the surface area it offers for META-C to refute, not the proposed mechanism itself.
- **Lens 04.** The only lens that runs a steelman *against* building the skill, with six conditions and a build-it-only-if clause. The `useful_fire_rate` metric formula (and its honest "may be unmeasurable in practice" caveat) is unique to 04.
- **META-A.** The convergence catalog (7 ≥3-lens agreements) and the compatible-but-uncombined moves (7 instances of lenses inventing the same store independently) are unique to META-A.
- **META-B.** The first-use walkthrough (concrete failure modes step-by-step from install to session-end) is unique to META-B. The undrafted-artifacts inventory (8 required SKILL.md clauses + 7 required hook-script clauses) gives the discovery its honest-defers list.
- **META-C.** The fixed-point walkthrough of a real Saturday-afternoon session is unique to META-C and is the empirical test that surfaces Stop-hook timing as load-bearing.

## Open Questions Forwarded to Discovery

These are decision-shaped questions that lens-layer investigation cannot resolve.

- **Q-R1.** Should the recommender ship at all, or should A-3 (extend `close-session` with `--triage-only`) replace it? **Recommendation.** Ship the MVP as a 20-session experiment per D-5; if it fails, A-3 is the explicit next move, not a different recommender. The discovery encodes this as the "default is deletion, not retention" framing in OQ-7.
- **Q-R2.** Is the `note_likely` proxy's drift from close-session's actual gate (OQ-4) acceptable for v0, or should the hook call a shared `triage.sh` from day one? **Recommendation.** Best-effort proxy for v0; promote to shared script only if A-3 ships. Documented as a load-bearing honest defer.
- **Q-R3.** Should the observation log live in `football-stats-oracle/.claude/state/` (local) or `domainspec/vault/discovery/should-close-session-design/observations.jsonl` (canonical)? **Recommendation.** Local for v0 (OQ-3); promote to cross-repo only if the experiment graduates.
- **Q-R4.** Is the companion SKILL.md required or optional? **Recommendation.** Optional for v0 (OQ-5); ship only if observation-log review shows the agent verdict-laundering the mechanical observations.

## Provenance

- **Lens slate dispatched on.** 2026-05-17 (per all individual lens files, pre-migration).
- **Strategist.** Not recorded. These lenses predate the `/domainspec-subagents-strategy` skill's bootstrap convention; no strategist file exists.
- **Lens count.** 7 (4 propose-wave: 01, 02, 03, 04; 3 evaluate-wave: META-A, META-B, META-C). META-* lenses originally lived under `meta-lenses/`; migrated to `lenses/META-*/` with `lens_order: second` on 2026-05-18.
- **Analysis method.** `meta-lens-consolidation` — this research file is the joined reading of the three evaluate-wave meta-lenses against the four propose-wave lenses. It does not introduce new findings; it consolidates the existing evaluate-wave consensus and surfaces the cross-theme structure.
- **Notable absences.** No lens dispatched on: (a) the cross-repo write contract for telemetry (META-B Gap 7); (b) the harness-level question of whether `additionalContext` is accepted at Stop (lens 02 OQ#1, never spiked); (c) the question of whether a slash command (`/should-close`) is a better surface than a hook for explicit checks (rejected as primary in lens 02 but not re-evaluated).
- **Proposal artifact.** `proposal/SKILL.md` exists and ships as the agent-side response contract. The hook script and settings.json fragment also live under `proposal/`.

## Connections

- `derives-from` → `../lenses/01-signal-design/findings.md`
- `derives-from` → `../lenses/02-form-factor/findings.md`
- `derives-from` → `../lenses/03-non-nag-discipline/findings.md`
- `derives-from` → `../lenses/04-adversarial/findings.md`
- `derives-from` → `../lenses/META-A-cross-cutting/findings.md`
- `derives-from` → `../lenses/META-B-gap-analysis/findings.md`
- `derives-from` → `../lenses/META-C-adversarial-review/findings.md`
- `cited-by` → `research-synthesis.md`
- `cited-by` → `../discovery.md`
