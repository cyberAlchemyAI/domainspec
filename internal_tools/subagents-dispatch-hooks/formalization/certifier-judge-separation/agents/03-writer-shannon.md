## 03 — Shannon — writer (round 1)

> Persisted by parent: read-only agent; per-agent writer record. Full finding in
> ../research/findings.md. Verified Simon's anchors directly (SI2 `bash_egress_bypass`,
> `isEgress_bash_false` confirmed verbatim; SI1 `SECURITY-TOWER.md:132–146` + rung-5 collapse;
> SI3 conceptual only — no Lean file, flagged as a C2 anchor weakness).

**C1 — split as principle.** A sound engineering principle (Saltzer 1984 / Schneider 2000 / safe-RL
≥5 threads). Collapse-test already fired in-repo as `bash_egress_bypass` (optimizer reaches an
uncatalogued sink) — the principle's safety is entirely in the completeness of the sink catalogue.

**C2 — one typed-residue object across security / I-O / safe-RL.** FAILS the demonstration test: no
witness-preserving functor unifies the three formally-incommensurable categories (path-prefix lattice
vs epistemic-quality order vs Lyapunov/CBF sublevel set). Ashby's incommensurability dissent stands;
Simon cannot prove one-object-vs-three; SI3 has no Lean anchor. Genuinely OPEN — a working aim, not a
result.

**C3 — split = schema→instance / energy→info residue.** REJECTED at authoring: feasibility-residue
(deny/confine boundary, no adjunction) ≠ FF-translation-loss residue. Collapse-test fires.

**Verdict:** the split (C1) is a sound principle; the cross-domain unification (C2) is open and
undemonstrated.
