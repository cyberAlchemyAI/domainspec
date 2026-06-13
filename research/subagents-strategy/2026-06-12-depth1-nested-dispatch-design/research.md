---
tags: [agents, dispatch, subagents, nesting, governance, research]
node_type: research
is_session: false
layer: architecture
nature: exploratory
status: complete
last_updated: 2026-06-12
---

# Research — depth-1 nested dispatch design (collected returns, verbatim)

**Dispatch:** `2026-06-12-depth1-nested-dispatch-design` (meta, research, schema v0.5.2).
**Goal:** Decide whether and how to admit depth-1 nested dispatches: a working agent
granted the right to open at most one nested dispatch, max 2 per parent, no further
nesting — with the gate, registration, and budget questions answered.
**Context:** Constitution v0.5.2 has a single human gate (P2), a helper exemption (P11),
and meta lineage (P13). Candidate design: delegated gate + explicit grant + registration
via `parent_dispatch_id` + retroactive human review at parent close. P-SS-8's cost debt
(1.67B-token July 2025 incident) is standing law.

Shape run: explorers (investigate, n=2) → synthesizer ↔ reviewers (evaluate, n=2,
zig-zag, loop_cap 2 — both turns used). Feedback edge instantiated on the sheet but
never fired.

---

## [A] Abramsky, Samson — explorer, external prior art (PARTIAL RETURN)

> ⚠ Partial group result (constitution P4): the agent's full 7-pattern table was lost
> in transit (only its final summary returned; the session could not be continued).
> Downstream synthesis was told to weight accordingly.

Verbatim surviving return:

> The strongest analogues for depth-1 nesting with a single human gate are
> **structured concurrency nurseries** (Trio/Swift) and **role-stratified spawn
> authority** (AutoGen/CrewAI) — both make deeper nesting unconstructible by not
> passing the spawn-authority object to grandchildren, which maps cleanly to "the
> human gate grants a dispatch handle to the working agent; the working agent cannot
> re-export it."
>
> The **cgroup/rlimit** pattern gives you the exact "max 2 per parent, 0 for children"
> numeric encoding if you want hard caps rather than structural prevention.
>
> Dissent: anticipates that the internal-constitution view will prefer a
> traceability-first rule (every nested dispatch row must have an unambiguous parent
> dispatch row in the ledger) over the numeric ceiling borrowed from OS resource
> management.

## [B] Baez, John — explorer, internal constitutional constraints

Fourteen constraints (cited to the constitution) — verbatim return:

> **C1 — One human gate only; the delegated gate cannot be a *second* human gate.**
> (P12; P2.) The nested sheet's approval may be agent-delegated, but the amendment may
> NOT introduce a second *human* confirm.
>
> **C2 — P2 freeze/no-dispatch-before-confirm applies to the nested sheet.** (P2.)
> A nested dispatch is still a dispatch; approval must precede its dispatch row, and
> the approved nested sheet is frozen.
>
> **C3 — Helper exemption is forfeited the moment the nested unit fans out.** (P11.)
> Depth-1 nesting is the *governed* form of what P11 currently sends to "a real
> dispatch," not an extension of the helper bucket.
>
> **C4 — Mandatory registration via two appends in the one canonical registry.**
> (P3, §2.) No new persistence surface (registry-sole-surface debt forbids it).
>
> **C5 — `parent_dispatch_id` is currently meta-only; nesting requires amending P13,
> not reusing the field as-is.** (P13: the field exists "**only** on a dispatch spawned
> by a meta dispatch... No other lineage fields exist.") Hard law-conflict: widening
> P13 is forced.
>
> **C6 — Lineage must stay finite and acyclic.** (P13.) "Nested dispatches may not
> nest" must be encoded as the acyclicity/finiteness enforcement, not a convention.
>
> **C7 — Each nested dispatch re-enters its gate as a new sheet.** (P13.) Meta was
> explicitly denied a P2 exception; nesting cannot silently get one.
>
> **C8 — Anti-bias law applies in full to any nested group with n ≥ 2.** (P5 + §9 D2.)
>
> **C9 — The budget carve bounds only declaratively.** (§7 P-SS-8.) `token_budget` is
> a declared target with no runtime enforcement; per-agent budgets do NOT bound
> recursion-runaway. A "≤2 per parent" cap is a *count* brake, not a *cost* brake.
>
> **C10 — The amendment must re-confront all three premise debts.** (§7 closing
> clause.) P-SS-8 is materially AGGRAVATED by nesting; it cannot be silently affirmed.
>
> **C11 — Trust-but-verify crosses the nesting boundary.** (P8.)
>
> **C12 — `agents_spawned` close-row reporting must represent the nested subtree.**
> (P3, §5.) Rows + roll-up, so spawn-tree opacity stays reconstructible.
>
> **C13 — Explicit grant in the briefing is a new required precondition.** Absent the
> grant, the agent falls back to P11.
>
> **C14 — Nested loop ceilings must be specified** (count against the parent's
> `max_loops` or carry their own), else "again until it converges" re-enters through
> the nested layer. (§5.)
>
> **Conflict flag:** a delegated gate is **not compatible with P2 as written** ("an
> explicit affirmative from the human in chat") — P2 must be **amended**, not
> reinterpreted; P12's "exactly one human gate" has no slot for an agent-held *entry*
> gate (`final_approver` is close-side only). P13 must also be amended (C5).
>
> Dissent: expects the external explorer to argue the budget-carve discharges P-SS-8
> and delegated approval is industry-normal needing no P2 rewrite. Baez holds the
> opposite: internal law explicitly says per-agent budgets do not bound recursion and
> the entry confirm is human-only; external precedent can only motivate amending the
> text, not override it.

## [S1] Noether, Emmy — synthesizer, first draft (zig-zag turn 1)

Verdict matrix v1 (superseded by findings.md): (1) delegated gate GO-WITH-AMENDMENT
(amend P2+P12); (2) explicit grant GO; (3) 2-per-parent cap GO as count limiter only;
(4) `parent_dispatch_id` registration GO-WITH-AMENDMENT (widen P13); (5)
appender-enforced depth limit GO; (6) budget carve KILL as safety mechanism. Bottom
line v1: ADOPT with four amendments. Resolved the explorer dissent collisions in favor
of [B] on both (budget-carve does not discharge P-SS-8; P2 needs amendment, with [A]
*motivating* rather than overriding). Flagged component 1's precedent support as
weakened by [A] being partial.

## [R] Russell, Bertrand — skeptic, definitional-soundness gate (zig-zag turn 1)

> **Attack 1 (CRITICAL, vs claim 1):** "Retroactive human review" is definitionally
> not a gate — a gate sits *before* an irreversible action and can *prevent* it. At
> parent close the tokens are spent and the outputs are already consumed into the
> parent's reasoning; nothing is revocable. A control that cannot prevent or reverse
> is a notification. Fixes: (i) synchronous pre-dispatch human gate for nested sheets,
> or (ii) **quarantine** — nested output may not be consumed by the parent until a
> recorded human affirmative (gates consumption, the only still-reversible act).
>
> **Attack 2 (CRITICAL, vs claim 2):** a bare "you may nest" grant is a **blank
> check** — the controversial fan-out is deferred one level down where only an agent
> approves; the human's affirmative attaches to what they saw, not what the grant
> unlocks. Fix: grant must be *contentful* (enumerate the possible nested sheets at
> top-level confirm) or void.
>
> **Attack 3 (CRITICAL):** agent-approves-the-sheet-it-authored is P12's prohibited
> self-approval renamed. Fix: nested approver must be a *different actor* than the
> nested author; amend P12 to "no actor may approve a dispatch sheet it authored, at
> any depth."
>
> **Attack 4 (MAJOR):** one human click cannot be two consents (shares Attack 2's fix).
>
> **Attack 5 (MINOR/out-of-gate):** claims 3/5 are sound but orthogonal — containment
> must not stand in for consent.
>
> **Verdict:** design does not survive definitional soundness as written; one family
> of fixes rescues ADOPT (contentful + pre-dispatch consent, or quarantine).
>
> Dissent: expects the non-vacuity skeptic to rate Attack 1 as already-mitigated by
> quarantine — operationally indistinguishable from a pre-gate once data flow is traced.

## [Q] Quine, Willard V. — skeptic, non-vacuity gate (zig-zag turn 1; walked against the live appender)

> **Walk result: NON-VACUOUS but THIN** — no closed negative, but the only steps that
> EXIST TODAY are the permissive ones.
>
> Step 1 (grant in briefing; human confirms parent): EXISTS (free-text carrier; gate
> confirms a *permission*, not a dispatch). Step 2 (mid-flight agent authors a sheet):
> MUST BE BUILT. Step 3 (delegated gate): vapor at the mechanism layer — the appender
> enforces no gate at all. Step 4 (registration): **EXISTS mechanically — today's
> appender accepts `parent_dispatch_id` on a NON-meta row unconditionally** (in
> DISPATCH_KEYS; validated only as string-or-null; emitted when non-null; no meta
> coupling, no parent-existence check) — code permits what P13 forbids. Step 5
> (2-per-parent cap + depth limit): MUST BE BUILT — the structural self-check discards
> every key except row keys, so the appender cannot read `parent_dispatch_id` of
> existing rows; the data is on disk; the appender does not read it. Step 6 (nested
> close row): EXISTS. Step 7 (parent rolls up nested `agents_spawned`): hand-done;
> MUST BE BUILT. Step 8 (human retro-review at parent close): no enforcement surface.
>
> **The witness exists; the safety does not.**
>
> Dissent: expects the definitional-soundness skeptic to read the walk as a witness
> *against* the design — only-permissive-steps-live = an unbounded fan-out wearing a
> `parent_dispatch_id` label, the exact P-SS-8 / 1.67B-token failure mode.

## [S2] Noether, Emmy — synthesizer, revision (zig-zag turn 2 of 2, final)

Final synthesis — see `findings.md` (this folder). Verdicts moved: claim 1
KILL-and-replace (quarantine-until-affirmative); claim 2 contentful-or-void; claim 5
downgraded to MUST-BE-BUILT; claim 4 reframed as build-the-check-P13-implies; claims
3 and 6 held. Russell–Quine quarantine tension resolved: quarantine IS a sound gate
(it gates consumption, the still-reversible act) AND it is unbuilt — both skeptics
survive in the bottom line.
