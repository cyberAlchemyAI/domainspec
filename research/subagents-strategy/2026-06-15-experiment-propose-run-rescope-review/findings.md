---
tags: [subagents-strategy, review, experiment-skill, propose-run-rescope]
node_type: research
is_session: false
layer: ontology
nature: technical
status: draft
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-15
---

# findings.md — review of the experiment propose/run re-scope changeset

Dispatch `2026-06-15-experiment-propose-run-rescope-review`. 3 tensioned attackers
(internal-coherence / completeness / governance-legitimacy, `robot_talks` declared) ⟂ 1 verifier
(zig-zag). Targets: the re-scoped `experiment/SKILL.md` (both copies) + the three 2026-06-15
constitution scope notes. Verbatim returns in `attacks.md`.

> **Degradation note (P14):** `robot_talks` declared on the attacker group, but the harness
> exposed no `SendMessage` — no live confront round ran. Cross-confrontation performed at synthesis
> by the parent; an independent verifier refuted each finding against the literal files. Disclosed
> in the close row.

## Verified findings (verifier verdicts applied)

| # | finding | severity | verifier | fix applied |
|---|---|---|---|---|
| B1 | P-SS-9 main sentence still asserted the freeze as the `designer→sequential→runner` edge — the very edge its own 2026-06-15 note says does not exist | MAJOR | UPHELD | Marked the clause **superseded 2026-06-15** in place, pointing to the note. |
| B1b | persistence-debt note "lacks a back-pointer" | MINOR | **REFUTED** | Dropped — the note already re-cites the MAIN's deferred pointer+hash. |
| B1c | grader-table-vs-body "contradiction" | — | REFUTED (no contradiction) | None — the split is stated at skill §grader; verdict vocab coherent across 6 sites. |
| B2-1 | the `experiment-promotion/discovery.md` (which the skill "operationalizes") is entirely the OLD single-dispatch model and was unannotated | MAJOR | UPHELD | Prepended a dated `[Scope update 2026-06-15]` note flagging the propose/run split + pointing to the type skill. |
| B2-2 | constitution §5 line 180 still describes experiment present-tense as "run a probe … and adjudicate" with all 4 roles as this dispatch (only annotated below, not marked) | MAJOR | UPHELD | Inserted a `[scope superseded 2026-06-15]` marker into the 2026-06-14 note. |
| B2-3 | router table row lists SURVIVED/FALSIFIED/INVALID with no propose/run split (both copies) | MINOR | UPHELD | Appended "(propose phase only — INVALID may be rendered here; SURVIVED/FALSIFIED at the downstream run)" to both copies. |
| B2-clean | tests/README/telemetry/agent-pool/register-dispatch | — | UPHELD clean | None needed (tests assert only experiment's `working_folder` requirement). |
| B3-i | §10.1 needs a document version bump; only dated notes added | MAJOR→**DOWNGRADED** | DOWNGRADED | §10.1's typo/prose carve-out plausibly covers annotating an already-LIVE type (no field/enum/status changed). Recorded the determination in the new §7 re-confrontation; **version bump left to owner**. |
| B3-iii | the §7 persistence debt was reasoned on a SURVIVED/FALSIFIED close that the re-scope falsifies; §7 requires a proponent×skeptic re-confrontation, not an inline note | MAJOR | UPHELD | Added a **propose/run re-scope re-confrontation** block to §7 re-deriving all three debts (P-SS-8 unchanged; P-SS-9 strengthened; persistence RELAXED at propose, re-attached to run), citing this review as the adversarial source. |
| B3-iv | dated owner notes record authority but post-§10 also need a bump | MINOR | UPHELD | Rolled into B3-i; the §7 process note states no five-surface promotion fires and leaves the version bump to the owner. |

## Verdict on the changeset

**FIX — applied.** The re-scope itself is internally coherent (B1c) and correctly filed in the
skill; the review's value was catching the **reconciliation gaps** my edits left: a stale clause in
P-SS-9 (B1), the unannotated discovery doc (B2-1), the un-marked §5 line 180 (B2-2), the router
table (B2-3), and — most substantively — the missing **§7 re-confrontation** (B3-iii). All are now
fixed in place; B1b dropped on refutation; B3-i (version bump) left as a flagged owner decision.

## Residue / owner call

- **Document `version` bump (B3-i).** Contested under §10.1's carve-out. Left at `0.6.0-proposal`
  with the determination recorded in §7. If the owner deems the propose/run split a principle-level
  change, bump to `0.6.1` and add a §11-style versioned amendment row.
- **The run phase itself is undesigned.** The skill and constitution now point at a downstream run
  (runner + adjudicator → `experiment.md` + `findings.md`, SURVIVED/FALSIFIED) that does not yet
  exist as a dispatch type/mode. That is the next design step, not a defect of this changeset.
- **`.github/skills/` variant** of the router was not touched (it is a different single-mode
  variant); confirm whether it is live before reconciling.
