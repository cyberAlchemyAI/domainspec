---
description: Minimal frontmatter reference for creating any new .md file in the vault
---

# Frontmatter Cheatsheet

## MANDATORY — every document starts with `## Objective`

After the frontmatter block, the first section of **every** `.md` file must be `## Objective` — one short paragraph stating what the document is for and what question it answers. No exceptions: axioms, specs, backlogs, READMEs, discoveries, conversation notes. If you cannot write the objective, you do not yet know what the document is, so write the objective.

```markdown
---
{{frontmatter}}
---

# {{Document Title}}

## Objective

{{One paragraph: what this document is for and what question it answers.}}

{{...rest of the document...}}
```

## Schema

```yaml
---
tags: []
node_type: axiom | premise | constitution | discovery | implementation-plan | spec | audit | conceptual | essay | test | backlog | readme
is_session: true | false
layer: ontology | architecture | market | domain | application  # multi-value OK
nature: explanatory | procedural | reference | technical  # multi-value OK
status: draft | exploratory | active | consolidated | evergreen
veracidade: high | medium | low  # only for: axiom, premise, discovery, audit, essay
convicção: high | medium | low   # only for: axiom, premise, discovery, audit, essay
version: 0.x.x
last_updated: YYYY-MM-DD
---
```

## `node_type` picker

"If challenged, the right response is..."

| node_type | Challenge response |
|-----------|-------------------|
| `axiom` | "Foundational — revisiting it breaks everything built on it" |
| `premise` | "Show me evidence and we'll update it" |
| `constitution` | "Change it through governance, not informally" |
| `discovery` | "Exploration — enrich it or supersede it with a decision" |
| `implementation-plan` | "Follow it, update it if scope changed, or supersede it" |
| `spec` | "Update it if the code changed" |
| `audit` | "Run the audit again and see if findings still hold" |
| `conceptual` | "Context — enrich or correct it" |
| `essay` | "Committed argument from experience — engage with the reasoning or counter it with a better one" |
| `test` | "Run the tests and see if they pass" |
| `backlog` | "Prioritize it, schedule it, or close it" |
| `readme` | "Update it to reflect what's in the directory" |

## Field quick rules

- `layer` and `nature` support multi-value: `layer: architecture, domain`
- Start `status` at `draft`
- Omit `veracidade` and `convicção` for: `constitution`, `spec`, `implementation-plan`, `conceptual`, `test`, `backlog`, `readme`
- `is_session: true` for conversation/session records, `false` otherwise

> Definition of every tag and value (thin reference): `.claude/skills/custom/frontmatter-semantics.md`
> Full rationale, status lifecycle, and edge type catalog: `docs/vault/ontology-conventions.md`
