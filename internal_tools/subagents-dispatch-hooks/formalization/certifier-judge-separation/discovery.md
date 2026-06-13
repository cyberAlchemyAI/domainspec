---
tags: [research-security, certifier-judge, safe-rl, typed-residue, separation-principle]
node_type: discovery
is_session: false
layer: domain
nature: explanatory, technical
status: active
version: 0.1.0
last_updated: 2026-06-13
created_by: victorboscaro@gmail.com
---

# Discovery — Certifier/judge separation as an engineering pattern for the dispatch system

## Objective

Codify, as design decisions for the dispatch system, the engineering pattern characterized by the `certifier-judge-separation` dispatch: *"prove the inner certifier; leave the outer judge/optimizer unproved inside the certified feasible set."* Two results carry forward: (1) **the two-layer architecture is ADOPTED** — inner certifier provable + fail-closed, outer judge soft inside the certified feasible set — with its established references named (§4.1); (2) **the proposed 3-way unification** (security CERTIFIED-vs-ASSUMED = I/O envelope-vs-body = safe-RL feasible-set as one typed-residue object) **does not hold** — it fails the transfer-witness, non-vacuity, and definitional tests three independent ways (§4.2). This discovery transcribes the verdict into adoptable design positions, each citing `findings.md` or the gate that sustains it.

> This discovery **codifies** `formalization/certifier-judge-separation/research/findings.md` (the source of truth — the L2 skeptic gates + L4 auditor verdict). Its own additions are recommendations marked "this discovery," all revisable by the spec: the adoption scope of the split (§4.1, §7) and the registration of the one reversal collapse-test as a watched crack, not a plan (§6.1). Every codified position cites findings (§/gate) or a named return (Simon SI*, Ashby AS*, Shannon C*, Rittel/Taleb/Quine/Loregian).

---

## 1. Business Context

### Why now

The dispatch system factors an agent into an **inner decision procedure** and an **outer optimizer/judge**. The live design question: is "prove the certifier, not the judge" a sound engineering posture for the system to adopt, and does the proposed cross-domain unification hold? Two explorers mapped it. Simon (repo-internal) showed the split is an exhibited, load-bearing pattern across three repo instances (SI1 permission kernel, SI2 egress bypass, SI3 I/O contracts; `agents/01-explorer-simon.md`). Ashby (external) showed the split is established across ≥5 incommensurable literature threads (`agents/02-explorer-ashby.md`, AS1–AS11). The writer (Shannon, `agents/03-writer-shannon.md`) isolated the proposed *unification* of the three borders into one fibered residue functor; the three skeptic gates plus the auditor found it does not hold. The decision the system needs: **adopt the architecture, do not treat the three borders as one object.**

### What stays the same

References, not re-derived:

- **The split's established references** — Sha 2001 Simplex / RTA, Saltzer 1984, Schneider 2000, the safe-RL threads. Cited on use.
- **The Lean kernel** — `AgentPermissionKernel.lean` and its composition/egress files are correct-by-design instantiations (Ashby M4); they stay as engineering.

---

## 2. Core Concepts

The nuclear concepts the §4 decisions instantiate — one-line definition + pointer; no normative text duplicated (canonical copy: findings).

- **The SPLIT** — factor the agent into a provable, fail-closed **inner certifier** (decidable predicate over a finite structured type whose `allow` provably satisfies a relational safety spec) and an **outer judge/optimizer** that runs unproved *inside* the certified `allow`-set. Safety reduces to (certifier soundness) ∧ (optimizer cannot act except through the certifier). (→ §4.1; findings C1; Simon SI1; Ashby AS1–AS11)
- **Certified feasible set** — the `allow`-region the inner certifier forces; the outer judge is licensed *only* within it (Simplex safe set, CBF forward-invariant set, shield-admissible actions). (→ §4.1; Sha 2001 Simplex)
- **The certifier's border (the assumed region)** — the trusted edge the certifier does *not* reach: `classify(content)` oracle, parser/symlink/Unicode fidelity, the tool catalogue. This is where the split buys zero safety. (→ §4.1; Simon SI1/SI2; findings C1 collapse-test)
- **The 3-way UNIFICATION** — the proposed meta-claim that the security CERTIFIED-vs-ASSUMED border, the I/O envelope-vs-epistemic-body cut, and the safe-RL feasible-set are **one** typed-residue object (one fibered residue functor, one collapse-test). The claim that did not hold. (→ §4.2; findings C2)
- **The reversal crack** — the single fact that would flip the auditor's KILL: a *machine-checked* graded-fibration composition (executable Lean for agent policies, not the abstract theory). Watched, not planned. (→ §6.1; Loregian collapse-test)

---

## 3. Design space — the positions that collided

Two explorer authorities and three skeptic gates entered the dispatch; each position in its strongest form.

### (a) Repo-internal recurrence — the split is an exhibited, load-bearing pattern (Simon)

Simon (`agents/01-explorer-simon.md`) derives bottom-up that the repo exhibits the split in three structurally-independent instances: **SI1** permission kernel (`decidePolicy_sound` certified, `classify(content)` oracle assumed), **SI2** egress bypass (`bash_egress_bypass`, `isEgress_bash_false` — the certifier's *scope* proved as a negative), **SI3** I/O contracts (typed envelope certified, epistemic body KILL #6). His own **Dissent is decisive for this discovery**: "I can show the pattern recurs and name its local shape, but I cannot rule out that what I'm calling 'the same boundary object' in SI1/SI2/SI3 are three distinct things that merely look similar from inside the repo." Recurrence shown; one-object-vs-three not forced.

### (b) External literature — the split is established across ≥5 incommensurable threads (Ashby)

Ashby (`agents/02-explorer-ashby.md`) finds the split established: shielding (AS1), CBF-QP filter (AS2), ModelPlex / Fulton–Platzer (AS3/AS4), security automata (AS5), predictive safety filter (AS7), CMDPs (AS6), supervisory control (AS9), mechanism/policy separation (AS10). **No single paper names the unification** as a theorem — there is no Certified-Feasible-Set Theorem. His **Dissent supplies the kill seed**: the threads use "completely different formal machineries… formally **incommensurable**," so the unifying principle is shallow synthesis, not equivalence.

### (c) The candidate isolated — split sound, unification the open question (Shannon)

The writer (`agents/03-writer-shannon.md`) types **C1 (split) = SOUND**; collapse-test already fired in-repo as `bash_egress_bypass`. **C2 (unification)** **fails demonstration** — no witness-preserving functor unifies path-prefix lattice vs epistemic-quality order vs Lyapunov/CBF sublevel set. **C3 (split = schema→instance / energy→info residue) REJECTED at authoring** — feasibility-residue ≠ FF-translation-loss residue.

### (d) The three independent kills (Rittel / Taleb / Quine) + auditor

- **Rittel (precedent):** the closest established reference for C1 is **Sha 2001 Simplex + RTA** (writer under-cited). C2's *frame* is already covered by **Graded Hoare Logic** (Gaboardi et al. ESOP 2021, the categorical dual of the proposed fibered residue functor) and **Cousot abstract non-interference / Galois** (POPL 2014) — the math the unification would need already lives there.
- **Taleb (non-vacuity):** **VACUOUS FLOOR** — the "shared collapse-test" `classify(content)` is a shared floor (Volpano–Smith); the legs *collided at the bottom*, not unified at the top. Safe-RL fiber is **empty** (no repo Lean term). "The functor is a spectator."
- **Quine (definitional):** **VACUOUS-ANALOGY** — "gap" equivocates: oracle gap ≠ category gap ≠ containment gap. A pun, not a type. The 2-leg Galois rescue *fails on the I/O leg* (no monotone adjoint into reasoning-quality; the carrier is missing).
- **Loregian (auditor):** the three are **distinct failure mechanisms** — **false-consensus flag does NOT fire**. Overdetermined KILL of C2. `exit_reason: resolved`.

### The convergence

The split is sound engineering — **adopt it** (§4.1). The unification **does not hold** — the three borders are treated separately (§4.2). The narrower 2-leg Galois object is real but already covered by Cousot/GHL (§4.3). One crack remains, watched (§6.1).

---

## 4. Codified decisions

Normative source: `findings.md` UNIFICATION VERDICT + the L2/L4 gate matrix. Outcomes: **ADOPT 1 (the split) · DOES-NOT-HOLD 1 (the unification) · 2-leg Galois object 1 (already covered) · REVERSAL-CRACK watched 1.**

### 4.1 ADOPT the two-layer architecture

For any agent in the dispatch system factored into inner procedure + outer optimizer: build the **inner certifier** as a decidable predicate over a finite structured type whose `allow` provably satisfies a relational safety spec, **fail-closed**; run the **outer judge soft inside the certified `allow`-set**. Safety = (certifier soundness) ∧ (optimizer cannot act except through the certifier). Cite established references on use: **Sha 2001 Simplex / RTA** (closest, Rittel), Saltzer 1984, Schneider 2000, the safe-RL threads (Ashby AS1–AS11). Repo instantiation already exists as correct-by-design (Ashby M4; `AgentPermissionKernel.lean`). The architecture's content lives in the **assumed border** the certifier does not reach — `classify(content)`, the tool catalogue — and the collapse-test for the whole posture *already fired in-repo*: `bash_egress_bypass` / `isEgress_bash_false` (`AgentPermissionKernelEgressBypass.lean`), a machine-checked negative where the optimizer reaches a sink the certifier does not catalogue, so the certifier buys zero safety for that attack. (findings C1; Simon SI1/SI2; Rittel)

### 4.2 The 3-way unification — does not hold

The meta-claim that the security CERTIFIED-vs-ASSUMED border, the I/O envelope-vs-body cut, and the safe-RL feasible-set are **one** typed-residue object **does not hold**, failing three independent ways (false-consensus flag does **not** fire):

| kill | mechanism | obstruction | prior art |
|---|---|---|---|
| Rittel (precedent) | the frame's math already exists | the proposed functor would have to be built where the math already lives | Graded Hoare Logic (Gaboardi et al. ESOP 2021) — categorical dual of the proposed functor — + Cousot abstract non-interference / Galois (POPL 2014) |
| Taleb (non-vacuity) | **vacuous floor**, not unification | shared `classify(content)` floor; legs collided at the bottom; safe-RL fiber empty (no repo Lean term) | Volpano–Smith |
| Quine (definitional) | **vacuous-analogy** (a pun) | "gap" equivocates: oracle ≠ category ≠ containment; the I/O leg has no monotone adjoint into reasoning-quality — the functor is *un-buildable as stated*, obstructed by a missing carrier | — |

Treat the three borders separately; do not advance the unification toward a positive closure. (findings §L2/L4 + UNIFICATION VERDICT; Rittel/Taleb/Quine; Loregian)

### 4.3 The 2-leg salvage (security + safe-RL Galois gap)

The narrower security+safe-RL one-sided soundness/Galois gap (the two legs that *do* share a `γ` under-approximation, per Quine) is a **real mathematical object**, but the math it needs already exists (Cousot abstract non-interference + GHL; Rittel/Loregian). If the dispatch system ever wires this into an agent kernel, build it citing Cousot + Gaboardi et al. (findings "2-leg salvage"; Loregian)

---

## 5. Rejected alternatives (and what killed them)

1. **The 3-way unification as a live open aim** — rejected: the terms are equivocal (a pun, Quine) and the I/O-leg functor is *obstructed by a missing carrier*; the frame's math already lives under graded fibrations (GHL) and Galois connections (Cousot). Not open — treat the three borders separately. (Quine; Rittel; Loregian)
2. **C3 — split = schema→instance / energy→info residue** — rejected *at authoring* (Shannon): crosses a feasibility/deny-boundary residue to an FF-translation-loss residue with no adjunction, no unit/counit; the collapse-test fires immediately. (findings C3; Shannon)
3. **A "shared collapse-test" as evidence of one object** — killed by Taleb: the shared `classify(content)` is a *floor* both legs reach independently (Volpano–Smith); coincidence-at-the-floor is the cheapest possible "unification" (spam filtering shares it too). The unification "buys a slogan, not a theorem." (Taleb)

---

## 6. Open questions

One genuine crack is *watched*, with its reversal test bound inline (per the keystone-collapse-test rule); two residual cautions are registered.

### 6.1 The one reversal collapse-test — machine-checked graded-fibration composition (WATCHED, not planned)

The **only** fact that would reverse the auditor's KILL (Loregian collapse-test): a dedicated precedent search finding **zero** prior work on **machine-checked** graded-fibration composition — the *executable Lean instance* for agent secrets/policies, not the abstract theory. The GHL/Cousot references are pen-and-paper; a Lean theorem on cross-layer policy composition that is **not flattenable** sits exactly there. The permission-kernel's **`decidePolicy_append_allow` / `layered_not_flattenable`** (`AgentPermissionKernelComposition.lean` / `AgentPermissionKernelAlgebra.lean`, both confirmed present in-repo) are that machine-checked piece. **Bound collapse-test (the fact that zeroes even this):** if any prior machine-checked graded-fibration composition for policy/IFC is found, OR if `layered_not_flattenable` reduces to flattening each layer separately, the crack closes to zero. This is a watched crack, not a build plan; no precedent search is commissioned by this discovery. (Loregian collapse-test; findings §L4)

### 6.2 Safe-RL leg has no repo Lean term (registered)

Taleb: the safe-RL feasible-set fiber is **empty** in-repo — no Lean term, no cited owner in the candidate. Any future attempt to populate it must supply an actual base-change morphism that *transports-and-surprises* (proves a non-obvious truth about a populated fiber), not merely coincide-at-the-floor. Registered as the obstruction, not a task. (Taleb "leg three is worse")

### 6.3 The I/O leg's missing carrier (registered)

Quine: the I/O leg's "semantic body" is not a predicate over a comparable carrier but an *unmodeled process*; there is no monotone map from typed tokens to reasoning-quality, so the right adjoint cannot be written. The functor is **un-buildable as stated** on this leg. This is a definitional obstruction, not an open problem to be solved by effort. (Quine collapse-test)

---

## 7. Path to spec

Where each codified outcome lives — no spec drafted here.

| outcome | house | vehicle |
|---|---|---|
| ADOPT the two-layer architecture (§4.1) | dispatch-system kernel design notes | cite Sha 2001 / RTA + Saltzer/Schneider/safe-RL on use |
| 2-leg Galois salvage, if ever built (§4.3) | agent-kernel engineering | cite Cousot POPL 2014 + Gaboardi et al. ESOP 2021 |
| 3-way unification (§4.2) | findings ledger | recorded as does-not-hold; not reopened |
| reversal crack (§6.1) | watched-cracks register | a precedent search, if ever run, re-runs the Rittel gate against GHL/Cousot first |

The operational instruction is one line: **adopt the layering, cite the references.**

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `formalization/certifier-judge-separation/research/findings.md` | `derives-from` | Source of truth. Every decision here codifies the UNIFICATION VERDICT, the L2/L4 gate matrix, or a named candidate (C1/C2/C3). |
| `formalization/certifier-judge-separation/agents/01-explorer-simon.md` | `cites` | SI1/SI2/SI3 repo recurrence + the Dissent that recurrence ≠ one-object. |
| `formalization/certifier-judge-separation/agents/02-explorer-ashby.md` | `cites` | AS1–AS11 literature on the split; the incommensurability Dissent. |
| `formalization/certifier-judge-separation/agents/04-skeptic-rittel.md` · `05-skeptic-taleb.md` · `06-skeptic-quine.md` · `07-auditor-loregian.md` | `cites` | The three independent kills + the auditor verdict and the bound reversal collapse-test. |
| `domainspec-lean-formalization: AgentPermissionKernelEgressBypass.lean` | `cites` | `bash_egress_bypass` / `isEgress_bash_false` — the already-fired collapse-test for the adopted split (§4.1). |
| `domainspec-lean-formalization: AgentPermissionKernelComposition.lean`, `AgentPermissionKernelAlgebra.lean` | `cites` | `decidePolicy_append_allow` / `layered_not_flattenable` — the watched reversal crack (§6.1). |

**Edge regime:** `findings.md` carries the inverse `derives` (written inside the dispatch's own write-window). The `agents/*.md` and the Lean files are `cites` forward-only — frozen dispatch returns and a separate Lean repo, both immutable-on-persist; appending a `## Connections` block to them would violate the persistence discipline.
