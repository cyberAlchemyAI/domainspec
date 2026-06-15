---
tags: [agents, dispatch, anti-bias, preregistration]
node_type: preregistration
is_session: false
layer: meta
nature: reference
status: frozen
version: 1.0.0
last_updated: 2026-06-15
---

# Anti-bias pre-registration — 2026-06-15-constitution-v053-consistency-review

Frozen at register (step 3) from the confirmed sheet. Immutable for the run.
The index `check-tension-realization.cjs` measures returned `Dissent:` lines against.

## Groups

- group: attackers | role: investigate | members: Tarski, Yanofsky, Church
- group: synthesizer | role: synthesize | members: Kleene
- group: verifiers | role: evaluate | members: Russell, Gödel

## Pre-registered tensioned pairs

- pair: Tarski <-> Yanofsky | axis: attack-vector | prediction: They disagree on whether `schema_version "0.5.2"` coexisting with doc `version: 0.5.3-proposal` is a real inconsistency — Yanofsky (mechanics) flags any two differing version strings as a doc-vs-doc mismatch; Tarski (fidelity) holds §10.1 reconciles wire-schema-version vs doc-version.
- pair: Tarski <-> Church | axis: attack-vector | prediction: They disagree on whether §9's "in-place, no version bump" entries still bind after §10 retires that practice — Tarski reads two live conflicting governance rules; Church reads §9 as superseded historical narration that §10 explicitly closes.
- pair: Yanofsky <-> Church | axis: attack-vector | prediction: They disagree on the validator-check.md "pending realignment" note — Yanofsky says the self-disclosed gap leaves no broken internal mechanic; Church says the doc claims that file OWNS the anti-bias semantics yet admits it speaks the removed schema, an ownership claim the referenced doc does not satisfy.
- pair: Russell <-> Gödel | axis: attack-vector | prediction: On any finding of form "Principle X contradicts field Y", Russell confirms iff literally contradictory as quoted; Gödel refutes iff a third clause reconciles. They split on surface-real-but-discharged-elsewhere findings.
