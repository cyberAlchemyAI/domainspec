---
tags: [domainspec, methodology, vault, validation, subagents-findings]
node_type: subagents-findings
is_session: false
layer: domain, application
nature: explanatory, technical
status: active
version: 0.1.0
last_updated: 2026-05-05
template_for: domainspec-subagents-findings.md
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `domainspec-axioms-and-premises-validation`

> Preamble (Context + Goal, R23) followed by three fixed sections: **Dispatch record** → **Findings** → **Analysis** (R16). Every load-bearing claim in Findings and Analysis cites a passage in [`domainspec-research.md`](./domainspec-research.md) (R17).
>
> **Constitution:** [../../../constitution/domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

The user authored two new vault docs: `vault/axiom/domainspec-axioms.md` (v0.5.0, 4 non-negotiable methodology axioms with math appendices A.1–A.4, brownfield boundary condition, and Curry–Howard analogy) and `vault/premise/domainspec-premises.md` (v0.1.0, 11 active premises after a `@biz`/CLI strip, with P-DS-2 and P-DS-3 explicitly demoted from axiom status on a 2026-05-05 audit). Before these docs become load-bearing for the rest of the methodology, the user wanted an independent fan-out validation. Earlier triage proposed 5 angles; the user selected three: A — operationalization audit (does each cited agent/skill actually do what the doc claims), B — empirical state audit (are the factual repo-state claims true), D — math/formalism review against Claude's training (no toy verification). The user explicitly excluded `@biz` and CLI-tool claims from validation scope; those have been stripped from the source docs.

## Goal

Produce a per-claim verdict across operationalization fidelity, empirical repo-state, and math soundness, so the user can decide which AX-DS-* / P-DS-* statements stand, which need edits, and which should be further demoted or removed. No source-doc mutation in this run — findings recommend, user approves, separate edit pass.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Mode:** `task-fan-out` *(R19)*

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `a3960a96983df50dc` (Child A — operationalization-audit) | sonnet | Cross-reads 16+ agent/skill .md files against axiom/premise claims; structural pattern-matching with citation-grade evidence — sonnet sufficient. | ~52k tokens | Verdict table (per claim ID) + Notable Gaps narrative |
| `a37ae76cdb7801021` (Child B — empirical-state-audit) | sonnet | Filesystem inspection (`find`, `jq`) and JSON structural validation; mechanical execution under instruction — sonnet sufficient. | ~48k tokens | 8 per-claim blocks (Claimed / Observed / Verdict) + Surprises |
| `a85a6039de342db73` (Child D — math-formalism-review) | sonnet | Reading math appendices A.1–A.4 against training; tight verdicts (sound / over-claim / decorative) plus tighter-rewording suggestions — sonnet sufficient. | ~23k tokens | Per-appendix verdict list + citations review + hardest-finding narrative |

**Sequencing:** parallel set (3 children, no dependencies, no recursion).

**Recursion budget actually used:** depth = 1, breadth = 3, total agents = 4 (1 strategist + 3 children). Defaults per R13 are depth 2 / breadth 5 / total 10 — well under budget; no recursion used.

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `a3960a96983df50dc` (A) | n/a-disclosed | n/a-disclosed | ~52,000 |
| `a37ae76cdb7801021` (B) | n/a-disclosed | n/a-disclosed | ~48,000 |
| `a85a6039de342db73` (D) | n/a-disclosed | n/a-disclosed | ~23,000 |
| **Sum** | | | **~123,000** |

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.85` (judgment) | All 4 axioms and all 12 active premises inspected by ≥1 child across operationalization (A), empirical state (B), and math (D). Two angles from the original 5-way triage (C cross-doc consistency, E falsifiability meta-audit) were de-scoped by user — known gap, not oversight. |
| Independence     | `0.95` (judgment) | Each child read disjoint sources: A read agent/skill prompts, B ran filesystem checks and JSON inspection, D read math appendices only. No child saw another's return; no shared state. |
| Fidelity         | `0.95` (judgment) | Every child cited file:line evidence. B ran actual `find`/`jq` and reported counts. D worked from training as authorized. A read agent .md files directly. No verdict relies on inference without textual or empirical evidence. |
| Cost discipline  | `~1.0`            | declared budget vs actual: ~123k tokens used / no hard cap declared by strategist; well under default recursion budget (4 / 10 agents); proportionate to scope. |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in [`domainspec-research.md`](./domainspec-research.md) (R17).

### Operationalization defects (Child A)

#### F1 — AX-DS-1.op-4: `domainspec-brownfield-translation` does not implement the boundary condition it is cited to operationalize

- **Claim:** The axiom cites the brownfield-translation skill as operationalizing the AX-DS-1 boundary condition, but the skill text contains zero language implementing P-DS-12's three obligations: (a) candidate-set surfacing β(C), (b) rejected-candidate preservation per AX-DS-4, (c) steady-state transition marker.
- **Evidence:** [`domainspec-research.md` §Agent 1, AX-DS-1.op-4 verdict row + Gap 2](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim).
- **Verdict:** `claim-overstates-agent`.
- **Recommendation:** `edit` AX-DS-1 to drop the "operationalizes" framing and replace with "is the intended bootstrap entry point; the three boundary-condition obligations (a/b/c) are open and tracked under P-DS-12." Or, alternatively, treat this as the highest-leverage fix and instead modify the skill to implement (a/b/c) — see Analysis §A4.
- **Implication:** AX-DS-1 is the most cited axiom and currently the most under-implemented; this is the single most self-undermining claim in the doc-pair.

#### F2 — AX-DS-3.op-1: layering-auditor is the wrong agent for the orphan-citation check

- **Claim:** AX-DS-3 assigns "flags code units lacking a citation in any aspect" to `domainspec-layering-auditor`, but the layering auditor detects layer-misplaced behavior (domain vs. use-case), not citation absence; the orphan-behavior check is structurally the alignment auditor's role.
- **Evidence:** [`domainspec-research.md` §Agent 1, AX-DS-3.op-1 verdict row + Gap 3](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim).
- **Verdict:** `agent-says-something-different`.
- **Recommendation:** `edit` AX-DS-3.op-1 to reassign the orphan-citation check to `domainspec-alignment-auditor` and reserve the layering-auditor citation for the layer-misplacement sub-claim only.
- **Implication:** Cheap one-line fix; visible mis-citation undermines doc credibility for any reader cross-checking the agents.

#### F3 — AX-DS-3.op-2: "artifact graph" is aspirational language with no implementation

- **Claim:** The axiom says `domainspec-alignment-auditor` "cross-checks each behavior against the artifact graph," but the agent reads flat feature SPEC docs and code, not graph edges. The vault `## Connections` graph is not consumed by any auditor agent.
- **Evidence:** [`domainspec-research.md` §Agent 1, AX-DS-3.op-2 verdict row + Gap 4](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim).
- **Verdict:** `claim-overstates-agent`.
- **Recommendation:** `edit` to replace "artifact graph" with the concrete reality ("feature SPEC documents and code"), or `demote` the graph-traversal aspiration to a P-DS-* premise so it is acknowledged as unbuilt.
- **Implication:** Removes a piece of vocabulary that promises infrastructure (graph traversal in audits) that does not exist.

#### F4 — AX-DS-4.op-1: decision-gate is on-demand, not a guardian

- **Claim:** The axiom phrases the gate as if it "blocks document mutation when a decision is unresolved," implying always-on enforcement; in reality the skill produces a BLOCK verdict only when manually invoked — there is no hook, CI, or `PreToolUse` guard, and the BLOCK scope is narrower than "document mutation" (it covers SPEC/TEST-SPEC/implementation only).
- **Evidence:** [`domainspec-research.md` §Agent 1, AX-DS-4.op-1 verdict row + Gap 1](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim).
- **Verdict:** `agent-says-something-different`.
- **Recommendation:** `edit` AX-DS-4.op-1 to read: "When invoked, `domainspec-decision-gate` returns BLOCK on SPEC / TEST-SPEC / implementation mutations while a decision is unresolved. Enforcement is normative, not mechanically gated."
- **Implication:** Honest framing; preserves the axiom while removing the false guardian implication.

#### F5 — P-DS-7: `domainspec-reflect` proposes, never enacts

- **Claim:** P-DS-7 says the cycle "drives skill rewrites and agent prompt updates from data rather than vibes," but the reflect skill's authority rule explicitly forbids modifying skill or source files; it produces a TUNING-REPORT.md and optional GitHub issues, all subject to human approval.
- **Evidence:** [`domainspec-research.md` §Agent 1, P-DS-7.op-3 verdict row + Gap 6](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim).
- **Verdict:** `claim-overstates-agent`.
- **Recommendation:** `edit` P-DS-7 to "...accumulate into actionable patterns — enough to **propose** skill rewrites and agent prompt updates for human approval, rather than relying on vibes."
- **Implication:** Premise stays valid; the overstated verb is replaced; no demotion needed.

#### F6 — P-DS-8: `robot-talks` and `domainspec-subagents-strategy` have incompatible artifact models

- **Claim:** P-DS-8 lumps both skills under one "recommend-don't-auto-invoke" policy; the confirmation requirement is shared, but `robot-talks` mandates session-file persistence under `.claude/current_conversations/` while `domainspec-subagents-strategy` R4/R5 explicitly forbids strategist file writes during proposal/collection — the two skills have materially different output contracts.
- **Evidence:** [`domainspec-research.md` §Agent 1, P-DS-8.op-2 verdict row + Gap 5](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim).
- **Verdict:** `agent-says-something-different`.
- **Recommendation:** `edit` P-DS-8 to split the bullet: keep the shared confirmation policy, but explicitly note the artifact-model divergence (session-persisting tension audit vs. write-free fan-out research).
- **Implication:** Prevents a future invocation choice from being made on the false premise that the two skills are interchangeable fan-out tools.

### Empirical state defects (Child B)

#### F7 — P-DS-2 demotion footnote: `apps/` does exist (and so does `backend/src/`)

- **Claim:** The P-DS-2 footnote claims L2 is empty because "no `src/`, `tests/`, `apps/` exist in repo." Filesystem checks show `apps/web/` (with `src/`, `package.json`, `vite.config.ts`) and `backend/src/` both exist; the L2 emptiness is real but the cause is inverted — the extractor was never run, not that there's nothing to run against.
- **Evidence:** [`domainspec-research.md` §Agent 2, Claim 2 + Claim 8 + Surprise S1](./domainspec-research.md#agent-2--empirical-state-audit-do-the-factual-repo-state-claims-hold).
- **Verdict:** `partial` on Claim 2; `false` on Claim 8 (the causal explanation).
- **Recommendation:** `edit` the P-DS-2 footnote to: "L2 is empty because the extractor has never been invoked against the existing `apps/web/` and `backend/src/` source trees — not because source code is absent. The promotion path is therefore 'run the extractor against existing code,' not 'wait for `src/` to appear.'"
- **Implication:** Reframes P-DS-2's promotion gate from a passive "wait" to an active "run the extractor" task — meaningfully changes the next action.

#### F8 — AX-DS-1 op + P-DS-4: "enforce" overstates the discovery-first soft gate

- **Claim:** AX-DS-1 operationalization uses "enforce direction" via the discovery → spec → plan → code pipeline. The actual gate in `domainspec-spec-feature` step 0 is a HALT-with-recommendation that accepts a `--skip-discovery` waiver; `domainspec-pipeline` propagates the waiver flag. No CI / pre-commit / hook enforces ordering.
- **Evidence:** [`domainspec-research.md` §Agent 2, Claim 7](./domainspec-research.md#agent-2--empirical-state-audit-do-the-factual-repo-state-claims-hold).
- **Verdict:** `partial`.
- **Recommendation:** `edit` AX-DS-1.op-3 to "...strongly recommends and requires explicit override via `--skip-discovery` waiver." P-DS-4's wording ("encodes this bet") already reads honestly and can stand.
- **Implication:** Aligns axiom phrasing with what the tooling actually does; preserves the discipline without falsely claiming mechanical enforcement.

#### F9 — Tier-2 verifier agents do not exist (P-DS-3 demotion well-founded)

- **Claim:** P-DS-3 demotion footnote asserts "no injectivity, faithfulness, or M2-representability checkers." Confirmed: only the delta-extractor *describes* what such consumers would do; no agent file implements them.
- **Evidence:** [`domainspec-research.md` §Agent 2, Claim 4 + Surprise S4](./domainspec-research.md#agent-2--empirical-state-audit-do-the-factual-repo-state-claims-hold).
- **Verdict:** `confirmed`.
- **Recommendation:** `keep-as-is`. No edit needed.
- **Implication:** P-DS-3 demotion stands on solid empirical ground; the axiom-to-premise downgrade is justified.

#### F10 — Alignment-auditor does not consume `delta.json` (P-DS-3 demotion well-founded)

- **Claim:** P-DS-3 demotion claims the alignment auditor reads SPEC + code directly and never consumes `delta.json`. Confirmed by full read of the agent file: zero references to categorical artifacts.
- **Evidence:** [`domainspec-research.md` §Agent 2, Claim 5](./domainspec-research.md#agent-2--empirical-state-audit-do-the-factual-repo-state-claims-hold).
- **Verdict:** `confirmed`.
- **Recommendation:** `keep-as-is`.
- **Implication:** Reinforces F9; the categorical pipeline is currently disconnected from any operational consumer.

#### F11 — No CI infrastructure exists at all

- **Claim:** No `.github/workflows/` directory. Zero GitHub Actions. Every claim across both docs of the form "automatic," "rebuilds on every X," "blocks Y" is therefore — at best — a manual-discipline claim, not a mechanically enforced one.
- **Evidence:** [`domainspec-research.md` §Agent 2, Claim 1 (CI check) + Surprise S3](./domainspec-research.md#agent-2--empirical-state-audit-do-the-factual-repo-state-claims-hold).
- **Verdict:** `confirmed` (absence claim) / cross-cutting context for F4 and F8.
- **Recommendation:** Treat as a global constraint when reviewing axiom/premise wording: replace any mechanical verb ("blocks," "enforces," "rebuilds") with an honest invocation-conditional verb ("on invocation, blocks/rebuilds…").
- **Implication:** This is the empirical foundation for F4 (decision-gate as on-demand) and F8 (discovery-first as soft gate).

### Math / formalism defects (Child D)

#### F12 — A.1 DPI chain: `intent` is never defined as a random variable

- **Claim:** The DPI invocation `I(intent;S) ≥ I(intent;C) ≥ I(intent;Cₙ)` is technically ungrounded — `intent`, `S`, `C`, `Cₙ` must form a Markov chain, but `intent` has no probability space defined. The conclusion (information lost across many-to-one maps) is correct without DPI.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.1 first claim](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `over-claim`.
- **Recommendation:** `edit` to drop DPI invocation and replace with: "Compilation Φ is many-to-one by design; lossy many-to-one maps discard information about their preimages — elementary surjectivity, no DPI required."

#### F13 — A.1 Curry–Howard: "structurally identical" is false

- **Claim:** Curry–Howard is a precise syntactic isomorphism between typed lambda calculi and intuitionistic proof systems and runs in both directions; the doc's "spec carries strictly more structural information than its compiled program form" is true for proof-erasing compilers but is not a general feature of Curry–Howard. "Structurally identical" mis-states the isomorphism.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.1 Curry–Howard claim](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `over-claim` / `decorative`.
- **Recommendation:** `edit` to "Loosely analogous to proof-erasing compilation; the analogy is motivational, not a formal isomorphism."

#### F14 — A.1 Hadamard citation: never invoked, pure name-drop

- **Claim:** Hadamard well-posedness is in the references but never used in body text.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.1 Hadamard claim + Citations Review row](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `decorative`.
- **Recommendation:** `remove` Hadamard from references.

#### F15 — A.2 "natural transformation" is malformed (no functors specified)

- **Claim:** Natural transformations require two functors `F, G : C → D` and naturality squares; the doc names two maps and calls them components of a natural transformation between unspecified spec-naming and code-naming functors. Without functors and morphisms on Σ_S, Σ_C, R, the term collapses to "commuting diagram" — which the doc already has.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.2 natural-transformation claim + Hardest Finding](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `over-claim`.
- **Recommendation:** `edit` A.2 to retain the commuting diagram (which is genuinely load-bearing and guides `domainspec-sync-registry`) and drop the natural-transformation / 2-cell language.

#### F16 — A.2 `H(Σ_C | Σ_S, R) = 0` requires a surjectivity assumption not stated locally

- **Claim:** Commutativity gives `N_C(Φ_concept(s)) = N_S(s)` only on the image of Φ_concept; the conditional entropy claim follows only if Φ_concept is surjective onto Σ_C — that is AX-DS-3 territory, not stated in A.2.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.2 conditional entropy claim](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `over-claim`.
- **Recommendation:** `edit` to "Under the additional assumption that Φ_concept is surjective (enforced by AX-DS-3), commutativity implies H(Σ_C | Σ_S, R) = 0."

#### F17 — A.3 `H(B|A) = 0` conflates trace direction

- **Claim:** `H(B|A) = 0` would mean B is a deterministic function of A. The trace map τ goes B → 𝒫(A); it states every behavior has artifacts, not that artifacts determine behaviors.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.3 conditional entropy claim](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `over-claim`.
- **Recommendation:** `edit` to "τ requires every behavior to have a non-empty preimage in A — a coverage condition (surjectivity of Φ onto B), not a determinism claim about A → B."

#### F18 — A.4 `H(A_t | D_t) = log₂(|A_t| − 1)` is an off-by-one

- **Claim:** Under uniform prior over A_t, entropy is `log₂(|A_t|)`; the `− 1` adjustment applies to `H(R_t)` for the rejected set `R_t = A_t \ {D_t}`, not to `H(A_t | D_t)`. This is precisely the distinction the formula is trying to make.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.4 entropy formula](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `over-claim` / contains an error.
- **Recommendation:** `edit` to "Storing only D_t loses `H(R_t) = log₂(|A_t| − 1)` bits — the entropy of the unchosen set."

#### F19 — A.4 EVPI / Lindley citation: stretched

- **Claim:** Standard single-period EVPI (Lindley 1956) is the value of learning the true state of nature before deciding; the doc uses EVPI as the value of re-examining a past decision (closer to value-of-clairvoyance in sequential decision problems).
- **Evidence:** [`domainspec-research.md` §Agent 3, A.4 EVPI claim](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `sound in direction, over-claim in precision`.
- **Recommendation:** `edit` to mark this as informal EVPI analogy ("in the spirit of Lindley 1956") rather than citing the theorem proper.

#### F20 — A.4 "AX-ONT-5 parallel" / `H_perceived → H_real` is a category error

- **Claim:** Calibration in Jaynes's MaxEnt sense means subjective probabilities aligning with true frequencies; recording a rejected alternative records a decision, not a probability estimate. `H_perceived → H_real` is undefined.
- **Evidence:** [`domainspec-research.md` §Agent 3, A.4 calibration claim + Citations Review (Jaynes row)](./domainspec-research.md#agent-3--mathformalism-review-of-axiom-appendices-a1a4-against-training).
- **Verdict:** `decorative` / category error.
- **Recommendation:** `remove` Jaynes citation and replace with a plain organizational-memory framing: "Recording rejected alternatives converts unknown unknowns into known unknowns."

### Cross-cutting defect

#### F21 — AX-DS-1 brownfield boundary condition is unimplemented (A + B converge)

- **Claim:** Two independent children flagged the same gap from different angles. Child A read the skill text and found zero language implementing P-DS-12's (a/b/c) obligations; Child B confirmed by full skill read that no candidate-set surfacing, no rejected-candidate decision-node persistence, and no transition marker exist.
- **Evidence:** [`domainspec-research.md` §Agent 1, Gap 2 / AX-DS-1.op-4 / P-DS-12.op-1](./domainspec-research.md#agent-1--operationalization-audit-do-cited-agentsskills-actually-do-what-the-docs-claim) and [`domainspec-research.md` §Agent 2, Claim 6](./domainspec-research.md#agent-2--empirical-state-audit-do-the-factual-repo-state-claims-hold).
- **Verdict:** `claim-overstates-agent` (A) + `confirmed` open obligations (B).
- **Recommendation:** Two paths: (1) `edit` axiom to remove the operationalization claim and explicitly mark the boundary condition as unimplemented under P-DS-12 — cheap; or (2) implement (a/b/c) in the skill — load-bearing fix that lets the axiom keep its claim. See Analysis §A4.
- **Implication:** This is the highest-leverage finding: AX-DS-1 is the most cited axiom, and its brownfield exception is its most distinctive structural claim. Leaving it un-cashed-out weakens the whole axiom layer.

### Highest-priority edits

A short list, in descending order of leverage:

1. **F21 — AX-DS-1 boundary condition** (cross-cutting; A+B converge). Either implement (a/b/c) in the brownfield skill, or weaken the axiom's operationalization wording.
2. **F2 — AX-DS-3.op-1 wrong-agent assignment**. One-line fix: reassign the orphan-citation check from layering-auditor to alignment-auditor.
3. **F4, F8, F11 cluster — replace mechanical verbs with invocation-conditional verbs**. "Blocks," "enforces," "rebuilds on every sync" → "on invocation, blocks/enforces/rebuilds."
4. **F18 — A.4 entropy off-by-one**. `H(A_t | D_t) = log₂(|A_t| − 1)` → `H(R_t) = log₂(|A_t| − 1)`.
5. **F15 — A.2 natural-transformation claim**. Drop the categorical name-drop; keep the commuting diagram (the genuine load-bearing math).

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning. Every claim cites passages in [`domainspec-research.md`](./domainspec-research.md) (R17).

### A1 — Which of AX-DS-1..4 still stand as written?

- **AX-DS-1 (compilation direction & brownfield exception):** *needs editing*, not demotion. The core direction-of-derivation claim is operationalized by `domainspec-alignment-auditor` and `domainspec-layering-auditor` and confirmed (research.md §Agent 1, AX-DS-1.op-1 / AX-DS-1.op-2). The brownfield boundary condition is the unimplemented part (research.md §Agent 1, AX-DS-1.op-4 + Gap 2; §Agent 2, Claim 6). Edit, do not demote.
- **AX-DS-2 (one-vocabulary invariant):** *stands*. Operationalization confirmed (research.md §Agent 1, AX-DS-2.op-1 / AX-DS-2.op-2). The math underneath (commuting diagram) is the strongest piece of formalism in the entire appendix layer (research.md §Agent 3, A.2 first claim and Hardest Finding). The natural-transformation language above the diagram should be cut, but that does not weaken the axiom — it cleans it up.
- **AX-DS-3 (every behavior cited):** *needs editing*. Two sub-claims have agent-attribution problems (research.md §Agent 1, AX-DS-3.op-1 + Gap 3; AX-DS-3.op-2 + Gap 4). The math (research.md §Agent 3, A.3) has one direction-of-trace error (F17) but the surjectivity-vs-bijectivity distinction is sound. After F2, F3, F17 fixes, AX-DS-3 is healthy.
- **AX-DS-4 (decision-record persistence):** *needs editing*. The "blocks document mutation" guardian phrasing is empirically false because the gate is on-demand (research.md §Agent 1, AX-DS-4.op-1 + Gap 1; §Agent 2, Claim 1 / Surprise S3). The math has one off-by-one (F18) and one Jaynes category-error (F20), but neither breaks the axiom — they break the appendix's claim to formal grounding. Edit, do not demote.

**Verdict on the axiom layer:** all four axioms survive; none should be demoted to premise. Three of four need wording edits.

### A2 — Which of P-DS-1..12 still stand?

- **P-DS-2, P-DS-3:** demotions are *well-founded*. Empirical state confirms (research.md §Agent 2, Claims 1, 3, 4, 5; §Agent 1, P-DS-2.op-1 / P-DS-2.op-2 / P-DS-3.op-1). Only the demotion footnote text needs editing per F7.
- **P-DS-4 (discovery-first ordering):** *stands* with a wording edit at the axiom side, not the premise side. P-DS-4's "encodes this bet" framing is honest about being a bet (research.md §Agent 2, Claim 7).
- **P-DS-7 (signals → reflect cycle):** *stands*, but requires verb correction from "drives updates" to "proposes updates" (research.md §Agent 1, P-DS-7.op-3 + Gap 6).
- **P-DS-8 (recommend-don't-auto-invoke for fan-out):** *stands but split needed*. The shared confirmation policy holds; the artifact-model divergence between `robot-talks` and `domainspec-subagents-strategy` should be made explicit (research.md §Agent 1, P-DS-8.op-2 + Gap 5).
- **P-DS-9 (sync-registry on every sync):** *stands*. The "on every sync" phrasing means "on each invocation" — accurate, given no auto-trigger wiring (research.md §Agent 1, P-DS-9.op-1).
- **P-DS-12 (brownfield obligations open):** *stands self-consistently*. The premise admits openness; the audit confirms (research.md §Agent 1, P-DS-12.op-1; §Agent 2, Claim 6). The contradiction is that AX-DS-1 above it claims operationalization that P-DS-12 below it admits is open — see A4.
- **P-DS-1, P-DS-5, P-DS-6, P-DS-10, P-DS-11:** not directly audited (de-scoped or no operationalization claim attached). Treat as standing absent specific evidence.

**Verdict on the premise layer:** no premise needs demotion to a discipline note. All audited premises are either confirmed or salvageable with verb-level edits.

### A3 — Is the math appendix doing load-bearing work?

This is the load-bearing question of the audit. The honest answer from research.md §Agent 3 (Headline + Hardest Finding) is: **mostly no**. Of the math in the appendices:

- **Genuinely load-bearing:** A.2's commuting diagram and three conditions (coverage, injectivity, `N_C ∘ Φ_concept = N_S`) — these correctly capture the one-vocabulary invariant and guide `domainspec-sync-registry` (research.md §Agent 3, A.2 first claim).
- **Sound but not doing work:** the surjectivity-vs-bijectivity distinction in A.3 (research.md §Agent 3, A.3 surjectivity claim); the EVPI direction in A.4 (research.md §Agent 3, A.4 first claim).
- **Not load-bearing / decorative:** DPI chain (F12), Curry–Howard (F13), Hadamard (F14), natural-transformation/2-cell (F15), `H(Σ_C | Σ_S, R) = 0` without surjectivity (F16), `H(B|A) = 0` direction error (F17), entropy off-by-one (F18), Jaynes/calibration (F20).

**Recommendation:** the appendices are doing rhetorical rather than load-bearing work. Two paths:

1. **Trim aggressively.** Keep A.2's commuting diagram. Remove DPI, Curry–Howard, Hadamard, natural transformation, 2-cell, Jaynes, and the EVPI entropy formula. The axioms survive in plain English. This is the cheapest path.
2. **Move appendices to a separate `domainspec-rationale.md` doc.** Frame them as "informed heuristics dressed in mathematical notation, not theorems" — Child D's exact phrasing (research.md §Agent 3, Headline). The axioms remain in the axioms doc; the speculative formalism lives in a doc that does not pretend to ground the axioms.

Either way, the current configuration — appendices appearing inside the axioms doc, with citations and Greek letters that do not cash out — risks dressing the axioms in formalism that future maintainers will not scrutinize closely enough to notice is empty (research.md §Agent 3, Hardest Finding closing sentence). This is the same anti-pattern flagged in the user's `feedback_epistemic_honesty` memory: don't dress heuristics in math vocabulary.

### A4 — Single highest-leverage edit

**Implement the three P-DS-12 obligations in `domainspec-brownfield-translation`.**

This is the single most leveraged fix because three independent forces converge on it:

- **AX-DS-1 cites it as operationalized when it is not** (research.md §Agent 1, AX-DS-1.op-4 + Gap 2). The most-cited axiom's most distinctive claim is currently aspirational.
- **P-DS-12 explicitly admits the obligations are open** (research.md §Agent 1, P-DS-12.op-1; §Agent 2, Claim 6). This is the single place in the doc-pair where premise and axiom contradict each other — the axiom claims operationalization, the premise admits openness.
- **Empirical state confirms zero implementation** (research.md §Agent 2, Claim 6 sub-bullets a/b/c). No multi-candidate presentation, no decision-node persistence, no transition marker.

Concretely, the skill needs:

- **(a) Surface β(C):** add a step that produces a candidate-spec set when ambiguous behavior is observed, rather than collapsing to a single as-is spec.
- **(b) Preserve rejected candidates per AX-DS-4:** emit `node_type: decision` artifacts recording the rejected interpretations.
- **(c) Mark transition to steady-state:** write a frontmatter flag (e.g., `brownfield-bootstrapped: true` on the feature folder) that prevents re-invocation.

Doing this lets AX-DS-1 keep its operationalization claim, lets P-DS-12 close its open obligations, and lets the brownfield exception of the compilation axiom actually exist as code rather than as text. Every other edit on the F1–F20 list is cosmetic by comparison: cheaper, but cosmetic.

The alternative — editing AX-DS-1 down to admit non-operationalization — is the cheap path. But it leaves the methodology with a documented brownfield bootstrap that is purely normative. If brownfield projects are a real entry point for DomainSpec (and the axioms place the boundary condition prominently enough that they appear to be), the cheap path is the wrong one.

### Cross-cutting observations

- **The CI vacuum (F11) is the empirical foundation of every "guardian" overclaim.** With no GitHub Actions, every "blocks," "enforces," "auto-rebuilds" verb in the doc-pair is conditional on manual invocation. This is not a flaw to fix per claim — it is a global frame the docs should adopt: replace mechanical verbs with invocation-conditional verbs throughout (research.md §Agent 2, Claim 1 CI-check + Surprise S3).
- **Agent-skill citations are a low-cost, high-payoff hygiene target.** Three of the four axioms cite specific agents/skills by name; two of those citations are mis-attributions (F2: wrong agent for the orphan-citation check; F3: agent doesn't traverse the artifact graph it's said to). These are one-line fixes that matter every time a reader tries to verify the doc against the agent .md files (research.md §Agent 1, Gaps 3 + 4).
- **The categorical pipeline is currently a closed loop with no consumer.** L1.json, L2.json, delta.json all exist and are well-formed (research.md §Agent 2, Claims 1, 3) but no operational agent reads them (research.md §Agent 2, Claims 4, 5). The P-DS-2/P-DS-3 demotions are the right call. The promotion-back-to-axiom path requires building the Tier-2 verifiers that the delta-extractor explicitly anticipates as "downstream consumers" (research.md §Agent 2, Surprise S4).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-research.md](./domainspec-research.md) | `derives-from` | Verbatim per-child research file produced by the dispatch; every Findings and Analysis claim above cites it per R17. |
| [../../../axiom/domainspec-axioms.md](../../../axiom/domainspec-axioms.md) | `audits` | The axiom doc whose claims AX-DS-1..4 (and appendices A.1..A.4) are validated above. |
| [../../../premise/domainspec-premises.md](../../../premise/domainspec-premises.md) | `audits` | The premise doc whose claims P-DS-1..12 are validated above. |
| [../../../constitution/domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md) | `governed-by` | R15 (vault-staging override acknowledged by user), R16, R17, R18, R21, R22, R23 implemented above. |
