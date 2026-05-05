---
tags: [vault, ontology, axioms, premises, domainspec, methodology]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-05
timestamp: 2026-05-05T11:47:21-03:00
expires: 2026-07-04
conversation_id: domainspec-axioms-foundation-2026-05-05
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: [vault/axiom/domainspec-axioms.md, vault/premise/domainspec-premises.md]
expected_importance: 8
importance_rationale: "Establishes the foundational axiom/premise layer for the DomainSpec methodology (4 axioms, 13 premises) with explicit operationalization gaps tracked, plus the formal promotion of P-SYS-3 to AX-DS-1."
---

# DomainSpec Axioms + Premises Authoring

## Summary

Authored the foundational axiom and premise layer for the DomainSpec methodology after auditing what is currently operational vs aspirational. Subagent audits demoted candidate axioms about categorical extraction (L1/L2/Δ) and structural-correspondence verification to premises — L2/Δ extractors are stubs and L1 has only one manual run with no CI. Promoted `P-SYS-3 — Code is the Compiled Output of Documentation` to `AX-DS-1` with a Data-Processing-Inequality formalization, then iterated on file structure: main per-axiom is now strictly Context + Operationalization, with Math/extensions/references in per-axiom appendix blocks. Added `P-DS-12` (brownfield translation gap) and `P-DS-13` (`@biz` enforcement gap, confirmed by audit) to track open obligations against AX-DS-1's boundary condition and AX-DS-2's coverage requirement respectively.

## Contradictions

- validates `vault/premise/system-premises.md` — `P-SYS-3` was strong enough to promote to `AX-DS-1` with formal DPI grounding; preserved in place for provenance with explicit "promoted on 2026-05-05" note.
- validates `vault/constitution/domain-tagging-constitution.md` — cited as the declared `@biz` anchor contract by `AX-DS-2` Operationalization; current `status: draft` and the missing `internal_tools.semantic_index` validator are the operationalization gap recorded as `P-DS-13`.

## Files touched

- vault/axiom/domainspec-axioms.md
- vault/premise/domainspec-premises.md
- vault/premise/system-premises.md
- vault/axiom/system-axioms.md
- vault/axiom/ontology-axioms.md
- vault/premise/ontology-premises.md
- vault/premise/domainspec-subagents-strategy-premises.md
- vault/constitution/domain-tagging-constitution.md

## Connections

> Forward-only by source per `vault/ontology-conventions.md` §8: this is a session node (`is_session: true`), so no inverse rows are written on the target documents.

| Document | Type | Description |
|----------|------|-------------|
| `vault/axiom/domainspec-axioms.md` | `creates` | This session authored the foundational DomainSpec axioms file (4 axioms incl. AX-DS-1 promoted from P-SYS-3). |
| `vault/premise/domainspec-premises.md` | `creates` | This session authored the foundational DomainSpec premises file (13 premises incl. P-DS-12 brownfield gap and P-DS-13 `@biz` enforcement gap). |
| `vault/axiom/system-axioms.md` | `modifies` | This session edited the system axioms file as part of cross-axiom alignment with the new DomainSpec axiom layer. |
| `vault/axiom/ontology-axioms.md` | `modifies` | This session edited the ontology axioms file as part of cross-axiom alignment with the new DomainSpec axiom layer. |
| `vault/premise/ontology-premises.md` | `modifies` | This session edited the ontology premises file as part of cross-premise alignment with the new DomainSpec premise layer. |
| `vault/premise/domainspec-subagents-strategy-premises.md` | `modifies` | This session edited the subagents-strategy premises file as part of cross-premise alignment with the new DomainSpec premise layer. |
