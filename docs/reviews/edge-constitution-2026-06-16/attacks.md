# Edge Constitution Red-Team — Attacker Returns (verbatim)

Target: `implementation/domainspec/vault/constitution/edge-constitution.md`
Date: 2026-06-16
Synthesizer: Leinster, Tom (robot_talks role performed inline; peer SendMessage unavailable)

---

## Attacker 1 — Ashby (fidelity / governance)

F1 stale DRY pointer + DRY is maturity-gated (conventions "redundancy is Friend at draft/active"; doc is exploratory) — MINOR→MAJOR. F2 edge-count contradiction: G1 says "22 forward edges (40 names)"; conventions §8 says 21, Appendix C says 22 — MAJOR. F3 §5 acyclicity table is NATIVE new data (Appendix C has no acyclicity column), so "governs, does not copy / Appendix C is the data" overclaims for §5 — MAJOR. F4 §5 mints ~10 new enforceable acyclicity invariants inline, bypassing the schema-evolution/discovery gate that G4 mandates for everyone else (only a soft "pending review" note) — MAJOR (load-bearing). F5 governs-rationale cleanup correct, no defect. F6 §9 gate self-consistent; predecessor is a dangling half-superseded node now (no superseded-by) — MINOR. F7 NEGATIVE: precedence is non-circular, no authority overreach — attack failed (clean).

---

## Attacker 2 — Mac Lane (mechanics / correctness)

CRITICAL claim: "continues-from appears in BOTH the acyclic row AND the non-acyclic row of §5" — internal contradiction. [NOTE FOR YOU: verify this against the literal §5 table; the 'no' row may NOT contain continues-from — if so this is a FALSE POSITIVE to drop.] MAJOR: creates/modifies/continues-from asserted acyclic but Appendix C has Source=session Target=any N:M, permitting session→session cycles; acyclicity is STIPULATED not catalog-entailed, yet not flagged "pending review." MINOR: "40 names" miscount — by the doc's own logic should be 42 (contradicts symmetric, retrofits inverseless); "22 forward" is correct. VERIFIED CLEAN: C1 provenance enumeration complete (9 edges), C2 sound, all four §3 unconstructible examples genuinely forbidden, three-way-split claim exact, deterministic acyclic verdicts for derives-from/supersedes/part-of/subclass-of/governs/codified-as/operationalized-by/implements/validates/refines/synthesized-by.

---

## Attacker 3 — Bourbaki (ownership / reference-integrity)

CRITICAL #1: §6 validator names — vault-ctl real CLI (internal_tools/vault_ctl/cli.py) exposes `validate`, `edges-check`, `snapshot`, `status`, `cycles check`, `cycles report`. The doc's `vault-ctl edges lint`, `edges typecheck`, `edges asymmetry` DO NOT EXIST (no `edges` group; real cmd is `edges-check`). Only `vault-ctl cycles check --strict` resolves. CRITICAL #2: derives-from target `vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md` does NOT exist — it's a directory; real file is `.../01-invariants-and-layer-alignment/findings.md`. Broken in frontmatter AND Connections, inherited from predecessor. MAJOR #4: §3 line 79 etc. hard-code endpoint facts from Appendix C ("admits only …→skill") = concrete duplication/drift hazard despite "never copies." MAJOR #5: D1 dangling — edge-acyclicity-constitution.md is still status:exploratory with NO ## Connections block, so the `supersedes` edge is asymmetric now. MINOR: Connections block otherwise conforms (supersedes pair valid 1:1; G1 vocab ok). CLEAN: cycles check resolves; supersedes endpoint valid; derives-from→ontology-conventions.md resolves.
