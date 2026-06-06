---
tags: [vault, findings, noise, noise-reducer, skeptic]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
dispatch_status: historical
version: 0.1.0
last_updated: 2026-06-05
lens: skeptic
verification: [local-files-read, model-recall, web-fetched]
---

## Objective
Attack the claim that the human–agent interface is the first, least-recoverable noise gate, and decide whether it survives as a finding or demotes to consolidation of already-owned prior art.

## Findings

### Attack 1 — Precedent-kill

Each clause of the claim has a named owner, and the conjunction is also owned.

- **"Be precise, ask, challenge" as the upstream discipline** is Horvitz, *Principles of Mixed-Initiative User Interfaces* (CHI 1999): when the agent cannot infer intention with confidence, it opens a dialogue rather than acting — "scoping precision to match uncertainty," asking at low confidence, acting at high. That is the discovery's "force the agent to ask," published 27 years ago, with a richer mechanism (a cost/benefit decision rule for *when* to ask, which the discovery lacks).
- **"Challenge, don't agree"** is Kim Scott, *Radical Candor* — already cited by name in this repo's own CLAUDE.md line 3. The discovery cannot claim the partner-mandate as novel against a source the project already imports.
- **"Optimizing agreement degrades into sycophancy"** is the RLHF-sycophancy literature (Anthropic 2023, *Towards Understanding Sycophancy*; surveys at arXiv 2411.15287, 2602.01002): reward models prefer responses matching user beliefs over true ones; agreement-optimization is a known failure mode with a known cause. The discovery's "degrades into sycophancy if it optimizes agreement" is a one-line restatement.
- **"Upstream errors are least-recoverable / most expensive"** is the Boehm cost-of-change curve and requirements-engineering ambiguity literature: requirements defects cost 60–100× more downstream, ambiguity "seeps into later stages." Owned since the 1980s.

**Internal precedent is the fatal one.** CLAUDE.md *already operationalizes the entire claim* as standing instruction (system prompt, not memory): line 3 "partner, not executor… Radical Candor… refuse to inflate"; lines 11–21 the Stop-and-Question triggers ("Claim > Proof?", "Underlying goal? … ask 'is this right?'"). The discovery's "standing instructions that force an agent to be precise, ask, and challenge" is a description of CLAUDE.md, not a discovery beyond it. Per the cite-don't-rediscover rule, restating an existing mandate under a new word is not a finding.

**Collapse-test (precedent):** If no clause survives as residue beyond {Horvitz, Scott, RLHF-sycophancy, Boehm} ∪ CLAUDE.md, the discovery is a citation, not a finding. It nearly fails this test.

### Attack 2 — Vacuity

"Noise" is doing illegitimate work. The frame names at least four things — specification-noise, sycophancy-noise, deductive-noise, variance — all "noise." If every defect along the pipeline is "noise," the word is a metaphor that partitions nothing: it cannot be falsified because nothing can fail to be noise.

Force the definition. A usable definition would be information-theoretic: noise = the component of the agent's output uncorrelated with (or actively diverging from) the operator's *true* intent, as distinct from signal = the component that tracks it. Under that definition something *can* fail to be noise — e.g., a correct refusal, or friction that surfaces real intent, is signal even though it is "unwanted" by the operator in the moment. But the claim does not supply this definition; it leans on the colloquial "bad stuff upstream." Until the discovery defines noise so that some unwanted-by-operator outputs are *not* noise, the frame is unfalsifiable relabeling. **This is a recoverable defect** (write the definition), but it is currently unmet.

### Attack 3 — Boundary / backfire

**(a) Sycophancy paradox — the mandate can maximize the noise it targets.** An instruction phrased as "help the business reach its best outcome" is a gradient toward agreement; the noise-reducer mandate, if optimized for *perceived helpfulness*, becomes a sycophancy generator. The discovery concedes this ("degrades into sycophancy"), which means its own mechanism contains the failure — the gate is not self-stabilizing. A claim whose stated mechanism can invert its own sign is weak as a placement claim.

**(b) Friction cost.** Forcing questions has a real cost (latency, operator annoyance, over-elicitation on trivial tasks). Horvitz's *contribution* over the discovery is precisely the missing piece: ask only when expected value of asking > expected cost. The discovery asserts "always be precise/ask/challenge" with no cost gate; CLAUDE.md trigger 3 even scopes itself to "any non-trivial task," which is *more* careful than the discovery's blanket claim.

**(c) "Least-recoverable upstream" — the load-bearing claim, and it is false as stated.** Science recovers from bad initial hypotheses constantly: replication, peer review, adversarial collaboration, and red-team layers (this very dispatch) are downstream mechanisms that recover from bad upstream questions. The repo's own `anti-bias-vector-composition/principle.md` is a *downstream* recovery mechanism — tensioned skeptic/evaluator layers exist precisely to catch a bad upstream framing. So the repo already contains a counterexample to "no downstream method can remove it." The honest claim is narrower: specification noise is *more expensive* to remove downstream (Boehm), not *impossible* — "least-recoverable" is inflation of "most expensive," and the difference is the whole placement argument. This is the strongest attack: the discovery's distinctive headline ("least-recoverable, no downstream method can remove") is the one part not licensed by any source and is contradicted by a sibling file in the same vault.

### Verdict
**Demote.** The claim does not survive as a novel finding. Three of four clauses are owned externally (Horvitz, Scott, RLHF-sycophancy, Boehm) and the whole conjunction is already operationalized internally by CLAUDE.md. The distinctive headline clause — "least-recoverable, no downstream method can remove" — is both inflated (over "most expensive") and contradicted by the vault's own anti-bias downstream-recovery layer. Demote to: **"Consolidation of CLAUDE.md's existing partner-mandate under a noise-reduction frame, citing Horvitz / Scott / RLHF-sycophancy / Boehm — with the placement weakened from *least-recoverable* to *most-expensive-to-recover*."** That consolidation is a legitimate vault artifact (it ties scattered prior art to the repo's standing instructions) but it is a citation-organized note, not a discovery.

### Collapse-test
If "noise" is given an information-theoretic definition under which some operator-unwanted outputs are *signal*, AND a typed residue is named that is absent from {Horvitz, Scott, RLHF-sycophancy, Boehm, CLAUDE.md}, the demotion lifts. Absent both, contribution is zero beyond citation.

### Surviving contribution
The only residue that survives all three attacks: the *unification* — observing that requirements-engineering's cost curve, HCI's mixed-initiative dialogue, the RLHF-sycophancy failure mode, and Radical Candor are four views of one quantity (operator-intent fidelity at the human–agent boundary), and that CLAUDE.md is an instance of all four. That synthesis is worth recording as a cite-bundle. The placement claim ("first/least-recoverable gate") does not survive and must be demoted to "most expensive to recover downstream."

## Caveats
- This attack does **not** establish that the unification cite-bundle is worthless; it survives as a legitimate (citation-organized) vault artifact.
- It does **not** establish that the vacuity defect (Attack 2) is fatal — it is flagged as *recoverable* if an information-theoretic noise/signal definition is supplied.
- It does **not** refute the narrowed placement ("most expensive to recover downstream," Boehm); only the inflated form ("least-recoverable / no downstream method can remove") is refuted.
- Verification: CLAUDE.md and `anti-bias-vector-composition/principle.md` were read as local files; external precedents (Horvitz, Scott, RLHF-sycophancy surveys, Boehm cost curve) were web-fetched and/or model-recalled, not independently re-derived.

## Connections
- `synthesized-by` -> [[../../research/research.md]]
