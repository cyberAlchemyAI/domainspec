---
tags: [vault, ontology, edges, authoring, refactoring]
node_type: research
is_session: false
layer: ontology
nature: synthesis
status: draft
version: 1.0.0
last_updated: 2026-05-30
---

# Discovery — Edges Enforcement Refactoring

> Consolidates three rounds of explorer + reviewer + robot-talks dispatch (`research/round-1/`, `research/round-2/`, `research/round-3/`) into a single discovery README. The substance is in those research artifacts; this file remaps the round-3 explorer's research-artifact shape (Objective, §1–§9) onto `discovery-structure-constitution.md` §3's discovery shape and preserves every demotion, conditional, and candidate qualifier the dispatch chain landed on. `node_type: research` per round-3 reviewer agreement (both R3 reviewers confirm).

---

## Objective

Propose inverting the authoring authority for vault edges: today, edges live in two hand-authored places (body-prose hyperlinks AND `## Connections` tables); the proposal makes the body-prose hyperlink — annotated with the edge type via the markdown `title` attribute (`[text](path "edge-type")`) — the single authored surface, with `## Connections` regenerated mechanically. This research surfaces the constitutional, operational, and metacognitive surfaces a future amendment would need to touch — and the catalog-reconciliation precondition that blocks promotion to a consolidated discovery.

---

## Claim

Inverting edge authoring from `## Connections` table to body-prose `title`-attributed links localizes drift to a single mechanically-enforceable surface, contingent on prior catalog reconciliation (§9 B-1).

## Status

**Research-stage; promotion-blocked.** Round-3 dispatch returned writer-ready from both reviewers (`research/round-3/reviewer-1.md`: `accept-as-final`; `research/round-3/reviewer-2.md`: `accept-with-revisions (minor) — writer-ready`). The discovery **cannot promote** to a consolidated discovery until the sibling catalog-reconciliation node (§9 B-1) closes. What would move it: a sibling research/audit/amendment node addresses B-1's three sub-items (count residue; off-catalog edge route; source-type column completeness) and reaches `status: active` or `closed`.

## Summary

The dual-surface authoring regime (body prose + `## Connections` table on each endpoint) has accumulated visible drift: the `inverse-edge-fix` discovery catalogs ~90 missing-inverse edges plus three high-traffic sinks with no `## Connections` block at all. The proximate structural cause — surface distance — is real, but the load-bearing factor is *authoring rate* (Reframing R-2): inverting authority moves where drift accumulates without changing the rate at which it accumulates. The proposal's earned claim is therefore not "eliminates drift" but "localizes drift to a single surface where mechanical enforcement (linter, CI, on-build derive) can act on it."

The proposal's carrier is the CommonMark `title` attribute on inline body links (`[text](url "edge-type")`) — chosen because no existing constitution forbids it, every CommonMark-compliant AST parser preserves it, and the existing `ontology-conventions.md` §8 carve-out shape (path-prefix-keyed, frontmatter-keyed) admits a third mechanism (title-attribute presence) without breaking. Cost acknowledged in AC-3: the `title` attribute is repurposed from human-readable tooltip to machine-readable edge type; measured baseline shows zero existing vault links use `title` for human-readable purposes, so the loss is prospective.

What R3 changed relative to R1/R2: (i) §4 is demoted from "Operational spec" to "Operational sketch" — concrete enough to attack but not concrete enough to implement without prototype contact on 5 vault files (no `vault-ctl edges derive` exists, TD-2); (ii) the catalog-count residue (OQ-10 in R2) is promoted from tracked debt to §9 B-1 blocking dependency — Reframing R-3, the load-bearing reframing of the round, recognizes the Appendix C catalog as a co-evolving artifact this proposal must reconcile with first, not a fixed background invariant; (iii) `contradicts` posture-change becomes AC-10 (constitutional) + §4.3 dedup mechanism (operational), closing the §3-vs-§4 boundary violation R2 surfaced; (iv) D-3 ("preserve the Appendix C catalog as-cataloged") carries an inline "Demoted this round … conditional on §9 catalog-reconciliation closure" disclaimer; (v) D-10 demotes the §Connections row toward `inverse-edge-fix` from `supersedes` to `cites` because the catalog forbids `supersedes` from a `research` source and forbids "partial" wholesale semantics.

What this discovery does **not** do: it does not draft constitutional amendment text (per `discovery-structure-constitution.md` §6 — discoveries surface candidates); it does not implement the derivation pipeline; it does not migrate the existing edge corpus (D-6 — out of scope); it does not pick a regenerated-region marker convention (TD-11 + OQ-14 — three exits surfaced, none picked); it does not promote itself (§9 B-1 blocks).

## Lenses

This is `node_type: research`; the round-1/2/3 explorer + reviewer + robot-talks artifacts in `research/` are the dispatched lenses. Each round's `robot-talks.md` is the synthesis that bounded the next round.

- [research/round-1/explorer.md](research/round-1/explorer.md) — origin proposal. Round-1 OQ-1 (forward-only authoring), OQ-3 (description-field semantics), OQ-4 (multi-type same-pair dedup), OQ-6 (`inverse-edge-fix` relationship) closed downstream.
- [research/round-1/robot-talks.md](research/round-1/robot-talks.md) — round-1 synthesis. Named 4 dead metaphors (DM-1 SoT, DM-2 drift, DM-3 catalog, DM-4 pipeline); §8 Reframings (added in R3) confronts all four explicitly.
- [research/round-2/explorer.md](research/round-2/explorer.md) — R1-revision. Introduced D-1 through D-9, §4 operational spec, the Round-2 `## Connections` table whose three catalog-source-type violations triggered R3's demotions.
- [research/round-2/reviewer-1.md](research/round-2/reviewer-1.md) — constitutional-coherence review. N-1/N-2/N-3 drove the R3 §Connections demotions to `cites`; N-4 drove AC-10; N-5 drove D-3 demotion; N-6 drove §4.5 constitutional anchor.
- [research/round-2/reviewer-2.md](research/round-2/reviewer-2.md) — operational-viability review. NF-1 drove §4.1 marker-convention demotion + TD-11; NF-2 drove D-7 fallback chain; NF-3 drove §4.3 contradicts mechanism; NF-4 drove AC-9-bis; NF-5 drove AC-N + §9 B-1; NF-6 drove §4.2 AST authority.
- [research/round-2/robot-talks.md](research/round-2/robot-talks.md) — round-2 synthesis. Two non-negotiable structural demotions (§4 → sketch, OQ-10 → §9 blocker) became R3's preconditions; both executed.
- [research/round-3/explorer.md](research/round-3/explorer.md) — R2-revision. The substance this discovery remaps. Executes both R2 structural demotions; adds §8 Reframings + §9 Blocking Dependencies; composes AC-10 + §4.3 contradicts fix; introduces AC-N catalog-absorption candidate and AC-11 conditional catalog-extension.
- [research/round-3/reviewer-1.md](research/round-3/reviewer-1.md) — round-3 constitutional review. Verdict `accept-as-final`. 6/6 R2-R1 findings closed. Dead-metaphor verification: R-2 and R-3 killed; R-1 and R-4 named-but-not-killed. Strongest residual: the `governed-by` row exception (N3-1).
- [research/round-3/reviewer-2.md](research/round-3/reviewer-2.md) — round-3 operational review. Verdict `accept-with-revisions (minor) — writer-ready`. 7/9 R2-R2 findings fully closed; 1 partial (NF-5 → NR3-1 count framing); 1 unchanged (Regression-2 TD-9). §4 demotion honest at the per-element level.
- [research/round-3/robot-talks.md](research/round-3/robot-talks.md) — round-3 synthesis. Writer-readiness convergent verdict. Composition non-negotiables and prohibitions that bound this discovery's text.

## Amendment candidates surfaced

Per `discovery-structure-constitution.md` §6: a discovery surfaces candidates; it does not draft amendment text. The full list lives in `research/round-3/explorer.md` §3; the load-bearing summary:

- **AC-1** — `ontology-conventions.md` §8 Directionality Principle posture change: both sides remain visible in Markdown; only one side is authored. Candidate.
- **AC-2** — New §8 subsection: "Typed body links — authoring rules" (syntax, scope, untitled-is-prose, inverse generated). Candidate.
- **AC-3** — Acknowledge the a11y/tooltip repurposing. Candidate.
- **AC-4** — Description-field handling: name D-7 picked option (enclosing sentence with 5-element fallback chain). Candidate.
- **AC-5** — Edge-class-specific derivation rules (retrofits forward-only; subclass-of tree check post-derivation). Candidate.
- **AC-6** — Cross-reference `frontmatter-ownership-constitution.md` Rule 6 (single ownership of carve-out predicates). Candidate.
- **AC-7** — Forward-only authoring (body links carry the catalog forward name only; inverse-name titles linter-rejected). Candidate.
- **AC-8** — Cutover ordering: AC-1 + AC-2 are **gated** on migration pass having run at least once AND AC-N having completed AND §9 catalog-reconciliation having closed. Candidate.
- **AC-9** — Partial supersession of `inverse-edge-fix` Tier 2. Candidate. Note: §Connections row demoted to `cites` because the catalog forbids `supersedes` from a `research` source; partial-supersession claim carried in D-10 prose only.
- **AC-9-bis** — Tier 1 sequencing directive for `inverse-edge-fix`. **Conjecture, not commitment.** Awaits §9 closure. Two routes named (Tier 1 continues with idempotency-marker format; or Tier 1 pauses); proposal does not pick. OQ-16 surfaces the question.
- **AC-10 (NEW R3)** — Authoring Rule 3 amendment: `contradicts` becomes derive-from-either-side. **Candidate. Not drafted here.** The mechanism that implements the relaxation is §4.3 of the round-3 explorer (canonical-pair via lex order; alphabetically-first description wins; discarded description logged; symmetric projection; post-projection validation). Closes the §3-vs-§4 boundary violation R2 surfaced.
- **AC-11** — Catalog amendment to admit "partial supersession" semantics. **Conditional candidate.** Raised so the catalog-extension option is visible; not adopted by this proposal.
- **AC-N (NEW R3)** — Catalog absorption of `proposes-edit` (and audit of off-catalog edge names). **Candidate (conditional on §9).** Picks route (b) absorb; withdrawn if §9 picks route (a) reject. OQ-13 surfaces the conditionality.

## Reframings

Per round-3 robot-talks dead-metaphor verification: 2 of 4 R1 metaphors genuinely killed (R-2, R-3); 2 of 4 named-but-not-killed (R-1, R-4). All four are carried explicitly; none are silently fixed.

### R-2 (operationalized) — Drift = authoring rate, not surface distance

What was implicit in R1/R2: drift is "the table is far enough from the prose that authors edit one and forget the other." Inverting which surface is authoritative would, on that frame, eliminate drift. What replaces it: distance is a contributing factor; the load-bearing factor is the *rate* at which edges enter the corpus in a coherent state. Inverting authority moves where drift accumulates without changing how fast it accumulates. Bound into the Summary above and into Claim ("localizes drift … contingent on prior catalog reconciliation") rather than "eliminates drift." This shift is load-bearing across §1 and §5 of the round-3 explorer.

### R-3 (operationalized, load-bearing) — The catalog is a co-evolving artifact, not a fixed invariant

What was implicit: D-3 ("preserve the Appendix C catalog unchanged") treated the catalog as a stable referent. What replaces it: the catalog disagrees with itself (21/22/25 count) and with the corpus that uses it (off-catalog edges including in the constitution's own §8 prose). A proposal that claims to preserve the catalog cannot proceed against an internally-inconsistent referent. Bound into D-3 (demoted with inline disclaimer), §9 B-1 (added as blocker), AC-N (absorption candidate), AC-11 (conditional catalog-extension), and AC-8 (cutover extended to gate on §9). This is the round's clearest dead-metaphor killing — operationalized across five body surfaces.

### R-1 (named, not killed) — SoT is not unqualified good for edges with descriptions

What is named: SoT is the correct shape for *edge declarations* (type + source + target) but not automatically for *edge descriptions* where the cost of forced SoT is 40% information loss. The valid frame: edges have two parts (pointer and rationale), and the parts have different authoring economies. **What did not change:** D-7 still picks option (a) for v1; the picked-option rationale paragraph still leans on SoT framing rather than R-1's "v1 amendment cost" reframing. Follow-up routing: minor wording update to D-7's trade-off paragraph (sketch-territory per R3-R1; writer's discretion per R3-R2). Not killed this round.

### R-4 (named, not killed) — The pipeline is not a singular object

What is named: there are at least three distinct pipelines or pipeline-phases — materialization (`vault-ctl edges derive` rewriting regenerated regions), validation (post-derivation invariant checks, mechanically independent of rewriting), bootstrap (the marker-insertion sub-tool). §4.5 D-9's "on-build for v1" is really three independent timing choices bundled under one name. **What did not change:** §4 of the round-3 explorer still treats the pipeline as singular; D-9 still picks one timing for all three. Follow-up routing: decomposition of D-9 into D-9a (materialization timing), D-9b (validation timing), D-9c (bootstrap timing) is **Round-4 / sibling-discovery work, out of scope for this discovery**. Not killed this round.

## Open Questions

- **OQ-5** — Migration trap: links inside `## Connections` overwritten on regeneration. Unchanged from R1.
- **OQ-7** — Interaction with `documents-metadata-enforcement`: can the derivation pipeline share a host with the metadata pipeline? Unchanged.
- **OQ-9** — Sequencing footgun: AC-8 names the gating rule, but the question of *who enforces* the gating remains open.
- **OQ-11** — Sequencing between this research and `inverse-edge-fix` in-flight Tier 1. Partially addressed by AC-9-bis; conditional remains open until §9 closes.
- **OQ-12** — A11y / tooltip regression mitigation under AC-3.
- **OQ-13 (NEW R3)** — Does AC-N pick (b) absorb survive scrutiny? If §9 catalog-reconciliation picks route (a) reject instead, AC-N is withdrawn and 12 existing uses must be rewritten before any derivation pass. Decision-dependency this proposal cannot make alone.
- **OQ-14 (NEW R3)** — Is the §4.1 regenerated-region convention `<!-- BEGIN/END derived -->` worth retaining as a working placeholder (so reviewers attack a concrete form) or should it be stripped entirely (so reviewers attack the abstract idempotency property only)? TD-11 tracks the debt; OQ-14 tracks the question.
- **OQ-15 (NEW R3)** — Is D-7 fallback element 4 (table-cell description) operationally tractable for all 76 vault files with body tables? The rule terminates, but it doesn't terminate well (R3-R2 fallback-chain walkthrough: discards cross-column rationale). **Stays live; not pretended resolved.**
- **OQ-16 (NEW R3)** — Does AC-9-bis "Tier 1 continues" punt the sequencing question or answer it? Round-3 reviewers may attack AC-9-bis as a tautology ("Tier 1 continues until §9 closes, then we'll know"). Surfaced for attack.

(Round-1 OQ-1, OQ-3, OQ-4, OQ-6 remain closed; OQ-2 closed in R3 by §4.3 step 2 alphabetical canonical-pair rule; OQ-8 confirmed not re-introduced; OQ-10 promoted in R3 to §9 B-1.)

### Blocking dependency (B-1)

**This discovery cannot promote to a consolidated discovery until the following sibling node closes.** Tracked as a blocking dependency, not as tracked debt.

A sibling node — research, audit, or amendment, whichever the team picks — must reconcile the Appendix C edge catalog with itself and with the corpus. The blocker is **operationally specified, not hand-waved**:

1. **Count residue.** `ontology-conventions.md` line 322 says "21 forward edges"; line 556 says "22 forward edges"; manual enumeration of the three Appendix C subtables yields 25 (Epistemic 15 + Provenance 9 + Reference 1). At least two of the three sources are wrong. Reconciliation must pick the correct count, identify which inline claims to amend, and explain the discrepancy.
2. **Off-catalog edge propagation.** `proposes-edit` occurs in 12 places across 6 files, decomposing as **8 prose mentions** (inline-code-fenced `` `proposes-edit` `` tokens — inert under the §4 pipeline, which parses `title` attributes on body links, not prose strings) + **1 forward-only carve-out edge** (target = `.claude/skills/custom/frontmatter.md`, constitutionally legal per `ontology-conventions.md` §8 lines 297/303 which name `proposes-edit` as a valid carve-out example) + **3 vault→vault `## Connections` rows** (in `inverse-edge-fix.md` lines 203-205, targeting `ontology-conventions.md`/`confidence-levels.md`/`ontology-architecture-draft.md` — these are inside `## Connections` blocks which §4.2 forbidlists from edge parsing; they would be deleted by regeneration under TD-11 exit (b) and survive under exits (a) or (c)). The reconciliation must decide route (a) reject and rewrite the 3 vault→vault uses OR route (b) absorb `proposes-edit` into Appendix C with defined source/target/cardinality. `blocked-by` has 1 use in `inverse-edge-fix.md`; same routes apply at lower load.
3. **Source-type column completeness.** Whether `research`-typed nodes should be admitted as sources for `refines`, `supersedes`, and `governed-by` (the catalog rows currently exclude `research` from all three). If "yes," this proposal's `cites`-demoted §Connections rows could later be re-elevated and the `governed-by` row in `## Connections` (declared catalog gap below) becomes conformant. If "no," the demotions are permanent and the `governed-by` row stays an explicitly-flagged exception.

**Test of done.** A sibling node exists, has reached `status: active` or `closed`, addresses all three sub-items above, and is referenced from this discovery's `## Connections` via a `cites` or `derives-from` edge (whichever the reconciled catalog admits between this `research` node and the sibling).

**Why this is a blocker, not tracked debt.** D-3 ("preserved unchanged") is unevaluable until B-1 closes. This proposal cannot promote to a consolidated discovery against an internally-inconsistent catalog without inflating its own claims (subset rule, applied reflexively).

## Next Moves

Items below are surfaced for downstream actors (sibling nodes, future rounds, or implementation sessions). The discovery does not execute them.

- **Open the catalog-reconciliation sibling node (B-1).** Three sub-items above. Closure is the precondition for any promotion of this discovery.
- **B-2 — Prototype contact on 5 vault files (recommended, not blocking).** A ~50-line prototype that runs §4's sketch against files covering NF-1 (marker insertion), NF-2 (standalone-bullet links), NF-3 (`contradicts` dedup), NF-4 (in-flight Tier 1), NF-5 (off-catalog edges). The prototype's job is to surface what §4 forgot. Escalates to blocking only if a Round-3 reviewer finds §4 elements internally contradictory (escalation tested in R3-R2; B-2 does not escalate). Implementation work, not research.
- **TD-9 — Migration measurement.** Sampling of how many existing prose links would retroactively qualify as edges if titled. Unchanged R2 → R3; v0.2 / sibling-measurement node.
- **TD-10 — `contradicts` dedup discard-rate empirical check.** Composes with B-2.
- **TD-11 — Marker convention.** Three exits open: (a) cite a markdown-tool prior art for `<!-- BEGIN/END derived -->`; (b) treat marker insertion as migration debt with full `## Connections` regeneration until corpus-bootstrapped; (c) sequence marker insertion with `inverse-edge-fix` Tier 1. **Discovery does not pick.** All three carried forward.
- **R-1 wording update** to D-7's picked-option rationale paragraph (lean on "v1 amendment cost" rather than "SoT is intrinsically better"). Sketch-territory per R3-R1; writer's discretion. Not blocking.
- **R-4 decomposition of D-9** into D-9a (materialization timing), D-9b (validation timing), D-9c (bootstrap timing). Round-4 follow-up or sibling discovery on pipeline decomposition. New research, **out of scope for this discovery**.
- **NR3-2 — `contradicts` multi-site composition sentence.** One-sentence gap in §4.3 of the round-3 explorer: for `contradicts`, after canonical-pair-source selection, the same-source first-occurrence rule applies as for any other same-pair-same-type dedup. Add as v0.2 refinement or as an OQ on the eventual consolidated discovery. Minor.
- **AC-11 catalog-extension for "partial supersession".** Conditional candidate; raised, not adopted. Depends on what B-1 decides.
- **Premise candidates.** None promoted this round. The headline Claim ("localizes drift … contingent on §9 B-1") is conditional and not yet testable; promotion to a premise depends on (i) B-1 closure removing the conditional and (ii) a measurement spec for "drift localized."

---

## Connections

> **Authoring note.** Per the proposal's own logic, this section should be derived from typed body links in the body prose above. Since the derivation pipeline does not exist (TD-2) and migration is out of scope (D-6), this round hand-authors the table in the legacy form. The table is restricted to `cites` per the catalog's source-type column for a `research` node, with one explicitly-declared exception (`governed-by`) routed to §B-1 sub-item 3. This is the same self-honesty disclaimer the round-3 explorer carried — preserved here rather than smoothed out, because smoothing it out would erase a load-bearing exhibit for the B-1 argument that the catalog is internally inconsistent.

| Document | Type | Description |
|---|---|---|
| [research/round-3/explorer.md](research/round-3/explorer.md) | `cites` | Round-3 explorer — the substance this discovery remaps onto discovery shape. Both R3 reviewers writer-ready. Executes the two R2-robot-talks non-negotiable structural demotions (§4 → sketch; OQ-10 → §9 blocker), composes AC-10 + §4.3 contradicts fix, adds §8 Reframings and §9 Blocking Dependencies. |
| [research/round-3/reviewer-1.md](research/round-3/reviewer-1.md) | `cites` | Round-3 constitutional-coherence review. Verdict `accept-as-final`. Drives the writer's preservation discipline on the `governed-by` row (N3-1), the AC-N conditional (N3-2), the AC-9-bis "conjecture, not commitment" framing (N3-3), and the dead-metaphor verification that puts R-1 and R-4 in named-but-not-killed state. |
| [research/round-3/reviewer-2.md](research/round-3/reviewer-2.md) | `cites` | Round-3 operational-viability review. Verdict `accept-with-revisions (minor) — writer-ready`. Drives the `proposes-edit` 8/1/3 count breakdown (NR3-1) carried in §B-1 sub-item 2 above. §4 demotion honesty test (per-subsection) and D-7 fallback chain walkthrough against real vault files ground the writer-readiness claim. |
| [research/round-3/robot-talks.md](research/round-3/robot-talks.md) | `cites` | Round-3 synthesis. Both reviewers writer-ready; 6/6 R2-R1 closed; 7/9 R2-R2 closed. Writer brief verbatim, composition non-negotiables (12 items), composition prohibitions (10 items), and dead-metaphor disposition (2 killed, 2 named-not-killed) are the spec this discovery composed against. |
| [research/round-2/robot-talks.md](research/round-2/robot-talks.md) | `cites` | Round-2 synthesis whose two non-negotiable structural demotions (§4 → sketch, OQ-10 → §9 blocker) were R3's preconditions and are now executed and verified by both R3 reviewers. The 10-item revision agenda is closed (10/10 per R3-R1). |
| [../../ontology-conventions.md](../../ontology-conventions.md) | `cites` | The Appendix C edge catalog and §8 Directionality Principle are the constitutional baseline this proposal proposes to extend (AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-10, AC-N). Demoted from `refines` because the catalog source-type column for `refines` excludes `research`; the "refines" relationship is real but cannot be typed by this `research` node without an AC-11-style catalog extension — carried in the body prose instead. |
| [../domainspec-vault-edges/discovery.md](../domainspec-vault-edges/discovery.md) | `cites` | The Appendix C edge catalog adopted by D-1 of that discovery is the baseline this proposal claims to preserve (modulo §B-1 reconciliation). A-3 SQL-layer-inference rejection is addressed via the constitution's own "local readability" framing. A-4 `Scope`-column rejection confirmed not re-introduced (closed via D-7 fallback chain mechanism, not via a new column). |
| [../inverse-edge-fix/inverse-edge-fix.md](../inverse-edge-fix/inverse-edge-fix.md) | `cites` | Demoted from R2's `supersedes` because the catalog forbids `supersedes` from a `research` source AND forbids "partial" wholesale semantics. The partial-supersession claim (Tier 2 dissolved; Tier 1 sequencing per AC-9-bis; Tier 3 independent) is carried in body prose only. NR3-1 evidence: 3 of the 12 `proposes-edit` corpus occurrences are `## Connections` rows in this file (lines 203-205) — the only load-bearing operational exposure under §4 of the round-3 explorer. |
| [../documents-metadata-enforcement/documents-metadata-enforcement.md](../documents-metadata-enforcement/documents-metadata-enforcement.md) | `cites` | Adjacent enforcement discovery; OQ-7 names the question of whether the derivation pipeline proposed here can share a host with the metadata pipeline proposed there. |
| [../../constitution/edge-acyclicity-constitution.md](../../constitution/edge-acyclicity-constitution.md) | `cites` | Acyclicity is preserved unchanged by this proposal; the derivation pipeline must continue to feed `vault-ctl cycles check` the same edge graph it sees today. |
| [../../constitution/frontmatter-ownership-constitution.md](../../constitution/frontmatter-ownership-constitution.md) | `cites` | The derivation does NOT extend frontmatter; it rewrites a body section. Per AC-6, the pipeline consumes carve-out predicates from `vault_common.frontmatter.carveouts` (Rule 6) rather than reimplementing them, preserving single ownership. |
| [../../constitution/discovery-structure-constitution.md](../../constitution/discovery-structure-constitution.md) | `governed-by` | This research's shape (frontmatter, structure, the discovery → constitution promotion-path discipline that motivates "candidates" not "drafts" in Amendment candidates above) follows the discovery-structure constitution. Per §6: "A discovery does not promote itself … Actually creating those files is a separate, deliberate act." `governed-by` source-type per catalog: `discovery, implementation-plan, spec` — **caveat:** this `research`-typed node is technically not in the listed source set; raised as sub-item of §B-1 sub-item 3 (source-type column completeness). For this discovery we accept the catalog gap rather than demote to `cites`, because `governed-by` carries semantically-load-bearing constitutional binding that `cites` does not encode, and §B-1 is the natural place to surface the gap. This row is functioning as the discovery's own exhibit for B-1 sub-item 3; demoting it silently would erase that exhibit. |
