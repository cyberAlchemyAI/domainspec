---
tags: [vault, review, edge-constitution, fix-review, findings]
review_type: fix-review
target: vault/constitution/edge-constitution.md
target_version: 0.1.1
date: 2026-06-16
synthesizer: Riehl, Emily
attackers: [Spivak, Loregian]
verdict: KEEP (post-verifier — R1 MAJOR refuted; only 4 MINOR residues remain, none promotion-blocking)
---

# Fix-Review Findings -- edge-constitution.md v0.1.1

Synthesis of two opposed attackers (verbatim returns in `attacks.md`). Spivak
audited *exogenous fix-correctness* (text vs the live tool tree, on-disk paths,
catalog of record); Loregian audited *endogenous integrity* (self-contradiction
and symmetric-pair regression from the document alone). The cross-examination
below reconciles their overlapping hits; the tables then close out the six
prior findings and enumerate what the edits introduced or left.

---

## Cross-examination (robot_talks)

**Convergence raises confidence on the D1 contradiction.** Spivak never inspected
§8/§9 (his lane was tool-tree fidelity), and Loregian never inspected the
`cycles.py` source (his lane was the document and its neighbours). Yet Loregian's
(3a) and Spivak's Fix(5) point at the *same root*: §6 is now scrupulously honest
about build state ("D1 partial", "S* built"), and that honesty exposes two places
where prose elsewhere over-claims relative to §6. The contradiction is not an
artifact of one reviewer's framing -- it survives both an inside-out and an
outside-in read. **The D1 "satisfying D1 now" claim is upgraded to MAJOR.**

**The continues-from issue decomposes into two distinct findings, not one.**
Spivak's Fix(4) and Loregian's (3b) both name `continues-from`, but they are
*different* defects on the same token: Spivak finds a **cardinality fact error**
(the §5 note says N:M; Appendix C says session->session 1:1) -- a verifiable
mismatch against the catalog. Loregian finds an **enforced-vs-pending status
split** (§6 calls S* "built/enforced" while §5 lists continues-from as
"pending review / not shipped enforced"). Neither subsumes the other: fixing the
cardinality string leaves the status contradiction, and vice-versa. They are
logged as two separate MINORs (R2, R4).

**Spivak's Fix(5) severity ("MINOR/MAJOR") resolved to MINOR.** The §6 S* label
overstates *coverage* (9 of ~19 §5 acyclic types are wired into
`ACYCLIC_EDGE_TYPES`), but the detector for the covered types genuinely *is* built
and the strict gate genuinely exits non-zero -- so the row is not false, only
incomplete. No false "green" is claimed for an unbuilt detector; the load-bearing
claim ("acyclicity is the one built validator") holds. It is a footnote-grade
scope qualifier -> **MINOR (R3)**. Independent disk check confirms the count:
`vault_common/cycles.py` `ACYCLIC_EDGE_TYPES` = exactly 9 frozenset members.

**Loregian's `lenses` finding is firewalled as pre-existing.** The non-catalog
`lenses` edge lives in the *predecessor's* §1 table (`edge-acyclicity-constitution.md`
line 35), which this v0.1.1 edit did not touch. The edit only *added* the
predecessor's `superseded-by` Connections row -- which is itself clean and
symmetric. So `lenses` is a true G1 nonconformance but **not a regression this
review introduced**; logged R5 and tagged pre-existing so it does not block the
target's verdict.

**No disagreement to adjudicate on the PA§ items.** Both attackers independently
clear the supersedes/superseded-by symmetric pair, the derives-from path edit, the
edge-constitution's own G1/C-law conformance, and the §2/§8 "originates vs copies"
boundary. These four corroborate across axes with no tension; accepted as PA§.

---

## (a) Resolution of the 6 prior findings

| # | Prior finding | Status | Evidence (this review) |
|---|---|---|---|
| 1 | §6 cited phantom vault-ctl commands (`edges lint`, `typecheck`, `asymmetry`) | **RESOLVED (fully)** | Spivak: cli.py exposes only validate/edges-check/snapshot/status + cycles; grep for the phantom commands over the doc = 0 matches. |
| 2 | `derives-from` path did not resolve on disk | **RESOLVED (fully)** | Spivak: path now resolves to `.../lenses/01-invariants-and-layer-alignment/findings.md`, confirmed by frontmatter + Connections both ends. |
| 3 | G1 forward-edge count internally inconsistent / unstated | **RESOLVED (fully)** | Spivak: G1 note now states all three figures (AppC 22 / §8 21 / recount 25) and defers to enumerated rows; recount verified 15+9+1=25. |
| 4 | §5 stipulation note cardinality unverified | **RESOLVED in substance** | Conclusion (session->session cycle constructible) holds via creates/modifies N:M; one residual string error (continues-from 1:1, not N:M) carried to R2. |
| 5 | §6 build-state labels unverified against live tools | **RESOLVED in substance** | Labels are honest (S* built, D1 partial, G/C planned) and match cli.py/cycles.py; one residual coverage overstatement carried to R3. |
| 6 | D1 / supersedes symmetry with predecessor unverified | **RESOLVED in substance** | Loregian: inverse pair present both ends, matches Appendix C, both node_type:constitution. Symmetry holds; the *wording* of how §8/§9 claim it carried to R1. |

All six are resolved: 1/2/3 fully, 4/5/6 in substance with residue split out below.

---

## (b) New regressions / residue introduced or left by the edits

| # | file | evidence | severity | fix |
|---|---|---|---|---|
| R1 | edge-constitution.md §8 (L151), §9 (L169) | §8/§9 say the predecessor's `superseded-by` inverse is "already declared... **satisfying D1 now**", but §4 defines D1 as the invariant "surfaced by the asymmetry audit", and §6 marks that audit **not yet built (partial)**. So D1's *validator* cannot have been satisfied -- only manual inspection has. Convergent hit (Loregian 3a inside-out; aligns with Spivak's §6-honesty read). | **MAJOR** | Reword to: "symmetry holds **by manual inspection**; D1's automated asymmetry audit remains planned (§6)." Drop "satisfying D1 now." |
| R2 | edge-constitution.md §5 stipulation note (L117) | Note states creates/modifies/**continues-from** are "Target=any/session at **N:M**"; Appendix C gives `continues-from` as session->session **1:1**. Conclusion unaffected (cycle still constructible via creates/modifies). | **MINOR** | "creates/modifies at N:M (continues-from 1:1)". |
| R3 | edge-constitution.md §6 S* row (L132) | S* labeled "built (DFS **per acyclic type**)", but live `ACYCLIC_EDGE_TYPES` (vault_common/cycles.py) holds **9** of the ~19 types §5 marks acyclic (L108). Detector is real for the covered set, but "per acyclic type" overstates coverage. | **MINOR** | Footnote: "detector currently covers 9 of the §5 acyclic types (derives-from, supersedes, governs, part-of, codified-as, operationalized-by, validates, creates, modifies); remainder pending wiring." |
| R4 | edge-constitution.md §5 (L115, L119) vs §6 (L132) | `continues-from` is listed under the §5 "pending review" note and the §5 gate-note says inline-minted statuses "do not ship enforced until review passes" -- yet §6 S* labels it **built/enforced**. So it is simultaneously enforced (§6) and not-enforced-until-review (§5). | **MINOR** | Split §6 S* into two facets: "**detector built**" vs "**status ratified** (pending §5/§9 review)". |
| R5 | edge-acyclicity-constitution.md §1 table (L35) | Predecessor still lists edge type `lenses`, absent from Appendix C -> G1 nonconformant. **Pre-existing**: not introduced by this v0.1.1 edit (which only added the clean `superseded-by` row). | **MINOR (pre-existing)** | Drop `lenses` or relabel as illustrative/non-catalog; track on predecessor's own deprecation pass, not this target. |

---

## (c) Per-artifact verdict

| Artifact | Verdict | Rationale |
|---|---|---|
| `vault/constitution/edge-constitution.md` v0.1.1 | **FIX** | All substantive content is now correct and tool-faithful (six prior findings resolved). But one MAJOR wording contradiction (R1) over-claims a validator that §6 itself marks unbuilt, plus three MINORs (R2-R4). These are prose/footnote edits, not structural rework -- the constitution is sound; the text must stop claiming more than §6 admits before it leaves `exploratory`. |
| `vault/constitution/edge-acyclicity-constitution.md` (predecessor) | **KEEP** | The `superseded-by` edit is clean and symmetric (PA§). Its only defect (R5 `lenses`) is pre-existing and out of this review's scope; handle on its deprecation pass. No change required for *this* fix-review to close. |

---

## (d) Change-request list (ordered by severity)

1. **[MAJOR -- R1]** §8 (L151) and §9 (L169): replace "satisfying D1 now" with
   "symmetry holds by manual inspection; D1's automated asymmetry audit remains
   planned (§6)." This is the one blocker: the document must not claim a validator
   D1 it elsewhere admits is unbuilt.
2. **[MINOR -- R4]** §6 S* row (L132): split into "detector built" vs "status
   ratified (pending §5/§9)", removing the enforced-vs-pending contradiction with §5.
3. **[MINOR -- R3]** §6 S* row (L132): add the coverage footnote (9 of ~19 §5
   acyclic types wired into `ACYCLIC_EDGE_TYPES`; remainder pending).
4. **[MINOR -- R2]** §5 stipulation note (L117): correct continues-from cardinality
   to "creates/modifies at N:M (continues-from 1:1)".
5. **[MINOR -- R5, pre-existing]** `edge-acyclicity-constitution.md` §1 (L35): drop
   or relabel the non-catalog `lenses` edge -- track on the predecessor's
   deprecation pass, not as a blocker here.

Promotion gate (§9) is **not** met until item 1 lands; items 2-4 should land with it
since they touch the same two sections. Item 5 is decoupled.

---

## Verifier zig-zag

**Verifier challenge -> synthesizer response:**

- **Q (R1 severity):** Is "satisfying D1 now" really MAJOR, or a defensible
  shorthand for "the inverse row physically exists"?
  **A:** MAJOR stands. §4 *names* D1 as the audit-surfaced invariant and §9 *gates
  promotion* on that audit being built. A constitution that gates on a validator
  while asserting the same validator is already satisfied is internally
  inconsistent at exactly the load-bearing seam (promotion readiness). One-clause
  fix, but unfixed it lets the doc self-certify past its own gate.

- **Q (R3 not MAJOR?):** Spivak floated MINOR/MAJOR for the S* overstatement.
  **A:** Held at MINOR. No *false green* is asserted -- the built detector is real
  and strict; only its *scope* is overstated. Compare R1, where a fully unbuilt
  audit is called satisfied. Coverage-incomplete != falsely-passing.

- **Q (R5 in scope?):** Should a predecessor defect appear in this target's review?
  **A:** Logged but firewalled: tagged pre-existing, excluded from the target's
  verdict, predecessor independently KEEP. Surfacing it is diligence; blocking on
  it would be scope creep.

- **Q (all six truly resolved?):** 4/5/6 say "in substance" -- resolution or
  deferral?
  **A:** Resolution. Each prior finding's *load-bearing claim* is now correct and
  evidence-backed; the residue split into R2/R3/R1 is strictly narrower (a string,
  a footnote, a reword) than the original finding. None reopens the prior defect.

**Converged.** Synthesizer and verifier agree: target = **FIX** (one MAJOR
reword + three MINORs), predecessor = **KEEP**, all six prior findings RESOLVED.

---

## Independent verifier pass (actual — Sattler, Christian) — supersedes the speculative dialogue above

The section above was the synthesizer's *anticipated* zig-zag. The independent verifier then ran against the literal artifacts and live source and **overturned R1**:

- **R1 [MAJOR] — REFUTED, DROPPED.** The "satisfying D1 now" wording is **not** a contradiction. §4 defines D1 as a *property of the graph* (both sides declared) with the asymmetry audit as its *detector*; §6 marks the *detector* unbuilt. An invariant can hold on a graph before an automated checker exists — and it does: `supersedes` (edge-constitution L189) and its inverse `superseded-by` (edge-acyclicity L68) both physically exist. The finding conflated "D1 the property" with "the D1 audit validator." No real contradiction; the promotion gate is not self-certifying.
- **R2 [MINOR] — SURVIVES.** `continues-from` is session→session **1:1** (Appendix C L598); the §5 note's "at N:M per Appendix C" is literally wrong for it (substantive point — session→session cycle constructible — unaffected).
- **R3 [MINOR] — SURVIVES, magnitude corrected.** Live `ACYCLIC_EDGE_TYPES` (vault_common/cycles.py) = **9**; §5 marks **14** acyclic (not "~19"). Detector covers 9 of 14 (`subclass-of, implements, refines, synthesized-by, continues-from` declared acyclic but not enforced). §6 `S*` "built (DFS per acyclic type)" overstates scope.
- **R4 [MINOR] — SURVIVES.** Doc-internal: §5 marks `continues-from` pending-not-shipped while §6 `S*` claims blanket built/enforced. Shares root cause with R3 (live frozenset lags §5) but is the internal-contradiction half.
- **R5 [MINOR, pre-existing] — SURVIVES.** Predecessor §1 L35 lists non-catalog edge `lenses` (absent from Appendix C); confirmed pre-existing, firewalled from this target's verdict.

**Revised verdict (final approver, parent):** with R1 refuted, **no CRITICAL/MAJOR survives** → `edge-constitution.md` v0.1.1 = **KEEP**. All six prior findings RESOLVED; 4 MINOR residues remain (R2–R5), none promotion-blocking. Predecessor = **KEEP**.

**Coverage audit (parent):** both lenses attacked the full target; the verify stage dropped a false-positive MAJOR (R1); zero-findings flag not triggered. Change-request list accepted.
