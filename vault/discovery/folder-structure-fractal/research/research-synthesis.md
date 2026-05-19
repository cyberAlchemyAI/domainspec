---
tags: [vault, research-synthesis, folder-structure-fractal]
node_type: research-synthesis
is_session: false
layer: ontology
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Research Synthesis — Folder Structure Fractal

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Codify, from 10 lens findings, whether the vault's folder layout should encode the schema/instance distinction at the directory level, whether that encoding should be recursive (fractal) or restricted to the top level, and what migration discipline applies.

## Context

The current vault carries no constitution that governs its own folder shape: the file named `folder-structure-constitution.md` governs the FIDC product code, not the vault. Cross-vault drift across the three sibling repos is mechanically uncaught despite byte-identical constitution files. The maximal proposal — recursive `Unit ::= README schema/ instance/ lenses/` at every depth + top-level `schema/`/`instance/` split + `layer:` frontmatter validator — was dispatched against this gap and then attacked from three independent angles.

## What Was Found

- The maximal recursive proposal does not survive: three Wave-2 evaluators using adversarial, cost, and long-term framings converged on the same narrowing — keep the top-level split + `layer:` validator + per-type slot rules; defer the recursive mirror and the Unit-everywhere grammar (see `research.md#theme-1-convergent-narrowing`).
- The apparent fatal conflict with `discovery-structure-constitution.md` §1 dissolves under the narrowing: discoveries gain no `schema/`/`instance/` slots, so §1's "no other subfolders" is preserved verbatim (see `research.md#theme-2-the-constitution-conflict`).
- Migration cost is ~37 h full vs ~14 h partial for ~80% of the benefit (112 file moves, ~900 path-reference rewrites, ~50–70 LoC tool changes); the cost asymmetry favors partial adoption (see `research.md#theme-3-cost-asymmetry`).
- Cross-repo rollout is blocked: the five repos are not five instances of the same shape, and drift detection without a canonicalization protocol is half a feature (see `research.md#theme-4-cross-repo-blocked`).
- Convention novelty (no surveyed system enforces schema/instance at the folder level) cuts both ways — opportunity per lens 03, risk-signal per lens 04 A7 (see `research.md#theme-5-prior-art-novelty`).

## Decisions Taken

- Adopt narrowed top-level split + `layer:` validator + per-type slot rules; defer recursive mirror (`../discovery.md#d-1`).
- Block cross-repo rollout pending canonicalization protocol (`../discovery.md#d-2`).
- Drop the S5/Russell-dodge and Kauffman framings from the load-bearing justification (`../discovery.md#d-3`).
- Decline to encode reflection-tower levels as folders (`../discovery.md#d-4`).

## Implications

- Constitution follow-up: write `vault-folder-structure-constitution.md` at `draft`, land `layer:` validator in code before any file moves, execute the 7-step amendment cascade.
- Cross-repo follow-up: dispatch a separate discovery for the schema-canonicalization protocol before any coordinated migration.
- Convention follow-up: lens 07 is a proto-`research.md` written inside the lens layer — surface as a convention-amendment question.
- Empirical re-evaluation: revisit deferred items at 1k files or when `vault_ctl walk` starts case-splitting.

## Open Questions

- Sessions ever promoted to Unit? Recommend: stay leaf (OQ-1).
- Premise/axiom → unified `claims/`? Recommend: defer to `epistemic-chain.md` OQ-6 (OQ-3).
- Cross-repo canonicalization owner? Recommend: separate discovery (OQ-4).

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`

## Connections

- `derives-from` → `research.md`
