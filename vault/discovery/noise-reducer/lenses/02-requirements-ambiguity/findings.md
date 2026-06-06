---
tags: [vault, findings, noise, noise-reducer, requirements]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
dispatch_status: historical
version: 0.1.0
last_updated: 2026-06-05
lens: requirements-ambiguity
verification: [web-fetched: arXiv:1609.04886 abstract+claim; web-searched: Boehm phase-ratio figures, secondary defect-origin statistics; model-recall: Boehm primary text, IEEE 830 ambiguity criterion]
---

## Objective

Establish from software/requirements engineering that specification ambiguity is the dominant and most expensive defect source — and honestly mark which of the canonical cost figures are well-supported versus folklore.

## Findings

The discovery's central claim has an economic backbone: the cheapest place to remove a defect is before it propagates. In requirements engineering this is the oldest result in the field, and also one of the most over-quoted. The honest version is narrower than the slogan.

**Boehm's cost-of-change curve — what is actually supported.** Barry Boehm's *Software Engineering Economics* (Prentice Hall, 1981) reported that the relative cost to correct a defect rises across lifecycle phases. The phase ratios usually attributed to that data are roughly **Requirements 1 : Design 5 : Code 10 : Test 50**, escalating toward **~100×** post-delivery on large systems (verified via multiple secondary restatements; the primary table is model-recalled).

Three honesty flags on that curve:

1. **The 1:100 figure is project-size-conditional, not universal.** Boehm's own data show the curve is steep only on *large* waterfall projects (TRW/IBM, 1970s). On small projects the spread is closer to **1:4**. Quoting "100×" without the size condition is folklore.

2. **The curve is a waterfall-era artifact.** It was measured on sequential projects where phases were temporally separated. The mechanism — a requirements error survives undetected through design, code, and test, accreting dependent work — is real, but the *magnitude* is an artifact of how long the error stayed hidden, not an intrinsic property of "requirements defects."

3. **The exponential shape is empirically contested.** Menzies et al., *"Are Delayed Issues Harder to Resolve? Revisiting Cost-to-Fix of Defects throughout the Lifecycle"* (arXiv:1609.04886, 2017), analyzed 171 projects and found **"no evidence for the delayed issue effect"** — later-phase fixes were not consistently or substantially costlier. They argue the curve "might be a historical relic that occurs intermittently only in certain kinds of projects." (Verified: fetched abstract.)

So the strong claim — "defects always get exponentially more expensive" — does not survive scrutiny. The defensible claim is weaker and sufficient: **a requirements/specification error is uniquely positioned to propagate into all dependent downstream work, and when it does propagate undetected, rework is disproportionately large.** It is the *propagation surface*, not a fixed multiplier, that makes upstream noise expensive. Only the **direction** of the cost curve survives, not the number.

**Ambiguity as the root, and the project-failure attributions.** Requirements engineering distinguishes ambiguity, incompleteness, and inconsistency. Ambiguity — a single specification admitting multiple readings — is singled out because IEEE 830 makes "unambiguous" an explicit quality criterion (model-recall) and because ambiguous requirements pass review *looking* complete while encoding divergent intent. The cost is realized later, when the divergence surfaces as built-wrong work.

The widely-circulated attributions are **directionally consistent but weakly traceable**, flagged as such:

- "**56% of defects originate in requirements**" — attributed to IBM; found only secondhand, never anchored to a primary IBM report. Treat as folklore-grade.
- "**~80% of project failures stem from requirements issues**" — attributed to Standish CHAOS. CHAOS reports are real but their methodology is contested, and this exact percentage is a paraphrase that varies by retelling. Treat as indicative, not authoritative.
- "**Poor software quality cost US businesses $2.41T (2022)**" — CISQ; this one is traceable to a named CISQ report, though it bundles far more than requirements defects.

What survives the honesty filter: across decades of RE literature the *consensus direction* is robust even where the *numbers* are not — requirements problems are repeatedly the largest single category of avoidable rework, and they are systematically under-detected at the time they are cheapest to fix. The economic case for an upstream gate rests on the direction, not on any single multiplier.

**Mapping to the agent.** The human–agent interface is a requirements-elicitation channel. A misread goal is a specification defect, and an agent amplifies the waterfall mechanism: it does not pause between "phases," so a misread intent propagates into design, code, and tests within a *single uninterrupted run*. The propagation surface that made requirements errors expensive in 1981 is, if anything, larger — the agent executes the full downstream chain before a human inspects it.

This is the economic argument for standing instructions that force the agent to be precise, ask, and challenge *before the first action*: they are cheap insurance against the one defect class with the widest propagation surface. Per the subset rule, the claim must stay at "widest propagation surface, under-detected when cheapest," not the contested "always 100×."

**Where cheap insurance turns into manufactured agreement (tension with lens 03).** Lens 03 (LLM sycophancy) holds that the agent's *own* elicitation can inject noise. The two lenses meet at a threshold, and the boundary is conceded explicitly.

Aggressive elicitation is cheap insurance **only while each question reduces the residual ambiguity in the specification.** It stops being cheap and starts manufacturing false agreement at the point where:

- questions become **leading** ("You want X, right?") — confirmation-seeking rather than ambiguity-resolving, which encodes the agent's guess as if it were the human's intent;
- elicitation **volume** is optimized instead of ambiguity *reduction* — more questions past the point of diminishing information add friction and train the human to rubber-stamp;
- the human's answers are **low-information** (fatigue, deference) yet recorded as authoritative — the gate now launders noise into the spec under a veneer of consent.

The clean criterion: an elicitation move is cheap insurance iff it strictly lowers the entropy of the specification *as the human actually intends it*; it is manufactured agreement iff it lowers apparent uncertainty while leaving — or increasing — the gap between the recorded spec and true intent. "Elicit more, earlier" is correct up to that entropy-reduction frontier and wrong past it. Lens 03 owns the failure mode past the frontier; this lens owns the economics before it.

## Caveats

This lens establishes the *direction* of the economic argument, not the magnitudes. Verification limitation, by figure:

- The canonical **1:100** cost curve is project-size-conditional, waterfall-era, and empirically contested (Menzies 2017, arXiv:1609.04886, fetched). It is cited only as folklore-flagged context, never as proof; only the direction survives.
- The **56%** defect-origin figure (attributed to IBM) is folklore-grade — found only secondhand, never anchored to a primary report.
- The **~80%** project-failure figure (attributed to Standish CHAOS) is indicative, not authoritative — a paraphrase that varies by retelling, against a contested methodology.
- The **$2.41T (2022)** CISQ figure is traceable to a named report but bundles far more than requirements defects.

What is load-bearing — and what survives honest verification — is the qualitative claim: specification/requirements ambiguity has the widest downstream propagation surface and is systematically under-detected when correction is cheapest, which is the economic case for an upstream human–agent gate.

This lens does **not** establish that aggressive elicitation is always beneficial; that boundary is ceded to lens 03, and the entropy-reduction threshold above marks the handoff. No claim here is anchored to a Lean artifact in this repo; it is requirements-engineering context for the discovery, not a formal result.

## Connections

- `synthesized-by` → [[../../research/research.md]]
