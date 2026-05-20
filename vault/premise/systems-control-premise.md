---
tags: [systems, control-theory, feedback, drift, telemetry]
node_type: premise
layer: ontology, architecture
nature: explanatory
status: draft
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-05-19
is_session: false
---

# Premise — Software delivery is a control system

> Software delivery is a control system with feedback loops; drift is detectable and must be measured, not predicted. This is the load-bearing claim of L1 (Systems & control theory) in `vault/foundational-knowledges.md`.

---

## Objective

DomainSpec models the pipeline that turns intent into running code as a **control system**, not as a one-shot transformation. Inputs (specs, decisions, premises) feed a chain of stages; each stage emits observable outputs; deviations between expected and observed outputs constitute **drift**. The premise commits to two coupled positions: (a) the right way to govern delivery is closed-loop control with explicit feedback, not open-loop prediction of where the system *should* end up; and (b) the right way to detect drift is **measurement at the stage boundaries** rather than inference from end-state code. The TUNING-LOOP, GOVERNANCE-ATTENUATION, and DRIFT-CONVERGENCE artifacts all derive from this commitment.

---

## Why it is load-bearing

If software delivery is *not* usefully modeled as a control system, then:

- `DRIFT-CONVERGENCE.md` and `TUNING-LOOP.md` lose their organizing metaphor — they become arbitrary checklists rather than instances of a known class.
- `GOVERNANCE-ATTENUATION` collapses: attenuation only makes sense relative to a controller whose authority degrades when its signals weaken.
- The telemetry stack (`internal_tools/agents-telemetry/`) becomes incidental logging rather than the closed-loop feedback channel.
- The "measure don't predict" discipline (memory: epistemic honesty) loses its mechanical justification.

Layer L1 in the foundational map directly cites Meadows, Goldratt, and cybernetics; remove this premise and those citations decorate without supporting.

---

## What would falsify it

- A delivery pipeline run end-to-end with **no measurement at stage boundaries** that nonetheless produces lower drift than the same pipeline with the loop closed. (Would imply feedback is decorative.)
- Demonstration that *prediction* of end-state behavior from specs alone (without intermediate signals) consistently outperforms the measure-and-correct loop on real features. (Would imply open-loop is sufficient.)
- A case where drift is provably **undetectable** at any stage boundary — i.e., the system has hidden states no instrument can reach. (Would imply the "drift is detectable" sub-claim is false; controller still applies but governance loses traction.)

The first two are operationally testable with the existing telemetry; the third is a structural argument and the more dangerous failure mode.

---

## Confidence calibration

- **veracidade: high.** Control theory has 70+ years of empirical grounding outside software, and inside software the SRE / DevOps literature (error budgets, MTTR, deployment frequency as control variables) has accumulated direct evidence. The framing is well-established, not speculative.
- **convicção: high.** Even where the evidence is patchy in our specific repo, the alternative (predict-and-pray, open-loop delivery) has been observed to fail badly enough in adjacent settings that defending the closed-loop stance is unambiguous.

The two values agree here, which is the *typical* case for a well-grounded foundational premise. Divergence (e.g., `veracidade: low, convicção: high`) would be the signal that we are betting ahead of evidence — see `domainspec-premises.md` P-DS-3 for an example.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/foundational-knowledges.md` | `cited-by` | L1 (Systems & control theory) layer in the foundational map cites this premise as its load-bearing claim. |
