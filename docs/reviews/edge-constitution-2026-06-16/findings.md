# Edge Constitution Red-Team — Synthesized Findings

Target: `implementation/domainspec/vault/constitution/edge-constitution.md` (status: exploratory, v0.1.0)
Date: 2026-06-16
Synthesizer: Leinster, Tom — cross-examined three attacker sets, deduped overlaps, verified the one CRITICAL contradiction against the literal source.

## Cross-examination summary

- **Mac Lane CRITICAL ("continues-from in both §5 rows") — LIKELY-FALSE-POSITIVE, DROPPED.** Verified against the literal §5 table. The acyclic-**yes** row (line 108) reads: `codified-as, operationalized-by, implements, validates, refines, synthesized-by, creates, modifies, continues-from`. The acyclic-**no** row (line 111) reads: `corroborates, alternative-to, revisits, refutes, surfaces-conflict, opens-question, closes-question, consumes, retrofits`. `continues-from` appears **only** in the yes row; it is absent from the no row. No double-listing. Mac Lane's own MAJOR (acyclicity stipulated, not catalog-entailed) is the real, surviving form of this concern — see #4.
- **Three confirmed overlaps merged:** the count defect (Ashby F2 + Mac Lane MINOR -> #3), §5-native-data / hard-coded endpoints (Ashby F3 + Bourbaki #4 -> #6 & #7), dangling predecessor (Ashby F6 + Bourbaki #5 -> #5).
- **Independently verified by me:** Bourbaki CRITICAL #1 (CLI surface — confirmed against `cli.py`: no `edges` typer group; commands are `validate`/`edges-check`/`snapshot`/`status` plus mounted `cycles`); Bourbaki CRITICAL #2 (path is a directory; `findings.md` is the real file); Bourbaki #5 / Ashby F6 (edge-acyclicity-constitution.md has no `## Connections` block).
- **Demotions:** Ashby F1 (stale DRY pointer) held at MINOR, not MAJOR — the maturity-gating argument is real but the pointer is cosmetic and self-corrects on promotion; evidence too thin for MAJOR.

---

## Per-artifact findings: edge-constitution.md

| # | file:line | evidence (quoted) | severity | proposed fix | raised by |
|---|---|---|---|---|---|
| 1 | edge-constitution.md §6 L123-127 | `vault-ctl edges lint` / `edges typecheck` / `edges asymmetry` — verified: `cli.py` has no `edges` typer group; real commands are `validate`, `edges-check`, `snapshot`, `status`, and mounted `cycles {check,report}` | **CRITICAL** | Re-map validators to the real surface: G1/G2/G5/G3 -> `vault-ctl edges-check`; C1-C3 + D1 -> mark "validator not yet built" (no typecheck/asymmetry command exists), do not name a phantom command; S* -> `vault-ctl cycles check --strict` (already correct) | Bourbaki #1 |
| 2 | edge-constitution.md L12 (frontmatter `derives-from`) + L186 (Connections) | target `.../lenses/01-invariants-and-layer-alignment.md` — verified: that path is a **directory**; the real node is `.../01-invariants-and-layer-alignment/findings.md` | **CRITICAL** | Repoint both the frontmatter `derives-from` and the Connections row to `.../01-invariants-and-layer-alignment/findings.md`; also fix the inherited copy in `edge-acyclicity-constitution.md` L11 | Bourbaki #2 |
| 3 | edge-constitution.md §2 G1 L52 | "The 22 forward edges (40 names with inverses) are the complete set." — conflicts with conventions §8 ("21"); and "40 names" miscounts (`contradicts` symmetric = 1 name not 2; `retrofits` inverseless) -> should be 42 by the doc's own logic | **MAJOR** | Reconcile the forward count against Appendix C as single source (22 per Appendix C / 21 per conventions §8 must first be resolved upstream), and recompute the name total honoring the symmetric+inverseless cases — or drop the parenthetical count entirely and cite Appendix C | Ashby F2 + Mac Lane MINOR |
| 4 | edge-constitution.md §5 L101-108 (`creates`, `modifies`, `continues-from` rows) | asserted "yes (acyclic)" but Appendix C admits Source=session / Target=any at N:M, which permits session->session cycles; acyclicity is **stipulated**, not catalog-entailed, yet not flagged "pending review" | **MAJOR** | Either move `creates`/`modifies`/`continues-from` under the §5 "pending review" provenance note (`continues-from` is already listed in the note L115, `creates`/`modifies` are NOT), or add an explicit stipulation-vs-entailment caveat for these provenance edges | Mac Lane MAJOR |
| 5 | edge-acyclicity-constitution.md (whole file) | verified: status:exploratory, **no `## Connections` block**, no `superseded-by` inverse — so this doc's `supersedes` edge (L185) is asymmetric per its own D1 | **MAJOR** | Until the predecessor is deprecated with a written `superseded-by` inverse (already a §9 promotion gate), the `supersedes` edge violates D1; add the inverse block to the predecessor on ratification, or downgrade the edge to a forward-only note while exploratory | Ashby F6 + Bourbaki #5 |
| 6 | edge-constitution.md §5 table L101-111 vs §2 L58 / §8 L149 | §5 acyclicity column is **native data** (Appendix C has no acyclicity column), contradicting "never copies its rows … Appendix C *is* the data" — acyclicity is genuinely owned here, but the framing overclaims pure-governance | **MAJOR** | Add one sentence to §2/§8 acknowledging §5 acyclicity is the one invariant whose data this constitution *originates* (not mirrored from Appendix C), and that it is therefore gated by §9 review — removes the self-contradiction | Ashby F3 + Mac Lane MAJOR |
| 7 | edge-constitution.md §3 L79 | "Appendix C admits only `… -> skill` for `operationalized-by`" hard-codes an Appendix C endpoint fact into prose, despite §8 "never copies its rows" -> drift hazard | MINOR | Phrase the example as a category-error pattern without quoting the specific admitted endpoint, or cite Appendix C as the live source for the endpoint | Bourbaki #4 |
| 8 | edge-constitution.md §5 L101-108 | §5 mints ~10 enforceable acyclicity invariants inline; G4 ("propose, don't coin") requires new edge facts to pass the discovery/schema-evolution gate, but here only a soft "pending review" note (L115) applies | MINOR | Acceptable for exploratory status given the §9 gate + L115 note already bind promotion; record explicitly that the §9 reviewer-confirmation step *is* the schema-evolution gate for these, closing the G4 tension | Ashby F4 (demoted from MAJOR) |
| 9 | edge-constitution.md §2 L58 | DRY pointer cites `ontology-constitution.md` discipline; conventions treat redundancy as "Friend at draft/active" and this doc is exploratory — pointer is stale/maturity-mismatched | MINOR | Soften or drop the DRY citation while exploratory; revisit on promotion | Ashby F1 (held MINOR) |

### Verdict: **FIX**  (2 CRITICAL + 4 MAJOR survive)

---

## Per-artifact findings: edge-acyclicity-constitution.md (predecessor, touched)

| # | file:line | evidence (quoted) | severity | proposed fix | raised by |
|---|---|---|---|---|---|
| 2b | edge-acyclicity-constitution.md L11 | inherits the same broken `derives-from: .../01-invariants-and-layer-alignment.md` directory path | MAJOR | Repoint to `.../01-invariants-and-layer-alignment/findings.md` (folded into #2) | Bourbaki #2 |
| 5b | edge-acyclicity-constitution.md | no `## Connections` block; cannot carry the `superseded-by` inverse the successor's §9 gate requires | MAJOR | On ratification of the successor, add `status: deprecated` + a `## Connections` block with the `superseded-by` inverse (folded into #5) | Bourbaki #5 / Ashby F6 |

### Verdict: **FIX**  (inherited from the successor's ratification; both items are already named in the successor §8/§9 as ratification obligations)

---

## Closing change-request list (severity order)

1. **[CRITICAL]** Fix §6 validator command names — replace the non-existent `edges lint/typecheck/asymmetry` with the real `edges-check` / `cycles check --strict`, and mark the C1-C3/D1 validators as not-yet-built rather than naming phantom commands. *(Bourbaki #1)*
2. **[CRITICAL]** Repoint the `derives-from` target from the `.../01-invariants-and-layer-alignment.md` directory to `.../01-invariants-and-layer-alignment/findings.md` — in this doc's frontmatter (L12), its Connections row (L186), and the predecessor's frontmatter (L11). *(Bourbaki #2)*
3. **[MAJOR]** Reconcile the edge count: 22-vs-21 forward (Appendix C vs conventions §8) and the "40 names" miscount (->42 by the doc's own symmetric/inverseless logic), or cite Appendix C and drop the inline number. *(Ashby F2 + Mac Lane)*
4. **[MAJOR]** Flag `creates`/`modifies`/`continues-from` acyclicity as stipulated-not-entailed (Appendix C session-source N:M permits session->session cycles); fold them into the §5 "pending review" note. *(Mac Lane)*
5. **[MAJOR]** Resolve the asymmetric `supersedes` edge — the predecessor has no `## Connections`/`superseded-by`; either complete the deprecation now or keep the edge forward-only while exploratory. *(Ashby F6 + Bourbaki #5)*
6. **[MAJOR]** Repair the "never copies / Appendix C is the data" overclaim by acknowledging §5 acyclicity is the one originated invariant, gated by §9. *(Ashby F3 + Mac Lane)*
7. **[MINOR]** Stop hard-coding the `operationalized-by -> skill` endpoint in §3 prose. *(Bourbaki #4)*
8. **[MINOR]** Record that §9 reviewer-confirmation is the schema-evolution gate for the inline §5 invariants. *(Ashby F4, demoted)*
9. **[MINOR]** Soften/drop the stale DRY pointer in §2 while exploratory. *(Ashby F1, held)*

**Dropped (false positive):** Mac Lane CRITICAL "continues-from double-listed across §5 rows" — verified absent from the no-row; no contradiction exists.

---

## Verifier pass (Gödel, Kurt) — zig-zag, loop 1

Findings 1–8 **SURVIVE** against the literal artifacts and live checks. One demotion, no refutations. The Mac Lane CRITICAL drop was confirmed correct (`continues-from` appears only in the §5 yes-row).

- **#1 CRITICAL — SURVIVES.** `internal_tools/vault_ctl/cli.py` exposes `validate`, `edges-check`, `snapshot`, `status` + mounted `cycles {check,report}`. No `edges` typer group. Only `cycles check --strict` (cycles.py:44) of the six §6-named validators resolves.
- **#2 CRITICAL — SURVIVES.** Disk has `.../lenses/01-invariants-and-layer-alignment/findings.md`; the bare `.md` path (frontmatter L12, Connections L186) is a directory → dangling.
- **#3 MAJOR — SURVIVES, evidence STRONGER.** Recounting Appendix C rows yields **25 forward edges** (15 epistemic + 9 provenance + 1 reference) — so conventions §8 ("21"), Appendix C header ("22"), AND this doc's G1 ("22 / 40 names") are *all wrong*. The "40 names" is also impossible (contradicts symmetric, retrofits inverseless → ~48). Fix should cite the recounted catalog and flag the count error upstream in conventions too.
- **#4, #5, #6 MAJOR — SURVIVE** exactly as stated (session→session constructible at N:M; predecessor has no Connections block; Appendix C has no acyclicity column).
- **#7, #8 MINOR — SURVIVE.**
- **#9 MINOR — DEMOTE to trivial.** `vault/constitution/ontology-constitution.md` exists; the DRY pointer resolves on disk, so "stale pointer" is too strong — at most a maturity-gating nuance.

**Final approver (parent) coverage audit:** all 3 declared lenses attacked the full target; refuted/false-positive findings were dropped (continues-from; F9 demoted); zero-findings flag NOT triggered. Change-request list accepted.

**Accepted verdict:** edge-constitution.md → **FIX** (2 CRITICAL + 4 MAJOR survive). edge-acyclicity-constitution.md → **FIX** (inherited path break + missing Connections, both already §8/§9 ratification obligations).
