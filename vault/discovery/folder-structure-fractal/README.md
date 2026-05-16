---
tags: [vault, discovery, ontology, folder-structure, fractal]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.1
last_updated: 2026-05-16
veracidade: low-medium
convicção: medium
---

# Folder Structure Fractal

## What is this?

Discovery folder exploring whether the vault's folder structure should be made **fractal** (one recursive grammar `Unit ::= README.md schema/ instance/ lenses/` at every depth) and **two-layer-guaranteed** (top-level sibling separation `vault/schema/` vs `vault/instance/`, mirrored at every Unit, with frontmatter `layer:` as the redundant validating invariant).

## Business Context

The vault currently mixes schema-layer artifacts (constitutions, ontology-conventions, confidence-levels) with instance-layer content (discoveries, premises, sessions, bets, amendments) under one `vault/` root. The framework's S5 invariant (schema lives outside the graph) holds at the frontmatter level but not at the folder level. The existing `folder-structure-constitution.md` was discovered (lens 01) to govern the FIDC product *code* repo — not the vault. No vault-folder constitution exists; cross-vault folder drift across domainspec / house_project / maestro-trama is uncaught.

## Why it matters

The framework's central claim is form-invariance across scales. If the folder layout violates that claim at its own root, the framework is performatively contradicted by its own substrate. The proposal — if it survives Wave 2 — would make the two-layer structure visible at the directory level, close the S5 gap, and stop cross-vault drift. The discovery also establishes that this combination is **genuinely without prior art** (Roam, Obsidian, Logseq, Zettelkasten, Semantic MediaWiki, Antinet all do partial versions).

## 📁 Navigation

- [lenses/01-prior-research-catalog.md](lenses/01-prior-research-catalog.md) — What's already decided, debated, contradicted; the FIDC-misnaming finding; live contradictions; cross-vault drift documented.
- [lenses/02-fractal-folder-theory.md](lenses/02-fractal-folder-theory.md) — Concrete proposal: grammar, top-level layout, recursive Unit shape, migration map for every existing folder.
- [lenses/03-external-prior-art.md](lenses/03-external-prior-art.md) — Survey of 13 knowledge-management systems; what /domainspec should borrow vs invent; the novelty verdict.
- [lenses/04-adversarial-attack.md](lenses/04-adversarial-attack.md) — Wave 2 adversarial review of the proposal.
- [lenses/05-migration-cost-estimate.md](lenses/05-migration-cost-estimate.md) — Wave 2 real migration-cost estimate on the current /domainspec vault.
- [lenses/06-long-term-cross-repo.md](lenses/06-long-term-cross-repo.md) — Wave 2 long-term scale + cross-repo (1000+ files, 5 vaults) evaluation.
- [lenses/07-wave-2-synthesis-and-verdict.md](lenses/07-wave-2-synthesis-and-verdict.md) — Wave 2 synthesis and verdict on whether the proposal survives.
- [lenses/deepest-thing-empirical.md](lenses/deepest-thing-empirical.md) — Empirical-cut probe into the deepest finding.
- [lenses/deepest-thing-historical.md](lenses/deepest-thing-historical.md) — Historical-cut probe into the deepest finding.
- [lenses/deepest-thing-structural.md](lenses/deepest-thing-structural.md) — Structural-cut probe into the deepest finding.

## Claim

The vault's folder structure should be **fractal** (one recursive grammar at every depth, after Kauffman's `K = K{K K}K`) and **two-layer-guaranteed** (top-level sibling separation, mirrored at every Unit, with frontmatter `layer:` as the redundant validating invariant). This honors S5 at the folder level, makes form-invariance visible in directory layout, and is novel by construction relative to the knowledge-management literature.

## Status

Exploratory. Wave 1 (lenses 01–03) complete. Wave 2 (lenses 04–07) complete. Movement requires: if proposal survives evaluation, draft `vault-folder-structure-constitution.md` and a migration script; estimate true cross-repo migration cost; decide whether the proposal's benefits pay down its migration costs.

## Summary

Four findings from Wave 1 reshape the question.

**(1) Greenfield, not amendment.** The file at `vault/constitution/folder-structure-constitution.md` actually governs the FIDC product *code* repo, not the vault. No vault-folder constitution exists.

**(2) S5 is violated at the folder level.** The Russell-dodge holds at the frontmatter level but not at the folder level. Visible separation would close this gap.

**(3) Cross-vault drift uncaught.** domainspec, house_project, maestro-trama ship byte-identical `folder-structure-constitution.md` but their actual folder layouts diverge (`sessions/` vs `conversations/`, `audits/` only in house_project, `bets/` only in domainspec). Nothing checks folder shape against any spec.

**(4) The proposal is genuinely without prior art.** Lens 03 surveyed 13 systems. **Nobody combines explicit schema/instance separation at folder level + recursive Unit shape + constitution-as-first-class-node.** Closest precedents (Semantic MediaWiki's Property namespace; Wikipedia's admin/content category split; Antinet's two-layer-root + fractal-subtree) all do partial versions.

The concrete proposal (lens 02): top-level `vault/schema/` and `vault/instance/` as siblings; the `Unit` grammar applied recursively; frontmatter `layer:` as the redundant validating invariant. Hardest cases: sessions break the Unit shape (time-flat, not nested); `amendments/` and `backlog/` are genuine residues; cross-repo migration cost is unestimated.

## Open Questions

- Does the proposal survive adversarial attack (Wave 2 E1)?
- What is the real migration cost on the current /domainspec vault (Wave 2 E2)?
- Does it scale to 1000+ files and work uniformly across the 5 vaults (Wave 2 E3)?
- **Sessions are time-flat, not Unit-shaped** — exempt them, or rebuild them as thin Units with frontmatter-only schema/instance markers?
- **How does `layer:` frontmatter interact with `node_type` taxonomy?** Is `layer` derivable from `node_type`, or are they orthogonal?
- The `discovery-structure-constitution`'s "no other subfolders" rule and the proposal's recursive Unit `schema/`/`instance/`/`lenses/` are in tension. Which wins?

## Next Moves

- Wave 2 evaluators dispatched; integrate as lenses 04, 05, 06; verdict in 07.
- If proposal survives Wave 2 without fatal objection: draft `vault/constitution/vault-folder-structure-constitution.md`.
- Draft `vault/migrations/v1-to-v2-folder-restructure.py` and run `--dry-run` against /domainspec to produce the true migration cost.
- Apply to /domainspec first; record cross-repo migration as separate per-repo work under R2 discipline.
- This proposal, if adopted, would itself be a new constitution governed by the R2 discipline — meta-recursion intentional.
