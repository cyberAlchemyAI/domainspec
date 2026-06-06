---
tags: [vault, findings, noise, noise-reducer, kahneman, decision-hygiene]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
dispatch_status: historical
version: 0.1.0
last_updated: 2026-06-05
lens: judgment-noise-kahneman
verification: ["web-fetched: Wikipedia entry (bias/noise types, decision hygiene, MAP, error decomposition)", "web-search: McKinsey + behavioral summaries (occasion/level/pattern noise)", "model-recall: error equation MSE = Bias² + Noise², noise-audit methodology"]
---

## Objective

Define noise *as a judgment phenomenon* (Kahneman et al.) and translate the book's decision-hygiene practices into the standing-instruction discipline the discovery claims as its first noise gate — while flagging that this "noise" may not be lens 05's Shannon noise.

## Findings

### The load-bearing distinction: bias vs. noise

Kahneman, Sibony & Sunstein (2021) separate two failure modes of judgment. **Bias** is systematic error — the average of errors points in one direction (the scale that always reads 2kg heavy). **Noise** is *unwanted variability* in judgments that *should be identical* — the scatter, not the shift. Their shooting-range image is exact: bias is a team whose shots cluster off-center; noise is a team whose shots scatter across the target. Crucially the book frames total error as a decomposition — recalled as **MSE = Bias² + Noise²** — so the two contribute *independently*, and noise is typically the larger, more-ignored term (verified via the Wikipedia entry and McKinsey's summary; the precise algebraic form is model-recall).

The book's three components (verified):
- **Level noise** — stable between-judge differences in average severity (one grader is just harsher).
- **Pattern noise** — a judge's idiosyncratic *reaction to specific cases* (a particular grader is unusually soft on *this kind* of essay); empirically often the largest term.
- **Occasion noise** — the *same* judge, *same* case, *different answer* on a different occasion: mood, fatigue, ordering, what came before.

The deepest point for this discovery: **noise is invisible from a single judgment.** Bias you can sometimes spot against a known truth; noise only appears when you have *multiple judgments of the same case*. You cannot see it from the inside.

### Mapping to the human-agent interface

The discovery treats the human-agent interface as the first, least-recoverable noise gate. Under Kahneman's frame, that interface is a **judgment channel**, and the agent is a second judge whose output co-varies with the user's input. This licenses a precise, *non-metaphorical* reading of three failure modes:

- The user's **occasion noise** (today's framing, mood, what they read last) is injected directly into the spec. An agent optimizing *agreement* (sycophancy) *amplifies* occasion noise: it mirrors whatever variability the user brought. An agent optimizing *volume* adds its own pattern noise (idiosyncratic over-elaboration). Either way variance goes *up*.
- The standing instruction "be precise, ask, challenge" is, in Kahneman's vocabulary, **decision hygiene**: a *preventive* protocol that reduces variability *before* judgment is recorded — the handwashing analogy, named exactly so in the book. It does not chase a known-correct answer (that would be debiasing); it suppresses scatter.

This is the lens's strongest contribution: it gives the discovery's claim a *defined* sense in which the gate is "least-recoverable." Occasion/pattern noise injected at spec time is *invisible downstream* — no later method sees the counterfactual judgments that would have revealed the variance. That is a sharper claim than "errors compound": it is that the *evidence of the noise* is destroyed at the gate.

### Decision-hygiene practices → standing instructions

The book's practices (verified via Wikipedia/McKinsey), retyped as interface rules:

1. **Independent judgment before aggregation.** Kahneman: collect estimates *independently*, then aggregate, so judges don't anchor on each other. Interface form: the agent should produce its own read *before* absorbing the user's preferred conclusion — "state your read of the underlying goal, then ask if it's right" (already this repo's Trigger 3). An agent that leads with agreement has aggregated *before* judging independently; that is the sycophancy failure stated precisely.
2. **Structured / sequenced information.** Kahneman: withhold non-essential, correlation-inducing information until needed; decompose the judgment. Interface form: standing instructions that force the agent to *ask* rather than infer sequence the information intake instead of letting one early frame contaminate the whole spec.
3. **Mediating Assessments Protocol (MAP) / decomposition.** Kahneman: break a global judgment into independently-assessed sub-dimensions, score each on a relative scale, combine late. Interface form: "challenge / surface assumptions" is decomposition applied to a spec — separating the claim from its support so each is assessed on its own, which is exactly this repo's subset rule (claim ≤ proof) in psychological dress.

Note the *failure direction* each rule guards: hygiene that optimizes **agreement** collapses (1) — it re-couples the judges. Hygiene that optimizes **volume** violates (2)/(3) — it adds unstructured information and pattern noise. The discovery's "degrades into sycophancy or friction" is precisely these two hygiene practices failing in opposite directions.

### Category distinction: Kahneman-noise ≠ Shannon-noise

I must flag this directly. Lens 05 defines noise **information-theoretically** — Shannon entropy, channel capacity, corruption of a transmitted *signal* against a *known reference distribution*. This lens defines noise **psychologically** — unwanted *variability across judgments that should agree*, with *no reference signal required*. **These are not obviously the same object, and conflating them is a category error.**

- Kahneman noise is a property of a *population of judgments*: it needs no "true message," only the premise that the cases *should* yield the same answer. It is measured as variance.
- Shannon noise is a property of a *channel*: it presupposes a sender, a code, and a ground-truth signal; it is measured against transmitted information.

The overlap is real but partial: both treat unwanted variability as costly and both motivate *redundancy/aggregation* as a remedy (independent judgments ≈ repetition codes). But the discovery's *spec-noise* claim leans on the **Kahneman** reading, not the Shannon one — because at the human-agent interface **there is no ground-truth signal being transmitted.** The user does not *have* a fully-formed correct spec that gets corrupted in transit; the spec is *being constructed in the act of judgment*. So what the gate reduces is *judgment variability*, not *channel error*. Lens 05's frame correctly licenses the *downstream* claim (once a spec exists, later stages are channels relaying it); it does **not** license the *upstream* claim that the interface is the first gate — that part is psychological, and only this lens supplies it. Whoever synthesizes must not silently treat "noise" as one quantity across the two lenses.

## Caveats

This lens establishes only that *if* noise is read psychologically (judgment variability), the human-agent interface is a judgment channel where decision hygiene applies and where occasion/pattern noise is injected invisibly — which gives the discovery's "first, least-recoverable gate" a defined meaning. It does **not** establish that this is the *only* or *largest* source of spec error, nor that standing instructions measurably reduce variance (no audit data here — the book's own method requires *multiple judgments of the same case* to even see noise, which we have not run on agents). The error-decomposition formula **MSE = Bias² + Noise²** is model-recall, not re-verified. And it explicitly does **not** unify with the Shannon-noise lens: the equivalence is unproven and is named here as a category risk, not a result. Anyone citing this against lens 05 must keep the two "noises" typed-distinct until a bridge proves otherwise.

## Connections

- `synthesized-by` → [[../../research/research.md]] (forward-in-time: cross-lens synthesis consolidates this lens)
