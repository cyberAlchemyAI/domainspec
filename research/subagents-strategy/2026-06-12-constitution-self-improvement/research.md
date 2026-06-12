---
tags: [subagents, dispatch, constitution, research, meta]
node_type: research
is_session: false
layer: architecture
nature: technical, procedural
status: draft
version: 0.1.0
last_updated: 2026-06-12
dispatch_id: 2026-06-12-constitution-self-improvement
---

# Research — Constitution v0.5.0 self-improvement (collected returns)

Meta-dispatch reviewing `subagents-strategy-constitution-proposal.md` (v0.5.0). Shape:
3 explorers (tensioned on source corpus) → synthesizer → 2 reviewers (robot-talks,
zig-zag loop_cap 3). This file holds the collected returns verbatim-in-substance;
`findings.md` holds the cited synthesis (the v0.5.1-final amendment list).

## E1 — Scientific literature (model: sonnet)

**Strong-evidence mechanisms (candidate amendments):**

- **A1 — Sycophancy / premature convergence is a documented failure mode of robot-talks without countermeasures.** Sources: Du et al. (ICML 2024); arXiv 2509.05396 "Talk Isn't Always Cheap"; 2509.23055; 2604.02668; 2502.19559 "Problem Drift in Multi-Agent Debate"; Smit et al. ICML 2024 (MAD does not consistently beat self-consistency). v0.5.0 has anti_bias but only defines tension at the *start*; no rule protects position across robot-talks rounds. Proposed: anti_bias protected across interaction; synthesizer receives initial AND final positions to detect collapse.
- **A2 — Heterogeneous models reduce correlated error.** Sources: Mixture-of-Agents arXiv 2406.04692 (TogetherAI); 2602.03794 (diminishing returns of homogeneous agents); 2510.07488; 2510.07517. `model` field allows heterogeneity but constitution neither requires nor recommends distinct models for n≥2; anti_bias forces *angle* diversity, not *model* diversity (same base model = correlated error). Proposed: for n≥2 prefer ≥2 base models; warn if homogeneous.
- **A3 — Runaway cost; STRONG with a real incident.** A Claude Code recursion loop consumed ~1.67 billion tokens in ~5h (≈US$16k–50k), July 2025. P-SS-8 waiver (unregulated spawn) carries its own falsification clause ("untraceable cost in practice → the assumption is falsified → the spawn cap returns"). Proposed: NOT a spawn cap, but an optional dispatch-level `token_budget_total` harness hard-stop (cost, not topology).
- **A5 — LLM-as-judge has systematic biases:** verbosity, position, self-preference, instability. Sources: NeurIPS 2024 arXiv 2411.16594; 2603.01865; 2510.12697 (judge panel beats single judge). When final_approver=agent, v0.5.0 mandates no mitigation. Proposed: if final_approver=agent, declare position+verbosity-bias mitigation or use a panel.
- **A4 — vote/concat inadequate for qualitative outputs; synthesis/auditing beats both.** Sources: arXiv 2510.01499; 2602.09341; 2605.29116. v0.5.0 already derives aggregation (robot_talks→synthesize else concat) and has no `vote` field. Weak amendment: concat only as intermediate input to a synthesize wave, never final output.

**Medium-evidence (NOT mandatory amendment):** B1 self-consistency (already accommodated); B2 blackboard (no strong LLM evidence); B3 disagreement-as-gate-signal (orientation gap, not schema); B4 planner-executor (anecdotal); B5 anonymization in robot-talks (one paper; belongs in robot-talks-constitution).

## E2 — Repo precedent (model: sonnet)

**Blocks adoption:**
- **C1** Principle 3 "at close it updates the same row" CONTRADICTS append-only tooling (close = separate appended `close_of` event). Confirmed: ledger lines 40–44 show dispatch followed by a SEPARATE close_of entry.
- **C3** agent_names pool "ported next to this constitution" does NOT exist; all real records have `name:null`. Required `agent_name` references a non-existent artifact.
- **C4** `working_folder`, `groups[]`, `connections[]` NOT implemented by the appender (`append-dispatch.cjs` only emits dispatch_id/corpus/topic_slug/created/session/status/goal/success_metric/max_loops/constraints/anti_bias/agents). The 3 central v0.5.0 schema fields have no persistence path.
- **D1** validator block (Step 0.5 + 11-item checklist) in skill `domainspec-subagents-strategy` orphaned (v0.5.0 §7 cut the validator).
- **D2/D3** spec files in vault/snapshots + JSONL telemetry — skill has mandatory Step 2.5 + telemetry emit that v0.5.0 removed → skill inoperable.
- **D6** ping-pong duos mode removed without equivalent substitute.

**Should fix:** C2 (skeleton "updated at close" impossible under append-only); D5 (recursion_budget cut but skill still applies total cap); D7 (exit_reason vocabulary diverges skill↔proposal); D8 (9-step skill lifecycle vs 4-step proposal); D4/D9 (heuristic_row + writer subagents unanchored); **M2** (success_metric cut with justification "vacuous restatement of goal" NOT supported by practice — ledger L17/27/50 show exploratory/adversarial-audit/closure as distinct halt predicates).

**Notes:** P2 (agent_name never used); P4 (⟂ notation uncanonicalized); P5 (agents_spawned tree-key shape diverges); P1 (model:parent in flat fan-out undefined). M1: premise-debt accounting is coherent — do not touch.

**Verdict:** not adoptable as-is; 3 independent structural blocks (appender doesn't implement schema; "updates same row" contradicts append-only; agent_names pool nonexistent).

## E3 — Formal consistency (model: opus)

Master test (§1): two strategists, same goal, fill the sheet identically.

**CRITICAL:** #1 final_approver may BE an agent holding accept(success)+re-run(max_loops) trigger, but Principle 2 says confirm/reject is a HUMAN act — never reconciles entry-gate (human) vs result-approval (output) when approver is an agent. #2 reviewers in skeleton has robot_talks:true + layers:1 + zig-zag simultaneously; if layers:2 AND loop_cap:2 coexist, execution count undefined ("smallest scope wins" resolves CHOICE, not COEXISTENCE).

**HIGH:** #3 feedback edge CONDITIONAL in §3/P6 but ALWAYS in §5/§6; #4 loop_cap default=2 but skeleton pins feedback loop_cap:1 unannotated; #5 loop_exhausted undefined (max_loops vs edge loop_cap?); #6 meta recursion without base case; #7 working_folder conditional (§5) vs Principle 9 universal.

**MEDIUM:** #8 meta-evaluate orphan role; #9 auditor↔meta-evaluate mapping undeclared; #10 two-files: n=1 ambiguous; #11 anti_bias_global O but "specializes" it; #12 "outputs land" in wrong lifecycle step.

**LOW:** #13 R25–R28/R6b unverifiable in-doc; #14 pool YAML "to be ported"; #15 "FORECAST" never defined / 3 promotion verbs; #16 cost dial dispersed.

**Confirmed consistent (do not touch):** Principle 7 (derived aggregation), Principle 14 (robot-talks binding), exit_reason/status values §5↔skeleton, premise-debt accounting, Principle 11 (helper-vs-dispatch marked provisional).

## Reviewers (R1 complexity-creep / R2 underspecification, robot-talks, opus)

Both, from opposite angles, CONVERGED on KILL/WEAKEN for E16, E17, E18, E19.
R2 additionally found cross-amendment contradictions: E4×E13 (two human gates),
E10 drops user_abort + renames success→converged, E17×E2 (what the appender emits
as LIVE), E5×E9 (layers killed in the very group it's exemplified on), E14 vs the
anti_bias definition, E2 FORECAST has no state-carrier. R1 additionally judged E4
and E6 to be creep dressed as blockers (E4 = prose clarification; E6 = skill
migration plan, out of constitutional scope). Full reviewer text is in the session
transcript; the resolution is in findings.md.
