---
tags: [vault, findings, noise, noise-reducer, mixed-initiative]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
dispatch_status: historical
version: 0.1.0
last_updated: 2026-06-05
lens: mixed-initiative-hci
verification: [web-fetched (Horvitz 1999 full text via pdftotext — 12 factors + equations 1-3 + dialog two-threshold model read verbatim), model-recall+search-confirmed (interruption-cost / deferral papers — titles/venues verified, internals recalled)]
---

## Objective

Establish, from mixed-initiative HCI, the decision rule for when standing instructions should make an agent STOP AND ASK versus PROCEED — and price the ask so the cost the skeptic presses is on the table from the start.

## Findings

### The borrowed spine (cite, don't rediscover)

The decision rule below is not new. It is Horvitz's *Principles of Mixed-Initiative User Interfaces* (CHI 1999), specifically his decision-theoretic treatment of "from beliefs to actions." The only contribution here is the *port*: substituting "the agent has correctly inferred the user's specification" for Horvitz's "the user has goal G," and reading the resulting threshold as a **specification-noise gate** rather than a UI-automation gate. The mechanism is his.

Horvitz frames an autonomous agent acting under uncertainty about a user's goal G. Of his twelve critical factors, four carry this lens: **(2) considering uncertainty about a user's goals**, **(4) inferring ideal action in light of costs, benefits, and uncertainties**, **(5) employing dialog to resolve key uncertainties** ("considering the costs of potentially bothering a user needlessly"), and **(3) considering the status of a user's attention in the timing of services**. Factor 5 is the literal ask-vs-proceed factor; factor 3 governs *when* an ask lands well.

### The formal trigger (verbatim from the paper)

Horvitz defines four outcome utilities over {Action A / No action ¬A} × {goal G true / ¬G}:
- `u(A,G)` act when goal is real (the win),
- `u(A,¬G)` act when goal is absent (the false-positive cost — over-acting on a wrong guess),
- `u(¬A,G)` don't act when goal is real (the miss),
- `u(¬A,¬G)` don't act when goal is absent (correct restraint).

Expected utility of acting (his Eq. 2):
`eu(A|E) = p(G|E)·u(A,G) + [1−p(G|E)]·u(A,¬G)`
and of not acting (Eq. 3):
`eu(¬A|E) = p(G|E)·u(¬A,G) + [1−p(G|E)]·u(¬A,¬G)`.

These two lines cross at a **threshold probability p\***: act iff `p(G|E) > p*`, refrain iff below. p* is computed by setting Eq. 2 = Eq. 3 and solving for p(G|E). Crucially, p* is *not fixed* — Horvitz shows it shifts with the utilities: raising the cost of acting-when-wrong (`u(A,¬G)`) **raises** p* (be more sure before acting); a user in deep focus lowers `u(A,¬G)`, raising the bar further.

### Why "ask" is its own move, not a fallback

The load-bearing part for this lens is Horvitz's *"Dialog as an Option for Action."* He adds a **third** option — ask the user — with its own outcome utilities `u(D,G)`, `u(D,¬G)`, and an expected-utility line of its own. This converts the single threshold into **two** thresholds along p(G|E):

- **p\*¬A,D** — the boundary between *do nothing* and *ask*;
- **p\*D,A** — the boundary between *ask* and *act*.

The resulting rule is three-zoned: **below p\*¬A,D → don't act, don't ask** (the inferred-goal probability is so low that even a question is net-negative interruption); **between the two thresholds → ASK** (uncertainty is high enough that a clarifying question beats both silent inaction and a confident guess); **above p\*D,A → just act** (you're sure enough that asking only adds friction). Horvitz's own observation: dialog when the user lacks the goal is *less bad* than wrongly acting (`u(D,¬G) > u(A,¬G)`), but asking before a *desired* action is *worse* than just doing it (`u(D,G) < u(A,G)`). That asymmetry is exactly why a band exists rather than a point.

### The port: specification noise instead of UI goals

Read G as "the agent's reconstruction of the spec is correct." Then p(G|E) is the agent's calibrated confidence in its understanding of the request, and the four utilities become specification-noise quantities:
- `u(A,¬G)` = cost of building/proving the *wrong thing* confidently — the **least-recoverable** error this discovery is about; downstream tension/proof-check/replication cannot remove a defect that was specified wrong.
- `u(D,¬G)` = cost of one clarifying question when the agent was in fact off — small, recoverable.
- `u(D,G)` = cost of asking when the agent already had it right — pure friction (the skeptic's territory).
- `u(¬A,G)` = cost of silently proceeding when right — the ideal, zero-friction case.

Because `u(A,¬G)` for *specification* errors is catastrophic and unrecoverable (you discover the misunderstanding only after the artifact is built), the threshold p\*D,A is pushed *high*: the agent must be very confident before proceeding without a check. This is the decision-theoretic justification for CLAUDE.md's "stop-and-question triggers" — they are a standing-instruction implementation of widening the middle (ASK) band.

### The DECISION RULE (deliverable)

Standing instructions should make the agent **STOP AND ASK** exactly when:

> the agent's calibrated confidence p that it has correctly reconstructed the specification falls in the band **p\*¬A,D ≤ p < p\*D,A**, where the upper threshold p\*D,A is raised in proportion to the *irreversibility* of acting on a wrong spec, and the lower threshold p\*¬A,D is raised by the *current interruption cost* (timing/attention, factor 3).

Operationally, the trigger fires when **all** of: (a) the cost of a wrong guess is high or hard to undo (irreversible commit, published claim, proof of the wrong statement); (b) confidence in the spec is materially below certainty (ambiguity, multiple readings, an unstated constraint detected); and (c) the expected interruption cost is low enough that `eu(ASK) > eu(ACT)` and `> eu(SILENCE)`. If irreversibility is low *or* confidence is near-certain, **proceed** — asking there is the friction the skeptic is right about.

### The cost the skeptic will press (stated, not hidden)

Asking is **not free**. Each question pays `u(D,G)` whenever the agent was already correct — and over many turns this accrues into interrogation fatigue, the friction cost lens 06 raises. The threshold p\*D,A is precisely the price tag: ask only when `[u(D,G)−u(A,G)]·p + [u(D,¬G)−u(A,¬G)]·(1−p) > 0`. When confidence is high *and* the action is cheaply reversible, that inequality fails and the discipline correctly says *don't ask*. A standing instruction that asks regardless of these terms has stopped reducing noise and started injecting friction — the same degeneracy the central claim warns of, now with a formula attached.

## Caveats

This lens establishes *when to ask* as a calibrated expected-utility threshold; it does **not** establish that agents can estimate p(G|E) accurately, nor what a good clarifying question contains, nor that standing instructions (vs. learned models) are the right delivery vehicle — Horvitz's agent infers utilities and a classifier estimates p, whereas a CLAUDE.md is a fixed heuristic that cannot read per-turn interruption cost. The skeptic's strongest move is to argue agents systematically *underestimate* their own p (false low confidence), which would inflate the ASK band beyond its true optimum; the rule above is only as good as the agent's confidence calibration, which Horvitz assumes and does not deliver. The port assumes specification-error utility `u(A,¬G)` is genuinely the dominant, least-recoverable term; if a given downstream method *can* cheaply catch spec errors, p\*D,A drops and the ASK band narrows — that empirical question is owned by the skeptic (lens 06) and the downstream-method lenses, not settled here. Claims here are a subset of Horvitz 1999's decision-theoretic framework plus its interruption-cost successors; no novelty is claimed beyond the noise-gate reading.

On verification: Horvitz 1999 was web-fetched and read verbatim (12 factors, Eqs. 1–3, the dialog two-threshold model). The interruption-cost / notification-deferral successor papers (Horvitz & Apacible 2003; Horvitz, Apacible & Subramani 2005) had titles and venues verified by search, but their internals are model-recall rather than fetched.

## Connections

| Edge | Target | Direction |
|------|--------|-----------|
| `synthesized-by` | `../../research/research.md` | forward-in-time |
