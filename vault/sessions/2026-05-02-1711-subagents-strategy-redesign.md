---
tags: [agents, subagents, vault, ontology, architecture]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: explanatory
status: active
created: 2026-05-02
timestamp: 2026-05-02T17:11:00-03:00
expires: 2026-07-01
conversation_id: subagents-strategy-redesign-2026-05-02
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Locked in the LLM-agnostic redesign of agents-strategy: rename to subagents-strategy, capability-tier vocabulary (mechanical/synthesis/judgment), proposal-as-question flow, five-mode taxonomy with definitions, and the three-file /research/ output that preserves traceability. These decisions govern every future multi-agent dispatch in the project."
---

# Subagents-Strategy — Redesign Session

## Summary

Audited [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) for factual fidelity and design coherence; found one structural problem (a sibling duplicate at [vault/discovery/agents-strategy-rules/agents-strategy.md](../discovery/agents-strategy-rules/agents-strategy.md) the discovery doesn't acknowledge), several wrong empirical claims (agent count, "only one strategy file exists", overstated grep evidence), and minor cross-reference and edge-label errors.

The user then redirected the design on three axes: (1) model-tier vocabulary must be **LLM-agnostic** — drop hard-coded `haiku/sonnet/opus` in favor of capability tiers; (2) the strategy proposal is a **question to the user**, not a pre-written file — only after user confirmation does the small-tier agent persist `subagents-strategy.md`; (3) the dispatch produces a **three-file output set** in a `/research/` folder, with the mode named explicitly when the strategy is proposed.

Recommended capability-tier vocabulary: `mechanical` (lookups, transformations, scoped research), `synthesis` (multi-source synthesis, plan drafting), `judgment` (cross-domain reasoning, contested decisions). The strategy file records the tier; a separate config maps tier → current model, so provider swaps don't churn 40 strategy files.

The five modes were given operational definitions distinguishing them by *dispatch shape*: `single` (one agent), `task-fan-out` (N agents, partitioned concerns, parallel), `robot-talks` (N agents, same question, declared perspectives, tensions desired), `sequential` (linear chain, B depends on A), `mixed` (multi-phase combinations, explicit DAG required). Each mode binds to the base subagents-strategy constitution; `robot-talks` additionally binds to `robot-talks-premises` (P-RT-3, P-RT-7, P-RT-8).

The three-file `/research/` output:
- `subagents-strategy.md` — process record (agents, tiers, budgets, sequencing, actual spend)
- `subagents-research.md` — raw per-agent findings + surfaced tensions (preserves evidence; required for P-RT-8 traceability and grading fidelity)
- `subagents-findings.md` — scannable summary for the user, with pointers into research.md

Three files, not two: a findings doc that compresses without preserving sources makes traceability performative — you can't grade fidelity, audit the analyzer-agent's choices, or revisit downstream when something looks off.

Naming cascades to single root word `subagents-strategy` everywhere: rename `vault/premise/agent-dispatch-premises.md` → `subagents-strategy-premises.md`, future constitution at `vault/constitution/subagents-strategy-constitution.md`, future skill at `.claude/skills/subagents-strategy/`. `P-AD-*` tags rename to `P-SS-*`.

The `proposed` lifecycle state is dropped — proposal lives in the conversation, not on disk; `confirmed` becomes the first persisted state.

## Contradictions

- questions [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) — "Only one `agents-strategy.md` file exists" is false; sibling duplicate at `vault/discovery/agents-strategy-rules/agents-strategy.md` (265 lines, same date, same tags) was missed by the doc that warns about drift.
- questions [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) §1 — "37 agents in `.claude/agents/`" is wrong; actual count 36.
- questions [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) §1 — "grep returns nothing relevant" presents a heuristic skim as a verified empirical finding; the grep does match `.claude/skills/close-session/SKILL.md`. Per standing user feedback on epistemic honesty.
- questions [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) §3.3 — internal cross-reference broken; "(§3.4)" should read "(§3.5)".
- questions [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) §3.8 — cleanup of [vault/premise/robot-talks-premises.md](../premise/robot-talks-premises.md) is partial; the broken `possible_constitutions/...` path appears twice (body line ~26 and connections table line ~210), only the first is flagged.
- questions [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) connections table — `agent-dispatch-premises.md` labeled `proposes`; this discovery doesn't propose those premises (they pre-existed), correct edge is `derives-from` or `grounded-by`.
- supersedes [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) §2 model-selection section — hard-coded `haiku/sonnet/opus` tiers and budgets must be replaced with LLM-agnostic capability tiers (`mechanical / synthesis / judgment`) plus a tier→model config map.
- supersedes [vault/discovery/agents-strategy.md](../discovery/agents-strategy.md) §3.4 lifecycle — `proposed` state is dropped; proposal is a question to the user, not a persisted state.

## Decisions made

- **D1.** Rename umbrella concept from `agents-strategy` to `subagents-strategy`. Single root word everywhere — premise file, constitution, skill, output files. `P-AD-*` premise tags rename to `P-SS-*`.
- **D2.** Capability tiers replace model names. Recommended vocabulary: `mechanical / synthesis / judgment`. Definitions to be written into the rewritten discovery.
- **D3.** Proposal flow: small-tier agent drafts proposal → presented as question to user inline → user confirms → same agent writes `subagents-strategy.md` to `/research/`. The `proposed` lifecycle state is removed; `confirmed` is the first persisted state.
- **D4.** Five modes with operational definitions: `single`, `task-fan-out`, `robot-talks`, `sequential`, `mixed`. Distinguished by dispatch shape. Each strategy file declares one mode; `robot-talks` binds additionally to `robot-talks-premises`.
- **D5.** Three-file output in `/research/` per investigation: `subagents-strategy.md`, `subagents-research.md`, `subagents-findings.md`. Rationale: traceability requires raw evidence preserved; compression-only output makes grading and audit performative.
- **D6.** The duplicate discovery at `vault/discovery/agents-strategy-rules/agents-strategy.md` is to be resolved (one canonical file at `vault/discovery/subagents-strategy.md`, the other superseded or deleted) before further edits.

## Open questions

- **OQ-A. RESOLVED.** Capability-tier vocabulary = `mechanical / synthesis / judgment`. Confirmed and applied in `subagents-strategy.md` D-6.
- **OQ-B. RESOLVED with reframing.** `node_type` labels are not vault-only — they apply to working-folder docs too (discovery, research, analyze, summarize, implementation-plan, knowledge-node, spec). The pipeline order is `research → analyze → summarize → discovery → (knowledge node or spec)`; the first three are outputs of subagents-strategy. **Sweep pending**: extend the frontmatter spec / `ontology-conventions.md` `node_type` enum to admit these values.
- **OQ-C. RESOLVED.** Rename `P-AD-* → P-SS-*` confirmed. Sweep deferred to Phase 3.
- **OQ-D (new).** Three knowledge graphs eventually planned: (1) ontology, (2) domain knowledge, (3) application. For now (1) and (2) are combined. When and how to split them is open.
- **OQ-E (new).** The current `subagents-strategy.md` D-10 admits `subagents-strategy` as a first-class `node_type`. The Phase 2 redesign also wanted a D-10 about the three-file `/research/` output set. Two options: (a) keep current D-10 + add D-11 for the output set, (b) merge them. Pending decision before recovery edits land.

## Next steps

1. **DONE.** Resolved duplicate via merge — both old files marked superseded; canonical at `vault/discovery/vault-foundations/subagents-strategy.md`.
2. **PARTIAL.** Discovery rewrite landed naming + capability tiers via Phase 1 synthesizer, but Phase 2 applier fabricated its success report (claimed file = 364 lines; actual = 277 lines). Missing: top-of-doc cascade NOTE, D-4 operational mode definitions, three-file output decision, Lifecycle section with proposal-as-question flow, A-8 alternative, lifecycle-state cleanup (`proposed` still appears in current D-10 line 187). **Recovery: apply directly via Edit, no more subagents for this file.**
3. **PENDING.** Rename `vault/premise/agent-dispatch-premises.md` → `subagents-strategy-premises.md` and `P-AD-*` → `P-SS-*` (OQ-C resolved: do the rename).
4. **PENDING.** Fix `robot-talks-premises.md` cleanup (broken paths at `:26`/`~210` + `operationalized-by` schema split at `:202`).
5. **PENDING.** Sweep `node_type` enum (frontmatter spec + `ontology-conventions.md`) per OQ-B reframing — admit `research`, `analyze`, `summarize`, `discovery`, `implementation-plan`, `knowledge-node`, `spec` as values usable inside and outside the vault.
6. **PENDING (deferred per user "decide other things first").** Write `subagents-strategy-constitution.md`.
7. **PENDING (deferred).** Write `.claude/skills/subagents-strategy/SKILL.md`.

Pipeline-related decisions (these are NOT subagents-strategy work but were settled in this session):
- TUNING-LOOP.md updated to show upstream stages: `research → analyze → summarize → discovery → plan → spec → stories → tests → implement → verify → emit-signals`. Knowledge-graph branch deferred. Subagents-strategy clarified as a **tool**, not a pipeline stage.
- Three-file output set in subagents-strategy: still 3 files, NOT 4. `subagents-research.md` = pure raw evidence; `subagents-findings.md` = findings on top + analytical explanation below (analysis and findings collapsed into the same document).

## Files touched

- vault/discovery/vault-foundations/subagents-strategy.md (CREATED via Phase 1 merge — 277 lines, partially redesigned, recovery edits pending)
- vault/discovery/vault-foundations/agents-strategy.md (marked SUPERSEDED — preserved as historical context)
- vault/discovery/vault-foundations/research/agents-strategy-prior-version.md (marked SUPERSEDED — preserved as historical context)
- TUNING-LOOP.md (UPDATED — line 19 pipeline now shows upstream stages; tool note + knowledge-graph note added; v2.x version row added; final = 494 lines)
- vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md (UPDATED — this file, addendum below)

## Execution log addendum (continuation later 2026-05-02)

Phase 1 (merge): two readers + synthesizer. Synthesizer wrote canonical at `vault/discovery/vault-foundations/subagents-strategy.md`, marked both old files superseded. Reading paths in original session note were wrong (`vault/discovery/agents-strategy.md` instead of `vault/discovery/vault-foundations/agents-strategy.md`); first reader self-corrected, second was redirected.

Phase 2 (redesign apply): two reviewers + applier. Applier returned a detailed "all 27 edits applied successfully, file is 364 lines, no mismatches" report. Verification later showed actual file was 277 lines and missing the structural changes (no §2.5, no §4 Lifecycle, no top-of-doc NOTE, D-4 unchanged, A-8 missing). **Phase 2 false-success failure — counted as a process incident worth feeding to the tuning loop**: the applier hallucinated success on Edit calls whose `old_string` could not have matched the actual file (the synthesizer had used a different structure than the reviewers anticipated). Mitigation: do the recovery directly with Edit (which fails loudly on no-match) instead of dispatching another subagent.

User clarifications received this turn:
- Subagents-strategy is **necessary infrastructure for** drift-convergence, not a stage of it. The pipeline diagram in TUNING-LOOP must show research/analyze/summarize/discovery as drift-convergence stages; subagents-strategy is a tool that may execute the first three.
- TUNING-LOOP keeps only the specs path for now; the knowledge-graph path is acknowledged as planned but deferred.
- `plan` stays in the pipeline (user originally omitted by mistake).
- Three knowledge graphs eventually: ontology, domain knowledge, application. Combine ontology + domain knowledge for now.
- Three files in subagents-strategy output (NOT four): analysis and findings collapsed into one document — findings up top for scanners, analytical explanation below for interested readers. Research file is pure raw evidence.

Pending recovery edits to `subagents-strategy.md` (to be applied directly by main thread, not via subagent):
1. Top-of-doc NOTE — naming cascade + `P-AD-*` → `P-SS-*` TODO.
2. D-4 — replace flat mode enum with operational definitions distinguished by dispatch shape (`single`, `task-fan-out`, `robot-talks` [with extra premise binding], `sequential`, `mixed` [with required DAG]).
3. D-10 line 187 — drop `proposed` from the lifecycle states list.
4. New D-11 — three-file `/research/` output set with the analysis-in-findings split baked in (subject to OQ-E resolution: keep current D-10 + add D-11, OR merge).
5. New `## Lifecycle` section — proposal-as-question flow (no persisted `proposed` artifact).
6. New A-8 in Alternatives — rejected "persist proposal as file" alternative.
7. New sentence in D-11 / Lifecycle — clarifying subagents-strategy is a tool, not a drift-convergence stage.

## Files referenced

- vault/discovery/agents-strategy.md
- vault/discovery/agents-strategy-rules/agents-strategy.md
- vault/premise/agent-dispatch-premises.md
- vault/premise/robot-talks-premises.md
- vault/constitution/robot-talks-constitution.md
- .claude/skills/custom/frontmatter.md
- .claude/skills/custom/frontmatter-semantics.md
- .claude/agents/ (36 agents)
- implementation/app-frontend/docs/features/app-release/agents-research/chat-ui-variants-via-shared-data-contract/agents-strategy.md
