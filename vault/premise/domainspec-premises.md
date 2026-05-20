---
tags: [domainspec, methodology, vault]
node_type: premise
layer: domain, application
nature: explanatory, technical
status: exploratory
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-05
is_session: false
---

# DomainSpec Premises

> Working hypotheses about the DomainSpec methodology — the multi-agent decomposition, the categorical extraction pipeline, the registry-sync convergence claim, and the telemetry retune loop. These are informed bets, expected to be revised as evidence accumulates. Each statement carries explicit `convicção` and `veracidade`.

---

## Objective

This document captures the **methodological bets** behind DomainSpec — the things we believe are *probably* true and are betting on, but which a future audit could falsify. Unlike axioms (`domainspec-axioms.md`), revising any single premise here does not collapse the methodology; it changes the implementation strategy.

Two of these premises (P-DS-2 and P-DS-3) were initially proposed as axioms but demoted on 2026-05-05 after an audit found the L2 and Δ extractors emit only degenerate outputs and are not invoked in any operational pipeline. They will be re-considered for promotion when CI enforcement and Tier-2 verifiers exist.

---

## Index

1. [Compilation Pipeline Bets](#compilation-pipeline-bets)
2. [Agent & Workflow Bets](#agent--workflow-bets)
3. [Vocabulary & Knowledge-Graph Bets](#vocabulary--knowledge-graph-bets)
4. [Connections](#connections)

---

## Compilation Pipeline Bets

### P-DS-1 — Multi-agent decomposition holds the L1→L2 invariant better than a monolithic agent
`convicção: high` `veracidade: medium`

The DomainSpec methodology decomposes the compilation pipeline across many specialized agents (interviewer, spec-writer, planner, implementer, test-designer, verifier, alignment-auditor, layering-auditor, registry-sync, etc.). The bet: separating concerns into agents with narrow, contractual artifact interfaces preserves the AX-DS-1 compilation invariant more reliably than a single capable model with a long prompt.

If a single sufficiently-capable model with the right prompt produced equivalent fidelity, the decomposition is overhead. The bet must be re-examined when frontier models materially improve at long-horizon coherence.

*Under validation — the agent zoo exists and produces artifacts, but no head-to-head comparison against a monolithic baseline has been run.*

### P-DS-2 — Categorical extraction (L1.json / L2.json) is tractable from natural-language specs and code at our current scale
`convicção: medium` `veracidade: low`

The `domainspec-l1-extractor` and `domainspec-l2-extractor` agents claim to extract real categories — typed objects and morphisms with composition — from spec documents and code respectively. The bet: this extraction is reliable enough at our scale to ground the AX-DS-3 (no orphan behavior) claim mechanically rather than by audit.

*Originally proposed as AX-DS-2 (categorical semantics). Demoted on 2026-05-05 audit:*
- *L1 extractor: one real output exists (`docs/features/payment-processing/_categorical/L1.json`, 21 objects, 26 morphisms, valid categorical structure), produced manually, no CI invocation, no drift detection.*
- *L2 extractor: schema fully defined, single output is empty (no `src/`, `tests/`, `apps/` exist in repo), not invoked by any pipeline.*
- *To promote: needs CI invocation on spec/code change, drift detection, and ≥3 features with non-degenerate L1/L2 pairs.*

### P-DS-3 — The compilation invariant L1→L2 is verifiable by structural correspondence (Δ-witnessed commuting diagrams)
`convicção: high` `veracidade: low`

The `domainspec-delta-extractor` reconstructs the compilation functor `Δ : L₁ → L₂` and emits diagnostics (`objects_unmapped`, `morphisms_unwitnessed`, `rel_type_coverage`) sufficient to mechanically verify that every domain morphism has a code witness — the structural form of AX-DS-3.

*Originally proposed as AX-DS-3 (verification by structural correspondence). Demoted on 2026-05-05 audit:*
- *Δ extractor: schema complete, single output is degenerate (100% morphisms unwitnessed, all confidence levels = "none") because L2 is empty.*
- *No Tier-2 verifier agents exist (no injectivity, faithfulness, or M2-representability checkers).*
- *Alignment-auditor, the operational consumer, reads SPEC + code directly — does not consume `delta.json`.*
- *To promote: needs working L2 input (P-DS-2 must hold), at least one Tier-2 verifier, and pipeline integration that gates on Δ diagnostics.*

### P-DS-4 — Discovery-first ordering (Discovery → Spec → Plan → Code) reduces re-spec churn
`convicção: high` `veracidade: medium`

Writing a spec without a prior discovery causes the spec to invent rather than codify, generating expensive rewrites once the design space is properly explored. The CLAUDE.md route 3 ordering encodes this bet. Measurable counter-evidence would be specs that ship with discoveries but still require structural rewrites within ≤2 weeks.

*Anecdotally validated — the existing payment-processing and curator-pipeline-integration discoveries did precede their respective spec work, and no significant rewrites have occurred. Sample is small.*

### P-DS-5 — Δ functor diagnostics are actionable without human triage
`convicção: medium` `veracidade: low`

When Δ identifies an unwitnessed morphism or an orphan code object, the diagnostic carries enough structure to drive an automated change request (issue, agent task, or CI gate failure) without human re-interpretation each time.

*Currently aspirational. The single Δ output is too degenerate to test this. Counter-evidence would be a non-degenerate Δ run whose diagnostics still required a human to translate them into actionable work.*

### P-DS-12 — `domainspec-brownfield-translation` correctly implements the AX-DS-1 boundary condition
`convicção: high` `veracidade: low`

The brownfield bootstrap exception in AX-DS-1 (the reconstruction `β : C → 𝒫(S)` followed by user ratification) is operationalized by `domainspec-brownfield-translation`. The bet: the skill (a) surfaces the candidate set rather than silently collapsing it, (b) preserves the rejected candidates per AX-DS-4, and (c) marks the project as transitioned to steady-state so `β` is not re-invoked.

*Likely partial. No audit yet confirms (a)/(b)/(c). Open obligations: audit candidate-preservation, define the brownfield→steady-state transition marker, document what user action counts as ratification.*

---

## Agent & Workflow Bets

### P-DS-6 — LLM-agnostic, deterministic agents are cheaper to evolve than capability-tuned ones
`convicção: high` `veracidade: high`

Agents and skills must not hard-code provider model names or rely on capability-specific behavior in their rule layers. The bet: investing in determinism and provider-neutrality at agent definition time costs less than re-tuning every agent on each model upgrade.

*Validated multiple times — `domainspec-strategy` v0.4.0 stripped the speculative mechanical/synthesis/judgment tier vocabulary precisely because tier assignment depends on model capability and cannot be locked. Memory entry: `feedback_llm_agnostic_design.md`.*

### P-DS-7 — Behavioral telemetry from agent runs carries enough signal to retune skills and agents
`convicção: medium` `veracidade: low`

The `domainspec-emit-signals`, `domainspec-signal-observer`, and `domainspec-reflect` cycle bets that signals emitted at the end of agent runs accumulate into actionable patterns — enough to drive skill rewrites and agent prompt updates from data rather than vibes.

*Largely untested. The signals exist; the reflect loop has run; no measurable rule change has yet been demonstrated to derive from accumulated signals rather than from individual observations. Counter-evidence: if the reflect loop's recommendations are consistently re-derivable from a single recent run, the accumulation is not load-bearing.*

### P-DS-8 — Recommend-don't-auto-invoke is the right invocation policy for fan-out skills
`convicção: high` `veracidade: medium`

Skills that dispatch parallel subagents (`domainspec-subagents-strategy`, `robot-talks`) should be recommended by the orchestrator and confirmed by the user before fan-out, never auto-invoked. The bet: fan-out is expensive and context-polluting enough that user gate-keeping pays for itself in saved cycles.

*Encoded in `project_curator_invocation_triggers.md`. Validated by user feedback. Counter-evidence would be repeated patterns where the user always confirms — at which point auto-invocation becomes correct.*

---

## Vocabulary & Knowledge-Graph Bets

### P-DS-9 — Mechanical registry/glossary sync converges faster than curated dictionary work
`convicção: high` `veracidade: medium`

The `domainspec-sync-registry` skill rebuilds `docs/registry.md` and `docs/glossary.md` from feature SPEC concept tables on every sync. The bet: deriving the canonical vocabulary from the specs that use it converges faster on a stable, drift-free vocabulary than maintaining the registry by hand.

*Operational. Counter-evidence would be drift between SPEC concept tables and the synced registry, or registry edits that survive a re-sync (indicating the SPECs are missing the source of truth).*

### P-DS-10 — Project decisions, hypotheses, and propositions are best stored as graph nodes, not as inline spec sections
`convicção: high` `veracidade: medium`

Decisions, hypotheses, and propositions accumulated during interviews and discoveries are first-class graph nodes (with `node_type: discovery` or dedicated types), edged into specs and constitutions, rather than buried as inline sections of a SPEC.md. The bet: graph-resident decisions are reusable across features and survive spec rewrites; inline decisions die when their host spec is restructured.

*Encoded in the discovery node taxonomy. Validated by the post-discovery fork (vault evolution vs. spec handoff) — both forks require the decision to live as a node, not as spec prose.*

### P-DS-11 — Backlog and skill/agent files do not belong in the vault graph
`convicção: high` `veracidade: high`

Files under `.claude/skills/**` and `.claude/agents/**` are operational artifacts, not graph nodes — they carry no `node_type`, no `convicção/veracidade`, and no `## Connections`. Backlog files (`node_type: backlog`) carry frontmatter but no `## Connections` and no inbound edges. The bet: keeping operational and backlog noise out of the graph preserves the graph's epistemic signal-to-noise ratio.

*Validated by the OQ-1 closure (skills/agents) and the backlog-edges waiver. Memory entries: `feedback_no_edges_on_non_vault_files.md`, `feedback_no_edges_on_backlog_files.md`. Counter-evidence would be load-bearing arguments that depend on traversing edges into a skill or backlog file.*

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[domainspec-axioms]] | `derives-from` | These premises sit on top of the four DomainSpec axioms; the demoted P-DS-2 and P-DS-3 (categorical extraction and Δ-witnessed verification) are the operational machinery that, if it matures, would discharge the AX-DS-3 obligation mechanically. |
| [[system-premises]] | `cites` | P-DS-6 (LLM-agnostic agents) and P-DS-10 (decisions as graph nodes) are methodology-layer extensions of P-SYS-7 (refactoring as primary mechanism) and P-SYS-5 (boundaries as hypotheses). |
| [[ontology-premises]] | `cites` | P-DS-9 (mechanical registry sync) operationalizes the AX-ONT-2 / AX-ONT-3 commitments at the methodology layer. |
| [[domainspec-subagents-strategy-premises]] | `derives` | The subagents-strategy premises (P-SS-*) are domain-specific specializations of P-DS-1 (multi-agent decomposition) and P-DS-8 (recommend-don't-auto-invoke). |
| `vault/axiom/category-theory-compilation-axiom.md` | `cited-by` | The category-theory-compilation axiom cites P-DS-2 (L1/L2 extraction) and P-DS-3 (Δ-witnessed verification) as its operational obligations. |
