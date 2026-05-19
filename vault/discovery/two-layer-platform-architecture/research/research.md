---
tags: [vault, research, two-layer-platform-architecture]
node_type: research
is_session: false
layer: architecture
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
backfilled: true
---

# Research — Two-Layer Platform Architecture

> **Backfill note.** This research synthesis was written AFTER `discovery.md` was already drafted (the discovery was promoted earlier on 2026-05-17 from the 3 lenses directly, without an intermediate research-layer document). It exists to retrofit the new convention's lens → research → discovery chain onto an existing artifact. The analysis below was conducted post-hoc by reading the 3 lens findings; it deliberately does not look at the discovery during analysis, to test whether the discovery's commitments survive an independent cross-lens read.

## Objective

Synthesize, from the 3 lens findings alone, what the design space around the "two-layer platform architecture" claim actually contains — which structural decisions are forced by the five proposals' overlap, which are engineering preference, and which depend on unresolved discovery-level questions. Surface cross-lens convergence and disagreement before they collapse into the discovery's narrative.

## Lens Inventory

| # | Lens | Framing | Headline finding | Confidence |
|---|------|---------|------------------|------------|
| 01 | [Cross-cutting analysis](../lenses/01-cross-cutting-analysis/findings.md) | Structural | The five proposals share the same 5 primitives (walker, frontmatter, edge extractor, SQLite kernel, embedder, event sink); kernel + thin subsystems with strict seams is the right shape; frontmatter ownership is the load-bearing fork | high (`[local-files-read]`) |
| 02 | [Critical-path analysis](../lenses/02-critical-path/findings.md) | Operational | `vault_ctl` is on the hard side of every dependency edge; empirical floor = `vault_ctl` + `vault_telemetry` (residue-counter-only) + `convergence_runner` (dispatch-and-log-only); snapshot zero is the single highest-leverage day-1 artifact; the convergence boundary classifier must NOT ship until an operational proxy is named | high (`[local-files-read]`) |
| 03 | [Gap analysis](../lenses/03-gap-analysis/findings.md) | Adversarial | The five proposals miss 10 named gaps; the single most important is the stable test corpus (Gap 5); frontmatter migration (Gap 6) and immutability enforcement (Gap 9) are already biting; publication pipeline (Gap 4) and backups (Gap 3) are deferrable | high (`[local-files-read]`) |

## Cross-Lens Analysis

### Theme 1 — Kernel vs autonomy: the platform reframe is forced, not preferred

- **Lenses speaking to it.** 01, 02
- **Convergence.** Lens 01 §1 names the platform reframe as the position; lens 02 §1 corroborates structurally by showing every soft edge in the DAG dissolves into a hard edge once `vault_ctl` is the common frontmatter parser. The reframe is not a matter of taste — five independent walkers would produce five drift stories within a quarter (lens 01 §1), and the DAG (lens 02 §1) makes the kernel-or-monolith choice the only way to bound cross-subsystem coupling.
- **Disagreement.** None. Lens 03's gap catalog implicitly assumes the platform reframe (every gap is scoped to a platform-level artifact, not a per-tool one).
- **Resolution.** `[lens-supported]` — the reframe is the working architecture.
- **Implication for discovery.** D-1 captures this. The discovery must NOT allow the reframe to slide back into "we'll share where convenient" — that path produces the five-divergent-walker outcome lens 01 explicitly flags.

### Theme 2 — Frontmatter ownership as the unresolved gate

- **Lenses speaking to it.** 01, 03 (indirectly via Gap 6)
- **Convergence.** Lens 01 §6 names frontmatter ownership as THE fork; every other decision is downstream. Lens 03 Gap 6 reinforces from the migration angle: the `verification:` field was added mid-conversation and pre-existing lenses are now non-conformant, and there is no `schema_version:` field, no migration directory, no policy. Both lenses converge: ownership and migration discipline are the same problem.
- **Disagreement.** None. Lens 02 takes ownership as a precondition for `vault_ctl` to validate at all.
- **Resolution.** `[lens-supported]` — frontmatter ownership must be ratified by a constitution BEFORE `vault_ctl` code is written.
- **Implication for discovery.** OQ-1 carries this honestly. The recommendation (`vault_common` owns it) is consistent across both lenses; the gap is the constitution document itself does not yet exist.

### Theme 3 — Snapshot zero as the irreversible artifact

- **Lenses speaking to it.** 02 (primary), 03 (Gap 5 reinforces)
- **Convergence.** Lens 02 §6 names snapshot zero as the single most important day-1 artifact: "a snapshot taken in week 3 cannot become a snapshot taken in week 1." Lens 03 Gap 5 reinforces from the metrics-falsifiability angle: without a stable test corpus, every regression is attributable to "vault evolution" and the EVōC convergence claim's falsifiability dissolves. Both lenses converge: the artifact is cheap (under an hour), high-leverage, and time-irreversible.
- **Disagreement.** None. Lens 01 does not address scheduling directly but the platform reframe is consistent with snapshot zero being a kernel-owned operation.
- **Resolution.** `[lens-supported]` — snapshot zero is the operational hinge.
- **Implication for discovery.** D-2 honors this with the "hand-written if necessary" clause; D-7 ratifies the `vault-corpus-v0` tag. The discovery should NOT allow these to be deferred for tooling readiness.

### Theme 4 — `vault_ctl` is on the hard side of every edge

- **Lenses speaking to it.** 01, 02
- **Convergence.** Lens 01 §3 places `vault_ctl` at the seam (invariant enforcement, edge resolvability, snapshot CLI); lens 02 §1 quantifies the dependency: every downstream subsystem has a HARD edge back to `vault_ctl`. The two views together force a build-order: `vault_ctl` ships first; nothing else is reviewable until it does.
- **Disagreement.** Subtle. Lens 01 §4 wants to RE-SCOPE `vault_ctl` (strip promotion/demotion to `vault_telemetry`, strip session-close to the existing skill); lens 02 §3 carries the trimmed scope but does NOT name the rescoping as a separate decision. The discovery must NOT conflate "build `vault_ctl` first" with "build the original maximal `vault_ctl`."
- **Resolution.** `[lens-supported]` for the build-order; `[analyst-judgment]` for the rescoping being honored at MVP-time.
- **Implication for discovery.** D-5 captures the rescoping explicitly. D-2 carries the build-order. They are independent decisions and the discovery treats them as such.

### Theme 5 — The empirical floor is three subsystems, not five

- **Lenses speaking to it.** 02 alone; 01 §3 names the five subsystems but does not prioritize
- **Convergence.** Lens 02 §3 derives the empirical floor from the parent discovery's two questions: (i) do the four predicted residues generate constitutions in 30 days? (ii) can we re-dispatch the Gödel lens with hard-fetch and capture it structurally? Both questions are diff-shaped or trace-shaped — neither requires graph retrieval or Lean. The floor is `vault_ctl` + `vault_telemetry` residue-counter-only + `convergence_runner` dispatch-and-log-only.
- **Disagreement.** Implicit tension with lens 01: lens 01 §3 treats `graph_retrieval` as a peer subsystem; lens 02 §5 Risk 5 explicitly warns it will steal budget from telemetry if not schedule-deferred. The discovery must NOT let `graph_retrieval`'s intellectual appeal override the empirical sequencing.
- **Resolution.** `[lens-supported]` — the empirical floor is the operationally honest scope.
- **Implication for discovery.** D-6 captures this. The risk register (Risk 5) carries the failure mode explicitly. The 6-week schedule (§6) places `graph_retrieval` AFTER the first telemetry report by design.

### Theme 6 — The convergence boundary classifier is theory-blocked

- **Lenses speaking to it.** 02 alone
- **Convergence.** Single voice — but the finding is sharp. Lens 02 §2 names the boundary classifier as the hardest unknown ("two agents have converged iff their hom-presheaves agree per node" is a theorem statement, not a spec); §5 Risk 2 makes the failure mode explicit (if shipped under pressure, the threshold is hand-tuned, the metric chosen for convenience). The right resolution is to ship dispatch + structured log only and refuse to merge a classifier until the proxy is named in a discovery file.
- **Disagreement.** None — single voice. But this is exactly the kind of finding that would benefit from a sibling lens checking it against the parent `graph-as-residue-attractor` discovery's own boundary-classifier discussion. Absent that, treat as `[honest gap]` for cross-lens corroboration.
- **Resolution.** `[lens-supported]` for the engineering recommendation (dispatch-only); `[honest gap]` for the proxy itself.
- **Implication for discovery.** OQ-6 carries the open question. A-5 ratifies the refusal-to-merge discipline. Both are operationally enforceable today.

### Theme 7 — The 10 gaps are not uniform: three are biting, four can wait

- **Lenses speaking to it.** 03 alone
- **Convergence.** Single voice; the gap catalog is unique to lens 03. The prioritization is explicit (must-close: Gap 5 test corpus, Gap 6 frontmatter migration, Gap 9 immutability enforcement; defer: Gap 1 Vladimir, Gap 3 backups, Gap 4 publication, Gap 7 CI smoke).
- **Disagreement.** None directly, but lens 01 and lens 02 do not name any of these gaps — meaning the discovery would have shipped without them if lens 03 hadn't been dispatched. The cross-lens implication: the platform reframe (lens 01) and the critical path (lens 02) are structurally complete but operationally incomplete without lens 03's gap discipline.
- **Resolution.** `[lens-supported]` — the prioritization stands; the deferrals are honest.
- **Implication for discovery.** D-7 ratifies Gap 5. OQ-2 carries Gap 6 (frontmatter migration). OQ-3 carries Gap 9 (immutability enforcement). The defer-with-eyes-open gaps are carried in the discovery's §1 "What stays the same" framing (e.g., the Vladimir question is acknowledged as out of scope).

## Unique Contributions

- **Lens 01.** The only lens that decomposed the five proposals into a kernel API surface (7 primitives) and a subsystem boundary table. The "frontmatter ownership is the fork" insight is unique to 01 and load-bearing for OQ-1.
- **Lens 02.** The only lens with a dependency DAG, a critical-path analysis, a six-week schedule, a risk register, and the "if you can only build one thing" reduction. The snapshot-zero-as-irreversible insight is unique to 02 even though Gap 5 of lens 03 reinforces the substrate-stability angle.
- **Lens 03.** The only lens that catalogued operational gaps the five proposals did not address. Gaps 1, 4, 7, 8, 10 are unique to 03 — neither lens 01 nor lens 02 would have surfaced them. The migration-discipline framing (Gap 6) bridges to OQ-2; the immutability framing (Gap 9) bridges to OQ-3.

## Open Questions Forwarded to Discovery

These are decision-shaped questions that lens-layer investigation cannot resolve.

- **Q-R1.** Should the frontmatter-ownership constitution (OQ-1) be written BEFORE any `vault_common` code, or in parallel with it? **Recommendation.** Before. The constitution IS the spec; coding in parallel risks the model diverging from the convention text it is supposed to executable-ify.
- **Q-R2.** Does the discovery treat Gap 1 (Vladimir onboarding) as out-of-scope or as a deferred-but-tracked dependency for the parent discovery's convergence-claim falsification? **Recommendation.** Deferred-but-tracked; the parent discovery's "two agents have converged" criterion is untestable with one agent, so this is a real prerequisite for the parent's headline claim, not an unrelated nice-to-have.
- **Q-R3.** Should the convergence boundary classifier proxy (OQ-6) be sourced from a sibling discovery (`convergence-boundary-classifier-definitions/`) or from the parent `graph-as-residue-attractor` discovery's own theory work? **Recommendation.** Sibling discovery — the proxy is operational, not foundational; the parent discovery should not absorb operational details that may iterate independently of the framework.
- **Q-R4.** Does the 6-week schedule (lens 02 §4) become binding once the discovery is consolidated, or does it remain a "provisional placeholder" per the discovery's §6 framing? **Recommendation.** Provisional. Implementation planning belongs in a separate plan node, not in the discovery; the schedule's role here is to make the risk register's "early warning" indicators (lens 02 §5) interpretable.

## Provenance

- **Lens slate dispatched on.** 2026-05-16 (per all individual lens `date` fields, pre-migration).
- **Strategist.** Not recorded. These lenses predate the `/domainspec-subagents-strategy` skill's bootstrap convention; no strategist file exists.
- **Lens count.** 3 (01, 02, 03). No corroboration re-dispatches.
- **Notable absences.** No lens dispatched on: (a) the platform-as-self-referential thesis (the platform IS the executable form of `ontology-conventions.md`; lens 01 §6 names it but no lens isolates the recursion); (b) cross-repo coherence in depth (lens 03 Gap 2 names it but does not propose a concrete coherence mechanism beyond the rejected "master ontology" shape); (c) Vladimir-onboarding as a parent-discovery prerequisite (lens 03 Gap 1 names it but only as an MVR, not as a falsification-prerequisite framing). All three are candidates for a future lens slate.

## Connections

- `retrofits` → `../lenses/01-cross-cutting-analysis/findings.md`
- `retrofits` → `../lenses/02-critical-path/findings.md`
- `retrofits` → `../lenses/03-gap-analysis/findings.md`
- `synthesizes` ← `../lenses/01-cross-cutting-analysis/findings.md`
- `synthesizes` ← `../lenses/02-critical-path/findings.md`
- `synthesizes` ← `../lenses/03-gap-analysis/findings.md`
- `cited-by` → `research-synthesis.md`
- `cited-by` → `../discovery.md`
