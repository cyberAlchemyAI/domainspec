---
tags: [vault, discovery, multi-agent, subagent-topologies, executive-summary]
node_type: research-synthesis
status: consolidated
is_session: false
layer: ontology
nature: reference
version: 0.1.0
last_updated: 2026-06-05
---

# Research Synthesis — Subagent Topologies

<!-- word budget measured below this line -->

## Objective

Give downstream readers a ≤500-word executive summary of the cross-lens research grounding the subagent-topologies refinement of the research-dispatch machinery.

## Context

The folder's four lenses and `discovery.md` were authored first; the `research/` layer was backfilled as a post-hoc independent read (see `research.md` backfill note). This summary adds no analysis — it cites `research.md` for every claim and the discovery for every decision.

## What Was Found

- Count buys only variance; only tension along the bias axis touches the shared-bias term, and passive averaging returns correlated bias *more confidently* (`research.md#cross-lens-analysis`, Theme A).
- The repo already owns tension-not-diversity and specifies the gate (R29 + Item 10), but lived dispatches do not exercise it — five verified drifts: 15/68 governed, only 4 LEDGER, three corpus spellings, ~40% draft, 32 ungoverned folders (`research.md#cross-lens-analysis`, Theme B).
- A three-failure scope-fence — loaded question, variance, single synthesizer — bounds what any topology can promise (`research.md#cross-lens-analysis`, Theme C).
- The claim is owned twice (external math + sibling node that disclaimed novelty); the surviving contribution is at most a taxonomy + scope-fence (`research.md#unique-contributions`).
- Lenses 01–02 are `model-recall` and second-class until web-verified (`research.md#provenance`).

## Decisions Taken

- Promote the three-failure scope-fence to a stated premise of the machinery (`../discovery.md#d-1`).
- Adopt the 8-topology taxonomy as shared vocabulary, not a new claim (`../discovery.md#d-2`).
- Leave the constitutions' rule text, the anti-bias principle, and the four-role model unchanged — make lived topologies exercise them, not rewrite them (`../discovery.md#d-2`).

## Implications

- The pending `research`-skill refinement should add gates that reject the schema and dissent-capture drifts, not new de-biasing theory (`research.md#cross-lens-analysis`, Theme B).
- Any validator marketing must respect the scope-fence: topology cancels correlated bias, not loaded questions, thin coverage, or the single-synthesizer bottleneck (`research.md#cross-lens-analysis`, Theme C).

## Open Questions

- OQ-1: unify the corpus field name; gate `corpus_root:` and the absent-key case (`../discovery.md#oq-1`).
- OQ-2: make Item 10 a blocking gate — fail a governed dispatch with N ≥ 3 and zero dissent (`../discovery.md#oq-2`).
- OQ-3: close or legitimize the 32-folder ungoverned channel as a named low-ceremony tier (`../discovery.md#oq-3`).
- OQ-4: keep this as a feature-discovery wired by `cites`, or fold into the sibling / a periodic audit; recommendation is to keep-and-wire (`../discovery.md#oq-4`).

## Read More

- `research.md` — the load-bearing cross-lens analysis.
- `../discovery.md` — the commitments (D-1, D-2) and open questions (OQ-1..OQ-4).

## Connections

| Document | Type | Description |
|---|---|---|
| `research.md` | `derives-from` | This synthesis summarizes the cross-lens research; adds no new analysis. |
| `../discovery.md` | `cites` | Cites the discovery's decisions and open questions. |
