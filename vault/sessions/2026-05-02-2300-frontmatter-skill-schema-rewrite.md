---
tags: [vault, ontology, skills, frontmatter]
node_type: conceptual
is_session: true
layer: ontology
nature: procedural, reference
status: active
created: 2026-05-02
timestamp: 2026-05-02T23:00:00-03:00
expires: 2026-07-01
conversation_id: frontmatter-skill-schema-rewrite-2026-05-02-2300
decisions_made: true
contradictions_found: true
specs_updated: [.claude/skills/custom/frontmatter.md]
promoted_candidates: []
expected_importance: 5
importance_rationale: "Iterative refinement of the frontmatter skill into a flat field reference; one rule from the prior session was reverted in the simplification, which is worth recording even though no new ontology rules were ratified."
---

# Frontmatter Skill — Schema-Reference Rewrite

## Summary

Continued from the 2230 session by reviewing its arc and then iterating three times on `.claude/skills/custom/frontmatter.md`. First added a MANDATORY "frontmatter is line 1" rule; second consolidated the two MANDATORY sections into a single "Document structure" numbered list (frontmatter → title → Objective → body → Connections, with the bidirectional-edge rule absorbed into step 5); third, after the user pushed back on the template, stripped the file to a pure schema reference — one section per field with meaning, allowed values, and per-value meaning, dropping the template, the document-structure rules, and the node_type challenge-response picker (which duplicated constitutional content). Net effect: a leaner reference, but the "frontmatter is line 1" rule introduced earlier in the same chat was lost in the final simplification.

## Contradictions

- **questions** `2026-05-02-2230-ontology-evolution-edge-catalog-and-skills.md` — that session APPROVED a frontmatter.md update that included a MANDATORY "frontmatter on top / Objective first / Connections last" structural rule; this session's final pass stripped those rules out, leaving structural guidance only in `vault/ontology-conventions.md`. Not a regression in policy (the constitution still holds it), but the skill no longer surfaces it.

## Files touched

- .claude/skills/custom/frontmatter.md
- vault/sessions/2026-05-02-2300-frontmatter-skill-schema-rewrite.md
