---
tags: [vault, research-synthesis, graph-as-residue-attractor]
node_type: research-synthesis
is_session: false
layer: ontology
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Research Synthesis — Graph as Residue Attractor

> **Word budget: ≤500 words below this line. Hard cap.**

## Objective

Codify, from 7 lens findings, whether the graded knowledge graph is the within-level attractor of two-layer residue accounting on knowledge curation — separating math from metaphor from empirical bet.

## Context

Four independent conversations across four repositories landed on the same graded-graph construction in one hour. The two-layer framework in `/domainspec-theorem` reframed that convergence as a question: is the graph a design choice or the only stable shape under double-residue accounting? Every downstream design depends on the answer.

## What Was Found

- The original "unique fixed point" formulation is refuted by Lawvere's diagonal applied to a binary truth-object; the corroborated reflection-tower reformulation survives (see `research.md#theme-2-reflection-tower-reformulation`).
- Yoneda is load-bearing in exactly three places (M2 representability, M6′ base case, forced node-identity), not "everywhere" (see `research.md#theme-3-yoneda-load-bearing-ness`).
- Kauffman's reflexive-domain program already publishes the synchronic four-component synthesis (form-as-conserved + fractal + strange-loop + emergence-via-residue); novelty narrows to the diachronic tower + Spivak two-layer split + RG/Noether framing (see `research.md#theme-4-kauffman-precedent`).
- EVōC's persistence hierarchy is a plausible geometric realizer of condensation, and lens 04's "embeddings as restricted Yoneda" gives the bridge a categorical justification (see `research.md#theme-5-evoc-relevance`).
- Twelve schema and twelve instance invariants align except at four flagged residues (convicção, schema-meta evolution, derives-chain circularity, governs-edges enforcement); S7/S12 lack uniqueness sketches (see `research.md#theme-6-layer-alignment`).

## Decisions Taken

- Adopt within-level-attractor / reflection-tower formulation (`../discovery.md#d-1`).
- Treat lens 03 as load-bearing only via the corroborated 03b/03c re-runs (`../discovery.md#d-2`).
- Reposition novelty per Kauffman precedent: three pieces, not four-component synthesis (`../discovery.md#d-3`).
- Name the three Yoneda load-bearing places explicitly (`../discovery.md#d-4`).
- Use per-claim inline flags, no document-level confidence score (`../discovery.md#d-5`).

## Implications

- Spec follow-up: write structure-theorem in reflection-tower form against a concrete small category extracted from the vault.
- Empirical follow-up: prototype the EVōC pipeline on an existing vault.
- Backlog: promote each of the four flagged residues to a `vault/premise/` file with a falsification test.
- Citation gate: any axiom-grade promotion of the reflection-tower-as-novel claim is blocked until the Kauffman 2009 *Constructivist Foundations* paper is obtained.

## Open Questions

- Is the transfinite reflection tower exactly iterated Yoneda? Recommend: define in both forms, prove on a worked example (`../discovery.md#open-questions` OQ-1).
- Do the four predicted residues empirically generate new constitutions in the next month? Recommend: promote and audit at +30d (OQ-2).
- Does M2 representability hold for the GKG's specific category? Recommend: encode the small example in Lean (OQ-3).
- What is the right truth-object $Y$ per tower level? Recommend: start with stage-lattice, lift if too coarse (OQ-4).

## Read More

- Full analysis: `research.md`
- Discovery commitments: `../discovery.md`
- Lens findings: `../lenses/`

## Connections

- `derives-from` → `research.md`
