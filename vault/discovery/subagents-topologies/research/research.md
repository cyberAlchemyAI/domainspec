---
tags: [vault, discovery, multi-agent, subagent-topologies, calibration, anti-bias, cross-lens-synthesis]
node_type: research
status: consolidated
backfilled: true
analysis-method: post-hoc-independent-read
is_session: false
layer: ontology
nature: explanatory
version: 0.1.0
last_updated: 2026-06-05
---

# Research — Subagent Topologies: Cross-Lens Synthesis

> **Backfill note.** This research synthesis was written AFTER both the four lens `findings.md` files and the parent `discovery.md` already existed. The `subagents-topologies/` folder originally had no `research/` layer at all — the lenses and the discovery were authored first, and this cross-lens layer is retrofitted onto them to comply with the lens-research-discovery convention (`lens-research-discovery-layout.md` §"Backfill layout"). It is a **post-hoc independent read**: the analyst read the four lens findings and reconciled them on their own terms. It adds **no new claims** — every theme below is a subset of what the lenses and the discovery already contain (subset rule). The honest provenance direction is research-after-lenses, marked by the `retrofits` edges in Connections.

## Objective

Consolidate the four lens findings into one graded cross-lens account that grounds the discovery's refinement of the research-dispatch machinery: tension (not count, not surface diversity) is the calibration lever, the repo specifies it but lived dispatches do not exercise it, and a three-failure scope-fence bounds what any topology can promise.

## Lens Inventory

| # | Lens | Framing | Headline finding | Confidence |
|---|------|---------|------------------|------------|
| 01 | ensemble-formal | The averaging algebra: what each error term responds to | Krogh–Vedelsby + bias–variance: count touches only `σ²/n`; the shared-bias term and the correlated floor `ρσ²` survive any `n`; only on-axis disagreement subtracts member error. | `model-recall` — exact identities reliable, Hong–Page recalled; second-class until verified |
| 02 | adversarial-debate | The mechanism that produces on-axis disagreement | Passive averaging returns correlated bias *more confidently*; only a topology that FORCES a pair to confront along the bias axis can move the mean. Maps to repo R29 `false-consensus risk`. | `model-recall` — Irving/Mill/K&K/Du recalled; mechanism load-bearing but citations unverified |
| 03 | repo-prior-art | Cartography: topologies encoded vs. topologies lived | Repo already owns tension-not-diversity (8-topology taxonomy, R29, Item 10); five verified on-disk drifts show the specified tensioning is unexercised at scale. | `local-files-read` — counts verified on disk; high |
| 04 | skeptic | Precedent-kill + vacuity + boundary | Central claim is owned twice (Krogh–Vedelsby externally; sibling `anti-bias-vector-composition` internally, which already disclaimed novelty); surviving contribution is at most a taxonomy + scope-fence. Three failures bound it below "finding." | `local-files-read` (internal precedent-kill, load-bearing) + `model-recall` (external citations) |

Confidence note: lenses 01–02 rest on `model-recall` with no source fetched during production — they are second-class evidence (medium) until re-dispatched with web verification. Lens 03's drift counts are `local-files-read` (high). Lens 04 is mixed: its fatal internal precedent-kill is `local-files-read`; its external math half is recall-grade.

## Cross-Lens Analysis

### Theme A — The mechanism: count buys variance, only tension touches bias (01 + 02)

Lenses 01 and 02 together establish the load-bearing mechanism, and 02 names exactly the gap 01 cannot close from inside its own frame. Lens 01 proves, by exact algebra, that agent **count** moves only the independent-variance term `σ²/n`; the correlated-variance floor `ρσ²` and the shared-bias² term are *untouched by averaging entirely*. Surface diversity that does not move member estimates apart on the *same* input leaves the ambiguity term `Ā = 0`. So count and surface variety are provably orthogonal to the bias term. Lens 02 supplies the operation 01 admits it cannot: when every agent inherits the same framing, errors are correlated (`ρ → 1` on the bias axis), and **passive averaging returns the shared bias with tighter variance — more confident and equally wrong.** Lens 01's own Caveats hand off here explicitly ("Lens 02 addresses how to *produce* tension when the ensemble would otherwise collapse to a correlated consensus"). The two lenses are not redundant: 01 says tension is the right place to look; 02 says only forced confrontation along a *named* axis generates the on-axis disagreement that 01 can only assume into existence. Both converge on the same repo anchor — R29's `false-consensus risk`, which rejects merely non-overlapping angles precisely because "disjoint angles can both be biased toward the same conclusion."

### Theme B — The repo reality: the machinery specifies the tension it needs but lived topologies do not exercise it (03 + 04)

Lenses 03 and 04 agree the doctrine is already owned, and 03 supplies the verified evidence that owning it is not the same as running it. Lens 04's precedent-kill shows the tension-not-diversity core is stated twice over — externally (Krogh–Vedelsby/Hong–Page) and internally in the sibling `anti-bias-vector-composition/principle.md`, which already published "tensioned not merely diverse" and *already disclaimed novelty*. Lens 03 shows the matching operational truth: the repo encodes the calibration device (R29 pairwise tension + validator Item 10 false-consensus red flag) but lived practice drifts along five verified axes — **15 governed dispatches against ~68 audit folders** (1-in-5 governed), **only 4 LEDGER.md** repo-wide (dissent capture skipped in ~73% of governed dispatches), three corpus-key spellings, ~40% of discoveries left draft, and **32 ungoverned `agents-research/` folders** with zero `dispatch.yaml`/`LEDGER.md`. Together: the surface that would *prove* tension was realized (LEDGER dissent capture, validator field gating) is the surface most often skipped — Item 10 is a failure trigger the repo built and then runs without. 04 reads this as "decoration over existing validator rules"; 03 reads it as "the forcing function is specified but unexercised at scale." Same fact, both load-bearing for the discovery's "What's broken."

### Theme C — The scope-fence bounds all of it (04 over 01, 02, 03)

Lens 04's boundary attack fences everything the other three establish: three failures **no topology repairs** — (a) a **loaded upstream question** (all agents inherit a biased macro frame; Krogh–Vedelsby is silent on the question's own bias term); (b) **variance / thin coverage** (topology addresses bias, not depth — depth *is* governed by count, the sharpest internal contradiction: count *is* load-bearing, just for variance not bias); (c) the **single synthesizer** (every fan-in funnels through one un-tensioned reader, an irreducible single point of bias — a biased synthesizer can read a perfectly tensioned layer and still collapse it to the strongest reading). Lens 02's own Caveats independently reach (a) ("debate does not fix a loaded question"). This fence is what the discovery promotes to a stated premise (D-1); it bounds the mechanism of Theme A and the repair ambition of Theme B alike.

## Unique Contributions

- **Lens 01 (ensemble-formal)** — the *exact algebra*: the Krogh–Vedelsby identity (`E = Ē − Ā`) and the correlated-variance decomposition (`Var(V̄) → ρσ²`) that make count/surface-diversity orthogonality a theorem rather than a heuristic. No other lens supplies the term-by-term math.
- **Lens 02 (adversarial-debate)** — the *forced-confrontation mechanism* (the operation that *produces* on-axis disagreement when the ensemble would collapse) and its explicit mapping onto repo R29 as "this lens's mechanism written as a validation gate." No other lens names the production mechanism.
- **Lens 03 (repo-prior-art)** — the *verified drift counts* (15/68, 4 LEDGER, three corpus spellings, 7/18 draft, 32 ungoverned folders), the only `local-files-read` evidence in the set and the sole source of the discovery's "What's broken" locations.
- **Lens 04 (skeptic)** — the *internal precedent-kill* (the sibling node says the same thing and already disclaimed novelty) and the *three-failure scope-fence*, plus the collapse-test that demotes the headline from "finding" to "owned-prior-art consolidation."

## Open Questions Forwarded to Discovery

- **Corpus / parameter-name canonicalization** (from Theme B / Drift 3) → discovery **OQ-1**: unify the corpus field name; gate `corpus_root:` and the absent-key case.
- **Dissent-capture as a hard gate** (from Theme B / Drift 2; Item 10 as blocking) → discovery **OQ-2**: fail a governed dispatch with N ≥ 3 and zero dissent records.
- **The 32-folder ungoverned channel** (from Theme B / Drift 5) → discovery **OQ-3**: close or legitimize as a named low-ceremony tier.
- **Standalone discovery vs. premise on the sibling** (from Theme B's "owned twice" + Lens 04's verdict) → discovery **OQ-4**: keep as feature-discovery wired by `cites`, or fold into the sibling / a periodic audit node.

## Provenance

All four lenses carry `dispatch_status: backfilled-no-prompt-recoverable`: no verbatim prompt was saved for any of them, so no `dispatch.md` exists or will be created (per the backfill layout). Lenses **01 and 02 are `model-recall`** — their citations (Krogh–Vedelsby, Hong–Page, Irving et al., Mill, Kahneman & Klein, Du et al.) were stated from training knowledge with no source fetched during production. They should be **re-dispatched with web verification before being treated as load-bearing**; until then they are second-class evidence. Lens 03 is `local-files-read` (counts verified on disk 2026-06-05). Lens 04 is mixed: its load-bearing internal precedent-kill is `local-files-read`; its external math half is recall-grade and inherits the same re-verify flag. This research layer is itself a post-hoc independent read (`analysis-method: post-hoc-independent-read`) and inherits the recall caveats of its inputs.

## Connections

| Document | Type | Description |
|---|---|---|
| `../discovery.md` | `derives` | The parent discovery derives its commitments from this synthesis. |
| `research-synthesis.md` | `derives` | The ≤500-word executive summary derives entirely from this synthesis; it adds no new analysis. |
| `../lenses/01-ensemble-formal/findings.md` | `synthesizes` | Consolidates the ensemble-error lens. |
| `../lenses/02-adversarial-debate/findings.md` | `synthesizes` | Consolidates the adversarial-debate lens. |
| `../lenses/03-repo-prior-art/findings.md` | `synthesizes` | Consolidates the drift-audit lens. |
| `../lenses/04-skeptic/findings.md` | `synthesizes` | Consolidates the skeptic lens. |
| `../lenses/01-ensemble-formal/findings.md` | `retrofits` | Backfill marker: this synthesis was written after the lens. |
| `../lenses/02-adversarial-debate/findings.md` | `retrofits` | Backfill marker: written after the lens. |
| `../lenses/03-repo-prior-art/findings.md` | `retrofits` | Backfill marker: written after the lens. |
| `../lenses/04-skeptic/findings.md` | `retrofits` | Backfill marker: written after the lens. |
