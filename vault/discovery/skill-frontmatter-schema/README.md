---
tags: [vault, ontology, skills, frontmatter, schema, registry, governance, readme]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.0.1
last_updated: 2026-05-26
---

# skill-frontmatter-schema

## Charter

This discovery will examine the typed-artifact surface every skill under `.claude/skills/<name>/` should conform to — what its `SKILL.md` frontmatter must declare, what edges it must carry to constitutions and to operational schemas, what justification artifact backs it, and how it must appear in a registry so dispatches can be observed and bound to their governance. The question is broad on purpose: **what is the schema of a skill, such that skills are uniformly accessible, observable, and bound to their constitutions?** The folder holds no answer yet. The `/research` dispatch that will produce `discovery.md` + `lenses/` is upstream of the items in [backlog.md](backlog.md).

## Scope

**In scope.** SKILL.md frontmatter shape (required and optional fields, controlled vocabularies); edge contract from a skill to (a) its constitution(s) and (b) operational schemas it produces or consumes; the per-skill justification artifact (typed document with schema'd frontmatter + prose body); registry presence — what a skill must declare to be a row in the slowly-changing skills dim table proposed in [domainspec-theorem/theorem/sessions/2026-05-26-2039-skills-schema-dim-event.md](../../../domainspec-theorem/theorem/sessions/2026-05-26-2039-skills-schema-dim-event.md); telemetry hook names attached to the skill.

**Out of scope.** The dispatch event-table (`agent-research.yaml`) and the FK chain into per-agent files — that surface belongs to a separate, sibling concern about runtime observability, not skill typing. The vault-side bidirectional citation contract and drift correction across constitution amendments are deferred to the sibling discovery `vault-linkage-discipline-and-drift-correction/` (not yet filed). Migration mechanics for retrofitting today's ~20 skills to the eventual schema are downstream of this discovery's `discovery.md`.

## Adjacent prior art

- [agent-skill-categorization/README.md](../agent-skill-categorization/README.md) — already proposes faceted frontmatter axes (`prefix` / `role` / `tool-surface`) for internal typing of agents and skills. This discovery **extends** that work along two axes it does not cover: outbound edges (to constitutions and to operational schemas) and registry binding. Position: extension, not duplication; the role-vocabulary question (its OQ-1) remains a dependency, not a replay.
- [documents-metadata-enforcement/README.md](../documents-metadata-enforcement/README.md) — names the gap between declared metadata rules and runtime enforcement for vault documents. The skill-side analogue is the gap this discovery will close: skills today have no schema'd frontmatter that a linter could check.
- [harness-as-enforcement-layer/README.md](../harness-as-enforcement-layer/README.md) — establishes that the harness, not the prompt, is where invariants become operational fact. A typed skill-frontmatter schema is only load-bearing if some layer consumes it; the harness discovery names that layer.
- [../../constitution/schema-amendment-discipline-constitution.md](../../constitution/schema-amendment-discipline-constitution.md) — governs how the eventual frontmatter schema must record its own evolution. The schema produced downstream of this discovery is itself a schema document under §1 of that constitution.
- [domainspec-theorem/theorem/sessions/2026-05-26-2039-skills-schema-dim-event.md](../../../domainspec-theorem/theorem/sessions/2026-05-26-2039-skills-schema-dim-event.md) — one input among several: proposed a dim/event split for the registry and an FK-vs-path discipline. Treat as a candidate, not a settled design.
- [domainspec-theorem/theorem/sessions/2026-05-27-0030-research-skill-discovery-iteration.md](../../../domainspec-theorem/theorem/sessions/2026-05-27-0030-research-skill-discovery-iteration.md) — prior session that surfaced the split into two discoveries and the style anchor.

## Open sub-questions

The `/research` dispatch will answer these; the README only states them.

1. What fields are **required** in a skill's frontmatter, and what controlled vocabularies bind each one? In particular: how does this relate to (without re-deciding) the `role` axis open in agent-skill-categorization OQ-1?
2. How does a skill declare its **operational schemas** (the `*.schema.yaml` files it produces or consumes)? Is co-location under `.claude/skills/<name>/` part of the contract or an ergonomic default?
3. How does a skill declare its **constitution binding** — by ID (joining a constitutions dim row) or by path? What happens on constitution amendment under [schema-amendment-discipline-constitution.md](../../constitution/schema-amendment-discipline-constitution.md)?
4. What is the **justification artifact** — its frontmatter shape, prose-body expectations, and the rule for what justifies a skill's existence beyond its description?
5. What must a skill declare to be a **registry row** in `.claude/registry/skills-schema.yaml` (PK, edges, telemetry hooks)? Which fields are derived vs authored?
6. What does **non-conformance** mean operationally — advisory lint, blocking lint, or harness-enforced? (Reads against [harness-as-enforcement-layer/](../harness-as-enforcement-layer/) and [documents-metadata-enforcement/](../documents-metadata-enforcement/).)

## Backlog

Work that must complete before the `/research` dispatch can be composed and run is tracked in [backlog.md](backlog.md).
