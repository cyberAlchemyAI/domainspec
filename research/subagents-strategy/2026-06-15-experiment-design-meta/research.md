---
tags: [agents, dispatch, subagents, experiment, meta]
node_type: research
is_session: false
layer: architecture
nature: [procedural, technical]
status: active
created: 2026-06-15
dispatch_id: 2026-06-15-experiment-design-meta
---

# research.md — collected explorer returns (verbatim)

Dispatch `2026-06-15-experiment-design-meta` (research, meta). Goal: design the experiment
that decides whether the v0.6.0 subagents-strategy architecture beats the old donor model on
the field repo's (`domainspec-lean-formalization`) real workload — falsifiable criterion +
A/B protocol + field-ledger mining plan. Three tensioned explorers (methodology × source-corpus):
E1 empirical/field-grounded, E2 formal/validity, E3 pragmatic/cost. Returns are reproduced
verbatim under per-child headers; the cited synthesis is `findings.md`.

---

## E1 — Abramsky, Samson (empirical / field-grounded; claude-sonnet-4-6)

I sampled the field ledger directly (`../domainspec-lean-formalization/telemetry/agents/subagents-dispatch.yaml`, 1069 lines, 54 close rows / 54 typed dispatch rows — the "61" includes pre-schema rows without `dispatch_type`).

### What to mine

**Exit-reason distribution (54 close rows):** `resolved` 49; `synthesis_complete` 2 (early pre-enum spelling); `success` 1; `user_abort` 1 (tower-of-towers — aborted after L1, 3/expected-8 agents, downstream layers never ran); `error` 1 (residue-substantive-build — both build agents lost to a Claude Code process exit before writing any file). **No `loop_ceiling_reached`, zero `dissent_irreconcilable`.** The field has effectively one failure bucket and ~96% "resolved." v0.6.0's richer exit enum is largely unexercised against this corpus.

**Loop usage:** 53/54 closes are `loops_used:1`. Exactly one dispatch looped (track-a-weak-emergence-review, `max_loops:3`, `loops_used:2`, `robot_talks:true`) — and it was a `review`. Loop machinery fires ~2% of the time, only under review.

**Dispatch_type mix (54):** research ~34, code ~10, review ~6, experiment 2. The field runs a non-trivial `code` stream (~19%) that the LAB chain does not have LIVE (code is reserved in v0.6.0). Migration would *remove* a type the field uses weekly — a hazard, not a win.

**Where tension held vs collapsed:** Held & paid off — dissent *preserved not smoothed* recurs and is valued (Leinster HOLDS vs Lawvere BREACHES "recorded, not smoothed"; convergent dissent isolating the sole surviving seam → seeded the next dispatch). Collapsed-as-designed — the residue line shows ~5–8 successive KILL/collapse-to-count closes ("fifth attempt; four prior tries collapsed") but the "Nth relocation" count lives only in free-text `context`. False-consensus flag fired once (override-justified), explicitly didn't fire once; mentioned in ~2/54 rows.

**Token/latency:** `token_budget` present per agent, but **no realized token or wall-clock cost on any close row** — only `agents_spawned` counts + model mix. Any cost/latency criterion is unmeasurable on the existing field ledger without new instrumentation. Available cost proxy: `agents_spawned.total` + `models{}`; spend-control is visible as *role-folding* ("writer/auditor folded into parent for spend").

| Field signal (sampled) | Failure-mode v0.6.0 claims to fix |
|---|---|
| `user_abort` after L1, downstream dead | Wasted fan-out; check-tension claims to catch ill-posed dispatches before spend |
| `error` — agents crashed, wrote nothing | No durable mid-dispatch checkpoint / clean retry |
| ~5–8 serial collapse KILLs, count only in prose | Re-skin detection is human-memory-bound |
| Dissent sometimes smoothed/folded for spend | Inconsistent dissent capture |
| Role-folding collapses the 4-role shape | Canonical-shape erosion under cost (may be regression, not fix) |
| 1/54 loops | Loop machinery under-used |

### Candidate criteria (field-grounded)

- **C1 — Wasted-fan-out reduction.** v0.6.0's gate drops the rate of dispatches that spawn ≥2 agents then close `user_abort`/`error` without reaching synthesis. Baseline 2/54 ≈ 3.7%. Falsified if the v0.6.0 arm's rate ≥ baseline. Caveat: thin base rate; mine `feedback_prompts` for unlabeled near-aborts first.
- **C2 — Repeated-relocation legibility (most field-distinctive).** v0.6.0's ledger + anti-bias axis makes the Nth re-skin of an already-killed route detectable from ledger data alone. Baseline ≥5 serial collapse closes with the count only in prose. Falsified if relocation-detection still requires reading prose.
- **C3 — Dissent-capture consistency.** Under v0.6.0 the fraction of N≥3 dispatches closing with captured/attributed dissent OR explicit false-consensus override rises. Falsified if no higher capture rate, or if gate overhead causes *more* role-folding.
- **C4 — Recoverability (watch-criterion).** v0.6.0's close-row discipline reduces unrecoverable mid-dispatch losses. Only 1 field instance; not a primary until mining confirms hidden retries.

Mining plan that MUST precede freezing: (1) classify all 54 closes + scan every `feedback_prompts`/`context` for crash/re-launch/abort/"Nth attempt"/"relocation"/"fold for spend" markers; (2) build the relocation-lineage graph for C2's baseline; (3) confirm token/latency genuinely absent; (4) tag each close canonical-4-role vs folded.

**Dissent:** E2 will attack C1/C2/C4 as statistically vacuous (base rates 1–2/54 can't support a pre-registered reduction with power) and push for a *design-validity* criterion (does v0.6.0 make failure-mode X unconstructible?) — which I say is exactly the self-review the owner was told to stop. E3 will argue the highest-value fact is the ~19% `code` stream v0.6.0 can't support + spend-driven role-folding, i.e. migration as-specified is a net regression, favoring a non-inferiority frame; I hold you need ≥1 reduction claim (C2) for the experiment to be worth running.

---

## E2 — Gödel, Kurt (formal / validity-first; claude-opus-4-8)

### Threats to validity

1. **Same-owner-judges-both-arms (dominant confound).** The owner built v0.6.0 and is invested. If he scores both arms, the verdict correlates with his expectation, not the architecture's effect; also corrupts the freeze (loose criterion-reading for the preferred arm).
2. **Non-discrimination.** A metric like "produced a findings.md" or "owner found it useful" passes for *both* arms (the old model already produces usable answers — that's why they were never migrated). A criterion both satisfy yields SURVIVED regardless of arm → INVALID. The hypothesis is comparative, so the criterion must be a *differential*.
3. **Order / learning effects.** A/B over the same question means the second arm inherits the first's discovery; architecture effect confounded with run-order; leaks criterion intent.
4. **Apples-to-oranges.** The arms differ on many variables at once (constitutions, agent-type vs pool naming, working_folder conventions, the gate, possibly models). A difference can't be attributed to the architecture. Plus a fifth, structural: **post-hoc criterion** voids the whole exercise.

### Required controls

1. **Blind third-party adjudication.** Owner may be *designer* (authors criterion — desirable, he knows the workload) but **not adjudicator**; adjudicator = `auditor`, different agent, scores **blind to arm** (strip constitution version, naming, folder paths). Keep owner out of `final_approver` over his preferred arm (P12).
2. **A discriminating metric** on which the two architectures can diverge and that maps to the migration stake: tension-faithfulness (check-tension Tests 1–4 — old model has no gate, a real differential), correctness vs independent ground truth, re-derivation cost, contradiction-catch rate. Test: state in advance the result that makes v0.6.0 FALSIFIED; if you can't write a failing outcome, it's non-discriminating → INVALID.
3. **Counterbalanced design.** Don't run both arms on the same question back-to-back. Prefer between-subjects: partition the real questions into two matched halves, one arm each (no question answered twice). The 61-dispatch ledger gives enough N to matched-split.
4. **Hold non-architecture variables fixed:** same underlying model, same field questions (from the real ledger), same output-capture discipline, same budget. Only permitted difference = the architecture. If the decision depends on a bundle (e.g. the gate is part of v0.6.0), name the bundle as the unit and let the verdict speak of the bundle.

Field-ledger mining = the sample frame: stratify by type and by whether the old answer was later corrected (correctness signal), draw a pre-specified sample, freeze the list before any arm runs.

### Pre-registration spec

Criterion is a `working_folder` artifact, frozen before the runner runs (designer →sequential→ runner; never a ledger column — `success_metric` is rejected). Must contain before any run: (a) comparative falsifiable hypothesis; (b) exact discriminating metric + procedure; (c) decision rule + thresholds incl. the explicit failing outcome (SURVIVED→migrate, FALSIFIED→freeze/stop); (d) frozen mined question sample; (e) arm definitions + fixed-variables list; (f) blind-adjudication protocol + who adjudicates. Immutability: an edit is a NEW dispatch (re-enters P2). Reproducibility = deterministic RE-ADJUDICATION (two blind adjudicators agree; divergence → INVALID). A clean FALSIFIED is a successful run; INVALID also closes resolved.

**Dissent:** E1 will resist between-subjects partitioning and fixing the model — he'll say the 61 dispatches are heterogeneous and clean-room controls strip the realism, favoring measuring the old model *as it actually ran*. E3 will attack the cost — blind adjudication + stratified frozen sample + counterbalancing + re-adjudication is a lot for a one-owner reversible call, and will read INVALID-on-divergence as analysis-paralysis. Real tension: validity vs realism (E1) and validity vs shippability (E3).

---

## E3 — Quine, Willard Van Orman (pragmatic / runnability; claude-sonnet-4-6)

### The decision & smallest discriminating probe

The owner must pick ONE terminal state for the field repo: **migrate** (61-dispatch daily workflow onto v0.6.0), **freeze** (keep the old model, accept the fork), or **stop** (no formal dispatch layer). Asymmetric: only migrate costs recurring work; freeze and stop are both "don't adopt v0.6.0." So the experiment needs to answer ONE binary: **does v0.6.0 pay for itself on the field's real daily workload?** Smallest probe: take a handful of real completed field dispatches, re-run through the v0.6.0 chain, ask per dispatch: did the machinery change the answer or its trustworthiness, net of overhead? One caught-defect-that-mattered → migrate; zero caught + measurable overhead → freeze.

### Revealed-preference baseline

Strongest single evidence: the owner ran **61 real daily dispatches on the OLD model and pulled in v0.6.0 zero times**, with v0.6.0 available. Strong prior, one confound: the LAB ledger is ~35 dispatches almost all META — v0.6.0 has **never been load-tested on real domain research**. So non-adoption is either (a) correct read of no value, or (b) switching cost/inertia on an untrialed tool. The experiment's job is to separate them. To overturn "don't migrate" needs a concrete win the old model could not produce — the v0.6.0 chain catching/preventing a real defect, recurring often enough to justify the per-dispatch tax. The check-tension overhead (3 rounds / 6 infra agents / two false-rejects from the checker misapplying its rubric) is a live measured tax on the migrate side. Burden is on migrate, not the status quo.

### Minimum-viable A/B + stop rule

Sample 2-3 real field questions with **known outcomes** (we know what the old model shipped and whether it held). Arm A (control) = old model, cost read from the ledger (don't re-run). Arm B (treatment) = same question through v0.6.0 (chain + ledger + check-tension gate). Judgment (owner, pre-registered): (1) answer parity vs A's known-good output; (2) defect delta — did B catch/prevent a real defect A shipped (the only thing that earns migration); (3) overhead — B's wall-clock + tokens + confirm rounds. Budget: 3 questions × Arm B only ≈ under ~10-15 agent-runs, single sitting; if B can't clear the gate in ≤2 rounds, that's a result.

STOP rule: stop→freeze if the first B run gives same conclusion + zero caught defects + a gate false-reject (reproduces the 61-0 logic on a real question). Stop→migrate if the first B run catches a real costly defect A shipped (existence in a tiny sample implies a plausibly high rate over 61). Continue to n=3 only in the ambiguous middle, then tie-break on overhead × 61 vs tolerance. Against a 61-0 prior the experiment is a confirmation-seeking probe for the rare migrate-justifying win, not a balanced RCT — n=2-3 is correct, not just acceptable.

Attack on E2's cost-inflating controls: reject live re-run of Arm A (use the ledger; re-running risks variance muddying ground truth); reject randomized/representative sampling (we hunt existence-of-value, so deliberately pick the hardest questions); reject blind/LLM-judge panel at n=3 (owner has ground truth, judge error bars exceed signal); reject multi-trial/order controls (variance the binary decision can't spend). A control is worth adding only if flipping its result flips the decision.

**Dissent:** E1 will say n=2-3 is underpowered and "one defect → migrate" over-generalizes; I say that overspends against a 61-0 prior needing only existence-of-value. E2 will attack ledger-read Arm A and non-random question pick as confounded toward freeze, wanting live re-runs + blinding — controls I cut. Real axis: E1/E2 optimize for an experiment that *generalizes*; I optimize for one that *cheaply discriminates this owner's one decision* — collision is whether the 61-0 baseline is admissible (I: strong prior; they: confound to control away).
