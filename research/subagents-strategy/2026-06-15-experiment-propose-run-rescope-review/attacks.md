---
tags: [subagents-strategy, review, experiment-skill, propose-run-rescope]
node_type: research
is_session: false
layer: ontology
nature: technical
status: draft
veracidade: high
convicção: medium
version: 0.1.0
last_updated: 2026-06-15
---

# attacks.md — verbatim attacker + verifier returns

Dispatch `2026-06-15-experiment-propose-run-rescope-review`. Cited change-requests in `findings.md`.

## B1 — internal-coherence (verbatim summary)

- (i) grader table vs body — **NOT a contradiction**: skill §grader states "this dispatch owns …
  internal-validity + reproducibility-by-design half … falsification is rendered later, by the run."
- (ii) freeze/artifact sections keep the runner downstream — **clean**.
- (iii) **MAJOR** — P-SS-9 MAIN still asserts "data-flow topology (the `designer →sequential→
  runner` edge)" while its own appended note says "not a `designer→runner` edge (there is no runner
  in a propose dispatch)". Superseded but left standing as present-tense prose — a §10-class
  doc-vs-doc drift inside governance text. Fix: strike/tag the clause.
- (iii-b) persistence-debt MAIN vs note — clean supersession (MINOR; back-pointer suggested).
- (iv) verdict vocabulary INVALID@propose / SURVIVED@FALSIFIED@run — **coherent across 6 sites**.

## B2 — completeness / stale-reference hunt (verbatim summary)

- **MAJOR-1** — `internal_tools/.../docs/discovery/experiment-promotion/discovery.md` entirely the
  OLD model, unannotated (L100-104 "roda uma sonda … e adjudica"; L126-128 designer→runner edge;
  L189 canonical `designer→runner→adjudicator`; L191/L222 adjudicator verdict matrix). The skill
  "operationalizes" this discovery (its Connections row) yet contradicts it.
- **MAJOR-2** — constitution line 180 still reads "run a probe … and adjudicate survived-vs-
  falsified" with all 4 roles as this dispatch; only annotated by line 182, not marked.
- **MINOR-3** — router table line 48 (both copies) lists "SURVIVED/FALSIFIED/INVALID verdict" with
  no propose/run hint.
- **Verified clean:** the re-scoped skill (both copies); `test-append-dispatch.cjs` (asserts only
  experiment's `working_folder` requirement — no outputs/verdict/role-shape assertions); README
  (neutral); telemetry header; `agent-pool.yaml` (role enum only); register-dispatch
  (`working_folder` row only); §7 debts (carry the 2026-06-15 notes).

## B3 — governance-legitimacy (verbatim summary)

- (i) **MAJOR→DOWNGRADED** — §10.1 requires a version bump for a field/enum/principle/status change;
  doc is `0.6.0-proposal`, only dated notes added. Verifier downgraded: §10.1's typo/prose carve-out
  plausibly covers annotating an already-LIVE type (no field/enum/status changed).
- (ii) §10.2 five-surface — PARTIAL/UNVERIFIED: trigger is "field's conditional"; no enum/column
  changed (conceded out of scope on a literal read), but the close-semantics conditional changed —
  declare tests green / no code surface touched. (Verifier: tests confirmed clean.)
- (iii) **MAJOR (UPHELD)** — the §7 2026-06-14 persistence debt was reasoned on "a close row's
  FALSIFIED/SURVIVED is uninterpretable …" — i.e. it ASSUMED this dispatch closes on a verdict. The
  re-scope falsifies that premise; §7's promotion rule prescribes a proponent×skeptic re-
  confrontation, not an inline scope note.
- (iv) **UPHELD** — dated owner-decision notes ARE an established mechanism (§9; §5 review;
  invoked_by), but §10 (LANDED 2026-06-15) retired the in-place practice for surface changes —
  post-§10 a lifecycle change also needs a bump + versioned row. Authority fine; process incomplete.

## Verifier (zig-zag skeptic) — verdicts

UPHELD: B1, B1c, B2-MAJOR1, B2-MAJOR2, B2-MINOR3, B2-clean, B3-iii, B3-iv. **REFUTED:** B1b (the
persistence note DOES carry a back-pointer — it re-cites the MAIN's deferred pointer+hash).
**DOWNGRADED:** B3-i (doc is at 0.6.0-proposal; re-scope of an already-LIVE type plausibly falls
under §10.1's annotation carve-out, not an unbumped surface change). Strongest surviving: B1 (literal
stale `designer→runner` clause) and B2-MAJOR1/MAJOR2 (discovery doc + line 180 assert the old model,
superseded only by adjacent notes).
