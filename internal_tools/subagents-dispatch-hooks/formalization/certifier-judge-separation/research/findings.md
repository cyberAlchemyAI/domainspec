---
profile: research-security
name: "Certifier/Judge separation — prove the inner boundary, leave the outer optimizer soft"
description: "Synthesis (writer Shannon) from two explorer returns (Simon: repo-internal 3x recurrence; Ashby: external literature across >=5 threads) on the certifier/judge separation pattern as an engineering principle."
node_type: finding
type: finding
layer: domain
nature: synthesis
version: 0.1.0
last_updated: 2026-06-13
closure_ref: "domainspec-lean-formalization: AgentPermissionKernelEgressBypass.lean (bash_egress_bypass, isEgress_bash_false); research-security/SECURITY-TOWER.md (CERTIFIED-vs-ASSUMED ledger, rung-5 collapse-test)"
tags: [research-security, certifier-judge, safe-rl, typed-residue, separation-principle]
---

# Certifier/Judge separation — the engineering principle

> Writer: Shannon (read-only; parent-persisted). Synthesis of explorer returns
> (Simon: repo-internal; Ashby: external literature). The L2 skeptic gates (Rittel / Taleb / Quine)
> stress-test the cross-domain unification below.

## C1 — The certifier/judge split as an engineering principle

**Statement.** For an agent factored into an inner decision procedure and an outer optimizer: if
the inner procedure is a decidable predicate over a finite structured type whose `allow` provably
satisfies a relational safety spec, then the outer optimizer may run unproved inside the allow-set,
and the system's safety reduces to (certifier soundness) ∧ (the optimizer cannot act except through
the certifier). The residue is exactly the second conjunct — the trusted border the certifier does
not reach.

- **Repo anchor.** `AgentPermissionKernel.lean` (`decidePolicy`, `decidePolicy_sound`); the
  CERTIFIED-vs-ASSUMED ledger in `SECURITY-TOWER.md:132–146` is this principle instantiated once
  (Simon SI1).
- **Technical references.** Schneider 2000 security automata; Saltzer 1984 mechanism/policy
  separation; reference monitor (Anderson 1972).
- **Collapse-test (inline).** If "the optimizer cannot act except through the certifier" fails — the
  optimizer reaches a sink the certifier does not catalogue — the certifier buys zero safety for
  that path. **Not hypothetical: it is `bash_egress_bypass`** (`AgentPermissionKernelEgressBypass.lean`),
  a machine-checked negative where a tainted session exfiltrates via `.bash` because `isEgress`
  enumerates only `.webFetch`. The principle's content is entirely in the border ledger: the
  certifier is only as good as the completeness of the sink catalogue it guards.

## C2 — The certifier/judge boundary across domains (one typed-residue object?)

**Statement.** The CERTIFIED-vs-ASSUMED border (security), the
envelope-vs-free-epistemic-body cut of the I/O discovery (Simon SI3), and the safe-RL
certified-feasible-set may be **the same typed-residue object**: in each, a decidable/structural
certifier over a finite type forces an `allow`-region, and the residue is the *typed gap between a
syntactic/structural predicate and a semantic/intentional one* — `classify(content)`,
`quality-of-reasoning`, `the true safe set`. The proposal: these are instances of one fibered residue
functor, so a single collapse-test governs all three.

- **Repo anchor.** SI1 `SECURITY-TOWER.md` rung-5 collapse-test (→ `classify(content)` oracle); SI2
  `AgentPermissionKernelEgressBypass.lean` (`bash_egress_bypass`); SI3 the I/O-discovery KILL #6 —
  conceptual only, no single Lean file (an anchor weakness).
- **Collapse-test (inline, LETHAL — currently FIRES).** If the three residues are typed in formally
  incommensurable categories — security taint as a path-prefix lattice, I/O body as an
  epistemic-quality order, safe-RL as a Lyapunov/CBF sublevel set — with no exhibited
  witness-preserving functor between them, then "one object" is informal synthesis, not a typed
  claim, and C2 contributes zero. This is **Ashby's incommensurability dissent, unrefuted**: shielding
  (LTL), CBF (Lyapunov), ModelPlex (dL), predictive filters (MPC) are formally incommensurable. Simon
  concedes he can show recurrence but cannot prove one-object-vs-three. No functor is built; SI3 has
  no Lean anchor.
- **Status.** The cross-domain unification is **not demonstrated** — a working aim, not a result.

## C3 — split = schema→instance / energy→info residue (REJECTED at authoring)

Rejected: this crosses from a *negative/feasibility* residue (certifier proves a deny/confine
boundary) to a *translation-loss* residue (FF-failure between adjoint legs). The collapse-test fires
immediately — the security residue is an operational assumed-border with no adjunction, no
unit/counit, no FF-measurement. Forcing the identity is the "vacuous analogy" Ashby warns of, one
register out. Do not pass downstream.

## UNIFICATION VERDICT

**The boundary is, on current evidence, NOT demonstrably one typed object — the unification is OPEN.**

1. **C1 (the split) is a sound engineering principle**, instantiated in the repo and matched by ≥5
   literature threads (shielding, CBF-QP filter, ModelPlex, predictive safety filter, security
   automata). The collapse-test already fired in-repo as `bash_egress_bypass`.
2. **The collapse-test for the cross-domain unification (C2):** exhibit a witness-preserving functor
   unifying the security taint-lattice, the I/O epistemic-quality order, and the safe-RL feasible
   set; without it, "one residue" is analogy, contributing zero. No such functor is built; SI3 lacks
   even a Lean anchor. The unification remains an **aim**.

## One-line goal answer

*"Prove the certifier, not the judge" is a sound engineering principle (Saltzer/Schneider/safe-RL,
≥5 threads); its unification into one typed-residue object across security / I-O / safe-RL is
genuinely OPEN — undemonstrated — and collapses to cross-domain analogy the moment one asks for the
witness-preserving functor that no one, here or in the literature, has exhibited.*

## L2 skeptic gates + L4 auditor (Loregian) — definitional analysis of the unification

The three gates confirm the cross-domain unification fails three independent ways (false-consensus
flag does NOT fire):

| candidate | precedent (Rittel) | non-vacuity (Taleb) | definitional (Quine) |
|---|---|---|---|
| C1 split | Sha 2001 Simplex + Run-Time Assurance + Saltzer/Schneider/safe-RL — settled engineering | settled tool | settled tool |
| C2 3-way unification | Graded Hoare Logic (Gaboardi et al. ESOP 2021) + Cousot abstract non-interference / Galois (POPL 2014) provide the categorical frame | the "shared collapse-test" `classify(content)` is a shared floor (Volpano–Smith): legs collided at the bottom, not unified at the top | "gap" equivocates (oracle ≠ category ≠ containment); a pun, not a type; the 2-leg Galois rescue fails on the I/O leg (no monotone adjoint) |

**2-leg salvage (security + safe-RL Galois gap):** Quine fenced it as possibly genuinely-open; the
frame is provided by Cousot/GHL. A real mathematical object (a Galois connection / graded fibration),
buildable as engineering — cite Cousot + Gaboardi et al.

**Auditor's reversal collapse-test:** a **machine-checked** graded-fibration composition — the
executable Lean instance for agent secrets/policies, not the abstract theory — would be a distinct
engineering target. The permission-kernel's `decidePolicy_append_allow` / `layered_not_flattenable`
(the not-yet-mechanized cross-layer composition piece) sits exactly there. **exit_reason: resolved.**
