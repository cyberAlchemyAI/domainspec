---
tags: [agents, dispatch, subagents, experiment, meta]
node_type: findings
is_session: false
layer: architecture
nature: [procedural, technical]
status: active
created: 2026-06-15
dispatch_id: 2026-06-15-experiment-design-meta
exit_reason: loop_ceiling_reached
---

# findings.md — Design for the migrate/freeze/stop experiment (v0.6.0 vs old donor model)

**Dispatch** `2026-06-15-experiment-design-meta` (research, meta). **final_approver:** parent.
**Close:** `loop_ceiling_reached` — the synthesizer↔reviewers zig-zag hit its `loop_cap: 2`
without converging; the parent (final_approver) integrated the reviewers' mechanical fixes
below and banks the one residual **structural** finding (N4) for owner decision. Every
load-bearing claim cites an explorer return (E1/E2/E3 in `research.md`) or a reviewer round
(R1 Bell = non-vacuity, R2 Popper = falsifiability).

> **One-line answer to the goal:** A runnable, falsifiable experiment design exists and is
> specified below — **but the red-team surfaced that it is probably moot**: the field ledger is
> ~96% `resolved` [E1], so the pre-freeze defect-existence gate likely finds **zero** citable
> shipped defects, which routes the experiment to **FREEZE-by-absence** before any arm runs
> [R2-N4]. That routing *is* the 61–0 revealed-preference prior [E3] re-expressed as a gate.
> The honest deliverable is therefore the design **plus** the finding that running it may be
> unnecessary — the answer it would most likely give (don't migrate) is already entailed by
> the field's resolution rate.

---

## 1. The design (matured, reviewer-fixes integrated)

### 1.1 Pre-freeze defect-existence gate (runs first; nothing else runs before it)
Mine the field ledger [E1 mining plan]; for each candidate defect emit a row in
`frozen-sample.md`: `[target_id | ledger dispatch ID | the specific shipped defect | cited
authority proving it wrong (verifiable on disk) | severity ∈ {minor, substantive, costly}]`.
**Admission is itself a blind judgment** — route it through the §6 fresh adjudicator, not the
owner: a row is admissible only if the blind agent confirms "citation C contradicts shipped
output O" [R1-NEW-M1 fix]. Restrict admissible targets to defects whose v0.6.0 catch-mechanism
is **input-local** — its trigger is reconstructible from the frozen input alone [R1-NEW-C1 fix];
mechanisms that read lab/field-divergent state are inadmissible.
- **≥1 admissible row →** composite experiment (§1.2–§1.5) is licensed; target list frozen; verdict space {migrate, freeze, stop}.
- **0 admissible rows →** composite cannot run; route to the fallback (§1.6), verdict space {freeze, stop}. **See N4 — this branch is doing the real work.**

### 1.2 Single scalar (truth-test; overhead excluded) [R2-(a),(e) fixes]
`catch_value(d) ∈ {0,1,2,3}` = severity of the pre-named target v0.6.0 catches **and** OLD misses.
`S = Σ_d catch_value(d)`. **SURVIVED ≡ S ≥ τ**, **FALSIFIED ≡ S < τ** — one axis, one cut, no dead zone.
**τ is not a free knob** [R2-N1 fix]: τ is *derived* as the smallest S whose implied per-61
prevention count ≥ k (§1.5), so τ is a consequence of k/c, not an independent threshold.

### 1.3 Counterfactual attribution [R2-(b) fix]
A catch counts iff (1) B catches a pre-named target, (2) **OLD re-run on the same input misses
it**, (3) the catch traces to a v0.6.0 mechanism textually absent from A. OLD is re-run **only on
candidate-catch dispatches** (bulk stays ledger-read — adjudicating E3's "don't re-run A"), and
the re-run is **pinned to the same model id** as arm B, single fixed config, logged in
`frozen-sample.md` [R1-NEW-M2 fix].

### 1.4 Sample & where B runs
n = 2–3 hardest dispatches, but a catch counts only if it matches a **pre-named `target_id`**
(closes the existence-hunt) [R2-(d) fix]. Arm A = old model read from ledger [E3]; Arm B = the
v0.6.0 chain run **in the lab repo on the imported field input** (data is portable; the chain need
not be installed in the field repo) — external-validity threat **"B-here ≠ B-in-field" logged**,
and constrained by the §1.1 input-local rule so the gap can't silently invert a FALSIFIED [R1-NEW-C1].

### 1.5 Decision rule (overhead lives here, pre-priced) [R2-(c) fix]
Overhead in the only currency E1 actually recorded — **agent-runs + gate-rounds** (no token/latency
on any field close row [E1]). **MIGRATE iff** B would prevent **≥ k** defects per 61 at cost **≤ c**,
with **k and c named before running**: k = 1 substantive-or-costly defect per 61; c = +2 agent-runs
and +1 gate-round per dispatch vs old. k is priced against the **finite pre-named target list**, not
an extrapolated rate [R2-N2 fix]. SURVIVED + rate ≥ k + overhead ≤ c → **MIGRATE**; SURVIVED but
rate < k or overhead > c → **FREEZE**; FALSIFIED → FREEZE (if faithful) / STOP (if less faithful, §1.6).

### 1.6 Fallback: tension-faithfulness design (runs iff §1.1 finds zero defects)
Pre-registered now (not invented post-hoc). `faithfulness_delta = (OLD reproves + vacuous) −
(v6 reproves + vacuous)`, where **"vacuous pass" is defined by a frozen degeneracy-pattern list**
(same discipline as §1.3), not a post-hoc lever [R2-N3 fix]. STOP iff delta < 0, FREEZE iff ≥ 0;
migrate excluded.

### 1.7 Adjudicator [R1-M1 fix]
A **fresh agent** scores `catch_value` from de-identified arm outputs + the frozen target list +
attribution rubric; it also gates §1.1 admission. Owner = designer (authors/freezes criterion),
blind at scoring, residual prompt-author bias logged. R1/R2-style conformance backstop.

---

## 2. Residual findings (banked, claim ≤ proof)

Mechanical fixes above are integrated. These remain as recorded reviewer positions:

| # | reviewer | severity | finding | status |
|---|---|---|---|---|
| N1 | R2 r2 | CRITICAL→fixed | `τ=2` was a hidden free knob | **fixed** — τ derived from k (§1.2) |
| N2 | R2 r2 | CRITICAL→fixed | n=2-3 → per-61 prevention was an unlicensed extrapolation | **fixed** — k priced on the finite named list (§1.5) |
| N3 | R2 r2 | MAJOR→fixed | "vacuous pass" undefined | **fixed** — frozen degeneracy list (§1.6) |
| NEW-C1 | R1 r2 | CRITICAL→fixed | "run B in lab" could invert FALSIFIED, not just bound MIGRATE | **fixed** — input-local admissibility (§1.1) |
| NEW-M1 | R1 r2 | MAJOR→fixed | §1 admission was owner-self-certified | **fixed** — routed to blind agent (§1.1) |
| NEW-M2 | R1 r2 | MAJOR→fixed | OLD re-run config unpinned | **fixed** — pinned model id (§1.3) |
| **N4** | **R2 r2** | **CRITICAL — OPEN** | **the zero-defect branch excludes MIGRATE a priori; the field's 96%-resolved ledger is exactly what produces zero admissible targets, so the experiment cannot return MIGRATE when the 61–0 prior is true — the prior wearing a gate** | **OPEN — owner decision** |

---

## 3. N4 — the load-bearing open question (owner decides)

R2's N4 is not a draft defect to patch; it is a statement about reality. The experiment can only
return MIGRATE if the field has a **citable shipped defect that v0.6.0 would have caught and old
missed**. E1's mining shows the field is ~96% `resolved`, zero `dissent_irreconcilable`, one
`error`, one `user_abort` — defects (where they exist at all) live in prose, not as adjudicable
shipped errors [E1]. So with high probability §1.1 finds **0 admissible targets** → FREEZE-by-absence.

Two readings, and they need **your** call:

- **(A) FREEZE-by-absence is the correct answer, cheaply.** If the field can't even produce one
  defect the new gate would have caught, the old model is good enough and the per-dispatch tax of
  v0.6.0 isn't earned [E3 revealed-preference]. Then you should **not run the experiment** — declare
  FREEZE now and stop refining. The design's value was proving the answer was already entailed.
- **(B) The experiment is mis-framed.** "Catch a shipped defect" may be the wrong differential —
  v0.6.0's claimed value (per E2) is *process* (tension-faithfulness, relocation legibility), not
  *outcome* defects. If you believe the value is process-quality, the migrate case must be argued on
  the §1.6 faithfulness axis directly — but note that axis **explicitly excludes MIGRATE** as drafted,
  precisely because process-only improvement can't justify replacing a working field model. So (B)
  collapses back toward FREEZE-as-add-on (adopt the gate, don't replace the model).

Either reading lands near FREEZE. That convergence is the dispatch's real result.

---

## 4. Verdict matrix (design components)

| Component | grounded? (E1) | valid? (E2) | runnable? (E3) | decision |
|---|---|---|---|---|
| Pre-freeze defect gate (§1.1) | YES | YES | YES | KEEP — gates everything |
| Single scalar S + τ-from-k (§1.2) | n/a | YES (R2-N1) | YES | KEEP |
| Counterfactual attribution, candidate-only A-re-run (§1.3) | n/a | YES (R2-b) | YES (E3 economy preserved) | KEEP |
| Pre-named target list (§1.4) | YES | YES (R2-d) | YES | KEEP |
| Pre-priced k,c; overhead in decision rule (§1.5) | YES (countable currency) | YES (R2-c) | YES | KEEP |
| Run B in lab, input-local only (§1.4/§1.1) | partial | YES (R1-NEW-C1) | YES | KEEP, threat logged |
| Blind adjudicator incl. §1.1 admission (§1.7) | n/a | YES (R1-M1) | partial cost | KEEP |
| **N4 a-priori migrate-exclusion** | YES (96% resolved) | — | — | **OPEN — §3** |

---

## 5. Meta-observation (the experiment about the experiment)

Designing this dispatch cost **3 check-tension gate rounds / 6 infra agents** before the sheet could
launch, two rejections caused by the checker **misapplying its own rubric** (it imposed the explorer
"≥2 axes" rule on a 2-skeptic group). That is first-hand evidence of the v0.6.0 gate's false-reject
overhead — a live entry on the *cost* side of exactly the migrate/freeze ledger this experiment was
meant to fill [E3; R1-r1]. The governance process generated, as a byproduct, a data point against
its own migration.
