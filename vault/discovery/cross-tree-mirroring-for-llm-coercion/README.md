---
tags: [vault, discovery, ontology, folder-structure, l1-l2, llm-coercion, cross-tree]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.0
last_updated: 2026-05-18
veracidade: medium
convicção: medium-high
---

# Cross-Tree Mirroring for LLM Coercion

## What is this?

A discovery proposing three top-level repo siblings — `/research`, `/domain_knowledge`, `/implementation` — with a shared `apps/X/features/Y/` grammar mirrored between L₁ (knowledge) and L₂ (code), and two distinct operations: **promotion** (residue → L₁) and **compilation** (L₁ → L₂). Extends `folder-structure-fractal/` from vault-internal layout to the cross-tree case.

## Why it matters

DomainSpec's originating engineering question is "can I force LLMs to write the right code?" A computable spec-lookup path is the precondition: if an agent editing code at any path can mechanically compute the path of its governing spec, "right" becomes checkable. Today's repos do not provide that — maestro-trama has 50+ broken cross-references where the editing agent invented a plausible path because no structural rule pinned the real one.

## Status

Exploratory. Four lenses complete (vault prior-art, theorem anchors, maestro-trama evidence, adversarial). Adversarial review forced narrowing: T0' demoted from gate to long-term aspiration, "coercion" demoted to "navigational signal + validator enforcement," scope narrowed to `/domainspec` + maestro-trama-shaped repos.

## 📁 Navigation

- [discovery.md](discovery.md) — full discovery with Decisions, Alternatives, Open Questions.
- [lenses/01-vault-prior-art.md](lenses/01-vault-prior-art.md) — what the vault already says about L₁↔L₂ mirroring, OQ-4, LLM-forcing, and research-as-staging.
- [lenses/02-theorem-anchors.md](lenses/02-theorem-anchors.md) — formal grounds from `domainspec-theorem`: two-layer is locked, residue is dynamic, Δ is a Left Kan extension, T0' as admissibility, promotion ≠ compilation.
- [lenses/03-maestro-trama-evidence.md](lenses/03-maestro-trama-evidence.md) — exhaustive asymmetry inventory in the pilot repo: orphans, collisions, broken links, empirical classification, missing promotion policy.
- [lenses/04-adversarial-attack.md](lenses/04-adversarial-attack.md) — hostile review of the proposal; five landing attacks + two partial; concessions folded into discovery's Decisions.

## Claim

The three-sibling structure with mirrored L₁/L₂ grammar is the smallest layout that (a) honors the two-layer theorem, (b) gives residue a legitimate home, and (c) provides a structurally-computable spec-lookup path for code-editing agents — which is the precondition for any future LLM-coercion mechanism. The discovery does **not** claim coercion is achieved by structure alone; that claim is parked behind OQ-1's measurement plan.

## Open Questions

- OQ-1: Falsification test for the LLM-coercion claim.
- OQ-2: Naming (`/research` vs `/discovery`, etc.).
- OQ-3: Demotion mechanics (L₁ → `/research`).
- OQ-4: T0' operationalization (when does it become an actual gate?).
- OQ-5: Cross-repo applicability to non-pilot repos.
- OQ-6: `business-philosopher/` placement in maestro-trama.
- OQ-7: Generated content (embeddings, LLM drafts).

## Next Moves

- If proposal survives further review: draft `vault/constitution/cross-tree-mirroring-constitution.md` and a path-coherence validator extending the existing `layer:` mechanism.
- Concrete pilot on maestro-trama (D-6); estimated 20–30h migration.
- Separate measurement discovery for OQ-1 before promoting the strong LLM-coercion claim.
