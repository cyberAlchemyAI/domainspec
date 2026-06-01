---
tags: [vault, skills, frontmatter, backlog, dispatch-prep]
node_type: backlog
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.0.1
last_updated: 2026-05-26
---

# skill-frontmatter-schema — Backlog

Tracks the work that must complete before the `/research` dispatch for this discovery can be composed, and the artifacts the dispatch is expected to produce. Each P0 item names a blocker the dispatch composition step cannot route around; each P1 item names a deliverable the dispatch itself will produce.

## P0 — Before dispatch can run

- **Lock the dispatch artifact filename: `dispatch.yaml` vs `subagents-dispatch.yaml`.** The 2026-05-26-2039 session flagged residual "spec.yaml" prose clashing with DomainSpec / conjecture-spec terminology and leaned toward `subagents-dispatch.yaml`; the 2026-05-27-0030 session locked `dispatch.yaml`. Pick one and bake into `dispatch.schema.yaml#$id` before this discovery's composition references it. Source: [domainspec-theorem/theorem/sessions/2026-05-26-2039-skills-schema-dim-event.md](../../../domainspec-theorem/theorem/sessions/2026-05-26-2039-skills-schema-dim-event.md) "Open / Next — P0".
- **Decide composition style: writer↔reviewer loop vs full `/research`.** The 2026-05-26-2039 session leaned full `/research` for both this and the sibling discovery. Confirm before composing. Source: same session, "Open / Next — P0".
- **Decide ordering vs the sibling discovery `vault-linkage-discipline-and-drift-correction/`.** Three options on the table: parallel-with-coordination (writer of this discovery reads sibling L1 explorer outputs before synthesis), sequential sibling→this, sequential this→sibling. Source: same session, "Open / Next — P0".
- **Resolve dependency on [agent-skill-categorization/](../agent-skill-categorization/) OQ-1 (the `role` controlled vocabulary).** The schema this discovery produces cannot conflict with — and should not pre-empt — that vocabulary. Either gate this dispatch on OQ-1 closure, or scope the dispatch explicitly to leave `role` open. Source: [agent-skill-categorization/README.md](../agent-skill-categorization/README.md) OQ-1.
- **Resolve skill-name drift.** [anti-bias-vector-composition/validator-check.md](../anti-bias-vector-composition/validator-check.md) references the skill as `theorem-research`; the implemented skill is `research`. Pick the canonical name and propagate before any dispatch that cites a SKILL.md by name. Source: [domainspec-theorem/theorem/sessions/2026-05-27-0030-research-skill-discovery-iteration.md](../../../domainspec-theorem/theorem/sessions/2026-05-27-0030-research-skill-discovery-iteration.md) "Open design questions".
- **Confirm the discovery file shape: `discovery.md` + `lenses/` (current practice) vs `README.md` (constitution v0.1.1 wording).** The 2026-05-27-0030 session adopted practice-wins. The dispatch must know which artifact name it is writing. TODO: confirm with whoever owns [discovery-structure-constitution.md](../../constitution/discovery-structure-constitution.md) before promote.

## P1 — Dispatch deliverables

The `/research` dispatch will produce these. Each is what `discovery.md` + `lenses/` must contain or downstream artifacts must exist by promote.

- **`discovery.md`** — the answer to the six open sub-questions named in [README.md](README.md). Style anchor: [anti-bias-vector-composition/validator-check.md](../anti-bias-vector-composition/validator-check.md) — concrete, rule-numbered, operational, no floating abstractions.
- **Required frontmatter spec for SKILL.md** — field list, controlled vocabularies, conditional-field rules. Explicit position on whether the agent-skill-categorization `role` axis is required, optional, or deferred.
- **Operational-schema declaration contract** — how a skill points at its `*.schema.yaml` files (`produced_by` / `consumed_by`), and whether co-location under `.claude/skills/<name>/` is part of the contract.
- **Justification artifact spec** — frontmatter fields, prose-body expectations, the rule for what makes a justification load-bearing vs ceremonial. Per the 2026-05-26-2039 session, justification is a typed document (schema'd frontmatter + prose body), not a pure schema.
- **Registry-row spec for `.claude/registry/skills-schema.yaml`** — PK (`skill_id`), edges (`governed_by`, `dispatches`, `invokes`, `relates_to`, `discovered_at`), telemetry hook field names. Which fields are authored in SKILL.md, which are derived at registry-build time.
- **Worked example: rewrite of one existing SKILL.md** — proposed canonical: `/research` itself (since it carries the most structure). Shows the schema applied end-to-end against a real skill.
- **Initial population sketch for `.claude/registry/skills-schema.yaml`** — at least the three or four skills already cited in adjacent prior art (`research`, `research-promote`, `close-session-math`, `anti-bias-vector-composition`).
- **Non-conformance disposition** — explicit answer to sub-question 6: advisory lint vs blocking lint vs harness-enforced. Cites [harness-as-enforcement-layer/](../harness-as-enforcement-layer/) and [documents-metadata-enforcement/](../documents-metadata-enforcement/) for precedent.
- **Amendment-log entry pointer** — once the schema is published, it is a schema document under [schema-amendment-discipline-constitution.md](../../constitution/schema-amendment-discipline-constitution.md) §1, and future edits route through `vault/amendments/`.
