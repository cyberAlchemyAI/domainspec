---
tags: [vault, ontology, epistemic-chain, subagents-strategy, recovery, robot-talks]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-02
timestamp: 2026-05-02T18:20:00-03:00
expires: 2026-07-01
conversation_id: vault-foundations-oq-resolutions-and-recovery-2026-05-02-1820
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: [P-SS-11]
expected_importance: 8
importance_rationale: "Resolved several open questions across the three vault-foundations discoveries (epistemic-chain OQ-3/4/5; subagents-strategy OQ-1/2/4 plus partial OQ-3); consolidated five research files into one; renamed the subagents-strategy track and removed LLM-provider-model references in favor of capability tiers; surfaced and partially recovered from a Phase 2 false-success incident where a dispatched subagent overwrote v0.3.0 of subagents-strategy.md with stale content from agents-strategy.md; introduced a P-SS-11 candidate premise (post-dispatch independent verification) with a concrete protocol; added Turn 3.5 to robots-discussing.md surfacing T7 (the discussion governs itself under premises it has flagged broken)."
---

# Vault Foundations — OQ Resolutions, Subagents-Strategy Rename, Phase-2 Recovery

## Summary

Audited `vault/discovery/vault-foundations/README.md` and the three discoveries it indexes; surfaced eight problems including a file-map drift, an LLM-agnostic violation in `agents-strategy.md` (Haiku/Sonnet/Opus tier names), a false-rigor framing in the strategy grading rubric, and an unresolved schema gap (constitutions that derive from norms rather than premises). The user resolved most surfaced open questions: epistemic-chain OQ-3 (consolidate the research files), OQ-4 (admit norm-only constitutions via `nature: norm`), OQ-5 (axiom demotion is via discovery, with the orthogonality demotion as canonical precedent); subagents-strategy OQ-1 (admit `subagents-strategy` as a `node_type`), OQ-2 (rename concept and files back to `subagents-strategy*` — reverts the earlier intra-session `agents-strategy` rename), OQ-4 (drop the universal token budget table — per-strategy budgets only). Epistemic-chain OQ-1 (premise → axiom promotion threshold) was deferred pending corpus-measurement instrumentation, with a qualitative bridge rule recorded in the meantime.

Three subagents were dispatched in parallel to apply the resolutions: (A) research consolidation merged T1–T4 + SYNTHESIS into `scope-and-domain-axes-evidence.md` with `node_type: research`; (B) epistemic-chain edits added D-7 (norm-only constitutions) and D-8 (axiom demotion path), softened D-4, deferred OQ-1; (C) the subagents-strategy track was renamed and the LLM-agnostic + grading-as-discipline fixes were applied. **Subagent C overwrote a pre-existing v0.3.0 of `subagents-strategy.md`** that was implementing the 2026-05-02-1711 redesign decisions (P-AD-* → P-SS-* rename, drop `proposed` lifecycle state, three-file `/research/` output, operational mode definitions, capability-tier definitions). The overwrite was discovered before further dispatches and is recoverable via the session log; the user approved Option 1 (single merger subagent re-applies the v0.3.0 redesign on top of this conversation's decisions). Merger dispatch is pending.

A focused research-only investigation answered the OQ-B question (do `subagents-research.md` and `subagents-findings.md` need their own `node_type` values?): **no** — they fail the challenge-response and lifecycle tests; keep them as `node_type: research` with `derives-from` edges to the parent strategy. Pending user ratification.

In `vault/discovery/vault-foundations/robots-talks/robots-discussing.md`, added Turn 3.5 with: a status delta on the recovery; T7 — a tension Turns 1 and 2 both missed (this discussion is bound to `robot-talks-premises.md`, but `robot-talks-premises.md:202` has a known schema error on the pending-fix list, so the discussion is operating under premises it has flagged broken); an operational form for the P-SS-11 candidate (four-step independent verification protocol); and a self-witness naming the Phase 2 false-success incident as caused by a subagent dispatch from this conversation.

## Decisions made

- **D1.** Epistemic-chain OQ-3 — research files consolidated. T1, T2, T3, T4, and SYNTHESIS merged into a single `research/scope-and-domain-axes-evidence.md` (Option A: SYNTHESIS body with named appendix sections per track). All citations preserved; `node_type: research` per epistemic-chain D-6. Original five files deleted.
- **D2.** Epistemic-chain OQ-4 resolved as new D-7: constitutions may exist without premise derivation when they encode team norms; declare `nature: norm`. D-4 softened from "every constitution" to "every belief-derived constitution."
- **D3.** Epistemic-chain OQ-5 resolved as new D-8: axiom demotion is via a discovery document; the orthogonality demotion (`scope-and-domain-axes.md` D-1) is the canonical precedent. Mirrors `scope-and-domain-axes.md` D-14 in the demotion direction.
- **D4.** Epistemic-chain OQ-1 (premise → axiom threshold) **deferred** with a qualitative bridge rule: until corpus instrumentation lands, the proposing discovery must cite (a) at least one audit cycle whose findings confirmed predictions, (b) no contradicting audits in the prior review window, and (c) explicit acknowledgment that the threshold is judgment, not measurement.
- **D5.** Subagents-strategy OQ-1 resolved as new D-10: `subagents-strategy` is admitted as a first-class `node_type` carrying `mode`, `grade`, capability assignments, recursion budget, and lifecycle state. `scope` is usually `artifact` but can be multi-value; `domain` reflects whatever the strategy dispatches against. Pending: amendment to `ontology-conventions.md` via its own discovery (per `scope-and-domain-axes.md` D-14).
- **D6.** Subagents-strategy OQ-2 resolved: concept renamed back from `agents-strategy` to `subagents-strategy`. D-1 of the discovery was rewritten as a reversal. File renames: `vault/discovery/vault-foundations/agents-strategy.md` → `subagents-strategy.md`; `vault/premise/agent-dispatch-premises.md` → `subagents-strategy-premises.md`. (Pending: `P-AD-*` → `P-SS-*` ID sweep — recovery item.)
- **D7.** Subagents-strategy OQ-4 resolved: universal token budget table removed (no `haiku 10–30k / sonnet 30–80k / opus 50–150k`). Per-strategy budgets only, set by the strategist subagent at dispatch time and justified by expected output shape; unbounded exploratory work declares no budget.
- **D8.** Subagents-strategy OQ-3 resolved (partial): the grading rubric is one measurement (cost discipline, mechanically computable from execution log) plus three disciplines (coverage, independence, fidelity — judgment with evaluator + user confirmation). The 0–1 scale is a coordination device, not a metric. Full automation deferred until measurement instrumentation lands.
- **D9.** LLM-agnostic violation fixed across `subagents-strategy.md` and `subagents-strategy-premises.md`: provider-model tier names (`Haiku`/`Sonnet`/`Opus`) replaced with capability-tier names (`mechanical`/`synthesis`/`judgment`). The mapping from tier to model is a configuration concern, not a rule of the discipline. ~20 references rewritten.
- **D10.** OQ-B investigation completed (recommendation pending user ratification): `subagents-research.md` and `subagents-findings.md` remain `node_type: research` with `derives-from` edges to the parent `subagents-strategy.md`. Reasoning: both fail the challenge-response test (their challenge response collapses into the existing `research` type's response per `epistemic-chain.md` lines 117–119) and have no independent lifecycle. Slippery-slope and risk-asymmetry tests confirm.
- **D11.** Recovery decision: Option 1 — single merger subagent re-applies the 2026-05-02-1711 redesign decisions (D1–D6 of that session) on top of this conversation's decisions. The session log is the recovery vector; a v0.4.0 will be the union of both work-streams. Dispatch pending.

## Contradictions

- **caused** `vault/discovery/vault-foundations/subagents-strategy.md` (Phase 2 false-success) — Subagent C overwrote a pre-existing v0.3.0 implementing the 2026-05-02-1711 redesign with stale content from `agents-strategy.md` plus this conversation's edits, then reported the overwrite as a successful merge. Root cause: dispatch prompt did not include a "stop if target exists with conflicting content" rule, and the post-dispatch verification step relied on the subagent's self-report. Recovery via Option 1 merger pending.
- **questions** `vault/ontology-conventions.md` — the `node_type` enum still does not admit `research` (per `epistemic-chain.md` D-2, decision dating to a prior session) or `subagents-strategy` (per `subagents-strategy.md` D-10, this session). Three places now violate `scope-and-domain-axes.md` D-14 (discoveries are the only authorized path for schema evolution): the `research` admission, the `subagents-strategy` admission, and the `nature: norm` admission (epistemic-chain D-7, this session). Pending: an aggregate A-scope discovery proposing the enum amendments, OR a precedence rule allowing B-scope discoveries to amend A-schemas with back-references.
- **questions** `vault/discovery/vault-foundations/robots-talks/robots-discussing.md` — frontmatter declares `node_type: discussion`, which is not in the current enum. Self-witnessing inconsistency; deliberate per main-thread Turn 3 ("I want it to stand as evidence under the user's nose"). Pending user call.
- **questions** `vault/premise/robot-talks-premises.md` — line 202 still mislabels its constitution as `operationalized-by` (should split into `codified-as` for the constitution + `operationalized-by` for the skill); the broken `possible_constitutions/...` path also still appears at line 26. Both flagged in the 2026-05-02-1711 session, neither yet swept. T7 in `robots-discussing.md` Turn 3.5 makes this the governance-recursion issue: this discussion's premises are themselves on the pending-fix list.
- **questions** `vault/discovery/vault-foundations/README.md` — file map references the deleted T1–T4 + SYNTHESIS files; status claim that "the agents-strategy discovery produced a new premise set that will live [in `vault/premise/`] once promoted" is stale (the file already exists on disk). Premise filename reference is also stale (still says `agent-dispatch-premises.md`, now renamed). Polish pass pending — main-thread direct edit, no subagent.

## Open questions surfaced

- **OQ-NEW-1.** Should `discussion` be admitted as a `node_type`? Frontmatter of `robots-discussing.md` already uses it. Closes T1 in that file. (User call.)
- **OQ-NEW-2.** Precedence rule when a session log and a discovery doc disagree about a decision's status. Currently three meanings of "Settled" coexist in the corpus (decided-in-conversation, edited-into-discovery, propagated-to-constitution-and-instances). Closes T2 and T3 in `robots-discussing.md`. Recommendation: discovery doc wins; session log is provenance. (User call.)
- **OQ-NEW-3.** Schema-evolution channel for `node_type` enum additions: (a) any discovery may propose with a back-reference + entry in a single aggregator file; (b) every enum addition requires a dedicated A-scope discovery. Three pending enum additions (`research`, `subagents-strategy`, `nature: norm`) hang on this. Closes T4. (User call.)
- **OQ-NEW-4.** Can `robot-talks`-mode discussions produce shippable decisions while their governing premises (`robot-talks-premises.md`) are flagged broken? Recommendation: yes-with-provisional-note. Closes T7. (User call.)
- **OQ-NEW-5.** Does the user ever intend to instrument capability-tier assignment, or is `mechanical / synthesis / judgment` permanently a discipline? Affects whether D-6 of `subagents-strategy.md` carries a "pending instrumentation" caveat or stands as a permanent discipline. (User call.)

## Promoted candidate — P-SS-11

**Premise candidate**: post-dispatch verification of mutating edits must be performed by an independent step (re-read + deterministic grep + line-count delta + cross-file check), never by the executing subagent's self-report.

**Operational protocol** (from `robots-discussing.md` Turn 3.5):

1. Pre-dispatch: record expected post-edit state — line counts, specific strings expected to appear or disappear, frontmatter values.
2. Subagent executes edits, self-reports per its own pass.
3. Post-dispatch independent step: re-read the file (not the report). Run a deterministic grep for survivors of patterns that should have been replaced (`P-AD-`, `proposed` in lifecycle context, provider-model names). Compare line-count delta. If any check fails, the dispatch is treated as incomplete regardless of the subagent's report.
4. Cross-file verification: edits that ripple across N files must be verified in all N.

The Phase 2 false-success would have been caught at step 3 within seconds (actual line count 277 vs reported 364). It was instead caught by the next dispatch tripping over absent sections — a much more expensive failure mode.

`veracidade: low` (proposed; one validating incident, no longitudinal evidence). `convicção: high` (we are operating under it now). Status: discipline pending hook/skill enforcement. Targeted for the merger subagent dispatch in Phase 2 of the recovery plan.

## Pending recovery edits (Option 1 merger)

To be applied by a single merger subagent with `2026-05-02-1711-subagents-strategy-redesign.md` as primary input and the current `subagents-strategy.md` as overlay; verification per P-SS-11 protocol:

1. `P-AD-*` → `P-SS-*` ID sweep across `subagents-strategy.md` D-5 and `subagents-strategy-premises.md` (file rename already done; ID sweep is the half-shipped half).
2. Drop `proposed` lifecycle state from D-10 of `subagents-strategy.md`; first persisted state is `confirmed`. Proposal lives in conversation.
3. Add operational definitions to D-6 for capability tiers (`mechanical / synthesis / judgment`) — concrete enough that the strategist subagent can route a task to a tier without the user re-deriving the rule each time.
4. Add operational definitions to D-4 for the five dispatch modes by dispatch shape (`single`, `task-fan-out`, `robot-talks`, `sequential`, `mixed`).
5. Add a new D-11 (or merge into D-10) for the three-file `/research/` output set (`subagents-strategy.md` process record, `subagents-research.md` raw evidence, `subagents-findings.md` scannable summary), with research+findings classified as `node_type: research` per D10 of this session.
6. Apply factual corrections from the 2026-05-02-1711 Contradictions section: `.claude/agents/` count 36 (not 37); "only one strategy file exists" was false at the time and is now resolved; fix §3.3 cross-reference (§3.4 → §3.5); fix `robot-talks-premises.md:202` and `:26`.
7. Bump version to 0.4.0 with version-history entry noting the recovery merge.

After the merger, main-thread runs the README polish (file map, blockers view, stale-rename references) directly — no subagent.

## Files touched

- vault/discovery/vault-foundations/scope-and-domain-axes.md (cross-references to consolidated research file; ~17 inline citation updates)
- vault/discovery/vault-foundations/epistemic-chain.md (D-7 + D-8 added; D-4 softened; OQ-1 deferred with bridge rule; OQ-3/4/5 status lines; version 0.1.0 → 0.2.0)
- vault/discovery/vault-foundations/subagents-strategy.md (renamed from agents-strategy.md; D-1 reversed; D-6 + D-8 + D-9 revised; D-10 added; A-1 + A-4 + A-6 revised; OQ-1/2/3/4 statuses; LLM-agnostic violations replaced; grading reframed; version 0.1.0 → 0.2.0; **caveat: did not absorb the 2026-05-02-1711 redesign — Phase 2 recovery pending**)
- vault/discovery/vault-foundations/research/scope-and-domain-axes-evidence.md (NEW — consolidates T1+T2+T3+T4+SYNTHESIS; node_type: research; ~1245 lines)
- vault/premise/subagents-strategy-premises.md (renamed from agent-dispatch-premises.md; LLM-agnostic tier names; P-AD-10 discipline note; version 0.1.0 → 0.2.0; **P-AD-* → P-SS-* ID sweep pending**)
- vault/discovery/vault-foundations/robots-talks/robots-discussing.md (Turn 3.5 added: status delta, T7, P-SS-11 protocol, self-witness)

## Files deleted

- vault/discovery/vault-foundations/research/T1-empirical-history.md
- vault/discovery/vault-foundations/research/T2-upper-ontologies.md
- vault/discovery/vault-foundations/research/T3-tree-dag-lattice.md
- vault/discovery/vault-foundations/research/T4-growth-governance.md
- vault/discovery/vault-foundations/research/SYNTHESIS.md

## Files NOT touched but flagged

- vault/discovery/vault-foundations/README.md — file-map drift, stale rename references, no blockers view. Polish pass pending main-thread direct edit (after Phase 2 merger lands).
- vault/ontology-conventions.md — three pending enum admissions (`research`, `subagents-strategy`, `nature: norm`). Blocked on OQ-NEW-3 (schema-evolution channel).
- vault/axiom/ontology-axioms.md — orthogonality demotion edit's status not verified this session (referenced as a contradiction in 2026-05-02-1723).

## Files referenced

- vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md (recovery vector for Option 1 merger)
- vault/sessions/2026-05-02-1723-vault-foundations-redesign.md (precedent for vault-foundations decisions)
- vault/sessions/2026-05-02-1646-agents-strategy-discovery.md (origin of the agents-strategy / subagents-strategy track)
- vault/discovery/vault-foundations/README.md (audit target)
- vault/ontology-conventions.md (canonical schema; pending amendments)
- vault/premise/robot-talks-premises.md (governing premises for the robots-discussing.md file; flagged broken)
- vault/constitution/robot-talks-constitution.md (no edits required this session)
- ~/.claude/projects/-Users-victorboscaro-domainspec/memory/feedback_epistemic_honesty.md (applied to grading-rubric reframing)
- ~/.claude/projects/-Users-victorboscaro-domainspec/memory/feedback_llm_agnostic_design.md (applied to capability-tier rename)
