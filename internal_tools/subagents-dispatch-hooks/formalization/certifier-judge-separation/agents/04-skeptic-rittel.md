## 04 — Rittel — precedent-kill (round 1)

> Persisted by parent: read-only agent; content verbatim below.

**Precedent sweep: the prior art for both candidates, as technical references.**

**C1 — the SPLIT ("prove the inner certifier, leave the outer optimizer unproved inside the certified feasible set")**

- **Closest architectural antecedent:** **Sha, "Using Simplicity to Control Complexity," IEEE Software 2001 — the Simplex architecture.** A verified-safe baseline controller + a decision module that lets an *unverified high-performance controller* act freely *as long as the state stays in the certified safe set*. This is the split, verbatim, decades before safe-RL. Generalized as **Run-Time Assurance (RTA)** — Hobbs et al., arXiv:2110.03506. https://arxiv.org/pdf/2110.03506
- Saltzer 1984, Schneider 2000, and the safe-RL ≥5 threads are co-antecedents; the **CBF safety-filter** ("minimally modify a nominal controller to stay in the safe set") is the same object in control form.

**C2 — the UNIFICATION (security CERTIFIED/ASSUMED border = I/O envelope/epistemic-body cut = safe-RL certified-feasible-set, all ONE fibered residue functor)**

- **What no precedent supplies:** no published theorem names *those exact three legs* as instances of one fibered residue functor. Empty result on the specific named object.
- **Categorical frames that already co-locate the legs:**
  1. **Graded Hoare Logic** — Gaboardi, Katsumata, Orchard, Sato, ESOP 2021 (arXiv:2007.11235): one categorical structure (**graded Freyd categories + coherent fibrations**) instantiating cost, probabilistic-distance, **differential privacy**, and — via the **graded-comonad/coeffect IFC** line (Petricek–Orchard–Mycroft) — **information-flow security**, as instances of one graded-fibrational object. "A single fibered residue functor governing multiple certified analyses" is precisely this. https://arxiv.org/pdf/2007.11235
  2. **Abstract interpretation / Galois connections** — Cousot, "A Galois Connection Calculus for Abstract Interpretation," POPL 2014; **"abstract non-interference"** parameterizes noninterference by abstract interpretation, unifying **security + safety-analysis** under one Galois-connection frame independently of grading. https://cs.nyu.edu/~pcousot/publications.www/CousotCousot-POPL14-ACM-p2-3-2014.pdf
- **Consequence:** the moment the functor is exhibited it lands inside graded-fibrational or Galois-connection territory that already carries security and safety as instances. The unification is undemonstrated and open.

**Security-tower anchor.** `SECURITY-TOWER.md` types the kernel as engineering on the reference-monitor (Anderson 1972) + Simplex foundations; the CERTIFIED-vs-ASSUMED border is C2's leg-1. The tower passes without needing the C2 unification.

**Dissent:** the three legs are already co-located under graded fibrations (GHL) and Galois connections (abstract non-interference); the unexhibited functor is the only thing between C2 and a buildable engineering construction. If a functor is ever drawn, re-run this gate against Gaboardi–Katsumata–Orchard–Sato. C1 reduces to Simplex/RTA. C2 remains open positioning until a functor is built.

```
candidate: C1 | gate: precedent-sweep
  evidence: Sha 2001 Simplex + RTA arXiv:2110.03506; Saltzer 1984, Schneider 2000, safe-RL/CBF co-antecedents
candidate: C2 | gate: precedent-sweep | status: open (frame available)
  evidence: no named Certified-Feasible-Set Theorem; unification FRAME available via Graded Hoare Logic
  (Gaboardi-Katsumata-Orchard-Sato ESOP 2021) + abstract non-interference / Galois (Cousot POPL 2014)
  note: exhibiting the functor lands inside graded-fibrational/Galois territory that already carries
  security+safety as instances; undemonstrated until then.
```
