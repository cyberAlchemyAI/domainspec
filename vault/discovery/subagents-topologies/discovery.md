---
tags: [vault, discovery, multi-agent, subagent-topologies, calibration, anti-bias]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.2.0
last_updated: 2026-06-05
---

# Subagent Topologies

> **Post-hoc alignment note (v0.2.0).** This discovery was originally written at v0.1.0 in a *science-finding* framing — it spent its headline defending whether the anti-bias principle was novel prior art, then demoting itself when its own skeptic lens showed the principle was already owned. v0.2.0 recasts it into the **feature-discovery** format per `lens-research-discovery-layout.md` and backfills the `research/` layer beneath it. The substance is preserved — the same eight topologies, the same five verified drifts, the same three-failure scope-fence — but the framing is now *what we are refining in the research-dispatch machinery and why*, not *is this a finding*. The anti-bias principle is treated here as a **cited design premise**, not a novelty claim to defend.

## Objective

Refine the research-dispatch machinery — the `research` skill, its three governing constitutions, and the dispatch validator — so that the pairwise-tension de-biasing it already specifies is actually exercised by lived dispatches. The end state: a single named vocabulary of dispatch topologies, validator gates that reject the schema and dissent-capture drifts catalogued below, and an explicit scope-fence stating what topology can and cannot promise.

## 1. Business Context

### Why now

The machinery already *specifies* the de-biasing mechanism. `domainspec-subagents-strategy-constitution.md` R29 requires pairwise tension along the bias-carrying axis, and the validator's Item 10 fires a false-consensus red flag when a layer of size N ≥ 3 returns zero dissent records and uniform conclusions. The specification is rigorous. But lived practice does not exercise it: the surfaces that would *prove* tension was realized (the LEDGER dissent capture, the validator's field gating) are the surfaces most often skipped. A refinement of the `research` skill is pending and needs a grounded statement of exactly where spec and practice diverge before it commits to new gates.

### What's broken

Five specified-vs-lived drifts, each with its location and count (verified on disk 2026-06-05):

- **Drift 1 — thin governance.** `15` `dispatch.yaml` files exist repo-wide, against `68` folders under `domainspec-theorem/research/audits/`. Roughly **1 in 5** audit-shaped artifacts is governed by the spec engine; the majority are ungoverned hand-written audits.
- **Drift 2 — dissent-capture dropped.** Only `4` `LEDGER.md` exist repo-wide. `11` of the `15` governed dispatches have a `dispatch.yaml` but **no** `LEDGER.md` — the Layer-2 verbatim-dissent surface (research R16) is skipped in **~73%** of governed dispatches. This is the precise lived form of the failure Item 10 was built to catch.
- **Drift 3 — schema drift on required fields.** The corpus key is spelled three ways across the 15 specs: `corpus:` (×9), `corpus_root:` (×4), neither (×2). The loop budget appears as both `max_loops` and `loop_cap`. The mode enum carries `parallel` and `zig-zag`, neither of which is in base R19's enum. The validator (R26) is not gating field names in practice — the two inherited constitutions' vocabularies are bleeding together in lived specs.
- **Drift 4 — promotion left draft.** `7` of `18` `discovery.md` files carry `status: draft` (~**40%** un-promoted). Nothing auto-promotes (the gate is respected conservatively), but the published-corpus payoff frequently never lands.
- **Drift 5 — an entire ungoverned channel.** `domainspec-theorem/theorem/agents-research/` holds `32` folders with `0` `dispatch.yaml` and `0` `LEDGER.md` — the largest live multi-agent surface in the repo running entirely outside validate/review. Folder names (`*-council-*`, robot-talks-flavored work) imply multi-agent dispatches ran here with no validator to fire Item 10.

### What stays the same

Explicit scope boundary — this refinement does **not** touch:

- **The anti-bias principle itself.** "De-biasing comes from tension along the bias-carrying axis, not from agent count or surface diversity" is owned by the sibling discovery `../anti-bias-vector-composition/principle.md` (which cites Krogh–Vedelsby 1995). We cite it; we do not re-derive it, restate it, or claim it.
- **The constitutions' existing rule text.** R29 pairwise tension, Item 10 false-consensus red flag, the per-layer mode model, the promotion gate — all unchanged. We make lived topologies *exercise* these rules; we do not rewrite them.
- **The four-role epistemic model.** explorer / skeptic / writer / auditor as distinct epistemic functions, with `agent_name` uniqueness (R30) preventing collapse, is left intact.

We are not rewriting the principle. We are making the lived topologies exercise it.

## 2. Core Concepts

- **The 8-topology taxonomy (shared vocabulary).** A typed index over the dispatch shapes the repo already encodes: `single` · `task-fan-out` · `robot-talks` · `adversarial-audit` · `pipeline`/per-layer · `parent-synthesis` · `meta-dispatch` · the four-role tension lattice (explorer/skeptic/writer/auditor). This is a *naming* of existing structure so drift and gates can be discussed against a fixed vocabulary — not a new mechanism.
- **Tension ≠ count ≠ diversity.** The de-biasing lever is structural tension along the bias-carrying axis. Count drains only the variance term (`σ²/n`) and leaves the correlated bias floor untouched; surface diversity over a shared corpus and frame returns the shared bias *more confidently*. This distinction is the cited premise from `../anti-bias-vector-composition/principle.md` (Krogh–Vedelsby 1995); the feature rests on it rather than re-establishing it.
- **The three-failure scope-fence (design constraint).** A bound on what any topology — and therefore what the validator — can promise. No topology repairs: (a) a loaded upstream question (all agents inherit a biased macro frame); (b) variance / thin coverage (topology addresses bias, not depth — depth *is* governed by count); (c) the single-synthesizer bottleneck (every fan-in funnels through one un-tensioned reader, an irreducible single point of bias). The fence is a constraint on the spec, not a defect to be patched away.

## 3. Detailed Specifications — Decisions & Open Questions

The original folder did not commit firm fixes, so most commitments below are honest open questions, each carrying a recommendation. Two items are decided.

### D-1 — Promote the scope-fence to a stated premise of the machinery

The three-failure fence (loaded question · variance · single synthesizer) is recorded as an explicit design constraint on what the validator can promise. The validator must not be marketed or extended as if it cancels these three; they are out of topology's reach by construction. This is decided because the fence is a derivation from the cited principle, not a contested option — the sibling left it implicit and this discovery makes it explicit.

### D-2 — The taxonomy is the shared vocabulary, not a new claim

The eight topologies are adopted as a typed index over existing structure. No topology in the list asserts anything the constitutions and the sibling principle do not already encode; the vocabulary exists to make drift and gates discussable. Decided because it is a naming convention, reversible at no epistemic cost.

### OQ-1 — Unify the corpus field name in the schema

The corpus key is spelled three ways (Drift 3). **Recommendation:** pick `corpus:` as canonical (it is the majority spelling, ×9) and make the validator *reject* `corpus_root:` and the absent-key case rather than silently accepting them. Open because the loop-budget (`max_loops` vs `loop_cap`) and mode-enum (`parallel`, `zig-zag`) drifts need the same canonicalization pass, and the merge order of the two inherited constitutions' vocabularies is not yet decided.

### OQ-2 — Enforce dissent-capture as a hard gate

Only 4 LEDGERs exist; dissent capture is skipped in ~73% of governed dispatches (Drift 2). **Recommendation:** the validator should *fail* a governed dispatch whose subject layer has N ≥ 3 and zero dissent records — making Item 10's red flag a blocking gate rather than an advisory note. Open because retrofitting this onto the 11 already-governed-but-LEDGER-less dispatches needs a migration stance (grandfather vs. backfill).

### OQ-3 — The 32-folder `agents-research/` channel: close or legitimize

`theorem/agents-research/` runs 32 multi-agent folders with zero governance (Drift 5). **Recommendation (read, marked open):** this looks like a deliberate lightweight tier rather than pure negligence — the strict pipeline should *legitimize* it as a named low-ceremony tier with a minimal gate (at least a tension-axis declaration), rather than force every exploratory council through full validate/review. Marked open because the alternative — absorbing the channel into full governance — is defensible and the choice is a governance call, not a derivation.

### OQ-4 — Does the surviving substance warrant a standalone discovery, or a premise on the sibling?

The substance is a taxonomy + drift audit + scope-fence over an owned principle. **Recommendation:** keep it as this feature-discovery (it grounds a pending skill refinement and carries five verified, locatable drifts that the sibling principle does not audit), but wire it tightly to the sibling via `cites` so the dependency is explicit. Open because a reviewer could reasonably argue the drift audit belongs as a periodic audit node rather than a discovery.

## Connections

| Document | Type | Description |
|---|---|---|
| `research/research.md` | `derives-from` | The cross-lens synthesis (backfilled) this discovery's commitments stand on. |
| `../anti-bias-vector-composition/principle.md` | `cites` | The owned design principle — tension-not-diversity — this refinement rests on; cited, not re-derived. |
| `../../constitution/research-constitution.md` | `cites` | One of the three constitutions governing the dispatch machinery this discovery refines. |
| `../../constitution/domainspec-subagents-strategy-constitution.md` | `cites` | Source of R29 pairwise-tension and the per-layer mode model. |
| `../../constitution/robot-talks-constitution.md` | `cites` | Governs the robot-talks topology in the taxonomy. |
| `../subagents-strategy-refinement/principle.md` | `cites` | Prior refinement of the dispatch engine this one continues. |
| `research/research-synthesis.md` | `cited-by` | The ≤500-word executive summary cites this discovery's decisions (D-1, D-2) and open questions (OQ-1…OQ-4). |
| `../subagent-dispatch-observability/discovery.md` | `derives` | The observability discovery derives its "What's broken" from this folder's verified drifts (Drift 2/3/5) and is their operational answer. |
| `../subagent-pipeline-composition/discovery.md` | `derives` | The pipeline-composition discovery derives its "What's broken" (Drift 3 vocabulary fragmentation, Drift 5 ungoverned channel) and its scope-fence caveat from this folder. |
