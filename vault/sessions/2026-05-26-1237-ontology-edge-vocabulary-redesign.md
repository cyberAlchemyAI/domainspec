---
tags: [vault, ontology]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-05-26
timestamp: 2026-05-26T12:37:51-0300
expires: 2026-07-25
conversation_id: ~
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: [vault/ontology-conventions.md]
expected_importance: 8
importance_rationale: "Session produced a structural redesign of Appendix C and introduced the surfaces-conflict edge, both load-bearing for every future vault node that uses edges."
created_by: victorboscaro@gmail.com
---

# Ontology Edge Vocabulary Redesign

## Summary

Session started with two editing tasks on `PRODUCT-COMPONENTS-IDEA.md`: add an introduction with business-philosopher tone (problem before thesis) and add `created_by` to the frontmatter schema. Both were done and propagated to `vault/ontology-conventions.md` and the frontmatter cheatsheet. The session then evolved into a design review of whether session edges should be separated from formalized ontology edges — a research subagent confirmed the distinction is established in PROV-O and SEM, and a three-round adversarial review loop with two independent subagents produced a signed-off design. The outcome is a rewritten Appendix C replacing the old universal/document-specific/session-specific split with three semantically distinct categories (epistemic / provenance / reference), and a new `surfaces-conflict` edge filling the gap between `opens-question` and `refutes`.

## Contradictions

- Supersedes the prior Appendix C three-category split (universal / document-specific / session-specific) in `vault/ontology-conventions.md` — replaced by epistemic / provenance / reference.

## Files touched

- `PRODUCT-COMPONENTS-IDEA.md`
- `vault/ontology-conventions.md`
- `.claude/skills/custom/frontmatter.md`

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `PRODUCT-COMPONENTS-IDEA.md` | `modifies` | Session added a business-philosopher introduction and propagated `created_by` frontmatter field to this file. |
| `vault/ontology-conventions.md` | `modifies` | Session rewrote Appendix C (replacing universal/document-specific/session-specific split with epistemic/provenance/reference) and propagated the `created_by` field addition. |
| `.claude/skills/custom/frontmatter.md` | `modifies` | Session added `created_by` to the frontmatter cheatsheet schema. |
