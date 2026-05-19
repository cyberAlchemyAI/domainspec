---
tags: [vault, research, cross-repo-rollout]
node_type: research
is_session: false
layer: architecture
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
backfilled: true
analysis-method: post-hoc-independent-read
---

# Research — Cross-Repo Rollout of /domainspec Discipline

> **Backfill note.** This research synthesis was written AFTER `discovery.md` was already drafted (on 2026-05-17 from the three lens findings directly, without an intermediate research layer). It retrofits the lens → research → discovery chain onto an existing artifact. Analysis was performed post-hoc by independently re-reading the three lens findings; the discovery was deliberately not consulted during analysis, to test whether its commitments survive an independent cross-lens read.

## Objective

Synthesize, from the three repo-investigation lenses alone, what the rollout design space actually contains — which moves are universally safe, which are repo-conditional, which are blocked on real reconciliation work, and where the lenses agree, disagree, or leave gaps that the discovery may have over-resolved.

## Lens Inventory

| # | Lens | Target repo | Headline finding | Confidence |
|---|------|-------------|------------------|------------|
| 01 | [House Project investigation](../lenses/01-house-project-investigation/findings.md) | `house_project` | 519 vault + 213 feature .md files; full vocabulary parity (parent of the vocabulary); discovery-shape and edge-representation are the divergences; features corpus is the best pilot surface | high (`[local-files-read]`) |
| 02 | [Football-stats-oracle investigation](../lenses/02-football-stats-investigation/findings.md) | `football-stats-oracle` | Freshly bootstrapped; `sessions/` empty despite May-15 substantive day; the close-session skill the repo authored has not been used in its own repo; reciprocal flow is the headline | high (`[local-files-read]`) |
| 03 | [Maestro-trama investigation](../lenses/03-maestro-trama-investigation/findings.md) | `maestro-trama` | `domainspec` and `.claude` are symlinks → framework already mounted in-tree; "duplicate /domainspec" premise is false; two ontology catalogs coexist; `internal_tools/` overlap is disjoint, not duplicative | high (`[local-files-read]`) |

## Cross-Lens Analysis

### Theme 1 — Vocabulary parity is universal; shape parity is not

- **Lenses speaking to it.** 01, 02, 03
- **Convergence.** All three target repos use the same frontmatter vocabulary (`node_type`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `is_session`, `version`, `last_updated`). Lens 01 establishes house_project as the *parent* of the vocabulary; lens 02 confirms football introduced the `evidence_stage` ladder that /domainspec inherited; lens 03 confirms maestro inherits the framework's custom skill files directly through the `.claude` symlink, making frontmatter divergence structurally impossible there.
- **Disagreement.** Discovery-shape and edge-representation diverge per repo. House_project uses flat single-file discoveries + prose-table edges; football uses `raw/d*.md` dumps with *no frontmatter at all*; maestro has one lens-adjacent discovery missing the new fields. No two repos are at the same shape baseline.
- **Resolution.** `[lens-supported]` — the vocabulary-vs-shape split is the central rollout finding.
- **Implication for discovery.** A "universal additive layer" is defensible *only* at the level of new folders/files; any constitution that depends on shape parity (edge-acyclicity, lens-shape discoveries) is per-repo, not universal.

### Theme 2 — The seed-loop framing (football) is genuinely bidirectional

- **Lenses speaking to it.** 02 alone; 01 and 03 are silent
- **Convergence.** Lens 02 is the only voice and lands cleanly: football authored `close-session` and the evidence-stage ladder; both now operate at higher fidelity in /domainspec than in their repo of origin. The `verification:` field, lens layer over `raw/`, and 7-constitution articulation flow *back* to football, not just forward from it.
- **Disagreement.** None — but this is also not corroborated by any other lens. The "framework owes the seed" framing is a lens-02 editorial overlay on a real gap (empty `sessions/` despite a substantive bootstrap day).
- **Resolution.** `[lens-supported]` for the empirical gap (sessions/ is empty); `[analyst-judgment]` for the reciprocal-flow narrative as a framing.
- **Implication for discovery.** §5 of `discovery.md` adopts the narrative wholesale. The empirical claim (write the retroactive bootstrap session note) is defensible; the broader "the framework gives the seed its own discipline made explicit and verifiable" rhetoric is honest but not lens-corroborated.

### Theme 3 — Symlink mount is a third deployment mode the rollout strategy must accommodate

- **Lenses speaking to it.** 03 alone (headline); 01 and 02 implicitly assume vendored-or-peer mode
- **Convergence.** Lens 03 resolves the "duplicate /domainspec" premise by inspection: `maestro-trama/domainspec → ../domainspec` and `.claude → domainspec/.claude` are symlinks. The framework is *atomically* mounted in maestro's working tree — no sync needed, no copy drift possible, but also no isolation if the framework is mid-refactor.
- **Disagreement.** No lens-level disagreement, but lens 03 explicitly flags symlink stability as `[DEFERRED TO USER]` — the rollout shape inverts if the symlink is transitional. Lenses 01 and 02 do not consider a symlink mount option at all.
- **Resolution.** `[lens-supported]` for the inspection; `[empirical bet]` for symlink stability as a deployment mode.
- **Implication for discovery.** "Symlink mount as deployment" is a core concept in §2 and the maestro-first sequencing in §4. Both depend on OQ-1's resolution. Discovery correctly forwards this as an open question rather than resolving it.

### Theme 4 — Catalog-of-record reconciliation is load-bearing for edge-acyclicity adoption

- **Lenses speaking to it.** 03 (explicit); 01 (implicit — graph-edges.md vs ontology-conventions.md inside house_project)
- **Convergence.** Where two ontology catalogs coexist, edge-acyclicity adoption is gated on declaring one source-of-truth. Lens 03 names this explicitly for maestro (`vault/ontology-conventions.md` Appendix C vs framework's `edge-catalog.md`). Lens 01 implicitly has the same problem *inside* house_project (Connections-tables + `graph-edges.md` + `ontology-conventions.md` are three coexisting representations).
- **Disagreement.** Lens 01 does not foreground catalog reconciliation as the gate — it treats edges-as-prose-vs-frontmatter as the gate. These are adjacent but not identical: edge-format unification is necessary, catalog-of-record selection is necessary, and neither implies the other.
- **Resolution.** `[lens-supported]` for "catalog-of-record matters"; `[lens-gap]` for whether format unification is logically prior, posterior, or independent.
- **Implication for discovery.** Discovery §2 frames "catalog-of-record reconciliation" as a maestro-specific concept. The lens-01 echo (house_project's tri-format edge problem) is silently absorbed — the discovery does not name it as a parallel instance.

### Theme 5 — "Universal additive layer" is the only honest universal claim

- **Lenses speaking to it.** 01, 02, 03 all enumerate "low-risk additive" lists
- **Convergence.** All three lenses produce a "tonight, low-risk" list. The intersection across all three is roughly: snapshot-zero, `onboarding/` or equivalent, framework constitutions in a namespaced subfolder, empty `bets/` + `amendments/` slots, `MIGRATION-NOTES.md`, single-line `verification:` backfill on one existing discovery. Six items.
- **Disagreement.** Each lens has 1–2 unique items (lens 01: features-as-pilot; lens 02: retroactive bootstrap session note; lens 03: business-philosopher peer-vault). These are repo-conditional, not universal.
- **Resolution.** `[lens-supported]` for the six-item universal layer; the per-repo items are correctly recognized as profile-specific.
- **Implication for discovery.** §4 of `discovery.md` enumerates exactly six universal moves. The mapping is faithful.

### Theme 6 — `internal_tools/` canonicalization is the only true high-cost item

- **Lenses speaking to it.** 03 (explicit, with three options); 01 (mentions `internal_tools/` exists but does not engage); 02 (silent)
- **Convergence.** Lens 03 is the only voice with depth: maestro's `vault_routing` (working MCP + sqlite + indexer/embedder/scorer) does not exist in /domainspec; /domainspec's `vault_ctl`/`graph_retrieval` lines do not exist in maestro. Three live canonicalization options, all defensible, none decidable from read-only inspection.
- **Disagreement.** No lens contradicts; lens 01 and 02 simply do not engage. This is a genuine *gap* in the lens slate — the rollout's hardest decision was investigated in only one repo.
- **Resolution.** `[lens-supported]` for the disjoint-not-overlapping finding; `[lens-gap]` for whether house_project's `internal_tools/` (with `ccb-registration-demo`, `commits_productivity`, `personal_assistant`, `semantic_index`, `vault_routing`) overlaps maestro's at all — lens 01 lists them but does no comparison.
- **Implication for discovery.** Discovery defers internal_tools canonicalization (OQ-2) which is correct. But the lens slate is genuinely incomplete on this — house_project's `vault_routing` and `semantic_index` may overlap maestro's, and no lens checked.

## Unique Contributions

- **Lens 01.** The only lens with a quantitative inventory (519 vault .md, 213 feature .md, 60 misclassified-as-discovery inside conversations/, 7 existing constitutions). The features-corpus-as-pilot recommendation is unique to lens 01.
- **Lens 02.** The only lens with a reciprocal-flow framing and the seed-loop empirical gap (empty `sessions/` despite substantive bootstrap day). The four explicit flow-back items are unique to lens 02.
- **Lens 03.** The only lens with the symlink discovery (resolves a premise of the task), the dual-catalog naming, the three internal_tools canonicalization options, and the business-philosopher-as-peer-vault observation.

## Open Questions Forwarded to Discovery

- **Q-R1.** Is the lens slate's silence on house_project's `internal_tools/` overlap with maestro's a real gap? **Recommendation.** Yes — schedule a dedicated cross-repo `internal_tools/` audit before any canonicalization decision (OQ-2).
- **Q-R2.** Should "catalog-of-record reconciliation" be generalized from maestro-specific to a universal concept covering house_project's internal tri-format edge problem? **Recommendation.** Yes; the discovery currently presents it as maestro-specific in §2 but the principle applies wherever ≥2 catalogs coexist.
- **Q-R3.** Is the seed-loop reciprocal-flow framing (§5) a verifiable claim or editorial overlay? **Recommendation.** Keep the empirical claim (write the retroactive bootstrap session note); flag the broader rhetoric as `[analyst-judgment]` rather than `[lens-supported]`.
- **Q-R4.** Does the "universal additive layer" sequencing (maestro → football → house_project) survive the symlink-stability question? **Recommendation.** Conditional — if OQ-1 resolves to "transitional," maestro drops from first place because the rollout becomes a multi-session refactor.

## Provenance

- **Lens slate dispatched on.** 2026-05-16 (per all three lens `date` fields, pre-migration).
- **Strategist.** Not recorded. These lenses predate the `/domainspec-subagents-strategy` skill's bootstrap convention; no strategist file exists. Original dispatch prompts are unrecoverable — see `dispatch_status: backfilled-no-prompt-recoverable` on each findings file.
- **Lens count.** 3 (01, 02, 03). One lens per target repo; no corroboration or adversarial re-dispatches.
- **Notable absences.** No lens dispatched on: (a) house_project's `internal_tools/` overlap with maestro's; (b) a side-by-side diff of the two ontology catalogs (maestro Appendix C vs framework `edge-catalog.md`); (c) the `.gitignore` treatment of maestro's symlinks (would clarify deployment-vs-convenience status).

## Connections

- `retrofits` → `../lenses/01-house-project-investigation/findings.md`
- `retrofits` → `../lenses/02-football-stats-investigation/findings.md`
- `retrofits` → `../lenses/03-maestro-trama-investigation/findings.md`
- `synthesizes` ← `../lenses/01-house-project-investigation/findings.md`
- `synthesizes` ← `../lenses/02-football-stats-investigation/findings.md`
- `synthesizes` ← `../lenses/03-maestro-trama-investigation/findings.md`
- `cited-by` → `research-synthesis.md`
- `cited-by` → `../discovery.md`
