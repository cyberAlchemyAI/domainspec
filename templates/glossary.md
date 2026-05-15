---
feature: { feature-name }
version: current
status: draft
updatedAt: { date }
docType: glossary
---

# Glossary: {Feature Name}

Quick-reference glossary of feature language and concepts distilled from the feature specification and aspect documents.

Scope note: This glossary explains what feature terms mean in ordinary product language first, then links each formal concept back to its authoritative source. Authoritative behavior, fields, rules, and lifecycle contracts remain in the linked source documents.

## Feature Language

<!--
Use this section for important words a reader needs before formal concept rows make sense.
These may be noun phrases embedded inside concepts, rules, states, or operations.
Example: if a concept says BaselineProvenance, explain "Baseline" here.
-->

| Term         | Meaning in this feature                                                                           | Related Concepts                      |
| ------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------- |
| {Plain Term} | {Plain-language explanation of what the word means in this feature and why users/operators care.} | [{ConceptName}]({source}.md#{anchor}) |

## Terms

| Term          | Concept ID                     | Type        | Definition                           | Source                              |
| ------------- | ------------------------------ | ----------- | ------------------------------------ | ----------------------------------- |
| {ConceptName} | `{feature-name}.{ConceptName}` | {Meta-type} | {One concise domain-level sentence.} | [{source}.md]({source}.md#{anchor}) |

## Cross-Feature Terms

| Term                  | Concept ID                      | Type        | Definition                                                        | Source                                                                    |
| --------------------- | ------------------------------- | ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| {ExternalConceptName} | `{other-feature}.{ConceptName}` | {Meta-type} | {One concise sentence explaining how this feature uses the term.} | [../{other-feature}/{source}.md](../{other-feature}/{source}.md#{anchor}) |

## Maintenance Rules

- Use Feature Language for important words that appear inside formal concepts, especially when the word is not obvious outside this feature.
- Derive formal concept rows from `SPEC.md` Concept Registry and any aspect-level concept registries.
- Keep each formal concept definition to one domain-level sentence, but make the sentence teach the term rather than repeat the source table.
- Link every entry to the authoritative source anchor.
- Update this glossary whenever concept names, concept IDs, source anchors, or definitions change.
- Do not introduce new canonical behavior here; update the source aspect document first.
