---
tags: [domainspec, methodology, axioms, premises, vault, validation]
node_type: discovery
is_session: false
layer: ontology, domain
nature: explanatory
status: active
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-17
---

# Discovery — DomainSpec Axioms: Which Foundations Stand After Independent Validation

> The methodology pair `vault/axiom/domainspec-axioms.md` and `vault/premise/domainspec-premises.md` was validated by a three-child fan-out (operationalization audit, empirical repo-state audit, math/formalism review). This discovery records which AX-DS-* statements survive as axioms, which premises hold, where the appendix math is doing rhetorical rather than load-bearing work, and what counts as a "discipline" rather than an axiom. It is the design-space synthesis sitting one layer above the per-claim findings; concrete edit decisions on the source docs are out of scope here and belong to a separate edit pass.

## Objective

Record the decisions and open questions that emerged from the `domainspec-axioms-and-premises-validation` fan-out about which DomainSpec methodology axioms are genuinely load-bearing, which are dressed-up discipline, and which sit on contested math. The end state is a single discovery node future axiom/premise edits, plus any spec promotion, can derive from — without re-running the audit.

---

## 1. Business Context

### Why now

The user authored `vault/axiom/domainspec-axioms.md` (v0.5.0, four AX-DS-* axioms with math appendices A.1–A.4) and `vault/premise/domainspec-premises.md` (v0.1.0, eleven active P-DS-* premises with two explicit demotions). Before these documents become load-bearing for downstream methodology work (constitutions, skills, the spec pipeline), the user dispatched an independent three-child validation. Findings exist (`research/domainspec-findings.md`); without a discovery promoting their conclusions to a decision layer, the next maintainer would have to re-read the full audit to know which axioms still count.

### What's broken

Each item below points at a specific defect in the current `vault/axiom/domainspec-axioms.md` or `vault/premise/domainspec-premises.md`, surfaced by the audit:

- **AX-DS-1 operationalization claim is empty for its brownfield boundary condition.** The axiom cites `.claude/skills/domainspec-brownfield-translation/SKILL.md` as operationalizing the three P-DS-12 obligations (candidate-set surfacing β(C), rejected-candidate preservation, steady-state marker); the skill text contains zero implementation of any of the three. (`research/domainspec-findings.md` F1, F21; `research/domainspec-research.md` Agent 1 AX-DS-1.op-4, Agent 2 Claim 6).
- **AX-DS-3.op-1 cites the wrong agent.** Orphan-citation detection is assigned to `.claude/agents/domainspec-layering-auditor.agent.md`, which detects layer-misplacement, not citation absence. The orphan check is structurally the alignment auditor's role. (F2; Agent 1 AX-DS-3.op-1).
- **AX-DS-3.op-2 imports "artifact graph" vocabulary with no implementation.** `.claude/agents/domainspec-alignment-auditor.agent.md` reads flat feature SPEC docs and code; no agent traverses the vault graph. (F3; Agent 1 AX-DS-3.op-2).
- **AX-DS-4.op-1 phrases an on-demand skill as a guardian.** `.claude/skills/domainspec-decision-gate/SKILL.md` returns BLOCK only when manually invoked; there is no hook, CI, or `PreToolUse` guard. (F4, F11; Agent 1 AX-DS-4.op-1, Agent 2 Claim 1).
- **AX-DS-1.op-3 says "enforce" for a soft gate.** `.claude/skills/domainspec-spec-feature/SKILL.md` step 0 is a HALT-with-recommendation that accepts a `--skip-discovery` waiver. (F8; Agent 2 Claim 7).
- **P-DS-2 demotion footnote inverts the cause of L2 emptiness.** The footnote claims `apps/` does not exist; `apps/web/` and `backend/src/` both exist — the extractor was simply never run. (F7; Agent 2 Claim 2, Claim 8, Surprise S1).
- **P-DS-7 says "drives" where the cycle proposes.** `.claude/skills/domainspec-reflect/SKILL.md`'s authority rule forbids modifying skill/source files; it produces a `TUNING-REPORT.md` subject to human approval. (F5; Agent 1 P-DS-7.op-3).
- **P-DS-8 lumps two skills with incompatible artifact models.** `.claude/skills/robot-talks/SKILL.md` mandates session-file persistence; `.claude/skills/domainspec-subagents-strategy/SKILL.md` R4/R5 forbids strategist file writes. (F6; Agent 1 P-DS-8.op-2).
- **Math appendices A.1–A.4 are mostly decorative.** Specific errors: DPI invocation without a defined random variable (F12, A.1); Curry–Howard called "structurally identical" (F13, A.1); Hadamard never used in body text (F14, A.1); "natural transformation" with no functors specified (F15, A.2); `H(Σ_C | Σ_S, R) = 0` without the surjectivity assumption (F16, A.2); `H(B|A) = 0` trace-direction error (F17, A.3); off-by-one in `H(A_t | D_t) = log₂(|A_t| − 1)` (F18, A.4); EVPI/Lindley stretched (F19, A.4); Jaynes calibration category error (F20, A.4).

### What stays the same

Explicit non-goals of this discovery:

- The source documents `vault/axiom/domainspec-axioms.md` and `vault/premise/domainspec-premises.md` are **not edited** here. Concrete edits belong to a separate pass owned by the user.
- The `@biz` and CLI-tool claims excluded from the audit scope remain out of scope.
- The five-way triage's two unselected angles (C: cross-doc consistency, E: falsifiability meta-audit) are not retroactively run.
- The agent and skill files themselves are not modified; if AX-DS-1's brownfield obligations are to be cashed out as code, that is a separate implementation plan.

---

## 2. Core Concepts

### Axiom vs. discipline (epistemic-honesty constraint)

An **axiom** in this methodology has to satisfy two conditions, both surfaced by the audit:

1. Its operationalization claims must be cashable in agents/skills that actually exist and actually behave as cited (Child A's question).
2. Its empirical claims about the repo must hold (Child B's question).

A claim that fails either test but still expresses a normative commitment the user intends to follow is a **discipline**, not an axiom. The distinction matters because the vault is universal-domain (MEMORY: `project_vault_universal_domain.md`) — calling something an axiom asserts it is non-negotiable across any domain that imports DomainSpec; calling it a discipline says "we choose to do this here, on purpose, without mechanical enforcement." The audit's F11 (no CI) and F4 / F8 (soft gates phrased as guardians) make this distinction load-bearing for the whole axiom layer.

This is the same anti-pattern flagged in the user's `feedback_epistemic_honesty` memory: **don't dress heuristics in math vocabulary**, and don't dress disciplines in axiom vocabulary.

### Which axioms survive as axioms (audit verdict, A1 of findings)

- **AX-DS-1 (compilation direction & brownfield exception)** — survives as axiom; brownfield clause currently a discipline until skill cashes it out.
- **AX-DS-2 (one-vocabulary invariant)** — survives as axiom; the underlying commuting diagram is the strongest piece of math in the doc.
- **AX-DS-3 (every behavior cited)** — survives as axiom; agent attributions need correction.
- **AX-DS-4 (decision-record persistence)** — survives as axiom; "blocks document mutation" is empirically discipline, not guardrail.

No axiom is demoted to premise. Three of four need wording edits in a downstream pass.

### Which premises survive as premises (audit verdict, A2 of findings)

- **P-DS-2 and P-DS-3** — demotions from axiom to premise are well-founded (F9, F10 confirm). Only the P-DS-2 footnote's causal claim about missing source directories needs correction.
- **P-DS-4, P-DS-7, P-DS-8, P-DS-9, P-DS-12** — all stand; verb-level wording edits only.
- **P-DS-1, P-DS-5, P-DS-6, P-DS-10, P-DS-11** — not directly audited; treated as standing absent specific evidence (gap acknowledged in A1 §Coverage = 0.85).

### Math appendices: load-bearing vs. decorative (A3 of findings)

Only one appendix is doing genuine work:

- **Genuinely load-bearing:** A.2's commuting diagram and its three conditions (coverage, injectivity, `N_C ∘ Φ_concept = N_S`) — they guide `.claude/skills/domainspec-sync-registry/SKILL.md` and capture the one-vocabulary invariant in algebra over finite sets.
- **Sound but not doing work:** A.3 surjectivity-vs-bijectivity distinction; A.4 EVPI direction.
- **Decorative / over-claim / errors:** DPI chain, Curry–Howard, Hadamard, natural-transformation language, `H(Σ_C | Σ_S, R) = 0` without surjectivity, `H(B|A) = 0` direction conflation, entropy off-by-one, Jaynes/calibration parallel.

The appendices are doing rhetorical work — making the document feel more rigorous than it is. This is exactly the failure mode the user's epistemic-honesty memory warns against.

### CI vacuum is the empirical frame, not a per-claim defect

F11 (no `.github/workflows/`) is not one bug — it is the global frame. Every "blocks," "enforces," "rebuilds on every sync" verb across both source docs is conditional on manual invocation. Two responses are coherent: (1) replace mechanical verbs with invocation-conditional verbs throughout; (2) build the missing infrastructure. The discovery records both as live options; the choice is downstream.

---

## 3. Decisions Taken

> Each decision is supported by a finding in `research/domainspec-findings.md`. Edits to the source axiom/premise documents are deferred to a separate pass; this discovery records the design intent.

### D-1 — All four AX-DS axioms remain axioms

**Decision:** AX-DS-1, AX-DS-2, AX-DS-3, AX-DS-4 stay in `vault/axiom/domainspec-axioms.md`. None are demoted to premise.

**Rationale:** Findings A1 (in `research/domainspec-findings.md` §Analysis) verifies that the core claims survive the operationalization audit and the empirical audit; defects are at the wording layer, not at the claim layer. Demotion would discard load-bearing methodology commitments because of cosmetic problems in cited verbs.

**Status:** Accepted.

### D-2 — P-DS-2 and P-DS-3 demotions stand

**Decision:** Keep both axiom→premise demotions performed in the 2026-05-05 audit of `vault/premise/domainspec-premises.md`. Correct only the P-DS-2 footnote's causal explanation per F7.

**Rationale:** F9 confirms no Tier-2 verifiers exist; F10 confirms `.claude/agents/domainspec-alignment-auditor.agent.md` does not consume `delta.json`. The categorical pipeline is empirically a closed loop with no operational consumer. Demotion is the right call.

**Status:** Accepted.

### D-3 — Math appendices A.1–A.4 are rhetorical, not load-bearing (except A.2's commuting diagram)

**Decision:** Treat the appendices as informal heuristics dressed in mathematical notation, not as theorems grounding the axioms. The single load-bearing piece is A.2's commuting diagram and its three conditions; the rest is decorative.

**Rationale:** Findings A3 (in `research/domainspec-findings.md` §Analysis) enumerates each appendix item against Claude's training and identifies six over-claims, three decorative citations, one entropy off-by-one, and one trace-direction error. Keeping the appendices as-is risks future maintainers reading the formalism as ground truth; the user's `feedback_epistemic_honesty` memory explicitly warns against this anti-pattern.

**Status:** Accepted; the operational form (trim vs. move to a separate `domainspec-rationale.md` doc) is OQ-1.

### D-4 — "Brownfield boundary condition is operationalized" is currently a discipline, not an axiom claim

**Decision:** Until `.claude/skills/domainspec-brownfield-translation/SKILL.md` implements (a) candidate-set β(C) surfacing, (b) rejected-candidate preservation as `node_type: decision` artifacts, and (c) a steady-state transition marker, the AX-DS-1 brownfield exception is a normative commitment the methodology asserts but does not enforce. P-DS-12 already admits this; AX-DS-1 must align.

**Rationale:** F21 (cross-cutting; A+B converge). The single most self-contradicting place in the doc-pair is that AX-DS-1 claims operationalization while P-DS-12 directly below admits the obligations are open. The honest framing under D-4 is the cheap path; cashing the obligations out in the skill (A4 of findings) is the expensive path. This discovery records the *current state* as discipline; the choice between cheap path and expensive path is OQ-2.

**Status:** Accepted (as a description of current state); the resolution path is OQ-2.

### D-5 — Mechanical verbs in axiom/premise text default to invocation-conditional under the CI vacuum

**Decision:** While `.github/workflows/` is empty, all "blocks / enforces / rebuilds / auto-X" verbs in both source documents are read as invocation-conditional. Future edits should use that phrasing.

**Rationale:** F11 makes this empirical; F4 and F8 are specific manifestations. Without this convention, every axiom doc reader has to re-derive that the methodology is normative-not-mechanical.

**Status:** Accepted as a global frame; per-claim edits are downstream.

---

## 4. Alternatives Considered

### A-1 — Demote AX-DS-1 to a premise rather than fix the brownfield gap

**Alternative:** Because F21 shows the brownfield obligations are unimplemented and P-DS-12 admits openness, treat the whole axiom as a premise.

**Why not chosen:** The compilation-direction core of AX-DS-1 (operationalized by `.claude/agents/domainspec-alignment-auditor.agent.md` and `.claude/agents/domainspec-layering-auditor.agent.md`) is verified by F1's adjacent confirmations (AX-DS-1.op-1, AX-DS-1.op-2). Demoting the whole axiom because of one unimplemented boundary clause would lose the load-bearing direction claim. D-1 + D-4 carve the axiom from the discipline.

### A-2 — Remove the math appendices entirely

**Alternative:** Strip A.1–A.4 from `vault/axiom/domainspec-axioms.md`. Axioms survive in plain English.

**Why not chosen as default:** A.2's commuting diagram is doing operational work for `.claude/skills/domainspec-sync-registry/SKILL.md`. The choice between "trim aggressively (keep A.2's diagram only)" and "move appendices to a separate `domainspec-rationale.md`" is recorded as OQ-1 rather than pre-decided here. Either path is consistent with D-3.

### A-3 — Implement P-DS-12 (a/b/c) obligations in the brownfield skill now

**Alternative:** Fix AX-DS-1 by cashing out the brownfield boundary condition in `.claude/skills/domainspec-brownfield-translation/SKILL.md` rather than by softening the axiom's wording.

**Why not chosen here:** This is an implementation-plan, not a discovery decision. It is the highest-leverage edit per findings A4, and it is recorded as OQ-2 with a recommendation. The discovery's job is to surface the choice; the implementation is downstream.

### A-4 — Add a falsifiability / cross-doc-consistency audit before deciding

**Alternative:** Re-run the audit with the two de-scoped angles (C: cross-doc consistency, E: falsifiability meta-audit) before promoting any decision.

**Why not chosen:** Coverage is already at 0.85 (`research/domainspec-findings.md` §Dispatch record); the three executed angles cover operationalization, empirical state, and math, which is the union of "does the claim run," "is the claim true about the repo," and "is the claim formally defensible." The two missing angles are about doc-internal consistency and falsifiability framing — useful but not gating. Recorded as OQ-3.

---

## 5. Open Questions

### OQ-1 — Trim appendices in place, or move them to `domainspec-rationale.md`?

**Question:** A3 of findings gives two coherent paths for the appendix layer. Which does the methodology pick?

**Recommendation:** Move A.1, A.3, and A.4 to a new `vault/discovery/domainspec-rationale/` discovery (or to a sibling doc in the same axiom folder framed as "motivational rationale, not formal grounding"). Keep A.2's commuting diagram inline with AX-DS-2 because it does operational work for `.claude/skills/domainspec-sync-registry/SKILL.md`. Rationale: trimming inline leaves the appendices half-existing and prone to drift; moving them lets the axiom doc be honest about its formal load (single diagram in A.2) without losing the rationale entirely.

### OQ-2 — Cash out the P-DS-12 obligations in `.claude/skills/domainspec-brownfield-translation/SKILL.md`, or weaken AX-DS-1's operationalization claim?

**Question:** D-4 records the current state; the resolution path is unsettled.

**Recommendation:** Cash them out (the expensive path). Per A4 of findings, this is the single highest-leverage edit in the entire doc-pair: three independent forces (AX-DS-1's most distinctive claim, P-DS-12's admission of openness, empirical zero-implementation) converge. The cheap path leaves DomainSpec with a documented brownfield bootstrap that is purely normative — and brownfield is the explicitly-named entry point for adopting DomainSpec in any consumer repo (MEMORY: `project_domainspec_is_meta_framework.md`). Doing this requires a separate implementation plan against the skill; that plan is out of this discovery's scope.

### OQ-3 — Are the two de-scoped audit angles (C: cross-doc consistency, E: falsifiability meta-audit) worth running before any spec promotion?

**Question:** Coverage is 0.85 with two angles excluded. Future spec work derived from these axioms may need them.

**Recommendation:** Defer until a concrete spec is being written that derives load-bearing structure from these axioms. The current discovery is sufficient for the axiom/premise edit pass. If a spec promotion path (per MEMORY: `project_post_discovery_fork.md`) is taken, surface this OQ to the user at that fork.

### OQ-4 — Should the "discipline vs. axiom" distinction be promoted to an ontology rule?

**Question:** This discovery uses the distinction informally (see Core Concepts §1). It is general enough that it could be codified in `vault/ontology-conventions.md` or in a new constitution.

**Recommendation:** Defer to a separate session. The distinction is sound enough to use in this discovery but not yet load-bearing enough across multiple discoveries to justify an ontology amendment. Re-evaluate after one more discovery uses the same distinction.

### OQ-5 — Are the five unaudited premises (P-DS-1, P-DS-5, P-DS-6, P-DS-10, P-DS-11) worth a follow-up dispatch?

**Question:** Coverage gap; treated as standing absent specific evidence. The findings flag this as known but not investigated.

**Recommendation:** No follow-up dispatch unless one of these premises becomes load-bearing for a downstream artifact. Cheap to defer; expensive to over-audit.

---

## 6. Source Dispatch & Provenance

- **Source findings (synthesis):** [`research/domainspec-findings.md`](./research/domainspec-findings.md) — three-child fan-out verdicts and analysis, every claim above cites a finding ID (F1–F21) or an analysis section (A1–A4) in that file.
- **Source research (raw per-child returns):** [`research/domainspec-research.md`](./research/domainspec-research.md) — verbatim child output the findings synthesize from.
- **Audit date of source claims:** 2026-05-05 (the dispatch date); discovery written 2026-05-17.
- **Coverage caveat:** 0.85 (judgment), per R22; two of five originally-triaged angles (C cross-doc consistency, E falsifiability meta-audit) were de-scoped by user. See OQ-3.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./research/domainspec-findings.md](./research/domainspec-findings.md) | `derives-from` | Every decision and open question above traces to a finding ID or analysis section in the synthesis file. |
| [./research/domainspec-research.md](./research/domainspec-research.md) | `cites` | Raw per-child returns underlying the findings; cited for traceability rather than re-derivation. |
| [../../axiom/domainspec-axioms.md](../../axiom/domainspec-axioms.md) | `cites` | The source axiom document whose AX-DS-1..4 (and appendices A.1..A.4) this discovery synthesizes verdicts about. Edits remain owned by the source doc. |
| [../../premise/domainspec-premises.md](../../premise/domainspec-premises.md) | `cites` | The source premise document whose P-DS-* claims this discovery synthesizes verdicts about. |
| [../../constitution/domainspec-subagents-strategy-constitution.md](../../constitution/domainspec-subagents-strategy-constitution.md) | `governed-by` | The dispatch producing the source findings was governed by this constitution (R5, R15, R16, R17, R18, R21, R22, R23). |
