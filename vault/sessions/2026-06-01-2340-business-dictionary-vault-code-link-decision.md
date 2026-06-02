---
tags: [domainspec, dictionary, glossary, ubiquitous-language, vault, code-binding, residue, adlc, meta-track]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory
status: active
created: 2026-06-01
timestamp: 2026-06-01T23:40:00-03:00
expires: 2026-07-31
conversation_id: 2026-06-01-business-dictionary-vault-code-link-decision
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "Records the decision naming the business dictionary as the canonical typed vault↔code link and the only framework-added layer (typed term→code residue), gating future binding/codification work — but stays a design-level proposal with nothing measured or built."
---

# Business Dictionary as the Typed Vault↔Code Link — Decision

## Summary

A conceptual conversation (no implementation code written in domainspec) that sharpened the coalgebra/residue intuition — in `c : X → F(X)`, `F` is the outermost type constructor on a step's return (not the pipeline), a "feature" is the carrier `X` (a typed graph / Schema), the define→…→validation pipeline is a staged tower, and the spec→code seam has no typed link so its residue is currently unmeasurable. From that frame the session reached a DECISION: the business dictionary (dicionário de negócios) is the canonical typed link between the vault knowledge graph and the code. The dictionary itself is ADOPTED prior art — Eric Evans, *Domain-Driven Design* (2003), Ubiquitous Language + Glossary — over the repo's existing scaffolding (`docs/glossary.md`, `ADLC-ALIGNMENT.md` gap G11 + Meta-Track `@biz`/`@sys` T8–T10, the `domain-dictionary` skill); the ONLY novel layer is typing the term→code edges so binding failures become measurable residue (two terms→one symbol = collapse/FF flavour; symbol with no term = orphan/EssSurj flavour, i.e. the Meta-Track orphan/unanchored pair re-typed). Subset-rule note: nothing is measured, proven, or built — measurability is design intent only; the `grounds` edge is PROPOSED only, and OQ-5 flags that the name collides with a deprecated Appendix-C edge, to be resolved in a downstream codification discovery. The only artifact produced was the discovery node below (a decision-record + open questions); no ontology/glossary/ADLC file was edited, since schema evolution flows only through discoveries. A sibling premise node and close-session were created cross-repo in `domainspec-theorem` as the upstream of this decision.

## Files touched

- vault/discovery/business-dictionary-vault-code-link/discovery.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/business-dictionary-vault-code-link/discovery.md` | `creates` | This session newly authored the decision-record discovery; the file did not exist before this sitting. It records the business-dictionary-as-typed-link decision plus open questions (incl. OQ-5 on the `grounds` name collision), editing no schema. |
