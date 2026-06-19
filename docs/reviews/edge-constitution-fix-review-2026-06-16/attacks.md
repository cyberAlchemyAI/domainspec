---
tags: [vault, review, edge-constitution, fix-review, red-team]
review_type: fix-review
target: vault/constitution/edge-constitution.md
target_version: 0.1.1
date: 2026-06-16
synthesizer: Riehl, Emily
attackers: [Spivak, Loregian]
---

# Fix-Review Attacks — edge-constitution.md v0.1.1

Two attackers re-ran against the v0.1.1 fixes. Returns are recorded verbatim
below; the cross-examination and verdicts are in `findings.md`.

The two axes are structurally opposed by design: **Spivak** attacks
*exogenous fix-correctness* — do the v0.1.1 edits match the live tool tree,
the on-disk paths, and the catalog of record? **Loregian** attacks
*endogenous integrity* — given only the document and its declared neighbours,
does the edited text contradict itself or regress a symmetric pair?

---

## ATTACKER 1 — Spivak (exogenous fix-correctness)

> **Fix (1)** §6 real vault-ctl commands + `cycles check --strict` exists + no
> phantom commands → **CORRECT** (cli.py exposes validate/edges-check/snapshot/status
> + mounted cycles; cycles.py has check --strict; grep for `edges lint|typecheck|asymmetry`
> over the doc = no matches). Note: real tool tree is
> implementation/domainspec/internal_tools/vault_ctl/.
>
> **Fix (2)** derives-from path resolves on disk to
> .../lenses/01-invariants-and-layer-alignment/findings.md (frontmatter +
> Connections) → **CORRECT**.
>
> **Fix (3)** G1 count statement (Appendix C 22 / conventions §8 21 / recount 25)
> → **CORRECT** (recounted: 15 epistemic + 9 provenance + 1 reference = 25).
>
> **Fix (4)** §5 stipulation note → **MOSTLY CORRECT, one false cardinality (MINOR)**:
> the note says creates/modifies/continues-from are "Target=any/session at N:M", but
> Appendix C gives `continues-from` as session→session **1:1**, NOT N:M. The
> load-bearing conclusion (session→session cycle constructible) still holds via
> creates/modifies (Target=any, N:M). Fix: "creates/modifies at N:M (continues-from 1:1)".
>
> **Fix (5)** §6 build-state labels → **MOSTLY CORRECT, one overstatement (MINOR/MAJOR)**:
> `S*` labeled "built (DFS per acyclic type)" but the live `ACYCLIC_EDGE_TYPES`
> (vault_common/cycles.py) is only **9 types** (derives-from, supersedes, governs,
> part-of, codified-as, operationalized-by, validates, creates, modifies), while §5
> declares ~19 acyclic. So "built / per acyclic type" overstates coverage. Fix:
> footnote that the detector currently covers 9 of the §5 acyclic types, remainder
> pending.

---

## ATTACKER 2 — Loregian (endogenous integrity / regression)

> **(1)** supersedes↔superseded-by SYMMETRIC → **PASS** (edge-constitution declares
> supersedes→predecessor; predecessor §Connections declares superseded-by→edge-constitution;
> inverse pair matches Appendix C; both node_type:constitution).
>
> **(2)** predecessor's new Connections block constructible → **PASS, one MINOR**:
> predecessor §1 table (pre-existing, NOT from this edit) still lists an edge type
> `lenses` that is not in Appendix C (G1 nonconformant). Fix: drop/illustrative-note.
>
> **(3a) MAJOR — cross-section contradiction**: §6 honestly marks the D1 asymmetry
> audit "not yet built / partial", but §8 and §9 assert the predecessor's superseded-by
> inverse is "already declared… satisfying D1 now." D1 is DEFINED (§4) as "surfaced by
> the asymmetry audit" — which is unbuilt. So "satisfying D1 now" is true only by manual
> inspection, not the validator D1 names. Fix: reword §8/§9 to "symmetry holds by manual
> inspection; D1's automated audit remains planned (§6)."
>
> **(3b) MINOR** — `continues-from` is in the §5 "pending review" note AND §6 `S*` is
> "built"/enforced, while the §5 gate-note says inline-minted statuses "do not ship
> enforced until review passes." So continues-from is simultaneously "enforced/built"
> (§6) and "not enforced until review" (§5). Fix: split §6 `S*` into "detector built"
> vs "status ratified (pending §5)."
>
> **(4)** edge-constitution's own Connections obeys G1 + C-laws after the path edit →
> **PASS**.
>
> **§2/§8** "originates §5 data" vs "never copies" → **PASS** (no residual contradiction).
